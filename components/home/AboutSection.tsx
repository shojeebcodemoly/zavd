import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { ImageComponent } from "../common/image-component";
import type { IAboutSection } from "@/models/home-page.model";

interface AboutSectionProps {
	data: IAboutSection;
	isEn?: boolean;
}

const AboutSection = ({ data, isEn }: AboutSectionProps) => {
	const hasImage = !!data.image;
	const certTitle = (isEn ? data.certificationBadge?.titleEn : data.certificationBadge?.titleDe) || data.certificationBadge?.titleDe || data.certificationBadge?.titleEn;
	const certDescription = (isEn ? data.certificationBadge?.descriptionEn : data.certificationBadge?.descriptionDe) || data.certificationBadge?.descriptionDe || data.certificationBadge?.descriptionEn;
	const hasCertificationBadge = certTitle && certDescription;

	const badge = (isEn ? data.badgeEn : data.badgeDe) || data.badgeDe || data.badgeEn;
	const title = (isEn ? data.titleEn : data.titleDe) || data.titleDe || data.titleEn;
	const titleHighlight = (isEn ? data.titleHighlightEn : data.titleHighlightDe) || data.titleHighlightDe || data.titleHighlightEn;
	const content = (isEn ? data.contentEn : data.contentDe) || data.contentDe || data.contentEn;
	const primaryCtaText = (isEn ? data.primaryCta?.textEn : data.primaryCta?.textDe) || data.primaryCta?.textDe || data.primaryCta?.textEn;
	const secondaryCtaText = (isEn ? data.secondaryCta?.textEn : data.secondaryCta?.textDe) || data.secondaryCta?.textDe || data.secondaryCta?.textEn;

	return (
		<section className="section-padding bg-background relative overflow-hidden">
			<div className="_container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
				{/* Only render image section if we have an image */}
				{hasImage && (
					<div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-secondary/5">
						<ImageComponent
							src={data.image!}
							alt="About Section Image"
							height={0}
							width={0}
							sizes="100vw"
							wrapperClasses="w-full h-full"
							className="object-cover w-full h-full"
						/>

						{/* Decorative elements */}
						<div className="absolute inset-0 bg-linear-to-t from-secondary/60 via-transparent to-transparent" />
						{hasCertificationBadge && (
							<div className="absolute bottom-8 left-8 right-8 text-white bg-secondary/80 backdrop-blur-sm p-8 rounded-3xl">
								<div className="flex items-center gap-3 mb-2">
									<div className="bg-primary rounded-full p-1">
										<CheckCircle2 className="h-4 w-4 text-white" />
									</div>
									<span className="font-bold text-lg tracking-wide uppercase">
										{certTitle}
									</span>
								</div>
								<p className="text-sm text-white/80">
									{`"${certDescription}"`}
								</p>
							</div>
						)}
					</div>
				)}

				<div className="space-y-8">
					{badge && (
						<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 w-fit border border-primary/20">
							<span className="text-xs font-bold text-primary uppercase tracking-wider">
								{badge}
							</span>
						</div>
					)}
					<h2 className="text-4xl md:text-5xl font-medium text-secondary leading-tight font-heading">
						{title}{" "}
						{titleHighlight && (
							<span className="text-primary">{titleHighlight}</span>
						)}
					</h2>
					<p className="text-foreground/70 text-lg leading-relaxed">
						{content}
					</p>

					{data.benefits && data.benefits.length > 0 && (
						<ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
							{data.benefits.map((item, i) => (
								<li key={i} className="flex items-center gap-3 group">
									<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
										<CheckCircle2 className="h-5 w-5 text-primary group-hover:text-white transition-colors duration-300" />
									</div>
									<span className="font-medium text-secondary group-hover:text-primary transition-colors">
										{item}
									</span>
								</li>
							))}
						</ul>
					)}

					<div className="pt-6 flex flex-wrap gap-4">
						{primaryCtaText && data.primaryCta?.href && (
							<Button
								asChild
								variant={data.primaryCta.variant ?? "primary"}
								size="lg"
								className="rounded-full px-8 h-12 shadow-lg"
							>
								<Link href={data.primaryCta.href}>{primaryCtaText}</Link>
							</Button>
						)}
						{secondaryCtaText && data.secondaryCta?.href && (
							<Button
								asChild
								variant={data.secondaryCta.variant ?? "outline"}
								size="lg"
								className="rounded-full px-8 h-12 gap-2"
							>
								<Link href={data.secondaryCta.href}>
									{secondaryCtaText} <ArrowRight className="h-4 w-4" />
								</Link>
							</Button>
						)}
					</div>
				</div>
			</div>
		</section>
	);
};

export default AboutSection;
