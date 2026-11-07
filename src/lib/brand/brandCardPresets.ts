// src/lib/brand/brandCardPresets.ts
// Named cards. Link-preview presets (kind: 'og') are pre-rendered to static/brand/og/ by
// `pnpm gen:brand-og`; pages point their og:image at `ogImagePath(id)`. Social presets are
// starting points on /admin/brand and for `pnpm brand:card -- --preset <id>`.
// Copy follows docs/brand/messaging-hierarchy.md. Anton lines stay short and never a sentence.
import type { CardFormat, StatueId } from './brandTokens';

export type PresetCard =
	| {
			template: 'statement';
			headline: string;
			voice?: string;
			kicker?: string;
			art?: 'statue' | 'masks' | 'none';
			statue?: StatueId;
			footer?: string;
	  }
	| { template: 'question'; question: string; kicker?: string; action?: string; footer?: string }
	| {
			template: 'person';
			name: string;
			type?: number | null;
			voice?: string;
			kicker?: string;
			portrait?: string | null;
	  }
	| { template: 'slide'; index?: string; headline?: string; body: string; voice?: string };

export interface BrandCardPreset {
	id: string;
	label: string;
	kind: 'og' | 'social';
	format: CardFormat;
	/** Where it's used, for humans and agents. */
	usedOn: string;
	card: PresetCard;
}

export const OG_IMAGE_DIR = 'brand/og';
/** Bump when the og presets change so platforms refetch (they cache by URL). */
export const OG_IMAGE_VERSION = '2026-11-06';

export const ogImagePath = (id: string): string =>
	`/${OG_IMAGE_DIR}/${id}.jpg?v=${OG_IMAGE_VERSION}`;
export const ogImageUrl = (id: string): string => `https://9takes.com${ogImagePath(id)}`;

export const BRAND_CARD_PRESETS: BrandCardPreset[] = [
	// ---- Link previews (1200x630) ----
	{
		id: 'home',
		label: 'Homepage',
		kind: 'og',
		format: 'og',
		usedOn: '/',
		card: {
			template: 'statement',
			kicker: 'One question, nine perspectives',
			headline: 'Give your take',
			voice: 'Then see the emotions behind every take.',
			art: 'masks'
		}
	},
	{
		id: 'default',
		label: 'Site default',
		kind: 'og',
		format: 'og',
		usedOn:
			'Every page without its own image: /community, /how-to-guides, /blog, auth pages, category fallbacks',
		card: {
			template: 'statement',
			kicker: 'One question, nine perspectives',
			headline: 'See the emotions',
			voice: 'behind every take.',
			art: 'masks'
		}
	},
	{
		id: 'questions',
		label: 'Questions hub',
		kind: 'og',
		format: 'og',
		usedOn: '/questions, /questions/categories, question-card fallback',
		card: {
			template: 'statement',
			kicker: '9takes questions',
			headline: 'Answer before the crowd',
			voice: 'One question, nine perspectives.',
			statue: 'whisper'
		}
	},
	{
		id: 'personality-analysis',
		label: 'Personality analysis hub',
		kind: 'og',
		format: 'og',
		usedOn: '/personality-analysis, /personality-analysis/categories, type hubs (fallback)',
		card: {
			template: 'statement',
			kicker: 'Case files · all nine types',
			headline: 'Enneagram celebrities',
			voice: 'Famous people, typed. Read the emotions under the headlines.',
			statue: 'smirk'
		}
	},
	{
		id: 'enneagram-corner',
		label: 'Enneagram Corner',
		kind: 'og',
		format: 'og',
		usedOn: '/enneagram-corner (and its category intros)',
		card: {
			template: 'statement',
			kicker: 'Enneagram Corner',
			headline: 'The Enneagram',
			voice: 'decoded.',
			statue: 'fear'
		}
	},
	{
		id: 'manifesto',
		label: 'Manifesto',
		kind: 'og',
		format: 'og',
		usedOn: '/manifesto',
		card: {
			template: 'statement',
			kicker: 'The 9takes manifesto',
			headline: 'One take wins',
			voice: 'The internet collapses nine perspectives into one winning take.',
			statue: 'anger'
		}
	},
	{
		id: 'enneagram-test',
		label: 'Enneagram test',
		kind: 'og',
		format: 'og',
		usedOn: '/enneagram-test, /enneagram-test/result/[token]',
		card: {
			template: 'statement',
			kicker: 'Free Enneagram test',
			headline: "What's your type?",
			voice: 'It starts with emotion, not behavior.',
			statue: 'shame'
		}
	},
	{
		id: 'enneagram-test-read',
		label: 'Friend read link',
		kind: 'og',
		format: 'og',
		usedOn: '/enneagram-test/read/[token] (texted to friends; no name on the card)',
		card: {
			template: 'statement',
			kicker: 'An honest read',
			headline: "What's your read?",
			voice: 'Someone who knows you wants your honest take on them.',
			statue: 'friends'
		}
	},
	{
		id: 'book-session',
		label: 'Book a session',
		kind: 'og',
		format: 'og',
		usedOn: '/book-session',
		card: {
			template: 'statement',
			kicker: 'Free beta · 1-on-1',
			headline: 'Experimental Enneagram therapy',
			voice: 'What are you trying to figure out?',
			statue: 'dialogue'
		}
	},

	// ---- Social starters ----
	{
		id: 'ig-formula',
		label: 'IG: the core formula',
		kind: 'social',
		format: 'ig-post',
		usedOn: 'Instagram feed, pinned post, highlight cover',
		card: {
			template: 'statement',
			kicker: 'How 9takes works',
			headline: 'Honesty + Curiosity = Clarity',
			voice: 'Answer first. Then see why everyone else saw it differently.',
			statue: 'fear'
		}
	},
	{
		id: 'ig-question',
		label: 'IG: question of the day',
		kind: 'social',
		format: 'ig-post',
		usedOn: 'Instagram feed or carousel cover; swap in a live question',
		card: {
			template: 'question',
			question:
				'Your friend cancels plans last minute for the third time. What do you actually feel first?'
		}
	},
	{
		id: 'ig-slide',
		label: 'IG: carousel body slide',
		kind: 'social',
		format: 'ig-post',
		usedOn: 'Teaching and story carousels (slides 2 to N)',
		card: {
			template: 'slide',
			index: '02 / 07',
			headline: 'The alarm',
			body: 'Type 6s scan for what could go wrong before they relax. From the outside it looks like doubt. From the inside it feels like loyalty: someone has to check.',
			voice: 'Stop mistaking someone else’s alarm for a defect.'
		}
	},
	{
		id: 'ig-story-question',
		label: 'IG Story: answer first',
		kind: 'social',
		format: 'ig-story',
		usedOn: 'Stories pointing at a live question (link sticker goes in the empty lower third)',
		card: {
			template: 'statement',
			kicker: "Today's question",
			headline: 'Answer before the crowd',
			voice: 'Nine takes are waiting. You go first.',
			statue: 'smirk'
		}
	},
	{
		id: 'ig-person',
		label: 'IG: person card',
		kind: 'social',
		format: 'ig-post',
		usedOn: 'Personality-analysis promo posts; pick any portrait from /types',
		card: {
			template: 'person',
			name: 'Adam Sandler',
			type: 9,
			portrait: '/types/9s/Adam-Sandler.webp'
		}
	},
	{
		id: 'x-header',
		label: 'X profile header',
		kind: 'social',
		format: 'x-header',
		usedOn: 'X @9takesdotcom header (profile photo covers the bottom-left, so text sits right)',
		card: {
			template: 'statement',
			headline: 'One question, nine perspectives',
			voice: 'See the emotions behind every take.',
			art: 'masks'
		}
	},
	{
		id: 'x-movement',
		label: 'X: the movement belief',
		kind: 'social',
		format: 'x-post',
		usedOn: 'Founder posts, pinned post, manifesto threads',
		card: {
			template: 'statement',
			kicker: 'The movement',
			headline: 'One take wins',
			voice: 'The internet collapses nine perspectives into one winning take.',
			statue: 'friends'
		}
	},
	{
		id: 'x-question',
		label: 'X: question card',
		kind: 'social',
		format: 'x-post',
		usedOn: 'X posts that link a live question (put the link in a reply, not the main post)',
		card: {
			template: 'question',
			question:
				'My partner wants to move across the country for a job. I love where we live. Whose dream wins?'
		}
	}
];

export const getPreset = (id: string): BrandCardPreset | undefined =>
	BRAND_CARD_PRESETS.find((preset) => preset.id === id);
