// src/lib/components/map/map-action.ts
import { load } from '$lib/components/map/asset-loader';
import { bindEvents } from '$lib/components/map/event-binding';

type MapLike = {
	getCenter: () => unknown;
	getZoom: () => number;
	on: (handler: string, callback: (ev: unknown) => void) => void;
	off: (handler: string, callback: (ev: unknown) => void) => void;
	remove?: () => void;
};

type MapboxLike = {
	accessToken: string;
	Map: new (options: Record<string, unknown>) => MapLike;
};

type MapActionOptions = {
	version?: string;
	customStylesheetUrl?: string | false;
	accessToken?: string;
	[key: string]: unknown;
};

type InitResult = {
	map: MapLike;
	unbind: () => void;
};

export default function action(node: HTMLElement, options: MapActionOptions = {}) {
	let map: MapLike | null = null;
	const version = options.version ?? 'v2.12.0';

	const resources: Array<{ type: 'script' | 'link'; value: string; id: string }> = [
		{
			type: 'script',
			value: `//api.mapbox.com/mapbox-gl-js/${version}/mapbox-gl.js`,
			id: 'byk-gl-js'
		},
		{
			type: 'link',
			value: `//api.mapbox.com/mapbox-gl-js/${version}/mapbox-gl.css`,
			id: 'byk-gl-css'
		}
	];

	const customStylesheetUrl = options.customStylesheetUrl;
	if (customStylesheetUrl) {
		resources.push({ type: 'link', value: customStylesheetUrl, id: 'byk-mcsu-css' });
	}

	let unbind = () => {};
	load(resources, () => {
		const initialized = init({ ...options, container: node }, node);
		map = initialized.map;
		unbind = initialized.unbind;
	});

	return {
		destroy() {
			unbind();
			map?.remove?.();
		}
	};
}

function init(options: Record<string, unknown>, node: HTMLElement): InitResult {
	const mapbox = (window as Window & { mapboxgl: MapboxLike }).mapboxgl;
	mapbox.accessToken = String(options.accessToken ?? '');
	const el = new mapbox.Map(options) as MapLike;

	return {
		map: el,
		unbind: bindEvents(el, handlers, mapbox, node)
	};
}

const handlers: Record<string, (el: MapLike, ev: unknown, mapbox: unknown) => [string, unknown]> = {
	dragend: (el) => {
		return ['dragend', { center: el.getCenter() }];
	},
	drag: (el) => {
		return ['drag', { center: el.getCenter() }];
	},
	moveend: (el) => {
		return ['recentre', { center: el.getCenter() }];
	},
	click: (_el, ev) => {
		const { lngLat } = (ev as { lngLat?: { lng: number; lat: number } }) ?? {};
		if (!lngLat) {
			return ['click', { lng: 0, lat: 0 }];
		}
		return ['click', { lng: lngLat.lng, lat: lngLat.lat }];
	},
	zoomstart: (el) => {
		return ['zoomstart', { zoom: el.getZoom() }];
	},
	zoom: (el) => {
		return ['zoom', { zoom: el.getZoom() }];
	},
	zoomend: (el) => {
		return ['zoomend', { zoom: el.getZoom() }];
	},
	load: (el, _ev, mapbox) => {
		return ['ready', { map: el, mapbox }];
	}
};
