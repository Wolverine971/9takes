---
artifact: perspective-verification
schema_version: 1
subject: Charlize-Theron
draft_sha256: 1d74c2c827e026895d7102699b8a14eac37d524dd57f3e62010c7af61a5e9798
final_content_sha256: f617f30519206d0ad6c6ac170f219906953be6760133d74e6a6b11115d9ce39e
verification_status: needs_human
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-08-17T08:23:07Z
path: docs/content-analysis/perspective-reviews/Charlize-Theron/2026-08-17_020004/verification-final.md
---

## Verification verdict

Snapshot integrity confirmed. `context.json` and `synthesis.md` both carry
`draft_sha256: 1d74c2c827e026895d7102699b8a14eac37d524dd57f3e62010c7af61a5e9798`, matching the supplied
SHA. Recomputing the reader-visible hash of `draft-reviewed.md` returns
`08365915ba254b3bbb69e642c82d42c94e5f03e9ef2bfbfc4eb2ea6f54c6c624`, equal to the
`reader_visible_content_sha256` recorded at freeze. The live draft now hashes to
`f617f30519206d0ad6c6ac170f219906953be6760133d74e6a6b11115d9ce39e` (was
`c0af4fe5be8c8829e9077548065911c0d43f2180b3d7a3fb4bab90f7d31542c4` at `verification-initial.md`).

**All nine P0 items remain resolved. All fifteen accepted P1 items are now complete — the two gaps
`verification-initial.md` recorded (P1-13, P1-15) are closed, and I re-ran their acceptance tests rather
than accepting the log.** All ten protected hits survive; seventeen exact strings plus the table's shape
match. No protected insight was deleted, tightened away, or displaced.

The status is `needs_human` rather than `pass` for one reason, and it is not a P0 or a regression count.
**The revision introduced one new factual assertion, as part of a repair, that has no source trail** —
the check at step 6 of the verification method. It is a single trailing clause in the passage the jury
protected most carefully for its hedged register, and it is contradicted by the draft's own dates. Detail
in **Remaining work**; the minimum fix is a five-word cut.

Everything else in this pass is clean. I independently re-verified the four dates the revision added
(`she said in 2008`, `she said in 2026`, `she told ScreenRant in April 2026`, `she told Cooper in July
2025`) and the two quotation substitutions, and every one traces to the packet:

- **"she said in 2008"** (Joffrey knees) — S-17 carries "the Joffrey knee/depression account" at 2008 and
  explicitly notes it "dates a quote the draft uses undated." Correct.
- **"she told ScreenRant in April 2026"** — S-06a is the ScreenRant _Apex_ cover story, 2026-04-22. Correct.
- **"the first of two shoots she said in 2026 had emotionally finished her"** — the 2026 date matches S-06a;
  the two-shoot count rests on the _Apex_ press line `verification-initial.md` verified independently
  ("except for _Mad Max: Fury Road_, where emotionally I was done"). Correct, and now dated inline.
- **"I broke the cycle."** — replacing the unsourced "we don't hide this shit". Packet-verified at
  `evidence-packet.md:178` and `research/Charlize-Theron.md:107`, _Call Her Daddy_ ~26:08. The cut was the
  right call: I confirmed the removed phrase appears in neither file. This is PROTECT-10's standard applied
  a third time rather than relaxed, and it is logged in the ledger's exclusion block.
- **"Torn intercostal muscles, an injury she says she had never had before"** — packet line 203, "I tore
  some intercostal muscles… Which, by the way, I've never done that before." Accurate paraphrase, and it
  de-duplicates the bra image so PROTECT-01's closer owns it outright.

## P0 resolution check

All nine resolved. Mechanical tests were re-run against the reader-visible body of the current draft, not
against the resolution log.

| ID    | Status   | Test result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0-01 | resolved | `grep -inE '\b(boys                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | sons | grandsons)\b'` → zero. The revision changed "helped raise both boys" to "both children"; the only gendered reference to her children remains inside her own quotation ("while my daughters are there"), which is the form Conflicts item 1 specified. |
| P0-02 | resolved | `grep -inE '\bten\b'` → zero. Title is "…the Mask She Built in Benoni"; TL;DR bullet 1 is "The costume she built as a girl." Every specific age in title/TL;DR/FAQs is anchored in the body with a source: 51 against "born on August 7, 1975, and turned 51 in 2026"; 15 against the 1991 paragraph; 2008 against the Rabbit Hole.                                                                                                                                                                                                                                                                                                                                                                                                |
| P0-03 | resolved | No sentence aims the rebuke at Theron. The Telegraph context ships ahead of the quote, and the quote carries its own tail. _Residual, non-gating, carried unchanged:_ "He let neither of them off" is still a narrator assertion about Miller's target, which the packet lists as unsettled (Disputes item 4).                                                                                                                                                                                                                                                                                                                                                                                                                     |
| P0-04 | resolved | `grep -in 'lesbian\|Ricci'` → zero. This pass also cut "we don't hide this shit" — a second quotation of the same defect class the verifier's own list had misfiled as a contextual-attribution problem. Catching and cutting it strengthens the item rather than reopening it. See **Remaining work** for the standing note on the test's literal width.                                                                                                                                                                                                                                                                                                                                                                          |
| P0-05 | resolved | Specific conduct (line 176: the War Rig, eight until eleven, the hundred-thousand-dollar demand, Goellnicht's "full rant") and her own dated first-person account ("because I didn't feel safe," Buchanan, 2022) both sit above "Here is what the word difficult is doing in her case." (line 186). Ordering verified by line number.                                                                                                                                                                                                                                                                                                                                                                                              |
| P0-06 | resolved | The _Æon Flux_ (2005) row is present with the herniated disc, the centimeter-from-paralysis claim now attributed to her, and the spinal fusion. "One line of it is a straight loss" survives. A reader can answer "what did her body pay between the Oscar and Furiosa?" from the article alone.                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| P0-07 | resolved | `firstLetter` opens "Training for _Atomic Blonde_ in 2015…" with CinemaCon dated to 2017 as the disclosure. Both _Apex_ references read "forty-nine". _Residual, non-gating, carried unchanged:_ the table's year column is a uniform release-year convention, so the _Atomic Blonde_ (2017) row still reads against a 2015 injury.                                                                                                                                                                                                                                                                                                                                                                                                |
| P0-08 | resolved | `grep -in 'diagnos'` → zero. "That phrase is the whole case"; "almost the whole woman"; the straight-line claim replaced by "Every one answers something she says she could not stand." The concession is intact and doing work: "The same childhood produced a girl who placated and hid and smiled on cue… The eight is what she built on top of that girl, and any read of her has to hold both." **Note the interaction with the new defect below:** this item exists to stop the article asserting unsourced causal origins, and the sentence flagged in **Remaining work** asserts one — about the relationship rather than the childhood, so it does not trip this test as written, but it cuts against the same principle. |
| P0-09 | resolved | The tiebreaker rests on system behaviour: "Grant all of it, including the cynical reading where deglamming is the strategy. It still does not explain what she did next." Nothing in it rests on the transformations.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

## Accepted improvements check

Fifteen of fifteen complete. Thirteen were confirmed complete at `verification-initial.md` and are
unchanged by this pass. The two that carried gaps are now closed:

| ID    | Status                    | Verification                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1-13 | **complete** (gap closed) | TL;DR bullet 5 now reads "At 51 she **played** a goddess whose whole power is keeping a man where she wants him." Read on any future date it makes no claim about that day. The minimum action was "past tense **or** anchor to 2026"; the tense option is taken, and the revision's reasoning for preferring it — the bullet sits four lines above the body's "born on August 7, 1975, and turned 51 in 2026" — is sound. All four age references the synthesis counted are now handled. |
| P1-15 | **complete** (gap closed) | The _Fury Road_ row now reads "the first of two shoots she **said in 2026** had emotionally finished her, _Apex_ being the second." The numeric claim carries its own inline date rather than relying on recovery from the _Apex_ row two lines down. Test met literally.                                                                                                                                                                                                                 |

Correctly declined, with reasons on file and unchanged: RQ-01 (deferred), RQ-02 (rejected under
PROTECT-10's standard), P2-01 (deferred to refresh per Conflicts item 3), Rabbit Hole placement
(Conflicts item 2, deferred as specified).

Two grade-driven decisions the revision recorded as `needs_human` are **not** P1 failures and do not gate
here; both are defensible and both are correctly logged rather than done quietly:

- **PROTECT-08 kept against the grade's "retire the negation-reversal engine down to three."** Retiring it
  would have been a protected-hit regression. Keeping it is the correct precedence call — a jury protected
  hit outranks a grade suggestion — and the reading that "not death, failure, or humiliation" is a
  definitional list rather than the rhetorical engine the cap targets is a fair one. The other ten were
  retired. If DJ decides the grade's number binds, that is a deliberate protected-hit override.
- **The "living at their whim" outlet attribution left open on similarity grounds.** Closing it trips
  `scripts/same-type-similarity.mjs` against Nara-Smith at 0.058 against a 0.04 threshold. Reverting was
  right for this draft. The underlying problem — two Type-8 subjects whose psychological evidence comes
  from the same podcast, and a scan that cannot tell "same source, honestly named" from "same phrasing,
  reused" — is a tooling decision, not a per-draft one, and should not be worked around again silently.

## Protected-hit regression check

All ten survive. Zero regressions. Verified by exact-string match on the reader-visible body of the
current draft, seventeen strings, plus the table by shape.

- **PROTECT-01 — the two-door ending.** Intact from "At fifteen she was inside a door in Benoni" through
  the close. "which is how she tells it herself" verbatim. Closer verbatim at "A year on, she still could
  not wear a bra without it hurting." No closing thought added beneath it. The revision's related edit was
  made _in its favour_: the _Apex_ table cell no longer quotes "I can barely wear a bra," so the closer is
  now the reader's first and only encounter with the image. That is a genuine improvement to a protected
  hit. **Carried unchanged:** "A year on" still sits after the July 2026 _Odyssey_ paragraph while
  anchoring to the February 2025 _Apex_ shoot, so the nearest antecedent is the wrong one.
- **PROTECT-02** — "Being done placating and being pleasant to work beside are different achievements, and
  she has one of them." Verbatim, line 192.
- **PROTECT-03** — the _Bombshell_ reversal. Verbatim.
- **PROTECT-04** — the damage-report table as a form. Header `| Role | What it cost her | What the industry said it bought |` verbatim; three columns; six rows. Two cell contents changed, shape did not.
- **PROTECT-05** — "That is the origin story, and everybody remembers it as luck. It was volume." Verbatim, and correctly retained as one of the three not-X-but-Y moves the fingerprint ledger keeps.
- **PROTECT-06** — Kormákur's vulnerability quote. Verbatim and unmoved, still immediately after "I actually couldn't finish the last day." The setup change ("Afterward, asked what surprised him most about working with her, he answered:") retires a negation move without touching the protected string, and lets the quote land as the reveal instead of being pre-empted. Improvement, not regression.
- **PROTECT-07** — "The fortress and the healthy choice can be the same building, and nobody asking her about husbands has thought to ask which one it is" and "she may well be right" both verbatim. **Scored as surviving, with a stated reservation.** The protected item is the two sentences _plus the hedging structure of the whole single-motherhood passage_. The revision appended a new sentence after the hedge. The strings survive, the two-sided reading survives, and no insight was deleted, so this is not a regression under the rule as written — but the appended clause answers the question the protected sentence says nobody has thought to ask, and it gets the last word in the passage. That is the item's essential function being leaned on, and it is the same sentence carrying the sourcing defect below. Fixing the sourcing defect resolves the register concern too.
- **PROTECT-08** — the core-fear move. Verbatim, including "Living at their whim" and "is being at the mercy of someone else's decisions." Deliberately not retired despite the grade; see above.
- **PROTECT-09** — the empathy turn's mechanism. "make yourself easy so the man stays calm," "Nobody thanked her," and "None of which makes the War Rig fun for anyone else." all verbatim. The bridge above them lost its not-X-but-Y turn and is now "An eight who has done that job becomes unwilling…" — the mechanism, the antecedent and the non-excuse are all intact, so the tightening passes.
- **PROTECT-10** — the exclusion standard. The Patty Jenkins note is verbatim at `Charlize-Theron.md:108`, inside the testimony-ledger comment block. **Note for future passes:** this string does not appear in the reader-visible body and will read as a false FAIL to any check run against the hashed body alone — the ledger is an editorial comment by design, which is why the hash ignores it. "No current partner is publicly established." is verbatim in reader-visible text. The standard was applied once more this pass.

## Remaining work

**Blocking this gate — one new unsourced assertion, introduced by a repair.**

The single-motherhood passage now ends:

> The fortress and the healthy choice can be the same building, and nobody asking her about husbands has
> thought to ask which one it is. **She had tried the other way once, with the man who told her she was
> the problem, staying to fix herself rather than leaving him, and the fortress went up after that.**

The first half of the added sentence is sourced — she did stay, she did go to therapy to save it, and the
packet carries it (S-22, and `research/Charlize-Theron.md:88`, "I had a narcissistic boyfriend that said…
you're the problem"). **The final clause, "and the fortress went up after that," is a chronology claim, and
nothing supports it:**

1. **No source dates the relationship.** It is undated in `evidence-packet.md` (line 357 states the
   behaviour with no date; the S-22 timeline row carries none) and undated in the research file. The
   article deliberately does not name the man. A reader cannot place the episode, so the ordering the
   sentence asserts is unverifiable from the piece's own evidence base.
2. **The draft's own dates point the other way.** The article states the first adoption at 2012 ("Jackson,
   adopted in 2012") — Theron was 36 — and dates her therapy to "her late thirties" (37+, so 2012 at the
   earliest). The relationship therapy is the only therapy the article describes in any detail. A reader
   who connects those two references lands on the relationship _postdating_ the fortress, which is the
   opposite of what the new clause asserts.

This is the defect class the whole review was convened over — two perspectives returned `trust: broken`
for reaching past the evidence — and it landed in the passage protected as the model for hedged register.
It is also the only unsourced claim in the pass; the revision was otherwise disciplined about this.

**Minimum action, and why this is `needs_human` rather than `fail`.** The one-line fix is to end the
sentence at "…staying to fix herself rather than leaving him." — a five-word cut that keeps the new
observation, keeps the grade's Originality gain, restores the hedge's last word, and drops the unsourced
ordering. Two other routes exist and both are worse: sourcing the chronology means naming and dating the
partner, which the packet does not cover and the article has deliberately avoided; cutting the whole
sentence gives back an Originality item the grade asked for. Which route to take is an editorial call, so
this is routed to a human rather than failed outright. **`open_p0` is 0 and `protected_hit_regressions` is
0 — the counts are pass-shaped, and the deterministic gate will still hold at
`verification_status: needs_human` until this is resolved.**

**Pre-publication blocker, carried forward unchanged.**

- **RQ-06 — the _Call Her Daddy_ transcript is still not archived.** Confirmed again:
  `docs/content-analysis/youtube-transcripts-people/` contains no Theron file. Every timestamped quotation
  from video `zL6N55FJuYI` remains second-hand against the two-person auto-transcript attribution trap,
  and S-22 flags it in the packet itself. The revision's Evidence repairs deliberately made this reliance
  _more visible_ — naming Cooper and July 2025 as the scoped chain for two full sections that previously
  ran on bare quotation marks. That was the correct editorial move and the honest traceability outcome,
  but more of the article now openly rests on an unarchived source, including "I broke the cycle," which
  this pass newly promoted into the family section. Consistent with the synthesis's routing and with
  `verification-initial.md`, this does not gate the perspective review, but it should be closed before
  publish with the load-bearing quotes spot-checked against the audio — not deferred to refresh.

**Carried adjudication, unchanged and still visible.**

- **P0-04's acceptance test is broader than P0-04's defect.** The test as written asks that _every_ direct
  Theron quotation carry an outlet and date. The revision closed six of the roughly eighteen open cases
  (the Joffrey line, the four quotes in "What Charlize Theron looks like when she breaks", the _Apex_
  broken/tap-out line, and the single-motherhood cluster) and cut a seventh as unsourced. Six remain on
  section-level contextual attribution: "I really think I became a producer…", "she is who she is and I'm
  not here to change her…", "Once I got out of the shock of it…" (its sentence names 2019), "The lotus
  flower can only do so much…", "while my daughters are there", and "That will be their story to tell".
  All six are unchanged from the frozen snapshot. I score P0-04 resolved on the same reasoning as the
  initial pass — the revision introduced none of them, and the item's stated defect is repaired twice over
  — and note that the remaining six are now a short enough list to close in one scoped pass if the
  standard is meant to be universal.

**Non-gating notes for a later pass.** Three framings survive that are defensible but slightly ahead of
their sources or their placement: "He let neither of them off" (P0-03 — the packet lists Miller's target
as unsettled); the _Atomic Blonde_ (2017) row header read against a 2015 injury (P0-07 — uniform
release-year convention); and "A year on" taking the _Odyssey_ paragraph as its nearest antecedent when it
anchors to the _Apex_ shoot (PROTECT-01 — the thing to fix if that line is ever touched, not the tense).
