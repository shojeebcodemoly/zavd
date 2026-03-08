/**
 * Seed script for Legal Page (Juridisk Information) data
 * Run with: npx tsx scripts/seed-legal-page.ts
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

// Legal page data based on Synos Medical
const legalPageData = {
	sectionVisibility: {
		hero: true,
		legalCards: true,
		companyInfo: true,
		terms: true,
		gdprRights: true,
		cta: true,
	},

	// Hero Section
	hero: {
		badge: "Juridisk Information",
		title: "Villkor & Policyer",
		subtitle:
			"Här hittar du all juridisk information om Synos Medical AB, inklusive integritetspolicy, villkor och GDPR-information.",
	},

	// Legal Cards (Quick links to different policies)
	legalCards: [
		{
			icon: "Shield",
			title: "Integritetspolicy",
			description:
				"Läs om hur vi samlar in, använder och skyddar dina personuppgifter enligt GDPR.",
			href: "/integritetspolicy",
			highlights: [
				"GDPR-kompatibel",
				"Cookies",
				"Dataskydd",
			],
		},
		{
			icon: "FileText",
			title: "Köpvillkor",
			description:
				"Våra allmänna villkor för köp av produkter och tjänster från Synos Medical.",
			href: "#terms",
			highlights: [
				"Betalning",
				"Leverans",
				"Garanti",
			],
		},
		{
			icon: "Cookie",
			title: "Cookiepolicy",
			description:
				"Information om hur vi använder cookies på vår webbplats.",
			href: "/integritetspolicy#cookies",
			highlights: [
				"Nödvändiga",
				"Analys",
				"Marknadsföring",
			],
		},
	],

	// Company Info
	companyInfo: {
		companyName: "Synos Medical AB",
		organizationNumber: "556871-8075",
		vatNumber: "SE556871807501",
		registeredSeat: "Stockholm",
		offices: [
			{
				name: "Huvudkontor Stockholm",
				address: "Gävlegatan 12A, 113 30 Stockholm",
			},
			{
				name: "Kontor Linköping",
				address: "Brigadgatan 16, 587 58 Linköping",
			},
		],
		email: "info@synosmedical.se",
		phone: "010-205 15 01",
	},

	// Terms Section
	termsSection: {
		title: "Allmänna Villkor",
		terms: [
			{
				title: "1. Priser och betalning",
				content:
					"Alla priser anges exklusive moms om inte annat anges. Betalning sker enligt avtalade villkor, normalt 30 dagar netto. Vid försenad betalning tillkommer dröjsmålsränta enligt räntelagen.",
			},
			{
				title: "2. Leverans",
				content:
					"Leverans sker fritt vårt lager om inte annat avtalats. Vi strävar efter att leverera inom angiven tid, men kan inte garantera leveranstider vid force majeure eller andra omständigheter utanför vår kontroll.",
			},
			{
				title: "3. Garanti",
				content:
					"Våra produkter levereras med 2 års garanti som täcker fabrikationsfel. Garantin omfattar inte skador orsakade av felaktig användning, yttre påverkan eller bristande underhåll.",
			},
			{
				title: "4. Service och support",
				content:
					"Vid köp ingår 2 års fullservice på plats hos er. Vi garanterar reparation inom 48 arbetstimmar. Livstidssupport ingår för alla kunder.",
			},
			{
				title: "5. Reklamation",
				content:
					"Reklamation ska ske skriftligen inom skälig tid efter att fel upptäckts. Vi åtgärdar fel enligt konsumentköplagen och produktansvarslagen.",
			},
			{
				title: "6. Ansvarsbegränsning",
				content:
					"Synos Medical ansvarar inte för indirekta skador, produktionsbortfall eller utebliven vinst. Vårt totala ansvar är begränsat till produktens inköpspris.",
			},
			{
				title: "7. Immateriella rättigheter",
				content:
					"Allt material på vår webbplats, inklusive text, bilder och logotyper, är skyddat av upphovsrätt och tillhör Synos Medical AB.",
			},
			{
				title: "8. Tvister",
				content:
					"Eventuella tvister ska i första hand lösas genom förhandling. Om parterna inte kan enas, ska tvisten avgöras av svensk domstol med tillämpning av svensk rätt.",
			},
		],
	},

	// GDPR Rights Section
	gdprSection: {
		title: "Dina GDPR-rättigheter",
		rights: [
			{
				title: "Rätt till information",
				description:
					"Du har rätt att få tydlig information om hur vi behandlar dina personuppgifter.",
			},
			{
				title: "Rätt till tillgång",
				description:
					"Du kan begära att få veta vilka uppgifter vi har om dig genom ett registerutdrag.",
			},
			{
				title: "Rätt till rättelse",
				description:
					"Om dina uppgifter är felaktiga har du rätt att få dem korrigerade.",
			},
			{
				title: "Rätt till radering",
				description:
					"Under vissa omständigheter kan du begära att vi raderar dina uppgifter.",
			},
			{
				title: "Rätt att invända",
				description:
					"Du kan invända mot viss behandling, till exempel direktmarknadsföring.",
			},
			{
				title: "Rätt till dataportabilitet",
				description:
					"Du kan begära att få ut dina uppgifter i ett maskinläsbart format.",
			},
		],
		primaryCta: {
			text: "Läs hela integritetspolicyn",
			href: "/integritetspolicy",
		},
		secondaryCta: {
			text: "Kontakta oss",
			href: "/kontakt",
		},
	},

	// CTA Section
	ctaSection: {
		text: "Har du frågor om våra villkor eller policyer? Vi hjälper dig gärna.",
		primaryCta: {
			text: "Kontakta oss",
			href: "/kontakt",
		},
		secondaryCta: {
			text: "Ring oss: 010-205 15 01",
			href: "tel:+46102051501",
		},
	},

	// SEO
	seo: {
		title: "Juridisk Information | Synos Medical",
		description:
			"Juridisk information om Synos Medical AB - integritetspolicy, villkor, GDPR och cookies. All information du behöver på ett ställe.",
		ogImage: "/storage/images/og-legal.jpg",
	},
};

async function seedLegalPage() {
	try {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(MONGODB_URI!);
		console.log("Connected to MongoDB");

		const db = mongoose.connection.db;
		if (!db) {
			throw new Error("Database connection not established");
		}

		const collection = db.collection("legal_page");

		// Check if document exists
		const existingDoc = await collection.findOne({});

		if (existingDoc) {
			console.log("Legal page document already exists. Updating...");
			await collection.updateOne(
				{},
				{ $set: { ...legalPageData, updatedAt: new Date() } }
			);
			console.log("Legal page document updated successfully!");
		} else {
			console.log("Creating new legal page document...");
			await collection.insertOne({
				...legalPageData,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			console.log("Legal page document created successfully!");
		}

		console.log("\n========================================");
		console.log("LEGAL PAGE DATA SEEDED SUCCESSFULLY!");
		console.log("========================================\n");
		console.log("Preview at: /om-oss/juridisk-information");
	} catch (error) {
		console.error("Error seeding legal page:", error);
	} finally {
		await mongoose.disconnect();
		console.log("Disconnected from MongoDB");
	}
}

seedLegalPage();
