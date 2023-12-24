<script>
	import { setContext, onDestroy, createEventDispatcher } from 'svelte';
	import { contextKey } from '$lib/components/map/mapbox';
	import action from '$lib/components/map/map-action';
	import { EventQueue } from '$lib/components/map/queue';

	export let map = null;
	export let version = 'v2.12.0';
	// 40.911552736237624, -73.9934208

	export let center = [40.911552736237624, -73.9934208];
	export let zoom = 9;
	export let zoomRate = 1;
	export let wheelZoomRate = 1;
	export let options = {};
	export let accessToken;
	export let customStylesheetUrl = false;
	export let style = 'mapbox://styles/mapbox/dark-v10';

	const dispatch = createEventDispatcher();

	setContext(contextKey, {
		getMap: () => map,
		getMapbox: () => mapbox
	});

	let container;
	let mapbox;

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

	function init({ detail }) {
		map = detail.map;
		mapbox = detail.mapbox;
		queue.start(map);
		dispatch('ready');
	}

	onDestroy(() => {
		queue.stop();
		map = undefined;
	});

	export function fitBounds(bbox, data = {}) {
		queue.send('fitBounds', [bbox, data]);
	}

	export function flyTo(destination, data = {}) {
		queue.send('flyTo', [destination, data]);
	}

	export function resize() {
		queue.send('resize');
	}

	export function setCenter(coords, data = {}) {
		queue.send('setCenter', [coords, data]);
	}

	export function setZoom(value, data = {}) {
		queue.send('setZoom', [value, data]);
	}

	export function addControl(control, position = 'top-right') {
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
