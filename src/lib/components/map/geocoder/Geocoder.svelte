<!-- src/lib/components/map/geocoder/Geocoder.svelte -->
<script lang="ts">
	import { untrack } from 'svelte';
	import { on } from 'svelte/events';
	import type { Attachment } from 'svelte/attachments';
	import action from '$lib/components/map/geocoder/geocoder-action';

	type GeocoderReadyDetail = { geocoder: unknown };
	type GeocoderCallback = (detail: unknown) => void;

	interface Props {
		accessToken?: string;
		options?: Record<string, unknown>;
		version?: string;
		types?: string[];
		placeholder?: string;
		value?: string | null;
		customStylesheetUrl?: string | false;
		geocoder?: unknown;
		onready?: () => void;
		onresults?: GeocoderCallback;
		onresult?: GeocoderCallback;
		onloading?: GeocoderCallback;
		onerror?: GeocoderCallback;
		onclear?: GeocoderCallback;
		onload?: GeocoderCallback;
	}

	let {
		accessToken = '',
		options = {},
		version = 'v4.5.1',
		types = [
			'country',
			'region',
			'postcode',
			'district',
			'place',
			'locality',
			'neighborhood',
			'address'
		],
		placeholder = 'Search',
		value = null,
		customStylesheetUrl = false,
		geocoder = $bindable(null),
		onready,
		onresults,
		onresult,
		onloading,
		onerror,
		onclear,
		onload
	}: Props = $props();

	const fieldId = 'bsm-' + Math.random().toString(36).substring(6);

	// The geocoder widget is created once from the initial props (geocoder-action has no update path),
	// so this is a deliberate one-time snapshot.
	const optionsWithDefaults = untrack(() =>
		Object.assign(
			{
				version,
				accessToken,
				types: types.join(','),
				placeholder,
				customStylesheetUrl,
				value
			},
			options
		)
	);

	function init(detail: GeocoderReadyDetail) {
		geocoder = detail.geocoder;
		onready?.();
	}

	export function getGeocoder() {
		return geocoder;
	}

	// geocoder-action dispatches CustomEvents on the container node; forward their details to the callback props.
	const geocoderAction: Attachment<HTMLDivElement> = (node) => {
		const target: EventTarget = node;
		const detailOf = (event: Event) => (event as CustomEvent<unknown>).detail;
		const offs = [
			on(target, 'ready', (event) => init(detailOf(event) as GeocoderReadyDetail)),
			on(target, 'results', (event) => onresults?.(detailOf(event))),
			on(target, 'result', (event) => onresult?.(detailOf(event))),
			on(target, 'loading', (event) => onloading?.(detailOf(event))),
			on(target, 'error', (event) => onerror?.(detailOf(event))),
			on(target, 'clear', (event) => onclear?.(detailOf(event))),
			on(target, 'load', (event) => onload?.(detailOf(event)))
		];
		const handle = action(node, optionsWithDefaults);

		return () => {
			handle.destroy();
			for (const off of offs) off();
		};
	};
</script>

<div id={fieldId} {@attach geocoderAction}></div>

<style>
	div {
		padding: 0;
	}
</style>
