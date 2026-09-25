// scripts/lib/peopleCrosslinks.spec.mjs
import { describe, expect, it } from 'vitest';
import { findPeopleToPeopleOpportunities, findPersonMention } from './peopleCrosslinks.js';

const prose = (s) => `${s} This sentence pads the line past the prose minimum.`;

describe('findPersonMention', () => {
	it('finds the first plain-prose mention', () => {
		const body = [
			'## Steve Carell heading',
			'',
			prose('He was an understudy for Steve Carell.')
		].join('\n');
		const hit = findPersonMention(body, 'Steve Carell');
		expect(hit?.bodyLine).toBe(3);
		expect(hit?.anchor).toBe('Steve Carell');
	});

	it('skips existing links, blockquotes, bold spans and quoted speech', () => {
		const body = [
			prose('Already linked: [Steve Carell](/personality-analysis/steve-carell).'),
			prose('> Steve Carell is quoted here.'),
			prose('**Steve Carell** is bold.'),
			prose('She said "I met Steve Carell once."')
		].join('\n');
		expect(findPersonMention(body, 'Steve Carell')).toBeNull();
	});

	it('does not match a one-word name inside a longer name', () => {
		const body = [
			prose('According to J Prince, the track was stopped.'),
			prose('She spoke on Prince Harry and Oprah’s series.')
		].join('\n');
		expect(findPersonMention(body, 'Prince')).toBeNull();
		expect(
			findPersonMention(prose("Without Me took aim at Prince's symbol."), 'Prince')
		).not.toBeNull();
		expect(
			findPersonMention(prose('On the first Jynxzi Podcast episode he said so.'), 'Jynxzi')
		).not.toBeNull();
	});

	it('flags a type claim that disagrees with the page', () => {
		const hit = findPersonMention(
			prose('Compare Jimmy Carter, a Type 9 through and through.'),
			'Jimmy Carter',
			2
		);
		expect(hit?.typeClaim).toBe(9);
	});
});

describe('findPeopleToPeopleOpportunities', () => {
	const node = (url, { inBlog = 0, inPeople = 0, outPeople = [] } = {}) => ({
		kind: 'person',
		url,
		inBlog: new Set(Array.from({ length: inBlog }, (_, i) => `/b${i}`)),
		inPeople: new Set(Array.from({ length: inPeople }, (_, i) => `/p${i}`)),
		outPeople,
		outBlog: [],
		outOther: []
	});
	const P = '/personality-analysis/';
	const people = new Map([
		[`${P}carell`, { name: 'Steve Carell', enneagram: 9, draftFile: 'x/carell.md', body: '' }],
		[`${P}famous`, { name: 'Well Linked', enneagram: 3, draftFile: 'x/famous.md', body: '' }],
		[
			`${P}fey`,
			{
				name: 'Tina Fey',
				draftFile: 'x/fey.md',
				body: prose('Steve Carell and Well Linked were there.')
			}
		],
		[
			`${P}colbert`,
			{
				name: 'Stephen Colbert',
				draftFile: 'x/colbert.md',
				body: prose('An understudy for Steve Carell.')
			}
		]
	]);
	const graph = {
		nodes: new Map([
			[`${P}carell`, node(`${P}carell`)],
			[`${P}famous`, node(`${P}famous`, { inBlog: 2, inPeople: 3 })],
			[`${P}fey`, node(`${P}fey`)],
			[`${P}colbert`, node(`${P}colbert`)]
		])
	};

	it('suggests links only to people pages that need them', () => {
		const { picked } = findPeopleToPeopleOpportunities({ graph, people });
		expect(picked.map((c) => c.target.url)).toEqual([`${P}carell`, `${P}carell`]);
	});

	it('honors skipped ids and the per-source cap', () => {
		const skipped = new Set([`${P}fey -> ${P}carell`]);
		const { picked } = findPeopleToPeopleOpportunities({ graph, people, skipped });
		expect(picked.map((c) => c.source.url)).toEqual([`${P}colbert`]);
		const capped = findPeopleToPeopleOpportunities({ graph, people, options: { perSource: 0 } });
		expect(capped.picked).toHaveLength(0);
	});
});
