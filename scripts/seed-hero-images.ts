/**
 * Seed script for Hero Images
 * Updates the home page hero section with beautiful cheese/dairy farm images
 * Run with: npx tsx scripts/seed-hero-images.ts
 */

import mongoose from "mongoose";
import * as fs from "fs";
import * as path from "path";

// Load .env file manually (since we're outside Next.js)
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

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	console.error("MONGODB_URI is not defined in environment variables");
	process.exit(1);
}

// Hero data with beautiful Unsplash images
const heroData = {
	isSlider: true,
	autoPlayInterval: 6000,
	slides: [
		{
			badge: "BORN OF NATURE",
			title: "TRADITIONS OF QUALITY IN EVERY BITE",
			subtitle:
				"We carefully follow traditions passed down through generations to ensure every wheel of cheese is flawless. We use only natural ingredients and age our cheeses in special conditions.",
			// Beautiful cheese wheels in cellar - dark moody image
			backgroundImage: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=1920&h=1080&fit=crop&q=80",
			ctaText: "READ MORE",
			ctaHref: "/om-oss",
			isActive: true,
		},
		{
			badge: "ARTISAN CRAFTED",
			title: "A TASTE BORN IN THE MEADOWS",
			subtitle:
				"Experience the authentic taste of handcrafted dairy products made with love and dedication. Every product tells a story of passion and quality.",
			// Beautiful pastoral farm/meadow scene with cows
			backgroundImage: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1920&h=1080&fit=crop&q=80",
			ctaText: "EXPLORE PRODUCTS",
			ctaHref: "/produkter",
			isActive: true,
		},
		{
			badge: "FARM FRESH",
			title: "FROM OUR FARM TO YOUR TABLE",
			subtitle:
				"Discover the pure taste of nature with our premium dairy products. Made fresh daily using traditional methods that have been perfected over generations.",
			// Cheese making / artisan dairy image
			backgroundImage: "https://images.unsplash.com/photo-1559561853-08451507cbe7?w=1920&h=1080&fit=crop&q=80",
			ctaText: "SHOP NOW",
			ctaHref: "/produkter",
			isActive: true,
		},
	],
	// Legacy fields (not used in slider mode but kept for fallback)
	badge: "ARTISAN CHEESE",
	title: "Handcrafted with Passion",
	titleHighlight: "Passion",
	subtitle: "Experience the authentic taste of traditional cheesemaking",
	backgroundImage: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=1920&h=1080&fit=crop&q=80",
	mainImage: "",
};

// Also update image gallery with proper images
// All fields are filled to ensure proper display on the landing page
// Badge: Short label shown above the title (e.g., "OUR FACILITIES")
// Title: Main heading of the gallery section
// Subtitle: Description text below the title
// Images: Array of gallery images with title and subtitle for each
// CTA fields: Call-to-action card at the bottom with title, subtitle, and button
const imageGalleryData = {
	badge: "OUR FACILITIES",
	title: "Life on Our Farm",
	subtitle: "A glimpse into our daily operations and the care we put into every product",
	images: [
		{
			src: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&h=600&fit=crop&q=80",
			title: "Our Meadows",
			subtitle: "Where our journey begins",
		},
		{
			src: "https://images.unsplash.com/photo-1559561853-08451507cbe7?w=800&h=600&fit=crop&q=80",
			title: "Artisan Crafting",
			subtitle: "Traditional methods, modern care",
		},
		{
			src: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800&h=600&fit=crop&q=80",
			title: "Aging Cellar",
			subtitle: "Where flavors develop",
		},
		{
			src: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&h=600&fit=crop&q=80",
			title: "Fresh Products",
			subtitle: "Ready for your table",
		},
	],
	ctaTitle: "Want to see more?",
	ctaSubtitle: "Book a virtual tour of our facilities and see how we make our products",
	ctaButtonText: "Book Tour",
};

// About section with proper image
const aboutSectionData = {
	badge: "OUR STORY",
	title: "A Family Tradition Since 1985",
	titleHighlight: "Family Tradition",
	description: "For over three decades, our family has been dedicated to producing the finest artisan cheeses using time-honored methods. What started as a small family farm has grown into a beloved local institution, but our commitment to quality and tradition remains unchanged.\n\nWe believe that great cheese starts with happy cows, pristine pastures, and a deep respect for the craft. Every wheel of cheese we produce tells the story of our land, our animals, and our passion.",
	image: "https://images.unsplash.com/photo-1594761051656-153b5336f084?w=800&h=600&fit=crop&q=80",
	stats: [
		{ value: "35+", label: "Years of Excellence" },
		{ value: "50+", label: "Cheese Varieties" },
		{ value: "100%", label: "Natural Ingredients" },
	],
	ctaText: "Learn More About Us",
	ctaHref: "/om-oss",
};

async function seedHeroImages() {
	try {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(MONGODB_URI as string);
		console.log("Connected to MongoDB");

		const db = mongoose.connection.db;
		if (!db) {
			throw new Error("Database connection not established");
		}

		const collection = db.collection("home_page");

		// Check if home page exists
		const existingHomePage = await collection.findOne({});

		if (existingHomePage) {
			console.log("Updating home page with new hero images...");
			await collection.updateOne(
				{ _id: existingHomePage._id },
				{
					$set: {
						hero: heroData,
						imageGallery: imageGalleryData,
						aboutSection: aboutSectionData,
						updatedAt: new Date(),
					},
				}
			);
			console.log("Hero images updated successfully!");
		} else {
			console.log("No home page found. Creating new one...");
			await collection.insertOne({
				hero: heroData,
				imageGallery: imageGalleryData,
				aboutSection: aboutSectionData,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			console.log("Home page created with hero images!");
		}

		// Verify the update
		const updated = await collection.findOne({});
		console.log("\nHero slides:");
		updated?.hero?.slides?.forEach((slide: { title: string; backgroundImage: string }, index: number) => {
			console.log(`  Slide ${index + 1}: ${slide.title}`);
			console.log(`    Image: ${slide.backgroundImage}`);
		});

	} catch (error) {
		console.error("Error seeding hero images:", error);
		process.exit(1);
	} finally {
		await mongoose.disconnect();
		console.log("\nDisconnected from MongoDB");
	}
}

seedHeroImages();
