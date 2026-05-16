const jwt  = require('jsonwebtoken')
const User = require('../models/User')

// Verify JWT and attach user to request
const protect = async (req, res, next) => {
  let token
  const authHeader = req.headers.authorization
  if (typeof authHeader === 'string' && authHeader.toLowerCase().startsWith('bearer ')) {
    try {
      token = authHeader.split(' ')[1]
      if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' })
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
      return next()
    } catch (err) {
      const details = process.env.NODE_ENV === 'development' ? `: ${err.message}` : ''
      console.error('JWT verify error', err)
      return res.status(401).json({ message: `Not authorized, token failed${details}` })
    }
  }
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' })
}

// Admin-only gate (use after protect)
const adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') return next()
  res.status(403).json({ message: 'Access denied: admins only' })
}

module.exports = { protect, adminOnly }