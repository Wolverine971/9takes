---
artifact: perspective-verification
schema_version: 1
subject: Caitlin-Clark
draft_sha256: 4573f054476806a5f939660a6be57fbeafce53b0941d183d6fb2df9b186a2925
final_content_sha256: 5e5467d1d3eac8bf80753939e3bcf1c8983f9cfedb33611ddee76f2c600690d8
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-08-05T08:14:36Z
---

<!-- docs/content-analysis/perspective-reviews/Caitlin-Clark/2026-08-05_020002/verification-final.md -->

# Perspective verification (final) — Caitlin Clark

## Verification verdict

**Pass.** All ten P0 repairs still satisfy their acceptance tests against the current live draft. All
eleven accepted P1s plus P2-02 remain completed; none was reopened or undone by the revision pass. All
eleven `PROTECT-*` items survive, including PROTECT-07, whose setup sentence the revision pass cut by
deliberate adjudication and flagged for this verifier to rule on.

Snapshot integrity confirmed:

- `shasum -a 256 draft-reviewed.md` → `4573f054…f9b186a2925`, matching the supplied `--draft-sha`,
  `context.json`, and the frontmatter of `synthesis.md`, `editor-resolution.md` and
  `revision-resolution.md`. One frozen snapshot governs all four artifacts.
- `hashReaderVisiblePerspectiveBody(draft-reviewed.md)` → `19531b42…d0e7d9246`, matching
  `context.json:reader_visible_content_sha256`.
- `hashReaderVisiblePerspectiveBody(src/blog/people/drafts/Caitlin-Clark.md)` → `5e5467d1…600690d8`,
  recorded above.
- Whole-file SHA of the live draft is `c277f99f…747a2c8`, byte-identical to the post-revision SHA
  `revision-resolution.md` records. Nothing has touched the draft since the revision pass, so this
  verification and that resolution describe the same file.

One correction to the prior verification's reasoning, because it matters to how RW-3 was closed:
`getReaderVisiblePerspectiveBody` does **not** ignore all frontmatter. It hashes `title`,
`meta_title`, `persona_title`, `description`, `enneagram`, `person` and **`faqs`**
(`scripts/lib/perspectiveReview.js:15-23`). The FAQ-3 hedge is therefore inside the hashed surface,
not outside it, and the reader-visible hash moved partly because of it. This does not change any
verdict — `verification-initial` was right that the *body* paragraph carried P0-05 on its own — but the
next stage should not treat frontmatter FAQ edits as invisible to this hash.

Method: I extracted the reader-visible body of both the frozen snapshot and the live draft with the
repository utility and diffed them word by word. Every prose delta maps to a logged P0 repair, a logged
accepted P1, a logged funding cut, or one of the grade-driven edits `revision-resolution.md` enumerates
for exactly this purpose. No unexplained body edit exists. The nine attributions the revision pass added
were each traced to a source in the review artifacts before being accepted (see
§ Accepted improvements check).

Exit state: `blog-lint.sh` **0 fail, 2 warn** — body 4,494 words against the 4,500 ceiling, and 1
comparative contrast pattern, which is the PROTECT-05 sentence the synthesis ruled must not be
rewritten. `blog-source-audit.mjs` **6 load-bearing quotes: 4 inline, 2 vague, 0 untagged**, with
`untagged quote in epigraph OR cold open: no` — confirming the revision log's claim rather than taking
it on trust.

## P0 resolution check

| ID | Verdict | Acceptance test applied to current text |
| --- | --- | --- |
| P0-01 | **resolved** | Both halves of the TIME position are stateable from H2 3 alone: the concession in the block quote, then "She never conceded the larger point. She told the same magazine she knew she was good enough for that roster, and called the omission a blessing that woke a monster." "no mechanism for pretending otherwise" — 0 occurrences. The close reads "went on believing she belonged… it did not change what she thought she was worth." "That is not grace" survives verbatim. Untouched by the revision pass. |
| P0-02 | **resolved** | "scout team," "blue squad," "walk-on," "back in for the next drill" — 0 reader-visible occurrences each. Recurrence stated: "Bluder called technical fouls on Clark in practice more than once, sometimes from the bench herself when no hired official would, and once sent her off the floor entirely." The revision pass **strengthened** this item by naming Jensen's venue in the body ("told the Talkin' Hawks podcast in 2025"), which the packet supports at S-22 and in its timeline (`~July 2025 | Jan Jensen, on Talkin' Hawks with The VandeBergs`). Propagations still agree in H2 1 and the Rabbit Hole wing. |
| P0-03 | **resolved** | The H2 1 block quote matches S-03 word for word including "because I want to be the best player in the world and I want to help this team win." "I come in here every single day" appears exactly **once** in the reader-visible body, so the double-truncation defect cannot recur. I re-read all 14 block quotes in the live body: no unmarked internal excision. The revision pass restored the one terminal truncation the prior verification flagged (RW-4), returning the Letterman quote to the frozen and packet wording. |
| P0-04 | **resolved** | The invented Seattle datum is gone; the falsification list carries "Her own account of the reflex: 'I'm always analyzing my play. I'm always trying to find ways to be better.'" (S-05). No discriminator anywhere rests on `inner-thought` content. Both `inner-thought` blocks kept. |
| P0-05 | **resolved (strong version), now consistent in frontmatter** | "the reading here is that Clark grades correctness at the moment of decision" present; the mechanism sentence "Whether the ball arrives is a separate question, settled a half-second later by four other people." is byte-identical to the frozen snapshot. Falsifier named and intact: "Watch for the night she takes the safe pass to protect a number. This reading does not survive it." Her competing account (Sue Bird) still runs. The revision pass closed the one place the hedge had failed to propagate: FAQ 3 now reads "**The reading here is that** she grades correctness at the moment of decision," which is what `PeopleBlogPageHead.svelte` feeds into FAQPage JSON-LD. |
| P0-06 | **resolved** | Her verbatim S-31 answer carried; "she did not feel it" — 0 occurrences; "the building had to tell her" retained. |
| P0-07 | **resolved** | "Those are helluva numbers." in the block quote; "hella good" — 0 occurrences; "in the same breath" — 0 occurrences, "in the same appearance" present. `docs/content-analysis/research/Caitlin-Clark.md:129` still carries "helluva numbers" with the provenance comment at line 130, so the upstream fix has not regressed. |
| P0-08 | **resolved** | TL;DR bullet 4: "four years and one league apart, both land on 'perfectionist.' Both attach the same prescription to it: give yourself some grace." "Neither of them means it" — 0 occurrences. The revision pass added outlets to both coaches' quotes (KCRG, Athlon Sports) without adding any characterization of their attitude. |
| P0-09 | **resolved (cut)** | "Cooper" — 0 reader-visible occurrences; the only hits are the TESTIMONY LEDGER comment recording the removal. The mechanism paragraph was not shortened to absorb the cut. The revision pass additionally annotated the stale SECOND PASS NOTES instruction to restore the quote (RW-1), so the October refresh can no longer read it as live. |
| P0-10 | **resolved (ENN path b)** | "single rival" — 0 occurrences. The Zeal/countertype paragraph matches `src/blog/enneagram/enneagram-type-1.md:328-334`, and the anger-direction evidence is engaged ("Bluder's list of her targets starts with 'mad at herself.'"). The Rabbit Hole was not expanded; the revision pass's only edit inside it is one imperative conversion. |

**Open P0: 0.**

## Accepted improvements check

| ID | Verdict | Evidence in current text |
| --- | --- | --- |
| P1-01 | completed | "Eight days after that final, Indiana took her first overall in the WNBA draft," then "as a rookie for a Fever team that had started 3-9." |
| P1-02 | completed, and narrowed further | Ranks now read "top two in the league in assists" — the revision pass cut "top three in the league in scoring" because packet CLM-29 marks it **disputed** (one leaderboard snapshot has Mitchell 24.03 ahead of Clark 21.54). This narrows a claim P1-02 softened rather than reversing it, and moves the section from *softened-but-disputed* to *confirmed*. "with two months and a postseason still in front of them" retained; injury bound to the August stamp; "who took over as her head coach in Indiana in 2025" retained. Whole-body grep for standalone `now`: one hit, "the audience she was now bringing to the door" — past-tense narration, not attached to a role, title, status or ranking. PROTECT-09 stamp verbatim. |
| P1-03 | completed | "Threes do not get called…" — 0 occurrences; the replacement ("She spent room-management capital in a gym with no audience in it.") survived the revision pass intact. No sentence asserts a type is incapable of a behavior. |
| P1-04 | completed | "most-watched athlete" — 0 occurrences. |
| P1-05 | completed | "three or four" and "four years old" — 0 occurrences each. The acceptance test ("the age appears zero times, or identically twice") passes. See the PROTECT-07 note below for the interaction with the closing sentence. |
| P1-06 | completed | "We'll have to see," now tagged ("Clark told ESPN"), and H2 7 still closes on "'The fire and the passion, that's what makes me, me,' she told ESPN." PROTECT-06 remains one paragraph upstream. |
| P1-07 | completed | Carrington sequencing and the McNutt criticism both present and unchanged by the revision pass. |
| P1-08 | completed | "If the pattern holds, the drive home sounds something like this." precedes the H2 4 block only; the H2 8 block keeps its existing cue. |
| P1-09 | completed | Every named third party still carries a relationship at first mention. The revision pass added outlets, not identities, and did not disturb any first-use gloss. |
| P1-10 | completed | The sp-Three counterargument and the core-fear discriminator survive. The only revision-pass edit here is "So discriminate on the fear," which was already the editor's sentence. PROTECT-05 is byte-identical, so the pointer was not funded from it. |
| P1-11 | completed | "South Carolina's bench outscored Iowa's 37-0 that night, CBS Sports noted, and Iowa's reserves attempted three shots all game." |
| P2-02 | completed (optional) | "people didn't understand how I was wired" carries the Four arrow. |

**Accepted P1s unresolved: 0. Rejected-with-reason: 0. Deferred-with-reason: 0.**

### Check 6 — new factual assertions introduced by this pass

The revision pass's Evidence work added nine publisher/date attributions, each of which is a new
factual assertion about who reported what. I traced all nine before accepting them:

| Added assertion | Source trail | Verdict |
| --- | --- | --- |
| Bluder "to KCRG in February 2025" | S-20, kcrg.com, 2025-02-01; packet timeline row | traced |
| White "Athlon Sports, 2025" | S-23, athlonsports.com | traced |
| Jensen "told the Talkin' Hawks podcast in 2025" | S-22 + packet timeline (`~July 2025`, VandeBergs). Note the packet records the episode itself as **not listened to** and S-22's direct fetch as HTTP 405; the body claims only what the secondary reports | traced, with the packet's own confidence caveat |
| Grace quote "to Yahoo Sports in May 2026" | Packet quote block at evidence-packet.md:141; Yahoo URL already in `citations` frontmatter | traced |
| "per Guinness World Records" on the 223 | S-43 | traced |
| "CBS Sports noted" on the 37-0 bench | `fan.md:501` research log — CBS Sports, "Gamecocks' freshmen, bench depth step up," fetched during the review | traced |
| "The AP line, row by row:" | S-40 (Yahoo/AP) and S-42 (ABC/AP wire), which between them carry every row in the table | traced |
| "her third Eastern Conference Player of the Week on August 4" | S-47 (Fever release, 2026-08-04, Week 10) and S-48 (WRTV, third of the season) | traced |
| "the worst team in the league" (replacing "would spend the whole summer in last place") | S-40 headline, "WNBA-worst Storm"; table row "Against a 6-21 team" | traced, and weaker than the clause it replaced |

**No new assertion was introduced without a source trail.** The one attribution whose corroboration
still lives only in resolution prose is the Sue Bird date, carried forward below.

## Protected-hit regression check

All eleven survive. Verified by exact-string comparison against `draft-reviewed.md`.

| ID | Verdict | Note |
| --- | --- | --- |
| PROTECT-01 | intact | Mechanism sentence byte-identical; framing changed by exactly the one sentence P0-05 authorized; the paragraph is not compressed. **One item for the record:** the synthesis said "nothing else touches it," and the revision pass did touch one more sentence — the cohesion bridge that opens the paragraph, converted from "Remember what she wanted to know about those ten assists." to "Her question about those ten assists scales up here." The carried keyword survives, the function is identical, and the protected span begins at "Ones are not organized around avoiding mistakes." Ruled equivalent tighter wording, not a regression. |
| PROTECT-02 | intact | "She also keeps the check. Both are true, she has not solved it, and there may be no version of her career in which she can" verbatim, in the body, unresolved, no salary figure. "no standing to argue with at all" verbatim. |
| PROTECT-03 | intact | All three protected clauses verbatim. The lead-in changed from "Start with the criticism she has actually absorbed on basketball" to "The criticism she has actually absorbed is about basketball" — an imperative conversion in the lead-in, outside the concession. |
| PROTECT-04 | intact | Final row and the assist row's "right read versus a bailout" verbatim. The added "The AP line, row by row:" sits above the table; the trimmed clause sits in the paragraph below it. |
| PROTECT-05 | intact | The H2 6 filter paragraph is **byte-identical** to the frozen snapshot (diffed directly, not read for gist). Its comparative contrast pair remains the one lint warning, correctly left alone. |
| PROTECT-06 | intact | "The reframe changes what the behavior means without changing what it cost." verbatim, standing alone upstream of H2 7's P1-06 ending. |
| PROTECT-07 | **intact — adjudicated** | The revision pass flagged this for a verifier ruling, correctly. "Nobody has told her the gap closed." survives **verbatim and still closes the article**. What was cut is its setup sentence, the return-to-the-origin-object move the grader capped originality on. Ruling: **not a regression.** The protected passage as the synthesis quoted it is untouched; the insight is not deleted; and the bookend still has both of its hinges in H2 2, which retains the bike ("her older brother had gotten on his") *and* the phrase the closing line answers ("the gap is yours to close"). "The gap" therefore keeps a referent in the article, and the swap test still passes — no other subject produces this ending. This is a wider-span bookend, not a broken one. |
| PROTECT-08 | intact | Hook through the one-word "Six." unchanged in this pass. The revision's only edit inside the cold open is the ESPN tag on "We'll have to see," which sits after "Six." and adds attribution rather than removing content. |
| PROTECT-09 | intact | "It is August 2026, and she is spending the hours again" verbatim; H2 8 heading verbatim. What follows the stamp lost the disputed scoring rank and gained the sourced award date. |
| PROTECT-10 | intact | "The rest of the analysis stands on its own" verbatim; section not expanded. |
| PROTECT-11 | intact | "I mean, like, yes" inside the Goldman Sachs block quote, unchanged. The sentence after it lost its imperative mood only. |

**Protected-hit regressions: 0.**

## Remaining work

None of the following blocks the gate.

1. **The Sue Bird date is now asserted twice on the same evidence standard, and still corroborated
   nowhere in the artifacts.** `revision-resolution.md` closes RW-2 by stating the *Bird's Eye View*
   episode aired 2025-08-08 and that SI covered it as "Fever Star Caitlin Clark Points Out Positive in
   'Toxic' Turnover Trait to Sue Bird," and annotates TESTIMONY LEDGER entry 7 accordingly. That is a
   source trail on its face and check 6 passes on it. But the annotation carries no S-number and no
   URL, the packet's S-29 still dates the turnover material to **2024**, and the synthesis's RQ-03
   assumed 2024. No P0 acceptance test depends on the date, so per the verifier's scope limit I did not
   open research on it. **Minimum action:** attach the SI URL to the ledger annotation (or add it to the
   packet as a numbered source) before publish; if it resolves to the 2024 appearance, the in-body
   "On Sue Bird's podcast in August 2025" and the ledger both need correcting.
2. **The FORMULA FINGERPRINT LEDGER's imperative count is stated as an absolute and is not one.**
   It reads "Reader-command imperatives: 2 … the count is the ledgered constraint, so do not
   reintroduce." Two further imperative-mood reader commands survive in the body — "Pressure-test that
   against the obvious alternative." (H2 1) and "So discriminate on the fear." (Rabbit Hole
   counterarguments) — neither of which the grader enumerated. Nothing is wrong with the prose; the
   ledger line is what will mislead. This is the same failure species as RW-1: a production comment
   that a later pass will read as fact. **Minimum action:** restate it as "2 of the grader's enumerated
   set; 2 further analytic imperatives retained deliberately," so the next pass neither re-counts nor
   "fixes" them. While there, the REVISION PASS NOTES say 4,495 words; lint reports **4,494**.
3. **Word ceiling — unchanged and still DJ's call.** Body 4,494 of 4,500. The October postseason
   refresh needs either a one-time `BLOG_LINT_WORD_CEILING` exception or a structural cut of ~150
   words. Carried from the editor resolution, the initial verification and the revision resolution
   without change; three passes have now declined to decide it because it is not an editorial call.
4. **Two of the four cross-draft sameness moves are template-wide.** The epigraph → cold-open →
   reframe furniture and the TL;DR bold-noun-phrase bullet skeleton are properties of the people-draft
   template, not of this draft. The revision pass rejected them with reason, correctly. They will keep
   capping originality on every people draft graded in a batch until someone decides about the
   template itself.
5. **RQ-01 (the tempo claim) remains unverified,** and the draft still does not depend on it. No change.
6. **"Top two in assists" has a shelf life.** CLM-29 confirms it as of 2026-08-04 (Thomas 8.32, Clark
   8.03). It is a live-season rank inside a current-tense anchor and needs re-checking at the October
   refresh alongside the postseason update.
