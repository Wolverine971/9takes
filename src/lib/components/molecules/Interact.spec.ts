// src/lib/components/molecules/Interact.spec.ts
import { beforeEach, describe, expect, it } from 'vitest';
import Interact from './Interact.svelte';

import { render, fireEvent } from '@testing-library/svelte';

describe('Interact', () => {
	it('Should be able to add comment', async () => {
		const { getByText, getByTestId } = render(Interact, {
			parentType: 'question',
			questionId: 85,
			qrCodeUrl: '',
			user: null,
			data: {
				question: {
					id: 85,
					question: 'what are you thinking about these days',
					created_at: '2023-09-22T05:23:03.858015+00:00',
					url: 'what-are-you-thinking-about-these-days',
					img_url: '',
					es_id: '48FXu4oBxTGqyww5ba_8',
					comment_count: 10,
					removed: false,
					flagged: false,
					subscriptions: []
				},
				comments: [],
				removedComments: [],
				comment_count: 11,
				removed_comment_count: 0,
				questionTags: [],
				user: null,
				flags: {
					userHasAnswered: false,
					userSignedIn: false
				},
				aiComments: null,
				links: null,
				links_count: 0,
				flagReasons: []
			}
		});

		const commentBox = getByTestId('comment-box');

		commentBox.innerText = 'test comment';

		const button = getByTestId('comment-button');

		// Using await when firing events is unique to the svelte testing library because
		// we have to wait for the next `tick` so that Svelte flushes all pending state changes.
		await fireEvent.click(button);
		// value = 'test comment';

		expect(() => getByText(/Loading.../i)).not.toThrow();
	});
});
