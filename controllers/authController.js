const User          = require('../models/User')
const generateToken = require('../utils/generateToken')

const normalizeEmail = (email) => String(email || '').trim().toLowerCase()

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {}
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, and password are required' })
    }
    const normalizedEmail = normalizeEmail(email)
    if (!normalizedEmail) {
      return res.status(400).json({ message: 'name, email, and password are required' })
    }

    if (await User.findOne({ email: normalizedEmail }))
      return res.status(400).json({ message: 'Email already registered' })

    const user = await User.create({ name, email: normalizedEmail, password })
    res.status(201).json({
      _id: user._id, name: user.name,
      email: user.email, role: user.role,
      token: generateToken(user._id, user.role),
    })
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(400).json({ message: 'Email already registered' })
    }
    res.status(500).json({ message: err.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' })
    }
    const normalizedEmail = normalizeEmail(email)
    const user = await User.findOne({ email: normalizedEmail })
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' })

    res.json({
      _id: user._id, name: user.name,
      email: user.email, role: user.role,
      token: generateToken(user._id, user.role),
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { register, login }