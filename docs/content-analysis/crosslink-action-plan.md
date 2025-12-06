<!-- docs/content-analysis/crosslink-action-plan.md -->
# Blog Crosslink Action Plan

_Last Updated: 2025-12-05 (Session 2)_
_Source: [blog-crosslink-index.md](./blog-crosslink-index.md) (regenerate with `node scripts/generate-crosslink-report.js`)_

---

## Current State

| Metric                      | Count | Target | Gap      |
| --------------------------- | ----- | ------ | -------- |
| Total published posts       | 108   | -      | -        |
| Posts with 0 outgoing links | 16    | 0      | -16      |
| Posts with 0 incoming links | 41    | 0      | -41      |
| Completely isolated (0/0)   | 12    | 0      | -12      |
| Total cross-links           | 485   | 600+   | +115     |
| Average outgoing links      | 4.5   | 5-6    | +0.5-1.5 |

---

## Strategy Overview

### The Problem

The **mental-health/** subdirectory is almost completely disconnected from the rest of the blog. 8 of 12 isolated posts are mental health content. This is a major SEO issue - these posts can't be discovered through internal navigation.

### The Solution

1. **Connect the mental health cluster** to the main hub post `enneagram-and-mental-illness.md`
2. **Add outgoing links** to all 16 posts missing them
3. **Get hub posts to link** to orphaned content
4. **Build topic clusters** with bidirectional linking

---

## Phase 1: Fix Isolated Posts (12 posts)

These posts have ZERO connections. Each needs:

- 3-5 outgoing links added to the post content
- 1-2 incoming links from hub posts

### Mental Health Cluster (8 posts) - CRITICAL

The hub post `enneagram-and-mental-illness.md` (14 incoming, 10 outgoing) should link to ALL of these:

| Status | Post                                                  | Suggested Outgoing Links                                            | Get Incoming From                     |
| ------ | ----------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------- |
| ⬜     | `mental-health/enneagram-addiction-recovery-guide.md` | mental-illness, types-in-stress, shadow-work, self-sabotages        | mental-illness, overthinking          |
| ⬜     | `mental-health/enneagram-neurodivergence-guide.md`    | ADHD-post, mental-illness, types-in-stress                          | mental-illness, ADHD-post             |
| ⬜     | `mental-health/enneagram-workplace-mental-health.md`  | types-in-stress, leadership, self-sabotages                         | mental-illness, team-building         |
| ⬜     | `mental-health/enneagram-trauma-response-guide.md`    | mental-illness, types-in-stress, shadow-work                        | mental-illness, childhood-stereotypes |
| ⬜     | `mental-health/enneagram-science-mental-health.md`    | faqs, enneagram-criticisms, philosophy-psychology                   | faqs, enneagram-tldr                  |
| ⬜     | `mental-health/enneagram-medication-mental-health.md` | mental-illness, therapy-guide, crisis-management                    | mental-illness                        |
| ⬜     | `mental-health/enneagram-parenting-mental-health.md`  | childhood-stereotypes, trauma-response, types-in-stress             | mental-illness, childhood-stereotypes |
| ⬜     | `life-situations/before-your-next-fight.md`           | relationship-communication, conflict-part-1, types-in-relationships | conflict-part-1                       |

**Action:** Update `enneagram-and-mental-illness.md` to add a "Related Mental Health Guides" section linking to all 7 mental health posts.

### Community Cluster (4 posts)

| Status | Post                                                    | Suggested Outgoing Links                          | Get Incoming From  |
| ------ | ------------------------------------------------------- | ------------------------------------------------- | ------------------ |
| ⬜     | `community/memetic-comments.md`                         | communication-styles, what-winning-arguments      | introducing-9takes |
| ⬜     | `community/what-winning-online-arguments-looks-like.md` | communication-styles, memetic-comments            | introducing-9takes |
| ⬜     | `community/why-im-selective-sharing-enneagram.md`       | self-development, enneagram-tldr, beginners-guide | mbti-vs-enneagram  |
| ⬜     | `community/why-the-greek-vibe.md`                       | inspiration-for-9takes, philosophy-psychology     | introducing-9takes |

---

## Phase 2: Add Outgoing Links (4 remaining posts)

These posts have incoming links but don't link out:

| Status | Post                                                 | In  | Suggested Outgoing Links                                            |
| ------ | ---------------------------------------------------- | --- | ------------------------------------------------------------------- |
| ⬜     | `enneagram/enneagram-concepts.md`                    | 3   | enneagram-tldr, wings-guide, connecting-lines, instinctual-subtypes |
| ⬜     | `enneagram/enneagram-instinctual-subtypes.md`        | 3   | enneagram-concepts, wings-guide, types-in-stress                    |
| ⬜     | `mental-health/enneagram-crisis-management-guide.md` | 1   | mental-illness, types-in-stress, therapy-guide                      |
| ⬜     | `mental-health/enneagram-therapy-guide.md`           | 1   | mental-illness, crisis-management, shadow-work                      |

---

## Phase 3: Rescue Orphaned Posts (29 non-isolated orphans)

These posts link OUT but nobody links TO them. Priority by outgoing link count (posts already contributing value):

### High Priority (6+ outgoing links, 0 incoming)

| Status | Post                                                                    | Out | Add Incoming Links From                                           |
| ------ | ----------------------------------------------------------------------- | --- | ----------------------------------------------------------------- |
| ✅     | `guides/productivity-systems-by-enneagram-type.md`                      | 10  | self-sabotages, self-development, workplace-team-building         |
| ⬜     | `enneagram/enneagram-communication-tips.md`                             | 8   | communication-styles, communication-guide, types-in-relationships |
| ⬜     | `enneagram/enneagram-dating-guide-for-men.md`                           | 7   | types-in-relationships, red-flags-dating, dating-guide-women      |
| ⬜     | `community/mbti-vs-enneagram.md`                                        | 6   | enneagram-tldr, faqs, beginners-guide                             |
| ✅     | `enneagram/enneagram-books-websites-podcasts.md`                        | 6   | faqs, beginners-guide, enneagram-tldr                             |
| ⬜     | `enneagram/enneagram-dating-guide-for-women.md`                         | 6   | types-in-relationships, red-flags-dating, dating-guide-men        |
| ⬜     | `enneagram/enneagram-leadership.md`                                     | 6   | team-building, team-diversity, types-working-in-teams             |
| ⬜     | `guides/the-crash-course-on-emotions-that-we-missed-in-kindergarten.md` | 6   | self-development, mental-illness, overthinking                    |
| ⬜     | `pop-culture/dark-triad-meets-enneagram.md`                             | 6   | toxic-traits, manipulates, mental-illness                         |

### Medium Priority (3-5 outgoing links, 0 incoming)

| Status | Post                                                | Out | Add Incoming Links From                           |
| ------ | --------------------------------------------------- | --- | ------------------------------------------------- |
| ✅     | `enneagram/enneagram-party-planner.md`              | 5   | types-at-party, how-each-flexes                   |
| ✅     | `enneagram/neurodiversity-vs-personality.md`        | 4   | ADHD-post, neurodivergence-guide                  |
| ✅     | `community/inspiration-for-9takes.md`               | 2   | introducing-9takes, why-the-greek-vibe            |
| ✅     | `community/software-and-hardware-of-the-mind.md`    | 2   | philosophy-psychology, enneagram-concepts         |
| ✅     | `enneagram/enneagram-coach-toolkit.md`              | 2   | self-development, faqs                            |
| ✅     | `mental-health/enneagram-anxiety-complete-guide.md` | 2   | anxiety-management, overthinking, types-in-stress |

### Low Priority (1 outgoing link, 0 incoming)

| Status | Post                                               | Out | Add Incoming Links From                       |
| ------ | -------------------------------------------------- | --- | --------------------------------------------- |
| ⬜     | `community/consensus-on-human-nature.md`           | 1   | philosophy-psychology                         |
| ⬜     | `community/reddit-deep-connections-limitations.md` | 1   | introducing-9takes                            |
| ⬜     | `enneagram/enneagram-influences.md`                | 1   | philosophy-psychology, enneagram-and-religion |
| ✅     | `enneagram/first-impression-cheat-sheet.md`        | 1   | first-impression-playbook, types-at-party     |
| ⬜     | `enneagram/situations-change-emotions-dont.md`     | 1   | types-in-stress, overthinking                 |

---

## Phase 4: Strengthen Topic Clusters

When editing any post in these clusters, ensure it links to others in the same cluster.

### Mental Health Cluster (DISCONNECTED - PRIORITY)

**Hub:** `enneagram-and-mental-illness.md` (14 in, 10 out)

Should all cross-link:

- `mental-health/enneagram-addiction-recovery-guide.md` ❌ isolated
- `mental-health/enneagram-neurodivergence-guide.md` ❌ isolated
- `mental-health/enneagram-workplace-mental-health.md` ❌ isolated
- `mental-health/enneagram-trauma-response-guide.md` ❌ isolated
- `mental-health/enneagram-science-mental-health.md` ❌ isolated
- `mental-health/enneagram-medication-mental-health.md` ❌ isolated
- `mental-health/enneagram-parenting-mental-health.md` ❌ isolated
- `mental-health/enneagram-crisis-management-guide.md` (1 in, 0 out)
- `mental-health/enneagram-therapy-guide.md` (1 in, 0 out)
- `mental-health/enneagram-anxiety-complete-guide.md` (0 in, 2 out)
- `enneagram/shadow-work-by-enneagram-type.md` ✅ (6 in, 5 out)
- `enneagram/depression-patterns-by-enneagram-type.md` (1 in, 1 out)
- `enneagram/enneagram-mental-health-flags.md` (4 in, 7 out)

### Relationships Cluster (WELL CONNECTED)

**Hub:** `enneagram-types-in-relationships.md` (25 in, 8 out)

- `red-flags-dating-each-enneagram-type.md` ✅ (7 in, 12 out)
- `relationship-communication-guide.md` ✅ (6 in, 6 out)
- `love-languages-and-enneagram-types.md` ✅ (3 in, 4 out)
- `attachment-styles-and-enneagram-types.md` ✅ (3 in, 5 out)
- `enneagram-dating-guide-for-men.md` ❌ orphan (0 in, 7 out)
- `enneagram-dating-guide-for-women.md` ❌ orphan (0 in, 6 out)
- `how-each-enneagram-type-manipulates.md` ✅ (6 in, 9 out)
- `toxic-traits-relationships-warning-signs.md` (1 in, 8 out)

**Action:** Add dating guides to `types-in-relationships.md` Related Reading section.

### Self-Improvement Cluster (GOOD)

**Hub:** `enneagram-self-development.md` (10 in, 11 out)

- `how-each-enneagram-type-self-sabotages-success.md` ✅ (9 in, 10 out)
- `90-day-personality-maxing-blueprint.md` (3 in, 2 out)
- `personality-maxing.md` (1 in, 3 out)
- `toxic-traits-of-each-enneagram-type.md` ✅ (17 in, 13 out)
- `productivity-systems-by-enneagram-type.md` ❌ orphan (0 in, 10 out)

**Action:** Add productivity-systems to `self-development.md`.

### Workplace Cluster (NEEDS WORK)

- `enneagram-leadership.md` ❌ orphan (0 in, 6 out)
- `enneagram-types-working-in-teams.md` (2 in, 5 out)
- `enneagram-team-dynamics.md` (1 in, 2 out)
- `enneagram-workplace-team-building.md` (2 in, 5 out)
- `productivity-systems-by-enneagram-type.md` ❌ orphan (0 in, 10 out)
- `mental-health/enneagram-workplace-mental-health.md` ❌ isolated

**Action:** Have `team-building` and `team-dynamics` link to `leadership`.

### Communication Cluster (HUB HEAVY)

**Hub:** `enneagram-communication-styles.md` (51 in, 4 out) - receives tons but doesn't distribute

- `enneagram-communication-guide.md` (3 in, 6 out)
- `enneagram-communication-tips.md` ❌ orphan (0 in, 8 out)
- `relationship-communication-guide.md` ✅ (6 in, 6 out)

**Action:** Have `communication-styles` add links to `communication-tips` and `communication-guide`.

---

## Quick Wins Checklist

### Week 1: Mental Health Cluster

- [ ] Update `enneagram-and-mental-illness.md` with links to all 9 mental health posts
- [ ] Add 3 outgoing links to each of the 8 isolated mental health posts
- [ ] Link `mental-health-flags.md` to `crisis-management` and `therapy-guide`

### Week 2: Communication & Relationships

- [ ] Update `communication-styles.md` (51 incoming!) to link to `communication-tips` and `communication-guide`
- [ ] Update `types-in-relationships.md` to link to both dating guides
- [ ] Add incoming links to `communication-tips.md` from `communication-guide`

### Week 3: Community & Foundational

- [ ] Fix 4 isolated community posts with outgoing links
- [ ] Update `introducing-9takes.md` to link to other community posts
- [ ] Add links from `faqs.md` to `books-websites-podcasts` and `mbti-vs-enneagram`

### Week 4: Workplace & Self-Improvement

- [ ] Connect workplace cluster: leadership ↔ team posts
- [ ] Add `productivity-systems` link to `self-development.md`
- [ ] Link `enneagram-tldr.md` to `enneagram-concepts` and `instinctual-subtypes`

---

## Hub Posts That Should Distribute More Links

These posts receive many incoming links but could pass more link equity:

| Post                          | Incoming | Outgoing | Should Link To                                |
| ----------------------------- | -------- | -------- | --------------------------------------------- |
| `communication-styles.md`     | 51       | 4        | communication-tips, communication-guide       |
| `strengths-and-weaknesses.md` | 42       | 6        | self-sabotages, toxic-traits                  |
| `types-at-party.md`           | 39       | 6        | party-planner, first-impression-cheat-sheet   |
| `types-being-ghosted.md`      | 35       | 5        | red-flags-dating, attachment-styles           |
| `beginners-guide.md`          | 22       | 5        | faqs, books-websites-podcasts, enneagram-tldr |
| `enneagram-tldr.md`           | 13       | 4        | concepts, instinctual-subtypes, wings-guide   |

---

## Link Format Guidelines

### Adding Outgoing Links

Contextual inline links are best:

```markdown
For more on [how each type handles stress](/enneagram-corner/enneagram-types-in-stress), see our complete guide.
```

### "Related Reading" Sections

Add at end of posts:

```markdown
## Related Reading

- **[Post Title](/enneagram-corner/slug)** - Brief description
- **[Another Post](/enneagram-corner/slug)** - Brief description
```

### MarqueeHorizontal Components

These already exist in many posts - great for cross-linking:

```svelte
<MarqueeHorizontal
	displayList={[
		{ name: 'in stress', link: '/enneagram-corner/enneagram-types-in-stress' },
		{ name: 'at a party', link: '/enneagram-corner/enneagram-types-at-party' }
	]}
/>
```

---

## Progress Tracking

| Date       | Isolated Fixed | Outgoing Added | Incoming Added | Notes                                              |
| ---------- | -------------- | -------------- | -------------- | -------------------------------------------------- |
| 2025-12-05 | 0/12           | 0/16           | 0/41           | Fresh start with accurate data                     |
| 2025-12-05 | 11/12          | 13/16          | 13/41          | Phase 1 complete! Mental health cluster connected  |
| 2025-12-05 | 11/12          | 13/16          | 16/41          | Added incoming links to 3 orphaned authority posts |
| 2025-12-05 | 11/12          | 13/16          | 22/41          | Added 6 organic links to medium priority orphans   |

### Phase 1 Results

- **Isolated posts reduced**: 12 → 1 (only draft file remains)
- **Posts with 0 outgoing**: 16 → 3
- **Posts with 0 incoming**: 41 → 28
- Updated crosslink script to detect `/mental-health/` subdirectory paths

### Additional Work (2025-12-05)

- Added QuickAnswer boxes to 5 priority posts for SEO
- Added organic incoming links to 3 orphaned authority posts:
  - `first-impression-cheat-sheet.md` ← linked from `types-at-party.md`
  - `productivity-systems-by-enneagram-type.md` ← linked from `self-sabotages-success.md`
  - `enneagram-books-websites-podcasts.md` ← linked from `enneagram-tldr.md`
- Removed duplicate MarqueeHorizontal from `enneagram-types-in-stress.md`
- Removed duplicate link to enneagram-tldr from stress post
- Regenerated BLOG-CROSSLINK-INDEX.md with accurate counts
- Added 6 organic links to medium priority orphaned posts:
  - `enneagram-party-planner.md` ← linked from `types-at-party.md`
  - `neurodiversity-vs-personality.md` ← linked from `enneagram-and-adhd.md`
  - `inspiration-for-9takes.md` ← linked from `introducing-9takes.md`
  - `software-and-hardware-of-the-mind.md` ← linked from `philosophy-psychology.md`
  - `enneagram-coach-toolkit.md` ← linked from `enneagram-self-development.md`
  - `enneagram-anxiety-complete-guide.md` ← linked from `overthinking.md`

---

## Regenerating the Index

Run this command to get fresh data anytime:

```bash
node scripts/generate-crosslink-report.js
```

---

_Update this doc as you complete crosslinking work._
