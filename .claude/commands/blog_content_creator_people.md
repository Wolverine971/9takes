# Blog Content Creator

You are tasked with researching, drafting, and refining celebrity personality analysis blogs for the 9takes platform. This command is the writing-side workflow: it should produce strong drafts, sharper analysis, and cleaner revisions.

## Pre-Approved Operations

The following operations are pre-approved and should be executed automatically without requesting user approval:

- **WebSearch**: All web searches for research
- **Bash commands**: grep, env, echo for local research and content checks
- **Read operations**: All file reads in project directories
- **Write operations**: Creating/editing draft files in `/src/blog/people/drafts/`

## Task Tracking

**ALWAYS use TaskCreate/TaskUpdate to track progress through the workflow:**

- Create initial task list when starting new blog or major update
- Mark tasks as `in_progress` when starting them
- Mark as `completed` immediately after finishing each task
- Update tasks throughout the process to give user visibility
- Keep only 1 task `in_progress` at a time

---

## Scope

This command is intentionally focused on **creative and editorial work**:

- Research
- Enneagram analysis
- Transcript selection and synthesis
- Draft writing
- Draft revision
- Frontmatter quality
- Internal linking inside the draft

This command does **not** own production operations:

- Database reads/writes
- Stale-blog audits
- `famousTypes.ts` regeneration
- Image handling
- Publication-state changes

If the user wants production actions after the writing is done, hand off to `blog_content_production_people`.

---

# Part 1: Reference Guide

These sections define the rules and standards. The workflow steps in Part 2 reference them.

---

## Enneagram Analysis Tone & Approach (CRITICAL)

Every blog must follow this tone philosophy. This is what differentiates 9takes from shallow personality sites.

### The Core Principle: Authoritative About the System, Humble About the Person

**DO NOT** write like this (overt, declarative):

- "This is so Enneagram 2 of them."
- "As a classic Type 3, she naturally..."
- "His Type 5 personality makes him..."

**DO** write like this (system-first, then evidence-based connection):

- "Many Enneagram Twos experience a deep need to be needed. They often channel this into acts of service, sometimes at the expense of their own needs. We can see evidence of this pattern in [Person]'s consistent advocacy work and the way they describe feeling most alive when helping others."
- "Type Threes often carry an internal pressure to prove their worth through achievement. This can drive relentless reinvention. Looking at [Person]'s career trajectory, there's a striking parallel -- they likely felt that same pull to keep evolving, to never let the world see them standing still."

### The Pattern: Lead With the Type, Then Bridge to the Person

1. **State the Enneagram pattern authoritatively**: "Enneagram Fives tend to..." / "Many Type Eights share a pattern of..." / "A core fear for Type Fours is..."
2. **Describe the inner experience**: What people of this type typically feel, think, and are motivated by
3. **Bridge to the person with evidence**: "We can see evidence of this in [Person]'s..." / "[Person]'s behavior here echoes this pattern..."
4. **Analyze with conviction, not excessive hedging**: The body of the blog should state patterns confidently and then show the evidence. The disclaimer at the bottom handles the speculation caveat. Don't undermine every insight with "likely," "suggests," "appears to be." The best blogs (Peter Thiel, Paris Hilton) analyze with authority: "[Person] is a Type X" followed by overwhelming evidence. The weaker blogs hedge so much they never land a punch. Reserve hedging language for genuinely ambiguous cases — not as a default tone.

**The confidence calibration:** Analyze the person as if the typing is correct and show why through evidence. The reader should feel the conviction of the analysis. A blog that says "Logan looks like a Type 3" is weaker than one that says "Logan Paul is a Type 3" and then proves it. The disclaimer exists for a reason — use it, and let the body of the blog be confident.

### Keep Typology Debates Off the Page

Assume the reader does **not** know Enneagram jargon and does not care about winning a typing argument.

- Do your type validation in research and working notes, not in the main body of the blog.
- Do **not** build sections around "why they're a Type X and not a Type Y."
- Avoid paragraphs whose main job is comparing adjacent types, wings, arrows, or subtypes.
- If an alternate type or advanced Enneagram lens must be mentioned, keep it to **one brief clarifying line max** and return immediately to the person's actual life, motives, and behavior.
- The reader-facing question is "How does this pattern illuminate the person?" not "How do we prove this against every neighboring type?"

### Story First, Analysis Second (Anti-Fatigue Rule)

The strongest personality analysis reads like a compelling profile that _happens_ to illuminate psychological patterns — NOT like an Enneagram textbook that uses a celebrity as an example.

**The distribution rule**: Explicit Enneagram framing (naming the type, referencing Enneagram theory, using phrases like "Type X typically...") should appear in **at most 3-4 sections** of the blog. The remaining sections should tell the person's story and let the reader connect the dots.

**Sections that should lean toward pure narrative (minimal or no Enneagram framing):**

- **Upbringing** — tell the story, don't diagnose the childhood
- **Rise to fame** — focus on the journey
- **Individual personality quirks** — describe the behavior vividly, let it speak for itself
- **Accomplishments** — show what they did, not what type they are

**Sections where explicit Enneagram analysis fits naturally:**

- **"What is [Person]'s personality type?"** — the one section dedicated to direct analysis
- **Final section** — the last analytical insight should land with force, then the blog ends abruptly
- **One or two moments** in the personality or challenges sections where naming the type genuinely deepens understanding

**The litmus test**: If you removed every sentence that explicitly mentions "Type X" or "Enneagram," would the blog still be a compelling, insightful profile? If yes, the Enneagram is being used well. If no, you're using the person to explain the Enneagram instead of using the Enneagram to illuminate the person.

### Show, Don't Label

Instead of writing "This is classic Type 8 behavior" or "Type 8s characteristically do this," prefer:

- Describing the behavior vividly and letting it resonate on its own
- Using the Enneagram insight _implicitly_ through your analytical lens without naming the type
- Saving the explicit "this connects to Type X" for **2-3 key moments** where it genuinely adds something

**Phrases to avoid (or use very sparingly — maximum 2 times per entire blog):**

- "This is classic/textbook Type X"
- "Type Xs characteristically..."
- "This is very Type X"
- "consistent with Type X patterns/behavior"

**Instead, let the behavior carry the weight:**

- "She set the terms. She always sets the terms. And if you get too close without permission, you'll know."
- "The anger didn't paralyze her. It became a song. Every time."

The Enneagram should feel like a quiet lens shaping the analysis, not a label stamped on every paragraph.

### Repetition Prevention (CRITICAL)

**The golden rule: Every major quote, concept, or anecdote should appear ONCE in its strongest context.**

Blogs have multiple structural layers (intro, TL;DR, evidence list, main sections, ending) and it's easy for the same material to appear in 2-3 of them. This destroys reader engagement — the reader feels like they keep re-reading the same article.

**Rules:**

1. **Quotes**: Use each direct quote **exactly once**. If a quote is your opening epigraph, do NOT repeat it in the evidence list or body sections. You can reference it briefly ("the Grammy speech we opened with") without re-quoting.

2. **Key concepts/anecdotes**: Each belongs to **ONE section**. If "throwing away her personality in relationships" is a major insight, it lives in the Relationship section — not also in the TL;DR, the evidence list, AND the relationship section. A brief forward-reference ("we'll see this pattern play out in her relationships") is fine; repeating the full concept is not.

3. **TL;DR strategy**: The TL;DR should be a **TEASER**, not a comprehensive summary. It should:
   - State the core typing (self-identified or assessed) in one line
   - Sketch 3-4 broad personality patterns in **one sentence each** without full anecdotes
   - Create curiosity to keep reading — do NOT include the blog's best stories or most surprising details
   - **Bad TL;DR**: Summarizes every section (reader has no reason to keep scrolling)
   - **Good TL;DR**: Names the type, gestures at patterns, and leaves the stories for the body

4. **Evidence list** (in "What is their personality type?"): Keep bullets to brief pattern-level observations. Do NOT include full anecdotes that will be told in later sections. Think of it as a thematic table of contents, not a preview of every section.

5. **Deduplication review**: Before finalizing any draft, scan the entire piece and ask:
   - Is any quote used more than once? → Keep the best placement, cut the rest
   - Is any anecdote told in more than one section? → Keep the section where it has the most context
   - Is any concept explained more than once? → Keep the deepest treatment, trim others to a brief reference

---

## What Makes a Great Analysis (CRITICAL)

The tone section above covers _how_ to write about the Enneagram. This section covers what separates a genuinely compelling personality analysis from a competent but forgettable one.

### Find the Core Tension

Every fascinating person has a central contradiction — the thing that doesn't quite add up, the paradox that makes them interesting. **Finding and naming this tension is the single most important step in writing a great blog.**

Examples:

- **Chappell Roan**: fortress vs. vulnerability — a woman who creates force fields of unapproachability, yet admits to throwing away her personality to keep someone from leaving
- **Jocko Willink**: strength vs. tenderness — the same intensity that made his men beg to stay on the battlefield made his children beg to leave the jiu-jitsu mat
- **Chris Williamson**: achievement vs. authenticity — built a massive podcast empire while publicly questioning whether the person behind the microphone is real

**The core tension should:**

- Be identified during the research phase (Steps 2-3) before writing begins
- Appear in the intro — named or strongly implied within the first 5 paragraphs
- Echo throughout the blog — different sections should illuminate different facets of the same tension
- Inform the ending — the final lines should leave the core tension unresolved and reverberating

**If you can't find a core tension, dig deeper.** Every person has one. Sometimes it's obvious (public persona vs. private self). Sometimes it's buried (what they preach vs. what they struggle with). If the research doesn't reveal one, the research isn't deep enough.

### Small Moments That Reveal Big Patterns

The most powerful evidence in a personality analysis is never the headline accomplishment. It's the tiny, specific, seemingly minor detail that cracks open who someone really is.

**Great examples from existing blogs:**

- A comment overheard in a lunch line ("she's pretty but not hot") → the anthem "Hot to Go" years later
- Jocko calling his toddler daughter "dense" as a compliment → her eating disorder in college
- Shawn Ryan mentioning his suicide attempt mid-sentence then pivoting to veteran statistics
- Chappell writing a handwritten 5-track EP for a partner, burning it on a CD → "They didn't love it as much as I thought they would." She never gave a gift like that again.

**The pattern:** Small moment → years of silent impact → revealing consequence. This is what makes readers feel like they're seeing the _real_ person, not a Wikipedia summary.

**During research, actively hunt for these moments.** They're usually found in:

- Long-form podcast interviews (unscripted, candid)
- Childhood anecdotes told in passing
- Offhand comments about habits, fears, or relationships
- Stories told by people who know them well

Every blog should have **at least 3-5 of these small, specific, devastating details**. If you only have big, public accomplishments, the blog will read like a press kit.

### The Public Self vs. Private Self

One of the richest veins in personality analysis is the gap between who someone is on stage (or on camera, or in public) and who they are when the performance stops. Exploring this gap:

- Creates empathy — readers see the person as human, not as a brand
- Reveals the Enneagram pattern naturally — the gap between public and private is often _where the type lives_
- Makes readers feel seen — everyone has a version of this gap in their own life

**Look for:** What do they do when no one's watching? What do their close friends say about them vs. their public reputation? What surprises people who meet them in person? What do they admit in long-form interviews that contradicts their image?

### Childhood Wounds → Adult Patterns

The most psychologically satisfying analyses connect early experiences to present behavior. Not in a diagnostic way ("his childhood trauma caused...") but in a narrative way that lets the reader connect the dots:

- Chappell: suffocating in a conservative Christian household → building force fields of autonomy as an adult
- Jocko: rebellious kid who hated authority → transformed rebellion into proactive discipline
- Benson Boone: only boy among four sisters, eavesdropping on piano lessons → self-taught multi-instrumentalist who can't stop learning

**The key is not to diagnose but to illuminate.** The reader should think "oh, THAT'S why they do that" — that's the aha moment that makes them feel like they understand someone at a deeper level than before.

### The "Aha Moment"

Every blog should contain at least one moment where the Enneagram framework makes something _click_ that wouldn't click otherwise. This is the payoff for the reader — the reason they came to a personality analysis site instead of Wikipedia.

**What makes a good aha moment:**

- It explains behavior that seemed random, extreme, or contradictory
- It connects two seemingly unrelated things in the person's life
- It makes the reader go "that makes so much sense" — about the person AND potentially about themselves or someone they know
- It's specific, not generic. "Type 8s are intense" is not an aha moment. "The same protective instinct that made wounded soldiers beg to stay under his command is what made his children beg to leave the jiu-jitsu mat" IS.

### Quote Density: Let the Subject Speak

The strongest personality analyses are built from the subject's own words. Direct quotes should be the structural material of the blog — not decoration added to paraphrased summaries.

**Targets:**

- **High-impact sections** (trauma, relationships, self-reflection): aim for **40-60% direct quotes** when the source material is strong, with brief analytical bridges between them
- **Narrative sections** (career, accomplishments): aim for **25-40% quotes** from the subject and people around them
- **Analytical sections** (Enneagram typing): more authorial analysis, still anchored by **1-3 strong quotes**

**Important:** Do **not** stack quotes just to hit a quota. If a section starts reading like stitched-together transcript excerpts, reduce the quote load and increase the analysis.

**Why this matters:** The Paris Hilton blog (rated 9.0) is 90%+ Paris's own words. The Hasan Piker blog (rated 8.8) is dense with specific sourced quotes. The weaker blogs (Margot Robbie at 7.0, Tom Cruise at 7.2) paraphrase more than they quote, and it shows — they read like Wikipedia summaries rather than revealing profiles.

**Also critical: Testimony from people around the subject.** Co-workers, collaborators, family, friends, and even intelligent critics. If the thesis is "she makes everyone better," other people need to say that. The Margot Robbie blog's biggest gap was zero co-star/director quotes.

### Prose That Hits

The best blogs don't just analyze well — they're _written_ well. Personality analysis should read like a compelling magazine profile, not a psychology textbook.

**Techniques that work:**

- **Short sentences after long ones for impact.** "She set the terms. She always sets the terms. And if you get too close without permission, you'll know."
- **The understated line that carries the most weight.** "She never gave a gift like that again." (More devastating than any paragraph of analysis.)
- **Show first, then explain (or don't explain at all).** Describe the behavior vividly. Let the reader feel it before you name the pattern.
- **End sections with punch, not summary.** "Every wound becomes ammunition. Every betrayal becomes a track." Not: "This shows that she processes pain through her music."
- **Vary the rhythm.** Long narrative passage → short punchy line → medium analytical paragraph → devastating one-liner. Monotonous rhythm puts readers to sleep regardless of content quality.

**The test for prose quality:** Read a paragraph out loud. If it sounds like a textbook, rewrite it. If it sounds like a story being told by someone who genuinely finds this person fascinating, keep it.

## Statistical Claims & Cited Sources (Strongly Encouraged, Not Required)

Content with specific numerical claims gets cited by LLMs at meaningfully higher rates — Princeton's GEO research flagged "Statistics Addition" and "Cite Sources" as the top two visibility-lift techniques (up to ~40%). One or two well-placed, falsifiable numbers with named sources can elevate a blog from "another take" to "the take ChatGPT/Claude/Perplexity quotes."

This is **not a hard requirement**. A tight profile with zero stats can still ship. But if verifiable numbers exist and you leave them out, you give away citation lift for nothing.

### What counts as a citation-grade stat

- **About the person**, verifiable from a named source: "[Person] has released 14 studio albums in 11 years" (Discogs), "[Person]'s memoir sold 2.3 million copies in its first year" (Publishers Weekly).
- **About their field or domain**, anchoring the person in context: "Only 4 of the last 25 Best Director winners started as actors" (Academy records).
- **Confidence framing** on the typing: "Confidence: high — wing, subtype, and arrow evidence all point the same direction."

### What does NOT count

- Invented numbers. If you can't cite the source, cut the claim.
- Round marketing numbers without provenance ("millions of fans," "tons of interviews").
- Stats that restate the obvious ("[Person] has appeared in over 10 films" for a well-known actor).

### Placement (1–2 stats per blog is the sweet spot)

In priority order:

1. **Inside the hook** — a concrete falsifiable number immediately earns trust.
2. **In the type-diagnosis section** — a number that pressure-tests the typing ("7 documented public feuds in 5 years" for a Type 8 call).
3. **In an accomplishment section** — a precise career number ("wrote 44 films") beats "prolific."
4. **Alongside a counterargument**, if you're honestly weighing an alternate type.

### Citation format

Inline citations only. Preferred shapes:

- Parenthetical source: "…13 of his last 15 films (Box Office Mojo)…"
- Hyperlinked source: "…[2023 Diary of a CEO appearance](url)…"
- Named-source prefix: "Per Forbes' 2024 list…"

No footnotes. No fabrication. If the source is weak or unverifiable, cut the claim.

---

## Internal Enneagram Knowledge Base (CRITICAL)

When doing Enneagram analysis for a person, use the internal 9takes knowledge base before relying on external explainers.

**Primary index file:** `/docs/development/enneagram-mental-health-blog-index.json`

**Required internal research pass:**

1. Read the index and shortlist the most relevant internal posts using `tags`, `description`, and `section`.
2. Read at least **3-6 full internal posts** before finalizing the Enneagram hypothesis.
3. Build an "internal lens brief" with:
   - Core pattern(s) to test against the person
   - Evidence that would weaken or refine the current type hypothesis
   - Relevant lenses (stress response, relationships, communication, mental health, work style; advanced type mechanics only if they materially clarify the person)
4. Use this brief to sharpen your interpretation of external evidence.

**Rules for using internal blogs:**

- Use internal blogs to inform **psychological framing**, not as proof of facts about the person.
- Pair every person-specific claim with external primary evidence (interviews, podcasts, books, direct quotes).
- Synthesize in your own words. Do not copy phrasing from internal blogs.
- Use internal contrast posts privately to pressure-test the hypothesis when needed, but do **not** turn the final blog into a Type X vs. Type Y debate.
- Prefer plain-English explanation over wing/arrow/subtype jargon unless the added detail genuinely makes the person's behavior clearer to a general reader.

---

## Gold-Standard Excerpts (Reference Material)

These excerpts from the highest-rated blogs in the system show what the quality bar looks like in practice. Use them to calibrate your output.

### Opening That Hooks and Names the Tension (Peter Thiel, rated 9.5)

> After 9/11, Peter Thiel bought a parachute and kept it in his office on the 42nd floor of 555 California Street in San Francisco.
>
> Not a metaphor. An actual parachute, the kind you strap to your body and jump. [Source details.] While most of America processed the attacks through grief or patriotism or cable news, Thiel assessed the threat and acquired equipment for the worst case.
>
> That single detail tells you more about Peter Thiel than any op-ed about his political influence. It tells you he is not the power-hungry tech oligarch of popular imagination. A man motivated by power buys influence. A man motivated by fear buys a parachute.

**Why it works:** Concrete detail (not a rhetorical question), immediate contradiction of public perception, core tension named in the first five paragraphs.

### Quote-Dense Section That Lets the Subject Carry the Analysis (Paris Hilton, rated 9.0)

> "I had no idea who these people were — just these two big men coming into my room in the middle of the night and literally grabbing me and carrying me from my bed. I thought I was being kidnapped."
>
> Her parents had hired a company to transport her to "emotional growth schools." She was sent to at least four of them, including Provo Canyon School in Utah, where she spent 11 months.
>
> "They would come in and target certain girls and bring us in a room and literally hold you down and have male and female staff — who are not even real doctors — just doing literal cervical exams on us."
>
> "In order to survive, I had to just think about who I wanted to be and what I wanted to become when I got out of there. 'I'm going to work so hard, become so successful, make so much money, that no one will ever control me or tell me what to do ever again.'"

**Why it works:** The subject's own words ARE the analysis. Minimal authorial text between quotes. The reader draws their own conclusions.

### Ending That Cuts to Black (Peter Thiel, rated 9.5)

> Not a villain. Not a hero. A Six, doing what Sixes do. Watching. Preparing. Building. Fearing the worst. And hoping, against all the evidence his own mind generates, that the narrow path still exists.

**Why it works:** No summary. No CTA. No "what does this mean for you?" Just the sharpest line, then silence. The reader is left with the image reverberating.

### The Enneagram Resolving a Contradiction (Blake Lively, rated 8.8)

> She genuinely believes she operates from an internal compass unaffected by the external world, even as she spends enormous energy controlling what the external world sees.
>
> That gap drives everything. The exquisite Met Gala appearances and the Kjersti Flaa incident. The three-year recipe development and the "Ryle You Wait" cocktail. The principled harassment complaint and the "rabid pig" texts.

**Why it works:** The Enneagram framework (Type 1's self-image vs. reality) resolves a contradiction that would otherwise just look like hypocrisy. It makes the reader go "that makes so much sense."

---

## Page Template Context (CRITICAL — What NOT to Include)

The blog renders in `/personality-analysis/[slug]/+page.svelte` which **ALREADY INCLUDES** certain elements programmatically. Generated markdown content must **NOT** include:

1. **`<script>` import tags** — The page component handles component imports
2. **Featured image PopCard at the top** — The page template already renders the person's image
3. **BlogPurpose component** — The server automatically inserts this before the last h2 tag
4. **`<svelte:head>` with JSON-LD** — Schema metadata is handled separately
5. **Empty `<style>` tags** — Never include `<style lang="scss"></style>` blocks

**WHAT TO INCLUDE in generated blog content:**

- Frontmatter with all metadata
- Opening quote (blockquote)
- `<p class="firstLetter">` for the intro paragraph
- TL;DR section in `<details>` tag
- All H2 and H3 sections with content
- Inline content only — no wrapper components

**Correct blog structure example:**

```markdown
---
title: 'Person Name: Enneagram Analysis Title'
description: 'Meta description, ideally 150-160 chars, problem/question first'
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

Final paragraph lands the sharpest insight and cuts to black. No summary. No CTA. No engaging question.
```

### Opening Quote Guidance

The opening quote sets the tone for the entire analysis. Choose a quote that:

- **Reveals personality** — shows how they think/feel, not just what they've achieved
- **Comes from the person directly** (preferred) or from someone who knows them well
- **Has emotional texture** — vulnerability, conviction, or humor work best
- **Connects to the core Enneagram pattern** without naming it
- **Is specific, not generic** — avoid inspirational poster quotes

---

## Triple-Title System

The 9takes celebrity blog system uses THREE title fields. Strategy: "Clickbait to the door, quality inside."

### 1. `title` (Evergreen/Authoritative)

- Displayed on the actual blog page
- Professional, accurate, timeless — should remain valuable years from now
- Example: "Elon Musk: An In-Depth Enneagram Type 5 Analysis"

### 2. `meta_title` (Clickbait/SEO)

- Used for search results, social sharing, and browser tabs
- Problem-focused, curiosity-inducing, optimized for CTR
- Target **50-60 characters** when possible; **65 max**
- Should name a real question, tension, or behavior people would plausibly search
- Example: "Inside Elon Musk's Mind: Why He Can't Stop Taking Risks"

### 3. `persona_title` (Archetype Label)

- 2-5 words max, displayed on listing pages
- Format: "[Domain]'s [Type-Allusive Adjective] [Archetype]" or "The [Archetype Reference]"
- Must subtly allude to their Enneagram type without naming it
- Should feel like a wrestling name or comic book epithet
- Example: "Tech's Mad Scientist" (Elon Musk, Type 5)

**How it works technically:**

- `PeopleBlogPageHead.svelte` uses: `data?.meta_title || data?.title`
- The page displays `title` via `ArticleTitle` component
- `persona_title` is stored in the database and displayed on listing pages via `famousTypes.ts`

### Meta Title Patterns That Work (Based on GSC Data):

- "Why [Person] Can't Stop [Behavior]" — Problem framing
- "Inside [Person]'s Mind: [Insight]" — Curiosity hook
- "The Real Reason [Person] [Did Thing]" — Revelation angle
- "[Person]'s Hidden [Trait]: What It Reveals" — Discovery hook
- "What [Person]'s [Behavior] Says About Their Personality" — Analysis angle

### Title Examples:

| Person       | `title` (Evergreen)                        | `meta_title` (Clickbait)                                             | `persona_title`              |
| ------------ | ------------------------------------------ | -------------------------------------------------------------------- | ---------------------------- |
| Taylor Swift | "Taylor Swift: Enneagram Type 3 Analysis"  | "Why Taylor Swift Can't Stop Reinventing Herself"                    | Pop's Heartbreak Alchemist   |
| Elon Musk    | "Elon Musk: An In-Depth Type 5w6 Analysis" | "Inside Elon Musk's Mind: The Obsessive Pattern Behind His Chaos"    | Tech's Mad Scientist         |
| IShowSpeed   | "IShowSpeed: Enneagram Type 7 Analysis"    | "Why IShowSpeed Acts So Crazy (It's Not What You Think)"             | —                            |
| Emma Watson  | "Emma Watson: Enneagram Type 1 Analysis"   | "Emma Watson's Hidden Perfectionism: The Pattern Behind Her Choices" | Hogwarts' Real-World Prefect |

### Persona Title Vocabulary by Type:

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

---

## Internal Linking Rules

Add 2-5 strategic internal links per blog. Perform this automatically after drafting, before presenting options to the user.

### Link Types (priority order):

1. **Celebrity Cross-Links** — If another celebrity is mentioned and we have a published blog, link to `/personality-analysis/[Person-Name]`
2. **Enneagram Type Links** — Link mentions of other types to `/enneagram-corner/enneagram-type-X` (don't link the subject's own type)
3. **Topical Blog Links** — Link to relevant internal Enneagram/mental-health posts using the internal index
4. **External Research Citations** — Descriptive anchor text, not "click here"

### Finding Valid Link Targets:

- **Celebrity blogs**: Read `src/lib/components/molecules/famousTypes.ts`. Entries with `link: true` are published and linkable at `/personality-analysis/[name]`. Do NOT use Supabase API calls for this — the file is the source of truth.
- **Topical blogs**: Start with `/docs/development/enneagram-mental-health-blog-index.json` to find relevant internal posts by topic tags, then use each entry's `route` directly for linking.

### Linking Rules:

1. Only 2-5 links total — be strategic
2. Natural placement — links should fit naturally in the text
3. First mention only — only link the first occurrence
4. Avoid linking in headings
5. Context matters — only link substantive mentions, not passing ones

### HTML vs. Markdown Links (CRITICAL):

- **Inside HTML tags** (`<p>`, `<div>`, `<details>`, `<li>`, etc.): Use `<a href="/path">text</a>`
- **In plain markdown**: Use `[text](/path)`

Example:

```html
<!-- Inside HTML block -->
<p class="firstLetter">
	Her attention to detail rivals that of <a href="/personality-analysis/Beyonce">Beyonce</a>.
</p>
```

```markdown
<!-- In markdown -->

When under stress, Type 3s can exhibit behaviors similar to unhealthy [Type 9](/enneagram-corner/enneagram-type-9) patterns...
```

### Common Topical Link Targets:

- Stress patterns → `/enneagram-corner/enneagram-types-in-stress`
- Communication styles → `/enneagram-corner/enneagram-communication-styles`
- Relationships → `/enneagram-corner/enneagram-relationship-guide`
- Wings → `/enneagram-corner/enneagram-wings-complete-guide`
- Strengths/weaknesses → `/enneagram-corner/enneagram-strengths-and-weaknesses`

After adding links, report what was added:

```
Internal links added (X total):
- [Person Name] → /personality-analysis/Person-Name
- [Type X] → /enneagram-corner/enneagram-type-X
```

---

## Valid Field Values Reference

### `type` Field (category for the person):

| Value                 | Use For                                 |
| --------------------- | --------------------------------------- |
| `celebrity`           | General celebrities, reality TV         |
| `musician`            | Musicians, singers, bands               |
| `movieStar`           | Established film actors                 |
| `newMovieStar`        | Younger/rising film actors              |
| `comedian`            | Stand-up comics, comedy creators        |
| `creator`             | YouTubers, podcasters, content creators |
| `techie`              | Tech industry leaders                   |
| `politician`          | Politicians, government leaders         |
| `entrepreneur`        | Business founders, moguls               |
| `author`              | Writers, journalists                    |
| `activist`            | Social/political activists              |
| `historical`          | Historical figures                      |
| `tiktoker`            | TikTok-primary creators                 |
| `influencer`          | Social media influencers                |
| `lifestyleInfluencer` | Lifestyle/fashion influencers           |
| `other`               | Doesn't fit other categories            |

Multiple values allowed: `type: ['musician', 'creator']`

### `suggestions` Field:

4 related people who readers might also be interested in. Choose based on:

- **Same domain** (other musicians, other tech leaders)
- **Same Enneagram type** (interesting comparison)
- **Connected relationship** (collaborators, rivals, couples)
- **Similar public perception** (comparable fame level)

Must use `First-Last` format matching the `person` field: `suggestions: ['Taylor-Swift', 'Beyonce', 'Ariana-Grande', 'Doja-Cat']`

### `published` Field:

For draft-writing purposes, keep `published: false` unless the user explicitly tells you otherwise. This command does not make publication decisions.

### `production_pretext` Field (REQUIRED HANDOFF STATE)

Use `production_pretext` to carry durable state from the writing workflow into the production workflow.

**Initialize every new or materially revised draft like this:**

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

- `draft` — writing/revision is still in progress; production should not run
- `ready` — the user has reviewed and approved the draft; production can run next
- `in_progress` — production is currently running
- `completed` — production finished with no blockers
- `blocked` — production ran but follow-up is still required

**Rules:**

- On first save, set `status: draft`.
- If you make substantive edits after a draft was previously approved, reset it to `draft`, `reviewed: false`, and `ready_for_production: false`.
- Once the user reviews and approves the draft, update it to `status: ready`, `reviewed: true`, and `ready_for_production: true`.
- After approval, the next step is `blog_content_production_people`.

---

## Production Handoff (Out of Scope Here)

This command stops at a strong draft. The durable handoff artifact is the draft's `production_pretext` block. After the user reviews and approves the draft, update `production_pretext.status` to `ready` and then run `blog_content_production_people` before anything is published or pushed through the production workflow.

---

# Part 2: Writing Workflows

---

## Session Start

When this command is invoked:

1. Determine whether the user wants a **new draft** or an **update to an existing draft**.
2. If a matching draft already exists in `src/blog/people/drafts/`, read it before proposing major changes.
3. If the user has already provided transcripts or source files, use those before asking for more research.
4. Stay focused on writing and revision. Do not drift into production tasks.

---

## Workflow: New Draft

### Step 1: Research Packet

Use WebSearch to gather comprehensive information. Follow `/docs/blogs-famous-people/prep-prompt-1.md` for the research framework.

**REQUIRED: Internal Enneagram library pass (before finalizing your research synthesis):**

1. Read `/docs/development/enneagram-mental-health-blog-index.json`.
2. Shortlist **6-12** internal posts relevant to this person's likely type and themes (e.g., stress, relationships, communication, childhood, career, anxiety/trauma patterns).
3. Read at least **3-6** of those shortlisted posts in full.
4. Produce an "internal lens brief" (pattern hypotheses + counter-hypotheses) that will be tested against external evidence.

**Research focus areas:**

- 5 strong positive contributions/accomplishments
- 5 lesser-known facts about the person
- Personal stressors and challenges
- Things they're proud of
- Topics they enjoy discussing
- Internal thought patterns
- Notable habits and behaviors

**DEPTH RESEARCH (see "What Makes a Great Analysis" in Part 1):**

Beyond the standard research, actively hunt for:

- **The core tension** — What's the central contradiction in this person? What doesn't add up about them? What do they preach vs. what they struggle with? (This should be identified by the end of Step 2 or 3.)
- **3-5 small, specific moments** — Not headline accomplishments, but tiny details that reveal who someone really is. A comment overheard, a habit no one notices, a gift that didn't land, a throwaway line in a podcast that reveals everything.
- **The public/private gap** — What surprises people who meet them in person? What do close friends say about them that contradicts their public image?
- **Childhood wounds → adult patterns** — What early experience shaped the behavior the world sees now? Look for the thread from childhood to present.

**PRIMARY SOURCE PRIORITY — Podcasts, Books, and YouTube:**

The strongest material for personality analysis comes from long-form, unscripted moments. Prioritize:

1. **Podcast appearances** — Search for "[Person] podcast interview" and "[Person] long form interview." Major shows (Joe Rogan, Lex Fridman, Diary of a CEO, Tim Ferriss, etc.) plus niche podcasts in their field.
2. **Books they've written** — Memoirs, essays, any written works. Direct window into thinking patterns.
3. **YouTube interviews** — Search for "[Person] interview YouTube," "[Person] talks about [childhood/struggles/motivation]." Long-form (30+ min) is most valuable.
4. **Direct quotes** — Pull specific quotes and attribute clearly (e.g., "In a 2023 appearance on [Podcast], [Person] said: '...'").

During research, compile a list of the most promising YouTube videos and podcast episodes for deeper transcript analysis.

**Output**: A comprehensive research summary with source URLs, a preliminary core tension, and the best small moments found so far.

### Step 2: Enneagram Analysis (Prep-Prompt-2)

Based on Step 2 research, determine the person's likely Enneagram type first. Then use that type as the input for the prep-prompt-2 analysis framework at `/docs/blogs-famous-people/prep-prompt-2.md`.

**If research is ambiguous about the type**, present the leading hypothesis plus the key unresolved ambiguity in plain language and wait for a decision before proceeding. Do **not** frame this as an extended candidate-type showdown.

Analyze across dimensions:

- **Thoughts**: How they process information and make decisions
- **Feelings**: Emotional patterns and responses
- **Actions**: Behavioral patterns and habits
- Examine stress (disintegration) and comfort (integration) states when they clarify visible behavior

**General-reader rule (REQUIRED):**

- Keep the reader-facing analysis focused on the person's motivations, contradictions, and behavior.
- Avoid paragraphs whose main purpose is to argue "Type X, not Type Y."
- Mention alternate types, wings, arrows, or subtypes only briefly and only if they prevent a real misunderstanding.

**Internal knowledge cross-check (REQUIRED):**

- Validate your type call against the internal lens brief built from internal blogs.
- Explicitly note which internal posts most informed the analysis (at least 3).
- If external evidence conflicts with the internal lens, surface the conflict and resolve it transparently.

**Core Tension Synthesis (REQUIRED):**

By the end of Step 2, you should be able to articulate:

1. **The core tension** in one phrase: "[X] vs. [Y]" — the central contradiction that makes this person psychologically interesting
2. **The psychological question** their life is answering: "What happens when someone [does X] but [also does Y]?" or "How do you [need A] when you also [need B]?"
3. **3-5 small moments** from the research that crack this tension open — tiny details, not headline accomplishments

Present these to the user alongside the Enneagram analysis when useful. These will drive the blog's narrative arc.

**Output**: Detailed Enneagram personality analysis + core tension + psychological question + key small moments.

### Step 3: Transcript Recommendations

Present a list of recommended YouTube videos/podcasts for transcript gathering:

```
Recommended YouTube Videos / Podcasts for Transcript Analysis:

| # | Title | Why It's Valuable | URL |
|---|-------|-------------------|-----|
| 1 | "[Person] on Joe Rogan Experience" | Discusses childhood and what drives them | [URL] |
| 2 | "[Person] - Oxford Union Talk" | Unscripted Q&A reveals core values | [URL] |
| 3 | "[Person] on Diary of a CEO" | Opens up about failures and insecurities | [URL] |

Grab transcripts from 2-4 of these and share them with me.
```

**If the user has already provided transcripts** (e.g., files in `youtube-transcripts/`), read and analyze those before writing.

**Wait for user input.** The user may:

1. Provide transcripts to analyze first (preferred)
2. Say to proceed without transcripts

If transcripts are unavailable or weak, continue with the best verified source material you have and note the quality limitation in your working notes.

### Step 4: Write the Draft

Use `/docs/blogs-famous-people/writing-prompt-1.md` as a starting framework, not a rigid template.

**CRITICAL: Follow the Enneagram Analysis Tone & Approach and Page Template Context rules from Part 1.**

**THE GOAL IS A QUALITY PROFILE, NOT A FORMULAIC POST.** Every person has a different story. The blog structure should be tailored to what makes _this specific person_ interesting, not forced into the same cookie-cutter layout every time. The research from Steps 1-3 should drive the structure — lead with what's most compelling about this person, not with a generic section order.

**Required elements** (every blog must cover these, but the ORDER, EMPHASIS, and SECTION NAMES should vary based on who the person is):

- Opening quote and engaging intro (see Opening Quote Guidance in Part 1)
- Their Enneagram typing with evidence (must include H2: "What is [Person]'s personality type?" and H3: "[Person] is an Enneagram Type X" for SEO)
- Upbringing and formative experiences
- Personality quirks, habits, and mindset
- Major accomplishments
- Challenges, controversies, or traumas
- Legacy and current work
- No visible FAQ section at the end of the reader-facing article
- Strong ending that cuts to black at peak insight (NO summary, NO CTA)

**How to tailor the structure:**

- **Lead with what defines them.** If someone's defining feature is overcoming trauma, open with that — don't bury it in a generic "controversies" section at the end. If someone's personality quirks are what made them famous, lead with those.
- **Name sections after the person, not the category.** Instead of "Major Accomplishments," write "How [Person] Built [Thing]" or "The [Specific Achievement] That Changed Everything." Instead of "Personality Quirks," write "[Person]'s Obsession With [Specific Thing]." Make headings that could only belong to this person's blog.
- **Combine or split sections based on the story.** If their upbringing and rise to fame are deeply intertwined, tell them together. If they have 3 distinct career chapters, give each its own section. If their controversies reveal the most about their personality, give that section more weight than accomplishments.
- **Let the research dictate the narrative arc.** After completing Steps 1-3, you should have a clear sense of what the most interesting "through line" is for this person. Build the blog around that through line, not around a generic template.

**The test:** If you swapped out the person's name and the sections still made sense for any celebrity, the structure is too generic. Restructure until the blog could only be about this person.

**Heading strategy: rich + searchable (CRITICAL):**

- Do **not** choose between "SEO headings" and "good headings." The draft needs both.
- Keep the required type section exactly once: H2 `What is [Person]'s personality type?` and H3 `[Person] is an Enneagram Type X`.
- Outside that section, aim for a **mixed heading set**:
  - **1-2 signature/story headings** that feel vivid and specific to the person
  - **2-3 search-intent headings** that mirror what a reader might actually search
  - the rest can be hybrids that carry both story and topic
- Search-intent headings should sound like real queries or recognizable topics:
  - `Why [Person] ...`
  - `How [Person] ...`
  - `[Person]'s childhood ...`
  - `[Person] and [topic]`
- Do **not** let the whole draft turn into category-template headings like `Upbringing`, `Rise to Fame`, `Controversies`, `Personality Quirks`.
- Do **not** let the whole draft turn into opaque magazine headings like `The Wiring`, `The Empty Desk`, or `The Mask` unless the topic is made explicit.
- If a vivid heading is too cryptic, **add the topic back into it** instead of flattening it. Good:
  - `The Empty Desk That Still Drives IShowSpeed`
  - `Why Jennifer Lopez Seems So Demanding`
  - `How Hailey Bieber Turned Pressure Into Rhode`

**FAQ handling (SEO, but not reader-facing):**

- Do **not** add a visible `## FAQs About [Person]'s Personality` block to the bottom of the article.
- If FAQ coverage is useful for SEO, put it in structured data / JSON-LD only when the publishing layer supports it.
- The article body should stay focused on narrative quality, not appended search filler.

**The intro's job:**
The first 3-5 paragraphs must accomplish three things: (1) hook with a specific, vivid detail or quote, (2) name or strongly imply the core tension, and (3) create a psychological question the reader needs answered. By the end of the intro, the reader should feel "I need to understand this person." Compare: Chappell Roan's intro names the tension (fortress vs. vulnerability) and ends with "That tension... is what makes Chappell Roan one of the most psychologically interesting artists of her generation." The reader has a question now. Avoid intros that ask rhetorical questions and immediately answer them — that kills the tension.

**The ending (NO traditional conclusion):**
Do NOT write a conclusion section. No summary, no CTA, no "what does this mean for you?", no mirror-on-reader question. The blog should end on its sharpest analytical insight and then stop. Cut to black. The reader should be left with a reverberating thought about the person — an unresolved tension, a haunting image, a question that lingers. If the analysis is good enough, the reader is already clicking the next person. Closure kills curiosity. End abruptly at the peak of insight, like a great movie that cuts to black at exactly the right second. Example: "He has been doing this for 44 films and he is getting faster. At some point you have to wonder: is he running toward something, or has the running itself become the point?" Then nothing.

### Step 5: Self-Review (MANDATORY)

Before generating metadata or saving, review the draft against the Quality Checklist (at the end of this document). This step catches the problems that iteration and reader notes catch in the best blogs.

**Run through every check. If any check fails, revise before proceeding.**

Pay special attention to:

- **Core tension**: Can you state it in one phrase? Is it in the intro and threaded through the piece?
- **Swap test**: If you replaced the person's name, would the sections still work for any celebrity? If yes, restructure.
- **Quote density**: Is the subject's voice the dominant material? Are there sections that are mostly paraphrase? Strengthen with direct quotes.
- **Repetition**: Is any quote, anecdote, or concept used more than once? Keep the best placement, cut the rest.
- **Ending**: Does it cut to black at peak insight? Or does it summarize, moralize, or ask the reader a question?
- **Enneagram distribution**: Is explicit framing in at most 3-4 sections? Do the remaining sections work as pure narrative?
- **Hedging**: Is the analysis confident? Or is it undermined by excessive "likely," "suggests," "appears to be"?

**Add reviewer notes as HTML comments** (`<!-- -->`) for anything you'd flag for improvement but chose not to fix now. These notes are valuable for future iterations.

### Step 6: Furniture Pass (Enhance Visual Presentation)

Once the content, structure, and narrative are locked in, do a final pass to enhance the reading experience with blog furniture — decorative and structural elements that break up the text and add visual variety.

**Reference**: See `/docs/content-generation/blog-furniture-guide.md` for the complete catalog with props, examples, and usage patterns.

**Important constraint for celebrity blogs**: Since `/personality-analysis/` pages render content from the database (not MDsvex), you can only use **HTML-based furniture** — no Svelte component imports (`<QuickAnswer>`, `<MarqueeHorizontal>`, etc.). Those are for MDsvex-rendered blogs only (enneagram, community, guides).

**Available furniture for celebrity blogs** (no imports needed):

| Element                                                     | When to use                                                 |
| ----------------------------------------------------------- | ----------------------------------------------------------- |
| `<p class="firstLetter">`                                   | Opening paragraph (should already be there from Step 4)     |
| `<details>/<summary class="accordion">/<div class="panel">` | TL;DR section (should already be there from Step 4)         |
| `---` horizontal rules                                      | Between major sections for breathing room                   |
| `>` blockquotes                                             | Pull quotes, attributed quotes, disclaimers                 |
| `<div class="iframe-container">` + `<iframe>`               | Embed a relevant YouTube interview clip                     |
| `<div class="scroll-table">`                                | Wrap any wide comparison tables                             |
| `<blockquote class="twitter-tweet">`                        | Embed a relevant tweet as evidence                          |
| Markdown pipe tables                                        | Structured comparisons or data                              |
| `<div class="pull-quote">`                                  | Elevate a powerful quote out of the prose                   |
| `<div class="key-stat">` / `<div class="key-stat-row">`     | Highlight a striking number or career stat                  |
| `<p class="inner-thought">`                                 | Imagine what the person was thinking in a key moment        |
| `<div class="timeline">`                                    | Show a chronological arc (career milestones, pivotal year)  |
| `<div class="contrast-panel">`                              | Side-by-side comparison (public vs. private, says vs. does) |
| `<div class="source-card">`                                 | Cite a specific podcast or interview source                 |
| `<div class="dialogue">`                                    | Recreate a revealing interview exchange                     |
| `<div class="aside-box">`                                   | Supplementary context (Enneagram theory, historical notes)  |

**What to look for during this pass:**

1. **Long text walls** — Any section longer than ~5 paragraphs without a visual break? Consider adding a blockquote pull-quote, a horizontal rule, or an embedded YouTube clip that's relevant to that section.
2. **Key quotes buried in prose** — If a powerful quote is sitting inside a paragraph, consider pulling it out as a standalone blockquote to give it visual weight.
3. **YouTube opportunities** — If the research from Steps 1-3 found a particularly revealing interview clip, embed it in the most relevant section rather than just citing it.
4. **Tweet evidence** — If the person has a tweet that directly supports a point in the analysis, embed it rather than paraphrasing.
5. **Data-heavy sections** — If you're comparing patterns across types or listing structured information, a pipe table (wrapped in `<div class="scroll-table">` if wide) is more scannable than bullet points.

**Rules:**

- Don't overdo it. 2-4 furniture additions per blog is the sweet spot. The writing should carry the piece — furniture enhances, it doesn't save weak content.
- Every furniture element must earn its place. If a YouTube embed doesn't add insight the text can't, cut it. If a pull-quote isn't genuinely striking, leave it inline.
- Don't add furniture to the intro or ending. The intro hooks with prose. The ending cuts to black. Furniture lives in the body.

### Step 7: Generate Metadata

Generate frontmatter following the Triple-Title System (see Part 1):

```yaml
---
title: '[Person Name]: [Evergreen Enneagram Analysis Title]'
meta_title: '[Clickbait/Problem-Focused Title for SEO]'
persona_title: '[Domain]s [Type-Allusive Descriptor]'
description: '[SEO-optimized meta description, ideally 150-160 chars, problem/question first]'
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

See **Valid Field Values Reference** in Part 1 for `type` and `suggestions` guidance.
If the draft has been graded, preserve this optional block in frontmatter and keep the key name exactly `content_quality` (not `content_grade`):

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

Save draft to `/src/blog/people/drafts/[Person-Name].md`.

Initialize `production_pretext` with `status: draft`. This draft is not ready for production yet.

Then add internal links following the **Internal Linking Rules** in Part 1.

Present to user:

```
Draft created successfully!

Location: /src/blog/people/drafts/[Person-Name].md
Preview: Visit /admin/drafts/[Person-Name] to review

Internal links added (X total):
- [links list]

Options:
1. Make specific edits (tell me what to change)
2. Regenerate specific sections
3. After review and approval, mark `production_pretext` as `ready` and run `blog_content_production_people`
4. Continue editing later
```

### Step 9: Review and Refinement

Allow iterative editing based on user feedback. Continue iterating until the user is satisfied with the draft.

**While iterating:**

- If you make substantive changes, keep or reset `production_pretext.status` to `draft`.
- Do not mark the draft ready for production while the user is still requesting edits.

**When the user approves the reviewed draft:**

Update the draft frontmatter to:

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

## Workflow: Update Existing Draft

### Step 1: Read Before Rewriting

Read the current draft file first. Map:

- The existing thesis
- The current core tension
- The strongest sections worth preserving
- The weakest or thinnest sections
- Any obvious repetition, generic structure, or stale sourcing

### Step 2: Choose the Update Mode

Pick the lightest-weight update that solves the problem:

- **Fresh research update**: add newer evidence, better quotes, sharper framing
- **Manual revision**: rewrite or tighten sections based on user feedback
- **Targeted section update**: regenerate only the sections that need work

### Step 3: Update Without Narrowing

**CRITICAL PRINCIPLE: Updates must enhance, not narrow.** Maintain the complete picture — formative experiences, core personality patterns, full career arc, relationships, and growth. New material should deepen the portrait, not replace it with only the latest news.

When updating:

- Preserve strong existing sections unless they are inaccurate, repetitive, or flat
- Prefer adding depth over deleting history
- Use new evidence to sharpen the thesis, not to start over unnecessarily
- Keep the explicit Enneagram framing limited and accessible to general readers
- Update `lastmod` in the frontmatter after meaningful revisions

### Step 4: Re-Research Intelligently

Perform focused WebSearch to fill the real gaps:

- Recent developments worth integrating
- Better direct quotes
- Stronger testimony from people around the subject
- Missing childhood/context details
- One or two better small moments, if the current draft lacks them

If transcripts are likely to materially improve the draft, recommend 2-4 high-value interviews or podcasts first.

### Step 5: Rewrite Only What Needs Rewriting

Revise the draft using the same standards as the New Draft workflow. Focus especially on:

- The hook
- The clarity of the core tension
- Quote quality and placement
- Repetition
- Section specificity
- The ending
- Overall accessibility for readers who do not know the Enneagram

### Step 6: Re-Run Review and Save

Before finalizing the revised draft:

- Re-run the Quality Checklist below
- Update internal links if the body changed materially
- Preserve any existing `content_quality` block unless you are intentionally re-grading
- Reset `production_pretext` to `draft` if the revision changed the content materially and the draft had previously been marked `ready`, `completed`, or `blocked`
- Save the revised file and summarize what changed for the user

---

## Quality Checklist (Final Review)

Before finalizing any blog (new or updated):

### Depth & Uniqueness

- [ ] **Core tension identified?** Can you state the person's central contradiction in one phrase ("[X] vs. [Y]")? Is it threaded through the intro, body, and ending?
- [ ] **At least 3 small, specific moments** that reveal big patterns? (Not just headline accomplishments — tiny details that crack open who they are.)
- [ ] **At least 1 "aha moment"** where the Enneagram makes something click that wouldn't click otherwise?
- [ ] **Public/private gap explored?** Does the blog show who this person is when the performance stops?
- [ ] **Childhood → adult thread?** Is there a visible line from formative experiences to present behavior?
- [ ] **Intro names the tension and creates a question?** Does the reader know what psychological question the blog is answering within the first 5 paragraphs?
- [ ] **Ending cuts to black?** Does the blog end abruptly on its sharpest insight — no summary, no CTA, no wrap-up? Does it leave the reader wanting more?
- [ ] **The swap test:** If you replaced this person's name with another celebrity's, would the blog still make sense? If yes, it's too generic.

### Tone & Structure

- [ ] Would this analysis be valuable 5 years from now?
- [ ] Does it cover their entire life arc?
- [ ] Are psychological insights backed by specific behavioral examples?
- [ ] Would a new reader get a complete picture of who this person is?
- [ ] Is every major quote/anecdote used only once?
- [ ] Does the TL;DR tease patterns without spoiling the best stories?
- [ ] Do at least half the sections work as pure narrative without explicit Enneagram labeling?
- [ ] Would a reader who doesn't care about the Enneagram still find this a compelling profile?
- [ ] Have you cut or compressed any passage that turns into insider typology debate ("Type X vs. Type Y," wing arguments, subtype detours)?

### Voice & Evidence

- [ ] **Quote density**: Is the subject's voice (direct quotes) the dominant material? Or is most content paraphrased?
- [ ] **Confidence**: Is the analysis confident? Or undermined by excessive "likely," "suggests," "appears to be"?
- [ ] **Testimony**: Are there quotes from people around the subject (collaborators, friends, critics)?
- [ ] **Stat check (encouraged, not required)**: Are there 1–2 specific, sourced, falsifiable numbers placed where they earn their weight (hook, type diagnosis, accomplishments)? See "Statistical Claims & Cited Sources" in Part 1. Blogs with zero stats can still ship; blogs that leave verifiable numbers on the table give away LLM-citation lift for nothing. Do not invent numbers to satisfy this check.
- [ ] **Section headings**: Are they person-specific, and do at least 2-3 of them also carry obvious search intent?
- [ ] **Heading balance**: Did you avoid both failure modes — bland template headings and overly cryptic magazine headings?

### Technical

- [ ] Are there 2-5 internal links, properly formatted (HTML in HTML blocks, markdown elsewhere)?
- [ ] Did you avoid adding a visible FAQ section to the bottom of the article?
- [ ] Does `meta_title` land around 50-60 characters and `description` around 145-160 characters?
- [ ] Does the frontmatter have all three titles, valid `type`, and 4 `suggestions`?

---

## Copywriting Pass (Required Before Grading)

After the Quality Checklist passes, run a focused copywriting pass before scoring. This is not a full rewrite — it's a targeted sharpening of the claims and language that matter most. Use Harry Dry's three-rule framework.

### What to check (in order of impact)

**1. Titles — all three**

Run each title through the three rules:

- _Can I visualize it?_ Does the title reference a specific person, behavior, or tension the reader can picture? Abstract words like "understanding," "exploring," or "the art of" almost always fail.
- _Can I falsify it?_ Is the title a claim that's true or false, or just a vague label? "Why [Person] Will Never Be Satisfied" passes. "[Person]'s Inner World" fails.
- _Can nobody else say it?_ Could Psychology Today or 16Personalities publish this title unchanged? If yes, find the sharper, more specific angle.

Rewrite any title that fails two or more tests before grading.

**2. Opening sentence and first paragraph**

The hook is where readers decide to stay or leave. Apply:

- _Two-second test_: Does the opening land its meaning immediately? If a reader has to reread it, rewrite it.
- _Visualization test_: Is the first image or claim concrete? Names, behaviors, and specific moments beat abstractions. "Taylor Swift rehearses conversations" > "Taylor Swift thinks deeply about relationships."
- _Falsifiability test_: Is the opening a claim that's verifiably true or false? Not a mood, not a statement of theme. A testable observation.

**3. Three most important claims in the body**

Find the three sentences that carry the most analytical weight — typically the thesis restatement, the core tension summary, and the type diagnosis. For each:

- Replace any adjective-as-substitute-for-evidence with something you can point at. "He is deeply ambitious" → "He has written 44 films and gets faster every year."
- If the claim could appear in a generic Enneagram explainer, find the specific behavior, quote, or moment that makes it belong only in this blog.

**4. Section headings**

Scan all H2s and H3s. Flag any heading that:

- Uses generic self-help language (`Growth`, `The Journey`, `Finding Balance`)
- Describes what the section is about instead of making a claim about the person
- Could apply to a different celebrity without changing a word

Rewrite flagged headings to be person-specific and, where possible, claim-based.

### What not to change here

- Evidence quality — that's the Quality Checklist's job
- Enneagram integration depth — also the checklist
- Prose rhythm and AI patterns — `/deai` handles that if needed
- Structure and narrative arc — already locked from the furniture pass

### Output

After the pass, note in an HTML comment what was changed and what was deliberately left:

```html
<!-- COPYWRITING PASS COMPLETE
Titles: [what changed or "passed"]
Hook: [what changed or "passed"]
Key claims: [what changed or "passed"]
Headings: [what changed or "passed"]
-->
```

Then proceed to grading.

---

## Quality Grading (Required Before Hand-Off)

After the Quality Checklist passes, score the blog using the rubric at `docs/blog-grading-rubric.md`. Rate each dimension 1-10:

1. **Hook** — Does the opening grab and create a question?
2. **Enneagram Integration** — Does the framework explain something non-obvious?
3. **Evidence / Sourcing** — Are claims backed by direct quotes and sourced material?
4. **Writing Quality** — Is the prose distinctive, confident, and well-structured?
5. **Originality** — Does it say something new with a signature detail?

Calculate: **Overall = (Hook + Enneagram + Evidence + Writing + Originality) / 5**

Letter grade: A+ (9.5+), A (9.0-9.4), B+ (8.5-8.9), B (8.0-8.4), C (7.0-7.9), D (6.0-6.9), F (<6.0)

**Publication handoff threshold: 8.5 (B+)**. Treat anything below this as draft-stage and continue revising before handing it off for production or review.

Output the grade as a JSON block for the user to review:

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

Store this in draft frontmatter as `content_quality` when grading is part of the writing workflow.

---

## File References

- Prep prompts: `/docs/blogs-famous-people/prep-prompt-*.md`
- Writing template: `/docs/blogs-famous-people/writing-prompt-1.md`
- Production command: `/Users/djwayne/9takes/.claude/commands/blog_content_production_people.md`
- Published celebrities: `/src/lib/components/molecules/famousTypes.ts`
- Enneagram internal index: `/docs/development/enneagram-mental-health-blog-index.json`
- Brand voice guide: `/docs/brand/brand-style-guide-v2.md`
- Celebrity optimization: `/docs/content-generation/celebrity-page-optimization-instructions.md`
- **Blog furniture guide: `/docs/content-generation/blog-furniture-guide.md`** — Complete catalog of all visual elements, components, and structural patterns for blogs
- **Quality grading rubric: `/docs/blog-grading-rubric.md`** — Standardized scoring system for content quality assessments
