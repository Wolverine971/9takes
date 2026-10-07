// src/lib/components/questions/answerGist.ts
//
// One source of truth for the gated "gist so far" block (T-43): the class the
// block renders with and the paywall structured data that points at it, so
// the markup and the JSON-LD cssSelector can't drift apart.
//
// Google's paywall / content-gating pattern:
// https://developers.google.com/search/docs/appearance/structured-data/paywalled-content
// "Only use .class selectors for the cssSelector property." The summary TEXT
// never goes into JSON-LD: structured data ignores data-nosnippet, so text
// there could surface in search snippets and AI Overviews.

export const ANSWER_GIST_CLASS = 'answer-gist';
export const ANSWER_GIST_SELECTOR = `.${ANSWER_GIST_CLASS}`;

export type GatedContentFlags =
	| Record<string, never>
	| {
			isAccessibleForFree: false;
			hasPart: {
				'@type': 'WebPageElement';
				isAccessibleForFree: false;
				cssSelector: string;
			};
	  };

/**
 * Paywall flags for a question page's JSON-LD nodes. Empty when the question
 * has no gist, so pages without gated content keep their plain markup.
 */
export function buildGatedContentFlags(hasGist: boolean): GatedContentFlags {
	if (!hasGist) return {};
	return {
		isAccessibleForFree: false,
		hasPart: {
			'@type': 'WebPageElement',
			isAccessibleForFree: false,
			cssSelector: ANSWER_GIST_SELECTOR
		}
	};
}

/** "AI summary of 12 takes" style count line. */
export function describeGistSource(count: number): string {
	const safe = Math.max(0, Math.floor(count || 0));
	return `AI summary of ${safe} ${safe === 1 ? 'take' : 'takes'}. Paraphrased, never quoted.`;
}
