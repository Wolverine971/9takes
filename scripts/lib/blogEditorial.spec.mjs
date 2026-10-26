// scripts/lib/blogEditorial.spec.mjs
import { describe, expect, it } from 'vitest';
import {
	QUALITY_GATES,
	calculateQuality,
	editorialHash,
	evidenceSchema,
	matchesEditorialHash,
	profileFormat,
	validateEvidence
} from './blogEditorial.js';

describe('editorial hash and the label-paths `path` field', () => {
	const released = "---\ntitle: 'A'\nenneagram: 6\n---\n\nBody text.\n";
	const labelled =
		"---\ntitle: 'A'\nenneagram: 6\npath: src/blog/people/drafts/a.md\n---\n\nBody text.\n";

	it('ignores a path line added after release', () => {
		expect(editorialHash(labelled)).toBe(editorialHash(released));
		expect(matchesEditorialHash(labelled, editorialHash(released))).toBe(true);
	});

	it('still accepts hashes frozen while path counted', () => {
		// Produced by the pre-2026-10-26 editorialHash for `labelled` (path included).
		const legacyHash = '4665d634bf990932db0b685e666f0675b5cb31953620565a0054535958eeee8b';
		expect(editorialHash(labelled)).not.toBe(legacyHash);
		expect(matchesEditorialHash(labelled, legacyHash)).toBe(true);
	});

	it('still catches reviewed-content edits', () => {
		const edited = labelled.replace('Body text.', 'Different body.');
		expect(matchesEditorialHash(edited, editorialHash(released))).toBe(false);
		expect(
			matchesEditorialHash(
				released.replace('enneagram: 6', 'enneagram: 7'),
				editorialHash(released)
			)
		).toBe(false);
		expect(matchesEditorialHash(released, undefined)).toBe(false);
	});
});

const source = (id) => ({
	id,
	url: `https://example.com/${id}`,
	title: `Interview ${id}`,
	speaker: 'Subject',
	date: '2026-09-30',
	locator: '02:50',
	excerpt: 'A quoted line.',
	context: 'Press junket answer.',
	kind: 'primary',
	access: 'opened'
});
const claim = (id) => ({
	id,
	claim: `Claim ${id}`,
	passage: '',
	class: 'self_report',
	source_ids: ['S1'],
	inference: 'Suggests a pattern.',
	alternative: 'Could be junket polish.',
	durability: 'stable',
	review_trigger: ''
});
const baseEvidence = (overrides = {}) => ({
	schema_version: 3,
	subject: 'joseph-zada',
	status: 'ready',
	research_tasks: [],
	accuracy_checked_at: '2026-10-04',
	risks: {
		sensitive_allegations: false,
		contested_typing: false,
		historical_source_uncertainty: false,
		major_thesis_change: false
	},
	sources: [source('S1'), source('S2')],
	claims: [claim('C1'), claim('C2')],
	type_hypothesis: {
		type: 6,
		confidence: 'medium',
		for_claim_ids: ['C1', 'C2'],
		against: 'Some tuning-out remedies.',
		alternative_type: 3,
		alternative_case: 'Impression strategy for the audition.',
		discriminator: 'What steadies him under pressure.',
		unexplained: 'Reserve with press.'
	},
	...overrides
});
const openCase = (hypothesis = {}) =>
	baseEvidence({
		profile_format: 'open_case',
		risks: { ...baseEvidence().risks, contested_typing: true },
		type_hypothesis: { ...baseEvidence().type_hypothesis, confidence: 'low', ...hypothesis },
		open_case: {
			reason: 'First lead roles in the last two years; mostly release-week interviews.',
			live_alternatives: [3, 9],
			settle_signals: [
				'What he credits for steadying him through the November release.',
				'Testimony from a director about a specific pressured moment.'
			],
			next_review: '2026-11-25'
		}
	});

describe('open-case evidence', () => {
	it('still holds a standard profile with low confidence', () => {
		expect(() =>
			validateEvidence(
				baseEvidence({
					type_hypothesis: { ...baseEvidence().type_hypothesis, confidence: 'low' }
				}),
				'joseph-zada'
			)
		).toThrow(/differentiated, supported type hypothesis/);
	});

	it('accepts a low-confidence open case', () => {
		expect(validateEvidence(openCase(), 'joseph-zada').profile_format).toBe('open_case');
	});

	it('requires the open_case record, contested typing, and non-high confidence', () => {
		const { open_case: _omit, ...withoutRecord } = openCase();
		expect(() => validateEvidence(withoutRecord, 'joseph-zada')).toThrow(/open_case record/);
		expect(() =>
			validateEvidence(
				{ ...openCase(), risks: { ...openCase().risks, contested_typing: false } },
				'joseph-zada'
			)
		).toThrow(/contested_typing/);
		expect(() => validateEvidence(openCase({ confidence: 'high' }), 'joseph-zada')).toThrow(
			/high confidence/
		);
	});

	it('requires at least two settle signals', () => {
		const evidence = openCase();
		evidence.open_case.settle_signals = ['Only one'];
		expect(() => validateEvidence(evidence, 'joseph-zada')).toThrow();
	});

	it('parses pre-open-case evidence without adding keys (release hashes stay stable)', () => {
		const legacy = baseEvidence();
		const parsed = evidenceSchema.parse(legacy);
		expect('profile_format' in parsed).toBe(false);
		expect('open_case' in parsed).toBe(false);
		expect(JSON.stringify(parsed)).toBe(JSON.stringify(legacy));
	});
});

describe('open-case quality', () => {
	const verification = {
		status: 'pass',
		content_sha256: 'a'.repeat(64),
		scores: Object.fromEntries(
			[
				'evidence',
				'enneagram',
				'originality',
				'writing',
				'durability',
				'hook',
				'discoverability'
			].map((key) => [key, { score: 8, reason: 'r', passage: 'p' }])
		)
	};

	it('stamps profile_format only on open cases', () => {
		expect(calculateQuality(verification, 'open_case').profile_format).toBe('open_case');
		expect('profile_format' in calculateQuality(verification)).toBe(false);
	});

	it('loosens grade floors for open cases only', () => {
		expect(QUALITY_GATES.standard.overall).toBe(8.5);
		expect(QUALITY_GATES.open_case.overall).toBeLessThan(QUALITY_GATES.standard.overall);
		expect(QUALITY_GATES.open_case.discoverability).toBe(QUALITY_GATES.standard.discoverability);
	});

	it('detects the format from evidence or content_quality', () => {
		expect(profileFormat({ profile_format: 'open_case' })).toBe('open_case');
		expect(profileFormat({})).toBe('standard');
		expect(profileFormat(null)).toBe('standard');
	});
});
