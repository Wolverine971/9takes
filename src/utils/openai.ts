import { PRIVATE_AI_API_KEY } from '$env/static/private';
import { supabase } from '$lib/supabase';
import { Configuration, OpenAIApi } from 'openai';
import { checkDemoTime } from './api';

export const tagQuestions = async () => {
	try {
		const demo_time = await checkDemoTime();

		const { data: ableToRefreshQuestions, error: settingsDataError } = await supabase
			.from('admin_settings')
			.select('value')
			.eq('type', 'refresh_questions');

		if (settingsDataError) {
			console.log(settingsDataError);
			return;
		}

		if (ableToRefreshQuestions) {
			console.log(ableToRefreshQuestions[0]);
			return;
		}

		const date = new Date();
		const yesterday = new Date(date.getTime() - 24 * 60 * 60 * 1000).toISOString();
		const { data: questions, error: questionsError } = await supabase
			.from(demo_time === true ? 'questions_demo' : 'questions')
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
			.update({ value: false })
			.eq('type', 'refresh_questions');

		if (updateFailed) {
			console.log(updateFailed);
		}
		return updateSuccess;
	} catch (e) {
		console.log(e);
	}
};

export const tagQuestion = async (questionText: string, questionId: number) => {
	const { data: tags, error: tagsError } = await supabase
		.from('question_tag')
		.select('tag_id, tag_name');
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

	if (!cleanedTags?.length) {
		return;
	}

	await supabase
		.from('questions')
		.update({ tagged: true, updated_at: new Date(), question_formatted: cleanedTags[0].question })
		.eq('id', questionId).then(async () => {

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
				} else {

					newTagIds.forEach(async (tagId) => {
						await supabase.from('question_tags').insert({ question_id: questionId, tag_id: tagId });
					});
				}
			}

			// update ai comments
			if (cleanedTags?.[0]?.answers?.length) {
				for await (const answer of cleanedTags[0].answers) {
					const type = Object.keys(answer)[0];
					const answerText = Object.values(answer)[0];
					if (type && answerText) {
						await supabase
							.from('comments_ai')
							.insert({ enneagram_type: type, comment: answerText, question_id: questionId })
					}
				}
			}
		})

	return;
};

// I can pull this system prompt dynamically

export const classifyOneQuestionPrompt2 = `You are going to be given a question or a statement.  Your job is to do two things and return a json response. 
First, you should should use the Enneagram system of personality to answer or respond to the question or statement in 9 different ways that correlate to the 9 different Enneagram types. 
The way in which you answer the questions should be conversational as if a real person were answering the question or statement but it should take into account how different enneagram personalities would approach and respond. 

Second, you need to classify the question or statement and tag it with the applicable predefined tags. A question or statement can have more than one tag. Return the results in json form with the tags in an array of strings.
For example: [
    {id: 1, question: "I need date ideas What would you do", tags: ["Personal Growth", "Romantic Relationships"], answers: [{1: "I would go to the movies"}, {2: "I would go to the park"} ...]}
 ]
 Only tag from these predefined tags:
 `;

const classifyOneQuestionPrompt = `Your task involves two main components: responding to a question or statement using the Enneagram personality system and classifying the question or statement with predefined tags. The response should be formatted in JSON.

 Detailed Instructions:
 
 Receive a Question or Statement: You will be given a question or a statement.
 
 Respond Using the Enneagram System:
 Use the Enneagram system of personality to craft 9 distinct responses.
 Each response should correspond to one of the 9 Enneagram types.
 Your answers should be conversational, as if a real person of each Enneagram type is responding.
 Ensure that each response reflects how different Enneagram personalities might approach and answer the question or statement.
 But be causal and unique for each Enneagram Type and do not mention the Enneagram in the response.
 
 
 
 Format the Response in VALID JSON:
 Structure your response as a JSON array.
 Include an identifier for each question/statement, the tags, and the Enneagram-based answers.
 For Example:
 [
    {
        "id": 1,
        "question": "I need date ideas. What would you do?",
        "tags": ["Personal Growth", "Romantic Relationships"],
        "answers": [
            {"1": "I would organize a volunteering date to help others."},
            {"2": "I'd plan a romantic dinner at home."},
            ...
            {"9": "A quiet evening walk would be nice."}
        ]
    }
]

Classify the Question or Statement:
Tag the question or statement with applicable predefined tags.
 A question or statement can be associated with multiple tags.

`





const classifymultipleQuestionsPrompt = `You are going to be given a list of a questions or a statements with ids.  Your job is to do two things.
First, you should use the Enneagram system of personality answer or respond to the question or statement in 9 different ways that correlate to the 9 different Enneagram types. 
The way in which you answer the questions should be conversational as if a real person were answering the question or statement but it should take into account how different enneagram personalities would approach and respond. 

Second, you need to classify the questions or statements and tag them with the applicable predefined tags. A question or statement can have more than one tag. Return the results in json form with the tags in an array of strings.
 For example: [
    {id: 1, question: "I need date ideas What would you do", tags: ["Personal Growth", "Romantic Relationships"],answers: [{1: "I would go to the movies"}, {2: "I would go to the park"} ...]}
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


// [
// 	{
// 		id: 1,
// 		question: "When is the longest you have stayed awake on a project you were passionate about",
// 		tags: [
// 			"Personal Growth",
// 		],
// 		answers: [
// 			{
// 				"1": "As a Type 1, I strive for perfection and can get caught up in details. When working on a project I'm passionate about, I have stayed awake for several nights in a row, making sure everything is flawless and meets my high standards.",
// 			},
// 			{
// 				"2": "As a Type 2, I prioritize the needs of others over my own. If I'm passionate about a project, I might stay awake late into the night to provide support and help others involved in the project. Their success is important to me.",
// 			},
// 			{
// 				"3": "As a Type 3, I am driven by success and recognition. If I'm passionate about a project, I'll stay awake for as long as it takes to achieve my goals and make a name for myself. I want to be the best in what I do.",
// 			},
// 			{
// 				"4": "As a Type 4, I'm deeply connected to my emotions. When working on a project I'm passionate about, I might stay awake late into the night to dive into my inner world and channel my profound emotions into my work.",
// 			},
// 			{
// 				"5": "As a Type 5, I value knowledge and intellectual pursuits. If I'm passionate about a project, I might stay awake for long hours to immerse myself in research and gather as much information as possible to make it a success.",
// 			},
// 			{
// 				"6": "As a Type 6, I am a loyal and committed person. If I'm passionate about a project, I might stay awake to ensure everything is secure and prepared for any potential risks or challenges. I want to be well-prepared.",
// 			},
// 			{
// 				"7": "As a Type 7, I seek new experiences and avoid pain or boredom. If I'm passionate about a project, I might stay awake late into the night out of excitement and to explore every possibility and potential that the project offers.",
// 			},
// 			{
// 				"8": "As a Type 8, I am determined and focused on control. If I'm passionate about a project, I might stay awake to exert my power and drive it forward. I want to ensure that everything goes according to my vision and objectives.",
// 			},
// 			{
// 				"9": "As a Type 9, I value peace and harmony. If I'm passionate about a project, I might stay awake to mediate conflicts and ensure that everyone's opinions and needs are considered. I want to create a harmonious environment.",
// 			},
// 		],
// 	},
// ]