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
	class="image-card {enneagramType ? 'enneagramTypeOverlay' : ''}"
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
			class="image-card__img
		       {showIcon ? 'image-card__img--home' : 'image-card__img--profile'}
		       {tint && showDescription && enneagramType ? 'image-card__img--tinted' : ''}"
			alt={altText || displayText}
			in:fly={{ y: 200, duration: 1500 }}
		/>
	{/if}

	<div class="image-card__overlay {displayText === 'YOUR NAME' ? 'your_name' : ''}" />

	<div class="image-card__content">
		{#if showIcon}
			<img class="image-card__icon" src="darkRubix.webp" alt="rubix cube" loading="lazy" />
		{/if}

		<div class="image-card__text">
			{#if showDescription && enneagramType && enneagramType > 0 && enneagramType <= 9}
				<div class="enneagram-info" in:fly={{ y: 200, duration: 500 }}>
					<h2 class="enneagram-info__title">
						{enneagramTypes[enneagramType - 1].EnneagramType}
					</h2>
				</div>
			{:else if displayText}
				<p
					class="{`name-pop-${namePopId} image-card__title`} {displayText === 'YOUR NAME'
						? 'your_name'
						: ''}"
					data-value={displayText}
					in:fly={{ y: -200, duration: 1500 }}
				>
					{displayText}
				</p>
			{/if}

			{#if displayText === 'YOUR NAME' && showDescription}
				<div class="enneagram-info" in:fly={{ y: 200, duration: 500 }}>
					<h2 class="enneagram-info__title">What is your take?</h2>
				</div>
			{/if}

			{#if subtext}
				<p class="image-card__subtitle">{subtext}</p>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	$primary-rgb: var(--primary-rgb, 0, 0, 0);
	$text-color: var(--text-color, #ffffff);
	$card-bg-opacity: var(--card-bg-opacity, 0.15);
	$content-bg-opacity: var(--content-bg-opacity, 0.1);
	$animation-speed: var(--animation-speed, 15s);
	$border-radius: var(--border-radius, 0.5rem);

	.your_name {
		opacity: 1 !important;
		color: black !important;
		text-shadow: none !important;
		animation: none !important;
		font-weight: 900 !important;
	}
	.image-card {
		width: 100%;
		height: 100%;
		position: relative;
		z-index: 1;
		border: 1px solid rgba($primary-rgb, 0.6);
		border-radius: $border-radius;
		background-color: rgba($primary-rgb, $card-bg-opacity);
		overflow: hidden;

		&:hover {
			/* Subtle hover scale */
			transform: scale(1.02);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
		}

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

		&__img {
			width: 100%;
			height: 100%;
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
			}
		}

		&__content {
			position: relative;
			z-index: 3;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-end;
			border-radius: calc($border-radius - 0.2rem);
			background-color: rgba($text-color, $content-bg-opacity);
			transition: backdrop-filter 0.3s ease;
			margin: 0.3rem;
			box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
		}

		&__icon {
			width: 32px;
			filter: drop-shadow(0 0 0.3rem white);
			margin-top: 0.5rem;
		}

		&__text {
			// padding: 0.5rem;
			text-align: center;
		}

		/* Smaller text, plus transitions for hover fade-out */
		&__title {
			color: $text-color;
			font-size: 0.8rem; /* smaller than before */
			font-weight: 400;
			// margin: 0.5rem;
			// padding: 0.2rem 0.5rem;
			background-color: rgba($text-color, 0.2);
			border-radius: 0.5rem;
			text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
			text-transform: uppercase;
			letter-spacing: 0.05em;

			/* Fade out & color shift on hover */
			transition:
				opacity 0.3s ease,
				color 0.3s ease;
		}
		.image-card:hover &__title {
			/* becomes nearly invisible */
			opacity: 0;
			/* Optionally shift color slightly before it fades out */
			// color: lighten($text-color, 10%);
		}

		&__subtitle {
			font-size: 1rem;
			font-weight: 400;
			letter-spacing: 0.2rem;
			margin: 0.5rem 0;
			color: $text-color;
			text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
		}
	}

	.enneagramTypeOverlay:hover {
		transform: scale(1.03);
		box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
	}

	h2 {
		padding: 0;
		margin: 0;
	}

	.enneagram-info {
		color: $text-color;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
		font-weight: bold;
		background-color: rgba($text-color, 0.2);
		border-radius: 0.5rem;
		padding: 0.5rem;
		margin: 0.5rem;

		&__title {
			font-size: 0.8rem;
			margin-bottom: 0.3rem;
		}
		&__detail {
			font-size: 1rem;
			line-height: 1.3;
			margin-bottom: 0.2rem;
		}
	}

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

	@media (max-width: 400px) {
		.image-card__text {
			padding: 0;
		}
	}
</style>
