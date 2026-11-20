#!/usr/bin/env node
// scripts/publish-people-daily.mjs
// Dry-run by default. --apply releases at most two new people per New York day.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import dotenv from 'dotenv';
import matter from 'gray-matter';
import { createClient } from '@supabase/supabase-js';
import { readPublishCandidate, shouldProcessMarkdownFile } from './personBlogParser.js';
import {
	dailyReleaseState,
	rankPublishCandidates,
	validNineTakes,
	pageIncludesQuestion
} from './lib/dailyPeoplePublish.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
dotenv.config({ quiet: true });
dotenv.config({ path: '.env.local', quiet: true });
const apply = process.argv.includes('--apply');
const skipFinalize = process.argv.includes('--skip-finalize');
const origin = 'https://9takes.com';
const logDir = path.join(root, 'logs/blog-automation');
const lockDir = path.join(logDir, 'daily-publisher.lock');
const policy = JSON.parse(await fs.readFile('docs/blog-automation/daily-publisher.json', 'utf8'));
const supabase = createClient(
	process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_KEY,
	{ auth: { persistSession: false, autoRefreshToken: false } }
);
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const run = (script, args = []) =>
	execFileSync(process.execPath, [script, ...args], {
		cwd: root,
		env: process.env,
		stdio: 'inherit',
		timeout: 15 * 60 * 1000
	});
const report = {
	startedAt: new Date().toISOString(),
	mode: apply ? 'apply' : 'dry-run',
	selected: [],
	published: [],
	blocked: [],
	errors: []
};
let locked = false;

async function queryResult(query) {
	const { data, error } = await query;
	if (error) throw new Error(error.message);
	return data;
}
async function releaseState() {
	const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
	const events = await queryResult(
		supabase
			.from('content_release_events')
			.select('content_type,content_slug,event_type,event_at')
			.eq('content_type', 'people')
			.gte('event_at', since)
	);
	// A failed event insert must not leave an already released person uncounted.
	const firstPublications = await queryResult(
		supabase
			.from('blogs_famous_people')
			.select('person,first_published_at')
			.gte('first_published_at', since)
	);
	for (const row of firstPublications)
		events.push({
			content_type: 'people',
			content_slug: row.person,
			event_type: 'published',
			event_at: row.first_published_at
		});
	return dailyReleaseState(events);
}
async function lock() {
	await fs.mkdir(logDir, { recursive: true });
	try {
		await fs.mkdir(lockDir);
	} catch (error) {
		if (error.code !== 'EEXIST') throw error;
		const old = await fs
			.readFile(path.join(lockDir, 'owner.json'), 'utf8')
			.then(JSON.parse)
			.catch(() => null);
		if (!old?.pid)
			throw new Error('Publisher lock exists without owner metadata; inspect it before retrying', {
				cause: error
			});
		let alive = true;
		try {
			process.kill(old.pid, 0);
		} catch (e) {
			if (e.code === 'ESRCH') alive = false;
			else throw e;
		}
		if (alive) throw new Error(`Publisher already running (pid ${old.pid})`, { cause: error });
		await fs.rm(lockDir, { recursive: true });
		await fs.mkdir(lockDir);
	}
	locked = true;
	await fs.writeFile(
		path.join(lockDir, 'owner.json'),
		JSON.stringify({ pid: process.pid, startedAt: report.startedAt })
	);
}
async function portraitRights() {
	const result = new Map();
	const base = 'docs/content-analysis/portrait-sources';
	for (const file of (await fs.readdir(base)).filter((f) => f.endsWith('.json')).sort()) {
		const record = JSON.parse(await fs.readFile(path.join(base, file), 'utf8'));
		for (const p of record.portraits || []) {
			const slug = String(p.filename || p.slug).toLowerCase();
			if (p.source?.publicationRightsPending === true)
				result.set(slug, 'portrait_publication_rights_pending');
			else if (/CC BY|public domain/i.test(p.source?.license || '')) result.set(slug, null);
		}
	}
	return result;
}
async function publicImages(candidate) {
	for (const file of [candidate.imageStatus.fullPath, candidate.imageStatus.thumbnailPath]) {
		const local = await fs.readFile(file);
		const url = new URL(
			path.relative(path.join(root, 'static'), file).split(path.sep).join('/'),
			`${origin}/`
		);
		const response = await fetch(url, {
			signal: AbortSignal.timeout(20000),
			headers: { 'Cache-Control': 'no-cache' }
		});
		if (!response.ok || !response.headers.get('content-type')?.startsWith('image/'))
			throw new Error(`portrait_not_deployed:${url.pathname}:${response.status}`);
		if (hash(Buffer.from(await response.arrayBuffer())) !== hash(local))
			throw new Error(`portrait_deployment_hash_mismatch:${url.pathname}`);
	}
}
async function chorusReady(slug) {
	const row = await queryResult(
		supabase
			.from('blogs_famous_people')
			.select('chorus_question,chorus_question_url')
			.eq('person', slug)
			.single()
	);
	if (!row.chorus_question?.trim() || !row.chorus_question_url) return false;
	const question = await queryResult(
		supabase
			.from('questions')
			.select('id,flagged,removed,question_formatted,data')
			.eq('url', row.chorus_question_url)
			.maybeSingle()
	);
	if (
		!question ||
		question.flagged ||
		question.removed ||
		question.data?.editorial_status !== 'approved'
	)
		return false;
	if (question.question_formatted !== row.chorus_question) return false;
	if (policy.approvedQuestions?.[slug] && row.chorus_question !== policy.approvedQuestions[slug])
		return false;
	const takes = await queryResult(
		supabase
			.from('nine_takes')
			.select('takes,situation')
			.eq('subject_type', 'personality-analysis')
			.eq('subject_slug', slug)
			.maybeSingle()
	);
	if (!validNineTakes(takes) || takes.situation !== row.chorus_question) return false;
	const comments = await queryResult(
		supabase.from('comments_ai').select('enneagram_type,comment').eq('question_id', question.id)
	);
	return validNineTakes({
		takes: comments.map((c) => ({ type: Number(c.enneagram_type), take: c.comment }))
	});
}
async function prepareChorus(slug) {
	if (await chorusReady(slug)) return;
	const question = policy.approvedQuestions?.[slug];
	if (!question && !policy.automatedQuestionApproval)
		throw new Error(`chorus_approval_missing:${slug}`);
	run('scripts/generate-chorus.mjs', [
		`--slug=${slug}`,
		'--include-unpublished',
		'--publish',
		question ? `--question=${question}` : '--auto-approve'
	]);
	if (!(await chorusReady(slug))) throw new Error(`chorus_verification_failed:${slug}`);
}
async function verifyPublicPage(slug) {
	const row = await queryResult(
		supabase
			.from('blogs_famous_people')
			.select('published,chorus_question,chorus_question_url')
			.eq('person', slug)
			.single()
	);
	if (!row.published || !(await chorusReady(slug)))
		throw new Error(`incomplete_published_profile:${slug}`);
	const response = await fetch(`${origin}/personality-analysis/${slug}`, {
		signal: AbortSignal.timeout(30000)
	});
	const html = await response.text();
	// The give-first Chorus shows the question inline; its outbound link is gated
	// until the reader answers. Verify the public question text and backing page.
	if (!response.ok || !pageIncludesQuestion(html, row.chorus_question))
		throw new Error(`public_page_verification_failed:${slug}:${response.status}`);
	const questionPage = await fetch(`${origin}/questions/${row.chorus_question_url}`, {
		signal: AbortSignal.timeout(30000)
	});
	if (!questionPage.ok || !pageIncludesQuestion(await questionPage.text(), row.chorus_question))
		throw new Error(`public_question_verification_failed:${slug}:${questionPage.status}`);
}
async function finalize(slugs) {
	if (!slugs.length || skipFinalize) return;
	// Do not format unrelated in-progress files in this shared checkout.
	run('scripts/gen-all.js', ['--generators-only']);
	run('scripts/revalidate-personality.mjs', slugs);
	for (const slug of slugs) await verifyPublicPage(slug);
}
async function main() {
	if (apply) await lock();
	const initial = await releaseState();
	report.day = initial.day;
	report.alreadyPublishedToday = initial.published;
	report.remainingSlots = initial.remaining;
	if (!initial.remaining) {
		if (apply) await finalize(initial.published);
		console.log(`Daily quota complete: ${initial.published.join(', ')}`);
		return;
	}
	const rows = await queryResult(
		supabase.from('blogs_famous_people').select('person,published,first_published_at,published_at')
	);
	const live = new Map(rows.map((r) => [r.person.toLowerCase(), r]));
	const rights = await portraitRights();
	const candidates = [];
	for (const filename of (await fs.readdir('src/blog/people/drafts')).sort()) {
		const file = path.join('src/blog/people/drafts', filename);
		if (!filename.endsWith('.md') || !shouldProcessMarkdownFile(file)) continue;
		const data = matter(await fs.readFile(file, 'utf8')).data;
		const slug = String(data.person || '').toLowerCase();
		const row = live.get(slug);
		if (!slug || row?.published) continue;
		try {
			const candidate = await readPublishCandidate(file);
			candidate.dbPublished = false;
			if (!row) candidate.blockers.push('missing_database_draft');
			// Re-publications have a different editorial meaning and do not fill daily slots.
			if (row?.first_published_at || row?.published_at)
				candidate.blockers.push('previously_published_requires_explicit_republish');
			if (rights.get(slug)) candidate.blockers.push(rights.get(slug));
			candidates.push(candidate);
		} catch (e) {
			report.blocked.push({ person: slug, blockers: [e.message] });
		}
	}
	for (const c of candidates.filter((c) => c.blockers.length))
		report.blocked.push({ person: c.entry.person, blockers: c.blockers });
	const ready = rankPublishCandidates(candidates);
	for (const candidate of ready) {
		const state = await releaseState();
		if (!state.remaining || report.selected.length >= initial.remaining) break;
		const slug = candidate.entry.person;
		try {
			await publicImages(candidate);
		} catch (e) {
			report.blocked.push({ person: slug, blockers: [e.message] });
			continue;
		}
		report.selected.push({
			person: slug,
			score: candidate.qualityOverall,
			file: candidate.filePath
		});
		if (!apply) continue;
		// Prepare and verify the complete discussion before making the profile public.
		await prepareChorus(slug);
		if (!(await releaseState()).remaining) break;
		const current = await queryResult(
			supabase.from('blogs_famous_people').select('published').eq('person', slug).maybeSingle()
		);
		if (current?.published)
			throw new Error(`Profile was published concurrently; rerun quota check: ${slug}`);
		run('scripts/personBlogParser.js', [slug, '--publish', '--skip-gen-all']);
		report.published.push(slug);
	}
	if (apply) {
		const final = await releaseState();
		await finalize(final.published);
		if (final.remaining)
			throw new Error(
				`Only ${2 - final.remaining}/2 profiles could be released today; remaining drafts are blocked`
			);
	}
	console.log(
		JSON.stringify(
			{
				day: report.day,
				mode: report.mode,
				alreadyPublishedToday: report.alreadyPublishedToday,
				selected: report.selected,
				published: report.published,
				blockedCandidates: report.blocked.length
			},
			null,
			2
		)
	);
}
try {
	await main();
} catch (error) {
	report.errors.push(error.message);
	console.error(error.message);
	process.exitCode = 1;
} finally {
	report.finishedAt = new Date().toISOString();
	await fs.mkdir(logDir, { recursive: true });
	const stamp = report.startedAt.replaceAll(':', '-');
	await fs.writeFile(
		path.join(logDir, `daily-publish-${stamp}.json`),
		JSON.stringify(report, null, 2) + '\n'
	);
	if (locked) await fs.rm(lockDir, { recursive: true });
}
