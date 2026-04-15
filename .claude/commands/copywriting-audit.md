# Copywriting Audit — Find Blogs That Need Work

You are a triage agent for 9takes blog content. Your job is to scan published blogs across the site, score each one for copywriting quality using Harry Dry's three-rule framework, and produce a prioritized list of the blogs that most need a copywriting pass.

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

Each blog will be scored on three copywriting dimensions (each 1–10, lower = more work needed):

### Dimension 1: Concreteness Score (Rule 1 — Can I visualize it?)

How abstract vs. concrete is the language?

**Signals of poor score (abstract):**

- Titles or headings containing: `transformation`, `journey`, `growth`, `understanding`, `exploring`, `better way`, `potential`, `success`, `power of`, `art of`, `guide to` (as a filler, not descriptive)
- Opening paragraphs that describe what the post will cover rather than dropping into a scene or claim
- Heavy use of abstract nouns: `insight`, `awareness`, `mindset`, `evolution`, `process`, `approach`
- No named examples, specific people, or concrete scenarios in the first 300 words

**Signals of strong score (concrete):**

- Title references a specific person, scenario, or observable behavior
- Opening drops into a specific moment, observation, or claim
- Uses specific Enneagram type numbers in vivid behavioral terms (not just "Type X tends to...")

### Dimension 2: Specificity Score (Rule 2 — Can I falsify it?)

How specific and provable are the claims?

**Signals of poor score (vague):**

- Adjective-heavy benefit language: `effective`, `powerful`, `meaningful`, `valuable`, `important`, `significant`
- Claims that cannot be tested: "personality helps you understand yourself better"
- No direct quotes, no numbers, no named behaviors
- Over-hedging: "may help", "could potentially", "it's possible that"
- Passive constructions that avoid specific claims

**Signals of strong score (specific):**

- Named behaviors tied to specific types ("Type 2s apologize before stating their need")
- Direct quotes from specific people or community observations
- Specific situations with observable outcomes

### Dimension 3: Ownability Score (Rule 3 — Can nobody else say it?)

How unique is this to 9takes?

**Signals of poor score (generic):**

- Title or opening could appear on Psychology Today, Verywell Mind, or any Enneagram site
- No reference to the anonymous Q&A mechanic, community insight, or "emotions behind the take"
- Generic motivational framing: "start your journey", "unlock your potential", "embrace who you are"
- Enneagram content that's just type descriptions without the 9takes angle (community answers, perspective contrast)

**Signals of strong score (ownable):**

- References the give-first mechanic or the surprise of seeing other types' answers
- Frames insight as "what you'd never know without seeing X type's response"
- Headline is specific enough that it could only appear on a personality-insight platform

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
- All H2 and H3 headings (scan the full file for `## ` and `### ` patterns)

**Do this in parallel batches** — read up to 10 files simultaneously to save time.

---

## Step 3: Score Each Blog

For each blog, assign scores 1–10 on all three dimensions based on the signals above.

**Quick scoring heuristics:**

| Score | What it means                                                              |
| ----- | -------------------------------------------------------------------------- |
| 1–3   | Serious problem — generic title, abstract opening, vague benefit claims    |
| 4–5   | Below average — some abstract language, claims lack proof, generic framing |
| 6–7   | Average — okay but not sharp; some concrete moments, some generic filler   |
| 8–9   | Good — mostly concrete, specific, ownable; minor polish needed             |
| 10    | Excellent — Harry Dry would nod — every claim visual, falsifiable, unique  |

**Priority score** (used for ranking): `(10 - Concreteness) + (10 - Specificity) + (10 - Ownability)`

Higher priority score = more urgently needs a copywriting pass.

**Tiebreaker**: Prefer older `date` (older posts accumulate more traffic and benefit most from improvement).

**Bonus priority signals** (add 2 points each to priority score):

- Title contains `guide to`, `how to`, or `understanding` as a generic filler (not specific)
- Description is a re-statement of the title with no new information
- `lastmod` is more than 12 months ago (stale)
- First sentence starts with "In this post" or "This article will" or "X is a/an [noun] that"

---

## Step 4: Output the Prioritized List

Present results as a ranked table, most urgent first:

```
## Copywriting Audit Results

Scope: [category] | Blogs scanned: [N] | Top [N] listed below

| # | File | Title | Concreteness | Specificity | Ownability | Priority | Age |
|---|------|-------|-------------|-------------|------------|----------|-----|
| 1 | path/to/file.md | Title here | 3 | 4 | 2 | 21 | 2023-04 |
| 2 | ... | ... | ... | ... | ... | ... | ... |
...

---

### Top Priority: Immediate Copywriting Pass Needed

**1. [File path]**
- Title: "[title]"
- Why it needs work:
  - Concreteness (3/10): "[specific abstract phrase from title or opening]"
  - Specificity (4/10): "[specific vague claim found]"
  - Ownability (2/10): "[why any competitor could publish this]"
- Quick wins: [1-2 specific, actionable fixes that would have the highest impact]
- Run: `/copywriting-pass [file path]`

**2. [File path]**
...

---

### Second Tier: Would Benefit from a Pass

**[#]. [File path]**
- Title: "[title]"
- Why it needs work: [brief reason for each dimension flagged below 6]
- Run: `/copywriting-pass [file path]`

[continue for all second-tier blogs]

---

### Already Strong (score 7+ on all three rules)

[List these briefly — file path + title only. No detail needed.]

---

### Recommended Order of Attack

Given the above, here is the suggested sequence to maximize impact:

1. [File] — [one-sentence reason it's the highest leverage]
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

---

## Reference

- **Copywriting pass command**: `.claude/commands/copywriting-pass.md`
- **Brand voice guide**: `docs/brand/brand-style-guide-v2.md`
- **Core copywriting principles**: Harry Dry's three rules — visualizable, falsifiable, ownable
