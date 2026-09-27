// src/lib/data/homepageLiveTake.ts
// Live-take homepage preview: the hero question is a real live question, and after the private
// reveal the visitor can opt in to post the answer they already wrote.

export const LIVE_TAKE_SLUG = 'whats-criteria-considering-someone-friend';

export type LiveTakeAnswer = {
	id: number;
	text: string;
	type: number | null;
};

export type LiveTake = {
	slug: string;
	title: string;
	responses: number;
	/** Real answers, loaded only for admins reviewing the preview. Everyone else keeps the give-first gate. */
	answers: LiveTakeAnswer[];
};

export const LIVE_TAKE_ANSWER_FAQ =
	'Nothing leaves this tab until you choose to post it. If you post, your answer is added to the live question without your name, exactly as you wrote it, and the other answers open up. If you keep it private, it clears when you refresh.';

export function toLiveTakeAnswers(
	takes: {
		id: number;
		comment: string;
		profiles?: { enneagram?: string | number | null } | null;
	}[],
	limit = 6
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
