import Link from "next/link";
import { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { ImageComponent } from "../common/image-component";

interface ProductCardProps {
	product: Product;
	variant?: "grid" | "list";
}

export function ProductCard({ product, variant = "grid" }: ProductCardProps) {
	const primaryImage =
		product.images?.find((img) => img.isPrimary) ||
		product.images?.[0] ||
		null;

	if (variant === "list") {
		return (
			<Card className="group overflow-hidden border-primary/50 transition-all hover:border-primary/50 hover:shadow-lg">
				<div className="flex flex-col md:flex-row">
					{/* Image Section */}
					<div className="relative w-40 h-full max-h-[300px] md:w-80 overflow-hidden bg-primary">
						<ImageComponent
							src={primaryImage?.url}
							alt={primaryImage?.alt}
							height={0}
							width={0}
							sizes="100vw"
							showLoader
							wrapperClasses="w-full h-full"
							className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
						/>
					</div>

					{/* Content Section */}
					<div className="flex flex-1 flex-col p-6">
						<div className="mb-3">
							<h3
								className="mb-2 text-2xl font-medium text-foreground transition-colors group-hover:text-primary"
								style={{ fontFamily: 'Raleway, sans-serif' }}
							>
								{product.name}
							</h3>
							<p className="text-sm text-muted-foreground line-clamp-2">
								{product.description}
							</p>
						</div>

						{/* Treatment Tags */}
						<div className="mb-4 flex flex-wrap gap-2">
							{product.treatments.slice(0, 4).map((treatment) => (
								<Badge
									key={treatment}
									variant="secondary"
									className="bg-tertiary/20 text-secondary hover:bg-tertiary/30"
								>
									{treatment}
								</Badge>
							))}
							{product.treatments.length > 4 && (
								<Badge
									variant="outline"
									className="border-primary/5 text-muted-foreground"
								>
									+{product.treatments.length - 4} mer
								</Badge>
							)}
						</div>

						{/* Features Preview */}
						{product.features.length > 0 && (
							<ul className="mb-4 space-y-1">
								{product.features.slice(0, 3).map((feature, index) => (
									<li
										key={index}
										className="flex items-start text-sm text-foreground"
									>
										<svg
											className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-primary"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
										<span>{feature.title}</span>
									</li>
								))}
							</ul>
						)}

						<div className="mt-auto">
							<Button
								asChild
								className="bg-primary text-primary-foreground hover:bg-primary-hover transition-colors"
							>
								<Link href={`/products/category/${product.categories?.[0] || "uncategorized"}/${product.slug}`}>
									Läs mer & Specifikationer
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</Card>
		);
	}

	// Grid variant
	return (
		<Link href={`/products/category/${product.categories?.[0] || "uncategorized"}/${product.slug}`}>
			<Card className="group h-full overflow-hidden border-primary/10 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/20 translate transition-all duration-300 p-0!" style={{ backgroundColor: '#FAF8F0' }}>
				{/* Image */}
				<div className="relative h-56 overflow-hidden" style={{ backgroundColor: '#F7F1DB' }}>
					<ImageComponent
						src={primaryImage?.url}
						alt={primaryImage?.alt}
						height={0}
						width={0}
						sizes="100vw"
						showLoader
						wrapperClasses="w-full h-full"
						className="object-cover transition-transform h-full w-full duration-300 group-hover:scale-105"
					/>
				</div>

				<CardHeader className="px-2 py-1">
					<h3
						className="text-lg font-medium text-foreground transition-colors group-hover:text-primary line-clamp-2"
						style={{ fontFamily: 'Raleway, sans-serif' }}
					>
						{product.name}
					</h3>
				</CardHeader>

				<CardContent className="px-2 py-1">
					<p className="mb-2 text-xs text-muted-foreground line-clamp-2">
						{product.description}
					</p>

					{/* Treatment Tags */}
					<div className="flex flex-wrap gap-0.5">
						{product.treatments.slice(0, 3).map((treatment) => (
							<Badge
								key={treatment}
								variant="secondary"
								className="bg-primary/5 text-primary/80 text-[10px] hover:bg-primary/5"
							>
								{treatment}
							</Badge>
						))}
					</div>
				</CardContent>

				<CardFooter className="p-2!">
					<Button
						size="sm"
						className="w-full bg-primary text-primary-foreground transition-colors p-0!"
					>
						Läs mer
					</Button>
				</CardFooter>
			</Card>
		</Link>
	);
}
