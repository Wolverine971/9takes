// src/lib/layout/pageShell.spec.ts
import { describe, expect, it } from 'vitest';
import {
	CONTAINED_PAGE_SHELL,
	OWNED_PAGE_SHELL,
	resolvePageShell,
	withOwnedPageShell
} from './pageShell';

describe('page shell contract', () => {
	it('defaults routes to the contained reading shell', () => {
		expect(resolvePageShell()).toBe(CONTAINED_PAGE_SHELL);
		expect(resolvePageShell({})).toBe(CONTAINED_PAGE_SHELL);
	});

	it('lets a route own its width without dropping its existing data', () => {
		const data = withOwnedPageShell({ title: 'Questions', count: 9 });

		expect(data).toEqual({ title: 'Questions', count: 9, pageShell: OWNED_PAGE_SHELL });
		expect(resolvePageShell(data)).toBe(OWNED_PAGE_SHELL);
	});
});
