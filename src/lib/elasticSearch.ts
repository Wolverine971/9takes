import { Client } from '@elastic/elasticsearch';
// import type { Request, Response } from '@sveltejs/kit';

import { PRIVATE_ELASTIC_GENERAL, PRIVATE_ELASTIC_ADMIN } from '$env/static/private';

export const elasticClient = new Client({
	node: 'http://69.164.208.9',
	auth: { username: 'elastic', password: PRIVATE_ELASTIC_ADMIN }
	// auth: { username: 'anon', password: PRIVATE_ELASTIC_GENERAL }
});

export const createESQuestion = async (body: any) => {
	try {
		const question = body.question as string;
		const author_id = body.author_id as string;
		const context = body.context as string;
		const url = body.url as string;
		const img_url = body.img_url as string;

		const date = new Date();
		const resp = await elasticClient.index({
			index: 'question',
			body: {
				question: question,
				authorId: author_id,
				authorType: '',
				context,
				url: url,
				comments: 0,
				likes: 0,
				subscriptions: 0,
				createdDate: date,
				updatedDate: date
			}
		});

		if (resp) {
			return resp;
		} else {
			return { success: false };
		}
	} catch (e) {
		console.log(e);
	}
};

export const addESQuestionLike = async ({
	questionId,
	operation
}: {
	questionId: string;
	operation: string;
}) => {
	try {
		await elasticClient.update({
			index: 'question',
			id: questionId,
			body: {
				script: {
					source: `${operation === 'add' ? 'ctx._source.likes++' : 'ctx._source.likes--'}`
				}
			}
		});
	} catch (e) {
		console.log(e);
	}
};

export const addESSubscription = async ({
	questionId,
	operation
}: {
	questionId: string;
	operation: string;
}) => {
	try {
		return await elasticClient.update({
			index: 'question',
			id: questionId,
			body: {
				script: {
					source: `${
						operation === 'add' ? 'ctx._source.subscriptions++' : 'ctx._source.subscriptions--'
					}`
				}
			}
		});
	} catch (e) {
		console.log(e);
	}
};

export const addESComment = async ({
	index,
	parentId,
	enneaType,
	authorId,
	comment
}: {
	index: string;
	parentId: string;
	enneaType: string;
	authorId: string;
	comment: string;
}) => {
	try {
		const date = new Date();
		return elasticClient
			.index({
				index: 'comment',
				body: {
					parentId: parentId,
					authorId: authorId,
					comment: comment,
					comments: 0,
					likes: 0,
					createdDate: date
				}
			})
			.then(async (resp) => {
				if (index === 'question') {
					await elasticClient.update({
						index: 'question',
						id: parentId,
						body: {
							script: {
								source: 'ctx._source.comments++'
							}
						}
					});
				} else if (index === 'comment') {
					await elasticClient.update({
						index: 'comment',
						id: parentId,
						body: {
							script: {
								source: 'ctx._source.comments++'
							}
						}
					});
				} else if (index === 'relationship') {
					await elasticClient.update({
						index: 'relationship',
						id: parentId,
						body: {
							script: {
								source: 'ctx._source.comments++'
							}
						}
					});
				} else if (index === 'blog') {
					await elasticClient.update({
						index: 'blog',
						id: parentId,
						body: {
							script: {
								source: 'ctx._source.comments++'
							}
						}
					});
				} else {
					await elasticClient.update({
						index: enneaType,
						id: parentId,
						body: {
							script: {
								source: 'ctx._source.comments++'
							}
						}
					});
				}
				return resp;
			});
	} catch (e) {
		console.log(e);
	}
};

export const addESCommentLike = async ({
	commentId,
	operation
}: {
	commentId: string;
	operation: string;
}) => {
	try {
		return await elasticClient.update({
			index: 'comment',
			id: commentId,
			body: {
				script: {
					source: `${operation === 'add' ? 'ctx._source.likes++' : 'ctx._source.likes--'}`
				}
			}
		});
	} catch (e) {
		console.log(e);
	}
};
