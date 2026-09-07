import { beforeEach, describe, expect, it, vi } from 'vitest';
const { rpc, limit } = vi.hoisted(() => ({ rpc: vi.fn(), limit: vi.fn() }));
vi.mock('$lib/server/supabaseAdmin', () => ({ getSupabaseAdminClient: () => ({ rpc }) }));
vi.mock('$lib/server/apiRateLimit', () => ({ consumeApiRateLimit: limit }));
import { POST } from './+server';
function event(
	body: unknown = { questionId: 118, commentIds: [1, 2, 1] },
	options: { user?: string; fp?: string | null; origin?: string } = {}
) {
	return {
		request: new Request('http://localhost/api/comments/views', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Origin: options.origin ?? 'http://localhost' },
			body: JSON.stringify(body)
		}),
		url: new URL('http://localhost/api/comments/views'),
		locals: { session: options.user ? { user: { id: options.user } } : null },
		cookies: { get: () => (options.fp === undefined ? 'fp' : options.fp) }
	} as any;
}
beforeEach(() => {
	vi.clearAllMocks();
	rpc.mockResolvedValue({ data: 2, error: null });
	limit.mockResolvedValue({ allowed: true });
});
describe('POST comment views', () => {
	it('deduplicates IDs and binds viewer identity on the server', async () => {
		expect((await POST(event(undefined, { user: 'u' }))).status).toBe(204);
		expect(rpc).toHaveBeenCalledWith('increment_comment_views', {
			p_question_id: 118,
			p_comment_ids: [1, 2],
			p_viewer_id: 'u',
			p_fingerprint: 'fp'
		});
		expect(limit).toHaveBeenCalledWith({ bucket: 'comment_views', subject: 'user:u' });
	});
	it('supports cookie-based anonymous beacons', async () => {
		expect((await POST(event())).status).toBe(204);
		expect(limit).toHaveBeenCalledWith({ bucket: 'comment_views', subject: 'visitor:fp' });
	});
	it.each([
		{ questionId: 1, commentIds: [] },
		{ questionId: 1, commentIds: Array(41).fill(1) },
		{ questionId: 1, commentIds: [-1] },
		{ questionId: '1', commentIds: [1] },
		{ questionId: 1, commentIds: [1], viewerId: 'spoof' }
	])('rejects invalid batches before consuming quota', async (body) => {
		expect((await POST(event(body))).status).toBe(400);
		expect(limit).not.toHaveBeenCalled();
		expect(rpc).not.toHaveBeenCalled();
	});
	it('rejects cross-origin and unidentified callers', async () => {
		expect((await POST(event(undefined, { origin: 'https://elsewhere.test' }))).status).toBe(403);
		expect((await POST(event(undefined, { fp: null }))).status).toBe(401);
		expect(rpc).not.toHaveBeenCalled();
	});
	it('fails closed on durable limiter outages', async () => {
		limit.mockResolvedValue({ allowed: false, degraded: true, retryAfterSeconds: 60 });
		const response = await POST(event());
		expect(response.status).toBe(503);
		expect(response.headers.get('Retry-After')).toBe('60');
		expect(rpc).not.toHaveBeenCalled();
	});
	it('responds to rate limits and failed increments without success', async () => {
		limit.mockResolvedValueOnce({ allowed: false, retryAfterSeconds: 60 });
		expect((await POST(event())).status).toBe(429);
		rpc.mockResolvedValueOnce({ error: {} });
		expect((await POST(event())).status).toBe(503);
	});
});
