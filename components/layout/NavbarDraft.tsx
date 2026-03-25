"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuoteRequestModal } from "./QuoteRequestModal";

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { mainNav } from "@/config/navigation";
import { useNavbarVariant } from "@/lib/context/navbar-variant-context";
import { cn } from "@/lib/utils";
import type { SiteConfigType } from "@/config/site";
import Logo from "../common/logo";
import MobileNavbar from "./MobileNavbar";
import ProtectedNavbar from "./ProtectedNavbar";
import { NavbarSearch } from "./NavbarSearch";

interface NavbarProps {
	config: SiteConfigType;
}

export function Navbar({ config }: NavbarProps) {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
	const { variant } = useNavbarVariant();

	// Check if we should use light text (dark hero background and not scrolled)
	const useLightText = variant === "dark-hero" && !isScrolled;

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div>
			<div className="fixed top-3 sm:top-6 left-0 z-50 w-full">
				<header className={"_container"}>
					<nav
						className={`py-2 sm:py-3 transition-all backdrop-blur-md duration-300 rounded-full border ${
							isScrolled
								? "bg-slate-100/60 border-primary/10 shadow-lg px-3 pl-4 sm:px-4 sm:pl-6!"
								: "border-transparent"
						}`}
					>
						<div className="flex bg-none items-center justify-between gap-4">
							{/* Logo */}
							<Logo />

							{/* Desktop Nav */}
							<div className="hidden lg:flex items-center justify-center flex-1">
								<NavigationMenu>
									<NavigationMenuList>
										{mainNav.map((item) => (
											<NavigationMenuItem key={item.title}>
															{item.isDynamic ? (
																/* Products removed - skip dynamic menu */
																null
															) : item.items ? (
													// Static menu items with subitems
													<>
														<NavigationMenuTrigger
																className={cn(
																	"bg-transparent! hover:bg-secondary/10! focus:bg-secondary/10! active:bg-secondary/20! data-[state=open]:bg-secondary/10! text-sm font-medium transition-colors",
																	useLightText
																		? "text-white/90! hover:text-white! focus:text-white! active:text-white! data-[state=open]:text-white!"
																		: "text-secondary! hover:text-secondary! focus:text-secondary! active:text-primary! data-[state=open]:text-secondary!"
																)}
															>
															<Link href={item.href}>
																{item.title}
															</Link>
														</NavigationMenuTrigger>
														<NavigationMenuContent className="bg-slate-100/80! border! border-slate-200! ring-0! outline-none! backdrop-blur-xl">
															<div className="min-w-[180px] p-3 bg-slate-100/80 backdrop-blur-xl border border-white/20 shadow-sm rounded-sm">
																<div className="space-y-1">
																	{item.items.map(
																		(subItem) => (
																			<Link
																				key={subItem.title}
																				href={subItem.href}
																				className="block text-sm text-slate-600 hover:text-secondary transition-colors hover:underline py-1.5 px-2 rounded hover:bg-secondary/5"
																			>
																				{subItem.title}
																			</Link>
																		)
																	)}
																</div>
															</div>
														</NavigationMenuContent>
													</>
												) : (
													// Simple link items
													<NavigationMenuLink
														href={item.href}
														className={cn(
															navigationMenuTriggerStyle(),
															"bg-transparent! hover:bg-secondary/10! focus:bg-secondary/10! active:bg-secondary/20! transition-colors",
															useLightText
																? "text-white/90! hover:text-white! focus:text-white! active:text-white!"
																: "text-secondary! hover:text-primary! focus:text-primary! active:text-primary!"
														)}
													>
														{item.title}
													</NavigationMenuLink>
												)}
											</NavigationMenuItem>
										))}
									</NavigationMenuList>
								</NavigationMenu>
							</div>

							{/* Search */}
							<div className="hidden lg:flex items-center">
								<NavbarSearch useLightText={useLightText} />
							</div>

							{/* Actions */}
							<div className="hidden md:flex items-center gap-6 shrink-0">
								<div className="space-y-2">
									<a
										href={`mailto:${config.company.email}`}
										className={cn(
											"flex items-center gap-2 text-xs font-medium hover:underline transition-colors whitespace-nowrap",
											useLightText ? "text-white/90 hover:text-white" : "text-primary"
										)}
									>
										<Mail className="h-4 w-4" />
										<span>{config.company.email}</span>
									</a>
									<a
										href={`tel:${config.company.phone.replace(
											/\s/g,
											""
										)}`}
										className={cn(
											"flex items-center gap-2 text-xs font-medium hover:underline transition-colors whitespace-nowrap",
											useLightText ? "text-white/90 hover:text-white" : "text-primary hover:text-primary"
										)}
									>
										<Phone className="h-4 w-4" />
										<span>{config.company.phone}</span>
									</a>
								</div>
								<Button
									className={cn(
										"rounded-full px-6 shadow-md",
										useLightText
											? "bg-white text-secondary hover:bg-white/90 shadow-black/10"
											: "bg-primary hover:bg-primary text-white shadow-secondary/20"
									)}
									onClick={() => setIsQuoteModalOpen(true)}
								>
									Begär offert
								</Button>
							</div>
							<div className="hidden lg:block">
								<ProtectedNavbar />
							</div>

							{/* Mobile Menu */}
							<MobileNavbar useLightText={useLightText} />
						</div>
					</nav>
				</header>
			</div>

			{/* Quote Request Modal */}
			<QuoteRequestModal
				open={isQuoteModalOpen}
				onOpenChange={setIsQuoteModalOpen}
			/>
		</div>
	);
}
