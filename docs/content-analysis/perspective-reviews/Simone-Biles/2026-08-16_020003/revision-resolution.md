---
artifact: perspective-revision-resolution
schema_version: 1
subject: Simone-Biles
draft_sha256: c562d27c5e2965cb7192e3151184b3ba1d279ac8014c2904144f51f129513eae
resolution_status: complete
resolved_at: 2026-08-16T08:35:49Z
path: docs/content-analysis/perspective-reviews/Simone-Biles/2026-08-16_020003/revision-resolution.md
---

<!-- docs/content-analysis/perspective-reviews/Simone-Biles/2026-08-16_020003/revision-resolution.md -->

Targeted revision pass run after `/grade_blog` returned B (8.0) with the
`untagged_load_bearing_quotes` cap and `blog-lint.sh` returned a hard FAIL on body length. Inputs
were `docs/content-analysis/grades/Simone-Biles.review.md`, the lint report, and this review
directory's `context.json`, `synthesis.md`, `editor-resolution.md` and `verification-initial.md`
(no `verification-final.md` exists).

`verification-initial.md` reported `open_p0: 0` and `protected_hit_regressions: 0`, so nothing in
the P0 table was reopened. Its `needs_human` verdict rested on two publication blockers plus two
minor residuals, and those are what this pass consumed, alongside the one accepted P1 the verifier
recorded as incomplete.

## Resolution log

| Verifier item                                                                                                                                    | Status                    | Edit                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Remaining work 1 — `blog-lint.sh` FAIL on length** (blocking; verifier escalated to DJ as "raise the ceiling or cut from the pre-costed list") | `fixed`                   | Cut rather than excepted, because the revision command forbids leaving a lint FAIL open and because the grader, running after the verifier, independently prescribed "cut ~350 words to clear the lint ceiling before adding the attribution." Body 4,842 → 4,490 (352 net, against ~75 words of attribution and repair text added). Every cut is enumerated in the draft's `REVISION PASS NOTES`, per Conflicts 7's "do not silently truncate." Cuts drawn from the editor's pre-costed list: the ride-home paragraph plus its pull quote, and the audience-turn paragraph. The list's other entries were left alone on purpose: the MBTI Rabbit Hole section serves the target query and carries Discoverability 9, and the Memmel concession and the P1-03 Chiles/CAS clause are accepted P1 repairs. No P0 repair was trimmed. |
| **Remaining work 2 — confirmed factual error inside PROTECT-05** (blocking; "needs a human-authored two-clause repair")                          | `fixed`                   | Both defects closed. (a) "one was going home without a medal" is gone; the concession now names the cost that was actually paid: "a decision Biles made in a hallway cost them the gold they were favored to win." The page's own "The United States won silver" three paragraphs later is no longer contradicted. (b) "four other women" → "three other women." The same off-by-one recurred later in the section and the verifier did not catch it: "defensible to four other people" → "three other people." The adjacent counterfactual "four women go home with nothing" is left as written, since the verifier correctly established it counts Biles herself. PROTECT-05's concession content, its licence-to-argue function and its position ahead of the rebuttal are all preserved.                                       |
| **Grader TO-REACH item 1(b), same passage** — her arithmetic was presented as the objective fact the critics missed                              | `fixed`                   | Grader option (b) taken. "What the critics did not know is the arithmetic" → "the arithmetic she was running"; "There was one window" → "In her account there was one window"; and the no-drop-score quote now carries "She told _Call Her Daddy_ in 2024 what she believed that meant." The section's existing hedge on _timing_ ("Whether she ran that in the hallway or assembled it three years later is not recoverable") is untouched and now agrees with the framing of the _content_.                                                                                                                                                                                                                                                                                                                                      |
| **P1-13(b)** — the Loyalist first-mention gloss, recorded partial-with-reason under the word budget                                              | `fixed`                   | Shipped: "What marks a Six, the Enneagram's Loyalist, is the shape of the fear." Placed clear of PROTECT-02, whose two bookend sentences are verbatim. The word-budget reason for the deferral no longer holds, since this pass was cutting rather than adding.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Remaining work 4, residual a** — the FAQ's undated L'Équipe quote inside a dated 2028 answer                                                   | `fixed`                   | "She told L'Équipe, in an interview of uncertain date, that she will be in Los Angeles in some capacity." Matches the body's existing P0-06 marking.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Remaining work 4, residual b** — evidence-packet `Q7520786` at packet L44                                                                      | `fixed`                   | Corrected in `evidence-packet.md` to `Q7520267` with an inline note recording the old value and why it changed, so a future refresh cannot re-inject it. Handled the same way CLM-09 was.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Remaining work 3** — P0-02 acceptance-test deviation on the literal "Beyond Medals" grep                                                       | `no action, advisory`     | The verifier counted it resolved. The single hit is the EDITOR PASS NOTES annotation that exists to stop the wrong name re-entering; it is excluded from the reader-visible hash and stripped on push. Left in place deliberately.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Remaining work 5** — RQ-01, RQ-02, RQ-03, RQ-05                                                                                                | `no action, non-blocking` | Open research. Each already has a safe repair in the draft that holds under either answer, and the revision command forbids reopening the research phase.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

Grader work outside the perspective brief, resolved in the same pass: all eight untagged
load-bearing quote slots now carry outlet and year at point of use; the _Call Her Daddy_ episode
URL and the _Romper_ piece were added to `citations`; six British spellings were normalized (the
grader listed five and missed "organising"); the one reader-command imperative was removed; and
"Did I do it?" dropped from five reader-facing uses to four.

## Protected hits checked

All nineteen `PROTECT-*` items were re-verified by fixed-string match after the cuts. **Zero
regressions.** Four warrant a note because this pass edited inside or beside them:

- **PROTECT-05** — edited, as the verifier's Remaining work 2 required. The concession is present,
  still ahead of the rebuttal, and still concedes a real cost landing on real people. Only the false
  medal clause and the two wrong counts changed. "That cost landed on real people, and Biles has
  never argued otherwise" is verbatim.
- **PROTECT-17** — "humour" normalized to "humor" inside the protected sentence. Spelling only; the
  sentence and its function are otherwise verbatim.
- **PROTECT-15** — one TL;DR bullet was tightened by two words. The accordion, all five bullets and
  the Rabbit Hole's permission to skip are intact; the protected property is navigability, not
  wording.
- **PROTECT-19** — the Rabbit Hole falsifier list was compressed because P1-07 had already promoted
  two of the three falsifiers into the body, where they now sit beside the confidence label. All
  three falsifiers remain enumerated across the page and the move itself is not deleted, which is
  what PROTECT-19 guards.
- **PROTECT-01, 02, 03, 04, 06, 07, 08, 09, 10, 11, 12, 13, 14, 16, 18** — verbatim, unedited.

Two mechanical regressions were introduced by the compression pass and caught before finishing.
Three lead-in compressions replaced outlet names with "the same episode" / "the same interview" and
silently downgraded three quotes from INLINE to VAGUE in `scripts/blog-source-audit.mjs`; outlets
were restored and the audit re-run to 8 inline / 0 vague / 0 untagged. A fourth compression
introduced a strong `[X,-not-Y]` contrast pair in the cold open and was reverted. Both are recorded
in the draft notes as a standing rule for future compression passes.

## Unresolved decisions

None blocking. Three items are logged for the next refresh rather than this pass:

1. **The grader's TO-REACH-A item is deliberately not shipped.** It asks for a second interior beat
   inside the Paris all-around final, "one interior moment... not just the result ledger." No sourced
   interior moment from inside that final exists in `evidence-packet.md`, the revision command
   forbids opening a research phase to find one, and the word ceiling this pass spent 352 words
   clearing would not absorb it. The next refresh should fund it from the H2 8 calf paragraph, which
   the Paris FAQ already duplicates.
2. **Headroom is 10 words.** This is the second consecutive cycle to finish against the ceiling. The
   page is not bloated by accretion so much as expensive per argument, and the next substantive
   addition will require a structural cut, not line-level compression.
3. **TESTIMONY LEDGER entry 10** (Cecile Landi, "a little something in her calf") is ledger-only and
   was already absent from the body before this pass. Not a regression here; flagged so a future
   ledger audit does not read it as one.

This artifact does not declare the gate passed. `/blog_perspective_verify_people` must rerun against
the current draft.
