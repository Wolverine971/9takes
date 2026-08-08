// src/lib/components/molecules/Comment.spec.ts
// @vitest-environment jsdom

import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Comment as CommentType, QuestionPageData } from '$lib/types/questions';

const { deserializeMock, captureCommentCreatedMock, getOrCreateVisitorIdMock, fetchMock } =
	vi.hoisted(() => ({
		deserializeMock: vi.fn(),
		captureCommentCreatedMock: vi.fn(),
		getOrCreateVisitorIdMock: vi.fn(),
		fetchMock: vi.fn()
	}));

vi.mock('$app/forms', () => ({
	deserialize: deserializeMock
}));

vi.mock('$lib/analytics/commentEvents', () => ({
	captureCommentCreated: captureCommentCreatedMock
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
		vi.unstubAllGlobals();
	});

	it('groups the complete answer-first comment while keeping dates in the overflow menu', async () => {
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
		expect(metadata?.querySelector('time')).toBeNull();
		expect(card?.textContent).not.toContain('Aug 3, 2026');
		expect(copy?.textContent?.trim()).toBe(comment.comment);
		expect(copy?.classList.contains('text-lg')).toBe(true);
		if (!metadata || !copy || !actions) throw new Error('Expected complete comment hierarchy');
		expect(copy.compareDocumentPosition(metadata) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
		expect(
			metadata.compareDocumentPosition(actions) & Node.DOCUMENT_POSITION_FOLLOWING
		).toBeTruthy();

		const like = getByRole('button', { name: 'Like this comment (1 like)' });
		const reply = getByRole('button', { name: 'Reply to this comment' });

		expect(like.textContent).toContain('Like');
		expect(like.textContent).toContain('1');
		expect(like.classList.contains('min-h-11')).toBe(true);
		expect(reply.classList.contains('min-h-11')).toBe(true);

		await fireEvent.click(reply);
		const replyField = getByRole('textbox', { name: 'Your reply' });
		expect(replyField.closest('article.comment-card')).toBe(card);

		await fireEvent.click(getByRole('button', { name: 'Open menu' }));
		const menu = getByRole('menu');
		const postedAt = menu.querySelector('time[itemprop="dateCreated"]');

		expect(menu.textContent).toContain('Posted');
		expect(postedAt?.textContent?.trim()).toBe('Aug 3, 2026');
		expect(postedAt?.getAttribute('datetime')).toBe(comment.created_at);
	});

	it('uses Edited as the only visible age signal for a modified comment', async () => {
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
		expect(card?.querySelector('.comment-card__main time')).toBeNull();
		expect(card?.textContent).not.toContain('Aug 4, 2026');

		await fireEvent.click(getByRole('button', { name: 'Open menu' }));
		const editedAt = getByRole('menu').querySelector('time[itemprop="dateModified"]');

		expect(editedAt?.textContent?.trim()).toBe('Aug 4, 2026');
		expect(editedAt?.getAttribute('datetime')).toBe(editedComment.modified_at);
	});

	it('captures a server-confirmed reply with the canonical comment event', async () => {
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
			isAnonymous: false
		});
	});
});
