import { Link } from 'react-router-dom'
import { Search, BarChart3, Zap, Shield, TrendingUp, CheckCircle, ArrowRight, Star } from 'lucide-react'

export default function Landing() {
  const features = [
    {
      icon: <Search className="w-8 h-8 text-blue-400" />,
      title: 'Deep SEO Analysis',
      description: 'Get comprehensive insights into your website\'s SEO health with AI-powered analysis.'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-400" />,
      title: 'Performance Metrics',
      description: 'Track Core Web Vitals, page speed, and mobile responsiveness in real-time.'
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: 'Instant Results',
      description: 'Get your SEO score and actionable recommendations in seconds, not hours.'
    },
    {
      icon: <Shield className="w-8 h-8 text-green-400" />,
      title: 'Security Check',
      description: 'Verify HTTPS implementation and identify security vulnerabilities.'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-pink-400" />,
      title: 'Track Progress',
      description: 'Monitor your SEO improvements over time with historical reports.'
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-cyan-400" />,
      title: 'Actionable Insights',
      description: 'Receive prioritized recommendations you can implement immediately.'
    }
  ]

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        '3 analyses per month',
        'Basic SEO metrics',
        'Performance insights',
        'Export to PDF',
        'Email support'
      ],
      cta: 'Get Started',
      highlighted: false
    },
    {
      name: 'Pro',
      price: '$19',
      period: 'per month',
      features: [
        'Unlimited analyses',
        'Advanced AI insights',
        'Historical tracking',
        'Priority recommendations',
        'Export to PDF & CSV',
        'Priority support',
        'API access'
      ],
      cta: 'Start Pro Trial',
      highlighted: true
    }
  ]

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Search className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold">SEO Score Analyzer Pro</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-slate-300 hover:text-white transition">
                Login
              </Link>
              <Link to="/signup" className="btn-primary">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 gradient-bg">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">Trusted by 10,000+ marketers worldwide</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Boost Your Website's
            <br />
            <span className="gradient-text">SEO Performance</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10">
            Get instant, AI-powered SEO analysis with actionable recommendations. 
            Improve your search rankings and drive more organic traffic.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
              Analyze Your Site Free <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="btn-secondary text-lg px-8 py-4">
              See Features
            </a>
          </div>
          <div className="mt-16 relative">
            <div className="bg-slate-800/50 rounded-2xl p-4 max-w-4xl mx-auto border border-slate-700">
              <div className="bg-slate-900 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 bg-slate-800 rounded-lg px-4 py-3 text-left text-slate-400">
                    https://example.com
                  </div>
                  <button className="btn-primary">Analyze</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                    <div className="text-4xl font-bold text-green-400">85</div>
                    <div className="text-slate-400 text-sm">SEO Score</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                    <div className="text-4xl font-bold text-yellow-400">3</div>
                    <div className="text-slate-400 text-sm">Issues Found</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                    <div className="text-4xl font-bold text-blue-400">8</div>
                    <div className="text-slate-400 text-sm">Recommendations</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                    <div className="text-4xl font-bold text-purple-400">A+</div>
                    <div className="text-slate-400 text-sm">Performance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Everything you need to optimize your website for search engines
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 hover:border-blue-500/50 transition">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Start for free, upgrade when you need more power
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`card p-8 relative ${plan.highlighted ? 'border-blue-500 ring-2 ring-blue-500/20' : ''}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-slate-400">/{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/signup" 
                  className={`block text-center py-3 rounded-lg font-semibold transition ${
                    plan.highlighted 
                      ? 'btn-primary w-full' 
                      : 'btn-secondary w-full'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 gradient-bg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Improve Your SEO?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of marketers who are already boosting their search rankings.
          </p>
          <Link to="/signup" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <footer className="bg-slate-900 border-t border-slate-800 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Search className="w-6 h-6 text-blue-500" />
              <span className="font-bold">SEO Score Analyzer Pro</span>
            </div>
            <div className="flex gap-6 text-slate-400">
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Contact</a>
            </div>
            <p className="text-slate-500 text-sm">
              © 2024 SEO Score Analyzer Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
