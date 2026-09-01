---
person: 'David-Friedberg'
audited_at: '2026-09-01'
classification: 'watchlist'
recommended_action: 'protect'
score: 52
biography_intent: true
personal_wikipedia: true
source_gate: 'pass'
retrofit_applied_at: '2026-09-01'
path: docs/content-analysis/entity-gaps/David-Friedberg.md
---

# Emerging Entity Gap Packet: David Friedberg

## Why now

This packet exists because of a defect, not an opportunity. The 2026-08-12 scout listed Friedberg
among "rejected false positives" on the grounds that he has a personal Wikipedia article and a strong
incumbent biography stack. That judgment is correct for the **bare-name** query and remains correct.

What it missed is that 9takes was already ranking page-one on his **family fact** queries, and that
the page was answering one of them with a claim sourced only to content farms.

## Exact-name SERP map

Two different SERPs, and conflating them is what caused the earlier miss.

| Query family                        | Incumbent stack                                                                         | 9takes position |
| ----------------------------------- | --------------------------------------------------------------------------------------- | --------------- |
| `david friedberg`                   | Wikipedia, allin.com official bio, The Production Board, Forbes, major podcast profiles | 23.9            |
| `david friedberg wife` and variants | Generated content farms only                                                            | 8.4             |

The wife-query page one observed 2026-09-01 was, in order: topspotmagazine.co.uk,
earlymagazine.co.uk, starbiohub.com, ayzahstv.com, whizweekly.co.uk, imwithlizzie.com. Every one is a
thin generated biography page. There is no authoritative dedicated source answering this query, which
is why a personality blog can sit at position 8.4 on it.

**This is a fact-query gap, not an entity gap.** The distinction matters: an entity gap means nobody
owns the person's name. Here somebody very much owns the name, and the gap is confined to a handful
of private-life facts that no credible publisher has bothered to establish. That is a much smaller
prize and carries much larger editorial risk.

## Biography-intent map

From the captured baseline (Aug 3 – Aug 30, 2026):

- `david friedberg wife` — 150 impressions, position 8.4, 0.67% CTR
- `is david friedberg married` — 9 impressions, position 11.3
- `david friedberg children` — present in the biography family
- `david friedberg net worth` — 5 impressions, position 28.6
- `david friedberg age` — 4 impressions, position 20.5
- Biography family overall — 182 impressions, 1 click, 0.55% CTR, position 9.9

## Source inventory

- **Verified primary:** Getty Images news photo 1155138145, caption verbatim: _"SUN VALLEY, ID - JULY
  11: (L-R) Allison Broude Friedberg, director at SmartStart SF, and David Friedberg, founder and
  chief executive officer of The Production Board, attend the annual Allen & Company Sun Valley
  Conference, July 11, 2019 in Sun Valley, Idaho."_ This establishes the marriage and her professional
  role.
- **Corroborating:** her LinkedIn lists the SmartStart SF directorship. A Drew Altizer event-photography credit also lists them together at a San Francisco Tipping Point benefit; this was
  **not** independently verified in this session and should not be cited until it is.
- **Rejected:** every claim about the number, ages, or location of his children. These appear only in
  generated content farms with no attribution.
- **First-person record:** extensive. All-In Podcast archive, TPB and Ohalo material, long-form
  interviews. The source gate passes comfortably for the professional biography.

## Claims to avoid or qualify

- **Do not state a number of children.** No reliable source establishes it.
- **Do not state where his family lives.** SF is inferable from his companies, but the family's
  residence is a private detail with farm-only sourcing.
- Do not repeat farm net-worth figures.
- Treat the Drew Altizer benefit credit as unverified until checked.

## Fix applied 2026-09-01

The page previously read: _"He has a wife, Allison Broude Friedberg, and three children in San
Francisco."_

Three problems: the children claim was unsourced, the residence claim was unsourced, and both sat
inside a paragraph whose thesis is that Friedberg guards his privacy — which made the writing
self-undermining as well as unsourced.

Now live:

> **The privacy reflex**: What is publicly documented about Friedberg's family is close to nothing.
> He is married to Allison Broude Friedberg, a director at SmartStart SF, who has appeared alongside
> him at the Allen & Company conference in Sun Valley. That is roughly the entire public record, and
> the blank space is the tell.

Plus a new FAQ, `Who is David Friedberg's wife?`, which gives the sourced answer and states that
circulating claims about his children are unsupported. The Getty URL was added to `citations`.

Applied via `personBlogParser.js --apply` with `--approve-fields=content,faqs,citations`. `lastmod`
preserved at 2026-02-20; row remains published.

## Protected strengths

- The URL and the Type 5 thesis.
- The Monsanto sale as the organising contradiction: he followed his data past the point where it
  cost him his father's approval.
- The outsider-observer and knowledge-as-safety material.
- The privacy reflex itself, which is now better evidenced than before rather than worse.

## Baseline and 28-day prediction

- Baseline saved: `docs/data/gsc/experiments/2026-09-01-friedberg-baseline.json` (Aug 3 – Aug 30).
  Page 9 clicks / 700 impressions / 1.29% CTR / position 16.5.
- Prediction: biography-family CTR 0.55% → 0.9–1.8% at roughly stable position. Modest by design.
- Read the **biography family**, not page totals; the page total is dominated by `arma` and bare-name
  queries past position 20 that this change does not touch.
- A null result is acceptable. The fix was made because the claim was unsourced, not because it was
  underperforming.

## Scorecard and caveats

Demand 11/20 · SERP weakness 14/25 · Biography intent 13/15 · Source depth 13/15 · 9takes fit 8/10 ·
Timing 9/10 · Entity clarity 4/5 · Penalty −20 (personal Wikipedia plus established incumbent
biography stack) = **52/100, watchlist**.

The score is deliberately not the point of this packet. The action is `protect`: the page already
ranks, the correct move was to make it honest, and the remaining upside is small and capped. Do not
convert this profile into a fact farm chasing private-family queries.
