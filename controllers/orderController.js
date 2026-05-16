const Order = require('../models/Order')
const Cart  = require('../models/Cart')

const placeOrder = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user._id }).populate('foodId')
    if (!cartItems.length)
      return res.status(400).json({ message: 'Cart is empty' })

    const items = cartItems.map(i => ({
      foodId:   i.foodId._id,
      name:     i.foodId.name,
      price:    i.foodId.price,
      quantity: i.quantity,
      image:    i.foodId.image,
    }))

    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const order = await Order.create({ userId: req.user._id, items, totalPrice })

    // Clear cart after order
    await Cart.deleteMany({ userId: req.user._id })
    res.status(201).json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getOrders = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { userId: req.user._id }
    const orders = await Order.find(query).sort({ createdAt: -1 }).populate('userId', 'name email')
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { placeOrder, getOrders }