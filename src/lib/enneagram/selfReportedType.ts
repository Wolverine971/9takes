// src/lib/enneagram/selfReportedType.ts
export const SELF_REPORTED_TYPE_STORAGE_KEY = '9t_self_reported_enneagram';

export type EnneagramType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export function parseEnneagramType(value: unknown): EnneagramType | null {
	const type = typeof value === 'number' ? value : Number(value);
	return Number.isInteger(type) && type >= 1 && type <= 9 ? (type as EnneagramType) : null;
}

export function readStoredEnneagramType(
	storage: Pick<Storage, 'getItem'> | null = typeof window === 'undefined'
		? null
		: window.localStorage
): EnneagramType | null {
	if (!storage) return null;

	try {
		return parseEnneagramType(storage.getItem(SELF_REPORTED_TYPE_STORAGE_KEY));
	} catch {
		return null;
	}
}

export function storeEnneagramType(
	type: EnneagramType,
	storage: Pick<Storage, 'setItem'> | null = typeof window === 'undefined'
		? null
		: window.localStorage
): boolean {
	if (!storage) return false;

	try {
		storage.setItem(SELF_REPORTED_TYPE_STORAGE_KEY, String(type));
		return true;
	} catch {
		return false;
	}
}

export function clearStoredEnneagramType(
	storage: Pick<Storage, 'removeItem'> | null = typeof window === 'undefined'
		? null
		: window.localStorage
): void {
	try {
		storage?.removeItem(SELF_REPORTED_TYPE_STORAGE_KEY);
	} catch {
		// A successful registration should not be turned into an error by storage.
	}
}
