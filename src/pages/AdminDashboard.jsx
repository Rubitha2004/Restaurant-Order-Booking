import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  Plus,
  Pencil,
  Trash2,
  UtensilsCrossed,
  LogOut,
  Search,
  TriangleAlert,
  LayoutDashboard,
  ShoppingBag,
} from 'lucide-react'
import foodService from '../services/foodService'
import { useAuth } from '../context/AuthContext'
import { toasts } from '../utils/toast'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'

// Confirm delete modal
function DeleteModal({ food, onConfirm, onCancel, deleting }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50
                    flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl ring-1 ring-black/5 p-6 max-w-sm w-full"
      >
        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center
                          justify-center shrink-0 mt-0.5">
            <TriangleAlert className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Delete food item?</h3>
            <p className="text-gray-500 text-sm mt-1">
              <span className="font-medium text-gray-700">{food?.name}</span> will
              be permanently removed from the menu.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={onCancel} disabled={deleting} variant="ghost" className="flex-1">
            Cancel
          </Button>
          <Button onClick={onConfirm} loading={deleting} disabled={deleting} variant="danger" className="flex-1">
            Delete
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [foods,       setFoods]       = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [search,      setSearch]      = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null) // food to delete
  const [deleting,    setDeleting]    = useState(false)

  // Redirect non-admins
  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/', { replace: true })
  }, [user, navigate])

  useEffect(() => {
    fetchFoods()
  }, [])

  const fetchFoods = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await foodService.getAllFoods()
      setFoods(data)
    } catch {
      setError('Failed to load food items.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      setDeleting(true)
      await foodService.deleteFood(deleteTarget._id)
      setFoods(prev => prev.filter(f => f._id !== deleteTarget._id))
      toasts.foodDeleted(deleteTarget.name)
      setDeleteTarget(null)
    } catch {
      toasts.error('Failed to delete item')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = foods.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase())
  )

  // Summary stats
  const stats = [
    { label: 'Total Items',   value: foods.length,
      icon: UtensilsCrossed, color: 'bg-orange-50 text-orange-600' },
    { label: 'Veg',           value: foods.filter(f => f.category === 'Veg').length,
      icon: ShoppingBag,    color: 'bg-green-50 text-green-600' },
    { label: 'Non-Veg',       value: foods.filter(f => f.category === 'Non-Veg').length,
      icon: ShoppingBag,    color: 'bg-red-50 text-red-600' },
    { label: 'Categories',    value: [...new Set(foods.map(f => f.category))].length,
      icon: LayoutDashboard,      color: 'bg-blue-50 text-blue-600' },
  ]

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Delete modal */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal
            food={deleteTarget}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            deleting={deleting}
          />
        )}
      </AnimatePresence>

      {/* Sidebar + content layout */}
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-60 bg-white border-r
                          border-gray-100 fixed h-full">
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-5 py-5 border-b
                          border-gray-100">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center
                            justify-center">
              <UtensilsCrossed className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-800">FoodApp</span>
            <span className="text-xs bg-orange-100 text-orange-600 font-semibold
                             px-1.5 py-0.5 rounded-md ml-auto">Admin</span>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                            bg-orange-50 text-orange-600">
              <LayoutDashboard className="h-4 w-4" />
              <span className="text-sm font-semibold">Dashboard</span>
            </div>
            <Link
              to="/admin/add-food"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                         text-gray-600 hover:bg-gray-50 transition"
            >
              <Plus className="h-4 w-4" />
              <span className="text-sm font-medium">Add Food</span>
            </Link>
          </nav>

          {/* User + logout */}
          <div className="px-4 py-4 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center
                              justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 text-sm text-gray-500
                         hover:text-red-500 transition px-2 py-1.5 rounded-lg
                         hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 md:ml-60">

          {/* Top bar */}
          <div className="bg-white border-b border-gray-100 px-6 py-4
                          flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Food Management</h1>
              <p className="text-gray-400 text-sm">
                Manage your restaurant menu
              </p>
            </div>
            <Link
              to="/admin/add-food"
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600
                         text-white text-sm font-semibold px-4 py-2.5 rounded-xl
                         transition duration-200 shrink-0"
            >
              <Plus className="h-4 w-4" />
              Add Food
            </Link>
          </div>

          <div className="p-6 space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <Card
                  as={motion.div}
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center
                                   justify-center mb-3 ${s.color}`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
                </Card>
              ))}
            </div>

            {/* Search */}
            <Card className="p-4 hover:scale-100">
              <Input
                label="Search by name or category"
                value={search}
                onChange={e => setSearch(e.target.value)}
                icon={Search}
              />
            </Card>

            {/* Table */}
            <Card className="overflow-hidden hover:scale-100">

              {/* Table header */}
              <div className="px-5 py-3.5 border-b border-gray-100 flex
                              items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">
                  {filtered.length} item{filtered.length !== 1 ? 's' : ''}
                  {search && ` matching "${search}"`}
                </p>
              </div>

              {/* Loading skeleton */}
              {loading && (
                <div className="divide-y divide-gray-50">
                  {[1, 2, 3, 4].map(n => (
                    <div key={n}
                         className="flex items-center gap-4 px-5 py-4
                                    animate-pulse">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 bg-gray-100 rounded w-1/3" />
                        <div className="h-3 bg-gray-100 rounded w-1/4" />
                      </div>
                      <div className="h-6 w-16 bg-gray-100 rounded-full" />
                      <div className="h-4 w-12 bg-gray-100 rounded" />
                      <div className="flex gap-2">
                        <div className="h-8 w-16 bg-gray-100 rounded-xl" />
                        <div className="h-8 w-16 bg-gray-100 rounded-xl" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Error */}
              {error && !loading && (
                <div className="text-center py-16">
                  <p className="text-red-500 text-sm mb-3">{error}</p>
                  <button
                    onClick={fetchFoods}
                    className="text-orange-500 text-sm font-medium hover:underline"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Empty */}
              {!loading && !error && filtered.length === 0 && (
                <div className="text-center py-16">
                  <span className="text-5xl">🍽️</span>
                  <p className="text-gray-500 mt-3 font-medium">
                    {search ? 'No items match your search' : 'No food items yet'}
                  </p>
                  {!search && (
                    <Link
                      to="/admin/add-food"
                      className="inline-block mt-4 text-orange-500 text-sm
                                 font-semibold hover:underline"
                    >
                      Add your first item →
                    </Link>
                  )}
                </div>
              )}

              {/* Rows */}
              {!loading && !error && filtered.length > 0 && (
                <>
                  {/* Desktop table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-stone-50 border-b border-black/5">
                          <th className="text-left px-5 py-3 text-xs font-semibold
                                         text-stone-500 uppercase tracking-wider">
                            Item
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold
                                         text-stone-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold
                                         text-stone-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold
                                         text-stone-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="text-right px-5 py-3 text-xs font-semibold
                                         text-stone-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5">
                        <AnimatePresence>
                          {filtered.map((food, i) => (
                            <motion.tr
                              key={food._id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ delay: i * 0.03 }}
                              className="hover:bg-stone-50 transition-colors"
                            >
                              {/* Name + image */}
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-xl overflow-hidden
                                                  bg-stone-100 shrink-0">
                                    {food.image ? (
                                      <img
                                        src={food.image}
                                        alt={food.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center
                                                      justify-center text-xl">🍽️</div>
                                    )}
                                  </div>
                                  <span className="font-semibold text-gray-800">
                                    {food.name}
                                  </span>
                                </div>
                              </td>

                              {/* Category */}
                              <td className="px-4 py-4">
                                <Badge variant={food.category}>{food.category}</Badge>
                              </td>

                              {/* Price */}
                              <td className="px-4 py-4">
                                <span className="font-bold text-orange-500">
                                  ₹{food.price}
                                </span>
                              </td>

                              {/* Description */}
                              <td className="px-4 py-4 max-w-xs">
                                <p className="text-stone-500 text-xs truncate">
                                  {food.description || '—'}
                                </p>
                              </td>

                              {/* Actions */}
                              <td className="px-5 py-4">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    onClick={() => navigate(`/admin/edit-food/${food._id}`)}
                                    variant="ghost"
                                    size="sm"
                                  >
                                    <Pencil className="h-4 w-4" />
                                    Edit
                                  </Button>
                                  <Button
                                    onClick={() => setDeleteTarget(food)}
                                    variant="danger"
                                    size="sm"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </Button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="md:hidden divide-y divide-black/5">
                    {filtered.map((food, i) => (
                      <motion.div
                        key={food._id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-3 px-4 py-4"
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden
                                        bg-stone-100 shrink-0">
                          {food.image ? (
                            <img
                              src={food.image}
                              alt={food.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center
                                            justify-center text-2xl">🍽️</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm truncate">
                            {food.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={food.category} className="text-[12px] px-2 py-0.5">
                              {food.category}
                            </Badge>
                            <span className="text-orange-500 font-bold text-xs">
                              ₹{food.price}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Button
                            onClick={() => navigate(`/admin/edit-food/${food._id}`)}
                            variant="ghost"
                            size="sm"
                            className="px-2"
                            aria-label="Edit food"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => setDeleteTarget(food)}
                            variant="danger"
                            size="sm"
                            className="px-2"
                            aria-label="Delete food"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}