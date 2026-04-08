// src/routes/questions/create/+page.server.ts
import { redirect } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { uploadQuestionImage } from '$lib/server/questionImages';
import { findAvailableQuestionUrl } from '$lib/server/questionSearch';
import { safelyExitWelcomeSequenceForQuestionCreation } from '$lib/server/welcomeSequenceGuards';
import { buildQuestionSlug, QUESTION_URL_MAX_LENGTH } from '$lib/utils/questionSlug';
import { logger } from '$lib/utils/logger';
import { z } from 'zod';
import { checkDemoTime } from '../../../utils/api';
import { mapDemoValues } from '../../../utils/demo';
import { tagQuestion } from '../../../utils/server/openai';
import type { Json } from '../../../../database.types';
import type { Actions, PageServerLoad } from './$types';

// Validation schemas
// Character limit constants - must match frontend MAX_CHAR_COUNT
const QUESTION_MIN_LENGTH = 10;
const QUESTION_MAX_LENGTH = 280;

const getUrlSchema = z.object({
	question: z.string().min(QUESTION_MIN_LENGTH).max(QUESTION_MAX_LENGTH).trim()
});

const createQuestionSchema = z.object({
	question: z.string().min(QUESTION_MIN_LENGTH).max(QUESTION_MAX_LENGTH).trim(),
	author_id: z.string().uuid(),
	context: z
		.string()
		.max(2000)
		.optional()
		.default('')
		.transform((value) => value.trim()),
	url: z.string().min(1).max(QUESTION_URL_MAX_LENGTH),
	img_url: z
		.string()
		.optional()
		.refine((val) => !val || val.startsWith('data:image/'), {
			message: 'Invalid image format'
		})
});

export const load: PageServerLoad = async (event) => {
	const session = event.locals.session;
	if (!session?.user?.id) throw redirect(303, '/login');

	return {
		session: session
	};
};

export const actions: Actions = {
	getUrl: async ({ request, locals }) => {
		try {
			const session = locals.session;
			const supabase = locals.supabase;

			if (!session?.user?.id) {
				logger.warn('Unauthorized URL generation attempt');
				throw error(401, 'Unauthorized');
			}

			const demo_time = await checkDemoTime(supabase);
			const formData = await request.formData();
			const body = Object.fromEntries(formData);

			// Validate input
			const validatedData = getUrlSchema.parse(body);
			const question = validatedData.question;
			const tempUrl = buildQuestionSlug(question);

			if (demo_time === true) {
				return tempUrl;
			}
			return await findAvailableQuestionUrl(supabase, tempUrl, 'questions');

			// const response = await client.search(typeaheadQuery('question', 'url', tempUrl, 200));

			// if (response.hits.hits.length) {
			// 	res.json({ url: `${tempUrl}-${response.hits.hits.length}` });
			// } else {
			// 	res.json({ url: tempUrl });
			// }
			// console.log(tempUrl);
		} catch (e) {
			if (e instanceof z.ZodError) {
				logger.warn('Invalid URL generation data', {
					errors: e.errors
				});
				throw error(400, 'Invalid question format');
			}
			logger.error('Error generating URL', e as Error);
			throw error(500, 'Failed to generate URL');
		}
	},
	createQuestion: async (event) => {
		const MAX_FORM_SIZE = 10 * 1024 * 1024; // 10MB limit
		let formData: FormData;

		try {
			const { request, locals } = event;
			const supabase = locals.supabase;

			// Add timeout for formData parsing
			const formDataPromise = request.formData();
			const timeoutPromise = new Promise<never>((_, reject) => {
				setTimeout(() => reject(new Error('FormData parsing timeout')), 30000); // 30 second timeout
			});

			try {
				formData = await Promise.race([formDataPromise, timeoutPromise]);
			} catch (e) {
				logger.error('FormData parsing error', e as Error);
				throw error(400, 'Failed to parse form data - request may be too large or malformed');
			}

			// Check content length
			const contentLength = request.headers.get('content-length');
			if (contentLength && parseInt(contentLength) > MAX_FORM_SIZE) {
				throw error(413, {
					message: 'Request entity too large'
				});
			}

			const demo_time = await checkDemoTime(supabase);
			const session = locals.session;

			if (!session?.user?.id) {
				throw error(401, {
					message: 'Unauthorized'
				});
			}

			// Convert FormData to object
			const body: Record<string, string> = {};
			for (const [key, value] of formData.entries()) {
				if (typeof value !== 'string') {
					throw error(400, {
						message: `Invalid value for field: ${key}`
					});
				}
				body[key] = value;
			}

			// Validate all fields with Zod
			const validatedData = createQuestionSchema.parse(body);
			const { question, author_id, context, url, img_url } = validatedData;

			// Check user permissions
			const { data: user, error: userError } = await supabase
				.from(demo_time ? 'profiles_demo' : 'profiles')
				.select('*')
				.eq('id', author_id)
				.single();

			if (userError || !user) {
				throw error(400, {
					message: 'User not registered'
				});
			}

			if (!user.admin && !user.canAskQuestion) {
				throw error(403, {
					message: 'User not authorized to ask question'
				});
			}

			// Insert question into database
			const qData = {
				question,
				author_id,
				context,
				data: context ? ({ userProvidedContext: true } as Json) : null,
				url,
				img_url: null
			};

			const { data: insertedQuestion, error: questionInsertError } = await supabase
				.from(demo_time ? 'questions_demo' : 'questions')
				.insert(qData)
				.select();

			if (questionInsertError) {
				throw error(500, {
					message: 'Failed to create question'
				});
			}

			if (insertedQuestion?.length) {
				const inserted = insertedQuestion[0];
				const questionId = inserted.id;
				const questionTable = demo_time ? 'questions_demo' : 'questions';

				const postProcess = async () => {
					let imagePath: string | null = null;

					if (!demo_time && img_url) {
						try {
							const upload = await uploadQuestionImage({
								supabase,
								dataUrl: img_url,
								questionUrl: url,
								maxBytes: MAX_FORM_SIZE
							});
							imagePath = upload.path;
							logger.info('Image uploaded to Supabase', {
								path: imagePath,
								userId: session.user.id
							});
						} catch (err) {
							logger.error('Supabase image upload error', err as Error, {
								userId: session.user.id,
								url
							});
						}
					}

					if (imagePath) {
						const updates: Record<string, string | null> = {};
						if (imagePath) updates.img_url = imagePath;

						await supabase.from(questionTable).update(updates).eq('id', questionId);
					}

					if (!demo_time) {
						await tagQuestion(supabase, question, questionId);
					}
				};

				const waitUntil =
					(event as any)?.platform?.context?.waitUntil ?? (event as any)?.platform?.waitUntil;
				if (typeof waitUntil === 'function') {
					waitUntil(postProcess());
				} else {
					void postProcess();
				}

				logger.info('Question created successfully', {
					questionId,
					url,
					userId: session.user.id
				});

				if (!demo_time) {
					await safelyExitWelcomeSequenceForQuestionCreation({
						userId: author_id,
						onError: (sequenceError) => {
							logger.error(
								'Failed to exit welcome sequence after question creation',
								sequenceError as Error,
								{
									questionId,
									userId: author_id
								}
							);
						}
					});
				}

				return mapDemoValues(insertedQuestion);
			}

			return { success: true };
		} catch (e) {
			if (e instanceof z.ZodError) {
				logger.warn('Invalid question data', {
					errors: e.errors
				});
				throw error(400, 'Invalid question data');
			}
			if ((e as any).status) {
				throw e; // Re-throw HTTP errors
			}
			logger.error('Create question error', e as Error);
			throw error(500, 'Failed to create question');
		}
	}
};
