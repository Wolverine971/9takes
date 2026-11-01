<!-- src/lib/components/error/ErrorBoundary.svelte -->
<script lang="ts">
	// Catches errors thrown while rendering or updating its children (including
	// their effects) via <svelte:boundary>, and shows a fallback with a retry that
	// re-renders the children. The old version listened for window errors, which
	// never covered a crashing component.
	import type { Snippet } from 'svelte';
	import { afterNavigate } from '$app/navigation';

	interface Props {
		fallback?: 'default' | 'minimal' | 'custom';
		onError?: (error: Error) => void;
		children?: Snippet;
		/** Rendered when `fallback === 'custom'`. */
		error?: Snippet<[{ errorMessage: string; retry: () => void }]>;
	}

	let { fallback = 'default', onError, children, error: errorSnippet }: Props = $props();

	let resetBoundary: (() => void) | null = null;

	function toError(value: unknown): Error {
		return value instanceof Error ? value : new Error(String(value));
	}

	function handleError(value: unknown, reset: () => void) {
		const error = toError(value);
		resetBoundary = reset;

		// Log to console for debugging
		console.error('ErrorBoundary caught:', error);

		// Call custom error handler if provided
		onError?.(error);
	}

	// Reset error state on navigation
	afterNavigate(() => {
		const reset = resetBoundary;
		resetBoundary = null;
		reset?.();
	});
</script>

<svelte:boundary onerror={handleError}>
	{@render children?.()}

	{#snippet failed(caught, retry)}
		{@const errorMessage = toError(caught).message || 'An unexpected error occurred'}
		{@const errorStack = toError(caught).stack || ''}
		{#if fallback === 'minimal'}
			<div class="flex min-h-[200px] items-center justify-center p-8">
				<div
					class="rounded-xl border border-error-500/30 bg-error-500/10 p-6 text-center shadow-sm"
				>
					<p class="mb-4 text-[var(--error-text)]">Something went wrong. Please try again.</p>
					<button
						class="rounded-md border border-error-500/30 bg-error-700 px-4 py-2 text-white transition-colors hover:border-error-500/60 hover:bg-error-500"
						onclick={retry}
					>
						Retry
					</button>
				</div>
			</div>
		{:else if fallback === 'custom'}
			{@render errorSnippet?.({ errorMessage, retry })}
		{:else}
			<div class="flex min-h-[500px] items-center justify-center p-4">
				<div
					class="w-full max-w-md rounded-xl border border-[var(--stone-edge)] bg-[var(--stone-warm)] p-8 shadow-[var(--shadow-xl)]"
				>
					<div class="flex flex-col items-center text-center">
						<!-- Error Icon -->
						<div
							class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-error-500/10 text-[var(--error-text)]"
						>
							<svg
								class="h-8 w-8"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<circle cx="12" cy="12" r="10" />
								<line x1="12" y1="8" x2="12" y2="12" />
								<line x1="12" y1="16" x2="12.01" y2="16" />
							</svg>
						</div>

						<!-- Error Title -->
						<h2 class="mb-2 text-2xl font-bold text-[var(--ink-bright)]">
							Oops! Something went wrong
						</h2>

						<!-- Error Message -->
						<p class="mb-6 text-[var(--ink-mid)]">{errorMessage}</p>

						<!-- Action Buttons -->
						<div class="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
							<button
								class="rounded-md bg-[var(--lamp-glow)] px-6 py-2.5 font-semibold text-[var(--text-on-primary)] shadow-[var(--glow-sm)] transition-all hover:bg-[var(--lamp-glow)] hover:shadow-[var(--glow-md)]"
								onclick={retry}
							>
								Try Again
							</button>
							<button
								class="rounded-md border border-[var(--stone-edge)] bg-[var(--night-deep)] px-6 py-2.5 font-semibold text-[var(--ink-mid)] transition-all hover:border-[var(--lamp-soft)] hover:bg-[var(--stone-warm)] hover:text-[var(--ink-bright)]"
								onclick={() => (window.location.href = '/')}
							>
								Go Home
							</button>
						</div>

						<!-- Development Error Details -->
						{#if import.meta.env.DEV && errorStack}
							<details class="mt-6 w-full">
								<summary
									class="cursor-pointer text-sm font-medium text-[var(--ink-dim)] hover:text-[var(--ink-mid)]"
								>
									Error details (development only)
								</summary>
								<div
									class="mt-3 rounded-xl border border-[var(--stone-edge)] bg-[var(--night-deep)] p-4"
								>
									<pre
										class="overflow-x-auto text-left text-xs text-[var(--error-text)]">{errorStack}</pre>
								</div>
							</details>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	{/snippet}
</svelte:boundary>
