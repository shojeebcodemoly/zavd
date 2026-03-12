"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";

const schema = z.object({
	fullName: z.string().min(2, "Name is required"),
	email: z.string().email("Invalid email"),
	phone: z.string().optional(),
	message: z.string().min(5, "Message is required"),
	newsletter: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

// Cream/beige input — matches reference exactly
const field =
	"w-full px-4 bg-[#F2EDE6] border border-transparent rounded-sm text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-primary/30 focus:bg-[#EDE8E1] transition-colors";

export function KontaktSimpleForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			fullName: "",
			email: "",
			phone: "",
			message: "",
			newsletter: false,
		},
	});

	const onSubmit = async (data: FormData) => {
		setIsSubmitting(true);
		try {
			const response = await fetch("/api/simple-contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					fullName: data.fullName,
					email: data.email,
					phone: data.phone || "",
					message: data.message,
					newsletter: data.newsletter || false,
					pageUrl: window.location.href,
				}),
			});

			const result = await response.json();

			if (result.success) {
				setIsSuccess(true);
				reset();
				toast.success("Your message has been sent!");
				setTimeout(() => setIsSuccess(false), 5000);
			} else {
				toast.error(result.message || "Something went wrong.");
			}
		} catch {
			toast.error("Something went wrong. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isSuccess) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center">
				<div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
					<Send className="w-6 h-6 text-primary" />
				</div>
				<h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
				<p className="text-gray-500">
					Thank you for reaching out. We&apos;ll get back to you soon.
				</p>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

			{/* Your Name */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1.5">
					Your Name<span className="text-primary ml-0.5">*</span>
				</label>
				<input
					{...register("fullName")}
					className={cn(field, "h-12", errors.fullName && "border-red-400")}
					disabled={isSubmitting}
				/>
				{errors.fullName && (
					<p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
				)}
			</div>

			{/* Email + Phone — side by side */}
			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1.5">
						Email Address<span className="text-primary ml-0.5">*</span>
					</label>
					<input
						{...register("email")}
						type="email"
						className={cn(field, "h-12", errors.email && "border-red-400")}
						disabled={isSubmitting}
					/>
					{errors.email && (
						<p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
					)}
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1.5">
						Phone Number<span className="text-primary ml-0.5">*</span>
					</label>
					<input
						{...register("phone")}
						type="tel"
						className={cn(field, "h-12")}
						disabled={isSubmitting}
					/>
				</div>
			</div>

			{/* Message */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1.5">
					Message<span className="text-primary ml-0.5">*</span>
				</label>
				<textarea
					{...register("message")}
					rows={7}
					className={cn(
						field,
						"py-3 resize-none",
						errors.message && "border-red-400"
					)}
					disabled={isSubmitting}
				/>
				{errors.message && (
					<p className="text-xs text-red-500 mt-1">{errors.message.message}</p>
				)}
			</div>

			{/* Newsletter checkbox */}
			<label className="flex items-center gap-2.5 cursor-pointer select-none">
				<input
					{...register("newsletter")}
					type="checkbox"
					className="w-4 h-4 rounded border-gray-300 accent-primary shrink-0"
					disabled={isSubmitting}
				/>
				<span className="text-sm text-gray-500 leading-snug">
					I&apos;d like to get news and insights from us{" "}
					<span className="text-gray-400">(optional)</span>
				</span>
			</label>

			{/* Submit button — full width */}
			<button
				type="submit"
				disabled={isSubmitting}
				className="w-full py-4 bg-primary text-white font-semibold rounded-sm text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-60 mt-2"
			>
				{isSubmitting ? (
					<>
						<Loader2 className="w-4 h-4 animate-spin" />
						Sending...
					</>
				) : (
					<>
						<Send className="w-4 h-4" />
						Send message
					</>
				)}
			</button>
		</form>
	);
}
