---
person: 'Dario-Amodei'
audited_at: '2026-09-01'
classification: 'pass'
recommended_action: 'protect'
score: 34
biography_intent: false
personal_wikipedia: true
source_gate: 'pass'
do_not_optimize: true
path: docs/content-analysis/entity-gaps/Dario-Amodei.md
---

# Emerging Entity Gap Packet: Dario Amodei

## Why this packet exists

Not to open an opportunity. To close one, permanently, with the reasoning attached — so a future
scout that spots the same traffic signal does not treat it as an opening.

The `dario-amodei` page carries 507 impressions across 36 queries in the 98-day window ending
2026-08-11. Roughly 44% of that sits in one cluster:

- `dario amodei girlfriend` — 139 impressions, position 9.4
- `jade wang dario amodei` and variants — roughly 220 impressions across several forms, positions
  5.6 to 9.2
- `dario amodei ex girlfriend` — 22 impressions, 2 clicks, 9.09% CTR

On the raw numbers this looks like a textbook fact-query gap: real demand, page-one presence, weak
competition. It is not one, and the reason is what this packet records.

## What is actually driving the demand

The competing results are X posts, a Threads post, a KuCoin community item, and Instagram aggregator
pages. The narrative behind them speculates that a relationship from the early 2010s explains
Anthropic's policy toward China.

That is a rumor about a **private third party**. Jade Wang is not a public figure in the relevant
sense, and by the available reporting she is married to someone else. The intent behind the query is
not biography; it is a geopolitical conspiracy narrative that uses a private person as its evidence.

Per the command's own guardrail: search need that is primarily gossip which cannot be answered
responsibly is a penalty, not an opportunity.

## Why the existing page is nonetheless correct

The content 9takes already ranks on is legitimate and should not be touched:

Jade Wang gave **on-record testimony** to Alex Kantrowitz's Big Technology profile about the medical
breakthrough that followed Riccardo Amodei's death — _"It's the difference between his father most
likely dying and most likely living"_ — and the page uses it to explain the urgency underneath
Amodei's timelines. That is a named third-party source used for a substantive point, not gossip
harvesting. The FAQ `Who is Jade Wang in Dario Amodei's story?` answers the question accurately and
within the sourced record.

The page is, in effect, one of the few results a searcher can land on that gives a sourced account
instead of speculation. That is worth preserving exactly as-is.

## The recommendation

**PROTECT. Do not optimize.**

- The 0.72% CTR on `dario amodei girlfriend` is **the correct outcome**, not a defect. It is low
  because the searcher wants the rumor and the snippet does not promise it.
- Raising that CTR necessarily means promising more of what the searcher came for. That is serving
  the rumor.
- Do not add rumor-adjacent content, do not add a relationship FAQ, do not rewrite the meta
  description toward the cluster, and do not list this page in a future scout's CTR-improvement
  candidates.
- The `do_not_optimize: true` flag in this packet's frontmatter exists to make that machine-readable.

## Claims to avoid

- Any statement connecting Amodei's China policy to his personal history. No credible source supports
  it.
- Any characterisation of Jade Wang beyond what she said on record to Kantrowitz and her own public
  professional record.
- Any current-relationship claim about Amodei. Not publicly established.

## Scorecard

Demand 12/20 · SERP weakness 12/25 · Biography intent 6/15 · Source depth 14/15 · 9takes fit 6/10 ·
Timing 5/10 · Entity clarity 5/5 · Penalties −26 (−20 personal Wikipedia and major profiles; −6
partial for gossip-driven intent, reduced from the full −10 because the existing page answers it
responsibly rather than chasing it) = **34/100, pass**.
