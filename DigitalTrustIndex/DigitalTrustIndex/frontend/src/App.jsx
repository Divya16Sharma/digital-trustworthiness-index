import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Results from './pages/Results'
import Billing from './pages/Billing'
import NotFound from './pages/NotFound'

function App() {
  const clerkAvailable = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Login isSignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/results/:id?" element={<Results />} />
      <Route path="/billing" element={<Billing />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
