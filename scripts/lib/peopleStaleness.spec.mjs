// scripts/lib/peopleStaleness.spec.mjs
import { describe, expect, it } from 'vitest';
import {
	ageOn,
	findAgeIssues,
	findTimeIssues,
	parseNumberToken,
	scanProfile
} from './peopleStaleness.js';

const ASOF = '2026-10-06';
const kinds = (issues) => issues.map((issue) => issue.kind);

describe('parseNumberToken', () => {
	it('reads digits and spelled-out ages', () => {
		expect(parseNumberToken('62')).toBe(62);
		expect(parseNumberToken('sixty-two')).toBe(62);
		expect(parseNumberToken('Sixty two')).toBe(62);
		expect(parseNumberToken('seventy')).toBe(70);
		expect(parseNumberToken('three')).toBe(3);
		expect(parseNumberToken('dozen')).toBeNull();
	});
});

describe('ageOn', () => {
	it('counts whole years and respects the birthday', () => {
		expect(ageOn('1962-07-03', '2026-07-02')).toBe(63);
		expect(ageOn('1962-07-03', '2026-07-03')).toBe(64);
	});
});

describe('findAgeIssues', () => {
	const jlo = { birthDate: '1969-07-24', asOf: ASOF, writtenOn: '2026-04-03' };

	it('flags a current age that was true when written and no longer is', () => {
		expect(kinds(findAgeIssues("She's 56 now, alone for the first time.", jlo))).toEqual([
			'stale_subject_age'
		]);
	});

	it('leaves a correct current age alone', () => {
		expect(findAgeIssues("She's 57 now.", jlo)).toEqual([]);
	});

	it('treats an age anchored to a matching year as history', () => {
		expect(findAgeIssues('In 1998, at 29, she released her first album.', jlo)).toEqual([]);
	});

	it('flags an age-led heading written as current', () => {
		const cruise = { birthDate: '1962-07-03', asOf: ASOF, writtenOn: '2026-02-15' };
		expect(findAgeIssues('Still Having to Prove It at 62', cruise)).toHaveLength(1);
		expect(findAgeIssues('At 62, he is not just an actor.', cruise)).toHaveLength(1);
	});

	it('ignores past events told with "at"', () => {
		const hathaway = { birthDate: '1982-11-12', asOf: ASOF, writtenOn: '2025-06-01' };
		expect(findAgeIssues('At 42, dance training forced her out of her head.', hathaway)).toEqual(
			[]
		);
	});

	it('flags present-tense ages about other people at lower severity', () => {
		const khloe = { birthDate: '1984-06-27', asOf: ASOF, writtenOn: '2026-04-04' };
		const [issue] = findAgeIssues('Tatum is now three.', khloe);
		expect(issue).toMatchObject({ kind: 'present_age_other', severity: 'medium' });
	});

	it('does not read the age of a thing, a count, or an article as a person', () => {
		const poehler = { birthDate: '1971-09-16', asOf: ASOF, writtenOn: '2026-01-01' };
		expect(
			findAgeIssues('James Cameron is still mad about a thirteen-year-old joke.', poehler)
		).toEqual([]);
		expect(findAgeIssues('His stream chat is 50,000 teenagers.', poehler)).toEqual([]);
		expect(findAgeIssues('Modeling is now one element among many.', poehler)).toEqual([]);
	});

	it('skips subjects without a birth date', () => {
		expect(findAgeIssues("He's 40 now.", { birthDate: null, asOf: ASOF, writtenOn: null })).toEqual(
			[]
		);
	});
});

describe('findTimeIssues', () => {
	const ctx = { asOf: ASOF, writtenOn: '2026-03-01' };

	it('flags future tense about a date that has passed', () => {
		const issues = findTimeIssues(
			'On September 4, 2026, Netflix will premiere Earle Meets World.',
			ctx
		);
		expect(issues).toMatchObject([{ kind: 'past_event_in_future_tense', severity: 'high' }]);
	});

	it('leaves future tense about a future date alone', () => {
		expect(findTimeIssues('The film will premiere in December 2026.', ctx)).toEqual([]);
	});

	it('does not mistake names, titles or quoted speech for announcements', () => {
		expect(findTimeIssues('Will Smith slapped Chris Rock on March 27, 2022.', ctx)).toEqual([]);
		expect(findTimeIssues('Compare 2013\'s "Love Will Remember" to her 2020 single.', ctx)).toEqual(
			[]
		);
		expect(findTimeIssues('"Mother\'s Day 2025 will be one I\'ll never forget."', ctx)).toEqual([]);
	});

	it('flags stale "as of" stamps', () => {
		expect(
			kinds(findTimeIssues("As of March 2025, she's in a serious relationship.", ctx))
		).toEqual(['as_of_dated']);
	});

	it('flags bare relative time on an old page but not narrative "the next year"', () => {
		const old = { asOf: ASOF, writtenOn: '2025-01-01' };
		expect(kinds(findTimeIssues('Her next album arrives later this year.', old))).toEqual([
			'relative_time_stale'
		]);
		expect(findTimeIssues('The next year they divorced.', old)).toEqual([]);
	});
});

describe('scanProfile', () => {
	it('labels where each finding lives', () => {
		const findings = scanProfile(
			{
				person: 'tom-cruise',
				birthDate: '1962-07-03',
				writtenOn: '2026-02-15',
				segments: [
					{ where: 'content', text: '## Still Having to Prove It at 62\n\nHe hangs from planes.' },
					{ where: 'faq 1 answer', text: 'He was born in 1962.' }
				]
			},
			{ asOf: ASOF }
		);
		expect(findings).toHaveLength(1);
		expect(findings[0]).toMatchObject({ person: 'tom-cruise', where: 'content' });
	});
});
