---
artifact: perspective-review
schema_version: 1
subject: Bill-Burr
perspective: future
draft_sha256: c279d288f1395a0b96ec6c208186b19926202e563247907ae81fbfd50b37a55c
review_status: complete
trust: strained
value: high
delight: clear_hit
recommendation: revise
blockers: 1
concerns: 6
reviewed_at: 2026-08-19T07:19:33Z
---

## Bottom-line verdict

Read from August 2027, this page mostly holds. That is not luck — the draft's evidence spine is
built out of absolutely-dated exhibits (1972 driveway, 1992-03-02 first set, 2006-09-09
Philadelphia, 2020-10-10 SNL, 2025-09/10 Riyadh, 2026-08-10 and 2026-08-17 podcast episodes), and
dated exhibits do not rot. Strip out every event from the last six months and the argument still
stands, which is the single most important durability test and the draft passes it.

The failure is concentrated in one place: the ending. The closer asserts that Burr "plays a crisis
counselor" in an unreleased film and then builds the entire final rhetorical payoff on that
reading. The best available evidence does not support it, the evidence packet explicitly warned
against it, and the film opens seven weeks after publication — so this is not a claim that decays
slowly, it is a claim that gets checked in October 2026 and may already be wrong today.

Second-order: every self-referential corpus statistic in §1 is unstamped and sits on a corpus that
adds ~25 profiles per month, and a handful of relative-time constructions ("58 now," "nineteen
years," "nine years on") roll over inside the twelve-month window.

Revise. The blocker has a cheap, word-neutral repair, and the refresh list below is short.

## What landed

**FUTURE-H1 — The Riyadh two-date table.**

> | Oct 2025 | Conan O'Brien Needs a Friend, live at the Fonda Theater, Los Angeles | … |
> | Aug 10, 2026 | Monday Morning Podcast, episode 8-10-26 | … |

This is the most durable structure in the piece and it should survive revision untouched. A weaker
draft would have written "recently he admitted on his podcast that he was nervous" — a sentence
that is unreadable in 2027 because "recently" has no referent. Instead the argument is carried by
the *interval between two fixed dates*, which is a quantity that never changes. In August 2027 this
table reads exactly as it reads today. In 2030 it still reads correctly. Date-anchored comparison
is the correct engineering choice for a claim built on a discrepancy, and the draft made it.

**FUTURE-H2 — Refusal to resolve a live controversy.**

> "That is the reflex. It does not settle whether Cross is right about the money."

The Riyadh dispute is unresolved in the real world and the draft leaves it unresolved on the page.
This is the difference between a piece that ages and a piece that gets falsified: had the draft
written "the criticism has since faded" or "Burr was ultimately vindicated," any development in the
next twelve months could invalidate it. Instead it makes a claim about the psychology and
explicitly declines the claim about the ethics. Preserve the sentence verbatim.

**FUTURE-H3 — The three-tellings structure.**

> "He has said it three times over eight years, in three formats, in nearly the same words."

"Three times over eight years" is arithmetic between two fixed endpoints (2017, 2025), not
arithmetic against the publication date. It does not need updating in 2027, 2030, or ever. Compare
this to "nineteen years" elsewhere in the same draft, which does. The draft demonstrates it knows
how to write durable time — which is why the places it doesn't are worth fixing rather than
excusing.

**FUTURE-H4 — Dated attribution on nearly every quote.** "he told The Hollywood Reporter in 2022,"
"On NPR's Fresh Air on March 10, 2025," "On the August 17, 2026 Monday Morning Podcast." A future
reader can locate and re-verify each one. This is the ordinary hygiene most celebrity content
skips, and it is the reason my refresh list below is six items instead of thirty.

## What missed

**The closer trades a durable image for a fragile one.** The final section has two possible
endings available to it. One is the driveway-to-October arc built on a specific unreleased film
role. The other is the arc the piece has already earned across 4,500 words — a man who has been
running the same protective reflex since 1972, still doing it in public. The draft chose the
fragile one, and it chose it in the position where a reader's last impression is formed. When the
role turns out to be a Zuckerberg PR handler rather than a therapist, the last thing the reader
sees is the thing that was wrong.

**Self-referential statistics are treated as facts rather than as measurements.** §1 quotes six
corpus numbers with no as-of date. These are not facts about Bill Burr; they are readings off a
dataset that this very repository regenerates and that grows by ~25 profiles/month. The draft
stamps his *age* correctly in the FAQ ("58 as of August 2026") and then declines to stamp the
statistics, which are far more volatile than his birthday.

**The "next" frame in the FAQ has a guaranteed expiry.** "What is Bill Burr in next?" answered with
a film releasing 2026-10-09 is correct for seven weeks and then progressively wrong for the rest of
the page's life.

## What I expected

- Absolute dates on quotes and events. **Delivered**, near-universally.
- An unresolved controversy left unresolved. **Delivered** (FUTURE-H2).
- An as-of stamp on any figure derived from a live dataset. **Not delivered** (FUTURE-C1).
- Hedging proportional to evidence on a not-yet-released film. **Not delivered** in the body
  (FUTURE-R1); the FAQ hedges correctly with "Per the trailer," which makes the body's flat
  assertion an internal inconsistency as well as a durability problem.
- A closer whose value does not evaporate when its news peg ages. **Not delivered.**

## What surprised me

**Welcome:** the draft's own production ledger already contains the durability discipline I came to
test for — the FORMULA FINGERPRINT LEDGER names a "Current-tense anchor" and an "Ending swap-test."
The machinery to catch FUTURE-R1 existed; it just wasn't pointed at the release-date risk.

**Jarring:** the evidence packet at `evidence-packet.md` dispute #5 states the problem in plain
language — *"Burr's role in The Social Reckoning is unresolved… Any conclusion that reads the role
as therapeutic must stay qualified"* — and the draft's closer does precisely the qualified-reading
the packet forbade. This is a documented instruction that was overridden somewhere between research
and draft, which makes it a process finding as much as a content one.

**Also unexpected:** publishing this article changes the article's own statistics. Burr's
frontmatter carries `type: ['comedian', …]`, and the `comedy` domain matches on the raw label
`comedian`, so on publish the comedian set goes 32 → 33 and its Type 6 count goes 3 → 4. The
sentence "Three of the 32 comedians profiled on 9takes are Sixes" becomes untrue at the moment the
page goes live, on a page whose subject is the fourth.

## Red flags

### FUTURE-R1 — BLOCKER — Unreleased-film role asserted as fact, and the ending is built on it

**Passage.** Section "The part Bill Burr plays in October" (draft L387–389):

> Bill Burr plays a crisis counselor.
>
> Somebody handed the angriest man in comedy a chair, put him across from a person coming apart,
> and asked him to be the one who stays calm and talks them down. It is not obvious casting. It is
> very good casting. Fifty-four years after the driveway, that is the job.

**Reader effect / trust problem.** The final 60 words of the article stake its thesis payoff on a
factual claim about a film nobody has seen. If the role is not therapeutic, the closing image — a
chair, a person coming apart, talking them down — is not an interpretation, it is invented scene
description. A 2027 reader who has seen the film and finds Burr playing a comms adviser will
retroactively distrust the evidence handling in the preceding 4,400 words, which is unfair to a
draft that is otherwise scrupulous.

**Evidence.** Three independent checks all decline to support "crisis counselor":
1. `evidence-packet.md` dispute #5: character named "Charlie" (Wikipedia); "crisis counselor" per
   some trade coverage of the trailer; "a PR handler pushing back on Zuckerberg's delivery" per
   another trailer write-up. Packet verdict: *"Any conclusion that reads the role as therapeutic
   must stay qualified."*
2. Wikipedia, *The Social Reckoning* cast list (fetched 2026-08-19): the entry is exactly
   "Bill Burr as Charlie" — no occupation given at all.
3. Trade/trailer coverage (search, 2026-08-19): Burr plays "Charlie, an advisor of a sort to
   Zuckerberg," whose trailer line is *"These guys are counting on the next round of congressional
   testimony to make you likable, Mark."* Coaching a client on likability before testimony is
   crisis **communications**, not crisis **counseling** — adjacent words, opposite scenes. The
   draft's dramatization (someone "coming apart," being "talked down") matches neither.

Note the draft's own FAQ hedges this correctly — *"Per the trailer, Burr plays a crisis counselor"*
— so the body is also inconsistent with the frontmatter.

**Minimum viable repair (word-neutral).** Replace the flat assertion and the therapeutic
dramatization with the verified fact plus the reflex the piece has already established. The
verified facts are: Sorkin cast him, the character is called Charlie, and in the trailer he is the
man in the room telling Zuckerberg how the room will read him. That is *still* on-thesis — reading
the room for threat and telling someone they have misjudged how they are about to land is the
identical move the draft traces through Philadelphia, SNL and the billionaires section. The ending
does not need the therapist; it is arguably stronger with the handler.

**Expected benefit.** The closer stops being falsifiable on 2026-10-09, stays on-thesis, and the
body stops contradicting its own FAQ.

**Confidence.** High that the current wording is unsupported; high that it is checkable within the
review window. Moderate on exactly what Charlie does — which is the point: if I cannot establish
it, the draft cannot assert it.

**Acceptance test.** Search the reader-visible body for "crisis counselor" — zero unqualified
occurrences. No sentence in the closer describes an action performed by Burr's character that
cannot be sourced to the released film or to a quoted trailer line. Re-run after 2026-10-09 and the
closer requires no edit.

### FUTURE-R2 — CONCERN — Corpus statistics unstamped on a corpus growing ~25/month

**Passage.** §1 "What is Bill Burr's personality type?" (draft L194):

> Three of the 32 comedians profiled on 9takes are Sixes, 9.4% against a 10.7% baseline across all
> 420 profiles… Type 7 takes 43.8% of the comedian set against 14.3% corpus-wide, the widest gap in
> any category we track.

Repeated in the Rabbit Hole (L372): *"Fourteen of the 32 comedians profiled here are Sevens."*

**Reader effect / trust problem.** Every figure is stated in bare present tense. A 2027 reader who
clicks through to the live corpus page finds different numbers and concludes the article was
sloppy, when in fact it was accurate on 2026-08-19.

**Evidence.** All six figures verify exactly against `src/lib/data/corpus-stats.json`
(`generated_at: 2026-08-19T04:46:01Z`): comedy n=32, Type 6 count 3 (9.38%), Type 7 count 14
(43.75%), corpus 420, Type 6 baseline 10.71%, Type 7 baseline 14.29%. The accuracy is not in
question — the durability is. Same file: `pipeline.avg_new_per_month: 25`,
`published_last_90_days: 75`. At that cadence the corpus is ~720 profiles by August 2027, so "all
420 profiles" is off by roughly 40% at the one-year mark.

Three compounding fragilities:
- **The superlative is the weakest link.** "The widest gap in any category we track" currently
  leads by 3.01pp (comedy Type 7 at +29.46pp vs authors-thinkers Type 5 at +26.45pp). Both
  denominators are tiny (n=32, n=23), so a handful of publications can flip it.
- **Publishing this article narrows that margin by itself.** Adding Burr makes comedy n=33 with
  Sevens at 14/33 = 42.4% against a 14.25% baseline = +28.17pp, cutting the lead over
  authors-thinkers from 3.01pp to ~1.7pp.
- **The article excludes its own subject.** On publish, comedian Sixes go 3 → 4 of 33 (12.1%), so
  "Three of the 32 comedians… are Sixes" is stale immediately, on the page of the fourth.

**Minimum viable repair.** Add one as-of stamp governing the whole passage — the draft already uses
this construction successfully in the FAQ ("58 as of August 2026"). Costs ~4 words. Separately,
either drop "the widest gap in any category we track" (the +29pp figure is striking without the
superlative) or stamp it too; the sentence loses nothing.

**Expected benefit.** The numbers become a dated measurement rather than a standing claim, so they
age into "accurate then" instead of "wrong now," and the superlative stops being a hostage to the
publishing queue.

**Confidence.** High. The growth rate and the current margins are both read directly from the
stats file.

**Acceptance test.** Every corpus-derived figure in the reader-visible body sits inside the scope
of an explicit as-of date. Regenerate `corpus-stats.json` after publishing Burr and confirm no
sentence in the article contradicts the regenerated file.

### FUTURE-R3 — CONCERN — The "next / October" frame decays to false-by-implication

**Passages.** H2 (L383) *"The part Bill Burr plays in October"*; body (L385) *"On October 9, 2026,
Aaron Sorkin's The Social Reckoning **opens**"*; FAQ (L86) *"**What is Bill Burr in next?** …in
theaters October 9, 2026."*

**Reader effect / trust problem.** In August 2027 the heading — which also renders in the TOC, in
the FAQ `anchor`, and potentially in SERP snippets stripped of surrounding context — points at an
October that has already happened, with no year attached. The FAQ question is worse: "what is he in
next" answered with a film ten months in the past is not stale phrasing, it is a wrong answer to
the question asked. Present-tense "opens" for a released film compounds it.

**Evidence.** Wikipedia and Sony confirm 2026-10-09; the packet timeline marks it "scheduled, not
occurred." Review date is 2026-08-19, so the event falls at week 7 of a 52-week window.

**Minimum viable repair.** Put the year in the heading ("…in October 2026"), and change the FAQ
question from a recency frame to a durable one ("What movie is Bill Burr in?"). "Opens" → "opened"
becomes correct at the same refresh.

**Expected benefit.** Heading and FAQ stay true regardless of when they are read; only the verb
tense needs a one-word touch at the twelve-month refresh.

**Confidence.** High.

**Acceptance test.** No reader-visible heading or FAQ question contains a bare relative-time
reference ("next," "October" with no year). Read the page as if it were August 2027 — no sentence
asserts a past event is forthcoming.

### FUTURE-R4 — CONCERN — Unstamped age in the body

**Passage.** Cold open (L151): *"Bill Burr is 58 now."*

**Reader effect / trust problem.** He turns 59 on 2027-06-10 — ten weeks before the one-year mark —
so this is wrong for the tail of the window. The FAQ handles the identical fact correctly ("58 as
of August 2026"), so the body is the outlier.

**Evidence.** Born 1968-06-10 (Wikipedia, packet timeline).

**Minimum viable repair.** "Bill Burr is 58 now" → "Bill Burr turned 58 in 2026" (word-neutral), or
carry the FAQ's as-of construction into the body.

**Expected benefit.** Removes the only hard-wrong-by-a-date claim in the opening paragraph, which
is the paragraph most readers actually finish.

**Confidence.** High.

**Acceptance test.** Set a clock to 2027-08-19; no reader-visible sentence states his age
incorrectly or without an as-of qualifier.

### FUTURE-R5 — CONCERN — Relative arithmetic pinned to publication date

**Passages.**
- Cold open (L153): *"For nineteen years, more than a thousand episodes deep…"*
- Rabbit Hole, wing section (L356): *"…talking, for an hour, every week, for nineteen years."*
- Helicopter section (L297): *"That was 2017, and nine years on the machinery still runs."*

**Reader effect / trust problem.** All three compute against 2026. The podcast launched 2007-05, so
"nineteen years" becomes twenty in May 2027, inside the window. "Nine years on" becomes ten in 2027.
Each is individually trivial; together they are the tell that a reader uses to date a page as stale.

**Evidence.** Packet timeline: MMP launches 2007-05; Ferriss #265 published 2017-09-17.

**Minimum viable repair.** Convert to fixed endpoints, matching the technique the draft already uses
well in "three times over eight years": e.g. "since 2007, more than a thousand episodes deep" and
"That was 2017, and the machinery still runs." Both are word-neutral or shorter.

**Expected benefit.** Three fewer items on every future refresh; the sentences become permanently
correct rather than correct-until-May.

**Confidence.** High.

**Acceptance test.** `grep -nE '\b(nineteen|[a-z]+) years\b'` over the reader-visible body returns
no duration that is computed against the publication year rather than between two stated dates.

### FUTURE-R6 — CONCERN — The strongest section's only sources are two YouTube uploads

**Passage.** The Riyadh table's Aug 10, 2026 row (the dry-mouth quote) and the Rousey "six and a
half" catch, sourced to *Monday Morning Podcast* episodes 8-10-26 and 8-17-26; citations carry the
bare video IDs `8NYGbY4Tmkc` and `yHKqkVqa9mc`.

**Reader effect / trust problem.** These two exhibits carry the piece's most distinctive claims —
the ones no competing page has. Both rest on a single host, on a channel the subject controls, with
no archival snapshot. If either upload is pruned or made private, the best material in the article
becomes unverifiable exactly when a skeptical reader goes looking.

**Evidence.** Packet source ledger [S-07] lists both as YouTube uploads with transcripts re-fetched
2026-08-19. No mirror, archive link, or secondary reporting is recorded for either utterance.

**Minimum viable repair.** Archive both URLs (Wayback / archive.today) and add the snapshot links
alongside the existing citations. No body text changes, no word cost.

**Expected benefit.** The page's two most valuable claims stay checkable independent of the
subject's own channel hygiene.

**Confidence.** Moderate — MMP back-catalogue removal is uncommon, but the downside is
concentrated on precisely the material the draft is proudest of.

**Acceptance test.** Every citation supporting a direct quote resolves to at least one source not
controlled by the subject, or to an archival snapshot.

### FUTURE-R7 — CONCERN — Two status claims with known expiry, one permanently open citation

**Passages.** FAQ (L86): *"He is also touring through 2026 on the 'Bill Burr Live' run."* Body
(L262): the Riyadh festival described as "inaugural." Body: *"That is Burr on Bert Kreischer's
Bertcast"* — no date.

**Reader effect / trust problem.** The tour line expires 2026-12-31 and then advertises a finished
tour as current. "Inaugural" stays accurate even if the festival recurs, but a second edition inside
the window — with or without Burr — is the most likely event to make the Riyadh section feel
unfinished. The undated Bertcast attribution is a permanent soft spot: it never resolves on its own
and gets harder to pin each year.

**Evidence.** Packet timeline lists a 2026-08-30 tour date as "scheduled, not occurred"; packet
dispute #7 bounds the Bertcast episode at ≤2017-11-30 and instructs "attribute to the show, not a
year," which the draft correctly does. Second-pass notes flag it as knowingly open.

**Minimum viable repair.** Tour line → "and continues to tour" or a stamped "as of August 2026."
Bertcast: leave as-is (the draft's handling is correct) but carry it onto the refresh list so a
future pass can pin it if the episode gets indexed.

**Expected benefit.** No claim on the page advertises a completed tour as upcoming.

**Confidence.** High on the tour line; low-moderate on the Riyadh recurrence, which is a watch item
rather than a defect.

**Acceptance test.** No reader-visible sentence describes a scheduled event in the present or future
tense once its date has passed.

## Specific improvements

Ordered by priority. **Constraint the editor must respect:** the COHESION PASS note records the body
at exactly the 4,500-word ceiling with "zero headroom." Every repair below is therefore specified as
word-neutral or word-negative; none requires a funding cut.

1. **Rewrite the closer off the trailer's verified content** (FUTURE-R1). Keep "Charlie," keep
   Sorkin, keep the driveway callback; drop the unsupported "crisis counselor" and the invented
   therapeutic scene. Word-neutral. *Acceptance:* closer needs no edit after 2026-10-09.
2. **Add one as-of stamp to the §1 statistics paragraph and drop or stamp "the widest gap in any
   category we track"** (FUTURE-R2). ~4 words in, ~8 out if the superlative goes. *Acceptance:*
   regenerated `corpus-stats.json` post-publish contradicts nothing on the page.
3. **Year the closing H2 and de-recency the FAQ question** (FUTURE-R3). Word-neutral.
4. **Fix the three relative-duration constructions and the unstamped age** (FUTURE-R4, R5).
   Word-neutral or shorter.
5. **Archive the two MMP YouTube sources and add snapshot links to `citations`** (FUTURE-R6).
   Zero body words.
6. **Stamp or soften the tour line** (FUTURE-R7). Word-neutral.

### Twelve-month refresh list (next review due ~2027-08-19; first checkpoint 2026-10-16)

| When | Item | Action |
| --- | --- | --- |
| **2026-10-16** (1 wk post-release) | *The Social Reckoning* — Charlie's actual role | Verify against the released film; correct the closer; "opens" → "opened" |
| 2026-10-16 | FAQ "What is Bill Burr in next?" | Re-point to the next scheduled project |
| 2027-01 | "touring through 2026" | Update to the 2027 run or remove |
| 2027-01 | Corpus stats (420 / 32 / 9.4% / 43.8% / superlative) | Re-read `corpus-stats.json`; re-stamp; re-check the superlative still holds |
| 2027-05 | "nineteen years" (×2) — MMP anniversary | Becomes twenty; better, convert to "since 2007" now |
| 2027-06-10 | "Bill Burr is 58" | Becomes 59 |
| Watch | Riyadh Comedy Festival second edition; Burr's participation or absence | One sentence if it materially changes the section |
| Watch | Bertcast episode date | Pin if it ever gets indexed |
| Standing | MMP YouTube sources `8NYGbY4Tmkc`, `yHKqkVqa9mc` | Confirm still live; rely on archives if not |

**What survives if the newest event is removed entirely.** Delete the closer, the tour line and the
2026 podcast episodes and roughly 90% of the page is intact: the driveway, the three-tellings
structure, Philadelphia, SNL, the helicopter, therapy, the billionaires turn, and the whole Type 6
argument. The 2026 material is genuinely appendix rather than foundation — with the single exception
of the Riyadh table's second row, which is load-bearing and correctly dated. That is the right
architecture; the closer is the only place it breaks.

## Follow-on questions

- **FUTURE-Q1. What does Charlie actually do in *The Social Reckoning*?** If he is a PR/comms
  adviser, the closer must be rewritten (and is arguably improved — the adviser reading maps onto
  the draft's own "tell the group it misidentified the threat" thesis). If a released-film synopsis
  genuinely supports a counseling role, the current closer survives with a source added. *Best
  source:* the film itself after 2026-10-09; before that, Sony's official synopsis or production
  notes, which supersede trailer inference.
- **FUTURE-Q2. Will "the widest gap in any category we track" still be true at the next refresh?**
  If authors-thinkers overtakes comedy, the superlative must go. *Best source:* regenerate
  `src/lib/data/corpus-stats.json` and compare `top_over_represented.delta_pp` across domains;
  today's margin is 3.01pp and publishing Burr alone cuts it to ~1.7pp.
- **FUTURE-Q3. Does the Riyadh Comedy Festival recur, and does Burr return?** A second appearance
  would make the Aug 2026 dry-mouth account read as a prelude rather than a retrospective and would
  need one sentence; a conspicuous absence is also evidence. *Best source:* festival announcements
  and Burr's own MMP episodes, which is where he reliably self-documents first.
- **FUTURE-Q4. Does *Drop Dead Years* accumulate awards language that ages the "Emmy-nominated"
  descriptor?** Checked this review: the 2025 Emmys produced nominations, not wins, so
  "Emmy-nominated" is currently correct and durable. A later Grammy outcome for the *Drop Dead
  Years* album (nominated Nov 2025) could add a descriptor but does not invalidate anything on the
  page. *Best source:* Television Academy and Recording Academy records. **No action required —
  logged so a future reviewer does not re-litigate it.**

## Preserve list

Do not touch these during revision; they are the reason the page ages well.

1. **The Riyadh two-date table**, including the explicit "Oct 2025" / "Aug 10, 2026" column. The
   dating *is* the argument. Any rewrite toward "recently" or "more recently" destroys it.
2. **"That is the reflex. It does not settle whether Cross is right about the money."** The one
   sentence that immunizes the page against every possible development in an unresolved
   controversy.
3. **"He has said it three times over eight years, in three formats, in nearly the same words."**
   Correct durable-time construction; also the model the three broken duration phrases should be
   rewritten to match.
4. **Dated attribution on every quote** ("he told The Hollywood Reporter in 2022," "On NPR's Fresh
   Air on March 10, 2025," "On the August 17, 2026 Monday Morning Podcast"). Do not compress these
   to save words for other edits.
5. **The FAQ's "58 as of August 2026" construction.** It is the in-house precedent for the as-of
   stamps recommended in FUTURE-R2 and R4 — the fix already exists in the document.
6. **"What would change our mind"** in the Rabbit Hole. A falsifiability clause is durability
   infrastructure: it tells a 2027 reader what new evidence would matter, so new evidence updates
   the page instead of embarrassing it.

## Research log

Packet read in full before any role-specific research, per protocol.

| # | Question | Source | Decision it affected |
| --- | --- | --- | --- |
| 1 | Is Burr's *Social Reckoning* role established? | `evidence-packet.md` dispute #5 (packet reused, no search needed) | Established that the packet already forbade the therapeutic reading — escalated FUTURE-R1 toward blocker |
| 2 | How fast does the corpus that §1 cites actually grow, and do the figures verify? | `src/lib/data/corpus-stats.json` (repo, `generated_at` 2026-08-19T04:46Z) | All six figures verified accurate; `avg_new_per_month: 25` and the 3.01pp superlative margin established FUTURE-R2 as a durability rather than accuracy finding |
| 3 | Does publishing Burr change his own article's statistics? | `corpus-stats.json` domain labels (`comedy.raw_labels: ["comedian"]`) vs draft frontmatter `type: ['comedian', …]` | Confirmed comedy 32→33 and Sixes 3→4 on publish; added the self-exclusion point to FUTURE-R2 |
| 4 | Did *Drop Dead Years* win a 2025 Emmy, making "Emmy-nominated" stale? | Web search → Television Academy / IMDb awards | **No** — nominations only. "Emmy-nominated" is durable. Finding dropped; logged as FUTURE-Q4 so it is not re-checked |
| 5 | Is 2026-10-09 still the release date, and how is Burr's character described? | Web search → TheWrap / Deadline / Rolling Stone / Boston Globe trailer coverage | Date holds. Role described as "Charlie, an advisor of a sort to Zuckerberg," trailer line about congressional testimony and likability — contradicts "crisis counselor" |
| 6 | Does any authoritative cast listing assign Burr an occupation? | WebFetch → Wikipedia, *The Social Reckoning* | Cast line is exactly "Bill Burr as Charlie," no occupation; film unreleased. **Confirmed FUTURE-R1 as a blocker** |

Sources consulted beyond the packet: 3 (two searches, one fetch) — within the 2–4 budget; the third
was spent under the potential-factual-blocker allowance to pin FUTURE-R1 before promoting it.

## Limits of this review

- **I audited only the frozen snapshot** at `draft-reviewed.md`, SHA-verified
  `c279d288f1395a0b96ec6c208186b19926202e563247907ae81fbfd50b37a55c` against `context.json` and the
  supplied `--draft-sha`. I did not read the live draft or any sibling review.
- **I did not invent future events.** Every claim about 2027 is arithmetic on dates already in
  evidence (birthday, podcast launch, release date, tour end) or on a growth rate read from the
  repo. The Riyadh-recurrence item is flagged as a watch item precisely because I cannot know it.
- **I cannot resolve FUTURE-R1 myself.** The film is unreleased. I established that the draft's
  claim exceeds the available evidence and contradicts its own research packet; I did not establish
  what Charlie does. The 2026-10-16 checkpoint exists for that reason.
- **Corpus projections are extrapolation.** "~720 profiles by August 2027" assumes
  `avg_new_per_month: 25` holds. The direction is certain (136 drafts are queued); the magnitude is
  not.
- **Durability is my only lens.** I did not assess the Type 6 argument's correctness, the fairness
  of the Riyadh treatment, prose quality, or SEO. Several passages I marked "preserve" are endorsed
  for their temporal properties alone — the subject, critic and enneagram perspectives may
  reasonably reach different conclusions about the same sentences.
- **HTML comment ledgers are not reader-visible** and I graded them only as evidence of process
  (they surfaced the word-ceiling constraint and the "current-tense anchor" intent). No finding
  depends on them.
