<!-- src/lib/components/error/ErrorBoundary.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	export let fallback: 'default' | 'minimal' | 'custom' = 'default';
	export let onError: ((error: Error) => void) | undefined = undefined;

	let hasError = false;
	let errorMessage = '';
	let errorStack = '';

	// Catch errors during component lifecycle
	const handleError = (error: Error) => {
		hasError = true;
		errorMessage = error.message || 'An unexpected error occurred';
		errorStack = error.stack || '';

		// Log to console for debugging
		console.error('ErrorBoundary caught:', error);

		// Call custom error handler if provided
		if (onError) {
			onError(error);
		}
	};

	// Listen for unhandled errors
	onMount(() => {
		const handleUnhandledError = (event: ErrorEvent) => {
			handleError(new Error(event.message));
			event.preventDefault();
		};

		const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
			handleError(new Error(event.reason));
			event.preventDefault();
		};

		window.addEventListener('error', handleUnhandledError);
		window.addEventListener('unhandledrejection', handleUnhandledRejection);

		return () => {
			window.removeEventListener('error', handleUnhandledError);
			window.removeEventListener('unhandledrejection', handleUnhandledRejection);
		};
	});

	// Reset error state on navigation
	$: $page && (hasError = false);

	const retry = () => {
		hasError = false;
		errorMessage = '';
		errorStack = '';
		window.location.reload();
	};
</script>

{#if hasError}
	{#if fallback === 'minimal'}
		<div class="flex min-h-[200px] items-center justify-center p-8">
			<div class="rounded-lg border border-red-500/30 bg-red-900/20 p-6 text-center shadow-sm">
				<p class="mb-4 text-red-300">Something went wrong. Please try again.</p>
				<button
					class="rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
					on:click={retry}
				>
					Retry
				</button>
			</div>
		</div>
	{:else if fallback === 'custom'}
		<slot name="error" {errorMessage} {retry} />
	{:else}
		<div class="flex min-h-[500px] items-center justify-center p-4">
			<div
				class="w-full max-w-md rounded-2xl border border-slate-700/50 bg-[#1a1a2e] p-8 shadow-[0_0_30px_rgba(124,58,237,0.15)]"
			>
				<div class="flex flex-col items-center text-center">
					<!-- Error Icon -->
					<div
						class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-900/30 text-red-400"
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
					<h2 class="mb-2 text-2xl font-bold text-slate-100">Oops! Something went wrong</h2>

					<!-- Error Message -->
					<p class="mb-6 text-slate-400">{errorMessage}</p>

					<!-- Action Buttons -->
					<div class="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
						<button
							class="rounded-lg bg-purple-600 px-6 py-2.5 font-semibold text-white shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all hover:bg-purple-700 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
							on:click={retry}
						>
							Try Again
						</button>
						<button
							class="rounded-lg border border-slate-600 bg-[#12121a] px-6 py-2.5 font-semibold text-slate-300 transition-all hover:border-slate-500 hover:bg-[#252538]"
							on:click={() => (window.location.href = '/')}
						>
							Go Home
						</button>
					</div>

					<!-- Development Error Details -->
					{#if import.meta.env.DEV && errorStack}
						<details class="mt-6 w-full">
							<summary
								class="cursor-pointer text-sm font-medium text-slate-500 hover:text-slate-300"
							>
								Error details (development only)
							</summary>
							<div class="mt-3 rounded-lg border border-slate-700/50 bg-[#12121a] p-4">
								<pre class="overflow-x-auto text-left text-xs text-red-400">{errorStack}</pre>
							</div>
						</details>
					{/if}
				</div>
			</div>
		</div>
	{/if}
{:else}
	<slot />
{/if}
