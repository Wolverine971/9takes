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
		@apply relative inline-flex items-center justify-center gap-2 font-medium border-none rounded-md cursor-pointer whitespace-nowrap;
		transition: all 0.2s ease;

		&--primary {
			@apply bg-primary-700 text-white;

			&:hover:not(:disabled) {
				@apply bg-primary-800;
			}
		}

		&--secondary {
			@apply bg-neutral-200 text-neutral-800;

			&:hover:not(:disabled) {
				@apply bg-neutral-300;
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
			@apply py-1 px-3 text-sm;
		}

		&--md {
			@apply py-2 px-4 text-base;
		}

		&--lg {
			@apply py-3 px-6 text-lg;
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
