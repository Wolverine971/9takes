<!-- docs/content-analysis/pipeline-audit-2026-07-04/grading-growth-report.md -->
# Grading / Review / Discoverability / Bridge Audit — Lanes 5-8

Scope: review process (5), grading calibration & incentives (6, priority), discoverability/AEO (7), reader-to-platform bridge (8). Evidence: 6 pipeline runs (Steve Martin 07-04, Jeff Goldblum 07-03, Tobey Maguire 07-03, Zac Efron 07-02, Rosé 07-02, Mira Murati 07-01), grade_blog/fresh-eyes/enrich commands, rubric v2, the live `[slug]` template + server load, draft frontmatter.

---

## LANE 6 — Grading calibration & incentives (priority)

### Verdict: the 07-01 recalibration BIT. Grades are markedly more honest and no longer cluster at ≥8.5.

**Before (pre-fix baseline):** 89% of drafts ≥8.5. The Mira-Murati run (2026-07-01_133636, the last pre-recalibration run) graded **8.8 / B+** with near-straight 9s (Evid 9, Orig 9, Ennea 9, Writing 9, Hook 9) and reported "Publication Ready ✅" — language the recalibrated command now explicitly forbids. The independent audit re-graded that same draft a **D**. That ~2-letter gap is the failure mode the recalibration targets.

**After (5 post-fix runs):** first-pass grades and regrades:

| Draft            | Type | 1st grade               | Revision lift       | Regrade    | Net             |
| ---------------- | ---- | ----------------------- | ------------------- | ---------- | --------------- |
| Steve Martin     | 5    | **8.0 B** (straight 8s) | mixed               | **8.5 B+** | +0.5 → B+       |
| Jeff Goldblum    | 7    | **8.4 B**               | tactical-incomplete | **8.4 B**  | 0 (no lift)     |
| Tobey Maguire    | 6    | **8.3 B**               | tactical            | **8.2 B**  | **−0.1 (down)** |
| Zac Efron        | 9    | **7.9 C**               | substantive         | **8.3 B**  | +0.4 → B        |
| Rosé (BLACKPINK) | 4    | **7.9 C**               | substantive         | **8.4 B**  | +0.5 → B        |

First-pass grades: 8.0, 8.4, 8.3, 7.9, 7.9 — median 8.0, **none ≥ 8.5**. Two landed C. This is exactly the "expect the median to land 7.0-8.0, a batch where everything clears 8.5 means calibration drifted" distribution the recalibrated command demands. The old cluster is broken.

**Caps are applied with specific, named rationale in every log** (not mood-based on the cap side):

- Contrast-pair Writing cap named on Steve (5+), Tobey (5-6 + thesis 3x), Jeff (contrast panel + pairs).
- Evidence citability held at 8 with the _specific_ untagged claim named (Jeff's shower-glass spine quote, Steve's floating quit-quote, Rosé's vampirehollie).
- Cross-draft sameness Originality cap at 7 with the _exact_ reused moves named (Zac: "The tell:" TL;DR bullet, epigraph→cold-open, reader-command tics — all traced to Alex-Warren; Rosé: 4 moves vs Zayn/Zac). And it correctly **lifts** when the defect is removed (Zac 7→8, Rosé 7→8 after revision).

The pipeline-self-praise quarantine, hidden threshold, and evidence-citability cap are all visibly operating in the logs. This half of the fix is working.

### But four residual problems remain, and they matter.

**1. Grader per-dimension variance (±0.5-1.0) on UNTOUCHED dimensions swamps the revision's real signal.**

- Steve: revision _explicitly rejected_ touching the opening, yet **Hook went 8→9** and Enneagram 8→9 on the regrade. Much of the 8.0→8.5 lift is grader drift on dimensions the revision never touched, not draft improvement.
- Tobey: revision _sourced all 4 flagged claims_ (real work), but the regrade **dropped Discoverability 8.5→8** and applied a Writing contrast cap it hadn't applied the first time, so the overall went **DOWN 8.3→8.2**. Evidence stayed at 8 despite the sourcing.
- The straight-8s first grade for Steve (8,8,8,8,8,8) then a differentiated regrade (9,8.5,8,9,8,9) is itself a tell: the first grade anchored to a "B = all 8s" template rather than scoring each dimension independently.
- Consequence: **the regrade delta is a noisy measure of revision quality; the letter can flip on grader noise (8.4↔8.5, 8.2↔8.3), and two of five loops produced real work with zero or negative grade movement.**

**2. Caps hold, but the underlying defect PERSISTS through editor + revision — and the piece publishes anyway.**
Steve Martin: the contrast-pair fingerprint is flagged at first grade (5+), the editor pass AND the revision pass BOTH claim to thin it, and the regrade says it **STILL stacks 5+** and the Formula Fingerprint Ledger self-report is **still stale/wrong** ("3, all load-bearing" undercounts the body). Writing stays capped at 8 — correctly — but the overall (8.5) washes the cap out and it ships as a B+ carrying the exact brand-risk sameness the cap exists to flag. The cap is honest; the _consequence_ is toothless.

**3. Whack-a-mole under-specified feedback (Jeff Goldblum): tactical churn with no lift.**
First grade: "tag these 5 load-bearing quotes." Revision tags exactly those 5. Regrade: "you missed the 6th — the shower-glass 'Please God, let me be an actor' spine that opens/threads/closes the piece." Evidence stays 8, grade stays 8.4. The grader named a _subset_, the revision cleared the subset, and the bar didn't move because the single most load-bearing quote wasn't on the list. This is the loop doing real work that doesn't count.

**4. The grader reads REMEMBERED anchors, not actual anchor texts.**
grade_blog.md gives a prose anchor table (Matt-Smith=B, Alex-Warren=C, Mira-Murati=D). The logs reference anchors by description ("lands at the Matt-Smith B anchor," "maps almost exactly onto the Matt-Smith calibration anchor") — the grader never `Read`s the anchor draft. Combined with (1), remembered-anchor drift is the root of the per-dimension variance.

### Revision-loop verdict: substantive for sameness-capped C grades, tactical/noise for B-grade nudges.

- **Substantive: Zac, Rosé.** The fix was deterministic (remove the named near-verbatim moves; source the thesis image), the sameness cap genuinely lifted, C→B. This is the loop working as designed.
- **Genuinely valuable one-off: Steve.** The revision caught a real _fabrication-risk misattribution_ (the CBS Pollock "five minutes" story was a collector friend's, not Martin's — re-sourced from the Rita Braver transcript). That single catch is arguably the most valuable thing the loop did across all five runs. But the headline grade lift is partly variance, and the contrast-pair defect it was told to fix persists.
- **Tactical / no-lift: Jeff (missed the spine quote), Tobey (sourced 4 claims, grade fell on variance).** Real edits, no grade movement — the loop is measuring grader noise, not draft quality, in the B band.

### RECOMMENDED GRADING POLICY (deliverable #5)

Keep: threshold hidden from grader; named anchor table; caps with rationale; sameness/evidence/discoverability gates. Change:

**A. Auto-publish (no human) requires a COMPOSITE gate, not a bare 8.5:**

- overall ≥ 8.5 (B+), AND
- **no active cap** on Writing, Originality, or Evidence, AND
- discoverability ≥ 7 (existing gate), AND
- **grade stable:** |first_grade.overall − regrade.overall| ≤ 0.3 (guards against noise-driven letter flips).

**B. B+ WITH any active cap, OR instability > 0.3, OR overall 8.0-8.4 → `needsReview = true` ("publish with human review").** The human review specifically inspects the capped dimension. → **Directly answers the handoff question: yes, capped Writing/Originality after revision MUST force `needsReview` regardless of overall.** Steve Martin is the proof case (ships B+ with a live 5+ contrast-pair stack two passes failed to remove).

**C. B+ is "publish with human review," A (≥9.0) is the brand bar, NOT the publish gate.** Given the established analytics fact (grade r=0.11 with traffic; demand r=0.71), chasing A is low-ROI for traffic and A is rare — gating publish on A would starve throughput. Grade is a _floor + a needsReview trigger_, not an auto-publish dial. Reserve A for promotion/featuring.

**D. Add a "closest anchor diff" to grade_blog — worth it.** Cheap (one `Read` of the single closest-letter anchor draft, usually Matt-Smith since B is modal) and high-value: it grounds the score in a concrete comparison, cuts the ±0.5 variance, and makes the grade auditable. Require an explicit per-dimension delta line ("Evidence weaker than Matt-Smith because X"). Scope it to the ONE closest-letter anchor, not all.

**E. First grade must name ALL load-bearing quotes (esp. the thesis-spine one), not a subset** — kills the Jeff whack-a-mole. Pair with a pre-grade source-audit report (see Lane 5).

**F. Make the contrast-pair count deterministic** (blog-lint.sh or a quality report), because the self-reported Formula Fingerprint Ledger is provably stale in every run and the grader eyeballs "5+." A deterministic count feeds the cap and the ledger both.

**G. New `content_quality` fields (confidence + cap tracking):**

```yaml
content_quality:
  ... (6 dims + overall + letter + rubric_version + graded_at)
  caps_applied:            # machine-readable; drives needsReview. [] if none.
    - dimension: writing
      reason: 'contrast-pair engine 5+ body uses'
  confidence: high|medium|low   # low if overall within 0.2 of a letter boundary or a cap is contested
  anchor:                        # output of the closest-anchor diff
    closest: 'Matt-Smith'
    delta: 'Evidence weaker (untagged spine quote); Enneagram comparable'
  needs_review: true|false       # derived from B/rule set above
```

**H. Track "tactical vs substantive" in the per-run summary.json (lane 9 surface), not frontmatter:**

```
lift: { first: 8.3, regrade: 8.2, delta: -0.1,
        type: substantive|tactical|none|negative,
        dimensions_moved: [] }
```

Definition to encode: **substantive** = a cap genuinely lifted because the defect was removed (Zac/Rosé sameness) OR a dimension rose on new material (Steve's misattribution catch); **tactical/none** = the flagged dimension did NOT move despite claimed fixes (Jeff Evidence 8→8, Tobey Evidence 8→8); **negative** = overall fell on variance (Tobey). Over 20 runs this dataset answers "is the loop worth its cost" empirically.

---

## LANE 5 — Review process (fresh-eyes) & persona plan

### What fresh-eyes CATCHES (reliably, and well):

From the 5 logs, fresh-eyes is excellent at the **superfan/attentive-reader** lens:

- Missing defining relationships/roles/current-anchors a fan would notice: **Vanessa Hudgens** (Zac), **The Fly** (Jeff — flagged as the thesis's own counter-evidence), **Only Murders in the Building** (Steve's biggest current anchor), **marriage/kids + The Great Gatsby** (Tobey), **BLACKPINK basically absent** (Rosé).
- Within-draft repetition: keystone quote used 3× (Zac), thesis restated 4× (Tobey), jazz beat 3× (Jeff).
- Light factual softness: Rosé's "first solo record" error (she had a 2021 debut), unexploited APT. contradiction.

This lens is working — keep it as the default.

### What fresh-eyes MISSES (that the grader has to catch late):

- **Sourcing/citability.** Fresh-eyes has no source lens — it never flags untagged load-bearing quotes. Every Evidence-held-at-8 (Jeff's spine quote, Steve's quit-quote, Rosé's vampirehollie, Zac/Tobey's untagged claims) was caught by the grader, not fresh-eyes.
- **Cross-draft sameness.** Fresh-eyes reads one draft in isolation, so it _structurally cannot_ see the "The tell:" TL;DR bullet or corpus-stat sentence reused from the prior draft. Only the grader's sameness check caught those. → keep this **deterministic** (cross-draft scan), not persona-based.
- **Discoverability/head-term.** Fresh-eyes never reads title/meta_title/faqs; the systematic meta_title head-term miss (Lane 7) is invisible to it.
- **Monocausal thesis.** Fresh-eyes flagged over-_signposting_ (Steve) but not the monocausal-thesis defect (everything routes to one wound) the grader dinged on Steve/Tobey/Zac.

### PERSONA PLAN (deliverable #7) — concrete spec

Rotate 4 personas; run 2-3 per draft (selected by subject); one synthesis step.

1. **Superfan** (always run for high-recognition subjects; this is today's fresh-eyes — keep). "You've followed this person 15 years. What defining relationship, role, era, or controversy is missing or wrong?" Catches the Hudgens/The-Fly/Only-Murders class.
2. **Skeptic / fact-checker** (always run). "You don't buy the thesis. Which load-bearing claim or quote is unsourced? Where does one childhood wound over-explain everything? What contradiction got smoothed over?" Catches the sourcing gaps + monocausal thesis the grader currently catches late.
3. **Type-curious newcomer** (run when the type call is surprising: Zac 9-not-3, Mira 9). "You don't know this person; you're here for the Enneagram. Is the type convincing? Can you feel what they fear/want, or is it jargon?" Catches emotional-interior + accessibility gaps pre-grade.
4. **Search visitor** (run when head-term demand is high — most subjects). "You landed from Googling '[person] enneagram / personality type.' Does the SERP title (meta_title) match your query? Is the type answer in the first screen and liftable by an AI engine?" Catches the meta_title head-term miss + extractable-answer gap before grading.

**Selection rule:** always Superfan + Skeptic (highest yield); add Search-visitor for high-demand subjects, Type-curious for surprising type calls. Default 2, up to 3.

**Single synthesis step:** one synthesizer merges the persona blocks into ONE prioritized `FRESH EYES REVIEW`, ranked by weighted-dimension leverage — sourcing gaps + defining-context holes first (Evidence/Originality 1.5×), then discoverability (1.5×, cheap), then accessibility/interior, then trims. Synthesis **dedupes and rejects** low-value notes here (move the "reject bad notes" triage up from second-pass so second-pass doesn't overfit to 4 lists).

**Pre-draft "fan expectation checklist" for high-recognition subjects** — the highest-leverage lane-5 change (prevents the expensive misses at draft time instead of catching them late). Before drafting, produce a checklist the draft must address-or-consciously-omit:

- Defining relationship(s) — spouse/partner/famous romance (Hudgens, Meyer, Davis).
- Defining role(s)/work the public most associates (The Fly, Only Murders, Great Gatsby).
- Current-tense anchor — last 24 months.
- Biggest public controversy/critique.
- Fandom lore casual readers don't know.
  Fresh-eyes/synthesis then checks the draft against this list.

**Second-pass ordering:** run a lightweight **source audit** (list load-bearing claims + current attribution + URL presence) _before/within_ second-pass, so sourcing gaps get fixed in the main revision instead of discovered at grade stage 7 and half-fixed at stage 8 (this is what fixes the Jeff whack-a-mole at the source).

---

## LANE 7 — Discoverability / AEO

### Head-term mapping across the 6 drafts (head terms: "[person] enneagram," "[person] personality type," "[person] type N")

| Draft         | `title` head term                     | `meta_title` (rendered SERP title) head term            | `description`         |
| ------------- | ------------------------------------- | ------------------------------------------------------- | --------------------- |
| Steve Martin  | ❌ _none_ ("The Wild and Crazy Guy…") | ❌ _none_ ("The Real Reason Steve Martin Quit Comedy…") | ✅ "Enneagram Type 5" |
| Jeff Goldblum | ✅ "Enneagram Type 7"                 | ❌ "Why…Wildness Is Actually Discipline"                | ✅                    |
| Tobey Maguire | ✅ "Enneagram Type 6 Personality"     | ❌ "Why Tobey…Turns Cold…"                              | ✅                    |
| Zac Efron     | ✅                                    | ✅ **"Zac Efron, Enneagram Type 9: The Body He Fled"**  | ✅                    |
| Rosé          | ✅ "Enneagram Type 4"                 | ❌ "Inside Rosé's Mind…"                                | ✅                    |
| Mira Murati   | ✅ "Enneagram Type 9"                 | ❌ "Why Mira Murati Stayed Calm…"                       | ✅                    |

**The systematic failure: `meta_title` trades the head term for a curiosity hook in 5 of 6 — and `meta_title` is the rendered SERP title** (confirmed in `PeopleBlogPageHead`). The creator writes curiosity-first meta_titles; only the revision pass fixes it, and only when the grader flags it. **Steve Martin is the worst case: BOTH title and meta_title miss the head term** — flagged by the grader (Disc held 8). Zac's post-revision meta_title proves you can carry BOTH the head term and a curiosity hook in 45 chars: _"Zac Efron, Enneagram Type 9: The Body He Fled."_

**The grader enforces this rule by mood, not consistently:** Steve was penalized (Disc 8) for the meta_title miss; Rosé, Mira, Jeff, Tobey were NOT (Disc 8.5-9) for the identical miss. The rubric _asks_ the grader to check head-term titling, but there's no determinism — so it drifts. → make it a lint rule.

### FAQ realness: GENERALLY real search questions, not filler (a strength)

The first FAQ is always "What is [Person]'s personality type?" (enforced by enrich), and the rest are mostly genuine head/mid queries: "What happened to Zac Efron's face?", "Did Mira Murati help get Sam Altman fired?", "Why did Tobey Maguire stop making movies?", "Why did Steve Martin quit stand-up at his peak?", "What is Rosé's 'Number One Girl' about?" — all real demand. Weak ones are narrow body-thesis questions ("Why is The Fly the exception…", "Why has Tobey kept the same friends 30 years?") — not filler, but not search demand either; cap those at ≤1 per draft. The templated-backfill detector ("with supporting context from") is already in place.

### Extractable answer / AI-citation block: present but with two SILENT-FAILURE bugs

The extractable type answer exists twice: the first FAQ answer, and the body "What is [Person]'s Personality Type?" H2 (the dossier injects right before it). BUT:

- **`include_faq_schema` gates FAQPage JSON-LD emission** (`PeopleBlogPageHead`: `includeFaqPage: data?.include_faq_schema === true`) and I found **no setter** in the enrich or publish path — only readers. If the flag isn't explicitly true, the carefully-written FAQs emit **zero AEO schema**. This is a real, likely-live discoverability leak. **Verify + fix.**
- **On-page `<FAQSection>` is referenced only in the template's stale header comment; it is NOT rendered in the current V5 `[slug]` template.** FAQs are JSON-LD only — losing on-page snippet real estate and on-page Q&A engagement. Decide: restore on-page FAQ, or update the stale comment.

### Recommended deterministic checks (Lane 7)

1. **Head-term lint (in blog-lint.sh, enforced/repaired by enrich):** `meta_title` MUST contain the person's name AND one of {`enneagram`, `type [N]`, `personality type`, `personality`}. meta_title because it's the SERP title. FAIL (or WARN + require justification). Keep existing length checks (meta_title 35-65, description 120-170). Removes the grader's mood-based inconsistency. Zac's meta_title proves it's satisfiable without losing curiosity.
2. **FAQ realness policy:** first FAQ = "What is [Person]'s personality type?" (already enforced); ≤1 narrow body-thesis FAQ; the rest must match a search pattern (why/what/how/is/did + person name). Lint FLAGS FAQs whose question lacks the person's name or a recognizable query shape. Keep the templated-filler detector.
3. **Answer-block requirement:** the body "What is [Person]'s personality type?" section must open with a ≤60-word extractable answer (type + wing + 2-3 signature evidences) mirroring the first FAQ answer — the AI-citation block. Lint checks the section + first-FAQ answer exist; extractability stays a grader check.
4. **`include_faq_schema` must be set true when ≥2 real faqs exist** (enrich sets it; lint FAILs if faqs≥2 and flag≠true). Closes the silent AEO leak.

---

## LANE 8 — Reader-to-platform bridge

### Bridges that EXIST on the live template (not the body — by design)

The `[slug]` template and server load already carry a substantial, mostly-instrumented bridge layer:

- **NineChorus give-first** — explicitly "★ PRIMARY ACTION — the one thing this page drives toward." Consumes `post.chorus_question` / `chorus_question_url`. Instrumented via `give_first_funnel_events` + `record_give_first_event` RPC (per project memory — live and capturing). This is THE reader-to-platform bridge.
- **EnneagramTypeDossier** injected mid-article + CTA "Read the full Type N breakdown" → `/enneagram-corner/enneagram-type-N`.
- **Sidebar `bridgeLinks`** (built in `+page.server.ts`): type pillar, category page, **corpus-stats**, and **"Take the Enneagram test" → `/enneagram-test`**. (The test CTA the flow-audit asked for already exists.)
- **BlogComments/BlogInteract** ("Add your read on [person]" — give-first participation), **SuggestFamousPerson** (who to cover next), **RelatedPosts** (same-niche + same-type profile clicks).

**The body has essentially no bridge, correctly** — the creator's Ending Rule mandates "cut to black," no CTA. The template owns all bridging; the body stays a clean essay. This architecture is right.

### "Seed one 9takes question per profile" — the mechanism EXISTS but is DISCONNECTED

`scripts/generate-chorus.mjs` (`pnpm gen:chorus`) already generates one evergreen question per person + the nine takes, writing `blogs_famous_people.chorus_question` + `nine_takes`, which NineChorus consumes. **But it is NOT wired into `run-blog-pipeline.sh` or `nightly-blog-cron.sh`, and 0 drafts carry `chorus_question`.** So published profiles risk shipping with a NULL `chorus_question` → NineChorus falls back to a generic prompt → the give-first bridge is generic, not person-specific.

**Operational fix (the concrete "seed a question per profile"):** add a pipeline/publish stage that runs `gen:chorus --slug=<person>` right after publish, so every live profile ships with a person-specific give-first question + the always-complete Nine. This is a one-line integration of an existing tool, not new work.

### Should the rubric add a "self-reflection hook" criterion? NO — keep the bridge OUT of the rubric.

1. **Analytics fact:** grade doesn't drive traffic (r=0.11). A conversion dimension in the grade won't move traffic and risks corrupting the grade's one useful job (honest quality floor).
2. **New gaming vector.** A scored "self-reflection hook" teaches the pipeline to insert formulaic "If you've ever…" reader-command lines — which is the exact reader-command tic the editor pass currently REMOVES and the sameness check penalizes. A rubric criterion would directly contradict an editorial ban.
3. **The bridge is a TEMPLATE concern** — NineChorus/bridgeLinks/dossier CTA are structural and identical across profiles, so build them once in the template, don't re-grade per draft.
4. **The rubric already has the real self-recognition proxy:** the emotional-interior check (felt fear/want, empathy turn, interior beat). A reader who feels the person's interior is primed for the Chorus's "what's your take?" — the interior beat IS the self-reflection hook, and it's already graded.

### Where the bridge work should happen

- **Template (do here):** already strong. Fixes: (a) wire `gen:chorus` into the pipeline so `chorus_question` is always populated; (b) set/verify `include_faq_schema: true` on publish (else FAQ AEO silently off — Lane 7); (c) decide on-page FAQ vs JSON-LD-only.
- **Body (leave alone):** keep cut-to-black; add no CTA lines. Optional single lever: a per-profile chorus_question seed — but generate it (existing script), don't hand-write, to avoid formula.
- **Rubric (no bridge criterion):** keep grade as a floor + the emotional-interior check.

### Post-publish measurement plan (deliverable #8) — hang it off existing instrumentation

Primary (north-star loop): **give-first `gate_shown → contributed` conversion PER PROFILE** (already in `give_first_funnel_events`; first data gate_shown=2, contributed=0). Segment by slug + enneagram type.
Secondary, per published profile (analytics infra in `src/lib/analytics/`):

- Scroll depth to the NineChorus block (did they reach the give-first moment?).
- `/enneagram-test` CTA clicks from personality-analysis referrer.
- Type-pillar clicks (dossier CTA + sidebar).
- Related-profile clicks (RelatedPosts) — navigation depth.
- Comment / give-first participation count per profile.
  Analysis: correlate each against (a) content grade and (b) subject search-demand. Given grade r=0.11 with traffic, the hypothesis to test is that **grade also doesn't predict give-first conversion** — if confirmed, it hard-justifies keeping the bridge out of the rubric and investing in subject selection + the Chorus seed instead of grade polish.

---

## Cross-lane implementation backlog (condensed)

**Quick fixes / deterministic scripts:**

- Head-term lint on `meta_title` (Lane 7 #1). Deterministic contrast-pair count (Lane 6 F). `include_faq_schema` lint + enrich-sets-true (Lane 7 #4). Wire `gen:chorus` into pipeline (Lane 8).

**Prompt/spec changes:**

- grade_blog: closest-anchor diff (read one anchor); name ALL load-bearing quotes in first grade; new `content_quality` cap/confidence fields; needsReview on any active Writing/Originality cap. Fresh-eyes: `--persona` support + synthesis step + pre-draft fan-expectation checklist. Second-pass: source-audit-first.

**Policy decisions (DJ):**

- Adopt composite auto-publish gate (B+ + no caps + stable + disc≥7); B+-with-cap → human review; A = brand bar not publish gate. Confirm on-page FAQ vs JSON-LD-only.

**Analytics project:**

- Per-profile give-first funnel + secondary engagement dashboard; grade-vs-conversion correlation.
