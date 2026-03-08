import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { ImageComponent } from "../common/image-component";
import type { IAboutSection } from "@/models/home-page.model";

interface AboutSectionProps {
	data: IAboutSection;
}

const AboutSection = ({ data }: AboutSectionProps) => {
	const hasImage = !!data.image;
	const hasCertificationBadge =
		data.certificationBadge?.title && data.certificationBadge?.description;

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
										{data.certificationBadge!.title}
									</span>
								</div>
								<p className="text-sm text-white/80">
									{`"${data.certificationBadge!.description}"`}
								</p>
							</div>
						)}
					</div>
				)}

				<div className="space-y-8">
					{data.badge && (
						<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 w-fit border border-primary/20">
							<span className="text-xs font-bold text-primary uppercase tracking-wider">
								{data.badge}
							</span>
						</div>
					)}
					<h2 className="text-4xl md:text-5xl font-medium text-secondary leading-tight font-heading">
						{data.title}{" "}
						{data.titleHighlight && (
							<span className="text-primary">{data.titleHighlight}</span>
						)}
					</h2>
					<p className="text-foreground/70 text-lg leading-relaxed">
						{data.content}
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
						{data.primaryCta?.text && data.primaryCta?.href && (
							<Button
								asChild
								variant={data.primaryCta.variant ?? "primary"}
								size="lg"
								className="rounded-full px-8 h-12 shadow-lg"
							>
								<Link href={data.primaryCta.href}>{data.primaryCta.text}</Link>
							</Button>
						)}
						{data.secondaryCta?.text && data.secondaryCta?.href && (
							<Button
								asChild
								variant={data.secondaryCta.variant ?? "outline"}
								size="lg"
								className="rounded-full px-8 h-12 gap-2"
							>
								<Link href={data.secondaryCta.href}>
									{data.secondaryCta.text} <ArrowRight className="h-4 w-4" />
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
