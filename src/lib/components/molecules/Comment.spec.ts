// src/lib/components/molecules/Comment.spec.ts
// @vitest-environment jsdom

import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Comment as CommentType, QuestionPageData, User } from '$lib/types/questions';

const {
	deserializeMock,
	captureCommentCreatedMock,
	captureCommentStartedMock,
	captureCommentFailedMock,
	normalizeServerCommentAnalyticsMock,
	getOrCreateVisitorIdMock,
	fetchMock
} = vi.hoisted(() => ({
	deserializeMock: vi.fn(),
	captureCommentCreatedMock: vi.fn(),
	captureCommentStartedMock: vi.fn(),
	captureCommentFailedMock: vi.fn(),
	normalizeServerCommentAnalyticsMock: vi.fn(),
	getOrCreateVisitorIdMock: vi.fn(),
	fetchMock: vi.fn()
}));

vi.mock('$app/forms', () => ({
	deserialize: deserializeMock
}));

vi.mock('$lib/analytics/commentEvents', () => ({
	captureCommentCreated: captureCommentCreatedMock,
	captureCommentStarted: captureCommentStartedMock,
	captureCommentFailed: captureCommentFailedMock,
	normalizeServerCommentAnalytics: normalizeServerCommentAnalyticsMock
}));

vi.mock('$lib/analytics/visitorIdentity', () => ({
	getOrCreateVisitorId: getOrCreateVisitorIdMock
}));

import Comment from './Comment.svelte';

const comment: CommentType = {
	id: 41,
	comment: 'The answer should be the clearest thing in this card.',
	author_id: null,
	parent_id: 9,
	parent_type: 'question',
	created_at: '2026-08-03T16:00:00.000Z',
	modified_at: null,
	comment_count: 0,
	comment_like: [{ id: 1, comment_id: 41, user_id: 'reader-1' }],
	profiles: null,
	comments: []
};

const parentData: QuestionPageData = {
	question: {
		id: 9,
		question: 'What keeps you grounded?',
		url: 'what-keeps-you-grounded',
		created_at: '2026-08-01T16:00:00.000Z',
		removed: false,
		flagged: false,
		comment_count: 1
	},
	comments: [comment],
	removedComments: [],
	comment_count: 1,
	removed_comment_count: 0,
	questionTags: [],
	user: null,
	flags: {
		userHasAnswered: true,
		userSignedIn: false
	},
	aiComments: null,
	links: null,
	links_count: 0,
	flagReasons: []
};

describe('Comment', () => {
	beforeEach(() => {
		vi.stubGlobal(
			'IntersectionObserver',
			class IntersectionObserverStub {
				readonly root = null;
				readonly rootMargin = '0px';
				readonly thresholds = [0];
				disconnect() {}
				observe() {}
				takeRecords(): IntersectionObserverEntry[] {
					return [];
				}
				unobserve() {}
			}
		);
		Element.prototype.animate = vi.fn((_, options) => {
			let finishHandler: Animation['onfinish'] = null;
			const animation = {
				cancel: vi.fn(),
				currentTime: typeof options === 'number' ? options : (options?.duration ?? 0),
				effect: null,
				playState: 'finished',
				get onfinish() {
					return finishHandler;
				},
				set onfinish(handler: Animation['onfinish']) {
					finishHandler = handler;
					queueMicrotask(() =>
						handler?.call(
							animation as unknown as Animation,
							new Event('finish') as AnimationPlaybackEvent
						)
					);
				}
			};

			return animation as unknown as Animation;
		});
		window.history.replaceState({}, '', '/questions/what-keeps-you-grounded');
		deserializeMock.mockReset();
		captureCommentCreatedMock.mockReset();
		captureCommentCreatedMock.mockResolvedValue(undefined);
		captureCommentStartedMock.mockReset();
		captureCommentStartedMock.mockResolvedValue(undefined);
		captureCommentFailedMock.mockReset();
		captureCommentFailedMock.mockResolvedValue(undefined);
		normalizeServerCommentAnalyticsMock.mockReset();
		normalizeServerCommentAnalyticsMock.mockReturnValue({
			isFirstCommentEver: false,
			isFirstCommentOnQuestion: false,
			isReply: true,
			questionAgeHours: 48,
			responsesBeforeComment: 1
		});
		getOrCreateVisitorIdMock.mockReset();
		getOrCreateVisitorIdMock.mockReturnValue('visitor-123');
		fetchMock.mockReset();
		fetchMock.mockResolvedValue({
			ok: true,
			text: vi.fn().mockResolvedValue('serialized-action-result')
		});
		vi.stubGlobal('fetch', fetchMock);
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.unstubAllGlobals();
	});

	// Only the clock is faked, so the take's age is fixed while timers still run.
	function freezeToday(isoDate: string) {
		vi.useFakeTimers({ toFake: ['Date'] });
		vi.setSystemTime(new Date(isoDate));
	}

	it('flips a like instantly, before the server answers, then keeps the confirmed row', async () => {
		let resolveFetch!: (value: unknown) => void;
		fetchMock.mockReturnValueOnce(new Promise((resolve) => (resolveFetch = resolve)));
		deserializeMock.mockReturnValueOnce({
			type: 'success',
			data: { id: 77, comment_id: 41, user_id: 'reader-2' }
		});
		const oncommentUpdated = vi.fn();
		const { getByRole } = render(Comment, {
			props: {
				user: { id: 'reader-2' } as User,
				comment,
				parentData,
				questionId: 9,
				oncommentUpdated
			}
		});

		await fireEvent.click(getByRole('button', { name: 'Like this comment (1 like)' }));

		// Optimistic: pressed with the new count while the request is in flight.
		const pressed = getByRole('button', { name: 'Unlike this comment (2 likes)' });
		expect(pressed.getAttribute('aria-pressed')).toBe('true');
		expect(fetchMock).toHaveBeenCalledWith('?/likeComment', expect.any(Object));

		resolveFetch({ ok: true, text: vi.fn().mockResolvedValue('serialized-like') });
		await waitFor(() => expect(oncommentUpdated).toHaveBeenCalledTimes(1));
		expect(oncommentUpdated.mock.calls[0][0].comment_like).toEqual([
			{ id: 77, comment_id: 41, user_id: 'reader-2' },
			{ id: 1, comment_id: 41, user_id: 'reader-1' }
		]);
		expect(getByRole('button', { name: 'Unlike this comment (2 likes)' })).toBeTruthy();
	});

	it('rolls a like back when the server rejects it', async () => {
		fetchMock.mockResolvedValueOnce({ ok: false, status: 500, text: vi.fn() });
		const oncommentUpdated = vi.fn();
		const { getByRole } = render(Comment, {
			props: {
				user: { id: 'reader-2' } as User,
				comment,
				parentData,
				questionId: 9,
				oncommentUpdated
			}
		});

		await fireEvent.click(getByRole('button', { name: 'Like this comment (1 like)' }));

		await waitFor(() =>
			expect(getByRole('button', { name: 'Like this comment (1 like)' })).toBeTruthy()
		);
		expect(
			getByRole('button', { name: 'Like this comment (1 like)' }).getAttribute('aria-pressed')
		).toBe('false');
		expect(oncommentUpdated).not.toHaveBeenCalled();
	});

	it('groups the complete answer-first comment and shows the post date beside the author', async () => {
		freezeToday('2026-08-20T16:00:00.000Z');
		const { container, getByRole } = render(Comment, {
			props: {
				user: null,
				comment,
				parentData,
				questionId: 9
			}
		});

		const card = container.querySelector('article.comment-card');
		const copy = card?.querySelector('[itemprop="text"]');
		const metadata = card?.querySelector('footer .comment-meta');
		const actions = card?.querySelector('[role="group"][aria-label="Comment actions"]');

		expect(card).toBeTruthy();
		expect(metadata?.textContent).toContain('Anonymous');
		const visibleDate = metadata?.querySelector('time[itemprop="dateCreated"]');
		expect(visibleDate?.textContent?.trim()).toBe('Aug 3');
		expect(visibleDate?.getAttribute('datetime')).toBe(comment.created_at);
		expect(visibleDate?.getAttribute('title')).toContain('Aug 3, 2026');
		expect(metadata?.textContent?.replace(/\s+/g, ' ').trim()).toBe('Anonymous · Aug 3');
		expect(copy?.textContent?.trim()).toBe(comment.comment);
		expect(copy?.classList.contains('comment-copy')).toBe(true);
		if (!metadata || !copy || !actions) throw new Error('Expected complete comment hierarchy');
		expect(copy.compareDocumentPosition(metadata) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
		expect(
			metadata.compareDocumentPosition(actions) & Node.DOCUMENT_POSITION_FOLLOWING
		).toBeTruthy();

		const like = getByRole('button', { name: 'Like this comment (1 like)' });
		const reply = getByRole('button', { name: 'Reply to this comment' });

		expect(like.textContent).toContain('Like');
		expect(like.textContent).toContain('1');
		expect(like.classList.contains('comment-action')).toBe(true);
		expect(reply.classList.contains('comment-action')).toBe(true);

		await fireEvent.click(reply);
		const replyField = getByRole('textbox', { name: 'Your reply' });
		expect(replyField.closest('article.comment-card')).toBe(card);

		const menuTrigger = getByRole('button', { name: 'Comment options' });
		await fireEvent.click(menuTrigger);
		const menu = document.getElementById(
			menuTrigger.getAttribute('aria-controls') ?? ''
		) as HTMLElement;
		const postedAt = menu.querySelector('time');

		expect(menu.textContent).toContain('Posted');
		expect(postedAt?.textContent?.trim()).toBe('Aug 3, 2026');
		expect(postedAt?.getAttribute('datetime')).toBe(comment.created_at);
	});

	it('shows a recent take as time passed', () => {
		freezeToday('2026-08-06T19:00:00.000Z');
		const { container } = render(Comment, {
			props: { user: null, comment, parentData, questionId: 9 }
		});

		expect(container.querySelector('footer .comment-meta time')?.textContent?.trim()).toBe(
			'3d ago'
		);
	});

	it('keeps Edited a plain label after the post date; the edit date stays in the menu', async () => {
		freezeToday('2026-08-20T16:00:00.000Z');
		const editedComment = {
			...comment,
			modified_at: '2026-08-04T16:00:00.000Z'
		};
		const { container, getByRole, getByText } = render(Comment, {
			props: {
				user: null,
				comment: editedComment,
				parentData,
				questionId: 9
			}
		});

		const card = container.querySelector('article.comment-card');
		const editedSignal = getByText('Edited');

		expect(editedSignal.getAttribute('title')).toBeNull();
		expect(
			card?.querySelector('footer .comment-meta')?.textContent?.replace(/\s+/g, ' ').trim()
		).toBe('Anonymous · Aug 3 · Edited');
		expect(card?.querySelectorAll('.comment-card__main time')).toHaveLength(1);
		expect(card?.textContent).not.toContain('Aug 4');

		const menuTrigger = getByRole('button', { name: 'Comment options' });
		await fireEvent.click(menuTrigger);
		const editedAt = document
			.getElementById(menuTrigger.getAttribute('aria-controls') ?? '')
			?.querySelector('time[itemprop="dateModified"]');

		expect(editedAt?.textContent?.trim()).toBe('Aug 4, 2026');
		expect(editedAt?.getAttribute('datetime')).toBe(editedComment.modified_at);
	});

	it('captures a server-confirmed reply with the canonical comment event', async () => {
		window.history.replaceState(
			{},
			'',
			'/questions/what-keeps-you-grounded?utm_campaign=welcome-sequence'
		);
		const createdReply: CommentType = {
			id: 88,
			comment: 'A reply from another perspective.',
			author_id: 'reader-1',
			parent_id: 41,
			parent_type: 'comment',
			created_at: '2026-08-03T17:00:00.000Z',
			modified_at: null,
			comment_count: 0,
			comment_like: [],
			profiles: null,
			comments: []
		};
		deserializeMock.mockReturnValue({ type: 'success', data: createdReply });

		const { getByRole } = render(Comment, {
			props: {
				user: { id: 'reader-1' },
				comment,
				parentData: {
					...parentData,
					user: { id: 'reader-1' },
					flags: { userHasAnswered: true, userSignedIn: true }
				},
				questionId: 9
			}
		});

		await fireEvent.click(getByRole('button', { name: 'Reply to this comment' }));
		await fireEvent.input(getByRole('textbox', { name: 'Your reply' }), {
			target: { value: createdReply.comment }
		});
		await fireEvent.click(getByRole('button', { name: 'Reply' }));

		await waitFor(() => {
			expect(captureCommentCreatedMock).toHaveBeenCalledTimes(1);
		});
		expect(captureCommentCreatedMock).toHaveBeenCalledWith({
			commentId: 88,
			questionId: 9,
			questionUrl: 'what-keeps-you-grounded',
			parentType: 'comment',
			commentKind: 'reply',
			surface: 'question_page',
			sourcePath: '/questions/what-keeps-you-grounded',
			campaign: 'welcome-sequence',
			isAnonymous: false,
			isFirstCommentEver: false,
			isFirstCommentOnQuestion: false,
			isReply: true,
			questionAgeHours: 48,
			responsesBeforeComment: 1
		});
		expect(normalizeServerCommentAnalyticsMock).toHaveBeenCalledWith(
			expect.objectContaining({ id: 88 })
		);
		expect(captureCommentStartedMock).toHaveBeenCalledTimes(1);
	});
});
