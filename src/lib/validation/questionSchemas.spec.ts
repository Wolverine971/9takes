// src/lib/validation/questionSchemas.spec.ts
import { describe, expect, it } from 'vitest';
import { createCommentSchema } from './questionSchemas';

const take = (comment: string, parent_type: 'question' | 'comment' = 'question') =>
	createCommentSchema.safeParse({ comment, parent_id: '573', parent_type, question_id: '573' });

describe('createCommentSchema', () => {
	it.each(['…', '....', '  ?!  ', '🙂'])(
		'rejects a question answer with no words: %j',
		(comment) => {
			const result = take(comment);
			expect(result.success).toBe(false);
			expect(result.error?.errors[0]?.message).toBe(
				'Write an answer in words to unlock the other takes.'
			);
		}
	);

	it.each(['ok', 'Spiders', 'Tímido', '3', 'Survived survived survived'])(
		'accepts a short real answer: %j',
		(comment) => {
			expect(take(comment).success).toBe(true);
		}
	);

	it('leaves replies to comments alone', () => {
		expect(take('🙂', 'comment').success).toBe(true);
	});
});
