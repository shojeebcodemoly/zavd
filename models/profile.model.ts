import mongoose, { Schema, Document, Model } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

/**
 * Address interface
 */
export interface IAddress {
	street?: string;
	city?: string;
	postalCode?: string;
	country?: string;
}

/**
 * Profile interface extending Mongoose Document
 */
export interface IProfile extends Document {
	_id: mongoose.Types.ObjectId;
	userId: mongoose.Types.ObjectId; // Reference to User
	bio?: string;
	avatarUrl?: string;
	phoneNumber?: string;
	address?: IAddress;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Address Schema
 */
const AddressSchema = new Schema<IAddress>(
	{
		street: { type: String, trim: true },
		city: { type: String, trim: true },
		postalCode: { type: String, trim: true },
		country: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Profile Schema
 */
const ProfileSchema = new Schema<IProfile>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
			unique: true,
			// index: true,
		},
		bio: {
			type: String,
			trim: true,
			maxlength: 500,
		},
		avatarUrl: {
			type: String,
			trim: true,
		},
		phoneNumber: {
			type: String,
			trim: true,
		},
		address: {
			type: AddressSchema,
			default: {},
		},
	},
	{
		timestamps: true,
		collection: "profiles",
	}
);

// Note: userId already has unique: true which creates an index

// Ensure virtuals are included in JSON
ProfileSchema.set("toJSON", {
	virtuals: true,
	transform: function (doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as any).__v;
		return ret;
	},
});

/**
 * Get Profile Model
 * Uses function to prevent model overwrite during hot reload
 */
export async function getProfileModel(): Promise<Model<IProfile>> {
	await connectMongoose();

	return (
		(mongoose.models.Profile as Model<IProfile>) ||
		mongoose.model<IProfile>("Profile", ProfileSchema)
	);
}

/**
 * Export synchronous model getter for use in repositories
 * Note: Ensure connectMongoose is called before using this
 */
export function getProfileModelSync(): Model<IProfile> {
	return (
		(mongoose.models.Profile as Model<IProfile>) ||
		mongoose.model<IProfile>("Profile", ProfileSchema)
	);
}
