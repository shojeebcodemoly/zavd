/**
 * Reset Admin Password Script
 * Run with: npx tsx scripts/reset-admin-password.ts
 */

import crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import { MongoClient } from "mongodb";

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

// Hash password using scrypt (same as Better Auth)
async function hashPassword(password: string): Promise<string> {
	const salt = crypto.randomBytes(16).toString("hex");
	const normalizedPassword = password.normalize("NFKC");

	return new Promise((resolve, reject) => {
		crypto.scrypt(
			normalizedPassword,
			salt,
			64,
			{
				N: 16384,
				r: 16,
				p: 1,
				maxmem: 128 * 16384 * 16 * 2,
			},
			(err: Error | null, derivedKey: Buffer) => {
				if (err) reject(err);
				resolve(`${salt}:${derivedKey.toString("hex")}`);
			}
		);
	});
}

async function main() {
	const email = process.env.RESET_EMAIL || "admin@cheese.se";
	const newPassword = process.env.RESET_PASSWORD || "Admin@123";
	const mongoUri = process.env.MONGODB_URI;
	const dbName = process.env.MONGODB_DB || "cheese-db";

	if (!mongoUri) {
		console.error("MONGODB_URI is required");
		process.exit(1);
	}

	console.log("\n========================================");
	console.log("  Password Reset Script");
	console.log("========================================\n");
	console.log(`Email: ${email}`);
	console.log(`New Password: ${newPassword}`);

	const client = new MongoClient(mongoUri);

	try {
		await client.connect();
		const db = client.db(dbName);

		// Find user
		const user = await db.collection("user").findOne({ email: email.toLowerCase() });
		if (!user) {
			console.error(`\nUser with email "${email}" not found.`);
			process.exit(1);
		}

		console.log(`\nFound user: ${user.name} (${user._id})`);

		// Hash new password
		console.log("Hashing new password...");
		const hashedPassword = await hashPassword(newPassword);

		// Update account password
		const result = await db.collection("account").updateOne(
			{ userId: user._id, providerId: "credential" },
			{ $set: { password: hashedPassword, updatedAt: new Date() } }
		);

		if (result.matchedCount === 0) {
			console.error("Account not found for this user.");
			process.exit(1);
		}

		console.log("\n========================================");
		console.log("  Password Reset Successful!");
		console.log("========================================");
		console.log(`  Email: ${email}`);
		console.log(`  Password: ${newPassword}`);
		console.log("========================================\n");

	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	} finally {
		await client.close();
	}
}

main();
