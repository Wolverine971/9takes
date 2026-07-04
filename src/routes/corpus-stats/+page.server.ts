// src/routes/corpus-stats/+page.server.ts
// Serves the 9takes Corpus Stats page + structured data.
//
// Everything user-visible AND every number in the JSON-LD is bound to the
// auto-generated corpus JSON, so the page never goes stale: each deploy
// regenerates corpus-stats.json and this loader picks it up.
//
// JSON-LD graph emitted:
//   1. WebPage         — wraps the page, points mainEntity at the Dataset
//   2. Dataset         — schema.org/Dataset, the SEO + Google-Dataset target
//   3. FAQPage         — Q&A pairs derived from citable claims
//   4. BreadcrumbList  — Home → Corpus Stats
import type { PageServerLoad } from './$types';
import corpusStats from '$lib/data/corpus-stats.json';
import externalStats from '$lib/data/corpus-stats-external.json';
import {
	CORPUS_DATASET_ID,
	CORPUS_DATASET_LICENSE,
	CORPUS_DATASET_URL,
	CORPUS_DATA_DOWNLOAD,
	NINE_TAKES_ORGANIZATION,
	SITE_URL
} from '$lib/utils/corpusDatasetJsonLd';

const PAGE_URL = CORPUS_DATASET_URL;
const DATASET_ID = CORPUS_DATASET_ID;
const WEBPAGE_ID = `${PAGE_URL}#webpage`;
const FAQ_ID = `${PAGE_URL}#faq`;
// First public deploy of /corpus-stats. Used as datePublished + lower bound
// of temporalCoverage. Hard-coded because it never changes.
const PAGE_FIRST_PUBLISHED = '2025-09-01T00:00:00.000Z';

type ExternalSource = {
	id: string;
	name: string;
	url: string;
	methodology: string;
	sample_size: number;
	date_range: string;
};
type CredibilityReference = {
	id: string;
	name: string;
	citation: string;
	url: string;
	sample_size: number | null;
	contribution: string;
};
type External = {
	last_reviewed: string;
	sources: ExternalSource[];
	credibility_references: CredibilityReference[];
};

const TYPE_NAMES: Record<string, string> = {
	'1': 'Reformer',
	'2': 'Helper',
	'3': 'Achiever',
	'4': 'Individualist',
	'5': 'Investigator',
	'6': 'Loyalist',
	'7': 'Enthusiast',
	'8': 'Challenger',
	'9': 'Peacemaker'
};

const pct = (n: number) => (n * 100).toFixed(1);

export const load: PageServerLoad = async () => {
	const stats = corpusStats as unknown as {
		generated_at?: string;
		totals: { published: number; unpublished_drafts: number };
		enneagram_distribution: { shares: Record<string, number>; counts: Record<string, number> };
		domains: Record<
			string,
			{
				slug: string;
				label: string;
				url: string;
				total: number;
				top_over_represented: { type: number; share: number; count: number; delta_pp: number };
			}
		>;
		pipeline?: { avg_new_per_month: number; in_draft: number };
		citable_claims: string[];
	};
	const external = externalStats as unknown as External;

	const published = stats.totals.published;
	const generatedAt = stats.generated_at ?? new Date().toISOString();
	const externalSampleTotal = external.sources.reduce((sum, s) => sum + s.sample_size, 0);

	// Largest type in the corpus baseline.
	const sortedTypes = Object.entries(stats.enneagram_distribution.shares).sort(
		(a, b) => b[1] - a[1]
	);
	const topType = sortedTypes[0]; // [typeKey, share]
	const topTypeKey = topType[0];
	const topTypeShare = topType[1];
	const topTypeName = TYPE_NAMES[topTypeKey];

	// ----- Dynamic SEO copy. Bound to live numbers. -----
	const title = `Enneagram Type Distribution: ${published} Public Figures Analyzed`;
	const description =
		`Type distribution and over/under-representation across ${published} published ` +
		`public-figure profiles on 9takes, compared against ${externalSampleTotal.toLocaleString()}+ ` +
		`Enneagram test-takers from public datasets. Regenerated on every deploy.`;
	const headline = `The 9takes Corpus: Enneagram Type Distribution Across ${published} Public Figures`;

	// ----- FAQ entries — Q&A pairs derived from citable claims + domain leaders. -----
	// These mirror visible content on the page (required by Google for FAQPage rich results).
	const domainLeaders = Object.values(stats.domains)
		.map((d) => ({
			label: d.label,
			url: d.url,
			top: d.top_over_represented
		}))
		.filter((d) => d.top.delta_pp >= 5)
		.sort((a, b) => b.top.delta_pp - a.top.delta_pp);

	const faqs: { q: string; a: string }[] = [
		{
			q: 'What is the most common Enneagram type among public figures on 9takes?',
			a: `Across ${published} published personality profiles, Type ${topTypeKey} (${topTypeName}) is the most common at ${pct(topTypeShare)}% of the corpus.`
		},
		{
			q: 'Are Enneagram types evenly distributed across public figures?',
			a: `No. The 9takes corpus shows an uneven distribution: Type ${topTypeKey} (${topTypeName}) leads at ${pct(topTypeShare)}% while the rarest types sit near 7%. The often-cited "11.11% per type" baseline is a theoretical prior, not an empirical finding — no primary public dataset supports an even distribution.`
		}
	];

	if (domainLeaders[0]) {
		const d = domainLeaders[0];
		faqs.push({
			q: `Which Enneagram type is most over-represented in ${d.label} on 9takes?`,
			a: `Type ${d.top.type} (${TYPE_NAMES[String(d.top.type)]}) is most over-represented in ${d.label} at ${pct(d.top.share)}% — ${d.top.delta_pp >= 0 ? '+' : ''}${d.top.delta_pp} percentage points above the corpus baseline (n=${d.top.count}).`
		});
	}
	if (domainLeaders[1]) {
		const d = domainLeaders[1];
		faqs.push({
			q: `Which Enneagram type dominates ${d.label} profiles on 9takes?`,
			a: `Type ${d.top.type} (${TYPE_NAMES[String(d.top.type)]}) is the dominant type in ${d.label} at ${pct(d.top.share)}% — ${d.top.delta_pp >= 0 ? '+' : ''}${d.top.delta_pp} percentage points above the 9takes corpus baseline (n=${d.top.count}).`
		});
	}

	faqs.push({
		q: 'How does the 9takes corpus compare to public Enneagram test-taker data?',
		a: `The 9takes corpus over-indexes on Type 3 (Achiever) and under-indexes on Type 9 (Peacemaker) compared to the largest public datasets (~${externalSampleTotal.toLocaleString()} test-takers across ${external.sources.length} published sources). The gap reflects sample bias: public figures are selected for visibility, which skews toward Achievers, while Peacemakers tend to be culturally invisible.`
	});

	if (stats.pipeline) {
		faqs.push({
			q: 'How often is the 9takes corpus updated?',
			a: `The corpus is regenerated on every deploy. As of the latest update, ~${stats.pipeline.avg_new_per_month} new profiles ship per month, with ${stats.pipeline.in_draft} additional profiles in the review pipeline.`
		});
	}

	faqs.push({
		q: 'Is the 9takes corpus data publicly available?',
		a: `Yes. The full dataset is licensed under Creative Commons Attribution 4.0 (CC BY 4.0) and downloadable as machine-readable JSON at ${SITE_URL}/corpus-stats.json. Cite the generation date and link back to ${PAGE_URL}.`
	});

	// ----- isBasedOn: external source pages we explicitly compare against. -----
	const isBasedOn = external.sources.map((s) => ({
		'@type': 'CreativeWork',
		name: s.name,
		url: s.url,
		description: `${s.methodology} Sample size: ${s.sample_size.toLocaleString()} (${s.date_range}).`,
		publisher: { '@type': 'Organization', name: s.name, url: s.url }
	}));

	// ----- citation: peer-reviewed validity references (separate from comparison data). -----
	const academicCitations = external.credibility_references.map((r) => `${r.citation} ${r.url}`);

	// ----- 1. Dataset (the SEO target) -----
	const datasetJsonLd = {
		'@type': 'Dataset',
		'@id': DATASET_ID,
		name: '9takes Enneagram Personality Type Distribution Corpus',
		alternateName: '9takes Corpus Stats',
		description,
		url: PAGE_URL,
		mainEntityOfPage: { '@id': WEBPAGE_ID },
		identifier: PAGE_URL,
		creator: NINE_TAKES_ORGANIZATION,
		publisher: NINE_TAKES_ORGANIZATION,
		datePublished: PAGE_FIRST_PUBLISHED,
		dateModified: generatedAt,
		license: CORPUS_DATASET_LICENSE,
		isAccessibleForFree: true,
		inLanguage: 'en',
		temporalCoverage: `${PAGE_FIRST_PUBLISHED.slice(0, 10)}/${generatedAt.slice(0, 10)}`,
		measurementTechnique:
			'Manual Enneagram typing of public figures by 9takes editors, drawing on biographical sources, long-form interviews, and published behavioral evidence. Each figure is tagged with one or more profession domains and a primary Enneagram type (1-9).',
		size: `${published} public-figure profiles`,
		keywords: [
			'Enneagram',
			'personality type distribution',
			'public figures',
			'celebrity Enneagram',
			'type prevalence',
			'data journalism',
			'Enneagram research',
			'comparison to published data',
			`${published} public figures analyzed`
		].join(', '),
		variableMeasured: [
			{
				'@type': 'PropertyValue',
				name: 'enneagram_type_share',
				description:
					'Share of profiles by Enneagram type (1-9), corpus-wide and per profession domain.'
			},
			{
				'@type': 'PropertyValue',
				name: 'over_representation_by_domain',
				description:
					'Per-domain delta in percentage points between the domain type share and the corpus-wide baseline share.'
			},
			{
				'@type': 'PropertyValue',
				name: 'publishing_pipeline_cadence',
				description:
					'Drafts in pipeline, profiles published in the last 30/90 days, and trailing-90-day average new profiles per month.'
			},
			{
				'@type': 'PropertyValue',
				name: 'delta_vs_public_test_taker_distributions',
				description:
					'Per-type percentage-point delta between the 9takes corpus and published Enneagram test-taker datasets.'
			}
		],
		distribution: [CORPUS_DATA_DOWNLOAD],
		isBasedOn,
		citation: academicCitations
	};

	// ----- 2. WebPage wrapper -----
	const webPageJsonLd = {
		'@type': 'WebPage',
		'@id': WEBPAGE_ID,
		url: PAGE_URL,
		name: title,
		description,
		inLanguage: 'en',
		isPartOf: {
			'@type': 'WebSite',
			'@id': `${SITE_URL}#website`,
			url: SITE_URL,
			name: '9takes'
		},
		mainEntity: { '@id': DATASET_ID },
		breadcrumb: { '@id': `${PAGE_URL}#breadcrumbs` },
		datePublished: PAGE_FIRST_PUBLISHED,
		dateModified: generatedAt,
		// Voice / AI assistants: prioritize the headline summary + citable claims.
		speakable: {
			'@type': 'SpeakableSpecification',
			cssSelector: ['#key-findings', '#citable-claims']
		}
	};

	// ----- 3. FAQPage -----
	const faqJsonLd = {
		'@type': 'FAQPage',
		'@id': FAQ_ID,
		isPartOf: { '@id': WEBPAGE_ID },
		mainEntity: faqs.map((f) => ({
			'@type': 'Question',
			name: f.q,
			acceptedAnswer: {
				'@type': 'Answer',
				text: f.a
			}
		}))
	};

	// ----- 4. Breadcrumbs -----
	const breadcrumbJsonLd = {
		'@type': 'BreadcrumbList',
		'@id': `${PAGE_URL}#breadcrumbs`,
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
			{ '@type': 'ListItem', position: 2, name: 'Corpus Stats', item: PAGE_URL }
		]
	};

	return {
		stats: corpusStats,
		seo: {
			title,
			description,
			headline,
			generatedAt,
			datePublished: PAGE_FIRST_PUBLISHED,
			externalSampleTotal,
			faqs
		},
		jsonLd: {
			'@context': 'https://schema.org',
			'@graph': [webPageJsonLd, datasetJsonLd, faqJsonLd, breadcrumbJsonLd]
		}
	};
};
