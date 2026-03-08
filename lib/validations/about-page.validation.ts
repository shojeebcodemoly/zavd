import { z } from "zod";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export const aboutSectionVisibilitySchema = z.object({
	history: z.boolean().optional(),
	customers: z.boolean().optional(),
	video: z.boolean().optional(),
	gallery: z.boolean().optional(),
	team: z.boolean().optional(),
	contact: z.boolean().optional(),
	stats: z.boolean().optional(),
	imageDescription: z.boolean().optional(),
});

// ============================================================================
// HISTORY SECTION (Timeline)
// ============================================================================
export const historyTimelineItemSchema = z.object({
	year: z.string().max(20).optional(),
	title: z.string().max(200).optional(),
	description: z.string().max(2000).optional(),
	image: z.string().optional(),
});

export const historySectionSchema = z.object({
	badge: z.string().max(100).optional(),
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	timelineItems: z.array(historyTimelineItemSchema).optional(),
});

// ============================================================================
// CUSTOMERS SECTION
// ============================================================================
export const customerItemSchema = z.object({
	name: z.string().max(200).optional(),
	logo: z.string().optional(),
	products: z.string().max(500).optional(),
	description: z.string().max(1000).optional(),
	website: z.string().optional(),
});

export const customersSectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	customers: z.array(customerItemSchema).optional(),
});

// ============================================================================
// TEAM SECTION
// ============================================================================
export const teamMemberSchema = z.object({
	name: z.string().max(100).optional(),
	role: z.string().max(100).optional(),
	image: z.string().optional(),
	email: z.string().email().optional().or(z.literal("")),
	phone: z.string().max(50).optional(),
	linkedin: z.string().optional(),
	department: z.string().max(100).optional(),
	bio: z.string().max(1000).optional(),
});

export const teamSectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	members: z.array(teamMemberSchema).optional(),
});

// ============================================================================
// VIDEO SECTION
// ============================================================================
export const videoSectionSchema = z.object({
	backgroundImage: z.string().optional(),
	titleHighlighted: z.string().max(200).optional(),
	titleNormal: z.string().max(200).optional(),
	videoUrl: z.string().optional(),
	buttonLabel: z.string().max(100).optional(),
});

// ============================================================================
// GALLERY SECTION
// ============================================================================
export const galleryImageSchema = z.object({
	src: z.string().optional(),
	alt: z.string().max(200).optional(),
});

export const gallerySectionSchema = z.object({
	backgroundImage: z.string().optional(),
	backgroundColor: z.string().optional(),
	title: z.string().max(500).optional(),
	images: z.array(galleryImageSchema).optional(),
});

// ============================================================================
// CONTACT SECTION
// ============================================================================
export const contactSectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	showContactForm: z.boolean().optional(),
	showMap: z.boolean().optional(),
	showOffices: z.boolean().optional(),
});

// ============================================================================
// STATS SECTION (Number Counting)
// ============================================================================
export const statItemSchema = z.object({
	image: z.string().optional(),
	value: z.string().max(50).optional(),
	label: z.string().max(100).optional(),
	description: z.string().max(500).optional(),
});

export const statsSectionSchema = z.object({
	backgroundColor: z.string().optional(),
	items: z.array(statItemSchema).optional(),
});

// ============================================================================
// IMAGE DESCRIPTION SECTION
// ============================================================================
export const imageDescriptionItemSchema = z.object({
	image: z.string().optional(),
	title: z.string().max(200).optional(),
	description: z.string().max(2000).optional(),
	watermarkImage: z.string().optional(),
});

export const imageDescriptionSectionSchema = z.object({
	backgroundColor: z.string().optional(),
	items: z.array(imageDescriptionItemSchema).optional(),
});

// ============================================================================
// SEO
// ============================================================================
export const aboutPageSeoSchema = z.object({
	title: z.string().max(200).optional(),
	description: z.string().max(500).optional(),
	ogImage: z.string().optional(),
});

// ============================================================================
// UPDATE SCHEMA
// ============================================================================
export const updateAboutPageSchema = z.object({
	sectionVisibility: aboutSectionVisibilitySchema.optional(),
	history: historySectionSchema.optional(),
	customers: customersSectionSchema.optional(),
	video: videoSectionSchema.optional(),
	gallery: gallerySectionSchema.optional(),
	team: teamSectionSchema.optional(),
	contact: contactSectionSchema.optional(),
	stats: statsSectionSchema.optional(),
	imageDescription: imageDescriptionSectionSchema.optional(),
	seo: aboutPageSeoSchema.optional(),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================
export type AboutSectionVisibilityInput = z.infer<typeof aboutSectionVisibilitySchema>;
export type HistoryTimelineItemInput = z.infer<typeof historyTimelineItemSchema>;
export type HistorySectionInput = z.infer<typeof historySectionSchema>;
export type CustomerItemInput = z.infer<typeof customerItemSchema>;
export type CustomersSectionInput = z.infer<typeof customersSectionSchema>;
export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
export type TeamSectionInput = z.infer<typeof teamSectionSchema>;
export type VideoSectionInput = z.infer<typeof videoSectionSchema>;
export type GalleryImageInput = z.infer<typeof galleryImageSchema>;
export type GallerySectionInput = z.infer<typeof gallerySectionSchema>;
export type ContactSectionInput = z.infer<typeof contactSectionSchema>;
export type StatItemInput = z.infer<typeof statItemSchema>;
export type StatsSectionInput = z.infer<typeof statsSectionSchema>;
export type ImageDescriptionItemInput = z.infer<typeof imageDescriptionItemSchema>;
export type ImageDescriptionSectionInput = z.infer<typeof imageDescriptionSectionSchema>;
export type AboutPageSeoInput = z.infer<typeof aboutPageSeoSchema>;
export type UpdateAboutPageInput = z.infer<typeof updateAboutPageSchema>;
