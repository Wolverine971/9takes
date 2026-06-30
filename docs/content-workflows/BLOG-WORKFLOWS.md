<!-- docs/content-workflows/BLOG-WORKFLOWS.md -->

# 9takes Blog Workflows — Build Spec

The image side proved a method: `/moodboard` took a mediocre `/carousel` and made it good by inverting the process — **direct, don't prompt.** This doc ports that same method to **blogs.** It captures (1) exactly what made the moodboard click, and (2) five blog workflows that apply that meta-pattern to 9takes content, ranked, with a recommended build sequence.

**Source of the method:** `.claude/commands/moodboard.md` + `docs/ai-image-gen/WORKFLOWS.md`. **Downstream blog pipeline these feed:** `blog_content_creator_people_v2` (people), `write_amazing_blog` (community / enneagram-corner / how-to-guides), and the editorial stack (`9takes-editorial-standards` skill, `/grade_blog`, the v2 rubric in `docs/content-analysis/blog-grading-rubric.md`).

---

## What made the moodboard click (the transferable meta-pattern)

The carousel command was copy-first: it wrote the teaching beats, then bolted on image prompts as an afterthought — every photo came out flat and generic. The moodboard fixed it by front-loading the vision. Five principles came out of that, and **none of them are about images.** They're a content method:

1. **Front-load the vision before execution.** No prompt gets written until mood → world → camera → light are locked. The blog analog: **no prose gets written until thesis → facets → POV → architecture → evidence anchors are locked.** Direct, don't draft.
2. **Decompose the subject into facets before flattening it.** Greene isn't "one cold mood" — he's five eras, each with its own palette, held together by a shared signature. A single global tone flattens a subject; per-facet treatment keeps range _and_ cohesion.
3. **Find the 9takes-native missing half the source didn't have.** iklipse teaches how to _direct_ a subject; the moodboard added **POV** — "whose eyes are we behind, looking at what." That's the product thesis ("see the emotions behind every take") turned into method.
4. **Gate the process.** Three approval gates (eras → moments → direction) before any output ships. The human stays in the loop; the machine never runs away with a flat first idea.
5. **Separate the constant from the variable, and make every unit say something.** Shared signature vs. per-shot palette. Every shot carries a "why this shot" + a real, citable caption. Nothing is decorative.

That meta-pattern is the spine of every workflow below. The current blog commands are **draft-first** — they go straight to prose with no upstream vision lock. That's the gap these workflows fill.

---

## Workflow 1 — `/blueprint` (the flagship) — BUILDING NOW

**The moodboard, but for a blog.** The single most direct transplant of the meta-pattern, and the highest leverage because it's _upstream_ — it makes every downstream blog command better, the same way the moodboard made `/carousel` better.

- **Input:** a person / type / situation / blog-path, plus an optional blog-kind keyword.
- **What it locks (before any prose):**
  - **The take** — one driving thesis that resolves a public contradiction (the #1 quality bar). Pitches 2-3 candidate theses, kills the weak ones with the swap test.
  - **The facets** — the blog's "eras": 4-6 angles the piece will traverse, so it has range instead of one flat tone.
  - **The POV** — whose vantage the blog is written from (third-person analyst · first-person inside-the-type · second-person diagnostic · the nine-voice chorus · the witness). The draft pipeline never makes this choice explicit; blueprint does.
  - **The architecture** — a section-by-section spine; each section tagged with what it must _say_, its **evidence anchor** (a real citable quote/fact — sections with no anchor get flagged and strengthened or cut), and its signature-detail candidate.
  - **The discoverability frame** — locked _upfront_, because discoverability is a structural **gate** in the v2 rubric (≥7 or it can't grade B+), not a prose property. Search-intent title/meta/description options, the extractable type answer and where it sits, the real FAQ questions, entity metadata.
- **Gates:** A (the take + facets) → B (POV + architecture) → C (per-section evidence + the locked SEO frame).
- **Output:** `docs/blog-blueprints/<slug>-blueprint.md` — a spec the downstream writer (or `blog_content_creator_people_v2` / `write_amazing_blog`) executes with zero further _structural_ decisions, just prose execution.
- **Why first:** it's the upstream tool. It fixes the thing that makes blogs flat for the same reason flat prompts made carousels flat — no vision lock before execution.

## Workflow 2 — `/nine-reads` (the differentiator)

**One situation, nine perspectives, as long-form.** The blog version of the Gallery carousel, and the most 9takes-native format that doesn't yet exist as a blog engine.

- **Input:** a situation ("you got passed over for the promotion," "the group chat goes quiet," "the late reply").
- **Engine:** freeze one scenario → walk all nine type-reactions, each with its emotional core, the tell, and the read. It _demos the give-first product mechanic directly in prose._
- **Upstream lock (moodboard-style):** the situation, the nine emotional cores, the through-line that makes it more than a listicle — then write.
- **Why it matters:** the strongest give-first funnel entry of any blog format (private recognition → "which one was you"), and a format no competitor owns. Pairs with the carousel Gallery mode and the instrumented give-first wall.
- **Scenario bank:** maintain a running list of high-recognition situations; each becomes one piece.

## Workflow 3 — `/pov` (the new blog _kind_)

**First-person perspective blog.** Take the moodboard's POV engine ("behind their eyes") and apply it to _prose_ instead of images.

- Not "an analysis of Type 5" but "what the world feels like from inside a Type 5's head."
- A genuinely different blog kind than anything currently in the corpus, and uniquely on-brand for "see the emotions behind every take."
- **Relationship to blueprint:** this is one POV lens blueprint can already select. `/pov` is the standalone, pushed-all-the-way version — worth its own command once blueprint proves the lens lands.

## Workflow 4 — `/decode → blog` (the method, turned on writing)

**What the `ai-image-gen/` folder did to carousels, pointed at blogs.** Transcribe a high performer → extract the reusable skeleton → reskin it 9takes-native.

- **Input:** a viral thread, a competitor post, a book chapter, a high-engagement Reel script.
- **Engine:** decode it into its structural skeleton (the beat order, the hook mechanic, the payoff shape), strip the content, then reskin with 9takes substance and voice.
- You already proved this loop works for images — the `iklipse-*.md` evidence layer _is_ this workflow run by hand. This makes it repeatable for text.

## Workflow 5 — `/series` (the chassis multiplier)

**Build one gorgeously, reskin the chassis.** Your own Workflow-2 insight (the 9-Type Decoder as a reusable skin) applied to blogs.

- One excellent piece becomes a chassis; "The Nine at work / in love / in a crisis" are reskins that spin the _variable_ and keep the _structure_.
- **Relationship to blueprint:** a `/series` run is a blueprint whose facets are held constant across N subjects. Build blueprint first; `/series` is a batch wrapper over it.

---

## Recommended sequence

1. **`/blueprint`** — the upstream chassis. Makes every other blog command better. _(building now)_
2. **`/nine-reads`** — the most differentiated format + the best give-first funnel fit.
3. **`/pov`** — once blueprint proves the first-person lens lands, push it to a standalone.
4. **`/decode → blog`** — repeatable competitor/source porting.
5. **`/series`** — batch wrapper over blueprint for variant runs.

## Cross-cutting notes

- **Direct, don't draft** is the non-negotiable spine of all five: lock the take before the prose, gate each stage, kill flat first ideas.
- **Discoverability is structural, lock it upfront.** The v2 rubric gates B+ on discoverability ≥7, and it lives in frontmatter + structure, not prose. Every workflow that produces a blog spec locks the search-intent frame before writing, never after.
- **Evidence is the highest-weighted dimension** (1.5×, tied with originality and discoverability). Every facet/section must carry a real, citable anchor; never invent biography. A section with no anchor is a weak section — strengthen or cut.
- **Editorial standards win.** All five defer to the `9takes-editorial-standards` skill (banned words, AI tells, em-dash ban, voice) and the `/grade_blog` bar (overall ≥8.5, discoverability ≥7).
- **Measure the loop.** Blueprint-driven drafts should be graded against non-blueprint drafts to confirm the upstream lock actually lifts the score before scaling it across the daily pipeline.
