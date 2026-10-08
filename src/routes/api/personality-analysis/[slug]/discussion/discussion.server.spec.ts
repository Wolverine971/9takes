// src/routes/api/personality-analysis/[slug]/discussion/discussion.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { consumeApiRateLimitMock, adminState } = vi.hoisted(() => ({
	consumeApiRateLimitMock: vi.fn(),
	adminState: {
		publishedPerson: true as boolean,
		existingAnonComment: false as boolean,
		insertError: null as { message: string } | null,
		inserts: [] as Record<string, unknown>[],
		upserts: [] as Record<string, unknown>[]
	}
}));

/** Chainable stand-in for the service-role client; only the calls POST makes. */
function fakeAdminClient() {
	return {
		from(table: string) {
			let inserted: Record<string, unknown> | null = null;
			let selected: string[] = [];
			const builder: Record<string, any> = {};
			for (const method of ['eq', 'in', 'limit', 'abortSignal', 'order']) {
				builder[method] = () => builder;
			}
			builder.select = (columns: string) => {
				selected = columns.split(',').map((column) => column.trim());
				return builder;
			};
			builder.insert = (row: Record<string, unknown>) => {
				inserted = row;
				adminState.inserts.push(row);
				return builder;
			};
			builder.upsert = async (row: Record<string, unknown>) => {
				adminState.upserts.push(row);
				return { error: null };
			};
			builder.maybeSingle = async () => {
				if (table === 'blogs_famous_people') {
					return { data: adminState.publishedPerson ? { person: 'robert-greene' } : null };
				}
				return { data: adminState.existingAnonComment ? { id: 1 } : null, error: null };
			};
			builder.single = async () => {
				if (adminState.insertError) return { data: null, error: adminState.insertError };
				const row: Record<string, unknown> = {
					id: 99,
					created_at: '2026-10-08T00:00:00Z',
					...inserted
				};
				// Like PostgREST, return only the selected columns.
				return {
					data: Object.fromEntries(selected.map((column) => [column, row[column]])),
					error: null
				};
			};
			return builder;
		}
	};
}

vi.mock('$lib/server/supabaseAdmin', () => ({ getSupabaseAdminClient: () => fakeAdminClient() }));
vi.mock('$lib/server/apiRateLimit', () => ({
	consumeApiRateLimit: consumeApiRateLimitMock,
	resolveRateLimitSubject: ({
		userId,
		clientAddress
	}: {
		userId?: string;
		clientAddress: string;
	}) => (userId ? `user:${userId}` : `ip:${clientAddress}`)
}));

import { POST } from './+server';

function postEvent({
	body,
	userId = null,
	cookieFingerprint = null,
	slug = 'robert-greene'
}: {
	body: unknown;
	userId?: string | null;
	cookieFingerprint?: string | null;
	slug?: string;
}) {
	return {
		params: { slug },
		request: new Request(`https://9takes.com/api/personality-analysis/${slug}/discussion`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		}),
		locals: {
			session: userId ? { user: { id: userId } } : null,
			supabase: {}
		},
		cookies: { get: () => cookieFingerprint ?? undefined },
		getClientAddress: () => '203.0.113.7',
		setHeaders: vi.fn()
	} as any;
}

describe('POST /api/personality-analysis/[slug]/discussion', () => {
	beforeEach(() => {
		consumeApiRateLimitMock.mockReset();
		consumeApiRateLimitMock.mockResolvedValue({
			allowed: true,
			retryAfterSeconds: 60,
			degraded: false
		});
		adminState.publishedPerson = true;
		adminState.existingAnonComment = false;
		adminState.insertError = null;
		adminState.inserts = [];
		adminState.upserts = [];
	});

	it('saves a signed-in comment with the session user as author, ignoring any client author_id', async () => {
		const response = await POST(
			postEvent({
				body: { comment: '  He reads the room before he enters it.  ', author_id: 'spoofed' },
				userId: 'user-1',
				cookieFingerprint: 'fp-1'
			})
		);

		expect(response.status).toBe(200);
		expect(adminState.inserts).toHaveLength(1);
		expect(adminState.inserts[0]).toMatchObject({
			comment: 'He reads the room before he enters it.',
			blog_link: 'robert-greene',
			blog_type: 'personality-analysis',
			author_id: 'user-1',
			fingerprint: 'fp-1'
		});
		const payload = await response.json();
		expect(payload.comments[0]).toMatchObject({ id: 99, author_id: 'user-1' });
		expect(payload.comments[0]).not.toHaveProperty('ip');
	});

	it('creates the visitor row the fingerprint foreign key needs', async () => {
		await POST(postEvent({ body: { comment: 'Type 5 for sure', fingerprint: 'fp-body' } }));

		expect(adminState.upserts).toEqual([expect.objectContaining({ fingerprint: 'fp-body' })]);
		expect(adminState.inserts[0]).toMatchObject({ author_id: null, fingerprint: 'fp-body' });
	});

	it('reports a failed insert as an error instead of a saved comment', async () => {
		adminState.insertError = { message: 'new row violates row-level security policy' };

		const response = await POST(postEvent({ body: { comment: 'x' }, userId: 'user-1' }));

		expect(response.status).toBe(500);
		expect((await response.json()).error).toBeTruthy();
	});

	it('limits anonymous visitors to one comment per page', async () => {
		adminState.existingAnonComment = true;

		const response = await POST(
			postEvent({ body: { comment: 'second try' }, cookieFingerprint: 'fp-1' })
		);

		expect(response.status).toBe(403);
		expect(adminState.inserts).toHaveLength(0);
	});

	it('rejects comments once the rate limit is spent', async () => {
		consumeApiRateLimitMock.mockResolvedValue({
			allowed: false,
			retryAfterSeconds: 60,
			degraded: false
		});

		const response = await POST(postEvent({ body: { comment: 'spam' }, userId: 'user-1' }));

		expect(response.status).toBe(429);
		expect(consumeApiRateLimitMock).toHaveBeenCalledWith({
			bucket: 'blog_comment',
			subject: 'user:user-1'
		});
		expect(adminState.inserts).toHaveLength(0);
	});

	it('refuses pages that are not published', async () => {
		adminState.publishedPerson = false;

		const response = await POST(postEvent({ body: { comment: 'hi' }, userId: 'user-1' }));

		expect(response.status).toBe(404);
		expect(adminState.inserts).toHaveLength(0);
	});

	it('rejects empty comments and anonymous posts with no visitor id', async () => {
		expect((await POST(postEvent({ body: { comment: '   ' }, userId: 'user-1' }))).status).toBe(
			400
		);
		expect((await POST(postEvent({ body: { comment: 'hello' } }))).status).toBe(400);
		expect(adminState.inserts).toHaveLength(0);
	});
});
