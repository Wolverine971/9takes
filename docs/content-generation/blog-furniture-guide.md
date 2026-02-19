<!-- docs/content-generation/blog-furniture-guide.md -->

# Blog Furniture Guide

Reference for all visual elements, components, and structural patterns used to break up text and add information in 9takes blog posts. "Furniture" means anything beyond plain paragraphs — callout boxes, accordions, image cards, embedded media, structural wrappers, and formatting conventions.

**Important context**: Celebrity blogs at `/personality-analysis/` render from the database via a dedicated page component that auto-includes certain elements (`PopCard` hero image, `BlogPurpose` component, JSON-LD schema). The furniture listed here is what goes _inside_ the blog content itself.

---

## Svelte Components

These are imported via `<script>` blocks in MDsvex files. Each renders a styled, interactive element.

### QuickAnswer

**Path**: `$lib/components/blog/callouts/QuickAnswer.svelte`
**Usage**: ~90 files | **Best for**: SEO-optimized featured snippet at top of article

A dark-themed callout box with a purple left accent, question icon, and "Quick Answer" label. Designed to win Google's featured snippet for the article's primary question. Has Schema.org `Answer` markup built in.

**Props**:

- `question` (string, optional) — The question to display
- `variant` (`'default'` | `'subtle'`, default: `'default'`) — `'default'` = purple gradient, `'subtle'` = neutral gray

```html
<QuickAnswer question="Why do world leaders constantly misunderstand each other?">
	Each Enneagram type has a distinct way of processing conflict. Type 3s become image-obsessed. Type
	8s escalate. The pattern: normal personality defenses pushed to extremes.
</QuickAnswer>
```

**Note for celebrity blogs**: The `/personality-analysis/` page template auto-handles this component — do NOT import it in celebrity blog markdown files. It IS used directly in MDsvex files for enneagram, community, and guide blogs.

---

### PopCard

**Path**: `$lib/components/atoms/PopCard.svelte`
**Usage**: ~81 files | **Best for**: Visual image cards, inline teasers

An image card with hover effects (text scramble animation, Enneagram type overlay on hover). Used as a visual break or navigational teaser within blog content.

**Props**:

- `image` (string) — Image path (e.g., `/blogs/dark-triad.webp`)
- `showIcon` (boolean, default: `true`) — Show the 9takes rubix icon
- `displayText` (string) — Text overlay on card
- `subtext` (string) — Secondary text
- `scramble` (boolean, default: `true`) — Enable text scramble animation on hover
- `enneagramType` (number, 0-9) — Show Enneagram overlay on hover
- `altText` (string) — Alt text for the image
- `aspectRatio` (string, default: `'10 / 16'`) — CSS aspect ratio
- `tint` (boolean, default: `true`) — Enable tint on hover
- `lazyLoad` (boolean, default: `true`) — Lazy load the image
- `priority` (boolean, default: `false`) — Set `fetchpriority="high"` for LCP images

**Standard usage pattern** (wrapped in blog-link div):

```html
<div class="blog-link" style="display: flex; justify-content: center; margin: 1rem 0;">
  <PopCard
    image={`/blogs/dark-triad-chalk-board.webp`}
    showIcon={false}
    subtext=""
    displayText=""
    scramble={false}
  />
</div>
```

---

### MarqueeHorizontal

**Path**: `$lib/components/atoms/MarqueeHorizontal.svelte`
**Usage**: ~78 files | **Best for**: Internal cross-linking, related content navigation

A horizontally scrolling link carousel with fade edges. Includes Schema.org WebPageElement markup. Supports predefined themes for common link sets.

**Props**:

- `displayList` (array of `{name: string, link: string}`) — Custom link items
- `theme` (`'types'` | `'relationships'` | `'workplace'` | `'growth'` | `'custom'`, default: `'custom'`) — Use a predefined link set instead of custom list
- `speed` (number, default: `30`) — Seconds for one full rotation
- `noMove` (boolean, default: `false`) — Pause animation

**Standard usage** (custom list, wrapped in scroll-fade):

```html
<div class="scroll-fade">
  <MarqueeHorizontal displayList={[
    {name: 'at a party', link: '/enneagram-corner/enneagram-types-at-party'},
    {name: 'in stress', link: '/enneagram-corner/enneagram-types-in-stress'},
    {name: 'being toxic', link: '/enneagram-corner/toxic-traits-of-each-enneagram-type'}
  ]} />
</div>
```

**Theme-based usage** (no custom list needed):

```html
<div class="scroll-fade">
	<MarqueeHorizontal theme="relationships" />
</div>
```

Available themes: `types` (all 9 types), `relationships` (dating/communication), `workplace` (career/teams), `growth` (stress/development).

---

### TypeQuotes

**Path**: `$lib/components/blog/callouts/TypeQuotes.svelte`
**Usage**: ~7 files | **Best for**: Showing how different Enneagram types express the same thing

A multi-quote panel with color-coded type badges. Each quote gets a left border in its type's color and a hover effect. Dark themed.

**Props**:

- `title` (string, optional) — Heading for the quote group
- `quotes` (array of `{type: number, quote: string, note?: string}`) — The quotes to display
- `variant` (`'default'` | `'subtle'` | `'minimal'`, default: `'default'`) — Visual style

```html
<TypeQuotes
  title="What each type says to avoid real growth work"
  quotes={[
    { type: 1, quote: "I don't need to change. I just need everyone else to do things correctly." },
    { type: 2, quote: "I'm fine. Let's talk about how I can help YOU.", note: "Deflecting from their own needs" },
    { type: 3, quote: "Self-reflection? I'll schedule that after I finish these 47 goals." },
    { type: 9, quote: "I'll think about that later.", note: "Later never comes" }
  ]}
/>
```

---

### InsightBox

**Path**: `$lib/components/blog/callouts/InsightBox.svelte`
**Usage**: 2 files | **Best for**: Highlighting a key insight, tip, warning, or discovery

A callout box with a colored left accent bar. Tone controls the color.

**Props**:

- `title` (string, optional) — Box heading
- `tone` (`'success'` | `'info'` | `'warning'` | `'neutral'`, default: `'success'`) — Color accent: green/purple/amber/gray

```html
<InsightBox title="The Relaxation Discovery" tone="success">
	<p>
		Many Ones describe a pivotal realization: relaxation and enjoyment aren't guilty pleasures to be
		earned. They're essential to doing their best work.
	</p>
</InsightBox>
```

---

### VisualMetaphor

**Path**: `$lib/components/blog/callouts/VisualMetaphor.svelte`
**Usage**: 2 files | **Best for**: Presenting an analogy, mental model, or conceptual framework

A cyan-accented callout box with an info icon badge. Designed for named metaphors that illuminate a psychological pattern.

**Props**:

- `title` (string, optional) — The metaphor name

```html
<VisualMetaphor title="The Efficiency Operating System">
	<p>
		Type 3s process emotions through an internal operating system that automatically categorizes
		feelings into "productive" vs. "unproductive." Joy after a win? Productive — allowed. Grief
		after a loss? Unproductive — scheduled for later (and later never comes).
	</p>
</VisualMetaphor>
```

---

### Checklist

**Path**: `$lib/components/blog/callouts/Checklist.svelte`
**Usage**: 1 file | **Best for**: Self-assessment checklists, action item lists

An interactive checklist with checkable items. Items get a strikethrough when checked. Dark themed with purple accents.

**Props**:

- `title` (string, optional) — Checklist heading
- `items` (string array) — Checklist items (supports HTML in template literals)
- `note` (string, optional) — Footnote text below the checklist

```html
<Checklist
  title="Are You a Type 6? Self-Assessment Checklist"
  items={[
    `You run "what if" scenarios automatically — not because you want to worry, but because not preparing feels reckless.`,
    `Loyalty is non-negotiable. You'd rather stick with difficult people you trust than easy people you don't.`,
    `You test people before you trust them. Not maliciously — you just need to know they're real.`
  ]}
/>
```

---

### FamousTypes

**Path**: `$lib/components/molecules/FamousTypes.svelte`
**Usage**: ~10 files | **Best for**: Showing a list of famous people for a given Enneagram type

Renders a linked list of famous people from the `famousTypes.ts` data file. Published entries link to their `/personality-analysis/` page.

**Props**:

- `type` (number, 1-9) — The Enneagram type to display

```html
<FamousTypes type="{6}" />
```

---

### DateTip

**Path**: `$lib/components/atoms/DateTip.svelte`
**Usage**: ~9 uses (one article) | **Best for**: Dating advice callouts

A blue-accented tip box with a lightbulb icon prefix. Simple slot-based content.

```html
<DateTip>
	Show up on time. Dress well. Engage on values. And acknowledge their planning efforts rather than
	calling them "uptight."
</DateTip>
```

---

## HTML Structural Patterns

These are raw HTML elements with specific CSS classes used directly in markdown files. No imports needed.

### Drop Cap — `<p class="firstLetter">`

**Usage**: ~288 files | **Required for**: Opening paragraph of every blog post

Renders an enlarged, styled first letter. Always use on the first substantive paragraph.

```html
<p class="firstLetter">His mother has her weekly canvassing shift on Sunday.</p>
```

---

### Accordion — `<details>` + `<summary class="accordion">` + `<div class="panel">`

**Usage**: ~188 sets | **Best for**: TL;DR sections, collapsible supplementary content

The core collapsible pattern. Used universally for TL;DR sections in celebrity blogs.

```html
<details>
	<summary class="accordion">TL;DR: Why Person is an Enneagram Type X</summary>
	<div class="panel">
		<ul>
			<li><b>Point 1:</b> Brief description of the pattern</li>
			<li><b>Point 2:</b> Brief description of the pattern</li>
			<li><b>Point 3:</b> Brief description of the pattern</li>
		</ul>
	</div>
</details>
```

**Rules**: Keep the TL;DR as a teaser, not a full summary. 3-5 bullet points max. Use `<b>` for the lead-in phrase, not `<strong>`.

---

### Section Wrapper — `<section class="section-content">` or `<article class="section-content">`

**Usage**: ~362 combined | **Best for**: Dividing long articles into logical chunks

Wraps major content sections for consistent padding and spacing. Both `<section>` and `<article>` tags work.

```html
<section class="section-content">## Section Heading Content goes here...</section>
```

Can include an `id` for jump links: `<section class="section-content" id="type1">`.

---

### YouTube Embed — `<div class="iframe-container">` + `<iframe>`

**Usage**: ~35 files | **Best for**: Embedding interview clips, podcast appearances

Responsive 16:9 video container. Always use this wrapper — never a bare `<iframe>`.

```html
<div class="iframe-container">
	<iframe
		width="560"
		height="315"
		loading="lazy"
		src="https://www.youtube.com/embed/VIDEO_ID"
		title="Descriptive title of the video"
		frameborder="0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
	></iframe>
</div>
```

---

### Scrollable Table — `<div class="scroll-table">`

**Usage**: ~15 files | **Best for**: Wide data tables that overflow on mobile

Wraps a markdown pipe table to enable horizontal scrolling on small screens.

```html
<div class="scroll-table">
	| Type | Role | Ego fixation | Holy idea | | ---- | ---- | ------------ | --------- | | 1 |
	Reformer | Resentment | Perfection | | 2 | Helper | Flattery | Freedom |
</div>
```

**Note**: Leave a blank line between the `<div>` tag and the pipe table — MDsvex needs this to parse the markdown correctly.

---

### Blockquote

**Usage**: ~886 lines | **Best for**: Pull quotes, attributed quotes, disclaimers

Standard markdown blockquotes. Used for direct quotes, attributed statements, and disclaimer notices.

```markdown
> "On my own island or on my own ranch, I can think the thoughts I want to think."
>
> Jeffrey Epstein, 2003 interview
```

For disclaimers:

```markdown
> **Disclaimer:** This analysis is observational and speculative, based on publicly available information.
```

---

### Horizontal Rule

**Usage**: ~799 occurrences | **Best for**: Visual divider between major sections

Standard markdown `---`. Use between top-level sections for visual breathing room.

---

### Twitter Embed

**Usage**: ~28 occurrences | **Best for**: Embedding relevant tweets as evidence

Standard Twitter embed code. Include the widget script.

```html
<blockquote class="twitter-tweet">
	<p lang="en" dir="ltr">Tweet text here...</p>
	&mdash; Author Name (@handle)
	<a href="https://twitter.com/...">Date</a>
</blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
```

---

### Centered Image — `<img>` with flex wrapper

**Usage**: ~42 instances | **Best for**: Enneagram diagrams, supplementary images

For images that aren't the hero/featured image (which is handled by the page template).

```html
<p style="display: flex; justify-content: center;">
	<img loading="lazy" src="/blogs/4-1.png" class="arrow-img" alt="one going to four in stress" />
</p>
```

For images with captions, use `<figure>`:

```html
<figure style="display: flex; flex-direction: column; align-items: center; margin: 0">
	<img
		loading="lazy"
		src="/blogs/image.webp"
		alt="description"
		style="width: clamp(200px, 500px, 100%);"
	/>
	<figcaption>
		<cite>Caption text <a class="external-link" href="https://...">source</a></cite>
	</figcaption>
</figure>
```

---

## Markdown Formatting

Standard markdown elements used as furniture throughout.

### Pipe Tables

Used extensively for structured data. Wrap in `<div class="scroll-table">` if the table is wide.

```markdown
| Type | Characteristic | Fear          |
| ---- | -------------- | ------------- |
| 1    | Perfectionist  | Being corrupt |
| 2    | Helper         | Being unloved |
```

### Bold as Sub-Heading

`**Bold text**` is frequently used as a de facto sub-heading within sections when a full `###` heading would be too heavy.

### Inline Links

- **Inside HTML tags** (`<p>`, `<div>`, `<details>`, `<li>`): Use `<a href="/path">text</a>`
- **In plain markdown**: Use `[text](/path)`

---

## CSS Furniture Elements (HTML classes — no imports needed)

These are pure HTML elements styled by CSS classes in `src/scss/blog.scss`. They work everywhere — MDsvex blogs AND database-rendered celebrity blogs (via `{@html}`). No Svelte imports required.

### Pull Quote — `.pull-quote`

**Best for**: Elevating a powerful quote out of prose to give it visual weight.

A centered, italicized block with top/bottom accent borders and a large decorative open-quote mark. Use when a quote deserves to be the visual anchor of a section.

```html
<div class="pull-quote">
	"I'm not interested in being liked. I'm interested in being effective."
</div>
```

**Rules**: Don't duplicate — if you pull a quote out, remove it from the surrounding paragraph. One pull quote per 3-4 sections max.

---

### Key Stat / Big Number — `.key-stat`

**Best for**: Making a single striking number impossible to miss. Career stats, records, financial figures.

Displays a large number with a smaller label beneath it. Use `.key-stat-row` to show 2-3 stats side by side.

```html
<!-- Single stat -->
<div class="key-stat">
	<span class="key-stat__number">47</span>
	<span class="key-stat__label">films in 44 years</span>
</div>

<!-- Multiple stats in a row -->
<div class="key-stat-row">
	<div class="key-stat">
		<span class="key-stat__number">$2.4B</span>
		<span class="key-stat__label">worldwide box office</span>
	</div>
	<div class="key-stat">
		<span class="key-stat__number">3</span>
		<span class="key-stat__label">Oscar nominations</span>
	</div>
	<div class="key-stat">
		<span class="key-stat__number">12</span>
		<span class="key-stat__label">years of martial arts training</span>
	</div>
</div>
```

**Rules**: Stats must be specific and sourced. Round numbers are fine but don't fabricate. Use sparingly — 1-2 per blog.

---

### Inner Monologue / Thought — `.inner-thought`

**Best for**: Imagining what someone was likely thinking in a key moment. Adds psychological intimacy.

A dark panel with a thought-bubble emoji prefix and italic text. Use to bridge from external behavior to internal experience.

```html
<p class="inner-thought">
	If I stop moving, they'll see there's nothing underneath. So I don't stop.
</p>
```

**Rules**: Must be grounded in evidence (quotes, interviews, known behavior patterns). Don't invent thoughts with no basis. Use 1-2 per blog.

---

### Timeline / Life Arc — `.timeline`

**Best for**: Chronological sequences — career milestones, a pivotal year, the escalation of a pattern.

A vertical line with dot markers for each event. Use `.timeline__item--key` to highlight the most important moment.

```html
<div class="timeline">
	<div class="timeline__item">
		<span class="timeline__year">1998</span>
		<span class="timeline__event">Drops out of Stanford after two days</span>
	</div>
	<div class="timeline__item timeline__item--key">
		<span class="timeline__year">2002</span>
		<span class="timeline__event">SpaceX founded — bets entire PayPal fortune</span>
	</div>
	<div class="timeline__item">
		<span class="timeline__year">2008</span>
		<span class="timeline__event"
			>Three rocket failures. Tesla near bankruptcy. Divorce finalized.</span
		>
	</div>
	<div class="timeline__item">
		<span class="timeline__year">2012</span>
		<span class="timeline__event">Dragon docks with ISS — first private spacecraft</span>
	</div>
</div>
```

**Rules**: 4-7 items is the sweet spot. Every item should be a single punchy line, not a paragraph. Use `.timeline__item--key` on exactly one item — the turning point.

---

### Contrast Panel — `.contrast-panel`

**Best for**: Side-by-side comparisons — public vs. private self, what they say vs. what they do, before vs. after.

A two-column grid with distinct left/right styling. Each side gets a label header.

```html
<div class="contrast-panel">
	<div class="contrast-panel__side contrast-panel__side--left">
		<div class="contrast-panel__label">What She Says</div>
		<p>"I don't care what people think of me."</p>
	</div>
	<div class="contrast-panel__side contrast-panel__side--right">
		<div class="contrast-panel__label">What She Does</div>
		<p>
			Spends 3 hours crafting every Instagram caption. Deletes tweets that get fewer than 100 likes.
		</p>
	</div>
</div>
```

**Rules**: The contrast should be genuinely revealing, not a cheap gotcha. Works best when it illuminates the core tension.

---

### Source Card — `.source-card`

**Best for**: Citing a specific podcast, interview, or article that a key insight comes from.

A styled citation block with an icon, title, meta info, and optional pull-quote from the source.

```html
<div class="source-card">
	<span class="source-card__icon">🎙️</span>
	<div>
		<div class="source-card__title">The Joe Rogan Experience #1470</div>
		<div class="source-card__meta">March 2023 · 2h 45m</div>
		<div class="source-card__note">
			"The moment he talks about his father is the only time in three hours he breaks eye contact."
		</div>
	</div>
</div>
```

**Icons to use**: `🎙️` podcast, `📺` video/TV, `📰` article, `📖` book, `🎤` interview

**Rules**: Use for sources that genuinely shaped your analysis, not every citation. 1-3 per blog.

---

### Dialogue Exchange — `.dialogue`

**Best for**: Recreating a revealing conversation — interview moments, reported exchanges, courtroom testimony.

A back-and-forth format with speaker labels and an optional context line.

```html
<div class="dialogue">
	<div class="dialogue__line">
		<span class="dialogue__speaker">Interviewer</span>
		<span class="dialogue__text">Do you ever feel like you're performing?</span>
	</div>
	<div class="dialogue__line">
		<span class="dialogue__speaker">Person</span>
		<span class="dialogue__text">Performing what?</span>
	</div>
	<div class="dialogue__line">
		<span class="dialogue__speaker">Interviewer</span>
		<span class="dialogue__text">Being okay.</span>
	</div>
	<div class="dialogue__line">
		<span class="dialogue__speaker">Person</span>
		<span class="dialogue__text">[long pause] ...Define "okay."</span>
	</div>
	<p class="dialogue__context">— Late Night with Seth Meyers, November 2023</p>
</div>
```

**Rules**: Must be based on real exchanges (interviews, documented conversations). Don't fabricate dialogue. Keep to 3-6 lines — it's a moment, not a transcript.

---

### Aside / Tangent Box — `.aside-box`

**Best for**: Supplementary context that enriches the narrative but would break the flow if inline. Enneagram theory notes, historical context, "fun fact" asides.

A bordered box with an optional title, offset from the main text.

```html
<div class="aside-box">
	<div class="aside-box__title">The Type 5 Withdrawal Pattern</div>
	<p>
		When Fives feel emotionally overwhelmed, they don't lash out — they disappear. They retreat into
		their minds, reduce external contact, and process privately. This can look like coldness, but
		it's actually a survival mechanism: they're conserving the limited emotional energy they believe
		they have.
	</p>
</div>
```

**Rules**: Keep asides short (1-3 paragraphs). If it's more than that, it belongs in the main text. Title is optional — omit it for quick tangential notes.

---

## One-Off Specialty Layouts

These patterns appear in specific articles. They use custom CSS classes defined in the article's `<style>` block or in global SCSS. Consider extracting to components if reused.

| Pattern                                                                           | Article                                     | Purpose                                             |
| --------------------------------------------------------------------------------- | ------------------------------------------- | --------------------------------------------------- |
| `type-card` grid with `type-badge`, `inner-dialogue`, `reframe-box`, `action-box` | guide-to-fighting-depression.md             | 9 type-specific cards with problem/solution columns |
| `flags` with `green-flags` / `red-flags`                                          | enneagram-types-on-a-first-date.md          | Two-column pros/cons layout                         |
| `pattern-flow` with `pattern-step` + `pattern-arrow`                              | guide-to-fighting-depression.md             | Visual step-flow diagram                            |
| `quick-nav` with `type-buttons`                                                   | enneagram-types-on-a-first-date.md          | Jump-to-type anchor navigation                      |
| `table-of-contents`                                                               | using-the-enneagram-for-self-development.md | In-article table of contents                        |
| `influencer-grid` / `influencer-card`                                             | enneagram-books-websites-podcasts.md        | People cards with social icons                      |
| `cta-section` / `cta-button`                                                      | various guides                              | Call to action for `/book-session`                  |
| Tailwind utility-class styled boxes                                               | neurodiversity, first-impression articles   | Ad-hoc callout boxes using Tailwind                 |
| Inline `linear-gradient` styled divs                                              | mbti-vs-enneagram, dating guide             | Dark-themed pull quote boxes                        |

---

## Usage Guide: Which Furniture to Use When

### Every blog post should have:

- `<p class="firstLetter">` on the opening paragraph
- `---` horizontal rules between major sections

### Celebrity personality blogs should also have:

- `<details>/<summary class="accordion">` for TL;DR section
- 2-5 internal links (see linking rules in blog_content_creator_people.md)
- 2-4 CSS furniture elements from the section above (pull quotes, timelines, contrast panels, etc.)

### Enneagram educational blogs should also have:

- `<QuickAnswer>` at the top (imported via `<script>`)
- `<MarqueeHorizontal>` for related content navigation (wrapped in `<div class="scroll-fade">`)
- `<PopCard>` for visual breaks when appropriate
- `<div class="scroll-table">` around any wide tables

### When writing about multiple Enneagram types:

- `<TypeQuotes>` for showing how types differ in expressing the same thing
- `<FamousTypes type={X}>` for listing known examples of a type
- `<Checklist>` for "Am I this type?" self-assessments

### When explaining a concept or framework:

- `<InsightBox>` for key realizations or discoveries
- `<VisualMetaphor>` for named analogies or mental models

### When breaking up long text sections (works everywhere, including celebrity blogs):

- `.pull-quote` — Elevate a powerful quote out of the prose
- `.key-stat` / `.key-stat-row` — Highlight a striking number or stat
- `.inner-thought` — Imagine what someone was thinking in a key moment
- `.timeline` — Show a chronological sequence of events
- `.contrast-panel` — Side-by-side comparison (public vs. private, says vs. does)
- `.source-card` — Cite a specific podcast, interview, or article
- `.dialogue` — Recreate a revealing conversation exchange
- `.aside-box` — Supplementary context that would break flow if inline

### When embedding media:

- YouTube: Always use `<div class="iframe-container">` wrapper
- Tweets: Use native Twitter embed with widget script
- Images: Use flex-centered `<img>` with `loading="lazy"`

---

## Component Import Template

For MDsvex blog files that need Svelte components (enneagram, community, and guide blogs — NOT celebrity blogs):

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
	import DateTip from '$lib/components/atoms/DateTip.svelte';
</script>
```

Only import what you use.
