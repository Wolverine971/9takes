// src/lib/server/questionCategoryIntro.spec.ts
import { describe, expect, it } from 'vitest';

import {
	buildQuestionCategoryIntroDescription,
	renderQuestionCategoryIntroMarkdown
} from './questionCategoryIntro';

describe('questionCategoryIntro rendering', () => {
	it('renders a safe subset of markdown for public category intros', () => {
		const html = renderQuestionCategoryIntroMarkdown(
			'# Relationships\n\nThis **category** covers [connection](/questions) and <script>alert(1)</script>.\n\n- Trust\n- Boundaries'
		);

		expect(html).toContain('<p>Relationships</p>');
		expect(html).toContain('<strong>category</strong>');
		expect(html).toContain(
			'<a href="/questions" rel="nofollow noopener noreferrer">connection</a>'
		);
		expect(html).not.toContain('<script>');
		expect(html).toContain('<ul>');
		expect(html).toContain('<li>Trust</li>');
	});

	it('derives a plain text meta description when none is provided', () => {
		const description = buildQuestionCategoryIntroDescription(
			'This category explores friendship, intimacy, communication, and trust in close relationships.'
		);

		expect(description).toContain('friendship');
		expect(description.length).toBeLessThanOrEqual(160);
	});
});
