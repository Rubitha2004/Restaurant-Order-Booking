import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import { toasts } from '../utils/toast'   // ← add this import

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(
    () => JSON.parse(localStorage.getItem('user') || 'null')
  )
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const navigate = useNavigate()

  const register = async (name, email, password) => {
    try {
      setLoading(true); setError(null)
      const data = await authService.register(name, email, password)
      localStorage.setItem('user', JSON.stringify(data))
      setUser(data)
      toasts.registerSuccess(data.name)   // ← toast
      navigate('/')
    } catch (err) {
      const msg = err.message || 'Registration failed'
      setError(msg)
      toasts.error(msg)                   // ← toast
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true); setError(null)
      const data = await authService.login(email, password)
      localStorage.setItem('user', JSON.stringify(data))
      setUser(data)
      toasts.loginSuccess(data.name)      // ← toast
      navigate(data.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      const msg = err.message || 'Login failed'
      setError(msg)
      toasts.error(msg)                   // ← toast
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
    toasts.logoutSuccess()               // ← toast
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)