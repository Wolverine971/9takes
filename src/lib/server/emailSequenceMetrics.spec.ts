import { describe, expect, it } from 'vitest';

import { buildSequenceStepMetrics } from './emailSequenceMetrics';

describe('buildSequenceStepMetrics', () => {
	it('uses immutable step identity even when multiple steps share a subject', () => {
		const metrics = buildSequenceStepMetrics(
			[
				{ step_number: 1, subject: 'A reused subject' },
				{ step_number: 2, subject: 'A reused subject' }
			],
			[
				{
					sequence_step_number: 1,
					status: 'sent',
					opened_at: '2026-07-09T12:00:00.000Z',
					clicked_at: null
				},
				{
					sequence_step_number: 2,
					status: 'delivered',
					opened_at: null,
					clicked_at: '2026-07-09T13:00:00.000Z'
				}
			]
		);

		expect(metrics).toEqual([
			{
				step_number: 1,
				subject: 'A reused subject',
				total_sent: 1,
				total_opened: 1,
				total_clicked: 0,
				open_rate: 100,
				click_rate: 0
			},
			{
				step_number: 2,
				subject: 'A reused subject',
				total_sent: 1,
				total_opened: 0,
				total_clicked: 1,
				open_rate: 0,
				click_rate: 100
			}
		]);
	});
});
