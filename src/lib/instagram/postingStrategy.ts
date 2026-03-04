// src/lib/instagram/postingStrategy.ts

export type CanonicalIndustry =
	| 'creator_media'
	| 'entrepreneur_tech'
	| 'politics_public'
	| 'music'
	| 'film_tv'
	| 'comedy'
	| 'authors'
	| 'other';

export type PrimarySeriesLane = 'creator_media' | 'entrepreneur_tech' | 'politics_public';

export interface PostCandidate {
	name: string;
	link: boolean;
	hasImage: boolean;
	lastmod: string | null;
	contentGrade: number | null;
	canonicalIndustry: CanonicalIndustry;
	canonicalIndustries: CanonicalIndustry[];
	rawTypes: string[];
	timelinessScore: number;
	overallScore: number;
}

export interface SeriesSlot {
	weekStartDate: string;
	lane: PrimarySeriesLane;
	post1: string;
	post2: string;
	burstOptional: boolean;
}

export interface BurstRule {
	id: 'two_credible_outlets_72h' | 'event_window_7d' | 'saves_share_outperform_25';
	description: string;
}

export interface BurstSwapCandidate {
	name: string;
	lane: CanonicalIndustry;
	eventWindowStart: string;
	eventWindowEnd: string;
	rationale: string;
	sourceUrl: string;
}

export interface SlotValidationIssue {
	weekStartDate: string;
	lane: PrimarySeriesLane;
	postName: string;
	reason: 'missing_candidate' | 'not_ready' | 'lane_mismatch';
}

export interface ControversyBudgetIssue {
	earliestWeekStartDate: string;
	laterWeekStartDate: string;
	minimumGapWeeks: number;
	actualGapWeeks: number;
}

const INDUSTRY_PRIORITY: CanonicalIndustry[] = [
	'creator_media',
	'entrepreneur_tech',
	'politics_public',
	'music',
	'film_tv',
	'comedy',
	'authors',
	'other'
];

const RAW_TO_CANONICAL_INDUSTRY: Record<string, CanonicalIndustry> = {
	creator: 'creator_media',
	influencer: 'creator_media',
	tiktoker: 'creator_media',
	journalist: 'creator_media',
	lifestyleinfluencer: 'creator_media',

	entrepreneur: 'entrepreneur_tech',
	techie: 'entrepreneur_tech',
	business: 'entrepreneur_tech',

	politician: 'politics_public',
	activist: 'politics_public',
	historical: 'politics_public',

	musician: 'music',
	moviestar: 'film_tv',
	newmoviestar: 'film_tv',
	celebrity: 'film_tv',
	comedian: 'comedy',
	author: 'authors',

	athlete: 'other',
	sports: 'other',
	psychology: 'other',
	other: 'other',
	essay: 'other',
	culturalicon: 'other'
};

const LANE_TO_CANONICAL: Record<PrimarySeriesLane, CanonicalIndustry> = {
	creator_media: 'creator_media',
	entrepreneur_tech: 'entrepreneur_tech',
	politics_public: 'politics_public'
};

const HIGH_POLARIZATION_NAMES = new Set<string>([
	'Donald-Trump',
	'Kamala-Harris',
	'Joe-Biden',
	'Justin-Trudeau'
]);

export const PRIMARY_SERIES_LANES: PrimarySeriesLane[] = [
	'creator_media',
	'entrepreneur_tech',
	'politics_public'
];

export const OPTIONAL_BURST_LANES: CanonicalIndustry[] = ['music', 'film_tv', 'comedy', 'authors'];

export const PLAN_REFERENCE_DATE = '2026-03-04';
export const PLAN_TIMEZONE = 'America/New_York';

export const BURST_RULES: BurstRule[] = [
	{
		id: 'two_credible_outlets_72h',
		description: 'Add a 3rd post if 2+ credible outlets covered the person in the last 72 hours.'
	},
	{
		id: 'event_window_7d',
		description: 'Add a 3rd post if a known event window opens within 7 days.'
	},
	{
		id: 'saves_share_outperform_25',
		description:
			'Add a 3rd post if the previous post in the same lane beat the rolling 4-week saves/share median by 25%+.'
	}
];

export const BURST_SWAP_CANDIDATES: BurstSwapCandidate[] = [
	{
		name: 'Sundar-Pichai',
		lane: 'entrepreneur_tech',
		eventWindowStart: '2026-05-19',
		eventWindowEnd: '2026-05-20',
		rationale: 'Google I/O timing window',
		sourceUrl: 'https://blog.google/technology/developers/google-io-2026/'
	},
	{
		name: 'Satya-Nadella',
		lane: 'entrepreneur_tech',
		eventWindowStart: '2026-06-02',
		eventWindowEnd: '2026-06-03',
		rationale: 'Microsoft Build timing window',
		sourceUrl: 'https://www.theverge.com/news/638653/microsoft-build-2026-date-details'
	},
	{
		name: 'Charli-xcx',
		lane: 'music',
		eventWindowStart: '2026-07-01',
		eventWindowEnd: '2026-08-31',
		rationale: 'Festival and ticket-cycle timing for summer music windows',
		sourceUrl: 'https://www.sfoutsidelands.com/'
	}
];

export const EIGHT_WEEK_SERIES_SEQUENCE: SeriesSlot[] = [
	{
		weekStartDate: '2026-03-10',
		lane: 'entrepreneur_tech',
		post1: 'Sam-Altman',
		post2: 'Peter-Thiel',
		burstOptional: true
	},
	{
		weekStartDate: '2026-03-17',
		lane: 'creator_media',
		post1: 'Shaan-Puri',
		post2: 'Sam-Parr',
		burstOptional: true
	},
	{
		weekStartDate: '2026-03-24',
		lane: 'creator_media',
		post1: 'Lex-Fridman',
		post2: 'Tim-Ferriss',
		burstOptional: true
	},
	{
		weekStartDate: '2026-03-31',
		lane: 'politics_public',
		post1: 'Donald-Trump',
		post2: 'Kamala-Harris',
		burstOptional: false
	},
	{
		weekStartDate: '2026-04-07',
		lane: 'entrepreneur_tech',
		post1: 'Mark-Zuckerberg',
		post2: 'Satya-Nadella',
		burstOptional: true
	},
	{
		weekStartDate: '2026-04-14',
		lane: 'creator_media',
		post1: 'IShowSpeed',
		post2: 'Kai-Cenat',
		burstOptional: true
	},
	{
		weekStartDate: '2026-04-21',
		lane: 'politics_public',
		post1: 'Joe-Biden',
		post2: 'Justin-Trudeau',
		burstOptional: false
	},
	{
		weekStartDate: '2026-04-28',
		lane: 'entrepreneur_tech',
		post1: 'Chamath-Palihapitiya',
		post2: 'Alex-Hormozi',
		burstOptional: true
	}
];

function normalizeRawLabel(label: string): string {
	return label
		.trim()
		.toLowerCase()
		.replace(/[\s\-_]+/g, '')
		.replace(/[^a-z0-9]/g, '');
}

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

function asDate(value: string): Date {
	return new Date(`${value}T00:00:00Z`);
}

function daysBetween(startDate: string, endDate: string): number {
	const diffMs = asDate(endDate).getTime() - asDate(startDate).getTime();
	return Math.round(diffMs / 86_400_000);
}

function compareCandidatesForLane(
	a: PostCandidate,
	b: PostCandidate,
	referenceDate: string
): number {
	if (b.timelinessScore !== a.timelinessScore) {
		return b.timelinessScore - a.timelinessScore;
	}

	const gradeA = a.contentGrade ?? 0;
	const gradeB = b.contentGrade ?? 0;
	if (gradeB !== gradeA) {
		return gradeB - gradeA;
	}

	const freshnessA = scoreFreshness(a.lastmod, referenceDate);
	const freshnessB = scoreFreshness(b.lastmod, referenceDate);
	if (freshnessB !== freshnessA) {
		return freshnessB - freshnessA;
	}

	return b.overallScore - a.overallScore;
}

export function normalizeIndustryLabel(rawLabel: string): CanonicalIndustry {
	const key = normalizeRawLabel(rawLabel);
	return RAW_TO_CANONICAL_INDUSTRY[key] ?? 'other';
}

export function mapRawTypesToCanonical(rawTypes: string[]): CanonicalIndustry[] {
	const unique = new Set<CanonicalIndustry>();
	for (const rawType of rawTypes) {
		unique.add(normalizeIndustryLabel(rawType));
	}
	if (unique.size === 0) {
		unique.add('other');
	}

	return INDUSTRY_PRIORITY.filter((industry) => unique.has(industry));
}

export function resolvePrimaryIndustry(
	canonicalIndustries: CanonicalIndustry[]
): CanonicalIndustry {
	if (canonicalIndustries.length === 0) {
		return 'other';
	}
	for (const industry of INDUSTRY_PRIORITY) {
		if (canonicalIndustries.includes(industry)) {
			return industry;
		}
	}
	return canonicalIndustries[0] ?? 'other';
}

export function scoreFreshness(
	lastmod: string | null,
	referenceDate = PLAN_REFERENCE_DATE
): number {
	if (!lastmod) {
		return 0;
	}
	const ageDays = daysBetween(lastmod, referenceDate);
	if (ageDays <= 7) return 1;
	if (ageDays <= 21) return 0.85;
	if (ageDays <= 45) return 0.65;
	if (ageDays <= 90) return 0.4;
	return 0.2;
}

export function scoreQuality(contentGrade: number | null): number {
	if (contentGrade === null) {
		return 0.65;
	}
	return clamp(contentGrade / 10, 0, 1);
}

export function scoreTimeliness(
	lastmod: string | null,
	referenceDate = PLAN_REFERENCE_DATE,
	eventWindowBoost = 0
): number {
	const freshnessScore = scoreFreshness(lastmod, referenceDate);
	return clamp(Math.max(freshnessScore, eventWindowBoost), 0, 1);
}

export function computeOverallScore({
	timelinessScore,
	qualityScore,
	freshnessScore,
	controversyPenalty = 0
}: {
	timelinessScore: number;
	qualityScore: number;
	freshnessScore: number;
	controversyPenalty?: number;
}): number {
	const raw =
		timelinessScore * 50 + qualityScore * 35 + freshnessScore * 15 - controversyPenalty * 10;
	return Number(clamp(raw, 0, 100).toFixed(2));
}

export function isCandidateReady(candidate: Pick<PostCandidate, 'link' | 'hasImage'>): boolean {
	return candidate.link && candidate.hasImage;
}

export function isCandidateLaneCompatible(
	candidate: PostCandidate,
	lane: PrimarySeriesLane
): boolean {
	const requiredIndustry = LANE_TO_CANONICAL[lane];
	if (candidate.canonicalIndustry === requiredIndustry) {
		return true;
	}
	return candidate.canonicalIndustries.includes(requiredIndustry);
}

export function buildCandidateMap(candidates: PostCandidate[]): Map<string, PostCandidate> {
	return new Map(candidates.map((candidate) => [candidate.name, candidate]));
}

export function validateSeriesSlots(
	slots: SeriesSlot[],
	candidateByName: Map<string, PostCandidate>
): SlotValidationIssue[] {
	const issues: SlotValidationIssue[] = [];
	for (const slot of slots) {
		for (const postName of [slot.post1, slot.post2]) {
			const candidate = candidateByName.get(postName);
			if (!candidate) {
				issues.push({
					weekStartDate: slot.weekStartDate,
					lane: slot.lane,
					postName,
					reason: 'missing_candidate'
				});
				continue;
			}

			if (!isCandidateReady(candidate)) {
				issues.push({
					weekStartDate: slot.weekStartDate,
					lane: slot.lane,
					postName,
					reason: 'not_ready'
				});
			}

			if (!isCandidateLaneCompatible(candidate, slot.lane)) {
				issues.push({
					weekStartDate: slot.weekStartDate,
					lane: slot.lane,
					postName,
					reason: 'lane_mismatch'
				});
			}
		}
	}
	return issues;
}

export function isHighPolarizationName(name: string): boolean {
	return HIGH_POLARIZATION_NAMES.has(name);
}

export function validateControversyBudget(
	slots: SeriesSlot[],
	minimumGapWeeks = 3
): ControversyBudgetIssue[] {
	const highWeekDates = slots
		.filter((slot) => isHighPolarizationName(slot.post1) || isHighPolarizationName(slot.post2))
		.map((slot) => slot.weekStartDate);

	const issues: ControversyBudgetIssue[] = [];
	for (let i = 1; i < highWeekDates.length; i++) {
		const previousWeek = highWeekDates[i - 1];
		const currentWeek = highWeekDates[i];
		const gapDays = daysBetween(previousWeek, currentWeek);
		const gapWeeks = Math.round(gapDays / 7);
		if (gapWeeks < minimumGapWeeks) {
			issues.push({
				earliestWeekStartDate: previousWeek,
				laterWeekStartDate: currentWeek,
				minimumGapWeeks,
				actualGapWeeks: gapWeeks
			});
		}
	}

	return issues;
}

export function findReplacementCandidate({
	lane,
	candidates,
	excludedNames,
	referenceDate = PLAN_REFERENCE_DATE,
	preferCurrent = true
}: {
	lane: PrimarySeriesLane;
	candidates: PostCandidate[];
	excludedNames: string[] | Set<string>;
	referenceDate?: string;
	preferCurrent?: boolean;
}): PostCandidate | null {
	const excluded = excludedNames instanceof Set ? excludedNames : new Set(excludedNames);
	const filtered = candidates.filter((candidate) => {
		if (excluded.has(candidate.name)) return false;
		if (!isCandidateReady(candidate)) return false;
		if (!isCandidateLaneCompatible(candidate, lane)) return false;
		if (preferCurrent && lane === 'politics_public' && candidate.rawTypes.includes('historical')) {
			return false;
		}
		return true;
	});

	if (filtered.length === 0) {
		return null;
	}

	filtered.sort((a, b) => compareCandidatesForLane(a, b, referenceDate));
	return filtered[0] ?? null;
}
