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
	class="image-card {enneagramType ? 'enneagramTypeOverlay' : ''}"
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

	<!-- Content container -->
	<div class="image-card__content">
		{#if showIcon}
			<img class="image-card__icon" src="darkRubix.webp" alt="rubix cube" loading="lazy" />
		{/if}

		<div class="image-card__text">
			{#if showDescription && enneagramType && enneagramType > 0 && enneagramType <= 9}
				<div class="enneagram-info" in:fly={{ y: 200, duration: 2000 }}>
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
			{:else if displayText}
				<p
					class={`name-pop-${namePopId} image-card__title`}
					data-value={displayText}
					in:fly={{ y: -200, duration: 2000 }}
				>
					{displayText}
				</p>
			{/if}

			{#if subtext}
				<p class="image-card__subtitle">{subtext}</p>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	// Theme variables using CSS custom properties for easy theming
	$primary-rgb: var(--primary-rgb, 0, 0, 0);
	$text-color: var(--text-color, #ffffff);
	$card-bg-opacity: var(--card-bg-opacity, 0.15);
	$content-bg-opacity: var(--content-bg-opacity, 0.1);
	$animation-speed: var(--animation-speed, 15s);
	$border-radius: var(--border-radius, 1rem);

	.enneagramTypeOverlay:hover {
		transform: translateY(-5px);
		box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);

		.image-card__content {
			backdrop-filter: blur(5px);
		}
	}

	// Base card component
	.image-card {
		display: flex;
		border: 3px solid rgba($primary-rgb, 0.8);
		border-radius: $border-radius;
		background-color: rgba($primary-rgb, $card-bg-opacity);
		overflow: hidden;
		position: relative;
		z-index: 10;
		margin: 1rem;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;

		// &:hover {
		// 	transform: translateY(-5px);
		// 	box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);

		// 	.image-card__content {
		// 		backdrop-filter: blur(5px);
		// 	}
		// }

		// Scanline overlay effect
		&__overlay {
			background: linear-gradient(
				rgba($primary-rgb, $card-bg-opacity),
				rgba($primary-rgb, $card-bg-opacity) 3px,
				transparent 3px,
				transparent 9px
			);
			background-size: 100% 9px;
			height: 100%;
			width: 100%;
			animation: pan-overlay 22s infinite linear;
			position: absolute;
			z-index: 2;
			left: 0;
			top: 0;
			pointer-events: none;
		}

		// Image styling
		&__img {
			height: 100%;
			width: 100%;
			position: absolute;
			z-index: 1;
			left: 0;
			top: 0;
			object-fit: cover;
			transition:
				filter 0.3s ease,
				transform 0.5s ease;

			&--home {
				animation: pan-image $animation-speed linear infinite;
			}

			&--profile {
				object-position: center;
			}

			&--tinted {
				filter: brightness(0.7) contrast(1.2);
				/* Only apply blur when needed */
			}
		}

		// Content container
		&__content {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-end;
			flex-grow: 1;
			position: relative;
			z-index: 3;
			margin: 1rem;
			border: 1px solid rgba($primary-rgb, 0.5);
			border-radius: calc($border-radius - 0.4rem);
			background-color: rgba($text-color, $content-bg-opacity);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
			transition: backdrop-filter 0.3s ease;
		}

		// Icon styling
		&__icon {
			width: 10%;
			min-width: 32px;
			max-width: 48px;
			filter: drop-shadow(0 0 0.5rem white);
			margin-top: 1rem;
		}

		// Text container
		&__text {
			position: relative;
			text-align: center;
			width: 100%;
			padding: 0.5rem;
		}

		// Title text styling
		&__title {
			font-family: var(--font-family, sans-serif);
			text-transform: uppercase;
			color: $text-color;
			text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
			font-size: 2rem;
			font-weight: 400;
			margin: 1rem;
			padding: 0.5rem;
			background-color: rgba($text-color, 0.2);
			border-radius: 1rem;
			letter-spacing: 0.05em;
		}

		// Subtitle styling
		&__subtitle {
			opacity: 0.8;
			font-size: 1.5rem;
			font-weight: 400;
			letter-spacing: 0.3rem;
			text-decoration: none;
			margin-top: 0.5rem;
			margin-bottom: 1rem;
			color: $text-color;
			text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
		}
	}

	// Enneagram information styling
	.enneagram-info {
		color: $text-color;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
		text-wrap: balance;
		font-weight: bolder;
		background-color: rgba($text-color, 0.2);
		border-radius: 1rem;
		padding: 1rem;
		margin: 1rem;

		&__title {
			font-size: 2rem;
			margin-bottom: 0.5rem;
		}

		&__detail {
			font-size: 1.6rem;
			margin-bottom: 0.3rem;
			line-height: 1.3;
		}
	}

	// Animation keyframes
	@keyframes pan-overlay {
		from {
			background-position: 0 0;
		}
		to {
			background-position: 0 -100%;
		}
	}

	@keyframes pan-image {
		0% {
			transform: scale(1) translate(0, 0);
		}
		25% {
			transform: scale(1.05) translate(2%, 2%);
		}
		50% {
			transform: scale(1.1) translate(-2%, 2%);
		}
		75% {
			transform: scale(1.05) translate(-2%, -2%);
		}
		100% {
			transform: scale(1) translate(0, 0);
		}
	}

	// Responsive styling
	@media (max-width: 700px) {
		.image-card {
			margin-bottom: 0;
			width: 100%;

			&__content {
				padding: 1rem;
			}

			&__title {
				font-size: 1.5rem;
				font-weight: 200;
			}
		}

		.enneagram-info {
			&__title {
				font-size: 1.7rem;
			}
			&__detail {
				font-size: 1.5rem;
			}
		}
	}

	@media (min-width: 500px) {
		.image-card {
			width: clamp(400px, 100%, 600px);
			max-height: 500px;
		}
	}

	@media (max-width: 400px) {
		.image-card__text {
			.enneagram-info {
				&__title {
					font-size: 1.4rem;
				}
				&__detail {
					font-size: 1.1rem;
				}
			}
		}
	}
</style>
