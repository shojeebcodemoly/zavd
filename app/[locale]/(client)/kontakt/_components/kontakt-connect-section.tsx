import { Twitter, Facebook, Linkedin, Instagram, Youtube } from "lucide-react";
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

export function KontaktConnectSection({
	data,
	socialLinks,
}: KontaktConnectSectionProps) {
	const activeSocials = socialIcons.filter(
		({ key }) => socialLinks?.[key]
	);

	return (
		<>
			{/* Top — primary color banner with centered bordered badge */}
			<div className="w-full bg-primary py-12">
				<div className="flex items-center _container gap-0">
					{/* Left line */}
					<div className="flex-1 h-px bg-white/40" />

					{/* Badge */}
					<div className="mx-8 border border-white/70 px-10 py-3.5 shrink-0">
						<span className="text-white text-sm font-semibold tracking-[0.25em] uppercase whitespace-nowrap">
							{data.badge || "Connect With Us"}
						</span>
					</div>

					{/* Right line */}
					<div className="flex-1 h-px bg-white/40" />
				</div>
			</div>

			{/* Bottom — dark overlay with city background + social icons */}
			<div
				className="relative w-full py-28"
				style={
					data.backgroundImage
						? { backgroundImage: `url(${data.backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }
						: { backgroundColor: "#1a1a2e" }
				}
			>
			<div className="absolute inset-0 bg-black/35" />
			<div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl mx-auto">
					<h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-wide uppercase">
						{data.heading || "GET IN TOUCH"}
					</h2>

					{data.description && (
						<p className="text-white/70 text-base md:text-lg mb-10 leading-relaxed">
							{data.description}
						</p>
					)}

					{/* Social icon circles */}
					<div className="flex items-center gap-28 flex-wrap justify-center mt-4">
						{socialIcons.map(({ key, Icon, label }) => {
							const href = socialLinks?.[key];
							const cls = "w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-200";
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
								<span
									key={key}
									aria-label={label}
									className={cls}
									style={{ borderColor: "#22d3ee", color: "#22d3ee" }}
								>
									<Icon className="w-5 h-5" />
								</span>
							);
						})}
					</div>
				</div>
			</div>
		</>
	);
}
