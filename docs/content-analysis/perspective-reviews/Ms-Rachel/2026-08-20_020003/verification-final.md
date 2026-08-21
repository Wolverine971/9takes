---
artifact: perspective-verification
schema_version: 1
subject: Ms-Rachel
draft_sha256: 8ee388d721b2e6307aa099e626ddcf62566dd50a2cf633a8b95772dc0716c506
final_content_sha256: 159716c8e72d05085244e0c8a2a49c488ea0e8833532ff0ebba99c7adf552f67
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-08-20T08:26:48Z
---

## Verification verdict

Snapshot chain verified. `shasum -a 256` on `draft-reviewed.md` returns `8ee388d7…c0716c506`,
matching the supplied SHA, `context.json`, `synthesis.md`, `editor-resolution.md` and
`revision-resolution.md`. The frozen reader-visible hash recomputes to `9037e216…6ce74`, matching
`context.json`. The live draft's reader-visible hash is now `159716c8…f552f67`, distinct from the
`5431013f…3aee3c` that `verification-initial.md` tested, so the revision pass is real and is the
artifact under test.

**The publication blocker is closed.** `blog-lint` now reports **0 fail, 1 warn** — body is 4,494
words against the 4,500 ceiling, down from 5,001. This was the single FAIL the initial verification
escalated to DJ, and the revision closed it without raising `BLOG_LINT_WORD_CEILING` and without
deleting protected material. All thirteen P0 items still pass their acceptance tests. All fourteen
`PROTECT-*` items survive; I confirmed each by exact string match against the current file rather
than by reading the resolution log. The 501-word cut did not damage a single protected passage.

I re-derived the four new factual assertions this pass introduced rather than inheriting them.
Three trace cleanly. **One does not: the draft now dates her Instagram statement to December 8,
2025, and the record says December 4.** That is a mis-dating, not a fabrication — the quotations
themselves are verbatim and verified — and it fails no P0 acceptance test and regresses no protected
hit, so it does not move the gate. It is the first item in **Remaining work** and it is a
three-word fix.

`verification_status: pass` here means more than it did last pass: the trust repairs landed, the
protected material survived a 10% length cut, and the lint blocker is gone. It does not mean the
page is free of the defects listed below.

## P0 resolution check

All thirteen resolved. The initial verification established resolution against the intermediate
draft; this pass re-tested each acceptance test against the post-revision text, because a
501-word cut is exactly the kind of change that silently reopens an item.

**P0-01 — unsourced organizing number — resolved, unchanged.** `grep -i "four second"` returns
nothing in the reader-visible body (one hit, inside a revision-notes comment). `title`,
`meta_title` and `description` carry no unsourced integer; `description`'s only integer is the
packet-verified 32 months (CLM-02). The five labeled beats survive (PROTECT-05, five confirmed).
The in-prose attribution of the three-to-five-second professional window is present twice. The
revision reports nearly removing the intro attribution during compression and reverting it; the
attribution sentence is present in intro paragraph three, immediately after the count, which is
what keeps "One second. Two. Three." from reading as a measurement.

**P0-02 — allegation without weighable facts — resolved, unchanged.** April 2025, "produced no
public evidence," "no investigation has been reported opened in the sixteen months since." April
2025 → the August 2026 as-of line is sixteen months; arithmetic holds. PROTECT-01's two sentences
are byte-identical.

**P0-03 — altered quotation — resolved.** I re-ran the sweep the acceptance test demands rather
than trusting the log, extracting every quoted string from both bodies and diffing. Nine
quotations are new since the snapshot, eighteen removed. The two that this pass introduced and
that the evidence packet cannot settle — the December statement's two clauses — I verified by
targeted research:

- "should not be able to try to ruin people's lives, cause them to receive threats and need
  security." Matches S-25 / packet line 165 verbatim. The draft's construction ("The group, she
  wrote on Instagram, …") correctly excises "The Stop Antisemitism Now group" and resumes the
  quotation intact — a partial quotation, not a splice.
- "This has taken such a toll on me and my family and all I've wanted was to help kids." **Not in
  the evidence packet at all.** Verified verbatim against the Middle East Eye live-blog update the
  draft cites, and corroborated by Yahoo News / Where Is The Buzz. Word for word, in order, one
  cited source. Passes.

The Hailat quotation is truncated: the source reads "She is in real life as she is on screen — just
so kind," and the draft ends it at "on screen." That is a trailing cut at a clause boundary with a
period substituted, meaning preserved. Ordinary practice, consistent with how the initial
verification treated the shortened Pride quote. No surviving quotation is spliced or reordered.

**P0-04 — political conviction psychologized — resolved, unchanged.** The arrow paragraph cites no
instance of Gaza or political advocacy as evidence; "Getting loud on somebody else's behalf does
not count, which rules out the advocacy however direct it gets." The single retained instance is
her own-account grievance. Repair stays inside the Rabbit Hole.

**P0-05 — claim of incapacity — resolved; the gap clause still not literally met.** Clause 1
passes and is now stronger than at initial verification: the absolute is softened to "the one she
reaches for first," the exception is named in the same sentence, and the December statement two
paragraphs above is now **quoted** rather than paraphrased. Clause 2 — "no gap longer than six
months between dated beats" — is still not literally satisfied: in text order the section runs Feb
2023 → Feb 27 2023 → May 2024 → June 1 2024 → Jan 2025 → Apr 2025 → Nov 30 2025 → Dec 2025 → Jan
2026, leaving ~14 months (Feb 2023 → May 2024) and 7 months (June 2024 → Jan 2025). This is
carried forward, not caused: the initial verification identified the same two gaps, passed the
item on the grounds that the specific hole it was written against (June 2025 → Jan 2026) is
closed, and I reach the same conclusion. **The revision did not widen any gap** — it added a beat
and removed none, so the ladder is denser after the cut than before it.

**P0-06 — refused honorific — resolved, unchanged.** `persona_title` is "The Woman Who Stops
Talking." Exactly one "saint" in the reader-visible body, inside her refusal.

**P0-07 — inverted growth arrow — resolved, unchanged.** Glamour (Nov 2025, "embroidered")
precedes the exhibition by two months; `grep -i printed` returns nothing; "Both are still about
somebody else's children" keeps the theory honestly downgraded.

**P0-08 — asserted origin plus invented motive — resolved.** `grep -i "start date"` returns
nothing. The trolley motive is her own ("because the show is ending and she has decided to
physically prevent it"). The revision cut the "Sit with the mechanics of that" imperative that
preceded it; the motive sentence itself is intact.

**P0-09 — private-life certainty — resolved, unchanged.** `grep "there is not one now"` returns
nothing; "whether it has ever occurred to her to want one of her own is not something the record
answers" is present and hedged to the record.

**P0-10 — fairness anchor on a TikTok repost — resolved, unchanged.** Sannes paraphrased with her
disclaimer disclosed; every remaining quotation in the section carries outlet and date — Munn
(Parents and People, June 2025), the AAP page title (updated June 2026), Hafeez (PureWow, 2025).

**P0-11 — false campaign premise — resolved, unchanged.** "The show had never run a segment about
pronouns; contemporaneous reporting traced the claim to Hoffman's own TikTok account."

**P0-12 — packet-contradicted claims — resolved, unchanged.** `grep -i testif` returns zero hits
anywhere in the file. "Her daughter Susannah was announced on April 8, born via surrogate." No
birth date.

**P0-13 — thesis answering an unstated objection — resolved; placement still deviates.** The
objection paragraph is present and unchanged. The run is still disclaimer → objection → reframe.
Carried forward; see the PROTECT-07 check.

## Accepted improvements check

All fifteen accepted P1 items remain completed after the cut. The compression touched several of
their repair strings, so I re-checked each rather than inheriting the initial verification's pass.

- **P1-01, P1-03, P1-05, P1-06, P1-07, P1-09, P1-10, P1-12, P1-13 — completed, unchanged.** Bibas
  passage and its JTA source line, "Born in 1982 in Biddeford, Maine," the AAP anchor answered
  rather than dodged, "debts get apologized for," the Type 9 differential, Munn's de-escalation,
  Hoffman's role-before-attribute apposition, "The 2023 disappearance was a harassment campaign.
  This one was a baby," and the social-dominant-only ranking are all present.
- **P1-02 — completed.** "a woman in a bow headband on YouTube" and "*Songs for Littles*" both land
  in intro paragraph three, in prose, before the first H2. Survived the epigraph removal.
- **P1-04 — completed, and better sourced than at initial verification.** The Wikipedia-only
  figure ("20.2 million subscribers and 16.2 billion views") is replaced by "By the time The
  Hollywood Reporter visited her studio in November 2025, the channel had 17.5 million
  subscribers…" S-01 is Wikipedia, tier 3, which the packet states "cannot carry a correction
  alone"; S-10 is tier 2 and states 17.5M as of 2025-11-03. The dated clause and past-tense-at-
  launch that P1-04 required are both preserved, and the Netflix superlative is now attributed to
  Netflix rather than asserted. This trades ~9 months of recency for a source a fact-checker can
  open. Defensible, and an improvement on the acceptance test's terms.
- **P1-08 — completed, unchanged.** "That reflex is the best evidence in the file." Falsifier
  stated verbatim.
- **P1-11 — completed.** PROTECT-02 reads "because for thirty-two months, nobody had"; the
  Unbearable instance is "into a silence that had already lasted two years."
- **P1-14 — completed, and now attributed.** "The Washington Post counted 535 packets… delivered
  over two days to about ten Senate offices and House members of both parties." The Spokesman-
  Review syndication (S-05, 2026-06-11) is added to `citations`, closing the P1-14 half of the
  grader's unsourced-numbers item. "She answered it with somebody else's children." kept.
- **P1-15 — now complete.** The initial verification's one incomplete clause, "Four minutes, one
  word.", is cut; `grep` confirms zero reader-visible hits. The protected P1-15 sentences (Broadway
  associate conductor, real horn players, "The pause is the technology.") are intact in intro
  paragraph three. This item moves from partially-complete to complete.
- **P2-08 — rejected with reason, unchanged.** Fan-canon sourcing against a breached ceiling.

**Research items.** RQ-01 through 05, 07 and 09 remain resolved. **RQ-06 is upgraded**: the
statement is now quoted rather than paraphrased and attributed to a named relaying outlet. The
Instagram primary was still not retrieved, which is where the dating error below comes from.
**RQ-08 remains open by design**, with its on-page disclosure ("rests on a single spousal account
in one friendly profile") intact.

## Protected-hit regression check

All fourteen survive a 501-word cut. Verified by exact string match against the current file.

| ID | Status | Evidence |
| --- | --- | --- |
| PROTECT-01 | intact, verbatim | both sentences byte-identical to the snapshot |
| PROTECT-02 | intact | "A Broadway conductor gave up *Aladdin* to play the kid who talks back, because for thirty-two months, nobody had." — P1-11's licensed rephrase, nothing else |
| PROTECT-03 | intact, unit preserved | Aron's quote at full length, immediately followed by the reversal. Hailat lands *after* the pair, not between them — the one-unit constraint four perspectives named is honored |
| PROTECT-04 | intact, not softened | empathy turn, "None of which makes the criticism wrong.", AAP guidance answered against the pause, Sannes with her disclaimer, Hafeez caveat, and "still a teacher who arrives through a rectangle" all present. Nothing in the compression weakened the criticism |
| PROTECT-05 | intact | five bolded beats confirmed by count; the "Here is the entire method, in order." throat-clear removed above them is not protected material |
| PROTECT-06 | intact, verbatim | all three hedges byte-identical |
| PROTECT-07 | function intact, placement still deviates | thesis verbatim. "Watch any episode and" rewritten to "The sentence underneath every episode is…" — non-imperative, same paragraph, same claim, thesis sentence untouched. Carried-forward placement issue below |
| PROTECT-08 | intact | both sentences with their specifics; the four-item career list preceding the argument survives. The cut school roll-call is not protected material and carried no argument |
| PROTECT-09 | intact | arms-out image present; "She is just on the other side of it." is the final reader-visible sentence (line 403, immediately before the comment blocks) |
| PROTECT-10 | intact | `<p class="inner-thought">` block and the Cameo beat unchanged. Removing the intro's miniature retelling strengthens the beat rather than threatening it |
| PROTECT-11 | intact | "The successor loses to the institution." present; the refusal quote kept |
| PROTECT-12 | intact | jargon sweep of the reader-visible body outside the Rabbit Hole: zero true hits (the three `wing` matches are "following", "Viewing", "drawings"). Gate sentence present. Every repair stayed inside the quarantine |
| PROTECT-13 | intact, verbatim | anomaly still open; falsifier still stated |
| PROTECT-14 | intact, with one inaccurate addition | no relative-date conversions; `grep` for "later that year/month", "the following year", "around that time" returns nothing. No existing dateline was de-dated, so the item does not regress. Two absolute dates were added; one of them is wrong — see Remaining work #1 |

**PROTECT-07, restated.** Unchanged from the initial verification and not caused by this pass. The
synthesis said "do not separate it from the disclaimer"; the order is disclaimer → P0-13 objection
→ reframe. I decline to count it as a regression for the same reason the initial verifier did: the
thesis is verbatim, the disclaimer still governs the run, its bridge sentence still points at the
reframe, and the intervening paragraph makes the reframe read as an answer to a stated objection.
A human should still read those three paragraphs in order before finalizing. Two verification
passes have now deferred this; it should not be deferred a third time.

## Remaining work

Nothing here reopens a P0 or a protected hit. Ordered by consequence.

1. **The December statement is dated four days late, in three places. Fix before publish.** The
   draft asserts "On **December 8** she answered in a register she had never used before." Three
   sources say otherwise:
   - The evidence packet, line 168: "— Instagram, **~December 4, 2025** (S-25)."
   - `synthesis.md`'s own P0-05 evidence field: "her Instagram response, **approx. December 4,
     2025**."
   - The Middle East Eye live-blog update the draft newly cites, which is timestamped **8 December
     2025 06:49 GMT** and describes her post as made **"Thursday"** — and the Thursday before
     Monday, December 8 is **December 4**.

   The revision attached the relaying outlet's publication date to her act. The quotations
   themselves are verbatim and correct; only the date is wrong. It propagates to three
   reader-visible places: the controversy section's beat, "and December 8 aside, she keeps trying
   to settle it…", and the Rabbit Hole's re-keyed "The December 8 statement qualifies…" — where it
   now carries the stress-arrow argument. Minimum action: change those three in-prose references to
   December 4 (or to "Days later" / "In early December"). **Leave the source card as is** — "Middle
   East Eye, December 8, 2025" is correct as an outlet date and should not be changed to match the
   prose.

2. **Hailat is presented as independent corroboration; the packet says he is not.** The new
   sentence reads "…told the Post the same thing **from outside the marriage**," which invites the
   reader to weigh it as third-party confirmation. The packet's own note on him: "*Limitation:*
   Hailat leads the organization whose advocacy she amplifies. **Interested testimony, correctly
   attributed but not neutral.**" The `TESTIMONY LEDGER` inherits the framing ("Third party who
   dealt with her off camera") without the limitation. Nothing here is false — he is outside the
   marriage, and he did say it — but the sentence claims more independence than the packet grants.
   Minimum action: four words of disclosure, or drop "from outside the marriage" and let the quote
   stand on its own. Not a blocker; the piece hedges this scrupulously everywhere else (PROTECT-06),
   which is exactly why the omission stands out.

3. **P0-05's six-month gap clause is still not literally met.** Two gaps survive: Feb 2023 → May
   2024 (~14 months) and June 2024 → Jan 2025 (7 months). Both correspond to stretches with no
   located events; no reviewer flagged them; the revision did not widen them and in fact added a
   beat. Carried forward from the initial verification for the record, not as a new finding. No
   action required to finalize.

4. **PROTECT-07 paragraph order — third pass deferred.** Disclaimer → P0-13 objection → reframe,
   where the synthesis said do not separate the pair. Both verifications and the revision pass have
   now declined to count it as a regression and all three have asked for a human read. Minimum
   action: read those three paragraphs in order and either accept the current run or move the
   objection paragraph above the disclaimer.

5. **`editor-resolution.md` still contains three claims the file does not support.** The revision
   pass correctly judged correcting another pass's artifact to be outside its write scope, and it
   is outside mine. I re-confirmed all three against the current file: P0-13's paragraph does sit
   between the disclaimer and the reframe; P0-05's "largest gap is now under six months" is wrong;
   "faqs frontmatter is still empty" is stale — five FAQ pairs are live, `blog-lint` confirms
   FAQPage eligibility, and I re-checked them against the compressed body (consistent, and they
   carry the P0-02, P0-11 and P1-14 corrections). Minimum action: a correcting note, from whoever
   owns that artifact.

6. **Headroom is six words.** 4,494 against 4,500, inside the lint's thin-headroom warn band. Any
   later addition must cut first. The revision names the cheap cut if one is needed (the Glamour
   detail in the Rabbit Hole's "Both are still about somebody else's children" paragraph) and
   records two verified quotations dropped for words — Hoffman's GMA line and the Glamour podium
   line — worth restoring only if the ceiling is ever raised.

7. **RQ-08 remains open by design.** The Washington Post original was not retrieved. The Type 1
   discriminator's on-page disclosure is unchanged and still doing its job. No action required.

**Closed since `verification-initial.md`:** remaining-work #1 (word ceiling — the one lint FAIL,
now 0 fail), #3 ("Four minutes, one word." cut, completing P1-15), #5 (inaugural-committee beat now
carries ABC7 New York, December 24, 2025 on the source card and in `citations` — I verified the
article's date and that it reports the appointment). #4 ("One second. Two. Three.") was
deliberately retained with its attribution restored, which the initial verification explicitly did
not require. #2 and #6 are carried forward above.
