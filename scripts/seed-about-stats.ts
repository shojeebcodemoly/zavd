/**
 * Seed About Page Stats Section with Demo Data
 *
 * This script seeds the about page stats section with demo statistics
 * (e.g., number of cows, goats, liters per day)
 *
 * Usage: npx tsx scripts/seed-about-stats.ts
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

const statsData = {
	backgroundColor: "#ffffff",
	items: [
		{
			image: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=500&h=500&fit=crop&q=80",
			value: "87",
			label: "Cows",
			description: "Our cows are fed only the best grasses and feeds, which directly affects the quality of the milk. We carefully monitor their diet",
		},
		{
			image: "https://images.unsplash.com/photo-1524024973431-2ad916746881?w=500&h=500&fit=crop&q=80",
			value: "236",
			label: "Goats",
			description: "Fresh milk is the foundation of our products. We milk our cows twice a day to provide you with the highest quality milk",
		},
		{
			image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&h=500&fit=crop&q=80",
			value: "4K+",
			label: "Liters per day",
			description: "We are proud to follow centuries-old cheese-making traditions. Every batch of cheese is the result of a long aging process and meticulous effort",
		},
	],
};

async function main() {
	console.log("\n========================================");
	console.log("  Seed About Page Stats Section");
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
		const collection = db.collection("about_page");

		// Check if about page already exists
		const existing = await collection.findOne({});

		if (existing) {
			console.log("About page exists. Updating stats section...");
			await collection.updateOne(
				{ _id: existing._id },
				{
					$set: {
						stats: statsData,
						"sectionVisibility.stats": true,
						updatedAt: new Date(),
					},
				}
			);
			console.log("✓ Stats section updated");
		} else {
			console.log("Creating new about page with stats section...");
			await collection.insertOne({
				sectionVisibility: {
					history: true,
					customers: true,
					video: true,
					gallery: true,
					team: true,
					contact: true,
					stats: true,
				},
				history: {},
				customers: {},
				video: {},
				gallery: {},
				team: {},
				contact: {},
				stats: statsData,
				seo: {},
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			console.log("✓ About page created with stats section");
		}

		console.log("\n========================================");
		console.log("  Summary");
		console.log("========================================");
		console.log(`  Stats items added: ${statsData.items.length}`);
		statsData.items.forEach((item, index) => {
			console.log(`    ${index + 1}. ${item.value} ${item.label}`);
		});
		console.log("========================================\n");
		console.log("Visit http://localhost:3000/about-us to see the section!");
		console.log("Visit http://localhost:3000/dashboard/webbplats/om-oss to edit.\n");

	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	} finally {
		await client.close();
	}
}

main();
