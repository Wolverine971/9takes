---
artifact: perspective-verification
schema_version: 1
subject: Carl-Jung
draft_sha256: 1fc5a8c291eca14d16aaae940c6e62bce7c2935bda3a4693c8fa69d8f4a67559
final_content_sha256: 52310bf8a5ad204ba1463e94c7ff96c617b40fdac05f059f1945d1cc0cca8bcc
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-08-13T08:04:05Z
path: docs/content-analysis/perspective-reviews/Carl-Jung/2026-08-13_020001/verification-final.md
---

## Verification verdict

**Pass.** This is the rerun gate after the grader-driven revision pass (`revision-resolution.md`, 07:59Z) modified the draft that `verification-initial.md` had already passed. The frozen snapshot (`draft-reviewed.md`) hashes to exactly the supplied SHA (`1fc5a8c2…`), matching `context.json` and `synthesis.md`; the snapshot's reader-visible hash matches `context.json`'s recorded value (`30d1c60b…`). A full diff of the current live draft (`src/blog/people/drafts/Carl-Jung.md`) against the snapshot shows every reader-visible change maps either to an authorized synthesis repair (editor pass) or to a logged, sourced grader-driven edit (revision pass); no unauthorized edits exist. All 4 P0 acceptance tests re-pass on the current text, all 16 accepted P1s remain complete, RQ-01 and both P2s hold, and all 9 protected hits survive with only permitted touches.

The revision pass's highest-risk move — retagging "to find my own bearings" from Houston 1957 to the 1959 BBC interview, against both the grader sidecar and the synthesis's own `[Houston 27:37]` pin — was re-verified this pass directly against the local transcripts and is **correct**: `youtube-transcripts/carl-jung/face-to-face-1959-cc.md` [27:29]–[27:48] has Freeman asking what prompted the types book and Jung answering "…to do justice to the culture of Freud, also to that of Adler, and to find my own bearings," directly before the "painful question" exchange at [28:05]. Nothing matching the quote exists in `houston-1957-evans.md`. The synthesis pin was file-confusion; the draft's in-text tags ("in the same 1959 BBC interview," "Asked by Freeman in 1959") are accurate, and a Houston tag would have been false.

## P0 resolution check

- **P0-01 — resolved (unchanged since initial verification).** "Freud was 50 and had found his heir." All stated ages pass arithmetic: Jung 31 in March 1907 (b. 1875-07-26), Freud 50 (b. 1856-05-06), self-report at 83 for the March 1959 filming, "He was 84" at the Listener letter. The revision pass touched none of these; the TL;DR's "live television" → "on camera" correction in the same cluster is itself a factual improvement (filmed March 1959, broadcast October — never live).
- **P0-02 — resolved (unchanged).** FAQ 1: "Don Riso and Russ Hudson typed him 9w1 in The Wisdom of the Enneagram" with "As of 2026, community votes say 5w4." No named-author book title in the draft rests on an unverified source; a PDB vote flip dates the FAQ rather than falsifying it.
- **P0-03 — resolved, and strengthened by the revision.** Diagnosis pillar 3 in current text: function stack disclaimed as Enneagram evidence ("a Jungian function stack is not an Enneagram center; plenty of Nines lead with thinking"), self-report acknowledged ("self-report at 83"), tiebreak anchored on the felt goal (feeling named as weak point vs. knowing as solid ground), motive pinned to the verified "to find my own bearings" quote with the Nine-advocate reading conceded and the page's reading labeled ("This page reads it as…"), [28:54] rider present (verified in transcript: "now that gives you all the necessary da[t]a for… the diagnosis"). The revision's inline source tags now attribute the quote to the correct interview (see verdict above) — the acceptance clause "every sentence of the form 'his own account was X' is adjacent to a verified quote" passes with the pin now pointing at the right file. Rabbit Hole counterargument still reads "the accounting he left" over the two verified self-descriptions. FAQ 1 still leads with withdrawal-to-know and keeps the BBC quote as self-description. Three-way contrast legible. All three acceptance clauses pass.
- **P0-04 — resolved (unchanged).** "Jung's answer to a house he could not predict was rooms no one else could enter." No general childhood-cause law anywhere in the current draft; the new Nazi-era paragraph is deliberately type-free and asserts no mechanism, so it introduces no etiology exposure.

## Accepted improvements check

All 16 accepted P1s, RQ-01, and both P2s verified still complete in the current text. Revision-pass interactions checked item by item:

- **Unaffected by the revision (verified present verbatim or as edited by the editor pass):** P1-01 (framing clause "an instrument for the working psychologist and nothing grander. Then the verdict:" — quotes and final line verbatim), P1-02 ("disclosed only on his terms"), P1-04 (FAQ 6 notebooks-late-1913 dating), P1-05 (seven-boys fight staged in childhood; re-verified against BBC [13:26]–[13:40] this pass), P1-06 ("made the vocabulary common currency"), P1-07 ("carries that signature"), P1-08 (social-last reframed), P1-09 (Type 4 seated, falsifier verbatim after it), P1-12 (Burghölzli gloss), P1-13 (murderess arc closed, quote kept), P1-15 (six-years-of-deference in visible text), RQ-01 ("sometimes at three" retained with MDR pin), P2-02 (refresh-calendar entry exists).
- **P1-03 — still complete, improved.** "The documented case in his private life is Toni Wolff" now does double duty: it scopes the private inventory AND correctly cordons the new public-record paragraph. The shadow section makes no completeness claim.
- **P1-10 — still complete.** "had passed 2.3 billion views on TikTok by 2023, per trade coverage" survives the legacy split; the trimmed "driven by a viral workbook" clause was decoration, not the year or source signal the acceptance test requires.
- **P1-11 — still complete.** Key-stat label with as-of-mid-2026 and "Read it as the house prior, never as proof about Jung" intact.
- **P1-14 — acceptance test passes; one sub-detail superseded with reason.** The wing appositive ("a wing is the neighboring type that colors the core") is in place, so a Rabbit Hole-skipping reader can state what the 4 adds. However, the revision pass removed both Rabbit Hole boilerplate cross-links (wings-guide, instinctual-subtypes) for word budget and the internal-links lint warn — so the synthesis's "existing wings-guide link stays as the deep dive" note no longer holds; the link is gone from the page entirely. The removal is documented, sanctioned by the second-pass ruling ("Trim a Rabbit Hole link if the editor pass disagrees"), and does not touch the acceptance test. Treated as a defensible tradeoff, not a failure. Flagged for the refresh calendar if internal-link coverage to the wings guide matters for SEO.
- **P1-16 — still complete.** "the closest cousin" survives the legacy-block split into three paragraphs.
- **P2-01 — still complete.** The Man and His Symbols sentence now leads its own paragraph ("By Freeman's account…"), origin still credited to the mail and the dream, no whole-book claim.

**Revision-pass additions checked for source trails (method step 6):**

- **Nazi-era paragraph** ("The harder page of the record is public…"): every assertion is named-source in-text — 1933 presidency of the General Medical Society for Psychotherapy under coordination; the 1934 essay "The State of Psychotherapy Today" in the society's journal; Gustav Bally's Neue Zürcher Zeitung attack that February (Feb 1934, historically accurate); the statute rewrite preserving individual membership for excluded German-Jewish doctors; the 1939 resignation; Baeck's 1946 "I slipped up" explicitly attributed "By Gershom Scholem's account." Both columns, no verdict, type-free — the shape the grader specified and the entity-gap packet's actual rule ("careful named sourcing or omit; never a drive-by mention") permits. All facts check against the standard historical record. No em-dashes.
- **Emma Jung quote** ("with a father's feeling: 'He will grow, but I must dwindle.'"): attributed in-text to her autumn-1911 letter to Freud; ledger entry pins Nov 14, 1911, The Freud/Jung Letters. Matches the known letter. Converts a paraphrase to a pinned quote — closes the previously open second-pass item.
- **BBC retag**: verified against the local transcript (see verdict).
- **Micro-trims** ("Doctors were baffled," "He noticed the theft in his own lifetime," "Read that origin story plainly," Shamdasani "has stated"→"states," "And around"→"Around," "being used"→"used," "this whole profile"→"this profile"): all remove or tighten; none alters a fact or a protected passage. All are logged in the revision resolution's word-budget accounting.

No accepted item was silently dropped; no revision edit introduced a factual assertion without a source trail.

## Protected-hit regression check

None. All nine re-verified against the frozen snapshot via full diff plus presence greps; every protected passage is either absent from the diff (verbatim) or touched only in its explicitly permitted way:

- **PROTECT-01 (the ending):** Houston quotes, "Sixty-nine years later, we filed him anyway.", and the closing paragraph verbatim; the "Which brings the question back around…" lead-in unchanged. The closing _sequence_ is intact — the revision's legacy-section split moved upstream paragraphs (#shadowwork, Freeman sequel) ahead of it but did not alter the protected unit or its pacing. Sole in-unit change remains P1-01's permitted framing clause. The revision's rejection of inline-tagging the final quote (C.G. Jung Speaking named two sentences earlier) correctly honors the verbatim lock.
- **PROTECT-02 (falsifier):** verbatim, still closes the counterargument block.
- **PROTECT-03 (Jung No. 1/No. 2):** section untouched by the revision; "nothing to do with a 'split'" and "He was 84, and still could not leave a sentence unguarded." verbatim; only the editor pass's two permitted additive touches (Burghölzli gloss, murderess arc-close) exist inside the panel.
- **PROTECT-04 (shadow concession):** "Nothing in the pages above excuses that…" verbatim. Placement check on the new paragraph: the Nazi-era ledger sits _after_ the concession and the mechanism paragraph, so "the pages above" and "the two women" remain scoped to the private ledger exactly as the revision resolution claims.
- **PROTECT-05 (fortress-object chain):** not in diff; untouched.
- **PROTECT-06 (Red Book empathy turn):** untouched as a unit, including "alone, in writing, behind a lock" and the "Watch the behavior" pivot the revision explicitly declined to cut. The metronome fix buried the _unprotected_ shadow closer instead — correct call.
- **PROTECT-07 (quote hygiene):** Spielrein ceiling ("exactly as far as the evidence goes"), "as reported by the Jung Page," "by a 2009 New York Times account" all intact. Every quote added across both passes is pinned: BBC [13:26], BBC [27:37]–[27:48], BBC [28:54], MDR pp. 115–117, MDR School Years, Freeman's introduction, Emma's Nov 14 1911 letter, Bally/NZZ Feb 1934, Scholem's Baeck account.
- **PROTECT-08 (absolute-date discipline):** the March-1959 / October-broadcast / Listener triangulation and Red Book chronology untouched; every new date in the Nazi-era paragraph carries an event anchor (1933 presidency, 1934 essay/attack, 1939 resignation, 1946 confrontation).
- **PROTECT-09 (signature syntheses):** "a fact about structure instead of a fact about betrayal," "what you know is yours; what you merely believe can be taken," and the cold open verbatim; the permitted "coined" verb swap stands as the only touch. The removed adjacent sentence ("Read that origin story plainly.") was not part of the named protected passage, and the paragraph's logic survives — verified in the current text.
- **Carried check (inner-thought social card):** `grep -rn "inner-thought" src/lib/socialCards src/lib/components` → no hits; no share surface extracts the line as a quotation.
- **Em-dash discipline:** the only em-dash in the reader-visible body remains the pre-existing epigraph attribution; no new prose from either pass introduced one.

## Remaining work

None blocking. Carried forward:

- **DJ veto standing open (needs_human, non-blocking):** the Nazi-era paragraph was added under the grader's Originality cap and the packet's careful-sourcing allowance, but synthesis Conflicts item 6 had deferred any scope change to the entity-gap process and DJ. If DJ prefers the original omission, delete the single paragraph beginning "The harder page of the record is public." and accept the Originality cap (~8.6 B+). The paragraph as written passes every gate this verifier owns; the veto is an editorial-strategy option, not a defect.
- **Grader recalibration note:** the grade sidecar's Houston-1957 attribution for "to find my own bearings" is wrong (BBC 1959, confirmed against the local transcript); a re-grade must not re-flag the BBC tag.
- **Engineering follow-up (P1-11):** bind the key-stat block to `corpus-stats.json` at render on the people path (logged in editor-resolution).
- **Internal-link note (from P1-14):** the wings-guide and instinctual-subtypes cross-links were removed for word budget; if internal-link coverage to those guides matters, restore one at the 2027-08 refresh (which must cut before it adds — body is at 4492/4500).
- **Refresh calendar:** the dated 2027-08 Carl-Jung entry exists (7 items); no further action this cycle.
- **Optional restoration (P0-02):** if production ever page-checks _Personality Types_ and finds Jung in the Nine examples list, the FAQ may name it again.
