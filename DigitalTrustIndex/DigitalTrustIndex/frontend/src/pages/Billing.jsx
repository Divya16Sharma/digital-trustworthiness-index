import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { 
  ArrowLeft, CreditCard, CheckCircle, Loader2, Star,
  Zap, Shield, TrendingUp, FileText
} from 'lucide-react'
import { getSubscription, createCheckoutSession, createPortalSession } from '../lib/api'

const DEMO_USER = {
  id: 'demo-user',
  emailAddresses: [{ emailAddress: 'demo@example.com' }]
}

function BillingContent({ user }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const userId = user?.id || 'demo-user'
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || 'demo@example.com'

  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)
  const [success, setSuccess] = useState(searchParams.get('success') === 'true')

  useEffect(() => {
    loadSubscription()
  }, [userId])

  const loadSubscription = async () => {
    try {
      const data = await getSubscription(userId)
      setSubscription(data)
    } catch (err) {
      console.error('Failed to load subscription:', err)
      setSubscription({ plan: 'free', analyses_used: 0, analyses_limit: 3 })
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async () => {
    setUpgrading(true)
    try {
      const successUrl = `${window.location.origin}/billing?success=true`
      const cancelUrl = `${window.location.origin}/billing?cancelled=true`
      const result = await createCheckoutSession(userId, userEmail, successUrl, cancelUrl)
      if (result.url) {
        window.location.href = result.url
      }
    } catch (err) {
      console.error('Failed to create checkout session:', err)
      alert('Failed to start upgrade process. Please try again.')
    } finally {
      setUpgrading(false)
    }
  }

  const handleManageBilling = async () => {
    try {
      const returnUrl = `${window.location.origin}/billing`
      const result = await createPortalSession(userId, returnUrl)
      if (result.url) {
        window.location.href = result.url
      }
    } catch (err) {
      console.error('Failed to open billing portal:', err)
      alert('Failed to open billing portal. Please try again.')
    }
  }

  const proFeatures = [
    { icon: <Zap className="w-5 h-5 text-yellow-400" />, text: 'Unlimited SEO analyses' },
    { icon: <TrendingUp className="w-5 h-5 text-green-400" />, text: 'Advanced AI-powered insights' },
    { icon: <FileText className="w-5 h-5 text-blue-400" />, text: 'Export to PDF & CSV' },
    { icon: <Shield className="w-5 h-5 text-purple-400" />, text: 'Priority support' },
    { icon: <Star className="w-5 h-5 text-pink-400" />, text: 'Historical tracking' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        {success && (
          <div className="card p-6 mb-8 border-green-500/30 bg-green-900/10 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-400">Payment Successful!</h3>
                <p className="text-slate-400">Welcome to Pro! You now have access to all premium features.</p>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
        <p className="text-slate-400 mb-8">Manage your subscription and billing details</p>

        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">Current Plan</h2>
              <p className="text-slate-400">Your subscription status</p>
            </div>
            <div className={`px-4 py-2 rounded-full font-semibold ${
              subscription?.plan === 'pro' 
                ? 'bg-blue-500/20 text-blue-400' 
                : 'bg-slate-700 text-slate-300'
            }`}>
              {subscription?.plan === 'pro' ? 'Pro' : 'Free'}
            </div>
          </div>

          {subscription?.plan === 'free' ? (
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Analyses used this month</p>
                  <p className="text-slate-400 text-sm">
                    {subscription?.analyses_used || 0} of {subscription?.analyses_limit || 3} analyses
                  </p>
                </div>
                <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ 
                      width: `${((subscription?.analyses_used || 0) / (subscription?.analyses_limit || 3)) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800 rounded-lg p-4">
              <p className="font-medium text-green-400">Unlimited analyses available</p>
              <p className="text-slate-400 text-sm">Enjoy all Pro features with no restrictions</p>
            </div>
          )}
        </div>

        {subscription?.plan === 'free' ? (
          <div className="card p-8 border-blue-500/30 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
              Recommended
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">Upgrade to Pro</h2>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-extrabold">$19</span>
                  <span className="text-slate-400">/month</span>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {proFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      {feature.icon}
                      <span className="text-slate-300">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex flex-col justify-center">
                <button
                  onClick={handleUpgrade}
                  disabled={upgrading}
                  className="btn-primary px-8 py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {upgrading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Upgrade Now
                    </>
                  )}
                </button>
                <p className="text-slate-500 text-sm text-center mt-3">
                  Cancel anytime. No questions asked.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Manage Subscription</h2>
            <p className="text-slate-400 mb-6">
              Update your payment method, view invoices, or cancel your subscription.
            </p>
            <button
              onClick={handleManageBilling}
              className="btn-secondary flex items-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Open Billing Portal
            </button>
          </div>
        )}

        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>Payments are securely processed by Stripe.</p>
          <p>Questions? Contact support@seoscoreanalyzer.pro</p>
        </div>
      </div>
    </div>
  )
}

export default function Billing() {
  const clerkAvailable = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  const [ClerkComponents, setClerkComponents] = useState(null)
  
  useEffect(() => {
    if (clerkAvailable) {
      import('@clerk/clerk-react').then((module) => {
        setClerkComponents(module)
      }).catch(() => {
        setClerkComponents(null)
      })
    }
  }, [clerkAvailable])
  
  if (clerkAvailable && ClerkComponents) {
    const { useUser, SignedIn, SignedOut, RedirectToSignIn } = ClerkComponents
    
    function ClerkBilling() {
      const { user, isLoaded } = useUser()
      
      if (!isLoaded) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-slate-950">
            <div className="loading-spinner" />
          </div>
        )
      }
      
      return <BillingContent user={user} />
    }
    
    return (
      <>
        <SignedIn>
          <ClerkBilling />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </>
    )
  }
  
  return <BillingContent user={DEMO_USER} />
}
