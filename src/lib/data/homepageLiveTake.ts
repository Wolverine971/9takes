// src/lib/data/homepageLiveTake.ts
// Live-take homepage: the hero question is a real live question, and after the private
// reveal the visitor can opt in to post the answer they already wrote.

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
	'Nothing leaves this tab until you choose to post it. If you post, your answer is added to the live question without your name, exactly as you wrote it, and the other answers open up. If you keep it private, it clears when you refresh.';

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
