<!-- docs/seo/indexnow.md -->
# IndexNow submission

Pushes changed URLs to Bing (and every other participating engine) instead of waiting for a crawl.
Bing feeds ChatGPT search and Copilot, so this is the cheapest lever we have on AI-surface visibility.

The 2026-09-14 Ahrefs audit flagged **64 pages whose content had changed but had never been submitted
anywhere**. This closes that gap.

## What it does

`scripts/submit-indexnow.mjs` reads the sitemap we already generate (`static/sitemap.xml`, written by
`scripts/generate-sitemap.js`), keeps the URLs whose `<lastmod>` falls inside the window, drops the
ones already submitted at that same `lastmod`, and POSTs the rest to
`https://api.indexnow.org/indexnow`.

It is **fail-open**: a missing key, an unreachable endpoint or an HTTP error all log and exit 0. A
skipped ping costs a few days of indexing latency; a failed build or cron costs the deploy.

```bash
pnpm submit:indexnow                    # submit everything changed in the last 7 days
pnpm submit:indexnow --days=30          # widen the window
pnpm submit:indexnow --dry-run          # print what it would send, send nothing
pnpm submit:indexnow --force            # ignore the state file and resubmit the window
```

## One-time setup (DJ)

### 1. Generate a key

IndexNow keys are 8–128 characters, hex digits and dashes only:

```bash
node -e "console.log(crypto.randomUUID().replace(/-/g, ''))"
```

That gives a 32-character hex string. **Never commit the key** — not to `.env.example`, not to a doc,
not to this file.

### 2. Host the key file at the site root

IndexNow verifies ownership by fetching `https://9takes.com/<key>.txt` and checking that the file
contains the key. SvelteKit serves `static/` from the root, so:

```bash
printf '%s' "<key>" > static/<key>.txt
```

The file's only contents are the key itself — no newline needed, no quotes, no extra text.

Commit that file and **deploy it before the first submission**. A ping sent before the key file is
live comes back `403` and nothing gets indexed.

Verify after deploy:

```bash
curl https://9takes.com/<key>.txt
```

### 3. Set the env var

| Where  | How                                                                          |
| ------ | ---------------------------------------------------------------------------- |
| Vercel | Project Settings → Environment Variables → `INDEXNOW_KEY` (all environments) |
| Local  | Add `INDEXNOW_KEY=<key>` to `.env`                                           |

Optional: `INDEXNOW_KEY_LOCATION` overrides the key-file URL if the file ever lives somewhere other
than `https://9takes.com/<key>.txt`. Leave it unset otherwise.

## When to run it

**After a deploy is live — never during the build.** IndexNow fetches a submitted URL soon after the
ping. A build-time ping fires before the new content is serving, so Bing would re-crawl the _old_
page and we would have spent the submission for nothing. That is why this is deliberately **not**
wired into `build:vercel`.

Options, cheapest first:

- **Manual, after a content push.** Run `pnpm submit:indexnow` once the deploy finishes.
- **OpenClaw cron (recommended).** All 9takes automation runs through OpenClaw (`openclaw cron`), and
  this fits the same pattern the other jobs use: a plain command payload, never an `agentTurn`
  wrapper. A daily run is plenty — the state file means a day with no changes sends nothing at all.
  Schedule it a little after `scripts/nightly-blog-cron.sh` so the deploy that chain triggers is
  already live by the time the ping goes out.

The sitemap has to be current for any of this to matter — run `pnpm gen:sitemap` (or let
`build:vercel` do it) before submitting, otherwise the script pings whatever the last build wrote.

## State file

`docs/data/indexnow/last-submitted.json` records the last run time and the `lastmod` each URL was
submitted at:

```json
{
	"lastRunAt": "2026-09-20T18:04:11.000Z",
	"urls": {
		"https://9takes.com/personality-analysis/zendaya": "2026-09-19"
	}
}
```

A URL is only resubmitted when its `lastmod` moves. Re-pinging unchanged pages is what gets a site
rate-limited (`429`), so this matters. The file is created on first run — a missing or corrupted file
just means everything in the window gets submitted once.

URLs that drop out of the sitemap are pruned on the next successful run, so the file tracks the live
site rather than growing forever.

State is only written after a **successful** submission. A failed ping leaves the state alone, so the
same URLs are retried on the next run.

**Commit the state file.** It is tracked in git on purpose — that is what keeps the skip-unchanged
logic honest across your laptop and the cron box. It is written with tabs so `pnpm lint`
(`prettier --check .`) stays green.

## Response codes

| Code  | Meaning                                                                           |
| ----- | --------------------------------------------------------------------------------- |
| `200` | Submitted.                                                                        |
| `202` | Received, key validation pending.                                                 |
| `400` | Invalid payload format.                                                           |
| `403` | Key invalid — the key file is missing, or does not contain the key. Check step 2. |
| `422` | URLs don't belong to `host`, or the key doesn't match the schema.                 |
| `429` | Rate limited. Usually means something is resubmitting unchanged URLs.             |

## Limits

- 10,000 URLs per request (the script caps at this, newest first).
- One shared endpoint; `api.indexnow.org` fans out to all participating engines, so there is no need
  to also hit Bing's or Yandex's own endpoint.

## Tests

`scripts/submit-indexnow.spec.mjs` covers the `lastmod` cutoff, the 10k cap, the skip-unchanged
logic and the missing-key path. The network is mocked — the suite never makes a real request.

```bash
pnpm test scripts/submit-indexnow.spec.mjs
```

## Reference

- Spec: https://www.indexnow.org/documentation
- Bing's guide: https://www.bing.com/indexnow/getstarted
