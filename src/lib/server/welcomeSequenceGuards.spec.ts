// src/lib/server/welcomeSequenceGuards.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
	enrollUserInWelcomeSequenceMock,
	exitWelcomeSequenceForUserMock,
	processSequenceEnrollmentNowMock
} = vi.hoisted(() => ({
	enrollUserInWelcomeSequenceMock: vi.fn(),
	exitWelcomeSequenceForUserMock: vi.fn(),
	processSequenceEnrollmentNowMock: vi.fn()
}));

vi.mock('./emailSequences', () => ({
	enrollUserInWelcomeSequence: enrollUserInWelcomeSequenceMock,
	exitWelcomeSequenceForUser: exitWelcomeSequenceForUserMock,
	processSequenceEnrollmentNow: processSequenceEnrollmentNowMock
}));

import {
	safelyEnrollUserInWelcomeSequence,
	safelyProcessWelcomeSequenceEnrollmentNow,
	safelyExitWelcomeSequenceForQuestionCreation
} from './welcomeSequenceGuards';

describe('welcomeSequenceGuards', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('enrolls users without throwing back into registration flow', async () => {
		enrollUserInWelcomeSequenceMock.mockResolvedValue('enrollment-1');

		const result = await safelyEnrollUserInWelcomeSequence({
			userId: 'user-1',
			email: 'user@example.com'
		});

		expect(result).toBe('enrollment-1');
		expect(enrollUserInWelcomeSequenceMock).toHaveBeenCalledWith('user-1', 'user@example.com');
	});

	it('swallows enrollment failures and reports them through the callback', async () => {
		const onError = vi.fn();
		enrollUserInWelcomeSequenceMock.mockRejectedValue(new Error('db down'));

		const result = await safelyEnrollUserInWelcomeSequence({
			userId: 'user-1',
			email: 'user@example.com',
			onError
		});

		expect(result).toBeNull();
		expect(onError).toHaveBeenCalledTimes(1);
	});

	it('processes an enrolled step immediately without throwing', async () => {
		processSequenceEnrollmentNowMock.mockResolvedValue({
			claimed: 1,
			sent: 1,
			skipped: 0,
			errors: 0
		});

		const result = await safelyProcessWelcomeSequenceEnrollmentNow({
			enrollmentId: 'enrollment-1'
		});

		expect(result).toBe(true);
		expect(processSequenceEnrollmentNowMock).toHaveBeenCalledWith('enrollment-1');
	});

	it('swallows immediate send failures and reports them through the callback', async () => {
		const onError = vi.fn();
		processSequenceEnrollmentNowMock.mockRejectedValue(new Error('gmail down'));

		const result = await safelyProcessWelcomeSequenceEnrollmentNow({
			enrollmentId: 'enrollment-1',
			onError
		});

		expect(result).toBe(false);
		expect(onError).toHaveBeenCalledTimes(1);
	});

	it('exits question creators with created_question', async () => {
		exitWelcomeSequenceForUserMock.mockResolvedValue(1);

		const result = await safelyExitWelcomeSequenceForQuestionCreation({
			userId: 'user-1'
		});

		expect(result).toBe(true);
		expect(exitWelcomeSequenceForUserMock).toHaveBeenCalledWith('user-1', 'created_question');
	});
});
