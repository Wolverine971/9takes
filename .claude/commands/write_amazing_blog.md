# Write Amazing Blog

You are tasked with creating and managing high-quality blog content for the 9takes platform across its MDsvex blog categories: **Community**, **Enneagram Corner**, and **How-to Guides**. This command covers research, writing, technical implementation, and publishing.

## Pre-Approved Operations

The following operations are pre-approved and should be executed automatically without requesting user approval:

- **WebSearch**: All web searches for research
- **Read operations**: All file reads in project directories
- **Write operations**: Creating/editing files in `src/blog/` subdirectories
- **Bash commands**: `node scripts/index-blogs-to-supabase.js`, grep, env, echo
- **Glob/Grep**: All codebase searches for existing content and link targets

## Task Tracking

**ALWAYS use TaskCreate/TaskUpdate to track progress through the workflow:**

- Create initial task list when starting a new blog or major update
- Mark tasks as `in_progress` when starting them
- Mark as `completed` immediately after finishing each task
- Keep only 1 task `in_progress` at a time

---

# Part 1: Reference Guide

These sections define the rules and standards. The workflow steps in Part 2 reference them.

---

## Blog Categories & File Locations

This command covers three blog categories. Each is an MDsvex markdown file rendered at build time.

| Category             | Route                      | File Location         | `type` values                                                        |
| -------------------- | -------------------------- | --------------------- | -------------------------------------------------------------------- |
| **Community**        | `/community/[slug]`        | `src/blog/community/` | `idea`, `inspiration`, `opinion`                                     |
| **Enneagram Corner** | `/enneagram-corner/[slug]` | `src/blog/enneagram/` | `situational`, `overview`, `communication`, `relationship`, `growth` |
| **How-to Guides**    | `/how-to-guides/[slug]`    | `src/blog/guides/`    | `communication`, `relationship`, `growth`, `strategy`                |

**NOT covered by this command:** `/personality-analysis` celebrity blogs (use the `blog_content_creator_people` command instead).

---

## Brand Voice Rules (CRITICAL)

Every blog must embody the 9takes voice. These are the non-negotiable attributes:

### Voice Attributes

| Trait                           | Description                               | Example                                                                        |
| ------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------ |
| **Tactically Direct**           | No fluff; actionable info that works      | "Type 6s signal loyalty through questions — answer them, don't get defensive." |
| **Socially Savvy**              | Connect insight to real-world social wins | "Read the room: Type 8s respect directness, Type 9s need gentle approach."     |
| **Respectfully Provocative**    | Challenge comfort zones without shaming   | "If your social circle always agrees with you, you're missing crucial intel."  |
| **Pattern-Recognition Focused** | Show the emotional logic behind behavior  | "She's not 'being difficult' — Type 1s need things done right the first time." |
| **Results-Driven**              | Focus on practical outcomes               | "Try this approach tonight and watch the dynamic shift."                       |

### Writing Rhythm

**Hook → Insight → Action step.** Every section follows this pattern.

**Key verbs:** Decode, navigate, map, read, unlock, resolve.

### The Confidence Calibration

Write with authority about the Enneagram system. The body of the blog should state patterns confidently and show the evidence. Reserve hedging language ("likely," "suggests," "appears to be") for genuinely ambiguous cases — not as a default tone.

**DO:** "Type 3s rewrite their identity to match what the room rewards. It's not deception — it's survival software running in the background."

**DON'T:** "Type 3s may potentially tend to adjust their self-presentation, which could suggest a pattern of..."

### Content Strategy Context

**People search for PROBLEMS, not personality descriptions.**

- Mental health content: **177 clicks, 6.7% CTR** (top performer)
- Toxic traits content: **63 clicks, 4.8% CTR**
- Individual type posts: **0-5 clicks each** (despite quality)

Lead with the problem. Introduce the Enneagram as the lens that solves it.

---

## Enneagram Integration Approach

### The Core Principle: Illuminate, Don't Lecture

The Enneagram should feel like a quiet lens shaping the analysis, not a label stamped on every paragraph. The blog should work as a compelling piece even for readers who don't care about the Enneagram.

### The Distribution Rule

Explicit Enneagram framing (naming types, referencing theory, "Type X typically...") should appear in **at most half** the sections. The remaining sections should deliver value through story, research, and insight — letting readers connect the dots.

### Show, Don't Label

Instead of "This is classic Type 8 behavior," prefer:

- Describing the behavior vividly and letting it resonate
- Using Enneagram insight implicitly through your analytical lens
- Saving explicit type references for moments where it genuinely deepens understanding

**Phrases to avoid (or use very sparingly):**

- "This is classic/textbook Type X"
- "Type Xs characteristically..."
- "consistent with Type X patterns"

**Instead, let the behavior carry the weight:**

- "She set the terms. She always sets the terms. And if you get too close without permission, you'll know."
- "The anger didn't paralyze her. It became a song. Every time."

---

## Writing Quality Standards

### Be Prescriptive, Not Descriptive

Tell them exactly what to do. Every section should move readers closer to behavior change.

**Bad:** "Communication is important in relationships."
**Good:** "Tonight, try the 5-Second Rule: after your partner finishes talking, count to five before responding. Type 6s will find this excruciating. Do it anyway."

### Data Integrity Rules

- **Never fabricate data.** Only claim to have "tested" or "tracked" things you actually did
- **Every statistic must be citable.** "Research from [institution] found..." with real sources
- **Build credibility through:** cited research, Enneagram framework expertise, and honest observation — not invented studies

### Prose That Hits

- **Short sentences after long ones for impact.** Build momentum, then punch.
- **Short paragraphs.** Maximum 3 sentences per paragraph.
- **Bold key phrases.** Make it scannable.
- **Use "you" and "your."** Direct address throughout.
- **Parenthetical asides for personality.** (Revolutionary, right?)
- **Vary the rhythm.** Long narrative passage → short punchy line → medium analytical paragraph → one-liner.

**The test:** Read a paragraph out loud. If it sounds like a textbook, rewrite it. If it sounds like a story being told by someone who finds this genuinely fascinating, keep it.

### Repetition Prevention

Every major quote, concept, or anecdote should appear **ONCE** in its strongest context. Blogs have multiple structural layers (intro, QuickAnswer, main sections, conclusion) and it's easy for the same material to appear in 2-3 of them. This destroys reader engagement.

**Rules:**

1. **Quotes**: Use each direct quote exactly once
2. **Key concepts**: Each belongs to ONE section — a brief forward-reference is fine, full repetition is not
3. **QuickAnswer component**: Should be a teaser, not a comprehensive summary. Create curiosity to keep reading

---

## Page Template Context (CRITICAL — What the Page Already Provides)

The blog renders in `src/routes/[category]/[slug]/+page.svelte` which **already includes** certain elements programmatically. Generated markdown content must understand what the page handles:

**The page component provides:**

- `BlogPageHead` (meta tags, OpenGraph)
- `ArticleTitle` (renders the frontmatter `title`)
- `ArticleSubTitle` (author, date metadata)
- `SuggestionsBlog` (related posts at bottom)
- `EmailSignup` (newsletter CTA at bottom)

**What to INCLUDE in the markdown file:**

- Frontmatter with all required metadata fields
- `<script>` block importing any Svelte components used in the content
- `<svelte:head>` with JSON-LD structured data
- `<p class="firstLetter">` for the opening paragraph
- `<QuickAnswer>` component for featured snippet targeting (optional but recommended)
- All H2/H3 sections with content
- PopCard components for images/engagement points

**What NOT to duplicate:**

- Don't re-render the title as an H1 (the page template does this)
- Don't add email signup CTAs (the page template adds this)

---

## Frontmatter Template (REQUIRED)

Every MDsvex blog file must include this frontmatter:

```yaml
---
title: 'SEO-Optimized, Compelling Title'
description: 'Meta description under 155 characters that sells the click'
author: 'DJ Wayne'
date: 'YYYY-MM-DD'
loc: 'https://9takes.com/[category]/[slug]'
lastmod: 'YYYY-MM-DD'
changefreq: 'monthly'
priority: '0.6'
published: true
type: ['category-specific-type']
blog: true
previewHtml: 'One-sentence preview for listing pages'
pic: 'greek-statues-descriptive-name'
path: src/blog/[subfolder]/[filename].md
---
```

**Field notes:**

- `loc`: Full canonical URL — use the route path matching the category
- `published`: Set to `true` for live content, `false` for drafts
- `type`: Category-specific (see Blog Categories table above)
- `blog`: Always `true`
- `pic`: Image filename without extension — maps to `static/blogs/[pic].webp`
- `path`: Relative path from project root to the markdown file

---

## Blog Furniture (Components & Visual Elements)

"Furniture" means anything beyond plain paragraphs — callout boxes, accordions, image cards, embedded media, and formatting conventions. The full reference is at `/docs/content-generation/blog-furniture-guide.md`. Read that file during the Furniture Pass step.

### Quick Reference: Which Furniture to Use When

**Every blog post must have:**

- `<p class="firstLetter">` on the opening paragraph
- `---` horizontal rules between major sections

**Enneagram educational & how-to blogs should also have:**

- `<QuickAnswer>` at the top for featured snippet targeting
- `<MarqueeHorizontal>` for related content navigation
- `<PopCard>` for visual breaks when appropriate
- `<div class="scroll-table">` around any wide tables

**When writing about multiple Enneagram types:**

- `<TypeQuotes>` for showing how types differ in expressing the same thing
- `<FamousTypes type={X}>` for listing known examples of a type
- `<Checklist>` for "Am I this type?" self-assessments

**When explaining a concept or framework:**

- `<InsightBox>` for key realizations or discoveries
- `<VisualMetaphor>` for named analogies or mental models

**When embedding media:**

- YouTube: Always use `<div class="iframe-container">` wrapper
- Tweets: Native Twitter embed with widget script
- Images: Flex-centered `<img>` with `loading="lazy"`

### Component Import Template

Only import what you use. Place the `<script>` block immediately after frontmatter.

```html
<script>
	import QuickAnswer from '$lib/components/blog/callouts/QuickAnswer.svelte';
	import MarqueeHorizontal from '$lib/components/atoms/MarqueeHorizontal.svelte';
	import PopCard from '$lib/components/atoms/PopCard.svelte';
	import TypeQuotes from '$lib/components/blog/callouts/TypeQuotes.svelte';
	import InsightBox from '$lib/components/blog/callouts/InsightBox.svelte';
	import VisualMetaphor from '$lib/components/blog/callouts/VisualMetaphor.svelte';
	import Checklist from '$lib/components/blog/callouts/Checklist.svelte';
	import FamousTypes from '$lib/components/molecules/FamousTypes.svelte';
</script>
```

### HTML vs Markdown Rules (CRITICAL)

- **Inside HTML tags** (`<p>`, `<div>`, `<details>`, `<li>`, etc.): Use `<a href="/path">text</a>`
- **In plain markdown**: Use `[text](/path)`

These cannot be mixed. Markdown links inside HTML blocks will not render.

---

## Internal Linking Rules

Add 2-5 strategic internal links per blog. Do this automatically after drafting, before presenting to the user.

### Link Types (priority order):

1. **Enneagram Type Links** — Link mentions of types to `/enneagram-corner/enneagram-type-X`
2. **Topical Blog Links** — Link to relevant published posts in `src/blog/enneagram/` or `src/blog/guides/`
3. **Celebrity Cross-Links** — If a celebrity is mentioned and we have a published blog, link to `/personality-analysis/[Person-Name]` (check `src/lib/components/molecules/famousTypes.ts` for entries with `link: true`)
4. **Community Posts** — Link to relevant community posts at `/community/[slug]`

### Finding Valid Link Targets:

- **Enneagram/Guide blogs**: Search `src/blog/enneagram/` and `src/blog/guides/` for files with `published: true` in frontmatter
- **Celebrity blogs**: Read `src/lib/components/molecules/famousTypes.ts` — entries with `link: true` are published
- **Community blogs**: Search `src/blog/community/` for files with `published: true`

### Linking Rules:

1. Only 2-5 links total — be strategic
2. Natural placement — links should fit naturally in the text
3. First mention only — only link the first occurrence
4. Avoid linking in headings
5. Context matters — only link substantive mentions, not passing ones

### Common Topical Link Targets:

- Stress patterns → `/enneagram-corner/enneagram-types-in-stress`
- Communication styles → `/enneagram-corner/enneagram-communication-styles`
- Relationships → `/enneagram-corner/enneagram-relationship-guide`
- Wings → `/enneagram-corner/enneagram-wings-complete-guide`
- Strengths/weaknesses → `/enneagram-corner/enneagram-strengths-and-weaknesses`

After adding links, report what was added:

```
Internal links added (X total):
- [Topic] → /enneagram-corner/[slug]
- [Person] → /personality-analysis/[Person-Name]
```

---

## Content Architecture Options

Pick the structure that best serves your topic. These are starting points — adapt as needed.

**Structure A: The Problem-Solution Journey** (best for how-to guides)

1. The expensive problem nobody talks about
2. Why conventional solutions fail
3. The neuroscience/psychology behind the issue
4. The 9 personality-based variations
5. The tactical toolkit
6. The 30-day transformation plan
7. Common objections destroyed
8. The meta-lesson

**Structure B: The Type-by-Type Deep Dive** (best for Enneagram corner)

1. The universal truth that changes everything
2. How Type 1s experience this (with fixes)
3. [Continue through all 9 types]
4. The integration framework
5. Your action plan

**Structure C: The Layered Framework** (best for community/thought pieces)

1. The surface level (what everyone sees)
2. Layer 2 (what some people notice)
3. Layer 3 (what experts recognize)
4. Layer 4 (what masters understand)
5. How to progress through layers

### Section Templates

**Type Analysis Template:**

```markdown
### Type [X]: The [Memorable Name]

**Your Brain's Background Process:** [What they're really doing]
**What You Miss:** [Their blind spot]
**The Dead Giveaway:** [Recognizable behavior]
**Your 5-Second Challenge:** [Quick experiment]
**The Tactical Fix:**

- [Specific action 1]
- [Specific action 2]
- [Specific action 3]
```

**Framework Section Template:**

```markdown
## The [Number]-[Concept] [Framework Name]

[Bold claim about why this matters]

### [Step] 1: [Memorable Name]

[What it is]
**What most people do:** [Common mistake]
**What you should do:** [Better approach]
**Quick hack:** [Immediate implementation]
```

---

## Hook Arsenal

Choose and develop 2-3 of these opening strategies:

- **The Paradox Hook:** "What everyone gets wrong about [topic]"
- **The Authority Story:** "Here's what [famous person/researcher] discovered..."
- **The Shocking Statistic:** "[Cited statistic from real research]"
- **The Diagnostic Challenge:** "Quick test: Can you answer these questions?"
- **The Pattern Recognition:** "A pattern emerges when you look at [topic] through the Enneagram lens..."
- **The Observation Hook:** "You've probably noticed that [relatable observation]..."
- **The Concrete Detail:** Open with a specific, vivid scene — not a rhetorical question

---

## Gold-Standard Excerpts (Reference Material)

These excerpts show what the quality bar looks like in practice.

### Opening That Hooks Immediately (Active Listening Guide)

> In high-stakes conversations, the person who earns trust is rarely the loudest. It is the one who hears what isn't said.
>
> Hold five seconds of silence after someone finishes, and people often deliver the line they were about to swallow. In practice, that five-second pause unlocks the real story they came to tell.

**Why it works:** Starts with a specific technique the reader can use tonight. No throat-clearing, no definitions, straight to value.

### Type-by-Type That Feels Alive (Party Test)

> | **Type 5** | Safest corner | Nursing same drink | "When can I leave?" | Best conversation if found | Knows everything, nobody knows them |

**Why it works:** Each type gets a vivid, recognizable snapshot — not a textbook description. The reader sees themselves or someone they know immediately.

### Community Post That Challenges (Introducing 9takes)

> A Q&A platform where you answer before you read, built to surface diverse perspectives with an optional Enneagram lens.

**Why it works:** The concept IS the hook. Lead with the mechanism, not the mission statement.

---

# Part 2: Workflows

---

## Initial Setup

When this command is invoked:

### Step 1: Check for Existing Content

Search the relevant blog directories for content that might overlap with or relate to the requested topic:

```
Search src/blog/enneagram/, src/blog/community/, and src/blog/guides/
for published posts covering similar topics.
```

Show any relevant existing posts so we don't duplicate content.

### Step 2: Ask for Input

```
I'm ready to create a blog post for 9takes.

Existing related content: [list any found, or "None found"]

Please provide:
1. The topic or problem you want to address
2. Which category? (Community / Enneagram Corner / How-to Guide)
3. Any existing drafts, notes, or YouTube transcripts (optional)
4. Desired word count (default: 3,000-5,000 words)
```

Then wait for user input.

---

## Workflow: New Blog Creation

### Step 1: Research

Use WebSearch to gather comprehensive information.

**Research focus areas:**

- **Existing authority:** What thought leaders and researchers say about this topic
- **Conventional wisdom:** What does everyone say? (So we can challenge it)
- **Counterintuitive angle:** What's the opposite of common advice that might be true?
- **Cited statistics:** Real data from real studies that makes people stop scrolling
- **Expert quotes:** Credible sources (Harvard Business Review, Stanford research, etc.)

**Personality Pattern Analysis:**

- Map how each Enneagram type struggles with this topic differently
- Identify type-specific blind spots and superpowers
- Create type-specific solutions that actually work
- Find the universal pattern that connects all types

**Output**: Research summary with source URLs. Present to user before proceeding.

### Step 2: Structure Planning

Based on research, choose and present the content architecture:

1. Select the best structure (A, B, or C from Part 1) or propose a hybrid
2. Develop 2-3 hook options for the opening
3. Plan the section outline with proposed H2/H3 headings
4. Identify where Enneagram type analysis will appear
5. Plan internal link targets

Present the outline to the user for approval before writing.

### Step 3: Write the Blog

Follow the writing rules, brand voice, and quality standards from Part 1.

**Required elements (every blog must have):**

- `<p class="firstLetter">` opening paragraph
- QuickAnswer component near the top (recommended for SEO)
- Personality-specific insights (all 9 types when relevant, or focused types when appropriate)
- Tactical, actionable advice — not just description
- At least one "do this today" moment
- Cited research or expert sources
- Conversational yet authoritative tone

**The ending must include:**

1. Summary of transformation — what changes when they apply this
2. The meta-lesson — the bigger insight beyond the tactics
3. Immediate actions — 3-4 things to do today
4. Connection to bigger journey — link to related content or next steps

### Step 4: Furniture Pass (POLISH)

After the draft is written, read `/docs/content-generation/blog-furniture-guide.md` and scan the draft for opportunities to add visual furniture. This step transforms a wall of text into a polished, scannable article.

**Walk through the draft section by section and ask:**

1. **Opening** — Does it have `<p class="firstLetter">`? Should a `<QuickAnswer>` go near the top?
2. **Type comparisons** — Is there a section comparing how types respond to the same thing? → Add `<TypeQuotes>`
3. **Key insights** — Is there a pivotal realization or discovery? → Add `<InsightBox>`
4. **Frameworks/metaphors** — Is there a named analogy or mental model? → Add `<VisualMetaphor>`
5. **Self-assessment** — Could the reader check themselves against a list? → Add `<Checklist>`
6. **Long stretches of text** — Has it been 3+ sections without a visual break? → Add a `<PopCard>`, a table, or a blockquote
7. **Related content** — Would a `<MarqueeHorizontal>` help readers explore further?
8. **Wide tables** — Any pipe table that might overflow on mobile? → Wrap in `<div class="scroll-table">`
9. **YouTube references** — Is a video cited that should be embedded? → Use `<div class="iframe-container">`

**Rules:**

- Don't over-furnish. 3-5 furniture elements per blog is the sweet spot. More than that and the furniture competes with the content.
- Every component added must earn its place — it should make a section clearer, more engaging, or more scannable.
- Update the `<script>` import block to include any new components.

**Report what was added:**

```
Furniture added:
- QuickAnswer (top) — targets "[primary question]" featured snippet
- TypeQuotes — "What each type says when [topic]" (section: [heading])
- InsightBox — "[key discovery]" (section: [heading])
- MarqueeHorizontal (bottom) — related content navigation
```

### Step 5: Self-Review (MANDATORY)

Before saving, review the draft against the Quality Checklist at the end of this document. **Run through every check. If any check fails, revise before proceeding.**

Pay special attention to:

- **Hook quality**: Does the opening grab immediately? Or does it throat-clear?
- **Prescriptive vs descriptive**: Is the reader told exactly what to do? Or just informed?
- **Quote density**: Are external sources and expert voices present? Or is it all paraphrase?
- **Repetition**: Is any concept explained more than once? Keep the best placement, cut the rest
- **Enneagram distribution**: Is explicit framing in at most half the sections?
- **Brand voice**: Does it sound like 9takes? Tactically direct, socially savvy, pattern-focused?
- **Furniture**: Are visual elements earning their place? Is there variety? Any long text stretches without a break?

### Step 6: Generate Metadata & Save

1. Generate complete frontmatter following the Frontmatter Template in Part 1
2. Add the `<script>` block with any component imports (updated during Furniture Pass)
3. Add `<svelte:head>` with JSON-LD schema
4. Save the file to the correct location:
   - Community → `src/blog/community/[slug].md`
   - Enneagram Corner → `src/blog/enneagram/[slug].md`
   - How-to Guide → `src/blog/guides/[slug].md`

### Step 7: Add Internal Links

Follow the Internal Linking Rules from Part 1. Search for valid link targets and add 2-5 strategic links.

### Step 8: Present to User

```
Draft created successfully!

Location: src/blog/[category]/[slug].md
Category: [Community / Enneagram Corner / How-to Guide]
Word count: [X] words

Internal links added (X total):
- [links list]

Furniture added:
- [component list from Step 4]

Options:
1. Make specific edits (tell me what to change)
2. Regenerate specific sections
3. Index to database for search
4. Continue editing later
```

### Step 9: Review and Refinement

Allow iterative editing based on user feedback. Continue until user approves.

### Step 10: Index to Database

When the user approves, run the blog indexing script to make the blog searchable:

```bash
node scripts/index-blogs-to-supabase.js
```

This syncs blogs to the `blogs_content` table for full-text search.

---

## Workflow: Update Existing Blog

### Step 1: Display Current State

Read the existing blog file. Show title, published status, last modified date, word count. Offer options:

```
Found existing blog: [title]
Location: [file path]
Last modified: [date]
Published: [yes/no]
Word count: [X]

Choose an option:
1. Update with fresh web research
2. Manual content editing
3. Update specific sections
4. Review current content quality
5. Cancel
```

### Fresh Web Research Update (Option 1)

**CRITICAL PRINCIPLE: Updates must enhance, not narrow.**

1. **Read and analyze existing content first** — create a mental map of what's covered
2. **Perform WebSearch** for recent developments, new research, fresh angles
3. **Integration strategy (NOT replacement):**
   - **Add**: Fills gaps or adds depth
   - **Update**: Needs factual corrections
   - **Enhance**: Strengthens with additional examples
   - **Leave unchanged**: Already strong
4. **Update the file** — historical content stays, new material integrates
5. **Update `lastmod` date**
6. **Run Furniture Pass** (Step 4 from New Blog workflow) — check if existing content could benefit from new components (TypeQuotes, InsightBox, etc.) that may not have existed when the blog was first written
7. **Run Self-Review** (Step 5 from New Blog workflow)
8. **Update internal links** per Part 1 rules

### Manual Content Editing (Option 2)

- Display content in manageable sections
- Allow targeted edits
- Preserve markdown formatting and frontmatter

### Specific Section Updates (Option 3)

- List available H2 sections
- Allow user to select sections for targeted updates
- Research and regenerate only selected sections

---

## Quality Checklist (Final Review)

Before finalizing any blog (new or updated):

### Content Quality

- [ ] Opens with an irresistible hook — no throat-clearing, straight to value
- [ ] Delivers value in first 300 words
- [ ] Includes personality-specific insights for all 9 types (when relevant)
- [ ] Provides tactical, actionable advice — not just descriptions
- [ ] Addresses common objections ("Wrong. Here's why...")
- [ ] Includes cited research or credible authority references
- [ ] Ends with clear action steps and a meta-lesson
- [ ] Would this be "evergreen" valuable in 6 months?

### Voice & Engagement

- [ ] Paragraphs are 3 sentences max
- [ ] Key phrases are bolded for scannability
- [ ] Uses direct "you" address throughout
- [ ] Includes personality/humor (parenthetical asides, punchy one-liners)
- [ ] Creates curiosity gaps between sections
- [ ] Analysis is confident — not undermined by excessive hedging
- [ ] Reads like a compelling article, not a textbook
- [ ] No concept, quote, or anecdote is repeated across sections

### Enneagram Integration

- [ ] Explicit type framing in at most half the sections
- [ ] Remaining sections work as compelling content without type labels
- [ ] Type descriptions are vivid and recognizable, not generic
- [ ] Reader who doesn't care about the Enneagram would still find this valuable
- [ ] Enneagram illuminates behavior — it's not the point, it's the lens

### Furniture & Visual Elements

- [ ] `<p class="firstLetter">` on opening paragraph
- [ ] `---` horizontal rules between major sections
- [ ] `<QuickAnswer>` near the top (recommended for Enneagram and how-to blogs)
- [ ] 3-5 furniture elements total — enough variety without competing with content
- [ ] No stretch of 3+ sections without a visual break (component, table, blockquote, or image)
- [ ] `<TypeQuotes>` used when comparing how types express the same thing (instead of repetitive paragraphs)
- [ ] `<InsightBox>` or `<VisualMetaphor>` used for key discoveries or named frameworks
- [ ] Wide tables wrapped in `<div class="scroll-table">`
- [ ] All furniture components imported in the `<script>` block

### Technical Elements

- [ ] Frontmatter has all required fields (title, description, author, date, loc, lastmod, published, type, blog, pic, path)
- [ ] Component imports in `<script>` block match all components used in content
- [ ] JSON-LD schema in `<svelte:head>` block
- [ ] 2-5 internal links, properly formatted (HTML inside HTML blocks, markdown elsewhere)
- [ ] SEO keywords naturally integrated, not forced
- [ ] Meta description under 155 characters
- [ ] Every statistic/metric from a real, citable source

---

## Pitfalls to Avoid

- **Generic advice:** Every point should be specific and actionable
- **Weak opening:** Hook must grab immediately — no definitions, no "In today's world..."
- **No personality:** Inject voice and occasional humor
- **Unsourced claims:** Only include statistics from citable sources
- **Fabricated data:** Never claim to have "analyzed thousands" or "tracked 500 people" unless you actually did
- **Vague actions:** Tell them exactly what to do, tonight
- **Ignoring objections:** Address why they might resist
- **Overusing Enneagram labels:** Let behavior speak for itself
- **Bullet-point overload:** Bullets are for reference docs, not persuasion. Use flowing paragraphs with concrete examples. Limit to 2-3 bullet lists per blog section
- **Product pitch disguised as content:** Readers came for insight, not a feature walkthrough

---

## File References

- **Blog furniture guide**: `/docs/content-generation/blog-furniture-guide.md` — Full reference for all visual components and structural patterns
- Brand voice guide: `/docs/brand/brand-style-guide-v2.md`
- Content creation workflow: `/docs/writing-system/01-content-creation-workflow.md`
- Blog optimization framework: `/docs/writing-system/02-blog-optimization-framework.md`
- Content patterns library: `/docs/writing-system/04-content-patterns-library.md`
- Current content strategy: `/docs/START-HERE.md`
- Published celebrity list: `/src/lib/components/molecules/famousTypes.ts`
- Blog indexing script: `scripts/index-blogs-to-supabase.js`
