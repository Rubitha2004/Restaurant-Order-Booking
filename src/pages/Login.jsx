import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { Eye, EyeOff, LockKeyhole, Mail, UtensilsCrossed } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function Login() {
  const { login, loading, error } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const controls = useAnimationControls()

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    login(form.email, form.password)
  }

  useEffect(() => {
    if (!error) return
    controls.start({ x: [0, -10, 10, -8, 8, -4, 4, 0] })
  }, [error, controls])

  return (
    <div className="min-h-screen flex">

      {/* Left panel — brand */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-[45%] bg-orange-600 flex-col items-center justify-center p-16 relative overflow-hidden flex"
      >
        <UtensilsCrossed className="h-16 w-16 text-white mb-6 relative z-10" />
        <h1 className="text-white text-[36px] font-bold text-center leading-tight relative z-10">
          Good food, great vibes.
        </h1>
        <p className="text-white/70 text-[16px] mt-4 text-center relative z-10">
          Order your favourites in just a few clicks.
        </p>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
          {['Free delivery', '100+ dishes', 'Secure pay'].map((label, idx) => (
            <motion.div
              key={label}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.12 }}
              className="inline-flex items-center rounded-full px-4 py-2 text-[13px] font-semibold text-white bg-white/20"
            >
              {label}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right panel — form */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-[55%] bg-white flex items-center justify-center"
      >
        <div className="w-full max-w-sm mx-auto px-8">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center justify-center gap-2 mb-8"
          >
            <UtensilsCrossed className="h-5 w-5 text-orange-600" />
            <span className="text-[18px] font-bold text-orange-600">FoodApp</span>
          </motion.div>

          <h2 className="text-[24px] font-semibold text-stone-900 mb-1">Welcome back</h2>
          <p className="text-stone-500 mb-8">Sign in to your account</p>

          <motion.div animate={controls} transition={{ duration: 0.6 }}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                name="email"
                label="Email address"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
                icon={Mail}
                inputClassName="rounded-xl"
              />

              <AnimatePresence initial={false}>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="-mt-1"
                  >
                    <span className="inline-flex items-center rounded-full px-3 py-1.5 text-[13px] font-semibold text-red-700 bg-red-600/10 ring-1 ring-red-600/15">
                      {error}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-[13px] font-medium text-orange-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                    <LockKeyhole className="h-[18px] w-[18px]" aria-hidden="true" />
                  </div>

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                    placeholder=" "
                    className={
                      [
                        'peer w-full h-12 rounded-xl bg-white ring-1 ring-black/10',
                        'pl-10 pr-11 pt-4 text-[14px] text-stone-900',
                        'outline-none transition-all duration-200 ease',
                        'focus:ring-2 focus:ring-orange-500/25 focus:ring-offset-0',
                      ].join(' ')
                    }
                  />

                  <label
                    htmlFor="password"
                    className={
                      [
                        'absolute left-10 top-1/2 -translate-y-1/2 text-[14px] text-stone-500',
                        'pointer-events-none transition-all duration-200 ease',
                        form.password ? 'top-2 translate-y-0 text-[13px] text-stone-400' : '',
                        'peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[13px] peer-focus:text-orange-600',
                      ].filter(Boolean).join(' ')
                    }
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700 transition"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full rounded-xl h-12 hover:scale-[1.01] hover:brightness-[1.03]"
                loading={loading}
              >
                Sign in
              </Button>

              <div className="flex items-center gap-3 py-2">
                <div className="h-px flex-1 bg-black/10" />
                <p className="text-[13px] text-stone-500">— or continue with —</p>
                <div className="h-px flex-1 bg-black/10" />
              </div>

              <button
                type="button"
                className="w-full h-12 rounded-xl bg-white ring-1 ring-black/10 hover:ring-black/15 transition-all duration-200 ease hover:scale-[1.01]"
              >
                <span className="flex items-center justify-center gap-2 text-[14px] font-semibold text-stone-900">
                  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8.1 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
                    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.9 12 24 12c3.1 0 5.9 1.2 8.1 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z" />
                    <path fill="#4CAF50" d="M24 44c5.3 0 10.2-2 13.9-5.3l-6.4-5.2C29.4 35.6 26.9 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.4 39.7 16.2 44 24 44z" />
                    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.4 5.5-6.5 7.1l6.4 5.2C38.7 37 44 31.5 44 24c0-1.3-.1-2.7-.4-3.5z" />
                  </svg>
                  Continue with Google
                </span>
              </button>
            </form>
          </motion.div>

          <p className="text-center text-[14px] text-stone-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-orange-600 font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}