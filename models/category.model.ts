import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

/**
 * SEO settings interface for categories
 */
export interface ICategorySeo {
	title?: string;
	description?: string;
	ogImage?: string | null;
	noindex?: boolean;
}

/**
 * Category interface extending Mongoose Document
 * Supports infinite nesting via parent reference
 */
export interface ICategory extends Document {
	_id: mongoose.Types.ObjectId;
	name: string;
	slug: string;
	description?: string; // Rich HTML content from TextEditor
	parent: mongoose.Types.ObjectId | null;
	image?: string | null; // URL
	order: number; // For sorting siblings
	isActive: boolean;
	seo?: ICategorySeo;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Category tree node for frontend consumption
 */
export interface ICategoryTreeNode {
	_id: string;
	name: string;
	slug: string;
	description?: string;
	image?: string | null;
	order: number;
	isActive: boolean;
	parent: string | null;
	children: ICategoryTreeNode[];
	depth: number;
	path: string; // Full path like "parent/child/grandchild"
}

/**
 * Category Schema
 * Supports hierarchical structure with parent reference
 */
const CategorySchema = new Schema<ICategory>(
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
		},
		parent: {
			type: Schema.Types.ObjectId,
			ref: "Category",
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
		seo: {
			title: {
				type: String,
				default: "",
				maxlength: [70, "SEO title cannot exceed 70 characters"],
			},
			description: {
				type: String,
				default: "",
				maxlength: [200, "SEO description cannot exceed 200 characters"],
			},
			ogImage: {
				type: String,
				default: null,
			},
			noindex: {
				type: Boolean,
				default: false,
			},
		},
	},
	{
		timestamps: true,
		collection: "categories",
	}
);

// Compound index for efficient tree queries and sorting
CategorySchema.index({ parent: 1, order: 1, createdAt: 1 });
CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ order: 1, createdAt: 1 });
CategorySchema.index({ isActive: 1, order: 1, createdAt: 1 });

// Virtual for children (populated on demand)
CategorySchema.virtual("children", {
	ref: "Category",
	localField: "_id",
	foreignField: "parent",
});

// Ensure virtuals are included in JSON
CategorySchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

CategorySchema.set("toObject", { virtuals: true });

/**
 * Get Category Model
 * Uses function to prevent model overwrite during hot reload
 */
export const getCategoryModel = async (): Promise<Model<ICategory>> => {
	await connectMongoose();

	return (
		(mongoose.models.Category as Model<ICategory>) ||
		mongoose.model<ICategory>("Category", CategorySchema)
	);
};

/**
 * Export synchronous model getter for use in repositories
 * Note: Ensure connectMongoose is called before using this
 */
export function getCategoryModelSync(): Model<ICategory> {
	return (
		(mongoose.models.Category as Model<ICategory>) ||
		mongoose.model<ICategory>("Category", CategorySchema)
	);
}
