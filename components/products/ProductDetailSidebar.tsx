"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Download,
	Video,
	Phone,
	Mail,
	Check,
	BookOpen,
	Zap,
	Shield,
	ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

interface ProductDetailSidebarProps {
	brochureUrl?: Array<{
		title: string;
		url: string;
		_id: string;
	}> | null;
	videoUrl?: string;
	certifications?: string[] | null;
}

export function ProductDetailSidebar({
	brochureUrl,
	videoUrl,
	certifications,
}: ProductDetailSidebarProps) {
	return (
		<aside className="space-y-4">
			{/* Quick Actions - Primary CTA */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
			>
				<Card className="border-0 bg-linear-to-br from-primary via-primary to-secondary text-primary-foreground shadow-lg shadow-primary/15 overflow-hidden relative">
					{/* Decorative Elements */}
					<div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />

					<CardHeader className="pb-1.5 pt-4 px-4 relative">
						<CardTitle className="text-base font-bold">
							Intresserad av denna produkt?
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 px-4 pb-4 relative">
						<p className="text-xs text-primary-foreground/85">
							Kontakta oss för mer information, demo eller offert.
						</p>
						<div className="space-y-2">
							<Button
								asChild
								size="sm"
								className="w-full bg-white text-primary font-semibold flex items-center justify-center hover:bg-white/95 gap-2 shadow-md hover:shadow-lg transition-all duration-200 h-9 text-sm"
							>
								<Link href="/contact-us">
									<Mail className="h-4 w-4" />
									Begär offert
									<ChevronRight className="h-3.5 w-3.5 ml-auto" />
								</Link>
							</Button>
							<Button
								asChild
								variant="outline"
								size="sm"
								className="w-full border border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white hover:border-white/50 gap-2 flex items-center justify-center transition-all duration-200 h-9 text-sm"
							>
								<Link href="tel:+46102051501">
									<Phone className="h-4 w-4" />
									Ring oss
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Certifications */}
			{certifications && certifications.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.25 }}
				>
					<Card className="border border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-sm">
						<CardHeader className="pb-2 pt-3 px-4">
							<CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
								<div className="h-6 w-6 rounded-md bg-emerald-100 flex items-center justify-center">
									<Shield className="h-3.5 w-3.5 text-emerald-600" />
								</div>
								Certifieringar
							</CardTitle>
						</CardHeader>
						<CardContent className="pt-0 px-4 pb-3">
							<div className="flex flex-wrap gap-1.5">
								{certifications.map((cert, index) => (
									<div
										key={index}
										className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-linear-to-r from-emerald-50 to-emerald-100/80 border border-emerald-200/60 text-emerald-700 text-xs font-medium"
									>
										<Check className="h-3 w-3" />
										{cert}
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</motion.div>
			)}

			{/* Resources */}
			{(brochureUrl?.length || videoUrl) && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
				>
					<Card className="border border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-sm">
						<CardHeader className="pb-2 pt-3 px-4">
							<CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
								<div className="h-6 w-6 rounded-md bg-blue-100 flex items-center justify-center">
									<Download className="h-3.5 w-3.5 text-blue-600" />
								</div>
								Resurser
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-1.5 pt-0 px-4 pb-3">
							{brochureUrl?.map((brochure) => (
								<Link
									key={brochure._id}
									href={brochure.url}
									title={brochure.title}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50/80 p-2.5 text-xs font-medium text-foreground transition-all duration-200 hover:border-primary hover:bg-primary/5 group"
								>
									<div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
										<Download className="h-3.5 w-3.5 text-primary" />
									</div>
									<span className="flex-1">Ladda ner broschyr</span>
									<ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
								</Link>
							))}
							{videoUrl && (
								<Link
									href={videoUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50/80 p-2.5 text-xs font-medium text-foreground transition-all duration-200 hover:border-primary hover:bg-primary/5 group"
								>
									<div className="h-7 w-7 rounded-md bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
										<Video className="h-3.5 w-3.5 text-red-600" />
									</div>
									<span className="flex-1">Se produktvideo</span>
									<ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
								</Link>
							)}
						</CardContent>
					</Card>
				</motion.div>
			)}

			{/* Need Help Card */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.35 }}
			>
				<Card className="border border-slate-200/80 bg-linear-to-br from-primary/20 to-slate-100 shadow-sm">
					<CardHeader className="pb-2 pt-3 px-4">
						<CardTitle className="text-sm font-bold text-foreground">
							Need Help?
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 pt-0 px-4 pb-3">
						<p className="text-xs text-foreground">
							Our experts can help you find the perfect cheese for your needs.
						</p>
						<Link
							href="/contact-us"
							className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
						>
							Contact Us
						</Link>
					</CardContent>
				</Card>
			</motion.div>

			{/* Why Choose Us */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.4 }}
			>
				<Card className="border border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-sm">
					<CardHeader className="pb-2 pt-3 px-4">
						<CardTitle className="text-sm font-bold text-foreground">
							Why Choose Us?
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2 pt-0 px-4 pb-3">
						<div className="flex items-start gap-2.5">
							<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20">
								<Shield className="h-3.5 w-3.5 text-primary" />
							</div>
							<div className="min-w-0">
								<h4 className="text-xs font-semibold text-foreground">
									Quality Certified
								</h4>
								<p className="text-[10px] text-muted-foreground leading-tight">
									All products meet the highest quality standards
								</p>
							</div>
						</div>

						<div className="flex items-start gap-2.5">
							<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20">
								<BookOpen className="h-3.5 w-3.5 text-primary" />
							</div>
							<div className="min-w-0">
								<h4 className="text-xs font-semibold text-foreground">
									Traditional Recipes
								</h4>
								<p className="text-[10px] text-muted-foreground leading-tight">
									Crafted using time-honored techniques passed down for generations
								</p>
							</div>
						</div>

						<div className="flex items-start gap-2.5">
							<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20">
								<Zap className="h-3.5 w-3.5 text-primary" />
							</div>
							<div className="min-w-0">
								<h4 className="text-xs font-semibold text-foreground">
									Fast Delivery
								</h4>
								<p className="text-[10px] text-muted-foreground leading-tight">
									Fresh products delivered quickly to your door
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</aside>
	);
}
