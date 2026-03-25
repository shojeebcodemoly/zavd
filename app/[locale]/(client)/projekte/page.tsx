import { getProjektePage } from '@/lib/services/projekte-page.service';
import { ImageComponent } from '@/components/common/image-component';
import { ProjekteProjectsGrid } from '@/components/shared/ProjekteProjectsGrid';
import Link from 'next/link';

interface Props {
	params: Promise<{ locale: string }>;
}

export default async function ProjektePage({ params }: Props) {
	const { locale } = await params;
	const page = await getProjektePage();

	const isEn = locale === 'en';
	const heroTitle = isEn
		? (page.hero.titleEn || 'Projects')
		: (page.hero.titleDe || 'Projekte');
	const heroSubtitle = isEn
		? (page.hero.subtitleEn || page.hero.subtitleDe)
		: (page.hero.subtitleDe || page.hero.subtitleEn);

	const intro = page.intro;
	const introBadge = isEn ? (intro?.badgeEn || intro?.badgeDe) : (intro?.badgeDe || intro?.badgeEn);
	const introHeadingBold = isEn ? (intro?.headingBoldEn || intro?.headingBoldDe) : (intro?.headingBoldDe || intro?.headingBoldEn);
	const introHeadingLight = isEn ? (intro?.headingLightEn || intro?.headingLightDe) : (intro?.headingLightDe || intro?.headingLightEn);
	const introDescription = isEn ? (intro?.descriptionEn || intro?.descriptionDe) : (intro?.descriptionDe || intro?.descriptionEn);
	const introCtaText = isEn ? (intro?.ctaTextEn || intro?.ctaTextDe) : (intro?.ctaTextDe || intro?.ctaTextEn);

	const hasIntro = !!(introHeadingBold || introDescription || (intro?.images?.length ?? 0) > 0);

	const projects = page.projects;
	const projectsBadge = isEn ? (projects?.badgeEn || projects?.badgeDe) : (projects?.badgeDe || projects?.badgeEn);
	const projectsHeading = isEn ? (projects?.headingEn || projects?.headingDe) : (projects?.headingDe || projects?.headingEn);
	const projectsDescription = isEn ? (projects?.descriptionEn || projects?.descriptionDe) : (projects?.descriptionDe || projects?.descriptionEn);
	const hasProjects = !!(projectsHeading || (projects?.items?.length ?? 0) > 0);

	return (
		<div className='flex flex-col min-h-screen'>

			{/* Hero */}
			<section className='relative w-full h-80 md:h-[440px] lg:h-[560px] flex items-center justify-center overflow-hidden'>
				{page.hero.backgroundImage ? (
					<ImageComponent
						src={page.hero.backgroundImage}
						alt={heroTitle}
						fill
						className='object-cover'
						priority
					/>
				) : (
					<div className='absolute inset-0 bg-secondary' />
				)}
				<div className='absolute inset-0 bg-black/55' />
				<div className='relative z-10 text-center text-white px-4'>
					<h1 className='text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3'>
						{heroTitle}
					</h1>
					{heroSubtitle && (
						<p className='text-white/80 text-base md:text-lg max-w-xl mx-auto mb-4'>
							{heroSubtitle}
						</p>
					)}
					<nav className='flex items-center justify-center gap-2 text-sm text-white/70'>
						<Link href='/' className='hover:text-white transition-colors'>
							Home
						</Link>
						<span className='text-white/40'>/</span>
						<span className='text-white/90'>{isEn ? 'Projects' : 'Projekte'}</span>
					</nav>
				</div>
			</section>

			{/* Intro Section */}
			{hasIntro && (
				<section className='py-16 md:py-24 bg-white'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
							<div>
								{introBadge && (
									<p className='text-sm text-slate-400 mb-4 tracking-wide'>
										{introBadge}
									</p>
								)}
								{(introHeadingBold || introHeadingLight) && (
									<h2 className='text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6'>
										{introHeadingBold && (
											<span className='text-slate-900'>{introHeadingBold}</span>
										)}
										{introHeadingBold && introHeadingLight && ' '}
										{introHeadingLight && (
											<span className='text-slate-400 font-normal'>{introHeadingLight}</span>
										)}
									</h2>
								)}
								{introDescription && (
									<p className='text-slate-500 leading-relaxed mb-8 text-base md:text-lg'>
										{introDescription}
									</p>
								)}
								{introCtaText && (
									<Link
										href={intro.ctaHref || '#'}
										className='inline-block bg-primary text-white font-semibold px-7 py-3 rounded-full hover:bg-primary/90 transition-colors text-sm md:text-base'
									>
										{introCtaText}
									</Link>
								)}
							</div>
							{intro.images && intro.images.length > 0 && (
								<div className='space-y-3'>
									{intro.images[0]?.url && (
										<div className='relative w-full h-64 md:h-80 rounded-2xl overflow-hidden'>
											<ImageComponent src={intro.images[0].url} alt={intro.images[0].alt || ''} fill className='object-cover' />
										</div>
									)}
									{(intro.images[1]?.url || intro.images[2]?.url) && (
										<div className='grid grid-cols-2 gap-3'>
											{intro.images[1]?.url && (
												<div className='relative h-40 md:h-48 rounded-2xl overflow-hidden'>
													<ImageComponent src={intro.images[1].url} alt={intro.images[1].alt || ''} fill className='object-cover' />
												</div>
											)}
											{intro.images[2]?.url && (
												<div className='relative h-40 md:h-48 rounded-2xl overflow-hidden'>
													<ImageComponent src={intro.images[2].url} alt={intro.images[2].alt || ''} fill className='object-cover' />
												</div>
											)}
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				</section>
			)}

			{/* Projects Grid Section */}
			{hasProjects && (
				<ProjekteProjectsGrid
					badge={projectsBadge}
					heading={projectsHeading}
					description={projectsDescription}
					categories={projects.categories ?? []}
					items={(projects.items ?? []).map((item) => ({
						image: item.image,
						title: isEn ? (item.titleEn || item.titleDe) : (item.titleDe || item.titleEn),
						description: isEn ? (item.descriptionEn || item.descriptionDe) : (item.descriptionDe || item.descriptionEn),
						category: item.category,
						href: item.href,
					}))}
				/>
			)}

		</div>
	);
}
