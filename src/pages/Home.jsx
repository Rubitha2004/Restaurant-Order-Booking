import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UtensilsCrossed, SearchX } from 'lucide-react'
import FoodCard from '../components/FoodCard'
import Loader from '../components/Loader'
import foodService from '../services/foodService'

export default function Home({ searchValue = '', activeCategory = 'All' }) {
  const [foods,    setFoods]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true)
        const data = await foodService.getAllFoods()
        setFoods(data)
      } catch (err) {
        setError('Failed to load menu. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchFoods()
  }, [])

  // Filter + search — recomputed only when deps change
  const filtered = useMemo(() => {
    return foods
      .filter(f => activeCategory === 'All' || f.category === activeCategory)
      .filter(f => f.name.toLowerCase().includes(searchValue.toLowerCase()))
  }, [foods, activeCategory, searchValue])

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero banner */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <UtensilsCrossed className="h-7 w-7 text-orange-200" />
              <span className="text-orange-200 text-sm font-medium uppercase tracking-wider">
                Today's Menu
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">
              What are you craving?
            </h1>
            <p className="text-orange-100 text-base md:text-lg mb-8 max-w-2xl">
              Fresh ingredients, bold flavours — delivered to your door.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Results count */}
        {!loading && !error && (
          <p className="text-gray-500 text-sm mb-6">
            {filtered.length === 0
              ? 'No dishes found'
              : `${filtered.length} dish${filtered.length !== 1 ? 'es' : ''} available`
            }
            {activeCategory !== 'All' && ` in ${activeCategory}`}
            {searchValue && ` matching "${searchValue}"`}
          </p>
        )}

        {/* States */}
        {loading && (
          <div className="flex justify-center py-24">
            <Loader />
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-24">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-orange-500 text-white px-6 py-2 rounded-xl
                         hover:bg-orange-600 transition text-sm font-medium"
            >
              Try again
            </button>
          </div>
        )}

        {/* Food grid */}
        {!loading && !error && (
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                key={`${activeCategory}-${searchValue}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3
                           lg:grid-cols-4 gap-6"
              >
                {filtered.map(food => (
                  <FoodCard key={food._id} food={food} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-16 md:py-24"
              >
                <div className="max-w-md mx-auto bg-white border border-gray-100 rounded-2xl shadow-sm px-8 py-10 text-center">
                  <div className="mx-auto mb-4 h-14 w-14 rounded-[24px] bg-stone-900/5 ring-1 ring-black/5 flex items-center justify-center">
                    <SearchX className="h-7 w-7 text-stone-500" aria-hidden="true" />
                  </div>
                  <h3 className="text-gray-800 font-bold text-xl mb-1">
                    Nothing found
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Try a different search or category
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}