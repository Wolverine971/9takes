<!-- src/lib/components/map/Map.svelte -->
<script lang="ts">
	import { onDestroy, untrack, type Snippet } from 'svelte';
	import { on } from 'svelte/events';
	import type { Attachment } from 'svelte/attachments';
	import { setMapContext } from '$lib/components/map/map-context';
	import action from '$lib/components/map/map-action';
	import { EventQueue } from '$lib/components/map/queue';

	type MapReadyDetail = { map: unknown; mapbox: unknown };
	type MapInstance = Record<string, (...args: unknown[]) => unknown>;
	type CenterDetail = { center: unknown };
	type ZoomDetail = { zoom: number };
	type ClickDetail = { lng: number; lat: number };

	interface Props {
		map?: MapInstance | null;
		version?: string;
		center?: [number, number];
		zoom?: number;
		zoomRate?: number;
		wheelZoomRate?: number;
		options?: Record<string, unknown>;
		accessToken?: string;
		customStylesheetUrl?: string | false;
		style?: string;
		children?: Snippet;
		onready?: () => void;
		onrecentre?: (detail: CenterDetail) => void;
		ondragend?: (detail: CenterDetail) => void;
		ondrag?: (detail: CenterDetail) => void;
		onclick?: (detail: ClickDetail) => void;
		onzoomstart?: (detail: ZoomDetail) => void;
		onzoom?: (detail: ZoomDetail) => void;
		onzoomend?: (detail: ZoomDetail) => void;
		onkeydown?: (event: KeyboardEvent) => void;
	}

	let {
		map = null,
		version = 'v2.12.0',
		// 40.911552736237624, -73.9934208
		center = [40.911552736237624, -73.9934208],
		zoom = $bindable(9),
		zoomRate = 1,
		wheelZoomRate = 1,
		options = {},
		accessToken = '',
		customStylesheetUrl = false,
		style = 'mapbox://styles/mapbox/dark-v10',
		children,
		onready,
		onrecentre,
		ondragend,
		ondrag,
		onclick,
		onzoomstart,
		onzoom,
		onzoomend,
		onkeydown
	}: Props = $props();

	let mapbox: unknown = null;

	setMapContext({
		getMap: () => map,
		getMapbox: () => mapbox
	});

	// The mapbox map is created once from the initial props (map-action has no update path),
	// so this is a deliberate one-time snapshot; later prop changes go through the queue below.
	// map-action supplies `container` (the bound node) itself.
	const optionsWithDefaults = untrack(() =>
		Object.assign(
			{
				accessToken,
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
		)
	);

	const queue = new EventQueue();

	function init(detail: MapReadyDetail) {
		const readyMap = detail.map as MapInstance;
		map = readyMap;
		mapbox = detail.mapbox;
		queue.start(readyMap);
		onready?.();
	}

	// map-action dispatches CustomEvents on the container node; forward their details to the callback props.
	const mapAction: Attachment<HTMLDivElement> = (node) => {
		const target: EventTarget = node;
		const detailOf = <T,>(event: Event) => (event as CustomEvent<T>).detail;
		const offs = [
			on(target, 'ready', (event) => init(detailOf<MapReadyDetail>(event))),
			on(target, 'recentre', (event) => onrecentre?.(detailOf<CenterDetail>(event))),
			on(target, 'dragend', (event) => ondragend?.(detailOf<CenterDetail>(event))),
			on(target, 'drag', (event) => ondrag?.(detailOf<CenterDetail>(event))),
			on(target, 'click', (event) => {
				if (event instanceof CustomEvent) onclick?.(detailOf<ClickDetail>(event));
			}),
			on(target, 'zoomstart', (event) => onzoomstart?.(detailOf<ZoomDetail>(event))),
			on(target, 'zoom', (event) => onzoom?.(detailOf<ZoomDetail>(event))),
			on(target, 'zoomend', (event) => onzoomend?.(detailOf<ZoomDetail>(event)))
		];
		const handle = action(node, optionsWithDefaults);

		return () => {
			handle.destroy();
			for (const off of offs) off();
		};
	};

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

	// Push zoom changes from the parent to the mapbox instance (queued until the map is ready).
	$effect(() => {
		if (zoom) setZoom(zoom);
	});
</script>

<div {@attach mapAction} {onkeydown} role="button" tabindex="0">
	{#if map}
		{@render children?.()}
	{/if}
</div>

<style>
	div {
		width: 100%;
		height: 100%;
	}
</style>
