/**
 * Seed script for Form Submissions
 * Creates demo contact inquiries and reseller applications
 * Run with: npx tsx scripts/seed-form-submissions.ts
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

// Demo contact inquiries
const contactInquiries = [
	{
		type: "contact",
		fullName: "Erik Johansson",
		email: "erik.johansson@example.se",
		phone: "701234567",
		countryCode: "+46",
		countryName: "Sweden",
		subject: "Fråga om leveranstider",
		message: "Hej! Jag undrar om era leveranstider för beställningar över 50 kg. Kan ni leverera till Malmö? Tack på förhand!",
		gdprConsent: true,
		gdprConsentTimestamp: new Date(),
		gdprConsentVersion: "1.0",
		marketingConsent: true,
		status: "new",
		metadata: {
			ipAddress: "192.168.1.100",
			userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0",
			pageUrl: "/kontakt",
			submittedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
		},
		createdAt: new Date(Date.now() - 1000 * 60 * 30),
	},
	{
		type: "contact",
		fullName: "Anna Lindström",
		email: "anna.lindstrom@restaurant.se",
		phone: "731234567",
		countryCode: "+46",
		countryName: "Sweden",
		subject: "Samarbete med restaurang",
		message: "Hej! Jag driver en restaurang i Stockholm och är intresserad av att köpa era ostar direkt. Kan vi diskutera ett samarbete?",
		gdprConsent: true,
		gdprConsentTimestamp: new Date(),
		gdprConsentVersion: "1.0",
		marketingConsent: false,
		status: "new",
		metadata: {
			ipAddress: "192.168.1.101",
			userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15",
			pageUrl: "/kontakt",
			submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
		},
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
	},
	{
		type: "contact",
		fullName: "Lars Bergström",
		email: "lars.bergstrom@gmail.com",
		phone: "761234567",
		countryCode: "+46",
		countryName: "Sweden",
		subject: "Besök till gården",
		message: "Hej! Min familj skulle vilja besöka er gård. Erbjuder ni guidade turer? Vi är 5 personer.",
		gdprConsent: true,
		gdprConsentTimestamp: new Date(),
		gdprConsentVersion: "1.0",
		marketingConsent: true,
		status: "read",
		readAt: new Date(Date.now() - 1000 * 60 * 60),
		metadata: {
			ipAddress: "192.168.1.102",
			userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
			pageUrl: "/kontakt",
			submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
		},
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
	},
	{
		type: "contact",
		fullName: "Maria Svensson",
		email: "maria@hotell-svensson.se",
		phone: "721234567",
		countryCode: "+46",
		countryName: "Sweden",
		corporationNumber: "556789-1234",
		subject: "Prislista för hotell",
		message: "Vi driver ett hotell med frukostservering och skulle vilja få en prislista för grossistinköp. Vänligen skicka information till oss.",
		gdprConsent: true,
		gdprConsentTimestamp: new Date(),
		gdprConsentVersion: "1.0",
		marketingConsent: true,
		status: "archived",
		readAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
		metadata: {
			ipAddress: "192.168.1.103",
			userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/121.0",
			pageUrl: "/kontakt",
			submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
		},
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
	},
];

// Demo reseller applications
const resellerApplications = [
	{
		type: "reseller_application",
		fullName: "Johan Andersson",
		email: "johan@ostbutiken-goteborg.se",
		phone: "701234568",
		countryCode: "+46",
		countryName: "Sweden",
		corporationNumber: "556123-4567",
		productName: "Ostbutiken Göteborg AB", // Company name stored here
		subject: "Vi driver en specialiserad ostbutik i centrala Göteborg sedan 2015. Vi har ett stort intresse av att erbjuda lokalt producerade kvalitetsostar till våra kunder. Vi har idag ca 500 kunder per vecka och söker nya leverantörer av hantverksost.", // Business description stored here
		message: "Vi skulle gärna vilja diskutera ett långsiktigt samarbete. Vår butik ligger på Avenyn och har utmärkt exponering.",
		gdprConsent: true,
		gdprConsentTimestamp: new Date(),
		gdprConsentVersion: "1.0",
		marketingConsent: true,
		status: "new",
		metadata: {
			ipAddress: "192.168.1.110",
			userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0",
			pageUrl: "/bli-aterforsaljare",
			submittedAt: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
		},
		createdAt: new Date(Date.now() - 1000 * 60 * 15),
	},
	{
		type: "reseller_application",
		fullName: "Karin Nilsson",
		email: "karin@delikatesshandel.se",
		phone: "731234568",
		countryCode: "+46",
		countryName: "Sweden",
		corporationNumber: "556234-5678",
		productName: "Nilssons Delikatesshandel",
		subject: "Familjeföretag med fokus på svenska delikatesser. Vi har butiker i Malmö och Lund, totalt 3 butiker. Vi söker premiumleverantörer av ost och mejeriprodukter för vårt sortiment.",
		message: "Vill gärna boka ett möte för att prova era produkter och diskutera samarbete.",
		gdprConsent: true,
		gdprConsentTimestamp: new Date(),
		gdprConsentVersion: "1.0",
		marketingConsent: false,
		status: "new",
		metadata: {
			ipAddress: "192.168.1.111",
			userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15",
			pageUrl: "/bli-aterforsaljare",
			submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
		},
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
	},
	{
		type: "reseller_application",
		fullName: "Per Eklund",
		email: "per@ekologiskmat.se",
		phone: "761234568",
		countryCode: "+46",
		countryName: "Sweden",
		corporationNumber: "556345-6789",
		productName: "Ekologisk Mat Sverige AB",
		subject: "Vi är en e-handelsplattform för ekologiska livsmedel med över 10,000 aktiva kunder. Vi söker svenska ostproducenter som kan leverera ekologiska och hantverksmässiga produkter.",
		message: "Vi har kapacitet för stora volymer och erbjuder bra exponering på vår plattform. Kan ni berätta mer om era produktionsvolymer?",
		gdprConsent: true,
		gdprConsentTimestamp: new Date(),
		gdprConsentVersion: "1.0",
		marketingConsent: true,
		status: "read",
		readAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
		metadata: {
			ipAddress: "192.168.1.112",
			userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0",
			pageUrl: "/bli-aterforsaljare",
			submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
		},
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
	},
	{
		type: "reseller_application",
		fullName: "Sofia Holmberg",
		email: "sofia@matmarknad-sthlm.se",
		phone: "721234568",
		countryCode: "+46",
		countryName: "Sweden",
		corporationNumber: "556456-7890",
		productName: "Stockholms Matmarknad",
		subject: "Driver en matmarknad i Södermalm med fokus på lokala producenter. Vi har varit verksamma i 8 år och har ett starkt varumärke bland matintresserade stockholmare.",
		message: "Skulle vilja bli återförsäljare och eventuellt anordna provningar med era produkter i butiken.",
		gdprConsent: true,
		gdprConsentTimestamp: new Date(),
		gdprConsentVersion: "1.0",
		marketingConsent: true,
		status: "new",
		metadata: {
			ipAddress: "192.168.1.113",
			userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
			pageUrl: "/bli-aterforsaljare",
			submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
		},
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
	},
	{
		type: "reseller_application",
		fullName: "Anders Berg",
		email: "anders@restauranggruppen.se",
		phone: "701234569",
		countryCode: "+46",
		countryName: "Sweden",
		corporationNumber: "556567-8901",
		productName: "Berg Restauranggruppen AB",
		subject: "Vi driver 5 restauranger i Västra Götaland med fokus på lokala råvaror. Vi söker direktleverantörer av ost för att ersätta grossistinköp.",
		message: "Vi har höga krav på kvalitet och spårbarhet. Erbjuder ni leverans till restaurang?",
		gdprConsent: true,
		gdprConsentTimestamp: new Date(),
		gdprConsentVersion: "1.0",
		marketingConsent: false,
		status: "archived",
		readAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
		metadata: {
			ipAddress: "192.168.1.114",
			userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0",
			pageUrl: "/bli-aterforsaljare",
			submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 120), // 5 days ago
		},
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120),
	},
];

// Demo product inquiries
const productInquiries = [
	{
		type: "product_inquiry",
		fullName: "Eva Karlsson",
		email: "eva.karlsson@gmail.com",
		phone: "731234569",
		countryCode: "+46",
		countryName: "Sweden",
		productName: "Lagrad Västerbottenost 24 månader",
		productSlug: "lagrad-vasterbottenost-24-manader",
		helpType: "just_interested",
		message: "Jag är nyfiken på er lagrade ost. Hur skiljer sig smaken från 12 månaders varianten?",
		gdprConsent: true,
		gdprConsentTimestamp: new Date(),
		gdprConsentVersion: "1.0",
		marketingConsent: true,
		status: "new",
		metadata: {
			ipAddress: "192.168.1.120",
			userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0",
			pageUrl: "/produkter/lagrad-vasterbottenost-24-manader",
			submittedAt: new Date(Date.now() - 1000 * 60 * 45), // 45 min ago
		},
		createdAt: new Date(Date.now() - 1000 * 60 * 45),
	},
	{
		type: "product_inquiry",
		fullName: "Mikael Öberg",
		email: "mikael.oberg@foretag.se",
		phone: "761234569",
		countryCode: "+46",
		countryName: "Sweden",
		corporationNumber: "556678-9012",
		productName: "Ekologisk Getost",
		productSlug: "ekologisk-getost",
		helpType: "buy_contact",
		message: "Vi vill köpa 20 kg getost till vårt företagsevent. Kan ni leverera inom 2 veckor?",
		gdprConsent: true,
		gdprConsentTimestamp: new Date(),
		gdprConsentVersion: "1.0",
		marketingConsent: false,
		status: "read",
		readAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
		metadata: {
			ipAddress: "192.168.1.121",
			userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
			pageUrl: "/produkter/ekologisk-getost",
			submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
		},
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
	},
];

async function seedFormSubmissions() {
	try {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(MONGODB_URI as string);
		console.log("Connected to MongoDB");

		const db = mongoose.connection.db;
		if (!db) {
			throw new Error("Database connection not established");
		}

		const collection = db.collection("form_submissions");

		// Check current count
		const currentCount = await collection.countDocuments();
		console.log(`Current form submissions: ${currentCount}`);

		// Insert contact inquiries
		console.log("\nInserting contact inquiries...");
		for (const inquiry of contactInquiries) {
			await collection.insertOne(inquiry);
			console.log(`  Added: ${inquiry.fullName} - ${inquiry.subject}`);
		}

		// Insert reseller applications
		console.log("\nInserting reseller applications...");
		for (const application of resellerApplications) {
			await collection.insertOne(application);
			console.log(`  Added: ${application.fullName} - ${application.productName}`);
		}

		// Insert product inquiries
		console.log("\nInserting product inquiries...");
		for (const inquiry of productInquiries) {
			await collection.insertOne(inquiry);
			console.log(`  Added: ${inquiry.fullName} - ${inquiry.productName}`);
		}

		// Summary
		const newCount = await collection.countDocuments();
		console.log(`\n✓ Total form submissions: ${newCount}`);

		// Count by type
		const byType = await collection.aggregate([
			{ $group: { _id: "$type", count: { $sum: 1 } } }
		]).toArray();
		console.log("\nBy type:");
		for (const item of byType) {
			console.log(`  ${item._id}: ${item.count}`);
		}

	} catch (error) {
		console.error("Error seeding form submissions:", error);
		process.exit(1);
	} finally {
		await mongoose.disconnect();
		console.log("\nDisconnected from MongoDB");
	}
}

seedFormSubmissions();
