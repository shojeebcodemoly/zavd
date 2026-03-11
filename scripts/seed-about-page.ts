/**
 * Seed Script — ZAVD About Page
 * Seeds about page content for ZAVD NGO
 *
 * Usage: npx tsx scripts/seed-about-page.ts
 */

import mongoose from "mongoose";
import * as fs from "fs";
import * as path from "path";

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

// ── ZAVD About Page Data ───────────────────────────────────────────────────

const aboutPageData = {
	sectionVisibility: {
		hero: true,
		mission: true,
		stats: true,
		imageGallery: true,
		faq: true,
		testimonials: false,
		partners: false,
		cta: true,
	},

	hero: {
		badge: "Über ZAVD",
		title: "Über uns",
		subtitle:
			"ZAVD — Zentrum für Asyl-, Verfahrens- und Migrationsberatung e.V. Wir setzen uns seit Jahren für die Rechte und Interessen von Geflüchteten und Migranten ein.",
	},

	mission: {
		badge: "Unsere Mission",
		title: "Für Integration und Selbstbestimmung",
		description:
			"ZAVD wurde gegründet, um Geflüchteten und Migranten in Deutschland eine verlässliche Anlaufstelle zu bieten. Wir begleiten Menschen auf dem Weg zu einem selbstbestimmten Leben — durch qualifizierte Beratung, praktische Unterstützung und gemeinschaftliche Projekte.",
		image: "",
		features: [
			{
				icon: "Target",
				title: "Qualifizierte Beratung",
				description:
					"Fachkundige Unterstützung bei Asylverfahren, Aufenthaltsrecht und Namensänderungen",
				image: "",
				buttonText: "Beratungsangebote →",
				buttonLink: "/angebote-beratung",
			},
			{
				icon: "Users",
				title: "Gemeinschaft & Begegnung",
				description:
					"Wir fördern den Austausch zwischen Geflüchteten und der aufnehmenden Gesellschaft",
				image: "",
				buttonText: "Projekte entdecken →",
				buttonLink: "/projekte",
			},
			{
				icon: "Award",
				title: "Erfahrung & Kompetenz",
				description:
					"Unser Team verfügt über langjährige Erfahrung in der Migrationsberatung",
				image: "",
				buttonText: "Team kennenlernen →",
				buttonLink: "/uber-zavd",
			},
			{
				icon: "Sparkles",
				title: "Ehrenamtliches Engagement",
				description:
					"Viele unserer Mitarbeiterinnen und Mitarbeiter sind ehrenamtlich tätig",
				image: "",
				buttonText: "Mitmachen →",
				buttonLink: "/kontakt",
			},
		],
	},

	stats: [
		{ value: "1000", suffix: "+", label: "Beratungen pro Jahr" },
		{ value: "20", suffix: "+", label: "Ehrenamtliche" },
		{ value: "5", suffix: "+", label: "Aktive Projekte" },
		{ value: "10", suffix: "+", label: "Jahre Erfahrung" },
	],

	imageGallery: {
		badge: "Einblicke",
		title: "Unser Team & unsere Arbeit",
		subtitle: "Bilder aus unserem Alltag und unseren Projekten",
		images: [],
		ctaTitle: "Werden Sie Teil von ZAVD",
		ctaSubtitle: "Ehrenamtlich helfen oder eine Beratung anfragen",
		ctaButtonText: "Kontakt aufnehmen",
	},

	faq: {
		title: "Häufig gestellte Fragen",
		subtitle: "Antworten auf die häufigsten Fragen über ZAVD",
		items: [
			{
				question: "Was ist ZAVD?",
				answer:
					"ZAVD steht für Zentrum für Asyl-, Verfahrens- und Migrationsberatung e.V. Wir sind ein gemeinnütziger Verein mit Sitz in Gütersloh, der Geflüchtete und Migranten bei allen Fragen rund um Aufenthalt, Asyl und Integration unterstützt.",
			},
			{
				question: "Wer kann unsere Beratung in Anspruch nehmen?",
				answer:
					"Unsere Beratungsangebote stehen allen Geflüchteten, Asylsuchenden und Migranten offen — unabhängig von Herkunft, Religion oder Aufenthaltsstatus.",
			},
			{
				question: "Ist die Beratung kostenlos?",
				answer:
					"Ja, unsere Beratung ist für alle Ratsuchenden kostenlos. Wir finanzieren uns durch Spenden, Mitgliedsbeiträge und öffentliche Förderung.",
			},
			{
				question: "Wie kann ich ZAVD unterstützen?",
				answer:
					"Sie können ZAVD durch eine Spende, eine Mitgliedschaft oder ehrenamtliches Engagement unterstützen. Sprechen Sie uns einfach an oder schreiben Sie uns eine E-Mail.",
			},
		],
	},

	cta: {
		title: "Kontaktieren Sie uns",
		subtitle: "Wir sind Mo. – Do. 08:00 – 15:00 Uhr für Sie erreichbar",
		ctaText: "Jetzt Kontakt aufnehmen",
		ctaHref: "/kontakt",
	},
};

// ── MongoDB Connection & Seed ──────────────────────────────────────────────

async function seedAboutPage() {
	console.log("Connecting to MongoDB...");
	await mongoose.connect(MONGODB_URI as string);
	console.log("Connected.");

	const db = mongoose.connection.db;
	if (!db) throw new Error("Database connection failed");

	const collection = db.collection("about_page");

	const result = await collection.findOneAndReplace(
		{},
		{ ...aboutPageData, updatedAt: new Date(), createdAt: new Date() },
		{ upsert: true, returnDocument: "after" }
	);

	if (result) {
		console.log("✅ About page updated.");
	} else {
		console.log("✅ About page created.");
	}

	await mongoose.disconnect();
	console.log("Done.");
}

seedAboutPage().catch((err) => {
	console.error("Seed failed:", err);
	process.exit(1);
});
