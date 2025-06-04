<!-- lib/components/map/controls/GeolocateControl.svelte -->
<script>
	import { getContext, onMount } from 'svelte';
	import { contextKey } from '$lib/components/map/mapbox';
	import { bindEvents } from '$lib/components/map/event-binding';

	const { getMap, getMapbox } = getContext(contextKey);
	const map = getMap();
	const mapbox = getMapbox();

	export let position = 'top-left';
	export let options = {};

	let dispatcher;

	const handlers = {
		error: (el, ev) => {
			return ['error', ev];
		},
		geolocate: (el, ev) => {
			return ['geolocate', ev];
		},
		outofmaxbounds: (el, ev) => {
			return ['outofmaxbounds', ev];
		},
		trackuserlocationend: (el, ev) => {
			return ['trackuserlocationend', ev];
		},
		trackuserlocationstart: (el, ev) => {
			return ['trackuserlocationstart', ev];
		}
	};

	const geolocate = new mapbox.GeolocateControl(options);
	map.addControl(geolocate, position);

	onMount(() => {
		return bindEvents(geolocate, handlers, mapbox, dispatcher);
	});

	export function trigger() {
		geolocate.trigger();
	}
</script>

<div
	bind:this={dispatcher}
	on:error
	on:geolocate
	on:outofmaxbounds
	on:trackuserlocationend
	on:trackuserlocationstart
/>

<style>
	div {
		display: none;
	}
</style>
