import axios from 'axios'

const configuredBaseUrl = String(import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '')
const apiBaseUrl = configuredBaseUrl
  ? (configuredBaseUrl.endsWith('/api') ? configuredBaseUrl : `${configuredBaseUrl}/api`)
  : '/api'

export const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('farmlink.auth.token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
