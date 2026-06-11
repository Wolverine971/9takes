<!-- docs/planning/funnel-wiring-campaign-2026-06.md -->

# Funnel Wiring Campaign — June 2026

**Started:** 2026-06-11 · **Horizon:** 60–90 days (re-evaluate ~2026-09-01)
**Premise:** The content engine works (Google-referred visits +46% MoM, ~on pace for the 5k/mo December target). Q&A, coaching, and email were never fed — under 2% of traffic flows downstream. This campaign builds the wiring. **No pillar gets killed or doubled-down on until this wiring has run for 60–90 days** — that's when kill criteria become answerable.

**Evidence base:** `docs/audits/2026-06-11_state-of-9takes.md` (numbers) · `docs/audits/2026-06-11_documentation-audit.md` (docs) · `docs/growth/growth-log.md` (funnel-bug verification)

**The loop this serves:** personality analysis + enneagram content (discovery) → email capture + Q&A participation (relationship) → coaching (revenue).

---

## Baselines (2026-06-11, from the state snapshot)

| Metric                         | Baseline                                  |
| ------------------------------ | ----------------------------------------- |
| Email captures via site forms  | **0/month** (`signups` dead since 2023)   |
| Welcome-sequence enrollments   | ~5/month (registration-capped)            |
| `/questions` share of traffic  | 1.5% (285 visits/30d)                     |
| `/book-session` visits         | 18/30d; 1 waitlist signup in 2026         |
| Q&A activity                   | ~1 comment/week; 0 questions since April  |
| Google-referred visits (proxy) | ~2,929/30d                                |
| PA section GSC CTR             | 0.30% (as of 2026-02-21 — stale, refresh) |

## Tracks

### A. CTA layer redesign — THE BOTTLENECK

- **Problem:** BlogPurpose component doesn't convert; nothing stops the scroll; email offer likely wrong; EnneagramCTASidebar built but never wired; no capture on the highest-traffic template.
- **Status:** audit DONE 2026-06-11 → `docs/audits/2026-06-11_cta-audit.md`. Key correction: the `signups` plumbing WORKS (validates, dedupes, welcome email, first-touch metadata) — placement is the failure, not the table. The fix is largely pre-built: EnneagramCTASidebar + per-route copy exist, mounted nowhere. 7-step build order in the audit (~15 h total); step 1 (mount sidebar on 5 routes) is 1–2 h and covers 79% of traffic.
- **Open decision (DJ):** BlogPurpose — replace with capture block (recommended), redesign to capture, or stack capture below it.
- **Done when:** every personality-analysis and enneagram-corner page has at least one intent-matched, visually-differentiated capture CTA, each placement carries a distinguishable source/UTM, and weekly captures > 0.

### B. Email capture / Experiment A

- **Plan exists:** `docs/planning/experiment-a-anonymous-email-capture-2026-04-08.md` — optional email at first anonymous comment. Hard prerequisite (identity unification) shipped April 8. Never built.
- **Status:** unblocked, not started. Depends on Track A's offer decision for the blog-side capture; the comment-moment capture can ship independently.
- **Target:** >0 captures/week within 2 weeks of shipping; 10% capture floor / 25% stretch (per growth-log benchmarks).

### C. Retention instrumentation (Phase 1 rollups)

- **Plan exists:** `docs/planning/retention-instrumentation-plan-2026-04-08.md`. Phase 0 (identity) shipped; Phase 1 (first-touch + daily-activity rollups, D1/D7/D30 in admin) never shipped.
- **Done when:** D7/D30 by entry surface and source readable in `/admin/analytics`. This unblocks judging everything else.

### D. Personality-analysis CTR fixes

- **Problem:** 0.30% CTR on 407k impressions/3mo — the section earns attention it doesn't collect.
- **Status:** coverage audit DONE 2026-06-11 → `docs/audits/2026-06-11_rabbit-hole-retrofit-coverage.md`. Infrastructure 100% shipped; content coverage is 51/358 drafts (~14%) and **0 verified in the production DB**. Visual QA never happened. The 301-redirect code is merged but undeployed. The Phase 3 CTR decision gate (2026-05-01) passed with no recorded decision. Title/meta intent rewrites: not started (and not part of the retrofit spec — separate work item).
- **Next:** (1) verify DB sync via /admin/content-board spot-check, (2) browser QA, (3) fresh GSC baseline, (4) deploy redirect, (5) commit the 51 drafts, then measure before authoring more.
- **Done when:** retrofit verified live on all retrofitted rows and extended per the Phase 3 decision; fresh GSC shows section CTR moving toward ≥0.6% (2x baseline).

### E. Instagram push

- **Status:** content staged, commands operational (`/distribute-instagram`, `/instagram-warmup`, `/instagram-saves`). What's missing is cadence — actually posting.
- **Done when:** consistent posting cadence for 30 days with UTM-tagged links so attribution survives (the Nov 2025 coaching burst was unattributable — never again).

### F. Founder story

- **Status:** interview kit ready — run `/founder-interview` (brief: `docs/brand/founder-story-brief.md`).
- **Feeds:** BlogPurpose rewrite (Track A), About page, `docs/VISION.md`, outreach intros, `/book-session` credibility.

## DJ-only quick actions

1. **Fresh GSC 28-day export** → `docs/analytics/` (10 min; confirms the 5k-pace with real clicks, sets the Track D baseline).
2. **Recall the Nov 19 – Dec 1, 2025 coaching burst** — 15 waitlist signups, zero attribution in the DB. What did you do that week? Whatever it was is the best-known coaching demand lever.
3. Run `/founder-interview` (30–45 min).

## Kill criteria (set now, judge later)

- **Coaching:** after Tracks A+B live for 60 days with a visible coaching CTA on high-traffic pages — if `/book-session` waitlist adds < 10 in those 60 days, park coaching and revisit in 2027 (Ferriss's 90-day question, adapted).
- **Q&A platform:** after blog→questions CTAs live for 60 days — if `/questions` still captures < 3% of site traffic and contributions stay ≤ 2/week, stop treating Q&A as a pillar and treat it as a content feature.
- **Instagram:** after 30 days of consistent posting — if UTM-tagged sessions < 100/month, reduce to repurposing-only cadence.

## Log (append-only, newest first)

### 2026-06-11 — Track A steps 1+2 built (pending DJ review + deploy)

- **EnneagramCTASidebar mounted** on enneagram-corner, community, how-to-guides, pop-culture `[slug]` routes — floating right (TOC floats left on these), anonymous visitors only (`!data?.user` gate), desktop ≥1024px.
- **Personality-analysis intentionally NOT given the floating sidebar**: both screen sides are already occupied there (PeopleSuggestions left, TOC right). Its capture is the BlogPurpose conversion instead, which also covers mobile.
- **BlogPurpose converted** from educate-and-redirect into an email capture block: "Get the next breakdown" + form posting to `/api/signups`, dark-on-amber V5 contrast, Enneagram diagram panel kept, "explore the 9 types" demoted to secondary link. Copy sourced from `enneagramSidebarCopy.ts` (single source of truth with the sidebar).
- Attribution: `signups` rows carry first-touch columns (entry surface, landing path) via the existing `attach_signup_first_touch` RPC — section-level attribution works without a migration.
- `pnpm check`: 0 errors. Prettier: clean. NOT yet browser-QA'd or deployed.

### 2026-06-11 — Campaign opened

- Evidence snapshot + docs audit completed. CTA audit and rabbit-hole coverage audit launched. Founder-interview command created. Baselines recorded above.
