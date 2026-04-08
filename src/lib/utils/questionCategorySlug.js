// src/lib/utils/questionCategorySlug.js
/**
 * @param {string | null | undefined} value
 * @returns {string}
 */
function normalizeQuestionCategorySlugSegment(value) {
	return String(value ?? '')
		.toLowerCase()
		.replace(/&/g, ' and ')
		.replace(/['’]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/**
 * @param {string | null | undefined} value
 * @returns {string}
 */
export function buildQuestionCategorySlug(value) {
	return normalizeQuestionCategorySlugSegment(value);
}

/**
 * @param {string | null | undefined} value
 * @returns {string}
 */
export function buildQuestionCategoryPath(value) {
	const slug = buildQuestionCategorySlug(value);
	return slug ? `/questions/categories/${slug}` : '/questions/categories';
}

/**
 * @param {string | null | undefined} categoryName
 * @param {string | null | undefined} slug
 * @returns {boolean}
 */
export function matchesQuestionCategorySlug(categoryName, slug) {
	return buildQuestionCategorySlug(categoryName) === buildQuestionCategorySlug(slug);
}
