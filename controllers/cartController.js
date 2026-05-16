const Cart = require('../models/Cart')
const Food = require('../models/Food')
const mongoose = require('mongoose')

const addToCart = async (req, res) => {
  try {
    const { foodId, quantity = 1 } = req.body
    
    // Validate foodId format and existence
    if (!foodId || !mongoose.Types.ObjectId.isValid(foodId)) {
      return res.status(400).json({ message: 'Invalid or missing foodId' })
    }
    const food = await Food.findById(foodId)
    if (!food) {
      return res.status(404).json({ message: 'Food not found' })
    }
    
    let item = await Cart.findOne({ userId: req.user._id, foodId })
    if (item) {
      item.quantity += quantity
      await item.save()
    } else {
      item = await Cart.create({ userId: req.user._id, foodId, quantity })
    }
    res.status(201).json(item)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' })
    }
    
    const item = await Cart.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    )
    if (!item) return res.status(404).json({ message: 'Item not found' })
    res.json(item)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}





const getCart = async (req, res) => {
  try {
    const items = await Cart.find({ userId: req.user._id }).populate('foodId')
    res.json(items)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const removeFromCart = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id)
    res.json({ message: 'Item removed' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { addToCart, updateCartItem, getCart, removeFromCart }