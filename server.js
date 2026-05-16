const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
const express = require('express')
const cors    = require('cors')
const connectDB = require('./config/db')

const app = express()
connectDB()

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-app-name.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean)

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS blocked: ${origin}`))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

const corsMiddleware = cors(corsOptions)
app.use(corsMiddleware)

// Avoid using app.options with '*' which can break path-to-regexp in some Express versions.
// Instead, call the CORS middleware explicitly for preflight requests.
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') return corsMiddleware(req, res, next)
  next()
})
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth',   require('./routes/authRoutes'))
app.use('/api/foods',  require('./routes/foodRoutes'))
app.use('/api/cart',   require('./routes/cartRoutes'))
app.use('/api/orders', require('./routes/orderRoutes'))

// Health check
app.get('/', (req, res) => res.json({ message: 'Restaurant API running' }))

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: err.message || 'Server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))