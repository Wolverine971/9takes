// scripts/lib/blogPipelineChecks.mjs
// Every deterministic check the people pipeline runs on a draft or candidate,
// bundled into one file the model stages read. No model calls, no network.
//
//   blockers   release blockers from the shared contract (checkDraft)
//   must_fix   things the publisher or lint would reject later; the runner holds a
//              run that still has them, but they are not part of the stored release
//              decision, so releases cut before a rule existed stay valid
//   advisories house-voice and page-shape notes; they never block
//   quote_check quotes searched for in the source text saved during research
import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { checkDraft } from './blogEditorial.js';
import { checkQuotes } from './blogQuoteCheck.mjs';
import { profile, findFlags } from './blogReadability.mjs';
import { missingPatterns } from './peopleControversies.mjs';

/** The standard targets 2,000-3,500 words; edits were landing above 4,000. */
export const TARGET_MAX_WORDS = 3900;
const HEDGED_ANSWER =
	/\b(leans?|leaning|leading read|narrowly|close behind|live rival|live alternative|held loosely|probably|most likely|may be|might be|could be|best understood as|leading hypothesis|appears to be|seems to be)\b/i;

/** Frontmatter the publisher rejects or silently drops.
 * @param {Record<string, any>} data */
export function fieldIssues(data) {
	const issues = [];
	for (const field of ['citations', 'same_as']) {
		if (!Array.isArray(data[field])) continue;
		for (const item of data[field]) {
			let ok;
			try {
				ok = typeof item === 'string' && new URL(item).protocol === 'https:';
			} catch {
				ok = false;
			}
			if (!ok)
				issues.push(
					`publish_field:${field}:not_https:${String(item).slice(0, 120)}:the publisher drops non-HTTPS links; use the https address or remove it`
				);
		}
	}
	const birth = data.birth_date;
	if (birth !== undefined && birth !== null && birth !== '' && !(birth instanceof Date)) {
		if (typeof birth !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(birth.trim()))
			issues.push(
				`publish_field:birth_date:not_iso:${String(birth)}:the publisher rejects partial dates; give a supported YYYY-MM-DD or omit the field`
			);
	}
	return issues;
}

/** The plain-language answer under the "What is X's personality type?" heading.
 * @param {string} body */
export function typeAnswer(body) {
	return (
		body.match(
			/^## (?:What is|Why)[^\n]*(?:personality|[Ee]nneagram)[^\n]*\n+([\s\S]*?)(?=\n\n|\n#|$)/m
		)?.[1] ?? ''
	);
}

/** House-voice notes (standard profiles only; open cases stay at "leading read").
 * @param {string} markdown @param {'standard' | 'open_case'} format @param {number} words */
export function voiceAdvisories(markdown, format, words) {
	const body = matter(markdown, {}).content.replace(/<!--[\s\S]*?-->/g, '');
	const notes = [];
	if (format === 'standard') {
		const answer = typeAnswer(body);
		const hedge = answer.match(HEDGED_ANSWER)?.[0];
		if (hedge)
			notes.push(
				`voice:hedged_type_answer:"${hedge}":the type answer commits to the type; move the contest to the "Why not Type N?" section`
			);
		if (!/^#{2,3}\s+Why not\b/im.test(body))
			notes.push(
				'voice:missing_why_not_section:put the strongest rival type in its own "Why not Type N?" section, with its best evidence answered'
			);
	}
	if (words > TARGET_MAX_WORDS)
		notes.push(
			`length:${words}_words:target is 2,000-3,500; cut repetition before adding anything`
		);
	return notes;
}

/**
 * @param {string} markdown
 * @param {string} registryFile docs/writing-system/people-controversies.json
 */
export async function controversyCoverage(markdown, registryFile) {
	const registry = await fs
		.readFile(registryFile, 'utf8')
		.then(JSON.parse)
		.catch(() => null);
	const parsed = matter(markdown, {});
	const slug = String(parsed.data.person ?? '').toLowerCase();
	const body = parsed.content.replace(/<!--[\s\S]*?-->/g, '');
	/** @type {string[]} */
	const required = [];
	/** @type {string[]} */
	const open = [];
	if (!registry || !slug) return { required, open };
	for (const [key, entries] of Object.entries(registry)) {
		if (key.startsWith('_') || key.toLowerCase() !== slug || !Array.isArray(entries)) continue;
		for (const entry of entries) {
			if (!missingPatterns(body, entry).length) continue;
			(entry.status === 'required' ? required : open).push(
				`controversy:${entry.id}:${entry.label}:the page must state this plainly (standard, "Controversies")`
			);
		}
	}
	return { required, open };
}

/**
 * @param {{markdown: string, root: string, snapshotDir: string, format?: 'standard' | 'open_case', sources?: Array<{id: string, access?: string}>}} input
 */
export async function buildChecks({ markdown, root, snapshotDir, format = 'standard', sources }) {
	const base = checkDraft(markdown);
	const data = matter(markdown, {}).data;
	const controversies = await controversyCoverage(
		markdown,
		path.join(root, 'docs/writing-system/people-controversies.json')
	);
	const metrics = profile(markdown);
	const shape = findFlags(metrics).map(
		(flag) =>
			`page_shape:${flag.key}:${flag.value} (limit ${flag.limit}):${flag.label}. ${flag.fix}`
	);
	return {
		blockers: base.blockers,
		words: base.words,
		must_fix: [...fieldIssues(data), ...controversies.required],
		advisories: [...voiceAdvisories(markdown, format, base.words), ...controversies.open, ...shape],
		page_shape: {
			median_paragraph_words: metrics.medianParagraph,
			long_paragraph_pct: metrics.longPct,
			short_paragraph_pct: metrics.shortPct,
			set_off_quotes: metrics.setOffQuotes,
			longest_paragraphs: metrics.where.longParagraphs.slice(0, 5)
		},
		quote_check: await checkQuotes(markdown, snapshotDir, sources)
	};
}
