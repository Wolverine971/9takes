// src/routes/admin/question-distribution/question-distribution.page.spec.ts
// @vitest-environment jsdom

import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

import QuestionDistributionPage from './+page.svelte';

describe('/admin/question-distribution page', () => {
	it('shows the manual-only pilot, active exposure progress, and operator controls', () => {
		render(QuestionDistributionPage, {
			data: {
				current: {
					run_id: 44,
					question_id: 812,
					question_text: 'What would make today feel less automatic?',
					question_url: 'what-would-make-today-feel-less-automatic',
					started_at: '2026-08-12T12:00:00Z',
					ends_at: '2026-08-19T12:00:00Z',
					target_unique_impressions: 30,
					qualified_unique_impressions: 8,
					selection_mode: 'manual',
					is_fallback: false
				},
				settings: {
					fallback_question_id: 567,
					default_target_unique_impressions: 30,
					default_max_duration_days: 7
				},
				candidates: [
					{
						id: 812,
						question: 'What would make today feel less automatic?',
						question_formatted: null,
						url: 'what-would-make-today-feel-less-automatic',
						comment_count: 0,
						created_at: '2026-08-12T11:00:00Z',
						flagged: false,
						removed: false
					}
				],
				runs: [
					{
						id: 44,
						question_id: 812,
						started_at: '2026-08-12T12:00:00Z',
						ends_at: '2026-08-19T12:00:00Z',
						reason_selected: 'Needs a fair first-response test',
						selection_mode: 'manual',
						target_unique_impressions: 30,
						qualified_unique_impressions: 8,
						status: 'active',
						ended_reason: null,
						questions: {
							question: 'What would make today feel less automatic?',
							question_formatted: null,
							url: 'what-would-make-today-feel-less-automatic'
						}
					}
				]
			} as any,
			form: null,
			params: {}
		});

		expect(screen.getByText('Manual only')).toBeTruthy();
		expect(screen.getByText('8 / 30 qualified unique impressions')).toBeTruthy();
		expect(screen.getByRole('button', { name: 'Pause' })).toBeTruthy();
		expect(screen.getByRole('button', { name: 'Extend' })).toBeTruthy();
		expect(screen.getByRole('button', { name: 'Stop' })).toBeTruthy();
		expect(screen.getByRole('button', { name: 'Replace active run' })).toBeTruthy();
	});
});
