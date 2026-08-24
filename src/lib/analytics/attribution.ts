// src/lib/analytics/attribution.ts
export interface PageViewAttributionPayload {
	landing_query: string | null;
	utm_source: string | null;
	utm_medium: string | null;
	utm_campaign: string | null;
	utm_term: string | null;
	utm_content: string | null;
	click_id_type: string | null;
	click_id_value: string | null;
}

const MAX_LANDING_QUERY_LENGTH = 2000;
const MAX_ATTRIBUTION_VALUE_LENGTH = 255;
const CLICK_ID_KEYS = ['gclid', 'msclkid', 'fbclid', 'ttclid'] as const;

function canonicalHostname(hostname: string): string {
	return hostname
		.trim()
		.toLowerCase()
		.replace(/\.$/, '')
		.replace(/^www\./, '');
}

export function sanitizeExternalReferrerHost(
	candidate: string | null | undefined,
	currentHost: string
): string | null {
	const trimmed = candidate?.trim();
	if (!trimmed) return null;

	try {
		const referrer = new URL(trimmed.includes('://') ? trimmed : `https://${trimmed}`);
		const current = new URL(currentHost.includes('://') ? currentHost : `https://${currentHost}`);
		if (canonicalHostname(referrer.hostname) === canonicalHostname(current.hostname)) {
			return null;
		}

		return referrer.host.toLowerCase().slice(0, MAX_ATTRIBUTION_VALUE_LENGTH);
	} catch {
		return null;
	}
}

export function extractExternalReferrerHost(
	referrerUrl: string | null | undefined,
	currentHost: string
): string | null {
	if (!referrerUrl?.trim()) return null;

	try {
		return sanitizeExternalReferrerHost(new URL(referrerUrl).host, currentHost);
	} catch {
		return null;
	}
}

function sanitizeAttributionValue(value: string | null | undefined): string | null {
	const trimmed = value?.trim();
	if (!trimmed) {
		return null;
	}

	return trimmed.slice(0, MAX_ATTRIBUTION_VALUE_LENGTH);
}

export function extractPageViewAttribution(url: URL): PageViewAttributionPayload {
	const landingQuery = url.search ? url.search.slice(1, MAX_LANDING_QUERY_LENGTH + 1) : '';
	const searchParams = url.searchParams;

	const clickIdKey =
		CLICK_ID_KEYS.find((candidate) => {
			return Boolean(sanitizeAttributionValue(searchParams.get(candidate)));
		}) ?? null;

	return {
		landing_query: landingQuery ? landingQuery : null,
		utm_source: sanitizeAttributionValue(searchParams.get('utm_source')),
		utm_medium: sanitizeAttributionValue(searchParams.get('utm_medium')),
		utm_campaign: sanitizeAttributionValue(searchParams.get('utm_campaign')),
		utm_term: sanitizeAttributionValue(searchParams.get('utm_term')),
		utm_content: sanitizeAttributionValue(searchParams.get('utm_content')),
		click_id_type: clickIdKey,
		click_id_value: clickIdKey ? sanitizeAttributionValue(searchParams.get(clickIdKey)) : null
	};
}
