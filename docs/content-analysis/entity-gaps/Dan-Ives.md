---
person: 'Dan-Ives'
audited_at: '2026-10-04'
classification: 'promising'
recommended_action: 'create'
score: 70
biography_intent: true
personal_wikipedia: false
source_gate: 'pass'
queued_at: '2026-10-04'
path: docs/content-analysis/entity-gaps/Dan-Ives.md
---

# Emerging Entity Gap Packet: Dan Ives

Scored in the discovery scout `docs/content-research/2026-10-04_emerging-entity-gap-scout.md`
(full scorecard and arithmetic there). Queued for the nightly pipeline on 2026-10-04 as `dan-ives`.

## Why now

Left Wedbush 2026-07-01 to launch a merchant bank. Bloomberg 2026-09-23: an AI closed-end fund seeking $200M. Constant TV presence.

## Exact-name SERP map

Wikipedia 404, no draft. Top results: Bloomberg profile, UMD Smith alumni profile, CNBC, Onward State profile, TipRanks, tradersunion bio, Wedbush profile. Family queries: farms only (do not use).

## Biography-intent map, source inventory, content requirements, claims to avoid

Kept in one place so the pipeline consumes them: `docs/content-analysis/research/dan-ives.md`
(the research stage reads that file as `research_notes`). Key rule carried there: `meta_title`
must be identity-first (`Dan Ives: <thesis>`), never `Dan Ives Personality Type: Enneagram Type N`.

## Scorecard and caveats

70/100 (promising). Demand is directional (no Trends or volume tool). Biography intent was verified
from live Google autocomplete on 2026-10-04. The Wikipedia absence was verified by direct HTTP 404
plus deletion-log and `Draft:` checks. Re-verify the Wikipedia 404 before publishing.
