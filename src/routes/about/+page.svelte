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
	<title>9takes - About | One situation, 9 ways to see it</title>
	<meta
		name="description"
		content="Meet DJ Wayne, creator of 9takes. Stress‑test your ideas and personality‑max using the Enneagram's 9 perspective lenses."
	/>
	<link rel="canonical" href="https://9takes.com/about" />
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

					<a
						class="inline-flex items-center rounded bg-gray-100 p-3 font-semibold transition-colors duration-300 hover:bg-gray-200"
						href="https://twitter.com/djwayne3"
						target="_blank"
						rel="noreferrer"
					>
						<img src={twitter} alt="djwayne3 Twitter" class="mr-2 h-6 w-6" />
						Follow the journey
					</a>
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
			<p class="text-lg">Ready to start training?</p>
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
