// import type { error, redirect } from '@supabase/supabase-js';
import { error, redirect } from '@sveltejs/kit';
import { deleteESQuestion, elasticClient } from '$lib/elasticSearch';
import { supabase } from '$lib/supabase';

import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { checkDemoTime } from '../../utils/api';
import { mapDemoValues } from '../../utils/demo';

export const load: PageServerLoad = async (event) => {
	try {
		const { demo_time } = await event.parent();
		const session = event.locals.session;

		let canAskQuestion = false;

		if (session?.user?.id) {
			const { data: questions, error: questionsError } = await supabase
				.from(demo_time === true ? 'questions_demo' : 'questions')
				.select('*')
				.eq('author_id', session?.user?.id)
				.gte('created_at', new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString())
				.limit(10);

			if (questionsError) {
				console.log(questionsError);
			}
			if (questions && questions?.length <= 10) {
				canAskQuestion = true;
			}
		}

		const { data: uniquetags, error: tagsError } = await supabase
			.from(demo_time === true ? 'distinct_question_tags_demo' : 'distinct_question_tags')
			.select();

		if (tagsError) {
			console.log(tagsError);
		}

		const tags = uniquetags?.map((t) => {
			return t.tag_id;
		});
		if (!tags) {
			return {
				subcategoryTags: [],
				allTags: [],
				questionSubcategories: [],
				questionsAndTags: [],
				canAskQuestion
			};
		}

		const { data: subcategoryTags, error: subcategoryTagsError } = await supabase
			.from('question_tag')
			.select(`*, question_subcategories(*, question_subcategories(*))`)
			.in('tag_id', tags);

		if (subcategoryTagsError) {
			throw error(500, {
				message: 'Error finding questions'
			});
		}

		const { data: questionsAndTags, error: findQuestionsError } = await supabase.rpc(
			'get_10_question_tags',
			{}
		);

		if (findQuestionsError) {
			console.log(findQuestionsError);
		}

		const { data: allTags, error: allTagsError } = await supabase
			.from('question_tag')
			.select(`*, question_subcategories(*, question_subcategories(*))`);

		if (allTagsError) {
			console.log(allTagsError);
		}

		const { data: questionSubcategories, error: questionSubcategoriesError } = await supabase
			.from('question_subcategories')
			.select(`*, question_subcategories(*, question_subcategories(*))`);

		if (questionSubcategoriesError) {
			console.log(questionSubcategoriesError);
		}

		if (demo_time === true) {
			return {
				session,
				subcategoryTags,
				allTags,
				questionSubcategories,
				canAskQuestion,
				questionsAndTags: mapDemoValues(questionsAndTags).filter((q) => {
					return !q.removed;
				})
			};
		}
		return {
			session,
			subcategoryTags,
			allTags,
			questionSubcategories,
			canAskQuestion,
			questionsAndTags: (questionsAndTags || []).filter((q) => {
				return !q.removed;
			})
		};
	} catch (e) {
		console.log(e);
		throw error(500, {
			message: 'Error finding questions'
		});
	}
};

export const actions: Actions = {
	search: async ({ request }) => {
		try {
			const demo_time = await checkDemoTime();

			const body = Object.fromEntries(await request.formData());
			const questionString = body.searchString as string;

			const { data: questions, error: findQuestionsError } = await supabase
				.from(demo_time === true ? 'questions_demo' : 'questions')
				.select('*')
				.textSearch('question', `${questionString.split(' ').join(' | ')}`, {
					type: 'websearch',
					config: 'english'
				});

			if (findQuestionsError) {
				console.log(findQuestionsError);
			}

			return mapDemoValues(questions);
		} catch (e) {
			console.log(e);
			throw error(500, {
				message: 'Error finding questions'
			});
		}
	},
	typeahead: async ({ request }) => {
		try {
			const body = Object.fromEntries(await request.formData());
			const questionString = body.searchString as string;

			const {
				hits: { hits: elasticPrefixHits }
			} = await elasticClient.search({
				index: 'question',
				body: {
					query: {
						match_phrase_prefix: {
							['question']: {
								query: questionString
							}
						}
					}
				}
			});

			const {
				hits: { hits: elasticQueryStringHits }
			} = await elasticClient.search({
				index: 'question',
				body: {
					query: {
						query_string: {
							query: questionString
						}
					}
				}
			});
			console.log(elasticPrefixHits, elasticQueryStringHits);

			const hitMap: any = {};
			const dedupedHits: any[] = [];

			const hits = [...elasticPrefixHits, ...elasticQueryStringHits];
			console.log(hits);

			hits.forEach((hit) => {
				if (!hitMap[hit._id]) {
					hitMap[hit._id] = 1;
					dedupedHits.push(hit);
				}
			});

			return dedupedHits;
		} catch (e) {
			console.log(e);
			return [];
		}
	},
	sortComments: async ({ request }) => {
		try {
			const demo_time = await checkDemoTime();

			const body = Object.fromEntries(await request.formData());
			const enneagramTypes = (body.enneagramTypes as string).split(',');
			const questionId = parseInt(body.questionId as string);
			const sortBy = body.sortBy as string;

			const { data: comments, error: findCommentsError } = await supabase
				.from(demo_time === true ? 'comments_demo' : 'comments')
				.select(
					`*, 
				${demo_time === true ? 'profiles_demo' : 'profiles'} ${!enneagramTypes.includes('rando') ? '!inner' : ''
					} (enneagram, id)
				 ${demo_time === true ? 'comment_like_demo' : 'comment_like'} (id, comment_id, user_id)`,
					{
						count: 'exact'
					}
				)
				.eq('parent_type', 'question')
				.eq('parent_id', questionId)
				.eq('removed', false)
				.or(`enneagram.in.(${enneagramTypes.join(',')})`, {
					foreignTable: demo_time === true ? 'profiles_demo' : 'profiles'
				})
				.order(sortBy === 'newest' || sortBy === 'oldest' ? 'created_at' : 'like_count', {
					ascending:
						sortBy === 'newest' || sortBy === 'oldest'
							? sortBy === 'newest'
								? false
								: true
							: false
				});

			if (comments) {
				return mapDemoValues(comments);
			} else {
				if (findCommentsError) {
					console.log(findCommentsError);
				}
				throw error(500, {
					message: 'Error finding comments'
				});
			}
		} catch (e) {
			console.log(e);
			return [];
		}
	},
	getMoreQuestions: async ({ request }) => {
		try {
			const demo_time = await checkDemoTime();

			const body = Object.fromEntries(await request.formData());
			const count = parseInt(body.count as string);

			const { data: moreQuestions, error: moreQuestionsError } = await supabase
				.from(demo_time === true ? 'questions_demo' : 'questions')
				.select(`* `, { count: 'estimated' })
				.order('created_at', { ascending: false })
				.range(count, count + 10);

			if (!moreQuestionsError) {
				return moreQuestions;
			} else {
				throw error(500, {
					message: 'Error finding comments'
				});
			}
		} catch (e) {
			console.log(e);
			return [];
		}
	},
	remove: async ({ request, locals }) => {
		try {
			const session = locals.session;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}

			const demo_time = await checkDemoTime();

			const { data: user, error: findUserError } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.select('id, admin, external_id')
				.eq('id', session?.user?.id)
				.single();

			if (findUserError) {
				console.log(findUserError);
			}

			if (!user?.admin) {
				throw redirect(307, '/questions');
			}

			const body = Object.fromEntries(await request.formData());
			const questionId = parseInt(body.questionId as string);

			const { error: removeQuestionError } = await supabase
				.from(demo_time === true ? 'questions_demo' : 'questions')
				.update({ removed: true })
				.eq('id', questionId);

			if (!removeQuestionError) {
				const { data: question } = await supabase
					.from(demo_time === true ? 'questions_demo' : 'questions')
					.select('*')
					.eq('id', questionId)
					.single();

				if (question) {
					await deleteESQuestion({ questionId: question.es_id.toString() });
				}

				return true;
			} else {
				throw error(500, {
					message: 'Error removing question'
				});
			}
		} catch (e) {
			console.log(e);
			return false;
		}
	},
	update: async ({ request, locals }) => {
		try {
			const session = locals.session;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}

			const demo_time = await checkDemoTime();

			const { data: user, error: findUserError } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.select('id, admin, external_id')
				.eq('id', session?.user?.id)
				.single();

			if (findUserError) {
				console.log(findUserError);
			}

			if (!user?.admin) {
				throw error(400, {
					message: 'Not authorized'
				});
			}

			const body = Object.fromEntries(await request.formData());
			const questionId = parseInt(body.questionId as string);
			// const question = body.question as string;
			const removed = body.removed as string;
			const flagged = body.flagged as string;
			const question_formatted = body.question_formatted as string;
			const tags = JSON.parse(body.tags as string);

			// 	body.append('questionId', questionData.id);
			// body.append('question', questionData.question);
			// body.append('question_formatted', questionData.question_formatted);
			// body.append('tags', JSON.stringify(tags));
			// body.append('flagged', questionData.flagged);
			// body.append('removed', questionData.removed);

			const { error: removeQuestionError } = await supabase
				.from(demo_time === true ? 'questions_demo' : 'questions')
				.update({ question_formatted, removed, flagged })
				.eq('id', questionId);

			if (tags.length > 0) {
				const { error: removeQuestionTagsError } = await supabase
					.from(demo_time === true ? 'question_tags_demo' : 'question_tags')
					.delete()
					.eq('question_id', questionId);

				if (removeQuestionTagsError) {
					console.log('error removing tags');
					throw error(400, {
						message: 'error updating tags'
					});
				}

				tags.forEach(async (tag: any) => {
					const { error: addTagError } = await supabase
						.from(demo_time === true ? 'question_tags_demo' : 'question_tags')
						.insert({ question_id: questionId, tag_id: tag.tag_id });

					if (addTagError) {
						console.log('error adding tag', addTagError);
					}
				});
			}

			if (!removeQuestionError) {
				return { success: true };
			} else {
				throw error(500, {
					message: 'Error removing question'
				});
			}
		} catch (e) {
			console.log(e);
			return false;
		}
	}
};

interface Comment {
	id: number;
	created_at: string;
	comment: string;
	author_id: string;
	ip: string;
	comment_count: number;
	parent_type: string;
	es_id: string;
	parent_id: number;
	like_count: number;
	profiles: Profiles;
}

interface Profiles {
	enneagram: string;
	id: string;
}

// const createHeirarchy = (categories: {id: number, subcategory_name: string, parent_id: number}[]) => {
// 	const rootCategories: any[] = []
// 	let categoriestoFilter = [...categories]

// 	do {
// 		categoriestoFilter.forEach(category => {
// 			if (category.parent_id === null) {
// 				rootCategories.push(category);
// 			} else  {
// 				const parent = rootCategories.find(c => c.id === category.parent_id)
// 				if (!parent.children) {
// 					parent.children = [category]
// 				}
// 			}
// 		})
// 	} while (categoriestoFilter > 0);

// }

type Category = {
	id: number;
	subcategory_name: string;
	parent_id: number | null;
	children?: Category[] | any;
};

// const categories: Category[] = [
// 	{ id: 1, subcategory_name: 'test', parent_id: null },
// 	{ id: 5, subcategory_name: 'test2', parent_id: 1 }
// 	// ... add more categories as needed
// ];

function buildHierarchy(categories: Category[]): Category[] {
	const map: { [key: number]: Category } = {};

	// First pass: Create a map of all categories by their ID
	categories.forEach((category) => {
		category.children = [];
		map[category.id] = category;
	});

	// Second pass: Attach each category to its parent's children array
	categories.forEach((category) => {
		if (category.parent_id !== null) {
			if (map[category.parent_id]) {
				map[category.parent_id].children!.push(category);
			}
		}
	});

	// Filter out the categories that are not root (those with a parent_id)
	return categories.filter((category) => category.parent_id === null);
}

// let rootCategories = buildHierarchy(categories);
// console.log(rootCategories);

function addQuestionsToHierarchy(
	rootCategories: Category[],
	questionTags: { tag: any; questions: any }[]
): Category[] {
	function recurse(category: Category) {
		questionTags.forEach((qTag, index) => {
			if (qTag.question_tag.tag_name === category.subcategory_name) {
				if (!category.children) {
					category.children = [];
				}
				category.children.push(qTag);
				// Remove the string from the list to prevent adding it multiple times
				questionTags.splice(index, 1);
			}
		});

		if (category.children) {
			category.children.forEach((child: any) => {
				if (!child.question) {
					recurse(child);
				}
			});
		}
	}

	rootCategories.forEach(recurse);
	return rootCategories;
}

// Example usage:
// const rootCategories: Category[] = [
//     { id: 1, subcategory_name: "test", parent_id: null, children: [{ id: 5, subcategory_name: "test2", parent_id: 1 }] }
// ];

// const strings = ["test2", "example"];

// const updatedRootCategories = addStringsAsChildren(rootCategories, strings);
// console.log(updatedRootCategories);
