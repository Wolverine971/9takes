<!-- docs/development/release-performance-layout-cleanup-2026-05-14.md -->

# Release Performance Tab — Layout Cleanup

Date: 2026-05-14
Scope: `/admin/analytics` → "Release Performance" tab
File touched: `src/routes/admin/analytics/+page.svelte`

## What changed

Restructured the Release Performance layout so the growth chart sits on top of the releases table instead of beside it.

- **Markup**: Inside `.release-layout`, moved the entire `.trend-panel.release-growth-panel` block (release detail header, growth chart, detail stats grid, event-impact section) above `.release-table-wrapper`. Removed the original duplicate block that had been to the right of the table.
- **`.release-layout` CSS**: changed from a 2-column grid (`minmax(0, 1.08fr) minmax(400px, 0.92fr)`) to `display: flex; flex-direction: column; gap: 16px;`.
- **Table sizing**: `release-table-wrapper` now has `max-height: 720px` (was 660px) and explicit `overflow-x: auto`. `.release-table` `min-width` reduced 1040px → 960px so it fits at full width with less horizontal scroll pressure.
- **Detail grid**: `.release-detail-grid` bumped from 4 → 5 columns now that it has the full width.
- **Chart**: `LineChart` height bumped 240 → 280 to take advantage of the full row.
- **Removed dead CSS**: the `@media (max-width: 1300px)` rule that collapsed `.release-layout` to one column is gone — the layout is already one column at every breakpoint.
- **Empty-state copy**: "Select a release to view its growth curve." → "Select a release below to view its growth curve." (reflects new vertical order).

`pnpm check` passes with no new warnings.

## Follow-ups / not done

- [ ] **Visual verification in browser.** I did not open the page in a browser. Quick QA pass on `/admin/analytics` → Release Performance:
  - With no release selected: empty-state placeholder above table, table renders cleanly below.
  - With a release selected: chart, detail grid, event-impact panel all render above the table; table scroll still works.
  - Mobile / narrow viewport (<700px): existing `@media (max-width: 700px)` rules for `.release-detail-grid` etc. still kick in — confirm nothing collapses awkwardly given the new 5-column grid at desktop.
- [ ] **Detail grid at mid-width.** `.release-detail-grid` is `repeat(5, 1fr)` at desktop and `repeat(2, 1fr)` at ≤1200px (existing rule). Between 1200px and ~1500px the 5-col layout may feel cramped — consider a 4-col intermediate breakpoint if cells get tight.
- [ ] **Sticky table headers.** Table headers already use `position: sticky; top: 0;` inside the scrolling wrapper. Worth a quick visual check that this still feels right now that the wrapper sits lower on the page.
- [ ] **Default scroll position.** When a release is selected from the table, the page does not auto-scroll up to the chart. Consider whether `selectRelease` should `scrollIntoView` the `.release-growth-panel` so the chart is visible without manual scrolling. Could be annoying if the user is comparing rows — leave off unless QA confirms it's needed.
- [ ] **Tests.** No spec changes were needed; `analytics.page.spec.ts` only references the `/api/admin/analytics/release-growth` endpoint, not the DOM layout. Re-run `pnpm test:unit` after any further changes.

## Related docs

- Backend/data spec: `docs/analytics/content-release-analytics-spec.md` (not updated — spec describes data/RPCs, not UI layout).
