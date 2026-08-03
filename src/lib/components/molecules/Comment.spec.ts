// @vitest-environment jsdom

import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import type { Comment as CommentType, QuestionPageData } from '$lib/types/questions';
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
	it('keeps dates off the card face and available in the overflow menu', async () => {
		const { container, getByRole } = render(Comment, {
			props: {
				user: null,
				comment,
				parentData,
				questionId: 9
			}
		});

		const card = container.querySelector('article.comment-card');
		const header = card?.querySelector('header');
		const copy = card?.querySelector('[itemprop="text"]');
		const actions = card?.querySelector('[role="group"][aria-label="Comment actions"]');

		expect(card).toBeTruthy();
		expect(header?.textContent).toContain('Anonymous');
		expect(header?.querySelector('time')).toBeNull();
		expect(card?.textContent).not.toContain('Aug 3, 2026');
		expect(copy?.textContent?.trim()).toBe(comment.comment);
		expect(copy?.classList.contains('text-lg')).toBe(true);
		if (!header || !copy || !actions) throw new Error('Expected complete comment hierarchy');
		expect(header.compareDocumentPosition(copy) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
		expect(copy.compareDocumentPosition(actions) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

		const like = getByRole('button', { name: 'Like this comment (1 like)' });
		const reply = getByRole('button', { name: 'Reply to this comment' });

		expect(like.textContent).toContain('Like');
		expect(like.textContent).toContain('1');
		expect(like.classList.contains('min-h-11')).toBe(true);
		expect(reply.classList.contains('min-h-11')).toBe(true);

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
		expect(card?.querySelector('time')).toBeNull();
		expect(card?.textContent).not.toContain('Aug 4, 2026');

		await fireEvent.click(getByRole('button', { name: 'Open menu' }));
		const editedAt = getByRole('menu').querySelector('time[itemprop="dateModified"]');

		expect(editedAt?.textContent?.trim()).toBe('Aug 4, 2026');
		expect(editedAt?.getAttribute('datetime')).toBe(editedComment.modified_at);
	});
});
