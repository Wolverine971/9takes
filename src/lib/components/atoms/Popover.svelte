<!-- lib/components/atoms/Popover.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	export let title: string = '';
	export let position: 'top' | 'right' | 'bottom' | 'left' | 'top-right' | 'bottom-right' =
		'bottom-right';

	let popupVisible = writable(false);
	let popoverContainer: any;
	let popoverElement: HTMLElement;

	function handleClick() {
		popupVisible.update((v) => !v);
		if ($popupVisible) {
			document.addEventListener('click', handleOutsideClick, false);
			// Add timeout to allow DOM to update before positioning
			setTimeout(adjustPosition, 0);
		} else {
			document.removeEventListener('click', handleOutsideClick, false);
		}
	}

	function handleOutsideClick(e: any) {
		if (popoverContainer.contains(e.target)) {
			return;
		}
		handleClick();
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
			document.removeEventListener('click', handleOutsideClick);
		};
	});
</script>

<div class="popover-container" bind:this={popoverContainer}>
	<button class="btn" style="display: flex;" type="button" on:click={handleClick} {title}>
		{title}
		<slot name="icon" />
	</button>

	{#if $popupVisible}
		<div class="popover {position}" bind:this={popoverElement}>
			<slot name="popoverValue" />
		</div>
	{/if}
</div>

<style lang="scss">
	button {
		border: 0;
		color: #fff;
		display: block;
		border-radius: 4px;
		padding: 0;
		background: transparent;
		cursor: pointer;
	}

	.popover {
		border-radius: var(--base-border-radius);
		padding: 1rem;
		background-color: #f4f4ef;
		border: var(--classic-border);
		min-width: 180px;
		position: absolute;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
		z-index: 1000;

		// Default position (bottom-left)
		top: 100%;
		left: 0;
		margin-top: 0.5rem;

		// Position variations
		&.right {
			left: 100%;
			top: 0;
			margin-left: 0.5rem;
			margin-top: 0;
		}

		&.top {
			bottom: 100%;
			top: auto;
			margin-bottom: 0.5rem;
			margin-top: 0;
		}

		&.left {
			right: 100%;
			left: auto;
			top: 0;
			margin-right: 0.5rem;
			margin-top: 0;
		}

		&.top-right {
			bottom: 100%;
			top: auto;
			right: 0;
			left: auto;
			margin-bottom: 0.5rem;
		}

		&.bottom-right {
			top: 100%;
			right: 0;
			left: auto;
			margin-top: 0.5rem;
		}
	}

	.popover-container {
		position: relative;
		display: inline-block;
	}

	@media (max-width: 768px) {
		.popover {
			width: auto;
			min-width: 150px;
			max-width: 220px;
		}
	}
</style>
