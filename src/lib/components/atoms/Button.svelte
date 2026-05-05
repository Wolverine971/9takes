<!-- src/lib/components/atoms/Button.svelte -->
<script lang="ts">
	// src/lib/components/atoms/Button.svelte
	//
	// Canonical Button atom — locked 2026-05-04 per docs/design-system.md §11.
	// Visual spec is rendered at /styleguide §11.
	//
	// Replaces:
	//   - inline `bg-gradient-to-r from-[var(--lamp-glow)]...` button strings
	//   - LoadingButton.svelte (kept around until callers migrate; do not import
	//     LoadingButton in new code)
	//
	// Variants:
	//   primary    — solid lamp-glow bg, dark text. Default brand action.
	//   secondary  — transparent bg, 1px stone-edge border, ink-bright text.
	//   ghost      — transparent bg + border, lamp-glow text, hover lamp-soft bg.
	//   danger     — solid error bg, white text. Destructive only.
	//
	// Sizes: sm | md | lg.  All rounded-md (10px). NO gradients. NO resting glow.
	//
	// Usage:
	//   <Button>Save</Button>
	//   <Button variant="secondary" size="lg">Cancel</Button>
	//   <Button variant="ghost" size="sm" onclick={...}>Edit</Button>
	//   <Button href="/settings">Settings</Button>            // renders <a>
	//   <Button loading>Saving…</Button>                       // shows spinner
	//   <Button variant="primary" fullWidth>Continue →</Button>
	//   <Button icon={leadingIcon}>With icon</Button>          // optional snippets
	import type { Snippet } from 'svelte';

	type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
	type Size = 'sm' | 'md' | 'lg';

	type Props = {
		variant?: Variant;
		size?: Size;
		loading?: boolean;
		fullWidth?: boolean;
		href?: string;
		icon?: Snippet;
		iconRight?: Snippet;
		children?: Snippet;
		class?: string;
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		onclick?: (e: MouseEvent) => void;
		// Catch-all for the rest of the HTML attrs (target, rel, aria-*, data-*, etc.)
		[key: string]: unknown;
	};

	let {
		variant = 'primary',
		size = 'md',
		loading = false,
		fullWidth = false,
		href,
		icon,
		iconRight,
		children,
		class: extraClass = '',
		disabled = false,
		type = 'button',
		onclick,
		...rest
	}: Props = $props();

	const isDisabled = $derived(disabled || loading);

	const klass = $derived(
		[
			'btn',
			`btn--${variant}`,
			`btn--${size}`,
			fullWidth && 'btn--full',
			loading && 'btn--loading',
			extraClass
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

{#if href}
	<a
		{href}
		class={klass}
		aria-disabled={isDisabled || undefined}
		aria-busy={loading || undefined}
		tabindex={isDisabled ? -1 : undefined}
		{...rest}
	>
		{#if loading}
			<span class="btn-spinner" aria-hidden="true"></span>
		{:else if icon}
			<span class="btn-icon">{@render icon()}</span>
		{/if}
		{#if children}
			<span class="btn-label">{@render children()}</span>
		{/if}
		{#if iconRight && !loading}
			<span class="btn-icon">{@render iconRight()}</span>
		{/if}
	</a>
{:else}
	<button
		{type}
		class={klass}
		disabled={isDisabled}
		aria-busy={loading || undefined}
		{onclick}
		{...rest}
	>
		{#if loading}
			<span class="btn-spinner" aria-hidden="true"></span>
		{:else if icon}
			<span class="btn-icon">{@render icon()}</span>
		{/if}
		{#if children}
			<span class="btn-label">{@render children()}</span>
		{/if}
		{#if iconRight && !loading}
			<span class="btn-icon">{@render iconRight()}</span>
		{/if}
	</button>
{/if}

<style lang="scss">
	/* base */
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-family: 'Inter Variable', 'Inter', system-ui, sans-serif;
		font-weight: 600;
		border-radius: 0.625rem; /* rounded-md */
		border: 1px solid transparent;
		cursor: pointer;
		line-height: 1.2;
		text-decoration: none;
		white-space: nowrap;
		user-select: none;
		transition:
			background 0.18s ease,
			border-color 0.18s ease,
			color 0.18s ease;

		&:focus-visible {
			outline: 2px solid var(--lamp-glow);
			outline-offset: 2px;
		}

		&:disabled,
		&[aria-disabled='true'] {
			opacity: 0.45;
			cursor: not-allowed;
			pointer-events: none;
		}

		&.btn--full {
			width: 100%;
		}
	}

	/* sizes (match /styleguide §11 spec) */
	.btn--sm {
		padding: 6px 12px;
		font-size: 13px;
	}

	.btn--md {
		padding: 8px 16px;
		font-size: 15px;
	}

	.btn--lg {
		padding: 12px 24px;
		font-size: 17px;
	}

	/* variants — V5 tokens only, no legacy --primary-* references */
	.btn--primary {
		background: var(--lamp-glow);
		color: var(--cta-text, var(--night-deep));
		border-color: var(--lamp-glow);

		&:hover:not(:disabled):not([aria-disabled='true']) {
			background: var(--lamp-deep);
			border-color: var(--lamp-deep);
		}
	}

	.btn--secondary {
		background: transparent;
		color: var(--ink-bright);
		border-color: var(--stone-edge);

		&:hover:not(:disabled):not([aria-disabled='true']) {
			border-color: var(--ink-dim);
			background: var(--stone-mid);
		}
	}

	.btn--ghost {
		background: transparent;
		color: var(--lamp-glow);
		border-color: transparent;

		&:hover:not(:disabled):not([aria-disabled='true']) {
			background: var(--lamp-soft);
		}
	}

	.btn--danger {
		background: var(--error, #ef4444);
		color: #ffffff;
		border-color: var(--error, #ef4444);

		&:hover:not(:disabled):not([aria-disabled='true']) {
			background: var(--error-700, #dc2626);
			border-color: var(--error-700, #dc2626);
		}
	}

	/* loading state — spinner replaces leading icon, label dims slightly */
	.btn--loading .btn-label {
		opacity: 0.85;
	}

	.btn-spinner {
		display: inline-block;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 2px solid currentColor;
		border-top-color: transparent;
		animation: btn-spin 0.7s linear infinite;
		flex-shrink: 0;
	}

	.btn-icon {
		display: inline-flex;
		align-items: center;
		flex-shrink: 0;
	}

	@keyframes btn-spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.btn-spinner {
			animation-duration: 2s;
		}
	}
</style>
