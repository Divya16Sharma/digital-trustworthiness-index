import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Search, LayoutDashboard, History, CreditCard, LogOut, 
  Globe, Loader2, AlertCircle, ChevronRight, TrendingUp,
  FileText, Download
} from 'lucide-react'
import { analyzeUrl, getHistory, getSubscription } from '../lib/api'
import { exportToPDF, exportToCSV } from '../lib/export'

const DEMO_USER = {
  id: 'demo-user',
  firstName: 'Demo',
  emailAddresses: [{ emailAddress: 'demo@example.com' }]
}

function useAuth() {
  const clerkAvailable = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  const [authState, setAuthState] = useState({ user: null, signOut: null, isLoaded: false })
  
  useEffect(() => {
    if (clerkAvailable) {
      import('@clerk/clerk-react').then(({ useUser, useClerk }) => {
        setAuthState({ 
          user: null, 
          signOut: null, 
          isLoaded: false,
          useClerkHooks: true 
        })
      }).catch(() => {
        setAuthState({ user: DEMO_USER, signOut: null, isLoaded: true })
      })
    } else {
      setAuthState({ user: DEMO_USER, signOut: null, isLoaded: true })
    }
  }, [clerkAvailable])
  
  return authState
}

function DashboardWithClerk() {
  const { useUser, useClerk } = require('@clerk/clerk-react')
  const { user } = useUser()
  const { signOut } = useClerk()
  
  return <DashboardContent user={user} signOut={signOut} />
}

function DashboardContent({ user, signOut }) {
  const navigate = useNavigate()
  const userId = user?.id || 'demo-user'
  
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])
  const [subscription, setSubscription] = useState(null)
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [activeTab, setActiveTab] = useState('analyze')

  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    setLoadingHistory(true)
    try {
      const [historyData, subData] = await Promise.all([
        getHistory(userId),
        getSubscription(userId)
      ])
      setHistory(historyData.reports || [])
      setSubscription(subData)
    } catch (err) {
      console.error('Failed to load data:', err)
      setSubscription({ plan: 'free', analyses_used: 0, analyses_limit: 3 })
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleAnalyze = async (e) => {
    e.preventDefault()
    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }

    let urlToAnalyze = url.trim()
    if (!urlToAnalyze.startsWith('http://') && !urlToAnalyze.startsWith('https://')) {
      urlToAnalyze = 'https://' + urlToAnalyze
    }

    setLoading(true)
    setError('')

    try {
      const result = await analyzeUrl(urlToAnalyze, userId)
      navigate('/results', { state: { report: { ...result, url: urlToAnalyze, created_at: new Date().toISOString() } } })
    } catch (err) {
      if (err.response?.status === 403) {
        setError('You\'ve reached your free analysis limit. Upgrade to Pro for unlimited analyses.')
      } else {
        setError(err.response?.data?.detail || 'Failed to analyze URL. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    if (signOut) {
      await signOut()
    }
    navigate('/')
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-500/20'
    if (score >= 50) return 'bg-yellow-500/20'
    return 'bg-red-500/20'
  }

  return (
    <div className="min-h-screen flex bg-slate-950">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2">
            <Search className="w-8 h-8 text-blue-500" />
            <span className="font-bold">SEO Analyzer Pro</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('analyze')}
            className={`sidebar-link w-full ${activeTab === 'analyze' ? 'active' : ''}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Analyze
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`sidebar-link w-full ${activeTab === 'history' ? 'active' : ''}`}
          >
            <History className="w-5 h-5" />
            History
          </button>
          <Link to="/billing" className="sidebar-link">
            <CreditCard className="w-5 h-5" />
            Billing
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          {subscription && (
            <div className="mb-4 p-3 bg-slate-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Plan</span>
                <span className={`text-sm font-semibold ${subscription.plan === 'pro' ? 'text-blue-400' : 'text-slate-300'}`}>
                  {subscription.plan === 'pro' ? 'Pro' : 'Free'}
                </span>
              </div>
              {subscription.plan === 'free' && (
                <div className="text-xs text-slate-500">
                  {subscription.analyses_used}/{subscription.analyses_limit} analyses used
                </div>
              )}
            </div>
          )}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.firstName || 'User'}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user?.emailAddresses?.[0]?.emailAddress || 'demo@example.com'}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-900/20"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        {activeTab === 'analyze' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">Analyze Your Website</h1>
            <p className="text-slate-400 mb-8">
              Enter a URL to get a comprehensive SEO analysis powered by AI
            </p>

            <form onSubmit={handleAnalyze} className="card p-6 mb-8">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter website URL (e.g., example.com)"
                    className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-8 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Analyze
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-4 flex items-center gap-2 text-red-400 bg-red-900/20 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                  {error.includes('Upgrade') && (
                    <Link to="/billing" className="ml-auto text-blue-400 hover:text-blue-300 text-sm font-medium">
                      Upgrade Now
                    </Link>
                  )}
                </div>
              )}
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{history.length}</p>
                    <p className="text-slate-400 text-sm">Total Reports</p>
                  </div>
                </div>
              </div>
              <div className="card p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {history.length > 0 
                        ? Math.round(history.reduce((sum, r) => sum + r.score, 0) / history.length)
                        : '-'}
                    </p>
                    <p className="text-slate-400 text-sm">Avg. Score</p>
                  </div>
                </div>
              </div>
              <div className="card p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Search className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {subscription?.plan === 'pro' ? '∞' : `${(subscription?.analyses_limit || 3) - (subscription?.analyses_used || 0)}`}
                    </p>
                    <p className="text-slate-400 text-sm">Analyses Left</p>
                  </div>
                </div>
              </div>
            </div>

            {history.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Recent Analyses</h2>
                <div className="card overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-800">
                      <tr>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">URL</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Score</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.slice(0, 5).map((report) => (
                        <tr key={report.id} className="border-t border-slate-800 table-row">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-slate-500" />
                              <span className="truncate max-w-xs">{report.url}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded ${getScoreBgColor(report.score)} ${getScoreColor(report.score)} font-semibold`}>
                              {report.score}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-400">
                            {new Date(report.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Link
                              to="/results"
                              state={{ report }}
                              className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                            >
                              View <ChevronRight className="w-4 h-4" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="max-w-6xl mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">Analysis History</h1>
            <p className="text-slate-400 mb-8">
              View and export all your previous SEO analyses
            </p>

            {loadingHistory ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : history.length === 0 ? (
              <div className="card p-12 text-center">
                <History className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No analyses yet</h3>
                <p className="text-slate-400 mb-6">Run your first SEO analysis to see it here</p>
                <button onClick={() => setActiveTab('analyze')} className="btn-primary">
                  Analyze a Website
                </button>
              </div>
            ) : (
              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-800">
                    <tr>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">URL</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Score</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Issues</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((report) => (
                      <tr key={report.id} className="border-t border-slate-800 table-row">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-slate-500" />
                            <span className="truncate max-w-xs">{report.url}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded ${getScoreBgColor(report.score)} ${getScoreColor(report.score)} font-semibold`}>
                            {report.score}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {report.issues?.length || 0} issues
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {new Date(report.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => exportToPDF(report)}
                              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded"
                              title="Export PDF"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <Link
                              to="/results"
                              state={{ report }}
                              className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                            >
                              View <ChevronRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default function Dashboard() {
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
    const { useUser, useClerk, SignedIn, SignedOut, RedirectToSignIn } = ClerkComponents
    
    function ClerkDashboard() {
      const { user, isLoaded } = useUser()
      const { signOut } = useClerk()
      
      if (!isLoaded) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-slate-950">
            <div className="loading-spinner" />
          </div>
        )
      }
      
      return <DashboardContent user={user} signOut={signOut} />
    }
    
    return (
      <>
        <SignedIn>
          <ClerkDashboard />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </>
    )
  }
  
  return <DashboardContent user={DEMO_USER} signOut={null} />
}
