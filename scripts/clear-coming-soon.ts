/**
 * Clear comingSoon field from site_settings
 * Run with: npx tsx scripts/clear-coming-soon.ts
 */

import mongoose from "mongoose";
import * as fs from "fs";
import * as path from "path";

function loadEnvFile() {
	const envFiles = [".env.local", ".env"];
	for (const envFile of envFiles) {
		const envPath = path.resolve(process.cwd(), envFile);
		if (fs.existsSync(envPath)) {
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
				if (!process.env[key]) process.env[key] = value;
			}
			break;
		}
	}
}

loadEnvFile();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
	console.error("MONGODB_URI is not defined");
	process.exit(1);
}

async function main() {
	console.log("Connecting to MongoDB...");
	await mongoose.connect(MONGODB_URI!);
	console.log("Connected!\n");

	const db = mongoose.connection.db!;
	const result = await db
		.collection("site_settings")
		.updateMany({}, { $unset: { comingSoon: "" } });

	console.log(`✓ comingSoon field removed from ${result.modifiedCount} document(s)`);
	console.log("Fallback defaults will now be used until new data is saved via CMS.");

	await mongoose.disconnect();
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
