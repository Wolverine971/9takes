// scripts/normalize-db-personality-links.js
//
// Scans blogs_famous_people.content for inline links pointing to
// /personality-analysis/<CapitalCase-or-mixed-case> and rewrites them to
// the lowercase canonical slug. Use --write to persist; default is dry run.
//
// Usage:
//   node scripts/normalize-db-personality-links.js              # dry run
//   node scripts/normalize-db-personality-links.js --write      # apply
//   node scripts/normalize-db-personality-links.js Adele        # one row
//   node scripts/normalize-db-personality-links.js --write Adele

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { normalizePersonalitySlug } from './lib/personalitySeo.js';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
	console.error('Missing SUPABASE_URL/PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY');
	process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const args = process.argv.slice(2);
const writeMode = args.includes('--write');
const personFilterArg = args.find((arg) => !arg.startsWith('--'));
const personFilter = normalizePersonalitySlug(personFilterArg);

const LINK_PATTERN = /(https:\/\/9takes\.com)?(\/personality-analysis\/)([A-Za-z0-9-]+)/g;

async function main() {
	const query = supabase.from('blogs_famous_people').select('id, person, content').order('id');
	if (personFilter) query.ilike('person', personFilter);

	const { data, error } = await query;
	if (error) throw error;

	const rows = data ?? [];
	let changedRows = 0;
	let totalReplacements = 0;
	const samples = [];

	for (const row of rows) {
		if (typeof row.content !== 'string' || row.content.length === 0) continue;

		let replacements = 0;
		const next = row.content.replace(LINK_PATTERN, (match, origin = '', prefix, slug) => {
			const normalizedSlug = normalizePersonalitySlug(slug);
			if (normalizedSlug === slug) return match;
			replacements += 1;
			if (samples.length < 12) {
				samples.push(`${row.person}: ${slug} -> ${normalizedSlug}`);
			}
			return `${origin ?? ''}${prefix}${normalizedSlug}`;
		});

		if (replacements === 0) continue;

		changedRows += 1;
		totalReplacements += replacements;

		if (writeMode) {
			const { error: updateError } = await supabase
				.from('blogs_famous_people')
				.update({ content: next })
				.eq('id', row.id);
			if (updateError) {
				console.error(`Error updating ${row.person} (id=${row.id}):`, updateError.message);
				continue;
			}
		}

		console.log(`${writeMode ? 'updated' : 'would update'} ${row.person} (${replacements} links)`);
	}

	console.log('---');
	console.log(
		`${writeMode ? 'Applied' : 'Dry run'}: ${totalReplacements} link rewrites across ${changedRows} rows (scanned ${rows.length})`
	);
	if (samples.length) {
		console.log('Sample replacements:');
		for (const line of samples) console.log(`  ${line}`);
	}
}

main().catch((err) => {
	console.error('Failed to normalize DB personality links:', err);
	process.exitCode = 1;
});
