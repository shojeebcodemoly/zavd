"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_ROUTES } from "@/lib/utils/constants";
import { User, ChevronDown, LayoutDashboard, Users, UserCircle, LogOut, LogIn } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PROTECTED_ROUTES = [
	{ name: "Dashboard", route: "/dashboard", icon: LayoutDashboard },
	{ name: "Users", route: "/dashboard/users", icon: Users },
	{ name: "Profile", route: "/dashboard/profile", icon: UserCircle },
];

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
						setImageKey(Date.now());
					}
				} catch (error) {
					console.error("Error fetching user data:", error);
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
			setUserData(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session?.user?.id]);

	useEffect(() => {
		const handleAvatarUpdate = () => {
			setImageKey(Date.now());
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
			setUserData(null);
			await authClient.signOut();
		} catch (error) {
			console.error("Logout error:", error);
			setIsLoggingOut(false);
		} finally {
			setIsLoggingOut(false);
		}
	};

	const displayName = session ? (userData?.name || session.user.name) : null;
	const displayImage = session ? (userData?.image || session.user.image || null) : null;

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<button className="flex items-center gap-1.5 outline-none cursor-pointer">
					{session ? (
						<>
							<Avatar key={imageKey} className="h-8 w-8">
								<AvatarImage
									src={
										displayImage
											? `${displayImage}${displayImage.includes("?") ? "&" : "?"}t=${imageKey}`
											: undefined
									}
									alt={displayName ?? ""}
								/>
								<AvatarFallback className="text-xs">
									{displayName?.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<ChevronDown className="h-3 w-3 text-white/70" />
						</>
					) : (
						<span className="flex items-center gap-1 text-xs font-medium uppercase text-white/90 hover:text-white border border-white/30 hover:border-white/60 px-3 py-1.5 rounded-sm transition-colors">
							<User className="h-3.5 w-3.5" />
							Login
							<ChevronDown className="h-3 w-3 opacity-70" />
						</span>
					)}
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" sideOffset={8} collisionPadding={16} className="w-44">
				{session && (
					<>
						<div className="px-2 py-1.5 text-xs text-muted-foreground truncate">
							{userData?.email || session.user.email}
						</div>
						<DropdownMenuSeparator />
					</>
				)}
				{PROTECTED_ROUTES.map((pr) => (
					<DropdownMenuItem key={pr.route} asChild>
						<Link href={pr.route} className="flex items-center gap-2 cursor-pointer">
							<pr.icon className="h-4 w-4" />
							{pr.name}
						</Link>
					</DropdownMenuItem>
				))}
				<DropdownMenuSeparator />
				{session ? (
					<DropdownMenuItem
						onClick={handleLogout}
						disabled={isLoggingOut}
						className="flex items-center gap-2 text-red-600 focus:text-red-600 cursor-pointer"
					>
						<LogOut className="h-4 w-4" />
						{isLoggingOut ? "Logging out..." : "Logout"}
					</DropdownMenuItem>
				) : (
					<DropdownMenuItem asChild>
						<Link href="/login" className="flex items-center gap-2 cursor-pointer">
							<LogIn className="h-4 w-4" />
							Login
						</Link>
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ProtectedNavbar;
