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

<main class="enneagram-corner-page">
	<h1 class="my-8 mb-10 text-start text-4xl font-bold leading-tight text-gray-700 lg:text-5xl">
		Explore the Enneagram
	</h1>

	<nav aria-label="Table of Contents" class="mb-12">
		<ul class="grid list-none grid-cols-2 gap-3 p-0">
			{#each blogSections as section}
				<li>
					<a
						href="#{section.id}"
						class="block rounded-xl border-2 border-transparent bg-white p-6 text-gray-700 no-underline transition-all duration-300 hover:-translate-y-1 hover:border-primary-600 hover:shadow-lg focus:-translate-y-1 focus:border-primary-600 focus:shadow-lg"
					>
						<span class="mb-2 block text-lg font-semibold">{section.title}</span>
						{#if section.subtitle}
							<span class="block text-sm leading-relaxed opacity-70">{section.subtitle}</span>
						{/if}
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	{#each blogSections as section}
		<section aria-labelledby={section.id} class="mb-14">
			<h2 id={section.id} class="mb-3 text-3xl font-bold tracking-tight text-gray-800">
				{section.title}
			</h2>
			{#if section.subtitle}
				<p class="mb-6 max-w-2xl text-lg leading-relaxed text-gray-600 opacity-75">
					{section.subtitle}
				</p>
			{/if}
			<div
				class="grid gap-6 {section.type === 'nine-types'
					? 'grid-cols-2 gap-5 md:grid-cols-3'
					: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}"
			>
				{#each data.enneagramBlogs
					.filter((blog) => blog.type[0] === section.type)
					.slice(0, section.type === 'nine-types' ? 9 : 5) as blog (blog.slug)}
					<article
						class="relative overflow-hidden rounded-2xl border border-black/5 bg-gradient-to-br from-gray-800 to-gray-900 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/20 hover:shadow-xl {section.type ===
						'nine-types'
							? 'aspect-square'
							: 'aspect-[3/4]'}"
						class:no-image={!blog.pic}
					>
						<a
							href="/enneagram-corner/{blog.slug}"
							class="blog-link"
							data-tag={`h-blog-${formatBlogSlug(blog.title)}`}
						>
							<div
								class="relative flex h-full w-full items-end bg-cover bg-center bg-no-repeat"
								class:has-image={blog.pic}
								style={blog.pic ? `background-image: url(/blogs/s-${blog.pic}.webp);` : ''}
							>
								{#if !blog.pic}
									<div class="bg-pattern absolute inset-0 z-10 opacity-100"></div>
								{/if}
								<div
									class={blog.pic
										? 'absolute bottom-0 left-0 right-0 z-20 flex min-h-[50%] flex-col justify-end gap-2 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-6 text-white'
										: 'absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center text-white'}
								>
									<h3
										class={blog.pic
											? 'line-clamp-3 text-xl font-bold leading-snug tracking-tight text-white'
											: 'line-clamp-4 text-xl font-bold leading-snug tracking-tight text-white md:text-2xl'}
									>
										{blog.title}
									</h3>
									{#if section.type !== 'nine-types'}
										<p
											class={blog.pic
												? 'line-clamp-2 text-base leading-relaxed text-white/90 opacity-90'
												: 'line-clamp-3 text-base leading-relaxed text-white/95 opacity-95'}
										>
											{blog.description}
										</p>
									{/if}
								</div>
							</div>
						</a>
					</article>
				{/each}
				{#if section.type !== 'nine-types'}
					<div
						class="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-800 to-gray-900 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-gradient-to-br hover:from-gray-700 hover:to-gray-800 hover:shadow-xl"
					>
						<a
							href="/enneagram-corner/{section.type === 'mental-health'
								? 'mental-health'
								: `subtopic/${section.type}`}"
							class="block h-full w-full no-underline"
						>
							<div class="flex h-full w-full items-center justify-center">
								<div class="flex items-center justify-center p-8 text-center">
									<h3
										class="flex items-center justify-center text-lg font-semibold text-white transition-colors hover:text-indigo-400"
									>
										View All {section.linkTitle}
										<ArrowRightIcon
											iconStyle={'margin-left: .5rem'}
											height={'1.5rem'}
											fill={'white'}
										/>
									</h3>
								</div>
							</div>
						</a>
					</div>
				{/if}
			</div>
		</section>
	{/each}
</main>

<div class="mt-16 rounded-3xl bg-gradient-to-b from-gray-900 to-gray-950 p-16 text-white">
	<h2 class="mb-8 text-center text-4xl font-bold text-white">Why Choose 9takes</h2>
	<div class="my-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
		<div
			class="rounded-xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
		>
			<h3 class="mb-4 text-xl font-semibold text-indigo-400">Deep Psychological Insights</h3>
			<p class="text-base leading-relaxed opacity-90">
				Go beyond surface-level descriptions to understand the core motivations, fears, and desires
				that shape each personality type.
			</p>
		</div>
		<div
			class="rounded-xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
		>
			<h3 class="mb-4 text-xl font-semibold text-indigo-400">Personalized Growth Strategies</h3>
			<p class="text-base leading-relaxed opacity-90">
				Receive specific, actionable guidance tailored to your unique personality type and
				individual growth path.
			</p>
		</div>
		<div
			class="rounded-xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
		>
			<h3 class="mb-4 text-xl font-semibold text-indigo-400">Research-Based Approach</h3>
			<p class="text-base leading-relaxed opacity-90">
				Grounded in decades of psychological research and the work of leading Enneagram experts and
				practitioners.
			</p>
		</div>
		<div
			class="rounded-xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
		>
			<h3 class="mb-4 text-xl font-semibold text-indigo-400">Practical Applications</h3>
			<p class="text-base leading-relaxed opacity-90">
				Transform theory into practice with real-world examples, exercises, and tools for immediate
				implementation.
			</p>
		</div>
	</div>
	<div class="mt-12 rounded-2xl bg-indigo-600/10 p-12 text-center">
		<h3 class="mb-4 text-3xl font-bold text-white">Start Your Enneagram Journey</h3>
		<p class="mb-8 text-lg opacity-90">
			Whether you're new to the Enneagram or deepening your understanding, we have resources to
			support your growth.
		</p>
		<div class="flex flex-wrap justify-center gap-4">
			<a
				href="/enneagram-corner/subtopic/nine-types"
				class="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 font-semibold text-white no-underline transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-600/40"
				>Explore All 9 Types</a
			>
			<a
				href="/enneagram-corner/subtopic/overview"
				class="rounded-lg border-2 border-white/30 bg-transparent px-8 py-4 font-semibold text-white no-underline transition-all duration-300 hover:border-white/50 hover:bg-white/10"
				>Learn the System</a
			>
		</div>
	</div>
</div>

<style lang="scss">
	/* Pattern overlay for cards without images */
	.bg-pattern {
		background-image:
			linear-gradient(45deg, rgba(255, 255, 255, 0.02) 25%, transparent 25%),
			linear-gradient(-45deg, rgba(255, 255, 255, 0.02) 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.02) 75%),
			linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.02) 75%);
		background-size: 30px 30px;
		background-position:
			0 0,
			0 15px,
			15px -15px,
			-15px 0px;
	}

	/* Line clamp utilities - Tailwind doesn't have built-in line-clamp */
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.line-clamp-4 {
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
