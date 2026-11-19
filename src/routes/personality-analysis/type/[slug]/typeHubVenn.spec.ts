// src/routes/personality-analysis/type/[slug]/typeHubVenn.spec.ts
import { describe, expect, it } from 'vitest';
import { groupPeopleByNiche } from './typeHubGroups';
import { buildVennLayout, fieldsForPerson, findCrossovers, type VennLayout } from './typeHubVenn';

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

describe('fieldsForPerson', () => {
	it('maps tags to hub fields in authored order, ignoring the broad celebrity tag', () => {
		expect(fieldsForPerson({ slug: 'a', type: ['celebrity', 'athlete', 'creator'] })).toEqual([
			'athletes',
			'creator-media'
		]);
		expect(fieldsForPerson({ slug: 'b', type: ['historical', 'author'] })).toEqual([
			'history',
			'authors-thinkers'
		]);
		expect(fieldsForPerson({ slug: 'c', type: ['celebrity', 'celebrity-image'] })).toEqual([]);
	});
});

describe('findCrossovers', () => {
	it('pairs each crossover with their second shown field', () => {
		const groups = groupPeopleByNiche(people, '8', { minFieldSize: 1 });
		const crossovers = findCrossovers(groups);
		expect(crossovers.get('andrew-tate')).toBe('creator-media');
		expect(crossovers.get('joe-rogan')).toBe('comedy');
		expect(crossovers.get('amy-poehler')).toBe('film-tv');
		expect(crossovers.get('ernest-hemingway')).toBe('history');
		expect(crossovers.has('mr-beast')).toBe(false);
		// Nobody crosses into or out of the catch-all group.
		expect(crossovers.has('dr-phil')).toBe(false);
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
