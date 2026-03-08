import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

/**
 * Comment status types
 */
export type CommentStatus = "pending" | "approved" | "rejected";

/**
 * Blog Comment interface extending Mongoose Document
 */
export interface IBlogComment extends Document {
	_id: mongoose.Types.ObjectId;
	postId: mongoose.Types.ObjectId; // Reference to BlogPost
	name: string;
	email: string;
	phone: string;
	comment: string;
	status: CommentStatus;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Blog Comment Schema
 */
const BlogCommentSchema = new Schema<IBlogComment>(
	{
		postId: {
			type: Schema.Types.ObjectId,
			ref: "BlogPost",
			required: [true, "Post ID is required"],
			index: true,
		},
		name: {
			type: String,
			required: [true, "Name is required"],
			trim: true,
			maxlength: [100, "Name cannot exceed 100 characters"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			trim: true,
			lowercase: true,
			maxlength: [255, "Email cannot exceed 255 characters"],
			match: [
				/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
				"Please provide a valid email address",
			],
		},
		phone: {
			type: String,
			required: [true, "Phone number is required"],
			trim: true,
			maxlength: [20, "Phone number cannot exceed 20 characters"],
		},
		comment: {
			type: String,
			required: [true, "Comment is required"],
			trim: true,
			maxlength: [2000, "Comment cannot exceed 2000 characters"],
		},
		status: {
			type: String,
			enum: ["pending", "approved", "rejected"],
			default: "pending",
			index: true,
		},
	},
	{
		timestamps: true,
		collection: "blog_comments",
	}
);

// Indexes for performance
BlogCommentSchema.index({ postId: 1, status: 1, createdAt: -1 });
BlogCommentSchema.index({ status: 1, createdAt: -1 });
BlogCommentSchema.index({ email: 1, createdAt: -1 });

// Ensure virtuals are included in JSON
BlogCommentSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

BlogCommentSchema.set("toObject", { virtuals: true });

/**
 * Get BlogComment Model
 * Uses function to prevent model overwrite during hot reload
 */
export const getBlogCommentModel = async (): Promise<Model<IBlogComment>> => {
	await connectMongoose();

	return (
		(mongoose.models.BlogComment as Model<IBlogComment>) ||
		mongoose.model<IBlogComment>("BlogComment", BlogCommentSchema)
	);
};

/**
 * Export synchronous model getter for use in repositories
 * Note: Ensure connectMongoose is called before using this
 */
export function getBlogCommentModelSync(): Model<IBlogComment> {
	return (
		(mongoose.models.BlogComment as Model<IBlogComment>) ||
		mongoose.model<IBlogComment>("BlogComment", BlogCommentSchema)
	);
}
