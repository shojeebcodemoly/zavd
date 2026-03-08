/**
 * Seed Admin User Script
 *
 * Creates the initial admin user for a fresh database deployment.
 * Solves the chicken-and-egg problem where dashboard requires auth,
 * but only authenticated users can create new users.
 *
 * Usage:
 *   Interactive:    pnpm seed:admin
 *   With env vars:  SEED_ADMIN_EMAIL=... SEED_ADMIN_NAME=... SEED_ADMIN_PASSWORD=... pnpm seed:admin
 */

import crypto from "crypto";
import * as readline from "readline";
import * as fs from "fs";
import * as path from "path";
import { MongoClient, ObjectId } from "mongodb";

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
				// Skip empty lines and comments
				if (!trimmed || trimmed.startsWith("#")) continue;
				const eqIndex = trimmed.indexOf("=");
				if (eqIndex === -1) continue;
				const key = trimmed.slice(0, eqIndex).trim();
				let value = trimmed.slice(eqIndex + 1).trim();
				// Remove surrounding quotes if present
				if (
					(value.startsWith('"') && value.endsWith('"')) ||
					(value.startsWith("'") && value.endsWith("'"))
				) {
					value = value.slice(1, -1);
				}
				// Only set if not already defined (CLI env vars take precedence)
				if (!process.env[key]) {
					process.env[key] = value;
				}
			}
			break;
		}
	}
}

// Load env file before anything else
loadEnvFile();

// Password configuration (matching lib/utils/constants.ts)
const PASSWORD_CONFIG = {
	MIN_LENGTH: 8,
	MAX_LENGTH: 128,
};

// Validation functions
function validateEmail(email: string): { valid: boolean; error?: string } {
	const trimmed = email.trim().toLowerCase();
	if (!trimmed) {
		return { valid: false, error: "Email is required" };
	}
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(trimmed)) {
		return { valid: false, error: "Invalid email format" };
	}
	return { valid: true };
}

function validatePassword(password: string): {
	valid: boolean;
	error?: string;
} {
	if (password.length < PASSWORD_CONFIG.MIN_LENGTH) {
		return {
			valid: false,
			error: `Password must be at least ${PASSWORD_CONFIG.MIN_LENGTH} characters`,
		};
	}
	if (password.length > PASSWORD_CONFIG.MAX_LENGTH) {
		return {
			valid: false,
			error: `Password must not exceed ${PASSWORD_CONFIG.MAX_LENGTH} characters`,
		};
	}
	if (!/[a-z]/.test(password)) {
		return {
			valid: false,
			error: "Password must contain at least one lowercase letter",
		};
	}
	if (!/[A-Z]/.test(password)) {
		return {
			valid: false,
			error: "Password must contain at least one uppercase letter",
		};
	}
	if (!/[0-9]/.test(password)) {
		return {
			valid: false,
			error: "Password must contain at least one number",
		};
	}
	if (!/[@$!%*?&#]/.test(password)) {
		return {
			valid: false,
			error: "Password must contain at least one special character (@$!%*?&#)",
		};
	}
	return { valid: true };
}

function validateName(name: string): { valid: boolean; error?: string } {
	const trimmed = name.trim();
	if (trimmed.length < 2) {
		return { valid: false, error: "Name must be at least 2 characters" };
	}
	if (trimmed.length > 100) {
		return { valid: false, error: "Name must not exceed 100 characters" };
	}
	return { valid: true };
}

// Hash password using scrypt (same as Better Auth / authService)
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

// Interactive prompt helper (simple, shows plain text)
function prompt(rl: readline.Interface, question: string): Promise<string> {
	return new Promise((resolve) => {
		rl.question(question, resolve);
	});
}

async function getCredentials(): Promise<{
	email: string;
	name: string;
	password: string;
}> {
	// Check environment variables first
	const envEmail = process.env.SEED_ADMIN_EMAIL;
	const envName = process.env.SEED_ADMIN_NAME;
	const envPassword = process.env.SEED_ADMIN_PASSWORD;

	if (envEmail && envName && envPassword) {
		console.log("Using credentials from environment variables...\n");
		return {
			email: envEmail.trim().toLowerCase(),
			name: envName.trim(),
			password: envPassword,
		};
	}

	// Interactive prompts
	console.log(
		"No environment variables found. Please enter credentials interactively.\n"
	);

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	try {
		// Get email
		let email = "";
		while (true) {
			email = await prompt(rl, "Email: ");
			const emailValidation = validateEmail(email);
			if (emailValidation.valid) break;
			console.log(`  Error: ${emailValidation.error}\n`);
		}

		// Get name
		let name = "";
		while (true) {
			name = await prompt(rl, "Name: ");
			const nameValidation = validateName(name);
			if (nameValidation.valid) break;
			console.log(`  Error: ${nameValidation.error}\n`);
		}

		// Get password with confirmation
		let password = "";
		while (true) {
			password = await prompt(rl, "Password: ");
			const passwordValidation = validatePassword(password);
			if (!passwordValidation.valid) {
				console.log(`  Error: ${passwordValidation.error}\n`);
				continue;
			}

			const confirmPassword = await prompt(rl, "Confirm Password: ");
			if (password !== confirmPassword) {
				console.log("  Error: Passwords do not match. Please try again.\n");
				continue;
			}
			break;
		}

		return {
			email: email.trim().toLowerCase(),
			name: name.trim(),
			password,
		};
	} finally {
		rl.close();
	}
}

async function main() {
	console.log("\n========================================");
	console.log("  Synos - Admin User Seed Script");
	console.log("========================================\n");

	// Get MongoDB URI
	const mongoUri = process.env.MONGODB_URI;
	const dbName = process.env.MONGODB_DB || "synos-db";

	if (!mongoUri) {
		console.error("Error: MONGODB_URI environment variable is required.");
		console.error(
			"Set it in your .env file or export it before running this script.\n"
		);
		process.exit(1);
	}

	// Get credentials
	const { email, name, password } = await getCredentials();

	// Validate all inputs
	const emailValidation = validateEmail(email);
	if (!emailValidation.valid) {
		console.error(`\nError: ${emailValidation.error}`);
		process.exit(1);
	}

	const nameValidation = validateName(name);
	if (!nameValidation.valid) {
		console.error(`\nError: ${nameValidation.error}`);
		process.exit(1);
	}

	const passwordValidation = validatePassword(password);
	if (!passwordValidation.valid) {
		console.error(`\nError: ${passwordValidation.error}`);
		process.exit(1);
	}

	console.log("\nConnecting to MongoDB...");

	const client = new MongoClient(mongoUri);

	try {
		await client.connect();
		const db = client.db(dbName);

		// Check if email already exists
		const existingUser = await db.collection("user").findOne({
			email: email.toLowerCase(),
		});

		if (existingUser) {
			console.error(`\nError: A user with email "${email}" already exists.`);
			console.error(
				"If you need to reset the password, use the forgot password feature or manually update the database.\n"
			);
			process.exit(1);
		}

		console.log("Hashing password...");
		const hashedPassword = await hashPassword(password);

		// Generate ObjectIds
		const userObjectId = new ObjectId();
		const accountObjectId = new ObjectId();
		const profileObjectId = new ObjectId();
		const now = new Date();

		console.log("Creating user documents...");

		// Create user document
		const userDoc = {
			_id: userObjectId,
			email: email.toLowerCase(),
			name: name.trim(),
			emailVerified: false,
			image: null,
			createdAt: now,
			updatedAt: now,
		};

		await db.collection("user").insertOne(userDoc);

		// Create account document (Better Auth format)
		const accountDoc = {
			_id: accountObjectId,
			userId: userObjectId,
			accountId: userObjectId,
			providerId: "credential",
			password: hashedPassword,
			accessToken: null,
			refreshToken: null,
			accessTokenExpiresAt: null,
			refreshTokenExpiresAt: null,
			scope: null,
			idToken: null,
			createdAt: now,
			updatedAt: now,
		};

		await db.collection("account").insertOne(accountDoc);

		// Create profile document
		const profileDoc = {
			_id: profileObjectId,
			userId: userObjectId,
			bio: "",
			avatarUrl: null,
			phoneNumber: null,
			address: {},
			createdAt: now,
			updatedAt: now,
		};

		await db.collection("profile").insertOne(profileDoc);

		console.log("\n========================================");
		console.log("  User created successfully!");
		console.log("========================================");
		console.log(`  Email: ${email}`);
		console.log(`  Name:  ${name}`);
		console.log(`  ID:    ${userObjectId.toString()}`);
		console.log("========================================\n");
		console.log("You can now log in at /login with these credentials.\n");
	} catch (error) {
		console.error("\nError creating user:", error);
		process.exit(1);
	} finally {
		await client.close();
	}
}

main();
