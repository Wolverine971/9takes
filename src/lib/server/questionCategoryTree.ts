// src/lib/server/questionCategoryTree.ts
export interface QuestionCategoryRow {
	id: number;
	category_name: string;
	parent_id: number | null;
	level: number | null;
}

export interface QuestionCategoryTagRow {
	question_id: number;
	tag_id: number;
}

export interface QuestionCategoryTreeNode {
	id: number;
	category_name: string;
	parent_id: number | null;
	level: number;
	directQuestionCount: number;
	subtreeQuestionCount: number;
	hasDirectQuestions: boolean;
	children: QuestionCategoryTreeNode[];
}

interface MutableTreeNode extends QuestionCategoryRow {
	children: MutableTreeNode[];
	directQuestionIds: Set<number>;
}

interface PrunedNodeResult {
	node: QuestionCategoryTreeNode;
	questionIds: Set<number>;
}

export function buildVisibleQuestionCategoryTree(
	categories: QuestionCategoryRow[],
	categoryTags: QuestionCategoryTagRow[],
	activeQuestionIds: Iterable<number>
): QuestionCategoryTreeNode[] {
	const activeQuestionIdSet = new Set(activeQuestionIds);
	const nodes = new Map<number, MutableTreeNode>(
		categories.map((category) => [
			category.id,
			{
				...category,
				children: [],
				directQuestionIds: new Set<number>()
			}
		])
	);

	for (const tagRow of categoryTags) {
		if (!activeQuestionIdSet.has(tagRow.question_id)) continue;
		nodes.get(tagRow.tag_id)?.directQuestionIds.add(tagRow.question_id);
	}

	const roots: MutableTreeNode[] = [];
	for (const category of categories) {
		const node = nodes.get(category.id);
		if (!node) continue;

		if (node.parent_id !== null) {
			const parent = nodes.get(node.parent_id);
			if (parent) {
				parent.children.push(node);
				continue;
			}
		}

		roots.push(node);
	}

	return roots
		.map((root) => pruneEmptyBranches(root))
		.filter((result): result is PrunedNodeResult => result !== null)
		.map((result) => result.node);
}

export function countVisibleQuestionCategories(tree: QuestionCategoryTreeNode[]): number {
	return tree.reduce((total, node) => total + 1 + countVisibleQuestionCategories(node.children), 0);
}

export function listQuestionCategoriesWithDirectQuestions(
	tree: QuestionCategoryTreeNode[]
): Array<Pick<QuestionCategoryTreeNode, 'id' | 'category_name' | 'directQuestionCount'>> {
	const categories: Array<
		Pick<QuestionCategoryTreeNode, 'id' | 'category_name' | 'directQuestionCount'>
	> = [];

	for (const node of tree) {
		if (node.hasDirectQuestions) {
			categories.push({
				id: node.id,
				category_name: node.category_name,
				directQuestionCount: node.directQuestionCount
			});
		}

		categories.push(...listQuestionCategoriesWithDirectQuestions(node.children));
	}

	return categories;
}

export function findQuestionCategoryNodeById(
	tree: QuestionCategoryTreeNode[],
	categoryId: number
): QuestionCategoryTreeNode | null {
	for (const node of tree) {
		if (node.id === categoryId) {
			return node;
		}

		const childMatch = findQuestionCategoryNodeById(node.children, categoryId);
		if (childMatch) {
			return childMatch;
		}
	}

	return null;
}

function pruneEmptyBranches(node: MutableTreeNode): PrunedNodeResult | null {
	const prunedChildren = node.children
		.map((child) => pruneEmptyBranches(child))
		.filter((result): result is PrunedNodeResult => result !== null);
	const subtreeQuestionIds = new Set(node.directQuestionIds);

	for (const child of prunedChildren) {
		for (const questionId of child.questionIds) {
			subtreeQuestionIds.add(questionId);
		}
	}

	if (subtreeQuestionIds.size === 0) {
		return null;
	}

	return {
		questionIds: subtreeQuestionIds,
		node: {
			id: node.id,
			category_name: node.category_name,
			parent_id: node.parent_id,
			level: node.level ?? 0,
			directQuestionCount: node.directQuestionIds.size,
			subtreeQuestionCount: subtreeQuestionIds.size,
			hasDirectQuestions: node.directQuestionIds.size > 0,
			children: prunedChildren.map((child) => child.node)
		}
	};
}
