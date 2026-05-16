import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CircleCheck,
  CircleX,
  LockKeyhole,
  Mail,
  Menu,
  ShieldCheck,
  Truck,
  User,
  UtensilsCrossed,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function strengthScore(password) {
  const p = String(password || '')
  if (!p) return { score: 0, label: 'Weak' }

  let score = 0
  if (p.length >= 6) score += 1
  if (p.length >= 10) score += 1
  if (/[A-Z]/.test(p)) score += 1
  if (/[0-9]/.test(p) || /[^A-Za-z0-9]/.test(p)) score += 1

  const capped = Math.min(4, score)
  const labels = ['Weak', 'Weak', 'Fair', 'Good', 'Strong']
  return { score: capped, label: labels[capped] }
}

function FoodIllustration() {
  return (
    <svg
      width="220"
      height="220"
      viewBox="0 0 220 220"
      fill="none"
      aria-hidden="true"
      className="mx-auto"
    >
      <path
        d="M55 118c0 34 26 60 55 60s55-26 55-60"
        stroke="white"
        strokeOpacity="0.9"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M58 118h104"
        stroke="white"
        strokeOpacity="0.85"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M82 54c-8 10-8 18 0 28"
        stroke="white"
        strokeOpacity="0.75"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M110 46c-8 10-8 18 0 28"
        stroke="white"
        strokeOpacity="0.75"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M138 54c-8 10-8 18 0 28"
        stroke="white"
        strokeOpacity="0.75"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle cx="80" cy="146" r="9" fill="white" fillOpacity="0.65" />
      <circle cx="110" cy="156" r="10" fill="white" fillOpacity="0.6" />
      <circle cx="140" cy="144" r="8" fill="white" fillOpacity="0.6" />
      <path
        d="M46 120c0 6 6 10 14 10h100c8 0 14-4 14-10"
        stroke="white"
        strokeOpacity="0.35"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function Register() {
  const { register, loading, error } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirm: false })
  const [emailAlreadyRegistered, setEmailAlreadyRegistered] = useState(false)

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (name === 'email') setEmailAlreadyRegistered(false)
  }

  const markTouched = name =>
    setTouched(prev => ({ ...prev, [name]: true }))

  const emailFormatValid = useMemo(() => emailRegex.test(form.email.trim()), [form.email])
  const passwordStrength = useMemo(() => strengthScore(form.password), [form.password])
  const passwordValid = useMemo(() => String(form.password || '').length >= 6, [form.password])
  const confirmMatches = useMemo(
    () => !!form.confirm && form.password === form.confirm,
    [form.password, form.confirm]
  )

  useEffect(() => {
    if (!error) return
    if (/already|exists|registered/i.test(String(error))) {
      setEmailAlreadyRegistered(true)
    }
  }, [error])

  const errors = useMemo(() => {
    const next = {}

    if (touched.name && !form.name.trim()) next.name = 'Full name is required'

    if (touched.email) {
      if (!form.email.trim()) next.email = 'Email is required'
      else if (!emailFormatValid) next.email = 'Enter a valid email address'
      else if (emailAlreadyRegistered) next.email = 'Email already registered'
    }

    if (touched.password) {
      if (!form.password) next.password = 'Password is required'
      else if (!passwordValid) next.password = 'Password must be at least 6 characters'
    }

    if (touched.confirm) {
      if (!form.confirm) next.confirm = 'Please confirm your password'
      else if (!confirmMatches) next.confirm = 'Passwords do not match'
    }

    return next
  }, [
    touched,
    form.name,
    form.email,
    form.password,
    form.confirm,
    emailFormatValid,
    emailAlreadyRegistered,
    passwordValid,
    confirmMatches,
  ])

  const handleSubmit = e => {
    e.preventDefault()
    register(form.name, form.email, form.password)
  }

  const allValid =
    !!form.name.trim() &&
    emailFormatValid &&
    !emailAlreadyRegistered &&
    passwordValid &&
    confirmMatches

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* Left panel — form (55%) */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-[55%] bg-white flex items-center justify-center"
      >
        <div className="w-full max-w-sm mx-auto px-8">

          {/* progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-[13px] text-stone-500">
              <span className="font-medium">Step 1 of 1</span>
              <span className="font-medium">Account</span>
            </div>
            <div className="mt-2 h-1 rounded-full bg-black/5 overflow-hidden">
              <div className="h-full w-full bg-orange-600" />
            </div>
          </div>

          {/* logo */}
          <div className="flex items-center gap-2 mb-7">
            <UtensilsCrossed className="h-5 w-5 text-orange-600" />
            <span className="text-[18px] font-bold text-stone-900">FoodApp</span>
          </div>

          <h2 className="text-[24px] font-semibold tracking-tight text-stone-900 mb-1">Create account</h2>
          <p className="text-stone-500 mb-7">Join us and start ordering</p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full name */}
            <div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                  <User className="h-[18px] w-[18px]" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={() => markTouched('name')}
                  autoComplete="name"
                  placeholder=" "
                  className={
                    [
                      'peer w-full h-12 rounded-xl bg-white ring-1 ring-black/10',
                      'pl-10 pr-3 pt-4 text-[14px] text-stone-900',
                      errors.name ? 'ring-red-600/25 focus:ring-2 focus:ring-red-600/25' : 'focus:ring-2 focus:ring-orange-500/25',
                      'outline-none transition-all duration-200 ease',
                    ].join(' ')
                  }
                  required
                />
                <label
                  htmlFor="name"
                  className={
                    [
                      'absolute left-10 top-1/2 -translate-y-1/2 text-[14px] text-stone-500',
                      'pointer-events-none transition-all duration-200 ease',
                      form.name ? 'top-2 translate-y-0 text-[13px] text-stone-400' : '',
                      'peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[13px] peer-focus:text-orange-600',
                    ].filter(Boolean).join(' ')
                  }
                >
                  Full name
                </label>
              </div>
              <AnimatePresence initial={false}>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mt-2 text-[13px] text-red-600"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                  <Mail className="h-[18px] w-[18px]" aria-hidden="true" />
                </div>

                {form.email && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {emailFormatValid && !emailAlreadyRegistered ? (
                      <CircleCheck className="h-5 w-5 text-green-600" aria-hidden="true" />
                    ) : (
                      <CircleX className="h-5 w-5 text-red-600" aria-hidden="true" />
                    )}
                  </div>
                )}

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={() => markTouched('email')}
                  autoComplete="email"
                  placeholder=" "
                  className={
                    [
                      'peer w-full h-12 rounded-xl bg-white ring-1 ring-black/10',
                      'pl-10 pr-11 pt-4 text-[14px] text-stone-900',
                      errors.email ? 'ring-red-600/25 focus:ring-2 focus:ring-red-600/25' : 'focus:ring-2 focus:ring-orange-500/25',
                      'outline-none transition-all duration-200 ease',
                    ].join(' ')
                  }
                  required
                />
                <label
                  htmlFor="email"
                  className={
                    [
                      'absolute left-10 top-1/2 -translate-y-1/2 text-[14px] text-stone-500',
                      'pointer-events-none transition-all duration-200 ease',
                      form.email ? 'top-2 translate-y-0 text-[13px] text-stone-400' : '',
                      'peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[13px] peer-focus:text-orange-600',
                    ].filter(Boolean).join(' ')
                  }
                >
                  Email address
                </label>
              </div>

              <AnimatePresence initial={false}>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mt-2 text-[13px] text-red-600"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                  <LockKeyhole className="h-[18px] w-[18px]" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={() => markTouched('password')}
                  autoComplete="new-password"
                  placeholder=" "
                  className={
                    [
                      'peer w-full h-12 rounded-xl bg-white ring-1 ring-black/10',
                      'pl-10 pr-3 pt-4 text-[14px] text-stone-900',
                      errors.password ? 'ring-red-600/25 focus:ring-2 focus:ring-red-600/25' : 'focus:ring-2 focus:ring-orange-500/25',
                      'outline-none transition-all duration-200 ease',
                    ].join(' ')
                  }
                  required
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
              </div>

              {/* strength meter */}
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map(i => {
                    const active = passwordStrength.score >= i
                    const color =
                      i === 1 ? 'bg-red-500' :
                        i === 2 ? 'bg-orange-500' :
                          i === 3 ? 'bg-yellow-400' :
                            'bg-green-600'
                    return (
                      <div
                        key={i}
                        className={
                          [
                            'h-1.5 flex-1 rounded-full',
                            active ? color : 'bg-black/10',
                            'transition-colors duration-200 ease',
                          ].join(' ')
                        }
                      />
                    )
                  })}
                </div>
                <p className="mt-2 text-[13px] text-stone-500">
                  Strength: <span className="font-semibold text-stone-700">{passwordStrength.label}</span>
                </p>
              </div>

              <AnimatePresence initial={false}>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mt-2 text-[13px] text-red-600"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Confirm password */}
            <div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                  <LockKeyhole className="h-[18px] w-[18px]" aria-hidden="true" />
                </div>

                {form.confirm && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {confirmMatches ? (
                      <CircleCheck className="h-5 w-5 text-green-600" aria-hidden="true" />
                    ) : (
                      <CircleX className="h-5 w-5 text-red-600" aria-hidden="true" />
                    )}
                  </div>
                )}

                <input
                  id="confirm"
                  name="confirm"
                  type="password"
                  value={form.confirm}
                  onChange={handleChange}
                  onBlur={() => markTouched('confirm')}
                  autoComplete="new-password"
                  placeholder=" "
                  className={
                    [
                      'peer w-full h-12 rounded-xl bg-white ring-1 ring-black/10',
                      'pl-10 pr-11 pt-4 text-[14px] text-stone-900',
                      errors.confirm ? 'ring-red-600/25 focus:ring-2 focus:ring-red-600/25' : 'focus:ring-2 focus:ring-orange-500/25',
                      'outline-none transition-all duration-200 ease',
                    ].join(' ')
                  }
                  required
                />
                <label
                  htmlFor="confirm"
                  className={
                    [
                      'absolute left-10 top-1/2 -translate-y-1/2 text-[14px] text-stone-500',
                      'pointer-events-none transition-all duration-200 ease',
                      form.confirm ? 'top-2 translate-y-0 text-[13px] text-stone-400' : '',
                      'peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[13px] peer-focus:text-orange-600',
                    ].filter(Boolean).join(' ')
                  }
                >
                  Confirm password
                </label>
              </div>

              <AnimatePresence initial={false}>
                {errors.confirm && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mt-2 text-[13px] text-red-600"
                  >
                    {errors.confirm}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full rounded-xl h-12 hover:scale-[1.01] hover:brightness-[1.03]"
              loading={loading}
              disabled={!allValid || loading}
            >
              Create account
            </Button>
          </form>

          <p className="text-center text-[14px] text-stone-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Right panel — brand (45%) */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-[45%] bg-orange-600 flex-col items-center justify-center p-10 md:p-16 relative overflow-hidden flex"
      >
        <div className="relative z-10 text-center">
          <div className="mb-8">
            <FoodIllustration />
          </div>

          <h1 className="text-white text-[32px] font-bold leading-tight">
            Hungry? We&apos;ve got you.
          </h1>
          <p className="text-white/70 text-[16px] mt-4">
            Hundreds of dishes, delivered fast.
          </p>

          {/* feature pills */}
          <div className="flex flex-col gap-3 mt-10">
            <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-[14px] font-semibold text-white bg-white/15">
              <Truck className="h-4 w-4" aria-hidden="true" />
              Fast delivery
            </div>
            <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-[14px] font-semibold text-white bg-white/15">
              <Menu className="h-4 w-4" aria-hidden="true" />
              100+ menu items
            </div>
            <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-[14px] font-semibold text-white bg-white/15">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Secure checkout
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}