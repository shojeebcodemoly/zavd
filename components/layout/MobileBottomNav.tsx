"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Package, Phone, Info } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils/cn";
import { defaultLocale, type Locale } from "@/i18n/config";

interface NavItem {
	labelKey: string;
	href: string;
	icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const navItems: NavItem[] = [
	{
		labelKey: "home",
		href: "/",
		icon: Home,
	},
	{
		labelKey: "products",
		href: "/products",
		icon: Package,
	},
	{
		labelKey: "about",
		href: "/about-us",
		icon: Info,
	},
	{
		labelKey: "contact",
		href: "/contact-us",
		icon: Phone,
	},
];

export function MobileBottomNav() {
	const pathname = usePathname();
	const locale = useLocale() as Locale;
	const t = useTranslations("navigation");

	// Get locale-prefixed href
	const getLocalizedHref = (href: string) => {
		if (locale === defaultLocale) {
			return href;
		}
		return `/${locale}${href}`;
	};

	// Get pathname without locale prefix for comparison
	const getPathWithoutLocale = () => {
		if (locale !== defaultLocale && pathname.startsWith(`/${locale}`)) {
			const stripped = pathname.substring(locale.length + 1);
			return stripped || "/";
		}
		return pathname;
	};

	const pathWithoutLocale = getPathWithoutLocale();

	const isActive = (href: string) => {
		if (href === "/") {
			return pathWithoutLocale === "/";
		}
		return pathWithoutLocale.startsWith(href);
	};

	// Find active index for indicator positioning
	const activeIndex = navItems.findIndex((item) => isActive(item.href));

	return (
		<>
			{/* Floating Bottom Navigation - Mobile Only */}
			<nav
				className="fixed bottom-4 left-4 right-4 z-50 md:hidden"
				aria-label="Mobile navigation"
			>
				{/* Outer container with glass effect */}
				<div className="relative bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden">
					{/* Subtle gradient overlay for depth */}
					<div className="absolute inset-0 bg-linear-to-t from-gray-50/50 to-transparent pointer-events-none" />

					{/* Navigation items container */}
					<div className="relative flex items-center justify-around px-2 py-2">
						{/* Animated active indicator */}
						<div
							className="absolute top-2 bottom-2 bg-primary/10 rounded-xl transition-all duration-300 ease-out"
							style={{
								width: `calc(${100 / navItems.length}% - 8px)`,
								left: `calc(${
									(activeIndex * 100) / navItems.length
								}% + 4px)`,
								opacity: activeIndex >= 0 ? 1 : 0,
							}}
						/>

						{navItems.map((item) => {
							const Icon = item.icon;
							const active = isActive(item.href);

							return (
								<Link
									key={item.href}
									href={getLocalizedHref(item.href)}
									className={cn(
										"relative flex flex-col items-center justify-center flex-1 py-2.5 px-1 rounded-xl transition-all duration-300 group",
										active ? "text-primary" : "text-gray-500"
									)}
									aria-current={active ? "page" : undefined}
								>
									{/* Icon with scale animation */}
									<div
										className={cn(
											"relative transition-all duration-300",
											active ? "scale-110" : "group-hover:scale-105"
										)}
									>
										<Icon
											className={cn(
												"w-5 h-5 transition-all duration-300",
												active
													? "text-primary"
													: "text-gray-500 group-hover:text-primary/70"
											)}
											strokeWidth={active ? 2.5 : 1.5}
											aria-hidden="true"
										/>
										{/* Active dot indicator */}
										{active && (
											<span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-in fade-in zoom-in duration-300" />
										)}
									</div>

									{/* Label with fade effect */}
									<span
										className={cn(
											"text-[11px] mt-1 font-medium transition-all duration-300 truncate max-w-full",
											active
												? "text-primary font-semibold"
												: "text-gray-500 group-hover:text-primary/70"
										)}
									>
										{t(item.labelKey)}
									</span>
								</Link>
							);
						})}
					</div>

					{/* Bottom accent line */}
					<div className="absolute bottom-0 left-4 right-4 h-0.5 bg-linear-to-r from-transparent via-primary/20 to-transparent" />
				</div>
			</nav>
		</>
	);
}
