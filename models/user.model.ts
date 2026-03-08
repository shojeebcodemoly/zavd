import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

/**
 * User interface extending Mongoose Document
 * Uses the SAME _id as Better Auth's user collection
 * No need for separate betterAuthUserId field
 */
export interface IUser extends Document {
	_id: mongoose.Types.ObjectId;
	email: string;
	name: string;
	emailVerified: boolean;
	image?: string;
	lastLoginAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	profile?: {
		_id: mongoose.Types.ObjectId;
		userId: mongoose.Types.ObjectId;
		bio?: string;
		avatarUrl?: string;
		phoneNumber?: string;
		address?: Record<string, unknown>;
		createdAt: Date;
		updatedAt: Date;
	};
}

/**
 * User Schema
 * Stores additional user data beyond what Better Auth manages
 */
const UserSchema = new Schema<IUser>(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			// index: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		emailVerified: {
			type: Boolean,
			default: false,
		},
		image: {
			type: String,
			default: null,
		},
		lastLoginAt: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true,
		collection: "user", // Same collection as Better Auth
	}
);

// Indexes for performance
// Note: email already has unique: true which creates an index
UserSchema.index({ createdAt: -1 });

// Virtual for user's full profile
UserSchema.virtual("profile", {
	ref: "Profile",
	localField: "_id",
	foreignField: "userId",
	justOne: true,
});

// Ensure virtuals are included in JSON
UserSchema.set("toJSON", {
	virtuals: true,
	transform: function (doc, ret) {
		// Remove sensitive fields
		ret = Object.assign({}, ret);
		delete (ret as any).__v;
		return ret;
	},
});

/**
 * Get User Model
 * Uses function to prevent model overwrite during hot reload
 */
export const getUserModel = async (): Promise<Model<IUser>> => {
	await connectMongoose();

	// Return existing model or create new one
	return (
		(mongoose.models.User as Model<IUser>) ||
		mongoose.model<IUser>("User", UserSchema)
	);
};

/**
 * Export synchronous model getter for use in repositories
 * Note: Ensure connectMongoose is called before using this
 */
export function getUserModelSync(): Model<IUser> {
	return (
		(mongoose.models.User as Model<IUser>) ||
		mongoose.model<IUser>("User", UserSchema)
	);
}
