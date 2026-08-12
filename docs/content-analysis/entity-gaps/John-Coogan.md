---
person: 'John-Coogan'
audited_at: '2026-08-12'
classification: 'diamond'
recommended_action: 'retrofit'
score: 91
biography_intent: true
personal_wikipedia: false
source_gate: 'pass'
retrofit_applied_at: '2026-08-12'
path: docs/content-analysis/entity-gaps/John-Coogan.md
---

# Emerging Entity Gap Packet: John Coogan

## Why now

TBPN's growth and April 2026 acquisition by OpenAI are creating sustained name demand. The 9takes
profile received 857 document-URL impressions in the 28 days ending August 10, only weeks after its
July 14 publication. The exact `john coogan` query produced 404 impressions at average position 1.6
but no recorded clicks, an unusually large snippet/intention mismatch worth testing.

## Exact-name SERP map

Checked August 12, 2026. Results include Coogan's LinkedIn and personal/official properties, TBPN and
company context, social profiles, and several thin or inaccurate “complete profile” pages attached to
a merch site. There is a TBPN Wikipedia page but no dedicated John Coogan Wikipedia page. Search also
surfaces unrelated Coogans, though the TBPN context usually resolves the entity.

9takes already has a detailed and well-sourced biography. The miss is presentation: the prior SEO
title began with an Enneagram question, making a strong general profile look narrower than it is.

## Biography-intent map

- Core identity: TBPN co-host, technology creator, Soylent/Lucy cofounder, current OpenAI context.
- Life/career: Pasadena, Northeastern, early San Francisco startups, Soylent, Lucy, YouTube,
  Founders Fund, Power Law, TBPN.
- Verified fact queries: wife/family boundary, age/birth date, education. Avoid net-worth estimates
  and spouse naming unless Coogan makes the identity public in a reliable source.

## Source inventory

- First person: Audience of One, Sourcery, Relentless, Prof G, Coogan's launch video.
- Third party/collaborator: Jordi Hays in Dialectic; Television Academy; Vanity Fair; New Yorker;
  Axios; The Rebooting; OpenAI acquisition announcement.
- Signature contradiction: a highly disciplined operator keeps building structures whose purpose is
  to prevent curiosity from feeling trapped.

## Protected strengths

- Preserve `/personality-analysis/john-coogan`, the opening curiosity hierarchy, and the
  curiosity-versus-confinement thesis.
- Preserve the Soylent/Lucy/TBPN causal spine, serious Type 5 alternative, critic pressure, and
  current OpenAI close.
- Do not rewrite the July 2026 article; it already satisfies most biography intent.

## Content requirements

- Change the SEO title from an Enneagram-first question to `John Coogan + memorable thesis`.
- Add a concise `Who is John Coogan?` deck before the typology section.
- Add sourced FAQ answers for companies and education alongside the existing typology questions.
- Keep the visible H1 and Person schema as `John Coogan`.

## Claims to avoid or qualify

- Do not repeat thin SERP claims that Coogan attended Stanford, founded “MDA,” has a partner named
  Lucy, or has a specific net worth. Current evidence contradicts or does not establish them.
- Keep private family members unnamed and avoid unsupported body measurements.
- Treat the OpenAI acquisition as current corporate context, not proof of editorial independence.

## Baseline and 28-day prediction

Baseline window: July 14-August 10, 2026. Source:
`docs/data/gsc/experiments/2026-08-12-baseline.json`.

| Metric              |                                              Baseline |                28-day hypothesis after recrawl |
| ------------------- | ----------------------------------------------------: | ---------------------------------------------: |
| Page                | 8 clicks / 857 impressions / 0.93% CTR / position 5.6 | 12-25 clicks; 1.4-2.8% CTR if demand is stable |
| Exact `john coogan` |                           0 / 404 / 0% / position 1.6 | 2-8 clicks; 0.5-2.0% CTR; position remains 1-4 |
| Biography family    |                        5 / 116 / 4.31% / position 9.9 |           6-12 clicks; 4-8% CTR; position 8-10 |

The primary success signal is exact-name CTR at a roughly stable high position. A falling position
would confound the result even if clicks rise. The shipped retrofit also included the local draft's
already-reviewed July 25 Prof G/current-context update, so this is a snippet-plus-content package,
not a title-only causal test.

## Scorecard and caveats

- Demand trajectory: 20/20
- Exact-name SERP weakness: 20/25
- Biography-intent breadth: 12/15
- Source depth: 15/15
- 9takes fit: 10/10
- Timing/index advantage: 10/10
- Entity clarity: 4/5
- Penalties: 0
- Total: **91/100 — DIAMOND**

Search Console's zero-click exact-name row at position 1.6 is surprising but directly observed; it
should be treated as a hypothesis trigger, not assumed to be a reporting error or a guaranteed win.
