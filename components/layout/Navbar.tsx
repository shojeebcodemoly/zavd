"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, X, Menu } from "lucide-react";
import { FaFacebookF, FaYoutube } from "react-icons/fa";
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
import { cn } from "@/lib/utils";
import type { SiteConfigType } from "@/config/site";
import Logo from "../common/logo";
import MobileNavbar from "./MobileNavbar";
import ProtectedNavbar from "./ProtectedNavbar";
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
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const t = useTranslations("navigation");
	const { data: session } = authClient.useSession();

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

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim().length >= 2) {
			window.location.href = `/aktuelles?s=${encodeURIComponent(searchQuery.trim())}`;
			setSearchOpen(false);
			setSearchQuery("");
		}
	};

	const navClassName = cn(
		"w-full transition-all duration-300",
		isScrolled
			? "bg-black/70 backdrop-blur-md shadow-lg"
			: "bg-black/30 backdrop-blur-md"
	);

	// Skeleton for SSR
	if (!isMounted) {
		return (
			<div className="w-full">
				<nav className="w-full bg-black/30 backdrop-blur-md py-3">
					<div className="_container">
						<div className="flex items-center justify-between gap-2">
							<Logo logoUrl={logoUrl} companyName={companyName} />
							<div className="hidden lg:flex items-center justify-center flex-1" />
							<div className="hidden lg:flex items-center gap-3" />
							<div className="lg:hidden">
								<Menu className="h-6 w-6 text-white" />
							</div>
						</div>
					</div>
				</nav>
			</div>
		);
	}

	return (
		<div className="w-full">
			<nav className={navClassName}>
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
						<div className="hidden lg:flex items-center gap-3 shrink-0">
							{/* Search */}
							{searchOpen ? (
								<form onSubmit={handleSearch} className="flex items-center gap-1">
									<input
										type="text"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										placeholder={t("searchPlaceholder")}
										autoFocus
										className="bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm rounded px-2 py-1 w-36 outline-none focus:border-white/40"
									/>
									<button
										type="button"
										onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
										className="text-white/70 hover:text-white transition-colors"
										aria-label="Close search"
									>
										<X className="h-4 w-4" />
									</button>
								</form>
							) : (
								<button
									onClick={() => setSearchOpen(true)}
									className="text-white/70 hover:text-white transition-colors border border-white/30 rounded p-1.5"
									aria-label="Search"
								>
									<Search className="h-4 w-4" />
								</button>
							)}

							{/* Language Switcher */}
							<LanguageSwitcher variant="compact" />

							{/* User */}
							{session && <ProtectedNavbar />}
						</div>

						{/* Mobile Menu */}
						<MobileNavbar useLightText={true} />
					</div>
				</div>
			</nav>
		</div>
	);
}
