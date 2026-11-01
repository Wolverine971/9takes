<!-- src/lib/components/map/Marker.svelte -->
<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { getMapContext } from '$lib/components/map/map-context';

	type MapboxMarker = {
		setPopup: (popup: unknown) => MapboxMarker;
		setLngLat: (coords: { lng: number; lat: number }) => MapboxMarker;
		addTo: (map: unknown) => MapboxMarker;
		remove: () => void;
	};
	type MapboxLike = {
		Marker: new (options?: Record<string, unknown>) => MapboxMarker;
		Popup: new (options?: Record<string, unknown>) => {
			setDOMContent: (node: HTMLElement) => void;
			setText: (value: string) => void;
			setHTML: (value: string) => void;
		};
	};

	interface Props {
		lat?: number;
		lng?: number;
		label?: string;
		popupClassName?: string;
		markerOffset?: [number, number];
		popupOffset?: number;
		color?: number;
		popup?: boolean;
		popupOptions?: Record<string, unknown>;
		markerOptions?: Record<string, unknown>;
		popupHtml?: string;
		/** Custom marker element content (replaces the default coloured pin). */
		children?: Snippet;
		/** Custom popup content (replaces the plain-text `label`). */
		popupContent?: Snippet;
	}

	const { getMap, getMapbox } = getMapContext();
	const map = getMap();
	const mapbox = getMapbox() as MapboxLike;

	function randomColour() {
		return Math.round(Math.random() * 255);
	}

	function move(lng: number, lat: number) {
		marker?.setLngLat({ lng, lat });
	}

	let {
		lat = 0,
		lng = 0,
		label = 'Marker',
		popupClassName = 'beyonk-mapbox-popup',
		markerOffset = [0, 0],
		popupOffset = 10,
		color = randomColour(),
		popup = true,
		popupOptions = {},
		markerOptions = {},
		popupHtml = '',
		children,
		popupContent
	}: Props = $props();

	let marker = $state.raw<MapboxMarker | null>(null);
	let element: HTMLDivElement | undefined = $state();
	let elementPopup: HTMLDivElement | undefined = $state();

	// Keep the mapbox marker in sync with lat/lng after it has been created.
	$effect(() => {
		if (marker) move(lng, lat);
	});

	onMount(() => {
		// The marker and popup are created once; later option changes are not applied (same as before).
		const namedParams = Object.assign(
			{
				offset: markerOffset
			},
			children && element ? { element } : { color }
		);
		const tempEl = Object.assign(namedParams, markerOptions);
		const created = new mapbox.Marker(tempEl);

		if (popup) {
			const namedPopupParams = { offset: popupOffset, className: popupClassName };
			const popupEl = new mapbox.Popup(Object.assign(namedPopupParams, popupOptions));
			if (popupContent && elementPopup) {
				popupEl.setDOMContent(elementPopup);
			} else {
				popupEl.setText(label);
			}

			if (popupHtml) {
				popupEl.setHTML(popupHtml);
			}

			created.setPopup(popupEl);
		}

		created.setLngLat({ lng, lat }).addTo(map);
		marker = created;

		return () => created.remove();
	});

	export function getMarker() {
		return marker;
	}
</script>

{#if children}
	<div bind:this={element}>
		{@render children()}
	</div>
{/if}

<div class="popup" bind:this={elementPopup}>
	{@render popupContent?.()}
</div>
