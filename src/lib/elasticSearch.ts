// src/lib/elasticSearch.ts
import { Client } from '@elastic/elasticsearch';

import { PRIVATE_ELASTIC_ADMIN, PRIVATE_ELASTICSEARCH_NODE } from '$env/static/private';

export const elasticClient = new Client({
	node: PRIVATE_ELASTICSEARCH_NODE || 'http://localhost:9200',
	auth: { username: 'elastic', password: PRIVATE_ELASTIC_ADMIN }
});

/**
 * Validate Elasticsearch connection
 * Should be called on application startup
 */
export async function validateElasticConnection(): Promise<boolean> {
	try {
		const pingResponse = await elasticClient.ping();
		if (pingResponse) {
			console.log('Elasticsearch connection successful');
			return true;
		}
		return false;
	} catch (error) {
		console.error('Elasticsearch connection failed:', error);
		throw new Error('Failed to connect to Elasticsearch. Please check your configuration.');
	}
}

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
		throw new Error(
			`Elasticsearch indexing failed: ${e instanceof Error ? e.message : 'Unknown error'}`
		);
	}
};

export const deleteESQuestion = async (
	body: { questionId: string }
): Promise<{ success?: boolean; [key: string]: any }> => {
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
		throw new Error(
			`Elasticsearch deletion failed: ${e instanceof Error ? e.message : 'Unknown error'}`
		);
	}
};

export const addESQuestionLike = async ({
	questionId,
	operation
}: {
	questionId: string;
	operation: string;
}): Promise<boolean> => {
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
		return true;
	} catch (e) {
		console.error('Failed to update ES question likes:', {
			questionId,
			operation,
			error: e instanceof Error ? e.message : 'Unknown error'
		});
		// Non-critical operation, return false instead of throwing
		return false;
	}
};

export const addESSubscription = async ({
	questionId,
	operation
}: {
	questionId: string;
	operation: string;
}): Promise<boolean> => {
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
		return true;
	} catch (e) {
		console.error('Failed to update ES subscription:', {
			questionId,
			operation,
			error: e instanceof Error ? e.message : 'Unknown error'
		});
		// Non-critical operation, return false instead of throwing
		return false;
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
}): Promise<string | null> => {
	try {
		const date = new Date();
		const resp = await elasticClient.index({
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
		});

		// Update parent comment count with better error handling
		try {
			const updateIndex = index === 'comment' || index === 'question' || index === 'relationship' || index === 'blog'
				? index
				: enneaType;

			await elasticClient.update({
				index: updateIndex,
				id: parentId,
				body: {
					script: {
						source: 'ctx._source.comments++'
					}
				}
			});
		} catch (updateError) {
			console.error('Failed to update parent comment count:', {
				parentId,
				index,
				commentId: resp._id,
				error: updateError instanceof Error ? updateError.message : 'Unknown error'
			});
			// Don't throw - comment was successfully created
			// Consider queuing for retry or manual reconciliation
		}

		return resp._id;
	} catch (e) {
		console.error('Failed to add ES comment:', e);
		throw new Error(
			`Elasticsearch comment indexing failed: ${e instanceof Error ? e.message : 'Unknown error'}`
		);
	}
};

export const addESCommentLike = async ({
	commentId,
	operation
}: {
	commentId: string;
	operation: string;
}): Promise<boolean> => {
	try {
		await elasticClient.update({
			index: 'comment',
			id: commentId,
			body: {
				script: {
					source: `${operation === 'add' ? 'ctx._source.likes++' : 'ctx._source.likes--'}`
				}
			}
		});
		return true;
	} catch (e) {
		console.error('Failed to update ES comment likes:', {
			commentId,
			operation,
			error: e instanceof Error ? e.message : 'Unknown error'
		});
		// Non-critical operation, return false instead of throwing
		return false;
	}
};

// Define types for bulk operations
interface QuestionIndexData {
	es_id?: string;
	id?: number;
	question: string;
	question_formatted?: string;
	author_id: string;
	author_enneagram?: string;
	author_name?: string;
	context?: string;
	url: string;
	img_url?: string | null;
	comment_count?: number;
	like_count?: number;
	subscription_count?: number;
	flagged?: boolean;
	removed?: boolean;
	created_at: string;
	updated_at?: string;
}

interface BulkIndexError {
	questionId?: number;
	blogId?: number;
	url?: string;
	title?: string;
	error: unknown;
}

interface BulkIndexResult {
	indexed: number;
	failed: number;
	errors: BulkIndexError[];
}

// Bulk indexing utilities
export const bulkIndexQuestions = async (questions: QuestionIndexData[]): Promise<BulkIndexResult> => {
	if (!questions.length) return { indexed: 0, failed: 0, errors: [] };

	const bulkBody = questions.flatMap((q) => [
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
		const errors: BulkIndexError[] = [];

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

interface BlogIndexData {
	es_id?: string;
	id: number;
	title: string;
	person: string;
	content?: string;
	description?: string;
	author: string;
	enneagram: string;
	type?: string[];
	loc: string;
	meta_title?: string;
	twitter?: string;
	instagram?: string;
	tiktok?: string;
	wikipedia?: string;
	published: boolean;
	created_at: string;
	lastmod: string;
}

// Bulk indexing for blogs
export const bulkIndexBlogs = async (blogs: BlogIndexData[]): Promise<BulkIndexResult> => {
	if (!blogs.length) return { indexed: 0, failed: 0, errors: [] };

	// Truncate content to prevent request size issues
	const MAX_CONTENT_LENGTH = 10000; // 10k chars max for content
	const MAX_DESCRIPTION_LENGTH = 1000; // 1k chars max for description

	const bulkBody = blogs.flatMap((b) => [
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
		const errors: BulkIndexError[] = [];

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
		throw new Error(
			`Bulk blog indexing failed: ${e instanceof Error ? e.message : 'Unknown error'}`
		);
	}
};

// Index management functions for clean reindexing
export const deleteIndex = async (
	indexName: string
): Promise<{ acknowledged: boolean; skipped?: boolean }> => {
	try {
		const exists = await elasticClient.indices.exists({ index: indexName });
		if (exists) {
			const response = await elasticClient.indices.delete({ index: indexName });
			console.log(`Successfully deleted index: ${indexName}`);
			return response;
		} else {
			console.log(`Index ${indexName} does not exist, skipping deletion`);
			return { acknowledged: true, skipped: true };
		}
	} catch (e) {
		console.error(`Failed to delete index ${indexName}:`, e);
		throw new Error(`Index deletion failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
	}
};

export const createIndex = async (
	indexName: string,
	mappings?: any,
	settings?: any
): Promise<{ acknowledged: boolean; exists?: boolean }> => {
	try {
		const exists = await elasticClient.indices.exists({ index: indexName });
		if (!exists) {
			const body: any = {};
			if (mappings) body.mappings = mappings;
			if (settings) body.settings = settings;

			const response = await elasticClient.indices.create({
				index: indexName,
				...(Object.keys(body).length > 0 && { body })
			});
			console.log(`Successfully created index: ${indexName}`);
			return response;
		} else {
			console.log(`Index ${indexName} already exists`);
			return { acknowledged: true, exists: true };
		}
	} catch (e) {
		console.error(`Failed to create index ${indexName}:`, e);
		throw new Error(`Index creation failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
	}
};

export const recreateIndex = async (
	indexName: string,
	mappings?: any,
	settings?: any
): Promise<{ acknowledged: boolean; exists?: boolean }> => {
	try {
		// Delete if exists
		await deleteIndex(indexName);
		// Create new index
		return await createIndex(indexName, mappings, settings);
	} catch (e) {
		console.error(`Failed to recreate index ${indexName}:`, e);
		throw new Error(`Index recreation failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
	}
};

// Get index mappings for questions
export const getQuestionIndexMapping = () => ({
	properties: {
		question: { type: 'text', analyzer: 'standard' },
		questionFormatted: { type: 'text', analyzer: 'standard' },
		authorId: { type: 'keyword' },
		authorType: { type: 'keyword' },
		authorName: { type: 'text' },
		context: { type: 'text' },
		url: { type: 'keyword' },
		imgUrl: { type: 'keyword' },
		comments: { type: 'integer' },
		likes: { type: 'integer' },
		subscriptions: { type: 'integer' },
		flagged: { type: 'boolean' },
		removed: { type: 'boolean' },
		createdDate: { type: 'date' },
		updatedDate: { type: 'date' }
	}
});

// Get index mappings for blogs
export const getBlogIndexMapping = () => ({
	properties: {
		title: { type: 'text', analyzer: 'standard' },
		person: { type: 'text' },
		content: { type: 'text', analyzer: 'standard' },
		description: { type: 'text' },
		author: { type: 'text' },
		enneagram: { type: 'keyword' },
		type: { type: 'keyword' },
		url: { type: 'keyword' },
		metaTitle: { type: 'text' },
		socialLinks: {
			type: 'object',
			properties: {
				twitter: { type: 'keyword' },
				instagram: { type: 'keyword' },
				tiktok: { type: 'keyword' },
				wikipedia: { type: 'keyword' }
			}
		},
		published: { type: 'boolean' },
		createdDate: { type: 'date' },
		lastModified: { type: 'date' }
	}
});

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
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}
};
