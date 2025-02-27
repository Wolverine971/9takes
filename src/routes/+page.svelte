<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	import QuestionItem from '$lib/components/questions/QuestionItem.svelte';

	export let data: PageData;
	let innerWidth = 0;
	let loaded = false;
	let marqueeWidth = 0;
	let isHovering = false;
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

	let sectionsVisible = Array(5).fill(false);

	const personalities = [
		{ name: 'MrBeast', type: '8', slug: 'Mr-Beast' },
		{ name: 'Beyoncé', type: '8', slug: 'Beyonce-Knowles' },
		{ name: 'Elon Musk', type: '5', slug: 'Elon-Musk' },
		{ name: 'Kanye West', type: '7', slug: 'Kanye' },
		{ name: 'Taylor Swift', type: '3', slug: 'Taylor-Swift' },
		{ name: 'Oprah Winfrey', type: '2', slug: 'Oprah-Winfrey' },
		{ name: 'Tom Cruise', type: '3', slug: 'Tom-Cruise' },
		{ name: 'Keanu Reeves', type: '9', slug: 'Keanu-Reeves' },
		{ name: 'Barack Obama', type: '9', slug: 'Barack-Obama' }
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

	function getTransition(index) {
		const duration = 600; // Reduced from 800 for faster loading
		const delay = 150; // Reduced from 200 for faster loading
		return index % 2 === 0 ? { x: -30, duration, delay } : { x: 30, duration, delay };
	}

	function calculateMarqueeWidth() {
		if (!browser) return;

		const card = document.querySelector('.personality-card');
		if (card) {
			const cardWidth = card.offsetWidth;
			marqueeWidth = Math.ceil(personalities.length * (cardWidth + 16)); // Reduced gap for better performance
		}
	}

	function setupIntersectionObserver() {
		if (!browser) return;

		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const index = parseInt(entry.target.dataset.index || '0');
						sectionsVisible[index] = true;
					}
				});
			},
			{
				threshold: 0.1, // Reduced threshold for earlier loading
				rootMargin: '100px' // Increased margin for earlier loading
			}
		);

		document.querySelectorAll('.section-wrapper').forEach((section, index) => {
			section.setAttribute('data-index', index.toString());
			observer.observe(section);
		});
	}

	onMount(async () => {
		// Set loaded immediately to avoid FOUC (Flash of Unstyled Content)
		loaded = true;

		// Wait for next tick to ensure DOM is ready
		await tick();

		// Setup intersection observer for lazy loading sections
		setupIntersectionObserver();

		// Calculate marquee width
		calculateMarqueeWidth();

		// Add passive flag to event listener for better performance
		window.addEventListener(
			'resize',
			() => {
				innerWidth = window.innerWidth;
				calculateMarqueeWidth();
			},
			{ passive: true }
		);

		return () => {
			if (observer) observer.disconnect();
			window.removeEventListener('resize', calculateMarqueeWidth);
		};
	});
</script>

<svelte:head>
	<!-- Preconnect to domains for faster loading -->
	<link rel="preconnect" href="https://9takes.com" />

	<!-- Preload critical assets -->
	<link rel="preload" href="/greek_pantheon.png" as="image" />

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
<div class="main-container">
	<!-- Hero Section -->
	<div class="section-wrapper">
		{#if loaded}
			<section
				class="hero py-8 md:py-16"
				in:fly={getTransition(0)}
				style="min-height: calc(80vh - 80px);"
			>
				<div
					class="hero-content flex flex-col items-center gap-6 md:flex-row md:justify-between md:gap-8"
				>
					<div class="max-w-xl text-center md:text-left">
						<h1 class="mb-4 text-4xl font-bold md:mb-6 md:text-5xl lg:text-6xl">
							9takes, <br /> Open Source Conflict Resolution
						</h1>
						<h2 class="mb-4 text-lg font-medium text-gray-600 md:mb-6 md:text-xl lg:text-2xl">
							Ask and answer questions <span style="text-decoration: underline">anonymously</span
							>.<br />
							Get 9 perspectives on conflict via the Enneagram.
						</h2>
						<div class="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
							{#if innerWidth >= 768}
								<button class="btn-secondary order-2 text-nowrap rounded-lg px-6 py-3 sm:order-1">
									Learn More ↓
								</button>
							{/if}
							<button class="btn-primary order-1 w-full rounded-lg px-6 py-3 sm:order-2 sm:w-auto">
								Ask a Question {innerWidth <= 768 ? '↓' : '→'}
							</button>
						</div>
					</div>

					<div class="mt-6 w-full md:mt-0 md:w-1/2">
						<!-- Fixed height container to prevent layout shift -->
						<div class="glass-area h-auto" style="min-height: {questionListHeight};">
							<h3 class="!mt-0 mb-4 !pt-0 text-xl font-semibold">Latest Questions</h3>
							<div class="question-list">
								{#each data?.top9Questions || [] as questionData}
									<QuestionItem {questionData} showDetails={true} />
								{:else}
									<!-- Skeleton loader for questions -->
									{#each Array(3) as _}
										<div class="skeleton-question-item">
											<div class="skeleton-text"></div>
											<div class="skeleton-meta"></div>
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

	<!-- How it Works -->
	<div class="section-wrapper">
		{#if sectionsVisible[1] || !browser}
			<section class="py-8 md:py-16" in:fly={getTransition(1)}>
				<h2 class="mb-8 text-center text-3xl font-bold md:mb-12 md:text-4xl">How 9takes Works</h2>
				<div class="grid gap-6 md:grid-cols-3 md:gap-8">
					{#each steps as { emoji, title, description }}
						<div class="glass-area">
							<div class="mb-3 text-2xl md:mb-4 md:text-3xl">{emoji}</div>
							<h3 class="mb-2 text-lg font-semibold md:text-xl">{title}</h3>
							<p class="text-gray-600">{description}</p>
						</div>
					{/each}
				</div>
			</section>
		{/if}
	</div>

	<!-- Nine Types Section -->
	<div class="section-wrapper">
		{#if sectionsVisible[2] || !browser}
			<section class="dark-section rounded-lg p-6 md:p-12" in:fly={getTransition(2)}>
				<h2 class="mb-6 text-center text-3xl font-bold md:mb-8 md:text-4xl">Why the Enneagram?</h2>
				<div class="mx-auto max-w-3xl text-center" style="padding-bottom: 1.5rem;">
					<p class="mb-6 text-lg md:text-xl">
						The Enneagram has a nine personality type model and is based on emotions. <br />This
						makes understanding yourself and others approachable.
					</p>
					<div class="grid grid-cols-3 gap-2 md:gap-4">
						{#each Array(9) as _, i}
							<a class="font-bold" href={`/enneagram-corner/enneagram-type-${i + 1}`}>
								<div class="type-box flex h-16 items-center justify-center rounded-lg md:h-24">
									<span class="text-xl font-bold md:text-2xl">Type {i + 1}</span>
								</div>
							</a>
						{/each}
					</div>
				</div>
			</section>
		{/if}
	</div>

	<!-- Personality Analysis CTA -->
	<div class="section-wrapper my-16 md:my-24">
		<section
			class="personality-cta mx-auto max-w-6xl rounded-xl bg-white !p-4 pb-2 shadow-xl md:!p-6 lg:p-12"
		>
			<div class="mx-auto mb-6 max-w-3xl text-center md:mb-8">
				<h2 class="mb-2 text-xl font-bold md:mb-3 md:text-2xl lg:text-3xl">
					Learn Your Type Through Famous People
				</h2>
				<p class="text-base text-gray-600 md:text-lg">
					Explore personalities you relate to—the natural way to discover your type.
				</p>
			</div>

			{#if browser && loaded}
				<div class="marquee-outer my-8 md:my-12">
					<div
						class="marquee-container"
						style="--marquee-width: {Math.ceil(marqueeWidth)}px;"
						on:mouseenter={() => (isHovering = true)}
						on:mouseleave={() => (isHovering = false)}
					>
						<div class="marquee" class:paused={isHovering}>
							{#each [...personalities, ...personalities] as { name, type, slug }}
								<a href="/personality-analysis/{slug}" class="personality-card group">
									<div class="flex flex-col items-center justify-center">
										<div class="img-wrapper">
											<img
												src="/types/{type}s/{slug}.webp"
												alt={name}
												width="144"
												height="144"
												class="h-24 w-24 rounded-full object-cover md:h-28 md:w-28"
												loading="lazy"
												decoding="async"
											/>
											<div
												class="absolute inset-0 rounded-full group-hover:ring-2 group-hover:ring-purple-500/50"
											></div>
										</div>
									</div>
									<p
										class="m-2 p-1 text-center text-sm font-medium text-gray-900 md:m-3 md:p-2 md:text-base"
									>
										{name}
									</p>
									<p class="!mb-0 !mt-auto text-xs text-purple-600 md:text-sm">Type {type}</p>
								</a>
							{/each}
						</div>
					</div>
				</div>
			{:else}
				<!-- Static placeholder for personalities to prevent layout shift -->
				<div class="personalities-placeholder my-8 flex justify-center gap-4 md:my-12">
					{#each personalities.slice(0, 5) as _, i}
						<div class="personality-placeholder"></div>
					{/each}
				</div>
			{/if}

			<div class="mt-6 text-center md:mt-8">
				<a
					href="/personality-analysis"
					class="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-gray-800 md:px-6 md:py-3 md:text-base"
				>
					Explore All Personalities →
				</a>
			</div>
		</section>
	</div>

	<!-- Benefits Section -->
	<div class="section-wrapper">
		{#if sectionsVisible[3] || !browser}
			<section class="py-8 md:py-16" in:fly={getTransition(3)}>
				<h2 class="mb-8 text-center text-3xl font-bold md:mb-12 md:text-4xl">Why It Works</h2>
				<div class="grid gap-6 md:grid-cols-2 md:gap-8">
					{#each benefits as { title, description }}
						<div class="benefit-card">
							<h3 class="mb-3 text-lg font-semibold md:mb-4 md:text-xl">{title}</h3>
							<p class="text-gray-600">{description}</p>
						</div>
					{/each}
				</div>
			</section>
		{/if}
	</div>

	<!-- CTA Section -->
	{#if !data?.session?.user}
		<div class="section-wrapper">
			{#if sectionsVisible[4] || !browser}
				<section class="glass-area mb-16 text-center md:mb-24" in:fly={getTransition(4)}>
					<h2 class="mb-4 text-3xl font-bold md:mb-6 md:text-4xl">
						Ready to Gain New Perspectives?
					</h2>
					<p class="mb-6 text-lg text-gray-600 md:mb-8 md:text-xl">
						Join our community and start seeing conflicts from all angles.
					</p>
					<EmailSignup cta="Get Started Now →" />
				</section>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	:root {
		--background-color: #f5f5f7;
		--card-background: #ffffff;
		--shadow-color: rgba(0, 0, 0, 0.1);
		--primary-dark: #1a202c;
		/* CSS variables for consistent spacing */
		--spacing-xs: 0.25rem;
		--spacing-sm: 0.5rem;
		--spacing-md: 1rem;
		--spacing-lg: 1.5rem;
		--spacing-xl: 2rem;
	}

	/* Container sizing */
	.main-container {
		width: 100%;
		max-width: 1440px;
		margin: 0 auto;
		padding: 0 var(--spacing-md);
		display: flex;
		flex-direction: column;
	}

	/* Ensure images have proper aspect ratio to prevent layout shift */
	img {
		aspect-ratio: 1;
		object-fit: cover;
	}

	/* Image wrapper to prevent layout shift */
	.img-wrapper {
		position: relative;
		width: 6rem;
		height: 6rem;

		@media (min-width: 768px) {
			width: 7rem;
			height: 7rem;
		}
	}

	/* Section wrapper for better container queries */
	.section-wrapper {
		container-type: inline-size;
		margin-bottom: var(--spacing-xl);
	}

	@container (min-width: 768px) {
		.type-box {
			font-size: 1.25rem;
		}
	}

	/* Prevent layout shift with height */
	.hero-placeholder {
		min-height: 80vh;
		width: 100%;
	}

	/* Skeleton loaders */
	.skeleton {
		@apply animate-pulse rounded bg-gray-200;
	}

	.skeleton-question-item {
		height: 4rem;
		margin-bottom: var(--spacing-md);
		padding: var(--spacing-sm);
		background-color: rgba(0, 0, 0, 0.05);
		border-radius: 0.5rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.skeleton-text {
		height: 1rem;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.08);
		border-radius: 0.25rem;
		margin-bottom: var(--spacing-sm);
	}

	.skeleton-meta {
		height: 1rem;
		width: 30%;
		background-color: rgba(0, 0, 0, 0.08);
		border-radius: 0.25rem;
		align-self: flex-end;
	}

	.personalities-placeholder {
		display: flex;
		justify-content: center;
		gap: var(--spacing-md);
		overflow: hidden;
	}

	.personality-placeholder {
		width: 5rem;
		height: 8rem;
		background-color: rgba(0, 0, 0, 0.05);
		border-radius: 0.5rem;

		@media (min-width: 768px) {
			width: 6rem;
			height: 10rem;
		}
	}

	/* Question list fixed height */
	.question-list {
		min-height: 200px;

		@media (min-width: 768px) {
			min-height: 400px;
		}
	}

	/* Glass effect */
	.glass-area {
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px); /* Safari support */
		border-radius: 1rem;
		padding: var(--spacing-lg);
		box-shadow: 0 4px 6px var(--shadow-color);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		will-change: transform, box-shadow;

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 6px 12px var(--shadow-color);
		}
	}

	/* Personality cards with proper sizing */
	.personality-card {
		min-width: 100px;
		max-width: 120px;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--spacing-sm);
		transition: transform 0.3s ease;
		position: relative;

		@media (min-width: 768px) {
			min-width: 140px;
			max-width: 160px;
			padding: var(--spacing-md);
		}

		img {
			box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
			transform: translateZ(0); /* Force GPU rendering */
		}

		&:hover {
			transform: scale(1.05);
		}
	}

	/* Marquee optimization */
	.marquee-outer {
		overflow: hidden;
		width: 100%;
	}

	.marquee-container {
		position: relative;
		overflow: hidden;
		-webkit-mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent);
		mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent);
	}

	.marquee {
		display: flex;
		gap: 1rem;
		padding: 0.5rem;
		animation: scroll 30s linear infinite; /* Reduced from 40s for better performance */
		will-change: transform;

		&.paused {
			animation-play-state: paused;
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

	/* Accessible dark section */
	.dark-section {
		background: var(--primary-dark);
		color: white;
		overflow: hidden;

		.type-box {
			border: 1px solid rgba(255, 255, 255, 0.2);
			background: rgba(255, 255, 255, 0.1);
			transition:
				transform 0.3s ease,
				background-color 0.3s ease;
			will-change: transform, background-color;

			&:hover {
				transform: translateY(-3px);
				background: rgba(255, 255, 255, 0.15);
			}
		}
	}

	/* Benefit cards */
	.benefit-card {
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		padding: var(--spacing-lg);
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
		will-change: transform, box-shadow;

		&:hover {
			transform: translateY(-3px);
			box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
		}
	}

	/* Buttons */
	.btn-primary {
		background: var(--primary-dark);
		color: white;
		transition:
			background-color 0.2s ease,
			transform 0.2s ease;
		will-change: background-color, transform;

		&:hover {
			background: black;
			transform: translateY(-2px);
		}

		&:active {
			transform: translateY(0);
		}
	}

	.btn-secondary {
		border: 1px solid var(--primary-dark);
		color: var(--primary-dark);
		transition:
			background-color 0.2s ease,
			transform 0.2s ease;
		will-change: background-color, transform;

		&:hover {
			background: #f3f4f6;
			transform: translateY(-2px);
		}

		&:active {
			transform: translateY(0);
		}
	}

	/* Media queries for responsive design */
	@media (max-width: 768px) {
		.hero-content {
			text-align: center;
			padding: var(--spacing-sm);
		}

		.section-wrapper {
			margin-bottom: var(--spacing-lg);
		}
	}

	/* Reduce animation for users who prefer reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.marquee {
			animation: none;
		}

		.marquee-container::before,
		.marquee-container::after {
			display: none;
		}

		[in\:fly] {
			transition: none !important;
			transform: none !important;
		}
	}
</style>
