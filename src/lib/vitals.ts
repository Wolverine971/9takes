// src/lib/vitals.ts
import { getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals';
import type { Metric } from 'web-vitals';

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals';

interface AnalyticsOptions {
	params: Record<string, string>;
	path: string;
	analyticsId: string;
	debug: boolean;
}

interface NavigatorWithConnection extends Navigator {
	connection?: {
		effectiveType?: string;
	};
}

function getConnectionSpeed(): string {
	const connection = (navigator as NavigatorWithConnection).connection;
	return connection?.effectiveType ?? '';
}

function sendToAnalytics(metric: Metric, options: AnalyticsOptions) {
	const page = Object.entries(options.params).reduce(
		(acc, [key, value]) => acc.replace(value, `[${key}]`),
		options.path
	);

	const body: Record<string, string> = {
		dsn: String(options.analyticsId),
		id: String(metric.id),
		page,
		href: location.href,
		event_name: String(metric.name),
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
	} else {
		fetch(vitalsUrl, {
			body: blob,
			method: 'POST',
			credentials: 'omit',
			keepalive: true
		});
	}
}

export function webVitals(options: AnalyticsOptions) {
	try {
		getFID((metric) => sendToAnalytics(metric, options));
		getTTFB((metric) => sendToAnalytics(metric, options));
		getLCP((metric) => sendToAnalytics(metric, options));
		getCLS((metric) => sendToAnalytics(metric, options));
		getFCP((metric) => sendToAnalytics(metric, options));
	} catch (err) {
		// Analytics error
	}
}
