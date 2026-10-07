// src/routes/users/profileAnswers.page.server.spec.ts
//
// /users/[externalId]: the public profile lists the questions a user answered.
// Give-first: a visitor sees the question titles (each links to the question,
// where the wall applies) but never the take text. The profile owner and
// admins also see the text. All fixtures are synthetic.
import { beforeEach, describe, expect, it, vi } from 'vitest';

type Call = { method: string; args: unknown[] };
type Read = { client: string; table: string; calls: Call[] };

const state = vi.hoisted(() => ({
	reads: [] as { client: string; table: string; calls: { method: string; args: unknown[] }[] }[],
	tables: {} as Record<string, Record<string, unknown>[]>
}));

/** In-memory client: filters `state.tables[table]` by eq/in/not calls. */
function chain(table: string, client: string): any {
	const calls: Call[] = [];
	state.reads.push({ client, table, calls });
	const proxy: any = new Proxy(
		{},
		{
			get(_, prop) {
				if (prop === 'then') {
					let rows = state.tables[table] ?? [];
					for (const call of calls) {
						const [column, a, b] = call.args as [string, unknown, unknown];
						if (call.method === 'eq') rows = rows.filter((row) => row[column] === a);
						if (call.method === 'in')
							rows = rows.filter((row) => (a as unknown[]).includes(row[column]));
						if (call.method === 'not' && a === 'is' && b === true)
							rows = rows.filter((row) => row[column] !== true);
						if (call.method === 'order') {
							const ascending = (a as { ascending?: boolean })?.ascending !== false;
							rows = [...rows].sort(
								(x, y) => String(x[column]).localeCompare(String(y[column])) * (ascending ? 1 : -1)
							);
						}
					}
					const select = calls.find((call) => call.method === 'select');
					const columns = String(select?.args[0] ?? '*')
						.split(',')
						.map((column) => column.trim());
					const projected = rows.map((row) =>
						columns.includes('*')
							? row
							: Object.fromEntries(columns.filter((c) => c in row).map((c) => [c, row[c]]))
					);
					const single = calls.some((call) => call.method === 'single');
					const result = single
						? { data: projected[0] ?? null, error: projected[0] ? null : { message: 'none' } }
						: { data: projected, error: null };
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
	getSupabaseAdminClient: () => ({
		from: (table: string) => chain(table, 'admin'),
		auth: { admin: { getUserById: async () => ({ data: { user: null } }) } }
	})
}));
vi.mock('../../utils/api', () => ({ checkDemoTime: vi.fn().mockResolvedValue(false) }));

import { load } from './[externalId]/+page.server';
import { buildProfileAnswers, canSeeProfileTakeText } from '$lib/server/profileAnswers';

const OWNER_ID = 'owner-uuid';

function seed() {
	state.tables = {
		public_profiles: [
			{
				id: OWNER_ID,
				enneagram: '6',
				external_id: 'ext-owner',
				created_at: '2026-01-01T00:00:00.000Z',
				first_name: 'Sam'
			}
		],
		subscriptions: [],
		comments: [
			{
				id: 11,
				author_id: OWNER_ID,
				parent_id: 1,
				parent_type: 'question',
				removed: false,
				created_at: '2026-03-01T00:00:00.000Z',
				comment: 'synthetic take one'
			},
			{
				id: 12,
				author_id: OWNER_ID,
				parent_id: 1,
				parent_type: 'question',
				removed: false,
				created_at: '2026-03-02T00:00:00.000Z',
				comment: 'synthetic take two'
			},
			{
				id: 13,
				author_id: OWNER_ID,
				parent_id: 2,
				parent_type: 'question',
				removed: true,
				created_at: '2026-03-03T00:00:00.000Z',
				comment: 'synthetic removed take'
			},
			{
				id: 14,
				author_id: OWNER_ID,
				parent_id: 3,
				parent_type: 'question',
				removed: false,
				created_at: '2026-03-04T00:00:00.000Z',
				comment: 'synthetic take on a flagged question'
			},
			{
				id: 15,
				author_id: 'someone-else',
				parent_id: 1,
				parent_type: 'question',
				removed: false,
				created_at: '2026-03-05T00:00:00.000Z',
				comment: 'synthetic take by another user'
			}
		],
		questions: [
			{ id: 1, question: 'q one', question_formatted: 'Question one?', url: 'q-one' },
			{ id: 2, question: 'q two', question_formatted: 'Question two?', url: 'q-two' },
			{
				id: 3,
				question: 'q three',
				question_formatted: 'Question three?',
				url: 'q-three',
				flagged: true
			}
		]
	};
}

function buildEvent(viewer: { id: string; admin?: boolean } | null) {
	return {
		params: { externalId: 'ext-owner' },
		parent: async () => ({
			demo_time: false,
			user: viewer ? { id: viewer.id, admin: viewer.admin ?? false } : null
		}),
		locals: {
			user: viewer ? { id: viewer.id } : null,
			session: viewer ? { user: { id: viewer.id } } : null,
			supabase: { from: (table: string) => chain(table, 'locals') }
		}
	} as any;
}

const textReads = () =>
	state.reads.filter(
		(read: Read) =>
			read.table === 'comments' &&
			read.calls.some(
				(call) => call.method === 'select' && /\bcomment\b/.test(String(call.args[0]))
			)
	);

describe('/users/[externalId] answered questions (give-first)', () => {
	beforeEach(() => {
		state.reads = [];
		seed();
	});

	it('shows a logged-out visitor the questions answered, without take text', async () => {
		const result = (await load(buildEvent(null))) as any;

		expect(result.canSeeTakeText).toBe(false);
		expect(result.comments.map((row: any) => row.url)).toEqual(['q-one']);
		expect(result.comments.every((row: any) => !('comment' in row))).toBe(true);
		expect(JSON.stringify(result)).not.toContain('synthetic');
		expect(textReads()).toEqual([]);
	});

	it('treats a signed-in non-owner as a visitor', async () => {
		const result = (await load(buildEvent({ id: 'stranger' }))) as any;

		expect(result.canSeeTakeText).toBe(false);
		expect(JSON.stringify(result.comments)).not.toContain('synthetic');
	});

	it('shows the owner their own take text, newest first, live questions only', async () => {
		const result = (await load(buildEvent({ id: OWNER_ID }))) as any;

		expect(result.canSeeTakeText).toBe(true);
		expect(result.comments.map((row: any) => [row.id, row.comment])).toEqual([
			[12, 'synthetic take two'],
			[11, 'synthetic take one']
		]);
		// Text only ever comes through the service role.
		expect(textReads().every((read) => read.client === 'admin')).toBe(true);
		expect(textReads()).toHaveLength(1);
	});

	it('shows an admin the take text', async () => {
		const result = (await load(buildEvent({ id: 'admin-uuid', admin: true }))) as any;

		expect(result.canSeeTakeText).toBe(true);
		expect(result.comments[0].comment).toBe('synthetic take two');
	});

	it('keeps the page working when the user has no answers', async () => {
		state.tables.comments = [];

		const result = (await load(buildEvent(null))) as any;

		expect(result.comments).toEqual([]);
		expect(result.user.external_id).toBe('ext-owner');
	});
});

describe('profileAnswers helpers', () => {
	it('only the owner or an admin may read take text', () => {
		expect(canSeeProfileTakeText(null, OWNER_ID)).toBe(false);
		expect(canSeeProfileTakeText({ id: 'x' }, OWNER_ID)).toBe(false);
		expect(canSeeProfileTakeText({ id: OWNER_ID }, OWNER_ID)).toBe(true);
		expect(canSeeProfileTakeText({ id: 'x', admin: true }, OWNER_ID)).toBe(true);
		expect(canSeeProfileTakeText({ id: OWNER_ID }, '')).toBe(false);
	});

	it('drops takes whose question is missing and never adds text for visitors', () => {
		const questions = new Map([[1, { id: 1, question: 'q', question_formatted: null, url: 'q' }]]);
		const takes = [
			{ id: 1, parent_id: 1, comment: 'synthetic' },
			{ id: 2, parent_id: 9, comment: 'synthetic orphan' }
		];

		expect(buildProfileAnswers(takes, questions, false)).toEqual([
			{ id: 1, url: 'q', question: 'q', question_formatted: null }
		]);
		expect(buildProfileAnswers(takes, questions, true)).toEqual([
			{ id: 1, url: 'q', question: 'q', question_formatted: null, comment: 'synthetic' }
		]);
	});
});
