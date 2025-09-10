<!-- src/routes/pop-culture/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import ArrowRightIcon from '$lib/components/icons/arrowRightIcon.svelte';
	import SEOHead from '$lib/components/SEOHead.svelte';

	export let data: PageData;

	const blogCategories = [
		{
			id: 'dark-psychology',
			title: 'Dark Psychology & Criminal Minds',
			subtitle: 'Explore the shadow side of personality through famous cases and scandals',
			icon: '🎭',
			featured: true
		},
		{
			id: 'celebrity-analysis',
			title: 'Celebrity Personality Deep Dives',
			subtitle: 'Psychological profiles of public figures through the Enneagram lens',
			icon: '⭐'
		},

		{
			id: 'cultural-phenomena',
			title: 'Cultural Movements & Trends',
			subtitle: 'How personality patterns shape societal movements and viral moments',
			icon: '🌍'
		},
		{
			id: 'power-politics',
			title: 'Power, Politics & Personality',
			subtitle: 'Analyzing leaders, scandals, and the psychology of power',
			icon: '⚡'
		},
		{
			id: 'creative-genius',
			title: 'Creative Genius & Madness',
			subtitle: 'The psychology behind artistic brilliance and self-destruction',
			icon: '🎨'
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
						"name": "Dark Psychology & Criminal Minds",
						"description": "Explore the Dark Triad traits through famous criminal cases and psychological profiles",
						"url": "https://9takes.com/pop-culture#dark-psychology"
					},
					{
						"@type": "ListItem",
						"position": 2,
						"name": "Celebrity Personality Analysis",
						"description": "In-depth Enneagram analysis of celebrities, public figures, and their behaviors",
						"url": "https://9takes.com/pop-culture#celebrity-analysis"
					},

					{
						"@type": "ListItem",
						"position": 4,
						"name": "Cultural Phenomena Through Personality",
						"description": "Understanding viral trends, movements, and collective behavior patterns",
						"url": "https://9takes.com/pop-culture#cultural-phenomena"
					},
					{
						"@type": "ListItem",
						"position": 5,
						"name": "Power and Politics Psychology",
						"description": "Analyzing political figures, scandals, and the psychology of leadership",
						"url": "https://9takes.com/pop-culture#power-politics"
					},
					{
						"@type": "ListItem",
						"position": 6,
						"name": "Creative Genius and Mental Health",
						"description": "Exploring the link between creativity, personality types, and psychological struggles",
						"url": "https://9takes.com/pop-culture#creative-genius"
					}
				]
			},
			"name": "Pop Culture Psychology: Enneagram Analysis of Famous Figures & Cultural Phenomena",
			"description": "Deep psychological analysis of celebrities, criminals, and cultural movements through the Enneagram personality system. Explore the Dark Triad, famous scandals, and the psychology behind pop culture.",
			"url": "https://9takes.com/pop-culture",
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
						"name": "Pop Culture Psychology",
						"item": "https://9takes.com/pop-culture"
					}
				]
			}
		}
	</script>
</svelte:head>

<SEOHead
	title="Pop Culture Psychology: Dark Triad, Celebrities & Criminal Minds | 9takes"
	description="Explore the psychology of pop culture through the Enneagram. From serial killers and the Dark Triad to celebrity breakdowns and fictional characters. Deep dives into famous scandals, criminal psychology, and cultural phenomena."
	canonical="https://9takes.com/pop-culture"
	twitterCardType="summary_large_image"
	ogImage="https://9takes.com/pop-culture-card.webp"
	additionalMeta={[
		{
			name: 'keywords',
			content:
				'dark triad, criminal psychology, celebrity psychology, enneagram pop culture, serial killers, personality disorders, famous scandals, narcissism, psychopathy,  cultural psychology, celebrity mental health'
		},
		{ name: 'author', content: '9takes' },
		{ property: 'article:publisher', content: 'https://9takes.com' },
		{ property: 'og:site_name', content: '9takes' },
		{ property: 'og:locale', content: 'en_US' }
	]}
/>

<main class="mx-auto max-w-6xl px-8">
	<div class="mb-16 py-12 text-center">
		<h1 class="mb-4 text-5xl font-extrabold leading-tight tracking-tight text-gray-800 lg:text-6xl">
			Pop Culture Through the Personality Lens
		</h1>
		<p class="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
			Uncover the psychological patterns behind famous figures, and cultural phenomena. From the
			Dark Triad to creative genius, explore how personality shapes the stories that captivate us.
		</p>
	</div>

	<!-- Featured Section for Dark Psychology -->
	{#if data.popCultureBlogs.some((blog) => blog.slug.includes('dark-triad'))}
		<section class="mb-16" aria-labelledby="featured">
			<h2 id="featured" class="mb-8 text-3xl font-bold text-gray-800">
				Featured: The Dark Side of Personality
			</h2>
			<div class="grid gap-8">
				{#each data.popCultureBlogs
					.filter((blog) => blog.slug.includes('dark-triad'))
					.slice(0, 1) as blog}
					<article
						class="overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
					>
						<a
							href="/pop-culture/{blog.slug}"
							class="grid h-full text-inherit no-underline md:grid-cols-[1fr_1.5fr]"
						>
							<div
								class="relative min-h-[300px] bg-cover bg-center md:min-h-[200px]"
								style={blog.pic ? `background-image: url(/blogs/${blog.pic}.webp);` : ''}
							>
								{#if !blog.pic}
									<div class="bg-pattern absolute inset-0"></div>
								{/if}
							</div>
							<div class="flex flex-col justify-center p-10">
								<span
									class="mb-4 inline-block w-fit rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white"
									>🔥 New Deep Dive</span
								>
								<h3 class="mb-4 text-3xl font-bold leading-tight text-gray-800">{blog.title}</h3>
								<p class="mb-6 leading-relaxed text-gray-600">{blog.description}</p>
								<span
									class="flex items-center font-semibold text-indigo-600 transition-colors hover:text-purple-600"
								>
									Read Full Analysis
									<ArrowRightIcon
										iconStyle={'margin-left: .5rem'}
										height={'1.2rem'}
										fill={'currentColor'}
									/>
								</span>
							</div>
						</a>
					</article>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Categories Navigation -->
	<nav aria-label="Content Categories" class="mb-16">
		<h2 class="mb-8 text-center text-3xl font-bold text-gray-800">
			Explore Pop Culture Psychology
		</h2>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each blogCategories as category}
				<a
					href="#{category.id}"
					class="{category.featured
						? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
						: 'border-2 border-gray-200 bg-white'} rounded-2xl p-8 text-center no-underline transition-all duration-300 hover:-translate-y-1 hover:shadow-lg {!category.featured
						? 'hover:border-indigo-600'
						: ''}"
				>
					<span class="mb-4 block text-5xl">{category.icon}</span>
					<h3
						class="mb-2 text-xl font-semibold {category.featured ? 'text-white' : 'text-gray-800'}"
					>
						{category.title}
					</h3>
					<p class="text-sm leading-relaxed {category.featured ? 'text-white' : 'text-gray-600'}">
						{category.subtitle}
					</p>
				</a>
			{/each}
		</div>
	</nav>

	<!-- All Blog Posts -->
	<section class="mb-16" aria-labelledby="all-posts">
		<h2 id="all-posts" class="mb-8 text-3xl font-bold text-gray-800">
			Latest Pop Culture Analyses
		</h2>
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each data.popCultureBlogs as blog}
				<article
					class="overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
				>
					<a href="/pop-culture/{blog.slug}" class="block text-inherit no-underline">
						{#if blog.pic}
							<div
								class="relative h-48 bg-cover bg-center"
								style="background-image: url(/blogs/s-{blog.pic}.webp);"
							>
								<div
									class="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-50 transition-opacity hover:opacity-70"
								></div>
							</div>
						{:else}
							<div class="relative h-48 bg-gradient-to-br from-indigo-600 to-purple-600">
								<div class="bg-pattern absolute inset-0"></div>
							</div>
						{/if}
						<div class="p-6">
							<h3 class="mb-3 line-clamp-2 text-xl font-semibold leading-tight text-gray-800">
								{blog.title}
							</h3>
							<p class="mb-4 line-clamp-3 leading-relaxed text-gray-600">{blog.description}</p>
							<div class="flex items-center text-sm text-gray-500">
								<time datetime={blog.date} class="font-medium">
									{new Date(blog.date).toLocaleDateString('en-US', {
										month: 'short',
										day: 'numeric',
										year: 'numeric'
									})}
								</time>
								<span class="ml-2">• 8 min read</span>
							</div>
						</div>
					</a>
				</article>
			{/each}
		</div>
	</section>

	<!-- CTA Section -->
	<section
		class="mt-16 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-16 text-center text-white"
	>
		<div>
			<h2 class="mb-4 text-4xl font-bold text-white">Dive Deeper into Personality Psychology</h2>
			<p class="mb-8 text-xl opacity-90">
				Explore how the Enneagram reveals hidden patterns in pop culture, from criminal minds to
				creative genius.
			</p>
			<div class="flex flex-wrap justify-center gap-4">
				<a
					href="/enneagram-corner"
					class="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 font-semibold text-white no-underline transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-600/40"
					>Learn the Enneagram</a
				>
				<a
					href="/personality-analysis"
					class="rounded-lg border-2 border-white/30 bg-transparent px-8 py-4 font-semibold text-white no-underline transition-all duration-300 hover:border-white/50 hover:bg-white/10"
					>Famous People Analysis</a
				>
			</div>
		</div>
	</section>
</main>

<style lang="scss">
	/* Pattern overlay for cards without images */
	.bg-pattern {
		background-image:
			linear-gradient(45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%),
			linear-gradient(-45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%);
		background-size: 30px 30px;
	}

	/* Line clamp utilities */
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
