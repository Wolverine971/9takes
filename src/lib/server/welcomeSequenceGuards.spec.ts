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
	getWelcomeSequenceExitReasonForComment,
	safelyEnrollUserInWelcomeSequence,
	safelyProcessWelcomeSequenceEnrollmentNow,
	safelyExitWelcomeSequenceForCommentCreation,
	safelyExitWelcomeSequenceForQuestionCreation
} from './welcomeSequenceGuards';

describe('welcomeSequenceGuards', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('maps top-level question answers to answered_question', () => {
		expect(getWelcomeSequenceExitReasonForComment('question')).toBe('answered_question');
	});

	it('maps reply comments to created_comment', () => {
		expect(getWelcomeSequenceExitReasonForComment('comment')).toBe('created_comment');
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

	it('exits question answers with answered_question and swallows failures', async () => {
		const onError = vi.fn();
		exitWelcomeSequenceForUserMock.mockRejectedValue(new Error('rpc failed'));

		const result = await safelyExitWelcomeSequenceForCommentCreation({
			userId: 'user-1',
			parentType: 'question',
			onError
		});

		expect(result).toBeNull();
		expect(exitWelcomeSequenceForUserMock).toHaveBeenCalledWith('user-1', 'answered_question');
		expect(onError).toHaveBeenCalledWith(expect.any(Error), 'answered_question');
	});

	it('exits reply comments with created_comment', async () => {
		exitWelcomeSequenceForUserMock.mockResolvedValue(1);

		const result = await safelyExitWelcomeSequenceForCommentCreation({
			userId: 'user-1',
			parentType: 'comment'
		});

		expect(result).toBe('created_comment');
		expect(exitWelcomeSequenceForUserMock).toHaveBeenCalledWith('user-1', 'created_comment');
	});
});
