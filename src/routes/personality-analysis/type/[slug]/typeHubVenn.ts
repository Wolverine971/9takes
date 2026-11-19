// src/routes/personality-analysis/type/[slug]/typeHubVenn.ts
// Lays out the type hub's Venn map: one circle per field (sized by how many people
// it holds), lanes packed inside as smaller circles, faces packed inside lanes, and
// crossover people (an actor who also makes music, a fighter who is also a creator)
// placed in the overlap between their two fields.
//
// Everything here is pure and deterministic, so the server computes it once per
// render and the page only positions elements. Units are abstract canvas units; the
// page scales them to whatever width it has.
//
// Geometry: each field's faces pack into an inner circle of radius `inner`. The
// drawn circle is `outer = inner + ring`. Two linked fields (they share crossovers)
// sit `inner_a + inner_b + max(ring_a, ring_b)` apart, so the lens where their drawn
// circles overlap never reaches into either pack: nothing but crossover faces lands
// in it. Rings start one face wide and only grow for a pair whose crossovers didn't
// fit, so one crowded overlap doesn't bloat every circle.

import { pack, hierarchy } from 'd3';
import { CLUSTER_FIELDS } from '$lib/personClusterTags.js';
import { normalizePeopleTypes } from '$lib/personalityCategories';
import type { TypeHubGroup } from './typeHubGroups';

type VennPerson = { slug: string; type?: unknown };

export type VennFace = { slug: string; x: number; y: number };

export type VennLane = {
	slug: string;
	label: string;
	x: number;
	y: number;
	r: number;
	faces: VennFace[];
};

export type VennField = {
	slug: string;
	label: string;
	shortLabel: string;
	accent: string | null;
	/** Everyone filed here, crossovers included. */
	count: number;
	x: number;
	y: number;
	/** Radius of the drawn circle. */
	r: number;
	/** Where the curved label sits on the rim, in degrees (-90 = top, 90 = bottom). */
	labelAngle: number;
	lanes: VennLane[];
};

export type VennOverlap = { a: string; b: string; faces: VennFace[] };

export type VennLayout = {
	width: number;
	height: number;
	/** Radius of one face slot (portrait + name). */
	faceR: number;
	fields: VennField[];
	overlaps: VennOverlap[];
};

/** One face slot: portrait plus a one-line name underneath. */
export const FACE_R = 38;
const FACE_PAD = 2;
const LANE_PAD = 8;
/** Ring around a field that shares no crossovers: room for its label. */
const PLAIN_RING = 20;
/** Clearance between circles that must not touch. */
const CIRCLE_GAP = 16;
const EDGE_PAD = 12;
/** Most a linked field's ring may grow to make room for crowded overlaps. */
const MAX_EXTRA_RING = FACE_R / 2;
const ITERATIONS = 900;

const BROAD = new Set(['celebrity']);

function key(value: string): string {
	return value.replace(/[^a-z0-9]/gi, '').toLowerCase();
}

/**
 * Every hub field a person's own tags point at, in authored order. 'celebrity' is
 * too broad to make anyone a crossover; 'historical' means History, 'athlete' means
 * Athletes.
 */
export function fieldsForPerson(person: VennPerson): string[] {
	const fields: string[] = [];
	const personKey = key(person.slug);
	for (const raw of normalizePeopleTypes(person.type)) {
		const k = key(raw);
		if (BROAD.has(k)) continue;
		const field =
			k === 'athlete'
				? 'athletes'
				: k === 'historical'
					? 'history'
					: (CLUSTER_FIELDS.find(
							({ rawTypes, excludeSlugs }) =>
								rawTypes.some((type) => key(type) === k) &&
								!excludeSlugs.some((slug) => key(slug) === personKey)
						)?.field ?? null);
		if (field && !fields.includes(field)) fields.push(field);
	}
	return fields;
}

/** person slug -> the second shown field they belong in (first in authored order). */
export function findCrossovers<T extends VennPerson>(
	groups: TypeHubGroup<T>[]
): Map<string, string> {
	const shown = new Set(groups.map((group) => group.slug).filter((slug) => slug !== 'other'));
	const crossovers = new Map<string, string>();
	for (const group of groups) {
		if (!shown.has(group.slug)) continue;
		for (const person of group.people) {
			const second = fieldsForPerson(person).find(
				(field) => field !== group.slug && shown.has(field)
			);
			if (second) crossovers.set(person.slug, second);
		}
	}
	return crossovers;
}

type PackedField = {
	slug: string;
	inner: number;
	lanes: Array<{ slug: string; label: string; x: number; y: number; r: number; faces: VennFace[] }>;
};

type PackNode = { slug?: string; label?: string; children?: PackNode[] };

/** Packs a field's lanes (and their faces) into one circle centred on the origin. */
function packField(
	slug: string,
	lanes: Array<{ slug: string; label: string; people: { slug: string }[] }>
): PackedField {
	const kept = lanes.filter((lane) => lane.people.length > 0);
	if (kept.length === 0) return { slug, inner: FACE_R, lanes: [] };

	const tree: PackNode = {
		children: kept.map((lane) => ({
			slug: lane.slug,
			label: lane.label,
			children: lane.people.map((person) => ({ slug: person.slug }))
		}))
	};
	const root = pack<PackNode>()
		.radius(() => FACE_R)
		.padding((node) => (node.depth === 0 ? LANE_PAD : FACE_PAD))(hierarchy(tree).count());

	const laneNodes = root.children ?? [];
	return {
		slug,
		inner: root.r,
		lanes: laneNodes.map((node) => ({
			slug: node.data.slug ?? '',
			label: node.data.label ?? '',
			x: node.x - root.x,
			y: node.y - root.y,
			r: node.r,
			faces: (node.children ?? []).map((leaf) => ({
				slug: leaf.data.slug ?? '',
				x: leaf.x - root.x,
				y: leaf.y - root.y
			}))
		}))
	};
}

type Body = { slug: string; inner: number; ring: number; outer: number; x: number; y: number };

function pairKey(a: string, b: string): string {
	return a < b ? `${a}|${b}` : `${b}|${a}`;
}

/** Deterministic relaxation: linked fields settle at their lens distance, others apart. */
function linkGap(a: Body, b: Body): number {
	return Math.max(a.ring, b.ring);
}

export type VennShape = 'wide' | 'tall';

/** Pull toward the middle, weaker along the long axis, so the map takes the shape. */
const PULL: Record<VennShape, { x: number; y: number; spreadX: number; spreadY: number }> = {
	wide: { x: 0.004, y: 0.02, spreadX: 1.6, spreadY: 0.8 },
	tall: { x: 0.02, y: 0.004, spreadX: 0.8, spreadY: 1.6 }
};

function placeFields(bodies: Body[], links: Set<string>, shape: VennShape): void {
	const pull = PULL[shape];
	// Biggest first on a golden-angle spiral, so the start is the same every render.
	const golden = Math.PI * (3 - Math.sqrt(5));
	const spread = bodies.reduce((total, body) => total + body.outer, 0) / 2;
	bodies.forEach((body, index) => {
		const radius = index === 0 ? 0 : spread * Math.sqrt(index / bodies.length);
		body.x = Math.cos(index * golden) * radius * pull.spreadX;
		body.y = Math.sin(index * golden) * radius * pull.spreadY;
	});

	for (let step = 0; step < ITERATIONS; step++) {
		const cool = 1 - step / ITERATIONS;
		for (let i = 0; i < bodies.length; i++) {
			for (let j = i + 1; j < bodies.length; j++) {
				const a = bodies[i];
				const b = bodies[j];
				let dx = b.x - a.x;
				let dy = b.y - a.y;
				let d = Math.hypot(dx, dy);
				if (d < 1e-6) {
					dx = 1;
					dy = 0;
					d = 1;
				}
				const linked = links.has(pairKey(a.slug, b.slug));
				const target = linked ? a.inner + b.inner + linkGap(a, b) : a.outer + b.outer + CIRCLE_GAP;
				if (!linked && d >= target) continue;
				const shift = ((d - target) / d) * (linked ? 0.35 : 0.5);
				// The smaller circle moves more, so big fields act as anchors.
				const share = a.outer / (a.outer + b.outer);
				a.x += dx * shift * (1 - share);
				a.y += dy * shift * (1 - share);
				b.x -= dx * shift * share;
				b.y -= dy * shift * share;
			}
		}
		for (const body of bodies) {
			body.x *= 1 - pull.x * cool;
			body.y *= 1 - pull.y * cool;
		}
	}
}

function lensSpots(
	a: Body,
	b: Body,
	bodies: Body[],
	taken: VennFace[],
	count: number
): Array<{ x: number; y: number }> {
	const dx = b.x - a.x;
	const dy = b.y - a.y;
	const d = Math.hypot(dx, dy) || 1;
	const ux = dx / d;
	const uy = dy / d;
	// Middle of the empty band between the two packs.
	const along = a.inner + (d - a.inner - b.inner) / 2;
	const cx = a.x + ux * along;
	const cy = a.y + uy * along;
	const stepA = FACE_R * 1.9;
	const stepB = FACE_R * 2.05;

	const candidates: Array<{ x: number; y: number; cost: number }> = [];
	const reach = Math.ceil(linkGap(a, b) / stepA) + 1;
	for (let i = -reach; i <= reach; i++) {
		for (let j = -6; j <= 6; j++) {
			const offA = i * stepA * 0.5;
			const offB = j * stepB + (i % 2 ? stepB / 2 : 0);
			candidates.push({
				x: cx + ux * offA - uy * offB,
				y: cy + uy * offA + ux * offB,
				cost: Math.abs(offA) * 2 + Math.abs(offB)
			});
		}
	}
	candidates.sort((p, q) => p.cost - q.cost);

	const spots: Array<{ x: number; y: number }> = [];
	const fits = (p: { x: number; y: number }) => {
		for (const body of [a, b]) {
			const dist = Math.hypot(p.x - body.x, p.y - body.y);
			if (dist < body.inner + FACE_R * 0.98) return false;
			if (dist > body.outer - FACE_R * 0.45) return false;
		}
		for (const body of bodies) {
			if (body === a || body === b) continue;
			if (Math.hypot(p.x - body.x, p.y - body.y) < body.outer + FACE_R * 0.4) return false;
		}
		for (const face of [...taken, ...spots]) {
			if (Math.hypot(p.x - face.x, p.y - face.y) < FACE_R * 1.96) return false;
		}
		return true;
	};
	for (const candidate of candidates) {
		if (spots.length === count) break;
		if (fits(candidate)) spots.push({ x: candidate.x, y: candidate.y });
	}
	return spots;
}

type GroupLike<T> = Pick<
	TypeHubGroup<T>,
	'slug' | 'label' | 'shortLabel' | 'accent' | 'people' | 'lanes'
>;

/**
 * Builds the map. Crossovers that can't fit in their overlap (an impossible
 * arrangement of circles) quietly go back to their own field.
 */
export function buildVennLayout<T extends VennPerson>(
	groups: GroupLike<T>[],
	shape: VennShape = 'wide'
): VennLayout {
	if (groups.length === 0) {
		return { width: 0, height: 0, faceR: FACE_R, fields: [], overlaps: [] };
	}

	const crossovers = findCrossovers(groups as TypeHubGroup<T>[]);
	const homeOf = new Map<string, string>();
	for (const group of groups)
		for (const person of group.people) homeOf.set(person.slug, group.slug);

	const baseRing = FACE_R * 2 + 4;
	const extraRing = new Map<string, number>();
	const growths = new Map<string, number>();
	for (;;) {
		const inLens = new Set(crossovers.keys());
		const packed = groups.map((group) =>
			packField(
				group.slug,
				group.lanes.map((lane) => ({
					...lane,
					people: lane.people.filter((person) => !inLens.has(person.slug))
				}))
			)
		);

		const pairs = new Map<string, { a: string; b: string; slugs: string[] }>();
		for (const [slug, second] of crossovers) {
			const home = homeOf.get(slug) ?? '';
			const id = pairKey(home, second);
			const [a, b] = home < second ? [home, second] : [second, home];
			const pair = pairs.get(id) ?? { a, b, slugs: [] };
			pair.slugs.push(slug);
			pairs.set(id, pair);
		}
		const links = new Set(pairs.keys());
		const linkedSlugs = new Set([...pairs.values()].flatMap((pair) => [pair.a, pair.b]));

		const bodies: Body[] = packed
			.map((field) => {
				const ring = linkedSlugs.has(field.slug)
					? baseRing + (extraRing.get(field.slug) ?? 0)
					: PLAIN_RING;
				return {
					slug: field.slug,
					inner: field.inner,
					ring,
					outer: field.inner + ring,
					x: 0,
					y: 0
				};
			})
			.sort((p, q) => q.outer - p.outer);
		placeFields(bodies, links, shape);
		const bodyOf = new Map(bodies.map((body) => [body.slug, body]));

		const overlaps: VennOverlap[] = [];
		const placed: VennFace[] = [];
		const misfitPairs: Array<{ id: string; a: string; b: string; slugs: string[] }> = [];
		for (const [id, pair] of [...pairs.entries()].sort(
			([, p], [, q]) => q.slugs.length - p.slugs.length
		)) {
			const a = bodyOf.get(pair.a);
			const b = bodyOf.get(pair.b);
			const spots = a && b ? lensSpots(a, b, bodies, placed, pair.slugs.length) : [];
			const faces = spots.map((spot, index) => ({ slug: pair.slugs[index], ...spot }));
			if (faces.length < pair.slugs.length) {
				misfitPairs.push({ id, a: pair.a, b: pair.b, slugs: pair.slugs.slice(faces.length) });
			}
			placed.push(...faces);
			if (faces.length > 0) overlaps.push({ a: pair.a, b: pair.b, faces });
		}

		if (misfitPairs.length === 0) return finish(groups, packed, bodyOf, overlaps, shape);

		// Widen a crowded pair's rings once (each field grows at most one step, so a
		// field with many overlaps doesn't balloon), then send whoever still doesn't
		// fit back to their own field.
		for (const pair of misfitPairs) {
			const grown = growths.get(pair.id) ?? 0;
			const canGrow = [pair.a, pair.b].some((slug) => (extraRing.get(slug) ?? 0) < MAX_EXTRA_RING);
			if (grown >= 1 || !canGrow) {
				for (const slug of pair.slugs) crossovers.delete(slug);
				continue;
			}
			growths.set(pair.id, grown + 1);
			for (const slug of [pair.a, pair.b]) {
				extraRing.set(slug, Math.min(MAX_EXTRA_RING, (extraRing.get(slug) ?? 0) + FACE_R / 2));
			}
		}
	}
}

/** Label text size on the rim, in layout units (the page can scale it up on phones). */
export const FIELD_LABEL_UNITS = 15;
/** What the label grows to on a phone-width tall map, for choosing where it fits. */
const TALL_LABEL_UNITS = 32;
/** A rim label shrinks until it covers at most this share of its circle's edge. */
export const LABEL_ARC_SHARE = 0.3;

// Top first, then working down both sides, then the bottom.
const LABEL_ANGLES = [
	-90, -70, -110, -50, -130, -30, -150, 90, 70, 110, 50, 130, -10, -170, 10, 170
];

/**
 * The first rim position where the whole curved label stays clear of every other
 * circle (so it never sits inside an overlap) and inside the canvas; failing that,
 * the position with the most of the label clear.
 */
function chooseLabelAngle(
	body: Body,
	label: string,
	bodies: Body[],
	width: number,
	height: number,
	units: number
): number {
	// Same shrink-to-fit the page applies on small circles.
	const size = Math.min(
		units,
		(Math.PI * 2 * body.outer * LABEL_ARC_SHARE) / Math.max(label.length * 0.82, 1)
	);
	const radius = body.outer - size * 0.7;
	const halfLength = (label.length * size * 0.82) / 2;
	const halfSweep = Math.min(Math.PI * 0.45, halfLength / Math.max(radius, 1));
	// How many points along the label are clear of other circles and the canvas edge.
	const clearPoints = (angle: number) => {
		let clear = 0;
		for (let step = -6; step <= 6; step++) {
			const t = (angle * Math.PI) / 180 + (halfSweep * step) / 6;
			const x = body.x + Math.cos(t) * radius;
			const y = body.y + Math.sin(t) * radius;
			if (x < 0 || y < 0 || x > width || y > height) continue;
			if (
				bodies.some(
					(other) => other !== body && Math.hypot(x - other.x, y - other.y) < other.outer + 4
				)
			) {
				continue;
			}
			clear++;
		}
		return clear;
	};
	// Preference order breaks ties, so a fully clear top label wins when there is one.
	let best = LABEL_ANGLES[0];
	let bestScore = -1;
	for (const angle of LABEL_ANGLES) {
		const score = clearPoints(angle);
		if (score > bestScore) {
			best = angle;
			bestScore = score;
		}
		if (score === 13) break;
	}
	return best;
}

function finish<T>(
	groups: GroupLike<T>[],
	packed: PackedField[],
	bodyOf: Map<string, Body>,
	overlaps: VennOverlap[],
	shape: VennShape
): VennLayout {
	const bodies = [...bodyOf.values()];
	const minX = Math.min(...bodies.map((b) => b.x - b.outer)) - EDGE_PAD;
	const minY = Math.min(...bodies.map((b) => b.y - b.outer)) - EDGE_PAD;
	const maxX = Math.max(...bodies.map((b) => b.x + b.outer)) + EDGE_PAD;
	const maxY = Math.max(...bodies.map((b) => b.y + b.outer)) + EDGE_PAD;
	const round = (value: number) => Math.round(value * 10) / 10;
	const shifted = bodies.map((b) => ({ ...b, x: b.x - minX, y: b.y - minY }));
	const shiftedOf = new Map(shifted.map((b) => [b.slug, b]));

	const fields: VennField[] = groups.map((group, index) => {
		const body = bodyOf.get(group.slug) as Body;
		const pack = packed[index];
		const ox = body.x - minX;
		const oy = body.y - minY;
		return {
			slug: group.slug,
			label: group.label,
			shortLabel: group.shortLabel,
			accent: group.accent,
			count: group.people.length,
			x: round(ox),
			y: round(oy),
			r: round(body.outer),
			labelAngle: chooseLabelAngle(
				shiftedOf.get(group.slug) as Body,
				group.shortLabel,
				shifted,
				maxX - minX,
				maxY - minY,
				shape === 'tall' ? TALL_LABEL_UNITS : FIELD_LABEL_UNITS
			),
			lanes: pack.lanes.map((lane) => ({
				slug: lane.slug,
				label: lane.label,
				x: round(ox + lane.x),
				y: round(oy + lane.y),
				r: round(lane.r),
				faces: lane.faces.map((face) => ({
					slug: face.slug,
					x: round(ox + face.x),
					y: round(oy + face.y)
				}))
			}))
		};
	});

	return {
		width: round(maxX - minX),
		height: round(maxY - minY),
		faceR: FACE_R,
		fields,
		overlaps: overlaps.map((overlap) => ({
			...overlap,
			faces: overlap.faces.map((face) => ({
				slug: face.slug,
				x: round(face.x - minX),
				y: round(face.y - minY)
			}))
		}))
	};
}
