<!-- src/lib/components/atoms/LoadingButton.svelte -->
<script lang="ts">
	import Spinner from './Spinner.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		loading?: boolean;
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		variant?: 'primary' | 'secondary' | 'danger' | 'success';
		size?: 'sm' | 'md' | 'lg';
		fullWidth?: boolean;
		className?: string;
		loadingText?: string;
		ariaLabel?: string;
		onclick?: (event: MouseEvent) => void;
		children?: Snippet;
	}

	let {
		loading = false,
		disabled = false,
		type = 'button',
		variant = 'primary',
		size = 'md',
		fullWidth = false,
		className = '',
		loadingText = '',
		ariaLabel = undefined,
		onclick,
		children
	}: Props = $props();

	function handleClick(event: MouseEvent) {
		if (loading || disabled) {
			event.preventDefault();
			return;
		}
		onclick?.(event);
	}

	const buttonClasses = $derived(
		[
			'loading-button',
			`loading-button--${variant}`,
			`loading-button--${size}`,
			fullWidth && 'loading-button--full-width',
			loading && 'loading-button--loading',
			disabled && 'loading-button--disabled',
			className
		]
			.filter(Boolean)
			.join(' ')
	);

	const isDisabled = $derived(disabled || loading);
	const buttonAriaLabel = $derived(loading ? loadingText || 'Loading...' : ariaLabel);
</script>

<button
	{type}
	class={buttonClasses}
	disabled={isDisabled}
	aria-label={buttonAriaLabel}
	aria-busy={loading}
	onclick={handleClick}
>
	{#if loading}
		<span class="loading-button__spinner">
			<Spinner size="xs" color="neutral" />
		</span>
		{#if loadingText}
			<span class="loading-button__text">{loadingText}</span>
		{/if}
	{:else if children}
		{@render children()}
	{/if}
</button>

<style lang="scss">
	.loading-button {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		white-space: nowrap;
		border-radius: 0.375rem;
		border: none;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;

		&--primary {
			// Phase 2 (2026-05-04): solid bg, no resting glow. Locked per design-system.md §5.
			background: var(--lamp-glow);
			color: var(--text-on-primary);

			&:hover:not(:disabled) {
				background: var(--lamp-glow);
			}
		}

		&--secondary {
			border: 1px solid color-mix(in srgb, var(--ink-dim) 25%, transparent);
			background: color-mix(in srgb, var(--night-deep) 88%, transparent);
			color: var(--ink-mid);

			&:hover:not(:disabled) {
				border-color: color-mix(in srgb, var(--lamp-glow) 35%, transparent);
				background: var(--primary-subtle);
				color: var(--lamp-glow);
			}
		}

		&--danger {
			background: var(--error);
			color: var(--white);

			&:hover:not(:disabled) {
				background: var(--error-700);
			}
		}

		&--success {
			background: var(--success);
			color: var(--white);

			&:hover:not(:disabled) {
				background: var(--success-text);
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
