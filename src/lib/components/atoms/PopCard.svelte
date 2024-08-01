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

	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let doc = false;
	let interval: NodeJS.Timeout | null = null;
	let showDescription = false;
	let innerWidth = 0;

	$: if (image && doc && scramble) {
		clearInterval(interval);
		scribbleScrabble();
	}

	onMount(() => {
		doc = true;
	});

	function scribbleScrabble() {
		const name = document.querySelector('.name-pop');
		if (!name) return;

		let iteration = 0;
		clearInterval(interval);

		interval = setInterval(() => {
			name.textContent = displayText
				.split('')
				.map((letter, index) => {
					if (index < iteration) {
						return name.dataset.value[index];
					}
					return letters[Math.floor(Math.random() * 26)];
				})
				.join('');

			if (iteration >= name.dataset.value.length) {
				clearInterval(interval);
			}
			iteration += 1 / 3;
		}, 30);
	}

	let enneagramTypeCheatSheet = [
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
		srcset="{`${image.split('/').slice(0, -1).join('/')}/s-${image
			.split('/')
			.pop()} 218w,`} {image} 560w"
		loading="lazy"
		sizes="(max-width: 560px) 218px, 560px"
		class="pop-card-image {showIcon ? 'home' : 'profileFace'} {tint &&
		showDescription &&
		enneagramType
			? 'tint'
			: ''}"
		style={showDescription && enneagramType && tint ? 'background: #ffffff4a;' : ''}
		alt={altText || displayText}
		in:fly={{ y: 200, duration: 2000 }}
	/>
	<div class="pop-card-overlay" />
	<div class="pop-card-content">
		{#if showIcon}
			<img
				loading="lazy"
				class="pop-card-icon"
				src="darkRubix.webp"
				alt="rubix cube"
				style="width: 10%;"
			/>
		{/if}

		<div class="pop-card-user flex-center">
			{#if showDescription && enneagramType}
				<div class="type-description" in:fly={{ y: 200, duration: 2000 }}>
					<h2 class="big-p">
						{enneagramTypeCheatSheet[enneagramType - 1].EnneagramType}
					</h2>
					<p class="mid-p">
						<b>Motivation:</b>
						{enneagramTypeCheatSheet[enneagramType - 1].CoreMotivation}
					</p>
					<p class="mid-p">
						<b>Fear:</b>
						{enneagramTypeCheatSheet[enneagramType - 1].CoreFear}
					</p>
					<p class="mid-p">
						<b>Stereotypes:</b>
						{enneagramTypeCheatSheet[enneagramType - 1].CommonStereotypes}
					</p>
				</div>
			{:else if displayText}
				<p class="name-pop" data-value={displayText} in:fly={{ y: -200, duration: 2000 }}>
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
	.profileFace {
		background-position: center !important;
		background-size: cover !important;
	}
	.home {
		animation: pan-image 15s linear infinite;
	}

	.pop-card {
		/* width: 500px; */
		/* width: clamp(400px, 100%, 600px); */
		display: flex;
		border: 3px solid rgb(var(--primary-rgb) / 80%);
		aspect-ratio: 10 / 16;
		border-radius: 1rem;
		background-color: rgb(var(--primary-rgb) / 15%);
		overflow: hidden;
		position: relative;
		z-index: 10;
		margin: 1rem;
	}

	.pop-card:after {
		width: 25%;
		bottom: 0rem;
		border-top-left-radius: 1rem;
		border-top-right-radius: 1rem;
	}

	@keyframes pan-overlay {
		from {
			background-position: 0% 0%;
		}

		to {
			background-position: 0% -100%;
		}
	}

	.pop-card-overlay {
		background-color: linear-gradient(
			rgb(var(--primary-rgb), 0.15),
			rgb(var(--primary-rgb), 0.15) 3px,
			transparent 3px,
			transparent 9px
		);
		background-size: 100% 9px;
		height: 100%;
		width: 100%;
		animation: pan-overlay 22s infinite linear;
		position: absolute;
		z-index: 2;
		left: 0px;
		top: 0px;
	}

	@keyframes pan-image {
		0% {
			background-position: 36% 42%;
			background-size: 200%;
		}

		20% {
			background-position: 30% 35%;
			background-size: 200%;
		}

		20.0001% {
			/* -- View 2 -- */
			background-position: 60% 85%;
			background-size: 500%;
		}

		40% {
			background-position: 49% 81%;
			background-size: 500%;
		}

		40.0001% {
			/* -- View 3 -- */
			background-position: 80% 42%;
			background-size: 300%;
		}

		60% {
			background-position: 84% 33%;
			background-size: 300%;
		}

		60.0001% {
			/* -- View 4 -- */
			background-position: 0% 0%;
			background-size: 300%;
		}

		80% {
			background-position: 15% 4%;
			background-size: 300%;
		}

		80.0001% {
			/* -- View 5 -- */
			background-position: 80% 10%;
			background-size: 300%;
		}

		100% {
			background-position: 72% 14%;
			background-size: 300%;
		}
	}

	.pop-card > .pop-card-image {
		height: 100%;
		width: 100%;
		position: absolute;
		z-index: 1;
		left: 0px;
		top: 0px;
		background-size: 300%;
		background-position: 0% 0%;
		-webkit-transition: opacity 0.5s ease-in-out;
		-moz-transition: opacity 0.5s ease-in-out;
		-o-transition: opacity 0.5s ease-in-out;
		transition: opacity 0.5s ease-in-out;
		object-fit: cover;
		/* animation: pan-image 15s linear infinite; */
	}

	.tint {
		// opacity: 0.1;
		background: inherit;
		box-shadow: inset 0 0 0 200px rgba(255, 255, 255, 0.2);
		// filter: blur(5px);
		backdrop-filter: blur(10px);
	}

	.pop-card > .pop-card-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		flex-grow: 1;
		/* gap: 4rem; */
		position: relative;
		z-index: 3;
		margin: 1rem;
		/* padding-bottom: 1rem; */
		border: 1px solid rgb(var(--primary-rgb) / 50%);
		border-radius: 0.6rem;
	}

	.pop-card > .pop-card-content > .pop-card-icon {
		color: var(--base-white-outline);
		font-size: 4rem;
		text-shadow: 0px 0px 0.5rem white;
	}

	.pop-card > .pop-card-content > .pop-card-user {
		position: relative;
	}

	.pop-card > .pop-card-content > .pop-card-user:after {
		height: 3px;
		width: 30px;
		// translate: 26px calc(-1rem - 0.5px);
	}

	.pop-card > .pop-card-content > .pop-card-user > :is(.name-pop, .link) {
		font-family: var(--font-family);
		// color: var(--base-white-outline);
		text-align: center;
		text-transform: uppercase;
	}

	.name-pop {
		font-family: var(--font-family);
		// color: var(--base-white-outline);
		text-align: center;
		text-transform: uppercase;
	}

	.pop-card > .pop-card-content > .pop-card-user > .name-pop {
		position: relative;
		font-size: 2rem;
		font-weight: 400;
		margin: 1rem;
		background: #ffffff4a;
		backdrop-filter: blur(10px);
		border-radius: 1rem;
		padding: 0 0.5rem;
	}

	.pop-card > .pop-card-content > .pop-card-user > .link {
		opacity: 0.8;
		font-size: 1.5rem;
		text-shadow: 0px 0px 0.5rem white;
		font-weight: 400;
		letter-spacing: 0.3rem;
		text-decoration: none;
	}

	/* -- Blob effect -- */

	@keyframes rotate {
		from {
			rotate: 0deg;
		}

		50% {
			scale: 1 1.5;
		}

		to {
			rotate: 360deg;
		}
	}

	.type-description {
		text-shadow: 0 0 black;
		text-wrap: balance;
		font-weight: bolder;
		background: #ffffff4a;
		backdrop-filter: blur(10px);
		border-radius: 1rem;
		padding: 0.5rem;
		height: 100%;
	}

	.big-p {
		font-size: 2rem;
	}
	.mid-p {
		font-size: 1.6rem;
	}

	@media (max-width: 700px) {
		.pop-card {
			/* scale: 0.6; */
			margin-bottom: 0rem;
			width: 100%;
		}

		.pop-card-content {
			padding-bottom: 1rem !important;
		}
		.pop-card > .pop-card-content > .pop-card-user > .name-pop {
			position: relative;
			font-size: 1.5rem;
			font-weight: 200;
			margin: 1rem;
		}

		.big-p {
			font-size: 1.7rem;
		}
		.mid-p {
			font-size: 1.5rem;
		}
	}

	@media (min-width: 500px) {
		.pop-card {
			/* width: 500px; */
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
