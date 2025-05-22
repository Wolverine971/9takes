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
		'One situation, 9 ways to see it. Stress‑test your situations in your life with Enneagram coaching. Decode personality dynamics, boost situational awareness, and max out your personality.';
	const keywords =
		'stress test ideas, enneagram coaching, situational awareness, personality maxing, decode people, blind spot analysis';
	const domain = 'https://9takes.com';
	const ogImage = 'https://9takes.com/blogs/greek-statue-enneagram-coaching.webp';
	const twitterHandle = '@djwayne3';
	const imageAlt = '1‑on‑1 Enneagram coaching session illustration';

	/* ---------------- Benefits ---------------- */
	const benefits = [
		{
			title: 'Stress‑Test Real Scenarios',
			description:
				'Bring your toughest decision, pitch, or relationship dilemma. We run it through 9 distinct mindsets to expose hidden gaps.',
			icon: `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M9 12l2 2 4-4'/><path d='M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.21 0 4.21.8 5.77 2.13'/></svg>`
		},
		{
			title: 'Boost Situational Awareness',
			description:
				'Learn how each type reads the room so you can anticipate reactions and steer conversations with confidence.',
			icon: `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='3'/><path d='M12 1v6m0 6v6m11-7h-6m-6 0H1'/></svg>`
		},
		{
			title: 'Decode People Fast',
			description:
				'Master personality archetypes to understand motives, predict stress responses, and build rapport quickly.',
			icon: `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M21 15a2 2 0 0 1-2 2H5l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'/></svg>`
		},
		{
			title: 'Personal growth via Personality Maxing',
			description:
				'Walk away with a targeted growth plan for your type—no generic advice, just precise moves to level up.',
			icon: `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='23 6 13.5 15.5 8.5 10.5 1 18'/><polyline points='17 6 23 6 23 12'/></svg>`
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
			description: 'Run your scenario through 9 archetypes to surface hidden assumptions and gaps.'
		},
		{
			number: '04',
			title: 'Action Blueprint',
			description:
				'Get customized scripts, communication tactics, and a personality‑maxing roadmap.'
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
			"description": "Stress-test decisions and max personality stats with personalized Enneagram coaching sessions.",
			"provider": {
				"@type": "Organization",
				"name": "9takes",
				"url": "https://9takes.com"
			},
			"serviceType": "Personality Coaching",
			"offers": {
				"@type": "Offer",
				"availability": "https://schema.org/PreOrder",
				"price": "297",
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
		<!-- Main headline and CTA aligned horizontally -->
		<div class="mb-12 flex flex-col gap-8 md:flex-row md:items-start">
			<div class="flex-1">
				<h1
					class="mb-4 bg-gradient-to-r from-gray-800 to-indigo-800 bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl"
				>
					Know thyself, <br /> everything else will get easier.
				</h1>
				<p class="mb-4 text-xl text-gray-600">In any given situation → 9 ways to see it.</p>
				<p class="text-xl text-gray-600">
					Stress‑test your toughest decisions through all 9 personality lenses. Decode stakeholder
					dynamics, sharpen your situational awareness, and max your personality stats.
				</p>
			</div>

			<!-- Waitlist card -->
			<div class="w-full rounded-2xl border-2 border-indigo-200 bg-white p-8 shadow-xl md:max-w-md">
				{#if !submitted}
					<div class="mb-4 text-center">
						<div class="mb-2 text-sm font-semibold uppercase tracking-wide text-indigo-600">
							Join the Priority Waitlist
						</div>
					</div>

					<h2 class="mb-2 text-xl font-bold text-indigo-800">Lock In Early Access</h2>
					<p class="mb-6 text-gray-600">First spots open soon—get notified before anyone else.</p>

					<form method="POST" action="?/coachSub" class="space-y-4">
						<div>
							<input
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
							<input
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
							<select
								id="enneagramType"
								name="enneagramType"
								class="w-full rounded-lg border border-gray-300 bg-white p-3 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
							>
								<option value="">Your Enneagram Type (optional)</option>
								<option value="1">Type 1 – The Perfectionist</option>
								<option value="2">Type 2 – The Helper</option>
								<option value="3">Type 3 – The Achiever</option>
								<option value="4">Type 4 – The Individualist</option>
								<option value="5">Type 5 – The Investigator</option>
								<option value="6">Type 6 – The Loyalist</option>
								<option value="7">Type 7 – The Enthusiast</option>
								<option value="8">Type 8 – The Challenger</option>
								<option value="9">Type 9 – The Peacemaker</option>
							</select>
						</div>
						{#if form?.message && !form?.success}
							<div class="text-sm text-red-500">{form.message}</div>
						{/if}
						<button
							type="submit"
							class="w-full rounded-lg bg-indigo-600 px-6 py-4 text-lg font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg disabled:cursor-not-allowed"
							disabled={loading}
						>
							{loading ? 'Processing…' : 'Join Waitlist'}
						</button>
						<div class="text-center text-xs text-gray-500">💳 No payment until sessions launch</div>
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
							{#if email}Confirmation sent to <strong>{email}</strong>{:else}Welcome to the priority
								list!{/if}
						</p>
						<a
							href="/"
							class="inline-block rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md"
							>Back to 9takes</a
						>
					</div>
				{/if}
			</div>
		</div>

		<!-- Bullet points below both sections -->
		<div class="mx-auto max-w-md">
			<div class="flex flex-col space-y-3">
				<div class="flex items-center">
					<span
						class="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-sm text-white"
						>✓</span
					><span class="text-lg">60‑minute deep‑dive</span>
				</div>
				<div class="flex items-center">
					<span
						class="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-sm text-white"
						>✓</span
					><span class="text-lg"
						>Type‑specific growth blueprint <br />(<b>Max out your personality</b>)</span
					>
				</div>
				<div class="flex items-center">
					<span
						class="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-sm text-white"
						>✓</span
					><span class="text-lg">Relationship insights & communication tools</span>
				</div>
			</div>
		</div>
	</section>

	<!-- Benefits -->
	<section class="my-8 rounded-2xl bg-gray-50 py-16">
		<h2 class="mb-10 text-center text-3xl font-bold text-gray-800">
			Why 9‑Lens Beats Solo Thinking/ DIY
		</h2>
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
		<h2 class="mb-10 text-center text-3xl font-bold text-gray-800">
			Inside Your 60‑Minute Session
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

	<!-- Personality-Maxing Section -->
	<section
		class="my-8 rounded-2xl bg-gradient-to-r from-purple-50 via-white to-indigo-50 p-12 text-center shadow-md"
	>
		<h2 class="mb-6 text-3xl font-bold text-indigo-800">"Max Out" Your Personality.</h2>
		<p class="mx-auto mb-6 max-w-3xl text-lg text-gray-700">
			Every personality type has <strong>baseline strengths and predictable blind spots</strong>.
			Think of it as your personality's starting stats—before you level up.
		</p>
		<p class="mx-auto mb-8 max-w-3xl text-lg text-gray-700">
			Coaching doesn't just give you insights; it gives you <em>targeted drills</em> to turn your type's
			weak points into competitive advantages.
		</p>
		<div class="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
			<div class="rounded-lg bg-white p-6 shadow-sm">
				<div class="mb-2 text-2xl">📊</div>
				<h3 class="mb-2 font-semibold text-gray-800">Personality Audit</h3>
				<p class="text-sm text-gray-600">
					Baseline assessment of your type's patterns & blind spots
				</p>
			</div>
			<div class="rounded-lg bg-white p-6 shadow-sm">
				<div class="mb-2 text-2xl">🎯</div>
				<h3 class="mb-2 font-semibold text-gray-800">Targeted Drills</h3>
				<p class="text-sm text-gray-600">Type‑specific exercises to sharpen weak areas</p>
			</div>
			<div class="rounded-lg bg-white p-6 shadow-sm">
				<div class="mb-2 text-2xl">⚡</div>
				<h3 class="mb-2 font-semibold text-gray-800">Precise Moves</h3>
				<p class="text-sm text-gray-600">Tactical scripts & timing strategies for real scenarios</p>
			</div>
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
					Each session is 60 minutes. Follow‑up sessions available in 30 or 60‑minute formats based on
					your needs.
				</p>
			</div>
			<div class="rounded-xl border border-gray-200 bg-white p-6">
				<h3 class="relative mb-3 pl-6 text-xl font-semibold text-indigo-800">
					<span class="absolute left-0 text-indigo-600">Q:</span>
					Do I need to know my Enneagram type already?
				</h3>
				<p class="relative pl-6 text-gray-600">
					<span class="absolute left-0 font-semibold text-indigo-500">A:</span>
					No. Type discovery is part of the coaching process—we use behavioral patterns, not just tests.
				</p>
			</div>
			<div class="rounded-xl border border-gray-200 bg-white p-6">
				<h3 class="relative mb-3 pl-6 text-xl font-semibold text-indigo-800">
					<span class="absolute left-0 text-indigo-600">Q:</span>
					How are sessions conducted?
				</h3>
				<p class="relative pl-6 text-gray-600">
					<span class="absolute left-0 font-semibold text-indigo-500">A:</span>
					Secure video calls. Connect from anywhere—no travel, no waiting rooms, just focused strategy
					time.
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
		class="my-12 rounded-2xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-white px-8 py-12 text-center shadow-lg"
	>
		<div class="mx-auto max-w-2xl">
			<h2 class="mb-4 text-3xl font-bold text-indigo-800">Go from Blind Spots to Breakthroughs</h2>
			<p class="mb-8 text-lg text-gray-600">Join the waitlist now—openings are limited</p>
			<a
				href="#top"
				class="inline-block rounded-lg bg-indigo-600 px-8 py-4 text-lg font-semibold text-white transition hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-lg"
				>Join the Waitlist</a
			>
			<div class="mt-4 text-sm text-gray-500">⏱ Join the waitlist now—openings are limited</div>
		</div>
	</section>
</div>

<style>
	/* minimal styling - leverage Tailwind */
</style>
