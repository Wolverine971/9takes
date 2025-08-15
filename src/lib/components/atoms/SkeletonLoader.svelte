<!-- lib/components/atoms/SkeletonLoader.svelte -->
<script lang="ts">
	/**
	 * Skeleton loader component for showing loading placeholders
	 */

	// Props
	export let variant: 'text' | 'circular' | 'rectangular' | 'card' = 'text';
	export let width: string | number = '100%';
	export let height: string | number = 'auto';
	export let count = 1;
	export let className = '';
	export let animation: 'pulse' | 'wave' | 'none' = 'pulse';

	// Convert dimensions to CSS values
	$: widthStyle = typeof width === 'number' ? `${width}px` : width;
	$: heightStyle = typeof height === 'number' ? `${height}px` : height;

	// Default heights for different variants
	$: defaultHeight = {
		text: '1em',
		circular: widthStyle,
		rectangular: '200px',
		card: '300px'
	}[variant];

	$: finalHeight = height === 'auto' ? defaultHeight : heightStyle;
</script>

<div class="skeleton-container {className}">
	{#each Array(count) as _, i}
		<div
			class="skeleton skeleton--{variant} skeleton--{animation}"
			style="width: {widthStyle}; height: {finalHeight}"
			aria-hidden="true"
		/>
	{/each}
</div>

<style lang="scss">
	.skeleton-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.skeleton {
		background-color: var(--skeleton-bg, #e0e0e0);
		position: relative;
		overflow: hidden;

		&--text {
			border-radius: 4px;
			margin: 0.25rem 0;
		}

		&--circular {
			border-radius: 50%;
		}

		&--rectangular {
			border-radius: 8px;
		}

		&--card {
			border-radius: 12px;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		}

		&--pulse {
			animation: skeleton-pulse 1.5s ease-in-out infinite;
		}

		&--wave::after {
			content: '';
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			transform: translateX(-100%);
			background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
			animation: skeleton-wave 1.5s ease-in-out infinite;
		}
	}

	@keyframes skeleton-pulse {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0.6;
		}
		100% {
			opacity: 1;
		}
	}

	@keyframes skeleton-wave {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}

	:global(.dark) .skeleton {
		background-color: var(--skeleton-bg-dark, #3a3a3a);
	}
</style>
