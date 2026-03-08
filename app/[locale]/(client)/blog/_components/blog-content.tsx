"use client";

import { motion } from "framer-motion";
import { Article } from "@/types/article";
import { fadeUp } from "@/lib/animations";
import { Badge } from "@/components/ui/badge";
import {
	Share2,
	Facebook,
	Twitter,
	Linkedin,
	Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { sanitizeHtmlContent } from "@/lib/sanitize-html";

interface BlogContentProps {
	article: Article;
}

/**
 * BlogContent Component
 *
 * Main content area for blog post with HTML content, tags, and social sharing.
 */
export function BlogContent({ article }: BlogContentProps) {
	const [copied, setCopied] = useState(false);

	// Sanitize HTML content to remove unwanted attributes
	const sanitizedContent = useMemo(
		() => sanitizeHtmlContent(article.content),
		[article.content]
	);

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy link:", err);
		}
	};

	const handleShare = (platform: string) => {
		const url = encodeURIComponent(window.location.href);
		const title = encodeURIComponent(article.title);

		const shareUrls: Record<string, string> = {
			facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
			twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
			linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
		};

		if (shareUrls[platform]) {
			window.open(shareUrls[platform], "_blank", "width=600,height=400");
		}
	};

	return (
		<div>
			<div className="grid gap-8 lg:grid-cols-[1fr_250px]">
				{/* Main Content */}
				<motion.article
					initial="initial"
					animate="animate"
					variants={fadeUp}
					className="prose prose-lg max-w-none prose-headings:font-medium prose-headings:text-secondary prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-3xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-2xl prose-p:mb-4 prose-p:leading-relaxed prose-p:text-muted-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-ul:my-4 prose-li:my-2 prose-img:rounded-lg prose-img:shadow-md"
					dangerouslySetInnerHTML={{ __html: sanitizedContent }}
				/>

				{/* Sidebar */}
				<section className="space-y-6">
					{/* Social Share */}
					<motion.div
						initial="initial"
						animate="animate"
						variants={fadeUp}
						transition={{ delay: 0.1 }}
						className="sticky top-32 rounded-2xl border border-primary/10 bg-white p-6 shadow-sm "
					>
						<div className="mb-4 flex items-center gap-2">
							<Share2 className="h-5 w-5 text-primary" />
							<h3 className="font-medium text-foreground">Dela artikel</h3>
						</div>
						<div className="space-y-2">
							<Button
								variant="outline"
								size="sm"
								className="w-full justify-start gap-2"
								onClick={() => handleShare("facebook")}
							>
								<Facebook className="h-4 w-4" />
								Facebook
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="w-full justify-start gap-2"
								onClick={() => handleShare("twitter")}
							>
								<Twitter className="h-4 w-4" />
								Twitter
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="w-full justify-start gap-2"
								onClick={() => handleShare("linkedin")}
							>
								<Linkedin className="h-4 w-4" />
								LinkedIn
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="w-full justify-start gap-2"
								onClick={handleCopyLink}
							>
								<LinkIcon className="h-4 w-4" />
								{copied ? "Kopierad!" : "Kopiera länk"}
							</Button>
						</div>
					</motion.div>
				</section>
			</div>

			{/* Tags */}
			{article.tags && article.tags.length > 0 && (
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					variants={fadeUp}
					className="mt-12 border-t border-border pt-8"
				>
					<h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
						Taggar
					</h3>
					<div className="flex flex-wrap gap-2">
						{article.tags.map((tag) => (
							<Badge
								key={tag}
								variant="outline"
								className="hover:bg-primary/10 hover:border-primary/30"
							>
								{tag}
							</Badge>
						))}
					</div>
				</motion.div>
			)}
		</div>
	);
}
