<!-- docs/marketing/content-ops/README.md -->

# 9takes Content Operations

This is the operating system for keeping Instagram supplied. It sits between the existing idea/research bank and human publishing.

The problem is not ideas. The repo already has built captions, carousel scripts, Reel scripts, saved-post research, and distribution packs. Work stalls between copy, rendering, approval, scheduling, and measurement. This system makes those states visible and gives one agent ownership of moving them.

## Source of truth

- `queue.json` is the authoritative production queue.
- `campaigns.md` defines why each stream exists and what success means.
- `performance-log.csv` is the simple post-level measurement record.
- The admin marketing UI is not authoritative yet; it is not wired to this Markdown asset system.
- Run `node scripts/check-marketing-content-queue.mjs` for the dependency-free health snapshot. `pnpm marketing:queue` is the convenience alias when workspace dependencies are healthy.

## Aggressive, sustainable cadence

For the first four weeks:

| Output                           | Weekly target | Job                                            |
| -------------------------------- | ------------: | ---------------------------------------------- |
| Carousels                        |             3 | Depth, saves, shares, authority                |
| Reels                            |             2 | Non-follower reach and hook testing            |
| Stories                          |            5+ | Polls, reposts, questions, and follow-through  |
| Creator relationship touches     |            25 | Distribution and collaboration surface         |
| Thoughtful collaboration pitches |             2 | Audience borrowing, only after real engagement |

Five feed posts per week is aggressive relative to the account's recent pace, but it is coherent because the same research feeds multiple formats. Do not turn the target into five unrelated research projects.

## Inventory floors

The agent protects these floors:

- 10 `approved` or `scheduled` posts: a real 14-day posting buffer
- 15 items at `copy_ready` or later: the production bank behind the buffer
- 20 `triaged` or later ideas across active campaigns
- no more than 3 items in `design_ready`
- no more than 2 items in `qa`

If approved/scheduled falls below 10, the system is red. If it is 10–14, it is yellow. At 15+, it is green.

## State contract

`captured -> triaged -> briefed -> copy_ready -> design_ready -> rendered -> qa -> approved -> scheduled -> published -> measured`

| State          | Proof required                                                          |
| -------------- | ----------------------------------------------------------------------- |
| `captured`     | Raw input or source file exists                                         |
| `triaged`      | Campaign, audience, format, priority, and decision are recorded         |
| `briefed`      | Hook, promise, CTA, evidence needs, and source are locked               |
| `copy_ready`   | Final slide/Reel copy, caption, alt text, CTA, and pinned comment exist |
| `design_ready` | A complete, current-brand visual/build brief exists                     |
| `rendered`     | Final export files exist at recorded paths                              |
| `qa`           | The exact exports are being checked                                     |
| `approved`     | DJ or an explicitly authorized reviewer approved the exact package      |
| `scheduled`    | Date/time, owner, and platform are recorded                             |
| `published`    | Live URL and published time are recorded                                |
| `measured`     | 24-hour and 7-day results are recorded                                  |
| `blocked`      | A named reason prevents progress; owner and unblock action are recorded |

## Weekly loop

### Monday — replenish and batch

1. Run `/marketing-content-sprint plan`.
2. Lock five feed slots and their story companions.
3. Batch research and copy by campaign.
4. Move no more than three items into `design_ready`.

### Tuesday/Wednesday — render and QA

1. Finish the three active designs before opening another.
2. Export static feed carousels at 1080x1440 (3:4) using `templates/instagram-feed-safe-zones.md`; create a separately reflowed 1080x1350 compatibility export only when a scheduler requires 4:5.
3. Verify first-slide legibility at phone size, Instagram UI clearance, profile-grid framing, source claims, slide order, caption, alt text, and CTA.
4. Route at most two exact packages to DJ for approval.

### Thursday — buffer check

Run `/marketing-content-sprint replenish`. If the next seven days are not approved, stop ideating and finish rendering/QA.

### Every post day

1. Warm up through the existing Instagram workflow.
2. Publish only an approved/scheduled queue item.
3. Stay available for first-hour replies.
4. Add the live URL and timestamp to the queue.
5. Record 24-hour and 7-day metrics in `performance-log.csv`.

## Immediate production order

The queue's target dates are provisional until DJ approves exact assets. Production priority is:

1. Robert Greene three-slide lore post
2. Chappell Roan Reel companion
3. Pedro Pascal three-slide lore post
4. “How each type gets in their own way” carousel
5. Lana Del Rey Reel companion
6. Tim Ferriss three-slide lore post
7. Steven Bartlett Reel companion

The rendered blackpill package is deliberately not in the main Instagram run. It is production-ready, but it conflicts with the current clean Enneagram/personality experiment and carries higher moderation cost. It remains available for LinkedIn/X or an explicit campaign override.

## Commands

```text
node scripts/check-marketing-content-queue.mjs
/marketing-content-sprint plan
/marketing-content-sprint next
/marketing-content-sprint replenish
/marketing-content-sprint measure
```

## Definition of done for a post

- Hook is understandable within two seconds.
- Every psychological claim points to observable evidence and includes the appropriate boundary/disclaimer.
- Text is legible at phone size and the sequence survives a feed crop.
- Current Streetlamp V5 brand rules are applied; legacy palette instructions are normalized.
- Caption, alt text, pinned comment, CTA, source, and target URL are included.
- The exact exported files were reviewed, not just the brief.
- The queue has one concrete next action and one owner.
- Publishing and measurement data return to the same queue item.
