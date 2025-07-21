<!-- lib/components/atoms/LoadingButton.svelte -->
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
	$: buttonAriaLabel = loading ? (loadingText || 'Loading...') : ariaLabel;
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
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-weight: 500;
		border: none;
		border-radius: 0.375rem;
		cursor: pointer;
		transition: all 0.2s ease;
		white-space: nowrap;

		&--primary {
			background-color: var(--color-primary, #9c27b0);
			color: white;

			&:hover:not(:disabled) {
				background-color: var(--color-primary-dark, #7b1fa2);
			}
		}

		&--secondary {
			background-color: var(--color-secondary, #e0e0e0);
			color: var(--color-text, #333);

			&:hover:not(:disabled) {
				background-color: var(--color-secondary-dark, #bdbdbd);
			}
		}

		&--danger {
			background-color: var(--color-danger, #f44336);
			color: white;

			&:hover:not(:disabled) {
				background-color: var(--color-danger-dark, #d32f2f);
			}
		}

		&--success {
			background-color: var(--color-success, #4caf50);
			color: white;

			&:hover:not(:disabled) {
				background-color: var(--color-success-dark, #388e3c);
			}
		}

		&--sm {
			padding: 0.25rem 0.75rem;
			font-size: 0.875rem;
		}

		&--md {
			padding: 0.5rem 1rem;
			font-size: 1rem;
		}

		&--lg {
			padding: 0.75rem 1.5rem;
			font-size: 1.125rem;
		}

		&--full-width {
			width: 100%;
		}

		&--loading {
			cursor: not-allowed;
			opacity: 0.8;
		}

		&--disabled {
			cursor: not-allowed;
			opacity: 0.5;
		}

		&:disabled {
			cursor: not-allowed;
		}
	}

	.loading-button__spinner {
		display: inline-flex;
		align-items: center;
	}

	.loading-button__text {
		margin-left: 0.25rem;
	}
</style>