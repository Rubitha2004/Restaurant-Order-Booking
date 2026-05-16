export default function Card({
  as: Component = 'div',
  className = '',
  children,
  ...props
}) {
  return (
    <Component
      className={
        [
          'bg-white rounded-[16px] ring-1 ring-black/5',
          'transition-transform duration-200 ease',
          'hover:scale-[1.01]',
          className,
        ].filter(Boolean).join(' ')
      }
      {...props}
    >
      {children}
    </Component>
  )
}
