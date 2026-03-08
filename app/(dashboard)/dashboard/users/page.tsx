"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UsersPageSkeleton } from "@/components/ui/skeletons";

// ============================================================================
// Validation Schema
// ============================================================================

const createUserSchema = z.object({
	name: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.max(100, "Name must not exceed 100 characters"),
	email: z.string().email("Invalid email format"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.max(128, "Password must not exceed 128 characters")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			"Password must contain at least one uppercase letter, one lowercase letter, and one number"
		),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

// ============================================================================
// Types
// ============================================================================

interface User {
	_id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	createdAt: string;
	lastLoginAt?: string;
}

// ============================================================================
// Main Component
// ============================================================================

export default function UsersPage() {
	const [loading, setLoading] = useState(true);
	const [creating, setCreating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [users, setUsers] = useState<User[]>([]);
	const [showForm, setShowForm] = useState(false);

	// Create user form
	const form = useForm<CreateUserFormValues>({
		resolver: zodResolver(createUserSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	// ========================================================================
	// Fetch users
	// ========================================================================
	const fetchUsers = async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/admin/users");

			if (!response.ok) {
				throw new Error("Failed to fetch users");
			}

			const data = await response.json();
			setUsers(data.data.users || []);
		} catch (err) {
			console.error("Error fetching users:", err);
			setError(err instanceof Error ? err.message : "Failed to load users");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	// ========================================================================
	// Create user handler
	// ========================================================================
	const onSubmit = async (values: CreateUserFormValues) => {
		try {
			setCreating(true);
			setError(null);
			setSuccess(null);

			const response = await fetch("/api/admin/users", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Failed to create user");
			}

			setSuccess(`User ${values.name} created successfully!`);
			form.reset();
			setShowForm(false);

			// Refresh users list
			fetchUsers();

			setTimeout(() => setSuccess(null), 3000);
		} catch (err) {
			console.error("Error creating user:", err);
			setError(err instanceof Error ? err.message : "Failed to create user");
		} finally {
			setCreating(false);
		}
	};

	// ========================================================================
	// Format date
	// ========================================================================
	const formatDate = (dateString?: string) => {
		if (!dateString) return "Never";
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	// ========================================================================
	// Loading state
	// ========================================================================
	if (loading) {
		return <UsersPageSkeleton />;
	}

	// ========================================================================
	// Main render
	// ========================================================================
	return (
		<div className="space-y-6">
			<div className="bg-white rounded-lg shadow-sm border">
				{/* Header */}
				<div className="border-b px-6 py-4 flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-medium text-gray-900">
							User Management
						</h1>
						<p className="text-sm text-gray-600 mt-1">
							Create and manage user accounts
						</p>
					</div>
					<Button
						onClick={() => setShowForm(!showForm)}
						className="bg-blue-600 hover:bg-blue-700"
					>
						{showForm ? "Cancel" : "Add New User"}
					</Button>
				</div>

				{/* Alerts */}
				<div className="px-6 pt-6">
					{error && (
						<div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
							{error}
						</div>
					)}

					{success && (
						<div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
							{success}
						</div>
					)}
				</div>

				{/* Create User Form */}
				{showForm && (
					<div className="px-6 pb-6 border-b">
						<div className="bg-gray-50 rounded-lg p-6">
							<h2 className="text-lg font-semibold text-gray-900 mb-4">
								Create New User
							</h2>

							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-4"
								>
									{/* Name */}
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Full Name</FormLabel>
												<FormControl>
													<Input
														placeholder="John Doe"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

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
														placeholder="john@example.com"
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
												<FormDescription>
													Must be at least 8 characters with
													uppercase, lowercase, and numbers
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Submit */}
									<div className="flex items-center justify-end space-x-3 pt-4">
										<Button
											type="button"
											variant="outline"
											onClick={() => {
												form.reset();
												setShowForm(false);
											}}
											disabled={creating}
										>
											Cancel
										</Button>
										<LoadingButton
										type="submit"
										loading={creating}
										loadingText="Creating..."
									>
										Create User
									</LoadingButton>
									</div>
								</form>
							</Form>
						</div>
					</div>
				)}

				{/* Users Table */}
				<div className="px-6 py-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">
						All Users ({users.length})
					</h2>

					{users.length === 0 ? (
						<div className="text-center py-12 text-gray-500">
							<p>No users found. Create your first user!</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Name
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Email
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Status
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Created
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Last Login
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{users.map((user) => (
										<tr key={user._id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm font-medium text-gray-900">
													{user.name}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm text-gray-500">
													{user.email}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span
													className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
														user.emailVerified
															? "bg-green-100 text-green-800"
															: "bg-yellow-100 text-yellow-800"
													}`}
												>
													{user.emailVerified
														? "Verified"
														: "Pending"}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{formatDate(user.createdAt)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{formatDate(user.lastLoginAt)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
