/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "$lib/supabase";

export const convertDateToReadable = (date: string): string => {
	const dateObj = new Date(date);
	const month = dateObj.getUTCMonth() + 1; //months from 1-12
	const day = dateObj.getUTCDate();
	const year = dateObj.getUTCFullYear();
	const newdate = month + '/' + day + '/' + year;
	return newdate;
};


export const getCommentParents = async (comments: any[]) => {

	const commentsOnQuestions = comments.filter((comment) => comment.parent_id !== null && comment.parent_type === 'question');
	const commentsOnComments = comments.filter((comment) => comment.parent_id !== null && comment.parent_type !== 'question');


	console.log(commentsOnComments)
	const { data: questions, error: questionsError } = await supabase
		.from('questions')
		.select(
			`*`
		)
		.in('id', commentsOnQuestions.map((comment) => comment.parent_id))

	if (questionsError) {
		throw new Error(`Failed to get parent questions ${JSON.stringify(questionsError)}`);
	}

	const questionMap = {}
	questions.forEach((question) => {
		questionMap[question.id] = question
	})



	const { data: cOnComments, error: cOnCommentsError } = await supabase
		.from('questions')
		.select(
			`*`
		)
		.in('id', commentsOnComments.map((comment) => comment.parent_id))

	if (cOnCommentsError) {
		throw new Error(`Failed to get parent comments ${JSON.stringify(cOnCommentsError)}`);
	}

	const commentMap = {}
	cOnComments.forEach((comment) => {
		commentMap[comment.id] = comment;
	})


	comments.forEach((comment) => {
		if (comment.parent_type === 'question') {
			comment.parentQuestion = questionMap[comment.parent_id];
		} else {
			comment.parentComment = commentMap[comment.parent_id];
		}
	})

	return comments




}
