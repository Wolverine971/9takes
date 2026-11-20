// src/lib/peopleTypes.ts
// Legacy DB `type` arrays (movieStar, techie, cluster tags…): normalize and dedupe.

function normalizeTypeKey(value: string): string {
	return value.replace(/[^a-z0-9]/gi, '').toLowerCase();
}

export function normalizePeopleTypes(value: unknown): string[] {
	let raw: string[] = [];

	if (Array.isArray(value)) {
		raw = value.map(String);
	} else if (value && typeof value === 'object') {
		raw = Object.values(value as Record<string, unknown>).map(String);
	} else if (typeof value === 'string' && value.trim().length > 0) {
		raw = value
			.split(',')
			.map((item) => item.trim())
			.filter(Boolean);
	}

	const seen = new Set<string>();

	return raw.filter((item) => {
		const normalized = normalizeTypeKey(item);
		if (!normalized || seen.has(normalized)) return false;
		seen.add(normalized);
		return true;
	});
}
