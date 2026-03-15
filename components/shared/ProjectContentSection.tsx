"use client";

import { motion } from "framer-motion";
import { Phone, Mail, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
	FaFacebook,
	FaInstagram,
	FaLinkedin,
	FaXTwitter,
	FaYoutube,
} from "react-icons/fa6";

interface ContentBlock {
	heading?: string;
	body?: string;
}

interface DonationWidget {
	enabled: boolean;
	title?: string;
	amounts: number[];
	currency?: string;
	buttonText?: string;
	donationLink?: string;
}

interface SocialMedia {
	facebook?: string;
	instagram?: string;
	linkedin?: string;
	twitter?: string;
	youtube?: string;
}

interface ProjectContentSectionProps {
	title?: string;
	body?: string;
	image?: string;
	blocks?: ContentBlock[];
	pressItems?: unknown[];
	phone?: string;
	email?: string;
	contactBackground?: string;
	donationWidget?: DonationWidget;
	socialMedia?: SocialMedia;
}

const fadeUp = {
	hidden: { opacity: 0, y: 24 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const SOCIAL_LINKS = [
	{ key: "facebook" as const, label: "Facebook", Icon: FaFacebook, color: "#1877F2" },
	{ key: "instagram" as const, label: "Instagram", Icon: FaInstagram, color: "#E1306C" },
	{ key: "linkedin" as const, label: "LinkedIn", Icon: FaLinkedin, color: "#0A66C2" },
	{ key: "twitter" as const, label: "Twitter / X", Icon: FaXTwitter, color: "#000000" },
	{ key: "youtube" as const, label: "YouTube", Icon: FaYoutube, color: "#FF0000" },
];

export function ProjectContentSection({
	title,
	body,
	image,
	blocks = [],
	phone,
	email,
	contactBackground,
	donationWidget,
	socialMedia,
}: ProjectContentSectionProps) {
	if (!title && !body && blocks.length === 0) return null;

	const showDonation = donationWidget?.enabled === true;

	const activeSocial = SOCIAL_LINKS.filter(
		({ key }) => socialMedia?.[key] && socialMedia[key]!.trim() !== ""
	);
	const hasSocialCard = activeSocial.length > 0;

	const hasSidebar = !!phone || !!email || showDonation || hasSocialCard;
	const hasBg = !!contactBackground;

	return (
		<section className="py-16 md:py-24 bg-slate-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className={hasSidebar ? "grid grid-cols-1 lg:grid-cols-3 gap-10" : ""}>

					{/* ── Left: Main content ── */}
					<motion.div
						className={hasSidebar ? "lg:col-span-2" : ""}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, margin: "-60px" }}
						variants={fadeUp}
					>
						<div className="bg-white rounded-2xl shadow-sm overflow-hidden">
							{/* Intro section */}
							{(title || body || image) && (
								<div className="p-8">
									{title && (
										<h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">
											{title}
										</h2>
									)}
									<div className="relative">
										{image && (
											<div className="float-right ml-6 mb-4 w-full max-w-[260px] sm:max-w-[300px] rounded-xl overflow-hidden shadow-md">
												<Image
													src={image}
													alt={title ?? "Content image"}
													width={300}
													height={220}
													className="w-full h-auto object-cover"
												/>
											</div>
										)}
										{body && (
											<div
												className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-a:text-primary prose-strong:text-slate-800"
												dangerouslySetInnerHTML={{ __html: body }}
											/>
										)}
										{image && <div className="clear-both" />}
									</div>
								</div>
							)}

							{/* Additional content blocks */}
							{blocks.map((block, i) => (
								<div key={i} className="border-t border-slate-100">
									{block.heading && (
										<h3 className="text-sm font-bold text-slate-900 px-8 pt-5 pb-1">
											{block.heading}
										</h3>
									)}
									{block.body && (
										<p className="text-slate-600 leading-relaxed text-sm px-8 py-5">
											{block.body}
										</p>
									)}
								</div>
							))}
						</div>
					</motion.div>

					{/* ── Right: Sidebar ── */}
					{hasSidebar && (
						<motion.div
							className="space-y-6"
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-60px" }}
							variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.6, delay: 0.15, ease: "easeOut" } } }}
						>
							{/* Do you have questions? */}
							{(phone || email) && (
								<div className="rounded-2xl overflow-hidden shadow-sm">
									<div className="relative bg-slate-800 px-6 pt-8 pb-8 min-h-[240px]">
										{/* Background image */}
										{hasBg && (
											<Image
												src={contactBackground!}
												alt=""
												fill
												className="object-cover"
												unoptimized
											/>
										)}
										{/* Dark overlay */}
										{hasBg && (
											<div className="absolute inset-0 bg-slate-900/70" />
										)}
										{/* Content */}
										<div className="relative z-10 flex flex-col h-full">
											<h3 className="text-lg font-bold text-white mb-1">
												Do you have questions?
											</h3>
											<p className="text-slate-400 text-sm mb-5">
												Please contact us at
											</p>
											<ul className="space-y-3 mb-6">
												{phone && (
													<li className="flex items-center gap-3">
														<span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
															<Phone className="w-4 h-4 text-white" />
														</span>
														<a
															href={`tel:${phone}`}
															className="text-white text-sm hover:text-primary transition-colors"
														>
															{phone}
														</a>
													</li>
												)}
												{email && (
													<li className="flex items-center gap-3">
														<span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
															<Mail className="w-4 h-4 text-white" />
														</span>
														<a
															href={`mailto:${email}`}
															className="text-white text-sm hover:text-primary transition-colors"
														>
															{email}
														</a>
													</li>
												)}
											</ul>
											<Link
												href="/kontakt"
												className="inline-block w-full text-center bg-primary text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
											>
												Contact Us
											</Link>
										</div>
									</div>
								</div>
							)}

							{/* Social Media Card */}
							{hasSocialCard && (
								<div className="bg-white rounded-2xl p-6 shadow-sm">
									<h3 className="text-base font-bold text-slate-900 mb-4">
										Follow Us
									</h3>
									<div className="grid grid-cols-2 gap-3">
										{activeSocial.map(({ key, label, Icon, color }) => (
											<a
												key={key}
												href={socialMedia![key]!}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-2 group"
											>
												<span
													className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-opacity group-hover:opacity-80"
													style={{ backgroundColor: color }}
												>
													<Icon className="w-3.5 h-3.5 text-white" />
												</span>
												<span className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors truncate">
													{label}
												</span>
											</a>
										))}
									</div>
								</div>
							)}

							{/* Donation Widget */}
							{showDonation && (
								<div className="bg-white rounded-2xl p-6 shadow-sm">
									<div className="flex items-center gap-2 mb-4">
										<Heart className="w-5 h-5 text-primary" />
										<h3 className="text-lg font-bold text-slate-900">
											{donationWidget!.title || "Make a Donation"}
										</h3>
									</div>

									{donationWidget!.amounts.length > 0 && (
										<div className="mb-5">
											<p className="text-xs text-slate-500 mb-2">Amount</p>
											<div className="flex flex-wrap gap-2">
												{donationWidget!.amounts.map((amount) => (
													<a
														key={amount}
														href={donationWidget!.donationLink || "#"}
														target={donationWidget!.donationLink ? "_blank" : undefined}
														rel="noopener noreferrer"
														className="px-3 py-1.5 rounded-full border border-slate-200 text-sm font-medium text-slate-700 hover:border-primary hover:text-primary transition-colors"
													>
														{donationWidget!.currency || "€"}{amount}
													</a>
												))}
											</div>
										</div>
									)}

									<div className="mb-5">
										<p className="text-xs text-slate-500 mb-2">Payment Method</p>
										<div className="flex flex-wrap gap-2">
											{["VISA", "Mastercard", "PayPal", "Stripe"].map((method) => (
												<span
													key={method}
													className="px-2.5 py-1 rounded border border-slate-200 text-xs font-semibold text-slate-600 bg-slate-50"
												>
													{method}
												</span>
											))}
										</div>
									</div>

									<a
										href={donationWidget!.donationLink || "#"}
										target={donationWidget!.donationLink ? "_blank" : undefined}
										rel="noopener noreferrer"
										className="block w-full text-center bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors text-sm"
									>
										{donationWidget!.buttonText || "Donate Now"}
									</a>
								</div>
							)}
						</motion.div>
					)}
				</div>
			</div>
		</section>
	);
}
