import { API } from './authService'

const foodService = {
  getAllFoods: async () => {
    const { data } = await API.get('/foods')
    return data
  },

  addFood: async (formData) => {
    const { data } = await API.post('/foods', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  updateFood: async (id, formData) => {
    const { data } = await API.put(`/foods/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  deleteFood: async (id) => {
    const { data } = await API.delete(`/foods/${id}`)
    return data
  },
}

export default foodService