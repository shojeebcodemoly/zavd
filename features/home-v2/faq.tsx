"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { staggerContainer, staggerItem } from "@/lib/animations";

const faqs = [
	{
		question: "Vilken typ av certifiering har er utrustning?",
		answer:
			"All vår utrustning är MDR-certifierad (Medical Device Regulation) enligt de senaste EU-kraven. Detta garanterar högsta säkerhet och kvalitet för både kliniker och patienter.",
	},
	{
		question: "Erbjuder ni utbildning för personalen?",
		answer:
			"Ja, vi erbjuder omfattande utbildningsprogram för all vår utrustning. Utbildningen inkluderar både teoretisk och praktisk träning, och vi säkerställer att er personal känner sig trygg och kompetent innan ni börjar använda utrustningen.",
	},
	{
		question: "Hur fungerar service och support?",
		answer:
			"Vi erbjuder komplett service och support med svensk teknisk personal. Vår support är tillgänglig via telefon och e-post, och vi har servicetekniker som kan komma ut vid behov. Vi erbjuder även förebyggande underhåll och serviceavtal.",
	},
	{
		question: "Finns det finansieringsmöjligheter?",
		answer:
			"Ja, vi erbjuder flexibla finansieringslösningar anpassade efter er verksamhets behov. Vi kan hjälpa er med både leasing och avbetalningsplaner för att göra investeringen så smidig som möjligt.",
	},
	{
		question: "Hur lång är leveranstiden?",
		answer:
			"Leveranstiden varierar beroende på produkt och tillgänglighet, men vi strävar alltid efter att leverera så snabbt som möjligt. Kontakta oss för specifik information om den produkt ni är intresserade av.",
	},
	{
		question: "Vad ingår i garantin?",
		answer:
			"All vår utrustning kommer med tillverkarens garanti, och vi erbjuder även utökade garantialternativ. Garantin täcker material- och tillverkningsfel, och vi hanterar all garantiservice direkt.",
	},
];

const FAQItem = ({ faq, index }: { faq: (typeof faqs)[0]; index: number }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<motion.div
			variants={staggerItem}
			className="border-b border-border last:border-0"
		>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex w-full items-center justify-between py-6 text-left transition-colors hover:text-secondary"
			>
				<span className="text-lg font-semibold text-foreground pr-8">
					{faq.question}
				</span>
				<svg
					className={`h-5 w-5 shrink-0 text-secondary transition-transform duration-200 ${
						isOpen ? "rotate-180" : ""
					}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>
			<motion.div
				initial={false}
				animate={{
					height: isOpen ? "auto" : 0,
					opacity: isOpen ? 1 : 0,
				}}
				transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
				className="overflow-hidden"
			>
				<p className="pb-6 text-muted-foreground leading-relaxed">
					{faq.answer}
				</p>
			</motion.div>
		</motion.div>
	);
};

export function FAQ() {
	return (
		<section className="py-20 lg:py-28 bg-background-section">
			<div className="section-container">
				<div className="mx-auto max-w-3xl">
					{/* Section header */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="text-center mb-16"
					>
						<h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl mb-4">
							Vanliga frågor
						</h2>
						<p className="text-lg text-muted-foreground">
							Här hittar du svar på de vanligaste frågorna om vår
							utrustning och tjänster
						</p>
					</motion.div>

					{/* FAQ list */}
					<motion.div
						variants={staggerContainer}
						initial="initial"
						whileInView="animate"
						viewport={{ once: true }}
						className="rounded-xl bg-white p-8 card-shadow"
					>
						{faqs.map((faq, index) => (
							<FAQItem key={index} faq={faq} index={index} />
						))}
					</motion.div>

					{/* CTA */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="mt-12 text-center"
					>
						<p className="text-muted-foreground mb-4">
							Har du fler frågor?
						</p>
						<a
							href="/kontakt"
							className="inline-flex items-center text-secondary font-semibold hover:text-secondary-dark transition-colors"
						>
							Kontakta oss
							<svg
								className="ml-2 h-5 w-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17 8l4 4m0 0l-4 4m4-4H3"
								/>
							</svg>
						</a>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
