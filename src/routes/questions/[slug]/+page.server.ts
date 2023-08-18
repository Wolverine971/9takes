import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import { supabase } from '$lib/supabase';
import { URL } from 'url';
// import type { PostgrestResponse } from '@supabase/supabase-js';
import type { Actions } from './$types';
import { error } from '@sveltejs/kit';
import { addESComment, addESCommentLike, addESSubscription } from '$lib/elasticSearch';

import { PRIVATE_DEMO } from '$env/static/private';

/** @type {import('./$types').PageLoad} */
export async function load(event: any) {
	const session = await getServerSession(event);
	let userHasAnswered = false;

	const { data: question, error: findQuestionError } = await supabase
		.from(PRIVATE_DEMO ? 'questions_demo' : 'questions')
		.select(
			`*,
			${PRIVATE_DEMO ? 'subscriptions_demo' : 'subscriptions'} ( id, question_id, user_id )`
		)
		.eq('url', event.params.slug)
		.single();

	if (!question) {
		throw error(400, {
			message: 'No question found'
		});
	}

	if (session?.user) {
		const { data: hasUserCommented, error: hasUserCommentedError } = await supabase
			.from(PRIVATE_DEMO ? 'comments_demo' : 'comments')
			.select('*')
			.eq('parent_type', 'question')
			.eq('parent_id', question?.id)
			.eq('author_id', session?.user.id);
		if (!question || findQuestionError) {
			throw error(400, {
				message: 'No question found'
			});
		}
		userHasAnswered = hasUserCommented?.length ? true : false;
	} else {
		// checks if it is a rando
		const ipAddress = event.getClientAddress();
		const { data: hasCommented, error: hasCommentedError } = await supabase
			.from(PRIVATE_DEMO ? 'comments_demo' : 'comments')
			.select('*')
			.eq('parent_type', 'question')
			.eq('parent_id', question?.id)
			.eq('ip', ipAddress);
		userHasAnswered = hasCommented?.length ? true : false;
	}

	if (!userHasAnswered) {
		const { count: commentCount, error: commentCountError } = await supabase
			.from(PRIVATE_DEMO ? 'comments_demo' : 'comments')
			.select('*', { count: 'exact' })
			.eq('parent_type', 'question')
			.eq('parent_id', question?.id);

		return {
			question,
			comments: [],
			comment_count: commentCount,
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
		.from(PRIVATE_DEMO ? 'comments_demo' : 'comments')
		.select(
			`*
			, profiles ( external_id, enneagram)
			, comment_like ( id, comment_id, user_id )`,

			{ count: 'exact' }
		)
		.eq('parent_id', question?.id)
		.limit(10);

	if (questionCommentsError) {
		console.log('No comments for question');
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
		console.log('No links for question');
	}

	return {
		question,
		comments: questionComments,
		comment_count: questionCommentCount,
		links: questionLinks,
		links_count: questionLinksCount,
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
			const body = Object.fromEntries(await request.formData());

			const questionId = body.question_id as string;
			const comment = body.comment as string;
			const parent_id = body.parent_id as string;
			const author_id = body.author_id;
			const parent_type = body.parent_type as string;
			const es_id = body.es_id as string;
			const parentId = parseInt(parent_id);
			const ip = getClientAddress();

			parseUrls(comment, questionId);

			let esId = null
			if (!PRIVATE_DEMO) {

				const resp: any = await addESComment({
					index: parent_type,
					parentId: es_id,
					enneaType: '',
					authorId: author_id.toString(),
					comment,
					ip
				});
				if (resp._id) {
					esId = resp._id
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
						es_id: esId
					}
					: {
						comment: comment,
						parent_id: parentId,
						comment_count: 0,
						ip,
						parent_type: parent_type,
						es_id: esId
					};

			const { data: record, error: addCommentError } = await supabase
				.from(PRIVATE_DEMO ? 'comments_demo' : 'comments')
				.insert(cData)
				.select()
				.single();
			if (!addCommentError) {
				if (parent_type === 'comment') {
					const { data: incremented, error: incrementError } = await supabase.rpc(
						'increment_comment_count',
						{
							comment_parent_id: parentId
						}
					);

					if (!incrementError) {
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

			parseUrls(comment, questionId);

			let esId = null
			if (!PRIVATE_DEMO) {

				const resp: any = await addESComment({
					index: parent_type,
					parentId: es_id,
					enneaType: '',
					authorId: author_id.toString(),
					comment,
					ip
				});
				if (resp._id) {
					esId = resp._id
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
						es_id: esId
					}
					: {
						comment: comment,
						parent_id: parentId,
						comment_count: 0,
						ip,
						parent_type: parent_type,
						es_id: esId
					};

			const { data: record, error: addCommentError } = await supabase
				.from(PRIVATE_DEMO ? 'comments_demo' : 'comments')
				.insert(cData)
				.select()
				.single();
			if (!addCommentError) {
				if (parent_type === 'comment') {
					const { data: incremented, error: incrementError } = await supabase.rpc(
						'increment_comment_count',
						{
							comment_parent_id: parentId
						}
					);

					if (!incrementError) {
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

	likeComment: async ({ request }) => {
		try {
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
					const { data: record, error: removeLikeError } = await supabase
						.from(PRIVATE_DEMO ? 'comment_like_demo' : 'comment_like')
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

	subscribe: async ({ request }) => {
		try {
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
						.from(PRIVATE_DEMO ? 'subscriptions_demo' : 'subscriptions')
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
					const { data: record, error: removeSubscriptionError } = await supabase
						.from(PRIVATE_DEMO ? 'subscriptions_demo' : 'subscriptions')
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

	linkClick: async ({ request, getClientAddress }) => {
		try {
			const body = Object.fromEntries(await request.formData());

			const linkId = body.linkId as string;

			const { data, error: incrementError } = await supabase.rpc('increment_clicks', {
				link_id: parseInt(linkId)
			});
			if (incrementError) {
				throw error(404, {
					message: `Add comment error`
				});
			}
		} catch (e) {
			throw error(400, {
				message: `error creating comment ${JSON.stringify(e)}`
			});
		}
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
			.insert([{ domain, updated_at: new Date(), clicks: 0 }])
			.select();
		if (linkInsertDomainError) {
			throw new Error('failed to upload domain');
		}
		domainId = linkDomainInsertSuccess[0].id;
	} else {
		domainId = linkDomainUpdateSuccess[0].id;
	}
	const { data: linkSuccess, error: linkError } = await supabase
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

function getDomain(inputUrl: string) {
	const url = new URL(inputUrl);
	return url.hostname;
}

const extractFirstURL = (comment: string) => {
	const urlRegex = /(https?:\/\/[^\s]+)/g;
	const matchedURLs = comment.match(urlRegex);
	const url = matchedURLs ? matchedURLs[0] : null;
	return {
		url,
		domain: url ? getDomain(url) : ''
	};
};
