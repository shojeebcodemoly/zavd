"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
	SheetClose,
} from "@/components/ui/sheet";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { mainNavNew } from "@/config/navigation-new";
import { useNavigation } from "@/lib/hooks/use-navigation";
import Logo from "../common/logo";
import { useState } from "react";
import ProtectedNavbar from "./ProtectedNavbar";
import { QuoteRequestModal } from "./QuoteRequestModal";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { User, Globe, Check } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { locales, defaultLocale, localeFlags, localeLabels, type Locale } from "@/i18n/config";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MobileNavbarProps {
	useLightText?: boolean;
}

const MobileNavbar = ({ useLightText = false }: MobileNavbarProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const locale = useLocale() as Locale;
	const [open, setOpen] = useState(false);
	const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
	const { data: navigationData, isLoading } = useNavigation();
	const { data: session } = authClient.useSession();
	const t = useTranslations("navigation");
	const tCommon = useTranslations("common");

	const switchLocale = (newLocale: Locale) => {
		if (newLocale === locale) return;

		// Remove current locale prefix from pathname
		let pathWithoutLocale = pathname;
		for (const loc of locales) {
			if (pathname === `/${loc}`) {
				pathWithoutLocale = "/";
				break;
			}
			if (pathname.startsWith(`/${loc}/`)) {
				pathWithoutLocale = pathname.substring(loc.length + 1);
				break;
			}
		}

		// Build new URL
		let newUrl: string;
		if (newLocale === defaultLocale) {
			newUrl = pathWithoutLocale || "/";
		} else {
			newUrl = `/${newLocale}${pathWithoutLocale}`;
		}

		// Set cookie for locale persistence
		document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;

		// Close menu first, then navigate
		setOpen(false);
		setTimeout(() => {
			window.location.href = newUrl;
		}, 100);
	};

	const handleQuoteClick = () => {
		setOpen(false);
		setIsQuoteModalOpen(true);
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = searchValue.trim();
		if (trimmed.length >= 2) {
			router.push(`/?s=${encodeURIComponent(trimmed)}`);
			setOpen(false);
			setSearchValue("");
		}
	};

	const toggleCategory = (categoryId: string) => {
		setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="lg:hidden bg-none! hover:bg-transparent! p-0! w-auto! h-auto!"
				>
					<Menu
						className={`h-6 w-6 ${useLightText ? "text-white" : "text-secondary"}`}
					/>
				</Button>
			</SheetTrigger>
			<SheetContent
				side="right"
				className="w-[280px] p-0 bg-white/95 backdrop-blur-xl border-l border-gray-200/50 shadow-2xl"
			>
				<SheetTitle className="sr-only">{tCommon("menu")}</SheetTitle>
				<div className="flex flex-col h-full">
					{/* Compact Header */}
					<div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-100">
						<div onClick={() => setOpen(false)}>
							<Logo textClassName="text-secondary" />
						</div>
						<SheetClose asChild>
							<button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
								<X className="h-5 w-5 text-gray-800" />
							</button>
						</SheetClose>
					</div>

					{/* Search Section */}
					<div className="shrink-0 px-4 py-3 border-b border-gray-100">
						<div className="flex items-center gap-2">
							<form onSubmit={handleSearch} className="relative flex-1">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
								<Input
									type="text"
									value={searchValue}
									onChange={(e) => setSearchValue(e.target.value)}
									placeholder={t("searchPlaceholder")}
									className="pl-10 pr-4 h-10 bg-gray-50 border-gray-200 rounded-lg text-sm focus:ring-primary"
								/>
							</form>
							{/* Language Switcher Dropdown */}
							<DropdownMenu modal={false}>
								<DropdownMenuTrigger asChild>
									<button className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-secondary bg-gray-100 hover:bg-gray-200 rounded-lg transition-all">
										<Globe className="h-3.5 w-3.5" />
										<span>{localeFlags[locale]} {locale.toUpperCase()}</span>
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="min-w-[120px]">
									{locales.map((loc) => (
										<DropdownMenuItem
											key={loc}
											onClick={() => switchLocale(loc)}
											className={cn(
												"cursor-pointer flex items-center justify-between gap-2",
												loc === locale && "bg-accent font-medium"
											)}
										>
											<span className="flex items-center gap-2">
												<span>{localeFlags[loc]}</span>
												<span>{localeLabels[loc]}</span>
											</span>
											{loc === locale && <Check className="h-4 w-4 text-primary" />}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					{/* User Profile Section - Show dashboard if logged in, login link if not */}
					<div className="shrink-0 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
						<div className="flex items-center gap-3">
							{session ? (
								<ProtectedNavbar />
							) : (
								<Link
									href="/login"
									className="flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary transition-colors"
									onClick={() => setOpen(false)}
								>
									<User className="h-5 w-5" />
									<span>{t("login")}</span>
								</Link>
							)}
						</div>
					</div>

					{/* Scrollable Navigation */}
					<div className="flex-1 overflow-y-auto nav-dropdown-scroll">
						<div className="px-2 py-2 pb-4">
							<Accordion
								type="single"
								collapsible
								className="w-full space-y-0.5"
							>
								{mainNavNew.map((item, index) => (
									<AccordionItem
										key={item.titleKey}
										value={`item-${index}`}
										className="border-0"
									>
										{/* Dynamic Produkter menu */}
										{item.isDynamic ? (
											<>
												<AccordionTrigger className="px-3 py-2.5 text-sm font-medium text-secondary hover:text-secondary hover:bg-secondary/5 hover:no-underline rounded-lg transition-all data-[state=open]:bg-secondary/5 data-[state=open]:text-secondary uppercase">
													<span className="flex-1 text-left">
														{t(item.titleKey)}
													</span>
												</AccordionTrigger>
												<AccordionContent className="pb-1 pt-0.5">
													<div className="ml-3 pl-3 border-l-2 border-secondary/20 space-y-0.5">
														{isLoading && (
															<div className="px-3 py-2 text-sm text-gray-400">
																{tCommon("loading")}
															</div>
														)}
														{navigationData?.categories.map(
															(category) => (
																<div key={category._id}>
																	{/* Category with expandable products */}
																	{category.products.length > 0 ? (
																		<>
																			<button
																				onClick={() => toggleCategory(category._id)}
																				className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-primary hover:text-primary/80 hover:bg-secondary/5 rounded-lg transition-all"
																			>
																				<span>{category.name}</span>
																				<ChevronDown
																					className={cn(
																						"h-4 w-4 text-muted-foreground transition-transform duration-200",
																						expandedCategory === category._id && "rotate-180"
																					)}
																				/>
																			</button>
																			{/* Products - only show when expanded */}
																			{expandedCategory === category._id && (
																				<div className="ml-3 pl-3 border-l border-gray-200 space-y-0.5 animate-in slide-in-from-top-1 duration-200 max-h-[200px] overflow-y-auto nav-dropdown-scroll">
																					{category.products.map((product) => (
																						<Link
																							key={product._id}
																							href={`/products/category/${product.primaryCategorySlug}/${product.slug}`}
																							className="block px-3 py-1.5 text-xs text-gray-500 hover:text-secondary hover:bg-secondary/5 rounded-md transition-all"
																							onClick={() => setOpen(false)}
																						>
																							{product.title}
																						</Link>
																					))}
																					<Link
																						href={`/products/category/${category.slug}`}
																						className="block px-3 py-1.5 text-xs text-secondary font-medium hover:underline"
																						onClick={() => setOpen(false)}
																					>
																						{tCommon("viewAll")} →
																					</Link>
																				</div>
																			)}
																		</>
																	) : (
																		/* Category without products - just a link */
																		<Link
																			href={`/products/category/${category.slug}`}
																			className="flex items-center px-3 py-2 text-sm font-medium text-primary hover:text-primary/80 hover:bg-secondary/5 rounded-lg transition-all"
																			onClick={() => setOpen(false)}
																		>
																			{category.name}
																		</Link>
																	)}
																</div>
															)
														)}
														{navigationData &&
															navigationData.categories.length === 0 && (
																<div className="px-3 py-2 text-sm text-gray-400">
																	{t("noCategories")}
																</div>
															)}
													</div>
												</AccordionContent>
											</>
										) : item.items ? (
											// Static menu items with subitems (Starta Eget, Om Oss)
											<>
												<AccordionTrigger className="px-3 py-2.5 text-sm font-medium text-secondary hover:text-secondary hover:bg-secondary/5 hover:no-underline rounded-lg transition-all data-[state=open]:bg-secondary/5 data-[state=open]:text-secondary uppercase">
													<span className="flex-1 text-left">
														{t(item.titleKey)}
													</span>
												</AccordionTrigger>
												<AccordionContent className="pb-1 pt-0.5">
													<div className="ml-3 pl-3 border-l-2 border-secondary/20 space-y-0.5">
														{item.items.map((subItem) => (
															<Link
																key={subItem.titleKey}
																href={subItem.href}
																className="block px-3 py-2 text-sm text-gray-600 hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all"
																onClick={() => setOpen(false)}
															>
																{t(subItem.titleKey)}
															</Link>
														))}
													</div>
												</AccordionContent>
											</>
										) : (
											// Simple link items (Nyheter och artiklar, Utbildningar, Kontakt)
											<Link
												href={item.href}
												className="flex items-center px-3 py-2.5 text-sm font-medium text-secondary hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all uppercase"
												onClick={() => setOpen(false)}
											>
												{t(item.titleKey)}
											</Link>
										)}
									</AccordionItem>
								))}
							</Accordion>
						</div>
					</div>

					{/* Compact Footer */}
					<div className="shrink-0 p-3 border-t border-gray-100 bg-gray-50/80">
						<Button
							className="w-full bg-primary hover:bg-primary-hover text-white h-10 text-sm font-medium rounded-xl shadow-sm"
							onClick={handleQuoteClick}
						>
							{t("requestQuote")}
						</Button>
					</div>
				</div>
			</SheetContent>

			{/* Quote Request Modal */}
			<QuoteRequestModal
				open={isQuoteModalOpen}
				onOpenChange={setIsQuoteModalOpen}
			/>
		</Sheet>
	);
};

export default MobileNavbar;
