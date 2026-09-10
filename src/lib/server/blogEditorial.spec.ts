// src/lib/server/blogEditorial.spec.ts
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import matter from 'gray-matter';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	assessEditorial,
	cleanReaderCopy,
	calculateQuality,
	checkDraft,
	editorialHash,
	evidenceSchema,
	getEditorialPublishStatus,
	requiredRoles,
	sha256,
	validateEvidence
} from '../../../scripts/lib/blogEditorial.js';
import { getPerspectivePublishStatus } from '../../../scripts/lib/perspectiveReview.js';
import * as perspectiveReview from '../../../scripts/lib/perspectiveReview.js';
import {
	readPublishCandidate,
	assertPerspectiveGateForUpdate
} from '../../../scripts/personBlogParser.js';
import { parseArgs, runPipeline, executeClaude } from '../../../scripts/run-blog-pipeline.mjs';
import { informativePhraseFeature, isArgumentToken } from '../../../scripts/lib/blogSimilarity.js';

const roots: string[] = [];
afterEach(async () => {
	await Promise.all(roots.splice(0).map((root) => fs.rm(root, { recursive: true, force: true })));
});
const risks = {
	sensitive_allegations: false,
	contested_typing: false,
	historical_source_uncertainty: false,
	major_thesis_change: false
};
const passage = 'He declined the offer and explained his reasons in the recorded interview.';
const second = 'His colleague described a similar choice made several years earlier.';
function draft() {
	return matter.stringify(
		`## What is Example Person's personality type?\n\nExample Person is best understood as an Enneagram Type 5, with meaningful counterevidence.\n\n${passage}\n\n## A consequential choice\n\n${second}\n\n## The strongest alternative\n\n` +
			'This is synthetic fixture prose for offline pipeline contract tests. '.repeat(125) +
			'\n\n## What remains unexplained\n\nA limitation remains.',
		{
			title: 'Example Person: a supported psychological portrait',
			meta_title: 'Example Person: an Enneagram Type 5 portrait',
			persona_title: 'The careful observer',
			description:
				'A psychological profile of Example Person explores consequential choices, independent testimony, and the limits of an Enneagram Type 5 reading.',
			author: 'DJ Wayne',
			date: '2026-09-09',
			lastmod: '2026-09-09',
			published: false,
			loc: 'https://9takes.com/personality-analysis/example-person',
			changefreq: 'monthly',
			priority: '0.6',
			enneagram: 5,
			type: ['author'],
			person: 'Example-Person',
			suggestions: ['Another-Person'],
			production_pretext: { status: 'draft', blockers: [] },
			faqs: [
				{ question: 'What is the type?', answer: 'Type 5 is the leading hypothesis.' },
				{ question: 'What is uncertain?', answer: 'The motivation remains an inference.' }
			]
		}
	);
}
function evidence(): any {
	return evidenceSchema.parse({
		schema_version: 3,
		subject: 'Example-Person',
		status: 'ready',
		research_tasks: [],
		accuracy_checked_at: '2026-09-09',
		risks,
		sources: ['S1', 'S2'].map((id) => ({
			id,
			url: `https://example.test/${id}`,
			title: 'Synthetic source',
			speaker: 'Fixture speaker',
			date: '2020',
			locator: '00:30',
			excerpt: passage,
			context: 'Full interview context',
			kind: 'primary',
			access: 'opened'
		})),
		claims: [passage, second].map((p, i) => ({
			id: `C${i + 1}`,
			claim: p,
			passage: p,
			class: 'self_report',
			source_ids: [`S${i + 1}`],
			inference: 'A possible motivational pattern.',
			alternative: 'Professional incentives.',
			durability: 'stable',
			review_trigger: ''
		})),
		type_hypothesis: {
			type: 5,
			confidence: 'medium',
			for_claim_ids: ['C1', 'C2'],
			against: 'He seeks recognition in some settings.',
			alternative_type: 3,
			alternative_case: 'Achievement could explain the choices.',
			discriminator: 'A repeated costly preference for understanding over recognition.',
			unexplained: 'Variation across relationships.'
		}
	});
}
function review(role: string, md = draft(), ev = evidence()): any {
	return {
		schema_version: 3,
		role,
		content_sha256: editorialHash(md),
		evidence_sha256: sha256(JSON.stringify(ev)),
		risks,
		findings: [
			{
				id: `${role}-1`,
				severity: 'major',
				passage,
				problem: 'Test the context.',
				acceptance_test: 'Confirm surrounding context.'
			}
		],
		protected_passages: [{ passage: second, reason: 'The concrete comparison helps.' }],
		assessment: 'Synthetic independent review.'
	};
}
function resolution(reviews: any[]): any {
	return {
		schema_version: 3,
		decisions: reviews.flatMap((r) =>
			r.findings.map((f: any) => ({
				finding_id: f.id,
				action: 'fixed',
				reason: 'Checked context.'
			}))
		),
		protected_passages: [
			{ passage: second, action: 'kept', reason: 'Retained the concrete detail.' }
		],
		prior_blockers: []
	};
}
function verification(md: string, ev: any, reviews: any[]): any {
	return {
		schema_version: 3,
		content_sha256: editorialHash(md),
		evidence_sha256: sha256(JSON.stringify(ev)),
		status: 'pass',
		findings: [],
		research_tasks: [],
		claim_checks: ev.claims.map((c: any) => ({
			claim_id: c.id,
			verdict: 'supported',
			reason: 'Synthetic test attestation.'
		})),
		source_checks: ev.sources.map((s: any) => ({
			source_id: s.id,
			opened: true,
			context_matches: true,
			locator: s.locator
		})),
		decision_checks: reviews.flatMap((r) =>
			r.findings.map((f: any) => ({
				finding_id: f.id,
				accepted: true,
				reason: 'Acceptance test passed.'
			}))
		),
		prior_blocker_checks: [],
		protected_checks: [{ passage: second, preserved: true, reason: 'Present and meaningful.' }],
		coverage_complete: true,
		metadata_consistent: true,
		alternative_type_addressed: true,
		five_year_test_passed: true,
		scores: Object.fromEntries(
			[
				'evidence',
				'enneagram',
				'originality',
				'writing',
				'durability',
				'hook',
				'discoverability'
			].map((key) => [key, { score: 9, reason: 'Synthetic calibration score.', passage }])
		)
	};
}
function bundle(): any {
	const markdown = draft(),
		ev = evidence(),
		reviews = ['evidence', 'reader'].map((r) => review(r, markdown, ev));
	return {
		subject: 'Example-Person',
		markdown,
		evidence: ev,
		reviews,
		resolution: resolution(reviews),
		verification: verification(markdown, ev, reviews)
	};
}
async function workspace() {
	const root = await fs.mkdtemp(path.join(os.tmpdir(), 'blog-v3-'));
	roots.push(root);
	await fs.mkdir(path.join(root, 'src/blog/people/drafts'), { recursive: true });
	for (const file of [
		'scripts/run-blog-pipeline.mjs',
		'scripts/lib/blogEditorial.js',
		'docs/writing-system/people-profile-standard.md',
		...['research', 'draft', 'review', 'edit', 'verify'].map(
			(stage) => `.claude/commands/blog_${stage}_people_v3.md`
		)
	]) {
		await fs.mkdir(path.dirname(path.join(root, file)), { recursive: true });
		await fs.copyFile(path.resolve(file), path.join(root, file));
	}
	return root;
}
function fakeExecutor(events: string[], mutate: (id: string, record: any) => void = () => {}) {
	return async (requestFile: string) => {
		const request = JSON.parse(await fs.readFile(requestFile, 'utf8'));
		const id = path.basename(requestFile, '.request.json');
		events.push(id);
		const read = async (file: string) => JSON.parse(await fs.readFile(file, 'utf8'));
		const md = request.inputs.draft ? await fs.readFile(request.inputs.draft, 'utf8') : draft();
		const ev = request.inputs.evidence ? await read(request.inputs.evidence) : evidence();
		const reviews = await Promise.all(
			Object.entries(request.inputs)
				.filter(([key]) => key.startsWith('review-'))
				.map(([, file]) => read(String(file)))
		);
		for (const [name, file] of Object.entries(request.outputs)) {
			let record: any;
			if (name.endsWith('.md')) {
				await fs.writeFile(String(file), md);
				continue;
			}
			if (name.startsWith('evidence')) record = structuredClone(ev);
			else if (name.startsWith('review')) record = review(request.role, md, ev);
			else if (name.startsWith('resolution')) record = resolution(reviews);
			else record = verification(md, ev, reviews);
			mutate(id, record);
			await fs.writeFile(String(file), JSON.stringify(record, null, 2) + '\n');
		}
	};
}

describe('shared v3 editorial eligibility', () => {
	it('cleans grading context without mutating cached frontmatter or the baseline', () => {
		const md = matter.stringify('An original passage. <!-- QUALITY: 10/10 -->', {
			title: 'Original',
			content_quality: { overall: 10 }
		});
		const cached = matter(md);
		const clean = cleanReaderCopy(md);
		expect(clean).not.toContain('content_quality');
		expect(clean).not.toContain('10/10');
		expect(cached.data.content_quality.overall).toBe(10);
		expect(cleanReaderCopy(md)).toBe(clean);
	});
	it('hashes all editorial metadata but ignores publication bookkeeping and grades', () => {
		const md = draft(),
			parsed = matter(md);
		const hash = editorialHash(md);
		parsed.data.date = '2027-01-01';
		parsed.data.lastmod = '2027-01-01';
		parsed.data.published = true;
		parsed.data.content_quality = { overall: 1 };
		expect(editorialHash(matter.stringify(parsed.content, parsed.data))).toBe(hash);
		for (const [key, value] of [
			['birth_date', '1900-01-01'],
			['citations', ['https://other.test']],
			['faqs', []]
		]) {
			expect(
				editorialHash(matter.stringify(parsed.content, { ...parsed.data, [String(key)]: value }))
			).not.toBe(hash);
		}
	});
	it('passes a complete independently verified contract without mandatory furniture', () => {
		expect(checkDraft(draft()).blockers).toEqual([]);
		expect(assessEditorial(bundle())).toMatchObject({
			eligible: true,
			quality: { overall: 9, rubric_version: 3 }
		});
	});
	it('finds metadata evidence after YAML folds and quotes an FAQ answer', () => {
		const parsed = matter(draft(), {}),
			ev = evidence();
		const answer =
			'He described the choice as "necessary" during the interview, then explained how his earlier decisions shaped that preference over several years.';
		parsed.data.faqs[0].answer = answer;
		ev.claims[0].passage = answer;
		expect(() =>
			validateEvidence(ev, 'Example-Person', matter.stringify(parsed.content, parsed.data))
		).not.toThrow();
	});
	it.each([
		'unsupported claim',
		'missing source check',
		'unresolved review',
		'lost protected passage',
		'metadata disagreement',
		'weak durability',
		'stale evidence',
		'creator blocker'
	])('holds despite high overall scores: %s', (issue) => {
		const b = bundle();
		if (issue === 'unsupported claim') b.verification.claim_checks[0].verdict = 'unsupported';
		if (issue === 'missing source check') b.verification.source_checks.pop();
		if (issue === 'unresolved review') b.verification.decision_checks[0].accepted = false;
		if (issue === 'lost protected passage') b.verification.protected_checks[0].preserved = false;
		if (issue === 'metadata disagreement') b.verification.metadata_consistent = false;
		if (issue === 'weak durability') b.verification.scores.durability.score = 7;
		if (issue === 'stale evidence') b.evidence.sources[0].excerpt += ' Changed.';
		if (issue === 'creator blocker')
			b.baseline = matter.stringify('Old draft', {
				production_pretext: { status: 'blocked', blockers: ['Missing testimony'] }
			});
		expect(assessEditorial(b).eligible).toBe(false);
	});
	it('cannot turn low-confidence research or an unresolved type alternative into ready evidence', () => {
		const ev = evidence();
		ev.type_hypothesis.confidence = 'low';
		expect(() => validateEvidence(ev, 'Example-Person')).toThrow('differentiated');
		ev.status = 'insufficient_evidence';
		ev.research_tasks = ['Find a discriminating interview.'];
		expect(validateEvidence(ev, 'Example-Person').status).toBe('insufficient_evidence');
	});
	it('requires independent acceptance before clearing an inherited blocker', () => {
		const b = bundle();
		b.baseline = matter.stringify('Old draft', {
			production_pretext: { status: 'blocked', blockers: ['Missing testimony'] }
		});
		b.resolution.prior_blockers = [
			{ blocker: 'Missing testimony', resolution: 'Interview located and checked.' }
		];
		expect(assessEditorial(b).eligible).toBe(false);
		b.verification.prior_blocker_checks = [
			{ blocker: 'Missing testimony', accepted: true, reason: 'Verified the new interview.' }
		];
		expect(assessEditorial(b).eligible).toBe(true);
	});
	it('requires the expanded jury for evidence or reviewer escalation', () => {
		const b = bundle();
		b.reviews[0].risks = { ...risks, contested_typing: true };
		expect(requiredRoles(b.evidence, b.reviews)).toHaveLength(6);
		expect(assessEditorial(b).blockers).toContain('missing_review:enneagram');
	});
	it('holds a type thesis changed after the frozen review', () => {
		const b = bundle();
		b.reviewedMarkdown = b.markdown;
		b.reviewedEvidence = structuredClone(b.evidence);
		const parsed = matter(b.markdown, {});
		parsed.data.enneagram = 6;
		b.markdown = matter.stringify(parsed.content, parsed.data);
		b.evidence.type_hypothesis.type = 6;
		b.verification = verification(b.markdown, b.evidence, b.reviews);
		expect(assessEditorial(b).blockers).toContain(
			'review_scope_changed:type_thesis:run --refresh --expanded-review'
		);
	});
	it('calculates editorial weights without incorporating discoverability', () => {
		const v = bundle().verification;
		v.scores.hook.score = 5;
		v.scores.discoverability.score = 1;
		expect(calculateQuality(v).overall).toBe(8.8);
	});
});

describe('offline pipeline execution and checkpoint safety', () => {
	it('uses the same release decision for publication and metadata-only live updates', async () => {
		const root = await workspace();
		await runPipeline(parseArgs(['Example-Person']), { root, execute: fakeExecutor([]) });
		const file = path.join(root, 'src/blog/people/drafts/Example-Person.md');
		const gate = vi
			.spyOn(perspectiveReview, 'getPerspectivePublishStatus')
			.mockImplementation((file) => getEditorialPublishStatus(file, root));
		try {
			const candidate = await readPublishCandidate(file);
			expect(candidate.blockers).toEqual(['missing_full_image', 'missing_thumbnail_image']);
			expect(candidate.entry.content_quality).toMatchObject({ durability: 9, rubric_version: 3 });
			const parsed = matter(await fs.readFile(file, 'utf8'), {});
			parsed.data.birth_date = '1900-01-01';
			await fs.writeFile(file, matter.stringify(parsed.content, parsed.data));
			await expect(
				assertPerspectiveGateForUpdate(
					{ person: 'example-person', diff: [{ field: 'birth_date' }] } as any,
					candidate.entry,
					{ published: true }
				)
			).rejects.toThrow('gate refused update');
		} finally {
			gate.mockRestore();
		}
	});
	it('runs six calls, produces a valid release, resumes with zero model calls, and stales on metadata edits', async () => {
		const root = await workspace(),
			events: string[] = [];
		const run = await runPipeline(parseArgs(['Example-Person']), {
			root,
			execute: fakeExecutor(events)
		});
		expect(run.exitCode).toBe(0);
		expect(events).toHaveLength(6);
		const file = path.join(root, 'src/blog/people/drafts/Example-Person.md');
		expect((await getPerspectivePublishStatus(file, root)).valid).toBe(true);
		events.length = 0;
		await runPipeline(parseArgs(['Example-Person', '--resume']), {
			root,
			execute: fakeExecutor(events)
		});
		expect(events).toEqual([]);
		const parsed = matter(await fs.readFile(file, 'utf8'));
		parsed.data.birth_date = '1970-01-01';
		await fs.writeFile(file, matter.stringify(parsed.content, parsed.data));
		expect((await getEditorialPublishStatus(file, root)).valid).toBe(false);
		await expect(
			runPipeline(parseArgs(['Example-Person', '--resume']), {
				root,
				execute: fakeExecutor(events)
			})
		).rejects.toThrow('changed outside');
	});
	it('stops on a failed dependency, releases its lock, then resumes the valid research checkpoint', async () => {
		const root = await workspace(),
			events: string[] = [];
		const execute = fakeExecutor(events, (id) => {
			if (id === 'draft') throw new Error('Quota exhausted');
		});
		await expect(runPipeline(parseArgs(['Example-Person']), { root, execute })).rejects.toThrow(
			'Quota exhausted'
		);
		expect(events).toEqual(['research', 'draft']);
		await expect(
			fs.access(path.join(root, 'docs/content-analysis/pipeline-logs/.pipeline.lock'))
		).rejects.toThrow();
		events.length = 0;
		const run = await runPipeline(parseArgs(['example person', '--resume']), {
			root,
			execute: fakeExecutor(events)
		});
		expect(run.exitCode).toBe(0);
		expect(events[0]).toBe('draft');
	});
	it('holds insufficient research without writing a draft or starting dependent stages', async () => {
		const root = await workspace(),
			events: string[] = [];
		const execute = fakeExecutor(events, (id, record) => {
			if (id === 'research') {
				record.status = 'insufficient_evidence';
				record.research_tasks = ['Locate first-person testimony.'];
			}
		});
		const run = await runPipeline(parseArgs(['Example-Person']), { root, execute });
		expect(run.exitCode).toBe(2);
		expect(run.state.editorial_status).toBe('insufficient_evidence');
		expect(events).toEqual(['research']);
		await expect(
			fs.access(path.join(root, 'src/blog/people/drafts/Example-Person.md'))
		).rejects.toThrow();
	});
	it('runs the expanded jury automatically and refuses release after one unsuccessful repair', async () => {
		const root = await workspace(),
			events: string[] = [];
		const execute = fakeExecutor(events, (id, record) => {
			if (id === 'research') record.risks = { ...risks, sensitive_allegations: true };
			if (id.startsWith('verify')) {
				record.status = 'revise';
				record.metadata_consistent = false;
			}
		});
		const run = await runPipeline(parseArgs(['Example-Person']), { root, execute });
		expect(run.exitCode).toBe(2);
		expect(events.filter((e) => e.startsWith('review-'))).toHaveLength(6);
		expect(events.filter((e) => e === 'repair')).toHaveLength(1);
		expect(events.filter((e) => e.startsWith('verify'))).toHaveLength(2);
		await expect(fs.access(path.join(run.dir, 'release.json'))).rejects.toThrow();
	});
	it('adds the full jury when an independent reviewer discovers a risk', async () => {
		const root = await workspace(),
			events: string[] = [];
		const run = await runPipeline(parseArgs(['Example-Person']), {
			root,
			execute: fakeExecutor(events, (id, record) => {
				if (id === 'review-evidence') record.risks = { ...risks, contested_typing: true };
			})
		});
		expect(run.exitCode).toBe(0);
		expect(events.filter((id) => id.startsWith('review-'))).toHaveLength(8);
	});
	it('invalidates changed prompts and rejects tampered review artifacts', async () => {
		const root = await workspace(),
			events: string[] = [];
		const run = await runPipeline(parseArgs(['Example-Person']), {
			root,
			execute: fakeExecutor(events)
		});
		await fs.appendFile(path.join(run.dir, 'review-evidence.json'), ' ');
		const file = path.join(root, 'src/blog/people/drafts/Example-Person.md');
		expect((await getEditorialPublishStatus(file, root)).blocker).toContain('changed_artifact');
		await fs.appendFile(
			path.join(root, '.claude/commands/blog_review_people_v3.md'),
			'\nClarification.\n'
		);
		events.length = 0;
		expect(
			(
				await runPipeline(parseArgs(['Example-Person', '--resume']), {
					root,
					execute: fakeExecutor(events)
				})
			).exitCode
		).toBe(0);
		expect(events).toContain('review-reader');
		expect(events).not.toContain('research');
	});
	it('preserves published state, original dates and identity through a refresh', async () => {
		const root = await workspace(),
			events: string[] = [];
		const file = path.join(root, 'src/blog/people/drafts/Example-Person.md');
		const parsed = matter(draft());
		parsed.data.published = true;
		parsed.data.date = '2001-01-01';
		parsed.data.lastmod = '2002-01-01';
		await fs.writeFile(file, matter.stringify(parsed.content, parsed.data));
		const run = await runPipeline(parseArgs(['example person', '--refresh']), {
			root,
			execute: fakeExecutor(events)
		});
		expect(run.exitCode).toBe(0);
		expect(matter(await fs.readFile(file, 'utf8')).data).toMatchObject({
			published: true,
			date: '2001-01-01',
			lastmod: '2002-01-01',
			person: 'Example-Person'
		});
	});
	it('times out a real child process and handles a missing executable without hanging', async () => {
		const root = await workspace();
		const executable = path.join(root, 'fake-claude');
		await fs.writeFile(executable, '#!/bin/sh\nsleep 30\n');
		await fs.chmod(executable, 0o755);
		const previous = process.env.BLOG_PIPELINE_CLAUDE;
		try {
			process.env.BLOG_PIPELINE_CLAUDE = executable;
			await expect(
				executeClaude('unused-request', path.join(root, 'timeout.log'), {
					root,
					maxTurns: 1,
					timeoutSeconds: 0.05
				})
			).rejects.toThrow('timed out');
			process.env.BLOG_PIPELINE_CLAUDE = path.join(root, 'missing');
			await expect(
				executeClaude('unused-request', path.join(root, 'missing.log'), {
					root,
					maxTurns: 1,
					timeoutSeconds: 1
				})
			).rejects.toThrow('ENOENT');
		} finally {
			if (previous === undefined) delete process.env.BLOG_PIPELINE_CLAUDE;
			else process.env.BLOG_PIPELINE_CLAUDE = previous;
		}
	});
});

describe('similarity phrase regression cases', () => {
	const stop = new Set(['is', 'an', 'the', 'so', 'with', 'what']);
	it.each(['b:subj subj', 't:subj subj is', 'b:august 2026', 't:enneagram type5 subj'])(
		'ignores neutral identity/date overlap: %s',
		(feature) => expect(informativePhraseFeature(feature, stop)).toBe(false)
	);
	it.each(['t:merge so completely', 'b:loses desire', 't:subj surrenders ambition'])(
		'retains distinctive argument overlap: %s',
		(feature) => expect(informativePhraseFeature(feature, stop)).toBe(true)
	);
	it('does not count name placeholders as sufficient argument content', () =>
		expect(isArgumentToken('subj', stop)).toBe(false));
});
