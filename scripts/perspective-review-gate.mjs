#!/usr/bin/env node
// scripts/perspective-review-gate.mjs

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import {
	PERSPECTIVE_REVIEW_NAMES,
	PERSPECTIVE_REVIEW_SCHEMA_VERSION,
	hashReaderVisiblePerspectiveBody,
	resolveContainedPerspectiveReviewDir,
	sha256
} from './lib/perspectiveReview.js';

const args = process.argv.slice(2);
const valueFor = (name) => {
	const prefix = `--${name}=`;
	const inline = args.find((arg) => arg.startsWith(prefix));
	if (inline) return inline.slice(prefix.length);
	const index = args.indexOf(`--${name}`);
	return index >= 0 ? args[index + 1] : null;
};

const phase = valueFor('phase');
const draftArg = valueFor('draft');
const reviewDirArg = valueFor('review-dir');
const subjectArg = valueFor('subject');
const verificationFileArg = valueFor('verification-file');
const resolutionFileArg = valueFor('resolution-file');
const repoRootArg = valueFor('repo-root');
const scriptRepoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = repoRootArg ? path.resolve(repoRootArg) : scriptRepoRoot;

function fail(message, code = 1) {
	console.error(`FAIL  ${message}`);
	process.exit(code);
}

function pass(message) {
	console.log(`ok    ${message}`);
}

function requireArg(value, name) {
	if (!value) fail(`missing --${name}`, 2);
	return value;
}

function resolveRepoPath(filePath) {
	return path.isAbsolute(filePath) ? filePath : path.resolve(repoRoot, filePath);
}

function relativeRepoPath(filePath) {
	return path.relative(repoRoot, filePath).split(path.sep).join('/');
}

async function readMarkdownArtifact(filePath) {
	let raw;
	try {
		raw = await fs.readFile(filePath, 'utf8');
	} catch {
		fail(`missing artifact: ${relativeRepoPath(filePath)}`);
	}
	const parsed = matter(raw);
	return { raw, data: parsed.data, content: parsed.content };
}

function validateArtifactBase(data, artifact, subject, draftSha256, fileLabel) {
	if (data.schema_version !== PERSPECTIVE_REVIEW_SCHEMA_VERSION) {
		fail(`${fileLabel}: schema_version must be ${PERSPECTIVE_REVIEW_SCHEMA_VERSION}`);
	}
	if (data.artifact !== artifact) fail(`${fileLabel}: artifact must be ${artifact}`);
	if (data.subject !== subject) fail(`${fileLabel}: subject must be ${subject}`);
	if (data.draft_sha256 !== draftSha256) fail(`${fileLabel}: draft_sha256 does not match snapshot`);
}

async function loadContext(reviewDir) {
	let context;
	try {
		context = JSON.parse(await fs.readFile(path.join(reviewDir, 'context.json'), 'utf8'));
	} catch {
		fail('missing or invalid context.json; rerun snapshot phase');
	}
	if (context.schema_version !== PERSPECTIVE_REVIEW_SCHEMA_VERSION) {
		fail(`context.json schema_version must be ${PERSPECTIVE_REVIEW_SCHEMA_VERSION}`);
	}
	return context;
}

function requireHeadings(content, headings, fileLabel) {
	for (const heading of headings) {
		if (!content.includes(`## ${heading}`)) fail(`${fileLabel}: missing heading "## ${heading}"`);
	}
}

async function snapshot() {
	const draftPath = resolveRepoPath(requireArg(draftArg, 'draft'));
	const reviewDir = resolveContainedPerspectiveReviewDir(
		requireArg(reviewDirArg, 'review-dir'),
		repoRoot
	);
	if (!reviewDir) fail('--review-dir must be inside docs/content-analysis/perspective-reviews', 2);
	const subject = requireArg(subjectArg, 'subject');
	const raw = await fs.readFile(draftPath, 'utf8');
	const draftSha256 = sha256(raw);
	const contentSha256 = hashReaderVisiblePerspectiveBody(raw);
	await fs.mkdir(reviewDir, { recursive: true });
	await fs.writeFile(path.join(reviewDir, 'draft-reviewed.md'), raw);
	const context = {
		schema_version: PERSPECTIVE_REVIEW_SCHEMA_VERSION,
		subject,
		draft_path: relativeRepoPath(draftPath),
		review_dir: relativeRepoPath(reviewDir),
		draft_sha256: draftSha256,
		reader_visible_content_sha256: contentSha256,
		created_at: new Date().toISOString()
	};
	await fs.writeFile(path.join(reviewDir, 'context.json'), `${JSON.stringify(context, null, 2)}\n`);
	pass(`frozen draft: ${context.draft_path}`);
	pass(`snapshot sha256: ${draftSha256}`);
	pass(`review directory: ${context.review_dir}`);
}

async function packetGate() {
	const reviewDir = resolveContainedPerspectiveReviewDir(
		requireArg(reviewDirArg, 'review-dir'),
		repoRoot
	);
	if (!reviewDir) fail('invalid review directory', 2);
	const context = await loadContext(reviewDir);
	const artifactPath = path.join(reviewDir, 'evidence-packet.md');
	const { data, content } = await readMarkdownArtifact(artifactPath);
	validateArtifactBase(
		data,
		'perspective-evidence-packet',
		context.subject,
		context.draft_sha256,
		'evidence-packet.md'
	);
	if (data.packet_status !== 'complete') fail('evidence-packet.md: packet_status must be complete');
	requireHeadings(
		content,
		[
			'Identity and scope',
			'Dated timeline',
			'First-person evidence',
			'Third-party testimony',
			'Draft claim inventory',
			'Disputes and unresolved questions',
			'Source ledger'
		],
		'evidence-packet.md'
	);
	pass('shared evidence packet is complete and tied to the frozen draft');
}

async function reviewsGate() {
	const reviewDir = resolveContainedPerspectiveReviewDir(
		requireArg(reviewDirArg, 'review-dir'),
		repoRoot
	);
	if (!reviewDir) fail('invalid review directory', 2);
	const context = await loadContext(reviewDir);
	for (const perspective of PERSPECTIVE_REVIEW_NAMES) {
		const filename = `${perspective}.md`;
		const { data, content } = await readMarkdownArtifact(path.join(reviewDir, filename));
		validateArtifactBase(
			data,
			'perspective-review',
			context.subject,
			context.draft_sha256,
			filename
		);
		if (data.perspective !== perspective) fail(`${filename}: perspective must be ${perspective}`);
		if (data.review_status !== 'complete') fail(`${filename}: review_status must be complete`);
		if (!['intact', 'strained', 'broken'].includes(data.trust)) {
			fail(`${filename}: trust must be intact, strained, or broken`);
		}
		if (!['pass', 'revise', 'hold_for_research'].includes(data.recommendation)) {
			fail(`${filename}: invalid recommendation`);
		}
		for (const countField of ['blockers', 'concerns']) {
			if (!Number.isInteger(data[countField]) || data[countField] < 0) {
				fail(`${filename}: ${countField} must be a non-negative integer`);
			}
		}
		requireHeadings(
			content,
			[
				'Bottom-line verdict',
				'What landed',
				'What missed',
				'What I expected',
				'What surprised me',
				'Red flags',
				'Specific improvements',
				'Follow-on questions',
				'Preserve list',
				'Research log',
				'Limits of this review'
			],
			filename
		);
		pass(`${perspective} review complete`);
	}
}

async function synthesisGate() {
	const reviewDir = resolveContainedPerspectiveReviewDir(
		requireArg(reviewDirArg, 'review-dir'),
		repoRoot
	);
	if (!reviewDir) fail('invalid review directory', 2);
	const context = await loadContext(reviewDir);
	const { data, content } = await readMarkdownArtifact(path.join(reviewDir, 'synthesis.md'));
	validateArtifactBase(
		data,
		'perspective-synthesis',
		context.subject,
		context.draft_sha256,
		'synthesis.md'
	);
	if (data.synthesis_status !== 'complete') fail('synthesis.md: synthesis_status must be complete');
	for (const countField of ['p0_open', 'p1_accepted', 'research_required', 'protected_hits']) {
		if (!Number.isInteger(data[countField]) || data[countField] < 0) {
			fail(`synthesis.md: ${countField} must be a non-negative integer`);
		}
	}
	if (typeof data.requires_revision !== 'boolean') {
		fail('synthesis.md: requires_revision must be true or false');
	}
	requireHeadings(
		content,
		[
			'Executive verdict',
			'P0 — mandatory red-flag repairs',
			'P1 — accepted high-value improvements',
			'P2 — optional opportunities',
			'Research required before deciding',
			'Conflicts and editorial tradeoffs',
			'Rejected feedback',
			'Protected hits',
			'Revision brief'
		],
		'synthesis.md'
	);
	pass('perspective synthesis is complete and actionable');
}

async function validateResolutionArtifact(reviewDir, context, resolutionFilename) {
	const filename = path.basename(resolutionFilename);
	const expectedArtifact =
		filename === 'revision-resolution.md'
			? 'perspective-revision-resolution'
			: 'perspective-editor-resolution';
	const { data, content } = await readMarkdownArtifact(path.join(reviewDir, filename));
	validateArtifactBase(data, expectedArtifact, context.subject, context.draft_sha256, filename);
	if (data.resolution_status !== 'complete') {
		fail(`${filename}: resolution_status must be complete`);
	}
	requireHeadings(
		content,
		['Resolution log', 'Protected hits checked', 'Unresolved decisions'],
		filename
	);
	pass(`${filename} is complete and tied to the frozen draft`);
}

async function resolutionGate() {
	const reviewDir = resolveContainedPerspectiveReviewDir(
		requireArg(reviewDirArg, 'review-dir'),
		repoRoot
	);
	if (!reviewDir) fail('invalid review directory', 2);
	const context = await loadContext(reviewDir);
	await validateResolutionArtifact(reviewDir, context, resolutionFileArg || 'editor-resolution.md');
}

async function validateVerification({ writeLatest = false } = {}) {
	const draftPath = resolveRepoPath(requireArg(draftArg, 'draft'));
	const reviewDir = resolveContainedPerspectiveReviewDir(
		requireArg(reviewDirArg, 'review-dir'),
		repoRoot
	);
	if (!reviewDir) fail('invalid review directory', 2);
	const context = await loadContext(reviewDir);
	const verificationFilename = verificationFileArg || 'verification.md';
	const verificationPath = path.join(reviewDir, path.basename(verificationFilename));
	const { data, content } = await readMarkdownArtifact(verificationPath);
	validateArtifactBase(
		data,
		'perspective-verification',
		context.subject,
		context.draft_sha256,
		path.basename(verificationPath)
	);
	const currentRaw = await fs.readFile(draftPath, 'utf8');
	const currentContentSha256 = hashReaderVisiblePerspectiveBody(currentRaw);
	if (data.final_content_sha256 !== currentContentSha256) {
		fail(`${path.basename(verificationPath)}: final_content_sha256 does not match current draft`);
	}
	for (const countField of ['open_p0', 'protected_hit_regressions']) {
		if (!Number.isInteger(data[countField]) || data[countField] < 0) {
			fail(`${path.basename(verificationPath)}: ${countField} must be a non-negative integer`);
		}
	}
	requireHeadings(
		content,
		[
			'Verification verdict',
			'P0 resolution check',
			'Accepted improvements check',
			'Protected-hit regression check',
			'Remaining work'
		],
		path.basename(verificationPath)
	);
	if (
		data.verification_status !== 'pass' ||
		data.open_p0 !== 0 ||
		data.protected_hit_regressions !== 0
	) {
		fail(
			`${path.basename(verificationPath)} unresolved: status=${data.verification_status}, open_p0=${data.open_p0}, regressions=${data.protected_hit_regressions}`
		);
	}

	if (writeLatest) {
		await validateResolutionArtifact(reviewDir, context, 'editor-resolution.md');
		if (path.basename(verificationPath) === 'verification-final.md') {
			await validateResolutionArtifact(reviewDir, context, 'revision-resolution.md');
		}
		const subjectRoot = path.dirname(reviewDir);
		const manifest = {
			schema_version: PERSPECTIVE_REVIEW_SCHEMA_VERSION,
			subject: context.subject,
			review_dir: relativeRepoPath(reviewDir),
			verification_file: relativeRepoPath(verificationPath),
			verification_status: 'pass',
			reviewed_snapshot_sha256: context.draft_sha256,
			verified_content_sha256: currentContentSha256,
			verified_at: data.verified_at || new Date().toISOString()
		};
		await fs.mkdir(subjectRoot, { recursive: true });
		await fs.writeFile(
			path.join(subjectRoot, 'latest.json'),
			`${JSON.stringify(manifest, null, 2)}\n`
		);
		pass(
			`latest publish manifest written: ${relativeRepoPath(path.join(subjectRoot, 'latest.json'))}`
		);
	}
	pass('perspective verification covers the current reader-visible draft');
}

switch (phase) {
	case 'snapshot':
		await snapshot();
		break;
	case 'packet':
		await packetGate();
		break;
	case 'reviews':
		await reviewsGate();
		break;
	case 'synthesis':
		await synthesisGate();
		break;
	case 'resolution':
		await resolutionGate();
		break;
	case 'verification':
		await validateVerification();
		break;
	case 'finalize':
		await validateVerification({ writeLatest: true });
		break;
	default:
		fail('usage: --phase snapshot|packet|reviews|synthesis|resolution|verification|finalize', 2);
}
