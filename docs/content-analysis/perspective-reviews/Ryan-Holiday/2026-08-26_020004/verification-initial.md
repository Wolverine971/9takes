---
artifact: perspective-verification
schema_version: 1
subject: Ryan-Holiday
draft_sha256: cb489f4cce3c0226f9567cdae7af6599e2a07fac368530f1549afdd7b5030385
final_content_sha256: 14094793089a27082dfa2e72c39b7746f38f58570f1f711cbee356b2813036d4
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-08-26T07:51:48Z
path: docs/content-analysis/perspective-reviews/Ryan-Holiday/2026-08-26_020004/verification-initial.md
---

## Verification verdict

Snapshot integrity confirmed. `shasum -a 256` over `draft-reviewed.md` returns
`cb489f4c…5030385`, matching both `context.json` and `synthesis.md`'s `draft_sha256`, and the
snapshot's reader-visible hash reproduces `c2d1674c…ead518b` from `context.json`. The current live
draft's reader-visible hash is `14094793…13036d4`.

All eleven P0 items resolve. All twelve `PROTECT-*` items survive by direct read and mechanical
string match. `blog-lint.sh` returns 0 fail / 1 warn (body 4,498 of 4,500).

Four factual assertions introduced by P0 repairs could not be settled from the evidence packet, so I
ran targeted checks on each rather than accepting the resolution log. Three confirm cleanly: the
October 2020 letter quote renders verbatim at `ryanholiday.net/letter/` addressed to his father; the
Nimitz removal actor and cause (Navy leadership, on an order from Hegseth's office implementing the
DEI executive order) are corroborated by Military.com, CBS Baltimore and UPI; and the restoration is
real, with all but roughly 20 of the 381 titles returned per AP on 2025-05-21. The fourth carries a
small arithmetic imprecision, described under P0-05.

One item requires a stated judgment call rather than a mechanical pass: **P0-08's third acceptance
clause is not met.** It is a word-budget instrument whose purpose was demonstrably satisfied by
other means, and the synthesis's own "At risk" note argues against meeting it literally. I have
counted it as closed and documented the deviation in full below so the call is reviewable.

Two accepted P1 repairs are incomplete in the current text, one of them because a later pipeline
stage reintroduced the exact assertion the repair removed. Neither fails the gate; both are named
under Remaining work.

## P0 resolution check

**P0-01 — swim quote context. Resolved.** The diagnosis section now reads: _He calls it "a very
underrated philosophical hack": "having something that gets you a win every day." On the Diary of a
CEO podcast in 2023 he described the win…_ The phrase "a win every day" is present, both fragments
match packet S-05 verbatim, "he ruled out every reason you would expect" is gone, and "the only
thing he actually wants from it" is replaced with _"A win with no opponent, no score, and no way for
anyone else to place it."_ Section length 520 → 519 words, satisfying the net-neutral-or-shorter
clause. PROTECT-07 is byte-identical and the repair was made in the sentences before it, as required.

**P0-02 — Greene's list ordering. Resolved.** Both sentences are deleted. The father section opens
on "He married Samantha in 2015…". No reader-visible sentence claims the ordering is meaningful.
(One stale editorial HTML comment still refers to it; see Remaining work.)

**P0-03 — childhood household. Resolved, as an upgrade.** (a) The "furniture is already teaching it"
inference is gone, replaced by his own testimony: _"In an open letter to his father in October 2020,
he quoted the lesson back to him: 'You told me that as a kid! That the bad prevail when good people
do nothing.'"_ I fetched `ryanholiday.net/letter/` independently: the letter is addressed to his
father, dated 2020-10-13, and the sentence renders character-for-character. Both occupations remain.
The TL;DR bullet is retitled "The household he quotes back". (b) The garbled "I felt a lot of
pressure…" quotation is dropped; the surviving sentence — _"A man raised by a detective and a
principal has decided that the main work of fathering is to withhold exactly that"_ — makes no claim
about pressure originating at home. This is the RQ-02 upgrade path Step 3 of the revision brief
authorised, not a bare cut.

**P0-04 — Bates clause order. Resolved.** Both instances (TESTIMONY LEDGER item 2, line 92; body,
line 353) now read _"More than anyone else, Holiday has turned Stoicism into a brand."_ Matches
packet S-18 (evidence-packet.md:327) character-for-character inside the quotation marks.

**P0-05 — undated `key-stat`. Resolved, with an arithmetic caveat.** The label now reads: _"books
pulled from the Nimitz Library in April 2025. He was asked not to mention them, one hour before the
lecture. Nearly all were back on the shelves within six weeks."_ The block carries an absolute date
and a reader can state from it alone both that the books were removed and that the removal did not
stand. "Nearly all" is correct: AP (2025-05-21) reports all but roughly 20 titles restored.
PROTECT-06's pairing paragraph is untouched.

Caveat, not a test failure: the removal ran Monday 2025-03-31 to Tuesday 2025-04-01, finishing before
a previously planned Hegseth visit (Military.com, 2025-04-02; UPI, 2025-04-05). Restoration was
reported 2025-05-20/21. That is roughly seven weeks from the shelves being cleared, not six. Six
weeks is right only if the interval is read from the 2025-04-14 lecture, which is the nearest
antecedent in the label but not the natural referent for "back on the shelves." Minimum action:
"within seven weeks", or "by late May", or drop the interval.

**P0-06 — no actor, no cause. Resolved.** The body sentence now reads: _"…the 381 books that Navy
leadership had pulled from its Nimitz Library that month, complying with an order from Defense
Secretary Pete Hegseth's office to strip out anything promoting diversity, equity and inclusion."_ A
cold reader can now state who and why from the section alone. Independently corroborated this
session: Naval Academy officials were ordered to review the collection by Hegseth's office under
Trump's January 2025 DEI executive order, screened roughly 900 titles, and removed 381. One clause,
not a paragraph; the section's political restraint holds.

**P0-07 — Lombardi. Resolved.** _"Mike Lombardi, a thirty-year NFL front-office executive coming off
a season with the Patriots."_ Thirty years attributed to the NFL, the Patriots tenure described in
seasons. Matches packet S-08 / ESPN.

**P0-08 — Stockdale. Resolved on both factual clauses; the size clause is not met.** The paragraph
now reads: _"His material centered on James Stockdale, the Naval Academy graduate whose Stoicism
carried him through more than seven years as a prisoner of war, and whom the Navy sent to Stanford
to read Marx and Lenin in the original, because wisdom requires exposure to the ideas you find
repellent."_ The reversed parental attribution is gone, no sentence states 1960, and "seven years"
is corrected to "more than seven years."

The third clause — _"the section is at least 40 words shorter"_ — fails on both available readings.
Measured: the Stockdale paragraph 75 → 49 words (−26); the whole "Why the Naval Academy canceled
Ryan Holiday" section 347 → 356 words (**+9**, because P0-05 and P0-06 add context to the same
section). I am counting the item closed rather than open, for three reasons stated so the call can be
overridden: the clause is a funding instrument, not a trust condition, and the synthesis says so
outright (_"the single largest funding cut available… frees roughly 50 words for the additive P1
items"_); its purpose is met — the body landed at 4,498 of 4,500 with every accepted P1 shipped, and
the funding was re-sourced from the tour paragraph, the Shazier clause and filler transitions; and
cutting further would delete Stockdale's stated reason for being at Stanford, which the item's own
"At risk" note warns makes P0-06 worse. Minimum remaining action for trust: none. If a future pass
needs headroom, this paragraph is still the cheapest legitimate cut on the page.

**P0-09 — four bundled corrections. All four resolved.**

1. _"he told ABC News afterward."_ Matches packet CLM-18 / S-12.
2. Rabbit Hole now reads _"for four straight years until the fifth was cancelled"_, resolving in
   favour of four against body line 266. (Spelling nit: "cancelled" here vs "canceled" in the H2 and
   body.)
3. _"Between 2021 and 2025 he published four virtue books, one for each of the cardinal virtues."_
   The report-card image is intact.
4. The href now resolves to `/enneagram-corner/enneagram-stress-number`. Verified in the repo: that
   file exists, is `published: true`, and carries "### Type 1 → Type 4: When Perfectionists Become
   Drama Queens" at line 143, so the link lands on a page that actually describes the 1→4 arrow.

**P0-10 — journals absolute. Resolved.** Morning section: _Reading them back, he said, "is just
extra to me."_ Line 295 softened to _"whether or not anyone consults it."_ Closer: _"Nobody times
the swim. Even he calls rereading the journals extra."_ No reader-visible sentence asserts the
journals go unread, and all three are consistent with the full Ruhle answer in packet CLM-22.

**P0-11 — closer causal claim. Resolved.** _"He may have been right. He has been outrunning it in
public ever since, one virtue at a time."_ The verdict is hedged, the image is untouched, and no
clause was added to explain the hedge.

## Accepted improvements check

**Completed:** P1-01, P1-03, P1-04, P1-05, P1-06, P1-07, P1-08, P1-09, P1-10, P1-11.

Spot-checked in detail:

- **P1-01** — the strategy/leak binary is gone; the section now concedes _"territorial anger and
  sincere anger are the same anger, so the sincerity of the fury leaves his claim standing"_ and
  addresses publication directly: _"Then he cut the two halves into a split screen, left the
  eye-rolls in, and posted it. Whatever went first, the publishing was a decision."_ "A hundred
  cleaner moves" is removed. All three acceptance clauses met.
- **P1-05 [new fact]** — verified against `store.dailystoic.com` this session: Medallions, Pendants,
  Journals, Digital Courses and Membership are all live categories, and the course renders as
  "TAMING YOUR TEMPER: THE 10-DAY STOIC GUIDE TO CONTROLLING ANGER". No dollar figure ships. Placed
  immediately before PROTECT-04, not inside it.
- **P1-10 [new fact]** — verified: _Conspiracy_ published 2018-02-27 by Portfolio; Thiel secretly
  funded Hogan's suit against Gawker; the book is "informed by interviews with all the key players",
  which supports _"reported with the principals talking to him."_ The paragraph renders no verdict
  and sits before PROTECT-02.
- **P1-09** — all five confirmed gone or anchored: no "thirty-nine", no "standing invitation", no
  "still touring", no bare "for fifteen years", source card and Painted Porch both retrieval-dated.

**Completed by an alternative route, with reason:** P1-12. The editor removed the clause _"and for
the man who wrote I Hope They Serve Beer in Hell"_ rather than disambiguating it, because `grep` over
the packet returns no source row for the working relationship and the synthesis barred naming him
without one. Both acceptance clauses are satisfied — the sentence admits one parse and every named
party has a packet row. The cost is one item off the reckless-half résumé inside PROTECT-01; restore
a named version if a Tucker Max source row is ever added.

**Incomplete: P1-02.** Two of three clauses pass — the FORMULA FINGERPRINT LEDGER's "falsifiable
rather than exculpatory" claim is removed and replaced with an accurate note, and the reader is given
the reason 2015 was cheaper (_"In between, he acquired a franchise to defend"_). The first clause,
_"The text no longer asserts an unqualified shared trigger,"_ still fails in two reader-visible
places:

1. Body, line 363: _"He has also passed this exact test before, on the record."_ This sits four
   paragraphs before the repaired _"Nearly the same trigger both times"_ and asserts the identity the
   repair was meant to qualify. It is **not** part of PROTECT-03's protected string (which ends at
   "and the rule was the good one"), so it can be edited freely. Minimum action: "a version of this
   test" or "this test before, at lower cost."
2. Frontmatter `faqs`, question 5: _"The control case is March 2015, when the same trigger produced
   the opposite response."_ This reintroduces both the unqualified trigger and the "control case"
   framing the repair retired. See Remaining work item 1 for why this is reader-visible.

## Protected-hit regression check

Zero regressions. All twelve verified by direct read plus mechanical string match against the live
draft.

- **PROTECT-01** — "Two Sides" intact. Three changes only, each sanctioned by an accepted P1: the
  source-card retrieval date and the "fifteen years" anchor (both P1-09 item 3), and the P1-12 clause
  removal. Every block quote and receipt pairing is unchanged.
- **PROTECT-02** — present verbatim, still unresolved, and confirmed by line order to follow the new
  _Conspiracy_ paragraph.
- **PROTECT-03** — _"This does not make him right. He broke his own rule, and the rule was the good
  one."_ verbatim, still before the Pigliucci beat.
- **PROTECT-04** — Bates concession paragraph verbatim, including "for days". The P1-05 sentence sits
  beside it, not inside it.
- **PROTECT-05** — the March 2015 episode and the jealousy quote are unchanged and still in the body,
  so P1-08(a) has its referent.
- **PROTECT-06** — _"The wiring does not distinguish between the two occasions."_ unchanged; P0-05
  and P0-06 added words to the section, not to this paragraph.
- **PROTECT-07** — _"That is a Type One engine. The Achiever wants the record. The One wants the
  verdict."_ unchanged (line 174).
- **PROTECT-08** — the mechanism paragraph is word-for-word intact. Its three-word bridge changed
  from "Here is what leaked." to "Here is what gave.", which P1-01 required and which the paragraph's
  own closing clause ("the structure gave") now echoes. Not softened; function preserved.
- **PROTECT-09** — _"Which means the anger arrived first and the philosophy came second."_ unchanged;
  P1-03 cut only the paragraph's tail.
- **PROTECT-10** — "A note on the obvious objection" whole, tightened by four words ("a practice
  rather than a label" → "a practice"), which the item explicitly permits. The argument survives in
  the following sentences ("That is a real argument with a site like this one").
- **PROTECT-11** — the father section names no type (verified: zero type or Enneagram tokens in the
  section), and the "deliberately declining to hand down" sentence survives P0-02's deletion.
- **PROTECT-12** — re-verified across the reader-visible body _and_ the new `faqs` block: no net
  worth, no copies-sold total, no Charney material, no Quora quote, no hypocrite framing, sons
  unnamed. The epigraph's _"rendering Meditations 10.16"_ attribution is intact (line 137) and the
  "What would change our mind" line is intact (line 332).

## Remaining work

1. **The `faqs` block reintroduces the P1-02 assertion, and it is reader-visible.** The enrich stage
   ran after the editor pass (the editor's own notes say `faqs` was still missing). The
   perspective-review hash deliberately ignores frontmatter, so this class of change is invisible to
   the gate — but on the people path it is not invisible to readers:
   `src/routes/personality-analysis/[slug]/+page.svelte:618` renders `<FAQSection>` whenever
   `faqs.length >= 2`, and `PeopleBlogPageHead.svelte:104` emits it as FAQPage JSON-LD. FAQ 5
   currently ships _"The control case is March 2015, when the same trigger produced the opposite
   response."_ Minimum action: qualify it to match the body, e.g. "March 2015 is the closest
   comparison: a similar trigger, the opposite response, before he had a franchise to defend."
2. **P1-02's body residue.** Line 363, _"He has also passed this exact test before, on the record."_
   Same fix, ~3 words, no PROTECT exposure.
3. **P0-05's interval.** "within six weeks" should be "within seven weeks" or "by late May" — the
   shelves were cleared 2025-03-31/04-01 and refilled 2025-05-20/21. Related: the body's "that month"
   is at the boundary (the pull finished 2025-04-01, the day before it was reported), so "in early
   April 2025" or "days before a planned Hegseth visit" is safer.
4. **`citations` frontmatter is missing four newly load-bearing sources.** `ryanholiday.net/letter/`
   was added, but the AP / ABC News Nimitz reporting (P0-06, P0-05), `store.dailystoic.com` (P1-05)
   and the _Conspiracy_ publisher page (P1-10) are not listed, even though each now anchors a
   reader-visible factual claim. Each is verified in the resolution log and re-verified here; they
   just are not in the file's own source trail.
5. **One attribution stretch introduced by P1-02.** _"…which is what Bates says explains
   everything."_ Bates's published claim is narrower: that Holiday's gripe "appears to be that her
   admiration of Marcus Aurelius infringes upon that brand." "Explains everything" is the article's
   extrapolation. Minimum action: "which is the variable Bates says is decisive."
6. **Two stale editorial HTML comments** now contradict shipped repairs. Line 133 (FORMULA
   FINGERPRINT LEDGER) still says _"the kept-but-unread journals"_ after P0-10; line 426 (second-pass
   notes) still says the father H2 _"Follows the last item on Greene's list"_ after P0-02. Neither is
   reader-visible or hashed, but both will mislead the next pass.
7. **One undocumented cut.** _"ESPN walked its readers through the American Apparel years in the same
   feature, because the two halves belong together"_ was removed as funding but does not appear in
   the resolution log's ledger. No protected status; noted only so the next editor knows it was
   deliberate rather than lost.
8. **Carried open from the editor pass, unchanged by this verification:** RQ-03 remains unpinnable
   (`x.com` returns HTTP 402; `web.archive.org` unreachable), and nothing about the video's aftermath
   ships as a claim, which is the correct fallback. RQ-05 was not run. The 2016 "Dear Dad" letter is
   verified but unused. The body sits at 4,498 of 4,500, so every item above except #1 and #6 needs a
   cut to pay for it — #2, #3 and #5 are all net-neutral or shorter as written.

---

Output: `docs/content-analysis/perspective-reviews/Ryan-Holiday/2026-08-26_020004/verification-initial.md`
Status: `pass` — open P0: 0, protected-hit regressions: 0.
