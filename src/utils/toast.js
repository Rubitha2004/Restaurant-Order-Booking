import toast from 'react-hot-toast'

export const toasts = {
  success: (message, options) => toast.success(message, options),
  error: (message, options) => toast.error(message, options),

  registerSuccess: (name) => toast.success(`Welcome ${name}! Registration successful`),
  loginSuccess: (name) => toast.success(`Welcome back, ${name}!`),
  logoutSuccess: () => toast.success(`Logged out successfully`),

  foodAdded: (name) => toast.success(`"${name}" added successfully`),
  foodUpdated: (name) => toast.success(`"${name}" updated successfully`),
  foodDeleted: (name) => toast.success(`"${name}" deleted successfully`),
}
