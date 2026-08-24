// src/routes/api/nine/type/+server.ts
import { json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { logger } from '$lib/utils/logger';

const requestSchema = z.object({
	enneagramType: z.number().int().min(1).max(9),
	questionUrl: z
		.string()
		.min(1)
		.max(160)
		.regex(/^[a-z0-9-]+$/i),
	fingerprint: z.string().trim().min(1).max(100).optional()
});

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
	const parsed = requestSchema.safeParse(await request.json().catch(() => null));
	if (!parsed.success) {
		return json({ error: 'invalid_request' }, { status: 400 });
	}

	const { enneagramType, questionUrl } = parsed.data;
	const rawFingerprint = cookies.get('9tfingerprint') ?? parsed.data.fingerprint ?? null;
	const fingerprint =
		rawFingerprint && rawFingerprint.trim().length <= 100 ? rawFingerprint.trim() : null;
	const userId = locals.user?.id ?? locals.session?.user?.id ?? null;

	if (!fingerprint && !userId) {
		return json({ error: 'missing_identity' }, { status: 400 });
	}

	const admin = getSupabaseAdminClient() as any;
	let savedToTake = false;
	let savedToProfile = false;
	let takeError: unknown = null;
	let profileError: unknown = null;

	try {
		let takeQuery = admin
			.from('nine_user_takes')
			.update({ self_reported_type: enneagramType })
			.eq('subject_type', 'question')
			.eq('subject_slug', questionUrl);

		takeQuery = fingerprint
			? takeQuery.eq('fingerprint', fingerprint)
			: takeQuery.eq('user_id', userId);

		const { data, error } = await takeQuery.select('id');
		if (error) throw error;
		savedToTake = Array.isArray(data) && data.length > 0;
	} catch (error) {
		takeError = error;
		logger.warn('Failed to persist self-reported type to Chorus take', {
			questionUrl,
			userId: userId ?? undefined,
			error
		});
	}

	if (userId) {
		try {
			const { data, error } = await admin
				.from('profiles')
				.update({ enneagram: String(enneagramType) })
				.eq('id', userId)
				.select('id');
			if (error) throw error;
			savedToProfile = Array.isArray(data) && data.length > 0;
		} catch (error) {
			profileError = error;
			logger.warn('Failed to persist reveal type to profile', { userId, error });
		}
	}

	if (!savedToTake && !savedToProfile && (takeError || profileError)) {
		return json({ error: 'persistence_unavailable' }, { status: 503 });
	}

	return json({ ok: true, savedToTake, savedToProfile });
};
