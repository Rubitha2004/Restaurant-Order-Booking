import axios from 'axios'
const BASE_URL = import.meta.env.VITE_API_URL || '/api'
const API = axios.create({ baseURL: BASE_URL })

// Attach JWT token to every request if present
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`
  return config
})

const authService = {
  register: async (name, email, password) => {
    try {
      const { data } = await API.post('/auth/register', { name, email, password })
      return data
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed'
      throw new Error(message)
    }
  },
  login: async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password })
      return data
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed'
      throw new Error(message)
    }
  },
}

export default authService
export { API } // export for use in foodService, cartService, etc.