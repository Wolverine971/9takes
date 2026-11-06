// src/lib/server/homepageLiveTypes.ts
// Which Enneagram types have answered the homepage's live question, for the locked
// question card ("No 1, 5 or 7 has answered yet"). Give-first: this reads author types
// and timestamps only, never take text, so it is safe to show before the visitor posts.
import { LIVE_TYPE_PREVIEW_ROWS, type LiveTakeTypes } from '$lib/data/homepageLiveTypes';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { logger } from '$lib/utils/logger';

// Enough recent takes to cover any homepage question without scanning the whole table.
const TAKE_SCAN_LIMIT = 400;

function toType(value: unknown): number | null {
	const type = Number(value);
	return Number.isInteger(type) && type >= 1 && type <= 9 ? type : null;
}

/** Best effort: returns null on any failure so the card simply drops the type row. */
export async function getLiveTakeTypes(questionId: number): Promise<LiveTakeTypes | null> {
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

		const types = rows.map((row) =>
			row.author_id ? (typeByAuthor.get(row.author_id) ?? null) : null
		);
		const answered = [...new Set(types.filter((type): type is number => type !== null))].sort(
			(a, b) => a - b
		);
		// Typed takes first (newest first), then untyped ones, so the locked rows show who is here.
		const recent = [
			...types.filter((type) => type !== null),
			...types.filter((type) => type === null)
		].slice(0, LIVE_TYPE_PREVIEW_ROWS);
		return {
			recent,
			answered,
			newestAt: rows[0]?.created_at ?? null
		};
	} catch (typesError) {
		logger.warn('Homepage live take: answered types unavailable', {
			questionId,
			error: String(typesError)
		});
		return null;
	}
}
