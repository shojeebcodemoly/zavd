"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

const testimonials = [
	{
		quote: "Synos Medical har varit en fantastisk partner för vår klinik. Utrustningen är av högsta kvalitet och supporten är exceptionell. Vi kan varmt rekommendera dem till alla som söker professionell medicinsk utrustning.",
		author: "Dr. Anna Bergström",
		role: "Klinikchef, Stockholm Hudklinik",
		rating: 5,
	},
	{
		quote: "Vi har arbetat med Synos i över 5 år och är mycket nöjda. Deras lasersystem har revolutionerat våra behandlingar och patienterna är mycket nöjda med resultaten. Utbildningen vi fick var också mycket grundlig.",
		author: "Maria Lindqvist",
		role: "Ägare, Skönhetskliniken Linköping",
		rating: 5,
	},
	{
		quote: "Professionalism från start till mål. Synos hjälpte oss att välja rätt utrustning för vår verksamhet och stod vid vår sida genom hela processen. Servicen är förstklassig och tekniken fungerar felfritt.",
		author: "Erik Johansson",
		role: "Verksamhetschef, Nordiska Laserkliniken",
		rating: 5,
	},
	{
		quote: "Som ny klinik var vi osäkra på vilken utrustning vi skulle välja. Synos Medical tog sig tid att förstå våra behov och rekommenderade perfekta lösningar. Investeringen har redan betalat sig.",
		author: "Sofia Andersson",
		role: "Grundare, Estetiska Kliniken Göteborg",
		rating: 5,
	},
	{
		quote: "Kvaliteten på utrustningen och den kontinuerliga supporten gör Synos till en ovärderlig partner. Vi har expanderat vår verksamhet tack vare deras pålitliga produkter och expertis.",
		author: "Dr. Peter Nilsson",
		role: "Medicinsk Ansvarig, Malmö Lasercenter",
		rating: 5,
	},
	{
		quote: "Synos Medical förstår verkligen behoven hos moderna kliniker. Deras MDR-certifierade utrustning ger oss och våra patienter trygghet. Vi är mycket glada över vårt samarbete.",
		author: "Karin Svensson",
		role: "Klinikägare, Uppsala Hudvård",
		rating: 5,
	},
];

const StarRating = ({ rating }: { rating: number }) => (
	<div className="flex gap-1">
		{[...Array(5)].map((_, i) => (
			<svg
				key={i}
				className={`h-5 w-5 ${
					i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
				}`}
				viewBox="0 0 20 20"
			>
				<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
			</svg>
		))}
	</div>
);

export function Testimonials() {
	return (
		<section className="py-20 lg:py-28 bg-white">
			<div className="section-container">
				{/* Section header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className="mx-auto max-w-2xl text-center mb-16"
				>
					<h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl mb-4">
						Vad våra kunder säger
					</h2>
					<p className="text-lg text-muted-foreground">
						Läs om erfarenheter från kliniker som valt Synos Medical
					</p>
				</motion.div>

				{/* Testimonials grid */}
				<motion.div
					variants={staggerContainer}
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
				>
					{testimonials.map((testimonial, index) => (
						<motion.div
							key={index}
							variants={staggerItem}
							className="rounded-xl bg-background-soft p-8 card-shadow"
						>
							<StarRating rating={testimonial.rating} />
							<blockquote className="mt-6 text-muted-foreground leading-relaxed">
								{`"${testimonial.quote}"`}
							</blockquote>
							<div className="mt-6 border-t border-border pt-6">
								<div className="font-semibold text-foreground">
									{testimonial.author}
								</div>
								<div className="text-sm text-muted-foreground mt-1">
									{testimonial.role}
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
