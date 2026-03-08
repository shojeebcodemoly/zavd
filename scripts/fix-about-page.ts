/**
 * Fix About Page Data Structure
 * Updates about page to use correct structure (history, customers, team, contact)
 */

import mongoose from "mongoose";
import * as fs from "fs";
import * as path from "path";

// Load .env file manually
function loadEnvFile() {
	const envFiles = [".env.local", ".env"];
	for (const envFile of envFiles) {
		const envPath = path.resolve(process.cwd(), envFile);
		if (fs.existsSync(envPath)) {
			console.log(`Loading environment from ${envFile}...`);
			const envContent = fs.readFileSync(envPath, "utf8");
			envContent.split("\n").forEach((line) => {
				const match = line.match(/^([^=:#]+)=(.*)$/);
				if (match) {
					const key = match[1].trim();
					const value = match[2].trim();
					if (!process.env[key]) {
						process.env[key] = value;
					}
				}
			});
			return;
		}
	}
	console.log("No .env file found, using existing environment variables");
}

loadEnvFile();

const MONGODB_URI =
	process.env.MONGODB_URI || "mongodb+srv://synos-admin:Xc0v778jCOOOElHq@synos-cluster.alvjobm.mongodb.net/cheese-db?retryWrites=true&w=majority";

// Correct About Page Data Structure
const correctAboutPageData = {
	sectionVisibility: {
		history: true,
		customers: true,
		video: true,
		gallery: true,
		team: true,
		contact: true,
		stats: true,
	},
	history: {
		badge: "Our Story",
		title: "130 Years of Tradition",
		subtitle: "From a small family dairy to Sweden's premier artisan cheese maker",
		timelineItems: [
			{
				year: "1890",
				title: "The Beginning",
				description: "Founded by the Nilsson family in Boxholm, Östergötland. Started with 5 cows and a dream to make the finest cheese in Sweden.",
				image: "/storage/images/about/history-1890.jpg",
			},
			{
				year: "1925",
				title: "Expansion",
				description: "Opened our first dedicated cheese production facility. Won our first national award for Gräddost.",
				image: "/storage/images/about/history-1925.jpg",
			},
			{
				year: "1960",
				title: "Modern Innovation",
				description: "Introduced modern equipment while maintaining traditional methods. Began exporting to neighboring countries.",
				image: "/storage/images/about/history-1960.jpg",
			},
			{
				year: "2024",
				title: "Today",
				description: "Fourth generation family-owned. Producing over 20 varieties of award-winning artisan cheese with sustainable practices.",
				image: "/storage/images/about/history-2024.jpg",
			},
		],
	},
	customers: {
		title: "Trusted by Sweden's Best",
		subtitle: "Leading restaurants and hotels choose Boxholm Cheese",
		customers: [
			{
				name: "Grand Hotel Stockholm",
				logo: "/storage/images/customers/grand-hotel.png",
				industry: "Hospitality",
			},
			{
				name: "Frantzen",
				logo: "/storage/images/customers/frantzen.png",
				industry: "Fine Dining",
			},
			{
				name: "ICA Supermarket",
				logo: "/storage/images/customers/ica.png",
				industry: "Retail",
			},
			{
				name: "NK Department Store",
				logo: "/storage/images/customers/nk.png",
				industry: "Retail",
			},
		],
	},
	video: {
		backgroundImage: "/storage/images/about/cows-field.jpg",
		titleHighlighted: "Work Every Day",
		titleNormal: "to Produce Delicious and Fresh Milk",
		videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
		buttonLabel: "video tour",
	},
	gallery: {
		// Background options - image takes priority, color is fallback
		backgroundImage: "",
		backgroundColor: "#f5f0e8",
		title: "Our farm is not just a production facility but also an open space for visitors. We invite everyone to see how our products are made",
		images: [
			{
				src: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=600&fit=crop",
				alt: "Fresh milk in glass bottle",
			},
			{
				src: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=500&fit=crop",
				alt: "Fresh cream pouring into jar",
			},
			{
				src: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400&h=600&fit=crop",
				alt: "Beautiful cow on the farm",
			},
			{
				src: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=500&fit=crop",
				alt: "Happy farmer with animals",
			},
			{
				src: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=600&fit=crop",
				alt: "Variety of artisan cheeses",
			},
			{
				src: "https://images.unsplash.com/photo-1559561853-08451507cbe7?w=400&h=500&fit=crop",
				alt: "Cheese making process",
			},
		],
	},
	team: {
		title: "Meet Our Team",
		subtitle: "The passionate people behind Boxholm Cheese",
		members: [
			{
				name: "Lars Nilsson",
				role: "Master Cheese Maker",
				bio: "Fourth generation cheese maker with over 30 years of experience. Lars learned the craft from his father and continues the family tradition.",
				image: "/storage/images/team/lars.jpg",
				email: "lars@boxholmcheese.se",
				linkedin: "",
			},
			{
				name: "Anna Bergström",
				role: "Production Manager",
				bio: "Ensures quality control and oversees our daily production. Anna has been with us for 15 years and knows every detail of the process.",
				image: "/storage/images/team/anna.jpg",
				email: "anna@boxholmcheese.se",
				linkedin: "",
			},
			{
				name: "Erik Johansson",
				role: "Head of Sales",
				bio: "Connects our cheese with customers across Sweden. Erik's passion for artisan products drives our growth.",
				image: "/storage/images/team/erik.jpg",
				email: "erik@boxholmcheese.se",
				linkedin: "",
			},
		],
	},
	contact: {
		title: "Visit Us",
		subtitle: "Come see where the magic happens",
		description: "We welcome visitors to our farm in Boxholm. Book a tour to experience the cheese-making process firsthand and taste our products.",
		showContactForm: true,
		showOffices: true,
		mapEmbedUrl: "",
	},
	seo: {
		title: "About Us - Boxholm Cheese | 130 Years of Tradition",
		description: "Learn about our history, meet our team, and discover the passion behind Boxholm Cheese. Four generations of artisan cheese making in Östergötland.",
		keywords: ["about boxholm cheese", "cheese history", "artisan cheese makers", "swedish cheese", "family dairy"],
	},
};

async function fixAboutPage() {
	try {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(MONGODB_URI);
		console.log("Connected to MongoDB\n");

		const AboutPage = mongoose.model(
			"AboutPage",
			new mongoose.Schema({}, { strict: false }),
			"about_page"
		);

		console.log("--- Fixing About Page Structure ---");

		// First, delete ALL existing documents
		const deleteResult = await AboutPage.deleteMany({});
		console.log(`Deleted ${deleteResult.deletedCount} existing document(s)`);

		// Insert fresh data
		const result = await AboutPage.create(correctAboutPageData);
		console.log("✓ About page created with correct structure!");
		console.log(`Document ID: ${result._id}`);

		// Verify the data
		const verification = await AboutPage.findOne({}) as Record<string, unknown> | null;
		console.log("\nVerifying inserted data:");
		console.log(`- Has history section: ${!!verification?.history}`);
		console.log(`- Has customers section: ${!!verification?.customers}`);
		console.log(`- Has video section: ${!!verification?.video}`);
		console.log(`- Has gallery section: ${!!verification?.gallery}`);
		console.log(`- Has team section: ${!!verification?.team}`);
		console.log(`- Has contact section: ${!!verification?.contact}`);
		console.log(`- Has OLD mission section: ${!!verification?.mission}`);
		console.log(`- Has OLD stats section: ${!!verification?.stats}`);

		console.log("\n========================================");
		console.log("ABOUT PAGE FIXED SUCCESSFULLY!");
		console.log("========================================\n");
	} catch (error) {
		console.error("Error fixing about page:", error);
		process.exit(1);
	} finally {
		await mongoose.disconnect();
		console.log("Disconnected from MongoDB");
	}
}

fixAboutPage();
