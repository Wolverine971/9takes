---
artifact: perspective-verification
schema_version: 1
subject: Duke-Dennis
draft_sha256: b98e726c3df7db72dbd36a9aef2eb7220bef5b4aad2c4a1f2d8051df476b60bb
final_content_sha256: e89abe6f38042ee814ed33d47a51e0e1356946f437abe059e6bcfacf99747561
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-08-07T07:26:55Z
---

## Verification verdict

Pass. The frozen snapshot (`draft-reviewed.md`) hashes to exactly the supplied SHA (`b98e726c…`), and the synthesis frontmatter matches it. All seven P0 acceptance tests pass against the current live draft (`src/blog/people/drafts/Duke-Dennis.md`), with the quote-level repairs independently re-verified against the repo transcripts (`youtube-transcripts/duke-dennis-360-with-speedy-2024.md`, `duke-dennis-army-story-time.md`) rather than taken from the resolution log. All ten accepted P1 items are completed; none was rejected or deferred. All ten PROTECT items survive — a full body diff between the frozen and current drafts shows every change maps to a synthesis item, with no collateral edits. No repair introduced a factual assertion without a source trail in the packet, reviews, or transcripts. Open P0: 0. Protected-hit regressions: 0.

One verification note on the synthesis itself: `grep "ruined a generation"` does hit the 360 transcript three times, but all three are YouTube chapter labels ("12:44 — Kai ruined a generation"), not spoken words — the synthesis's claim that the string appears nowhere verbatim as speech holds.

## P0 resolution check

- **P0-01 — resolved.** No sentence anywhere in the file (body, comments, or frontmatter) asserts the shelved videos go unpublished; "It stays in the drawer" is gone. The empire section now reads "the rejects get demoted to his live channel instead: 'I know they want to see it, even though I don't want to drop it.'" — that quote is verbatim in the 360 transcript ("I know they want to see it even though I don't want to drop it"). Diagnosis clause now "finished videos kept off his main channel"; Rabbit Hole plank now "finished videos demoted to his live channel because they missed his bar for the flagship." Both Type-3 rebuttals cite only transcript-supported planks.
- **P0-02 — resolved.** The rizz section now renders the exchange as it happened: "Duke once called that achievement ruining a generation" (unquoted paraphrase), then "'I wouldn't say ruined it.' Speedy reminded him he had said it. 'He ruined it, he ruined it.'" Transcript confirms verbatim: "I've heard you once say that Kai ruined the generation… I wouldn't say ruined it but like — you did say it — he ruined it he ruined it," with speakers correctly attributed. Every other quoted string in the section ("If they white…", "They all said it. 100 percent…", the teach-them-rizz line, the standing reply, the corny law, the Rolling Stone line) was verified in the packet's transcript inventory. "Aura" / "aura farming" appear in quotes as words-as-words, not attributed speech — no unverbatim quotation remains.
- **P0-03 — resolved.** Ending now reads "It prints a fake birth year, 1987 for a man born in 1994, as a punchline." A fresh reader leaves with 1994 (packet: born 1994-02-26, verified) and can explain the 1987 joke; "at age 29" in the same section now reconciles (interview Feb 1, 2024, 26 days before his 30th birthday). The optional gloss at "the 1987 punchlines" was skipped to keep the shift-bell paragraph byte-identical — permitted by the synthesis ("optionally"), and the acceptance test is met by the ending fix. The enrichment-added real-name FAQ also teaches 1994 explicitly.
- **P0-04 — resolved.** Now "got visibly emotional, and put his shades on mid-stream. Even that moment got armor." Verb sits at/below source strength (S14 "nearly teared up," S15 "gets a little emotional"); the canonical shades detail is present (packet CLM-13 confirms it); the beat remains stated as fact with no quote.
- **P0-05 — resolved.** TL;DR bullet now past-anchored: "he called enlisting the worst decision of his life, his words from the bus. He still counts the years as wasted." The surviving present-tense clause is supported by the 2024 tape ("I feel like I wasted a lot of time," confirmed in transcript). Grep confirms no "still calls" survives anywhere in the file. The Army H2 stands per adjudication (Conflicts #2); the enrichment-added Army FAQ mirrors the H2's cleared search framing and carries the 2024 balance in its answer.
- **P0-06 — resolved.** Beat re-dated "In 2025"; quote swapped to "The whole thing with Duke... it just organically happened. That was my first time meeting him" — documented in the packet (transcript-inventory line 79) as her Duke-specific remark [S16][S17], unassignable to DDG. Testimony ledger entry 4 updated to the new quote and year, November dropped. The relationship-status trim discipline survives (the perishable clause is gone entirely with the old quote).
- **P0-07 — resolved.** Cold open now seats him: "sleep took him where he sat. He jolted awake catching himself, the roller turning in his face." Transcript confirms every physical detail: "I woke up pretty much like catching myself and like the plastic maker roller it was just like rolling like in my face while I'm sitting here." Unsupported "inches" dropped. "Then he stood, walked out of the building, and walked home." is byte-identical and now literally true.

## Accepted improvements check

- **P1-01 — completed.** Counterarguments now concede the four-year stay as the Type 6 case's best exhibit ("this analysis has already admitted the type doesn't explain it") and name Type 9 as core ("The quietest alternative is 9w8, a Nine with an Eight wing") with the merge-vs-exit discriminator ("A Nine accommodates them and calls it peace; Duke ends them in person, in one sentence"). The falsifier clause remains the section's last word; the stay is conceded, not explained. Note: the Germany retreat appears both in the stress-arrow list and in the 9w8 case — this is per the synthesis's own P1-01 repair spec (it listed "the Germany withdrawal" as part of the 9w8 case) and is a rival-reading acknowledgment, not the double-counting P1-02 barred.
- **P1-02 — completed.** "The seven interview-free years" removed from the stress-toward-Five list; the stress section reframes them as sp-8 baseline ("a sealed private life in a public industry is the baseline"); "no doors" scoped to "no doors a journalist could book," door metaphor intact.
- **P1-03 — completed.** Two sentences, inserted after the byte-identical shift-bell paragraph and before the corny-law close: aura named as "the dominant Duke meme of the past two years," pushback on "aura farming" stated without direct quotation (per the synthesis fallback — Sportskeeda wording unverified this pass). Sourced via the fan review's research log.
- **P1-04 — completed.** Intro now "Gen Z pinned a dictionary word on him" — consistent with the rizz section's "Kai gets the credit."
- **P1-05 — completed.** All four glosses in setup prose: "on NBA 2K, the basketball video game" before the first bare "2K" quote; Streamer University appositive at first mention ("his livestreamed program where established creators teach up-and-comers the trade"); "Atlanta-based streamer collective" (plus the TL;DR's "six-man streamer crew"); and the review/commitment separation ("His review of Berry's Plastic came down to one word that won't print here. The sentence after it was about YouTube: 'I'm doing this.'"), matching the transcript's structure ("oh it's so [expletive] berries plastic — I'm doing this").
- **P1-06 — completed.** "spent a week that July grading students" — dated, completed event (session July 15–20, 2026, per the future review's sources); "He has been teaching the course for free for years" kept; no "now" on the professorship.
- **P1-07 — completed.** Email claim anchored to the telling ("As of his 2024 telling, it still ran on Deo's email address; the password changed, the email stayed" — the password detail is on tape). Counts detached and stamped: "As of mid-2026 his YouTube channels hold roughly 3.5 million subscribers and 232 million views, and another 3.3 million… on Twitch." Corpus stat stamped "as of mid-2026." No subscriber figure is bound to the Deo-email channel. The plural "channels" phrasing follows the research file's "across channels" reading of S3 (packet CLM-07) — see Remaining work for the RQ-01 caveat.
- **P1-08 — completed.** TL;DR: "Duke's rule for AMP…: nobody joins, nobody leaves." Permanence is now his policy; body attribution unchanged per adjudication (Conflicts #3).
- **P1-09 — completed.** "The only legal mark on his first decade of fame, and he owned a piece of it: he was part of the draw that pulled the crowd, and the apology the dismissal required said as much." Universal time-bounded; agency restored within the facts CLM-09 verifies (charge, apology, restitution, dismissal all still stated); treatment remains one paragraph; "legal mark" not broadened.
- **P1-10 — completed.** "ranked Duke No. 5 on its 25 Most Influential Creators of 2024 list" — matches the intro and S4/S5 scope.
- **P2-01 — rode along as authorized** (revision brief item 10): "runs his stack with the seduction instinct dead last."

## Protected-hit regression check

None. All ten verified against the frozen snapshot via body diff plus literal-string grep:

- **PROTECT-01** — Cold open structure, 29-days frame, "The factory got twenty-nine days," and "Then he stood, walked out of the building, and walked home" intact; only the seated-posture fix applied.
- **PROTECT-02** — "His mother's sentence outlasted his own." verbatim; the stay remains unexplained (the counterargument addition concedes it).
- **PROTECT-03** — Shift-bell paragraph byte-identical (diff shows the aura sentences inserted after it, nothing inside it).
- **PROTECT-04** — Final line "a sound with no orders inside" and hedge "there's no sign he ever will" verbatim; the 1987 fix sits in the preceding sentence.
- **PROTECT-05** — Falsifier clause verbatim and still the counterarguments' last word.
- **PROTECT-06** — Units 1–4, final exam, "Sit with Unit 3 for a second…" bridge, and pull-quote byte-identical; all edits in the setup paragraph.
- **PROTECT-07** — "He profits from the legend daily, and he knows it." verbatim.
- **PROTECT-08** — "Three repetitions in one story time…" paragraph verbatim; the P0-01 swap touched only rebuttal planks.
- **PROTECT-09** — No invented quotes (Dee shirt and Veterans Day quote-free; aura paraphrased); Union Square one paragraph; Dee and Deo unconnected; India Love ellipsis discipline preserved through the quote swap; date discipline extended with the new as-of stamps.
- **PROTECT-10** — "nobody gets to run them" definition and the seven-years source card verbatim.

## Remaining work

None gate-blocking. Publish-time items carried forward from the resolution:

- **RQ-01** — Verify which channel holds the ~3.5M before ever re-attaching the figure to the Deo-email channel. Caveat noted this pass: the current aggregate phrasing ("his YouTube channels hold roughly 3.5 million subscribers") follows the research file's across-channels reading, but the synthesis's own tracker sweep (~3.5M on one channel, ~2M on "Duke Dennis Gaming") implies the cross-channel total could exceed 3.5M. The About-page check should settle the phrasing in either direction; not a P0, has a source trail, no action required pre-gate.
- **RQ-02** — Publish-time news + court-record sweep to protect "the only legal mark on his first decade of fame." Standing instruction intact: do not broaden "legal mark"; do not add the denied allegation cluster.
- **P2-04** — Archive the S14/S15/S18 clip URLs at publish (logged in the research file).
- **P1-03 optional upgrade** — If the Sportskeeda aura-farming wording is verified, a direct pushback quote may replace the paraphrase.
