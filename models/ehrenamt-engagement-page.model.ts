import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ─── Hero Section ────────────────────────────────────────────────────────────
export interface IEhrenamtEngagementHero {
	backgroundImage?: string;
	titleDe?: string;
	titleEn?: string;
	breadcrumb?: string;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export interface IEhrenamtEngagementPage {
	hero: IEhrenamtEngagementHero;
}

// ─── Document ─────────────────────────────────────────────────────────────────
export interface IEhrenamtEngagementPageDocument
	extends IEhrenamtEngagementPage,
		Document {}

// ─── Schemas ──────────────────────────────────────────────────────────────────
const heroSchema = new Schema<IEhrenamtEngagementHero>(
	{
		backgroundImage: { type: String, default: "" },
		titleDe: { type: String, default: "Ehrenamt & Engagement" },
		titleEn: { type: String, default: "Volunteering" },
		breadcrumb: { type: String, default: "Ehrenamt & Engagement" },
	},
	{ _id: false }
);

const ehrenamtEngagementPageSchema =
	new Schema<IEhrenamtEngagementPageDocument>(
		{
			hero: { type: heroSchema, default: () => ({}) },
		},
		{ timestamps: true }
	);

// ─── Model (singleton) ────────────────────────────────────────────────────────
let EhrenamtEngagementPageModel: Model<IEhrenamtEngagementPageDocument> | null =
	null;

export async function getEhrenamtEngagementPageModel(): Promise<
	Model<IEhrenamtEngagementPageDocument>
> {
	await connectMongoose();
	return getEhrenamtEngagementPageModelSync();
}

export function getEhrenamtEngagementPageModelSync(): Model<IEhrenamtEngagementPageDocument> {
	if (!EhrenamtEngagementPageModel) {
		if (process.env.NODE_ENV !== "production") {
			delete mongoose.models.EhrenamtEngagementPage;
		}
		EhrenamtEngagementPageModel =
			(mongoose.models
				.EhrenamtEngagementPage as Model<IEhrenamtEngagementPageDocument>) ||
			mongoose.model<IEhrenamtEngagementPageDocument>(
				"EhrenamtEngagementPage",
				ehrenamtEngagementPageSchema
			);
	}
	return EhrenamtEngagementPageModel;
}
