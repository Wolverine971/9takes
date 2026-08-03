<!-- src/lib/components/atoms/jumbotron.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	export let image = 'cyber-campfire.webp';
	export let showIcon = true;
	export let scrambleText = true;
	export let panBackground = true;
	export let aspectRatio = '';
	export let text = '9takes';
	export let subtext = 'Ask questions, give your hot takes, talk to people';

	const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let interval: ReturnType<typeof setInterval> | null = null;

	$: centerText = (!showIcon && !subtext) || showIcon ? 'center' : '';

	function scribbleScrabble() {
		if (!scrambleText) return;
		if (interval) clearInterval(interval);
		const name = document.querySelector('.jumbo-name');
		if (!name) return;

		let iteration = 0;
		interval = setInterval(() => {
			name.textContent = text
				.split('')
				.map((letter, index) =>
					index < iteration ? text[index] : LETTERS[Math.floor(Math.random() * 26)]
				)
				.join('');

			if (iteration >= text.length) {
				if (interval) clearInterval(interval);
			}
			iteration += 1 / 3;
		}, 30);
	}

	onMount(() => {
		if (scrambleText) {
			const jumboCard = document.querySelector('.jumbo-card');
			jumboCard?.addEventListener('mouseenter', scribbleScrabble);
			return () => {
				if (interval) clearInterval(interval);
				jumboCard?.removeEventListener('mouseenter', scribbleScrabble);
			};
		}
	});
</script>

<div
	role="banner"
	itemscope
	itemtype="http://schema.org/WPHeader"
	class="jumbo-card"
	class:full-jumbo-card={$page.url.pathname === '/'}
	style="aspect-ratio: {aspectRatio};"
	on:mouseenter={scribbleScrabble}
>
	<img
		class="jumbo-card-image"
		class:home={panBackground}
		class:profileFace={!panBackground}
		src={image}
		in:fly={{ y: 200, duration: 2000 }}
		alt="9takes pantheon"
	/>
	<div class="jumbo-card-overlay"></div>
	<div class="jumbo-card-content" style="justify-content: {centerText}">
		<slot />
	</div>
</div>

<style lang="scss">
	.jumbo-card {
		display: flex;
		border: 2px solid color-mix(in srgb, var(--lamp-glow) 80%, transparent);
		border-radius: 0.25rem;
		background-color: color-mix(in srgb, var(--lamp-glow) 15%, var(--night-deep));
		overflow: hidden;
		position: relative;
		z-index: 10;
		padding: 20px;

		&.full-jumbo-card {
			height: 100vh;
		}

		&:hover .jumbo-card-image {
			filter: blur(1px);
		}
	}

	.jumbo-card-overlay {
		background: linear-gradient(
			color-mix(in srgb, var(--lamp-glow) 15%, transparent),
			color-mix(in srgb, var(--lamp-glow) 15%, transparent) 3px,
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

	.jumbo-card-image {
		height: 100%;
		width: 100%;
		position: absolute;
		z-index: 1;
		left: 0;
		top: 0;
		filter: grayscale(100%);
		opacity: 0.6;
		object-fit: cover;
		transition:
			opacity 1s ease-in-out,
			filter 0.3s ease-in-out;

		&.home {
			animation: pan-image 15s linear infinite;
		}

		&.profileFace {
			background-position: center;
			background-size: cover;
		}
	}

	.jumbo-card-content {
		position: relative;
		z-index: 3;
		margin: 1rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 50%, transparent);
		border-radius: 0.625rem;
		display: flex;
		align-items: center;
		width: 100%;
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
		0%,
		100% {
			background-position: 36% 42%;
			background-size: 200%;
		}
		20% {
			background-position: 30% 35%;
			background-size: 200%;
		}
		40% {
			background-position: 49% 81%;
			background-size: 500%;
		}
		60% {
			background-position: 84% 33%;
			background-size: 300%;
		}
		80% {
			background-position: 15% 4%;
			background-size: 300%;
		}
	}

	@media (max-width: 700px) {
		.jumbo-card {
			margin-bottom: 0;
		}

		:global(.jumbo-name),
		:global(.link) {
			text-shadow: 2px 2px #0e0e0e;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.jumbo-card-overlay,
		.jumbo-card-image.home {
			animation: none;
		}

		.jumbo-card-image {
			transition: none;
		}
	}
</style>
