import { SEOMetadata } from "./product";

export interface ArticleImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  isPrimary?: boolean;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: Author;
  publishedAt: string;
  updatedAt: string;
  featuredImage?: ArticleImage;
  categories: string[];
  tags: string[];
  seo: SEOMetadata;
  postType: "news" | "event";
  eventDate?: string;
  eventTime?: string;
  eventCity?: string;
  eventVenue?: string;
  eventCountry?: string;
  galleryImages?: string[];
}

export interface Author {
  name: string;
  role: string;
  image?: string;
  bio?: string;
}

