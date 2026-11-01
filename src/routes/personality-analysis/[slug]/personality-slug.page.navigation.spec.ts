// src/routes/personality-analysis/[slug]/personality-slug.page.navigation.spec.ts
// @vitest-environment jsdom
//
// Client-side navigation from one personality page to another reuses the page
// component (only `data` changes). Every section must follow the new person:
// header, TOC, FAQ, SEO head, related cards, and the client-mounted article
// placeholders (QuickAnswer etc.). Guards the runes migration, which dropped the
// {#key post.slug} wrappers that used to force those remounts.

import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$app/environment', () => ({
	browser: true,
	dev: false,
	building: false,
	version: 'test'
}));
vi.mock('$app/navigation', () => ({
	goto: vi.fn(),
	afterNavigate: vi.fn(),
	beforeNavigate: vi.fn(),
	onNavigate: vi.fn(),
	replaceState: vi.fn(),
	invalidateAll: vi.fn()
}));
vi.mock('$app/state', () => ({
	page: {
		url: new URL('https://9takes.com/personality-analysis/alpha-person'),
		params: {},
		data: {},
		state: {},
		status: 200,
		error: null,
		route: { id: null },
		form: null
	},
	navigating: { current: null },
	updated: { current: false }
}));
// The lazily loaded discussion widgets read public env at import time.
vi.mock('$env/dynamic/public', () => ({ env: {} }));
vi.mock('qrcode', () => ({ default: { toDataURL: vi.fn(() => Promise.resolve('data:,')) } }));

import Page from './+page.svelte';

function makeData(slug: string, person: string, type: number) {
	return {
		post: {
			slug,
			person,
			title: `${person} Personality`,
			meta_title: person,
			description: `About ${person}`,
			author: 'DJ Wayne',
			date: '2026-01-02',
			lastmod: '2026-02-03',
			published: true,
			enneagram: type,
			type: ['comedian'],
			suggestions: [],
			persona_title: `Persona of ${person}`,
			word_count: 1000,
			time_required: 'PT5M',
			faqs: [
				{ question: `${person} first question?`, answer: 'First answer' },
				{ question: `${person} second question?`, answer: 'Second answer' }
			],
			content: [
				`<p>${person} intro</p>`,
				`<h2 id="${slug}-one">${person} part one</h2><p>x</p>`,
				'<div id="component-quickanswer-0"><div data-ssr-fallback>fallback</div></div>',
				`<h2 id="${slug}-two">${person} part two</h2><p>y</p>`
			].join('')
		},
		headings: [
			{ level: 2, id: `${slug}-one`, text: `${person} part one` },
			{ level: 2, id: `${slug}-two`, text: `${person} part two` }
		],
		placeholders: [
			{
				id: 'component-quickanswer-0',
				type: 'QuickAnswer',
				props: { question: `${person} quick?`, children: `<p>${person} answer</p>` }
			}
		],
		suggestedPeople: [`${slug}-friend`],
		bridgeLinks: [{ label: 'Corpus stats', href: '/corpus-stats' }],
		relatedPosts: {
			sameNichePosts: [{ slug: `${slug}-related`, enneagram: type }],
			sameEnneagramPosts: []
		},
		isOpenCase: false,
		chorus: null
	};
}

async function settle() {
	await tick();
	await new Promise((resolve) => setTimeout(resolve, 20));
	await tick();
}

describe('personality page client-side navigation', () => {
	beforeEach(() => {
		// jsdom has neither; the page only needs them to exist.
		vi.stubGlobal(
			'IntersectionObserver',
			class {
				observe() {}
				unobserve() {}
				disconnect() {}
			}
		);
	});

	afterEach(() => {
		cleanup();
		vi.unstubAllGlobals();
		document.head.innerHTML = '';
	});

	it('moves every section to the new person when data changes', async () => {
		const { container, rerender } = render(Page, {
			// The fixture covers what the page reads, not the whole PageData type.
			props: { data: makeData('alpha-person', 'Alpha-Person', 7) as never }
		});
		await settle();

		expect(container.querySelector('#case-file-name')?.textContent).toContain('Alpha Person');
		expect(container.querySelector('.toc-link')?.getAttribute('href')).toBe('#alpha-person-one');
		expect(container.textContent).toContain('Alpha-Person first question?');
		expect(container.querySelector('#component-quickanswer-0')?.textContent).toContain(
			'Alpha-Person answer'
		);
		expect(container.querySelector('#component-quickanswer-0 [data-ssr-fallback]')).toBeNull();
		expect(document.head.innerHTML).toContain('Alpha Person');

		await rerender({ data: makeData('beta-person', 'Beta-Person', 4) as never });
		await settle();

		expect(container.querySelector('#case-file-name')?.textContent).toContain('Beta Person');
		expect(container.querySelector('.case-file-kicker')?.textContent).toContain('TYPE 4');
		expect(container.querySelector('.toc-link')?.getAttribute('href')).toBe('#beta-person-one');
		expect(container.textContent).toContain('Beta-Person first question?');
		expect(container.textContent).not.toContain('Alpha');
		expect(container.querySelector('#component-quickanswer-0')?.textContent).toContain(
			'Beta-Person answer'
		);
		expect(
			container.querySelector('a[href="/personality-analysis/beta-person-related"]')
		).not.toBeNull();
		expect(document.head.innerHTML).toContain('Beta Person');
		expect(document.head.innerHTML).not.toContain('Alpha Person');
	});
});
