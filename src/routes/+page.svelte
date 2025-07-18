<!-- routes/+page.svelte -->
<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	import QuestionItem from '$lib/components/questions/QuestionItem.svelte';
	import EnneagramDiagram from '$lib/components/blog/EnneagramDiagram.svelte';
	import PeopleBoard from '$lib/components/molecules/PeopleBoard.svelte';

	export let data: PageData;
	let innerWidth = 0;
	let loaded = false;
	let observer: IntersectionObserver;

	let sectionsVisible = Array(5).fill(browser ? false : true);

	const enneagramTypes = {
		1: 'Type 1: The Perfectionist',
		2: 'Type 2: The Helper',
		3: 'Type 3: The Achiever',
		4: 'Type 4: The Individualist',
		5: 'Type 5: The Investigator',
		6: 'Type 6: The Loyalist',
		7: 'Type 7: The Enthusiast',
		8: 'Type 8: The Challenger',
		9: 'Type 9: The Peacemaker'
	};

	const featuredArticles = [
		{
			id: '1',
			title: 'How Each Enneagram Type Flexes: Revealing Secret Needs for Recognition',
			excerpt:
				'Discover the unique ways each Enneagram type shows off their strengths and craves recognition in everyday interactions',
			image: '/blogs/greek-statue-flex.webp',
			url: '/enneagram-corner/how-each-enneagram-flexes'
		},
		{
			id: '2',
			title: 'Toxic Traits of Each Enneagram Type',
			excerpt:
				'Understand the shadow sides of each personality type and how to recognize when strengths turn into weaknesses',
			image: '/blogs/greek-statue-showing-cracks.webp',
			url: '/enneagram-corner/toxic-traits-of-each-enneagram-type'
		},
		{
			id: '3',
			title: 'Workplace Team Building with the Enneagram',
			excerpt:
				'How to leverage personality differences to create stronger teams and improve workplace communication',
			image: '/blogs/greek-statues-working-in-teams.webp',
			url: '/enneagram-corner/enneagram-workplace-team-building'
		},
		{
			id: '4',
			title: 'Enneagram First Impression Cheat Sheet',
			excerpt:
				'Essential approaches, power questions, and key tips for authentic first impressions.',
			image: '/blogs/greek-statue-taking-notes.webp',
			url: '/enneagram-corner/first-impression-cheat-sheet'
		}
	];

	// Updated Benefits – focus on stress‑testing ideas & coaching
	const benefits = [
		{
			title: 'Stress‑Test Your Ideas',
			description:
				'Give your take, then unlock 9 different perspectives. Catch blind spots—before they catch you.'
		},
		{
			title: 'Escape Your Bubble',
			description:
				'See how 9 personality types read the same situation. Map hidden motives and decode people fast—no more guesswork.'
		},
		{
			title: 'Personality‑Max Your Stats',
			description:
				"Know your type's strengths and blind spots. Turn cognitive weaknesses into competitive advantages through targeted practice."
		},
		{
			title: 'Level‑Up with Coaching',
			description:
				'Ready to go deeper? <a href="/book-session" class="text-primary-700 underline font-semibold">Book a session</a> and apply insights directly to your situation.'
		}
	];

	function getTransition(index) {
		const duration = 600;
		const delay = 150;
		return index % 2 === 0 ? { x: -30, duration, delay } : { x: 30, duration, delay };
	}

	function setupIntersectionObserver() {
		if (!browser || typeof IntersectionObserver === 'undefined') {
			sectionsVisible = Array(5).fill(true);
			return;
		}

		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const index = parseInt(entry.target.getAttribute('data-section-index') || '0');
						if (!isNaN(index) && index >= 0 && index < sectionsVisible.length) {
							sectionsVisible[index] = true;
							sectionsVisible = [...sectionsVisible];
						}
					}
				});
			},
			{
				threshold: 0.1,
				rootMargin: '100px 0px'
			}
		);

		setTimeout(() => {
			const sections = document.querySelectorAll('.section-observer');
			sections.forEach((section, index) => {
				section.setAttribute('data-section-index', index.toString());
				observer.observe(section);
			});
		}, 100);
	}

	onMount(async () => {
		loaded = true;
		await tick();
		setupIntersectionObserver();
		window.addEventListener(
			'resize',
			() => {
				innerWidth = window.innerWidth;
			},
			{ passive: true }
		);
		return () => {
			if (observer) observer.disconnect();
		};
	});

	const famousByType = Array(9)
		.fill(null)
		.map((_, index) => {
			const typeNumber = index + 1;
			const peopleOfType = data.images.filter((person) => person.type === typeNumber);
			return peopleOfType.length > 0 ? peopleOfType[0] : null;
		});
</script>

<svelte:head>
	<!-- Preconnect to domains for faster loading -->
	<link rel="preconnect" href="https://9takes.com" />

	<!-- Preload critical asset -->
	<link href="/greek_pantheon.png" as="image" />

	<meta name="viewport" content="width=device-width, initial-scale=1, height=device-height" />

	<title>9takes | One situation, 9 ways to see it</title>
	<meta name="title" content="9takes | One situation, 9 ways to see it" />
	<meta
		name="description"
		content="Stress‑test your ideas and personality‑max using the Enneagram. Give your take first, then unlock 9 different perspectives."
	/>
	<meta
		name="keywords"
		content="personality maxing, stress test ideas, enneagram, perspective taking, blind spot detection, emotional intelligence, cognitive training"
	/>
	<meta name="robots" content="index, follow" />
	<meta name="language" content="English" />
	<meta name="author" content="9takes" />

	<!-- Links -->
	<link rel="canonical" href="https://9takes.com" />
	<link rel="alternate" href="https://9takes.com" hreflang="x-default" />
	<link rel="alternate" href="https://9takes.com" hreflang="en" />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://9takes.com" />
	<meta property="og:site_name" content="9takes" />
	<meta property="og:title" content="9takes | One situation, 9 ways to see it" />
	<meta
		property="og:description"
		content="Stress‑test your ideas and personality‑max using the Enneagram. Give your take first, then unlock 9 different perspectives."
	/>
	<meta property="og:image" content="https://9takes.com/greek_pantheon.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:locale" content="en_US" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@djwayne3" />
	<meta name="twitter:creator" content="@djwayne3" />
	<meta name="twitter:title" content="9takes | One situation, 9 ways to see it" />
	<meta
		name="twitter:description"
		content="Stress‑test your ideas and personality‑max using the Enneagram. Give your take first, then unlock 9 different perspectives."
	/>
	<meta name="twitter:image" content="https://9takes.com/greek_pantheon.png" />
	<meta name="twitter:image:alt" content="9takes – One situation, 9 ways to see it" />
</svelte:head>

<svelte:window bind:innerWidth />

<!-- Main container -->
<div class="mx-auto w-full max-w-7xl px-4">
	<!-- Hero Section -->
	{#if loaded}
		<section
			class="flex min-h-[85vh] flex-col items-center justify-center py-8 md:py-12"
			in:fly={getTransition(0)}
		>
			<div class="mb-6 max-w-4xl text-center">
				<h1
					class="mb-4 bg-gradient-to-r from-gray-800 to-indigo-700 bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl lg:text-6xl"
				>
					Build Emotional Intelligence with the Enneagram
				</h1>
				<h2 class="mb-6 text-xl font-bold text-gray-700 md:text-2xl lg:text-3xl">
					Stress‑test your ideas • Escape your bubble <br />Max out your Personality
				</h2>
				<p class="mx-auto max-w-2xl text-base text-gray-600 md:text-lg">
					Give your take, digest other perspectives, escape the hive‑mind. See how 9 personality
					types can <b>see the same scenario differently</b>—catch blind spots before they catch
					you.
				</p>
			</div>

			<!-- Question of the Day -->
			<a
				href={`/questions/${data.questionOfTheDay.url}`}
				class="mb-8 w-full max-w-3xl rounded-xl border-2 border-primary-200 bg-white p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
			>
				<span
					class="inline-block rounded-full bg-primary-100 px-3 py-1.5 text-sm font-bold text-primary-800"
					>💡 Daily Question</span
				>
				<h3 class="my-4 text-center text-xl font-bold md:text-2xl">
					{data.questionOfTheDay ? data.questionOfTheDay.question_formatted : 'Loading question...'}
				</h3>
				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<div class="flex -space-x-2">
							{#if data.questionOfTheDay}
								{#each data.questionOfTheDay.comment_count.toString().split('') as num}
									<div
										class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary-200 text-xs font-bold text-primary-700"
									>
										{num}
									</div>
								{/each}
							{/if}
						</div>
						<span class="ml-2 text-sm text-gray-500">takes unlocked</span>
					</div>
				</div>
			</a>

			<!-- CTA -->
			<a
				href="/questions"
				class="btn-primary mb-4 transform rounded-xl bg-primary-700 px-8 py-4 text-center text-xl font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-primary-800 hover:shadow-xl md:text-2xl"
			>
				Ask a Question
			</a>
			<p class="text-center text-gray-500">Free to join • No personality test required</p>
		</section>
	{:else}
		<div class="hero-placeholder h-screen"></div>
	{/if}

	<!-- 3x3 Grid of Famous People by Personality Type -->
	<div class="section-observer">
		{#if sectionsVisible[0] || !browser}
			<section class="py-12 md:py-16" in:fly={getTransition(1)}>
				<h2 class="mb-4 text-center text-3xl font-bold md:mb-8 md:text-4xl">Master the 9 Lenses</h2>
				<p class="mx-auto mb-12 max-w-2xl text-center text-lg text-gray-600">
					Each personality type sees different details. Learn their patterns—decode people faster.
				</p>

				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-6">
					{#each famousByType as person, i}
						{#if person}
							<a href={`/personality-analysis/${person.name}`} class="group">
								<div
									class="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
								>
									<div class="relative flex items-center justify-center overflow-hidden p-4">
										<div
											class="absolute left-0 top-0 z-10 m-3 rounded-full bg-primary-700 px-3 py-1 text-xs font-bold text-white"
										>
											Type {i + 1}
										</div>
										<div
											class="relative h-48 w-48 overflow-hidden rounded-full border-4 border-primary-100"
										>
											<img
												src={person.image || `/types/${i + 1}s/${person.name}.webp`}
												alt={person.name}
												class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
												loading={i < 6 ? 'eager' : 'lazy'}
											/>
										</div>
									</div>
									<div class="flex flex-1 flex-col justify-between p-4 text-center">
										<h3 class="mb-2 text-lg font-bold text-primary-800">{enneagramTypes[i + 1]}</h3>
										<p class="text-sm text-gray-600">{person.name.split('-').join(' ')}</p>
									</div>
								</div>
							</a>
						{:else}
							<a href={`/types/${i + 1}`} class="group">
								<div
									class="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
								>
									<div class="relative flex items-center justify-center overflow-hidden p-4">
										<div
											class="absolute left-0 top-0 z-10 m-3 rounded-full bg-primary-700 px-3 py-1 text-xs font-bold text-white"
										>
											Type {i + 1}
										</div>
										<div
											class="relative h-48 w-48 overflow-hidden rounded-full border-4 border-primary-100 bg-gray-100"
										>
											<div
												class="flex h-full w-full items-center justify-center text-4xl text-gray-400"
											>
												{i + 1}
											</div>
										</div>
									</div>
									<div class="flex flex-1 flex-col justify-between p-4 text-center">
										<h3 class="mb-2 text-lg font-bold text-primary-800">{enneagramTypes[i + 1]}</h3>
										<p class="text-sm text-gray-600">Explore this lens</p>
									</div>
								</div>
							</a>
						{/if}
					{/each}
				</div>

				<div class="mt-8 text-center">
					<a
						href="/enneagram-corner/beginners-guide-to-determining-your-enneagram-type"
						class="inline-flex items-center rounded-lg border border-primary-300 bg-white px-6 py-3 font-semibold text-primary-700 transition-all duration-200 hover:border-primary-400 hover:bg-primary-50"
					>
						Learn the System
						<svg
							class="ml-2 h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/></svg
						>
					</a>
				</div>
			</section>
		{/if}
	</div>

	<!-- Recent Articles Section -->
	<div class="section-observer">
		{#if sectionsVisible[1] || !browser}
			<section class="py-12 md:py-16" in:fly={getTransition(2)}>
				<h2 class="mb-4 text-center text-3xl font-bold md:mb-8 md:text-4xl">Cognitive Drills</h2>
				<p class="mx-auto mb-12 max-w-2xl text-center text-lg text-gray-600">
					Perspective gains are earned, not scrolled. It takes effort to digest a new perspective.
				</p>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					{#each featuredArticles as article}
						<a href={article.url} class="group">
							<div
								class="h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
							>
								<div class="h-48 overflow-hidden">
									<div class="relative h-full w-full overflow-hidden">
										<img
											src={article.image}
											alt={article.title}
											class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
											loading="lazy"
										/>
										<div
											class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
										></div>
									</div>
								</div>
								<div class="p-4">
									<h3
										class="mb-2 text-lg font-bold transition-colors duration-300 group-hover:text-primary-700"
									>
										{article.title}
									</h3>
									<p class="line-clamp-2 text-sm text-gray-600">{article.excerpt}</p>
								</div>
							</div>
						</a>
					{/each}
				</div>

				<div class="mt-8 text-center">
					<a
						href="/enneagram-corner"
						class="inline-flex items-center rounded-lg border border-primary-300 bg-white px-6 py-3 font-semibold text-primary-700 transition-all duration-200 hover:border-primary-400 hover:bg-primary-50"
					>
						More about the Enneagram
						<svg
							class="ml-2 h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/></svg
						>
					</a>
				</div>
			</section>
		{/if}
	</div>

	<!-- Why the Enneagram Section -->
	<div class="section-observer">
		{#if sectionsVisible[2] || !browser}
			<section
				class="overflow-hidden rounded-xl bg-gradient-to-br from-primary-800 to-gray-800 p-8 text-white shadow-lg"
				in:fly={getTransition(3)}
			>
				<h2 class="mb-6 text-center text-3xl font-bold md:mb-8 md:text-4xl">
					Why the Enneagram Works
				</h2>
				<div class="mx-auto max-w-3xl pb-6 text-center">
					<p class="mb-4 text-lg text-white/90 md:text-xl">
						Your brain defaults to one lens—miss 8 others. The Enneagram maps core motivations that
						drive how people filter reality.
					</p>

					<p class="mb-8 text-lg font-extrabold tracking-wide md:text-xl">
						Digesting new angles burns mental glucose—but that's where the IQ gains live. 💪
					</p>
					<EnneagramDiagram />
				</div>
			</section>
		{/if}
	</div>

	<!-- Benefits Section -->
	<div class="section-observer">
		{#if sectionsVisible[3] || !browser}
			<section class="py-12 md:py-16" in:fly={getTransition(4)}>
				<h2 class="mb-8 text-center text-3xl font-bold md:mb-12 md:text-4xl">How It Works</h2>
				<div class="grid gap-6 md:grid-cols-2 md:gap-8">
					{#each benefits as { title, description }}
						<div
							class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-md"
						>
							<h3 class="mb-3 text-lg font-semibold text-primary-800 md:mb-4 md:text-xl">
								{title}
							</h3>
							<p class="text-gray-600">{@html description}</p>
						</div>
					{/each}
				</div>

				<!-- Coaching CTA -->
				<div class="mt-10 text-center">
					<a
						href="/book-session"
						class="inline-flex items-center rounded-lg bg-primary-700 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-800 hover:shadow-md"
					>
						Level‑Up 1‑on‑1
						<svg
							class="ml-3 h-5 w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/></svg
						>
					</a>
				</div>
			</section>
		{/if}
	</div>

	<!-- Final CTA Section -->
	{#if !data?.user}
		<div class="section-observer">
			{#if sectionsVisible[4] || !browser}
				<section
					class="mb-16 rounded-xl border border-gray-200 bg-gradient-to-r from-primary-100 to-white p-8 text-center shadow-md md:mb-24"
					in:fly={getTransition(5)}
				>
					<h2 class="mb-4 text-3xl font-bold text-primary-800 md:mb-6 md:text-4xl">
						Ready to explore into 9takes?
					</h2>
					<p class="mb-6 text-lg font-semibold text-gray-700 md:mb-8 md:text-xl">
						Start stress‑testing your takes. Do the work of growing your perspective.
					</p>
					<div class="mx-auto flex flex-col justify-center gap-4 sm:flex-row">
						<a
							href="/questions"
							class="btn-primary rounded-lg bg-primary-700 px-8 py-4 text-center text-lg font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-800 hover:shadow-md"
							>Explore and give your takes</a
						>
						<a
							href="/register"
							class="rounded-lg border border-primary-300 bg-white px-8 py-4 text-center text-lg font-bold text-primary-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-400 hover:bg-primary-50 hover:shadow-md"
							>Sign up to ask a question</a
						>
					</div>
				</section>
			{/if}
		</div>
	{/if}
</div>

<style>
	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}
	.animate-shimmer {
		animation: shimmer 1.5s infinite;
	}
	@media (prefers-reduced-motion: reduce) {
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
