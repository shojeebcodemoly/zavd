import mongoose from "mongoose";
import { formSubmissionRepository } from "@/lib/repositories/form-submission.repository";
import {
	type IFormSubmission,
	type FormSubmissionType,
	type FormSubmissionStatus,
	type IFormSubmissionMetadata,
} from "@/models/form-submission.model";
import {
	productInquirySchema,
	trainingInquirySchema,
	contactInquirySchema,
	callbackRequestSchema,
	tourRequestSchema,
	quoteRequestSchema,
	resellerApplicationSchema,
	subscriberSchema,
	type ProductInquiryInput,
	type TrainingInquiryInput,
	type ContactInquiryInput,
	type CallbackRequestInput,
	type TourRequestInput,
	type QuoteRequestInput,
	type ResellerApplicationInput,
	type SubscriberInput,
	type FormSubmissionListQuery,
	type UpdateStatusInput,
	type BulkExportInput,
} from "@/lib/validations/form-submission.validation";
import {
	BadRequestError,
	TooManyRequestsError,
	NotFoundError,
	ValidationError,
} from "@/lib/utils/api-error";
import { logger } from "@/lib/utils/logger";
import sanitizeHtml from "sanitize-html";

/**
 * Rate limiting configuration
 */
const RATE_LIMIT = {
	windowMs: 15 * 60 * 1000, // 15 minutes
	maxRequests: 5, // Max 5 submissions per window
};

/**
 * Sanitize HTML options - strip all HTML
 */
const sanitizeOptions: sanitizeHtml.IOptions = {
	allowedTags: [],
	allowedAttributes: {},
};

/**
 * Form Submission Service
 * Handles business logic for form submissions
 */
class FormSubmissionService {
	/**
	 * Sanitize user input
	 */
	private sanitizeInput(input: string | undefined): string {
		if (!input) return "";
		return sanitizeHtml(input.trim(), sanitizeOptions);
	}

	/**
	 * Check rate limit for IP address
	 */
	async checkRateLimit(ip: string): Promise<boolean> {
		const windowStart = new Date(Date.now() - RATE_LIMIT.windowMs);
		const count = await formSubmissionRepository.countByIpInWindow(
			ip,
			windowStart
		);
		return count < RATE_LIMIT.maxRequests;
	}

	/**
	 * Create a product inquiry submission
	 */
	async createProductInquiry(
		data: ProductInquiryInput,
		metadata: Omit<IFormSubmissionMetadata, "submittedAt">
	): Promise<IFormSubmission> {
		// Validate input
		const validationResult = productInquirySchema.safeParse(data);
		if (!validationResult.success) {
			throw new ValidationError(
				"Validation failed",
				validationResult.error.issues
			);
		}

		// Check rate limit
		const withinLimit = await this.checkRateLimit(metadata.ipAddress);
		if (!withinLimit) {
			throw new TooManyRequestsError(
				"För många förfrågningar. Försök igen om 15 minuter."
			);
		}

		const validData = validationResult.data;

		// Sanitize user-provided fields
		const sanitizedData = {
			type: "product_inquiry" as FormSubmissionType,
			fullName: this.sanitizeInput(validData.fullName),
			email: validData.email.toLowerCase().trim(),
			phone: this.sanitizeInput(validData.phone),
			countryCode: validData.countryCode,
			countryName: this.sanitizeInput(validData.countryName),
			corporationNumber:
				this.sanitizeInput(validData.corporationNumber) || null,
			message: this.sanitizeInput(validData.message) || null,
			gdprConsent: validData.gdprConsent,
			gdprConsentTimestamp: new Date(),
			gdprConsentVersion: "1.0",
			marketingConsent: validData.marketingConsent || false,
			status: "new" as FormSubmissionStatus,
			productId: new mongoose.Types.ObjectId(validData.productId),
			productName: this.sanitizeInput(validData.productName),
			productSlug: validData.productSlug,
			helpType: validData.helpType,
			metadata: {
				...metadata,
				submittedAt: new Date(),
			},
		};

		const submission = await formSubmissionRepository.create(sanitizedData);

		logger.info(
			`Product inquiry created: ${submission._id} for product ${validData.productName}`
		);

		return submission;
	}

	/**
	 * Create a training inquiry submission
	 */
	async createTrainingInquiry(
		data: TrainingInquiryInput,
		metadata: Omit<IFormSubmissionMetadata, "submittedAt">
	): Promise<IFormSubmission> {
		// Validate input
		const validationResult = trainingInquirySchema.safeParse(data);
		if (!validationResult.success) {
			throw new ValidationError(
				"Validation failed",
				validationResult.error.issues
			);
		}

		// Check rate limit
		const withinLimit = await this.checkRateLimit(metadata.ipAddress);
		if (!withinLimit) {
			throw new TooManyRequestsError(
				"För många förfrågningar. Försök igen om 15 minuter."
			);
		}

		const validData = validationResult.data;

		// Sanitize user-provided fields
		const sanitizedData = {
			type: "training_inquiry" as FormSubmissionType,
			fullName: this.sanitizeInput(validData.fullName),
			email: validData.email.toLowerCase().trim(),
			phone: this.sanitizeInput(validData.phone),
			countryCode: validData.countryCode,
			countryName: this.sanitizeInput(validData.countryName),
			corporationNumber:
				this.sanitizeInput(validData.corporationNumber) || null,
			message: this.sanitizeInput(validData.message) || null,
			gdprConsent: validData.gdprConsent,
			gdprConsentTimestamp: new Date(),
			gdprConsentVersion: "1.0",
			marketingConsent: validData.marketingConsent || false,
			status: "new" as FormSubmissionStatus,
			trainingInterestType: validData.trainingInterestType,
			metadata: {
				...metadata,
				submittedAt: new Date(),
			},
		};

		const submission = await formSubmissionRepository.create(sanitizedData);

		logger.info(`Training inquiry created: ${submission._id}`);

		return submission;
	}

	/**
	 * Create a contact inquiry submission
	 */
	async createContactInquiry(
		data: ContactInquiryInput,
		metadata: Omit<IFormSubmissionMetadata, "submittedAt">
	): Promise<IFormSubmission> {
		// Validate input
		const validationResult = contactInquirySchema.safeParse(data);
		if (!validationResult.success) {
			throw new ValidationError(
				"Validation failed",
				validationResult.error.issues
			);
		}

		// Check rate limit
		const withinLimit = await this.checkRateLimit(metadata.ipAddress);
		if (!withinLimit) {
			throw new TooManyRequestsError(
				"För många förfrågningar. Försök igen om 15 minuter."
			);
		}

		const validData = validationResult.data;

		// Sanitize user-provided fields
		const sanitizedData = {
			type: "contact" as FormSubmissionType,
			fullName: this.sanitizeInput(validData.fullName),
			email: validData.email.toLowerCase().trim(),
			phone: this.sanitizeInput(validData.phone),
			countryCode: validData.countryCode,
			countryName: this.sanitizeInput(validData.countryName),
			corporationNumber:
				this.sanitizeInput(validData.corporationNumber) || null,
			subject: this.sanitizeInput(validData.subject),
			message: this.sanitizeInput(validData.message),
			gdprConsent: validData.gdprConsent,
			gdprConsentTimestamp: new Date(),
			gdprConsentVersion: "1.0",
			marketingConsent: validData.marketingConsent || false,
			status: "new" as FormSubmissionStatus,
			metadata: {
				...metadata,
				submittedAt: new Date(),
			},
		};

		const submission = await formSubmissionRepository.create(sanitizedData);

		logger.info(`Contact inquiry created: ${submission._id}`);

		return submission;
	}

	/**
	 * Create a callback request submission
	 */
	async createCallbackRequest(
		data: CallbackRequestInput,
		metadata: Omit<IFormSubmissionMetadata, "submittedAt">
	): Promise<IFormSubmission> {
		// Validate input
		const validationResult = callbackRequestSchema.safeParse(data);
		if (!validationResult.success) {
			throw new ValidationError(
				"Validation failed",
				validationResult.error.issues
			);
		}

		// Check rate limit
		const withinLimit = await this.checkRateLimit(metadata.ipAddress);
		if (!withinLimit) {
			throw new TooManyRequestsError(
				"För många förfrågningar. Försök igen om 15 minuter."
			);
		}

		const validData = validationResult.data;

		// Sanitize user-provided fields
		const sanitizedData = {
			type: "callback_request" as FormSubmissionType,
			fullName: "Callback Request",
			email: "callback@synos.se",
			phone: this.sanitizeInput(validData.phone),
			countryCode: validData.countryCode,
			countryName: "Sweden",
			gdprConsent: validData.gdprConsent,
			gdprConsentTimestamp: new Date(),
			gdprConsentVersion: "1.0",
			status: "new" as FormSubmissionStatus,
			preferredDate: new Date(validData.preferredDate),
			preferredTime: validData.preferredTime,
			metadata: {
				...metadata,
				submittedAt: new Date(),
			},
		};

		const submission = await formSubmissionRepository.create(sanitizedData);

		logger.info(`Callback request created: ${submission._id}`);

		return submission;
	}

	/**
	 * Create a tour request submission
	 */
	async createTourRequest(
		data: TourRequestInput,
		metadata: Omit<IFormSubmissionMetadata, "submittedAt">
	): Promise<IFormSubmission> {
		// Validate input
		const validationResult = tourRequestSchema.safeParse(data);
		if (!validationResult.success) {
			throw new ValidationError(
				"Validation failed",
				validationResult.error.issues
			);
		}

		// Check rate limit
		const withinLimit = await this.checkRateLimit(metadata.ipAddress);
		if (!withinLimit) {
			throw new TooManyRequestsError(
				"För många förfrågningar. Försök igen om 15 minuter."
			);
		}

		const validData = validationResult.data;

		// Sanitize user-provided fields
		const sanitizedData = {
			type: "tour_request" as FormSubmissionType,
			fullName: this.sanitizeInput(validData.fullName),
			email: validData.email.toLowerCase().trim(),
			phone: this.sanitizeInput(validData.phone),
			countryCode: validData.countryCode,
			countryName: "Sweden",
			message: this.sanitizeInput(validData.message) || null,
			gdprConsent: validData.gdprConsent,
			gdprConsentTimestamp: new Date(),
			gdprConsentVersion: "1.0",
			status: "new" as FormSubmissionStatus,
			metadata: {
				...metadata,
				submittedAt: new Date(),
			},
		};

		const submission = await formSubmissionRepository.create(sanitizedData);

		logger.info(`Tour request created: ${submission._id}`);

		return submission;
	}

	/**
	 * Create a quote request submission
	 */
	async createQuoteRequest(
		data: QuoteRequestInput,
		metadata: Omit<IFormSubmissionMetadata, "submittedAt">
	): Promise<IFormSubmission> {
		// Validate input
		const validationResult = quoteRequestSchema.safeParse(data);
		if (!validationResult.success) {
			throw new ValidationError(
				"Validation failed",
				validationResult.error.issues
			);
		}

		// Check rate limit
		const withinLimit = await this.checkRateLimit(metadata.ipAddress);
		if (!withinLimit) {
			throw new TooManyRequestsError(
				"För många förfrågningar. Försök igen om 15 minuter."
			);
		}

		const validData = validationResult.data;

		// Sanitize user-provided fields
		const sanitizedData = {
			type: "quote_request" as FormSubmissionType,
			fullName: this.sanitizeInput(validData.fullName),
			email: validData.email.toLowerCase().trim(),
			phone: this.sanitizeInput(validData.phone),
			countryCode: validData.countryCode,
			countryName: "Sweden",
			corporationNumber: this.sanitizeInput(validData.companyName) || null,
			message: this.sanitizeInput(validData.message) || null,
			gdprConsent: validData.gdprConsent,
			gdprConsentTimestamp: new Date(),
			gdprConsentVersion: "1.0",
			status: "new" as FormSubmissionStatus,
			metadata: {
				...metadata,
				submittedAt: new Date(),
			},
		};

		const submission = await formSubmissionRepository.create(sanitizedData);

		logger.info(`Quote request created: ${submission._id}`);

		return submission;
	}

	/**
	 * Create a reseller application submission
	 */
	async createResellerApplication(
		data: ResellerApplicationInput,
		metadata: Omit<IFormSubmissionMetadata, "submittedAt">
	): Promise<IFormSubmission> {
		// Validate input
		const validationResult = resellerApplicationSchema.safeParse(data);
		if (!validationResult.success) {
			throw new ValidationError(
				"Validation failed",
				validationResult.error.issues
			);
		}

		// Check rate limit
		const withinLimit = await this.checkRateLimit(metadata.ipAddress);
		if (!withinLimit) {
			throw new TooManyRequestsError(
				"För många förfrågningar. Försök igen om 15 minuter."
			);
		}

		const validData = validationResult.data;

		// Sanitize user-provided fields
		const sanitizedData = {
			type: "reseller_application" as FormSubmissionType,
			fullName: this.sanitizeInput(validData.fullName),
			email: validData.email.toLowerCase().trim(),
			phone: this.sanitizeInput(validData.phone),
			countryCode: validData.countryCode,
			countryName: this.sanitizeInput(validData.countryName),
			corporationNumber: this.sanitizeInput(validData.corporationNumber) || null,
			// Store company name in productName field for display in admin
			productName: this.sanitizeInput(validData.companyName),
			// Store business description in subject field
			subject: this.sanitizeInput(validData.businessDescription),
			message: this.sanitizeInput(validData.message) || null,
			gdprConsent: validData.gdprConsent,
			gdprConsentTimestamp: new Date(),
			gdprConsentVersion: "1.0",
			marketingConsent: validData.marketingConsent || false,
			status: "new" as FormSubmissionStatus,
			metadata: {
				...metadata,
				submittedAt: new Date(),
			},
		};

		const submission = await formSubmissionRepository.create(sanitizedData);

		logger.info(`Reseller application created: ${submission._id} from ${validData.companyName}`);

		return submission;
	}

	/**
	 * Create a newsletter subscriber submission
	 */
	async createSubscriber(
		data: SubscriberInput,
		metadata: Omit<IFormSubmissionMetadata, "submittedAt">
	): Promise<IFormSubmission> {
		const validationResult = subscriberSchema.safeParse(data);
		if (!validationResult.success) {
			throw new ValidationError(
				"Validation failed",
				validationResult.error.issues
			);
		}

		const withinLimit = await this.checkRateLimit(metadata.ipAddress);
		if (!withinLimit) {
			throw new TooManyRequestsError(
				"För många förfrågningar. Försök igen om 15 minuter."
			);
		}

		const validData = validationResult.data;

		const sanitizedData = {
			type: "subscriber" as FormSubmissionType,
			fullName: "Subscriber",
			email: validData.email.toLowerCase().trim(),
			phone: "000000",
			countryCode: "+46",
			countryName: "Unknown",
			gdprConsent: true,
			gdprConsentTimestamp: new Date(),
			gdprConsentVersion: "1.0",
			status: "new" as FormSubmissionStatus,
			metadata: {
				...metadata,
				submittedAt: new Date(),
			},
		};

		const submission = await formSubmissionRepository.create(sanitizedData);

		logger.info(`Subscriber created: ${submission._id} (${validData.email})`);

		return submission;
	}

	/**
	 * Get submissions with filters (admin only)
	 */
	async getSubmissions(query: FormSubmissionListQuery): Promise<{
		data: IFormSubmission[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		return formSubmissionRepository.findWithFilters({
			page: query.page,
			limit: query.limit,
			type: query.type,
			status: query.status,
			search: query.search,
			dateFrom: query.dateFrom,
			dateTo: query.dateTo,
			productId: query.productId,
			sort: query.sort,
		});
	}

	/**
	 * Get a single submission by ID (admin only)
	 */
	async getSubmissionById(id: string): Promise<IFormSubmission> {
		const submission = await formSubmissionRepository.findById(id);

		if (!submission) {
			throw new NotFoundError("Submission not found");
		}

		return submission;
	}

	/**
	 * Update submission status (admin only)
	 */
	async updateStatus(
		id: string,
		data: UpdateStatusInput,
		userId: string
	): Promise<IFormSubmission> {
		const submission = await formSubmissionRepository.findById(id);

		if (!submission) {
			throw new NotFoundError("Submission not found");
		}

		const updated = await formSubmissionRepository.updateStatus(
			id,
			data.status,
			userId
		);

		if (!updated) {
			throw new BadRequestError("Failed to update submission status");
		}

		logger.info(
			`Submission ${id} status updated to ${data.status} by user ${userId}`
		);

		return updated;
	}

	/**
	 * Bulk update status (admin only)
	 */
	async bulkUpdateStatus(
		ids: string[],
		status: FormSubmissionStatus,
		userId: string
	): Promise<number> {
		if (!ids || ids.length === 0) {
			throw new BadRequestError("No submission IDs provided");
		}

		const count = await formSubmissionRepository.bulkUpdateStatus(
			ids,
			status,
			userId
		);

		logger.info(
			`Bulk status update: ${count} submissions updated to ${status} by user ${userId}`
		);

		return count;
	}

	/**
	 * Delete a submission (admin only)
	 */
	async deleteSubmission(id: string): Promise<void> {
		const submission = await formSubmissionRepository.findById(id);

		if (!submission) {
			throw new NotFoundError("Submission not found");
		}

		await formSubmissionRepository.deleteById(id);

		logger.info(`Submission ${id} deleted`);
	}

	/**
	 * Get submissions for export (admin only)
	 */
	async getForExport(
		options: Omit<BulkExportInput, "format">
	): Promise<IFormSubmission[]> {
		return formSubmissionRepository.getForExport({
			ids: options.ids,
			type: options.type,
			status: options.status,
			dateFrom: options.dateFrom,
			dateTo: options.dateTo,
		});
	}

	/**
	 * Get dashboard statistics (admin only)
	 */
	async getStats(): Promise<{
		total: number;
		new: number;
		read: number;
		archived: number;
		byType: Record<string, number>;
	}> {
		return formSubmissionRepository.getStats();
	}

	/**
	 * Export submissions to CSV format
	 */
	exportToCsv(submissions: IFormSubmission[]): string {
		const headers = [
			"ID",
			"Type",
			"Status",
			"Full Name",
			"Email",
			"Country Code",
			"Country",
			"Phone",
			"Corporation Number",
			"Message",
			"Product Name",
			"Help Type",
			"GDPR Consent",
			"Created At",
			"IP Address",
		];

		const rows = submissions.map((s) => [
			s._id.toString(),
			s.type,
			s.status,
			`"${s.fullName.replace(/"/g, '""')}"`,
			s.email,
			s.countryCode,
			s.countryName,
			s.phone,
			s.corporationNumber || "",
			`"${(s.message || "").replace(/"/g, '""')}"`,
			s.productName || "",
			s.helpType || "",
			s.gdprConsent ? "Yes" : "No",
			s.createdAt.toISOString(),
			s.metadata.ipAddress,
		]);

		return [headers.join(","), ...rows.map((row) => row.join(","))].join(
			"\n"
		);
	}
}

export const formSubmissionService = new FormSubmissionService();
