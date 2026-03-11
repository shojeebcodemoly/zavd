/**
 * Seed Script — ZAVD Home Page
 * Seeds home page content for ZAVD NGO (refugee support organization)
 *
 * Usage: npx tsx scripts/seed-zavd-home.ts
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

// ── ZAVD NGO Home Page Data ────────────────────────────────────────────────

const homePageData = {
	sectionVisibility: {
		hero: true,
		introSection: true,
		promoBanner: false,
		featureBanner: false,
		features: false,
		productShowcase: false,
		imageGallery: true,
		about: true,
		testimonials: false,
		cta: true,
		richContent: false,
	},

	// ── Hero Section (Slider) ──────────────────────────────────
	hero: {
		isSlider: true,
		autoPlayInterval: 6000,
		showArrows: true,
		slides: [
			{
				badge: "ZAVD — Für eine gemeinsame Zukunft",
				title: "Unterstützung für Geflüchtete und Migranten",
				subtitle:
					"Wir begleiten Menschen auf ihrem Weg der Integration — mit Beratung, Projekten und Gemeinschaft.",
				backgroundImage: "",
				ctaText: "Unsere Angebote",
				ctaHref: "/angebote-beratung",
				ctaText2: "Jetzt spenden",
				ctaHref2: "/spenden",
				isActive: true,
			},
			{
				badge: "Beratung & Begleitung",
				title: "Wir sind für Sie da",
				subtitle:
					"Von Asylverfahren bis zur Namensänderung — unser erfahrenes Team unterstützt Sie in allen Lebenslagen.",
				backgroundImage: "",
				ctaText: "Beratung anfragen",
				ctaHref: "/kontakt",
				ctaText2: "Mehr erfahren",
				ctaHref2: "/uber-zavd",
				isActive: true,
			},
			{
				badge: "Projekte & Engagement",
				title: "Gemeinsam aktiv für Integration",
				subtitle:
					"Mentoring, Sport, Sprachförderung und mehr — entdecken Sie unsere Projekte und werden Sie Teil der Gemeinschaft.",
				backgroundImage: "",
				ctaText: "Projekte entdecken",
				ctaHref: "/projekte",
				ctaText2: "Ehrenamtlich helfen",
				ctaHref2: "/kontakt",
				isActive: true,
			},
		],
	},

	// ── Intro Section ─────────────────────────────────────────
	introSection: {
		badge: "Über ZAVD",
		title: "Zentrum für Asyl-, Verfahrens- und Migrationsberatung",
		subtitle: "Seit Jahren ein verlässlicher Partner für Geflüchtete in Deutschland",
		description:
			"ZAVD ist eine gemeinnützige Organisation mit Sitz in Gütersloh. Wir bieten qualifizierte Beratung und praktische Unterstützung für Geflüchtete, Asylsuchende und Migranten. Unser Ziel ist eine erfolgreiche Integration und ein selbstbestimmtes Leben in Deutschland.",
		ctaText: "Mehr über uns",
		ctaHref: "/uber-zavd",
		image: "",
		partnerLogos: [],
	},

	// ── About Section ─────────────────────────────────────────
	aboutSection: {
		badge: "Über ZAVD",
		title: "Eine Organisation für",
		titleHighlight: "Menschen & Integration",
		content:
			"ZAVD — Zentrum für Asyl-, Verfahrens- und Migrationsberatung e.V. — wurde gegründet, um Geflüchteten und Migranten in Deutschland eine verlässliche Anlaufstelle zu bieten. Wir beraten zu Asylverfahren, Aufenthaltsrecht, Namensänderungen und vielen weiteren Themen. Unser engagiertes Team aus Fachberatern und Ehrenamtlichen setzt sich täglich für die Menschen ein, die unsere Unterstützung benötigen.",
		image: "",
		benefits: [
			"Qualifizierte Rechts- und Asylberatung",
			"Mehrsprachiges Beratungsangebot",
			"Mentoring- und Integrationsprojekte",
			"Ehrenamtliches Engagement und Gemeinschaft",
		],
		primaryCta: {
			text: "Unsere Geschichte",
			href: "/uber-zavd",
			variant: "primary",
		},
		secondaryCta: {
			text: "Kontakt aufnehmen",
			href: "/kontakt",
			variant: "outline",
		},
		certificationBadge: {
			title: "Gemeinnützig e.V.",
			description: "Eingetragener gemeinnütziger Verein",
		},
	},

	// ── Image Gallery (Team / Activities) ────────────────────
	imageGallery: {
		badge: "Einblicke",
		title: "Unser Team & unsere Projekte",
		subtitle: "Menschen, die sich täglich für Integration einsetzen",
		images: [],
		ctaTitle: "Werden Sie Teil unserer Gemeinschaft",
		ctaSubtitle: "Ehrenamtlich helfen oder eine Beratung anfragen",
		ctaButtonText: "Jetzt mitmachen",
	},

	// ── CTA Section ───────────────────────────────────────────
	ctaSection: {
		title: "Wie können wir Ihnen helfen?",
		subtitle: "Nehmen Sie Kontakt auf — wir sind für Sie da",
		phoneTitle: "Rufen Sie uns an",
		phoneSubtitle: "Mo. – Do. 08:00 – 15:00 Uhr",
		emailTitle: "Schreiben Sie uns",
		emailSubtitle: "Wir antworten innerhalb von 24 Stunden",
		formTitle: "Nachricht senden",
		formSubtitle: "Füllen Sie das Formular aus und wir melden uns bei Ihnen",
		formCtaText: "Nachricht senden",
		formCtaHref: "/kontakt",
	},

	// ── SEO ───────────────────────────────────────────────────
	seo: {
		title: "ZAVD — Zentrum für Asyl-, Verfahrens- und Migrationsberatung",
		description:
			"ZAVD bietet qualifizierte Beratung und Unterstützung für Geflüchtete, Asylsuchende und Migranten in Deutschland. Asylberatung, Integrationsförderung und mehr.",
		ogImage: "",
	},
};

// ── MongoDB Connection & Seed ──────────────────────────────────────────────

async function seedHomePage() {
	console.log("Connecting to MongoDB...");
	await mongoose.connect(MONGODB_URI as string);
	console.log("Connected.");

	const db = mongoose.connection.db;
	if (!db) throw new Error("Database connection failed");

	const collection = db.collection("home_page");

	// Upsert — replace existing or insert new
	const result = await collection.findOneAndReplace(
		{},
		{ ...homePageData, updatedAt: new Date(), createdAt: new Date() },
		{ upsert: true, returnDocument: "after" }
	);

	if (result) {
		console.log("✅ Home page updated (existing document replaced).");
	} else {
		console.log("✅ Home page created (new document inserted).");
	}

	await mongoose.disconnect();
	console.log("Done. Disconnected from MongoDB.");
}

seedHomePage().catch((err) => {
	console.error("Seed failed:", err);
	process.exit(1);
});
