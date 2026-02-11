// src/lib/components/map/geocoder/geocoder-action.ts
import { load } from '$lib/components/map/asset-loader';
import { bindEvents } from '$lib/components/map/event-binding';

type GeocoderLike = {
	addTo: (selector: string) => void;
	setInput: (value: string) => void;
	on: (handler: string, callback: (ev: unknown) => void) => void;
	off: (handler: string, callback: (ev: unknown) => void) => void;
	remove?: () => void;
};

type GeocoderCtor = new (options: Record<string, unknown>) => GeocoderLike;

type GeocoderOptions = {
	version?: string;
	customStylesheetUrl?: string | false;
	value?: string | null;
	[key: string]: unknown;
};

type InitResult = {
	geocoder: GeocoderLike;
	unbind: () => void;
};

export default function action(node: HTMLElement, options: GeocoderOptions = {}) {
	let geocoder: GeocoderLike | null = null;
	const version = options.version ?? 'v5.0.0';

	const resources: Array<{ type: 'script' | 'link'; value: string; id: string }> = [
		{
			type: 'script',
			value: `//api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/${version}/mapbox-gl-geocoder.min.js`,
			id: 'byk-gc-js'
		},
		{
			type: 'link',
			value: `//api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/${version}/mapbox-gl-geocoder.css`,
			id: 'byk-gc-css'
		}
	];

	const customStylesheetUrl = options.customStylesheetUrl;
	if (customStylesheetUrl) {
		resources.push({ type: 'link', value: customStylesheetUrl, id: 'byk-gcsu-css' });
	}

	let unbind = () => {};
	load(resources, () => {
		const initialized = init(options, node);
		geocoder = initialized.geocoder;
		unbind = initialized.unbind;
	});

	return {
		destroy() {
			unbind();
			geocoder?.remove?.();
		}
	};
}

function init(options: Record<string, unknown>, node: HTMLElement): InitResult {
	const Geocoder = (window as Window & { MapboxGeocoder: GeocoderCtor }).MapboxGeocoder;
	const geocoder = new Geocoder(options);
	geocoder.addTo(`#${node.id}`);
	if (options.value) {
		geocoder.setInput(String(options.value));
	}

	return {
		geocoder,
		unbind: bindEvents(geocoder, handlers, false, node)
	};
}

const handlers: Record<
	string,
	(el: GeocoderLike, ev: unknown, mapbox: unknown) => [string, unknown]
> = {
	results: (_el, ev) => {
		return ['results', ev];
	},
	result: (_el, ev) => {
		return ['result', ev];
	},
	loading: (_el, ev) => {
		return ['loading', ev];
	},
	error: (_el, ev) => {
		return ['error', ev];
	},
	clear: (_el, ev) => {
		return ['clear', ev];
	},
	load: (el) => {
		return ['ready', { geocoder: el }];
	}
};
