// src/lib/server/analyticsHelperInlining.spec.ts
//
// The analytics RPCs call these helpers once per visit row. Postgres only inlines a SQL
// function that has no SET clause, and a helper that is not inlined costs ~25us per call:
// with `SET search_path` on them (added by a security sweep on 2026-09-03) the admin
// analytics queries took 1.4-20s instead of 0.03-0.9s and hit the 8s statement timeout.
// All four must stay inlinable together: with one left out, the planner moves work onto it.
// See supabase/migrations/20261010120000_inline_analytics_helpers.sql.
//
// This walks the migrations in order and fails if the latest state of any helper is no
// longer inlinable.
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'supabase/migrations');
const FIX_MIGRATION = '20261010120000_inline_analytics_helpers.sql';
const INLINED_HELPERS = [
	'is_analytics_utility_path',
	'analytics_scope_match',
	'analytics_local_date',
	'analytics_normalize_content_slug'
] as const;

interface HelperState {
	definedIn: string | null;
	language: string | null;
	hasSetClause: boolean;
	securityDefiner: boolean;
	setBy: string | null;
}

function stripSqlComments(sql: string): string {
	return sql.replace(/--[^\n]*/g, '');
}

function readMigrations(before?: string): Array<{ name: string; sql: string }> {
	return readdirSync(MIGRATIONS_DIR)
		.filter((name) => /^\d{8,14}_.*\.sql$/.test(name))
		.filter((name) => !before || name < before)
		.sort()
		.map((name) => ({
			name,
			sql: stripSqlComments(readFileSync(path.join(MIGRATIONS_DIR, name), 'utf8'))
		}));
}

/** The part of a CREATE FUNCTION statement before its body, where SET clauses live. */
function functionHeader(sql: string, start: number): string {
	const rest = sql.slice(start);
	const bodyStart = rest.search(/\bAS\s+\$|\bRETURN\b|\bBEGIN\s+ATOMIC\b/i);
	return bodyStart === -1 ? rest.slice(0, 2000) : rest.slice(0, bodyStart);
}

/** Helper state after every migration, or after those sorted before `before`. */
function resolveHelperState(helper: string, before?: string): HelperState {
	const state: HelperState = {
		definedIn: null,
		language: null,
		hasSetClause: false,
		securityDefiner: false,
		setBy: null
	};
	const create = new RegExp(
		`CREATE\\s+(?:OR\\s+REPLACE\\s+)?FUNCTION\\s+public\\.${helper}\\s*\\(`,
		'gi'
	);
	const alter = new RegExp(
		`ALTER\\s+FUNCTION\\s+public\\.${helper}\\s*\\([^)]*\\)\\s+([^;]+);`,
		'gi'
	);

	for (const { name, sql } of readMigrations(before)) {
		// Statements are applied in file order, so replay them by position.
		const events: Array<{ index: number; apply: () => void }> = [];

		for (const match of sql.matchAll(create)) {
			const header = functionHeader(sql, match.index ?? 0);
			events.push({
				index: match.index ?? 0,
				apply: () => {
					// CREATE OR REPLACE resets every property it does not restate.
					state.definedIn = name;
					state.language = header.match(/\bLANGUAGE\s+(\w+)/i)?.[1]?.toLowerCase() ?? null;
					state.hasSetClause = /\bSET\s+\w+\s*(?:=|TO\b)/i.test(header);
					state.securityDefiner = /\bSECURITY\s+DEFINER\b/i.test(header);
					state.setBy = state.hasSetClause ? name : null;
				}
			});
		}

		for (const match of sql.matchAll(alter)) {
			const action = match[1];
			events.push({
				index: match.index ?? 0,
				apply: () => {
					if (/^RESET\b/i.test(action)) {
						state.hasSetClause = false;
						state.setBy = null;
					} else if (/^SET\s+\w+\s*(?:=|TO\b)/i.test(action)) {
						state.hasSetClause = true;
						state.setBy = name;
					}
					if (/\bSECURITY\s+DEFINER\b/i.test(action)) state.securityDefiner = true;
					if (/\bSECURITY\s+INVOKER\b/i.test(action)) state.securityDefiner = false;
				}
			});
		}

		for (const event of events.sort((a, b) => a.index - b.index)) event.apply();
	}

	return state;
}

describe('per-row analytics helpers stay inlinable', () => {
	it.each(INLINED_HELPERS)('%s has no SET clause after all migrations', (helper) => {
		const state = resolveHelperState(helper);

		expect(state.definedIn, `${helper} is never defined in supabase/migrations`).not.toBeNull();
		expect(
			state.hasSetClause,
			`${state.setBy} puts a SET clause on public.${helper}, which stops Postgres from ` +
				'inlining it and makes every /admin/analytics query pay a function call per visit ' +
				'row. Drop the SET clause; the SQL-standard body is already search_path-safe.'
		).toBe(false);
		expect(state.language).toBe('sql');
		expect(state.securityDefiner).toBe(false);
	});

	it.each(INLINED_HELPERS)('%s: the walker sees the 2026-09-03 SET clause', (helper) => {
		// Leaving the fix out must reproduce the regression, or the guard above is blind.
		const state = resolveHelperState(helper, FIX_MIGRATION);

		expect(state.hasSetClause).toBe(true);
		expect(state.setBy).toBe('20260903230508_security_rls_storage_rpc.sql');
	});
});
