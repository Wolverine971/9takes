import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	PRIVATE_S3_BUCKET,
	PRIVATE_S3_ACCESS_KEY_ID,
	PRIVATE_S3_SECRET_ACCESS_KEY
} from '$env/static/private';
import { v4 as uuidv4 } from 'uuid';
import S3 from 'aws-sdk/clients/s3.js';

export const load: PageServerLoad = async (event) => {
	const session = event.locals.session;
	if (!session?.user?.id) throw redirect(303, '/login');

	return {
		session: session
	};
};

import type { Actions } from './$types';
// import type { RequestHandler } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import { createESQuestion } from '$lib/elasticSearch';
import { error } from '@sveltejs/kit';
import { tagQuestion } from '../../../utils/openai';
import { typeaheadQuery } from '../../../utils/elasticSearch';

import { elasticClient } from '$lib/elasticSearch';
import { checkDemoTime } from '../../../utils/api';
import { mapDemoValues } from '../../../utils/demo';

export const actions: Actions = {
	getUrl: async ({ request, locals }) => {
		try {
			const session = locals.session;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}

			const demo_time = await checkDemoTime();

			const body = Object.fromEntries(await request.formData());

			const question = body.question as string;
			const tempUrl = getUrlString(question);

			if (demo_time === true) {
				return tempUrl;
			}
			const response = await elasticClient.search(
				typeaheadQuery({ index: 'question', field: 'url', text: tempUrl, size: 200 })
			);
			if (response.hits.hits.length) {
				return `${tempUrl}-${response.hits.hits.length}`;
				// res.json({ url: `${tempUrl}-${response.hits.hits.length}` });
			} else {
				return tempUrl;
			}

			// const response = await client.search(typeaheadQuery('question', 'url', tempUrl, 200));

			// if (response.hits.hits.length) {
			// 	res.json({ url: `${tempUrl}-${response.hits.hits.length}` });
			// } else {
			// 	res.json({ url: tempUrl });
			// }
			// console.log(tempUrl);
			// return tempUrl;
		} catch (e) {
			console.log(e);
		}
	},
	createQuestion: async (event) => {
		const MAX_FORM_SIZE = 10 * 1024 * 1024; // 10MB limit
		let formData;

		try {
			const { request, locals } = event;

			// Add timeout for formData parsing
			const formDataPromise = request.formData();
			const timeoutPromise = new Promise((_, reject) => {
				setTimeout(() => reject(new Error('FormData parsing timeout')), 30000); // 30 second timeout
			});

			try {
				formData = await Promise.race([formDataPromise, timeoutPromise]);
			} catch (e) {
				console.error('FormData parsing error:', e);
				throw error(400, {
					message: 'Failed to parse form data - request may be too large or malformed'
				});
			}

			// Check content length
			const contentLength = request.headers.get('content-length');
			if (contentLength && parseInt(contentLength) > MAX_FORM_SIZE) {
				throw error(413, {
					message: 'Request entity too large'
				});
			}

			const demo_time = await checkDemoTime();
			const session = locals.session;

			if (!session?.user?.id) {
				throw error(401, {
					message: 'Unauthorized'
				});
			}

			// Convert FormData to object with validation
			const body: Record<string, string> = {};
			for (const [key, value] of formData.entries()) {
				if (typeof value !== 'string') {
					throw error(400, {
						message: `Invalid value for field: ${key}`
					});
				}
				body[key] = value;
			}

			// Validate required fields
			const requiredFields = ['question', 'author_id', 'url', 'img_url'];
			for (const field of requiredFields) {
				if (!body[field]) {
					throw error(400, {
						message: `Missing required field: ${field}`
					});
				}
			}

			const { question, author_id, context, url, img_url } = body;

			// Validate image data
			if (!img_url.startsWith('data:image/')) {
				throw error(400, {
					message: 'Invalid image format'
				});
			}

			const Key = uuidv4();

			// Upload image to S3
			try {
				const base64Data = img_url.replace(/^data:image\/\w+;base64,/, '');
				const buf = Buffer.from(base64Data, 'base64');

				// Validate image size
				if (buf.length > MAX_FORM_SIZE) {
					throw error(413, {
						message: 'Image file too large'
					});
				}

				const s3 = new S3({
					accessKeyId: PRIVATE_S3_ACCESS_KEY_ID,
					secretAccessKey: PRIVATE_S3_SECRET_ACCESS_KEY,
					region: 'us-east-1'
				});

				await s3
					.putObject({
						Bucket: PRIVATE_S3_BUCKET as string,
						Key,
						Body: buf,
						ContentEncoding: 'base64',
						ContentType: 'image/jpeg',
						ACL: 'public-read'
					})
					.promise();
			} catch (err) {
				console.error('S3 upload error:', err);
				throw error(500, {
					message: 'Failed to upload image'
				});
			}

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

			// Create question in ElasticSearch if not in demo mode
			let esId = null;
			if (!demo_time) {
				try {
					const resp: any = await createESQuestion(body);
					if (resp?._id) {
						esId = resp._id;
					}
				} catch (err) {
					console.error('ElasticSearch error:', err);
					// Continue without ES if it fails
				}
			}

			// Insert question into database
			const qData = {
				es_id: esId,
				question,
				author_id,
				context,
				url,
				img_url: Key
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
				await tagQuestion(question, insertedQuestion[0].id);
				return mapDemoValues(insertedQuestion);
			}

			return { success: true };
		} catch (e) {
			console.error('Create question error:', e);
			throw error(500, {
				message: e.message || 'Internal server error'
			});
		}
	}
};

const getUrlString = (unalteredText: string) => {
	console.log('fix this'); // idk what is the problem, there may not be a problem
	const text = unalteredText.trim();
	let url = '';
	const leftOver = removeStopwords(text.split(' '));
	if (leftOver && leftOver.length && leftOver.length <= 3) {
		// if there is less than 3 key words keep the whole string up to the last key word
		const lastWord = leftOver[leftOver.length - 1];
		const index = text.indexOf(lastWord);
		url = text
			.substring(0, index + lastWord.length)
			.split(' ')
			.join('-')
			.toLowerCase();
	} else {
		url = leftOver.join('-').toLowerCase();
	}
	if (!url) {
		return text.split(' ').join('-');
	}
	return url;
};

const removeStopwords = function (tokens: string[]) {
	const stopwords = eng;
	if (typeof tokens !== 'object' || typeof stopwords !== 'object') {
		throw new Error('expected Arrays try: removeStopwords(Array[, Array])');
	}
	return tokens.filter(function (value) {
		return stopwords.indexOf(value.toLowerCase()) === -1;
	});
};

const eng = [
	'about',
	'after',
	'all',
	'also',
	'am',
	'an',
	'and',
	'another',
	'any',
	'are',
	'as',
	'at',
	'be',
	'because',
	'been',
	'before',
	'being',
	'between',
	'both',
	'but',
	'by',
	'came',
	'can',
	'come',
	'could',
	'did',
	'do',
	'each',
	'for',
	'from',
	'get',
	'got',
	'has',
	'had',
	'he',
	'have',
	'her',
	'here',
	'him',
	'himself',
	'his',
	'how',
	'if',
	'in',
	'into',
	'is',
	'it',
	'like',
	'make',
	'many',
	'me',
	'might',
	'more',
	'most',
	'much',
	'must',
	'my',
	'never',
	'now',
	'of',
	'on',
	'only',
	'or',
	'other',
	'our',
	'out',
	'over',
	'said',
	'same',
	'should',
	'since',
	'some',
	'still',
	'such',
	'take',
	'than',
	'that',
	'the',
	'their',
	'them',
	'then',
	'there',
	'these',
	'they',
	'this',
	'those',
	'through',
	'to',
	'too',
	'under',
	'up',
	'very',
	'was',
	'way',
	'we',
	'well',
	'were',
	'what',
	'where',
	'which',
	'while',
	'who',
	'with',
	'would',
	'you',
	'your',
	'a',
	'i'
];
