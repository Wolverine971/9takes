<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	/* -- Glow effect -- */

	export let image: string = 'cyber-campfire.webp';
	export let showIcon: boolean = true;
	export let aspectRatio: string = '';

	export let displayText: string = '';
	export let enneagramType: number = 0;
	export let altText: string = '';
	export let subtext: string = 'Ask questions, give your hot takes, talk to people';

	export let tint: boolean = true;

	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let doc: boolean = false;

	$: if (image && doc) {
		if (interval) {
			clearInterval(interval);
		}
		scribbleScrabble();
	}

	let interval: string | number | NodeJS.Timeout | null | undefined = null;
	onMount(() => {
		doc = true;
		if (!showIcon) {
			return;
		}

		/* -- Text effect -- */
	});
	const scribbleScrabble = () => {
		let name = document.querySelector('.name-pop');
		let iteration = 0;

		clearInterval(interval);
		if (name) {
			interval = setInterval(() => {
				if (name) {
					name.innerText = displayText
						.split('')
						.map((letter, index) => {
							if (index < iteration) {
								return name?.dataset?.value[index];
							}

							return letters[Math.floor(Math.random() * 26)];
						})
						.join('');

					if (iteration >= name.dataset.value.length) {
						clearInterval(interval);
					}
				}

				iteration += 1 / 3;
			}, 30);
		}
	};

	let showDescription = false;

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

<!-- <caseyNeistatCareer iconStyle="" fill={''} /> -->

<div
	class="pop-card"
	style="aspect-ratio: {aspectRatio};"
	title={altText || displayText}
	on:mouseover={() => {
		scribbleScrabble();
		if (!enneagramType) {
			scribbleScrabble();
		}
	}}
	on:mouseenter={() => {
		showDescription = true;
	}}
	on:focus={() => {
		showDescription = true;
	}}
	on:mouseleave={() => {
		showDescription = false;
	}}
>
	<!-- <div
		class="pop-card-image {showIcon ? 'home' : 'profileFace'}"
		style="background-image: url({image});"
		in:fly={{ y: 200, duration: 2000 }}
	/> -->
	<img
		class="pop-card-image {showIcon ? 'home' : 'profileFace'} {tint && showDescription && 'tint'}"
		style={showDescription ? 'filter: invert !important;' : ''}
		src={image}
		alt={altText || displayText}
		in:fly={{ y: 200, duration: 2000 }}
	/>
	<div class="pop-card-overlay" />
	<div class="pop-card-content">
		<!-- <i  /> -->
		{#if showIcon}
			<img class="pop-card-icon" src="darkRubix.webp" alt="rubix cube" style="width: 10%;" />
		{/if}

		<div class="pop-card-user">
			{#if showDescription}
				<!-- {#if showDescription} -->
				<!-- transition:blur={{ amount: 10 }} -->
				<div class="type-description" in:fly={{ y: 200, duration: 2000 }}>
					<p style="font-size: 2rem;">
						<b>Type:</b>
						{enneagramTypeCheatSheet[enneagramType - 1].EnneagramType}
					</p>
					<p style="font-size: 1.5rem; text-wrap: balance;">
						<b>Motivation:</b>
						{enneagramTypeCheatSheet[enneagramType - 1].CoreMotivation}
					</p>
					<p style="font-size: 1.5rem; text-wrap: balance;">
						<b>Fear:</b>
						{enneagramTypeCheatSheet[enneagramType - 1].CoreFear}
					</p>
					<p style="font-size: 1.5rem; text-wrap: balance;">
						<b>Stereotypes:</b>
						{enneagramTypeCheatSheet[enneagramType - 1].CommonStereotypes}
					</p>
				</div>
			{/if}

			{#if !showDescription && displayText}
				<p class="name-pop" data-value={displayText} in:fly={{ y: -200, duration: 2000 }}>
					{displayText}
				</p>
			{/if}
			<!-- <a class="link" href="https://youtube.com/@Hyperplexed" class="external-link" target="_blank">@Hyperplexed</a> -->
			<p class="link">{subtext}</p>
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
	:root {
		--grex-700-hex: 64, 65, 69;
		--grex-600-hex: 96, 98, 102;
		--grex-500-hex: 126, 128, 133;
		--grex-400-hex: 159, 161, 166;

		--grex-300-hex: 186, 189, 194;
		--grey-200-hex: 213, 215, 219;
		--grey-100-hex: 232, 234, 237;

		--color-paladin-1: #f0f5f9;
		--color-paladin-2: #c9d6df;
		--color-paladin-3: #52616b;
		--color-paladin-4: #1e2922;
		// here
		--background-rgb: var(--grex-500-hex);
		--purple-rbg: var(--grex-500-hex);
		--primary-rgb: var(--grex-500-hex);

		--blob-color-1: rgb(var(--purple-rbg));
		--blob-color-2: var(--grex-400-hex);
	}

	* {
		box-sizing: border-box;
	}

	@media (min-width: 500px) {
		.pop-card {
			/* width: 500px; */
			width: clamp(400px, 100%, 600px);
			max-height: 500px;
		}
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
		background: linear-gradient(
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
		-webkit-transition: opacity 1s ease-in-out;
		-moz-transition: opacity 1s ease-in-out;
		-o-transition: opacity 1s ease-in-out;
		transition: opacity 1s ease-in-out;
		object-fit: cover;
		/* animation: pan-image 15s linear infinite; */
	}

	.tint {
		filter: invert(1);
		opacity: 0.6;
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
		color: white;
		font-size: 4rem;
		text-shadow: 0px 0px 0.5rem white;
	}

	.pop-card > .pop-card-content > .pop-card-user {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		position: relative;
	}

	.pop-card > .pop-card-content > .pop-card-user:after {
		height: 3px;
		width: 30px;
		// translate: 26px calc(-1rem - 0.5px);
	}

	.pop-card > .pop-card-content > .pop-card-user > :is(.name-pop, .link) {
		font-family: 'Source Code Pro', monospace;
		color: white;
		text-align: center;
		text-transform: uppercase;
	}

	.pop-card > .pop-card-content > .pop-card-user > .name-pop {
		position: relative;
		font-size: 3.25rem;
		font-weight: 400;
		margin: 1rem;
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

	#blob {
		background-color: white;
		height: 34vmax;
		aspect-ratio: 1;
		position: absolute;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		border-radius: 50%;
		background: linear-gradient(to right, var(--blob-color-1), var(--blob-color-2));
		animation: rotate 20s infinite;
		opacity: 0.5;
	}

	#blur {
		height: 100%;
		width: 100%;
		position: absolute;
		z-index: 2;
		backdrop-filter: blur(12vmax);
	}

	/* -- Links -- */

	#links {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		position: absolute;
		top: 0px;
		left: 0px;
		z-index: 10;
		padding: 1rem;
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
	}
</style>
