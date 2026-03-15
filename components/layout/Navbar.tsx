"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { mainNavNew } from "@/config/navigation-new";
import { useNavbarVariant } from "@/lib/context/navbar-variant-context";
import { cn } from "@/lib/utils";
import type { SiteConfigType } from "@/config/site";
import Logo from "../common/logo";
import MobileNavbar from "./MobileNavbar";
import { LanguageSwitcher } from "./LanguageSwitcher";

const ProtectedNavbar = dynamic(() => import("./ProtectedNavbar"), { ssr: false });

interface SocialMedia {
	facebook?: string;
	instagram?: string;
	twitter?: string;
	youtube?: string;
	linkedin?: string;
}

interface NavbarProps {
	config: SiteConfigType;
	logoUrl?: string;
	companyName?: string;
	socialMedia?: SocialMedia;
}

export function Navbar({ config, logoUrl, companyName, socialMedia }: NavbarProps) {
	const [isScrolled, setIsScrolled] = useState(false);
	const t = useTranslations("navigation");
	const { variant } = useNavbarVariant();

	const isDarkHero = variant === "dark-hero";

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const panelClassName = cn(
		"transition-all duration-300",
		isDarkHero
			? isScrolled
				? "bg-black/80 backdrop-blur-md shadow-lg"
				: "bg-transparent"
			: "bg-secondary shadow-md"
	);

	return (
		<div className={cn("w-full", panelClassName)}>
			<nav className="w-full">
				<div className="_container">
					<div className="flex items-center justify-between gap-1 lg:gap-2 py-2 sm:py-3">

						{/* Logo */}
						<Logo logoUrl={logoUrl} companyName={companyName} />

						{/* Desktop Navigation */}
						<div className="hidden lg:flex items-center justify-center flex-1">
							<NavigationMenu>
								<NavigationMenuList>
									{mainNavNew.map((item) => (
										<NavigationMenuItem key={item.titleKey}>
											{item.items ? (
												<>
													<NavigationMenuTrigger
														className={cn(
															"bg-transparent! hover:bg-white/10! focus:bg-white/10! data-[state=open]:bg-white/10!",
															"text-white/90! hover:text-white! focus:text-white! data-[state=open]:text-white!",
															"text-xs font-medium uppercase h-8 px-2 transition-colors"
														)}
													>
														<Link href={item.href}>
															{t(item.titleKey)}
														</Link>
													</NavigationMenuTrigger>
													<NavigationMenuContent className="bg-black/85! border! border-white/10! backdrop-blur-xl!">
														<div className="min-w-[200px] py-2 px-1 bg-black/85 backdrop-blur-xl border border-white/10 shadow-xl rounded-sm">
															{item.items.map((subItem) => (
																<Link
																	key={subItem.titleKey}
																	href={subItem.href}
																	className="block text-sm text-white/75 hover:text-white hover:bg-white/10 transition-colors py-2 px-3 rounded-sm"
																>
																	{t(subItem.titleKey)}
																</Link>
															))}
														</div>
													</NavigationMenuContent>
												</>
											) : (
												<NavigationMenuLink
													href={item.href}
													className={cn(
														navigationMenuTriggerStyle(),
														"bg-transparent! hover:bg-white/10! focus:bg-white/10!",
														"text-white/90! hover:text-white! focus:text-white!",
														"text-xs font-medium uppercase h-8 px-2 transition-colors"
													)}
												>
													{t(item.titleKey)}
												</NavigationMenuLink>
											)}
										</NavigationMenuItem>
									))}
								</NavigationMenuList>
							</NavigationMenu>
						</div>

						{/* Right Actions */}
						<div className="hidden lg:flex items-center gap-2 shrink-0">
							<LanguageSwitcher variant="compact" />
							<ProtectedNavbar />
						</div>

						{/* Mobile Menu */}
						<MobileNavbar useLightText={true} logoUrl={logoUrl} />
					</div>
				</div>
			</nav>
		</div>
	);
}
