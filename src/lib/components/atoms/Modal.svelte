<script lang="ts">
	import { Portal } from '$lib/components/abstract';
	import { clickOutside } from '$lib/utils';
	import { setContext } from 'svelte';
	// import { clickOutside } from '$lib/utils';
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
			<div
				class="close"
				on:click={close}
				on:keydown={(e) => {
					if (e.charCode === 13) close();
				}}
			>
				✖
			</div>
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

	:root {
		--fore-color: #2e3440;
		--secondary-fore-color: #3b4252;
		--back-color: #eceff4;
		--secondary-back-color: #e5e9f0;
		--border-color: #d8dee9;
		--secondary-border-color: #e5e9f0;
		--universal-margin: 0.5rem;
		--universal-padding: 0.5rem;
		--universal-border-radius: 0.25rem;
		accent-color: #5e81ac;
		--button-fore-color: #2e3440;
		--button-border-color: transparent;
		--button-hover-border-color: transparent;
		--modal-overlay-color: rgba(0, 0, 0, 0.45);
		--modal-close-color: #3b4252;
		--modal-close-hover-color: #e5e9f0;
		--modal-back-color: #fff;
	}
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

	modal {
		border-radius: calc(2 * var(--universal-border-radius));
		border-color: var(--border-color);
		border-width: 4px;
		box-shadow: 0 0 24px var(--modal-close-color);
		padding: calc(2 * var(--universal-padding)) calc(4 * var(--universal-padding));
		background-color: var(--modal-back-color);
		max-width: 64ch;
		margin: auto;
		position: fixed;
	}
	::backdrop {
		background-color: var(--modal-overlay-color);
		backdrop-filter: blur(2px);
	}

	modal .x {
		filter: grayscale(1);
		border: none;
		background: none;
		position: absolute;
		top: 0;
		right: 0.4rem;
	}
	modal form {
		border: 0;
	}
	modal #modalActions {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
