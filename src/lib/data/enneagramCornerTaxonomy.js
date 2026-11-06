// src/lib/data/enneagramCornerTaxonomy.js
// Two-level taxonomy for Enneagram Corner posts: section -> subtopic.
//
// A post's primary section is `type[0]` in its frontmatter (it drives the hub
// grouping and never changes the URL). Its subtopics live in a separate
// `subtopics` array of slugs from this file, e.g.
//
//   type: ['situational']
//   subtopics: ['real-life-dating', 'dating']
//
// Subtopic slugs are unique across ALL sections, so one slug always names one
// lane. A subtopic from another section cross-lists the post on that section's
// page (the dating post above also shows up under Relationships -> Dating).
//
// Plain JS with no imports so node scripts (audit:corner-subtopics, the blog
// pipelines) and the SvelteKit app share one list, like personClusterTags.js.
// Subtopics never get their own URLs (DJ, 2026-11-06): they are lanes on the
// section page, not pages.

/**
 * @typedef {{ slug: string, title: string, descriptor: string }} CornerSubtopic
 * @typedef {{
 *   slug: string,
 *   title: string,
 *   href: string,
 *   descriptor: string,
 *   subtopics: CornerSubtopic[]
 * }} CornerSection
 */

/** Sections in hub order; subtopics in on-page lane order. @type {CornerSection[]} */
export const CORNER_SECTIONS = [
	{
		slug: 'nine-types',
		title: 'The Nine Types',
		href: '/enneagram-corner/subtopic/nine-types',
		descriptor: 'One read per type, grouped by the center each type leads from.',
		subtopics: [
			{
				slug: 'gut-types',
				title: 'Gut types: 8, 9, 1',
				descriptor:
					'Anger is the engine. Each one handles it differently: push it out, numb it, or police it.'
			},
			{
				slug: 'heart-types',
				title: 'Heart types: 2, 3, 4',
				descriptor:
					'Shame is the engine. Attention goes to how they are seen, and what that says about their worth.'
			},
			{
				slug: 'head-types',
				title: 'Head types: 5, 6, 7',
				descriptor: 'Fear is the engine. Attention goes to what could go wrong, or what comes next.'
			}
		]
	},
	{
		slug: 'overview',
		title: 'Foundations',
		href: '/enneagram-corner/subtopic/overview',
		descriptor: 'Core concepts behind the Enneagram framework.',
		subtopics: [
			{
				slug: 'basics',
				title: 'Start here',
				descriptor: 'The core ideas, the questions everyone asks, and how common each type is.'
			},
			{
				slug: 'typing-yourself',
				title: 'Finding your type',
				descriptor: 'Fast ways to land on a type, and which free tests are worth your time.'
			},
			{
				slug: 'type-structure',
				title: 'Wings, lines & subtypes',
				descriptor:
					'The moving parts inside a type: wings, stress and growth lines, instincts, triads.'
			},
			{
				slug: 'origins',
				title: 'Origins & history',
				descriptor: 'Where the Enneagram came from and who shaped it.'
			},
			{
				slug: 'evidence',
				title: 'Science & criticism',
				descriptor:
					'What holds up, what does not, and where it sits next to other personality models.'
			}
		]
	},
	{
		slug: 'development',
		title: 'Growth',
		href: '/enneagram-corner/subtopic/development',
		descriptor: 'Move past your automatic patterns with type-aware strategy.',
		subtopics: [
			{
				slug: 'self-awareness',
				title: 'Self-awareness',
				descriptor: 'See your pattern clearly: strengths, blind spots, and the voice in your head.'
			},
			{
				slug: 'growth-plans',
				title: 'Growth plans',
				descriptor:
					'Type-specific practices, and longer programs for actually changing the pattern.'
			},
			{
				slug: 'shadow-work',
				title: 'Shadow work & self-sabotage',
				descriptor: 'The parts of your type you would rather not look at, and how they trip you up.'
			},
			{
				slug: 'communication-skills',
				title: 'Communication',
				descriptor: 'How each type talks, and what actually lands with them.'
			}
		]
	},
	{
		slug: 'relationships',
		title: 'Relationships',
		href: '/enneagram-corner/subtopic/relationships',
		descriptor: 'Why people react differently to the same situation.',
		subtopics: [
			{
				slug: 'couples',
				title: 'Couples & compatibility',
				descriptor: 'How each type loves, fights, and pairs up over the long run.'
			},
			{
				slug: 'dating',
				title: 'Dating',
				descriptor: 'First dates, early stages, apps, ghosting, and the moves each type gets wrong.'
			},
			{
				slug: 'love-languages',
				title: 'Love languages & attachment',
				descriptor: 'How each type gives and needs love, and why it gets misread.'
			},
			{
				slug: 'conflict-repair',
				title: 'Conflict & repair',
				descriptor:
					'Fixing what broke: apologies, warning signs, and the toxic loops to catch early.'
			},
			{
				slug: 'parents-kids',
				title: 'Parents & kids',
				descriptor: 'How each type parents, and how kids of each type show up.'
			},
			{
				slug: 'friendship',
				title: 'Friendships',
				descriptor: 'How each type makes, keeps, and loses friends.'
			}
		]
	},
	{
		slug: 'mental-health',
		title: 'Mental Health',
		href: '/enneagram-corner/mental-health',
		descriptor: 'Where psychology meets the Enneagram framework.',
		subtopics: [
			{
				slug: 'mental-health-basics',
				title: 'Start here',
				descriptor:
					'Where each type is vulnerable, and the early warning signs that something is off.'
			},
			{
				slug: 'anxiety-depression',
				title: 'Anxiety, depression & overthinking',
				descriptor: 'The same diagnosis feels different in each type. Here is how it shows up.'
			},
			{
				slug: 'trauma-crisis',
				title: 'Trauma & crisis',
				descriptor: 'How each type survives the worst moments, and what helps them come back.'
			},
			{
				slug: 'therapy-treatment',
				title: 'Therapy & medication',
				descriptor: 'Why the same therapy lands differently by type, and how each type resists it.'
			},
			{
				slug: 'addiction',
				title: 'Addiction & coping',
				descriptor: 'What each type reaches for when it cannot sit with the feeling.'
			},
			{
				slug: 'neurodivergence',
				title: 'ADHD, autism & neurodivergence',
				descriptor: 'Where wiring and personality overlap, and why they get mixed up.'
			},
			{
				slug: 'burnout-family',
				title: 'Burnout, work & family',
				descriptor: 'Mental health in the places you cannot walk away from: the job and the kids.'
			},
			{
				slug: 'mental-health-research',
				title: 'The research',
				descriptor: 'What the evidence says, and where it runs out.'
			}
		]
	},
	{
		slug: 'workplace',
		title: 'Career',
		href: '/enneagram-corner/subtopic/workplace',
		descriptor: 'How each type leads, follows, and burns out at work.',
		subtopics: [
			{
				slug: 'teams',
				title: 'Teams & coworkers',
				descriptor:
					'Which pairs click, which implode, and what each type needs from the people around them.'
			},
			{
				slug: 'leadership',
				title: 'Leadership',
				descriptor: 'How each type leads, and why the approach keeps backfiring.'
			},
			{
				slug: 'career-fit',
				title: 'Career fit',
				descriptor: 'The working conditions each type does its best work in.'
			},
			{
				slug: 'work-burnout',
				title: 'Burnout at work',
				descriptor: 'How each type runs itself into the ground on the job.'
			}
		]
	},
	{
		slug: 'situational',
		title: 'Real Life',
		href: '/enneagram-corner/subtopic/situational',
		descriptor: 'The same moment through nine perspectives.',
		subtopics: [
			{
				slug: 'social-life',
				title: 'Social life & first impressions',
				descriptor: 'Parties, compliments, first meetings, and what each type is scanning for.'
			},
			{
				slug: 'real-life-dating',
				title: 'Dating & love',
				descriptor: 'Red flags, ghosting, apps, and toxic patterns, type by type.'
			},
			{
				slug: 'dark-side',
				title: 'The dark side',
				descriptor: 'Manipulation, toxic traits, and narcissism. Every type has a version.'
			},
			{
				slug: 'stress-coping',
				title: 'Stress & coping',
				descriptor: 'How each type cracks under pressure, and what actually lets it unwind.'
			},
			{
				slug: 'real-life-mental-health',
				title: 'Mind & mental health',
				descriptor: 'Mental illness, ADHD, therapy, and the warning signs, read through type.'
			},
			{
				slug: 'ambition',
				title: 'Success & ambition',
				descriptor: 'What gets each type ahead, and the ways each one sabotages the win.'
			},
			{
				slug: 'family-childhood',
				title: 'Childhood & family',
				descriptor: 'What each type looked like as a kid, and how each one parents.'
			},
			{
				slug: 'trends',
				title: 'Zodiac & internet trends',
				descriptor:
					'Astrology, personality maxing, and the other systems people try to map onto types.'
			}
		]
	},
	{
		slug: 'resources',
		title: 'Resources',
		href: '/enneagram-corner/subtopic/resources',
		descriptor: 'Books, tools, and tests worth your time.',
		subtopics: [
			{
				slug: 'find-your-type',
				title: 'Find your type',
				descriptor: 'A short, practical path to your type.'
			},
			{
				slug: 'reading-list',
				title: 'Books, podcasts & people',
				descriptor: 'The sources worth learning from.'
			},
			{
				slug: 'other-systems',
				title: 'Enneagram vs. other systems',
				descriptor: 'How it compares with Myers-Briggs and the rest.'
			},
			{
				slug: 'for-coaches',
				title: 'For coaches',
				descriptor: 'Homework and tools for people who use the Enneagram with clients.'
			}
		]
	}
];

/** @type {Map<string, CornerSection>} */
const SECTION_BY_SLUG = new Map(CORNER_SECTIONS.map((section) => [section.slug, section]));

/** @type {Map<string, { section: CornerSection, subtopic: CornerSubtopic }>} */
const SUBTOPIC_BY_SLUG = new Map(
	CORNER_SECTIONS.flatMap((section) =>
		section.subtopics.map((subtopic) => [subtopic.slug, { section, subtopic }])
	)
);

/** @param {string} slug */
export function getCornerSection(slug) {
	return SECTION_BY_SLUG.get(slug) ?? null;
}

/** @param {string} slug */
export function getCornerSubtopic(slug) {
	return SUBTOPIC_BY_SLUG.get(slug) ?? null;
}

/** @param {unknown} value @returns {string[]} */
export function toStringList(value) {
	if (Array.isArray(value)) return value.filter((item) => typeof item === 'string' && item);
	return typeof value === 'string' && value ? [value] : [];
}

/**
 * Every section a post belongs to: each `type` that names a section, plus the
 * section of every subtopic it carries (cross-listing).
 * @param {{ type?: unknown, subtopics?: unknown }} post
 * @returns {string[]}
 */
export function getPostSections(post) {
	const sections = new Set(toStringList(post.type).filter((t) => SECTION_BY_SLUG.has(t)));
	for (const slug of toStringList(post.subtopics)) {
		const hit = SUBTOPIC_BY_SLUG.get(slug);
		if (hit) sections.add(hit.section.slug);
	}
	return [...sections];
}

/**
 * The lane a post sits in on one section page: its first subtopic belonging to
 * that section, or null when it has none there.
 * @param {{ subtopics?: unknown }} post
 * @param {string} sectionSlug
 */
export function getPostLane(post, sectionSlug) {
	for (const slug of toStringList(post.subtopics)) {
		const hit = SUBTOPIC_BY_SLUG.get(slug);
		if (hit && hit.section.slug === sectionSlug) return hit.subtopic;
	}
	return null;
}

/**
 * Tagging problems for one post. Published posts must carry a subtopic for
 * their primary section and for every other section their `type` names;
 * nobody may use a slug this file does not define.
 * @param {{ type?: unknown, subtopics?: unknown, published?: unknown }} post
 * @returns {string[]}
 */
export function getSubtopicProblems(post) {
	const problems = [];
	const subtopics = toStringList(post.subtopics);
	for (const slug of subtopics) {
		if (!SUBTOPIC_BY_SLUG.has(slug)) problems.push(`unknown subtopic "${slug}"`);
	}
	if (new Set(subtopics).size !== subtopics.length) problems.push('duplicate subtopic');
	if (!post.published) return problems;

	const typeSections = toStringList(post.type).filter((t) => SECTION_BY_SLUG.has(t));
	if (typeSections.length === 0) problems.push('type[] names no Enneagram Corner section');
	for (const section of typeSections) {
		if (!getPostLane(post, section)) problems.push(`no subtopic for section "${section}"`);
	}
	return problems;
}
