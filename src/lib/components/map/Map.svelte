<!-- src/lib/components/map/Map.svelte -->
<script lang="ts">
	import { setContext, onDestroy, createEventDispatcher } from 'svelte';
	import { contextKey } from '$lib/components/map/mapbox';
	import action from '$lib/components/map/map-action';
	import { EventQueue } from '$lib/components/map/queue';

	type MapReadyDetail = { map: unknown; mapbox: unknown };

	export let map: Record<string, (...args: unknown[]) => unknown> | null = null;
	export let version = 'v2.12.0';
	// 40.911552736237624, -73.9934208

	export let center: [number, number] = [40.911552736237624, -73.9934208];
	export let zoom = 9;
	export let zoomRate = 1;
	export let wheelZoomRate = 1;
	export let options: Record<string, unknown> = {};
	export let accessToken = '';
	export let customStylesheetUrl: string | false = false;
	export let style = 'mapbox://styles/mapbox/dark-v10';

	const dispatch = createEventDispatcher();

	setContext(contextKey, {
		getMap: () => map,
		getMapbox: () => mapbox
	});

	let container: HTMLElement | undefined;
	let mapbox: unknown = null;

	const optionsWithDefaults = Object.assign(
		{
			accessToken,
			container,
			style,
			center,
			zoom,
			zoomRate,
			wheelZoomRate,
			version,
			customStylesheetUrl,
			map
		},
		options
	);

	const queue = new EventQueue();

	function init({ detail }: CustomEvent<unknown>) {
		const readyDetail = detail as MapReadyDetail;
		map = readyDetail.map as Record<string, (...args: unknown[]) => unknown>;
		mapbox = readyDetail.mapbox;
		queue.start(map);
		dispatch('ready');
	}

	onDestroy(() => {
		queue.stop();
		map = null;
	});

	export function fitBounds(bbox: unknown, data: Record<string, unknown> = {}) {
		queue.send('fitBounds', [bbox, data]);
	}

	export function flyTo(destination: unknown, data: Record<string, unknown> = {}) {
		queue.send('flyTo', [destination, data]);
	}

	export function resize() {
		queue.send('resize');
	}

	export function setCenter(coords: unknown, data: Record<string, unknown> = {}) {
		queue.send('setCenter', [coords, data]);
	}

	export function setZoom(value: number, data: Record<string, unknown> = {}) {
		queue.send('setZoom', [value, data]);
	}

	export function addControl(control: unknown, position = 'top-right') {
		queue.send('addControl', [control, position]);
	}

	export function getMap() {
		return map;
	}

	export function getMapbox() {
		return mapbox;
	}

	$: zoom && setZoom(zoom);
</script>

<div
	use:action={optionsWithDefaults}
	on:ready={init}
	on:recentre
	on:dragend
	on:click
	on:zoomstart
	on:zoom
	on:zoomend
	on:drag
	on:keydown
	role="button"
	tabindex="0"
>
	{#if map}
		<slot />
	{/if}
</div>

<style>
	div {
		width: 100%;
		height: 100%;
	}
</style>
