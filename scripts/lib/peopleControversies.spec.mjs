// scripts/lib/peopleControversies.spec.mjs
import { describe, expect, it } from 'vitest';
import {
	articleBody,
	evaluateControversies,
	parsePersonDraft,
	validateRegistry
} from './peopleControversies.mjs';

const draft = (body, { slug = 'jane-doe', published = true, faq = '' } = {}) =>
	`---\nperson: '${slug}'\npublished: ${published}\nfaq: '${faq}'\n---\n${body}`;

describe('articleBody', () => {
	it('drops frontmatter and HTML comments so notes and FAQs cannot satisfy the gate', () => {
		const md = draft('Visible text.\n<!-- EDITOR: mention the lawsuit -->', { faq: 'lawsuit' });
		const body = articleBody(md);
		expect(body).toContain('Visible text.');
		expect(body).not.toMatch(/lawsuit/);
	});
});

describe('parsePersonDraft', () => {
	it('reads slug and published flag', () => {
		expect(parsePersonDraft(draft('x', { slug: 'a-b', published: false }))).toMatchObject({
			slug: 'a-b',
			published: false
		});
	});
});

describe('validateRegistry', () => {
	it('accepts a well-formed registry and skips _ keys', () => {
		const registry = {
			_readme: 'notes',
			'jane-doe': [{ id: 'x', label: 'X', status: 'open', mustMention: ['lawsuit'] }]
		};
		expect(validateRegistry(registry)).toEqual([]);
	});

	it('flags bad status, empty patterns, bad regex and duplicate ids', () => {
		const registry = {
			'jane-doe': [
				{ id: 'x', label: 'X', status: 'maybe', mustMention: ['('] },
				{ id: 'x', label: 'Y', status: 'open', mustMention: [] }
			]
		};
		const problems = validateRegistry(registry).join('\n');
		expect(problems).toMatch(/status must be/);
		expect(problems).toMatch(/invalid regex/);
		expect(problems).toMatch(/duplicate id/);
		expect(problems).toMatch(/at least one pattern/);
	});
});

describe('evaluateControversies', () => {
	const people = new Map([
		['jane-doe', parsePersonDraft(draft('In 2021 a court found her liable for defamation.'))],
		['john-roe', parsePersonDraft(draft('Nothing here.', { slug: 'john-roe' }))]
	]);

	it('passes when every pattern matches, case-insensitively', () => {
		const registry = {
			'jane-doe': [
				{ id: 'd', label: 'Defamation', status: 'required', mustMention: ['DEFAMATION', '2021'] }
			]
		};
		const result = evaluateControversies(registry, people);
		expect(result.failures).toEqual([]);
		expect(result.covered).toHaveLength(1);
	});

	it('fails required entries and lists missing patterns', () => {
		const registry = {
			'john-roe': [
				{ id: 'f', label: 'Fraud', status: 'required', mustMention: ['fraud', 'Nothing'] }
			]
		};
		const { failures } = evaluateControversies(registry, people);
		expect(failures).toHaveLength(1);
		expect(failures[0].missing).toEqual(['fraud']);
	});

	it('reports open entries as gaps without failing', () => {
		const registry = {
			'john-roe': [{ id: 'f', label: 'Fraud', status: 'open', mustMention: ['fraud'] }]
		};
		const result = evaluateControversies(registry, people);
		expect(result.failures).toEqual([]);
		expect(result.openGaps).toHaveLength(1);
	});

	it('fails required entries whose page is missing', () => {
		const registry = {
			'ghost-person': [{ id: 'g', label: 'G', status: 'required', mustMention: ['x'] }]
		};
		expect(evaluateControversies(registry, people).failures[0].reason).toBe(
			'no draft with this slug'
		);
	});
});
