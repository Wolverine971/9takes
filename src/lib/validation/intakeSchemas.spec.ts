// src/lib/validation/intakeSchemas.spec.ts
import { describe, expect, it } from 'vitest';

import {
	INTAKE_CHOICE_MAX_LENGTH,
	INTAKE_LONG_TEXT_MAX_LENGTH,
	INTAKE_SHORT_TEXT_MAX_LENGTH,
	intakeSubmissionSchema,
	intakeTokenSchema
} from './intakeSchemas';

const REQUIRED = { current_challenges: 'Work stress', desired_outcome: 'Clarity' };

describe('intakeSubmissionSchema', () => {
	it('covers exactly the 26 form fields', () => {
		expect(Object.keys(intakeSubmissionSchema.shape)).toHaveLength(26);
	});

	it('accepts the two required answers alone and stores every blank as null', () => {
		const parsed = intakeSubmissionSchema.parse(REQUIRED);

		expect(parsed.current_challenges).toBe('Work stress');
		expect(parsed.desired_outcome).toBe('Clarity');
		const blanks = Object.entries(parsed).filter(([key]) => !(key in REQUIRED));
		expect(blanks).toHaveLength(24);
		expect(blanks.every(([, value]) => value === null)).toBe(true);
	});

	it('treats an unselected dropdown the same as a missing one', () => {
		const parsed = intakeSubmissionSchema.parse({
			...REQUIRED,
			urgency_level: '',
			suspected_type: '',
			age_range: ''
		});

		expect(parsed.urgency_level).toBeNull();
		expect(parsed.suspected_type).toBeNull();
		expect(parsed.age_range).toBeNull();
	});

	it('trims text and converts the suspected type to a number', () => {
		const parsed = intakeSubmissionSchema.parse({
			...REQUIRED,
			occupation: '  Teacher ',
			suspected_type: '4',
			urgency_level: 'high'
		});

		expect(parsed.occupation).toBe('Teacher');
		expect(parsed.suspected_type).toBe(4);
		expect(parsed.urgency_level).toBe('high');
	});

	it('drops fields the form is not meant to set', () => {
		const parsed = intakeSubmissionSchema.parse({
			...REQUIRED,
			status: 'reviewed',
			client_id: 'someone-else',
			reviewed_at: '2026-01-01'
		});

		expect(parsed).not.toHaveProperty('status');
		expect(parsed).not.toHaveProperty('client_id');
		expect(parsed).not.toHaveProperty('reviewed_at');
	});

	it.each([
		['a missing required answer', { desired_outcome: 'Clarity' }],
		['a blank required answer', { ...REQUIRED, current_challenges: '   ' }],
		['an unknown urgency level', { ...REQUIRED, urgency_level: 'extreme' }],
		['an out-of-range type', { ...REQUIRED, suspected_type: '12' }],
		['a non-numeric type', { ...REQUIRED, suspected_type: 'four' }],
		['an over-long choice', { ...REQUIRED, age_range: 'x'.repeat(INTAKE_CHOICE_MAX_LENGTH + 1) }],
		[
			'an over-long short answer',
			{ ...REQUIRED, occupation: 'x'.repeat(INTAKE_SHORT_TEXT_MAX_LENGTH + 1) }
		],
		[
			'an over-long long answer',
			{ ...REQUIRED, core_fear: 'x'.repeat(INTAKE_LONG_TEXT_MAX_LENGTH + 1) }
		],
		[
			'an over-long required answer',
			{ ...REQUIRED, desired_outcome: 'x'.repeat(INTAKE_LONG_TEXT_MAX_LENGTH + 1) }
		]
	])('rejects %s', (_label, input) => {
		expect(intakeSubmissionSchema.safeParse(input).success).toBe(false);
	});

	it('names the field in the message a client sees', () => {
		const result = intakeSubmissionSchema.safeParse({ desired_outcome: 'Clarity' });

		expect(result.success).toBe(false);
		expect(result.error?.issues[0]?.message).toBe('Current challenges is required');
	});
});

describe('intakeTokenSchema', () => {
	it('accepts a UUID', () => {
		expect(intakeTokenSchema.safeParse('0b9b6a52-2f0a-4b7e-9a51-3f6c1d2e4a77').success).toBe(true);
	});

	it.each(['', 'abc', '123', '0b9b6a52-2f0a-4b7e-9a51', "0b9b6a52-2f0a-4b7e-9a51-3f6c1d2e4a77'--"])(
		'rejects %s',
		(token) => {
			expect(intakeTokenSchema.safeParse(token).success).toBe(false);
		}
	);
});
