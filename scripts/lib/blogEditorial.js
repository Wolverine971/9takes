// scripts/lib/blogEditorial.js
// Shared v3 editorial contract. No model calls, database access, or publication.
import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';

export const WORKFLOW_VERSION = 3;
export const STANDARD_ROLES = ['evidence', 'reader'];
export const EXPANDED_ROLES = ['subject', 'fan', 'critic', 'unfamiliar', 'enneagram', 'future'];
export const DIMENSIONS = {
	evidence: 0.25,
	enneagram: 0.25,
	originality: 0.15,
	writing: 0.15,
	durability: 0.15,
	hook: 0.05
};
const text = z.string().trim().min(1);
const strings = z.array(text);
const hash = z.string().regex(/^[a-f0-9]{64}$/);
const riskSchema = z.object({
	sensitive_allegations: z.boolean(),
	contested_typing: z.boolean(),
	historical_source_uncertainty: z.boolean(),
	major_thesis_change: z.boolean()
});
const sourceSchema = z.object({
	id: text,
	url: z.string().url(),
	title: text,
	speaker: text,
	date: text,
	locator: text,
	excerpt: text,
	context: text,
	kind: z.enum(['primary', 'testimony', 'secondary']),
	access: z.enum(['opened', 'unavailable'])
});
const claimSchema = z.object({
	id: text,
	claim: text,
	passage: z.string(),
	class: z.enum([
		'observed',
		'self_report',
		'third_party',
		'interpretation',
		'disputed',
		'unknown'
	]),
	source_ids: strings,
	inference: text,
	alternative: text,
	durability: z.enum(['stable', 'time_sensitive', 'unresolved']),
	review_trigger: z.string()
});
export const evidenceSchema = z.object({
	schema_version: z.literal(3),
	subject: text,
	status: z.enum(['ready', 'insufficient_evidence']),
	research_tasks: strings,
	accuracy_checked_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	risks: riskSchema,
	sources: z.array(sourceSchema),
	claims: z.array(claimSchema),
	type_hypothesis: z.object({
		type: z.number().int().min(1).max(9).nullable(),
		confidence: z.enum(['high', 'medium', 'low']),
		for_claim_ids: strings,
		against: text,
		alternative_type: z.number().int().min(1).max(9).nullable(),
		alternative_case: text,
		discriminator: text,
		unexplained: text
	})
});
const findingSchema = z.object({
	id: text,
	severity: z.enum(['blocker', 'major', 'minor']),
	passage: text,
	problem: text,
	acceptance_test: text
});
export const reviewSchema = z.object({
	schema_version: z.literal(3),
	role: z.enum([
		'evidence',
		'reader',
		'subject',
		'fan',
		'critic',
		'unfamiliar',
		'enneagram',
		'future'
	]),
	content_sha256: hash,
	evidence_sha256: hash,
	risks: riskSchema,
	findings: z.array(findingSchema),
	protected_passages: z.array(z.object({ passage: text, reason: text })),
	assessment: text
});
export const resolutionSchema = z.object({
	schema_version: z.literal(3),
	decisions: z.array(
		z.object({
			finding_id: text,
			action: z.enum(['fixed', 'rejected']),
			reason: text
		})
	),
	protected_passages: z.array(
		z.object({ passage: text, action: z.enum(['kept', 'changed']), reason: text })
	),
	prior_blockers: z.array(z.object({ blocker: text, resolution: text }))
});
const assessmentSchema = z.object({
	score: z.number().min(0).max(10),
	reason: text,
	passage: text
});
export const verificationSchema = z.object({
	schema_version: z.literal(3),
	content_sha256: hash,
	evidence_sha256: hash,
	status: z.enum(['pass', 'revise', 'insufficient_evidence']),
	findings: z.array(findingSchema),
	research_tasks: strings,
	claim_checks: z.array(
		z.object({
			claim_id: text,
			verdict: z.enum(['supported', 'qualified', 'unsupported']),
			reason: text
		})
	),
	source_checks: z.array(
		z.object({ source_id: text, opened: z.boolean(), context_matches: z.boolean(), locator: text })
	),
	decision_checks: z.array(z.object({ finding_id: text, accepted: z.boolean(), reason: text })),
	prior_blocker_checks: z.array(z.object({ blocker: text, accepted: z.boolean(), reason: text })),
	protected_checks: z.array(z.object({ passage: text, preserved: z.boolean(), reason: text })),
	coverage_complete: z.boolean(),
	metadata_consistent: z.boolean(),
	alternative_type_addressed: z.boolean(),
	five_year_test_passed: z.boolean(),
	scores: z.object({
		evidence: assessmentSchema,
		enneagram: assessmentSchema,
		originality: assessmentSchema,
		writing: assessmentSchema,
		durability: assessmentSchema,
		hook: assessmentSchema,
		discoverability: assessmentSchema
	})
});

/** @typedef {z.infer<typeof evidenceSchema>} Evidence */
/** @typedef {z.infer<typeof reviewSchema>} Review */
/** @typedef {z.infer<typeof verificationSchema>} Verification */
/** @param {string | Buffer} value */
export const sha256 = (value) => createHash('sha256').update(value).digest('hex');
/** @param {Record<string, any>} data */
export const isV3 = (data) => data?.editorial_workflow?.version === WORKFLOW_VERSION;
// Publication bookkeeping is deliberately excluded. All other metadata,
// including birth dates, FAQs and citations, is part of the reviewed surface.
const BOOKKEEPING = new Set([
	'content_quality',
	'editorial_workflow',
	'production_pretext',
	'date',
	'lastmod',
	'published',
	'loc',
	'changefreq',
	'priority'
]);
/** @param {any} value @returns {any} */
function stable(value) {
	if (value instanceof Date) return value.toISOString();
	if (Array.isArray(value)) return value.map(stable);
	if (value && typeof value === 'object')
		return Object.fromEntries(
			Object.keys(value)
				.sort()
				.map((k) => [k, stable(value[k])])
		);
	return value;
}
/** @param {string} markdown */
export function editorialHash(markdown) {
	const { data, content } = matter(markdown, {});
	const metadata = Object.fromEntries(
		Object.entries(data).filter(([key]) => !BOOKKEEPING.has(key))
	);
	return sha256(
		JSON.stringify(stable(metadata)) +
			'\n' +
			content
				.replace(/<!--[\s\S]*?-->/g, '')
				.replace(/\r\n?/g, '\n')
				.trim()
	);
}
/** Remove previous grades and private ledgers before independent assessment.
 * @param {string} markdown
 */
export function cleanReaderCopy(markdown) {
	if (!markdown.trim()) return '';
	// gray-matter's default cache shares nested data objects. A fresh parse
	// prevents grade removal or later handoff mutations from changing a snapshot.
	const parsed = matter(markdown, {});
	delete parsed.data.content_quality;
	delete parsed.data.content_grade;
	delete parsed.data.editorial_workflow;
	return matter.stringify(parsed.content.replace(/<!--[\s\S]*?-->/g, ''), parsed.data);
}
/** @param {{risks: Evidence['risks']}} evidence @param {Array<{risks: Evidence['risks']}>} reviews @param {boolean} expanded */
export function requiredRoles(evidence, reviews = [], expanded = false) {
	return expanded ||
		[evidence, ...reviews].some((record) => Object.values(record.risks).some(Boolean))
		? [...EXPANDED_ROLES]
		: [...STANDARD_ROLES];
}
/** @param {string[]} items @param {string} label */
function unique(items, label) {
	if (new Set(items).size !== items.length) throw new Error(`Duplicate ${label}`);
}
/** @param {unknown} value @returns {string[]} */
function textValues(value) {
	if (typeof value === 'string') return [value];
	if (Array.isArray(value)) return value.flatMap(textValues);
	if (value && typeof value === 'object') return Object.values(value).flatMap(textValues);
	return [];
}
/** @param {unknown} raw @param {string} subject @param {string} [markdown] */
export function validateEvidence(raw, subject, markdown) {
	const evidence = evidenceSchema.parse(raw);
	// YAML may fold long FAQ/description values across physical lines. Locate
	// metadata claims in parsed values, not in their serialization syntax.
	const parsed = markdown ? matter(markdown, {}) : null;
	const surface = parsed
		? parsed.content.replace(/<!--[\s\S]*?-->/g, '') +
			'\n' +
			Object.entries(parsed.data)
				.filter(([key]) => !BOOKKEEPING.has(key))
				.flatMap(([, value]) => textValues(value))
				.join('\n')
		: null;
	if (evidence.subject !== subject) throw new Error('Evidence subject mismatch');
	unique(
		evidence.sources.map((s) => s.id),
		'source IDs'
	);
	unique(
		evidence.claims.map((c) => c.id),
		'claim IDs'
	);
	const sources = new Map(evidence.sources.map((s) => [s.id, s]));
	for (const claim of evidence.claims) {
		for (const id of claim.source_ids)
			if (!sources.has(id)) throw new Error(`${claim.id}: missing source ${id}`);
		if (surface !== null && (!claim.passage || !surface.includes(claim.passage)))
			throw new Error(`${claim.id}: passage missing from draft`);
		if (claim.durability !== 'stable' && !claim.review_trigger)
			throw new Error(`${claim.id}: missing review trigger`);
	}
	const h = evidence.type_hypothesis;
	for (const id of h.for_claim_ids)
		if (!evidence.claims.some((c) => c.id === id))
			throw new Error(`Type hypothesis references missing ${id}`);
	if (evidence.status === 'ready') {
		if (
			!h.type ||
			h.confidence === 'low' ||
			!h.alternative_type ||
			h.alternative_type === h.type ||
			h.for_claim_ids.length < 2
		)
			throw new Error('Ready evidence requires a differentiated, supported type hypothesis');
		if (evidence.sources.filter((s) => s.access === 'opened').length < 2)
			throw new Error('Ready evidence requires at least two opened sources');
		if (evidence.claims.some((c) => !c.source_ids.length || c.class === 'unknown'))
			throw new Error('Ready evidence contains unsupported claims');
	}
	if (evidence.status === 'insufficient_evidence' && !evidence.research_tasks.length)
		throw new Error('Research hold needs a concrete task');
	return evidence;
}
/** @param {string} markdown @returns {string[]} */
export function priorBlockers(markdown) {
	const p = matter(markdown, {}).data.production_pretext;
	if (!p) return [];
	const blockers = Array.isArray(p.blockers)
		? p.blockers.map((/** @type {unknown} */ b) => (typeof b === 'string' ? b : JSON.stringify(b)))
		: [];
	if (p.status === 'blocked' && !blockers.length)
		blockers.push('production_pretext.status: blocked');
	return blockers;
}
/** @param {string} markdown */
export function checkDraft(markdown) {
	const { data, content } = matter(markdown, {});
	const body = content.replace(/<!--[\s\S]*?-->/g, '');
	const blockers = [];
	for (const field of [
		'title',
		'meta_title',
		'persona_title',
		'description',
		'author',
		'date',
		'lastmod',
		'loc',
		'changefreq',
		'priority',
		'published',
		'enneagram',
		'type',
		'person',
		'suggestions'
	]) {
		const value = data[field];
		const present =
			field === 'published'
				? typeof value === 'boolean'
				: field === 'enneagram'
					? /^[1-9]$/.test(String(value))
					: field === 'type' || field === 'suggestions'
						? Array.isArray(value) && value.length > 0
						: typeof value === 'string' && value.trim().length > 0;
		if (!present) blockers.push(`missing_frontmatter:${field}`);
	}
	const words = body
		.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
		.replace(/<svelte:head>[\s\S]*?<\/svelte:head>/g, '')
		.replace(/```[\s\S]*?```/g, '')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/<[^>]*>/g, ' ')
		.split(/\s+/)
		.filter(Boolean).length;
	if (words < 1200 || words > 4500) blockers.push(`word_count:${words}:expected_1200_to_4500`);
	if ((body.match(/^## /gm) || []).length < 4) blockers.push('too_few_sections');
	if (!/^[1-9]$/.test(String(data.enneagram))) blockers.push('invalid_enneagram');
	if (typeof data.published !== 'boolean') blockers.push('invalid_published_state');
	if (
		!Array.isArray(data.type) ||
		!data.type.length ||
		data.type.some((/** @type {unknown} */ t) => typeof t !== 'string' || !t.trim())
	)
		blockers.push('invalid_type_categories');
	if (
		typeof data.description !== 'string' ||
		data.description.length < 120 ||
		data.description.length > 170
	)
		blockers.push('description_length:expected_120_to_170');
	if (
		typeof data.meta_title !== 'string' ||
		data.meta_title.length < 35 ||
		data.meta_title.length > 65
	)
		blockers.push('meta_title_length:expected_35_to_65');
	if (
		/\b(TODO|TBD|FIXME|PLACEHOLDER|LOREM IPSUM|INSERT QUOTE|ADD QUOTE|ADD SOURCE|outline only|skeleton draft|bare bones|stub draft|unfinished draft)\b|\[INSERT\b|\{\{/i.test(
			body
		)
	)
		blockers.push('unfinished_markers');
	if (
		!Array.isArray(data.faqs) ||
		data.faqs.length < 2 ||
		data.faqs.some((f) => !f.question || !f.answer)
	)
		blockers.push('missing_or_invalid_faqs');
	const answer = body.match(
		/^## (?:What is|Why)[^\n]*(?:personality|[Ee]nneagram)[^\n]*\n+([\s\S]*?)(?=\n\n|\n#|$)/m
	)?.[1];
	if (!answer || answer.split(/\s+/).length > 60) blockers.push('missing_concise_type_answer');
	for (const link of body.matchAll(/\]\(\/personality-analysis\/([^/#)]+)/g))
		if (link[1].toLowerCase() === String(data.person).toLowerCase()) blockers.push('self_link');
	return {
		blockers: [
			...new Set([...blockers, ...priorBlockers(markdown).map((b) => `creator_blocker:${b}`)])
		],
		words
	};
}
/** @param {Verification} verification */
export function calculateQuality(verification) {
	const scores =
		/** @type {{[K in keyof Verification['scores']]: number} & Record<string, number>} */ (
			Object.fromEntries(
				Object.entries(verification.scores).map(([key, value]) => [key, value.score])
			)
		);
	const overall =
		Math.round(
			Object.entries(DIMENSIONS).reduce((total, [key, weight]) => total + scores[key] * weight, 0) *
				10
		) / 10;
	return {
		...scores,
		overall,
		letter:
			overall >= 9.5 ? 'A+' : overall >= 9 ? 'A' : overall >= 8.5 ? 'B+' : overall >= 8 ? 'B' : 'C',
		rubric_version: 3,
		graded_at: new Date().toISOString().slice(0, 10),
		caps_applied: [],
		needs_review: verification.status !== 'pass',
		content_sha256: verification.content_sha256
	};
}

// This same decision is used by finalization, publication and live updates.
// Structural validation establishes auditability; source truth is checked by
// the independent human/model reviewer, not by a URL/outlet-name heuristic.
/** @param {{subject: string, markdown: string, evidence: unknown, reviews: unknown[], resolution: unknown, verification: unknown, baseline?: string, expanded?: boolean, reviewedMarkdown?: string, reviewedEvidence?: unknown}} input */
export function assessEditorial({
	subject,
	markdown,
	evidence: rawEvidence,
	reviews: rawReviews,
	resolution: rawResolution,
	verification: rawVerification,
	baseline = '',
	expanded = false,
	reviewedMarkdown,
	reviewedEvidence
}) {
	const blockers = [...checkDraft(markdown).blockers];
	try {
		const evidence = validateEvidence(rawEvidence, subject, markdown);
		const resolution = resolutionSchema.parse(rawResolution);
		const verification = verificationSchema.parse(rawVerification);
		const reviews = rawReviews.map((r) => reviewSchema.parse(r));
		if (
			reviewedMarkdown &&
			Number(matter(reviewedMarkdown, {}).data.enneagram) !== evidence.type_hypothesis.type
		) {
			blockers.push('review_scope_changed:type_thesis:run --refresh --expanded-review');
		}
		if (reviewedEvidence) {
			const frozenEvidence = evidenceSchema.parse(reviewedEvidence);
			for (const risk of /** @type {Array<keyof Evidence['risks']>} */ (
				Object.keys(evidence.risks)
			)) {
				if (
					evidence.risks[risk] &&
					!frozenEvidence.risks[risk] &&
					!reviews.some((r) => r.risks[risk])
				)
					blockers.push(`review_scope_changed:${risk}:run --refresh --expanded-review`);
			}
		}
		const originalType = matter(baseline, {}).data.enneagram;
		expanded ||=
			originalType !== undefined && Number(originalType) !== evidence.type_hypothesis.type;
		unique(
			reviews.map((r) => r.role),
			'review roles'
		);
		const findings = reviews.flatMap((r) => r.findings);
		unique(
			findings.map((f) => f.id),
			'finding IDs'
		);
		unique(
			resolution.decisions.map((d) => d.finding_id),
			'decisions'
		);
		for (const role of requiredRoles(evidence, reviews, expanded))
			if (!reviews.some((r) => r.role === role)) blockers.push(`missing_review:${role}`);
		if (evidence.status !== 'ready') blockers.push('insufficient_evidence');
		if (Number(matter(markdown, {}).data.enneagram) !== evidence.type_hypothesis.type)
			blockers.push('type_hypothesis_mismatch');
		if (verification.content_sha256 !== editorialHash(markdown))
			blockers.push('stale_verification');
		if (verification.evidence_sha256 !== sha256(JSON.stringify(evidence)))
			blockers.push('stale_evidence_verification');
		if (verification.status !== 'pass') blockers.push(`verification:${verification.status}`);
		for (const flag of /** @type {const} */ ([
			'coverage_complete',
			'metadata_consistent',
			'alternative_type_addressed',
			'five_year_test_passed'
		]))
			if (!verification[flag]) blockers.push(`verification:${flag}`);
		for (const f of verification.findings)
			if (f.severity !== 'minor') blockers.push(`unresolved:${f.id}:${f.problem}`);
		unique(
			verification.claim_checks.map((v) => v.claim_id),
			'claim checks'
		);
		unique(
			verification.source_checks.map((v) => v.source_id),
			'source checks'
		);
		unique(
			verification.decision_checks.map((v) => v.finding_id),
			'decision checks'
		);
		for (const c of evidence.claims) {
			const check = verification.claim_checks.find((v) => v.claim_id === c.id);
			if (!check || check.verdict === 'unsupported') blockers.push(`unverified_claim:${c.id}`);
		}
		for (const id of new Set(evidence.claims.flatMap((c) => c.source_ids))) {
			const check = verification.source_checks.find((v) => v.source_id === id);
			if (!check?.opened || !check.context_matches) blockers.push(`unverified_source:${id}`);
		}
		for (const f of findings) {
			if (
				!resolution.decisions.some((d) => d.finding_id === f.id) ||
				!verification.decision_checks.some((c) => c.finding_id === f.id && c.accepted)
			)
				blockers.push(`unresolved_review:${f.id}`);
		}
		for (const p of reviews.flatMap((r) => r.protected_passages)) {
			if (
				!resolution.protected_passages.some((d) => d.passage === p.passage) ||
				!verification.protected_checks.some((c) => c.passage === p.passage && c.preserved)
			)
				blockers.push(`protected_passage_regression:${p.passage.slice(0, 80)}`);
		}
		for (const b of priorBlockers(baseline))
			if (
				!resolution.prior_blockers.some((d) => d.blocker === b) ||
				!verification.prior_blocker_checks.some((c) => c.blocker === b && c.accepted)
			)
				blockers.push(`unresolved_prior_blocker:${b}`);
		const quality = calculateQuality(verification);
		if (quality.overall < 8.5) blockers.push(`overall_below_8.5:${quality.overall}`);
		if (quality.discoverability < 7)
			blockers.push(`discoverability_below_7:${quality.discoverability}`);
		for (const key of /** @type {const} */ (['evidence', 'enneagram', 'durability']))
			if (quality[key] < 8) blockers.push(`${key}_below_8:${quality[key]}`);
		return { eligible: blockers.length === 0, blockers, quality };
	} catch (error) {
		return {
			eligible: false,
			blockers: [...blockers, `invalid_editorial_artifact:${errorMessage(error)}`],
			quality: null
		};
	}
}

/** @param {unknown} error */
export function errorMessage(error) {
	return error instanceof Error ? error.message : String(error);
}
/** @param {string} file @returns {Promise<any>} */
export async function readJson(file) {
	return JSON.parse(await fs.readFile(file, 'utf8'));
}
/** @param {string} file @param {unknown} value */
export async function writeJson(file, value) {
	await fs.writeFile(file, JSON.stringify(value, null, 2) + '\n');
}
/** @param {string} file @param {string} value */
export async function atomicWrite(file, value) {
	const tmp = `${file}.${process.pid}.tmp`;
	await fs.writeFile(tmp, value);
	await fs.rename(tmp, file);
}
/** @param {string} filePath @param {string} repoRoot */
export async function getEditorialPublishStatus(filePath, repoRoot = process.cwd()) {
	const markdown = await fs.readFile(filePath, 'utf8');
	const data = matter(markdown, {}).data;
	const currentContentSha256 = editorialHash(markdown);
	let manifestPath = '';
	/** @type {any} */
	let manifest = null;
	const fail = (/** @type {string} */ blocker) => ({
		valid: false,
		blocker: `editorial_v3:${blocker}`,
		manifestPath,
		manifest,
		currentContentSha256
	});
	try {
		if (!isV3(data)) return fail('missing_workflow_version');
		const root = path.resolve(repoRoot, 'docs/content-analysis/pipeline-logs');
		const dir = path.resolve(repoRoot, data.editorial_workflow.run_dir);
		if (
			!dir.startsWith(root + path.sep) ||
			!(await fs.realpath(dir)).startsWith((await fs.realpath(root)) + path.sep)
		)
			return fail('invalid_run_directory');
		manifestPath = path.join(dir, 'release.json');
		manifest = await readJson(manifestPath);
		if (
			manifest.schema_version !== 3 ||
			manifest.subject !== path.basename(filePath, '.md') ||
			manifest.content_sha256 !== currentContentSha256
		)
			return fail('stale_or_invalid_release');
		/** @type {Record<string, any>} */
		const artifacts = {};
		for (const [key, record] of Object.entries(
			/** @type {Record<string, {file: string, sha256: string}>} */ (manifest.artifacts)
		)) {
			if (typeof record.file !== 'string' || path.basename(record.file) !== record.file)
				return fail('invalid_artifact_path');
			const filename = path.join(dir, record.file);
			if (!(await fs.realpath(filename)).startsWith((await fs.realpath(dir)) + path.sep))
				return fail('invalid_artifact_path');
			const raw = await fs.readFile(filename, 'utf8');
			if (sha256(raw) !== record.sha256) return fail(`changed_artifact:${key}`);
			artifacts[key] = record.file.endsWith('.json') ? JSON.parse(raw) : raw;
		}
		const reviews = Object.entries(artifacts)
			.filter(([key]) => key.startsWith('review-'))
			.map(([, value]) => reviewSchema.parse(value));
		const frozenHash = editorialHash(artifacts.draft);
		const evidenceHash = sha256(JSON.stringify(evidenceSchema.parse(artifacts.draft_evidence)));
		if (reviews.some((r) => r.content_sha256 !== frozenHash || r.evidence_sha256 !== evidenceHash))
			return fail('stale_review');
		const expanded =
			manifest.expanded ||
			requiredRoles(validateEvidence(artifacts.research, manifest.subject)).length === 6 ||
			requiredRoles(evidenceSchema.parse(artifacts.draft_evidence)).length === 6;
		const result = assessEditorial({
			subject: manifest.subject,
			markdown,
			evidence: artifacts.evidence,
			reviews,
			resolution: artifacts.resolution,
			verification: artifacts.verification,
			baseline: artifacts.baseline,
			expanded,
			reviewedMarkdown: artifacts.draft,
			reviewedEvidence: artifacts.draft_evidence
		});
		if (!result.eligible || !result.quality) return fail(result.blockers.join('; '));
		for (const key of /** @type {const} */ ([
			'evidence',
			'enneagram',
			'originality',
			'writing',
			'durability',
			'hook',
			'discoverability',
			'overall',
			'letter',
			'rubric_version',
			'content_sha256'
		]))
			if (data.content_quality?.[key] !== result.quality[key]) return fail(`grade_mismatch:${key}`);
		if (
			data.content_quality?.needs_review !== false ||
			!Array.isArray(data.content_quality?.caps_applied) ||
			data.content_quality?.caps_applied?.length !== 0
		)
			return fail('unresolved_grade');
		return { valid: true, blocker: null, manifestPath, manifest, currentContentSha256 };
	} catch (error) {
		return fail(`missing_or_invalid_release:${errorMessage(error)}`);
	}
}
