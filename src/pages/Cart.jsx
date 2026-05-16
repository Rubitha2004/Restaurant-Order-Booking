import { motion } from 'framer-motion'
import { Plus, Minus, Trash2, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import orderService from '../services/orderService'
import { useState } from 'react'
import { toasts } from '../utils/toast'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity,
          cartTotal, cartCount, clearCart } = useCart()
  const [placing, setPlacing] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handlePlaceOrder = async () => {
  try {
    setPlacing(true)
    await orderService.placeOrder()
    clearCart()
    toasts.orderPlaced()           // ← toast
    setSuccess(true)
    setTimeout(() => navigate('/orders'), 2000)
  } catch {
    toasts.orderFailed()           // ← toast
  } finally {
    setPlacing(false)
  }
}
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <Card className="px-10 py-10">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-[24px] font-bold text-stone-900 mb-2">
            Order Placed!
            </h2>
            <p className="text-stone-500">Redirecting to your orders...</p>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="text-7xl mb-4">🛒</div>
          <h2 className="text-[20px] font-bold text-stone-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-stone-500 mb-6">
            Add some dishes to get started
          </p>
          <Link to="/">
            <Button variant="primary" size="lg">Browse menu</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            to="/"
            className="text-stone-500 hover:text-stone-700 transition p-2
                       rounded-[10px] hover:bg-white ring-1 ring-black/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-[24px] font-bold text-stone-900">Your Cart</h1>
            <p className="text-stone-500 text-[14px]">
              {cartCount} item{cartCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item, i) => (
              <Card
                as={motion.div}
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 flex gap-4"
              >
                {/* Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden
                                bg-gray-100 shrink-0">
                  {item.foodId?.image ? (
                    <img
                      src={item.foodId.image}
                      alt={item.foodId.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center
                                    justify-center text-3xl">🍽️</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {item.foodId?.name}
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {item.foodId?.category}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-stone-400 hover:text-red-600 transition p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity */}
                    <div className="flex items-center gap-2 bg-gray-50
                                    rounded-xl px-3 py-1.5 border border-gray-100">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                        className="text-stone-500 hover:text-orange-600 transition"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-bold text-gray-700 w-5
                                       text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                        className="text-stone-500 hover:text-orange-600 transition"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Line total */}
                    <p className="font-bold text-orange-500">
                      ₹{(item.foodId?.price || 0) * item.quantity}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <Card className="p-5 sticky top-6">
              <h2 className="font-bold text-stone-900 text-[20px] mb-4">
                Order Summary
              </h2>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Tax (5%)</span>
                  <span>₹{Math.round(cartTotal * 0.05)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex
                                justify-between font-bold text-gray-800 text-base">
                  <span>Total</span>
                  <span className="text-orange-500">
                    ₹{cartTotal + Math.round(cartTotal * 0.05)}
                  </span>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={placing}
                loading={placing}
                variant="primary"
                size="lg"
                className="w-full"
              >
                Place order
              </Button>

              <Link
                to="/"
                className="block text-center text-orange-600 text-[14px]
                           font-medium mt-3 hover:underline"
              >
                ← Continue shopping
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}