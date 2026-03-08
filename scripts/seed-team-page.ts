/**
 * Seed script for Team Page (Vårt Team) data - Cheese Theme
 * Run with: npx tsx scripts/seed-team-page.ts
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

// Team page data for Boxholm Cheese (English content)
const teamPageData = {
	sectionVisibility: {
		hero: true,
		stats: true,
		teamMembers: true,
		values: true,
		joinUs: false, // Disabled - not showing recruitment section
		contact: true,
		richContent: false,
	},

	// Hero Section
	hero: {
		badge: "Our Team",
		title: "Meet the Team Behind Boxholm Cheese",
		subtitle:
			"We are a dedicated team of master cheese makers, dairy farmers, and enthusiasts who are passionate about creating the finest artisan cheeses.",
	},

	// Stats Section
	stats: [
		{
			value: "100+",
			label: "Years of Tradition",
		},
		{
			value: "1000+",
			label: "Happy Customers",
		},
		{
			value: "15+",
			label: "Cheese Varieties",
		},
		{
			value: "5",
			label: "Generations",
		},
	],

	// Team Members
	teamMembers: [
		{
			name: "Erik Lindgren",
			role: "CEO & Master Cheese Maker",
			department: "Leadership",
			bio: "Erik represents the fifth generation of cheese makers in his family. With over 30 years of experience, he leads the dairy with the same passion as his ancestors, ensuring every wheel of cheese meets our exacting standards.",
			image: "/storage/images/team/placeholder.jpg",
			email: "erik@boxholmsost.se",
			linkedin: "https://linkedin.com/in/",
			phone: "+46 142-510 50",
		},
		{
			name: "Anna Bergström",
			role: "Production Manager",
			department: "Production",
			bio: "Anna oversees all cheese production and ensures every product meets the highest quality standards. Her expertise in milk chemistry and aging processes is unmatched, making her invaluable to our operations.",
			image: "/storage/images/team/placeholder.jpg",
			email: "anna@boxholmsost.se",
			linkedin: "https://linkedin.com/in/",
		},
		{
			name: "Lars Johansson",
			role: "Quality Control Manager",
			department: "Quality Assurance",
			bio: "Lars supervises all quality controls and certifications. He ensures our cheeses always meet the strictest standards, from raw milk testing to final product inspection before shipping.",
			image: "/storage/images/team/placeholder.jpg",
			email: "lars@boxholmsost.se",
		},
		{
			name: "Maria Svensson",
			role: "Sales Director",
			department: "Sales",
			bio: "Maria leads our sales team and builds relationships with retailers and restaurants across Sweden and beyond. Her mission is to spread the love for artisan cheese to new markets.",
			image: "/storage/images/team/placeholder.jpg",
			email: "maria@boxholmsost.se",
		},
		{
			name: "Johan Pettersson",
			role: "Dairy Engineer",
			department: "Technical",
			bio: "Johan combines traditional methods with modern technology to optimize our production without compromising quality. He ensures our equipment runs efficiently while preserving our artisanal approach.",
			image: "/storage/images/team/placeholder.jpg",
			email: "johan@boxholmsost.se",
		},
		{
			name: "Karin Andersson",
			role: "Customer Service",
			department: "Support",
			bio: "Karin is the first point of contact for our customers, helping with everything from orders to product recommendations. Her deep knowledge of our cheese varieties helps customers find their perfect match.",
			image: "/storage/images/team/placeholder.jpg",
			email: "kundservice@boxholmsost.se",
			phone: "+46 142-510 50",
		},
	],

	// Values Section
	valuesSection: {
		title: "Our Values",
		subtitle:
			"What drives us every day is our love for artisan cheese and respect for traditions passed down through generations.",
		values: [
			{
				title: "Tradition",
				description:
					"We preserve and honor the traditional methods passed down through generations while evolving with the times to meet modern standards.",
			},
			{
				title: "Quality",
				description:
					"Every cheese we produce represents our commitment to the highest quality - from the fresh local milk to the finished product on your table.",
			},
			{
				title: "Craftsmanship",
				description:
					"We believe in the power of handmade products. Each cheese is carefully shaped and aged by experienced master cheese makers.",
			},
			{
				title: "Sustainability",
				description:
					"We work with local dairy farmers and strive for sustainable practices that are good for both the environment and our products.",
			},
		],
	},

	// Join Us Section (Disabled)
	joinUs: {
		title: "",
		description: "",
		primaryCta: {
			text: "",
			href: "",
		},
		secondaryCta: {
			text: "",
			href: "",
		},
	},

	// Contact Section
	contact: {
		title: "Get in Touch",
		description:
			"Have questions or want to know more about our team and our cheeses? We're here to help.",
		phone: "+46 142-510 50",
		email: "info@boxholmsost.se",
	},

	// Rich Content (HTML)
	richContent: "",

	// SEO
	seo: {
		title: "Our Team | Boxholm Cheese",
		description:
			"Meet the team behind Boxholm Cheese - experienced master cheese makers and enthusiasts passionate about artisan cheeses with over 100 years of tradition.",
		ogImage: "/storage/images/og-team.jpg",
	},
};

async function seedTeamPage() {
	try {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(MONGODB_URI!);
		console.log("Connected to MongoDB");

		const db = mongoose.connection.db;
		if (!db) {
			throw new Error("Database connection not established");
		}

		const collection = db.collection("team_page");

		// Check if document exists
		const existingDoc = await collection.findOne({});

		if (existingDoc) {
			console.log("Team page document already exists. Updating...");
			await collection.updateOne(
				{},
				{ $set: { ...teamPageData, updatedAt: new Date() } }
			);
			console.log("Team page document updated successfully!");
		} else {
			console.log("Creating new team page document...");
			await collection.insertOne({
				...teamPageData,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			console.log("Team page document created successfully!");
		}

		console.log("\n========================================");
		console.log("TEAM PAGE DATA SEEDED SUCCESSFULLY!");
		console.log("========================================\n");
		console.log("Preview at: /om-oss/team");
	} catch (error) {
		console.error("Error seeding team page:", error);
	} finally {
		await mongoose.disconnect();
		console.log("Disconnected from MongoDB");
	}
}

seedTeamPage();
