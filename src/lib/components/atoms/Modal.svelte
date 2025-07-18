<!-- lib/components/atoms/Modal.svelte -->
<script lang="ts">
	import { Portal } from '$lib/components/abstract';
	import { clickOutside } from '$lib/utils';
	import { setContext } from 'svelte';
	export let title: string;
	export let visible = false;
	export let canClickOutside = false;
	export let id: string;
	const close = (): void => {
		visible = false;
	};
	const handleClickOutside = (): void => {
		if (canClickOutside) close();
	};
	setContext('close', close);
</script>

<Portal>
	<!-- <Portal> -->
	<input type="checkbox" class="modal-toggle" bind:checked={visible} />

	<div class="modal" {id} use:clickOutside={{ callback: handleClickOutside }}>
		<div class="modal-box">
			<button
				type="button"
				on:click={close}
				on:keydown={(e) => {
					if (e?.key === 'Enter') close();
				}}
			>
				✖
			</button>
			<h2>
				{title ?? ''}
			</h2>
			<slot />
			{#if $$slots.actions}
				<div class="modal-action">
					<slot name="actions" {close} />
				</div>
			{/if}
		</div>
	</div>
	<!-- </Portal> -->
</Portal>

<style lang="scss">
	/* Using global CSS variables from design system */
	/* h2 {
		@apply text-primary-content font-bold;
	}
	.close {
		@apply absolute top-4 right-4 text-xl
        cursor-pointer;
	}
	h2 {
		@apply text-2xl;
	} */

	.modal {
		@extend .modal-overlay !optional;
	}

	.modal-box {
		@extend .modal-content !optional;
		max-width: 64ch;
		padding: 2rem;
	}

	button {
		@extend .modal-close !optional;
		font-size: 1.25rem;
		width: 2.5rem;
		height: 2.5rem;
	}

	h2 {
		color: var(--text-primary);
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0 0 1rem 0;
	}

	.modal-action {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		margin-top: 2rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border-color);
	}
	modal #modalActions {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
