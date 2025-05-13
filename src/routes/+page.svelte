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

	// Initialize all sections as visible if not in browser, or if this is a re-render
	let sectionsVisible = Array(5).fill(browser ? false : true);

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

	// Benefits of 9takes
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

	function getTransition(index) {
		const duration = 600;
		const delay = 150;
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
				threshold: 0.1,
				rootMargin: '100px 0px'
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

	// Select 9 famous people, one from each type
	const famousByType = Array(9)
		.fill(null)
		.map((_, index) => {
			const typeNumber = index + 1;
			// Filter data.images to find people of this type
			const peopleOfType = data.images.filter((person) => person.type === typeNumber);
			// Return the first person of this type, or null if none found
			return peopleOfType.length > 0 ? peopleOfType[0] : null;
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
	<title>9takes | Open Source Your Conflict Resolution</title>
	<meta name="title" content="9takes | Open Source Your Conflict Resolution" />
	<meta
		name="description"
		content="Transform conflicts into growth opportunities. Get unique perspectives from 9 different personality types. Anonymous, unbiased feedback for better decision-making."
	/>
	<meta
		name="keywords"
		content="conflict resolution, personality types, enneagram, anonymous advice, relationship help, different perspectives, personal growth, problem solving, community feedback, decision making"
	/>
	<meta name="robots" content="index, follow" />
	<meta name="language" content="English" />
	<meta name="author" content="9takes" />

	<!-- Links -->
	<link rel="canonical" href="https://9takes.com" />
	<link rel="alternate" href="https://9takes.com" hreflang="x-default" />
	<link rel="alternate" href="https://9takes.com" hreflang="en" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://9takes.com" />
	<meta property="og:site_name" content="9takes" />
	<meta property="og:title" content="9takes | Open Source Your Conflict Resolution" />
	<meta
		property="og:description"
		content="Transform conflicts into growth opportunities. Get unique perspectives from 9 different personality types. Anonymous, unbiased feedback for better decision-making."
	/>
	<meta property="og:image" content="https://9takes.com/greek_pantheon.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:logo" content="https://9takes.com/brand/aero.png" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@djwayne3" />
	<meta name="twitter:creator" content="@djwayne3" />
	<meta name="twitter:title" content="9takes | Open Source Your Conflict Resolution" />
	<meta
		name="twitter:description"
		content="Transform conflicts into growth opportunities. Get unique perspectives from 9 different personality types. Anonymous, unbiased feedback for better decision-making."
	/>
	<meta name="twitter:image" content="https://9takes.com/greek_pantheon.png" />
	<meta name="twitter:image:alt" content="9takes - Open Source Your Conflict Resolution" />
</svelte:head>

<svelte:window bind:innerWidth />

<!-- Main container -->
<div class="mx-auto w-full max-w-7xl px-4">
	<!-- Hero Section with Single Clear CTA -->
	{#if loaded}
		<section
			class="flex min-h-[85vh] flex-col items-center justify-center py-8 md:py-12"
			in:fly={getTransition(0)}
		>
			<div class="mb-6 text-center">
				<h1
					class="mb-2 bg-gradient-to-r from-gray-800 to-indigo-800 bg-clip-text text-4xl font-bold text-transparent md:text-5xl lg:text-6xl"
				>
					9takes
				</h1>
				<h2 class="mb-6 text-xl text-gray-600 md:text-2xl lg:text-3xl">
					Open Source Your Conflict Resolution
				</h2>
				<p class="mx-auto max-w-2xl text-lg text-gray-600 md:text-xl">
					Get unique perspectives from 9 different personality types. Anonymous, unbiased feedback
					for better decision-making.
				</p>
			</div>

			<!-- Question of the Day - Featured -->
			<a
				href={`/questions/${data.questionOfTheDay.url}`}
				class="mb-8 w-full max-w-3xl rounded-xl border border-primary-200 bg-white p-6 shadow-md"
			>
				<span
					class="inline-block rounded-full bg-primary-100 px-2.5 py-1 text-xs font-semibold text-primary-800"
				>
					Question of the Day
				</span>
				<h3 class="my-4 text-center text-xl font-bold md:text-2xl">
					{data.questionOfTheDay ? data.questionOfTheDay.question_formatted : 'Loading question...'}
				</h3>
				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<div class="flex -space-x-2">
							{#if data.questionOfTheDay}
								{#each data.questionOfTheDay.comment_count.toString().split('') as num, i}
									<div
										class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary-200 text-xs font-bold text-primary-700"
									>
										{num}
									</div>
								{/each}
							{/if}
						</div>
						<span class="ml-2 text-sm text-gray-500">takes</span>
					</div>
				</div>
			</a>

			<!-- PRIMARY CTA BUTTON -->
			<a
				href="/questions"
				class="btn-primary mb-4 transform rounded-xl bg-primary-700 px-8 py-4 text-center text-xl font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-primary-800 hover:shadow-xl md:text-2xl"
			>
				Ask a Question
			</a>
			<p class="text-center text-gray-500">
				Join our community and get answers from all perspectives
			</p>
		</section>
	{:else}
		<!-- Initial placeholder to prevent layout shift -->
		<div class="hero-placeholder h-screen"></div>
	{/if}

	<!-- 3x3 Grid of Famous People by Personality Type -->
	<div class="section-observer" data-section-index="1">
		{#if sectionsVisible[1] || !browser}
			<section class="py-12 md:py-16" in:fly={getTransition(1)}>
				<h2 class="mb-8 text-center text-3xl font-bold md:mb-12 md:text-4xl">
					Explore Personality Types
				</h2>

				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-6">
					{#each famousByType as person, i}
						{#if person}
							<a href={person.url || `/types/${i + 1}`} class="group">
								<div
									class="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
								>
									<div class="relative flex items-center justify-center overflow-hidden p-4">
										<!-- Personality Type Label -->
										<div
											class="absolute left-0 top-0 z-10 m-3 rounded-full bg-primary-700 px-3 py-1 text-xs font-bold text-white"
										>
											Type {i + 1}
										</div>

										<!-- Person Image -->
										<div
											class="relative h-48 w-48 overflow-hidden rounded-full border-4 border-primary-100"
										>
											<img
												src={person.image || `/types/${i + 1}s/${person.name}.webp`}
												alt={person.name || `Type ${i + 1} Example`}
												class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
												loading={i < 6 ? 'eager' : 'lazy'}
											/>
										</div>
									</div>

									<div class="flex flex-1 flex-col justify-between p-4 text-center">
										<h3 class="mb-2 text-lg font-bold text-primary-800">
											{enneagramTypes[i + 1]}
										</h3>
										<p class="text-sm text-gray-600">
											{person.name ? person.name.split('-').join(' ') : 'Example personality'}
										</p>
									</div>
								</div>
							</a>
						{:else}
							<!-- Fallback if no person of this type is found -->
							<a href={`/types/${i + 1}`} class="group">
								<div
									class="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
								>
									<div class="relative flex items-center justify-center overflow-hidden p-4">
										<div
											class="absolute left-0 top-0 z-10 m-3 rounded-full bg-primary-700 px-3 py-1 text-xs font-bold text-white"
										>
											Type {i + 1}
										</div>
										<div
											class="relative h-48 w-48 overflow-hidden rounded-full border-4 border-primary-100 bg-gray-100"
										>
											<div
												class="flex h-full w-full items-center justify-center text-4xl text-gray-400"
											>
												{i + 1}
											</div>
										</div>
									</div>
									<div class="flex flex-1 flex-col justify-between p-4 text-center">
										<h3 class="mb-2 text-lg font-bold text-primary-800">
											{enneagramTypes[i + 1]}
										</h3>
										<p class="text-sm text-gray-600">Explore this personality type</p>
									</div>
								</div>
							</a>
						{/if}
					{/each}
				</div>

				<div class="mt-8 text-center">
					<a
						href="/enneagram-corner/beginners-guide-to-determining-your-enneagram-type"
						class="inline-flex items-center rounded-lg border border-primary-300 bg-white px-4 py-2 font-semibold text-primary-700 transition-all duration-200 hover:border-primary-400 hover:bg-primary-50"
					>
						Learn more about the Enneagram
						<svg
							class="ml-2 h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
							></path>
						</svg>
					</a>
				</div>
			</section>
		{/if}
	</div>

	<!-- Recent Articles Section -->
	<div class="section-observer" data-section-index="2">
		{#if sectionsVisible[2] || !browser}
			<section class="py-12 md:py-16" in:fly={getTransition(2)}>
				<h2 class="mb-8 text-center text-3xl font-bold md:mb-12 md:text-4xl">Recent Articles</h2>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					{#each featuredArticles as article}
						<a href={article.url} class="group">
							<div
								class="h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
							>
								<div class="h-48 overflow-hidden">
									<div class="relative h-full w-full overflow-hidden">
										<img
											src={article.image}
											alt={article.title}
											class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
											loading="lazy"
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

				<div class="mt-8 text-center">
					<a
						href="/enneagram-corner"
						class="inline-flex items-center rounded-lg border border-primary-300 bg-white px-4 py-2 font-semibold text-primary-700 transition-all duration-200 hover:border-primary-400 hover:bg-primary-50"
					>
						View all articles
						<svg
							class="ml-2 h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
							></path>
						</svg>
					</a>
				</div>
			</section>
		{/if}
	</div>

	<!-- Why the Enneagram Section -->
	<div class="section-observer" data-section-index="3">
		{#if sectionsVisible[3] || !browser}
			<section
				class="overflow-hidden rounded-xl bg-gradient-to-br from-primary-800 to-gray-800 p-8 text-white shadow-lg"
				in:fly={getTransition(3)}
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
	<div class="section-observer" data-section-index="4">
		{#if sectionsVisible[4] || !browser}
			<section class="py-12 md:py-16" in:fly={getTransition(4)}>
				<h2 class="mb-8 text-center text-3xl font-bold md:mb-12 md:text-4xl">Why It Works</h2>
				<div class="grid gap-6 md:grid-cols-2 md:gap-8">
					{#each benefits as { title, description }}
						<div
							class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-md"
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

	<!-- Final CTA Section -->
	{#if !data?.session?.user}
		<div class="section-observer" data-section-index="5">
			{#if sectionsVisible[5] || !browser}
				<section
					class="mb-16 rounded-xl border border-gray-200 bg-gradient-to-r from-primary-100 to-white p-8 text-center shadow-md md:mb-24"
					in:fly={getTransition(5)}
				>
					<h2 class="mb-4 text-3xl font-bold text-primary-800 md:mb-6 md:text-4xl">
						Ready to Gain New Perspectives?
					</h2>
					<p class="mb-6 text-lg text-gray-600 md:mb-8 md:text-xl">
						Join our community and start seeing conflicts from all angles.
					</p>
					<div class="mx-auto flex flex-col justify-center gap-4 sm:flex-row">
						<a
							href="/questions"
							class="btn-primary rounded-lg bg-primary-700 px-6 py-3 text-center font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-800 hover:shadow-md"
						>
							Ask a Question
						</a>
						<a
							href="/signup"
							class="rounded-lg border border-primary-300 bg-white px-6 py-3 text-center font-semibold text-primary-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-400 hover:bg-primary-50 hover:shadow-md"
						>
							Sign Up Free
						</a>
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
