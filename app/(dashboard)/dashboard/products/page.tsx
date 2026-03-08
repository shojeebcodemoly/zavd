import { headers } from "next/headers";
import { getAuth } from "@/lib/db/auth";
import { productService } from "@/lib/services/product.service";
import { ProductsList } from "./products-list";

interface PageProps {
	searchParams: Promise<{
		page?: string;
		search?: string;
		status?: string;
	}>;
}

// Type for populated category (after Mongoose populate)
interface PopulatedCategory {
	_id: { toString(): string };
	name: string;
	slug: string;
}

/**
 * Products Dashboard Page - Server Component
 * Fetches initial data on the server and passes to client component
 */
export default async function ProductsPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const page = parseInt(params.page || "1", 10);
	const search = params.search || "";
	const status = params.status || ""; // Empty string means "all"

	// Get session from server
	const auth = await getAuth();
	const headersList = await headers();
	const session = await auth.api.getSession({ headers: headersList });

	// Fetch initial products
	let products: Awaited<
		ReturnType<typeof productService.getProducts>
	>["data"] = [];
	let totalPages = 1;
	let stats = null;

	if (session?.user?.id) {
		try {
			const result = await productService.getProducts({
				page,
				limit: 10,
				search: search || undefined,
				publishType: status
					? (status as "publish" | "draft" | "private")
					: undefined,
				sort: "-createdAt",
			});

			products = result.data;
			totalPages = result.totalPages;

			// Fetch stats
			stats = await productService.getProductStats();
		} catch (error) {
			console.error("Failed to fetch products:", error);
		}
	}

	return (
		<ProductsList
			initialProducts={products.map((p) => {
				// Categories are populated by Mongoose, cast to proper type
				const populatedCategories =
					p.categories as unknown as PopulatedCategory[];
				return {
					_id: p._id.toString(),
					title: p.title,
					slug: p.slug,
					publishType: p.publishType,
					visibility: p.visibility,
					productImages: p.productImages,
					categories: populatedCategories.map((c) => ({
						_id: c._id?.toString() || "",
						name: c.name,
						slug: c.slug,
					})),
					updatedAt:
						p.updatedAt?.toISOString() || new Date().toISOString(),
					createdAt:
						p.createdAt?.toISOString() || new Date().toISOString(),
				};
			})}
			initialStats={stats}
			initialPage={page}
			initialTotalPages={totalPages}
			initialSearch={search}
			initialStatus={status}
		/>
	);
}
