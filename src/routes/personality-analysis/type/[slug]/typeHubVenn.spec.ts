// src/routes/personality-analysis/type/[slug]/typeHubVenn.spec.ts
import { describe, expect, it } from 'vitest';
import { groupPeopleByNiche } from './typeHubGroups';
import { buildVennLayout, findCrossovers, type VennLayout } from './typeHubVenn';

const people = [
	{ slug: 'jon-bernthal', type: ['movieStar', 'screen-icon'] },
	{ slug: 'tom-hardy', type: ['celebrity', 'screen-icon'] },
	{ slug: 'shia-labeouf', type: ['celebrity', 'screen-icon'] },
	{ slug: 'gordon-ramsay', type: ['celebrity', 'celebrity-image'] },
	{ slug: 'amy-poehler', type: ['comedian', 'movieStar', 'sketch-comic'] },
	{ slug: 'chelsea-handler', type: ['comedian', 'stand-up'] },
	{ slug: 'druski', type: ['comedian', 'creator'] },
	{ slug: 'joe-rogan', type: ['creator', 'comedian', 'podcaster'] },
	{ slug: 'mr-beast', type: ['creator', 'viral-entertainer'] },
	{ slug: 'ishowspeed', type: ['creator', 'streamer'] },
	{ slug: 'tyler1', type: ['creator', 'streamer'] },
	{ slug: 'duke-dennis', type: ['creator', 'streamer'] },
	{ slug: 'andrew-tate', type: ['creator', 'athlete', 'business-creator'] },
	{ slug: 'ilona-maher', type: ['celebrity', 'influencer', 'athlete'] },
	{ slug: 'conor-mcgregor', type: ['celebrity', 'athlete'] },
	{ slug: 'khabib', type: ['celebrity', 'athlete'] },
	{ slug: 'rihanna', type: ['musician', 'pop-star'] },
	{ slug: 'cardi-b', type: ['musician', 'rapper'] },
	{ slug: 'jeff-bezos', type: ['techie', 'entrepreneur'] },
	{ slug: 'reed-hastings', type: ['techie', 'entrepreneur'] },
	{ slug: 'napoleon', type: ['historical', 'historical-leader'] },
	{ slug: 'ernest-hemingway', type: ['historical', 'author', 'novelist'] },
	{ slug: 'dr-phil', type: ['other'] }
];

function allFaces(layout: VennLayout) {
	return [
		...layout.fields.flatMap((field) =>
			field.lanes.flatMap((lane) => lane.faces.map((face) => ({ ...face, field: field.slug })))
		),
		...layout.overlaps.flatMap((overlap) =>
			overlap.faces.map((face) => ({ ...face, field: `${overlap.a}|${overlap.b}` }))
		)
	];
}

describe('findCrossovers', () => {
	it('keeps every shown secondary field in order and ignores broad fame tags', () => {
		const groups = groupPeopleByNiche(
			[
				{ slug: 'actor-and-host', type: ['movieStar', 'creator', 'musician'] },
				{ slug: 'singer', type: ['musician', 'celebrity'] },
				{ slug: 'host', type: ['creator'] },
				{ slug: 'novelist', type: ['historical', 'author'] },
				{ slug: 'historian-subject', type: ['historical'] }
			],
			'3',
			{ minFieldSize: 1 }
		);
		const fields = findCrossovers(groups);
		expect(fields.get('actor-and-host')).toEqual(['creator-media', 'music']);
		expect(fields.get('novelist')).toEqual(['history']);
		expect(fields.has('singer')).toBe(false);
	});

	it('never treats the catch-all as a field in common', () => {
		const groups = groupPeopleByNiche([
			{ slug: 'actor-and-musician', type: ['movieStar', 'musician'] },
			{ slug: 'singer-one', type: ['musician'] },
			{ slug: 'singer-two', type: ['musician'] },
			{ slug: 'singer-three', type: ['musician'] }
		]);
		expect(groups.map((group) => group.slug)).toEqual(['music', 'more']);
		expect(findCrossovers(groups).size).toBe(0);
	});

	it('retains people in the field list when an overlap fills up', () => {
		const actors = Array.from({ length: 24 }, (_, index) => ({
			slug: `actor-${index}`,
			type: ['movieStar', 'musician']
		}));
		const groups = groupPeopleByNiche([...actors, { slug: 'singer', type: ['musician'] }], '3', {
			minFieldSize: 1
		});
		const memberships = findCrossovers(groups);
		for (const shape of ['wide', 'tall'] as const) {
			const layout = buildVennLayout(groups, shape, memberships);
			expect(layout.overlaps.flatMap((overlap) => overlap.faces).length).toBeLessThan(
				actors.length
			);
			expect([...memberships.keys()]).toEqual(actors.map((person) => person.slug));
			expect([...memberships.values()].every((fields) => fields.includes('music'))).toBe(true);
			expect(allFaces(layout)).toHaveLength(actors.length + 1);
		}
	});
});

describe('buildVennLayout', () => {
	const groups = groupPeopleByNiche(people, '8', { minFieldSize: 1 });

	for (const shape of ['wide', 'tall'] as const) {
		describe(shape, () => {
			const layout = buildVennLayout(groups, shape);
			const faces = allFaces(layout);
			const fieldOf = new Map(layout.fields.map((field) => [field.slug, field]));

			it('places every person exactly once', () => {
				expect(faces.map((face) => face.slug).sort()).toEqual(
					people.map((person) => person.slug).sort()
				);
			});

			it('keeps faces apart and inside the canvas', () => {
				for (let i = 0; i < faces.length; i++) {
					const a = faces[i];
					expect(a.x).toBeGreaterThanOrEqual(0);
					expect(a.y).toBeGreaterThanOrEqual(0);
					expect(a.x).toBeLessThanOrEqual(layout.width);
					expect(a.y).toBeLessThanOrEqual(layout.height);
					for (let j = i + 1; j < faces.length; j++) {
						const b = faces[j];
						expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(layout.faceR * 1.85);
					}
				}
			});

			it('puts crossovers inside both of their circles', () => {
				expect(layout.overlaps.length).toBeGreaterThan(0);
				for (const overlap of layout.overlaps) {
					for (const face of overlap.faces) {
						for (const slug of [overlap.a, overlap.b]) {
							const field = fieldOf.get(slug)!;
							expect(Math.hypot(face.x - field.x, face.y - field.y)).toBeLessThan(field.r);
						}
					}
				}
			});

			it('keeps every other face inside its own circle only', () => {
				for (const field of layout.fields) {
					for (const lane of field.lanes) {
						for (const face of lane.faces) {
							expect(Math.hypot(face.x - field.x, face.y - field.y)).toBeLessThan(field.r);
							for (const other of layout.fields) {
								if (other === field) continue;
								expect(Math.hypot(face.x - other.x, face.y - other.y)).toBeGreaterThan(
									other.r - layout.faceR * 0.5
								);
							}
						}
					}
				}
			});

			it('never overlaps two fields that share nobody', () => {
				const linked = new Set(layout.overlaps.map((overlap) => `${overlap.a}|${overlap.b}`));
				for (let i = 0; i < layout.fields.length; i++) {
					for (let j = i + 1; j < layout.fields.length; j++) {
						const a = layout.fields[i];
						const b = layout.fields[j];
						const key = a.slug < b.slug ? `${a.slug}|${b.slug}` : `${b.slug}|${a.slug}`;
						if (linked.has(key)) continue;
						expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(a.r + b.r - 1);
					}
				}
			});

			it('is deterministic', () => {
				expect(buildVennLayout(groups, shape)).toEqual(layout);
			});
		});
	}

	it('handles an empty type', () => {
		expect(buildVennLayout([])).toMatchObject({ width: 0, height: 0, fields: [], overlaps: [] });
	});
});
