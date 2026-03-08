export interface Product {
	id: string;
	slug: string;
	name: string;
	description: string;
	longDescription?: string;
	categories: string[];
	treatments: string[];
	features: Feature[];
	specifications: Specification[];
	images: ProductImage[];
	gallery?: ProductImage[]; // Additional images for gallery/carousel
	brochureUrl?: string;
	videoUrl?: string;
	video360Url?: string; // 360-degree product view video
	faqs?: FAQ[]; // Product-specific FAQs
	reviews?: Review[]; // Customer reviews
	qna?: QnA[]; // Questions and Answers
	benefits?: string[]; // Key benefits list
	certifications?: Certification[]; // FDA, ISO, CE, etc.
	price?: {
		amount: number;
		currency: string;
		displayPrice: boolean;
	};
	seo: SEOMetadata;
	createdAt: string;
	updatedAt: string;
}

export interface HeroSettings {
	themeColor?: string;
	badge?: string;
	ctaText?: string;
	ctaUrl?: string;
}

export interface ProductVariant {
	_id: string;
	name: string;
	url: string;
	icon: string;
}

export interface AccordionSection {
	_id: string;
	title: string;
	content: string;
	isOpen?: boolean;
}

export type ProductType = {
	_id: string;
	title: string;
	slug: string;
	description: string;
	shortDescription: string;
	productDescription: string | null;
	hiddenDescription: string | null;
	benefits: Array<string> | null;
	certifications: Array<string> | null;
	treatments: Array<string> | null;
	productImages: Array<string>;
	overviewImage: string;
	techSpecifications: Array<{
		title: string;
		description: string;
		_id: string;
	}> | null;
	documentation: Array<{
		title: string;
		url: string;
		_id: string;
	}> | null;
	purchaseInfo: {
		title: string;
		description: string;
	};
	seo: {
		title: string;
		description: string;
		ogImage: string;
		canonicalUrl: string;
		noindex: boolean;
	};
	categories: Array<{
		_id: string;
		name: string;
		slug: string;
		id: string;
	}>;
	primaryCategory: {
		_id: string;
		name: string;
		slug: string;
		id: string;
	} | null;
	qa: Array<{
		question: string;
		answer: string;
		visible: boolean;
		_id: string;
	}>;
	youtubeUrl: string;
	rubric: string;
	heroSettings: HeroSettings | null;
	productVariants: Array<ProductVariant>;
	accordionSections: Array<AccordionSection>;
	publishType: string;
	visibility: string;
	lastEditedBy: {
		_id: string;
		name: string;
		email: string;
		id: string;
	};
	publishedAt: string | null;
	likeCount: number;
	createdAt: string;
	updatedAt: string;
	id: string;
};

export interface Category {
	id: string;
	slug: string;
	name: string;
	description?: string;
	icon?: string;
	parentCategory?: string;
	order: number;
}

export interface Treatment {
	id: string;
	name: string;
	slug: string;
	description?: string;
}

export interface Feature {
	title: string;
	description: string;
	icon?: string;
}

export interface Specification {
	label: string;
	value: string;
}

export interface ProductImage {
	url: string;
	alt: string;
	width: number;
	height: number;
	isPrimary: boolean;
}

export interface SEOMetadata {
	title: string;
	description: string;
	keywords?: string[];
	ogImage?: string;
	noIndex?: boolean;
	canonicalUrl?: string;
}

export interface FAQ {
	id: string;
	question: string;
	answer: string;
	category?: string;
	order: number;
}

export interface Review {
	id: string;
	author: string;
	role?: string; // e.g., "Dermatologist", "Clinic Owner"
	location?: string;
	rating: number; // 1-5
	title: string;
	content: string;
	date: string;
	verified: boolean;
	helpful?: number; // Number of people who found this helpful
}

export interface QnA {
	id: string;
	question: string;
	answer: string;
	askedBy?: string;
	answeredBy?: string;
	date: string;
	helpful?: number;
}

export interface Certification {
	name: string;
	icon?: string;
	description?: string;
}
