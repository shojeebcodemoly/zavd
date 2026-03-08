"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { DashboardPageSkeleton } from "@/components/ui/skeletons";

interface UserData {
	user: {
		_id: string;
		email: string;
		name: string;
		emailVerified: boolean;
		lastLoginAt: string | null;
		createdAt: string;
	};
	profile: {
		_id: string;
		bio?: string;
		phoneNumber?: string;
	};
}

export default function DashboardPage() {
	const { data: session, isPending: sessionPending } = authClient.useSession();
	const [userData, setUserData] = useState<UserData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (sessionPending) return;

		if (!session) {
			setLoading(false);
			return;
		}

		const fetchUserData = async () => {
			try {
				setLoading(true);
				const response = await fetch("/api/user/me");

				if (!response.ok) {
					throw new Error("Failed to fetch user data");
				}

				const data = await response.json();
				setUserData(data.data);
			} catch (err: unknown) {
				console.error("Error fetching user data:", err);
				setError(err instanceof Error ? err.message : "Failed to load user data");
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, [session, sessionPending]);

	if (loading) {
		return <DashboardPageSkeleton />;
	}

	if (error) {
		return (
			<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
				<p className="font-semibold">Error</p>
				<p>{error}</p>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Welcome Section */}
			<div className="bg-white rounded-lg shadow-sm border p-6">
				<h1 className="text-3xl font-medium text-gray-900 mb-2">
					Welcome back, {userData?.user.name || "User"}!
				</h1>
				<p className="text-gray-600">
					Manage your profile and view your account information.
				</p>
			</div>

			{/* Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-white rounded-lg shadow-sm border p-6">
					<h3 className="text-sm font-medium text-gray-500 mb-2">Email</h3>
					<p className="text-lg font-semibold text-gray-900">
						{userData?.user.email}
					</p>
					<p className="text-sm text-gray-500 mt-1">
						{userData?.user.emailVerified ? (
							<span className="text-green-600">✓ Verified</span>
						) : (
							<span className="text-yellow-600">
								Pending verification
							</span>
						)}
					</p>
				</div>

				<div className="bg-white rounded-lg shadow-sm border p-6">
					<h3 className="text-sm font-medium text-gray-500 mb-2">
						Account Created
					</h3>
					<p className="text-lg font-semibold text-gray-900">
						{userData?.user.createdAt
							? new Date(userData.user.createdAt).toLocaleDateString()
							: "N/A"}
					</p>
				</div>

				<div className="bg-white rounded-lg shadow-sm border p-6">
					<h3 className="text-sm font-medium text-gray-500 mb-2">
						Last Login
					</h3>
					<p className="text-lg font-semibold text-gray-900">
						{userData?.user.lastLoginAt
							? new Date(userData.user.lastLoginAt).toLocaleString()
							: "First time"}
					</p>
				</div>
			</div>

			{/* Profile Info */}
			<div className="bg-white rounded-lg shadow-sm border p-6">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-medium text-gray-900">
						Profile Information
					</h2>
					<Link
						href="/dashboard/profile"
						className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
					>
						Edit Profile
					</Link>
				</div>

				<div className="space-y-4">
					<div>
						<h3 className="text-sm font-medium text-gray-500">Name</h3>
						<p className="text-gray-900">{userData?.user.name}</p>
					</div>

					<div>
						<h3 className="text-sm font-medium text-gray-500">Email</h3>
						<p className="text-gray-900">{userData?.user.email}</p>
					</div>

					{userData?.profile.bio && (
						<div>
							<h3 className="text-sm font-medium text-gray-500">Bio</h3>
							<p className="text-gray-900">{userData.profile.bio}</p>
						</div>
					)}

					{userData?.profile.phoneNumber && (
						<div>
							<h3 className="text-sm font-medium text-gray-500">
								Phone
							</h3>
							<p className="text-gray-900">
								{userData.profile.phoneNumber}
							</p>
						</div>
					)}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="bg-white rounded-lg shadow-sm border p-6">
				<h2 className="text-xl font-medium text-gray-900 mb-4">
					Quick Actions
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Link
						href="/dashboard/profile"
						className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition"
					>
						<div>
							<h3 className="font-semibold text-gray-900">
								Update Profile
							</h3>
							<p className="text-sm text-gray-600">
								Edit your personal information
							</p>
						</div>
					</Link>

					<Link
						href="/"
						className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition"
					>
						<div>
							<h3 className="font-semibold text-gray-900">
								Back to Home
							</h3>
							<p className="text-sm text-gray-600">
								Return to main website
							</p>
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
}
