<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	export let image = 'cyber-campfire.webp';
	export let showIcon = true;
	export let aspectRatio = '';
	export let displayText = '';
	export let enneagramType = 0;
	export let altText = '';
	export let subtext = 'Ask questions, give your hot takes, talk to people';
	export let scramble = true;
	export let tint = true;

	const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let interval: ReturnType<typeof setInterval> | null = null;
	let showDescription = false;
	let innerWidth = 0;

	$: imageSrc = `${image.split('/').slice(0, -1).join('/')}/s-${image.split('/').pop()}`;

	const enneagramTypeCheatSheet = [
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

	let namePopId = Math.random().toString(36).substring(2);

	onMount(() => {
		if (scramble) scribbleScrabble();
		return () => clearInterval(interval);
	});

	function scribbleScrabble() {
		const name = document.querySelector(`.name-pop-${namePopId}`);
		if (!name) return;

		let iteration = 0;
		clearInterval(interval);

		interval = setInterval(() => {
			name.textContent = displayText
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
	class="pop-card"
	style="aspect-ratio: {aspectRatio};"
	title={altText || displayText}
	aria-roledescription="card"
	role="button"
	tabindex="0"
	on:mouseover={() => scramble && scribbleScrabble()}
	on:mouseenter={() => (showDescription = true)}
	on:focus={() => (showDescription = true)}
	on:mouseleave={() => (showDescription = false)}
>
	<img
		srcset="{imageSrc} 218w, {image} 560w"
		loading="lazy"
		sizes="(max-width: 560px) 218px, 560px"
		class="pop-card-image"
		class:home={showIcon}
		class:profileFace={!showIcon}
		class:tint={tint && showDescription && enneagramType}
		alt={altText || displayText}
		in:fly={{ y: 200, duration: 2000 }}
	/>
	<div class="pop-card-overlay" />
	<div class="pop-card-content">
		{#if showIcon}
			<img class="pop-card-icon" src="darkRubix.webp" alt="rubix cube" loading="lazy" />
		{/if}

		<div class="pop-card-user flex-center">
			{#if showDescription && enneagramType}
				<div class="type-description" in:fly={{ y: 200, duration: 2000 }}>
					<h2 class="big-p">{enneagramTypeCheatSheet[enneagramType - 1].EnneagramType}</h2>
					<p class="mid-p">
						<b>Motivation:</b>
						{enneagramTypeCheatSheet[enneagramType - 1].CoreMotivation}
					</p>
					<p class="mid-p"><b>Fear:</b> {enneagramTypeCheatSheet[enneagramType - 1].CoreFear}</p>
					<p class="mid-p">
						<b>Stereotypes:</b>
						{enneagramTypeCheatSheet[enneagramType - 1].CommonStereotypes}
					</p>
				</div>
			{:else if displayText}
				<p
					class={`name-pop-${namePopId} name-pop`}
					data-value={displayText}
					in:fly={{ y: -200, duration: 2000 }}
				>
					{displayText}
				</p>
			{/if}
			{#if subtext}
				<p class="link">{subtext}</p>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	$primary-rgb: var(--primary-rgb, 0, 0, 0);
	$base-white-outline: var(--base-white-outline, #ffffff);

	.pop-card {
		display: flex;
		border: 3px solid rgba($primary-rgb, 0.8);
		aspect-ratio: 10 / 16;
		border-radius: 1rem;
		background-color: rgba($primary-rgb, 0.15);
		overflow: hidden;
		position: relative;
		z-index: 10;
		margin: 1rem;

		&-overlay {
			background: linear-gradient(
				rgba($primary-rgb, 0.15),
				rgba($primary-rgb, 0.15) 3px,
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
		}

		&-image {
			height: 100%;
			width: 100%;
			position: absolute;
			z-index: 1;
			left: 0;
			top: 0;
			background-size: 300%;
			background-position: 0% 0%;
			object-fit: cover;
			transition: filter 0.3s ease-in-out;

			&.home {
				animation: pan-image 15s linear infinite;
			}

			&.profileFace {
				background-position: center;
				background-size: cover;
			}

			&.tint {
				filter: brightness(0.7) contrast(1.2);
			}
		}

		&-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-end;
			flex-grow: 1;
			position: relative;
			z-index: 3;
			margin: 1rem;
			border: 1px solid rgba($primary-rgb, 0.5);
			border-radius: 0.6rem;
			background-color: rgba($base-white-outline, 0.1);
			// backdrop-filter: blur(5px);
		}

		&-icon {
			width: 10%;
			color: $base-white-outline;
			font-size: 4rem;
			text-shadow: 0 0 0.5rem white;
		}

		&-user {
			position: relative;
			text-align: center;

			.name-pop,
			.link {
				font-family: var(--font-family);
				text-transform: uppercase;
				color: $base-white-outline;
				text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
			}

			.name-pop {
				font-size: 2rem;
				font-weight: 400;
				margin: 1rem;
				padding: 0.5rem;
				background-color: rgba($base-white-outline, 0.2);
				border-radius: 1rem;
			}

			.link {
				opacity: 0.8;
				font-size: 1.5rem;
				font-weight: 400;
				letter-spacing: 0.3rem;
				text-decoration: none;
				margin-top: 0.5rem;
			}
		}
	}

	.type-description {
		color: $base-white-outline;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
		text-wrap: balance;
		font-weight: bolder;
		background-color: rgba($base-white-outline, 0.2);
		border-radius: 1rem;
		padding: 1rem;
		margin: 1rem;

		.big-p {
			font-size: 2rem;
			margin-bottom: 0.5rem;
		}

		.mid-p {
			font-size: 1.6rem;
			margin-bottom: 0.3rem;
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

	@media (max-width: 700px) {
		.pop-card {
			margin-bottom: 0;
			width: 100%;

			&-content {
				padding: 1rem;
			}

			&-user .name-pop {
				font-size: 1.5rem;
				font-weight: 200;
			}
		}

		.type-description {
			.big-p {
				font-size: 1.7rem;
			}
			.mid-p {
				font-size: 1.5rem;
			}
		}
	}

	@media (min-width: 500px) {
		.pop-card {
			width: clamp(400px, 100%, 600px);
			max-height: 500px;
		}
	}

	@media (max-width: 400px) {
		.pop-card-user {
			.big-p {
				font-size: 1.4rem;
			}
			.mid-p {
				font-size: 1.1rem;
			}
		}
	}
</style>
