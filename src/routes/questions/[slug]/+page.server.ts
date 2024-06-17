/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '$lib/supabase';
import { URL } from 'url';

import type { Actions } from './$types';
import { error } from '@sveltejs/kit';
import { addESComment, addESCommentLike, addESSubscription } from '$lib/elasticSearch';
import { decode } from 'base64-arraybuffer';
import { checkDemoTime } from '../../../utils/api';
import { mapDemoValues } from '../../../utils/demo';
import { extractFirstURL } from '../../../utils/StringUtils';

/** @type {import('./$types').PageLoad} */
export async function load(event) {
	const { demo_time } = await event.parent();
	const session = event.locals.session;
	const cookie = event.cookies.get('9tfingerprint');

	let question = null;
	if (Number.isInteger(parseInt(event.params.slug))) {
		const { data: questionData, error: findQuestionError } = await supabase
			.from(demo_time === true ? 'questions_demo' : 'questions')
			.select(
				`*,
			${demo_time === true ? 'subscriptions_demo' : 'subscriptions'} ( id, question_id, user_id )`
			)
			.eq('id', event.params.slug)
			.single();

		if (!questionData || findQuestionError) {
			throw error(400, {
				message: 'No question found'
			});
		}
		question = questionData;

	} else {

		const { data: questionData, error: findQuestionError } = await supabase
			.from(demo_time === true ? 'questions_demo' : 'questions')
			.select(
				`*,
			${demo_time === true ? 'subscriptions_demo' : 'subscriptions'} ( id, question_id, user_id )`
			)
			.eq('url', event.params.slug)
			.single();

		if (!questionData || findQuestionError) {
			throw error(400, {
				message: 'No question found'
			});
		}
		question = questionData;
	}

	const { data: userHasAnswered } = await supabase.rpc('can_see_comments_3', {
		userfingerprint: cookie,
		questionid: question?.id,
		userid: session?.user?.id || null
	});

	const { data: questionTags, error: questionTagsError } = await supabase
		.from('question_tags')
		.select(`*, question_tag(*)`, { count: 'exact' })
		.eq('question_id', question?.id);

	if (questionTagsError) {
		console.log('No question tags for question', questionTagsError);
	}

	if (!userHasAnswered) {
		const { count: commentCount } = await supabase
			.from(demo_time === true ? 'comments_demo' : 'comments')
			.select('*', { count: 'exact' })
			.eq('parent_type', 'question')
			.eq('parent_id', question?.id)
			.eq('removed', false);

		return {
			question,
			comments: [],
			removedComments: [],
			comment_count: commentCount,
			removed_comment_count: 0,
			questionTags,
			session,
			flags: {
				userHasAnswered: userHasAnswered,
				userSignedIn: event?.locals?.session?.user?.aud
			}
		};
	}

	const {
		data: questionComments,
		count: questionCommentCount,
		error: questionCommentsError
	} = await supabase
		.from(demo_time === true ? 'comments_demo' : 'comments')
		.select(
			`*
			, ${demo_time === true ? 'profiles_demo' : 'profiles'} ( external_id, enneagram)
			, ${demo_time === true ? 'comment_like_demo' : 'comment_like'} ( id, comment_id, user_id )`,

			{ count: 'exact' }
		)
		.eq('parent_id', question?.id)
		.eq('parent_type', 'question')
		.eq('removed', false)
		.limit(10)
		.order('created_at', { ascending: false });

	if (questionCommentsError) {
		console.log('No comments for question', questionCommentsError);
	}

	const {
		data: questionRemovedComments,
		count: questionRemovedCommentCount,
		error: questionRemovedCommentsError
	} = await supabase
		.from(demo_time === true ? 'comments_demo' : 'comments')
		.select(
			`*
			, ${demo_time === true ? 'profiles_demo' : 'profiles'} ( external_id, enneagram)
			, ${demo_time === true ? 'comment_like_demo' : 'comment_like'} ( id, comment_id, user_id )`,

			{ count: 'exact' }
		)
		.eq('parent_id', question?.id)
		.eq('parent_type', 'question')
		.eq('removed', true)
		.limit(10)
		.order('created_at', { ascending: false });

	if (questionRemovedCommentsError) {
		console.log('No removed comments for question', questionRemovedCommentsError);
	}

	const {
		data: questionLinks,
		count: questionLinksCount,
		error: questionLinksError
	} = await supabase
		.from('links')
		.select(
			`*`,

			{ count: 'exact' }
		)
		.eq('question_id', question?.id)
		.limit(10);

	if (questionLinksError) {
		console.log('No links for question', questionLinksError);
	}

	if (demo_time === true) {
		return {
			question: { ...question, ...{ subscriptions: question?.subscriptions_demo } },
			comments: questionComments?.map((q) => {
				q.profiles = q.profiles_demo;
				q.comment_like = q.comment_like_demo;
				return q;
			}),
			removedComments: questionRemovedComments?.map((q) => {
				q.profiles = q.profiles_demo;
				q.comment_like = q.comment_like_demo;
				return q;
			}),
			removed_comment_count: questionRemovedCommentCount,
			comment_count: questionCommentCount,
			links: questionLinks,
			links_count: questionLinksCount,
			questionTags,
			session,
			flags: {
				userHasAnswered: userHasAnswered,
				userSignedIn: event?.locals?.session?.user?.aud
			}
		};
	}

	const { data: aiComments, error: aiCommentsError } = await supabase
		.from('comments_ai')
		.select('*')
		.eq('question_id', question?.id);

	if (aiCommentsError) {
		console.log('No ai comments for question', aiCommentsError);
	}

	return {
		question,
		comments: questionComments,
		comment_count: questionCommentCount,
		removedComments: questionRemovedComments?.map((q) => {
			q.profiles = q.profiles_demo;
			q.comment_like = q.comment_like_demo;
			return q;
		}),
		removed_comment_count: questionRemovedCommentCount,
		ai_comments: aiComments,
		links: questionLinks,
		links_count: questionLinksCount,
		questionTags,
		session,
		flags: {
			userHasAnswered: userHasAnswered,
			userSignedIn: event?.locals?.session?.user?.aud
		}
	};
}

export const actions: Actions = {
	createComment: async ({ request, getClientAddress }) => {
		try {
			const demo_time = await checkDemoTime();

			const body = Object.fromEntries(await request.formData());

			const questionId = body.question_id as string;
			const comment = body.comment as string;
			const parent_id = body.parent_id as string;
			const author_id = body.author_id;
			const parent_type = body.parent_type as string;
			const es_id = body.es_id as string;
			const parentId = parseInt(parent_id);
			const ip = getClientAddress();
			const fingerprint = body.fingerprint as string;

			parseUrls(comment, questionId);

			let esId = null;
			if (demo_time === false) {
				const resp: any = await addESComment({
					index: parent_type,
					parentId: es_id,
					enneaType: '',
					authorId: author_id.toString(),
					comment,
					ip
				});
				if (resp._id) {
					esId = resp._id;
				}
			}

			const cData =
				author_id !== 'undefined'
					? {
						comment: comment,
						parent_id: parentId,
						author_id: author_id.toString(),
						comment_count: 0,
						ip,
						parent_type: parent_type,
						es_id: esId,
						fingerprint
					}
					: {
						comment: comment,
						parent_id: parentId,
						comment_count: 0,
						ip,
						parent_type: parent_type,
						es_id: esId,
						fingerprint
					};

			const { data: record, error: addCommentError } = await supabase
				.from(demo_time === true ? 'comments_demo' : 'comments')
				.insert(cData)
				.select()
				.single();
			if (!addCommentError) {
				if (parent_type === 'comment' && demo_time === false) {
					if (demo_time === false) {
						// need to increment the demo commentcount
						const { error: incrementError } = await supabase.rpc('increment_comment_count', {
							comment_parent_id: parentId
						});

						if (!incrementError) {
							return record;
						}
					} else {
						return record;
					}
				} else {
					return record;
				}
			} else {
				console.log(addCommentError);
			}

			throw error(404, {
				message: `Add comment error`
			});
		} catch (e) {
			throw error(400, {
				message: `error creating comment ${JSON.stringify(e)}`
			});
		}
	},

	createCommentRando: async ({ request, getClientAddress }) => {
		try {
			const demo_time = await checkDemoTime();
			//refresh the comments
			const body = Object.fromEntries(await request.formData());

			const questionId = body.question_id as string;
			const comment = body.comment as string;
			const parent_id = body.parent_id as string;
			const author_id = body.author_id;
			const parent_type = body.parent_type as string;
			const es_id = body.es_id as string;
			const parentId = parseInt(parent_id);
			const ip = getClientAddress();
			const fingerprint = body.fingerprint as string;

			if (typeof comment !== 'string') {
				throw error(404, {
					message: `Bad comment`
				});
			}
			parseUrls(comment, questionId);

			let esId = null;
			if (demo_time === false) {
				try {
					const resp: any = await addESComment({
						index: parent_type,
						parentId: es_id,
						enneaType: '',
						authorId: author_id.toString(),
						comment,
						ip
					});
					if (resp._id) {
						esId = resp._id;
					}
				} catch (error) {
					console.log('error creating ES comment', error);
				}
			}

			const cData =
				author_id !== 'undefined'
					? {
						comment: comment,
						parent_id: parentId,
						author_id: author_id.toString(),
						comment_count: 0,
						ip,
						parent_type: parent_type,
						es_id: esId,
						fingerprint
					}
					: {
						comment: comment,
						parent_id: parentId,
						author_id: null,
						comment_count: 0,
						ip,
						parent_type: parent_type,
						es_id: esId,
						fingerprint
					};

			const { data: record, error: addCommentError } = await supabase
				.from(demo_time === true ? 'comments_demo' : 'comments')
				.insert(cData)
				.select()
				.single();
			if (!addCommentError) {
				if (parent_type === 'comment' && demo_time === false) {
					const { error: incrementError } = await supabase.rpc('increment_comment_count', {
						comment_parent_id: parentId
					});

					if (!incrementError) {
						return mapDemoValues(record);
					}
				} else {
					return mapDemoValues(record);
				}
			} else {
				console.log(addCommentError);
			}

			throw error(404, {
				message: `Add comment error`
			});
		} catch (e) {
			console.log(e);
		}
	},

	likeComment: async ({ request, locals }) => {
		try {
			const session = locals.session;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}

			const demo_time = await checkDemoTime();

			const body = Object.fromEntries(await request.formData());

			const parent_id = body.parent_id as string;
			// const id = body.id as string
			const user_id = body.user_id as string;
			const operation = body.operation as string;
			const es_id = body.es_id as string;
			const parentId = parseInt(parent_id);
			const likeData = {
				comment_id: parentId,
				user_id
			};
			const resp: any = await addESCommentLike({
				commentId: es_id,
				operation: operation
			});
			if (resp._id) {
				if (operation === 'add') {
					const { data: record, error: addLikeError } = await supabase
						.from('comment_like')
						.insert(likeData)
						.select()
						.single();
					if (!addLikeError) {
						await supabase.rpc('increment_like_count', {
							comment_id: parent_id
						});
						return record;
					} else {
						console.log(addLikeError);
					}
				} else {
					const { error: removeLikeError } = await supabase
						.from(demo_time === true ? 'comment_like_demo' : 'comment_like')
						.delete()
						.eq('user_id', user_id)
						.eq('comment_id', parent_id);

					if (!removeLikeError) {
						await supabase.rpc('decrement_like_count', {
							comment_id: parent_id
						});
						return null;
					} else {
						console.log(removeLikeError);
					}
				}
			}

			throw error(404, {
				message: `Add like error`
			});
		} catch (e) {
			throw error(400, {
				message: `error creating like ${JSON.stringify(e)}`
			});
		}
	},

	subscribe: async ({ request, locals }) => {
		try {
			const session = locals.session;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}

			const demo_time = await checkDemoTime();

			const body = Object.fromEntries(await request.formData());

			const parent_id = body.parent_id as string;
			const user_id = body.user_id as string;
			const es_id = body.es_id as string;
			const operation = body.operation as string;
			const parentId = parseInt(parent_id);
			const subscriptionData = {
				question_id: parentId,
				user_id
			};
			const resp: any = await addESSubscription({
				questionId: es_id,
				operation: operation
			});
			if (resp._id) {
				if (operation === 'add') {
					const { data: subscriptionRecord, error: addSubscriptionError } = await supabase
						.from(demo_time === true ? 'subscriptions_demo' : 'subscriptions')
						.insert(subscriptionData)
						.select()
						.single();
					if (!addSubscriptionError) {
						// await supabase.rpc('increment_like_count', {
						// 	comment_id: parent_id
						// });
						return subscriptionRecord;
					} else {
						console.log(addSubscriptionError);
					}
				} else {
					const { error: removeSubscriptionError } = await supabase
						.from(demo_time === true ? 'subscriptions_demo' : 'subscriptions')
						.delete()
						.eq('user_id', user_id)
						.eq('question_id', parent_id);

					if (!removeSubscriptionError) {
						// await supabase.rpc('decrement_like_count', {
						// 	comment_id: parent_id
						// });
						return null;
					} else {
						console.log(removeSubscriptionError);
					}
				}
			}

			throw error(404, {
				message: `Add like error`
			});
		} catch (e) {
			throw error(400, {
				message: `error creating like ${JSON.stringify(e)}`
			});
		}
	},

	saveLinkClick: async ({ request }) => {
		try {
			const body = Object.fromEntries(await request.formData());
			const linkId = body.linkId as string;

			const { error: incrementError } = await supabase.rpc('increment_clicks', {
				link_id: parseInt(linkId)
			});
			if (incrementError) {
				throw error(404, {
					message: `Add comment error`
				});
			}
			return true;
		} catch (e) {
			throw error(400, {
				message: `error creating comment ${JSON.stringify(e)}`
			});
		}
	},

	flagComment: async ({ request, locals }) => {
		try {
			const session = locals.session;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}

			const body = Object.fromEntries(await request.formData());
			const comment_id = body.comment_id as string;
			// const reason_id = body.reason_id as string;
			const description = body.description as string;

			const { error: flagCommentError } = await supabase
				.from('flagged_comments')
				.insert({ flagged_by: session?.user?.id, comment_id, description });

			if (flagCommentError) {
				throw error(404, {
					message: `Flag comment error`
				});
			}
		} catch (e) {
			console.log(e);
			throw error(400, {
				message: `error flagging comment ${JSON.stringify(e)}`
			});
		}
	},

	updateQuestionImg: async (event) => {
		const { request } = event;
		const body = Object.fromEntries(await request.formData());

		const img_url = body.img_url as string;
		const url = body.url as string;

		const base64 = img_url.split('base64,')[1];

		const buffer = decode(base64);
		const imgPath = `public/${url}.png`;
		const { data: imgUploadData, error: uploadError } = await supabase.storage
			.from('questions')
			.upload(
				imgPath,
				buffer,
				{ upsert: true, contentType: 'image/png' }
				// { upsert: true, contentType: 'image/png'}
			);

		if (uploadError) {
			throw error(400, 'question not updated');
		}
		if (imgUploadData) {
			const { error: uploadError } = await supabase
				.from('questions')
				.update({ img_url: imgPath })
				.eq('url', url);
			if (uploadError) {
				console.log(uploadError);
			}
		}

		// // get image here https://www.youtube.com/watch?v=HvOvdD2nX1k

		return true;
	}
};

const parseUrls = async (comment: string, questionId: string) => {
	const { url, domain } = extractFirstURL(comment);
	let domainId = null;
	if (!domain) {
		return;
	}
	const { data: linkDomainUpdateSuccess, error: linkDomainUpdateError } = await supabase
		.from('link_domains')
		.update({
			domain,
			updated_at: new Date()
		})
		.eq('domain', domain)
		// .upsert({ domain }, { domain, updated_at: new Date() })
		// .insert([{ some_column: 'someValue', other_column: 'otherValue' }])
		.select();
	if (linkDomainUpdateError) {
		throw new Error('failed to upload domain');
	} else if (linkDomainUpdateSuccess.length === 0) {
		const { data: linkDomainInsertSuccess, error: linkInsertDomainError } = await supabase
			.from('link_domains')
			.insert([{ domain, updated_at: new Date() }])
			.select();
		if (linkInsertDomainError) {
			throw new Error('failed to upload domain');
		}
		domainId = linkDomainInsertSuccess[0].id;
	} else {
		domainId = linkDomainUpdateSuccess[0].id;
	}
	const { error: linkError } = await supabase
		.from('links')
		.upsert({
			url,
			domain_id: domainId,
			updated_at: new Date(),
			question_id: questionId
		})
		.select();
	if (!linkError) {
		console.log('updated links');
	}
};


