// src/lib/utils/peopleRevisionNotes.spec.ts
// Refresh passes kept leaving editing notes in reader-visible text ("The old version
// of this article claimed...", "the previous draft", "this page's previous editorial
// cutoff"). Readers and the people profiled see them as the page admitting it got
// them wrong. Cleaned from 7 published pages on 2026-11-14. Notes belong in HTML
// comments. A deliberate retype disclosure ("An earlier version of this page typed
// her as...") is allowed.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const DRAFTS_DIR = join(process.cwd(), 'src/blog/people/drafts');
const REVISION_NOTE =
	/(original|previous|earlier|old|prior) (version|draft|edition) of (this|the) (article|page|piece|profile)|this (page|article)'s (previous|earlier|prior)|editorial cutoff|previous draft|earlier draft|this article (incorrectly|wrongly) (claimed|said)/gi;
const ALLOWED = /version of this page typed (him|her|them) as/i;

describe('published people drafts', () => {
	it('show readers no leftover revision notes', () => {
		const bad: string[] = [];
		for (const name of readdirSync(DRAFTS_DIR).filter((f) => f.endsWith('.md'))) {
			const source = readFileSync(join(DRAFTS_DIR, name), 'utf8');
			if (!/^published:\s*true/m.test(source)) continue;
			const visible = source.replace(/<!--[\s\S]*?-->/g, '');
			for (const match of visible.matchAll(REVISION_NOTE)) {
				const around = visible.slice(match.index, match.index + 80);
				if (!ALLOWED.test(around)) bad.push(`${name}: ${around.replace(/\s+/g, ' ')}`);
			}
		}
		expect(bad).toEqual([]);
	});
});
