<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	import QuestionItem from '$lib/components/questions/QuestionItem.svelte';
	import EnneagramDiagram from '$lib/components/blog/EnneagramDiagram.svelte';
	import PeopleBoard from '$lib/components/molecules/PeopleBoard.svelte';

	export let data: PageData;
	let innerWidth = 0;
	let loaded = false;
	let observer: IntersectionObserver;

	const siteName = '9takes';
	const title = '9takes | Open Source Your Conflict Resolution';
	const metaDescription =
		'Transform conflicts into growth opportunities. Get unique perspectives from 9 different personality types. Anonymous, unbiased feedback for better decision-making.';
	const ogImage = 'https://9takes.com/greek_pantheon.png';
	const domain = 'https://9takes.com';
	const twitterHandle = '@djwayne3';

	// Keywords for SEO
	const keywords =
		'conflict resolution, personality types, enneagram, anonymous advice, relationship help, different perspectives, personal growth, problem solving, community feedback, decision making';

	// Initialize all sections as visible if not in browser, or if this is a re-render
	let sectionsVisible = Array(5).fill(browser ? false : true);

	// Sample featured question (replace with actual data)
	const featuredQuestion = data?.top9Questions?.filter((e) => e.id === 118 || e.id === 119)[0] || {
		id: '1',
		title: 'How do you handle conflicts with coworkers who have different communication styles?',
		content:
			'I work in a team with diverse personalities. Some are direct and blunt while others prefer softer, more diplomatic approaches. This leads to frequent misunderstandings...',
		tags: ['workplace', 'communication', 'conflict'],
		commentCount: 24,
		createdAt: new Date().toISOString()
	};

	// Personality blogs
	const personalityBlogs = [
		{
			id: '1',
			title: 'Type 3: The Achiever',
			authorName: 'Dua Lipa',
			authorImage: '/types/3s/Dua-Lipa.webp',
			url: '/personality-analysis/Dua-Lipa',
			authorType: 3
		},
		{
			id: '2',
			title: 'Type 2: The Helper',
			authorName: 'Olivia Rodrigo',
			authorImage: '/types/2s/Olivia-Rodrigo.webp',
			url: '/personality-analysis/Olivia-Rodrigo',
			authorType: 2
		},
		{
			id: '3',
			title: 'Type 5: The Investigator',
			authorName: 'David Sacks',
			authorImage: '/types/5s/David-Sacks.webp',
			url: '/personality-analysis/David-Sacks',
			authorType: 5
		},
		{
			id: '4',
			title: 'Type 4: The Individualist',
			authorName: 'Anya-Taylor-Joy',
			authorImage: '/types/4s/Anya-Taylor-Joy.webp',
			url: '/personality-analysis/Anya-Taylor-Joy',
			authorType: 4
		},
		{
			id: '5',
			title: 'Type 3: The Achiever',
			authorName: 'Sydney Sweeney',
			authorImage: '/types/3s/Sydney-Sweeney.webp',
			url: '/personality-analysis/Sydney-Sweeney',
			authorType: 3
		}
	];

	// Featured articles (recently updated from sitemap)
	const featuredArticles = [
		{
			id: '1',
			title: 'How Each Enneagram Type Flexes: Revealing Secret Needs for Recognition',
			excerpt:
				'Discover the unique ways each Enneagram type shows off their strengths and craves recognition in everyday interactions',
			image: '/blogs/greek-statue-flex.webp',
			url: '/enneagram-corner/how-each-enneagram-flexes'
		},
		{
			id: '2',
			title: 'Toxic Traits of Each Enneagram Type',
			excerpt:
				'Understand the shadow sides of each personality type and how to recognize when strengths turn into weaknesses',
			image: '/blogs/greek-statue-showing-cracks.webp',
			url: '/enneagram-corner/toxic-traits-of-each-enneagram-type'
		},
		{
			id: '3',
			title: 'Workplace Team Building with the Enneagram',
			excerpt:
				'How to leverage personality differences to create stronger teams and improve workplace communication',
			image: '/blogs/greek-statues-working-in-teams.webp',
			url: '/enneagram-corner/enneagram-workplace-team-building'
		},
		{
			id: '4',
			title: 'How Each Enneagram Type Unwinds',
			excerpt:
				'Explore the unique ways different personality types relax, recharge, and recover from stress',
			image: '/blogs/greek-statues-at-the-beach.webp',
			url: '/enneagram-corner/how-each-enneagram-type-unwinds'
		}
	];

	const steps = [
		{
			emoji: '🤔',
			title: 'Ask Your Question',
			description:
				'Share your situation anonymously and get perspectives from different personality types.'
		},
		{
			emoji: '✍️',
			title: 'Provide Your Take',
			description:
				"Comment before seeing others' responses to ensure unbiased, authentic perspectives."
		},
		{
			emoji: '💡',
			title: 'Gain Insights',
			description: 'See different takes on the question and sort answers by personality type.'
		}
	];

	const benefits = [
		{
			title: 'No More Echo Chambers',
			description:
				'Get genuine perspectives from people who think and process differently than you do.'
		},
		{
			title: 'Unbiased Responses',
			description: 'Our "comment first" approach ensures authentic, uninfluenced perspectives.'
		},
		{
			title: 'Complete Picture',
			description: 'Understanding all nine perspectives helps you make better decisions.'
		},
		{
			title: 'Safe Space',
			description: 'Anonymous posting and respectful community guidelines foster honest dialogue.'
		}
	];

	const enneagramTypes = {
		1: 'Type 1: The Perfectionist',
		2: 'Type 2: The Helper',
		3: 'Type 3: The Achiever',
		4: 'Type 4: The Individualist',
		5: 'Type 5: The Investigator',
		6: 'Type 6: The Loyalist',
		7: 'Type 7: The Enthusiast',
		8: 'Type 8: The Challenger',
		9: 'Type 9: The Peacemaker'
	};

	function getTransition(index) {
		const duration = 600; // Reduced from 800 for faster loading
		const delay = 150; // Reduced from 200 for faster loading
		return index % 2 === 0 ? { x: -30, duration, delay } : { x: 30, duration, delay };
	}

	function setupIntersectionObserver() {
		if (!browser || typeof IntersectionObserver === 'undefined') {
			// If no browser or no IntersectionObserver support, make all sections visible
			sectionsVisible = Array(5).fill(true);
			return;
		}

		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const index = parseInt(entry.target.getAttribute('data-section-index') || '0');
						if (!isNaN(index) && index >= 0 && index < sectionsVisible.length) {
							sectionsVisible[index] = true;
							// Force update of the array to trigger reactivity
							sectionsVisible = [...sectionsVisible];
						}
					}
				});
			},
			{
				threshold: 0.1, // Reduced threshold for earlier loading
				rootMargin: '100px 0px' // Increased margin for earlier loading
			}
		);

		// Wait for the sections to be in the DOM
		setTimeout(() => {
			const sections = document.querySelectorAll('.section-observer');
			sections.forEach((section, index) => {
				section.setAttribute('data-section-index', index.toString());
				observer.observe(section);
			});
		}, 100);
	}

	onMount(async () => {
		// Set loaded immediately to avoid FOUC (Flash of Unstyled Content)
		loaded = true;

		// Wait for next tick to ensure DOM is ready
		await tick();

		// Setup intersection observer for lazy loading sections
		setupIntersectionObserver();

		// Add passive flag to event listener for better performance
		window.addEventListener(
			'resize',
			() => {
				innerWidth = window.innerWidth;
			},
			{ passive: true }
		);

		return () => {
			if (observer) observer.disconnect();
		};
	});
</script>

<svelte:head>
	<!-- Preconnect to domains for faster loading -->
	<link rel="preconnect" href="https://9takes.com" />

	<!-- Preload critical assets -->
	<link href="/greek_pantheon.png" as="image" />

	<!-- Set explicit width and height on viewport to prevent layout shift -->
	<meta name="viewport" content="width=device-width, initial-scale=1, height=device-height" />

	<!-- Primary Meta Tags -->
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={metaDescription} />
	<meta name="keywords" content={keywords} />
	<meta name="robots" content="index, follow" />
	<meta name="language" content="English" />
	<meta name="author" content={siteName} />

	<!-- Links -->
	<link rel="canonical" href={domain} />
	<link rel="alternate" href={domain} hreflang="x-default" />
	<link rel="alternate" href={domain} hreflang="en" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={domain} />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={metaDescription} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:logo" content="https://9takes.com/brand/aero.png" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={twitterHandle} />
	<meta name="twitter:creator" content={twitterHandle} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={metaDescription} />
	<meta name="twitter:image" content={ogImage} />
	<meta name="twitter:image:alt" content="9takes - Open Source Your Conflict Resolution" />

	<!-- Additional SEO Tags -->
	<meta name="theme-color" content="#000000" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />
	<meta name="apple-mobile-web-app-title" content={siteName} />

	<!-- Mobile Specific -->
	<meta name="format-detection" content="telephone=no" />
	<meta name="mobile-web-app-capable" content="yes" />
</svelte:head>

<svelte:window bind:innerWidth />

<!-- Main container -->
<div class="mx-auto w-full max-w-7xl px-4">
	<!-- Bento Grid Hero Section -->
	{#if loaded}
		<section class="py-8 md:py-12" in:fly={getTransition(0)}>
			<!-- Site title and tagline -->
			<div class="mb-6 text-center md:text-left">
				<h1
					class="mb-2 bg-gradient-to-r from-gray-800 to-indigo-800 bg-clip-text text-3xl font-bold text-transparent md:text-4xl lg:text-5xl"
				>
					9takes
				</h1>
				<p class="text-lg text-gray-600 md:text-xl">What is your take on life?</p>
			</div>

			<!-- Bento Box Grid Layout -->
			<div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
				<!-- Main Question of the Day - Left Column (spans 2 rows) -->
				<div
					class="group rounded-2xl border border-gray-200 bg-white p-5 shadow-md transition-all duration-300 hover:shadow-lg md:col-span-2 md:row-span-2"
				>
					<div class="flex h-full flex-col justify-between">
						<div>
							<span
								class="inline-block rounded-full bg-primary-100 px-2.5 py-1 text-xs font-semibold text-primary-800"
							>
								Question of the Day
							</span>
						</div>

						<div class="my-6 flex flex-grow items-center justify-center">
							<h2
								class="text-center text-xl font-bold transition-colors duration-300 group-hover:text-primary-700 md:text-2xl"
							>
								{featuredQuestion.question_formatted}
							</h2>
						</div>

						<div class="flex items-center justify-between">
							<div class="flex items-center">
								<div class="flex -space-x-2">
									{#each featuredQuestion.comment_count.toString().split('') as num, i}
										<div
											class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary-200 text-xs font-bold text-primary-700"
										>
											{num}
										</div>
									{/each}
								</div>
								<span class="ml-2 text-sm text-gray-500"> takes</span>
							</div>
							<a
								href={`/questions/${featuredQuestion.url}`}
								class="inline-flex items-center text-sm font-semibold text-primary-700 hover:text-primary-800"
							>
								Give your take
								<svg
									class="ml-1 h-4 w-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5l7 7-7 7"
									></path>
								</svg>
							</a>
						</div>
					</div>
				</div>

				<!-- Personality Blog Tiles - Right Column (5 small tiles) -->
				{#each data.famousPeople as blog, index}
					<div
						class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
					>
						<a href={`personality-analysis/${blog.person}`} class="flex h-full items-center p-3">
							<div
								class="mr-3 h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-primary-100"
							>
								<img
									src={`/types/${blog.enneagram}s/${blog.person}.webp`}
									alt={blog.person}
									class="h-full w-full object-cover"
									loading="eager"
								/>
							</div>
							<div class="overflow-hidden">
								<h3 class="truncate text-sm font-medium">{enneagramTypes[blog.enneagram]}</h3>
								<p class="truncate text-xs text-gray-500">{blog.person.split('-').join(' ')}</p>
							</div>
						</a>
					</div>
				{/each}
			</div>

			<!-- Article Grid (2x2) -->
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				{#each featuredArticles as article}
					<a href={article.url} class="group">
						<div
							class="h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
						>
							<div class="h-48 overflow-hidden">
								<div class="relative h-full w-full overflow-hidden">
									<img
										src={article.image}
										alt={article.title}
										class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
									/>
									<div
										class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
									></div>
								</div>
							</div>
							<div class="p-4">
								<h3
									class="mb-2 text-lg font-bold transition-colors duration-300 group-hover:text-primary-700"
								>
									{article.title}
								</h3>
								<p class="line-clamp-2 text-sm text-gray-600">{article.excerpt}</p>
							</div>
						</div>
					</a>
				{/each}
			</div>

			<!-- Quick Action Buttons -->
			<div class="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
				<a
					href="/questions"
					class="btn-primary rounded-lg bg-primary-700 px-6 py-3 text-center font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-800 hover:shadow-md"
				>
					Ask a Question
				</a>
				<a
					href="/book-session"
					class="rounded-lg border border-primary-300 bg-white px-6 py-3 text-center font-semibold text-primary-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-400 hover:bg-primary-50 hover:shadow-md"
				>
					Signup for Enneagram Coaching
				</a>
			</div>
		</section>
	{:else}
		<!-- Initial placeholder to prevent layout shift -->
		<div class="hero-placeholder h-screen"></div>
	{/if}

	<!-- How it Works Section -->
	<div class="section-observer" data-section-index="1">
		{#if sectionsVisible[1] || !browser}
			<section class="py-8 md:py-16" in:fly={getTransition(1)}>
				<h2 class="mb-8 text-center text-3xl font-bold md:mb-12 md:text-4xl">How 9takes Works</h2>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
					{#each steps as { emoji, title, description }}
						<div
							class="rounded-lg border border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md"
						>
							<div class="mb-2 inline-block text-4xl">{emoji}</div>
							<h3 class="mb-2 text-lg font-semibold text-primary-800 md:text-xl">{title}</h3>
							<p class="text-gray-600">{description}</p>
						</div>
					{/each}
				</div>
			</section>
		{/if}
	</div>

	<!-- Nine Types Section -->
	<div class="section-observer" data-section-index="2">
		{#if sectionsVisible[2] || !browser}
			<section
				class="overflow-hidden rounded-xl bg-gradient-to-br from-primary-800 to-gray-800 p-8 text-white shadow-lg"
				in:fly={getTransition(2)}
			>
				<h2 class="mb-6 text-center text-3xl font-bold md:mb-8 md:text-4xl">Why the Enneagram?</h2>
				<div class="mx-auto max-w-3xl pb-6 text-center">
					<p class="mb-4 text-lg text-white/90 md:text-xl">
						The Enneagram has a nine personality type model based on emotions.
					</p>

					<div class="text-center">
						<p class="mb-4 text-lg font-extrabold tracking-wider md:text-xl">
							The symbol describes how each type is connected and where they go in stress and in
							comfort (integration/ disintegration).
						</p>
					</div>
					<EnneagramDiagram />
				</div>
			</section>
		{/if}
	</div>

	<!-- Benefits Section -->
	<div class="section-observer" data-section-index="3">
		{#if sectionsVisible[3] || !browser}
			<section class="py-8 md:py-16" in:fly={getTransition(3)}>
				<h2 class="mb-8 text-center text-3xl font-bold md:mb-12 md:text-4xl">Why It Works</h2>
				<div class="grid gap-6 md:grid-cols-2 md:gap-8">
					{#each benefits as { title, description }}
						<div
							class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md"
						>
							<h3 class="mb-3 text-lg font-semibold text-primary-800 md:mb-4 md:text-xl">
								{title}
							</h3>
							<p class="text-gray-600">{description}</p>
						</div>
					{/each}
				</div>
			</section>
		{/if}
	</div>

	<!-- CTA Section -->
	{#if !data?.session?.user}
		<div class="section-observer" data-section-index="4">
			{#if sectionsVisible[4] || !browser}
				<section
					class="mb-16 rounded-xl border border-gray-200 bg-gradient-to-r from-primary-100 to-white p-8 text-center shadow-md md:mb-24"
					in:fly={getTransition(4)}
				>
					<h2 class="mb-4 text-3xl font-bold text-primary-800 md:mb-6 md:text-4xl">
						Ready to Gain New Perspectives?
					</h2>
					<p class="mb-6 text-lg text-gray-600 md:mb-8 md:text-xl">
						Join our community and start seeing conflicts from all angles.
					</p>
					<div class="mx-auto max-w-lg">
						<EmailSignup cta="Get Started Now →" />
					</div>
				</section>
			{/if}
		</div>
	{/if}
</div>

<style>
	/* Only keeping minimal styles that might be hard to implement with pure Tailwind */
	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	.animate-shimmer {
		animation: shimmer 1.5s infinite;
	}

	/* Accessibility */
	@media (prefers-reduced-motion: reduce) {
		[in\:fly] {
			transition: none !important;
			transform: none !important;
		}

		* {
			transition-duration: 0.001ms !important;
			animation-duration: 0.001ms !important;
		}
	}
</style>
