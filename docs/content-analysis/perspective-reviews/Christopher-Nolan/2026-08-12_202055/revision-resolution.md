---
artifact: perspective-revision-resolution
schema_version: 1
subject: Christopher-Nolan
draft_sha256: 05c68d661eb2c8f6744fda41a8f4d53bfc3b8bd6ff62b06c0b4969dd53ce6cab
resolution_status: complete
resolved_at: 2026-08-13T02:18:05Z
path: docs/content-analysis/perspective-reviews/Christopher-Nolan/2026-08-12_202055/revision-resolution.md
---

Revision pass triggered by the grade sidecar (B+ 8.6, Evidence 8 / Writing 8) and a `blog-lint`
FAIL on body length, not by an open perspective P0. `verification-initial.md` is the newest
verification artifact and it reports `verification_status: pass`, `open_p0: 0`,
`protected_hit_regressions: 0`. **No P0 was reopened and no accepted P1 was left incomplete**, so
this log covers the one item the verifier left outside its gate (the length cut), its two
advisories, and the protected-hit regression re-check that the verifier explicitly required if the
cut were taken.

Post-revision draft sha256: `7ffa4280ae77157fa861c3c98d23251c1340302fd12dc1bba24bd0f2ee5e6533`.
Body: **4,487 words** (was 4,884). `blog-lint`: 0 fail, 1 warn (the thin-headroom warn, which is
structural for anything in the 4,050–4,500 band).

## Resolution log

| Item                                                                       | Source                                                    | Status                | Edit                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| -------------------------------------------------------------------------- | --------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Remaining work 1 — body length 4,884 vs the 4,500 publish gate             | verification-initial.md; also grader NEEDS WORK (Writing) | **fixed**             | Cut 397 words net. Full-beat retirements: the streaming-war vindication paragraph (the grader-named duplicate of the Oppenheimer moral-cost beat; the section now ends on the _Tenet_ cost paragraph, PROTECT-01), the daily-uniform beat, the Apollo-uncle beat, and the set-visit quote in the walls-face-inward paragraph. Compressions: the _Inception_ paragraph to its spinning-top core, the _Prestige_ paragraph to Caine's rule plus the stagecraft reframe, the Haileybury paragraph's parental biography, the Telegraph phone quote to a clean stop, the efficiency-quote payoff, the Caine doorstep dialogue, and roughly a dozen clause-level trims. **The editor's escalated candidate list was only partly used**: the Kip Thorne autodidact beat and the knighthood/"Long" beat were both kept (Thorne is the only non-secrecy Type 5 evidence and a qualifying testimony quote; "Long" is now verified against the official CBS transcript), and _Inception_ and _The Prestige_ were compressed rather than deleted. |
| Remaining work 2 — corpus denominator re-check at publish                  | verification-initial.md                                   | **research_needed**   | Not re-run. `src/lib/data/corpus-stats.json` regenerates on build, so this check belongs to the publish pass, not here. The as-of stamp ("as of August 2026") is still in the key-stat label. Unchanged from the verifier's note.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Remaining work 3 (advisory) — the Stargate gloss overstates                | verification-initial.md                                   | **fixed**             | "the long wordless flood of light that ends 2001" → "…near the end of 2001". The verifier's stated minimum action, taken.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Remaining work 4 (advisory) — _Oppenheimer_ gloss trails its first mention | verification-initial.md                                   | **skipped**           | Deliberate. The fix would mean rewriting inside PROTECT-04's paragraph range for what the verifier itself called a wording nitpick, on a page where the substance already lands (~110 lines before the Hiroshima paragraph). Not worth the regression risk during a length cut.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| RQ-03 (Nolan's craftsman/anti-subtext self-account)                        | editor-resolution.md unresolved decision 3                | **research_needed**   | Still open, still gating P2-08 only, which was not taken. Nothing published depends on it. Closes alongside the Haileybury page-level cite in one session with Shone's _The Nolan Variations_.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Haileybury page-level check (packet CLM-13)                                | grader TO REACH A #3                                      | **fixed** (partially) | Only one Haileybury quote survives in the body. It is now externally corroborated as a _Nolan Variations_ quote by independent secondary sources reproducing it in that context, and it keeps its in-prose attribution to "his biographer Tom Shone." Page-level cite remains open and is recorded as such in the draft's working notes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

Evidence work outside the perspective set, from the grade sidecar, listed here because it changed
attributions the jury read:

- **Zimmer cold-open reply exchange (untagged, blocked A/B+).** Now "When he played it, Zimmer told
  The Hollywood Reporter, Nolan said…". PROTECT-04's own sentence untouched.
- **60 Minutes tiebreaker (vague).** Now "When Scott Pelley suggested on 60 Minutes in 2026…", with
  the quote repunctuated to the official CBS News transcript and an ellipsis marking the elided
  sentence. This was the grader's biggest Evidence item: **all four load-bearing 60 Minutes quotes
  are now verified against the official transcript with speaker attribution**, not YouTube
  auto-captions — the audience exchange, Jonathan Nolan's "it was like a door," Emma Thomas's "Every
  no that he got," and the one-word "Long."
- **Two Happy Sad Confused misquotes corrected.** "You can't be reactive in your filmmaking" was a
  false-start rendering; he completed the sentence as "you don't want to be reactive in your film
  making." "I hate to be on anybody's set" was missing its conditional ("I'd hate"). The 2020
  attribution on the Horowitz quotes is confirmed correct: they sit inside the flashback segment
  (19:26) of the 2026-07-16 episode, which the episode itself dates to 2020.
- **Two loose slots tagged:** the Stargate quote ("he told Josh Horowitz in 2023") and the
  spokesperson correction ("(IndieWire, 2020)").
- **Both stale ledgers restamped.** The SECOND PASS NOTES source-audit claim ("8 inline, 0 vague, 0
  untagged") was wrong and is now corrected in place with a do-not-restate warning. The FORMULA
  FINGERPRINT similarity stamp was stale and self-contradictory; re-run today it reads clear, and
  the 0.060 Yang-Zhilin trip the grader flagged was cleared at source by moving the `/corpus-stats`
  link out of the reused "(9takes corpus data)" citation and into the key-stat label.

## Protected hits checked

The verifier warned that six of the twelve protected hits sit in or beside the length-cut
candidates and required a re-check if the cut were taken. **All twelve survive. Zero regressions.**
Three were touched without losing their protected content, and are disclosed here rather than
buried:

- **PROTECT-01** — Intact through "He has never conceded the point," and now _strengthened_: the
  vindication paragraph that followed it was the cut, so the section ends on the _Tenet_ failure
  instead of on Nolan collecting trophies.
- **PROTECT-02** — Verbatim: "which is also the strongest case against it."
- **PROTECT-03** — All four Wilson judgments and the grateful close verbatim. Deliberately **not**
  touched during the cut, including the Pajiba/Theron counter-reading that resolves P0-04.
- **PROTECT-04** — "Zimmer read a story about a father and wrote about being one" verbatim. The
  outlet tag was added to the _following_ sentence.
- **PROTECT-05** — Verbatim: "Nolan's packages happen to be 70 millimeters wide."
- **PROTECT-06 [TOUCHED]** — "It spread because Nolan declines to perform himself in public, and the
  vacuum fills with legend" verbatim; P1-07's operative clauses verbatim. The only change is an
  added "(IndieWire, 2020)" citation on the spokesperson quote. Nothing removed.
- **PROTECT-07 [TOUCHED]** — Form intact: 11 `timeline__event` entries, reverse chronology, one-line
  register on every row. Two entries lost two words each ("his biggest film to date" → "his biggest
  film"; "can be shot for real" → "is real"). P1-08's exclusion sentence still accounts for all 13
  features.
- **PROTECT-08** — Verbatim through "working toward a screening that could never happen."
- **PROTECT-09** — Verbatim: "What would change our mind: credible evidence that he seeks
  reassurance or consensus before deciding." The Type 8 sibling P0-05 added is intact.
- **PROTECT-10** — Verbatim through "sealed until showtime, exactly as he found it," still the
  article's final paragraph. Nothing in the closing run was cut.
- **PROTECT-11 / 11a** — Verbatim: "engineers feelings instead of having them"; the reverse-reading
  paragraph; "The 747 was corn with a bigger invoice."
- **PROTECT-12 [TOUCHED]** — The 5w6 argument survives at full strength through "a seat on the
  standards committee," with the repertory-company evidence (Caine, Zimmer, Murphy) and the
  institutional evidence (DGA, National Film Preservation Board, BFI) both intact. One clause was
  removed from the evidence list: "the same producer, Emma Thomas, on every feature," which the
  childhood section already states. This is de-duplication, not the softening-toward-the-aggregators
  that fresh eyes warned against. Main-body type-theory paragraph count is still 1. Person-first
  architecture and the FAQ question set are unchanged.

Also re-verified after the cut: all 10 TESTIMONY LEDGER quotes still appear in the body, all 8 H2s
are unchanged, the DISTRIBUTION LEDGER count of 1 still holds, and `blog-lint` reports 0 strong and
0 comparative contrast-pair engines.

## Unresolved decisions

1. **Corpus denominator (4 of 153) must be re-verified at publish time.** `corpus-stats.json`
   regenerates on build. Carried forward from the verifier unchanged; it belongs to the publish
   pass.
2. **Haileybury page-level cite and RQ-03 both remain open.** Neither gates publication. One session
   with Shone's _The Nolan Variations_ closes both.
3. **Headroom is thin by design.** At 4,487 words the draft sits 13 under the ceiling. Any later
   pass that adds a sentence re-fails the lint. The next person to add material should cut first or
   argue the ceiling with `BLOG_LINT_WORD_CEILING`, which is what the editor originally proposed.
4. **The grader's arithmetic on the length fix was optimistic.** It said cutting the streaming-war
   vindication clause "gets most of the way there"; that clause is 32 words of a 394-word gap. The
   remaining 365 came from the beats and compressions listed above. Flagging it so the next grade
   pass does not read the extra cuts as unrequested scope.

This does not declare the perspective gate passed. `/blog_perspective_verify_people` must rerun
against this draft, because the length cut is exactly the change the previous verification said
would require one.
