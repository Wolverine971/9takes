// src/lib/server/adminAnalytics.ts
type ContributorRecord = {
	author_id?: string | null;
	fingerprint?: string | null;
	ip?: string | null;
};

function normalizeValue(value: string | null | undefined): string | null {
	const trimmed = value?.trim();
	return trimmed ? trimmed : null;
}

export function getContributorKey(record: ContributorRecord): string | null {
	const authorId = normalizeValue(record.author_id);
	if (authorId) {
		return `user:${authorId}`;
	}

	const fingerprint = normalizeValue(record.fingerprint);
	if (fingerprint) {
		return `fingerprint:${fingerprint}`;
	}

	const ip = normalizeValue(record.ip);
	if (ip) {
		return `ip:${ip}`;
	}

	return null;
}

export function countUniqueContributors(records: ContributorRecord[]): number {
	const uniqueKeys = new Set<string>();

	for (const record of records) {
		const key = getContributorKey(record);
		if (key) {
			uniqueKeys.add(key);
		}
	}

	return uniqueKeys.size;
}
