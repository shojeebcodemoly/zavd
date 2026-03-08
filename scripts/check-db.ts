import mongoose from "mongoose";
import * as fs from "fs";
import * as path from "path";

// Load .env file
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

async function main() {
	try {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(MONGODB_URI!);
		console.log("Connected to MongoDB\n");

		const db = mongoose.connection.db;
		if (!db) {
			throw new Error("Database connection not established");
		}

		// Check collections
		const collections = await db.listCollections().toArray();
		console.log("=== Collections ===");
		for (const col of collections) {
			const count = await db.collection(col.name).countDocuments();
			console.log(`${col.name}: ${count} documents`);
		}
	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	} finally {
		await mongoose.disconnect();
		console.log("\nDisconnected from MongoDB");
	}
}

main();
