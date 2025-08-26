// src/lib/components/map/components.ts
'use strict';

import Map from '$lib/components/map/Map.svelte';
import Marker from '$lib/components/map/Marker.svelte';
import Geocoder from '$lib/components/map/geocoder/Geocoder.svelte';
import { contextKey } from '$lib/components/map/mapbox';
import GeolocateControl from '$lib/components/map/controls/GeolocateControl.svelte';
import NavigationControl from '$lib/components/map/controls/NavigationControl.svelte';
import ScaleControl from '$lib/components/map/controls/ScaleControl.svelte';

const controls = {
	GeolocateControl,
	NavigationControl,
	ScaleControl
};

export { Map, Marker, Geocoder, contextKey, controls };
