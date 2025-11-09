<!-- src/routes/enneagram-corner/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import ArrowRightIcon from '$lib/components/icons/arrowRightIcon.svelte';
	import SEOHead from '$lib/components/SEOHead.svelte';

	export let data: PageData;

	const blogSections = [
		{
			id: 'understanding',
			title: 'Understanding the Enneagram',
			subtitle: 'Master the fundamental principles of personality psychology',
			type: 'overview',
			linkTitle: 'Core Concepts'
		},
		{
			id: 'nine-types',
			title: 'The Nine Personality Types',
			subtitle: "Deep dive into each type's motivations, fears, and growth paths",
			type: 'nine-types',
			linkTitle: 'All 9 Types'
		},
		{
			id: 'personal-development',
			title: 'Personal Development',
			subtitle: 'Type-specific strategies for authentic growth and transformation',
			type: 'development',
			linkTitle: 'Growth Strategies'
		},
		{
			id: 'relationships',
			title: 'Relationships & Compatibility',
			subtitle: 'Navigate relationships with deeper understanding and empathy',
			type: 'relationships',
			linkTitle: 'Relationship Insights'
		},
		{
			id: 'mental-health',
			title: 'Mental Health & Wellness',
			subtitle: 'Type-aware approaches to emotional well-being and resilience',
			type: 'mental-health',
			linkTitle: 'Wellness Resources'
		},
		{
			id: 'workplace',
			title: 'Career & Leadership',
			subtitle: 'Leverage your natural strengths in professional settings',
			type: 'workplace',
			linkTitle: 'Career Insights'
		},
		{
			id: 'resources',
			title: 'Tools & Resources',
			subtitle: 'Curated collection of books, tests, and practical applications',
			type: 'resources',
			linkTitle: 'Resources'
		},
		{
			id: 'situations',
			title: 'Types in Real Life',
			subtitle: 'How each type responds to everyday situations and challenges',
			type: 'situational',
			linkTitle: 'Real-World Examples'
		}
	];

	function formatBlogSlug(title: string) {
		return title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
	}
</script>

<svelte:head>
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			"mainEntity": {
				"@type": "ItemList",
				"itemListElement": [
					{
						"@type": "ListItem",
						"position": 1,
						"name": "Understanding the Enneagram",
						"description": "Explore the basics and fundamentals of the Enneagram system",
						"url": "https://9takes.com/enneagram-corner#understanding"
					},
					{
						"@type": "ListItem",
						"position": 2,
						"name": "The Nine Enneagram Types",
						"description": "Detailed information about each of the nine Enneagram personality types",
						"url": "https://9takes.com/enneagram-corner#nine-types"
					},
					{
						"@type": "ListItem",
						"position": 3,
						"name": "Using the Enneagram for Personal Development",
						"description": "Learn how to apply Enneagram insights for personal growth and self-improvement",
						"url": "https://9takes.com/enneagram-corner#personal-development"
					},
					{
						"@type": "ListItem",
						"position": 4,
						"name": "Enneagram in Relationships",
						"description": "Understand how Enneagram types interact in various relationships",
						"url": "https://9takes.com/enneagram-corner#relationships"
					},
					{
						"@type": "ListItem",
						"position": 5,
						"name": "Enneagram and Mental Health",
						"description": "Type-specific mental health resources, therapy guides, and healing strategies tailored to each Enneagram type",
						"url": "https://9takes.com/enneagram-corner#mental-health"
					},
					{
						"@type": "ListItem",
						"position": 6,
						"name": "Enneagram in the Workplace",
						"description": "Discover how Enneagram knowledge can improve workplace dynamics and productivity",
						"url": "https://9takes.com/enneagram-corner#workplace"
					},
					{
						"@type": "ListItem",
						"position": 7,
						"name": "Enneagram Resources",
						"description": "Curated collection of Enneagram books, tools, and other resources",
						"url": "https://9takes.com/enneagram-corner#resources"
					},
					{
						"@type": "ListItem",
						"position": 8,
						"name": "Enneagram Situational Topics",
						"description": "Explore how Enneagram types respond in various life situations",
						"url": "https://9takes.com/enneagram-corner#situations"
					}
				]
			},
			"name": "Enneagram Corner: Your Guide to Personal Growth and Understanding",
			"description": "Dive into the Enneagram with this 9takes guide. Explore the nine types, personal development, relationships, workplace dynamics, and more.",
			"url": "https://9takes.com/enneagram-corner",
			"author": {
				"@type": "Organization",
				"name": "9takes",
				"url": "https://9takes.com"
			},
			"breadcrumb": {
				"@type": "BreadcrumbList",
				"itemListElement": [
					{
						"@type": "ListItem",
						"position": 1,
						"name": "Home",
						"item": "https://9takes.com"
					},
					{
						"@type": "ListItem",
						"position": 2,
						"name": "Enneagram Corner",
						"item": "https://9takes.com/enneagram-corner"
					}
				]
			}
		}
	</script>
</svelte:head>

<SEOHead
	title="Enneagram Personality Guide: Complete Psychology System | 9takes"
	description="Master the Enneagram personality system. Discover your type among 9 distinct patterns, understand core motivations, break limiting patterns, and transform relationships. Expert insights on mental health, career, and personal growth."
	canonical="https://9takes.com/enneagram-corner"
	twitterCardType="summary_large_image"
	ogImage="https://9takes.com/enneagram-corner-card.webp"
	additionalMeta={[
		{
			name: 'keywords',
			content:
				'enneagram, personality types, enneagram test, personality psychology, 9 types, self-improvement, personal growth, mental health, relationships, career development, enneagram compatibility, personality assessment'
		},
		{ name: 'author', content: '9takes' },
		{ property: 'article:publisher', content: 'https://9takes.com' },
		{ property: 'og:site_name', content: '9takes' },
		{ property: 'og:locale', content: 'en_US' }
	]}
/>

<main class="mx-auto w-full max-w-6xl px-4 py-10 md:py-12">
	<h1 class="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">Explore the Enneagram</h1>

	<nav aria-label="Table of Contents" class="mt-6 mb-10">
		<ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each blogSections as section}
				<li>
					<a
						href="#{section.id}"
						class="group flex h-full flex-col rounded-2xl border border-neutral-200/70 bg-white/90 p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary-400 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
					>
						<span class="text-base font-semibold text-neutral-900">{section.title}</span>
						{#if section.subtitle}
							<span class="mt-1 text-sm text-neutral-500">{section.subtitle}</span>
						{/if}
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	{#each blogSections as section}
		<section class="mb-12" aria-labelledby={section.id}>
			<h2 id={section.id} class="text-2xl font-semibold text-neutral-900 md:text-3xl">{section.title}</h2>
			{#if section.subtitle}
				<p class="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">{section.subtitle}</p>
			{/if}
			<div
				class={`mt-6 grid gap-4 sm:grid-cols-2 ${
					section.type === 'nine-types' ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3'
				}`}
			>
				{#each data.enneagramBlogs
					.filter((blog) => blog.type[0] === section.type)
					.slice(0, section.type === 'nine-types' ? 9 : 5) as blog (blog.slug)}
					<article>
						<a
							href="/enneagram-corner/{blog.slug}"
							class="group relative block h-full overflow-hidden rounded-2xl border border-neutral-200/70 bg-neutral-900 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
							data-tag={`h-blog-${formatBlogSlug(blog.title)}`}
						>
							{#if blog.pic}
								<div
									class="absolute inset-0 bg-cover bg-center transition group-hover:scale-[1.03]"
									style={`background-image: url(/blogs/s-${blog.pic}.webp);`}
								></div>
							{:else}
								<div class="absolute inset-0 bg-gradient-to-br from-brand-purple to-brand-purpleDark opacity-90"></div>
							{/if}
							<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/5"></div>
							<div class="relative z-10 flex h-full flex-col justify-end gap-2 p-4 text-white">
								<h3 class="text-lg font-semibold leading-snug">{blog.title}</h3>
								{#if section.type !== 'nine-types'}
									<p class="text-sm leading-snug text-white/85">{blog.description}</p>
								{/if}
							</div>
						</a>
					</article>
				{/each}
				{#if section.type !== 'nine-types'}
					<div class="h-full">
						<a
							href="/enneagram-corner/{section.type === 'mental-health'
								? 'mental-health'
								: `subtopic/${section.type}`}"
							class="group flex h-full flex-col items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-6 text-center text-white transition hover:-translate-y-1 hover:text-brand-purpleLight"
						>
							<h3 class="flex items-center justify-center text-base font-semibold">
								View All {section.linkTitle}
								<ArrowRightIcon iconStyle={'margin-left: .5rem'} height={'1.5rem'} fill={'currentColor'} />
							</h3>
						</a>
					</div>
				{/if}
			</div>
		</section>
	{/each}
</main>

<section class="mx-auto mb-12 w-full max-w-6xl rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-950 px-6 py-10 text-white shadow-xl">
	<h2 class="text-center text-3xl font-semibold">Why Choose 9takes</h2>
	<div class="mt-8 grid gap-4 md:grid-cols-2">
		{#each [
			{
				title: 'Deep Psychological Insights',
				copy:
					'Go beyond surface-level descriptions to understand the core motivations, fears, and desires that shape each personality type.'
			},
			{
				title: 'Personalized Growth Strategies',
				copy:
					'Receive specific, actionable guidance tailored to your unique personality type and individual growth path.'
			},
			{
				title: 'Research-Based Approach',
				copy:
					'Grounded in decades of psychological research and the work of leading Enneagram experts and practitioners.'
			},
			{
				title: 'Practical Applications',
				copy:
					'Transform theory into practice with real-world examples, exercises, and tools for immediate implementation.'
			}
		] as item}
			<article class="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm transition hover:-translate-y-1 hover:bg-white/10">
				<h3 class="text-lg font-semibold text-brand-purpleLight">{item.title}</h3>
				<p class="mt-2 text-sm leading-relaxed text-white/80">{item.copy}</p>
			</article>
		{/each}
	</div>
	<div class="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-center shadow-sm">
		<h3 class="text-2xl font-semibold">Start Your Enneagram Journey</h3>
		<p class="mt-2 text-base text-white/80">
			Whether you're new to the Enneagram or deepening your understanding, we have resources to support your growth.
		</p>
		<div class="mt-6 flex flex-wrap justify-center gap-3">
			<a
				href="/enneagram-corner/subtopic/nine-types"
				class="inline-flex items-center rounded-full bg-brand-purple px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-brand-purpleDark"
			>
				Explore All 9 Types
			</a>
			<a
				href="/enneagram-corner/subtopic/overview"
				class="inline-flex items-center rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/80 hover:bg-white/10"
			>
				Learn the System
			</a>
		</div>
	</div>
</section>

		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 2;
		padding: 1.5rem;
		background: linear-gradient(
			to top,
			rgba(0, 0, 0, 0.95) 0%,
			rgba(0, 0, 0, 0.8) 40%,
			rgba(0, 0, 0, 0.4) 70%,
			rgba(0, 0, 0, 0) 100%
		);
		color: white;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		gap: 0.5rem;
		min-height: 50%;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.no-image .text-overlay {
		background: transparent;
		min-height: 100%;
		justify-content: center;
		align-items: center;
		text-align: center;
		padding: 2rem;
	}

	.blog-grid-container .text-overlay h3 {
		font-size: 1.2rem !important;
		font-weight: 700;
		margin: 0 !important;
		padding: 0 !important;
		line-height: 1.35;
		color: white !important;
		letter-spacing: -0.01em;
		word-wrap: break-word;
		overflow-wrap: break-word;
		hyphens: auto;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.no-image .text-overlay h3 {
		-webkit-line-clamp: 4;
		line-clamp: 4;
		font-size: 1.25rem !important;
	}

	.blog-grid-container .text-overlay p {
		font-size: 0.95rem !important;
		line-height: 1.5;
		opacity: 0.9;
		color: rgba(255, 255, 255, 0.9) !important;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
		transition: all 0.3s ease;
		margin: 0 !important;
		padding: 0 !important;
		font-weight: 400;
	}

	.no-image .text-overlay p {
		opacity: 0.95;
		transform: none;
		-webkit-line-clamp: 3;
		line-clamp: 3;
	}

	.blog-grid-container .view-all {
		background: linear-gradient(135deg, #2d3436 0%, #1a1a2e 100%);
		border: 1px solid rgba(255, 255, 255, 0.08);

		.grid-item-content {
			background: transparent;
			display: flex;
			align-items: center;
			justify-content: center;

			&::after {
				display: none;
			}
		}

		.text-overlay {
			background: transparent !important;
			min-height: 100%;
			padding: 2rem;
			align-items: center;
			justify-content: center;
			text-align: center;
		}

		h3 {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 1.15rem !important;
			font-weight: 600;
			color: white !important;
			margin: 0 !important;
			padding: 0 !important;
			-webkit-line-clamp: unset;
			line-clamp: unset;
			overflow: visible;
		}

		&:hover {
			background: linear-gradient(135deg, #3d4447 0%, #2a2a3e 100%);
			transform: translateY(-4px);
			border-color: rgba(255, 255, 255, 0.15);

			h3 {
				color: #a29bfe !important;
			}
		}
	}

	@media (max-width: 768px) {
		h1 {
			font-size: 2rem;
			line-height: 1.3;
		}

		section h2 {
			font-size: 1.75rem;
		}

		.blog-grid-container {
			grid-template-columns: repeat(2, 1fr);
			gap: 1rem;

			&.nine-types {
				grid-template-columns: repeat(2, 1fr);
			}
		}

		.grid-item {
			aspect-ratio: 3 / 4;
		}

		.text-overlay {
			padding: 1.25rem;
			min-height: 50%;
		}

		.text-overlay h3 {
			font-size: 1.1rem;
			margin-bottom: 0.5rem;
		}

		.text-overlay p {
			font-size: 0.85rem;
			-webkit-line-clamp: 2;
			line-clamp: 2;
		}
	}

	@media (max-width: 480px) {
		.blog-grid-container {
			grid-template-columns: repeat(2, 1fr);
			gap: 0.75rem;

			&.nine-types {
				grid-template-columns: repeat(2, 1fr);
			}
		}

		.grid-item {
			aspect-ratio: 1 / 1;
		}

		.text-overlay {
			min-height: auto;
			padding: 1rem;
		}

		.text-overlay h3 {
			font-size: 1rem;
		}

		.text-overlay p {
			font-size: 0.8rem;
			-webkit-line-clamp: 2;
			line-clamp: 2;
		}
	}
</style>
