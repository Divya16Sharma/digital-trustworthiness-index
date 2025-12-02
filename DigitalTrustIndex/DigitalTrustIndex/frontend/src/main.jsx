import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

async function initApp() {
  const root = createRoot(document.getElementById('root'))
  
  if (clerkPubKey) {
    const { ClerkProvider } = await import('@clerk/clerk-react')
    
    const clerkAppearance = {
      variables: {
        colorPrimary: '#3b82f6',
        colorBackground: '#1e293b',
        colorInputBackground: '#0f172a',
        colorInputText: '#f8fafc',
        colorText: '#f8fafc',
      },
      elements: {
        formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
        card: 'bg-slate-800 border border-slate-700',
        headerTitle: 'text-white',
        headerSubtitle: 'text-slate-400',
        socialButtonsBlockButton: 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600',
        formFieldLabel: 'text-slate-300',
        formFieldInput: 'bg-slate-900 border-slate-600 text-white',
        footerActionLink: 'text-blue-400 hover:text-blue-300',
      }
    }
    
    root.render(
      <StrictMode>
        <BrowserRouter>
          <ClerkProvider publishableKey={clerkPubKey} appearance={clerkAppearance}>
            <App />
          </ClerkProvider>
        </BrowserRouter>
      </StrictMode>
    )
  } else {
    root.render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>
    )
  }
}

initApp()
