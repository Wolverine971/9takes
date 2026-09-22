// scripts/find-threads.spec.mjs
import { describe, expect, it } from 'vitest';
import {
	band,
	buildIdf,
	clamp,
	disagreementScore,
	isExcluded,
	matchQuestion,
	parseCsv,
	tokenize,
	wordCount
} from './find-threads.mjs';

const HOUR = 3_600_000;
const NOW = Date.UTC(2026, 8, 22, 12, 0, 0);

/** Minimal Reddit post shaped like the listing API returns. */
function post(overrides = {}) {
	return {
		title: 'My sister skipped my wedding and now wants me at hers',
		selftext: 'word '.repeat(300).trim(),
		num_comments: 200,
		score: 100,
		upvote_ratio: 0.7,
		created_utc: (NOW - 6 * HOUR) / 1000,
		over_18: false,
		stickied: false,
		locked: false,
		subreddit: 'AmItheAsshole',
		permalink: '/r/AmItheAsshole/comments/abc/x/',
		...overrides
	};
}

describe('clamp and band', () => {
	it('clamps to the unit interval by default', () => {
		expect(clamp(-3)).toBe(0);
		expect(clamp(0.4)).toBe(0.4);
		expect(clamp(9)).toBe(1);
	});

	it('returns 1 inside the band and tapers outside it', () => {
		expect(band(500, 80, 800, 80, 400)).toBe(1);
		expect(band(80, 80, 800, 80, 400)).toBe(1);
		expect(band(40, 80, 800, 80, 400)).toBeCloseTo(0.5, 5);
		expect(band(1000, 80, 800, 80, 400)).toBeCloseTo(0.5, 5);
		expect(band(0, 80, 800, 80, 400)).toBe(0);
		expect(band(2000, 80, 800, 80, 400)).toBe(0);
	});

	it('defaults the high falloff to the low one', () => {
		expect(band(5, 10, 20, 5)).toBe(0);
		expect(band(25, 10, 20, 5)).toBe(0);
		expect(band(22.5, 10, 20, 5)).toBeCloseTo(0.5, 5);
	});
});

describe('wordCount', () => {
	it('counts words and tolerates empty input', () => {
		expect(wordCount('one two three')).toBe(3);
		expect(wordCount('  padded   out  ')).toBe(2);
		expect(wordCount('')).toBe(0);
		expect(wordCount(undefined)).toBe(0);
	});
});

describe('isExcluded', () => {
	it('keeps an ordinary contested thread', () => {
		expect(isExcluded(post())).toBe(false);
	});

	it('drops NSFW, stickied and locked threads', () => {
		expect(isExcluded(post({ over_18: true }))).toBe(true);
		expect(isExcluded(post({ stickied: true }))).toBe(true);
		expect(isExcluded(post({ locked: true }))).toBe(true);
	});

	it('drops crisis content per the T-22 research boundaries', () => {
		expect(isExcluded(post({ title: 'I want to kill myself over this' }))).toBe(true);
		expect(isExcluded(post({ selftext: 'He was sexually abusive for years' }))).toBe(true);
		expect(isExcluded(post({ selftext: 'I got a restraining order last week' }))).toBe(true);
	});

	it('drops abuse and physical violence however it is phrased', () => {
		for (const text of [
			'My boyfriend (24M) is emotionally abusive and I feel trapped',
			'My husband hit me last night',
			'WIBTA for leaving my abusive mother at Thanksgiving',
			'She slapped me in front of everyone',
			'My ex choked me once and I never told anyone'
		]) {
			expect(isExcluded(post({ title: text })), text).toBe(true);
		}
	});

	it('keeps everyday phrases that only look violent', () => {
		for (const text of [
			'He hit me up after three months of silence',
			'It finally hit me that she was right',
			'My roommate kicked me out of the group chat'
		]) {
			expect(isExcluded(post({ title: text })), text).toBe(false);
		}
	});

	it('drops threads involving a minor in any of the ways Reddit writes it', () => {
		for (const text of [
			'AITA? I am 15 years old and my mom reads my texts',
			'AITA (16f) for telling my friend the truth',
			'AITA (16F) for telling my friend the truth',
			'AIO? My bf (17M) ignored me all weekend',
			'I (F16) told my mom no',
			'My sister (14 F) read my diary',
			'I am 15 and my parents took my phone',
			'I’m 14 and my dad reads my messages',
			"I'm a junior in high school and my friend lied",
			'I am in 9th grade and got left out'
		]) {
			expect(isExcluded(post({ title: text })), text).toBe(true);
		}
	});

	it('does not drop adults or numbers that are not ages', () => {
		for (const text of [
			'AITA (34f) for telling my friend the truth',
			'AITA (34F) and my husband (36M) for skipping the reunion',
			"I'm 15 minutes late to everything and my partner is done",
			'I am 12 weeks pregnant and my MIL announced it',
			"I'm 5'4 and my date lied about his height",
			'Back when I was in high school we did this all the time'
		]) {
			expect(isExcluded(post({ title: text })), text).toBe(false);
		}
	});
});

describe('disagreementScore', () => {
	it('ranks a contested thread above a consensus thread', () => {
		const contested = disagreementScore(post({ upvote_ratio: 0.55 }), NOW);
		const consensus = disagreementScore(post({ upvote_ratio: 1 }), NOW);
		expect(contested.total).toBeGreaterThan(consensus.total);
	});

	it('ranks argument over popularity', () => {
		// 300 comments on 120 upvotes: people are arguing.
		const arguing = disagreementScore(post({ num_comments: 300, score: 120 }), NOW);
		// 20 comments on 8,000 upvotes: people are approving.
		const approving = disagreementScore(post({ num_comments: 20, score: 8000 }), NOW);
		expect(arguing.total).toBeGreaterThan(approving.total);
		expect(arguing.parts.discussionDensity).toBeGreaterThan(0.5);
		expect(approving.parts.discussionDensity).toBeLessThan(0.05);
	});

	it('penalises one-liners and essays', () => {
		const thin = disagreementScore(post({ selftext: 'AITA?' }), NOW);
		const right = disagreementScore(post(), NOW);
		const essay = disagreementScore(post({ selftext: 'word '.repeat(3000) }), NOW);
		const empty = disagreementScore(post({ selftext: '' }), NOW);
		expect(right.parts.substance).toBe(1);
		expect(thin.parts.substance).toBeLessThan(0.05);
		expect(essay.parts.substance).toBe(0);
		expect(empty.parts.substance).toBe(0);
	});

	it('prefers threads inside the comment window', () => {
		const fresh = disagreementScore(post({ created_utc: (NOW - 6 * HOUR) / 1000 }), NOW);
		const stale = disagreementScore(post({ created_utc: (NOW - 72 * HOUR) / 1000 }), NOW);
		expect(fresh.parts.freshness).toBe(1);
		expect(stale.parts.freshness).toBe(0);
	});

	it('stays within the unit interval', () => {
		const maxed = disagreementScore(post({ upvote_ratio: 0.5, num_comments: 999, score: 0 }), NOW);
		expect(maxed.total).toBeLessThanOrEqual(1);
		expect(maxed.total).toBeGreaterThan(0.9);
	});

	it('handles a post missing optional fields', () => {
		const scoring = disagreementScore({ title: 'x', created_utc: NOW / 1000 }, NOW);
		expect(Number.isFinite(scoring.total)).toBe(true);
	});
});

describe('tokenize', () => {
	it('strips stopwords, punctuation and short tokens', () => {
		expect(tokenize('The sister, who was ALWAYS late!')).toEqual(['sister', 'always', 'late']);
	});
});

describe('matchQuestion', () => {
	// A corpus wide enough that IDF means something, including the short
	// generic question that used to win every match by being short.
	const corpus = [
		{
			id: 1,
			question: 'When a sibling skips your milestone celebration, what does that mean to you?',
			url: 'sibling-milestone'
		},
		{
			id: 2,
			question: 'What does a messy kitchen say about the person who left it?',
			url: 'messy-kitchen'
		},
		{
			id: 3,
			question: 'How do you read a coworker who takes credit during meetings?',
			url: 'coworker-credit'
		},
		{
			id: 4,
			question: 'What advice do you have for someone who wants to know what to do?',
			url: 'generic-advice'
		},
		{
			id: 5,
			question: 'How do you tell your mother you are skipping Christmas this year?',
			url: 'skipping-christmas'
		},
		{
			id: 6,
			question: 'When a friend withdraws without explaining, what do you assume first?',
			url: 'friend-withdraws'
		},
		{ id: 7, question: 'What does an unanswered text message mean to you?', url: 'unanswered-text' }
	];
	const idf = buildIdf(corpus);

	it('picks the topically closest question', () => {
		const match = matchQuestion(
			post({
				title: 'My sibling skipped my milestone celebration',
				selftext: 'sibling milestone celebration'
			}),
			corpus,
			idf
		);
		expect(match.url).toBe('sibling-milestone');
		expect(match.score).toBeGreaterThan(0);
	});

	it('picks the workplace question for a workplace thread', () => {
		const match = matchQuestion(
			post({
				title: 'Coworker took credit during the meetings again',
				selftext: 'coworker credit meetings'
			}),
			corpus,
			idf
		);
		expect(match.url).toBe('coworker-credit');
	});

	it('does not let a short generic question win on common words', () => {
		// The regression: a Christmas/mother thread once matched college advice.
		const match = matchQuestion(
			post({
				title: 'AITA for telling my mother I am skipping Christmas this year?',
				selftext: 'mother christmas skipping year'
			}),
			corpus,
			idf
		);
		expect(match.url).toBe('skipping-christmas');
	});

	it('requires two distinctive tokens, not just any overlap', () => {
		expect(
			matchQuestion(post({ title: 'what do you have to do', selftext: 'do you know' }), corpus, idf)
		).toBeNull();
	});

	it('returns null when nothing clears the threshold', () => {
		expect(
			matchQuestion(post({ title: 'octopus telescope rhubarb', selftext: 'quartz' }), corpus, idf)
		).toBeNull();
	});

	it('returns null when the thread has no usable tokens', () => {
		expect(matchQuestion({ title: 'a an the', selftext: '' }, corpus, idf)).toBeNull();
	});
});

describe('parseCsv', () => {
	it('parses quoted fields, embedded commas and escaped quotes', () => {
		const rows = parseCsv(
			'id,question,url\n1,"Why, exactly, does that land?",why-land\n2,"She said ""fine""",she-said\n'
		);
		expect(rows).toEqual([
			{ id: '1', question: 'Why, exactly, does that land?', url: 'why-land' },
			{ id: '2', question: 'She said "fine"', url: 'she-said' }
		]);
	});

	it('returns an empty array for a header-only result', () => {
		expect(parseCsv('id,question,url\n')).toEqual([]);
	});
});
