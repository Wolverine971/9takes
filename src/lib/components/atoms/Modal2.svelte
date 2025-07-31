<!-- lib/components/atoms/Modal2.svelte -->
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
	class="fixed inset-0 z-[23425343] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300 {visible
		? 'opacity-100'
		: 'opacity-0 invisible'}"
	bind:this={topDiv}
	use:portal
	role="dialog"
	aria-modal="true"
	aria-labelledby={name}
	on:click={handleBackdropClick}
>
	<!-- Modal content container -->
	<div
		class="relative max-h-[90vh] w-[95%] max-w-[calc(100vw-20px)] transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-300 sm:w-auto {visible
			? 'scale-100 opacity-100'
			: 'scale-95 opacity-0'}"
		on:click|stopPropagation={() => {}}
	>
		{#if !navTop}
			<button
				on:click={close}
				aria-label="Close dialog"
				class="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-neutral-100 p-0 transition-all duration-200 hover:bg-neutral-200 hover:rotate-90"
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-neutral-600">
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>
		{/if}
		<div class="max-h-[85vh] overflow-y-auto">
			<slot />
		</div>
	</div>
</div>
