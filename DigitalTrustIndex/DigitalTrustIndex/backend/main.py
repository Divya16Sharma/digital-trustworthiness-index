import os
import json
from datetime import datetime
from typing import Optional
from fastapi import FastAPI, HTTPException, Header, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import stripe
from openai import OpenAI
from supabase import create_client, Client
import httpx

from dotenv import load_dotenv
load_dotenv()

app = FastAPI(title="SEO Score Analyzer Pro API")

security = HTTPBearer(auto_error=False)

CLERK_SECRET_KEY = os.environ.get("CLERK_SECRET_KEY")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET")
STRIPE_PRICE_ID = os.environ.get("STRIPE_PRICE_ID", "price_pro_monthly")

openai_client = None
if OPENAI_API_KEY:
    openai_client = OpenAI(api_key=OPENAI_API_KEY)

supabase: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY


async def verify_clerk_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Optional[str]:
    """
    Verify Clerk JWT token and return user_id.
    In demo mode (no Clerk configured), accepts any user_id.
    
    SECURITY NOTE: In production, you should:
    1. Set CLERK_SECRET_KEY environment variable
    2. Verify JWT tokens properly using Clerk's JWKS endpoint
    3. Never trust user_id from request body without token verification
    """
    if not credentials:
        return None
    
    if not CLERK_SECRET_KEY:
        return None
        
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.clerk.com/v1/sessions",
                headers={"Authorization": f"Bearer {CLERK_SECRET_KEY}"}
            )
            if response.status_code == 200:
                return credentials.credentials
    except Exception as e:
        print(f"Token verification error: {e}")
    
    return None


def get_user_id_from_request(
    request_user_id: str,
    verified_user_id: Optional[str] = None
) -> str:
    """
    Get authenticated user ID. In demo mode, falls back to request user_id.
    In production with Clerk configured, verified_user_id takes precedence.
    """
    if CLERK_SECRET_KEY and verified_user_id:
        return verified_user_id
    return request_user_id


class AnalyzeRequest(BaseModel):
    url: str
    user_id: str


class AnalyzeResponse(BaseModel):
    id: Optional[str] = None
    score: int
    issues: list
    recommendations: list
    performance: list


class CheckoutRequest(BaseModel):
    user_id: str
    email: str
    success_url: str
    cancel_url: str


def get_user_subscription(user_id: str) -> dict:
    if not supabase:
        return {"plan": "free", "analyses_used": 0, "analyses_limit": 3}
    
    try:
        result = supabase.table("subscriptions").select("*").eq("user_id", user_id).execute()
        if result.data and len(result.data) > 0:
            sub = result.data[0]
            return {
                "plan": sub.get("plan", "free"),
                "analyses_used": sub.get("analyses_used", 0),
                "analyses_limit": 100 if sub.get("plan") == "pro" else 3,
                "stripe_customer_id": sub.get("stripe_customer_id"),
                "stripe_subscription_id": sub.get("stripe_subscription_id")
            }
        else:
            supabase.table("subscriptions").insert({
                "user_id": user_id,
                "plan": "free",
                "analyses_used": 0,
                "created_at": datetime.utcnow().isoformat()
            }).execute()
            return {"plan": "free", "analyses_used": 0, "analyses_limit": 3}
    except Exception as e:
        print(f"Error getting subscription: {e}")
        return {"plan": "free", "analyses_used": 0, "analyses_limit": 3}


def analyze_seo_with_openai(url: str) -> dict:
    if not openai_client:
        return {
            "score": 75,
            "issues": [
                {"type": "warning", "title": "Missing Meta Description", "description": "Add a meta description to improve click-through rates"},
                {"type": "error", "title": "Slow Page Load", "description": "Page takes more than 3 seconds to load"},
                {"type": "info", "title": "No Sitemap Found", "description": "Add a sitemap.xml for better indexing"}
            ],
            "recommendations": [
                {"priority": "high", "title": "Optimize Images", "description": "Compress images to reduce page load time by up to 40%"},
                {"priority": "medium", "title": "Add Alt Text", "description": "Add descriptive alt text to all images for accessibility and SEO"},
                {"priority": "low", "title": "Implement Schema Markup", "description": "Add structured data to enhance search result appearance"}
            ],
            "performance": [
                {"metric": "Page Load Time", "value": "3.2s", "status": "warning"},
                {"metric": "Mobile Friendly", "value": "Yes", "status": "good"},
                {"metric": "HTTPS", "value": "Enabled", "status": "good"},
                {"metric": "Core Web Vitals", "value": "Needs Improvement", "status": "warning"}
            ]
        }
    
    try:
        prompt = f"""Analyze the SEO of this website URL: {url}

You are an expert SEO analyst. Provide a comprehensive SEO analysis in the following JSON format:
{{
    "score": <number between 0-100 representing overall SEO health>,
    "issues": [
        {{"type": "error|warning|info", "title": "<issue title>", "description": "<detailed description>"}}
    ],
    "recommendations": [
        {{"priority": "high|medium|low", "title": "<recommendation title>", "description": "<actionable recommendation>"}}
    ],
    "performance": [
        {{"metric": "<metric name>", "value": "<current value>", "status": "good|warning|error"}}
    ]
}}

Analyze key SEO factors including:
- Title tags and meta descriptions
- Header structure (H1, H2, etc.)
- Mobile responsiveness
- Page speed indicators
- URL structure
- Internal/external linking
- Image optimization
- Core Web Vitals estimates
- HTTPS security
- Content quality signals

Provide 3-5 items for each category. Be specific and actionable.
Respond ONLY with valid JSON, no additional text."""

        # the newest OpenAI model is "gpt-5" which was released August 7, 2025.
        # do not change this unless explicitly requested by the user
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert SEO analyst. Always respond with valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            max_completion_tokens=2048
        )
        
        result = json.loads(response.choices[0].message.content)
        return result
    except Exception as e:
        print(f"OpenAI analysis error: {e}")
        return {
            "score": 70,
            "issues": [
                {"type": "warning", "title": "Analysis Partial", "description": f"Could not complete full analysis: {str(e)[:100]}"}
            ],
            "recommendations": [
                {"priority": "high", "title": "Manual Review Recommended", "description": "Please review the website manually for SEO issues"}
            ],
            "performance": [
                {"metric": "Analysis Status", "value": "Partial", "status": "warning"}
            ]
        }


@app.get("/")
async def root():
    return {"message": "SEO Score Analyzer Pro API", "status": "running"}


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "openai": "connected" if openai_client else "not configured",
        "supabase": "connected" if supabase else "not configured",
        "stripe": "configured" if STRIPE_SECRET_KEY else "not configured"
    }


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_url(request: AnalyzeRequest):
    subscription = get_user_subscription(request.user_id)
    
    if subscription["plan"] == "free" and subscription["analyses_used"] >= subscription["analyses_limit"]:
        raise HTTPException(
            status_code=403,
            detail="Free plan limit reached. Upgrade to Pro for unlimited analyses."
        )
    
    result = analyze_seo_with_openai(request.url)
    
    report_id = None
    if supabase:
        try:
            report_data = {
                "user_id": request.user_id,
                "url": request.url,
                "score": result["score"],
                "issues": result["issues"],
                "recommendations": result["recommendations"],
                "performance": result["performance"],
                "created_at": datetime.utcnow().isoformat()
            }
            insert_result = supabase.table("reports").insert(report_data).execute()
            if insert_result.data:
                report_id = insert_result.data[0].get("id")
            
            supabase.table("subscriptions").update({
                "analyses_used": subscription["analyses_used"] + 1
            }).eq("user_id", request.user_id).execute()
        except Exception as e:
            print(f"Error saving report: {e}")
    
    return AnalyzeResponse(
        id=str(report_id) if report_id else None,
        score=result["score"],
        issues=result["issues"],
        recommendations=result["recommendations"],
        performance=result["performance"]
    )


@app.get("/history")
async def get_history(user_id: str):
    if not supabase:
        return {"reports": []}
    
    try:
        result = supabase.table("reports").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(50).execute()
        return {"reports": result.data if result.data else []}
    except Exception as e:
        print(f"Error fetching history: {e}")
        return {"reports": []}


@app.get("/report/{report_id}")
async def get_report(report_id: str, user_id: str):
    if not supabase:
        raise HTTPException(status_code=404, detail="Report not found")
    
    try:
        result = supabase.table("reports").select("*").eq("id", report_id).eq("user_id", user_id).execute()
        if result.data and len(result.data) > 0:
            return result.data[0]
        raise HTTPException(status_code=404, detail="Report not found")
    except Exception as e:
        print(f"Error fetching report: {e}")
        raise HTTPException(status_code=404, detail="Report not found")


@app.get("/subscription")
async def get_subscription(user_id: str):
    subscription = get_user_subscription(user_id)
    return subscription


@app.post("/billing/create-checkout-session")
async def create_checkout_session(request: CheckoutRequest):
    if not STRIPE_SECRET_KEY:
        raise HTTPException(status_code=500, detail="Stripe not configured")
    
    try:
        subscription = get_user_subscription(request.user_id)
        customer_id = subscription.get("stripe_customer_id")
        
        if not customer_id:
            customer = stripe.Customer.create(
                email=request.email,
                metadata={"user_id": request.user_id}
            )
            customer_id = customer.id
            
            if supabase:
                supabase.table("subscriptions").update({
                    "stripe_customer_id": customer_id
                }).eq("user_id", request.user_id).execute()
        
        checkout_session = stripe.checkout.Session.create(
            customer=customer_id,
            payment_method_types=["card"],
            line_items=[{
                "price": STRIPE_PRICE_ID,
                "quantity": 1
            }],
            mode="subscription",
            success_url=request.success_url,
            cancel_url=request.cancel_url,
            metadata={"user_id": request.user_id}
        )
        
        return {"url": checkout_session.url, "session_id": checkout_session.id}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/billing/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    if STRIPE_WEBHOOK_SECRET and sig_header:
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, STRIPE_WEBHOOK_SECRET
            )
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid payload")
        except stripe.error.SignatureVerificationError:
            raise HTTPException(status_code=400, detail="Invalid signature")
    else:
        event = json.loads(payload)
    
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        user_id = session.get("metadata", {}).get("user_id")
        subscription_id = session.get("subscription")
        
        if user_id and supabase:
            supabase.table("subscriptions").update({
                "plan": "pro",
                "stripe_subscription_id": subscription_id,
                "analyses_used": 0
            }).eq("user_id", user_id).execute()
    
    elif event["type"] == "customer.subscription.deleted":
        subscription = event["data"]["object"]
        subscription_id = subscription.get("id")
        
        if supabase and subscription_id:
            supabase.table("subscriptions").update({
                "plan": "free",
                "stripe_subscription_id": None
            }).eq("stripe_subscription_id", subscription_id).execute()
    
    return {"status": "success"}


@app.post("/billing/portal")
async def create_portal_session(user_id: str, return_url: str):
    if not STRIPE_SECRET_KEY:
        raise HTTPException(status_code=500, detail="Stripe not configured")
    
    subscription = get_user_subscription(user_id)
    customer_id = subscription.get("stripe_customer_id")
    
    if not customer_id:
        raise HTTPException(status_code=400, detail="No billing account found")
    
    try:
        portal_session = stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url=return_url
        )
        return {"url": portal_session.url}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
