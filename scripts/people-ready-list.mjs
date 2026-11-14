#!/usr/bin/env node
// scripts/people-ready-list.mjs
// What the people pipeline is waiting on the owner for. Read-only: no model
// calls, no database, nothing written.
//
//   pnpm people:ready            the list
//   pnpm people:ready -- --json  same, as JSON
//   node scripts/people-ready-list.mjs --count   passed-but-unpublished count only
//
// A profile lands here when it carries the v3 workflow marker and is not
// published. "Passed" means its release still validates against the draft as it
// stands (scripts/lib/blogEditorial.js). Portraits are made by hand; once one is
// exported, prepare-personality-image.sh builds the two files the publisher needs.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { getEditorialPublishStatus, isV3 } from './lib/blogEditorial.js';
import { getPublishImageStatus } from './personBlogParser.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const draftsDir = path.join(root, 'src/blog/people/drafts');
const args = new Set(process.argv.slice(2));

/** What to run for a profile whose release no longer validates. */
const NEXT_STEP = {
	needs_revision: ['--reverify', 'one repair and one check of the draft as it stands'],
	eligible: ['--reverify', 'edited since it passed; re-check it as it stands'],
	insufficient_evidence: ['--refresh', 'research was the problem; rerun with the last findings'],
	pending: ['--resume', 'the run crashed; continue it']
};

const passed = [];
const held = [];
for (const name of (await fs.readdir(draftsDir)).sort()) {
	if (!name.endsWith('.md')) continue;
	const file = path.join(draftsDir, name);
	const data = matter(await fs.readFile(file, 'utf8'), {}).data;
	if (!isV3(data) || data.published === true) continue;
	const person = String(data.person ?? name.slice(0, -3));
	const type = data.enneagram;
	const status = await getEditorialPublishStatus(file, root);
	const runDir = String(data.editorial_workflow?.run_dir ?? '');
	if (!status.valid) {
		const run = await fs
			.readFile(path.join(root, runDir, 'run.json'), 'utf8')
			.then(JSON.parse)
			.catch(() => null);
		held.push({
			person,
			subject: name.slice(0, -3),
			score: data.content_quality?.overall ?? null,
			status: run?.editorial_status ?? 'unknown',
			blockers: (run?.blockers ?? []).length,
			run_dir: runDir
		});
		continue;
	}
	// The publisher's own lookup, so the file name shown is the one it will accept.
	const images = await getPublishImageStatus(/** @type {any} */ ({ enneagram: type, person }));
	passed.push({
		person,
		subject: name.slice(0, -3),
		type,
		score: data.content_quality?.overall ?? null,
		needs_portrait: !images.fullExists || !images.thumbnailExists,
		image_name: path.basename(images.fullPath, '.webp') || person,
		run_dir: runDir
	});
}

if (args.has('--count')) console.log(passed.length);
else if (args.has('--json')) console.log(JSON.stringify({ passed, held }, null, 2));
else {
	const ready = passed.filter((p) => !p.needs_portrait);
	const waiting = passed.filter((p) => p.needs_portrait);
	const score = (/** @type {{score: number | null}} */ p) =>
		p.score === null ? '' : ` · score ${p.score}${p.score < 8.5 ? ' (read it first)' : ''}`;
	console.log(`People profiles waiting on you\n`);
	console.log(`READY TO PUBLISH (${ready.length})`);
	for (const p of ready)
		console.log(
			`  ${p.person} · Type ${p.type}${score(p)}\n    node scripts/personBlogParser.js ${p.subject} --publish`
		);
	console.log(`\nPASSED, NEEDS YOUR PORTRAIT (${waiting.length})`);
	for (const p of waiting)
		console.log(
			`  ${p.person} · Type ${p.type}${score(p)}\n    ./scripts/prepare-personality-image.sh <portrait.png> ${p.type} ${p.image_name} && node scripts/personBlogParser.js ${p.subject} --publish`
		);
	console.log(`\nHELD OR EDITED SINCE THE LAST CHECK (${held.length})`);
	for (const p of held) {
		const [flag, why] =
			NEXT_STEP[/** @type {keyof typeof NEXT_STEP} */ (p.status)] ?? NEXT_STEP.needs_revision;
		console.log(
			`  ${p.person}${p.score === null ? '' : ` · score ${p.score}`} · ${p.status}${p.blockers ? `, ${p.blockers} open item${p.blockers === 1 ? '' : 's'}` : ''}\n    scripts/run-blog-pipeline.sh ${p.subject} ${flag}   (${why})`
		);
	}
	console.log(
		`\n--reverify is two model calls (about 40 minutes). --refresh is a full run. A type change always needs --refresh --expanded-review.`
	);
}
