// src/lib/validation/questionSchemas.ts
import { z } from 'zod';

// Comment validation schemas
export const createCommentSchema = z.object({
	comment: z
		.string()
		.min(1, 'Comment cannot be empty')
		.max(5000, 'Comment cannot exceed 5000 characters')
		.trim(),
	parent_id: z.string().regex(/^\d+$/, 'Invalid parent ID'),
	parent_type: z.enum(['question', 'comment']),
	author_id: z.string().optional(),
	fingerprint: z.string().max(100).optional(),
	es_id: z.string().optional(),
	question_id: z.string().regex(/^\d+$/, 'Invalid question ID')
});

export const likeCommentSchema = z.object({
	parent_id: z.string().uuid(),
	user_id: z.string().uuid(),
	operation: z.enum(['add', 'remove']),
	es_id: z.string().optional()
});

export const subscribeSchema = z.object({
	parent_id: z.string(),
	user_id: z.string().uuid(),
	es_id: z.string().optional(),
	operation: z.enum(['add', 'remove'])
});

export const saveLinkClickSchema = z.object({
	linkId: z.string().uuid()
});

export const flagCommentSchema = z.object({
	comment_id: z.string().regex(/^\d+$/, 'Invalid comment ID'),
	reason_id: z.string().regex(/^\d+$/, 'Invalid reason ID'),
	description: z.string().max(500, 'Flag description cannot exceed 500 characters').optional()
});

export const updateQuestionImgSchema = z.object({
	img_url: z.string().refine((val) => val.startsWith('data:image/'), {
		message: 'Invalid image format'
	}),
	url: z.string().min(1).max(200)
});

// Helper to parse and validate form data
export async function validateFormData<T>(schema: z.ZodSchema<T>, request: Request): Promise<T> {
	const formData = await request.formData();
	const body = Object.fromEntries(formData);
	return schema.parse(body);
}
