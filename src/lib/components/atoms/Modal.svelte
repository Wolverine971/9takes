<!-- src/lib/components/atoms/Modal.svelte -->
<script context="module" lang="ts">
	const modals: Record<string, { open: Function; close: Function }> = {};
	let modalStack: HTMLDivElement[] = [];

	export function getModal(id = '') {
		return modals[id];
	}

	function pushTopModal(node: HTMLDivElement | null) {
		if (!node) return;
		modalStack = modalStack.filter((modal) => modal !== node);
		modalStack = [...modalStack, node];
		for (const modal of modalStack) modal.toggleAttribute('inert', modal !== node);
	}

	function removeTopModal(node: HTMLDivElement | null) {
		node?.setAttribute('inert', '');
		modalStack = modalStack.filter((modal) => modal !== node && modal.isConnected);
		modalStack[modalStack.length - 1]?.removeAttribute('inert');
	}

	function isTopModal(node: HTMLDivElement | null) {
		return Boolean(node && modalStack[modalStack.length - 1] === node);
	}
</script>

<script lang="ts">
	import { browser } from '$app/environment';
	import { X } from '@lucide/svelte';
	import { onDestroy, tick } from 'svelte';
	import {
		focusInitialElement,
		inertBodySiblings,
		restoreFocus,
		trapFocus
	} from '$lib/utils/focusBoundary';
	import { lockBodyScroll } from '$lib/utils/scrollLock';
	import { portal } from '../../../utils/portal';

	let topDiv: HTMLDivElement | null = null;
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
	export let contentPadding: string | null = null;
	export let oncloseattempt: (() => void) | null = null;

	function keyPress(ev: KeyboardEvent) {
		const node = topDiv;
		if (!node || !isTopModal(node)) return;

		if (ev.key === 'Tab') {
			trapFocus(ev, node);
			return;
		}

		if (ev.key === 'Escape') {
			ev.preventDefault();
			if (disableClose) oncloseattempt?.();
			else close(ev);
		}
	}

	function closeIfAllowed(retVal: any) {
		if (disableClose) {
			oncloseattempt?.();
			return;
		}
		close(retVal);
	}

	function open(callback?: (arg: any) => void) {
		const node = topDiv;
		if (visible || !node) return;
		closeCallback = callback || null;
		if (browser) {
			previouslyFocused =
				document.activeElement instanceof HTMLElement ? document.activeElement : null;
			releaseBodyScroll = lockBodyScroll();
			window.addEventListener('keydown', keyPress);
			document.body.appendChild(node);
			releaseBackgroundInert = inertBodySiblings(node);
		}
		pushTopModal(node);
		visible = true;

		void tick().then(() => {
			if (visible && node.isConnected && isTopModal(node)) focusInitialElement(node, initialFocus);
		});
	}

	function close(retVal: any) {
		if (!visible) return;
		const node = topDiv;
		const callback = closeCallback;
		visible = false;
		closeCallback = null;
		if (browser) {
			window.removeEventListener('keydown', keyPress);
			releaseBodyScroll?.();
			releaseBodyScroll = null;
			releaseBackgroundInert?.();
			releaseBackgroundInert = null;
		}
		removeTopModal(node);
		restoreFocus(previouslyFocused);
		previouslyFocused = null;
		callback?.(retVal);
	}

	const controller = { open, close };
	modals[id] = controller;

	onDestroy(() => {
		if (modals[id] === controller) delete modals[id];
		const wasVisible = visible;
		visible = false;
		closeCallback = null;
		if (browser) {
			window.removeEventListener('keydown', keyPress);
			if (wasVisible) {
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
	class="modal-overlay fixed inset-0 z-[300] flex items-center justify-center bg-black/70 transition-[opacity,visibility] duration-300 {visible
		? 'opacity-100'
		: 'invisible opacity-0'}"
	class:full-mobile-overlay={fullMobile}
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
		class="modal-container relative w-[95%] transform overflow-hidden rounded-xl border border-[var(--stone-edge)] bg-[var(--stone-warm)] shadow-[var(--shadow-xl)] transition-[opacity,transform] duration-300 sm:w-auto {visible
			? 'scale-100 opacity-100'
			: 'scale-95 opacity-0'}"
		class:full-mobile={fullMobile}
		style:--modal-max-width={maxWidth || undefined}
	>
		{#if !navTop}
			<button
				type="button"
				on:click={closeIfAllowed}
				aria-label="Close dialog"
				disabled={disableClose}
				class="absolute right-3 top-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-md border border-[var(--stone-edge)] bg-[var(--night-mid)] p-0 text-[var(--ink-mid)] transition-colors duration-200 hover:bg-[var(--stone-mid)] hover:text-[var(--ink-bright)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lamp-glow)] disabled:cursor-not-allowed disabled:opacity-50"
			>
				<X size={18} strokeWidth={2} aria-hidden="true" />
			</button>
		{/if}
		<div class="modal-scroll-region" style:padding={contentPadding || undefined}>
			<slot />
		</div>
	</div>
</div>

<style>
	.modal-overlay {
		padding: max(1rem, env(safe-area-inset-top, 0px)) max(1rem, env(safe-area-inset-right, 0px))
			max(1rem, env(safe-area-inset-bottom, 0px)) max(1rem, env(safe-area-inset-left, 0px));
	}

	.modal-container {
		max-width: min(var(--modal-max-width, calc(100vw - 20px)), calc(100vw - 20px));
		max-height: calc(100vh - 2rem);
		max-height: calc(100dvh - 2rem);
	}

	.modal-scroll-region {
		max-height: calc(100vh - 2rem);
		max-height: calc(100dvh - 2rem);
		overflow-y: auto;
		overscroll-behavior: contain;
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
		.modal-overlay.full-mobile-overlay {
			padding: 0;
		}

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
