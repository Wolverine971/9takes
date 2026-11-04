// src/lib/data/homepageLiveTake.ts
// Live-take homepage: one explicit post unlocks the real conversation.

// Question 203. The homepage's private practice set (homepagePracticeV2 "friendship") is
// written for this question, so changing it means writing a matching practice set.
export const LIVE_TAKE_SLUG = 'whats-criteria-considering-someone-friend';

/** How many other people's answers the homepage shows after the visitor's own take. */
export const LIVE_TAKE_ANSWER_LIMIT = 6;

export type LiveTakeAnswer = {
	id: number;
	text: string;
	type: number | null;
};

export type LiveTakeOwnAnswer = {
	id: number;
	text: string;
};

export type LiveTake = {
	questionId: number;
	slug: string;
	title: string;
	responses: number;
	/** Signed-in takes post from the visitor's account, so the copy must not promise anonymity. */
	signedIn: boolean;
	/** The give-first gate (can_see_comments_3) already passes: this visitor has a take here. */
	answered: boolean;
	ownTake: LiveTakeOwnAnswer | null;
	/**
	 * Other people's answers. Empty until the visitor has answered; the design preview
	 * fills it only for admins reviewing the posted state.
	 */
	answers: LiveTakeAnswer[];
};

/** POST /api/homepage/answer success body. */
export type LiveTakePostResult = {
	ok: true;
	alreadyAnswered: boolean;
	questionId: number;
	commentId: number | null;
	commentAnalytics: unknown;
	isAnonymous: boolean;
	ownTake: LiveTakeOwnAnswer | null;
	answers: LiveTakeAnswer[];
	responses: number;
};

export const LIVE_TAKE_ANSWER_FAQ =
	'Posting makes your answer public and opens the other answers. Guests post without a name; signed-in visitors post from their account. An unsubmitted draft stays in this tab and clears when you refresh.';

/** Describe the live product independently of the private practice fallback. */
export const liveTakeFaqs = [
	{
		question: 'What is 9takes?',
		answer:
			'A question-and-answer community for understanding why people see the same situation differently. Share your own answer first, then read how other people responded.'
	},
	{ question: 'What happens to my answer here?', answer: LIVE_TAKE_ANSWER_FAQ },
	{
		question: 'Who wrote the answers?',
		answer:
			'The live answers come from community members. After posting, you can also explore a separate comparison of AI-written examples. Those examples are labeled and do not assess your personality.'
	},
	{
		question: 'Why nine perspectives?',
		answer:
			'The nine refers to the Enneagram’s patterns of motivation, not a guaranteed number of answers. Each question has a different mix of people and types. You don’t need to know your type to begin.'
	},
	{
		question: 'Can I edit or remove my answer?',
		answer:
			'Signed-in authors can edit their own answers from the comment options on the question page. Guests do not have edit or delete controls. For a guest correction or a removal request, email usersup@9takes.com with the question link and the answer you mean.'
	},
	{
		question: 'Do I need an account to join in?',
		answer:
			'You can post your first answer to a question without an account. Sign in to reply to other people. Answering first lets you compare your own reaction before the conversation influences it.'
	}
];

type TakeRow = {
	id: number;
	comment: string;
	is_own?: boolean;
	ranking_low_effort?: boolean;
	profiles?: { enneagram?: string | number | null } | null;
};

export function toLiveTakeAnswers(
	takes: TakeRow[],
	limit = LIVE_TAKE_ANSWER_LIMIT
): LiveTakeAnswer[] {
	return takes
		.filter((take) => take.comment?.trim())
		.slice(0, limit)
		.map((take) => {
			const type = Number(take.profiles?.enneagram);
			return {
				id: take.id,
				text: take.comment.trim(),
				type: Number.isInteger(type) && type >= 1 && type <= 9 ? type : null
			};
		});
}

/**
 * Splits a gated take page into the visitor's own take and other people's answers.
 * Low-effort takes go last so the homepage leads with the most thoughtful answers.
 */
export function splitLiveTakes(
	takes: TakeRow[],
	ownTakes: TakeRow[],
	limit = LIVE_TAKE_ANSWER_LIMIT
): { ownTake: LiveTakeOwnAnswer | null; answers: LiveTakeAnswer[] } {
	const own = [...ownTakes, ...takes].find((take) => take.is_own && take.comment?.trim());
	const others = takes.filter((take) => !take.is_own && take.id !== own?.id);
	const ranked = [
		...others.filter((take) => !take.ranking_low_effort),
		...others.filter((take) => take.ranking_low_effort)
	];
	return {
		ownTake: own ? { id: own.id, text: own.comment.trim() } : null,
		answers: toLiveTakeAnswers(ranked, limit)
	};
}
