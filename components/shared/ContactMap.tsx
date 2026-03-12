interface ContactMapProps {
	embedUrl?: string;
}

export function ContactMap({ embedUrl }: ContactMapProps) {
	if (!embedUrl) return null;

	return (
		<section className="w-full h-80 md:h-[450px]">
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
