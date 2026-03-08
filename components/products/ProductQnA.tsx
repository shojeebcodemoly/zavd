"use client";

import { motion } from "framer-motion";
import { MessageCircle, ThumbsUp, User } from "lucide-react";
import { QnA } from "@/types/product";

interface ProductQnAProps {
	qna: QnA[];
}

/**
 * ProductQnA Component
 *
 * Questions and Answers section with:
 * - Community Q&A display
 * - Helpful votes
 * - Author attribution
 * - Glassmorphism design
 */
export function ProductQnA({ qna }: ProductQnAProps) {
	if (!qna || qna.length === 0) return null;

	return (
		<section className="py-16 md:py-24">
			<div className="_container">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className="text-center mb-12"
				>
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
						<MessageCircle className="h-4 w-4" />
						<span className="text-sm font-semibold">Community Q&A</span>
					</div>
					<h2 className="text-3xl md:text-4xl font-medium text-secondary mb-4">
						Frågor från kunder
					</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Se vad andra har frågat om produkten
					</p>
				</motion.div>

				{/* Q&A List */}
				<div className="max-w-4xl mx-auto space-y-6">
					{qna.map((item, index) => (
						<motion.div
							key={item.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className="p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300"
						>
							{/* Question */}
							<div className="mb-4">
								<div className="flex items-start gap-3 mb-2">
									<div className="p-2 rounded-full bg-primary/10 shrink-0">
										<MessageCircle className="h-4 w-4 text-primary" />
									</div>
									<div className="flex-1">
										<h3 className="font-bold text-lg text-foreground mb-1">
											{item.question}
										</h3>
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											{item.askedBy && (
												<>
													<User className="h-3 w-3" />
													<span>{item.askedBy}</span>
													<span>•</span>
												</>
											)}
											<time>
												{new Date(item.date).toLocaleDateString(
													"sv-SE",
													{
														year: "numeric",
														month: "long",
														day: "numeric",
													}
												)}
											</time>
										</div>
									</div>
								</div>
							</div>

							{/* Answer */}
							<div className="pl-11 border-l-2 border-primary/20 ml-5">
								<div className="pl-4">
									<div className="mb-2">
										<span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
											Svar från {item.answeredBy || "Synos Medical"}
										</span>
									</div>
									<p className="text-muted-foreground leading-relaxed">
										{item.answer}
									</p>

									{/* Helpful */}
									{item.helpful !== undefined && item.helpful > 0 && (
										<div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
											<button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
												<ThumbsUp className="h-4 w-4" />
												<span>Hjälpsam ({item.helpful})</span>
											</button>
										</div>
									)}
								</div>
							</div>
						</motion.div>
					))}
				</div>

				{/* Ask Question CTA */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className="mt-12 text-center"
				>
					<div className="p-8 rounded-2xl bg-linear-to-br from-primary/10 to-secondary/10 backdrop-blur-sm border border-border/50 max-w-2xl mx-auto">
						<h3 className="text-xl font-bold text-foreground mb-2">
							Har du en fråga?
						</h3>
						<p className="text-muted-foreground mb-4">
							Ställ din fråga så svarar vi så snart som möjligt
						</p>
						<a
							href="/contact-us"
							className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
						>
							Ställ en fråga
						</a>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
