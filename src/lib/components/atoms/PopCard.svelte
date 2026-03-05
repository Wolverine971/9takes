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
	let isTouchDevice = false;

	// Generate a unique ID for the text animation
	const namePopId = Math.random().toString(36).substring(2);

	// Create optimized image src path for responsive loading
	$: imageSrc = `${image.split('/').slice(0, -1).join('/')}/s-${image.split('/').pop()}`;

	// Data for enneagram type descriptions
	// Each type has a core emotion AND a stance toward that emotion
	const enneagramTypes = [
		{
			EnneagramType: 'Type 1 - The Perfectionist',
			CoreMotivation: 'To be good, ethical, and correct.',
			CoreFear: 'Being corrupt or defective.',
			CoreEmotion: 'Anger',
			EmotionalStance: 'Internalizes anger into inner critic'
		},
		{
			EnneagramType: 'Type 2 - The Helper',
			CoreMotivation: 'To be loved and appreciated.',
			CoreFear: 'Being unloved or unwanted.',
			CoreEmotion: 'Shame',
			EmotionalStance: 'Represses shame through giving'
		},
		{
			EnneagramType: 'Type 3 - The Achiever',
			CoreMotivation: 'To succeed and be admired.',
			CoreFear: 'Being worthless or a failure.',
			CoreEmotion: 'Shame',
			EmotionalStance: 'Compensates shame with performance'
		},
		{
			EnneagramType: 'Type 4 - The Individualist',
			CoreMotivation: 'To be unique and authentic.',
			CoreFear: 'Having no identity or significance.',
			CoreEmotion: 'Shame',
			EmotionalStance: 'Identifies with shame as identity'
		},
		{
			EnneagramType: 'Type 5 - The Investigator',
			CoreMotivation: 'To be knowledgeable and competent.',
			CoreFear: 'Being useless or incompetent.',
			CoreEmotion: 'Fear',
			EmotionalStance: 'Withdraws from fear into mind'
		},
		{
			EnneagramType: 'Type 6 - The Loyalist',
			CoreMotivation: 'To have security and support.',
			CoreFear: 'Being without guidance or support.',
			CoreEmotion: 'Fear',
			EmotionalStance: 'Engages fear through vigilance'
		},
		{
			EnneagramType: 'Type 7 - The Enthusiast',
			CoreMotivation: 'To be happy and satisfied.',
			CoreFear: 'Being deprived or trapped in pain.',
			CoreEmotion: 'Fear',
			EmotionalStance: 'Reframes fear into possibilities'
		},
		{
			EnneagramType: 'Type 8 - The Challenger',
			CoreMotivation: 'To be in control and self-reliant.',
			CoreFear: 'Being controlled or manipulated.',
			CoreEmotion: 'Anger',
			EmotionalStance: 'Expresses anger as fuel'
		},
		{
			EnneagramType: 'Type 9 - The Peacemaker',
			CoreMotivation: 'To have inner and outer peace.',
			CoreFear: 'Conflict and disconnection.',
			CoreEmotion: 'Anger',
			EmotionalStance: 'Suppresses anger for harmony'
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

	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		if (scramble) startTextScramble();
		showDescription = !showDescription;
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
	on:mouseenter={() => {
		if (!isTouchDevice) showDescription = true;
	}}
	on:focus={() => {
		if (!isTouchDevice) showDescription = true;
	}}
	on:blur={() => {
		if (!isTouchDevice) showDescription = false;
	}}
	on:mouseleave={() => {
		if (!isTouchDevice) showDescription = false;
	}}
	on:touchstart={() => {
		isTouchDevice = true;
	}}
	on:click={() => {
		if (isTouchDevice) showDescription = !showDescription;
	}}
	on:keydown={handleKeydown}
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
		</div>
	</div>

	<!-- Enneagram overlay - tech spec analysis HUD -->
	{#if enneagramType && enneagramType > 0 && enneagramType <= 9}
		<div class="enneagram-overlay" class:enneagram-overlay--visible={showDescription}>
			<div class="spec-hud">
				<div class="spec-hud__corner spec-hud__corner--tl"></div>
				<div class="spec-hud__corner spec-hud__corner--tr"></div>
				<div class="spec-hud__corner spec-hud__corner--bl"></div>
				<div class="spec-hud__corner spec-hud__corner--br"></div>

				<div class="spec-hud__header">
					<span class="spec-hud__label">SUBJECT ANALYSIS</span>
					<span class="spec-hud__type-badge">TYPE {enneagramType}</span>
				</div>

				{#if subtext}
					<div class="spec-hud__row">
						<span class="spec-hud__key">DESIGNATION</span>
						<span class="spec-hud__val">{subtext}</span>
					</div>
				{/if}

				<div class="spec-hud__row">
					<span class="spec-hud__key">CLASS</span>
					<span class="spec-hud__val"
						>{enneagramTypes[enneagramType - 1].EnneagramType.split(' - ')[1]}</span
					>
				</div>

				<div class="spec-hud__divider"></div>

				<div class="spec-hud__row">
					<span class="spec-hud__key">CORE DRIVE</span>
					<span class="spec-hud__val">{enneagramTypes[enneagramType - 1].CoreMotivation}</span>
				</div>

				<div class="spec-hud__row">
					<span class="spec-hud__key">CORE FEAR</span>
					<span class="spec-hud__val">{enneagramTypes[enneagramType - 1].CoreFear}</span>
				</div>

				<div class="spec-hud__divider"></div>

				<div class="spec-hud__row spec-hud__row--highlight">
					<span class="spec-hud__key"
						>{enneagramTypes[enneagramType - 1].CoreEmotion.toUpperCase()}</span
					>
					<span class="spec-hud__val">{enneagramTypes[enneagramType - 1].EmotionalStance}</span>
				</div>
			</div>
			<div class="spec-hud__scanlines"></div>
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
		opacity: 0;
		backdrop-filter: blur(0);
		background: rgba(0, 0, 0, 0);
		transition:
			opacity 0.3s ease,
			backdrop-filter 0.4s ease,
			background 0.4s ease;
		pointer-events: none;

		.spec-hud {
			transform: translateY(20px);
			opacity: 0;
			transition:
				transform 0.35s ease 0.1s,
				opacity 0.35s ease 0.1s;
		}

		&--visible {
			opacity: 1;
			backdrop-filter: blur(6px);
			background: rgba(0, 5, 15, 0.7);
			pointer-events: auto;

			.spec-hud {
				transform: translateY(0);
				opacity: 1;
			}
		}
	}

	// Scanline effect over entire overlay
	.spec-hud__scanlines {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: repeating-linear-gradient(
			0deg,
			transparent,
			transparent 2px,
			rgba(255, 255, 255, 0.015) 2px,
			rgba(255, 255, 255, 0.015) 4px
		);
		border-radius: inherit;
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

	// Tech spec HUD panel
	.spec-hud {
		position: relative;
		font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
		color: rgba(255, 255, 255, 0.9);
		padding: 1.25rem 1.5rem;
		margin: 1rem;
		max-width: 92%;
		text-align: left;
		border: 1px solid rgba(124, 58, 237, 0.4);
		background: rgba(10, 10, 25, 0.5);

		// Corner bracket accents
		&__corner {
			position: absolute;
			width: 12px;
			height: 12px;
			border-color: rgba(124, 58, 237, 0.8);
			border-style: solid;

			&--tl {
				top: -1px;
				left: -1px;
				border-width: 2px 0 0 2px;
			}
			&--tr {
				top: -1px;
				right: -1px;
				border-width: 2px 2px 0 0;
			}
			&--bl {
				bottom: -1px;
				left: -1px;
				border-width: 0 0 2px 2px;
			}
			&--br {
				bottom: -1px;
				right: -1px;
				border-width: 0 2px 2px 0;
			}
		}

		&__header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 0.75rem;
			padding-bottom: 0.5rem;
			border-bottom: 1px solid rgba(124, 58, 237, 0.3);
		}

		&__label {
			font-size: clamp(0.6rem, 1.8vw, 0.7rem);
			letter-spacing: 0.15em;
			color: rgba(167, 139, 250, 0.8);
			text-transform: uppercase;
		}

		&__type-badge {
			font-size: clamp(0.6rem, 1.8vw, 0.7rem);
			letter-spacing: 0.1em;
			color: #a78bfa;
			border: 1px solid rgba(124, 58, 237, 0.5);
			padding: 0.15rem 0.5rem;
			font-weight: 700;
		}

		&__divider {
			height: 1px;
			background: linear-gradient(
				90deg,
				transparent,
				rgba(124, 58, 237, 0.3) 20%,
				rgba(124, 58, 237, 0.3) 80%,
				transparent
			);
			margin: 0.4rem 0;
		}

		&__row {
			display: flex;
			gap: 0.75rem;
			margin: 0.35rem 0;
			line-height: 1.4;
			align-items: baseline;

			&--highlight {
				margin-top: 0.25rem;
				.spec-hud__key {
					color: #c4b5fd;
				}
				.spec-hud__val {
					font-style: italic;
					color: rgba(255, 255, 255, 0.8);
				}
			}
		}

		&__key {
			font-size: clamp(0.55rem, 1.6vw, 0.65rem);
			letter-spacing: 0.1em;
			color: rgba(167, 139, 250, 0.7);
			white-space: nowrap;
			flex-shrink: 0;
			padding-top: 0.1rem;
		}

		&__val {
			font-size: clamp(0.75rem, 2.2vw, 0.9rem);
			color: rgba(255, 255, 255, 0.9);
			font-weight: 500;
			text-wrap: pretty;
		}
	}
</style>
