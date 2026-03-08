import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
	// Empty turbopack config to silence the webpack/turbopack warning in Next.js 16
	turbopack: {},
	// Ignore nul file (Windows reserved device name issue)
	webpack: (config, { isServer }) => {
		config.watchOptions = {
			...config.watchOptions,
			ignored: ["**/nul", "**/node_modules/**", "**/.git/**", "**/.next/**"],
		};
		return config;
	},
	async redirects() {
		return [
			// Redirect /blogg to /nyheter
			{
				source: "/blogg",
				destination: "/nyheter",
				permanent: true,
			},
			// Redirect /blogg/[slug] to /nyheter/[slug]
			{
				source: "/blogg/:slug",
				destination: "/nyheter/:slug",
				permanent: true,
			},
			// Redirect /blogg/category/[slug] to /nyheter/category/[slug]
			{
				source: "/blogg/category/:slug",
				destination: "/nyheter/category/:slug",
				permanent: true,
			},
			// Redirect /blogg/tag/[slug] to /nyheter/tag/[slug]
			{
				source: "/blogg/tag/:slug",
				destination: "/nyheter/tag/:slug",
				permanent: true,
			},
			// Redirect /blogg/author/[slug] to /nyheter/author/[slug]
			{
				source: "/blogg/author/:slug",
				destination: "/nyheter/author/:slug",
				permanent: true,
			},

			// ============================================================================
			// STARTA EGET SUBMENU REDIRECTS (WordPress had different paths)
			// ============================================================================
			// WordPress: /om-oss/varfor-valja-synos/ → Our: /starta-eget/varfor-valja-synos
			{
				source: "/om-oss/varfor-valja-synos",
				destination: "/starta-eget/varfor-valja-synos",
				permanent: true,
			},
			// WordPress: /kopguide/ → Our: /starta-eget/kopguide
			{
				source: "/kopguide",
				destination: "/starta-eget/kopguide",
				permanent: true,
			},
			// WordPress: /utbildningar/miniutbildning-online/ → Our: /starta-eget/miniutbildning
			{
				source: "/utbildningar/miniutbildning-online",
				destination: "/starta-eget/miniutbildning",
				permanent: true,
			},

			// ============================================================================
			// OM OSS SUBMENU REDIRECTS (WordPress had different paths)
			// ============================================================================
			// WordPress: /om-oss/jobba-hos-oss/ → Our: /om-oss/lediga-tjanster
			{
				source: "/om-oss/jobba-hos-oss",
				destination: "/om-oss/lediga-tjanster",
				permanent: true,
			},
			// WordPress: /om-oss/integritetspolicy/ → Our: /integritetspolicy
			{
				source: "/om-oss/integritetspolicy",
				destination: "/integritetspolicy",
				permanent: true,
			},

			// ============================================================================
			// TRAILING SLASH VARIANTS (WordPress uses trailing slashes)
			// ============================================================================
			{
				source: "/blogg/",
				destination: "/nyheter",
				permanent: true,
			},
			{
				source: "/kopguide/",
				destination: "/starta-eget/kopguide",
				permanent: true,
			},
			{
				source: "/utbildningar/miniutbildning-online/",
				destination: "/starta-eget/miniutbildning",
				permanent: true,
			},
			{
				source: "/om-oss/varfor-valja-synos/",
				destination: "/starta-eget/varfor-valja-synos",
				permanent: true,
			},
			{
				source: "/om-oss/jobba-hos-oss/",
				destination: "/om-oss/lediga-tjanster",
				permanent: true,
			},
			{
				source: "/om-oss/integritetspolicy/",
				destination: "/integritetspolicy",
				permanent: true,
			},
		];
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
			{
				protocol: "https",
				hostname: "plus.unsplash.com",
			},
			{
				protocol: "https",
				hostname: "www.synos.se",
			},
			{
				protocol: "https",
				hostname: "images.pexels.com",
			},
			{
				protocol: "https",
				hostname: "img.youtube.com",
			},
			{
				protocol: "https",
				hostname: "i.ytimg.com",
			},
		],
		// Allow query strings for local images (needed for cache-busting avatars)
		// Omitting 'search' property allows any query string (e.g., ?t=timestamp)
		localPatterns: [
			{
				pathname: "/api/storage/files/**",
			},
			{
				pathname: "/storage/**",
			},
			{
				pathname: "/images/**",
			},
			{
				pathname: "/**",
			},
		],
	},
};

export default withNextIntl(nextConfig);
