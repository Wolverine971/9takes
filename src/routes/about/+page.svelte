<!-- routes/about/+page.svelte -->
<script lang="ts">
	import { browser } from '$app/environment';
	import twitter from '$lib/images/twitter.svg';

	let showEmail = false;
	let showLaser = true;
	let innerWidth: number;

	function toggleLaser() {
		showLaser = !showLaser;
	}
</script>

<svelte:head>
	<title>About DJ Wayne - Enneagram Coach & 9takes Founder | One situation, 9 ways to see it</title>
	<meta
		name="description"
		content="Meet DJ Wayne, creator of 9takes. Former military infantry grunt turned tech entrepreneur helping people build emotional intelligence through personality psychology."
	/>
	<meta name="author" content="DJ Wayne" />
	<link rel="canonical" href="https://9takes.com/about" />

	<!-- Open Graph -->
	<meta property="og:title" content="About DJ Wayne - 9takes Founder" />
	<meta
		property="og:description"
		content="From USMC infantry to tech entrepreneur. Meet DJ Wayne, creator of 9takes, helping people build emotional intelligence through personality psychology."
	/>
	<meta property="og:image" content="https://9takes.com/brand/djface.png" />
	<meta property="og:url" content="https://9takes.com/about" />
	<meta property="og:type" content="profile" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@djwayne3" />
	<meta name="twitter:creator" content="@djwayne3" />
	<meta name="twitter:title" content="About DJ Wayne - 9takes Founder" />
	<meta
		name="twitter:description"
		content="From USMC infantry to tech entrepreneur. Meet DJ Wayne, creator of 9takes, helping people build emotional intelligence through personality psychology."
	/>
	<meta name="twitter:image" content="https://9takes.com/brand/djface.png" />

	<!-- Structured Data for Person and Organization -->
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Person",
			"name": "DJ Wayne",
			"givenName": "DJ",
			"familyName": "Wayne",
			"jobTitle": "Founder",
			"worksFor": {
				"@type": "Organization",
				"name": "9takes",
				"url": "https://9takes.com",
				"logo": "https://9takes.com/brand/aero.png",
				"sameAs": ["https://twitter.com/djwayne3"]
			},
			"alumniOf": [
				{
					"@type": "EducationalOrganization",
					"name": "United States Marine Corps",
					"alternateName": "USMC"
				}
			],
			"knowsAbout": [
				"Enneagram",
				"Personality Psychology",
				"Emotional Intelligence",
				"Military Intelligence",
				"Software Development",
				"Entrepreneurship",
				"Cognitive Psychology",
				"Perspective Taking"
			],
			"description": "From USMC infantry to tech entrepreneur. Meet DJ Wayne, creator of 9takes, helping people build emotional intelligence through personality psychology.",
			"image": "https://9takes.com/brand/djface.png",
			"url": "https://9takes.com/about",
			"sameAs": ["https://twitter.com/djwayne3", "https://www.linkedin.com/in/djwayne3"]
		}
	</script>

	<!-- AboutPage Schema -->
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "AboutPage",
			"name": "About 9takes and DJ Wayne",
			"description": "Learn about 9takes' mission to build emotional intelligence through personality psychology and meet founder DJ Wayne.",
			"url": "https://9takes.com/about",
			"mainEntity": {
				"@type": "Organization",
				"name": "9takes",
				"founder": {
					"@type": "Person",
					"name": "DJ Wayne"
				},
				"foundingDate": "2022",
				"description": "A platform that uses the Enneagram personality system to help people build emotional intelligence and perspective-taking skills through structured conversations.",
				"url": "https://9takes.com"
			}
		}
	</script>
</svelte:head>

<svelte:window bind:innerWidth />

<div class="mx-auto max-w-4xl px-5 py-6 leading-relaxed text-gray-800">
	<h1
		class="rounded-lg bg-gradient-to-r from-black via-indigo-600 to-black p-4 text-center text-white"
	>
		<span class="text-2xl font-bold">One situation, 9 ways to see it</span><br />
		<span class="text-lg"
			>Stress‑test your ideas on <span class="font-bold text-indigo-300">9takes</span></span
		>
	</h1>

	<section class="mt-10">
		<h2 class="mb-6 text-3xl font-bold text-indigo-800">Meet DJ Wayne</h2>
		<div
			class="cursor-pointer rounded-lg bg-gradient-to-r from-black via-indigo-600 to-black p-0.5"
			on:click={toggleLaser}
			on:keydown={(e) => e.key === 'Enter' && toggleLaser()}
			tabindex="0"
			role="button"
			aria-pressed="false"
		>
			<div class="flex flex-col items-center rounded-lg bg-gray-50 p-0.5 md:flex-row">
				<div class="mb-5 w-full max-w-[250px] md:mb-0 md:w-1/2">
					<picture>
						<source srcset="/brand/djface.png, /brand/djface.png" media="(orientation: portrait)" />
						<img
							src={showLaser ? '/brand/djface.png' : '/brand/djface.png'}
							alt={showLaser ? 'DJ Wayne fun profile picture' : 'DJ Wayne serious profile picture'}
							class="h-auto w-full rounded-bl-lg object-cover"
						/>
					</picture>
				</div>
				<div class="w-full rounded-lg p-6">
					<p class="mb-4 text-lg font-semibold">
						Former military → Tech entrepreneur → Enneagram coach
					</p>

					<p class="mb-4">
						I built 9takes because most conversations happen in echo chambers. Your brain prefers
						agreement—but growth lives in the tension between perspectives.
					</p>

					<div class="flex space-x-3">
						<a
							class="inline-flex items-center rounded bg-gray-100 p-3 font-semibold transition-colors duration-300 hover:bg-gray-200"
							href="https://twitter.com/djwayne3"
							target="_blank"
							rel="noreferrer"
							aria-label="Follow DJ Wayne on Twitter/ X"
						>
							<img src={twitter} alt="" class="mr-2 h-6 w-6" />
							Twitter/ X
						</a>
						<a
							class="inline-flex items-center rounded bg-gray-100 p-3 font-semibold transition-colors duration-300 hover:bg-gray-200"
							href="https://www.linkedin.com/in/djwayne3"
							target="_blank"
							rel="noreferrer"
							aria-label="Connect with DJ Wayne on LinkedIn"
						>
							<svg class="mr-2 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
								/>
							</svg>
							LinkedIn
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="mt-12">
		<h2 class="mb-6 text-3xl font-bold text-indigo-800">The Problem with Online Thinking</h2>

		<div class="mb-8 grid gap-6 md:grid-cols-3">
			<div class="rounded-r-lg border-l-4 border-red-400 bg-red-50 p-4">
				<h3 class="mb-2 font-bold text-red-800">🎭 Echo Chamber Bias</h3>
				<p class="text-sm text-red-700">
					Algorithms feed you content that agrees with you—leaving blind spots unchecked.
				</p>
			</div>
			<div class="rounded-r-lg border-l-4 border-orange-400 bg-orange-50 p-4">
				<h3 class="mb-2 font-bold text-orange-800">⚡ Reaction Speed</h3>
				<p class="text-sm text-orange-700">
					See others' takes first → knee‑jerk responses instead of original thinking.
				</p>
			</div>
			<div class="rounded-r-lg border-l-4 border-yellow-400 bg-yellow-50 p-4">
				<h3 class="mb-2 font-bold text-yellow-800">📊 Engagement Metrics</h3>
				<p class="text-sm text-yellow-700">
					Platforms optimize for clicks, not cognitive growth or meaningful connection.
				</p>
			</div>
		</div>

		<div class="rounded-lg border-2 border-indigo-200 bg-indigo-50 p-6 text-center">
			<p class="mb-2 text-xl font-bold text-indigo-800">
				Result: Your perspective muscle atrophies
			</p>
			<p class="text-indigo-700">
				You get really good at confirming what you already think—terrible at stress‑testing it.
			</p>
		</div>
	</section>

	{#if browser}
		<div class="relative my-12 h-0 overflow-hidden pt-[56.25%]">
			<iframe
				src="https://www.youtube.com/embed/-IYvvm8gzqw?si=8MaKuA5vfTpcXhGN"
				title="Why social media kills real socializing"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowfullscreen
				loading="lazy"
				class="absolute left-0 top-0 h-full w-full rounded-lg"
			/>
		</div>
	{/if}

	<section class="mt-12">
		<h2 class="mb-6 text-3xl font-bold text-indigo-800">My Enneagram Breakthrough</h2>

		<div class="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
			<p class="mb-4 text-lg">
				<strong>The setup:</strong> Leaving military life, marriage under stress, couldn't bridge the
				gap between my wife's perspective and mine.
			</p>
			<p class="mb-4 text-lg">
				<strong>The discovery:</strong> The Enneagram revealed our core motivational patterns—why we
				filtered the same situations so differently.
			</p>
			<p class="text-lg font-semibold text-indigo-800">
				<strong>The insight:</strong> If understanding emotional patterns could save my marriage, what
				could it do for every conversation?
			</p>
		</div>

		<div class="rounded-lg bg-indigo-800 p-6 text-center text-white">
			<p class="mb-2 text-xl font-bold">That's when 9takes was born 🚀</p>
			<p class="text-lg">
				A platform where perspective‑taking becomes a metabolic workout for your brain.
			</p>
		</div>
	</section>

	<section class="mt-12">
		<h2 class="mb-6 text-3xl font-bold text-indigo-800">How 9takes Builds Cognitive Muscle</h2>

		<div class="mb-8 grid gap-6 md:grid-cols-2">
			<div class="rounded-lg border border-green-200 bg-green-50 p-6">
				<h3 class="mb-3 text-xl font-bold text-green-800">🎯 Give‑First Unlock</h3>
				<p class="mb-3 text-green-700">
					<strong>Old way:</strong> See others' takes → reactive thinking<br />
					<strong>9takes way:</strong> Give your take first → unlock the hive‑mind
				</p>
				<p class="text-sm font-semibold text-green-600">
					Forces original thought before bias kicks in.
				</p>
			</div>

			<div class="rounded-lg border border-blue-200 bg-blue-50 p-6">
				<h3 class="mb-3 text-xl font-bold text-blue-800">🧭 Personality‑Type Context</h3>
				<p class="mb-3 text-blue-700">
					<strong>Anonymous identity</strong> + <strong>Enneagram type</strong> = understanding without
					judgment
				</p>
				<p class="text-sm font-semibold text-blue-600">
					See the emotional foundation behind each perspective.
				</p>
			</div>
		</div>

		<div class="rounded-lg border-2 border-purple-200 bg-purple-50 p-6 text-center">
			<h3 class="mb-3 text-xl font-bold text-purple-800">🏋️ The Metabolic Cost</h3>
			<p class="mb-2 text-lg text-purple-700">
				Digesting new perspectives burns mental glucose—that's the point.
			</p>
			<p class="font-semibold text-purple-600">
				Each conflicting viewpoint is a rep. Build tolerance for cognitive dissonance.
			</p>
		</div>
	</section>

	<section class="mt-12">
		<h2 class="mb-6 text-3xl font-bold text-indigo-800">Why the Enneagram Works</h2>

		<div class="mb-6 space-y-4">
			<div class="flex items-start space-x-3">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white"
				>
					1
				</div>
				<div>
					<h4 class="text-lg font-semibold">Maps core motivations, not behaviors</h4>
					<p class="text-gray-700">
						Two people can do the same thing for completely different emotional reasons.
					</p>
				</div>
			</div>

			<div class="flex items-start space-x-3">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white"
				>
					2
				</div>
				<div>
					<h4 class="text-lg font-semibold">Bridges ancient wisdom + modern psychology</h4>
					<p class="text-gray-700">
						Thousands of years of human observation meets contemporary research on personality.
					</p>
				</div>
			</div>

			<div class="flex items-start space-x-3">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white"
				>
					3
				</div>
				<div>
					<h4 class="text-lg font-semibold">Practical framework for empathy</h4>
					<p class="text-gray-700">Instead of "they're wrong," ask "what lens are they using?"</p>
				</div>
			</div>
		</div>

		<div
			class="rounded-lg border border-indigo-300 bg-gradient-to-r from-indigo-100 to-purple-100 p-6 text-center"
		>
			<p class="mb-2 text-lg font-bold text-indigo-800">
				9 types × infinite situations = unlimited perspective training
			</p>
			<p class="text-indigo-700">
				Each question becomes a cognitive drill. Each response expands your empathy range.
			</p>
		</div>
	</section>

	<section class="mt-12">
		<h2 class="mb-6 text-3xl font-bold text-indigo-800">The Endgame</h2>

		<div class="prose prose-lg max-w-none">
			<p class="mb-4 text-lg leading-relaxed text-gray-700">
				Most platforms optimize for engagement. 9takes optimizes for <strong
					>perspective gains</strong
				>.
			</p>

			<p class="mb-4 text-lg leading-relaxed text-gray-700">
				When you can genuinely see through someone else's emotional lens—without losing your
				own—you've unlocked a superpower. You decode people faster. Navigate conflict better. Make
				decisions with more data.
			</p>

			<p class="mb-6 text-lg leading-relaxed text-gray-700">
				That's what we're building: <strong>a gym for your perspective‑taking muscle</strong>.
			</p>
		</div>

		<div class="rounded-lg bg-black p-6 text-center text-white">
			<p class="mb-2 text-xl font-bold">"Perspective gains are earned, not scrolled." 💪</p>
			<p class="text-lg">It takes effort to digest a new perspective.</p>
		</div>
	</section>

	<section
		class="mt-12 rounded-lg border border-gray-200 bg-gradient-to-r from-gray-100 to-indigo-100 p-8 text-center"
	>
		<h3 class="mb-4 text-2xl font-bold text-indigo-800">Continue the Conversation</h3>
		<p class="mb-6 text-lg text-gray-700">
			Questions about the platform? Ideas for features? Just want to chat about the Enneagram?
		</p>
		{#if !showEmail}
			<button
				type="button"
				class="rounded-lg bg-indigo-600 px-6 py-3 text-lg font-bold text-white transition-colors hover:bg-indigo-700"
				on:click={() => (showEmail = true)}
			>
				Get in Touch
			</button>
		{:else}
			<div class="space-y-3">
				<p class="text-lg">
					<strong>General questions:</strong>
					<a
						href="mailto:dj@9takes.com"
						class="ml-2 font-semibold text-indigo-700 underline hover:text-indigo-800"
					>
						dj@9takes.com
					</a>
				</p>
				<p class="text-lg">
					<strong>Support issues:</strong>
					<a
						href="mailto:userSup@9takes.com"
						class="ml-2 font-semibold text-indigo-700 underline hover:text-indigo-800"
					>
						userSup@9takes.com
					</a>
				</p>
			</div>
		{/if}
	</section>
</div>
