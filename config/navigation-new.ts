export interface NavItem {
	titleKey: string;
	title?: string;
	href: string;
	description?: string;
	descriptionKey?: string;
	items?: NavItem[];
	isDynamic?: boolean;
}

/**
 * ZAVD Main Navigation Configuration
 *
 * Navigation: Startseite | Über ZAVD | Projekte | Angebote & Beratung | Themen | Aktuelles | Spenden | Kontakt
 *
 * Uses translation keys from messages/[locale].json -> navigation namespace
 * Default locale: German (de) — no prefix
 * Secondary locale: English (en) — /en/ prefix
 */
export const mainNavNew: NavItem[] = [
	{
		titleKey: "home",
		title: "Startseite",
		href: "/",
	},
	{
		titleKey: "uberZavd",
		title: "Über ZAVD",
		href: "/uber-zavd",
		items: [
			{
				titleKey: "missionWerte",
				title: "Mission & Werte",
				href: "/uber-zavd/mission-werte",
			},
			{
				titleKey: "vorstandTeam",
				title: "Vorstand & Team",
				href: "/uber-zavd/vorstand-team",
			},
			{
				titleKey: "geschichte",
				title: "Geschichte",
				href: "/uber-zavd/geschichte",
			},
			{
				titleKey: "satzung",
				title: "Satzung",
				href: "/uber-zavd/satzung",
			},
		],
	},
	{
		titleKey: "projekte",
		title: "Projekte",
		href: "/projekte",
		items: [
			{
				titleKey: "patenschaftsprojekt",
				title: "Patenschaftsprojekt",
				href: "/projekte/patenschaftsprojekt",
			},
			{
				titleKey: "gemeinsamAktiv",
				title: "Gemeinsam Aktiv",
				href: "/projekte/gemeinsam-aktiv",
			},
			{
				titleKey: "gutReinkommen",
				title: "Gut Reinkommen",
				href: "/projekte/gut-reinkommen",
			},
			{
				titleKey: "getAktiv",
				title: "GeT AKTIV",
				href: "/projekte/get-aktiv",
			},
			{
				titleKey: "ehrenamtEngagement",
				title: "Ehrenamt & Engagement",
				href: "/projekte/ehrenamt-engagement",
			},
		],
	},
	{
		titleKey: "angeboteBeratung",
		title: "Angebote & Beratung",
		href: "/angebote-beratung",
	},
	{
		titleKey: "themen",
		title: "Themen",
		href: "/themen",
	},
	{
		titleKey: "aktuelles",
		title: "Aktuelles",
		href: "/aktuelles",
	},
	{
		titleKey: "spenden",
		title: "Spenden",
		href: "/spenden",
	},
	{
		titleKey: "kontakt",
		title: "Kontakt",
		href: "/kontakt",
	},
];
