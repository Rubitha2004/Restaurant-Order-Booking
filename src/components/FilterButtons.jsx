import { motion } from 'framer-motion'

const DEFAULT_CATEGORIES = ['All', 'Veg', 'Non-Veg', 'Drinks', 'Desserts', 'Fast Food']

const CATEGORY_ICONS = {
	All: '🍽️',
	Veg: '🥦',
	'Non-Veg': '🍗',
	Drinks: '🥤',
	Desserts: '🍰',
	'Fast Food': '🍔',
}

export default function FilterButtons({
	categories = DEFAULT_CATEGORIES,
	selected = 'All',
	onSelect,
}) {
	return (
		<div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
			{categories.map((cat, i) => (
				<motion.button
					key={cat}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: i * 0.05 }}
					onClick={() => onSelect?.(cat)}
					className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
											whitespace-nowrap transition duration-200 border
											${selected === cat
												? 'bg-orange-500 text-white border-orange-500 shadow-sm'
												: 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
											}`}
				>
					<span>{CATEGORY_ICONS[cat] || '🍽️'}</span>
					{cat}
				</motion.button>
			))}
		</div>
	)
}
