// src/lib/server/blogPerformanceDiagnostics.spec.ts
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { afterEach, describe, expect, it } from 'vitest';

import { loadPeopleBlogPerformanceDiagnostics } from './blogPerformanceDiagnostics';

let tempDirs: string[] = [];

async function makeTempBlogDir(): Promise<string> {
	const dir = await mkdtemp(join(tmpdir(), 'blog-diagnostics-'));
	tempDirs.push(dir);
	return dir;
}

afterEach(async () => {
	await Promise.all(tempDirs.map((dir) => rm(dir, { recursive: true, force: true })));
	tempDirs = [];
});

describe('blog performance diagnostics', () => {
	it('extracts frontmatter and cross-link diagnostics without treating published as a score', async () => {
		const dir = await makeTempBlogDir();
		await writeFile(
			join(dir, 'Alpha-Person.md'),
			`---
title: 'Alpha Person: The Search Hook'
meta_title: 'Alpha Person Personality Analysis'
persona_title: 'The Alpha Mask'
description: 'A focused search snippet that describes the article and gives readers a clear reason to click into the analysis.'
date: '2026-05-01'
lastmod: '2026-05-01'
published: false
enneagram: 5
type: ['techie']
person: 'Alpha-Person'
suggestions: ['Beta-Person', 'Missing-Person']
keywords: ['Alpha Person Enneagram']
content_quality:
  overall: 9.1
  letter: A
faqs:
  - question: 'What is Alpha Person type?'
    answer: 'Type 5.'
---

<!-- TESTIMONY LEDGER -->
<!-- HEADING MIX LEDGER -->
<!-- DISTRIBUTION LEDGER -->

<details><summary class="accordion">TL;DR: Why Alpha is Type 5</summary></details>

## What is Alpha Person's personality type?

Alpha links to [Beta](/personality-analysis/beta-person) and [Type 5](/enneagram-corner/enneagram-type-5).
`
		);
		await writeFile(
			join(dir, 'Beta-Person.md'),
			`---
title: 'Beta Person'
description: 'Short.'
person: 'Beta-Person'
suggestions: ['Alpha-Person']
---

## Beta

Beta links back to [Alpha](/personality-analysis/alpha-person).
`
		);

		const rows = await loadPeopleBlogPerformanceDiagnostics(dir);
		const alpha = rows.find((row) => row.slug === 'alpha-person');

		expect(alpha).toMatchObject({
			frontmatter: {
				published: false,
				suggestions: ['Beta-Person', 'Missing-Person'],
				faq_count: 1
			},
			link_stats: {
				outgoing_internal_count: 2,
				outgoing_personality_count: 1,
				incoming_internal_count: 1,
				suggestions_existing_count: 1,
				missing_suggestions: ['missing-person']
			},
			content_stats: {
				has_tldr: true,
				has_testimony_ledger: true
			}
		});
		expect(alpha?.diagnostic_scores.frontmatter).toBeGreaterThan(80);
	});
});
