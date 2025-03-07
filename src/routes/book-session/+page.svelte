<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { browser } from '$app/environment';
	import EnneagramDiagram from '$lib/components/blog/EnneagramDiagram.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	export let form;

	let email = form?.email || '';
	let name = form?.name || '';
	let submitted = form?.success || false;
	let loading = false;

	// SEO variables
	const siteName = '9takes';
	const title = 'Book a Personal Enneagram Coaching Session | 9takes';
	const metaDescription =
		'Transform your understanding of yourself with personalized Enneagram coaching. Join our waitlist for exclusive one-on-one sessions with certified Enneagram specialists.';
	const keywords =
		'enneagram coaching, personality coaching, self-development, personal growth, enneagram expert, type analysis, personality insights, enneagram session';
	const domain = 'https://9takes.com';
	const ogImage = 'https://9takes.com/enneagram_coaching.png'; // You may need to create this image
	const twitterHandle = '@djwayne3';
	const imageAlt = 'Book a personal Enneagram coaching session with 9takes experts';

	// Testimonials from people who had coaching sessions
	const testimonials = [
		{
			quote:
				"Understanding my Type 4 tendencies has completely changed how I approach relationships. I'm now able to recognize when I'm idealizing others and communicate my needs more effectively.",
			author: 'Jamie L.',
			type: 'Type 4'
		},
		{
			quote:
				"As a Type 8, I've always been seen as 'too intense.' My session helped me channel my natural leadership in ways that empower others rather than intimidate them.",
			author: 'Michael R.',
			type: 'Type 8'
		},
		{
			quote:
				'Learning I was a Type 9 explained so much about why I avoid conflict. My coach helped me develop strategies to stay present in difficult conversations instead of checking out.',
			author: 'Sarah T.',
			type: 'Type 9'
		}
	];

	// Benefits of Enneagram coaching
	const benefits = [
		{
			title: 'Understand Your Core Motivations',
			description:
				'Discover the unconscious drivers behind your behavior and decision-making patterns.',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>`
		},
		{
			title: 'Improve Your Relationships',
			description:
				'Learn how your type interacts with others and develop strategies for healthier connections.',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`
		},
		{
			title: 'Navigate Growth & Stress',
			description:
				'Identify your patterns during times of health and stress, and develop resilience strategies.',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`
		},
		{
			title: 'Break Free From Negative Pattern',
			description: 'Recognize and transcend the self-imposed limitations of your personality type.',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`
		}
	];

	// What happens in a coaching session
	const sessionSteps = [
		{
			number: '01',
			title: 'Type Identification/ Verification',
			description: "We'll confirm your Enneagram type with targeted questions to ensure accuracy."
		},
		{
			number: '02',
			title: 'Deep Dive Analysis',
			description: 'Explore your core fears, desires, and defense mechanisms in detail.'
		},
		{
			number: '03',
			title: 'Personal Growth Strategies',
			description:
				'Receive customized strategies to leverage your strengths and address challenges.'
		},
		{
			number: '04',
			title: 'Relationship Dynamics',
			description:
				'Learn how your type interacts with others and strategies for better connections.'
		}
	];

	// Check if the user is already signed up
	$: if (data.alreadySignedUp && !form?.success) {
		submitted = true;
	}

	// UTM params passed from the server
	$: utmParams = data.utmParams;

	onMount(() => {
		// Make all content visible immediately without animations
		// This ensures content always appears even if scroll animations fail
		if (browser) {
			// Set a small timeout to ensure DOM is fully rendered
			setTimeout(() => {
				document.querySelectorAll('.animate-on-scroll').forEach((el) => {
					el.classList.add('animate-in');
				});
			}, 100);
		}
	});
</script>

<svelte:head>
	<!-- Preconnect to domains for faster loading -->
	<link rel="preconnect" href="https://9takes.com" />

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

	<!-- Structured Data for Coaching Service -->
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Service",
			"name": "Enneagram Coaching by 9takes",
			"description": "Personalized one-on-one Enneagram coaching sessions to help you understand yourself better and improve your relationships.",
			"provider": {
				"@type": "Organization",
				"name": "9takes",
				"url": "https://9takes.com"
			},
			"serviceType": "Personality Coaching",
			"offers": {
				"@type": "Offer",
				"availability": "https://schema.org/ComingSoon",
				"price": "0",
				"priceCurrency": "USD"
			}
		}
	</script>

	<!-- Links -->
	<link rel="canonical" href={domain + '/book-session'} />
	<link rel="alternate" href={domain + '/book-session'} hreflang="x-default" />
	<link rel="alternate" href={domain + '/book-session'} hreflang="en" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={domain + '/book-session'} />
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
	<meta name="twitter:image:alt" content={imageAlt} />

	<!-- Additional SEO Tags -->
	<meta name="theme-color" content="#6c5ce7" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />
	<meta name="apple-mobile-web-app-title" content={siteName} />

	<!-- Mobile Specific -->
	<meta name="format-detection" content="telephone=no" />
	<meta name="mobile-web-app-capable" content="yes" />
</svelte:head>

<div class="mx-auto max-w-7xl px-4">
	<!-- Hero Section -->
	<section class="py-16 md:py-20">
		<div class="flex flex-col gap-8 md:flex-row md:items-center">
			<div class="flex-1">
				<h1
					class="mb-4 bg-gradient-to-r from-gray-800 to-indigo-800 bg-clip-text text-4xl font-bold leading-tight text-transparent md:text-5xl"
				>
					Know thyself, <br /> everything else will get easier.
				</h1>
				<p class="mb-8 text-xl text-gray-600">
					Join our waitlist for one-on-one sessions with for personalized Enneagram coaching.
				</p>

				<div class="space-y-3">
					<div class="flex items-center">
						<span
							class="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-sm text-white"
							>✓</span
						>
						<span class="text-lg">60-minute sessions</span>
					</div>
					<div class="flex items-center">
						<span
							class="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-sm text-white"
							>✓</span
						>
						<span class="text-lg">Custom growth strategies for your type</span>
					</div>
					<div class="flex items-center">
						<span
							class="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-sm text-white"
							>✓</span
						>
						<span class="text-lg">Relationship insights & communication tools</span>
					</div>
				</div>
			</div>

			<div
				class="w-full rounded-2xl border border-gray-200 bg-white/80 p-8 shadow-lg backdrop-blur-md md:max-w-md"
			>
				{#if !submitted}
					<h2 class="mb-2 text-2xl font-bold text-indigo-800">Join the Waitlist</h2>
					<p class="mb-6 text-gray-600">
						Be among the first to get personalized coaching sessions.
					</p>

					<form method="POST" action="?/coachSub" class="space-y-5">
						<div>
							<label for="name" class="mb-2 block font-medium text-gray-800">Name</label>
							<input
								type="text"
								id="name"
								name="name"
								value={name}
								placeholder="Your name"
								required
								class="w-full rounded-lg border border-gray-300 p-3 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
							/>
						</div>

						<div>
							<label for="email" class="mb-2 block font-medium text-gray-800">Email</label>
							<input
								type="email"
								id="email"
								name="email"
								value={email}
								placeholder="your@email.com"
								required
								class="w-full rounded-lg border border-gray-300 p-3 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
							/>
						</div>

						<div>
							<label for="enneagramType" class="mb-2 block font-medium text-gray-800"
								>Your Enneagram Type (if known)</label
							>
							<select
								id="enneagramType"
								name="enneagramType"
								class="w-full rounded-lg border border-gray-300 bg-white p-3 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
							>
								<option value="">I don't know my type yet</option>
								<option value="1">Type 1 - The Reformer</option>
								<option value="2">Type 2 - The Helper</option>
								<option value="3">Type 3 - The Achiever</option>
								<option value="4">Type 4 - The Individualist</option>
								<option value="5">Type 5 - The Investigator</option>
								<option value="6">Type 6 - The Loyalist</option>
								<option value="7">Type 7 - The Enthusiast</option>
								<option value="8">Type 8 - The Challenger</option>
								<option value="9">Type 9 - The Peacemaker</option>
							</select>
						</div>

						{#if form?.message && !form?.success}
							<div class="text-sm text-red-500">{form.message}</div>
						{/if}

						<button
							type="submit"
							class="w-full transform rounded-lg bg-indigo-600 px-6 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md disabled:transform-none disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none"
							disabled={loading}
						>
							{loading ? 'Processing...' : 'Join Waitlist'}
						</button>
					</form>
				{:else}
					<div class="py-4 text-center">
						<div class="mb-4 flex justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="48"
								height="48"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="text-green-500"
							>
								<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
								<polyline points="22 4 12 14.01 9 11.01"></polyline>
							</svg>
						</div>
						<h2 class="mb-4 text-2xl font-bold text-green-600">You're on the list!</h2>
						<p class="mb-6 text-gray-600">
							We'll contact you as soon as <br />coaching sessions are available.
						</p>
						<p class="mb-8 text-sm text-gray-500">
							{#if email}
								We've sent a confirmation to <strong>{email}</strong>
							{:else}
								We'll keep you updated on our coaching program launch
							{/if}
						</p>

						<a
							href="/"
							class="inline-block transform rounded-lg bg-indigo-600 px-6 py-3 font-semibold !text-white transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md"
						>
							Back to Home
						</a>
					</div>
				{/if}
			</div>
		</div>
	</section>

	<!-- Benefits Section -->
	<section class="my-8 rounded-2xl bg-gray-50 py-16">
		<h2 class="mb-10 text-center text-3xl font-bold text-gray-800">
			What Enneagram Coaching Can Do For You
		</h2>
		<div class="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each benefits as benefit}
				<div
					class="h-full rounded-xl border border-gray-200 bg-white p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
				>
					<div
						class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100"
					>
						<div class="text-indigo-800">
							{@html benefit.icon}
						</div>
					</div>
					<h3 class="mb-3 text-xl font-semibold text-indigo-800">{benefit.title}</h3>
					<p class="text-sm text-gray-600">{benefit.description}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Session Process Section -->
	<section class="py-16">
		<h2 class="mb-10 text-center text-3xl font-bold text-gray-800">
			What to Expect in Your Session
		</h2>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#each sessionSteps as step}
				<div
					class="flex rounded-xl border border-gray-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
				>
					<div class="mr-4 text-3xl font-bold text-indigo-600 opacity-80">{step.number}</div>
					<div>
						<h3 class="mb-2 text-xl font-semibold text-indigo-800">{step.title}</h3>
						<p class="text-sm text-gray-600">{step.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Enneagram Visual Section -->
	<section class="my-8 rounded-2xl bg-gradient-to-br from-indigo-800 to-gray-800 py-16 text-white">
		<div class="flex flex-col gap-8 md:flex-row md:items-center">
			<div class="flex-1 p-8">
				<h2 class="mb-6 text-3xl font-bold text-white">The Power of the Enneagram</h2>
				<p class="mb-4 text-lg text-white/90">
					The Enneagram isn't just another personality test. It's a profound system of understanding
					that reveals your core motivations, fears, and desires.
				</p>
				<p class="mb-4 text-lg text-white/90">
					Our coaches are extensively trained to help you apply this wisdom to your unique
					circumstances and challenges.
				</p>
				<p class="mb-4 text-lg text-white/90">
					When you understand your type at a deep level, you gain access to new possibilities for
					growth and transformation.
				</p>

				<div class="mt-8 flex flex-col items-center gap-4 sm:flex-row">
					<a
						href="#top"
						class="inline-block transform rounded-lg bg-white px-6 py-3.5 text-center font-semibold text-indigo-800 transition hover:-translate-y-0.5 hover:shadow-md"
					>
						Join the Waitlist
					</a>
					<a
						href="/enneagram-corner/beginners-guide-to-determining-your-enneagram-type"
						class="border-b border-white/30 pb-0.5 !text-white transition hover:border-white"
					>
						Learn more about the Enneagram →
					</a>
				</div>
			</div>

			<div class="flex flex-1 items-center justify-center p-4">
				<EnneagramDiagram />
			</div>
		</div>
	</section>

	<!-- FAQ Section -->
	<section class="py-16">
		<h2 class="mb-10 text-center text-3xl font-bold text-gray-800">Frequently Asked Questions</h2>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="rounded-xl border border-gray-200 bg-white p-6">
				<h3 class="relative mb-3 pl-6 text-xl font-semibold text-indigo-800">
					<span class="absolute left-0 text-indigo-600">Q:</span>
					How long are the coaching sessions?
				</h3>
				<p class="relative pl-6 text-gray-600">
					<span class="absolute left-0 font-semibold text-indigo-500">A:</span>
					Each initial session is 60 minutes, with follow-up sessions available in 30 or 60-minute formats
					based on your needs.
				</p>
			</div>
			<div class="rounded-xl border border-gray-200 bg-white p-6">
				<h3 class="relative mb-3 pl-6 text-xl font-semibold text-indigo-800">
					<span class="absolute left-0 text-indigo-600">Q:</span>
					Do I need to know my Enneagram type already?
				</h3>
				<p class="relative pl-6 text-gray-600">
					<span class="absolute left-0 font-semibold text-indigo-500">A:</span>
					No, part of our coaching process includes helping you accurately identify your type if you're
					unsure.
				</p>
			</div>
			<div class="rounded-xl border border-gray-200 bg-white p-6">
				<h3 class="relative mb-3 pl-6 text-xl font-semibold text-indigo-800">
					<span class="absolute left-0 text-indigo-600">Q:</span>
					How are sessions conducted?
				</h3>
				<p class="relative pl-6 text-gray-600">
					<span class="absolute left-0 font-semibold text-indigo-500">A:</span>
					Sessions are held virtually via video call, allowing you to connect with our coaches from anywhere
					in the world.
				</p>
			</div>
			<div class="rounded-xl border border-gray-200 bg-white p-6">
				<h3 class="relative mb-3 pl-6 text-xl font-semibold text-indigo-800">
					<span class="absolute left-0 text-indigo-600">Q:</span>
					When will coaching sessions become available?
				</h3>
				<p class="relative pl-6 text-gray-600">
					<span class="absolute left-0 font-semibold text-indigo-500">A:</span>
					We're currently finalizing our coaching team and platform. Waitlist members will be the first
					to know when sessions launch and will receive priority booking.
				</p>
			</div>
		</div>
	</section>

	<!-- Final CTA -->
	<section
		class="my-12 rounded-2xl border border-gray-200 bg-gradient-to-r from-indigo-100 to-white px-8 py-12 text-center shadow-md"
	>
		<div class="mx-auto max-w-2xl">
			<h2 class="mb-4 text-3xl font-bold text-indigo-800">
				Ready to Dive Deeper Into Your Enneagram Journey?
			</h2>
			<p class="mb-8 text-lg text-gray-600">
				Join our waitlist today and be the first to access our transformative coaching sessions.
			</p>
			<a
				href="#top"
				class="inline-block transform rounded-lg bg-indigo-600 px-8 py-4 text-lg font-semibold !text-white transition hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-lg"
			>
				Join the Waitlist
			</a>
		</div>
	</section>
</div>
