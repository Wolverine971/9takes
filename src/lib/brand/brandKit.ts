// src/lib/brand/brandKit.ts
// The 9takes brand kit as data: one source for /admin/brand, for docs/brand/brand-assets.md
// (`pnpm gen:brand-kit`) and for agents. When the brand changes, change it here and regenerate.
// Canonical sources it summarizes: docs/brand/messaging-hierarchy.md (words),
// docs/brand/cold-light.md (look). If this file and those docs disagree, the docs win; fix this.
import { COLORS, STATUES } from './brandTokens';

export const BRAND_KIT_UPDATED = '2026-11-06';

export const SOURCES = [
	{ path: 'docs/brand/messaging-hierarchy.md', what: 'The six locked lines and how to use each' },
	{ path: 'docs/brand/cold-light.md', what: 'Visual identity: color, type, statues, logo, rules' },
	{ path: 'docs/design-system.md', what: 'Tokens and components in code' },
	{ path: 'docs/brand/brand-style-guide-v2.md', what: 'Long-form voice and tone guide' },
	{ path: '.claude/commands/carousel.md', what: 'Instagram carousel production (current)' },
	{ path: '.claude/commands/twitter-post.md', what: 'X post formats and kill rules' }
] as const;

// ---------------------------------------------------------------------------
// Words

export const HIERARCHY = [
	{
		level: 'Movement belief',
		line: 'The internet collapses nine perspectives into one winning take.',
		job: 'Names the problem in the world.',
		useIn: 'Manifestos, founder posts, podcasts, category essays.'
	},
	{
		level: 'Brand promise',
		line: 'See the emotions behind every take.',
		job: 'What a person gains from 9takes.',
		useIn: 'Bios, page furniture, social profiles, closing lines.'
	},
	{
		level: 'Product ritual',
		line: 'Answer before the crowd.',
		job: 'The behavior that makes 9takes different.',
		useIn: 'Calls to action and product demos.'
	},
	{
		level: 'Product explanation',
		line: 'One question, nine perspectives.',
		job: 'The product in the fewest words.',
		useIn: 'Fast descriptions, homepage, outreach.'
	},
	{
		level: 'Personal payoff',
		line: 'Stop mistaking someone else’s alarm for a defect.',
		job: 'Makes the benefit personal.',
		useIn: 'Stories about conflict, relationships, blind spots.'
	},
	{
		level: 'Core formula',
		line: 'Honesty + Curiosity = Clarity.',
		job: 'The three steps of every question, in order.',
		useIn: 'How-it-works in one breath: about, onboarding, bios, this page.'
	}
] as const;

export const NARRATIVE =
	'We each experience our own emotional alarm as reality. Another person’s alarm can look irrational, obstructive, weak, or aggressive from the outside. Online, the crowd hardens that mistake: one interpretation wins the room and the rest disappear. 9takes opens the room again. You answer before the crowd can shape you, then compare nine perspectives on the same question and see the emotions underneath each one.';

export const ACCEPTANCE_TEST = [
	{
		q: 'What is wrong with the current environment?',
		a: 'One interpretation wins and hides the rest.'
	},
	{
		q: 'What does 9takes do differently?',
		a: 'You answer before seeing the crowd, then nine perspectives open up.'
	},
	{
		q: 'Why does that matter personally?',
		a: 'It exposes blind spots and the emotional logic other people are using.'
	},
	{ q: 'What should I do next?', a: 'Answer one real question.' }
] as const;

/** Lines already in use on the site or in social. Safe to reuse as-is. */
export const CATCHPHRASES = [
	{ line: 'Give your take. Read theirs.', where: 'Homepage hero' },
	{ line: 'Your take unlocks theirs.', where: 'Homepage lede' },
	{
		line: 'Say what you really think. Anonymously. Before you see anyone else’s.',
		where: 'Homepage lede'
	},
	{ line: 'Hidden until you answer.', where: 'Cold Light story; share cards, Stories' },
	{ line: 'That’s one take. There’s nine. Go add yours.', where: 'Reel and carousel sign-off' },
	{ line: 'Same moment. Nine internal worlds.', where: 'Carousel covers' },
	{ line: 'Which one just called you out?', where: 'Carousel last slide, captions' },
	{ line: 'Don’t judge people. Read them instead.', where: 'Captions, founder posts' },
	{
		line: 'MBTI tells you what you do. Enneagram tells you why you can’t stop.',
		where: 'X, Quora, MBTI-bridge content'
	},
	{ line: 'Self-discovery over diagnosis.', where: 'Values; how we talk about typing' },
	{ line: 'Questions over verdicts.', where: 'Values; how analysis is framed' },
	{ line: 'Understanding over judgment.', where: 'Values' }
] as const;

/** Supporting vocabulary from the hierarchy. Never a replacement for a locked line. */
export const VOCABULARY = [
	{ term: 'The Nine', note: 'The nine perspective patterns. Use after the product explanation.' },
	{ term: 'The Chorus', note: 'The reveal of the other takes. Explain on first use.' },
	{ term: 'The Mirror Moment', note: 'Where an analysis turns toward the reader.' },
	{ term: 'Anger, fear and shame', note: 'The three alarms. The simple entry to the Enneagram.' },
	{ term: 'One Take', note: 'DJ’s on-camera Reel series. A format, not a message.' },
	{ term: 'Cold Light', note: 'The visual world. Internal design language.' }
] as const;

export const RETIRED_LINES = [
	{
		line: 'One situation, 9 ways to see it.',
		why: 'Replaced by "One question, nine perspectives."'
	},
	{
		line: 'Give Your Take First / Then See 9 Different Perspectives',
		why: 'Old /questions card copy'
	},
	{ line: 'Personality-max your EQ', why: 'Campaign language only, never positioning' },
	{ line: 'Open-source conflict resolution', why: 'Internal metaphor only' },
	{ line: 'Send this to the Type 8 in your life', why: 'Removed from Reels (reel-flow.md)' },
	{ line: 'Streetlamp Symposium, sodium amber, lamplight', why: 'Visual world retired 2026-11-05' }
] as const;

export const VOICE = [
	{
		trait: 'Tactically direct',
		means: 'No fluff. Say the useful thing.',
		example: 'Type 6s signal loyalty through questions. Answer them; don’t get defensive.'
	},
	{
		trait: 'Socially savvy',
		means: 'Tie the insight to a real-world win.',
		example: 'Type 8s respect directness. Type 9s need a gentler way in.'
	},
	{
		trait: 'Respectfully provocative',
		means: 'Push on comfort zones. Honest, never mean.',
		example: 'If your friends always agree with you, you’re missing intel.'
	},
	{
		trait: 'Pattern-recognition focused',
		means: 'Show the emotional logic.',
		example: 'She’s not being difficult. Type 1s need it done right the first time.'
	},
	{
		trait: 'Results-driven',
		means: 'End on something to try.',
		example: 'Try this tonight and watch the dynamic shift.'
	}
] as const;

export const WRITING_RULES = [
	'Lead with the human situation; the Enneagram is the map, not the hero. (IG captions may open type-first.)',
	'Rhythm: hook, insight, action step.',
	'Verbs we like: decode, navigate, map, read, unlock, resolve.',
	'Hedge typing of real people: "my read", never a diagnosis. Disclaimer: "Speculative personality read based on publicly available behavior, not diagnosis."',
	'No politics, no diagnosis, no cruelty.',
	'Never quote what a take says before someone answers: not in previews, share cards, emails or posts.'
] as const;

// ---------------------------------------------------------------------------
// Look

export const PALETTE = [
	{ name: 'Night', hex: COLORS.night, token: '--bg', use: 'Every background. Never pure #000.' },
	{ name: 'Surface', hex: COLORS.surface, token: '--surface', use: 'Cards and panels.' },
	{
		name: 'Indigo',
		hex: COLORS.indigo,
		token: '--accent',
		use: 'Statue tint, glows, fills. Never text or focus rings.'
	},
	{
		name: 'Lavender',
		hex: COLORS.lavender,
		token: '--highlight',
		use: 'The reveal: kickers, quiet italic lines, focus, links.'
	},
	{
		name: 'Mint',
		hex: COLORS.mint,
		token: '--action',
		use: 'The one action ("give your take"). About one per view.'
	},
	{ name: 'Text', hex: COLORS.text, token: '--text', use: 'Headlines and body.' },
	{ name: 'Muted', hex: COLORS.textMuted, token: '--text-muted', use: 'Secondary text.' },
	{ name: 'Faint', hex: COLORS.textFaint, token: '--text-faint', use: 'Labels, footers, metadata.' }
] as const;

export const TINT_RAMP = [
	{ at: '0', hex: '#01010D', lands: 'Deepest shadow (Night)' },
	{ at: '0.30', hex: '#160A46', lands: 'Shadow' },
	{ at: '0.62', hex: '#6331FB', lands: 'Midtones (Indigo)' },
	{ at: '0.88', hex: '#BEAAFF', lands: 'Highlights (Lavender)' },
	{ at: '1', hex: '#ECE6FF', lands: 'Brightest highlight' }
] as const;

export const TYPEFACES = [
	{
		name: 'Anton',
		token: '--font-shout',
		role: 'The take. What gets said out loud.',
		rules: 'Uppercase only. Headlines 40px and up. 2 to 5 words. Never a full sentence.',
		sample: 'ANSWER BEFORE THE CROWD',
		cssVar: 'var(--font-shout)'
	},
	{
		name: 'Playfair Display italic',
		token: '--font-voice',
		role: 'The feeling. What’s underneath.',
		rules: 'Second line of a headline, inner-voice lines. Lavender.',
		sample: 'What will they think of me?',
		cssVar: 'var(--font-voice)'
	},
	{
		name: 'Archivo',
		token: '--font-talk',
		role: 'The conversation. Everything people read and type.',
		rules: 'Body, takes, buttons, labels. Small caps labels get letter-spacing. No fourth face.',
		sample: 'One question, nine perspectives. Your take unlocks theirs.',
		cssVar: 'var(--font-talk)'
	}
] as const;

export const LOGOS = [
	{
		label: 'Nine-mask mark, transparent',
		file: '/brand/9takes-nine-mask-logo.png',
		size: '512×512 PNG',
		use: 'Master mark. Overlays, decks, watermarks.'
	},
	{
		label: 'Nine-mask mark on Night',
		file: '/brand/9takes-nine-mask-logo-512.png',
		size: '512×512 PNG',
		use: 'Profile photos (IG, X), JSON-LD logo.'
	},
	{
		label: 'Mark on Night, small',
		file: '/brand/9takes-nine-mask-logo-192.png',
		size: '192×192 PNG',
		use: 'Email headers, small avatars.'
	},
	{
		label: 'App icon',
		file: '/brand/app-icon-nine-mask-512.png',
		size: '512×512 PNG',
		use: 'PWA / home-screen icon.'
	},
	{
		label: 'App icon, maskable',
		file: '/brand/app-icon-nine-mask-maskable-512.png',
		size: '512×512 PNG',
		use: 'Android adaptive icon (safe-zone padded).'
	},
	{
		label: 'Apple touch icon',
		file: '/brand/apple-touch-icon-nine-mask.png',
		size: '180×180 PNG',
		use: 'iOS home screen.'
	},
	{
		label: 'Favicon',
		file: '/favicon-nine-mask.ico',
		size: 'ICO 16/32/48',
		use: 'Browser tab.'
	}
] as const;

export const LOGO_RULES = [
	'The mark is the nine masks in the statue tint. It is a recolor of the existing mark, not a redraw.',
	'Wordmark: "9takes" set live in Archivo Bold, lowercase, next to the mark. There is no separate wordmark image.',
	'Always on Night or a dark surface. No amber-lined or cream versions (retired).',
	'Retired logo files (cube, amber wordmarks, v6-final) live in docs/brand/retired-assets/. Never use them.'
] as const;

export const STATUE_RULES = [
	'Statues only. No photos of people, places or phones as brand imagery.',
	'Dry, matte, weathered marble with blank carved eyes. One light from the upper left on black.',
	'Restrained expressions, like real sculpture. No text inside the image.',
	'Every statue gets the same indigo tint ramp after generation. Never hand-tint or recolor per type.',
	'Agents never generate images. They write the prompt; DJ runs it in ChatGPT on his subscription.'
] as const;

export const STATUE_PROMPT_TEMPLATE = `A classical Greek marble statue, [SUBJECT AND POSE: e.g. a young woman covering her mouth, eyes wide, mid-gasp], carved in dry, matte, weathered grey marble with visible pores and chips. Blank carved eyes with no pupils. Restrained, sculptural expression, not theatrical. Lit by a single soft light from the upper left, deep shadows falling to the lower right. Pure black background. Neutral grey stone only: no color, no tint, no warm light, no glow. No text, no lettering, no frame. Photographed like a museum sculpture, [CROP: head and shoulders / waist up / two figures], portrait orientation 4:5.`;

export const TINT_COMMAND =
	'node scripts/cold-light-tint.mjs <grey-image> static/brand/statues/<name>.webp --max-width 1200';

export const STATUE_LIBRARY = Object.entries(STATUES).map(([id, statue]) => ({
	id,
	label: statue.label,
	emotion: statue.emotion,
	file: `/${statue.file.replace(/^static\//, '')}`
}));

// ---------------------------------------------------------------------------
// Channels

export const ACCOUNTS = [
	{
		platform: 'Instagram',
		handle: '@9takesdotcom',
		url: 'https://instagram.com/9takesdotcom',
		role: 'Brand account. Carousels, Reels, Stories.'
	},
	{
		platform: 'X',
		handle: '@9takesdotcom',
		url: 'https://x.com/9takesdotcom',
		role: 'Brand account (display name "DJocrates"). Used as twitter:site.'
	},
	{
		platform: 'Instagram',
		handle: '@djwayne3',
		url: 'https://instagram.com/djwayne3',
		role: 'DJ’s personal account. BuildOS warmups; don’t cross-post 9takes brand content by default.'
	},
	{
		platform: 'X',
		handle: '@djwayne3',
		url: 'https://x.com/djwayne3',
		role: 'DJ’s personal account. Used as twitter:creator.'
	}
] as const;

export const BIOS = {
	instagram: {
		status:
			'Proposed. No current IG bio is saved in the repo; paste what is live here when it changes.',
		name: '9takes · Enneagram & Personality',
		bio: 'See the emotions behind every take.\nOne question, nine perspectives.\nAnswer before the crowd ↓',
		link: 'Link in bio goes to a live question page, not a blog post.'
	},
	x: {
		status:
			'Live bio (2026-05-19) still sells "why you’re stuck". Proposed rewrite below follows the hierarchy.',
		live: 'Why you’re stuck explained by your Enneagram type. 300+ deep dives on the 9 ways people think. Your type’s patterns. Your type’s fix. Find yours',
		bio: 'One question, nine perspectives. Answer before the crowd, then see the emotions behind every take. Enneagram reads on 460+ famous people ↓',
		link: 'https://9takes.com/questions'
	}
} as const;

export const INSTAGRAM = {
	specs: [
		{
			what: 'Feed post / carousel slide',
			size: '1080×1350 (4:5)',
			note: 'Profile grid crops to 3:4, so keep text 40px+ from the left and right edges. Brand cards already do.'
		},
		{
			what: 'Story / Reel cover',
			size: '1080×1920 (9:16)',
			note: 'Keep text out of the top 250px and bottom 340px (IG UI).'
		},
		{
			what: 'Profile photo',
			size: '320×320 shown as a circle',
			note: 'Use the nine-mask mark on Night (512 PNG).'
		},
		{
			what: 'Highlight cover',
			size: '1080×1920, center 600px circle',
			note: 'Mark or one Anton word on Night.'
		}
	],
	formats: [
		{
			name: 'Story / person deck',
			detail:
				'9 to 11 slides. Cover, 5 to 7 tidbits (≤115 chars), story slides, type reveal, mirror slide with no CTA.'
		},
		{
			name: 'Teaching deck',
			detail: '9 to 13 slides. One idea per slide. Caption 90 to 160 words.'
		},
		{
			name: 'Lookup deck',
			detail: '15 to 20 slides: one per type or per person, built to be saved.'
		},
		{ name: 'Checklist', detail: '7 slides.' },
		{ name: 'Manifesto', detail: '8 slides built on the movement belief.' },
		{
			name: 'Reel',
			detail:
				'26 seconds default, about 52 voiceover words. On-screen text never repeats the voiceover. No CTA card.'
		},
		{
			name: 'One Take (DJ on camera)',
			detail: 'Six beats, 85 to 90 seconds plus a 45-second cut. Open on a verified quote.'
		}
	],
	rules: [
		'One bright slide per deck. Never two diagram slides in a row.',
		'Captions: person posts may open type-first in the type’s own vernacular, then the person as proof, then "Are you a Type N? Tag one."',
		'CTA is participation ("comment your number"), not "link in bio" on every post. Blog link goes in the pinned comment.',
		'Never show a take’s text before someone answers. Show counts, types and blurred rows instead.'
	],
	commands: ['/moodboard → /carousel', '/distribute-instagram', '/instagram-saves', '/one-take']
} as const;

export const X = {
	specs: [
		{ what: 'Post image', size: '1600×900 (16:9)', note: 'Also fine: 1080×1350 portrait.' },
		{
			what: 'Header',
			size: '1500×500 (3:1)',
			note: 'Profile photo covers the bottom-left; the brand card keeps text right of it.'
		},
		{ what: 'Profile photo', size: '400×400', note: 'Nine-mask mark on Night.' },
		{
			what: 'Link card',
			size: '1200×630',
			note: 'Pulled from each page’s og:image (the link previews below).'
		}
	],
	formats: [
		'"According to psychology…"',
		'"My therapist told me…"',
		'"How to deal with…"',
		'One-liner',
		'"Just heal your X"',
		'Pop-culture typing',
		'"Reply with your type"'
	],
	rules: [
		'No link in the main post. Put it in the first reply.',
		'#enneagram never leads a post.',
		'At most one em dash.',
		'No "doing a series on…".',
		'Single posts 71 to 100 characters land best; threads 4 to 8 posts.',
		'Post 9 to 10 AM ET; threads at 8 PM. Reply to everything in the first hour.'
	],
	commands: ['/twitter-post', '/twitter', '/tweet-reply', '/twitter-warmup']
} as const;

export const TOOLS = [
	{
		name: 'Brand card studio',
		where: '/admin/brand#studio',
		status: 'current',
		note: 'Every format, same renderer as the site previews.'
	},
	{
		name: 'pnpm brand:card',
		where: 'scripts/brand-card.ts',
		status: 'current',
		note: 'Same cards from the terminal. Agents use this.'
	},
	{
		name: 'pnpm gen:brand-og',
		where: 'static/brand/og/',
		status: 'current',
		note: 'Re-renders every link preview after a copy change.'
	},
	{
		name: 'Tint script',
		where: 'scripts/cold-light-tint.mjs',
		status: 'current',
		note: 'Applies the statue tint to a grey image.'
	},
	{
		name: 'Blog image variants',
		where: 'scripts/blog-image-variants.mjs',
		status: 'current',
		note: 'Builds the blog hero set from a saved image.'
	},
	{
		name: 'Poster generator',
		where: '/admin/asset-generators/poster-generator',
		status: 'old brand',
		note: 'Untinted backgrounds, amber QR code. Use the studio instead until it is repainted.'
	},
	{
		name: 'Question print',
		where: '/admin/asset-generators/question-print',
		status: 'old brand',
		note: 'Noticia, Inter, cream and amber.'
	},
	{
		name: 'Zine creator',
		where: '/admin/asset-generators/zine-creator',
		status: 'off-brand',
		note: 'Slate colors; print only.'
	}
] as const;

// ---------------------------------------------------------------------------
// Rules + open decisions

export const ALWAYS = [
	'Dark only. Night background, never pure black.',
	'Show that takes exist before someone answers: counts, types, blurred rows.',
	'About one mint element per view: the action.',
	'Pair the loud line with the quiet one: Anton, then Playfair italic.',
	'Corners: 4px (badges), 10px (buttons, inputs), 16px (cards), full (pills).',
	'Statues get the shared tint ramp.'
] as const;

export const NEVER = [
	'Show what a take says before someone answers, anywhere.',
	'Amber, orange or warm light. Including old templates.',
	'Indigo as text or focus outlines.',
	'A fourth typeface, or Anton in a full sentence.',
	'Hacker clichés: code rain, glitch text, skulls.',
	'Cruelty. Honest, never mean.',
	'AI-generated images by agents. Write the prompt; DJ runs it.'
] as const;

/** Conflicts found across the docs that need a DJ decision. Remove once decided. */
export const OPEN_DECISIONS = [
	{
		topic: 'Carousel size',
		detail:
			'canva-design-handoff.md and the brand cards use 4:5 (1080×1350); content-ops safe-zones doc uses 3:4 (1080×1440); teaching decks in carousel.md use 1:1.'
	},
	{
		topic: 'Photos of people in carousels',
		detail:
			'carousel.md story decks use real photos and a per-person accent color; Cold Light says statues only and one tint.'
	},
	{
		topic: 'Hashtags',
		detail: 'carousel.md says 12 to 18 tiered, distribute-instagram 15 to 20, One Take 3 at most.'
	},
	{
		topic: 'Em dashes',
		detail: 'X voice guide uses them for impact; One Take allows none; X kill rules allow one.'
	},
	{
		topic: 'Bios',
		detail:
			'IG bio was never logged; X bio still leads with "why you’re stuck". Proposals are above.'
	}
] as const;
