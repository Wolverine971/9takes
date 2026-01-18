<!-- src/lib/components/atoms/ModalNew.svelte -->
<script lang="ts">
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	// Props
	export let open = false;
	export let title = '';
	export let maxWidth = '600px';
	export let closeOnBackdrop = true;
	export let closeOnEscape = true;
	export let showCloseButton = true;
	export let fullMobile = false;

	// Event dispatcher
	const dispatch = createEventDispatcher();

	// Body scroll management
	let previousBodyOverflow = '';

	$: if (open) {
		if (typeof document !== 'undefined') {
			previousBodyOverflow = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
		}
	} else {
		if (typeof document !== 'undefined') {
			document.body.style.overflow = previousBodyOverflow;
		}
	}

	// Cleanup on destroy
	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.body.style.overflow = previousBodyOverflow;
		}
	});

	/**
	 * Close modal
	 */
	function closeModal() {
		open = false;
		dispatch('close');
	}

	/**
	 * Handle backdrop click
	 */
	function handleBackdropClick(event: MouseEvent) {
		if (closeOnBackdrop && event.target === event.currentTarget) {
			closeModal();
		}
	}

	/**
	 * Handle keyboard events
	 */
	function handleKeydown(event: KeyboardEvent) {
		if (closeOnEscape && event.key === 'Escape') {
			closeModal();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
	<div
		class="modal-overlay"
		class:full-mobile={fullMobile}
		role="dialog"
		aria-modal="true"
		aria-labelledby={title ? 'modal-title' : undefined}
		on:click={handleBackdropClick}
		in:fade={{ duration: 300, easing: cubicOut }}
		out:fade={{ duration: 200, easing: cubicOut }}
	>
		<div
			class="modal-container"
			style="max-width: {maxWidth}"
			in:scale={{ duration: 300, easing: cubicOut, start: 0.9 }}
			out:scale={{ duration: 200, easing: cubicOut, start: 0.9 }}
			on:click|stopPropagation
		>
			<!-- Header -->
			{#if title || showCloseButton}
				<div class="modal-header">
					{#if title}
						<h2 id="modal-title" class="modal-title">{title}</h2>
					{/if}
					{#if showCloseButton}
						<button class="close-button" aria-label="Close modal" on:click={closeModal}>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<line x1="18" y1="6" x2="6" y2="18"></line>
								<line x1="6" y1="6" x2="18" y2="18"></line>
							</svg>
						</button>
					{/if}
				</div>
			{/if}

			<!-- Content -->
			<div class="modal-content">
				<slot />
			</div>

			<!-- Footer -->
			{#if $$slots.footer}
				<div class="modal-footer">
					<slot name="footer" {closeModal} />
				</div>
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(4px);
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;

		&.full-mobile {
			@media (max-width: 640px) {
				padding: 0;
				align-items: stretch;
			}
		}
	}

	.modal-container {
		background-color: #1a1a2e;
		border: 1px solid rgba(100, 116, 139, 0.3);
		border-radius: 12px;
		box-shadow: 0 0 30px rgba(124, 58, 237, 0.2);
		width: 100%;
		max-height: calc(100vh - 2rem);
		overflow: hidden;
		display: flex;
		flex-direction: column;

		.full-mobile & {
			@media (max-width: 640px) {
				border-radius: 0;
				max-height: 100vh;
				height: 100vh;
			}
		}
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem 1.5rem 0;
		border-bottom: 1px solid rgba(100, 116, 139, 0.3);

		@media (max-width: 640px) {
			padding: 1rem 1rem 0;
		}
	}

	.modal-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: #f1f5f9;
		margin: 0;
		line-height: 1.2;

		@media (max-width: 640px) {
			font-size: 1.25rem;
		}
	}

	.close-button {
		background: none;
		border: none;
		cursor: pointer;
		padding: 8px;
		color: #94a3b8;
		border-radius: 6px;
		transition: all 0.2s ease;
		flex-shrink: 0;
		margin-left: 1rem;

		&:hover {
			background-color: rgba(124, 58, 237, 0.2);
			color: #f1f5f9;
		}

		&:focus-visible {
			outline: 2px solid #a78bfa;
			outline-offset: 2px;
		}
	}

	.modal-content {
		flex: 1;
		overflow-y: auto;
		padding: 1.5rem;

		@media (max-width: 640px) {
			padding: 1rem;
		}
	}

	.modal-footer {
		padding: 0 1.5rem 1.5rem;
		border-top: 1px solid rgba(100, 116, 139, 0.3);
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
		align-items: center;

		@media (max-width: 640px) {
			padding: 0 1rem 1rem;
			flex-direction: column-reverse;
			gap: 0.5rem;

			:global(button) {
				width: 100%;
				justify-content: center;
			}
		}
	}

	/* Scrollbar styling for webkit browsers */
	.modal-content::-webkit-scrollbar {
		width: 6px;
	}

	.modal-content::-webkit-scrollbar-track {
		background: transparent;
	}

	.modal-content::-webkit-scrollbar-thumb {
		background-color: #334155;
		border-radius: 3px;

		&:hover {
			background-color: #475569;
		}
	}
</style>
