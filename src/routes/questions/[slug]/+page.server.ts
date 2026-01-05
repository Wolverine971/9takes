// src/routes/questions/[slug]/+page.server.ts
import { supabase } from '$lib/supabase';

import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { addESComment, addESCommentLike, addESSubscription } from '$lib/server/elasticSearch';
import { decode } from 'base64-arraybuffer';
import { checkDemoTime } from '../../../utils/api';
import { mapDemoValues } from '../../../utils/demo';
import { extractFirstURL } from '../../../utils/StringUtils';
import { createCommentSchema, flagCommentSchema } from '$lib/validation/questionSchemas';

import axios from 'axios';
import { load as cheerioLoad } from 'cheerio';

// =============================================================================
// Constants
// =============================================================================
// Rate limit configuration: 5 comments per minute
const RATE_LIMIT_MAX_COMMENTS = 5;
const RATE_LIMIT_WINDOW_SECONDS = 60;

// Pagination defaults
const DEFAULT_COMMENTS_LIMIT = 10;
const DEFAULT_LINKS_LIMIT = 10;

// Request timeout for external fetches (ms)
const EXTERNAL_FETCH_TIMEOUT = 5000;
const MAX_CONTENT_LENGTH = 1024 * 1024; // 1MB
const MAX_REDIRECTS = 3;

export const load: PageServerLoad = async (event) => {
	const { demo_time } = await event.parent();
	const session = event.locals.session;
	const cookie = event.cookies.get('9tfingerprint');

	const question = await getQuestion(event.params.slug, demo_time);
	if (!question) {
		throw error(400, { message: 'No question found' });
	}

	const [userHasAnswered, questionTags] = await Promise.all([
		checkUserAnswered(cookie, question.id, session?.user?.id),
		getQuestionTags(question.id)
	]);

	if (!userHasAnswered) {
		const commentCount = await getCommentCount(question.id, demo_time);
		const aiComments = demo_time ? null : await getAIComments(question.id);
		return createBaseResponse(
			question,
			[],
			commentCount,
			0,
			questionTags,
			session,
			userHasAnswered,
			event,
			aiComments
		);
	}

	const [comments, removedComments, links, aiComments, flagReasons] = await Promise.all([
		getComments(question.id, demo_time, false),
		getComments(question.id, demo_time, true),
		getQuestionLinks(question.id),
		demo_time ? null : getAIComments(question.id),
		getFlagReasons()
	]);

	return createFullResponse(
		question,
		comments.data,
		comments.count,
		removedComments.data,
		removedComments.count,
		links.data,
		links.count,
		questionTags,
		session,
		userHasAnswered,
		event,
		aiComments,
		demo_time,
		flagReasons?.data || []
	);
};

export const actions: Actions = {
	createComment: async ({ request, getClientAddress }) => {
		const { body, demo_time } = await getRequestData(request);
		const ip = getClientAddress();

		// Validate input
		const validationResult = createCommentSchema.safeParse(body);
		if (!validationResult.success) {
			const firstError = validationResult.error.errors[0]?.message || 'Invalid comment data';
			throw error(400, { message: firstError });
		}

		// Check rate limit (skip in demo mode)
		if (!demo_time) {
			const isAllowed = await checkRateLimit(body.fingerprint as string, ip);
			if (!isAllowed) {
				throw error(429, {
					message: 'Too many comments. Please wait a minute before trying again.'
				});
			}
		}

		const commentData = await createCommentData(body, ip, demo_time);
		return handleCommentCreation(commentData, body.parent_type as string, demo_time);
	},

	createCommentRando: async ({ request, getClientAddress }) => {
		const { body, demo_time } = await getRequestData(request);
		const ip = getClientAddress();

		// Validate input
		const validationResult = createCommentSchema.safeParse(body);
		if (!validationResult.success) {
			const firstError = validationResult.error.errors[0]?.message || 'Invalid comment data';
			throw error(400, { message: firstError });
		}

		// Check rate limit (skip in demo mode)
		if (!demo_time) {
			const isAllowed = await checkRateLimit(body.fingerprint as string, ip);
			if (!isAllowed) {
				throw error(429, {
					message: 'Too many comments. Please wait a minute before trying again.'
				});
			}
		}

		const commentData = await createCommentData(body, ip, demo_time);
		const record = await handleCommentCreation(commentData, body.parent_type as string, demo_time);
		return mapDemoValues(record);
	},

	likeComment: async ({ request, locals }) => {
		const session = locals.session;
		if (!session?.user?.id) {
			throw error(401, 'Unauthorized');
		}

		const { body, demo_time } = await getRequestData(request);
		const { parent_id, user_id, operation, es_id } = body;

		await addESCommentLike({ commentId: es_id as string, operation: operation as string });

		if (operation === 'add') {
			return await addLike(parent_id as string, user_id as string);
		} else {
			return await removeLike(parent_id as string, user_id as string, demo_time);
		}
	},

	subscribe: async ({ request, locals }) => {
		const session = locals.session;
		if (!session?.user?.id) {
			throw error(401, 'Unauthorized');
		}

		const { body, demo_time } = await getRequestData(request);
		const { parent_id, user_id, es_id, operation } = body;

		await addESSubscription({ questionId: es_id as string, operation: operation as string });

		if (operation === 'add') {
			return await addSubscription(parent_id as string, user_id as string, demo_time);
		} else {
			return await removeSubscription(parent_id as string, user_id as string, demo_time);
		}
	},

	saveLinkClick: async ({ request }) => {
		const { linkId } = Object.fromEntries(await request.formData());
		await incrementLinkClicks(linkId as string);
		return true;
	},

	flagComment: async ({ request, locals }) => {
		const session = locals.session;
		if (!session?.user?.id) {
			throw error(401, 'Unauthorized');
		}

		const body = Object.fromEntries(await request.formData());

		// Validate input
		const validationResult = flagCommentSchema.safeParse(body);
		if (!validationResult.success) {
			const firstError = validationResult.error.errors[0]?.message || 'Invalid flag data';
			throw error(400, { message: firstError });
		}

		const { comment_id, reason_id, description } = validationResult.data;
		await flagComment(session.user.id, comment_id, reason_id, description || '');

		return { success: true };
	},

	updateQuestionImg: async ({ request }) => {
		const { img_url, url } = Object.fromEntries(await request.formData());
		const imgPath = await uploadImage(img_url as string, url as string);
		await updateQuestionImageUrl(url as string, imgPath);
		return true;
	}
};

interface RequestData {
	body: Record<string, FormDataEntryValue>;
	demo_time: boolean;
}

async function getRequestData(request: Request): Promise<RequestData> {
	const body = Object.fromEntries(await request.formData());
	const demo_time = await checkDemoTime();
	return { body, demo_time };
}

/**
 * Check if the user has exceeded the rate limit for comments
 * Returns true if allowed to comment, false if rate limited
 */
async function checkRateLimit(fingerprint: string | undefined, ip: string): Promise<boolean> {
	try {
		const { data, error: rpcError } = await supabase.rpc('check_comment_rate_limit', {
			p_fingerprint: fingerprint || null,
			p_ip: ip,
			p_max_comments: RATE_LIMIT_MAX_COMMENTS,
			p_window_seconds: RATE_LIMIT_WINDOW_SECONDS
		});

		if (rpcError) {
			// Log error but allow the comment (fail open for availability)
			console.error('Rate limit check failed:', rpcError);
			return true;
		}

		return data === true;
	} catch (err) {
		// Fail open - if rate limiting is broken, still allow comments
		console.error('Rate limit check error:', err);
		return true;
	}
}

interface CommentData {
	comment: string;
	parent_id: number;
	author_id: string | null;
	comment_count: number;
	ip: string;
	parent_type: string;
	es_id: string | null;
	fingerprint: string | null;
}

async function createCommentData(
	body: Record<string, FormDataEntryValue>,
	ip: string,
	demo_time: boolean
): Promise<CommentData> {
	const question_id = body.question_id as string;
	const comment = body.comment as string;
	const parent_id = body.parent_id as string;
	const author_id = body.author_id as string;
	const parent_type = body.parent_type as string;
	const es_id = body.es_id as string;
	const fingerprint = body.fingerprint as string;

	await parseUrls(comment, question_id);

	let esId: string | null = null;
	if (!demo_time) {
		esId = await createESComment(parent_type, es_id, author_id, comment, ip);
	}

	return {
		comment,
		parent_id: parseInt(parent_id),
		author_id: author_id !== 'undefined' ? author_id.toString() : null,
		comment_count: 0,
		ip,
		parent_type,
		es_id: esId,
		fingerprint: fingerprint || null
	};
}

async function createESComment(
	parent_type: string,
	es_id: string,
	author_id: string,
	comment: string,
	ip: string
): Promise<string | null> {
	try {
		const resp = await addESComment({
			index: parent_type,
			parentId: es_id,
			enneaType: '',
			authorId: author_id.toString(),
			comment,
			ip
		});
		return (resp as { _id: string })._id;
	} catch (error) {
		console.error('Error creating ES comment:', error);
		return null;
	}
}

async function handleCommentCreation(
	commentData: CommentData,
	parent_type: string,
	demo_time: boolean
): Promise<unknown> {
	// For demo mode, use regular insert (demo tables don't have the atomic RPC)
	if (demo_time) {
		const { data: record, error: addCommentError } = await supabase
			.from('comments_demo')
			.insert(commentData)
			.select()
			.single();

		if (addCommentError) {
			console.error(addCommentError);
			throw error(500, { message: 'Failed to add comment' });
		}

		return record;
	}

	// For production, use atomic RPC that handles insert + count increment in one transaction
	const { data: record, error: rpcError } = await supabase.rpc('create_comment_atomic', {
		p_comment: commentData.comment,
		p_parent_id: commentData.parent_id,
		p_author_id: commentData.author_id || null,
		p_parent_type: parent_type,
		p_fingerprint: commentData.fingerprint || null,
		p_ip: commentData.ip,
		p_es_id: commentData.es_id || null
	});

	if (rpcError) {
		console.error('Atomic comment creation failed:', rpcError);
		throw error(500, { message: 'Failed to add comment' });
	}

	return record;
}

async function addLike(parent_id: string, user_id: string) {
	const { data: record, error: addLikeError } = await supabase
		.from('comment_like')
		.insert({ comment_id: parseInt(parent_id), user_id })
		.select()
		.single();

	if (addLikeError) {
		console.error(addLikeError);
		throw error(500, { message: 'Failed to add like' });
	}

	await supabase.rpc('increment_like_count', { comment_id: parent_id });
	return record;
}

async function removeLike(parent_id: string, user_id: string, demo_time: boolean) {
	const { error: removeLikeError } = await supabase
		.from(demo_time ? 'comment_like_demo' : 'comment_like')
		.delete()
		.eq('user_id', user_id)
		.eq('comment_id', parent_id);

	if (removeLikeError) {
		console.error(removeLikeError);
		throw error(500, { message: 'Failed to remove like' });
	}

	await supabase.rpc('decrement_like_count', { comment_id: parent_id });
	return null;
}

async function addSubscription(parent_id: string, user_id: string, demo_time: boolean) {
	const { data: subscriptionRecord, error: addSubscriptionError } = await supabase
		.from(demo_time ? 'subscriptions_demo' : 'subscriptions')
		.insert({ question_id: parseInt(parent_id), user_id })
		.select()
		.single();

	if (addSubscriptionError) {
		console.error(addSubscriptionError);
		throw error(500, { message: 'Failed to add subscription' });
	}

	return subscriptionRecord;
}

async function removeSubscription(parent_id: string, user_id: string, demo_time: boolean) {
	const { error: removeSubscriptionError } = await supabase
		.from(demo_time ? 'subscriptions_demo' : 'subscriptions')
		.delete()
		.eq('user_id', user_id)
		.eq('question_id', parent_id);

	if (removeSubscriptionError) {
		console.error(removeSubscriptionError);
		throw error(500, { message: 'Failed to remove subscription' });
	}

	return null;
}

async function incrementLinkClicks(linkId: string) {
	const { error: incrementError } = await supabase.rpc('increment_clicks', {
		link_id: parseInt(linkId)
	});

	if (incrementError) {
		console.error('Failed to increment link clicks:', incrementError);
		// Don't throw - link click tracking is non-critical
	}
}

async function flagComment(
	userId: string,
	commentId: string,
	reasonId: string,
	description: string
) {
	const { error: flagCommentError } = await supabase.from('flagged_comments').insert({
		flagged_by: userId,
		comment_id: parseInt(commentId),
		reason_id: parseInt(reasonId),
		description: description || null
	});

	if (flagCommentError) {
		console.error(flagCommentError);
		throw error(500, { message: 'Failed to flag comment' });
	}
}

async function uploadImage(imgUrl: string, url: string) {
	const base64 = imgUrl.split('base64,')[1];
	const buffer = decode(base64);
	const imgPath = `public/${url}.png`;

	const { data: imgUploadData, error: uploadError } = await supabase.storage
		.from('questions')
		.upload(imgPath, buffer, { upsert: true, contentType: 'image/png' });

	if (uploadError) {
		throw error(400, 'Question image upload failed');
	}

	return imgPath;
}

async function updateQuestionImageUrl(url: string, imgPath: string) {
	const { error: updateError } = await supabase
		.from('questions')
		.update({ img_url: imgPath })
		.eq('url', url);

	if (updateError) {
		console.error('Error updating question image URL:', updateError);
	}
}

interface OGData {
	title?: string;
	description?: string;
	image?: string;
	url?: string;
}

async function fetchOGData(url: string): Promise<OGData> {
	try {
		// Validate URL to prevent SSRF attacks
		const parsedUrl = new URL(url);

		// Block internal IPs and localhost
		const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1', '169.254.169.254'];
		const hostname = parsedUrl.hostname.toLowerCase();

		if (blockedHosts.includes(hostname)) {
			console.warn('Blocked request to internal host:', hostname);
			return {};
		}

		// Block private IP ranges (basic check)
		if (
			hostname.startsWith('10.') ||
			hostname.startsWith('192.168.') ||
			hostname.startsWith('172.')
		) {
			console.warn('Blocked request to private IP range:', hostname);
			return {};
		}

		// Only allow HTTP/HTTPS
		if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
			console.warn('Blocked non-HTTP(S) protocol:', parsedUrl.protocol);
			return {};
		}

		const response = await axios.get(url, {
			timeout: EXTERNAL_FETCH_TIMEOUT,
			maxContentLength: MAX_CONTENT_LENGTH,
			maxRedirects: MAX_REDIRECTS,
			headers: {
				'User-Agent': '9takes-bot/1.0'
			}
		});
		const $ = cheerioLoad(response.data);

		const ogData: OGData = {};
		$('meta[property^="og:"]').each((_, element) => {
			const property = $(element).attr('property')?.slice(3);
			const content = $(element).attr('content');
			if (property && content) {
				ogData[property as keyof OGData] = content;
			}
		});

		return ogData;
	} catch (error) {
		console.error(`Error fetching OG data: ${error.message}`);
		return {};
	}
}

async function parseUrls(comment: string, questionId: string): Promise<void> {
	const { url, domain } = extractFirstURL(comment);
	if (!domain) return;

	try {
		const ogData = await fetchOGData(url);
		const domainId = await upsertDomain(domain);
		await upsertLink(url, domainId, questionId, ogData);
	} catch (error) {
		console.error('Error parsing URLs:', error);
		// Consider how you want to handle errors here
	}
}

async function upsertDomain(domain: string): Promise<number> {
	const { data, error } = await supabase
		.from('link_domains')
		.upsert({ domain, updated_at: new Date() })
		.select('id')
		.single();

	if (error) throw new Error(`Failed to upsert domain: ${error.message}`);
	if (!data) throw new Error('No data returned from domain upsert');

	return data.id;
}

async function upsertLink(
	url: string,
	domainId: number,
	questionId: string,
	ogData: OGData
): Promise<void> {
	const { error } = await supabase.from('links').upsert({
		url,
		domain_id: domainId,
		updated_at: new Date(),
		question_id: questionId,
		meta_title: ogData.title,
		meta_description: ogData.description,
		meta_image: ogData.image
	});

	if (error) throw new Error(`Failed to upsert link: ${error.message}`);
}

async function getQuestion(slug: string, demo_time: boolean) {
	const table = demo_time ? 'questions_demo' : 'questions';
	const subscriptions = demo_time ? 'subscriptions_demo' : 'subscriptions';
	const query = supabase
		.from(table)
		.select(`*, ${subscriptions} (id, question_id, user_id)`)
		.single();

	const { data, error: findQuestionError } = await (Number.isInteger(parseInt(slug))
		? query.eq('id', slug)
		: query.eq('url', slug));

	if (!data || findQuestionError) {
		return null;
	}
	return data;
}

async function checkUserAnswered(
	cookie: string | undefined,
	questionId: number,
	userId: string | undefined
) {
	const { data } = await supabase.rpc('can_see_comments_3', {
		userfingerprint: cookie,
		questionid: questionId,
		userid: userId || null
	});
	return data;
}

async function getQuestionTags(questionId: number) {
	const { data, error } = await supabase
		.from('question_category_tags')
		.select(`*, question_categories(*)`, { count: 'exact' })
		.eq('question_id', questionId);

	if (error) {
		console.log('No question tags for question', error);
	}
	return data;
}

async function getCommentCount(questionId: number, demo_time: boolean) {
	const { count } = await supabase
		.from(demo_time ? 'comments_demo' : 'comments')
		.select('*', { count: 'exact' })
		.eq('parent_type', 'question')
		.eq('parent_id', questionId)
		.eq('removed', false);
	return count;
}

async function getComments(questionId: number, demo_time: boolean, removed: boolean) {
	const table = demo_time ? 'comments_demo' : 'comments';
	const profiles = demo_time ? 'profiles_demo' : 'profiles';
	const commentLike = demo_time ? 'comment_like_demo' : 'comment_like';

	const { data, count, error } = await supabase
		.from(table)
		.select(`*, ${profiles} (external_id, enneagram), ${commentLike} (id, comment_id, user_id)`, {
			count: 'exact'
		})
		.eq('parent_id', questionId)
		.eq('parent_type', 'question')
		.eq('removed', removed)
		.limit(DEFAULT_COMMENTS_LIMIT)
		.order('created_at', { ascending: false });

	if (error) {
		console.log(`No ${removed ? 'removed ' : ''}comments for question`, error);
	}
	return { data, count };
}

async function getQuestionLinks(questionId: number) {
	const { data, count, error } = await supabase
		.from('links')
		.select(`*`, { count: 'exact' })
		.eq('question_id', questionId)
		.limit(DEFAULT_LINKS_LIMIT);

	if (error) {
		console.log('No links for question', error);
	}
	return { data, count };
}

async function getFlagReasons() {
	const { data, error } = await supabase.from('flag_reasons').select(`*`);
	if (error) {
		console.log('No links for question', error);
	}
	return { data };
}

async function getAIComments(questionId: number) {
	const { data, error } = await supabase
		.from('comments_ai')
		.select('*')
		.eq('question_id', questionId);

	if (error) {
		console.log('No AI comments for question', error);
	}
	return data;
}

function createBaseResponse(
	question: any,
	comments: any[],
	commentCount: number,
	removedCommentCount: number,
	questionTags: any,
	session: any,
	userHasAnswered: boolean,
	event: any,
	aiComments: any,
	flagReasons?: any[]
) {
	return {
		question,
		comments,
		removedComments: [],
		comment_count: commentCount,
		removed_comment_count: removedCommentCount,
		questionTags,
		user: session?.user ? { id: session?.user?.id, email: session?.user?.email } : null,
		flags: {
			userHasAnswered,
			userSignedIn: event?.locals?.session?.user?.aud
		},
		aiComments,
		flagReasons
	};
}

function createFullResponse(
	question: any,
	comments: any[],
	commentCount: number,
	removedComments: any[],
	removedCommentCount: number,
	links: any,
	linksCount: number,
	questionTags: any,
	session: any,
	userHasAnswered: boolean,
	event: any,
	aiComments: any,
	demo_time: boolean,
	flagReasons: any[]
) {
	const baseResponse = createBaseResponse(
		question,
		comments,
		commentCount,
		removedCommentCount,
		questionTags,
		session,
		userHasAnswered,
		event,
		aiComments,
		flagReasons
	);

	if (demo_time) {
		return {
			...baseResponse,
			question: { ...question, subscriptions: question?.subscriptions_demo },
			comments: comments?.map(mapDemoComment),
			removedComments: removedComments?.map(mapDemoComment),
			links,
			links_count: linksCount
		};
	}

	return {
		...baseResponse,
		removedComments: removedComments?.map(mapDemoComment),
		ai_comments: aiComments,
		links,
		links_count: linksCount
	};
}

function mapDemoComment(comment: any) {
	return {
		...comment,
		profiles: comment.profiles_demo,
		comment_like: comment.comment_like_demo
	};
}
