import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export interface IQualitySectionVisibility {
	hero: boolean;
	certificates: boolean;
	description: boolean;
}

const QualitySectionVisibilitySchema = new Schema<IQualitySectionVisibility>(
	{
		hero: { type: Boolean, default: true },
		certificates: { type: Boolean, default: true },
		description: { type: Boolean, default: true },
	},
	{ _id: false }
);

// ============================================================================
// HERO SECTION
// ============================================================================
export interface IQualityHeroSection {
	badge?: string;
	title?: string;
	titleHighlight?: string;
	subtitle?: string;
	backgroundImage?: string;
}

const QualityHeroSectionSchema = new Schema<IQualityHeroSection>(
	{
		badge: { type: String, trim: true, default: "QUALITY ASSURANCE" },
		title: { type: String, trim: true, default: "Our" },
		titleHighlight: { type: String, trim: true, default: "Certifications" },
		subtitle: { type: String, trim: true, default: "We are committed to maintaining the highest standards of quality and safety." },
		backgroundImage: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// CERTIFICATE ITEM
// ============================================================================
export interface IQualityCertificate {
	_id?: mongoose.Types.ObjectId;
	title?: string;
	image?: string;
	description?: string;
	order?: number;
}

const QualityCertificateSchema = new Schema<IQualityCertificate>(
	{
		title: { type: String, trim: true },
		image: { type: String, trim: true },
		description: { type: String, trim: true },
		order: { type: Number, default: 0 },
	},
	{ _id: true }
);

// ============================================================================
// DESCRIPTION SECTION
// ============================================================================
export interface IQualityDescriptionSection {
	title?: string;
	content?: string; // Rich HTML
}

const QualityDescriptionSectionSchema = new Schema<IQualityDescriptionSection>(
	{
		title: { type: String, trim: true, default: "Our Commitment to Quality" },
		content: { type: String, default: "" },
	},
	{ _id: false }
);

// ============================================================================
// SEO SECTION
// ============================================================================
export interface IQualitySeo {
	title?: string;
	description?: string;
	keywords?: string[];
	ogImage?: string;
}

const QualitySeoSchema = new Schema<IQualitySeo>(
	{
		title: { type: String, trim: true, default: "Quality & Certifications" },
		description: { type: String, trim: true },
		keywords: { type: [String], default: [] },
		ogImage: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// MAIN QUALITY PAGE DOCUMENT
// ============================================================================
export interface IQualityPage extends Document {
	_id: mongoose.Types.ObjectId;
	sectionVisibility: IQualitySectionVisibility;
	hero: IQualityHeroSection;
	certificates: IQualityCertificate[];
	description: IQualityDescriptionSection;
	seo: IQualitySeo;
	createdAt: Date;
	updatedAt: Date;
}

const QualityPageSchema = new Schema<IQualityPage>(
	{
		sectionVisibility: {
			type: QualitySectionVisibilitySchema,
			default: () => ({}),
		},
		hero: {
			type: QualityHeroSectionSchema,
			default: () => ({}),
		},
		certificates: {
			type: [QualityCertificateSchema],
			default: [],
		},
		description: {
			type: QualityDescriptionSectionSchema,
			default: () => ({}),
		},
		seo: {
			type: QualitySeoSchema,
			default: () => ({}),
		},
	},
	{
		timestamps: true,
		collection: "quality_page",
	}
);

// Ensure virtuals are included in JSON
QualityPageSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

QualityPageSchema.set("toObject", { virtuals: true });

/**
 * Get Quality Page Model
 * Uses async function to ensure DB connection
 */
export const getQualityPageModel = async (): Promise<Model<IQualityPage>> => {
	await connectMongoose();

	return (
		(mongoose.models.QualityPage as Model<IQualityPage>) ||
		mongoose.model<IQualityPage>("QualityPage", QualityPageSchema)
	);
};

/**
 * Get Quality Page Model (Sync)
 * For use in repositories - ensure connectMongoose is called before using
 */
export function getQualityPageModelSync(): Model<IQualityPage> {
	return (
		(mongoose.models.QualityPage as Model<IQualityPage>) ||
		mongoose.model<IQualityPage>("QualityPage", QualityPageSchema)
	);
}
