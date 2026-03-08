"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageProps, default as NextImage } from "next/image";
import React, { JSX, useState, useEffect } from "react";

type IProps = Omit<ImageProps, "src"> & {
	src: string | undefined | null; //| StaticImport | null
	fallback?: string;
	debug?: string;
	showLoader?: boolean;
	wrapperClasses?: ImageProps["className"];
};

const ImageComponent = ({
	src,
	alt,
	showLoader = true,
	wrapperClasses = "",
	fill,
	...props
}: IProps): JSX.Element => {
	const [loading, setLoading] = useState(true);
	const [onErrorSrc, setOnErrorSrc] = useState<string | undefined>(undefined);

	// Reset state when src changes
	useEffect(() => {
		setLoading(true);
		setOnErrorSrc(undefined);
	}, [src]);

	const handleOnError = (
		e: React.SyntheticEvent<HTMLImageElement, Event>
	): void => {
		if (e?.currentTarget?.src !== props.fallback)
			setOnErrorSrc("/placeholder.avif");

		setLoading(false);
	};

	const imageSrc = (onErrorSrc || src || props.fallback) ?? "/placeholder.avif";

	const imageElement = (
		<NextImage
			{...props}
			key={src ?? "placeholder"}
			fill={fill}
			src={imageSrc}
			onLoad={() => setLoading(false)}
			onError={handleOnError}
			width={fill ? undefined : props.width}
			height={fill ? undefined : props.height}
			alt={alt || "img"}
		/>
	);

	// When using fill, render directly without wrapper div
	// The parent container must have position: relative
	if (fill) {
		return (
			<>
				{showLoader && loading && (
					<Skeleton className="absolute inset-0 h-full w-full animate-bounce-down rounded-none motion-safe:animate-bounce-down z-10" />
				)}
				{imageElement}
			</>
		);
	}

	return (
		<div className={`relative ${wrapperClasses}`}>
			{showLoader && loading && (
				<Skeleton
					className={`absolute bottom-0 left-0 h-full w-full animate-bounce-down rounded-none! motion-safe:animate-bounce-down`}
				/>
			)}
			{imageElement}
		</div>
	);
};

export { ImageComponent };
