<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	/* -- Glow effect -- */

	export let image: string = 'cyber-campfire.webp';
	export let showIcon: boolean = true;
	export let scrambleText: boolean = true;
	export let panBackground: boolean = true;

	export let aspectRatio: string = '';

	export let text: string = '9takes';
	export let subtext: string = 'Ask questions, share your story, get curious';

	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let doc: boolean = false;
	let centerText = (!showIcon && !subtext) || showIcon ? 'center' : '';

	$: if (image && doc) {
		if (interval) {
			clearInterval(interval);
		}
		scribbleScrabble();
	}

	let interval: string | number | NodeJS.Timeout | null | undefined = null;
	onMount(() => {
		doc = true;
		if (!scrambleText) {
			return;
		}

		/* -- Text effect -- */

		const screen = document.querySelector('.screen');
		if (screen) {
			screen.onmouseenter = (event: any) => {
				scribbleScrabble();
			};
		}
	});
	const scribbleScrabble = () => {
		let name = document.querySelector('.name');
		let iteration = 0;

		clearInterval(interval);

		interval = setInterval(() => {
			name.innerText = text
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
	};
</script>

<div
	class="screen {$page.url.pathname === '/' ? 'full-screen' : ''}"
	style="aspect-ratio: {aspectRatio}; "
>
	<div
		class="screen-image {panBackground ? 'home' : 'profileFace'}"
		style="background-image: url({image});"
		in:fly={{ y: 200, duration: 2000 }}
	/>
	<div class="screen-overlay" />
	<div class="screen-content" style="justify-content: {centerText}">
		<!-- <i  /> -->
		{#if showIcon}
			<img
				class="screen-icon fa-brands fa-codepen"
				src="enneagram.svg"
				alt=""
				style="width: 10%;"
			/>
		{/if}

		<div class="screen-user">
			<p class="name" data-value={text}>{text}</p>
			{#if subtext}
				<p class="link">{subtext}</p>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.full-screen {
		height: 100vh;
		// width: 100vw;
	}
	.profileFace {
		background-position: center !important;
		background-size: cover !important;
	}
	.home {
		animation: pan-image 15s linear infinite;
	}
	:root {
		/* --background-rgb: 29 30 34;

		--purple-rbg: 33 150 243; */

		--background-rgb: 114 33 243;
		--purple-rbg: 114 33 243;
		--primary-rgb: var(--purple-rbg);

		--blob-color-1: rgb(var(--purple-rbg));
		--blob-color-2: rgb(128, 30, 255);
	}

	* {
		box-sizing: border-box;
	}

	/* body {
		height: 100vh;
		display: grid;
		place-items: center;
		background-color: rgb(var(--background-rgb));
		margin: 0rem;
		overflow: hidden;
	} */
	@media (min-width: 500px) {
		.screen {
			/* width: 500px; */
			/* width: clamp(400px, 100%, 600px); */
		}
	}

	.screen {
		/* width: 500px; */
		/* width: clamp(400px, 100%, 600px); */
		display: flex;
		border: 2px solid rgb(var(--primary-rgb) / 80%);
		/* aspect-ratio: 10 / 16; */
		border-radius: 0.25rem;
		background-color: rgb(var(--primary-rgb) / 15%);
		overflow: hidden;
		position: relative;
		z-index: 10;

		/* header { */
		/* background-color: #333; */
		/* background-image: url('/background.png'); */
		/* color: #fff; */
		padding: 20px;
		/* aspect-ratio: 16 / 6; */
		/* display: flex;
		flex-direction: column;
		justify-content: center; */
		/* } */
	}

	.screen:after,
	/* .screen:before {
		content: '';
		height: 5px;
		position: absolute;
		z-index: 4;
		left: 50%;
		translate: -50% 0%;
		background-color: white;
	}

	.screen:before {
		width: 15%;
		top: 0rem;
		border-bottom-left-radius: 1rem;
		border-bottom-right-radius: 1rem;
	} */

	.screen:after {
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

	.screen-overlay {
		background: linear-gradient(
			rgb(var(--primary-rgb) / 0.15),
			rgb(var(--primary-rgb) / 0.15) 3px,
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

	.screen > .screen-image {
		/* background-image: url('https://images.unsplash.com/photo-1515266591878-f93e32bc5937?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2574&q=80'); */
		/* background-image: url('cyber-campfire.png'); */
		height: 100%;
		width: 100%;
		position: absolute;
		z-index: 1;
		left: 0px;
		top: 0px;
		background-size: 300%;
		background-position: 0% 0%;
		/* filter: sepia(100%) hue-rotate(160deg); */
		opacity: 0.6;
		-webkit-transition: opacity 1s ease-in-out;
		-moz-transition: opacity 1s ease-in-out;
		-o-transition: opacity 1s ease-in-out;
		transition: opacity 1s ease-in-out;
		/* animation: pan-image 15s linear infinite; */
	}

	.screen > .screen-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		flex-grow: 1;
		/* gap: 4rem; */
		position: relative;
		z-index: 3;
		margin: 1rem;
		/* padding-bottom: 6rem; */
		border: 1px solid rgb(var(--primary-rgb) / 50%);
		border-radius: 0.6rem;
	}

	.screen > .screen-content > .screen-icon {
		color: white;
		font-size: 4rem;
		text-shadow: 0px 0px 0.5rem white;
	}

	.screen > .screen-content > .screen-user {
		display: flex;
		flex-direction: column;
		align-items: center;
		/* gap: 1rem; */
		position: relative;
	}

	/* .screen > .screen-content > .screen-user:before,
	.screen > .screen-content > .screen-user:after {
		content: '';
		position: absolute;
		top: 0px;
		background-color: rgb(var(--primary-rgb));
		border-radius: 1rem;
		box-shadow: 0px 0px 8px 3px rgb(var(--primary-rgb) / 60%);
	}

	.screen > .screen-content > .screen-user:before {
		height: 2px;
		width: 50px;
		translate: -20px -1rem;
		opacity: 0.75;
	} */

	.screen > .screen-content > .screen-user:after {
		height: 3px;
		width: 30px;
		translate: 26px calc(-1rem - 0.5px);
	}

	.screen > .screen-content > .screen-user > :is(.name, .link) {
		font-family: 'Source Code Pro', monospace;
		color: white;
		text-align: center;
		text-transform: uppercase;
	}

	.screen > .screen-content > .screen-user > .name {
		position: relative;
		font-size: 3.25rem;
		font-weight: 400;
		margin: 1rem;
	}

	/* .screen > .screen-content > .screen-user > .name:before,
	.screen > .screen-content > .screen-user > .name:after {
		content: '';
		height: 4px;
		width: 4px;
		position: absolute;
		border: 2px solid white;
		border-radius: 2px;
	}

	.screen > .screen-content > .screen-user > .name:before {
		top: 55%;
		right: -1.5rem;
	}

	.screen > .screen-content > .screen-user > .name:after {
		top: 45%;
		left: -1.5rem;
	} */

	.screen > .screen-content > .screen-user > .link {
		opacity: 0.8;
		font-size: 1.5rem;
		text-shadow: 0px 0px 0.5rem white;
		font-weight: 400;
		letter-spacing: 0.3rem;
		text-decoration: none;
	}

	.screen > .screen-content > .screen-user > .link:is(:hover, :focus) {
		text-decoration: underline;
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
		.screen {
			/* scale: 0.6; */
			margin-bottom: 0rem;
		}

		.screen-content {
			/* padding-bottom: 1rem !important; */
		}
	}
</style>
