<!-- lib/components/atoms/Skeleton.svelte -->
<script lang="ts">
	export let width = '100%';
	export let height = '20px';
	export let borderRadius = '4px';
	export let variant: 'text' | 'circular' | 'rectangular' = 'rectangular';
	export let animation: 'pulse' | 'wave' | 'none' = 'pulse';
	
	$: computedBorderRadius = variant === 'circular' ? '50%' : borderRadius;
	$: computedHeight = variant === 'text' ? '1em' : height;
</script>

<div 
	class="skeleton skeleton--{animation} skeleton--{variant}"
	style="width: {width}; height: {computedHeight}; border-radius: {computedBorderRadius};"
	role="status"
	aria-label="Loading..."
>
	<span class="visually-hidden">Loading...</span>
</div>

<style>
	.skeleton {
		background-color: var(--skeleton-bg, #e0e0e0);
		position: relative;
		overflow: hidden;
	}
	
	.skeleton--text {
		transform: scale(1, 0.6);
		margin: 0.5em 0;
	}
	
	.skeleton--pulse {
		animation: pulse 1.5s ease-in-out infinite;
	}
	
	.skeleton--wave::after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		transform: translateX(-100%);
		background-image: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0) 0,
			rgba(255, 255, 255, 0.2) 20%,
			rgba(255, 255, 255, 0.5) 60%,
			rgba(255, 255, 255, 0)
		);
		animation: wave 1.5s linear infinite;
	}
	
	@keyframes pulse {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0.4;
		}
		100% {
			opacity: 1;
		}
	}
	
	@keyframes wave {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}
	
	@media (prefers-reduced-motion: reduce) {
		.skeleton--pulse,
		.skeleton--wave::after {
			animation: none;
		}
	}
	
	:root {
		--skeleton-bg: #e0e0e0;
	}
	
	:global([data-theme='dark']) {
		--skeleton-bg: #3a3a3a;
	}
</style>