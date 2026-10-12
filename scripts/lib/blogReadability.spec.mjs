// scripts/lib/blogReadability.spec.mjs
import { describe, expect, it } from 'vitest';
import { LIMITS, findFlags, profile, splitBlocks, withoutQuotes } from './blogReadability.mjs';

const sentence = (words) => `${Array.from({ length: words }, (_, i) => `word${i}`).join(' ')}.`;
const block = (words) => {
	const half = Math.floor(words / 2);
	return `Start ${sentence(half - 1)} Then ${sentence(words - half - 1)}`;
};
const flagKeys = (markdown) => findFlags(profile(markdown)).map((f) => f.key);

describe('splitBlocks', () => {
	it('classifies blocks and drops frontmatter-era noise', () => {
		const blocks = splitBlocks(
			[
				'<script>import X from "x";</script>',
				'<!-- QUALITY GRADE: 9 -->',
				'## A heading',
				'A plain paragraph.',
				'> "A set-off quote."',
				'- one\n- two',
				'<div class="iframe-container">\n<iframe src="https://www.youtube.com/embed/x"></iframe>\n</div>',
				'<p class="firstLetter">An opening paragraph.</p>',
				'<QuickAnswer question="Why?">',
				'</QuickAnswer>'
			].join('\n\n')
		);
		expect(blocks.map((b) => b.kind)).toEqual([
			'heading',
			'paragraph',
			'quote',
			'list',
			'media',
			'paragraph'
		]);
		expect(blocks[1].section).toBe('A heading');
	});
});

describe('profile', () => {
	it('flags a wall of equal blocks with no set-off quotes', () => {
		const quote = '"I said a thing that runs to well over eight words here."';
		const body = Array.from({ length: 12 }, () => `${block(80)} She said: ${quote}`).join('\n\n');
		const metrics = profile(`---\ntitle: T\npublished: true\n---\n\n## One\n\n${body}\n`);
		expect(metrics.medianParagraph).toBeGreaterThan(LIMITS.medianParagraph.max);
		expect(metrics.longPct).toBe(100);
		expect(metrics.shortPct).toBe(0);
		expect(metrics.longRun).toBe(12);
		expect(metrics.setOffQuotePct).toBe(0);
		expect(flagKeys(`## One\n\n${body}\n`)).toEqual(
			expect.arrayContaining([
				'medianParagraph',
				'longPct',
				'shortPct',
				'longRun',
				'unbrokenStretch',
				'heaviestSection',
				'setOffQuotePct',
				'colonQuotePer1000'
			])
		);
	});

	it('passes a page that mixes short lines, blocks and breaks', () => {
		const section = [
			'## Section',
			block(75),
			'She did quit.',
			'> "A line that gets its own block and runs past eight words."',
			block(40),
			block(18),
			'- first\n- second'
		].join('\n\n');
		expect(flagKeys(`${section}\n\n${section}\n\n${section}\n`)).toEqual([]);
	});

	it('breaks a stretch at any non-paragraph block and resets at headings', () => {
		const metrics = profile(
			[block(300), block(300), '> "quote"', block(100), '## Next', block(50)].join('\n\n')
		);
		expect(metrics.unbrokenStretch).toBe(600);
		expect(metrics.where.unbrokenStretch.section).toBe('(opening)');
		expect(metrics.where.heaviestSection).toEqual({ name: '(opening)', words: 701 });
	});

	it('counts voice tics on author prose, never inside quotations', () => {
		const metrics = profile(
			[
				`${block(30)} She told them: "this profile is not mine and I never did that."`,
				`${block(30)} This profile does not count it.`,
				`${block(30)} It is a pivotal moment—truly.`
			].join('\n\n')
		);
		expect(metrics.selfReference).toBe(1);
		expect(metrics.where.negativeEndings).toHaveLength(1);
		expect(metrics.emDashes).toBe(1);
		expect(metrics.where.stockPhrases).toEqual(['pivotal']);
	});

	it('skips the set-off quote check when a page has few quotes', () => {
		expect(
			profile(`${block(40)} She said "yes, of course I would do that again tomorrow."`)
				.setOffQuotePct
		).toBe(null);
	});
});

describe('helpers', () => {
	it('withoutQuotes removes straight and curly quoted spans', () => {
		expect(
			withoutQuotes('He said "no, never" and then “not once” left.').replace(/\s+/g, ' ')
		).toBe('He said and then left.');
	});

	it('findFlags honours min and max and ignores missing values', () => {
		const flags = findFlags(
			{ longPct: 41, shortPct: 9, setOffQuotePct: null, medianParagraph: 60 },
			LIMITS
		);
		expect(flags.map((f) => f.key)).toEqual(['longPct', 'shortPct']);
	});
});
