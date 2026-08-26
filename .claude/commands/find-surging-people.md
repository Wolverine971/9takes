<!-- .claude/commands/find-surging-people.md -->

# Find Surging People — Personality-Analysis Intake Scout

You are a content-intelligence scout for 9takes' `/personality-analysis` section. Your job: find
**people who are surging in search/cultural attention right now**, cross-reference them against what
9takes has already published, and hand DJ a ranked, evidence-backed brief of **what to create new** and
**what to update** — so writing effort goes where search demand actually is.

This command is the front of the funnel. It does NOT write blogs. It decides _who's worth writing_.
After it finds rising names, use `/find-emerging-entity-gaps` to test the separate question: whether
the exact-name SERP is weak enough for 9takes to become a leading biography/profile result.

`$ARGUMENTS`

- No arguments: run the **full scout** across current attention plus the next 120 days.
- `--nowcast`: emphasize the last 7 days and the next 14 days.
- `--forecast [days]`: emphasize scheduled catalysts in the next 30–365 days (default 120).
- `--single "Person Name"`: pressure-test one person across demand, runway, local coverage, source
  depth, and action state. This still does not replace the exact-name SERP audit.

---

## Why this command exists (the data behind it)

A 2026-05-29 deep dive on all 343 published people blogs (`docs/content-analysis/personality-analysis-performance-deep-dive-2026-05-29.md`) found:

- **Organic search visits correlate 0.71 with lifetime traffic — the dominant driver.** Nothing else
  is close. Internal links keep a blog alive (~30-view ceiling); Google is what makes it _win_.
- **The content-quality grade correlates only 0.11 with traffic** (hook sub-score: 0.02). Craft is a
  floor, not a lever. We were over-optimizing polish and under-managing demand capture.
- **Subject selection is the biggest controllable lever.** A blog about someone with real, rising
  search demand beats a perfectly-crafted blog about someone nobody googles. `alex-karp` (64 days old)
  out-trafficked 430-day-old posts because Palantir was hot in its window.
- **Age matters (r=0.40):** rankings compound over 6–12 months. A great subject pays off for years.

The same age effect creates a forecasting advantage: publishing only after a movie, series, album, or
company story breaks gives away the index runway. This scout must combine a **nowcast** (who is rising
today) with a **calendar forecast** (whose predictable search window is 30–120 days away).

**Therefore: pick subjects by search demand and timing, not vibes.** That is the entire point of this
scout. Surfacing the right _name at the right moment_ is worth more than any craft improvement.

### Niches that perform (median lifetime views, mature blogs)

- **Strong:** frontier-builder (178), alternative-artist (107), rising-star (100), streamer (98),
  newMovieStar (82), big-tech-founder (79), pop-star (75), podcaster (80), lifestyleInfluencer (80).
- **Weak:** activist (36), influencer (37), tiktoker (39), music-crossover (38), author (42),
  singer-songwriter (46), lifestyle-builder (50).

Bias toward strong niches and toward people whose attention is _rising_, not peaked-and-fading.

---

## Pre-Approved Operations

- **WebSearch / WebFetch**: research trending people, news cycles, releases, search interest
- **Read / Glob / Grep**: inspect existing coverage in `src/blog/people/drafts/` and docs
- **Bash**: `ls`, `scripts/db-query.sh` (forced read-only) to list existing people / query published status
- **Write**: the dated intel brief in `docs/content-research/` only
- **Edit**: `docs/blog-automation/backlog-queue.json` — append-only, and ONLY after DJ confirms (Step 5)

Do NOT write or edit blog drafts. Do NOT touch the database (read-only queries are fine).

---

## Step 1: Load what we already cover

Build the "already covered" set so you can classify every surging name as NEW vs. UPDATE.

```bash
# Every person we have a draft for (published or not). Filename = the person.
ls src/blog/people/drafts/*.md | sed 's#.*/##; s#\.md$##' | sort
```

For published + freshness + current grade, query the DB read-only via the sanctioned runner
(`SUPABASE_DB_URL` lives in `.env.local`; the script forces a read-only session):

```bash
./scripts/db-query.sh "SELECT person, published, enneagram, type, lastmod, published_at,
  content_quality->>'overall' AS grade
FROM blogs_famous_people ORDER BY person"
```

Also load the automation queue — anyone already queued is neither NEW nor forgotten:

```bash
cat docs/blog-automation/backlog-queue.json | jq '[.queue[] | {name, type, priority, searchVolume}]'
```

Hold three facts per existing person: **covered?**, **published?**, **how old is the last update
(lastmod)?**. A covered-but-stale post about a re-surging person is often the highest-ROI move (it
already has index age — Finding 4 — so a refresh compounds faster than a brand-new post).

For every shortlisted person with a local draft, also read these frontmatter fields before choosing
an action:

- `published`
- `production_pretext.status`
- `production_pretext.reviewed`
- `production_pretext.ready_for_production`
- `production_pretext.blockers`
- `content_quality.overall` and any evidence cap

An unpublished draft is not an UPDATE and must not be recommended as a duplicate CREATE. It is a
**FINISH / PUBLISH** opportunity, with the exact remaining gate stated (source repair, user review,
production, or verification). Hold these facts per person: **draft exists?**, **DB row exists?**,
**published?**, **lastmod**, **quality/evidence state**, **production state**, and **already queued?**.

Run `git status --short` before any write. Existing edits belong to the user. Never overwrite or
normalize a dirty queue, draft, override, or research artifact as part of scouting.

---

## Step 2: Hunt for surging and soon-to-surge people

Run the scout in three horizons. You're looking for **rising attention with a concrete catalyst** — a
release, role, controversy, award run, viral moment, funding/IPO, feud, or breakout. Search interest
that is climbing beats search interest that already peaked.

### Horizon A — NOW (0–14 days)

Use Google Trends **Trending now** for the U.S. in both the past 24 hours and past 7 days, then screen
the visible people and related-query clusters. Supplement it with reputable current news, current
charts, platform growth, premieres, weekly episode runs, and press-tour activity.

Do not confuse a related query with a direct name trend. Record which it is. A person inside a show or
news cluster is useful evidence, but weaker than their name appearing as the trend title.

### Horizon B — NEXT (15–120 days)

Work forward from dated calendars instead of relying only on "who is trending" searches:

- Official studio, streamer, network, label, festival, awards, tour, and event calendars
- Wide-release movie and TV premiere grids, checked against an official project page or announcement
- Cast newcomers receiving a first franchise lead, first lead role, prestige breakout, or press cover
- Trailer/teaser drops, festival premieres, press-tour starts, season finales, and awards-voting dates
- Two-catalyst people: e.g. two releases close together, a release plus an awards run, or funding plus
  a product launch. Repeated catalysts are far more durable than a single headline.

The useful unit is not just a release date. Record the likely **search-spike ladder**: casting/trailer,
press cover, premiere, release, weekly run, finale, awards, and next announced project. Publishing 4–8
weeks before the largest predictable spike is usually better than publishing on opening weekend.

### Horizon C — EARLY (4–12 months)

Include only unusually strong tentpoles or people with repeat catalysts and enough source depth now.
Do not fill the list with speculative casting rumors. Put premature names on a WATCHLIST with a
specific trigger and next-check date.

Suggested search sweeps (adapt and add your own — vary by week):

- "who is everyone talking about this week [current month/year]"
- "[new movie / album / show] cast breakout star [year]"
- "trending on tiktok / x / youtube [current month] creators"
- "tech founder in the news [current month year]" / recent IPOs, AI labs, funding rounds
- "celebrity controversy / feud [current month year]"
- "[awards season] breakout / nominees [year]" (Oscars, Grammys, Emmys runs)
- "most searched people [year]" / Google Trends year-in-search style lists
- Genre-specific: rising musicians, new Netflix/A24 leads, podcasters breaking out, athletes crossing
  into culture, politicians with a national moment, streamers/creators surging in subs

For movies and shows, scan the actual release grid first, extract unfamiliar leads, and cross-check
each against local coverage. This prevents the scout from recommending only already-famous actors.
Psychology-, identity-, self-deception-, power-, or personality-adjacent projects are a useful
tie-breaker for a 9takes angle, but the project's themes are **not evidence about the actor's type**.

For each candidate, try to gauge **search demand and trajectory**, not just "is famous":

- Is the catalyst _recent and ongoing_ (rising) or _past_ (fading)?
- Is the name being searched, or just mentioned? (A new role with a press tour = people googling them.)
- Does the person have enough public record (interviews, quotes, biography) to support an
  evidence-driven Enneagram analysis? No transcript trail → weak blog. Skip or flag as thin.
- What niche tag do they fit, and is it a strong or weak performer (list above)?
- What is the next dated catalyst after the current one? One spike is fragile; a ladder is durable.
- Is the search intent about the person, or mainly the project/event? Prefer people who generate
  "who is", age, background, interview, partner, career, or personality curiosity.

Also flag likely **Emerging Entity Gap** candidates: people with rising name searches but no personal
Wikipedia page or substantial dedicated biography in the first-page results. Do not decide the gap
from this sweep alone. Route promising names through `/find-emerging-entity-gaps`, which verifies the
live SERP, biography-intent queries, entity ambiguity, and source depth.

Prefer **WebFetch on Google Trends, news aggregators, or "year in search" pages** when you can to get
harder signal than a single article. State your confidence honestly — directional is fine, but say so.

### Normalize the evidence

Label every demand claim as one of these so unlike signals are not presented as equivalent:

- **GSC FIRST-PARTY** — 9takes impressions/clicks for an existing page
- **VERIFIED SEARCH** — a direct Google Trending query or comparable named search dataset
- **RELATED SEARCH CLUSTER** — the person appears inside a larger project/news trend
- **PLATFORM GROWTH** — subscribers, streams, followers, chart movement, app users
- **NEWS / PRESS VELOCITY** — multiple current reputable stories or a press-tour wave
- **CALENDAR FORECAST** — an official dated future catalyst; potential, not observed demand

For each CREATE, FINISH / PUBLISH, or UPDATE recommendation, require at least **two independent
signals**, including one dated catalyst and one demand/source-depth/scale signal. Do not count four
articles repeating the same announcement as four signals.

---

## Step 3: Score and classify each candidate

Score candidates to make the ranking reproducible. This is an editorial opportunity score, not an
SEO difficulty score or a claim about Google's algorithm.

| Dimension                 | Points | What earns the points                                                        |
| ------------------------- | -----: | ---------------------------------------------------------------------------- |
| Demand trajectory         |   0–25 | direct search rise, platform growth, or a strong evidenced leading indicator |
| Catalyst reach            |   0–20 | size/relevance of franchise, release, company, controversy, or audience      |
| 9takes niche prior        |   0–15 | historical performance of the matching people niche                          |
| Runway / repeat catalysts |   0–15 | weeks of attention and additional dated spikes after the first               |
| Source depth              |   0–10 | substantive first-person interviews plus named third-party testimony         |
| Name-search intent        |   0–10 | likelihood people will search the person, not only the project               |
| Timing advantage          |    0–5 | enough lead time to publish/index before the main spike                      |

Apply explicit penalties:

- `-20`: attention clearly peaked/fading or is mostly a one-day curiosity
- `-15`: death/health-crisis spike with no durable forward catalyst (prefer an existing-page update or
  sensitive distribution; do not commission an opportunistic new profile by default)
- `-15`: thin first-person record
- `-10`: serious exact-name ambiguity
- `-10`: demand depends mainly on unverified gossip or allegations that cannot be safely sourced

Interpretation: **80+ ACT NOW**, **65–79 QUEUE / PREP**, **50–64 WATCH**, **below 50 PASS**. The score
does not override publication readiness, safety, or the separate Emerging Entity Gap audit.

For every surging person, decide one of:

1. **CREATE (new blog)** — surging, strong/medium niche, enough public record, NOT already covered.
   If the person is already in the backlog queue, classify as **QUEUE BUMP** instead — recommend a
   priority raise with the new catalyst as the reason, don't duplicate the entry.
2. **FINISH / PUBLISH (existing unpublished draft)** — do not recreate it. Report grade, evidence cap,
   review/readiness state, and the smallest next action that can safely ship it.
3. **UPDATE (refresh existing published page)** — already covered, but re-surging (new catalyst) and/or the post is
   stale (old `lastmod`). Refresh leverages existing index age — often the best ROI.
4. **CROSS-REFERENCE / LINK** — already covered and healthy; flag as an internal-link or distribution
   opportunity to ride the current wave (e.g., add links from the surging person to siblings, or push a
   social asset). No rewrite needed.
5. **WATCH** — promising but too early or not yet evidenced. State the trigger and next-check date.
6. **SKIP** — weak niche + low search demand, thin public record, unsafe premise, or fading attention.
   Say why.

Add an `ENTITY GAP AUDIT` flag to CREATE/UPDATE candidates when the SERP appears unusually thin. This
is a handoff, not a conclusion; the dedicated command owns the score and final classification.

Note the **Enneagram angle** if one is obvious (likely type + the driving contradiction worth analyzing)
— it helps DJ judge whether there's a real analysis here or just a name. Do not over-commit; a one-line
hypothesis is enough.

Do not type a public figure from a fictional role, costume, scandal allegation, diagnosis, or one
press quote. The hypothesis must come from repeat first-person patterns. **Do not recommend or type
minors.** A trending child performer belongs in SKIP regardless of traffic potential.

---

## Step 4: Write the intel brief

Save to `docs/content-research/YYYY-MM-DD_surging-people-scout.md` (use the real current date). Do not
overwrite a prior brief — each run is a dated snapshot.

Structure:

```markdown
# Surging People Scout — YYYY-MM-DD

## TL;DR — top moves this week

1. [Person] — CREATE — [score] — [niche] — [one-line catalyst + why now]
2. [Person] — FINISH / PUBLISH — [score] — [remaining gate + why now]
3. ...

## CREATE (new blogs, ranked by search-demand × niche strength)

| Person | Score | Niche | Horizon | Catalyst / spike ladder | Demand signal type | Enneagram hypothesis | Confidence |
| ------ | ----: | ----- | ------- | ----------------------- | ------------------ | -------------------- | ---------- |
| ...    |   ... | ...   | ...     | ...                     | ...                | ...                  | ...        |

## FINISH / PUBLISH (existing drafts, ranked by opportunity × readiness)

| Person | Score | Grade | Production state | Current catalyst | Smallest next action |
| ------ | ----: | ----: | ---------------- | ---------------- | -------------------- |

## UPDATE (already covered, re-surging or stale)

| Person | Last updated | What re-surged | Why update beats new | Suggested angle |
| ------ | ------------ | -------------- | -------------------- | --------------- |

## CROSS-REFERENCE / DISTRIBUTION (covered + healthy, ride the wave)

- [Person]: [link/asset opportunity]

## SKIPPED (and why)

- [Person]: [weak niche / thin record / fading]

## Lay of the land (intel notes)

- What's culturally hot right now in our niches, emerging clusters, anything DJ should know.
- Any niche we're under-indexed on relative to where attention is going.

## 30–120 day catalyst calendar

| Date/window | Person | Catalyst | Current action | Recheck trigger |
| ----------- | ------ | -------- | -------------- | --------------- |

## WATCHLIST

- [Person]: [why promising] — trigger: [specific evidence] — recheck: [date]

## Queue-ready entries (for backlog-queue.json)

For each CREATE pick, a ready-to-append entry in the queue's schema. Calibrate `priority` against the
current queue maximum at the time of the scout; do not blindly reuse `50` from an example:

\`\`\`json
{
"name": "kebab-case-slug",
"displayName": "Person Name",
"type": null,
"priority": 48,
"priorityReason": "one-line catalyst + demand signal",
"estimatedTraffic": "high",
"searchVolume": "high",
"personaTitle": null,
"addedToQueue": "YYYY-MM-DD",
"retryCount": 0,
"strategicValue": "cluster-tag"
}
\`\`\`

## Method / caveats

- Searches run, source URLs, dates, horizons, evidence labels, score arithmetic, and confidence
  notes. Flag anything you couldn't verify.
```

Rank CREATE candidates by **(search-demand trajectory) × (niche strength)**, not by how interesting the
Enneagram angle is. A boring type on a high-demand subject still wins traffic.

If the dated path already exists, do not overwrite it. Add a time suffix such as
`YYYY-MM-DD_HHMM_surging-people-scout.md`.

---

## Step 5: Report to DJ in chat + feed the automation queue

Give a tight summary: top 3–5 moves (create vs update), the single highest-ROI pick and why, and the
path to the brief. Then offer to:

- **Append chosen CREATE picks to `docs/blog-automation/backlog-queue.json`** — this is the queue the
  nightly OpenClaw pipeline actually writes from, so a scout run that skips this step doesn't change
  what gets published. Rules: append-only; never remove or reorder existing entries; never touch
  `inProgress`; set `priority` relative to the current top of the queue (a genuinely surging person
  should outrank evergreen backlog names); update `lastUpdated`.
- Bump priority on any QUEUE BUMP picks (edit `priority` + `priorityReason` in place, nothing else).
- Kick off `/blog_content_creator_people_v2` on a CREATE pick if DJ wants it now instead of queued, or
- Open the existing draft for a chosen UPDATE pick.

For FINISH / PUBLISH picks, route to the smallest valid handoff: repair evidence, obtain DJ review,
set the production handoff ready only after approval, or invoke the production command. Do not add an
existing draft to the new-creation queue.

Only edit the queue after DJ confirms which picks to add.

---

## Guardrails

- **Don't invent search data.** If you can't get hard trend numbers, say "directional / based on news
  volume" — never fabricate a Google Trends figure.
- **Evidence record is a gate.** A surging name with no interview/quote trail makes a weak,
  unrankable blog. Flag thin records honestly rather than recommending them.
- **Timing is the product.** Rising > peaked > fading. A person three weeks into a press tour beats one
  whose moment was six months ago.
- **Forecasts are labeled forecasts.** A release date proves a catalyst is scheduled, not that the
  actor's name searches will rise. Prefer unknown leads in large franchises, two-catalyst people, and
  early press evidence.
- **Project psychology is not actor psychology.** A movie about identity, trauma, deception, or power
  can make a strong editorial tie-breaker, but cannot justify the person's Enneagram type.
- **No personality typing of minors.** Do not recommend children even when their search traffic surges.
- **Handle deaths, health crises, and allegations with restraint.** Prefer improving or distributing a
  strong existing page. For allegations, use reputable attributed reporting, preserve "alleged" and
  disputed status, and never turn an accusation into personality evidence.
- **Respect existing index age.** When a covered post is about a re-surging person, default to UPDATE
  over CREATE — you keep the rankings the old URL already earned.

## Go deeper

- Traffic-driver analysis: `docs/content-analysis/personality-analysis-performance-deep-dive-2026-05-29.md`
- Automation queue this feeds: `docs/blog-automation/backlog-queue.json` (consumed by `/daily-blog-creator` via the nightly OpenClaw job)
- Blog creator: `.claude/commands/blog_content_creator_people_v2.md`
- Valid niche `type` values + persona vocab: see "Valid Field Values Reference" in the creator command
