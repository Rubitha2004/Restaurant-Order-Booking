const mongoose = require('mongoose')
const Food = require('../models/Food')

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)

const sendServerError = (res, err) => {
  if (err?.name === 'ValidationError') {
    return res.status(400).json({ message: err.message })
  }
  return res.status(500).json({ message: err.message || 'Server error' })
}

const getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 })
    res.json(foods)
  } catch (err) {
    sendServerError(res, err)
  }
}

const addFood = async (req, res) => {
  try {
    const { name, price, category, description } = req.body
    if (!name || price === undefined || !category) {
      return res.status(400).json({ message: 'name, price, and category are required' })
    }

    const image = req.file?.path || ''
    const food = await Food.create({ name, price, category, description, image })
    res.status(201).json(food)
  } catch (err) {
    sendServerError(res, err)
  }
}

const updateFood = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid food id' })
    }

    const food = await Food.findById(req.params.id)
    if (!food) return res.status(404).json({ message: 'Food not found' })

    const { name, price, category, description } = req.body
    if (name !== undefined) food.name = name
    if (price !== undefined) food.price = price
    if (category !== undefined) food.category = category
    if (description !== undefined) food.description = description
    if (req.file?.path) food.image = req.file.path

    const updated = await food.save()
    res.json(updated)
  } catch (err) {
    sendServerError(res, err)
  }
}

const deleteFood = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid food id' })
    }

    const food = await Food.findByIdAndDelete(req.params.id)
    if (!food) return res.status(404).json({ message: 'Food not found' })
    res.json({ message: 'Food deleted' })
  } catch (err) {
    sendServerError(res, err)
  }
}

module.exports = { getAllFoods, addFood, updateFood, deleteFood }