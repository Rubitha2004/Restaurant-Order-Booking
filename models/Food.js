const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  price:       { type: Number, required: true, min: 0 },
  category:    { type: String, required: true, enum: ['Veg', 'Non-Veg', 'Drinks', 'Desserts', 'Fast Food'] },
  description: { type: String, default: '' },
  image:       { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('Food', foodSchema)