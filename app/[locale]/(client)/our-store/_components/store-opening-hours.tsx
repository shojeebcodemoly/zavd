"use client";

import { Clock, AlertCircle } from "lucide-react";
import type { IStoreOpeningHoursSection } from "@/models/store-page.model";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StoreOpeningHoursProps {
	data: IStoreOpeningHoursSection;
}

export function StoreOpeningHours({ data }: StoreOpeningHoursProps) {
	// Get current day of week (0 = Sunday, 1 = Monday, etc.)
	const today = new Date().getDay();
	const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const currentDayName = dayNames[today];

	return (
		<Card className="h-full border-border bg-background shadow-sm">
			<CardHeader>
				<div className="flex items-center gap-3">
					<div className="rounded-full bg-primary/10 p-3">
						<Clock className="h-6 w-6 text-primary" />
					</div>
					<div>
						{data.title && (
							<CardTitle className="text-2xl font-medium text-secondary">
								{data.title}
							</CardTitle>
						)}
						{data.subtitle && (
							<p className="text-sm text-muted-foreground mt-1">
								{data.subtitle}
							</p>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Schedule */}
				{data.schedule && data.schedule.length > 0 && (
					<div className="space-y-2">
						{data.schedule.map((item, index) => {
							const isToday = item.day?.toLowerCase() === currentDayName.toLowerCase();
							return (
								<div
									key={index}
									className={`flex items-center justify-between rounded-lg px-4 py-3 transition-colors ${
										isToday
											? "bg-primary/10 border border-primary/20"
											: "bg-muted"
									}`}
								>
									<span
										className={`font-medium ${
											isToday ? "text-primary" : "text-foreground"
										}`}
									>
										{item.day}
										{isToday && (
											<span className="ml-2 text-xs font-normal text-primary">
												(Today)
											</span>
										)}
									</span>
									<span
										className={`${
											item.isClosed
												? "text-muted-foreground"
												: isToday
												? "text-primary font-semibold"
												: "text-foreground"
										}`}
									>
										{item.isClosed ? "Closed" : item.hours}
									</span>
								</div>
							);
						})}
					</div>
				)}

				{/* Special Note */}
				{data.specialNote && (
					<div className="flex items-start gap-3 rounded-lg bg-amber-50 border border-amber-200 p-4 mt-4">
						<AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
						<p className="text-sm text-amber-800">{data.specialNote}</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
