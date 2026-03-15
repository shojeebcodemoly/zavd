import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

export interface IHumanitaereHilfeHero {
	taglineDe?: string;
	taglineEn?: string;
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	image?: string;
}

const HumanitaereHilfeHeroSchema = new Schema<IHumanitaereHilfeHero>(
	{
		taglineDe: { type: String, default: "Humanitäre Hilfe" },
		taglineEn: { type: String, default: "Humanitarian Aid" },
		titleDe: { type: String, default: "Humanitäre Hilfe" },
		titleEn: { type: String, default: "Humanitarian Aid" },
		subtitleDe: { type: String, default: "Humanitäres Konto für die im Krieg und Katastrophen in Not geratene Assyrier in ihren Heimatländern." },
		subtitleEn: { type: String, default: "Humanitarian account for Assyrians in need due to war and disasters in their home countries." },
		image: { type: String, default: "/images/donate/Spenden-Syrien.jpg" },
	},
	{ _id: false }
);

export interface IHumanitaereHilfeLeft {
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

const HumanitaereHilfeLeftSchema = new Schema<IHumanitaereHilfeLeft>(
	{
		sectionTitleDe: { type: String, default: "Spendenkonto - Humanitäre Hilfe" },
		sectionTitleEn: { type: String, default: "Donation Account - Humanitarian Aid" },
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

export interface IHumanitaereHilfeSpecialtyItem {
	textDe?: string;
	textEn?: string;
}

const HumanitaereHilfeSpecialtyItemSchema = new Schema<IHumanitaereHilfeSpecialtyItem>(
	{
		textDe: { type: String },
		textEn: { type: String },
	},
	{ _id: false }
);

export interface IHumanitaereHilfeMiddle {
	whyTitleDe?: string;
	whyTitleEn?: string;
	whyTextDe?: string;
	whyTextEn?: string;
	specialtyTitleDe?: string;
	specialtyTitleEn?: string;
	specialtyItems: IHumanitaereHilfeSpecialtyItem[];
}

const HumanitaereHilfeMiddleSchema = new Schema<IHumanitaereHilfeMiddle>(
	{
		whyTitleDe: { type: String, default: "Warum uns spenden?" },
		whyTitleEn: { type: String, default: "Why donate to us?" },
		whyTextDe: { type: String, default: "Der Zentralverband der Assyrischen Vereinigungen in Deutschland e.V. (ZAVD) leistet soziale und humanitäre Hilfeleistung für Flüchtlinge und Notleidende Assyrier aus den Herkunftsländern (Syrien, Irak, Türkei, Libanon und Iran). Bitte eine Spende unterstützen sie uns bei Notfallsituationen in den Kriegsgebieten." },
		whyTextEn: { type: String, default: "The Central Association of Assyrian Organizations in Germany e.V. (ZAVD) provides social and humanitarian assistance for refugees and suffering Assyrians from their home countries (Syria, Iraq, Turkey, Lebanon and Iran). Please support us with a donation in emergency situations in war zones." },
		specialtyTitleDe: { type: String, default: "Unsere Besonderheit:" },
		specialtyTitleEn: { type: String, default: "Our specialty:" },
		specialtyItems: { type: [HumanitaereHilfeSpecialtyItemSchema], default: [] },
	},
	{ _id: false }
);

export interface IHumanitaereHilfeRight {
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

const HumanitaereHilfeRightSchema = new Schema<IHumanitaereHilfeRight>(
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
		purposeValueDe: { type: String, default: "Spende Assyrien" },
		purposeValueEn: { type: String, default: "Donation Assyria" },
		iban: { type: String, default: "DE49 4785 0065 0000 8361 66" },
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

export interface IHumanitaereHilfePage extends Document {
	hero: IHumanitaereHilfeHero;
	left: IHumanitaereHilfeLeft;
	middle: IHumanitaereHilfeMiddle;
	right: IHumanitaereHilfeRight;
	createdAt: Date;
	updatedAt: Date;
}

const HumanitaereHilfePageSchema = new Schema<IHumanitaereHilfePage>(
	{
		hero: { type: HumanitaereHilfeHeroSchema, default: () => ({}) },
		left: { type: HumanitaereHilfeLeftSchema, default: () => ({}) },
		middle: { type: HumanitaereHilfeMiddleSchema, default: () => ({}) },
		right: { type: HumanitaereHilfeRightSchema, default: () => ({}) },
	},
	{ timestamps: true }
);

let HumanitaereHilfePageModel: Model<IHumanitaereHilfePage> | null = null;

export function getHumanitaereHilfePageModelSync(): Model<IHumanitaereHilfePage> {
	if (HumanitaereHilfePageModel) return HumanitaereHilfePageModel;
	HumanitaereHilfePageModel =
		(mongoose.models.HumanitaereHilfePage as Model<IHumanitaereHilfePage>) ||
		mongoose.model<IHumanitaereHilfePage>("HumanitaereHilfePage", HumanitaereHilfePageSchema);
	return HumanitaereHilfePageModel;
}

export async function getHumanitaereHilfePageModel(): Promise<Model<IHumanitaereHilfePage>> {
	await connectMongoose();
	return getHumanitaereHilfePageModelSync();
}
