/**
 * Blog Data Migration Script
 *
 * This script migrates static blog data from data/blog/blog-data.ts
 * to MongoDB blog_posts and blog_categories collections.
 *
 * Usage:
 *   npx tsx scripts/migrate-blog-data.ts
 *
 * Prerequisites:
 *   - MongoDB connection configured in .env
 *   - At least one user in the database (will be used as author)
 */

import "dotenv/config";
import { connectMongoose } from "@/lib/db/db-connect";
import { getBlogCategoryModel } from "@/models/blog-category.model";
import { getBlogPostModel } from "@/models/blog-post.model";
import mongoose from "mongoose";

// Import static blog data
// Note: This import path may need adjustment based on your setup
import { blogArticles } from "../data/blog/blog-data";

interface MigrationStats {
	categories: {
		created: number;
		existing: number;
		errors: number;
	};
	posts: {
		created: number;
		existing: number;
		errors: number;
	};
}

/**
 * Create slug from category name
 */
function createCategorySlug(name: string): string {
	return name
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[åä]/g, "a")
		.replace(/ö/g, "o")
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-]/g, "")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}

/**
 * Extract unique categories from articles
 */
function extractCategories(articles: typeof blogArticles): string[] {
	const categoriesSet = new Set<string>();
	articles.forEach((article) => {
		article.categories.forEach((cat) => categoriesSet.add(cat));
	});
	return Array.from(categoriesSet);
}

/**
 * Migrate categories to database
 */
async function migrateCategories(
	categories: string[],
	stats: MigrationStats
): Promise<Map<string, mongoose.Types.ObjectId>> {
	const categoryMap = new Map<string, mongoose.Types.ObjectId>();
	const BlogCategory = await getBlogCategoryModel();

	for (const categoryName of categories) {
		try {
			const slug = createCategorySlug(categoryName);

			// Check if category already exists
			const existing = await BlogCategory.findOne({ slug });

			if (existing) {
				console.log(`  Category exists: ${categoryName} (${slug})`);
				categoryMap.set(categoryName, existing._id);
				stats.categories.existing++;
			} else {
				const category = await BlogCategory.create({
					name: categoryName,
					slug,
					description: "",
					parent: null,
					isActive: true,
					order: 0,
				});
				console.log(`  Created category: ${categoryName} (${slug})`);
				categoryMap.set(categoryName, category._id);
				stats.categories.created++;
			}
		} catch (error) {
			console.error(`  Error creating category ${categoryName}:`, error);
			stats.categories.errors++;
		}
	}

	return categoryMap;
}

/**
 * Get default author ID (first user in database)
 */
async function getDefaultAuthorId(): Promise<mongoose.Types.ObjectId | null> {
	try {
		const User = mongoose.models.user || mongoose.model("user", new mongoose.Schema({}, { strict: false }));
		const user = await User.findOne({});
		return user?._id || null;
	} catch (error) {
		console.error("Error finding default author:", error);
		return null;
	}
}

/**
 * Migrate blog posts to database
 */
async function migratePosts(
	articles: typeof blogArticles,
	categoryMap: Map<string, mongoose.Types.ObjectId>,
	authorId: mongoose.Types.ObjectId,
	stats: MigrationStats
): Promise<void> {
	const BlogPost = await getBlogPostModel();

	for (const article of articles) {
		try {
			// Check if post already exists by slug
			const existing = await BlogPost.findOne({ slug: article.slug });

			if (existing) {
				console.log(`  Post exists: ${article.title}`);
				stats.posts.existing++;
				continue;
			}

			// Map category names to ObjectIds
			const categoryIds = article.categories
				.map((catName) => categoryMap.get(catName))
				.filter((id): id is mongoose.Types.ObjectId => id !== undefined);

			// Create the post
			const postData = {
				title: article.title,
				slug: article.slug,
				excerpt: article.excerpt || "",
				content: article.content || "",
				featuredImage: article.featuredImage
					? {
							url: article.featuredImage.url,
							alt: article.featuredImage.alt || article.title,
					  }
					: undefined,
				headerImage: undefined,
				author: authorId,
				categories: categoryIds,
				tags: article.tags || [],
				seo: {
					title: article.seo?.title || "",
					description: article.seo?.description || "",
					keywords: article.seo?.keywords || [],
					ogImage: article.seo?.ogImage || "",
					canonicalUrl: "",
					noindex: false,
				},
				publishType: "publish" as const,
				publishedAt: article.publishedAt
					? new Date(article.publishedAt)
					: new Date(),
			};
			await BlogPost.create(postData);

			console.log(`  Created post: ${article.title}`);
			stats.posts.created++;
		} catch (error) {
			console.error(`  Error creating post ${article.title}:`, error);
			stats.posts.errors++;
		}
	}
}

/**
 * Main migration function
 */
async function migrate(): Promise<void> {
	console.log("=".repeat(60));
	console.log("Blog Data Migration Script");
	console.log("=".repeat(60));
	console.log("");

	const stats: MigrationStats = {
		categories: { created: 0, existing: 0, errors: 0 },
		posts: { created: 0, existing: 0, errors: 0 },
	};

	try {
		// Connect to database
		console.log("Connecting to MongoDB...");
		await connectMongoose();
		console.log("Connected!");
		console.log("");

		// Get default author
		console.log("Finding default author...");
		const authorId = await getDefaultAuthorId();

		if (!authorId) {
			console.error("ERROR: No users found in database.");
			console.error("Please create a user first before running migration.");
			process.exit(1);
		}
		console.log(`Using author ID: ${authorId}`);
		console.log("");

		// Check if there are articles to migrate
		console.log(`Found ${blogArticles.length} articles to migrate`);
		console.log("");

		if (blogArticles.length === 0) {
			console.log("No articles to migrate. Exiting.");
			process.exit(0);
		}

		// Extract and migrate categories
		console.log("Migrating categories...");
		const categories = extractCategories(blogArticles);
		console.log(`Found ${categories.length} unique categories`);
		const categoryMap = await migrateCategories(categories, stats);
		console.log("");

		// Migrate posts
		console.log("Migrating blog posts...");
		await migratePosts(blogArticles, categoryMap, authorId, stats);
		console.log("");

		// Print summary
		console.log("=".repeat(60));
		console.log("Migration Summary");
		console.log("=".repeat(60));
		console.log("");
		console.log("Categories:");
		console.log(`  Created:  ${stats.categories.created}`);
		console.log(`  Existing: ${stats.categories.existing}`);
		console.log(`  Errors:   ${stats.categories.errors}`);
		console.log("");
		console.log("Blog Posts:");
		console.log(`  Created:  ${stats.posts.created}`);
		console.log(`  Existing: ${stats.posts.existing}`);
		console.log(`  Errors:   ${stats.posts.errors}`);
		console.log("");
		console.log("Migration completed!");
	} catch (error) {
		console.error("Migration failed:", error);
		process.exit(1);
	} finally {
		await mongoose.disconnect();
	}
}

// Run migration
migrate().catch(console.error);
