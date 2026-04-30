<!-- docs/blog-automation/2026-04-29-pass-1-critic-engagement-plan.md -->

# Pass 1 Plan — Critic-Side Engagement Across People Corpus

**Date:** 2026-04-29
**Source assessment:** [2026-04-29-fresh-eyes-corpus-assessment.md](2026-04-29-fresh-eyes-corpus-assessment.md)
**Scope:** ~40 of 50 recently-assessed people blogs that duck critic-side pressure
**Goal:** Add real critic-side engagement to each blog _without_ creating a new corpus-wide fingerprint

---

## The fear we are designing against

The corpus already has a fingerprint problem. The risk of this pass is that we solve "blogs duck critics" by creating "every blog has a slapped-on defensive paragraph titled 'Why critics call X Y.'" Same fingerprint, different shape.

**The thing we are NOT trying to do:** mass-produce a templated H2 that defends the subject in 200 words and moves on.

**The thing we ARE trying to do:** make each blog's diagnosis _sharper_ by treating the harder reading seriously, in the form that fits the existing flow of that specific piece.

---

## What "engaging critic-side pressure" actually means

The two canonical examples in the corpus:

**Sorkin engaging Taibbi (the strongest move in the corpus, per the assessment):**

- Names the critic specifically: Matt Taibbi, _Rolling Stone_, 2011
- Quotes the actual charge: "the single most credulously slobbering financial reporter on the planet"
- Concedes the substance underneath the insult: DealBook took bank sponsorships, Sorkin defended Blankfein in print
- Adds Starkman's "access journalism par excellence" as a second, more measured charge
- _Then_ the Type 6 frame is used to explain _why_ the access pattern is a structural feature of his loyalty/skepticism wiring — not to dismiss the charge, but to make sense of it

**Sofia engaging the Charo critique:**

- The "she's playing dumb to sell sex appeal" critique is a real reading, named cleanly
- The blog doesn't dismiss it — it concedes it's a plausible read
- The 9takes diagnosis ("the ditz is the business plan, run by a Type 6 strategist") _takes the critique as evidence_, not as something to be refuted

**The pattern in both:** name the critic + the specific charge → concede what's true → use the Enneagram frame to _explain_ the pattern the critic is pointing at, not to make the pattern go away.

### Failure modes (what we are watching for)

1. **The defensive duck.** "Some critics say X. But really, [subject] is just a Type N." Same as the original problem.
2. **The generic critic.** "Critics have argued..." with no name, date, or specific charge.
3. **The fingerprint H2.** A "Why critics call X Y" H2 in every blog with the same paragraph rhythm: "[critic] said [insult]. [One sentence concession]. [Three sentences of Enneagram rescue]."
4. **The off-topic critique.** Engaging a critique that isn't actually the load-bearing one for this subject. (E.g., for Bezos, an Amazon-Prime-pricing critique is not the diagnostic critique. The labor-conditions / Lina Khan / monopoly critiques are.)
5. **The wrong-length engagement.** A 200-word section for a single throwaway tweet, or a 50-word section for a decade of substantive critique.

---

## The integration question (the strategic part)

For each blog, the critique can integrate in one of three forms:

| Form                                      | When to use                                                                                                                                                | Example                                                                                                         |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Dedicated H2** ("Why critics call X Y") | The critique is substantive, multi-source, has been pressed for years, and the existing structure has an obvious slot.                                     | Sorkin / Taibbi. Bezos / labor + Khan. Tate / actual harm. Altman / Annie + safety departures.                  |
| **Woven paragraph inside existing H2**    | The critique is real but single-source or single-thread; better service to flow than a standalone section.                                                 | Bieber / Scooter Braun split inside the existing handler arc. Drake / Kendrick beat inside an existing section. |
| **Distributed echo**                      | The critique is named once early, then _the diagnosis is built in dialogue with it_ — the critic's voice runs alongside the analysis throughout the piece. | Strongest form when it works. Hardest form to brief an agent on.                                                |

**Default selection rule:** prefer Dedicated H2 _only_ when the critique passes all four tests — substantive, multi-source, multi-year, and the existing structure has an obvious insertion slot near the diagnosis or close. Otherwise prefer Woven. Distributed Echo is reserved for blogs where I'm doing the work directly, not for parallel agents (too high a coordination bar).

---

## The per-blog briefing structure

This is the load-bearing part of the plan. Each blog gets a custom brief _before_ any agent touches it. The brief is built by me (or by a sequential research agent that I supervise), not by the writing agent.

Each brief contains:

1. **The specific critic + specific charge.** Not "find a critic." Named critic, named outlet, year, exact charge in quotation marks where possible. Pulled from the existing TESTIMONY LEDGER first; supplemented with research where the ledger is thin.
2. **The current ducked moment in the blog.** Quote the existing 1-2 sentences where the blog currently glances at the critique and moves on.
3. **The proposed integration form.** Dedicated H2 / Woven / Distributed — with a one-line rationale.
4. **The proposed structural slot.** Either a specific existing H2 to insert near, or a specific position in the existing structure for a new H2.
5. **The diagnostic point the critique should sharpen.** The Enneagram frame doesn't dismiss the critique — it _explains the pattern the critique is pointing at_. The brief names which type-mechanic the critique illuminates.
6. **Voice principle (not prescriptive match).** The engagement should sound like _this specific blog_ — not like a Sorkin or Sofia transplant. Let the existing voice of the piece carry the new content. Principle, not template.
7. **Word budget.** 150–400 words for woven; 250–500 for dedicated H2. Hard caps to prevent bloat.
8. **What NOT to do.** Specific failure modes for this particular blog. (E.g., for Tate: do not soften the harm to make the type read tidier. For Bezos: do not let "structural Five" become a way to avoid Amazon labor conditions.)

---

## Pilot phase (the verification mechanism)

**Before any parallel work, three blogs are done sequentially with full review.**

Pilot selection — one easy, one medium, one hard:

1. **Easy: Andrew Tate** — TESTIMONY LEDGER likely already has the harm sources; the integration form is clearly Dedicated H2; the failure mode (softening to keep type tidy) is the central thing to watch.
2. **Medium: Jeff Bezos** — Multiple substantive critiques (labor, Khan/FTC, _Washington Post_ editorial decisions). The brief has to choose _which_ critique is load-bearing and which integration form fits.
3. **Hard: Marc Andreessen** — The blog is flagged as a weakest-five entry; Type 5 read is confident but ducks the political-turn / Tucker-Carlson-podcast / techno-optimist-manifesto pressure. Tests whether critic engagement can also sharpen a structurally weak blog.

**Pilot loop:**

1. I draft the per-blog brief
2. You review the brief — does the critique selection match what you'd push on?
3. Single agent (sequentially, not in parallel) executes the brief
4. You review the output against the quality checklist below
5. We iterate the brief format until two consecutive blogs land cleanly

**Decision gate:** if pilot fails to produce reliable output even with iteration, we don't scale to parallel — we either do the pass manually together, or refine the pilot for another round.

---

## Quality checklist (review bar for outputs)

Each output is checked against:

- [ ] **Critic named.** Specific person, outlet, year. Not "critics."
- [ ] **Charge quoted.** At least one direct quotation from the critique, not paraphrased into pillow.
- [ ] **Substance conceded.** At least one sentence that admits what's true in the critique before responding.
- [ ] **Diagnosis sharpened, not defended.** The Enneagram frame _explains_ the pattern the critic is pointing at — does not make it go away.
- [ ] **Integration feels organic.** A reader who didn't see the diff couldn't tell which paragraph was added.
- [ ] **No new fingerprint phrasing.** The engagement does not begin with "But there's another reading," or "Critics will point out," or any other recognizable lead-in that would tile across 40 blogs.
- [ ] **Word budget held.** Did not blow past the cap.
- [ ] **Existing voice preserved.** Bolded thesis micro-headers, embedded italic quotes, paragraph rhythm match the rest of the blog.
- [ ] **No new contrast-pair tics introduced.** ("X is not Y. It is Z." count must not increase.)
- [ ] **No new counter-typing tics introduced.** ("A Type N would..." count must not increase.)

A blog that misses 2+ checks is rejected and re-briefed before scaling.

---

## Workflow

### Phase 0 — Pilot (this week)

1. Draft per-blog briefs for Tate, Bezos, Andreessen
2. User reviews briefs
3. Sequential single-agent execution per blog
4. User reviews each output
5. Iterate brief format
6. Gate: two consecutive blogs land cleanly → proceed to Phase 1

### Phase 1 — Brief generation pass

1. Sequential research pass over remaining ~37 blogs
2. For each: identify load-bearing critique from existing TESTIMONY LEDGER + targeted research
3. Decide integration form
4. Write per-blog brief
5. Estimate: ~37 briefs at 5-15 minutes each = several focused work sessions, not a single agent run

### Phase 2 — Parallel execution

1. Briefs go to parallel writing agents in batches of 5-10
2. Each agent gets: full blog file path, the brief, the voice anchor (Sorkin or Sofia paragraph), the quality checklist as an explicit success criterion
3. User reviews each output before commit
4. Reject + re-brief pattern for misses

### Phase 3 — Sweep verification

1. After all 40 are done, single-agent sweep reads the corpus
2. Flag any new fingerprint patterns that emerged across the engagements
3. Targeted fixes for any phrasing that tiled

---

## Why parallel agents can do this (the verification you asked for)

Confidence: **medium-high, conditional on the brief structure.**

Parallel agents _will_ succeed at this if:

- The brief identifies the specific critique upfront, so the agent isn't deciding "what critique"
- The brief picks the integration form, so the agent isn't deciding "where it goes"
- The brief names the diagnostic point the critique should sharpen, so the agent doesn't default to "defend the subject"
- The brief includes a voice anchor (an actual existing paragraph the output should match in tone)
- The brief includes the failure-mode list specific to this blog
- The pilot phase happens _first_

Parallel agents _will_ fail at this if:

- The brief is generic ("address critic-side pressure for this person")
- The agent is asked to research the critique itself (will produce surface-level criticism that misses the load-bearing one)
- No pilot phase, so the brief format is untested
- No voice anchor, so each agent invents the tone

**The pilot IS the verification.** If the pilot produces three clean outputs in a row, parallel will work. If the pilot fails, we adjust before burning 40 parallel runs.

---

## Out of scope for this pass

To prevent scope creep:

- **Currency gap (priority #4).** Will be a separate pass. Some current-2026 beats may naturally come in via critic engagement (Annie Altman, Lina Khan are 2025-2026), but adding a "Where X is in 2026" beat is a different deliberate move.
- **Tic caps (priorities #2, #3).** Mechanical sweep. Different agent, different pass.
- **Stress/growth arrow (priority #5).** Ledger-level standardization, separate.
- **5 weakest blogs structural rework.** Bartlett identity crisis, Van Gogh "great longread vs. 9takes thesis" problem, etc. — these need more than critic engagement and should be re-evaluated after Pass 1, 2, 3 complete.

---

## Coordination notes

- Other agents and the user may be editing this repo in parallel. Each blog modification commits independently. No bulk wide-net edits.
- The fresh-eyes per-blog assessment block (`<!-- FRESH-EYES ASSESSMENT — 2026-04-29 -->`) at the bottom of each file is the source of truth for "what was diagnosed wrong here." Each brief should reference it.
- Every commit message names the priority move it executes (e.g., "Pass 1: critic engagement — Andrew-Tate") so the corpus state is reconstructible.

---

## Open questions for user before pilot starts

1. **Pilot blog selection.** Tate / Bezos / Andreessen as the three? Or do you want a different mix?
2. **Brief authorship.** Do I draft the briefs and you approve, or do you want to see the underlying TESTIMONY LEDGER + critique research separately first?
3. **Voice anchor.** Sorkin or Sofia as the canonical reference? Sorkin is the assessment's pick; Sofia might be a better tonal match for celebrity blogs vs. business blogs.
4. **Reject threshold.** Is 2+ failed checklist items the right rejection bar, or stricter (1+)?
