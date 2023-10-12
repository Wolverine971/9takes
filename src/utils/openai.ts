import { PRIVATE_AI_API_KEY, PRIVATE_DEMO } from '$env/static/private';
import { supabase } from '$lib/supabase';
import { Configuration, OpenAIApi } from 'openai';

export const tagQuestions = async () => {
	try {
		const { data: settingsData, error: settingsDataError } = await supabase
			.from('admin_settings')
			.select('refresh_questions');

		if (settingsDataError) {
			console.log(settingsDataError);
			return;
		}

		if (settingsData && !settingsData[0].refresh_questions) {
			console.log(settingsData[0].refresh_questions);
			return;
		}

		const date = new Date();
		const yesterday = new Date(date.getTime() - 24 * 60 * 60 * 1000).toISOString();
		const { data: questions, error: questionsError } = await supabase
			.from(PRIVATE_DEMO === 'true' ? 'questions_demo' : 'questions')
			.select(`question, id`, { count: 'estimated' })
			.eq('tagged', false)
			.eq('flagged', false)
			.lte('created_at', yesterday);

		if (!questions) {
			return;
		}

		const { data: tags, error: tagsError } = await supabase
			.from('question_tag')
			.select('tag_id, tag_name');
		if (tagsError || questionsError) {
			return;
		}

		const prompt = getMultiQuestionsPrompt(tags.map((e) => e.tag_name).join(', '));
		const questionsToClassify = getTheQuestionsToClassify(questions.map((e) => e.question));

		const configuration = new Configuration({
			organization: 'org-qhR8p39TxOzb3MVePrWE58ld',
			apiKey: PRIVATE_AI_API_KEY
		});

		const openai = new OpenAIApi(configuration);
		const completion = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages: [
				{ role: 'system', content: prompt },
				{ role: 'user', content: questionsToClassify.toString() }
			]
		});

		if (!completion?.data?.choices[0]?.message?.content) {
			return;
		}

		const cleanedTags = JSON.parse(completion.data.choices[0].message.content);
		if (!cleanedTags) {
			return;
		}

		for await (const tag of cleanedTags) {
			const newTags = tag.tags;
			const newTagz = tags.filter((e) => newTags.includes(e.tag_name));

			const newTagIds = newTagz.map((e) => e.tag_id);
			const questionId = questions?.find((e) =>
				e.question.includes(tag.question.slice(1, tag.question.length - 2))
			)?.id;
			if (!questionId) {
				continue;
			}

			if (!newTagz.length) {
				await supabase
					.from('questions')
					.update({ flagged: true, updated_at: new Date() })
					.eq('id', questionId);
				continue;
			}

			newTagIds.forEach(async (tagId) => {
				await supabase.from('question_tags').insert({ question_id: questionId, tag_id: tagId });
			});
			await supabase
				.from('questions')
				.update({ tagged: true, updated_at: new Date(), question_formatted: tag.question })
				.eq('id', questionId);
		}
		const { data: updateSuccess, error: updateFailed } = await supabase
			.from('admin_settings')
			.update({
				refresh_questions: false
			})
			.eq('id', 1);
		console.log(updateFailed);
		return updateSuccess;
	} catch (e) {
		console.log(e);
	}
};

export const tagQuestion = async (questionText: string, questionId: number) => {
	const { data: tags, error: tagsError } = await supabase.from('question_tag').select('tag_id, tag_name');
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

	if (!completion?.data?.choices[0]?.message?.content) {
		return;
	}
	
	const cleanedTags = JSON.parse(completion.data.choices[0].message.content);
	
	if (!cleanedTags) {
		return;
	}

	for await (const tag of cleanedTags) {
		const newTags = tag.tags;
		const newTagz = tags.filter((e) => newTags.includes(e.tag_name));

		const newTagIds = newTagz.map((e) => e.tag_id);
		
		if (!questionId) {
			continue;
		}

		if (!newTagz.length) {
			await supabase
				.from('questions')
				.update({ flagged: true, updated_at: new Date() })
				.eq('id', questionId);
			continue;
		}

		newTagIds.forEach(async (tagId) => {
			await supabase.from('question_tags').insert({ question_id: questionId, tag_id: tagId });
		});
		await supabase
			.from('questions')
			.update({ tagged: true, updated_at: new Date(), question_formatted: tag.question })
			.eq('id', questionId);
	}

	return

};

// I can pull this system prompt dynamically

const classifyOneQuestionPrompt = `You are going to be given either a question or a statement.  Your job is to classify the question or statement and tag it with the applicable predefined tags. A question or statement can have more than one tag. Return the results in an json form with the tags in an array of strings.
For example: [
    {id: 1, question: "I need date ideas What would you do", tags: ["Personal Growth", "Romantic Relationships"]}
 ]
 Only tag from these predefined tags:
 `;

const classifymultipleQuestionsPrompt = `You are going to be given a list of a questions or a statements with ids.  Your job is to classify the questions or statements and tag them with the applicable these predefined tags. A question or statement can have more than one tag. Return the results in an json form with the tags in an array of strings.
 For example: [
    {id: 1, question: "I need date ideas What would you do", tags: ["Personal Growth", "Romantic Relationships"]}
 ]
 Only tag from these predefined tags:
 `;

const getMultiQuestionsPrompt = (tags: string) => {
	return `${classifymultipleQuestionsPrompt} ${tags}`;
};

const getTheQuestionsToClassify = (questionsToClassify: string[]) => {
	let stringLengthLimit = 2000;
	const questionsToSend = [];
	for (let i = 0; i < questionsToClassify.length; i++) {
		stringLengthLimit -= questionsToClassify[i].length;
		if (stringLengthLimit > 0) {
			questionsToSend.push(questionsToClassify[i]);
		}
	}
	return questionsToSend;
	// `${classifymultipleQuestionsPrompt} ${tagsToSend}`;
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
