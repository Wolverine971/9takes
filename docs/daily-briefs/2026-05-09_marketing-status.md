<!-- docs/daily-briefs/2026-05-09_marketing-status.md -->

# Marketing Status — 2026-05-09

**Author:** Claude, for DJ
**Source:** Disk + git as of 2026-05-09 afternoon. No agents called.
**Read order:** Section 1 is the headline. Section 2 is the publish queue (the actual work). Sections 3–5 are infra, distribution, and recent activity. Section 6 is the recommendation.

---

## 1. TL;DR

- **No standalone "marketing agent" exists.** What's wired up is a fleet of role-specific subagents and slash commands (growth, SEO, distribution, content). Listed in §3.
- **The pop-culture publish queue is the bottleneck.** 20 drafts marked `published: false`. ~17 are real, polished posts. 5 of them have been sitting since Dec 2025 / Jan 2026. 11 more have sat since Feb–Mar.
- **Recent engine output is SEO plumbing, not new publishing.** The last 2 weeks of commits added corpus-stat citations, JSON-LD schema, bridge links, and an Ana de Armas draft — but only 2 pop-culture posts went live (`the-office`, `succession-roy-siblings`).
- **Daily-brief cadence has gone dark.** Only one prior brief exists (`2026-04-17_pickup-brief.md`); nothing for the past ~3 weeks.
- **Distribution packets are queued but unfired.** Six people-piece distribution decks are sitting in `docs/distribution-assets/`.

**One-line recommendation:** Flush the pop-culture queue before writing any new pop-culture content. The SEO scaffolding to amplify them already shipped.

---

## 2. Pop-culture publish queue (the actual work)

All have `published: false` in frontmatter. Sorted by `date:` field, oldest first.

### 2.1 Stale — sitting 4–10 months

| Date       | File                                              | Title hook                                                           |
| ---------- | ------------------------------------------------- | -------------------------------------------------------------------- |
| 2025-01-20 | `world-leaders-enneagram-personality-dynamics.md` | World leaders, personality dynamics                                  |
| 2025-12-13 | `kardashian-family-enneagram-analysis.md`         | The Kardashian Family Enneagram: Billion Dollar Dynasty              |
| 2025-12-15 | `aoc-and-the-squad-enneagram-types.md`            | AOC and the Squad: Millennial Politicians Reshaping Congress         |
| 2025-12-17 | `cancel-culture-enneagram-type.md`                | Cancel Culture by Enneagram Type: Who Cancels and Who Gets Cancelled |
| 2025-12-21 | `onlyfans-creators-enneagram-digital-intimacy.md` | OnlyFans Creators by Enneagram: Psychology of Digital Intimacy       |

### 2.2 Mid-batch — sitting 2–3 months

| Date       | File                                                 | Title hook                                                                |
| ---------- | ---------------------------------------------------- | ------------------------------------------------------------------------- |
| 2026-02-03 | `epstein-web-of-manipulation.md`                     | Epstein web of manipulation                                               |
| 2026-03-04 | `depp-vs-heard-enneagram-analysis.md`                | Depp vs Heard: Why a Type 4 and a Type 3 Were Built to Destroy Each Other |
| 2026-03-04 | `marvel-universe-enneagram-analysis.md`              | Marvel's Avengers IRL                                                     |
| 2026-03-04 | `online-gurus-enneagram-analysis.md`                 | Online Gurus: Personality Types Selling You a Better Life                 |
| 2026-03-04 | `oscar-contenders-enneagram-analysis.md`             | Oscar Contenders: Types That Win Academy Awards                           |
| 2026-03-04 | `pop-queens-enneagram-analysis.md`                   | Pop Queens: Types Ruling Music Right Now                                  |
| 2026-03-04 | `royal-family-enneagram-analysis.md`                 | The Royal Family: Four Types, One Fractured Dynasty                       |
| 2026-03-04 | `silicon-valley-power-players-enneagram-analysis.md` | Silicon Valley Power Players (All-In Pod)                                 |
| 2026-03-04 | `streaming-royalty-enneagram-analysis.md`            | Streaming Royalty: Empires From Bedrooms                                  |
| 2026-03-04 | `us-presidents-enneagram-analysis.md`                | US Presidents: Psychology of the Oval Office                              |
| 2026-03-21 | `tech-titans-paypal-mafia.md`                        | Tech Titans: PayPal Mafia                                                 |
| 2026-03-24 | `alex-cooper-alix-earle-beef-enneagram-analysis.md`  | Alex Cooper / Alix Earle beef                                             |

### 2.3 Recent (last 2 weeks)

| Date       | File                                         | Note                                                                                              |
| ---------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 2026-04-30 | `succession-personality-trap.md`             | Companion piece to the Roy-siblings post                                                          |
| 2026-05-07 | `succession-roy-siblings-enneagram-types.md` | **Sitemap + SEO commits indicate this went live** (commit `dc1c591f`). Verify `published:` field. |
| 2026-05-07 | `the-office-enneagram-types.md`              | **Sitemap + SEO commits indicate this went live** (commit `7c9b5a61`). Verify `published:` field. |

### 2.4 Not real drafts (skip)

- `template.md`
- `incel-exit-post.md` — no frontmatter
- `tech-titans-ai-wars-twitter.md` — distribution copy, not a post
- `tech-titans-founders-vs-stewards-twitter.md` — distribution copy, not a post

### 2.5 Counts at a glance

| Status              | Count  |
| ------------------- | ------ |
| Published `true`    | 24     |
| Draft `false`       | 20     |
| Frontmatter missing | 4      |
| **Total .md files** | **48** |

---

## 3. Marketing tooling — what's wired up

There is no single "marketing agent." There is a layered toolkit, all callable from chat.

### 3.1 Strategy / diagnosis (subagents)

- `growth-analyst` — funnel diagnosis, activation, onboarding leaks
- `growth-analyst-2` — activation/retention + experiment log
- `seo-content-strategist` — search-intent, content-gap, internal links
- `research-analyst` — evidence-first sourcing for a person/topic before writing

### 3.2 Distribution / social (slash commands)

- `/distribute` — celebrity blog → distribution asset bundle
- `/distribute-instagram` — Gen Z asset variant
- `/twitter-warmup`, `/twitter-warmup-old`, `/next-tweet`, `/tweet-reply`
- `/quora-warmup`, `/quora-answer`
- `/instagram-warmup`, `/instagram-reply`
- `short-form-video-producer` — long-form → Reels/Shorts script

### 3.3 Content pipeline (slash commands)

- `/daily-blog-creator`
- `/blog_content_creator_people_v2` (active), `/blog_content_creator_people` (legacy)
- `/blog_content_editor_pass_people`, `/blog_content_fresh_eyes_people`, `/blog_content_second_pass_people`
- `/blog_content_production_people`, `/blog_content_publish_people`
- `/grade_blog`, `/copywriting-audit`, `/copywriting-pass`, `/deai`, `/cohesion-check`
- `/content-repurposing-engine`, `/distribute`

### 3.4 Strategy docs (10 files in `docs/marketing/`)

| File                                     | Last touched             | Notes                              |
| ---------------------------------------- | ------------------------ | ---------------------------------- |
| `9takes-cluster-strategy.md`             | 2026-03-15 (most recent) | Active cluster plan                |
| `WELCOME_SEQUENCE_STRATEGY.md`           | 2026-03-16               | Welcome sequence                   |
| `blog-distribution-strategy.md`          | 2026-02-21               | 55KB — full playbook               |
| `9takes Comprehensive Marketing Plan.md` | older                    | High-level plan                    |
| `viral-coach-framework-reference.md`     | older                    | Framework reference                |
| `email-sequence-value-prop.md`           | older                    | Value prop                         |
| `questions-page-optimization-summary.md` | older                    | /questions optimization            |
| `TWITTER_CARD_OPTIMIZATION.md`           | older                    | Twitter cards                      |
| `google-search-results.md`               | older                    | SERP notes                         |
| `strat-notes.md`                         | older musings            | Personal notes, not an active plan |

### 3.5 Blog automation infra

`docs/blog-automation/` exists with:

- `automation-plan.md` — full daily-cron plan for famousTypes-driven publishing
- `backlog-queue.json` (+ backup from 2026-04-22)
- `override.json`
- `people-blog-inventory.md`
- 4 corpus-assessment passes from 2026-04-29
- Logs in `logs/blog-automation/` show the cron is running (`cron-2026-05-09.log`, `grade-2026-05-09.log`, `publish-people-2026-05-09.log`)

The people-side automation is alive. Pop-culture publishing has no equivalent automation — it's manual.

---

## 4. Distribution packets — queued, unfired

Six people-piece launch decks sit in `docs/distribution-assets/` waiting to be fired:

- `benson-boone-distribution.md`
- `chris-williamson-distribution.md`
- `john-coogan-distribution.md`
- `justin-bieber-distribution.md`
- `shawn-ryan-distribution.md` (+ `shawn-ryan-instagram.md`)
- `tech-titans-disruptors-distribution.md`
- Plus `LAUNCH-CHECKLIST.md`

These are launch artifacts, not drafts. They imply the underlying blog is published; the next step is firing the social posts.

---

## 5. Other-category drafts

Across non-pop-culture blog folders (community, enneagram, guides, life-style, historical, situational, topical, generational, life-situations, overview):

| File                                             | Notes             |
| ------------------------------------------------ | ----------------- |
| `community/edgy-rebellion-new-punk.md`           | Real draft        |
| `enneagram/the-missing-middle.md`                | Real draft        |
| `guides/enneagram-hidden-strengths-and-gifts.md` | Real draft        |
| `topical/psychology-ideas.md`                    | Real draft        |
| `life-situations/before-your-next-fight.md`      | Real draft        |
| `overview/template.md`                           | Template — ignore |
| `situational/template.md`                        | Template — ignore |

So 5 real drafts outside pop-culture, plus the 4 placeholder folders that contain only a single template file each (`life-style`, `historical`, `topical`, `generational`, `life-situations`) — those folders may be aspirational scaffolding rather than active categories.

---

## 6. What the engine has been doing (May 5–9)

Last 20 commits since 2026-04-25, themes:

- **SEO plumbing dominant**: corpus-stat callouts on 9 type pages, FAQ JSON-LD, HowTo schema on guides, Quotation JSON-LD on 7 category pages, bridge-links sidebar on personality-analysis profiles, /enneagram-test CTA below enneagram-corner posts, pop-culture wiring to type pillars.
- **2 pop-culture posts published**: `the-office-enneagram-types`, `succession-roy-siblings-enneagram-types` (sitemap regen confirms).
- **People drafts active**: Today's commit `54f41c38` added a 399-line Ana de Armas draft + 403-line research brief + 205-line research task; famousTypes table churned 943 lines; corpus-stats data refreshed.
- **People-side automation running**: `logs/blog-automation/` shows cron executed today.

In short: SEO infrastructure has had a great two weeks. Pop-culture publishing has been near-frozen.

---

## 7. Recommendation

**Flush the pop-culture queue.** The drafts are written and dated; the SEO scaffolding to amplify them just shipped (corpus-stat callouts, type-pillar wiring, JSON-LD). Each post you publish today gets full benefit of work that didn't exist when it was drafted.

Two ways to attack it, pick one:

**A. High-leverage triage (recommended first step).**
I build a one-page table for the 17 real drafts: title, current frontmatter quality, primary keyword/intent, internal-link readiness, distribution-asset existence. You pick the top 3–5. Then we publish those and fire the matching distribution packets.

**B. Just-ship-it batch.**
Pick the 5 oldest (Dec 2025 / Jan 2026 cohort) and push them through `/blog_content_publish_people` (or the pop-culture equivalent — confirm there is one, otherwise we adapt) over the next 1–2 sessions. Distribution follows.

**Adjacent low-cost wins:**

- Verify `the-office` and `succession-roy-siblings` frontmatter actually says `published: true` — sitemap and SEO commits suggest they are live, but their frontmatter still reads `false` on disk. (Possible drift between MDsvex publish flag and DB / sitemap state.)
- Decide whether to retire or restart the daily-brief cadence. The April brief was high-quality; nothing has filled the slot since.
- The 6 unfired distribution packets are pure execution work — no writing required.

---

## 8. Open questions for you

1. **Triage table or just-ship batch?** (Recommendation A or B above.)
2. **Is there a pop-culture publish command** equivalent to `/blog_content_publish_people`, or do we publish pop-culture by hand-flipping `published: true` + running the indexer?
3. **Distribution decisions** — fire all 6 queued packets, or pick the top 2–3 to start?
4. **Daily-brief cadence** — restart it, or retire it formally?
