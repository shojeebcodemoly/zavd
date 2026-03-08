"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { FaTwitter, FaFacebookF, FaLinkedinIn } from "react-icons/fa";

interface ComingSoonClientProps {
	logoUrl: string | null;
	siteName: string;
	socialLinks: {
		twitter: string | null;
		facebook: string | null;
		linkedin: string | null;
	};
	heading?: string;
	description?: string;
	newsletterTitle?: string;
	newsletterDescription?: string;
	emailPlaceholder?: string;
	buttonText?: string;
	designedBy?: string;
}

export function ComingSoonClient({
	logoUrl,
	siteName,
	socialLinks,
	heading = "Kommer snart",
	description = "Något nytt är på väg… Vi förbereder lanseringen av något spännande. Vi finjusterar detaljerna och ses snart!",
	newsletterTitle = "Nyhetsbrev",
	newsletterDescription = "Prenumerera för att hålla dig uppdaterad om ny webbdesign och senaste uppdateringar. Låt oss göra det!",
	emailPlaceholder = "E-postadress",
	buttonText = "Skicka",
	designedBy = "Designad av Nordigate",
}: ComingSoonClientProps) {
	const router = useRouter();
	const { data: session, isPending } = useSession();
	const [email, setEmail] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [error, setError] = useState("");

	const handleSubscribe = async () => {
		if (!email || submitting) return;
		setError("");
		setSubmitting(true);
		try {
			const res = await fetch("/api/form-submissions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ type: "subscriber", email }),
			});
			if (res.ok) {
				setSubmitted(true);
				setEmail("");
			} else {
				const data = await res.json();
				setError(data.message || "Något gick fel, försök igen.");
			}
		} catch {
			setError("Något gick fel, försök igen.");
		} finally {
			setSubmitting(false);
		}
	};

	useEffect(() => {
		if (!isPending && session) {
			router.push("/dashboard");
		}
	}, [session, isPending, router]);

	if (isPending) {
		return (
			<div
				className="min-h-screen flex items-center justify-center"
				style={{ background: "#21242a" }}
			>
				<div
					className="w-6 h-6 rounded-full animate-spin"
					style={{
						border: "2px solid rgba(219,164,128,0.2)",
						borderTopColor: "#dba480",
					}}
				/>
			</div>
		);
	}

	if (session) return null;

	const hasSocials =
		socialLinks.twitter || socialLinks.facebook || socialLinks.linkedin;

	return (
		<>
			{/* Import Poppins font */}
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
				.cs-wrap * { font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
				.cs-login-btn:hover { background-color: #dba480 !important; border-color: #dba480 !important; color: #fff !important; }
				.cs-social-link:hover { background: #dba480 !important; border-color: transparent !important; }
				.cs-email-input:focus { outline: none; border-color: #dba480 !important; background: rgba(255,255,255,0.15) !important; }
				.cs-submit-btn:hover { box-shadow: 0 0 30px rgba(219,164,128,0.5) !important; }
			`}</style>

			<div
				className="cs-wrap min-h-screen text-white flex flex-col"
				style={{ background: "#21242a" }}
			>
				{/* Login button - fixed top right */}
				<div className="fixed top-5 right-5 z-50">
					<Link
						href="/login"
						className="cs-login-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold no-underline transition-all duration-300"
						style={{
							background: "rgba(255,255,255,0.1)",
							border: "1px solid rgba(255,255,255,0.22)",
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
							<polyline points="10 17 15 12 10 7" />
							<line x1="15" y1="12" x2="3" y2="12" />
						</svg>
						Logga in
					</Link>
				</div>

				{/* Main content */}
				<div className="flex-1 flex items-center justify-center px-5 py-16">
					<div className="w-full max-w-[700px] text-center">
						{/* Logo */}
						<div className="mb-10">
							<Image
								src="/storage/glada-bonden-mejeri-w.svg"
								alt={siteName}
								width={250}
								height={100}
								className="mx-auto"
								style={{ maxWidth: 250, height: "auto" }}
								priority
							/>
						</div>

						{/* Heading */}
						<h1
							className="font-bold text-white mb-6"
							style={{ fontSize: 48, lineHeight: 1.2 }}
						>
							{heading}
						</h1>

						{/* Message */}
						<p
							className="font-medium mb-12"
							style={{ fontSize: 18, lineHeight: "32px", color: "#dedede" }}
						>
							{description}
						</p>

						{/* Social icons */}
						{hasSocials && (
							<ul
								className="flex gap-4 mb-10 justify-center list-none p-0"
								style={{ margin: "0 0 40px 0" }}
							>
								{socialLinks.twitter && (
									<li>
										<a
											href={socialLinks.twitter}
											target="_blank"
											rel="noopener noreferrer"
											className="cs-social-link inline-flex items-center justify-center transition-all duration-500"
											style={{
												height: 40,
												width: 40,
												borderRadius: 10,
												border: "1px solid rgba(255,255,255,0.22)",
												color: "#fff",
												fontSize: 16,
											}}
											aria-label="Twitter"
										>
											<FaTwitter />
										</a>
									</li>
								)}
								{socialLinks.facebook && (
									<li>
										<a
											href={socialLinks.facebook}
											target="_blank"
											rel="noopener noreferrer"
											className="cs-social-link inline-flex items-center justify-center transition-all duration-500"
											style={{
												height: 40,
												width: 40,
												borderRadius: 10,
												border: "1px solid rgba(255,255,255,0.22)",
												color: "#fff",
												fontSize: 16,
											}}
											aria-label="Facebook"
										>
											<FaFacebookF />
										</a>
									</li>
								)}
								{socialLinks.linkedin && (
									<li>
										<a
											href={socialLinks.linkedin}
											target="_blank"
											rel="noopener noreferrer"
											className="cs-social-link inline-flex items-center justify-center transition-all duration-500"
											style={{
												height: 40,
												width: 40,
												borderRadius: 10,
												border: "1px solid rgba(255,255,255,0.22)",
												color: "#fff",
												fontSize: 16,
											}}
											aria-label="LinkedIn"
										>
											<FaLinkedinIn />
										</a>
									</li>
								)}
							</ul>
						)}

						{/* Fallback social icons if none in DB */}
						{!hasSocials && (
							<ul className="flex gap-4 mb-10 justify-center list-none p-0">
								{[
									{ icon: <FaTwitter />, label: "Twitter" },
									{ icon: <FaFacebookF />, label: "Facebook" },
									{ icon: <FaLinkedinIn />, label: "LinkedIn" },
								].map(({ icon, label }) => (
									<li key={label}>
										<a
											href="#"
											className="cs-social-link inline-flex items-center justify-center transition-all duration-500"
											style={{
												height: 40,
												width: 40,
												borderRadius: 10,
												border: "1px solid rgba(255,255,255,0.22)",
												color: "#fff",
												fontSize: 16,
											}}
											aria-label={label}
										>
											{icon}
										</a>
									</li>
								))}
							</ul>
						)}

						{/* Newsletter */}
						<div className="mb-10">
							<h4
								className="font-semibold text-white mb-4"
								style={{ fontSize: 20 }}
							>
								{newsletterTitle}
							</h4>
							<p
								className="mb-5"
								style={{ fontSize: 15, color: "#dedede" }}
							>
								{newsletterDescription}
							</p>
							<div
								className="flex gap-2.5 mx-auto flex-wrap justify-center"
								style={{ maxWidth: 500 }}
							>
								{submitted ? (
									<p style={{ color: "#dba480", fontSize: 15, fontWeight: 500 }}>
										Tack! Du är nu prenumerant.
									</p>
								) : (
									<>
										<input
											type="email"
											placeholder={emailPlaceholder}
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
											className="cs-email-input flex-1 rounded-xl px-5 py-3.5 text-white text-sm font-normal transition-all duration-300"
											style={{
												minWidth: 250,
												background: "rgba(255,255,255,0.1)",
												border: "1px solid rgba(255,255,255,0.22)",
												color: "#fff",
											}}
										/>
										<button
											type="button"
											onClick={handleSubscribe}
											disabled={submitting}
											className="cs-submit-btn px-8 py-3.5 rounded-xl text-white text-sm font-semibold border-0 cursor-pointer transition-all duration-500"
											style={{
												background: "#dba480",
												boxShadow: "0 0 20px rgba(219,164,128,0.3)",
												opacity: submitting ? 0.7 : 1,
											}}
										>
											{submitting ? "..." : buttonText}
										</button>
									</>
								)}
							</div>
							{error && (
								<p style={{ color: "#ff6b6b", fontSize: 13, marginTop: 8 }}>
									{error}
								</p>
							)}
						</div>

						{/* Copyright */}
						<p style={{ fontSize: 14, color: "#dedede" }}>
							{designedBy}
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
