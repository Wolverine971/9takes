import { Configuration, OpenAIApi } from 'openai';

import { supabase } from '$lib/supabase';

import { PRIVATE_AI_API_KEY, PRIVATE_DEMO } from '$env/static/private';

export const tagQuestions = async () => {
	try {
		const { data: settingsData, error: settingsDataError } = await supabase
			.from('admin_settings')
			.select('refresh_questions');

		if (settingsData && !settingsData[0].refresh_questions) {
			console.log(settingsData[0].refresh_questions);
			return;
		}

		if (settingsData) {
			console.log(settingsData[0]?.refresh_questions);
		}
		const {
			data: questions,
			error: questionsError,
			count: questionCount
		} = await supabase
			.from(PRIVATE_DEMO === 'true' ? 'questions_demo' : 'questions')
			.select(`question, id`, { count: 'estimated' })
			.eq('tagged', null);

		const { data: tags, error: tagsError } = await supabase.from('question_tag').select('tag_name');
		if (tagsError || questionsError) {
			return;
		}

		console.log(questions);

		console.log(getMultiQuestionsPrompt(tags.map((e) => e.tag_name)));

		// const configuration = new Configuration({
		// 	organization: 'org-qhR8p39TxOzb3MVePrWE58ld',
		// 	apiKey: PRIVATE_AI_API_KEY
		// });

		// const openai = new OpenAIApi(configuration);
		// const completion = await openai.createChatCompletion({
		// 	model: 'gpt-3.5-turbo',
		// 	messages: [
		// 		{ role: 'system', content: getMultiQuestionsPrompt(tags.map((e) => e.tag_name)) },
		// 		{ role: 'user', content: questions }
		// 	]
		// });

		// console.log(completion.data.choices[0].message);
		// if (!completion.data.choices[0].message) {
		// 	return;
		// }

		// const cleanedTags = completion.data.choices[0].message.content
		// 	?.split(',')
		// 	.map((t) => {
		// 		return t.trim();
		// 	})
		// 	.filter((e) => e);
		// if (!cleanedTags) {
		// 	return;
		// }
		// const { data: questionTags, error: questionTagsError } = await supabase
		// 	.from('question_tag')
		// 	.select()
		// 	.in('tag_name', cleanedTags);
		// if (!questionTags) {
		// 	return;
		// }
		// for await (const tag of questionTags) {
		// 	await supabase
		// 		.from('question_tags')
		// 		.insert({ question_id: questionId, tag_id: tag.tag_id })
		// 		.select();
		// }
		const { data: updateSuccess, error: updateFailed } = await supabase
			.from('admin_settings')
			.update({
				refresh_questions: false
			})
			.eq('id', 1);
		console.log(updateFailed);
	} catch (e) {
		console.log(e);
	}
};

export const tagQuestion = async (questionText: string, questionId: number) => {
	const { data: tags, error: tagsError } = await supabase.from('question_tag').select('tag_name');
	if (tagsError) {
		return;
	}

	const configuration = new Configuration({
		organization: 'org-qhR8p39TxOzb3MVePrWE58ld',
		apiKey: PRIVATE_AI_API_KEY
	});

	const openai = new OpenAIApi(configuration);
	const completion = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		messages: [
			{ role: 'system', content: getPrompt(tags.map((e) => e.tag_name)) },
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

	if (questionTagsError) {
		console.log(questionTagsError);
	}
	if (!questionTags?.length) {
		return;
	}

	for await (const tag of questionTags) {
		await supabase
			.from(PRIVATE_DEMO === 'true' ? 'question_tags_demo' : 'question_tags')
			.insert({ question_id: questionId, tag_id: tag.tag_id })
			.select();
	}
};

// I can pull this system prompt dynamically

const classifyOneQuestionPrompt = `You are going to be given either a question or a statement.  Your job is to classify the question or statement and tag it with the applicable predefined tags. A question or statement can have more than one tag. Return the tags in an array of strings.
 These are the tags:
 `;

const classifymultipleQuestionsPrompt = `You are going to be given a list of a questions or a statements with ids.  Your job is to classify the questions or statements and tag them with the applicable these predefined tags. A question or statement can have more than one tag. Return the results in an json form with the tags in an array of strings.
 For example: [
    {id: 1, question: "I need date ideas What would you do", tags: ["Personal Growth", "Romantic Relationships"]}
 ]
 These are the tags:
 `;

const getMultiQuestionsPrompt = (tags: string[]) => {
	return `${classifymultipleQuestionsPrompt} ${tags}`;
};

const getPrompt = (tags: string[]) => {
	return `${classifyOneQuestionPrompt} ${tags}`;
};

// 'Elections and Voting',
// 'Political Ideologies',
// 'Government Systems',
// 'Diplomacy',
// 'Pop Culture' ,
// 'Social Movements',
// 'Traditions and Customs',
// 'Immigration and Migration' ,
// 'Global Economy',
// 'Trade and Commerce',
// 'Economic Theories',
// 'Labor Rights and Unions';
// 'Software Development',
// 'Hardware and Devices',
// 'Emerging Technologies',
// 'Digital Transformation';
// 'Scientific Methodology',
// 'Breakthroughs and Discoveries',
// 'Scientific Controversies',
// 'Laboratory Techniques';
// 'Space Exploration History',
// 'Theories about the Universe',
// 'Celestial Bodies',
// 'Space Agencies and Organizations',
// 'Personal Growth',
// 'Daily Routines',
// 'Personal Challenges',
// 'Life Events (e.g., weddings, childbirth, bereavement)',
// 'Diseases and Conditions',
// 'Medications and Treatments',
// 'Holistic Health',
// 'Physical and Mental Disabilities',
// 'Family and Kinship',
// 'Romantic Relationships',
// 'Friendships',
// 'Professional Relationships',
// 'Self-Relationship',
// 'Community and Social Relationships',
// 'Online and Virtual Relationships',
// 'Curriculum and Syllabus',
// 'School Systems Worldwide',
// 'Higher Education',
// 'Special Education',
// 'Skill Acquisition',
// 'Motivation and Discipline',
// 'Life Coaching',
// 'Self-Help Resources';
// 'Media Critique',
// 'Art Techniques and Media',
// 'Entertainment Industry',
// 'Art History',
// 'Historical Periods',
// 'Historical Figures',
// 'Archaeological Methods',
// 'Historical Interpretations and Theories';
// 'Ecosystems and Biodiversity',
// 'Conservation Efforts',
// 'Pollution and Waste Management',
// 'Sustainable Practices',
// 'Infrastructure Development',
// 'Transportation Modes and Trends',
// 'Urban vs. Rural Infrastructure',
// 'Transportation Safety and Regulations',
// 'Crop Science',
// 'Sustainable Farming',
// 'Food Processing and Preservation',
// 'Global Food Systems and Trade';
// 'Constitutional Law',
// 'International Law',
// 'Crime and Punishment',
// 'Legal Procedures and Practices',
// 'Business Ethics',
// 'Bioethics',
// 'Environmental Ethics',
// 'Moral Philosophies',
// 'Parenting and Child-rearing',
// 'Sibling Dynamics',
// 'Extended Family Relations',
// 'Generational Differences',
// 'Family Traditions and Values',
// 'Dating and Courtship',
// 'Marriage and Partnerships',
// 'Relationship Challenges',
// 'Intimacy and Connection',
// 'Breakups and Divorce',
// 'Making and Keeping Friends,
// 'Friendship Dynamics and Challenges',
// 'Differences between Acquaintances, Close Friends, and Best Friends',
// 'Online Friendships vs. In-Person Connections',
// 'Networking and Building Professional Connections',
// 'Mentor-Mentee Dynamics',
// 'Workplace Relationships and Boundaries',
// 'Navigating Office Politics',
// 'Self-awareness and Self-understanding',
// 'Self-care and Self-love',
// 'Building Self-confidence and Self-worth',
// 'Engaging with Community and Neighbors',
// 'Building Social Bonds and Trust',
// 'Navigating Social Dynamics and Hierarchies',
// 'Digital Communication Etiquette',
// 'Building and Maintaining Relationships in the Digital Age',
// 'Navigating Online Dating and Relationships',
// 'The Impact of Social Media on Relationships'
