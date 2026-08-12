<!-- docs/content-research/2026-08-12_emerging-entity-gap-scout.md -->
# Emerging Entity Gap Scout — 2026-08-12

## Top actions

| Rank | Person                     | Action                 | Score | Catalyst                                             | Why the SERP is winnable                                                                               |
| ---: | -------------------------- | ---------------------- | ----: | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
|    1 | John Coogan                | RETROFIT               |    91 | TBPN growth + OpenAI acquisition                     | No personal Wikipedia; exact-name demand is rising while thin inaccurate profiles fill the gap         |
|    2 | Ashby Florence             | RETROFIT               |    89 | Viral character career expanding into Smosh          | No personal Wikipedia; exact-name query is large and the current 9takes H1 used only `Ashby`           |
|    3 | Leila Hormozi              | RETROFIT               |    73 | Durable founder audience and current chairwoman role | Strong official bio but no personal Wikipedia; 9takes can offer a deeper sourced psychological profile |
|    4 | Sky Bri                    | OPPORTUNISTIC RETROFIT |    69 | Continued current-status searches                    | Weak broad biography SERP, but adult/SafeSearch intent makes this a confounded strategy test           |
|    5 | Clavicular / Braden Peters | WATCH                  |    64 | High creator search interest                         | No personal Wikipedia, but the gap is closing and health/legal claims raise editorial risk             |

## Scorecards

### John Coogan — 91/100 — DIAMOND

- Demand trajectory: 20/20 — 857 document impressions in the latest 28 days; TBPN/OpenAI is ongoing.
- SERP weakness: 20/25 — official/social results plus thin, visibly inaccurate profile pages.
- Biography intent: 12/15 — exact name, wife, age, education, height, and who-is queries are visible.
- Source depth: 15/15 — extensive first-person interviews, collaborator testimony, major coverage.
- 9takes fit: 10/10 — curiosity versus confinement is ownable and evidence-backed.
- Timing/index advantage: 10/10 — recently indexed page already averages position 5.6 overall.
- Entity clarity: 4/5 — unrelated Coogans appear, but TBPN disambiguates the subject.
- Penalties: 0.

### Ashby Florence — 89/100 — DIAMOND

- Demand trajectory: 19/20 — 1,406 document impressions and 919 exact-name impressions in 28 days.
- SERP weakness: 21/25 — Famous Birthdays/fandom/social/event coverage; no personal Wikipedia.
- Biography intent: 12/15 — boyfriend, real name, who-is, origin, and career queries.
- Source depth: 13/15 — several first-person interviews plus current appearance records.
- 9takes fit: 9/10 — disciplined performer versus accidental character breakout.
- Timing/index advantage: 10/10 — indexed page sits near page-one threshold with a fixable name miss.
- Entity clarity: 5/5.
- Penalties: 0.

### Leila Hormozi — 73/100 — PROMISING

- Demand trajectory: 14/20 — durable but current rolling demand is flatter than John or Ashby.
- SERP weakness: 13/25 — no personal Wikipedia, but her official About page is a strong incumbent.
- Biography intent: 10/15 — role, education, family, maiden-name and identity intent exists.
- Source depth: 15/15 — unusually deep first-person record plus current reported coverage.
- 9takes fit: 9/10 — strong Type 3 contradiction and differentiated operational lens.
- Timing/index advantage: 7/10 — indexed profile at position 10.5 has room to move.
- Entity clarity: 5/5.
- Penalties: 0.

## Retrofit briefs

### Ashby Florence

- Baseline: 9 clicks / 1,406 impressions / 0.64% CTR / position 9.3 in July 14-August 10.
- Missing intent: exact full name in H1/schema; direct who-is, real-name, and origin answers.
- Protected: URL, cinematic opening, character-escape thesis, source-backed Type 7 analysis.
- Change: entity display-name override, name-first title/description, two-paragraph identity deck,
  sourced biography FAQs.
- Predicted effect: exact-name CTR 0.11% to 0.35-1.0%; exact position 9.7 to 7.5-9.5.

### John Coogan

- Baseline: 8 / 857 / 0.93% / position 5.6; exact query 0 / 404 / 0% / position 1.6.
- Missing intent: search title presented the page as Enneagram-only despite a strong biography.
- Protected: URL, curiosity thesis, career spine, critique, sourcing, OpenAI-era close.
- Change: name-first thesis title, direct identity deck, company and education FAQs.
- Predicted effect: exact-name CTR 0% to 0.5-2.0% with position remaining 1-4.

### Leila Hormozi

- Baseline: 5 / 274 / 1.82% / position 10.5; exact-name query data withheld.
- Missing intent: direct current identity/role and education layer.
- Protected: URL, assets/bridge opening, shame thesis, 5-minute rule, sensitive source boundaries.
- Change: name-first title, short official-bio-based identity deck, current-role/education FAQs.
- Predicted effect: page CTR 1.82% to 2.2-3.8%; position 10.5 to 8.5-10.5.

## Creates and watchlist

- Sky Bri has the largest raw opportunity among the non-core shortlist, but current-status adult
  content and SafeSearch make it a poor causal test of the general strategy.
- Clavicular/Braden Peters has a real identity-label gap, but recent coverage is filling the SERP and
  the existing draft's drug, health, and legal claims require a separate risk audit.
- Tara Yummy has a weak SERP and good sources, but demand is cooling.
- Sam Parr and Shaan Puri have weak personal biography SERPs but insufficient current growth.
- Alex Lieberman is structurally promising but still has too little observed demand.

## Rejected false positives

- Michael Seibel, John Ternus, Dario Amodei, David Friedberg, Garry Tan, Caleb Hearon, Taylor Frankie
  Paul, and Shawn Ryan now face personal Wikipedia and/or strong official/major-publisher biography
  stacks. Traffic or a rising name alone does not make the SERP weak.
- High-impression celebrities surfaced by the local prefilter are established-entity competition,
  not Emerging Entity Gaps.

## Method and caveats

- Local prefilter: `scripts/emerging-entity-gap-candidates.mjs` using the May 1-July 30 rolling export.
- Independent read-only agent validated the shortlist against current SERPs and local drafts.
- Live SERPs checked August 12, 2026; results vary by locale, device, and personalization.
- Experiment baseline: `docs/data/gsc/experiments/2026-08-12-baseline.json`, July 14-August 10.
- Fragment/passage URLs are retained as diagnostics but excluded from primary page/query metrics.
- GSC suppresses some low-volume queries; visible query-family counts do not equal all page traffic.
- No backlink tool was used. Backlink counts are unknown and not part of the score.
