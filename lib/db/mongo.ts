import { MongoClient } from "mongodb";

// Optional MongoClient options (tweak poolSize etc in prod)
const options = {
	// keep defaults, add e.g. maxPoolSize if needed
};

declare global {
	// allow caching across module reloads in dev
	var __mongoClientPromise: Promise<MongoClient> | undefined;
	var __mongoClientUri: string | undefined;
}

function getClientPromise(): Promise<MongoClient> {
	const uri = process.env.MONGODB_URI;

	if (!uri) {
		throw new Error("Missing MONGODB_URI environment variable");
	}

	if (process.env.NODE_ENV === "development") {
		// In dev: reuse global promise to avoid many connections during HMR
		// Also check if URI changed (e.g., after .env update)
		if (!global.__mongoClientPromise || global.__mongoClientUri !== uri) {
			const client = new MongoClient(uri, options);
			global.__mongoClientPromise = client.connect();
			global.__mongoClientUri = uri;
		}
		return global.__mongoClientPromise;
	} else {
		// In production, create a client instance (hosted envs usually reuse process)
		const client = new MongoClient(uri, options);
		return client.connect();
	}
}

export async function getMongoClient(): Promise<MongoClient> {
	return getClientPromise();
}
