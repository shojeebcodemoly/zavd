import { Loader2 } from "lucide-react";

export default function StartsidaLoading() {
	return (
		<div className="flex items-center justify-center py-12">
			<div className="text-center">
				<Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
				<p className="mt-4 text-muted-foreground">Laddar startsida...</p>
			</div>
		</div>
	);
}
