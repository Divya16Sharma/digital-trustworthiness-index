# SEO Score Analyzer Pro

## Overview
A full-stack SaaS application for AI-powered SEO website analysis. Users can analyze any website URL to get comprehensive SEO scores, identified issues, actionable recommendations, and performance metrics.

## Project Architecture

### Directory Structure
```
/
├── frontend/           # React + Vite + TailwindCSS frontend
│   ├── src/
│   │   ├── pages/      # Page components (Landing, Login, Dashboard, Results, Billing, NotFound)
│   │   ├── components/ # Reusable UI components
│   │   └── lib/        # API client and utilities (api.js, export.js)
│   └── vite.config.js  # Vite configuration with proxy
├── backend/            # Python FastAPI backend
│   ├── main.py         # Main API application
│   └── database_setup.sql # Supabase table definitions
├── README.md           # Full documentation
└── replit.md           # This file
```

### Tech Stack
- **Frontend**: React 19, Vite, TailwindCSS, Clerk Auth, React Router
- **Backend**: Python FastAPI, OpenAI, Supabase, Stripe
- **Database**: Supabase (PostgreSQL)
- **Auth**: Clerk
- **Payments**: Stripe

### Key Features
1. Landing page with hero, features, and pricing
2. User authentication (Clerk - Email + Google)
3. SEO analysis using OpenAI GPT-4o-mini
4. Dashboard with analysis history table
5. Results page with score, issues, recommendations, performance
6. Stripe subscription billing (Free + Pro plans)
7. PDF and CSV report exports
8. 404 error page

### API Endpoints
- `POST /analyze` - Analyze a URL
- `GET /history` - Get user's past reports
- `GET /report/{id}` - Get specific report
- `GET /subscription` - Get subscription status
- `POST /billing/create-checkout-session` - Start Stripe checkout
- `POST /billing/webhook` - Handle Stripe webhooks

### Environment Variables Required
- `OPENAI_API_KEY` - OpenAI API key
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase anon key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `STRIPE_PRICE_ID` - Stripe price ID for Pro plan
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk publishable key

### Running the Application
- Frontend: Port 5000 (Vite dev server)
- Backend: Port 8000 (Uvicorn)
- Vite proxies `/api/*` requests to backend

### User Preferences
- Dark theme UI
- Modern, clean design
- Responsive layouts
