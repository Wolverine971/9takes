// src/lib/components/map/map-context.ts
import { createContext } from 'svelte';

/**
 * Shared between Map.svelte (provider) and the components rendered inside it
 * (Marker, NavigationControl, ScaleControl, GeolocateControl). The map and the
 * mapbox global are only available after the map's `ready` event, and children
 * only render after that, so the getters are safe to call during child setup.
 */
export interface MapContext {
	getMap: () => unknown;
	getMapbox: () => unknown;
}

export const [getMapContext, setMapContext] = createContext<MapContext>();
