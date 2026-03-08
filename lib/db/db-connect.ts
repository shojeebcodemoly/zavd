import mongoose from "mongoose";

declare global {
	var __mongoose:
		| {
				conn: typeof mongoose | null;
				promise: Promise<typeof mongoose> | null;
				uri: string | null;
		  }
		| undefined;
}

export async function connectMongoose() {
	const MONGODB_URI = process.env.MONGODB_URI;

	if (!MONGODB_URI) {
		throw new Error("Please define the MONGODB_URI environment variable");
	}

	// Return cached connection if available and URI hasn't changed
	if (global.__mongoose?.conn && global.__mongoose.uri === MONGODB_URI) {
		return global.__mongoose.conn;
	}

	if (!global.__mongoose) {
		global.__mongoose = { conn: null, promise: null, uri: null };
	}

	// Check if URI changed - need to reconnect
	if (global.__mongoose.uri !== MONGODB_URI) {
		global.__mongoose.conn = null;
		global.__mongoose.promise = null;
	}

	if (!global.__mongoose.promise) {
		const opts = {
			bufferCommands: false,
			maxPoolSize: 10,
			serverSelectionTimeoutMS: 10000,
			socketTimeoutMS: 45000,
			connectTimeoutMS: 10000,
		};

		global.__mongoose.uri = MONGODB_URI;
		global.__mongoose.promise = mongoose
			.connect(MONGODB_URI, opts)
			.then((mongooseInstance) => {
				return mongooseInstance;
			})
			.catch((error) => {
				console.error("❌ [MongoDB] Connection failed:", error);
				global.__mongoose!.uri = null;
				global.__mongoose!.promise = null;
				throw error;
			});
	}
	global.__mongoose.conn = await global.__mongoose.promise;
	return global.__mongoose.conn;
}
