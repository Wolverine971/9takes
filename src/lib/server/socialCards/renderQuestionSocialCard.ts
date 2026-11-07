// src/lib/server/socialCards/renderQuestionSocialCard.ts
// Question share card v4 (Cold Light, 2026-11-06). The shared brand renderer draws it, so the
// question card matches every other link preview: Night ground, one indigo light upper-left,
// the nine-mask mark, the question in Archivo and the mint "answer before the crowd" action.
// Only the question text goes on the card; never take or comment text.
import { renderBrandCard } from '$lib/server/brandCards/renderBrandCard';

export interface RenderQuestionSocialCardOptions {
	questionText: string;
	/** Kept for callers and logs; the v4 card does not print the URL. */
	questionUrl?: string;
	/** Legacy option, ignored: the brand renderer loads its own assets. */
	backgroundUrl?: string;
	/** Legacy option, ignored: the brand renderer loads its own fonts. */
	fontRegularUrl?: string;
	/** Legacy option, ignored: the brand renderer loads its own fonts. */
	fontBoldUrl?: string;
}

const FALLBACK_QUESTION = 'Share your perspective';

export async function renderQuestionSocialCard({
	questionText
}: RenderQuestionSocialCardOptions): Promise<Buffer> {
	const question = questionText.replace(/\s+/g, ' ').trim() || FALLBACK_QUESTION;
	return renderBrandCard({ template: 'question', question }, { format: 'og', output: 'png' });
}
