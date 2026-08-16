---
artifact: perspective-synthesis
schema_version: 1
subject: Simone-Biles
draft_sha256: c562d27c5e2965cb7192e3151184b3ba1d279ac8014c2904144f51f129513eae
synthesis_status: complete
delight_target: fan
p0_open: 10
p1_accepted: 19
research_required: 6
protected_hits: 19
requires_revision: true
synthesized_at: 2026-08-16T07:34:16Z
path: docs/content-analysis/perspective-reviews/Simone-Biles/2026-08-16_020003/synthesis.md
---

<!-- docs/content-analysis/perspective-reviews/Simone-Biles/2026-08-16_020003/synthesis.md -->

## Executive verdict

All six perspectives returned `trust: strained`, `value: high`, `delight: clear_hit`,
`recommendation: revise`. That unanimity is not a chorus effect — the six reached it by six
different routes, and the convergence is on a single structural fact: **the argument is sound and
the sourcing is not.** Every perspective independently praised the same spine (the ground bookend,
the hallway scene, the Tokyo timeline's procedural form, the Kirk/Morgan concession, the
half-point spotter) and every perspective independently found defects in the apparatus that is
supposed to make that spine checkable.

Eighteen blockers were filed across the six seats. They collapse to **ten P0 repairs**, because
four seats found the same podcast misattribution, four found the same altered quotation, three
found the same unlocatable Netflix attribution, and five found the same stale coaching tense.
Convergence at that rate on _sourcing_ rather than on _interpretation_ is the finding: this draft
argued honestly and cited carelessly.

Three things I verified myself rather than accepting on report, because they were load-bearing and
contested:

1. **The fan is right and the evidence packet is wrong about the Tokyo team-final format.** The
   packet asserts (CLM-09) that "two-up two-count is the correct Olympic team-final format." It is
   not. Tokyo 2020's women's team final was three-up, three-count, verbatim in the primary event
   record. The packet's cited support for the rule (S-05) is the _Call Her Daddy_ transcript — i.e.
   the packet certified Biles's own misstatement as a rule. Because the packet is contaminated, the
   error cannot be resolved by deferring to it, and it will recur on the next draft that cites S-05.
2. **The Enneagram seat is right that the Type 3 discriminator contradicts 9takes' own published
   Type 3 page.** Confirmed at `src/blog/enneagram/enneagram-type-3.md` L44, L199 and L553. The
   draft's tiebreaker sentence argues _for_ the reading it is trying to defeat.
3. **The Enneagram seat is right that Boorman's own gloss competes with the draft's referent for
   "did I do it?"** Confirmed in the local transcript: "yes she did win that allaround **but** … it
   was about how she managed all of the stress and the pressure … **But it wasn't about the gold
   medal around her neck. It was about the process that it took to get there.**"

Two further facts I established that no seat stated outright, both inside the P0-01 passage:
**Jordan Chiles was already one of the four gymnasts competing in the Tokyo team final** and
competed on all four apparatus — so "let Jordan Chiles into the competition" (FAQ) and "Chiles
enters" (body) misdescribe what happened; and **Spring, Texas to Tokyo is ~10,700 km, not nine
thousand** (great-circle, computed).

One thing the reviews did not say loudly enough, and the editor must hear first: **the body is at
4,499 words against a 4,500 lint ceiling with zero headroom** (the draft's own second-pass note
says so). Almost every accepted repair adds words. This revision must cut before it adds, and the
brief below names the funded cuts.

Nothing here overturns the typing. Type 6 survives every seat, including the one whose job was to
break it. What is being repaired is the page's claim to have shown its work.

**Verdict: revise.** No repair requires open-ended research; the six research-required items are
narrow and none of them blocks a P0.

## P0 — mandatory red-flag repairs

---

### P0-01 — The Tokyo team-final format is stated wrongly in the article's own voice, and Chiles's status is misdescribed

- **Originating:** FAN-R1 (fan, blocker); compounded by UNFAM-C3 and UNFAM-C8 (unfamiliar). The
  evidence packet's CLM-09 endorses the error.
- **Location:** L334 (body) and FAQ L71.
- **Quoted passage:** L334 — "Olympic team finals run two-up two-count: two gymnasts per apparatus,
  both scores count, nothing thrown away." FAQ L71 — "under the two-up two-count format she was
  entered on every event … Stopping before that happened **let Jordan Chiles into the competition**
  and kept the team in medal contention." L336 — "Withdraw before an injury and **Chiles enters**
  and the United States stays alive."
- **Adjudicated problem:** three defects stacked in the section that converts "selfish" into
  "loyal," which is the article's single most important act of persuasion.
  (a) The rule is wrong. Tokyo 2020's women's team final was **three-up, three-count**. No Olympic
  team final has run two-up two-count.
  (b) The error was adopted from the subject. The draft's ellipsis in her quote sits exactly where
  she says "since I'm on every event, it's two up two count" — the draft elided her misstatement and
  then restated it unquoted as fact, converting her error into the article's.
  (c) Chiles was **already** one of the four team members and competed on all four apparatus in the
  final. "Let Jordan Chiles into the competition" and "Chiles enters" describe a substitution from
  outside the team that did not happen; what happened is that the remaining three rebuilt their
  lineups around Biles's absence.
  Separately, UNFAM-C8: the same quotation drops "and physical" without an ellipsis, in a sentence
  that already uses one — and the dropped words cut against the draft's framing.
- **Evidence and confidence:** **High, verified this pass against the primary event record.**
  Wikipedia, _Gymnastics at the 2020 Summer Olympics – Women's artistic team all-around_, verbatim:
  "In the final, each team selected three gymnasts to compete on each apparatus. All scores on each
  apparatus were summed to give a final team score." Same record: the four US team members were
  Biles, Chiles, Lee and McCallum; Biles withdrew after the first rotation and "the three remaining
  American athletes had to alter their planned lineups and routines." Biles's wording confirmed by
  grep of `/tmp/biles-transcripts/oVZywdI2Eoo.txt`. **The evidence packet is wrong here and its
  source for the rule is the subject's own retrospective account — the packet must be corrected too,
  or this recurs.**
- **Minimum repair:** (1) Delete the false rule from L334 and FAQ L71. (2) State only what is
  verified: she was slated on all four events and the final has no drop score, so a mid-competition
  injury would have been uncoverable at the standard she was being counted at. (3) Replace "Chiles
  enters" / "let Jordan Chiles into the competition" with what happened — stopping when she did let
  the lineups be rebuilt around Chiles, Lee and McCallum. (4) Restore "and physical" or mark the cut
  with an ellipsis. **Do not write a positive account of the substitution mechanism until RQ-01 is
  answered** — the argument survives on "no drop score, slated on everything" without it.
- **Expected reader benefit:** the gymnastics-literate reader stops auditing and keeps reading, and
  the page's "here is the work" promise becomes true in the paragraph where it matters most.
- **Protected hit at risk:** PROTECT-04 (the timeline's procedural form) and PROTECT-05 (the
  concession). Neither is touched by this repair — the argument's force is unchanged, only its
  arithmetic is corrected. FUTURE's preserve list explicitly protects "the two-up two-count
  explanation"; see Conflicts.
- **Acceptance test:** no sentence in the draft states a per-apparatus count of two for an Olympic
  team final; no sentence implies Chiles was added to the team or entered the competition from
  outside it; every cut inside the quotation is marked.

---

### P0-02 — The page's most-cited source is named wrongly three times, and the wrong name is committed to the audit tool

- **Originating:** CRITIC-R4, FAN-R3, SUBJ-R4 (all blocker) and FUTURE-C6. Four seats.
- **Location:** L202, L206, L238 (all reader-facing, italicised); TESTIMONY LEDGER L125–L132;
  `scripts/blog-source-audit.mjs` L294–L298.
- **Quoted passage:** L202 — "Boorman recalled the answer on the _Beyond Medals and Perfection_
  podcast in October 2025."
- **Adjudicated problem:** no podcast of that name exists. The show is _**The Art of Excellence**_
  (host Glenn Zweig), Ep. 122; "Coaching Simone Biles beyond medals and perfection" is the _episode
  title_. This source carries the cold open, the `key-stat` "2" that is also the meta description,
  the "whoosh" line, and "did I do it?" — i.e. every piece of original material on the page. A
  reader who tries to go listen dead-ends.
- **Evidence and confidence:** **High.** Packet CLM-01, verified by yt-dlp uploader metadata on
  `-6Z_whbdk-U` (uploader "The Art of Excellence Podcast with Glenn Zweig," upload date 20251012)
  and the host's own episode page. I confirmed the tooling contamination directly:
  `grep -n "Beyond Medals" scripts/blog-source-audit.mjs` returns L294 and L298.
- **Minimum repair:** rename all three reader-facing instances to _The Art of Excellence_, with the
  episode title and host as descriptor on first use only; correct the ledger; **and remove the
  phantom entry from `scripts/blog-source-audit.mjs` OUTLETS in the same change.** The quotes and
  the October 2025 date are correct and must not be touched.
- **Expected reader benefit:** the article's most shareable material becomes findable, and the tool
  that is supposed to catch this class of error stops certifying it.
- **Protected hit at risk:** PROTECT-01 and the Boorman testimony (FAN preserve #2). Only the source
  _name_ changes; the quotes are verbatim and stay verbatim.
- **Acceptance test:** searching every italicised publication name in the article returns a real,
  locatable source; `grep -rn "Beyond Medals" src/blog/people/drafts/Simone-Biles.md scripts/blog-source-audit.mjs`
  returns nothing.

---

### P0-03 — A quotation is altered inside quotation marks, in the direction the argument benefits from

- **Originating:** CRITIC-R3, SUBJ-R2, UNFAM-B1 (all blocker) and FAN-C7. Four seats.
- **Location:** L396.
- **Quoted passage:** "There was always a part of me that thought what if? But that was **obviously**
  my anxiety talking."
- **Adjudicated problem:** the published wording is "…**And I think** that was my anxiety talking."
  The draft deletes her hedge and inserts a certainty marker _inside quotation marks_, in the
  section built to test the thesis, in the direction the growth arc needs. This is not recoverable
  as a typo and no synthesis can pass it.
- **Evidence and confidence:** **High.** Packet CLM-17 against S-16 (Olympics.com, rightsholder,
  August 2024); independently reported by four seats.
- **Minimum repair:** restore the published wording verbatim. If the hedge disrupts the sentence
  rhythm, cut _around_ the quotation, never inside it.
- **Expected reader benefit:** removes the only confirmed instance of the page putting words in her
  mouth — and the hedged version is better Type 6 evidence than the confident one, so the repair is
  argumentatively free.
- **Protected hit at risk:** PROTECT-11 (the 2015-vs-2024 turn) sits three lines below. Do not
  restructure the paragraph to accommodate the restored words.
- **Acceptance test:** the string between the quotation marks matches S-16 character for character;
  any removal is marked with an ellipsis.

---

### P0-04 — A quotation is attributed to a named production that does not appear to carry it

- **Originating:** CRITIC-R2, SUBJ-R3, UNFAM-B2 (all blocker). Three seats.
- **Location:** L394.
- **Quoted passage:** "Her framing in _Simone Biles Rising_: 'It wasn't at a point of weakness, it
  was a point of strength.'"
- **Adjudicated problem:** the sentence appears to be real, but not from the docuseries. The subject
  seat advanced the packet's finding materially: the wording is carried in interview reporting
  around the Hoda Kotb coverage, not Netflix, and the fuller form runs "This was more of a strength
  thing for me… It wasn't at a point of weakness, it was a point of strength." The packet records
  that this quote **has no trail in the repository research file** — it entered at second-pass
  drafting with no evidence behind it. On a page selling verifiability, a quotation with a specific,
  wrong, checkable attribution is the most damaging single error available.
- **Evidence and confidence:** **High that the current attribution is unverified; medium-high that
  the docuseries is not the source** (absence across two research passes plus positive attribution
  elsewhere; the docuseries itself remains unaudited). Packet CLM-16 (`risk: high`), packet dispute 1
  ("the largest unresolved gap in the packet"), S-15.
- **Minimum repair:** **drop the quotation marks and paraphrase the documented substance** — she had
  a therapy appointment the morning of the all-around final and framed it as strength rather than
  weakness, which S-15 supports. This needs no new research and does not block the revision.
  Re-attribution to a located interview is the better outcome and is available if RQ-02 resolves;
  do **not** keep the current sentence pending a Netflix audit.
- **Expected reader benefit:** removes the one item on the page a hostile reader could characterise
  as fabricated, while keeping a good beat.
- **Protected hit at risk:** the therapy beat is load-bearing for PROTECT-11 (the thesis test). The
  paraphrase must keep the beat; only the quotation marks go.
- **Acceptance test:** every sentence inside quotation marks maps to a source ledger entry carrying
  that exact wording; the "point of strength" line either gains a locatable citation with the
  correct venue, or loses its quotation marks.

---

### P0-05 — "Nothing further" is false at publication, and the asserted silence is read as a symptom

- **Originating:** FUTURE-R1, SUBJ-R1 (both blocker). Two seats, from opposite lenses — currency and
  fairness — reaching the same sentence.
- **Location:** L440.
- **Quoted passage:** "In June 2026 Biles was hospitalised for something she has never named, posted
  a photo of her wristbands from bed… and thanked 'my close circle…' **Nothing further. An open book
  about the facts, layers about the fear.**"
- **Adjudicated problem:** two failures compounding. The claim is **false** — on 22 July 2026 she
  posted publicly about undergoing a medical procedure with Owens present, and has said she will
  explain "sooner or later." And the falsehood is doing interpretive work: the article takes the
  most private material on the page, asserts she went silent, and converts that silence into
  evidence for the typing. She is characterised as withholding at the moment she was disclosing.
  Being told your medical privacy is a symptom is the sharpest available misread; resting it on a
  fact that is wrong makes it indefensible.
- **Evidence and confidence:** **High.** Packet CLM-22, status `false as of the compile date`;
  sources S-22 (Forbes, 2026-06-06) and S-23 (Forbes / Olympics.com / TheGrio, 2026-07-23→25).
- **Minimum repair:** correct to the record — June hospitalisation, 22 July procedure, **cause** still
  undisclosed, she has said she will explain. Delete "Nothing further." Keep the refusal to
  speculate about the cause. If the layers frame survives at all, apply it only where she applied it
  (L372, trauma), not to her medical privacy.
- **Expected reader benefit:** the paragraph becomes true, becomes _more_ current, and stops
  pathologising a boundary. Two disclosures with the cause withheld both times is stronger evidence
  for the article's own reading than one asserted silence.
- **Protected hit at risk:** PROTECT-12 (the unresolved ending) and the restraint the unfamiliar seat
  preserved. The restraint — not speculating about the cause — is the part worth keeping; see
  Conflicts.
- **Acceptance test:** no sentence in H2 9 asserts an open-ended "never" or "nothing further" about
  her health; every non-disclosure claim carries an as-of date; the paragraph reads correctly if she
  publishes a full explanation tomorrow.

---

### P0-06 — The cold open's frame is contradicted by the interview the same page cites

- **Originating:** CRITIC-R1 (blocker, and the critic's top finding) and SUBJ-C4; FUTURE-C5 supplies
  the compounding date problem.
- **Location:** L213 (cold open), compounded at L438 and FAQ L86.
- **Quoted passage:** L213 — "She is 29, she has not said whether she is going to Los Angeles in
  2028, and **the reason she gives for not knowing has nothing to do with her body.**"
- **Adjudicated problem:** this absolute installs the article's entire frame on the first screen —
  what is unresolved in Biles is psychological — and it is built by quoting one CNN sentence while
  suppressing the adjacent sentences of an interview the article itself cites 225 lines later. In
  that L'Équipe interview she says "But 2028 seems so far away, and **my body is aging. I felt it in
  Paris**," and describes her body having "literally collapsed" after Paris. Quoting a subject and
  dropping the neighbouring sentence in which she says the opposite of what the argument needs is
  the fairness failure that ranks immediately below misquotation. The article's own L440 (a
  hospitalisation) also cuts against it.
  Compounding: the undated L'Équipe line sits inside a paragraph framed as April 2026, but internal
  evidence dates that interview to Owens's Chicago Bears tenure (2024–25). Two data points of
  different vintages are stacked to look like one consistent 2026 position.
- **Evidence and confidence:** **High.** Packet CLM-21 (`quote verified, gloss contested, date
blurred`), S-21; the critic independently verified the body sentences via US syndication of the
  L'Équipe interview (wkyc/NBC News) this pass.
- **Minimum repair:** drop the absolute — say the reason she _names first_ is mental rather than
  physical. Carry the "my body is aging" sentence in one clause at H2 9. Remove the undated L'Équipe
  material from the April 2026 paragraph, or mark its date as unestablished. Soften FAQ L86 the same
  way.
- **Expected reader benefit:** the Paris payoff gets _stronger_, not weaker — a woman with a
  documented physical case for stopping who still cannot say she is finished is a better instance of
  the article's pattern than one for whom the body is silent.
- **Protected hit at risk:** PROTECT-01 (the cold open). The repair changes one clause in the
  orientation paragraph and must not touch "She never looked. She just always knew where it was."
- **Acceptance test:** no sentence claims her indecision is exclusively non-physical; a reader who
  searches "Biles 2028" and finds the L'Équipe body quotes cannot identify a reason the article
  withheld from an interview it cites; no undated quote sits inside a dated paragraph.

---

### P0-07 — The Type 3 premise the whole call turns on contradicts 9takes' own published Type 3 page

- **Originating:** ENN-R1 (enneagram, blocker). Single seat, inside its own domain — and confirmed by
  my own reading of the site's Type 3 content.
- **Location:** L246.
- **Quoted passage:** "An Achiever trusts the scoreboard, because the scoreboard is the point. Biles
  trusts Boorman, and Cecile, and her therapist on Thursdays. She checks with them."
- **Adjudicated problem:** this is the sentence that converts two anecdotes into a typing, and it
  inverts the best-known feature of Type 3. By 9takes' own published theory, a Three who wins a
  third consecutive World title and cannot feel that it landed is _textbook Three_. The draft's
  tiebreaker currently argues for the reading it is trying to defeat, in the paragraph carrying the
  page's "here is the work" claim. A single Enneagram-literate reader stops here.
- **Evidence and confidence:** **High. Verified this pass** against `src/blog/enneagram/enneagram-type-3.md`:
  L44 — "each win satisfies a little less than the last. You need bigger achievements to feel the
  same validation"; L199 — "**The moving finish line.** Each win satisfies less than the last";
  L553 — "The achievement was supposed to answer the question 'Am I valuable?' but accomplishments
  can never resolve that question."
- **Minimum repair:** replace the audience-based discriminator with a content-based one. The Three's
  post-victory question is about the _sufficiency of the result_ ("was that enough"); the Six's is
  about the _recurrence of the danger_ ("can it happen again"). Then let the second quote do the work
  it can already do — "Are we sure? Are we sure? cuz it can't happen again" is a question about a
  future threat, and no Achiever reading explains why the threat rather than the verdict is what she
  cannot close. Three to four sentences, no new research.
- **Expected reader benefit:** the 6-over-3 call goes from asserted to argued on an axis that
  survives a reader who knows Type 3, and the page stops contradicting its own pillar content.
- **Protected hit at risk:** PROTECT-02 (L244, "A Type 6 does not doubt the evidence. She doubts
  whether it covers everything…"). That sentence is the page's best Enneagram writing and is
  _upstream_ of the broken one — repair L246, leave L244 verbatim.
- **Acceptance test:** read L246 alongside `enneagram-type-3.md` L44 and L199. No sentence in the
  draft may assert that achievement satisfies a Three, and the stated discriminator must be testable
  against both quoted questions rather than against the setting in which they were asked.

---

### P0-08 — "Did I do it?" is given a referent the source's own gloss contradicts

- **Originating:** ENN-R2 (enneagram, blocker); UNFAM-C4 reaches the same evidence via packet dispute 2.
- **Location:** L240, propagating to the H2 title (L276), FAQ L68, the TL;DR bullet (L222) and the
  Rabbit Hole falsifier (L427).
- **Quoted passage:** L240 — "There were judges, a scoreboard, a medal, and a stadium of people who
  had watched. She walked up to the one adult whose read she trusted and **asked her to confirm the
  result**."
- **Adjudicated problem:** the tiebreaker requires that the thing she asked about was already
  objectively settled. Boorman's own surrounding sentences point away from the title. The draft
  asserts a referent the source contests and never tells the reader a competing reading exists —
  while the TL;DR generalises it further ("Asks for confirmation of settled facts") and the falsifier
  is built on the same unestablished premise ("about results already settled").
- **Evidence and confidence:** **High on the defect; the correct referent is unresolved.** Verified
  this pass by grep of `/tmp/biles-transcripts/-6Z_whbdk-U.txt`: "yes she did win that allaround
  **but** at the end of it she came up to me and you know said did I do it and it was about how she
  managed all of the stress and the pressure to be this three repeat world champion and the growth
  that she had to show and the trust that she had to put in the people around her… **But it wasn't
  about the gold medal around her neck. It was about the process that it took to get there.**"
  Packet dispute 2 rates the reading "not settleable."
- **Minimum repair:** **stop asserting the referent** — this is a repair, not a retraction, and the
  honest version is the stronger argument. Cut "asked her to confirm the result." Write the
  ambiguity in: she asked the one adult whose read she trusted whether she had done it, and Boorman's
  own account says the "it" was not the medal. A Six asking whether she held together under pressure,
  on a goal only a trusted person can score, is a _cleaner_ Six than one re-checking a scoreboard.
  Adjust the TL;DR bullet and the falsifier to match. Do **not** assert the process reading either —
  the transcript establishes that Boorman glossed it that way, not that Biles meant it that way.
- **Expected reader benefit:** removes the article's most attackable inference and replaces it with a
  better one; protects the falsifier, which currently rests on the same unestablished premise.
- **Protected hit at risk:** PROTECT-02 and FAN preserve #3 — "did I do it?" stays the load-bearing
  anchor and stays located at Glasgow 2015. Only the asserted referent goes.
- **Acceptance test:** no reader-facing sentence — body, H2, FAQ or TL;DR — states or implies that
  the thing she asked Boorman to confirm was the title, the score, or a "settled result." Boorman's
  own gloss is visible to the reader wherever the quote carries argumentative weight.

---

### P0-09 — A habitual present describes a coaching arrangement that ended in December 2024

- **Originating:** FAN-R2 and FUTURE-R2 (both blocker), SUBJ-C7, CRITIC-C9, and the tail of ENN-R3.
  Five seats.
- **Location:** L384 (primary), L246, L382, TL;DR bullet L224, L438.
- **Quoted passage:** L384 — "When Biles performs it, Laurent Landi **stands** on the landing mat and
  does not touch her." L246 — "Biles **trusts** Boorman, and Cecile, and her therapist on Thursdays."
  TL;DR — "Pays for the spotter: half a point, **every time**."
- **Adjudicated problem:** both Landis left World Champions Centre in December 2024 (Cécile to
  Georgia as head coach, Laurent following as associate head coach) and Biles has not competed since
  Paris 2024. A habitual present describing an arrangement two years dead — inside a piece whose
  current-tense window is April–August 2026 — is the clearest available signal that the writer is
  working from 2024 clips, and it lands on the page's single best compressed argument. If she returns
  in 2027 with different coaches, the sentence is not merely stale, it is false.
- **Evidence and confidence:** **High.** Packet CLM-12, which flags the habitual present explicitly
  ("**no longer holds**"), and S-11 (both departures, December 2024); the fan seat independently
  confirmed both at Georgia as of 2026 via Forbes (2026-05-12), USA Gymnastics and Wikipedia, and
  correctly notes that no replacement has been publicly named — so the repair must state what is
  known and **not** assert a vacancy.
- **Minimum repair:** past-tense and date the spotter sentence to the instance already sourced — "At
  the 2023 World Championships in Antwerp, Laurent Landi stood on the landing mat and did not touch
  her." Same for the TL;DR's "every time." Convert L246's present-tense trust list to an era-anchored
  construction. Add one clause at L438 noting the coaches she refers to left WCC in December 2024.
- **Expected reader benefit:** the argument survives both futures — permanent retirement or a
  comeback with new staff — with no further edit, and the cheapest sentence in H2 9 becomes the most
  substantive open question in the comeback story.
- **Protected hit at risk:** PROTECT-07 — "Half a point, in a sport decided by hundredths, on a vault
  she can land, bought against what happens if she cannot." Fix the tense in the sentence _above_ it;
  that sentence itself is amended only by P1-01, which touches "a vault she can land."
- **Acceptance test:** no sentence describes a current coaching arrangement at World Champions Centre
  in the present tense; a reader of H2 9 can tell who coached her through Paris and that they have
  gone.

---

### P0-10 — A three-year-old's reasoning is asserted as fact two sentences after the article says the record cannot hold it, and the pattern reads as etiology

- **Originating:** UNFAM-C5, SUBJ-C2, CRITIC-C6 and ENN-C6. Four seats, four different lenses, one
  passage. Each filed it as a concern; the convergence plus the site's standing rule promotes it.
- **Location:** L258–L264, propagating to L272, L360 and the closing callback L444.
- **Quoted passage:** L258 — "Biles remembers almost nothing from that period." L262 — "**She was
  three. She had already worked out the mechanism**: people get moved while you sleep, and you find
  out in the morning." L360 — "It is the hallway at three years old, scaled up to a federal hearing
  room." L444 — "which is what she has done since she was three."
- **Adjudicated problem:** two defects in the passage the whole thesis rests on.
  (a) **Internal contradiction, catchable unaided.** The article tells the reader the record cannot
  carry this, then states as fact what the child worked out. Her quote — "From my knowledge that
  sometimes during the night…" — is adult narration and does not distinguish what she understood at
  three from what she learned later. The best-sourced claim on the page (Senate testimony, verbatim)
  is handled with more caution than the least-sourced one.
  (b) **It reads as etiology.** Read charitably the draft claims recurrence, not causation, and it
  never says the foster home made her a Six. Read the way most readers will read it, it is a
  childhood-trauma-causes-type story — a claim the Enneagram does not make and one this site has
  explicitly stopped making. The available control is inside the article: Adria went into the same
  placement and was adopted at the same time.
- **Evidence and confidence:** **High on the evidentiary status; medium-high on the fairness and
  theory weight.** Packet CLM-08, `risk: high` — a 27-year-old autobiographical memory of
  pre-school-age events, reconstructed in a promotional interview, with no independent corroboration
  and **none obtainable** (child-welfare records sealed; packet limitation #5).
- **Minimum repair:** two clauses, not a rewrite. (1) Attribute the reasoning to her retelling rather
  than to the child — e.g. "The way she tells it now, the mechanism was already clear to her." The
  _behaviour_ (getting out of bed, going to her brother's room) is hers and needs no hedge. (2)
  Convert the frame from origin to first appearance once: the hallway is the earliest place the
  pattern is visible, not the reason it exists. Adria does not need to be typed; naming that the same
  house produced different people is enough.
- **Expected reader benefit:** the strongest passage stops overdrawing on the evidence limit the
  article itself disclosed, and the piece stops making a claim about causation that the framework
  does not support.
- **Protected hit at risk:** PROTECT-03 — "Verification was the only power on offer." That paragraph
  must stay intact; the repair touches the sentences immediately before it. PROTECT-01 — the closing
  callback keeps its construction and reads as pattern continuity rather than cause.
- **Acceptance test:** no sentence asserts what the three-year-old knew independent of her adult
  account; no sentence states or implies that the foster placement produced the type; the hallway
  scene and the locker callback both survive intact.

## P1 — accepted high-value improvements

---

### P1-01 — Concede the in-sport rules dispute on the spotter, and stop presupposing the spotter is surplus

- **Originating:** ENN-R3 (filed as blocker, `medium-high`), CRITIC-C2, SUBJ-C5. Three seats.
  **Downgraded from blocker** because nothing here is false: the deduction is verified, the reading
  is interpretation, and the thesis does not depend on it. What is wrong is that the page's cleanest
  compressed proof is answerable by an on-record fact the page never mentions.
- **Location:** L384–L386 and the TL;DR bullet at L224.
- **Quoted passage:** "Half a point, in a sport decided by hundredths, on **a vault she can land**,
  bought against what happens if she cannot."
- **Adjudicated problem:** three things weaken the argument and none appear. (a) The draft's own
  quoted rationale — Cécile Landi, "one mistake can have serious consequences" — is a statement about
  objective danger, i.e. the prudential explanation, offered one line before the psychological one.
  (b) Chellsie Memmel, USA Gymnastics' high-performance technical lead, is on record **in the same
  Washington Post article the draft cites** arguing the deduction is a Code problem: "You can stay
  [on the mat] for Pak salto on bars… Why can't you stay for a double-flipping [element] on vault."
  (c) "A vault she can land" presupposes the spotter is surplus, which is exactly what is in dispute
  — and there is no comparison class, because she is the only woman to have competed the skill.
- **Evidence and confidence:** **High.** Packet Memmel section, S-09 (Washington Post, Oct 2023);
  independently corroborated by the critic seat this pass.
- **Minimum repair:** keep the beat, demote the claim. One clause conceding the rules critique, and
  replace "a vault she can land" with wording that does not assume the spotter is unnecessary. Narrow
  the type reading to what survives: she is the only person who has ever had to make the decision,
  and she made it in favour of the failure case.
- **Expected reader benefit:** the page's most quotable argument becomes one a gymnastics-literate
  reader cannot rebut with information the article withheld.
- **Protected hit at risk:** PROTECT-07. The sentence's rhythm is what makes it quotable — change
  "a vault she can land" and nothing else in it.
- **Acceptance test:** the passage acknowledges that the deduction is contested inside the sport as a
  rules problem, and does not assert or imply that other gymnasts would decline the spotter.

---

### P1-02 — Identify Larry Nassar on first mention

- **Originating:** UNFAM-C1 (the unfamiliar seat's highest-priority finding, and the only place it
  left the page).
- **Location:** L350, first sentence of H2 6.
- **Quoted passage:** "In January 2018 she disclosed that she was one of Larry Nassar's survivors."
- **Adjudicated problem:** the section's argument is that she stayed inside _the institution that
  failed her_, which requires the reader to know that Nassar operated inside USA Gymnastics. The name
  appears twice as the load-bearing element of an entire section and is never glossed; the scale —
  which is what makes staying remarkable — is never conveyed at all. Every other weight-bearing name
  in the draft gets a gloss. The gap is upstream: the packet's timeline does not identify him either.
- **Evidence and confidence:** **High.** Confirmed by grep that the body contains no descriptor. Role
  and conviction confirmed by the unfamiliar seat's single permitted search (ESPN, CBS News, BBC):
  USA Gymnastics national team medical coordinator from 1996; sentenced 2017–18; a Michigan court put
  known victims at 265.
- **Minimum repair:** an appositive on first mention — "Larry Nassar, the USA Gymnastics national team
  doctor later convicted of sexually abusing hundreds of athletes." Flat and legally precise; do not
  editorialise.
- **Expected reader benefit:** H2 6 goes from inferable to legible, and its argument gains the weight
  it currently assumes.
- **Protected hit at risk:** PROTECT-10 (the Senate testimony and the authority-paradox pairing). The
  appositive precedes it and must not push the testimony further down the section.
- **Acceptance test:** a reader who has never heard the name can, by the end of H2 6's first
  paragraph, state who Nassar was and why USA Gymnastics is implicated.

---

### P1-03 — Carry the Chiles medal reallocation in one subordinate clause

- **Originating:** FAN-C1 (the fan's highest-priority concern), CRITIC-C1, FUTURE-C4, UNFAM-C7. Four
  seats. **The pipeline is internally split** — the packet records that the research file argued to
  leave it out. This synthesis owns the call.
- **Location:** L398 and FAQ L80.
- **Quoted passage:** "The three of them made the first all-Black gymnastics podium in Olympic
  history."
- **Adjudicated problem:** the claim is true _of the ceremony as it happened_, so this is
  qualification, not retraction. But the section's own title promises "what it didn't settle," and
  the most literally unsettled thing about that podium is whether it stands: CAS voided the inquiry
  that lifted Chiles to bronze and reallocated it to Ana Bărbosu; in January 2026 the Swiss Federal
  Supreme Court sent the matter back to CAS. A reader who knows the medal history reads the silence
  as either tact or ignorance and cannot tell which; the case is live and will produce news inside
  the review window.
- **Evidence and confidence:** **High on the facts; the inclusion call is mine.** Packet CLM-18,
  S-18, S-19. I accept it because four independent seats converged, because the section's own heading
  invites it, and because the article's licence to argue rests on conceding unfavourable facts
  elsewhere — a single silence here retroactively taints those concessions.
- **Minimum repair:** one subordinate clause fixing the claim to the ceremony and noting the bronze
  was reallocated days later and remains disputed. **Do not expand it.** The research file is right
  that the CAS fight is not Biles's story; it needs acknowledging, not relitigating.
- **Expected reader benefit:** the paragraph is non-embarrassing under either CAS outcome, and the
  bow reads better, not worse — the gesture survives the medal.
- **Protected hit at risk:** the word budget (the section is tight against the ceiling) and the bow
  itself. "Absolutely" and "She's queen" are untouched.
- **Acceptance test:** a reader who knows the Bărbosu decision finds nothing in the passage they
  would have to correct, and the paragraph needs no rewrite whichever way CAS rules.

---

### P1-04 — Restore two hedges the draft hardened into absolutes

- **Originating:** SUBJ-C3 and SUBJ-C8.
- **Location:** (a) `key-stat` block L208–L211 and `description` frontmatter L5; (b) L290 and L318.
- **Quoted passages:** (a) key-stat label — "Times Boorman saw Biles lose her place in the air in
  twelve years"; description — "Her coach saw her lose track in the air twice in twelve years."
  (b) L290 — "There was **exactly one** person she cried in front of"; L318 — "the **only** person
  she cries in front of."
- **Adjudicated problem:** (a) Boorman says "**I think** only twice in the 12 years." The draft
  renders a warm twelve-year recollection as a measured fact — and it is the page's biggest number,
  in the SERP snippet, driving the meta_title. (b) Her words are "**A lot of the time** if it was my
  sister… If it wasn't her, silent cries." The draft converts a hedge into a categorical claim about
  her emotional life and then carries it forward in the present tense to Tokyo, where it is
  load-bearing for the phone-call beat.
- **Evidence and confidence:** **High.** Packet CLM-02 (`quotation accurate, framing harder than the
source`), S-01 grep-verified; (b) checked against the draft's own quotation at L290.
- **Minimum repair:** (a) restore the hedge in the key-stat label — "Times her coach recalls seeing
  her get lost in the air in twelve years" — and match the description. (b) "the person she cried in
  front of, when she cried in front of anyone."
- **Expected reader benefit:** the stat is more interesting as testimony than as telemetry, and both
  beats stop asserting more than their sources carry.
- **Protected hit at risk:** the meta_title ("Why Simone Biles Never Looked at the Ground") rests on
  the same recollection but makes no numeric claim — leave it. The Tokyo phone-call beat loses
  nothing from the softer wording.
- **Acceptance test:** no reader-facing rendering presents the "2" as a count rather than a
  recollection; no categorical claim about her crying that the quoted sentence does not support.

---

### P1-05 — Four clause-level factual corrections

- **Originating:** FAN-C2 + UNFAM-C9; FAN-C8; SUBJ-C9 (×2); CRITIC-C8.
- **Location and repairs:**

  | Location | Quoted passage                                              | Problem                                                                                                                                                                          | Repair                                                                  |
  | -------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
  | L398     | "The last two days are the ones worth watching."            | Beam and floor finals were **both 5 August 2024**, same session block (packet CLM-14, S-12, S-13).                                                                               | "The last afternoon" — and let the whiplash of one session do the work. |
  | L324     | "nine thousand kilometres from Spring, Texas"               | **~10,700 km.** Great-circle Spring, TX → Tokyo = 10,711 km, computed this pass. Understates by ~1,700 km in the emotional climax.                                               | Correct the number or drop it.                                          |
  | L256     | "Her biological mother, **Shannon**"                        | Predominant spelling in coverage and on Wikipedia is **Shanon** (packet CLM-06, S-06). A named private individual, misspelled, in the most sensitive paragraph about her family. | Correct the spelling.                                                   |
  | L286     | "a bronze on beam that **America told her** was a disgrace" | Her documented statement is "people made me so ashamed of it in Rio." The draft's version is a larger collective-actor claim with no instance cited (packet CLM-30).             | Scale to her own wording, or cite one instance.                         |

- **Evidence and confidence:** **High on all four.** The distance was computed here rather than taken
  on report (the fan seat offered it as a check, not a correction).
- **Expected reader benefit:** removes four free hits on a page whose competitive claim is source
  discipline.
- **Protected hit at risk:** none. The Tokyo phone-call sentence (L324) is emotionally load-bearing —
  change only the number, not the sentence.
- **Acceptance test:** no sentence implies beam and floor fell on different days; the stated distance
  matches a great-circle calculation or no number is used; the name matches the predominant published
  spelling; the Rio sentence traces to something she or a cited source said.

---

### P1-06 — Attribute Boorman's inference as inference, and drop the interiority claim built on its inversion

- **Originating:** SUBJ-C6.
- **Location:** L282–L284.
- **Quoted passage:** Boorman — "She **wasn't** sitting there in her mind worrying about if she was
  going to fail somehow or if she was going to **let somebody down**." Draft, next line — "**Let
  somebody down.** Years before Tokyo, she was already draining her dread into her rivals."
- **Adjudicated problem:** the quoted clause is the coach's _guess_ about what was in Biles's head,
  and it says she was **not** worrying. The draft lifts the final phrase out of a negation and builds
  a psychological claim — that the cheering was dread-management — that neither Biles nor Boorman
  made, presented in the narrative register as observation. This is inference stacked on inference,
  and the draft does it well one line earlier ("Boorman's read on why"), which makes the lapse
  visible.
- **Evidence and confidence:** **High.** Packet Boorman limitation (c), naming this exact move.
- **Minimum repair:** keep the attribution posture the draft already uses, and soften "draining her
  dread into her rivals" to something the source supports.
- **Expected reader benefit:** removes the clearest instance of unsupported interiority in the body.
- **Protected hit at risk:** the H2 3 → H2 4 bridge added by the cohesion pass runs through this
  paragraph; softening must not break the "let somebody down" thread that pays off in the Tokyo
  section.
- **Acceptance test:** no sentence states as fact what only a third party surmised about her interior.

---

### P1-07 — Make the falsifier operable, and put one sentence of it where the reader will see it

- **Originating:** ENN-C2 and UNFAM-C4. Two seats, converging on the same sentence from opposite ends
  — one says it cannot be operated, the other says it is filed where the article told the reader not
  to go.
- **Location:** L427 (Rabbit Hole), and the absence at L248.
- **Quoted passage:** L427 — "This analysis is overturned by evidence that the reassurance-seeking is
  performance rather than need." L407 — "For the Enneagram nerds. The rest of the analysis stands
  without it." L248 — "**Confidence: high.**"
- **Adjudicated problem:** two defects. (a) No obtainable evidence can settle whether a private
  question was performed or needed; the packet says so directly. An untestable falsifier is a
  rhetorical gesture wearing a scientific costume. (b) The falsifier lives only inside the section the
  article explicitly gives the reader permission to skip, while the body offers "Confidence: high"
  with no stated way to be wrong. A reader who follows the article's own instruction gets the verdict
  without the argument.
- **Evidence and confidence:** **High.** Packet dispute 2 ("not settleable… Both readings survive the
  evidence").
- **Minimum repair:** state at least one **behavioural** falsifier future evidence could satisfy —
  candidates already implied by the piece: she rebuilds without a trusted circle rather than inside
  one; she competes the YDP without a spotter while the deduction still applies; she resolves LA 2028
  without consulting the people she consults. Then promote one sentence of it into the diagnosis
  section beside "Confidence: high," or note there that Boorman reads the moment differently. Keep
  the full treatment in the Rabbit Hole.
- **Expected reader benefit:** the page becomes the only one on this sub-SERP that can be proven
  wrong, which is the whole competitive pitch — and the reader who skips the optional section still
  gets it.
- **Protected hit at risk:** PROTECT-15 (the Rabbit Hole's permission to skip) and PROTECT-19 (the
  existence of a falsifier). Add a sentence to the body; do not remove the Rabbit Hole's framing and
  do not delete the falsifier move.
- **Acceptance test:** a reader who skips the Rabbit Hole entirely can name one observable future
  event that would overturn the Type 6 reading.

---

### P1-08 — Repair the loyalty inference chain in H2 5

- **Originating:** CRITIC-C3, CRITIC-C4 and SUBJ-I9. Three findings, one paragraph, two adjacent
  sentences.
- **Location:** L336 and L338.
- **Quoted passages:** L336 — "Whether she ran that in the hallway or assembled it three years later
  is not recoverable, **and barely changes the finding, because building a load-bearing justification
  after the fact does the same work.**" L338 — "**The reason to read this as loyalty rather than
  self-preservation is what it cost her afterward.**"
- **Adjudicated problem:** two inference failures in the section where falsifiability matters most.
  (a) "Barely changes the finding" is asserted, not argued, and it makes the loyalty reading hold
  regardless of which factual account is true — the article makes itself unfalsifiable in one clause.
  It also leaves her no position in which she is simply telling the truth. (b) Subsequent guilt is
  fully compatible with self-protective action; remorse cannot prove motive.
- **Evidence and confidence:** **High that both are inference defects.** The critic's repair option
  (a) — citing her contemporaneous 2021 line "I simply got so lost my safety was at risk as well as a
  team medal" — is attractive but the quote is sourced only to that seat's search this pass and is
  not in the packet; **use option (b) unless RQ-06 verifies it.**
- **Minimum repair:** (a) cut "barely changes the finding…" and replace with one sentence saying what
  actually changes under each reading, explicitly allowing that the reasoning may have been real and
  in the moment. (b) rest the loyalty claim on behaviour already in the paragraph — she stayed in the
  arena and cheered through a final she was free to leave — and demote the remorse to corroboration.
- **Expected reader benefit:** converts the section's weakest inferences into its strongest using
  material already on the page, and lets the reader believe her account without contradicting the
  article.
- **Protected hit at risk:** PROTECT-05 and the first half of L336 — "Whether she ran that in the
  hallway or assembled it three years later is not recoverable." **Keep the hedge; cut only the
  clause that cancels it.**
- **Acceptance test:** the paragraph contains no claim that the finding holds regardless of which
  factual account is true, and the loyalty claim is supported by an action rather than by a feeling
  reported later.

---

### P1-09 — Name what Type 6 does not explain

- **Originating:** CRITIC-C7, ENN-C5, and the structural half of SUBJ-C2. Three seats.
- **Location:** L419 and the Rabbit Hole counterarguments (L425–L429).
- **Quoted passage:** L419 — "Under strain a Six borrows the Three."
- **Adjudicated problem:** everything Type 6 does not cover — the celebrity machine, the clapback
  register, a decade of self-initiated record-chasing, returning to the site of her worst public
  failure to do it again — is absorbed by the wing, the stress line or the growth line. As written,
  no achievement-oriented behaviour could count against the typing. The pre-write memo committed to
  flagging the residue "in the Rabbit Hole, not hidden"; reader-facing, it is explained away instead,
  and the one item the memo listed that nothing absorbs never appears.
- **Evidence and confidence:** **Medium-high.** This is an argument-structure finding, not a factual
  one, but three seats reached it independently and the draft's own memo concedes the obligation.
- **Minimum repair:** two sentences at the end of the counterarguments naming what Six does not
  account for, without resolving it. Optionally scope the stress line by naming its years (2018–2021,
  which the draft already implies) so it stops being available to absorb any future ambition.
- **Expected reader benefit:** the page demonstrates the falsifiability it claims; it is the cheapest
  credibility gain available in the Rabbit Hole.
- **Protected hit at risk:** PROTECT-17 (the 6w7 humour tell) and PROTECT-13 (the declared subtype
  uncertainty). Add residue; do not weaken either.
- **Acceptance test:** a reader can finish the Rabbit Hole and state one thing about Simone Biles that
  the Type 6 reading does not explain.

---

### P1-10 — Re-discriminate Types 2 and 8 without using distress as the discriminating fact

- **Originating:** ENN-C4. Note this **conflicts with SUBJ preserve #7**; see Conflicts.
- **Location:** L429.
- **Quoted passage:** "Type 2 has a smaller case built on the warmth, and Type 8 one built on the
  clapbacks. Neither explains 'come pick me up, I'm scared.'"
- **Adjudicated problem:** acute terror after losing air awareness at an Olympics is a universal human
  response. It discriminates no type at all, and a Two in distress asking to be retrieved by her
  people is entirely ordinary. This is the one place the article uses raw distress as type proof —
  the error the whole genre is accused of.
- **Evidence and confidence:** **High.** 9takes' own `enneagram-type-6.md` L498 supplies the correct
  discriminator: "If you're aggressive because you genuinely don't feel fear, you might be an 8. If
  you're aggressive _because_ you feel fear and refuse to submit to it, you're likely a counterphobic
  6." Her line "I was always the kid that if you said I couldn't do something, I'm doing it" is
  already on the page at L415 and fits the second.
- **Minimum repair:** keep both dismissals and their brevity; swap the discriminating fact. For Eight,
  use the fear-refusal discriminator. For Two, use direction: a Two's worst outcome is not being
  needed; hers is letting people down.
- **Expected reader benefit:** the two-line dismissal stops being the weakest theory move on the page.
- **Protected hit at risk:** PROTECT-19 and SUBJ preserve #7. The subject seat preserved these
  dismissals as fairness assets — brief, non-totalizing. That is satisfied: keep the sentences, change
  the evidence inside them.
- **Acceptance test:** neither alternative type is dismissed using an expression of fear or distress as
  the discriminating fact.

---

### P1-11 — One sentence separating anxiety from type

- **Originating:** ENN-C7.
- **Location:** best placed in the diagnosis section, after L244.
- **Adjudicated problem:** the piece runs entirely on fear-flavoured evidence — dread, therapy, "my
  anxiety talking," the twisties — about a subject who has publicly discussed anxiety. It never tells
  the reader that anxiety is not a type, that all nine types produce anxious people, and that what
  makes this a Six is the _shape_ of the fear (specific, anticipatory, relational, resolved by
  verification) rather than its presence.
- **Evidence and confidence:** **Medium-high** as an editorial obligation. This site's
  highest-traffic page is about the Enneagram and mental illness, and this draft's FAQ already
  declines the psychologising move once (PROTECT-09). The body owes the same clause.
- **Minimum repair:** one sentence.
- **Expected reader benefit:** inoculates the page against its most common and most damaging reader
  objection — "so anyone anxious is a Six."
- **Protected hit at risk:** PROTECT-02 (L244). Place the sentence after it; do not fold it in.
- **Acceptance test:** a reader who has an anxiety disorder and is not a Six can find the sentence
  that tells them so.

---

### P1-12 — Freeze the perishable frame before publication: de-age the H2 9 heading and slug, date the 50-50

- **Originating:** FUTURE-C1 and FUTURE-C2.
- **Location:** H2 9 heading and anchor `simone-biles-is-29-and-the-answer-is-still-50-50`; FAQ L86
  (which points at that anchor); `description` frontmatter L5; L213; FAQ answer "She has not decided."
- **Adjudicated problem:** two decay paths, both cheap now and expensive later. (a) The heading
  hard-codes an age that is wrong on 14 March 2027 — seven months out. The heading is the cheap part;
  the **slug** is the expensive part, because changing it breaks the FAQ cross-reference and any
  inbound fragment links. (b) The 50-50 is load-bearing in four places including the SERP-facing
  description, and it has a scheduled resolution point **ten weeks after publication**: the 2026
  World Championships open in Rotterdam on 17 October 2026 with a women's team event. Whatever she
  does about Rotterdam is itself an answer. The FAQ's flat "She has not decided" is a bare
  present-tense status claim in the answer position — the fragment most likely to be extracted and
  shown out of context.
- **Evidence and confidence:** **High.** Packet identity section (b. 14 March 1997); 2026 Worlds dates
  confirmed by the future seat via the championship page; 2027 Worlds (6 Oct 2027) on the LA28
  qualification pathway per the FIG listing.
- **Minimum repair:** make the heading age-free and set the anchor accordingly **before** publication;
  let the age live once in body prose. Open the FAQ answer "As of April 2026 she had not decided…"
  Rewrite `description` to lead with the durable thesis — the never-looked-at-the-ground reversal is
  the page's most distinctive asset and does not decay — rather than with a perishable status. Add a
  visible as-of date to H2 9.
- **Expected reader benefit:** one annual edit becomes a word instead of a slug migration, and a
  single October press release can no longer falsify the SERP-facing sentence.
- **Protected hit at risk:** PROTECT-12 — **do not resolve the 50-50.** The close's "Not a comeback.
  Not a retirement." stays; it only needs the section date-anchored.
- **Acceptance test:** no heading or anchor slug contains an age; no reader-facing sentence asserts her
  2028 status as a present fact without an as-of date; the description survives either decision.

---

### P1-13 — Two first-mention glosses: "named skills" and the Enneagram itself

- **Originating:** UNFAM-C2 and UNFAM-C6.
- **Location:** L213 (orientation paragraph) and the first "Type 6" mention (L234/L244).
- **Quoted passages:** "a woman with 11 Olympic medals, 30 World medals and **five named skills**";
  and the systemic absence — "Loyalist" occurs **zero** times in reader-visible body text despite
  sitting in the draft's own keyword set.
- **Adjudicated problem:** (a) three numbers establish why she matters; the most impressive one means
  nothing to a newcomer and is back-explained ~2,500 words later. The gloss exists upstream in the
  packet and was dropped. (b) The body never says what the Enneagram is or that there are nine types.
  The claim is followable — the draft describes the pattern in excellent plain English — but the
  reader finishes unable to say what kind of system they were shown, and the page's own keyword never
  appears where a reader can see it.
- **Evidence and confidence:** **High.** Packet: "five skills named after her in the FIG Code of
  Points (two vault, one beam, two floor)," `verified fact`. Grep-confirmed absence of "Loyalist."
- **Minimum repair:** (a) "five skills named after her in the sport's code of points" — five words.
  (b) one clause at first mention naming the system and the type: "Type 6, the Loyalist, one of nine
  Enneagram patterns sorted by what a person is defending against." The FAQ already contains that
  sentence; promote it.
- **Expected reader benefit:** the credential that most distinguishes her registers on contact, and
  the framework becomes legible without adding jargon.
- **Protected hit at risk:** PROTECT-01 — the orientation paragraph sits between the key-stat and the
  cold open's payoff. Five words, no rhythm change.
- **Acceptance test:** a reader can say what a "named skill" is at first encounter and what kind of
  thing an Enneagram type is, without consulting the FAQ or the Rabbit Hole.

---

### P1-14 — Quote the Type 3 line, and restore the context that cuts against Three

- **Originating:** UNFAM-C10 and ENN-I3. **Research resolved this pass** — see Research required
  (RQ-04, closed).
- **Location:** L246.
- **Quoted passage:** "The Type 3 reading is the popular one and it is not stupid: the medals, the
  branding, the endorsement portfolio, **her own line about needing to find out who she is without
  gymnastics**."
- **Adjudicated problem:** the article's method everywhere else is to show the sentence and let it do
  the work. Here the counter-case's single strongest item is referenced and never quoted — grep
  confirms it appears nowhere in the draft. So the reader is asked to take the _opposing_ evidence on
  faith while the article's own case is fully quoted, in the section promising "Nobody shows their
  work. Here is the work." Once noticed it reads as a thumb on the scale.
- **Evidence and confidence:** **High — the line is located.** Verified this pass by grep of
  `/tmp/biles-transcripts/oVZywdI2Eoo.txt` (_Call Her Daddy_, already in the pipeline): "**And then I
  was like okay I really need to find out who I am without gymnastics.**" The surrounding context
  cuts against Three and is available from the same passage: she reaches the line by finding it
  _weird_ that people followed her for winning — "how's that the biggest thing for you to follow me
  because I won this? It was kind of weird."
- **Minimum repair:** quote the line, and add the one clause of context. This partly repays what
  P0-07 costs, from primary material already in hand.
- **Expected reader benefit:** the section's central promise holds for both sides of the argument, and
  the strongest item in the opposing case is shown to be weaker than it looks.
- **Protected hit at risk:** P0-07 rewrites the sentences immediately after this one. Sequence P0-07
  first, then this, so the diagnosis paragraph is edited once.
- **Acceptance test:** every specific piece of evidence named in the diagnosis section, for or against,
  is either quoted or removed.

---

### P1-15 — Cut the Colts clause and fix the two present-anchored durations

- **Originating:** FUTURE-C3 and FUTURE-C7. The draft's own cohesion pass already flags the Colts
  clause as "the cheapest 8 words on the page."
- **Location:** L440, L213, L402.
- **Quoted passages:** "Owens is in Indianapolis now, ninth NFL season."; "who has spent **twenty
  years** above a hard floor"; "**still cannot tell you** whether she is finished."
- **Adjudicated problem:** (a) a one-year contract signed 17 March 2026 expires inside the review
  window, and the clause is a one-clause orphan nothing picks up — eight words that buy no argument
  and expire on a known date. (b) "Twenty years" is measured from the reading moment: she began at six
  in 2003, so it is a round-down today (~23 years) and wrong by a further year every year. (c) "Still
  cannot tell you" is a now-claim in a past-tense sentence; it breaks the day she announces anything.
  Contrast the piece's healthy spans — "eight years apart," "five years later, in Tokyo" — all
  measured between two fixed past points.
- **Evidence and confidence:** **High.** Packet CLM-25 (S-26) and CLM-24.
- **Minimum repair:** cut the Colts clause outright — this is the funded cut that pays for P1-03 or
  P2-02. "Since she was six" for the first duration; date-anchor the second ("and by the summer of
  2026 still could not say").
- **Expected reader benefit:** removes the cheapest staleness on the page at zero argumentative cost,
  and both sentences become permanently correct.
- **Protected hit at risk:** PROTECT-11 — the 2015-vs-2024 comparison closing H2 8. **Fix only the
  trailing tense; leave the comparison alone.**
- **Acceptance test:** no NFL roster status appears in the present tense; no duration on the page is
  measured from the reading moment.

---

### P1-16 — Strengthen citation persistence on the load-bearing quotes

- **Originating:** FUTURE-C8. **Accepted narrowed** — see Rejected feedback for the part not taken.
- **Location:** `citations` frontmatter, and the sourcing behind the cold open, the key-stat and the
  close.
- **Adjudicated problem:** four Boorman quotes plus the "whoosh" — which together carry the cold open,
  the key-stat, the meta description and the final paragraph — rest on a single YouTube upload
  (`-6Z_whbdk-U`) that can be deleted, made private or re-uploaded under a new ID at the channel
  owner's discretion. The locker photo and the hospital wristband cite Instagram Stories whose
  originals have already expired.
- **Evidence and confidence:** **Medium-high.** Packet source ledger S-01, S-24, and research
  limitation 2 (403/451/timeout failures across washingtonpost.com, cnn.com, nbcnews.com and
  olympics.com during the packet's own research).
- **Minimum repair:** add the canonical episode page (glennzweig.com Ep. 122, S-02) alongside the
  YouTube URL — which the P0-02 fix requires locating anyway, so this is nearly free — and cite the
  reporting outlets rather than the expired Stories for the locker and hospital beats.
- **Expected reader benefit:** the page's most load-bearing quotes stop depending on one deletable
  video.
- **Protected hit at risk:** none.
- **Acceptance test:** no citation points at an expired ephemeral post; the Boorman material carries a
  second, non-YouTube citation.

---

### P1-17 — Stop subordinating sworn testimony about institutional abuse to a private compulsion

- **Originating:** SUBJ-C1.
- **Location:** L360.
- **Quoted passage:** "Leaving ends the surveillance, and **the surveillance is the entire point**. It
  is the hallway at three years old, scaled up to a federal hearing room."
- **Adjudicated problem:** she stated her motive under oath, and the draft quotes it intact and
  prominently first (L354, L356) — which is why this is a repair and not a break. But "the entire
  point" forecloses the reading she actually gave (keeping the failures connected so they would not
  be "brushed to the side," for every survivor and not only for herself), and "surveillance" imports a
  clinical register her own words do not carry, over the highest-stakes material on the page.
- **Evidence and confidence:** **High on the wording; medium on how strongly a subject would object.**
  Packet CLM-11 rates the Senate testimony the strongest item in the packet: "stated motive, primary
  source, no inference required."
- **Minimum repair:** two words. Replace "the entire point" with a non-exclusive construction, and
  reconsider "surveillance."
- **Expected reader benefit:** the Type 6 reading survives completely; what goes is the implication
  that testifying against USA Gymnastics, the USOPC and the FBI was at bottom about managing her own
  fear.
- **Protected hit at risk:** **PROTECT-10 — this is the strongest evidence-to-theory pairing in the
  draft and the enneagram seat says it should gain weight in revision, not lose it.** Soften the
  exclusivity, not the pairing. This repair also interacts with P0-10(b): the "hallway scaled up"
  callback stays, read as continuity rather than cause.
- **Acceptance test:** a reader finishes the section able to state her own stated reason for staying,
  without it having been subordinated to the childhood pattern.

---

### P1-18 — Stop crediting Kirk and Morgan with an argument they did not make

- **Originating:** CRITIC-C5.
- **Location:** L330–L332.
- **Quoted passage:** "Give them their strongest version, **because they had one.** An Olympic team is
  four other women who trained five years, and one was going home without a medal because of a
  decision Biles made in a hallway."
- **Adjudicated problem:** the named opposition is the two most discreditable critics available, and
  the objection the article then answers is far better than anything either of them advanced — yet
  "because they had one" attributes it to them. That is unfair in the critics' direction, and it makes
  the steelman look manufactured to a reader who remembers what Kirk and Morgan actually said.
- **Evidence and confidence:** **Medium-high.** The critic seat's own search this pass confirms the
  reputable-criticism record really is thin — no serious in-sport critique surfaced — so this is a
  framing fix, not a research gap.
- **Minimum repair:** split the move. Name Kirk and Morgan as the noise, then introduce the
  teammates-cost objection in the article's own voice as the version worth answering.
- **Expected reader benefit:** keeps the section's real virtue while removing an unfairness.
- **Protected hit at risk:** **PROTECT-05 — the concession itself ("That cost landed on real people,
  and Biles has never argued otherwise") is preserved by three separate seats and is the article's
  licence to argue.** Change only the attribution; the concession, its content and its position ahead
  of the rebuttal all stay.
- **Acceptance test:** no sentence credits Kirk or Morgan with an argument they did not advance, and
  the concession still appears before the rebuttal.

---

### P1-19 — Re-set the confidence label after the P0 repairs

- **Originating:** ENN-C1.
- **Location:** L248 — "**Confidence: high.**"
- **Adjudicated problem:** with P0-07 and P0-08 open, the stated confidence rests on one coach's
  decade-old recollection whose referent is disputed by the coach's own gloss, one self-reported
  therapy exchange, and one costly behaviour with a competing non-psychological explanation (P1-01).
  That is a solid case for Type 6 and a _moderate_ case for the specific tiebreaker over Type 3.
- **Evidence and confidence:** **High.** This is a dependency on the other repairs, not an independent
  finding.
- **Minimum repair:** after the P0 fixes land, re-read the label and consider splitting it — high
  confidence on Six over Three; moderate on the discriminator. The label must name what it is
  confident _about_.
- **Expected reader benefit:** the confidence line becomes information rather than decoration, which
  is the differentiator this page is selling.
- **Protected hit at risk:** the _existence_ of a stated confidence level, which is part of the page's
  competitive posture. Re-set it; do not delete it.
- **Acceptance test:** the confidence statement names what it is confident about, and every evidence
  item it leans on is still standing after the P0 repairs.

## P2 — optional opportunities

- **P2-01 — Close the proprioception loop.** (FAN-C6, the fan seat's "biggest missed delight," and the
  best available payoff for the stated delight target.) The draft owns both halves of an insight and
  never joins them: she navigated by a non-visual signal ("more of a whoosh that I hear in my ears"),
  and the twisties are the failure of exactly that signal. A gymnast who relies on visual spotting has
  a second instrument when air sense goes; by her own account she did not use the visual one. One or
  two sentences, **written as inference and hedged**, placed between L206 and L213 — never at the
  close, which earns its effect by restraint. **Blocked on RQ-05** (the technique claim it rests on is
  reasoned, not sourced). This is the one P2 that pays for itself: it is the "I knew those moments and
  never connected them that way" payload, and it is the reason an informed fan would share the piece.
- **P2-02 — Introduce Andrade in one clause.** (FAN-C3.) "Silver behind Rebeca Andrade" reads as a
  procedural detail; identifying her as the Brazilian who had become Biles's closest rival of the quad
  makes the bow the loaded gesture it was and gives "She's queen" its weight. ~8 words — exactly what
  P1-15's Colts cut frees.
- **P2-03 — Note that Suni Lee won the all-around gold.** (FAN-C4.) One clause in the Tokyo aftermath.
  Conspicuous by absence to a fan precisely because it cuts _against_ the section's grief note:
  something good came out of the hallway decision, for a teammate.
- **P2-04 — Engage 3w2 specifically, not just Type 3.** (ENN-C3.) The board typing is 3w2; the 2 wing
  is what makes that reading coherent, because it absorbs the warmth, the cheering for rivals and the
  "let somebody down" vocabulary the draft claims for social Six. One to two sentences distinguishing
  a 3w2's other-orientation (image maintained _through_ being valued) from a social Six's (safety
  maintained _through_ obligation).
- **P2-05 — Add the pre-Tokyo dread-plus-countermeasure quote.** (ENN-I2.) From the same _Call Her
  Daddy_ transcript already mined four times: "Something's coming up. It feels like I don't know what
  it is, but like I cannot control this. It is out of my control. So we're going to control what we
  can control." Objectless anticipatory threat followed immediately by concrete preparation is the Six
  engine in her own contemporaneous words — and it reduces the piece's reliance on a 27-year-old
  age-three memory as the emotional proof of the pattern. Two sentences in the timeline's first beat.
  **Note:** the surrounding transcript's medication detail is off-limits per the research file's ADHD
  handling rule; quote the dread and the control response only.
- **P2-06 — Forward-reference the Senate testimony from the diagnosis section.** (ENN-I1, narrowed.)
  The testimony is the only Six evidence in the packet classed `verified fact` with a stated motive
  and no inference required, and it is currently stranded in H2 6 while the diagnosis rests on two
  recollections. One clause, not a restructure — see Rejected feedback for why the restructure is not
  taken.
- **P2-07 — Retitle H2 3 or move its answering clause up.** (UNFAM, below finding threshold.) A reader
  scanning headings who stops at "Why Simone Biles asked her coach 'Did I do it?'" should get the
  answer within one paragraph. The cohesion pass already patched this once; P0-08 will disturb it
  again.

## Research required before deciding

- **RQ-01 — What is the precise rule that let the USA rebuild its lineups after Biles's withdrawal,
  and what would have happened after a mid-competition injury?** _Blocks:_ only the _positive_
  explanation in P0-01; the correction (deleting the false rule) proceeds without it, and the argument
  stands on "slated on all four events, no drop score." _Needed source:_ FIG Technical Regulations /
  the Olympic artistic gymnastics team-final competition format for Tokyo 2020 — **not** press
  coverage and **not** the subject's retrospective account, which is how the error entered. _Also
  required:_ correct packet CLM-09, which currently certifies the wrong rule and will re-inject it.
  (Originating: UNFAM-Q2, FAN-R1.)
- **RQ-02 — Where exactly is "It wasn't at a point of weakness, it was a point of strength" from?**
  _Blocks:_ nothing — P0-04's safe repair (de-quote and paraphrase) needs no answer. _Changes:_
  whether the sentence returns as a quotation with a correct venue. _Needed source:_ _Simone Biles
  Rising_ Part 2 (Netflix, October 2024) with a timecode; failing that, the Hoda Kotb _Making Space_
  episode audio of 31 July 2024 and TODAY's October 2024 coverage (which returned 403 to the subject
  seat). _Process question worth asking separately:_ how a quotation entered at second-pass drafting
  with no trail in the research file.
- **RQ-03 — Does the 2025–2028 WAG Code of Points still carry the 0.5 neutral deduction for a spotter
  on vault?** _Blocks:_ nothing — P0-09's repair (past-tense, dated to Antwerp 2023) is correct under
  either answer, which is why the open question does not change the recommendation. _Changes:_ whether
  the present-tense sentence "Under the code his presence alone is an automatic 0.5 deduction" is
  already wrong today. _Needed source:_ the official FIG WAG Code of Points 2025–2028 PDF on
  gymnastics.sport (`publicdir/rules`), neutral-deductions and vault sections. The future seat's two
  searches returned the MAG code only. (Originating: FUTURE-Q1.)
- **RQ-04 — CLOSED this pass.** _Was:_ is "her own line about needing to find out who she is without
  gymnastics" an actual quotation? _Resolved:_ yes, verbatim in
  `/tmp/biles-transcripts/oVZywdI2Eoo.txt` — "And then I was like okay I really need to find out who I
  am without gymnastics" — with anti-Three context in the same passage. Moved to **P1-14**.
- **RQ-05 — Is visually finding the landing standard coaching technique in women's artistic
  gymnastics?** _Blocks:_ **P2-01**, and the fan's related suggestion to gloss the technique in the
  cold open. The draft would be making a technique claim in its own voice, and the fan seat states
  explicitly that this was reasoned, not sourced. _Needed source:_ a coaching-methods source or an
  on-record coach; Boorman's 2024 memoir _The Balance Point_ is the nearest candidate already adjacent
  to this material. **Do not ship P2-01 on reasoning alone.**
- **RQ-06 — Has anything moved since 13 August 2026, and is the contemporaneous 2021 team-medal quote
  real?** _Two narrow items, one search window._ (a) Any statement resolving the 50-50, or explaining
  the June/July 2026 health matter — affects the exact wording of P0-05 and P1-12; the packet's own
  coverage of the 13–16 August window is explicitly thin. (b) Verify Biles's 2021 response to critics,
  "I simply got so lost my safety was at risk as well as a team medal" — if it holds, P1-08 can take
  the critic's stronger repair option (a) instead of option (b). _Needed source:_ her Instagram and USA
  Gymnastics competition entries for the 2026–27 season; contemporaneous July–August 2021 reporting for
  (b).

## Conflicts and editorial tradeoffs

1. **The evidence packet is wrong, and two seats' preserve lists inherit the error.** Packet CLM-09
   certifies "two-up two-count" as the correct Olympic team-final format, sourced to the _Call Her
   Daddy_ transcript — i.e. to the subject's own misstatement. FUTURE's preserve list #3 then protects
   "the two-up two-count explanation in H2 5" as durable because it rests on "closed historical
   rules." **Resolution:** correctness wins. The _procedural frame_ is protected (PROTECT-04); the
   rule inside it is corrected per P0-01. Both the draft and the packet must be fixed, or the next
   refresh re-injects it.
2. **UNFAM preserve #8 protects a sentence that is false.** The unfamiliar seat lists "posted a photo
   of her wristbands from bed… Nothing further. An open book about the facts, layers about the fear"
   as a trust asset, because refusing to speculate is a virtue. FUTURE-R1 and SUBJ-R1 independently
   establish the sentence is untrue. **Resolution:** the _restraint_ is the asset and survives — the
   article still declines to speculate about the cause. "Nothing further" goes, per P0-05. The
   unfamiliar seat read the packet after its unaided pass and did not surface CLM-22; this is a
   knowledge gap, not a judgement I am overruling.
3. **SUBJ preserve #7 protects the Type 2 / Type 8 dismissals; ENN-C4 wants them repaired.** These are
   compatible: the subject seat values their brevity and non-totalizing character; the enneagram seat
   objects to the discriminating _fact_. **Resolution:** keep both sentences and their length, swap
   the evidence inside them (P1-10).
4. **The Chiles/CAS clause is contested inside the pipeline itself.** The packet records that the
   research file argued to leave it out as "not Biles's story," and I agree it is not. Four seats
   nonetheless converged on including one clause. **Resolution: include it** (P1-03), strictly bounded
   to a subordinate clause. Deciding factors: the section's own heading promises "what it didn't
   settle"; the case is live and will produce news inside the window; and the article's licence to
   argue rests on conceding unfavourable facts elsewhere, so a single conspicuous silence taints the
   concessions that are working.
5. **Fixing P0-07 and P0-08 weakens the diagnosis section's rhetorical certainty, on purpose.** Both
   repairs remove an assertion and replace it with a narrower, better-supported one, and P1-19 then
   re-sets the confidence label downward on the discriminator. The tradeoff is real: the page will
   read slightly less decisive in the paragraph that converts anecdote into typing. It will also
   survive the two readers most likely to attack it. P1-14 partly repays the loss with primary
   material.
6. **The critic wants the steelman de-attributed; three seats protect the concession it sits in.**
   These pull in the same paragraph. **Resolution:** the concession is untouchable (PROTECT-05); only
   "because they had one" changes (P1-18).
7. **Word budget is the binding constraint, and it is not soft.** The draft's own second-pass note
   records the body at 4,499 words against a 4,500 lint ceiling with "zero headroom," and the cohesion
   pass then trimmed to 4,492. P0-01, P0-04, P0-05, P0-06, P0-07, P0-08 and P0-10 all add words, and
   eleven of the nineteen P1s do too. **Resolution: this revision must cut before it adds.** Funded
   cuts already identified by the pipeline and the seats: the Colts clause (~8 words, P1-15), the
   "Nothing further" gloss (P0-05 replaces rather than adds), and the paraphrase-after-quote
   redundancy the cohesion pass was already hunting. If the ceiling still binds after the P0s, cut P2
   entirely rather than trimming a P0 repair — and note in the revision record what was dropped.
   **Do not silently truncate.**
8. **P0-10 and PROTECT-03 touch the same paragraph.** The repair changes the sentences immediately
   before "Verification was the only power on offer" and the framing after it. That paragraph itself
   is protected by two seats as the article's plainest and most persuasive reasoning. Edit around it.

## Rejected feedback

- **ENN-I1 as a restructure of the diagnosis section** — "make the [Senate] testimony the second
  pillar rather than leaving it stranded in H2 6." _Rejected as scoped._ Moving the testimony forward
  would displace "did I do it?" from Glasgow 2015, which three seats identify as the structural choice
  that keeps this from being a generic withdrawal piece (FAN preserve #3, PROTECT-02). It would also
  pull the article's best evidence-to-theory pairing away from the section it anchors (PROTECT-10).
  Accepted instead in its cheap form as **P2-06**, a one-clause forward reference.
- **CRITIC-C3's repair option (a) as written** — cite Biles's 2021 "my safety was at risk as well as a
  team medal" and drop the hedge. _Rejected pending verification._ The quote is not in the packet and
  rests on one seat's search this pass; the article's whole problem in this revision is quotations
  that entered without a trail. Take option (b) now; option (a) returns if RQ-06(b) closes.
- **CRITIC-Q3's research direction — Gymcastic archives and GymnasticsCoaching.com comment threads for
  in-sport critics.** _Rejected for this revision._ The critic's own search established the reputable-
  criticism record is genuinely thin, community discussion cannot establish that a critique was
  correct, and the P1-18 framing fix resolves the unfairness without it. Chasing it would expand scope
  for a finding already repaired.
- **FUTURE-C8's acceptance test as an absolute** — "no load-bearing quote has exactly one citation
  whose persistence is controlled by a single uploader." _Accepted narrowed, rejected as stated._
  Re-sourcing every load-bearing quote is a research programme, not a revision. Adding the canonical
  episode page and de-citing the expired Stories captures nearly all the durability gain for almost no
  cost (P1-16).
- **FAN-C5's technique gloss as currently phrased** — a clause in the cold open establishing that
  gymnasts are taught to find the landing visually. _Not rejected on merit; moved to RQ-05._ The fan
  seat states the claim is reasoned rather than sourced, and it would be a technique assertion in the
  article's own voice at the top of the page. That is exactly the class of error this revision exists
  to remove. It ships with a source or not at all.
- **Preserving "Nothing further" (UNFAM preserve #8)** and **preserving "the two-up two-count
  explanation" (FUTURE preserve #3)** — _rejected as preservation instructions_, per Conflicts 1 and 2.
  Both underlying virtues (restraint about the cause; the procedural frame) survive in corrected form.
- **The premise that fixing the "did I do it?" referent weakens the case (implicit in the draft's own
  TYPE-CHALLENGE MEMO, which names it the "named tiebreaker").** _Rejected._ A Six asking whether she
  held together under pressure — on a goal no scoreboard measured, which is precisely why she had to
  ask a person — is a stronger Six than one re-checking a settled score. The repair improves the
  argument; it does not concede it.

## Protected hits

- **PROTECT-01 — The ground bookend.** L202–L204 ("She never looked. She just always knew where it
  was") and L446 ("She always knew where the ground was, and she never once looked at it. She was too
  scared to look."). Named by all six seats. Zero temporal dependency; does not survive a name swap;
  the reason the article survives losing its news. **Do not preview the payoff at the top and do not
  add the P2-01 inference at the close.**
- **PROTECT-02 — The two-questions spine.** "Two sentences, eight years apart, running the same
  errand," and L244: "A Type 6 does not doubt the evidence. She doubts whether it covers everything,
  because what she is really asking is whether she is safe now, and no scoreboard has ever answered
  that." The page's best Enneagram writing. Verbatim.
- **PROTECT-03 — "Verification was the only power on offer."** L264. The article's plainest and most
  persuasive reasoning. P0-10 edits around it, never into it.
- **PROTECT-04 — The Tokyo timeline's procedural form**, including the one-touch warm-up gloss and the
  `inner-thought` beat on the landing mat (L312), built only from her own account. Collapses on any
  non-gymnast subject, which is the point.
- **PROTECT-05 — The Kirk/Morgan concession.** L332: "Give them their strongest version… An Olympic
  team is four other women who trained five years, and one was going home without a medal because of a
  decision Biles made in a hallway. That cost landed on real people, and Biles has never argued
  otherwise." Preserved by three seats. The article's licence to argue. Position ahead of the rebuttal
  is part of the hit.
- **PROTECT-06 — The Osaka distinction.** L340. Costs the piece its easiest solidarity move and is the
  best sentence on the page for a hostile reader.
- **PROTECT-07 — The half-point spotter sentence.** L386: "Half a point, in a sport decided by
  hundredths, on a vault she can land, bought against what happens if she cannot." Fix the tense above
  it (P0-09) and the four words "a vault she can land" (P1-01); leave the rest of the sentence alone.
- **PROTECT-08 — "Ask her for the lowest point of the Tokyo era and she does not name Tokyo."** L366.
  The article letting the subject overrule its own sense of drama.
- **PROTECT-09 — The twisties FAQ framing.** FAQ L74: "a documented proprioceptive phenomenon in
  gymnastics, not a psychiatric diagnosis." Non-negotiable, named by three seats; a later refresh will
  be tempted to blur the twisties into the type.
- **PROTECT-10 — The Senate testimony section and the authority-paradox paragraph.** L354–L360. The
  strongest evidence-to-theory pairing in the draft and the least perishable evidence on the page.
  P1-17 softens the exclusivity of one phrase and must not weaken the pairing.
- **PROTECT-11 — The 2015-versus-2024 turn closing H2 8.** L402: "A third consecutive World title
  produced 'did I do it?' Three Olympic golds produced a woman who, two years later, still cannot tell
  you whether she is finished." The structural reason the piece survives critical reading. Fix only
  the trailing tense (P1-15).
- **PROTECT-12 — The unresolved ending.** L442–L444, the locker photo and "Not a comeback. Not a
  retirement." **Do not let a revision resolve the 50-50**; date-anchor the section instead (P1-12).
- **PROTECT-13 — The instinctual-subtype paragraph including its declared uncertainty.** L413–L415.
  Do not "firm up" so/sx.
- **PROTECT-14 — "She answers fear by putting a body in the room. Her brother's, then her husband's.
  On the vault, her coach's."** L382. Remove it and the back half loses its spine. (P0-09's tense fix
  applies to L384, not to this sentence.)
- **PROTECT-15 — The TL;DR accordion and the Rabbit Hole's optional framing.** Both make a long
  analytical piece navigable. P1-07 adds a sentence to the body; it does not remove the Rabbit Hole's
  permission to skip.
- **PROTECT-16 — Nellie's "my own barriers" and "Well, yeah, aren't you? Where'd you come from?"**
  L266–L268. The adoption handled without sanding it down.
- **PROTECT-17 — The 6w7 humour tell.** L411: "The tell is where the humour points. Hers lands on her
  own fear, a pressure valve on dread rather than an exit."
- **PROTECT-18 — "my love blanky" and the Owens ruling.** L376, L380: "he has to have his moments too
  and I let him have it." The only treatment of that pile-on that neither mocks him nor defends her.
- **PROTECT-19 — The existence of a stated falsifier.** L427. Fix its wording (P1-07); **do not delete
  the move.**

**Most important protected hit: PROTECT-01, the ground bookend.** Every seat named it, it carries the
meta_title, and it is the only asset on the page that no repair in this brief touches and no future
event can decay.

## Revision brief

Ordered, bounded worklist. Word budget is the binding constraint (Conflicts 7) — **cut before you
add**, and if the ceiling still binds, drop P2 entirely rather than trimming a P0.

**Stage 1 — P0 repairs (all ten, mandatory).** Sequence to minimise re-editing:

1. **P0-02** (podcast name ×3 + `scripts/blog-source-audit.mjs` OUTLETS) and **P0-03** (restore "And I
   think") — mechanical, no judgement, do them first.
2. **P0-04** (de-quote the "point of strength" line and paraphrase the documented substance).
3. **P0-01** (delete the two-up two-count rule from L334 and FAQ L71; fix "Chiles enters" / "let
   Jordan Chiles into the competition"; restore or mark the "and physical" elision). Do **not** write
   a positive substitution mechanism yet — RQ-01.
4. **P0-07** then **P0-08** then **P1-14**, in that order — all three edit the same diagnosis
   paragraph; doing them together edits it once.
5. **P0-10** (attribute the three-year-old's reasoning to her retelling; convert origin to first
   appearance). Edit around PROTECT-03.
6. **P0-09** (past-tense the spotter arrangement to Antwerp 2023; fix L246, L382-adjacent, the TL;DR
   "every time," and add the December 2024 departure clause at L438).
7. **P0-06** (drop the "nothing to do with her body" absolute; carry "my body is aging"; un-date the
   L'Équipe line from the April 2026 paragraph) and **P0-05** (correct the health paragraph to the
   record; delete "Nothing further"; keep the refusal to speculate). Both land in H2 9 — do them
   together.

**Stage 2 — research-required decisions that can be safely resolved now.**

- **RQ-04 is already closed** — the Type 3 line is located, so **P1-14** proceeds in Stage 1.
- **RQ-06(a)** — one search window on anything after 13 August 2026 before finalising P0-05 and P1-12
  wording. Cheap, and it is the only item that can make a just-fixed sentence wrong again on day one.
- **RQ-06(b)** — verify the 2021 team-medal quote; if it holds, take the stronger repair in P1-08.
- **RQ-01, RQ-02, RQ-03, RQ-05 do not block publication.** Every one has a safe repair that ships
  without the answer. Do not hold the revision for them; log them for the next refresh, and **fix
  packet CLM-09 regardless** so the format error cannot re-enter.

**Stage 3 — accepted P1 items,** in descending value per word:

- Cheap and mechanical: **P1-05** (four clause-level corrections), **P1-15** (cut the Colts clause —
  this is the funded cut; fix the two durations), **P1-04** (restore two hedges), **P1-13** (two
  first-mention glosses), **P1-02** (Nassar appositive), **P1-16** (citation persistence, nearly free
  alongside P0-02).
- Pre-publication freezes, cheapest now and most expensive later: **P1-12** (de-age the H2 9 heading
  **and set the anchor before publishing**; date the 50-50 in `description` and the FAQ).
- Argument repairs: **P1-01** (spotter rules dispute), **P1-08** (loyalty inference chain), **P1-18**
  (steelman attribution), **P1-17** ("the entire point"), **P1-06** (Boorman's inference).
- Theory repairs, all in or near the Rabbit Hole: **P1-07** (operable falsifier + one sentence in the
  body), **P1-09** (name the residue), **P1-10** (2 and 8 discriminators), **P1-11** (anxiety is not a
  type).
- Last: **P1-19** (re-set the confidence label — it depends on everything above).
- **P1-03** (Chiles/CAS clause) sits between the cheap and the argument tiers; it is one subordinate
  clause and it is the item most likely to be squeezed by the word ceiling. If it is dropped, say so
  in the revision record.

**Stage 4 — the one P2 worth its words: P2-01** (close the proprioception loop). It is the stated
delight target's own nomination and the strongest available reason for an informed fan to share the
piece. **It ships only if RQ-05 resolves and only hedged as inference**, placed between L206 and L213,
never at the close. **P2-02** (Andrade) is the natural second if P1-15's cut leaves room. Everything
else in P2 waits.

**Stage 5 — protected-hit regression checks.** Before declaring the revision done, confirm each of the
nineteen PROTECT items is still present and unchanged except where a repair explicitly amends it.
Spot-check these five first, because they sit closest to a repair:

| Check                                                   | Adjacent repair | Pass condition                                                                                                                   |
| ------------------------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| PROTECT-01 (bookend)                                    | P0-06, P1-13    | "She never looked. She just always knew where it was" and the final two sentences are verbatim; no inference added at the close. |
| PROTECT-03 ("Verification was the only power on offer") | P0-10           | Paragraph intact, word for word.                                                                                                 |
| PROTECT-05 (the concession)                             | P1-18           | Concession present, unchanged, still ahead of the rebuttal; only "because they had one" is gone.                                 |
| PROTECT-07 (the spotter sentence)                       | P0-09, P1-01    | Sentence intact apart from "a vault she can land"; the tense fix is in the sentence above it.                                    |
| PROTECT-10 (Senate testimony + authority paradox)       | P1-17, P0-10    | Testimony quoted verbatim and first; the pairing is not weakened, only the exclusivity of "the entire point."                    |

Also re-run `scripts/blog-source-audit.mjs` **after** the OUTLETS fix, not before — until then it will
grade the phantom outlet as clean.
