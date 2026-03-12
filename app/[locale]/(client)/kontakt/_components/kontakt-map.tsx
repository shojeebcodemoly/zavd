interface KontaktMapProps {
	embedUrl?: string;
}

export function KontaktMap({ embedUrl }: KontaktMapProps) {
	if (!embedUrl) return null;

	return (
		<section className="w-full h-[420px] md:h-[550px] lg:h-[600px]">
			<iframe
				src={embedUrl}
				width="100%"
				height="100%"
				style={{ border: 0 }}
				allowFullScreen
				loading="lazy"
				referrerPolicy="no-referrer-when-downgrade"
				title="Location map"
			/>
		</section>
	);
}
