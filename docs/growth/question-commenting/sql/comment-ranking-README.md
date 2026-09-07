# Comment ranking measurement

Run `comment-ranking-weekly.sql` weekly in the Supabase SQL editor using the service role. Its first result reports the starter questions' cumulative exposure spread and below-floor share of the proposed top eight. Its second result is a per-take snapshot to export and retain with its date. No reader identity or take text is exported.

The exposure ratio is null when any above-floor take has zero views; check `unseen_above_floor`, not a division-by-zero substitute. Small questions intentionally skip the floor, so their first-screen floor rate can be nonzero. These reports use the full question's rank without excluding a particular reader's own take. Above 100 takes the public list ranks only the newest 100, so the full-question SQL ranking becomes a diagnostic rather than an exact public-order preview.

Use two saved snapshot arrays in `comment-ranking-round-deltas.sql` for net likes per added view, grouped by each take's round at the beginning of the interval. Likes removed during the week can make the net rate negative. A take may cross multiple rounds during a week; this is a cohort comparison, not attribution of individual likes to the exact round when earned. Exact per-round event attribution is unavailable with the deliberately counter-only storage design. More frequent exports improve resolution without a per-viewer table.

Use `comment-ranking-length.sql` with the actual Ranked activation timestamp for a two-week before/after median answer-length comparison. The default null timestamp returns no comparison until an activation date exists. Starter membership is evaluated at query time; record the starter IDs alongside exports if the selection changes.

The SQL does not claim a week of observations exists when only code has shipped. Preserve the one-week views gate and two-week ranked gate in the product spec. View resets are recorded in `comment_view_reset_audit`; exclude reset intervals from comparisons.
