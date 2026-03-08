/**
 * Seed Quality Page with Demo Data
 *
 * This script seeds the quality page with demo certificates and content
 * to help users understand the page structure.
 *
 * Usage: npx tsx scripts/seed-quality-page.ts
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

const demoCertificates = [
	{
		title: "ISO 22000",
		image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop&q=80",
		description: "Food Safety Management System certification ensuring the highest standards in food production and handling.",
		order: 1,
	},
	{
		title: "HACCP Certified",
		image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop&q=80",
		description: "Hazard Analysis Critical Control Points certification for systematic food safety protocols.",
		order: 2,
	},
	{
		title: "Organic Certified",
		image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=300&fit=crop&q=80",
		description: "Certified organic production methods ensuring natural and sustainable farming practices.",
		order: 3,
	},
	{
		title: "FDA Approved",
		image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop&q=80",
		description: "Food and Drug Administration approval for meeting all federal food safety requirements.",
		order: 4,
	},
	{
		title: "Non-GMO Verified",
		image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=300&fit=crop&q=80",
		description: "Verified non-genetically modified ingredients in all our dairy products.",
		order: 5,
	},
	{
		title: "Animal Welfare Approved",
		image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&h=300&fit=crop&q=80",
		description: "Certification ensuring humane treatment and care of all dairy animals on our farms.",
		order: 6,
	},
];

const qualityPageData = {
	sectionVisibility: {
		hero: true,
		certificates: true,
		description: true,
	},
	hero: {
		badge: "QUALITY ASSURANCE",
		title: "Our",
		titleHighlight: "Certifications",
		subtitle: "We are committed to maintaining the highest standards of quality, safety, and sustainability in everything we do.",
		backgroundImage: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=1920&h=800&fit=crop&q=80",
	},
	certificates: demoCertificates,
	description: {
		title: "Our Commitment to Excellence",
		content: `
			<p>At Milatte Farm, quality isn't just a goal—it's our foundation. Every product that leaves our facility undergoes rigorous testing and quality control measures to ensure it meets the highest standards.</p>

			<h3>Why Our Certifications Matter</h3>
			<p>Our certifications represent our unwavering commitment to:</p>
			<ul>
				<li><strong>Food Safety:</strong> Every step of our production process is monitored and controlled to prevent contamination and ensure product safety.</li>
				<li><strong>Sustainability:</strong> We implement eco-friendly practices that protect our environment for future generations.</li>
				<li><strong>Animal Welfare:</strong> Our cows are treated with care and respect, living in comfortable conditions that promote their well-being.</li>
				<li><strong>Transparency:</strong> We believe in honest, open communication about our processes and ingredients.</li>
			</ul>

			<h3>Continuous Improvement</h3>
			<p>We regularly review and update our practices to stay ahead of industry standards. Our team participates in ongoing training and education to ensure we're always at the forefront of food safety and quality management.</p>

			<p>When you choose Milatte Farm products, you're choosing quality you can trust.</p>
		`,
	},
	seo: {
		title: "Quality & Certifications | Milatte Farm",
		description: "Discover our commitment to quality through our certifications including ISO 22000, HACCP, Organic, and more. Learn about our food safety standards.",
		keywords: ["quality", "certifications", "ISO 22000", "HACCP", "organic", "food safety", "dairy quality"],
		ogImage: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=1200&h=630&fit=crop&q=80",
	},
};

async function main() {
	console.log("\n========================================");
	console.log("  Seed Quality Page with Demo Data");
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
		const collection = db.collection("quality_page");

		// Check if quality page already exists
		const existing = await collection.findOne({});

		if (existing) {
			console.log("Quality page already exists. Updating with demo data...");
			await collection.updateOne(
				{ _id: existing._id },
				{ $set: qualityPageData }
			);
			console.log("✓ Quality page updated with demo data");
		} else {
			console.log("Creating new quality page with demo data...");
			await collection.insertOne({
				...qualityPageData,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			console.log("✓ Quality page created with demo data");
		}

		console.log("\n========================================");
		console.log("  Summary");
		console.log("========================================");
		console.log(`  Certificates added: ${demoCertificates.length}`);
		console.log("  Hero section: Configured with background image");
		console.log("  Description: Added with rich content");
		console.log("  SEO: Configured with title, description, keywords");
		console.log("========================================\n");
		console.log("Visit http://localhost:3000/quality to see the page!");
		console.log("Visit http://localhost:3000/dashboard/webbplats/quality to edit.\n");

	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	} finally {
		await client.close();
	}
}

main();
