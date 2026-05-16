export default function Footer() {
	return (
		<footer className="border-t border-gray-100 bg-white">
			<div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
				<span>© {new Date().getFullYear()} FoodApp</span>
				<span className="text-gray-400">Fresh food, fast delivery.</span>
			</div>
		</footer>
	)
}

