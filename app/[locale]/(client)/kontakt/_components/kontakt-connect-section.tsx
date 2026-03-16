"use client";

import Link from "next/link";
import { Twitter, Facebook, Linkedin, Instagram } from "lucide-react";
import type { IKontaktConnectSection } from "@/models/kontakt-page.model";

interface SocialLinks {
	facebook?: string;
	instagram?: string;
	linkedin?: string;
	twitter?: string;
}

interface KontaktConnectSectionProps {
	data: IKontaktConnectSection;
	socialLinks?: SocialLinks;
}

const socialIcons = [
	{ key: "twitter" as const, Icon: Twitter, label: "Twitter" },
	{ key: "facebook" as const, Icon: Facebook, label: "Facebook" },
	{ key: "linkedin" as const, Icon: Linkedin, label: "LinkedIn" },
	{ key: "instagram" as const, Icon: Instagram, label: "Instagram" },
];

export function KontaktConnectSection({ data, socialLinks }: KontaktConnectSectionProps) {
	return (
		<div
			className="relative w-full py-28"
			style={
				data.backgroundImage
					? { backgroundImage: `url(${data.backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }
					: { backgroundColor: "#1a1a2e" }
			}
		>
			<div className="absolute inset-0 bg-black/40" />
			<div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl mx-auto gap-6">
				<h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide uppercase">
					{data.heading || "GET IN TOUCH"}
				</h2>

				{data.description && (
					<p className="text-white/70 text-base md:text-lg leading-relaxed">
						{data.description}
					</p>
				)}

				{/* Contact button below text */}
				<Link
					href="/kontakt#form"
					className="mt-2 inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold text-sm px-8 py-3.5 rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
				>
					Contact Us
				</Link>

				{/* Social icon circles */}
				<div className="flex items-center gap-10 flex-wrap justify-center mt-4">
					{socialIcons.map(({ key, Icon, label }) => {
						const href = socialLinks?.[key];
						const cls = "w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-200";
						return href ? (
							<a
								key={key}
								href={href}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={label}
								className={cls}
								style={{ borderColor: "#22d3ee", color: "#22d3ee" }}
								onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#22d3ee"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
								onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#22d3ee"; }}
							>
								<Icon className="w-5 h-5" />
							</a>
						) : (
							<span key={key} aria-label={label} className={cls} style={{ borderColor: "#22d3ee", color: "#22d3ee" }}>
								<Icon className="w-5 h-5" />
							</span>
						);
					})}
				</div>
			</div>
		</div>
	);
}
