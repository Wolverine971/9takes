// src/lib/server/welcomeSequenceReturns.ts
export type AnalyticsSessionRow = {
	id: string;
	user_id: string | null;
	fingerprint: string | null;
	last_seen_at: string;
};

export type ReturnVisitData = {
	last_visit: string;
	session_count: number;
};

type InternalReturnVisitData = ReturnVisitData & {
	sessionIds: Set<string>;
};

function recordReturnSession(
	returnVisits: Map<string, InternalReturnVisitData>,
	userId: string | null,
	session: AnalyticsSessionRow
) {
	if (!userId) return;

	const existing = returnVisits.get(userId);
	if (existing?.sessionIds.has(session.id)) {
		return;
	}

	const lastVisit =
		existing && Date.parse(existing.last_visit) > Date.parse(session.last_seen_at)
			? existing.last_visit
			: session.last_seen_at;

	returnVisits.set(userId, {
		last_visit: lastVisit,
		session_count: (existing?.session_count ?? 0) + 1,
		sessionIds: existing ? new Set([...existing.sessionIds, session.id]) : new Set([session.id])
	});
}

export function buildReturnVisitsByUser(
	directSessions: AnalyticsSessionRow[],
	fingerprintSessions: AnalyticsSessionRow[]
): Record<string, ReturnVisitData> {
	const returnVisits = new Map<string, InternalReturnVisitData>();
	const userIdsByFingerprint = new Map<string, Set<string>>();

	for (const session of directSessions) {
		recordReturnSession(returnVisits, session.user_id, session);

		if (session.user_id && session.fingerprint) {
			const existingOwners = userIdsByFingerprint.get(session.fingerprint) ?? new Set<string>();
			existingOwners.add(session.user_id);
			userIdsByFingerprint.set(session.fingerprint, existingOwners);
		}
	}

	const uniqueFingerprintOwners = new Map<string, string>();
	for (const [fingerprint, userIds] of userIdsByFingerprint.entries()) {
		if (userIds.size === 1) {
			uniqueFingerprintOwners.set(fingerprint, [...userIds][0]);
		}
	}

	for (const session of fingerprintSessions) {
		if (!session.fingerprint) continue;

		const ownerUserId = uniqueFingerprintOwners.get(session.fingerprint);
		recordReturnSession(returnVisits, ownerUserId ?? null, session);
	}

	return Object.fromEntries(
		[...returnVisits.entries()].map(([userId, data]) => [
			userId,
			{
				last_visit: data.last_visit,
				session_count: data.session_count
			}
		])
	);
}
