---
artifact: perspective-review
schema_version: 1
subject: Marcus-Aurelius
perspective: future
draft_sha256: ae7bb1e099eb106f3632101f66368088b49c3b66fd20073a3b5edbb109c9a645
review_status: complete
trust: intact
value: high
delight: clear_hit
recommendation: revise
blockers: 0
concerns: 6
reviewed_at: 2026-08-27T07:22:53Z
path: docs/content-analysis/perspective-reviews/Marcus-Aurelius/2026-08-27_020004/future.md
---

## Bottom-line verdict

Twelve months from now this page will be almost entirely intact, and the reason is structural: the
subject has been dead 1,846 years, the argument runs on two document archives, and the editions of
record are 1862, 1919 and 1920. I ran the standard durability sweep for relative time language and
came back nearly empty — this draft dates things absolutely, holds open disputes it cannot settle,
and never leans on a news cycle. Strike every sentence on the page that refers to anything after 1920
and the thesis does not move.

The perishable material is not about Rome. It is about 9takes. One sentence hardcodes the site's own
corpus counts, and those counts are regenerated from the database on every Vercel deploy. That
sentence is accurate today and will be wrong the day the page publishes — because this page is itself
an unpublished Type 1 profile, so shipping it makes the corpus 427 and Type 1s 27. Within twelve
months, at the site's own measured cadence, the denominator will understate reality by roughly 40%.
There is a live precedent in the corpus already.

Second durability problem, and the one no fact-check would catch: the page has about eight words of
headroom under the lint ceiling, and it carries a deferred cross-link that requires adding words. A
page that cannot be edited is a page that will not be refreshed.

Recommendation is `revise`, not `hold`. Every repair below is word-neutral or word-saving, and the
highest-priority one is a five-word deletion.

## What landed

**FUTURE-H1 — The dating discipline is close to exemplary.** I grepped the whole draft for the usual
decay markers (`recently`, `currently`, `now`, `today`, `upcoming`, `latest`, `as of`) and found no
reader-visible offender that carries a factual load. Instead the page does this everywhere:

> "In 162 AD the emperor of Rome took four days off at Alsium"

> "Antoninus Pius died on 7 March 161."

> "In George Long's 1862 translation, Book 5 carries an instruction he apparently needed"

> "printed at page 217 of the 1919 Loeb Classical Library edition"

> "PolitiFact had to fact-check one of the most viral of them in September 2019"

Every one of those is a fixed point. None of them needs revisiting in twelve months, twelve years, or
ever. This must survive revision because it is the single largest reason the page is durable, and it
is the easiest thing for a later editor to sand off while "tightening" prose.

**FUTURE-H2 — Open disputes are held open, which makes them unfalsifiable by future scholarship.**

> "Ancient sources disagree about whether it was at Vindobona, modern Vienna, or at Sirmium, and the
> dispute has never been settled."

> "It does not resolve, and it should not be smoothed over."

> "Whether Marcus had a real alternative is genuinely disputed."

This is the highest-value durability behaviour available to a historical page, and the draft does it
three separate times. A page that says "unresolved" cannot be made wrong by a resolution; it can only
be made _more_ interesting. If Lyon or Commodus historiography moves in either direction over the next
year, this page is still correct, because it never picked. Preserve the refusals verbatim — the
temptation on a later pass will be to firm them up into a verdict.

**FUTURE-H3 — The thesis passes the remove-the-newest-event test cleanly.** I ran the swap
deliberately: delete the PolitiFact sentence, the airport-bookstore line, the Stoicism-industry
framing, the _Gladiator_ clause and the corpus stat, and what remains is

> "Thirty-three years, two languages, two readers, one report."

which rests entirely on Fronto's letters and _Meditations_. No current event is load-bearing. The
modern-reception material is correctly positioned as an appendix to the argument rather than evidence
for it — the closing section uses the misquotation industry to frame _how he is read now_, never to
prove what he was. That ordering is exactly right and must not be inverted by a later pass that tries
to "seed the PolitiFact fake earlier" for hook reasons.

**FUTURE-H4 — The citation set is archival rather than newsy.** Wikisource, LacusCurtius, Standard
Ebooks, New Advent, Wikipedia, one PolitiFact item, one university-press essay. I fetched the two most
rot-prone URLs in the frontmatter and both resolve today (see Research log). There is no dependence on
a publication that could paywall, restructure or delete the underlying story. Compared to a
living-subject page in this corpus, the link-rot exposure here is near zero.

## What missed

**The page is temporally careful about Rome and careless about itself.** Every durability failure I
found is in material describing 9takes, the site, rather than Marcus, the subject. That inversion is
the finding. Details in Red flags and Specific improvements; the diagnosis is that the draft applied
its dating discipline only to history and treated internal site metadata as if it were a constant.

**Certainty outruns two sources in ways that will not age well.** In two places the draft states
something more firmly than the citation behind it supports — the plague toll (pinned to a Wikipedia
infobox that the same article's body contradicts) and the "appears nowhere in the book" absolute
(stronger than the fact-check it cites, which I fetched and which hedges). Neither is wrong today.
Both are the shape of claim that gets challenged later, and neither needs to be that strong to do its
job.

**Maintainability was not designed in.** No "as of" marker anywhere, no update note, effectively no
word budget, and the one known future action item lives inside an HTML comment in the file. The page
was built to be correct at launch rather than to be refreshed.

## What I expected

- **Absolute dates on every temporal claim.** Got it, comprehensively. This is the expectation the
  draft most exceeds.
- **An "as of" qualifier on any number describing the site itself.** Absent. Every other number on the
  page is anchored to a year; the one internal statistic is anchored to nothing.
- **Refresh headroom.** A page at the top of its word ceiling has nowhere to put next year's
  correction. I measured 4,492 reader-visible body words against the 4,500 ceiling in
  `scripts/blog-lint.sh:354` — about eight words of room.
- **The deferred cross-link tracked somewhere durable.** REVIEWER NOTES 1 correctly defers the Ryan
  Holiday inline link and I verified the deferral is right (`famousTypes.ts:40` has
  `ryan-holiday link: false`; `src/blog/people/drafts/Ryan-Holiday.md` is `published: false`). But the
  instruction to revisit it exists only as a comment inside the draft, which is the least likely place
  anyone will look in twelve months.
- **Disputes left unresolved.** Got it, three times over.

## What surprised me

**Welcome:** this is close to the best-case durability profile the people corpus can produce, and the
draft knows it. Choosing two first-person archives separated by three decades as the evidentiary spine
is not just a good argument, it is a _durable_ one — neither archive can be revised, retracted, or
walked back on a podcast. Living subjects generate new counterevidence weekly. This one cannot.

**Jarring:** the most perishable sentence on a page about a second-century emperor is the sentence
about 9takes. The only force that will make this page inaccurate is the site's own publishing
velocity. That is an unusual failure mode and worth naming for the whole corpus, not just this draft.

**Unexpected structural risk:** the draft's own second-pass note concludes "There is no room for a
third pass that adds anything," and my independent word count confirms it. I did not expect
_un-editability_ to be the durability problem. It is arguably a bigger twelve-month risk than any
individual fact, because it converts every future correction into a restructuring job.

## Red flags

**Blockers: 0.** I found no material factual error, quote distortion, or already-misleading temporal
claim in my lane, and I am not going to manufacture one. The nearest candidate is FUTURE-C1, and I
want to be precise about why it falls short of a blocker: the corpus sentence is _accurate as of the
snapshot_. I verified it independently against `src/lib/data/corpus-stats.json` (generated
2026-08-26): 426 published, Type 1 = 26, and 26 is the lowest count of any type. It is a claim that
becomes misleading, not one that is misleading. That is a concern.

Concerns, ranked by twelve-month impact:

| ID        | Concern                                                                                                          | Confidence  |
| --------- | ---------------------------------------------------------------------------------------------------------------- | ----------- |
| FUTURE-C1 | Hardcoded corpus counts are wrong on publication day and ~40% stale in twelve months                             | high        |
| FUTURE-C2 | ~8 words of refresh headroom plus a deferred to-do that requires adding words                                    | high        |
| FUTURE-C3 | Plague figure pinned to a mutable Wikipedia infobox its own article body contradicts; second use drops the hedge | medium-high |
| FUTURE-C4 | "Appears nowhere in the book" is a stronger absolute than the cited fact-check supports                          | medium-high |
| FUTURE-C5 | Two unsourced superlatives are ranking claims with no measurement behind them                                    | medium      |
| FUTURE-C6 | Bare film title is losing its referent to a sequel                                                               | medium      |

Note for the synthesist: I deliberately did not evaluate the packet's flagged issues on Avidius
Cassius (CLM-01), the unnamed "man" who supplied the Epictetus discourses (CLM-02), or the
"four of them before he was ever emperor" arithmetic (CLM-13). Those are real and they belong to the
critic, unfamiliar-reader and subject lanes. My `trust: intact` verdict is scoped to temporal
durability only and should not be read as clearing them.

## Specific improvements

### FUTURE-C1 — Delete the hardcoded corpus counts, keep the claim and the link

- **Passage:** Rabbit Hole → "Counterarguments: Why Marcus Aurelius Might Not Be Type 1":
  "Type 1 is also the rarest read in the 9takes corpus, 26 of 426 published profiles
  ([corpus stats](/corpus-stats))."
- **Reader effect / trust problem:** the prose hardcodes a number immediately beside a link to the page
  that regenerates that number. A reader who follows the link sees a different figure than the one
  they just read, in the section whose entire job is showing the argument's limits. Being visibly
  wrong about your own database undercuts a page that has just spent 4,000 words being careful about
  the second century.
- **Evidence:** `scripts/generate-corpus-stats.js` rebuilds `corpus-stats.json` from Supabase
  (`published === true`) and is wired into `build:vercel` in `package.json:9` — it refreshes on
  **every deploy**, while the prose does not. The site's own measured cadence in that file is
  `avg_new_per_month: 24.7`, `published_last_30_days: 33`, with `in_draft: 138` already queued. Git
  history of the same file: 292 published on 2026-04-16 → 426 on 2026-08-26 (+134 in 4.3 months).
  Twelve-month projection: roughly 720–820 published. Separately, Marcus is himself a Type 1 awaiting
  publication, so shipping this page makes the true figure 27 of 427 — the sentence is off by one on
  day one. **Live precedent:** `src/blog/people/drafts/Benny-Blanco.md` is `published: true`, dated
  2026-07-19, and says "Of the 68 musicians profiled on 9takes, 26 type as Fours… Only four type as
  Twos." Today's stats: 79 musicians, 30 Fours, 5 Twos. Three wrong numbers on a live page in five and
  a half weeks. `Jeff-Goldblum.md` has the same problem ("56 Sevens among the 373 people we have
  profiled"; actual today: 61 and 426).
- **Minimum viable repair:** drop the raw counts and let the link carry them, using the numberless
  construction already in the corpus at `src/blog/people/drafts/Liang-Wenfeng.md` ("Type 5 remains
  over-represented among the site's tech founders and executives, while Type 3 remains the largest
  group ([corpus stats](/corpus-stats))"). Here: "Type 1 is also the rarest read in the 9takes corpus
  ([corpus stats](/corpus-stats))." Saves five words.
- **Expected benefit:** the claim stays true as the corpus grows, the live number stays one click
  away, and five words go back into the budget for FUTURE-C2.
- **Confidence:** high on the drift; high on the repair.
- **Acceptance test:**
  `grep -nE '[0-9]+ of [0-9]{3} published profiles' src/blog/people/drafts/Marcus-Aurelius.md`
  returns nothing, and the same sentence still contains `(/corpus-stats)`.
- **Caveat for the editor:** "rarest" is itself a ranking with a three-profile margin (Type 1 = 26,
  Type 2 = 29). It held from 2026-05-13 (23 vs 25) to now, so the trend is stable, but if you want a
  claim that cannot flip at all, use "among the rarest reads."

### FUTURE-C2 — Bank refresh headroom now, and move the deferred link out of the comment

- **Passage / location:** whole-document budget, plus REVIEWER NOTES 1 in the frontmatter comment
  block.
- **Reader effect / trust problem:** no direct reader effect today. The problem is that the twelve-month
  refresh — the thing my lane exists to plan for — is blocked before it starts. Whoever picks this up
  must cut before adding, and the one known pending action is buried in an HTML comment.
- **Evidence:** I measured 4,492 reader-visible body words (frontmatter and HTML comments stripped)
  against `BODY_WORD_CEILING="${BLOG_LINT_WORD_CEILING:-4500}"` at `scripts/blog-lint.sh:354`. The
  warn line is 90% (4,050), so the page currently trips "thin headroom for the next refresh." The
  deferred action is real: `famousTypes.ts:40` shows `{ name: 'ryan-holiday', link: false … }` and
  `Ryan-Holiday.md` is `published: false`, so the deferral is correct _now_ — but when Holiday ships,
  an inline link must go into a page with eight words of room.
- **Minimum viable repair:** take the C1 cut (−5), the C3 cut (−2) and the C4 cut (−1), and retire one
  of the duplicate marquee-quote appearances flagged inside the draft's own notes — the Ariston
  "penance… starve myself" line runs in the epigraph, FAQ 1, the timeline, the diagnosis section and
  the subtype paragraph. Dropping one in-body repetition banks 30–40 words. Then move the Ryan Holiday
  action into wherever cross-link debt is actually tracked (`docs/content-analysis/entity-gaps/` or the
  backlog queue) rather than leaving it in the draft comment.
- **Expected benefit:** next year's refresh becomes a ten-minute edit instead of a restructuring job,
  and the Holiday cross-link gets done when Holiday ships rather than whenever someone rereads a
  comment.
- **Confidence:** high on the measurement; medium on the Holiday timing, which I cannot know.
- **Acceptance test:** `bash scripts/blog-lint.sh` on the draft reports a body-length line with at
  least 50 words of clearance below 4,500 (i.e. ≤ 4,450), and a grep for `Ryan.Holiday` finds the
  action item in a tracked doc outside `src/blog/people/drafts/Marcus-Aurelius.md`.

### FUTURE-C3 — Hedge the second plague figure; it is pinned to a mutable infobox

- **Passages:** spine — "the Antonine Plague, which broke out in 165 or 166, is estimated to have
  killed five to ten million people"; holiday section — "the plague is killing five million of the
  people he was handed."
- **Reader effect / trust problem:** the first use is properly hedged. The second states as flat fact
  a figure sitting at the bottom of a range that spans an order of magnitude.
- **Evidence:** evidence packet CLM-12 / S-11. The draft's "five to ten million" matches the Wikipedia
  infobox; the same article's body gives "between 1.5 and 25 million people" (2–33% of population),
  notes most estimates coalesce near 10% (~7.5 million), records historians arguing for "a less than
  catastrophic outcome," and states there is no genetic evidence identifying the pathogen. The
  durability issue is specific: the URL will not rot, the _content_ will move. Infoboxes are edited
  without notice and this is an unsettled, actively researched question.
- **Minimum viable repair:** keep the first use's "is estimated to have"; change the second to "the
  plague is killing millions of the people he was handed." Saves two words.
- **Expected benefit:** the sentence survives any plausible revision of the estimate, and the
  rhetorical work — scale, pressed against one man's refusal to rest — is unchanged.
- **Confidence:** medium-high.
- **Acceptance test:** `grep -n "five million" src/blog/people/drafts/Marcus-Aurelius.md` returns
  nothing, or only instances carrying an estimate hedge.

### FUTURE-C4 — Attribute the absence instead of asserting it

- **Passage:** "The Book He Never Meant Anyone to Read" — "PolitiFact had to fact-check one of the
  most viral of them in September 2019, a line about opinion and perspective that appears nowhere in
  the book."
- **Reader effect / trust problem:** an absolute negative is the most challengeable form of claim, and
  it sits in the page's most quotable section — the part most likely to be excerpted onto a card and
  argued with.
- **Evidence:** I fetched the cited fact-check. It is live, dated 26 September 2019, rated False — the
  draft's date and framing are right. But it hedges where the draft does not: the author "didn't find
  the quote searching an online version of the book," a philosophy professor calls it "just vaguely
  possible" the line is "a highly creative" translation or paraphrase, and an older translation carries
  related material about opinion and perception. Packet S-13 flags the same gap.
- **Minimum viable repair:** "…a line about opinion and perspective that no one has been able to find
  in the book." Or shorter: "…that PolitiFact rated False." Saves one word.
- **Expected benefit:** the point — he is quoted saying things he never wrote — is fully preserved, and
  becomes something a commenter cannot dislodge with one counter-citation.
- **Confidence:** medium-high.
- **Acceptance test:** the sentence no longer asserts absence as established fact; it attributes the
  finding to the fact-check or to the failed search.

### FUTURE-C5 — Soften two unsourced superlatives (low priority)

- **Passages:** intro — "**Meditations**, is the most durable self-help text in the Western canon";
  closing section — "The most reproduced philosophy book in the world has a war for a return address."
- **Reader effect / trust problem:** two different superlatives for the same book on one page, neither
  measured. Rankings are checkable and they age.
- **Evidence:** packet CLM-18, status "interpretation — no supporting source located," and research
  limitation 10: "No sales, print-run, or circulation data located for any superlative about
  _Meditations_' standing."
- **Minimum viable repair:** "one of the most durable self-help texts in the Western canon" and "One of
  the most reproduced philosophy books in the world." Net +3 words, payable from the C1/C2 savings.
- **Expected benefit:** removes two claims that can be contested without weakening either sentence's
  rhythm.
- **Confidence:** medium. This is the closest thing to preference in my list; treat it as optional if
  budget is tight.
- **Acceptance test:** no bare "the most X in the world/canon" construction remains about _Meditations_.

### FUTURE-C6 — Year the film title (low priority)

- **Passage:** Commodus section — "one modern audiences know mostly through **Gladiator**, which
  invented its own version of his father's death."
- **Reader effect / trust problem:** the unyeared title is now ambiguous and gets more so, since the
  franchise has a 2024 sequel. A reader in twelve months may check the wrong film.
- **Evidence:** the sequel's existence; packet research limitation 8 notes the film's content was not
  independently verified for this claim.
- **Minimum viable repair:** "**Gladiator** (2000)". One word.
- **Expected benefit:** fixes the referent permanently at trivial cost.
- **Confidence:** medium.
- **Acceptance test:** the film reference carries a year.

### Twelve-month refresh list (check on or before 2026-08-27 + 1 year)

1. **Corpus claim.** Re-check `src/lib/data/corpus-stats.json`: is Type 1 still the rarest count?
   (Margin today is 3: T1 = 26, T2 = 29.) If C1's repair was applied there is nothing to edit; if it
   was not, the number is stale by roughly 300 profiles.
2. **Ryan Holiday cross-link.** If `Ryan-Holiday.md` is `published: true` and `famousTypes.ts` shows
   `link: true`, add the inline body link and add Marcus to Holiday's `suggestions`. Requires ~15 words
   of budget — see C2.
3. **Antonine Plague figure.** Re-check the Wikipedia infobox against the draft's number. If C3's
   repair was applied, this is a no-op.
4. **PolitiFact link.** Confirm the fact-check still resolves (it does today). If it has moved, the
   sentence should name the finding rather than the outlet.
5. **Word budget.** Re-run `scripts/blog-lint.sh` and confirm the page is not against the ceiling
   before attempting any addition.
6. **Nothing else.** Items 1–5 are the complete list. No historical claim on this page has a
   twelve-month expiry, which is the point.

## Follow-on questions

**FUTURE-Q1 — Is the hardcoded-corpus-stat problem systemic, and is there a lint rule for it?**
_What would change:_ whether C1 is a one-page fix or a corpus-wide class fix. I already found two other
drafts with the same defect, one of them published and already wrong (`Benny-Blanco.md`) and one
unpublished and already wrong (`Jeff-Goldblum.md`). If no rule exists, a grep-based lint check for
patterns like `[0-9]+ of [0-9]+ published profiles` and `[0-9]+ (people|profiles) we have profiled`
would catch the whole class for the cost of a few lines.
_Best source:_ `scripts/blog-lint.sh`, plus `grep -rlE '\(/corpus-stats\)' src/blog/people/drafts/`
(8 files today).

**FUTURE-Q2 — When is `Ryan-Holiday.md` expected to publish?**
_What would change:_ whether the deferred cross-link is a pre-publish task or a genuine twelve-month
refresh item, and therefore how much headroom must be banked now.
_Best source:_ `docs/blog-automation/backlog-queue.json` and the content board.

**FUTURE-Q3 — Does the site intend page-level "as of" markers for internal statistics?**
_What would change:_ if yes, C1's repair could keep the numbers with a date stamp rather than deleting
them, preserving the concrete detail. If no, deletion is correct.
_Best source:_ DJ, or existing convention — `Liang-Wenfeng.md` suggests the house answer is
"numberless prose plus a link."

**FUTURE-Q4 — Is there an archival snapshot policy for the primary-source URLs?**
_What would change:_ nothing this year — all citations resolve today and are archival-grade. But
LacusCurtius is a single-maintainer academic site with no stated institutional preservation guarantee,
and four of the seven `citations` entries depend on it or on Wikisource. If the corpus is going to lean
on these repeatedly, a snapshot policy is cheap insurance.
_Best source:_ the source ledger convention in `docs/content-analysis/`.

## Preserve list

Quoted passages that must survive revision, with the durability reason:

1. > "Ancient sources disagree about whether it was at Vindobona, modern Vienna, or at Sirmium, and the
   > dispute has never been settled."

   The model sentence for the whole corpus. It cannot be falsified, and if the dispute ever _is_
   settled the page is still honest about the state of knowledge when written.

2. > "It does not resolve, and it should not be smoothed over."

   Lyon 177 is the page's most contested material and this is the only stance that survives movement in
   either direction. Any later pass that converts this into a verdict destroys the durability.

3. > "Thirty-three years, two languages, two readers, one report."

   The thesis, and it depends on nothing after 1920. This is what remains when every recent sentence is
   removed.

4. > "In George Long's 1862 translation, Book 5 carries an instruction he apparently needed"

   And its siblings: "printed at page 217 of the 1919 Loeb Classical Library edition," "Loeb Classical
   Library vol. 1, 1919." Edition-of-record attribution is what makes every quotation on this page
   independently checkable forever. A later editor tightening prose will be tempted to cut these as
   clutter. They are the opposite of clutter.

5. > "In 162 AD the emperor of Rome took four days off at Alsium, a seaside town up the coast from the
   > capital."

   A cold open built on a dated second-century letter cannot go stale. Compare the alternative most
   people pages reach for — a recent interview or a current controversy — which decays within a year.

6. > "He was fifty-four, and he had been at it since he was twenty-five, and he was still marking the
   > same paper."

   The close resolves on ages and documents, not on legacy or relevance. Nothing in it can be
   overtaken by events.

## Research log

Packet read before role-specific research, per protocol. Two external fetches used of the 2–4 allowed.

| #   | Source                                                  | Question it answered                                           | Decision it affected                                                                                                                                                                                             |
| --- | ------------------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `shasum -a 256` on the snapshot + `context.json`        | Does the frozen draft match the supplied SHA?                  | `ae7bb1e0…` matched both; audit proceeded on the snapshot only                                                                                                                                                   |
| 2   | Grep of the draft for relative-time markers             | Does the prose carry undated relative language?                | Came back effectively clean → FUTURE-H1; ruled out the most common durability blocker                                                                                                                            |
| 3   | `src/lib/data/corpus-stats.json` (generated 2026-08-26) | Is "26 of 426" accurate right now?                             | Verified accurate (426 published; T1 = 26, lowest; next lowest T2 = 29) → C1 classified **concern, not blocker**                                                                                                 |
| 4   | Git history of `corpus-stats.json`                      | How fast does the denominator move?                            | 292 on 2026-04-16 → 426 on 2026-08-26; and 331/T1=23/T2=25 on 2026-05-13 → C1 drift projection and the "rarest" margin caveat                                                                                    |
| 5   | `pipeline` block of the same file                       | The site's own measured cadence                                | `avg_new_per_month: 24.7`, `published_last_30_days: 33`, `in_draft: 138` → the ~720–820 twelve-month projection                                                                                                  |
| 6   | `scripts/generate-corpus-stats.js` + `package.json:9`   | Does the linked page auto-update while the prose does not?     | Confirmed: regenerated from Supabase on every `build:vercel` deploy → the prose/link divergence framing in C1                                                                                                    |
| 7   | Cross-draft grep of `src/blog/people/drafts/`           | Is this defect precedented?                                    | `Benny-Blanco.md` (published, 2026-07-19) has three already-wrong numbers; `Jeff-Goldblum.md` likewise. `Liang-Wenfeng.md` uses numberless phrasing → supplied both the evidence and the in-house repair pattern |
| 8   | `famousTypes.ts:40`, `Ryan-Holiday.md` frontmatter      | Is the deferred cross-link deferral currently correct?         | `link: false` and `published: false` → deferral is right today; becomes a tracked future action → C2                                                                                                             |
| 9   | Word count of the snapshot + `scripts/blog-lint.sh:354` | How much refresh headroom exists?                              | 4,492 vs 4,500 ceiling (warn line 4,050) → C2, and constrained every repair above to word-neutral or word-saving                                                                                                 |
| 10  | Evidence packet CLM-12 / S-11                           | How firm is the plague toll?                                   | Infobox 5–10M vs body 1.5–25M, no genetic evidence → C3                                                                                                                                                          |
| 11  | Evidence packet CLM-18 + research limitation 10         | Is either superlative measured?                                | No supporting source located → C5                                                                                                                                                                                |
| 12  | **WebFetch** — PolitiFact fact-check (cited URL)        | Is it live, and does it support "appears nowhere in the book"? | Live; 26 Sep 2019; rated False — but hedged ("didn't find the quote searching an online version"; "just vaguely possible" it is a creative paraphrase) → C4                                                      |
| 13  | **WebFetch** — Yale UP essay (cited URL)                | Is the most rot-prone frontmatter citation still live?         | Live (Robertson, 20 Mar 2024) → downgraded link-rot risk; supported FUTURE-H4                                                                                                                                    |

## Limits of this review

- **I am a temporal-durability proxy, not a classicist.** I adjudicated no ancient-history fact. The
  packet's flagged issues on Avidius Cassius (CLM-01), the unnamed source of the Epictetus discourses
  (CLM-02), the "four of them before he was ever emperor" arithmetic (CLM-13) and the 22/55/33-year
  internal inconsistency (CLM-14) are real and belong to other lanes. My `trust: intact` is scoped to
  durability and must not be read as clearing any of them.
- **I did not invent future events.** Every projection is an extrapolation from the repository's own
  measured publishing cadence, labeled as such. The 720–820 figure assumes the current rate continues;
  a pause would slow the drift but not reverse it, since 138 drafts are already queued.
- **Two URLs checked, not seven.** I tested the two I judged most rot-prone. I did not attempt archival
  snapshots and did not verify the Wikisource or LacusCurtius URLs directly, relying on the packet's
  record that they were used successfully on 2026-08-27.
- **The Wikipedia-content-drift risk in C3 is a prediction, not an observation.** I did not diff the
  article's revision history; I inferred mutability from the packet's record that the infobox and body
  already disagree.
- **Prior-review contamination, disclosed.** The snapshot embeds a fresh-eyes review and second-pass
  notes as HTML comments inside the file I was instructed to audit, so I read them in the course of
  reading the draft. I did not adopt their findings: every number in this review (the word count, the
  corpus figures, the cadence, the drift history, the precedent drafts) was independently derived from
  the repository or fetched live, and my two headline concerns — corpus-stat rot and zero refresh
  headroom — were reached from measurement. Where I reached the same conclusion as the embedded notes
  on the word budget, treat it as independent confirmation rather than agreement.
- **Publication timing is unknown to me.** The off-by-one in C1 assumes this page publishes as a Type 1
  profile before the next corpus-stats regeneration. If it publishes in the same deploy that
  regenerates the stats, the sentence is wrong by one immediately; if the number is refreshed first, it
  is wrong by more.
