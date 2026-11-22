// src/lib/server/superlativeVotes.ts
//
// Reader votes on the "Which Enneagram type is the most…" hub. Two kinds per
// trait: "this is me" (the trait fits the reader, recorded with their type) and
// "pick" (the reader's own answer when they think our pick is wrong, with an
// optional private reason). Table + summary RPC: supabase/migrations/
// 20261121200000_superlative_votes.sql. Service role only.
import { z } from 'zod';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import {
	isSuperlativeTrait,
	MIN_PICK_VOTES,
	MIN_TYPE_BASE
} from '$lib/data/superlativeRankings.js';

export { MIN_PICK_VOTES, MIN_TYPE_BASE };

const enneagramType = z.number().int().min(1).max(9);

export const superlativeVoteSchema = z.discriminatedUnion('kind', [
	z.object({
		kind: z.literal('me'),
		trait: z.string().refine(isSuperlativeTrait, 'unknown trait'),
		voterType: enneagramType,
		/** false removes the reader's "this is me". */
		on: z.boolean().default(true)
	}),
	z.object({
		kind: z.literal('pick'),
		trait: z.string().refine(isSuperlativeTrait, 'unknown trait'),
		pickedType: enneagramType,
		voterType: enneagramType.nullish(),
		reason: z
			.string()
			.trim()
			.max(500)
			.transform((value) => value || null)
			.nullish()
	})
]);

export type SuperlativeVote = z.infer<typeof superlativeVoteSchema>;

type SummaryRow = {
	trait: string;
	kind: 'me' | 'pick';
	voter_type: number | null;
	picked_type: number | null;
	votes: number;
};
type BaseRow = { voter_type: number; voters: number };
export type RawSummary = { rows: SummaryRow[]; base: BaseRow[] };

export type TraitResults = {
	/** Readers' own answers, index 0 = Type 1. */
	pickCounts: number[];
	pickTotal: number;
	/** Most-voted reader pick, once pickTotal reaches MIN_PICK_VOTES. */
	readersPick: number | null;
	/** "This is me" votes by the voter's type, index 0 = Type 1. */
	meCounts: number[];
	meTotal: number;
	/** Share of each type's hub voters who said "this is me"; null below MIN_TYPE_BASE. */
	meRates: (number | null)[];
};

export type SuperlativeSummary = Record<string, TraitResults>;

const emptyNine = () => Array.from({ length: 9 }, () => 0);

export function emptyTraitResults(): TraitResults {
	return {
		pickCounts: emptyNine(),
		pickTotal: 0,
		readersPick: null,
		meCounts: emptyNine(),
		meTotal: 0,
		meRates: Array.from({ length: 9 }, () => null)
	};
}

/** Raw RPC rows -> per-trait results. Pure, so the page and the API agree. */
export function summarizeVotes(raw: RawSummary | null | undefined): SuperlativeSummary {
	const base = emptyNine();
	for (const row of raw?.base ?? []) {
		if (row.voter_type >= 1 && row.voter_type <= 9) base[row.voter_type - 1] = row.voters;
	}

	const summary: SuperlativeSummary = {};
	for (const row of raw?.rows ?? []) {
		const results = (summary[row.trait] ??= emptyTraitResults());
		if (row.kind === 'pick' && row.picked_type && row.picked_type >= 1 && row.picked_type <= 9) {
			results.pickCounts[row.picked_type - 1] += row.votes;
			results.pickTotal += row.votes;
		} else if (row.kind === 'me' && row.voter_type && row.voter_type >= 1 && row.voter_type <= 9) {
			results.meCounts[row.voter_type - 1] += row.votes;
			results.meTotal += row.votes;
		}
	}

	for (const results of Object.values(summary)) {
		if (results.pickTotal >= MIN_PICK_VOTES) {
			const top = Math.max(...results.pickCounts);
			const leaders = results.pickCounts.flatMap((count, i) => (count === top ? [i + 1] : []));
			// A tie at the top isn't a reader pick yet.
			results.readersPick = leaders.length === 1 ? leaders[0] : null;
		}
		results.meRates = results.meCounts.map((count, i) =>
			base[i] >= MIN_TYPE_BASE ? count / base[i] : null
		);
	}
	return summary;
}

export async function loadSuperlativeSummary(): Promise<SuperlativeSummary> {
	const { data, error } = await getSupabaseAdminClient().rpc('superlative_vote_summary');
	if (error) throw error;
	return summarizeVotes(data as unknown as RawSummary);
}

/** Save (or change, or remove) one reader's vote. One row per visitor, trait and kind. */
export async function recordSuperlativeVote(
	vote: SuperlativeVote,
	{ fingerprint, userId }: { fingerprint: string; userId: string | null }
): Promise<void> {
	const table = getSupabaseAdminClient().from('superlative_votes');

	if (vote.kind === 'me' && !vote.on) {
		const { error } = await table.delete().match({ trait: vote.trait, kind: 'me', fingerprint });
		if (error) throw error;
		return;
	}

	const row =
		vote.kind === 'me'
			? {
					trait: vote.trait,
					kind: 'me',
					voter_type: vote.voterType,
					picked_type: null,
					reason: null
				}
			: {
					trait: vote.trait,
					kind: 'pick',
					voter_type: vote.voterType ?? null,
					picked_type: vote.pickedType,
					reason: vote.reason ?? null
				};

	const { error } = await table.upsert(
		{ ...row, fingerprint, user_id: userId, updated_at: new Date().toISOString() },
		{ onConflict: 'trait,kind,fingerprint' }
	);
	if (error) throw error;
}
