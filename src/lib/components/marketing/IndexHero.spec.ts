// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import IndexHero from './IndexHero.svelte';

describe('IndexHero', () => {
	afterEach(cleanup);

	it('renders the supplied descriptive image alt text', () => {
		render(IndexHero, {
			props: {
				title: 'The Enneagram, decoded.',
				imageSrc: '/greek_pantheon.webp',
				imageAlt: 'Greek pantheon representing the nine Enneagram personality types'
			}
		});

		expect(
			screen.getByAltText('Greek pantheon representing the nine Enneagram personality types')
		).toBeTruthy();
	});
});
