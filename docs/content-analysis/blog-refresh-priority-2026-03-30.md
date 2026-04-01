<!-- docs/content-analysis/blog-refresh-priority-2026-03-30.md -->

# Blog Refresh Priority Audit

_Generated: 2026-03-30_

## Scope

- Audited the published markdown corpus in `src/blog/**/*.md`
- Excluded `.bak`, social repurpose files (`.twitter.md`, `.instagram.md`, `.reddit.md`), and review-only files
- Total published posts scanned: **218**

## What counted as "needs refresh"

- Existing quality grade of `F`, `D`, or `C`
- Clear "AI slop" signals: generic self-help framing, template fatigue, list-heavy structure, overconfident filler, or landing-page copy dressed up as a blog post
- Outdated framing: stale year-specific titles, old future-looking claims, or a time-sensitive political/cultural frame that already reads behind the moment
- Obvious polish failures: TODO residue, article/schema mismatch, or very thin content that does not justify the page

## Top 5 If You Only Want The Highest ROI

1. `src/blog/people/drafts/Michelle-Obama.md`
2. `src/blog/people/drafts/Oprah-Winfrey.md`
3. `src/blog/enneagram/neurodiversity-vs-personality.md`
4. `src/blog/enneagram/enneagram-test-comparison-2025.md`
5. `src/blog/enneagram/first-impression-cheat-sheet.md`

---

## Priority 1: Rewrite Now

These are the posts I would not call "good to go" today.

| Rank | File                                                                     | Why it needs work now                                                                                                                                                                                                                                                                                     | Main issue type                |
| ---- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| 1    | `src/blog/people/drafts/Michelle-Obama.md`                               | Current frontmatter grade is **F (5.4)**. The draft still reads like a cleaned-up biography with Enneagram labels added on top. The internal review notes call out a weak hook, encyclopedic structure, shallow Type 1 analysis, and no signature insight.                                                | AI slop / structural rewrite   |
| 2    | `src/blog/people/drafts/Oprah-Winfrey.md`                                | Current frontmatter grade is **C (7.0)**. It opens with a generic "built an empire on one skill" thesis, leans too hard on one explanatory frame, and still moves like a chronological dossier instead of a sharply argued profile.                                                                       | AI slop / structural rewrite   |
| 3    | `src/blog/enneagram/neurodiversity-vs-personality.md`                    | Current top-level grade is **C (7.8)** and the prose is still brittle and bloggy in the wrong way. It opens with certainty where it should have precision, including claims like "it's binary" and trend-bait language that weakens trust. It also has the stalest `lastmod` in this set: **2025-05-26**. | AI slop + outdated framing     |
| 4    | `src/blog/enneagram/enneagram-test-comparison-2025.md`                   | Current top-level grade is **C (7.9)**. The title is already stale in 2026, and the existing rubric notes flag unsupported claims. This is exactly the kind of page that gets punished for being both useful and slightly out of date.                                                                    | Outdated + sourcing refresh    |
| 5    | `src/blog/enneagram/first-impression-cheat-sheet.md`                     | This is too thin to stand alone as a serious article. The local body is only about **489 words** after stripping markup, while the JSON-LD still claims `wordCount: 1700`. It reads more like a downloadable asset or companion widget than a blog post.                                                  | Thin content / format mismatch |
| 6    | `src/blog/guides/using-the-enneagram-for-self-development.md`            | Still contains TODO residue in the published file (`todo`, `get more niche`). The opening is very generic self-help copy, and the whole piece feels like a broad growth article that could have been written for almost any framework.                                                                    | AI slop / unfinished polish    |
| 7    | `src/blog/enneagram/how-to-apologize-like-a-pro.md`                      | Current top-level grade is **C (7.8)**. Practical idea is good, but the quality notes are right: weak early hook, repeated type scaffolding, and not enough sourcing to support the claims.                                                                                                               | Structural refresh             |
| 8    | `src/blog/enneagram/mental-health/enneagram-addiction-recovery-guide.md` | Current grade is **D (6.9)** with `rebuild` priority. Safety edits were applied in March, but the post still sits below publish quality.                                                                                                                                                                  | Rebuild                        |
| 9    | `src/blog/enneagram/mental-health/enneagram-medication-mental-health.md` | Current grade is **D (6.9)** with `rebuild` priority. Same pattern: safer now, not strong enough now.                                                                                                                                                                                                     | Rebuild                        |
| 10   | `src/blog/enneagram/mental-health/enneagram-neurodivergence-guide.md`    | Current grade is **D (6.9)** with `rebuild` priority. Still too exposed to safety-boundary and template-fatigue issues.                                                                                                                                                                                   | Rebuild                        |
| 11   | `src/blog/enneagram/mental-health/enneagram-parenting-mental-health.md`  | Current grade is **D (6.9)** with `rebuild` priority. Even after safety cleanup, it is still a weak page by the repo's own rubric.                                                                                                                                                                        | Rebuild                        |
| 12   | `src/blog/enneagram/mental-health/enneagram-therapy-guide.md`            | Current grade is **D (6.9)** with `rebuild` priority.                                                                                                                                                                                                                                                     | Rebuild                        |
| 13   | `src/blog/enneagram/mental-health/enneagram-trauma-response-guide.md`    | Current grade is **D (6.9)** with `rebuild` priority.                                                                                                                                                                                                                                                     | Rebuild                        |
| 14   | `src/blog/enneagram/mental-health/enneagram-workplace-mental-health.md`  | Current grade is **D (6.9)** with `rebuild` priority.                                                                                                                                                                                                                                                     | Rebuild                        |
| 15   | `src/blog/enneagram/why-therapy-doesnt-work-the-same-for-every-type.md`  | Current grade is **D (6.9)** with `rebuild` priority.                                                                                                                                                                                                                                                     | Rebuild                        |

### Notes On The Mental Health Cluster

- These pages are safer than they were before the March edits.
- They are still not strong enough editorially.
- I would not spend time polishing around the edges. I would rebuild them from a tighter, clinically safer template.

---

## Priority 2: Refresh Next

These are not broken, but they are stale, soft, or visibly behind the rest of the site.

| Rank | File                                                                          | Why it should be refreshed next                                                                                                                                                                                                                        | Main issue type                   |
| ---- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| 1    | `src/blog/community/introducing-9takes.md`                                    | Useful as a product explainer, but still thin for a cornerstone page at about **1.1k words**. It reads more like onboarding copy than a durable essay.                                                                                                 | Thin / positioning refresh        |
| 2    | `src/blog/community/what-winning-online-arguments-looks-like.md`              | Clean and readable, but still generic. It leans on familiar internet-debate advice without enough novel evidence or 9takes-specific insight.                                                                                                           | Thin / generic                    |
| 3    | `src/blog/enneagram/love-languages-and-enneagram-types.md`                    | Quality is decent, but the title is already stale in 2026 because it still carries **`(2025)`**. The internal rubric also flags overlap and template fatigue.                                                                                          | Outdated title + duplication      |
| 4    | `src/blog/people/drafts/Zayn-Malik.md`                                        | Not obviously bad, but it is stale. The ending still points forward to a **January 2026 Las Vegas residency** and a **Netflix documentary ... expected the same year**. That line now reads behind the clock.                                          | Outdated / factual freshness pass |
| 5    | `src/blog/pop-culture/trump-type-8-vs-biden-type-2.md`                        | The page was updated in February 2026, but the framing is already dated: "Two presidents wired to think in opposite ways" is a 2025 matchup frame, not a March 2026 one. This should either become a historical leadership comparison or get archived. | Outdated political frame          |
| 6    | `src/blog/community/why-the-greek-vibe.md`                                    | Better than the weakest community pages, but still short and mostly philosophy/brand positioning. It could be folded into a stronger about/manifesto page or expanded with more concrete product examples.                                             | Thin / brand essay                |
| 7    | `src/blog/guides/5-tough-conversations-you-need-to-have-with-your-partner.md` | Not a bad post, but its tone still has old-school "bulletproof relationships" / generic guide energy. This is a refresh candidate if you want the guides section to sound less templated.                                                              | Style refresh                     |
| 8    | `src/blog/people/drafts/Jeff-Bezos.md`                                        | Current grade is **B (8.0)**. Not a fire, but still below the current people-post standard and important enough to justify another pass.                                                                                                               | Below current bar                 |
| 9    | `src/blog/people/drafts/Sabrina-Carpenter.md`                                 | Current grade is **B (8.0)**. Same logic: meaningful demand, not weak, just clearly not in the gold-standard tier.                                                                                                                                     | Below current bar                 |
| 10   | `src/blog/people/drafts/Kristen-Bell.md`                                      | Current grade is **B (8.0)** and the page is still behind the stronger revised profiles.                                                                                                                                                               | Below current bar                 |

---

## Priority 3: Grade Or Decide, But Do Not Ignore

These are the pages that need an editorial decision, even if they are not the first ones I would rewrite.

| File                                                                             | Why it is on the list                                                                            | Suggested action                             |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| `src/blog/community/consensus-on-human-nature.md`                                | Ungraded, still short for a foundational argument page.                                          | Run rubric grade, then decide expand vs keep |
| `src/blog/community/how-minds-change-on-9takes.md`                               | Ungraded, but strategically important to the 9takes worldview.                                   | Grade and keep if strong                     |
| `src/blog/community/software-and-hardware-of-the-mind.md`                        | Ungraded and more abstract than most of the current content direction.                           | Grade and decide whether to modernize voice  |
| `src/blog/guides/definitive-guide-to-self-efficacy.md`                           | Ungraded and very long. Could be strong, could just be broad. Needs a rubric pass.               | Grade before touching                        |
| `src/blog/guides/productivity-systems-by-enneagram-type.md`                      | Ungraded and still likely valuable, but I would not assume it is polished enough without a pass. | Grade before touching                        |
| `src/blog/guides/the-crash-course-on-emotions-that-we-missed-in-kindergarten.md` | Ungraded but strategically useful. Feels more likely to be salvageable than broken.              | Grade before touching                        |
| `src/blog/pop-culture/parasocial-relationships-enneagram-type.md`                | Ungraded and structurally at risk of becoming a type-by-type template page.                      | Grade, then trim repetition if needed        |
| `src/blog/pop-culture/reddit-moderators-type-1-internet.md`                      | Ungraded and very topical. It may still work, but it needs an explicit freshness judgment.       | Grade or archive                             |

---

## Posts I Would Leave Alone For Now

- The strongest revised people profiles that already carry `A`, `A+`, or high `B+` grades
- The newer March 2026 pop-culture essays unless a fact-check pass finds issues
- The stronger Enneagram evergreen pages already graded `A`/`A+`

## Bottom Line

If the goal is "make the blogs feel current and human," the biggest wins are:

1. Fix the two weak celebrity profiles (`Michelle-Obama`, `Oprah-Winfrey`)
2. Rebuild the weak mental-health cluster instead of lightly editing it
3. Remove or rewrite the obviously stale or thin evergreen pages (`neurodiversity-vs-personality`, `enneagram-test-comparison-2025`, `first-impression-cheat-sheet`, `using-the-enneagram-for-self-development`)
4. Then do a lighter freshness pass on the stale-but-usable pieces (`Zayn-Malik`, `love-languages-and-enneagram-types`, `trump-type-8-vs-biden-type-2`, `introducing-9takes`)
