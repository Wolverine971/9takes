---
artifact: perspective-verification
schema_version: 1
subject: Tyla
draft_sha256: ccbdb3959f3157d4453b226a03bca12acb0d2746c5f7374f7e2e178ba6202cf9
final_content_sha256: db9c980f573fc7dd423dd1b3875606e523f26b9922e8bff05127bb39589353c0
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-08-15T07:45:20Z
path: docs/content-analysis/perspective-reviews/Tyla/2026-08-15_020003/verification-initial.md
---

## Verification verdict

Pass. The synthesis frontmatter carries the supplied snapshot SHA
(`ccbdb395…`), and `context.json`'s `reader_visible_content_sha256`
(`1ebcbf1a…`) reproduces exactly against `draft-reviewed.md` using
`hashReaderVisiblePerspectiveBody`, so the frozen snapshot is the one the six
reviews and the synthesis were written against. The live draft at
`src/blog/people/drafts/Tyla.md` now hashes to `db9c980f…`, confirming the
reader-visible body changed.

All nine P0 acceptance tests pass against the current text. All fourteen
accepted P1 items are completed, with one half of P1-07 and one optional clause
of P1-10 explicitly rejected with a defensible reason rather than left silent.
All ten `PROTECT-*` passages survive — nine verbatim, one (PROTECT-02) widened
in wording while the insight and its structural payoff are preserved and still
true against the amended timeline.

Corroborating checks run outside the acceptance tests: `blog-lint.sh` returns
**0 fail, 2 warn** (both warns are the ones the editor logged — the lone
comparative sitting inside Dennis Ade Peter's verbatim quote, and 4,493 words
against the 4,500 ceiling). `blog-source-audit.mjs` returns **7 inline, 0 vague,
0 untagged**, matching the pre-edit baseline. All six `faqs` `anchor:` values
resolve to headings present in the body under github-slugger.

Three items belong to a human rather than to this gate: an unmandated deletion
of a reviewer-named quote, a `citations` field that did not grow to match six
new factual assertions, and an uncommitted change to
`scripts/blog-source-audit.mjs` that the audit's PASS now depends on. None of
them is an open P0. All three are itemised under Remaining work.

## P0 resolution check

**P0-01 — resolved.** `meta_title` is now `Why Tyla Stopped Answering On Demand:
Enneagram Type 7`. The intro reads _"She answered in writing in 2023. She
answered again, at length, in a magazine in 2025. What she stopped doing was
answering on demand, on somebody else's platform."_ A 2025 timeline row exists
and is phrased as a reply (_"British Vogue puts it to her again. She explains it
one more time…"_), and the identity section's list of answers now includes
_"She answered it again for a magazine in 2025, patiently, all the way to the
end."_ Greps for `answered once`, `exactly one written answer`, `stopped
explaining`, `answers in writing, once`, and `the three years since` return
nothing anywhere in body, timeline, `faqs`, or `meta_title`. The reveal was
re-read against the amended timeline: every row in which she speaks (2020, 2023,
2024, 2025, 2026) is a response to a question or an instruction put to her, so
_"every entry where she speaks is a reply"_ holds.

**P0-02 — resolved.** _"that did not have a name yet"_ is gone; the causal frame
is now returning rather than minting — _"briefed him to build a whole record
inside a category her own first single had already been filed under back in
2019."_ TL;DR bullet 4 agrees: _"Popiano was a third door, built early: told to
choose between pop and amapiano, she went back to a category her own first
single already sat in."_ No body, TL;DR, or FAQ sentence implies label pressure
produced the name.

**P0-03 — resolved.** Timeline 2024 reads _"She goes quiet and her publicist
closes the subject."_ The wing section leads on first-person material
(_"There's no way to stop me"_; _"I really am opinionated and blunt"_) and adds
_"The Breakfast Club appearance is weaker evidence than it looks… the wing does
not rest on it."_ The intro absolute is replaced with _"it predates every
publicist she has ever had."_ Greps for `she declines`, `declined the frame`,
`shut the door`, and `nothing to do with media` return nothing.

**P0-04 — resolved on all four sub-tests.** (a) `would never` returns nothing.
(b) The stated primary tiebreaker is now _"what she does with material she did
not choose… Interest-calibration where a Three would run audience-calibration is
the actual fork between the two types"_ — independent of the injury. (c) March
2024 is demoted to supporting colour with the caveat _"How much that weighs
depends on whether performing remained possible at all, which is not public."_
(d) `does most of the diagnostic work` is gone, replaced by _"That is where the
type case starts."_ I re-read `src/blog/enneagram/enneagram-type-3.md` against
the new tiebreaker: line 67 (_"you've mapped the power dynamics, identified what's
valued, and started calibrating… You become a mirror reflecting exactly what
earns recognition"_) and line 481 (_"The room scan… calibrated accordingly"_) now
**corroborate** the audience-calibration premise rather than contradict it.

**P0-05 — resolved.** The monologue ends _"They cannot have the name of the
thing"_; the section's closing line reads _"rather than let the thing that was
wrong with her become the thing she was."_ `or where` and `nobody outside her
family` return nothing; the text now says _"she has still never said what was
wrong."_ The guess-label is inside the styled block via the existing
`.attribution` slot and is readable without reaching the next paragraph. The one
surviving occurrence of "diagnosis" in reader-visible prose is at
`src/blog/people/drafts/Tyla.md:363` — _"assigned-versus-chosen is decoration
rather than diagnosis"_ — which is the typological sense inside P1-05's new
falsifiability paragraph, not a medical assertion. Not a failure of this test.

**P0-06 — resolved.** _"Metacritic settled at 79 across eight reviews, none of
them negative, against the 84 the debut drew."_ Every rating in the paragraph
(NME 3.5/5, Pitchfork 7.2, Metacritic 79, Metacritic 84) names its source and
scale. `consensus settled` returns nothing. The comparative verdict is
attributed: _"made the record the critics rated lower."_

**P0-07 — resolved.** `belongs to amapiano` returns nothing. The body states a
positive lineage instead — _"a Pretoria street style… It came up out of kwaito in
the early 2000s and fed into amapiano"_ — and the paired-against-type argument
still reads (_"Bacardi normally rides an amapiano record. 'Water' is not one."_).
FAQ 6 matches: _"a Pretoria dance style normally set to amapiano records."_

**P0-08 — resolved.** _"Tyla grew up in a country that wrote down what everybody
was and enforced the writing."_ No uniqueness claim survives; the paragraph's
shape and its "ordinary shapes" list are untouched.

**P0-09 — resolved.** _"She got the slot back the following April and played
Coachella both weekends, and she has still never said what was wrong."_ It sits
inside the chronology, above the `inner-thought` block, so the withheld word
remains the section's closing emphasis and the section still ends on _"rather
than let the thing that was wrong with her become the thing she was."_

## Accepted improvements check

**Completed (12):** P1-01 (_"She gave the album's guest slots to South
Africans"_); P1-02 (Peter cited for the log-drum argument, Adhis scoped to her
own question, `okayafrica.com/…/195862` added to `citations`); P1-03 (gap-year
transaction dropped; _"The year is still running"_ intact); P1-04 (Type 9 named
and dismissed on abstention-versus-assertion, exactly two sentences); P1-05
(_"Every refusal on that list is a refusal of an assigned category"_ promoted into
the diagnosis; falsifiability paragraph added after — not in place of — L347);
P1-06 (verified by re-reading at an assumed date of 15 Aug 2027: no
scheduled-but-unperformed event, no bare present-tense age, tour routing and
mean-girl discourse past-tensed, dating quote carries an as-of in both body and
FAQ, _"every project she has released"_, _"the choreographer from the beginning"_);
P1-08 (amapiano, log drum, and a widened Bacardi all defined; `legwork` returns
zero occurrences in the file); P1-09 (title decoded in her own words via
Notjustok); P1-10 (parents' quotation marks removed; _"I showed them that I am
passionate for this career by all means"_ restored; _"She wore them down"_ gone);
P1-11 (_"learns how fast a room can change its mind"_; spice rack demoted to a
joke; the rendered primary-school scene untouched); P1-12 (all four: _"Seven
weeks later"_, Ebro attribution without the unsourced "on Apple Music", sp link
re-anchored to `/enneagram-corner/enneagram-type-7`, canonical variety.com URL in
`citations` plus the Thania Garcia byline in-body); P1-13 (mean-girl read
attributed to The Source and no longer quantified; the empathy turn below it
intact).

**Completed with one half rejected-with-reason (1):** P1-07. Both FAQ anchors
were repointed to `who-tyla-is-and-how-she-got-here`, and a pre-existing broken
anchor was corrected (`why-a-pop-sounds-like-tyla-slowing-down` →
`why-apop-sounds-like-tyla-slowing-down`). I re-ran github-slugger over the file:
all six `anchor:` values resolve. The acceptance test's second clause — _"No H2
slug in the file contains a year"_ — is not fully met, because
`the-2020-clip-that-followed-tyla-into-every-interview` retains its 2020. The
editor flagged this rather than deviating silently, on the ground that the 2020
is the clip's own date and cannot expire, and that the heading is
anchor-referenced by FAQ 3. That is a defensible tradeoff and does not fail the
gate; it is carried to Remaining work as a call DJ can overrule.

**Completed with one optional clause declined (1):** P1-10's optional H2 retitle.
The synthesis marked it "Optionally"; both stated acceptance criteria are met
without it, and the heading carries the "Tyla parents" search intent. Reversible.

**Verified against the whole file (1):** P1-14. The hinge's second sentence
(_"They can also be two things that happen to be true at once"_) is cut, leaving a
single-pass paragraph; TL;DR bullet 1 glosses the notation while keeping the
"7w8"/"sp/so" keywords; the 2024 timeline row now reads _"Charlamagne tha God
asks again on the American radio show The Breakfast Club."_

## Protected-hit regression check

Zero regressions. Verified by verbatim string match against the live draft:

- **PROTECT-01** — intact. Open: _"She could buy the franchise now. She cannot go
  order."_ Close: _"She could buy the building. She still cannot get the
  chicken."_ The durable half of the tour image is verbatim (_"in each one
  somebody will hold out a single word and wait for her to take it"_); only _"are
  booked"_ changed, per P1-06's instruction. The article's last reader-visible
  line, _"Everyone gets to say what she is now. She just never has to agree,"_ is
  unchanged from the snapshot — the revision brief's step-24 phrasing was loose,
  not violated.
- **PROTECT-02** — survives, wording widened. The reveal now reads _"every entry
  where she speaks is a reply"_ rather than _"the two entries where she speaks are
  both replies"_, because P0-01 added a third speaking entry. The insight and its
  structural payoff are preserved, and the widened form is true against the
  amended timeline and cannot go stale on the next addition. Equivalent, not
  deleted.
- **PROTECT-03** — verbatim. _"Somebody chose. The markets that pay got chosen."_
  Not softened to compensate for P1-01's narrowing; the surrounding concession is
  unchanged.
- **PROTECT-04** — verbatim. _"Nothing in the type call needs the album to be
  good."_ Survives P0-06's number changes.
- **PROTECT-05** — verbatim, still the Rabbit Hole's closing beat on _"The rest
  stays an anomaly."_ Not sharpened.
- **PROTECT-06** — both markers verbatim. _"Confidence here is medium-high"_ is
  still in position, closing the diagnosis section ahead of the Type 3 argument;
  P0-04's rebuild did not raise it. _"That paragraph is a guess."_ moved into the
  `.inner-thought` block's `.attribution` slot, which is the relocation P0-05
  prescribed, not a removal or a rewording.
- **PROTECT-07** — intact on both halves. Re-grepped the Bacardi section with
  word boundaries for `enneagram|type 7|seven|sevens|7w8|wing|instinct|subtype|
sp/so|enthusiast`: zero matches. The section still closes verbatim on _"She made
  the argument with her body before anybody had thought to ask her to make it with
  words."_ The new lineage and definition sentences sit at the section's head.
- **PROTECT-08** — verbatim, and still immediately after the VMA beat. P1-05's
  falsifiability paragraph was appended below it.
- **PROTECT-09** — the "ordinary shapes" list is verbatim; only the four-word
  superlative inside the paragraph changed, as P0-08 required.
- **PROTECT-10** — verbatim. _"Given the choice between the two, she protected the
  word."_ The Coachella return was placed above it inside the chronology, so it
  did not displace the emphasis.

## Remaining work

1. **P1-07 residual (accepted deviation, DJ's call).**
   `src/blog/people/drafts/Tyla.md:259` — H2 _"The 2020 Clip That Followed Tyla
   Into Every Interview"_, slug `the-2020-clip-that-followed-tyla-into-every-
interview`. The acceptance test's "no year in any H2 slug" clause is
   unsatisfied. The editor's reasoning holds (the date is the clip's own and never
   expires; the slug is anchor-referenced by FAQ 3), so this does not fail the
   gate. Minimum action if you disagree: retitle and repoint FAQ 3's `anchor:` in
   the same edit — free while `published: false`, non-free after.

2. **`citations` did not grow to match six new factual assertions.** Verification
   step 6 asks whether repairs introduced new facts without a source trail. A
   trail exists for every one of them in `editor-resolution.md` (outlet, date, and
   in most cases author), and `blog-source-audit.mjs` passes at 7 inline / 0 vague
   / 0 untagged, so no load-bearing quote is unattributed. But the draft's own
   `citations` list grew by only two URLs (Peter's OkayAfrica piece and the
   canonical Variety link), while these new or changed assertions carry no
   citation URL: Metacritic 79 and the debut's 84; the March 2025 British Vogue
   cover-story quotes; the Bacardi kwaito→amapiano lineage (Afropop Worldwide);
   the _amapiano_ = "the pianos" gloss and log-drum definition (Wikipedia); the
   April 2025 Coachella return (News24 / Billboard / Rolling Stone); and the
   Notjustok _A\*POP_-title interview, which is a different article from the
   Notjustok tour-critique URL already listed. Minimum action before
   `published: true`: add those URLs to `citations`.

3. **One unmandated deletion of a reviewer-named hit.** The Glamour quote _"I
   don't think I'm the best dancer… it will be a Tyla version of it."_ was cut
   from the Bacardi section (snapshot L198). It is not a `PROTECT-*` item, so it
   is not a regression by this gate's definition — but it was item 8 on the
   subject reviewer's own do-not-lose list (`subject.md:505`, _"the one place my
   own self-deprecation is allowed to stand without being converted into
   evidence"_), and the editor's cut log describes the trims as "mostly from the
   _A\*POP_ section as the synthesis directed, plus one duplicated quote and one
   redundant hinge sentence," which does not cover this one. Minimum action:
   decide deliberately — restore it (≈25 words, against 7 words of headroom) or
   record the cut in `editor-resolution.md`.

4. **Word budget is spent.** 4,493 of 4,500 (`blog-lint` WARN). Item 3 above
   cannot be actioned without cutting first. The editor designates the _A\*POP_
   section as the cut zone.

5. **One comparative contrast pattern (`blog-lint` WARN), unfixable as noted.** It
   sits inside Dennis Ade Peter's verbatim quote, which P1-02 required adding.
   Strong count is 0, which is the exit requirement. No action.

6. **RQ-01 and RQ-03 remain open, as the synthesis permitted.** The primary
   British Vogue March 2025 text and any Breakfast Club audio/transcript are still
   unread. Both repairs are safe under every plausible resolution. Log for the
   next refresh.

7. **The audit PASS depends on an uncommitted local script change.**
   `scripts/blog-source-audit.mjs` has uncommitted additions in the working tree:
   an African-music-press block in `OUTLETS` (OkayAfrica, Notjustok, Revolt,
   MambaOnline, IOL, Music In Africa, British Vogue) and `'The Source'` in
   `AMBIGUOUS_OUTLETS`. Both widen coverage with named, bylined, dated
   publications rather than weakening any rule, and `The Source` correctly sits in
   the ambiguous list behind the adjacent-cue requirement. Flagging only because
   this draft's clean audit result does not reproduce without those edits.
   Minimum action: commit the script change alongside the draft.
