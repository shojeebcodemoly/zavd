import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

/**
 * Type definitions for Blog Post sub-documents
 */
export type BlogPublishType = "publish" | "draft" | "private";

export interface IBlogImage {
	url: string;
	alt: string;
}

export interface IBlogHeaderImage {
	url: string;
	alt: string;
	showTitleOverlay: boolean;
}

export interface IBlogSeo {
	title?: string;
	description?: string;
	keywords?: string[];
	ogImage?: string;
	canonicalUrl?: string;
	noindex?: boolean;
}

/**
 * Blog Post interface extending Mongoose Document
 */
export interface IBlogPost extends Document {
	_id: mongoose.Types.ObjectId;
	title: string;
	slug: string;
	excerpt: string;
	content: string; // Rich HTML
	featuredImage?: IBlogImage;
	headerImage?: IBlogHeaderImage;
	author: mongoose.Types.ObjectId; // Reference to User
	categories: mongoose.Types.ObjectId[]; // References to BlogCategory
	tags: string[];
	seo: IBlogSeo;
	publishType: BlogPublishType;
	publishedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Sub-schemas for nested documents
 */
const BlogImageSchema = new Schema<IBlogImage>(
	{
		url: {
			type: String,
			required: [true, "Image URL is required"],
			trim: true,
		},
		alt: {
			type: String,
			default: "",
			trim: true,
		},
	},
	{ _id: false }
);

const BlogHeaderImageSchema = new Schema<IBlogHeaderImage>(
	{
		url: {
			type: String,
			required: [true, "Header image URL is required"],
			trim: true,
		},
		alt: {
			type: String,
			default: "",
			trim: true,
		},
		showTitleOverlay: {
			type: Boolean,
			default: false,
		},
	},
	{ _id: false }
);

const BlogSeoSchema = new Schema<IBlogSeo>(
	{
		title: {
			type: String,
			default: "",
			maxlength: [70, "SEO title should not exceed 70 characters"],
		},
		description: {
			type: String,
			default: "",
			maxlength: [160, "SEO description should not exceed 160 characters"],
		},
		keywords: [
			{
				type: String,
				trim: true,
			},
		],
		ogImage: {
			type: String,
			default: "",
		},
		canonicalUrl: {
			type: String,
			default: "",
		},
		noindex: {
			type: Boolean,
			default: false,
		},
	},
	{ _id: false }
);

/**
 * Blog Post Schema
 */
const BlogPostSchema = new Schema<IBlogPost>(
	{
		title: {
			type: String,
			required: [true, "Blog post title is required"],
			trim: true,
			maxlength: [200, "Blog post title cannot exceed 200 characters"],
		},
		slug: {
			type: String,
			required: [true, "Blog post slug is required"],
			trim: true,
			lowercase: true,
			maxlength: [250, "Blog post slug cannot exceed 250 characters"],
		},
		excerpt: {
			type: String,
			default: "",
			maxlength: [500, "Excerpt cannot exceed 500 characters"],
		},
		content: {
			type: String,
			default: "",
		},
		featuredImage: {
			type: BlogImageSchema,
			default: null,
		},
		headerImage: {
			type: BlogHeaderImageSchema,
			default: null,
		},
		author: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Author is required"],
		},
		categories: [
			{
				type: Schema.Types.ObjectId,
				ref: "BlogCategory",
			},
		],
		tags: [
			{
				type: String,
				trim: true,
			},
		],
		seo: {
			type: BlogSeoSchema,
			default: () => ({}),
		},
		publishType: {
			type: String,
			enum: ["publish", "draft", "private"],
			default: "draft",
		},
		publishedAt: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true,
		collection: "blog_posts",
	}
);

// Indexes for performance
BlogPostSchema.index({ slug: 1 }, { unique: true });
BlogPostSchema.index({ publishType: 1 });
BlogPostSchema.index({ publishedAt: -1 });
BlogPostSchema.index({ author: 1 });
BlogPostSchema.index({ categories: 1 });
BlogPostSchema.index({ tags: 1 });
BlogPostSchema.index({ createdAt: -1 });

// Text index for search
BlogPostSchema.index(
	{
		title: "text",
		excerpt: "text",
		content: "text",
	},
	{
		weights: {
			title: 10,
			excerpt: 5,
			content: 1,
		},
		name: "blog_post_text_search",
	}
);

// Ensure virtuals are included in JSON
BlogPostSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

BlogPostSchema.set("toObject", { virtuals: true });

/**
 * Get Blog Post Model
 * Uses function to prevent model overwrite during hot reload
 */
export const getBlogPostModel = async (): Promise<Model<IBlogPost>> => {
	await connectMongoose();

	return (
		(mongoose.models.BlogPost as Model<IBlogPost>) ||
		mongoose.model<IBlogPost>("BlogPost", BlogPostSchema)
	);
};

/**
 * Export synchronous model getter for use in repositories
 * Note: Ensure connectMongoose is called before using this
 */
export function getBlogPostModelSync(): Model<IBlogPost> {
	return (
		(mongoose.models.BlogPost as Model<IBlogPost>) ||
		mongoose.model<IBlogPost>("BlogPost", BlogPostSchema)
	);
}
