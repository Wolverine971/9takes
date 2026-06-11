<!-- src/lib/components/atoms/FloatingParticles.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let mounted = false;

	onMount(() => {
		mounted = true;
	});
</script>

{#if browser && mounted}
	<!-- Ambient glow spots (background layer) -->
	<div class="glow-container" aria-hidden="true">
		<div class="glow glow-1"></div>
		<div class="glow glow-2"></div>
		<div class="glow glow-3"></div>
	</div>

	<!-- Floating particles (foreground layer) -->
	<div class="particles-container" aria-hidden="true">
		{#each Array(15) as _, i}
			<div
				class="particle"
				style="
					--delay: {i * 1.2}s;
					--duration: {18 + Math.random() * 12}s;
					--x-start: {Math.random() * 100}%;
					--x-drift: {(Math.random() - 0.5) * 180}px;
					--size: {5 + Math.random() * 5}px;
					--opacity: {0.55 + Math.random() * 0.3};
				"
			></div>
		{/each}
	</div>
{/if}

<style lang="scss">
	/* Ambient glow container (behind content) */
	.glow-container {
		position: fixed;
		inset: 0;
		width: 100vw;
		max-width: 100vw;
		pointer-events: none;
		z-index: 1;
		overflow: hidden;
		contain: layout paint;
		clip-path: inset(0);
	}

	/* Floating particles container (above content) */
	.particles-container {
		position: fixed;
		inset: 0;
		width: 100vw;
		max-width: 100vw;
		pointer-events: none;
		z-index: 25;
		overflow: hidden;
		contain: layout paint;
		clip-path: inset(0);
	}

	/* Floating particles */
	.particle {
		position: absolute;
		width: var(--size);
		height: var(--size);
		background: radial-gradient(
			circle,
			color-mix(in srgb, var(--data-cyan) 95%, transparent) 0%,
			color-mix(in srgb, var(--data-cyan) 70%, transparent) 40%,
			transparent 70%
		);
		border-radius: 50%;
		opacity: 0;
		left: var(--x-start);
		bottom: -20px;
		animation: float-up var(--duration) ease-in-out infinite;
		animation-delay: var(--delay);
		filter: blur(0.5px);
		box-shadow:
			0 0 14px color-mix(in srgb, var(--data-cyan) 50%, transparent),
			0 0 5px color-mix(in srgb, var(--data-cyan) 75%, transparent);
	}

	@keyframes float-up {
		0% {
			transform: translateY(0) translateX(0);
			opacity: 0;
		}
		5% {
			opacity: var(--opacity);
		}
		95% {
			opacity: var(--opacity);
		}
		100% {
			transform: translateY(-100vh) translateX(var(--x-drift));
			opacity: 0;
		}
	}

	/* Ambient glow spots */
	.glow {
		position: absolute;
		border-radius: 50%;
		filter: blur(100px);
		opacity: 0;
		animation: glow-pulse 10s ease-in-out infinite;
	}

	.glow-1 {
		width: 500px;
		height: 500px;
		background: color-mix(in srgb, var(--data-cyan) 6%, transparent);
		top: 5%;
		left: -150px;
		animation-delay: 0s;
	}

	.glow-2 {
		width: 400px;
		height: 400px;
		background: color-mix(in srgb, var(--lamp-glow) 6%, transparent);
		top: 40%;
		right: -100px;
		animation-delay: 3s;
	}

	.glow-3 {
		width: 450px;
		height: 450px;
		background: color-mix(in srgb, var(--lamp-glow) 4%, transparent);
		bottom: 5%;
		left: 20%;
		animation-delay: 6s;
	}

	@keyframes glow-pulse {
		0%,
		100% {
			opacity: 0.4;
			transform: scale(1);
		}
		50% {
			opacity: 0.7;
			transform: scale(1.15);
		}
	}

	/* Light mode: bump the ambient glow blobs since 4-6% alpha disappears
	   against cream backgrounds. Hue comes from the theme-flipped tokens. */
	:global(.light) .glow-1 {
		background: color-mix(in srgb, var(--data-cyan) 9%, transparent);
	}
	:global(.light) .glow-2 {
		background: color-mix(in srgb, var(--lamp-glow) 8%, transparent);
	}
	:global(.light) .glow-3 {
		background: color-mix(in srgb, var(--lamp-glow) 6%, transparent);
	}

	/* Reduce motion for accessibility */
	@media (prefers-reduced-motion: reduce) {
		.particle,
		.glow {
			animation: none;
		}

		.particle {
			display: none;
		}

		.glow {
			opacity: 0.3;
		}
	}

	/* Reduce particles on mobile for performance */
	@media (max-width: 768px) {
		.glow {
			display: none;
		}

		.particle:nth-child(n + 9) {
			display: none;
		}

		.particle {
			filter: blur(0.5px);
		}
	}
</style>
