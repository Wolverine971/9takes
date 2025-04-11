<script context="module" lang="ts">
	import { browser } from '$app/environment';
	const modals: Record<string, { open: Function; close: Function }> = {};

	export function getModal(id = '') {
		return modals[id];
	}
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';
	import { portal } from '../../../utils/portal';

	let topDiv: HTMLDivElement;
	let visible = false;
	let prevOnTop: HTMLDivElement | null = null;
	let closeCallback: ((arg: any) => void) | null = null;

	export let navTop = false;
	export let name = 'modal';
	export let id = '';

	let onTop: HTMLDivElement | null = null;

	function keyPress(ev: KeyboardEvent) {
		if (ev.key === 'Escape' && onTop === topDiv) close(ev);
	}

	function open(callback?: (arg: any) => void) {
		if (visible) return;
		closeCallback = callback || null;
		prevOnTop = onTop;
		onTop = topDiv;
		if (browser) {
			window.addEventListener('keydown', keyPress);
			document.body.style.overflow = 'hidden';
		}
		visible = true;
		document.body.appendChild(topDiv);
	}

	function close(retVal: any) {
		if (!visible) return;
		if (browser) {
			window.removeEventListener('keydown', keyPress);
			onTop = prevOnTop;
			if (onTop === null) document.body.style.overflow = '';
		}
		visible = false;
		if (closeCallback) closeCallback(retVal);
	}

	// Handle backdrop click
	function handleBackdropClick(event: MouseEvent) {
		// Only close if clicking the backdrop (not modal content)
		if (event.target === topDiv) {
			close(event);
		}
	}

	modals[id] = { open, close };

	onDestroy(() => {
		delete modals[id];
		if (browser) {
			window.removeEventListener('keydown', keyPress);
		}
	});
</script>

<div
	class="topModal"
	class:visible
	bind:this={topDiv}
	use:portal
	role="dialog"
	aria-modal="true"
	aria-labelledby={name}
	on:click={handleBackdropClick}
>
	<!-- Modal content container -->
	<div id="modal" on:click|stopPropagation={() => {}}>
		{#if !navTop}
			<button id="close" on:click={close} aria-label="Close dialog" class="close-button">
				<svg width="1rem" viewBox="0 0 12 12">
					<circle cx="6" cy="6" r="6" />
					<line x1="3" y1="3" x2="9" y2="9" />
					<line x1="9" y1="3" x2="3" y2="9" />
				</svg>
			</button>
		{/if}
		<div id="modal-content">
			<slot />
		</div>
	</div>
</div>

<style lang="scss">
	.topModal {
		visibility: hidden;
		position: fixed;
		inset: 0;
		background-color: rgba(var(--light-gray), 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 23425343;
	}
	#modal {
		position: relative;
		border-radius: 6px;
		background-color: var(--light-gray);
		border: 2px solid #000;
		filter: drop-shadow(5px 5px 5px #555);
		padding: 1em;
	}
	.visible {
		visibility: visible !important;
	}
	.close-button {
		position: absolute;
		top: -12px;
		right: -12px;
		width: 24px;
		height: 24px;
		cursor: pointer;
		background: none;
		border: none;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#close {
		width: 24px;
		height: 24px;
		transition: transform 0.3s;
		&:hover {
			transform: scale(1.2);
		}
	}
	#close svg {
		fill: var(--primary);
		width: 100%;
		height: 100%;

		line {
			stroke: #fff;
			stroke-width: 2;
		}
	}
	#modal-content {
		max-width: calc(100vw - 20px);
		max-height: 80vh;
		overflow: auto;
	}
	@media (max-width: 480px) {
		.topModal,
		#modal {
			width: 95%;
		}
		.topModal {
			justify-content: space-around;
		}
	}
</style>
