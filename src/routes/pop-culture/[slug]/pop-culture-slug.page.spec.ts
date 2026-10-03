// src/routes/pop-culture/[slug]/pop-culture-slug.page.spec.ts
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { popCultureRedirects } from '$lib/data/popCultureRedirects';
import { load } from './+page';

type LoadEvent = Parameters<typeof load>[0];

const callLoad = (slug: string, search = '') =>
	load({
		params: { slug },
		url: new URL(`https://9takes.com/pop-culture/${slug}${search}`),
		data: { posts: [] }
	} as unknown as LoadEvent);

describe('pop-culture permanent redirects', () => {
	it('301s the old Trump Type 8 slug to the Type 3 rewrite, keeping the query string', async () => {
		await expect(
			callLoad('trump-type-8-vs-biden-type-2', '?utm_source=instagram')
		).rejects.toMatchObject({
			status: 301,
			location: '/pop-culture/trump-type-3-vs-biden-type-2?utm_source=instagram'
		});
	});

	it.each(Object.entries(popCultureRedirects))(
		'%s points at a live post with no redirect chain',
		(source, target) => {
			expect(target).toMatch(/^\/pop-culture\/[a-z0-9-]+$/);

			const targetSlug = target.replace('/pop-culture/', '');
			expect(targetSlug).not.toBe(source);
			expect(popCultureRedirects[targetSlug]).toBeUndefined();

			const file = join(process.cwd(), 'src/blog/pop-culture', `${targetSlug}.md`);
			expect(existsSync(file)).toBe(true);
			expect(readFileSync(file, 'utf8')).toMatch(/^published:\s*true\s*$/m);

			const oldFile = join(process.cwd(), 'src/blog/pop-culture', `${source}.md`);
			expect(existsSync(oldFile)).toBe(false);
		}
	);
});
