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

Insert at the VERY TOP of content (after frontmatter, before first paragraph):

```markdown
<div class="quick-answer">

**Quick Answer:** [Direct 2-sentence answer to the implied question in the title. Be definitive, not hedging.]

</div>
```

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

#### 2. Emma Watson

- **File:** `src/blog/people/new-movie-stars/Emma-Watson.md`
- **Impressions:** 8,486 | **CTR:** 0.32% | **Position:** 4.95
- **Current Title:** "Emma Watson: The Hidden Perfectionist Behind Hermione"
- **Target Queries:**
  - "emma watson" (2,100 impressions)
  - "emma watson personality" (573 impressions)
  - "emma watson personality type" (447 impressions)
  - "what is emma watson doing now" (searches exist)
  - "emma watson personality traits" (133 impressions)
- **Suggested New Title:** "Why Is Emma Watson So Private? Her Type 1 Personality Explained"
- **Angle:** Her privacy, perfectionism, activism connection

#### 3. Elon Musk

- **File:** `src/blog/people/techies/Elon-Musk.md` (verify path)
- **Impressions:** 7,654 | **CTR:** 0.34% | **Position:** 5.48
- **Target Queries:**
  - "elon musk enneagram" (211 impressions, 3.79% CTR - keep this!)
  - "elon musk personality type" (285 impressions)
  - "elon musk personality traits analysis" (108 impressions)
  - "what is elon musk personality type" (37 impressions)
  - "elon musk personality analysis" (102 impressions)
- **Suggested New Title:** "Elon Musk's Personality Type: Why He Acts the Way He Does"
- **Angle:** Explain his controversial behavior through personality

#### 4. Sabrina Carpenter

- **File:** `src/blog/people/` (find exact path)
- **Impressions:** 6,668 | **CTR:** 0.25% | **Position:** 6.58
- **Target Queries:**
  - "sabrina carpenter personality" (1,522 impressions)
  - "sabrina carpenter personality type" (500 impressions)
  - "sabrina carpenter personality traits" (365 impressions)
  - "what is sabrina carpenter's personality" (138 impressions)
  - "words to describe sabrina carpenter" (13 impressions)
- **Suggested New Title:** "Sabrina Carpenter's Real Personality: What Type Is She?"
- **Angle:** Reveal the person behind the performer

#### 5. Mark Zuckerberg

- **File:** `src/blog/people/techies/Mark-Zuckerberg.md` (verify path)
- **Impressions:** 6,703 | **CTR:** 0.28% | **Position:** 5.35
- **Target Queries:**
  - "mark zuckerberg personality" (372 impressions)
  - "mark zuckerberg personality traits" (236 impressions)
  - "mark zuckerberg personality type" (204 impressions)
  - "mark zuckerberg enneagram" (34 impressions)
- **Suggested New Title:** "Why Is Mark Zuckerberg So Awkward? His Personality Decoded"
- **Angle:** Explain his robotic public image through personality type

#### 6. Selena Gomez

- **File:** `src/blog/people/` (find exact path)
- **Impressions:** 5,827 | **CTR:** 0.14% | **Position:** 5.94
- **Target Queries:**
  - "selena gomez personality" (301 impressions)
  - "selena gomez personality traits" (183 impressions)
  - "selena gomez traits" (71 impressions)
  - "selena gomez enneagram" (61 impressions)
  - "selena gomez character traits" (104 impressions)
- **Suggested New Title:** "Selena Gomez's Personality: How She Handles Fame & Mental Health"
- **Angle:** MENTAL HEALTH CONNECTION - this is the goldmine

#### 7. Zendaya

- **File:** `src/blog/people/` (find exact path)
- **Impressions:** 5,229 | **CTR:** 0.17% | **Position:** 6.25
- **Target Queries:**
  - "zendaya personality" (621 impressions)
  - "zendaya personality type" (338 impressions)
  - "zendaya personality traits" (134 impressions)
  - "what is zendaya's personality" (50 impressions)
- **Suggested New Title:** "Zendaya's Personality Type: Why She's So Different From Other Stars"
- **Angle:** Her uniqueness, groundedness in Hollywood

#### 8. Billie Eilish

- **File:** `src/blog/people/` (find exact path)
- **Impressions:** 5,021 | **CTR:** 0.18% | **Position:** 6.42
- **Target Queries:**
  - "billie eilish personality" (453 impressions)
  - "billie eilish personality type" (260 impressions)
  - "billie eilish personality traits" (248 impressions)
  - "billie eilish enneagram" (108 impressions)
  - "what is billie eilish's personality" (44 impressions)
- **Suggested New Title:** "Billie Eilish's Dark Personality: What Type Is She Really?"
- **Angle:** MENTAL HEALTH - her openness about depression/anxiety

#### 9. Sam Altman

- **File:** `src/blog/people/techies/Sam-Altman.md` (verify path)
- **Impressions:** 5,331 | **CTR:** 0.88% | **Position:** 4.9
- **Target Queries:**
  - "sam altman personality" (508 impressions)
  - "sam altman mbti" (587 impressions)
  - "sam altman personality type" (180 impressions)
  - "sam altman enneagram" (25 impressions, 12% CTR!)
  - "is sam altman a good person" (50 impressions)
  - "sam altman sociopath" (40 impressions)
- **Suggested New Title:** "Sam Altman's Personality: Visionary or Villain? A Deep Analysis"
- **Angle:** Address the controversy around him directly

#### 10. Jenna Ortega

- **File:** `src/blog/people/` (find exact path)
- **Impressions:** 5,086 | **CTR:** 0.37% | **Position:** 8.29
- **Target Queries:**
  - "jenna ortega personality" (674 impressions)
  - "jenna ortega personality type" (231 impressions)
  - "jenna ortega personality traits" (302 impressions)
  - "jenna ortega characteristics" (62 impressions)
- **Suggested New Title:** "Jenna Ortega's Real Personality: Is She Like Wednesday?"
- **Angle:** Contrast the character vs. the real person

---

### TIER 2: HIGH VALUE (3,000-5,000 impressions)

| Person         | Impressions | CTR   | Key Angle                    |
| -------------- | ----------- | ----- | ---------------------------- |
| Sydney Sweeney | 4,807       | 0.37% | Break the blonde stereotype  |
| Dua Lipa       | 4,753       | 0.42% | Confidence and boundaries    |
| Drake          | 4,684       | 0.45% | Emotional vulnerability      |
| Ryan Gosling   | 4,539       | 0.55% | Silent intensity             |
| Mr Beast       | 4,287       | 0.51% | Obsessive generosity         |
| Justin Bieber  | 4,165       | 0.38% | Mental health journey        |
| Johnny Depp    | 3,977       | 0.2%  | Eccentricity explained       |
| Lana Del Rey   | 3,907       | 0.33% | Melancholy persona           |
| Keanu Reeves   | 3,877       | 0.57% | Why is he so kind?           |
| Bob Dylan      | 4,035       | 1.31% | Already decent - light touch |

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
