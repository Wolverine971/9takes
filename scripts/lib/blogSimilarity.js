// scripts/lib/blogSimilarity.js
// Ignore normalized identities and dates when deciding whether shared phrasing
// contains an argument. Keep them in vectors for context, not as proof of reuse.
const MONTHS = new Set(
	'january february march april may june july august september october november december'.split(' ')
);
/** @param {string} token @param {Set<string>} stopWords */
export function isArgumentToken(token, stopWords) {
	return (
		token.length > 1 &&
		!stopWords.has(token) &&
		token !== 'subj' &&
		token !== 'enneagram' &&
		!/^type[1-9]$/.test(token) &&
		!/^\d+$/.test(token) &&
		!MONTHS.has(token)
	);
}
/** @param {string} feature @param {Set<string>} stopWords */
export function informativePhraseFeature(feature, stopWords) {
	if (!feature.startsWith('b:') && !feature.startsWith('t:')) return false;
	return (
		new Set(
			feature
				.slice(2)
				.split(' ')
				.filter((token) => isArgumentToken(token, stopWords))
		).size >= 2
	);
}
