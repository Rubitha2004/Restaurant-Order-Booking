const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    foodId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    name:     String,
    price:    Number,
    quantity: Number,
    image:    String,
  }],
  totalPrice:  { type: Number, required: true },
  orderStatus: { type: String, enum: ['Pending', 'Preparing', 'Delivered', 'Cancelled'], default: 'Pending' },
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)