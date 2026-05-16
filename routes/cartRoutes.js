const router = require('express').Router()
const { addToCart, updateCartItem, getCart, removeFromCart } = require('../controllers/cartController')
const { protect } = require('../middleware/authMiddleware')

router.post('/',     protect, addToCart)
router.get('/',      protect, getCart)
router.put('/:id',   protect, updateCartItem)
router.delete('/:id', protect, removeFromCart)

module.exports = router