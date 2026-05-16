export default function Loader({ size = 'md', text = 'Loading...' }) {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  }
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} border-orange-200 border-t-orange-500
                       rounded-full animate-spin`} />
      {text && (
        <p className="text-gray-400 text-sm">{text}</p>
      )}
    </div>
  )
}

// Full-page blocking loader
export function PageLoader({ text = 'Loading...' }) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50
                    flex items-center justify-center">
      <Loader size="lg" text={text} />
    </div>
  )
}

// Inline button spinner — drop inside any button
export function ButtonSpinner() {
  return (
    <span className="w-4 h-4 border-2 border-white border-t-transparent
                     rounded-full animate-spin inline-block" />
  )
}