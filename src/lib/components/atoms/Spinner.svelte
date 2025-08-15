<!-- lib/components/atoms/Spinner.svelte -->
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

	// Generate CSS classes for size and color
	$: sizeClass = `spinner--${size}`;
	$: colorClass = `spinner--${color}`;
</script>

<div class="spinner-container {className}" role="status" aria-label={ariaLabel}>
	<div class="spinner {sizeClass} {colorClass}"></div>

	{#if $$slots.default}
		<div class="spinner-text">
			<slot />
		</div>
	{/if}
</div>
