<!-- src/lib/components/atoms/PopCard.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { browser } from '$app/environment';

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
	// LCP optimization props
	export let lazyLoad = true; // Set to false for hero/LCP images
	export let priority = false; // Set to true for LCP images to add fetchpriority="high"

	// Constants and state variables
	const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let interval: ReturnType<typeof setInterval> | null = null;
	let showDescription = false;

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

	// Start text scramble animation on component mount - deferred for performance
	onMount(() => {
		if (scramble && browser) {
			// Defer scramble animation to avoid blocking LCP
			if ('requestIdleCallback' in window) {
				(window as any).requestIdleCallback(() => startTextScramble(), { timeout: 500 });
			} else {
				setTimeout(startTextScramble, 100);
			}
		}
		return () => {
			if (interval) clearInterval(interval);
		};
	});

	/**
	 * Animates the text with a scrambling effect
	 */
	function startTextScramble() {
		const nameElement = document.querySelector(`.name-pop-${namePopId}`);
		if (!nameElement) return;

		let iteration = 0;
		if (interval) clearInterval(interval);

		interval = setInterval(() => {
			nameElement.textContent = displayText
				.split('')
				.map((_, index) =>
					index < iteration ? displayText[index] : LETTERS[Math.floor(Math.random() * 26)]
				)
				.join('');

			if (iteration >= displayText.length && interval) {
				clearInterval(interval);
			}
			iteration += 1 / 3;
		}, 30);
	}
</script>

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
	{#if priority}
		<!-- LCP/Hero image - no transition, eager loading, high priority -->
		<img
			src={image}
			srcset="{imageSrc} 218w, {image} 560w"
			loading="eager"
			fetchpriority="high"
			decoding="async"
			sizes="(max-width: 560px) 218px, 560px"
			class="image-card__img"
			class:image-card__img--home={showIcon}
			class:image-card__img--profile={!showIcon}
			class:image-card__img--tinted={tint && showDescription && enneagramType}
			alt={altText || displayText}
		/>
	{:else}
		<!-- Regular image with lazy loading and transition -->
		<img
			src={image}
			srcset="{imageSrc} 218w, {image} 560w"
			loading={lazyLoad ? 'lazy' : 'eager'}
			decoding="async"
			sizes="(max-width: 560px) 218px, 560px"
			class="image-card__img"
			class:image-card__img--home={showIcon}
			class:image-card__img--profile={!showIcon}
			class:image-card__img--tinted={tint && showDescription && enneagramType}
			alt={altText || displayText}
			in:fly={{ y: 200, duration: 2000 }}
		/>
	{/if}

	<!-- Overlay with scanline effect -->
	<div class="image-card__overlay"></div>

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

	<!-- Enneagram overlay - always rendered, visibility controlled by CSS -->
	{#if enneagramType && enneagramType > 0 && enneagramType <= 9}
		<div class="enneagram-overlay" class:enneagram-overlay--visible={showDescription}>
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
	// Shared glass effect mixin
	@mixin glass($bg-opacity: 0.3, $blur: 8px, $border-opacity: 0.2) {
		background-color: rgba(0, 0, 0, $bg-opacity);
		backdrop-filter: blur($blur);
		border: 1px solid rgba(255, 255, 255, $border-opacity);
	}

	// Override global hover effect - keep card still
	.image-card-base:hover {
		transform: none;
	}

	// Full-card overlay - starts invisible, fades in on hover
	.enneagram-overlay {
		position: absolute;
		inset: 0;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: inherit;
		// Start hidden
		opacity: 0;
		backdrop-filter: blur(0);
		transition:
			opacity 0.3s ease,
			backdrop-filter 0.4s ease;
		pointer-events: none;

		// Text panel starts translated down
		.enneagram-info {
			transform: translateY(30px);
			opacity: 0;
			transition:
				transform 0.4s ease 0.15s,
				opacity 0.4s ease 0.15s;
		}

		// Visible state on hover
		&--visible {
			opacity: 1;
			backdrop-filter: blur(12px);
			pointer-events: auto;

			.enneagram-info {
				transform: translateY(0);
				opacity: 1;
			}
		}
	}

	// Content positioning overrides
	.image-card__content {
		position: absolute;
		inset: auto 1rem 1rem;
		background: transparent;
		border: none;
		margin: 0;
		padding: 0;
	}

	.image-card__text {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		background: transparent;
		padding: 0;
	}

	// Title with glass effect - min-height prevents CLS during font loading
	.image-card__title {
		@include glass(0.3, 8px, 0.2);
		padding: 0.75rem;
		margin: 0;
		border-radius: 1rem;
		color: white;
		min-height: 1.5em; // Reserve space to prevent layout shift
		display: flex;
		align-items: center;
		justify-content: center;
	}

	// Subtitle with glass effect
	.image-card__subtitle {
		@include glass(0.5, 6px, 0.15);
		padding: 0.5rem 1rem;
		margin: 0;
		border-radius: 0.75rem;
	}

	// Enneagram info panel - white text, high contrast
	.enneagram-info {
		@include glass(0.5, 10px, 0.3);
		color: white;
		text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
		text-wrap: balance;
		font-weight: 600;
		border-radius: 1rem;
		padding: 1.5rem;
		margin: 1rem;
		max-width: 90%;
		text-align: center;

		&__title {
			font-size: clamp(1.4rem, 4vw, 2rem);
			margin-bottom: 0.75rem;
			color: white;
			font-weight: 700;
		}

		&__detail {
			font-size: clamp(1rem, 3vw, 1.4rem);
			margin-bottom: 0.5rem;
			line-height: 1.4;
			color: white;

			b {
				font-weight: 700;
			}
		}
	}
</style>
