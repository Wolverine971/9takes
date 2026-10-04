// src/lib/admin/talkNotesViewed.ts
// Client side of "seen" for Talk to DJ notes: record the view, then refresh the
// admin layout so the nav badge drops without a reload.
import { invalidate } from '$app/navigation';

/** Must match depends() in src/routes/admin/+layout.server.ts. */
export const TALK_NOTES_BADGE_DEPENDENCY = 'admin:talk-notes';

export async function markTalkNotesViewed(ids: string[]): Promise<boolean> {
	if (ids.length === 0) return true;
	try {
		const response = await fetch('/api/admin/talk-notes/viewed', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ ids })
		});
		if (!response.ok) return false;
		await invalidate(TALK_NOTES_BADGE_DEPENDENCY);
		return true;
	} catch {
		return false;
	}
}
