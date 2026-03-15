/**
 * Seed Script — ZAVD Site Settings
 * Seeds contact info, social media, footer & branding for ZAVD NGO
 *
 * Usage: npx tsx scripts/seed-zavd-settings.ts
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

const zavdSettings = {
	// ── Company Info ──────────────────────────────────────────
	companyName: "Central Association of Assyrian Associations in Germany and European Sections eV",
	orgNumber: "VR 3456",
	vatNumber: "",

	// ── Contact ───────────────────────────────────────────────
	phone: "+49 5241 9988798",
	email: "info@zavd.de",
	noreplyEmail: "noreply@zavd.de",

	// ── Office ────────────────────────────────────────────────
	offices: [
		{
			name: "ZAVD Geschäftsstelle",
			street: "Berliner Straße 113",
			postalCode: "D-33330",
			city: "Gütersloh",
			country: "Deutschland",
			isHeadquarters: true,
			isVisible: true,
		},
	],

	// ── Social Media ──────────────────────────────────────────
	// Admin dashboard থেকে update করুন: /dashboard/settings
	socialMedia: {
		facebook: "https://www.facebook.com/zavd.de",
		youtube: "https://www.youtube.com/@zavd",
		instagram: "",
		linkedin: "",
		twitter: "",
	},

	// ── SEO ───────────────────────────────────────────────────
	seo: {
		siteName: "ZAVD",
		siteTagline: "Zentralverband der Assyrischen Vereinigungen in Deutschland",
		siteDescription:
			"Zentralverband der Assyrischen Vereinigungen in Deutschland und europäischen Sektionen e.V.",
		ogImage: "/storage/zavd-og.jpg",
		keywords: ["ZAVD", "Assyrer", "Deutschland", "Flüchtlinge", "NGO", "Gütersloh"],
	},

	// ── Branding ──────────────────────────────────────────────
	branding: {
		logoUrl: "/storage/zavd-logo-mobile-2000x485.png",
		faviconUrl: "/favicon.ico",
	},

	// ── Footer ────────────────────────────────────────────────
	// quickLinks & bottomLinks intentionally empty
	// — Footer component uses translation keys directly
	footer: {
		banner: { enabled: false },
		quickLinksTitle: "Schnelllinks",
		contactTitle: "Kontakt",
		newsletterTitle: "",
		quickLinks: [],
		bottomLinks: [],
		newsletterDescription: "",
		newsletterPlaceholder: "",
		newsletterButtonText: "",
	},
};

async function seedZavdSettings() {
	console.log("\n========================================");
	console.log("  ZAVD Site Settings Seed");
	console.log("========================================\n");

	await mongoose.connect(MONGODB_URI as string);
	console.log("Connected to MongoDB");

	const db = mongoose.connection.db!;
	const collection = db.collection("site_settings");

	const existing = await collection.findOne({});

	if (existing) {
		console.log("Existing settings found. Updating...");
		await collection.updateOne(
			{},
			{ $set: { ...zavdSettings, updatedAt: new Date() } }
		);
		console.log("Settings updated successfully!");
	} else {
		console.log("No settings found. Creating new document...");
		await collection.insertOne({
			...zavdSettings,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		console.log("Settings created successfully!");
	}

	console.log("\n✅ Done! ZAVD site settings seeded:");
	console.log("   Company  :", zavdSettings.companyName);
	console.log("   Email    :", zavdSettings.email);
	console.log("   Phone    :", zavdSettings.phone);
	console.log("   Address  :", zavdSettings.offices[0].street, zavdSettings.offices[0].city);
	console.log("   Facebook :", zavdSettings.socialMedia.facebook);
	console.log("   YouTube  :", zavdSettings.socialMedia.youtube);
	console.log("\n⚠️  Social media URLs are placeholders.");
	console.log("   Update them at: /dashboard/settings → Social Media\n");

	await mongoose.disconnect();
	console.log("Disconnected from MongoDB");
}

seedZavdSettings().catch((err) => {
	console.error("Seed failed:", err);
	process.exit(1);
});
