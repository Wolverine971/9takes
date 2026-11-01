<!-- src/lib/components/map/controls/GeolocateControl.svelte -->
<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { getMapContext } from '$lib/components/map/map-context';
	import { bindEvents } from '$lib/components/map/event-binding';

	type GeolocateLike = {
		trigger: () => void;
		on: (handler: string, callback: (ev: unknown) => void) => void;
		off: (handler: string, callback: (ev: unknown) => void) => void;
	};

	type MapboxLike = {
		GeolocateControl: new (options: Record<string, unknown>) => GeolocateLike;
	};

	type GeolocateCallback = (detail: unknown) => void;

	interface Props {
		position?: string;
		options?: Record<string, unknown>;
		onerror?: GeolocateCallback;
		ongeolocate?: GeolocateCallback;
		onoutofmaxbounds?: GeolocateCallback;
		ontrackuserlocationend?: GeolocateCallback;
		ontrackuserlocationstart?: GeolocateCallback;
	}

	let {
		position = 'top-left',
		options = {},
		onerror,
		ongeolocate,
		onoutofmaxbounds,
		ontrackuserlocationend,
		ontrackuserlocationstart
	}: Props = $props();

	const { getMap, getMapbox } = getMapContext();
	const map = getMap() as { addControl: (control: unknown, position: string) => void };
	const mapbox = getMapbox() as MapboxLike;

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

	// The control is created once when the component is created, so the props are read once on purpose.
	const geolocate = untrack(() => {
		const control = new mapbox.GeolocateControl(options);
		map.addControl(control, position);
		return control;
	});

	function forward(type: string, detail: unknown) {
		const callbacks: Record<string, GeolocateCallback | undefined> = {
			error: onerror,
			geolocate: ongeolocate,
			outofmaxbounds: onoutofmaxbounds,
			trackuserlocationend: ontrackuserlocationend,
			trackuserlocationstart: ontrackuserlocationstart
		};
		callbacks[type]?.(detail);
	}

	onMount(() => {
		const callbackNode = {
			dispatchEvent(event: Event) {
				forward(event.type, (event as CustomEvent<unknown>).detail);
				return true;
			}
		};
		return bindEvents(geolocate, handlers, mapbox, callbackNode);
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
