import axios from 'axios'

const API_BASE = '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const analyzeUrl = async (url, userId) => {
  const response = await api.post('/analyze', { url, user_id: userId })
  return response.data
}

export const getHistory = async (userId) => {
  const response = await api.get('/history', { params: { user_id: userId } })
  return response.data
}

export const getReport = async (reportId, userId) => {
  const response = await api.get(`/report/${reportId}`, { params: { user_id: userId } })
  return response.data
}

export const getSubscription = async (userId) => {
  const response = await api.get('/subscription', { params: { user_id: userId } })
  return response.data
}

export const createCheckoutSession = async (userId, email, successUrl, cancelUrl) => {
  const response = await api.post('/billing/create-checkout-session', {
    user_id: userId,
    email: email,
    success_url: successUrl,
    cancel_url: cancelUrl
  })
  return response.data
}

export const createPortalSession = async (userId, returnUrl) => {
  const response = await api.post('/billing/portal', null, {
    params: { user_id: userId, return_url: returnUrl }
  })
  return response.data
}

export default api
