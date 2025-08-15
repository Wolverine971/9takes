import { z } from 'zod';

// Comment validation schemas
export const createCommentSchema = z.object({
	comment: z.string().min(1).max(5000, 'Comment must be less than 5000 characters'),
	parent_id: z.string(),
	parent_type: z.enum(['question', 'comment']),
	author_id: z.string().uuid().optional(),
	fingerprint: z.string().optional(),
	tag_1: z.string().transform(Number).pipe(z.number().int().min(1).max(9)).optional(),
	tag_2: z.string().transform(Number).pipe(z.number().int().min(1).max(9)).optional(),
	es_id: z.string().optional()
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
	comment_id: z.string().uuid(),
	description: z.string().min(10).max(500, 'Flag description must be between 10 and 500 characters')
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
