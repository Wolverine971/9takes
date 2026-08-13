---
artifact: perspective-verification
schema_version: 1
subject: Carl-Jung
draft_sha256: 1fc5a8c291eca14d16aaae940c6e62bce7c2935bda3a4693c8fa69d8f4a67559
final_content_sha256: 42bdb218391d07da422ab0cccce3722fbb7b11f6ef93d114ba1e713efe3e3987
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-08-13T07:33:44Z
path: docs/content-analysis/perspective-reviews/Carl-Jung/2026-08-13_020001/verification-initial.md
---

## Verification verdict

**Pass.** The frozen snapshot (`draft-reviewed.md`) hashes to exactly the supplied SHA (`1fc5a8c2…`), matching `context.json`, `synthesis.md`, and `editor-resolution.md`. A full diff of the current live draft (`src/blog/people/drafts/Carl-Jung.md`) against the snapshot shows every reader-visible change maps to an authorized repair in the synthesis brief; no unauthorized edits exist. All 4 P0s are resolved by their acceptance tests, RQ-01 is resolved with a new source pin, all 16 accepted P1s are completed, both P2s executed, and all 9 protected hits survive with only the explicitly permitted touches. Every quote or factual detail added in the revision carries a source trail; the two new BBC quotes and the seven-boys fight were re-verified directly against the local transcripts this pass.

One non-blocking observation: the frontmatter gained `wikidata_qid`, `imdb_id`, and two `same_as` URLs that are not part of this review's brief — consistent with a later metadata-enrichment pipeline stage, outside the reader-visible hash, and not a regression.

## P0 resolution check

- **P0-01 — resolved.** Current text: "Freud was 50 and had found his heir." Acceptance test applied to every age in the section and the draft: Jung 31 in March 1907 (b. 1875-07-26) ✓; Freud 50 in March 1907 (b. 1856-05-06) ✓; "83-year-old man" in March 1959 ✓; "self-report at 83" ✓; "He was 84" at the Listener letter (three months after the October 1959 broadcast) ✓.
- **P0-02 — resolved.** FAQ 1 now reads "typed him 9w1 in The Wisdom of the Enneagram" — the source-confirmed placement — and the FUTURE-C4 fold-in landed: "As of 2026, community votes say 5w4." No named-author book title in the draft rests on an unverified source; a PDB vote flip dates the FAQ rather than falsifying it.
- **P0-03 — resolved.** Diagnosis pillar 3 reworked exactly per the brief: the function stack is explicitly disclaimed as Enneagram evidence ("a Jungian function stack is not an Enneagram center; plenty of Nines lead with thinking"), self-report is acknowledged ("self-report at 83"), the tiebreak is anchored on the felt goal (feeling named as weak point vs. knowing as solid ground), and the motive sentence is pinned to the verified "to find my own bearings" quote with the Nine-advocate reading conceded and the article's reading labeled ("This page reads it as…"). The unsupported "his own account of why he held opposites was cognitive" claim is gone from both the pillar and the Rabbit Hole counterargument (now "the accounting he left," resting on the two verified self-descriptions). The [28:54] rider is genuine — verified in the local transcript (`face-to-face-1959-cc.md` [28:51]–[28:58]: "now that gives you all the necessary da[t]a for… the diagnosis"). FAQ 1 now leads with withdrawal-to-know and demotes the BBC quote to self-description ("he described himself as…"). The three-way contrast (behavior / rival inference / self-account) remains legible. Acceptance test passes on all three clauses.
- **P0-04 — resolved.** "A boy who cannot predict the people in his own house starts building rooms they cannot enter" → "Jung's answer to a house he could not predict was rooms no one else could enter." Particularized to Jung; a scan of the childhood section and full draft finds no remaining general childhood-cause law. The image and the pivot into the manikin scene survive.

## Accepted improvements check

All 16 accepted P1s verified complete against the current text; RQ-01 and both P2s verified.

- **P1-01 — completed.** "Then he closed the door completely:" → "'is merely a sort of orientation,' an instrument for the working psychologist and nothing grander. Then the verdict:". Checked against the Houston transcript ([27:31]–[27:57]): the instrumentarium qualification now governs the final quote in a subordinate clause, exactly the repair shape the synthesis authorized; no adjacent transcript clause contradicts the framing. Quotes and final line verbatim.
- **P1-02 — completed.** "so his own never had to be discussed" → "so that his own was disclosed only on his terms." Concession sentence verbatim; refusal-to-excuse intact.
- **P1-03 — completed.** "The documented case in his private life is Toni Wolff." No completeness claim remains in the section.
- **P1-04 — completed.** FAQ 6: "across some 16 years, working from private notebooks he began in late 1913" — the dating now attaches to the notebooks (Nov 1913 sourced) and the folio misdate is gone.
- **P1-05 — completed** (preferred option). The fight is staged in the childhood section before the fainting episode. Verified against the local BBC transcript [13:26]–[14:03]: "about seven boys," swung one "with his legs," "beat down four," "they were afraid and I was never attacked again," and the didn't-trust-myself beat at [13:19]–[13:24]. The Rabbit Hole "once" callback now points at a staged scene. (Minor note: "afterward he avoided fights because he did not trust himself" renders Jung's stated general disposition as post-fight sequence — the motive clause is verbatim from the same transcript passage; within faithful-compression range.)
- **P1-06 — completed.** "He coined the vocabulary" → "He made the vocabulary common currency." Five-word list and cold-open rhythm untouched.
- **P1-07 — completed.** "is the textbook case" → "carries that signature," with the Seven-quality located in the voluntary response. Claims resemblance, not proof.
- **P1-08 — completed.** Social-last reframed as how he held roles ("accepted institutional roles, a journal, a presidency, and walked out of each…"); now consistent with the resignations named elsewhere.
- **P1-09 — completed.** Type 4 seated in the counterarguments (feeling as the named deficit, epistemic vs. expressive crisis response, the locked cupboard); a reader can state why 4 is wing, not core.
- **P1-10 — completed.** "had passed 2.3 billion views on TikTok by 2023, per trade coverage" — year plus source signal; permanently true.
- **P1-11 — completed.** Key-stat label: "landed on Type 5 as of mid-2026… Read it as the house prior, never as proof about Jung." (The "biggest over-representation" phrasing predates this revision — present in the frozen snapshot — so it is jury-reviewed, not a new assertion.) Engineering follow-up logged in editor-resolution.
- **P1-12 — completed.** Burghölzli glossed at first use ("the Zurich psychiatric hospital where he made his name"); the "no Burghölzli stopwatch" callback now lands.
- **P1-13 — completed** (arc-close option). "He told the woman, once, what the test had found; within two weeks she was discharged, and by his account never institutionalized again" — attributed in-text ("by his account"), source trail documented (MDR pp. 115–117 via packet S22), and consistent with the MDR "Psychiatric Activities" account. Murderess quote kept (FAN-H1).
- **P1-14 — completed.** Wing appositive added at first body use.
- **P1-15 — completed.** "their best fact is concrete: six years of deference to Freud before the break" now in the visible diagnosis text; skip-line boilerplate kept per Conflicts item 7.
- **P1-16 — completed.** "the nearest ancestor" → "the closest cousin"; internal contradiction with the Ichazo/Naranjo sentence resolved.
- **RQ-01 — resolved KEEP.** "sometimes at three" retained with a documented verbatim MDR pin ("sometimes I worked from three in the morning till seven"), which matches the Winston & Winston School Years text.
- **P2-01 — completed.** The Man and His Symbols sentence is in the legacy section, attributed "by Freeman's account," origin credited to the mail and the dream, no whole-book claim.
- **P2-02 — completed.** `docs/content-analysis/refresh-calendar.md` exists with the dated 2027-08 Carl-Jung entry (7 items, due before 2027-08-13).

No accepted P1 was silently dropped; no completed item introduced a new factual assertion without a source trail. New prose contains no em-dashes (the only em-dash in the reader-visible body is the pre-existing epigraph attribution).

## Protected-hit regression check

None. All nine verified against the frozen snapshot via full diff — protected passages are absent from the diff (verbatim) except the explicitly permitted touches:

- **PROTECT-01:** Houston quotes and "Sixty-nine years later, we filed him anyway." verbatim; closing pacing intact. Only the permitted P1-01 framing clause changed.
- **PROTECT-02:** Falsifier sentence verbatim, still closing the counterargument block.
- **PROTECT-03:** No. 1/No. 2 section intact — "nothing to do with a 'split'" qualifier and "He was 84, and still could not leave a sentence unguarded." verbatim; only the two permitted additive touches (Burghölzli gloss, murderess arc-close) landed inside the panel; both panel sides' quotes and frame survive.
- **PROTECT-04:** "Nothing in the pages above excuses that…" verbatim; only the preceding clause changed per P1-02.
- **PROTECT-05:** Fortress-object chain paragraph untouched (not in diff).
- **PROTECT-06:** Red Book empathy turn untouched as a unit (not in diff).
- **PROTECT-07:** Spielrein ceiling, "as reported by the Jung Page," "by a 2009 New York Times account" intact. Every added quote/detail is pinned (BBC [13:26], BBC [28:54], Houston [27:37], MDR pp. 115–117, MDR School Years, Freeman's introduction attributed in-text).
- **PROTECT-08:** March-1959 / October-broadcast / Listener triangulation and the Red Book chronology untouched; both new current-claims carry their own date anchors.
- **PROTECT-09:** Rupture-document framing, "what you know is yours; what you merely believe can be taken," and the cold open verbatim; the permitted "coined" verb swap is the only touch.
- **Carried regression check (inner-thought social card):** `grep -rn "inner-thought" src/lib/socialCards src/lib/components` returns no hits — no share surface extracts the line as a quotation.

## Remaining work

None blocking. Recorded for downstream stages:

- **Engineering follow-up (P1-11):** bind the key-stat block to `corpus-stats.json` at render on the people path (logged in editor-resolution; the as-of copy covers this page meanwhile).
- **Deferred by synthesis, correctly untouched:** shadow-section endnote boundary sentence (entity-gap/DJ strategy call), "every personality test" header qualification (CRITIC-C7b), 83-vs-84 optics clause (FAN-I2), synchronicity clause (FAN-I3), Philemon/Jaffé volume (on the refresh calendar).
- **Pre-existing second-pass open item:** Emma's 1911 letters remain paraphrased, not quoted.
- **Optional restoration (P0-02):** if production ever page-checks _Personality Types_ and finds Jung in the Nine examples list, the FAQ may name it again.
- **Refresh calendar:** the 2027-08 entry exists and is dated; no further action this cycle.
