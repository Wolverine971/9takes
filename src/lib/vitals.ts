// lib/vitals.ts
import { getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals';

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals';

function getConnectionSpeed() {
	return 'connection' in navigator &&
		navigator['connection'] &&
		'effectiveType' in navigator['connection']
		? // @ts-ignore
			navigator['connection']['effectiveType']
		: '';
}

/**
 * @param {import("web-vitals").Metric} metric
 * @param {{ params: { [s: string]: any; } | ArrayLike<any>; path: string; analyticsId: string; debug: boolean; }} options
 */
function sendToAnalytics(
	metric: { id: any; name: any; value: { toString: () => any } },
	options: {
		params: { [s: string]: unknown } | ArrayLike<unknown>;
		path: any;
		analyticsId: any;
		debug: any;
	}
) {
	const page = Object.entries(options.params).reduce(
		(acc, [key, value]) => acc.replace(value, `[${key}]`),
		options.path
	);

	const body = {
		dsn: options.analyticsId,
		id: metric.id,
		page,
		href: location.href,
		event_name: metric.name,
		value: metric.value.toString(),
		speed: getConnectionSpeed()
	};

	if (options.debug) {
		// Debug analytics
	}

	const blob = new Blob([new URLSearchParams(body).toString()], {
		// This content type is necessary for `sendBeacon`
		type: 'application/x-www-form-urlencoded'
	});
	if (navigator.sendBeacon) {
		navigator.sendBeacon(vitalsUrl, blob);
	} else
		fetch(vitalsUrl, {
			body: blob,
			method: 'POST',
			credentials: 'omit',
			keepalive: true
		});
}

/**
 * @param {any} options
 */
export function webVitals(options: any) {
	try {
		getFID((metric: any) => sendToAnalytics(metric, options));
		getTTFB((metric: any) => sendToAnalytics(metric, options));
		getLCP((metric: any) => sendToAnalytics(metric, options));
		getCLS((metric: any) => sendToAnalytics(metric, options));
		getFCP((metric: any) => sendToAnalytics(metric, options));
	} catch (err) {
		// Analytics error
	}
}
