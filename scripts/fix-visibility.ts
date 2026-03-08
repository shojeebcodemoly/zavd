import * as fs from "fs";
import * as path from "path";
import { connectMongoose } from "../lib/db/db-connect";
import { getAboutPageModelSync } from "../models/about-page.model";

// Load .env file manually
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
				const [key, ...valueParts] = trimmed.split("=");
				if (key && valueParts.length > 0) {
					let value = valueParts.join("=");
					if (
						(value.startsWith('"') && value.endsWith('"')) ||
						(value.startsWith("'") && value.endsWith("'"))
					) {
						value = value.slice(1, -1);
					}
					process.env[key] = value;
				}
			}
			return true;
		}
	}
	return false;
}

async function fixVisibility() {
	loadEnvFile();
	console.log("Connecting to database...");
	await connectMongoose();

	const AboutPage = getAboutPageModelSync();

	console.log("Updating sectionVisibility...");

	const result = await AboutPage.findOneAndUpdate(
		{},
		{
			$set: {
				"sectionVisibility.stats": true,
				"sectionVisibility.imageDescription": true,
			},
		},
		{ new: true }
	);

	console.log("Updated sectionVisibility:", result?.sectionVisibility);
	process.exit(0);
}

fixVisibility().catch((error) => {
	console.error("Error:", error);
	process.exit(1);
});
