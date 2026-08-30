---
artifact: perspective-review
schema_version: 1
subject: Alexandr-Wang
perspective: future
draft_sha256: 90b3e93277b347fb9018465040de2486a12f4bccdeb78be8ed1e1383c3f2cea3
review_status: complete
trust: strained
value: high
delight: clear_hit
recommendation: revise
blockers: 1
concerns: 8
reviewed_at: 2026-08-18T06:47:16Z
path: docs/content-analysis/perspective-reviews/Alexandr-Wang/2026-08-18_020004/future.md
---

## Bottom-line verdict

Read on 2027-08-18, this piece mostly survives, and it survives for the right reason: its thesis is
anchored to a sixth-grade math competition, not to a news cycle. Strip out every 2026 event and the
argument still stands — a boy who kept the placement instead of the problem set built the machinery
that decides whose expertise counts. That is a twelve-month-proof spine, and it is rare in a draft
about a 29-year-old at the center of an active corporate fight.

The durability damage is concentrated and cheap to fix. One claim is already wrong in the temporal
sense — the draft presents a customer exodus as permanent when its own cited source reports one of
those customers came back — and that claim is load-bearing twice, including under the growth-arrow
argument in the rabbit hole. Beyond that, the piece's payoff is pinned to a **beta** product's live
pricing page in present tense, with an instruction to the reader to go look at it. Everything else is
relative-language drift and status claims that need an as-of marker.

What impressed me is that the draft is unusually aware of its own expiry. It dates almost everything
absolutely, it labels the benchmark figures as vendor-reported and dated, it says out loud that three
of four table rows "will resolve with more data," and it names two findings that would overturn its
own type call. That is durability-conscious writing. The gap is that this discipline stops exactly
where the piece is most exposed: the ending.

## What landed

**FUTURE-H1 — The spine cannot decay.**

> "There was a math competition in New Mexico. The top four finishers in the state won an
> all-expenses-paid trip to Disney World. Alexandr Wang was in sixth grade, and he has said that the
> trip was the most motivating thing he could imagine. He came fourth."

A ~2008 childhood event, sourced to his own 2025 telling, carrying the entire argument. Nothing about
2027 can touch it. The packet marks it verified (CLM-01, CLM-02) and notes the article collapses if
it is wrong — it isn't. This is the reason the piece scores `value: high` despite the perishable
surface. Must survive revision untouched.

**FUTURE-H2 — Absolute dating as house style.**

> "On January 5, 2026, the Financial Times published an interview with Yann LeCun"
> "In August 2023 the Washington Post published an investigation into it"
> "200 employees, 14% of staff, laid off in July 2025"
> "The first commercial product from Meta Superintelligence Labs shipped on August 5, 2026."

The draft overwhelmingly prefers absolute dates to "recently" or "last year." A 2027 reader can place
every one of these without external help. This is the single highest-leverage durability habit a
people-blog can have, and it is already in force here — which is what makes the handful of relative
constructions (C5) stand out as oversights rather than as the piece's register.

**FUTURE-H3 — The benchmark row self-dates and self-attributes.**

> "| Muse Spark 1.2 on Terminal-Bench 2.1 | 82.9%, against Claude Opus 5 at 86.7% (Meta's reported
> figures, August 2026) |"

Three separate hedges in one cell: version-pinned models, a version-pinned benchmark, and an explicit
"Meta's reported figures, August 2026." In twelve months this row will be obsolete as a scoreboard
and still correct as a record. That is the difference between a stale claim and a time capsule.
Packet CLM-20 confirms the numbers and the vendor-reported framing. Preserve the parenthetical
verbatim; it is doing more work than it looks like.

**FUTURE-H4 — The table's third column is the durable column.**

> "| Benchmark | Result | What the score cannot see |"

The results column expires; the third column does not. "Whether that is a Wang problem or the ordinary
churn of a talent war fought with nine-figure packages" reads exactly as well in 2027 as in 2026.
Building the bespoke form so that the perishable data sits in one column and the durable judgment sits
in another is the smartest structural decision in the piece from a durability standpoint. It also
means the section can be refreshed by editing cells rather than rewriting prose.

**FUTURE-H5 — Named falsifiers make the piece re-checkable instead of stale.**

> "Two findings would overturn the call. One: a documented stretch where pressure made him go quiet
> and stay quiet. Two: a decision where he chose knowing something over being seen to have delivered
> it. Neither is in the record so far."

"So far" is correctly scoped, and naming the falsifiers converts the twelve-month refresh from
"rewrite the type call" into "run two specific checks." Same for the stress-arrow refusal
("asserting it would be inventing evidence"). A 2027 reader who has watched Wang for another year can
test this article against reality, which is a durability property most typing pieces lack.

**FUTURE-H6 — LeCun's interest is declared, so the section ages by one clause.**

> "LeCun left Meta in November 2025 to start a company that competes with the one he was describing."

Whatever happens to LeCun's startup by 2027 — funded, shipped, folded, vindicated — this framing
absorbs it. The draft did not bet on the outcome; it bet on the structure of the disagreement.

**FUTURE-H7 — SERP assets carry no dated claims.**

`title`, `meta_title` and `description` reference only the Disney World anecdote, the type call and
LeCun's critique in the abstract. Nothing in the metadata expires, so the search-result presentation
of this page does not decay even as body facts do.

## What missed

**FUTURE-M1 — The ending, the piece's best asset, is pinned to a live artifact.**

> "Read the pricing page. There is a standard tier, and beneath it a contributor tier at a small
> fraction of the rate, where developers get cheap access in exchange for Meta using their prompts
> and completions as training data."

Present tense, no date on the pricing claim itself, plus an imperative telling the reader to verify
against a commercial page. My research confirmed Muse Code shipped **in beta** (the packet's own
timeline says "(beta)"; trade coverage agrees). Beta pricing is provisional by construction. In twelve
months the most likely states are: prices changed, tier renamed, beta ended with different terms. The
_idea_ — cheap access bought with your judgment — is durable and is the actual payoff. The _artifact_
is not. See FUTURE-C1.

Worth recording as a risk that got smaller: the packet flagged "prompts and completions" as more
specific than any source (dispute #4). My search found multiple outlets rendering it exactly that way
alongside "train on your code," so the phrasing is better supported than the packet suggests. That
reduces the precision exposure without touching the temporal one.

**FUTURE-M2 — A temporary state written as a permanent one.**

The table row and the rabbit hole both present Scale's customer losses as settled attrition. Per the
packet (CLM-19), the draft's own source reports Google resumed its work a few months later. This is
the one place the article is already misleading on a temporal axis rather than merely at risk of
becoming so. See FUTURE-R1.

**FUTURE-M3 — Status claims without an as-of marker.**

> "Today he is Meta's first Chief AI Officer."

Accurate on 2026-08-18 — I verified against Wikipedia's Meta Superintelligence Labs article, updated
2026-08-15, which still has Wang as Chief AI Officer leading MSL. But "Today" is the reader's today,
not the writer's, and this sentence is coupled to two other status claims (FAQ 3's "He remains on
Scale AI's board and no longer runs the company," and the `occupation` frontmatter that feeds
structured data). MSL has already been reorganized once, into four groups with Friedman and Ramani
holding co-leadership of two of them. The role is intact; the structure churns. See FUTURE-C2.

**FUTURE-M4 — The freshest claim was already one beat behind at freeze.**

Packet dispute #10 and limitation #9: Zuckerberg announced open-sourcing Muse Spark 1.2's weights on
2026-08-10 — five days after the draft's current-tense anchor and eight days before the draft's own
date. Nothing in the piece is contradicted by it. But it is direct evidence that this subject's cadence
outruns the draft's, which is the fact a durability plan has to be built around. See FUTURE-C6.

**FUTURE-M5 — Volatile market sentiment used inside the steelman, undated inline.**

> "Watch him try to hold it: a year in, CNBC reported that Meta's stock trailed every other tech
> megacap and that developers remained skeptical the company could compete with OpenAI, Anthropic and
> Google at all."

"A year in" is computable from the June 2025 hire, so this is not undated in the strict sense, and the
packet confirms CNBC's piece is 2026-06-14 (CLM-26, S-24). But stock rank and developer sentiment are
the two fastest-moving facts in the article, and they are carrying the harshest version of the case
against Wang. If Meta's position moves by 2027, the steelman reads as a snapshot presented as a
condition. See FUTURE-C4.

## What I expected

**A visible vintage.** For a subject at the center of an active conflict, I expected one in-body
signal telling the reader what window the piece describes — the way the benchmark row already does
with "(Meta's reported figures, August 2026)". The frontmatter carries `date` and `lastmod`, but the
prose never says "as of August 2026" anywhere the status claims live. One clause in the intro would
inoculate every present-tense sentence downstream.

**Perishable claims quarantined the way the type theory is.** The draft has a strict quarantine
discipline for Enneagram system language — the DISTRIBUTION LEDGER shows it is tracked and enforced to
a single bridging paragraph. I expected the same instinct applied to perishable facts: news-dependent
claims concentrated where they can be updated, durable argument insulated from them. It is _partly_
there (the benchmark table is a good containment vessel), but the perishable material also sits in the
intro's second paragraph and in the final four paragraphs — the two positions hardest to edit without
disturbing the piece's best writing.

**A stated refresh trigger on the section that says it will expire.** The draft writes "Three of those
four will resolve with more data" — an explicit prediction that the section will age. I expected it to
then say when, or at least to be built so the resolution is the update. It stops one clause short of
its own insight.

I did **not** expect, and do not penalize the absence of, any hedging on the type call itself. The
Enneagram argument is built on childhood and decade-scale behavior, not on 2026 events, and it is the
most durable component in the piece.

## What surprised me

**Welcome.** The third column of the benchmark table is a durability device disguised as a rhetorical
one. It lets the section be refreshed cell-by-cell without touching a sentence of prose. I have not
seen that shape used deliberately in this pipeline, and it is the pattern most worth reusing on any
fast-moving subject.

**Welcome.** The rabbit hole's refusal to invent a stress-arrow instance produces an unexpected
durability benefit: the section cannot be falsified by future evidence, only completed by it. A 2027
refresh adds to it rather than corrects it.

**Jarring.** "Read the pricing page." The article's single most confident imperative points the reader
at the one artifact guaranteed to change. It is also the only sentence in the piece that asks the
reader to leave and verify — so if the page has changed by the time they look, the trust break is
immediate and self-inflicted. Everything else in the ending is excellent; this is a two-word problem.

**Jarring, mildly.** "That choice has now been sitting for ten years" sits four lines from a paragraph
that dates everything else absolutely. The register slips exactly once, in the diagnosis section.

## Red flags

### FUTURE-R1 — BLOCKER — Temporary customer attrition presented as permanent, already contradicted by the draft's own source

**Passage (two locations).** Benchmark table, row 2:

> "| Scale AI after he left it | Largest data customers cut ties within weeks over conflict-of-interest
> concerns; 200 employees, 14% of staff, laid off in July 2025 | Whether they left because of Meta or
> because of him |"

and the rabbit hole, "Stress and Growth Arrows":

> "Within weeks of the Meta deal, Scale's biggest data customers cut ties over conflict-of-interest
> concerns and the company laid off 200 people."

**Reader effect / trust problem.** Both passages read as settled, permanent attrition. A 2027 reader
who knows Google returned to Scale will conclude the article either did not check or chose the version
that made the story cleaner. The damage compounds because the growth-arrow argument depends on the
permanence: the 3-to-6 reading is "loyalty to a thing after it stops burnishing you, and after you are
the reason it is bleeding." If the bleeding partially stopped, the evidence for the arrow weakens, and
the rabbit hole's most confident type claim rests on a fact that has moved.

**Evidence / source.** Packet CLM-19 marks this **verified with caveat** and states the omission
explicitly: the draft's own source, Forbes 2026-05-14 (S-02), reports Google "resumed its work a few
months later"; OpenAI was the durable loss. This is not a future risk — it is already inaccurate on
2026-08-18, which is what makes it a blocker rather than a refresh item.

**Minimum viable repair.** Two clauses, no restructuring. In the table row: name OpenAI as the durable
loss and note Google's return. In the rabbit hole: change "Scale's biggest data customers cut ties" to
carry the split, so the growth-arrow argument leans on the loss that actually persisted rather than on
a total that did not.

**Expected benefit.** Removes the only already-false temporal claim in the piece; strengthens rather
than weakens the 6-arrow case, because the durable OpenAI loss is the better evidence and the piece
stops over-reaching for the total.

**Confidence.** High on the defect; medium-high on the specific wording of Google's return, since the
packet reached Forbes through a WebFetch summary rather than full text (S-02 limitation). The repair
should re-read the Forbes paragraph directly before writing the clause.

**Acceptance test.** Neither passage asserts or implies that Scale's largest data customers left
permanently; at least one names OpenAI as the durable loss and acknowledges Google's return; the
rabbit-hole growth-arrow sentence still works when read against the corrected fact.

## Specific improvements

### FUTURE-C1 — Date-stamp the ending's pricing observation and drop the verify-it-yourself imperative

**Passage.** "Read the pricing page. There is a standard tier, and beneath it a contributor tier at a
small fraction of the rate, where developers get cheap access in exchange for Meta using their prompts
and completions as training data."

**Reader effect.** In 2027, a reader who follows the instruction and finds different terms — or no
contributor tier — loses trust in the article's closing image, which is the image the whole piece has
been building toward since paragraph one.

**Evidence.** Packet timeline records Muse Code shipped **(beta)** on 2026-08-05 with $1.25/$4.25
standard against $0.10/$0.20 contributor; packet limitation #6 notes Meta's own documentation did not
carry the pricing terms when fetched, so the tier is sourced entirely to trade coverage. My own search
(Forbes 2026-08-06, MacRumors 2026-08-05, and several tool guides) confirms both the beta status and
the "prompts and completions" phrasing.

**Minimum viable repair.** Convert the present-tense observation into a dated historical one and cut
the imperative: state that at launch in August 2026 the price list carried a standard tier and, beneath
it, a contributor tier at a fraction of the rate. Optional strengthener available from current
coverage: the contributor tier is reported as the post-install default, which sharpens the argument
without adding fragility, since it too would be stated as an August 2026 fact.

**Expected benefit.** The ending becomes unfalsifiable-by-drift. The rhetorical force is unchanged —
"That is Scale AI. Same machine, new building." does not depend on the page still being live.

**Confidence.** High.

**Acceptance test.** No sentence in the closing section instructs the reader to consult a live page,
and every pricing-structure claim is bounded by an explicit date. Read with the pricing page assumed
deleted, the final four paragraphs still make sense.

### FUTURE-C2 — Give the three coupled status claims a single as-of anchor

**Passages.** Intro: "Today he is Meta's first Chief AI Officer. He runs Meta Superintelligence Labs".
FAQ 3: "He remains on Scale AI's board and no longer runs the company." Frontmatter: `occupation: -
'Chief AI Officer, Meta'`.

**Reader effect.** "Today" resolves to the reader's today. If the title or the board seat changes, the
article's first orientation sentence is wrong, the FAQ answer is wrong, and the structured data
published from `occupation` is wrong — three failures from one event, with no signal to the reader
that the piece was written before it.

**Evidence.** Verified current as of review: Wikipedia's _Meta Superintelligence Labs_ article, last
updated 2026-08-15, still lists Wang as Chief AI Officer leading MSL; the packet marks the board seat
verified (CLM-10). But the same article documents MSL already reorganized into four groups with
Friedman leading Products and Applied Research and Ramani leading Infra — the structure has changed
once inside the window this article covers. (A widely surfaced Medium post claims a March 2026
restructuring demoted Wang; I could not corroborate it in any reputable outlet and have not relied on
it.)

**Minimum viable repair.** Replace "Today he is" with a date-bearing construction in the intro; leave
the FAQ and frontmatter alone but add both to the refresh checklist below. One clause fixes the prose;
the checklist covers the rest.

**Expected benefit.** A role change becomes a scheduled edit instead of a silent error, and the intro
survives the change until the edit happens.

**Confidence.** High on the fragility; the role itself is currently accurate.

**Acceptance test.** The intro's first status sentence carries a date or an explicit as-of scope, and a
reader in 2027 can tell from the body alone which window the role claim describes.

### FUTURE-C3 — Tell the reader the benchmark section was written before the answer existed

**Passage.** "Three of those four will resolve with more data. The fourth is not a number, which is
exactly why it has done the most damage."

**Reader effect.** In 2027 those three rows will have resolved. The sentence correctly predicts it but
reads, after the fact, as though the article simply did not know — when in fact it did, and said so.
The row "Whether 3.8 points is a research gap or a calendar" will look answered rather than
deliberately open.

**Evidence.** Packet CLM-20: figures are vendor-reported with no independent leaderboard entry.
Meta shipped Muse Spark in April 2026, 1.1 in July, 1.2 in August — roughly a quarterly cadence, so
the version pairing in the row is likely obsolete well inside twelve months.

**Minimum viable repair.** One clause binding the prediction to its vantage point — that as of writing
in August 2026 three of the four were still open. The row itself needs no change; it is already dated.

**Expected benefit.** Converts an aging section into an explicitly time-stamped judgment, and the
third column keeps carrying the argument after the numbers stop mattering.

**Confidence.** High.

**Acceptance test.** A reader in 2027 can tell the article knew these rows would resolve and chose to
publish the open state.

### FUTURE-C4 — Bind the stock and sentiment claim to its reporting date

**Passage.** "Watch him try to hold it: a year in, CNBC reported that Meta's stock trailed every other
tech megacap and that developers remained skeptical the company could compete with OpenAI, Anthropic
and Google at all."

**Reader effect.** These are the two most volatile facts in the piece and they carry the harshest
version of the case against Wang. Presented without an inline date, a 2027 reader reads them as a
standing condition rather than a June 2026 snapshot, and if either has reversed, the steelman looks
stacked.

**Evidence.** Packet CLM-26 / S-24: CNBC, 2026-06-14. The claim is accurate; only its temporal framing
is loose.

**Minimum viable repair.** Add the month to the attribution — "CNBC reported in June 2026" — replacing
or supplementing "a year in."

**Expected benefit.** The steelman ages into evidence about a moment rather than a claim about the
present, and the sentence survives any market move without revision.

**Confidence.** High.

**Acceptance test.** The sentence names a month or a date, and remains accurate if Meta's stock rank
changes.

### FUTURE-C5 — Retire the two relative-duration constructions

**Passages.** Diagnosis: "That choice has now been sitting for ten years". Close: "Somewhere in that
pipeline right now is a developer solving a hard problem in a terminal at two in the morning".

**Reader effect.** "Ten years" is wrong by one on 2027-08-18 and drifts further each year; "right now"
resolves to the reader's now, which is precisely the register the rest of the piece avoids. Neither
breaks trust alone; together they are the only places the article's dating discipline lapses.

**Evidence.** Internal: the draft dates nearly every other claim absolutely (FUTURE-H2). The founding
is June 2016 (packet timeline), so "ten years" is anchored to 2026.

**Minimum viable repair.** Replace the duration with the origin year ("since 2016"). For the close,
either drop "right now" or accept it as deliberate present-tense scene-setting — it is the weakest item
in this review and a defensible authorial choice, so I record it as the lower-priority half.

**Expected benefit.** Removes silent annual drift at zero cost to the prose.

**Confidence.** High on the ten-years item; the "right now" half is closer to preference and should not
be promoted.

**Acceptance test.** No sentence states an elapsed duration that requires the reader to know the
publication year.

### FUTURE-C6 — Accept that the current-tense anchor cannot be kept current, and choose the anchor accordingly

**Passage.** The FORMULA FINGERPRINT LEDGER names the current-tense anchor as "Muse Code shipped
August 5, 2026, including the contributor tier"; the anchor appears in the intro ("On August 5, 2026,
that division shipped its first commercial product") and carries the entire closing section.

**Reader effect.** None today. The durability issue is structural: the anchor was already superseded
before publication, so any refresh strategy that depends on "keep the anchor current" will fail
continuously.

**Evidence.** Packet dispute #10 and limitation #9: Zuckerberg announced open-sourcing Muse Spark 1.2's
weights on 2026-08-10, five days after the anchor and eight days before the draft's date. Nothing in
the draft is contradicted — the hosted contributor tier and the open weights are independent — but the
cadence is established.

**Minimum viable repair.** No prose change required. Treat the anchor as dated-forever rather than
current (which C1 and C3 accomplish), and record in the refresh list that the Muse product line is the
fastest-moving surface in the article.

**Expected benefit.** The piece stops implicitly promising currency it cannot deliver, and the refresh
burden drops to the checklist below.

**Confidence.** High.

**Acceptance test.** No sentence claims or implies that the August 2026 product state is the latest
state.

### FUTURE-C7 — The LeCun H2 is a bet on a decaying query; its durable value is the psychology

**Passage.** H2 5: "What Yann LeCun said about Alexandr Wang, and what he got right", with FAQ 4
targeting "Why did Yann LeCun criticize Alexandr Wang?"

**Reader effect.** The HEADING MIX LEDGER classifies this as search-intent on a "live query family
since January 2026." News-pegged query families decay; by late 2027 this one may carry little volume,
at which point a search-intent heading is occupying the article's most valuable structural slot for a
question few people are asking. Meanwhile the section's genuinely durable content — "Tell a Three they
have not earned their position and you have not insulted them. You have agreed with them." — is
underneath a headline about a specific 2026 news event.

**Evidence.** Judgment call from the heading's own stated rationale plus the age of the news peg
(2026-01-05). I have deliberately not invented a future search-volume figure.

**Minimum viable repair.** None urgent. Flag for the twelve-month review: if the query family has
decayed, the durable move is to keep the section and re-title it around the enduring question (whether
a builder can lead researchers) while keeping LeCun named in the first line for entity coverage.

**Expected benefit.** Protects the article's best psychological writing from being filed under an
expired news query.

**Confidence.** Medium — this is a forecast about search behavior, and I am flagging it as a review
trigger rather than a change to make now.

**Acceptance test.** At the twelve-month review, the heading is re-evaluated against actual query data
rather than left unexamined by default.

### FUTURE-C8 — The $500M Thunderforge figure is a standing verification liability

**Passage.** "Scale won Project Thunderforge, a military planning program worth roughly $500 million,
and was selected for the Golden Dome missile-defense effort."

**Reader effect.** Government contract values get re-scoped, extended and re-reported; a single-outlet
dollar figure attached to a named program is the kind of claim that quietly diverges from the record.

**Evidence.** Packet CLM-13 marks this **disputed** and calls it the largest unresolved evidence gap:
Forbes 2026-05-14 (S-02) states it directly, but the March 2025 DIU Thunderforge prime award published
no dollar figure (S-09) while the $500M attaches to a May 2026 CDAO contract that was 5× a September
2025 $100M deal (S-12) — two offices, fourteen months apart.

**Minimum viable repair.** Outside my lane to adjudicate, and I defer the factual call to the
perspectives that own it. In durability terms the ask is narrower: whatever figure survives should be
attributed and dated in-line, so that a later divergence reads as "as reported in May 2026" rather than
as a bare claim the article got wrong.

**Expected benefit.** A contested number ages into an attributed report instead of an error.

**Confidence.** High that it needs dating; the underlying factual dispute is not mine to resolve.

**Acceptance test.** Any surviving dollar figure for Pentagon work carries its source and date in the
sentence, and the refresh list includes a primary contract-record check.

## Twelve-month refresh list

Concrete checks for a review on or near **2027-08-18**. Ordered by consequence. Note that `lastmod` is
managed manually by DJ and is deliberately not part of this list.

1. **Wang's role.** Is he still Meta's Chief AI Officer leading MSL? Update the intro status sentence,
   FAQ 3, and frontmatter `occupation` / `knows_about` together — they fail as a set. Sources: Meta
   leadership page, Wikipedia _Meta Superintelligence Labs_.
2. **The Scale board seat.** FAQ 3 asserts "He remains on Scale AI's board." Verify independently of
   the Meta role; the two can diverge.
3. **Muse Code's contributor tier.** Still live? Still beta? Prices unchanged? The closing section
   depends on it. If C1 is applied, this becomes a nice-to-have rather than a correction.
4. **Scale's customer base.** Beyond the FUTURE-R1 fix: has OpenAI returned, has Google's resumed work
   held, have new losses occurred? Both the table row and the rabbit-hole growth arrow read against it.
5. **The benchmark row.** Muse Spark 1.2 / Terminal-Bench 2.1 / Claude Opus 5 will all be superseded.
   Decide deliberately: refresh the numbers, or freeze the row as an August 2026 record and say so.
6. **The MSL retention row.** "At least eight" is a floor anchored to "first weeks," so it stays true —
   but check whether the twelve-month picture makes it read as understatement.
7. **LeCun.** Has his startup shipped, folded, or been vindicated? The section survives either way, but
   one clause may be worth adding. Also re-evaluate the H2 against real query data (C7).
8. **The Meta stock / developer-sentiment claim.** If C4's date is added, no action; if not, re-verify.
9. **The Thunderforge $500M dispute.** Settle it with a primary record — USAspending or a DIU contract
   announcement — as the packet recommends (limitation #5).
10. **The two named falsifiers.** Has anything emerged documenting a stretch where pressure made Wang
    go quiet and stay quiet, or a choice of knowing over being seen to deliver? This is the only check
    that could change the type call, and the draft has already specified it.

**What remains valuable if every one of these is removed:** the Los Alamos childhood, the math
competition and the fourth-place placement, the Scale AI thesis, the Remotasks labor record, the Lucy
Guo thread, MEI, the all-hands scene, the heart-triad hinge, and the entire Enneagram argument. That is
the large majority of the piece, and it is why the recommendation is `revise` rather than anything
heavier.

## Follow-on questions

**FUTURE-Q1 — Does Wang still hold the Chief AI Officer title and MSL leadership at refresh time?**
_What it changes:_ the intro's orientation sentence, FAQ 3, and the structured data emitted from
frontmatter — the three coupled claims in C2. _Best source:_ Meta's own leadership page, cross-checked
against Wikipedia's MSL article (which was current to 2026-08-15 when I checked).

**FUTURE-Q2 — Did Google's resumption hold, and did OpenAI ever return?**
_What it changes:_ the blocker repair's wording, and how much weight the rabbit hole's 3-to-6 growth
argument can carry. If both major customers eventually returned, the growth-arrow evidence largely
dissolves and that subsection needs rethinking, not editing. _Best source:_ full text of Forbes
2026-05-14 (S-02), then subsequent Scale customer reporting.

**FUTURE-Q3 — Is the Muse Code contributor tier a permanent pricing structure or a beta-period
acquisition tactic?**
_What it changes:_ whether the ending is a durable observation about Wang's operating pattern or a
snapshot of a launch promotion. If it is a tactic that gets withdrawn, the "same machine, new building"
claim is still true about Meta's intent but loses its live proof. _Best source:_ Meta's Muse Code
pricing and data-use documentation directly — the packet notes Meta's own blog did not carry the terms
when fetched, so this needs a product-page read rather than trade coverage.

**FUTURE-Q4 — Does the $500M attach to Thunderforge or to the separate CDAO award?**
_What it changes:_ one sentence in the body, and whether the article inherits a Forbes conflation.
_Best source:_ USAspending or DIU contract records (packet limitation #5).

**FUTURE-Q5 — Has any of the six unmined long-form interviews surfaced a documented withdrawal under
pressure?**
_What it changes:_ the type call itself, by the draft's own stated criteria. _Best source:_ the
Lightcone (Jun 2025), CSIS (May 2025), Washington Post Futurist Summit (Oct 2023, full official
transcript), No Priors, Accel and Stanford eCorner sessions listed in packet limitation #4.

## Preserve list

Items whose durability value would be lost if revision touched them:

- **The Disney World spine in all its positions** — epigraph, opening paragraph, and the closing "Top
  four in New Mexico. He came fourth." This is the article's decay-proof core.
- **"(Meta's reported figures, August 2026)"** — verbatim. Three hedges in six words.
- **The benchmark table's third column header and contents** — "What the score cannot see." The
  durable half of a perishable section; refresh the results column, never this one.
- **"Three of those four will resolve with more data. The fourth is not a number"** — the article's own
  statement of what will age. C3 adds a clause to it; it should not be cut.
- **"Two findings would overturn the call... Neither is in the record so far."** — including "so far."
  This is what makes the piece re-checkable in 2027 rather than merely old.
- **The stress-arrow refusal** — "asserting it would be inventing evidence." Cannot be falsified by
  future reporting, only completed by it.
- **LeCun's declared interest** — "LeCun left Meta in November 2025 to start a company that competes
  with the one he was describing." Absorbs any 2027 outcome without revision.
- **"Tell a Three they have not earned their position and you have not insulted them. You have agreed
  with them."** — carries zero temporal dependency and is the reason the LeCun section will outlive the
  LeCun news cycle.
- **The absolute-date habit throughout.** Every "On January 5, 2026" and "in July 2025" is a small
  durability deposit.
- **Title, meta_title and description** — no dated claims; the SERP asset does not decay.

## Research log

Protocol: packet read in full before role-specific research; three sources consulted beyond it, within
the 2–4 allowance.

| #   | Question                                                                                                                                                                         | Resolved by                                                                                                                               | Decision it affected                                                                                                                                                                                                                                                                       |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Which draft claims are dated, unresolved, status-sensitive, or fragile?                                                                                                          | Evidence packet — dated timeline, claim inventory (CLM-01→33), disputes #4 and #10, limitations #6 and #9                                 | Established the whole finding set; no external research needed for most of it. Disputes #10 and CLM-19 came directly from the packet and became C6 and R1.                                                                                                                                 |
| 2   | Is Wang still Meta's Chief AI Officer, and is any reorg reported that makes the present-tense frame perishable within 12 months?                                                 | WebSearch (2026-08-18); then WebFetch of Wikipedia, _Meta Superintelligence Labs_, article updated 2026-08-15                             | **Downgraded a candidate blocker to C2.** The role is current, so "Today he is Meta's first Chief AI Officer" is accurate at review time. The Wikipedia article also documents the four-group MSL structure, which supplies the churn evidence C2 rests on.                                |
| 3   | Same query surfaced a Medium post ("The Meta Restructuring No One Is Talking About... Alexandr Wang is the First Casualty") claiming a March 2026 reorg stripped Wang's autonomy | Attempted corroboration via Wikipedia MSL — no mention of the claimed reorg, Maher Saba, or an Applied AI Engineering unit under Bosworth | **Rejected as evidence.** Tier-4 blog, uncorroborated. Recorded in C2 as explicitly not relied upon. Community discussion cannot prove facts.                                                                                                                                              |
| 4   | Is the Muse Code contributor tier introductory/beta pricing rather than a stable structure, and is "prompts and completions" the right characterization?                         | WebSearch (2026-08-18) returning Forbes 2026-08-06, MacRumors 2026-08-05, and several tool guides                                         | **Confirmed beta status** → C1's core argument. Also **reduced** an unrelated risk: multiple outlets render the trade as "prompts and completions," so the draft's phrasing is better supported than packet dispute #4 suggests — recorded in What missed rather than raised as a finding. |

Packet material reused without re-research, per protocol: the Scale board seat (CLM-10), the CNBC
stock/sentiment date (CLM-26/S-24), Google's resumption (CLM-19), the Thunderforge dispute (CLM-13),
the open-weights announcement (dispute #10), and the Muse product cadence (timeline).

## Limits of this review

- **I audited only `draft-reviewed.md`**, sha256 verified against `context.json` and the supplied
  `--draft-sha`. I did not read the live draft, and I did not open `subject.md`, `fan.md`, `critic.md`,
  `unfamiliar.md`, `enneagram.md` or `synthesis.md`.
- **The snapshot contains pipeline commentary** — a FRESH EYES REVIEW, SECOND PASS NOTES and a COHESION
  PASS block, all in HTML comments after the body. I read them because they are in the file, and I have
  not treated any of their claims, grades or self-assessments as evidence. Every finding above is
  derived from the reader-visible draft, the packet, or my own three sources.
- **I did not forecast events.** Where I say something is likely to change, the basis is an observed
  cadence (three Muse releases in five months; one MSL reorg already inside the covered window) or an
  explicitly provisional status (beta pricing), never a prediction about what will happen.
- **My blocker rests on the packet's reading of Forbes**, which the packet reached through a WebFetch
  summary rather than full text (S-02 limitation). I am confident the defect is real; the exact wording
  of Google's return should be re-read at the source before the repair is written.
- **C7 is a forecast about search behavior**, not a measurement, and I have marked it medium confidence
  and framed it as a review trigger rather than a change to make now.
- **Factual adjudication outside my lane** — the Thunderforge $500M dispute, the "two never formally
  started" row (CLM-18), the "he has made every room by exactly one spot" generalization (CLM-27), and
  the authored interiority of the `inner-thought` paragraph (CLM-23) are all flagged in the packet and
  belong to the critic, subject and enneagram perspectives. I raised only the temporal facet of the
  first and left the rest alone rather than inflate my count.
- **No independent verification of the Enneagram call**, which is outside the durability contract. I
  assessed only whether the type argument depends on perishable evidence. It largely does not.
