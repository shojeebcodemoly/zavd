/**
 * Seed script for Reseller Page data
 * Run with: npx tsx scripts/seed-reseller-page.ts
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
				// Skip empty lines and comments
				if (!trimmed || trimmed.startsWith("#")) continue;
				const eqIndex = trimmed.indexOf("=");
				if (eqIndex === -1) continue;
				const key = trimmed.slice(0, eqIndex).trim();
				let value = trimmed.slice(eqIndex + 1).trim();
				// Remove surrounding quotes if present
				if (
					(value.startsWith('"') && value.endsWith('"')) ||
					(value.startsWith("'") && value.endsWith("'"))
				) {
					value = value.slice(1, -1);
				}
				// Only set if not already defined (CLI env vars take precedence)
				if (!process.env[key]) {
					process.env[key] = value;
				}
			}
			break;
		}
	}
}

// Load env file before anything else
loadEnvFile();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	console.error("MONGODB_URI is not defined in environment variables");
	process.exit(1);
}

// Reseller page data for cheese business
const resellerPageData = {
	sectionVisibility: {
		hero: true,
		benefits: true,
		form: true,
	},

	// Hero Section
	hero: {
		badge: "Partnership",
		title: "Become Our Reseller",
		titleHighlight: "Reseller",
		subtitle:
			"Partner with us and offer your customers Sweden's finest artisan cheese. We offer competitive terms and full support for our partners.",
		backgroundImage: "",
	},

	// Benefits Section
	benefits: {
		title: "Benefits of Becoming a Partner",
		subtitle: "Discover the advantages of joining our reseller family",
		benefits: [
			{
				icon: "TrendingUp",
				title: "Competitive Margins",
				description:
					"Generous margins that give you the opportunity to grow your business with our premium products.",
			},
			{
				icon: "Handshake",
				title: "Dedicated Support",
				description:
					"A dedicated contact person who helps you with everything from orders to marketing.",
			},
			{
				icon: "Award",
				title: "Quality Products",
				description:
					"Artisan cheese of the highest quality, crafted with passion and tradition in Boxholm for generations.",
			},
			{
				icon: "Shield",
				title: "Flexible Deliveries",
				description:
					"Customized delivery schedules that suit your business, with reliable and fast distribution.",
			},
		],
	},

	// Form Section
	formSection: {
		title: "Apply for Partnership",
		subtitle:
			"Fill out the form below and we will contact you within 24 hours to discuss the opportunities.",
		successMessage: "Thank you for your application!",
		successDescription:
			"We have received your application and will contact you shortly to discuss the partnership further.",
	},

	// SEO
	seo: {
		title: "Become a Reseller | Boxholm Cheese",
		description:
			"Apply to become a reseller for Boxholm Cheese. Partner with us and offer your customers Sweden's finest artisan cheese with competitive terms.",
		ogImage: "",
	},
};

async function seedResellerPage() {
	try {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(MONGODB_URI!);
		console.log("Connected to MongoDB");

		const db = mongoose.connection.db;
		if (!db) {
			throw new Error("Database connection not established");
		}

		const collection = db.collection("reseller_page");

		// Check if document exists
		const existingDoc = await collection.findOne({});

		if (existingDoc) {
			console.log("Reseller page document already exists. Updating...");
			await collection.updateOne({}, { $set: resellerPageData });
			console.log("Reseller page document updated successfully!");
		} else {
			console.log("Creating new reseller page document...");
			await collection.insertOne({
				...resellerPageData,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			console.log("Reseller page document created successfully!");
		}

		console.log("\n========================================");
		console.log("RESELLER PAGE DATA SEEDED SUCCESSFULLY!");
		console.log("========================================\n");

		console.log("The reseller page is now available at:");
		console.log("  - Public page: /become-our-reseller");
		console.log("  - Admin page: /dashboard/webbplats/reseller");
		console.log("\n========================================\n");
	} catch (error) {
		console.error("Error seeding reseller page:", error);
	} finally {
		await mongoose.disconnect();
		console.log("Disconnected from MongoDB");
	}
}

seedResellerPage();
