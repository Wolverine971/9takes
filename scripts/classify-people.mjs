// scripts/classify-people.mjs
/**
 * Jev labels people for the v3 people taxonomy (src/lib/data/peopleTaxonomy.json).
 *
 *   pnpm people:classify                 # list published people with no label yet
 *   pnpm people:classify -- --write      # label them with Jev and save
 *   pnpm people:classify -- <slug> ... --write   # (re)label specific people
 *   pnpm people:classify -- --check      # fail if any published person is unlabeled (CI/gate)
 *
 * New people are labeled automatically by `pnpm gen:famous-types`, which every publish path
 * runs; this command is for relabeling and for checking. Labeling lives in
 * scripts/lib/peopleClassifier.mjs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizePersonalitySlug } from './lib/personalitySeo.js';
import { labelPeople, readClassifications } from './lib/peopleClassifier.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const ROSTER = path.join(root, 'src/lib/generated/personalitySimilaritySnapshot.json');

const args = process.argv.slice(2);
const write = args.includes('--write');
const check = args.includes('--check');
const named = args.filter((arg) => !arg.startsWith('--')).map(normalizePersonalitySlug);

async function main() {
	const labels = readClassifications();
	const roster = JSON.parse(fs.readFileSync(ROSTER, 'utf8')).map((row) =>
		normalizePersonalitySlug(row.person)
	);
	const missing = roster.filter((slug) => !Object.hasOwn(labels, slug));
	const targets = named.length ? named : missing;

	if (check) {
		if (missing.length) {
			console.error(
				`${missing.length} published people have no taxonomy label:\n  ${missing.join('\n  ')}`
			);
			console.error('Run: pnpm people:classify -- --write');
			process.exit(1);
		}
		console.log(`All ${roster.length} published people are labeled.`);
		return;
	}
	if (!targets.length) {
		console.log(`All ${roster.length} published people are labeled.`);
		return;
	}
	if (!write) {
		console.log(`${targets.length} to label (dry run; add --write):\n  ${targets.join('\n  ')}`);
		return;
	}

	const { cost } = await labelPeople(targets);
	console.log(`Saved ${targets.length}. Jev cost $${cost.toFixed(4)}.`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
