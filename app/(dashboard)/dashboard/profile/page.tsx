"use client";

import { useEffect, useState, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_ROUTES } from "@/lib/utils/constants";
import { ImageComponent } from "@/components/common/image-component";
import { useConfirmModal } from "@/components/ui/confirm-modal";
import { toast } from "sonner";

// ============================================================================
// Validation Schemas
// ============================================================================

const profileSchema = z.object({
	name: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.max(100, "Name must not exceed 100 characters"),
	bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),
	phoneNumber: z.string().optional(),
	address: z
		.object({
			street: z.string().optional(),
			city: z.string().optional(),
			postalCode: z.string().optional(),
			country: z.string().optional(),
		})
		.optional(),
});

const passwordSchema = z
	.object({
		currentPassword: z.string().min(1, "Current password is required"),
		newPassword: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.max(128, "Password must not exceed 128 characters")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				"Password must contain at least one uppercase letter, one lowercase letter, and one number"
			),
		confirmPassword: z.string().min(1, "Password confirmation is required"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

// ============================================================================
// Types
// ============================================================================

interface UserData {
	_id: string;
	name: string;
	email: string;
	image?: string | null;
	bio?: string;
	phoneNumber?: string;
	address?: {
		street?: string;
		city?: string;
		postalCode?: string;
		country?: string;
	};
}

// ============================================================================
// Main Component
// ============================================================================

export default function ProfilePage() {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [userData, setUserData] = useState<UserData | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [uploadingImage, setUploadingImage] = useState(false);
	// Cache-busting key to force image reload after upload
	const [imageKey, setImageKey] = useState(() => Date.now());

	// Pending image state for confirmation flow
	const [pendingImage, setPendingImage] = useState<File | null>(null);
	const [pendingImagePreview, setPendingImagePreview] = useState<
		string | null
	>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Confirmation modal for delete
	const { confirm: confirmDelete, ConfirmModal } = useConfirmModal({
		variant: "destructive",
	});

	// Profile form
	const profileForm = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: "",
			bio: "",
			phoneNumber: "",
			address: {
				street: "",
				city: "",
				postalCode: "",
				country: "",
			},
		},
	});

	// Password form
	const passwordForm = useForm<PasswordFormValues>({
		resolver: zodResolver(passwordSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	// ========================================================================
	// Fetch user data
	// ========================================================================
	useEffect(() => {
		const fetchProfile = async () => {
			try {
				setLoading(true);
				console.log("[Profile Page] Fetching user data...");
				const response = await fetch(API_ROUTES.USER.ME);

				if (!response.ok) {
					throw new Error("Failed to fetch profile");
				}

				const data = await response.json();
				console.log("[Profile Page] API response:", {
					user: data.data?.user,
					profile: data.data?.profile,
					userImage: data.data?.user?.image,
				});

				const user: UserData = {
					...data.data.user,
					...data.data.profile,
				};

				console.log("[Profile Page] Merged user data:", {
					userId: user._id,
					image: user.image,
				});

				setUserData(user);
				setImagePreview(user.image || null);
				console.log(
					"[Profile Page] imagePreview set to:",
					user.image || null
				);

				// Update profile form with existing data
				profileForm.reset({
					name: user.name || "",
					bio: user.bio || "",
					phoneNumber: user.phoneNumber || "",
					address: {
						street: user.address?.street || "",
						city: user.address?.city || "",
						postalCode: user.address?.postalCode || "",
						country: user.address?.country || "",
					},
				});
			} catch (err) {
				console.error("[Profile Page] Error fetching profile:", err);
				setError(
					err instanceof Error ? err.message : "Failed to load profile"
				);
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, [profileForm]);

	// ========================================================================
	// Profile update handler
	// ========================================================================
	const onProfileSubmit = async (values: ProfileFormValues) => {
		try {
			setSaving(true);
			setError(null);
			setSuccess(null);

			// Update name if changed
			if (values.name !== userData?.name) {
				const nameResponse = await fetch("/api/user/name", {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ name: values.name }),
				});

				if (!nameResponse.ok) {
					const data = await nameResponse.json();
					throw new Error(data.message || "Failed to update name");
				}
			}

			// Update profile fields
			const profileResponse = await fetch("/api/user/profile", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					bio: values.bio,
					phoneNumber: values.phoneNumber,
					address: values.address,
				}),
			});

			if (!profileResponse.ok) {
				const data = await profileResponse.json();
				throw new Error(data.message || "Failed to update profile");
			}

			setSuccess("Profile updated successfully!");
			setTimeout(() => setSuccess(null), 3000);
		} catch (err) {
			console.error("Error updating profile:", err);
			setError(
				err instanceof Error ? err.message : "Failed to update profile"
			);
		} finally {
			setSaving(false);
		}
	};

	// ========================================================================
	// Password update handler
	// ========================================================================
	const onPasswordSubmit = async (values: PasswordFormValues) => {
		try {
			setSaving(true);
			setError(null);
			setSuccess(null);

			const response = await fetch("/api/user/password", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Failed to update password");
			}

			setSuccess("Password updated successfully!");
			passwordForm.reset();
			setTimeout(() => setSuccess(null), 3000);
		} catch (err) {
			console.error("Error updating password:", err);
			setError(
				err instanceof Error ? err.message : "Failed to update password"
			);
		} finally {
			setSaving(false);
		}
	};

	// ========================================================================
	// Image selection handler (creates preview for confirmation)
	// ========================================================================
	const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith("image/")) {
			toast.error("Please select a valid image file");
			return;
		}

		// Validate file size (5MB max)
		if (file.size > 5 * 1024 * 1024) {
			toast.error("Image size must not exceed 5MB");
			return;
		}

		// Create preview for confirmation
		const reader = new FileReader();
		reader.onloadend = () => {
			setPendingImagePreview(reader.result as string);
			setPendingImage(file);
		};
		reader.readAsDataURL(file);

		// Reset input so same file can be selected again
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	// ========================================================================
	// Confirm and upload the pending image
	// ========================================================================
	const handleConfirmUpload = async () => {
		if (!pendingImage) return;

		try {
			setUploadingImage(true);
			setError(null);

			// Create FormData for file upload
			const formData = new FormData();
			formData.append("file", pendingImage);

			console.log("[Avatar Upload] Starting upload...", {
				fileName: pendingImage.name,
				fileSize: pendingImage.size,
				fileType: pendingImage.type,
			});

			// Upload to server using the new avatar endpoint
			const response = await fetch("/api/user/avatar", {
				method: "POST",
				body: formData,
			});

			const data = await response.json();
			console.log("[Avatar Upload] API Response:", {
				status: response.status,
				ok: response.ok,
				data,
			});

			if (!response.ok) {
				throw new Error(data.message || "Failed to upload image");
			}

			const newImageUrl = data.data?.url;
			console.log("[Avatar Upload] New image URL:", newImageUrl);

			if (!newImageUrl) {
				console.error("[Avatar Upload] No URL returned from API");
				throw new Error("No image URL returned from server");
			}

			// Update preview with the new URL and update timestamp for cache busting
			setImagePreview(newImageUrl);
			setImageKey(Date.now());
			console.log(
				"[Avatar Upload] imagePreview state updated to:",
				newImageUrl
			);
			toast.success("Profile image updated successfully!");

			// Notify other components (navbar, etc.) about the avatar update
			window.dispatchEvent(new CustomEvent("avatar-updated"));

			// Clear pending state
			setPendingImage(null);
			setPendingImagePreview(null);
		} catch (err) {
			console.error("[Avatar Upload] Error:", err);
			toast.error(
				err instanceof Error ? err.message : "Failed to upload image"
			);
		} finally {
			setUploadingImage(false);
		}
	};

	// ========================================================================
	// Cancel pending upload
	// ========================================================================
	const handleCancelUpload = () => {
		setPendingImage(null);
		setPendingImagePreview(null);
	};

	// ========================================================================
	// Remove image handler
	// ========================================================================
	const handleRemoveImage = async () => {
		const confirmed = await confirmDelete({
			title: "Remove Profile Image",
			description:
				"Are you sure you want to remove your profile image? This action cannot be undone.",
			confirmText: "Remove",
		});

		if (!confirmed) return;

		try {
			setUploadingImage(true);
			setError(null);

			const response = await fetch("/api/user/avatar", {
				method: "DELETE",
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.message || "Failed to remove image");
			}

			setImagePreview(null);
			toast.success("Profile image removed successfully!");

			// Notify other components (navbar, etc.) about the avatar removal
			window.dispatchEvent(new CustomEvent("avatar-updated"));
		} catch (err) {
			console.error("Error removing image:", err);
			toast.error(
				err instanceof Error ? err.message : "Failed to remove image"
			);
		} finally {
			setUploadingImage(false);
		}
	};

	// ========================================================================
	// Loading state
	// ========================================================================
	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading profile...</p>
				</div>
			</div>
		);
	}

	// ========================================================================
	// Main render
	// ========================================================================
	return (
		<>
			<ConfirmModal />
			<div className="space-y-6 w-full mx-auto">
				<div className="bg-white rounded-lg shadow-sm border">
					{/* Header */}
					<div className="border-b px-6 py-4">
						<h1 className="text-2xl font-medium text-gray-900">
							Profile Settings
						</h1>
						<p className="text-sm text-gray-600 mt-1">
							Manage your profile information, security settings, and
							profile image
						</p>
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

					{/* Tabs */}
					<Tabs defaultValue="profile" className="px-6 pb-6">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="profile">Profile Info</TabsTrigger>
							<TabsTrigger value="image">Profile Image</TabsTrigger>
							<TabsTrigger value="security">Security</TabsTrigger>
						</TabsList>

						{/* Profile Tab */}
						<TabsContent value="profile" className="space-y-6">
							<Form {...profileForm}>
								<form
									onSubmit={profileForm.handleSubmit(onProfileSubmit)}
									className="space-y-6"
								>
									{/* Name */}
									<FormField
										control={profileForm.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Name</FormLabel>
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

									{/* Email (read-only) */}
									<div>
										<label className="text-sm font-medium text-gray-700 block mb-2">
											Email
										</label>
										<Input
											type="email"
											value={userData?.email || ""}
											disabled
											className="bg-gray-50"
										/>
										<p className="text-xs text-gray-500 mt-1">
											Email cannot be changed
										</p>
									</div>

									{/* Bio */}
									<FormField
										control={profileForm.control}
										name="bio"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Bio</FormLabel>
												<FormControl>
													<textarea
														className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
														rows={4}
														placeholder="Tell us about yourself..."
														{...field}
													/>
												</FormControl>
												<FormDescription>
													Brief description for your profile.
													Maximum 500 characters.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Phone Number */}
									<FormField
										control={profileForm.control}
										name="phoneNumber"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Phone Number</FormLabel>
												<FormControl>
													<Input
														type="tel"
														placeholder="+46 70 123 45 67"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Address Section */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-gray-900">
											Address
										</h3>

										<FormField
											control={profileForm.control}
											name="address.street"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Street</FormLabel>
													<FormControl>
														<Input
															placeholder="Storgatan 1"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<div className="grid grid-cols-2 gap-4">
											<FormField
												control={profileForm.control}
												name="address.city"
												render={({ field }) => (
													<FormItem>
														<FormLabel>City</FormLabel>
														<FormControl>
															<Input
																placeholder="Stockholm"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={profileForm.control}
												name="address.postalCode"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Postal Code</FormLabel>
														<FormControl>
															<Input
																placeholder="111 22"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										<FormField
											control={profileForm.control}
											name="address.country"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Country</FormLabel>
													<FormControl>
														<Input
															placeholder="Sweden"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Submit */}
									<div className="flex items-center justify-between pt-4">
										<Button
											type="button"
											variant="outline"
											onClick={() => profileForm.reset()}
											disabled={saving}
										>
											Reset
										</Button>
										<Button type="submit" disabled={saving}>
											{saving ? "Saving..." : "Save Changes"}
										</Button>
									</div>
								</form>
							</Form>
						</TabsContent>

						{/* Image Tab */}
						<TabsContent value="image" className="space-y-6">
							<div className="space-y-6">
								<div>
									<h3 className="text-lg font-semibold text-gray-900 mb-4">
										Profile Image
									</h3>
									<p className="text-sm text-gray-600 mb-4">
										Upload a profile image. Maximum size: 5MB.
										Supported formats: JPG, PNG, GIF, WebP
									</p>
								</div>

								{/* Pending Image Preview (Confirmation Flow) */}
								{pendingImagePreview && (
									<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
										<h4 className="text-sm font-semibold text-blue-900 mb-3">
											Preview New Image
										</h4>
										<div className="flex items-center space-x-6">
											<div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-blue-300">
												<ImageComponent
													src={pendingImagePreview}
													alt="New Profile Preview"
													fill
													sizes="128px"
													className="object-cover"
												/>
											</div>
											<div className="flex-1 space-y-3">
												<p className="text-sm text-blue-800">
													Click &quot;Confirm&quot; to save this as
													your new profile image. Your previous
													image will be automatically removed.
												</p>
												<div className="flex gap-2">
													<Button
														type="button"
														onClick={handleConfirmUpload}
														disabled={uploadingImage}
													>
														{uploadingImage
															? "Uploading..."
															: "Confirm"}
													</Button>
													<Button
														type="button"
														variant="outline"
														onClick={handleCancelUpload}
														disabled={uploadingImage}
													>
														Cancel
													</Button>
												</div>
											</div>
										</div>
									</div>
								)}

								{/* Current Image Preview */}
								{!pendingImagePreview && (
									<div className="flex items-center space-x-6">
										<div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
											{imagePreview ? (
												<ImageComponent
													key={imageKey}
													src={`${imagePreview}${imagePreview.includes("?") ? "&" : "?"}t=${imageKey}`}
													alt="Profile"
													fill
													sizes="128px"
													className="object-cover"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center text-gray-400">
													<svg
														className="w-16 h-16"
														fill="currentColor"
														viewBox="0 0 20 20"
													>
														<path
															fillRule="evenodd"
															d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
															clipRule="evenodd"
														/>
													</svg>
												</div>
											)}
										</div>

										<div className="flex-1 space-y-3">
											<div>
												<Button
													type="button"
													variant="outline"
													disabled={uploadingImage}
													onClick={() =>
														fileInputRef.current?.click()
													}
												>
													{uploadingImage
														? "Processing..."
														: "Select Image"}
												</Button>
												<input
													ref={fileInputRef}
													type="file"
													accept="image/jpeg,image/png,image/gif,image/webp"
													onChange={handleImageSelect}
													className="hidden"
												/>
											</div>

											{imagePreview && (
												<Button
													type="button"
													variant="outline"
													onClick={handleRemoveImage}
													disabled={uploadingImage}
													className="text-red-600 hover:text-red-700"
												>
													Remove Image
												</Button>
											)}
										</div>
									</div>
								)}
							</div>
						</TabsContent>

						{/* Security Tab */}
						<TabsContent value="security" className="space-y-6">
							<div>
								<h3 className="text-lg font-semibold text-gray-900 mb-4">
									Change Password
								</h3>
								<p className="text-sm text-gray-600 mb-6">
									Update your password to keep your account secure.
									Password must be at least 8 characters and contain
									uppercase, lowercase, and numbers.
								</p>
							</div>

							<Form {...passwordForm}>
								<form
									onSubmit={passwordForm.handleSubmit(
										onPasswordSubmit
									)}
									className="space-y-6"
								>
									{/* Current Password */}
									<FormField
										control={passwordForm.control}
										name="currentPassword"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Current Password</FormLabel>
												<FormControl>
													<Input
														type="password"
														placeholder="Enter your current password"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* New Password */}
									<FormField
										control={passwordForm.control}
										name="newPassword"
										render={({ field }) => (
											<FormItem>
												<FormLabel>New Password</FormLabel>
												<FormControl>
													<Input
														type="password"
														placeholder="Enter your new password"
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

									{/* Confirm Password */}
									<FormField
										control={passwordForm.control}
										name="confirmPassword"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Confirm New Password</FormLabel>
												<FormControl>
													<Input
														type="password"
														placeholder="Confirm your new password"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Submit */}
									<div className="flex items-center justify-between pt-4">
										<Button
											type="button"
											variant="outline"
											onClick={() => passwordForm.reset()}
											disabled={saving}
										>
											Reset
										</Button>
										<Button type="submit" disabled={saving}>
											{saving ? "Updating..." : "Update Password"}
										</Button>
									</div>
								</form>
							</Form>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</>
	);
}
