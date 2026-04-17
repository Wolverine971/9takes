// src/routes/corpus-stats/+page.server.ts
// Serves the 9takes Corpus Stats page + schema.org Dataset JSON-LD.
import type { PageServerLoad } from './$types';
import corpusStats from '$lib/data/corpus-stats.json';

const SITE_URL = 'https://9takes.com';

export const load: PageServerLoad = async () => {
	const stats = corpusStats as {
		generated_at?: string;
		totals: { published: number };
	};

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Dataset',
		name: '9takes Enneagram Personality Type Distribution Corpus',
		description: `Type distribution, over- and under-representation by profession, and publishing pipeline across ${stats.totals.published} published public-figure profiles on 9takes.`,
		url: `${SITE_URL}/corpus-stats`,
		creator: {
			'@type': 'Organization',
			name: '9takes',
			url: SITE_URL
		},
		dateModified: stats.generated_at ?? new Date().toISOString(),
		keywords: [
			'Enneagram',
			'personality type distribution',
			'public figures',
			'celebrity Enneagram',
			'type prevalence',
			'data journalism'
		],
		variableMeasured: [
			'enneagram_type_share',
			'over_representation_by_domain',
			'publishing_pipeline_cadence'
		],
		distribution: [
			{
				'@type': 'DataDownload',
				encodingFormat: 'application/json',
				contentUrl: `${SITE_URL}/corpus-stats.json`
			}
		]
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
