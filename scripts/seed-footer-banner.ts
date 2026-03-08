/**
 * Seed script for Footer Banner
 * Updates the site settings with a proper footer banner image
 * Run with: npx tsx scripts/seed-footer-banner.ts
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

// Footer banner data - using a dark cheese cellar image for good text readability
const footerBannerData = {
	banner: {
		enabled: true,
		// Using a dark cheese cellar/aging room image - good contrast for white text
		backgroundImage: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=1920&h=800&fit=crop&q=80",
		badge: "ARTISAN CHEESE",
		title: "Handcrafted with passion, enjoyed with love.",
		ctaText: "About Us",
		ctaHref: "/about-us",
	},
	quickLinksTitle: "Quick Links",
	contactTitle: "Contact",
	newsletterTitle: "Stay Updated",
	quickLinks: [
		{ label: "About Us", href: "/about-us", isExternal: false },
		{ label: "Our Products", href: "/products", isExternal: false },
		{ label: "Our Store", href: "/our-store", isExternal: false },
		{ label: "Blog", href: "/blog", isExternal: false },
		{ label: "Contact", href: "/contact-us", isExternal: false },
	],
	newsletterDescription: "Subscribe to get updates on new products, recipes, and farm news.",
	newsletterPlaceholder: "Your email address",
	newsletterButtonText: "Subscribe",
	bottomLinks: [
		{ label: "FAQ", href: "/faq", isExternal: false },
		{ label: "Quality", href: "/quality", isExternal: false },
		{ label: "Become a Reseller", href: "/become-our-reseller", isExternal: false },
	],
};

async function seedFooterBanner() {
	try {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(MONGODB_URI as string);
		console.log("Connected to MongoDB");

		// Get the site_settings collection directly
		const db = mongoose.connection.db;
		if (!db) {
			throw new Error("Database connection not established");
		}

		const collection = db.collection("site_settings");

		// Check if settings exist
		const existingSettings = await collection.findOne({});

		if (existingSettings) {
			// Update existing settings with footer data
			console.log("Updating existing site settings with footer banner...");
			await collection.updateOne(
				{ _id: existingSettings._id },
				{
					$set: {
						footer: footerBannerData,
						updatedAt: new Date(),
					},
				}
			);
			console.log("Footer banner updated successfully!");
		} else {
			// Create new settings with footer data
			console.log("Creating new site settings with footer banner...");
			await collection.insertOne({
				footer: footerBannerData,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			console.log("Footer banner created successfully!");
		}

		// Verify the update
		const updated = await collection.findOne({});
		console.log("\nFooter banner settings:");
		console.log(JSON.stringify(updated?.footer?.banner, null, 2));

	} catch (error) {
		console.error("Error seeding footer banner:", error);
		process.exit(1);
	} finally {
		await mongoose.disconnect();
		console.log("\nDisconnected from MongoDB");
	}
}

seedFooterBanner();
