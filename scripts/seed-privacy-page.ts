/**
 * Seed script for Privacy Policy Page (Integritetspolicy) data
 * Run with: npx tsx scripts/seed-privacy-page.ts
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

// Privacy page data for Glada Bonden Mejeri AB (Cheese company)
const privacyPageData = {
	sectionVisibility: {
		hero: true,
		introduction: true,
		dataCollection: true,
		purposeOfProcessing: true,
		legalBasis: true,
		dataRetention: true,
		dataSharing: true,
		yourRights: true,
		security: true,
		cookies: true,
		contact: true,
		policyChanges: true,
		cta: true,
	},

	// Hero Section
	hero: {
		title: "Integritetspolicy",
		subtitle:
			"Glada Bonden Mejeri AB värnar om din integritet. Här beskriver vi hur vi samlar in och behandlar dina personuppgifter.",
		lastUpdated: "2025-01-15",
	},

	// Introduction
	introduction: {
		sectionNumber: "1",
		title: "Inledning",
		intro:
			"Glada Bonden Mejeri AB är personuppgiftsansvarig för behandlingen av dina personuppgifter. Vi värnar om din personliga integritet och strävar efter att alltid skydda dina personuppgifter på bästa sätt.",
		items: [
			{
				title: "Vårt åtagande",
				description:
					"Vi följer dataskyddsförordningen (GDPR) och svensk lagstiftning för att säkerställa att dina personuppgifter behandlas på ett lagligt, korrekt och öppet sätt.",
			},
		],
		highlighted: false,
	},

	// Data Collection
	dataCollection: {
		sectionNumber: "2",
		title: "Vilka uppgifter samlar vi in?",
		intro: "Vi samlar in följande typer av personuppgifter:",
		items: [
			{
				title: "Kontaktuppgifter",
				description:
					"Namn, e-postadress, telefonnummer och adress som du lämnar när du kontaktar oss eller fyller i formulär på vår webbplats.",
			},
			{
				title: "Företagsuppgifter",
				description:
					"Företagsnamn, organisationsnummer och faktureringsuppgifter vid köp eller affärsrelationer.",
			},
			{
				title: "Teknisk information",
				description:
					"IP-adress, webbläsartyp, enhetstyp och hur du använder vår webbplats genom cookies och liknande tekniker.",
			},
			{
				title: "Kommunikation",
				description:
					"Innehåll i meddelanden du skickar till oss via e-post, kontaktformulär eller telefon.",
			},
		],
		highlighted: true,
	},

	// Purpose of Processing
	purposeOfProcessing: {
		sectionNumber: "3",
		title: "Varför behandlar vi dina uppgifter?",
		intro: "Vi behandlar dina personuppgifter för följande ändamål:",
		items: [
			{
				title: "Hantera förfrågningar",
				description:
					"För att kunna besvara dina frågor och hantera dina förfrågningar om våra ostprodukter och tjänster.",
			},
			{
				title: "Fullgöra avtal",
				description:
					"För att kunna leverera beställda produkter och tjänster samt hantera betalningar och fakturering.",
			},
			{
				title: "Marknadsföring",
				description:
					"För att skicka nyhetsbrev och information om våra ostprodukter och nyheter (endast om du har samtyckt).",
			},
			{
				title: "Förbättra vår service",
				description:
					"För att analysera hur vår webbplats används och förbättra användarupplevelsen.",
			},
			{
				title: "Lagkrav",
				description:
					"För att uppfylla rättsliga förpliktelser, som bokföringskrav.",
			},
		],
		highlighted: false,
	},

	// Legal Basis
	legalBasis: {
		sectionNumber: "4",
		title: "Rättslig grund för behandlingen",
		intro:
			"Vi behandlar dina personuppgifter baserat på följande rättsliga grunder:",
		items: [
			{
				title: "Samtycke",
				description:
					"När du har gett ditt samtycke, till exempel för att ta emot nyhetsbrev.",
			},
			{
				title: "Avtal",
				description:
					"När behandlingen är nödvändig för att fullgöra ett avtal med dig.",
			},
			{
				title: "Rättslig förpliktelse",
				description:
					"När vi behöver behandla uppgifter för att uppfylla lagkrav.",
			},
			{
				title: "Berättigat intresse",
				description:
					"När vi har ett berättigat intresse som väger tyngre än ditt intresse av att uppgifterna inte behandlas.",
			},
		],
		highlighted: false,
	},

	// Data Retention
	dataRetention: {
		sectionNumber: "5",
		title: "Hur länge sparar vi dina uppgifter?",
		intro:
			"Vi sparar dina personuppgifter endast så länge som det är nödvändigt för de ändamål de samlades in för:",
		items: [
			{
				title: "Kunduppgifter",
				description:
					"Sparas under hela kundrelationen och därefter i enlighet med bokföringslagen (7 år).",
			},
			{
				title: "Marknadsföringsuppgifter",
				description:
					"Sparas tills du återkallar ditt samtycke eller avanmäler dig.",
			},
			{
				title: "Förfrågningar",
				description:
					"Sparas så länge det är nödvändigt för att hantera din förfrågan, normalt upp till 12 månader.",
			},
		],
		highlighted: false,
	},

	// Data Sharing
	dataSharing: {
		sectionNumber: "6",
		title: "Delning av personuppgifter",
		intro:
			"Vi delar dina personuppgifter endast när det är nödvändigt och med följande mottagare:",
		items: [
			{
				title: "Tjänsteleverantörer",
				description:
					"IT-leverantörer, betalningsleverantörer och andra som hjälper oss leverera våra tjänster.",
			},
			{
				title: "Myndigheter",
				description:
					"När vi är skyldiga enligt lag att lämna ut uppgifter.",
			},
		],
		outro: "Vi säljer aldrig dina personuppgifter till tredje part. Alla våra underleverantörer är bundna av personuppgiftsbiträdesavtal.",
		highlighted: false,
	},

	// Your Rights
	yourRights: {
		sectionNumber: "7",
		title: "Dina rättigheter",
		intro: "Enligt GDPR har du följande rättigheter:",
		items: [
			{
				title: "Rätt till tillgång",
				description:
					"Du har rätt att få veta vilka personuppgifter vi behandlar om dig.",
			},
			{
				title: "Rätt till rättelse",
				description:
					"Du har rätt att få felaktiga uppgifter rättade.",
			},
			{
				title: "Rätt till radering",
				description:
					"Du har rätt att få dina uppgifter raderade under vissa omständigheter.",
			},
			{
				title: "Rätt till begränsning",
				description:
					"Du har rätt att begära att behandlingen av dina uppgifter begränsas.",
			},
			{
				title: "Rätt till dataportabilitet",
				description:
					"Du har rätt att få ut dina uppgifter i ett maskinläsbart format.",
			},
			{
				title: "Rätt att invända",
				description:
					"Du har rätt att invända mot behandling som grundar sig på berättigat intresse.",
			},
		],
		outro: "För att utöva dina rättigheter, kontakta oss på info@gladabonden.se.",
		highlighted: true,
	},

	// Security
	security: {
		sectionNumber: "8",
		title: "Säkerhet",
		intro:
			"Vi vidtar lämpliga tekniska och organisatoriska säkerhetsåtgärder för att skydda dina personuppgifter mot obehörig åtkomst, förlust eller förstörelse.",
		items: [
			{
				title: "Tekniska åtgärder",
				description:
					"Kryptering, brandväggar och säker datalagring.",
			},
			{
				title: "Organisatoriska åtgärder",
				description:
					"Begränsad åtkomst, utbildning av personal och säkerhetsrutiner.",
			},
		],
		highlighted: false,
	},

	// Cookies
	cookies: {
		sectionNumber: "9",
		title: "Cookies",
		intro:
			"Vår webbplats använder cookies för att förbättra din upplevelse och analysera hur webbplatsen används.",
		items: [
			{
				title: "Nödvändiga cookies",
				description:
					"Krävs för att webbplatsen ska fungera korrekt.",
			},
			{
				title: "Analyscookies",
				description:
					"Hjälper oss förstå hur besökare använder webbplatsen.",
			},
			{
				title: "Marknadsföringscookies",
				description:
					"Används för att visa relevanta annonser (endast med ditt samtycke).",
			},
		],
		outro: "Du kan hantera dina cookie-inställningar via cookie-bannern på vår webbplats eller i din webbläsare.",
		highlighted: false,
	},

	// Contact Section
	contact: {
		sectionNumber: "10",
		title: "Kontakta oss",
		intro:
			"Om du har frågor om vår integritetspolicy eller vill utöva dina rättigheter, vänligen kontakta oss:",
		companyName: "Glada Bonden Mejeri AB",
		organizationNumber: "",
		email: "info@gladabonden.se",
		phone: "",
		addresses: [
			"Boxholm, Sverige",
		],
		highlighted: false,
	},

	// Policy Changes
	policyChanges: {
		sectionNumber: "11",
		title: "Ändringar i policyn",
		intro:
			"Vi kan komma att uppdatera denna integritetspolicy. Vid väsentliga ändringar kommer vi att informera dig via e-post eller på vår webbplats. Den senaste versionen finns alltid tillgänglig på denna sida.",
		items: [],
		highlighted: false,
	},

	// CTA Section
	ctaSection: {
		text: "Har du frågor om hur vi hanterar dina personuppgifter? Tveka inte att kontakta oss.",
		primaryCta: {
			text: "Kontakta oss",
			href: "/contact-us",
		},
		secondaryCta: {
			text: "Tillbaka till startsidan",
			href: "/",
		},
	},

	// SEO
	seo: {
		title: "Integritetspolicy | Glada Bonden Mejeri AB",
		description:
			"Läs om hur Glada Bonden Mejeri AB behandlar dina personuppgifter enligt GDPR. Information om datainsamling, cookies och dina rättigheter.",
		ogImage: "",
	},
};

async function seedPrivacyPage() {
	try {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(MONGODB_URI!);
		console.log("Connected to MongoDB");

		const db = mongoose.connection.db;
		if (!db) {
			throw new Error("Database connection not established");
		}

		const collection = db.collection("privacy_page");

		// Check if document exists
		const existingDoc = await collection.findOne({});

		if (existingDoc) {
			console.log("Privacy page document already exists. Updating...");
			await collection.updateOne(
				{},
				{ $set: { ...privacyPageData, updatedAt: new Date() } }
			);
			console.log("Privacy page document updated successfully!");
		} else {
			console.log("Creating new privacy page document...");
			await collection.insertOne({
				...privacyPageData,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			console.log("Privacy page document created successfully!");
		}

		console.log("\n========================================");
		console.log("PRIVACY PAGE DATA SEEDED SUCCESSFULLY!");
		console.log("========================================\n");
		console.log("Preview at: /integritetspolicy");
	} catch (error) {
		console.error("Error seeding privacy page:", error);
	} finally {
		await mongoose.disconnect();
		console.log("Disconnected from MongoDB");
	}
}

seedPrivacyPage();
