---
artifact: perspective-verification
schema_version: 1
subject: Tyla
draft_sha256: ccbdb3959f3157d4453b226a03bca12acb0d2746c5f7374f7e2e178ba6202cf9
final_content_sha256: d988d7c475664344758e5ca1a04f2b37d4857a13135d98cd7a590ef502421267
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-08-15T08:14:51Z
path: docs/content-analysis/perspective-reviews/Tyla/2026-08-15_020003/verification-final.md
---

## Verification verdict

Pass, on the post-revision text. `synthesis.md` carries the supplied snapshot SHA
(`ccbdb395…`), `draft-reviewed.md` hashes to that same SHA as a full file, and its
reader-visible body reproduces `context.json`'s `reader_visible_content_sha256`
(`1ebcbf1a…`) under `hashReaderVisiblePerspectiveBody` — so the frozen snapshot is
the one the six reviews and the synthesis were written against. The live draft's
reader-visible body now hashes to `d988d7c4…`, distinct from both the snapshot
(`1ebcbf1a…`) and the state `verification-initial.md` gated (`db9c980f…`), so this
run is verifying genuinely new text. The live file's full-file SHA
(`0fe500e5…`) matches the one `revision-resolution.md` records, so nothing has
moved under the revision log.

All nine P0 acceptance tests still pass. All fourteen accepted P1 items remain
completed, with P1-07's second clause and P1-10's optional clause still explicitly
rejected-with-reason rather than silently dropped. All ten `PROTECT-*` passages
survive; nine are verbatim and PROTECT-02 remains in the widened form the initial
gate accepted. The revision pass added roughly 300 words of new material (a new
register-break H2, four restored or newly attributed quotes, and a name
disambiguation) and paid for every word with a cut, so the body came in at 4,490
against the 4,500 ceiling.

Every new assertion the revision introduced has a source trail. I traced each one
to the packet or the research file by fixed-string match: the Glamour "thousand
lives" and "best dancer" quotes ([S-16], Glamour 23 Oct 2025), the OkayAfrica
travelling-spices quote ([S-28], 28 Jul 2026), both NME legacy quotes ([S-24],
31 Jul 2026), and the Tyla Yaweh / Tyla J. Pallas disambiguation (packet L32–33).
`citations` grew by eight URLs and now covers the six assertions the initial gate
flagged as trail-less; the Notjustok _A\*POP_-title quote is confirmed to share
[S-27]'s URL with the routing numbers, so the existing entry does cover it.

Corroborating checks: `blog-lint.sh` returns **0 fail, 2 warn** (the lone
comparative inside Dennis Ade Peter's verbatim quote, and the 4,490-word count).
`blog-source-audit.mjs` returns **5 inline, 0 vague, 0 untagged**. All six `faqs`
`anchor:` values resolve to headings present in the body under github-slugger 2.0.0.
The pre-diagnosis Bacardi section and the new register-break section both scan clean
for Enneagram vocabulary, and the Bacardi section is still the last thing before the
diagnosis.

Two items are unchanged from the initial gate and still belong to a human: the year
in one H2 slug, and an uncommitted `scripts/blog-source-audit.mjs` that this draft's
clean audit depends on. Neither is an open P0.

## P0 resolution check

**P0-01 — resolved.** `meta_title` is `Why Tyla Stopped Answering On Demand:
Enneagram Type 7`. The intro reads _"She answered in writing in 2023. She answered
again, at length, in a magazine in 2025."_ The 2025 timeline row survives the
revision verbatim and is still phrased as a reply (_"British Vogue puts it to her
again. She explains it one more time…"_), and the empathy turn now names the outlet
and month: _"She answered it again for British Vogue in March 2025, patiently, all
the way to the end."_ Greps for `answered once`, `exactly one written answer`,
`stopped explaining`, `answers in writing, once`, and `the three years since` return
nothing in body, timeline, `faqs`, or `meta_title`. Re-read against the amended
timeline: 2020, 2023, 2024, 2025 and 2026 are each a response to something put to
her, so the reveal holds.

**P0-02 — resolved.** `did not have a name yet` returns nothing. The causal frame is
still returning rather than minting — _"briefed him to build a whole record inside a
category her own first single had already been filed under back in 2019"_ — and TL;DR
bullet 4 still agrees (_"Popiano was a third door, built early"_). Untouched by the
revision.

**P0-03 — resolved.** Timeline 2024 reads _"She goes quiet and her publicist closes
the subject."_ The wing section still leads on first-person material and still
carries _"The Breakfast Club appearance is weaker evidence than it looks… the wing
does not rest on it."_ The intro absolute is still _"it predates every publicist she
has ever had."_ Greps for `she declines`, `declined the frame`, `shut the door`, and
`nothing to do with media` return nothing.

**P0-04 — resolved on all four sub-tests.** (a) `would never` returns nothing.
(b) The stated primary tiebreaker is unchanged and injury-independent:
_"Interest-calibration where a Three would run audience-calibration is the actual
fork between the two types."_ (c) March 2024 is still demoted, with the caveat
intact. (d) `does most of the diagnostic work` returns nothing; the text still reads
_"That is where the type case starts."_ I re-checked the house Type 3 page:
`src/blog/enneagram/enneagram-type-3.md:67` and `:481` both describe the room-scan
and calibrate-to-the-room mechanic, corroborating rather than contradicting the
tiebreaker.

**P0-05 — resolved.** The monologue still ends _"They cannot have the name of the
thing"_, and the section still closes _"rather than let the thing that was wrong with
her become the thing she was."_ `or where` and `nobody outside her family` return
nothing. The only reader-visible occurrence of "diagnos*" in the whole file is the
typological one inside P1-05's falsifiability paragraph (_"assigned-versus-chosen is
decoration rather than diagnosis"_), which is not a medical assertion. The guess-label
is still inside the styled block via `<span class="attribution">`, and
`src/scss/blog.scss:668` renders that slot `display: block`, so it reads as its own
line without reaching the next paragraph.

**P0-06 — resolved.** _"Metacritic settled at 79 across eight reviews, none of them
negative, against the 84 the debut drew."_ Every rating in the paragraph names source
and scale (NME 3.5/5, Pitchfork 7.2, Metacritic 79, Metacritic 84). `consensus
settled` returns nothing; the comparative verdict is still attributed as _"made the
record the critics rated lower."_ Both aggregate figures now carry citation URLs
(`metacritic.com/music/apop/tyla`, `en.wikipedia.org/wiki/A*Pop`).

**P0-07 — resolved.** `belongs to amapiano` returns nothing; the positive lineage
sentence is intact (_"It came up out of kwaito in the early 2000s and fed into
amapiano"_) and now carries a citation (`afropop.org/audio-programs/bacardi-beats-of-pretoria`).
The paired-against-type argument still reads, and FAQ 6 still matches the body.

**P0-08 — resolved.** _"Tyla grew up in a country that wrote down what everybody was
and enforced the writing."_ `one country on earth` returns nothing; the paragraph's
shape and its "ordinary shapes" list are untouched.

**P0-09 — resolved.** _"She got the slot back the following April and played Coachella
both weekends, and she has still never said what was wrong."_ Still inside the
chronology, above the `inner-thought` block, so the withheld word remains the
section's closing emphasis.

## Accepted improvements check

**Completed (12), verified against the current text:** P1-01 (_"She gave the album's
guest slots to South Africans"_); P1-02 (Peter cited for the log-drum argument, Adhis
scoped to her own question, the OkayAfrica `195862` URL in `citations`); P1-03 (_"paused
for a year. The year is still running"_); P1-04 (Type 9 named and dismissed on
abstention-versus-assertion, two sentences); P1-05 (_"Every refusal on that list is a
refusal of an assigned category"_ in the diagnosis; the falsifiability paragraph still
sits after PROTECT-08, not in place of it); P1-06 (re-swept at an assumed read date of
15 Aug 2027 across the revision's new material: _"she told Glamour in October 2025"_,
_"she told OkayAfrica in 2026"_, _"Asked about legacy by NME in July 2026"_, _"as of
August 2026 she has no publicly confirmed partner"_, _"twenty-four when the album
landed"_ — no new bare present-tense age and no scheduled-but-unperformed event);
P1-08 (`legwork` returns zero occurrences, including in the Coachella opener the
revision rewrote); P1-09 (title decoded in her own words via Notjustok); P1-10 (_"I
showed them that I am passionate for this career by all means"_ intact, _"She wore them
down"_ still gone); P1-11 (_"learns how fast a room can change its mind"_ intact; the
rendered primary-school scene untouched; the spice rack now lands in the register-break
section rather than as the parents section's punchline, which is the same demotion the
item asked for); P1-12 (_"Seven weeks later"_, Ebro without the unsourced "on Apple
Music", the sp link still anchored to `/enneagram-corner/enneagram-type-7`, the
canonical variety.com URL plus the Thania Garcia byline); P1-13 (mean-girl read
attributed to The Source and unquantified).

**Completed with one half rejected-with-reason (1):** P1-07. Both FAQ anchors are
repointed and all six `anchor:` values resolve under github-slugger. The "no year in
any H2 slug" clause is still unmet at
`the-2020-clip-that-followed-tyla-into-every-interview`. The revision pass re-examined
and re-affirmed the editor's reasoning rather than silently accepting it, and logged it
as `needs_human`. Defensible; does not fail the gate. Carried below.

**Completed with one optional clause declined (1):** P1-10's optional H2 retitle. Both
stated acceptance criteria are met without it. Reversible.

**Verified against the whole file (1):** P1-14. The hinge's second sentence is still
cut; the TL;DR gloss still explains 7w8 and sp/so in plain words while keeping the
keywords; the Charlamagne apposition still names The Breakfast Club as an American
radio show.

## Protected-hit regression check

Zero regressions. Verified by verbatim string match against the live draft, then
re-checked in position:

- **PROTECT-01** — intact on all four fragments: _"She could buy the franchise now. She
  cannot go order."_; _"She could buy the building. She still cannot get the chicken."_;
  _"in each one somebody will hold out a single word and wait for her to take it"_; and
  the final reader-visible line, _"Everyone gets to say what she is now. She just never
  has to agree."_ The revision added only an outlet tag to the NME line above the close.
- **PROTECT-02** — verbatim in the form the initial gate accepted: _"every entry where
  she speaks is a reply."_ No timeline row was added or removed by this pass; the 2026
  row gained _"To NME in July"_ and is still phrased as a reply.
- **PROTECT-03** — closing line verbatim: _"Somebody chose. The markets that pay got
  chosen."_ The concession's substance survives in full: the 16 / 10 / 3 routing counts,
  the three African cities named, Courage's quote in both halves, the guest-slot contrast,
  and _"The album is where she gets to be from somewhere. The tour is where the money
  answers."_ The revision did cut the omitted-cities sentence (_"Nairobi, Accra, Abidjan
  and Dar es Salaam get nothing"_) to buy word budget. I am scoring that as no regression
  — the insight, the numbers, the critic's own words and the closing verdict all survive,
  and PROTECT-03's stated risk was softening the concession to accommodate a repair, not
  trimming an intensifier — but it is the one cut in this pass that touched a protected
  passage's interior, so it is recorded under Remaining work rather than passed silently.
- **PROTECT-04** — verbatim: _"Nothing in the type call needs the album to be good."_
  Survives the trim of the aside that preceded it.
- **PROTECT-05** — verbatim and still the Rabbit Hole's closing beat: _"…Tyla has run one
  plan with one team since she was seventeen. The sp instinct and the 8 wing cover part
  of it. The rest stays an anomaly."_ Not sharpened, not softened.
- **PROTECT-06** — both markers verbatim and in position: _"Confidence here is
  medium-high"_ closing the diagnosis, _"That paragraph is a guess."_ in the
  `.attribution` slot.
- **PROTECT-07** — closing line verbatim: _"She made the argument with her body before
  anybody had thought to ask her to make it with words."_ I re-scanned the section with
  word boundaries for `enneagram|type N|seven(s)|7w8|7w6|wing|instinct|subtype|sp/so|
enthusiast|three(s)|nine(s)`: zero matches. It is still section 2 of 9, immediately
  before the diagnosis. The revision's new section, _"What Tyla Is Like When Nobody Is
  Asking,"_ scans clean the same way and sits after the diagnosis, so it does not
  introduce vocabulary into the pre-diagnosis run.
- **PROTECT-08** — verbatim, and still the last two sentences of the VMA paragraph that
  pays for it: _"Sevens are not allergic to commitment. They are allergic to having it
  assigned to them."_ P1-05's falsifiability paragraph is still appended below it.
- **PROTECT-09** — verbatim: _"a job with no exits, a heavy relationship, a Tuesday with
  nothing on it."_
- **PROTECT-10** — verbatim: _"Given the choice between the two, she protected the word."_
  The Coachella return still sits above it, inside the chronology.

## Remaining work

1. **P1-07 residual (accepted deviation, DJ's call — unchanged).**
   `src/blog/people/drafts/Tyla.md` H2 _"The 2020 Clip That Followed Tyla Into Every
   Interview"_, slug `the-2020-clip-that-followed-tyla-into-every-interview`. Twice
   examined and twice kept: the 2020 is the clip's own date and cannot expire, and FAQ 3
   anchors to the slug. Minimum action if you disagree: retitle and repoint FAQ 3's
   `anchor:` in the same edit — free while `published: false`, non-free after.

2. **`scripts/blog-source-audit.mjs` is still uncommitted (unchanged).** `git status`
   confirms the file is modified in the working tree (25 insertions, 2 deletions): the
   African-music-press block in `OUTLETS` and `'The Source'` in `AMBIGUOUS_OUTLETS`.
   This draft's 5 inline / 0 vague / 0 untagged result does not reproduce without it.
   Minimum action: commit the script alongside the draft.

3. **RQ-01 exposure increased; RQ-03 still open.** The primary British Vogue March 2025
   text remains unread, and the revision attached _"March 2025"_ to three reader-visible
   places (the cold open, the primary-school quotes, the empathy turn). Every one rests on
   secondary corroboration — Uproxx, Fashionista, and the cross-outlet agreement the
   perspective pass assembled — which is a real trail, and both citations are now in
   frontmatter. It is still secondary. A primary read is the highest-value item for the
   next refresh. Breakfast Club audio remains unheard; the P0-03 repair is safe under
   either resolution.

4. **PROTECT-03's omitted-cities sentence was cut for budget.** Not a regression (see
   above), but if headroom appears, restoring _"Nairobi, Accra, Abidjan and Dar es Salaam
   get nothing"_ costs about ten words and returns the concession to its snapshot force.
   Recorded so a later pass does not rediscover the loss as an unexplained thinning.

5. **Word budget is still spent.** 4,490 of 4,500 (`blog-lint` WARN). The next pass must
   cut before it adds; the editor's designated cut zone is the _A\*POP_ section, and the
   revision pass has already taken roughly 70 words out of it without losing an argument,
   so the easy headroom there is gone.

6. **One comparative contrast pattern (`blog-lint` WARN), unfixable as noted.** Inside
   Dennis Ade Peter's verbatim quote, which P1-02 required. Strong count is 0, which is
   the exit requirement. No action.

7. **Load-bearing quote count moved 7 → 5 in `blog-source-audit.mjs`.** Confirmed as
   removals, not de-attributions: the Glamour epigraph and the _"We are all limitless"_
   line were cut on grader direction, and the audit still reports 0 vague and 0 untagged.
   Not evidence decay. Flagged so the next verifier reads the drop correctly.
