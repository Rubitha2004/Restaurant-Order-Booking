require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const connectDB = require('./config/db')

const app = express()

// Connect Database
connectDB()

// CORS setup
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL,
    ].filter(Boolean)

    if (!origin || allowed.includes(origin)) {
      callback(null, true)
    } else {
      callback(null, true) // allow all during development/debugging
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Body parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check — test this first after deploy
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Restaurant API running',
    env: process.env.NODE_ENV,
    time: new Date().toISOString(),
  })
})

// API Routes
app.use('/api/auth',   require('./routes/authRoutes'))
app.use('/api/foods',  require('./routes/foodRoutes'))
app.use('/api/cart',   require('./routes/cartRoutes'))
app.use('/api/orders', require('./routes/orderRoutes'))

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  console.error('Stack:', err.stack)
  res.status(err.status || 500).json({
    message: err.message || 'Server error',
  })
})
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err.message)
  console.error('FILE:', err.stack)
  process.exit(1)
})
const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV}`)
  console.log(`MongoDB: ${process.env.MONGO_URI ? 'URI set' : 'URI MISSING'}`)
  console.log(`JWT: ${process.env.JWT_SECRET ? 'Secret set' : 'Secret MISSING'}`)
  console.log(`Cloudinary: ${process.env.CLOUD_NAME ? 'Set' : 'MISSING'}`)
})