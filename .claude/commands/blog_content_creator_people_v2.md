# Blog Content Creator (v2)

You are tasked with researching, drafting, and refining celebrity personality analysis blogs for the 9takes platform. This command owns the writing-side workflow: research synthesis, Enneagram analysis, draft, revision, frontmatter, and internal linking.

This is **v2** — the working revision. Compare with `blog_content_creator_people.md` (v1) to see the full restructure. Key changes: four unified craft principles (replacing overlapping tone rules), explicit SEO-vs-copywriting heading balance, Harry Dry's copywriting discipline integrated natively (no bolted-on "Copywriting Pass" step), and inline rules designed to survive a skipped Read of the external playbooks.

## Pre-Approved Operations

- **WebSearch**: All web searches for research
- **Read**: All file reads in project directories
- **Write / Edit**: Creating and editing draft files in `src/blog/people/drafts/`
- **Bash**: `grep`, `env`, `echo`, `ls`, `test` for local research and content checks
- **Glob / Grep**: Searching the codebase for link targets and existing drafts

## Task Tracking

Use TaskCreate / TaskUpdate to track progress through the workflow. Create an initial task list when starting a new blog or major update. Keep only one task `in_progress` at a time. Mark tasks `completed` immediately after finishing them.

## Scope

**In scope:** research, Enneagram analysis, transcript synthesis, draft writing, revision, frontmatter quality, internal linking inside the draft.

**Out of scope:** database reads/writes, stale-blog audits, `famousTypes.ts` regeneration, image handling, publication-state changes. After the draft is approved, hand off to `blog_content_production_people`.

---

# Part 1: Reference Guide

These sections define the rules the workflow in Part 2 applies. Everything a writer must follow to produce a 9takes-quality blog lives in this Part — the external playbooks (`prep-prompt-1.md`, `prep-prompt-2.md`, `writing-prompt-1.md`) add research depth and worked examples, not safety. The blog should not fail quality if one of them is skipped.

---

## The Quality Bar

A 9takes celebrity blog is not a Wikipedia summary, a personality-quiz page, or an Enneagram explainer that uses a celebrity as a prop. It is a compelling psychological profile that happens to use the Enneagram as a lens. Before anything else, a draft must clear these five bars:

1. **One driving thesis that resolves a public contradiction.** "Fear, not power, drives everything" (Thiel). "The performance that made her famous was a coping mechanism for trauma" (Paris Hilton). If you cannot state it in one phrase that would surprise a casual fan, dig deeper.
2. **The Enneagram explains something non-obvious.** Remove every Enneagram reference — does the blog still make the same analytical points? If yes, the framework isn't doing real work.
3. **The subject's own words carry the analysis.** Direct quotes are structural, not decorative. Paraphrasing is the fallback.
4. **At least one signature detail** — a small, specific, seemingly minor moment that cracks the person open (Thiel's parachute, the gift that didn't land, the Wikipedia page corrected from "Spanish descent" to "Basque"). Not a headline accomplishment.
5. **Prose that hits.** Rhythm varies. Short sentences land after long ones. If a paragraph sounds like a textbook, it gets rewritten.

---

## The Five Craft Principles

These are the rules for how 9takes celebrity blogs are _written_. They apply to hooks, headings, claims, and prose. Each principle ships with a before/after example, because the first principle is itself "show, don't label."

### 1. Show, don't label

Describe behavior vividly. Let the pattern resonate. Do not stamp the type on every paragraph.

- **Avoid (label):** "This is classic Type 8 behavior — protective and uncompromising."
- **Prefer (show):** "She set the terms. She always sets the terms. And if you get too close without permission, you'll know."

**Where it applies:** prose in every section. Explicit phrases like "classic Type X," "Type Xs characteristically...," or "consistent with Type X patterns" — use at most twice in the entire blog.

### 2. Point, don't talk

Replace adjectives with evidence you can point at. Instead of asserting a quality, reference the specific behavior, quote, number, or moment that demonstrates it.

- **Avoid (talking):** "He is deeply ambitious and relentlessly driven."
- **Prefer (pointing):** "He has written 44 films and he is getting faster."

**The confidence corollary:** analyze with conviction in the body. The disclaimer at the bottom handles the speculation caveat. Don't undermine every insight with "likely," "suggests," "appears to be" — reserve hedging for genuinely ambiguous cases. A blog that says "Logan Paul is a Type 3" followed by overwhelming evidence is stronger than one that says "Logan looks like a Type 3."

**Where it applies:** every analytical claim. Especially the thesis restatement, the core-tension summary, and the type diagnosis.

### 3. Story over system

The Enneagram is a lens, not a subject. Keep typology debates off the page.

- **Avoid (system-first):** A paragraph arguing "Type 3 vs. Type 7" and weighing wings.
- **Prefer (story-first):** A vivid account of the behavior, with one sentence of type framing where it genuinely adds insight.

**Specific rules under this principle:**

- Do not build sections around "why they're Type X and not Type Y."
- If an alternate type must be mentioned, one clarifying line max — then return to the person's life.
- Advanced Enneagram mechanics (wings, arrows, subtypes) appear only when they clarify the person for a reader who doesn't know Enneagram jargon.
- Validate the typing in your research notes, not in the blog body.

**Where it applies:** the whole draft. Especially the "What is [Person]'s personality type?" section — it should analyze the person, not argue against neighboring types.

**Exception — the Enneagram Rabbit Hole block:** typology-nerd content (wings, instinctual subtypes, stress/growth arrows, counter-typing cases against neighboring types) is permitted when quarantined inside a collapsed `<details class="enneagram-rabbit-hole">` block clearly labeled _"🐇 Enneagram Rabbit Hole"_ with an opt-in note like _"Skip if you're not deep into the system — the rest of the analysis stands on its own."_ This block is added by a separate flow, not by this command. Do **not** generate a Rabbit Hole from this command. But when Self-Review encounters one in the draft, treat it as approved — it does not count against the Distribution Rule or the "story over system" principle, because it is reader-opt-in and sits outside the main narrative surface.

### 4. Sound like 9takes

Every line should be one nobody else could publish unchanged. A Psychology Today piece, a 16Personalities post, and a generic Medium essay should all fail a copy-paste test against your draft.

- **Avoid (anyone could say it):** "Understanding your personality helps you grow."
- **Prefer (ownable):** "When a Type 4 reads Type 8 answers, they stop mistaking anger for cruelty."

**Where it applies:** signature headings, pull quotes, the ending. **But note:** principle 4 pulls against SEO. Not every heading should be maximally ownable — some should be search-intent. See "Heading Strategy: SEO vs. Copywriting Balance" below for the mix rule.

### 5. Compress ruthlessly

Every word must do work. Long paragraphs hide weak thinking. Compression signals quality; length is not a proxy for depth.

- **Avoid (filler + meta-commentary):** "In this post, we'll explore how Taylor Swift's background shaped her career. It's important to note that, in many ways, her journey has been complex."
- **Prefer (compressed):** "Taylor Swift wrote her first contract at 14. She has been re-writing them ever since."

**Specific rules under this principle:**

- **Kaplan's Law of Words** — cut every word, phrase, or sentence that doesn't earn its place. If a sentence can be deleted without loss, delete it.
- **First line. Second line.** The opening sentence sells the second. The second sells the third. Do not announce the post; drop into it.
- **Kill meta-commentary.** Ban: "In this post, we'll explore...", "Let's dive into...", "Before we get started...", "By the end of this article...". These announce instead of delivering.
- **Kill filler.** Watch for: "it's important to note that," "at the end of the day," "in many ways," "needless to say." Cut on sight.
- **Two-line paragraphs (or feels like it).** Break any paragraph over ~4 lines. White space is a feature.
- **Two-second test.** Every headline, header, and opening sentence should land its meaning in under two seconds. If it needs rereading, sharpen it.
- **Narrow beats broad.** Strength of an idea is inversely proportional to its scope. "How Taylor Swift wrote a break-up album that outsold her break-ups" beats "How Taylor Swift processes emotion."

**Where it applies:** every paragraph, every heading, every transition. Apply this principle last — after the story is in place — to tighten without gutting voice.

---

## The Distribution Rule

Explicit Enneagram framing — naming the type, referencing theory, phrases like "Type X typically..." — appears in **at most 3–4 sections** of the blog. The rest work as pure narrative and let the reader connect the dots.

**Sections that should lean pure narrative:** upbringing, rise to fame, personality quirks, accomplishments.

**Sections where explicit framing fits:** "What is [Person]'s personality type?" (always); the final section's sharpest insight; one or two body moments where naming the type genuinely deepens understanding.

**Litmus test:** if you removed every sentence that explicitly mentions "Type X" or "Enneagram," would the blog still be a compelling profile? If yes, the Enneagram is being used well.

**Where wings, subtypes, and arrows go:** the Distribution Rule pushes advanced Enneagram mechanics out of the body. They live in the **Enneagram Rabbit Hole** furniture block (see Step 6). Power readers open it; casual readers scroll past. This pattern simultaneously serves general readers, hardcore Enneagram users, and LLM long-tail fan-out queries.

---

## Repetition Prevention

**Golden rule:** every major quote, concept, and anecdote appears exactly once, in its strongest context.

Blogs have multiple structural layers — intro, TL;DR, evidence list, body sections, ending — and material easily duplicates across 2–3 of them. This destroys engagement because the reader feels like they keep re-reading the same piece.

**Three specific rules:**

1. **Quotes appear once.** If a quote is the epigraph, don't repeat it in the evidence list or body. Reference it briefly ("the Grammy speech we opened with") if needed.
2. **Anecdotes and concepts belong to one section.** A brief forward-reference is fine ("we'll see this pattern in her relationships"). A full re-telling is not.
3. **TL;DR is a teaser, not a summary.** Name the type in one line, sketch 3–4 patterns in one sentence each, leave the stories for the body. A TL;DR that spoils the best anecdotes kills the reason to keep scrolling.

**Pre-finalize scan:** before saving, read the piece top-to-bottom and flag any quote, anecdote, or concept that appears more than once. Keep the strongest placement, cut the rest.

---

## The Hook Test

The first 3–5 paragraphs decide whether a Google-landing reader stays. Apply three tests to the opening:

1. **Can I visualize it?** The opening must anchor in a concrete image — an object, a scene, a specific moment. Not a rhetorical question. Not a definition of the person's career.
2. **Can I falsify it?** The opening claim must be testable. "Peter Thiel bought a parachute and kept it on the 42nd floor of 555 California Street" is falsifiable. "Peter Thiel has a complex relationship with risk" is not.
3. **Does it name or imply the core tension?** By the end of the intro, the reader should feel "that doesn't add up — I need to understand this." Don't ask a rhetorical question and immediately answer it; that kills the tension.

**Hook shapes that work** (described, not shown — see `writing-prompt-1.md` for full excerpts and calibration):

- The **contradicting object**: a concrete item or scene that immediately contradicts the person's public perception.
- The **off-brand quote**: a direct quote from the subject that sounds nothing like their public image.
- **Consequence-first**: the aftermath of a defining moment before the moment itself.
- **A sentence nobody else would write about this person**: specific, falsifiable, and only applies to them.

**Anti-imitation rule:** do not copy the structural cadence of any hook you read in the reference library. Use those excerpts to calibrate what _great_ feels like, not as templates to match. If your hook feels like a sibling of a Peter Thiel / Paris Hilton / Blake Lively opening, rewrite it until it stands alone.

---

## Statistical Claims & Cited Sources (Strongly Encouraged, Not Required)

Content with specific numerical claims gets cited by LLMs at meaningfully higher rates — Princeton's GEO research flagged "Statistics Addition" and "Cite Sources" as the top two visibility-lift techniques in their study (up to ~40% lift). One or two well-placed, falsifiable numbers with named sources can elevate a blog from "another take" to "the take ChatGPT/Claude/Perplexity quotes."

This is **not a hard gate**. A tight profile with zero numbers can still be excellent. But a blog with one or two specific, sourced numbers in the right places will out-rank, out-cite, and out-travel a vibes-only blog every time.

### What counts as a citation-grade stat

- **About the person**, verifiable from a named source: "[Person] has released 14 studio albums in 11 years" (Discogs), "[Person]'s _Memoir Title_ sold 2.3 million copies in its first year" (Publishers Weekly).
- **About their field** or domain, anchoring the person in context: "Only 4 of the last 25 Best Director winners started as actors" (Academy records).
- **About the corpus**, when relevant and available: "Of the 23 Type 8 musicians profiled on 9takes, [Person] is one of only 3 who…" (9takes corpus data). Pull numbers from `docs/data/corpus-stats.md` (LLM-readable) and link out to the public page at `https://9takes.com/corpus-stats` (canonical source + JSON-LD `Dataset` for Google/LLM citation).
- **Confidence framing** on the typing itself: "Confidence: high — the wing/subtype/arrow evidence all point to 5w6."

### What does NOT count

- Invented numbers. If you can't cite the source, don't include the number.
- Round marketing numbers without provenance ("millions of fans," "tons of interviews").
- Statistics that restate the obvious ("[Person] has appeared in over 10 films" for a well-known actor).

### Placement (1–2 stats per blog is the sweet spot)

Best homes for stats, in priority order:

1. **Inside the hook** — a concrete falsifiable number immediately earns trust and anchors the first paragraph.
2. **In the type-diagnosis section** — a number that pressure-tests the typing ("documented 7 public feuds in 5 years" for a Type 8 call).
3. **In the Enneagram Rabbit Hole counterarguments section** — a stat weighing for/against the typing signals epistemic honesty.
4. **In an accomplishment section** — a precise career number ("wrote 44 films") beats "prolific."

### Citation format

Inline citations are fine. Preferred shapes:

- Parenthetical source: "…13 of his last 15 films (Box Office Mojo)…"
- Hyperlinked source: "…[2023 Diary of a CEO appearance](url)…"
- Named-source prefix: "Per Forbes' 2024 list…"

Do not footnote. Do not fabricate. If the source is weak or unverifiable, cut the claim.

### Why this lives in the command

Stat-claim density is one of the highest-signal differentiators between a blog that gets cited by an LLM and one that does not. The rest of the craft in this command gets the reader to stay; statistics get the model to quote. Both matter.

---

## The Ending Rule

No traditional conclusion. No summary. No CTA. No "what does this mean for you?" No mirror-on-reader question.

The blog ends on its sharpest insight and stops. Cut to black. The reader should be left with a reverberating thought — an unresolved tension, a haunting image, a question that lingers.

**The test:** does the ending feel like a mic drop or like a flight attendant thanking you for flying? If the latter, cut everything after the strongest line.

**Ending shapes that work** (described, not shown — see `writing-prompt-1.md` for full excerpts):

- **Short declarative that reframes the piece** — one or two punchy lines that recast everything above.
- **Image that reverberates** — a specific visual callback that lands without explanation.
- **Unresolved question or open loop** — leaves the reader holding the tension.
- **Callback to the opening detail** — closes the loop on the concrete image from the hook.

**Anti-imitation rule:** do not echo the cadence of any ending you read in the reference library. Specifically avoid the `"A [Type]. Doing what [Type]s do. [Anaphora]. [Anaphora]. [Anaphora]."` structure — once two blogs in the catalog share it, it becomes formulaic. Calibrate on what great _feels like_, then find a shape that fits only this person.

---

## Internal Enneagram Knowledge Base

Use the internal 9takes library before external explainers when framing the Enneagram analysis.

**Primary index:** `/docs/development/enneagram-mental-health-blog-index.json`

**Required pass:**

1. Read the index. Shortlist the most relevant internal posts by `tags`, `description`, `section`.
2. Read at least **3–6 full internal posts** before finalizing the type hypothesis.
3. Build a short "internal lens brief" with pattern hypotheses, counter-hypotheses, and the relevant lenses (stress, relationships, communication, mental health, work style). Use this brief to sharpen your reading of external evidence.

**Rules for internal blogs:**

- They inform psychological framing, not facts about the person.
- Pair every person-specific claim with external primary evidence.
- Synthesize in your own words — do not copy phrasing.
- Use internal contrast posts privately to pressure-test the hypothesis; keep that argument out of the blog body.

---

## Triple-Title System

9takes uses three title fields. Strategy: "clickbait to the door, quality inside." Each title is optimized against a different balance of SEO, CTR, and ownability.

### 1. `title` — evergreen + SEO-weighted

Displayed on the blog page itself. Professional, accurate, timeless. Should remain valuable years from now. Leans toward recognizable search-intent phrasing.

- Passes: **visualize** (names the person + a specific frame), moderate on falsifiability
- Example: `Elon Musk: An In-Depth Enneagram Type 5 Analysis`

### 2. `meta_title` — CTR-weighted

Used for search results, social sharing, browser tabs. Problem-focused, curiosity-inducing. Target 50–60 characters; 65 max.

- Passes: **visualize** (concrete behavior or tension) + **falsify** (a claim that's true or false, not a mood)
- Good: `Inside Elon Musk's Mind: Why He Can't Stop Taking Risks`
- Failing: `Understanding Elon Musk's Personality` (vague, not falsifiable)

**Patterns that perform in GSC data:**

- `Why [Person] Can't Stop [Behavior]` — problem framing
- `Inside [Person]'s Mind: [Insight]` — curiosity hook
- `The Real Reason [Person] [Did Thing]` — revelation
- `[Person]'s Hidden [Trait]: What It Reveals` — discovery

### 3. `persona_title` — ownability-weighted

2–5 words, displayed on listing pages. Feels like a wrestling name or comic-book epithet. Subtly alludes to the type without naming it.

- Passes: **ownable** (nobody else could say it unchanged)
- Format: `[Domain]'s [Type-Allusive Adjective] [Archetype]` or `The [Archetype Reference]`
- Example: `Tech's Mad Scientist` (Elon Musk, Type 5)

### Persona title vocabulary by type

| Type  | Core Essence           | Adjectives                                  | Archetypes                                               |
| ----- | ---------------------- | ------------------------------------------- | -------------------------------------------------------- |
| **1** | Perfectionist/Reformer | Principled, Uncompromising, Earnest, Moral  | Crusader, Perfectionist, Reformer, Visionary, Conscience |
| **2** | Helper/Giver           | Devoted, Approachable, Tender, Nurturing    | Helper, Servant, Caretaker, Ambassador, Confessor        |
| **3** | Achiever/Performer     | Self-Made, Polished, Relentless, Calculated | Achiever, Architect, Reinventor, Machine, Star           |
| **4** | Individualist/Romantic | Melancholic, Reclusive, Tortured, Haunted   | Artist, Poet, Rebel, Enigma, Outsider                    |
| **5** | Investigator/Observer  | Methodical, Intense, Cold, Silent           | Architect, Strategist, Observer, Recluse, Mind           |
| **6** | Loyalist/Skeptic       | Loyal, Anxious, Trusted, Skeptical, Steady  | Guardian, Watchdog, Skeptic, Patriarch, Anchor           |
| **7** | Enthusiast/Adventurer  | Restless, Manic, Boundless, Chaotic         | Pioneer, Showman, Adventurer, Spark, Optimist            |
| **8** | Challenger/Protector   | Fierce, Unapologetic, Uncompromising, Alpha | Titan, Force, Brawler, Warrior, Disruptor                |
| **9** | Peacemaker/Mediator    | Gentle, Quiet, Easygoing, Laid-Back, Steady | Philosopher, Bridge-Builder, Anchor, Giant, Presence     |

### Title examples

| Person       | `title` (evergreen + SEO)                | `meta_title` (CTR)                                                 | `persona_title` (ownable)    |
| ------------ | ---------------------------------------- | ------------------------------------------------------------------ | ---------------------------- |
| Taylor Swift | Taylor Swift: Enneagram Type 3 Analysis  | Why Taylor Swift Can't Stop Reinventing Herself                    | Pop's Heartbreak Alchemist   |
| Elon Musk    | Elon Musk: An In-Depth Type 5w6 Analysis | Inside Elon Musk's Mind: The Obsessive Pattern Behind His Chaos    | Tech's Mad Scientist         |
| Emma Watson  | Emma Watson: Enneagram Type 1 Analysis   | Emma Watson's Hidden Perfectionism: The Pattern Behind Her Choices | Hogwarts' Real-World Prefect |

### Technical note

- `PeopleBlogPageHead.svelte` uses `data?.meta_title || data?.title`
- The page displays `title` via `ArticleTitle`
- `persona_title` is read from the DB and shown on listing pages via `famousTypes.ts`

---

## Heading Strategy: SEO vs. Copywriting Balance

Harry Dry's ownability test, applied naively, would push every H2 toward maximum cleverness. SEO pulls the other way — toward recognizable search-intent phrases (`Why [Person] can't stop [X]`, `[Person]'s childhood`). Neither extreme is right.

### The mix rule

In every celebrity blog, the H2 set should distribute roughly like this:

- **1–2 signature headings** — pure copywriting wins. Person-only, vivid, ownable.
- **2–3 search-intent headings** — pure SEO wins. Look like real queries a reader would type.
- **Remainder are hybrids** — carry story _and_ search intent in one phrase.

**The best headings are hybrids.** `The Empty Desk That Still Drives IShowSpeed` names a person and keeps the search-intent intact. `Why Jennifer Lopez Seems So Demanding` feels like a real query and also belongs only to her. `How Hailey Bieber Turned Pressure Into Rhode` points at a specific product and a specific transformation.

### Parallel framing across siblings

When two or more H2s cover related ground, frame them in parallel. Parallel structure signals craft; drift signals randomness.

- **Avoid (drift):** `What Taylor Swift sounds like under stress` → `Some thoughts on her growth arc` → `Reinvention patterns`
- **Prefer (parallel):** `What Taylor Swift sounds like under stress` → `What Taylor Swift sounds like in growth` → `What Taylor Swift sounds like when she reinvents`

This also applies to H3 siblings inside a section. If H3 #1 names a specific contradiction, H3 #2 should too — not pivot to an abstract category.

### Required structural heading (always present)

- H2: `What is [Person]'s personality type?`
- H3: `[Person] is an Enneagram Type X`

This pair exists for SEO and is non-negotiable. It appears exactly once.

### Search-intent heading patterns

- `Why [Person] ...`
- `How [Person] ...`
- `[Person]'s childhood`
- `[Person] and [topic]`

### Anti-patterns (both failure modes)

- **Flat category headings** that could belong to any celebrity: `Upbringing`, `Rise to Fame`, `Controversies`, `Personality Quirks`. Fails ownability.
- **Opaque magazine headings** with no topic signal: `The Wiring`, `The Empty Desk`, `The Mask`. Fails SEO and fails the two-second test.

If a vivid heading is too cryptic, **add the topic back into it** instead of flattening it. `The Empty Desk` → `The Empty Desk That Still Drives IShowSpeed`.

### Heading test (apply to every H2/H3)

1. Could I picture what this section is about from the heading alone? (visualize)
2. Is the heading a specific claim or topic, not a mood or theme? (falsify)
3. Would a reader searching for this person's story plausibly land here? (SEO)
4. Could a Psychology Today or 16Personalities article use this heading unchanged? (ownable — inverse test)
5. Does the meaning land in under two seconds? (two-second test — if a reader has to reread, sharpen or cut)

A good signature heading passes 1, 2, 4, 5 strongly. A good search-intent heading passes 1, 2, 3, 5 strongly. A good hybrid passes all five.

---

## Page Template Context

The blog renders in `/personality-analysis/[slug]/+page.svelte`, which already injects certain elements programmatically. Generated markdown must **not** include:

1. `<script>` import tags — the page handles component imports
2. A featured-image PopCard at the top — the page renders the person's image
3. A `BlogPurpose` component — the server inserts this before the last h2
4. A `<svelte:head>` with JSON-LD — schema metadata is handled separately
5. Empty `<style>` tags — never include `<style lang="scss"></style>`

**Include in generated markdown:**

- Frontmatter with all metadata
- Opening quote (blockquote)
- `<p class="firstLetter">` on the intro paragraph
- TL;DR section inside `<details>` / `<summary class="accordion">` / `<div class="panel">`
- All H2/H3 sections with content
- Inline content only — no wrapper components

**Correct blog skeleton:**

```markdown
---
title: 'Person Name: Enneagram Analysis Title'
description: 'Meta description, 145–160 chars, problem/question first'
author: 'DJ Wayne'
date: 'YYYY-MM-DD'
... (other frontmatter)
---

> "Opening quote from or about the person"

<p class="firstLetter">Intro paragraph that hooks the reader...</p>

Content continues here...

<details>
<summary class="accordion">TL;DR: Why Person is an Enneagram Type X</summary>
<div class="panel">
<ul>
<li><b>Point 1:</b> Description</li>
...
</ul>
</div>
</details>

## What is Person's Personality Type?

### Person is an Enneagram Type X

... rest of content with H2 and H3 sections ...

## [Person-Specific Final Section Heading]

Final paragraph lands the sharpest insight and cuts to black. No summary. No CTA.
```

### Opening quote guidance

Choose a quote that (1) reveals personality rather than achievement, (2) comes from the person directly if possible, (3) has emotional texture, (4) connects to the core Enneagram pattern without naming it, and (5) is specific rather than generic. Avoid inspirational-poster quotes.

---

## Internal Linking Rules

Add 2–5 strategic internal links per blog, after drafting and before presenting to the user.

### Priority order

1. **Celebrity cross-links** — other celebrities mentioned with a published blog → `/personality-analysis/[Person-Name]`
2. **Enneagram type links** — mentions of any Enneagram type (including the subject's own type) → `/enneagram-corner/enneagram-type-X`. Linking the subject's own type is encouraged — it sends the reader to the type explainer.
3. **Topical blog links** — relevant internal Enneagram / mental-health posts (use the internal index)
4. **External research citations** — descriptive anchor text, never "click here"

**Self-loop prohibition:** never link the blog to its own slug. A Meghan Trainor blog must not contain `/personality-analysis/Meghan-Trainor`. Self-loops are useless.

### Finding valid link targets

- **Celebrity blogs**: read `src/lib/components/molecules/famousTypes.ts`. Entries with `link: true` are published and linkable. Do not hit Supabase — this file is the source of truth.
- **Topical blogs**: start with `/docs/development/enneagram-mental-health-blog-index.json`, use each entry's `route` directly.

### Rules

1. 2–5 links total — be strategic.
2. Natural placement inside prose.
3. First mention only.
4. No links in headings.
5. Only link substantive mentions, never passing ones.

### HTML vs. markdown links (non-negotiable)

- **Inside HTML tags** (`<p>`, `<div>`, `<details>`, `<li>`): `<a href="/path">text</a>`
- **In plain markdown**: `[text](/path)`

Mixing breaks rendering.

### Common topical link targets

- Stress patterns → `/enneagram-corner/enneagram-types-in-stress`
- Communication styles → `/enneagram-corner/enneagram-communication-styles`
- Relationships → `/enneagram-corner/enneagram-relationship-guide`
- Wings → `/enneagram-corner/enneagram-wings-complete-guide`
- Strengths/weaknesses → `/enneagram-corner/enneagram-strengths-and-weaknesses`

After adding links, report:

```
Internal links added (X total):
- [Person Name] → /personality-analysis/Person-Name
- [Type X] → /enneagram-corner/enneagram-type-X
```

---

## Valid Field Values Reference

### `type` (category for the person)

| Value                 | Use For                                 |
| --------------------- | --------------------------------------- |
| `celebrity`           | General celebrities, reality TV         |
| `musician`            | Musicians, singers, bands               |
| `movieStar`           | Established film actors                 |
| `newMovieStar`        | Younger / rising film actors            |
| `comedian`            | Stand-up comics, comedy creators        |
| `creator`             | YouTubers, podcasters, content creators |
| `techie`              | Tech industry leaders                   |
| `politician`          | Politicians, government leaders         |
| `entrepreneur`        | Business founders, moguls               |
| `author`              | Writers, journalists                    |
| `activist`            | Social / political activists            |
| `historical`          | Historical figures                      |
| `tiktoker`            | TikTok-primary creators                 |
| `influencer`          | Social media influencers                |
| `lifestyleInfluencer` | Lifestyle / fashion influencers         |
| `other`               | Doesn't fit other categories            |

Multiple values allowed: `type: ['musician', 'creator']`.

### `suggestions`

4 related people. Use `First-Last` format matching the `person` field. Choose based on same domain, same Enneagram type, connected relationship, or similar public perception.

Example: `suggestions: ['Taylor-Swift', 'Beyonce', 'Ariana-Grande', 'Doja-Cat']`

### `published`

Keep `published: false` on drafts unless the user explicitly says otherwise. This command does not make publication decisions.

### `production_pretext` (handoff state — required)

Initialize every new or materially revised draft with:

```yaml
production_pretext:
  status: draft
  handoff_from: blog_content_creator_people
  reviewed: false
  ready_for_production: false
  sync_mode: full
  requires:
    - db_sync
    - db_verify
    - regenerate_famous_types
    - image_check
  blockers: []
```

**Status meanings:**

- `draft` — writing/revision in progress; production must not run
- `ready` — user reviewed and approved; production can run
- `in_progress` — production running
- `completed` — production finished with no blockers
- `blocked` — production ran but follow-up required

**Rules:**

- First save → `status: draft`.
- Substantive edits after previous approval → reset to `draft`, `reviewed: false`, `ready_for_production: false`.
- After user review and approval → `status: ready`, `reviewed: true`, `ready_for_production: true`. Next step is `blog_content_production_people`.

---

## Production Handoff (out of scope here)

This command stops at a strong approved draft. The handoff artifact is the `production_pretext` block. After user approval, set `status: ready` and invoke `blog_content_production_people` before anything goes to the database.

---

# Part 2: Writing Workflows

---

## Session Start

When invoked:

1. Determine whether the user wants a **new draft** or an **update to an existing draft**.
2. If a matching draft exists in `src/blog/people/drafts/`, read it before proposing major changes.
3. If the user has provided transcripts or source files, use those before asking for more.
4. Stay focused on writing and revision. Do not drift into production tasks.

---

## Workflow: New Draft

### Step 1: Research Packet

**Read first:** `/docs/blogs-famous-people/prep-prompt-1.md` — this is your research framework and depth checklist. Do not skip it; it contains the signature-detail hunt and the central-contradiction rubric that drive the blog's quality.

**Then read:** `/docs/development/enneagram-mental-health-blog-index.json`. Shortlist 6–12 internal posts relevant to the person's likely type and themes. Read 3–6 in full. Build an "internal lens brief" with pattern hypotheses and counter-hypotheses to test against external evidence.

**Research focus areas (standard):**

- 5 strong positive contributions / accomplishments
- 5 lesser-known facts
- Personal stressors and challenges
- What they're proud of
- Topics they enjoy discussing
- Internal thought patterns
- Notable habits and behaviors

**Depth research (in addition to standard) — aligned with The Quality Bar above:**

- The **core tension** (one phrase, `[X] vs. [Y]`) — identified before Step 2 ends
- **3–5 small, specific moments** — tiny details, not headline accomplishments
- The **public/private gap** — what surprises people who meet them vs. their public image
- **Childhood → adult thread** — the visible line from formative experience to current behavior

**Primary source priority:** long-form podcasts (Rogan, Lex, Diary of a CEO, Tim Ferriss, niche in-field); books/memoirs; YouTube interviews 30+ minutes; documentaries. Scripted press junkets are last resort.

**Output:** comprehensive research summary with source URLs, preliminary core tension, best signature moments found so far, and a shortlist of promising interviews for transcript analysis.

### Step 2: Enneagram Analysis

**Read first:** `/docs/blogs-famous-people/prep-prompt-2.md` — this is your analysis framework. It contains the thesis, crystallizing-sentence, and stress/security rubrics you'll apply.

Determine the likely Enneagram type from Step 1 research. Then analyze across dimensions:

- **Thoughts** — how they process information and decide
- **Feelings** — emotional patterns
- **Actions** — behavior and habits
- Stress (disintegration) and security (integration) when they clarify visible behavior

**General-reader rule:** keep the analysis focused on motivations, contradictions, and behavior. Do not write paragraphs whose main purpose is arguing "Type X vs. Type Y." Mention alternate types / wings / arrows / subtypes only briefly, only when they prevent real misunderstanding.

**Internal knowledge cross-check:** validate your type call against the lens brief from Step 1. Note which 3+ internal posts most informed the analysis. If external evidence conflicts with the internal lens, surface it and resolve it transparently.

**Core tension synthesis (required output):** by the end of Step 2 you can articulate —

1. The **core tension** in one phrase: `[X] vs. [Y]`
2. The **psychological question** their life is answering
3. **3–5 small moments** from research that crack this tension open

**If research is ambiguous about the type:** present the leading hypothesis plus the key unresolved ambiguity in plain language and wait for a decision. Do not frame this as an extended candidate-type showdown in the draft.

### Step 3: Transcripts (active — not optional)

Transcripts are the material that makes the difference between a draft built on paraphrase and a draft built on the subject's own voice plus testimony from people around them. This step is not a recommendation request — it is an active gather.

**Substep 3a: present the shortlist.**

```
Recommended videos / podcasts for transcript analysis:

| # | Title | Why It's Valuable | URL |
|---|-------|-------------------|-----|
| 1 | "[Person] on Joe Rogan Experience" | Discusses childhood and what drives them | [URL] |
| 2 | "[Person] - Oxford Union Talk" | Unscripted Q&A reveals core values | [URL] |
| 3 | "[Person] on Diary of a CEO" | Opens up about failures and insecurities | [URL] |

Options:
A. I'll grab transcripts myself and share — tell me to wait
B. You grab them — go ahead
C. Proceed without transcripts (quality will be capped)
```

**Substep 3b: execute based on user response.**

- **Option A** — user supplies files, typically in `youtube-transcripts/` or inline. Read them. Proceed to Step 4.
- **Option B** — invoke the `/youtube-transcript` skill (or `yt-dlp` + `youtube-transcript-api` directly) on 2–4 of the shortlisted URLs. Save transcripts locally and analyze them before Step 4.
- **Option C** — proceed only with explicit user override. Log a `research_limitation: no_transcripts` note in working notes. Testimony gate in Step 5 may still block the draft.

**Substep 3c: hunt for collaborator testimony specifically.**

Transcripts of the subject alone are not enough. Before leaving this step, locate at least one interview, podcast, article, or documentary that contains a **named third party speaking about the subject** — a co-writer, collaborator, friend, family member, producer, director, co-star, rival, or substantive critic. Record these quotes with attribution and approximate year.

If nothing surfaces after a reasonable search, name the specific gap in working notes so Step 5 can decide whether the draft is publishable. Do not silently skip this — the Step 5 testimony gate enforces it.

### Step 4: Write the Draft

**Read first (optional but recommended):** `/docs/blogs-famous-people/writing-prompt-1.md` — extended technique library and worked examples. The rules below are sufficient to write the draft; the external doc adds depth.

**The goal is a quality profile, not a formulaic post.** The structure follows from what makes _this_ person interesting. Different people get different section orders, emphasis, and headings.

**Required elements** (present in every blog, but order / emphasis / section names vary):

- Opening quote and engaging intro that clears The Hook Test (above)
- The required type section: H2 `What is [Person]'s personality type?` and H3 `[Person] is an Enneagram Type X`
- Upbringing and formative experiences
- Personality quirks, habits, mindset
- Major accomplishments
- Challenges, controversies, traumas
- Legacy and current work
- No visible FAQ section at the bottom
- Strong ending that cuts to black (see The Ending Rule)

**Apply the Five Craft Principles throughout** — show don't label, point don't talk, story over system, sound like 9takes, compress ruthlessly.

**Apply The Distribution Rule** — explicit Enneagram framing in at most 3–4 sections; the rest work as pure narrative.

**Apply the Heading Strategy** — hit the SEO/copy mix: 1–2 signature / 2–3 search-intent / rest hybrid. Every H2 passes the heading test. Siblings frame in parallel.

**Every section has conflict.** If a section is just listing traits, benefits, or accomplishments with no tension, inject contrast: before/after, public vs. private, what fans think vs. what's actually true, Type X reaction vs. Type Y reaction, stress vs. security. A flat section is a section that gets skimmed. Apply this even to "upbringing" and "accomplishments" — find the tension inside the material.

**Tailor structure to the person:**

- Lead with what defines them. If trauma is the defining feature, open there. If obsessive work is the defining feature, start there.
- Name sections after the person, not the category. Not "Major Accomplishments" — "How [Person] Built [Thing]."
- Combine or split sections based on the story, not on template.
- Let the core tension drive the arc.

**Swap test:** if you replaced the person's name with another celebrity, would the sections still work? If yes, restructure.

**FAQ handling:** no visible `## FAQs About [Person]'s Personality` block. FAQ coverage for SEO lives in structured data only, when the publishing layer supports it.

### Step 5: Self-Review (mandatory)

Before metadata or saving, run the draft through the Quality Checklist at the end of this document. Every check must pass.

**Checklist includes the Harry Dry copywriting discipline folded in** — hook passes visualize + falsify, three most important claims point at evidence rather than assert adjectives, headings hit the mix, titles pass their respective rule-tests. There is no separate "Copywriting Pass" step.

**For a standalone deep copywriting pass outside this workflow**, use the `/copywriting-pass` command on the finished draft.

**Hard gates (the draft cannot proceed to Step 7 if any of these fail):**

1. **Testimony gate** — the draft must contain at least **2 named-source quotes from people around the subject** (collaborator, family member, friend, producer, director, co-star, rival, substantive critic). Each quote needs attribution (name + approximate source/year). Quotes the subject gave about themselves do not count. If research genuinely couldn't surface this, set `production_pretext.status: blocked` with a `thin_collaborator_testimony` blocker rather than self-grading past it.
2. **Heading mix gate** — tag each H2 as signature / search-intent / hybrid _before_ saving. The set must contain at least **2 search-intent headings** (or hybrids with strong search-intent). If fewer, rewrite headings before proceeding. Do not ship a signature-only catalog.
3. **Self-loop gate** — no internal link targets the blog's own slug.
4. **Anti-imitation gate** — the hook and the ending must not echo the structural cadence of any excerpt in the reference library. Specifically: no `"A [Type]. Doing what [Type]s do."` endings.

Add reviewer notes as HTML comments (`<!-- -->`) for anything flagged but deliberately left.

### Step 6: Furniture Pass

Enhance the reading experience with visual furniture — decorative elements that break up text.

**Reference:** `/docs/content-generation/blog-furniture-guide.md`

**Constraint for celebrity blogs:** `/personality-analysis/` renders from the database (not MDsvex), so **no Svelte component imports**. HTML-based furniture only.

**Available HTML furniture:**

| Element                                                     | When to use                                             |
| ----------------------------------------------------------- | ------------------------------------------------------- |
| `<p class="firstLetter">`                                   | Opening paragraph (already present from Step 4)         |
| `<details>/<summary class="accordion">/<div class="panel">` | TL;DR (already present from Step 4)                     |
| `---` horizontal rules                                      | Between major sections                                  |
| `>` blockquotes                                             | Pull quotes, attributed quotes, disclaimers             |
| `<div class="iframe-container">` + `<iframe>`               | Embed a relevant YouTube interview clip                 |
| `<div class="scroll-table">`                                | Wrap wide comparison tables                             |
| `<blockquote class="twitter-tweet">`                        | Embed a relevant tweet as evidence                      |
| Markdown pipe tables                                        | Structured comparisons                                  |
| `<div class="pull-quote">`                                  | Elevate a powerful quote out of the prose               |
| `<div class="key-stat">` / `<div class="key-stat-row">`     | Highlight a striking number                             |
| `<p class="inner-thought">`                                 | Imagine what the person was thinking in a key moment    |
| `<div class="timeline">`                                    | Chronological arc                                       |
| `<div class="contrast-panel">`                              | Public vs. private, says vs. does                       |
| `<div class="source-card">`                                 | Cite a specific podcast or interview source             |
| `<div class="dialogue">`                                    | Recreate a revealing interview exchange                 |
| `<div class="aside-box">`                                   | Supplementary context                                   |
| **Enneagram Rabbit Hole** (`<details>` block)               | **REQUIRED for power-user Enneagram depth — see below** |

**Rules:**

- 2–4 furniture additions per blog. More competes with the writing.
- Every element must earn its place. If a YouTube embed doesn't add insight the text can't, cut it.
- No furniture in the intro or the ending. The intro hooks with prose. The ending cuts to black.
- The **Enneagram Rabbit Hole** is the one mandatory furniture element. Add it once per blog, after the main type analysis section.

### The Enneagram Rabbit Hole (REQUIRED)

The Distribution Rule keeps the body free of typology debate so casual readers stay engaged. But power readers come to 9takes specifically for wing/subtype/arrow depth, AND those long-tail terms (`[Person] 3w4`, `[Person] sx/so subtype`, `[Person] integration to type 7`) are exactly the LLM fan-out queries we want to capture.

Solution: a **single collapsed `<details>` block** placed after the main type analysis section that delivers all the advanced Enneagram material in one sealed unit. Casual readers scroll past it. Power users open it. Search engines and LLMs index everything inside.

**Placement:** after the H2 `What is [Person]'s personality type?` section, before the next narrative section.

**Required structure:**

```html
<details class="enneagram-rabbit-hole">
	<summary class="accordion">
		🐇 Enneagram Rabbit Hole: Wings, Subtypes &amp; Connecting Lines for [Person]
	</summary>
	<div class="panel">
		<p>
			<em
				>For the Enneagram nerds. Skip if you're not deep into the system — the rest of the analysis
				stands on its own.</em
			>
		</p>

		### [Person]'s Wing: [X]w[Y] [2-3 paragraphs analyzing the wing call. What evidence supports it?
		What does the wing add to the core type? Cite specific behaviors. Link the type explainer once:
		<a href="/enneagram-corner/enneagram-wings-complete-guide">wings</a>.] ### [Person]'s
		Instinctual Subtype: [sp/so/sx — best guess] [2-3 paragraphs on the dominant instinct. Show
		evidence from how they spend time, what they prioritize, what they fight for. Link:
		<a href="/enneagram-corner/enneagram-instinctual-subtypes">instinctual subtypes</a>.] ### Stress
		and Growth Arrows [1-2 paragraphs. When [Person] is under pressure, do we see Type [stress
		arrow] patterns? When healthy, do we see Type [growth arrow] patterns? Cite specific moments.]
		### Counterarguments: Why [Person] Might Not Be Type X [1-2 paragraphs. Honestly engage the
		strongest alternate type case. What evidence weakens our typing? What would change our mind?
		This is the intellectual-honesty signal LLMs reward.]
	</div>
</details>
```

**Rules for the rabbit hole:**

1. **It is the ONLY place wing/subtype/arrow analysis lives.** The body of the blog stays clean of jargon per the Distribution Rule. If you find yourself wanting to discuss wings in an upbringing or quirks section, move it into the rabbit hole instead.
2. **Counterarguments section is non-optional.** This serves the fan-out query "is [Person] actually Type X or Type Y?" and signals epistemic honesty.
3. **Link out, don't re-explain.** Each subsection links to the relevant `/enneagram-corner/` pillar page once. Do not re-define what a wing is.
4. **The frame paragraph is required.** The italicized "For the Enneagram nerds…" line tells casual readers it's safe to skip — this is what makes the body work for general audiences.
5. **Word budget: 400–700 words inside the block.** Long enough to be substantive, short enough not to compete with the main blog.

### Step 7: Generate Metadata

```yaml
---
title: '[Person Name]: [Evergreen Enneagram Analysis Title]'
meta_title: '[Clickbait/Problem-Focused Title for SEO]'
persona_title: '[Domain]s [Type-Allusive Descriptor]'
description: '[SEO-optimized meta description, 145–160 chars, problem/question first]'
author: 'DJ Wayne'
date: '[YYYY-MM-DD]'
loc: 'https://9takes.com/personality-analysis/[Person-Name]'
lastmod: '[YYYY-MM-DD]'
changefreq: 'monthly'
priority: '0.6'
published: false
enneagram: '[1-9]'
type: ['category']
person: '[First-Last]'
suggestions: ['Person-1', 'Person-2', 'Person-3', 'Person-4']
wikipedia: '[URL if available]'
twitter: '[handle if available]'
instagram: '[handle if available]'
tiktok: '[handle if available]'
production_pretext:
  status: draft
  handoff_from: blog_content_creator_people
  reviewed: false
  ready_for_production: false
  sync_mode: full
  requires:
    - db_sync
    - db_verify
    - regenerate_famous_types
    - image_check
  blockers: []
---
```

If the draft has been graded, preserve this optional block. Key name is exactly `content_quality` (not `content_grade`):

```yaml
content_quality:
  hook: X
  enneagram: X
  evidence: X
  writing: X
  originality: X
  overall: X.X
  letter: XX
  graded_at: 'YYYY-MM-DD'
```

### Step 8: Save Draft and Add Links

Save to `/src/blog/people/drafts/[Person-Name].md` with `production_pretext.status: draft`.

Then add 2–5 internal links following the Internal Linking Rules.

Present to user:

```
Draft created successfully!

Location: /src/blog/people/drafts/[Person-Name].md
Preview: Visit /admin/drafts/[Person-Name] to review

Internal links added (X total):
- [links list]

Options:
1. Make specific edits
2. Regenerate specific sections
3. After review and approval, mark production_pretext as ready and run blog_content_production_people
4. Continue editing later
```

### Step 9: Review and Refinement

Iterate based on user feedback until approved.

**While iterating:** if you make substantive changes, keep `production_pretext.status: draft`. Do not mark ready while edits are ongoing.

**When the user approves:** update the draft to

```yaml
production_pretext:
  status: ready
  handoff_from: blog_content_creator_people
  reviewed: true
  ready_for_production: true
  sync_mode: full
  requires:
    - db_sync
    - db_verify
    - regenerate_famous_types
    - image_check
  blockers: []
```

Then tell the user the next step is `blog_content_production_people` before publishing.

---

## Workflow: Update Existing Draft

### Step 1: Read before rewriting

Read the current draft. Map the existing thesis, current core tension, strongest sections to preserve, weakest sections to strengthen, any obvious repetition, generic structure, or stale sourcing.

### Step 2: Choose the update mode

Pick the lightest weight update that solves the problem:

- **Fresh research** — add newer evidence, better quotes, sharper framing
- **Manual revision** — rewrite or tighten based on user feedback
- **Targeted section update** — regenerate only sections that need work

### Step 3: Update without narrowing

**Principle: updates must enhance, not narrow.** Maintain formative experiences, core personality patterns, full career arc, relationships, growth. New material deepens the portrait rather than replacing it with only the latest news.

- Preserve strong existing sections unless they're inaccurate, repetitive, or flat.
- Prefer adding depth over deleting history.
- Use new evidence to sharpen the thesis, not to start over.
- Keep Enneagram framing limited and reader-accessible.
- Update `lastmod` in the frontmatter after meaningful revisions.

### Step 4: Re-research intelligently

Focused WebSearch to fill the real gaps — recent developments worth integrating, better direct quotes, stronger third-party testimony, missing childhood / context details, one or two better signature moments. Recommend 2–4 high-value interviews if transcripts will materially improve the draft.

### Step 5: Rewrite only what needs rewriting

Apply the same standards as the New Draft workflow. Focus on:

- The hook (clears The Hook Test)
- Clarity of the core tension
- Quote quality and placement
- Repetition
- Section specificity (swap test + heading mix)
- The ending (clears The Ending Rule)
- Accessibility for readers who don't know the Enneagram

### Step 6: Re-run review and save

- Re-run the Quality Checklist.
- Update internal links if the body changed materially.
- Preserve the `content_quality` block unless you're intentionally re-grading.
- Reset `production_pretext` to `draft` if the revision changed content materially and the draft had been marked `ready`, `completed`, or `blocked`.
- Save and summarize what changed for the user.

---

## Quality Checklist (Final Review)

Before finalizing any blog (new or updated). Every item must pass. Items marked **[H]** are the copywriting-discipline checks folded into this list.

### Depth & uniqueness

- [ ] **Core tension identified?** Can you state the central contradiction in one phrase (`[X] vs. [Y]`)? Threaded through intro, body, ending?
- [ ] **At least 3 signature details** — small, specific moments, not headline accomplishments.
- [ ] **At least 1 aha moment** where the Enneagram makes something click that wouldn't click otherwise.
- [ ] **Public/private gap explored** — the reader sees who this person is when the performance stops.
- [ ] **Childhood → adult thread** — visible line from formative experience to present behavior.
- [ ] **[H] Hook passes visualize + falsify** — opens on a concrete image and a testable claim, not a mood or a rhetorical question.
- [ ] **Intro names or implies the core tension** — reader has the psychological question within the first 5 paragraphs.
- [ ] **Ending cuts to black** — no summary, CTA, or wrap-up.
- [ ] **Swap test** — replace the person's name, would the sections still work? If yes, restructure.

### Tone, structure, framework

- [ ] Valuable 5 years from now?
- [ ] Covers the entire life arc?
- [ ] Psychological insights backed by specific behavioral examples?
- [ ] A new reader gets a complete picture of who this person is?
- [ ] Every major quote / anecdote / concept appears exactly once?
- [ ] TL;DR teases patterns without spoiling the best stories?
- [ ] At least half the sections work as pure narrative without explicit Enneagram labeling?
- [ ] A reader who doesn't care about the Enneagram still finds this a compelling profile?
- [ ] No passages that turn into insider typology debate (Type-vs-Type, wing arguments, subtype detours).
- [ ] **[H] Every section has conflict** — no section is a flat list of traits, benefits, or accomplishments. Each contains before/after, public vs. private, expectation vs. reality, or Type-on-Type tension.

### Compression & prose discipline

- [ ] **[H] No meta-commentary openings** — no "In this post...", "Let's dive into...", "Before we get started...", "By the end of this article...". The opening drops into the insight or scene.
- [ ] **[H] No filler phrases** — scrub "it's important to note that," "at the end of the day," "in many ways," "needless to say."
- [ ] **[H] Kaplan's Law check** — every sentence earns its place. Cut any sentence that could be deleted without loss.
- [ ] **[H] Paragraph length** — no paragraph over ~4 lines unless the rhythm demands it. Dense blocks broken up.
- [ ] **[H] First line sells second line** — the opening sentence creates enough pull that the reader wants the second. The second pulls into the third.

### Voice & evidence

- [ ] **[H] Three most important claims point at evidence**, not adjectives. The thesis restatement, the core-tension summary, and the type diagnosis each reference a specific quote, behavior, number, or moment.
- [ ] **Confidence calibration** — analysis is confident, not undermined by excessive "likely," "suggests," "appears to be."
- [ ] **Quote density** — subject's own voice is the dominant material, not paraphrase.
- [ ] **Testimony (hard gate)** — at least 2 named-source quotes from people around the subject, each with attribution (name + approximate source/year). Quotes the subject gave about themselves do not count.
- [ ] **Stat check (strongly encouraged, not required)** — ideally 1–2 specific, sourced, falsifiable numbers are placed where they earn their weight (hook, type diagnosis, counterarguments, or a single accomplishment stat). Examples: "[Person] has written 44 films" (IMDb), "of 23 Type 8 musicians profiled on 9takes, only 3 publicly…" (9takes corpus). See "Statistical Claims & Cited Sources" in Part 1. A blog with zero stats can still ship if the rest is strong — but if you have verifiable numbers and left them out, add them. Do not invent numbers to satisfy this check.

### Enneagram Rabbit Hole

- [ ] **Rabbit Hole present (hard gate)** — the `<details class="enneagram-rabbit-hole">` block exists, placed after the main type analysis section.
- [ ] **All four sub-sections present** — Wing, Subtype, Stress/Growth Arrows, Counterarguments.
- [ ] **Word count 400–700 inside the block.** Not a token gesture, not a second blog.
- [ ] **Frame paragraph present** — the italicized "For the Enneagram nerds…" line at the top.
- [ ] **Body of the blog stays free of wing/subtype/arrow jargon** — if the body argues wings or subtypes, move it into the rabbit hole.

### Headings & titles

- [ ] **[H] H2 mix hits the ratio (hard gate)** — tag each H2 as signature / search-intent / hybrid. At least 2 must be search-intent or hybrid with strong search-intent. No signature-only catalog.
- [ ] **[H] Every H2/H3 passes the heading test** — visualize, falsify, SEO-plausible or ownable (anti-pattern failures flagged: neither flat-category nor opaque-magazine).
- [ ] **[H] `title` passes visualize** (names the person + a specific frame).
- [ ] **[H] `meta_title` passes falsify** (a claim, not a mood) and targets 50–60 chars (65 max).
- [ ] **[H] `persona_title` passes ownable** (nobody else could say it unchanged, 2–5 words).
- [ ] The required `What is [Person]'s personality type?` / `[Person] is an Enneagram Type X` pair appears exactly once.

### Technical

- [ ] 2–5 internal links, properly formatted (HTML inside HTML blocks, markdown elsewhere).
- [ ] No visible FAQ section at the bottom.
- [ ] `description` lands 145–160 chars.
- [ ] Frontmatter has all three titles, valid `type`, 4 `suggestions`, and a valid `production_pretext` block.

---

## Quality Grading (Required Before Hand-Off)

After the Quality Checklist passes, score the blog using the rubric at `docs/content-analysis/blog-grading-rubric.md`. Rate each dimension 1–10:

1. **Hook** — opening grabs and creates a question
2. **Enneagram Integration** — framework explains something non-obvious
3. **Evidence / Sourcing** — claims backed by direct quotes and sourced material
4. **Writing Quality** — prose is distinctive, confident, well-structured
5. **Originality** — says something new with a signature detail

**Overall = (Hook + Enneagram + Evidence + Writing + Originality) / 5**

Letter grade: A+ (9.5+), A (9.0–9.4), B+ (8.5–8.9), B (8.0–8.4), C (7.0–7.9), D (6.0–6.9), F (<6.0).

**Publication handoff threshold: 8.5 (B+).** Below this, keep revising.

Output the grade:

```json
{
	"hook": 0,
	"enneagram": 0,
	"evidence": 0,
	"writing": 0,
	"originality": 0,
	"overall": 0,
	"letter": "X",
	"graded_at": "YYYY-MM-DD"
}
```

Store in draft frontmatter as `content_quality` when grading is part of the writing workflow.

---

## File References

- Research framework: `/docs/blogs-famous-people/prep-prompt-1.md`
- Enneagram analysis framework: `/docs/blogs-famous-people/prep-prompt-2.md`
- Extended writing technique library: `/docs/blogs-famous-people/writing-prompt-1.md`
- Blog furniture catalog: `/docs/content-generation/blog-furniture-guide.md`
- Grading rubric: `/docs/content-analysis/blog-grading-rubric.md`
- Internal Enneagram index: `/docs/development/enneagram-mental-health-blog-index.json`
- Brand voice guide: `/docs/brand/brand-style-guide-v2.md`
- Celebrity optimization notes: `/docs/content-generation/celebrity-page-optimization-instructions.md`
- Published celebrities (source of truth for linkable people): `/src/lib/components/molecules/famousTypes.ts`
- Production command: `/Users/djwayne/9takes/.claude/commands/blog_content_production_people.md`
- Standalone deep copywriting pass: `/copywriting-pass` command
