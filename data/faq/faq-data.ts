/**
 * FAQ Data
 * Content for the Synos Medical FAQ page
 */

import {
	Building2,
	GraduationCap,
	Rocket,
	Package,
	Syringe,
	ShieldCheck,
	HelpCircle,
} from "lucide-react";
import { FAQItem, FAQCategory } from "@/types/faq";

/**
 * FAQ Categories
 */
export const faqCategories: FAQCategory[] = [
	{
		id: "about",
		name: "Om Synos Medical",
		icon: Building2,
		order: 1,
	},
	{
		id: "training",
		name: "Utbildning",
		icon: GraduationCap,
		order: 2,
	},
	{
		id: "starting-business",
		name: "Starta eget",
		icon: Rocket,
		order: 3,
	},
	{
		id: "products",
		name: "Produkter",
		icon: Package,
		order: 4,
	},
	{
		id: "microneedling",
		name: "Microneedling",
		icon: Syringe,
		order: 5,
	},
	{
		id: "safety",
		name: "Säkerhet",
		icon: ShieldCheck,
		order: 6,
	},
	{
		id: "general",
		name: "Allmänt",
		icon: HelpCircle,
		order: 7,
	},
];

/**
 * FAQ Items
 */
export const faqItems: FAQItem[] = [
	{
		id: "what-is-synos",
		category: "about",
		question: "Vad är Synos Medical?",
		answer:
			"Synos Medical erbjuder professionella lasermaskiner och utrustning till kliniker och salonger runt om i Skandinavien. Våra maskiner är högfunktionella, väl testade och självklart i linje med den senaste medicinska forskningen. Vi jobbar med leverantörer från några av världens främsta lasertillverkare och självklart finns maskiner för alla sorters laserbehandlingar.",
		order: 1,
	},
	{
		id: "training-offer",
		category: "training",
		question: "Erbjuder Synos Medical laserutbildningar? Vad kostar utbildningar?",
		answer:
			"Tyvärr erbjuder vi inga utbildningar separat från maskinköp, en grundlig utbildning ingår alltid i priset vid köp av en maskin. Vi är medvetna om att vår utrustning används av personer med olika bakgrunder, erfarenheter och kunskaper. Därför vi alltid skräddarsy utbildningen efter deltagarnas förutsättningar och behov. Vi går inte bara igenom själva användandet av den specifika maskinen utan även andra viktiga aspekter, exempelvis maskinlära och patientsäkerhet.",
		order: 2,
	},
	{
		id: "starting-business",
		category: "starting-business",
		question:
			"Jag tänker att starta verksamhet inom laserhårborttagning/tatueringsbortagning, var ska jag börja?",
		answer:
			"På många sätt är det bättre att du börjar med att höra av dig till oss för att boka ett möte. Då kan vi tillsammans gå igenom vilka förutsättningar, behov och förväntningar du har. Vi kan föreslå maskiner och utrustning som passar just er. Med hjälp av vår utbildning kan du säkerställa att personalen använder maskinen på rätt sätt och att patienterna får en effektiv och säker behandling.",
		order: 3,
	},
	{
		id: "brands",
		category: "products",
		question: "Vilka märken erbjuder ni?",
		answer:
			"Vi på Synos Medical AB har samlat ihop de absolut bästa maskinerna inom sina respektive områden. Synos Medical är återförsäljare av DEKA Lasers, Asclepion Laser, Jena surgical och IDS LTD.",
		order: 4,
	},
	{
		id: "microneedling",
		category: "microneedling",
		question: "Säljer ni maskiner med microneedling?",
		answer:
			"Hos oss kan du köpa Vivace Fractional Micro Needle RF (av Dermascope Magazine utsedd till 'Bästa microneedling RF' år 2022) som levererar fraktionerad radiofrekvens med hjälp av microneedlingnålar. Maskinen kombinerar det bästa med microneedlingtekniken och den fraktionerade radiofrekvensen på ett sätt som ger helt oslagbara resultat vid hudåtstramning och föryngring. Läs mer om Vivace här!",
		order: 5,
	},
	{
		id: "product-safety",
		category: "safety",
		question: "Hur vet jag att era produkter är säkra?",
		answer:
			"Utrustning genomgår kliniska studier och är bevisat effektiva för att säkerställa att de verkligen ger de resultat som vi garanterar våra kunder. Vår utrustning används för att hjälpa människor i hela Skandinavien. Det innebär att det ligger ett stort ansvar på oss och de maskiner vi erbjuder. Vi säkerställer alltid att våra produkter är säkra, effektiva och att det finns forskning som stödjer maskinernas funktion och användning. Vi utför även egna tester för att säkerställa att maskinerna levererar ett tillförlitligt resultat. Om vi finner att en viss teknik eller maskin inte fyller våra högt ställda krav så tar vi helt enkelt inte in dessa produkter till vårt sortiment. För oss är det av yttersta vikt att vår utrustning håller precis vad vi lovar. Detta är en säkerhet både för dig som kund och för de patienter som i slutändan kommer att behandlas med vår utrustning.",
		order: 6,
	},
];

/**
 * Get FAQs by category
 */
export function getFAQsByCategory(categoryId: string): FAQItem[] {
	return faqItems
		.filter((item) => item.category === categoryId)
		.sort((a, b) => a.order - b.order);
}

/**
 * Get all FAQs sorted by order
 */
export function getAllFAQs(): FAQItem[] {
	return faqItems.sort((a, b) => a.order - b.order);
}

/**
 * Search FAQs
 */
export function searchFAQs(query: string): FAQItem[] {
	const lowerQuery = query.toLowerCase();
	return faqItems.filter(
		(item) =>
			item.question.toLowerCase().includes(lowerQuery) ||
			item.answer.toLowerCase().includes(lowerQuery)
	);
}

