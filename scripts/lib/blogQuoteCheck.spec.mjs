// scripts/lib/blogQuoteCheck.spec.mjs
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
	checkQuotes,
	cleanCaptions,
	extractQuotes,
	matchQuotes,
	normalizeForMatch
} from './blogQuoteCheck.mjs';
import { fieldIssues, voiceAdvisories } from './blogPipelineChecks.mjs';

const dirs = [];
afterEach(async () => {
	await Promise.all(dirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

const page = (body, data = '') => `---\ntitle: Example\n${data}---\n\n${body}\n`;
const snapshot = (text, file = 'S1.txt') => ({
	id: file.slice(0, file.indexOf('.')),
	file,
	norm: normalizeForMatch(text)
});
const SOURCE =
	'I never planned any of it, she said. "I just kept saying yes to the next thing." Later she added that the work was the only place she felt calm. >> [00:12:04] I don\'t think about legacy at all, honestly.';

describe('quote extraction', () => {
	it('finds straight, curly and block quotes and skips short ones', () => {
		const { quotes, short } = extractQuotes(
			page(
				'She said, "I just kept saying yes to the next thing." Then “the work was the only place she felt calm” and "No."\n\n> I don\'t think about legacy at all, honestly.\n> — Example, 2024'
			)
		);
		expect(quotes.map((q) => q.quote)).toEqual([
			'the work was the only place she felt calm',
			'I just kept saying yes to the next thing.',
			"I don't think about legacy at all, honestly."
		]);
		expect(short).toBe(1);
	});

	it('refuses to pair an odd number of quotation marks instead of checking the wrong text', () => {
		const { quotes, unbalanced } = extractQuotes(
			page('He stood 6\'2" and said "I just kept saying yes to the next thing." Then left.')
		);
		expect(quotes).toEqual([]);
		expect(unbalanced).toHaveLength(1);
	});

	it('reads quotations in the description and FAQ answers', () => {
		const { quotes } = extractQuotes(
			page(
				'Body.',
				'description: \'She says "the work was the only place she felt calm" often.\'\nfaqs:\n  - question: Q\n    answer: \'"I just kept saying yes to the next thing."\'\n'
			)
		);
		expect(quotes).toHaveLength(2);
	});

	it('ignores HTML attributes, comments and markdown link syntax', () => {
		const { quotes } = extractQuotes(
			page(
				'<a href="https://example.test/a-long-address-here">link</a> <!-- "not a real quote at all here" --> She said "I just kept [saying yes](/x) to the *next* thing."'
			)
		);
		expect(quotes.map((q) => q.quote)).toEqual(['I just kept saying yes to the next thing.']);
	});
});

describe('quote matching', () => {
	it('matches across punctuation, case, apostrophes and caption markers', () => {
		const result = matchQuotes(
			page(
				'"I just kept saying yes to the next thing." And "I dont think about legacy at all, honestly."'
			),
			[snapshot(SOURCE)]
		);
		expect(result).toMatchObject({ quotes_checked: 2, matched: 2, misses: [] });
	});

	it('accepts ellipses and bracketed insertions when every piece is in one source', () => {
		const result = matchQuotes(
			page(
				'"I never planned any of it ... I just kept saying yes" and "[The work] was the only place she felt calm."'
			),
			[snapshot(SOURCE)]
		);
		expect(result.matched).toBe(2);
	});

	it('flags a reworded quote as altered and an absent one as not found', () => {
		const result = matchQuotes(
			page(
				'"I just kept on saying yes to the next thing that came along." And "Ambition is a kind of hunger nobody admits to."'
			),
			[snapshot(SOURCE)]
		);
		expect(result.matched).toBe(0);
		expect(result.misses.map((m) => m.status).sort()).toEqual(['not_found', 'not_found']);
		const joined = matchQuotes(
			page('"I never planned any of it. I just kept saying yes to the next thing."'),
			[snapshot(SOURCE)]
		);
		// The words are all there, but the source breaks them with "she said".
		expect(joined.misses[0]).toMatchObject({ status: 'altered', closest_snapshot: 'S1.txt' });
	});

	it('collapses rolling caption cues so a line split across cues still matches', () => {
		const vtt =
			'WEBVTT\n\n00:00:01.000 --> 00:00:03.000\nI just kept saying\n\n00:00:03.000 --> 00:00:05.000\nI just kept saying\nyes to the next thing\n';
		expect(cleanCaptions(vtt)).toBe('I just kept saying yes to the next thing');
	});
});

describe('checkQuotes on a snapshot folder', () => {
	it('reports unavailable when nothing was saved, and names sources with no saved text', async () => {
		const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'quotes-'));
		dirs.push(dir);
		const markdown = page('"I just kept saying yes to the next thing."');
		expect(await checkQuotes(markdown, dir)).toMatchObject({ available: false });
		await fs.writeFile(path.join(dir, 'S1.txt'), SOURCE);
		expect(
			await checkQuotes(markdown, dir, [
				{ id: 'S1', access: 'opened' },
				{ id: 'S2', access: 'opened' },
				{ id: 'S3', access: 'unavailable' }
			])
		).toMatchObject({ available: true, matched: 1, sources_without_snapshot: ['S2'] });
	});
});

describe('publisher and house-voice checks', () => {
	it('flags frontmatter the publisher drops or rejects', () => {
		expect(
			fieldIssues({
				citations: ['https://ok.test/a', 'http://old.test/b'],
				birth_date: '1997-01'
			}).map((issue) => issue.split(':').slice(0, 3).join(':'))
		).toEqual(['publish_field:citations:not_https', 'publish_field:birth_date:not_iso']);
		expect(fieldIssues({ citations: ['https://ok.test/a'], birth_date: '1997-01-03' })).toEqual([]);
	});

	it('asks a standard profile to commit and argue the rival in a "Why not" section', () => {
		const hedged = page(
			"## What is Example's personality type?\n\nThe record leans Type 9, only narrowly, with Type 6 close behind.\n\n## A choice\n\nText."
		);
		expect(
			voiceAdvisories(hedged, 'standard', 2500).map((n) => n.split(':').slice(0, 2).join(':'))
		).toEqual(['voice:hedged_type_answer', 'voice:missing_why_not_section']);
		const committed = page(
			"## What is Example's personality type?\n\nExample's personality type is Enneagram Type 9, the Peacemaker.\n\n## Why not Type 6?\n\nText."
		);
		expect(voiceAdvisories(committed, 'standard', 2500)).toEqual([]);
		// Open cases keep "leading read" by design.
		expect(voiceAdvisories(hedged, 'open_case', 2500)).toEqual([]);
		expect(voiceAdvisories(committed, 'standard', 4200)[0]).toContain('length:4200_words');
	});
});
