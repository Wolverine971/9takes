<!-- docs/planning/personality-analysis-timeline-component-spec-2026-04-09.md -->

# Personality Analysis Timeline Component Spec

_Last updated: 2026-04-09_

## Goal

Add a first-class timeline component to personality analysis pages so readers who do not know the person can understand their backstory, major pressure points, and rise before reading the deeper Enneagram analysis.

This should become part of the standard personality-analysis flow:

1. Generate the blog content
2. Generate the timeline component data
3. Render the timeline in a dedicated, premium slot on the person page

## Problem

Right now, the page assumes too much baseline familiarity.

- Readers often land on a personality-analysis page knowing the name but not the story.
- Important backstory is buried inside the article body instead of being surfaced as immediate context.
- Some drafts already use ad hoc raw HTML `.timeline` blocks, but they are inconsistent and not tied to a reusable page-level component.
- The current page has a strong hero (`PopCard`) and strong navigation (`TableOfContents`), but no structured "who is this person and how did they get here?" layer between them.

The result is a weak onboarding experience for unfamiliar readers, especially on celebrities, founders, politicians, and historical figures whose psychology only makes sense once the reader sees the life arc.

## Current Constraints

Relevant current implementation:

- The person page is rendered by [src/routes/personality-analysis/[slug]/+page.server.ts](/Users/djwayne/9takes/src/routes/personality-analysis/[slug]/+page.server.ts) and [src/routes/personality-analysis/[slug]/+page.svelte](/Users/djwayne/9takes/src/routes/personality-analysis/[slug]/+page.svelte).
- The hero `PopCard` is rendered at the page level, not inside article markdown.
- The accordion TOC and sidebar TOC are generated from article-body headings only.
- Blog content is processed server-side by [src/lib/server/blogContentProcessor.ts](/Users/djwayne/9takes/src/lib/server/blogContentProcessor.ts), which currently supports only a small whitelist of custom component tags.
- Drafts are pushed into `blogs_famous_people` by [scripts/personBlogParser.js](/Users/djwayne/9takes/scripts/personBlogParser.js).
- Admin editing round-trips through [src/routes/api/admin/content/[id]/+server.ts](/Users/djwayne/9takes/src/routes/api/admin/content/[id]/+server.ts), which uses an explicit field whitelist.
- The content style guide already documents a manual `.timeline` pattern in [docs/content-generation/blog-furniture-guide.md](/Users/djwayne/9takes/docs/content-generation/blog-furniture-guide.md).

Important implication:

- The cleanest implementation is a dedicated page-level timeline artifact, not more raw HTML embedded in markdown.

## Product Decision

Build a dedicated page-level component called `LifeTimeline` backed by structured JSON data.

Decision details:

- Store timeline data separately from article markdown.
- Render it after the hero `PopCard` and before the accordion TOC and article body.
- Treat it as a required companion artifact for new or refreshed personality analyses.
- Keep existing inline `.timeline` HTML working for old content, but deprecate it for new work.

This gives us:

- consistent placement
- consistent visual quality
- structured generation and validation
- cleaner migration path from raw HTML timelines already in some drafts

## User Experience

### Placement

Render the timeline here on the person page:

1. Title
2. Subtitle / metadata
3. Hero `PopCard`
4. `LifeTimeline`
5. Accordion TOC
6. Article body

Why this location:

- It answers the reader's first question before they enter the analysis.
- It behaves like page furniture, similar to the `PopCard` and TOC, not like a random article block.
- It does not compete with the right-rail TOC because it stays in the main content column.

### Purpose

The component should answer:

- Who is this person?
- What shaped them?
- What did they go through?
- What was the turning point?
- How did they become culturally important or successful?

It should not try to replace the article. It is context, not the full argument.

### Visual Direction

The component should feel premium and editorial, not like a generic startup timeline.

Required qualities:

- cinematic, high-contrast presentation
- strong hierarchy between year, event, and turning point
- elegant spacing and typography
- motion that feels intentional, not gimmicky
- visually distinct from the article body but still native to the page

Avoid:

- Mermaid-style diagrams
- dense biographical resumes
- horizontal timelines that become unusable on mobile
- novelty interactions that make scanning harder

### Desktop Layout

Desktop should use a vertical spine with milestone cards arranged in a staged editorial layout.

Recommended behavior:

- one prominent section shell with a title and 1-2 sentence dek
- a vertical line/spine running through the milestones
- milestone cards offset slightly for rhythm, but still easy to scan top-to-bottom
- one clearly emphasized turning-point milestone
- optional stage chips such as `Origins`, `Pressure`, `Breakthrough`, `Reinvention`
- subtle entrance animation when the section first enters the viewport

### Mobile Layout

Mobile should collapse to a single-column stacked layout with the same vertical spine.

Rules:

- no horizontal scroll dependency
- tap targets remain simple
- reading order stays chronological
- turning point remains visually obvious without relying only on color

### Interaction

V1 should be mostly passive and scannable.

Allowed interactions:

- hover/focus treatment on desktop milestone cards
- a "Jump to analysis" link at the top-right of the section
- subtle scroll-triggered reveal

Not needed in V1:

- expandable nested details
- draggable timeline
- timeline filtering

## Content Model

Add a new structured field called `life_timeline`.

Recommended shape:

```ts
type LifeTimeline = {
	title: string;
	dek: string;
	jump_link_label?: string;
	milestones: LifeTimelineMilestone[];
};

type LifeTimelineMilestone = {
	id: string;
	date_label: string;
	headline: string;
	body: string;
	stage: 'origins' | 'pressure' | 'break' | 'breakthrough' | 'dominance' | 'reinvention';
	turning_point?: boolean;
};
```

### Field Rules

`title`

- 4-9 words
- should frame the arc, not repeat the page title
- example pattern: `How She Became Pop's Tender Heartbreak Translator`

`dek`

- 1-2 sentences
- should explain why the timeline matters for the personality analysis

`milestones`

- 5-7 items required
- exactly 1 item with `turning_point: true`
- chronological order only
- must include at least:
  - one formative early event
  - one pressure/adversity event
  - one breakthrough event
  - one present-day or legacy event

`date_label`

- human-readable, not machine-only
- examples: `1997`, `Age 12`, `2009-2011`, `Spring 2020`

`headline`

- short, punchy, scannable
- target under 80 characters

`body`

- one crisp sentence
- target under 160 characters
- must explain why the event matters, not just what happened

`stage`

- controls styling only
- should reinforce narrative movement

## Content Quality Rules

The timeline must not degrade into resume bullets.

Every milestone should pass this test:

- it changed the person's trajectory
- it reveals pressure, ambition, identity, or adaptation
- it helps a new reader understand the later personality analysis

Weak milestone:

- `2018: Won another award`

Strong milestone:

- `2018: Fired by the studio. Learned that being talented was not enough without control.`

The timeline should bias toward:

- formative wounds
- family or class context
- breakout moments
- public failure or crisis
- reinvention

It should de-emphasize:

- vanity milestones
- routine awards lists
- minor project chronology

## Generation Flow

The timeline should be generated as a separate artifact in the same pipeline as the blog.

### Step 1: Research

The research phase already asks for a `Stress/Growth Timeline` in [docs/blogs-famous-people/prompts/research-prompt.md](/Users/djwayne/9takes/docs/blogs-famous-people/prompts/research-prompt.md).

That becomes the input for the component.

### Step 2: Blog Generation

Generate the article markdown as usual.

### Step 3: Timeline Generation

Generate `life_timeline` from the same research corpus, with a separate prompt or separate structured output block.

Timeline-generation instructions should explicitly require:

- 5-7 milestones
- exactly one turning point
- adversity plus rise, not just success
- scannable writing
- no duplicate coverage of trivial events
- no unsupported speculation

### Step 4: Validation

Add a validation pass before publish.

Validation checks:

- field exists or is intentionally null
- 5-7 milestones
- exactly one turning point
- all required strings present
- chronological ordering preserved
- body length budget respected
- duplicate years/events prevented

### Step 5: Publish

Persist the blog content and `life_timeline` together.

## Storage Strategy

Use both draft-frontmatter storage and database storage.

### Draft Format

Add `life_timeline` to people draft frontmatter so the timeline survives local editing and code review.

Example:

```yaml
life_timeline:
  title: "How She Became Pop's Tender Heartbreak Translator"
  dek: 'Before the fame, there was loss, reinvention, and a series of bets that turned private hurt into public language.'
  milestones:
    - id: 'nashville-move'
      date_label: 'Age 14'
      headline: 'Moves to Nashville to chase a country deal'
      body: 'The ambition starts early: leave home, build the dream, make yourself undeniable.'
      stage: 'origins'
    - id: 'masters-loss'
      date_label: '2019'
      headline: 'Loses control of her masters'
      body: 'Success stops feeling like ownership. The fight becomes about power, not popularity.'
      stage: 'pressure'
      turning_point: true
```

### Database

Add `life_timeline JSONB NULL` to `blogs_famous_people`.

Why JSONB:

- structured and queryable
- easy to pass through page loads
- compatible with Supabase typing
- supports admin editing without parsing HTML blobs

## Rendering Architecture

### New Component

Create:

- `src/lib/components/blog/LifeTimeline.svelte`

Responsibilities:

- render the premium page-level timeline section
- accept typed `life_timeline` data plus light page context such as `person`, `persona_title`, and `enneagram`
- handle desktop/mobile layout variants
- support reduced motion

### Page Integration

Update [src/routes/personality-analysis/[slug]/+page.server.ts](/Users/djwayne/9takes/src/routes/personality-analysis/[slug]/+page.server.ts) to pass through `life_timeline`.

Update [src/routes/personality-analysis/[slug]/+page.svelte](/Users/djwayne/9takes/src/routes/personality-analysis/[slug]/+page.svelte) to:

- import `LifeTimeline`
- render it after the hero `PopCard`
- hide it when no timeline data exists

### Why Not Use the Existing Placeholder System

Do not make V1 an inline markdown component.

Reasons:

- placement needs to be fixed and page-level
- the component is conceptually closer to hero furniture than to article prose
- keeping it outside article HTML avoids TOC/parser edge cases
- generation is cleaner when the timeline is a separate artifact, not another raw tag blob

### Future Option

If later needed, the content placeholder system can be extended to support `<LifeTimeline />` inside article content. That should be a follow-up, not the first implementation.

## Admin and Editorial Workflow

### V1

Support editing the field in the admin content editor with a raw JSON textarea or structured plain-text editor block.

Required updates:

- add `life_timeline` to the admin `PUT` whitelist in [src/routes/api/admin/content/[id]/+server.ts](/Users/djwayne/9takes/src/routes/api/admin/content/[id]/+server.ts)
- surface `life_timeline` in [src/routes/admin/content-board/MetadataSidebar.svelte](/Users/djwayne/9takes/src/routes/admin/content-board/MetadataSidebar.svelte)

### V2

Build a structured repeater UI:

- title field
- dek field
- add/remove/reorder milestone items
- turning-point toggle with single-selection enforcement
- inline validation feedback

## Migration Plan

Some existing drafts already contain raw `.timeline` HTML blocks.

Examples already in the repo include:

- J.K. Rowling
- Kamala Harris
- Matthew McConaughey
- Zoe Kravitz
- Gavin Newsom

Migration approach:

1. Keep old inline timelines rendering as-is for now.
2. Introduce `life_timeline` for all new and refreshed pages.
3. Audit existing inline timelines and port the strongest ones into structured data.
4. Remove duplicate inline timelines from article bodies once the page-level component is live for that person.

Rule:

- a page should not show both the page-level `LifeTimeline` and a second raw HTML timeline covering the same arc

## Design Notes

The component should visually rhyme with the site's stronger furniture pieces without cloning them.

Recommended treatment:

- dark editorial shell or warm textured panel behind the section
- restrained accent color borrowed from the page context
- large date labels, compact card bodies
- one dramatic treatment for the turning point
- small overline like `Backstory` or `Life Arc`

Suggested title patterns:

- `The Life Arc`
- `How [Name] Got Here`
- `Before the Analysis`
- `The Rise of [Name]`

Recommended default:

- section overline: `Backstory`
- section title: `How [Name] Got Here`

## Performance and Accessibility

Requirements:

- SSR-friendly rendering
- no layout shift when the section loads
- no heavy SVG/graph library dependency
- semantic ordered list structure for milestones
- keyboard focus states for any interactive elements
- `prefers-reduced-motion` respected
- turning point visually indicated by more than color alone

## Analytics

Track at least:

- timeline rendered
- timeline entered viewport
- jump-to-analysis clicked

Nice-to-have:

- milestone card interaction rate
- bounce rate difference between pages with and without timeline

## Implementation Plan

### Phase 1: Data and Render Path

1. Add `life_timeline` column to `blogs_famous_people`
2. Update generated database types
3. Pass `life_timeline` through person-page load
4. Build `LifeTimeline.svelte`
5. Render it on the page in the new slot

### Phase 2: Authoring and Publish Flow

1. Add `life_timeline` to draft frontmatter conventions
2. Update `scripts/personBlogParser.js` to parse and validate it
3. Add admin save support and basic editing UI
4. Update generation prompts and workflow docs

### Phase 3: Migration and Polish

1. Migrate the best existing raw HTML timelines
2. Remove duplicate inline timelines from migrated pages
3. Add motion polish and final visual refinements
4. Add QA coverage for edge cases

## Acceptance Criteria

The feature is complete when:

- a person page can render a dedicated timeline above the article body
- the timeline is driven by structured data, not hand-authored HTML only
- new drafts can store and publish `life_timeline`
- admin can edit and save the field
- the component looks intentional on desktop and mobile
- pages without a timeline degrade cleanly
- existing TOC and hero behavior remain intact

## Main Risks

### Risk 1: Resume-Style Output

If the generator is weak, the component becomes a boring chronology.

Mitigation:

- separate prompt
- strict length rules
- exactly one turning point
- validation against fluff and repetition

### Risk 2: Duplicate Storytelling

If the article already includes a manual timeline, the page can feel repetitive.

Mitigation:

- migrate old pages gradually
- remove duplicate inline timelines when structured data is added

### Risk 3: Placement Confusion With TOC

If the timeline is treated like article prose, it may create TOC and anchor edge cases.

Mitigation:

- keep it page-level in V1
- do not include it in the generated article TOC
- offer a simple `Jump to analysis` affordance instead

## Recommendation

Build this as a structured, page-level `LifeTimeline` feature, not as another markdown styling trick.

That choice best fits the current architecture, gives the page a much stronger onboarding layer for unfamiliar readers, and creates a durable slot in the personality-analysis flow:

1. article
2. timeline
3. page render

That is the version most likely to look "super nice" consistently instead of depending on hand-crafted timeline HTML in individual drafts.
