// src/lib/server/questionCategoryTree.spec.ts
import { describe, expect, it } from 'vitest';

import {
	buildVisibleQuestionCategoryTree,
	countVisibleQuestionCategories,
	findQuestionCategoryNodeById,
	listQuestionCategoriesWithDirectQuestions,
	type QuestionCategoryRow,
	type QuestionCategoryTagRow
} from './questionCategoryTree';

describe('buildVisibleQuestionCategoryTree', () => {
	const categories: QuestionCategoryRow[] = [
		{ id: 1, category_name: 'Root', parent_id: null, level: 1 },
		{ id: 2, category_name: 'Visible Branch', parent_id: 1, level: 2 },
		{ id: 3, category_name: 'Hidden Branch', parent_id: 1, level: 2 },
		{ id: 4, category_name: 'Visible Leaf', parent_id: 2, level: 3 },
		{ id: 5, category_name: 'Also Visible Leaf', parent_id: 2, level: 3 },
		{ id: 6, category_name: 'Hidden Leaf', parent_id: 3, level: 3 }
	];

	it('prunes empty branches while preserving ancestors with descendant questions', () => {
		const categoryTags: QuestionCategoryTagRow[] = [
			{ question_id: 101, tag_id: 4 },
			{ question_id: 102, tag_id: 5 }
		];

		const tree = buildVisibleQuestionCategoryTree(categories, categoryTags, [101, 102]);

		expect(tree).toHaveLength(1);
		expect(tree[0].category_name).toBe('Root');
		expect(tree[0].subtreeQuestionCount).toBe(2);
		expect(tree[0].children.map((child) => child.category_name)).toEqual(['Visible Branch']);
		expect(tree[0].children[0].children.map((child) => child.category_name)).toEqual([
			'Visible Leaf',
			'Also Visible Leaf'
		]);
	});

	it('uses unique question counts for ancestor totals', () => {
		const categoryTags: QuestionCategoryTagRow[] = [
			{ question_id: 101, tag_id: 4 },
			{ question_id: 101, tag_id: 5 },
			{ question_id: 102, tag_id: 5 }
		];

		const tree = buildVisibleQuestionCategoryTree(categories, categoryTags, [101, 102]);
		const branch = tree[0].children[0];

		expect(branch.directQuestionCount).toBe(0);
		expect(branch.subtreeQuestionCount).toBe(2);
		expect(tree[0].subtreeQuestionCount).toBe(2);
		expect(countVisibleQuestionCategories(tree)).toBe(4);
	});

	it('finds a visible node anywhere in the tree', () => {
		const categoryTags: QuestionCategoryTagRow[] = [{ question_id: 101, tag_id: 5 }];
		const tree = buildVisibleQuestionCategoryTree(categories, categoryTags, [101]);

		expect(findQuestionCategoryNodeById(tree, 5)?.category_name).toBe('Also Visible Leaf');
		expect(findQuestionCategoryNodeById(tree, 6)).toBeNull();
	});

	it('lists only categories with direct questions', () => {
		const categoryTags: QuestionCategoryTagRow[] = [
			{ question_id: 101, tag_id: 4 },
			{ question_id: 102, tag_id: 5 }
		];
		const tree = buildVisibleQuestionCategoryTree(categories, categoryTags, [101, 102]);

		expect(listQuestionCategoriesWithDirectQuestions(tree)).toEqual([
			{ id: 4, category_name: 'Visible Leaf', directQuestionCount: 1 },
			{ id: 5, category_name: 'Also Visible Leaf', directQuestionCount: 1 }
		]);
	});

	it('ignores mappings for inactive questions', () => {
		const categoryTags: QuestionCategoryTagRow[] = [{ question_id: 999, tag_id: 4 }];

		const tree = buildVisibleQuestionCategoryTree(categories, categoryTags, []);

		expect(tree).toEqual([]);
	});
});
