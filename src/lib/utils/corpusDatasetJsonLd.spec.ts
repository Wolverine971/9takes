import { describe, expect, it } from 'vitest';
import {
	buildCorpusDatasetReference,
	CORPUS_DATASET_LICENSE,
	CORPUS_DATASET_URL
} from './corpusDatasetJsonLd';

describe('buildCorpusDatasetReference', () => {
	it('includes Google Dataset required and warning-level fields', () => {
		const dataset = buildCorpusDatasetReference('2026-06-11T12:00:00.000Z');

		expect(dataset).toMatchObject({
			'@type': 'Dataset',
			name: expect.any(String),
			description: expect.any(String),
			url: CORPUS_DATASET_URL,
			creator: {
				'@type': 'Organization',
				name: '9takes'
			},
			license: CORPUS_DATASET_LICENSE,
			isAccessibleForFree: true,
			dateModified: '2026-06-11T12:00:00.000Z'
		});
		expect(dataset.description.length).toBeGreaterThanOrEqual(50);
		expect(dataset.distribution).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					'@type': 'DataDownload',
					encodingFormat: 'application/json',
					contentUrl: 'https://9takes.com/corpus-stats.json'
				})
			])
		);
	});
});
