---
artifact: perspective-review
schema_version: 1
subject: Charlize-Theron
perspective: future
draft_sha256: 1d74c2c827e026895d7102699b8a14eac37d524dd57f3e62010c7af61a5e9798
review_status: complete
trust: strained
value: high
delight: clear_hit
recommendation: revise
blockers: 2
concerns: 9
reviewed_at: 2026-08-17T07:14:39Z
path: docs/content-analysis/perspective-reviews/Charlize-Theron/2026-08-17_020004/future.md
---

## Bottom-line verdict

Read from 17 August 2027, this piece is in better shape than most celebrity profiles, and it fails in one specific, correctable way: **the argument is durable and the architecture is not.** The spine — unpredictable house → seize the controls — is built almost entirely on material from 1975–2019 and will be exactly as true next year. The relative-language scan came back nearly clean: the draft dates things absolutely ("on July 3, 2025," "In 1991," "Five and a half years later," "Sixteen years after those fitting rooms") where a lesser draft would say "recently." That discipline is the single best durability asset here and I want it on the record before the criticism.

The problem is that the two elements the pipeline has flagged hardest for protection — the Calypso ending and the closing line — are also the two most time-bound sentences in the document. The final line, "She still cannot wear a bra without it hurting," is an undated present-tense claim about a living person's body, sourced to April 2026 press about an injury sustained on a February 2025 shoot. It is already four months past its only evidence at publication, and it is the last thing every reader sees. The whole final section rests on a film released four weeks before the draft date, whose 2027 awards cycle falls inside the review window.

Strip _Apex_, _The Odyssey_, and the 2025 Megyn Kelly exchange and the Type 8 case still stands on Benoni, the Joffrey knees, the bank teller, Denver and Delilah, and the damage report. That is the right answer to the removal test. But the piece would lose its ending, its closing image, and its critic anchor — so what survives is the argument without the craft. The refresh list below is designed so the craft survives too.

One blocker is outside my lane but fails my central question anyway: a single sentence calls Theron's children "both boys." They are daughters, one of them publicly transgender. That is inaccurate today and gets worse, not better, every month the page stays indexed.

## What landed

**FUTURE-H1 — Absolute dating almost everywhere.** A full scan of reader-visible text for `recently / currently / today / upcoming / these days / at the moment / so far / this year / lately` returned exactly one offender (`recent`, in a collapsed accordion). Instead the draft writes "Five and a half years later, on July 3, 2025," "In 2019 Denver and Delilah produced _Bombshell_," "Then in January 2020 Kelly put out a half-hour video," "Sixteen years after those fitting rooms." Why this must survive revision: every one of those sentences is readable in 2030 without a correction. Whoever writes the next people draft should be handed this piece as the house example of date discipline.

**FUTURE-H2 — "Theron plays Calypso. Not Circe, whatever the early trades printed."** This is an unusual thing to find in a profile: a sentence that inoculates the page against an error that will keep circulating. I ran a general web search for Theron's post-_Odyssey_ slate today, and the summary that came back still asserted she plays "the goddess of sorcery, Circe." The misinformation is live in aggregator-tier sources four weeks after release, which means it will still be live in a year and will keep being retrained on. Most durability notes ask a writer to remove something; this one earns its place by being the only sentence on the page whose value _increases_ with time.

**FUTURE-H3 — The damage-report table is a durable container.** "| Role | What it cost her | What the industry said it bought |" is a form that accepts a new row without any rewriting. When _Atomic Blonde 2_ or _Tyrant_ produces the next injury, the refresh is one line, not a restructure. Bespoke _and_ extensible is rare; do not convert this to prose in any future pass.

**FUTURE-H4 — "Being done placating and being pleasant to work beside are different achievements, and she has one of them."** No date, no event, no news peg. It resolves the "difficult" question in a way that cannot expire, and it would read the same in 2035. Preserve verbatim.

**FUTURE-H5 — The hedge on partner status.** "No current partner is publicly established" (rather than "she is single") is the correct construction for a fact that can change without anyone updating the page. It stays true even if her circumstances change and nobody has told the press. Keep the phrasing exactly; do not let a future editor "tighten" it.

## What missed

**FUTURE-M1 — The ending promises permanence and delivers a bulletin.** The Calypso close is built to feel eternal: fifteen, holding a door shut in Benoni; fifty-one, opening one. Then the last sentence drops to a symptom report. The effect the section is going for is _this is who she has always been_; the effect the final line delivers is _this is her medical status as of spring 2026_. A reader in 2027 hits a present-tense claim they have no way to check and that is probably no longer true, in the position where the piece is asking them to feel something permanent. The idea is right — the body is still paying — but it is executed as news.

**FUTURE-M2 — The corpus stat refutes itself on publication day.** "Of the 158 film and television figures profiled on 9takes, only 16 read as Type 8." `src/lib/data/corpus-stats.json` (generated 2026-08-17) confirms `film-tv.total = 158` and `counts_by_type["8"] = 16` — with Theron excluded, because she has no `blogs_famous_people` row yet. Publishing this page makes it 159 and 17. The sentence is wrong the moment it goes live, and it is wrong against a number the reader can check on the site's own `/personality-analysis/categories/film-tv` page.

**FUTURE-M3 — A scheduled event written as an accomplished one.** "amfAR honors her for it in October 2026." The gala is 24 October 2026 and had not occurred when this draft was frozen. Present tense collapses the distinction between _announced_ and _happened_, and it is doing load-bearing work as the closing proof of the philanthropy paragraph.

**FUTURE-M4 — The piece has no forward vector at all.** Every anchor points backward from August 2026. Theron has at least five announced projects — _Atomic Blonde 2_ (Leitch), _Jane_ (Cuarón, pre-production), _Tyrant_, _Two for the Money_ (Lin), _Dance Parents_ — and she is credited as producer on four of them. A piece whose thesis is "she bought the means of production and keeps spending her body" is leaving its own strongest ongoing evidence on the floor, and the omission is what will make the page feel stale first.

## What I expected

- **A dated qualifier on any present-tense claim about her body.** The table gets this right — it quotes her, so the claim is anchored to a speaker and a press cycle. The closing line strips both and asserts it in the narrator's voice. I expected the narrator to inherit the table's caution, not shed it.
- **One sentence acknowledging the slate.** Not a filmography — a trajectory. The entity-gap packet says keep biography tight, and I am not asking for encyclopedia. One clause naming what she is producing next would convert the production-company section from a closed historical episode into an ongoing pattern, which is what the thesis actually claims it is.
- **The corpus stat expressed as a proportion.** "Roughly one in ten" survives a year of publishing. "158 / 16" survives about a day. The corpus grew from 391 to 417 published profiles between 24 July and 16 August 2026 — roughly 1.1 per day — so exact counts are the shortest-lived sentence type available.
- **`changefreq: 'monthly'` to be backed by capacity.** The frontmatter promises monthly change and the pipeline ledger records 4496 words against a 4500 ceiling with "no headroom left; the next refresh must cut before it adds." Those two commitments contradict each other. I expected either a looser `changefreq` or reserved budget for the refresh the page is going to need.

## What surprised me

**Welcome:** the near-total absence of "recently"/"currently." I opened this expecting the usual profile-writing failure — a piece narrated from an eternal present that decays into nonsense — and instead found a draft that mostly refuses relative time. That is a deliberate craft choice and it is unusual enough to be worth naming.

**Welcome:** the Kelly sequence is told as chronology (Dec 2019 → Jan 2020 → Jan 2020 → July 2025) rather than as a current feud. Told that way it is history and stays legible; told as "Megyn Kelly is currently attacking her" it would have been dead within months.

**Jarring:** the last sentence. After a piece that dates everything, the closing line is the one place the draft writes as if the present moment were permanent — and it is the sentence most likely to be quoted, screenshotted, and pulled into a social card. The discipline holds for 4,400 words and breaks in the final eight.

**Jarring in a quiet way:** the title says "at Ten" and the body never mentions age ten. Titles are the one element refreshes almost never touch, and this one carries a number nothing in the piece supports.

## Red flags

**FUTURE-R1 — BLOCKER — Undated present-tense claim about a living person's body, in the final sentence.**

- _Passage:_ "She still cannot wear a bra without it hurting." (final line, "Calypso opens the door")
- _Reader effect:_ A 2027 reader is handed an unverifiable assertion about Theron's current physical condition, stated by the narrator rather than by her, at the moment of maximum emphasis. If it has resolved, the page's last sentence is false; if a reader checks, there is no date to check against.
- _Evidence:_ The only support is the _Apex_ press cycle quote reproduced in the draft's own table — "I can barely wear a bra. It's still that bad." — which the packet dates to the ScreenRant cover story, 22 April 2026 [S-06a]. Principal photography was February 2025 [S-06]. The draft is published 17 August 2026, roughly four months after the last evidence and eighteen months after the injury. Nothing establishes the condition persisted to publication, let alone to 2027.
- _Minimum viable repair:_ Anchor the claim to its moment rather than to now. Keep the sentence in the same rhythmic slot and make it retrospective — tie it to the spring 2026 press, or recast so the enduring claim is about what the role cost rather than what her body is doing today.
- _Expected benefit:_ The ending stops expiring. The image survives intact; only its tense changes.
- _Confidence:_ High that the claim is undated and unsupportable as written. Medium on whether the condition has actually resolved — which is precisely the point: nobody can tell, including the reader.
- _Acceptance test:_ Read the final sentence on 17 August 2027 with no other information. If it makes a claim about that day that cannot be checked against a cited date, it has not been fixed.

**FUTURE-R2 — BLOCKER — The page misstates the gender of Theron's children, and the harm compounds while it stays live.**

- _Passage:_ "Gerda lives up the street in Los Angeles and has helped raise both boys since the beginning." ("Charlize Theron's family, age, and the husband she never wanted")
- _Reader effect:_ Theron's children are daughters; the elder, Jackson, is publicly transgender. A live, indexed page that calls them "boys" misgenders a child in a profile whose entire thesis is about who gets to decide what someone is.
- _Evidence:_ Theron, April 2019: "I'm raising two beautiful, proud, black African girls" [S-03]; standard reference sources describe two daughters, one transgender [S-01]; and in the _Call Her Daddy_ episode this draft quotes throughout, her own words are "no man's moving into our house **while my daughters are there**" [S-22]. The draft is also internally inconsistent — it says "children" four times and "boys" once.
- _Why I am raising it in the durability lane:_ it fails my central question directly ("will this still be accurate"), and unlike a stale date it does not degrade gracefully. It gets crawled, cached, syndicated into the `blogs_famous_people` row, and pulled into AI answer surfaces, and the child it concerns will be an adult while the page is still up. Time makes this worse, not softer. The full fairness analysis belongs to the subject reviewer; I am recording it so it cannot fall between lanes.
- _Minimum viable repair:_ "both children" or "both girls," matching the rest of the piece and her own public statement. One word.
- _Expected benefit:_ Removes the only sentence on the page that a reader could reasonably call careless about a minor.
- _Confidence:_ High.
- _Acceptance test:_ `grep -in "boys\|sons" ` over reader-visible text returns nothing.

## Specific improvements

The nine items below are this review's nine concerns, one repair each. FUTURE-M1 through FUTURE-M4 above are the diagnoses these repairs address, not separate findings.

**FUTURE-I1 — Retire the raw corpus counts.** _(from FUTURE-M2)_

- _Passage:_ "Of the 158 film and television figures profiled on 9takes, only 16 read as Type 8, and Theron is the plainest kind…"
- _Problem:_ False on publication day (Theron makes it 159/17) and increasingly false after; the site refutes it on its own category page. Corpus grew 391 → 417 published profiles in 23 days.
- _Repair:_ Express as a proportion — roughly one in ten of the film-and-TV profiles — or cut the quantification and keep "Theron is the plainest kind." The sentence's rhetorical job is _this type is uncommon here_, which a proportion does just as well.
- _Benefit:_ The sentence stops needing a rebuild every time a profile publishes.
- _Confidence:_ High. Verified against `src/lib/data/corpus-stats.json`, generated 2026-08-17.
- _Acceptance test:_ Regenerate corpus stats after any three publishes; the sentence must still be true without edits.

**FUTURE-I2 — Put the amfAR honor in the right tense.** _(from FUTURE-M3)_

- _Passage:_ "amfAR honors her for it in October 2026."
- _Repair:_ Mark it as scheduled and dated — announced 8 July 2026 for the Dallas gala on 24 October 2026 — so the sentence is true whether or not the gala happens as planned, and so a post-October refresh is a one-word tense change rather than a fact check.
- _Benefit:_ Removes the only claim in the piece that could be flatly false through no fault of the writing.
- _Confidence:_ High. Packet CLM-17 / [S-23] confirm announcement on 8 July 2026 for a date that had not yet occurred at compile time.
- _Acceptance test:_ The sentence reads correctly both on 1 October 2026 and on 1 December 2026 without editing.

**FUTURE-I3 — Make the age computable rather than fixed.** _(from "What I expected," the age references)_

- _Passages:_ FAQ 2, "Charlize Theron turned 51 on August 7, 2026"; body, "She turned 51 on August 7, 2026"; TL;DR, "At 51 she plays a goddess…"
- _Problem:_ She turns 52 on 7 August 2027 — ten days before the twelve-month horizon. The FAQ is the answer to a literal "how old is Charlize Theron" query and feeds structured data, so it is the highest-decay element on the page.
- _Repair:_ Lead the FAQ answer with the birth date (born 7 August 1975) and treat the age as a dated observation, not a standing fact. In the TL;DR, either drop the number or bind it to the role's release year, since the _Odyssey_ shoot is what "at 51" is actually describing.
- _Benefit:_ The one FAQ most likely to be surfaced as a direct answer stops going wrong on a known calendar date.
- _Confidence:_ High.
- _Acceptance test:_ Set a hypothetical read date of 1 September 2027. No sentence states or implies a wrong age.
- _Note:_ "At fifty-one, in front of the biggest cameras ever built" in the closing paragraph is fine as written — it is anchored to the _Odyssey_ moment, not to the reader's present. Leave it.

**FUTURE-I4 — Give the piece one forward vector.** _(from FUTURE-M4)_

- _Location:_ end of "Why Charlize Theron started her own production company," where the section currently closes on the 2007 CTAOP founding and the amfAR line.
- _Problem:_ The production-company thesis is presented as a completed historical arc (2003 founding → 2019 _Bombshell_), when it is in fact the most active thing about her right now. That is what will make the page read as a snapshot rather than an argument.
- _Repair:_ One sentence noting that she is producing as well as starring in what comes next — _Tyrant_, _Two for the Money_ (Justin Lin), _Dance Parents_, and Cuarón's _Jane_ are all announced with her as producer, and _Atomic Blonde 2_ is set up with Leitch. Frame it as pattern, not as release calendar, and give no dates, since none are dated.
- _Benefit:_ Converts the strongest durability liability (backward-only anchors) into thesis support, and gives the next refresh an obvious hook. Costs roughly 25 words against the stated ceiling — see FUTURE-I8.
- _Confidence:_ Medium-high on the slate; sourced from a JustWatch curated guide cross-checked against a general search, both aggregator-tier, all listed as undated/TBD. **Do not state release years.** If the editor wants a firmer footing, verify against trades before naming more than two titles.
- _Acceptance test:_ Remove the _Apex_ and _Odyssey_ material entirely; the production-company section should still assert an ongoing, present-tense pattern.

**FUTURE-I5 — Date the crowd-database consensus or drop the appeal to it.**

- _Passage:_ "The crowd databases have converged on 8w9, which is worth arguing rather than inheriting."
- _Problem:_ Present-perfect claim about tier-4 vote-driven sites whose tallies move continuously; the packet notes Boo carries two competing Theron profiles [S-29]. In twelve months "have converged" may simply be untrue, and the sentence's rhetorical move — _here is the received view, now let me test it_ — collapses if the received view has shifted.
- _Repair:_ Date it ("as of 2026") or recast as the reader-expectation framing the packet says is the only legitimate use of those sources.
- _Benefit:_ Keeps the good instinct (argue it rather than inherit it) without staking it on a moving number.
- _Confidence:_ High.
- _Acceptance test:_ The sentence remains defensible if the databases flip to 8w7 next spring.

**FUTURE-I6 — Fix the one relative-time word in the piece.**

- _Passage:_ "The growth line to two is recent and visible. Two adoptions, therapy in her late thirties, and the day on _Apex_ when she told a director she was done."
- _Problem:_ "Recent" is already wrong. The adoptions were 2012 and 2015; late thirties puts the therapy around 2012–2014. Those are eleven to fourteen years before publication. Only the _Apex_ item is recent, and the sentence spreads the adjective across all three.
- _Repair:_ Replace "recent" with the span itself — the last decade and a half — or attach the timing to the _Apex_ item alone.
- _Benefit:_ Removes the sole surviving relative-time construction, and fixes a claim that is misleading today rather than in a year.
- _Confidence:_ High. Dates from the draft's own family section and packet timeline.
- _Acceptance test:_ Re-run the relative-language scan over reader-visible text; `recent` returns zero hits.

**FUTURE-I7 — Reconsider the budget framing of _The Odyssey_.**

- _Passage:_ "a roughly quarter-billion-dollar IMAX epic where the whole world already knows the plot"
- _Problem:_ A production-budget figure used as a scale cue. The film opened to $264.1M worldwide — Nolan's biggest global opening — so within the window the budget number will be dwarfed by the gross and reads as either an undersell or a confused box-office figure.
- _Repair:_ Describe the scale by what it is rather than what it cost — the IMAX format and the universally known plot are already doing that work in the same sentence, so the dollar figure can go.
- _Benefit:_ One fewer number to maintain, and the sentence gets shorter, which helps FUTURE-I8.
- _Confidence:_ Medium-high. Opening figure from THR/Variety coverage, July 2026.
- _Acceptance test:_ The sentence conveys "enormous" without a figure a reader might check against a different metric.

**FUTURE-I8 — Reconcile `changefreq` with the word ceiling.**

- _Passages:_ frontmatter `changefreq: 'monthly'`; pipeline ledger "Word budget: 4496 of 4500 … no headroom left."
- _Problem:_ The page declares monthly change to crawlers while the production process has zero room to add anything. Every fix in this review that adds words (I2, I4) has to displace something, which means refreshes will be deferred, which means the freshness signal becomes a lie the page tells continuously.
- _Repair:_ Either relax `changefreq` to `yearly` to match the real cadence, or bank ~80 words now. FUTURE-I1, I7, and the CLM-13 "hot lesbian movie" quote flagged as unsourced in the packet are the three cheapest cuts available and together roughly fund I2 and I4.
- _Benefit:_ The refresh below becomes executable rather than aspirational.
- _Confidence:_ Medium — this is a production-process judgment, not a reader-facing defect.
- _Acceptance test:_ The twelve-month refresh can be applied without a net word increase.

**FUTURE-I9 — Resolve "at Ten" before publication, not at refresh.**

- _Passages:_ `title`, "the Mask She Was Handed at Ten"; TL;DR bullet 1, "The costume issued at ten."
- _Durability argument (the factual determination is another reviewer's):_ titles are the most permanent element the pipeline produces. They persist into SERP snippets, social cards, RSS, and the `blogs_famous_people` row, and refresh passes edit body copy, not H1s. An unsupported specific placed there is effectively unfixable later — and per the packet, no source establishes age ten across the research file, the entity-gap packet, or targeted searching, while the originating interview is about high school and the boarding-school hinge is 13.
- _Repair:_ Source the age and put it in the body, or move the title off a number it cannot defend.
- _Benefit:_ Removes a permanent liability from the one field nobody will revisit.
- _Confidence:_ High on the permanence argument; deferring to subject/critic on the factual call.
- _Acceptance test:_ Every number in the title appears, sourced, in the body.

### Twelve-month refresh list (target: 17 August 2027)

Ordered by when each becomes wrong, not by importance.

| When                    | Item                                                          | Action                                                                                                                                                                                                                                                                                                                   | Trigger                                                  |
| ----------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| **On publish**          | Corpus stat 158 / 16                                          | Already stale — Theron makes it 159 / 17. Apply FUTURE-I1 before publishing.                                                                                                                                                                                                                                             | Publication itself                                       |
| **On publish**          | "both boys"                                                   | Correct to children/girls (FUTURE-R2).                                                                                                                                                                                                                                                                                   | —                                                        |
| **On publish**          | Final line, bra/intercostal                                   | Re-anchor to spring 2026 (FUTURE-R1).                                                                                                                                                                                                                                                                                    | —                                                        |
| **Late Oct 2026**       | "amfAR honors her for it in October 2026"                     | Confirm the 24 Oct Dallas gala occurred and she attended; convert to past tense, or correct if it moved.                                                                                                                                                                                                                 | amfAR gala, 24 Oct 2026                                  |
| **Nov 2026 – Mar 2027** | Calypso section / "Why people call Charlize Theron difficult" | _The Odyssey_ is the 2027 Oscar front-runner across most categories, with Hathaway widely tipped for Supporting Actress. If Theron is nominated — or conspicuously is not while castmates are — the ending needs one sentence. Do not let the page sit through an entire awards cycle silent on the film it closes with. | Nominations (Jan 2027) and the 99th ceremony (~Mar 2027) |
| **Any time**            | Production-company section                                    | Add the producing slate (FUTURE-I4); update as _Tyrant / Two for the Money / Dance Parents / Jane / Atomic Blonde 2_ firm up.                                                                                                                                                                                            | First dated release announcement                         |
| **Any time**            | Damage-report table                                           | Add a row if a new shoot produces a new injury. The table is built for this.                                                                                                                                                                                                                                             | New production wrap                                      |
| **7 Aug 2027**          | All four age references                                       | She turns 52. Apply FUTURE-I3 now and this row disappears permanently.                                                                                                                                                                                                                                                   | Her birthday                                             |
| **Rolling**             | "No current partner is publicly established"                  | Re-verify only; the hedge is correct and should survive.                                                                                                                                                                                                                                                                 | Any relationship reporting                               |
| **Rolling**             | "The crowd databases have converged on 8w9"                   | Re-check or date it (FUTURE-I5).                                                                                                                                                                                                                                                                                         | —                                                        |

## Follow-on questions

**FUTURE-Q1 — Did the amfAR Dallas gala on 24 October 2026 take place with Theron present and the Award of Inspiration conferred?**
_What it changes:_ Determines whether the philanthropy paragraph's closing sentence becomes a past-tense fact, needs a "was honored in absentia"-style correction, or has to be cut. _Best source:_ amfAR's own post-event release and the Dallas gala coverage; the announcement release [S-23] is already in the citations block, so the follow-up is the same publisher.

**FUTURE-Q2 — Is Theron nominated for _The Odyssey_ at the 99th Academy Awards, and does the film's awards run reframe Calypso as a career capstone?**
_What it changes:_ If yes, the ending gains a line and the "part nobody predicted" TL;DR bullet becomes an understatement worth revising. If she is passed over while Hathaway and the crafts categories are not, the section should say nothing rather than pretend — but the writer needs to know which. _Best source:_ Academy nominations announcement, January 2027; trade awards coverage (Variety, THR, GoldDerby) through the cycle.

**FUTURE-Q3 — Has Theron said anything about the intercostal injury after the April 2026 _Apex_ press cycle?**
_What it changes:_ A later statement would let the closing line stay present-tense with a fresh anchor, which is the outcome that preserves the most craft. Silence means FUTURE-R1's retrospective repair is the only honest option. _Best source:_ the _Odyssey_ July 2026 junket transcripts and any autumn 2026 press; the Beijing write-up [S-26] is the most recent first-person material in the packet and was not mined for this.

**FUTURE-Q4 — Which of the five announced projects has a dated release inside the window?**
_What it changes:_ Determines whether FUTURE-I4 stays a one-sentence pattern claim or becomes a named, dated anchor — and if _Atomic Blonde 2_ moves, the intro's cracked-molar image acquires a sequel, which is a genuine opportunity rather than a maintenance chore. _Best source:_ trade announcements (Deadline/Variety) rather than the aggregator guides I used; my sourcing here is deliberately soft and should not be upgraded without a trade citation.

**FUTURE-Q5 — Does the people pipeline have any mechanism that flags age-bearing sentences on a subject's birthday?**
_What it changes:_ If not, every profile in a 417-page corpus carries the same decay, and this review's FUTURE-I3 is a corpus-wide lint rule rather than a one-page fix. That is a much larger win than fixing Theron alone. _Best source:_ `scripts/blog-quality-report.mjs` and the audit scripts under `pnpm audit:people-seo`.

## Preserve list

Ranked by what a future editor is most likely to damage.

1. **The final paragraph's door structure** — "At fifteen she was inside a door in Benoni… At fifty-one… she is on the other side of a door, opening it for someone who could not decide on his own whether to leave." Timeless, swap-proof, and the payoff of the whole piece. FUTURE-R1 asks you to change _the sentence after this_, not this. Do not let a tense fix bleed upward.
2. **The absolute-date discipline** (FUTURE-H1) — every "In 2019," "on July 3, 2025," "Five and a half years later." A future editor tightening for word budget will be tempted to convert these to "recently" or "a few years later." That trade saves four words and costs the page its durability.
3. **"Theron plays Calypso. Not Circe, whatever the early trades printed."** (FUTURE-H2) — the error is still circulating in aggregator sources today; this sentence gets more valuable, not less.
4. **The damage-report table's three-column form** (FUTURE-H3) — extensible by design. Adding a row is the cheapest possible refresh.
5. **"Being done placating and being pleasant to work beside are different achievements, and she has one of them."** — expires never.
6. **"No current partner is publicly established"** — the hedge is deliberate and correct; do not simplify it to "she is single."
7. **The Kelly material told as dated chronology** rather than as a live feud. The sequencing is what keeps it readable in 2027.

## Research log

Draft SHA `1d74c2c8…` verified against `context.json` and the supplied `--draft-sha`; both match. Packet read in full before role-specific research, per protocol. I did not open `subject.md`, `fan.md`, `critic.md`, `unfamiliar.md`, `enneagram.md`, or `synthesis.md`; none existed in the directory at read time.

| #   | Question                                                                                     | Source                                                                                                                                                                    | Decision it affected                                                                                                                                                                                                                                                                                                                  |
| --- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Which reader-visible sentences use relative rather than absolute time?                       | Scripted scan of `draft-reviewed.md` with HTML comments stripped (the ledgers are not reader-visible; the people pipeline strips editor comments on push)                 | Produced FUTURE-H1 and FUTURE-I6. One `recent` hit; three benign `now`s; five `still`s of which one is the closing-line blocker. This scan is why I rated durability high overall.                                                                                                                                                    |
| 2   | Is the 158 / 16 corpus stat current, and how fast does it decay?                             | `src/lib/data/corpus-stats.json` (generated 2026-08-17); `git log` on that file, replaying `totals.published` across commits                                              | Confirmed 158 / 16 exactly, and that published profiles went 391 → 417 between 2026-07-24 and 2026-08-16 (~1.1/day). Produced FUTURE-M2 / FUTURE-I1 and the "stale on publish" finding.                                                                                                                                               |
| 3   | What Theron work is announced that will supersede this piece's anchors inside twelve months? | General web search, then JustWatch curated guide (`guides.justwatch.com/us/charlize-theron-movies-coming-2026-2027`)                                                      | Surfaced _Tyrant_, _Two for the Money_ (Lin), _Dance Parents_, _Jane_ (Cuarón, pre-production), _Atomic Blonde 2_ (Leitch) — all undated. Produced FUTURE-M4 / FUTURE-I4. Aggregator-tier, so I capped the recommendation at "pattern, no dates." The same search also returned the persistent Circe error, which produced FUTURE-H2. |
| 4   | What scheduled events fall inside the window?                                                | Web search on _The Odyssey_ awards/box office; THR and Variety opening-weekend coverage; 2027 Oscar-prediction coverage (GoldDerby, IndieWire, AwardsWatch, Awards Daily) | $264.1M global opening, Nolan's biggest; 95% RT; front-runner across most categories; Hathaway tipped for Supporting Actress. Produced the awards-cycle row in the refresh list and FUTURE-I7. I did **not** predict any outcome — only that a scheduled cycle exists.                                                                |
| 5   | Did the amfAR gala occur, and is the children's-gender question settled?                     | Packet only — CLM-17 / [S-23]; CLM-03 / [S-01, S-03, S-22]                                                                                                                | Packet answered both; no additional search needed. Produced FUTURE-M3 / FUTURE-I2 and FUTURE-R2.                                                                                                                                                                                                                                      |

Four external sources consulted, within the 2–4 budget. No source was used to establish a fact about Theron's interior life or type; my lane does not require it.

## Limits of this review

- **I cannot see the future, and I did not try.** Every dated item above is either already scheduled (the amfAR gala, the 99th Academy Awards, her 52nd birthday) or already announced (the production slate). Where I say something "will" change, I mean a calendar date exists. I have made no prediction about awards outcomes, releases, her health, or her relationships, and the refresh list is deliberately written as triggers rather than forecasts.
- **My slate research is aggregator-tier.** JustWatch and a general search summary are not trades. That is why FUTURE-I4 says "pattern, no dates" and flags trade verification as a precondition for naming more than two titles. If the editor wants the slate in the piece with any specificity, that needs a Deadline/Variety pass I did not run.
- **I inherited the packet's factual determinations** on the amfAR timing, the children's gender, age ten, and the _Apex_ shoot age rather than re-verifying them independently. Where I built a finding on one — FUTURE-R2 most importantly — I checked the draft's own text against the packet's cited quotations, but I did not re-fetch [S-03] or [S-22].
- **FUTURE-R2 is outside my assigned standpoint.** I recorded it because it fails my central question about continued accuracy and because the harm compounds over time, but the subject reviewer owns the fairness and dignity analysis, and my treatment is deliberately thin.
- **I did not assess whether the Type 8 reading is correct**, whether the piece is fair, whether it is well written, or whether a newcomer can follow it. A durable article can be a durably wrong one. Nothing in this review's `value: high` rating should be read as endorsement of the typing.
- **The word-budget arithmetic in FUTURE-I8 is approximate.** I did not re-run the lint or count the exact cost of my proposed additions; I identified cuts that plausibly fund them and left the accounting to the editor.
- **I evaluated reader-visible content only.** The four HTML-comment ledgers and the fresh-eyes/second-pass/cohesion notes are stripped on push, so their staleness has no reader-facing durability cost — though the "Still open" items in them are, on the evidence of this review, accurate about what remains unresolved.
