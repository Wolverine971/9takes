<!-- docs/content-generation/celebrity-page-optimization-instructions.md -->

# Celebrity Page Optimization Instructions

_For AI Agent Execution_
_Created: 2025-12-03_
_Source Data: GSC Export Dec 2025_

---

## Overview

This document contains instructions for optimizing celebrity/famous people blog posts to improve CTR. These pages have high impressions but low click-through rates. Apply these optimizations to each page in priority order.

---

## The Optimization Protocol

For EACH page, apply these 9 steps in order:

### Step 1: TITLE REWRITE

**Formula:** `[Problem Question or Hook] + (Personality Insight)`

**Rules:**

- Max 60 characters
- Must address a PROBLEM or QUESTION people actually search
- Check the "Target Queries" section for each page to match search intent
- Avoid generic descriptions like "Complete Guide" or "Personality Analysis"

**Good Examples:**

- ❌ "Emma Watson: The Hidden Perfectionist Behind Hermione"
- ✅ "Why Is Emma Watson So Private? Her Personality Explained"

- ❌ "Elon Musk's Enneagram Type Analysis"
- ✅ "Is Elon Musk a Narcissist? What His Personality Reveals"

### Step 2: META DESCRIPTION REWRITE

**Formula:** `Problem + Promise + Curiosity Hook`

**Rules:**

- 150-160 characters exactly
- Start with the problem/question
- Promise an answer
- End with curiosity hook

**Template:**

```
[Problem statement]? We analyze [person]'s psychology and reveal [promise]. [Curiosity hook about what they'll learn].
```

### Step 3: ADD QUICK ANSWER BOX

Insert at the VERY TOP of content (after script imports, before first paragraph).

**First**, add the import to the script tag:

```svelte
<script>
	import QuickAnswer from '$lib/components/blog/callouts/QuickAnswer.svelte';
	// ... other imports
</script>
```

**Then**, add the component:

```svelte
<QuickAnswer question="[The question your title implies - e.g., 'Is Elon Musk a narcissist?']">
	[Direct 2-3 sentence answer. Be definitive, not hedging. This targets Google Featured Snippets.]
</QuickAnswer>
```

**Example:**

```svelte
<QuickAnswer question="Is Elon Musk a narcissist?">
	Elon Musk shows strong Type 5 (Investigator) traits with an 8 wing, not classic narcissism. His
	intensity comes from a deep need to understand and master complex systems, combined with a
	protective shell that makes vulnerability feel dangerous.
</QuickAnswer>
```

**Note:** The QuickAnswer component includes Schema.org Answer markup for SEO and has a distinctive purple gradient styling that stands out from regular content.

### Step 4: REWRITE OPENING (First 150 words)

**Must include:**

1. Name the problem/question directly
2. Validate why readers are curious
3. Promise the answer
4. Zero preamble/fluff - get to the point immediately

**Template structure:**

```markdown
<p class="firstLetter">[Hook that names the problem - what people are wondering about this person]</p>

**[Restate the core question boldly]**

[1-2 sentences validating why this matters or why people ask this]

[Promise: Here's what their personality type reveals...]
```

### Step 5: REMOVE HEDGING LANGUAGE

Find and replace throughout the entire document:

| Find             | Replace With                     |
| ---------------- | -------------------------------- |
| "tend to"        | "typically"                      |
| "might"          | "often"                          |
| "can be"         | "are"                            |
| "may experience" | "commonly experience"            |
| "some people"    | "many people"                    |
| "it seems"       | [delete or rewrite definitively] |
| "could be"       | "is likely"                      |
| "perhaps"        | [delete or rewrite]              |
| "I think"        | [delete - state as fact]         |

### Step 6: ADD FAQ SECTION

Add before the disclaimer at the end. Use the "Target Queries" for each page.

**Format:**

```markdown
## FAQs About [Person]'s Personality

**[Actual search query as question]?**

[Direct answer in 2-3 sentences. First sentence directly answers the question.]

**[Another search query]?**

[Direct answer...]

[Repeat for 4-5 questions]
```

### Step 7: UPDATE INTERNAL LINKS

Add 2-3 links TO related content:

- Link to their Enneagram type page (e.g., `/enneagram-corner/enneagram-type-1`)
- Link to mental health content if relevant (e.g., `/enneagram-corner/enneagram-and-mental-illness`)
- Link to 1-2 other celebrity pages of the same type

### Step 8: UPDATE FRONTMATTER

Update these fields:

```yaml
lastmod: '2025-12-03' # Today's date
```

### Step 9: VERIFY QUALITY

Before finishing, verify:

- [ ] Title is under 60 characters
- [ ] Meta description is 150-160 characters
- [ ] Quick Answer box is present and direct
- [ ] Opening addresses a problem/question
- [ ] No hedging language remains
- [ ] FAQ section uses real search queries
- [ ] lastmod is updated

---

## Pages to Optimize (Priority Order)

### TIER 1: CRITICAL (5,000+ impressions, <1% CTR)

#### 1. IShowSpeed ✅ DONE

- **File:** `src/blog/people/creators/IShowSpeed.md`
- **Impressions:** 22,617 | **CTR:** 0.16% | **Position:** 3.44
- **Status:** Optimized 2025-12-03

#### 2. Emma Watson ✅ DONE

- **File:** `src/blog/people/new-movie-stars/Emma-Watson.md`
- **Impressions:** 8,486 | **CTR:** 0.32% | **Position:** 4.95
- **Status:** Optimized 2025-12-03
- **Applied meta_title:** "Why Is Emma Watson So Private? Her Type 1 Personality Explained"
- **Added:** Quick Answer box, FAQ section, internal links to Natalie Portman, Michelle Obama, mental health content

#### 3. Elon Musk ✅ DONE

- **File:** `src/blog/people/techies/Elon-Musk.md`
- **Impressions:** 7,654 | **CTR:** 0.34% | **Position:** 5.48
- **Status:** Optimized 2025-12-03
- **Applied meta_title:** "Elon Musk's Personality Type: Why He Acts the Way He Does"
- **Added:** Quick Answer box, FAQ section (5 questions)

#### 4. Sabrina Carpenter ✅ DONE

- **File:** `src/blog/people/musicians/Sabrina-Carpenter.md`
- **Impressions:** 6,668 | **CTR:** 0.25% | **Position:** 6.58
- **Status:** Optimized 2025-12-03
- **Applied meta_title:** "Sabrina Carpenter's Real Personality: What Type Is She?"
- **Added:** Quick Answer box, FAQ section (5 questions)

#### 5. Mark Zuckerberg ✅ DONE

- **File:** `src/blog/people/techies/Mark-Zuckerberg.md`
- **Impressions:** 6,703 | **CTR:** 0.28% | **Position:** 5.35
- **Status:** Optimized 2025-12-03
- **Applied meta_title:** "Why Is Mark Zuckerberg So Awkward? His Personality Decoded"
- **Added:** Quick Answer box, FAQ section (5 questions)

#### 6. Selena Gomez ✅ DONE

- **File:** `src/blog/people/lifestyle-influencers/Selena-Gomez.md`
- **Impressions:** 5,827 | **CTR:** 0.14% | **Position:** 5.94
- **Status:** Optimized 2025-12-03
- **Applied meta_title:** "Selena Gomez's Personality: How She Handles Fame & Mental Health"
- **Added:** Quick Answer box, FAQ section (5 questions), mental health angle

#### 7. Zendaya ✅ DONE

- **File:** `src/blog/people/new-movie-stars/Zendaya.md`
- **Impressions:** 5,229 | **CTR:** 0.17% | **Position:** 6.25
- **Status:** Optimized 2025-12-03
- **Applied meta_title:** "Zendaya's Personality Type: Why She's So Different From Other Stars"
- **Added:** Quick Answer box, FAQ section (5 questions), anxiety content link

#### 8. Billie Eilish ✅ DONE

- **File:** `src/blog/people/musicians/Billie-Eilish.md`
- **Impressions:** 5,021 | **CTR:** 0.18% | **Position:** 6.42
- **Status:** Optimized 2025-12-03
- **Applied meta_title:** "Billie Eilish's Personality Type: Why She's So Different"
- **Added:** Quick Answer box, FAQ section (5 questions), mental health angle

#### 9. Sam Altman ✅ DONE

- **File:** `src/blog/people/techies/Sam-Altman.md`
- **Impressions:** 5,331 | **CTR:** 0.88% | **Position:** 4.9
- **Status:** Optimized 2025-12-03
- **Applied meta_title:** "Sam Altman's Personality: The Psychology Behind AI's Most Powerful Man"
- **Added:** Quick Answer box, FAQ section (5 questions), link to Elon Musk comparison

#### 10. Jenna Ortega ✅ DONE

- **File:** `src/blog/people/new-movie-stars/Jenna-Ortega.md`
- **Impressions:** 5,086 | **CTR:** 0.37% | **Position:** 8.29
- **Status:** Optimized 2025-12-03
- **Applied meta_title:** "Jenna Ortega's Personality Type: The Real Girl Behind Wednesday"
- **Added:** Quick Answer box, FAQ section (5 questions)

---

### TIER 2: HIGH VALUE (3,000-5,000 impressions)

| Person         | Impressions | CTR   | Key Angle                    | Status      |
| -------------- | ----------- | ----- | ---------------------------- | ----------- |
| Sydney Sweeney | 4,807       | 0.37% | Break the blonde stereotype  | ✅ Dec 2025 |
| Mr Beast       | 4,287       | 0.51% | Obsessive generosity         | ✅ Dec 2025 |
| Dua Lipa       | 4,753       | 0.42% | Confidence and boundaries    | ✅ Dec 2025 |
| Drake          | 4,684       | 0.45% | Emotional vulnerability      | ⬜ Pending  |
| Ryan Gosling   | 4,539       | 0.55% | Silent intensity             | ⬜ Pending  |
| Justin Bieber  | 4,165       | 0.38% | Mental health journey        | ⬜ Pending  |
| Johnny Depp    | 3,977       | 0.2%  | Eccentricity explained       | ⬜ Pending  |
| Lana Del Rey   | 3,907       | 0.33% | Melancholy persona           | ⬜ Pending  |
| Keanu Reeves   | 3,877       | 0.57% | Why is he so kind?           | ⬜ Pending  |
| Bob Dylan      | 4,035       | 1.31% | Already decent - light touch | ⬜ Pending  |

---

### TIER 3: MEDIUM VALUE (2,000-3,000 impressions)

Process these after Tier 1 and 2 are complete:

- Timothee Chalamet
- Aubrey Plaza
- Nicole Kidman
- Kourtney Kardashian
- Margot Robbie
- Marilyn Monroe
- Jeff Bezos
- Dwayne Johnson
- Ariana Grande

---

## Example Optimized Page (IShowSpeed)

**Before:**

```yaml
title: 'IShowSpeed: Barking, Raging & The Challenger Within'
description: 'Explore the psychology driving YouTube sensation IShowSpeed...'
```

**After:**

```yaml
title: 'Does IShowSpeed Have Anger Issues? His Personality Explained'
description: "Why does IShowSpeed bark, rage, and act so chaotic? We analyze the psychology behind YouTube's most explosive streamer and reveal why he can't stop—his Type 8 personality explains everything."
```

**Added Quick Answer:**

```markdown
<div class="quick-answer">

**Quick Answer:** IShowSpeed doesn't have a clinical anger disorder—he has an Enneagram Type 8 personality, known as "The Challenger." Type 8s express intense emotions outwardly (rage, barking, screaming) as a defense mechanism to avoid appearing weak or vulnerable.

</div>
```

---

## Success Metrics

After optimization, track in GSC:

- CTR improvement target: 2-3x current rate
- Click improvement target: 50%+ increase
- Measure after 2-4 weeks for data

---

## Notes for AI Agent

1. Always verify the file path exists before editing
2. Read the current content before making changes
3. Preserve all existing content structure - only modify title, description, opening, and add FAQ
4. Keep the person's Enneagram type designation unchanged
5. Maintain the existing voice and depth of analysis
6. Update lastmod date to the date of optimization
7. If the page already has a Quick Answer box, improve it rather than duplicating
