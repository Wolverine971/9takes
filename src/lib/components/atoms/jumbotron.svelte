<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	/* -- Glow effect -- */

	export let image: string = 'cyber-campfire.webp';
	export let showIcon: boolean = true;
	export let scrambleText: boolean = true;
	export let panBackground: boolean = true;

	export let aspectRatio: string = '';

	export let text: string = '9takes';
	export let subtext: string = 'Ask questions, give your hot takes, talk to people';

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

		const jumboCard = document.querySelector('.jumbo-card');
		if (jumboCard) {
			jumboCard.onmouseenter = (event: any) => {
				scribbleScrabble();
			};
		}
	});
	const scribbleScrabble = () => {
		let name = document.querySelector('.jumbo-name');
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
	role="banner"
	itemscope
	itemtype="http://schema.org/WPHeader"
	class="jumbo-card {$page.url.pathname === '/' ? 'full-jumbo-card' : ''}"
	style="aspect-ratio: {aspectRatio}; "
>
	<!-- <div
		class="jumbo-card-image {panBackground ? 'home' : 'profileFace'}"
		style="background-image: url({image});"
		in:fly={{ y: 200, duration: 2000 }}
	/> -->
	<img
		class="jumbo-card-image {panBackground ? 'home' : 'profileFace'}"
		src={image}
		in:fly={{ y: 200, duration: 2000 }}
		alt="9takes pantheon"
	/>
	<div class="jumbo-card-overlay" />
	<div class="jumbo-card-content" style="justify-content: {centerText}">
		<slot />
	</div>
</div>

<style lang="scss">
	.full-jumbo-card {
		height: 100vh;
	}

	.profileFace {
		background-position: center !important;
		background-size: cover !important;
	}

	.jumbo-card:hover {
		.profileface {
			filter: blur(1px) !important;
		}

		img {
			filter: blur(1px) !important;
		}
	}

	.home {
		animation: pan-image 15s linear infinite;
	}

	:root {
		--background-rgb: 114 33 243;
		--purple-rbg: 114 33 243;
		--primary-rgb: var(--purple-rbg);
		--blob-color-1: rgb(var(--purple-rbg));
		--blob-color-2: #801eff;
	}

	* {
		box-sizing: border-box;
	}

	.jumbo-card {
		display: flex;
		border: 2px solid rgb(var(--primary-rgb) / 80%);
		border-radius: 0.25rem;
		background-color: rgb(var(--primary-rgb) / 15%);
		overflow: hidden;
		position: relative;
		z-index: 10;
		padding: 20px;
	}

	.jumbo-card:after,
	.jumbo-card:after {
		width: 25%;
		bottom: 0;
		border-top-left-radius: 1rem;
		border-top-right-radius: 1rem;
	}

	@keyframes pan-overlay {
		from {
			background-position: 0 0;
		}

		to {
			background-position: 0 -100%;
		}
	}

	.jumbo-card-overlay {
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
		left: 0;
		top: 0;
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
			background-position: 60% 85%;
			background-size: 500%;
		}

		40% {
			background-position: 49% 81%;
			background-size: 500%;
		}

		40.0001% {
			background-position: 80% 42%;
			background-size: 300%;
		}

		60% {
			background-position: 84% 33%;
			background-size: 300%;
		}

		60.0001% {
			background-position: 0 0;
			background-size: 300%;
		}

		80% {
			background-position: 15% 4%;
			background-size: 300%;
		}

		80.0001% {
			background-position: 80% 10%;
			background-size: 300%;
		}

		100% {
			background-position: 72% 14%;
			background-size: 300%;
		}
	}

	.jumbo-card > .jumbo-card-image {
		height: 100%;
		width: 100%;
		position: absolute;
		z-index: 1;
		left: 0;
		top: 0;
		background-size: 300%;
		background-position: 0 0;
		-webkit-filter: grayscale(100%);
		filter: grayscale(100%);
		opacity: 0.6;
		object-fit: cover;
		-webkit-transition: opacity 1s ease-in-out;
		-moz-transition: opacity 1s ease-in-out;
		-o-transition: opacity 1s ease-in-out;
		transition: opacity 1s ease-in-out;
	}

	.jumbo-card > .jumbo-card-content {
		position: relative;
		z-index: 3;
		margin: 1rem;
		border: 1px solid rgb(var(--primary-rgb) / 50%);
		border-radius: 0.6rem;
		justify-content: center;
		display: flex;
		align-items: center;
		width: 100%;
	}

	@keyframes rotate {
		from {
			rotate: 0;
		}

		50% {
			scale: 1 1.5;
		}

		to {
			rotate: 360deg;
		}
	}

	#blob {
		background-color: var(--base-white-outline, var(--white));
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

	#links {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 10;
		padding: 1rem;
	}

	@media (max-width: 700px) {
		.jumbo-card {
			margin-bottom: 0;
		}

		.jumbo-name {
			text-shadow: 2px 2px #0e0e0e;
		}

		.link {
			text-shadow: 2px 2px #0e0e0e !important;
		}
	}
</style>
