#!/usr/bin/env node
// scripts/push-cluster-tags.mjs
// Copies cluster tags ('screen-icon', 'pop-star', ...) from people drafts to the
// live `blogs_famous_people.type` arrays. `type` is a protected field that
// personBlogParser.js and its RPC never patch, so this is the one narrow way in:
// a row is updated only when the draft's `type` equals the live one plus cluster
// tags. Any other difference (a field type added, removed or reordered) is skipped
// and reported for a person to decide.
//
// Usage:
//   node scripts/push-cluster-tags.mjs                          # preview
//   node scripts/push-cluster-tags.mjs --write --backup=<file>  # apply; saves live arrays first
// Pages are ISR-cached, so live pages can lag up to 24h.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import dotenv from 'dotenv';
import matter from 'gray-matter';
import { createClient } from '@supabase/supabase-js';
import { normalizePersonalitySlug } from './lib/personalitySeo.js';
import { isClusterTag } from '../src/lib/personClusterTags.js';

const DRAFTS_DIR = 'src/blog/people/drafts';

/** @param {unknown} value @returns {string[]} */
const asTypes = (value) =>
	Array.isArray(value) ? value.filter((item) => typeof item === 'string') : [];

/**
 * The array to store, or null when live and local differ beyond added cluster tags.
 * @param {string[]} live
 * @param {string[]} local
 */
export function planClusterTagUpdate(live, local) {
	const fieldTypes = (/** @type {string[]} */ list) => list.filter((t) => !isClusterTag(t));
	if (!isDeepStrictEqual(fieldTypes(live), fieldTypes(local))) return null;
	const liveTags = live.filter(isClusterTag);
	const localTags = local.filter(isClusterTag);
	if (!liveTags.every((tag) => localTags.includes(tag))) return null;
	return localTags.length > liveTags.length ? local : null;
}

async function main() {
	dotenv.config();
	const write = process.argv.includes('--write');
	const backup = process.argv.find((arg) => arg.startsWith('--backup='))?.slice(9);
	if (write && !backup) throw new Error('--write needs --backup=<file> for the live arrays');
	const url = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
	const key = process.env.SUPABASE_SERVICE_KEY;
	if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
	const supabase = createClient(url, key);

	/** @type {Map<string, string[]>} */
	const local = new Map();
	for (const file of (await fs.readdir(DRAFTS_DIR)).filter((f) => f.endsWith('.md'))) {
		const { data } = matter(await fs.readFile(path.join(DRAFTS_DIR, file), 'utf8'), {});
		const slug = normalizePersonalitySlug(data.person || file.replace(/\.md$/, ''));
		if (slug) local.set(slug, asTypes(data.type));
	}

	const { data: rows, error } = await supabase
		.from('blogs_famous_people')
		.select('id, person, type, published');
	if (error) throw error;

	const updates = [];
	const conflicts = [];
	for (const row of rows ?? []) {
		const draft = local.get(normalizePersonalitySlug(row.person));
		if (!draft) continue;
		const live = asTypes(row.type);
		const next = planClusterTagUpdate(live, draft);
		if (next)
			updates.push({ id: row.id, person: row.person, published: row.published, live, next });
		else if (
			draft.some(isClusterTag) &&
			!isDeepStrictEqual(
				live.filter((t) => !isClusterTag(t)),
				draft.filter((t) => !isClusterTag(t))
			)
		)
			conflicts.push(
				`${row.person}: live ${JSON.stringify(live)} vs draft ${JSON.stringify(draft)}`
			);
	}

	for (const u of updates)
		console.log(
			`${write ? 'update' : 'would update'} ${String(u.person).padEnd(28)} ${u.published ? 'live ' : 'draft'} ${JSON.stringify(u.live)} -> ${JSON.stringify(u.next)}`
		);
	for (const line of conflicts) console.log(`skipped (field types differ) ${line}`);
	console.log(
		`\n${updates.length} rows ${write ? 'to update' : 'would update'} (${updates.filter((u) => u.published).length} published), ${conflicts.length} skipped`
	);
	if (!write || updates.length === 0) return;

	await fs.writeFile(
		/** @type {string} */ (backup),
		JSON.stringify(
			updates.map(({ id, person, live }) => ({ id, person, type: live })),
			null,
			1
		)
	);
	let done = 0;
	for (const u of updates) {
		// Re-read so a concurrent edit isn't overwritten.
		const { data: current, error: readError } = await supabase
			.from('blogs_famous_people')
			.select('type')
			.eq('id', u.id)
			.single();
		if (readError || !isDeepStrictEqual(asTypes(current?.type), u.live)) {
			console.log(`skipped ${u.person}: live type changed during the run`);
			continue;
		}
		const { error: writeError } = await supabase
			.from('blogs_famous_people')
			.update({ type: u.next })
			.eq('id', u.id);
		if (writeError) console.log(`failed ${u.person}: ${writeError.message}`);
		else done++;
	}
	console.log(`updated ${done}/${updates.length}; backup at ${backup}`);
}

if (
	process.argv[1] &&
	path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)
)
	main().catch((error) => {
		console.error(error instanceof Error ? error.message : error);
		process.exitCode = 1;
	});
