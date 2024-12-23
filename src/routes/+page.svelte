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

	let sectionsVisible = Array(5).fill(false);

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
			{ threshold: 0.2 }
		);

		document.querySelectorAll('.section-wrapper').forEach((section, index) => {
			section.dataset.index = index.toString();
			observer.observe(section);
		});
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

<main class="mx-auto max-w-7xl !px-4 sm:px-6 lg:px-8">
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
						Based on the Enneagram's nine personality types, 9takes ensures you get a complete
						picture of any situation.
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
</main>

<style lang="scss">
	:root {
		--background-color: #f5f5f7;
		--card-background: #ffffff;
		--shadow-color: rgba(0, 0, 0, 0.1);
		--primary-dark: #1a202c;
	}

	.glass-area {
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(10px);
		border-radius: 1rem;
		padding: 1.5rem;
		box-shadow: 0 4px 6px var(--shadow-color);
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
