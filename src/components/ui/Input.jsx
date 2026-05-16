import { useId } from 'react'

export default function Input({
  label,
  value,
  onChange,
  name,
  type = 'text',
  autoComplete,
  required,
  disabled,
  error,
  icon: Icon,
  className = '',
  inputClassName = '',
  ...props
}) {
  const id = useId()

  const hasValue = value !== undefined && value !== null && String(value).length > 0

  return (
    <div className={className}>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          </div>
        )}

        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          placeholder=" "
          className={
            [
              'peer w-full h-11 rounded-[10px] bg-white ring-1 ring-black/10',
              'px-3 pt-4 text-[14px] text-stone-900',
              Icon ? 'pl-10' : '',
              error
                ? 'ring-1 ring-red-600/30 focus:ring-2 focus:ring-red-600/25'
                : 'focus:ring-2 focus:ring-orange-500/25 focus:ring-offset-0',
              'outline-none transition-all duration-200 ease',
              inputClassName,
            ].filter(Boolean).join(' ')
          }
          {...props}
        />

        {label && (
          <label
            htmlFor={id}
            className={
              [
                'absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-stone-500',
                'pointer-events-none transition-all duration-200 ease',
                Icon ? 'left-10' : '',
                hasValue
                  ? 'top-2 translate-y-0 text-[13px] text-stone-400'
                  : '',
                'peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[13px] peer-focus:text-orange-600',
              ].filter(Boolean).join(' ')
            }
          >
            {label}
          </label>
        )}
      </div>

      {error && (
        <p className="mt-2 text-[13px] text-red-600">{error}</p>
      )}
    </div>
  )
}
