<!-- docs/content-research/2026-09-01_emerging-entity-gap-scout.md -->

# Emerging Entity Gap Scout — 2026-09-01

## Top actions

| Rank | Person                   | Action                    | Score | Catalyst                                                            | Why the SERP is winnable                                                                                                                                     |
| ---: | ------------------------ | ------------------------- | ----: | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|    1 | Dylan Patel              | CREATE (on hold)          |    83 | SemiAnalysis scaling into the AI-capex cycle; no encyclopedia entry | Wikipedia returns 404. Top ten is official bio, Crunchbase, LinkedIn, X, a speaker directory, and generated bio farms — zero dedicated biographies           |
|    2 | David Friedberg          | FIXED 2026-09-01          |    52 | All-In durability; 47 live biography-fact queries                   | `david friedberg wife` page one is entirely content-farm slop and 9takes sits at position 7.8, but our page carried an unsourced family claim. Now corrected |
|    3 | Ashby / Coogan / Hormozi | AWAIT MEASUREMENT         |     — | Retrofits shipped 2026-08-12                                        | Already live. Nothing to ship; the 28-day read is due ~2026-09-09                                                                                            |
|    4 | Dario Amodei             | PROTECT — do not optimize |    34 | Rumor-driven query surge about a private third party                | 9takes ranks page-one on it with correctly sourced content. Leave it alone; optimizing means serving the rumor                                               |

**Single highest-ROI action:** none is outstanding. The August 12 retrofits are live and the only
thing left for them is the September 9 measurement. **Single highest-ROI new subject:** Dylan Patel,
on hold at DJ's direction.

> **Correction (2026-09-01, same day).** The first version of this scout claimed the three August 12
> retrofits had never been applied, and ranked shipping them as the top action. That was wrong, and
> the root cause is worth recording because it is preventable.
>
> **The answer was already written down and I did not read it.** Each packet in
> `docs/content-analysis/entity-gaps/` carries a `retrofit_applied_at` field, and all three said
> `'2026-08-12'`. Instead of reading that field I inferred ship-state from two things that are not
> evidence: stale `lastmod` values, which the push script preserves by design, and the `title:`
> frontmatter still reading `Ashby: …`, when the page H1 is not built from `title:` at all. The H1
> comes from `formatPersonalityDisplayName()`, which already carries an `ashby: 'Ashby Florence'`
> override.
>
> Confirmed afterwards three independent ways: commit `eb53bc9de` (2026-08-12) modified all three
> drafts, the display-name override is committed, and the live DB rows carry the identity decks with
> 7 / 6 / 8 FAQs. The retrofits are done.
>
> **Process rule going forward:** ship-state is read from `retrofit_applied_at` in the packet, then
> confirmed against git and the DB. Never from `lastmod`, and never from `title:`.

## The finding that should change the process

Across 444 published personality pages, exactly **two** have penetrated an exact-name SERP:
Jordi Hays and Ashby Florence. Everything else that appears to rank on a person's name is actually
ranking on a typology-modified query.

```
ryan-gosling   →  "ryan gosling personality" 863i, "ryan gosling personality type" 496i
                  bare "ryan gosling": 0 impressions
ishowspeed     →  "ishowspeed personality" 860i
                  bare "ishowspeed": 0 impressions
jordi-hays     →  "jordi hays" 4,439i · age 441i · wife 286i · wikipedia 58i · background 27i
ashby          →  "ashby florence" 935i · boyfriend 35i · real name 11i · who is 8i
```

Jordi Hays alone produced **121 of 433 personality-analysis clicks (27.9%)** in the 98-day window.
The entity-gap thesis is not marginally true; it is where nearly a third of the section's traffic
comes from, concentrated in one page.

The corollary is the process problem. Thirty entity-gap packets have been written since 2026-08-12,
and **28 of them classify as pass or watchlist**. The audits are consuming most of the effort and
returning almost no candidates, because nearly every subject the queue proposes already has a
personal Wikipedia article. In this session's live checks, Michael Truell, Nikita Bier, Fanum,
Harry Stebbings, Brad Gerstner, Scott Wu, Joseph Zada, and Tom Rhys Harries all have one.

**Recommended screen change:** make an `en.wikipedia.org/wiki/<Name>` existence check the first
gate, before any scoring. It is one request, and on this session's evidence it eliminates roughly
85–90% of candidates. Score only what survives.

## Scorecards

### Dylan Patel — 83/100 — DIAMOND

- **Demand trajectory: 15/20** — SemiAnalysis is reported moving from roughly $20M to a projected
  $100M in annual revenue with about 60 employees, inside the AI-capex cycle that dominates 2026 tech
  coverage. Sustained and current rather than spiking. Directional: no Trends or volume tool was used,
  and 9takes has no page, so there is no GSC signal.
- **SERP weakness: 23/25** — `en.wikipedia.org/wiki/Dylan_Patel` returns HTTP 404. First page is
  SemiAnalysis's own bio, Crunchbase, X, LinkedIn, a SEMI event speaker directory, podcast episode
  pages, a Grokipedia entry, and generated bio farms (`leaderbiography.com`, `wikibiostar.com`). No
  dedicated substantial biography of him exists.
- **Biography intent: 12/15** — the farms publish "Dylan Patel Biography, Age, Wife, Family, Net
  Worth," which is direct evidence of the query families. Who-is, age, education, origin story, and
  company intent are all live.
- **Source depth: 14/15** — Lex Fridman #459 is a five-hour conversation with a full published
  transcript; plus Latent Space, Sequoia's podcast, and his own extensive first-person writing.
  Named third-party praise from Jensen Huang is reported and should be pinned to a primary source
  before use.
- **9takes fit: 9/10** — a rural-Georgia beekeeper with no semiconductor degree became the industry's
  most-cited analyst, and now publishes what the companies he depends on for access would rather hide.
  That is a real contradiction, not a fact list. The techie/business-creator niche is also 9takes'
  best-performing cluster by CTR (Jordi 2.18%, Leila 1.24%, Dario 0.98%, Coogan 0.80%) against a
  0.57% comparable-page median.
- **Timing / index advantage: 7/10** — early, but no existing indexed URL to inherit.
- **Entity clarity: 3/5** — `Dylan Patel` is a common name. The observed top ten was entirely the
  right person, but the page must disambiguate on SemiAnalysis explicitly.
- **Penalties: 0.**

### David Friedberg — 52/100 — WATCHLIST; defect found and fixed 2026-09-01

Figures in this scorecard come from the 98-day export (May 5 – Aug 11). The retrofit brief below uses
a fresh 28-day capture (Aug 3 – Aug 30), so the two sets of numbers differ by window, not by
disagreement.

- Demand trajectory: 11/20 — durable All-In audience; 506 impressions across 47 queries in the 98-day
  window, not clearly rising.
- SERP weakness: 14/25 — split. His bare name is owned by an incumbent stack and 9takes sits at
  position 23.7 on it. The _fact_ queries are a different story: `david friedberg wife` page one is
  entirely generated content farms.
- Biography intent: 13/15 — proven directly by GSC: wife (268i @ 7.8 over 98 days), wife and kids,
  where was he born, children, is he married, net worth.
- Source depth: 13/15 — extensive first-person podcast record; a full 9takes draft already exists.
- 9takes fit: 8/10 — the privacy reflex inside a cast of exhibitionists is already the draft's thesis.
- Timing / index advantage: 9/10 — already indexed and ranking 7.6–10.2 on several fact queries.
- Entity clarity: 4/5.
- Penalties: −20 (personal Wikipedia plus an established incumbent biography stack).

### Dario Amodei — 34/100 — PASS as an opportunity; PROTECT as an asset

- Demand trajectory: 12/20 — 507 impressions across 36 queries, but roughly 44% of it is a single
  cluster: `dario amodei girlfriend`, `jade wang dario amodei`, and variants at positions 5.6–9.4.
- SERP weakness: 12/25 — weak only because the topic is rumor, and the competing sources are X posts,
  Threads, a KuCoin community item, and Instagram aggregators.
- Biography intent: 6/15 — the visible intent is not biography. It is a geopolitical rumor that a
  decade-old relationship explains Anthropic's China policy.
- Source depth: 14/15.
- 9takes fit: 6/10.
- Timing: 5/10. Entity clarity: 5/5.
- Penalties: −26 (−20 personal Wikipedia and major profiles; −6 partial, applied for search need that
  is primarily gossip about a private third party — the full −10 is not applied because the existing
  page answers it responsibly rather than chasing it).

## Retrofit status

### Ashby Florence, John Coogan, Leila Hormozi — shipped 2026-08-12, awaiting measurement

All three retrofits specified in the August 12 brief are live. No action is outstanding.

| Page          | Position (07-25 → 08-01 → 08-13) | CTR                   | Live state                          |
| ------------- | -------------------------------- | --------------------- | ----------------------------------- |
| ashby         | 9.1 → 9.3 → 9.2                  | 1.11% → 0.89% → 0.63% | identity deck + 7 FAQs, H1 override |
| john-coogan   | 10.8 → 10.6 → 7.8                | 0.65% → 0.60% → 0.80% | identity deck + 6 FAQs              |
| leila-hormozi | 9.6 → 9.9 → 10.1                 | 0.77% → 1.11% → 1.24% | identity deck + 8 FAQs              |

**The crucial timing point:** the GSC window in these exports ends 2026-08-11, and the retrofits
shipped 2026-08-12. Every number above is therefore **pre-intervention**. The Ashby CTR decline from
1.11% to 0.63% is not a retrofit failure — it is the baseline condition the retrofit was built to
address, and it is a clean one: rank flat at ~9.2 while impressions more than tripled (449 → 672 →
1,597). That is demand expansion outrunning snippet fit, which is exactly what an identity deck and
biography FAQs are supposed to fix.

Two observations worth carrying forward:

- **John Coogan's page improved 10.8 → 7.8 before the retrofit landed**, so the September read must
  not attribute that movement to the intervention.
- **Bare `john coogan` sits at position 26.0** with a single impression, identically across all three
  exports; the page earns its traffic from `john coogan wife` (108i, 5 clicks, 4.63% CTR, position
  9.7). The August 12 brief recorded the exact-name query at position 1.6. Nothing in these three
  exports supports that number — treat it as unverified and do not use it as a baseline.

### David Friedberg — defect found and fixed, 2026-09-01

- **Baseline** (captured live 2026-09-01 for Aug 3 – Aug 30, saved to
  `docs/data/gsc/experiments/2026-09-01-friedberg-baseline.json`): page 9 clicks / 700 impressions /
  1.29% CTR / position 16.5. Biography family 1 click / 182 impressions / 0.55% CTR / position 9.9.
  `david friedberg wife` 1c / 150i / 0.67% CTR / position 8.4. Also live and directly served by the
  new FAQ: `is david friedberg married` (9i, position 11.3) and `david friedberg children`. The
  competing page one on the wife query is entirely generated content farms.
- **Defect:** the page stated "He has a wife, Allison Broude Friedberg, and three children in San
  Francisco." The **three children** claim traces only to those same content farms. Asserting
  unverified details about a private family, inside a paragraph whose whole point is that Friedberg
  guards his privacy, was both a sourcing failure and self-undermining as writing.
- **Fix applied:** the children claim is cut. The marriage is retained because it is genuinely
  sourceable — Getty's caption reads verbatim: _"(L-R) Allison Broude Friedberg, director at
  SmartStart SF, and David Friedberg, founder and chief executive officer of The Production Board,
  attend the annual Allen & Company Sun Valley Conference, July 11, 2019."_ The Getty URL is now in
  `citations`. A `Who is David Friedberg's wife?` FAQ answers the 268-impression query with the
  sourced facts and states plainly that circulating claims about his children are unsupported.
- **A correction inside the correction:** the first draft of this fix described the photograph as
  "San Francisco benefit photography." That was wrong — I had conflated the Getty image with a
  separate Drew Altizer credit. The verified caption is Sun Valley, Idaho, July 2019, and the live
  copy now says so.
- **Predicted 28-day effect:** biography-family CTR 0.55% → 0.9–1.8% at roughly stable position.
  Deliberately modest. The farms will always offer a more satisfying fabricated answer, and 9takes
  should not compete on that. If CTR does not move, that is an acceptable outcome: the fix was made
  because the claim was unsourced, not because it was underperforming.

### Dario Amodei — PROTECT, and explicitly do not optimize

The page currently ranks page-one on `dario amodei girlfriend` and the `jade wang` cluster. The
content behind that ranking is legitimate: Jade Wang gave on-record testimony to Alex Kantrowitz's
Big Technology profile about the medical breakthrough that followed his father's death, and the page
uses it to explain his urgency. That is a named third-party source, not gossip.

The incoming demand, however, is being driven by an X and Threads narrative speculating that a
relationship from the early 2010s explains Anthropic's China policy. The 0.72% CTR is low because
the searcher wants the rumor and the snippet does not promise it. **That is the correct outcome.**
Raising that CTR would mean serving the rumor. Take no action, add no rumor-adjacent content, and do
not treat this cluster as an optimization target in a future scout.

## Creates and watchlist

- **Dylan Patel — CREATE, on hold.** The only clean new entity gap found this session. DJ elected on
  2026-09-01 to hold rather than draft; no packet was written. The gap is unlikely to close quickly
  precisely because no encyclopedia editor has claimed him yet, but re-verify the Wikipedia 404
  before any future drafting run.
- **Joseph Zada — 67, PROMISING, but not an entity gap.** The 2026-08-26 scout flagged him for this
  audit; resolving it: he has a full personal Wikipedia article carrying real name (Joseph Cumpston),
  birth date, height, parents, and heritage. The rest of the SERP is genuinely thin — TMDB, IMDb,
  Fandom, a speaker-bureau auto-bio, a fashion-magazine interview — but Wikipedia owns the generic
  biography query. Proceed on subject-selection merit through the normal people pipeline ahead of the
  November 20 release; do not wait for an entity-gap justification that will not arrive.
- **Tom Rhys Harries — 61, PROMISING, not an entity gap.** Also flagged on 2026-08-26; resolving it:
  full personal Wikipedia article including his relationship with Amy Allen. Note a live factual
  conflict — search results give his birth year as 1990, Wikipedia as 1992. Verify before any draft
  states an age. Clayface is dated October 23.
- **Erik Torenberg — WATCH.** Genuinely has no Wikipedia entry and the right structural shape, but the
  a16z/Turpentine catalyst is from April 2025 and biography intent looks thin. Revisit only on a new
  catalyst.

## Rejected false positives

Checked live this session and rejected on a personal Wikipedia article:

- **Michael Truell** (Cursor/Anysphere) — Wikipedia plus a Forbes profile; the June 2026 SpaceX
  acquisition filled the SERP completely. High demand, no gap.
- **Nikita Bier** — Wikipedia; also TechCrunch and SF Standard profiles.
- **Fanum** — Wikipedia (`Fanum (streamer)`), plus an AMP collective article.
- **Harry Stebbings** — Wikipedia, plus a separate `20VC` article.
- **Brad Gerstner** — Wikipedia.
- **Scott Wu** — Wikipedia, plus `Cognition AI` and `Devin AI` articles.

The pattern is consistent enough to be predictive: by 2026 the encyclopedia has caught up with almost
everyone who has a current catalyst large enough to matter. What survives is people whose notability
is real but institutionally unrecognised — niche-authority figures, podcast co-hosts, character
creators, analysts. That is the lane Jordi Hays, Ashby, John Coogan, and now Dylan Patel occupy.

## Method and caveats

- Local prefilter: `node scripts/emerging-entity-gap-candidates.mjs --limit 40` against the
  2026-08-13 export. Its score is a local-signal prefilter and is not an SEO difficulty score.
- GSC window: 2026-05-05 to 2026-08-11, 98 days, per `docs/data/gsc/latest.json`. **The export is
  three weeks stale as of today.** A fresh pull would strengthen every baseline here.
- The `page-query` export is capped at 5,000 rows and `queries` at 1,000. Low-volume pages drop out
  entirely — this is why Leila Hormozi has page-level rows but no query-level rows, and why the
  single-impression tail of the penetration list is alphabetically skewed and should not be read as a
  complete census.
- The three exports compared are overlapping rolling windows of differing length. Impression and
  click counts across them are **not** additive or directly comparable. Only position and CTR, which
  are ratios, are used for cross-export comparison here.
- Live SERPs checked 2026-09-01 from a US context. Results vary by location, device, personalization,
  and date.
- No search-volume, Google Trends, or backlink tool was used. All demand statements are directional
  and name their evidence. Backlink counts are unknown and form no part of any score.
- Wikipedia absence for Dylan Patel was verified by direct fetch returning HTTP 404, not inferred from
  search results.
- Retrofit ship-state was verified three ways rather than inferred: `git show --stat eb53bc9de`,
  the committed `PERSONALITY_DISPLAY_NAME_OVERRIDES` entry, and a live DB query confirming the
  identity decks and FAQ counts. `lastmod` values were **not** used as evidence of shipping; the push
  script preserves them by design.
- One production row was modified by this session: `david-friedberg`, applied via
  `node scripts/personBlogParser.js David-Friedberg --apply --expected-content-hash=… --approve-fields=content,faqs,citations`.
  `lastmod` was preserved at 2026-02-20 and the row remains published. No other blog, queue entry,
  database row, or generated file was touched.

## Measurement plan

The 2026-08-12 baseline (`docs/data/gsc/experiments/2026-08-12-baseline.json`) covers July 14 –
August 10, and its 28-day check is due around 2026-09-09. **That check is valid.** The interventions
it measures shipped on 2026-08-12, one day after the baseline window closed, so the experiment has a
clean pre/post boundary. Read it as planned.

Two cautions when reading it:

1. **Separate demand from rank from CTR.** Ashby's pre-intervention pattern was flat rank with
   tripling impressions and falling CTR. Success there looks like CTR recovery at roughly stable
   position, not a rank jump.
2. **Do not credit the retrofit for John Coogan's 10.8 → 7.8 move.** That happened before the
   intervention landed.

Separately, `david-friedberg` has its own pre-fix baseline captured and saved at
`docs/data/gsc/experiments/2026-09-01-friedberg-baseline.json` (Aug 3 – Aug 30). First read due
around 2026-09-29, via:

```bash
node scripts/capture-entity-gap-experiment.mjs \
  --label 2026-09-29-friedberg-check --days 28 --slugs david-friedberg
```

Compare the `biography` family CTR and position, not the page totals — the page total is dominated by
the `arma` and bare-name queries that sit past position 20 and have nothing to do with this change.
