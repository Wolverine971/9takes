// src/utils/server/openai.ts
import { logger } from '$lib/utils/logger';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database.types';

import { checkDemoTime } from '../api';
import { SmartLLMService } from './smart-llm-service';

const llmService = new SmartLLMService({
	httpReferer: 'https://9takes.com',
	appName: '9takes LLM'
});

type TaggedQuestion = {
	id?: number | string;
	question?: string;
	question_formatted?: string;
	tags?: string[];
	answers?: Record<string, string>;
	seo_keywords?: string[];
};

type SupabaseQuestion = { id: number; question: string };

const normalizeTaggedResponse = (payload: unknown): TaggedQuestion[] => {
	if (Array.isArray(payload)) {
		return payload.flatMap((item) => normalizeTaggedResponse(item));
	}

	if (payload && typeof payload === 'object') {
		const data = payload as Record<string, unknown>;
		return [
			{
				id: data.id as TaggedQuestion['id'],
				question: typeof data.question === 'string' ? data.question : undefined,
				question_formatted:
					typeof data.question_formatted === 'string' ? data.question_formatted : undefined,
				tags: Array.isArray(data.tags)
					? data.tags.filter((tag): tag is string => typeof tag === 'string')
					: [],
				answers:
					data.answers && typeof data.answers === 'object'
						? Object.fromEntries(
								Object.entries(data.answers as Record<string, unknown>).filter(
									([, value]) => typeof value === 'string'
								)
						  )
						: undefined,
				seo_keywords: Array.isArray(data.seo_keywords)
					? data.seo_keywords.filter((tag): tag is string => typeof tag === 'string')
					: undefined
			}
		];
	}

	return [];
};

const resolveQuestionId = (
	tag: TaggedQuestion,
	questions: SupabaseQuestion[]
): number | undefined => {
	if (typeof tag.id === 'number') {
		return tag.id;
	}
	if (typeof tag.id === 'string' && !Number.isNaN(Number(tag.id))) {
		return Number(tag.id);
	}

	const candidate = tag.question_formatted || tag.question;
	if (!candidate) return undefined;

	const normalized = candidate.trim().toLowerCase();
	const match = questions.find(
		(q) =>
			q.question.trim().toLowerCase() === normalized ||
			normalized.includes(q.question.trim().toLowerCase()) ||
			q.question.trim().toLowerCase().includes(normalized)
	);

	return match?.id;
};

const getLLMTags = (tag: TaggedQuestion): string[] =>
	Array.isArray(tag.tags)
		? tag.tags.filter((tagName): tagName is string => typeof tagName === 'string')
		: [];

const normalizeAnswers = (answers: unknown): Record<string, string> | null => {
	if (!answers || typeof answers !== 'object') return null;
	const filtered = Object.entries(answers as Record<string, unknown>).filter(
		([type, value]) => typeof type === 'string' && typeof value === 'string'
	);
	return filtered.length ? (Object.fromEntries(filtered) as Record<string, string>) : null;
};

const getTheQuestionsToClassify = (questionsToClassify: SupabaseQuestion[]) => {
	let stringLengthLimit = 2000;
	const questionsToSend: SupabaseQuestion[] = [];
	for (const question of questionsToClassify) {
		stringLengthLimit -= question.question.length;
		if (stringLengthLimit > 0) {
			questionsToSend.push(question);
		} else {
			break;
		}
	}
	return questionsToSend;
};

export const tagQuestions = async (supabase: SupabaseClient<Database>) => {
	try {
		const demo_time = await checkDemoTime(supabase);

		const { data: ableToRefreshQuestions, error: settingsDataError } = await supabase
			.from('admin_settings')
			.select('value')
			.eq('type', 'refresh_questions');

		if (settingsDataError) {
			logger.warn('Failed to read admin_settings for refresh flag', settingsDataError);
			return;
		}

		if (ableToRefreshQuestions) {
			return;
		}

		const date = new Date();
		const yesterday = new Date(date.getTime() - 24 * 60 * 60 * 1000).toISOString();
		const { data: questions, error: questionsError } = await supabase
			.from(demo_time === true ? 'questions_demo' : 'questions')
			.select(`question, id`, { count: 'estimated' })
			.eq('tagged', false)
			.eq('flagged', false)
			.eq('removed', false)
			.lte('created_at', yesterday);

		if (!questions) {
			return;
		}

		const { data: tags, error: tagsError } = await supabase
			.from('question_categories')
			.select('id, category_name');
		if (tagsError || questionsError) {
			logger.warn('Failed to load tags or questions for tagging', {
				tagsError,
				questionsError
			});
			return;
		}

		const prompt = getMultiQuestionsPrompt(tags.map((e) => e.category_name).join(', '));
		const questionsToClassify = getTheQuestionsToClassify(
			questions.map((question) => ({ id: question.id, question: question.question }))
		);

		if (!questionsToClassify.length) {
			logger.info('No untagged questions ready for classification');
			return;
		}

		const llmResult = await llmService.getJSONResponse<TaggedQuestion[] | TaggedQuestion>({
			systemPrompt: prompt,
			userPrompt: JSON.stringify(questionsToClassify),
			profile: 'balanced',
			temperature: 0.2,
			validation: { retryOnParseError: true, maxRetries: 2 },
			operationType: 'bulk_question_tagging'
		});

		const cleanedTags = normalizeTaggedResponse(llmResult);
		if (!cleanedTags.length) {
			logger.warn('LLM returned no tagging data for questions');
			return;
		}

		for await (const tag of cleanedTags) {
			const llmTags = getLLMTags(tag);
			const matchedTags = tags.filter((existing) => llmTags.includes(existing.category_name));
			const questionId = resolveQuestionId(tag, questions);
			const formattedQuestion =
				tag.question_formatted ||
				tag.question ||
				questions.find((question) => question.id === questionId)?.question;

			if (!questionId) {
				logger.warn('Could not map LLM response to a question id', { tag });
				continue;
			}

			if (!matchedTags.length) {
				await supabase
					.from(demo_time === true ? 'questions_demo' : 'questions')
					.update({ flagged: true, updated_at: new Date() })
					.eq('id', questionId);
				continue;
			}

			const newTagIds = matchedTags.map((e) => e.id);

			await Promise.all(
				newTagIds.map((tagId) =>
					supabase.from('question_category_tags').insert({ question_id: questionId, tag_id: tagId })
				)
			);

			await supabase
				.from(demo_time === true ? 'questions_demo' : 'questions')
				.update({
					tagged: true,
					updated_at: new Date(),
					question_formatted: formattedQuestion
				})
				.eq('id', questionId);
		}

		const { data: updateSuccess, error: updateFailed } = await supabase
			.from('admin_settings')
			.update({ value: false })
			.eq('type', 'refresh_questions');

		if (updateFailed) {
			logger.error('Failed to update refresh_questions flag', updateFailed);
		}
		return updateSuccess;
	} catch (e) {
		logger.error('Tag questions failed', e as Error);
	}
};

export const tagQuestion = async (
	supabase: SupabaseClient<Database>,
	questionText: string,
	questionId: number
) => {
	try {
		const demo_time = await checkDemoTime(supabase);
		const { data: tags, error: tagsError } = await supabase
			.from('question_categories')
			.select('id, category_name')
			.eq('level', 3);
		if (tagsError) {
			logger.warn('Failed to load tags for tagging question', tagsError);
			return;
		}

		const llmResponse = await llmService.getJSONResponse<TaggedQuestion[] | TaggedQuestion>({
			systemPrompt: getPrompt(tags.map((e) => e.category_name)),
			userPrompt: JSON.stringify({ id: questionId, question: questionText }),
			profile: 'balanced',
			temperature: 0.2,
			validation: { retryOnParseError: true, maxRetries: 2 },
			operationType: 'single_question_tagging'
		});

		const [chatResp] = normalizeTaggedResponse(llmResponse);
		const answers = normalizeAnswers(chatResp?.answers);

		if (!chatResp || !answers) {
			logger.warn('LLM tagging missing answers payload', { chatResp, questionId });
			return;
		}

		const matchedTags = tags.filter((tag) => getLLMTags(chatResp).includes(tag.category_name));
		const questionTable = demo_time === true ? 'questions_demo' : 'questions';
		const formattedQuestion = chatResp.question_formatted || chatResp.question || questionText;

		await supabase
			.from(questionTable)
			.update({
				tagged: true,
				updated_at: new Date(),
				question_formatted: formattedQuestion
			})
			.eq('id', questionId);

		if (!matchedTags.length) {
			await supabase
				.from(questionTable)
				.update({ flagged: true, updated_at: new Date() })
				.eq('id', questionId);
		} else {
			await Promise.all(
				matchedTags.map((tag) =>
					supabase.from('question_category_tags').insert({
						question_id: questionId,
						tag_id: tag.id
					})
				)
			);
		}

		for await (const [type, answerText] of Object.entries(answers)) {
			await supabase
				.from(demo_time === true ? 'comments_ai_demo' : 'comments_ai')
				.insert({ enneagram_type: type, comment: answerText, question_id: questionId });
		}

		if (chatResp.seo_keywords?.length) {
			await supabase
				.from('question_keywords')
				.insert({ keywords: chatResp.seo_keywords, question_id: questionId });
		}
	} catch (e) {
		logger.error('Tag question failed', e as Error, { questionId });
	}
};

// I can pull this system prompt dynamically

export const classifyOneQuestionPrompt2 = `You are an Enneagram expert and can easily get inside the mindset of each personality type. You are going to be given a question or a statement. Your job is to do 3 tasks and return a formatted json response. 
1st, use the Enneagram system of personality to respond to the question or statement in each of the voices of the 9 different Enneagram types. You should consider the premise of the question and how each enneagram type would approach and answer the question.
Your response should be conversational and you should approach the question like the Enneagram type. 

2nd, classify the question or statement and tag it with the applicable predefined tags. A question or statement can have more than one tag. Return the results in json form with the tags in an array of strings.
3rd, format the question and add punctuation.
For example: [
    {id: 1, question: "I need date ideas What would you do", question_formatted: "I need date ideas, what would you do?", tags: ["Personal Growth", "Romantic Relationships"], answers: [{1: "A thoughtfully planned date that aligns with your shared values is ideal. Perhaps a museum visit, volunteering together, or dining at a reputable restaurant. The key is to be respectful, authentic, and create a meaningful connection."}, {2: "...."} ...]}
 ]
 Only tag from these predefined tags:
 `;

const classifyOneQuestionPrompt = `You are an Enneagram expert and can easily get inside the mindset of different personality types. You are going to be given a question or a statement. Your job is to do 4 tasks and return a formatted json response. 
1st, use the Enneagram system of personality to respond to the question or statement in each of the voices of the 9 different Enneagram types. You should consider the premise of the question and how each enneagram type would approach and answer the question.
Your response should be conversational and should go into detail depending on how the Enneagram type would likely respond.
2nd, classify the question or statement and tag it with the applicable predefined tags. A question or statement can have more than one tag. Return the results in json form with the tags in an array of strings.
3rd, format the question and add punctuation.
4th, create between 3-5 SEO keywords or phrases that would be relevant to the question or statement.
 
 Format the Response in VALID JSON like the following example:
 [
	{
	  id: 1,
	  question: "I need date ideas What would you do",
	  question_formatted: "I need date ideas, what would you do?",
	  tags: [
		"Personal Growth", "Romantic Relationships"
	  ],
	  answers: {
		  "1": "...",
		  "2": "...",
		  ...
		},
	  ],
	  seo_keywords: ["date ideas", "romantic date ideas", "fun date ideas"]
	},
  ]

  Vary up the response length depending on how the Enneagram type would likely respond.

Classify the Question or Statement:
Tag the question or statement with applicable predefined tags.
A question or statement can be associated with multiple tags.
Only tag from these predefined tags:
`;

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
