"use client";

import { useTranslations } from "next-intl";
import { Phone, Clock } from "lucide-react";
import { FaFacebookF, FaYoutube } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface TopBarProps {
	facebookUrl?: string;
	youtubeUrl?: string;
}

export function TopBar({ facebookUrl, youtubeUrl }: TopBarProps) {
	const t = useTranslations("topBar");

	return (
		<div className="w-full bg-black/80 backdrop-blur-sm border-b border-white/10 z-50">
			<div className="_container">
				<div className="flex items-center justify-between h-10 text-xs text-white/80">
					{/* Left: Phone + Hours */}
					<div className="flex items-center gap-4">
						<a
							href={`tel:${t("phone").replace(/\s/g, "")}`}
							className="flex items-center gap-1.5 hover:text-white transition-colors"
						>
							<Phone className="h-3 w-3 text-red-500 shrink-0" />
							<span>{t("phone")}</span>
						</a>
						<div className="flex items-center gap-1.5">
							<Clock className="h-3 w-3 text-red-500 shrink-0" />
							<span>{t("hours")}</span>
						</div>
					</div>

					{/* Right: Social Icons */}
					<div className="flex items-center gap-3">
						{facebookUrl && (
							<a
								href={facebookUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-white transition-colors"
								aria-label="Facebook"
							>
								<FaFacebookF className="h-3.5 w-3.5" />
							</a>
						)}
						{youtubeUrl && (
							<a
								href={youtubeUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-white transition-colors"
								aria-label="YouTube"
							>
								<FaYoutube className="h-3.5 w-3.5" />
							</a>
						)}
						{/* Fallback: show icons even without URLs */}
						{!facebookUrl && (
							<span className="text-white/40 cursor-default" aria-hidden>
								<FaFacebookF className="h-3.5 w-3.5" />
							</span>
						)}
						{!youtubeUrl && (
							<span className="text-white/40 cursor-default" aria-hidden>
								<FaYoutube className="h-3.5 w-3.5" />
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
