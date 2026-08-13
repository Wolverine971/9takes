import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const PERSPECTIVE_REVIEW_SCHEMA_VERSION = 1;
export const PERSPECTIVE_REVIEW_NAMES = Object.freeze([
	'subject',
	'fan',
	'critic',
	'unfamiliar',
	'enneagram',
	'future'
]);
const PERSPECTIVE_REVIEW_FRONTMATTER_FIELDS = Object.freeze([
	'title',
	'meta_title',
	'persona_title',
	'description',
	'enneagram',
	'person',
	'faqs'
]);

/**
 * Hash the exact bytes of an artifact or frozen draft.
 * @param {string | Buffer} value
 * @returns {string}
 */
export function sha256(value) {
	return createHash('sha256').update(value).digest('hex');
}

/**
 * Return the review-sensitive article content used for perspective freshness.
 * Reader/search-facing frontmatter is included, while grades, dates, production
 * metadata, and editorial HTML comments are excluded so routine post-review grading
 * does not create a false stale result. Whitespace remains significant so prose and
 * structural edits stale the review.
 * @param {string} markdown
	* @returns {string}
	*/
export function getReaderVisiblePerspectiveBody(markdown) {
	const parsed = matter(markdown);
	/** @type {Record<string, unknown>} */
	const reviewFrontmatter = {};
	for (const field of PERSPECTIVE_REVIEW_FRONTMATTER_FIELDS) {
		if (Object.prototype.hasOwnProperty.call(parsed.data, field)) {
			reviewFrontmatter[field] = parsed.data[field];
		}
	}
	const body = parsed.content.replace(/<!--[\s\S]*?-->/g, '');
	const normalizedBody = body
		.replace(/\r\n?/g, '\n')
		.split('\n')
		.map((line) => line.replace(/[\t ]+$/g, ''))
		.join('\n')
		.trim();
	return `${JSON.stringify(reviewFrontmatter)}\n${normalizedBody}`;
}

/**
 * @param {string} markdown
 * @returns {string}
 */
export function hashReaderVisiblePerspectiveBody(markdown) {
	return sha256(getReaderVisiblePerspectiveBody(markdown));
}

/**
 * @param {string} filePath
 * @returns {Promise<string>}
 */
export async function hashReaderVisiblePerspectiveFile(filePath) {
	return hashReaderVisiblePerspectiveBody(await fs.readFile(filePath, 'utf8'));
}

/**
 * @param {string} filePath
 * @param {string} [repoRoot]
 * @returns {string}
 */
export function getPerspectiveSubjectRoot(filePath, repoRoot = process.cwd()) {
	const subject = path.basename(filePath, path.extname(filePath));
	return path.join(repoRoot, 'docs', 'content-analysis', 'perspective-reviews', subject);
}

/**
 * Resolve and contain a manifest-supplied review directory inside the repository's
 * perspective-review root.
 * @param {string} reviewDir
 * @param {string} [repoRoot]
 * @returns {string | null}
 */
export function resolveContainedPerspectiveReviewDir(reviewDir, repoRoot = process.cwd()) {
	if (typeof reviewDir !== 'string' || reviewDir.trim() === '') return null;
	const reviewsRoot = path.resolve(repoRoot, 'docs', 'content-analysis', 'perspective-reviews');
	const resolved = path.resolve(repoRoot, reviewDir);
	if (resolved === reviewsRoot || !resolved.startsWith(`${reviewsRoot}${path.sep}`)) return null;
	return resolved;
}

/**
 * @typedef {{
 *   valid: boolean,
 *   blocker: string | null,
 *   manifestPath: string,
 *   manifest: Record<string, unknown> | null,
 *   currentContentSha256: string
 * }} PerspectivePublishStatus
 */

/**
 * Check whether the latest completed perspective review covers the current
 * reader-visible draft body.
 * @param {string} filePath
 * @param {string} [repoRoot]
 * @returns {Promise<PerspectivePublishStatus>}
 */
export async function getPerspectivePublishStatus(filePath, repoRoot = process.cwd()) {
	const markdown = await fs.readFile(filePath, 'utf8');
	const currentContentSha256 = hashReaderVisiblePerspectiveBody(markdown);
	const expectedSubject = path.basename(filePath, path.extname(filePath));
	const manifestPath = path.join(getPerspectiveSubjectRoot(filePath, repoRoot), 'latest.json');
	let manifest;

	try {
		manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
	} catch (error) {
		const code = error && typeof error === 'object' && 'code' in error ? error.code : null;
		return {
			valid: false,
			blocker:
				code === 'ENOENT'
					? 'missing_perspective_review:run scripts/run-blog-pipeline.sh <Person> --resume'
					: 'invalid_perspective_review_manifest:rerun full blog pipeline',
			manifestPath,
			manifest: null,
			currentContentSha256
		};
	}

	if (
		manifest?.schema_version !== PERSPECTIVE_REVIEW_SCHEMA_VERSION ||
		manifest?.subject !== expectedSubject ||
		typeof manifest?.review_dir !== 'string' ||
		typeof manifest?.verification_file !== 'string' ||
		typeof manifest?.verified_content_sha256 !== 'string'
	) {
		return {
			valid: false,
			blocker: 'invalid_perspective_review_manifest:rerun full blog pipeline',
			manifestPath,
			manifest,
			currentContentSha256
		};
	}

	if (manifest.verification_status !== 'pass') {
		return {
			valid: false,
			blocker: `perspective_review_unresolved:${manifest.verification_status || 'unknown'}`,
			manifestPath,
			manifest,
			currentContentSha256
		};
	}

	const resolvedReviewDir = resolveContainedPerspectiveReviewDir(manifest.review_dir, repoRoot);
	if (!resolvedReviewDir) {
		return {
			valid: false,
			blocker: 'invalid_perspective_review_directory:rerun full blog pipeline',
			manifestPath,
			manifest,
			currentContentSha256
		};
	}

	const resolvedVerificationFile = path.resolve(repoRoot, manifest.verification_file);
	if (!resolvedVerificationFile.startsWith(`${resolvedReviewDir}${path.sep}`)) {
		return {
			valid: false,
			blocker: 'invalid_perspective_verification_artifact:rerun full blog pipeline',
			manifestPath,
			manifest,
			currentContentSha256
		};
	}

	try {
		const verification = matter(await fs.readFile(resolvedVerificationFile, 'utf8')).data;
		if (
			verification?.artifact !== 'perspective-verification' ||
			verification?.schema_version !== PERSPECTIVE_REVIEW_SCHEMA_VERSION ||
			verification?.subject !== expectedSubject ||
			verification?.verification_status !== 'pass' ||
			verification?.open_p0 !== 0 ||
			verification?.protected_hit_regressions !== 0 ||
			verification?.final_content_sha256 !== manifest.verified_content_sha256
		) {
			throw new Error('verification metadata does not match latest manifest');
		}
	} catch {
		return {
			valid: false,
			blocker: 'invalid_perspective_verification_artifact:rerun full blog pipeline',
			manifestPath,
			manifest,
			currentContentSha256
		};
	}

	if (manifest.verified_content_sha256 !== currentContentSha256) {
		return {
			valid: false,
			blocker: 'perspective_review_stale:reader-visible draft changed after verification',
			manifestPath,
			manifest,
			currentContentSha256
		};
	}

	return {
		valid: true,
		blocker: null,
		manifestPath,
		manifest,
		currentContentSha256
	};
}
