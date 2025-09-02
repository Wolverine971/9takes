<!-- src/lib/components/atoms/PopCard.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	// Component props with default values
	export let image = 'cyber-campfire.webp';
	export let showIcon = true;
	export let aspectRatio = '10 / 16';
	export let displayText = '';
	export let enneagramType = 0;
	export let altText = '';
	export let subtext = 'Ask questions, give your hot takes, talk to people';
	export let scramble = true;
	export let tint = true;
	export let lazyLoad = true;

	// Constants and state variables
	const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let interval: ReturnType<typeof setInterval> | null = null;
	let showDescription = false;
	let innerWidth = 0;

	// Generate a unique ID for the text animation
	const namePopId = Math.random().toString(36).substring(2);

	// Create optimized image src path for responsive loading
	$: imageSrc = `${image.split('/').slice(0, -1).join('/')}/s-${image.split('/').pop()}`;

	// Data for enneagram type descriptions
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

	// Start text scramble animation on component mount
	onMount(() => {
		if (scramble) startTextScramble();
		return () => clearInterval(interval);
	});

	/**
	 * Animates the text with a scrambling effect
	 */
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
	class="image-card-base {enneagramType ? 'enneagram-card' : ''}"
	style="aspect-ratio: {aspectRatio};"
	title={altText || displayText}
	aria-roledescription="card"
	role="button"
	tabindex="0"
	on:mouseover={() => scramble && startTextScramble()}
	on:mouseenter={() => (showDescription = true)}
	on:focus={() => (showDescription = true)}
	on:mouseleave={() => (showDescription = false)}
>
	<!-- Responsive image with proper loading attributes -->
	<img
		srcset="{imageSrc} 218w, {image} 560w"
		loading="lazy"
		sizes="(max-width: 560px) 218px, 560px"
		class="image-card__img"
		class:image-card__img--home={showIcon}
		class:image-card__img--profile={!showIcon}
		class:image-card__img--tinted={tint && showDescription && enneagramType}
		alt={altText || displayText}
		in:fly={{ y: 200, duration: 2000 }}
	/>

	<!-- Overlay with scanline effect -->
	<div class="image-card__overlay" />

	<!-- Content container positioned at bottom -->
	<div class="image-card__content">
		{#if showIcon}
			<img class="image-card__icon" src="brand/darkRubix.webp" alt="rubix cube" loading="lazy" />
		{/if}

		<div class="image-card__text">
			{#if displayText && !showDescription}
				<p
					class={`name-pop-${namePopId} image-card__title`}
					data-value={displayText}
					in:fly={{ y: -200, duration: 2000 }}
				>
					{displayText}
				</p>
			{/if}

			{#if subtext && !showDescription}
				<p class="image-card__subtitle">{subtext}</p>
			{/if}
		</div>
	</div>

	<!-- Enneagram overlay that fills entire card -->
	{#if showDescription && enneagramType && enneagramType > 0 && enneagramType <= 9}
		<div class="enneagram-overlay" in:fly={{ y: 200, duration: 2000 }}>
			<div class="enneagram-info">
				<h2 class="enneagram-info__title">{enneagramTypes[enneagramType - 1].EnneagramType}</h2>
				<p class="enneagram-info__detail">
					<b>Motivation:</b>
					{enneagramTypes[enneagramType - 1].CoreMotivation}
				</p>
				<p class="enneagram-info__detail">
					<b>Fear:</b>
					{enneagramTypes[enneagramType - 1].CoreFear}
				</p>
				<p class="enneagram-info__detail">
					<b>Stereotypes:</b>
					{enneagramTypes[enneagramType - 1].CommonStereotypes}
				</p>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	// Enneagram card specific behavior
	.enneagram-card {
		&:hover {
			transform: translateY(-5px);
			box-shadow: 0 12px 28px rgba(0, 0, 0, 0.067);
		}
	}

	// Full-card overlay for enneagram info - just blur, no dark background
	.enneagram-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(15px);
		border-radius: inherit;
	}

	// Override content positioning for proper bottom placement
	:global(.image-card-base) .image-card__content {
		position: absolute;
		bottom: 1rem;
		left: 1rem;
		right: 1rem;
		background: transparent;
		border: none;
		margin: 0;
		padding: 0;
	}

	// Text container styling - minimal
	:global(.image-card-base) .image-card__text {
		background: transparent;
		padding: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	// Title styling - single clean background
	:global(.image-card-base) .image-card__title {
		background-color: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(8px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		padding: 0.75rem 0.75rem;
		margin: 0;
		border-radius: 1rem;
		display: inline-block;
		width: auto;
		color: white;
	}

	// Subtitle styling - single clean background
	:global(.image-card-base) .image-card__subtitle {
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(6px);
		border: 1px solid rgba(255, 255, 255, 0.15);
		padding: 0.5rem 1rem;
		border-radius: 0.75rem;
		display: inline-block;
		width: auto;
		margin: 0;
	}

	// Enneagram info styling within overlay
	.enneagram-info {
		color: white;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
		text-wrap: balance;
		font-weight: bolder;
		background-color: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 1rem;
		padding: 2rem;
		margin: 1rem;
		max-width: 90%;
		text-align: center;
		backdrop-filter: blur(10px);

		&__title {
			font-size: 2rem;
			margin-bottom: 1rem;

			@media (max-width: 700px) {
				font-size: 1.7rem;
			}

			@media (max-width: 400px) {
				font-size: 1.4rem;
			}
		}

		&__detail {
			color: white;
			font-size: 1.6rem;
			margin-bottom: 0.75rem;
			line-height: 1.4;

			@media (max-width: 700px) {
				font-size: 1.5rem;
			}

			@media (max-width: 400px) {
				font-size: 1.1rem;
			}
		}
	}
</style>
