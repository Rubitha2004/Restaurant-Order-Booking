import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = 'Search dishes...' }) {
	return (
		<div className="relative max-w-xl">
			<Search
				className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 h-5 w-5"
				aria-hidden="true"
			/>
			<input
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className="w-full pl-11 pr-4 py-3 h-11 rounded-[16px] text-stone-900 bg-white
								 placeholder-stone-400 text-[14px] ring-1 ring-black/5
								 focus:outline-none focus:ring-2 focus:ring-orange-500/25 transition-all duration-200 ease"
				aria-label="Search foods"
			/>
		</div>
	)
}

