import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

/**
 * Blog Category interface extending Mongoose Document
 * Supports infinite nesting via parent reference
 * Same structure as product categories for consistency
 */
export interface IBlogCategory extends Document {
	_id: mongoose.Types.ObjectId;
	name: string;
	slug: string;
	description?: string;
	parent: mongoose.Types.ObjectId | null;
	image?: string | null;
	order: number;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Blog Category tree node for frontend consumption
 */
export interface IBlogCategoryTreeNode {
	_id: string;
	name: string;
	slug: string;
	description?: string;
	image?: string | null;
	order: number;
	isActive: boolean;
	parent: string | null;
	children: IBlogCategoryTreeNode[];
	depth: number;
	path: string;
}

/**
 * Blog Category Schema
 * Supports hierarchical structure with parent reference
 */
const BlogCategorySchema = new Schema<IBlogCategory>(
	{
		name: {
			type: String,
			required: [true, "Category name is required"],
			trim: true,
			maxlength: [100, "Category name cannot exceed 100 characters"],
		},
		slug: {
			type: String,
			required: [true, "Category slug is required"],
			trim: true,
			lowercase: true,
			maxlength: [120, "Category slug cannot exceed 120 characters"],
		},
		description: {
			type: String,
			default: "",
			maxlength: [15000, "Category description cannot exceed 15000 characters"],
		},
		parent: {
			type: Schema.Types.ObjectId,
			ref: "BlogCategory",
			default: null,
		},
		image: {
			type: String,
			default: null,
		},
		order: {
			type: Number,
			default: 0,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
		collection: "blog_categories",
	}
);

// Compound index for efficient tree queries
BlogCategorySchema.index({ parent: 1, order: 1 });
BlogCategorySchema.index({ slug: 1 }, { unique: true });

// Virtual for children (populated on demand)
BlogCategorySchema.virtual("children", {
	ref: "BlogCategory",
	localField: "_id",
	foreignField: "parent",
});

// Ensure virtuals are included in JSON
BlogCategorySchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

BlogCategorySchema.set("toObject", { virtuals: true });

/**
 * Get Blog Category Model
 * Uses function to prevent model overwrite during hot reload
 */
export const getBlogCategoryModel = async (): Promise<Model<IBlogCategory>> => {
	await connectMongoose();

	return (
		(mongoose.models.BlogCategory as Model<IBlogCategory>) ||
		mongoose.model<IBlogCategory>("BlogCategory", BlogCategorySchema)
	);
};

/**
 * Export synchronous model getter for use in repositories
 * Note: Ensure connectMongoose is called before using this
 */
export function getBlogCategoryModelSync(): Model<IBlogCategory> {
	return (
		(mongoose.models.BlogCategory as Model<IBlogCategory>) ||
		mongoose.model<IBlogCategory>("BlogCategory", BlogCategorySchema)
	);
}
