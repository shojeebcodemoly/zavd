"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	MapPin,
	Target,
	Heart,
	Users,
	CreditCard,
	GitBranch,
	UserCheck,
	Key,
	Star,
	Briefcase,
	Eye,
	FileCheck,
	CheckSquare,
	XCircle,
	ChevronDown,
	Search,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FaqItem {
	id: number;
	titleDe: string;
	titleEn: string;
	contentDe: string | string[];
	contentEn: string | string[];
}

export interface FaqSectionProps {
	items: FaqItem[];
	tag?: string;
	heading?: string;
	description?: string;
	isEn?: boolean;
}

// ─── Icon list ────────────────────────────────────────────────────────────────

const faqIconList = [
	MapPin, Target, Heart, Users, CreditCard, GitBranch,
	UserCheck, Key, Star, Briefcase, Eye, FileCheck, CheckSquare, XCircle,
];

// ─── Sub-component ────────────────────────────────────────────────────────────

function SectionTag({ label }: { label: string }) {
	return (
		<div className="inline-flex items-center gap-2 mb-4">
			<span className="w-6 h-px bg-primary" />
			<span className="text-primary text-xs font-semibold uppercase tracking-[0.15em]">
				{label}
			</span>
			<span className="w-6 h-px bg-primary" />
		</div>
	);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function FaqSection({ items, tag, heading, description, isEn = false }: FaqSectionProps) {
	const [activeId, setActiveId] = useState<number | null>(null);

	const filtered = items;

	const toggle = (id: number) => setActiveId((prev) => (prev === id ? null : id));

	return (
		<section className="py-24 bg-white">
			<div className="_container">
				{/* Section heading */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-10"
				>
					{tag && <SectionTag label={tag} />}
					{heading && (
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
							{heading}
						</h2>
					)}
					{description && (
						<p className="text-gray-400 text-base max-w-xl mx-auto leading-relaxed">
							{description}
						</p>
					)}
				</motion.div>

				{/* Accordion grid */}
				{filtered.length === 0 ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center py-20 text-gray-300"
					>
						<Search className="w-10 h-10 mx-auto mb-3" />
						<p className="text-sm text-gray-400">
							{isEn ? "No sections match your search." : "Keine Abschnitte entsprechen Ihrer Suche."}
						</p>
					</motion.div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
						{filtered.map((item, i) => {
							const Icon = faqIconList[i % faqIconList.length];
							const title = isEn ? item.titleEn : item.titleDe;
							const content = isEn ? item.contentEn : item.contentDe;
							const isOpen = activeId === item.id;

							return (
								<motion.div
									key={item.id}
									initial={{ opacity: 0, y: 18 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.4, delay: i * 0.035 }}
									className={`rounded-2xl overflow-hidden transition-all duration-300 ${
										isOpen
											? "shadow-lg ring-1 ring-primary/20 bg-white"
											: "bg-gray-50 hover:bg-white hover:shadow-md"
									}`}
								>
									<button
										onClick={() => toggle(item.id)}
										className="w-full flex items-center gap-4 px-6 py-5 text-left group"
									>
										<div
											className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
												isOpen
													? "bg-primary text-white shadow-md shadow-primary/30"
													: "bg-white text-gray-400 shadow-sm group-hover:text-primary group-hover:shadow-primary/20"
											}`}
										>
											<Icon style={{ width: 18, height: 18 }} />
										</div>

										<div className="flex-1 min-w-0">
											<span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
												§ {item.id}
											</span>
											<p
												className={`text-sm font-semibold leading-snug mt-0.5 transition-colors duration-200 ${
													isOpen ? "text-primary" : "text-gray-800 group-hover:text-gray-900"
												}`}
											>
												{title}
											</p>
										</div>

										<div
											className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
												isOpen
													? "bg-primary/10 text-primary rotate-180"
													: "bg-white text-gray-300 group-hover:text-gray-400 shadow-sm"
											}`}
										>
											<ChevronDown className="w-3.5 h-3.5" />
										</div>
									</button>

									<AnimatePresence initial={false}>
										{isOpen && (
											<motion.div
												key="panel"
												initial={{ height: 0, opacity: 0 }}
												animate={{ height: "auto", opacity: 1 }}
												exit={{ height: 0, opacity: 0 }}
												transition={{ duration: 0.3, ease: "easeInOut" }}
												className="overflow-hidden"
											>
												<div className="px-6 pb-6 pt-0">
													<div className="w-full h-px bg-gray-100 mb-4" />
													{Array.isArray(content) ? (
														<ul className="space-y-2.5 pl-1">
															{content.map((line, j) => (
																<li
																	key={j}
																	className="text-gray-500 text-sm leading-relaxed flex gap-2"
																>
																	<span className="text-primary/40 mt-1 flex-shrink-0">&bull;</span>
																	<span>{line}</span>
																</li>
															))}
														</ul>
													) : (
														<p className="text-gray-500 text-sm leading-relaxed">
															{content}
														</p>
													)}
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</motion.div>
							);
						})}
					</div>
				)}
			</div>
		</section>
	);
}
