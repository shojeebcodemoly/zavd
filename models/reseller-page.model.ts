import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export interface IResellerSectionVisibility {
	hero: boolean;
	benefits: boolean;
	form: boolean;
}

const ResellerSectionVisibilitySchema = new Schema<IResellerSectionVisibility>(
	{
		hero: { type: Boolean, default: true },
		benefits: { type: Boolean, default: true },
		form: { type: Boolean, default: true },
	},
	{ _id: false }
);

// ============================================================================
// HERO SECTION
// ============================================================================
export interface IResellerHeroSection {
	badge?: string;
	title?: string;
	titleHighlight?: string;
	subtitle?: string;
	backgroundImage?: string;
}

const ResellerHeroSectionSchema = new Schema<IResellerHeroSection>(
	{
		badge: { type: String, trim: true },
		title: { type: String, trim: true },
		titleHighlight: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		backgroundImage: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// BENEFITS SECTION
// ============================================================================
export interface IResellerBenefit {
	icon: string;
	title: string;
	description: string;
}

export interface IResellerBenefitsSection {
	title?: string;
	subtitle?: string;
	benefits?: IResellerBenefit[];
}

const ResellerBenefitSchema = new Schema<IResellerBenefit>(
	{
		icon: { type: String, trim: true, default: "CheckCircle" },
		title: { type: String, trim: true },
		description: { type: String, trim: true },
	},
	{ _id: false }
);

const ResellerBenefitsSectionSchema = new Schema<IResellerBenefitsSection>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		benefits: { type: [ResellerBenefitSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// FORM SECTION
// ============================================================================
export interface IResellerFormSection {
	title?: string;
	subtitle?: string;
	successMessage?: string;
	successDescription?: string;
}

const ResellerFormSectionSchema = new Schema<IResellerFormSection>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		successMessage: { type: String, trim: true },
		successDescription: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// SEO
// ============================================================================
export interface IResellerPageSeo {
	title?: string;
	description?: string;
	ogImage?: string;
}

const ResellerPageSeoSchema = new Schema<IResellerPageSeo>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		ogImage: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// MAIN RESELLER PAGE
// ============================================================================
export interface IResellerPage extends Document {
	_id: mongoose.Types.ObjectId;
	sectionVisibility: IResellerSectionVisibility;
	hero: IResellerHeroSection;
	benefits: IResellerBenefitsSection;
	formSection: IResellerFormSection;
	seo: IResellerPageSeo;
	updatedAt: Date;
	createdAt: Date;
}

const ResellerPageSchema = new Schema<IResellerPage>(
	{
		sectionVisibility: {
			type: ResellerSectionVisibilitySchema,
			default: {
				hero: true,
				benefits: true,
				form: true,
			},
		},
		hero: {
			type: ResellerHeroSectionSchema,
			default: {
				badge: "Partnerskap",
				title: "Bli Vår Återförsäljare",
				titleHighlight: "Återförsäljare",
				subtitle: "Är du intresserad av att erbjuda våra premium ostprodukter till dina kunder? Fyll i formuläret nedan så kontaktar vi dig för att diskutera ett partnerskap.",
			},
		},
		benefits: {
			type: ResellerBenefitsSectionSchema,
			default: {
				title: "Fördelar Med Att Bli Partner",
				subtitle: "Som återförsäljare får du tillgång till en rad fördelar som hjälper dig att lyckas.",
				benefits: [
					{
						icon: "CheckCircle",
						title: "Premium Produkter",
						description: "Tillgång till vårt kompletta sortiment av hantverksmässigt tillverkade ostprodukter.",
					},
					{
						icon: "TrendingUp",
						title: "Konkurrenskraftiga Marginaler",
						description: "Attraktiva villkor och marginaler som ger dig möjlighet att bygga en lönsam verksamhet.",
					},
					{
						icon: "Users",
						title: "Dedikerat Stöd",
						description: "Personlig support och marknadsföringsmaterial för att hjälpa dig lyckas.",
					},
					{
						icon: "Handshake",
						title: "Långsiktigt Partnerskap",
						description: "Vi tror på att bygga starka, långsiktiga relationer med våra återförsäljare.",
					},
				],
			},
		},
		formSection: {
			type: ResellerFormSectionSchema,
			default: {
				title: "Ansök Nu",
				subtitle: "Fyll i formuläret nedan så återkommer vi till dig inom kort.",
				successMessage: "Tack för din ansökan!",
				successDescription: "Vi har mottagit din återförsäljaransökan och granskar den noggrant. Vi återkommer till dig inom några arbetsdagar.",
			},
		},
		seo: {
			type: ResellerPageSeoSchema,
			default: {
				title: "Bli Återförsäljare - Boxholm Cheese",
				description: "Ansök om att bli återförsäljare för Boxholm Cheese. Samarbeta med oss och erbjud våra premium ostprodukter till dina kunder.",
			},
		},
	},
	{
		timestamps: true,
		collection: "reseller_page",
	}
);

// Ensure virtuals are included in JSON
ResellerPageSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

ResellerPageSchema.set("toObject", { virtuals: true });

/**
 * Get ResellerPage Model
 */
export const getResellerPageModel = async (): Promise<Model<IResellerPage>> => {
	await connectMongoose();

	return (
		(mongoose.models.ResellerPage as Model<IResellerPage>) ||
		mongoose.model<IResellerPage>("ResellerPage", ResellerPageSchema)
	);
};

/**
 * Export synchronous model getter for use in repositories
 */
export function getResellerPageModelSync(): Model<IResellerPage> {
	return (
		(mongoose.models.ResellerPage as Model<IResellerPage>) ||
		mongoose.model<IResellerPage>("ResellerPage", ResellerPageSchema)
	);
}
