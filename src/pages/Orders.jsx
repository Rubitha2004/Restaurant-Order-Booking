import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Star } from 'lucide-react'
import orderService from '../services/orderService'
import Button from '../components/ui/Button'

const FILTERS = ['All', 'Active', 'Delivered', 'Cancelled']

function StatusBadge({ status }) {
  const s = status || 'Pending'
  const cfg =
    s === 'Cancelled'
      ? { label: 'Cancelled', cls: 'bg-red-100 text-red-700' }
      : s === 'Delivered'
        ? { label: 'Delivered', cls: 'bg-green-100 text-green-700' }
        : s === 'Preparing'
          ? { label: 'Preparing', cls: 'bg-orange-100 text-orange-700' }
          : { label: 'Pending', cls: 'bg-orange-100 text-orange-700' }

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${cfg.cls}`}>
      {cfg.label}
    </span>
  )
}

function EmptyOrdersIllustration() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className="mx-auto"
    >
      <path
        d="M28 72c0 12 10 22 22 22h22c12 0 22-10 22-22v-6H28v6Z"
        fill="#FDBA74"
        opacity="0.35"
      />
      <path
        d="M34 66h52"
        stroke="#EA580C"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M36 66c0 16 12 28 28 28s28-12 28-28"
        stroke="#EA580C"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="44" cy="78" r="4" fill="#EA580C" opacity="0.35" />
      <circle cx="60" cy="86" r="5" fill="#EA580C" opacity="0.35" />
      <circle cx="78" cy="76" r="4" fill="#EA580C" opacity="0.35" />
      <path
        d="M44 32c-6 7-6 13 0 20"
        stroke="#EA580C"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.65"
      />
      <path
        d="M60 28c-6 7-6 13 0 20"
        stroke="#EA580C"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.65"
      />
      <path
        d="M76 32c-6 7-6 13 0 20"
        stroke="#EA580C"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.65"
      />
    </svg>
  )
}

function StarRating({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(n => {
        const active = value >= n
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className="p-1 rounded-lg hover:bg-stone-50 transition"
            aria-label={`Rate ${n} star${n === 1 ? '' : 's'}`}
          >
            <Star
              className={`h-4 w-4 ${active ? 'text-orange-500' : 'text-stone-300'}`}
              fill={active ? 'currentColor' : 'none'}
            />
          </button>
        )
      })}
    </div>
  )
}

function OrderCard({ order, index, rating, onRate }) {
  const orderIdShort = String(order._id || '').slice(-8).toUpperCase()
  const isDelivered = order.orderStatus === 'Delivered'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-white rounded-2xl ring-1 ring-black/5 p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] text-stone-500 font-mono truncate" title={order._id}>
            Order #{orderIdShort}
          </p>
        </div>
        <StatusBadge status={order.orderStatus} />
      </div>

      <div className="mt-3 space-y-2">
        {order.items?.map((item, i) => (
          <div key={i} className="flex items-center text-[14px] text-stone-700">
            <span className="font-semibold tabular-nums">{item.quantity}</span>
            <span className="mx-2 w-1 h-1 rounded-full bg-stone-300" aria-hidden="true" />
            <span className="truncate">{item.name}</span>
          </div>
        ))}
      </div>

      {isDelivered && (
        <div className="mt-4 pt-4 border-t border-black/5 flex items-center justify-between">
          <p className="text-[13px] text-stone-500">Rate your delivery</p>
          <StarRating value={rating} onChange={onRate} />
        </div>
      )}

      <div className={`mt-4 flex items-center justify-between gap-3 ${isDelivered ? '' : ''}`}>
        <p className="text-[16px] font-bold text-stone-900 tabular-nums">₹{order.totalPrice}</p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="rounded-xl h-10">Reorder</Button>
          <Button variant="primary" size="sm" className="rounded-xl h-10">Track</Button>
        </div>
      </div>
    </motion.div>
  )
}

export default function Orders() {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')
  const [ratings, setRatings] = useState({})

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const data = await orderService.getOrders()
        setOrders(data)
      } catch (err) {
        setError('Failed to load orders. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const filteredOrders = useMemo(() => {
    if (activeFilter === 'All') return orders
    if (activeFilter === 'Delivered') return orders.filter(o => o.orderStatus === 'Delivered')
    if (activeFilter === 'Cancelled') return orders.filter(o => o.orderStatus === 'Cancelled')
    // Active
    return orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Preparing')
  }, [orders, activeFilter])

  const metrics = useMemo(() => {
    const totalOrders = orders.length
    const amountSpent = orders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0)

    const delivered = orders.filter(o => o.orderStatus === 'Delivered')
    const deliveredMins = delivered
      .map(o => {
        const start = new Date(o.createdAt).getTime()
        const end = new Date(o.updatedAt || o.createdAt).getTime()
        if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return null
        return Math.max(1, Math.round((end - start) / 60000))
      })
      .filter(Boolean)

    const avgDeliveryTime = deliveredMins.length
      ? Math.round(deliveredMins.reduce((a, b) => a + b, 0) / deliveredMins.length)
      : null

    return { totalOrders, amountSpent, avgDeliveryTime }
  }, [orders])

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header row */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-stone-900">My Orders</h1>

          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white ring-1 ring-black/5">
            {FILTERS.map(tab => {
              const active = activeFilter === tab
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFilter(tab)}
                  className={
                    [
                      'px-4 h-9 rounded-full text-[13px] font-semibold transition',
                      active ? 'bg-orange-600 text-white' : 'text-stone-600 hover:bg-stone-50',
                    ].join(' ')
                  }
                >
                  {tab}
                </button>
              )
            })}
          </div>
        </div>

        {/* Summary bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <div className="bg-white rounded-2xl ring-1 ring-black/5 p-4">
            <p className="text-[13px] text-stone-500">Total Orders</p>
            <p className="mt-1 text-[22px] font-bold text-stone-900 tabular-nums">{metrics.totalOrders}</p>
          </div>
          <div className="bg-white rounded-2xl ring-1 ring-black/5 p-4">
            <p className="text-[13px] text-stone-500">Amount Spent</p>
            <p className="mt-1 text-[22px] font-bold text-stone-900 tabular-nums">₹{metrics.amountSpent}</p>
          </div>
          <div className="bg-white rounded-2xl ring-1 ring-black/5 p-4">
            <p className="text-[13px] text-stone-500">Avg Delivery Time</p>
            <p className="mt-1 text-[22px] font-bold text-stone-900 tabular-nums">
              {metrics.avgDeliveryTime ? `${metrics.avgDeliveryTime} min` : '—'}
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map(n => (
              <div key={n}
                   className="bg-white rounded-2xl h-28 animate-pulse ring-1 ring-black/5" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-16">
            <p className="text-red-500 mb-4">{error}</p>
            <div className="flex justify-center">
              <Button onClick={() => window.location.reload()} size="lg">Try again</Button>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredOrders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <EmptyOrdersIllustration />
            <h3 className="text-[18px] font-semibold text-stone-700 mt-5 mb-1">
              No orders yet
            </h3>
            <p className="text-[14px] text-stone-500 mb-6">
              Place your first order and it'll show up here
            </p>
            <Link
              to="/"
              className="group inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white
                         font-semibold px-6 h-11 rounded-xl transition text-sm ring-1 ring-black/5"
            >
              Browse menu
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        )}

        {/* Orders list */}
        {!loading && !error && filteredOrders.length > 0 && (
          <div className="space-y-4">
            {filteredOrders.map((order, i) => (
              <OrderCard
                key={order._id}
                order={order}
                index={i}
                rating={ratings[order._id] || 0}
                onRate={(value) => setRatings(prev => ({ ...prev, [order._id]: value }))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}