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
