---
person: 'Shyam-Sankar'
audited_at: '2026-10-04'
classification: 'diamond'
recommended_action: 'create'
score: 81
biography_intent: true
personal_wikipedia: false
source_gate: 'pass'
queued_at: '2026-10-04'
path: docs/content-analysis/entity-gaps/Shyam-Sankar.md
---

# Emerging Entity Gap Packet: Shyam Sankar

Scored in the discovery scout `docs/content-research/2026-10-04_emerging-entity-gap-scout.md`
(full scorecard and arithmetic there). Queued for the nightly pipeline on 2026-10-04 as `shyam-sankar`.

## Why now

_Mobilize_ (2026-03-17) is an NYT/LA Times/USA Today bestseller. C-SPAN book talk 2026-04-25. 2026 podcast run (a16z, American Optimist, School of War). Palantir CTO and Army Reserve lieutenant colonel. Sustained, not spiking.

## Exact-name SERP map

Wikipedia 404, no draft, no deletion log. Top results: Hudson expert page, Amazon author store, speaker bios, Shortform summary, Fox Business video, Benzinga, Simon & Schuster, Trinity Prep alumni page, Revolving Door Project (critical), one Substack profile.

## Biography-intent map, source inventory, content requirements, claims to avoid

Kept in one place so the pipeline consumes them: `docs/content-analysis/research/shyam-sankar.md`
(the research stage reads that file as `research_notes`). Key rule carried there: `meta_title`
must be identity-first (`Shyam Sankar: <thesis>`), never `Shyam Sankar Personality Type: Enneagram Type N`.

## Scorecard and caveats

81/100 (diamond). Demand is directional (no Trends or volume tool). Biography intent was verified
from live Google autocomplete on 2026-10-04. The Wikipedia absence was verified by direct HTTP 404
plus deletion-log and `Draft:` checks. Re-verify the Wikipedia 404 before publishing.
