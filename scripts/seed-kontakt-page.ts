/**
 * Seed script for Kontakt Page data (Cheese Theme)
 * Run with: npx tsx scripts/seed-kontakt-page.ts
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

// Kontakt page data for Boxholm Cheese
const kontaktPageData = {
	sectionVisibility: {
		hero: true,
		contactCards: true,
		formSection: true,
		officeSection: true,
		faqSection: true,
		richContent: false,
	},

	// Hero Section
	hero: {
		badge: "Vi finns här för dig",
		title: "Kontakta oss",
		subtitle:
			"Har du frågor om våra ostar, vill göra en beställning eller är intresserad av att bli återförsäljare? Vårt team finns här för att hjälpa dig.",
		responseTime: "Svar inom 24 timmar",
		officeLocationsText: "Mejeri i Boxholm, Sverige",
	},

	// Contact Cards
	phoneCard: {
		icon: "Phone",
		title: "Telefon",
		subtitle: "Mån-Fre 08:00-17:00",
	},
	emailCard: {
		icon: "Mail",
		title: "E-post",
		subtitle: "Svar inom 24 timmar",
	},
	socialCard: {
		icon: "MessageCircle",
		title: "Sociala Medier",
		subtitle: "Följ oss för uppdateringar",
	},

	// Form Section
	formSection: {
		badge: "Skicka meddelande",
		title: "Hör av dig till oss",
		subtitle:
			"Fyll i formuläret så återkommer vi till dig så snart som möjligt.",
	},

	// Office Section
	officeSection: {
		badge: "Besök oss",
		title: "Vårt mejeri",
		subtitle:
			"Besök vårt mejeri i Boxholm och upplev hur vi tillverkar ost med traditionella metoder. Vi välkomnar besökare!",
		openingHours: "Mån-Fre 08:00-17:00, Lör 10:00-14:00",
		closedText: "Söndagar stängt",
	},

	// FAQ Section
	faqSection: {
		badge: "FAQ",
		title: "Har du frågor?",
		subtitle:
			"Här hittar du svar på de vanligaste frågorna. Hittar du inte svaret? Kontakta oss gärna!",
		faqs: [
			{
				question: "Hur snabbt får jag svar?",
				answer:
					"Vi strävar efter att svara på alla förfrågningar inom 24 timmar på vardagar.",
			},
			{
				question: "Kan jag beställa ost direkt från mejeriet?",
				answer:
					"Ja, du kan beställa direkt från oss! Kontakta oss för att diskutera dina behov och vi ordnar leverans.",
			},
			{
				question: "Erbjuder ni guidade turer på mejeriet?",
				answer:
					"Ja, vi erbjuder guidade turer där du får se osttillverkningen och provsmaka våra produkter. Boka i förväg!",
			},
			{
				question: "Hur blir jag återförsäljare?",
				answer:
					"Vi samarbetar gärna med butiker och restauranger. Kontakta oss för att diskutera partnerskap och villkor.",
			},
		],
	},

	// Rich Content (from WordPress text editor in screenshot)
	richContent: "",

	// SEO
	seo: {
		title: "Kontakta Boxholms Ost - Ditt lokala mejeri",
		description:
			"Kontakta oss på Boxholms Ost för frågor om våra hantverksgjorda ostar, beställningar eller för att bli återförsäljare. Telefon: +46 142-510 50.",
		ogImage: "/storage/images/og-kontakt.jpg",
	},
};

async function seedKontaktPage() {
	try {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(MONGODB_URI!);
		console.log("Connected to MongoDB");

		const db = mongoose.connection.db;
		if (!db) {
			throw new Error("Database connection not established");
		}

		const collection = db.collection("kontakt_page");

		// Check if document exists
		const existingDoc = await collection.findOne({});

		if (existingDoc) {
			console.log("Kontakt page document already exists. Updating...");
			await collection.updateOne(
				{},
				{ $set: { ...kontaktPageData, updatedAt: new Date() } }
			);
			console.log("Kontakt page document updated successfully!");
		} else {
			console.log("Creating new kontakt page document...");
			await collection.insertOne({
				...kontaktPageData,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			console.log("Kontakt page document created successfully!");
		}

		console.log("\n========================================");
		console.log("KONTAKT PAGE DATA SEEDED SUCCESSFULLY!");
		console.log("========================================\n");
	} catch (error) {
		console.error("Error seeding kontakt page:", error);
	} finally {
		await mongoose.disconnect();
		console.log("Disconnected from MongoDB");
	}
}

seedKontaktPage();
