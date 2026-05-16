const CATEGORY_VARIANTS = {
  Veg: 'bg-green-600/10 text-green-700 ring-1 ring-green-600/15',
  'Non-Veg': 'bg-red-600/10 text-red-700 ring-1 ring-red-600/15',
  Drinks: 'bg-blue-600/10 text-blue-700 ring-1 ring-blue-600/15',
  Desserts: 'bg-pink-600/10 text-pink-700 ring-1 ring-pink-600/15',
  'Fast Food': 'bg-orange-600/10 text-orange-700 ring-1 ring-orange-600/15',
}

export default function Badge({
  variant,
  className = '',
  children,
}) {
  const styles =
    CATEGORY_VARIANTS[variant] || 'bg-stone-900/5 text-stone-700 ring-1 ring-black/5'

  return (
    <span
      className={
        [
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1',
          'text-[13px] font-semibold',
          styles,
          className,
        ].filter(Boolean).join(' ')
      }
    >
      {children}
    </span>
  )
}
