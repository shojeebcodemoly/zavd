"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, ChevronRight, Search } from "lucide-react";
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
import { mainNav } from "@/config/navigation";
import { useNavigation } from "@/lib/hooks/use-navigation";
import Logo from "../common/logo";
import { useState } from "react";
import ProtectedNavbar from "./ProtectedNavbar";
import { QuoteRequestModal } from "./QuoteRequestModal";
import { Input } from "@/components/ui/input";

interface MobileNavbarProps {
	useLightText?: boolean;
}

const MobileNavbar = ({ useLightText = false }: MobileNavbarProps) => {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const { data: navigationData, isLoading } = useNavigation();

	const handleQuoteClick = () => {
		setOpen(false); // Close the mobile menu
		setIsQuoteModalOpen(true); // Open the quote modal
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
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<div className="flex flex-col h-full">
					{/* Compact Header */}
					<div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-100">
						<div onClick={() => setOpen(false)}>
							<Logo />
						</div>
						<SheetClose asChild>
							<button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
								<X className="h-5 w-5 text-gray-800" />
							</button>
						</SheetClose>
					</div>

					{/* Search Section */}
					<div className="shrink-0 px-4 py-3 border-b border-gray-100">
						<form onSubmit={handleSearch} className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
							<Input
								type="text"
								value={searchValue}
								onChange={(e) => setSearchValue(e.target.value)}
								placeholder="Sök produkter, artiklar..."
								className="pl-10 pr-4 h-10 bg-gray-50 border-gray-200 rounded-lg text-sm focus:ring-primary"
							/>
						</form>
					</div>

					{/* User Profile Section */}
					<div className="shrink-0 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
						<div className="flex items-center gap-3">
							<ProtectedNavbar />
						</div>
					</div>

					{/* Scrollable Navigation */}
					<div className="flex-1 overflow-y-auto">
						<div className="px-2 py-2">
							<Accordion
								type="single"
								collapsible
								className="w-full space-y-0.5"
							>
								{mainNav.map((item, index) => (
									<AccordionItem
										key={item.title}
										value={`item-${index}`}
										className="border-0"
									>
										{/* Dynamic Kategori menu */}
										{item.isDynamic ? (
											<>
												<AccordionTrigger className="px-3 py-2.5 text-sm font-medium text-secondary hover:text-secondary hover:bg-secondary/5 hover:no-underline rounded-lg transition-all data-[state=open]:bg-secondary/5 data-[state=open]:text-secondary">
													<Link
														href={item.href}
														className="flex-1 text-left"
														onClick={() => setOpen(false)}
													>
														{item.title}
													</Link>
												</AccordionTrigger>
												<AccordionContent className="pb-1 pt-0.5">
													<div className="ml-3 pl-3 border-l-2 border-secondary/20 space-y-0.5">
														{isLoading && (
															<div className="px-3 py-2 text-sm text-gray-400">
																Laddar...
															</div>
														)}
														{navigationData?.categories.map(
															(category) => (
																<div key={category._id}>
																	<Link
																		href={`/products/category/${category.slug}`}
																		className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all"
																		onClick={() =>
																			setOpen(false)
																		}
																	>
																		{category.name}
																		{category.products
																			.length > 0 && (
																			<ChevronRight className="h-3.5 w-3.5 text-secondary" />
																		)}
																	</Link>
																	{category.products.length >
																		0 && (
																		<div className="ml-3 pl-3 border-l border-gray-200 space-y-0.5">
																			{category.products
																				.slice(0, 3)
																				.map((product) => (
																					<Link
																						key={
																							product._id
																						}
																						href={`/products/category/${product.primaryCategorySlug}/${product.slug}`}
																						className="block px-3 py-1.5 text-xs text-gray-500 hover:text-secondary hover:bg-secondary/5 rounded-md transition-all"
																						onClick={() =>
																							setOpen(
																								false
																							)
																						}
																					>
																						{
																							product.title
																						}
																					</Link>
																				))}
																			{category.products
																				.length > 3 && (
																				<Link
																					href={`/products/category/${category.slug}`}
																					className="block px-3 py-1.5 text-xs text-secondary font-medium hover:underline"
																					onClick={() =>
																						setOpen(false)
																					}
																				>
																					+
																					{category
																						.products
																						.length -
																						3}{" "}
																					fler
																				</Link>
																			)}
																		</div>
																	)}
																</div>
															)
														)}
														{navigationData &&
															navigationData.categories
																.length === 0 && (
																<div className="px-3 py-2 text-sm text-gray-400">
																	Inga kategorier tillgängliga
																</div>
															)}
													</div>
												</AccordionContent>
											</>
										) : item.items ? (
											// Static menu items with subitems
											<>
												<AccordionTrigger className="px-3 py-2.5 text-sm font-medium text-secondary hover:text-secondary hover:bg-secondary/5 hover:no-underline rounded-lg transition-all data-[state=open]:bg-secondary/5 data-[state=open]:text-secondary">
													<Link
														href={item.href}
														className="flex-1 text-left"
														onClick={() => setOpen(false)}
													>
														{item.title}
													</Link>
												</AccordionTrigger>
												<AccordionContent className="pb-1 pt-0.5">
													<div className="ml-3 pl-3 border-l-2 border-secondary/20 space-y-0.5">
														{item.items.map((subItem) => (
															<Link
																key={subItem.title}
																href={subItem.href}
																className="block px-3 py-2 text-sm text-gray-600 hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all"
																onClick={() => setOpen(false)}
															>
																{subItem.title}
															</Link>
														))}
													</div>
												</AccordionContent>
											</>
										) : (
											// Simple link items
											<Link
												href={item.href}
												className="flex items-center px-3 py-2.5 text-sm font-medium text-secondary hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all"
												onClick={() => setOpen(false)}
											>
												{item.title}
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
							Begär offert
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
