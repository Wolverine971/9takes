// src/lib/socialCards/questionSocialCard.ts
const QUESTIONS_BUCKET = 'questions';

export const QUESTION_SOCIAL_CARD_WIDTH = 1200;
export const QUESTION_SOCIAL_CARD_HEIGHT = 628;
export const QUESTION_SOCIAL_CARD_VERSION = 'v2';
export const QUESTION_SOCIAL_CARD_IMAGE_ID = `social-card-${QUESTION_SOCIAL_CARD_VERSION}`;
export const QUESTION_SOCIAL_CARD_VARIANT = QUESTION_SOCIAL_CARD_IMAGE_ID;
export const QUESTION_SOCIAL_CARD_EXT = 'png';
export const QUESTION_SOCIAL_CARD_FILENAME = `${QUESTION_SOCIAL_CARD_IMAGE_ID}.${QUESTION_SOCIAL_CARD_EXT}`;

export const buildQuestionSocialCardPath = (questionUrl: string): string =>
	`images/${questionUrl}/${QUESTION_SOCIAL_CARD_FILENAME}`;

export const isCurrentQuestionSocialCard = (path: string | null | undefined): boolean =>
	Boolean(path && path.endsWith(`/${QUESTION_SOCIAL_CARD_FILENAME}`));

// Backward-compatible export name kept to avoid broad refactors.
export const isQuestionSocialCardV1 = isCurrentQuestionSocialCard;

export const toQuestionPublicImageUrl = (supabaseUrl: string, path: string): string =>
	`${supabaseUrl}/storage/v1/object/public/${QUESTIONS_BUCKET}/${path}`;

export const toQuestionSocialCardRoute = (slug: string): string =>
	`https://9takes.com/questions/${slug}/social-card.png`;
