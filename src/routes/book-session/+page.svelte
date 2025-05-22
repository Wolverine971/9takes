<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import EnneagramDiagram from '$lib/components/blog/EnneagramDiagram.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	export let form;

	let email = form?.email || '';
	let name = form?.name || '';
	let submitted = form?.success || false;
	let loading = false;

	/* -------------------- SEO -------------------- */
	const siteName = '9takes';
	const title = '1‑on‑1 Enneagram Coaching | Stress‑Test Your Ideas & Grow EQ | 9takes';
	const metaDescription =
		'Pressure‑test your toughest questions with a certified Enneagram coach. Gain situational awareness, decode nine personality archetypes, and craft a personalized action plan.';
	const keywords =
		'enneagram coaching, stress test ideas, situational awareness, emotional intelligence, personality archetypes, personal growth, self development';
	const domain = 'https://9takes.com';
	const ogImage = 'https://9takes.com/enneagram_coaching.png';
	const twitterHandle = '@djwayne3';
	const imageAlt = '1‑on‑1 Enneagram coaching session illustration';

	/* ---------------- Testimonials ---------------- */
	const testimonials = [
		{
			quote:
				'My coach helped me stress‑test a new startup pitch through all nine lenses—spotted blind spots in minutes that I had missed for months.',
			author: 'Ethan K.',
			type: 'Type 3'
		},
		{
			quote:
				'Walking through a tough conversation scenario with my coach gave me instant situational awareness. Now I lead the room without steam‑rolling anyone.',
			author: 'Marcus R.',
			type: 'Type 8'
		},
		{
			quote:
				'I thought I avoided conflict because of others. Turns out my Type 9 pattern was the culprit. Coaching gave me scripts to speak up—clients noticed the difference the next day.',
			author: 'Liam J.',
			type: 'Type 9'
		}
	];

	/* ---------------- Benefits ---------------- */
	const benefits = [
		{
			title: 'Stress‑Test Real Scenarios',
			description:
				'Bring your toughest decision, pitch, or relationship dilemma. We run it through nine distinct mindsets to expose hidden gaps.',
			icon: `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M2 12h20'/><path d='M12 2v20'/></svg>`
		},
		{
			title: 'Boost Situational Awareness',
			description:
				'Learn how each type reads the room so you can anticipate reactions and steer conversations with confidence.',
			icon: `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M12 6v6l4 2'/></svg>`
		},
		{
			title: 'Decode People Fast',
			description:
				'Master personality archetypes to understand motives, predict stress responses, and build rapport quickly.',
			icon: `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M21 15a2 2 0 0 1-2 2H5l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'/></svg>`
		},
		{
			title: 'Personalized Growth Path',
			description:
				'Walk away with a step‑by‑step plan tailored to your type—no generic advice, just targeted moves.',
			icon: `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 3 6 15 18 15'/><path d='M18 8l3 3-3 3'/></svg>`
		}
	];

	/* ---------------- Session Steps ---------------- */
	const sessionSteps = [
		{
			number: '01',
			title: 'Set the Scenario',
			description: 'Outline the decision, pitch, or conflict you want to stress‑test.'
		},
		{
			number: '02',
			title: 'Type Verification',
			description:
				'Confirm your Enneagram type (or discover it) to anchor coaching in accurate data.'
		},
		{
			number: '03',
			title: 'Blind‑Spot Analysis',
			description: 'We run your scenario through nine archetypes to surface hidden assumptions.'
		},
		{
			number: '04',
			title: 'Action Blueprint',
			description:
				'Receive a customized plan—communication scripts, mindset shifts, and next‑step metrics.'
		}
	];

	/* ---------------- Reactive checks ---------------- */
	$: if (data.alreadySignedUp && !form?.success) submitted = true;
	$: utmParams = data.utmParams;

	onMount(() => {
		if (browser) {
			setTimeout(() => {
				document
					.querySelectorAll('.animate-on-scroll')
					.forEach((el) => el.classList.add('animate-in'));
			}, 100);
		}
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://9takes.com" />
	<meta name="viewport" content="width=device-width, initial-scale=1, height=device-height" />
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

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={twitterHandle} />
	<meta name="twitter:creator" content={twitterHandle} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={metaDescription} />
	<meta name="twitter:image" content={ogImage} />
	<meta name="twitter:image:alt" content={imageAlt} />
</svelte:head>

<div class="mx-auto max-w-7xl px-4">
	<!-- Hero -->
	<section class="py-16 md:py-20">
		<div class="flex flex-col gap-8 md:flex-row md:items-center">
			<div class="flex-1">
				<h1
					class="mb-4 bg-gradient-to-r from-gray-800 to-indigo-800 bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl"
				>
					Know thyself, <br /> everything else will get easier.
				</h1>
				<p class="mb-8 text-xl text-gray-600">
					Gain instant situational awareness, decode personality dynamics, and walk away with a
					concrete action blueprint.
				</p>
				<div class="space-y-3">
					<div class="flex items-center">
						<span
							class="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-sm text-white"
							>✓</span
						><span class="text-lg">60‑minute video session</span>
					</div>
					<div class="flex items-center">
						<span
							class="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-sm text-white"
							>✓</span
						><span class="text-lg">Custom growth strategies for your type</span>
					</div>
					<div class="flex items-center">
						<span
							class="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-sm text-white"
							>✓</span
						><span class="text-lg">Relationship insights & communication tools</span>
					</div>
				</div>
			</div>

			<!-- Waitlist card -->
			<div
				class="w-full rounded-2xl border border-gray-200 bg-white/80 p-8 shadow-lg backdrop-blur-md md:max-w-md"
			>
				{#if !submitted}
					<h2 class="mb-2 text-2xl font-bold text-indigo-800">Join the Priority Waitlist</h2>
					<p class="mb-6 text-gray-600">First spots open soon—get notified before anyone else.</p>
					<form method="POST" action="?/coachSub" class="space-y-5">
						<div>
							<label for="name" class="mb-2 block font-medium text-gray-800">Name</label><input
								id="name"
								name="name"
								type="text"
								placeholder="Your name"
								value={name}
								required
								class="w-full rounded-lg border border-gray-300 p-3 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
							/>
						</div>
						<div>
							<label for="email" class="mb-2 block font-medium text-gray-800">Email</label><input
								id="email"
								name="email"
								type="email"
								placeholder="you@example.com"
								value={email}
								required
								class="w-full rounded-lg border border-gray-300 p-3 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
							/>
						</div>
						<div>
							<label for="enneagramType" class="mb-2 block font-medium text-gray-800"
								>Your Enneagram Type (optional)</label
							><select
								id="enneagramType"
								name="enneagramType"
								class="w-full rounded-lg border border-gray-300 bg-white p-3 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
								><option value="">I’m not sure yet</option><option value="1"
									>Type 1 – The Perfectionist</option
								><option value="2">Type 2 – The Helper</option><option value="3"
									>Type 3 – The Achiever</option
								><option value="4">Type 4 – The Individualist</option><option value="5"
									>Type 5 – The Investigator</option
								><option value="6">Type 6 – The Loyalist</option><option value="7"
									>Type 7 – The Enthusiast</option
								><option value="8">Type 8 – The Challenger</option><option value="9"
									>Type 9 – The Peacemaker</option
								></select
							>
						</div>
						{#if form?.message && !form?.success}<div class="text-sm text-red-500">
								{form.message}
							</div>{/if}
						<button
							type="submit"
							class="w-full rounded-lg bg-indigo-600 px-6 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed"
							disabled={loading}>{loading ? 'Processing…' : 'Join Waitlist'}</button
						>
					</form>
				{:else}
					<div class="py-4 text-center">
						<div class="mb-4 flex justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="48"
								height="48"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="text-green-500"
								><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline
									points="22 4 12 14.01 9 11.01"
								/></svg
							>
						</div>
						<h2 class="mb-4 text-2xl font-bold text-green-600">You're on the list!</h2>
						<p class="mb-6 text-gray-600">We'll email you as soon as sessions open.</p>
						<p class="mb-8 text-sm text-gray-500">
							{#if email}Confirmation sent to <strong>{email}</strong>{:else}Thanks for joining the
								waitlist!{/if}
						</p>
						<a
							href="/"
							class="inline-block rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md"
							>Back to Home</a
						>
					</div>
				{/if}
			</div>
		</div>
	</section>

	<!-- Benefits -->
	<section class="my-8 rounded-2xl bg-gray-50 py-16">
		<h2 class="mb-10 text-center text-3xl font-bold text-gray-800">Why Coaching Beats DIY</h2>
		<div class="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each benefits as benefit}
				<div
					class="h-full rounded-xl border border-gray-200 bg-white p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
				>
					<div
						class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100"
					>
						<div class="text-indigo-800">{@html benefit.icon}</div>
					</div>
					<h3 class="mb-3 text-xl font-semibold text-indigo-800">{benefit.title}</h3>
					<p class="text-sm text-gray-600">{benefit.description}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Session Steps -->
	<section class="py-16">
		<h2 class="mb-10 text-center text-3xl font-bold text-gray-800">Inside a 60‑Minute Session</h2>
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

	<!-- Enneagram Visual -->
	<section class="my-8 rounded-2xl bg-gradient-to-br from-indigo-800 to-gray-800 py-16 text-white">
		<div class="flex flex-col gap-8 md:flex-row md:items-center">
			<div class="flex-1 p-8">
				<h2 class="mb-6 text-3xl font-bold text-white">Why the Enneagram Works</h2>
				<p class="mb-4 text-lg text-white/90">
					Nine archetypes. Infinite context. Coaching translates theory into precise moves for your
					real‑world challenges.
				</p>
				<p class="mb-4 text-lg text-white/90">
					Stop guessing why people react the way they do—start anticipating.
				</p>
				<div class="mt-8 flex flex-col items-center gap-4 sm:flex-row">
					<a
						href="#top"
						class="inline-block rounded-lg bg-white px-6 py-3.5 font-semibold text-indigo-800 transition hover:-translate-y-0.5 hover:shadow-md"
						>Join Waitlist</a
					><a
						href="/enneagram-corner/beginners-guide-to-determining-your-enneagram-type"
						class="border-b border-white/30 pb-0.5 transition hover:border-white"
						>Learn the basics →</a
					>
				</div>
			</div>
			<div class="flex flex-1 items-center justify-center p-4"><EnneagramDiagram /></div>
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
			<h2 class="mb-4 text-3xl font-bold text-indigo-800">Go from Blind Spots to Breakthroughs</h2>
			<p class="mb-8 text-lg text-gray-600">
				Join the waitlist now—openings are limited and fill fast.
			</p>
			<a
				href="#top"
				class="inline-block rounded-lg bg-indigo-600 px-8 py-4 text-lg font-semibold text-white transition hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-lg"
				>Join the Waitlist</a
			>
		</div>
	</section>
</div>

<style>
	/* no custom CSS changes beyond original minimal tweaks */
</style>
