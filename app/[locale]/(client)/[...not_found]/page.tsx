import Link from "next/link";

/**
 * Catch-all 404 Page for Client Routes
 *
 * This page catches all unmatched routes under (client) and displays a 404 page
 * with the full layout (Navbar, Footer).
 */
export default function NotFoundPage() {
	return (
		<div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-gradient-to-br from-slate-50 via-sky-50 to-teal-50">
			<div className="max-w-xl text-center">
				<h1 className="text-[144px] font-black leading-none mb-4 bg-gradient-to-br from-primary/15 to-secondary/15 bg-clip-text text-transparent">
					404
				</h1>

				<div className="bg-white/80 rounded-3xl p-12 shadow-xl shadow-secondary/10">
					<h2 className="text-3xl font-extrabold text-primary mb-4">
						Page Not Found
					</h2>

					<p className="text-lg text-primary/75 mb-8 leading-relaxed">
						Sorry, we couldn&apos;t find the page you&apos;re looking for.
					</p>

					<div className="flex gap-4 justify-center flex-wrap">
						<Link
							href="/"
							className="px-8 py-4 bg-gradient-to-br from-secondary to-secondary/90 text-white rounded-full font-bold text-base hover:shadow-lg hover:shadow-secondary/25 transition-all"
						>
							Back to Home
						</Link>
						<Link
							href="/contact-us"
							className="px-8 py-4 bg-white text-primary border-2 border-primary/20 rounded-full font-bold text-base hover:border-primary/40 transition-all"
						>
							Contact Us
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
