import { json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { consumeApiRateLimit } from '$lib/server/apiRateLimit';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';

const payloadSchema = z
	.object({
		questionId: z.number().int().positive().safe(),
		commentIds: z.array(z.number().int().positive().safe()).min(1).max(40)
	})
	.strict();

export const POST: RequestHandler = async ({ request, locals, cookies, url }) => {
	const origin = request.headers.get('origin');
	if (origin && origin !== url.origin) return json({ error: 'Invalid origin' }, { status: 403 });
	if (Number(request.headers.get('content-length')) > 4096)
		return json({ error: 'Payload too large' }, { status: 413 });
	const body = await request.text();
	if (body.length > 4096) return json({ error: 'Payload too large' }, { status: 413 });
	let parsed;
	try {
		parsed = payloadSchema.safeParse(JSON.parse(body));
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}
	if (!parsed.success) return json({ error: 'Invalid view batch' }, { status: 400 });

	const viewerId = locals.session?.user?.id ?? null;
	const fingerprint = cookies.get('9tfingerprint')?.trim() || null;
	if (!viewerId && !fingerprint) return json({ error: 'Viewer required' }, { status: 401 });
	const decision = await consumeApiRateLimit({
		bucket: 'comment_views',
		subject: viewerId ? `user:${viewerId}` : `visitor:${fingerprint}`
	});
	if (!decision.allowed)
		return json(
			{ error: 'Rate limited' },
			{
				status: decision.degraded ? 503 : 429,
				headers: { 'Retry-After': String(decision.retryAfterSeconds) }
			}
		);

	const { error } = await (getSupabaseAdminClient().rpc as any)('increment_comment_views', {
		p_question_id: parsed.data.questionId,
		p_comment_ids: [...new Set(parsed.data.commentIds)],
		p_viewer_id: viewerId,
		p_fingerprint: fingerprint
	});
	if (error) {
		console.warn('Comment view increment unavailable');
		return json({ error: 'Views unavailable' }, { status: 503 });
	}
	return new Response(null, { status: 204 });
};
