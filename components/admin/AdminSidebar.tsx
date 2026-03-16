"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	LayoutDashboard,
	Package,
	FolderTree,
	Users,
	HardDrive,
	UserCircle,
	LogOut,
	Home,
	Menu,
	X,
	MessageSquare,
	FileText,
	Tags,
	MessageCircle,
	Settings,
	Globe,
	Phone,
	PanelLeft,
	Info,
	UsersRound,
	Scale,
	Shield,
	HelpCircle,
	Store,
	Handshake,
	ChevronDown,
	ChevronRight,
	Building2,
	Heart,
	UserCheck,
	Award,
	Zap,
	HandHeart,
	HeartHandshake,
	LayoutGrid,
	CalendarDays,
	BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Logo from "@/components/common/logo";

interface NavItem {
	title: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
	badge?: string;
	children?: NavItem[];
}

interface NavSection {
	title: string;
	items: NavItem[];
	collapsible?: boolean;
}

// Grouped navigation sections
const navSections: NavSection[] = [
	{
		title: "Overview",
		items: [
			{
				title: "Dashboard",
				href: "/dashboard",
				icon: LayoutDashboard,
			},
		],
	},
	{
		title: "Website",
		collapsible: true,
		items: [
			{
				title: "Home Page",
				href: "/dashboard/webbplats/startsida",
				icon: Globe,
			},
			{
				title: "About ZAVD",
				href: "/dashboard/webbplats/uber-zavd",
				icon: Building2,
				children: [
					{
						title: "Mission & Values",
						href: "/dashboard/webbplats/mission-werte",
						icon: ChevronRight,
					},
					{
						title: "Board & Team",
						href: "/dashboard/webbplats/vorstand-team",
						icon: ChevronRight,
					},
					{
						title: "History",
						href: "/dashboard/webbplats/geschichte",
						icon: ChevronRight,
					},
					{
						title: "Statutes",
						href: "/dashboard/webbplats/satzung",
						icon: ChevronRight,
					},
				],
			},
			{
				title: "Donations",
				href: "/dashboard/webbplats/spenden",
				icon: Heart,
				children: [
					{
						title: "Humanitarian Aid",
						href: "/dashboard/webbplats/humanitaere-hilfe",
						icon: ChevronRight,
					},
					{
						title: "ZAVD Donation Account",
						href: "/dashboard/webbplats/zavd-spendenkonto",
						icon: ChevronRight,
					},
				],
			},
			{
				title: "Services & Counseling",
				href: "/dashboard/webbplats/angebote-beratung",
				icon: HeartHandshake,
			},
			{
				title: "Themen (Topics)",
				href: "/dashboard/webbplats/themen",
				icon: BookOpen,
			},
			{
				title: "About Us",
				href: "/dashboard/webbplats/om-oss",
				icon: Info,
			},
			{
				title: "Team",
				href: "/dashboard/webbplats/team",
				icon: UsersRound,
			},
			{
				title: "Legal Info",
				href: "/dashboard/webbplats/juridisk-information",
				icon: Scale,
			},
			{
				title: "Privacy Policy",
				href: "/dashboard/webbplats/integritetspolicy",
				icon: Shield,
			},
			{
				title: "FAQ",
				href: "/dashboard/webbplats/faq",
				icon: HelpCircle,
			},
			{
				title: "Contact Page",
				href: "/dashboard/webbplats/kontakt",
				icon: Phone,
			},
			{
				title: "Store",
				href: "/dashboard/webbplats/butik",
				icon: Store,
			},
			{
				title: "Reseller",
				href: "/dashboard/webbplats/reseller",
				icon: Handshake,
			},
		],
	},
	{
		title: "Projekte",
		collapsible: true,
		items: [
			{
				title: "Projekte Overview",
				href: "/dashboard/projekte/overview",
				icon: LayoutGrid,
			},
			{
				title: "Patenschaftsprojekt",
				href: "/dashboard/projekte/patenschaftsprojekt",
				icon: Heart,
			},
			{
				title: "Gemeinsam Aktiv",
				href: "/dashboard/projekte/gemeinsam-aktiv",
				icon: UserCheck,
			},
			{
				title: "Successful Integration",
				href: "/dashboard/projekte/gut-reinkommen",
				icon: Award,
			},
			{
				title: "GeT AKTIV",
				href: "/dashboard/projekte/get-aktiv",
				icon: Zap,
			},
			{
				title: "Ehrenamt & Engagement",
				href: "/dashboard/projekte/ehrenamt-engagement",
				icon: HandHeart,
			},
		],
	},
	{
		title: "Products",
		collapsible: true,
		items: [
			{
				title: "All Products",
				href: "/dashboard/products",
				icon: Package,
			},
			{
				title: "Categories",
				href: "/dashboard/categories",
				icon: FolderTree,
			},
		],
	},
	{
		title: "News",
		collapsible: true,
		items: [
			{
				title: "News Page",
				href: "/dashboard/news",
				icon: Globe,
			},
			{
				title: "All News",
				href: "/dashboard/blog",
				icon: FileText,
			},
			{
				title: "Categories",
				href: "/dashboard/blog/categories",
				icon: Tags,
			},
			{
				title: "Comments",
				href: "/dashboard/comments",
				icon: MessageCircle,
			},
		],
	},
	{
		title: "Events",
		collapsible: true,
		items: [
			{
				title: "Events Page",
				href: "/dashboard/events",
				icon: Globe,
			},
			{
				title: "All Events",
				href: "/dashboard/blog",
				icon: CalendarDays,
			},
			{
				title: "Create Event",
				href: "/dashboard/blog/new",
				icon: FileText,
			},
		],
	},
	{
		title: "Forms",
		collapsible: true,
		items: [
			{
				title: "Inquiries",
				href: "/dashboard/inquiries",
				icon: MessageSquare,
			},
		],
	},
	{
		title: "System",
		collapsible: true,
		items: [
			{
				title: "Users",
				href: "/dashboard/users",
				icon: Users,
			},
			{
				title: "Storage",
				href: "/dashboard/storage",
				icon: HardDrive,
			},
		],
	},
];

const bottomNavItems: NavItem[] = [
	{
		title: "Settings",
		href: "/dashboard/settings",
		icon: Settings,
	},
	{
		title: "Profile",
		href: "/dashboard/profile",
		icon: UserCircle,
	},
];

interface AdminSidebarProps {
	className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
	const pathname = usePathname();
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isMobileOpen, setIsMobileOpen] = useState(false);
	const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
		// Initialize with all sections expanded by default
		const initial: Record<string, boolean> = {};
		navSections.forEach((section) => {
			initial[section.title] = true;
		});
		return initial;
	});
	const [expandedNavItems, setExpandedNavItems] = useState<Record<string, boolean>>({
		"/dashboard/webbplats/uber-zavd": true,
	});
	const [logoUrl, setLogoUrl] = useState<string | null>(null);
	const [companyName, setCompanyName] = useState<string>("ZAVD");
	const [isLogoLoading, setIsLogoLoading] = useState(true);

	// Fetch site settings for logo and company name
	useEffect(() => {
		const fetchSettings = async () => {
			try {
				const response = await fetch("/api/site-settings");
				const data = await response.json();
				if (response.ok && data.data) {
					// Use dashboardLogoUrl if set, otherwise fallback to logoUrl
					const fetched = data.data.branding?.dashboardLogoUrl || data.data.branding?.logoUrl || null;
					setLogoUrl("/storage/zavd-logo-mobile-2000x485.png");
					setCompanyName(data.data.companyName || "Zavd");
				}
			} catch (error) {
				console.error("Failed to fetch site settings:", error);
			} finally {
				setIsLogoLoading(false);
			}
		};
		fetchSettings();
	}, []);

	const toggleSection = (sectionTitle: string) => {
		setExpandedSections((prev) => ({
			...prev,
			[sectionTitle]: !prev[sectionTitle],
		}));
	};

	const isActive = (href: string) => {
		if (href === "/dashboard") {
			return pathname === "/dashboard";
		}
		// For /dashboard/blog, only match exact path to avoid matching /dashboard/blog/categories
		if (href === "/dashboard/blog") {
			return (
				pathname === "/dashboard/blog" ||
				pathname.startsWith("/dashboard/blog/posts")
			);
		}
		return pathname.startsWith(href);
	};

	// Check if any item in a section is active (including children)
	const isSectionActive = (section: NavSection) => {
		return section.items.some((item) =>
			isActive(item.href) || item.children?.some((child) => isActive(child.href))
		);
	};

	const toggleNavItem = (href: string) => {
		setExpandedNavItems((prev) => ({ ...prev, [href]: !prev[href] }));
	};

	const handleSignOut = async () => {
		await authClient.signOut();
		window.location.href = "/";
	};

	const closeMobile = () => setIsMobileOpen(false);

	const renderNavLink = (item: NavItem) => {
		const active = isActive(item.href);
		const hasChildren = item.children && item.children.length > 0;
		const isItemExpanded = expandedNavItems[item.href] ?? false;
		const hasActiveChild = item.children?.some((child) => isActive(child.href)) ?? false;

		if (hasChildren) {
			return (
				<div key={item.href}>
					<div
						className={cn(
							"flex items-center rounded-lg text-sm font-medium transition-all duration-200",
							active || hasActiveChild
								? "bg-primary/10 text-primary"
								: "text-slate-600 hover:text-slate-900 hover:bg-primary/10"
						)}
					>
						<Link
							href={item.href}
							onClick={closeMobile}
							className="flex items-center gap-3 flex-1 px-3 py-2 min-w-0"
						>
							<item.icon
								className={cn(
									"h-4.5 w-4.5 shrink-0",
									active || hasActiveChild ? "text-primary" : "text-slate-500"
								)}
							/>
							{!isCollapsed && <span className="truncate">{item.title}</span>}
						</Link>
						{!isCollapsed && (
							<button
								onClick={() => toggleNavItem(item.href)}
								className="px-2 py-2 shrink-0"
								aria-label="Toggle submenu"
							>
								{isItemExpanded
									? <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
									: <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
								}
							</button>
						)}
					</div>
					{!isCollapsed && (
						<div
							className={cn(
								"overflow-hidden transition-all duration-200 ml-3 pl-3 border-l border-slate-200",
								isItemExpanded ? "max-h-[400px] opacity-100 mt-0.5" : "max-h-0 opacity-0"
							)}
						>
							{item.children!.map((child) => {
								const childActive = isActive(child.href);
								return (
									<Link
										key={child.href}
										href={child.href}
										onClick={closeMobile}
										className={cn(
											"flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-200",
											childActive
												? "bg-primary text-white shadow-sm shadow-primary/20 font-medium"
												: "text-slate-500 hover:text-slate-900 hover:bg-primary/10"
										)}
									>
										<span className={cn("w-1.5 h-1.5 rounded-full shrink-0", childActive ? "bg-white" : "bg-slate-300")} />
										<span className="truncate">{child.title}</span>
									</Link>
								);
							})}
						</div>
					)}
				</div>
			);
		}

		return (
			<Link
				key={item.href}
				href={item.href}
				onClick={closeMobile}
				className={cn(
					"flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
					active
						? "bg-primary text-white shadow-md shadow-primary/20"
						: "text-slate-600 hover:text-slate-900 hover:bg-primary/10"
				)}
			>
				<item.icon
					className={cn(
						"h-4.5 w-4.5 shrink-0",
						active ? "text-white" : "text-slate-500"
					)}
				/>
				{!isCollapsed && <span className="truncate">{item.title}</span>}
				{!isCollapsed && item.badge && (
					<span className="ml-auto bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
						{item.badge}
					</span>
				)}
			</Link>
		);
	};

	const renderNavSection = (section: NavSection, index: number) => {
		const isExpanded = expandedSections[section.title];
		const hasActiveItem = isSectionActive(section);

		return (
			<div key={section.title} className={cn(index > 0 && "mt-2")}>
				{!isCollapsed && section.collapsible ? (
					<button
						onClick={() => toggleSection(section.title)}
						className={cn(
							"w-full flex items-center justify-between px-3 py-2 text-[11px] font-semibold uppercase tracking-wider rounded-lg transition-colors",
							hasActiveItem
								? "text-primary bg-primary/5"
								: "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
						)}
					>
						<span>{section.title}</span>
						{isExpanded ? (
							<ChevronDown className="h-4 w-4" />
						) : (
							<ChevronRight className="h-4 w-4" />
						)}
					</button>
				) : !isCollapsed ? (
					<p className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
						{section.title}
					</p>
				) : null}
				{isCollapsed && index > 0 && (
					<div className="mx-3 my-2 border-t border-slate-200" />
				)}
				<div
					className={cn(
						"space-y-0.5 overflow-hidden transition-all duration-200",
						!isCollapsed && section.collapsible && !isExpanded
							? "max-h-0 opacity-0"
							: "max-h-[1000px] opacity-100"
					)}
				>
					{section.items.map(renderNavLink)}
				</div>
			</div>
		);
	};

	const sidebarContent = (
		<>
			{/* Logo */}
			<div className="p-4 border-b border-slate-200">
				<Link
					href="/dashboard"
					className="flex items-center gap-3"
					onClick={closeMobile}
				>
					{isCollapsed ? (
						<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
							<span className="text-white font-bold text-sm">
								{companyName.charAt(0).toUpperCase()}
							</span>
						</div>
					) : isLogoLoading ? (
						<div className="h-14 w-40 bg-slate-100 rounded animate-pulse" />
					) : (
						// eslint-disable-next-line @next/next/no-img-element
						<img
							src={logoUrl || "/storage/zavd-logo-mobile-2000x485.png"}
							alt={companyName}
							className="h-12 w-auto max-w-[160px] object-contain"
						/>
					)}
				</Link>
			</div>

			{/* Main Navigation */}
			<nav className="flex-1 p-3 overflow-y-auto">
				{navSections.map((section, index) =>
					renderNavSection(section, index)
				)}
			</nav>

			{/* Bottom Navigation */}
			<div className="p-3 border-t border-slate-200 space-y-0.5">
				{bottomNavItems.map(renderNavLink)}

				{/* Back to Site */}
				<Link
					href="/"
					onClick={closeMobile}
					className={cn(
						"flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
						"text-slate-600 hover:text-slate-900 hover:bg-slate-100"
					)}
				>
					<Home className="h-4.5 w-4.5 shrink-0 text-slate-500" />
					{!isCollapsed && <span>Back to Site</span>}
				</Link>

				{/* Sign Out */}
				<button
					onClick={handleSignOut}
					className={cn(
						"flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 w-full",
						"text-red-600 hover:text-red-700 hover:bg-red-50"
					)}
				>
					<LogOut className="h-4.5 w-4.5 shrink-0" />
					{!isCollapsed && <span>Logout</span>}
				</button>
			</div>

			{/* Collapse Toggle - Desktop only */}
			<div className="hidden lg:block p-3 border-t border-slate-200">
				<button
					onClick={() => setIsCollapsed(!isCollapsed)}
					className="flex items-center justify-center w-full py-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
				>
					{isCollapsed ? (
						<PanelLeft className="h-5 w-5" />
					) : (
						<>
							<PanelLeft className="h-5 w-5" />
							<span className="ml-2 text-sm">Minimera</span>
						</>
					)}
				</button>
			</div>
		</>
	);

	return (
		<>
			{/* Mobile Menu Button - only show when sidebar is closed */}
			{!isMobileOpen && (
				<Button
					variant="outline"
					size="icon"
					className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-md"
					onClick={() => setIsMobileOpen(true)}
				>
					<Menu className="h-5 w-5" />
				</Button>
			)}

			{/* Mobile Overlay */}
			{isMobileOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40 lg:hidden"
					onClick={closeMobile}
				/>
			)}

			{/* Mobile Sidebar */}
			<aside
				className={cn(
					"fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden",
					isMobileOpen ? "translate-x-0" : "-translate-x-full"
				)}
			>
				<button
					onClick={closeMobile}
					className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 z-10"
				>
					<X className="h-5 w-5 text-slate-500" />
				</button>
				<div className="flex flex-col h-full">{sidebarContent}</div>
			</aside>

			{/* Desktop Sidebar */}
			<aside
				className={cn(
					"hidden lg:flex flex-col bg-white border-r border-slate-200 h-screen sticky top-0 transition-all duration-300 shrink-0",
					isCollapsed ? "w-[72px]" : "w-64",
					className
				)}
			>
				{sidebarContent}
			</aside>
		</>
	);
}
