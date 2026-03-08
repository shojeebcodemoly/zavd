/**
 * Seed script for Blog Posts and Categories
 * Run with: npx tsx scripts/seed-blog.ts
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

// Blog Categories
const blogCategories = [
	{
		name: "Cheese Making",
		slug: "cheese-making",
		description: "Articles about the art and science of cheese making, from traditional methods to modern techniques.",
		order: 1,
		isActive: true,
	},
	{
		name: "Dairy Farming",
		slug: "dairy-farming",
		description: "Stories from our partner farms and insights into sustainable dairy farming practices.",
		order: 2,
		isActive: true,
	},
	{
		name: "Recipes",
		slug: "recipes",
		description: "Delicious recipes featuring our artisan cheeses.",
		order: 3,
		isActive: true,
	},
	{
		name: "News & Events",
		slug: "news-events",
		description: "Latest news from Boxholm Cheese and upcoming events.",
		order: 4,
		isActive: true,
	},
	{
		name: "History & Tradition",
		slug: "history-tradition",
		description: "The rich history of cheese making in Boxholm and Swedish dairy traditions.",
		order: 5,
		isActive: true,
	},
];

// Blog Posts with rich content
const blogPosts = [
	{
		title: "The Art of Traditional Cheese Making",
		slug: "art-of-traditional-cheese-making",
		excerpt: "Discover the time-honored techniques that have been passed down through generations at Boxholm Cheese. Learn how we combine tradition with quality to create our signature cheeses.",
		content: `
<h2>A Heritage of Excellence</h2>
<p>At Boxholm Cheese, we've been crafting artisan cheese since 1890. Our cheese makers follow traditions that have been refined over more than a century, using techniques passed down through generations.</p>

<h3>The Milk: Our Foundation</h3>
<p>Every great cheese starts with exceptional milk. We source our milk exclusively from local farms in Östergötland, where cows graze on lush Swedish pastures. This gives our cheese its distinctive, rich flavor that can't be replicated anywhere else.</p>

<blockquote>
<p>"The quality of our cheese is directly tied to the quality of our milk. We work closely with our partner farms to ensure the highest standards."</p>
<p>— Erik Johansson, Master Cheese Maker</p>
</blockquote>

<h3>The Process</h3>
<p>Our cheese-making process combines traditional methods with modern food safety standards:</p>
<ul>
<li><strong>Pasteurization:</strong> Fresh milk is gently heated to ensure safety while preserving flavor</li>
<li><strong>Culturing:</strong> Special starter cultures are added to begin the transformation</li>
<li><strong>Coagulation:</strong> Natural rennet creates the characteristic curds</li>
<li><strong>Pressing:</strong> Curds are carefully pressed into molds</li>
<li><strong>Aging:</strong> Each wheel is aged to perfection in our climate-controlled cellars</li>
</ul>

<h3>Handcrafted with Care</h3>
<p>Unlike industrial cheese production, our cheeses are turned by hand throughout the aging process. This attention to detail ensures even ripening and develops the complex flavors our customers love.</p>

<p>Visit our dairy to experience the art of cheese making firsthand. We offer tours every Saturday from May through September.</p>
`,
		categorySlug: "cheese-making",
		tags: ["tradition", "craftsmanship", "artisan", "cheese making"],
		publishType: "publish",
	},
	{
		title: "Meet Our Partner Farms",
		slug: "meet-our-partner-farms",
		excerpt: "The secret to our exceptional cheese lies in the quality of our milk. Meet the dedicated farming families who supply us with the finest Swedish milk.",
		content: `
<h2>Local Farms, Global Quality</h2>
<p>Behind every wheel of Boxholm cheese are the hardworking farmers of Östergötland. We partner exclusively with local family farms that share our commitment to quality and sustainability.</p>

<h3>The Svensson Family Farm</h3>
<p>Located just 15 kilometers from our dairy, the Svensson family has been supplying us with milk for three generations. Their herd of 120 Swedish Red cows grazes on organic pastures, producing milk with exceptional butterfat content.</p>

<h3>Sustainable Practices</h3>
<p>All our partner farms follow sustainable farming practices:</p>
<ul>
<li>Pasture-based grazing during summer months</li>
<li>GMO-free feed</li>
<li>Animal welfare certifications</li>
<li>Reduced carbon footprint through local sourcing</li>
</ul>

<h3>The Difference Quality Makes</h3>
<p>Swedish milk is naturally rich in proteins and has a unique fatty acid profile that contributes to the distinctive taste of our cheeses. By sourcing locally, we ensure the freshest possible milk reaches our dairy within hours of milking.</p>

<p>We're proud to support local agriculture while producing world-class cheese. When you choose Boxholm, you're supporting a network of family farms committed to excellence.</p>
`,
		categorySlug: "dairy-farming",
		tags: ["farming", "sustainability", "local", "milk quality"],
		publishType: "publish",
	},
	{
		title: "Classic Swedish Cheese Fondue Recipe",
		slug: "swedish-cheese-fondue-recipe",
		excerpt: "Warm up your winter evenings with this traditional Swedish cheese fondue featuring our Gräddost and Mästarost cheeses.",
		content: `
<h2>Swedish Cheese Fondue</h2>
<p>This cozy fondue recipe showcases the smooth, creamy texture of our Gräddost combined with the nutty depth of Mästarost. Perfect for a gathering with friends and family.</p>

<h3>Ingredients</h3>
<ul>
<li>200g Boxholm Gräddost, grated</li>
<li>200g Boxholm Mästarost, grated</li>
<li>1 clove garlic, halved</li>
<li>300ml dry white wine</li>
<li>1 tablespoon cornstarch</li>
<li>2 tablespoons kirsch (optional)</li>
<li>Freshly ground black pepper</li>
<li>Pinch of nutmeg</li>
</ul>

<h3>Instructions</h3>
<ol>
<li>Rub the inside of a fondue pot with the cut garlic clove</li>
<li>Add the wine and heat gently until it begins to simmer</li>
<li>Gradually add the grated cheeses, stirring constantly in a figure-8 pattern</li>
<li>Mix the cornstarch with the kirsch and stir into the fondue</li>
<li>Season with pepper and nutmeg</li>
<li>Keep warm over a low flame while serving</li>
</ol>

<h3>Serving Suggestions</h3>
<p>Serve with:</p>
<ul>
<li>Cubed crusty bread</li>
<li>Boiled new potatoes</li>
<li>Blanched vegetables (broccoli, cauliflower)</li>
<li>Apple slices</li>
<li>Cured meats</li>
</ul>

<p><strong>Tip:</strong> If the fondue becomes too thick, add a splash of warm wine. If it's too thin, add more grated cheese.</p>
`,
		categorySlug: "recipes",
		tags: ["recipe", "fondue", "winter", "entertaining"],
		publishType: "publish",
	},
	{
		title: "Boxholm Cheese Wins Gold at Swedish Dairy Awards",
		slug: "gold-award-swedish-dairy-awards-2024",
		excerpt: "We're thrilled to announce that our Mästarost has been awarded Gold at the 2024 Swedish Dairy Awards, recognizing excellence in traditional cheese making.",
		content: `
<h2>A Golden Achievement</h2>
<p>We are honored to announce that Boxholm Mästarost has received the Gold Award at the prestigious 2024 Swedish Dairy Awards. This recognition celebrates our commitment to traditional cheese-making excellence.</p>

<h3>The Competition</h3>
<p>The Swedish Dairy Awards is the country's most respected dairy competition, with entries from over 50 producers across Sweden. Cheeses are judged blind by a panel of expert tasters on:</p>
<ul>
<li>Flavor complexity and balance</li>
<li>Texture and body</li>
<li>Aroma profile</li>
<li>Visual appearance</li>
<li>Overall craftsmanship</li>
</ul>

<h3>What the Judges Said</h3>
<blockquote>
<p>"Boxholm Mästarost exemplifies what traditional Swedish cheese can be. The balance between creamy texture and complex, nutty flavors shows true mastery of the craft."</p>
<p>— Competition Judge Panel</p>
</blockquote>

<h3>A Team Effort</h3>
<p>This award belongs to our entire team: from our partner farmers who provide exceptional milk, to our skilled cheese makers who tend each wheel with care, to everyone who helps bring Boxholm cheese to tables across Sweden.</p>

<p>Thank you to our loyal customers for your continued support. This gold medal is as much yours as it is ours.</p>
`,
		categorySlug: "news-events",
		tags: ["award", "recognition", "mästarost", "quality"],
		publishType: "publish",
	},
	{
		title: "The History of Cheese Making in Boxholm",
		slug: "history-of-cheese-making-in-boxholm",
		excerpt: "Journey through time and discover how Boxholm became one of Sweden's most important cheese-making regions, from the 1890s to today.",
		content: `
<h2>A Legacy Spanning Generations</h2>
<p>The story of cheese in Boxholm is intertwined with the history of the town itself. What began as a small dairy operation in 1890 has grown into one of Sweden's most respected cheese producers.</p>

<h3>The Early Years (1890-1920)</h3>
<p>Cheese production in Boxholm started as part of the local mill operation. Early cheese makers used traditional methods learned from generations of farmers, producing small batches for the local community.</p>

<h3>Growth and Innovation (1920-1960)</h3>
<p>The interwar period saw significant growth. In 1952, Boxholm produced Sweden's first commercially available cream cheese (Gräddost), which quickly became a household favorite. This innovation put Boxholm on the national dairy map.</p>

<h3>Modernization (1960-2000)</h3>
<p>While embracing modern food safety standards and equipment, Boxholm maintained its commitment to traditional recipes and methods. The phrase "turned by hand" became synonymous with our cheese.</p>

<h3>Today and Tomorrow</h3>
<p>Today, we continue to honor our heritage while looking to the future. Our cheeses are enjoyed across Sweden and beyond, but we remain true to the principles established over 130 years ago:</p>
<ul>
<li>Local Swedish milk</li>
<li>Traditional recipes</li>
<li>Handcrafted care</li>
<li>Uncompromising quality</li>
</ul>

<p>When you taste Boxholm cheese, you taste over a century of dedication to the craft.</p>
`,
		categorySlug: "history-tradition",
		tags: ["history", "heritage", "tradition", "boxholm"],
		publishType: "publish",
	},
	{
		title: "Summer Cheese Board: A Guide to Perfect Pairings",
		slug: "summer-cheese-board-perfect-pairings",
		excerpt: "Create the ultimate summer cheese board with our expert guide to pairing Boxholm cheeses with seasonal fruits, wines, and accompaniments.",
		content: `
<h2>The Art of the Cheese Board</h2>
<p>A well-crafted cheese board is a celebration of flavors, textures, and colors. This summer, elevate your entertaining with our guide to creating the perfect cheese spread.</p>

<h3>Choosing Your Cheeses</h3>
<p>A balanced board should include variety in texture and flavor:</p>
<ul>
<li><strong>Gräddost:</strong> Creamy and mild, perfect for cheese board beginners</li>
<li><strong>Mästarost:</strong> Semi-firm with nutty notes, a crowd favorite</li>
<li><strong>Ribbing:</strong> Bold and complex for adventurous palates</li>
</ul>

<h3>Summer Pairings</h3>
<p>Seasonal accompaniments that complement our cheeses:</p>

<h4>Fruits</h4>
<ul>
<li>Fresh Swedish strawberries</li>
<li>Ripe figs</li>
<li>Melon slices</li>
<li>Grapes</li>
</ul>

<h4>Crackers & Breads</h4>
<ul>
<li>Thin Swedish knäckebröd</li>
<li>Crusty sourdough</li>
<li>Walnut bread</li>
</ul>

<h4>Extras</h4>
<ul>
<li>Lingonberry jam</li>
<li>Honey</li>
<li>Marcona almonds</li>
<li>Prosciutto</li>
</ul>

<h3>Wine Pairings</h3>
<p>For summer, we recommend lighter wines:</p>
<ul>
<li>Crisp Sauvignon Blanc with Gräddost</li>
<li>Light Pinot Noir with Mästarost</li>
<li>Aged Riesling with Ribbing</li>
</ul>

<p><strong>Pro tip:</strong> Remove cheeses from the refrigerator 30-60 minutes before serving for optimal flavor and texture.</p>
`,
		categorySlug: "recipes",
		tags: ["cheese board", "entertaining", "summer", "pairings", "wine"],
		publishType: "publish",
	},
];

async function seedBlog() {
	try {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(MONGODB_URI!);
		console.log("Connected to MongoDB");

		const db = mongoose.connection.db;
		if (!db) {
			throw new Error("Database connection not established");
		}

		// Get or create a default author
		const usersCollection = db.collection("user");
		let author = await usersCollection.findOne({ email: "admin@boxholm.se" });

		if (!author) {
			console.log("Creating default author...");
			const result = await usersCollection.insertOne({
				email: "admin@boxholm.se",
				name: "Boxholm Editorial Team",
				emailVerified: true,
				image: "/storage/images/team/editorial-team.jpg",
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			author = { _id: result.insertedId, name: "Boxholm Editorial Team" };
		}
		console.log(`Using author: ${author.name}`);

		// Seed categories
		const categoriesCollection = db.collection("blog_categories");
		const categoryMap = new Map<string, mongoose.Types.ObjectId>();

		console.log("\nSeeding blog categories...");
		for (const category of blogCategories) {
			const existingCategory = await categoriesCollection.findOne({ slug: category.slug });

			if (existingCategory) {
				console.log(`  Category "${category.name}" already exists, updating...`);
				await categoriesCollection.updateOne(
					{ slug: category.slug },
					{ $set: { ...category, updatedAt: new Date() } }
				);
				categoryMap.set(category.slug, existingCategory._id);
			} else {
				console.log(`  Creating category "${category.name}"...`);
				const result = await categoriesCollection.insertOne({
					...category,
					parent: null,
					createdAt: new Date(),
					updatedAt: new Date(),
				});
				categoryMap.set(category.slug, result.insertedId);
			}
		}
		console.log(`Created/updated ${blogCategories.length} categories`);

		// Seed blog posts
		const postsCollection = db.collection("blog_posts");

		console.log("\nSeeding blog posts...");
		for (const post of blogPosts) {
			const categoryId = categoryMap.get(post.categorySlug);
			if (!categoryId) {
				console.log(`  Warning: Category "${post.categorySlug}" not found for post "${post.title}"`);
				continue;
			}

			const existingPost = await postsCollection.findOne({ slug: post.slug });

			const postData = {
				title: post.title,
				slug: post.slug,
				excerpt: post.excerpt,
				content: post.content.trim(),
				author: author._id,
				categories: [categoryId],
				tags: post.tags,
				featuredImage: {
					url: `/storage/images/blog/${post.slug}.jpg`,
					alt: post.title,
				},
				headerImage: {
					url: `/storage/images/blog/${post.slug}-header.jpg`,
					alt: post.title,
					showTitleOverlay: true,
				},
				seo: {
					title: post.title,
					description: post.excerpt,
					keywords: post.tags,
				},
				publishType: post.publishType,
				publishedAt: new Date(),
				updatedAt: new Date(),
			};

			if (existingPost) {
				console.log(`  Post "${post.title}" already exists, updating...`);
				await postsCollection.updateOne(
					{ slug: post.slug },
					{ $set: postData }
				);
			} else {
				console.log(`  Creating post "${post.title}"...`);
				await postsCollection.insertOne({
					...postData,
					createdAt: new Date(),
				});
			}
		}
		console.log(`Created/updated ${blogPosts.length} blog posts`);

		console.log("\n========================================");
		console.log("BLOG DATA SEEDED SUCCESSFULLY!");
		console.log("========================================\n");

		console.log("Categories created:");
		for (const category of blogCategories) {
			console.log(`  - ${category.name} (/${category.slug})`);
		}

		console.log("\nBlog posts created:");
		for (const post of blogPosts) {
			console.log(`  - ${post.title}`);
		}

		console.log("\n========================================");
		console.log("You can now view the blog at:");
		console.log("  - http://localhost:3000/blog");
		console.log("  - http://localhost:3007/blog");
		console.log("========================================\n");

	} catch (error) {
		console.error("Error seeding blog data:", error);
	} finally {
		await mongoose.disconnect();
		console.log("Disconnected from MongoDB");
	}
}

seedBlog();
