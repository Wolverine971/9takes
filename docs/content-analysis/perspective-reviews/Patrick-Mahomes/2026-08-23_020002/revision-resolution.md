---
artifact: perspective-revision-resolution
schema_version: 1
subject: Patrick-Mahomes
draft_sha256: 690cb7c2fe451d15af251942620493decee7b72ea803ded9130a53a98ee2a9a1
resolution_status: complete
resolved_at: 2026-08-23T08:11:13Z
path: docs/content-analysis/perspective-reviews/Patrick-Mahomes/2026-08-23_020002/revision-resolution.md
---

## Resolution log

Inputs: `verification-initial.md` (status **pass**, open_p0 0, protected_hit_regressions 0) and the grader sidecar `docs/content-analysis/grades/Patrick-Mahomes.review.md` (B, 8.3). The verifier named no unresolved `P0-*`, no incomplete accepted `P1-*`, and no `PROTECT-*` regression, so this pass had no perspective items to repair; every edit below was driven by the grader's NEEDS WORK / TO REACH list and was made under the PROTECT-01..17 regression constraints. Live draft after this pass: `5cfdbe6119a44560c768a0b1c4d751c967a424ba4a4c79da4fdef2f2c2498563`.

- **P0-01 through P0-05** — status `fixed` (by the editor pass; re-checked here). Acceptance greps rerun on the reader-visible body after this pass: `gonna kill me` 0, `conceded` 0, `co-produc|controlled the room` 0, `in its counterphobic form` 0, `Six under stress|performing certainty|worked example` 0.
- **P1-06 (durability datelines)** — the verifier's one "soft spot" ("In camp that August..." binding its year anaphorically) is now explicit: "At the same August 8, 2026 availability he was already a problem for his own caution." Status `fixed`.
- **P1-10 (small corrections)** — "The personality directories cannot agree on him" paragraph was removed entirely (grader TO REACH #4: the Seven/Three reframe was stated twice). Replacement: "The loose half is the one you can see from the couch. The other half is the one checking the phone." `directories` and `crowd-vote` both absent. Status `fixed`.
- **CLM-42 inference** (packet: "for the rest of the evening" is inference) — "to Reid's office for the rest of the night" trimmed to "to Reid's office." Status `fixed`.
- **Grader Evidence item (outlet-less back half)** — outlet or show tags added reader-visibly to: "become a pro" (the Kelces, 2022); Brady "right way" (same episode); "A hundred percent not" (told the Kelces); "side of my calf" (_New Heights_); "hot and emotional" / "Can't be that way" (ESPN); Pat Sr. "You're different" (Netflix's _Quarterback_); "hurt probably more than the wins feel good" (KCTV5); "wasn't playing my best football" / "ran a little bit too much" (to reporters July 24, 2026, per Yahoo Sports); "get a brace" (Sports Illustrated, Jan 2026); "goals to get to" (same January availability, per Chiefs Wire); Cooper test (to reporters Aug 8, 2026); "hold myself back" (same Aug 8, 2026 availability); UT "play safety" (WHOOP Podcast); Kingsbury "no real offers" (ESPN, 2022); "all my buddies" (same podcast); "Silky P" (told the Kelces). Sources: research file + `youtube-transcripts/mahomes/` + packet S11, S17, S26, S35, S45, S46, S47a/b.
- **Grader Writing item (reader-command imperatives)** — "Look at the order of operations." cut (not inside PROTECT-08's protected span). The other three ("Notice the word." PROTECT-07, "Put that next to..." PROTECT-05, "Read that sentence twice." PROTECT-06) are jury-protected verbatim and were kept; see Unresolved decisions.
- **Grader Writing item (aphoristic closers)** — Coach section now ends on McDuffie's quote ("...do a certain thing, like, every day."); "set a clock by" cut. The other five closers the grader listed are PROTECT-05/08/09/11/12 verbatim and were kept.
- **Grader Enneagram item (inner-thought vocabulary)** — middle of the inner-thought rewritten in his own phrase: "and the moment is never bigger than what it is" (from "how can you not let the moment be bigger than what it is," _New Heights_ 2022). First and last sentences verbatim (PROTECT-15).

## Protected hits checked

All 17 grepped verbatim in the reader-visible body after the edits (32 strings, 0 missing):

- PROTECT-01 all three bookend sentences; PROTECT-02 all four Kelce-trap sentences; PROTECT-03 timeline block incl. "I'm baseball-player superstitious."; PROTECT-04 "The critics are describing something real." still follows Aikman, Roquan Smith and "I probably shouldn't have done that."; PROTECT-05 from "Put that next to the other things he does with his body" through "His is just televised." with "Most Sixes" and "every snap"; PROTECT-06 both sentences; PROTECT-07 "Notice the word. Validated." paired with "A hundred percent not. I would not ask him." (attribution lead-in added before the quote, quote untouched); PROTECT-08 all three sentences, only the unprotected lead-in "Look at the order of operations." removed; PROTECT-09 both sentences; PROTECT-10 number, quote and closing pair; PROTECT-11; PROTECT-12 three-sentence block; PROTECT-13 both gloss sentences; PROTECT-14; PROTECT-15 first and last sentences with the P1-09 nouns; PROTECT-16; PROTECT-17 (no 2025 final record, no dollar figures, children by year only; new datelines are absolute).

Lint: 0 fail, 1 warn (4,479 words, ceiling 4,500; post-Week-1 slot still open). Source audit: 14 load-bearing quotes, 14 inline / 0 vague / 0 untagged.

## Unresolved decisions

- None blocking. Grader asked to cut "Read that sentence twice" and one of "Notice the word" / "Put that next to"; all three are PROTECT-06/07/05 verbatim, so the revision pass kept them and cut the one unprotected imperative instead. If the grader's house-fingerprint concern outweighs the jury's protection, that is a human call (`needs_human` only if DJ wants the jury overridden).
- RQ-01 (E5 apology wording) and RQ-02 (ownership-stake motive) remain deferred as the verifier recorded.
