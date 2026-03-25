"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin, Phone } from "lucide-react";
import { useLocale } from "next-intl";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useSetNavbarVariant } from "@/lib/context/navbar-variant-context";
import { ImageComponent } from "@/components/common/image-component";
import type { TeamPageData } from "@/lib/repositories/team-page.repository";

interface TeamPageClientProps {
	data: TeamPageData;
}

export function TeamPageClient({ data }: TeamPageClientProps) {
	// Set navbar variant
	useSetNavbarVariant("default");

	const locale = useLocale();
	const isEn = locale === "en";

	const visibility = data.sectionVisibility || {
		hero: true,
		stats: true,
		teamMembers: true,
		values: true,
		joinUs: true,
		contact: true,
	};

	// Filter valid data
	const validTeamMembers = (data.teamMembers || []).filter(
		(m) => m.name && (m.roleDe || m.roleEn)
	);
	const validStats = (data.stats || []).filter((s) => s.value && (s.labelDe || s.labelEn));
	const validValues = (data.valuesSection?.values || []).filter(
		(v) => v.titleDe || v.titleEn
	);

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			{visibility.hero && (
				<section className="py-16 md:py-24 lg:py-32 bg-background">
					<div className="_container">
						<motion.div
							variants={staggerContainer}
							initial="initial"
							animate="animate"
							className="text-center max-w-4xl mx-auto"
						>
							{(data.hero?.badgeDe || data.hero?.badgeEn) && (
								<motion.p
									variants={fadeUp}
									className="text-primary italic text-xl md:text-2xl mb-3 font-heading"
								>
									{isEn ? (data.hero.badgeEn || data.hero.badgeDe) : (data.hero.badgeDe || data.hero.badgeEn)}
								</motion.p>
							)}
							{(data.hero?.titleDe || data.hero?.titleEn) && (
								<motion.h1
									variants={fadeUp}
									className="text-3xl md:text-4xl lg:text-5xl font-medium text-secondary mb-6"
								>
									{isEn ? (data.hero.titleEn || data.hero.titleDe) : (data.hero.titleDe || data.hero.titleEn)}
								</motion.h1>
							)}
							{(data.hero?.subtitleDe || data.hero?.subtitleEn) && (
								<motion.p
									variants={fadeUp}
									className="text-lg text-muted-foreground max-w-2xl mx-auto"
								>
									{isEn ? (data.hero.subtitleEn || data.hero.subtitleDe) : (data.hero.subtitleDe || data.hero.subtitleEn)}
								</motion.p>
							)}
						</motion.div>
					</div>
				</section>
			)}

			{/* Statistics Section */}
			{visibility.stats && validStats.length > 0 && (
				<section className="py-12 md:py-16 bg-muted">
					<div className="_container">
						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
						>
							{validStats.map((stat, index) => (
								<motion.div
									key={index}
									variants={fadeUp}
									className="text-center"
								>
									<p className="text-4xl md:text-5xl font-light text-primary mb-2 font-heading">
										{stat.value}
										{stat.suffix}
									</p>
									<p className="text-sm md:text-base text-muted-foreground">
										{isEn ? (stat.labelEn || stat.labelDe) : (stat.labelDe || stat.labelEn)}
									</p>
								</motion.div>
							))}
						</motion.div>
					</div>
				</section>
			)}

			{/* Team Members Section */}
			{visibility.teamMembers && validTeamMembers.length > 0 && (
				<section className="py-16 md:py-24 lg:py-32 bg-background">
					<div className="_container">
						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="grid gap-12 md:gap-16 sm:grid-cols-2 lg:grid-cols-3"
						>
							{validTeamMembers.map((member, index) => {
								const role = isEn ? (member.roleEn || member.roleDe) : (member.roleDe || member.roleEn);
								const department = isEn ? (member.departmentEn || member.departmentDe) : (member.departmentDe || member.departmentEn);
								const bio = isEn ? (member.bioEn || member.bioDe) : (member.bioDe || member.bioEn);

								return (
									<motion.div
										key={index}
										variants={fadeUp}
										custom={index}
										className="flex flex-col items-center text-center group"
									>
										{/* Circular Image Container */}
										<div className="relative mb-6">
											<div className="w-40 h-40 md:w-48 md:h-48 lg:w-52 lg:h-52 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow">
												{member.image ? (
													<ImageComponent
														src={member.image}
														alt={member.name || "Team member"}
														className="w-full h-full object-cover"
														height={208}
														width={208}
														wrapperClasses="w-full h-full"
													/>
												) : (
													<div className="w-full h-full flex items-center justify-center bg-muted">
														<span className="text-4xl font-bold text-primary/40">
															{(member.name || "?")
																.split(" ")
																.map((n) => n[0])
																.join("")}
														</span>
													</div>
												)}
											</div>
										</div>

										{/* Member Info */}
										<div className="text-center max-w-sm">
											<h3 className="text-xl md:text-2xl font-medium text-secondary mb-1">
												{member.name}
											</h3>
											<p className="text-sm md:text-base text-primary font-medium mb-2">
												{role}
											</p>
											{department && (
												<p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
													{department}
												</p>
											)}

											{/* Bio/Description - 3-4 lines */}
											{bio && (
												<p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-4">
													{bio}
												</p>
											)}

											{/* Contact Links */}
											<div className="flex items-center justify-center gap-3">
												{member.email && (
													<a
														href={`mailto:${member.email}`}
														className="p-2 rounded-full bg-muted hover:bg-primary hover:text-white transition-colors"
														title="Email"
													>
														<Mail className="w-4 h-4" />
													</a>
												)}
												{member.phone && (
													<a
														href={`tel:${member.phone}`}
														className="p-2 rounded-full bg-muted hover:bg-primary hover:text-white transition-colors"
														title="Phone"
													>
														<Phone className="w-4 h-4" />
													</a>
												)}
												{member.linkedin && (
													<a
														href={member.linkedin}
														target="_blank"
														rel="noopener noreferrer"
														className="p-2 rounded-full bg-muted hover:bg-primary hover:text-white transition-colors"
														title="LinkedIn"
													>
														<Linkedin className="w-4 h-4" />
													</a>
												)}
											</div>
										</div>
									</motion.div>
								);
							})}
						</motion.div>
					</div>
				</section>
			)}

			{/* Values Section */}
			{visibility.values && validValues.length > 0 && (
				<section className="py-16 md:py-24 bg-muted">
					<div className="_container">
						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="text-center mb-12"
						>
							{(data.valuesSection?.titleDe || data.valuesSection?.titleEn) && (
								<motion.h2
									variants={fadeUp}
									className="text-3xl md:text-4xl font-medium text-secondary mb-4"
								>
									{isEn ? (data.valuesSection.titleEn || data.valuesSection.titleDe) : (data.valuesSection.titleDe || data.valuesSection.titleEn)}
								</motion.h2>
							)}
							{(data.valuesSection?.subtitleDe || data.valuesSection?.subtitleEn) && (
								<motion.p
									variants={fadeUp}
									className="text-muted-foreground max-w-2xl mx-auto"
								>
									{isEn ? (data.valuesSection.subtitleEn || data.valuesSection.subtitleDe) : (data.valuesSection.subtitleDe || data.valuesSection.subtitleEn)}
								</motion.p>
							)}
						</motion.div>

						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
						>
							{validValues.map((value, index) => {
								const valueTitle = isEn ? (value.titleEn || value.titleDe) : (value.titleDe || value.titleEn);
								const valueDescription = isEn ? (value.descriptionEn || value.descriptionDe) : (value.descriptionDe || value.descriptionEn);

								return (
									<motion.div
										key={index}
										variants={fadeUp}
										className="bg-background p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
									>
										<h3 className="text-lg font-medium text-secondary mb-2">
											{valueTitle}
										</h3>
										{valueDescription && (
											<p className="text-sm text-muted-foreground">
												{valueDescription}
											</p>
										)}
									</motion.div>
								);
							})}
						</motion.div>
					</div>
				</section>
			)}

			{/* Join Us CTA Section */}
			{visibility.joinUs && (data.joinUs?.titleDe || data.joinUs?.titleEn || data.joinUs?.descriptionDe || data.joinUs?.descriptionEn) && (
				<section className="py-16 md:py-24 bg-primary/10">
					<div className="_container">
						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="text-center max-w-3xl mx-auto"
						>
							{(data.joinUs?.titleDe || data.joinUs?.titleEn) && (
								<motion.h2
									variants={fadeUp}
									className="text-3xl md:text-4xl font-medium text-secondary mb-4"
								>
									{isEn ? (data.joinUs.titleEn || data.joinUs.titleDe) : (data.joinUs.titleDe || data.joinUs.titleEn)}
								</motion.h2>
							)}
							{(data.joinUs?.descriptionDe || data.joinUs?.descriptionEn) && (
								<motion.p
									variants={fadeUp}
									className="text-lg text-muted-foreground mb-8"
								>
									{isEn ? (data.joinUs.descriptionEn || data.joinUs.descriptionDe) : (data.joinUs.descriptionDe || data.joinUs.descriptionEn)}
								</motion.p>
							)}

							<motion.div
								variants={fadeUp}
								className="flex flex-wrap items-center justify-center gap-4"
							>
								{(data.joinUs?.primaryCta?.textDe || data.joinUs?.primaryCta?.textEn) && data.joinUs?.primaryCta?.href && (
									<a
										href={data.joinUs.primaryCta.href}
										className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors"
									>
										{isEn ? (data.joinUs.primaryCta.textEn || data.joinUs.primaryCta.textDe) : (data.joinUs.primaryCta.textDe || data.joinUs.primaryCta.textEn)}
									</a>
								)}
								{(data.joinUs?.secondaryCta?.textDe || data.joinUs?.secondaryCta?.textEn) && data.joinUs?.secondaryCta?.href && (
									<a
										href={data.joinUs.secondaryCta.href}
										className="inline-flex items-center justify-center px-6 py-3 border border-secondary text-secondary font-medium rounded-md hover:bg-secondary hover:text-white transition-colors"
									>
										{isEn ? (data.joinUs.secondaryCta.textEn || data.joinUs.secondaryCta.textDe) : (data.joinUs.secondaryCta.textDe || data.joinUs.secondaryCta.textEn)}
									</a>
								)}
							</motion.div>
						</motion.div>
					</div>
				</section>
			)}

			{/* Contact Section */}
			{visibility.contact && (data.contact?.titleDe || data.contact?.titleEn || data.contact?.phone || data.contact?.email) && (
				<section className="py-16 md:py-24 bg-background">
					<div className="_container">
						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="text-center max-w-2xl mx-auto"
						>
							{(data.contact?.titleDe || data.contact?.titleEn) && (
								<motion.h2
									variants={fadeUp}
									className="text-3xl md:text-4xl font-medium text-secondary mb-4"
								>
									{isEn ? (data.contact.titleEn || data.contact.titleDe) : (data.contact.titleDe || data.contact.titleEn)}
								</motion.h2>
							)}
							{(data.contact?.descriptionDe || data.contact?.descriptionEn) && (
								<motion.p
									variants={fadeUp}
									className="text-muted-foreground mb-8"
								>
									{isEn ? (data.contact.descriptionEn || data.contact.descriptionDe) : (data.contact.descriptionDe || data.contact.descriptionEn)}
								</motion.p>
							)}

							<motion.div
								variants={fadeUp}
								className="flex flex-col sm:flex-row items-center justify-center gap-6"
							>
								{data.contact?.phone && (
									<a
										href={`tel:${data.contact.phone}`}
										className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
									>
										<Phone className="w-5 h-5" />
										<span>{data.contact.phone}</span>
									</a>
								)}
								{data.contact?.email && (
									<a
										href={`mailto:${data.contact.email}`}
										className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
									>
										<Mail className="w-5 h-5" />
										<span>{data.contact.email}</span>
									</a>
								)}
							</motion.div>
						</motion.div>
					</div>
				</section>
			)}
		</div>
	);
}
