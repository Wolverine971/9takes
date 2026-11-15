// src/lib/utils/peopleSocialHandles.spec.ts
// Guards people drafts against the "abor" handle glitch: AI-written drafts filled
// twitter/instagram/tiktok from memory and mangled them (pokimanelol -> pokaborat,
// daxshepard -> daborgs). Those values ship as JSON-LD sameAs links to strangers'
// accounts. 29 were fixed on 2026-11-14; this keeps new ones from landing.
// Leave a handle blank unless it was checked against the person's verified profile.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const DRAFTS_DIR = join(process.cwd(), 'src/blog/people/drafts');
const SOCIAL_FIELD = /^(twitter|instagram|tiktok|youtube|threads|x):\s*['"]?([^'"\n]*)/gim;
const GLITCH = /abor/i;
const AUTHOR_LINK_GLITCH = /(instagram|twitter|tiktok)\.com\/@?[\w.]*abor/i;

function frontmatter(source: string): string {
	const match = source.match(/^---\n([\s\S]*?)\n---/);
	return match ? match[1] : '';
}

describe('people draft social handles', () => {
	const files = readdirSync(DRAFTS_DIR).filter((name) => name.endsWith('.md'));

	it('finds the drafts', () => {
		expect(files.length).toBeGreaterThan(100);
	});

	it('has no mangled "abor" handles in frontmatter social fields', () => {
		const bad: string[] = [];
		for (const name of files) {
			const fm = frontmatter(readFileSync(join(DRAFTS_DIR, name), 'utf8'));
			for (const [, field, value] of fm.matchAll(SOCIAL_FIELD)) {
				if (GLITCH.test(value)) bad.push(`${name} ${field}: ${value}`);
			}
		}
		expect(bad).toEqual([]);
	});

	it('has no mangled "abor" social links anywhere in the draft', () => {
		const bad = files.filter((name) =>
			AUTHOR_LINK_GLITCH.test(readFileSync(join(DRAFTS_DIR, name), 'utf8'))
		);
		expect(bad).toEqual([]);
	});
});
