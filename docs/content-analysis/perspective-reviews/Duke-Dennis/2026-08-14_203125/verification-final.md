---
artifact: perspective-verification
schema_version: 1
subject: Duke-Dennis
draft_sha256: d5bce426b94be999eaf53dde0ccba793f0041d9f946910448938ed294749ae93
final_content_sha256: 1ef7b671a0edf03c0dcdd3d19cdb1e3fca4c4afeb12b402f2859a0cfae666f2c
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-08-15T02:38:59Z
path: docs/content-analysis/perspective-reviews/Duke-Dennis/2026-08-14_203125/verification-final.md
---

## Verification verdict

**Pass.** This is the post-revision verification. The editor pass closed all six P0s and
`verification-initial.md` recorded that; the revision pass that followed was driven by grader feedback
(8.6 B+) plus the one accepted P1 remainder. My job here was to confirm the revision did not spend a P0
repair or a protected hit to buy a grader win. It did not.

All six P0 repairs still hold against their own acceptance tests. All fourteen protected hits survive,
all fourteen by exact string match. Fifteen of the sixteen accepted P1s are now complete — P1-13's
deferred Type 7 clause was seated this pass — and the sixteenth is a human pre-publish task, not a draft
edit. No new factual assertion entered the draft without a source trail.

Provenance checks:

- Synthesis `draft_sha256` = `context.json` `draft_sha256` = supplied `--draft-sha` = `d5bce426b9…`. Match.
- `draft-reviewed.md` recomputes to full-file sha `d5bce426b9…` and reader-visible hash `654733a3f5…`,
  identical to `context.json`. The frozen snapshot is the one that was reviewed.
- Current live draft reader-visible hash: `1ef7b671a0…`. Changed from the post-editor `984b077ad1…`, as
  expected for a revision pass.
- `lastmod: '2026-08-07'` is byte-identical to the snapshot. Neither pass touched it.

The revision introduced three assertions that were new relative to both the evidence packet and the
editor pass. Each is the exact failure mode the synthesis was convened over — a claim attributed to a
source that may not carry it — so I verified all three first-hand rather than reading the resolution log.
All three came back clean:

| New assertion                                                                                                  | Result                                                                                                                                                                                                                                   |
| -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "He answered the 1987 birth year on Complex's camera in May 2023: 'I was born in '94… I wasn't born in 1987.'" | **Verified on tape.** Pulled `coql2j3ugo8` via `youtube-transcript-api`: "No, bro. I'm I was born in '94. I'm I'm not I wasn't born in 1987." The draft's ellipsis removes a stammer, not content.                                       |
| Is `coql2j3ugo8` the _Sneaker Shopping_ episode, dated May 2023?                                               | **Confirmed.** `yt-dlp` returns title _Duke Dennis Goes Sneaker Shopping With Complex_, channel Complex, `upload_date` 20230529.                                                                                                         |
| "Mashable printed the roster the next day"                                                                     | **Confirmed.** The Yahoo syndication added to `citations` is the Mashable piece (Olivia Tauber, 2026-07-07). It names Duke Dennis a 2026 professor alongside Lizzo, Pokimane and Ludwig, and dates Kai's announcement to Monday, July 6. |

I did not re-litigate the four claims `verification-initial.md` already researched (the Vibe attribution,
the civil suit, the diversion dismissal, the _Sneaker Shopping_ date). Nothing in this pass disturbed them,
and the revision independently re-confirmed that the `citations` Yahoo security-officer URL is the
Express-News piece carrying the disposition verbatim.

## P0 resolution check

**P0-01 — San Antonio paragraph — resolved (held).**
Untouched by the revision; re-tested from scratch anyway. Every legal-status assertion in the section
carries a year: arrest "August 2, 2025," booking "the next day," Union Square "until May 2024… the
Associated Press carried on May 8," disposition "per court records the San Antonio Express-News reviewed
in June 2026," suit "That same month." Zero unstamped legal statuses. Stripping Duke's two quotes leaves
the factual account whole end to end. No sentence attributes the alleged assault to him — "the filing
attributes the punch the officer alleges to a member of AMP's security team." The arrest → his answer →
disposition → live suit order survives, so the paragraph still does not close on his unrebutted defense.

**P0-02 — source card and dependent claims — resolved (held, and strengthened).**
The card still runs through "you've done Sneaker Shopping on Complex, but that's it," so both exceptions
Speedy names on tape sit inside the quotation. The episode is still named in reader-visible body prose
inside the stress section. All three dependent claims remain scoped and dated: body "no sit-down
interview from 2017 to 2024," FAQ 1 "seven years without a sit-down interview, 2017 to 2024," Rabbit Hole
"no sit-down interview ran from 2017 to 2024." The arrow section's version was brought into line too
("the 2017-to-2024 press silence"). I re-inventoried all eleven ellipses in the reader-visible body; none
removes a named counterexample to the sentence it supports, including the one the revision added. The
revision went past the minimum repair by quoting the same episode a second time in the age section, which
converts the counterexample into evidence.

**P0-03 — counterarguments — resolved (held).**
"Duke declines it" is still gone. The compliments concession and the 90%-male-to-50/50 detail are intact:
"Threes metabolize attention as fuel, and Duke takes some of it… What he will not do is arrange the work
around it." The revision inserted P1-13's Seven clause into this paragraph without displacing anything —
the falsifier is still the last sentence.

**P0-04 — imputed status resentment — resolved (held, and reinforced).**
Exactly one `<p class="inner-thought">` block remains in the draft (the reception-night beat, line 218),
and it maps entirely to tape. The revision additionally cut the Unc coda paragraph — "The other half of
the Unc job gets no jokes… he is still the one who says out loud that nobody else gets in" — which was
the surviving residue of the cut beat and leaned on the same status framing. No inferred interior beat
was re-added, and the FORMULA FINGERPRINT LEDGER still instructs later passes not to add one.

**P0-05 — closing beat — resolved (held).**
Untouched. The close reads "The one label he never answered is the one his aunt gave him. He has had
three decades to ask what she meant. He hasn't." No assertion or implication that the aunt is alive,
reachable or askable; no forecast about his future behavior; the July 2025 death correctly still not
introduced under either branch of RQ-03. PROTECT-11 byte-identical.

**P0-06 — "risk my freedom" attribution — resolved (held).**
"per Vibe" intact, the openable Yahoo syndication still in `citations`, the freedom-vocabulary chain
whole across 2018 → 2024 → 2025.

## Accepted improvements check

**Fifteen of sixteen complete.** Verified in the current text: **P1-01** (Dee sentence now confines the
"not established" language to the naming question and drops both the asserted reader behaviour and the
unverifiable negative, rendered against the PROTECT-14 model), **P1-02** (apology attributed to Kai,
"He paid it." gone, PROTECT-04 arithmetic sentence verbatim), **P1-03** (RDC example runs the right way —
"territory defended, war declined" — with the knock-on 8w7 discriminator repaired to "would have let it
escalate," plus the added certainty marker "The wing is a softer call than the type."), **P1-04** (null
hypothesis relocated into the stress section, diagnosis teaser still names the compliments objection),
**P1-05** (scale beat as-of-stamped and now first-party sourced, "rizz" glossed as Oxford's 2023 word of
the year, Enneagram appositive at the end of the first diagnosis paragraph, NBA 2K gloss at first use and
removed from section 3), **P1-06**, **P1-07** (zero "D-Block" occurrences), **P1-08** ("per Sportskeeda"
in text plus URL in `citations`), **P1-09**, **P1-10** ("states" not "enforces"; affiliate tier named),
**P1-11**, **P1-12** (link swapped to `/enneagram-corner/enneagram-connecting-lines`; source file
`src/blog/enneagram/enneagram-connecting-lines.md` confirmed present; internal link count unchanged at 7),
**P1-14**, **P1-15**.

- **P1-13 — now complete.** The half deferred at the editor pass is seated: "Seven is the category default
  and the easiest miss: Sevens keep options open; Duke shuts them," placed after the corpus-departure
  sentence and _before_ the falsifier, so PROTECT-05 holds. The diagnosis half ("the being on call 24/7
  is what makes the Army… unbearable for me," followed by "The Army's sin was owning his availability")
  is untouched. All three anti-authority repetitions survive, so PROTECT-06 was not spent to fund it.

- **P1-16 — in-draft half complete; archiving remains `needs_human`.** "more than two million views" is
  growth-proof. Snapshotting the originating X post and the Primetimer debunk to a durable archive was
  again correctly not attempted — it means writing to a third-party service unprompted. This is a human
  pre-publish task, not an unresolved draft edit, and does not fail the gate.

## Protected-hit regression check

**Zero regressions.** All fourteen verified by exact string match against the current draft: PROTECT-01
(all three sentences), 02, 03 (still **professor**, never student, and still first-party sourced to his
own channel), 04 (both halves), 05, 06 (all three anti-authority repetitions plus "Three repetitions in
one story time"), 07 (arrow-discipline sentence, relocated null hypothesis, corpus-departure disclosure),
08 (both halves), 09, 10, 11, 12 (travel/subculture paragraph, Unit-3 ladder, pull-quote, Rabbit Hole
still `<details>` with no `open` attribute), 13, 14.

Three items the revision edited near, all of which survive:

- **PROTECT-02 — cold open.** The revision removed a stat drop from the opening movement, which put this
  at real risk. I byte-compared the protected region — the epigraph through "The factory got twenty-nine
  days." — against the snapshot: **byte-identical**. The stat drop that moved sat in the paragraph
  _after_ the protected boundary, and P1-05's scale beat was relocated rather than deleted (career
  section, now carrying publisher and as-of date), so this is not a P1 regression either.
- **PROTECT-12 — syllabus section.** Its opening paragraph was rebuilt for cadence ("On July 6, 2026, Kai
  Cenat returned to streaming…"), but every protected element is intact: the Unit-3 bridge, the
  pull-quote, the collapsed Rabbit Hole, the travel/subculture paragraph. PROTECT-03's sentence still
  sits in the same paragraph and still outranks the roster copy.
- **PROTECT-13 — closing label inventory.** The item `verification-initial.md` flagged to watch. This
  pass did **not** trim it; the rizz → Unc → aura → 1987 → hoax layering is unchanged. The one 1987-related
  edit landed in the _age_ section and swapped a weak self-published reference (_I Turned 32_) for a
  stronger on-camera one, which is a source upgrade rather than a removed rung. The parenthetical "for a
  man born in 1994" left the closing sentence, but the correction it carried now runs stronger two
  sections earlier in Duke's own words plus the FAQ.

No protected hit was cut to fund an accepted item or a grader win. The revision's stated payers — the Unc
coda and the duplicated anti-Type-3 ammunition list — are both restatement, and body length came in at or
just under the ceiling (revision notes report 4,492; my crude recount lands ~4,501, the difference being
tokenization of markdown link syntax).

## Remaining work

Nothing blocks the gate. Five items for the human before publish, in priority order:

1. **RQ-03 remains open and `needs_human`.** Whether the aunt who died in July 2025 is the aunt who named
   him is not resolvable from the public record and was rightly not attempted by either pass. P0-05's
   repair is branch-safe, so the close holds either way. If DJ or new reporting ever settles it against
   the draft, the closing movement needs a rebuild rather than a trim.
2. **P1-16's archiving.** Snapshot the originating X post and the Primetimer debunk to a durable archive.
   The hoax beat still rests on the two most deletable citations on the page.
3. **The live civil suit will age fastest.** Printed as a dated filing event rather than a present
   posture, which is the durable construction — but it is the one line on this page most likely to need
   a re-check immediately before publish and again at the next refresh.
4. **NEW this pass — the third primary text has no in-repo copy.** The _Sneaker Shopping_ transcript was
   pulled and quoted but never saved to `youtube-transcripts/`, unlike the Army story time and the 360
   With Speedy episode. Two of the three primary texts are greppable by any future evaluator; the newest
   one is not, so the "born in '94" quote can only be re-verified by a network fetch. I verified it
   first-hand this pass, but saving it to `youtube-transcripts/duke-dennis-sneaker-shopping-2023.md`
   would put it on the same footing as the other two. This also unblocks the revision's own
   `research_needed` note.
5. **Two stale internal notes**, neither reader-visible and neither gate-relevant, but both will mislead
   the next pass. The TESTIMONY LEDGER still asserts that "No third-party TESTIMONY exists per the
   entity-gap packet's targeted search, so this ledger cannot honestly grow" — the revision pass itself
   established this is now false (Joe of Complex attests on the _Sneaker Shopping_ tape). And TESTIMONY
   LEDGER entry 1 now records the punctuality quote in its trimmed form, "If we had to rank… who's been
   the most on time," which drops the reference class ("in order of the guests we've had on 360") from
   the ledger's own record of it. The body instance reads fine because the surrounding sentences supply
   the interview context — this stays a legibility nit rather than an evidentiary one, unchanged from
   `verification-initial.md` — but the ledger is the wrong place to hold the shortened version.

Carried forward unchanged, both pre-existing WARNs rather than regressions: 7 internal links against a
2–5 creator spec, and thin word headroom against the 4,500 ceiling.
