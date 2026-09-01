---
artifact: perspective-revision-resolution
schema_version: 1
subject: Cara-Delevingne
draft_sha256: a793ab65b49c80255ab2c22a0a09524bd06f41485c4645c567a6979396198c48
resolution_status: complete
resolved_at: 2026-09-01T18:20:00Z
path: docs/content-analysis/perspective-reviews/Cara-Delevingne/2026-09-01_114810/revision-resolution.md
---

`verification-initial.md` recorded `open_p0: 0` and `protected_hit_regressions: 0`, and returned
`fail` on verification method step 6: the editor pass introduced new factual assertions without a
source trail while making repairs. This pass fixes all six draft-scoped Remaining-work items and
records the two that sit outside the draft.

## Resolution log

| Item                                                                        | Traces to                    | Status         | Edit                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --------------------------------------------------------------------------- | ---------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RW-1 — Topshop sentence states a design history that does not exist         | P1-05 / P1-10                | fixed          | The invented clause "the retailer she first designed for in 2017" is gone. The sentence now reads "On 25 August 2026 she put out a sixteen-piece co-designed Topshop capsule (Retail Gazette), her first design credit at a retailer she had only modelled for since 2014." That is the verifier's preferred second option: the 2026 capsule is her first co-designed collection, and the prior relationship was campaigns, not design. `grep "first designed for in 2017"` = 0. The dating (25 Aug 2026, sixteen pieces) matches packet CLM-21 / S-08; the outlet is the packet's primary source for it. PROTECT-01's ammunition is intact and now carries a citation.                                                         |
| RW-2 — "all cast in 2018" not supported for the Boo vote                    | P0-10                        | fixed          | Scoped to Sakinorva, using the verifier's minimum action verbatim in substance: "Boo carried it on a single vote and Sakinorva on two, both cast in 2018, with a dissenting 3w4 from the same year." `grep "all cast in 2018"` = 0. The two other places carrying the same over-claim were fixed with it: TL;DR bullet 1 and frontmatter FAQ 1 now both read "on a handful of votes, two of them dated 2018." The following sentence ("A handful of strangers typed the gurning eight years ago and it set") now inherits only the two dated Sakinorva votes, which carry it.                                                                                                                                                   |
| RW-3 — the close states a future release in the past tense                  | P1-11                        | fixed          | "Delevingne released _Not Normal_ on 25 September 2026 without attaching an explanation to the title" is now "_Not Normal_ goes out on 25 September 2026 with no explanation attached to the title." Forward construction, still survives a later gloss, and no longer contradicts the hook's "arrives on 25 September." Nothing else in the paragraph was touched.                                                                                                                                                                                                                                                                                                                                                             |
| RW-4 — frontmatter FAQ 1 substitutes a motive she did not give              | P0-01 residual               | fixed          | The single causal claim is replaced with the body's two-clause version: "by her own account threw herself off things because she wanted to feel pain, then wanted the cast so a stranger could see she was hurting." Both clauses are hers ("So I just wanted to feel pain"; "Yay! I can finally have a cast and say, Ow, I'm hurting").                                                                                                                                                                                                                                                                                                                                                                                        |
| RW-5 — new unmarked elision in the pull-quote                               | P1-04 residual               | fixed          | "in my family" restored: the pull-quote is again "I knew I was a little queer kid running around. I didn't feel like I belonged in my body, in my family, in any of it." The following sentence, which had been rewritten to match the cut, is restored to "The body first, then the family, and an opening clause that names why."                                                                                                                                                                                                                                                                                                                                                                                             |
| RW-6 — two audio-sourced changes unlogged                                   | P0-01 / editor pass          | fixed (logged) | Recording them here, since `editor-resolution.md` has no row. (a) The age-7 table row's quotation was replaced wholesale with "I was not going to eat, because that to me was the only thing I had control over," from the transcription the editor ran. (b) The two "I don't feel like I had a voice as a kid" tense corrections came from the same transcription. On the verifier's coherence question: the row still coheres. The "What happened" column carries the mother ("A hunger strike, while her mother was hospitalised and unreachable"); the third column is her account of her own motive, which is what the column is for and what the other four rows do. No edit made to the row beyond the pre-existing one. |
| RW-7 — word budget                                                          | grader NEEDS WORK, lint WARN | fixed          | 4,127 to 3,892 words, inside the 3,200-3,900 band. `scripts/blog-lint.sh` returns 0 fail, 0 warn. Roughly 350 gross words cut against ~60 added for attribution and one added third-party voice. Nothing came out of a P0 repair, a PROTECT passage, a ledger or the close. Sources of the cut are itemised in the FORMULA FINGERPRINT ledger.                                                                                                                                                                                                                                                                                                                                                                                  |
| RW-8 — artifact integrity: the frozen snapshot is no longer byte-verifiable | tooling                      | needs_human    | Out of draft scope and not fixable by editing the draft. `context.json` and `draft-reviewed.md` were rewritten by a formatter after the snapshot phase, so `draft-reviewed.md` no longer hashes to `context.json`'s `draft_sha256`. The verifier established that the snapshot's content is intact. The fix is either excluding `docs/content-analysis/perspective-reviews/**` from the formatter or having `scripts/perspective-review-gate.mjs` re-verify `draft-reviewed.md` against `draft_sha256` at each phase. Left for DJ; this pass did not touch either file.                                                                                                                                                         |

Everything else in the P0 and accepted-P1 tables was verified `resolved` / `completed` and was not
reopened. Two of the pass's trims land near completed items and are recorded so the rerun can check
them cheaply:

- **P0-07** — "Naranjo's word for it is 'competition.'" restated the sentence before it and was
  folded into it: "The sexual Four runs envy as what Naranjo called competition, and as anger rather
  than withdrawal or quiet shame." The competition framing is still attributed to Naranjo and still
  not to the linked 9takes page. `grep "counter-type"` = 0 in the body.
- **P1-04** — the epigraph's middle clause ("I'm a girl who wears a hoodie, smoking a joint…") was
  cut for length. The ellipsis that marked it is retained, so the elision stays marked: the epigraph
  now reads "When I'd see a billboard of myself, it wasn't me… I'm not this."

## Protected hits checked

All twelve re-checked against the current draft after the trims. No regressions.

- **PROTECT-01** — unchanged. The section still ends "The album is not the test. The test is what she makes after the raw thing stops selling," unanswered. Its ammunition gained citations (WWD, Retail Gazette) and lost the false 2017 history.
- **PROTECT-02** — the voice ladder and "Seen that way, the four careers are one request, refused three times and repeated anyway" are byte-identical. The section now _ends_ on that line, because the type-theory paragraph that followed it was cut as re-proving.
- **PROTECT-03** — hook untouched, still landing "A cast is a sentence the body can say out loud." The table's duplicate of the hook's bones quotation was shortened to "So I just wanted to feel pain," which keeps P0-01's requirement that the row carry her account of the act and removes the verbatim repeat.
- **PROTECT-04** — "For twenty-three years the reports had been filed, some by her body and some by her own hands…" is byte-identical. Only the preceding sentence's full stop became a colon.
- **PROTECT-05** — the Weinstein passage is byte-identical, attribution clause included.
- **PROTECT-06** — the falsifier is byte-identical. It is also the one unit that trips the same-type similarity scan against Hunter-Biden at 0.045; it was left alone deliberately and the trip is recorded in the ledger rather than written out of the draft.
- **PROTECT-07** — "Concede what is true in it. She got a major-label deal that thousands of better singers will never see, and she got it partly because her name sells," plus her Vogue concession, all intact. Only Besson's "tipped her for an Academy Award" clause was trimmed, two sentences later.
- **PROTECT-08** — the literal-aristocrat argument and the wings-guide wording survive sentence for sentence.
- **PROTECT-09** — "The music backlash, meanwhile, was a social event more than a critical one" is byte-identical and FEMMUSIC is still named. The following sentence now quotes Atwood and When The Horn Blows instead of only listing them.
- **PROTECT-10** — the close still declines to explain the title and still ends "This one she wrote, named, and declined to gloss." The only changes are RW-3's tense fix and a shortened Bella Hadid sentence, which also removes the verifier's P2-05 softness ("cast as the composed one" was the writer's word) by making the framing plainly the writer's.
- **PROTECT-11** — still a table, three columns, five dated rows, scannable. Two cells shortened, no row dropped or backfilled.
- **PROTECT-12** — the Gomez quotation is intact; only the sentence introducing it was tightened. The plain-English Type 4 gloss is byte-identical (it is also the lint-checked extractable answer block, 48 words).

## Unresolved decisions

1. **RW-8, artifact integrity.** `needs_human`. Not a draft edit. The perspective-review directory's
   freeze is advisory rather than enforced until either the formatter excludes it or the gate
   re-hashes `draft-reviewed.md`. Recorded above with both candidate fixes.
2. **RQ-05 remains unresolved**, as it was at the editor pass. No evidence she has addressed
   "I Feel Everything" in the 2026 press cycle, so every "first" claim stays narrowed to
   "substantially hers." No change requested or made.
3. **Not reopened, by design.** P2-01 was rejected with reason at the editor pass and stays
   rejected. The two soft step-6 items the verifier recorded (P2-05's "composed one" wording, the
   unlogged audio changes) are both handled above rather than left open.

The gate is not declared passed here. `/blog_perspective_verify_people` must rerun against the
revised draft.
