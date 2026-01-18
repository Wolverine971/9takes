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
		<div class="glow glow-1" />
		<div class="glow glow-2" />
		<div class="glow glow-3" />
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
					--size: {4 + Math.random() * 5}px;
					--opacity: {0.4 + Math.random() * 0.3};
				"
			/>
		{/each}
	</div>
{/if}

<style lang="scss">
	/* Ambient glow container (behind content) */
	.glow-container {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 1;
		overflow: hidden;
	}

	/* Floating particles container (above content) */
	.particles-container {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 25;
		overflow: hidden;
	}

	/* Floating particles */
	.particle {
		position: absolute;
		width: var(--size);
		height: var(--size);
		background: radial-gradient(circle, rgba(167, 139, 250, 1) 0%, rgba(139, 92, 246, 0.7) 40%, transparent 70%);
		border-radius: 50%;
		opacity: 0;
		left: var(--x-start);
		bottom: -20px;
		animation: float-up var(--duration) ease-in-out infinite;
		animation-delay: var(--delay);
		filter: blur(0.5px);
		box-shadow: 0 0 12px rgba(139, 92, 246, 0.6), 0 0 4px rgba(167, 139, 250, 0.8);
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
		background: rgba(124, 58, 237, 0.08);
		top: 5%;
		left: -150px;
		animation-delay: 0s;
	}

	.glow-2 {
		width: 400px;
		height: 400px;
		background: rgba(109, 40, 217, 0.06);
		top: 40%;
		right: -100px;
		animation-delay: 3s;
	}

	.glow-3 {
		width: 450px;
		height: 450px;
		background: rgba(139, 92, 246, 0.05);
		bottom: 5%;
		left: 20%;
		animation-delay: 6s;
	}

	@keyframes glow-pulse {
		0%, 100% {
			opacity: 0.4;
			transform: scale(1);
		}
		50% {
			opacity: 0.7;
			transform: scale(1.15);
		}
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
		.particle:nth-child(n + 9) {
			display: none;
		}

		.particle {
			filter: blur(0.5px);
		}

		.glow {
			filter: blur(80px);
		}

		.glow-1 {
			width: 300px;
			height: 300px;
		}

		.glow-2 {
			width: 250px;
			height: 250px;
		}

		.glow-3 {
			width: 280px;
			height: 280px;
		}
	}
</style>
