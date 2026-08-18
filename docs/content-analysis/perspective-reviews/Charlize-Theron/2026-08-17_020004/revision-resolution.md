---
artifact: perspective-revision-resolution
schema_version: 1
subject: Charlize-Theron
draft_sha256: 1d74c2c827e026895d7102699b8a14eac37d524dd57f3e62010c7af61a5e9798
resolution_status: complete
resolved_at: 2026-08-17T08:15:29Z
path: docs/content-analysis/perspective-reviews/Charlize-Theron/2026-08-17_020004/revision-resolution.md
---

This pass was triggered by the grade sidecar (C, 7.8, three caps), not by an open perspective gate.
`verification-initial.md` returned `verification_status: pass`, `open_p0: 0`,
`protected_hit_regressions: 0`. The perspective work list was therefore limited to the two accepted
P1 items the verifier marked **completed with a gap**, plus a regression re-check of all nine P0
items and all ten protected hits, since the grade-driven edits landed in the same sections.

## Resolution log

### Accepted P1 items the verifier left incomplete

| ID    | Status | Edit                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ----- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1-13 | fixed  | TL;DR bullet 5 was the fourth age reference the synthesis counted and the only one left as a bare present-tense claim: "At 51 she plays a goddess whose whole power is keeping a man where she wants him." Changed `plays` to `played`. Read on any future date it now makes no claim about that day. The verifier's minimum action is met by the tense option rather than the 2026-anchor option, because the bullet sits four lines above the body's "born on August 7, 1975, and turned 51 in 2026" and a second anchor would restate it. |
| P1-15 | fixed  | _Fury Road_ row read "the first of two shoots she has said emotionally finished her, _Apex_ being the second" with the count carrying no inline date. Now reads "the first of two shoots she said in 2026 had emotionally finished her, _Apex_ being the second." The acceptance test asked for a date explaining the count or no numeric claim; the count now carries its own date inline rather than relying on recovery from the _Apex_ row two lines down.                                                                               |

### P0 regression re-check (all nine, none reopened)

Verified mechanically against the reader-visible body after the edits. No P0 was reopened and none
of this pass's edits touched a P0 repair, but four sat close enough to the edits to warrant naming:

| ID    | Status          | Check                                                                                                                                                                                                                                                                                                           |
| ----- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0-02 | fixed (carried) | This pass edited TL;DR bullet 5, which is P0-02 territory. `\bten\b` over the reader-visible body still returns zero; the age-of-onset repair is intact and the bullet's 51 remains anchored to the body's 1975 birth date.                                                                                     |
| P0-07 | fixed (carried) | This pass added three dates ("she said in 2008", "she said in 2026", "she told ScreenRant in April 2026"). None misattaches. The _Atomic Blonde_ intro still opens "Training for _Atomic Blonde_ in 2015"; both _Apex_ references still read "forty-nine".                                                      |
| P0-08 | fixed (carried) | This pass cut the corpus-stat sentence from the diagnosis section and rewrote its opening from "she does not say the night in 1991" to "she goes past the night in 1991". `diagnos` still returns zero; the P1-04 clause is preserved verbatim; the concession "any read of her has to hold both" is untouched. |
| P0-05 | fixed (carried) | This pass rewrote the empathy-turn bridge one paragraph below. Theron's named conduct ("a hundred thousand dollars for every minute") and her own dated first-person reason ("because I didn't feel safe") are both intact and both still sit above "Here is what the word difficult is doing in her case."     |

P0-01, P0-03, P0-04, P0-06 and P0-09 were re-checked by the same mechanical greps and are unchanged.

### Evidence work that narrows P0-04's broader acceptance test

The verifier recorded one adjudication: P0-04's test as written ("every direct quotation attributed
to Theron in reader-visible text carries an outlet and date") was not met by the article as a whole,
with roughly eighteen quotations resting on section-level contextual attribution. The verifier scored
the item resolved because the revision had introduced none of them, and routed the wider standard as a
scoped follow-up.

That follow-up is now substantially done, because the grade's Evidence cap named the same defect. This
pass scoped or dated: the Joffrey knees line (`she said in 2008`, S-17), the four quotes in "What
Charlize Theron looks like when she breaks" (chain named to Cooper / July 2025 at the section's first
quote and reinforced mid-section), the _Apex_ "emotionally and physically broken" line (ScreenRant,
April 2026, S-06a), and the single-motherhood cluster (chain named to Cooper / July 2025).

One item in the verifier's list of eighteen was not a contextual-attribution problem at all:
**"we don't hide this shit"** appears in neither `evidence-packet.md` nor
`docs/content-analysis/research/Charlize-Theron.md`. It is an unsourced quotation placed in her mouth,
the same defect class P0-04 was raised about. It was cut and replaced with the packet-verified
"I broke the cycle." (_Call Her Daddy_, ~26:08), which carries the same function. Logged in the
testimony ledger's exclusion block under PROTECT-10's standard.

Still resting on section-level contextual attribution, unchanged from the frozen snapshot: "I really
think I became a producer…", "she is who she is and I'm not here to change her…", "Once I got out of
the shock of it…" (the sentence carrying it names 2019), "The lotus flower can only do so much…",
"while my daughters are there", and "That will be their story to tell".

## Protected hits checked

All ten survive. Verified by exact-string match on the reader-visible body after every edit, seventeen
strings across the ten items. Zero regressions.

- **PROTECT-01** — the two-door ending. Untouched. The closer "A year on, she still could not wear a bra
  without it hurting." is verbatim. Related edit, made deliberately _in its favour_: the _Apex_ damage-row
  cell used to quote "I can barely wear a bra. It's still that bad.", so the closer was the reader's second
  encounter with the image. The cell now reads "Torn intercostal muscles, an injury she says she had never
  had before" (packet-verified at S-06a), and the closer owns the image outright. This addresses the grade's
  MINOR note without touching the protected line. The verifier's standing note — that "A year on" sits after
  the July 2026 _Odyssey_ paragraph but anchors to the February 2025 _Apex_ shoot — is unchanged and still
  open for a future pass.
- **PROTECT-02** — "Being done placating and being pleasant to work beside are different achievements, and
  she has one of them." Verbatim. Its paragraph was not touched.
- **PROTECT-03** — the _Bombshell_ reversal. Verbatim.
- **PROTECT-04** — the damage-report table as a form. Three columns, same header, six rows. Two cell
  _contents_ changed (_Æon Flux_ paralysis claim now attributed, _Apex_ cell de-duplicated); shape did not.
- **PROTECT-05** — "That is the origin story, and everybody remembers it as luck. It was volume." Verbatim,
  and deliberately retained as one of the three not-X-but-Y moves the grade said had earned their place.
- **PROTECT-06** — Kormákur's vulnerability quote. Verbatim and unmoved, still immediately after "I actually
  couldn't finish the last day". Its _setup_ sentence changed from "Kormákur did not say her toughness." to
  "Afterward, asked what surprised him most about working with her, he answered:" — a retired negation move.
  The quote now lands as the reveal instead of being pre-empted by its own setup. Protected string untouched.
- **PROTECT-07** — "The fortress and the healthy choice can be the same building…" and "she may well be
  right." Both verbatim. One sentence was **added after** it, not into it, taking the grade's optional
  Originality item: "She had tried the other way once, with the man who told her she was the problem, staying
  to fix herself rather than leaving him, and the fortress went up after that." This builds on the hedging
  structure rather than resolving it.
- **PROTECT-08** — the core-fear move. Verbatim, and see **Unresolved decisions** below: this pass
  deliberately declined to retire it despite the grade counting it as a fourth negation-reversal.
- **PROTECT-09** — the empathy turn's mechanism. "make yourself easy so the man stays calm", "Nobody thanked
  her", and "None of which makes the War Rig fun for anyone else." all verbatim. The bridge sentence above
  them lost its not-X-but-Y turn ("An eight who has done that job does not become difficult on purpose. She
  becomes unwilling…" is now "An eight who has done that job becomes unwilling…"). The mechanism, the
  antecedent, and the non-excuse are all intact; the distribution ledger is corrected from "two-sentence
  bridge" to "one-sentence bridge".
- **PROTECT-10** — the exclusion standard. The Patty Jenkins note is untouched and "No current partner is
  publicly established." is verbatim. The standard was applied once more this pass, to "we don't hide this
  shit".

## Unresolved decisions

**needs_human — RQ-06, and this pass increased the exposure.** The _Call Her Daddy_ transcript is still
not archived to `docs/content-analysis/youtube-transcripts-people/` (confirmed again: no Theron file).
Every timestamped quotation from video `zL6N55FJuYI` remains second-hand against the known two-person
auto-transcript attribution trap. The Evidence repairs above deliberately made the piece's reliance on
that episode **more visible**, naming Cooper and July 2025 as the scoped chain for two full sections that
previously ran on bare quotation marks. That is the correct editorial move and the right traceability
outcome, but it means more of the article now openly rests on an unarchived source. Unchanged as a
pre-publication blocker; it should be closed before publish with the load-bearing quotes spot-checked
against the audio, not deferred to refresh.

**needs_human — a genuine conflict between two quality gates, resolved against the grade.** The grade's
Writing cap said "Retire the negation-reversal engine down to three." One of the thirteen it counted is
PROTECT-08's core-fear move, verified by exact string at the perspective gate. Retiring it would have
been a protected-hit regression; keeping it leaves the surviving count at four rather than three. This
pass kept it, on the reading that it is a definitional list ("not death, failure, or humiliation") rather
than the rhetorical engine the cap is aimed at, and that a jury protected hit outranks a grade
suggestion. The other ten were retired. If a later pass or DJ decides the grade's number is the binding
one, retiring PROTECT-08's move is a deliberate protected-hit override and should be recorded as such,
not done quietly.

**needs_human — one grade item rejected on similarity grounds.** The grade listed the diagnosis-section
"living at their whim" quote as its one "vague" slot: it carries a year but no outlet. Closing it trips
`scripts/same-type-similarity.mjs` against Nara-Smith, which uses the same source in its own diagnosis
section — 0.149 for "On _Call Her Daddy_ in 2025", still 0.058 after rephrasing, against a 0.04 threshold.
The fingerprint ledger had already recorded this exact trip as fixed at an earlier pass. Reverted, and the
epigraph two screens up carries outlet and date. The standing tension is that the corpus now has two Type-8
subjects whose psychological evidence comes from the same podcast, and the similarity scan cannot tell
"same source, honestly named" from "same phrasing, reused". Worth a tooling decision rather than another
per-draft workaround.

**Carried, non-gating, untouched by this pass.** The verifier's two framing notes both survive as recorded:
"He let neither of them off" is still a narrator assertion about who Miller was criticising, which the
packet lists as unsettled (Disputes item 4); and the _Atomic Blonde_ (2017) row is still a release-year
header read against a 2015 injury, uniform with the rest of the table.

This pass does not declare the gate passed. `/blog_perspective_verify_people` reruns against the edited
draft.
