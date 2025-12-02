import { SignIn, SignUp } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ArrowLeft } from 'lucide-react'
import { useState } from 'react'

export default function Login({ isSignUp = false }) {
  const navigate = useNavigate()
  const clerkAvailable = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  const [demoMode, setDemoMode] = useState(false)

  const handleDemoLogin = () => {
    setDemoMode(true)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-slate-950">
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition">
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <Search className="w-10 h-10 text-blue-500" />
        <span className="text-2xl font-bold">SEO Score Analyzer Pro</span>
      </div>

      {clerkAvailable ? (
        <div className="w-full max-w-md">
          {isSignUp ? (
            <SignUp 
              routing="path" 
              path="/signup" 
              signInUrl="/login"
              afterSignUpUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'bg-slate-800 border border-slate-700 shadow-xl',
                  headerTitle: 'text-white',
                  headerSubtitle: 'text-slate-400',
                  socialButtonsBlockButton: 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600',
                  formFieldLabel: 'text-slate-300',
                  formFieldInput: 'bg-slate-900 border-slate-600 text-white',
                  footerActionLink: 'text-blue-400 hover:text-blue-300',
                  formButtonPrimary: 'bg-blue-600 hover:bg-blue-700'
                }
              }}
            />
          ) : (
            <SignIn 
              routing="path" 
              path="/login" 
              signUpUrl="/signup"
              afterSignInUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'bg-slate-800 border border-slate-700 shadow-xl',
                  headerTitle: 'text-white',
                  headerSubtitle: 'text-slate-400',
                  socialButtonsBlockButton: 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600',
                  formFieldLabel: 'text-slate-300',
                  formFieldInput: 'bg-slate-900 border-slate-600 text-white',
                  footerActionLink: 'text-blue-400 hover:text-blue-300',
                  formButtonPrimary: 'bg-blue-600 hover:bg-blue-700'
                }
              }}
            />
          )}
        </div>
      ) : (
        <div className="card p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-2 text-center">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-slate-400 text-center mb-6">
            {isSignUp 
              ? 'Sign up to start analyzing your SEO' 
              : 'Sign in to your account'}
          </p>
          
          <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-4 mb-6">
            <p className="text-amber-200 text-sm">
              Clerk authentication is not configured. Click below to continue in demo mode.
            </p>
          </div>

          <button
            onClick={handleDemoLogin}
            className="btn-primary w-full text-center"
          >
            Continue in Demo Mode
          </button>

          <p className="text-center text-slate-400 mt-6">
            {isSignUp ? (
              <>Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300">Sign in</Link></>
            ) : (
              <>Don't have an account? <Link to="/signup" className="text-blue-400 hover:text-blue-300">Sign up</Link></>
            )}
          </p>
        </div>
      )}
    </div>
  )
}
