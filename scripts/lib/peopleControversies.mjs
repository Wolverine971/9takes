// scripts/lib/peopleControversies.mjs

/**
 * Controversy coverage gate for people pages.
 *
 * The registry (docs/writing-system/people-controversies.json) lists the major public
 * controversies each person page must state plainly. Each entry has `mustMention` regexes
 * that must ALL match the article body (frontmatter and HTML comments don't count).
 *
 *   status "required": missing coverage fails the check
 *   status "open":     known gap, reported but not failing (flip to "required" once written)
 *
 * The gate checks coverage, not tone. Tone rules live in
 * docs/writing-system/people-profile-standard.md ("Fair treatment across types").
 */

import fs from 'node:fs';
import path from 'node:path';

export const VALID_STATUSES = new Set(['required', 'open']);

/** Article body without YAML frontmatter or HTML comments (editor notes must not satisfy the gate). */
export function articleBody(markdown) {
	const withoutFrontmatter = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
	return withoutFrontmatter.replace(/<!--[\s\S]*?-->/g, '');
}

export function parsePersonDraft(markdown) {
	const fm = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
	const field = (name) =>
		fm
			.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1]
			?.trim()
			.replace(/^['"]|['"]$/g, '') ?? null;
	return {
		slug: field('person'),
		published: field('published') === 'true',
		body: articleBody(markdown)
	};
}

/** Validates registry shape; returns a list of human-readable problems. */
export function validateRegistry(registry) {
	const problems = [];
	for (const [slug, entries] of Object.entries(registry)) {
		if (slug.startsWith('_')) continue;
		if (!Array.isArray(entries) || entries.length === 0) {
			problems.push(`${slug}: expected a non-empty array of entries`);
			continue;
		}
		const ids = new Set();
		for (const entry of entries) {
			const where = `${slug}/${entry?.id ?? '?'}`;
			if (!entry?.id) problems.push(`${where}: missing id`);
			else if (ids.has(entry.id)) problems.push(`${where}: duplicate id`);
			ids.add(entry?.id);
			if (!entry?.label) problems.push(`${where}: missing label`);
			if (!VALID_STATUSES.has(entry?.status))
				problems.push(`${where}: status must be required|open`);
			if (!Array.isArray(entry?.mustMention) || entry.mustMention.length === 0) {
				problems.push(`${where}: mustMention needs at least one pattern`);
				continue;
			}
			for (const pattern of entry.mustMention) {
				try {
					new RegExp(pattern, 'i');
				} catch {
					problems.push(`${where}: invalid regex ${JSON.stringify(pattern)}`);
				}
			}
		}
	}
	return problems;
}

/** Which of an entry's patterns are missing from a body. */
export function missingPatterns(body, entry) {
	return entry.mustMention.filter((pattern) => !new RegExp(pattern, 'i').test(body));
}

/**
 * @param registry slug -> entries
 * @param people Map slug -> { published, body }
 * @returns {{ failures: object[], openGaps: object[], covered: object[] }}
 */
export function evaluateControversies(registry, people) {
	const failures = [];
	const openGaps = [];
	const covered = [];
	for (const [slug, entries] of Object.entries(registry)) {
		if (slug.startsWith('_')) continue;
		const person = people.get(slug);
		for (const entry of entries) {
			const base = { slug, id: entry.id, label: entry.label, status: entry.status };
			if (!person || !person.published) {
				// Unpublished or missing pages can't be checked; only flag required entries.
				if (entry.status === 'required') {
					failures.push({
						...base,
						reason: person ? 'page is not published' : 'no draft with this slug'
					});
				}
				continue;
			}
			const missing = missingPatterns(person.body, entry);
			if (missing.length === 0) covered.push(base);
			else if (entry.status === 'required')
				failures.push({ ...base, reason: 'not covered', missing });
			else openGaps.push({ ...base, missing });
		}
	}
	return { failures, openGaps, covered };
}

export function loadPeopleDrafts(draftsDir) {
	const people = new Map();
	for (const file of fs.readdirSync(draftsDir)) {
		if (!file.endsWith('.md')) continue;
		const parsed = parsePersonDraft(fs.readFileSync(path.join(draftsDir, file), 'utf8'));
		if (parsed.slug) people.set(parsed.slug, { ...parsed, file });
	}
	return people;
}
