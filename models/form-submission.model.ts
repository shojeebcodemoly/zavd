import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

/**
 * Form submission types
 */
export type FormSubmissionType =
	| "product_inquiry"
	| "training_inquiry"
	| "contact"
	| "demo_request"
	| "quote_request"
	| "callback_request"
	| "tour_request"
	| "reseller_application"
	| "subscriber";

/**
 * Form submission status
 */
export type FormSubmissionStatus = "new" | "read" | "archived";

/**
 * Help type options for product inquiry
 */
export type HelpType =
	| "clinic_buy"
	| "start_business"
	| "just_interested"
	| "buy_contact";

/**
 * Training interest options for training inquiry
 */
export type TrainingInterestType =
	| "machine_purchase"
	| "already_customer"
	| "certification_info"
	| "general_info";

/**
 * Metadata interface
 */
export interface IFormSubmissionMetadata {
	ipAddress: string;
	userAgent: string;
	referrer?: string;
	pageUrl: string;
	locale?: string;
	submittedAt: Date;
}

/**
 * Form submission interface
 */
export interface IFormSubmission extends Document {
	_id: mongoose.Types.ObjectId;

	// Form Type Discriminator
	type: FormSubmissionType;

	// Common Fields
	fullName: string;
	email: string;
	phone: string;
	countryCode: string;
	countryName: string;
	corporationNumber?: string;
	message?: string;

	// Consent Fields
	gdprConsent: boolean;
	gdprConsentTimestamp: Date;
	gdprConsentVersion?: string;
	marketingConsent?: boolean;

	// Status & Management
	status: FormSubmissionStatus;
	readAt?: Date;
	readBy?: mongoose.Types.ObjectId;

	// Product Inquiry Specific
	productId?: mongoose.Types.ObjectId;
	productName?: string;
	productSlug?: string;
	helpType?: HelpType;

	// Training Inquiry Specific
	trainingInterestType?: TrainingInterestType;

	// Contact Inquiry Specific
	subject?: string;

	// Callback Request Specific
	preferredDate?: Date;
	preferredTime?: string;

	// Metadata
	metadata: IFormSubmissionMetadata;

	// Timestamps
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Metadata Schema
 */
const MetadataSchema = new Schema<IFormSubmissionMetadata>(
	{
		ipAddress: {
			type: String,
			required: true,
			default: "unknown",
		},
		userAgent: {
			type: String,
			required: true,
			default: "unknown",
		},
		referrer: {
			type: String,
			default: null,
		},
		pageUrl: {
			type: String,
			required: true,
		},
		locale: {
			type: String,
			default: null,
		},
		submittedAt: {
			type: Date,
			required: true,
			default: Date.now,
		},
	},
	{ _id: false }
);

/**
 * Form Submission Schema
 */
const FormSubmissionSchema = new Schema<IFormSubmission>(
	{
		// Form Type
		type: {
			type: String,
			enum: ["product_inquiry", "training_inquiry", "contact", "demo_request", "quote_request", "callback_request", "tour_request", "reseller_application", "subscriber"],
			required: [true, "Form type is required"],
			index: true,
		},

		// Common Fields
		fullName: {
			type: String,
			required: [true, "Full name is required"],
			trim: true,
			maxlength: [100, "Full name cannot exceed 100 characters"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			trim: true,
			lowercase: true,
			maxlength: [255, "Email cannot exceed 255 characters"],
		},
		phone: {
			type: String,
			required: [true, "Phone number is required"],
			trim: true,
			maxlength: [20, "Phone number cannot exceed 20 characters"],
		},
		countryCode: {
			type: String,
			required: [true, "Country code is required"],
			trim: true,
			maxlength: [10, "Country code cannot exceed 10 characters"],
		},
		countryName: {
			type: String,
			required: [true, "Country name is required"],
			trim: true,
			maxlength: [100, "Country name cannot exceed 100 characters"],
		},
		corporationNumber: {
			type: String,
			trim: true,
			maxlength: [30, "Corporation number cannot exceed 30 characters"],
			default: null,
		},
		message: {
			type: String,
			trim: true,
			maxlength: [2000, "Message cannot exceed 2000 characters"],
			default: null,
		},

		// Consent Fields
		gdprConsent: {
			type: Boolean,
			required: [true, "GDPR consent is required"],
		},
		gdprConsentTimestamp: {
			type: Date,
			required: true,
			default: Date.now,
		},
		gdprConsentVersion: {
			type: String,
			default: "1.0",
		},
		marketingConsent: {
			type: Boolean,
			default: false,
		},

		// Status & Management
		status: {
			type: String,
			enum: ["new", "read", "archived"],
			default: "new",
			index: true,
		},
		readAt: {
			type: Date,
			default: null,
		},
		readBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},

		// Product Inquiry Specific
		productId: {
			type: Schema.Types.ObjectId,
			ref: "Product",
			default: null,
			index: true,
		},
		productName: {
			type: String,
			trim: true,
			maxlength: [200, "Product name cannot exceed 200 characters"],
			default: null,
		},
		productSlug: {
			type: String,
			trim: true,
			maxlength: [200, "Product slug cannot exceed 200 characters"],
			default: null,
		},
		helpType: {
			type: String,
			enum: [
				"clinic_buy",
				"start_business",
				"just_interested",
				"buy_contact",
			],
			default: null,
		},

		// Training Inquiry Specific
		trainingInterestType: {
			type: String,
			enum: [
				"machine_purchase",
				"already_customer",
				"certification_info",
				"general_info",
			],
			default: null,
		},

		// Contact Inquiry Specific
		subject: {
			type: String,
			trim: true,
			maxlength: [200, "Subject cannot exceed 200 characters"],
			default: null,
		},

		// Callback Request Specific
		preferredDate: {
			type: Date,
			default: null,
		},
		preferredTime: {
			type: String,
			trim: true,
			maxlength: [10, "Time cannot exceed 10 characters"],
			default: null,
		},

		// Metadata
		metadata: {
			type: MetadataSchema,
			required: true,
		},
	},
	{
		timestamps: true,
		collection: "form_submissions",
	}
);

// Compound indexes for performance
FormSubmissionSchema.index({ type: 1, status: 1, createdAt: -1 });
FormSubmissionSchema.index({ email: 1, createdAt: -1 });
FormSubmissionSchema.index({ status: 1, createdAt: -1 });
FormSubmissionSchema.index({ "metadata.ipAddress": 1, createdAt: -1 });

// Text index for search
FormSubmissionSchema.index({
	fullName: "text",
	email: "text",
	phone: "text",
	productName: "text",
});

// Ensure virtuals are included in JSON
FormSubmissionSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

FormSubmissionSchema.set("toObject", { virtuals: true });

/**
 * Get FormSubmission Model
 */
export const getFormSubmissionModel = async (): Promise<
	Model<IFormSubmission>
> => {
	await connectMongoose();

	return (
		(mongoose.models.FormSubmission as Model<IFormSubmission>) ||
		mongoose.model<IFormSubmission>("FormSubmission", FormSubmissionSchema)
	);
};

/**
 * Synchronous model getter
 */
export function getFormSubmissionModelSync(): Model<IFormSubmission> {
	return (
		(mongoose.models.FormSubmission as Model<IFormSubmission>) ||
		mongoose.model<IFormSubmission>("FormSubmission", FormSubmissionSchema)
	);
}
