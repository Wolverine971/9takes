<!-- src/routes/design-preview/harry-dry-v2/ConversationScenes.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';

	const scenes = [
		{
			path: '/images/home-reimagined/community-circle-neo-noir-v2',
			alt: 'Nine young adults talking in a circle beneath amber lamplight.'
		},
		{
			path: '/images/home-reimagined/circle-variations/01-gen-z',
			alt: 'Nine teens in hoodies, loose denim and trainers talking in a school courtyard.'
		},
		{
			path: '/images/home-reimagined/circle-variations/02-older-adults',
			alt: 'Nine older adults sharing an evening conversation in a neighborhood garden.'
		},
		{
			path: '/images/home-reimagined/circle-variations/04-vienna-1910',
			alt: 'Nine adults in early-twentieth-century clothing talking in a Viennese courtyard.'
		},
		{
			path: '/images/home-reimagined/circle-variations/03-athens-statues',
			alt: 'Nine Greek marble statues in conversation beneath an oil lamp, with the Acropolis beyond.'
		}
	];
	let frame = $state<HTMLElement>();
	let active = $state(0);
	let loaded = $state(scenes.map(() => false));
	let failed = $state(scenes.map(() => false));
	let inView = $state(false);
	let pageVisible = $state(true);
	const next = $derived.by(() => {
		for (let offset = 1; offset < scenes.length; offset++) {
			const index = (active + offset) % scenes.length;
			if (!failed[index]) return index;
		}
		return active;
	});

	onMount(() => {
		pageVisible = !document.hidden;
		frame?.querySelectorAll('img').forEach((image, index) => {
			if (image.complete && image.naturalWidth > 0) imageLoaded(index);
		});
		if (!frame || typeof IntersectionObserver === 'undefined') {
			inView = true;
			return;
		}
		const observer = new IntersectionObserver(
			([entry]) => (inView = entry.isIntersecting && entry.intersectionRatio >= 0.25),
			{ threshold: [0, 0.25] }
		);
		observer.observe(frame);
		return () => observer.disconnect();
	});

	$effect(() => {
		if (
			!inView ||
			!pageVisible ||
			prefersReducedMotion.current ||
			!loaded[active] ||
			!loaded[next] ||
			next === active
		)
			return;
		const upcoming = next;
		const timer = window.setTimeout(() => (active = upcoming), 2000);
		return () => window.clearTimeout(timer);
	});

	function imageLoaded(index: number) {
		loaded[index] = true;
		if (failed[active]) {
			active = index;
		}
	}

	function imageFailed(index: number) {
		failed[index] = true;
		if (index === active) {
			const fallback = loaded.findIndex((ready, candidate) => ready && !failed[candidate]);
			if (fallback !== -1) active = fallback;
		}
	}
</script>

<svelte:document onvisibilitychange={() => (pageVisible = !document.hidden)} />

<figure class="conversation-scene" aria-label="Conversation circles">
	<div class="scene-stage" bind:this={frame}>
		{#each scenes as scene, index (scene.path)}
			<img
				src={`${scene.path}.webp`}
				srcset={`${scene.path}-small.webp 888w, ${scene.path}.webp 1774w`}
				sizes="(max-width: 760px) calc(100vw - 48px), (max-width: 1280px) calc(100vw - 96px), 1184px"
				width="1774"
				height="887"
				loading="lazy"
				decoding="async"
				alt={`Cel-shaded illustration: ${scene.alt}`}
				class:active={active === index}
				aria-hidden={active !== index}
				onload={() => imageLoaded(index)}
				onerror={() => imageFailed(index)}
			/>
		{/each}
	</div>
</figure>

<style>
	.conversation-scene {
		grid-column: 1 / -1;
		min-width: 0;
		margin: 0;
	}
	.scene-stage {
		position: relative;
		isolation: isolate;
		aspect-ratio: 2;
		overflow: hidden;
		border-radius: 16px;
		background: var(--night-mid);
	}
	.scene-stage img {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
		opacity: 0;
	}
	.scene-stage img.active {
		opacity: 1;
	}
	@media (prefers-reduced-motion: no-preference) {
		.scene-stage img {
			transition: opacity 700ms ease-in-out;
		}
	}
</style>
