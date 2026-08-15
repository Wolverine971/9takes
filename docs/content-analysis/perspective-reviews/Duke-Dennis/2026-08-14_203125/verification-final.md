---
artifact: perspective-verification
schema_version: 1
subject: Duke-Dennis
draft_sha256: d5bce426b94be999eaf53dde0ccba793f0041d9f946910448938ed294749ae93
final_content_sha256: 4cc08d8f50a43283caa99a1f5a909872a260dbd1b0b06f3b380751544784bf07
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-08-15T03:58:00Z
path: docs/content-analysis/perspective-reviews/Duke-Dennis/2026-08-14_203125/verification-final.md
---

## Verification verdict

**Pass.** All six P0 repairs hold against their own acceptance tests, all fourteen protected hits survive,
and every factual assertion added since the frozen snapshot carries a source trail — four of which I
re-verified first-hand this pass rather than accepting from the resolution logs.

Provenance:

- Supplied `--draft-sha` `d5bce426…` matches `context.json`, `synthesis.md`, `editor-resolution.md`,
  `revision-resolution.md`, and a direct `shasum` of `draft-reviewed.md`. The snapshot chain is intact.
- Current reader-visible hash of `src/blog/people/drafts/Duke-Dennis.md` is
  `4cc08d8f50a43283caa99a1f5a909872a260dbd1b0b06f3b380751544784bf07`, computed with
  `hashReaderVisiblePerspectiveBody`.
- **This is a re-verification, and it was necessary.** The previous `verification-final.md` recorded
  `07dc61be50…` at 03:29:30Z; the draft was edited again at 23:43 local. The changes in that window are
  reader-visible and consistent with items 4 and part of item 6 of that file's own Remaining work list:
  the TL;DR hood-name bullet and the real-name FAQ were past-anchored to the 2024 interview ("An aunt
  named him Duke… By his 2024 interview, he had never learned why"), closing the FAQ/TL;DR lag behind
  P0-05's repaired close. Those edits improve the piece and regress nothing.

Independent research performed this pass (targeted, not a re-audit), all four confirming rather than
overturning the resolutions:

1. Fetched the Yahoo syndication of the Vibe piece. It carries **both** quoted sentences verbatim,
   consecutively: "Jail isn't a place that I would wish on anybody" and "I'm not the type of content
   creator that's going to like risk my freedom for the content." Packet CLM-11b was wrong and the editor
   pass was right to keep "per Vibe". P0-06 is closed on evidence, not on assertion.
2. Fetched the Yahoo syndication of the Express-News suit report (Patrick Danner, 2026-06-17). It confirms
   the diversion dismissal verbatim, the six named defendants (AMP Entertainment, Dennis, Cenat, Wolf,
   Pujols, Clarke), the >$1M demand, the punch attributed to **Lavoune Clarke** "whom the lawsuit
   describes as a member of AMP's security team," and that White "filed the complaint Monday" — June 15,
   2026, which validates the draft's "That same month."
3. Pulled the _Sneaker Shopping_ transcript (`coql2j3ugo8`) directly. The new age-section quote is verbatim:
   "I was born in '94… I'm I'm not I wasn't born in 1987."
4. Ran `yt-dlp` against the same video: `20230529`, Complex. The body's "ran in May 2023" is correct.

The two quotes the revision pass added from the repo transcript (`duke-dennis-360-with-speedy-2024.md`)
were grep-confirmed verbatim: "the being on call 24/7 is what makes the army like unbearable for me" and
the compliments passage with the "90% male and 10% women… now it's like 50/50" ratio.

## P0 resolution check

| ID        | Status       | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| --------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **P0-01** | **resolved** | Every legal-status assertion in "Why AMP will never add a seventh member" carries a year: Union Square (August 2023 → May 2024 → AP May 8), San Antonio (August 2, 2025 → booked next day → returned August 17 → dismissed per court records reviewed June 2026 → "That same month" for the filing). Unstamped count: **zero**. Strike Duke's two quotes and the account still runs arrest → booking → disposition → suit without a gap. No sentence attributes the alleged assault to him; the punch is placed on "a member of AMP's security team," matching the filing. SUBJ preserve #5's charges-only register holds — facts, dates, named outlets, allegation marked as allegation. |
| **P0-02** | **resolved** | The source card now runs Speedy's quote through both exceptions: "…you've done like maybe a podcast appearance here, you've done Sneaker Shopping on Complex, but that's it." _Sneaker Shopping_ is named in reader-visible body prose immediately after, outside the accordion, inside the stress section: "The silence was never total. The _Sneaker Shopping_ episode Speedy names ran in May 2023." Body claim scoped to "no sit-down interview from 2017 to 2024" at line 210, the FAQ, and the counterarguments. I enumerated all twelve ellipses in the reader-visible body: none removes a named counterexample to the sentence it supports.                                      |
| **P0-03** | **resolved** | The counterarguments paragraph now concedes and discriminates: "Threes metabolize attention as fuel, and Duke takes some of it: asked his favorite part of the internet, he told Speedy it was reading compliments about himself, and that his audience had gone from 90 percent male to roughly 50/50. What he will not do is arrange the work around it." "Duke declines it" is gone. The diagnosis section names the same objection ahead of the deferral. A reader who watches the full episode cannot name a pro-Three statement the page neither uses nor accounts for.                                                                                                             |
| **P0-04** | **resolved** | Exactly **one** `inner-thought` block remains (snapshot had two), and it is the reception-night beat, every element of which is on tape. No first-person interior text compares his standing to his housemates'. The revision pass additionally cut the Unc coda paragraph that carried the same status framing in prose; the FORMULA FINGERPRINT LEDGER records the prohibition so a later pass does not re-add an inferred beat.                                                                                                                                                                                                                                                        |
| **P0-05** | **resolved** | Final paragraph: "The one label he never answered is the one an aunt gave him. In that February 2024 interview, he said that at age 29 he had never asked what she meant. A definition is just instructions for what to be. He'd rather keep the name the way she left it: a sound with no orders inside." No availability claim, no forecast, no introduction of the death. "An aunt" (not "his aunt") and the 2024 stamp make it branch-safe under either resolution of RQ-03. PROTECT-11 byte-identical.                                                                                                                                                                               |
| **P0-06** | **resolved** | Verified against the source rather than the log — see item 1 above. Both quoted sentences appear verbatim in the Vibe text, in an openable syndication already in `citations:`. The freedom-vocabulary chain (2018 → 2024 → 2025) is whole.                                                                                                                                                                                                                                                                                                                                                                                                                                               |

## Accepted improvements check

Fourteen of sixteen completed as specified. Two carry deviations, both documented, neither gate-relevant.

- **Completed:** P1-01 (no "readers reliably connect", no unqualified "never addressed"; the paragraph now
  says only what Sportskeeda says plus a stated absence), P1-02 ("He paid it" gone, apology attributed to
  Kai, PROTECT-04's arithmetic sentence still answering the accountability question), P1-03 (RDC read
  reversed to "territory defended, war declined," plus "The wing is a softer call than the type"),
  P1-04 (null hypothesis relocated into the Germany paragraph; the deferral now names the compliments
  objection), P1-06 ("80 percent… and that on an Aspen trip it was all of them"), P1-07 (zero "D-Block"
  occurrences), P1-08 ("per Sportskeeda" in text, URL in `citations:`), P1-09 ("The audience arrived years
  before the press did"), P1-10 ("AMP has picked up affiliates since without opening that door"; FAQ scoped
  to "the six-man core"; "enforces" → "states" in both the FAQ and the subtype paragraph), P1-11 (body age
  stamped "32 as of August 2026" matching the FAQ; "Professor is the one he took, and took again" — no
  cardinal count; no unbounded present-tense press claim), P1-12 (link swapped to
  `/enneagram-corner/enneagram-connecting-lines`, which exists at `src/blog/enneagram/enneagram-connecting-lines.md`;
  internal link count unchanged at 7), P1-13 ("the being on call 24/7…" seated in the diagnosis; "Seven is
  the category default and the easiest miss: Sevens keep options open; Duke shuts them" seated in the
  counterarguments **before** the falsifier), P1-14 (disclosure now names the unflattering reference class
  and the IShowSpeed/Druski clustering risk), P1-15 ("The social instinct runs second, and it is the weaker
  call").
- **P1-05 — completed with deviation (partial).** Three of four sub-items hold: "rizz" is glossed as
  Oxford's 2023 word of the year clipped from the middle of _charisma_; the Enneagram appositive sits at
  the end of the first diagnosis paragraph; the NBA 2K gloss is at first use and absent from section 3.
  Two clauses of the acceptance test now fail. (a) **A reader who stops after the intro cannot state his
  audience size** — the revision pass removed the cold-open stat on grader feedback that it flattened the
  hook, and relocated it to the career section ("His channel counter read 3.6 million in August 2026;
  Wikipedia puts his Twitch following at 3.3 million"), where it is better sourced but out of the intro.
  That is a defensible tradeoff, explicitly logged, and the fact was preserved rather than deleted.
  (b) **AMP is used in the body before it is glossed** — the cold open now reads "the loud, goofy AMP
  co-founder," and the "Atlanta-based streamer collective" gloss does not arrive until the AMP section.
  The snapshot glossed it at first use. This was flagged in the prior verification and is still open.
- **P1-16 — completed in-draft, archiving `needs_human`.** "more than two million views" is in place, so
  growth cannot falsify the count, and the beat was not cut. Snapshotting the originating X post and the
  Primetimer debunk to a durable archive remains a human pre-publish task; neither pass had a mandate to
  write to an external archive service.

## Protected-hit regression check

**Zero regressions.** All fourteen verified by exact string match against the current draft, not against
the resolution logs.

1. PROTECT-01 — all three sentences present byte-identical, including "Nothing in the type explains this.
   He has never explained it either." and "His mother's sentence outlasted his own."
2. PROTECT-02 — the pull quote, the `firstLetter` paragraph, and "The factory got twenty-nine days."
   byte-identical. The two paragraphs the revision rewrote sit **after** that sentence, outside the
   protected span as the synthesis defined it.
3. PROTECT-03 — "Being A Professor At Streamer University," May 2025. Still professor, never student, and
   still the first-party upload; the new Mashable attribution sits beside it, not in place of it.
4. PROTECT-04 — the Rolling Stone concession ending "He profits from the legend daily, and he knows it" and
   the Union Square arithmetic sentence both intact; the arithmetic sentence survived P1-02 as required.
5. PROTECT-05 — the falsifier is still the last sentence of the counterarguments paragraph after P0-03,
   P1-13 and P1-14 all edited into it.
6. PROTECT-06 — all three anti-authority repetitions and "Three repetitions in one story time" intact.
   P1-13 was paid for elsewhere, not out of the triple.
7. PROTECT-07 — "Arrow behavior arrives under pressure and leaves with it; baseline behavior stays" intact;
   the null hypothesis survives, relocated into the body exactly as P1-04 instructed.
8. PROTECT-08 — the shift-bell paragraph unchanged, and "What he withheld was never the story. It was the
   microphone." intact after P0-02 and P1-09 edited the sentences around it.
9. PROTECT-09 — "The opening clause won't be printed here." intact. Zero net worth, sibling, or partner
   material anywhere in reader-visible text, including the new legal sentence. The only "girlfriend" string
   is inside Duke's own 2018 quote, as in the snapshot.
10. PROTECT-10 — the reception-night beat is present and is now the only interior beat in the piece.
11. PROTECT-11 — byte-identical.
12. PROTECT-12 — the travel/subculture paragraph is unchanged; the Unit-3 bridge and the
    `pull-quote` div are intact; the Rabbit Hole is still `<details>` with no `open` attribute.
13. PROTECT-13 — the closing inventory still runs dictionary/rizz → Unc → 1987 → murder hoax with the
    mechanism sentence ("An entire meaning industry works his image around the clock") intact. Note for the
    record: the synthesis rendered this sequence as including an "aura" rung, but "aura" was in the rizz
    section and not the closing inventory **in the frozen snapshot too**, so the live draft matches the
    protected state. Not a regression.
14. PROTECT-14 — "What became of Deo he has never said on record, and no reporting has filled it in."

Structural invariants re-checked: DISTRIBUTION LEDGER still 1, internal links still 7 (same set minus
`enneagram-types-in-stress` plus `enneagram-connecting-lines`), `lastmod: '2026-08-07'` untouched,
`published: false` untouched.

## Remaining work

Nothing blocks the gate. In priority order:

1. **`latest.json` is stale again.** It carries `verified_content_sha256: 07dc61be50…`; the draft now
   hashes `4cc08d8f50…`. Nothing downstream should trust the manifest until the gate rewrites it from this
   file. Out of scope for a read-only pass.
2. **P1-05's AMP gloss — the only accepted item still open in the draft.** Roughly four words at first use
   in the cold open (line 180). Body sits at about 4,470 words against the 4,500 ceiling, so there is
   headroom to pay for it without touching a protected beat.
3. **P1-16 archiving.** Snapshot the originating X post and the Primetimer debunk to a durable archive and
   cite the archived copies. Human pre-publish task; the hoax beat still rests on the two most deletable
   citations on the page.
4. **RQ-03, unchanged and still the real pre-publish question.** On the 2025-08-17 stream Duke said an aunt
   died in July 2025; nothing establishes whether she is the aunt who named him. The close, the TL;DR and
   the FAQ are now all past-anchored and consistent, so every surface is branch-safe. If DJ or new
   reporting later settles it against the draft, the closing movement needs a rebuild, not a trim.
5. **The civil suit ages fastest.** Printed as a dated filing event rather than a present posture, which is
   the durable construction, and re-verified against the source this pass. Still the one line to re-check
   immediately before publish, and again at the next refresh. Clarke's separate felony trial was scheduled
   for September 2026 and is correctly kept out of Duke's paragraph.
6. **Durability nit, carried forward.** The 409-profile corpus figure still lost its "as of August 2026"
   stamp in the P1-14 reword. Four words restores it; no acceptance test requires it.
7. **Nit, carried forward.** The source-card ellipsis still elides Speedy's hedge ("maybe one of your first
   _big_ interviews"). The acceptance test protects the named counterexamples, and those are inside the
   quote, so this passes; the hedge is the last piece of that passage still outside it.
8. **Process, not a draft defect — this has now happened four times.** A pipeline stage edited the
   reader-visible body twelve minutes after the previous verification wrote its hash, exactly as earlier
   stages did after the three runs before it. Every verification this review has produced has been
   invalidated by a later stage within minutes; this one will be too if anything runs after it. Whatever
   applies these post-gate repairs should run **before** finalize, or finalize should re-trigger
   verification after it. This remains the single highest-value fix to the pipeline itself.
9. **New for the next refresh, not blocking.** The TESTIMONY LEDGER's standing note that no third-party
   testimony exists is now false: the _Sneaker Shopping_ transcript has Joe of Complex attesting on the
   record to the two-hour drive to re-authenticate the shoes. Roughly 30 words, and the cheapest remaining
   Evidence win once the word ceiling moves.

Pre-existing WARNs carried forward, not regressions: 7 internal links against a 2–5 creator spec, and thin
headroom at roughly 4,470 against a 4,500 ceiling.
