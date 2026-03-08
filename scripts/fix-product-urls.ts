/**
 * Fix Product URLs and Initialize Like Counts
 *
 * This script:
 * 1. Updates heroSettings.ctaUrl from /contact or /contact-us to /products
 * 2. Converts Swedish variant URLs to English format
 * 3. Initializes likeCount for existing products (if not set)
 *
 * Usage: npx tsx scripts/fix-product-urls.ts
 */

import * as fs from "fs";
import * as path from "path";
import { MongoClient } from "mongodb";

// Load .env file manually
function loadEnvFile() {
	const envFiles = [".env.local", ".env"];
	for (const envFile of envFiles) {
		const envPath = path.resolve(process.cwd(), envFile);
		if (fs.existsSync(envPath)) {
			console.log(`Loading environment from ${envFile}...`);
			const content = fs.readFileSync(envPath, "utf-8");
			for (const line of content.split("\n")) {
				const trimmed = line.trim();
				if (!trimmed || trimmed.startsWith("#")) continue;
				const eqIndex = trimmed.indexOf("=");
				if (eqIndex === -1) continue;
				const key = trimmed.slice(0, eqIndex).trim();
				let value = trimmed.slice(eqIndex + 1).trim();
				if (
					(value.startsWith('"') && value.endsWith('"')) ||
					(value.startsWith("'") && value.endsWith("'"))
				) {
					value = value.slice(1, -1);
				}
				if (!process.env[key]) {
					process.env[key] = value;
				}
			}
			break;
		}
	}
}

loadEnvFile();

/**
 * Convert Swedish product URL to English format
 */
function convertSwedishUrl(url: string, categorySlug: string = "uncategorized"): string {
	if (url.startsWith("/produkter/produkt/")) {
		const slug = url.replace("/produkter/produkt/", "");
		return `/products/category/${categorySlug}/${slug}`;
	}
	return url;
}

async function main() {
	console.log("\n========================================");
	console.log("  Fix Product URLs & Initialize Likes");
	console.log("========================================\n");

	const mongoUri = process.env.MONGODB_URI;
	const dbName = process.env.MONGODB_DB || "cheese-db";

	if (!mongoUri) {
		console.error("Error: MONGODB_URI environment variable is required.");
		process.exit(1);
	}

	console.log("Connecting to MongoDB...");
	const client = new MongoClient(mongoUri);

	try {
		await client.connect();
		const db = client.db(dbName);
		const productsCollection = db.collection("products");

		// Get all products
		const products = await productsCollection.find({}).toArray();
		console.log(`Found ${products.length} products to process.\n`);

		let updatedCount = 0;
		let ctaUrlFixed = 0;
		let variantUrlsFixed = 0;
		let likeCountInitialized = 0;

		for (const product of products) {
			const updates: Record<string, unknown> = {};
			let needsUpdate = false;

			// 1. Fix heroSettings.ctaUrl
			if (product.heroSettings) {
				const ctaUrl = product.heroSettings.ctaUrl;
				if (ctaUrl === "/contact" || ctaUrl === "/contact-us" || !ctaUrl) {
					updates["heroSettings.ctaUrl"] = "/products";
					needsUpdate = true;
					ctaUrlFixed++;
				}
			}

			// 2. Fix product variant URLs
			if (product.productVariants && product.productVariants.length > 0) {
				const categorySlug = product.primaryCategory?.slug ||
					(product.categories && product.categories[0]?.slug) ||
					"uncategorized";

				let variantsUpdated = false;
				const fixedVariants = product.productVariants.map((variant: { url: string; name: string; icon: string; _id?: string }) => {
					if (variant.url.startsWith("/produkter/produkt/")) {
						variantsUpdated = true;
						return {
							...variant,
							url: convertSwedishUrl(variant.url, categorySlug),
						};
					}
					return variant;
				});

				if (variantsUpdated) {
					updates["productVariants"] = fixedVariants;
					needsUpdate = true;
					variantUrlsFixed++;
				}
			}

			// 3. Initialize likeCount if not set
			if (product.likeCount === undefined || product.likeCount === null) {
				updates["likeCount"] = 0;
				needsUpdate = true;
				likeCountInitialized++;
			}

			// Apply updates
			if (needsUpdate) {
				await productsCollection.updateOne(
					{ _id: product._id },
					{ $set: updates }
				);
				updatedCount++;
				console.log(`  ✓ Updated: ${product.title} (${product.slug})`);
			}
		}

		console.log("\n========================================");
		console.log("  Summary");
		console.log("========================================");
		console.log(`  Total products processed: ${products.length}`);
		console.log(`  Products updated: ${updatedCount}`);
		console.log(`  CTA URLs fixed: ${ctaUrlFixed}`);
		console.log(`  Variant URLs fixed: ${variantUrlsFixed}`);
		console.log(`  Like counts initialized: ${likeCountInitialized}`);
		console.log("========================================\n");

	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	} finally {
		await client.close();
	}
}

main();
