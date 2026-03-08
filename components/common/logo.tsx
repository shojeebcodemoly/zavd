import Link from "next/link";
import { ImageComponent } from "./image-component";

interface LogoProps {
	asLink?: boolean;
	className?: string;
	logoUrl?: string;
	companyName?: string;
	textClassName?: string;
}

const Logo = ({
	asLink = true,
	className = "shrink-0",
	logoUrl,
	companyName = "Milatte Farm",
	textClassName = "text-white",
}: LogoProps) => {
	const content = logoUrl ? (
		<ImageComponent
			src={logoUrl}
			alt={companyName}
			width={0}
			height={0}
			sizes="100vw"
			className="h-14 w-36 sm:h-16 sm:w-44 lg:h-16 lg:w-48 p-2 py-1.5 rounded"
		/>
	) : (
		<div className={`text-xl sm:text-2xl font-bold ${textClassName} px-2`}>
			{companyName}
		</div>
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
