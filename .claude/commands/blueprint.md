<!-- .claude/commands/blueprint.md -->

# Blueprint — 9takes Pre-Draft Editorial Vision Lock

You lock the **editorial vision** for a blog _before_ anyone writes a sentence of prose. The output is a per-piece **blueprint doc**: a locked driving thesis + a facet decomposition (the blog's "eras") + a chosen POV + a section-by-section architecture, each section pinned to a **real, citable evidence anchor** and a signature-detail candidate + a **discoverability frame locked upfront** (title/meta/answer/FAQ). This doc then feeds the draft pipeline (`blog_content_creator_people_v2`, `write_amazing_blog`) so the writing stops being flat, generic, or undiscoverable.

**The problem this fixes:** the blog commands are **draft-first.** They go straight to prose — research, then write — with no step that locks _the take, the structure, and the search frame_ first. So the thesis emerges mid-draft (or never), discoverability gets graded after the fact, and weak sections survive because nothing forced an evidence anchor up front. This command is the missing **vision-lock front-half.** It runs _upstream_ of drafting, the same way `/moodboard` runs upstream of `/carousel`.

> The carousel was copy-first and the images came out flat. The fix was to **direct, not prompt** — lock mood/camera/light before the prompt. Blogs are draft-first and the prose comes out flat the same way. The fix is the same: **direct, don't draft.** Lock thesis → facets → POV → architecture → evidence anchors → discoverability **before** the first sentence.

## What makes this 9takes-native (the POV + facet engine)

Two moves carry the 9takes thesis ("see the emotions behind every take") into method:

- **Facets over a flat tone.** A subject is not one mood across a whole piece. We map it into 4-6 facets first (the public/private gap, the wound, the origin, the contradiction, the present-tense anchor) so the blog has range, then hold them together with one driving thesis.
- **POV is a deliberate choice.** We decide _whose vantage the blog is written from_ — analyst, first-person inside-the-type, second-person diagnostic, the nine-voice chorus, the witness. The draft pipeline never makes this explicit. We do.

---

## Input

**$ARGUMENTS** — a source, plus an optional blog-kind keyword.

- Source: a person name (`Robert Greene`, `Zendaya`), an Enneagram type (`Type 5`), a situation (`getting passed over for a promotion`), or a blog path / URL (`src/blog/enneagram/enneagram-type-5.md`, `/personality-analysis/Zendaya`).
- Optional kind (last word): `person` | `type` | `situation` | `guide` | `community` | `pop-culture`. If omitted, infer it (see §0 routing).

If no argument is provided, respond:

```text
Ready to blueprint a 9takes blog. Give me a source — and optionally a blog kind.

I'll pitch you a locked driving thesis (the contradiction the piece resolves),
break the subject into facets, pick the POV it's written from, and lay out a
section-by-section spine — each section pinned to a real, citable evidence anchor
and a search frame locked up front. Step by step, you approve each stage. Then it
hands a finished spec to the draft pipeline.

Example: /blueprint Robert Greene
```

Then wait.

## Self-sufficiency

This command is **self-sufficient** — every framework it needs (the directing spine, the thesis engine, the facet model, the POV lenses, the architecture model, the discoverability frame, the voice signature, the quality gates) is inlined below. The downstream pipeline it feeds is `blog_content_creator_people_v2` / `write_amazing_blog`; the canonical editorial rulebook is the `9takes-editorial-standards` skill and the v2 rubric in `docs/content-analysis/blog-grading-rubric.md`. You do **not** need to read those to run this — but if the `9takes-editorial-standards` skill is available, loading it costs nothing and keeps the banned-word / AI-tell list current.

## Pre-Approved Operations

- **Read / Glob / Grep**: all project files (to mine source on the subject and find internal-link targets)
- **WebSearch**: only if in-repo material is thin and you need real, citable moments/quotes
- **Write**: `docs/blog-blueprints/<slug>-blueprint.md`
- **Bash**: `ls` / `mkdir -p` for the blueprints dir only

## Task Tracking

Create these tasks at the start (TaskCreate/TaskUpdate; keep one `in_progress`):

1. Resolve source + blog-kind + gather real material
2. **Gate A** — pitch + lock the Take (thesis + facets + reader/search frame)
3. **Gate B** — pitch + lock the POV + architecture (the spine)
4. **Gate C** — pin evidence anchors + signature details + the discoverability frame
5. Write blueprint doc + report + hand off

---

# The Frameworks (inlined)

## 1. The directing spine (run in order; do not skip ahead to prose)

Steps 1-5 are the _vision_. Do not write a single sentence of body prose until they're locked. The blueprint **never contains the draft** — it contains everything the draft needs so the writer only executes prose.

1. **Lock the Take.** One driving thesis that resolves a public contradiction (§2).
2. **Map the Facets.** 4-6 angles the piece traverses (§3) — range, not one flat tone.
3. **Choose the POV.** Whose vantage the blog is written from (§4).
4. **Architect the Spine.** Section-by-section; each section = what it says + its evidence anchor + a signature-detail candidate (§5).
5. **Lock Discoverability.** Title/meta/description/answer/FAQ/entity — _before_ writing, because it's a structural gate (§6).
6. **Hand off.** The draft pipeline executes prose against the locked spec; it makes no new structural decisions.

**Maxim:** the structure is 50% of the result. A blog with a sharp take and a flat structure still reads flat.

## 2. The thesis engine (the most important lock)

A 9takes blog needs **one driving thesis that resolves a public contradiction** — stated in one phrase that would surprise a casual fan. _"Fear, not power, drives everything"_ (Thiel). _"The performance that made her famous was a coping mechanism for trauma"_ (Paris Hilton). _"The man who read everyone built a fortress of paper to avoid reading himself"_ (Greene).

**How to find it:**

- Name the **public surface** (what everyone already believes about the subject) and the **private contradiction** (the fact, quote, or moment that cuts against it). The thesis lives in that gap.
- For a **type** source: the misread. _"Type 9s look like the easiest people to be around and are quietly the hardest to actually know."_
- For a **situation** source: the reframe that makes nine reactions reveal nine fears, not nine moods.

**Rank + kill (the discipline):** pitch **2-3 candidate theses**, ranked. Kill the weak ones with two tests:

- **The swap test.** Replace the subject's name — does the thesis still hold for anyone? If yes, it's generic; kill it. A real thesis _breaks_ when you swap the name.
- **The surprise test.** Would a casual fan say "huh, I hadn't thought of it that way"? If it's the obvious read, dig deeper.

The Enneagram must **explain something non-obvious** — remove every Enneagram reference; if the thesis still lands identically, the framework isn't doing real work. Fix the thesis until the type is load-bearing.

## 3. The facet decomposition (the blog's "eras")

A subject flattened into one tone reads flat. Map it into **4-6 facets** first — distinct angles the piece will traverse — then let the single thesis hold them together. Pull facets, in rough priority of charge, from:

- **The public/private gap** — the persona vs. what's underneath.
- **The defining wound** — the thing they're still answering.
- **The origin** — where the pattern started.
- **The signature ritual / behavior** — the specific, observable thing only they do.
- **The contradiction** — the two things about them that shouldn't coexist but do.
- **The present-tense / legacy-now anchor** — where this lives today (the v2 rubric rewards a current anchor).

**Rank each facet by:** evidence (is there a real, citable anchor for it?) · specificity (can I picture one concrete scene/quote?) · non-genericness (could only this subject own it?) · thesis-service (does it advance the take?). **Kill any facet with no citable anchor** — it will become a paragraph of speculation. Each surviving facet becomes one or more sections in §5.

## 4. The POV engine (pick one lens for the piece)

The vantage the blog is written from. Most people-analyses default to lens 1; choosing deliberately is the edge.

| #   | POV lens                         | What it does                                                                          | Best for                                                                    |
| --- | -------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 1   | **The analyst (3rd person)**     | Reads the subject from outside with conviction; quotes carry it.                      | The standard people-analysis; default when in doubt.                        |
| 2   | **Inside-the-type (1st person)** | "What the world feels like from in here." No subject — the reader _becomes_ the type. | Type pieces, enneagram-corner; the most differentiated kind.                |
| 3   | **The diagnostic (2nd person)**  | "You do this. Here's the fear under it." Implicates the reader.                       | How-to-guides, "is your read shallow" pieces; hooks ~3× harder.             |
| 4   | **The nine-voice chorus**        | One situation, nine reactions, each a real read.                                      | Situation sources; the give-first funnel weapon (→ consider `/nine-reads`). |
| 5   | **The witness**                  | A first-person observer watching the subject; the read happens to _us_.               | Pop-culture, a single revealing scene as the spine.                         |

State the lens and _why it fits this source_ in one line. The lens sets the grammatical person, the opening move, and how evidence is introduced — lock it before the spine.

## 5. The architecture model (the spine)

The section-by-section structure. Each section is one row, carrying four things — this is the analog of the moodboard's per-shot direction:

- **Role / heading** — the section's job and a search-intent-aware working heading (sentence case; previews value, not a label: "Why Type 3s avoid vulnerability," not "Type 3 and vulnerability").
- **What it must say** — 1-2 sentences of editorial intent: the point this section proves and which facet it serves. (The "why this shot" layer.)
- **Evidence anchor** — the _real, citable_ quote / fact / dated moment this section is built on. **Never invented.** A section with no anchor is flagged weak → strengthen with research or cut.
- **Signature-detail candidate** — the small, specific, seemingly-minor moment that could crack the subject open here (not the headline accomplishment).

**Arc rules:** the extractable answer sits **early** (§6); the thesis is stated up top and called back at structural moments (not restated flatly); intensity varies section to section (short punchy ↔ longer flowing — never uniform energy); the subtractive principle governs — if a section rounds a contradiction off into a flat-but-coherent portrait, cut it.

## 6. The discoverability frame (lock this UPFRONT, not after)

Discoverability is a **structural gate** in the v2 rubric: a blog cannot grade B+ (8.5) with discoverability < 7, and it lives in frontmatter + structure, **not prose** — so it can and must be locked before writing. Lock:

- **Search-intent titling.** `title` / `meta_title` / `persona_title` matching how people actually search the subject (`[Person] enneagram`, `[Person] personality type`, `what type is [Person]`). Name early and exact. `meta_title` 35-65 chars; `description` 120-170 chars and CTR-worthy. Provide 2-3 title options.
- **The extractable answer.** Where the direct, skimmable "What is [subject]'s type?" answer sits (early), phrased so a reader _or an AI engine_ can lift it in one block. No burying the type.
- **The FAQ set.** 3-5 _real_ search-intent questions for the `faqs` schema (genuine queries, not invented). Draft the questions now; the draft writes the answers.
- **Entity metadata.** `same_as` targets / canonical name forms to plan for.

This frame is the part of "quality" that maps to the next traffic wave. Locking it here is the single biggest value-add of the blueprint over a draft-first run.

## 7. The voice signature (the constant across every section)

Lock once; applies to every section regardless of facet. This is the "shared signature" analog.

- **Voice:** tactically direct · socially savvy · respectfully provocative · pattern-recognition focused · results-driven. Rhythm: **Hook → Insight → Action.** Key verbs: decode, navigate, map, read, unlock, resolve.
- **The three substance tests** (run the title, opening, headings, and every major claim through them): **Can I visualize it?** (concrete object/scene, not abstract nouns) · **Can I falsify it?** (a named behavior/quote/number, not "helps you understand yourself") · **Can nobody else say it?** (if 16Personalities could publish the line unchanged, it fails — find the 9takes angle).
- **AI-writing tells to design out** (so the draft never writes them): negative parallelism ("it's not X, it's Y" — the #1 tell), [statement]+[restatement], dangling "-ing" depth-fakers, "from X to Y" false ranges, weasel attribution, filler openers ("in today's world," "it's important to note"), "let's dive into/unpack," reflexive "Overall/In conclusion" summaries, essay conjunctions (Moreover/Furthermore), lists-of-exactly-3 everywhere, the `**Bold:** definition.` bullet template, Title Case Headings, uniform energy.
- **Banned words** (flag for the draft to avoid): game-changer, deep dive, unpack, leverage, tapestry, landscape, navigate the complexities, at its core, shed light on, resonates, multifaceted, delve, nuanced, realm, foster, pivotal, embark, myriad, paramount, groundbreaking, cutting-edge, intricate, underscore, enhance, crucial, testament, captivate, solidify, cornerstone, spearhead, bolster, commendable, meticulous.
- **Hard rules:** **em-dashes are banned** in blog content (zero per article; the lint enforces it) — the blueprint models this in its own example lines. Never modify `lastmod`. Never invent biography.

## 8. The quality bar (the Gate-C pass/fail criteria)

Before writing the blueprint doc, the locked vision must clear these — they're the same five bars the draft will be graded against, moved upstream so the draft starts from a passing structure:

1. **One driving thesis that resolves a public contradiction** — stated in one surprising phrase (§2).
2. **The Enneagram explains something non-obvious** — swap-test the thesis without the type; it must weaken.
3. **The subject's own words carry it** — every facet has a real quote/testimony anchor planned (§5), not paraphrase.
4. **At least one signature detail** — a small specific moment, not a headline accomplishment (§5).
5. **Structure that can hit** — varied section intensity, early extractable answer, thesis callbacks (§5-6).

**The subtractive principle (meta-rule):** a blog draws a _persona_ from public material, not the full human. The blueprint's job is to cut inessentials and sharpen the contradictions that most quickly characterize the subject. If the spine is adding coverage instead of sharpening contradiction, cut.

## 9. Evidence discipline (non-negotiable)

- **Never invent biography, quotes, or numbers.** Every anchor in the spine must trace to real source material (in-repo tidbits/drafts/analyses, or a WebSearch citation). Mark any anchor you could not verify as `⚠ needs sourcing` so the draft pipeline knows to confirm or cut it — do not pass an unverified claim through silently.
- **A section with no citable anchor is a weak section.** Strengthen it with research or kill it. This is the blueprint's version of the moodboard kill rule.
- The more specific the fact (date, place, number, exact quote), the stronger the section. Mine these from the same sources as the facets.

---

# Workflow (step-wise, with gates)

## Step 0 — Resolve source + blog-kind + gather real material

Resolve `$ARGUMENTS` to a source and a **blog kind**, which sets the downstream target:

| Source / kind           | Blog kind     | Downstream command                                                 | Lives in                  |
| ----------------------- | ------------- | ------------------------------------------------------------------ | ------------------------- |
| Person name             | `person`      | `blog_content_creator_people_v2`                                   | `src/blog/people/drafts/` |
| Enneagram type          | `type`        | `write_amazing_blog` (Enneagram Corner)                            | `src/blog/enneagram/`     |
| How-to / practical      | `guide`       | `write_amazing_blog` (How-to Guides)                               | `src/blog/guides/`        |
| Idea / opinion          | `community`   | `write_amazing_blog` (Community)                                   | `src/blog/community/`     |
| Pop-culture analysis    | `pop-culture` | `write_amazing_blog` pattern                                       | `src/blog/pop-culture/`   |
| Situation (9 reactions) | `situation`   | flag for `/nine-reads`; interim → `write_amazing_blog` (Community) | `src/blog/community/`     |

Honor an explicit kind keyword; otherwise infer (a person → `person`; a single type → `type`; a phrase with no subject → `situation`; a "how to" → `guide`). If ambiguous, ask one question.

**Gather real material (do not invent):**

1. `docs/instagram/post-ideas/2026-04-29_top-tier-people-tidbits.md` — check for a tidbits block first (richest anchor source for people).
2. `src/blog/people/drafts/<Person>.md` or the published `/personality-analysis/<slug>`; for types, `src/blog/enneagram/enneagram-type-N.md` — pull `persona_title`, `enneagram`, the wound, existing FAQs and quotes.
3. A locked moodboard (`docs/ai-image-gen/moodboards/<slug>-moodboard.md`) if one exists — its eras/through-line are a ready-made facet starting point; reuse them.
4. Only if in-repo material is thin: one WebSearch pass for concrete, citable moments and quotes.

Note the Enneagram type and 4-8 concrete, datable, _citable_ anchors you can build sections from. If you cannot find enough real anchors, say so and stop — a blueprint without anchors would just license speculation.

## Step 1 — Gate A: The Take (thesis + facets + reader frame)

Pitch (≤1 screen), seeded from §2-3:

- **2-3 candidate theses, ranked.** For each: the public surface it cuts against, and its swap-test result. Recommend one.
- **The facets:** 4-6, each one line with its real anchor named (`facet — "the citable moment behind it"`). Show range; flag any facet still missing an anchor.
- **The reader/search frame:** who is searching for this and the query they'd type, plus the one-line promise the piece makes them.

Then **stop and ask:** _"Lock thesis #N + these facets, or adjust?"_ Do not proceed until approved.

## Step 2 — Gate B: POV + architecture (the spine)

Using §4-5:

- **Pick the POV lens** (§4) and state in one line why it fits.
- **Lay out the section spine:** every section as one row — role/working heading + what it must say + which facet it serves. Place the extractable answer early; vary section intensity; plan the thesis callbacks.

Confirm: (a) every facet is served by at least one section; (b) the arc has a clear opening hook, an early answer, and a payoff that restates the thesis _with the "because"_; (c) intensity varies (no uniform energy). Then **stop and ask:** _"Approve the spine, or restructure?"_ Wait.

## Step 3 — Gate C: Pin evidence anchors + signature details + discoverability

For each section in the approved spine, pin (§5-6, §9):

- its **evidence anchor** (real citable quote/fact; mark `⚠ needs sourcing` if unverified),
- its **signature-detail candidate**,
- and run the §7 substance tests on its working heading + claim.

Then lock the **discoverability frame** (§6): 2-3 search-intent title options + `meta_title` + `description` + where the extractable answer sits + 3-5 real FAQ questions + entity metadata.

Run the **§8 quality bar** over the whole vision. If any of the five bars fails, fix it now (not in the draft). Then **stop and ask:** _"Approve the anchors + SEO frame, or adjust any?"_ Wait.

## Step 4 — Write the blueprint doc + report + hand off

Write `docs/blog-blueprints/<slug>-blueprint.md` (template below). Then report, and tell the user the exact next move: the downstream command (from §0) that consumes this blueprint to draft the prose.

---

# Output Template

```markdown
<!-- docs/blog-blueprints/<slug>-blueprint.md -->

# <Subject> — 9takes Blog Blueprint

> Kind: <person/type/situation/guide/community/pop-culture> · Enneagram: <N (wing) or n/a> · POV: <lens #/label>
> Downstream: <blog_content_creator_people_v2 / write_amazing_blog (section)> → <target dir>
> Source: <tidbits / draft / published analysis / web> · Status: VISION LOCKED <date>

## The take (driving thesis)

<the one surprising phrase the whole piece proves — resolves a public contradiction>

- **Public surface it cuts against:** <what everyone already believes>
- **Swap test:** <why it breaks when you swap the subject's name — i.e. why it's not generic>
- **Why the Enneagram is load-bearing:** <what the type explains that nothing else does>

## Facets (the angles the piece traverses)

| Facet                  | What it reveals | Evidence anchor (real, citable) |
| ---------------------- | --------------- | ------------------------------- |
| <public/private gap>   | <...>           | "<quote/fact/date>"             |
| <wound>                | <...>           | "<...>"                         |
| <origin>               | <...>           | "<...>"                         |
| <contradiction>        | <...>           | "<...>"                         |
| <present-tense anchor> | <...>           | "<...>"                         |

## POV

**Lens <#> — <label>.** <one line on why it fits this source; what grammatical person + opening move it sets.>

## The spine (section-by-section)

| #   | Role / working heading (sentence case) | What it must say (+ facet)           | Evidence anchor | Signature detail        |
| --- | -------------------------------------- | ------------------------------------ | --------------- | ----------------------- |
| 1   | Hook — <heading>                       | <intent>                             | "<anchor>"      | <small specific moment> |
| 2   | Early answer — <heading>               | <the extractable type answer>        | "<anchor>"      | —                       |
| ... | ...                                    | ...                                  | ...             | ...                     |
| N   | Payoff — <heading>                     | <thesis restated WITH the "because"> | "<anchor>"      | <...>                   |

_Arc: extractable answer at §<X> · thesis callbacks at §<list> · intensity varies (peaks at §<X>)._

## Discoverability frame (locked — draft must honor)

- **Title options:** 1) <...> 2) <...> 3) <...>
- **meta_title** (35-65 chars): <...>
- **description** (120-170 chars, CTR-worthy): <...>
- **persona_title** (if person): <...>
- **Extractable answer** (sits at §<X>): <the one-block, liftable type answer>
- **FAQ set** (real search-intent questions): <Q1> · <Q2> · <Q3> · <Q4>
- **Entity metadata:** same_as → <targets> · canonical name → <...>

## Voice signature (the constant)

- Tactically direct · socially savvy · respectfully provocative · pattern-recognition · results-driven. Hook → Insight → Action.
- Em-dashes banned · no negative parallelism · no banned words · show-don't-label (type named ≤ twice) · never invent biography.

## Quality bar check (Gate C)

- [ ] One driving thesis resolving a contradiction · [ ] Enneagram non-obvious (swap-tested) · [ ] Subject's own words anchor every facet · [ ] ≥1 signature detail · [ ] Structure varies + early answer.
- **Unverified anchors to confirm before publish:** <list, or "none">

## Hand-off

Run **<downstream command> <subject>** — it executes prose against this locked spine (no new structural decisions). It must honor the discoverability frame and confirm any `⚠ needs sourcing` anchors before the draft goes to `/grade_blog`.
```

Then report to the user:

```text
## Blueprint locked: <Subject>

**File:** docs/blog-blueprints/<slug>-blueprint.md
**Take:** <the one-line thesis>
**POV:** lens <#> · **Spine:** <N> sections, peak at §<X>
**SEO frame:** locked (title + meta + answer placement + <k> FAQs)
**Anchors to source:** <count or "all verified">
**Next:** <downstream command> <subject> — drafts the prose from this spine.
```

---

# Go Deeper

Self-sufficient by design. Distilled from and feeding:

- `.claude/commands/moodboard.md` — the upstream vision-lock pattern this ports from images to prose.
- `docs/content-workflows/BLOG-WORKFLOWS.md` — the roadmap; this command is Workflow 1.
- `blog_content_creator_people_v2` / `write_amazing_blog` — the draft pipelines this hands off to.
- `9takes-editorial-standards` skill — the canonical voice / banned-word / AI-tell rulebook (§7 is its distillation).
- `docs/content-analysis/blog-grading-rubric.md` — the v2 rubric this front-loads (evidence, originality, discoverability weighted 1.5×; discoverability ≥7 gate).
