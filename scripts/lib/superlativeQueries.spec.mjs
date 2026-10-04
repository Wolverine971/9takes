// scripts/lib/superlativeQueries.spec.mjs
import { describe, expect, it } from 'vitest';
import {
	baseUrl,
	classifyQuery,
	clusterKey,
	clusterPageQueries,
	conceptTerms,
	describeGap,
	extractAnswerSurface,
	foldFragments,
	isAnswered,
	isPickPhrased,
	isSuperlativeQuery,
	parseGscCsv,
	suggestQuestion,
	titleAsks
} from './superlativeQueries.mjs';

// ---------------------------------------------------------------------------
// Fixtures: excerpts of real pages (answer text trimmed, structure verbatim)
// ---------------------------------------------------------------------------

// git show d7d8cdfe8:src/blog/enneagram/toxic-traits-of-each-enneagram-type.md
// (before the 2026-10-03 cleanup). 393 "worst type" impressions, 1 click.
const faqJsonLd = (names) => `<svelte:head>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "mainEntity": [
${names
	.map(
		(name) => `        {
          "@type": "Question",
          "acceptedAnswer": { "@type": "Answer", "text": "…" },
          "name": ${JSON.stringify(name)}
        }`
	)
	.join(',\n')}
      ]
    }
  ]
}
</script>

</svelte:head>`;

const TOXIC_TRAITS_PRE_CLEANUP = `---
title: '9 Toxic Personality Traits: The Dark Side of Each Type'
description: 'Discover the shadow aspects hiding in each personality type, why they emerge, and how to deal with them in yourself and others.'
lastmod: '2026-01-18'
published: true
---

<script>
	import QuickAnswer from "$lib/components/blog/callouts/QuickAnswer.svelte";
</script>

<QuickAnswer question="What are the toxic traits of each Enneagram type?">
Under stress, each Enneagram type has a predictable toxic reflex. Type 1 nitpicks and judges, Type 2 uses guilt, Type 3 performs for approval, Type 4 pulls people into emotional intensity, Type 5 withdraws, Type 6 suspects and tests, Type 7 escapes, Type 8 dominates, and Type 9 goes passive-aggressive. These are defense moves, not destiny. Spot yours and you can interrupt it.
</QuickAnswer>

This guide breaks down what each type looks like at its worst, why it happens, how to deal with it in others, and what to do if you're the one doing it.

## The Darker Side of Personality: Why Everyone Has Toxic Traits
## Toxic Traits Red Flags by Type
## Type 1: The Righteous Critic Who's Never Wrong
### The Ruthless Inner Judge
## Type 2: The Helper With Hidden Hooks
### The Emotional Puppet Master
## Type 3: The Success Addict With Empty Achievements
## Type 4: The Emotional Amplifier Who Makes Everything Feel Personal
## Type 5: The Cold Analyzer Who Can't Connect
## Type 6: The Paranoid Overthinker Preparing for Disasters

Type 6s excel at catastrophizing. They can envision seventeen worst-case scenarios before breakfast.

## Type 7: The Chronic Escapist Running From Reality
## Type 8: The Aggressive Controller Who Crushes Opposition
## Type 9: The Conflict-Avoider Who Disappears When Needed Most
## Recognizing Your Shadow Self: The Path to Growth and Healing
## Related Reading

${faqJsonLd([
	'What are toxic personality traits and why do they develop?',
	'How do toxic traits manifest differently across Enneagram types?',
	'How can I address my own toxic traits according to my Enneagram type?',
	'How can understanding Enneagram toxic traits improve my relationships with others?'
])}
`;

// The 2026-10-03 cleanup brief: QuickAnswer + H2 + FAQ ask the pick.
const TOXIC_TRAITS_CLEANED = `---
title: 'Toxic Traits of Each Enneagram Type (and Which One Is the Worst)'
meta_title: "What's the Worst Enneagram Type? Toxic Traits of All 9"
published: true
---

<QuickAnswer question="What is the worst Enneagram type?">
No Enneagram type is the worst. Every type has a worst version.
</QuickAnswer>

## What is the worst Enneagram type?

## Frequently asked questions

### Which Enneagram type is the most evil?
`;

// src/blog/enneagram/enneagram-and-adhd-which-types-struggle-most.md, the in-site
// control: 5.87% CTR at position 5.2.
const ADHD_CONTROL = `---
title: 'Enneagram and ADHD: Which Types Struggle Most (And Why)'
description: 'Do you have ADHD or is it just your personality? Discover how ADHD affects each Enneagram type differently, plus type-specific coping strategies that actually work.'
published: true
---

${faqJsonLd([
	'Does ADHD medication work differently based on personality type?',
	'Can my Enneagram type help me choose better ADHD coping strategies?',
	'Does ADHD affect Enneagram growth and stress patterns?',
	'Should I tell my therapist about my Enneagram type?',
	'Is ADHD underdiagnosed in certain Enneagram types?'
])}

<QuickAnswer question="Which Enneagram type is most likely to have ADHD?">
Type 7 (The Enthusiast) shows the highest correlation with ADHD symptoms, but every Enneagram type can have ADHD. And each experiences it differently.
</QuickAnswer>

## Why Your Enneagram Type Affects How ADHD Shows Up
### A Note on Gender
## Which Enneagram Types Are Most Commonly Diagnosed with ADHD?
## How ADHD Affects Each Enneagram Type Differently
### Type 7 (The Enthusiast) with ADHD
## Frequently Asked Questions
### Does ADHD medication work differently based on personality type?
`;

// how-each-enneagram-type-manipulates.md before the cleanup: the pick is asked,
// but only in the FAQ at the bottom (177 impressions at 4.8 to 6.7, 2 clicks).
const MANIPULATION_PRE_CLEANUP = `---
title: 'How Each Enneagram Type Manipulates (And How to Spot It)'
---

<QuickAnswer question="How does each Enneagram type manipulate?">
Every type manipulates differently.
</QuickAnswer>

## The Psychology of Manipulation
## Manipulation Tactics at a Glance
## Frequently Asked Questions
### Which Enneagram type is the most manipulative?

No type owns the title of "most manipulative."
`;

// depression-patterns before the cleanup: bold-line FAQ + JSON-LD only.
const DEPRESSION_PRE_CLEANUP = `---
title: 'Depression Patterns by Enneagram Type'
---

<QuickAnswer question="How does depression manifest differently by Enneagram type?">
Depression shows up differently in each type.
</QuickAnswer>

## FAQs About Depression and Enneagram Types

**Which Enneagram type is most prone to depression?**
No type is immune.

${faqJsonLd(['Which Enneagram type is most prone to depression?'])}
`;

// enneagram-and-mental-illness: "narcissist" appears in headings, never as a pick.
const MENTAL_ILLNESS_EXCERPT = `---
title: "The Enneagram and Mental Illness: Understand Each Type's Predispositions"
---

<QuickAnswer question="Can your Enneagram type predict mental health risks?">
No.
</QuickAnswer>

## Type 3: Narcissistic Traits and Imposter Syndrome
### Which Enneagram type is most likely to be a psychopath?
`;

// ---------------------------------------------------------------------------
// isSuperlativeQuery / classifyQuery
// ---------------------------------------------------------------------------

describe('isSuperlativeQuery', () => {
	it.each([
		'worst enneagram type',
		'what is the worst enneagram type',
		'whats the worst enneagram type',
		'which enneagram is most likely to be a narcissist',
		'most narcissistic ennegram',
		'most manipulative enneagram',
		'enneagram most likely to cheat',
		'which enneagram is most likely to be autistic',
		'what enneagram is most likely to have bpd',
		'which personality type is most likely to have adhd',
		'rarest enneagram type',
		'most common enneagram',
		'meanest enneagram',
		'calmest mbti',
		'which enneagrams are compatible',
		'what enneagram is most compatible with 4',
		'enneagram type 7 worst match',
		'best enneagram pairings'
	])('counts "%s"', (query) => {
		expect(isSuperlativeQuery(query)).toBe(true);
	});

	it.each([
		['what enneagram is tina fey', 'person lookup'],
		['what personality type is zendaya', 'person lookup'],
		['what is my enneagram type', 'test intent'],
		['how do i know what enneagram i am', 'test intent'],
		['enneagram and adhd', 'no pick'],
		['cloverleaf enneagram test', 'no pick'],
		['forbes top paid podcasters', 'not about types'],
		['jack dorsey time magazine 100 most influential people', 'not about types'],
		['enneagram 3 biggest fear', 'about one named type'],
		['best jobs for enneagram 4', 'about one named type'],
		['best enneagram test', 'product, no page'],
		['best free enneagram', 'product ("free"), no page'],
		['most accurate enneagram test', 'product, no page'],
		['best enneagram training', 'product, no page']
	])('skips "%s" (%s)', (query) => {
		expect(isSuperlativeQuery(query)).toBe(false);
	});

	it('counts product superlatives only on a page about that product', () => {
		const testPage = 'https://9takes.com/enneagram-corner/enneagram-test-comparison-2026';
		const otherPage = 'https://9takes.com/enneagram-corner/toxic-traits-of-each-enneagram-type';
		expect(isSuperlativeQuery('best enneagram test free', { page: testPage })).toBe(true);
		expect(classifyQuery('most accurate enneagram test', { page: testPage }).kind).toBe('product');
		expect(isSuperlativeQuery('best enneagram test free', { page: otherPage })).toBe(false);
		expect(isSuperlativeQuery('best free enneagram', { page: testPage })).toBe(true);
	});
});

// ---------------------------------------------------------------------------
// Concepts + clusters
// ---------------------------------------------------------------------------

describe('conceptTerms / clusterKey', () => {
	it('strips the Enneagram words and the pick scaffolding', () => {
		expect(conceptTerms('which enneagram is most likely to be a narcissist')).toEqual([
			'narcissist'
		]);
		expect(conceptTerms('worst enneagram type')).toEqual(['worst']);
		expect(conceptTerms('which enneagram is most likely to cheat')).toEqual(['cheat']);
		expect(conceptTerms('least compatible enneagram types')).toEqual(['least', 'compatible']);
		expect(conceptTerms('best match for enneagram 9')).toEqual(['compatible', '9']);
	});

	it('drops "best" when it modifies another concept', () => {
		expect(conceptTerms('best enneagram pairings')).toEqual(['compatible']);
		expect(conceptTerms('best enneagram')).toEqual(['best']);
	});

	it('clusters synonyms and inflections together', () => {
		const narcissist = clusterKey('which enneagram is most likely to be a narcissist');
		expect(clusterKey('most narcissistic enneagram')).toBe(narcissist);
		expect(clusterKey('what enneagram type is most likely to be a narcissist')).toBe(narcissist);
		expect(clusterKey('most depressed enneagram')).toBe(
			clusterKey('which enneagram is most likely to be depressed')
		);
		expect(clusterKey('which enneagram is most likely to be autistic')).toBe('autism');
		expect(clusterKey('rarest enneagram type')).toBe(clusterKey('which enneagram is the rarest'));
		expect(clusterKey('worst enneagram type')).not.toBe(clusterKey('most evil enneagram'));
	});
});

describe('isPickPhrased', () => {
	it('recognizes which/most/least/-est/likely phrasing', () => {
		expect(isPickPhrased('What is the worst Enneagram type?')).toBe(true);
		expect(isPickPhrased('Which Enneagram Types Are Most Commonly Diagnosed with ADHD?')).toBe(
			true
		);
		expect(isPickPhrased('Type 3: Narcissistic Traits and Imposter Syndrome')).toBe(false);
		expect(isPickPhrased('What are the toxic traits of each Enneagram type?')).toBe(false);
	});
});

// ---------------------------------------------------------------------------
// Answer surface
// ---------------------------------------------------------------------------

describe('extractAnswerSurface', () => {
	it('reads the QuickAnswer, headings, JSON-LD FAQ and frontmatter', () => {
		const surface = extractAnswerSurface(ADHD_CONTROL);
		expect(surface.title).toBe('Enneagram and ADHD: Which Types Struggle Most (And Why)');
		expect(surface.quickAnswers).toHaveLength(1);
		expect(surface.quickAnswers[0].question).toBe(
			'Which Enneagram type is most likely to have ADHD?'
		);
		expect(surface.quickAnswers[0].body).toMatch(/^Type 7 \(The Enthusiast\)/);
		expect(surface.headings).toContainEqual({
			level: 2,
			text: 'Which Enneagram Types Are Most Commonly Diagnosed with ADHD?'
		});
		expect(surface.headings).toContainEqual({ level: 3, text: 'A Note on Gender' });
		expect(surface.faqQuestions.filter((f) => f.source === 'jsonld')).toHaveLength(5);
	});

	it('picks up bold-line FAQ questions, meta_title and people faqs frontmatter', () => {
		expect(extractAnswerSurface(DEPRESSION_PRE_CLEANUP).faqQuestions).toContainEqual({
			text: 'Which Enneagram type is most prone to depression?',
			source: 'visible'
		});
		expect(extractAnswerSurface(TOXIC_TRAITS_CLEANED).metaTitle).toBe(
			"What's the Worst Enneagram Type? Toxic Traits of All 9"
		);
		const person = extractAnswerSurface(`---
title: 'Jane Doe Personality Type'
faqs:
  - question: 'What is Jane Doe's personality type?'
    answer: 'Type 3.'
---
Body.`);
		// The apostrophe breaks YAML; the regex fallback still finds the FAQ.
		expect(person.faqQuestions).toContainEqual({
			text: "What is Jane Doe's personality type?",
			source: 'frontmatter'
		});
	});

	it('ignores headings inside code fences and HTML comments', () => {
		const surface = extractAnswerSurface(
			'## Real heading\n\n```md\n## Fake heading\n```\n\n<!--\n## Hidden heading\n-->\n'
		);
		expect(surface.headings.map((h) => h.text)).toEqual(['Real heading']);
	});
});

// ---------------------------------------------------------------------------
// isAnswered
// ---------------------------------------------------------------------------

describe('isAnswered', () => {
	it('flags the pre-cleanup toxic-traits page for "worst enneagram type"', () => {
		const surface = extractAnswerSurface(TOXIC_TRAITS_PRE_CLEANUP);
		for (const query of [
			'worst enneagram type',
			'what is the worst enneagram type',
			'worst enneagram'
		]) {
			expect(isSuperlativeQuery(query)).toBe(true);
			expect(isAnswered(query, surface)).toMatchObject({ answered: false, placement: null });
		}
		// "worst" in body prose ("at its worst") does not count as answering.
		expect(surface.bodyText).toMatch(/at its worst/);
	});

	it('reads the cleaned-up toxic-traits page as answered up top', () => {
		const surface = extractAnswerSurface(TOXIC_TRAITS_CLEANED);
		expect(isAnswered('worst enneagram type', surface)).toMatchObject({
			answered: true,
			placement: 'lead',
			via: 'quickanswer',
			where: 'What is the worst Enneagram type?'
		});
		expect(titleAsks('worst enneagram type', surface)).toBe(true);
		expect(isAnswered('most evil enneagram', surface)).toMatchObject({
			answered: true,
			placement: 'buried',
			via: 'h3'
		});
	});

	it('reads the ADHD control as answered in its QuickAnswer', () => {
		const surface = extractAnswerSurface(ADHD_CONTROL);
		expect(isAnswered('which enneagram is most likely to have adhd', surface)).toMatchObject({
			answered: true,
			placement: 'lead',
			via: 'quickanswer'
		});
		expect(isAnswered('which personality type is most likely to have adhd', surface).answered).toBe(
			true
		);
		// The page doesn't answer an unrelated pick just because it has pick headings.
		expect(isAnswered('which enneagram is most likely to cheat', surface).answered).toBe(false);
	});

	it('marks a pick asked only in the FAQ as buried', () => {
		expect(
			isAnswered('most manipulative enneagram', extractAnswerSurface(MANIPULATION_PRE_CLEANUP))
		).toMatchObject({ answered: true, placement: 'buried', via: 'h3' });
		expect(
			isAnswered(
				'which enneagram is most likely to be depressed',
				extractAnswerSurface(DEPRESSION_PRE_CLEANUP)
			)
		).toMatchObject({ answered: true, placement: 'buried', via: 'faq' });
	});

	it('needs the heading to ask for a pick, not just mention the concept', () => {
		const surface = extractAnswerSurface(MENTAL_ILLNESS_EXCERPT);
		const query = 'which enneagram is most likely to be a narcissist';
		expect(isAnswered(query, surface).answered).toBe(false);
		expect(describeGap(query, surface)).toMatch(/none asks for a pick/);
		expect(isAnswered('which enneagram is most likely to be a psychopath', surface).answered).toBe(
			true
		);
	});

	it('explains the gap in plain words', () => {
		const surface = extractAnswerSurface(TOXIC_TRAITS_PRE_CLEANUP);
		const gap = describeGap('worst enneagram type', surface);
		expect(gap).toMatch(/no QuickAnswer, heading or FAQ mentions "worst"/);
		expect(gap).toMatch(/QuickAnswer asks "What are the toxic traits of each Enneagram type\?"/);
	});
});

describe('suggestQuestion', () => {
	it.each([
		['most manipulative enneagram', 'Which Enneagram type is the most manipulative?'],
		['worst enneagram type', 'What is the worst Enneagram type?'],
		['enneagram most likely to cheat', 'Which Enneagram type is most likely to cheat?'],
		[
			'which enneagram is most likely to be a narcissist',
			'Which Enneagram type is most likely to be a narcissist?'
		],
		['whats the worst enneagram type', 'What is the worst Enneagram type?'],
		['most accurate enneagram test', 'What is the most accurate Enneagram test?']
	])('"%s" → "%s"', (query, question) => {
		expect(suggestQuestion(query)).toBe(question);
	});
});

// ---------------------------------------------------------------------------
// GSC rows
// ---------------------------------------------------------------------------

describe('parseGscCsv', () => {
	it('handles quoted cells and numeric columns', () => {
		const rows = parseGscCsv(
			'page,query,clicks,impressions,ctr_pct,position\nhttps://9takes.com/a,"rapper ""most successful song"", bullied",0,14,0.00,9.5\n'
		);
		expect(rows).toEqual([
			{
				page: 'https://9takes.com/a',
				query: 'rapper "most successful song", bullied',
				clicks: 0,
				impressions: 14,
				ctr_pct: 0,
				position: 9.5
			}
		]);
	});
});

describe('foldFragments', () => {
	const page = 'https://9takes.com/enneagram-corner/enneagram-and-adhd-which-types-struggle-most';
	const row = (suffix, query, clicks, impressions, position) => ({
		page: `${page}${suffix}`,
		query,
		clicks,
		impressions,
		position
	});

	it('keeps the largest row per page+query and never sums fragment rows', () => {
		const q = 'which enneagram is most likely to have adhd';
		const folded = foldFragments([
			row('', q, 0, 58, 3.9),
			row('#why-your-enneagram-type-affects-how-adhd-shows-up', q, 0, 56, 4.0),
			row('#coping-strategies-that-actually-work-by-type', q, 0, 40, 4.0),
			row('', 'adhd enneagram', 6, 65, 3.0),
			row('#how-adhd-affects-each-enneagram-type-differently', 'adhd enneagram', 0, 65, 3.7)
		]);
		expect(folded).toHaveLength(2);
		const superlative = folded.find((r) => r.query === q);
		expect(superlative).toMatchObject({ page, impressions: 58, position: 3.9 });
		expect(superlative.pages).toHaveLength(3);
		// Tie on impressions → the row with more clicks wins.
		expect(folded.find((r) => r.query === 'adhd enneagram')).toMatchObject({
			clicks: 6,
			position: 3.0
		});
	});

	it('takes a canonicalizer for case variants and drops rows it rejects', () => {
		const folded = foldFragments(
			[
				{
					page: 'https://9takes.com/personality-analysis/Jenna-Ortega',
					query: 'q',
					clicks: 0,
					impressions: 30,
					position: 9
				},
				{
					page: 'https://9takes.com/personality-analysis/jenna-ortega#faq',
					query: 'q',
					clicks: 1,
					impressions: 20,
					position: 8
				},
				{
					page: 'https://9takes.com/blogs/pic.webp',
					query: 'q',
					clicks: 0,
					impressions: 5,
					position: 1
				}
			],
			{
				canonicalize: (p) =>
					p.endsWith('.webp')
						? null
						: baseUrl(p)
								.replace(/^https:\/\/9takes\.com/, '')
								.toLowerCase()
			}
		);
		expect(folded).toHaveLength(1);
		expect(folded[0]).toMatchObject({
			page: '/personality-analysis/jenna-ortega',
			impressions: 30
		});
	});

	it('strips fragments, query strings and trailing slashes by default', () => {
		expect(baseUrl('https://9takes.com/x/#top')).toBe('https://9takes.com/x');
		expect(baseUrl('https://9takes.com/x?ref=1')).toBe('https://9takes.com/x');
		expect(baseUrl('https://9takes.com/')).toBe('https://9takes.com/');
	});
});

describe('clusterPageQueries', () => {
	// Deduped "worst" cluster on toxic-traits, GSC 2026-07-04..2026-10-02.
	const worstRows = [
		['worst enneagram type', 0, 227, 9.6],
		['what is the worst enneagram type', 1, 111, 10.0],
		['worst enneagram', 0, 34, 10.0],
		['whats the worst enneagram type', 0, 12, 9.8],
		['the worst enneagram type', 0, 8, 9.9],
		['which is the worst enneagram type', 0, 1, 10.0],
		['most evil enneagram', 0, 11, 10.3]
	].map(([query, clicks, impressions, position]) => ({ query, clicks, impressions, position }));

	it('flags the 393-impression worst cluster on the pre-cleanup page', () => {
		const clusters = clusterPageQueries(worstRows, extractAnswerSurface(TOXIC_TRAITS_PRE_CLEANUP));
		const worst = clusters.find((c) => c.key === 'worst');
		expect(worst).toMatchObject({ impressions: 393, clicks: 1, answered: false, placement: null });
		expect(worst.queries[0].query).toBe('worst enneagram type');
		expect(worst.suggestion).toBe('What is the worst Enneagram type?');
		expect(worst.gap).toMatch(/body mentions: \d+/);
		expect(clusters.map((c) => c.key)).toEqual(['worst', 'evil']);
	});

	it('clears the same cluster after the cleanup', () => {
		const clusters = clusterPageQueries(worstRows, extractAnswerSurface(TOXIC_TRAITS_CLEANED));
		expect(clusters.find((c) => c.key === 'worst')).toMatchObject({
			answered: true,
			placement: 'lead',
			gap: null,
			suggestion: null
		});
	});

	it('returns unjudged clusters when the page has no markdown source', () => {
		const [cluster] = clusterPageQueries(worstRows.slice(0, 1), null);
		expect(cluster).toMatchObject({ key: 'worst', answered: null, gap: null });
	});
});
