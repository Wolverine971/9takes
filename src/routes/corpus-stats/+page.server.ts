// src/routes/corpus-stats/+page.server.ts
// Serves the 9takes Corpus Stats page + schema.org Dataset JSON-LD.
// Dataset description and citation graph are built dynamically from the
// auto-generated corpus JSON and the hand-curated external-sources JSON
// so the structured data never drifts from what the page shows.
import type { PageServerLoad } from './$types';
import corpusStats from '$lib/data/corpus-stats.json';
import externalStats from '$lib/data/corpus-stats-external.json';

const SITE_URL = 'https://9takes.com';

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

export const load: PageServerLoad = async () => {
	const stats = corpusStats as {
		generated_at?: string;
		totals: { published: number };
	};
	const external = externalStats as unknown as External;

	const externalDataSources = external.sources.map((s) => ({
		'@type': 'CreativeWork',
		name: s.name,
		url: s.url,
		description: `${s.methodology} (n ≈ ${s.sample_size.toLocaleString()}, ${s.date_range}).`
	}));

	const academicCitations = external.credibility_references.map((r) => ({
		'@type': 'ScholarlyArticle',
		name: r.name,
		url: r.url,
		description: r.citation
	}));

	const comparisonCount = external.sources.length;
	const academicCount = external.credibility_references.length;

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Dataset',
		name: '9takes Enneagram Personality Type Distribution Corpus',
		description:
			`Type distribution, over- and under-representation by profession, and publishing pipeline ` +
			`across ${stats.totals.published} published public-figure profiles on 9takes, compared ` +
			`against ${comparisonCount} published Enneagram test-taker datasets and ` +
			`${academicCount} peer-reviewed credibility references.`,
		url: `${SITE_URL}/corpus-stats`,
		creator: {
			'@type': 'Organization',
			name: '9takes',
			url: SITE_URL
		},
		publisher: {
			'@type': 'Organization',
			name: '9takes',
			url: SITE_URL
		},
		dateModified: stats.generated_at ?? new Date().toISOString(),
		license: 'https://creativecommons.org/licenses/by/4.0/',
		isAccessibleForFree: true,
		inLanguage: 'en',
		keywords: [
			'Enneagram',
			'personality type distribution',
			'public figures',
			'celebrity Enneagram',
			'type prevalence',
			'data journalism',
			'Enneagram research',
			'comparison to published data'
		],
		variableMeasured: [
			'enneagram_type_share',
			'over_representation_by_domain',
			'publishing_pipeline_cadence',
			'delta_vs_public_test_taker_distributions'
		],
		distribution: [
			{
				'@type': 'DataDownload',
				encodingFormat: 'application/json',
				contentUrl: `${SITE_URL}/corpus-stats.json`
			}
		],
		citation: [...externalDataSources, ...academicCitations]
	};

	const breadcrumbJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: 'Home',
				item: SITE_URL
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: 'Corpus Stats',
				item: `${SITE_URL}/corpus-stats`
			}
		]
	};

	return {
		stats: corpusStats,
		jsonLd: { '@graph': [jsonLd, breadcrumbJsonLd] }
	};
};
