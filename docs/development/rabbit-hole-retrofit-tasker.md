<!-- docs/development/rabbit-hole-retrofit-tasker.md -->

# Tasker: Enneagram Rabbit Hole Retrofit

**For:** the agent assigned to execute retrofits.
**Owner:** DJ
**Created:** 2026-04-17

> **Read this whole doc before touching a file.** The work is simple mechanically but has three rules that are easy to break: the Distribution Rule, the Placement Rule, and the Frame-Line Rule. Breaking any one of them ships a worse page than the one you started with.

---

## 0. Mission in one paragraph

9takes celebrity personality analysis pages have two audiences that want opposite things. General readers want a compelling narrative profile — they leave the moment they hit wing/subtype/arrow jargon. Hardcore Enneagram readers want exactly that depth and leave when it's absent. The **Enneagram Rabbit Hole** is a single collapsed `<details>` block that quarantines all the deep-system typology content (wings, instinctual subtypes, integration/disintegration arrows, counter-typing / alternate-type arguments) into one opt-in section. Casuals scroll past. Power users open it. LLMs and search engines index everything inside regardless of open/closed state.

Your job: **find the wing/subtype/arrow/counter-typing prose already scattered through a blog, extract it, rewrite it into the rabbit hole's four-section structure, and strip the extracted content from the main body.** Net result: a tighter narrative blog _plus_ a deeper specialist section — not a longer page.

---

## 1. Required reading (open these before starting)

1. **`docs/development/enneagram-rabbit-hole-furniture-task.md`** — the furniture spec. Contains the CSS, the exact HTML structure, placement rules, and the visual/SEO validation checklist.
2. **`docs/content-generation/blog-furniture-guide.md`** → "Enneagram Rabbit Hole — `.enneagram-rabbit-hole`" section — the authoritative HTML template + content rules.
3. **`docs/development/rabbit-hole-retrofit-candidates.md`** — your work queue. Ranked by signal coverage; Tier 4 first, then Tier 3, then cross-referenced top-traffic pages.
4. **`docs/development/rabbit-hole-retrofit-tracker.md`** — update this as you finish pages.
5. **`.claude/commands/blog_content_creator_people_v2.md`** → search for "Distribution Rule" — explains _why_ wing/subtype/arrow jargon must be quarantined.
6. **Reference implementation:** `src/blog/people/drafts/Elon-Musk.md` lines ~141–end. This is the pattern. Copy the shape of it.

---

## 2. The three rules you cannot break

### 2.1 The Distribution Rule

Inside the rabbit hole: wing codes (`5w6`), subtype abbreviations (`sx/sp`), integration/disintegration arrows (`5 → 7`), "countertype" terminology, and explicit jargon are **allowed and expected**.

Outside the rabbit hole: **none of that language appears.** The main body describes behavior in plain English. If the main body currently says:

> "Elon's 5w6 security-seeking shows up in Starlink and Neuralink — insurance bets against system failure. Under stress he disintegrates toward an unhealthy Type 7..."

…rewrite it in the main body as:

> "Elon's security-seeking shows up in Starlink and Neuralink — insurance bets against system failure. Under pressure the careful analysis collapses into scattershot reactivity…"

…and move the `5w6` and `disintegrates toward Type 7` framing _into_ the rabbit hole where the jargon belongs. The plain-English version still works for general readers; the jargon version still works for specialists — now they're in separate rooms.

**Concrete tests for "is this rabbit-hole-only content":**

- Contains a wing code (`\d+w\d+`) → rabbit hole
- Contains `sp/so`, `sx/sp`, `so/sx` etc. → rabbit hole
- Contains the word `countertype` / `counter-type` → rabbit hole
- Uses directional arrow notation (`→ Type N`, `integration to 7`, `disintegration to 2`) → rabbit hole
- Uses the phrase "instinctual subtype" or "dominant instinct" → rabbit hole
- Argues why the person might actually be a _different_ type than the one named in the title → rabbit hole (this is the Counterarguments sub-section)

Narrative descriptions of the same underlying behavior are fine in the main body. Keep the observations; move the labels.

### 2.2 The Placement Rule

The rabbit hole is **never stacked against any other HTML furniture block.** Never place it directly after:

- The TL;DR `<details>` accordion
- Another `<details>` accordion of any kind
- A `.contrast-panel`, `.aside-box`, `.source-card`, `.pull-quote`, `.timeline`, `.dialogue`, `.inner-thought`, `.key-stat`, or `.section-content` block
- A `<QuickAnswer>`, `<PopCard>`, `<InsightBox>`, `<VisualMetaphor>`, `<Checklist>`, `<TypeQuotes>`, or `<MarqueeHorizontal>` Svelte component
- A callout image / featured image / embed

Two pieces of chrome back-to-back look like a broken page and bury the narrative under stacked widgets.

**Where to place it instead:** between two full H2 narrative prose sections, anchored to the narrative beat it amplifies. The best anchor is usually the `## Stress and Growth` section (or whatever the page calls its stress/growth beat) — because that section is where the rabbit hole's arrows content directly continues the main-body argument. Second-best: the H2 that discusses the type's core pattern most explicitly.

**The placement decision tree:**

1. Find every H2 section in the blog.
2. Identify the section(s) that discuss stress/growth behavior, core pattern, or "how this type shows up in this person." These are the candidate anchor sections.
3. Pick the candidate with the most existing wing/subtype/arrow prose inline — that's where the relocated content will feel native.
4. Confirm there are at least **two full prose paragraphs of narrative** between the TL;DR `<details>` (or any earlier furniture block) and your planned insertion point. If not, move further down the page.
5. Confirm there is at least one full H2 narrative section after the rabbit hole too — the rabbit hole should not be the closing beat. If the candidate anchor is the final H2, pick an earlier one.
6. Insert the rabbit hole as its own block **between** the end of the anchor H2's final paragraph and the opening of the next H2.

If no location satisfies all five conditions, the blog is structurally too thin for a rabbit hole retrofit — note this in your output, skip the page, and move on.

### 2.3 The Frame-Line Rule

The very first thing inside `<div class="panel">` is this italicized frame paragraph:

```html
<p>
	<em
		>For the Enneagram nerds. Skip if you're not deep into the system — the rest of the analysis
		stands on its own.</em
	>
</p>
```

This line is what tells general readers that scrolling past is safe and tells specialists they've found the right room. Do not rewrite it to be cuter. Do not remove it. Do not merge it into the summary. It exists to make the body of the blog work for the majority audience.

You may personalize only the subject-specific reference if it improves the read:

- Baseline: "For the Enneagram nerds. Skip if you're not deep into the system — the rest of the analysis stands on its own."
- Acceptable variant: "For Enneagram readers going deep on [Person]. Skip if you're here for the story — the rest of the analysis stands on its own."

Do not go further than this.

---

## 3. Word budget and structure

- **400–700 words total inside the `<div class="panel">`** (excluding the frame line and the four H3 headings). Substantive enough to answer the fan-out sub-queries; not a second blog.
- **All four H3 sub-sections required**, in this exact order:
  1. `### [Person]'s Wing: [X]w[Y]`
  2. `### [Person]'s Instinctual Subtype: [sp/so | sp/sx | sx/sp | sx/so | so/sp | so/sx]`
  3. `### Stress and Growth Arrows`
  4. `### Counterarguments: Why [Person] Might Not Be Type X`
- **Each sub-section is 2–3 short paragraphs** (Arrows and Counterarguments can be 1–2). Use specific behavioral evidence, not abstract theory.
- **Link out, don't re-explain.** Each sub-section links to its relevant `/enneagram-corner/` pillar **once**:
  - Wing → `/enneagram-corner/enneagram-wings-complete-guide`
  - Subtype → `/enneagram-corner/enneagram-instinctual-subtypes`
  - Arrows → `/enneagram-corner/enneagram-integration-disintegration` (or the current live URL — check the sitemap if unsure)
- **No further wing/subtype/arrow jargon in the rest of the blog body.** Strip it.

---

## 4. The exact HTML template

Copy this. Fill in the bracketed sections. Do not restructure.

```html
<details class="enneagram-rabbit-hole">
	<summary class="accordion">
		Enneagram Rabbit Hole: Wings, Subtypes &amp; Connecting Lines for [Person]
	</summary>
	<div class="panel">
		<p>
			<em
				>For the Enneagram nerds. Skip if you're not deep into the system — the rest of the analysis
				stands on its own.</em
			>
		</p>

		### [Person]'s Wing: [X]w[Y] [2–3 paragraphs. Which wing and why. Specific behavioral evidence —
		not generic wing description. Link
		<a href="/enneagram-corner/enneagram-wings-complete-guide">wings</a> once, here or in the next
		paragraph.] ### [Person]'s Instinctual Subtype: [sp/so | sp/sx | sx/sp | sx/so | so/sp | so/sx]
		[2–3 paragraphs on the dominant instinct. Evidence from how they spend time + what they fight
		for + how they stack-rank commitments. Link
		<a href="/enneagram-corner/enneagram-instinctual-subtypes">instinctual subtypes</a> once.] ###
		Stress and Growth Arrows [1–2 paragraphs. Under stress, do we see Type [stress arrow] patterns?
		When healthy, Type [growth arrow]? Cite specific moments and observed behaviors.] ###
		Counterarguments: Why [Person] Might Not Be Type X [1–2 paragraphs. Honestly engage the
		strongest alternate-type case. Name the alternate type explicitly. Signals epistemic honesty to
		LLMs and directly serves the "[Person] type X or type Y" fan-out query.]
	</div>
</details>
```

**Formatting notes:**

- The `<summary>` uses `&amp;` for the ampersand, not `&`.
- Blank lines between H3 sub-sections are required for Markdown-in-HTML parsing to render the headings.
- Do **not** wrap sub-sections in `<section>` or `<article>` tags — the `.panel` div is the container.
- Do **not** add class names to the H3s. Styling is inherited.

---

## 5. Per-blog workflow (do this every time)

### Step 1 — Verify the DB row before editing

The source of truth for published personality pages is `blogs_famous_people`, **not** the draft file in `src/blog/people/drafts/`. Drafts can drift.

- Open `/admin/content-board` in the local dev environment (`pnpm dev`, port 5173) or production.
- Search for `[Person]`.
- If the row is `published=true`, the DB version wins; diff your working draft against it before proceeding.
- If the row is `published=false` or missing, the draft file is the only copy and you can edit it directly.

If DB and draft have diverged meaningfully, **use the DB version as your input** and produce an updated draft file at the end. DJ will push through `/admin/content-board`.

### Step 2 — Locate and inventory the jargon in the current body

Search the blog's current content for every instance of:

- Wing codes: `\d+w\d+`
- Wing word: `\bwing\b` / `\bwings\b`
- Subtype language: `subtype`, `instinctual`, `sp/so`, `sx/sp`, `so/sx`, etc.
- Arrow language: `integration`, `disintegration`, `stress arrow`, `growth arrow`, `connecting line`, `→ \d` or `→ Type \d`
- Counter-typing: `countertype`, `counter-type`, `mistype`

For each hit, write down:

- The paragraph it's in
- What the paragraph is _arguing_ (not just describing)
- Whether the argument fits Wing, Subtype, Arrows, or Counterarguments bucket

This inventory becomes the raw material for the four sub-sections.

### Step 3 — Draft the rabbit hole

Fill the four-section template using the inventory from Step 2. Enforce the word budget: 400–700 words inside the panel.

If the inventory is thin for a sub-section (e.g., nothing about subtypes in the original body), author new content for that sub-section from the page's existing behavioral evidence. Do not invent biographical facts. Stay inside what the original blog already established, just re-read through the subtype/wing/arrow lens.

### Step 4 — Strip the main body

Go back to every jargon hit from Step 2. For each:

- Delete the jargon label (`5w6`, `sx/sp`, `→ 7`, etc.)
- Keep the behavioral observation in plain English
- If a whole paragraph only existed to argue wing/subtype/arrow, delete the whole paragraph — the same argument now lives inside the rabbit hole, and the body reads tighter without it.

After this pass, run a fresh search for the five patterns above across the main body. There should be **zero hits** outside the rabbit hole. If any remain, justify each one (edge cases: a direct quote that happens to contain the word "wings" — fine — is distinguishable from a wing _code_).

### Step 5 — Choose placement

Apply the placement decision tree from §2.2. Document your reasoning in the tracker entry (Step 7) — this will help future retrofits pick up the pattern.

### Step 6 — Verify

- **Word count** inside the panel: 400–700.
- **All four H3 sub-sections** present, in order, none empty.
- **Frame line** is the first `<p>` inside `.panel`.
- **Three link-outs** to `/enneagram-corner/` pillars, one per applicable sub-section.
- **Zero** `\d+w\d+` / `sp/s[opx]` / `sx/s[opx]` / `so/s[opx]` / `countertype` matches outside the rabbit hole.
- **Placement** satisfies all five conditions in the decision tree.
- **Dev render check:** run `pnpm dev`, load `/personality-analysis/[slug]`, visually verify collapsed state (cyan-teal border, 🐇 emoji, `+` indicator), open it (indicator becomes `−`, frame line shows, H3s render with bottom borders), mobile view at 375px wide (no horizontal overflow).

### Step 7 — Record the work

Append a row to `docs/development/rabbit-hole-retrofit-tracker.md` under a new "Retrofits completed" section (create it if it doesn't exist):

| Person | Date | Placement anchor (H2 name) | Word count | Notes |
| ------ | ---- | -------------------------- | ---------- | ----- |

One row per retrofit. If you had to skip a page (structurally too thin, DB/draft divergence too large to reconcile, other), record it under a "Skipped" subsection with the reason.

### Step 8 — Output artifacts

For each retrofitted page, you produce **two** things:

1. **Updated draft file** at `src/blog/people/drafts/[Person].md` — the full file with the rabbit hole inserted, main body stripped.
2. **A short summary comment** reporting: total words moved from body into rabbit hole, total words deleted from body, net word delta, placement anchor chosen, any gotchas encountered.

DJ will handle the DB push separately — do **not** attempt to write to the database.

---

## 6. Gotchas and FAQ

**Q: The page currently has no wing/subtype/arrow content at all. Do I still retrofit?**
No. This tasker is for pages where the raw material already exists. Pages without any existing material are a different, higher-effort workflow (author from scratch, fact-check against primary sources) — those are not in scope here. Skip and note it.

**Q: The existing content has a wing/subtype claim I disagree with.**
Preserve the existing typing decision. Retrofit is a structural move, not a re-typing. If you have strong evidence the current wing/subtype is wrong, flag it in your summary comment and let DJ decide — do not silently re-type.

**Q: The main body has a direct quote containing "wings" or a numeric-looking token.**
Direct quotes are preserved verbatim. Quote text is not body-authored content; the Distribution Rule doesn't apply to it. Use your judgment — "spread my wings" in a lyric is obviously fine.

**Q: There are no obvious counterarguments — the typing is airtight.**
Even airtight typings have a plausible alternate. Usually the nearest-adjacent type or a type that shares a core fear/fixation. Engage it honestly in 1–2 paragraphs. "People sometimes mistype [Person] as [Type N] because [surface pattern]. Here's why that reading breaks down..." The Counterarguments section is the highest-value SEO/LLM section in the block — do not shortchange it.

**Q: The page's featured image or intro widget sits higher in the body. Does it count for the Placement Rule?**
Yes. Treat the featured image / QuickAnswer / TL;DR cluster at the top as one block of "above-the-fold chrome." The rabbit hole needs to be far enough below that cluster that a reader has encountered real narrative prose first — two full H2 prose sections is the rule of thumb.

**Q: Can I retrofit two pages in parallel?**
Yes, but work one at a time in terms of file edits. Each retrofit is a self-contained unit; batching edits across files invites the wrong block ending up on the wrong page.

**Q: What if the main body uses arrows intentionally without Enneagram meaning ("the arrow of his career")?**
That's fine — the Distribution Rule targets Enneagram typology jargon, not the English word "arrow." Use judgment. Your post-retrofit scan is looking for _typological_ references, not every appearance of the word.

---

## 7. Starting queue

From `docs/development/rabbit-hole-retrofit-candidates.md`, work this order unless DJ overrides:

**Tier 4 pilot batch** (all four signals present — richest raw material, cleanest retrofits):

1. `Caleb-Hearon.md`
2. `Dario-Amodei.md`
3. `Pete-Davidson.md`
4. `Johnny-Depp.md`

Stop after Tier 4 and report back. DJ will provide the top-traffic list at that point, and we'll cross-reference it against Tier 3 to pick the next batch based on audience size, not just raw-material richness.

**Do not start** on Tier 3 or below without DJ's sign-off. The top-traffic list is the traffic filter; without it, Tier 3 work is under-prioritized.

---

## 8. Definition of done (per page)

- [ ] DB row verified; draft diffed against DB version if the page is published
- [ ] Rabbit hole block inserted at a placement satisfying all five decision-tree conditions
- [ ] Four sub-sections populated, in order, within 400–700 words
- [ ] Frame line is the first `<p>` inside `.panel`
- [ ] Three `/enneagram-corner/` link-outs present (wings, subtypes, arrows)
- [ ] Main body contains zero wing codes, zero subtype abbreviations, zero `→ Type N` arrow notation, zero `countertype` mentions outside the rabbit hole (excepting direct quotes)
- [ ] Dev render verified on desktop + mobile
- [ ] Tracker row appended
- [ ] Summary comment written for DJ

If you cannot satisfy any one of these boxes, stop and report — do not ship a partial retrofit.
