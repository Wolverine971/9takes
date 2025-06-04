<!-- lib/components/map/Marker.svelte -->
<script>
	import { onMount, getContext, createEventDispatcher } from 'svelte';
	import { contextKey } from '$lib/components/map/mapbox';

	const { getMap, getMapbox } = getContext(contextKey);
	const map = getMap();
	const mapbox = getMapbox();

	function randomColour() {
		return Math.round(Math.random() * 255);
	}

	function move(lng, lat) {
		marker.setLngLat({ lng, lat });
	}

	export let lat;
	export let lng;
	export let label = 'Marker';
	export let popupClassName = 'beyonk-mapbox-popup';
	export let markerOffset = [0, 0];
	export let popupOffset = 10;
	export let color = randomColour();
	export let popup = true;
	export let popupOptions = {};
	export let markerOptions = {};
	export let popupHtml = '';
	const dispatch = createEventDispatcher();
	let marker;
	let element;
	let elementPopup;

	$: marker && move(lng, lat);

	onMount(() => {
		const namedParams = Object.assign(
			{
				offset: markerOffset
			},
			element.hasChildNodes() ? { element } : { color }
		);
		let tempEl = Object.assign(namedParams, markerOptions);
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

		return () => marker.remove();
	});

	export function getMarker() {
		return marker;
	}
	const popupClicked = () => {
		dispatch('popupClicked');
	};
</script>

<div bind:this={element}>
	<slot />
</div>

<div class="popup" bind:this={elementPopup}>
	<slot name="popup" />
</div>
