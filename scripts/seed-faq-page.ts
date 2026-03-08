/**
 * Seed script for FAQ Page data (Cheese Theme)
 * Run with: npx tsx scripts/seed-faq-page.ts
 */

import mongoose from "mongoose";
import * as fs from "fs";
import * as path from "path";

// Load .env file manually (since we're outside Next.js)
function loadEnvFile() {
	const envFiles = [".env.local", ".env"];

	for (const envFile of envFiles) {
		const envPath = path.resolve(process.cwd(), envFile);
		if (fs.existsSync(envPath)) {
			console.log(`Loading environment from ${envFile}...`);
			const content = fs.readFileSync(envPath, "utf-8");
			for (const line of content.split("\n")) {
				const trimmed = line.trim();
				if (!trimmed || trimmed.startsWith("#")) continue;
				const eqIndex = trimmed.indexOf("=");
				if (eqIndex === -1) continue;
				const key = trimmed.slice(0, eqIndex).trim();
				let value = trimmed.slice(eqIndex + 1).trim();
				if (
					(value.startsWith('"') && value.endsWith('"')) ||
					(value.startsWith("'") && value.endsWith("'"))
				) {
					value = value.slice(1, -1);
				}
				if (!process.env[key]) {
					process.env[key] = value;
				}
			}
			break;
		}
	}
}

loadEnvFile();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	console.error("MONGODB_URI is not defined in environment variables");
	process.exit(1);
}

// FAQ page data for Boxholm Cheese
const faqPageData = {
	sectionVisibility: {
		hero: true,
		faqContent: true,
		sidebar: true,
		newsletter: true,
		richContent: true,
	},

	// Hero Section
	hero: {
		badge: "FAQ",
		title: "Vanliga frågor om",
		titleHighlight: "hantverksost",
		subtitle:
			"Här får du svar på de vanligaste frågorna om våra ostar, beställningar, leveranser och hur du blir återförsäljare.",
		stats: [
			{ value: "30+", label: "Besvarade frågor" },
			{ value: "24h", label: "Svarstid" },
			{ value: "100+", label: "År tradition" },
		],
	},

	// FAQ Content Section
	faqContent: {
		searchPlaceholder: "Sök bland vanliga frågor...",
		noResultsText: "Inga resultat hittades. Prova att söka på något annat.",
		helpText: "Hittar du inte svaret på din fråga?",
		helpButtonText: "Kontakta oss",
		helpButtonHref: "/contact-us",
		categories: [
			{ id: "products", name: "Våra ostar", icon: "Package", order: 0 },
			{ id: "ordering", name: "Beställning", icon: "ShoppingCart", order: 1 },
			{ id: "storage", name: "Förvaring", icon: "Refrigerator", order: 2 },
			{ id: "reseller", name: "Återförsäljare", icon: "Store", order: 3 },
			{ id: "visit", name: "Besök oss", icon: "MapPin", order: 4 },
		],
		items: [
			// Product Questions
			{
				question: "Vilka ostar tillverkar ni?",
				answer:
					"Vi tillverkar ett brett sortiment av hantverksgjorda ostar, från mjuka färskostar till lagrade hårda ostar. Vårt mest kända sortiment inkluderar traditionell Boxholmsost, getost, och säsongsbetonade specialiteter. Alla våra ostar tillverkas med lokalt producerad mjölk och traditionella metoder.",
				category: "products",
				order: 0,
			},
			{
				question: "Är era ostar gjorda av opastöriserad mjölk?",
				answer:
					"Vi erbjuder både ostar gjorda av pastöriserad och opastöriserad mjölk. Våra lagrade ostar med lång mognadsperiod görs ofta av opastöriserad mjölk för att bevara mjölkens naturliga smaker och enzymer. Information om mjölktyp finns alltid angiven på förpackningen.",
				category: "products",
				order: 1,
			},
			{
				question: "Innehåller era produkter tillsatser eller konserveringsmedel?",
				answer:
					"Nej, vi använder inga konstgjorda tillsatser eller konserveringsmedel i våra ostar. Vi arbetar med traditionella metoder där tid, salt och naturlig mognad skapar smaken och bevarar osten. Det är så ost har tillverkats i hundratals år.",
				category: "products",
				order: 2,
			},
			// Ordering Questions
			{
				question: "Hur kan jag beställa ost?",
				answer:
					"Du kan beställa direkt från oss genom att kontakta vår butik via telefon eller e-post. Vi levererar över hela Sverige och kan även arrangera internationella leveranser för större beställningar. Besök gärna vår butik i Boxholm för att provsmaka innan du beställer!",
				category: "ordering",
				order: 0,
			},
			{
				question: "Vad är minsta beställningsstorlek?",
				answer:
					"För privatkunder finns ingen minsta beställning - du kan köpa precis så mycket du önskar. För restauranger och återförsäljare rekommenderar vi en minsta beställning på 5 kg för att säkerställa optimal leveranskostnad.",
				category: "ordering",
				order: 1,
			},
			{
				question: "Hur lång är leveranstiden?",
				answer:
					"Vi skickar normalt beställningar inom 1-2 arbetsdagar. Leveranstiden beror på din plats och valt fraktsätt, men de flesta kunder får sin ost inom 2-4 arbetsdagar. Vi använder kyltransport för att säkerställa att osten kommer fram i perfekt skick.",
				category: "ordering",
				order: 2,
			},
			// Storage Questions
			{
				question: "Hur ska jag förvara osten?",
				answer:
					"Hårdostar förvaras bäst i kylskåp vid 4-8°C, gärna insvept i ostpapper eller bakplåtspapper. Mjuka ostar bör förvaras kallt och ätas inom några dagar efter öppning. Ta alltid ut osten ur kylskåpet ca 30 minuter före servering för bästa smakupplevelse.",
				category: "storage",
				order: 0,
			},
			{
				question: "Kan jag frysa ost?",
				answer:
					"Vi rekommenderar inte att frysa ost då det påverkar texturen negativt. Hårdostar kan dock frysas om nödvändigt - de fungerar då bäst i matlagning efter upptining. Mjuka ostar bör aldrig frysas.",
				category: "storage",
				order: 1,
			},
			{
				question: "Hur länge håller osten?",
				answer:
					"Hållbarheten varierar beroende på osttyp. Lagrade hårdostar kan hålla i flera månader oöppnade i kylskåp. Mjukare ostar har kortare hållbarhet, typiskt 2-4 veckor. Se alltid bäst-före-datum på förpackningen för specifik information.",
				category: "storage",
				order: 2,
			},
			// Reseller Questions
			{
				question: "Hur blir jag återförsäljare?",
				answer:
					"Vi välkomnar samarbeten med butiker, restauranger och delikatesshandlare som värdesätter kvalitetsost. Kontakta oss för att diskutera villkor, sortiment och leveransupplägg. Vi erbjuder konkurrenskraftiga priser och support för våra återförsäljare.",
				category: "reseller",
				order: 0,
			},
			{
				question: "Erbjuder ni provleveranser för restauranger?",
				answer:
					"Ja, vi erbjuder provpaket för restauranger och butiker som vill testa våra produkter innan de inleder ett samarbete. Kontakta oss så ordnar vi ett anpassat provpaket.",
				category: "reseller",
				order: 1,
			},
			// Visit Questions
			{
				question: "Kan jag besöka mejeriet?",
				answer:
					"Absolut! Vi välkomnar besökare till vårt mejeri i Boxholm. Du kan besöka vår butik, provsmaka ostar och lära dig om osttillverkning. Vi erbjuder även guidade turer för grupper - boka i förväg för att säkerställa plats.",
				category: "visit",
				order: 0,
			},
			{
				question: "Vilka är öppettiderna?",
				answer:
					"Vår butik är öppen måndag-fredag 08:00-17:00 och lördagar 10:00-14:00. Vi har stängt på söndagar och helgdagar. Kontakta oss för att boka guidning eller gruppbesök utanför ordinarie öppettider.",
				category: "visit",
				order: 1,
			},
		],
	},

	// Sidebar Section
	sidebar: {
		contactTitle: "Behöver du hjälp?",
		contactDescription:
			"Vårt team finns här för att svara på dina frågor om våra ostar och hjälpa dig med din beställning.",
		phone: "+46 142-510 50",
		email: "info@boxholmsost.se",
		officeHours: "Mån-Fre 08:00-17:00",
		contactButtonText: "Kontakta oss",
		contactButtonHref: "/contact-us",
		quickLinksTitle: "Snabblänkar",
		quickLinks: [
			{ label: "Våra produkter", href: "/products" },
			{ label: "Bli återförsäljare", href: "/become-our-reseller" },
			{ label: "Om oss", href: "/about-us" },
			{ label: "Besök vår butik", href: "/our-store" },
			{ label: "Kvalitet & certifieringar", href: "/quality" },
		],
		officesTitle: "Hitta oss",
		offices: [
			{ name: "Boxholms Mejeri", address: "Boxholms Mejeri, 590 10 Boxholm" },
		],
	},

	// Newsletter Section
	newsletter: {
		title: "Håll dig uppdaterad",
		subtitle:
			"Prenumerera på vårt nyhetsbrev för nyheter om säsongsostar, recept och specialerbjudanden.",
		inputPlaceholder: "Din e-postadress",
		buttonText: "Prenumerera",
		loadingText: "Skickar...",
		successText: "Tack för din prenumeration!",
		privacyNote:
			"Genom att prenumerera godkänner du vår integritetspolicy. Du kan avsluta prenumerationen när som helst.",
	},

	// Rich Content (HTML)
	richContent: `
<h2>Om Boxholms Ost</h2>
<p>Boxholms Ost är ett traditionellt svenskt mejeri med rötter som sträcker sig över hundra år tillbaka. Vi tillverkar hantverksgjorda ostar med samma omsorg och hängivenhet som generationerna före oss, samtidigt som vi möter dagens kvalitets- och hygienkrav.</p>

<h2>Vårt sortiment</h2>
<p>Vi erbjuder ett brett utbud av ostar, från mjuka färskostar till lagrade hårdostar. Varje ost tillverkas med omsorg av våra erfarna ostmästare, med lokalt producerad mjölk av högsta kvalitet. Besök vår <a href="/products">produktsida</a> för att se hela sortimentet.</p>

<h2>Beställningar och leverans</h2>
<p>Vi levererar våra ostar i kyltransport över hela Sverige. För större beställningar eller internationella leveranser, <a href="/contact-us">kontakta oss</a> så hittar vi en lösning som passar dina behov.</p>

<h2>Bli återförsäljare</h2>
<p>Är du intresserad av att sälja våra ostar i din butik eller servera dem på din restaurang? Vi samarbetar med utvalda partners som delar vår passion för kvalitetsost. <a href="/become-our-reseller">Läs mer om återförsäljarskap</a> eller kontakta oss direkt.</p>

<h2>Besök vårt mejeri</h2>
<p>Välkommen till Boxholm för en unik upplevelse! I vår gårdsbutik kan du provsmaka och köpa våra ostar direkt. Vi erbjuder även guidade turer där du får lära dig om osttillverkningens konst. <a href="/our-store">Se öppettider och hitta hit</a>.</p>
`,

	// SEO
	seo: {
		title: "Vanliga frågor om hantverksost | Boxholms Ost",
		description:
			"Få svar på vanliga frågor om våra hantverksgjorda ostar, beställningar, leveranser och hur du blir återförsäljare. Vi finns här för att hjälpa dig!",
		keywords: [
			"FAQ",
			"vanliga frågor",
			"ost",
			"hantverksost",
			"Boxholm",
			"svensk ost",
			"beställa ost",
			"återförsäljare",
		],
		ogImage: "/storage/images/og-faq.jpg",
	},
};

async function seedFAQPage() {
	try {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(MONGODB_URI!);
		console.log("Connected to MongoDB");

		const db = mongoose.connection.db;
		if (!db) {
			throw new Error("Database connection not established");
		}

		const collection = db.collection("faq_page");

		// Check if document exists
		const existingDoc = await collection.findOne({});

		if (existingDoc) {
			console.log("FAQ page document already exists. Updating...");
			await collection.updateOne(
				{},
				{ $set: { ...faqPageData, updatedAt: new Date() } }
			);
			console.log("FAQ page document updated successfully!");
		} else {
			console.log("Creating new FAQ page document...");
			await collection.insertOne({
				...faqPageData,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			console.log("FAQ page document created successfully!");
		}

		console.log("\n========================================");
		console.log("FAQ PAGE DATA SEEDED SUCCESSFULLY!");
		console.log("========================================\n");
	} catch (error) {
		console.error("Error seeding FAQ page:", error);
	} finally {
		await mongoose.disconnect();
		console.log("Disconnected from MongoDB");
	}
}

seedFAQPage();
