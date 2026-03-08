"use client";

import { useState, useEffect } from "react";
import type {
	NavigationData,
	NavCategory,
} from "@/app/api/navigation/route";

interface UseNavigationResult {
	data: NavigationData | null;
	isLoading: boolean;
	error: Error | null;
}

// Cache the navigation data to avoid refetching on every component mount
let cachedData: NavigationData | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useNavigation(): UseNavigationResult {
	const [data, setData] = useState<NavigationData | null>(cachedData);
	const [isLoading, setIsLoading] = useState(!cachedData);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const now = Date.now();
		const isCacheValid = cachedData && now - cacheTimestamp < CACHE_DURATION;

		if (isCacheValid) {
			setData(cachedData);
			setIsLoading(false);
			return;
		}

		const fetchNavigation = async () => {
			try {
				setIsLoading(true);
				const response = await fetch("/api/navigation");

				if (!response.ok) {
					throw new Error("Failed to fetch navigation data");
				}

				const result = await response.json();

				if (result.success && result.data) {
					cachedData = result.data;
					cacheTimestamp = Date.now();
					setData(result.data);
				} else {
					throw new Error(result.message || "Invalid response");
				}
			} catch (err) {
				setError(err instanceof Error ? err : new Error("Unknown error"));
			} finally {
				setIsLoading(false);
			}
		};

		fetchNavigation();
	}, []);

	return { data, isLoading, error };
}

// Export types for use in components
export type { NavigationData, NavCategory };
