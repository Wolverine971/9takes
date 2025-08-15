import { z } from 'zod';

// User validation schemas
export const emailSchema = z.string().email('Invalid email address');

export const enneagramTypeSchema = z.number().int().min(1).max(9);

export const userSchema = z.object({
	email: emailSchema,
	enneagram_type: enneagramTypeSchema.optional(),
	username: z.string().min(3).max(50).optional()
});

// Comment validation schemas
export const commentSchema = z.object({
	comment_text: z.string().min(1).max(5000),
	comment_type: z.enum(['comment', 'question', 'answer']).default('comment'),
	parent_id: z.string().uuid().optional(),
	question_id: z.string().uuid(),
	tag_1: z.number().int().min(1).max(9).optional(),
	tag_2: z.number().int().min(1).max(9).optional(),
	is_anonymous: z.boolean().default(false)
});

// Question validation schemas
export const questionSchema = z.object({
	question: z.string().min(10).max(500),
	context: z.string().max(2000).optional(),
	img_url: z.string().url().optional(),
	author_id: z.string().uuid().optional(),
	is_anonymous: z.boolean().default(true),
	tags: z.array(z.string()).max(5).optional()
});

// Blog validation schemas
export const blogOperationSchema = z.object({
	operation: z.enum(['like', 'unlike', 'bookmark', 'unbookmark']),
	blogId: z.string()
});

// AI prompt validation schemas
export const aiPromptSchema = z.object({
	prompt: z.string().min(1).max(10000),
	model: z.enum(['gpt-3.5-turbo', 'gpt-4', 'claude-3']).optional(),
	temperature: z.number().min(0).max(2).optional(),
	max_tokens: z.number().int().min(1).max(4000).optional()
});

// Notification validation schemas
export const notificationSchema = z.object({
	type: z.enum(['comment', 'like', 'follow', 'mention', 'system']),
	message: z.string().max(500),
	related_id: z.string().uuid().optional(),
	user_id: z.string().uuid()
});

// Subscription validation schemas
export const subscriptionSchema = z.object({
	email: emailSchema,
	type: z.enum(['newsletter', 'updates', 'marketing']).default('newsletter'),
	source: z.string().optional()
});

// Search validation schemas
export const searchSchema = z.object({
	query: z.string().min(1).max(200),
	type: z.enum(['questions', 'blogs', 'users', 'all']).default('all'),
	limit: z.number().int().min(1).max(100).default(20),
	offset: z.number().int().min(0).default(0)
});

// Pagination validation schemas
export const paginationSchema = z.object({
	page: z.number().int().min(1).default(1),
	limit: z.number().int().min(1).max(100).default(20),
	sort: z.enum(['newest', 'oldest', 'popular']).default('newest')
});

// Password reset validation schemas
export const forgotPasswordSchema = z.object({
	email: emailSchema
});

export const resetPasswordSchema = z.object({
	password: z
		.string()
		.min(6, 'Password must be at least 6 characters')
		.max(100, 'Password is too long')
});

// Account update validation schemas
export const updateAccountSchema = z.object({
	email: emailSchema.optional(),
	username: z.string().min(3).max(50).optional(),
	enneagram_type: enneagramTypeSchema.optional(),
	bio: z.string().max(500).optional(),
	website: z.string().url().optional().or(z.literal('')),
	location: z.string().max(100).optional()
});

// Admin validation schemas
export const adminActionSchema = z.object({
	userId: z.string().uuid().optional(),
	action: z.enum(['makeAdmin', 'removeAdmin', 'ban', 'unban']).optional()
});

// Helper function to validate and parse data
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
	const result = schema.safeParse(data);
	if (!result.success) {
		throw new Error(`Validation error: ${result.error.message}`);
	}
	return result.data;
}

// Helper function for API endpoint validation
export async function validateRequest<T>(schema: z.ZodSchema<T>, request: Request): Promise<T> {
	try {
		const data = await request.json();
		return validateData(schema, data);
	} catch (error) {
		if (error instanceof SyntaxError) {
			throw new Error('Invalid JSON in request body');
		}
		throw error;
	}
}

// Helper function for form data validation
export async function validateFormData<T>(schema: z.ZodSchema<T>, request: Request): Promise<T> {
	const formData = await request.formData();
	const data = Object.fromEntries(formData);
	return validateData(schema, data);
}
