<!-- docs/daily-briefs/2026-05-14_pickup-brief.md -->

# Marketing Pickup Brief — 2026-05-14

**Author:** Claude, for DJ — at session close
**Source:** Disk + git as of 2026-05-14, end-of-session. Successor to `2026-05-09_marketing-status.md` + `2026-05-11_chris-williamson-campaign.md` work.
**Read order:** §1 is what to do FIRST when you return. §2 is what changed since 2026-05-11. §3–§7 are state per surface. §8 is open decisions.

---

## 1. When you return — start here

**The single highest-leverage move on resume:**

→ **Publish Steven Bartlett.** His draft is at grade 8.8 (above your 8.5 gate); disk still shows `published: false`. Run `/blog_content_publish_people Steven-Bartlett`. This unblocks email #6 in `docs/outreach/2026-05-11_long-form-network-emails.md` AND adds Bartlett's profile as a usable adjacent link across the cluster (currently a hole).

**The second move (if you have 30 more minutes):**

→ **Tighten the 12 cluster emails against the new doctrine you established.** The drafts in `docs/outreach/2026-05-11_long-form-network-emails.md` were written before you codified `cold-outreach-principles` and `outreach-inevitability-voice` memories. They likely violate the new rules — too long (150–200+ words; new ceiling is 50–125), too many links (3–4 adjacent; new ceiling is 1), supplication tone ("would value the correction" instead of "with or without you"). See §6 for the exact gap.

**The third (only if you're feeling ambitious):**

→ **Just-ship-it on the remaining 3 stale Dec 2025 / Jan 2026 pop-culture drafts:** `world-leaders-enneagram-personality-dynamics` (Jan 2025), `aoc-and-the-squad-enneagram-types` (Dec 15 2025), `onlyfans-creators-enneagram-digital-intimacy` (Dec 21 2025). Run `/blog_content_publish_pop_culture` on each.

Nothing else is urgent on this surface. Distribution packets and Reddit posts can wait until at least one cluster email gets a reply.

> **Parallel work you've been doing in other sessions today (not from this chat):** guerrilla marketing playbook drafted (`docs/marketing/guerrilla-marketing-playbook-2026-05-14.md`); Cancel Culture post rewritten + published. Both noted in `marketing-log.md`. This pickup brief is scoped to the outreach + cluster-email surface; the guerrilla loop and post-rewrite arcs have their own threads and follow-up docs.

---

## 2. What changed since 2026-05-11

### Doctrine you codified (memories now live in your auto-memory)

These are the biggest deltas — they change how future outreach gets drafted.

1. **`feedback_cold_outreach_principles.md`** — 50–125 words, 1 link max, 5–7 day follow-up, 1–3% realistic reply ceiling. Subject lines 4–7 words / 36–50 chars. **CTA: one binary low-friction ask. Never ask for a call.** Multiple URLs trip spam filters across a sender's sequence. Original CW campaign + cluster drafts were written before this rule and violate it.

2. **`feedback_outreach_inevitability_voice.md`** — "Already published" frame. Treat the email as courtesy notification + refinement invitation, not validation-seeking. Your own line: "with or without you" energy. Concrete patterns: _"It's already up — felt strange to write N words about someone without telling them."_ / _"If you'd refine anything, I'd love that. If not, glad you saw it."_ Avoid: "Would you be open to," "Hoping you'll," "If you have time." The piece is in the world; you're not asking permission.

3. **`reference_enneagram_type_3_outreach.md`** — Wing-specific (3w2/3w4/3w8) tuning for cold outreach to Achievers. Subject-line patterns, stress/integration arrows. Applies directly to half the cluster: Williamson (3w4), Hormozi (3w8), Bartlett (3w?), Abdaal (3w2).

**Existing drafts vs new doctrine — known gaps:**

| File                                                    | Words         | Links    | Voice                                      | Verdict                                                 |
| ------------------------------------------------------- | ------------- | -------- | ------------------------------------------ | ------------------------------------------------------- |
| `2026-05-11_long-form-network-emails.md` (12 emails)    | ~150–220 each | 3–4 each | Supplication: "would value the correction" | **Violates all 3 new rules.** Tighten before sending.   |
| `2026-05-11_long-form-network-cluster.md` (DM versions) | ~80–120 each  | 3 each   | Mixed                                      | Closer to spec but still 2 links over.                  |
| `2026-05-11_chris-williamson-campaign.md`               | 200+ each     | 2–3 each | Supplication                               | Same — tighten or skip the email versions, lean on DMs. |

### Pop-culture queue — moved

Two stale drafts shipped since 2026-05-11:

- `cancel-culture-enneagram-type` (Dec 17 2025 → published 2026-05-11)
- `alex-cooper-alix-earle-beef-enneagram-analysis` (Mar 24 2026 → published 2026-05-13, commit `e423f2bf`)

Plus `kardashian-family-enneagram-analysis` had already shipped before that (date 2026-05-09).

**Queue now: 28 published / 17 unpublished** (was 26/19 on 2026-05-11). Three from the Dec 2025 cohort remain stale:

1. `world-leaders-enneagram-personality-dynamics.md` — date 2025-01-20 (oldest in the entire queue)
2. `aoc-and-the-squad-enneagram-types.md` — date 2025-12-15
3. `onlyfans-creators-enneagram-digital-intimacy.md` — date 2025-12-21

### Command + agent fleet

- `/blog_content_publish_pop_culture` (created 2026-05-11) is working — used implicitly or explicitly to ship at least one of the recent publishes.
- `.claude/commands/blog_content_*.md` (creator, editor pass, fresh eyes, grade, deai) were edited since 2026-05-11. Likely tightening to match what you've been learning. Not your surface — note and move on.
- `.claude/agents/marketing-pm.md` was edited since 2026-05-11. Use the current version as canonical.

---

## 3. Outreach state (the hot surface)

### Long-Form Network cluster (12 recipients, 0 sent)

| #   | Recipient        | Status                         | Blocker                                                        |
| --- | ---------------- | ------------------------------ | -------------------------------------------------------------- |
| 1   | Chris Williamson | Draft ready (DM + email)       | Tighten to new doctrine                                        |
| 2   | Alex Hormozi     | Draft ready                    | Tighten                                                        |
| 3   | Ali Abdaal       | Draft ready                    | Tighten                                                        |
| 4   | Andrew Huberman  | Draft ready                    | Tighten                                                        |
| 5   | Tim Ferriss      | Draft ready (Type 1 corrected) | Tighten                                                        |
| 6   | Steven Bartlett  | Draft ready                    | **`/blog_content_publish_people Steven-Bartlett` not yet run** |
| 7   | Theo Von         | Draft ready                    | Tighten                                                        |
| 8   | Jordan Peterson  | Draft ready                    | Tighten                                                        |
| 9   | Lex Fridman      | Draft ready                    | Tighten                                                        |
| 10  | Joe Rogan        | Draft ready (text only)        | No email path; X DM is only viable channel                     |
| 11  | Shawn Ryan       | Draft ready                    | Tighten                                                        |
| 12  | Andrew Schulz    | Draft ready                    | Tighten + management contact uncertain                         |

**Files in flight (DJ has been iterating these — do NOT mass-edit without checking diffs first):**

- `docs/outreach/2026-05-11_long-form-network-emails.md` (664 lines, was 440)
- `docs/outreach/2026-05-11_long-form-network-cluster.md` (554 lines, was ~500)
- `docs/outreach/2026-05-11_chris-williamson-campaign.md` (450 lines, was 290)

### Suggested tightened email shape (per new doctrine)

For when you re-draft. ~90 words, 1 link, "already up" frame, no call ask.

```
Subject: Chris — read you as 3w4

Hey Chris,

Wrote about you — the kid running forensic
analysis on which shoulder classmates carried
their bags on, scaled to 800 podcast interviews.
3w4 read.

It's already up. Felt strange to write that
much about someone without telling them:
https://9takes.com/personality-analysis/Chris-Williamson

If you'd refine anything, I'd love that. If not,
glad you saw it.

— DJ
```

Compare to the current 200-word version in the emails doc. Same specificity, half the length, one link, no supplication.

---

## 4. Blog pipelines

- **People (automated):** Cron runs daily. Pipeline self-healing. Nothing required.
- **Pop-culture (manual, `/blog_content_publish_pop_culture` available):** 3 stale Dec 2025 drafts remain (named in §2). 14 other unpublished drafts in queue, mostly Feb–Mar 2026 vintage. Recommendation: ship the 3 stale ones, then do nothing on this surface for 2 weeks while distribution catches up.
- **Other categories:** 5 real drafts across community / enneagram / guides / topical / life-situations. Unchanged since 2026-05-09.

---

## 5. Distribution packets (still unfired)

6 packets in `docs/distribution-assets/`:

- Benson Boone
- Chris Williamson — **highest-priority right now; the cluster email leans on this piece**
- John Coogan
- Justin Bieber
- Shawn Ryan (+ Instagram variant)
- Tech Titans Disruptors

These are queued execution work. None require writing. Recommendation: fire CW packet THIS week (Tuesday morning EST) so the outreach + organic-Twitter signal compound.

---

## 6. Daily channels

| Channel   | Status                                                                                                                                                |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Quora     | Cron running. Sessions present through 2026-05-11. Watch for empty cron logs going forward.                                                           |
| Instagram | Cron + manual warmups running. Engagement targets appended-to (append-only rule honored). `instagram-recovery-todo-2026-05-07.md` status unconfirmed. |
| Twitter   | No persistent session log. `/twitter-warmup`, `/next-tweet`, `/tweet-reply` available on demand.                                                      |

---

## 7. SEO + growth

- SEO commits quiet since 2026-05-09 push. Corpus stats, JSON-LD, type-pillar wiring all in place. No follow-up required.
- `docs/growth/growth-log.md` last entry 2026-04-08. The three bugs from that audit (`EnneagramCTASidebar` commented out, stale waitlist copy, split visitor identity) are still on the radar — separate workstream, not outreach-blocking.

---

## 8. Open decisions on resume

1. **Tighten emails or fire current versions?** New doctrine says tighten. Current versions are publishable in pinch but violate your own rules. Recommend: tighten before sending, ~30 min for all 12.
2. **Bartlett publish — do it on resume.** Single command, single decision.
3. **Sequencing on resume:** Plan said Hormozi Mon → CW Wed → Abdaal Fri (W1). Three days have passed; the calendar slid. Reset: if you resume Wed/Thu, send the FIRST email same day (Hormozi or CW), space the rest across the following 10 business days.
4. **Joe Rogan email path:** Still no public address. Either fire as X DM only or sit on the draft until a warm intro emerges.
5. **Schulz management contact:** Find the address or fire as X DM.
6. **Reply-handling on resume:** No replies in your inbox to deal with yet (no sends made). The reply playbook in `2026-05-11_chris-williamson-campaign.md` §"Reply handling" still holds.
7. **Brief cadence:** This is the second pickup-style brief (after `2026-04-17_pickup-brief.md`). Pattern is: brief at natural session boundaries, not daily. Recommend treating "pickup brief" as the formal cadence and retiring "daily brief" as a concept.

---

## 9. File map (everything touched this session, in priority order)

**To open first on resume:**

- This brief
- `docs/marketing/marketing-log.md` — running log; newest at top
- `docs/outreach/2026-05-11_long-form-network-emails.md` — the campaign you're actually firing

**Reference (read if relevant):**

- `docs/outreach/2026-05-11_long-form-network-cluster.md` — strategy + DM versions + cross-pollination map
- `docs/outreach/2026-05-11_chris-williamson-campaign.md` — fine-grained CW-centric campaign (10 recipients around CW)
- `docs/planning/personality-analysis-outreach-positioning-2026-05-11.md` — pitch framing + archetypes
- `docs/planning/personality-analysis-outreach-workflow-2026-05-06.md` — manual workflow + CTA ladder
- `outreach-plan.md` (root) — Feb 2026 priority list of all graded profiles

**Doctrine (auto-loaded by Claude memory — but worth reviewing):**

- `feedback_cold_outreach_principles.md`
- `feedback_outreach_inevitability_voice.md`
- `reference_enneagram_type_3_outreach.md`

**Commands available:**

- `/blog_content_publish_people` (Bartlett)
- `/blog_content_publish_pop_culture` (3 stale drafts)
- `/distribute` (when a cluster email lands a reply)
- `/quora-answer`, `/instagram-reply`, `/twitter-warmup`, `/next-tweet` (daily channel work)

**Agent:**

- Use `marketing-pm` on resume to scan all surfaces + propose next action. It now knows about the new outreach doctrine via the memories.

---

## 10. One-line summary

Pop-culture queue is moving. Cluster outreach is drafted but needs tightening against your own new doctrine before fire. Bartlett one command away from being a real adjacent-link asset.

When you return: publish Bartlett, tighten one email as a pilot, send that one, watch.
