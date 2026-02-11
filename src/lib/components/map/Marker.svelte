<!-- src/lib/components/map/Marker.svelte -->
<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import { contextKey } from '$lib/components/map/mapbox';

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

	const { getMap, getMapbox } = getContext(contextKey) as {
		getMap: () => unknown;
		getMapbox: () => MapboxLike;
	};
	const map = getMap();
	const mapbox = getMapbox();

	function randomColour() {
		return Math.round(Math.random() * 255);
	}

	function move(lng: number, lat: number) {
		marker?.setLngLat({ lng, lat });
	}

	export let lat = 0;
	export let lng = 0;
	export let label = 'Marker';
	export let popupClassName = 'beyonk-mapbox-popup';
	export let markerOffset: [number, number] = [0, 0];
	export let popupOffset = 10;
	export let color = randomColour();
	export let popup = true;
	export let popupOptions: Record<string, unknown> = {};
	export let markerOptions: Record<string, unknown> = {};
	export let popupHtml = '';
	let marker: MapboxMarker | null = null;
	let element: HTMLDivElement;
	let elementPopup: HTMLDivElement;

	$: marker && move(lng, lat);

	onMount(() => {
		const namedParams = Object.assign(
			{
				offset: markerOffset
			},
			element.hasChildNodes() ? { element } : { color }
		);
		const tempEl = Object.assign(namedParams, markerOptions);
		marker = new mapbox.Marker(tempEl);
		// tempEl.addEventListener('click', () => {
		// 	popupClicked();
		// });

		if (popup) {
			const namedPopupParams = { offset: popupOffset, className: popupClassName };
			const popupEl = new mapbox.Popup(Object.assign(namedPopupParams, popupOptions));
			if (elementPopup.hasChildNodes()) {
				popupEl.setDOMContent(elementPopup);
			} else {
				popupEl.setText(label);
			}

			if (popupHtml) {
				popupEl.setHTML(popupHtml);
			}

			marker.setPopup(popupEl);
		}

		marker.setLngLat({ lng, lat }).addTo(map);

		if (!element.hasChildNodes()) element.remove();

		return () => marker?.remove();
	});

	export function getMarker() {
		return marker;
	}
</script>

<div bind:this={element}>
	<slot />
</div>

<div class="popup" bind:this={elementPopup}>
	<slot name="popup" />
</div>
