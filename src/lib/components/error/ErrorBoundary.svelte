<!-- lib/components/error/ErrorBoundary.svelte -->
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
		<div class="error-minimal">
			<p>Something went wrong. Please try again.</p>
			<button on:click={retry}>Retry</button>
		</div>
	{:else if fallback === 'custom'}
		<slot name="error" {errorMessage} {retry} />
	{:else}
		<div class="error-boundary">
			<div class="error-content">
				<div class="error-icon">
					<svg
						width="48"
						height="48"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<circle cx="12" cy="12" r="10" />
						<line x1="12" y1="8" x2="12" y2="12" />
						<line x1="12" y1="16" x2="12.01" y2="16" />
					</svg>
				</div>
				<h2>Oops! Something went wrong</h2>
				<p class="error-message">{errorMessage}</p>
				<div class="error-actions">
					<button class="retry-button" on:click={retry}> Try Again </button>
					<button class="home-button" on:click={() => (window.location.href = '/')}>
						Go Home
					</button>
				</div>
				{#if import.meta.env.DEV && errorStack}
					<details class="error-details">
						<summary>Error details (development only)</summary>
						<pre>{errorStack}</pre>
					</details>
				{/if}
			</div>
		</div>
	{/if}
{:else}
	<slot />
{/if}

<style>
	.error-boundary {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 400px;
		padding: 2rem;
		background-color: var(--lightest-gray);
		border-radius: 0.5rem;
		border: 1px solid var(--border-color);
	}

	.error-content {
		text-align: center;
		max-width: 500px;
	}

	.error-icon {
		color: var(--error);
		margin-bottom: 1rem;
	}

	.error-content h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: var(--text-primary);
	}

	.error-message {
		color: var(--text-secondary);
		margin-bottom: 1.5rem;
		line-height: 1.6;
	}

	.error-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
	}

	.retry-button,
	.home-button {
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		border: none;
		font-size: 1rem;
	}

	.retry-button {
		background-color: var(--primary);
		color: white;
	}

	.retry-button:hover {
		background-color: var(--primary-dark);
		transform: translateY(-1px);
		box-shadow: var(--shadow-sm);
	}

	.home-button {
		background-color: white;
		color: var(--text-primary);
		border: 1px solid var(--border-color);
	}

	.home-button:hover {
		background-color: var(--lightest-gray);
		border-color: var(--medium-gray);
	}

	.error-details {
		margin-top: 2rem;
		text-align: left;
		background-color: white;
		padding: 1rem;
		border-radius: 0.5rem;
		border: 1px solid var(--border-color);
	}

	.error-details summary {
		cursor: pointer;
		font-weight: 600;
		color: var(--text-secondary);
		margin-bottom: 0.5rem;
	}

	.error-details pre {
		overflow-x: auto;
		font-size: 0.875rem;
		color: var(--error);
		white-space: pre-wrap;
		word-wrap: break-word;
	}

	.error-minimal {
		text-align: center;
		padding: 2rem;
		background-color: var(--error-light);
		border: 1px solid var(--error);
		border-radius: 0.5rem;
		color: var(--error);
	}

	.error-minimal button {
		margin-top: 1rem;
		padding: 0.5rem 1rem;
		background-color: var(--error);
		color: white;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
		font-weight: 600;
	}

	.error-minimal button:hover {
		opacity: 0.9;
	}

	@media (max-width: 768px) {
		.error-boundary {
			padding: 1rem;
		}

		.error-actions {
			flex-direction: column;
			width: 100%;
		}

		.retry-button,
		.home-button {
			width: 100%;
		}
	}
</style>
