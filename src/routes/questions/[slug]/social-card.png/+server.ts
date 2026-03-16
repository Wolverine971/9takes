// src/routes/questions/[slug]/social-card.png/+server.ts
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { RequestHandler } from './$types';
import { logger } from '$lib/utils/logger';
import { elasticClient } from '$lib/server/elasticSearch';
import { renderQuestionSocialCard } from '$lib/server/socialCards/renderQuestionSocialCard';
import { uploadQuestionImageBuffer } from '$lib/server/questionImages';
import {
	QUESTION_SOCIAL_CARD_VARIANT,
	isQuestionSocialCardV1,
	toQuestionPublicImageUrl
} from '$lib/socialCards/questionSocialCard';

const CACHE_CONTROL = 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400';
const FALLBACK_SOCIAL_IMAGE = 'https://9takes.com/questions-default.webp';
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const redirectWithCache = (url: string, status = 302) =>
	new Response(null, {
		status,
		headers: {
			location: url,
			'cache-control': CACHE_CONTROL
		}
	});

export const GET: RequestHandler = async ({ params, locals, request }) => {
	const slug = params.slug;
	const supabase = locals.supabase;

	try {
		const query = supabase
			.from('questions')
			.select('id, url, question, question_formatted, img_url, es_id');
		const isNumericSlug = /^\d+$/.test(slug);
		const { data: question, error: questionError } = await (isNumericSlug
			? query.eq('id', Number(slug)).single()
			: query.eq('url', slug).single());

		if (questionError || !question) {
			logger.warn('Question social card fallback: question not found', { slug });
			return redirectWithCache(FALLBACK_SOCIAL_IMAGE);
		}

		if (!PUBLIC_SUPABASE_URL) {
			logger.error('Question social card fallback: missing PUBLIC_SUPABASE_URL', undefined, {
				slug
			});
			return redirectWithCache(FALLBACK_SOCIAL_IMAGE);
		}

		if (question.img_url && isQuestionSocialCardV1(question.img_url)) {
			const existingUrl = toQuestionPublicImageUrl(PUBLIC_SUPABASE_URL, question.img_url);
			logger.info('Question social card redirect (already v1)', {
				slug,
				questionId: question.id,
				path: question.img_url
			});
			return redirectWithCache(existingUrl);
		}

		if (!question.url) {
			logger.warn('Question social card fallback: question has no url', {
				slug,
				questionId: question.id
			});
			return redirectWithCache(FALLBACK_SOCIAL_IMAGE);
		}

		logger.info('Question social card regeneration started', {
			slug,
			questionId: question.id,
			currentPath: question.img_url ?? null
		});

		const questionUrl = `https://9takes.com/questions/${question.url}`;
		const cardBuffer = await renderQuestionSocialCard({
			questionText: question.question_formatted || question.question || 'Share your perspective',
			questionUrl,
			backgroundUrl: new URL('/greek_pantheon.png', request.url).toString(),
			fontRegularUrl: new URL('/fonts/NoticiaText-Regular.ttf', request.url).toString(),
			fontBoldUrl: new URL('/fonts/NoticiaText-Bold.ttf', request.url).toString()
		});

		const upload = await uploadQuestionImageBuffer({
			supabase,
			buffer: cardBuffer,
			contentType: 'image/png',
			questionUrl: question.url,
			variant: QUESTION_SOCIAL_CARD_VARIANT,
			maxBytes: MAX_IMAGE_BYTES
		});

		logger.info('Question social card regeneration uploaded', {
			slug,
			questionId: question.id,
			path: upload.path
		});

		const { error: updateError } = await supabase
			.from('questions')
			.update({ img_url: upload.path })
			.eq('id', question.id);

		if (updateError) {
			logger.error('Question social card db update failed', updateError, {
				slug,
				questionId: question.id,
				path: upload.path
			});
		}

		if (question.es_id) {
			try {
				await elasticClient.update({
					index: 'question',
					id: question.es_id.toString(),
					doc: {
						imgUrl: upload.path,
						updatedDate: new Date()
					}
				});
			} catch (esError) {
				logger.error('Question social card ES update failed', esError as Error, {
					slug,
					questionId: question.id,
					esId: question.es_id
				});
			}
		}

		const generatedUrl = toQuestionPublicImageUrl(PUBLIC_SUPABASE_URL, upload.path);
		logger.info('Question social card regeneration complete', {
			slug,
			questionId: question.id,
			path: upload.path
		});
		return redirectWithCache(generatedUrl);
	} catch (err) {
		logger.error('Question social card regeneration failed', err as Error, { slug });
		return redirectWithCache(FALLBACK_SOCIAL_IMAGE);
	}
};
