import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { API } from '../services/authService'
import { useAuth } from './AuthContext'
import { toasts } from '../utils/toast'   // ← add this import

const CartContext = createContext()

export function CartProvider({ children }) {
  const { user }  = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [loading,   setLoading]   = useState(false)
  const [open,      setOpen]      = useState(false)

  const fetchCart = useCallback(async () => {
    if (!user) { setCartItems([]); return }
    try {
      setLoading(true)
      const { data } = await API.get('/cart')
      setCartItems(data)
    } catch {
      toasts.networkError()              // ← toast
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchCart() }, [fetchCart])

  const addToCart = async (foodId, foodName) => {
    if (!user) return
    try {
      await API.post('/cart', { foodId, quantity: 1 })
      await fetchCart()
      setOpen(true)
      toasts.addedToCart(foodName || 'Item')  // ← toast
    } catch {
      toasts.error('Failed to add item to cart')
    }
  }

  const removeFromCart = async (cartItemId, foodName) => {
    try {
      await API.delete(`/cart/${cartItemId}`)
      setCartItems(prev => prev.filter(i => i._id !== cartItemId))
      if (foodName) toasts.removedFromCart(foodName)  // ← toast
    } catch {
      toasts.error('Failed to remove item')
    }
  }

  const updateQuantity = async (cartItemId, newQty) => {
    if (newQty < 1) {
      const item = cartItems.find(i => i._id === cartItemId)
      return removeFromCart(cartItemId, item?.foodId?.name)
    }
    try {
      setCartItems(prev =>
        prev.map(i => i._id === cartItemId ? { ...i, quantity: newQty } : i)
      )
      await API.put(`/cart/${cartItemId}`, { quantity: newQty })
    } catch {
      toasts.error('Failed to update quantity')
      fetchCart()
    }
  }

  const clearCart = () => setCartItems([])

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)
  const cartTotal = cartItems.reduce((sum, i) =>
    sum + (i.foodId?.price || 0) * i.quantity, 0
  )

  return (
    <CartContext.Provider value={{
      cartItems, loading, open, setOpen,
      addToCart, removeFromCart, updateQuantity, clearCart,
      cartCount, cartTotal,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)