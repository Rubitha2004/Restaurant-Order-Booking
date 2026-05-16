import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, UtensilsCrossed, UploadCloud, X, Check } from 'lucide-react'
import foodService from '../services/foodService'
import { toasts } from '../utils/toast'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'

const CATEGORIES = ['Veg', 'Non-Veg', 'Drinks', 'Desserts', 'Fast Food']

const INITIAL = {
  name: '', price: '', category: '', description: '',
}

export default function AddFood() {
  const navigate = useNavigate()
  const [form,        setForm]        = useState(INITIAL)
  const [image,       setImage]       = useState(null)   // File object
  const [preview,     setPreview]     = useState(null)   // Data URL
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setFieldErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleImage = e => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setFieldErrors(prev => ({ ...prev, image: 'Image must be under 5MB' }))
      return
    }
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      setFieldErrors(prev => ({ ...prev, image: 'Only JPG, PNG, or WebP allowed' }))
      return
    }

    setImage(file)
    setFieldErrors(prev => ({ ...prev, image: '' }))

    // Generate local preview
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const clearImage = () => {
    setImage(null)
    setPreview(null)
  }

  const validate = () => {
    const errors = {}
    if (!form.name.trim())     errors.name     = 'Name is required'
    if (!form.price)           errors.price    = 'Price is required'
    if (Number(form.price) <= 0) errors.price  = 'Price must be greater than 0'
    if (!form.category)        errors.category = 'Category is required'
    return errors
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errors = validate()
    if (Object.keys(errors).length) { setFieldErrors(errors); return }

    try {
      setLoading(true)
      setError(null)

      const fd = new FormData()
      fd.append('name',        form.name.trim())
      fd.append('price',       form.price)
      fd.append('category',    form.category)
      fd.append('description', form.description.trim())
      if (image) fd.append('image', image)

      await foodService.addFood(fd)
      toasts.foodAdded(form.name)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add food item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            to="/admin"
            className="text-stone-500 hover:text-stone-700 transition p-2 rounded-[10px]
                       hover:bg-white ring-1 ring-black/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-orange-600 rounded-[12px] flex items-center justify-center ring-1 ring-black/5">
              <UtensilsCrossed className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-[24px] font-bold text-stone-900">Add Food Item</h1>
              <p className="text-stone-500 text-[14px]">
                Fill in the details below
              </p>
            </div>
          </div>
        </div>

        <Card
          as={motion.div}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 space-y-6"
        >

          {/* Global error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="px-4 py-3 bg-red-600/10 ring-1 ring-red-600/15">
                <p className="text-[14px] font-medium text-red-700">{error}</p>
              </Card>
            </motion.div>
          )}

          {/* Image upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Food Image
            </label>

            {preview ? (
              <div className="relative w-full h-52 rounded-xl overflow-hidden
                              ring-1 ring-black/5">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70
                             text-white rounded-full flex items-center justify-center
                             transition"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white
                                text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {image?.name}
                </div>
              </div>
            ) : (
              <label
                htmlFor="image-upload"
                className={`flex flex-col items-center justify-center w-full h-40
                            rounded-xl border-2 border-dashed cursor-pointer
                            transition duration-200 group
                            ${fieldErrors.image
                              ? 'border-red-300 bg-red-50'
                              : 'border-black/10 hover:border-orange-500/60 bg-white hover:bg-orange-600/5'
                            }`}
              >
                <UploadCloud
                  className={`h-10 w-10 mb-2 transition
                    ${fieldErrors.image ? 'text-red-600' : 'text-stone-400 group-hover:text-orange-600'}`}
                />
                <p className={`text-[14px] font-semibold
                  ${fieldErrors.image ? 'text-red-700' : 'text-stone-700'}`}>
                  Click to upload image
                </p>
                <p className="text-stone-400 text-[13px] mt-1">
                  JPG, PNG, WebP · max 5MB
                </p>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImage}
                />
              </label>
            )}
            {fieldErrors.image && (
              <p className="text-red-500 text-xs mt-1.5">{fieldErrors.image}</p>
            )}
          </div>

          {/* Name */}
          <Field
            label="Food Name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Margherita Pizza"
            error={fieldErrors.name}
            required
          />

          {/* Price + Category row */}
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Price (₹)"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="299"
              error={fieldErrors.price}
              min="1"
              required
            />

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`w-full h-11 px-3 rounded-[10px] ring-1 ring-black/10 bg-white
                            text-[14px] text-stone-900 focus:outline-none
                            focus:ring-2 focus:ring-orange-500/25 transition appearance-none
                            ${fieldErrors.category
                              ? 'ring-red-600/25 bg-red-50'
                              : ''}`}
              >
                <option value="">Select category</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {fieldErrors.category && (
                <p className="text-red-500 text-xs mt-1.5">{fieldErrors.category}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Description
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the dish — ingredients, taste, etc."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-[10px] ring-1 ring-black/10
                         text-[14px] text-stone-900 placeholder-stone-400 resize-none
                         focus:outline-none focus:ring-2 focus:ring-orange-500/25
                         transition"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Link to="/admin" className="flex-1">
              <Button variant="ghost" size="lg" className="w-full">Cancel</Button>
            </Link>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              loading={loading}
              variant="primary"
              size="lg"
              className="flex-1"
            >
              <Check className="h-4 w-4" />
              Add item
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

// Reusable field component used by both pages
export function Field({
  label, name, type = 'text', value, onChange,
  placeholder, error, required, min,
}) {
  return (
    <Input
      type={type}
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      error={error}
      min={min}
    />
  )
}