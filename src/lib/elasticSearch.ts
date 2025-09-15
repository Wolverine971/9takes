// src/lib/elasticSearch.ts
import { Client } from '@elastic/elasticsearch';

import {
	PRIVATE_ELASTIC_ADMIN,
	PRIVATE_ELASTICSEARCH_NODE
} from '$env/static/private';

export const elasticClient = new Client({
	node: PRIVATE_ELASTICSEARCH_NODE || 'http://localhost:9200',
	auth: { username: 'elastic', password: PRIVATE_ELASTIC_ADMIN }
});

export const createESQuestion = async (body: {
	question: string;
	author_id: string;
	context: string;
	url: string;
	img_url?: string;
	comment_count?: number;
	flagged?: boolean;
	removed?: boolean;
	question_formatted?: string;
	enneagram?: string;
	author_name?: string;
}) => {
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
				questionFormatted: body.question_formatted || question,
				authorId: author_id,
				authorType: body.enneagram || '',
				authorName: body.author_name || '',
				context,
				url: url,
				imgUrl: img_url || null,
				comments: body.comment_count || 0,
				likes: 0,
				subscriptions: 0,
				flagged: body.flagged || false,
				removed: body.removed || false,
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
		console.error('Failed to create ES question:', e);
		throw new Error(`Elasticsearch indexing failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
	}
};

export const deleteESQuestion = async (body: { questionId: string }) => {
	try {
		const questionId = body.questionId as string;

		const resp = await elasticClient.delete({
			index: 'question',
			id: questionId
		});

		if (resp) {
			return resp;
		} else {
			return { success: false };
		}
	} catch (e) {
		console.error('Failed to delete ES question:', e);
		throw new Error(`Elasticsearch deletion failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
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
		console.error('Failed to update ES question likes:', e);
		// Non-critical operation, don't throw
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
		console.error('Failed to update ES subscription:', e);
		// Non-critical operation, don't throw
	}
};

export const addESComment = async ({
	index,
	parentId,
	enneaType,
	authorId,
	comment,
	ip
}: {
	index: string;
	parentId: string;
	enneaType: string;
	authorId: string;
	comment: string;
	ip: string;
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
					createdDate: date,
					ip
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
		console.error('Failed to add ES comment:', e);
		throw new Error(`Elasticsearch comment indexing failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
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
		console.error('Failed to update ES comment likes:', e);
		// Non-critical operation, don't throw
	}
};

// Bulk indexing utilities
export const bulkIndexQuestions = async (questions: any[]) => {
	if (!questions.length) return { indexed: 0, failed: 0, errors: [] };

	const bulkBody = questions.flatMap(q => [
		{ index: { _index: 'question', _id: q.es_id } },
		{
			question: q.question,
			questionFormatted: q.question_formatted || q.question,
			authorId: q.author_id,
			authorType: q.author_enneagram || '',
			authorName: q.author_name || '',
			context: q.context || '',
			url: q.url,
			imgUrl: q.img_url || null,
			comments: q.comment_count || 0,
			likes: q.like_count || 0,
			subscriptions: q.subscription_count || 0,
			flagged: q.flagged || false,
			removed: q.removed || false,
			createdDate: q.created_at,
			updatedDate: q.updated_at || q.created_at
		}
	]);

	try {
		const response = await elasticClient.bulk({
			body: bulkBody,
			refresh: false // Don't wait for index refresh
		});

		let indexed = 0;
		let failed = 0;
		const errors: any[] = [];

		response.items.forEach((item, i) => {
			if (item.index?.error) {
				failed++;
				errors.push({
					questionId: questions[i].id,
					url: questions[i].url,
					error: item.index.error
				});
			} else {
				indexed++;
			}
		});

		return { indexed, failed, errors };
	} catch (e) {
		console.error('Bulk indexing failed:', e);
		throw new Error(`Bulk indexing failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
	}
};

// Blog post indexing
export const createESBlog = async (body: {
	id: number;
	title: string;
	person: string;
	content: string;
	description: string;
	author: string;
	enneagram: string;
	type: string[];
	loc: string;
	created_at: string;
	lastmod: string;
	published: boolean;
	meta_title?: string;
	twitter?: string;
	instagram?: string;
	tiktok?: string;
	wikipedia?: string;
}) => {
	try {
		const resp = await elasticClient.index({
			index: 'blog',
			body: {
				title: body.title,
				person: body.person,
				content: body.content,
				description: body.description,
				author: body.author,
				enneagram: body.enneagram,
				type: body.type,
				url: body.loc,
				metaTitle: body.meta_title || body.title,
				socialLinks: {
					twitter: body.twitter,
					instagram: body.instagram,
					tiktok: body.tiktok,
					wikipedia: body.wikipedia
				},
				published: body.published,
				createdDate: body.created_at,
				lastModified: body.lastmod
			}
		});

		return resp;
	} catch (e) {
		console.error('Failed to create ES blog:', e);
		throw new Error(`Blog indexing failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
	}
};

// Bulk indexing for blogs
export const bulkIndexBlogs = async (blogs: any[]) => {
	if (!blogs.length) return { indexed: 0, failed: 0, errors: [] };

	// Truncate content to prevent request size issues
	const MAX_CONTENT_LENGTH = 10000; // 10k chars max for content
	const MAX_DESCRIPTION_LENGTH = 1000; // 1k chars max for description

	const bulkBody = blogs.flatMap(b => [
		{ index: { _index: 'blog', _id: b.es_id || `blog_${b.id}` } },
		{
			title: b.title,
			person: b.person,
			content: b.content ? b.content.substring(0, MAX_CONTENT_LENGTH) : '',
			description: b.description ? b.description.substring(0, MAX_DESCRIPTION_LENGTH) : '',
			author: b.author,
			enneagram: b.enneagram,
			type: b.type || [],
			url: b.loc,
			metaTitle: b.meta_title || b.title,
			socialLinks: {
				twitter: b.twitter,
				instagram: b.instagram,
				tiktok: b.tiktok,
				wikipedia: b.wikipedia
			},
			published: b.published,
			createdDate: b.created_at,
			lastModified: b.lastmod
		}
	]);

	try {
		const response = await elasticClient.bulk({
			body: bulkBody,
			refresh: false
		});

		let indexed = 0;
		let failed = 0;
		const errors: any[] = [];

		response.items.forEach((item, i) => {
			if (item.index?.error) {
				failed++;
				errors.push({
					blogId: blogs[i].id,
					title: blogs[i].title,
					error: item.index.error
				});
			} else {
				indexed++;
			}
		});

		return { indexed, failed, errors };
	} catch (e) {
		console.error('Bulk blog indexing failed:', e);
		throw new Error(`Bulk blog indexing failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
	}
};

// Retry logic with exponential backoff
export const indexWithRetry = async (
	indexFunction: () => Promise<any>,
	retries = 3,
	initialDelay = 1000
) => {
	for (let i = 0; i < retries; i++) {
		try {
			return await indexFunction();
		} catch (error) {
			if (i === retries - 1) throw error;
			
			const delay = initialDelay * Math.pow(2, i);
			console.log(`Retry ${i + 1}/${retries} after ${delay}ms`);
			await new Promise(resolve => setTimeout(resolve, delay));
		}
	}
};
