<!-- src/lib/components/molecules/Context.svelte -->
<script module lang="ts">
	let id = 1;

	export function uid(): string {
		return `ui:${id++}`;
	}

	export function clone<T>(json: T): T {
		return JSON.parse(JSON.stringify(json)) as T;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="ui">
	{@render children?.()}
</div>

<style>
	/* Default styles */
	.ui :global(*) {
		box-sizing: border-box;
	}

	/* Utility classes */
	.ui :global(.visually-hidden) {
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		height: 1px;
		overflow: hidden;
		position: absolute;
		white-space: nowrap;
		width: 1px;
	}

	.ui :global(.label) {
		font-weight: bold;
	}

	.ui :global(.icon) {
		width: 24px;
		height: 24px;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
</style>
