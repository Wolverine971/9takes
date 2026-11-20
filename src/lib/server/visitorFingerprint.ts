// src/lib/server/visitorFingerprint.ts
//
// Server-side read of the anonymous visitor id. The browser writes the cookie
// (src/lib/analytics/visitorIdentity.ts), so the server only accepts values
// shaped like the ones that generator, and the earlier `anon-` one, produce.
import type { Cookies } from '@sveltejs/kit';

import { VISITOR_ID_COOKIE_NAME } from '$lib/analytics/visitorIdentity';

export const VISITOR_FINGERPRINT_MAX_LENGTH = 100;

// Letters, digits and hyphens: a UUID, the timestamp fallback, or a prefixed UUID.
const VISITOR_FINGERPRINT_PATTERN = /^[A-Za-z0-9-]+$/;

/** The trimmed id, or null when it is missing, too long, or not id-shaped. */
export function normalizeVisitorFingerprint(value: unknown): string | null {
	if (typeof value !== 'string') return null;
	const trimmed = value.trim();
	if (!trimmed || trimmed.length > VISITOR_FINGERPRINT_MAX_LENGTH) return null;
	return VISITOR_FINGERPRINT_PATTERN.test(trimmed) ? trimmed : null;
}

/** The visitor id from the request cookie, validated; null when absent or malformed. */
export function readVisitorFingerprint(cookies: Pick<Cookies, 'get'>): string | null {
	return normalizeVisitorFingerprint(cookies.get(VISITOR_ID_COOKIE_NAME));
}
