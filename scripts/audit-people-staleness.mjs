#!/usr/bin/env node
// scripts/audit-people-staleness.mjs
//
// Scans every published personality profile for claims that go stale on their
// own: current ages written as numbers that no longer match the birth date, and
// future tense about dates that have passed. Detection lives in
// scripts/lib/peopleStaleness.js.
//
//   pnpm audit:people-staleness                  # live DB rows, summary only
//   pnpm audit:people-staleness --write          # + docs/data/staleness/people-staleness.{json,md}
//   pnpm audit:people-staleness --source=drafts  # local drafts (check fixes before syncing)
//   pnpm audit:people-staleness --source=blogs   # published MDsvex posts (date checks only)
//   pnpm audit:people-staleness --person=tom-cruise --min=low
//
// Read-only: never writes to the database.

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { SEVERITY_RANK, scanProfile } from './lib/peopleStaleness.js';

dotenv.config();

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, 'src', 'blog');
const DRAFTS_DIR = path.join(BLOG_DIR, 'people', 'drafts');
const OUT_DIR = path.join(ROOT, 'docs', 'data', 'staleness');

const args = Object.fromEntries(
	process.argv.slice(2).map((arg) => {
		const [key, value] = arg.replace(/^--/, '').split('=');
		return [key, value ?? true];
	})
);
const source = ['drafts', 'blogs'].includes(args.source) ? args.source : 'db';
const reportName = source === 'blogs' ? 'blog-staleness' : 'people-staleness';
const minSeverity = SEVERITY_RANK[args.min] ? args.min : 'medium';
const onlyPerson = typeof args.person === 'string' ? args.person.toLowerCase() : null;
const asOf =
	typeof args['as-of'] === 'string' ? args['as-of'] : new Date().toISOString().slice(0, 10);

function faqSegments(faqs) {
	const list = Array.isArray(faqs) ? faqs : [];
	return list.flatMap((faq, index) => [
		{ where: `faq ${index + 1} question`, text: faq?.question ?? faq?.q ?? '' },
		{ where: `faq ${index + 1} answer`, text: faq?.answer ?? faq?.a ?? '' }
	]);
}

function toProfile(row) {
	return {
		person: row.person,
		birthDate: row.birth_date,
		writtenOn: row.lastmod ?? row.date ?? null,
		segments: [
			{ where: 'description', text: row.description ?? '' },
			{ where: 'content', text: row.content ?? '' },
			...faqSegments(typeof row.faqs === 'string' ? safeJson(row.faqs) : row.faqs)
		]
	};
}

function safeJson(value) {
	try {
		return JSON.parse(value);
	} catch {
		return [];
	}
}

async function loadFromDb() {
	const url = process.env.PUBLIC_SUPABASE_URL;
	const key = process.env.SUPABASE_SERVICE_KEY || process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
	if (!url || !key) throw new Error('PUBLIC_SUPABASE_URL and a Supabase key are required');
	const supabase = createClient(url, key, { auth: { persistSession: false } });
	const rows = [];
	for (let from = 0; ; from += 500) {
		const { data, error } = await supabase
			.from('blogs_famous_people')
			.select('person, description, content, faqs, birth_date, lastmod, date')
			.eq('published', true)
			.order('id', { ascending: true })
			.range(from, from + 499);
		if (error) throw error;
		rows.push(...data);
		if (data.length < 500) break;
	}
	const byPerson = new Map();
	for (const row of rows) if (!byPerson.has(row.person)) byPerson.set(row.person, row);
	return [...byPerson.values()];
}

function loadFromDrafts() {
	return fs
		.readdirSync(DRAFTS_DIR)
		.filter((file) => file.endsWith('.md') && file !== 'person-template.md')
		.map((file) => {
			const { data, content } = matter(fs.readFileSync(path.join(DRAFTS_DIR, file), 'utf8'));
			return { ...data, content, file };
		})
		.filter((row) => row.published === true && row.person);
}

// MDsvex posts have no birth date, so only the time checks apply. The path
// stands in for the person slug in the report.
function loadFromBlogs() {
	const files = [];
	const walk = (dir) => {
		for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
			const full = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				if (!['people', 'drafts'].includes(entry.name)) walk(full);
			} else if (
				/\.md$/.test(entry.name) &&
				!/\.(instagram|twitter|reddit|review)\.md$/.test(entry.name)
			) {
				files.push(full);
			}
		}
	};
	walk(BLOG_DIR);
	return files
		.map((file) => {
			const { data, content } = matter(fs.readFileSync(file, 'utf8'));
			return { ...data, content, person: path.relative(BLOG_DIR, file), faqs: data.faqs };
		})
		.filter((row) => row.published === true);
}

function renderMarkdown(findings, profilesScanned) {
	const byPerson = new Map();
	for (const finding of findings) {
		if (!byPerson.has(finding.person)) byPerson.set(finding.person, []);
		byPerson.get(finding.person).push(finding);
	}
	const people = [...byPerson.entries()].sort(
		(a, b) =>
			b[1].filter((f) => f.severity === 'high').length -
				a[1].filter((f) => f.severity === 'high').length || b[1].length - a[1].length
	);
	const lines = [
		`<!-- docs/data/staleness/${reportName}.md -->`,
		'',
		`# People profile staleness report (${asOf})`,
		'',
		`Generated by \`pnpm audit:people-staleness --write\` from ${source === 'db' ? 'live DB rows' : 'local drafts'}. ${profilesScanned} profiles scanned; ${findings.length} findings at ${minSeverity}+ across ${people.length} profiles.`,
		'',
		'Kinds: `stale_subject_age` (a current age that matched when written and no longer does), `present_age_other` (a present-tense age about someone else, e.g. a child), `possible_stale_age`, `past_event_in_future_tense`, `relative_time_stale`, `as_of_dated`, `age_year_mismatch`. Heuristic: confirm each before editing.',
		''
	];
	for (const [person, list] of people) {
		lines.push(`## ${person}`, '');
		for (const finding of list.sort(
			(a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity]
		)) {
			lines.push(
				`- **${finding.severity}** \`${finding.kind}\` (${finding.where}): ${finding.detail}`,
				`  > ${finding.sentence.replace(/\n/g, ' ')}`
			);
		}
		lines.push('');
	}
	return lines.join('\n');
}

async function main() {
	let rows =
		source === 'drafts'
			? loadFromDrafts()
			: source === 'blogs'
				? loadFromBlogs()
				: await loadFromDb();
	if (onlyPerson) rows = rows.filter((row) => String(row.person).toLowerCase() === onlyPerson);

	const allFindings = rows.flatMap((row) => scanProfile(toProfile(row), { asOf }));
	const findings = allFindings.filter(
		(finding) => SEVERITY_RANK[finding.severity] >= SEVERITY_RANK[minSeverity]
	);
	const missingBirth = rows.filter((row) => !row.birth_date).map((row) => row.person);

	const counts = {};
	for (const finding of findings) {
		const key = `${finding.severity} ${finding.kind}`;
		counts[key] = (counts[key] ?? 0) + 1;
	}
	const affected = new Set(findings.map((finding) => finding.person));

	console.log(
		`Scanned ${rows.length} ${source === 'db' ? 'live profiles' : source === 'blogs' ? 'published posts' : 'published drafts'} as of ${asOf}.`
	);
	console.log(`${findings.length} findings at ${minSeverity}+ across ${affected.size} profiles.`);
	for (const [key, count] of Object.entries(counts).sort((a, b) => b[1] - a[1]))
		console.log(`  ${count}\t${key}`);
	if (missingBirth.length && source !== 'blogs')
		console.log(`No birth_date (age checks skipped): ${missingBirth.join(', ')}`);

	if (args.write) {
		fs.mkdirSync(OUT_DIR, { recursive: true });
		const json = {
			generatedAt: new Date().toISOString(),
			asOf,
			source,
			minSeverity,
			profilesScanned: rows.length,
			findings
		};
		fs.writeFileSync(
			path.join(OUT_DIR, `${reportName}.json`),
			`${JSON.stringify(json, null, '\t')}\n`
		);
		fs.writeFileSync(
			path.join(OUT_DIR, `${reportName}.md`),
			`${renderMarkdown(findings, rows.length)}\n`
		);
		console.log(`Wrote ${path.relative(ROOT, OUT_DIR)}/${reportName}.{json,md}`);
	} else if (onlyPerson || args.verbose) {
		for (const finding of findings) {
			console.log(
				`\n[${finding.severity}] ${finding.person} ${finding.kind} (${finding.where})\n  ${finding.detail}\n  > ${finding.sentence}`
			);
		}
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
