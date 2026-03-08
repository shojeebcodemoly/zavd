"use client";

import { motion } from "framer-motion";
import { Article } from "@/types/article";
import { fadeUp } from "@/lib/animations";
import { User } from "lucide-react";
import { ImageComponent } from "@/components/common/image-component";

interface BlogAuthorProps {
	author: Article["author"];
}

/**
 * BlogAuthor Component
 *
 * Displays author information with bio and image.
 */
export function BlogAuthor({ author }: BlogAuthorProps) {
	return (
		<motion.div
			initial="initial"
			whileInView="animate"
			viewport={{ once: true }}
			variants={fadeUp}
			className="mx-auto max-w-4xl"
		>
			<div className="rounded-2xl border border-border bg-lienar-to-br from-slate-50 to-white p-8 shadow-sm">
				<div className="flex flex-col gap-6 sm:flex-row sm:items-start">
					{/* Author Image */}
					<div className="shrink-0">
						{author.image ? (
							<div className="relative h-20 w-20 overflow-hidden rounded-full ring-4 ring-primary/10">
								<ImageComponent
									src={author.image}
									alt={author.name}
									height={0}
									width={0}
									sizes="100vw"
									wrapperClasses="w-full h-full"
									className="object-cover w-full h-full"
								/>
							</div>
						) : (
							<div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/10">
								<User className="h-10 w-10 text-primary" />
							</div>
						)}
					</div>

					{/* Author Info */}
					<div className="flex-1">
						<div className="mb-1 text-sm font-semibold text-primary uppercase tracking-wide">
							Om författaren
						</div>
						<h3 className="mb-1 text-xl font-medium text-secondary">
							{author.name}
						</h3>
						<p className="mb-3 text-sm text-muted-foreground">
							{author.role}
						</p>
						{author.bio && (
							<p className="text-muted-foreground leading-relaxed">
								{author.bio}
							</p>
						)}
					</div>
				</div>
			</div>
		</motion.div>
	);
}
