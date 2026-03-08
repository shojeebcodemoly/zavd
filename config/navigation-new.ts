export interface NavItem {
	titleKey: string; // Translation key for i18n
	title?: string; // Fallback title (for backward compatibility)
	href: string;
	description?: string;
	descriptionKey?: string; // Translation key for description
	items?: NavItem[];
	isDynamic?: boolean; // Flag for items that load from database
}

/**
 * Main Navigation Configuration
 *
 * Navigation Order: Home | About Us | Quality | Products | Our Store | Blog | Become Our Reseller | Contact Us
 *
 * Uses translation keys from messages/[locale].json -> navigation namespace
 */
export const mainNavNew: NavItem[] = [
	{
		titleKey: "home",
		title: "Home",
		href: "/",
	},
	{
		titleKey: "about",
		title: "About Us",
		href: "/about-us",
	},
	{
		titleKey: "quality",
		title: "Quality",
		href: "/quality",
	},
	{
		titleKey: "products",
		title: "Products",
		href: "/products",
	},
	{
		titleKey: "store",
		title: "Our Store",
		href: "/our-store",
	},
	{
		titleKey: "blog",
		title: "Blog",
		href: "/blog",
	},
	{
		titleKey: "becomeReseller",
		title: "Become Our Reseller",
		href: "/become-our-reseller",
	},
	{
		titleKey: "contact",
		title: "Contact Us",
		href: "/contact-us",
	},
];
