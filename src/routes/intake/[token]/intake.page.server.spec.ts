// src/routes/intake/[token]/intake.page.server.spec.ts
//
// The intake form is public and token-gated. It works through the service-role
// client, so these specs pin down that every query is scoped to the token and
// that only the answer columns are written. All fixtures are synthetic.
import { beforeEach, describe, expect, it, vi } from 'vitest';

type Call = { method: string; args: unknown[] };
type Query = { table: string; calls: Call[] };

const state = vi.hoisted(() => ({
	queries: [] as { table: string; calls: { method: string; args: unknown[] }[] }[],
	results: [] as unknown[]
}));

/** Records every call on a query chain and resolves to the next queued result. */
function chain(table: string): any {
	const calls: Call[] = [];
	state.queries.push({ table, calls });
	const proxy: any = new Proxy(
		{},
		{
			get(_, prop) {
				if (prop === 'then') {
					const result = state.results.shift() ?? { data: null, error: null };
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
	getSupabaseAdminClient: () => ({ from: (table: string) => chain(table) })
}));

vi.mock('$lib/utils/logger', () => ({
	logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}));

import { actions, load } from './+page.server';

const TOKEN = '0b9b6a52-2f0a-4b7e-9a51-3f6c1d2e4a77';
const CLIENT_ID = '7c1f0c9e-8a3b-4f55-b0a9-2d9e6f4c1b22';

function buildSubmit(fields: Record<string, string> = {}, token = TOKEN) {
	const body = new FormData();
	const answers = { current_challenges: 'Work stress', desired_outcome: 'Clarity', ...fields };
	for (const [key, value] of Object.entries(answers)) body.set(key, value);

	// A session client that fails the test if the page ever reaches for it.
	const visitorClient = {
		from: () => {
			throw new Error('The intake page must not use the visitor client');
		}
	};

	return {
		params: { token },
		request: new Request(`http://localhost/intake/${token}?/submit`, { method: 'POST', body }),
		locals: { supabase: visitorClient, session: null }
	};
}

function callsOf(query: Query, method: string) {
	return query.calls.filter((call) => call.method === method).map((call) => call.args);
}

describe('/intake/[token] load', () => {
	beforeEach(() => {
		state.queries.length = 0;
		state.results.length = 0;
	});

	it.each(['not-a-uuid', '42', `${TOKEN}x`])(
		'returns 404 for a malformed token: %s',
		async (token) => {
			await expect(load({ params: { token } } as any)).rejects.toMatchObject({ status: 404 });
			expect(state.queries).toEqual([]);
		}
	);

	it('returns 404 when no form has that id', async () => {
		state.results.push({ data: null, error: null });

		await expect(load({ params: { token: TOKEN } } as any)).rejects.toMatchObject({ status: 404 });
	});

	it('loads one form by its token and exposes only the greeting fields', async () => {
		state.results.push({
			data: { id: TOKEN, status: 'sent', client: { name: 'Jamie Rivera', enneagram_type: 4 } },
			error: null
		});

		const result = await load({ params: { token: TOKEN } } as any);

		expect(result).toEqual({
			intake: { id: TOKEN, status: 'sent', clientName: 'Jamie', clientType: 4 },
			completed: false
		});
		expect(state.queries).toHaveLength(1);
		expect(state.queries[0].table).toBe('consulting_intake_forms');
		expect(callsOf(state.queries[0], 'eq')).toEqual([['id', TOKEN]]);
		expect(String(callsOf(state.queries[0], 'select')[0][0])).not.toContain('email');
	});

	it.each(['completed', 'reviewed'])('shows the thank-you screen for a %s form', async (status) => {
		state.results.push({ data: { id: TOKEN, status, client: null }, error: null });

		await expect(load({ params: { token: TOKEN } } as any)).resolves.toMatchObject({
			completed: true
		});
	});

	it('does not leak a database error', async () => {
		state.results.push({ data: null, error: { message: 'relation "secret" does not exist' } });

		const failure = await Promise.resolve(load({ params: { token: TOKEN } } as any)).catch(
			(e: unknown) => e
		);

		expect(failure).toMatchObject({ status: 500 });
		expect(JSON.stringify(failure)).not.toContain('secret');
	});
});

describe('/intake/[token] submit', () => {
	beforeEach(() => {
		state.queries.length = 0;
		state.results.length = 0;
	});

	it('returns 404 for a malformed token before any query', async () => {
		await expect(actions.submit(buildSubmit({}, 'nope') as any)).rejects.toMatchObject({
			status: 404
		});
		expect(state.queries).toEqual([]);
	});

	it('rejects invalid answers before any query', async () => {
		const result = await actions.submit(buildSubmit({ desired_outcome: '' }) as any);

		expect(result).toMatchObject({
			status: 400,
			data: { error: 'Desired outcome is required' }
		});
		expect(state.queries).toEqual([]);
	});

	it.each(['completed', 'reviewed'])('refuses to overwrite a %s form', async (status) => {
		state.results.push({ data: { id: TOKEN, client_id: CLIENT_ID, status }, error: null });

		const result = await actions.submit(buildSubmit() as any);

		expect(result).toMatchObject({ status: 409 });
		expect(state.queries).toHaveLength(1);
		expect(callsOf(state.queries[0], 'update')).toEqual([]);
	});

	it('saves the answers for the one form named by the token', async () => {
		state.results.push(
			{ data: { id: TOKEN, client_id: CLIENT_ID, status: 'sent' }, error: null },
			{ data: [{ id: TOKEN }], error: null },
			{ data: null, error: null }
		);

		const result = await actions.submit(
			buildSubmit({
				suspected_type: '4',
				urgency_level: 'high',
				occupation: ' Teacher ',
				status: 'reviewed',
				client_id: 'someone-else'
			}) as any
		);

		expect(result).toEqual({ success: true });
		expect(state.queries.map((query) => query.table)).toEqual([
			'consulting_intake_forms',
			'consulting_intake_forms',
			'consulting_clients'
		]);

		const [lookup, save, client] = state.queries;
		expect(callsOf(lookup, 'eq')).toEqual([['id', TOKEN]]);

		const written = callsOf(save, 'update')[0][0] as Record<string, unknown>;
		expect(written).toMatchObject({
			current_challenges: 'Work stress',
			desired_outcome: 'Clarity',
			suspected_type: 4,
			urgency_level: 'high',
			occupation: 'Teacher',
			age_range: null,
			status: 'completed'
		});
		// 26 answers + status, completed_at, updated_at; nothing else from the form.
		expect(Object.keys(written)).toHaveLength(29);
		expect(written).not.toHaveProperty('client_id');
		expect(written).not.toHaveProperty('reviewed_at');
		expect(callsOf(save, 'eq')).toEqual([['id', TOKEN]]);
		expect(callsOf(save, 'or')).toEqual([['status.is.null,status.in.(pending,sent)']]);

		expect(callsOf(client, 'update')[0][0]).toEqual({
			status: 'intake_completed',
			updated_at: written.updated_at
		});
		expect(callsOf(client, 'eq')).toEqual([['id', CLIENT_ID]]);
		expect(callsOf(client, 'or')).toEqual([['status.is.null,status.in.(prospect,intake_sent)']]);
	});

	it('reports a conflict when another submit saved first', async () => {
		state.results.push(
			{ data: { id: TOKEN, client_id: CLIENT_ID, status: 'sent' }, error: null },
			{ data: [], error: null }
		);

		const result = await actions.submit(buildSubmit() as any);

		expect(result).toMatchObject({ status: 409 });
		expect(state.queries).toHaveLength(2);
	});

	it('returns a generic message when the save fails', async () => {
		state.results.push(
			{ data: { id: TOKEN, client_id: CLIENT_ID, status: 'sent' }, error: null },
			{ data: null, error: { message: 'violates check constraint "secret_check"' } }
		);

		const result = await actions.submit(buildSubmit() as any);

		expect(result).toMatchObject({
			status: 500,
			data: { error: 'Failed to save your responses. Please try again.' }
		});
		expect(JSON.stringify(result)).not.toContain('secret_check');
	});
});
