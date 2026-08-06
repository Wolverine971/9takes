---
artifact: perspective-verification
schema_version: 1
subject: Nara-Smith
draft_sha256: 5919d6ad4f13f53fc57f83418c2a8c0996021655646893ed382284cd997228b0
final_content_sha256: 530d6b3daa7b5e87210e99b8e44c9c30f01ca3be2a9b3c691db01bbfdb08ea95
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-08-04T21:06:36Z
---

## Verification verdict

**Pass.** All ten P0 items meet their acceptance tests, all twelve protected hits survive, and no
repair introduced an unsourced factual assertion.

Provenance checks first. `synthesis.md` carries `draft_sha256: 5919d6ad…` and the frozen snapshot
`draft-reviewed.md` hashes to `5919d6ad4f13f53fc57f83418c2a8c0996021655646893ed382284cd997228b0` —
both match the supplied SHA. The reader-visible body has changed as expected: `ff28f0b4…` (reviewed)
→ `530d6b3d…` (current). `blog-lint.sh` on the current draft returns 0 fail, 1 warn (body 4,484
words against a 4,500 ceiling), which matches the editor's stated exit state.

This pass did more than compare prose. P0-10 produced an archived transcript that did not exist when
the synthesis was written, so I re-verified the load-bearing repairs directly against it rather than
against the editor's summary of it. That surfaced one substantive discrepancy in the editor's
evidence trail (P0-01, below) and confirmed the rest.

Two things are worth stating plainly because they cut against the editor's own log in one place and
for it in another:

1. The editor's stated evidence for P0-01 — that Cooper "read the line back to her" at transcript
   `00:17:01` — is **wrong**. The transcript shows Nara saying it, and Cooper's next line is "Why was
   that bizarre to you?" The repair itself still passes, because the substituted quote has an
   independent source trail, but the provenance note recorded in the draft's ledger is false and will
   mislead a later pass. See Remaining work.
2. The editor disclosed that the singjupost.com speaker cross-check for P0-10 was skipped. I ran the
   attribution check myself on all six named quotes instead of taking the summary on trust. All six
   are unambiguously hers from first-person content. P0-10's acceptance test is met; the residual risk
   the cross-check was meant to retire is retired for the load-bearing material specifically, not for
   the transcript as a whole.

## P0 resolution check

**P0-01 — Forbes interview that did not happen. RESOLVED, with a documented reading.**
`"She gave Forbes the feeling version on 31 July 2026"` is gone. The key-stat block is scoped —
`12M+ TikTok followers as of July 2026. Every video shot, edited, and voiced by one person, in her own
description. / Forbes, 31 July 2026; Call Her Daddy, 29 July 2026` — and the Source Diversification
ledger now records Forbes as a re-report. Forbes survives in the body only inside that span and in the
frontmatter `citations` list, neither of which claims direct comment.

The test's literal wording names only *Call Her Daddy*, *People* and her own posts, and the body now
also names *On Purpose with Jay Shetty*. I read this as satisfying the test rather than violating it:
P0-05's own acceptance test **requires** a dated pre-2026 rejection in the body, which necessarily
names a fourth venue, and the Shetty appearance is real. It is verified in `fan.md:578` against
BuzzFeed (12 July 2025, reporting the 10 July 2025 episode), carrying the exact verbatim the draft now
prints. The defect P0-01 exists to remove — a manufactured reporting relationship — is gone.

**P0-02 — Whimsy timeline. RESOLVED.**
Cold open: *"a little girl named Whimsy Lou was in a hospital bed five days out of roughly every
sixteen… She was nineteen months old when it started."* No age is attached to the span. Five points
anchor and reconcile against an 8 April 2024 birth: treatment start ~November 2025 (table row plus
*"They had been in Connecticut about two months when it started"*), remission *"right after her second
birthday in April 2026"*, the last treatment and bell after that, disclosure early July 2026, remission
confirmed 17 July. Nineteen months from 8 April 2024 lands in November 2025; the ~8-month window
closes on July 2026.

One inference to flag rather than fail. *"The last treatment and the bell came later"* rests on the
synthesis's finding that she said two separate things. The archived transcript at `01:00:01` is a
single run-on: *"right after her birthday, she she was in remission, we finished her last treatment, we
rang the bell, it was very emotional."* It orders the clauses that way but does not establish a gap.
The draft's ordering is a defensible reading of her own clause order and is forced anyway by the
November–July treatment window the draft states elsewhere, so the acceptance test holds. Noted in
Remaining work.

**P0-03 — Hospital name in structured data. RESOLVED.**
No frontmatter field names a hospital (`grep` over the file returns Yale/New Haven only at body
line 391 and in editorial comments). FAQ 4 now reads *"was in chemotherapy from roughly November 2025
to July 2026."* The cold open dropped *"in New Haven"* and kept the cadence and chemotherapy, as the
adjudication required. The single body reference is inline-attributed: *"she named Yale New Haven in
the Cooper interview and nowhere before it."* RQ-01 resolved affirmatively — she names
*"the Yale New Haven Children's Hospital"* herself at transcript `01:02:49`, which I confirmed — and
keeping the FAQ cut anyway is the correct call, since the structured-data concern is independent of
whether the fact is sourced.

**P0-04 — Invented first-person passages. RESOLVED, verified against the transcript.**
(a) The invented marital-silence clause is gone. The replacement — *"I hint at it to Lucky and he tells
me not to think that way, so I put it down and wait for the hospital to call"* — traces to
`01:02:34–01:02:42`: *"But I didn't want to say it to Lucky. Like I I did hint at it and he was like,
'No, honey. You can't like you can't think like that.'"* The surrounding narrative correction is also
sound: *"The call came a week later, after the biopsies and the scans"* matches `01:03:02–01:03:10`.
The editor correctly disambiguated the two "he"s in that passage — Lucky says *"No, honey"*; the
pediatrician says *"take her to the closest hospital"* — which is exactly the failure mode this repo
has logged a near-miss on.

(b) The label inner-thought moved ahead of the Wicker paragraph (body line 305, Wicker at 307). It no
longer sits between Wicker and Levings and no longer reads as her reply to a race charge. Its factual
propositions (*a dress I already owned*, *my hands had started working again*) both trace to sourced
material in the scratch section.

**P0-05 — "She objected once." RESOLVED.**
No frequency claim survives. A `grep` for "once" over the reader-visible body returns five hits, none
about rebuttal frequency (*"once the argument got expensive"*, *"once it is safely finished"*,
*"never once considered"* giving up hope). "Single podcast" returns nothing. *"objected once it started
closing doors"* is gone, replaced by *"She kept making videos in the format that generated the label for
two years while it was working, and says one prospective collaborator refused to work with her over
it."* A dated pre-2026 rejection is in the body: *"She had been making the argument since at least July
2025, on Jay Shetty's podcast."* FAQ 3 carries the same correction.

The 8w9 argument is rebuilt on manner — *"no return fire at Levings or Katwiia by name, no second
round, no pinned rebuttal… 'Let them think what they're going to think' is an endgame of
disengagement"* — and cites no vocal or tonal feature. The editor's extra catch is confirmed: *"let
them think what they're going to think"* is at `00:26:40`, so the old *"after ninety minutes of
rebuttal"* was a checkable error and it is gone.

**P0-06 — Central exhibit built by omission. RESOLVED.**
Two service rules from the same video are named: *"she pre-reads his restaurant menus and keeps him
stocked in hot sauce."* The inferred silence is replaced by her own words: *"Do I like my husband
filling up my gas tank? Absolutely… I don't want to close my own suitcase. Do it for me,"* confirmed at
transcript `00:24:28–00:24:36`. *"Nobody performing traditional wifehood draws that line"* is narrowed
to the filmed-task claim: *"Whatever else she does for him off camera, that one chore is never going in
the frame."* No sentence asserts a general refusal of domestic service. The declared anomaly is
narrowed to *"she posts it, and lets his principle about women stand unchallenged,"* and PROTECT-02
still holds after a reader has seen the service-preference quotes — it is now about the endorsement,
not the driving.

**P0-07 — Negative universals. RESOLVED.**
All three are gone. TL;DR: *"The criticism hurt, and she says so."* Body: *"The criticism did land.
Asked how she handled it, she told Cooper: 'Crying to my husband…'"* — verified at `00:21:29`. Cancer
section: *"Shame about the illness is not the reason she gives."* FAQ 1's *"not aggression but"* and
FAQ 4's *"not shame about the illness but"* both removed. I read every remaining "never" in the
reader-visible body: each is either observable behaviour (*"never argued theology"*, *"the right-hand
column never leaked"*, *"has never disclosed"*), a general type claim, or inside her own quote. The
sorted-not-disliked insight survives as a claim about what she fought.

**P0-08 — Contested premise in the table. RESOLVED.**
2024 row now reads *"The tradwife label attaches and sticks."* The collaboration loss moved to the body
attributed to her. The consent claim was dropped rather than relocated, which is a stronger form of
compliance than attributing it. No table cell states either proposition as fact.

**P0-09 — The tiebreaker that argued against itself. RESOLVED.**
The word "tiebreaker" is gone. The diagnosis section now runs: *"The sharper test came from a
compliment. When the internet turned a postpartum photo of her into a bounce-back trophy, she went back
and corrected it downward… An image-attuned type does not take a flattering frame and make it worse.
The eight months of silence run the same direction, though those belong to her under pressure rather
than at rest."* Asked what is hard to explain if she is a Three, the section answers with the downward
correction; the eight months are explicitly demoted and labeled stress-state.

**P0-10 — Archive the primary source. RESOLVED.**
`docs/content-analysis/youtube-transcripts-people/nara-smith_call-her-daddy_pjHzLMfsf3w.md` exists
(2,651 segments, video ID / pull date / tool / speaker caution in frontmatter), alongside
`nara-smith_source-archive-manifest.md`. I located all six named quotes myself and checked attribution
rather than accepting the manifest: gut-feeling 1 `01:02:16`, gut-feeling 2 `01:03:22`, dishes
`00:18:53`, permission `00:08:35`, "did I die?" `00:46:59`, oatmeal `01:16:44`. Every one is
first-person maternal or first-person professional narrative that only Nara can be speaking, and the
"did I die?" and gut-feeling passages are corroborated by Cooper's own follow-up turns.

The caution is real but does not fail the test. The `>>` turn markers are incomplete — at `01:16:25`
the marker sits on Cooper's question and the switch to Nara mid-block is unmarked — so the transcript
cannot be relied on for attribution by markers alone. For these six, content settles it.

## Accepted improvements check

Fourteen of sixteen accepted P1 items are complete and meet their tests: P1-01 (political charge of
the label, body line 295), P1-02 (video format named at the top of the H3), P1-03 (counterphobic Six
plus Type 1 plus a Six-satisfying falsifier — *"a major decision she made by canvassing other people
first"*), P1-04 (Cooper quote moved upstream of Levings/Katwiia, provenance labeled *"Her host offered
another explanation"*, section closes on *"It does not settle Levings' charge"*), P1-06 (cookbook
absolute-dated, "still" dropped, follower count date-stamped, *"has modeled for"*, FAQ 3 attributed),
P1-08 (*"narrows her to the body center: Eight, Nine or One"*), P1-09 (hidden pregnancy removed from
the stress-arrow list; eight months labeled stress-state in one role only), P1-10 (*"which shows up
earlier"*), P1-11 (*"Read it from where she stood"* keys the first inner-thought a reader meets — the
tradwife one now precedes the cancer one), P1-12 (instruction dropped, both readings held, and the
correction that she posted the photo herself is confirmed at `00:55:37`), P1-13 (*"and she has not been
asked about it on the record"*), P1-14 (FAQ 4 verb), P1-15 (Marc Jacobs clause dropped, Ballerina Farm
cut), P1-16 (second Cooper stamp reduced to *"she said"*).

Two are partial, both disclosed and both defensible:

- **P1-05 — deferred in part, with reason.** The free frontmatter edit landed (*"national radio"* →
  *"a podcast"*), as did the autoimmune gloss and *"a Black woman like her"* in the Wicker setup. The
  Enneagram-as-a-system and self-preservation-dominant glosses were not added; the body is at 4,484
  against a 4,500 ceiling. A newcomer still meets *"self-preservation dominant"* in the TL;DR and the
  first diagnosis sentence with the explanation only inside the Rabbit Hole. Word budget is a real
  constraint, not a dodge, and the editor flagged it in the draft.
- **P1-07 — three of four archived.** Levings, TheGrio and Forbes resolve to dated Wayback snapshots
  recorded in the manifest. @Katwiia has no date and no snapshot; the editor kept the quote rather than
  cutting it and escalated the call. The body prints no date, so nothing false is asserted.

## Protected-hit regression check

All twelve survive. No regressions.

PROTECT-01 (oatmeal close, last line verbatim; only the second source stamp changed) · PROTECT-02
(*"…is doing too much work"* and *"The driving rule stays unexplained by the type"* both verbatim;
P0-06 narrowed only what precedes them) · PROTECT-03 (December 2024 date argument untouched, including
*"nineteen months before she sat down with Cooper"*) · PROTECT-04 (Wicker gap paragraph — zero words
changed inside it, one clause appended per P1-13) · PROTECT-05 (*People* carpet paragraph untouched,
including *"It was also not what was tricky to navigate that March"*) · PROTECT-06 (table structure and
*"Two years of footage, and the right-hand column never leaked"* intact; three cells edited as
specified) · PROTECT-07 (*"Her critics have the stronger case on impact"* verbatim) · PROTECT-08 (the
quoted material and its position did not move; the instruction after it was replaced per P1-12) ·
PROTECT-09 (constraints passage untouched, *"manifesto"* kept) · PROTECT-10 (*"She is not guarding an
image…"* verbatim) · PROTECT-12 (*"She flew back to the country she was raised in to be believed"*
verbatim, dermatologist sequence intact).

**PROTECT-11 — one out-of-scope trim, not a regression.** The synthesis scoped the cold open to "one
age clause and one place name. Nothing else." The editor also cut *"Nothing left to weigh in on."*, and
disclosed it. Both named lines — *"None of them knew"* and *"Both of those are the same move."* —
survive verbatim, and the passage's insight survives in *"What the internet received was a completed
story. Nothing left to watch."* The draft's own fresh-eyes review had independently flagged that exact
sentence as the fifth instance of a two-beat-closer habit. Equivalent tighter wording, insight intact:
pass. Recorded here because the scope instruction was explicit.

## Remaining work

None of these is an open P0 or a protected-hit regression. Ordered by how much a later pass would
suffer from not knowing.

1. **Correct the false provenance note in the draft's ledger.** The Source Diversification ledger
   (body line 147) and the EDITOR PASS note (line 563) both state that the "poster child" quote
   *"originates with Shetty (July 2025) and was read back to her by Cooper."* The archived transcript
   refutes the second half. At `00:16:56–00:17:06` Cooper says *"People started to compare you to
   tradwife and people were like—"*, Nara says *"[They] kind of used me as the poster child for the
   tradwife movement, which was very bizarre to me,"* and Cooper follows with *"Why was that bizarre to
   you?"* — a question that only makes sense if she just said it. That verbatim is hers, on *Call Her
   Daddy*, 29 July 2026, and Forbes re-reported it; the packet carries it at line 152. The Shetty
   verbatim the draft now prints is a **different** sentence with its own valid source trail
   (`fan.md:578`, BuzzFeed 12 July 2025). Both quotes are real. Only the note is wrong, and it is
   reader-invisible, so nothing published is affected — but left standing it will tell the next pass
   that a genuine Cooper quote is not hers.
2. **Reconcile the Shetty episode date.** `fan.md` pins the episode to **10 July 2025** (BuzzFeed,
   published 12 July, reporting the 10 July episode). The editor's log and the draft's ledgers say
   **9 July 2025**. The reader-visible body and FAQ 3 both say only "July 2025", so nothing published
   is wrong; fix the ledgers before any future pass promotes the day-level date into the body.
3. **Complete the singjupost.com cross-check (P0-10's minimum repair).** I verified attribution for
   the six load-bearing quotes independently and they are unambiguous. The transcript remains
   speaker-unlabeled and its `>>` markers demonstrably miss turns, so any quote pulled from it in a
   future pass — particularly anything touching the two cancer narratives in that conversation, hers
   and her mother's — still needs the labeled transcript.
4. **Decide the @Katwiia quote (P1-07, escalated by the editor).** Undatable, unarchived, Tier 4 in the
   packet, and the sharpest statement of the ledger charge. This is a human call about whether an
   unverifiable critic quote is acceptable in the section whose fairness the whole jury scrutinised.
5. **Soft point in P0-02(b).** *"The last treatment and the bell came later"* is an inference from a
   run-on utterance, not a stated interval. It is consistent with everything else the draft asserts and
   the acceptance test passes. If a labeled transcript or later coverage ever pins the bell date, tighten
   it. Related: *"the bell"* now arrives with no gloss for a reader who does not know the convention,
   since the earlier *"Whimsy rang the bell"* phrasing is gone.
6. **Thinnest new claim: *"no pinned rebuttal"*** in the 8w9 paragraph. RQ-06's search sweep found no
   public re-engagement after 29 July 2026, which covers it in substance, but it is a specific negative
   about her profile state and it is the one assertion added this pass whose source trail is an absence
   rather than a document.
7. **Unclaimed value, unchanged from the synthesis.** P1-05's two missing glosses, P2-01 (the naming
   convention — Rumble Honey, Slim Easy, Whimsy Lou, Fawnie Golden — still the best available delight
   beat at ~15 words), and RQ-03 (did she ever use the tag herself), which the synthesis identified as
   the open question with real upside. All are blocked by the same thing: 16 words of headroom.
