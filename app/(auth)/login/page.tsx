"use client";

import { useState, Suspense } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";

import { LoadingButton } from "@/components/ui/loading-button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
	email: z.string().email("Invalid email format"),
	password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	// Get callback URL from query params
	const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (values: FormValues) => {
		try {
			setError(null);
			setIsLoading(true);

			// Call Better Auth sign in
			const res = await authClient.signIn.email({
				email: values.email,
				password: values.password,
			});

			if (res.data === null) {
				throw new Error(res?.error?.message);
			}

			toast.success("Login successful");
			router.push(callbackUrl);
		} catch (err: any) {
			setError(
				err?.message || "Login failed. Please check your credentials."
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="_container padding-top">
			<div className="max-w-sm mx-auto">
				<h1 className="text-3xl font-bold mb-6">Sign In</h1>

				{error && (
					<div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
						{error}
					</div>
				)}

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						{/* Email */}
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="email@example.com"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Password */}
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="••••••••"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<LoadingButton
							type="submit"
							className="w-full"
							loading={isLoading}
							loadingText="Signing In..."
						>
							Sign In
						</LoadingButton>
					</form>
				</Form>

				<p className="mt-6 text-center text-sm text-gray-600">
					{`Don't have an account?`}
					<a href="/register" className="text-blue-600 hover:underline">
						Register
					</a>
				</p>
			</div>
		</div>
	);
}

function LoginFormSkeleton() {
	return (
		<div className="_container padding-top">
			<div className="max-w-sm mx-auto space-y-6">
				<Skeleton className="h-9 w-32" />
				<div className="space-y-6">
					<div className="space-y-2">
						<Skeleton className="h-4 w-12" />
						<Skeleton className="h-10 w-full" />
					</div>
					<div className="space-y-2">
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-10 w-full" />
					</div>
					<Skeleton className="h-11 w-full" />
				</div>
				<Skeleton className="h-4 w-48 mx-auto" />
			</div>
		</div>
	);
}

export default function Login() {
	return (
		<Suspense fallback={<LoginFormSkeleton />}>
			<LoginForm />
		</Suspense>
	);
}
