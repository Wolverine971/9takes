// src/lib/analytics/enneagramTestEvents.ts
//
// PostHog events for the Enneagram test (T-42). Funnel: test_started →
// test_result_shown → test_exit_clicked, the result page's own actions
// (test_result_emailed, test_take_started → test_take_posted,
// test_saved_to_profile), plus the friend loop:
// friend_link_shared → friend_link_opened → friend_read_submitted →
// friend_started_own_test.
//
// Privacy: no event carries the types someone picked or what a friend wrote.
// Picks live only in the anonymous enneagram_test_* tables.
import { capture } from '$lib/analytics/posthog';

export type TestStep = 'groundwork' | 'emotion' | 'strength' | 'ways' | 'types' | 'tiebreak';
export type TestExit = 'question' | 'type_page' | 'famous_people' | 'friend';
export type FriendShareMethod = 'share' | 'copy' | 'text' | 'email';

export function captureTestStarted(source: 'direct' | 'friend_link' = 'direct'): Promise<void> {
	return capture('test_started', { surface: 'enneagram_test', source });
}

export function captureTestStepCompleted(step: TestStep): Promise<void> {
	return capture('test_step_completed', { surface: 'enneagram_test', step });
}

export function captureTestBranch(
	branch: 'emotion_alt_used' | 'strength_mismatch_both' | 'strength_mismatch_repick' | 'none_fit'
): Promise<void> {
	return capture('test_branch_taken', { surface: 'enneagram_test', branch });
}

export function captureTestResultShown(input: {
	split: boolean;
	tiebreak: 'one' | 'both' | null;
	saved: boolean;
}): Promise<void> {
	return capture('test_result_shown', {
		surface: 'enneagram_test',
		split: input.split,
		tiebreak: input.tiebreak,
		saved: input.saved
	});
}

export function captureTestExitClicked(exit: TestExit, split: boolean): Promise<void> {
	return capture('test_exit_clicked', { surface: 'enneagram_test', exit, split });
}

export function captureFriendLinkShared(method: FriendShareMethod): Promise<void> {
	return capture('friend_link_shared', { surface: 'enneagram_test', method });
}

/** Where an email opt-in came from: the "Keep this result" box, or the capture after the chain's 2nd take. */
export type TestNotifyPlacement = 'keep' | 'chain';

export function captureTestNotifyOptIn(placement: TestNotifyPlacement = 'keep'): Promise<void> {
	return capture('test_notify_opt_in', { surface: 'enneagram_test', placement });
}

/** "Email me my result" on the result page. `sent` is false when the address saved but no email went out. */
export function captureTestResultEmailed(input: { split: boolean; sent: boolean }): Promise<void> {
	return capture('test_result_emailed', {
		surface: 'enneagram_test',
		split: input.split,
		sent: input.sent
	});
}

/**
 * The answer chain on the result page: first keystroke, then a posted take.
 * `step` is the chain position, 1 to 3.
 */
export function captureTestTakeStarted(input: { split: boolean; step: number }): Promise<void> {
	return capture('test_take_started', {
		surface: 'enneagram_test',
		split: input.split,
		step: input.step
	});
}

export function captureTestTakePosted(input: {
	split: boolean;
	alreadyAnswered: boolean;
	step: number;
}): Promise<void> {
	return capture('test_take_posted', {
		surface: 'enneagram_test',
		split: input.split,
		already_answered: input.alreadyAnswered,
		step: input.step
	});
}

/** "Next question" in the answer chain. `step` is the question it opens, 2 or 3. */
export function captureTestChainNext(input: { split: boolean; step: number }): Promise<void> {
	return capture('test_chain_next', {
		surface: 'enneagram_test',
		split: input.split,
		step: input.step
	});
}

export function captureTestSavedToProfile(): Promise<void> {
	return capture('test_saved_to_profile', { surface: 'enneagram_test' });
}

export function captureFriendLinkOpened(): Promise<void> {
	return capture('friend_link_opened', { surface: 'enneagram_test_read' });
}

export function captureFriendReadSubmitted(input: {
	match: 'same' | 'one_of_two' | 'different';
	withNote: boolean;
}): Promise<void> {
	return capture('friend_read_submitted', {
		surface: 'enneagram_test_read',
		match: input.match,
		with_note: input.withNote
	});
}

export function captureFriendStartedOwnTest(): Promise<void> {
	return capture('friend_started_own_test', { surface: 'enneagram_test_read' });
}
