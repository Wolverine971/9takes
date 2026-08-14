// src/lib/server/questionEditorial.spec.ts
import { describe, expect, it } from 'vitest';

import {
	isQuestionEditoriallyApproved,
	isQuestionPubliclyEligible,
	questionEditorialMetadata
} from './questionEditorial';

describe('question editorial eligibility', () => {
	it('keeps organic questions eligible without requiring editorial metadata', () => {
		expect(isQuestionEditoriallyApproved(null)).toBe(true);
		expect(isQuestionPubliclyEligible({ data: null, flagged: false, removed: false })).toBe(true);
	});

	it('fails closed for generated chorus questions until a human approves them', () => {
		expect(isQuestionEditoriallyApproved({ source: 'chorus' })).toBe(false);
		expect(
			isQuestionPubliclyEligible({
				data: { source: 'chorus', editorial_status: 'needs_review' },
				flagged: false,
				removed: false
			})
		).toBe(false);
	});

	it('allows approved chorus questions unless moderation hides them', () => {
		const data = { source: 'chorus', editorial_status: 'approved' };
		expect(isQuestionPubliclyEligible({ data, flagged: false, removed: false })).toBe(true);
		expect(isQuestionPubliclyEligible({ data, flagged: true, removed: false })).toBe(false);
		expect(isQuestionPubliclyEligible({ data, flagged: false, removed: true })).toBe(false);
	});

	it('ignores non-object metadata safely', () => {
		expect(questionEditorialMetadata(['chorus'])).toBeNull();
		expect(questionEditorialMetadata('chorus')).toBeNull();
	});
});
