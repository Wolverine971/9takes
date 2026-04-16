<!-- blog-creator-restructure-plan.md -->

# blog_content_creator_people — Restructure Plan

**Goal**: Clean the command up, consolidate overlapping rules, integrate Harry Dry's copywriting discipline natively, and resolve the SEO-vs-copywriting tension gracefully.

**Current state**: 1,194 lines. Target after rewrite: ~750 lines. Zero lost capability.

---

## Three decisions you're approving

### Decision 1: Merge "show, don't tell" + Harry Dry's 3 rules into 4 unified craft principles

They overlap. A merged framework is easier to apply and teach. The 4 principles become the spine of the command — applied to hooks, titles, headings, claims, and prose:

1. **Show, don't label** — describe behavior vividly; let the pattern resonate. _(Show-don't-tell + Harry Dry's "visualize.")_
2. **Point, don't talk** — replace adjectives with evidence you can point at. _(Harry Dry's "falsify" / "don't talk, only point.")_
3. **Story over system** — the Enneagram is a lens, not a label. Keep typology debates out of the body. _(Story-first + Keep-Typology-Debates-Off, merged.)_
4. **Sound like 9takes** — lines that nobody else could publish unchanged. _(Harry Dry's "ownable" — but moderated by SEO, see Decision 2.)_

Every principle ships with a **before/after example** inline, so "show don't tell" is itself shown, not told.

### Decision 2: Treat SEO and copywriting as a balance, not a hierarchy

Principle 4 ("sound like 9takes") would push every heading toward maximum ownability. SEO pushes toward recognizable search-intent phrases (`Why [Person] can't stop [X]`, `[Person]'s childhood`). Neither alone is right.

New rule — **the heading mix**:

- **1–2 signature headings** (pure copywriting, person-only, vivid, ownable)
- **2–3 search-intent headings** (pure SEO — look like real queries)
- **Remainder are hybrids** (carry story AND search intent in one phrase)

The sweet spot is a hybrid: `The Empty Desk That Still Drives IShowSpeed`, `Why Jennifer Lopez Seems So Demanding`. Command will have 2–3 worked examples of hybrid headings.

Same balance applies to titles: `title` leans evergreen/SEO, `meta_title` leans problem-focused/CTR, `persona_title` leans ownable.

### Decision 3: Defense-in-depth against sub-agent shortcuts

Your concern about agents skipping `prep-prompt-1/2.md` and `writing-prompt-1.md` is legit. An agent that "knows the pattern" can and does skip file reads.

**Mitigation**:

- **Inline the must-follow rules** in the command file itself (tone, 4 craft principles, heading strategy, ending rule, title system, hook test). The command is always loaded — these survive any skipped Read.
- **External docs become deeper playbooks**: research methodology, extended technique library, worked examples. Skipping one degrades quality but doesn't cause a failure mode.
- **Make Reads explicit in the workflow**: Step 1 says "Read `prep-prompt-1.md` as your research checklist before anything else." This raises the probability without guaranteeing it.
- **No single source of truth outside the command for anything that would break the blog if missed**.

Net effect: the command is self-sufficient. The external docs add depth, not safety.

---

## Proposed structure (section by section)

Labels: `[KEEP]` = unchanged, `[TRIM]` = same idea, fewer words, `[CONSOLIDATE]` = merge multiple sections, `[NEW]` = didn't exist before, `[MOVE]` = stays but relocated, `[DELETE]` = cut entirely.

### Header

- Intro paragraph `[KEEP]`
- Pre-Approved Operations `[KEEP]`
- Task Tracking `[KEEP]`
- Scope (in/out of scope) `[KEEP]`

### Part 1: Reference Guide

#### 1. The Quality Bar `[NEW, short]`

~20-line orientation block that names what separates a 9takes celebrity blog from generic personality content: core tension, signature details, Enneagram resolves a paradox, prose that hits, ending that cuts to black. Anchors the rest of the doc. Replaces scattered "what makes a great analysis" pieces as a single entry point.

#### 2. The Four Craft Principles `[CONSOLIDATE: Story First + Show-Don't-Label + Keep Typology Debates Off + Harry Dry 3 rules]`

The core of the rewrite. Replaces:

- "Story First, Analysis Second" (old section)
- "Show, Don't Label" (old section)
- "Keep Typology Debates Off the Page" (old section)
- The bolted-on "Copywriting Pass (Required Before Grading)" (old section, lines 1084–1145)

New single section covers the 4 principles from Decision 1, each with:

- One-sentence rule
- Why it matters (1–2 sentences)
- **Before → After example** (this is how "show don't tell" gets shown, not told)
- Where it applies (hooks, headings, claims, prose)

Includes the **confidence calibration** (currently duplicated in 2 places) as a single paragraph under "Point, don't talk."

#### 3. The Distribution Rule `[TRIM from existing]`

The "explicit Enneagram framing in at most 3–4 sections" rule. Already exists — trim and move to be adjacent to the Four Craft Principles. Keep the litmus test ("would the blog still be compelling if you removed every Enneagram sentence?").

#### 4. Repetition Prevention `[TRIM from 30 lines → ~12 lines]`

Currently states the same rule 4 different ways. Consolidate to: the golden rule (each quote/anecdote/concept appears once), the TL;DR-as-teaser rule, and a pre-finalization scan.

#### 5. The Hook Test `[NEW, short]`

Replaces "The intro's job" paragraph. Three checks applied to the opening:

- Can I visualize it? (concrete image, not a rhetorical question)
- Can I falsify it? (a claim that's testable, not a mood)
- Does it name or imply the core tension?

1 gold-standard example (Thiel's parachute), not 4.

#### 6. The Ending Rule `[TRIM]`

Already a strong section. Compress from ~20 lines to ~8. Keep the "mic drop vs. flight attendant" test.

#### 7. Internal Enneagram Knowledge Base `[KEEP, minor trim]`

The `enneagram-mental-health-blog-index.json` pass. Already tight. Minor wording cleanup.

#### 8. Triple-Title System `[TRIM + INTEGRATE Harry Dry]`

Keep the 3-title architecture. Add a **rule-test for each title**:

- `title` — leans SEO/evergreen (visualize + falsify, moderated for search intent)
- `meta_title` — leans CTR (falsify + visualize, problem-focused)
- `persona_title` — leans ownable (nobody else could say it)

Keep the persona-title vocabulary table. Trim the title examples table from 4 rows to 3.

#### 9. Heading Strategy: SEO vs. Copywriting Balance `[CONSOLIDATE + EXPAND]`

Replaces the current "Heading strategy: rich + searchable" block. Makes Decision 2 explicit:

- The heading mix (1–2 signature / 2–3 search-intent / rest hybrid)
- Harry Dry tests (visualize, falsify, ownable) applied per heading
- SEO moderators: when to combine, when to prioritize search intent
- 3 hybrid examples (currently has 3, keep the best)
- Anti-patterns: flat category headings AND overly cryptic magazine headings

#### 10. Page Template Context `[KEEP]`

What to include / NOT include in markdown. Already tight.

#### 11. Internal Linking Rules `[KEEP, minor trim]`

Already tight. Small wording pass.

#### 12. Valid Field Values Reference `[KEEP]`

The `type` table, `suggestions` guidance, `published` default. Keep.

#### 13. Production Handoff (`production_pretext`) `[KEEP]`

The handoff contract. Keep exactly — it's the integration point with `blog_content_production_people`.

#### 14. Gold-Standard Excerpts `[DELETE — mostly]`

Currently 40 lines (Peter Thiel open, Paris Hilton section, Thiel ending, Blake Lively resolution). Three of these examples also appear in `prep-prompt-2.md` and `writing-prompt-1.md`. **Keep only the Thiel ending** (the "cuts to black" reference) inline. Delete the rest; agents who want more examples will find them in the external docs during Step 4.

### Part 2: Writing Workflows

#### Session Start `[KEEP]`

#### Workflow: New Draft

- **Step 1: Research Packet** `[TRIM]` — points clearly to `prep-prompt-1.md` with an explicit **"Read this file first"** instruction. Remove duplicated research-depth guidance that's already in prep-prompt-1. Keep the internal-index pass requirement and required research focus areas list.
- **Step 2: Enneagram Analysis** `[TRIM]` — points to `prep-prompt-2.md` with explicit Read. Remove duplicated thesis/crystallizing-sentence guidance. Keep internal knowledge cross-check and core-tension synthesis output requirements.
- **Step 3: Transcript Recommendations** `[KEEP]`
- **Step 4: Write the Draft** `[TRIM]` — points to `writing-prompt-1.md` with explicit Read. Remove duplicated prose-technique guidance. Keep: required H2/H3 for SEO, the structure-tailoring rule, the heading balance rule (references section 9), the ending rule (references section 6).
- **Step 5: Self-Review** `[CONSOLIDATE — this is where Copywriting Pass merges in]` — runs the Quality Checklist. The Harry Dry tests appear _as checklist items_ (hook passes visualize + falsify; titles pass their respective tests; 3 most important claims point at evidence; headings hit the balance mix). Replaces the separate "Copywriting Pass (Required Before Grading)" section entirely.
- **Step 6: Furniture Pass** `[KEEP, minor trim]`
- **Step 7: Generate Metadata** `[KEEP]`
- **Step 8: Save Draft and Add Links** `[KEEP]`
- **Step 9: Review and Refinement** `[KEEP]`

#### Workflow: Update Existing Draft `[KEEP, minor trim]`

The 6 steps stay. Minor trims where they duplicate Part 1 rules.

#### Quality Checklist (Final Review) `[CONSOLIDATE + INTEGRATE]`

The current checklist is good but long. Tightened version integrates:

- Core tension / small moments / aha moment / swap test (kept)
- **Harry Dry criteria folded in**: hook passes visualize + falsify; 3 key claims point at evidence; at least one signature heading + 2+ search-intent headings
- Confidence / hedging check (kept, single location)
- Repetition check (kept, references section 4)
- Technical checks (kept)

No separate "Copywriting Pass" step before grading.

#### Quality Grading `[KEEP + FIX STALE PATH]`

- Fix broken path: `docs/blog-grading-rubric.md` → `docs/content-analysis/blog-grading-rubric.md` (2 occurrences).
- Otherwise unchanged.

#### File References `[UPDATE]`

- Fix the broken grading-rubric path
- Add a line noting: "For a standalone deep copywriting pass outside the creator workflow, use `/copywriting-pass`"
- Remove references no longer used

---

## What this gets you

- **~450 lines cut** without losing guidance.
- **One unified craft framework** (4 principles) instead of 4 overlapping sections.
- **Harry Dry's discipline is native**, not bolted on — it lives in hooks, titles, headings, claims, and the checklist.
- **SEO balance is explicit** — the mix rule prevents over-rotation toward either clever copy OR search-intent drone.
- **Defense-in-depth** on external doc reads — the command stays self-sufficient.
- **No functional changes** to the handoff with `blog_content_production_people`.

---

## Questions for you before I rewrite

1. **OK to delete most Gold-Standard Excerpts?** (Keep only Thiel ending inline; others live in `prep-prompt-2.md` and `writing-prompt-1.md`.)
2. **OK with the 4-principle consolidation** — specifically collapsing "show don't tell," "Harry Dry visualize," and "Harry Dry falsify" into principles 1 and 2 with before/after examples?
3. **The heading mix ratio** (1–2 signature / 2–3 search-intent / rest hybrid) — does that feel right, or do you want more SEO weight?
4. **Defense-in-depth approach** on external docs vs. inlining _everything_ in the command — good as proposed?

Reply with yes/no per question (or "all good, proceed") and I'll do the rewrite.
