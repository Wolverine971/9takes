<!-- lib/components/error/AsyncErrorHandler.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let error: string | null = null;
	export let loading = false;
	export let retryable = true;
	export let showDetails = false;

	const dispatch = createEventDispatcher();

	const retry = () => {
		dispatch('retry');
	};

	const dismiss = () => {
		error = null;
		dispatch('dismiss');
	};
</script>

{#if error}
	<div class="error-container" role="alert">
		<div class="error-content">
			<div class="error-header">
				<svg
					class="error-icon"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<circle cx="12" cy="12" r="10" />
					<line x1="12" y1="8" x2="12" y2="12" />
					<line x1="12" y1="16" x2="12.01" y2="16" />
				</svg>
				<span class="error-text">{error}</span>
			</div>

			<div class="error-actions">
				{#if retryable && !loading}
					<button class="retry-btn" on:click={retry}> Try Again </button>
				{/if}
				<button class="dismiss-btn" on:click={dismiss} aria-label="Dismiss error">
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
			</div>
		</div>

		{#if showDetails && $$slots.details}
			<div class="error-details">
				<slot name="details" />
			</div>
		{/if}
	</div>
{/if}

<style>
	.error-container {
		background-color: var(--error-light, #fee);
		border: 1px solid var(--error, #e84393);
		border-radius: 0.5rem;
		padding: 1rem;
		margin: 1rem 0;
		animation: slideIn 0.2s ease-out;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-0.5rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.error-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.error-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex: 1;
	}

	.error-icon {
		color: var(--error);
		flex-shrink: 0;
	}

	.error-text {
		color: var(--error);
		font-size: 0.875rem;
		line-height: 1.4;
	}

	.error-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	.retry-btn {
		padding: 0.375rem 0.75rem;
		background-color: var(--error);
		color: white;
		border: none;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.2s ease;
	}

	.retry-btn:hover {
		opacity: 0.9;
	}

	.retry-btn:focus-visible {
		outline: 2px solid var(--error);
		outline-offset: 2px;
	}

	.dismiss-btn {
		padding: 0.25rem;
		background: none;
		border: none;
		color: var(--error);
		cursor: pointer;
		border-radius: 0.25rem;
		transition: background-color 0.2s ease;
	}

	.dismiss-btn:hover {
		background-color: rgba(232, 67, 147, 0.1);
	}

	.dismiss-btn:focus-visible {
		outline: 2px solid var(--error);
		outline-offset: 2px;
	}

	.error-details {
		margin-top: 0.75rem;
		padding-top: 0.75rem;
		border-top: 1px solid rgba(232, 67, 147, 0.2);
		font-size: 0.8125rem;
		color: var(--text-secondary);
	}

	@media (max-width: 768px) {
		.error-container {
			padding: 0.75rem;
			margin: 0.75rem 0;
		}

		.error-content {
			flex-wrap: wrap;
		}

		.error-actions {
			width: 100%;
			justify-content: flex-end;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.error-container {
			animation: none;
		}
	}
</style>
