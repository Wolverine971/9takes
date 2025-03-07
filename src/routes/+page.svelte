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

	// Fixed height placeholder for the question list to prevent layout shift
	const questionListHeight = '400px';

	// Initialize all sections as visible if not in browser, or if this is a re-render
	let sectionsVisible = Array(5).fill(browser ? false : true);

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

		// Calculate marquee width

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

<!-- Main container with min-height to prevent layout shift -->
<div class="mx-auto w-full max-w-7xl px-4">
	<!-- Hero Section -->
	<div>
		{#if loaded}
			<section
				class="py-8 md:py-16"
				in:fly={getTransition(0)}
				style={`min-height: calc(${innerWidth < 400 ? '60vh' : '80vh'} - 80px);`}
			>
				<div class="flex flex-col items-center gap-6 md:flex-row md:justify-between md:gap-8">
					<PeopleBoard
						images={innerWidth < 600 ? data.images.slice(0, data.images.length - 11) : data.images}
					/>
				</div>
			</section>
		{:else}
			<!-- Initial placeholder to prevent layout shift -->
			<div class="hero-placeholder"></div>
		{/if}
	</div>

	<div>
		{#if loaded}
			<section
				class="py-8 md:py-16"
				in:fly={getTransition(0)}
				style="min-height: calc(80vh - 80px);"
			>
				<div class="flex flex-col items-center gap-6 md:flex-row md:justify-between md:gap-8">
					<div class="max-w-xl text-center md:text-left">
						<h1
							class="mb-4 bg-gradient-to-r from-gray-800 to-indigo-800 bg-clip-text text-4xl font-bold text-transparent md:mb-6 md:text-5xl lg:text-6xl"
						>
							9takes, <br /> what is your take on life?
						</h1>
						<p class="mb-2 mt-4 text-lg md:text-lg lg:text-xl">
							Ask questions and understand your and other people's takes across different
							situations.
						</p>
						<h2 class="mb-4 text-lg font-medium text-gray-600 md:mb-6 md:text-xl lg:text-2xl">
							Use the Enneagram, to reveal your core fears and motivations.
						</h2>
						<div class="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
							<!-- {#if innerWidth >= 768}
								<button class="order-2 text-nowrap rounded-lg px-6 py-3 sm:order-1 bg-gray-100 border border-gray-200 text-gray-800 font-semibold hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-800 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
									Learn More ↓
								</button>
							{/if} -->
							<a
								class="btn-primary order-1 w-full rounded-lg bg-indigo-600 px-6 py-3 font-semibold !text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:!text-indigo-600 hover:shadow-md sm:order-2 sm:w-auto"
								href="/questions"
							>
								Ask a Question {innerWidth <= 768 ? '↓' : '→'}
							</a>
						</div>
					</div>

					<div class="mt-6 w-full md:mt-0 md:w-1/2">
						<div
							class="h-auto rounded-xl border border-gray-200 bg-white/70 p-6 shadow-md backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
							style="min-height: {questionListHeight};"
						>
							<h3 class="mb-4 mt-0 pt-0 text-xl font-semibold">Latest Questions</h3>
							<div class="min-h-[200px] md:min-h-[400px]">
								{#each data?.top9Questions || [] as questionData}
									<QuestionItem {questionData} showDetails={true} />
								{:else}
									{#each Array(3) as _}
										<div
											class="mb-4 flex h-16 flex-col justify-between rounded-lg border border-gray-200 bg-white p-2"
										>
											<div
												class="h-4 w-full rounded bg-gradient-to-r from-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"
											></div>
											<div
												class="h-3.5 w-[30%] self-end rounded bg-gradient-to-r from-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"
											></div>
										</div>
									{/each}
								{/each}
							</div>
						</div>
					</div>
				</div>
			</section>
		{:else}
			<!-- Initial placeholder to prevent layout shift -->
			<div class="hero-placeholder"></div>
		{/if}
	</div>

	<!-- How it Works Section -->
	<div class="section-observer" data-section-index="1">
		{#if sectionsVisible[1] || !browser}
			<section class="py-8 md:py-16" in:fly={getTransition(1)}>
				<h2 class="mb-8 text-center text-3xl font-bold md:mb-12 md:text-4xl">How 9takes Works</h2>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
					{#each steps as { emoji, title, description }}
						<div
							class="rounded-lg border border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
						>
							<div class="mb-2 inline-block text-4xl">{emoji}</div>
							<h3 class="mb-2 text-lg font-semibold text-indigo-800 md:text-xl">{title}</h3>
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
				class="overflow-hidden rounded-xl bg-gradient-to-br from-indigo-800 to-gray-800 p-8 text-white shadow-lg"
				in:fly={getTransition(2)}
			>
				<h2 class="mb-6 text-center text-3xl font-bold md:mb-8 md:text-4xl">Why the Enneagram?</h2>
				<div class="mx-auto max-w-3xl pb-6 text-center">
					<p class="mb-4 text-lg text-white/90 md:text-xl">
						The Enneagram has a nine personality type model and is based on emotions. <br />This
						makes understanding yourself and others approachable.
					</p>

					<div class="text-center">
						<p class="mb-4 text-lg font-extrabold tracking-wider md:text-xl">
							The Enneagram symbol describes how each type is connected and is deceptively deep.
						</p>
					</div>
					<EnneagramDiagram />
					<!-- <div class="grid grid-cols-3 gap-2 md:gap-4">
						{#each Array(9) as _, i}
							<a class="block border border-white/20 bg-white/10 rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15 hover:shadow-md hover:border-white/30" href={`/enneagram-corner/enneagram-type-${i + 1}`}>
								<div class="h-16 flex items-center justify-center">
									<span class="text-xl font-bold md:text-2xl">Type {i + 1}</span>
								</div>
							</a>
						{/each}
					</div> -->
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
							class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
						>
							<h3 class="mb-3 text-lg font-semibold text-indigo-800 md:mb-4 md:text-xl">{title}</h3>
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
					class="mb-16 rounded-xl border border-gray-200 bg-gradient-to-r from-indigo-100 to-white p-8 text-center shadow-md md:mb-24"
					in:fly={getTransition(4)}
				>
					<h2 class="mb-4 text-3xl font-bold text-indigo-800 md:mb-6 md:text-4xl">
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

	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(calc(-1 * var(--marquee-width) - 1rem));
		}
	}

	.animate-shimmer {
		animation: shimmer 1.5s infinite;
	}

	.animate-scroll {
		animation: scroll 30s linear infinite;
	}

	.animate-paused {
		animation-play-state: paused;
	}

	/* Accessibility */
	@media (prefers-reduced-motion: reduce) {
		.animate-scroll {
			animation: none;
		}

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
