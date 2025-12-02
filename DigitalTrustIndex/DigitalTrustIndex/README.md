# SEO Score Analyzer Pro

A full-stack SaaS application for AI-powered SEO website analysis with subscription billing.

## Features

- **AI-Powered SEO Analysis**: Comprehensive website SEO audits using OpenAI GPT-4o-mini
- **User Authentication**: Secure login with Clerk (Email + Google OAuth)
- **Subscription Billing**: Free and Pro plans with Stripe integration
- **Dashboard**: View analysis history and track SEO improvements
- **Export Reports**: Download analyses as PDF or CSV
- **Real-time Results**: Get instant scores, issues, recommendations, and performance metrics

## Tech Stack

### Frontend
- React 19 with Vite
- TailwindCSS for styling
- Clerk React SDK for authentication
- React Router for navigation
- Recharts for visualizations
- jsPDF & PapaParse for exports

### Backend
- Python FastAPI
- OpenAI GPT-4o-mini for AI analysis
- Supabase (PostgreSQL) for database
- Stripe for payment processing
- Uvicorn ASGI server

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory with the following:

```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_PRICE_ID=your_stripe_price_id

# Clerk (Frontend)
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 2. Database Setup

Run the SQL commands in `backend/database_setup.sql` in your Supabase SQL Editor to create the required tables:

- `subscriptions` - User subscription data
- `reports` - SEO analysis reports

### 3. Stripe Configuration

1. Create a product in Stripe Dashboard
2. Create a monthly recurring price ($19/month)
3. Copy the Price ID to `STRIPE_PRICE_ID`
4. Set up webhook endpoint: `https://your-domain.com/api/billing/webhook`
5. Subscribe to events: `checkout.session.completed`, `customer.subscription.deleted`

### 4. Clerk Configuration

1. Create a Clerk application at clerk.com
2. Enable Email and Google OAuth sign-in methods
3. Copy the Publishable Key to `VITE_CLERK_PUBLISHABLE_KEY`

### 5. Running Locally

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
pip install -r requirements.txt

# Run backend (from backend directory)
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Run frontend (from frontend directory)
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/analyze` | Analyze a website URL |
| GET | `/history` | Get user's analysis history |
| GET | `/report/{id}` | Get a specific report |
| GET | `/subscription` | Get user subscription status |
| POST | `/billing/create-checkout-session` | Create Stripe checkout |
| POST | `/billing/webhook` | Stripe webhook handler |
| POST | `/billing/portal` | Create Stripe billing portal session |

### Analyze Response Format

```json
{
  "id": "uuid",
  "score": 85,
  "issues": [
    {
      "type": "error|warning|info",
      "title": "Issue Title",
      "description": "Detailed description"
    }
  ],
  "recommendations": [
    {
      "priority": "high|medium|low",
      "title": "Recommendation Title",
      "description": "Actionable recommendation"
    }
  ],
  "performance": [
    {
      "metric": "Metric Name",
      "value": "Value",
      "status": "good|warning|error"
    }
  ]
}
```

## Pricing Plans

### Free Plan ($0/forever)
- 3 analyses per month
- Basic SEO metrics
- Performance insights
- PDF export
- Email support

### Pro Plan ($19/month)
- Unlimited analyses
- Advanced AI insights
- Historical tracking
- Priority recommendations
- PDF & CSV export
- Priority support
- API access

## Deployment

The application is designed for deployment on Replit:

1. All environment variables are configured via Replit Secrets
2. Frontend runs on port 5000
3. Backend runs on port 8000
4. Vite proxy handles API routing

## License

MIT License
