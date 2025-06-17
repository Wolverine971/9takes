// routes/questions/[slug]/+page.server.ts
import { supabase } from '$lib/supabase';

import type { Actions } from './$types';
import { error } from '@sveltejs/kit';
import { addESComment, addESCommentLike, addESSubscription } from '$lib/elasticSearch';
import { decode } from 'base64-arraybuffer';
import { checkDemoTime } from '../../../utils/api';
import { mapDemoValues } from '../../../utils/demo';
import { extractFirstURL } from '../../../utils/StringUtils';

import axios from 'axios';
import { load as cheerioLoad } from 'cheerio';

/** @type {import('./$types').PageLoad} */
export const load: PageLoad = async (event) => {
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
		const commentData = await createCommentData(body, getClientAddress(), demo_time);
		return handleCommentCreation(commentData, body.parent_type as string, demo_time);
	},

	createCommentRando: async ({ request, getClientAddress }) => {
		const { body, demo_time } = await getRequestData(request);
		if (typeof body.comment !== 'string') {
			throw error(404, { message: 'Bad comment' });
		}
		const commentData = await createCommentData(body, getClientAddress(), demo_time);
		const record = await handleCommentCreation(commentData, body.parent_type as string, demo_time);
		return mapDemoValues(record);
	},

	likeComment: async ({ request, locals }) => {
		const session = locals.session;
		if (!session?.user?.id) {
			throw error(400, 'unauthorized');
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
			throw error(400, 'unauthorized');
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
			throw error(400, 'unauthorized');
		}

		const { comment_id, description } = Object.fromEntries(await request.formData());
		await flagComment(session.user.id, comment_id as string, description as string);
	},

	updateQuestionImg: async ({ request }) => {
		const { img_url, url } = Object.fromEntries(await request.formData());
		const imgPath = await uploadImage(img_url as string, url as string);
		await updateQuestionImageUrl(url as string, imgPath);
		return true;
	}
};

async function getRequestData(request: Request) {
	const body = Object.fromEntries(await request.formData());
	const demo_time = await checkDemoTime();
	return { body, demo_time };
}

async function createCommentData(body: any, ip: string, demo_time: boolean) {
	const { question_id, comment, parent_id, author_id, parent_type, es_id, fingerprint } = body;
	await parseUrls(comment, question_id);

	let esId = null;
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
		fingerprint
	};
}

async function createESComment(
	parent_type: string,
	es_id: string,
	author_id: string,
	comment: string,
	ip: string
) {
	try {
		const resp: any = await addESComment({
			index: parent_type,
			parentId: es_id,
			enneaType: '',
			authorId: author_id.toString(),
			comment,
			ip
		});
		return resp._id;
	} catch (error) {
		console.error('Error creating ES comment:', error);
		return null;
	}
}

async function handleCommentCreation(commentData: any, parent_type: string, demo_time: boolean) {
	const { data: record, error: addCommentError } = await supabase
		.from(demo_time ? 'comments_demo' : 'comments')
		.insert(commentData)
		.select()
		.single();

	if (addCommentError) {
		console.error(addCommentError);
		throw error(404, { message: 'Add comment error' });
	}

	if (parent_type === 'comment' && !demo_time) {
		await incrementCommentCount(commentData.parent_id);
	}

	return record;
}

async function incrementCommentCount(parentId: number) {
	const { error: incrementError } = await supabase.rpc('increment_comment_count', {
		comment_parent_id: parentId
	});

	if (incrementError) {
		console.error('Error incrementing comment count:', incrementError);
	}
}

async function addLike(parent_id: string, user_id: string) {
	const { data: record, error: addLikeError } = await supabase
		.from('comment_like')
		.insert({ comment_id: parseInt(parent_id), user_id })
		.select()
		.single();

	if (addLikeError) {
		console.error(addLikeError);
		throw error(404, { message: 'Add like error' });
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
		throw error(404, { message: 'Remove like error' });
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
		throw error(404, { message: 'Add subscription error' });
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
		throw error(404, { message: 'Remove subscription error' });
	}

	return null;
}

async function incrementLinkClicks(linkId: string) {
	const { error: incrementError } = await supabase.rpc('increment_clicks', {
		link_id: parseInt(linkId)
	});

	if (incrementError) {
		throw error(404, { message: 'Increment link clicks error' });
	}
}

async function flagComment(userId: string, commentId: string, description: string) {
	const { error: flagCommentError } = await supabase
		.from('flagged_comments')
		.insert({ flagged_by: userId, comment_id: commentId, description });

	if (flagCommentError) {
		throw error(404, { message: 'Flag comment error' });
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
		const response = await axios.get(url);
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
		.limit(10)
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
		.limit(10);

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
