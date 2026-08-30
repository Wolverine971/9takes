---
artifact: perspective-verification
schema_version: 1
subject: Duke-Dennis
draft_sha256: b98e726c3df7db72dbd36a9aef2eb7220bef5b4aad2c4a1f2d8051df476b60bb
final_content_sha256: 62070b713554b15d527b7c5dfebeb37178a18ac5be75dbe1fd612d9545552b78
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-08-07T07:42:23Z
path: docs/content-analysis/perspective-reviews/Duke-Dennis/2026-08-07_020002/verification-final.md
---

## Verification verdict

Pass. This is the post-revision verification: the initial pass (`verification-initial.md`, 07:26:55Z) already returned pass on all seven P0s and ten P1s, and the subsequent revision pass (`revision-resolution.md`, 07:37:45Z) performed no perspective repairs — it applied four grade-driven edits from the grader sidecar. The frozen snapshot (`draft-reviewed.md`) hashes to exactly the supplied SHA (`b98e726c…`), and the synthesis frontmatter matches it. A full diff between the frozen snapshot and the current live draft (`src/blog/people/drafts/Duke-Dennis.md`) shows every body change maps either to a synthesis item or to one of the four logged grade-driven edits — no collateral edits. All seven P0 acceptance tests were re-applied to the current text, with the quote-level repairs independently re-verified against the repo transcript (`youtube-transcripts/duke-dennis-360-with-speedy-2024.md`). All ten PROTECT items survive the revision pass — the two prose cuts it made sit outside every protected span. The one new factual assertion the revision introduced (the Associated Press wire attribution for the Union Square dismissal) has a complete source trail: the AP status URL added to citations decodes (via tweet snowflake ID) to 2024-05-08T22:00Z, the packet's S8 (Tubefilter) is dated 2024-05-08, and the critic's research log documents the AOL/AP coverage. Open P0: 0. Protected-hit regressions: 0.

## P0 resolution check

All seven resolved; re-tested against the current draft, not carried forward from the prior report.

- **P0-01 — resolved.** No sentence in the file asserts the shelved videos go unpublished. Empire section: "the rejects get demoted to his live channel instead: 'I know they want to see it, even though I don't want to drop it.'" — quote re-verified verbatim in the 360 transcript, which also confirms the live-channel mechanics ("put them on my like live Channel just throw them over there"). Diagnosis clause reads "finished videos kept off his main channel"; Rabbit Hole plank reads "finished videos demoted to his live channel because they missed his bar for the flagship." Both Type-3 rebuttals cite only transcript-supported planks.
- **P0-02 — resolved.** The rizz section renders the exchange as it happened: "Duke once called that achievement ruining a generation" (unquoted paraphrase), then "'I wouldn't say ruined it.' Speedy reminded him he had said it. 'He ruined it, he ruined it.'" All three quoted strings re-verified verbatim in the transcript with speakers correctly attributed ("I've heard you once say that Kai ruined the generation… I wouldn't say ruined it but like — you did say it — he ruined it he ruined it"). The string "ruined a generation" appears in the transcript file only as chapter labels, not speech, consistent with the paraphrase treatment. "Aura"/"aura farming" appear as words-as-words, not attributed speech.
- **P0-03 — resolved.** Ending: "It prints a fake birth year, 1987 for a man born in 1994, as a punchline." A fresh reader leaves with 1994 and can explain the 1987 joke; "at age 29" in the same section reconciles with the Feb 2024 interview date. The real-name FAQ teaches 1994 explicitly ("He was born in 1994; the 1987 birth year the internet prints is a running joke, not a fact"). The revision pass changed the paragraph's opening sentence from an imperative to declarative ("The internet has spent the years since doing the opposite") without touching the 1987 repair.
- **P0-04 — resolved.** "got visibly emotional, and put his shades on mid-stream. Even that moment got armor." Verb at/below source strength (S14/S15); the canonical shades detail present; the beat stated as fact with no quote.
- **P0-05 — resolved.** TL;DR bullet past-anchored: "he called enlisting the worst decision of his life, his words from the bus. He still counts the years as wasted." The surviving present-tense clause is supported by the 2024 tape ("I feel like I wasted a lot of time" — re-verified in the transcript). Grep confirms no "still calls"/"still says" anywhere in the file. The Army H2 stands per adjudication (Conflicts #2); the Army FAQ mirrors the cleared search framing and carries the 2024 balance ("yet he credits those years for the punctuality and discipline his career runs on").
- **P0-06 — resolved.** Beat dated "In 2025"; quote is her Duke-specific line: "The whole thing with Duke... it just organically happened. That was my first time meeting him" — documented in the packet's transcript inventory (line 79) as unassignable to DDG. Testimony ledger entry 4 matches the new quote and year; November dropped; the relationship-status trim discipline survives.
- **P0-07 — resolved.** Cold open seats him: "sleep took him where he sat. He jolted awake catching himself, the roller turning in his face." Every physical detail re-verified on tape ("catching myself," "plastic maker roller," "while I'm sitting here"). Unsupported "inches" gone. "Then he stood, walked out of the building, and walked home." is byte-identical and literally true.

## Accepted improvements check

All ten P1 items remain completed after the revision pass; none was reopened or damaged.

- **P1-01 — completed.** Counterarguments concede the four-year stay as the Type 6 case's best exhibit, name 9w8 as core with the merge-vs-exit discriminator, and the falsifier clause remains the section's last word. The Germany retreat's dual appearance (stress-arrow list + 9w8 case) is per the synthesis's own P1-01 repair spec — a rival-reading acknowledgment, not P1-02's barred double-counting.
- **P1-02 — completed.** "The seven interview-free years" absent from the stress-arrow list; stress section reframes them as sp-8 baseline; "no doors" scoped to "no doors a journalist could book." The revision pass moved both arrow-mechanics sentences into the Rabbit Hole arrows section (the sanctioned home for type theory) and left the stress section behavioral — the acceptance test still passes: the Rabbit Hole arrows cite only Germany and the withhold reflex, and the interview-free years remain in sole custody of the baseline/anti-3 case. Distribution ledger updated to match (2 → 1).
- **P1-03 — completed.** Aura named as "the dominant Duke meme of the past two years," with the aura-farming pushback stated without direct quotation (Sportskeeda wording unverified — synthesis fallback honored). Sourced via the fan review's research log (FAN-R6). Inserted after the byte-identical shift-bell paragraph, before the corny-law close.
- **P1-04 — completed.** Intro: "Gen Z pinned a dictionary word on him"; rizz section: "Kai gets the credit for making 'rizz' a global word." Consistent.
- **P1-05 — completed.** All four glosses in setup prose: "on NBA 2K, the basketball video game"; the Streamer University appositive ("his livestreamed program where established creators teach up-and-comers the trade"); "Atlanta-based streamer collective" plus the TL;DR's "six-man streamer crew"; and the review/commitment separation ("His review of Berry's Plastic came down to one word that won't print here. The sentence after it was about YouTube: 'I'm doing this.'").
- **P1-06 — completed.** "spent a week that July grading students"; "He has been teaching the course for free for years" kept; no "now" on the professorship.
- **P1-07 — completed.** Email claim anchored to the telling ("As of his 2024 telling, it still ran on Deo's email address; the password changed, the email stayed"); counts detached and stamped ("As of mid-2026 his YouTube channels hold roughly 3.5 million subscribers and 232 million views, and another 3.3 million… on Twitch"); corpus stat stamped "as of mid-2026." No subscriber figure bound to the Deo-email channel. RQ-01 caveat carried forward.
- **P1-08 — completed.** TL;DR: "Duke's rule for AMP…: nobody joins, nobody leaves."
- **P1-09 — completed, and strengthened by the revision pass.** "The only legal mark on his first decade of fame, and he owned a piece of it: he was part of the draw that pulled the crowd, and the apology the dismissal required said as much." Universal time-bounded; agency restored; treatment remains one paragraph. The revision added inline written sourcing — "a dismissal the Associated Press carried on the wire on May 8" — whose trail is complete (AP status URL in citations, snowflake-decoded to 2024-05-08; packet S8 Tubefilter 2024-05-08; critic research log). "Legal mark" was not broadened; the denied allegation cluster was not added.
- **P1-10 — completed.** AMP section: "ranked Duke No. 5 on its 25 Most Influential Creators of 2024 list." The revision's intro trim removed the Rolling Stone name from the intro but kept the correctly-scoped ranking phrase ("the No. 5 most influential creator of 2024") — both mentions still match S4/S5's scope, so the acceptance test holds.
- **P2-01 — rode along as authorized:** "runs his stack with the seduction instinct dead last."

## Protected-hit regression check

None. Verified by full body diff against the frozen snapshot plus literal-string grep; the revision pass's two prose cuts both sit outside protected spans.

- **PROTECT-01** — Cold open structure, 29-days frame, "The factory got twenty-nine days," and "Then he stood, walked out of the building, and walked home" intact; only the seated-posture fix applied.
- **PROTECT-02** — "His mother's sentence outlasted his own." verbatim; the stay remains unexplained.
- **PROTECT-03** — Shift-bell paragraph byte-identical (absent from the diff; the aura sentences sit after it, nothing inside it).
- **PROTECT-04** — Final line "a sound with no orders inside" and hedge "there's no sign he ever will" verbatim. The revision's imperative-to-declarative change ("The internet has spent the years since doing the opposite") is in the preceding paragraph, outside the protected close.
- **PROTECT-05** — Falsifier clause verbatim and still the counterarguments' last word.
- **PROTECT-06** — Units 1–4, final exam, "Sit with Unit 3 for a second…" bridge, and pull-quote byte-identical; the grader-endorsed keep is logged in the revision resolution.
- **PROTECT-07** — "He profits from the legend daily, and he knows it." verbatim.
- **PROTECT-08** — "Three repetitions in one story time…" paragraph verbatim.
- **PROTECT-09** — No invented quotes (Veterans Day and Dee shirt remain quote-free; aura paraphrased); Union Square remains one paragraph after the AP clause insertion; Dee and Deo unconnected; India Love ellipsis discipline preserved; as-of date discipline intact. The deleted "Read the body the way he reads money" sentence was not a protected passage; the physique beat's essential function ("The physique he built himself, rep by rep, in the one arena where nobody else can touch the outcome") survives.
- **PROTECT-10** — "nobody gets to run them" definition and the seven-years source card verbatim.

## Remaining work

None gate-blocking. Publish-time items carried forward unchanged:

- **RQ-01** — Verify which channel holds the ~3.5M before ever re-attaching the figure to the Deo-email channel; the About-page check must settle per-channel vs. aggregate phrasing. The revision pass correctly declined to re-attach.
- **RQ-02** — Publish-time news + court-record sweep to protect "the only legal mark on his first decade of fame." Standing instruction intact: do not broaden "legal mark"; do not add the denied allegation cluster.
- **P2-04** — Archive the S14/S15/S18 clip URLs at publish (the revision added written-source URLs to citations but archive.org captures remain open).
- **P1-03 optional upgrade** — If the Sportskeeda aura-farming wording is verified, a direct pushback quote may replace the paraphrase.
