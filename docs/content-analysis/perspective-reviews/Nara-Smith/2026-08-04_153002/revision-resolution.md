---
artifact: perspective-revision-resolution
schema_version: 1
subject: Nara-Smith
draft_sha256: 5919d6ad4f13f53fc57f83418c2a8c0996021655646893ed382284cd997228b0
resolution_status: complete
resolved_at: 2026-08-04T21:28:25Z
path: docs/content-analysis/perspective-reviews/Nara-Smith/2026-08-04_153002/revision-resolution.md
---

This pass ran against a verification that already **passed** (`verification-initial.md`:
`open_p0: 0`, `protected_hit_regressions: 0`). No P0 was reopened, because none was open. The
perspective work here is therefore limited to what the verifier itself named as incomplete or wrong:
the two partial P1 items, and the false provenance note it caught in the editor's evidence trail.

The bulk of the pass was grader-driven (grade B+ 8.6, 2 NEEDS WORK + 6 TO REACH A). Those edits are
logged in the draft's `REVISION PASS NOTES` block, not here; only their interaction with perspective
items is recorded below.

## Resolution log

| Item                                                            | Status                     | Edit                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| --------------------------------------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **P0-01 … P0-10**                                               | `fixed` (unchanged)        | All ten were resolved before this pass and re-verified. Nothing in this pass reopened any of them. The Forbes scoping, the Whimsy timeline, the hospital name's absence from structured data, the sourced inner-thoughts, the removed frequency claim, the two named service rules, the removed negative universals, the corrected table cell, the rebuilt Three-discriminator, and the archived transcript all survive verbatim or stronger.                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **P1-05 — newcomer gloss bundle**                               | `fixed`                    | The two glosses deferred by the editor pass for word budget both landed. (a) Enneagram-as-a-system, folded into the body-center paragraph: _"The Enneagram sorts nine types by core motivation, and its body center, Eight, Nine and One, is where certainty arrives ahead of analysis rather than after it."_ (b) Self-preservation-dominant, at first use in the type-answer opening block: _"Enneagram Type 8, the Challenger, self-preservation dominant: the survival instinct is what the intensity serves."_ The block remains lint-extractable at 54 words against a 60 ceiling. The previously-landed parts of P1-05 (the `"national radio"` → `"a podcast"` FAQ fix, the autoimmune gloss, _"a Black woman like her"_) are untouched. **P1-05's acceptance test now passes in full:** every Enneagram term outside the Rabbit Hole is glossed at first use. |
| **P1-07 — archive the three critic citations**                  | `needs_human`              | Three of four resolve to dated Wayback snapshots. **@Katwiia does not, and this pass deliberately did not decide it.** See Unresolved decisions.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Verifier remaining-work #1 — false provenance note**          | `fixed`                    | Both locations corrected. The Source Diversification ledger and the `EDITOR PASS NOTES` block each claimed the "poster child" quote _"originates with Shetty (July 2025) and was read back to her by Cooper."_ The second half is refuted by the archived transcript at `00:16:56–00:17:06`: Cooper says _"People started to compare you to tradwife and people were like—"_, **Nara** says _"[They] kind of used me as the poster child for the tradwife movement, which was very bizarre to me,"_ and Cooper follows with _"Why was that bizarre to you?"_ Both ledgers now record that the verbatim is hers on _Call Her Daddy_, 29 July 2026, that the Shetty verbatim in the body is a different sentence with its own trail (BuzzFeed, 12 July 2025), and that only the note was wrong. Reader-invisible; nothing published was affected.                       |
| **Verifier remaining-work #2 — Shetty date**                    | `fixed`                    | Reconciled to **10 July 2025** (BuzzFeed published 12 July, reporting the 10 July episode) in both ledgers, replacing "9 July". The reader-visible body and FAQ 3 say only "July 2025", so nothing published was ever wrong.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Verifier remaining-work #3 — singjupost speaker cross-check** | `research_needed`          | Not attempted; out of scope for a revision pass and it requires a source the repo does not have. Recorded as a standing constraint in the draft's notes: the `>>` turn markers demonstrably miss turns, so any **new** quote pulled from that transcript needs the labeled version first, particularly anything touching the two cancer narratives in the conversation (hers and her mother's). No new transcript quote was introduced this pass except the 200,000-likes passage, whose speaker is settled by first-person content (_"a story that I posted on Instagram about my daughter"_).                                                                                                                                                                                                                                                                       |
| **Verifier remaining-work #5 — "the bell" has no gloss**        | `fixed`                    | _"The last treatment came later, and the bell that patients ring to mark it."_ The soft inference the verifier flagged in P0-02(b) (that the bell came after remission) is unchanged and still rests on her own clause order.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Verifier remaining-work #6 — "no pinned rebuttal"**           | `fixed` (no change needed) | Left as written. RQ-06's sweep covers it in substance; the verifier did not ask for a change.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Verifier remaining-work #7 — unclaimed value**                | partially released         | P1-05 is now done (above). P2-01 (the naming convention) and RQ-03 remain open, but the blocker the verifier named — _"16 words of headroom"_ — is partly lifted: the body went 4,484 → 4,462, so headroom is 16 → 38. The next pass can afford P2-01's ~15 words.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

## Protected hits checked

All twelve verified present after this pass by literal string match. **No regressions.**

PROTECT-01 · PROTECT-02 · PROTECT-03 · PROTECT-04 · PROTECT-05 · PROTECT-06 · PROTECT-07 ·
PROTECT-08 · PROTECT-09 · PROTECT-10 · PROTECT-11 · PROTECT-12 — all intact.

Three deserve an explicit note because this pass edited _near_ them:

- **PROTECT-01 (the oatmeal close).** The last line is verbatim: _"It is the only kitchen she has ever
  been in where somebody else's hands were on hers."_ However, this pass **moved** the close's single
  source stamp down onto the load-bearing quote, so the first stamp changed too. This resolves a real
  conflict between P1-16 (which cut the _second_ stamp to "she said") and the grader's TO REACH #1 plus
  the source audit (which want the load-bearing oatmeal quote stamped). Moving rather than restoring
  keeps exactly **one** full attribution in the close, so **P1-16's acceptance test still holds** —
  no section carries two full source attributions for the same source within five sentences. P1-16's
  scope note said "touch nothing else in the close," so the first stamp's edit is out of scope and is
  disclosed here rather than buried, the same way the verifier handled the PROTECT-11 trim.
- **PROTECT-06 (the table).** The table, its cells and _"Two years of footage, and the right-hand column
  never leaked"_ are untouched. The one-line **intro before** the table was tightened from _"Here is
  what that meant, on the dates it meant it."_ to _"Here is what that meant, by date."_ Outside the
  protected span; recorded for completeness.
- **PROTECT-08 (the rejected-compliment paragraph).** The quoted material and its position are
  untouched. The sentence **after** it — P1-12's both-readings repair — was flattened from a two-beat
  closer to one plain sentence per the grader's TO REACH #3: _"She is correcting the record about a bad
  morning and taking back a meaning she never put there, at the same time."_ **P1-12's acceptance test
  still holds:** no passage tells the reader that her explanation of her own behavior is the naive one.
  Both readings are still held.

One further protected-adjacent decision, recorded because it was a live temptation: the diagnosis
section's postpartum-photo details (_"crying that morning, wearing a diaper, above her usual weight"_)
were considered as a word-budget cut and **rejected**. They are what make _"corrected it downward"_
concrete, and P0-09's acceptance test depends on the section answering the Three-objection with that
downward correction.

## Unresolved decisions

1. **The @Katwiia quote (P1-07) — needs DJ.** _"nobody looked at you and randomly came up with the
   Tradwife label."_ Undatable, unarchived, Tier 4 in the evidence packet, and the sharpest statement of
   the ledger charge against the subject. The editor escalated it; the verifier called it _"a human call
   about whether an unverifiable critic quote is acceptable in the section whose fairness the whole jury
   scrutinised."_ This pass did not decide it in either direction, deliberately: a revision pass should
   not quietly cut a critic while keeping every one of the subject's quotes, and should not quietly keep
   an unverifiable one in the fairness-critical section. The body prints no date, so nothing false is
   asserted today. **The exact decision:** keep the quote unarchived, cut it, or replace it with an
   archivable equivalent making the same charge.

2. **The singjupost.com speaker-labeled transcript (P0-10 residual) — research needed.** Not a blocker
   for anything currently in the draft; a hard prerequisite for pulling anything new out of that
   transcript.

This artifact does **not** declare the gate passed. `/blog_perspective_verify_people` reruns and owns
that verdict.
