// src/routes/comments/comments.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
type Call = { method: string; args: unknown[] };
type Row = {
	id: number;
	comment: string;
	parent_id: number;
	parent_type: 'question' | 'comment';
	removed: boolean;
};
const { gate, loadTakes, demo, admin } = vi.hoisted(() => ({
	gate: vi.fn(),
	loadTakes: vi.fn(),
	demo: vi.fn(),
	admin: { rows: [] as Row[], reads: [] as { table: string; calls: Call[] }[] }
}));
/** In-memory service-role client: filters `admin.rows` by eq/in calls. */
function adminChain(table: string): any {
	const calls: Call[] = [];
	const proxy: any = new Proxy(
		{},
		{
			get(_, prop) {
				if (prop === 'then') {
					admin.reads.push({ table, calls });
					let matched = admin.rows;
					for (const call of calls) {
						const [column, value] = call.args as [keyof Row, unknown];
						if (call.method === 'eq') matched = matched.filter((row) => row[column] === value);
						if (call.method === 'in')
							matched = matched.filter((row) => (value as unknown[]).includes(row[column]));
					}
					const single = calls.some((call) => call.method === 'maybeSingle');
					const result = { data: single ? (matched[0] ?? null) : matched, error: null };
					return (resolve: (value: unknown) => void) => resolve(result);
				}
				return (...args: unknown[]) => {
					calls.push({ method: String(prop), args });
					return proxy;
				};
			}
		}
	);
	return proxy;
}
vi.mock('$lib/server/supabaseAdmin', () => ({
	getSupabaseAdminClient: () => ({ from: (table: string) => adminChain(table) })
}));
vi.mock('$lib/server/questionTakes', () => ({ getQuestionTakes: loadTakes }));
vi.mock('../../utils/api', () => ({ checkDemoTime: demo }));
vi.mock('$lib/utils/logger', () => ({
	withApiLogging: (handler: unknown) => handler,
	logger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() }
}));
import { GET, POST } from './+server';
function event(search = 'type=question&parentId=118') {
	return {
		url: new URL(`https://9takes.com/comments?${search}`),
		locals: { supabase: { rpc: gate }, session: { user: { id: 'reader' } } },
		cookies: { get: () => 'browser' }
	} as any;
}
beforeEach(() => {
	vi.clearAllMocks();
	admin.rows = [];
	admin.reads = [];
	demo.mockResolvedValue(false);
	gate.mockResolvedValue({ data: true, error: null });
	loadTakes.mockResolvedValue({ data: [{ id: 1 }], count: 105 });
});
describe('comment overflow API', () => {
	it.each([true, false])(
		'checks a reader without a visitor cookie (signed in: %s)',
		async (signedIn) => {
			const request = event();
			request.cookies.get = () => undefined;
			if (!signedIn) request.locals.session = null;
			gate.mockImplementation(async (_name, args) => {
				// PostgREST requires all three named arguments, including a null fingerprint.
				const body = JSON.parse(JSON.stringify(args));
				expect(body).toEqual({
					questionid: 118,
					userid: signedIn ? 'reader' : null,
					userfingerprint: null
				});
				return { data: signedIn, error: null };
			});
			expect(await (await GET(request)).json()).toEqual(signedIn ? [{ id: 1 }] : []);
			expect(loadTakes).toHaveBeenCalledTimes(signedIn ? 1 : 0);
		}
	);
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
describe('reply threads (type=comment) behind the give-first gate', () => {
	const row = (
		id: number,
		parent_id: number,
		parent_type: Row['parent_type'],
		removed = false
	): Row => ({ id, comment: `text ${id}`, parent_id, parent_type, removed });
	beforeEach(() => {
		admin.rows = [
			row(500, 118, 'question'),
			row(600, 500, 'comment'),
			row(601, 500, 'comment', true),
			row(700, 600, 'comment'),
			row(701, 600, 'comment', true),
			row(800, 999, 'question', true),
			row(801, 800, 'comment')
		];
	});
	const textReads = () =>
		admin.reads.filter((read) =>
			read.calls.some(
				(call) => call.method === 'select' && String(call.args[0]).includes('comment,')
			)
		);
	it('gates replies on the question the take belongs to', async () => {
		await GET(event('type=comment&parentId=500'));
		expect(gate).toHaveBeenCalledWith('can_see_comments_3', {
			userfingerprint: 'browser',
			questionid: 118,
			userid: 'reader'
		});
	});
	it('walks a nested reply up to its question', async () => {
		await GET(event('type=comment&parentId=600'));
		expect(gate).toHaveBeenCalledWith(
			'can_see_comments_3',
			expect.objectContaining({ questionid: 118 })
		);
	});
	it('returns nothing, and reads no take text, for a visitor who has not answered', async () => {
		gate.mockResolvedValue({ data: false, error: null });
		const request = event('type=comment&parentId=500');
		request.locals.session = null;
		expect(await (await GET(request)).json()).toEqual([]);
		expect(textReads()).toEqual([]);
	});
	it('keeps the thread closed when the gate lookup fails', async () => {
		gate.mockResolvedValue({ data: null, error: { message: 'boom' } });
		expect(await (await GET(event('type=comment&parentId=500'))).json()).toEqual([]);
		expect(textReads()).toEqual([]);
	});
	it('returns replies and live grandchildren to a reader who answered', async () => {
		const body = await (await GET(event('type=comment&parentId=500'))).json();
		expect(body.map((reply: Row) => reply.id)).toEqual([600]);
		expect(body[0].comments.map((child: Row) => child.id)).toEqual([700]);
	});
	it('excludes removed grandchildren in the query itself', async () => {
		await GET(event('type=comment&parentId=500'));
		const grandchildren = admin.reads.find((read) =>
			read.calls.some((call) => call.method === 'in' && call.args[0] === 'parent_id')
		);
		expect(grandchildren?.calls).toContainEqual({ method: 'eq', args: ['removed', false] });
	});
	it('stays closed for an unknown comment or a thread under a removed take', async () => {
		for (const parentId of [4242, 801]) {
			gate.mockClear();
			expect(
				await (await GET(event(`type=comment&parentId=${parentId}`))).json(),
				String(parentId)
			).toEqual([]);
			expect(gate).not.toHaveBeenCalled();
		}
		expect(textReads()).toEqual([]);
	});
	it('reads demo-mode takes through the service role after the gate', async () => {
		demo.mockResolvedValue(true);
		admin.rows = [row(500, 118, 'question')];
		const body = await (await GET(event('type=question&parentId=118'))).json();
		expect(body.map((take: Row) => take.id)).toEqual([500]);
		expect(admin.reads.map((read) => read.table)).toContain('comments_demo');
		expect(loadTakes).not.toHaveBeenCalled();
	});
});

describe('editing your own take (POST)', () => {
	function editEvent(commentId: string, authorRow: { id: number; author_id: string } | null) {
		const updates: unknown[] = [];
		const chain = (): any => {
			const self: any = {
				select: () => self,
				eq: () => self,
				update: (values: unknown) => {
					updates.push(values);
					return self;
				},
				single: async () => ({ data: authorRow, error: null })
			};
			return self;
		};
		const body = new FormData();
		body.append('comment', 'An edited take');
		body.append('comment_id', commentId);
		return {
			updates,
			event: {
				locals: { supabase: { from: chain }, session: { user: { id: 'author-1' } } },
				request: new Request('https://9takes.com/comments', { method: 'POST', body })
			} as any
		};
	}

	it('accepts the numeric comment ids the edit form sends', async () => {
		const { event, updates } = editEvent('715', { id: 715, author_id: 'author-1' });
		const response = await POST(event);
		expect(response.status).toBe(200);
		expect(updates).toHaveLength(1);
	});

	it('still rejects a non-numeric id', async () => {
		const { event } = editEvent('not-an-id', null);
		await expect(POST(event)).rejects.toMatchObject({ status: 400 });
	});

	it('forbids editing a take you did not write', async () => {
		const { event, updates } = editEvent('715', null);
		await expect(POST(event)).rejects.toMatchObject({ status: 403 });
		expect(updates).toHaveLength(0);
	});
});
