import { motion } from 'framer-motion'
import { ShoppingCart, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const CATEGORY_COLORS = {
  'Veg':       { bg: 'bg-green-100',  text: 'text-green-700'  },
  'Non-Veg':   { bg: 'bg-red-100',    text: 'text-red-700'    },
  'Drinks':    { bg: 'bg-blue-100',   text: 'text-blue-700'   },
  'Desserts':  { bg: 'bg-pink-100',   text: 'text-pink-700'   },
  'Fast Food': { bg: 'bg-orange-100', text: 'text-orange-700' },
}

export default function FoodCard({ food }) {
  const { addToCart, cartItems } = useCart()

  const colors   = CATEGORY_COLORS[food.category] || { bg: 'bg-gray-100', text: 'text-gray-700' }
  const inCart   = cartItems.find(i => i.foodId._id === food._id)

  const navigate = useNavigate()
  const { user } = useAuth()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100
                 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col group"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {food.image ? (
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover transition-transform duration-300
                       group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            🍽️
          </div>
        )}
        {/* Category badge */}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1
                          rounded-full ${colors.bg} ${colors.text}`}>
          {food.category}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-800 text-base leading-tight line-clamp-1">
            {food.name}
          </h3>
          <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
            <Star className="h-4 w-4 fill-amber-400 stroke-amber-400" />
            <span className="text-xs text-gray-500 font-medium">4.5</span>
          </div>
        </div>

        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-4 flex-1">
          {food.description || 'A delicious item crafted with fresh ingredients.'}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-orange-500 font-bold text-lg">
            ₹{food.price}
          </span>

          <button
            onClick={() => {
              if (!user) {
                navigate('/login')
                return
              }
              addToCart(food._id, food.name)
            }}
            className={`flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2
                        rounded-xl transition duration-200
                        ${inCart
                          ? 'bg-green-50 text-green-600 border border-green-200'
                          : 'bg-orange-500 hover:bg-orange-600 text-white'
                        }`}
          >
            <ShoppingCart className="h-4 w-4" />
            {inCart ? `In cart (${inCart.quantity})` : 'Add'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}