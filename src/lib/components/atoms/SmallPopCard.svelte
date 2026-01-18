<!-- src/lib/components/atoms/SmallPopCard.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	export let image = 'cyber-campfire.webp';
	export let showIcon = true;
	export let displayText = '';
	export let enneagramType = 0;
	export let altText = '';
	export let subtext = 'Ask questions, give your hot takes, talk to people';
	export let scramble = true;
	export let tint = true;
	export let link = '';

	const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let interval: ReturnType<typeof setInterval> | null = null;
	let showDescription = false;
	let innerWidth = 0;

	const namePopId = Math.random().toString(36).substring(2);

	// If you generate a smaller version of the image for optimization
	// For example: original is "folder/person.webp" => "folder/s-person.webp"
	$: imageSrc = `${image.split('/').slice(0, -1).join('/')}/s-${image.split('/').pop()}`;

	const enneagramTypes = [
		{
			EnneagramType: 'Type 1 - The Perfectionist',
			CoreMotivation: 'To be good, ethical, and correct.',
			CoreFear: 'Being corrupt or defective.',
			CommonStereotypes: 'Rigid, judgmental, overly critical.'
		},
		{
			EnneagramType: 'Type 2 - The Helper',
			CoreMotivation: 'To be loved and appreciated.',
			CoreFear: 'Being unloved or unwanted.',
			CommonStereotypes: 'People-pleaser, overly emotional, manipulative.'
		},
		{
			EnneagramType: 'Type 3 - The Achiever',
			CoreMotivation: 'To succeed and be admired.',
			CoreFear: 'Being worthless or a failure.',
			CommonStereotypes: 'Workaholic, superficial, overly competitive.'
		},
		{
			EnneagramType: 'Type 4 - The Individualist',
			CoreMotivation: 'To be unique and authentic.',
			CoreFear: 'Having no identity or significance.',
			CommonStereotypes: 'Melodramatic, self-absorbed, moody.'
		},
		{
			EnneagramType: 'Type 5 - The Investigator',
			CoreMotivation: 'To be knowledgeable and competent.',
			CoreFear: 'Being useless or incompetent.',
			CommonStereotypes: 'Detached, secretive, overly intellectual.'
		},
		{
			EnneagramType: 'Type 6 - The Loyalist',
			CoreMotivation: 'To have security and support.',
			CoreFear: 'Being without guidance or support.',
			CommonStereotypes: 'Anxious, indecisive, overly cautious.'
		},
		{
			EnneagramType: 'Type 7 - The Enthusiast',
			CoreMotivation: 'To be happy and satisfied.',
			CoreFear: 'Being deprived or trapped in pain.',
			CommonStereotypes: 'Impulsive, scattered, commitment-phobic.'
		},
		{
			EnneagramType: 'Type 8 - The Challenger',
			CoreMotivation: 'To be in control and self-reliant.',
			CoreFear: 'Being controlled or manipulated.',
			CommonStereotypes: 'Aggressive, confrontational, domineering.'
		},
		{
			EnneagramType: 'Type 9 - The Peacemaker',
			CoreMotivation: 'To have inner and outer peace.',
			CoreFear: 'Conflict and disconnection.',
			CommonStereotypes: 'Complacent, indecisive, disengaged.'
		}
	];

	onMount(() => {
		if (scramble) startTextScramble();
		return () => clearInterval(interval);
	});

	function startTextScramble() {
		const nameElement = document.querySelector(`.name-pop-${namePopId}`);
		if (!nameElement) return;

		let iteration = 0;
		clearInterval(interval);

		interval = setInterval(() => {
			nameElement.textContent = displayText
				.split('')
				.map((letter, index) =>
					index < iteration ? displayText[index] : LETTERS[Math.floor(Math.random() * 26)]
				)
				.join('');

			if (iteration >= displayText.length) {
				clearInterval(interval);
			}
			iteration += 1 / 3;
		}, 30);
	}
</script>

<svelte:window bind:innerWidth />

<div
	class="hover:scale-102 relative z-10 h-full w-full transform overflow-hidden rounded-lg border border-slate-700/60 bg-opacity-15 transition-transform duration-300 hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]"
	class:bg-black={!enneagramType}
	class:bg-purple-900={enneagramType}
	class:hover:scale-103={enneagramType}
	class:hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]={enneagramType}
	title={altText || displayText}
	aria-roledescription="card"
	role="button"
	tabindex="0"
	on:mouseover={() => scramble && startTextScramble()}
	on:mouseenter={() => (showDescription = true)}
	on:focus={() => (showDescription = true)}
	on:mouseleave={() => (showDescription = false)}
	on:click={() => goto(link)}
	on:keydown={(event) => {
		if (event.key === 'Enter') goto(link);
	}}
>
	<!-- Responsive image -->
	{#if displayText !== 'YOUR NAME' && image}
		<img
			srcset="{imageSrc} 218w, {image} 560w"
			sizes="(max-width: 560px) 218px, 560px"
			loading="lazy"
			decoding="async"
			class="absolute left-0 top-0 z-10 h-full w-full object-cover transition-all duration-300"
			class:animate-pan-image={showIcon}
			class:object-center={!showIcon}
			class:brightness-70={tint && showDescription && enneagramType}
			class:contrast-120={tint && showDescription && enneagramType}
			alt={altText || displayText}
			in:fly={{ y: 200, duration: 1500 }}
		/>
	{/if}

	<div
		class="animate-pan-overlay pointer-events-none absolute left-0 top-0 z-20 h-full w-full bg-opacity-15"
		class:bg-black={!enneagramType}
		class:bg-purple-900={enneagramType}
		class:yourname={displayText === 'YOUR NAME'}
	></div>

	<div
		class="relative z-30 m-1 flex h-full flex-col items-center justify-end rounded bg-opacity-10 shadow transition-all duration-300"
	>
		{#if showIcon}
			<img
				class="drop-shadow-white mt-2 w-8 filter"
				src="brand/darkRubix.webp"
				alt="rubix cube"
				loading="lazy"
			/>
		{/if}

		<div class="text-center">
			{#if showDescription && enneagramType && enneagramType > 0 && enneagramType <= 9}
				<div
					class="text-shadow m-2 rounded-lg bg-opacity-20 p-2 text-white"
					in:fly={{ y: 200, duration: 500 }}
				>
					<h2 class="mb-1 text-sm font-bold">
						{enneagramTypes[enneagramType - 1].EnneagramType}
					</h2>
				</div>
			{:else if displayText && !showDescription}
				<p
					class={`name-pop-${namePopId} text-shadow rounded-lg bg-white bg-opacity-20 text-xs font-normal uppercase tracking-wider text-white transition-opacity duration-300 group-hover:opacity-0`}
					class:yourname={displayText === 'YOUR NAME'}
					data-value={displayText}
					in:fly={{ y: -200, duration: 1500 }}
				>
					{displayText}
				</p>
			{/if}

			{#if displayText === 'YOUR NAME' && showDescription}
				<div
					class="text-shadow m-2 rounded-lg bg-white bg-opacity-20 p-2 text-white"
					in:fly={{ y: 200, duration: 500 }}
				>
					<h2 class="text-sm font-bold">What is your take?</h2>
				</div>
			{/if}

			{#if subtext}
				<p class="text-shadow my-2 text-base font-normal tracking-wider text-white">{subtext}</p>
			{/if}
		</div>
	</div>
</div>

<style>
	/* Only keeping minimal styles that might be harder to do in Tailwind */
	.yourname {
		@apply font-black text-black opacity-100;
		text-shadow: none !important;
	}

	.text-shadow {
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
	}

	.drop-shadow-white {
		filter: drop-shadow(0 0 0.3rem white);
	}

	.brightness-70 {
		filter: brightness(0.7);
	}

	.contrast-120 {
		filter: contrast(1.2);
	}

	.scale-102 {
		transform: scale(1.02);
	}

	.scale-103 {
		transform: scale(1.03);
	}

	/* Custom animations */
	@keyframes pan-overlay {
		from {
			background-position: 0 0;
		}
		to {
			background-position: 0 -100%;
		}
	}

	.animate-pan-overlay {
		background: linear-gradient(
			rgba(0, 0, 0, 0.15),
			rgba(0, 0, 0, 0.15) 3px,
			transparent 3px,
			transparent 9px
		);
		background-size: 100% 9px;
		animation: pan-overlay 22s infinite linear;
	}

	@keyframes pan-image {
		0% {
			transform: scale(1) translate(0, 0);
		}
		25% {
			transform: scale(1.03) translate(2%, 2%);
		}
		50% {
			transform: scale(1.05) translate(-2%, 2%);
		}
		75% {
			transform: scale(1.03) translate(-2%, -2%);
		}
		100% {
			transform: scale(1) translate(0, 0);
		}
	}

	.animate-pan-image {
		animation: pan-image 15s linear infinite;
	}
</style>
