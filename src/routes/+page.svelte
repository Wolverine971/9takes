<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import type { PageData } from './$types';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	import QuestionItem from '$lib/components/questions/QuestionItem.svelte';

	export let data: PageData;
	let innerWidth = 0;

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

	// Structured data for Google
	const structuredData = null;
	// JSON.stringify({
	// 	'@context': 'https://schema.org',
	// 	'@type': 'WebSite',
	// 	name: siteName,
	// 	url: domain,
	// 	description: metaDescription,
	// 	potentialAction: {
	// 		'@type': 'SearchAction',
	// 		target: `${domain}/search?q={search_term_string}`,
	// 		'query-input': 'required name=search_term_string'
	// 	}
	// });

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

	let sectionsVisible = Array(5).fill(false);
	let marqueeWidth: number;
	let isHovering = false;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				requestAnimationFrame(() => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							const index = parseInt(entry.target.dataset.index);
							sectionsVisible[index] = true;
						}
					});
				});
			},
			{
				threshold: 0.2,
				rootMargin: '50px'
			}
		);

		document.querySelectorAll('.section-wrapper').forEach((section, index) => {
			section.dataset.index = index.toString();
			observer.observe(section);
		});

		const calculateWidth = () => {
			const card = document.querySelector('.personality-card');
			if (card) {
				const cardWidth = card.offsetWidth;
				marqueeWidth = Math.ceil(personalities.length * (cardWidth + 32)); // Include gap
			}
		};
		calculateWidth();
		window.addEventListener('resize', calculateWidth, { passive: true });

		return () => window.removeEventListener('resize', calculateWidth);
	});

	function getTransition(index: number) {
		const duration = 800;
		const delay = 200;
		return index % 2 === 0 ? { x: -50, duration, delay } : { x: 50, duration, delay };
	}

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
			description: 'See how different personality types approach your situation differently.'
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
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={metaDescription} />
	<meta name="keywords" content={keywords} />
	<meta name="robots" content="index, follow" />
	<meta name="language" content="English" />
	<meta name="author" content={siteName} />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

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

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={twitterHandle} />
	<meta name="twitter:creator" content={twitterHandle} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={metaDescription} />
	<meta name="twitter:image" content={ogImage} />
	<meta name="twitter:image:alt" content="9takes - Open Source Your Conflict Resolution" />

	<!-- Structured Data -->
	{#if structuredData}
		<script type="application/ld+json">
		{JSON.stringify(structuredData)}
		</script>
	{/if}

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

<!-- Hero Section -->
<div class="section-wrapper">
	{#if sectionsVisible[0]}
		<section class="hero min-h-screen py-12 md:py-24" in:fly={getTransition(0)}>
			<div class="hero-content flex flex-col items-center gap-8 md:flex-row md:justify-between">
				<div class="max-w-xl">
					<h1 class="mb-6 text-5xl font-bold md:text-6xl">
						9takes, <br /> Open Source Conflict Resolution
					</h1>
					<h2 class="mb-6 text-xl font-medium text-gray-600 md:text-2xl">
						Understand any conflict from 9 unique perspectives.<br />
						Ask questions. Get unbiased feedback. Find clarity.
					</h2>
					<div class="flex gap-4" style="">
						{#if innerWidth >= 768}
							<button class="btn-secondary text-nowrap rounded-lg px-6 py-3 md:block">
								Learn More ↓
							</button>
						{/if}
						<button class="btn-primary rounded-lg px-6 py-3" style="width: 100%;">
							Ask a Question {innerWidth <= 768 ? '↓' : '→'}
						</button>
					</div>
				</div>
				<div class="w-full md:w-1/2">
					<div class="glass-area">
						<h3 class="!mt-0 mb-4 !pt-0 text-xl font-semibold">Latest Questions</h3>
						<div class="question-list">
							{#each data?.top9Questions || [] as questionData}
								<QuestionItem {questionData} showDetails={true} />
							{/each}
						</div>
					</div>
				</div>
			</div>
		</section>
	{/if}
</div>

<!-- How it Works -->
<div class="section-wrapper">
	{#if sectionsVisible[1]}
		<section class="py-12 md:py-24" in:fly={getTransition(1)}>
			<h2 class="mb-12 text-center text-4xl font-bold">How 9takes Works</h2>
			<div class="grid gap-8 md:grid-cols-3">
				{#each steps as { emoji, title, description }}
					<div class="glass-area">
						<div class="mb-4 text-3xl">{emoji}</div>
						<h3 class="mb-2 text-xl font-semibold">{title}</h3>
						<p class="text-gray-600">{description}</p>
					</div>
				{/each}
			</div>
		</section>
	{/if}
</div>

<!-- Nine Types Section -->
<div class="section-wrapper">
	{#if sectionsVisible[2]}
		<section class="dark-section rounded-lg p-12" in:fly={getTransition(2)}>
			<h2 class="mb-8 text-center text-4xl font-bold">Why 9takes?</h2>
			<div class="mx-auto max-w-3xl text-center" style="padding-bottom: 2rem;">
				<p class="mb-6 text-xl">
					Based on the Enneagram's nine personality types, 9takes ensures you get a complete picture
					of any situation.
				</p>
				<div class="grid grid-cols-3 gap-4">
					{#each Array(9) as _, i}
						<a class="text-2xl font-bold" href={`/enneagram-corner/enneagram-type-${i + 1}`}>
							<div class="type-box flex h-24 items-center justify-center rounded-lg">
								<span class="text-2xl font-bold">Type {i + 1}</span>
							</div>
						</a>
					{/each}
				</div>
			</div>
		</section>
	{/if}
</div>

<!-- Personality Analysis CTA -->
<div class="section-wrapper my-24">
	<section
		class="personality-cta mx-auto max-w-6xl rounded-xl bg-white !p-6 pb-2 shadow-xl md:p-12"
	>
		<div class="mx-auto mb-8 max-w-3xl text-center">
			<h2 class="mb-3 text-2xl font-bold md:text-3xl">Learn Your Type Through Famous People</h2>
			<p class="text-lg text-gray-600">
				Explore personalities you relate to—the natural way to discover your type.
			</p>
		</div>

		<div class="marquee-outer my-12">
			<div
				class="marquee-container"
				style="--marquee-width: {Math.ceil(marqueeWidth)}px;"
				on:mouseenter={() => (isHovering = true)}
				on:mouseleave={() => (isHovering = false)}
			>
				<div class="marquee" class:paused={isHovering}>
					{#each [...personalities, ...personalities] as { name, type, slug }}
						<a href="/personality-analysis/{slug}" class="personality-card group">
							<div class="flex flex-col items-center items-center justify-center">
								<img
									src="/types/{type}s/{slug}.webp"
									alt={name}
									width="144"
									height="144"
									class="h-28 w-28 rounded-full object-cover md:h-36 md:w-36"
									loading="lazy"
									decoding="async"
								/>
								<div
									class="absolute inset-0 rounded-full group-hover:ring-2 group-hover:ring-purple-500/50"
								></div>
							</div>
							<p class="m-3 p-2 text-center text-sm font-medium text-gray-900 md:text-base">
								{name}
							</p>
							<p class="!mb-0 !mt-auto text-xs text-purple-600 md:text-sm">Type {type}</p>
						</a>
					{/each}
				</div>
			</div>
		</div>

		<div class="mt-8 text-center">
			<a
				href="/personality-analysis"
				class="inline-flex items-center justify-center rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-gray-800 md:text-base"
			>
				Explore All Personalities →
			</a>
		</div>
	</section>
</div>

<!-- Benefits Section -->
<div class="section-wrapper">
	{#if sectionsVisible[3]}
		<section class="py-12 md:py-24" in:fly={getTransition(3)}>
			<h2 class="mb-12 text-center text-4xl font-bold">Why It Works</h2>
			<div class="grid gap-8 md:grid-cols-2">
				{#each benefits as { title, description }}
					<div class="benefit-card">
						<h3 class="mb-4 text-xl font-semibold">{title}</h3>
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
		{#if sectionsVisible[4]}
			<section class="glass-area mb-24 text-center" in:fly={getTransition(4)}>
				<h2 class="mb-6 text-4xl font-bold">Ready to Gain New Perspectives?</h2>
				<p class="mb-8 text-xl text-gray-600">
					Join our community and start seeing conflicts from all angles.
				</p>
				<EmailSignup cta="Get Started Now →" />
			</section>
		{/if}
	</div>
{/if}

<style lang="scss">
	:root {
		--background-color: #f5f5f7;
		--card-background: #ffffff;
		--shadow-color: rgba(0, 0, 0, 0.1);
		--primary-dark: #1a202c;
	}

	img {
		aspect-ratio: 1;
	}

	.section-wrapper {
		container-type: inline-size;
	}

	@container (min-width: 768px) {
		.type-box {
			font-size: 1.25rem;
		}
	}

	.section {
		@apply min-h-[400px] md:min-h-[600px];
	}

	.question-list {
		@apply min-h-[200px] md:min-h-[400px];
	}

	img {
		@apply aspect-square;
	}

	.skeleton {
		@apply animate-pulse rounded bg-gray-200;
	}

	.skeleton-text {
		@apply skeleton h-4 w-3/4;
	}

	.glass-area {
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(10px);
		border-radius: 1rem;
		padding: 1.5rem;
		box-shadow: 0 4px 6px var(--shadow-color);
	}

	.personality-card {
		@apply flex min-w-[120px] flex-col items-center p-3 transition-all duration-300 md:min-w-[160px];
		aspect-ratio: 1;
		container-type: inline-size;

		img {
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		}
	}

	.marquee-outer {
		overflow: hidden;
	}

	.marquee-container {
		@apply relative overflow-hidden;
		-webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
		mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
	}

	.marquee-container::before,
	.marquee-container::after {
		content: '';
		position: absolute;
		top: 0;
		width: 10rem;
		height: 100%;
		z-index: 1;
		pointer-events: none;
	}

	.marquee-container::before {
		left: 0;
		background: linear-gradient(to right, white, transparent);
	}

	.marquee-container::after {
		right: 0;
		background: linear-gradient(to left, white, transparent);
	}

	.marquee {
		display: flex;
		gap: 2rem;
		padding: 1rem;
		animation: scroll 40s linear infinite;

		&.paused {
			animation-play-state: paused;
		}
	}

	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(calc(-1 * var(--marquee-width) - 2rem));
		}
	}

	.personality-card {
		@apply w-[140px] p-2 md:w-[180px] md:p-3;

		img {
			@apply mx-auto h-24 w-24 md:h-32 md:w-32;
			aspect-ratio: 1;
		}

		&:hover {
			transform: scale(1.05);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee {
			animation: none;
		}
	}

	.dark-section {
		background: var(--primary-dark);
		color: white;

		.type-box {
			border: 1px solid rgba(255, 255, 255, 0.2);
			background: rgba(255, 255, 255, 0.1);
			transition: transform 0.3s ease;

			&:hover {
				transform: translateY(-5px);
			}
		}
	}

	.benefit-card {
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		padding: 1.5rem;
		transition: transform 0.3s ease;

		&:hover {
			transform: translateY(-5px);
		}
	}

	.btn-primary {
		background: var(--primary-dark);
		color: white;
		transition: background-color 0.3s ease;

		&:hover {
			background: black;
		}
	}

	.btn-secondary {
		border: 1px solid var(--primary-dark);
		color: var(--primary-dark);
		transition: background-color 0.3s ease;

		&:hover {
			background: #f3f4f6;
		}
	}

	@media (max-width: 768px) {
		.hero-content {
			text-align: center;
		}

		h1 {
			font-size: 2.5rem;
		}

		h2 {
			font-size: 1.5rem;
		}
	}
</style>
