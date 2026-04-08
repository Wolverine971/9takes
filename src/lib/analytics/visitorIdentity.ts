// src/lib/analytics/visitorIdentity.ts
import { getCookie, setCookie } from '../../utils/cookies';

export const VISITOR_ID_COOKIE_NAME = '9tfingerprint';
const VISITOR_ID_STORAGE_KEY = '9t_visitor_id';
const LEGACY_VISITOR_ID_STORAGE_KEY = '9t_analytics_fallback_fingerprint';
const VISITOR_ID_COOKIE_TTL_DAYS = 365;

function canUseDomStorage(): boolean {
	return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function createVisitorId(): string {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return crypto.randomUUID();
	}

	return `${Date.now()}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`;
}

function persistVisitorId(visitorId: string): void {
	setCookie(VISITOR_ID_COOKIE_NAME, visitorId, VISITOR_ID_COOKIE_TTL_DAYS);

	if (!canUseDomStorage()) return;

	try {
		localStorage.setItem(VISITOR_ID_STORAGE_KEY, visitorId);
		localStorage.removeItem(LEGACY_VISITOR_ID_STORAGE_KEY);
	} catch {
		// Ignore storage errors and keep the cookie as the primary source of truth.
	}
}

export function getExistingVisitorId(): string | null {
	const cookieValue = getCookie(VISITOR_ID_COOKIE_NAME);
	if (cookieValue) {
		return cookieValue;
	}

	if (!canUseDomStorage()) return null;

	try {
		const storedValue =
			localStorage.getItem(VISITOR_ID_STORAGE_KEY) ||
			localStorage.getItem(LEGACY_VISITOR_ID_STORAGE_KEY);

		if (!storedValue) {
			return null;
		}

		persistVisitorId(storedValue);
		return storedValue;
	} catch {
		return null;
	}
}

export function getOrCreateVisitorId(): string {
	const existingVisitorId = getExistingVisitorId();
	if (existingVisitorId) {
		return existingVisitorId;
	}

	const visitorId = createVisitorId();
	persistVisitorId(visitorId);
	return visitorId;
}
