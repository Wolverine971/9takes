import { beforeEach, describe, expect, it } from 'vitest';
import Interact from './Interact.svelte';

import { render, fireEvent } from '@testing-library/svelte';

describe('Interact', () => {
	it('Should be able to add comment', async () => {
		const { getByText, getByTestId } = render(Interact, {
			parentType: 'question',
			questionId: 85,
			user: undefined,
			data: {
				session: null,
				question: {
					id: 85,
					question: 'what are you thinking about these days',
					created_at: '2023-09-22T05:23:03.858015+00:00',
					updated_at: '2023-09-22T05:23:03.858015+00:00',
					data: null,
					name: null,
					author_id: 'f7d2f32a-86f2-4c17-a5bb-6d04c45ba4a3',
					context: '',
					url: 'what-are-you-thinking-about-these-days',
					img_url: '',
					es_id: '48FXu4oBxTGqyww5ba_8',
					comment_count: 10,
					tagged: false,
					subscriptions: []
				},
				comments: [],
				comment_count: 11,
				flags: {
					userHasAnswered: false
				}
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
