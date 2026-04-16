# Copywriting Audit — Find Blogs That Need Work

You are a triage agent for 9takes blog content. Your job is to scan published blogs across the site, score each one for copywriting quality using Harry Dry's three-rule framework **plus structural/compression principles from his full interview**, and produce a prioritized list of the blogs that most need a copywriting pass.

This command is designed to be run first. The output tells you which blogs to feed into `/copywriting-pass`.

## Input

The user can optionally specify:

- A category to scope the audit: `guides`, `enneagram`, `community`, `people`, or `all` (default)
- A max number of blogs to return: e.g., `top 10` (default: top 15)
- A flag to skip already-audited blogs: `skip-audited` (default: true)

`$ARGUMENTS`

## Pre-Approved Operations

- **Read**: All blog files in the project
- **Glob**: Finding blog files across directories
- **Grep**: Scanning frontmatter and content for signals

---

## The Scoring Framework

Each blog is scored on **four** copywriting dimensions (each 1–10, lower = more work needed). Every dimension applies across **title, headers, subheaders, and body** — not just the title.

### Dimension 1: Concreteness Score (Rule 1 — Can I visualize it?)

How abstract vs. concrete is the language? Check title, all H2s, all H3s, and the first 400 words.

**Signals of poor score (abstract):**

- Titles, **H2s, or H3s** containing: `transformation`, `journey`, `growth`, `understanding`, `exploring`, `better way`, `potential`, `success`, `power of`, `art of`, `guide to` (as a filler, not descriptive), `the role of`, `navigating`, `embracing`
- Opening paragraphs that describe what the post will cover rather than dropping into a scene or claim
- Heavy use of abstract nouns: `insight`, `awareness`, `mindset`, `evolution`, `process`, `approach`, `wellbeing`
- No named examples, specific people, or concrete scenarios in the first 300 words
- Headers that name a topic instead of painting a scene or moment

**Signals of strong score (concrete):**

- Title and headers reference a specific person, scenario, or observable behavior
- Opening drops into a specific moment, observation, or claim
- Uses specific Enneagram type numbers in vivid behavioral terms (not just "Type X tends to...")
- Headers feel like things you could film

### Dimension 2: Specificity Score (Rule 2 — Can I falsify it?)

How specific and provable are the claims? Check headers and body claims.

**Signals of poor score (vague):**

- Adjective-heavy benefit language: `effective`, `powerful`, `meaningful`, `valuable`, `important`, `significant`, `transformative`
- Claims that cannot be tested: "personality helps you understand yourself better"
- No direct quotes, no numbers, no named behaviors
- Over-hedging: "may help", "could potentially", "it's possible that"
- Passive constructions that avoid specific claims
- Headers that promise an outcome without naming the evidence: "How the Enneagram Helps You Grow"

**Signals of strong score (specific):**

- Named behaviors tied to specific types ("Type 2s apologize before stating their need")
- Direct quotes from specific people or community observations
- Specific situations with observable outcomes
- Headers point at a verifiable claim or named situation

### Dimension 3: Ownability Score (Rule 3 — Can nobody else say it?) — **scored across title + every H2 + every H3**

How unique is this to 9takes? **The biggest gap in most posts is generic H2/H3 framing even when the title is strong.**

When scoring, run the competitor-signability test on:

- The **title**
- **Every H2** — could 16Personalities, Truity, Personality Hacker, MBTI sites, Psychology Today, or any Enneagram site publish this header unchanged?
- **Every H3** — same test
- The **opening** and major body claims

**Signals of poor score (generic):**

- Title or opening could appear on Psychology Today, Verywell Mind, or any Enneagram site
- **Most H2s read like generic textbook chapter headings**: "Understanding Type 4", "What is the Enneagram?", "Common Misconceptions", "Tips for Growth", "How to Apply This in Your Life"
- H3s are bland subheaders with no 9takes specificity
- No reference to the anonymous Q&A mechanic, community insight, or "emotions behind the take"
- Generic motivational framing: "start your journey", "unlock your potential", "embrace who you are"
- Enneagram content that's just type descriptions without the 9takes angle (community answers, perspective contrast, give-first dynamic)

**Signals of strong score (ownable):**

- References the give-first mechanic or the surprise of seeing other types' answers
- Frames insight as "what you'd never know without seeing X type's response"
- Headline and headers are specific enough that they could only appear on a personality-insight platform
- H2s name Type-on-Type interactions, specific moments, or community-derived patterns
- Headers use parallel framing across siblings (e.g., all 4 H2s frame the same kind of question for different Types)

### Dimension 4: Structure & Compression Score (Harry Dry's structural principles)

How well does the post hold attention through structure, conflict, and word economy?

**Signals of poor score (loose structure):**

- Opening paragraph(s) explain what the post is about instead of dropping in: "In this post we'll explore...", "This article will...", "Before we dive in..."
- Long monolithic paragraphs (5+ lines with no break)
- Sections that just list traits or benefits with **no conflict** (no Type-on-Type tension, no before/after, no expectation-vs-reality)
- Filler phrases throughout: "it's important to note that", "at the end of the day", "in many ways", "needless to say", "as we all know"
- H2s have **inconsistent framing** (one is a question, one is a noun phrase, one is a how-to) — no parallel structure
- H2 scope is too broad: "Personality and Relationships" instead of "Why Type 4s misread Type 1 silence as judgment"
- Repeated points restated in slightly different language
- No short punch sentence in any 3+ paragraph stretch

**Signals of strong score (tight structure):**

- Opens with a scene, claim, or conflict — not a meta-description
- Paragraphs feel close to two lines (broken into digestible chunks)
- Every section has tension: contrast, conflict, or surprise
- H2s share parallel framing — they are siblings in form, not just topic
- Headers narrow scope to a specific Type, moment, or situation
- Word economy: cuts filler, uses short sentences as punctuation between longer ones

---

## Step 1: Find All Published Blogs

Depending on the scope argument, search these directories:

| Category    | Directories to scan                                                                                                                                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `guides`    | `src/blog/guides/` (exclude `drafts/`)                                                                                                                                                                                   |
| `enneagram` | `src/blog/enneagram/` (exclude `drafts/` and `mental-health/*.review.md` etc.)                                                                                                                                           |
| `community` | `src/blog/community/` (exclude `drafts/`)                                                                                                                                                                                |
| `people`    | `src/blog/people/drafts/` (these are the celebrity analysis drafts — include only)                                                                                                                                       |
| `all`       | All of the above plus `src/blog/generational/`, `src/blog/historical/`, `src/blog/life-situations/`, `src/blog/life-style/`, `src/blog/overview/`, `src/blog/pop-culture/`, `src/blog/situational/`, `src/blog/topical/` |

**Filter rules:**

- Only include files with `published: true` in frontmatter (except `people` — include all drafts there)
- Skip: template files, files named `template.md`
- Skip: supplementary files ending in `.review.md`, `.instagram.md`, `.reddit.md`, `.twitter.md`
- Skip: files already marked with `copywriting_pass: true` in frontmatter (if `skip-audited` flag is set)
- Skip: research docs, reports, or index files (containing "research", "report", "INDEX", "OUTLINE" in filename)

---

## Step 2: Sample Each Blog

For each qualifying blog, read:

- The frontmatter (title, description, date, lastmod)
- The first 400 words of content (after frontmatter and script blocks)
- **Every H2 and H3 heading** (scan the full file for `## ` and `### ` patterns) — these are first-class scoring inputs, not just signals
- A sample of the longest paragraph in the post (to spot density issues)

**Do this in parallel batches** — read up to 10 files simultaneously to save time.

**Header inventory**: build a quick mental list of all H2/H3s before scoring. The Ownability score should weight headers heavily — a blog where the title is sharp but 6 of 7 H2s are competitor-signable is still a high-priority pass.

---

## Step 3: Score Each Blog

For each blog, assign scores 1–10 on all **four** dimensions based on the signals above.

**Quick scoring heuristics:**

| Score | What it means                                                                        |
| ----- | ------------------------------------------------------------------------------------ |
| 1–3   | Serious problem — generic title and headers, abstract opening, vague benefit claims  |
| 4–5   | Below average — some abstract language, claims lack proof, generic header framing    |
| 6–7   | Average — okay but not sharp; some concrete moments, some generic headers/filler     |
| 8–9   | Good — mostly concrete, specific, ownable, well-structured; minor polish needed      |
| 10    | Excellent — Harry Dry would nod — every claim and header visual, falsifiable, unique |

**Priority score** (used for ranking): `(10 - Concreteness) + (10 - Specificity) + (10 - Ownability) + (10 - Structure)`

Higher priority score = more urgently needs a copywriting pass. Max possible: 40.

**Tiebreaker**: Prefer older `date` (older posts accumulate more traffic and benefit most from improvement).

**Bonus priority signals** (add 2 points each to priority score):

- Title contains `guide to`, `how to`, or `understanding` as a generic filler (not specific)
- Description is a re-statement of the title with no new information
- `lastmod` is more than 12 months ago (stale)
- First sentence starts with "In this post" or "This article will" or "X is a/an [noun] that"
- **More than half of H2s would pass the competitor-signability test** (i.e., they could appear on any personality blog)
- **Zero conflict** in any major section — the post is purely descriptive/listicle
- Average paragraph length exceeds 5 lines (density issue)

**Penalty for top-traffic / SEO-sensitive posts** (subtract 5 from priority score):

- These need only light-touch passes — flag them but don't push to the top of the queue
- Known sensitive posts: `enneagram-and-mental-illness` and any blog the user has flagged as top-traffic
- Note in the output that the recommendation is a body-only pass, not a title/H2 rewrite

---

## Step 4: Output the Prioritized List

Present results as a ranked table, most urgent first. **Add a "Worst Header" column** to surface the most competitor-signable H2 in each post — this gives an at-a-glance read on the structural issue.

```
## Copywriting Audit Results

Scope: [category] | Blogs scanned: [N] | Top [N] listed below

| # | File | Title | Concrete | Specific | Ownable | Structure | Priority | Worst Header | Age |
|---|------|-------|----------|----------|---------|-----------|----------|--------------|-----|
| 1 | path/to/file.md | Title here | 3 | 4 | 2 | 4 | 27 | "Understanding Type 4" | 2023-04 |
| 2 | ... | ... | ... | ... | ... | ... | ... | ... | ... |
...

---

### Top Priority: Immediate Copywriting Pass Needed

**1. [File path]**
- Title: "[title]"
- Why it needs work:
  - Concreteness (3/10): "[specific abstract phrase from title or opening]"
  - Specificity (4/10): "[specific vague claim found]"
  - Ownability (2/10): title + [N of M] H2s are competitor-signable. Worst examples:
    - H2: "[exact generic H2]"
    - H2: "[exact generic H2]"
  - Structure (4/10): [e.g., "Intro spends 2 paragraphs on meta-commentary; sections 2 and 4 have no conflict, just trait lists; H2 framing is inconsistent (mix of questions and noun phrases)"]
- Quick wins: [1-3 specific, actionable fixes that would have the highest impact — usually a title + 2 worst H2 rewrites]
- Run: `/copywriting-pass [file path]`

**2. [File path]**
...

---

### Second Tier: Would Benefit from a Pass

**[#]. [File path]**
- Title: "[title]"
- Why it needs work: [brief reason for each dimension flagged below 6, including header issues if applicable]
- Run: `/copywriting-pass [file path]`

[continue for all second-tier blogs]

---

### Already Strong (score 7+ on all four dimensions)

[List these briefly — file path + title only. No detail needed.]

---

### Top-Traffic / SEO-Sensitive (light-touch only)

[List any flagged sensitive posts. Recommend body-only pass; do not auto-rewrite title or H2s.]

---

### Recommended Order of Attack

Given the above, here is the suggested sequence to maximize impact:

1. [File] — [one-sentence reason it's the highest leverage, e.g., "All 5 H2s are competitor-signable; biggest ownability lift available"]
2. [File] — [reason]
3. [File] — [reason]
...
```

---

## Step 5: Offer to Run the First Pass

After outputting the list, ask:

> "Would you like me to run `/copywriting-pass` on the #1 priority blog now?"

If the user says yes, immediately run the copywriting pass on that file.

---

## Edge Cases

- **No blogs found in category**: Report clearly, list what directories were searched
- **All blogs already audited** (skip-audited flag): Report count, ask if user wants to re-audit
- **Very large `all` scope**: Cap at reading 60 blogs max; note the cap and offer to continue in batches
- **Blogs with no frontmatter date**: Treat as oldest (highest priority on tiebreaker)
- **People blogs**: These are drafts, so score on the same rules but note "DRAFT" in the table
- **Blog has very few headers (1–2 H2s only)**: Score Ownability primarily on title + body, note in output that header sample is small
- **Top-traffic post flagged**: Apply the -5 penalty; surface in its own section so the user knows it's a candidate but for body-only treatment

---

## Reference

- **Copywriting pass command**: `.claude/commands/copywriting-pass.md`
- **Brand voice guide**: `docs/brand/brand-style-guide-v2.md`
- **Source transcripts**:
  - `youtube-transcript-research/3-rules-of-copywriting.md` (Harry Dry — visual / falsifiable / ownable)
  - `youtube-transcript-research/learn-copywriting.md` (Harry Dry full interview — structure, compression, conflict, scope, standards)
- **Core copywriting principles**: Harry Dry's three rules (visualizable, falsifiable, ownable) + structural principles (parallel headers, conflict, narrow scope, two-line paragraphs, Kaplan's Law)
