<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	import type { PageData } from './$types';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	import Jumbotron from '$lib/components/atoms/jumbotron.svelte';
	import QuestionItem from '$lib/components/questions/QuestionItem.svelte';

	export let data: PageData;
	let innerWidth = 0;

	const metaDescription =
		'9takes- Anonymous questions and answers based on personality. What are people thinking, feeling, and doing?';
	const ogImage = 'https://9takes.com/greek_pantheon.png';

	const bentoItems = [
		{
			href: '/community/introducing-9takes',
			img: 'greek-statue-introducing-9takes.webp',
			alt: 'A scenic view of a person working on a computer in the jungle',
			title: 'What makes 9takes different?'
		},
		{
			href: '/community/inspiration-for-9takes',
			img: 'husband-and-wife-arguing.webp',
			alt: 'husband and wife arguing',
			title: 'Why did I create 9takes?'
		},
		{
			href: '/enneagram-corner/enneagram-tldr',
			img: 'greek-dude-reading-book.webp',
			alt: 'Greek dude reading book',
			title: 'What is the Enneagram?'
		},
		{
			href: '/enneagram-corner/philosophy-psychology-and-the-enneagram',
			img: 'freud-plato.webp',
			alt: 'Sigmund Freud squaring off with Plato',
			title: 'How is the Enneagram different?'
		}
	];

	const benefits = [
		{
			text: 'Go into IRL situations with the awareness of other viewpoints.',
			icon: 'M120 56a40 40 0 1 1 80 0 40 40 0 1 1 -80 0zm96 0A56 56 0 1 0 104 56a56 56 0 1 0 112 0zM100.9 128h-5l-2.2 4.5L8.8 308.5l-3.5 7.2 14.4 7 3.5-7.2L105.9 144H214.1l82.7 171.5 3.5 7.2 14.4-7-3.5-7.2-84.9-176-2.2-4.5h-5H100.9zM104 240H88v8V504v8h8 48 8v-8V352h16V504v8h8 48 8v-8V248v-8H216v8V496H184V344v-8h-8H144h-8v8V496H104V248v-8zM440 56a40 40 0 1 1 80 0 40 40 0 1 1 -80 0zm96 0A56 56 0 1 0 424 56a56 56 0 1 0 112 0zM439.6 210.5l2.5-7.6-15.2-5.1-2.5 7.6-56 168L364.9 384H376h32V504v8h8 48 8v-8V384h16V504v8h8 48 8v-8V384h32 11.1l-3.5-10.5-56-168-2.5-7.6-15.2 5.1 2.5 7.6L572.9 368H552 536 504 488 472 456 424 408 387.1l52.5-157.5zM424 496V384h32V496H424zm80-112h32V496H504V384zM415.9 128l-2.2 4.5-84.9 176-3.5 7.2 14.4 7 3.5-7.2L425.9 144H534.1l82.7 171.5 3.5 7.2 14.4-7-3.5-7.2-84.9-176-2.2-4.5h-5H420.9h-5z'
		},
		{
			text: 'Develop empathy for and get to know the other side.',
			icon: 'M192 416c0-17.7-14.3-32-32-32H64c-17.7 0-32-14.3-32-32V64c0-17.7 14.3-32 32-32H448c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H309.3c-6.9 0-13.7 2.2-19.2 6.4L192 464V416zM64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64h64 32v32 48c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM192 184a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm128 0a24 24 0 1 0 0-48 24 24 0 1 0 0 48zM155.9 252.1c-6.6 5.9-7.1 16-1.3 22.6C179.5 302.5 215.7 320 256 320s76.5-17.5 101.4-45.3c5.9-6.6 5.3-16.7-1.3-22.6s-16.7-5.3-22.6 1.3C314.5 274.6 286.8 288 256 288s-58.5-13.4-77.5-34.7c-5.9-6.6-16-7.1-22.6-1.3z'
		},
		{
			text: 'Find Your Tribe: Connect with people who think, feel and act like you.',
			icon: 'M371.6 28c1.7 1.2 3.2 2.5 4.5 4c-23 .4-42.7 2.7-59.5 6.3c-26.4-6.7-68.1-10.5-131.4-.1C76.9 56.1 41.9 92.8 32.6 105.7l0 .1c-.1 .8-.2 2.4 .3 5L60.8 274.5c5.4 31.5 19.5 58.8 41.8 76.9c20.8 16.8 46.9 35.3 74 48.2c16.9 8.1 32.9 13.4 47.4 15.5c6.8 10.4 14.5 21.4 23 32.5c-58 4.9-123.3-37.8-165-71.7c-29.7-24-46.8-59-53.2-96.2L.8 116.1c-1.7-9.8-1-19.9 4.7-28C20.5 67 63.6 25.9 179.8 6.9S350.5 12.8 371.6 28zM159 286.9c9.4-7.6 22-15.8 37.8-21.8l-1.7 10.2c-1.5 9-2.5 18.2-2.9 27.5c-4.7 2.8-8.9 5.8-12.4 8.7c-5.7 4.7-11.3 9.9-15.7 15.9c-5 7.2-15.1 9.1-22.5 4.2c-7.4-4.9-9.4-14.8-4.4-22.1c5.9-8.6 13.8-16 21.8-22.6zm-3.9-122.6c3.1-8.2 12.5-12.4 20.9-9.3s12.7 12.3 9.5 20.5c-5.9 15.4-19.8 27.5-37.6 30.4s-35-4-45.7-16.7c-5.7-6.8-4.7-16.8 2.2-22.4s17.2-4.6 22.9 2.1c7.8 9.3 23.5 6.7 27.8-4.6zm230 346.3c-60-9.8-110.5-74.6-140.1-122c-20.1-32.2-24.7-70.7-18.3-107.9L254.6 117c1.7-9.8 5.6-19.1 13.8-24.9C289.5 76.8 344 51.8 460.2 70.9S619.5 131 634.5 152.1c5.8 8.1 6.4 18.2 4.7 28L611.3 343.8c-6.4 37.2-23.5 72.2-53.2 96.2c-43.7 35.4-113.1 80.5-173 70.7zm-58.5-69.5c21.7 21.3 43.5 34.7 63.8 38s45.4-2.4 73-15.6c27.1-13 53.2-31.4 74-48.2c22.3-18.1 36.4-45.4 41.8-76.9l27.9-163.7c.4-2.5 .4-4.2 .3-5l0-.1c-9.4-12.9-44.3-49.7-152.6-67.5s-153.6 5.9-166.7 15.1l0 .1c-.4 .7-1 2.2-1.4 4.8L258.7 285.9c-5.4 31.5-1.1 61.9 14 86.1c14.1 22.6 32.6 48.3 53.9 69.2zm24.7-202.5c-5.7 6.8-16 7.7-22.9 2.1s-7.9-15.6-2.2-22.4c10.7-12.7 27.8-19.6 45.7-16.7s31.7 15 37.6 30.4c3.1 8.2-1.1 17.4-9.5 20.5s-17.8-1.1-20.9-9.3c-2-5.2-6.6-9.2-12.5-10.1s-11.6 1.3-15.2 5.6zm147.8 85.7l.6-.2c3.1-1 6.1-2 9.1-3.1c3.7-1.4 7.3-2.9 10.9-4.5c6.2-2.8 13.5 1.6 12.4 8.3c-.7 4.2-1.7 8.3-2.8 12.3c-1 3.5-2.2 7-3.6 10.4c-.2 .5-.4 1-.6 1.5c-19.7 47-70.6 76.1-123.9 67.4s-91.7-52.5-94.8-103.3c0-.5-.1-1.1-.1-1.6c-.2-3.6-.1-7.3 .1-11c.2-4.1 .7-8.3 1.4-12.5c1.1-6.6 9.5-8.5 14.5-3.9c2.8 2.6 5.8 5.2 8.8 7.7c2.5 2 5 4 7.6 5.9l.5 .4c22 15.9 48 27.2 76.8 31.9s57.1 2.4 83.2-5.6zm-20.7 37.4c-21.9 3.4-44.8 3.4-67.8-.4s-44.6-11.1-64.2-21.3c10.9 22.9 32.8 40.4 60.2 44.9s53.9-5 71.8-23.2zm1.2-102c-5.7 6.8-16 7.7-22.9 2.1s-7.9-15.6-2.2-22.4c10.7-12.7 27.8-19.6 45.7-16.7s31.7 15 37.6 30.4c3.1 8.2-1.1 17.4-9.5 20.5s-17.8-1.1-20.9-9.3c-2-5.2-6.6-9.2-12.6-10.1s-11.6 1.3-15.2 5.6z'
		},
		{
			text: 'Go down the rabbit hole on any scenario you can think of.',
			icon: 'M324.1 20.8c6.5 9.4 12.1 19.2 16.9 29.5c3.5-4.4 7.2-8.6 11.2-12.6l3.1-3.1c1.7-1.7 4-2.6 6.4-2.6c4.5 0 8.3 3.3 8.9 7.7l.7 4.9c3.3 22.7 1.2 45.6-5.6 66.8c-12.9-4.8-26.7-7.4-40.7-7.5c-6.3-33.2-22.5-64.4-47.4-89l-3.1-3.1L263.3 23.3l11.3-11.4C266.9 4.3 256.5 0 245.7 0C225.3 0 208 15 205.1 35.2l-.7 4.9c-7.6 53 8.6 106.2 43.6 145.9l0 37.6c-62.8 17.5-113.6 63.7-137.4 123.6C99.5 340.1 86.2 336 72 336c-39.8 0-72 32.2-72 72s32.2 72 72 72c12.4 0 24.1-3.1 34.3-8.7c13.7 24.2 39.6 40.5 69.3 40.7l.3 0c0 0 .1 0 .1 0l128 0c26.5 0 48-21.5 48-48c0-25.9-20.5-47-46.2-48l21-22.2 55.9 94.6c13.5 22.8 42.9 30.4 65.7 16.9s30.4-42.9 16.9-65.7L380.5 296l7.3 0c42.1 0 76.3-34.1 76.3-76.3c0-22.9-10.3-44.6-28.1-59.1L399 130.5c-1.5-1.2-3.1-2.5-4.7-3.6c9.8-27.4 13-57.1 8.7-86.8l-.7-4.9C399.4 15 382.1 0 361.7 0c-10.8 0-21.2 4.3-28.9 11.9L329.7 15c-1.9 1.9-3.8 3.9-5.6 5.8zM96.4 439.7C89.6 444.9 81.2 448 72 448c-22.1 0-40-17.9-40-40s17.9-40 40-40c11.2 0 21.4 4.6 28.6 12.1c-3 14.2-4.6 28.9-4.6 43.9l0 8c0 2.6 .1 5.2 .4 7.7zm140.4-400c.6-4.4 4.4-7.7 8.9-7.7c2.4 0 4.7 .9 6.3 2.6l3.1 3.1c23.4 23.2 37.3 53.5 40.3 85.2c.4 4.6 2.8 8.7 6.5 11.4s8.4 3.7 12.9 2.7c3.1-.7 6.3-1 9.6-1c19.8 0 39 6.8 54.3 19.3l36.9 30.1c10.3 8.4 16.3 21 16.3 34.3c0 24.4-19.8 44.3-44.3 44.3l-35.3 0c-5.7 0-11 3.1-13.9 8.1s-2.8 11.1 .1 16.1l99.1 167.7c4.5 7.6 2 17.4-5.6 21.9s-17.4 2-21.9-5.6L343.6 359.3c-2.6-4.3-7-7.2-12-7.8s-10 1.2-13.4 4.9L257 421c-4.4 4.6-5.6 11.5-3.1 17.3s8.3 9.7 14.7 9.7l35.4 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c0 0 0 0 0 0l-.2 0c-26.4-.1-47.8-21.6-47.8-48l0-8c0-84.6 59.7-155.3 139.3-172.2c7.4-1.6 12.7-8.1 12.7-15.7l0-55.7 0-.4c0-4.1-1.5-8.1-4.4-11.2c-31.3-33.1-46-78.8-39.5-124.2l.7-4.9zM352 208a16 16 0 1 0 0-32 16 16 0 1 0 0 32z'
		}
	];

	let sectionsVisible = Array(7).fill(false);

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
		if (index % 2 === 0) {
			return { x: -50, duration, delay };
		} else {
			return { x: 50, duration, delay };
		}
	}
</script>

<svelte:head>
	<title>9takes - Anonymous Questions and Answers Based on Personality</title>
	<meta name="description" content={metaDescription} />
	<link rel="canonical" href="https://9takes.com" />
	<meta property="og:site_name" content="9takes" />
	<meta property="og:title" content="9takes - Home of the Questioners" />
	<meta property="og:description" content={metaDescription} />
	<meta property="og:url" content="https://9takes.com" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:type" content="image/png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:creator" content="@djwayne3" />
	<meta property="twitter:title" content="9takes - Anonymous Questions and Answers" />
	<meta property="twitter:description" content={metaDescription} />
	<meta property="twitter:image" content={ogImage} />
</svelte:head>

<svelte:window bind:innerWidth />

<main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
	<div class="section-wrapper">
		{#if sectionsVisible[0]}
			<section class="hero py-12 md:py-24" in:fly={getTransition(0)}>
				<div class="hero-content flex flex-col items-center justify-between gap-8 md:flex-row">
					<div class="hero-text max-w-lg">
						<h1 class="mb-4 text-4xl font-bold md:text-5xl">Anonymous Questions and Answers</h1>
						<h2 class="mb-4 text-2xl font-semibold md:text-3xl">Filter by Personality</h2>
						<p class="hero-subtitle mb-4 text-xl">
							Find out what others are <span class="highlight">thinking</span>,
							<span class="highlight">feeling</span>, and <span class="highlight">doing</span>.
						</p>
						<p class="hero-description text-lg">
							People see the world differently <br />and some see it like you do. <br />Find them
							here
							<br />
							on 9takes.
						</p>
					</div>
					<div class="hero-image glass-area w-full md:w-1/2">
						<div class="question-list">
							{#each data?.top9Questions as questionData}
								<QuestionItem {questionData} showDetails={true} />
							{/each}
						</div>
					</div>
				</div>
			</section>
		{/if}
	</div>

	<div class="section-wrapper">
		{#if sectionsVisible[2]}
			<Jumbotron
				image={'greek_pantheon.webp'}
				showIcon={innerWidth > 760}
				text={'9takes'}
				subtext={''}
				panBackground={false}
			>
				<div class="content-display" in:fly={getTransition(2)}>
					<p class="text-shadow mb-4 text-center font-bold text-white">
						Where can you find unbiased and different viewpoints/ opinions/ answers/ feedback/ takes
						<br class="hidden md:inline" />
						on any situation you can think of?
					</p>
					<h2
						class="text-shadow text-center text-4xl font-bold text-white md:text-5xl"
						data-value={'9takes'}
						itemprop="name"
					>
						{'9takes'}
					</h2>
				</div>
			</Jumbotron>
		{/if}
	</div>

	<div class="section-wrapper">
		<section class="question-answer-section py-24">
			<div
				class="question-answer-links flex flex-col items-center justify-center gap-6 md:flex-row"
			>
				<div class="question-links flex flex-col gap-4 md:flex-row">
					{#each Array(4) as _}
						<a href="/questions" class="question-link text-xl hover:underline">Question</a>
					{/each}
				</div>
				<span class="arrow text-4xl">{'>'}</span>
				<div class="answer-types flex flex-col gap-4 md:flex-row">
					{#each ['Answers', 'Tweets', 'Posts', 'Threads'] as type}
						<span class="text-xl">{type}</span>
					{/each}
				</div>
			</div>
		</section>
	</div>

	<div class="section-wrapper">
		{#if sectionsVisible[3]}
			<section class="challenges glass-area p-8" in:fly={getTransition(3)}>
				<h2 class="mb-4 text-3xl font-bold">It is hard to find open discussions online.</h2>
				<h3 class="mb-4 text-2xl font-semibold">
					Conversation gets stifled for the following reasons:
				</h3>
				<ul class="list-disc space-y-4 pl-6">
					<li>
						<strong>People post into the void instead of asking questions.</strong> Rhetorical statements
						turn people away in conversations while questions invite collaboration.
					</li>
					<li>
						<strong>People can passively lurk.</strong> The only engagement that happens is on the content
						that produces fear, anger, or embarrassment.
					</li>
					<li>
						<strong>It is too risky to be honest.</strong> You don't want to receive criticism so you
						only express opinions that are status quo.
					</li>
				</ul>
			</section>
		{/if}
	</div>

	<div class="section-wrapper">
		{#if sectionsVisible[4]}
			<section class="deeper py-12" in:fly={getTransition(4)}>
				<h2 class="mb-4 text-3xl font-bold">Bringing online conversations a layer deeper</h2>
				<p class="description mb-8 text-xl">
					9takes is anonymous and influenced by the Enneagram personality system.<br />
					<strong class="text-2xl"
						>Think <span class="reddit-text">Reddit</span> based on personality.</strong
					>
				</p>
				<ul class="bento-list grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{#each bentoItems as { href, img, alt, title }}
						<li
							class="bento relative overflow-hidden rounded-lg shadow-md transition-transform hover:-translate-y-1"
						>
							<a {href} class="block">
								<img src={`/blogs/${img}`} {alt} loading="lazy" class="h-48 w-full object-cover" />
								<h3
									class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-4 text-lg text-white"
								>
									{title}
								</h3>
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{/if}
	</div>

	<div class="section-wrapper">
		{#if sectionsVisible[5]}
			<section class="benefits glass-area p-8" in:fly={getTransition(5)}>
				<h2 class="mb-6 text-3xl font-bold">Benefits of 9takes</h2>
				<ul class="space-y-4">
					{#each benefits as { text, icon }, index}
						<li class="flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="text-primary-dark mr-4 h-6 w-6"
								viewBox="0 0 512 512"
								aria-hidden="true"
							>
								<path d={icon} />
							</svg>
							<span class="text-lg">{text}</span>
						</li>
					{/each}
				</ul>
				<p class="mt-6 text-xl">
					Explore the worldviews of different personality types by sifting through their answers to
					questions.
				</p>
			</section>
		{/if}
	</div>

	{#if !data?.session?.user}
		<div class="section-wrapper">
			{#if sectionsVisible[6]}
				<section
					class="signup rounded-lg bg-white p-8 text-center shadow-md"
					in:fly={getTransition(6)}
				>
					<h2 class="mb-6 text-3xl font-bold">Join 9takes Today</h2>
					<EmailSignup cta={'Sign up and start asking questions'} />
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

	.highlight {
		color: var(--primary-dark);
		font-weight: 700;
	}

	.glass-area {
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(10px);
		border-radius: 1rem;
		box-shadow: 0 4px 6px var(--shadow-color);
	}

	.text-shadow {
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
	}

	.reddit-text {
		color: #ff4500;
	}

	@media (max-width: 640px) {
		h1 {
			font-size: 2rem;
		}

		h2 {
			font-size: 1.75rem;
		}

		h3 {
			font-size: 1.5rem;
		}

		p {
			font-size: 1rem;
		}

		.hero-content {
			text-align: center;
		}

		.question-answer-links {
			flex-direction: column;
		}

		.bento-list {
			grid-template-columns: 1fr;
		}
	}

	.animate-on-scroll {
		opacity: 0;
		transform: translateY(20px);
		transition:
			opacity 0.6s ease-out,
			transform 0.6s ease-out;

		&.in-view {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
