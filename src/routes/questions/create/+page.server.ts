import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await getServerSession(event);
	if (!session?.user.id) throw redirect(303, '/login');

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

			// export const typeaheadQuery = (
			// 	index: string,
			// 	field: string,
			// 	text: string,
			// 	size: number = 10
			// ) => {
			// 	return {
			// 		index,
			// 		body: {
			// 			query: {
			// 				match_phrase_prefix: {
			// 					[field]: {
			// 						query: text
			// 					}
			// 				}
			// 			}
			// 		},
			// 		size
			// 	};
			// };
			if (demo_time === true) {
				return tempUrl;
			}
			const response = await elasticClient.search(typeaheadQuery('question', 'url', tempUrl, 200));
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
		const { request, locals } = event;

		const demo_time = await checkDemoTime();

		const session = locals.session;

		if (!session?.user?.id) {
			throw error(400, 'unauthorized');
		}

		const body = Object.fromEntries(await request.formData());

		const question = body.question as string;
		const author_id = body.author_id as string;
		const context = body.context as string;
		const url = body.url as string;
		const img_url = body.img_url as string;

		// const session = await getServerSession(event);
		// const canAskQuestion = session.user.id;

		const { data: userExists, error: userError } = await supabase
			.from(demo_time === true ? 'profiles_demo' : 'profiles')
			.select('*')
			.eq('id', author_id)
			.single();

		if (userError || !userExists) {
			throw error(400, 'user not registered');
		}

		if (!userExists.admin) {
			const { data: permissions, error: permissionsError } = await supabase
				.from(demo_time === true ? 'permissions_demo' : 'permissions')
				.select('*')
				.eq('profile_id', author_id);

			if (permissionsError || !permissions[0].can_ask_question) {
				throw error(500, 'user not authorized to ask question');
			}
		}

		let esId = null;
		if (demo_time === false) {
			const resp: any = await createESQuestion(body);
			if (resp._id) {
				esId = resp._id;
			}
		}
		const qData = {
			es_id: esId,
			question: question,
			author_id: author_id,
			context: context,
			url: url,
			img_url: img_url
		};
		const { data: insertedQuestion, error: questionInsertError } = await supabase
			.from(demo_time === true ? 'questions_demo' : 'questions')
			.insert(qData)
			.select();

		if (insertedQuestion?.length && !questionInsertError) {
			tagQuestion(question, insertedQuestion[0].id);

			return insertedQuestion;
		}

		return null;
	}
};

const getUrlString = (unalteredText: string) => {
	console.log('fix this');
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
