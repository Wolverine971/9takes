// src/lib/components/molecules/blogIndex.ts
// Comprehensive index of all enneagram-corner blog posts for cross-linking
// Auto-generated from blog frontmatter analysis

export interface BlogPost {
	slug: string;
	title: string;
	description: string;
	lastmod: string;
	tags: string[];
}

export interface BlogDomain {
	name: string;
	description: string;
	posts: BlogPost[];
}

/**
 * DOMAIN CATEGORIES
 * Maps to docs/domain-authority structure
 */
export const blogDomains: { [key: string]: BlogDomain } = {
	// Domain 1: Enneagram Core Knowledge
	'enneagram-core': {
		name: 'Enneagram Core Knowledge',
		description: 'Foundation theory, type profiles, and essential concepts',
		posts: [
			// Nine Core Type Profiles
			{
				slug: 'enneagram-type-1',
				title: "Why You Can't Stop Criticizing Everything (Type 1 Perfectionism)",
				description: 'Type 1 deep dive - inner critic, perfectionism, and growth',
				lastmod: '2025-10-23',
				tags: ['nine-types', 'type-1', 'perfectionism', 'inner-critic']
			},
			{
				slug: 'enneagram-type-2',
				title: "Why You Can't Say No (Type 2 People-Pleasing)",
				description: 'Type 2 deep dive - people-pleasing, boundaries, and needs',
				lastmod: '2025-10-23',
				tags: ['nine-types', 'type-2', 'people-pleasing', 'boundaries']
			},
			{
				slug: 'enneagram-type-3',
				title: 'When Success Becomes Your Prison (Type 3 Achievement)',
				description: 'Type 3 deep dive - achievement addiction, authenticity',
				lastmod: '2025-10-23',
				tags: ['nine-types', 'type-3', 'achievement', 'success']
			},
			{
				slug: 'enneagram-type-4',
				title: 'Why You Feel Different From Everyone Else (Type 4)',
				description: 'Type 4 deep dive - identity, uniqueness, and belonging',
				lastmod: '2025-10-23',
				tags: ['nine-types', 'type-4', 'identity', 'uniqueness']
			},
			{
				slug: 'enneagram-type-5',
				title: 'Why You Withdraw From Everyone (Type 5 Isolation)',
				description: 'Type 5 deep dive - isolation patterns, energy, and connection',
				lastmod: '2025-10-23',
				tags: ['nine-types', 'type-5', 'withdrawal', 'energy']
			},
			{
				slug: 'enneagram-type-6',
				title: "Why You Can't Stop Worrying (Type 6 Anxiety)",
				description: 'Type 6 deep dive - anxiety, trust, and security',
				lastmod: '2025-10-23',
				tags: ['nine-types', 'type-6', 'anxiety', 'trust']
			},
			{
				slug: 'enneagram-type-7',
				title: "Why You Can't Sit Still (Type 7 Avoidance)",
				description: 'Type 7 deep dive - avoidance, stimulation, and depth',
				lastmod: '2025-10-23',
				tags: ['nine-types', 'type-7', 'avoidance', 'enthusiasm']
			},
			{
				slug: 'enneagram-type-8',
				title: 'Why You Push Everyone Away (Type 8 Control)',
				description: 'Type 8 deep dive - control, vulnerability, and strength',
				lastmod: '2025-10-23',
				tags: ['nine-types', 'type-8', 'control', 'vulnerability']
			},
			{
				slug: 'enneagram-type-9',
				title: 'Why You Disappear in Relationships (Type 9 Conflict)',
				description: 'Type 9 deep dive - conflict avoidance, peace, and presence',
				lastmod: '2025-10-23',
				tags: ['nine-types', 'type-9', 'conflict-avoidance', 'peace']
			},
			// Core Theory & Concepts
			{
				slug: 'enneagram-tldr',
				title: "What's My Enneagram Type? (5-Minute Guide)",
				description: 'Quick guide to finding your type by core fear and motivation',
				lastmod: '2025-12-03',
				tags: ['overview', 'beginners', 'quick-guide', 'typing']
			},
			{
				slug: 'enneagram-concepts',
				title: 'Enneagram Concepts: Your Personality Decoded',
				description: 'Nine personalities, instincts, wings, and connecting lines',
				lastmod: '2024-08-10',
				tags: ['overview', 'concepts', 'theory', 'fundamentals']
			},
			{
				slug: 'enneagram-faqs',
				title: 'Is the Enneagram Real? 27 Questions Answered',
				description: 'Common questions about Enneagram validity and usage',
				lastmod: '2025-08-15',
				tags: ['overview', 'faq', 'beginners', 'validity']
			},
			{
				slug: 'enneagram-criticisms',
				title: 'The Enneagram Under Fire: Addressing Criticisms',
				description: 'Thoughtful responses to Enneagram criticisms',
				lastmod: '2024-02-26',
				tags: ['overview', 'criticism', 'scientific-validity']
			},
			{
				slug: 'enneagram-wings-complete-guide',
				title: "Why You Don't Match Your Type (It's Your Wing)",
				description: 'Complete guide to Enneagram wings and their influence',
				lastmod: '2025-10-23',
				tags: ['overview', 'wings', 'subtypes', 'theory']
			},
			{
				slug: 'enneagram-instinctual-subtypes',
				title: "Why You Don't Fully Match Your Type (Subtypes)",
				description: 'Self-Preservation, Social, and Sexual instincts explained',
				lastmod: '2025-12-03',
				tags: ['overview', 'subtypes', 'instincts', 'theory']
			},
			{
				slug: 'enneagram-stress-number',
				title: 'Your Dark Side Has a Number',
				description: 'How each type transforms under stress',
				lastmod: '2025-08-15',
				tags: ['overview', 'stress', 'disintegration', 'theory']
			},
			{
				slug: 'enneagram-connecting-lines',
				title: 'Enneagram Connecting Lines: Growth and Stress',
				description: 'Integration and disintegration patterns explained',
				lastmod: '2025-02-26',
				tags: ['overview', 'connecting-lines', 'growth', 'stress']
			},
			{
				slug: 'enneagram-influences',
				title: 'Enneagram Influences: Different Traditions',
				description: 'Schools of thought that influenced the Enneagram',
				lastmod: '2024-04-08',
				tags: ['overview', 'history', 'traditions', 'origins']
			},
			{
				slug: 'philosophy-psychology-and-the-enneagram',
				title: 'Philosophy and Psychology Behind the Enneagram',
				description: "Enneagram's roots in philosophy and psychology",
				lastmod: '2024-06-08',
				tags: ['overview', 'philosophy', 'psychology', 'theory']
			},
			{
				slug: 'enneagram-and-religion',
				title: 'Is the Enneagram Religious?',
				description: 'Spiritual origins from Sufism to Christianity',
				lastmod: '2025-12-03',
				tags: ['overview', 'religion', 'spirituality', 'origins']
			}
		]
	},

	// Domain 2: Personality Maxing & Self-Optimization
	'personality-maxing': {
		name: 'Personality Maxing & Self-Optimization',
		description: 'Self-development, growth strategies, and optimization',
		posts: [
			{
				slug: 'personality-maxing',
				title: 'Personality Maxing: Max Out Your Personality',
				description: 'Proactive mental health using the Enneagram',
				lastmod: '2025-05-26',
				tags: ['development', 'personality-maxing', 'mental-fitness', 'optimization']
			},
			{
				slug: '90-day-personality-maxing-blueprint',
				title: '90-Day Personality Maxing Blueprint',
				description: 'Complete transformation system week by week',
				lastmod: '2025-09-02',
				tags: ['development', 'blueprint', 'transformation', 'action-plan']
			},
			{
				slug: 'enneagram-personal-growth',
				title: 'Enneagram Personal Growth: Unlock Your Potential',
				description: 'Type-specific growth paths and strategies',
				lastmod: '2025-07-18',
				tags: ['development', 'personal-growth', 'potential', 'strategies']
			},
			{
				slug: 'enneagram-self-development',
				title: 'Transform Your Personality Into Your Superpower',
				description: 'Type-specific healing and shadow work',
				lastmod: '2025-08-24',
				tags: ['development', 'self-development', 'healing', 'superpower']
			},
			{
				slug: 'enneagram-strengths-and-weaknesses',
				title: "Your Type's Fatal Flaw (And Secret Superpower)",
				description: 'Shadow aspects and hidden strengths by type',
				lastmod: '2025-10-23',
				tags: ['development', 'strengths', 'weaknesses', 'shadow']
			},
			{
				slug: 'shadow-work-by-enneagram-type',
				title: 'Shadow Work by Enneagram Type: Complete Guide',
				description: 'Confronting dark traits by personality type',
				lastmod: '2025-08-25',
				tags: ['development', 'shadow-work', 'integration', 'healing']
			},
			{
				slug: 'enneagram-positive-self-talk',
				title: 'Master Positive Self-Talk for Your Type',
				description: 'Transform inner critic to type-specific affirmations',
				lastmod: '2025-08-28',
				tags: ['development', 'self-talk', 'affirmations', 'inner-critic']
			},
			{
				slug: 'situations-change-emotions-dont',
				title: 'The Stress Paradox: Emotional Patterns',
				description: 'Master emotions across different situations',
				lastmod: '2025-01-22',
				tags: ['development', 'emotions', 'patterns', 'stress']
			},
			{
				slug: 'how-each-enneagram-type-self-sabotages-success',
				title: 'How Each Type Self-Sabotages Success',
				description: 'Type-specific self-sabotage patterns and solutions',
				lastmod: '2025-12-04',
				tags: ['development', 'self-sabotage', 'success', 'patterns']
			},
			{
				slug: 'how-each-enneagram-type-unwinds',
				title: 'How Each Type Unwinds: Stress-Relief Formula',
				description: 'Type-specific relaxation and recharging strategies',
				lastmod: '2025-07-18',
				tags: ['development', 'stress-relief', 'unwinding', 'self-care']
			}
		]
	},

	// Domain 3: Relationships & Communication
	relationships: {
		name: 'Relationships & Communication',
		description: 'Dating, relationships, conflict, and communication',
		posts: [
			{
				slug: 'enneagram-types-in-relationships',
				title: 'How Each Enneagram Type Loves (And Why It Goes Wrong)',
				description: 'Hidden patterns driving relationship dynamics',
				lastmod: '2025-08-15',
				tags: ['relationships', 'love', 'patterns', 'dynamics']
			},
			{
				slug: 'enneagram-compatibility-matrix',
				title: 'Complete Enneagram Compatibility Matrix',
				description: 'All 81 type combinations decoded',
				lastmod: '2025-08-24',
				tags: ['relationships', 'compatibility', 'pairings', 'matrix']
			},
			{
				slug: 'love-languages-and-enneagram-types',
				title: 'Love Languages & Enneagram: Ultimate Guide',
				description: '45 personality + love language combinations',
				lastmod: '2025-08-25',
				tags: ['relationships', 'love-languages', 'compatibility', 'communication']
			},
			{
				slug: 'attachment-styles-and-enneagram-types',
				title: "Your Attachment Style Isn't the Whole Story",
				description: 'How Enneagram explains attachment patterns',
				lastmod: '2025-12-03',
				tags: ['relationships', 'attachment-styles', 'psychology', 'patterns']
			},
			{
				slug: 'how-to-navigate-early-relationship-stages',
				title: 'Why You Keep Sabotaging New Relationships',
				description: 'Type-specific strategies for dating',
				lastmod: '2025-08-15',
				tags: ['relationships', 'dating', 'early-stages', 'self-sabotage']
			},
			{
				slug: 'enneagram-dating-guide-for-men',
				title: 'Enneagram Dating Guide for Men',
				description: 'Type-specific dating strategies for men',
				lastmod: '2025-08-15',
				tags: ['relationships', 'dating', 'men', 'strategies']
			},
			{
				slug: 'enneagram-dating-guide-for-women',
				title: 'Enneagram Dating Guide for Women',
				description: 'Type-specific dating strategies for women',
				lastmod: '2025-07-18',
				tags: ['relationships', 'dating', 'women', 'strategies']
			},
			{
				slug: 'enneagram-types-on-a-first-date',
				title: 'Enneagram Types on a First Date',
				description: 'What to expect from each type on dates',
				lastmod: '2025-02-25',
				tags: ['relationships', 'dating', 'first-date', 'behavior']
			},
			{
				slug: 'relationship-communication-guide',
				title: 'Relationship Communication Guide',
				description: 'How each type communicates in relationships',
				lastmod: '2025-02-26',
				tags: ['relationships', 'communication', 'partners', 'understanding']
			},
			{
				slug: 'how-to-apologize-like-a-pro',
				title: 'How to Apologize Like a Pro: Enneagram Guide',
				description: 'Type-specific apology strategies',
				lastmod: '2025-09-14',
				tags: ['relationships', 'apology', 'conflict-resolution', 'repair']
			},
			{
				slug: 'red-flags-dating-each-enneagram-type',
				title: 'Red Flags Dating Each Enneagram Type',
				description: 'Warning signs and what to do about them',
				lastmod: '2025-12-03',
				tags: ['relationships', 'red-flags', 'dating', 'warning-signs']
			},
			{
				slug: 'toxic-traits-relationships-warning-signs',
				title: "Red Flags You're Dating a Toxic Version",
				description: 'When each type turns toxic in relationships',
				lastmod: '2025-12-03',
				tags: ['relationships', 'toxic-traits', 'red-flags', 'warning-signs']
			},
			{
				slug: 'enneagram-types-being-ghosted',
				title: 'Why They Ghosted You (Based on Their Type)',
				description: 'Why each type ghosts and what triggered it',
				lastmod: '2025-10-23',
				tags: ['relationships', 'ghosting', 'rejection', 'patterns']
			}
		]
	},

	// Domain 4: Mental Health & Wellness
	'mental-health': {
		name: 'Mental Health & Wellness',
		description: 'Mental health, stress, anxiety, and emotional wellness',
		posts: [
			{
				slug: 'enneagram-and-mental-illness',
				title: "Each Type's Mental Health Predispositions",
				description: 'Mental health risks and shadow side by type',
				lastmod: '2025-10-23',
				tags: ['mental-health', 'predispositions', 'risk-factors', 'awareness']
			},
			{
				slug: 'depression-patterns-by-enneagram-type',
				title: 'Depression Patterns by Enneagram Type',
				description: 'How depression manifests differently by type',
				lastmod: '2025-08-16',
				tags: ['mental-health', 'depression', 'patterns', 'healing']
			},
			{
				slug: 'enneagram-anxiety-management-guide',
				title: "Why Your Anxiety Doesn't Match Type 6",
				description: 'Every type has specific anxiety patterns',
				lastmod: '2025-10-23',
				tags: ['mental-health', 'anxiety', 'management', 'patterns']
			},
			{
				slug: 'enneagram-mental-health-flags',
				title: 'Mental Health Red Flags for All 9 Types',
				description: 'Type-specific warning signs and when to seek help',
				lastmod: '2025-08-24',
				tags: ['mental-health', 'red-flags', 'warning-signs', 'help']
			},
			{
				slug: 'enneagram-types-in-stress',
				title: 'How Each Type Falls Apart Under Stress',
				description: 'Stress breakdown patterns by type',
				lastmod: '2025-10-23',
				tags: ['mental-health', 'stress', 'breakdown', 'patterns']
			},
			{
				slug: 'enneagram-and-adhd-which-types-struggle-most',
				title: 'Enneagram and ADHD: Which Types Struggle Most',
				description: 'ADHD affects each type differently',
				lastmod: '2025-12-07',
				tags: ['mental-health', 'adhd', 'neurodivergence', 'coping']
			},
			{
				slug: 'neurodiversity-vs-personality',
				title: 'Neurodiversity vs. Personality',
				description: 'Understanding labels vs. personality patterns',
				lastmod: '2025-05-26',
				tags: ['mental-health', 'neurodiversity', 'identity', 'self-understanding']
			},
			{
				slug: 'why-you-cant-stop-overthinking-enneagram',
				title: "Why You Can't Stop Overthinking",
				description: 'Type-specific thought loops and solutions',
				lastmod: '2025-12-04',
				tags: ['mental-health', 'overthinking', 'thought-patterns', 'solutions']
			}
		]
	},

	// Domain 5: Workplace & Leadership
	workplace: {
		name: 'Workplace & Leadership',
		description: 'Careers, teams, leadership, and professional development',
		posts: [
			{
				slug: 'enneagram-types-and-career-choices',
				title: "Why You Hate Your Job (It's Your Enneagram Type)",
				description: 'Find careers that match your personality',
				lastmod: '2025-12-03',
				tags: ['workplace', 'career', 'job-fit', 'satisfaction']
			},
			{
				slug: 'enneagram-leadership',
				title: 'Enneagram Leadership Styles: 9 Ways to Lead',
				description: 'Natural leadership style by type',
				lastmod: '2025-09-14',
				tags: ['workplace', 'leadership', 'management', 'styles']
			},
			{
				slug: 'enneagram-team-dynamics',
				title: 'Enneagram Team Dynamics: High-Performance Teams',
				description: 'How different types work together',
				lastmod: '2025-08-24',
				tags: ['workplace', 'teams', 'dynamics', 'collaboration']
			},
			{
				slug: 'enneagram-team-diversity',
				title: 'Enneagram Team Diversity: Full Potential',
				description: 'Harnessing personality diversity in teams',
				lastmod: '2024-08-11',
				tags: ['workplace', 'teams', 'diversity', 'potential']
			},
			{
				slug: 'enneagram-types-working-in-teams',
				title: 'Enneagram Types Working in Teams',
				description: 'How each type communicates and collaborates',
				lastmod: '2025-05-26',
				tags: ['workplace', 'teams', 'collaboration', 'communication']
			},
			{
				slug: 'enneagram-workplace-team-building',
				title: 'Transforming Workplace Teams Using Enneagram',
				description: "Leader's guide to personality-driven collaboration",
				lastmod: '2025-03-10',
				tags: ['workplace', 'team-building', 'leadership', 'productivity']
			},
			{
				slug: 'enneagram-coach-toolkit',
				title: 'Enneagram Coach Toolkit: Type-Specific Homework',
				description: 'Professional coaching strategies by type',
				lastmod: '2025-12-04',
				tags: ['workplace', 'coaching', 'professional', 'toolkit']
			}
		]
	},

	// Domain 6: Social Dynamics & Communication
	'social-dynamics': {
		name: 'Social Dynamics & Communication',
		description: 'First impressions, social behavior, and interpersonal skills',
		posts: [
			{
				slug: 'first-impression-enneagram-playbook',
				title: 'Read Anyone in 30 Seconds: Body Language Cheat Sheet',
				description: '9 personality tells for instant connection',
				lastmod: '2025-08-15',
				tags: ['social', 'first-impressions', 'body-language', 'reading-people']
			},
			{
				slug: 'first-impression-cheat-sheet',
				title: 'First Impression Cheat Sheet: Instant Connection',
				description: 'Quick reference for connecting with each type',
				lastmod: '2025-07-19',
				tags: ['social', 'first-impressions', 'cheat-sheet', 'connection']
			},
			{
				slug: 'enneagram-types-at-party',
				title: 'The Party Test: Social Style Reveals Your Type',
				description: 'Spot types by their party behavior',
				lastmod: '2025-10-23',
				tags: ['social', 'party', 'behavior', 'typing']
			},
			{
				slug: 'enneagram-party-planner',
				title: 'Enneagram Party Planner: Customize Invites',
				description: 'Plan perfect events for each type',
				lastmod: '2024-07-12',
				tags: ['social', 'party', 'planning', 'events']
			},
			{
				slug: 'how-each-enneagram-flexes',
				title: 'How All 9 Types Flex: Secret Need for Recognition',
				description: 'How each type shows off and seeks validation',
				lastmod: '2025-03-10',
				tags: ['social', 'flexing', 'recognition', 'behavior']
			},
			{
				slug: 'biggest-compliments-to-give-each-enneagram-type',
				title: 'How to Compliment Each Type (Words That Land)',
				description: 'What each type secretly wants to hear',
				lastmod: '2025-12-03',
				tags: ['social', 'compliments', 'influence', 'connection']
			},
			{
				slug: 'how-each-enneagram-type-manipulates',
				title: 'How Each Type Manipulates (And How to Spot It)',
				description: 'Recognize manipulation patterns by type',
				lastmod: '2025-12-04',
				tags: ['social', 'manipulation', 'patterns', 'awareness']
			},
			{
				slug: 'toxic-traits-of-each-enneagram-type',
				title: 'Toxic Traits: Dark Side of Each Type',
				description: 'Shadow aspects and how to deal with them',
				lastmod: '2025-10-23',
				tags: ['social', 'toxic-traits', 'dark-side', 'awareness']
			},
			{
				slug: 'enneagram-communication-guide',
				title: 'Decode Any Personality Type in Seconds',
				description: 'Exact communication patterns by type',
				lastmod: '2025-12-04',
				tags: ['communication', 'guide', 'patterns', 'decoding']
			},
			{
				slug: 'enneagram-communication-styles',
				title: "Why Nobody Understands You (It's Your Enneagram)",
				description: '9 hidden languages everyone speaks',
				lastmod: '2025-08-15',
				tags: ['communication', 'styles', 'understanding', 'connection']
			},
			{
				slug: 'enneagram-communication-tips',
				title: 'Tips for Communicating with Each Type',
				description: 'Optimize communication by personality',
				lastmod: '2024-05-22',
				tags: ['communication', 'tips', 'practical', 'optimization']
			}
		]
	},

	// Domain 7: Resources & Guides
	resources: {
		name: 'Resources & Guides',
		description: 'Tests, books, tools, and reference materials',
		posts: [
			{
				slug: 'beginners-guide-to-determining-your-enneagram-type',
				title: 'Find Your Type in 10 Minutes (4 Steps)',
				description: 'Proven method focusing on motivations',
				lastmod: '2025-08-15',
				tags: ['resources', 'typing', 'beginners', 'guide']
			},
			{
				slug: 'enneagram-test-comparison-2025',
				title: 'Best Free Enneagram Test (2025)',
				description: 'Honest comparison of tests that work',
				lastmod: '2025-12-03',
				tags: ['resources', 'tests', 'comparison', 'review']
			},
			{
				slug: 'enneagram-books-websites-podcasts',
				title: 'Enneagram Books, Websites & Podcasts',
				description: 'Best resources for personal growth',
				lastmod: '2025-12-04',
				tags: ['resources', 'books', 'podcasts', 'learning']
			},
			{
				slug: 'enneagram-vs-meyers-briggs',
				title: 'Enneagram vs Myers-Briggs: Which Is Better?',
				description: 'MBTI vs Enneagram comparison',
				lastmod: '2025-12-03',
				tags: ['resources', 'comparison', 'mbti', 'personality-systems']
			},
			{
				slug: 'astrology-and-the-enneagram',
				title: 'Astrology Meets Enneagram',
				description: 'Combining cosmic and personality insights',
				lastmod: '2025-10-23',
				tags: ['resources', 'astrology', 'integration', 'systems']
			},
			{
				slug: 'enneagram-childhood-stereotypes',
				title: '9 Childhood Stereotypes Based on Enneagram',
				description: 'Rediscover your childhood through the Enneagram',
				lastmod: '2024-07-12',
				tags: ['resources', 'childhood', 'origins', 'patterns']
			}
		]
	}
};

/**
 * Get all blogs as a flat array
 */
export function getAllBlogs(): BlogPost[] {
	return Object.values(blogDomains).flatMap((domain) => domain.posts);
}

/**
 * Get blogs by domain
 */
export function getBlogsByDomain(domainKey: string): BlogPost[] {
	return blogDomains[domainKey]?.posts || [];
}

/**
 * Get blogs by tag
 */
export function getBlogsByTag(tag: string): BlogPost[] {
	return getAllBlogs().filter((post) => post.tags.includes(tag));
}

/**
 * Get related blogs based on shared tags
 */
export function getRelatedBlogs(slug: string, limit: number = 5): BlogPost[] {
	const currentBlog = getAllBlogs().find((b) => b.slug === slug);
	if (!currentBlog) return [];

	const allBlogs = getAllBlogs().filter((b) => b.slug !== slug);

	// Score blogs by number of shared tags
	const scored = allBlogs.map((blog) => ({
		blog,
		score: blog.tags.filter((tag) => currentBlog.tags.includes(tag)).length
	}));

	return scored
		.filter((s) => s.score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, limit)
		.map((s) => s.blog);
}

/**
 * Get blogs for cross-linking within content
 * Returns blogs from same domain + highly related blogs from other domains
 */
export function getCrossLinkSuggestions(
	slug: string,
	currentDomain: string
): { sameDomain: BlogPost[]; related: BlogPost[] } {
	const sameDomain = getBlogsByDomain(currentDomain).filter((b) => b.slug !== slug);
	const related = getRelatedBlogs(slug, 5).filter(
		(b) => !sameDomain.some((sd) => sd.slug === b.slug)
	);

	return { sameDomain, related };
}

/**
 * Domain statistics for analysis
 */
export function getDomainStats(): {
	[key: string]: { name: string; count: number; posts: string[] };
} {
	const stats: { [key: string]: { name: string; count: number; posts: string[] } } = {};

	for (const [key, domain] of Object.entries(blogDomains)) {
		stats[key] = {
			name: domain.name,
			count: domain.posts.length,
			posts: domain.posts.map((p) => p.slug)
		};
	}

	return stats;
}

/**
 * Get all unique tags across all blogs
 */
export function getAllTags(): string[] {
	const tags = new Set<string>();
	getAllBlogs().forEach((blog) => blog.tags.forEach((tag) => tags.add(tag)));
	return Array.from(tags).sort();
}
