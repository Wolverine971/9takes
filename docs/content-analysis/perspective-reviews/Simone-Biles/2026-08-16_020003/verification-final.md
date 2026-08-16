---
artifact: perspective-verification
schema_version: 1
subject: Simone-Biles
draft_sha256: c562d27c5e2965cb7192e3151184b3ba1d279ac8014c2904144f51f129513eae
final_content_sha256: afbd23e88d3c108a56bb41eee4c519c2c1b3f273603303f14116657db2945107
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-08-16T08:43:13Z
path: docs/content-analysis/perspective-reviews/Simone-Biles/2026-08-16_020003/verification-final.md
---

<!-- docs/content-analysis/perspective-reviews/Simone-Biles/2026-08-16_020003/verification-final.md -->

## Verification verdict

Provenance holds. `synthesis.md` carries `draft_sha256: c562d27c…9513eae`, identical to the supplied
snapshot SHA; `shasum -a 256` over `draft-reviewed.md` returns the same value, and
`hashReaderVisiblePerspectiveBody` over that snapshot reproduces `context.json`'s
`866b01bd…9ee610c9`. The frozen artifact is the one the six seats reviewed. The current live draft
hashes to `afbd23e8…b2945107`, which differs from the `eb4f295f…` recorded by `verification-initial.md`
— the revision pass is present and is what this verdict covers.

**All ten P0 repairs remain resolved after the revision pass.** Each acceptance test was re-applied to
the current reader-visible text rather than carried forward from the initial verification, because the
revision cut 352 net words and every cut is a chance to reopen a repair. None did. **All nineteen
`PROTECT-*` items survive**, re-checked by fixed-string match; the four items the revision pass edited
inside or beside (05, 15, 17, 19) each retain their protected function. **All nineteen accepted P1s are
now complete** — P1-13(b), the only item `verification-initial.md` recorded as partial, shipped as
"What marks a Six, the Enneagram's Loyalist, is the shape of the fear."

Both publication blockers that produced the previous `needs_human` verdict are closed, verified by
re-running the tools rather than on report:

1. **Word ceiling — cleared.** `blog-lint.sh` now returns `0 fail, 2 warn`; body is 4,490 words against
   the 4,500 ceiling. The two warns are the ones the revision notes predicted: the thin-headroom warn
   (10 words) and the comparative-contrast hit, which is a verbatim Biles quote already logged in the
   FORMULA FINGERPRINT LEDGER.
2. **The factual error inside PROTECT-05 — repaired.** "One was going home without a medal" is gone,
   the self-contradiction with "The United States won silver" is gone, and both off-by-one counts are
   corrected to three. See the protected-hit section for the one residual this repair introduces.

`scripts/blog-source-audit.mjs` re-run against the current draft returns **8 load-bearing quotes, 8
inline, 0 vague, 0 untagged** — confirming the revision notes' claim that three compression-induced
INLINE→VAGUE downgrades were caught and restored.

The gate conditions are met: `open_p0: 0`, `protected_hit_regressions: 0`. One non-blocking item is
owed before publication and is recorded in Remaining work: the PROTECT-05 repair replaced an untrailed
false claim with an untrailed true-looking one.

## P0 resolution check

| ID        | Status   | Evidence in the current draft                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **P0-01** | resolved | No per-apparatus count of two survives in reader-visible text; `grep -i "two.up\|two.count"` returns three hits, all inside HTML comment blocks (L530 FRESH EYES, L568 SECOND PASS, L645 EDITOR PASS) that exist to stop the error re-entering. Body reads "An Olympic team final has no drop score, every routine a team puts up is added in, and Biles was slated on all four apparatus." Chiles: "Jordan Chiles, already on the team, ended up competing all four events"; `grep -i "chiles enter\|into the competition\|let jordan chiles"` returns nothing. The quotation carries its marked ellipsis and the restored "and physical." FAQ 2 matches the body. |
| **P0-02** | resolved | Three reader-facing instances read "Glenn Zweig's _The Art of Excellence_" / "_The Art of Excellence_"; every italicised name in the body resolves to a real source (_The Art of Excellence_ ×4, _Call Her Daddy_ ×9, _The Pivot Podcast_, _Romper_). `grep "Beyond Medals" scripts/blog-source-audit.mjs` returns nothing and `'The Art of Excellence'` is registered at L300. Draft grep returns one hit at L647, inside the EDITOR PASS NOTES comment — the same advisory deviation `verification-initial.md` recorded and the revision pass deliberately left; see Remaining work 3.                                                                            |
| **P0-03** | resolved | L416: "There was always a part of me that thought what if? And I think that was my anxiety talking." Published hedge restored, no certainty marker, nothing cut inside the marks.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **P0-04** | resolved | `grep "Simone Biles Rising"` returns nothing. The beat survives as paraphrase, further compressed by this pass but still unquoted: "She has said it was a point of strength." The source audit confirms every remaining quoted string maps to a tagged outlet.                                                                                                                                                                                                                                                                                                                                                                                                      |
| **P0-05** | resolved | "Nothing further" is gone. H2 9 carries the June hospitalisation, the 22 July second procedure with Owens present, her pledge to explain, and the as-of date closing the paragraph: "As of mid-August 2026 she had not, and this page will not guess." The layers frame appears only at the arena-tour trauma paragraph, where she applied it.                                                                                                                                                                                                                                                                                                                      |
| **P0-06** | resolved | Cold open: "the reason she names first is mental" — the absolute is gone. H2 9 carries "my body is aging. I felt it in Paris." The L'Équipe material is marked "In an L'Équipe interview of uncertain date," and the FAQ now carries the same marking (residual 4a from the initial verification, closed). FAQ reads "named mental preparation ahead of physical conditioning."                                                                                                                                                                                                                                                                                     |
| **P0-07** | resolved | `grep -i "Achiever trusts\|scoreboard is the point\|She checks with them"` returns nothing. The discriminator is content-based and testable against both quoted questions: "A Three asks whether the result was enough, and it never is; 9takes' own [Type 3](/enneagram-corner/enneagram-type-3) page calls it a moving finish line. Biles takes the win as given and goes straight to whether the thing that broke can break again." Consistent with `enneagram-type-3.md` L44/L199.                                                                                                                                                                              |
| **P0-08** | resolved | `grep -i "confirm the result\|already settled\|confirmation of settled"` returns nothing across body, H2s, FAQ and TL;DR. Body: "asked whether she had done it," with Boorman's competing gloss quoted in place. TL;DR bullet is "Takes the question to a person." The Rabbit Hole falsifier no longer rests on the settled-result premise.                                                                                                                                                                                                                                                                                                                         |
| **P0-09** | resolved | "At the 2023 World Championships in Antwerp… Laurent Landi stood on the landing mat and did not touch her" — past tense, dated. TL;DR: "half a point at the 2023 Worlds." H2 9: "The coaches she means, Cecile and Laurent Landi, left World Champions Centre in December 2024," with no replacement asserted. No present-tense WCC arrangement anywhere in reader-visible text.                                                                                                                                                                                                                                                                                    |
| **P0-10** | resolved | "The way she tells it now, the mechanism was already clear to her" attributes the reasoning to her adult account; the behaviour stays unhedged. The frame conversion survives verbatim: "The hallway is the earliest place this pattern is visible, which is not the same as its cause; Adria went through the same placement and came out someone else." Adria is not typed. PROTECT-03 is word-for-word intact and the closing callback reads as continuity. The revision additionally removed "Sit with what that child did," which reduces rather than adds interpretive pressure on this passage.                                                              |

## Accepted improvements check

**Nineteen of nineteen complete.** The single outstanding item from the initial verification is closed
and the eighteen previously confirmed were re-checked against the compressed text, because several
sentences carrying a P1 repair were rewritten for length.

- **P1-13(b) — now completed.** Was `partial, deferred with reason` under the word budget. Shipped as
  "What marks a Six, the Enneagram's Loyalist, is the shape of the fear: aimed at a named future event,
  and quieted only by a person she trusts." It sits after PROTECT-02's two bookend sentences rather
  than inside them, and both of those remain verbatim.
- **Survived compression intact:** P1-01 (Memmel concession and "a vault nobody else has competed"),
  P1-02 (Nassar appositive), P1-03 (Barbosu clause, body and FAQ), P1-04 (de-counted key-stat label;
  "when she cried in front of anyone"), P1-05 (all four: "last afternoon", "10,700 kilometers",
  "Shanon", "she says people made her ashamed of"), P1-06 ("the vocabulary was already in place"),
  P1-07 (two falsifiers beside the confidence label in the body, the third in the Rabbit Hole),
  P1-08 (loyalty resting on "She was free to leave and stayed" plus the contemporaneous 2021 quote,
  remorse demoted to corroboration), P1-09 (residue named), P1-10 (Two/Eight discriminators off
  distress), P1-11 ("Anxiety by itself is not a type"), P1-13(a) ("five skills named after her in the
  code of points"), P1-14 (Type 3 line quoted with the anti-Three context), P1-15 (Colts clause gone;
  "since she was six"; "by the summer of 2026, still could not say"), P1-16 (citations now also carry
  the _Call Her Daddy_ episode and the _Romper_ piece), P1-17 ("the watching is part of why she
  stayed"), P1-18 ("Neither made the argument that deserves answering, so here it is"), P1-19
  (confidence label re-set and scoped).
- **P1-12 — completed, by a stronger route than specified.** The brief asked to date the 50-50 in
  `description`; `description` now drops the perishable claim entirely ("Simone Biles never looked at
  the ground. Her coach recalls seeing her get lost in the air twice in twelve years. Inside the
  Enneagram Type 6 pattern.") while the TL;DR bullet and the FAQ both carry "As of April 2026." The
  heading is de-aged and the anchor `simone-biles-left-the-answer-at-50-50` matches the FAQ
  cross-reference. Freezing the frame by removal satisfies the item's purpose.
- Two P1-adjacent lines were cut for length without loss: the Landi "I felt like I failed him" quote
  and half the remorse quote. Both belonged to the pre-P1-08 remorse-led chain that P1-08 explicitly
  demoted, so their removal is consistent with the accepted repair rather than a reversal of it.

## Protected-hit regression check

**Zero regressions.** All nineteen verified by fixed-string match against the current draft. Four
warrant a note because the revision pass edited inside or beside them, and one carries a residual.

- **PROTECT-05 — amended as required, function intact, one residual.** The concession is present, still
  ahead of the rebuttal, still concedes a real cost landing on real people: "An Olympic team is three
  other women who trained five years, and a decision Biles made in a hallway cost them the gold they
  were favored to win. That cost landed on real people, and Biles has never argued otherwise." The
  closing sentence is verbatim. The false medal clause and both off-by-one counts are corrected, and
  "defensible to three other people" now agrees. The residual is the replacement premise — see
  Remaining work 1.
- **PROTECT-15 — intact.** The TL;DR accordion carries all five bullets (three rewritten by P0-08,
  P0-09 and P1-12, all authorised) and the Rabbit Hole retains "For the Enneagram nerds. The rest of
  the analysis stands without it." The protected property is navigability, and it is undamaged.
- **PROTECT-17 — intact.** "The tell is where the humor points. Hers lands on her own fear, a pressure
  valve on dread rather than an exit." Only the British-to-American spelling changed inside the
  protected sentence.
- **PROTECT-19 — intact.** The falsifier move survives and all three falsifiers remain enumerated: two
  in the body beside the confidence label ("she rebuilds without a trusted circle, or competes the
  double pike unspotted while the deduction still stands"), the third in the Rabbit Hole ("she settles
  Los Angeles without consulting the people she consults"). The list compression removed duplication
  P1-07 had created, not the move.
- **PROTECT-04 and PROTECT-10 — intact, each trimmed by one non-protected element.** The timeline lost
  its "walk off" beat and the Senate section lost the "burden to carry" family clause. Neither is a
  named component of its protected item: PROTECT-04's procedural form, one-touch warm-up gloss and
  `inner-thought` landing-mat beat are all present, and PROTECT-10's evidence-to-theory pairing —
  testimony quoted verbatim and first, then the authority paradox — is unweakened. Recorded so a future
  ledger audit does not read these as regressions.
- **PROTECT-01, 02, 03, 06, 07, 08, 09, 11, 12, 13, 14, 16, 18 — verbatim.** The ground bookend at both
  ends, the two-questions spine and the Type 6 sentence, "Verification was the only power on offer.",
  the Osaka distinction, the half-point spotter sentence (amended only by P1-01's four words), "she does
  not name Tokyo", the twisties FAQ framing, the 2015-vs-2024 turn (trailing tense only), the unresolved
  50-50 ending, the declared so/sx uncertainty, "body in the room", Nellie's barriers and "Where'd you
  come from?", and "my love blanky" with the Owens ruling.

## Remaining work

**1. One repair-introduced assertion has no source trail — owed before publication, not gate-blocking.**
The PROTECT-05 repair replaced a false consequence with an unsourced one:

> "…a decision Biles made in a hallway cost them the gold they were favored to win."

`grep -i "favou\?rite\|favored\|favoured"` returns nothing supporting this in `evidence-packet.md`, in
`docs/content-analysis/research/Simone-Biles.md`, or in the entity-gaps file. The packet's Tokyo
team-final record carries only the outcome — "Tokyo team final: withdraws after the vault; USA wins
silver" (packet L94). Two claims ride on the clause: that the United States were favoured for team gold,
and that the withdrawal cost them it. Neither is contradicted anywhere on the page, and both are
plausible, which is exactly why this is easy to ship uncited — the previous cycle's error in this same
sentence was also plausible-sounding. This is not counted as an open P0 (no synthesis item covers it)
and not a protected-hit regression (the concession's content, function and position all survive), but it
is the one item that fails the "no new factual assertion without a source trail" check. Minimum
remaining action: add a packet entry supporting the pre-final favourite status, or hedge the clause to
what the record carries — the team was beaten to gold after she stopped — which costs no rhetorical
force, since the concession's weight comes from "That cost landed on real people."

**2. Headroom is 10 words.** `blog-lint.sh` passes but warns. Two consecutive cycles have now finished
against the ceiling, and the revision notes are right that the page is expensive per argument rather
than bloated. The next substantive addition — including the grader's deferred TO-REACH-A interior beat
inside the Paris all-around final — needs a structural cut, not line-level compression. The revision
pass nominates the H2 8 calf paragraph, which the Paris FAQ duplicates; that remains the cheapest
funding source.

**3. P0-02 acceptance-test deviation — advisory, unchanged, counted resolved.** The literal grep still
returns one hit, at draft L647 inside the EDITOR PASS NOTES comment, which exists to stop the wrong
name re-entering. It is excluded from the reader-visible hash and stripped on push. The substantive
prong — every italicised publication name resolves to a real, locatable source — passes, and the tool
contamination is gone. Flagged again so a future gate tightening does not mistake the annotation for
the defect.

**4. Standing compression hazard, now documented.** This pass silently downgraded three INLINE quotes
to VAGUE by replacing outlet names with "the same episode," and introduced one strong `[X,-not-Y]`
contrast pair, both caught before finishing. The rule now recorded in the draft notes — any compression
touching a source lead-in must re-run `blog-source-audit.mjs`, not just the lint — should survive into
the next refresh. Re-verified independently here: 8 inline, 0 vague, 0 untagged.

**5. Evidence-packet corrections — both closed.** CLM-09 (two-up two-count) carries its correction and
the reason it was wrong. The `Q7520786` QID at packet L44 is now `Q7520267`, with the superseded value
recorded inline so a refresh cannot re-inject it. Nothing further is owed to the packet from this
review except item 1 above.

**6. Open research, logged and non-blocking:** RQ-01 (FIG substitution mechanism), RQ-02 (locate the
"point of strength" venue), RQ-03 (whether the 2025–2028 Code still carries the 0.5), RQ-05 (the
visual-spotting technique claim, which is why P2-01 correctly did not ship). Each has a safe repair
already in the draft that holds under either answer. Also carried forward: TESTIMONY LEDGER entry 10
(Cecile Landi, "a little something in her calf") is ledger-only and absent from the body, which predates
this pass and is not a regression.
