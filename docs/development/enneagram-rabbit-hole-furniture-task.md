<!-- docs/development/enneagram-rabbit-hole-furniture-task.md -->

# Implementation Task: Enneagram Rabbit Hole Furniture Element

**Status:** Ready to implement
**Scope:** ~30 minutes of work — one SCSS addition + one guide entry + one validation pass
**Owner:** DJ
**Created:** 2026-04-16

---

## Why this exists

Personality analysis blogs walk a tightrope. General readers want a compelling profile — they don't want to wade through wing/subtype/arrow debate. Hardcore Enneagram readers want exactly that depth and bounce if they don't get it. The strat doc (`9takes-strat.md` Part 4) also wants long-tail LLM fan-out queries (`[Person] 3w4`, `[Person] sx/so subtype`, `[Person] integration to type 7`) covered on the page.

The Enneagram Rabbit Hole solves all three: a single collapsed `<details>` block placed after the main type analysis. Casuals scroll past. Power readers open it. Search engines and LLMs index everything inside.

It is the **only** place wing/subtype/arrow content lives in a celebrity blog (see `blog_content_creator_people_v2.md` → "The Distribution Rule").

---

## What you're building

A new CSS-only HTML furniture element following the existing 9takes pattern (think `.aside-box`, `.contrast-panel`, `.source-card`). It works in both MDsvex and database-rendered pages — no Svelte component, no imports.

The element is a styled `<details>` accordion with a rabbit emoji + cyan-teal accent that signals "advanced material — opt in." Inside it has four required sub-sections (Wing, Subtype, Arrows, Counterarguments).

---

## How existing furniture elements work (precedent)

All HTML furniture lives in `src/scss/blog.scss`. The pattern across `.aside-box`, `.contrast-panel`, `.source-card`, `.timeline`, `.pull-quote`:

- Pure HTML + CSS class — no Svelte component
- Rendered via `{@html post.content}` in `src/routes/personality-analysis/[slug]/+page.svelte:384` after server-side `marked` processing in `src/lib/server/blogContentProcessor.ts`
- Uses CSS variables from the design tokens (`--bg-surface`, `--text-primary`, `--primary-light`, etc.)
- BEM-ish naming: `.aside-box` + `.aside-box__title`
- Mobile adjustments live in a separate `@include mobile { … }` block at the bottom of `blog.scss`

The base `<details>` + `<summary class="accordion">` styling is already defined globally in `src/scss/index.scss:718` and `src/scss/index.scss:741`. The new class wraps and overrides those defaults.

---

## Implementation

### Step 1 — Add SCSS to `src/scss/blog.scss`

Add this block alongside the other furniture elements (after `.aside-box` is a good spot, around line 626). Then add the matching mobile override inside the existing `@include mobile { … }` block.

```scss
/* ============================================
 * Enneagram Rabbit Hole - opt-in deep dive for Wings/Subtypes/Arrows
 * Used in /personality-analysis/ blogs after the main type analysis.
 * Casuals scroll past it. Power readers open it. LLMs index inside it.
 * ============================================ */
.enneagram-rabbit-hole {
	margin: 2.5rem 0;
	border-radius: 12px;
	background: linear-gradient(
		180deg,
		color-mix(in srgb, var(--primary) 6%, var(--bg-surface)) 0%,
		var(--bg-surface) 100%
	);
	border: 1px solid color-mix(in srgb, var(--primary) 25%, transparent);
	padding: 0;
	overflow: hidden;
	transition: border-color 0.2s ease;

	&:hover {
		border-color: color-mix(in srgb, var(--primary) 40%, transparent);
	}

	/* Override the default .accordion summary chrome */
	> summary.accordion {
		padding: 1rem 1.25rem 1rem 3rem;
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary);
		background: transparent;
		position: relative;
		list-style: none;

		&::-webkit-details-marker {
			display: none;
		}

		&::before {
			content: '🐇';
			position: absolute;
			left: 1rem;
			top: 0.95rem;
			font-size: 1.15rem;
			line-height: 1;
		}

		&::after {
			content: '+';
			position: absolute;
			right: 1.25rem;
			top: 50%;
			transform: translateY(-50%);
			font-size: 1.4rem;
			color: var(--primary-light);
			transition: transform 0.2s ease;
			line-height: 1;
		}

		&:hover {
			background: color-mix(in srgb, var(--primary) 8%, transparent);
			color: var(--primary-light);
		}
	}

	&[open] > summary.accordion::after {
		content: '−';
	}

	/* The opt-in framing line at the top of the panel */
	> .panel > p:first-child em,
	> .panel > .rabbit-hole__intro {
		display: block;
		font-size: 0.85rem;
		color: var(--text-tertiary);
		font-style: italic;
		margin: 0 0 1rem;
		padding: 0.5rem 0.75rem;
		background: color-mix(in srgb, var(--text-tertiary) 8%, transparent);
		border-left: 2px solid color-mix(in srgb, var(--primary) 30%, transparent);
		border-radius: 4px;
	}

	> .panel {
		padding: 0 1.25rem 1.25rem;
		font-size: 0.95rem;
		line-height: 1.7;

		h3 {
			font-size: 1.05rem;
			font-weight: 700;
			color: var(--text-primary);
			margin: 1.5rem 0 0.5rem;
			padding-bottom: 0.35rem;
			border-bottom: 1px solid color-mix(in srgb, var(--primary) 18%, transparent);

			&:first-of-type {
				margin-top: 0.25rem;
			}
		}

		p {
			margin: 0 0 0.85rem;
			color: var(--text-secondary);
		}

		a {
			color: var(--primary-light);
			text-decoration: underline;
			text-underline-offset: 2px;

			&:hover {
				color: var(--primary);
			}
		}
	}
}

/* Mobile — add inside the existing @include mobile { … } block in blog.scss */
@include mobile {
	.enneagram-rabbit-hole {
		margin: 1.75rem -0.25rem;
		border-radius: 10px;

		> summary.accordion {
			padding: 0.875rem 2.5rem 0.875rem 2.75rem;
			font-size: 0.95rem;

			&::before {
				left: 0.85rem;
			}

			&::after {
				right: 1rem;
			}
		}

		> .panel {
			padding: 0 1rem 1rem;
			font-size: 0.9rem;

			h3 {
				font-size: 1rem;
			}
		}
	}
}
```

**Why this design fits the system:**

- Uses the same `color-mix(in srgb, var(--primary) X%, transparent)` pattern as `.aside-box`
- Reuses the existing `.accordion` summary class (no duplicate behavior)
- Custom `+` / `−` indicator replaces the default `<details>` triangle for a cleaner look (precedent: many of the existing one-offs hide `::-webkit-details-marker`)
- Cyan-teal accent ties to the brand primary (`--primary`) so it doesn't compete with `.aside-box` (info-blue) or `.pull-quote` (neutral)
- Mobile shrinks padding and bumps font sizes down — consistent with how `.aside-box` and `.source-card` handle small screens

---

### Step 2 — Add an entry to `docs/content-generation/blog-furniture-guide.md`

Insert this block in the "CSS Furniture Elements" section, after the `.aside-box` entry (~line 626). This is the spec writers will copy from.

```markdown
### Enneagram Rabbit Hole — `.enneagram-rabbit-hole`

**Best for**: Celebrity personality analysis blogs only. The single collapsed deep-dive block where wing, subtype, and arrow analysis live. Casual readers scroll past. Power readers open it. LLMs and search engines index everything inside.

**Required structure** — must include all four sub-sections in this order:

\`\`\`html

<details class="enneagram-rabbit-hole">
<summary class="accordion">Enneagram Rabbit Hole: Wings, Subtypes &amp; Connecting Lines for [Person]</summary>
<div class="panel">

<p><em>For the Enneagram nerds. Skip if you're not deep into the system — the rest of the analysis stands on its own.</em></p>

### [Person]'s Wing: [X]w[Y]

[2–3 paragraphs analyzing the wing call. Specific behavioral evidence. Link <a href="/enneagram-corner/enneagram-wings-complete-guide">wings</a> once.]

### [Person]'s Instinctual Subtype: [sp/so/sx]

[2–3 paragraphs on the dominant instinct. Evidence from how they spend time + what they fight for. Link <a href="/enneagram-corner/enneagram-instinctual-subtypes">instinctual subtypes</a> once.]

### Stress and Growth Arrows

[1–2 paragraphs. Under stress, do we see Type [stress arrow] patterns? When healthy, Type [growth arrow]? Cite specific moments.]

### Counterarguments: Why [Person] Might Not Be Type X

[1–2 paragraphs. Honestly engage the strongest alternate type case. Signals epistemic honesty to LLMs and serves the "[Person] type X or type Y" fan-out query.]

</div>
</details>
\`\`\`

**Rules:**

- **One per blog**, placed after the main `What is [Person]'s personality type?` H2 section, before the next narrative section
- **All four sub-sections required** — Wing, Subtype, Arrows, Counterarguments
- **Word budget: 400–700 inside the block.** Substantive but not a second blog
- **Frame paragraph required** — the italicized "For the Enneagram nerds…" line. This is what tells casual readers it's safe to skip and makes the body of the blog work for general audiences
- **Link out, don't re-explain** — each sub-section links to the relevant `/enneagram-corner/` pillar once. Do not re-define what a wing or subtype is
- **No further wing/subtype/arrow jargon in the rest of the blog body.** The Distribution Rule keeps it sealed in here
```

Also update the "Usage Guide → Celebrity personality blogs should also have" checklist at the bottom of the file to add:

```markdown
- `.enneagram-rabbit-hole` for the wing/subtype/arrow deep dive (one per blog, after main type analysis)
```

---

### Step 3 — Validation

Once the SCSS is in place, validate against a real blog before rolling out broadly.

**3a. Pick a published personality blog as the test bed.**

Recommend a Type 5 or Type 8 with a reasonably clean wing call — easier to write a tight rabbit hole. Suggested candidates: `Elon-Musk`, `Peter-Thiel`, `Taylor-Swift`. Edit the blog content directly in `/admin/content-board` or the underlying record in `blogs_famous_people`.

**3b. Insert a hand-written rabbit hole** following the structure above. Place it after the H2 `What is [Person]'s personality type?` section.

**3c. Visual checks** at `/personality-analysis/[slug]`:

- Collapsed state: cyan-teal bordered box with the 🐩 → wait, 🐇 (rabbit) emoji and the `+` indicator on the right
- Hover state: border brightens, `+` glows
- Open state: `+` becomes `−`, panel reveals with the italic frame line at the top
- Sub-section H3s have a subtle bottom border
- Internal links inside the panel use `--primary-light` and underline correctly
- Mobile (≤640px): padding shrinks, font sizes drop, no horizontal overflow

**3d. SEO/AEO checks** (the whole point):

- View page source — confirm all rabbit hole content is present in the initial HTML (it is — `<details>` is server-rendered, content lives in DOM regardless of open state)
- Run the page through Google's Rich Results Test — confirm the existing `Article` schema still validates and dates haven't broken
- Manual LLM check — paste the rendered URL into Claude/ChatGPT/Perplexity and ask "What is [Person]'s wing and instinctual subtype?" Confirm the model can pull the answer from inside the rabbit hole

**3e. Copywriting check** — the body of the blog should now read cleaner. If you can find any paragraph in the main body that argues wing/subtype/arrow, move it into the rabbit hole.

---

## Rollout plan

1. **Today:** Steps 1 + 2 (SCSS + guide entry) — ~20 minutes
2. **This week:** Step 3 on one test blog — ~30 minutes
3. **Next week:** Update the v2 command's reference (already done in `.claude/commands/blog_content_creator_people_v2.md` — Step 6 furniture pass + Quality Checklist hard gate). Confirm the next blog generated by `daily-blog-creator` ships with the rabbit hole automatically
4. **Following 2 weeks:** Retrofit rabbit hole onto top 10 traffic personality pages (pair with Tier 0 #1 in `9takes-strat.md`). Pull the priority list from `blogs_famous_people` ordered by analytics views

---

## Files touched

| File                                                | Change                                               |
| --------------------------------------------------- | ---------------------------------------------------- |
| `src/scss/blog.scss`                                | Add `.enneagram-rabbit-hole` block + mobile override |
| `docs/content-generation/blog-furniture-guide.md`   | Add furniture entry + update usage guide checklist   |
| `src/blog/people/drafts/[Test-Person].md` or DB row | Test insertion (validation only)                     |

No new components, no new routes, no migration. Pure CSS + content pattern.

---

## Out of scope

- Building a Svelte component wrapper — unnecessary, this is HTML+CSS only
- Programmatic auto-generation of rabbit hole content from existing blogs — separate task, not blocking this one
- JSON-LD `FAQPage` schema derived from the four sub-sections — separate task (Tier 0 #3 in `9takes-strat.md`)
- Backfilling all 800+ personality pages — only retrofit the top 10 traffic pages first, then revisit based on what the LLM citation monitor (Tier 1 #5) shows
