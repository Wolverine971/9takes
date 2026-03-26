// scripts/normalize-personality-slugs.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import {
	buildPersonalityAnalysisUrl,
	normalizePersonalitySlug,
	normalizePersonalitySuggestions
} from './lib/personalitySeo.js';

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

function arraysEqual(left, right) {
	if (left.length !== right.length) return false;
	return left.every((value, index) => value === right[index]);
}

function summarizeChanges(rows, comments) {
	console.log(
		`${writeMode ? 'Applying' : 'Dry run'}: ${rows.length} people row updates, ${comments.length} comment updates`
	);

	for (const row of rows.slice(0, 10)) {
		console.log(
			`person ${row.id}: ${row.before.person} -> ${row.after.person} | suggestions=${JSON.stringify(row.after.suggestions)} | loc=${row.after.loc}`
		);
	}

	for (const comment of comments.slice(0, 10)) {
		console.log(`comment ${comment.id}: ${comment.before} -> ${comment.after}`);
	}

	if (rows.length > 10 || comments.length > 10) {
		console.log('Output truncated to first 10 rows/comments.');
	}
}

async function fetchPeopleRows() {
	const query = supabase
		.from('blogs_famous_people')
		.select('id, person, suggestions, loc')
		.order('id');
	if (personFilter) {
		query.ilike('person', personFilter);
	}

	const { data, error } = await query;
	if (error) {
		throw error;
	}

	return data ?? [];
}

async function fetchCommentRows() {
	const { data, error } = await supabase
		.from('blog_comments')
		.select('id, blog_link, blog_type')
		.eq('blog_type', 'personality-analysis')
		.order('id');

	if (error) {
		throw error;
	}

	return data ?? [];
}

function buildPeopleUpdates(rows) {
	const collisions = new Map();
	const updates = [];

	for (const row of rows) {
		const normalizedPerson = normalizePersonalitySlug(row.person);
		if (!normalizedPerson) continue;

		const normalizedSuggestions = normalizePersonalitySuggestions(row.suggestions);
		const normalizedLoc = buildPersonalityAnalysisUrl(normalizedPerson);
		const existingCollision = collisions.get(normalizedPerson);
		if (existingCollision && existingCollision !== row.id) {
			throw new Error(
				`Duplicate normalized slug collision detected for "${normalizedPerson}" (${existingCollision} and ${row.id})`
			);
		}
		collisions.set(normalizedPerson, row.id);

		const suggestions = Array.isArray(row.suggestions) ? row.suggestions.map(String) : [];
		const shouldUpdate =
			row.person !== normalizedPerson ||
			row.loc !== normalizedLoc ||
			!arraysEqual(suggestions, normalizedSuggestions);

		if (!shouldUpdate) continue;

		updates.push({
			id: row.id,
			before: {
				person: row.person,
				suggestions,
				loc: row.loc
			},
			after: {
				person: normalizedPerson,
				suggestions: normalizedSuggestions,
				loc: normalizedLoc
			}
		});
	}

	return updates;
}

function buildCommentUpdates(rows, comments) {
	const validPeople = new Set(
		rows.map((row) => normalizePersonalitySlug(row.person)).filter(Boolean)
	);

	return comments
		.map((comment) => {
			const normalizedLink = normalizePersonalitySlug(comment.blog_link);
			if (
				!normalizedLink ||
				!validPeople.has(normalizedLink) ||
				comment.blog_link === normalizedLink
			) {
				return null;
			}

			return {
				id: comment.id,
				before: comment.blog_link,
				after: normalizedLink
			};
		})
		.filter((value) => value !== null);
}

async function applyPeopleUpdates(updates) {
	for (const update of updates) {
		const { error } = await supabase
			.from('blogs_famous_people')
			.update(update.after)
			.eq('id', update.id);

		if (error) {
			throw error;
		}
	}
}

async function applyCommentUpdates(updates) {
	for (const update of updates) {
		const { error } = await supabase
			.from('blog_comments')
			.update({ blog_link: update.after })
			.eq('id', update.id);

		if (error) {
			throw error;
		}
	}
}

async function main() {
	const [peopleRows, commentRows] = await Promise.all([fetchPeopleRows(), fetchCommentRows()]);
	const filteredPeopleRows = personFilter
		? peopleRows.filter((row) => normalizePersonalitySlug(row.person) === personFilter)
		: peopleRows;
	const peopleUpdates = buildPeopleUpdates(filteredPeopleRows);
	const commentUpdates = buildCommentUpdates(filteredPeopleRows, commentRows);

	summarizeChanges(peopleUpdates, commentUpdates);

	if (!writeMode) {
		console.log('Dry run complete. Re-run with --write to apply these updates.');
		return;
	}

	await applyPeopleUpdates(peopleUpdates);
	await applyCommentUpdates(commentUpdates);
	console.log('Supabase personality slug normalization complete.');
}

main().catch((error) => {
	console.error('Failed to normalize personality slugs:', error);
	process.exit(1);
});
