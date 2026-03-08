import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

/**
 * Form submission types
 */
export const formSubmissionTypes = [
	"product_inquiry",
	"training_inquiry",
	"contact",
	"demo_request",
	"quote_request",
	"callback_request",
	"tour_request",
	"reseller_application",
	"subscriber",
] as const;

/**
 * Form submission status
 */
export const formSubmissionStatuses = ["new", "read", "archived"] as const;

/**
 * Help type options for product inquiry
 */
export const helpTypes = [
	"restaurant_buy",
	"wholesale",
	"just_interested",
	"private_buy",
] as const;

/**
 * Help type labels (Swedish)
 */
export const helpTypeLabels: Record<(typeof helpTypes)[number], string> = {
	restaurant_buy: "Jag driver en restaurang/butik och vill köpa denna ost",
	wholesale: "Jag är intresserad av grossistpriser",
	just_interested: "Jag vill bara veta mer om produkten",
	private_buy: "Jag vill köpa för privat bruk",
};

/**
 * Training interest type options for training inquiry
 */
export const trainingInterestTypes = [
	"cheese_making",
	"already_customer",
	"tasting_event",
	"general_info",
] as const;

/**
 * Training interest type labels (Swedish)
 */
export const trainingInterestTypeLabels: Record<
	(typeof trainingInterestTypes)[number],
	string
> = {
	cheese_making: "Jag vill lära mig mer om osttillverkning",
	already_customer: "Jag är redan kund och vill boka provning",
	tasting_event: "Jag vill veta mer om ostprovningar och event",
	general_info: "Jag vill ha allmän information om era produkter",
};

/**
 * Base form fields shared across all form types
 */
const baseFormFields = {
	fullName: z
		.string()
		.min(2, "Namnet måste vara minst 2 tecken")
		.max(100, "Namnet får inte överstiga 100 tecken")
		.trim(),

	email: z
		.string()
		.email("Ange en giltig e-postadress")
		.max(255, "E-postadressen får inte överstiga 255 tecken")
		.trim()
		.toLowerCase(),

	countryCode: z
		.string()
		.min(2, "Landskod krävs")
		.max(10, "Ogiltig landskod")
		.regex(/^\+\d{1,4}$/, "Ogiltig landskod"),

	countryName: z
		.string()
		.min(2, "Land krävs")
		.max(100, "Landets namn får inte överstiga 100 tecken")
		.trim(),

	phone: z
		.string()
		.min(6, "Telefonnummer måste vara minst 6 siffror")
		.max(20, "Telefonnummer får inte överstiga 20 siffror")
		.regex(
			/^[0-9\s\-]+$/,
			"Endast siffror, mellanslag och bindestreck tillåtna"
		)
		.trim(),

	corporationNumber: z
		.string()
		.max(30, "Organisationsnummer får inte överstiga 30 tecken")
		.trim()
		.optional()
		.or(z.literal("")),

	message: z
		.string()
		.max(2000, "Meddelandet får inte överstiga 2000 tecken")
		.trim()
		.optional()
		.or(z.literal("")),

	gdprConsent: z
		.boolean()
		.refine((val) => val === true, "Du måste godkänna integritetspolicyn"),

	marketingConsent: z.boolean().optional(),
};

/**
 * Product Inquiry Form Schema
 */
export const productInquirySchema = z
	.object({
		...baseFormFields,

		// Product inquiry specific fields
		helpType: z.enum(helpTypes, {
			message: "Välj hur vi kan hjälpa dig",
		}),

		// Hidden/readonly fields from product
		productId: z.string().min(1, "Produkt-ID krävs"),
		productName: z.string().min(1, "Produktnamn krävs"),
		productSlug: z.string().min(1, "Produkt-slug krävs"),
	})
	.refine(
		(data) => {
			// Validate phone number with country code
			const fullPhone = data.countryCode + data.phone.replace(/[\s\-]/g, "");
			return isValidPhoneNumber(fullPhone);
		},
		{
			message: "Ogiltigt telefonnummer för valt land",
			path: ["phone"],
		}
	);

/**
 * Contact Inquiry Form Schema
 */
export const contactInquirySchema = z
	.object({
		...baseFormFields,

		subject: z
			.string()
			.min(3, "Ämne måste vara minst 3 tecken")
			.max(200, "Ämne får inte överstiga 200 tecken")
			.trim(),

		// Override message to be required for contact form
		message: z
			.string()
			.min(10, "Meddelandet måste vara minst 10 tecken")
			.max(2000, "Meddelandet får inte överstiga 2000 tecken")
			.trim(),
	})
	.refine(
		(data) => {
			const fullPhone = data.countryCode + data.phone.replace(/[\s\-]/g, "");
			return isValidPhoneNumber(fullPhone);
		},
		{
			message: "Ogiltigt telefonnummer för valt land",
			path: ["phone"],
		}
	);

/**
 * Training Inquiry Form Schema
 */
export const trainingInquirySchema = z
	.object({
		...baseFormFields,

		// Training inquiry specific fields
		trainingInterestType: z.enum(trainingInterestTypes, {
			message: "Välj vad du är intresserad av",
		}),
	})
	.refine(
		(data) => {
			// Validate phone number with country code
			const fullPhone = data.countryCode + data.phone.replace(/[\s\-]/g, "");
			return isValidPhoneNumber(fullPhone);
		},
		{
			message: "Ogiltigt telefonnummer för valt land",
			path: ["phone"],
		}
	);

/**
 * Callback Request Form Schema
 * Simplified schema - only phone and preferred callback time
 */
export const callbackRequestSchema = z
	.object({
		countryCode: z
			.string()
			.min(2, "Landskod krävs")
			.max(10, "Ogiltig landskod")
			.regex(/^\+\d{1,4}$/, "Ogiltig landskod"),

		phone: z
			.string()
			.min(6, "Telefonnummer måste vara minst 6 siffror")
			.max(20, "Telefonnummer får inte överstiga 20 siffror")
			.regex(
				/^[0-9\s\-]+$/,
				"Endast siffror, mellanslag och bindestreck tillåtna"
			)
			.trim(),

		preferredDate: z.string().min(1, "Välj ett datum"),
		preferredTime: z.string().min(1, "Välj en tid"),

		gdprConsent: z
			.boolean()
			.refine(
				(val) => val === true,
				"Du måste godkänna att samtalet kan spelas in"
			),
	})
	.refine(
		(data) => {
			const fullPhone = data.countryCode + data.phone.replace(/[\s\-]/g, "");
			return isValidPhoneNumber(fullPhone);
		},
		{
			message: "Ogiltigt telefonnummer för valt land",
			path: ["phone"],
		}
	);

/**
 * Form submission list query params
 */
export const formSubmissionListQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
	type: z.enum(formSubmissionTypes).optional(),
	status: z.enum(formSubmissionStatuses).optional(),
	search: z.string().optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	productId: z.string().optional(),
	sort: z
		.enum(["createdAt", "-createdAt", "fullName", "-fullName"])
		.default("-createdAt"),
});

/**
 * Update status schema
 */
export const updateStatusSchema = z.object({
	status: z.enum(["read", "archived"]),
});

/**
 * Bulk export schema
 */
export const bulkExportSchema = z.object({
	ids: z.array(z.string()).optional(),
	type: z.enum(formSubmissionTypes).optional(),
	status: z.enum(formSubmissionStatuses).optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	format: z.enum(["csv", "xlsx"]).default("csv"),
});

/**
 * Tour Request Form Schema
 * For scheduling virtual tours of facilities and equipment
 */
export const tourRequestSchema = z
	.object({
		fullName: z
			.string()
			.min(2, "Namnet måste vara minst 2 tecken")
			.max(100, "Namnet får inte överstiga 100 tecken")
			.trim(),

		email: z
			.string()
			.email("Ange en giltig e-postadress")
			.max(255, "E-postadressen får inte överstiga 255 tecken")
			.trim()
			.toLowerCase(),

		countryCode: z
			.string()
			.min(2, "Landskod krävs")
			.max(10, "Ogiltig landskod")
			.regex(/^\+\d{1,4}$/, "Ogiltig landskod"),

		phone: z
			.string()
			.min(6, "Telefonnummer måste vara minst 6 siffror")
			.max(20, "Telefonnummer får inte överstiga 20 siffror")
			.regex(
				/^[0-9\s\-]+$/,
				"Endast siffror, mellanslag och bindestreck tillåtna"
			)
			.trim(),

		message: z
			.string()
			.max(1000, "Meddelandet får inte överstiga 1000 tecken")
			.trim()
			.optional()
			.or(z.literal("")),

		gdprConsent: z
			.boolean()
			.refine((val) => val === true, "Du måste godkänna integritetspolicyn"),
	})
	.refine(
		(data) => {
			const fullPhone = data.countryCode + data.phone.replace(/[\s\-]/g, "");
			return isValidPhoneNumber(fullPhone);
		},
		{
			message: "Ogiltigt telefonnummer för valt land",
			path: ["phone"],
		}
	);

/**
 * Quote Request Form Schema
 * For requesting quotes/offers for products or services
 */
export const quoteRequestSchema = z
	.object({
		fullName: z
			.string()
			.min(2, "Namnet måste vara minst 2 tecken")
			.max(100, "Namnet får inte överstiga 100 tecken")
			.trim(),

		email: z
			.string()
			.email("Ange en giltig e-postadress")
			.max(255, "E-postadressen får inte överstiga 255 tecken")
			.trim()
			.toLowerCase(),

		countryCode: z
			.string()
			.min(2, "Landskod krävs")
			.max(10, "Ogiltig landskod")
			.regex(/^\+\d{1,4}$/, "Ogiltig landskod"),

		phone: z
			.string()
			.min(6, "Telefonnummer måste vara minst 6 siffror")
			.max(20, "Telefonnummer får inte överstiga 20 siffror")
			.regex(
				/^[0-9\s\-]+$/,
				"Endast siffror, mellanslag och bindestreck tillåtna"
			)
			.trim(),

		companyName: z
			.string()
			.max(200, "Företagsnamnet får inte överstiga 200 tecken")
			.trim()
			.optional()
			.or(z.literal("")),

		message: z
			.string()
			.max(2000, "Meddelandet får inte överstiga 2000 tecken")
			.trim()
			.optional()
			.or(z.literal("")),

		gdprConsent: z
			.boolean()
			.refine((val) => val === true, "Du måste godkänna integritetspolicyn"),
	})
	.refine(
		(data) => {
			const fullPhone = data.countryCode + data.phone.replace(/[\s\-]/g, "");
			return isValidPhoneNumber(fullPhone);
		},
		{
			message: "Ogiltigt telefonnummer för valt land",
			path: ["phone"],
		}
	);

/**
 * Reseller Application Form Schema
 * For businesses interested in becoming resellers/distributors
 */
export const resellerApplicationSchema = z
	.object({
		fullName: z
			.string()
			.min(2, "Namnet måste vara minst 2 tecken")
			.max(100, "Namnet får inte överstiga 100 tecken")
			.trim(),

		email: z
			.string()
			.email("Ange en giltig e-postadress")
			.max(255, "E-postadressen får inte överstiga 255 tecken")
			.trim()
			.toLowerCase(),

		countryCode: z
			.string()
			.min(2, "Landskod krävs")
			.max(10, "Ogiltig landskod")
			.regex(/^\+\d{1,4}$/, "Ogiltig landskod"),

		countryName: z
			.string()
			.min(2, "Land krävs")
			.max(100, "Landets namn får inte överstiga 100 tecken")
			.trim(),

		phone: z
			.string()
			.min(6, "Telefonnummer måste vara minst 6 siffror")
			.max(20, "Telefonnummer får inte överstiga 20 siffror")
			.regex(
				/^[0-9\s\-]+$/,
				"Endast siffror, mellanslag och bindestreck tillåtna"
			)
			.trim(),

		companyName: z
			.string()
			.min(2, "Företagsnamnet måste vara minst 2 tecken")
			.max(200, "Företagsnamnet får inte överstiga 200 tecken")
			.trim(),

		corporationNumber: z
			.string()
			.max(30, "Organisationsnummer får inte överstiga 30 tecken")
			.trim()
			.optional()
			.or(z.literal("")),

		businessDescription: z
			.string()
			.min(10, "Beskriv din verksamhet (minst 10 tecken)")
			.max(1000, "Beskrivningen får inte överstiga 1000 tecken")
			.trim(),

		message: z
			.string()
			.max(2000, "Meddelandet får inte överstiga 2000 tecken")
			.trim()
			.optional()
			.or(z.literal("")),

		gdprConsent: z
			.boolean()
			.refine((val) => val === true, "Du måste godkänna integritetspolicyn"),

		marketingConsent: z.boolean().optional(),
	})
	.refine(
		(data) => {
			const fullPhone = data.countryCode + data.phone.replace(/[\s\-]/g, "");
			return isValidPhoneNumber(fullPhone);
		},
		{
			message: "Ogiltigt telefonnummer för valt land",
			path: ["phone"],
		}
	);

/**
 * Subscriber Schema
 * For newsletter/coming-soon email signups — only email required
 */
export const subscriberSchema = z.object({
	email: z
		.string()
		.email("Ange en giltig e-postadress")
		.max(255, "E-postadressen får inte överstiga 255 tecken")
		.trim()
		.toLowerCase(),
});

// Type exports
export type ProductInquiryInput = z.infer<typeof productInquirySchema>;
export type TrainingInquiryInput = z.infer<typeof trainingInquirySchema>;
export type ContactInquiryInput = z.infer<typeof contactInquirySchema>;
export type CallbackRequestInput = z.infer<typeof callbackRequestSchema>;
export type TourRequestInput = z.infer<typeof tourRequestSchema>;
export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
export type ResellerApplicationInput = z.infer<typeof resellerApplicationSchema>;
export type FormSubmissionListQuery = z.infer<
	typeof formSubmissionListQuerySchema
>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type BulkExportInput = z.infer<typeof bulkExportSchema>;
export type SubscriberInput = z.infer<typeof subscriberSchema>;
