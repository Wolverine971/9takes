<!-- src/lib/components/atoms/Popover.svelte -->
<script lang="ts">
	import { onMount, tick } from 'svelte';

	export let position: 'top' | 'right' | 'bottom' | 'left' | 'top-right' | 'bottom-right' =
		'bottom-right';

	let popupVisible = false;
	let popoverContainer: HTMLElement;
	let triggerButton: HTMLElement;

	// Fixed position coordinates
	let popoverStyle = '';

	function calculatePosition() {
		if (!triggerButton) return;

		const triggerRect = triggerButton.getBoundingClientRect();

		let top: number;
		let right: number;

		// Position below the trigger, aligned to right edge
		top = triggerRect.bottom + 4;
		// Use right positioning instead of left - distance from right edge of viewport
		right = window.innerWidth - triggerRect.right;

		// Handle top positions
		if (position === 'top-right' || position === 'top') {
			// Position above - estimate height as 100px
			top = triggerRect.top - 100 - 4;
			if (top < 8) top = triggerRect.bottom + 4;
		}

		popoverStyle = `top: ${top}px; right: ${right}px;`;
	}

	async function handleClick(e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();

		if (popupVisible) {
			close();
		} else {
			await open();
		}
	}

	async function open() {
		// Calculate position first based on trigger
		calculatePosition();
		popupVisible = true;

		await tick();

		document.addEventListener('click', handleOutsideClick);
		window.addEventListener('scroll', handleScroll, true);
		window.addEventListener('resize', handleResize);
	}

	function close() {
		popupVisible = false;
		popoverStyle = '';
		removeListeners();
	}

	function handleOutsideClick(e: MouseEvent) {
		if (popoverContainer && !popoverContainer.contains(e.target as Node)) {
			close();
		}
	}

	function handleScroll() {
		if (popupVisible) {
			calculatePosition();
		}
	}

	function handleResize() {
		if (popupVisible) {
			calculatePosition();
		}
	}

	function removeListeners() {
		document.removeEventListener('click', handleOutsideClick);
		window.removeEventListener('scroll', handleScroll, true);
		window.removeEventListener('resize', handleResize);
	}

	onMount(() => {
		return () => {
			removeListeners();
		};
	});
</script>

<div class="relative inline-block" bind:this={popoverContainer}>
	<button
		type="button"
		class="border-0 bg-transparent p-0"
		on:click={handleClick}
		bind:this={triggerButton}
		aria-label="Open menu"
		aria-expanded={popupVisible}
		aria-haspopup="menu"
	>
		<slot name="icon" />
	</button>

	{#if popupVisible}
		<div
			class="fixed z-[9999] min-w-[180px] rounded-lg border border-slate-700/50 bg-[#1a1a2e] p-2 shadow-[0_0_20px_rgba(124,58,237,0.2)]"
			style={popoverStyle}
			on:click|stopPropagation
			on:keydown
			role="menu"
			tabindex="-1"
		>
			<slot name="popoverValue" />
		</div>
	{/if}
</div>
