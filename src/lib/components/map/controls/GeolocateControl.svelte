<!-- src/lib/components/map/controls/GeolocateControl.svelte -->
<script lang="ts">
	import { getContext, onMount, createEventDispatcher } from 'svelte';
	import { contextKey } from '$lib/components/map/mapbox';
	import { bindEvents } from '$lib/components/map/event-binding';

	type GeolocateLike = {
		trigger: () => void;
		on: (handler: string, callback: (ev: unknown) => void) => void;
		off: (handler: string, callback: (ev: unknown) => void) => void;
	};

	type MapboxLike = {
		GeolocateControl: new (options: Record<string, unknown>) => GeolocateLike;
	};

	const { getMap, getMapbox } = getContext(contextKey) as {
		getMap: () => { addControl: (control: unknown, position: string) => void };
		getMapbox: () => MapboxLike;
	};
	const map = getMap();
	const mapbox = getMapbox();
	const dispatch = createEventDispatcher();

	export let position = 'top-left';
	export let options: Record<string, unknown> = {};

	const handlers: Record<
		string,
		(el: GeolocateLike, ev: unknown, mapbox: unknown) => [string, unknown]
	> = {
		error: (_el, ev) => {
			return ['error', ev];
		},
		geolocate: (_el, ev) => {
			return ['geolocate', ev];
		},
		outofmaxbounds: (_el, ev) => {
			return ['outofmaxbounds', ev];
		},
		trackuserlocationend: (_el, ev) => {
			return ['trackuserlocationend', ev];
		},
		trackuserlocationstart: (_el, ev) => {
			return ['trackuserlocationstart', ev];
		}
	};

	const geolocate = new mapbox.GeolocateControl(options);
	map.addControl(geolocate, position);

	onMount(() => {
		const dispatcherNode = {
			dispatchEvent(event: Event) {
				const customEvent = event as CustomEvent<unknown>;
				dispatch(customEvent.type, customEvent.detail);
				return true;
			}
		};
		return bindEvents(geolocate, handlers, mapbox, dispatcherNode);
	});

	export function trigger() {
		geolocate.trigger();
	}
</script>

<div></div>

<style>
	div {
		display: none;
	}
</style>
