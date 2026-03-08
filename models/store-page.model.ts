import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export interface IStoreSectionVisibility {
	hero: boolean;
	info: boolean;
	openingHours: boolean;
	map: boolean;
	gallery: boolean;
}

const StoreSectionVisibilitySchema = new Schema<IStoreSectionVisibility>(
	{
		hero: { type: Boolean, default: true },
		info: { type: Boolean, default: true },
		openingHours: { type: Boolean, default: true },
		map: { type: Boolean, default: true },
		gallery: { type: Boolean, default: true },
	},
	{ _id: false }
);

// ============================================================================
// HERO SECTION
// ============================================================================
export interface IStoreHeroSection {
	badge?: string;
	title?: string;
	subtitle?: string;
	backgroundImage?: string;
}

const StoreHeroSectionSchema = new Schema<IStoreHeroSection>(
	{
		badge: { type: String, trim: true },
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		backgroundImage: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// INFO SECTION
// ============================================================================
export interface IStoreInfoSection {
	title?: string;
	description?: string;
	image?: string;
	features?: string[];
}

const StoreInfoSectionSchema = new Schema<IStoreInfoSection>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		image: { type: String, trim: true },
		features: [{ type: String, trim: true }],
	},
	{ _id: false }
);

// ============================================================================
// OPENING HOURS SECTION
// ============================================================================
export interface IOpeningHoursDay {
	day: string;
	hours: string;
	isClosed?: boolean;
}

export interface IStoreOpeningHoursSection {
	title?: string;
	subtitle?: string;
	schedule?: IOpeningHoursDay[];
	specialNote?: string;
}

const OpeningHoursDaySchema = new Schema<IOpeningHoursDay>(
	{
		day: { type: String, trim: true },
		hours: { type: String, trim: true },
		isClosed: { type: Boolean, default: false },
	},
	{ _id: false }
);

const StoreOpeningHoursSectionSchema = new Schema<IStoreOpeningHoursSection>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		schedule: { type: [OpeningHoursDaySchema], default: [] },
		specialNote: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// MAP SECTION
// ============================================================================
export interface IStoreMapSection {
	title?: string;
	subtitle?: string;
	address?: string;
	city?: string;
	postalCode?: string;
	country?: string;
	phone?: string;
	email?: string;
	mapEmbedUrl?: string;
	directions?: string;
}

const StoreMapSectionSchema = new Schema<IStoreMapSection>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		address: { type: String, trim: true },
		city: { type: String, trim: true },
		postalCode: { type: String, trim: true },
		country: { type: String, trim: true, default: "Sweden" },
		phone: { type: String, trim: true },
		email: { type: String, trim: true },
		mapEmbedUrl: { type: String, trim: true },
		directions: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// GALLERY SECTION
// ============================================================================
export interface IGalleryImage {
	url: string;
	alt?: string;
	caption?: string;
}

export interface IStoreGallerySection {
	title?: string;
	subtitle?: string;
	images?: IGalleryImage[];
}

const GalleryImageSchema = new Schema<IGalleryImage>(
	{
		url: { type: String, required: true, trim: true },
		alt: { type: String, trim: true },
		caption: { type: String, trim: true },
	},
	{ _id: false }
);

const StoreGallerySectionSchema = new Schema<IStoreGallerySection>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		images: { type: [GalleryImageSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// SEO
// ============================================================================
export interface IStorePageSeo {
	title?: string;
	description?: string;
	ogImage?: string;
}

const StorePageSeoSchema = new Schema<IStorePageSeo>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		ogImage: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// MAIN STORE PAGE
// ============================================================================
export interface IStorePage extends Document {
	_id: mongoose.Types.ObjectId;
	sectionVisibility: IStoreSectionVisibility;
	hero: IStoreHeroSection;
	info: IStoreInfoSection;
	openingHours: IStoreOpeningHoursSection;
	map: IStoreMapSection;
	gallery: IStoreGallerySection;
	seo: IStorePageSeo;
	updatedAt: Date;
	createdAt: Date;
}

const StorePageSchema = new Schema<IStorePage>(
	{
		sectionVisibility: {
			type: StoreSectionVisibilitySchema,
			default: {
				hero: true,
				info: true,
				openingHours: true,
				map: true,
				gallery: true,
			},
		},
		hero: {
			type: StoreHeroSectionSchema,
			default: {
				badge: "Visit Us",
				title: "Store in Boxholm",
				subtitle: "Experience our artisan cheese in person. Visit our store and taste the tradition.",
			},
		},
		info: {
			type: StoreInfoSectionSchema,
			default: {
				title: "Welcome to Our Store",
				description: "Located in the heart of Boxholm, our store offers a unique experience where you can taste and purchase our handcrafted cheeses directly from the source. Our knowledgeable staff will guide you through our selection and share the stories behind each cheese.",
				features: [
					"Cheese tasting available",
					"Local products",
					"Gift packages",
					"Friendly staff",
				],
			},
		},
		openingHours: {
			type: StoreOpeningHoursSectionSchema,
			default: {
				title: "Opening Hours",
				subtitle: "We look forward to seeing you!",
				schedule: [
					{ day: "Monday", hours: "10:00 - 18:00", isClosed: false },
					{ day: "Tuesday", hours: "10:00 - 18:00", isClosed: false },
					{ day: "Wednesday", hours: "10:00 - 18:00", isClosed: false },
					{ day: "Thursday", hours: "10:00 - 18:00", isClosed: false },
					{ day: "Friday", hours: "10:00 - 18:00", isClosed: false },
					{ day: "Saturday", hours: "10:00 - 15:00", isClosed: false },
					{ day: "Sunday", hours: "Closed", isClosed: true },
				],
				specialNote: "Holiday hours may vary. Please call ahead during holidays.",
			},
		},
		map: {
			type: StoreMapSectionSchema,
			default: {
				title: "Find Us",
				subtitle: "We're located in the center of Boxholm",
				address: "Storgatan 1",
				city: "Boxholm",
				postalCode: "590 10",
				country: "Sweden",
				directions: "Easy parking available in front of the store. We're located next to the town square.",
			},
		},
		gallery: {
			type: StoreGallerySectionSchema,
			default: {
				title: "Our Store",
				subtitle: "Take a peek inside",
				images: [],
			},
		},
		seo: {
			type: StorePageSeoSchema,
			default: {
				title: "Store in Boxholm - Boxholm Cheese",
				description: "Visit our cheese store in Boxholm. Taste and purchase our handcrafted artisan cheeses directly from the source. Open Monday to Saturday.",
			},
		},
	},
	{
		timestamps: true,
		collection: "store_page",
	}
);

// Ensure virtuals are included in JSON
StorePageSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

StorePageSchema.set("toObject", { virtuals: true });

/**
 * Get StorePage Model
 */
export const getStorePageModel = async (): Promise<Model<IStorePage>> => {
	await connectMongoose();

	return (
		(mongoose.models.StorePage as Model<IStorePage>) ||
		mongoose.model<IStorePage>("StorePage", StorePageSchema)
	);
};

/**
 * Export synchronous model getter for use in repositories
 */
export function getStorePageModelSync(): Model<IStorePage> {
	return (
		(mongoose.models.StorePage as Model<IStorePage>) ||
		mongoose.model<IStorePage>("StorePage", StorePageSchema)
	);
}
