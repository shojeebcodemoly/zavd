import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_ROUTES } from "@/lib/utils/constants";

const PROTECTED_ROUTES = [
	{
		name: "Dashboard",
		route: "/dashboard",
	},
	{
		name: "Users",
		route: "/dashboard/users",
	},
	{
		name: "Profile",
		route: "/dashboard/profile",
	},
];

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface UserData {
	name: string;
	email: string;
	image?: string | null;
}

const ProtectedNavbar = () => {
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [userData, setUserData] = useState<UserData | null>(null);
	const [imageKey, setImageKey] = useState(() => Date.now());
	const { data: session } = authClient.useSession();

	// Fetch user data to get the current profile image
	useEffect(() => {
		const userId = session?.user?.id;

		if (userId) {
			const fetchUserData = async () => {
				try {
					const response = await fetch(API_ROUTES.USER.ME);
					if (response.ok) {
						const data = await response.json();
						setUserData({
							name: data.data.user.name,
							email: data.data.user.email,
							image: data.data.user.image,
						});
						// Update imageKey to bust cache when new image is fetched
						setImageKey(Date.now());
					}
				} catch (error) {
					console.error("Error fetching user data:", error);
					// Fallback to session data
					if (session?.user) {
						setUserData({
							name: session.user.name,
							email: session.user.email || "",
							image: session.user.image || null,
						});
					}
				}
			};
			fetchUserData();
		} else {
			// Reset user data when session is null (logged out)
			setUserData(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session?.user?.id]); // Only depend on user ID to avoid unnecessary refetches

	// Listen for avatar updates from other parts of the app
	useEffect(() => {
		const handleAvatarUpdate = () => {
			setImageKey(Date.now());
			// Re-fetch user data to get new avatar URL
			if (session?.user?.id) {
				fetch(API_ROUTES.USER.ME)
					.then((res) => res.json())
					.then((data) => {
						if (data.data?.user) {
							setUserData({
								name: data.data.user.name,
								email: data.data.user.email,
								image: data.data.user.image,
							});
						}
					})
					.catch(console.error);
			}
		};

		window.addEventListener("avatar-updated", handleAvatarUpdate);
		return () => window.removeEventListener("avatar-updated", handleAvatarUpdate);
	}, [session?.user?.id]);

	const handleLogout = async () => {
		try {
			setIsLoggingOut(true);
			setUserData(null); // Clear user data immediately
			await authClient.signOut();
			// router.push("/");
		} catch (error) {
			console.error("Logout error:", error);
			setIsLoggingOut(false);
		} finally {
			// Reset loading state after sign out completes
			setIsLoggingOut(false);
		}
	};

	if (!session) return null;

	// Use fetched userData if available, otherwise fallback to session
	const displayName = userData?.name || session.user.name;
	const displayImage = userData?.image || session.user.image || null;

	return (
		<div className="flex flex-row flex-wrap items-center gap-12">
			<Popover>
				<PopoverTrigger asChild className="cursor-pointer">
					<Avatar key={imageKey}>
						<AvatarImage
							src={
								displayImage
									? `${displayImage}${displayImage.includes("?") ? "&" : "?"}t=${imageKey}`
									: undefined
							}
							alt={displayName}
						/>
						<AvatarFallback>
							{displayName.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</PopoverTrigger>
				<PopoverContent className="w-[180px]" align="end">
					<div className="flex items-start flex-col justify-between space-y-5 h-auto">
						<div className="flex items-start flex-col space-y-2">
							{PROTECTED_ROUTES.map((pr) => (
								<Link
									key={pr.route}
									href={pr.route}
									className="hover:underline"
								>
									{pr.name}
								</Link>
							))}
						</div>

						<div className="flex items-center space-x-4">
							<button
								onClick={handleLogout}
								disabled={isLoggingOut}
								className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-hover disabled:opacity-50 transition-colors"
							>
								{isLoggingOut ? "Logging out..." : "Logout"}
							</button>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default ProtectedNavbar;
