<script lang="ts">
	import { onMount } from 'svelte';

	export let displayList: {
		name: string;
		link: string;
	}[] = [];
	export let noMove: boolean = false;
	export let speed: number = 30; // seconds for one full rotation

	let marqueeWidth: number;

	onMount(() => {
		marqueeWidth = displayList.length * 250; // Adjust based on your content
	});

	$: jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'WebPageElement',
		isPartOf: {
			'@type': 'WebPage',
			'@id': 'https://9takes.com'
		},
		name: '9takes Enneagram Types Marquee',
		description: 'A scrolling marquee displaying Enneagram personality types and related content',
		cssSelector: '.marquee-container',
		hasPart: displayList.map((item, index) => {
			return {
				'@type': 'WebPageElement',
				name: item.name,
				url: `https://9takes.com${item.link}`,
				description: `A blog on Enneagram types ${item.name}`
			};
		})
	};
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
</svelte:head>

<div
	class="marquee-container"
	style="--marquee-width: {marqueeWidth}px; --marquee-speed: {speed}s;"
>
	<div class="marquee" class:paused={noMove} role="marquee">
		<div class="marquee-content">
			{#each displayList as item}
				<a href={item.link} class="marquee-item">{item.name}</a>
			{/each}
		</div>
		<div class="marquee-content" aria-hidden="true">
			{#each displayList as item}
				<a href={item.link} class="marquee-item">{item.name}</a>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	a::after {
		display: none !important;
	}
	.marquee-container {
		--marquee-bg: var(--color-theme-purple-light);
		--marquee-color: var(--text-color);
		--marquee-border-color: #fdfdfb;

		width: 100%;
		overflow: hidden;
		background: var(--marquee-bg);
		position: relative;
	}

	.marquee-container::before,
	.marquee-container::after {
		content: '';
		position: absolute;
		top: 0;
		width: 10rem;
		height: 100%;
		z-index: 1;
	}

	.marquee-container::before {
		left: 0;
		background: linear-gradient(to right, var(--marquee-bg), transparent);
	}

	.marquee-container::after {
		right: 0;
		background: linear-gradient(to left, var(--marquee-bg), transparent);
	}

	.marquee {
		display: flex;
		width: calc(var(--marquee-width) * 2);
		animation: scroll var(--marquee-speed) linear infinite;

		&.paused {
			animation-play-state: paused;
		}
	}

	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(calc(-1 * var(--marquee-width)));
		}
	}

	.marquee-content {
		display: flex;
		align-items: center;
		flex: 0 0 var(--marquee-width);
		white-space: nowrap;
	}

	.marquee-item {
		display: inline-flex;
		align-items: center;
		padding: 1rem 2rem;
		color: var(--marquee-color);
		text-transform: uppercase;
		font-size: 1.2rem;
		font-weight: bold;
		text-decoration: none;
		transition: all 0.3s ease;

		&:hover {
			color: var(--marquee-border-color);
			transform: scale(1.1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee {
			animation: none;
		}
		.marquee-item {
			transition: none;
		}
	}
</style>
