// scripts/cluster-tags.spec.mjs
import { describe, expect, it } from 'vitest';
import matter from 'gray-matter';
import { readReviewedPersonTypes } from './generate-person-niches.mjs';
import reviewedTypes from '../src/lib/generated/reviewedPersonTypes.json' with { type: 'json' };

it('ships the reviewed profile tags exactly as authored', () => {
	expect(reviewedTypes).toEqual(readReviewedPersonTypes());
});
import { appendTypeTag } from './add-cluster-tags.mjs';
import { planClusterTagUpdate } from './push-cluster-tags.mjs';

describe('appendTypeTag', () => {
	it('extends an inline array in its own quote style', () => {
		const md = "---\ntitle: 'A'\ntype: ['musician', 'celebrity']\n---\n\nBody.\n";
		const out = appendTypeTag(md, 'pop-star');
		expect(out).toBe(md.replace("'celebrity']", "'celebrity', 'pop-star']"));
		expect(matter(out ?? '').data.type).toEqual(['musician', 'celebrity', 'pop-star']);
	});

	it('extends a block list and leaves the rest of the file alone', () => {
		const md =
			'---\ntype:\n  - movieStar\n  - celebrity\nperson: A\n---\n\ntype: not frontmatter\n';
		const out = appendTypeTag(md, 'rising-star') ?? '';
		expect(matter(out).data).toEqual({
			type: ['movieStar', 'celebrity', 'rising-star'],
			person: 'A'
		});
		expect(out.endsWith('\ntype: not frontmatter\n')).toBe(true);
	});

	it('refuses shapes it cannot edit safely', () => {
		expect(appendTypeTag('---\ntitle: A\n---\n\nBody', 'pop-star')).toBeNull();
		expect(appendTypeTag('---\ntype: musician\n---\n\nBody', 'pop-star')).toBeNull();
		expect(appendTypeTag('No frontmatter', 'pop-star')).toBeNull();
	});
});

describe('planClusterTagUpdate', () => {
	it('adds cluster tags when the field types match', () => {
		expect(planClusterTagUpdate(['musician'], ['musician', 'pop-star'])).toEqual([
			'musician',
			'pop-star'
		]);
		expect(
			planClusterTagUpdate(['celebrity', 'celebrity-image'], ['celebrity', 'celebrity-image'])
		).toBeNull();
	});

	it('never changes field types or drops a live tag', () => {
		expect(
			planClusterTagUpdate(['celebrity'], ['celebrity', 'athlete', 'celebrity-image'])
		).toBeNull();
		expect(
			planClusterTagUpdate(['movieStar', 'celebrity'], ['celebrity', 'movieStar', 'screen-icon'])
		).toBeNull();
		expect(planClusterTagUpdate(['musician', 'rapper'], ['musician', 'pop-star'])).toBeNull();
	});

	it('takes added field types only when --allow-add names them', () => {
		const allow = new Set(['athlete']);
		expect(
			planClusterTagUpdate(
				['celebrity', 'celebrity-image'],
				['celebrity', 'athlete', 'celebrity-image'],
				allow
			)
		).toEqual(['celebrity', 'athlete', 'celebrity-image']);
		// Other added field types, dropped or reordered live entries still block.
		expect(planClusterTagUpdate(['creator'], ['creator', 'musician', 'athlete'], allow)).toBeNull();
		expect(
			planClusterTagUpdate(['creator', 'celebrity'], ['athlete', 'creator'], allow)
		).toBeNull();
		expect(
			planClusterTagUpdate(['movieStar', 'celebrity'], ['celebrity', 'movieStar', 'athlete'], allow)
		).toBeNull();
	});
});
