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
	class="fixed inset-0 z-[23425343] flex items-center justify-center bg-neutral-200/80 {visible
		? ''
		: 'invisible'}"
	bind:this={topDiv}
	use:portal
	role="dialog"
	aria-modal="true"
	aria-labelledby={name}
	on:click={handleBackdropClick}
>
	<!-- Modal content container -->
	<div
		class="relative max-h-[80vh] w-[95%] max-w-[calc(100vw-20px)] overflow-auto rounded-md border-2 border-black bg-neutral-200 p-4 drop-shadow-[5px_5px_5px_#555] sm:w-auto"
		on:click|stopPropagation={() => {}}
	>
		{#if !navTop}
			<button
				on:click={close}
				aria-label="Close dialog"
				class="absolute -right-3 -top-3 flex h-6 w-6 cursor-pointer items-center justify-center border-none bg-none p-0 transition-transform duration-300 hover:scale-110"
			>
				<svg width="24" height="24" viewBox="0 0 12 12" class="h-full w-full">
					<circle cx="6" cy="6" r="6" class="fill-primary-700" />
					<line x1="3" y1="3" x2="9" y2="9" class="stroke-white stroke-2" />
					<line x1="9" y1="3" x2="3" y2="9" class="stroke-white stroke-2" />
				</svg>
			</button>
		{/if}
		<div>
			<slot />
		</div>
	</div>
</div>
