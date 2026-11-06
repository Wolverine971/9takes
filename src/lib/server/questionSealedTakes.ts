// src/lib/server/questionSealedTakes.ts
// Who has answered a question, for the locked question page's sealed takes. Give-first:
// reads author types and timestamps only, never take text, ip or fingerprint, so it is
// safe to send before the visitor answers.
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { logger } from '$lib/utils/logger';
import { SEALED_ROWS, type SealedTakes } from '$lib/components/questions/sealedTakes';

// Enough recent takes to cover nearly every question without scanning the whole table.
const TAKE_SCAN_LIMIT = 400;

function toType(value: unknown): number | null {
	const type = Number(value);
	return Number.isInteger(type) && type >= 1 && type <= 9 ? type : null;
}

/** Best effort: null on any failure, and the page falls back to the take count alone. */
export async function getSealedTakes(questionId: number): Promise<SealedTakes | null> {
	try {
		const db = getSupabaseAdminClient();
		const { data: takes, error } = await db
			.from('comments')
			.select('author_id, created_at')
			.eq('parent_type', 'question')
			.eq('parent_id', questionId)
			.not('removed', 'is', true)
			.order('created_at', { ascending: false })
			.limit(TAKE_SCAN_LIMIT);
		if (error) throw error;
		const rows = takes ?? [];

		const authorIds = [...new Set(rows.map((row) => row.author_id).filter(Boolean))] as string[];
		const typeByAuthor = new Map<string, number | null>();
		if (authorIds.length > 0) {
			const { data: profiles, error: profileError } = await db
				.from('profiles')
				.select('id, enneagram')
				.in('id', authorIds);
			if (profileError) throw profileError;
			for (const profile of profiles ?? []) typeByAuthor.set(profile.id, toType(profile.enneagram));
		}

		const typed = rows.map((row) => ({
			type: row.author_id ? (typeByAuthor.get(row.author_id) ?? null) : null,
			at: String(row.created_at)
		}));
		const answered = [
			...new Set(typed.map((take) => take.type).filter((type): type is number => type !== null))
		].sort((a, b) => a - b);

		return {
			// Typed takes first (each group newest first), so the rows show who is here,
			// matching the lit types in the strip above them.
			rows: [
				...typed.filter((take) => take.type !== null),
				...typed.filter((take) => take.type === null)
			].slice(0, SEALED_ROWS),
			answered,
			newestAt: typed[0]?.at ?? null,
			now: new Date().toISOString()
		};
	} catch (sealedError) {
		logger.warn('Question page: sealed takes unavailable', {
			questionId,
			error: String(sealedError)
		});
		return null;
	}
}
