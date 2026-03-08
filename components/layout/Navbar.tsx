"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Menu } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { useTranslations } from "next-intl";

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
import { useNavigation } from "@/lib/hooks/use-navigation";
import { useNavbarVariant } from "@/lib/context/navbar-variant-context";
import { cn } from "@/lib/utils";
import type { SiteConfigType } from "@/config/site";
import Logo from "../common/logo";
import MobileNavbar from "./MobileNavbar";
import ProtectedNavbar from "./ProtectedNavbar";
import { NavbarSearch } from "./NavbarSearch";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { authClient } from "@/lib/auth-client";

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
	const [isMounted, setIsMounted] = useState(false);
	const { data: navigationData } = useNavigation();
	const { variant } = useNavbarVariant();
	const t = useTranslations("navigation");
	const tCommon = useTranslations("common");
	const { data: session } = authClient.useSession();

	// Always use light text since navbar now has a dark primary background
	const useLightText = true;

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	if (!isMounted) {
		return (
			<div>
				<div className="fixed top-0 left-0 z-50 w-full">
					<nav
						className="py-2 sm:py-3 transition-all duration-300 bg-secondary"
					>
						<div className="_container">
							<div className="flex bg-none items-center justify-between gap-1 lg:gap-2">
								<Logo logoUrl={logoUrl} companyName={companyName} />
								<div className="hidden lg:flex items-center justify-center flex-1" />
								<div className="hidden lg:flex items-center" />
								<div className="hidden xl:flex items-center gap-2 shrink-0" />
								<div className="hidden lg:block">
									<ProtectedNavbar />
								</div>
								<button
									className="lg:hidden p-0 w-auto h-auto bg-transparent border-0"
									aria-label="Menu"
								>
									<Menu className="h-6 w-6 text-white" />
								</button>
							</div>
						</div>
					</nav>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className="fixed top-0 left-0 z-50 w-full">
				<nav
					className={`py-2 sm:py-3 transition-all duration-300 bg-secondary ${
						isScrolled ? "shadow-lg" : ""
					}`}
				>
					<div className="_container">
						<div className="flex bg-none items-center justify-between gap-1 lg:gap-2">
							{/* Logo */}
							<Logo logoUrl={logoUrl} />

							{/* Desktop Nav */}
							<div className="hidden lg:flex items-center justify-center flex-1">
								<NavigationMenu>
									<NavigationMenuList>
										{mainNavNew.map((item) => (
											<NavigationMenuItem key={item.titleKey}>
												{/* Dynamic Produkter mega-menu */}
												{item.isDynamic ? (
													<>
														<NavigationMenuTrigger
															className={cn(
																"bg-transparent! hover:bg-secondary/10! focus:bg-secondary/10! active:bg-secondary/20! data-[state=open]:bg-secondary/10! text-xs font-medium transition-colors h-8 px-2 uppercase",
																useLightText
																	? "text-white/90! hover:text-white! focus:text-white! active:text-white! data-[state=open]:text-white!"
																	: "text-secondary! hover:text-secondary! focus:text-secondary! active:text-primary! data-[state=open]:text-secondary!"
															)}
														>
															<Link href={item.href}>
																{t(item.titleKey)}
															</Link>
														</NavigationMenuTrigger>
														<NavigationMenuContent className="bg-background/95! border! border-border! ring-0! outline-none! backdrop-blur-xl fixed! left-1/2! -translate-x-1/2! top-[72px]!">
															<div className="w-[calc(100vw-6rem)] max-w-[1150px] p-4 bg-background/95 backdrop-blur-xl border border-white/20 shadow-sm rounded-sm max-h-[60vh] overflow-y-auto nav-dropdown-scroll">
																<div className="grid grid-cols-5 gap-x-6 gap-y-3">
																	{navigationData?.categories.map(
																		(category) => (
																			<div
																				key={category._id}
																				className="space-y-0"
																			>
																				<Link
																					href={`/products/category/${category.slug}`}
																					className="block text-sm font-bold text-primary hover:text-primary/80 hover:underline transition-colors"
																				>
																					{category.name}
																				</Link>
																				{category.products
																					.length > 0 && (
																					<ul className="space-y-0">
																						{category.products.map(
																							(
																								product
																							) => (
																								<li
																									key={
																										product._id
																									}
																								>
																									<Link
																										href={`/products/category/${product.primaryCategorySlug}/${product.slug}`}
																										className="block text-sm text-foreground/70 hover:text-secondary transition-colors line-clamp-1 hover:underline"
																									>
																										{
																											product.title
																										}
																									</Link>
																								</li>
																							)
																						)}
																					</ul>
																				)}
																			</div>
																		)
																	)}
																	{/* Loading state */}
																	{!navigationData && (
																		<div className="col-span-5 py-8 text-center text-foreground/50 text-sm">
																			{tCommon("loading")}
																		</div>
																	)}
																	{/* Empty state */}
																	{navigationData &&
																		navigationData.categories
																			.length === 0 && (
																			<div className="col-span-5 py-8 text-center text-foreground/50 text-sm">
																				{t("noCategories")}
																			</div>
																		)}
																</div>
															</div>
														</NavigationMenuContent>
													</>
												) : item.items ? (
													// Static menu items with subitems (Starta Eget, Om Oss)
													<>
														<NavigationMenuTrigger
															className={cn(
																"bg-transparent! hover:bg-secondary/10! focus:bg-secondary/10! active:bg-secondary/20! data-[state=open]:bg-secondary/10! text-xs font-medium transition-colors h-8 px-2 uppercase",
																useLightText
																	? "text-white/90! hover:text-white! focus:text-white! active:text-white! data-[state=open]:text-white!"
																	: "text-secondary! hover:text-secondary! focus:text-secondary! active:text-primary! data-[state=open]:text-secondary!"
															)}
														>
															<Link href={item.href}>
																{t(item.titleKey)}
															</Link>
														</NavigationMenuTrigger>
														<NavigationMenuContent className="bg-background/95! border! border-border! ring-0! outline-none! backdrop-blur-xl">
															<div className="min-w-[180px] p-3 bg-background/95 backdrop-blur-xl border border-white/20 shadow-sm rounded-sm">
																<div className="space-y-1">
																	{item.items.map(
																		(subItem) => (
																			<Link
																				key={subItem.titleKey}
																				href={subItem.href}
																				className="block text-sm text-foreground/70 hover:text-secondary transition-colors hover:underline py-1.5 px-2 rounded hover:bg-secondary/5"
																			>
																				{t(subItem.titleKey)}
																			</Link>
																		)
																	)}
																</div>
															</div>
														</NavigationMenuContent>
													</>
												) : (
													// Simple link items (Nyheter och artiklar, Utbildningar, Kontakt)
													<NavigationMenuLink
														href={item.href}
														className={cn(
															navigationMenuTriggerStyle(),
															"bg-transparent! hover:bg-secondary/10! focus:bg-secondary/10! active:bg-secondary/20! transition-colors text-xs h-8 px-2 uppercase",
															useLightText
																? "text-white/90! hover:text-white! focus:text-white! active:text-white!"
																: "text-secondary! hover:text-primary! focus:text-primary! active:text-primary!"
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

							{/* Right Actions - Social Icons, Search, Language, User/Dashboard */}
							<div className="hidden lg:flex items-center gap-4 shrink-0">
								{/* Social Media Icons */}
								{socialMedia && (
									<div className="flex items-center gap-3">
										{socialMedia.facebook && (
											<a
												href={socialMedia.facebook}
												target="_blank"
												rel="noopener noreferrer"
												className={cn(
													"transition-colors",
													useLightText
														? "text-white/70 hover:text-white"
														: "text-secondary/70 hover:text-secondary"
												)}
											>
												<FaFacebookF className="h-4 w-4" />
											</a>
										)}
										{socialMedia.instagram && (
											<a
												href={socialMedia.instagram}
												target="_blank"
												rel="noopener noreferrer"
												className={cn(
													"transition-colors",
													useLightText
														? "text-white/70 hover:text-white"
														: "text-secondary/70 hover:text-secondary"
												)}
											>
												<FaInstagram className="h-4 w-4" />
											</a>
										)}
										{socialMedia.twitter && (
											<a
												href={socialMedia.twitter}
												target="_blank"
												rel="noopener noreferrer"
												className={cn(
													"transition-colors",
													useLightText
														? "text-white/70 hover:text-white"
														: "text-secondary/70 hover:text-secondary"
												)}
											>
												<FaTwitter className="h-4 w-4" />
											</a>
										)}
										{socialMedia.youtube && (
											<a
												href={socialMedia.youtube}
												target="_blank"
												rel="noopener noreferrer"
												className={cn(
													"transition-colors",
													useLightText
														? "text-white/70 hover:text-white"
														: "text-secondary/70 hover:text-secondary"
												)}
											>
												<FaYoutube className="h-4 w-4" />
											</a>
										)}
									</div>
								)}

								{/* Divider */}
								{socialMedia && (
									<div className={cn(
										"h-5 w-px",
										useLightText ? "bg-white/30" : "bg-secondary/20"
									)} />
								)}

								{/* Search */}
								<NavbarSearch useLightText={useLightText} />

								{/* Language Switcher */}
								<LanguageSwitcher variant="compact" />

								{/* User Account / Dashboard - Show login icon if not logged in, avatar if logged in */}
								{session ? (
									<ProtectedNavbar />
								) : (
									<Link
										href="/login"
										className={cn(
											"transition-colors",
											useLightText
												? "text-white/70 hover:text-white"
												: "text-secondary/70 hover:text-secondary"
										)}
									>
										<User className="h-5 w-5" />
									</Link>
								)}
							</div>

							{/* Mobile Menu */}
							<MobileNavbar useLightText={useLightText} />
						</div>
					</div>
				</nav>
			</div>
		</div>
	);
}
