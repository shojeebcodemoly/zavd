/**
 * Seed script for Cheese/Dairy Farm Home Page
 * Converts the site from medical equipment to cheese/dairy theme
 * Run with: npx tsx scripts/seed-cheese-home.ts
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

// Cheese/Dairy Farm Home Page Data - Milatte style
const homePageData = {
	sectionVisibility: {
		hero: true,
		categoryShowcase: true,
		productCarousel: true,
		promoBanner: true,
		featureBanner: true,
		features: true,
		productShowcase: true,
		imageGallery: true,
		about: true,
		testimonials: true,
		cta: true,
		richContent: false,
	},

	// Category Showcase Section - displays product categories on home page
	categoryShowcase: {
		badge: "POPULAR CATEGORIES",
		title: "Explore Our Categories",
		maxCategories: 3,
	},

	// Product Carousel Section - displays featured products on home page
	productCarousel: {
		badge: "BUY ONLINE",
		title: "Popular Products",
		maxProducts: 6,
	},

	// Promo Banner Section - 1:2 layout with two banners
	promoBanner: {
		leftBanner: {
			badge: "NEW ARRIVALS",
			title: "Fresh Artisan Cheese",
			subtitle: "",
			description: "Handcrafted with care from locally sourced milk. Experience the authentic taste of traditional cheese making.",
			image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&h=1000&fit=crop",
			ctaText: "SHOP NOW",
			ctaHref: "/products",
		},
		rightBanner: {
			badge: "Award Winning",
			title: "Best Dairy Farm",
			subtitle: "2024",
			description: "",
			image: "https://images.unsplash.com/photo-1559561853-08451507cbe7?w=800&h=1000&fit=crop",
			ctaText: "LEARN MORE",
			ctaHref: "/about-us",
		},
	},

	// Feature Banner Section - white background with image, title with highlight, and feature cards
	featureBanner: {
		image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&h=500&fit=crop",
		title: "Our farm uses eco-friendly technologies and practices to minimize the environmental impact.",
		titleHighlight: "eco-friendly",
		features: [
			{
				icon: "Leaf",
				title: "100% Organic Product",
				description: "Guaranteed quality from our farm to your table",
			},
			{
				icon: "MilkOff",
				title: "High Quality Milk",
				description: "Freshness and naturalness are the main principles of our production",
			},
			{
				icon: "Package",
				title: "Wide Assortment",
				description: "We produce not only traditional but also innovative products",
			},
			{
				icon: "Box",
				title: "Perfect Packaging",
				description: "Freshness and naturalness are the main principles of our production",
			},
		],
	},

	// Hero Section - Slider Mode (Milatte style)
	hero: {
		isSlider: true,
		autoPlayInterval: 6000,
		showArrows: true,
		slides: [
			{
				badge: "BORN OF NATURE",
				title: "TRADITIONS OF QUALITY IN EVERY BITE",
				subtitle:
					"We carefully follow traditions passed down through generations to ensure every wheel of cheese is flawless. We use only natural ingredients and age our cheeses in special conditions.",
				backgroundImage: "/storage/images/hero/hero-cows.jpg",
				ctaText: "READ MORE",
				ctaHref: "/about-us",
				isActive: true,
			},
			{
				badge: "BORN OF NATURE",
				title: "A TASTE BORN IN THE MEADOWS",
				subtitle:
					"We carefully follow traditions passed down through generations to ensure every wheel of cheese is flawless. We use only natural ingredients and age our cheeses in special conditions.",
				backgroundImage: "/storage/images/hero/hero-cheese.jpg",
				ctaText: "READ MORE",
				ctaHref: "/our-store",
				isActive: true,
			},
			{
				badge: "ARTISAN CRAFTED",
				title: "FROM OUR FARM TO YOUR TABLE",
				subtitle:
					"Experience the authentic taste of handcrafted dairy products made with love and dedication. Every product tells a story of passion and quality.",
				backgroundImage: "/storage/images/hero/hero-farm.jpg",
				ctaText: "EXPLORE",
				ctaHref: "/products",
				isActive: true,
			},
		],
		// Legacy fields (not used in slider mode but kept for fallback)
		badge: "",
		title: "",
		titleHighlight: "",
		subtitle: "",
		backgroundImage: "",
		mainImage: "",
	},

	// Features Section - Dairy/Cheese USPs
	features: [
		{
			icon: "Leaf",
			title: "100% Natural",
			description:
				"All our products are made from pure, natural ingredients without any artificial additives or preservatives.",
		},
		{
			icon: "Award",
			title: "Award Winning",
			description:
				"Our cheeses have won numerous awards for their exceptional taste and quality craftsmanship.",
		},
		{
			icon: "Clock",
			title: "Traditional Methods",
			description:
				"We use time-honored techniques passed down through generations to create authentic flavors.",
		},
		{
			icon: "Heart",
			title: "Made with Love",
			description:
				"Every product is crafted with passion and care by our dedicated artisan cheesemakers.",
		},
		{
			icon: "Truck",
			title: "Farm Fresh Delivery",
			description:
				"Get fresh dairy products delivered straight from our farm to your doorstep.",
		},
		{
			icon: "Shield",
			title: "Quality Guaranteed",
			description:
				"We stand behind every product with our 100% satisfaction guarantee.",
		},
	],

	// Product Showcase Section
	productShowcase: {
		title: "Natural Dairy Products",
		subtitle:
			"Discover our range of artisan cheeses and dairy products, crafted with care using traditional methods",
		ctaText: "View All Products",
		ctaHref: "/products",
		products: [
			{
				name: "Aged Cheddar",
				category: "Hard Cheese",
				description:
					"Our signature aged cheddar, matured for 18 months to develop a rich, complex flavor with crystalline texture.",
				status: "Best Seller",
				image: "/storage/images/products/aged-cheddar.jpg",
				href: "/products",
			},
			{
				name: "Creamy Brie",
				category: "Soft Cheese",
				description:
					"A luxuriously creamy brie with a bloomy white rind and buttery, earthy flavor that melts in your mouth.",
				status: "Popular",
				image: "/storage/images/products/creamy-brie.jpg",
				href: "/products",
			},
			{
				name: "Fresh Mozzarella",
				category: "Fresh Cheese",
				description:
					"Hand-pulled mozzarella made fresh daily. Perfect for salads, pizzas, or simply enjoyed with olive oil.",
				status: "New",
				image: "/storage/images/products/fresh-mozzarella.jpg",
				href: "/products",
			},
			{
				name: "Farmhouse Butter",
				category: "Dairy",
				description:
					"Rich, golden butter churned from fresh cream. A taste of pure countryside in every spread.",
				status: "",
				image: "/storage/images/products/farmhouse-butter.jpg",
				href: "/products",
			},
		],
	},

	// Image Gallery Section
	imageGallery: {
		badge: "Our Story",
		title: "From Farm to Table",
		subtitle:
			"Experience the journey of our dairy products from our beautiful countryside farm",
		images: [
			{
				src: "/storage/images/gallery/farm-landscape.jpg",
				title: "Our Farm",
				subtitle:
					"Nestled in the rolling hills, our farm provides the perfect environment for happy, healthy cows.",
			},
			{
				src: "/storage/images/gallery/cheese-making.jpg",
				title: "Artisan Craftsmanship",
				subtitle:
					"Watch our master cheesemakers transform fresh milk into exceptional cheese using traditional methods.",
			},
			{
				src: "/storage/images/gallery/aging-cellar.jpg",
				title: "Aging Cellars",
				subtitle:
					"Our temperature-controlled cellars provide the perfect conditions for aging our cheeses to perfection.",
			},
			{
				src: "/storage/images/gallery/happy-cows.jpg",
				title: "Happy Cows",
				subtitle:
					"Our grass-fed cows roam freely, producing the rich, flavorful milk that makes our cheese special.",
			},
		],
		ctaTitle: "Visit Our Farm",
		ctaSubtitle:
			"Experience the beauty of our dairy farm and see how our products are made",
		ctaButtonText: "Book a Tour",
	},

	// About Section
	aboutSection: {
		badge: "About Milatte Farm",
		title: "A Family Tradition of",
		titleHighlight: "Quality & Excellence",
		content: `For over three generations, our family has been dedicated to producing the finest artisan cheeses and dairy products. What started as a small family farm has grown into a beloved local institution, known for our commitment to quality and traditional methods.

Our farm sits on 200 acres of pristine countryside, where our grass-fed cows graze freely on lush pastures. We believe that happy cows produce the best milk, and the best milk makes the finest cheese.

Every wheel of cheese that leaves our farm carries with it our family's dedication to excellence. From the morning milk collection to the final aging process, we oversee every step to ensure you receive nothing but the best.`,
		image: "/storage/images/about/family-farm.jpg",
		benefits: [
			"100% grass-fed, free-range dairy cows",
			"No artificial preservatives or additives",
			"Traditional cheese-making methods",
			"Award-winning artisan cheeses",
			"Family-owned for three generations",
			"Sustainable farming practices",
		],
		primaryCta: {
			text: "Learn Our Story",
			href: "/about-us",
			variant: "primary",
		},
		secondaryCta: {
			text: "Visit the Farm",
			href: "/contact-us",
			variant: "outline",
		},
		certificationBadge: {
			title: "Certified Organic",
			description: "USDA certified organic dairy farm",
		},
	},

	// Testimonials Section
	testimonialsSection: {
		title: "What Our Customers Say",
		subtitle:
			"Join thousands of happy customers who have discovered the Milatte difference",
		testimonials: [
			{
				quote:
					"The aged cheddar from Milatte Farm is absolutely incredible. You can taste the quality and care in every bite. My family won't eat any other cheese now!",
				author: "Sarah Mitchell",
				role: "Food Blogger",
				company: "The Culinary Journey",
			},
			{
				quote:
					"As a chef, I'm very particular about my ingredients. Milatte's mozzarella is the freshest I've ever used - it's transformed our caprese salads.",
				author: "Marco Rossi",
				role: "Executive Chef",
				company: "Bella Vista Restaurant",
			},
			{
				quote:
					"I've been ordering from Milatte Farm for years. The consistency and quality are unmatched. Plus, knowing it's sustainably produced makes it even better.",
				author: "Emma Thompson",
				role: "Home Cook",
				company: "Loyal Customer",
			},
		],
	},

	// CTA Section
	ctaSection: {
		title: "Ready to Taste the Difference?",
		subtitle:
			"Order our artisan cheeses and dairy products today, or visit our farm for a tour",
		phoneTitle: "Call Us",
		phoneSubtitle: "+1 (555) 123-4567",
		emailTitle: "Email Us",
		emailSubtitle: "hello@milattefarm.com",
		formTitle: "Get in Touch",
		formSubtitle: "Fill out the form and we'll get back to you within 24 hours",
		formCtaText: "Send Message",
		formCtaHref: "/contact-us",
	},

	// SEO
	seo: {
		title: "Milatte Farm - Artisan Cheese & Natural Dairy Products",
		description:
			"Discover premium artisan cheeses and natural dairy products from Milatte Farm. Family-owned, traditionally crafted, and made with love for over three generations.",
		ogImage: "/storage/images/og-image.jpg",
	},
};

// Site Settings Data for Cheese Theme
const siteSettingsData = {
	companyName: "Milatte Dairy Farm",
	orgNumber: "123-456-789",
	vatNumber: "US123456789",
	phone: "+1 (555) 123-4567",
	email: "hello@milattefarm.com",
	noreplyEmail: "noreply@milattefarm.com",
	offices: [
		{
			name: "Main Farm",
			street: "1234 Countryside Lane",
			postalCode: "12345",
			city: "Green Valley",
			country: "USA",
			isHeadquarters: true,
			isVisible: true,
		},
		{
			name: "City Store",
			street: "567 Market Street",
			postalCode: "67890",
			city: "Downtown",
			country: "USA",
			isHeadquarters: false,
			isVisible: true,
		},
	],
	socialMedia: {
		facebook: "https://www.facebook.com/milattefarm",
		instagram: "https://www.instagram.com/milattefarm",
		twitter: "https://www.twitter.com/milattefarm",
		youtube: "https://www.youtube.com/milattefarm",
	},
	seo: {
		siteName: "Milatte Farm",
		siteDescription:
			"Premium artisan cheeses and natural dairy products from our family farm. Traditionally crafted with love for over three generations.",
	},
	branding: {
		logoUrl: "/storage/images/milatte-logo.svg",
	},
	footer: {
		banner: {
			enabled: true,
			backgroundImage: "/storage/images/footer/footer-banner.jpg",
			badge: "CHEESEMAKING",
			title: "We make the creative solutions for modern brands.",
			ctaText: "About Us",
			ctaHref: "/about-us",
		},
		quickLinksTitle: "Links",
		contactTitle: "Office",
		newsletterTitle: "Stay Updated",
		quickLinks: [
			{ label: "About Us", href: "/about-us" },
			{ label: "Our Products", href: "/products" },
			{ label: "Our Store", href: "/our-store" },
			{ label: "Blog", href: "/blog" },
			{ label: "Contact", href: "/contact-us" },
		],
		newsletterDescription:
			"Subscribe to get updates on new products, recipes, and farm news.",
		newsletterPlaceholder: "Your email address",
		newsletterButtonText: "Subscribe",
		bottomLinks: [
			{ label: "Privacy Policy", href: "/faq" },
			{ label: "Terms of Service", href: "/faq" },
			{ label: "Sitemap", href: "/sitemap.xml" },
		],
	},
};

// Sample Products Data for Cheese Theme - with full details for product pages
const productsData = [
	{
		title: "Premium Aged Cheddar",
		slug: "aged-cheddar",
		description: "Our signature aged cheddar, matured for 18 months to develop a rich, complex flavor with crystalline texture. Perfect for cheese boards and gourmet cooking.",
		shortDescription: "18-month aged cheddar with rich, complex flavor",
		productDescription: `<h2>A True Artisan Masterpiece</h2>
<p>Our Premium Aged Cheddar is the crown jewel of Milatte Farm. Crafted using traditional methods passed down through three generations, this cheese represents the very best of artisan cheesemaking.</p>

<h3>The Aging Process</h3>
<p>Each wheel of our cheddar is aged for a minimum of 18 months in our temperature-controlled caves. During this time, the cheese develops its signature crystalline texture and complex flavor profile that has won numerous awards.</p>

<h3>Tasting Notes</h3>
<p>Expect rich, nutty undertones with hints of caramel and a pleasant sharpness that lingers on the palate. The texture is firm yet creamy, with those coveted calcium lactate crystals that indicate a well-aged cheese.</p>

<h3>Perfect Pairings</h3>
<ul>
<li>Full-bodied red wines like Cabernet Sauvignon</li>
<li>Craft ales and stouts</li>
<li>Fresh apple slices and honey</li>
<li>Artisan crackers and crusty bread</li>
</ul>`,
		overviewImage: "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=1200&h=800&fit=crop",
		productImages: [
			"https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=800&h=800&fit=crop",
		],
		publishType: "publish",
		visibility: "public",
		benefits: ["Rich, complex flavor", "Perfect for cheese boards", "Aged 18 months", "Award-winning quality", "100% natural ingredients"],
		certifications: ["USDA Organic", "Non-GMO Verified", "Award Winner 2024"],
		treatments: ["Cheese Board", "Cooking", "Snacking", "Wine Pairing"],
		techSpecifications: [
			{ title: "Aging Period", description: "18 months minimum" },
			{ title: "Milk Type", description: "Grass-fed cow's milk" },
			{ title: "Fat Content", description: "34%" },
			{ title: "Weight", description: "Available in 200g, 500g, and 1kg" },
			{ title: "Storage", description: "Refrigerate at 4-8°C" },
			{ title: "Shelf Life", description: "6 months unopened" },
		],
		qa: [
			{ question: "How long has this cheddar been aged?", answer: "Our Premium Aged Cheddar is aged for a minimum of 18 months in temperature-controlled caves to develop its signature complex flavor and crystalline texture." },
			{ question: "Is this cheese suitable for vegetarians?", answer: "Yes, we use vegetable rennet in all our cheeses, making them suitable for vegetarians." },
			{ question: "How should I store this cheese?", answer: "Store in the refrigerator at 4-8°C. For best flavor, remove from the fridge 30 minutes before serving." },
			{ question: "Can I freeze this cheese?", answer: "While freezing is possible, we recommend consuming fresh for the best texture and flavor experience." },
		],
		// New Tillamook-style layout fields
		heroSettings: {
			themeColor: "#8B4513", // Saddle brown - earthy cheese color
			badge: "2024 WORLD CHEESE AWARDS",
			ctaText: "WHERE TO BUY",
			ctaUrl: "/contact",
		},
		productVariants: [
			{
				name: "Baby Loaf",
				url: "/produkter/produkt/aged-cheddar",
				icon: "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=100&h=100&fit=crop",
			},
			{
				name: "Block",
				url: "/produkter/produkt/gruyere-reserve",
				icon: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=100&h=100&fit=crop",
			},
			{
				name: "Sliced",
				url: "/produkter/produkt/creamy-brie",
				icon: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=100&h=100&fit=crop",
			},
		],
		accordionSections: [
			{
				title: "NUTRITION & ALLERGENS",
				content: `<h2 style="font-family: serif; font-size: 2rem; margin-bottom: 1rem;">Nutrition Facts</h2>
<p><strong>Serving Size 1 slice (28g)</strong><br/>
<strong>Servings Per Container 8</strong><br/>
<strong>Calories 110</strong></p>

<table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
<thead>
<tr style="border-bottom: 1px solid #ccc;">
<th style="text-align: left; padding: 0.5rem 0;"></th>
<th style="text-align: left; padding: 0.5rem 0;">Amount</th>
<th style="text-align: left; padding: 0.5rem 0;">%DV*</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Total Fat</td><td>9g</td><td>12</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Saturated Fat</td><td>5g</td><td>25</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Trans Fat</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Cholesterol</td><td>30mg</td><td>10</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Sodium</td><td>180mg</td><td>8</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Total Carbohydrates</td><td>1g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Dietary Fiber</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Total Sugars</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 2rem;">Added Sugars</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Protein</td><td>7g</td><td></td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Vitamin D</td><td>0mcg</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Calcium</td><td>200mg</td><td>15</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Iron</td><td>.2mg</td><td>2</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Potassium</td><td>25mg</td><td>0</td></tr>
</tbody>
</table>

<p style="font-size: 0.875rem; color: #666;">* Percent Daily Values (DV) are based on 2,000 calorie diet.</p>

<h3 style="margin-top: 1.5rem; font-weight: bold;">ALLERGENS</h3>
<p>Contains: Milk.</p>`,
				isOpen: true,
			},
			{
				title: "INGREDIENTS",
				content: `<p>Pasteurized milk, salt, cheese cultures, enzymes (vegetable rennet).</p>
<p><strong>No artificial colors, flavors, or preservatives.</strong></p>`,
				isOpen: false,
			},
			{
				title: "STORAGE & HANDLING",
				content: `<p>Keep refrigerated at 4-8°C (39-46°F).</p>
<p>For best flavor, remove from refrigerator 30 minutes before serving.</p>
<p>Once opened, wrap tightly in wax paper or cheese paper and consume within 2-3 weeks.</p>`,
				isOpen: false,
			},
		],
	},
	{
		title: "Creamy French Brie",
		slug: "creamy-brie",
		description: "A luxuriously creamy brie with a bloomy white rind and buttery, earthy flavor that melts in your mouth. Ideal for entertaining.",
		shortDescription: "Luxuriously creamy brie with bloomy white rind",
		productDescription: `<h2>French Elegance, Farm Fresh</h2>
<p>Our Creamy French Brie is a testament to the art of soft-ripened cheesemaking. With its velvety interior and distinctive bloomy white rind, this brie is perfect for those who appreciate refined flavors.</p>

<h3>Craftsmanship</h3>
<p>Made using traditional French methods, our brie undergoes careful aging that allows the characteristic white mold rind to develop, creating that perfect balance of creamy interior and earthy exterior.</p>

<h3>Serving Suggestions</h3>
<p>Best served at room temperature. Let it sit out for 30-45 minutes before serving to allow the interior to reach its optimal creamy consistency.</p>`,
		overviewImage: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=1200&h=800&fit=crop",
		productImages: [
			"https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1559561853-08451507cbe7?w=800&h=800&fit=crop",
		],
		publishType: "publish",
		visibility: "public",
		benefits: ["Creamy, melt-in-mouth texture", "Bloomy white rind", "Perfect for entertaining", "French-style craftsmanship"],
		certifications: ["Artisan Certified", "Farm Fresh"],
		treatments: ["Appetizer", "Wine Pairing", "Cheese Board"],
		techSpecifications: [
			{ title: "Aging Period", description: "4-6 weeks" },
			{ title: "Milk Type", description: "Pasteurized cow's milk" },
			{ title: "Fat Content", description: "60%" },
			{ title: "Weight", description: "200g wheel" },
		],
		qa: [
			{ question: "How do I know when brie is perfectly ripe?", answer: "A ripe brie will feel soft to the touch and have a slight give when pressed gently. The interior should be creamy and oozy." },
			{ question: "Can I eat the rind?", answer: "Absolutely! The white bloomy rind is completely edible and adds a lovely earthy flavor to complement the creamy interior." },
		],
		// New Tillamook-style layout fields
		heroSettings: {
			themeColor: "#5D4E37", // Dark brown - readable with white text
			badge: "ARTISAN CRAFTED",
			ctaText: "FIND IN STORE",
			ctaUrl: "/contact",
		},
		productVariants: [
			{
				name: "Wheel",
				url: "/produkter/produkt/creamy-brie",
				icon: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=100&h=100&fit=crop",
			},
			{
				name: "Wedge",
				url: "/produkter/produkt/gorgonzola-blue",
				icon: "https://images.unsplash.com/photo-1626957341926-98752fc2ba90?w=100&h=100&fit=crop",
			},
		],
		accordionSections: [
			{
				title: "NUTRITION & ALLERGENS",
				content: `<h2 style="font-family: serif; font-size: 2rem; margin-bottom: 1rem;">Nutrition Facts</h2>
<p><strong>Serving Size 1 slice (28g)</strong><br/>
<strong>Servings Per Container 7</strong><br/>
<strong>Calories 120</strong></p>

<table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
<thead>
<tr style="border-bottom: 1px solid #ccc;">
<th style="text-align: left; padding: 0.5rem 0;"></th>
<th style="text-align: left; padding: 0.5rem 0;">Amount</th>
<th style="text-align: left; padding: 0.5rem 0;">%DV*</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Total Fat</td><td>10g</td><td>13</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Saturated Fat</td><td>6g</td><td>30</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Trans Fat</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Cholesterol</td><td>30mg</td><td>10</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Sodium</td><td>200mg</td><td>9</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Total Carbohydrates</td><td>1g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Dietary Fiber</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Total Sugars</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 2rem;">Added Sugars</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Protein</td><td>6g</td><td></td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Vitamin D</td><td>0mcg</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Calcium</td><td>180mg</td><td>15</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Iron</td><td>.2mg</td><td>2</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Potassium</td><td>30mg</td><td>0</td></tr>
</tbody>
</table>

<p style="font-size: 0.875rem; color: #666;">* Percent Daily Values (DV) are based on 2,000 calorie diet.</p>

<h3 style="margin-top: 1.5rem; font-weight: bold;">ALLERGENS</h3>
<p>Contains: Milk.</p>`,
				isOpen: true,
			},
			{
				title: "INGREDIENTS",
				content: `<p>Pasteurized cow's milk, cream, salt, cheese cultures, enzymes.</p>
<p><strong>Rind is edible and made from Penicillium candidum.</strong></p>`,
				isOpen: false,
			},
			{
				title: "SERVING TIPS",
				content: `<p>Remove from refrigerator 30-45 minutes before serving for optimal creaminess.</p>
<p>Pairs beautifully with champagne, light white wines, fresh fruit, and crusty bread.</p>`,
				isOpen: false,
			},
		],
	},
	{
		title: "Fresh Mozzarella",
		slug: "fresh-mozzarella",
		description: "Hand-pulled mozzarella made fresh daily. Perfect for salads, pizzas, or simply enjoyed with olive oil and fresh basil.",
		shortDescription: "Hand-pulled fresh mozzarella, made daily",
		productDescription: `<h2>Made Fresh Every Morning</h2>
<p>Our Fresh Mozzarella is hand-pulled daily using traditional Italian techniques. The result is a soft, milky cheese with a delicate, sweet flavor that's simply incomparable to mass-produced alternatives.</p>

<h3>The Art of Hand-Pulling</h3>
<p>Each ball of mozzarella is stretched and shaped by hand, creating that signature smooth, elastic texture. This artisanal process ensures every piece is crafted with care and attention to detail.</p>`,
		overviewImage: "https://images.unsplash.com/photo-1571024057537-71b8c79df19e?w=1200&h=800&fit=crop",
		productImages: [
			"https://images.unsplash.com/photo-1571024057537-71b8c79df19e?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1634487359989-3e90c9432133?w=800&h=800&fit=crop",
		],
		publishType: "publish",
		visibility: "public",
		benefits: ["Made fresh daily", "Hand-pulled", "Perfect for pizza & salads", "Authentic Italian style"],
		certifications: ["Fresh Daily", "Handcrafted"],
		treatments: ["Pizza", "Caprese Salad", "Pasta"],
		techSpecifications: [
			{ title: "Freshness", description: "Made daily" },
			{ title: "Milk Type", description: "Fresh cow's milk" },
			{ title: "Texture", description: "Soft, elastic" },
			{ title: "Shelf Life", description: "5-7 days refrigerated" },
		],
		qa: [
			{ question: "How fresh is your mozzarella?", answer: "Our mozzarella is made fresh every morning and shipped the same day to ensure maximum freshness." },
		],
		// New Tillamook-style layout fields
		heroSettings: {
			themeColor: "#2E5944", // Forest green - fresh cheese color
			badge: "MADE FRESH DAILY",
			ctaText: "ORDER NOW",
			ctaUrl: "/contact",
		},
		productVariants: [
			{
				name: "Ball",
				url: "/produkter/produkt/fresh-mozzarella",
				icon: "https://images.unsplash.com/photo-1571024057537-71b8c79df19e?w=100&h=100&fit=crop",
			},
			{
				name: "Burrata",
				url: "/produkter/produkt/creamy-brie",
				icon: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=100&h=100&fit=crop",
			},
			{
				name: "Pearls",
				url: "/produkter/produkt/greek-style-yogurt",
				icon: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=100&h=100&fit=crop",
			},
		],
		accordionSections: [
			{
				title: "NUTRITION & ALLERGENS",
				content: `<h2 style="font-family: serif; font-size: 2rem; margin-bottom: 1rem;">Nutrition Facts</h2>
<p><strong>Serving Size 1 oz (28g)</strong><br/>
<strong>Servings Per Container 8</strong><br/>
<strong>Calories 70</strong></p>

<table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
<thead>
<tr style="border-bottom: 1px solid #ccc;">
<th style="text-align: left; padding: 0.5rem 0;"></th>
<th style="text-align: left; padding: 0.5rem 0;">Amount</th>
<th style="text-align: left; padding: 0.5rem 0;">%DV*</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Total Fat</td><td>5g</td><td>6</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Saturated Fat</td><td>3g</td><td>15</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Trans Fat</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Cholesterol</td><td>20mg</td><td>7</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Sodium</td><td>90mg</td><td>4</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Total Carbohydrates</td><td>1g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Dietary Fiber</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Total Sugars</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 2rem;">Added Sugars</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Protein</td><td>5g</td><td></td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Vitamin D</td><td>0mcg</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Calcium</td><td>150mg</td><td>12</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Iron</td><td>0mg</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Potassium</td><td>20mg</td><td>0</td></tr>
</tbody>
</table>

<p style="font-size: 0.875rem; color: #666;">* Percent Daily Values (DV) are based on 2,000 calorie diet.</p>

<h3 style="margin-top: 1.5rem; font-weight: bold;">ALLERGENS</h3>
<p>Contains: Milk.</p>`,
				isOpen: true,
			},
			{
				title: "INGREDIENTS",
				content: `<p>Fresh pasteurized cow's milk, salt, citric acid, enzymes.</p>
<p><strong>Made without artificial preservatives.</strong></p>`,
				isOpen: false,
			},
		],
	},
	{
		title: "Farmhouse Butter",
		slug: "farmhouse-butter",
		description: "Rich, golden butter churned from fresh cream. A taste of pure countryside in every spread. Perfect for baking and cooking.",
		shortDescription: "Rich golden butter from fresh cream",
		productDescription: `<h2>Pure, Golden Goodness</h2>
<p>Our Farmhouse Butter is churned in small batches from the freshest cream, resulting in a rich, golden butter with an incomparable taste. This is butter the way it was meant to be.</p>`,
		overviewImage: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=1200&h=800&fit=crop",
		productImages: [
			"https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&h=800&fit=crop",
		],
		publishType: "publish",
		visibility: "public",
		benefits: ["Fresh cream", "Rich flavor", "Great for baking", "Small batch churned"],
		certifications: ["Farm Fresh", "No Additives"],
		treatments: ["Baking", "Cooking", "Spreading"],
		techSpecifications: [
			{ title: "Fat Content", description: "82%" },
			{ title: "Cream Source", description: "Grass-fed cows" },
			{ title: "Salt", description: "Lightly salted" },
		],
		qa: [
			{ question: "Is this butter salted?", answer: "Yes, our farmhouse butter is lightly salted to enhance the natural cream flavor." },
		],
		// New Tillamook-style layout fields
		heroSettings: {
			themeColor: "#B8860B", // Dark goldenrod - butter color
			badge: "SMALL BATCH",
			ctaText: "BUY NOW",
			ctaUrl: "/contact",
		},
		productVariants: [
			{
				name: "Salted",
				url: "/produkter/produkt/farmhouse-butter",
				icon: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=100&h=100&fit=crop",
			},
			{
				name: "Unsalted",
				url: "/produkter/produkt/organic-whole-milk",
				icon: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=100&h=100&fit=crop",
			},
		],
		accordionSections: [
			{
				title: "NUTRITION & ALLERGENS",
				content: `<h2 style="font-family: serif; font-size: 2rem; margin-bottom: 1rem;">Nutrition Facts</h2>
<p><strong>Serving Size 1 tbsp (14g)</strong><br/>
<strong>Servings Per Container 32</strong><br/>
<strong>Calories 100</strong></p>

<table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
<thead>
<tr style="border-bottom: 1px solid #ccc;">
<th style="text-align: left; padding: 0.5rem 0;"></th>
<th style="text-align: left; padding: 0.5rem 0;">Amount</th>
<th style="text-align: left; padding: 0.5rem 0;">%DV*</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Total Fat</td><td>11g</td><td>14</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Saturated Fat</td><td>7g</td><td>35</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Trans Fat</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Cholesterol</td><td>30mg</td><td>10</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Sodium</td><td>90mg</td><td>4</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Total Carbohydrates</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Dietary Fiber</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Total Sugars</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 2rem;">Added Sugars</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Protein</td><td>0g</td><td></td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Vitamin D</td><td>0mcg</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Calcium</td><td>0mg</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Iron</td><td>0mg</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Potassium</td><td>5mg</td><td>0</td></tr>
</tbody>
</table>

<p style="font-size: 0.875rem; color: #666;">* Percent Daily Values (DV) are based on 2,000 calorie diet.</p>

<h3 style="margin-top: 1.5rem; font-weight: bold;">ALLERGENS</h3>
<p>Contains: Milk.</p>`,
				isOpen: true,
			},
			{
				title: "INGREDIENTS",
				content: `<p>Cream (from grass-fed cows), salt.</p>
<p><strong>No artificial colors or preservatives.</strong></p>`,
				isOpen: false,
			},
		],
	},
	{
		title: "Gorgonzola Blue Cheese",
		slug: "gorgonzola-blue",
		description: "Bold and creamy Italian blue cheese with distinctive blue-green veins. Aged to perfection for a tangy, complex flavor.",
		shortDescription: "Italian blue cheese with bold, tangy flavor",
		productDescription: `<h2>Bold Italian Character</h2>
<p>Our Gorgonzola is a bold, creamy blue cheese that showcases the best of Italian cheesemaking traditions. The distinctive blue-green veins running through the creamy paste create a striking appearance and complex flavor.</p>`,
		overviewImage: "https://images.unsplash.com/photo-1626957341926-98752fc2ba90?w=1200&h=800&fit=crop",
		productImages: [
			"https://images.unsplash.com/photo-1626957341926-98752fc2ba90?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1559561853-08451507cbe7?w=800&h=800&fit=crop",
		],
		publishType: "publish",
		visibility: "public",
		benefits: ["Bold flavor", "Creamy texture", "Aged to perfection", "Italian style"],
		certifications: ["Artisan Crafted"],
		treatments: ["Salads", "Pasta", "Wine Pairing", "Cheese Board"],
		techSpecifications: [
			{ title: "Aging Period", description: "3-4 months" },
			{ title: "Type", description: "Dolce (sweet/creamy)" },
			{ title: "Fat Content", description: "48%" },
		],
		qa: [
			{ question: "Is blue cheese safe to eat?", answer: "Yes! The blue mold (Penicillium roqueforti) used in blue cheeses is completely safe and gives the cheese its distinctive flavor." },
		],
		// New Tillamook-style layout fields
		heroSettings: {
			themeColor: "#1e3a5f", // Deep blue - blue cheese color
			badge: "CAVE AGED",
			ctaText: "ORDER NOW",
			ctaUrl: "/contact",
		},
		productVariants: [
			{
				name: "Dolce",
				url: "/produkter/produkt/gorgonzola-blue",
				icon: "https://images.unsplash.com/photo-1626957341926-98752fc2ba90?w=100&h=100&fit=crop",
			},
			{
				name: "Piccante",
				url: "/produkter/produkt/aged-cheddar",
				icon: "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=100&h=100&fit=crop",
			},
			{
				name: "Crumbles",
				url: "/produkter/produkt/gruyere-reserve",
				icon: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=100&h=100&fit=crop",
			},
		],
		accordionSections: [
			{
				title: "NUTRITION & ALLERGENS",
				content: `<h2 style="font-family: serif; font-size: 2rem; margin-bottom: 1rem;">Nutrition Facts</h2>
<p><strong>Serving Size 1 oz (28g)</strong><br/>
<strong>Servings Per Container 6</strong><br/>
<strong>Calories 100</strong></p>

<table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
<thead>
<tr style="border-bottom: 1px solid #ccc;">
<th style="text-align: left; padding: 0.5rem 0;"></th>
<th style="text-align: left; padding: 0.5rem 0;">Amount</th>
<th style="text-align: left; padding: 0.5rem 0;">%DV*</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Total Fat</td><td>8g</td><td>10</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Saturated Fat</td><td>5g</td><td>25</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Trans Fat</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Cholesterol</td><td>25mg</td><td>8</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Sodium</td><td>350mg</td><td>15</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Total Carbohydrates</td><td>1g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Dietary Fiber</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Total Sugars</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 2rem;">Added Sugars</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Protein</td><td>6g</td><td></td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Vitamin D</td><td>0mcg</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Calcium</td><td>150mg</td><td>12</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Iron</td><td>.1mg</td><td>1</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Potassium</td><td>25mg</td><td>0</td></tr>
</tbody>
</table>

<p style="font-size: 0.875rem; color: #666;">* Percent Daily Values (DV) are based on 2,000 calorie diet.</p>

<h3 style="margin-top: 1.5rem; font-weight: bold;">ALLERGENS</h3>
<p>Contains: Milk. Contains Penicillium roqueforti cultures.</p>`,
				isOpen: true,
			},
			{
				title: "INGREDIENTS",
				content: `<p>Pasteurized cow's milk, salt, cheese cultures, Penicillium roqueforti, enzymes.</p>
<p><strong>The blue veining is created by Penicillium roqueforti mold.</strong></p>`,
				isOpen: false,
			},
			{
				title: "PAIRING SUGGESTIONS",
				content: `<p>Pairs excellently with:</p>
<ul>
<li>Sweet wines like Port or Sauternes</li>
<li>Fresh pears and walnuts</li>
<li>Honey drizzle</li>
<li>Steak and gourmet burgers</li>
</ul>`,
				isOpen: false,
			},
		],
	},
	{
		title: "Gruyère Reserve",
		slug: "gruyere-reserve",
		description: "Swiss-style Gruyère aged for 12 months. Nutty, slightly sweet flavor perfect for fondue and gratins.",
		shortDescription: "12-month aged Swiss-style Gruyère",
		productDescription: `<h2>Swiss Tradition, American Craftsmanship</h2>
<p>Our Gruyère Reserve combines traditional Swiss cheesemaking techniques with the finest American dairy. Aged for 12 months, it develops the nutty, slightly sweet flavor that makes Gruyère beloved worldwide.</p>`,
		overviewImage: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=1200&h=800&fit=crop",
		productImages: [
			"https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=800&h=800&fit=crop",
		],
		publishType: "publish",
		visibility: "public",
		benefits: ["Nutty flavor", "Great for fondue", "12-month aged", "Excellent melting"],
		certifications: ["Cave Aged", "Premium Reserve"],
		treatments: ["Fondue", "Gratins", "French Onion Soup", "Croque Monsieur"],
		techSpecifications: [
			{ title: "Aging Period", description: "12 months" },
			{ title: "Milk Type", description: "Raw cow's milk" },
			{ title: "Fat Content", description: "45%" },
		],
		qa: [
			{ question: "What makes Gruyère good for melting?", answer: "Gruyère has an ideal fat-to-moisture ratio that allows it to melt smoothly without becoming stringy or oily." },
		],
		// New Tillamook-style layout fields
		heroSettings: {
			themeColor: "#D2691E", // Chocolate brown - aged cheese color
			badge: "PREMIUM RESERVE",
			ctaText: "FIND IN STORE",
			ctaUrl: "/contact",
		},
		productVariants: [
			{
				name: "Reserve",
				url: "/produkter/produkt/gruyere-reserve",
				icon: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=100&h=100&fit=crop",
			},
			{
				name: "Classic",
				url: "/produkter/produkt/aged-cheddar",
				icon: "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=100&h=100&fit=crop",
			},
			{
				name: "Shredded",
				url: "/produkter/produkt/fresh-mozzarella",
				icon: "https://images.unsplash.com/photo-1571024057537-71b8c79df19e?w=100&h=100&fit=crop",
			},
		],
		accordionSections: [
			{
				title: "NUTRITION & ALLERGENS",
				content: `<h2 style="font-family: serif; font-size: 2rem; margin-bottom: 1rem;">Nutrition Facts</h2>
<p><strong>Serving Size 1 oz (28g)</strong><br/>
<strong>Servings Per Container 8</strong><br/>
<strong>Calories 117</strong></p>

<table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
<thead>
<tr style="border-bottom: 1px solid #ccc;">
<th style="text-align: left; padding: 0.5rem 0;"></th>
<th style="text-align: left; padding: 0.5rem 0;">Amount</th>
<th style="text-align: left; padding: 0.5rem 0;">%DV*</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Total Fat</td><td>9g</td><td>12</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Saturated Fat</td><td>5g</td><td>25</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Trans Fat</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Cholesterol</td><td>31mg</td><td>10</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Sodium</td><td>95mg</td><td>4</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Total Carbohydrates</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Dietary Fiber</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Total Sugars</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 2rem;">Added Sugars</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Protein</td><td>8g</td><td></td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Vitamin D</td><td>0mcg</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Calcium</td><td>287mg</td><td>22</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Iron</td><td>.1mg</td><td>1</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Potassium</td><td>23mg</td><td>0</td></tr>
</tbody>
</table>

<p style="font-size: 0.875rem; color: #666;">* Percent Daily Values (DV) are based on 2,000 calorie diet.</p>

<h3 style="margin-top: 1.5rem; font-weight: bold;">ALLERGENS</h3>
<p>Contains: Milk. Made from raw milk.</p>`,
				isOpen: true,
			},
			{
				title: "INGREDIENTS",
				content: `<p>Raw cow's milk, salt, cheese cultures, enzymes.</p>
<p><strong>Cave aged for 12 months for optimal flavor development.</strong></p>`,
				isOpen: false,
			},
			{
				title: "COOKING TIPS",
				content: `<p>Perfect for:</p>
<ul>
<li>Classic Swiss fondue</li>
<li>French onion soup</li>
<li>Croque Monsieur sandwiches</li>
<li>Gratins and au gratin potatoes</li>
</ul>
<p>Melts smoothly without becoming stringy.</p>`,
				isOpen: false,
			},
		],
	},
	{
		title: "Organic Whole Milk",
		slug: "organic-whole-milk",
		description: "Fresh organic whole milk from our grass-fed cows. Rich in nutrients and naturally creamy.",
		shortDescription: "Fresh organic milk from grass-fed cows",
		productDescription: `<h2>Pure, Natural Goodness</h2>
<p>Our Organic Whole Milk comes from happy, grass-fed cows that roam freely on our pastures. The result is milk that's richer in nutrients and naturally creamier than conventional alternatives.</p>`,
		overviewImage: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=1200&h=800&fit=crop",
		productImages: [
			"https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&h=800&fit=crop",
		],
		publishType: "publish",
		visibility: "public",
		benefits: ["Organic certified", "Grass-fed", "Rich in nutrients", "No hormones or antibiotics"],
		certifications: ["USDA Organic", "Grass-Fed Certified"],
		treatments: ["Drinking", "Cooking", "Baking", "Coffee"],
		techSpecifications: [
			{ title: "Fat Content", description: "3.5%" },
			{ title: "Source", description: "100% grass-fed cows" },
			{ title: "Pasteurization", description: "Gently pasteurized" },
		],
		qa: [
			{ question: "Why is grass-fed milk better?", answer: "Grass-fed milk contains higher levels of omega-3 fatty acids and conjugated linoleic acid (CLA), plus more vitamins A and E." },
		],
		// New Tillamook-style layout fields
		heroSettings: {
			themeColor: "#1B4D3E", // Dark green - fresh milk color
			badge: "USDA ORGANIC",
			ctaText: "SUBSCRIBE & SAVE",
			ctaUrl: "/contact",
		},
		productVariants: [
			{
				name: "Whole",
				url: "/produkter/produkt/organic-whole-milk",
				icon: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=100&h=100&fit=crop",
			},
			{
				name: "2%",
				url: "/produkter/produkt/greek-style-yogurt",
				icon: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=100&h=100&fit=crop",
			},
			{
				name: "Skim",
				url: "/produkter/produkt/farmhouse-butter",
				icon: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=100&h=100&fit=crop",
			},
		],
		accordionSections: [
			{
				title: "NUTRITION & ALLERGENS",
				content: `<h2 style="font-family: serif; font-size: 2rem; margin-bottom: 1rem;">Nutrition Facts</h2>
<p><strong>Serving Size 1 cup (240ml)</strong><br/>
<strong>Servings Per Container 4</strong><br/>
<strong>Calories 150</strong></p>

<table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
<thead>
<tr style="border-bottom: 1px solid #ccc;">
<th style="text-align: left; padding: 0.5rem 0;"></th>
<th style="text-align: left; padding: 0.5rem 0;">Amount</th>
<th style="text-align: left; padding: 0.5rem 0;">%DV*</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Total Fat</td><td>8g</td><td>10</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Saturated Fat</td><td>5g</td><td>25</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Trans Fat</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Cholesterol</td><td>35mg</td><td>12</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Sodium</td><td>105mg</td><td>5</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Total Carbohydrates</td><td>12g</td><td>4</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Dietary Fiber</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Total Sugars</td><td>12g</td><td></td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 2rem;">Added Sugars</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Protein</td><td>8g</td><td></td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Vitamin D</td><td>3mcg</td><td>15</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Calcium</td><td>300mg</td><td>23</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Iron</td><td>0mg</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Potassium</td><td>380mg</td><td>8</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Vitamin A</td><td>112mcg</td><td>12</td></tr>
</tbody>
</table>

<p style="font-size: 0.875rem; color: #666;">* Percent Daily Values (DV) are based on 2,000 calorie diet.</p>

<h3 style="margin-top: 1.5rem; font-weight: bold;">ALLERGENS</h3>
<p>Contains: Milk.</p>`,
				isOpen: true,
			},
			{
				title: "INGREDIENTS",
				content: `<p>Organic whole milk, Vitamin D3.</p>
<p><strong>No added hormones (rBST/rBGH). No antibiotics.</strong></p>`,
				isOpen: false,
			},
			{
				title: "ABOUT OUR COWS",
				content: `<p>Our cows graze on organic pastures and are treated with care and respect. They receive:</p>
<ul>
<li>100% organic feed</li>
<li>Free-range access to pastures</li>
<li>No hormones or antibiotics</li>
<li>Regular veterinary care</li>
</ul>`,
				isOpen: false,
			},
		],
	},
	{
		title: "Greek Style Yogurt",
		slug: "greek-style-yogurt",
		description: "Thick, creamy Greek-style yogurt made from our farm-fresh milk. High in protein and probiotics.",
		shortDescription: "Thick creamy Greek yogurt, high in protein",
		productDescription: `<h2>Protein-Packed Perfection</h2>
<p>Our Greek Style Yogurt is strained the traditional way to create an exceptionally thick, creamy texture. Packed with protein and live active cultures, it's as nutritious as it is delicious.</p>`,
		overviewImage: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1200&h=800&fit=crop",
		productImages: [
			"https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=800&fit=crop",
			"https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=800&h=800&fit=crop",
		],
		publishType: "publish",
		visibility: "public",
		benefits: ["High protein", "Live probiotics", "Thick and creamy", "No artificial ingredients"],
		certifications: ["Probiotic Certified", "Non-GMO"],
		treatments: ["Breakfast", "Smoothies", "Parfaits", "Cooking"],
		techSpecifications: [
			{ title: "Protein", description: "17g per serving" },
			{ title: "Probiotics", description: "Live active cultures" },
			{ title: "Fat Content", description: "0%, 2%, or 5% options" },
		],
		qa: [
			{ question: "What probiotics are in this yogurt?", answer: "Our yogurt contains Lactobacillus bulgaricus and Streptococcus thermophilus, plus added Lactobacillus acidophilus and Bifidus for extra gut health benefits." },
		],
		// New Tillamook-style layout fields
		heroSettings: {
			themeColor: "#4B0082", // Indigo - yogurt color
			badge: "HIGH PROTEIN",
			ctaText: "ORDER NOW",
			ctaUrl: "/contact",
		},
		productVariants: [
			{
				name: "Plain",
				url: "/produkter/produkt/greek-style-yogurt",
				icon: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=100&h=100&fit=crop",
			},
			{
				name: "Honey",
				url: "/produkter/produkt/organic-whole-milk",
				icon: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=100&h=100&fit=crop",
			},
			{
				name: "Berry",
				url: "/produkter/produkt/fresh-mozzarella",
				icon: "https://images.unsplash.com/photo-1571024057537-71b8c79df19e?w=100&h=100&fit=crop",
			},
			{
				name: "Vanilla",
				url: "/produkter/produkt/creamy-brie",
				icon: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=100&h=100&fit=crop",
			},
		],
		accordionSections: [
			{
				title: "NUTRITION & ALLERGENS",
				content: `<h2 style="font-family: serif; font-size: 2rem; margin-bottom: 1rem;">Nutrition Facts</h2>
<p><strong>Serving Size 1 container (170g)</strong><br/>
<strong>Servings Per Container 1</strong><br/>
<strong>Calories 100</strong></p>

<table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
<thead>
<tr style="border-bottom: 1px solid #ccc;">
<th style="text-align: left; padding: 0.5rem 0;"></th>
<th style="text-align: left; padding: 0.5rem 0;">Amount</th>
<th style="text-align: left; padding: 0.5rem 0;">%DV*</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Total Fat</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Saturated Fat</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Trans Fat</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Cholesterol</td><td>10mg</td><td>3</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Sodium</td><td>65mg</td><td>3</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Total Carbohydrates</td><td>6g</td><td>2</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Dietary Fiber</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 1rem;">Total Sugars</td><td>4g</td><td></td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0; padding-left: 2rem;">Added Sugars</td><td>0g</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Protein</td><td>17g</td><td>34</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Vitamin D</td><td>0mcg</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Calcium</td><td>200mg</td><td>15</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Iron</td><td>0mg</td><td>0</td></tr>
<tr style="border-bottom: 1px solid #eee;"><td style="padding: 0.5rem 0;">Potassium</td><td>240mg</td><td>5</td></tr>
</tbody>
</table>

<p style="font-size: 0.875rem; color: #666;">* Percent Daily Values (DV) are based on 2,000 calorie diet.</p>

<h3 style="margin-top: 1.5rem; font-weight: bold;">ALLERGENS</h3>
<p>Contains: Milk.</p>`,
				isOpen: true,
			},
			{
				title: "INGREDIENTS",
				content: `<p>Cultured pasteurized nonfat milk.</p>
<p><strong>Contains live and active cultures:</strong> S. Thermophilus, L. Bulgaricus, L. Acidophilus, Bifidus.</p>`,
				isOpen: false,
			},
			{
				title: "PROBIOTIC BENEFITS",
				content: `<p>Our Greek yogurt contains live active cultures that support:</p>
<ul>
<li>Digestive health</li>
<li>Immune system function</li>
<li>Nutrient absorption</li>
<li>Overall gut health</li>
</ul>`,
				isOpen: false,
			},
		],
	},
];

// Sample Categories Data for Cheese Theme with Unsplash images
const categoriesData = [
	{
		name: "Fresh Milk",
		slug: "fresh-milk",
		description: "Farm-fresh milk straight from our happy, grass-fed cows. Available in whole, low-fat, and skim varieties.",
		image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&h=1000&fit=crop",
		order: 1,
		isActive: true,
		seo: {
			title: "Fresh Milk | Milatte Farm",
			description: "Farm-fresh milk from grass-fed cows. Organic, delicious, and delivered fresh to your door.",
		},
	},
	{
		name: "Blue Cheeses",
		slug: "blue-cheeses",
		description: "Rich, bold blue cheeses aged to perfection in our temperature-controlled caves.",
		image: "https://images.unsplash.com/photo-1626957341926-98752fc2ba90?w=800&h=1000&fit=crop",
		order: 2,
		isActive: true,
		seo: {
			title: "Blue Cheeses | Milatte Farm",
			description: "Artisan blue cheeses crafted with traditional methods. Bold flavors, creamy textures.",
		},
	},
	{
		name: "Dairy Products",
		slug: "dairy-products",
		description: "Premium butter, cream, yogurt, and other dairy delights made fresh daily.",
		image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&h=1000&fit=crop",
		order: 3,
		isActive: true,
		seo: {
			title: "Dairy Products | Milatte Farm",
			description: "Fresh butter, cream, yogurt and more. All made from the finest farm-fresh milk.",
		},
	},
	{
		name: "Aged Cheeses",
		slug: "aged-cheeses",
		description: "Our carefully aged cheeses develop complex, rich flavors over months of patient aging.",
		image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&h=1000&fit=crop",
		order: 4,
		isActive: true,
		seo: {
			title: "Aged Cheeses | Milatte Farm",
			description: "Premium aged cheeses with rich, complex flavors developed over months of careful aging.",
		},
	},
	{
		name: "Soft Cheeses",
		slug: "soft-cheeses",
		description: "Creamy brie, camembert, and other soft-ripened cheeses for the gourmet palate.",
		image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800&h=1000&fit=crop",
		order: 5,
		isActive: true,
		seo: {
			title: "Soft Cheeses | Milatte Farm",
			description: "Luxuriously creamy soft cheeses including brie, camembert, and more.",
		},
	},
];

async function seedCheeseHomePage() {
	try {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(MONGODB_URI!);
		console.log("Connected to MongoDB");

		const db = mongoose.connection.db;
		if (!db) {
			throw new Error("Database connection not established");
		}

		// Seed Categories
		console.log("\n--- Seeding Categories ---");
		const categoriesCollection = db.collection("categories");

		for (const category of categoriesData) {
			const existing = await categoriesCollection.findOne({ slug: category.slug });
			if (existing) {
				console.log(`Updating category: ${category.name}`);
				await categoriesCollection.updateOne(
					{ slug: category.slug },
					{ $set: { ...category, updatedAt: new Date() } }
				);
			} else {
				console.log(`Creating category: ${category.name}`);
				await categoriesCollection.insertOne({
					...category,
					parent: null,
					createdAt: new Date(),
					updatedAt: new Date(),
				});
			}
		}
		console.log("Categories seeded successfully!");

		// Seed Products
		console.log("\n--- Seeding Products ---");
		const productsCollection = db.collection("products");

		for (const product of productsData) {
			const existing = await productsCollection.findOne({ slug: product.slug });
			if (existing) {
				console.log(`Updating product: ${product.title}`);
				await productsCollection.updateOne(
					{ slug: product.slug },
					{ $set: { ...product, updatedAt: new Date() } }
				);
			} else {
				console.log(`Creating product: ${product.title}`);
				await productsCollection.insertOne({
					...product,
					categories: [],
					primaryCategory: null,
					qa: [],
					techSpecifications: [],
					documentation: [],
					seo: {},
					purchaseInfo: {},
					publishedAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				});
			}
		}
		console.log("Products seeded successfully!");

		// Update Home Page
		console.log("\n--- Seeding Home Page ---");
		const homeCollection = db.collection("home_page");
		const existingHome = await homeCollection.findOne({});

		if (existingHome) {
			console.log("Home page document exists. Updating...");
			await homeCollection.updateOne(
				{},
				{ $set: { ...homePageData, updatedAt: new Date() } }
			);
			console.log("Home page updated successfully!");
		} else {
			console.log("Creating new home page document...");
			await homeCollection.insertOne({
				...homePageData,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			console.log("Home page created successfully!");
		}

		// Update Site Settings
		console.log("\n--- Seeding Site Settings ---");
		const settingsCollection = db.collection("site_settings");
		const existingSettings = await settingsCollection.findOne({});

		if (existingSettings) {
			console.log("Site settings document exists. Updating...");
			await settingsCollection.updateOne(
				{},
				{ $set: { ...siteSettingsData, updatedAt: new Date() } }
			);
			console.log("Site settings updated successfully!");
		} else {
			console.log("Creating new site settings document...");
			await settingsCollection.insertOne({
				...siteSettingsData,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			console.log("Site settings created successfully!");
		}

		console.log("\n========================================");
		console.log("CHEESE THEME DATA SEEDED SUCCESSFULLY!");
		console.log("========================================\n");

		console.log("IMPORTANT: Add the following images to your project:");
		console.log("\nHero Slides:");
		console.log("  - public/storage/images/hero/hero-cows.jpg");
		console.log("  - public/storage/images/hero/hero-cheese.jpg");
		console.log("  - public/storage/images/hero/hero-farm.jpg");
		console.log("\nProduct Images:");
		console.log("  - public/storage/images/products/aged-cheddar.jpg");
		console.log("  - public/storage/images/products/creamy-brie.jpg");
		console.log("  - public/storage/images/products/fresh-mozzarella.jpg");
		console.log("  - public/storage/images/products/farmhouse-butter.jpg");
		console.log("\nGallery Images:");
		console.log("  - public/storage/images/gallery/farm-landscape.jpg");
		console.log("  - public/storage/images/gallery/cheese-making.jpg");
		console.log("  - public/storage/images/gallery/aging-cellar.jpg");
		console.log("  - public/storage/images/gallery/happy-cows.jpg");
		console.log("\nCategory Images:");
		console.log("  - public/storage/images/categories/fresh-milk.jpg");
		console.log("  - public/storage/images/categories/blue-cheese.jpg");
		console.log("  - public/storage/images/categories/dairy-products.jpg");
		console.log("  - public/storage/images/categories/aged-cheese.jpg");
		console.log("  - public/storage/images/categories/soft-cheese.jpg");
		console.log("\nAbout Section:");
		console.log("  - public/storage/images/about/family-farm.jpg");
		console.log("\nBranding:");
		console.log("  - public/storage/images/milatte-logo.svg");
		console.log("  - public/storage/images/og-image.jpg");
		console.log("\nFooter Banner:");
		console.log("  - public/storage/images/footer/footer-banner.jpg");
		console.log("\n========================================\n");
	} catch (error) {
		console.error("Error seeding cheese data:", error);
	} finally {
		await mongoose.disconnect();
		console.log("Disconnected from MongoDB");
	}
}

seedCheeseHomePage();
