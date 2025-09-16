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
			<div class="rounded-lg border-2 border-red-200 bg-red-50 p-6 text-center shadow-sm">
				<p class="mb-4 text-red-700">Something went wrong. Please try again.</p>
				<button
					class="rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
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
			<div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
				<div class="flex flex-col items-center text-center">
					<!-- Error Icon -->
					<div
						class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600"
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
					<h2 class="mb-2 text-2xl font-bold text-gray-900">Oops! Something went wrong</h2>

					<!-- Error Message -->
					<p class="mb-6 text-gray-600">{errorMessage}</p>

					<!-- Action Buttons -->
					<div class="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
						<button
							class="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
							on:click={retry}
						>
							Try Again
						</button>
						<button
							class="rounded-lg border-2 border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
							on:click={() => (window.location.href = '/')}
						>
							Go Home
						</button>
					</div>

					<!-- Development Error Details -->
					{#if import.meta.env.DEV && errorStack}
						<details class="mt-6 w-full">
							<summary class="cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-700">
								Error details (development only)
							</summary>
							<div class="mt-3 rounded-lg bg-gray-50 p-4">
								<pre class="overflow-x-auto text-left text-xs text-red-600">{errorStack}</pre>
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
