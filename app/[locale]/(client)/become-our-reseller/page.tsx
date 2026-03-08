import type { Metadata } from "next";
import { getResellerPage, getResellerPageSeo } from "@/lib/services/reseller-page.service";
import { ResellerFormClient } from "./_components/reseller-form-client";
import { getSiteSettings } from "@/lib/services/site-settings.service";
import { ResellerHero } from "./_components/reseller-hero";
import {
	CheckCircle,
	TrendingUp,
	Users,
	Handshake,
	Award,
	Shield,
	Heart,
	Star,
	Zap,
	Target,
} from "lucide-react";

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
	CheckCircle,
	TrendingUp,
	Users,
	Handshake,
	Award,
	Shield,
	Heart,
	Star,
	Zap,
	Target,
};

export async function generateMetadata(): Promise<Metadata> {
	const [seo, siteSettings] = await Promise.all([
		getResellerPageSeo(),
		getSiteSettings(),
	]);

	const siteName = siteSettings.seo?.siteName || "Cheese Business";
	const title = seo?.title || `Become Our Reseller - ${siteName}`;
	const description =
		seo?.description ||
		`Apply to become a reseller for ${siteName}. Partner with us and offer our premium cheese products to your customers.`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: "website",
			siteName,
			...(seo?.ogImage && { images: [{ url: seo.ogImage }] }),
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			...(seo?.ogImage && { images: [seo.ogImage] }),
		},
	};
}

export default async function BecomeOurResellerPage() {
	const resellerPage = await getResellerPage();
	const { sectionVisibility, hero, benefits, formSection } = resellerPage;

	return (
		<div className="bg-primary/50 w-full">
			{/* Hero Section */}
			{sectionVisibility.hero && <ResellerHero data={hero} />}

			{/* Benefits Section */}
			{sectionVisibility.benefits && benefits.benefits && benefits.benefits.length > 0 && (
				<section id="benefits" className="py-16 bg-background">
					<div className="_container">
						{(benefits.title || benefits.subtitle) && (
							<div className="text-center mb-12">
								{benefits.title && (
									<h2 className="text-3xl md:text-4xl font-heading font-medium text-secondary mb-4">
										{benefits.title}
									</h2>
								)}
								{benefits.subtitle && (
									<p className="text-muted-foreground max-w-2xl mx-auto">
										{benefits.subtitle}
									</p>
								)}
							</div>
						)}

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							{benefits.benefits.map((benefit, index) => {
								const IconComponent = iconMap[benefit.icon || "CheckCircle"] || CheckCircle;
								return (
									<div
										key={index}
										className="p-6 rounded-2xl bg-muted border border-border hover:shadow-lg transition-shadow"
									>
										<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
											<IconComponent className="h-6 w-6 text-primary" />
										</div>
										{benefit.title && (
											<h3 className="text-lg font-semibold text-secondary mb-2">
												{benefit.title}
											</h3>
										)}
										{benefit.description && (
											<p className="text-sm text-muted-foreground">
												{benefit.description}
											</p>
										)}
									</div>
								);
							})}
						</div>
					</div>
				</section>
			)}

			{/* Form Section */}
			{sectionVisibility.form && (
				<section id="application-form" className="section-padding bg-muted">
					<div className="_container">
						<div className="mx-auto max-w-3xl">
							{(formSection.title || formSection.subtitle) && (
								<div className="text-center mb-8">
									{formSection.title && (
										<h2 className="text-3xl md:text-4xl font-heading font-medium text-secondary mb-4">
											{formSection.title}
										</h2>
									)}
									{formSection.subtitle && (
										<p className="text-muted-foreground">{formSection.subtitle}</p>
									)}
								</div>
							)}
							<ResellerFormClient
								successMessage={formSection.successMessage}
								successDescription={formSection.successDescription}
							/>
						</div>
					</div>
				</section>
			)}
		</div>
	);
}
