// scripts/seed-quality-grades.js
// One-time script to insert quality grades for the 25 already-reviewed blogs
// into the content_quality JSONB column on blogs_famous_people.
//
// Usage: node scripts/seed-quality-grades.js
// Prerequisites: content_quality JSONB column must exist on blogs_famous_people

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
	process.env.SUPABASE_SERVICE_KEY || process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
	console.error('Missing Supabase environment variables');
	process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Scores from docs/blog-quality-review.md (2026-02-18)
// Format: [person, hook, enneagram, evidence, writing, originality, overall]
// Names must match the `person` column in blogs_famous_people (hyphenated)
const grades = [
	// Tier 1: Gold Standard
	['Peter-Thiel', 10, 10, 9, 9.5, 10, 9.5],
	['Satya-Nadella', 9.5, 10, 9, 9.5, 9, 9.4],
	['Leonardo-DiCaprio', 9.5, 9.5, 9, 9.5, 9, 9.4],
	['Pedro-Pascal', 9.5, 9.5, 9.5, 9.5, 9, 9.3],
	['Travis-Scott', 9, 9.5, 9, 9.5, 9, 9.3],
	['Shaan-Puri', 9.5, 9, 9, 9.5, 9, 9.3],
	['Paris-Hilton', 9, 9.5, 9.5, 9, 9, 9.2],
	['JD-Vance', 9, 9, 9, 9, 9, 9.1],
	['Sam-Parr', 9, 9, 9, 9, 9, 9.1],
	['Tara-Yummy', 9, 9.5, 9, 9, 8.5, 9.0],
	['Kylie-Jenner', 9, 9, 9, 9, 9, 9.0],
	['Mikey-Madison', 9.5, 9, 9, 9, 9, 9.0],

	// Tier 2: Strong
	['Hasan-Piker', 9, 9, 9, 9, 8.5, 8.8],
	['Zohran-Mamdani', 9.5, 9, 8.5, 8.5, 9, 8.8],
	['Michael-B-Jordan', 9, 9, 8.5, 9, 8.5, 8.8],
	['Tom-Cruise', 8.5, 8.5, 9, 9, 8.5, 8.7],
	['Jordan-Peterson', 8.5, 9, 9, 8.5, 8.5, 8.7],
	['Jacob-Elordi', 9, 9, 8.5, 8.5, 8.5, 8.7],
	['Keke-Palmer', 9, 8.5, 8.5, 9, 8.5, 8.7],
	['Andrew-Callaghan', 8, 8.5, 9, 8.5, 8.5, 8.7],
	['Margot-Robbie', 8.5, 8.5, 8.5, 8.5, 8.5, 8.6],
	['Aubrey-Plaza', 8.5, 8.5, 8.5, 8.5, 8.5, 8.6],
	['Blake-Lively', 9.5, 9, 8.5, 9, 8.5, 8.5],
	['Logan-Paul', 8.5, 8.5, 8.5, 8.5, 8.5, 8.5],
	['Malcolm-Gladwell', 8, 8.5, 8.5, 8.5, 8, 8.5]
];

function getLetterGrade(overall) {
	if (overall >= 9.5) return 'A+';
	if (overall >= 9.0) return 'A';
	if (overall >= 8.5) return 'B+';
	if (overall >= 8.0) return 'B';
	if (overall >= 7.0) return 'C';
	if (overall >= 6.0) return 'D';
	return 'F';
}

async function seedGrades() {
	console.log(`Seeding quality grades for ${grades.length} blogs...`);

	let success = 0;
	let failed = 0;

	for (const [person, hook, enneagram, evidence, writing, originality, overall] of grades) {
		const contentQuality = {
			hook,
			enneagram,
			evidence,
			writing,
			originality,
			overall,
			letter: getLetterGrade(overall),
			graded_at: '2026-02-18'
		};

		const { data, error } = await supabase
			.from('blogs_famous_people')
			.update({ content_quality: contentQuality })
			.eq('person', person)
			.select('person');

		if (error) {
			console.error(`  FAIL: ${person} — ${error.message}`);
			failed++;
		} else if (!data || data.length === 0) {
			console.error(`  MISS: ${person} — no matching row in database`);
			failed++;
		} else {
			console.log(`  ${contentQuality.letter} (${overall}) ${person}`);
			success++;
		}
	}

	console.log(`\nDone: ${success} updated, ${failed} failed`);
}

seedGrades();
