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

	let sectionsVisible = Array(5).fill(false);
	let marqueeWidth: number;
	let isHovering = false;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const index = parseInt(entry.target.dataset.index);
						sectionsVisible[index] = true;
					}
				});
			},
			{ threshold: 0.2, rootMargin: '50px' }
		);

		document.querySelectorAll('.section-wrapper').forEach((section, index) => {
			section.dataset.index = index.toString();
			observer.observe(section);
		});

		const updateMarqueeWidth = () => {
			const card = document.querySelector('.personality-card');
			if (card) {
				marqueeWidth = Math.ceil(personalities.length * (card.offsetWidth + 32));
			}
		};

		updateMarqueeWidth();
		window.addEventListener('resize', updateMarqueeWidth);
		return () => window.removeEventListener('resize', updateMarqueeWidth);
	});

	const getTransition = (index: number) => ({
		x: index % 2 === 0 ? -50 : 50,
		duration: 800,
		delay: 200
	});
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

<main class="mx-auto max-w-7xl px-4">
	<!-- Hero Section -->
	<div class="section-wrapper">
		{#if sectionsVisible[0]}
			<section class="hero min-h-[80vh] py-12" in:fly={getTransition(0)}>
				<div class="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
					<div class="max-w-xl">
						<h1 class="mb-6 text-4xl font-bold md:text-6xl">
							9takes, <br /> Open Source Conflict Resolution
						</h1>
						<p class="mb-6 text-lg text-gray-600 md:text-xl">
							Understand any conflict from 9 unique perspectives.<br />
							Ask questions. Get unbiased feedback. Find clarity.
						</p>
						<div class="flex gap-4">
							{#if innerWidth >= 768}
								<button class="btn-outline">Learn More ↓</button>
							{/if}
							<button class="btn-primary flex-1"
								>Ask a Question {innerWidth <= 768 ? '↓' : '→'}</button
							>
						</div>
					</div>
					<div class="w-full md:w-1/2">
						<div class="card">
							<h3 class="mb-4 text-xl font-semibold">Latest Questions</h3>
							<div class="space-y-4">
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
	<div class="section-wrapper mb-32">
		{#if sectionsVisible[1]}
			<section class="py-12 md:py-24" in:fly={getTransition(1)}>
				<h2 class="mb-12 text-center text-3xl font-bold md:text-4xl">How 9takes Works</h2>
				<div class="grid gap-8 md:grid-cols-3">
					{#each steps as { emoji, title, description }}
						<div class="card">
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
	<div class="section-wrapper mb-32">
		{#if sectionsVisible[2]}
			<section class="rounded-lg bg-gray-900 px-8 py-16 text-white" in:fly={getTransition(2)}>
				<h2 class="mb-8 text-center text-3xl font-bold md:text-4xl">Why 9takes?</h2>
				<div class="mx-auto max-w-3xl text-center" style="padding-bottom: 2rem;">
					<p class="mb-10 text-xl">
						Based on the Enneagram's nine personality types, 9takes ensures you get a complete
						picture of any situation.
					</p>
					<div class="grid grid-cols-3 gap-6">
						{#each Array(9) as _, i}
							<a
								href={`/enneagram-corner/enneagram-type-${i + 1}`}
								class="type-box flex h-28 items-center justify-center rounded-lg border border-white/20 bg-white/10 transition-transform hover:-translate-y-1"
							>
								<span class="text-2xl font-bold">Type {i + 1}</span>
							</a>
						{/each}
					</div>
				</div>
			</section>
		{/if}
	</div>

	<!-- Personality Carousel -->
	<section class="card my-24">
		<div class="mx-auto mb-8 max-w-3xl text-center">
			<h2 class="mb-3 text-2xl font-bold md:text-3xl">Learn Your Type Through Famous People</h2>
			<p class="text-lg text-gray-600">
				Explore personalities you relate to—the natural way to discover your type.
			</p>
		</div>

		<div
			class="marquee-container my-12"
			style="--marquee-width: {Math.ceil(marqueeWidth)}px;"
			on:mouseenter={() => (isHovering = true)}
			on:mouseleave={() => (isHovering = false)}
		>
			<div class="marquee" class:paused={isHovering}>
				{#each [...personalities, ...personalities] as { name, type, slug }}
					<a href="/personality-analysis/{slug}" class="personality-card">
						<img
							src="/types/{type}s/{slug}.webp"
							alt={name}
							class="h-24 w-24 rounded-full object-cover md:h-32 md:w-32"
							loading="lazy"
							decoding="async"
						/>
						<p class="mt-3 text-center font-medium">{name}</p>
						<p class="text-sm text-purple-600">Type {type}</p>
					</a>
				{/each}
			</div>
		</div>

		<div class="text-center">
			<a href="/personality-analysis" class="btn-primary inline-block">
				Explore All Personalities →
			</a>
		</div>
	</section>

	<!-- Benefits -->
	<div class="section-wrapper">
		{#if sectionsVisible[3]}
			<section class="py-12 md:py-24" in:fly={getTransition(3)}>
				<h2 class="mb-12 text-center text-3xl font-bold md:text-4xl">Why It Works</h2>
				<div class="grid gap-8 md:grid-cols-2">
					{#each benefits as { title, description }}
						<div class="card transition-transform hover:-translate-y-1">
							<h3 class="mb-4 text-xl font-semibold">{title}</h3>
							<p class="text-gray-600">{description}</p>
						</div>
					{/each}
				</div>
			</section>
		{/if}
	</div>

	<!-- CTA -->
	{#if !data?.session?.user}
		<div class="section-wrapper">
			{#if sectionsVisible[4]}
				<section class="card mb-24 text-center" in:fly={getTransition(4)}>
					<h2 class="mb-6 text-3xl font-bold md:text-4xl">Ready to Gain New Perspectives?</h2>
					<p class="mb-8 text-xl text-gray-600">
						Join our community and start seeing conflicts from all angles.
					</p>
					<EmailSignup cta="Get Started Now →" />
				</section>
			{/if}
		</div>
	{/if}
</main>

<style lang="scss">
	:global(body) {
		background-color: #f5f5f7;
	}

	.card {
		@apply rounded-lg bg-white/80 p-6 shadow-sm backdrop-blur;
	}

	.btn-primary {
		@apply rounded-lg bg-gray-900 px-6 py-3 text-white transition-all hover:-translate-y-0.5 hover:bg-black;
	}

	.btn-outline {
		@apply rounded-lg border border-gray-900 px-6 py-3 transition-all hover:bg-gray-50;
	}

	.marquee-container {
		@apply relative overflow-hidden;
		mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
	}

	.marquee {
		@apply flex gap-8 p-4;
		animation: scroll 40s linear infinite;

		&.paused {
			animation-play-state: paused;
		}
	}

	.personality-card {
		@apply flex flex-col items-center p-2 transition-transform hover:scale-105;
		min-width: 140px;

		@media (min-width: 768px) {
			min-width: 180px;
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

	@media (prefers-reduced-motion: reduce) {
		.marquee {
			animation: none;
		}
	}
</style>
