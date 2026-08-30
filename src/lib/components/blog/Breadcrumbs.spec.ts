// src/lib/components/blog/Breadcrumbs.spec.ts
// @vitest-environment jsdom

import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Breadcrumbs from './Breadcrumbs.svelte';

describe('Breadcrumbs', () => {
	it('keeps an opted-in single parent crumb navigable', () => {
		const { getByRole } = render(Breadcrumbs, {
			props: {
				items: [{ name: 'Questions', url: '/questions' }],
				linkSingleItem: true
			}
		});

		expect(getByRole('link', { name: 'Questions' }).getAttribute('href')).toBe('/questions');
	});
});
