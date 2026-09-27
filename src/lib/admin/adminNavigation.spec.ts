// src/lib/admin/adminNavigation.spec.ts
import { describe, expect, it } from 'vitest';
import { adminNavGroups, getAdminRouteContext, isAdminNavActive } from './adminNavigation';

const item = (href: string) => {
	const found = adminNavGroups.flatMap((group) => group.items).find((i) => i.href === href);
	if (!found) throw new Error(`No nav item ${href}`);
	return found;
};

describe('isAdminNavActive', () => {
	it('lights up only the most specific item', () => {
		expect(isAdminNavActive(item('/admin/consulting/notes'), '/admin/consulting/notes')).toBe(true);
		expect(isAdminNavActive(item('/admin/consulting'), '/admin/consulting/notes')).toBe(false);
	});

	it('keeps the parent active on its other sub-pages', () => {
		expect(isAdminNavActive(item('/admin/consulting'), '/admin/consulting/clients/abc')).toBe(true);
		expect(isAdminNavActive(item('/admin/consulting/notes'), '/admin/consulting/clients')).toBe(
			false
		);
	});

	it('respects exact matches', () => {
		expect(isAdminNavActive(item('/admin'), '/admin')).toBe(true);
		expect(isAdminNavActive(item('/admin'), '/admin/users')).toBe(false);
	});
});

describe('getAdminRouteContext', () => {
	it('labels the notes inbox', () => {
		expect(getAdminRouteContext('/admin/consulting/notes').label).toBe('Notes');
		expect(getAdminRouteContext('/admin/consulting/sessions').label).toBe('Sessions');
	});
});
