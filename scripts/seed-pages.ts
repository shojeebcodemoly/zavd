/**
 * Unified Seed script for all CMS pages - Cheese/Dairy Theme
 * Run with: npx tsx scripts/seed-pages.ts
 *
 * Options:
 *   --about      Seed About page only
 *   --training   Seed Training page only
 *   --starta     Seed Starta Eget page only
 *   --careers    Seed Careers page only
 *   --legal      Seed Legal page only
 *   --all        Seed all pages (default)
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

// ============================================================================
// ABOUT PAGE DATA - Cheese/Dairy Theme
// ============================================================================
const aboutPageData = {
	sectionVisibility: {
		hero: true,
		mission: true,
		stats: true,
		imageGallery: true,
		faq: true,
		testimonials: true,
		partners: true,
		cta: true,
	},

	hero: {
		badge: "About Boxholm Cheese",
		title: "About Us",
		subtitle: "Sweden's premium artisan cheese maker since 1890. We combine traditional craftsmanship with passion to create cheese that tells a story of heritage and quality.",
	},

	mission: {
		badge: "Our Mission",
		title: "We deliver quality and tradition",
		description: "Boxholm Cheese has been crafting premium artisan cheese for over 130 years. Our commitment to quality starts with locally sourced Swedish milk from farms in Östergötland. Every wheel of cheese is made using time-honored techniques passed down through generations of master cheese makers.",
		image: "/storage/images/about/family-farm.jpg",
		features: [
			{
				icon: "Target",
				title: "Quality First",
				description: "Premium ingredients and traditional methods ensure every cheese meets our high standards",
				image: "/storage/images/about/quality-bg.jpg",
				buttonText: "Learn More →",
				buttonLink: "/quality",
			},
			{
				icon: "Award",
				title: "Award Winning",
				description: "Our cheeses have won numerous awards for exceptional taste and craftsmanship",
				image: "/storage/images/about/awards-bg.jpg",
				buttonText: "Learn More →",
				buttonLink: "/quality",
			},
			{
				icon: "Users",
				title: "Family Tradition",
				description: "Four generations of cheese makers dedicated to preserving authentic flavors",
				image: "/storage/images/about/family-bg.jpg",
				buttonText: "Learn More →",
				buttonLink: "/about-us",
			},
			{
				icon: "Sparkles",
				title: "Sustainable Practices",
				description: "Eco-friendly production methods that respect our environment and community",
				image: "/storage/images/about/sustainable-bg.jpg",
				buttonText: "Learn More →",
				buttonLink: "/quality",
			},
		],
	},

	stats: [
		{ value: "130", suffix: "+", label: "Years of Tradition" },
		{ value: "50", suffix: "+", label: "Local Farms" },
		{ value: "100", suffix: "%", label: "Swedish Milk" },
		{ value: "24", suffix: "h", label: "Fresh Delivery" },
	],

	imageGallery: {
		badge: "Our Dairy",
		title: "Visit Our Farm",
		subtitle: "Experience the authentic cheese-making process at our family farm in Boxholm",
		images: [],
		ctaTitle: "Book a Visit",
		ctaSubtitle: "We welcome visitors to see our cheese-making process firsthand",
		ctaButtonText: "Contact Us",
	},

	faq: {
		title: "Frequently Asked Questions",
		subtitle: "Common questions about Boxholm Cheese",
		items: [
			{
				question: "Where is Boxholm Cheese made?",
				answer: "Our cheese is made at our family dairy in Boxholm, Östergötland, Sweden. We've been crafting cheese at this location since 1890, using milk from local farms within a 50km radius.",
			},
			{
				question: "What makes your cheese special?",
				answer: "Our cheese is made using traditional Swedish recipes and techniques passed down through four generations. We use only 100% Swedish milk from grass-fed cows and age our cheeses naturally without artificial additives.",
			},
			{
				question: "Can I visit the dairy?",
				answer: "Yes! We welcome visitors to our farm. You can book a tour to see the cheese-making process and taste our products. Contact us to arrange a visit.",
			},
			{
				question: "Do you ship internationally?",
				answer: "Currently we ship within Sweden and to select EU countries. Please contact us for international shipping inquiries.",
			},
			{
				question: "Are your products organic?",
				answer: "While not all products are certified organic, we use sustainable farming practices and source milk from farms that prioritize animal welfare and environmental responsibility.",
			},
		],
	},

	testimonials: {
		title: "What Our Customers Say",
		subtitle: "Read about experiences with Boxholm Cheese",
		testimonials: [
			{
				quote: "The Gräddost from Boxholm is simply the best cream cheese I've ever tasted. The rich, creamy texture and authentic flavor bring back childhood memories.",
				author: "Maria Andersson",
				role: "Home Chef",
				company: "Stockholm",
				rating: 5,
			},
			{
				quote: "As a restaurant owner, I'm very particular about the ingredients I use. Boxholm Cheese consistently delivers exceptional quality that my customers love.",
				author: "Johan Eriksson",
				role: "Chef & Owner",
				company: "Restaurang Smak",
				rating: 5,
			},
			{
				quote: "We've been serving Boxholm cheese at our hotel breakfast for years. The quality and freshness are unmatched, and guests always ask about it.",
				author: "Sara Lindqvist",
				role: "Manager",
				company: "Grand Hotel Linköping",
				rating: 5,
			},
		],
	},

	partners: {
		title: "Our Partners",
		subtitle: "Trusted by leading retailers and restaurants across Sweden",
		partners: [],
	},

	cta: {
		title: "Ready to taste the tradition?",
		description: "Contact us today to learn more about our products or to place an order. We'd love to share our cheese with you.",
		primaryCta: {
			text: "Contact Us",
			href: "/contact-us",
		},
		secondaryCta: {
			text: "View Products",
			href: "/products",
		},
	},

	seo: {
		title: "About Us - Boxholm Cheese | Traditional Swedish Cheese Since 1890",
		description: "Discover the story of Boxholm Cheese - Sweden's premium artisan cheese maker. 130+ years of tradition, quality, and authentic Swedish flavors.",
		ogImage: "/storage/images/og-about.jpg",
	},
};

// ============================================================================
// TRAINING PAGE DATA - Cheese Theme (Farm Tours & Workshops)
// ============================================================================
const trainingPageData = {
	sectionVisibility: {
		hero: true,
		mainContent: true,
		benefits: true,
		process: true,
		support: true,
		inquiryForm: true,
		resources: true,
		richContent: false,
	},

	hero: {
		title: "Learn the Art of",
		titleHighlight: "Cheese Making",
		subtitle: "Join us for hands-on workshops and farm tours where you'll discover the traditional techniques behind our award-winning cheeses. Perfect for food enthusiasts, families, and groups.",
	},

	mainContent: {
		title: "Experience Authentic Cheese Making",
		paragraphs: [
			"At Boxholm Cheese, we believe in sharing our passion for traditional cheese making. Our workshops and farm tours offer a unique opportunity to experience the craft firsthand.",
			"Whether you're a curious food lover or an aspiring cheese maker, our experienced team will guide you through every step of the process - from milk to finished cheese.",
			"All workshops include tastings of our cheese varieties and you'll take home your own handmade cheese.",
		],
	},

	benefits: [
		{
			icon: "BookOpen",
			title: "Hands-On Learning",
			description: "Get your hands into the curds and learn by doing. Our workshops are interactive and educational.",
		},
		{
			icon: "CheckSquare",
			title: "Expert Guidance",
			description: "Learn from our master cheese makers who have decades of experience in traditional techniques.",
		},
		{
			icon: "HeartPlus",
			title: "Take Home Your Creation",
			description: "Every participant takes home their own handmade cheese to enjoy and share.",
		},
		{
			icon: "GraduationCap",
			title: "Recipe Cards Included",
			description: "Receive detailed instructions so you can continue making cheese at home.",
		},
	],

	processSection: {
		title: "Workshop Process",
		subtitle: "A structured experience that gives you real cheese-making skills",
		steps: [
			{
				number: "1",
				title: "Farm Tour",
				description: "Start with a guided tour of our dairy farm and meet our happy cows.",
			},
			{
				number: "2",
				title: "Cheese Making",
				description: "Learn the traditional techniques as you make your own cheese from fresh milk.",
			},
			{
				number: "3",
				title: "Tasting Session",
				description: "Sample our range of artisan cheeses paired with local accompaniments.",
			},
			{
				number: "4",
				title: "Take Home",
				description: "Package your cheese creation to take home, along with recipe cards.",
			},
		],
	},

	supportSection: {
		title: "Questions About Our Workshops?",
		paragraphs: [
			"We're happy to help you plan your visit. Whether it's a family outing, corporate event, or group booking, we can customize the experience.",
			"Contact us for availability, group rates, and special arrangements.",
		],
		phone: "+46 142-510 50",
		email: "info@boxholmsost.se",
	},

	inquirySection: {
		badge: "Book a Workshop",
		title: "Interested in joining us?",
		subtitle: "Fill out the form and we'll contact you with available dates and pricing.",
	},

	resourcesSection: {
		title: "Related Experiences",
		subtitle: "Discover more ways to enjoy Boxholm Cheese",
		resources: [
			{
				title: "Visit Our Store",
				description: "Browse our full range of cheeses and dairy products at our farm shop.",
				href: "/our-store",
				buttonText: "Visit Store",
			},
			{
				title: "Our Products",
				description: "Explore our award-winning cheese collection available for purchase.",
				href: "/products",
				buttonText: "View Products",
			},
			{
				title: "Quality Standards",
				description: "Learn about our commitment to quality and sustainable practices.",
				href: "/quality",
				buttonText: "Learn More",
			},
		],
	},

	seo: {
		title: "Cheese Making Workshops - Boxholm Cheese | Farm Tours & Experiences",
		description: "Join our hands-on cheese making workshops at Boxholm Cheese. Learn traditional Swedish techniques, tour our farm, and take home your own handmade cheese.",
		ogImage: "",
	},
};

// ============================================================================
// STARTA EGET PAGE DATA - Become a Reseller/Partner
// ============================================================================
const startaEgetPageData = {
	sectionVisibility: {
		hero: true,
		mainContent: true,
		benefits: true,
		features: true,
		contactForm: true,
		resources: true,
		richContent: false,
	},

	hero: {
		title: "Start Your Own",
		titleHighlight: "Cheese Business",
		subtitle: "Partner with Boxholm Cheese and bring Sweden's finest artisan cheese to your customers. We provide comprehensive support for retailers, restaurants, and distributors.",
		callout: "Join our growing family of partners!",
	},

	mainContent: {
		title: "Partner with Sweden's Premium Cheese Maker",
		subtitle: "Your path to success",
		paragraphs: [
			"Are you a retailer, restaurant owner, or distributor looking to offer premium artisan cheese to your customers? Boxholm Cheese partners with businesses that share our passion for quality.",
			"We provide more than just products - we offer a partnership built on tradition, quality, and mutual success. Our team supports you every step of the way.",
			"With over 130 years of cheese-making heritage, Boxholm Cheese brings authentic Swedish flavors that customers love and remember.",
		],
	},

	benefits: [
		{
			icon: "TrendingUp",
			title: "Competitive Margins",
			description: "Attractive wholesale pricing that ensures healthy margins for your business.",
		},
		{
			icon: "Truck",
			title: "Reliable Delivery",
			description: "Regular delivery schedules and fresh products guaranteed on every order.",
		},
		{
			icon: "Award",
			title: "Premium Products",
			description: "Award-winning cheeses that stand out and attract discerning customers.",
		},
		{
			icon: "Users",
			title: "Marketing Support",
			description: "POS materials, product information, and marketing assets to boost your sales.",
		},
		{
			icon: "HeadphonesIcon",
			title: "Dedicated Support",
			description: "A dedicated account manager to help with orders and any questions.",
		},
		{
			icon: "Shield",
			title: "Quality Guaranteed",
			description: "Consistent quality backed by our 130+ year reputation for excellence.",
		},
	],

	featuresSection: {
		title: "Everything You Need to Succeed",
		intro: "When you partner with Boxholm Cheese, you get comprehensive support to grow your business.",
		features: [
			{
				title: "Product Training",
				description: "Learn about our products, cheese care, and optimal serving suggestions.",
			},
			{
				title: "Flexible Orders",
				description: "Order sizes that fit your needs, from small retailers to large distributors.",
			},
			{
				title: "Fresh Delivery",
				description: "Regular delivery schedules ensure your products are always fresh.",
			},
			{
				title: "Marketing Materials",
				description: "Professional POS materials and product information for your store.",
			},
			{
				title: "Tasting Events",
				description: "We can support in-store tastings to introduce customers to our products.",
			},
			{
				title: "Seasonal Products",
				description: "Access to limited edition and seasonal cheese varieties.",
			},
		],
	},

	resourcesSection: {
		title: "Resources for Partners",
		subtitle: "Helpful information for potential and current partners",
		resources: [
			{
				title: "Product Catalog",
				description: "Download our complete product catalog with specifications and pricing.",
				href: "/contact-us",
				buttonText: "Request Catalog",
			},
			{
				title: "Quality Standards",
				description: "Learn about our production methods and quality certifications.",
				href: "/quality",
				buttonText: "View Standards",
			},
			{
				title: "Visit Our Dairy",
				description: "Schedule a visit to see our production facility and meet the team.",
				href: "/our-store",
				buttonText: "Plan Visit",
			},
		],
	},

	seo: {
		title: "Become a Partner - Boxholm Cheese | Wholesale & Distribution",
		description: "Partner with Boxholm Cheese for premium Swedish artisan cheese. Attractive margins, reliable delivery, and marketing support for retailers and distributors.",
		ogImage: "",
	},
};

// ============================================================================
// CAREERS PAGE DATA - Cheese/Dairy Theme
// ============================================================================
const careersPageData = {
	sectionVisibility: {
		hero: true,
		benefits: true,
		jobOpenings: true,
		values: true,
		applicationForm: true,
	},

	hero: {
		badge: "Join Our Team",
		title: "Build Your Career at",
		titleHighlight: "Boxholm Cheese",
		subtitle: "Be part of a team that's passionate about crafting Sweden's finest artisan cheese. We're always looking for talented people who share our values.",
	},

	benefitsSection: {
		title: "Why Work With Us?",
		subtitle: "Join a team that values tradition, quality, and community",
		benefits: [
			{
				icon: "Clock",
				title: "Work-Life Balance",
				description: "Regular hours and a supportive environment that respects your personal time.",
			},
			{
				icon: "TrendingUp",
				title: "Growth Opportunities",
				description: "Learn traditional cheese-making skills and grow your career with us.",
			},
			{
				icon: "Users",
				title: "Family Atmosphere",
				description: "Join a close-knit team that feels like family, working together since 1890.",
			},
			{
				icon: "Heart",
				title: "Employee Benefits",
				description: "Competitive salary, cheese discounts, and wellness benefits.",
			},
		],
	},

	jobOpeningsSection: {
		title: "Current Openings",
		subtitle: "Explore opportunities to join our team",
		noJobsMessage: "We don't have any open positions at the moment, but we're always interested in hearing from talented people. Send your CV to karriar@boxholmsost.se",
		jobOpenings: [
			{
				slug: "cheese-maker-assistant",
				title: "Cheese Maker Assistant",
				location: "Boxholm, Sweden",
				workType: "On-site",
				employmentType: "Full-time",
				shortDescription: "Join our production team and learn the art of traditional Swedish cheese making from our master cheese makers.",
				featuredImage: "",
				description: "<p>We're looking for an enthusiastic person to join our cheese-making team. This is a unique opportunity to learn traditional cheese-making techniques from experienced craftspeople.</p><p>No prior experience required - we value passion and a willingness to learn. You'll work alongside our master cheese makers, learning every aspect of artisan cheese production.</p>",
				requirements: [
					"Passion for food and quality craftsmanship",
					"Ability to work early mornings",
					"Physical fitness for manual work",
					"Attention to detail",
					"Team player with positive attitude",
				],
				responsibilities: [
					"Assist in daily cheese production",
					"Monitor cheese aging process",
					"Maintain cleanliness and hygiene standards",
					"Help with packaging and quality control",
					"Learn traditional cheese-making techniques",
				],
				applyLink: "mailto:karriar@boxholmsost.se?subject=Application: Cheese Maker Assistant",
				isActive: true,
				publishedAt: new Date(),
			},
			{
				slug: "farm-shop-assistant",
				title: "Farm Shop Assistant",
				location: "Boxholm, Sweden",
				workType: "On-site",
				employmentType: "Part-time",
				shortDescription: "Help us share our passion for artisan cheese with visitors at our farm shop.",
				featuredImage: "",
				description: "<p>We're seeking a friendly and knowledgeable person to join our farm shop team. You'll be the face of Boxholm Cheese, helping customers discover our products.</p><p>This role is perfect for someone who loves cheese, enjoys meeting people, and wants to work in a beautiful farm setting.</p>",
				requirements: [
					"Excellent customer service skills",
					"Knowledge of or interest in cheese and dairy products",
					"Swedish and English language skills",
					"Weekend availability",
					"Friendly and approachable personality",
				],
				responsibilities: [
					"Assist customers and provide product recommendations",
					"Handle sales and cash register",
					"Maintain shop displays and inventory",
					"Conduct cheese tastings for visitors",
					"Support farm tour activities",
				],
				applyLink: "mailto:karriar@boxholmsost.se?subject=Application: Farm Shop Assistant",
				isActive: true,
				publishedAt: new Date(),
			},
		],
	},

	valuesSection: {
		title: "Our Values",
		subtitle: "What drives us every day",
		values: [
			"Quality without compromise - every wheel of cheese is crafted with care",
			"Respect for tradition - honoring 130+ years of cheese-making heritage",
			"Sustainability - caring for our land, animals, and community",
			"Teamwork - supporting each other like family",
		],
	},

	contactSidebar: {
		title: "Get in Touch",
		address: "Boxholms Mejeri, 590 10 Boxholm, Sweden",
		email: "karriar@boxholmsost.se",
		phone: "+46 142-510 50",
		secondaryPhone: "",
		formTitle: "Apply Now",
	},

	expertCta: {
		badge: "Questions?",
		title: "Want to Know More?",
		subtitle: "Contact us if you have questions about working at Boxholm Cheese. We're happy to tell you more about life on the farm.",
	},

	seo: {
		title: "Careers - Boxholm Cheese | Join Our Team",
		description: "Explore career opportunities at Boxholm Cheese. Join our team of passionate cheese makers and be part of Sweden's cheese-making tradition since 1890.",
		ogImage: "",
	},
};

// ============================================================================
// LEGAL PAGE DATA - Cheese/Dairy Theme
// ============================================================================
const legalPageData = {
	sectionVisibility: {
		hero: true,
		legalCards: true,
		companyInfo: true,
		terms: true,
		gdprRights: true,
		cta: true,
	},

	hero: {
		badge: "Legal Information",
		title: "Legal Information",
		subtitle: "Important information about our terms, privacy policy, and your rights as a customer of Boxholm Cheese.",
	},

	legalCards: [
		{
			icon: "Shield",
			title: "Privacy Policy",
			description: "Learn how we collect, use, and protect your personal data in accordance with GDPR.",
			href: "/privacy-policy",
			highlights: [
				"GDPR compliant",
				"Transparent data handling",
				"Your rights",
			],
		},
		{
			icon: "FileText",
			title: "Terms & Conditions",
			description: "Our general terms for purchases, delivery, and customer service.",
			href: "#terms",
			highlights: [
				"Purchase terms",
				"Delivery information",
				"Returns policy",
			],
		},
		{
			icon: "Scale",
			title: "Purchase Terms",
			description: "Detailed information about payment, delivery, returns, and complaints.",
			href: "#purchase-terms",
			highlights: [
				"Payment options",
				"Delivery info",
				"Return policy",
			],
		},
		{
			icon: "Cookie",
			title: "Cookies",
			description: "Information about how we use cookies to improve your experience on our website.",
			href: "/cookies",
			highlights: [
				"Essential cookies",
				"Analytics cookies",
				"Marketing cookies",
			],
		},
	],

	companyInfo: {
		companyName: "Boxholms Ost AB",
		organizationNumber: "556xxx-xxxx",
		vatNumber: "SE556xxxxxxxx01",
		registeredSeat: "Boxholm",
		offices: [
			{
				name: "Head Office & Dairy",
				address: "Boxholms Mejeri, 590 10 Boxholm, Sweden",
			},
		],
		email: "info@boxholmsost.se",
		phone: "+46 142-510 50",
	},

	termsSection: {
		title: "Terms & Conditions",
		terms: [
			{
				title: "1. Orders and Agreements",
				content: "A purchase agreement is entered when we confirm your order via email. We reserve the right to decline orders in case of pricing errors or stock issues.",
			},
			{
				title: "2. Prices and Payment",
				content: "All prices are in SEK including VAT unless otherwise stated. We offer various payment options including card payment and invoice for business customers.",
			},
			{
				title: "3. Delivery",
				content: "Delivery times vary depending on product availability. Fresh products are shipped with temperature-controlled transport. We always communicate expected delivery times at order confirmation.",
			},
			{
				title: "4. Product Quality",
				content: "Our products are made fresh and have limited shelf life. Best before dates are clearly marked on all products. Please store according to product instructions.",
			},
			{
				title: "5. Returns and Complaints",
				content: "Due to the perishable nature of our products, returns are only accepted if products are damaged or defective. Please contact us within 24 hours of delivery for any issues.",
			},
			{
				title: "6. Right of Withdrawal",
				content: "For consumers, 14-day right of withdrawal applies according to distance selling regulations. This does not apply to perishable food products.",
			},
		],
	},

	gdprSection: {
		title: "Your GDPR Rights",
		rights: [
			{
				title: "Right to Access",
				description: "You have the right to know what personal data we process about you.",
			},
			{
				title: "Right to Rectification",
				description: "You have the right to have incorrect data corrected.",
			},
			{
				title: "Right to Erasure",
				description: "Under certain conditions, you have the right to have your data deleted.",
			},
			{
				title: "Right to Restriction",
				description: "You have the right to limit the processing of your data.",
			},
			{
				title: "Right to Data Portability",
				description: "You have the right to receive your data in a machine-readable format.",
			},
			{
				title: "Right to Object",
				description: "You have the right to object to processing for direct marketing.",
			},
		],
		primaryCta: {
			text: "Read Privacy Policy",
			href: "/privacy-policy",
		},
		secondaryCta: {
			text: "Contact Us",
			href: "/contact-us",
		},
	},

	ctaSection: {
		text: "Have questions about our terms or need help? Don't hesitate to contact us - we're happy to assist.",
		primaryCta: {
			text: "Contact Us",
			href: "/contact-us",
		},
		secondaryCta: {
			text: "Call: +46 142-510 50",
			href: "tel:+46142-51050",
		},
	},

	seo: {
		title: "Legal Information - Boxholm Cheese | Terms & Privacy",
		description: "Read about Boxholm Cheese's terms and conditions, privacy policy, and your GDPR rights. Transparent and trustworthy.",
		ogImage: "",
	},
};

// ============================================================================
// SEEDING FUNCTIONS
// ============================================================================

async function seedAboutPage(db: mongoose.mongo.Db) {
	console.log("\n--- Seeding About Page ---");
	const collection = db.collection("about_page");
	const existingDoc = await collection.findOne({});

	if (existingDoc) {
		console.log("About page document exists. Updating...");
		await collection.updateOne(
			{},
			{ $set: { ...aboutPageData, updatedAt: new Date() } }
		);
		console.log("✓ About page updated successfully!");
	} else {
		console.log("Creating new about page document...");
		await collection.insertOne({
			...aboutPageData,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		console.log("✓ About page created successfully!");
	}
}

async function seedTrainingPage(db: mongoose.mongo.Db) {
	console.log("\n--- Seeding Training Page (Workshops) ---");
	const collection = db.collection("training_page");
	const existingDoc = await collection.findOne({});

	if (existingDoc) {
		console.log("Training page document exists. Updating...");
		await collection.updateOne(
			{},
			{ $set: { ...trainingPageData, updatedAt: new Date() } }
		);
		console.log("✓ Training page updated successfully!");
	} else {
		console.log("Creating new training page document...");
		await collection.insertOne({
			...trainingPageData,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		console.log("✓ Training page created successfully!");
	}
}

async function seedStartaEgetPage(db: mongoose.mongo.Db) {
	console.log("\n--- Seeding Starta Eget Page (Partnership) ---");
	const collection = db.collection("starta_eget_page");
	const existingDoc = await collection.findOne({});

	if (existingDoc) {
		console.log("Starta Eget page document exists. Updating...");
		await collection.updateOne(
			{},
			{ $set: { ...startaEgetPageData, updatedAt: new Date() } }
		);
		console.log("✓ Starta Eget page updated successfully!");
	} else {
		console.log("Creating new Starta Eget page document...");
		await collection.insertOne({
			...startaEgetPageData,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		console.log("✓ Starta Eget page created successfully!");
	}
}

async function seedCareersPage(db: mongoose.mongo.Db) {
	console.log("\n--- Seeding Careers Page ---");
	const collection = db.collection("careers_page");
	const existingDoc = await collection.findOne({});

	if (existingDoc) {
		console.log("Careers page document exists. Updating...");
		await collection.updateOne(
			{},
			{ $set: { ...careersPageData, updatedAt: new Date() } }
		);
		console.log("✓ Careers page updated successfully!");
	} else {
		console.log("Creating new Careers page document...");
		await collection.insertOne({
			...careersPageData,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		console.log("✓ Careers page created successfully!");
	}
}

async function seedLegalPage(db: mongoose.mongo.Db) {
	console.log("\n--- Seeding Legal Page ---");
	const collection = db.collection("legal_page");
	const existingDoc = await collection.findOne({});

	if (existingDoc) {
		console.log("Legal page document exists. Updating...");
		await collection.updateOne(
			{},
			{ $set: { ...legalPageData, updatedAt: new Date() } }
		);
		console.log("✓ Legal page updated successfully!");
	} else {
		console.log("Creating new Legal page document...");
		await collection.insertOne({
			...legalPageData,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		console.log("✓ Legal page created successfully!");
	}
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
	const args = process.argv.slice(2);
	const seedAbout = args.includes("--about") || args.includes("--all") || args.length === 0;
	const seedTraining = args.includes("--training") || args.includes("--all") || args.length === 0;
	const seedStarta = args.includes("--starta") || args.includes("--all") || args.length === 0;
	const seedCareers = args.includes("--careers") || args.includes("--all") || args.length === 0;
	const seedLegal = args.includes("--legal") || args.includes("--all") || args.length === 0;

	try {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(MONGODB_URI!);
		console.log("Connected to MongoDB");

		const db = mongoose.connection.db;
		if (!db) {
			throw new Error("Database connection not established");
		}

		if (seedAbout) await seedAboutPage(db);
		if (seedTraining) await seedTrainingPage(db);
		if (seedStarta) await seedStartaEgetPage(db);
		if (seedCareers) await seedCareersPage(db);
		if (seedLegal) await seedLegalPage(db);

		console.log("\n========================================");
		console.log("CHEESE THEME PAGE DATA SEEDED SUCCESSFULLY!");
		console.log("========================================");
		console.log("\nSeeded pages:");
		if (seedAbout) console.log("  ✓ About Page");
		if (seedTraining) console.log("  ✓ Training/Workshops Page");
		if (seedStarta) console.log("  ✓ Partnership Page");
		if (seedCareers) console.log("  ✓ Careers Page");
		if (seedLegal) console.log("  ✓ Legal Page");
		console.log("\n========================================\n");
	} catch (error) {
		console.error("Error seeding pages:", error);
		process.exit(1);
	} finally {
		await mongoose.disconnect();
		console.log("Disconnected from MongoDB");
	}
}

main();
