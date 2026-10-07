// src/routes/admin/comments/comments.page.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { checkDemoTimeMock, serviceReads } = vi.hoisted(() => ({
	checkDemoTimeMock: vi.fn(),
	serviceReads: [] as string[]
}));

vi.mock('../../../utils/api', () => ({
	checkDemoTime: checkDemoTimeMock
}));
vi.mock('$lib/server/demoTime', () => ({ loadRouteDemoTime: vi.fn().mockResolvedValue(false) }));

/** Any-shape query chain that resolves to `result` when awaited. */
function resolvingChain(result: unknown): any {
	const proxy: any = new Proxy(
		{},
		{
			get(_, prop) {
				if (prop === 'then') {
					return (resolve: (value: unknown) => void) => resolve(result);
				}
				return () => proxy;
			}
		}
	);
	return proxy;
}

vi.mock('$lib/server/supabaseAdmin', () => ({
	getSupabaseAdminClient: () => ({
		from: (table: string) => {
			serviceReads.push(table);
			return resolvingChain({ data: [], count: 0, error: null });
		}
	})
}));

import { actions, load } from './+page.server';

function buildRequest(commentId = '42') {
	const formData = new FormData();
	formData.append('commentId', commentId);

	return new Request('http://localhost/admin/comments?/removeComment', {
		method: 'POST',
		body: formData
	});
}

function buildSupabase(options?: { pendingFlags?: Array<{ id: number }> }) {
	const profileSingle = vi.fn().mockResolvedValue({
		data: { id: 'admin-1', admin: true, external_id: 'admin' },
		error: null
	});
	const profileEq = vi.fn(() => ({ single: profileSingle }));
	const profileSelect = vi.fn(() => ({ eq: profileEq }));

	const flagSelect = vi.fn().mockResolvedValue({
		data: options?.pendingFlags ?? [{ id: 7 }],
		error: null
	});
	const flagClearedIs = vi.fn(() => ({ select: flagSelect }));
	const flagRemovedIs = vi.fn(() => ({ is: flagClearedIs }));
	const flagCommentEq = vi.fn(() => ({ is: flagRemovedIs }));
	const flagUpdate = vi.fn(() => ({ eq: flagCommentEq }));

	const commentSingle = vi.fn().mockResolvedValue({
		data: { parent_id: 9, parent_type: 'other' },
		error: null
	});
	const commentUpdateSelect = vi.fn(() => ({ single: commentSingle }));
	const commentUpdateEq = vi.fn(() => ({ select: commentUpdateSelect }));
	const commentUpdate = vi.fn(() => ({ eq: commentUpdateEq }));

	const countRemovedEq = vi.fn().mockResolvedValue({ count: 1, error: null });
	const countParentTypeEq = vi.fn(() => ({ eq: countRemovedEq }));
	const countParentIdEq = vi.fn(() => ({ eq: countParentTypeEq }));
	const countSelect = vi.fn(() => ({ eq: countParentIdEq }));

	const from = vi.fn((table: string) => {
		if (table === 'profiles' || table === 'profiles_demo') {
			return { select: profileSelect };
		}
		if (table === 'flagged_comments') {
			return { update: flagUpdate };
		}
		if (table === 'comments') {
			return { update: commentUpdate, select: countSelect };
		}

		throw new Error(`Unexpected table ${table}`);
	});

	return {
		supabase: { from },
		from,
		flagUpdate,
		flagCommentEq,
		flagRemovedIs,
		flagClearedIs,
		commentUpdate
	};
}

function buildEvent(options?: { commentId?: string; pendingFlags?: Array<{ id: number }> }) {
	const supabaseState = buildSupabase({ pendingFlags: options?.pendingFlags });

	return {
		request: buildRequest(options?.commentId),
		locals: {
			session: { user: { id: 'admin-1' } },
			supabase: supabaseState.supabase
		},
		_supabase: supabaseState
	};
}

describe('/admin/comments moderation actions', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		checkDemoTimeMock.mockResolvedValue(false);
	});

	it('blocks moderation before any live table is touched in demo mode', async () => {
		checkDemoTimeMock.mockResolvedValue(true);
		const event = buildEvent();

		const result = await actions.removeComment(event as any);

		expect(result).toMatchObject({
			status: 400,
			data: {
				success: false,
				message: 'Moderation actions are unavailable while demo mode is enabled'
			}
		});
		expect(event._supabase.from).not.toHaveBeenCalledWith('flagged_comments');
		expect(event._supabase.from).not.toHaveBeenCalledWith('comments');
	});

	it('updates only flags that are still pending review', async () => {
		const event = buildEvent();

		const result = await actions.removeComment(event as any);

		expect(event._supabase.flagCommentEq).toHaveBeenCalledWith('comment_id', 42);
		expect(event._supabase.flagRemovedIs).toHaveBeenCalledWith('removed_at', null);
		expect(event._supabase.flagClearedIs).toHaveBeenCalledWith('cleared_at', null);
		expect(event._supabase.commentUpdate).toHaveBeenCalledWith(
			expect.objectContaining({ removed: true })
		);
		expect(result).toMatchObject({ success: true });
	});

	it('does not mutate a comment when its flag was already handled', async () => {
		const event = buildEvent({ pendingFlags: [] });

		const result = await actions.unflagComment(event as any);

		expect(result).toMatchObject({
			status: 409,
			data: { success: false, message: 'This flag is no longer pending review' }
		});
		expect(event._supabase.commentUpdate).not.toHaveBeenCalled();
	});

	it('rejects malformed comment IDs before moderation queries run', async () => {
		const event = buildEvent({ commentId: '-1' });

		const result = await actions.removeComment(event as any);

		expect(result).toMatchObject({ status: 400, data: { success: false } });
		expect(event._supabase.from).not.toHaveBeenCalledWith('flagged_comments');
	});
});

describe('/admin/comments load (give-first: take text is service-role only)', () => {
	function loadEvent(isAdmin: boolean) {
		const sessionTables: string[] = [];
		return {
			sessionTables,
			event: {
				url: new URL('http://localhost/admin/comments'),
				parent: async () => ({}),
				locals: {
					session: { user: { id: 'user-1' } },
					supabase: {
						from: (table: string) => {
							sessionTables.push(table);
							return resolvingChain(
								table === 'profiles'
									? { data: { id: 'user-1', admin: isAdmin, external_id: 'u' }, error: null }
									: { data: [], count: 0, error: null }
							);
						}
					}
				}
			}
		};
	}

	beforeEach(() => {
		serviceReads.length = 0;
	});

	it('loads comments, flags and blog comments through the service client for an admin', async () => {
		const { event, sessionTables } = loadEvent(true);

		const result = (await load(event as any)) as any;

		expect(result.comments).toEqual([]);
		expect(serviceReads.sort()).toEqual(['blog_comments', 'comments', 'flagged_comments']);
		expect(sessionTables).toEqual(['profiles']);
	});

	it('never runs a service-role read for a non-admin', async () => {
		const { event } = loadEvent(false);

		await expect(load(event as any)).rejects.toMatchObject({ status: 307 });
		expect(serviceReads).toEqual([]);
	});
});
