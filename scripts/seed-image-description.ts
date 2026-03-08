import * as fs from "fs";
import * as path from "path";
import { connectMongoose } from "../lib/db/db-connect";
import { getAboutPageModelSync } from "../models/about-page.model";

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
				const [key, ...valueParts] = trimmed.split("=");
				if (key && valueParts.length > 0) {
					let value = valueParts.join("=");
					// Remove surrounding quotes if present
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

async function seedImageDescription() {
	loadEnvFile();
	console.log("Connecting to database...");
	await connectMongoose();

	const AboutPage = getAboutPageModelSync();

	const imageDescriptionData = {
		backgroundColor: "#f5f0e8",
		items: [
			{
				image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&h=600&fit=crop",
				title: "Natural & Organic Products",
				description:
					"For everything we do – move, grow, exercise, work, play, or breathe – our bodies require sustenance. Milk is high in calcium and proteins, which assist to keep our muscles, bones, and teeth healthy. Vitamins B2 and B12, which promote our energy metabolism and nervous system, are found in milk. That's why we are producing natural and organic milk.",
				watermarkImage: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400&h=400&fit=crop",
			},
			{
				image: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=800&h=600&fit=crop",
				title: "Featured Recipe",
				description:
					"All kinds of items can be made with dairy-based ingredients. Milk is utilized in a variety of ways, including ready-to-drink beverages, savory soups and sauces, pastries and cakes, (frozen) desserts, and milk powder for coffee. These ingredients are in high demand by food manufacturers.",
				watermarkImage: "https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=400&h=400&fit=crop",
			},
		],
	};

	console.log("Updating about page with image description data...");

	await AboutPage.findOneAndUpdate(
		{},
		{
			$set: {
				imageDescription: imageDescriptionData,
				"sectionVisibility.imageDescription": true,
			},
		},
		{ upsert: true, new: true }
	);

	console.log("Image description section seeded successfully!");
	console.log("Added", imageDescriptionData.items.length, "items");
	console.log("Background color:", imageDescriptionData.backgroundColor);

	process.exit(0);
}

seedImageDescription().catch((error) => {
	console.error("Error seeding image description:", error);
	process.exit(1);
});
