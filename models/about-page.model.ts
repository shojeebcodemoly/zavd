import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export interface IAboutSectionVisibility {
	history: boolean;
	customers: boolean;
	video: boolean;
	gallery: boolean;
	team: boolean;
	contact: boolean;
	stats: boolean;
	imageDescription: boolean;
}

const AboutSectionVisibilitySchema = new Schema<IAboutSectionVisibility>(
	{
		history: { type: Boolean, default: true },
		customers: { type: Boolean, default: true },
		video: { type: Boolean, default: true },
		gallery: { type: Boolean, default: true },
		team: { type: Boolean, default: true },
		contact: { type: Boolean, default: true },
		stats: { type: Boolean, default: true },
		imageDescription: { type: Boolean, default: true },
	},
	{ _id: false }
);

// ============================================================================
// HISTORY SECTION (Timeline Design)
// ============================================================================
export interface IHistoryTimelineItem {
	year: string;
	title: string;
	description: string;
	image?: string;
}

export interface IHistorySection {
	badge?: string;
	title?: string;
	subtitle?: string;
	timelineItems?: IHistoryTimelineItem[];
}

const HistoryTimelineItemSchema = new Schema<IHistoryTimelineItem>(
	{
		year: { type: String, trim: true },
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		image: { type: String, trim: true },
	},
	{ _id: false }
);

const HistorySectionSchema = new Schema<IHistorySection>(
	{
		badge: { type: String, trim: true },
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		timelineItems: { type: [HistoryTimelineItemSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// CUSTOMERS SECTION
// ============================================================================
export interface ICustomerItem {
	name: string;
	logo?: string;
	products?: string;
	description?: string;
	website?: string;
}

export interface ICustomersSection {
	title?: string;
	subtitle?: string;
	customers?: ICustomerItem[];
}

const CustomerItemSchema = new Schema<ICustomerItem>(
	{
		name: { type: String, trim: true },
		logo: { type: String, trim: true },
		products: { type: String, trim: true },
		description: { type: String, trim: true },
		website: { type: String, trim: true },
	},
	{ _id: false }
);

const CustomersSectionSchema = new Schema<ICustomersSection>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		customers: { type: [CustomerItemSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// TEAM SECTION
// ============================================================================
export interface ITeamMember {
	name: string;
	role: string;
	image?: string;
	email?: string;
	phone?: string;
	linkedin?: string;
	department?: string;
	bio?: string;
}

export interface ITeamSection {
	title?: string;
	subtitle?: string;
	members?: ITeamMember[];
}

const TeamMemberSchema = new Schema<ITeamMember>(
	{
		name: { type: String, trim: true },
		role: { type: String, trim: true },
		image: { type: String, trim: true },
		email: { type: String, trim: true },
		phone: { type: String, trim: true },
		linkedin: { type: String, trim: true },
		department: { type: String, trim: true },
		bio: { type: String, trim: true },
	},
	{ _id: false }
);

const TeamSectionSchema = new Schema<ITeamSection>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		members: { type: [TeamMemberSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// VIDEO SECTION
// ============================================================================
export interface IVideoSection {
	backgroundImage?: string;
	titleHighlighted?: string;
	titleNormal?: string;
	videoUrl?: string;
	buttonLabel?: string;
}

const VideoSectionSchema = new Schema<IVideoSection>(
	{
		backgroundImage: { type: String, trim: true },
		titleHighlighted: { type: String, trim: true },
		titleNormal: { type: String, trim: true },
		videoUrl: { type: String, trim: true },
		buttonLabel: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// GALLERY SECTION
// ============================================================================
export interface IGalleryImage {
	src: string;
	alt?: string;
}

export interface IGallerySection {
	backgroundImage?: string;
	backgroundColor?: string;
	title?: string;
	images?: IGalleryImage[];
}

const GalleryImageSchema = new Schema<IGalleryImage>(
	{
		src: { type: String, trim: true },
		alt: { type: String, trim: true },
	},
	{ _id: false }
);

const GallerySectionSchema = new Schema<IGallerySection>(
	{
		backgroundImage: { type: String, trim: true },
		backgroundColor: { type: String, trim: true },
		title: { type: String, trim: true },
		images: { type: [GalleryImageSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// CONTACT SECTION
// ============================================================================
export interface IContactSection {
	title?: string;
	subtitle?: string;
	showContactForm?: boolean;
	showMap?: boolean;
	showOffices?: boolean;
}

const ContactSectionSchema = new Schema<IContactSection>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		showContactForm: { type: Boolean, default: true },
		showMap: { type: Boolean, default: true },
		showOffices: { type: Boolean, default: true },
	},
	{ _id: false }
);

// ============================================================================
// STATS SECTION (Number Counting)
// ============================================================================
export interface IStatItem {
	image?: string;
	value: string;
	label: string;
	description?: string;
}

export interface IStatsSection {
	backgroundColor?: string;
	items?: IStatItem[];
}

const StatItemSchema = new Schema<IStatItem>(
	{
		image: { type: String, trim: true },
		value: { type: String, trim: true },
		label: { type: String, trim: true },
		description: { type: String, trim: true },
	},
	{ _id: false }
);

const StatsSectionSchema = new Schema<IStatsSection>(
	{
		backgroundColor: { type: String, trim: true },
		items: { type: [StatItemSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// IMAGE DESCRIPTION SECTION (Image + Text with Watermark)
// ============================================================================
export interface IImageDescriptionItem {
	image?: string;
	title?: string;
	description?: string;
	watermarkImage?: string;
}

export interface IImageDescriptionSection {
	backgroundColor?: string;
	items?: IImageDescriptionItem[];
}

const ImageDescriptionItemSchema = new Schema<IImageDescriptionItem>(
	{
		image: { type: String, trim: true },
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		watermarkImage: { type: String, trim: true },
	},
	{ _id: false }
);

const ImageDescriptionSectionSchema = new Schema<IImageDescriptionSection>(
	{
		backgroundColor: { type: String, trim: true, default: "#f5f0e8" },
		items: { type: [ImageDescriptionItemSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// SEO
// ============================================================================
export interface IAboutPageSeo {
	title?: string;
	description?: string;
	ogImage?: string;
}

const AboutPageSeoSchema = new Schema<IAboutPageSeo>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		ogImage: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// MAIN ABOUT PAGE
// ============================================================================
export interface IAboutPage extends Document {
	_id: mongoose.Types.ObjectId;
	sectionVisibility: IAboutSectionVisibility;
	history: IHistorySection;
	customers: ICustomersSection;
	video: IVideoSection;
	gallery: IGallerySection;
	team: ITeamSection;
	contact: IContactSection;
	stats: IStatsSection;
	imageDescription: IImageDescriptionSection;
	seo: IAboutPageSeo;
	updatedAt: Date;
	createdAt: Date;
}

const AboutPageSchema = new Schema<IAboutPage>(
	{
		sectionVisibility: {
			type: AboutSectionVisibilitySchema,
			default: {
				history: true,
				customers: true,
				video: true,
				gallery: true,
				team: true,
				contact: true,
				stats: true,
				imageDescription: true,
			},
		},
		history: { type: HistorySectionSchema, default: {} },
		customers: { type: CustomersSectionSchema, default: {} },
		video: { type: VideoSectionSchema, default: {} },
		gallery: { type: GallerySectionSchema, default: {} },
		team: { type: TeamSectionSchema, default: {} },
		contact: { type: ContactSectionSchema, default: {} },
		stats: { type: StatsSectionSchema, default: {} },
		imageDescription: { type: ImageDescriptionSectionSchema, default: {} },
		seo: { type: AboutPageSeoSchema, default: {} },
	},
	{
		timestamps: true,
		collection: "about_page",
	}
);

// Ensure virtuals are included in JSON
AboutPageSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

AboutPageSchema.set("toObject", { virtuals: true });

/**
 * Get AboutPage Model
 */
export const getAboutPageModel = async (): Promise<Model<IAboutPage>> => {
	await connectMongoose();

	return (
		(mongoose.models.AboutPage as Model<IAboutPage>) ||
		mongoose.model<IAboutPage>("AboutPage", AboutPageSchema)
	);
};

/**
 * Export synchronous model getter for use in repositories
 */
export function getAboutPageModelSync(): Model<IAboutPage> {
	return (
		(mongoose.models.AboutPage as Model<IAboutPage>) ||
		mongoose.model<IAboutPage>("AboutPage", AboutPageSchema)
	);
}
