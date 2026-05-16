import { useMemo, useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  ShoppingCart,
  LogOut,
  Receipt,
  Menu,
  X,
  ChevronDown,
  ListFilter,
  User,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const CATEGORIES = ['All', 'Veg', 'Non-Veg', 'Drinks', 'Desserts', 'Fast Food']

// Hook — close dropdown when clicking outside
function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = e => {
      if (!ref.current || ref.current.contains(e.target)) return
      handler()
    }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [ref, handler])
}

export default function Navbar({
  // These props are optional — wire them up in Home.jsx if you want
  // the Navbar to own search/filter state, or keep them in Home.jsx
  searchValue    = '',
  onSearchChange = () => {},
  activeCategory = 'All',
  onCategoryChange = () => {},
}) {
  const { user, logout }       = useAuth()
  const { cartCount, setOpen } = useCart()

  const [mobileOpen,    setMobileOpen]    = useState(false)
  const [profileOpen,   setProfileOpen]   = useState(false)
  const [filterOpen,    setFilterOpen]    = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [scrolled,      setScrolled]      = useState(false)

  const profileRef = useRef(null)
  const filterRef  = useRef(null)

  useClickOutside(profileRef, () => setProfileOpen(false))
  useClickOutside(filterRef,  () => setFilterOpen(false))

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
    setMobileOpen(false)
  }

  const handleCategorySelect = (cat) => {
    onCategoryChange(cat)
    setFilterOpen(false)
  }

  const initials = useMemo(() => {
    const name = String(user?.name || '').trim()
    if (!name) return 'U'
    const parts = name.split(/\s+/).filter(Boolean)
    const first = parts[0]?.[0] || 'U'
    const second = parts.length > 1 ? parts[1]?.[0] : ''
    return `${first}${second}`.toUpperCase()
  }, [user?.name])

  return (
    <>
      <nav className={`sticky top-0 z-30 bg-white transition-colors ${scrolled ? 'border-b border-stone-100' : 'border-b border-transparent'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 h-16">

            {/* ── Logo ── */}
            <Link
              to="/"
              className="flex items-center gap-2 shrink-0 mr-2"
              onClick={() => setMobileOpen(false)}
            >
              <div className="w-8 h-8 bg-orange-600 rounded-xl flex items-center justify-center ring-1 ring-black/5">
                <X className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-stone-900 text-lg hidden sm:block">
                FoodApp
              </span>
            </Link>

            {/* ── Search bar (desktop) ── */}
            <div className={`hidden md:flex items-center flex-1 max-w-md relative transition-all duration-200 ${searchFocused ? 'max-w-lg' : ''}`}>
              <Search className="absolute left-4 text-stone-400 h-4 w-4 pointer-events-none" />
              <input
                type="text"
                value={searchValue}
                onChange={e => onSearchChange(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search dishes..."
                className="w-full pl-11 pr-20 py-2.5 rounded-full ring-1 ring-black/5
                           bg-stone-50 text-stone-800 text-sm placeholder-stone-400
                           focus:outline-none focus:ring-2 focus:ring-orange-500/25 transition"
              />
              <span className="absolute right-3 inline-flex items-center gap-1 text-[11px] font-semibold text-stone-400">
                <kbd className="px-2 py-1 rounded-full bg-white ring-1 ring-black/5">⌘K</kbd>
              </span>
            </div>

            {/* ── Filter dropdown (desktop) ── */}
            <div className="hidden md:block relative" ref={filterRef}>
              <button
                onClick={() => setFilterOpen(o => !o)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
                           ring-1 ring-black/5 bg-white text-stone-700 hover:bg-stone-50 transition"
              >
                <ListFilter className="h-4 w-4" />
                <span>Filter</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${filterOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {filterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-2 left-0 w-72 bg-white
                               rounded-2xl ring-1 ring-black/5 shadow-sm
                               p-3 z-50"
                  >
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map(cat => {
                        const active = activeCategory === cat
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => handleCategorySelect(cat)}
                            className={
                              [
                                'px-3 h-9 rounded-full text-[13px] font-semibold transition ring-1',
                                active
                                  ? 'bg-orange-600 text-white ring-black/5'
                                  : 'bg-white text-stone-700 ring-black/10 hover:ring-black/15 hover:bg-stone-50',
                              ].join(' ')
                            }
                          >
                            {cat}
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Spacer ── */}
            <div className="flex-1 md:flex-none" />

            {/* ── Right side actions ── */}
            <div className="flex items-center gap-1">

              {/* Cart button */}
              <button
                onClick={() => setOpen(true)}
                className="relative flex items-center justify-center w-10 h-10
                           rounded-xl hover:bg-orange-50 text-gray-600
                           hover:text-orange-500 transition duration-200"
                aria-label="Open cart"
              >
                <ShoppingCart className="h-5 w-5" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px]
                                 bg-orange-500 text-white text-[10px] font-bold
                                 rounded-full flex items-center justify-center
                                 px-1 leading-none"
                    >
                      {cartCount > 99 ? '99+' : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Profile / Login */}
              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(o => !o)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5
                               rounded-xl hover:bg-gray-100 transition duration-200"
                  >
                    {/* Avatar */}
                    <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center
                                    justify-center text-white text-xs font-bold shrink-0">
                      {initials}
                    </div>
                    <span className="hidden sm:block text-sm font-medium
                                     text-gray-700 max-w-[80px] truncate">
                      {user.name?.split(' ')[0]}
                    </span>
                    <ChevronDown
                      className={`text-stone-400 h-4 w-4 transition-transform duration-200 hidden sm:block ${profileOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-white
                                   rounded-2xl border border-gray-100 shadow-lg
                                   py-1.5 z-50 overflow-hidden"
                      >
                        <div className="py-1">
                          <button
                            type="button"
                            onClick={() => setProfileOpen(false)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm
                                       text-stone-700 hover:bg-stone-50 transition"
                          >
                            <User className="h-4 w-4 text-stone-400" />
                            Profile
                          </button>
                          <Link
                            to="/orders"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm
                                       text-stone-700 hover:bg-stone-50 transition"
                          >
                            <Receipt className="h-4 w-4 text-stone-400" />
                            My Orders
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5
                                       text-sm text-red-600 hover:bg-red-50 transition"
                          >
                            <LogOut className="h-4 w-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="hidden sm:block text-sm font-medium text-gray-600
                               hover:text-orange-500 transition px-3 py-2 rounded-xl
                               hover:bg-orange-50"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm font-semibold bg-orange-500 hover:bg-orange-600
                               text-white px-4 py-2 rounded-xl transition duration-200"
                  >
                    Sign up
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(o => !o)}
                className="md:hidden flex items-center justify-center w-10 h-10
                           rounded-xl hover:bg-gray-100 text-gray-600 transition ml-1"
                aria-label="Toggle menu"
              >
                {mobileOpen
                  ? <X className="h-5 w-5" />
                  : <Menu className="h-5 w-5" />
                }
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-gray-100 bg-white"
            >
              <div className="px-4 py-4 space-y-4">

                {/* Mobile search */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 h-5 w-5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={e => onSearchChange(e.target.value)}
                    placeholder="Search dishes..."
                    className="w-full pl-11 pr-4 py-2.5 rounded-full ring-1 ring-black/5
                               bg-stone-50 text-stone-800 text-sm placeholder-stone-400
                               focus:outline-none focus:ring-2 focus:ring-orange-500/25"
                  />
                </div>

                {/* Mobile category pills */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase
                                tracking-wider mb-2.5">
                    Categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => {
                          handleCategorySelect(cat)
                          setMobileOpen(false)
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full
                                    text-xs font-semibold border transition
                                    ${activeCategory === cat
                                      ? 'bg-orange-500 text-white border-orange-500'
                                      : 'border-gray-200 text-gray-600 hover:border-orange-400'
                                    }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile nav links */}
                <div className="border-t border-gray-100 pt-3 space-y-1">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 px-2 py-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center
                                        justify-center text-white text-sm font-bold">
                          {initials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>

                      <Link
                        to="/orders"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                                   text-sm text-gray-600 hover:bg-gray-50 transition"
                      >
                        <Receipt className="h-4 w-4 text-stone-400" />
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                                   text-sm text-red-500 hover:bg-red-50 transition"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </>
                  ) : (
                    <div className="flex gap-3">
                      <Link
                        to="/login"
                        onClick={() => setMobileOpen(false)}
                        className="flex-1 text-center text-sm font-medium text-gray-600
                                   border border-gray-200 py-2.5 rounded-xl
                                   hover:bg-gray-50 transition"
                      >
                        Sign in
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMobileOpen(false)}
                        className="flex-1 text-center text-sm font-semibold
                                   bg-orange-500 text-white py-2.5 rounded-xl
                                   hover:bg-orange-600 transition"
                      >
                        Sign up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}