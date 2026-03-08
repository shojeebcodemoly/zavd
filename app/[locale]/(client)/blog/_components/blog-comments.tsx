"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/animations";
import { MessageSquare, User, Loader2, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback } from "react";
import { isValidPhoneNumber } from "libphonenumber-js";
import {
	CountryCodeSelect,
	defaultCountry,
	type Country,
} from "@/components/ui/country-code-select";

/**
 * BlogComments Component
 *
 * Dynamic comments/reviews section for blog posts with form and API integration.
 */

interface Comment {
	id: string;
	name: string;
	comment: string;
	createdAt: string;
}

interface BlogCommentsProps {
	postId: string;
}

export function BlogComments({ postId }: BlogCommentsProps) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [comment, setComment] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [comments, setComments] = useState<Comment[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [selectedCountry, setSelectedCountry] =
		useState<Country>(defaultCountry);

	// Fetch comments on mount
	const fetchComments = useCallback(async () => {
		try {
			const response = await fetch(`/api/blog-posts/${postId}/comments`);
			const data = await response.json();

			if (data.success) {
				setComments(data.data || []);
			}
		} catch (error) {
			console.error("Failed to fetch comments:", error);
		} finally {
			setIsLoading(false);
		}
	}, [postId]);

	useEffect(() => {
		fetchComments();
	}, [fetchComments]);

	// Client-side validation
	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!name.trim() || name.trim().length < 2) {
			newErrors.name = "Namn måste vara minst 2 tecken";
		}

		if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = "Ange en giltig e-postadress";
		}

		// Validate phone with libphonenumber-js
		const fullPhone =
			selectedCountry.dialCode + phone.replace(/[\s\-]/g, "");
		if (!phone.trim() || !isValidPhoneNumber(fullPhone)) {
			newErrors.phone = "Ange ett giltigt telefonnummer för valt land";
		}

		if (!comment.trim() || comment.trim().length < 10) {
			newErrors.comment = "Kommentar måste vara minst 10 tecken";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);
		setErrors({});

		try {
			const response = await fetch(`/api/blog-posts/${postId}/comments`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: name.trim(),
					email: email.trim(),
					countryCode: selectedCountry.dialCode,
					phone: phone.trim(),
					comment: comment.trim(),
				}),
			});

			const data = await response.json();

			if (data.success) {
				// Reset form
				setName("");
				setEmail("");
				setPhone("");
				setComment("");
				setSelectedCountry(defaultCountry);
				toast.success(
					data.message ||
						"Tack för din kommentar! Den kommer att granskas innan publicering."
				);
			} else {
				// Handle validation errors from server
				if (data.errors && Array.isArray(data.errors)) {
					const serverErrors: Record<string, string> = {};
					data.errors.forEach(
						(err: { path?: string[]; message?: string }) => {
							if (err.path?.[0]) {
								serverErrors[err.path[0]] = err.message || "Ogiltigt värde";
							}
						}
					);
					setErrors(serverErrors);
				}
				toast.error(data.message || "Något gick fel. Försök igen.");
			}
		} catch {
			toast.error("Ett fel uppstod. Försök igen senare.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className="section-padding bg-gradient-to-br from-slate-50 via-white to-slate-50">
			<div className="_container">
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					variants={staggerContainer}
					className="mx-auto max-w-4xl"
				>
					{/* Section Header */}
					<motion.div variants={fadeUp} className="mb-12 text-center">
						<div className="mb-4 flex items-center justify-center gap-2">
							<MessageSquare className="h-6 w-6 text-primary" />
							<h2 className="text-3xl font-medium text-secondary md:text-4xl">
								Kommentarer
							</h2>
						</div>
						<p className="text-lg text-muted-foreground">
							Dela dina tankar och frågor om artikeln
						</p>
					</motion.div>

					{/* Existing Comments */}
					<motion.div
						variants={staggerContainer}
						className="mb-12 space-y-6"
					>
						{isLoading ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="h-8 w-8 animate-spin text-primary" />
							</div>
						) : comments.length > 0 ? (
							comments.map((c) => (
								<motion.div
									key={c.id}
									variants={staggerItem}
									className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
								>
									<div className="mb-4 flex items-start gap-4">
										<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
											<User className="h-6 w-6 text-primary" />
										</div>
										<div className="flex-1">
											<h4 className="font-semibold text-foreground">
												{c.name}
											</h4>
											<time className="text-sm text-muted-foreground">
												{new Date(c.createdAt).toLocaleDateString(
													"sv-SE",
													{
														year: "numeric",
														month: "long",
														day: "numeric",
													}
												)}
											</time>
										</div>
									</div>
									<p className="leading-relaxed text-muted-foreground">
										{c.comment}
									</p>
								</motion.div>
							))
						) : (
							<motion.div
								variants={staggerItem}
								className="py-8 text-center text-muted-foreground"
							>
								Inga kommentarer ännu. Bli den första att kommentera!
							</motion.div>
						)}
					</motion.div>

					{/* Comment Form */}
					<motion.div
						variants={fadeUp}
						className="rounded-2xl border border-border bg-white p-8 shadow-sm"
					>
						<h3 className="mb-6 text-xl font-medium text-secondary">
							Lämna en kommentar
						</h3>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid gap-4 md:grid-cols-2">
								<div>
									<label
										htmlFor="name"
										className="mb-2 block text-sm font-medium text-foreground"
									>
										Namn *
									</label>
									<Input
										id="name"
										type="text"
										value={name}
										onChange={(e) => setName(e.target.value)}
										required
										placeholder="Ditt namn"
										className={errors.name ? "border-destructive" : ""}
									/>
									{errors.name && (
										<p className="mt-1 text-sm text-destructive">
											{errors.name}
										</p>
									)}
								</div>
								<div>
									<label
										htmlFor="email"
										className="mb-2 block text-sm font-medium text-foreground"
									>
										E-post *
									</label>
									<Input
										id="email"
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										placeholder="din@email.se"
										className={errors.email ? "border-destructive" : ""}
									/>
									{errors.email && (
										<p className="mt-1 text-sm text-destructive">
											{errors.email}
										</p>
									)}
								</div>
							</div>
							<div>
								<label
									htmlFor="phone"
									className="mb-2 block text-sm font-medium text-foreground"
								>
									Telefon *
								</label>
								<div className="flex gap-2">
									<div className="w-[110px] shrink-0">
										<CountryCodeSelect
											value={selectedCountry}
											onChange={setSelectedCountry}
											disabled={isSubmitting}
										/>
									</div>
									<div className="relative flex-1 min-w-0">
										<Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
										<Input
											id="phone"
											type="tel"
											value={phone}
											onChange={(e) => setPhone(e.target.value)}
											required
											placeholder="701234567"
											className={`pl-11 h-12 ${errors.phone ? "border-destructive" : ""}`}
											disabled={isSubmitting}
										/>
									</div>
								</div>
								{errors.phone && (
									<p className="mt-1 text-sm text-destructive">
										{errors.phone}
									</p>
								)}
							</div>
							<div>
								<label
									htmlFor="comment"
									className="mb-2 block text-sm font-medium text-foreground"
								>
									Kommentar *
								</label>
								<Textarea
									id="comment"
									value={comment}
									onChange={(e) => setComment(e.target.value)}
									required
									placeholder="Skriv din kommentar här..."
									rows={5}
									className={errors.comment ? "border-destructive" : ""}
								/>
								{errors.comment && (
									<p className="mt-1 text-sm text-destructive">
										{errors.comment}
									</p>
								)}
							</div>
							<Button
								type="submit"
								disabled={isSubmitting}
								className="w-full md:w-auto"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Skickar...
									</>
								) : (
									"Skicka kommentar"
								)}
							</Button>
						</form>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
