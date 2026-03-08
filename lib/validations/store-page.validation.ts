import { z } from "zod";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export const storeSectionVisibilitySchema = z.object({
	hero: z.boolean(),
	info: z.boolean(),
	openingHours: z.boolean(),
	map: z.boolean(),
	gallery: z.boolean(),
});

// ============================================================================
// HERO SECTION
// ============================================================================
export const storeHeroSectionSchema = z.object({
	badge: z.string().max(100).optional(),
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	backgroundImage: z.string().optional(),
});

// ============================================================================
// INFO SECTION
// ============================================================================
export const storeInfoSectionSchema = z.object({
	title: z.string().max(200).optional(),
	description: z.string().max(2000).optional(),
	image: z.string().optional(),
	features: z.array(z.string().max(200)).optional(),
});

// ============================================================================
// OPENING HOURS SECTION
// ============================================================================
export const openingHoursDaySchema = z.object({
	day: z.string().max(50).optional(),
	hours: z.string().max(100).optional(),
	isClosed: z.boolean().optional(),
});

export const storeOpeningHoursSectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	schedule: z.array(openingHoursDaySchema).optional(),
	specialNote: z.string().max(500).optional(),
});

// ============================================================================
// MAP SECTION
// ============================================================================
export const storeMapSectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	address: z.string().max(200).optional(),
	city: z.string().max(100).optional(),
	postalCode: z.string().max(20).optional(),
	country: z.string().max(100).optional(),
	phone: z.string().max(50).optional(),
	email: z.string().email().optional().or(z.literal("")),
	mapEmbedUrl: z.string().optional(),
	directions: z.string().max(1000).optional(),
});

// ============================================================================
// GALLERY SECTION
// ============================================================================
export const galleryImageSchema = z.object({
	url: z.string(),
	alt: z.string().max(200).optional(),
	caption: z.string().max(500).optional(),
});

export const storeGallerySectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	images: z.array(galleryImageSchema).optional(),
});

// ============================================================================
// SEO
// ============================================================================
export const storePageSeoSchema = z.object({
	title: z.string().max(200).optional(),
	description: z.string().max(500).optional(),
	ogImage: z.string().optional(),
});

// ============================================================================
// UPDATE SCHEMA
// ============================================================================
export const updateStorePageSchema = z.object({
	sectionVisibility: storeSectionVisibilitySchema.optional(),
	hero: storeHeroSectionSchema.optional(),
	info: storeInfoSectionSchema.optional(),
	openingHours: storeOpeningHoursSectionSchema.optional(),
	map: storeMapSectionSchema.optional(),
	gallery: storeGallerySectionSchema.optional(),
	seo: storePageSeoSchema.optional(),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================
export type StoreSectionVisibilityInput = z.infer<typeof storeSectionVisibilitySchema>;
export type StoreHeroSectionInput = z.infer<typeof storeHeroSectionSchema>;
export type StoreInfoSectionInput = z.infer<typeof storeInfoSectionSchema>;
export type OpeningHoursDayInput = z.infer<typeof openingHoursDaySchema>;
export type StoreOpeningHoursSectionInput = z.infer<typeof storeOpeningHoursSectionSchema>;
export type StoreMapSectionInput = z.infer<typeof storeMapSectionSchema>;
export type GalleryImageInput = z.infer<typeof galleryImageSchema>;
export type StoreGallerySectionInput = z.infer<typeof storeGallerySectionSchema>;
export type StorePageSeoInput = z.infer<typeof storePageSeoSchema>;
export type UpdateStorePageInput = z.infer<typeof updateStorePageSchema>;
