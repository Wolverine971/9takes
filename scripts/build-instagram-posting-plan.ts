// scripts/build-instagram-posting-plan.ts
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

import { famousTypes } from '../src/lib/components/molecules/famousTypes';
import {
	BURST_RULES,
	BURST_SWAP_CANDIDATES,
	EIGHT_WEEK_SERIES_SEQUENCE,
	PLAN_REFERENCE_DATE,
	PLAN_TIMEZONE,
	type PostCandidate,
	type PrimarySeriesLane,
	type SeriesSlot,
	buildCandidateMap,
	computeOverallScore,
	findReplacementCandidate,
	isCandidateLaneCompatible,
	isCandidateReady,
	isHighPolarizationName,
	mapRawTypesToCanonical,
	resolvePrimaryIndustry,
	scoreFreshness,
	scoreQuality,
	scoreTimeliness,
	validateControversyBudget,
	validateSeriesSlots
} from '../src/lib/instagram/postingStrategy';

interface FamousPersonEntry {
	name: string;
	link: boolean;
	hasImage: boolean;
	lastmod: string | null;
	contentGrade: number | null;
}

interface TimelinessEventWindow {
	name: string;
	startDate: string;
	endDate: string;
	boost: number;
}

interface ResolvedPost {
	name: string;
	date: string;
	path: string;
	link: boolean;
	hasImage: boolean;
	contentGrade: number | null;
	lastmod: string | null;
	timelinessScore: number;
	overallScore: number;
	canonicalIndustry: string;
	replacedFrom?: string;
}

interface ResolvedSeriesSlot {
	weekStartDate: string;
	lane: PrimarySeriesLane;
	post1: ResolvedPost;
	post2: ResolvedPost;
	burstOptional: boolean;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

const DRAFTS_DIR = path.join(REPO_ROOT, 'src', 'blog', 'people', 'drafts');
const OUTPUT_DIR = path.join(REPO_ROOT, 'docs', 'instagram');
const OUTPUT_JSON = path.join(OUTPUT_DIR, 'instagram-posting-plan-mar-apr-2026.json');
const OUTPUT_MD = path.join(OUTPUT_DIR, 'instagram-posting-plan-mar-apr-2026.md');

const TIMELINESS_EVENT_WINDOWS: TimelinessEventWindow[] = [
	{
		name: 'Kamala-Harris',
		startDate: '2026-03-01',
		endDate: '2026-03-14',
		boost: 0.95
	},
	{
		name: 'Joe-Biden',
		startDate: '2026-03-01',
		endDate: '2026-03-14',
		boost: 0.9
	},
	{
		name: 'Donald-Trump',
		startDate: '2026-03-31',
		endDate: '2026-04-02',
		boost: 1
	},
	{
		name: 'Sundar-Pichai',
		startDate: '2026-05-19',
		endDate: '2026-05-20',
		boost: 1
	},
	{
		name: 'Satya-Nadella',
		startDate: '2026-06-02',
		endDate: '2026-06-03',
		boost: 1
	},
	{
		name: 'Charli-xcx',
		startDate: '2026-07-01',
		endDate: '2026-08-31',
		boost: 0.85
	}
];

const ACCEPTANCE_CRITERIA = [
	'No major news in scheduled week: keep pair and do not burst.',
	'Major breaking news in same lane: swap only within lane and preserve 2-post series.',
	'Politics over-indexes comments but under-indexes saves/shares: reduce politics from 2/8 weeks to 1/8 in the next cycle.',
	'Scheduled candidate has link=false or missing image: reject candidate and replace from same lane.',
	'4-week checkpoint: publish consistency 8/8 scheduled posts shipped.',
	'4-week checkpoint: saves/share rate +15% vs previous 4-week baseline.',
	'4-week checkpoint: 70%+ of posts from creator_media + entrepreneur_tech lanes.'
];

const ASSUMPTIONS = [
	'Reach growth is prioritized over click-through as the primary objective.',
	'Published-only execution: only people with link=true are valid for schedule slots.',
	'Moderate polarization: no more than one high-polarization week every 3 weeks.',
	'"Two in series" means back-to-back same-lane posts in the same week.',
	'Mostly current/living figures for the primary sequence.'
];

function normalizePersonKey(value: string): string {
	return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function asDate(date: string): Date {
	return new Date(`${date}T00:00:00Z`);
}

function addDays(date: string, days: number): string {
	const next = asDate(date);
	next.setUTCDate(next.getUTCDate() + days);
	return next.toISOString().slice(0, 10);
}

function daysBetween(startDate: string, endDate: string): number {
	const diffMs = asDate(endDate).getTime() - asDate(startDate).getTime();
	return Math.round(diffMs / 86_400_000);
}

function toStringArray(value: unknown): string[] {
	if (Array.isArray(value)) {
		return value.map((entry) => String(entry));
	}
	if (typeof value === 'string' && value.trim().length > 0) {
		return [value.trim()];
	}
	return [];
}

async function loadDraftTypeMap(): Promise<Map<string, string[]>> {
	const map = new Map<string, string[]>();
	const entries = await fs.readdir(DRAFTS_DIR, { withFileTypes: true });
	for (const entry of entries) {
		if (!entry.isFile() || !entry.name.endsWith('.md')) {
			continue;
		}

		const filePath = path.join(DRAFTS_DIR, entry.name);
		const content = await fs.readFile(filePath, 'utf8');
		const frontmatter = matter(content);
		const types = toStringArray(frontmatter.data.type)
			.map((type) => type.trim())
			.filter(Boolean);
		const fileStem = entry.name.slice(0, -3);
		map.set(normalizePersonKey(fileStem), types);
	}
	return map;
}

function getEventWindowBoost(name: string, referenceDate: string): number {
	const windows = TIMELINESS_EVENT_WINDOWS.filter((window) => window.name === name);
	if (windows.length === 0) {
		return 0;
	}

	let maxBoost = 0;
	for (const window of windows) {
		if (referenceDate >= window.startDate && referenceDate <= window.endDate) {
			maxBoost = Math.max(maxBoost, window.boost);
			continue;
		}

		const daysUntilStart = daysBetween(referenceDate, window.startDate);
		if (daysUntilStart >= 0 && daysUntilStart <= 14) {
			const proximityMultiplier = 1 - daysUntilStart / 14;
			maxBoost = Math.max(maxBoost, Number((window.boost * proximityMultiplier).toFixed(3)));
		}
	}

	return maxBoost;
}

function collectFamousPeople(): FamousPersonEntry[] {
	const rows: FamousPersonEntry[] = [];
	for (const people of Object.values(famousTypes)) {
		for (const person of people) {
			rows.push({
				name: person.name,
				link: person.link,
				hasImage: person.hasImage,
				lastmod: person.lastmod,
				contentGrade: person.contentGrade
			});
		}
	}
	return rows;
}

function buildCandidates(
	allPeople: FamousPersonEntry[],
	typeMap: Map<string, string[]>
): PostCandidate[] {
	return allPeople.map((person) => {
		const rawTypes = typeMap.get(normalizePersonKey(person.name)) ?? [];
		const canonicalIndustries = mapRawTypesToCanonical(rawTypes);
		const canonicalIndustry = resolvePrimaryIndustry(canonicalIndustries);
		const eventWindowBoost = getEventWindowBoost(person.name, PLAN_REFERENCE_DATE);
		const timelinessScore = scoreTimeliness(person.lastmod, PLAN_REFERENCE_DATE, eventWindowBoost);
		const qualityScore = scoreQuality(person.contentGrade);
		const freshnessScore = scoreFreshness(person.lastmod, PLAN_REFERENCE_DATE);
		const controversyPenalty = isHighPolarizationName(person.name) ? 0.15 : 0;

		return {
			name: person.name,
			link: person.link,
			hasImage: person.hasImage,
			lastmod: person.lastmod,
			contentGrade: person.contentGrade,
			canonicalIndustry,
			canonicalIndustries,
			rawTypes,
			timelinessScore,
			overallScore: computeOverallScore({
				timelinessScore,
				qualityScore,
				freshnessScore,
				controversyPenalty
			})
		};
	});
}

function resolvePost(
	postName: string,
	slot: SeriesSlot,
	candidateByName: Map<string, PostCandidate>,
	allCandidates: PostCandidate[],
	excludedNames: Set<string>
): { candidate: PostCandidate | null; replacedFrom?: string } {
	const candidate = candidateByName.get(postName) ?? null;

	if (candidate && isCandidateReady(candidate) && isCandidateLaneCompatible(candidate, slot.lane)) {
		excludedNames.add(candidate.name);
		return { candidate };
	}

	const replacement = findReplacementCandidate({
		lane: slot.lane,
		candidates: allCandidates,
		excludedNames,
		referenceDate: PLAN_REFERENCE_DATE,
		preferCurrent: true
	});

	if (!replacement) {
		return { candidate: null };
	}

	excludedNames.add(replacement.name);
	return {
		candidate: replacement,
		replacedFrom: postName
	};
}

function toResolvedPost(
	name: string,
	date: string,
	candidate: PostCandidate,
	replacedFrom?: string
): ResolvedPost {
	return {
		name,
		date,
		path: `/personality-analysis/${name}`,
		link: candidate.link,
		hasImage: candidate.hasImage,
		contentGrade: candidate.contentGrade,
		lastmod: candidate.lastmod,
		timelinessScore: candidate.timelinessScore,
		overallScore: candidate.overallScore,
		canonicalIndustry: candidate.canonicalIndustry,
		...(replacedFrom ? { replacedFrom } : {})
	};
}

function resolveSchedule(
	candidateByName: Map<string, PostCandidate>,
	allCandidates: PostCandidate[]
) {
	const usedNames = new Set<string>();
	const unresolvedNames: string[] = [];

	const slots: ResolvedSeriesSlot[] = EIGHT_WEEK_SERIES_SEQUENCE.map((slot) => {
		const tuesdayDate = slot.weekStartDate;
		const fridayDate = addDays(slot.weekStartDate, 3);

		const post1 = resolvePost(slot.post1, slot, candidateByName, allCandidates, usedNames);
		const post2 = resolvePost(slot.post2, slot, candidateByName, allCandidates, usedNames);

		if (!post1.candidate) unresolvedNames.push(slot.post1);
		if (!post2.candidate) unresolvedNames.push(slot.post2);

		return {
			weekStartDate: slot.weekStartDate,
			lane: slot.lane,
			post1: post1.candidate
				? toResolvedPost(post1.candidate.name, tuesdayDate, post1.candidate, post1.replacedFrom)
				: {
						name: slot.post1,
						date: tuesdayDate,
						path: `/personality-analysis/${slot.post1}`,
						link: false,
						hasImage: false,
						contentGrade: null,
						lastmod: null,
						timelinessScore: 0,
						overallScore: 0,
						canonicalIndustry: 'other'
					},
			post2: post2.candidate
				? toResolvedPost(post2.candidate.name, fridayDate, post2.candidate, post2.replacedFrom)
				: {
						name: slot.post2,
						date: fridayDate,
						path: `/personality-analysis/${slot.post2}`,
						link: false,
						hasImage: false,
						contentGrade: null,
						lastmod: null,
						timelinessScore: 0,
						overallScore: 0,
						canonicalIndustry: 'other'
					},
			burstOptional: slot.burstOptional
		};
	});

	return {
		slots,
		unresolvedNames
	};
}

function rankLaneCandidates(
	candidates: PostCandidate[],
	lane: PrimarySeriesLane,
	excludedNames: Set<string>
): PostCandidate[] {
	const ranked = candidates
		.filter((candidate) => {
			if (!isCandidateReady(candidate)) return false;
			if (excludedNames.has(candidate.name)) return false;
			if (!isCandidateLaneCompatible(candidate, lane)) return false;
			if (lane === 'politics_public' && candidate.rawTypes.includes('historical')) return false;
			return true;
		})
		.sort((a, b) => {
			if (b.timelinessScore !== a.timelinessScore) {
				return b.timelinessScore - a.timelinessScore;
			}
			const gradeA = a.contentGrade ?? 0;
			const gradeB = b.contentGrade ?? 0;
			if (gradeB !== gradeA) {
				return gradeB - gradeA;
			}
			const freshnessA = scoreFreshness(a.lastmod, PLAN_REFERENCE_DATE);
			const freshnessB = scoreFreshness(b.lastmod, PLAN_REFERENCE_DATE);
			if (freshnessB !== freshnessA) {
				return freshnessB - freshnessA;
			}
			return b.overallScore - a.overallScore;
		});

	return ranked;
}

function summarizeInventory(candidates: PostCandidate[]) {
	return {
		total: candidates.length,
		published: candidates.filter((candidate) => candidate.link).length,
		queued: candidates.filter((candidate) => !candidate.link).length,
		publishedWithImages: candidates.filter((candidate) => candidate.link && candidate.hasImage)
			.length,
		queuedWithImages: candidates.filter((candidate) => !candidate.link && candidate.hasImage)
			.length,
		graded: candidates.filter((candidate) => candidate.contentGrade !== null).length,
		highQuality: candidates.filter((candidate) => (candidate.contentGrade ?? 0) >= 9).length
	};
}

function formatPercent(numerator: number, denominator: number): string {
	if (denominator === 0) return '0%';
	return `${Math.round((numerator / denominator) * 100)}%`;
}

function buildMarkdown(data: {
	generatedAt: string;
	inventory: ReturnType<typeof summarizeInventory>;
	schedule: ResolvedSeriesSlot[];
	slotIssues: ReturnType<typeof validateSeriesSlots>;
	controversyIssues: ReturnType<typeof validateControversyBudget>;
	reservesByLane: Record<PrimarySeriesLane, PostCandidate[]>;
}): string {
	const lines: string[] = [];
	lines.push('<!-- docs/instagram/instagram-posting-plan-mar-apr-2026.md -->');
	lines.push('');
	lines.push('# Instagram Posting Plan - March-April 2026');
	lines.push('');
	lines.push(`Generated: ${data.generatedAt}`);
	lines.push(`Reference date: ${PLAN_REFERENCE_DATE}`);
	lines.push(`Timezone: ${PLAN_TIMEZONE}`);
	lines.push('');
	lines.push('## Defaults');
	lines.push('');
	lines.push('- Goal: reach growth first.');
	lines.push('- Scope: published-only posts (`link: true`).');
	lines.push('- Polarization: moderate (max one high-polarization week every 3 weeks).');
	lines.push('- Cadence: 2 baseline posts/week on Tuesday + Friday, with burst option.');
	lines.push('- Series rule: back-to-back same-lane posts each week.');
	lines.push('- Historical mix: mostly current/living figures.');
	lines.push('');
	lines.push('## Inventory Summary');
	lines.push('');
	lines.push(`- Total people: ${data.inventory.total}`);
	lines.push(`- Published: ${data.inventory.published}`);
	lines.push(`- Queued: ${data.inventory.queued}`);
	lines.push(`- Published + image-ready: ${data.inventory.publishedWithImages}`);
	lines.push(`- Queued + image-ready: ${data.inventory.queuedWithImages}`);
	lines.push(`- Graded content: ${data.inventory.graded}`);
	lines.push(`- High-quality (>=9.0): ${data.inventory.highQuality}`);
	lines.push('');
	lines.push('## 8-Week Schedule');
	lines.push('');
	lines.push('| Week Start | Lane | Tuesday Post | Friday Post | Burst Optional |');
	lines.push('| --- | --- | --- | --- | --- |');
	for (const slot of data.schedule) {
		const tuesdayLabel = slot.post1.replacedFrom
			? `${slot.post1.name} (replaced ${slot.post1.replacedFrom})`
			: slot.post1.name;
		const fridayLabel = slot.post2.replacedFrom
			? `${slot.post2.name} (replaced ${slot.post2.replacedFrom})`
			: slot.post2.name;
		lines.push(
			`| ${slot.weekStartDate} | ${slot.lane} | ${tuesdayLabel} (${slot.post1.date}) | ${fridayLabel} (${slot.post2.date}) | ${slot.burstOptional ? 'Yes' : 'No'} |`
		);
	}
	lines.push('');
	lines.push('## Burst Rules');
	lines.push('');
	for (const rule of BURST_RULES) {
		lines.push(`- ${rule.description}`);
	}
	lines.push('');
	lines.push('## Burst Swap Candidates');
	lines.push('');
	for (const candidate of BURST_SWAP_CANDIDATES) {
		lines.push(
			`- ${candidate.name} (${candidate.lane}) - ${candidate.eventWindowStart} to ${candidate.eventWindowEnd}. ${candidate.rationale}.`
		);
	}
	lines.push('');
	lines.push('## Validation');
	lines.push('');
	lines.push(`- Slot validation issues: ${data.slotIssues.length}`);
	lines.push(`- Controversy budget issues: ${data.controversyIssues.length}`);
	lines.push('');
	if (data.slotIssues.length > 0) {
		lines.push('### Slot Issues');
		lines.push('');
		for (const issue of data.slotIssues) {
			lines.push(`- ${issue.weekStartDate} | ${issue.lane} | ${issue.postName} -> ${issue.reason}`);
		}
		lines.push('');
	}
	if (data.controversyIssues.length > 0) {
		lines.push('### Controversy Issues');
		lines.push('');
		for (const issue of data.controversyIssues) {
			lines.push(
				`- ${issue.earliestWeekStartDate} to ${issue.laterWeekStartDate}: ${issue.actualGapWeeks} weeks (min ${issue.minimumGapWeeks}).`
			);
		}
		lines.push('');
	}
	lines.push('## Reserve Pool By Lane (Top 6)');
	lines.push('');
	for (const lane of ['creator_media', 'entrepreneur_tech', 'politics_public'] as const) {
		lines.push(`### ${lane}`);
		lines.push('');
		for (const candidate of data.reservesByLane[lane].slice(0, 6)) {
			lines.push(
				`- ${candidate.name} (grade: ${candidate.contentGrade ?? 'n/a'}, timeliness: ${candidate.timelinessScore.toFixed(2)}, score: ${candidate.overallScore.toFixed(2)})`
			);
		}
		lines.push('');
	}
	lines.push('## Acceptance Criteria');
	lines.push('');
	for (const criterion of ACCEPTANCE_CRITERIA) {
		lines.push(`- ${criterion}`);
	}
	lines.push('');
	lines.push('## Mix Check');
	lines.push('');
	const creatorEntrepreneurCount = data.schedule.filter(
		(slot) => slot.lane === 'creator_media' || slot.lane === 'entrepreneur_tech'
	).length;
	lines.push(
		`- Creator + entrepreneur weeks: ${creatorEntrepreneurCount}/${data.schedule.length} (${formatPercent(creatorEntrepreneurCount, data.schedule.length)})`
	);
	lines.push('- Politics weeks: 2/8 (controlled).');
	lines.push('');
	lines.push('## Assumptions');
	lines.push('');
	for (const assumption of ASSUMPTIONS) {
		lines.push(`- ${assumption}`);
	}
	lines.push('');

	return lines.join('\n');
}

async function main(): Promise<void> {
	const draftTypeMap = await loadDraftTypeMap();
	const allPeople = collectFamousPeople();
	const candidates = buildCandidates(allPeople, draftTypeMap);
	const candidateByName = buildCandidateMap(candidates);
	const inventory = summarizeInventory(candidates);

	const { slots, unresolvedNames } = resolveSchedule(candidateByName, candidates);
	const resolvedSeriesSlots: SeriesSlot[] = slots.map((slot) => ({
		weekStartDate: slot.weekStartDate,
		lane: slot.lane,
		post1: slot.post1.name,
		post2: slot.post2.name,
		burstOptional: slot.burstOptional
	}));

	const slotIssues = validateSeriesSlots(resolvedSeriesSlots, candidateByName);
	const controversyIssues = validateControversyBudget(resolvedSeriesSlots, 3);

	const scheduledNames = new Set(slots.flatMap((slot) => [slot.post1.name, slot.post2.name]));
	const reservesByLane: Record<PrimarySeriesLane, PostCandidate[]> = {
		creator_media: rankLaneCandidates(candidates, 'creator_media', scheduledNames),
		entrepreneur_tech: rankLaneCandidates(candidates, 'entrepreneur_tech', scheduledNames),
		politics_public: rankLaneCandidates(candidates, 'politics_public', scheduledNames)
	};

	const generatedAt = new Date().toISOString();
	const output = {
		title: 'Instagram Posting Plan: 8-Week Series Strategy',
		generatedAt,
		referenceDate: PLAN_REFERENCE_DATE,
		timezone: PLAN_TIMEZONE,
		defaults: {
			primaryGoal: 'reach_growth',
			contentScope: 'published_only',
			polarizationPolicy: 'moderate_mix',
			cadenceMode: '2_baseline_plus_bursts',
			seriesRule: 'back_to_back_posts',
			historyMix: 'mostly_current'
		},
		canonicalModel: {
			primaryLanes: ['creator_media', 'entrepreneur_tech', 'politics_public'],
			optionalBurstLanes: ['music', 'film_tv', 'comedy', 'authors', 'other'],
			normalizationNotes: {
				creator_media: ['creator', 'influencer', 'tiktoker', 'journalist'],
				entrepreneur_tech: ['entrepreneur', 'techie', 'business'],
				politics_public: ['politician', 'activist', 'historical (rare)']
			}
		},
		inventory,
		schedule: slots,
		burstRules: BURST_RULES,
		burstSwapCandidates: BURST_SWAP_CANDIDATES,
		acceptanceCriteria: ACCEPTANCE_CRITERIA,
		assumptions: ASSUMPTIONS,
		validation: {
			slotIssues,
			controversyIssues,
			unresolvedNames
		},
		reservePool: {
			creator_media: reservesByLane.creator_media.slice(0, 10),
			entrepreneur_tech: reservesByLane.entrepreneur_tech.slice(0, 10),
			politics_public: reservesByLane.politics_public.slice(0, 10)
		}
	};

	await fs.mkdir(OUTPUT_DIR, { recursive: true });
	await fs.writeFile(OUTPUT_JSON, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
	await fs.writeFile(
		OUTPUT_MD,
		buildMarkdown({
			generatedAt,
			inventory,
			schedule: slots,
			slotIssues,
			controversyIssues,
			reservesByLane
		}),
		'utf8'
	);

	console.log('✅ Instagram posting plan generated');
	console.log(`   JSON: ${path.relative(REPO_ROOT, OUTPUT_JSON)}`);
	console.log(`   Markdown: ${path.relative(REPO_ROOT, OUTPUT_MD)}`);
	console.log(`   Slot issues: ${slotIssues.length}`);
	console.log(`   Controversy issues: ${controversyIssues.length}`);
	if (unresolvedNames.length > 0) {
		console.log(`   Unresolved names: ${unresolvedNames.join(', ')}`);
	}
}

main().catch((error: unknown) => {
	console.error('❌ Failed to build Instagram posting plan');
	console.error(error);
	process.exit(1);
});
