<!-- src/lib/components/map/controls/ScaleControl.svelte -->
<script lang="ts">
	import { untrack } from 'svelte';
	import { getMapContext } from '$lib/components/map/map-context';

	type MapboxLike = {
		ScaleControl: new (options: Record<string, unknown>) => unknown;
	};

	interface Props {
		position?: string;
		options?: Record<string, unknown>;
	}

	let { position = 'bottom-right', options = {} }: Props = $props();

	const { getMap, getMapbox } = getMapContext();
	const map = getMap() as { addControl: (control: unknown, position: string) => void };
	const mapbox = getMapbox() as MapboxLike;

	// The control is added once when the component is created, so the props are read once on purpose.
	untrack(() => {
		const optionsWithDefaults = Object.assign(
			{
				maxWidth: 80,
				unit: 'metric'
			},
			options
		);
		map.addControl(new mapbox.ScaleControl(optionsWithDefaults), position);
	});
</script>
