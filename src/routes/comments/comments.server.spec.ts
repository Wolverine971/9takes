import { beforeEach, describe, expect, it, vi } from 'vitest';
const { gate, loadTakes, demo } = vi.hoisted(() => ({
	gate: vi.fn(),
	loadTakes: vi.fn(),
	demo: vi.fn()
}));
vi.mock('$lib/server/questionTakes', () => ({ getQuestionTakes: loadTakes }));
vi.mock('../../utils/api', () => ({ checkDemoTime: demo }));
vi.mock('$lib/utils/logger', () => ({
	withApiLogging: (handler: unknown) => handler,
	logger: { warn: vi.fn(), error: vi.fn() }
}));
import { GET } from './+server';
function event(search = 'type=question&parentId=118') {
	return {
		url: new URL(`https://9takes.com/comments?${search}`),
		locals: { supabase: { rpc: gate }, session: { user: { id: 'reader' } } },
		cookies: { get: () => 'browser' }
	} as any;
}
beforeEach(() => {
	vi.clearAllMocks();
	demo.mockResolvedValue(false);
	gate.mockResolvedValue({ data: true, error: null });
	loadTakes.mockResolvedValue({ data: [{ id: 1 }], count: 105 });
});
describe('comment overflow API', () => {
	it('never calls the service projection for a locked reader', async () => {
		gate.mockResolvedValue({ data: false, error: null });
		expect(await (await GET(event())).json()).toEqual([]);
		expect(loadTakes).not.toHaveBeenCalled();
	});
	it('keeps failed gate lookups closed', async () => {
		gate.mockResolvedValue({ data: null, error: {} });
		expect(await (await GET(event())).json()).toEqual([]);
		expect(loadTakes).not.toHaveBeenCalled();
	});
	it('passes validated date and ID with the server viewer identity', async () => {
		const response = await GET(
			event('type=question&parentId=118&before=2026-09-01T00:00:00Z&beforeId=5')
		);
		expect(await response.json()).toEqual([{ id: 1 }]);
		expect(loadTakes).toHaveBeenCalledWith(118, {
			viewerId: 'reader',
			fingerprint: 'browser',
			limit: 10,
			before: '2026-09-01T00:00:00Z',
			beforeId: 5
		});
	});
	it.each([
		'type=question&parentId=118&beforeId=5',
		'type=question&parentId=-1',
		'type=question&parentId=118&before=not-a-date&beforeId=5'
	])('rejects invalid cursors and IDs: %s', async (search) => {
		await expect(GET(event(search))).rejects.toMatchObject({ status: 400 });
		expect(loadTakes).not.toHaveBeenCalled();
	});
});
