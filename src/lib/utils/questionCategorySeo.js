// src/lib/utils/questionCategorySeo.js
/**
 * Category pages without original intro copy are navigation utilities, not search landing pages.
 *
 * Keep this predicate shared between the public route and the sitemap generator so a URL cannot
 * be advertised in the sitemap while the rendered page tells crawlers not to index it.
 *
 * @param {unknown} introMarkdown
 * @returns {boolean}
 */
export function hasSubstantiveQuestionCategoryIntro(introMarkdown) {
	return typeof introMarkdown === 'string' && introMarkdown.trim().length > 0;
}
