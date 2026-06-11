<!-- docs/data/gsc/README.md -->

# Google Search Console data drops

Real search performance data for 9takes.com, consumed by the `seo-content-strategist` agent and the `seo-content-gap-analysis` skill. With this data, "what should we write/fix" recommendations are ranked by actual impressions and positions instead of guesses.

## How data gets here

`node scripts/fetch-gsc-data.mjs` pulls the last 90 days via the Search Console API and writes:

| File                        | Contents                                                 |
| --------------------------- | -------------------------------------------------------- |
| `YYYY-MM-DD-queries.csv`    | Top 1000 queries: clicks, impressions, ctr_pct, position |
| `YYYY-MM-DD-pages.csv`      | Top 1000 pages, same metrics                             |
| `YYYY-MM-DD-page-query.csv` | Top 5000 page+query pairs (per-article analysis)         |
| `latest.json`               | Pointer to the most recent run (agents read this first)  |

Run it monthly (or before any SEO strategy session). Old dated files are kept as history.

## One-time setup (DJ, ~5 minutes)

The script reuses the existing Google service account (the one that sends email):
`id-takes-gmail-service-account@smart-mark-302504.iam.gserviceaccount.com`

1. Enable the API: <https://console.cloud.google.com/apis/library/searchconsole.googleapis.com> → project `smart-mark-302504` → **Enable**
2. Grant access: <https://search.google.com/search-console> → 9takes property → **Settings → Users and permissions → Add user** → paste the service account email → permission **Full**
3. Test: `node scripts/fetch-gsc-data.mjs --days 28`

If step 2 is skipped the script fails with a clear "no access" error listing what to do.

## Manual fallback (no setup needed)

Search Console UI → Performance → Export (top-right) → CSV. Drop the files in here named `YYYY-MM-DD-queries.csv` / `YYYY-MM-DD-pages.csv` and update `latest.json` by hand (or just tell the agent which files are newest).

## How agents should read this

1. Read `latest.json` for the newest file names and the date window.
2. High-impression + position 8–20 = striking-distance opportunities (improve existing page).
3. High-impression + low CTR at position 1–5 = title/meta problem.
4. Queries with impressions but no matching page = content gap.
5. If `latest.json` is older than ~45 days, flag the staleness and ask DJ to re-run the fetch.
