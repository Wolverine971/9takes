<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	import QuestionItem from '$lib/components/questions/QuestionItem.svelte';
	import EnneagramDiagram from '$lib/components/blog/EnneagramDiagram.svelte';

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
	<!-- Hero Section - Updated classes for consistent styling -->
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
						<p class=" !text-lg md:mb-6 md:text-lg lg:text-xl" style="    margin: 1rem 0 0.5rem;">
							Make sense of your personal problems by getting <br />9 perspectives on the situation
							(via the Enneagram).
						</p>
						<h2 class="mb-4 text-lg font-medium text-gray-600 md:mb-6 md:text-xl lg:text-2xl">
							Ask and answer questions <span class="highlight">anonymously</span> in our open forum.
						</h2>
						<div class="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
							<!-- {#if innerWidth >= 768}
								<button class="btn-secondary order-2 text-nowrap rounded-lg px-6 py-3 sm:order-1">
									Learn More ↓
								</button>
							{/if} -->
							<button class="btn-primary order-1 w-full rounded-lg px-6 py-3 sm:order-2 sm:w-auto">
								Ask a Question {innerWidth <= 768 ? '↓' : '→'}
							</button>
						</div>
					</div>

					<div class="mt-6 w-full md:mt-0 md:w-1/2">
						<!-- Updated glass-area class to match new styling -->
						<div
							class="glass-area question-container h-auto"
							style="min-height: {questionListHeight};"
						>
							<h3 class="!mt-0 mb-4 !pt-0 text-xl font-semibold">Latest Questions</h3>
							<div class="question-list">
								{#each data?.top9Questions || [] as questionData}
									<QuestionItem {questionData} showDetails={true} />
								{:else}
									<!-- Updated skeleton loader styling -->
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

	<!-- How it Works - Updated to use step-card for consistent styling -->
	<div class="section-wrapper">
		{#if sectionsVisible[1] || !browser}
			<section class="how-it-works py-8 md:py-16" in:fly={getTransition(1)}>
				<h2 class="mb-8 text-center text-3xl font-bold md:mb-12 md:text-4xl">How 9takes Works</h2>
				<div class="steps-container">
					{#each steps as { emoji, title, description }}
						<div class="step-card">
							<div class="emoji">{emoji}</div>
							<h3 class="mb-2 text-lg font-semibold md:text-xl">{title}</h3>
							<p class="text-gray-600">{description}</p>
						</div>
					{/each}
				</div>
			</section>
		{/if}
	</div>

	<!-- Nine Types Section - Updated to use new dark-section styling -->
	<div class="section-wrapper">
		{#if sectionsVisible[2] || !browser}
			<section class="dark-section" in:fly={getTransition(2)}>
				<h2 class="mb-6 text-center text-3xl font-bold md:mb-8 md:text-4xl">Why the Enneagram?</h2>
				<div class="mx-auto max-w-3xl text-center" style="padding-bottom: 1.5rem;">
					<p class="mb-4 text-lg md:text-xl">
						The Enneagram has a nine personality type model and is based on emotions. <br />This
						makes understanding yourself and others approachable.
					</p>

					<div class=" text-center">
						<p class="mb-4 text-lg font-extrabold tracking-wider md:text-xl">
							The Enneagram symbol describes how each type is connected and is deceptively deep.
						</p>
					</div>
					<EnneagramDiagram />
					<!-- <div class="grid grid-cols-3 gap-2 md:gap-4">
						{#each Array(9) as _, i}
							<a class="enneagram-link" href={`/enneagram-corner/enneagram-type-${i + 1}`}>
								<div class="type-box">
									<span class="text-xl font-bold md:text-2xl">Type {i + 1}</span>
								</div>
							</a>
						{/each}
					</div> -->
				</div>
			</section>
		{/if}
	</div>

	<!-- Benefits Section - Updated with benefit-card styling -->
	<div class="section-wrapper">
		{#if sectionsVisible[3] || !browser}
			<section class="benefits-section py-8 md:py-16" in:fly={getTransition(3)}>
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

	<!-- Personality Analysis CTA - Updated with consistent styling -->
	<div class="section-wrapper my-16 md:my-24">
		<section class="personality-cta mx-auto max-w-6xl">
			<div class="mx-auto mb-6 max-w-3xl text-center md:mb-8">
				<h2 class="mb-2 text-xl font-bold md:mb-3 md:text-2xl lg:text-3xl">
					Learn Your Type By Exploring the Types of Others
				</h2>
				<p class="text-base text-gray-600 md:text-lg">
					Our database of celebrity personalities is ever growing. And we welcome your feedback.
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
								<a href="/personality-analysis/{slug}" class="personality-card">
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
										</div>
									</div>
									<p class="personality-name">
										{name}
									</p>
									<p class="personality-type">Type {type}</p>
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
					class="explore-btn btn-primary inline-flex items-center justify-center"
				>
					Explore All Personalities →
				</a>
			</div>
		</section>
	</div>

	<!-- CTA Section - Updated with cta-section styling -->
	{#if !data?.session?.user}
		<div class="section-wrapper">
			{#if sectionsVisible[4] || !browser}
				<section class="cta-section mb-16 text-center md:mb-24" in:fly={getTransition(4)}>
					<h2 class="mb-4 text-3xl font-bold md:mb-6 md:text-4xl">
						Ready to Gain New Perspectives?
					</h2>
					<p class="mb-6 text-lg text-gray-600 md:mb-8 md:text-xl">
						Join our community and start seeing conflicts from all angles.
					</p>
					<div class="email-signup-form">
						<EmailSignup cta="Get Started Now →" />
					</div>
				</section>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	:root {
		/* Primary Colors */
		--primary: #6c5ce7; /* Main purple - more vibrant than original */
		--primary-dark: #4834d4; /* Darker purple for hover states and headers */
		--primary-light: #a29bfe; /* Light purple for backgrounds and accents */

		/* Accent Colors */
		--accent: #8c7ae6; /* Softer purple for secondary elements */
		--accent-dark: #7158e2; /* Slightly darker accent for contrast */
		--accent-light: #e9e4ff; /* Very light purple for subtle highlights */

		/* Neutrals */
		--white: #ffffff;
		--off-white: #f9f9ff; /* Slightly purplish white for backgrounds */
		--lightest-gray: #f0f2f5; /* Very light gray for card backgrounds */
		--light-gray: #e4e6eb; /* Light gray for borders */
		--medium-gray: #c1c5d0; /* Medium gray for disabled states */
		--dark-gray: #65676b; /* Dark gray for secondary text */
		--darkest-gray: #2a2d34; /* Very dark gray for primary text */
		--black: #18191a; /* Off-black for stronger text */

		/* Functional Colors */
		--success: #00b894; /* Teal green for success messages */
		--warning: #fdcb6e; /* Soft yellow for warnings */
		--error: #e84393; /* Pink/purple for errors - matches theme */
		--info: #74b9ff; /* Soft blue for information */

		/* Text Colors */
		--text-primary: #2d3436; /* Main text color - almost black but softer */
		--text-secondary: #636e72; /* Secondary text - medium gray */
		--text-tertiary: #b2bec3; /* Tertiary text - lighter gray */
		--text-on-primary: #ffffff; /* Text on primary colored backgrounds */

		/* Updated Component Specific */
		--background-color: #f7f7ff; /* Very light purple tint for body - updated */
		--card-background: #ffffff;
		--shadow-color: rgba(108, 92, 231, 0.1); /* Purple-tinted shadows - updated */

		/* Shadows */
		--shadow-sm: 0 1px 3px rgba(108, 92, 231, 0.08);
		--shadow-md: 0 4px 6px rgba(108, 92, 231, 0.1);
		--shadow-lg: 0 10px 15px rgba(108, 92, 231, 0.1);

		/* Layout */
		--border-radius: 0.5rem; /* Slightly increased for modern look */
		--border-radius-lg: 0.75rem;
		--border-radius-sm: 0.25rem;

		/* Keep existing layout variables */
		--spacing-xs: 0.25rem;
		--spacing-sm: 0.5rem;
		--spacing-md: 1rem;
		--spacing-lg: 1.5rem;
		--spacing-xl: 2rem;
	}

	/* Page Background */
	body {
		background-color: var(--background-color);
		color: var(--text-primary);
		font-family:
			'Inter',
			-apple-system,
			BlinkMacSystemFont,
			sans-serif;
		line-height: 1.5;
	}

	/* Main Container */
	.main-container {
		width: 100%;
		max-width: 1440px;
		margin: 0 auto;
		padding: 0 var(--spacing-md);
		display: flex;
		flex-direction: column;
	}

	/* Typography Enhancements */
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		color: var(--darkest-gray);
		font-weight: 600;
	}

	h1 {
		font-size: 2.5rem;
		line-height: 1.2;

		@media (min-width: 768px) {
			font-size: 3rem;
		}
	}

	/* Links */
	a {
		color: var(--primary);
		transition: color 0.2s ease;

		&:hover {
			color: var(--primary-dark);
			text-decoration: none;
		}
	}

	/* Hero Section Updates */
	.hero {
		position: relative;
		padding: 2rem 0;
		overflow: hidden;

		h1 {
			font-weight: 700;

			/* Add subtle gradient accent to header */
			background: linear-gradient(90deg, var(--darkest-gray) 0%, var(--primary-dark) 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
		}

		h2 {
			color: var(--text-secondary);
			font-weight: 500;
		}
	}

	/* Updated Button Styles */
	.btn-primary {
		font-weight: 600;
		border-radius: var(--border-radius);
		transition: all 0.2s ease;
		border: none;
		padding: 0.75rem 1.5rem;

		&:hover {
			background: var(--primary-dark);
			transform: translateY(-2px);
			box-shadow: var(--shadow-md);
		}

		&:active {
			transform: translateY(0);
		}
	}

	.btn-secondary {
		background: var(--off-white);
		border: 1px solid var(--light-gray);
		color: var(--darkest-gray);
		font-weight: 600;
		border-radius: var(--border-radius);
		transition: all 0.2s ease;
		padding: 0.75rem 1.5rem;

		&:hover {
			background: var(--accent-light);
			border-color: var(--accent);
			color: var(--primary-dark);
			transform: translateY(-2px);
		}

		&:active {
			transform: translateY(0);
		}
	}

	/* Glass Effect Areas */
	.glass-area {
		background: rgba(255, 255, 255, 0.7);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border-radius: var(--border-radius-lg);
		padding: var(--spacing-lg);
		box-shadow: var(--shadow-md);
		border: 1px solid var(--light-gray);
		transition: all 0.2s ease;
		will-change: transform, box-shadow;

		&:hover {
			transform: translateY(-2px);
			box-shadow: var(--shadow-lg);
		}
	}

	/* Question List Card */
	.question-list {
		min-height: 200px;

		@media (min-width: 768px) {
			min-height: 400px;
		}
	}

	/* How It Works Section */
	.steps-container {
		display: grid;
		gap: var(--spacing-md);

		@media (min-width: 768px) {
			grid-template-columns: repeat(3, 1fr);
			gap: var(--spacing-lg);
		}
	}

	.step-card {
		background: var(--white);
		border-radius: var(--border-radius);
		border: 1px solid var(--light-gray);
		padding: var(--spacing-lg);
		text-align: center;
		transition: all 0.3s ease;

		&:hover {
			transform: translateY(-3px);
			box-shadow: var(--shadow-md);
			border-color: var(--accent-light);
		}

		.emoji {
			font-size: 2rem;
			margin-bottom: var(--spacing-sm);
			display: inline-block;
		}

		h3 {
			color: var(--primary-dark);
			margin-bottom: var(--spacing-xs);
		}

		p {
			color: var(--text-secondary);
		}
	}

	/* Dark Section Modernized */
	.dark-section {
		background: linear-gradient(135deg, var(--primary-dark) 0%, var(--darkest-gray) 100%);
		color: white;
		border-radius: var(--border-radius-lg);
		overflow: hidden;
		box-shadow: var(--shadow-lg);
		padding: var(--spacing-xl);

		h2 {
			color: white;
		}

		p {
			color: rgba(255, 255, 255, 0.9);
		}

		.type-box {
			border: 1px solid rgba(255, 255, 255, 0.2);
			background: rgba(255, 255, 255, 0.1);
			border-radius: var(--border-radius);
			transition: all 0.3s ease;
			will-change: transform, background-color;
			height: 4rem;
			display: flex;
			align-items: center;
			justify-content: center;

			&:hover {
				transform: translateY(-3px);
				background: rgba(255, 255, 255, 0.15);
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
				border-color: rgba(255, 255, 255, 0.3);
			}

			span {
				font-weight: 600;
			}
		}
	}

	/* Personality Marquee */
	.personality-cta {
		background: var(--white);
		border-radius: var(--border-radius-lg);
		box-shadow: var(--shadow-lg);
		border: 1px solid var(--light-gray);
		padding: var(--spacing-xl);

		h2 {
			color: var(--darkest-gray);
		}

		p {
			color: var(--text-secondary);
		}
	}

	.marquee-outer {
		overflow: hidden;
		width: 100%;
		border-radius: var(--border-radius);
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
		animation: scroll 30s linear infinite;
		will-change: transform;

		&.paused {
			animation-play-state: paused;
		}
	}

	.personality-card {
		min-width: 100px;
		max-width: 120px;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--spacing-sm);
		transition: all 0.3s ease;
		position: relative;
		border-radius: var(--border-radius);
		background: var(--off-white);
		border: 1px solid transparent;

		@media (min-width: 768px) {
			min-width: 140px;
			max-width: 160px;
			padding: var(--spacing-md);
		}

		img {
			box-shadow: var(--shadow-sm);
			border: 2px solid white;
			transform: translateZ(0); /* Force GPU rendering */
		}

		&:hover {
			transform: scale(1.05);
			border-color: var(--accent-light);
			background: white;
			box-shadow: var(--shadow-md);

			img {
				border-color: var(--accent-light);
			}
		}

		p {
			margin: var(--spacing-xs) 0;

			&:last-child {
				color: var(--primary);
				font-weight: 600;
			}
		}
	}

	/* Benefit Cards */
	.benefit-card {
		background: white;
		border: 1px solid var(--light-gray);
		border-radius: var(--border-radius);
		padding: var(--spacing-lg);
		box-shadow: var(--shadow-sm);
		transition: all 0.3s ease;
		will-change: transform, box-shadow;

		&:hover {
			transform: translateY(-3px);
			box-shadow: var(--shadow-md);
			border-color: var(--accent-light);
		}

		h3 {
			color: var(--primary-dark);
			font-weight: 600;
			margin-bottom: var(--spacing-sm);
		}

		p {
			color: var(--text-secondary);
		}
	}

	/* CTA Section */
	.cta-section {
		background: linear-gradient(135deg, var(--accent-light) 0%, white 100%);
		border-radius: var(--border-radius-lg);
		padding: var(--spacing-xl);
		text-align: center;
		border: 1px solid var(--light-gray);
		box-shadow: var(--shadow-md);

		h2 {
			color: var(--primary-dark);
			margin-bottom: var(--spacing-md);
		}

		p {
			color: var(--text-secondary);
			margin-bottom: var(--spacing-lg);
			font-size: 1.1rem;
		}
	}

	/* Email Signup Form */
	.email-signup-form {
		max-width: 500px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);

		@media (min-width: 640px) {
			flex-direction: row;
		}

		input {
			flex: 1;
			padding: 0.75rem 1rem;
			border: 1px solid var(--light-gray);
			border-radius: var(--border-radius);
			font-size: 1rem;

			&:focus {
				outline: none;
				border-color: var(--primary);
				box-shadow: 0 0 0 2px var(--accent-light);
			}
		}

		button {
			background: var(--primary);
			color: white;
			font-weight: 600;
			padding: 0.75rem 1.5rem;
			border: none;
			border-radius: var(--border-radius);
			cursor: pointer;
			white-space: nowrap;
			transition: all 0.2s ease;

			&:hover {
				background: var(--primary-dark);
				transform: translateY(-2px);
				box-shadow: var(--shadow-md);
			}

			&:active {
				transform: translateY(0);
			}
		}
	}

	/* Animations */
	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(calc(-1 * var(--marquee-width) - 1rem));
		}
	}

	/* Skeleton Loaders */
	.skeleton {
		background: linear-gradient(
			90deg,
			var(--lightest-gray) 0%,
			var(--light-gray) 50%,
			var(--lightest-gray) 100%
		);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
		border-radius: var(--border-radius-sm);
	}

	.skeleton-question-item {
		height: 4rem;
		margin-bottom: var(--spacing-md);
		padding: var(--spacing-sm);
		background-color: white;
		border-radius: var(--border-radius);
		border: 1px solid var(--light-gray);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.skeleton-text {
		height: 1rem;
		width: 100%;
		background: linear-gradient(
			90deg,
			var(--lightest-gray) 0%,
			var(--light-gray) 50%,
			var(--lightest-gray) 100%
		);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
		border-radius: var(--border-radius-sm);
		margin-bottom: var(--spacing-sm);
	}

	.skeleton-meta {
		height: 0.875rem;
		width: 30%;
		background: linear-gradient(
			90deg,
			var(--lightest-gray) 0%,
			var(--light-gray) 50%,
			var(--lightest-gray) 100%
		);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
		border-radius: var(--border-radius-sm);
		align-self: flex-end;
	}

	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.hero-content {
			text-align: center;
			padding: var(--spacing-sm);
		}

		.section-wrapper {
			margin-bottom: var(--spacing-lg);
		}

		h1 {
			font-size: 2rem;
		}

		h2 {
			font-size: 1.5rem;
		}
	}

	/* Accessibility */
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

		* {
			transition-duration: 0.001ms !important;
			animation-duration: 0.001ms !important;
		}
	}
</style>
