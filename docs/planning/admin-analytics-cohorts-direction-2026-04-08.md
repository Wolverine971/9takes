---
title: 'Admin Analytics Cohorts Direction'
date: '2026-04-08'
status: 'draft'
owner: 'DJ'
related:
  - docs/planning/retention-instrumentation-plan-2026-04-08.md
path: docs/planning/admin-analytics-cohorts-direction-2026-04-08.md
---

# Admin Analytics Cohorts Direction

## One-line job

The `Cohorts & Sources` tab should answer one question:

> Which first-touch surfaces and acquisition sources bring new people who activate and come back?

If a panel does not help answer that, it should not be in this tab.

## What this tab is for

This tab is not pageview reporting. The `Pageviews` tab already does that.

This tab exists to support four decisions:

1. Which entry surfaces deserve more distribution because they create retained users, not just visits.
2. Which acquisition sources are high-volume but low-quality, or low-volume but high-quality.
3. Which first-session paths help new visitors activate.
4. Whether product or content changes improved last week's cohort quality versus earlier weeks.

## What success looks like

When this page is working, you should be able to answer these without writing SQL:

- "Did last full cohort week get better or worse?"
- "Is `people` traffic better than `community` traffic at producing D7 returners?"
- "Which sources actually produce registered users?"
- "After a visitor lands, where do they go next, and is that path healthy?"

## Current assets already on the page

The current implementation already has the right raw ingredients:

- Entry-surface overview
- Weekly retention by cohort week
- Acquisition mix by week
- First-session next paths
- Weekly default date range with maturity gating for D7 and D30

That aligns with the original retention plan. The issue is not "wrong data category." The issue is that the page does not make the intended decisions obvious.

## What is currently confusing

### 1. The page has no clear primary question

The subtitle says `Weekly cohorts by entry surface and acquisition source`, but that is a schema description, not a decision.

The current summary cards are totals across the selected range. They do not tell you what changed, what is good, or what needs attention.

### 2. The source filter behaves like a broken promise

The UI presents `Acquisition source` as a global filter, but the acquisition-mix chart is still built from all sources for the selected surface.

That makes the page feel inconsistent:

- overview changes
- retention changes
- next paths change
- acquisition mix does not

This is likely why the tab feels like it is "not working like it should."

### 3. The overview table mixes compare mode and drill-down mode

`Entry Surface Overview` is the comparison table for surfaces, but selecting an entry surface collapses that table to a single row.

That removes the comparison context at the exact moment you want to investigate a segment.

### 4. Weekly retention is readable only if you already know what you want

The current retention section is a raw table. It technically contains the right numbers, but it does not make trends legible.

You should be able to spot:

- improving cohorts
- worsening cohorts
- sample-size issues
- immature D7/D30 windows

Right now that requires manual scanning.

### 5. Acquisition mix shows volume, not quality

A stacked mix chart answers "where did the cohort come from?" It does not answer "was that source good?"

Without source-quality metrics nearby, the chart risks becoming vanity reporting.

### 6. Next paths are disconnected from the rest of the story

`First-session next paths` is directionally useful, but it is currently just a ranked table at the bottom of the page.

It needs to be framed as:

- "where new visitors go next"
- "whether that path likely supports activation"

Otherwise it reads as random path trivia.

## What you should actually be looking for

Use this tab in this order:

1. **Cohort quality trend**
   Look at the last full week versus the prior full week.
   Primary metric: D7 retention.
   Secondary metrics: registered within 7 days, signed up within 7 days, commented within 7 days.

2. **Surface quality**
   Which entry surfaces create the best retained cohorts?
   A surface with fewer visitors but much better D7 or registration may deserve more promotion.

3. **Source quality inside a surface**
   Once you pick a surface, compare sources by both volume and quality.
   Do not optimize for source share alone.

4. **Activation path quality**
   After first touch, where do people go?
   If healthy cohorts often go to a small set of second-page destinations, those destinations should be more intentional.

## Recommended metric hierarchy

The page needs an explicit hierarchy so it does not drift into vanity metrics.

### Primary metric

- **D7 retention**

This is the best current signal that the initial visit turned into actual return behavior.

### Secondary metrics

- **Registered within 7 days**
- **Signed up within 7 days**
- **Commented within 7 days**

These are activation milestones that explain why D7 might move.

### Context metric

- **New visitors**

This matters for scale, but it should not be the success metric on its own.

## Recommended page structure

### 1. Headline scorecard: "Last full week"

This should be the first thing on the page.

Show:

- New visitors
- Comment within 7d
- Signup within 7d
- Registered within 7d
- D7 retention

For each card, show:

- current last full week
- previous full week
- delta
- raw numerator / denominator where relevant

This tells you immediately whether cohort quality is improving.

### 2. Surface comparison table

This should answer: "Which surfaces are producing good users?"

Recommended columns:

- Entry surface
- New visitors
- Registered 7d
- D7 retention
- Avg engaged minutes

Move comment and signup into an expandable detail view or secondary columns if needed.

Sort by one chosen metric at a time, with D7 as the default sort.

Low-sample rows should still exist, but they should be visually muted.

### 3. Segment drill-down panel

Selecting a surface should not erase the overview table. It should open a drill-down state below or beside it.

That drill-down should show:

- selected surface
- source-quality breakdown for that surface
- weekly retention trend for the selected segment
- first-session next paths for the selected segment

This separates "compare surfaces" from "inspect one surface."

### 4. Weekly retention heatmap or compact trend chart

Keep weekly cohorts, but stop presenting them as a plain table first.

Recommended default:

- rows = cohort weeks
- columns = D1, D7, D30
- color = retention rate
- text = count plus percent

Only show mature cells. Immature cells should be visibly muted, not just rendered as `0`.

### 5. Acquisition mix as a supporting chart, not the star

Keep the stacked weekly mix, but frame it clearly:

- it explains volume composition
- it does not explain source quality by itself

Best interaction model:

- clicking a source in the chart or legend filters the drill-down panels
- the chart remains unfiltered but highlights the selected source

That avoids the current confusion where "source filter" appears global but the mix chart still shows all sources.

### 6. Source-quality table

This is the biggest missing piece.

Once a surface is selected, add a ranked source table with:

- Acquisition source
- New visitors
- Registered 7d
- D7 retention
- Avg engaged minutes

This is the table that tells you what to do with distribution effort.

### 7. First-session next paths

Keep this section, but tighten its purpose:

- show it as "Where new visitors go next"
- limit it to the selected segment
- sort by visitor count
- optionally annotate likely "healthy" destinations later

Longer-term, this section becomes much more valuable if it can show downstream outcomes by next path.

## Recommended interaction model

The page should have two distinct modes:

### Compare mode

Default state. No segment selected.

Show:

- last full week scorecard
- surface comparison table
- acquisition mix
- overall weekly trend

### Drill-down mode

Triggered by selecting a surface, then optionally a source.

Show:

- pinned selected segment summary
- source-quality table
- retention trend for that segment
- first-session next paths

Do not remove the compare table. Keep the context visible.

## Naming recommendation

`Cohorts & Sources` is technically correct but vague.

If you want this page to make sense faster, consider renaming the tab to one of:

- `Acquisition & Retention`
- `New Visitor Quality`
- `Cohort Quality`

`Acquisition & Retention` is the clearest.

## Gaps between current implementation and desired behavior

### Presentational gaps

- No week-over-week scorecard
- No visual trend treatment for retention
- No explicit compare vs drill-down split
- No source-quality view

### Behavioral gaps

- Source filter semantics are inconsistent with the acquisition-mix chart
- Surface selection removes comparison context
- D7/D30 maturity is explained, but not visually communicated strongly enough

## Pragmatic implementation order

### Phase 1: make the page legible using the data you already have

1. Add a top scorecard for last full week versus previous full week.
2. Reframe the overview as the default comparison table.
3. Replace the raw retention table with a more visual retention matrix.
4. Make source selection a drill-down state, not a confusing global filter.

### Phase 2: add the missing source-quality view

Add a dedicated source-overview query so a selected surface can show source performance by:

- new visitors
- registered 7d
- D7 retention
- avg engaged minutes

Without this, the page still lacks the main decision table for acquisition quality.

### Phase 3: strengthen activation-path interpretation

Extend next-path reporting with downstream outcome signals if needed.

At that point the page can answer not just "where did they go next" but "which next step tends to create better cohorts."

## Bottom line

The direction of this page is solid:

- first-touch segmentation
- activation milestones
- weekly retention
- next-step behavior

What is off is the framing.

Right now the tab reads like a collection of cohort-related tables.

It should instead read like a growth decision surface:

- are new cohorts getting better?
- which surfaces are producing quality users?
- which sources are worth more effort?
- where should new visitors go next?
