import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import { PRIVATE_AI_API_KEY } from '$env/static/private';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	return {
		session: await getServerSession(event)
	};
};

import type { Actions } from './$types';
// import type { RequestHandler } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import { createESQuestion } from '$lib/elasticSearch';
import { error } from '@sveltejs/kit';

export const actions: Actions = {
	getUrl: async ({ request, locals }) => {
		const body = Object.fromEntries(await request.formData());

		const question = body.question as string;

		const tempUrl = getUrlString(question);
		console.log(tempUrl);
		return tempUrl;
	},
	createQuestion: async ({ request, locals }) => {
		const body = Object.fromEntries(await request.formData());

		const question = body.question as string;
		const author_id = body.author_id as string;
		const context = body.context as string;
		const url = body.url as string;
		const img_url = body.img_url as string;

		const { data: userExists, error: userError } = await supabase
			.from('profiles')
			.select('id')
			.eq('id', author_id);

		if (userError || !userExists) {
			throw error(400, 'user not registered');
		}

		// const questionData = {
		// 	question: question,
		// 	author_id: author_id,
		// 	context: context,
		// 	url: url,
		// 	img_url: img_url
		// };

		const resp: any = await createESQuestion(body);
		if (resp._id) {
			const qData = {
				es_id: resp._id,
				question: question,
				author_id: author_id,
				context: context,
				url: url,
				img_url: img_url
			};
			const { data: insertedQuestion, error: questionInsertError } = await supabase
				.from('questions')
				.insert(qData)
				.select();

			if (insertedQuestion?.length && !questionInsertError) {
				// await tagQuestion(question, insertedQuestion[0].id);
				return resp;
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

import { Configuration, OpenAIApi } from 'openai';

const tagQuestion = async (questionText: string, questionId: number) => {
	const configuration = new Configuration({
		organization: 'org-qhR8p39TxOzb3MVePrWE58ld',
		apiKey: PRIVATE_AI_API_KEY
	});
	const openai = new OpenAIApi(configuration);
	const completion = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		messages: [
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: questionText }
		]
	});

	console.log(completion.data.choices[0].message);
	if (!completion.data.choices[0].message) {
		return;
	}
	const cleanedTags = completion.data.choices[0].message.content
		?.split(',')
		.map((t) => {
			return t.trim();
		})
		.filter((e) => e);
	if (!cleanedTags) {
		return;
	}
	const { data: questionTags, error: questionTagsError } = await supabase
		.from('question_tag')
		.select()
		.in('tag_name', cleanedTags);
	if (!questionTags) {
		return;
	}
	for await (const tag of questionTags) {
		await supabase
			.from('question_tags')
			.insert({ question_id: questionId, tag_id: tag.tag_id })
			.select();
	}
};

// I can pull this system prompt dynamically

const systemPrompt = `You are going to be given either a question or a statement.  Your job is to classify the question or statement and tag it with one of these predefined tags. A question or statement can have more than one tag. Return the tags in an array of strings.

'Elections and Voting',
'Political Ideologies',
'Government Systems',
'Diplomacy',
'Pop Culture' ,
'Social Movements',
'Traditions and Customs',
'Immigration and Migration' ,
'Global Economy',
'Trade and Commerce',
'Economic Theories',
'Labor Rights and Unions';
'Software Development',
'Hardware and Devices',
'Emerging Technologies',
'Digital Transformation';
'Scientific Methodology',
'Breakthroughs and Discoveries',
'Scientific Controversies',
'Laboratory Techniques';
'Space Exploration History',
'Theories about the Universe',
'Celestial Bodies',
'Space Agencies and Organizations',
'Personal Growth',
'Daily Routines',
'Personal Challenges',
'Life Events (e.g., weddings, childbirth, bereavement)',
'Diseases and Conditions',
'Medications and Treatments',
'Holistic Health',
'Physical and Mental Disabilities',
'Family and Kinship',
'Romantic Relationships',
'Friendships',
'Professional Relationships',
'Self-Relationship',
'Community and Social Relationships',
'Online and Virtual Relationships',
'Curriculum and Syllabus',
'School Systems Worldwide',
'Higher Education',
'Special Education',
'Skill Acquisition',
'Motivation and Discipline',
'Life Coaching',
'Self-Help Resources';
'Media Critique',
'Art Techniques and Media',
'Entertainment Industry',
'Art History',
'Historical Periods',
'Historical Figures',
'Archaeological Methods',
'Historical Interpretations and Theories';
'Ecosystems and Biodiversity',
'Conservation Efforts',
'Pollution and Waste Management',
'Sustainable Practices',
'Infrastructure Development',
'Transportation Modes and Trends',
'Urban vs. Rural Infrastructure',
'Transportation Safety and Regulations',
'Crop Science',
'Sustainable Farming',
'Food Processing and Preservation',
'Global Food Systems and Trade';
'Constitutional Law',
'International Law',
'Crime and Punishment',
'Legal Procedures and Practices',
'Business Ethics',
'Bioethics',
'Environmental Ethics',
'Moral Philosophies',
'Parenting and Child-rearing',
'Sibling Dynamics',
'Extended Family Relations',
'Generational Differences',
'Family Traditions and Values',
'Dating and Courtship',
'Marriage and Partnerships',
'Relationship Challenges',
'Intimacy and Connection',
'Breakups and Divorce',
'Making and Keeping Friends,
'Friendship Dynamics and Challenges',
'Differences between Acquaintances, Close Friends, and Best Friends',
'Online Friendships vs. In-Person Connections',
'Networking and Building Professional Connections',
'Mentor-Mentee Dynamics',
'Workplace Relationships and Boundaries',
'Navigating Office Politics',
'Self-awareness and Self-understanding',
'Self-care and Self-love',
'Building Self-confidence and Self-worth',
'Engaging with Community and Neighbors',
'Building Social Bonds and Trust',
'Navigating Social Dynamics and Hierarchies',
'Digital Communication Etiquette',
'Building and Maintaining Relationships in the Digital Age',
'Navigating Online Dating and Relationships',
'The Impact of Social Media on Relationships'`;
