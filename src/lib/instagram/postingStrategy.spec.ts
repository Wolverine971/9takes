// src/lib/instagram/postingStrategy.spec.ts
import { describe, expect, it } from 'vitest';

import {
	type PostCandidate,
	buildCandidateMap,
	findReplacementCandidate,
	mapRawTypesToCanonical,
	normalizeIndustryLabel,
	scoreFreshness,
	validateControversyBudget,
	validateSeriesSlots
} from './postingStrategy';

function makeCandidate(overrides: Partial<PostCandidate>): PostCandidate {
	return {
		name: 'Sample',
		link: true,
		hasImage: true,
		lastmod: '2026-03-01',
		contentGrade: 9,
		canonicalIndustry: 'creator_media',
		canonicalIndustries: ['creator_media'],
		rawTypes: ['creator'],
		timelinessScore: 0.9,
		overallScore: 90,
		...overrides
	};
}

describe('postingStrategy', () => {
	it('normalizes raw taxonomy labels into canonical industries', () => {
		expect(normalizeIndustryLabel('techie')).toBe('entrepreneur_tech');
		expect(normalizeIndustryLabel('movieStar')).toBe('film_tv');
		expect(normalizeIndustryLabel('lifestyleInfluencer')).toBe('creator_media');
		expect(normalizeIndustryLabel('unknown_label')).toBe('other');
	});

	it('maps and deduplicates raw types to canonical industries', () => {
		expect(mapRawTypesToCanonical(['creator', 'influencer', 'creator'])).toEqual(['creator_media']);
		expect(mapRawTypesToCanonical(['politician', 'activist', 'historical'])).toEqual([
			'politics_public'
		]);
	});

	it('scores freshness by recency buckets', () => {
		expect(scoreFreshness('2026-03-02', '2026-03-04')).toBe(1);
		expect(scoreFreshness('2026-02-24', '2026-03-04')).toBe(0.85);
		expect(scoreFreshness('2025-12-01', '2026-03-04')).toBe(0.2);
	});

	it('flags non-ready and lane mismatch slot issues', () => {
		const candidates = [
			makeCandidate({ name: 'Ready-Creator' }),
			makeCandidate({
				name: 'Not-Ready-Creator',
				link: false
			}),
			makeCandidate({
				name: 'Entrepreneur-Only',
				canonicalIndustry: 'entrepreneur_tech',
				canonicalIndustries: ['entrepreneur_tech'],
				rawTypes: ['techie']
			})
		];
		const candidateMap = buildCandidateMap(candidates);
		const issues = validateSeriesSlots(
			[
				{
					weekStartDate: '2026-03-10',
					lane: 'creator_media',
					post1: 'Not-Ready-Creator',
					post2: 'Entrepreneur-Only',
					burstOptional: true
				}
			],
			candidateMap
		);

		expect(issues).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ postName: 'Not-Ready-Creator', reason: 'not_ready' }),
				expect.objectContaining({ postName: 'Entrepreneur-Only', reason: 'lane_mismatch' })
			])
		);
	});

	it('finds a replacement candidate in the same lane', () => {
		const candidates: PostCandidate[] = [
			makeCandidate({ name: 'Used-Creator', timelinessScore: 0.8, overallScore: 84 }),
			makeCandidate({ name: 'Best-Creator', timelinessScore: 1, overallScore: 96 }),
			makeCandidate({
				name: 'Wrong-Lane',
				canonicalIndustry: 'entrepreneur_tech',
				canonicalIndustries: ['entrepreneur_tech'],
				rawTypes: ['techie'],
				timelinessScore: 1,
				overallScore: 99
			})
		];

		const replacement = findReplacementCandidate({
			lane: 'creator_media',
			candidates,
			excludedNames: ['Used-Creator'],
			referenceDate: '2026-03-04'
		});

		expect(replacement?.name).toBe('Best-Creator');
	});

	it('enforces minimum controversy week gap', () => {
		const issues = validateControversyBudget(
			[
				{
					weekStartDate: '2026-03-10',
					lane: 'politics_public',
					post1: 'Donald-Trump',
					post2: 'Kamala-Harris',
					burstOptional: false
				},
				{
					weekStartDate: '2026-03-17',
					lane: 'politics_public',
					post1: 'Joe-Biden',
					post2: 'Justin-Trudeau',
					burstOptional: false
				}
			],
			3
		);

		expect(issues).toHaveLength(1);
		expect(issues[0]).toEqual(
			expect.objectContaining({
				minimumGapWeeks: 3,
				actualGapWeeks: 1
			})
		);
	});
});
