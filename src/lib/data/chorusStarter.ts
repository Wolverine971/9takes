// src/lib/data/chorusStarter.ts
// Versioned with the prompt in code, so the entry question cannot ship without its reveal.
// The examples are illustrative AI answers (Type 1 first), never user comments or
// claims about someone's type.

export type BundledChorusPrompt = {
	/** PostHog `prompt_version` for chorus events on this question. */
	promptVersion: string;
	placeholder: string;
	/** Shown under the empty answer box. */
	hint: string;
	/** Nine example answers, Type 1 through Type 9. */
	examples: readonly string[];
};

/** The default give-first question on personality pages (since 2026-11-02). */
export const CHORUS_STARTER_SLUG = 'what-do-people-get-wrong-about-you-when-they-first-meet-you';

const RETIRED_KID_STARTER_SLUG = 'what-were-you-like-as-a-kid-in-3-words';

const BUNDLED_CHORUS_PROMPTS: Readonly<Record<string, BundledChorusPrompt>> = {
	[CHORUS_STARTER_SLUG]: {
		promptVersion: 'first_impression_v1',
		placeholder: 'They think I’m… Really, I’m…',
		hint: 'One line is enough.',
		examples: [
			'That I’m judging them. Mostly I’m judging me.',
			'That I want something. I just like you already.',
			'That I’m fake. I’m not performing, I’m just on.',
			'That I’m dramatic. I’m just not pretending it’s fine.',
			'That I’m cold. I’m listening.',
			'That I’m negative. I’m planning for the bad version so you don’t have to.',
			'That I’m shallow. Fast isn’t the same thing.',
			'That I’m mad. That’s just my face.',
			'That I don’t care. I just don’t need to win.'
		]
	},
	// Starter until 2026-11-02 (57 answers, mostly three adjectives). Kept so
	// day-old cached pages still showing it can post answers, and as a fallback.
	[RETIRED_KID_STARTER_SLUG]: {
		promptVersion: 'three_words_v1',
		placeholder: 'Three words that describe you as a kid…',
		hint: 'Just three words. No explanation needed.',
		examples: [
			'Earnest, bossy, careful.',
			'Chatty, sweet, watchful.',
			'Fast, loud, first.',
			'Dreamy, dramatic, elsewhere.',
			'Quiet, curious, unsupervised.',
			'Careful, loyal, worried.',
			'Loud, sticky, everywhere.',
			'Stubborn, loud, protective.',
			'Easygoing, dreamy, content.'
		]
	}
};

/** The bundled prompt for a question, or null when its examples live only in the database. */
export function bundledChorusPrompt(
	questionUrl: string | null | undefined
): BundledChorusPrompt | null {
	if (!questionUrl || !Object.hasOwn(BUNDLED_CHORUS_PROMPTS, questionUrl)) return null;
	return BUNDLED_CHORUS_PROMPTS[questionUrl];
}
