export const SITE_URL = 'https://9takes.com';
export const CORPUS_DATASET_URL = `${SITE_URL}/corpus-stats`;
export const CORPUS_DATASET_ID = `${CORPUS_DATASET_URL}#dataset`;
export const CORPUS_DATASET_LICENSE = 'https://creativecommons.org/licenses/by/4.0/';
export const CORPUS_DATASET_NAME = '9takes Enneagram Personality Type Distribution Corpus';
export const CORPUS_DATASET_DESCRIPTION =
	'Machine-readable Enneagram type distribution data across the 9takes public-figure corpus, including corpus-wide type shares, domain slices, freshness metrics, and comparison data.';

export const NINE_TAKES_ORGANIZATION = {
	'@type': 'Organization',
	'@id': `${SITE_URL}/#organization`,
	name: '9takes',
	url: SITE_URL
} as const;

export const CORPUS_DATA_DOWNLOAD = {
	'@type': 'DataDownload',
	name: '9takes Corpus Stats raw JSON',
	encodingFormat: 'application/json',
	contentUrl: `${SITE_URL}/corpus-stats.json`
} as const;

export function buildCorpusDatasetReference(dateModified?: string) {
	return {
		'@type': 'Dataset',
		'@id': CORPUS_DATASET_ID,
		name: CORPUS_DATASET_NAME,
		description: CORPUS_DATASET_DESCRIPTION,
		url: CORPUS_DATASET_URL,
		creator: NINE_TAKES_ORGANIZATION,
		publisher: NINE_TAKES_ORGANIZATION,
		license: CORPUS_DATASET_LICENSE,
		isAccessibleForFree: true,
		...(dateModified ? { dateModified } : {}),
		distribution: [CORPUS_DATA_DOWNLOAD]
	};
}
