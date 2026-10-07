// scripts/lib/peopleStaleness.js
//
// Finds claims in people profiles that were true when written and go stale on
// their own: a current age written as a number ("she's 56 now"), and future
// tense about a date that has already passed ("is set to premiere in March
// 2026"). Pure functions only; scripts/audit-people-staleness.mjs does the I/O.

const UNITS = {
	one: 1,
	two: 2,
	three: 3,
	four: 4,
	five: 5,
	six: 6,
	seven: 7,
	eight: 8,
	nine: 9
};
const TEENS = {
	ten: 10,
	eleven: 11,
	twelve: 12,
	thirteen: 13,
	fourteen: 14,
	fifteen: 15,
	sixteen: 16,
	seventeen: 17,
	eighteen: 18,
	nineteen: 19
};
const TENS = {
	twenty: 20,
	thirty: 30,
	forty: 40,
	fifty: 50,
	sixty: 60,
	seventy: 70,
	eighty: 80,
	ninety: 90
};

const UNIT_WORDS = Object.keys(UNITS).join('|');
const NUMBER_PATTERN = `(?:\\d{1,3}|(?:${Object.keys(TENS).join('|')})(?:[-\\s](?:${UNIT_WORDS}))?|${Object.keys(TEENS).join('|')}|${UNIT_WORDS})`;

const MONTHS = {
	jan: 0,
	feb: 1,
	mar: 2,
	apr: 3,
	may: 4,
	jun: 5,
	jul: 6,
	aug: 7,
	sep: 8,
	sept: 8,
	oct: 9,
	nov: 10,
	dec: 11
};
const MONTH_PATTERN =
	'(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sept?(?:ember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\\.?';
// Last month of each season, northern hemisphere ("fall 2025" is over by December).
const SEASON_END_MONTH = { spring: 4, summer: 7, fall: 10, autumn: 10, winter: 1 };

// Ages: "at 62", "is 62", "she's 56", "turned 50", "62-year-old", "62 years old".
const AGE_PATTERNS = [
	new RegExp(`\\b(\\d{1,3}|${NUMBER_PATTERN})[-\\s]years?[-\\s]old\\b`, 'gi'),
	new RegExp(
		`\\b(?:he|she|they|it)(?:'s|’s| is| are)\\s+(?:now\\s+|just\\s+|only\\s+)?(${NUMBER_PATTERN})\\b(?![-\\s]*(?:percent|%|million|billion|times|points|minutes|hours|days|weeks|months|feet|pounds|degrees))`,
		'gi'
	),
	new RegExp(
		`\\b(?:is|turns|turned|turning|aged|age|at|now)\\s+(?:now\\s+|just\\s+|only\\s+|age\\s+)?(${NUMBER_PATTERN})\\b(?![-\\s]*(?:percent|%|million|billion|thousand|times|points|a\\.m|p\\.m|o'clock|mph|miles|feet|foot|pounds|lbs|minutes|seconds|hours|days|weeks|months|degrees|episodes|films|movies|songs|albums|books|people|countries|cities|states|grammys|oscars|awards|nominations|wins|goals|games|seasons|stories|floors|percent))`,
		'gi'
	)
];

const NON_PERSON_AFTER_AGE =
	/^\s+(?:joke|tweet|video|clip|song|album|record|movie|film|feud|interview|post|photo|essay|article|book|show|series|franchise|company|brand|lawsuit|case|grudge|rumor|quote|comment|speech|story|habit|rule|tradition|marriage|relationship|friendship|career|business|account|channel|meme|scandal|grievance|bit|sketch|role|image|picture|footage|letter|diary|journal|claim|promise|debt|wound|question|argument|fight|rivalry|controversy)s?\b/i;
const PRESENT_MARKER =
	/\b(now|today|currently|these days|nowadays|at this point|still|as of|this year|lately)\b/i;
const PRESENT_CONSTRUCTION = new RegExp(
	`\\b(?:(?:he|she|they)(?:'s|’s| is| are)\\s+(?:now\\s+)?${NUMBER_PATTERN}\\b|is\\s+(?:now\\s+)?${NUMBER_PATTERN}\\b|turns\\s+${NUMBER_PATTERN}\\b|now\\s+${NUMBER_PATTERN}\\b)`,
	'i'
);
const PRESENT_VERB =
	/\b(is|are|has|have|remains|keeps|stays|still|now|wakes|trains|runs|lives|hangs|does|doesn['’]t|isn['’]t|can|can['’]t|won['’]t)\b/i;
const PAST_VERB =
	/\b(was|were|had been|turned|died|passed away|when (?:he|she|they) (?:was|were))\b/i;
const YEAR = /\b(1[89]\d\d|20\d\d)\b/g;

// Case-sensitive on purpose: "Will" is usually a name (Will Smith) or a title
// word ("Love Will Remember"); an announcement uses lowercase "will" + a verb.
const FUTURE_MARKER =
	/\b(?:will|won['’]t)\s+(?:also\s+|finally\s+|soon\s+)?(?:be\s+(?:released|out|back|returning|starring|playing|hosting|touring)|premiere|open|debut|star|return|hit\s+(?:theaters|screens|shelves)|arrive|launch|air|release|headline|direct|co-star|appear|compete|host|perform|tour|publish|come\s+out|drop|marry|wed|take\s+over|step\s+down|run\s+for)\b|\b(?:is|are)\s+(?:set|slated|scheduled|due|expected|poised)\s+to\b|\b(?:premieres|debuts|opens|arrives|hits\s+theaters|comes\s+out|drops|releases)\s+(?:in|on|this|next)\b|\b(?:is|are)\s+(?:currently\s+)?(?:filming|shooting|in\s+production|in\s+post-production)\b|\b[Cc]oming\s+soon\b|\bset\s+for\s+(?:release|a\s+\w+\s+release)\b/;
// Weaker: often narrative past ("to promote their upcoming match" in 2023).
const SOFT_FUTURE_MARKER = /\b(upcoming|forthcoming|slated for|due out)\b/i;
// "The next year they divorced" is narrative; only bare relative time is stale-prone.
const RELATIVE_FUTURE =
	/(?<!\bthe\s)\b(next year|later this year|this fall|this autumn|this summer|this spring|this winter|next month|later this month|next season)\b/i;

/** Parse "62", "sixty-two", "sixty two", "three" into a number. */
export function parseNumberToken(token) {
	const raw = String(token).trim().toLowerCase();
	if (/^\d+$/.test(raw)) return Number(raw);
	if (raw in UNITS) return UNITS[raw];
	if (raw in TEENS) return TEENS[raw];
	if (raw in TENS) return TENS[raw];
	const [tens, unit] = raw.split(/[-\s]/);
	if (tens in TENS && unit in UNITS) return TENS[tens] + UNITS[unit];
	return null;
}

/** Whole years between birth and asOf. */
export function ageOn(birthDate, asOf) {
	const birth = toDate(birthDate);
	const at = toDate(asOf);
	if (!birth || !at) return null;
	let age = at.getUTCFullYear() - birth.getUTCFullYear();
	const beforeBirthday =
		at.getUTCMonth() < birth.getUTCMonth() ||
		(at.getUTCMonth() === birth.getUTCMonth() && at.getUTCDate() < birth.getUTCDate());
	if (beforeBirthday) age -= 1;
	return age;
}

/** Strip markdown/HTML down to plain prose. Comments never reach production, so drop them. */
export function toPlainText(markdown) {
	return String(markdown ?? '')
		.replace(/<!--[\s\S]*?-->/g, ' ')
		.replace(/<script[\s\S]*?<\/script>/gi, ' ')
		.replace(/<style[\s\S]*?<\/style>/gi, ' ')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
		.replace(/<[^>]+>/g, ' ')
		.replace(/[*_`#>|]/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&nbsp;/g, ' ');
}

export function splitSentences(text) {
	return String(text)
		.split(/\n+|(?<=[.!?])\s+(?=[A-Z0-9“"'(])/)
		.map((sentence) => sentence.replace(/\s+/g, ' ').trim())
		.filter((sentence) => sentence.length > 0);
}

function toDate(value) {
	if (!value) return null;
	if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
	const date = new Date(String(value).length === 10 ? `${value}T00:00:00Z` : String(value));
	return Number.isNaN(date.getTime()) ? null : date;
}

function isInsideQuote(sentence, index) {
	const before = sentence.slice(0, index);
	const straight = (before.match(/"/g) || []).length;
	const opens = (before.match(/“/g) || []).length;
	const closes = (before.match(/”/g) || []).length;
	return straight % 2 === 1 || opens > closes;
}

/**
 * Age claims that no longer match the subject's birth date.
 *
 * A present-tense age ("she's 56 now") that matched the subject when the page
 * was written is the stale case we want. A present-tense age that never matched
 * is probably about someone else (a child, a spouse) and goes stale too, so it
 * is reported at lower severity. Ages anchored to an explicit year are history
 * and skipped unless the year and age disagree by more than one.
 */
export function findAgeIssues(sentence, { birthDate, asOf, writtenOn }) {
	const issues = [];
	const birth = toDate(birthDate);
	if (!birth) return issues;
	const currentAge = ageOn(birth, asOf);
	if (currentAge === null || currentAge > 105) return issues;
	const birthYear = birth.getUTCFullYear();
	const writtenYear = (toDate(writtenOn) ?? toDate(asOf)).getUTCFullYear();
	const years = [...sentence.matchAll(YEAR)].map((match) => Number(match[1]));
	const seen = new Set();

	for (const pattern of AGE_PATTERNS) {
		pattern.lastIndex = 0;
		for (const match of sentence.matchAll(pattern)) {
			const age = parseNumberToken(match[1]);
			if (age === null || age > 110 || seen.has(match.index)) continue;
			seen.add(match.index);
			const phrase = match[0];
			const yearsOld = /year/i.test(phrase);
			// "at three" is usually a time of day, "is twelve" a count and "now one" an
			// article; young ages need an explicit age form ("three-year-old",
			// "is now three").
			if (age < 18 && !yearsOld && !/\b(?:is|are|'s|’s)\s+now\b/i.test(phrase)) continue;
			if (age <= 1 && !yearsOld) continue;
			// "a thirteen-year-old joke" is the joke's age, not a person's.
			if (yearsOld && NON_PERSON_AFTER_AGE.test(sentence.slice(match.index + phrase.length)))
				continue;
			// "50,000 teenagers" is a count.
			if (/^[,.]\d/.test(sentence.slice(match.index + phrase.length))) continue;
			if (age === currentAge) continue;

			const impliedYear = birthYear + age;
			const quoted = isInsideQuote(sentence, match.index);

			if (years.length > 0) {
				const consistent = years.some((year) => Math.abs(year - impliedYear) <= 1);
				if (!consistent && years.every((year) => year >= 1900) && age >= 10) {
					issues.push({
						kind: 'age_year_mismatch',
						severity: 'low',
						phrase,
						detail: `age ${age} implies ${impliedYear}-${impliedYear + 1}; sentence mentions ${years.join(', ')} (may refer to someone else)`
					});
				}
				continue;
			}

			const present =
				PRESENT_CONSTRUCTION.test(sentence) ||
				(PRESENT_MARKER.test(sentence) && !PAST_VERB.test(sentence));
			const writtenAsCurrent = impliedYear >= writtenYear - 2 && age < currentAge;

			if (present && writtenAsCurrent) {
				issues.push({
					kind: 'stale_subject_age',
					severity: quoted ? 'low' : 'high',
					phrase,
					detail: `written as current (${age}); subject is ${currentAge} as of ${String(asOf).slice(0, 10)}`
				});
			} else if (present && !PAST_VERB.test(phrase)) {
				issues.push({
					kind: 'present_age_other',
					severity: quoted ? 'low' : 'medium',
					phrase,
					detail: `present-tense age ${age} that doesn't match the subject (${currentAge}); likely about someone else and stale-prone`
				});
			} else if (
				writtenAsCurrent &&
				/\bat\s/i.test(phrase) &&
				!PAST_VERB.test(sentence) &&
				// "At 42, dance training forced her…" is history; "At 47, Hardy is…"
				// and a heading like "Still Having to Prove It at 62" are not.
				(PRESENT_VERB.test(sentence) || sentence.split(/\s+/).length <= 8)
			) {
				issues.push({
					kind: 'possible_stale_age',
					severity: quoted ? 'low' : 'medium',
					phrase,
					detail: `"${phrase}" matched the subject around when the page was written (${impliedYear}); subject is now ${currentAge}`
				});
			}
		}
	}

	return issues;
}

function endOfMonth(year, monthIndex) {
	return new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59));
}

/** Explicit dates in a sentence, each resolved to the last moment it could refer to. */
export function findDates(sentence) {
	const dates = [];
	const monthYear = new RegExp(
		`\\b(${MONTH_PATTERN})\\s+(?:(\\d{1,2})(?:st|nd|rd|th)?,?\\s+)?(20\\d\\d)\\b`,
		'gi'
	);
	for (const match of sentence.matchAll(monthYear)) {
		const name = match[1].toLowerCase().replace('.', '');
		const month = MONTHS[name.startsWith('sept') ? 'sept' : name.slice(0, 3)];
		const year = Number(match[3]);
		const day = match[2] ? Number(match[2]) : null;
		const end = day ? new Date(Date.UTC(year, month, day, 23, 59, 59)) : endOfMonth(year, month);
		dates.push({ text: match[0], end, index: match.index });
	}
	const isoDate = /\b(20\d\d)-(\d{2})-(\d{2})\b/g;
	for (const match of sentence.matchAll(isoDate)) {
		dates.push({
			text: match[0],
			end: new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 23, 59, 59)),
			index: match.index
		});
	}
	const seasonYear = /\b(spring|summer|fall|autumn|winter)\s+(?:of\s+)?(20\d\d)\b/gi;
	for (const match of sentence.matchAll(seasonYear)) {
		const year = Number(match[2]) + (match[1].toLowerCase() === 'winter' ? 1 : 0);
		dates.push({
			text: match[0],
			end: endOfMonth(year, SEASON_END_MONTH[match[1].toLowerCase()]),
			index: match.index
		});
	}
	const covered = (index) =>
		dates.some((date) => index >= date.index && index < date.index + date.text.length);
	for (const match of sentence.matchAll(/\b(20\d\d)\b/g)) {
		if (covered(match.index)) continue;
		dates.push({ text: match[0], end: endOfMonth(Number(match[1]), 11), index: match.index });
	}
	return dates;
}

/**
 * Future tense about something that has already happened, plus relative time
 * ("later this year") and "as of" stamps on pages that haven't been touched
 * since.
 */
export function findTimeIssues(sentence, { asOf, writtenOn }) {
	const issues = [];
	const now = toDate(asOf);
	const written = toDate(writtenOn);
	const dates = findDates(sentence);
	const passed = dates.filter((date) => date.end < now);
	const allPassed = passed.length > 0 && passed.length === dates.length;
	const strong = sentence.match(FUTURE_MARKER);
	const soft = strong ? null : sentence.match(SOFT_FUTURE_MARKER);
	const marker = strong ?? soft;

	// Quoted speech is history: "I will never forget 2025" was true when said.
	if (marker && allPassed && !isInsideQuote(sentence, marker.index)) {
		issues.push({
			kind: 'past_event_in_future_tense',
			severity: strong ? 'high' : 'medium',
			phrase: marker[0],
			detail: `future tense ("${marker[0]}") about ${passed.map((date) => date.text).join(', ')}, which has passed`
		});
	}

	const relative = sentence.match(RELATIVE_FUTURE);
	if (relative && written && now - written > 1000 * 60 * 60 * 24 * 120) {
		issues.push({
			kind: 'relative_time_stale',
			severity: 'medium',
			phrase: relative[0],
			detail: `"${relative[0]}" written ${String(writtenOn).slice(0, 10)}; the reference has likely moved`
		});
	}

	const asOfStamp = sentence.match(
		new RegExp(`\\bas of\\s+((?:${MONTH_PATTERN}\\s+)?(?:\\d{1,2},?\\s+)?20\\d\\d)\\b`, 'i')
	);
	if (asOfStamp) {
		const [stamp] = findDates(asOfStamp[0]);
		if (stamp && now - stamp.end > 1000 * 60 * 60 * 24 * 90) {
			issues.push({
				kind: 'as_of_dated',
				severity: 'medium',
				phrase: asOfStamp[0],
				detail: `"${asOfStamp[0]}" is more than 90 days old`
			});
		}
	}

	return issues;
}

/**
 * Scan one profile. `segments` are the reader-visible texts: description,
 * body content, and each FAQ question/answer.
 */
export function scanProfile({ person, birthDate, writtenOn, segments }, { asOf }) {
	const findings = [];
	for (const segment of segments) {
		for (const sentence of splitSentences(toPlainText(segment.text))) {
			const issues = [
				...findAgeIssues(sentence, { birthDate, asOf, writtenOn }),
				...findTimeIssues(sentence, { asOf, writtenOn })
			];
			for (const issue of issues) {
				findings.push({ person, where: segment.where, sentence: sentence.slice(0, 400), ...issue });
			}
		}
	}
	return findings;
}

export const SEVERITY_RANK = { high: 3, medium: 2, low: 1 };
