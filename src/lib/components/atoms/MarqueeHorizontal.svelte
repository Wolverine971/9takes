<script lang="ts">
	import { onMount } from 'svelte';

	export let displayList: { name: string; link: string }[] = [];
	export let noMove: boolean = false;

	onMount(() => {});
</script>

<!-- {250 * displayList.length}px; -->
<div class="marquee-horizontal" style="width: {928 * 2}px">
	<div class="track-horizontal-alt" style="{noMove ? 'animation: none;' : ''} ">
		<span style="width:50%; flex: 1">
			{#each displayList as item}
				<a href={item.link} class="marquee-text">{item.name}</a>
			{/each}
		</span>
		<span style="width:50%; flex: 1">
			{#each displayList as item}
				<a href={item.link} class="marquee-text">{item.name}</a>
			{/each}
		</span>
	</div>
</div>

<style lang="scss">
	.marquee-text {
		color: var(--color-p-origin) !important;
		text-transform: uppercase;
		flex: none;
		font-size: 1.2rem;
		margin: 2rem;
	}
	a::after {
		margin: 0 0.2rem;
	}
	.marquee-horizontal {
		z-index: 200;
		width: 100%;
		height: 3rem;
		outline-offset: -1px;
		object-fit: scale-down;
		border-top: 3px solid var(--color-theme-purple-v);
		border-bottom: 3px solid var(--color-theme-purple-v);
		outline: 2px solid #fdfdfb;
		justify-content: center;
		align-items: center;
		display: flex;
		position: relative;
		overflow: hidden;
	}

	.track-horizontal-alt {
		width: 200%;
		// border-top: 1px solid grey;
		// border-bottom: 1px solid grey;
		position: absolute;
		white-space: nowrap;
		will-change: transform;
		animation: marquee-horizontal-alt 15s linear infinite;
		/* manipulate the speed of the marquee by changing "40s" line above*/
		display: inline-flex;
		justify-content: center;
		gap: 3rem;
		align-items: center;
		overflow: hidden;
	}

	@keyframes marquee-horizontal-alt {
		from {
			transform: translateX(-50%);
		}
		to {
			transform: translateX(0%);
		}
	}
</style>
