import { Client } from '@elastic/elasticsearch';
// import type { Request, Response } from '@sveltejs/kit';

import { PRIVATE_ELASTIC_GENERAL, PRIVATE_ELASTIC_ADMIN } from '$env/static/private';

export const elasticClient = new Client({
	node: 'http://69.164.208.9',
	auth: { username: 'elastic', password: PRIVATE_ELASTIC_ADMIN }
	// auth: { username: 'anon', password: PRIVATE_ELASTIC_GENERAL }
});

export const createQuestion = async (body: any) => {
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
			return { success: true };
		} else {
			return { success: false };
		}
	} catch (e) {
		console.log(e);
	}
};

export const addQuestionLike = async ({
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

export const addSubscription = async ({
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

export const addComment = async ({
	index,
	id,
	enneaType,
	authorId
}: {
	index: string;
	id: string;
	enneaType: string;
	authorId: string;
}) => {
	try {
		const date = new Date();

		return elasticClient
			.index({
				index: 'comment',
				type: '_doc',
				body: {
					parentId: id,
					authorId: authorId,
					comment: req.body.comment,
					comments: 0,
					likes: 0,
					createdDate: date
				}
			})
			.then(async (resp) => {
				if (index === 'question') {
					await elasticClient.update({
						index: 'question',
						id: id,
						body: {
							script: {
								source: 'ctx._source.comments++'
							}
						}
					});
				} else if (index === 'comment') {
					await elasticClient.update({
						index: 'comment',
						id: id,
						body: {
							script: {
								source: 'ctx._source.comments++'
							}
						}
					});
				} else if (index === 'relationship') {
					await elasticClient.update({
						index: 'relationship',
						id: id,
						body: {
							script: {
								source: 'ctx._source.comments++'
							}
						}
					});
				} else if (index === 'blog') {
					await elasticClient.update({
						index: 'blog',
						id: id,
						body: {
							script: {
								source: 'ctx._source.comments++'
							}
						}
					});
				} else {
					await elasticClient.update({
						index: enneaType,
						id: id,
						body: {
							script: {
								source: 'ctx._source.comments++'
							}
						}
					});
				}
			});
	} catch (e) {
		console.log(e);
	}
};

export const addCommentLike = async ({
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
