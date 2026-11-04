#!/usr/bin/env node
// scripts/add-cluster-tags.mjs
// Adds cluster tags to people drafts' frontmatter `type` arrays, touching only the
// `type` line(s). Each tag must belong to the field the person is filed under
// (src/lib/personClusterTags.js). Cluster tags are outside the v3 release hash,
// so released drafts stay publishable.
//
// Usage:
//   node scripts/add-cluster-tags.mjs tags.json            # dry run: show changes
//   node scripts/add-cluster-tags.mjs tags.json --write    # apply them
// tags.json: { "Draft-File-Stem": "cluster-tag", ... }
// Then sync changed published rows: pnpm push:people -- <Person> --sync

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import matter from 'gray-matter';
import {
	CLUSTER_FIELDS,
	getMissingClusterField,
	getPrimaryField
} from '../src/lib/personClusterTags.js';

const DRAFTS_DIR = 'src/blog/people/drafts';

/**
 * Returns the markdown with `tag` appended to the frontmatter `type` array, or null
 * when the type field isn't a shape this can edit safely.
 * @param {string} markdown
 * @param {string} tag
 */
export function appendTypeTag(markdown, tag) {
	const end = markdown.indexOf('\n---', 4);
	if (!markdown.startsWith('---') || end === -1) return null;
	const head = markdown.slice(0, end);
	const rest = markdown.slice(end);
	const lines = head.split('\n');
	const at = lines.findIndex((line) => /^type:/.test(line));
	if (at === -1) return null;
	const inline = lines[at].match(/^type:\s*\[(.*)\]\s*$/);
	if (inline) {
		const quote = inline[1].includes('"') ? '"' : "'";
		const items = inline[1].trim();
		lines[at] = `type: [${items ? `${items}, ` : ''}${quote}${tag}${quote}]`;
		return lines.join('\n') + rest;
	}
	if (lines[at].trim() !== 'type:') return null;
	let last = at;
	while (last + 1 < lines.length && /^\s+-\s/.test(lines[last + 1])) last++;
	if (last === at) return null;
	const indent = lines[last].match(/^(\s+-\s)/)?.[1] ?? '  - ';
	const quoted = lines[last].match(/^\s+-\s(['"])/)?.[1] ?? '';
	lines.splice(last + 1, 0, `${indent}${quoted}${tag}${quoted}`);
	return lines.join('\n') + rest;
}

async function main() {
	const [mapFile] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
	const write = process.argv.includes('--write');
	if (!mapFile) throw new Error('Usage: node scripts/add-cluster-tags.mjs tags.json [--write]');
	/** @type {Record<string, string>} */
	const assignments = JSON.parse(await fs.readFile(mapFile, 'utf8'));
	const fieldTags = new Map(
		CLUSTER_FIELDS.map(({ field, tags }) => [field, tags.map((t) => t.tag)])
	);
	let changed = 0;
	const skipped = [];

	for (const [stem, tag] of Object.entries(assignments)) {
		const file = path.join(DRAFTS_DIR, `${stem}.md`);
		const before = await fs.readFile(file, 'utf8').catch(() => null);
		if (before === null) {
			skipped.push(`${stem}: no draft`);
			continue;
		}
		const data = matter(before, {}).data;
		const person = String(data.person ?? stem);
		if (!Array.isArray(data.type)) {
			skipped.push(`${stem}: type is not a list`);
			continue;
		}
		const field = getPrimaryField(data.type, person);
		if (!fieldTags.get(field)?.includes(tag)) {
			skipped.push(`${stem}: ${tag} is not a ${field} tag`);
			continue;
		}
		if (!getMissingClusterField(data.type, person)) {
			skipped.push(`${stem}: already tagged`);
			continue;
		}
		const after = appendTypeTag(before, tag);
		const parsed = after === null ? null : matter(after, {});
		const expected = { ...data, type: [...data.type, tag] };
		if (
			!parsed ||
			!isDeepStrictEqual(parsed.data, expected) ||
			parsed.content !== matter(before, {}).content
		) {
			skipped.push(`${stem}: type field shape not safely editable`);
			continue;
		}
		console.log(
			`${write ? 'tagged' : 'would tag'} ${stem.padEnd(28)} ${field.padEnd(16)} + ${tag}`
		);
		if (write) {
			// Another session may have edited the draft since we read it.
			if ((await fs.readFile(file, 'utf8')) !== before) {
				skipped.push(`${stem}: changed while running, retry`);
				continue;
			}
			await fs.writeFile(file, after);
		}
		changed++;
	}
	for (const line of skipped) console.log(`skipped ${line}`);
	console.log(`\n${changed} ${write ? 'tagged' : 'to tag'}, ${skipped.length} skipped`);
}

if (
	process.argv[1] &&
	path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)
)
	main().catch((error) => {
		console.error(error instanceof Error ? error.message : error);
		process.exitCode = 1;
	});
