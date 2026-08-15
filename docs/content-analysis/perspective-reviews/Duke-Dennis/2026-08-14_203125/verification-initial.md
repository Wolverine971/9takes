---
artifact: perspective-verification
schema_version: 1
subject: Duke-Dennis
draft_sha256: d5bce426b94be999eaf53dde0ccba793f0041d9f946910448938ed294749ae93
final_content_sha256: 984b077ad1de35afdcafe6ffebc45e073cdd8e0e06517309d53ce41e5190d119
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-08-15T02:08:19Z
path: docs/content-analysis/perspective-reviews/Duke-Dennis/2026-08-14_203125/verification-initial.md
---

## Verification verdict

**Pass.** All six P0 repairs are complete against their own acceptance tests. All fourteen protected
hits survive, twelve of them by exact string match and the remaining two by function. Fourteen of the
sixteen accepted P1s are complete; two shipped partial with reasons the synthesis's own budget ledger
anticipated. No new factual assertion entered the draft without a source trail.

Provenance checks:

- Synthesis `draft_sha256` = `context.json` `draft_sha256` = supplied `--draft-sha`. Match.
- `draft-reviewed.md` reader-visible hash recomputes to `654733a3f5…`, identical to the
  `reader_visible_content_sha256` recorded in `context.json`. The frozen snapshot is the one that was
  reviewed.
- Current live draft reader-visible hash: `984b077ad1…`. Changed, as expected.
- `lastmod: '2026-08-07'` is byte-identical to the snapshot. The pass did not touch it.

Four claims carried real risk because they were new relative to the shared evidence packet or because
the packet actively contradicted the editor. I researched each rather than accepting the resolution log
at face value. All four came back in the editor's favor:

| Claim                                                      | Result                                                                                                                                                                                                                                                                                   |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0-06 — does Vibe carry "risk my freedom for the content"? | **Yes.** The Yahoo syndication (Preezy Brown, Vibe, 2025-08-18) carries both quoted sentences verbatim. Packet CLM-11b was wrong; the "per Vibe" attribution was already correct.                                                                                                        |
| P0-01 — the civil suit                                     | **Confirmed.** Don White, 33, licensed security officer; state district court, San Antonio; >$1M; six defendants — AMP Entertainment, Duke Dennis, Kai Cenat, Henry Wolf, Joshua Pujols, Lavoune Clarke. Punch attributed to Clarke, AMP security. San Antonio Express-News, 2026-06-17. |
| P0-01 — the disposition                                    | **Confirmed.** Misdemeanor trespassing and evading-arrest charges dismissed after completion of a pretrial diversion program, per Express-News court-record reporting.                                                                                                                   |
| P0-02 — _Sneaker Shopping_ date                            | **Confirmed first-hand.** `yt-dlp` on `coql2j3ugo8` returns upload_date `20230529`, channel Complex. The draft's "May 2023" is right.                                                                                                                                                    |

Two further supporting facts introduced by accepted P1s check out: RaKai, Rayasianboy and Tota are
documented as AMP _affiliated_ members distinct from the six-man core (P1-10), and `IShowSpeed.md` and
`Druski.md` both carry `enneagram: 8` and both sit in this draft's `suggestions:` frontmatter, so
P1-14's unflattering reference class is literally the set of neighbors the page renders.

## P0 resolution check

**P0-01 — San Antonio paragraph — resolved.**
All three acceptance clauses hold. Every legal-status assertion in the section now carries a year:
"later dismissed after he completed a pretrial diversion program, per court records the San Antonio
Express-News reviewed in June 2026" and "That same month a mall security officer sued." Stripping
Duke's two quotes leaves the factual account intact end to end (arrest, date, charges, outlets, Kai not
arrested, return to stream, disposition, suit). No sentence attributes the alleged assault to him — the
filing "attributes the punch the officer alleges to a member of AMP's security team." The paragraph was
also reordered to arrest → his answer → disposition → live suit, which resolves defect (c) beyond the
minimum repair; the charges-only register of SUBJ preserve #5 is held, and Clarke's separate pending
felony charges were correctly _not_ imported into Duke's paragraph.

**P0-02 — source card and dependent claims — resolved.**
The card now runs through "you've done Sneaker Shopping on Complex, but that's it," so both exceptions
Speedy names on tape sit inside the quotation. I verified them directly against
`youtube-transcripts/duke-dennis-360-with-speedy-2024.md`. The episode is named in reader-visible body
prose, outside the collapsed accordion, inside the stress section: "The _Sneaker Shopping_ episode
Speedy names ran in May 2023." Both dependent claims are scoped and dated — body "no sit-down interview
from 2017 to 2024," FAQ 1 "seven years without a sit-down interview, 2017 to 2024." I inventoried every
ellipsis in the piece; none removes a named counterexample to the sentence it supports.

**P0-03 — counterarguments — resolved.**
"Duke declines it" is gone. The paragraph now concedes the compliments beat with the audience-shift
detail and then discriminates: "Threes metabolize attention as fuel, and Duke takes some of it… What he
will not do is arrange the work around it." Verified against the transcript, including the 90%-male to
50/50 detail. A reader who watches the full episode cannot name a pro-Three statement the page has
neither used nor accounted for. The falsifier clause is still last in the paragraph.

**P0-04 — imputed status resentment — resolved.**
The beat is cut outright, with no replacement and no disclaimer. Exactly one `inner-thought` block
remains in the draft (the reception-night beat), and it maps entirely to tape. The FORMULA FINGERPRINT
LEDGER was updated to record the cut and to instruct later passes not to re-add an inferred interior
beat, which closes the loop on the fresh-eyes request this supersedes.

**P0-05 — closing beat — resolved.**
The "Somewhere in South Carolina" availability sentence and the "no sign he ever will" forecast are both
gone. The close now reads "The one label he never answered is the one his aunt gave him. He has had
three decades to ask what she meant. He hasn't." No assertion or implication that the aunt is alive,
reachable, or askable; no forecast about his future behavior; the death is correctly not introduced
under either branch of RQ-03. PROTECT-11 survives byte-identical.

**P0-06 — "risk my freedom" attribution — resolved (finding did not survive research).**
I re-ran this rather than accept the reversal, because the packet said the opposite. The Yahoo
syndication of the Vibe piece carries both quoted sentences verbatim, so the existing "per Vibe" was
already correct and re-attributing to Hollywood Unlocked — which only paraphrases it in a headline —
would have _introduced_ the error. Adding the openable syndication to `citations:` satisfies the "in a
source someone can open" half of the acceptance test. The freedom-vocabulary chain stays whole.

## Accepted improvements check

Complete, verified in the current text: **P1-01** (Dee sentence scoped to the naming question, asserted
reader behaviour and the unverifiable negative both dropped), **P1-02** (apology attributed to Kai,
"He paid it." deleted, PROTECT-04 arithmetic sentence verbatim), **P1-03** (RDC example rewritten to
"territory defended, war declined," certainty marker added, plus the knock-on 8w7 discriminator the
editor caught and repaired), **P1-04** (null hypothesis relocated into the stress section, diagnosis
deferral now names the compliments objection), **P1-05** (as-of-stamped scale, "rizz" glossed as
Oxford's 2023 word of the year, Enneagram appositive at the _end_ of the first diagnosis paragraph so
the answer block still leads with the answer at 46 words, NBA 2K gloss moved to first use and removed
from section 3), **P1-06**, **P1-07** (zero "D-Block" occurrences remain), **P1-08** ("per Sportskeeda"
in text plus the URL in `citations:`), **P1-09**, **P1-10**, **P1-11**, **P1-12** (route
`enneagram-connecting-lines` confirmed to exist; internal link count unchanged at 7), **P1-14**,
**P1-15**.

Two shipped partial, both deferred with a stated reason rather than dropped silently, which the
synthesis's budget ledger explicitly contemplated:

- **P1-13 — partial, deferred with reason.** The diagnosis half shipped: the discriminating first-person
  quote ("the being on call 24/7 is what makes the Army… unbearable for me") is verified in the
  transcript and now sits in the diagnosis section, followed by "The Army's sin was owning his
  availability." The "why not a Seven" clause (~30 words) was dropped against a 4,495/4,500 ceiling.
  This does not fail the gate — it is the cheapest remaining accepted item and the most expensive to
  seat, which is exactly the tradeoff the brief named. All three anti-authority repetitions survive, so
  PROTECT-06 was not spent to fund it.
- **P1-16 — partial, deferred with reason.** The in-draft half is done — "more than two million views"
  is now growth-proof. Archiving the originating X post and the Primetimer debunk to durable snapshots
  was not attempted, correctly, since it means writing to a third-party archive service unprompted.
  This is a human pre-publish task, not an unresolved draft edit.

## Protected-hit regression check

Zero regressions. Twelve verified by exact string match against the current draft: PROTECT-01 (both
sentences), 02, 03 (still **professor**, never student), 04 (both halves), 05, 06, 07, 08 (both halves),
09, 10, 11, 12, 14.

Two need a note, and both survive:

- **PROTECT-07 — arrow discipline.** The null hypothesis was _moved_, not weakened: it left the Rabbit
  Hole and now reads "The ordinary explanation covers a lot of it: a twenty-year-old with no friends, no
  car, and no language stays in his room" in the stress section. P1-04 authorized exactly this. The
  "Arrow behavior arrives under pressure and leaves with it" sentence is byte-identical, the
  corpus-departure disclosure survives and was strengthened by P1-14, and the DISTRIBUTION LEDGER still
  reads 1 because the relocated sentence carries no type mechanics. Rabbit Hole is still `<details>`
  with no `open` attribute.
- **PROTECT-13 — closing label inventory.** This is the one protected item that took collateral damage,
  and it still passes. The sentence stating the decay mechanism as a general law — "His theory of why
  the tribute sours is almost a law of physics: 'People overdo and overuse everything they come in
  contact with. What starts off cool eventually turns corny.'" — was cut from the body to pay the word
  budget, and it was not one of the four payers the brief named. But the protected _function_ is the
  section stating the mechanism that generates the next label, and that survives three ways in the same
  section: Duke's own decay quote one paragraph above ("It starts off cool, funny, and then it gets
  cringy, lame… we get it now… Let it go."), the framing sentence "a meme repeated at you every day
  stops being a joke and becomes a schedule," and "The label machine has since minted a bigger one:
  'aura'" — which is the generative claim shown rather than asserted. The full quote also survives in
  FAQ 3. The layered sequence is unchanged from the snapshot: rizz → Unc/1987 → aura → professor →
  closing recap. Equivalent coverage, so not a regression, but it is the item to watch if a future pass
  trims this section again.

No protected hit was cut to fund an accepted item.

## Remaining work

Nothing blocks the gate. Four items for the human before publish, in priority order:

1. **RQ-03 remains open and is correctly marked `needs_human`.** Whether the aunt who died in July 2025
   is the aunt who named him is not resolvable from the public record and was rightly not attempted.
   P0-05's repair is branch-safe, so the close holds either way. If DJ or new reporting ever settles it
   against the draft, the closing movement needs a rebuild rather than a trim.
2. **P1-16's archiving.** Snapshot the originating X post and the Primetimer debunk to a durable archive.
   The hoax beat currently rests on the two most deletable citations on the page.
3. **The freshest legal fact will age fastest.** The suit is printed as a dated filing event, not as a
   present posture, which is the durable construction — but a live civil action naming the subject is
   the one line on this page most likely to need a re-check before publish and again at the next refresh.
4. **Two sub-gate elision notes**, neither reaching the P0-02 acceptance test, both worth a glance since
   they are new to this pass. The source-card ellipsis still elides Speedy's hedge ("maybe one of your
   first _big_ interviews"); the named counterexamples are what the test protects and they are now inside
   the quote, so this passes, but the hedge is the last piece of that passage still outside. Separately,
   the punctuality quote was trimmed to "If we had to rank… who's been the most on time," which drops the
   reference class ("in order of the guests we've had on 360"). Surrounding context supplies it, so this
   is a legibility nit rather than an evidentiary one.

Carried forward unchanged from the editor's pass, for the record: 7 internal links against a 2–5 creator
spec, and thin word headroom at 4,495 against a 4,500 ceiling. Both are pre-existing WARNs, not
regressions introduced here.
