import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Button from './ui/Button'

export default function CartSidebar() {
  const {
    cartItems,
    open,
    setOpen,
    removeFromCart,
    updateQuantity,
    cartCount,
    cartTotal,
  } = useCart()
  const { user } = useAuth()

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white ring-1 ring-black/5 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-orange-600" />
                <h2 className="font-bold text-stone-900 text-[20px]">Your Cart</h2>
                {cartCount > 0 && (
                  <span className="bg-orange-600 text-white text-[13px] font-bold w-6 h-6 rounded-full flex items-center justify-center ring-1 ring-black/5">
                    {cartCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-stone-500 hover:text-stone-700 transition p-2 rounded-[10px] hover:bg-stone-900/5"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center pb-10">
                  <span className="text-6xl mb-4">🛒</span>
                  <p className="text-stone-500 font-medium">Your cart is empty</p>
                  <p className="text-stone-400 text-[14px] mt-1">Add some delicious dishes!</p>
                  <button
                    onClick={() => setOpen(false)}
                    className="mt-4 text-orange-600 text-[14px] font-semibold hover:underline"
                  >
                    Browse menu →
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-3 bg-stone-50 rounded-[16px] p-3 ring-1 ring-black/5"
                    >
                      {/* Food image */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                        {item.foodId?.image ? (
                          <img
                            src={item.foodId.image}
                            alt={item.foodId.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate">{item.foodId?.name}</p>
                        <p className="text-orange-500 font-bold text-sm mt-0.5">₹{item.foodId?.price}</p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full bg-white ring-1 ring-black/10 flex items-center justify-center text-stone-600 hover:text-orange-600 transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="text-sm font-semibold text-gray-700 w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full bg-white ring-1 ring-black/10 flex items-center justify-center text-stone-600 hover:text-orange-600 transition"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </button>

                          {/* Subtotal */}
                          <span className="ml-auto text-xs text-gray-500 font-medium">
                            ₹{(item.foodId?.price || 0) * item.quantity}
                          </span>

                          {/* Remove */}
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-stone-400 hover:text-red-600 transition"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer — total + checkout */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-100 px-5 py-5 space-y-4">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal ({cartCount} items)</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery fee</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-orange-500">₹{cartTotal}</span>
                  </div>
                </div>

                {user ? (
                  <Link to="/cart" onClick={() => setOpen(false)}>
                    <Button variant="primary" size="lg" className="w-full">
                      Proceed to checkout
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <Button variant="primary" size="lg" className="w-full">
                      Login to checkout
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
