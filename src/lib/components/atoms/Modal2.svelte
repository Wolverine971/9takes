<script context="module" lang="ts">
	import { browser } from '$app/environment';
	let onTop: any; //keeping track of which open modal is on top
	const modals: any = {}; //all modals get registered here for easy future access

	// 	returns an object for the modal specified by `id`, which contains the API functions (`open` and `close` )
	export function getModal(id = '') {
		return modals[id];
	}
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';
	import { portal } from '../../../utils/portal';

	let topDiv: HTMLDivElement | null;
	let visible = false;
	let prevOnTop: null;
	let closeCallback: (arg0: any) => void;
	export let navTop: boolean = false;
	export let name: string = 'modal';

	export let id = '';

	function keyPress(ev: KeyboardEvent) {
		//only respond if the current modal is the top one
		if (ev.key == 'Escape' && onTop == topDiv) close(ev); //ESC
	}

	/**  API **/
	function open(callback: any) {
		closeCallback = callback;
		if (visible) return;
		prevOnTop = onTop;
		if (topDiv) onTop = topDiv;
		if (browser) {
			window.addEventListener('keydown', keyPress);
		}

		//this prevents scrolling of the main window on larger screens
		document.body.style.overflow = 'hidden';

		visible = true;
		//Move the modal in the DOM to be the last child of <BODY> so that it can be on top of everything
		if (topDiv) document.body.appendChild(topDiv);
	}

	function close(retVal: Event) {
		if (!visible) return;
		if (browser) {
			window.removeEventListener('keydown', keyPress);
			onTop = prevOnTop;
			if (onTop == null) document.body.style.overflow = '';
			visible = false;
			if (closeCallback) closeCallback(retVal);
		}
	}

	//expose the API
	modals[id] = { open, close };

	onDestroy(() => {
		delete modals[id];
		if (browser) {
			window.removeEventListener('keydown', keyPress);
		}
	});
</script>

<div
	id="topModal"
	class:visible
	bind:this={topDiv}
	use:portal
	on:click={close}
	on:keydown={(e) => {
		if (e?.key === 'Enter') close(e);
	}}
>
	<div
		id="modal"
		role="dialog"
		aria-modal="true"
		aria-labelledby={name}
		on:click|stopPropagation={() => {}}
	>
		{#if !navTop}
			<svg
				id="close"
				on:click={close}
				width="1rem"
				viewBox="0 0 12 12"
				role="button"
				tabindex="0"
				on:keydown={(e) => {
					if (e?.key === 'Enter') close(e);
				}}
			>
				<circle cx="6" cy="6" r="6" />
				<line x1="3" y1="3" x2="9" y2="9" />
				<line x1="9" y1="3" x2="3" y2="9" />
			</svg>
		{/if}
		<div id="modal-content">
			<slot />
		</div>
	</div>
</div>

<style lang="scss">
	#topModal {
		visibility: hidden;
		z-index: 9999;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: var(--base-grey-1) 8;
		display: flex;
		align-items: center;
		z-index: 23425343;
		justify-content: center;
	}
	#modal {
		position: relative;
		border-radius: 6px;
		background-color: white;
		border: 2px solid #000;
		filter: drop-shadow(5px 5px 5px #555);
		padding: 1em;
	}

	.visible {
		visibility: visible !important;
	}

	#close {
		position: absolute;
		top: -12px;
		right: -12px;
		width: 24px;
		height: 24px;
		cursor: pointer;
		fill: var(--color-theme-purple);
		transition: transform 0.3s;
	}

	#close:hover {
		transform: scale(2);
	}

	#close line {
		stroke: #fff;
		stroke-width: 2;
	}
	#modal-content {
		max-width: calc(100vw - 20px);
		max-height: calc(100vh - 20px);
		overflow: auto;
	}

	@media (max-width: 480px) {
		#topModal {
			width: 95%;
			justify-content: space-around;
		}
		#modal {
			width: 95%;
		}
	}
</style>
