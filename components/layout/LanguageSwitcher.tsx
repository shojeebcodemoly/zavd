"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	locales,
	defaultLocale,
	localeLabels,
	localeFlags,
	type Locale,
} from "@/i18n/config";

interface LanguageSwitcherProps {
	variant?: "default" | "compact";
	theme?: "dark" | "light";
}

export function LanguageSwitcher({ variant = "default", theme = "dark" }: LanguageSwitcherProps) {
	const locale = useLocale() as Locale;
	const pathname = usePathname();
	const [isPending, startTransition] = useTransition();

	const switchLocale = (newLocale: Locale) => {
		if (newLocale === locale) return;

		startTransition(() => {
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
				// English (default) - no prefix
				newUrl = pathWithoutLocale || "/";
			} else {
				// Other locales - add prefix
				newUrl = `/${newLocale}${pathWithoutLocale}`;
			}

			// Set cookie for locale persistence
			document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;

			// Navigate with full page reload for clean state
			window.location.href = newUrl;
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size={variant === "compact" ? "sm" : "md"}
					className={cn(
						"gap-1.5 transition-all duration-200",
						theme === "dark"
							? "text-white/70 hover:text-white hover:bg-white/10"
							: "text-secondary/70 hover:text-secondary hover:bg-secondary/10",
						isPending && "opacity-70 pointer-events-none"
					)}
					disabled={isPending}
				>
					<Globe className={cn("h-4 w-4", isPending && "animate-pulse")} />
					{variant === "default" && (
						<>
							<span className="hidden sm:inline text-sm">
								{localeFlags[locale]} {localeLabels[locale]}
							</span>
							<ChevronDown className="h-3 w-3 opacity-60" />
						</>
					)}
					{variant === "compact" && (
						<>
							<span className="text-xs font-medium">{locale.toUpperCase()}</span>
							<ChevronDown className="h-3 w-3 opacity-60" />
						</>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="min-w-[140px] animate-in fade-in-0 zoom-in-95 duration-200"
			>
				{locales.map((loc) => (
					<DropdownMenuItem
						key={loc}
						onClick={() => switchLocale(loc)}
						className={cn(
							"cursor-pointer flex items-center justify-between gap-2 transition-colors",
							loc === locale && "bg-accent font-medium"
						)}
						disabled={isPending}
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
	);
}
