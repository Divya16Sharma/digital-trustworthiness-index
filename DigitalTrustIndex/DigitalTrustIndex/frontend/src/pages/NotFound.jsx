import { Link } from 'react-router-dom'
import { Search, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-800 rounded-full mb-6">
            <Search className="w-12 h-12 text-slate-600" />
          </div>
          <h1 className="text-8xl font-extrabold gradient-text mb-4">404</h1>
          <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
          <p className="text-slate-400">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary flex items-center justify-center gap-2">
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800">
          <p className="text-slate-500 text-sm mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/dashboard" className="text-blue-400 hover:text-blue-300 text-sm">
              Dashboard
            </Link>
            <span className="text-slate-600">•</span>
            <Link to="/login" className="text-blue-400 hover:text-blue-300 text-sm">
              Login
            </Link>
            <span className="text-slate-600">•</span>
            <Link to="/#pricing" className="text-blue-400 hover:text-blue-300 text-sm">
              Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
