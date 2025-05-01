<script lang="ts">
	/**
	 * Simple, customizable loading spinner component
	 */

	// Props
	export let size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
	export let color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'neutral' =
		'primary';
	export let className = '';
	export let ariaLabel = 'Loading...';

	// Size mapping (in pixels)
	const sizeMap = {
		xs: 16,
		sm: 24,
		md: 32,
		lg: 48,
		xl: 64
	};

	// Color mapping to Tailwind classes
	const colorMap = {
		primary: 'border-primary-500 border-t-primary-200',
		secondary: 'border-secondary-500 border-t-secondary-200',
		success: 'border-success-500 border-t-success-200',
		error: 'border-error-500 border-t-error-200',
		warning: 'border-warning-500 border-t-warning-200',
		info: 'border-info-500 border-t-info-200',
		neutral: 'border-neutral-500 border-t-neutral-200'
	};

	// Get the correct size in pixels
	$: sizePx = sizeMap[size] || sizeMap.md;

	// Get the correct color classes
	$: colorClasses = colorMap[color] || colorMap.primary;

	// Calculate border width based on size
	$: borderWidth = Math.max(2, Math.round(sizePx / 8));
</script>

<div class="spinner-container {className}" role="status" aria-label={ariaLabel}>
	<div
		class="spinner {colorClasses}"
		style="width: {sizePx}px; height: {sizePx}px; border-width: {borderWidth}px;"
	></div>

	{#if $$slots.default}
		<div class="spinner-text">
			<slot />
		</div>
	{/if}
</div>

<style>
	.spinner-container {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.spinner {
		display: inline-block;
		border-style: solid;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	.spinner-text {
		margin-top: 0.75rem;
		text-align: center;
		font-size: 0.875rem;
		color: #4b5563; /* text-gray-600 */
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
