import { describe, expect, it } from 'vitest';

import {
	adminGenerateEmailSchema,
	adminReactivationEnrollmentSchema,
	adminScheduleEmailSchema,
	adminSendEmailSchema
} from './adminEmailSchemas';

const recipient = {
	id: '00000000-0000-0000-0000-000000000003',
	email: 'ada@example.com',
	name: 'Ada',
	source: 'profiles' as const,
	source_id: '00000000-0000-0000-0000-000000000003',
	enneagram: '5' as const
};

describe('admin email request schemas', () => {
	it('accepts bounded send and schedule payloads', () => {
		expect(
			adminSendEmailSchema.parse({
				recipients: [recipient],
				subject: '  A useful note  ',
				html_content: '<p>Hello</p>'
			})
		).toMatchObject({ subject: 'A useful note', recipients: [recipient] });

		expect(
			adminScheduleEmailSchema.safeParse({
				recipients: [recipient],
				subject: 'Scheduled note',
				html_content: '<p>Hello</p>',
				scheduled_for: '2026-08-01T12:00:00.000Z'
			}).success
		).toBe(true);
	});

	it('rejects malformed recipients and unbounded content', () => {
		expect(
			adminSendEmailSchema.safeParse({
				recipients: [{ ...recipient, email: 'not-an-email' }],
				subject: '',
				html_content: '<p>Hello</p>'
			}).success
		).toBe(false);

		expect(adminGenerateEmailSchema.safeParse({ instructions: 'x'.repeat(5001) }).success).toBe(
			false
		);
	});

	it('deduplicates and validates reactivation buckets', () => {
		expect(
			adminReactivationEnrollmentSchema.parse({
				dryRun: false,
				limit: 25,
				buckets: ['dormant', 'dormant', 'cold']
			})
		).toEqual({ dryRun: false, limit: 25, buckets: ['dormant', 'cold'] });

		expect(adminReactivationEnrollmentSchema.safeParse({ buckets: ['recent'] }).success).toBe(
			false
		);
	});
});
