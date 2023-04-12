import { getServerSession } from '@supabase/auth-helpers-sveltekit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	return {
		session: await getServerSession(event)
	};
};

import type { Actions } from './$types';
// import type { RequestHandler } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import { createQuestion } from '$lib/elasticSearch';

export const actions: Actions = {
	getUrl: async ({ request, locals }) => {
		const body = Object.fromEntries(await request.formData());

		const question = body.question as string;

		const tempUrl = getUrlString(question);
		console.log(tempUrl);
		return tempUrl;
	},
	createQuestion: async (event) => {
		const { request, locals } = event;
		const body = Object.fromEntries(await request.formData());

		const question = body.question as string;
		const author_id = body.author_id as string;
		const context = body.context as string;
		const url = body.url as string;
		const img_url = body.img_url as string;

		// const questionData = {
		// 	question: question,
		// 	author_id: author_id,
		// 	context: context,
		// 	url: url,
		// 	img_url: img_url
		// };

		const resp: any = await createQuestion(body);
		if (resp._id) {
			const qData = {
				es_id: resp._id,
				question: question,
				author_id: author_id,
				context: context,
				url: url,
				img_url: img_url
			};
			const success = await supabase.from('questions').insert(qData);

			if (resp?.data && success) {
				return resp.data;
			}
		}
		return null;
	}
};

const getUrlString = (unalteredText: string) => {
	console.log(unalteredText);
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
