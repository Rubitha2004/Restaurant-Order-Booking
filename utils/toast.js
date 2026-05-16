import toast from 'react-hot-toast'

export const toastSuccess = (msg) => toast.success(msg)
export const toastError   = (msg) => toast.error(msg)
export const toastLoading = (msg) => toast.loading(msg)
export const toastDismiss = (id)  => toast.dismiss(id)

// Named toasts used across the app
export const toasts = {
  // Auth
  loginSuccess:    (name)  => toast.success(`Welcome back, ${name}! 👋`),
  registerSuccess: (name)  => toast.success(`Account created! Welcome, ${name} 🎉`),
  logoutSuccess:   ()      => toast.success('Signed out successfully'),

  // Cart
  addedToCart:     (name)  => toast.success(`${name} added to cart 🛒`),
  removedFromCart: (name)  => toast.success(`${name} removed from cart`),
  cartUpdated:     ()      => toast.success('Cart updated'),

  // Orders
  orderPlaced:     ()      => toast.success('Order placed successfully! 🎉', {
    duration: 4000,
  }),
  orderFailed:     ()      => toast.error('Failed to place order. Please try again.'),

  // Food (admin)
  foodAdded:       (name)  => toast.success(`"${name}" added to menu ✅`),
  foodUpdated:     (name)  => toast.success(`"${name}" updated successfully`),
  foodDeleted:     (name)  => toast.success(`"${name}" deleted`),

  // Generic
  error:           (msg)   => toast.error(msg || 'Something went wrong'),
  networkError:    ()      => toast.error('Network error — check your connection'),
}