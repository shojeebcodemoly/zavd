import Link from "next/link";

interface LogoProps {
	asLink?: boolean;
	className?: string;
	logoUrl?: string;
	companyName?: string;
	textClassName?: string;
}

const DEFAULT_LOGO = "/storage/zavd-logo-mobile-2000x485.png";

const Logo = ({
	asLink = true,
	className = "shrink-0",
	logoUrl = DEFAULT_LOGO,
	companyName = "ZAVD",
	textClassName = "text-white",
}: LogoProps) => {
	const src = logoUrl || DEFAULT_LOGO;

	const content = (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			src={src}
			alt={companyName}
			className="h-14 w-auto sm:h-16 lg:h-16 max-w-[180px] object-contain"
		/>
	);

	if (!asLink) {
		return <div className={className}>{content}</div>;
	}

	return (
		<Link href="/" className={className}>
			{content}
		</Link>
	);
};

export default Logo;
