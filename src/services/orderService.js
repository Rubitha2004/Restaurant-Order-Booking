// src/services/orderService.js
import { API } from './authService'

const orderService = {
  placeOrder: async () => {
    const { data } = await API.post('/orders')
    return data
  },
  getOrders: async () => {
    const { data } = await API.get('/orders')
    return data
  },
}

export default orderService