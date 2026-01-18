<!-- src/lib/components/atoms/LoadingButton.svelte -->
<script lang="ts">
	import Spinner from './Spinner.svelte';

	// Props
	export let loading = false;
	export let disabled = false;
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let variant: 'primary' | 'secondary' | 'danger' | 'success' = 'primary';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let fullWidth = false;
	export let className = '';
	export let loadingText = '';
	export let ariaLabel: string | undefined = undefined;

	// Handle click events
	async function handleClick(event: MouseEvent) {
		if (loading || disabled) {
			event.preventDefault();
			return;
		}
	}

	$: buttonClasses = [
		'loading-button',
		`loading-button--${variant}`,
		`loading-button--${size}`,
		fullWidth && 'loading-button--full-width',
		loading && 'loading-button--loading',
		disabled && 'loading-button--disabled',
		className
	]
		.filter(Boolean)
		.join(' ');

	$: isDisabled = disabled || loading;
	$: buttonAriaLabel = loading ? loadingText || 'Loading...' : ariaLabel;
</script>

<button
	{type}
	class={buttonClasses}
	disabled={isDisabled}
	aria-label={buttonAriaLabel}
	aria-busy={loading}
	on:click={handleClick}
	on:click
>
	{#if loading}
		<span class="loading-button__spinner">
			<Spinner size="xs" color="neutral" />
		</span>
		{#if loadingText}
			<span class="loading-button__text">{loadingText}</span>
		{/if}
	{:else}
		<slot />
	{/if}
</button>

<style lang="scss">
	.loading-button {
		@apply relative inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border-none font-medium;
		transition: all 0.2s ease;

		&--primary {
			@apply bg-purple-600 text-white;
			box-shadow: 0 0 15px rgba(124, 58, 237, 0.3);

			&:hover:not(:disabled) {
				@apply bg-purple-700;
				box-shadow: 0 0 20px rgba(124, 58, 237, 0.4);
			}
		}

		&--secondary {
			@apply border border-slate-600 bg-slate-800/80 text-slate-200;

			&:hover:not(:disabled) {
				@apply border-purple-500 bg-purple-900/30 text-white;
			}
		}

		&--danger {
			@apply bg-red-600 text-white;

			&:hover:not(:disabled) {
				@apply bg-red-700;
			}
		}

		&--success {
			@apply bg-green-600 text-white;

			&:hover:not(:disabled) {
				@apply bg-green-700;
			}
		}

		&--sm {
			@apply px-3 py-1 text-sm;
		}

		&--md {
			@apply px-4 py-2 text-base;
		}

		&--lg {
			@apply px-6 py-3 text-lg;
		}

		&--full-width {
			@apply w-full;
		}

		&--loading {
			@apply cursor-not-allowed opacity-80;
		}

		&--disabled {
			@apply cursor-not-allowed opacity-50;
		}

		&:disabled {
			@apply cursor-not-allowed;
		}
	}

	.loading-button__spinner {
		@apply inline-flex items-center;
	}

	.loading-button__text {
		@apply ml-1;
	}
</style>
