import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

export interface IZavdSpendenkontoHero {
	taglineDe?: string;
	taglineEn?: string;
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	image?: string;
}

const ZavdSpendenkontoHeroSchema = new Schema<IZavdSpendenkontoHero>(
	{
		taglineDe: { type: String, default: "ZAVD Verband" },
		taglineEn: { type: String, default: "ZAVD Association" },
		titleDe: { type: String, default: "ZAVD Spendenkonto" },
		titleEn: { type: String, default: "ZAVD Donation Account" },
		subtitleDe: { type: String, default: "Unterstützen Sie die Bildungs-, Integrations- und Kulturarbeit des ZAVD in Deutschland und Europa." },
		subtitleEn: { type: String, default: "Support the educational, integration and cultural work of ZAVD in Germany and Europe." },
		image: { type: String, default: "/images/donate/Association1.jpg" },
	},
	{ _id: false }
);

export interface IZavdSpendenkontoLeft {
	sectionTitleDe?: string;
	sectionTitleEn?: string;
	donationArrivesTitleDe?: string;
	donationArrivesTitleEn?: string;
	transparencyTitleDe?: string;
	transparencyTitleEn?: string;
	transparencyTextDe?: string;
	transparencyTextEn?: string;
	certificateTitleDe?: string;
	certificateTitleEn?: string;
	certificateText1De?: string;
	certificateText1En?: string;
	certificateText2De?: string;
	certificateText2En?: string;
	certificateLinkDe?: string;
	certificateLinkEn?: string;
	certificateText3De?: string;
	certificateText3En?: string;
	certificateText4De?: string;
	certificateText4En?: string;
}

const ZavdSpendenkontoLeftSchema = new Schema<IZavdSpendenkontoLeft>(
	{
		sectionTitleDe: { type: String, default: "Spendenkonto - ZAVD Verband" },
		sectionTitleEn: { type: String, default: "Donation Account - ZAVD Association" },
		donationArrivesTitleDe: { type: String, default: "Ihre Spende kommt an!" },
		donationArrivesTitleEn: { type: String, default: "Your donation arrives!" },
		transparencyTitleDe: { type: String, default: "Spendentransparenz" },
		transparencyTitleEn: { type: String, default: "Donation Transparency" },
		transparencyTextDe: { type: String, default: "ZAVD e.V. ist als eingetragene gemeinnützige Organisation von Körperschaft- und Gewerbesteuer befreit. Ihre Spende ist steuerlich absetzbar. Steuernummer: 103/111/70053" },
		transparencyTextEn: { type: String, default: "ZAVD e.V. is a registered non-profit organization exempt from corporate and trade tax. Your donation is tax-deductible. Tax number: 103/111/70053" },
		certificateTitleDe: { type: String, default: "Spendenbescheinigung" },
		certificateTitleEn: { type: String, default: "Donation Certificate" },
		certificateText1De: { type: String, default: "Ihre Spende ist steuerlich abzugsfähig. Für Beträge unter 200 € genügt eine Kopie Ihres Kontoauszuges mit dem Ausdruck des Spendenauftrags." },
		certificateText1En: { type: String, default: "Your donation is tax-deductible. For amounts under €200, a copy of your bank statement with the donation order printout is sufficient." },
		certificateText2De: { type: String, default: "Um Spenden von mehr als 200 € steuerlich absetzen zu können, stellen wir Ihnen für das Finanzamt eine Spendenbescheinigung (Steuerbescheinigung) aus." },
		certificateText2En: { type: String, default: "To deduct donations of more than €200 for tax purposes, we will issue you a donation certificate (tax receipt) for the tax office." },
		certificateLinkDe: { type: String, default: "Sie auf Wunsch" },
		certificateLinkEn: { type: String, default: "Upon request" },
		certificateText3De: { type: String, default: "per E-Mail oder Post." },
		certificateText3En: { type: String, default: "by email or post." },
		certificateText4De: { type: String, default: "20 % des Jahreseinkommens darf als Sonderausgabe für eine Spende geltend gemacht werden." },
		certificateText4En: { type: String, default: "20% of annual income may be claimed as a special deduction for a donation." },
	},
	{ _id: false }
);

export interface IZavdSpendenkontoSpecialtyItem {
	textDe?: string;
	textEn?: string;
}

const ZavdSpendenkontoSpecialtyItemSchema = new Schema<IZavdSpendenkontoSpecialtyItem>(
	{
		textDe: { type: String },
		textEn: { type: String },
	},
	{ _id: false }
);

export interface IZavdSpendenkontoMiddle {
	whyTitleDe?: string;
	whyTitleEn?: string;
	whyTextDe?: string;
	whyTextEn?: string;
	specialtyTitleDe?: string;
	specialtyTitleEn?: string;
	specialtyItems: IZavdSpendenkontoSpecialtyItem[];
}

const ZavdSpendenkontoMiddleSchema = new Schema<IZavdSpendenkontoMiddle>(
	{
		whyTitleDe: { type: String, default: "Warum uns spenden?" },
		whyTitleEn: { type: String, default: "Why donate to us?" },
		whyTextDe: { type: String, default: "Der Zentralverband der Assyrischen Vereinigungen in Deutschland e.V. (ZAVD) fördert die soziale, kulturelle und gesellschaftliche Integration der Assyrer in Deutschland und Europa. Ihre Spende unterstützt Bildungsprogramme, Flüchtlingshilfe und Integrationsarbeit." },
		whyTextEn: { type: String, default: "The Central Association of Assyrian Organizations in Germany e.V. (ZAVD) promotes the social, cultural and civic integration of Assyrians in Germany and Europe. Your donation supports educational programs, refugee assistance and integration work." },
		specialtyTitleDe: { type: String, default: "Unsere Besonderheit:" },
		specialtyTitleEn: { type: String, default: "Our specialty:" },
		specialtyItems: { type: [ZavdSpendenkontoSpecialtyItemSchema], default: [] },
	},
	{ _id: false }
);

export interface IZavdSpendenkontoRight {
	transferTitleDe?: string;
	transferTitleEn?: string;
	recipientLabelDe?: string;
	recipientLabelEn?: string;
	bankLabelDe?: string;
	bankLabelEn?: string;
	bankName?: string;
	purposeLabelDe?: string;
	purposeLabelEn?: string;
	purposeValueDe?: string;
	purposeValueEn?: string;
	iban?: string;
	bic?: string;
	paypalTitleDe?: string;
	paypalTitleEn?: string;
	paypalTextDe?: string;
	paypalTextEn?: string;
	paypalButtonDe?: string;
	paypalButtonEn?: string;
}

const ZavdSpendenkontoRightSchema = new Schema<IZavdSpendenkontoRight>(
	{
		transferTitleDe: { type: String, default: "Überweisung" },
		transferTitleEn: { type: String, default: "Bank Transfer" },
		recipientLabelDe: { type: String, default: "Empfänger" },
		recipientLabelEn: { type: String, default: "Recipient" },
		bankLabelDe: { type: String, default: "Bank" },
		bankLabelEn: { type: String, default: "Bank" },
		bankName: { type: String, default: "Sparkasse Gütersloh" },
		purposeLabelDe: { type: String, default: "Verwendungszweck" },
		purposeLabelEn: { type: String, default: "Purpose" },
		purposeValueDe: { type: String, default: "Spende Verband" },
		purposeValueEn: { type: String, default: "Donation Association" },
		iban: { type: String, default: "DE52 4785 0065 0000 8003 19" },
		bic: { type: String, default: "WELADED1GTL" },
		paypalTitleDe: { type: String, default: "PayPal" },
		paypalTitleEn: { type: String, default: "PayPal" },
		paypalTextDe: { type: String, default: "Mit PayPal besteht die Möglichkeit einer schnellen, unkomplizierten und sicheren Spende über PayPal, Kreditkarte oder EC-Karte. Klicken Sie einfach auf den unteren Button und befolgen Sie die nächsten Schritte." },
		paypalTextEn: { type: String, default: "With PayPal, you can make a quick, easy and secure donation via PayPal, credit card or debit card. Simply click the button below and follow the next steps." },
		paypalButtonDe: { type: String, default: "Jetzt Spenden!" },
		paypalButtonEn: { type: String, default: "Donate Now!" },
	},
	{ _id: false }
);

export interface IZavdSpendenkontoPage extends Document {
	hero: IZavdSpendenkontoHero;
	left: IZavdSpendenkontoLeft;
	middle: IZavdSpendenkontoMiddle;
	right: IZavdSpendenkontoRight;
	createdAt: Date;
	updatedAt: Date;
}

const ZavdSpendenkontoPageSchema = new Schema<IZavdSpendenkontoPage>(
	{
		hero: { type: ZavdSpendenkontoHeroSchema, default: () => ({}) },
		left: { type: ZavdSpendenkontoLeftSchema, default: () => ({}) },
		middle: { type: ZavdSpendenkontoMiddleSchema, default: () => ({}) },
		right: { type: ZavdSpendenkontoRightSchema, default: () => ({}) },
	},
	{ timestamps: true }
);

let ZavdSpendenkontoPageModel: Model<IZavdSpendenkontoPage> | null = null;

export function getZavdSpendenkontoPageModelSync(): Model<IZavdSpendenkontoPage> {
	if (ZavdSpendenkontoPageModel) return ZavdSpendenkontoPageModel;
	ZavdSpendenkontoPageModel =
		(mongoose.models.ZavdSpendenkontoPage as Model<IZavdSpendenkontoPage>) ||
		mongoose.model<IZavdSpendenkontoPage>("ZavdSpendenkontoPage", ZavdSpendenkontoPageSchema);
	return ZavdSpendenkontoPageModel;
}

export async function getZavdSpendenkontoPageModel(): Promise<Model<IZavdSpendenkontoPage>> {
	await connectMongoose();
	return getZavdSpendenkontoPageModelSync();
}
