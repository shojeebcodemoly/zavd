export interface NavItem {
	title: string;
	href: string;
	description?: string;
	items?: NavItem[];
	isDynamic?: boolean; // Flag for items that load from database
}

export const mainNav: NavItem[] = [
	{
		title: "Nyheter",
		href: "/nyheter",
	},
	{
		title: "Produkter",
		href: "/produkter",
	},
	{
		title: "Kategori",
		href: "/kategori",
		isDynamic: true, // This item loads categories/products from database
	},
	{
		title: "Om Oss",
		href: "/om-oss",
		items: [
			{
				title: "Om Oss",
				href: "/om-oss",
			},
			{
				title: "Vårt Team",
				href: "/om-oss/team",
			},
			{
				title: "Bli Återförsäljare",
				href: "/bli-aterforsaljare",
			},
			{
				title: "FAQ",
				href: "/faq",
			},
			{
				title: "Juridisk Information",
				href: "/om-oss/juridisk-information",
			},
		],
	},
	{
		title: "Kontakt",
		href: "/kontakt",
	},
];
