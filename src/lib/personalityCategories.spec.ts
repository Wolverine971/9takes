// src/lib/personalityCategories.spec.ts
import { describe, expect, it } from 'vitest';

import { PERSONALITY_CATEGORY_DEFINITIONS } from './personalityCategories';
import { TITLE_SNIPPET_BUDGET } from './utils/seoBudget';

// Ahrefs flags titles past ~60 chars and descriptions past ~160; we write
// descriptions to 120-155 so they read complete in the SERP without an ellipsis.
const DESCRIPTION_MIN = 120;
const DESCRIPTION_MAX = 155;

describe('PERSONALITY_CATEGORY_DEFINITIONS SEO budgets', () => {
	it.each(PERSONALITY_CATEGORY_DEFINITIONS.map((category) => [category.slug, category] as const))(
		'%s stays inside the title and description budgets',
		(_slug, category) => {
			expect(category.seoTitle.length).toBeLessThanOrEqual(TITLE_SNIPPET_BUDGET);
			expect(category.seoDescription.length).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
			expect(category.seoDescription.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
			expect(`${category.seoTitle} ${category.seoDescription}`).not.toMatch(/[—–…]/);
		}
	);
});
