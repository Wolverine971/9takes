<!-- src/lib/components/enneagramTest/TypeBadge.svelte -->
<script lang="ts">
	import { TYPE_COLOR_MAP } from '$lib/constants/enneagramColors';

	type Props = { type: number; small?: boolean };

	let { type, small = false }: Props = $props();
</script>

<span class="badge-num" class:small style:--type-color={TYPE_COLOR_MAP[type]} aria-hidden="true"
	>{type}</span
>

<style>
	.badge-num {
		display: inline-grid;
		place-items: center;
		flex: none;
		width: 2.5rem;
		height: 2.5rem;
		border: 2px solid var(--type-color);
		border-radius: 9999px;
		background: color-mix(in srgb, var(--type-color) 14%, transparent);
		color: var(--ink-bright);
		font-weight: 800;
		font-size: 1.05rem;
		font-variant-numeric: tabular-nums;
	}

	.small {
		width: 1.9rem;
		height: 1.9rem;
		font-size: 0.88rem;
	}
</style>
