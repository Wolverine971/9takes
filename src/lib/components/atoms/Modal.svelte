<!-- src/lib/components/atoms/Modal.svelte -->
<script context="module" lang="ts">
	const modals: Record<string, { open: Function; close: Function }> = {};
	let modalStack: HTMLDivElement[] = [];

	export function getModal(id = '') {
		return modals[id];
	}

	function pushTopModal(node: HTMLDivElement) {
		modalStack = modalStack.filter((modal) => modal !== node);
		modalStack = [...modalStack, node];
		for (const modal of modalStack) modal.toggleAttribute('inert', modal !== node);
	}

	function removeTopModal(node: HTMLDivElement) {
		node.setAttribute('inert', '');
		modalStack = modalStack.filter((modal) => modal !== node);
		modalStack[modalStack.length - 1]?.removeAttribute('inert');
	}

	function isTopModal(node: HTMLDivElement) {
		return modalStack[modalStack.length - 1] === node;
	}
</script>

<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy, tick } from 'svelte';
	import {
		focusInitialElement,
		inertBodySiblings,
		restoreFocus,
		trapFocus
	} from '$lib/utils/focusBoundary';
	import { lockBodyScroll } from '$lib/utils/scrollLock';
	import { portal } from '../../../utils/portal';

	let topDiv: HTMLDivElement;
	let visible = false;
	let closeCallback: ((arg: any) => void) | null = null;
	let releaseBodyScroll: (() => void) | null = null;
	let releaseBackgroundInert: (() => void) | null = null;
	let previouslyFocused: HTMLElement | null = null;

	export let navTop = false;
	export let name = 'Dialog';
	export let id = '';
	export let disableClose = false;
	export let maxWidth: string | null = null;
	export let fullMobile = false;
	export let labelledBy: string | null = null;
	export let describedBy: string | null = null;
	export let initialFocus: string | null = null;

	function keyPress(ev: KeyboardEvent) {
		if (!isTopModal(topDiv)) return;

		if (ev.key === 'Tab') {
			trapFocus(ev, topDiv);
			return;
		}

		if (ev.key === 'Escape' && !disableClose) {
			ev.preventDefault();
			close(ev);
		}
	}

	function closeIfAllowed(retVal: any) {
		if (disableClose) return;
		close(retVal);
	}

	function open(callback?: (arg: any) => void) {
		if (visible) return;
		closeCallback = callback || null;
		if (browser) {
			previouslyFocused =
				document.activeElement instanceof HTMLElement ? document.activeElement : null;
			releaseBodyScroll = lockBodyScroll();
			window.addEventListener('keydown', keyPress);
			document.body.appendChild(topDiv);
			releaseBackgroundInert = inertBodySiblings(topDiv);
		}
		pushTopModal(topDiv);
		visible = true;

		void tick().then(() => {
			if (visible && isTopModal(topDiv)) focusInitialElement(topDiv, initialFocus);
		});
	}

	function close(retVal: any) {
		if (!visible) return;
		if (browser) {
			window.removeEventListener('keydown', keyPress);
			releaseBodyScroll?.();
			releaseBodyScroll = null;
			releaseBackgroundInert?.();
			releaseBackgroundInert = null;
		}
		removeTopModal(topDiv);
		visible = false;
		restoreFocus(previouslyFocused);
		previouslyFocused = null;
		if (closeCallback) closeCallback(retVal);
	}

	modals[id] = { open, close };

	onDestroy(() => {
		delete modals[id];
		if (browser) {
			window.removeEventListener('keydown', keyPress);
			if (visible) {
				releaseBodyScroll?.();
				releaseBodyScroll = null;
				releaseBackgroundInert?.();
				releaseBackgroundInert = null;
				removeTopModal(topDiv);
				restoreFocus(previouslyFocused);
				previouslyFocused = null;
			}
		}
	});
</script>

<div
	class="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all duration-300 {visible
		? 'opacity-100'
		: 'invisible opacity-0'}"
	bind:this={topDiv}
	use:portal
	role="dialog"
	aria-modal={visible ? 'true' : undefined}
	aria-label={labelledBy ? undefined : name || 'Dialog'}
	aria-labelledby={labelledBy || undefined}
	aria-describedby={describedBy || undefined}
	aria-hidden={visible ? undefined : 'true'}
	inert={!visible}
	tabindex="-1"
	on:click|self={closeIfAllowed}
>
	<!-- Modal content container -->
	<div
		class="modal-container relative w-[95%] max-w-[calc(100vw-20px)] transform overflow-hidden rounded-xl border border-[var(--stone-edge)] bg-[var(--stone-warm)] shadow-[var(--shadow-xl)] transition-all duration-300 sm:w-auto {visible
			? 'scale-100 opacity-100'
			: 'scale-95 opacity-0'}"
		class:full-mobile={fullMobile}
		style={maxWidth ? `max-width: min(${maxWidth}, calc(100vw - 20px))` : ''}
	>
		{#if !navTop}
			<button
				type="button"
				on:click={closeIfAllowed}
				aria-label="Close dialog"
				class="absolute right-3 top-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[var(--night-deep)] p-0 transition-all duration-200 hover:rotate-90 hover:bg-[var(--lamp-soft)]"
			>
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="text-[var(--ink-mid)]"
				>
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>
		{/if}
		<div class="modal-scroll-region">
			<slot />
		</div>
	</div>
</div>

<style>
	.modal-container {
		max-height: calc(100vh - 2rem);
		max-height: calc(100dvh - 2rem);
	}

	.modal-scroll-region {
		max-height: calc(100vh - 2rem);
		max-height: calc(100dvh - 2rem);
		overflow-y: auto;
		padding: 1.5rem;
	}

	@media (min-width: 640px) {
		.modal-scroll-region {
			max-height: min(85vh, calc(100vh - 2rem));
			max-height: min(85dvh, calc(100dvh - 2rem));
			padding: 2rem;
		}
	}

	@media (max-width: 640px) {
		:global(.modal-container.full-mobile) {
			width: 100vw;
			max-width: 100vw;
			height: 100vh;
			height: 100dvh;
			max-height: 100vh;
			max-height: 100dvh;
			border-radius: 0;
			border: none;
		}

		:global(.modal-container.full-mobile) .modal-scroll-region {
			max-height: 100vh;
			max-height: 100dvh;
			min-height: 100%;
			padding-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px));
		}
	}
</style>
