import { useState, useEffect } from 'react'
import { useLocation, Link, useNavigate, useParams } from 'react-router-dom'
import { 
  ArrowLeft, Download, FileText, AlertTriangle, AlertCircle, 
  Info, CheckCircle, TrendingUp, Zap, Shield, ChevronRight, Loader2
} from 'lucide-react'
import { exportToPDF, exportToCSV } from '../lib/export'
import { getReport } from '../lib/api'

const DEMO_USER_ID = 'demo-user'

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const { id: reportId } = useParams()
  
  const [report, setReport] = useState(location.state?.report || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!report && reportId) {
      fetchReport()
    }
  }, [reportId])

  const fetchReport = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getReport(reportId, DEMO_USER_ID)
      setReport(data)
    } catch (err) {
      setError('Failed to load report. It may not exist or you may not have access.')
      console.error('Failed to fetch report:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-400">Loading report...</p>
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="card p-12 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {error ? 'Error Loading Report' : 'No Report Found'}
          </h2>
          <p className="text-slate-400 mb-6">
            {error || 'Please run an analysis first to see results.'}
          </p>
          <Link to="/dashboard" className="btn-primary inline-block">
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const getScoreClass = (score) => {
    if (score >= 80) return 'score-good'
    if (score >= 50) return 'score-warning'
    return 'score-bad'
  }

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent'
    if (score >= 50) return 'Needs Work'
    return 'Poor'
  }

  const getIssueIcon = (type) => {
    switch (type) {
      case 'error': return <AlertCircle className="w-5 h-5 text-red-400" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      default: return <Info className="w-5 h-5 text-blue-400" />
    }
  }

  const getIssueColor = (type) => {
    switch (type) {
      case 'error': return 'border-red-500/30 bg-red-900/10'
      case 'warning': return 'border-yellow-500/30 bg-yellow-900/10'
      default: return 'border-blue-500/30 bg-blue-900/10'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400'
      default: return 'bg-green-500/20 text-green-400'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      default: return <AlertCircle className="w-5 h-5 text-red-400" />
    }
  }

  const getStatusBg = (status) => {
    switch (status) {
      case 'good': return 'bg-green-500/10 border-green-500/30'
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/30'
      default: return 'bg-red-500/10 border-red-500/30'
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => exportToPDF(report)}
              className="btn-secondary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button
              onClick={() => exportToCSV(report)}
              className="btn-secondary flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="card p-6 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className={`score-circle ${getScoreClass(report.score)}`}>
              {report.score}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold mb-2">{getScoreLabel(report.score)} SEO Health</h1>
              <p className="text-slate-400 mb-4 break-all">{report.url}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span>{report.issues?.filter(i => i.type === 'error').length || 0} Errors</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <span>{report.issues?.filter(i => i.type === 'warning').length || 0} Warnings</span>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-400" />
                  <span>{report.issues?.filter(i => i.type === 'info').length || 0} Info</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-slate-500 text-sm">Analyzed on</p>
              <p className="font-medium">{new Date(report.created_at).toLocaleDateString()}</p>
              <p className="text-slate-500 text-sm">{new Date(report.created_at).toLocaleTimeString()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold">Issues Found</h2>
            </div>
            <div className="space-y-4">
              {report.issues && report.issues.length > 0 ? (
                report.issues.map((issue, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border ${getIssueColor(issue.type)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getIssueIcon(issue.type)}
                      <div>
                        <h3 className="font-medium mb-1">{issue.title}</h3>
                        <p className="text-slate-400 text-sm">{issue.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-center py-8">No issues found</p>
              )}
            </div>
          </div>

          <div className="card p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-400" />
              </div>
              <h2 className="text-xl font-semibold">Recommendations</h2>
            </div>
            <div className="space-y-4">
              {report.recommendations && report.recommendations.length > 0 ? (
                report.recommendations.map((rec, index) => (
                  <div key={index} className="p-4 rounded-lg border border-slate-700 bg-slate-800/50">
                    <div className="flex items-start gap-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                        {rec.priority}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{rec.title}</h3>
                        <p className="text-slate-400 text-sm">{rec.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-center py-8">No recommendations</p>
              )}
            </div>
          </div>
        </div>

        <div className="card p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold">Performance Metrics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {report.performance && report.performance.length > 0 ? (
              report.performance.map((perf, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border ${getStatusBg(perf.status)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">{perf.metric}</span>
                    {getStatusIcon(perf.status)}
                  </div>
                  <p className="text-xl font-semibold">{perf.value}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-8 col-span-4">No performance data</p>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-500 mb-4">Want to improve your SEO score?</p>
          <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
            Analyze Another Site <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
