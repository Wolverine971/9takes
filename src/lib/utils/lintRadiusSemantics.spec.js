import { describe, expect, it } from 'vitest';
import {
	cssValueMatchesRole,
	findSemanticCssViolations,
	findSemanticMarkupViolations
} from '../../../scripts/lint-radius-semantics.js';

describe('radius role semantics', () => {
	it('maps the locked values to their semantic roles', () => {
		expect(cssValueMatchesRole('0.25rem', 'badge')).toBe(true);
		expect(cssValueMatchesRole('var(--border-radius)', 'control')).toBe(true);
		expect(cssValueMatchesRole('1rem', 'card')).toBe(true);
		expect(cssValueMatchesRole('9999px', 'pill')).toBe(true);
		expect(cssValueMatchesRole('0.25rem', 'control')).toBe(false);
	});

	it('automatically enforces the control role on form selectors', () => {
		const violations = findSemanticCssViolations({
			text: "input[type='text'], select { border-radius: 0.25rem; }",
			rel: 'fixture.scss',
			ext: '.scss'
		});

		expect(violations).toMatchObject([
			{ rel: 'fixture.scss', line: 1, role: 'control', value: '0.25rem' }
		]);
	});

	it('uses an explicit role for visually ambiguous CSS selectors', () => {
		const violations = findSemanticCssViolations({
			text: `.identity-badge {
	/* lint-radius-role: card */
	border-radius: 0.625rem;
}`,
			rel: 'fixture.svelte',
			ext: '.scss'
		});

		expect(violations).toMatchObject([
			{ rel: 'fixture.svelte', line: 3, role: 'card', value: '0.625rem' }
		]);
	});

	it('checks Tailwind radius classes on form controls and annotated elements', () => {
		const violations = findSemanticMarkupViolations({
			text: `<input class="rounded-sm" type="email" />
<!-- lint-radius-role: pill -->
<span class="rounded-xl">New</span>`,
			rel: 'fixture.svelte'
		});

		expect(violations).toMatchObject([
			{ line: 1, role: 'control', value: 'rounded-sm' },
			{ line: 3, role: 'pill', value: 'rounded-xl' }
		]);
	});
});
