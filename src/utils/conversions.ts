// src/utils/conversions.ts
import { supabase } from '$lib/supabase';
import type { Database } from '../../database.types';

type QuestionRow = Database['public']['Tables']['questions']['Row'];
type ParentCommentRow = Database['public']['Tables']['comments']['Row'];

export const convertDateToReadable = (date: string): string => {
	const dateObj = new Date(date);
	const month = dateObj.getUTCMonth() + 1; //months from 1-12
	const day = dateObj.getUTCDate();
	const year = dateObj.getUTCFullYear();
	const newdate = month + '/' + day + '/' + year;
	return newdate;
};

interface CommentWithParent {
	id: number;
	parent_id: number | null;
	parent_type: string | null;
	parentQuestion?: QuestionRow;
	parentComment?: ParentCommentRow;
}

export const getCommentParents = async <T extends CommentWithParent>(
	comments: T[]
): Promise<T[]> => {
	const commentsOnQuestions = comments.filter(
		(comment): comment is T & { parent_id: number } =>
			comment.parent_id !== null && comment.parent_type === 'question'
	);
	const commentsOnComments = comments.filter(
		(comment): comment is T & { parent_id: number } =>
			comment.parent_id !== null && comment.parent_type !== 'question'
	);

	const questionMap: Record<number, QuestionRow> = {};
	const questionParentIds = commentsOnQuestions.map((comment) => comment.parent_id);
	if (questionParentIds.length) {
		const { data: questionsData, error: questionsError } = await supabase
			.from('questions')
			.select('*')
			.in('id', questionParentIds);

		if (questionsError) {
			throw new Error(`Failed to get parent questions ${JSON.stringify(questionsError)}`);
		}

		const questions = (questionsData ?? []) as QuestionRow[];
		for (const question of questions) {
			questionMap[question.id] = question;
		}
	}

	const commentMap: Record<number, ParentCommentRow> = {};
	const commentParentIds = commentsOnComments.map((comment) => comment.parent_id);
	if (commentParentIds.length) {
		const { data: parentCommentsData, error: parentCommentsError } = await supabase
			.from('comments')
			.select('*')
			.in('id', commentParentIds);

		if (parentCommentsError) {
			throw new Error(`Failed to get parent comments ${JSON.stringify(parentCommentsError)}`);
		}

		const parentComments = (parentCommentsData ?? []) as ParentCommentRow[];
		for (const parentComment of parentComments) {
			commentMap[parentComment.id] = parentComment;
		}
	}

	comments.forEach((comment) => {
		if (comment.parent_id === null) {
			return;
		}

		if (comment.parent_type === 'question') {
			comment.parentQuestion = questionMap[comment.parent_id];
		} else {
			comment.parentComment = commentMap[comment.parent_id];
		}
	});

	return comments;
};
