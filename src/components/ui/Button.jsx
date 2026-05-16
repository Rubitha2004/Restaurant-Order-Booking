export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  children,
  ...props
}) {
  const isDisabled = disabled || loading

  const base =
    'inline-flex items-center justify-center gap-2 font-semibold ' +
    'rounded-[10px] px-4 select-none ' +
    'transition-all duration-200 ease ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 ' +
    'disabled:opacity-60 disabled:pointer-events-none'

  const sizes = {
    sm: 'h-9 text-[13px] px-3',
    md: 'h-10 text-[14px] px-4',
    lg: 'h-12 text-[16px] px-5',
  }

  const variants = {
    primary:
      'bg-orange-600 text-white hover:bg-orange-500 ring-1 ring-black/5',
    ghost:
      'bg-white text-stone-900 ring-1 ring-black/10 hover:ring-black/15 hover:bg-white',
    danger:
      'bg-red-600 text-white hover:bg-red-500 ring-1 ring-black/5',
  }

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {loading && (
        <span
          className="h-4 w-4 rounded-full border-2 border-white/80 border-t-transparent animate-spin"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  )
}
