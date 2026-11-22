// src/lib/data/mbtiTestReads.ts

/**
 * MBTI-line test (DJ, 2026-11-21). "[celebrity] mbti" searches showed our
 * people pages ~46k times in 16 months for 118 clicks, because the pages never
 * name an MBTI type. These 20 pages get one line in the type answer box naming
 * the most common MBTI read online. 20 matched control pages get nothing.
 *
 * Check 2026-12-21 (calendar reminder). Keep only if MBTI-search clicks on these
 * pages at least doubled and the controls didn't move the same way; otherwise
 * empty this map and drop MBTI. The pairs and baseline numbers are in
 * ~/.cache/9takes-research/search-terms-2026-11-21/mbti-test.md.
 *
 * Values are the most-cited read online (self-reports first), not our typing.
 */
// Only reads with a clear consensus (Personality Database vote leaders with a
// real margin) made the cut: 9 of the 20 planned pages. The other 11 had one
// fan-site source or split votes, and "the most common read online" would
// overstate them. Controls are the 9 matched pairs in the notes file.
export const MBTI_TEST_READS: Readonly<Record<string, string>> = {
	'ryan-gosling': 'ISFP',
	'kai-cenat': 'ESFP',
	'dario-amodei': 'INTP',
	'shane-gillis': 'ESTP',
	'sydney-sweeney': 'ENFJ',
	'robert-pattinson': 'INFP',
	'dua-lipa': 'ISFP',
	'lionel-messi': 'ISFP',
	zendaya: 'INFJ'
};

export const MBTI_TEST_STARTED = '2026-11-21';
