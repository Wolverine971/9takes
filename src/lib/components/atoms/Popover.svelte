<!-- src/lib/components/atoms/Popover.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	export let title: string = '';
	export let position: 'top' | 'right' | 'bottom' | 'left' | 'top-right' | 'bottom-right' =
		'bottom-right';

	let popupVisible = false;
	let popoverContainer: HTMLElement;
	let popoverElement: HTMLElement;

	function handleClick(e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();
		popupVisible = !popupVisible;

		if (popupVisible) {
			// Add a small delay to ensure the click event has finished
			setTimeout(() => {
				document.addEventListener('click', handleOutsideClick);
				if (popoverElement) {
					adjustPosition();
				}
			}, 10);
		} else {
			document.removeEventListener('click', handleOutsideClick);
		}
	}

	function handleOutsideClick(e: MouseEvent) {
		if (popoverContainer && !popoverContainer.contains(e.target as Node)) {
			popupVisible = false;
			document.removeEventListener('click', handleOutsideClick);
		}
	}

	// Function to adjust the position of the popover to prevent it from going off-screen
	function adjustPosition() {
		if (!popoverElement) return;

		const rect = popoverElement.getBoundingClientRect();
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		// Check if popover is going off the right edge
		if (rect.right > viewportWidth) {
			popoverElement.style.right = '0';
			popoverElement.style.left = 'auto';
		}

		// Check if popover is going off the bottom edge
		if (rect.bottom > viewportHeight) {
			popoverElement.style.bottom = '100%';
			popoverElement.style.top = 'auto';
		}
	}

	onMount(() => {
		// Cleanup event listeners when component is destroyed
		return () => {
			if (popupVisible) {
				document.removeEventListener('click', handleOutsideClick);
			}
		};
	});
</script>

<div class="relative inline-block" bind:this={popoverContainer}>
	<button
		type="button"
		class="border-0 bg-transparent p-0"
		on:click={handleClick}
		aria-label="Open menu"
	>
		<slot name="icon" />
	</button>

	{#if popupVisible}
		<div
			class="absolute z-[9999] mt-1 min-w-[180px] rounded-lg border border-neutral-200 bg-white p-2 shadow-lg {position ===
			'bottom-right'
				? 'right-0'
				: position === 'top-right'
					? 'bottom-full right-0 mb-2 mt-0'
					: 'left-0'}"
			bind:this={popoverElement}
			on:click|stopPropagation
			on:keydown
			role="menu"
			tabindex="-1"
		>
			<slot name="popoverValue" />
		</div>
	{/if}
</div>
