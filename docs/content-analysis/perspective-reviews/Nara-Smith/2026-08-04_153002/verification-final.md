---
artifact: perspective-verification
schema_version: 1
subject: Nara-Smith
draft_sha256: 5919d6ad4f13f53fc57f83418c2a8c0996021655646893ed382284cd997228b0
final_content_sha256: ef8ecf0dbbe987b0be311131cd7ef586ad3bfd776923cb9128c0dece3c11aa7d
verification_status: fail
open_p0: 1
protected_hit_regressions: 0
verified_at: 2026-08-04T21:34:46Z
path: docs/content-analysis/perspective-reviews/Nara-Smith/2026-08-04_153002/verification-final.md
---

## Verification verdict

**Fail — one P0 reopened by the revision pass. Nothing else regressed.**

Provenance first. `synthesis.md` carries `draft_sha256: 5919d6ad…`; `draft-reviewed.md` hashes to
`5919d6ad4f13f53fc57f83418c2a8c0996021655646893ed382284cd997228b0`. Both match the supplied SHA. The
reader-visible body has moved as expected across the two passes: `ff28f0b4…` (reviewed) →
`530d6b3d…` (post-editor, verified initially) → `ef8ecf0d…` (current). `blog-lint.sh` returns 0 fail,
1 warn (body 4,462 words against a 4,500 ceiling), matching the revision pass's stated exit state.

The revision pass was grader-driven and ran on top of a passing verification, so most of its work sits
outside perspective scope. Two of its items land inside it, and they go opposite ways:

1. **P1-05 is now complete.** Both deferred glosses landed and both acceptance tests pass.
2. **P0-01 is reopened.** Among the seven inline source stamps the pass added for the grader's
   NEEDS WORK #1, one credits a named outlet with obtaining comment from her that it did not obtain.
   This is the same defect class P0-01 exists to remove, newly introduced at a different publisher.

I verified this rather than inferring it. The body now reads _"By March 2024 she was declining every
marker that would let anyone place her, **telling Axios Salt Lake City that March**: 'I don't wear
garments. I didn't get married in the temple.'"_ The reviewed draft carried that quote with **no**
publisher attribution (`draft-reviewed.md:305`), so the relationship is new this pass. Packet CLM-09
and S-08 both describe Axios Salt Lake City and the Salt Lake Tribune as _"reporting her TikTok
statement,"_ and the Axios headline is _"Influencer Nara Smith **tells TikTok** she's 'not hardcore
Mormon' amid tradwife debate."_ She said it on her own platform; Axios re-reported it. The quote, its
date and its substance are all sound — only the venue is wrong.

This is not the same case as _On Purpose with Jay Shetty_, which the initial verification waived. She
appeared on Shetty's podcast, so that is a venue where she spoke directly. Axios is a publication that
re-reported a TikTok, which is structurally identical to the Forbes error P0-01 was written for.

Everything else holds. All twelve protected hits survive by literal match. Fifteen of sixteen accepted
P1 items are complete (P1-07 remains a disclosed human call). The other new material this pass added
carries a source trail: the TODAY paragraph is labeled a re-report of the 1 July 2026 disclosure and
its URL is in `citations`; the 200,000-likes passage checks out against the archived transcript at
`00:33:02–00:33:17`, including _"I can't wait for her to be older"_ and _"doing my kids a
disservice by exposing them"_; the bell gloss and the body-center mechanism assert no new fact about
her.

## P0 resolution check

**P0-01 — Forbes interview that did not happen. UNRESOLVED (reopened at a new publisher).**
The Forbes half stays fixed: the key-stat block is still scoped (_"12M+ TikTok followers as of July
2026… / Forbes, 31 July 2026; Call Her Daddy, 29 July 2026"_), no sentence claims Forbes obtained
comment, and the Source Diversification ledger still records it as a re-report. The failure is the new
Axios stamp quoted above. Acceptance test — _"No sentence or citation block in body or frontmatter
states or implies that any outlet other than Call Her Daddy, People, and her own posts obtained
comment from her directly"_ — fails on the word _telling_.

_Minimum remaining action:_ attribute the quote to the medium she actually used and keep the
publisher as the re-report — e.g. _"saying on TikTok that March: 'I don't wear garments…'"_ Word-
neutral, keeps the inline stamp the source audit wants, and the dated trail survives in the ledger and
in `citations` (the Axios URL is already there, and a bare citation list asserts no interview).

**P0-02 — Whimsy timeline. RESOLVED (unchanged).**
Five anchors still reconcile against an 8 April 2024 birth: _"She was nineteen months old when it
started"_ (cold open), Nov 2025 treatment start (table row plus _"They had been in Connecticut about
two months when it started"_), _"She was in remission right after her second birthday in April
2026,"_ the last treatment and bell after that, disclosure early July, remission confirmed the 17th.
No age is attached to a span. The revision reworded the bell sentence to add a gloss — _"The last
treatment came later, and the bell that patients ring to mark it"_ — which does not disturb the
ordering.

**P0-03 — Hospital name in structured data. RESOLVED (unchanged).**
No frontmatter field names a hospital. `grep` for Yale/New Haven returns the body's single
inline-attributed reference at line 396 (_"she named Yale New Haven in the Cooper interview and
nowhere before it"_) plus editorial comments. FAQ 4 still reads _"was in chemotherapy from roughly
November 2025 to July 2026."_

**P0-04 — Invented first-person passages. RESOLVED (unchanged).**
Both inner-thoughts are intact and sourced. The cancer beat still traces to transcript
`01:02:34–01:02:42`. The label beat still sits ahead of the Wicker paragraph (line 310 vs 312) with no
named critic before it — Levings and Katwiia are 14 lines downstream — and its two factual
propositions still trace (_"a dress I already owned"_ → line 251; _"my hands had started working
again"_ → lines 227/231).

**P0-05 — "She objected once." RESOLVED (unchanged).**
No frequency claim survives. `grep` for "once" across the reader-visible body returns four hits, none
about rebuttal frequency (_"once the argument got expensive"_, _"once it is safely finished"_, _"never
once considered"_); "single podcast" returns nothing. The dated pre-2026 rejection is still in the
body. The rebuilt 8w9 paragraph still argues manner (_"never escalated: no return fire at Levings or
Katwiia by name, no second round, no pinned rebuttal"_) and cites no vocal or tonal feature.

**P0-06 — Central exhibit built by omission. RESOLVED (unchanged).**
Two service rules from the same video still named (_"she pre-reads his restaurant menus and keeps him
stocked in hot sauce"_), _"Do it for me"_ still carries the passage that used to be an inferred
silence, and the filmed-task narrowing survives (_"Whatever else she does for him off camera, that one
chore is never going in the frame"_).

**P0-07 — Negative universals. RESOLVED (unchanged).**
TL;DR _"The criticism hurt, and she says so"_; body _"The criticism did land"_; cancer section _"Shame
about the illness is not the reason she gives."_ I re-read every remaining "never" in the current
body: each is observable behaviour, a general type claim, or inside her own quote. No sentence asserts
her interior injury or motive except as her own account.

**P0-08 — Contested premise in the table. RESOLVED (unchanged).**
2024 row still reads _"The tradwife label attaches and sticks."_ The collaboration loss is still in the
body, attributed (_"told Cooper in July 2026 that one prospective collaborator refused to work with
her over it"_).

**P0-09 — The tiebreaker that argued against itself. RESOLVED (unchanged).**
_"The sharper test came from a compliment… An image-attuned type does not take a flattering frame and
make it worse. The eight months of silence run the same direction, though those belong to her under
pressure rather than at rest."_ The postpartum-photo details the test depends on were considered as a
word-budget cut this pass and correctly rejected.

**P0-10 — Archive the primary source. RESOLVED (unchanged).**
`docs/content-analysis/youtube-transcripts-people/nara-smith_call-her-daddy_pjHzLMfsf3w.md` and the
source-archive manifest both still exist. I used the transcript directly this pass to verify the one
new quote drawn from it (the 200,000-likes passage), whose speaker is settled by first-person content:
_"a story that I posted on Instagram about my daughter."_

## Accepted improvements check

**Fifteen of sixteen complete.** P1-01, P1-02, P1-03, P1-04, P1-06, P1-08, P1-09, P1-10, P1-11, P1-12,
P1-13, P1-14, P1-15 and P1-16 were verified complete in the initial pass and survive this one. Three
were touched by the revision and re-checked here:

- **P1-05 — now complete.** Both deferred glosses landed: _"Enneagram Type 8, the Challenger,
  self-preservation dominant: the survival instinct is what the intensity serves"_ at first body use,
  and _"The Enneagram sorts nine types by core motivation, and its body center, Eight, Nine and One,
  is where certainty arrives ahead of analysis rather than after it"_ in the body-center paragraph.
  The type-answer block remains extractable at 54 words. The gap the initial pass named — the term
  explained only inside the Rabbit Hole — is closed. The TL;DR still uses the term first, but glosses
  it functionally (_"A refusal to be at anybody's mercy, pointed at food, at the house, and at the
  camera"_), and it is a summary accordion, not the argument.
- **P1-11 — still complete, keyed more softly.** _"Read it from where she stood."_ became the label
  form _"From where she stood:"_ per the grader's ban on reader-command imperatives. The first
  inner-thought a reader meets is still the tradwife one and it is still marked as a reconstruction
  rather than a quote, so the test holds. Worth knowing it is now the weakest form of the key.
- **P1-16 — still complete after the stamp move.** The close carries exactly one full attribution
  (_"she told Cooper on Call Her Daddy in 2026"_), relocated onto the load-bearing oatmeal quote to
  resolve the conflict with the grader's TO REACH #1. The disclosure is correct that this touched the
  first stamp, which P1-16's scope note did not authorize; the test itself still passes.
- **P1-07 — three of four archived, one escalated.** Unchanged and defensible. @Katwiia is a
  deliberate deferral to a human, not an unresolved edit.

Two minor weakenings, neither gate-failing:

- **P1-02.** The format description survives (_"The videos have a shape: a request from her husband or
  a child, then her making the thing from scratch, alone, in a gown"_), so its test passes. Folding the
  H3 into the main H2 moved the Katwiia quote 21 lines downstream of it, so the quote no longer lands
  on the format the way the synthesis intended.
- **P1-03.** The counterphobic-Six paragraph lost its fear quote to the word budget (it was a verbatim
  duplicate of the cancer section's). The discriminating evidence — method, _"A Six would scan and
  consult; she fired the doctors who dismissed her"_ — and the Six-satisfying falsifier both survive,
  so the test passes on an assertion (_"the fear vocabulary is hers"_) rather than on a quote in place.

## Protected-hit regression check

**All twelve survive. No regressions.** Verified by literal string match against the current draft, not
against the revision log.

PROTECT-01 (_"It is the only kitchen she has ever been in where somebody else's hands were on
hers"_) · PROTECT-02 (_"…is doing too much work"_ and _"The driving rule stays unexplained by the
type"_) · PROTECT-03 (_"nineteen months before she sat down with Cooper"_) · PROTECT-04 (_"Most of the
argument lives in that gap"_) · PROTECT-05 (_"It was also not what was tricky to navigate that
March"_) · PROTECT-06 (_"the right-hand column never leaked"_, table structure intact) · PROTECT-07
(_"Her critics have the stronger case on impact"_) · PROTECT-08 (_"I was wearing a diaper in that
picture"_, position unchanged) · PROTECT-09 (_"the internet read the constraints as a manifesto"_) ·
PROTECT-10 (_"She is guarding the right to be the one who releases it"_) · PROTECT-11 (_"None of them
knew"_ and _"Both of those are the same move"_) · PROTECT-12 (_"She flew back to the country she was
raised in to be believed"_).

Two checked deliberately because this pass cut words near them:

- **PROTECT-09.** The paragraph is **verbatim identical** to `draft-reviewed.md:244`. The bob/haircut
  paragraph this pass cut for budget sat at `draft-reviewed.md:233`, in the scratch section eleven
  lines upstream and outside the protected span; the detail survives in FAQ 2. Not a regression.
- **PROTECT-06.** Table, cells and closing line untouched. The one-line intro before it was tightened
  to _"Here is what that meant, by date."_ — outside the span, disclosed by the revision pass.

## Remaining work

Ordered by what blocks the gate first.

1. **Fix the Axios attribution (the one open P0).** Replace _"telling Axios Salt Lake City that
   March"_ with the medium she used — she said it on TikTok on or before 7 March 2024, and Axios Salt
   Lake City plus the Salt Lake Tribune reported it the same day. Word-neutral. The quote itself is
   verified (packet CLM-09, S-08) and needs no other change.
2. **Re-check the rest of that stamp bundle before trusting the log.** The revision notes claim an
   inline _"Rolling Stone conversion report"_ stamp was added; `grep` finds no "Rolling Stone" in the
   reader-visible body. The claim it was meant to support (_"reports that she converted were never
   confirmed"_) predates the pass and the packet supports it, so nothing false is printed — but the log
   entry is wrong, and it is the same entry that introduced the Axios error. Treat the seven added
   stamps as unverified until each is re-checked against the packet.
3. **Decide the @Katwiia quote (P1-07).** Unchanged and still DJ's call: keep the unarchived quote, cut
   it, or replace it with an archivable equivalent making the same charge. The body prints no date, so
   nothing false is asserted today.
4. **Complete the singjupost.com speaker cross-check (P0-10 residual).** Still owed, still not a
   blocker for anything currently printed. Every quote now in the draft has been attribution-checked;
   the `>>` markers demonstrably miss turns, so any _new_ pull needs the labeled transcript — most of
   all anything touching the two cancer narratives in that conversation.
5. **Soft point in P0-02(b), unchanged.** _"The last treatment came later"_ remains an inference from a
   run-on utterance. The new gloss (_"the bell that patients ring to mark it"_) resolves the reader
   problem the initial pass flagged; the interval is still a reading, not a stated fact.
6. **Thinnest standing claim: _"no pinned rebuttal."_** Still an assertion whose source trail is an
   absence (RQ-06's sweep), unchanged this pass.
7. **Unclaimed value, now affordable.** Headroom is 38 words. P2-01 (the naming convention — Rumble
   Honey, Slim Easy, Whimsy Lou, Fawnie Golden, ~15 words) is the best available delight beat and fits.
   RQ-03 (did she ever use the tag herself) remains the open question with real upside.
