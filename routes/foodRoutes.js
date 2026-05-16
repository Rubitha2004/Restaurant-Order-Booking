const router = require('express').Router()
const { getAllFoods, addFood, updateFood, deleteFood } = require('../controllers/foodController')
const { protect, adminOnly } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

router.get('/',     getAllFoods)
router.post('/',    protect, adminOnly, upload.single('image'), addFood)
router.put('/:id',  protect, adminOnly, upload.single('image'), updateFood)
router.delete('/:id', protect, adminOnly, deleteFood)

module.exports = router