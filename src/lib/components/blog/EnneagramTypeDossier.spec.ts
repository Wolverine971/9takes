// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import EnneagramTypeDossier from './EnneagramTypeDossier.svelte';

describe('EnneagramTypeDossier', () => {
	afterEach(cleanup);

	it('derives descriptive alt text from the Enneagram profile', () => {
		render(EnneagramTypeDossier, {
			props: {
				type: 5,
				archetype: 'The Investigator'
			}
		});

		expect(
			screen.getByAltText('Greek pantheon representing Enneagram Type 5, The Investigator')
		).toBeTruthy();
	});
});
