import { Phone, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ICtaSection } from "@/models/home-page.model";

interface CtaSectionProps {
	data: ICtaSection;
	phone: string;
	email: string;
}

const CtaSection = ({ data, phone, email }: CtaSectionProps) => {
	return (
		<section className="py-32 bg-secondary relative overflow-hidden">
			<div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
			{/* Abstract shapes */}
			<div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
			<div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />

			<div className="_container relative z-10">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
					<div className="max-w-2xl">
						<h2 className="text-4xl md:text-5xl font-medium mb-6 tracking-tight text-white font-heading">
							{data.title}
						</h2>
						<p className="text-white/80 text-xl mb-8 leading-relaxed">
							{data.subtitle}
						</p>

						<div className="space-y-6">
							<div className="flex items-start gap-4 text-white">
								<div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 text-primary">
									<Phone className="h-6 w-6" />
								</div>
								<div>
									<h4 className="text-lg font-bold">
										{data.phoneTitle || "Call Us"}
									</h4>
									<p className="text-white/70">
										{data.phoneSubtitle ||
											"We are available to help you"}
									</p>
									<a
										href={`tel:${phone}`}
										className="text-primary font-semibold hover:underline mt-1 block"
									>
										{phone}
									</a>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div className="h-12 w-12 rounded-full bg-white text-secondary shadow-sm flex items-center justify-center shrink-0">
									<Mail className="h-6 w-6" />
								</div>
								<div>
									<h4 className="text-lg font-bold text-white">
										{data.emailTitle || "Email Us"}
									</h4>
									<p className="text-white/70">
										{data.emailSubtitle || "Send us a message"}
									</p>
									<a
										href={`mailto:${email}`}
										className="text-primary font-medium mt-1 block hover:underline"
									>
										{email}
									</a>
								</div>
							</div>
						</div>
					</div>

					<div className="w-full">
						<div className="bg-background rounded-2xl shadow-xl border border-border/50 p-8 text-center">
							<h3 className="text-2xl font-medium text-secondary mb-4 font-heading">
								{data.formTitle || "Get in Touch"}
							</h3>
							<p className="text-foreground/70 mb-8">
								{data.formSubtitle ||
									"Fill out the form and we'll get back to you within 24 hours"}
							</p>
							<Button asChild size="lg" className="w-full">
								<Link href={data.formCtaHref || "/contact-us"}>
									{data.formCtaText || "Send Message"}
									<ArrowRight className="ml-2 h-5 w-5" />
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default CtaSection;
