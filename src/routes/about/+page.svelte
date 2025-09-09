<!-- src/routes/about/+page.svelte -->
<script lang="ts">
	import { browser } from '$app/environment';
	import twitter from '$lib/images/twitter.svg';

	let showEmail = false;
	let showLaser = true;
	let innerWidth: number;
	let selectedPath: 'coaching' | 'questions' | 'guides' | null = null;

	function toggleLaser() {
		showLaser = !showLaser;
	}
</script>

<svelte:head>
	<title>About 9takes - The Platform Rewiring How We Understand Each Other</title>
	<meta
		name="description"
		content="9takes uses personality science to transform online discourse from echo chambers into understanding engines. Discover how different personality types see the same situation."
	/>
	<meta name="author" content="9takes" />
	<link rel="canonical" href="https://9takes.com/about" />

	<!-- Open Graph -->
	<meta
		property="og:title"
		content="About 9takes - A Curiosity Engine for Understanding Perspectives"
	/>
	<meta
		property="og:description"
		content="Not another social platform—9takes is building the anti-echo chamber where you discover HOW different personalities see the same situation."
	/>
	<meta property="og:image" content="https://9takes.com/brand/aero.png" />
	<meta property="og:url" content="https://9takes.com/about" />
	<meta property="og:type" content="website" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@djwayne3" />
	<meta name="twitter:creator" content="@djwayne3" />
	<meta name="twitter:title" content="About 9takes - The Anti-Echo Chamber" />
	<meta
		name="twitter:description"
		content="Every day, 500 million people share opinions online. Almost none change their minds. 9takes is different."
	/>
	<meta name="twitter:image" content="https://9takes.com/brand/aero.png" />

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
			"name": "About 9takes - A Platform for Perspective Intelligence",
			"description": "9takes transforms online discourse from echo chambers into understanding engines using personality science and structured dialogue.",
			"url": "https://9takes.com/about",
			"mainEntity": {
				"@type": "Organization",
				"name": "9takes",
				"founder": {
					"@type": "Person",
					"name": "DJ Wayne"
				},
				"foundingDate": "2022",
				"description": "A curiosity engine that reveals how 9 different personality types see the same situation, breaking people out of their perspective bubbles.",
				"url": "https://9takes.com"
			}
		}
	</script>
</svelte:head>

<svelte:window bind:innerWidth />

<div class="mx-auto max-w-4xl px-5 py-6 leading-relaxed text-gray-800">
	<!-- SECTION 1: The Opening Manifesto -->
	<section class="mb-16">
		<div class="mb-8 text-center">
			<h1 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
				Curiosity Died When Algorithms Took Over
			</h1>
			<p class="mb-6 text-xl text-gray-700">
				Every day, 500 million people share opinions online.<br />
				<span class="font-semibold">Almost none of them change their minds.</span>
			</p>
		</div>

		<div class="rounded-lg bg-gradient-to-r from-red-50 to-orange-50 p-8">
			<h2 class="mb-4 text-2xl font-bold text-gray-900">The Problem</h2>
			<p class="mb-4 text-lg text-gray-700">
				Social media turned conversation into performance. Reddit became tribes defending
				territories. We lost the ability to be curious about why people think differently.
			</p>
			<p class="text-lg font-semibold text-indigo-700">
				Our Different Path: 9takes is building the anti-echo chamber—where you discover HOW
				different personalities see the same situation.
			</p>
		</div>
	</section>

	<!-- SECTION 2: How 9takes Works Differently -->
	<section class="mb-16">
		<h2 class="mb-8 text-center text-3xl font-bold text-indigo-800">
			Not Another Social Platform—A Curiosity Engine
		</h2>

		<div class="mb-8 grid gap-6 md:grid-cols-3">
			<div class="rounded-lg border-2 border-indigo-200 bg-white p-6">
				<div
					class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white"
				>
					<span class="text-xl font-bold">1</span>
				</div>
				<h3 class="mb-3 text-xl font-bold text-gray-900">You Think First, Read Second</h3>
				<p class="mb-2 text-gray-700">Unlike Reddit where you scroll before forming opinions</p>
				<ul class="space-y-1 text-sm text-gray-600">
					<li>• Share YOUR perspective before seeing others</li>
					<li>• No groupthink, no karma farming</li>
					<li>• Just authentic thoughts</li>
				</ul>
			</div>

			<div class="rounded-lg border-2 border-indigo-200 bg-white p-6">
				<div
					class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white"
				>
					<span class="text-xl font-bold">2</span>
				</div>
				<h3 class="mb-3 text-xl font-bold text-gray-900">
					Personality Context, Not Identity Politics
				</h3>
				<p class="mb-2 text-gray-700">Anonymous but with Enneagram type visible</p>
				<ul class="space-y-1 text-sm text-gray-600">
					<li>• Understand WHY someone sees it that way</li>
					<li>• Move from "they're wrong" to "they're different"</li>
					<li>• Context without judgment</li>
				</ul>
			</div>

			<div class="rounded-lg border-2 border-indigo-200 bg-white p-6">
				<div
					class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white"
				>
					<span class="text-xl font-bold">3</span>
				</div>
				<h3 class="mb-3 text-xl font-bold text-gray-900">Questions That Matter</h3>
				<p class="mb-2 text-gray-700">Real dilemmas, not engagement bait</p>
				<ul class="space-y-1 text-sm text-gray-600">
					<li>• Structured for actual insight</li>
					<li>• Every question becomes a masterclass</li>
					<li>• Learn from diverse perspectives</li>
				</ul>
			</div>
		</div>

		<!-- Visual Comparison -->
		<div class="grid gap-4 rounded-lg bg-gray-50 p-6 md:grid-cols-2">
			<div class="rounded-lg bg-red-50 p-4">
				<h4 class="mb-2 font-bold text-red-800">Reddit & Social Media</h4>
				<p class="text-red-700">"500 comments saying the same thing"</p>
			</div>
			<div class="rounded-lg bg-green-50 p-4">
				<h4 class="mb-2 font-bold text-green-800">9takes</h4>
				<p class="text-green-700">"9 perspectives revealing different truths"</p>
			</div>
		</div>
	</section>

	<!-- SECTION 3: Why This Matters Now -->
	<section class="mb-16">
		<h2 class="mb-8 text-3xl font-bold text-indigo-800">The Cost of Living in Bubbles</h2>

		<div class="grid gap-6 md:grid-cols-2">
			<div class="rounded-lg border-l-4 border-blue-400 bg-blue-50 p-6">
				<h3 class="mb-2 font-bold text-blue-800">Personal Blindspots</h3>
				<p class="text-blue-700">We're all missing 8/9ths of reality</p>
			</div>
			<div class="rounded-lg border-l-4 border-purple-400 bg-purple-50 p-6">
				<h3 class="mb-2 font-bold text-purple-800">Relationship Failures</h3>
				<p class="text-purple-700">Most conflicts are perspective clashes</p>
			</div>
			<div class="rounded-lg border-l-4 border-green-400 bg-green-50 p-6">
				<h3 class="mb-2 font-bold text-green-800">Professional Limitations</h3>
				<p class="text-green-700">Can't innovate from one viewpoint</p>
			</div>
			<div class="rounded-lg border-l-4 border-orange-400 bg-orange-50 p-6">
				<h3 class="mb-2 font-bold text-orange-800">Societal Breakdown</h3>
				<p class="text-orange-700">Democracy requires understanding difference</p>
			</div>
		</div>

		<div class="mt-6 rounded-lg bg-indigo-800 p-6 text-center text-white">
			<p class="text-xl font-bold">The Opportunity:</p>
			<p class="text-lg">What if you could see through 8 other lenses?</p>
		</div>
	</section>

	<!-- SECTION 4: The Founder's Mission -->
	<section class="mb-16">
		<h2 class="mb-8 text-3xl font-bold text-indigo-800">
			From the Military Mindset to Emotional Intelligence
		</h2>

		<div class="grid gap-6 md:grid-cols-2">
			<div class="rounded-lg bg-gray-50 p-6">
				<div class="mb-4">
					<h3 class="mb-3 text-xl font-bold text-gray-900">The Journey</h3>
					<ul class="space-y-3 text-gray-700">
						<li>
							<strong class="text-indigo-700">The Realization:</strong> In the Marines, survival depended
							on suppressing your emotions and moving forward. This works in warfighting but not in interpersonal
							relationships.
						</li>
						<li>
							<strong class="text-indigo-700">The Discovery:</strong> The Enneagram revealed WHY people
							process reality differently
						</li>
						<li>
							<strong class="text-indigo-700">The Mission:</strong> Build tools that make perspective-taking
							a learnable skill
						</li>
						<li>
							<strong class="text-indigo-700">The Vision:</strong> A world where curiosity replaces judgment
						</li>
					</ul>
				</div>
			</div>

			<div class="flex items-center justify-center">
				<div
					class="cursor-pointer rounded-lg bg-gradient-to-r from-black via-indigo-600 to-black p-0.5"
					on:click={toggleLaser}
					on:keydown={(e) => e.key === 'Enter' && toggleLaser()}
					tabindex="0"
					role="button"
					aria-pressed="false"
				>
					<div class="rounded-lg bg-gray-50 p-0.5">
						<img
							src={showLaser ? '/brand/djface.png' : '/brand/djface.png'}
							alt="DJ Wayne, Founder of 9takes"
							class="h-auto w-full max-w-[200px] rounded-lg object-cover"
						/>
						<p class="mt-2 text-center text-sm text-gray-600">DJ Wayne, Founder</p>
					</div>
				</div>
			</div>
		</div>

		<div class="mt-6 flex justify-center space-x-3">
			<a
				class="inline-flex items-center rounded bg-gray-100 p-3 font-semibold transition-colors duration-300 hover:bg-gray-200"
				href="https://twitter.com/djwayne3"
				target="_blank"
				rel="noreferrer"
				aria-label="Follow on Twitter/X"
			>
				<img src={twitter} alt="" class="mr-2 h-5 w-5" />
				Twitter/X
			</a>
			<a
				class="inline-flex items-center rounded bg-gray-100 p-3 font-semibold transition-colors duration-300 hover:bg-gray-200"
				href="https://www.linkedin.com/in/djwayne3"
				target="_blank"
				rel="noreferrer"
				aria-label="Connect on LinkedIn"
			>
				<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
					<path
						d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
					/>
				</svg>
				LinkedIn
			</a>
		</div>
	</section>

	<!-- SECTION 5: What You Can Do Here -->
	<section class="mb-16">
		<h2 class="mb-8 text-center text-3xl font-bold text-indigo-800">
			Three Ways to Expand Your Perspective
		</h2>

		<div class="grid gap-6 md:grid-cols-3">
			<div
				class="group rounded-lg border-2 border-gray-200 bg-white p-6 transition-all hover:border-indigo-400 hover:shadow-lg"
			>
				<div class="mb-4 text-4xl">🔍</div>
				<h3 class="mb-3 text-xl font-bold text-gray-900">Explore Questions</h3>
				<p class="mb-4 text-gray-700">See how 9 personality types answer life's real dilemmas</p>
				<a
					href="/questions"
					class="inline-flex items-center font-semibold text-indigo-600 transition-colors hover:text-indigo-800"
				>
					Browse Questions
					<svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</a>
			</div>

			<div
				class="group rounded-lg border-2 border-gray-200 bg-white p-6 transition-all hover:border-indigo-400 hover:shadow-lg"
			>
				<div class="mb-4 text-4xl">📚</div>
				<h3 class="mb-3 text-xl font-bold text-gray-900">Learn the Patterns</h3>
				<p class="mb-4 text-gray-700">Discover why people think the way they do</p>
				<a
					href="/enneagram-corner"
					class="inline-flex items-center font-semibold text-indigo-600 transition-colors hover:text-indigo-800"
				>
					Read Our Guides
					<svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</a>
			</div>

			<div
				class="group rounded-lg border-2 border-gray-200 bg-white p-6 transition-all hover:border-indigo-400 hover:shadow-lg"
			>
				<div class="mb-4 text-4xl">💡</div>
				<h3 class="mb-3 text-xl font-bold text-gray-900">Get Personal Insight</h3>
				<p class="mb-4 text-gray-700">1-on-1 coaching to master perspective-taking</p>
				<a
					href="/book-session"
					class="inline-flex items-center font-semibold text-indigo-600 transition-colors hover:text-indigo-800"
				>
					Book a Session
					<svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</a>
			</div>
		</div>
	</section>

	<!-- SECTION 6: Why Not Just Use Reddit? -->
	<section class="mb-16">
		<h2 class="mb-8 text-3xl font-bold text-indigo-800">The Fundamental Difference</h2>

		<div class="overflow-x-auto">
			<table class="w-full rounded-lg border border-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="border-b border-gray-200 p-4 text-left font-bold text-gray-900">
							Reddit & Social Media
						</th>
						<th class="border-b border-gray-200 p-4 text-left font-bold text-indigo-700">
							9takes
						</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-b border-gray-200">
						<td class="p-4 text-gray-700">Upvotes create echo chambers</td>
						<td class="p-4 font-semibold text-indigo-700"
							>No voting—all perspectives valued equally</td
						>
					</tr>
					<tr class="border-b border-gray-200 bg-gray-50">
						<td class="p-4 text-gray-700">Identity drives tribalism</td>
						<td class="p-4 font-semibold text-indigo-700"
							>Anonymity + personality type drives understanding</td
						>
					</tr>
					<tr class="border-b border-gray-200">
						<td class="p-4 text-gray-700">Comments before thinking</td>
						<td class="p-4 font-semibold text-indigo-700">Think first, then discover</td>
					</tr>
					<tr class="border-b border-gray-200 bg-gray-50">
						<td class="p-4 text-gray-700">Karma rewards conformity</td>
						<td class="p-4 font-semibold text-indigo-700">Authenticity rewards growth</td>
					</tr>
					<tr>
						<td class="p-4 text-gray-700">Moderators control narrative</td>
						<td class="p-4 font-semibold text-indigo-700">Structure enables all voices</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>

	<!-- SECTION 7: The Bigger Picture -->
	<section class="mb-16">
		<h2 class="mb-8 text-3xl font-bold text-indigo-800">Building a More Curious World</h2>

		<div class="space-y-4">
			<div class="flex items-start space-x-4">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600"
				>
					<span class="font-bold">1</span>
				</div>
				<div>
					<h3 class="font-bold text-gray-900">Short Term</h3>
					<p class="text-gray-700">Help individuals break out of their perspective prison</p>
				</div>
			</div>

			<div class="flex items-start space-x-4">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-200 text-indigo-700"
				>
					<span class="font-bold">2</span>
				</div>
				<div>
					<h3 class="font-bold text-gray-900">Medium Term</h3>
					<p class="text-gray-700">Transform how teams and couples handle conflict</p>
				</div>
			</div>

			<div class="flex items-start space-x-4">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-300 text-indigo-800"
				>
					<span class="font-bold">3</span>
				</div>
				<div>
					<h3 class="font-bold text-gray-900">Long Term</h3>
					<p class="text-gray-700">Create tools that make empathy scalable</p>
				</div>
			</div>

			<div class="flex items-start space-x-4">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white"
				>
					<span class="font-bold">🎯</span>
				</div>
				<div>
					<h3 class="font-bold text-gray-900">Ultimate Goal</h3>
					<p class="text-gray-700">Normalize seeing multiple truths in every situation</p>
				</div>
			</div>
		</div>
	</section>

	<!-- SECTION 8: Start Your Journey -->
	<section class="mb-16 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 p-8">
		<h2 class="mb-8 text-center text-3xl font-bold text-indigo-800">
			Choose Your Path to Perspective
		</h2>

		<div class="grid gap-6 md:grid-cols-3">
			<div class="rounded-lg bg-white p-6 text-center shadow-lg">
				<div class="mb-4 text-4xl">🚀</div>
				<h3 class="mb-2 text-xl font-bold text-gray-900">I Want Personal Breakthrough</h3>
				<p class="mb-4 text-sm text-gray-600">Master your blindspots with personalized coaching</p>
				<a
					href="/book-session"
					class="inline-block rounded-lg bg-indigo-600 px-6 py-3 font-bold text-white transition-colors hover:bg-indigo-700"
				>
					Book a 1-on-1 Session
				</a>
			</div>

			<div class="rounded-lg bg-white p-6 text-center shadow-lg">
				<div class="mb-4 text-4xl">🧠</div>
				<h3 class="mb-2 text-xl font-bold text-gray-900">I Want to Understand People Better</h3>
				<p class="mb-4 text-sm text-gray-600">See how different personalities navigate life</p>
				<a
					href="/questions"
					class="inline-block rounded-lg bg-indigo-600 px-6 py-3 font-bold text-white transition-colors hover:bg-indigo-700"
				>
					Explore Real Questions
				</a>
			</div>

			<div class="rounded-lg bg-white p-6 text-center shadow-lg">
				<div class="mb-4 text-4xl">📖</div>
				<h3 class="mb-2 text-xl font-bold text-gray-900">I Want to Learn the System</h3>
				<p class="mb-4 text-sm text-gray-600">Deep dive into personality patterns</p>
				<a
					href="/enneagram-corner"
					class="inline-block rounded-lg bg-indigo-600 px-6 py-3 font-bold text-white transition-colors hover:bg-indigo-700"
				>
					Read the Guides
				</a>
			</div>
		</div>
	</section>

	<!-- Final Quote -->
	<section class="mb-16">
		<div class="rounded-lg bg-black p-8 text-center text-white">
			<p class="mb-3 text-2xl font-bold">
				"See through other people's eyes without losing your own vision"
			</p>
			<p class="text-lg opacity-90">That's the skill that changes everything.</p>
		</div>
	</section>

	<!-- Contact Section -->
	<section
		class="rounded-lg border border-gray-200 bg-gradient-to-r from-gray-50 to-indigo-50 p-8 text-center"
	>
		<h3 class="mb-4 text-2xl font-bold text-indigo-800">Ready to Challenge Your Perspective?</h3>
		<p class="mb-6 text-lg text-gray-700">
			Join a community that values understanding over agreement.
		</p>
		{#if !showEmail}
			<button
				type="button"
				class="rounded-lg bg-indigo-600 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-indigo-700"
				on:click={() => (showEmail = true)}
			>
				Get in Touch
			</button>
		{:else}
			<div class="space-y-3">
				<p class="text-lg">
					<strong>Questions & Coaching:</strong>
					<a
						href="mailto:dj@9takes.com"
						class="ml-2 font-semibold text-indigo-700 underline hover:text-indigo-800"
					>
						dj@9takes.com
					</a>
				</p>
				<p class="text-lg">
					<strong>Support:</strong>
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
