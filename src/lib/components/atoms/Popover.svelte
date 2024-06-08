<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	export let title: string = '';
	let popupVisible = writable(false);
	let popoverContainer: any;

	function handleClick() {
		popupVisible.update((v) => !v);
		if ($popupVisible) {
			document.addEventListener('click', handleOutsideClick, false);
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

	onMount(() => {
		// Optional: Cleanup if needed
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
		<div class="popover">
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
	}

	.popover {
		border-radius: var(--base-border-radius);
		padding: 1rem;
		background-color: #f4f4ef;
		border: var(--classic-border);
		width: min-content;
		position: absolute;
		top: -40px;
		right: 0;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
		z-index: 12324;
	}

	.popover-container {
		position: relative;
	}
</style>
