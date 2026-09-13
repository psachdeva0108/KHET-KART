import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { login as loginRequest, register as registerRequest } from '../services/authService'
import { api } from '../services/api'

const AuthContext = createContext(null)
const STORAGE_KEY = 'farmlink.auth.user'

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// product-spec §25: current user, auth state, role, login, logout —
// backed by localStorage so a demo session survives a page reload.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  async function login(identifier, password, type = 'email') {
    const response = await loginRequest(type === 'aadhaar' ? { aadhaar: identifier, password } : { email: identifier, password })
    localStorage.setItem('farmlink.auth.token', response.token)
    setUser(response.user)
    return response.user
  }

  async function register(formValues) {
    const response = await registerRequest(formValues)
    localStorage.setItem('farmlink.auth.token', response.token)
    setUser(response.user)
    return response.user
  }

  function logout() {
    localStorage.removeItem('farmlink.auth.token')
    setUser(null)
  }

  // product-spec §57: consumer activates/cancels AgriPlus Premium — mock
  // only, reflected instantly across the app via the stored user object.
  async function setPremium(isPremium) {
    if (!user) return
    if (isPremium) return
    await api.patch('/me', { isPremium: false })
    setUser((prev) => (prev ? { ...prev, isPremium: false, premiumRenewalDate: null } : prev))
  }

  function applyPremiumUser(nextUser) {
    setUser(nextUser)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      role: user?.role ?? null,
      login,
      register,
      logout,
      setPremium,
      applyPremiumUser,
    }),
    [user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
