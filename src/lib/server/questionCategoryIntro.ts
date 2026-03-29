// src/lib/server/questionCategoryIntro.ts
import { createHash } from 'node:crypto';
import { marked } from 'marked';
import { load as parseHtml } from 'cheerio';
import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database, Json } from '../../../database.types';
import { logger } from '$lib/utils/logger';
import {
	buildVisibleQuestionCategoryTree,
	findQuestionCategoryNodeById,
	isQuestionCategoryEligibleForIntro,
	MIN_QUESTION_COUNT_FOR_CATEGORY_INTRO,
	type QuestionCategoryRow,
	type QuestionCategoryTagRow,
	type QuestionCategoryTreeNode
} from '$lib/server/questionCategoryTree';
import { SmartLLMService } from '../../utils/server/smart-llm-service';

type QuestionTable = 'questions' | 'questions_demo';
type CategoryRow = Database['public']['Tables']['question_categories']['Row'];
type CategoryIntroRunRow = Database['public']['Tables']['question_category_intro_runs']['Row'];
type ActiveQuestionRow = Pick<
	Database['public']['Tables']['questions']['Row'],
	'id' | 'question' | 'question_formatted' | 'created_at'
>;
type QuestionKeywordRow = Pick<
	Database['public']['Tables']['question_keywords']['Row'],
	'question_id' | 'keywords' | 'created_at'
>;

export type QuestionCategoryIntroContext = {
	categoryId: number;
	categoryName: string;
	path: string[];
	directQuestionCount: number;
	subtreeQuestionCount: number;
	isEligibleForIntro: boolean;
	minimumQuestionCount: number;
	childCategories: Array<{
		id: number;
		name: string;
		subtreeQuestionCount: number;
		directQuestionCount: number;
	}>;
	sampleQuestionIds: number[];
	sampleQuestionTitles: string[];
	directQuestionTitles: string[];
	semanticTerms: string[];
	contextHash: string;
};

type QuestionCategoryIntroGeneration = {
	intro_markdown: string;
	intro_description?: string;
	semantic_terms?: string[];
};

const CATEGORY_INTRO_PROMPT_VERSION = 'question-category-intro-v1';
const CATEGORY_INTRO_MODEL = 'openai/gpt-5-mini';
const MAX_SAMPLE_QUESTIONS = 8;
const MAX_SEMANTIC_TERMS = 8;

const llmService = new SmartLLMService({
	httpReferer: 'https://9takes.com',
	appName: '9takes Category Intro'
});

const SEMANTIC_STOPWORDS = new Set([
	'about',
	'across',
	'after',
	'again',
	'along',
	'also',
	'and',
	'are',
	'around',
	'because',
	'being',
	'between',
	'build',
	'from',
	'have',
	'here',
	'into',
	'just',
	'kind',
	'life',
	'more',
	'people',
	'questions',
	'really',
	'same',
	'some',
	'talk',
	'the',
	'their',
	'theme',
	'these',
	'this',
	'topic',
	'what',
	'with'
]);

export const getQuestionCategoryIntroPromptVersion = () => CATEGORY_INTRO_PROMPT_VERSION;

export async function buildQuestionCategoryIntroContext(
	supabase: SupabaseClient<Database>,
	categoryId: number,
	questionTable: QuestionTable = 'questions'
): Promise<{
	category: CategoryRow;
	treeNode: QuestionCategoryTreeNode | null;
	context: QuestionCategoryIntroContext;
}> {
	const [
		{ data: categories, error: categoriesError },
		{ data: categoryTags, error: categoryTagsError },
		{ data: activeQuestions, error: activeQuestionsError }
	] = await Promise.all([
		supabase
			.from('question_categories')
			.select(
				'id, category_name, parent_id, level, intro_markdown, intro_description, intro_status, intro_source, intro_prompt_version, intro_generated_at, intro_updated_at, intro_updated_by, intro_reviewed_at, intro_context'
			)
			.order('id', { ascending: true }),
		supabase.from('question_category_tags').select('question_id, tag_id'),
		supabase
			.from(questionTable)
			.select('id, question, question_formatted, created_at')
			.eq('removed', false)
	]);

	if (categoriesError || categoryTagsError || activeQuestionsError) {
		logger.error('Failed to load question category intro context', undefined, {
			categoryId,
			categoriesError,
			categoryTagsError,
			activeQuestionsError
		});
		throw new Error('Failed to load question category intro context');
	}

	const categoriesList = (categories ?? []) as CategoryRow[];
	const category = categoriesList.find((entry) => entry.id === categoryId);
	if (!category) {
		throw new Error('Category not found');
	}

	const activeQuestionList = (activeQuestions ?? []) as ActiveQuestionRow[];
	const activeQuestionIds = new Set(activeQuestionList.map((question) => question.id));
	const tree = buildVisibleQuestionCategoryTree(
		categoriesList as QuestionCategoryRow[],
		((categoryTags ?? []) as QuestionCategoryTagRow[]) ?? [],
		activeQuestionIds
	);
	const treeNode = findQuestionCategoryNodeById(tree, categoryId);
	const categoryMap = new Map(categoriesList.map((entry) => [entry.id, entry]));
	const tagRows = ((categoryTags ?? []) as QuestionCategoryTagRow[]).filter((row) =>
		activeQuestionIds.has(row.question_id)
	);
	const questionById = new Map(activeQuestionList.map((question) => [question.id, question]));
	const keywordsByQuestionId = new Map<number, string[]>();

	const path = treeNode
		? (getPathForTreeNode(tree, categoryId) ?? [category.category_name])
		: getCategoryPathFromRows(categoryMap, categoryId);
	const descendantIds = treeNode ? collectDescendantCategoryIds(treeNode) : [categoryId];
	const directQuestionIds = new Set(
		tagRows.filter((row) => row.tag_id === categoryId).map((row) => row.question_id)
	);
	const subtreeQuestionIds = new Set(
		tagRows.filter((row) => descendantIds.includes(row.tag_id)).map((row) => row.question_id)
	);
	const subtreeQuestionIdList = Array.from(subtreeQuestionIds);
	const { data: keywordRows, error: keywordRowsError } = subtreeQuestionIdList.length
		? await supabase
				.from('question_keywords')
				.select('question_id, keywords, created_at')
				.in('question_id', subtreeQuestionIdList)
				.not('question_id', 'is', null)
		: { data: [], error: null };

	if (keywordRowsError) {
		logger.error('Failed to load question keywords for category intro context', undefined, {
			categoryId,
			keywordRowsError
		});
		throw new Error('Failed to load question category intro context');
	}

	for (const keywordRow of (keywordRows ?? []) as QuestionKeywordRow[]) {
		if (!keywordRow.question_id || !keywordRow.keywords) continue;
		keywordsByQuestionId.set(
			keywordRow.question_id,
			keywordRow.keywords
				.split(',')
				.map((keyword) => keyword.trim().toLowerCase())
				.filter(Boolean)
		);
	}
	const sampleQuestions = Array.from(subtreeQuestionIds)
		.map((questionId) => questionById.get(questionId))
		.filter((question): question is ActiveQuestionRow => Boolean(question))
		.sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
		.slice(0, MAX_SAMPLE_QUESTIONS);
	const directQuestionTitles = Array.from(directQuestionIds)
		.map((questionId) => questionById.get(questionId))
		.filter((question): question is ActiveQuestionRow => Boolean(question))
		.sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
		.slice(0, MAX_SAMPLE_QUESTIONS)
		.map(getQuestionDisplayTitle);
	const semanticTerms = deriveSemanticTerms({
		path,
		childCategoryNames: treeNode?.children.map((child) => child.category_name) ?? [],
		questionIds: Array.from(subtreeQuestionIds),
		keywordsByQuestionId,
		questionById
	});

	const contextBase = {
		path,
		directQuestionCount: directQuestionIds.size,
		subtreeQuestionCount: subtreeQuestionIds.size,
		childCategories:
			treeNode?.children.map((child) => ({
				id: child.id,
				name: child.category_name,
				subtreeQuestionCount: child.subtreeQuestionCount,
				directQuestionCount: child.directQuestionCount
			})) ?? [],
		sampleQuestionIds: sampleQuestions.map((question) => question.id),
		sampleQuestionTitles: sampleQuestions.map(getQuestionDisplayTitle),
		directQuestionTitles,
		semanticTerms
	};

	const context: QuestionCategoryIntroContext = {
		categoryId,
		categoryName: category.category_name,
		path,
		directQuestionCount: directQuestionIds.size,
		subtreeQuestionCount: subtreeQuestionIds.size,
		isEligibleForIntro: isQuestionCategoryEligibleForIntro(
			{ subtreeQuestionCount: subtreeQuestionIds.size },
			MIN_QUESTION_COUNT_FOR_CATEGORY_INTRO
		),
		minimumQuestionCount: MIN_QUESTION_COUNT_FOR_CATEGORY_INTRO,
		childCategories: contextBase.childCategories,
		sampleQuestionIds: contextBase.sampleQuestionIds,
		sampleQuestionTitles: contextBase.sampleQuestionTitles,
		directQuestionTitles,
		semanticTerms,
		contextHash: createHash('sha256').update(JSON.stringify(contextBase)).digest('hex')
	};

	return {
		category,
		treeNode,
		context
	};
}

export async function generateQuestionCategoryIntro(
	supabase: SupabaseClient<Database>,
	categoryId: number,
	adminUserId: string
): Promise<{
	category: CategoryRow;
	context: QuestionCategoryIntroContext;
	run: CategoryIntroRunRow | null;
	renderedIntroHtml: string;
}> {
	const { category, context } = await buildQuestionCategoryIntroContext(
		supabase,
		categoryId,
		'questions'
	);
	if (!context.isEligibleForIntro) {
		throw new Error(
			`Category requires at least ${context.minimumQuestionCount} subtree questions before intro generation`
		);
	}

	const generationStartedAt = new Date().toISOString();
	const persistedContext = {
		path: context.path,
		directQuestionCount: context.directQuestionCount,
		subtreeQuestionCount: context.subtreeQuestionCount,
		childCategories: context.childCategories,
		sampleQuestionIds: context.sampleQuestionIds,
		sampleQuestionTitles: context.sampleQuestionTitles,
		semanticTerms: context.semanticTerms,
		contextHash: context.contextHash,
		lastError: null,
		model: CATEGORY_INTRO_MODEL
	} satisfies Record<string, unknown>;

	const { data: runRow, error: runInsertError } = await supabase
		.from('question_category_intro_runs')
		.insert({
			category_id: categoryId,
			status: 'processing',
			trigger: 'manual',
			prompt_version: CATEGORY_INTRO_PROMPT_VERSION,
			model: CATEGORY_INTRO_MODEL,
			context: persistedContext as unknown as Json,
			created_by: adminUserId,
			started_at: generationStartedAt
		})
		.select('*')
		.maybeSingle();

	if (runInsertError) {
		logger.warn('Failed to create category intro run row', {
			categoryId,
			runInsertError
		});
	}

	await supabase
		.from('question_categories')
		.update({
			intro_status: 'processing',
			intro_prompt_version: CATEGORY_INTRO_PROMPT_VERSION,
			intro_updated_at: generationStartedAt,
			intro_updated_by: adminUserId,
			intro_context: persistedContext as unknown as Json
		})
		.eq('id', categoryId);

	try {
		const generation = await llmService.getJSONResponse<QuestionCategoryIntroGeneration>({
			systemPrompt: getQuestionCategoryIntroPrompt(),
			userPrompt: JSON.stringify(context, null, 2),
			userId: adminUserId,
			profile: 'balanced',
			temperature: 0.2,
			validation: { retryOnParseError: true, maxRetries: 2 },
			operationType: 'question_category_intro_generation',
			taskId: String(categoryId)
		});

		const introMarkdown = normalizeIntroMarkdown(generation?.intro_markdown ?? '');
		if (!introMarkdown) {
			throw new Error('AI intro generation returned empty markdown');
		}

		const introDescription = buildQuestionCategoryIntroDescription(
			introMarkdown,
			generation?.intro_description ?? null
		);
		const finishedAt = new Date().toISOString();
		const nextContext = {
			...persistedContext,
			semanticTerms:
				limitUniqueStrings(
					generation?.semantic_terms ?? context.semanticTerms,
					MAX_SEMANTIC_TERMS
				) ?? context.semanticTerms,
			lastError: null,
			completedAt: finishedAt
		};

		const { data: updatedCategory, error: categoryUpdateError } = await supabase
			.from('question_categories')
			.update({
				intro_markdown: introMarkdown,
				intro_description: introDescription,
				intro_status: 'completed',
				intro_source: 'ai',
				intro_prompt_version: CATEGORY_INTRO_PROMPT_VERSION,
				intro_generated_at: finishedAt,
				intro_updated_at: finishedAt,
				intro_updated_by: adminUserId,
				intro_reviewed_at: null,
				intro_context: nextContext as unknown as Json
			})
			.eq('id', categoryId)
			.select('*')
			.single();

		if (categoryUpdateError || !updatedCategory) {
			throw categoryUpdateError ?? new Error('Failed to save generated category intro');
		}

		if (runRow?.id) {
			await supabase
				.from('question_category_intro_runs')
				.update({
					status: 'completed',
					finished_at: finishedAt,
					output: {
						intro_markdown: introMarkdown,
						intro_description: introDescription,
						semantic_terms: nextContext.semanticTerms
					} as unknown as Json
				})
				.eq('id', runRow.id);
		}

		return {
			category: updatedCategory,
			context: {
				...context,
				semanticTerms: Array.isArray(nextContext.semanticTerms)
					? (nextContext.semanticTerms as string[])
					: context.semanticTerms
			},
			run: runRow ?? null,
			renderedIntroHtml: renderQuestionCategoryIntroMarkdown(introMarkdown)
		};
	} catch (caughtError) {
		const message =
			caughtError instanceof Error
				? caughtError.message
				: 'Unknown category intro generation error';
		const failedAt = new Date().toISOString();
		const failureContext = {
			...persistedContext,
			lastError: message,
			failedAt
		};

		await supabase
			.from('question_categories')
			.update({
				intro_status: 'failed',
				intro_updated_at: failedAt,
				intro_updated_by: adminUserId,
				intro_context: failureContext as unknown as Json
			})
			.eq('id', categoryId);

		if (runRow?.id) {
			await supabase
				.from('question_category_intro_runs')
				.update({
					status: 'failed',
					error: message,
					finished_at: failedAt,
					output: null
				})
				.eq('id', runRow.id);
		}

		throw caughtError;
	}
}

export async function saveQuestionCategoryIntro(
	supabase: SupabaseClient<Database>,
	categoryId: number,
	adminUserId: string,
	introMarkdown: string,
	introDescription?: string | null
): Promise<CategoryRow> {
	const { data: currentCategory, error: categoryError } = await supabase
		.from('question_categories')
		.select('*')
		.eq('id', categoryId)
		.single();

	if (categoryError || !currentCategory) {
		throw categoryError ?? new Error('Category not found');
	}

	const normalizedMarkdown = normalizeIntroMarkdown(introMarkdown);
	const normalizedDescription = buildQuestionCategoryIntroDescription(
		normalizedMarkdown,
		introDescription ?? null
	);
	const hasExistingAiOutput = Boolean(
		currentCategory.intro_generated_at ||
			(currentCategory.intro_source === 'ai' && currentCategory.intro_markdown)
	);
	const nextSource = hasExistingAiOutput ? 'ai_edited' : 'manual';
	const nextStatus = normalizedMarkdown ? 'completed' : 'missing';
	const now = new Date().toISOString();
	const nextContext = {
		...(isRecord(currentCategory.intro_context) ? currentCategory.intro_context : {}),
		lastError: null,
		manuallyUpdatedAt: now
	} as Record<string, unknown>;

	const { data: updatedCategory, error: updateError } = await supabase
		.from('question_categories')
		.update({
			intro_markdown: normalizedMarkdown || null,
			intro_description: normalizedDescription || null,
			intro_status: nextStatus,
			intro_source: nextSource,
			intro_updated_at: now,
			intro_updated_by: adminUserId,
			intro_reviewed_at: null,
			intro_context: nextContext as unknown as Json
		})
		.eq('id', categoryId)
		.select('*')
		.single();

	if (updateError || !updatedCategory) {
		throw updateError ?? new Error('Failed to save category intro');
	}

	return updatedCategory;
}

export async function reviewQuestionCategoryIntro(
	supabase: SupabaseClient<Database>,
	categoryId: number,
	adminUserId: string
): Promise<CategoryRow> {
	const { data: currentCategory, error: categoryError } = await supabase
		.from('question_categories')
		.select('*')
		.eq('id', categoryId)
		.single();

	if (categoryError || !currentCategory) {
		throw categoryError ?? new Error('Category not found');
	}

	const normalizedMarkdown = normalizeIntroMarkdown(currentCategory.intro_markdown ?? '');
	if (!normalizedMarkdown) {
		throw new Error('Cannot review a category intro that has no saved markdown');
	}

	if (currentCategory.intro_status === 'processing') {
		throw new Error('Cannot review a category intro while generation is still processing');
	}

	const now = new Date().toISOString();
	const nextContext = {
		...(isRecord(currentCategory.intro_context) ? currentCategory.intro_context : {}),
		lastError: null,
		reviewedAt: now,
		reviewedBy: adminUserId
	} as Record<string, unknown>;

	const { data: updatedCategory, error: updateError } = await supabase
		.from('question_categories')
		.update({
			intro_status: 'completed',
			intro_reviewed_at: now,
			intro_updated_by: adminUserId,
			intro_context: nextContext as unknown as Json
		})
		.eq('id', categoryId)
		.select('*')
		.single();

	if (updateError || !updatedCategory) {
		throw updateError ?? new Error('Failed to review category intro');
	}

	return updatedCategory;
}

export async function markQuestionCategoryIntrosStale(
	supabase: SupabaseClient<Database>,
	tagIds: number[]
): Promise<void> {
	const uniqueTagIds = Array.from(new Set(tagIds.filter((tagId) => Number.isFinite(tagId))));
	if (!uniqueTagIds.length) {
		return;
	}

	const { data: categories, error: categoriesError } = await supabase
		.from('question_categories')
		.select('id, parent_id, intro_context, intro_markdown, intro_status')
		.order('id', { ascending: true });

	if (categoriesError || !categories?.length) {
		logger.warn('Failed to load categories while marking intro content stale', {
			categoriesError,
			tagIds: uniqueTagIds
		});
		return;
	}

	const parentById = new Map(categories.map((category) => [category.id, category.parent_id]));
	const idsToMark = new Set<number>();

	for (const tagId of uniqueTagIds) {
		let currentId: number | null | undefined = tagId;
		while (currentId != null && !idsToMark.has(currentId)) {
			idsToMark.add(currentId);
			currentId = parentById.get(currentId) ?? null;
		}
	}

	if (!idsToMark.size) {
		return;
	}

	const now = new Date().toISOString();

	for (const category of categories) {
		if (!idsToMark.has(category.id)) continue;
		const hasSavedIntro = Boolean(normalizeIntroMarkdown(category.intro_markdown ?? ''));
		const nextStatus = hasSavedIntro ? 'stale' : 'missing';
		const nextContext = {
			...(isRecord(category.intro_context) ? category.intro_context : {}),
			lastError: null,
			staleAt: hasSavedIntro ? now : null
		};

		const { error: staleUpdateError } = await supabase
			.from('question_categories')
			.update({
				intro_status: nextStatus,
				intro_context: nextContext as unknown as Json
			})
			.eq('id', category.id);

		if (staleUpdateError) {
			logger.warn('Failed to mark category intro stale', {
				categoryId: category.id,
				staleUpdateError
			});
		}
	}
}

export function renderQuestionCategoryIntroMarkdown(markdown: string | null | undefined): string {
	const normalized = normalizeIntroMarkdown(markdown ?? '');
	if (!normalized) {
		return '';
	}

	const renderedHtml = marked.parse(normalized, { async: false }) as string;
	return sanitizeQuestionCategoryIntroHtml(renderedHtml);
}

export function buildQuestionCategoryIntroDescription(
	markdown: string | null | undefined,
	preferredDescription?: string | null
): string {
	const preferred = collapseWhitespace(preferredDescription ?? '');
	if (preferred) {
		return truncateText(preferred, 160);
	}

	const html = renderQuestionCategoryIntroMarkdown(markdown);
	const text = collapseWhitespace(parseHtml(`<div>${html}</div>`).text());
	return truncateText(text, 160);
}

function getQuestionCategoryIntroPrompt(): string {
	return `You write concise, natural SEO-supporting introductions for question category pages.

Return valid JSON only using this shape:
{
  "intro_markdown": "string",
  "intro_description": "string",
  "semantic_terms": ["string"]
}

Rules:
- Write 80 to 180 words. Hard cap 220 words.
- Keep the copy natural, specific, and human.
- Use one or two short paragraphs. An optional short bullet list is okay only if it truly helps clarity.
- Do not write a heading.
- Do not write filler like "Welcome to" or "In this article".
- Do not answer the questions. Describe the topic area and the kinds of questions present.
- Use semantically related language and LSI-style supporting terms naturally, without keyword stuffing.
- For broad parent categories, mention the meaningful live child themes.
- If directQuestionCount is 0, do not imply that direct questions exist in the current node.
- The intro_description should be plain text, about 120 to 160 characters, and suitable for a meta description.
- The semantic_terms array should contain 3 to 8 concise related terms.
`;
}

function collectDescendantCategoryIds(node: QuestionCategoryTreeNode): number[] {
	return [node.id, ...node.children.flatMap((child) => collectDescendantCategoryIds(child))];
}

function getPathForTreeNode(
	tree: QuestionCategoryTreeNode[],
	categoryId: number,
	path: string[] = []
): string[] | null {
	for (const node of tree) {
		const nextPath = [...path, node.category_name];
		if (node.id === categoryId) {
			return nextPath;
		}

		const childPath = getPathForTreeNode(node.children, categoryId, nextPath);
		if (childPath) {
			return childPath;
		}
	}

	return null;
}

function getCategoryPathFromRows(
	categoryMap: Map<number, Pick<CategoryRow, 'id' | 'category_name' | 'parent_id'>>,
	categoryId: number
): string[] {
	const path: string[] = [];
	let current = categoryMap.get(categoryId) ?? null;

	while (current) {
		path.unshift(current.category_name);
		current = current.parent_id ? (categoryMap.get(current.parent_id) ?? null) : null;
	}

	return path;
}

function getQuestionDisplayTitle(question: ActiveQuestionRow): string {
	return collapseWhitespace(question.question_formatted || question.question || '');
}

function deriveSemanticTerms({
	path,
	childCategoryNames,
	questionIds,
	keywordsByQuestionId,
	questionById
}: {
	path: string[];
	childCategoryNames: string[];
	questionIds: number[];
	keywordsByQuestionId: Map<number, string[]>;
	questionById: Map<number, ActiveQuestionRow>;
}): string[] {
	const frequency = new Map<string, number>();

	for (const questionId of questionIds) {
		for (const keyword of keywordsByQuestionId.get(questionId) ?? []) {
			addSemanticTerm(frequency, keyword, 3);
		}

		const question = questionById.get(questionId);
		if (!question) continue;

		for (const token of tokenizeTerm(getQuestionDisplayTitle(question))) {
			addSemanticTerm(frequency, token, 1);
		}
	}

	for (const name of [...path, ...childCategoryNames]) {
		addSemanticTerm(frequency, name.toLowerCase(), 2);
		for (const token of tokenizeTerm(name)) {
			addSemanticTerm(frequency, token, 1);
		}
	}

	return Array.from(frequency.entries())
		.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
		.map(([term]) => term)
		.filter(Boolean)
		.slice(0, MAX_SEMANTIC_TERMS);
}

function addSemanticTerm(frequency: Map<string, number>, term: string, weight: number) {
	const normalized = collapseWhitespace(term.toLowerCase());
	if (!normalized) return;
	if (normalized.length < 3) return;
	if (SEMANTIC_STOPWORDS.has(normalized)) return;
	frequency.set(normalized, (frequency.get(normalized) ?? 0) + weight);
}

function tokenizeTerm(input: string): string[] {
	return input
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, ' ')
		.split(/[\s-]+/)
		.map((token) => token.trim())
		.filter((token) => token.length >= 4 && !SEMANTIC_STOPWORDS.has(token));
}

function normalizeIntroMarkdown(markdown: string): string {
	return markdown.replace(/\r\n/g, '\n').trim();
}

function collapseWhitespace(input: string): string {
	return input.replace(/\s+/g, ' ').trim();
}

function truncateText(input: string, maxLength: number): string {
	if (input.length <= maxLength) {
		return input;
	}

	return `${input.slice(0, maxLength - 1).trimEnd()}…`;
}

function limitUniqueStrings(values: string[], limit: number): string[] {
	return Array.from(
		new Set(values.map((value) => collapseWhitespace(value)).filter((value) => value.length > 0))
	).slice(0, limit);
}

function sanitizeQuestionCategoryIntroHtml(renderedHtml: string): string {
	const $ = parseHtml(`<div data-root="intro-root">${renderedHtml}</div>`);
	const root = $('[data-root="intro-root"]');
	const allowedTags = new Set(['p', 'ul', 'ol', 'li', 'strong', 'em', 'code', 'a']);

	root.find('*').each((_, element) => {
		const tag = element.tagName?.toLowerCase();
		if (!tag) return;

		if (!allowedTags.has(tag)) {
			const text = collapseWhitespace($(element).text());
			if (text) {
				$(element).replaceWith($('<p></p>').text(text));
			} else {
				$(element).remove();
			}
			return;
		}

		for (const attribute of Object.keys(element.attribs ?? {})) {
			if (tag === 'a' && attribute === 'href') continue;
			$(element).removeAttr(attribute);
		}

		if (tag === 'a') {
			const href = $(element).attr('href') ?? '';
			if (!isSafeHref(href)) {
				$(element).replaceWith($(element).text());
				return;
			}

			$(element).attr('rel', 'nofollow noopener noreferrer');
		}
	});

	root.find('p').each((_, element) => {
		if (!collapseWhitespace($(element).text())) {
			$(element).remove();
		}
	});

	root.find('ul, ol').each((_, element) => {
		if ($(element).find('li').length === 0) {
			$(element).remove();
		}
	});

	return root.html() ?? '';
}

function isSafeHref(href: string): boolean {
	return /^(https?:\/\/|\/|#)/i.test(href);
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
