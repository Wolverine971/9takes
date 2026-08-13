<!-- docs/taskers/README.md -->

# Taskers

Agent-directed work orders. One file per unit of work. A tasker is written so that an agent with no memory of the conversation that produced it can pick it up, read it top to bottom, and execute without re-deriving the reasoning.

**House format** (match it): HTML path comment, `# Tasker: <Title>`, a metadata block (**For:** / **Owner:** / **Created:** / **Status:** / **Related:**), then `## 0. What and why`, `## 1. Required reading`, ordered fix steps, `## Verification checklist` with real commands, `## Risks and gotchas`, `## Definition of done`. The reference implementation is `docs/development/url-case-redirect-audit-tasker.md`.

**Hard rules that apply to every tasker and every blog it touches:**

- Never modify `lastmod` frontmatter. DJ manages it manually.
- Em-dashes are banned in blog content, zero per article. Taskers hold themselves to the same bar.
- `enneagram-and-mental-illness` (287 clicks) is frozen: it may absorb other pages, never be absorbed, retitled, or reslugged.
- Other agents and DJ edit this repo in parallel. Never `git stash`, never bulk-reset, never a wide operation that could clobber uncommitted work.

---

## Current queue

All eleven come out of the 2026-07-15 full-corpus audit: `docs/content-analysis/2026-07-15_enneagram-blog-audit.md`. Read §9 (post-audit corrections) before acting on anything, because six of the audit's own findings were retracted or resized on verification. Two of the eleven (T-10, T-11) cover a problem the audit missed entirely.

### Do first (exposure, not traffic)

| ID       | Tasker                                                                             | Why it is first                                                                                                                                                                                                                                                                                                          | Est.                                 |
| -------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------ |
| **T-01** | [Fabricated citations](T-01-fabricated-citations-science-mental-health.md)         | `enneagram-science-mental-health` carries 19 unique hijacked DOIs on a live mental-health page. Three verified by hand: the DOIs resolve to real papers on unrelated subjects. Fabrications are duplicated into FAQPage JSON-LD, so Google can lift them into rich results. Unpublish costs 4 clicks.                    | 30 min to unpublish, ~2 hrs to audit |
| **T-11** | [grade_blog still instructs the leak](T-11-grade-blog-still-instructs-the-leak.md) | **The root cause. Do this before or with T-10.** `grade_blog.md:5` literally instructs "leave actionable reviewer feedback as an HTML comment". The behavior was renamed, not fixed: marker `<!-- QUALITY GRADE:` is on 234 drafts and 2 live pages. Without this, T-10 is a treadmill.                                  | ~2 hrs                               |
| **T-10** | [QUALITY_FEEDBACK comment leak](T-10-quality-feedback-comment-leak-88-files.md)    | 88 published files broadcast their own letter grade and weakness tags in page source. Nine self-tag `unsupported-claims`; eight self-tag `safety-boundary-risk` (and those 8 are the same files T-03 proves were remediated four months ago, so the warning is false as well as public). Verified in 88 compiled chunks. | ~2 hrs                               |
| **T-02** | [Internal notes in page source](T-02-internal-notes-leaking-to-page-source.md)     | Two blogs dump raw editorial critique publicly, including an instruction to manufacture authenticity above the author's note. **Owns the lint guard for the whole leak class**, so it must cover T-10's and T-11's markers both.                                                                                         | ~30 min                              |
| **T-03** | [Quality frontmatter is not a gate](T-03-quality-frontmatter-is-not-a-gate.md)     | The `quality_*` block is wrong in both directions: `A+/9.5/pass` on the fabricated-DOI page, `D/6.9/fail` on 8 pages remediated a month later. **Opens with what NOT to do.**                                                                                                                                            | ~2 hrs, decision first               |

**The leak class, so the four pieces are not confused:** one 2026-02-22 batch run wrote both a frontmatter block (89 files, **T-03**) and an HTML comment (88 files, **T-10**). The comment behavior was later renamed to `<!-- QUALITY GRADE:` and is still instructed by `grade_blog.md` today (**T-11**). **T-02** owns the two worst individual dumps plus the lint guard that prevents all of it recurring. Different lanes, do not cross them: each tasker carries counter-gates asserting the other lanes' counts are unmoved.

### The money

| ID       | Tasker                                                               | Payoff                                                                                                                                               | Est.                       |
| -------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| **T-09** | [Refresh the GSC window](T-09-refresh-gsc-data-window.md)            | **Dependency for T-04, T-05, T-07.** Current window straddles the 2026-05-04 URL fix and is contaminated. `--days 69` is the max clean window today. | ~30 min                    |
| **T-04** | [Astrology CTR fix](T-04-astrology-enneagram-ctr-fix.md)             | Best ROI on the site. Google surfaces the page's own jump-link at 1,387 impressions and **0 clicks**. The chart already exists; the title hides it.  | ~4 hrs, +85 to +195 clicks |
| **T-05** | [Compatibility matrix CTR fix](T-05-compatibility-matrix-ctr-fix.md) | The query says "chart", the title says "matrix". Merge in the 457-couple data with the inversion corrected.                                          | ~7 hrs, +177 clicks        |
| **T-06** | [The promise rule](T-06-editorial-standards-the-promise-rule.md)     | One editorial rule worth ~543 clicks across three pages and prevents the next dozen.                                                                 | ~1 hr                      |

### Compounding

| ID       | Tasker                                                                  | Notes                                                                                                                                                               | Est.   |
| -------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| **T-07** | [Merge and 301 consolidation](T-07-merge-and-301-consolidation-plan.md) | Eight clusters. **Salvage before 301, always.** Also converts 5 existing 302s to 301s. Depends on T-09.                                                             | ~1 day |
| **T-08** | [Enneagram and Autism](T-08-enneagram-and-autism-blog.md)               | The one new post with real demand: a 94-impression zero-click query that is literally the thesis, and a control page (ADHD) earning 252 clicks on identical demand. | ~6 hrs |

---

## Suggested order

1. **T-01** first and alone. It is the only item that is a liability rather than a cost.
2. **T-11 before T-10.** Fix the instruction, then clear the backlog. Reversed, the leak regrows on the next grading run. Then **T-02**, which strips the two worst dumps and lands the guard that holds all of it shut. All four are exposure, none need editorial judgment, and together they are about a day.
3. **T-09** next, because T-04, T-05, and T-07 all baseline against GSC and the current window is contaminated.
4. **T-04**, then **T-06** (the rule that generalizes T-04's lesson), then **T-05**.
5. **T-07** once the CTR fixes are measured, since merges change the baseline.
6. **T-08** whenever there is a writing day. It is the only one that is upside rather than debt.

**T-03** is a decision, not a task. It can happen any time, but do it before the next grading run so the next batch does not re-stamp 89 files.

**Resolved by T-13:** `src/blog/enneagram/mental-health/enneagram-neurodivergence-guide.md` had a U+2014 character in its `description` frontmatter. The visible description is now clean. One raw U+2014 character remains only inside the byte-identical QFB comment owned by T-10.

---

## New workstream: 2026-07-15 demand-gap research

Separate lineage from the corpus audit above. Source: `docs/content-research/2026-07-15-enneagram-demand-gap-research.md` plus the same-day spike (internal recon + external evidence sweep).

| ID       | Tasker                                                        | What it is                                                                                                                                                                                                                                                                            | Est.                                      |
| -------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| **T-12** | [Strategic question per blog](T-12-strategic-question-cta.md) | Replace the 4-5 CTA pile on enneagram blogs with ONE give-first question at the earned moment. Key finding: the mechanic already ships as `NineChorus` on personality-analysis; this extends it to markdown blogs. Pilots on the ADHD cluster (the only demand grounded in GSC data). | Blocked on 5 DJ decisions, then ~2-3 days |

Context that is done, not queued: the WHAT/WHY etiology overclaim was purged from 9 blog files on 2026-07-15 (do-not-write list in the research doc, section 4, now applies to all new content including question copy).

---

## New workstream: 2026-07-18 vintage-refresh / de-AI sweep

Source: DJ's 2026-07-18 question, "the blogs not updated since Opus 4.8 (2026-05-28) may have quality issues." The scan that answered it is in this session's findings, not a standalone report. Headline: "not updated since May 28" flags ~85 to 90% of the corpus, so staleness alone is not a useful filter. The scan prioritized by still-broken-today times traffic. The scariest old-model artifact (the fabricated DOIs on the science page, T-01) was already fixed on 2026-07-15. What remains is one verified live leak (T-10, already queued) and a large em-dash / AI-tell debt across the sections the 2026-07-15 audit never covered.

| ID       | Tasker                                                                        | What it is                                                                                                                                                                                                                       | Est.                      |
| -------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| **T-13** | [De-AI top-traffic enneagram pages](T-13-deai-top-traffic-enneagram-pages.md) | **Completed 2026-07-18.** All 15 pages were audited at line-edit depth; 14 were edited and one was left unchanged. Protected metadata, links, widgets, QFB comments, JSON-LD, and search-visible legacy fragments were verified. | Done                      |
| **T-14** | [Bulk de-AI the people corpus](T-14-deai-people-corpus-bulk.md)               | The big one. 382 published personality-analysis rows, 85% pre-Opus-4.8, **9,923 em-dashes across 349 rows**. DB-driven, pushed via `personBlogParser.js` (never `--publish`). **Decision first, then pilot.**                    | Pilot ~1 day, program TBD |
| **T-15** | [Pop-culture section first audit](T-15-pop-culture-section-audit.md)          | **Diagnosis completed 2026-07-18.** Nine liability pages and 23 quality pages were audited. Five Tier A pages are recommended for temporary unpublishing until fixed; all liability changes remain DJ-gated.                     | DJ review                 |

**Order within this workstream:** T-13 is complete. T-15's diagnosis is complete and now waits on DJ's P0 liability decision. T-14 remains gated on its tooling and method requirements. T-13 left every `QUALITY_FEEDBACK` block byte-identical, so T-10's review-gated removal can still proceed independently.

---

## Progress update: 2026-07-15 (see 2026-07-18 corrections below)

| ID       | State                                | What changed or was learned                                                                                                                                                                                                   | Next gate                                                                                          |
| -------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **T-01** | Rewritten, still contained           | `enneagram-science-mental-health` was audited, then replaced from zero with a shorter evidence review. It remains unpublished and its stale quality metadata is gone.                                                         | Final editorial and source review before republishing.                                             |
| **T-02** | Implemented, locally verified        | Four originally scoped comments plus two additional review-marker variants were salvaged and removed. Fresh build chunks are clean, and the lint guard now checks raw published source by marker shape.                       | Post-deploy view-source check.                                                                     |
| **T-05** | Blocked at mandatory source check    | The cited compatibility page no longer contains the 457-couple study or the four pairing percentages. No article or redirect changes were made.                                                                               | Replace or archive the unsupported salvage asset before editing the matrix.                        |
| **T-08** | Draft complete                       | The autism and mistyping draft is `published: false`, source-checked, and ready for DJ review.                                                                                                                                | Editorial review before publication.                                                               |
| **T-11** | Implemented, local smoke checks pass | Grade feedback now goes to `docs/content-analysis/grades/`, the revision reader and pipeline agree on that contract, four non-draft leaks were salvaged and removed, and fresh target chunks are clean.                       | Real slash-command smoke test. The app builds, but the repository asset budget is 112.76 KiB over. |
| **T-10** | Dry run complete                     | 86 historical `QUALITY_FEEDBACK` blocks remain. T-02 handled the dating-guide block, and the concurrent T-01 rewrite removed the science-page block. All 88 original blocks are preserved in the salvage report or a sidecar. | DJ reviews the generated 86-file patch before any source write.                                    |

The next executable task is **T-10**. Its deletion phase is intentionally review-gated. Do not bulk-write the 86 source files until DJ has reviewed `docs/content-analysis/2026-07-15_quality-feedback-dry-run.md` and the full `.diff` artifact it links.

### 2026-07-18 corrections to the table above

- **T-01 is done, not "unpublished pending review."** The row above is stale. The T-01 tasker header now reads "Remediated and republished 2026-07-15. DJ approved the rewrite from zero." Verified against the live file 2026-07-18: `enneagram-science-mental-health.md` is `published: true` with correctly-attributed citations (Soto & John BFI-2, Daniels et al. _J. Adult Dev._, the correct Hook `jclp.23097`) and a skeptical "what remains unproven" framing. The fabricated-DOI liability is closed. It is live, so if the "final source review" gate was skipped, that review is the only open thread.
- **T-10 is now 79 files, not 86.** Re-verified 2026-07-18. The count decays as individual pages get reworked. Still the executable next step for the leak; still review-gated. See the T-10 status block.

---

## New workstream: 2026-07-25 news-refresh batch (T-16)

**Folder:** [`news-refresh-2026-07/`](news-refresh-2026-07/README.md): twelve taskers, one per person, designed to be run by twelve independent agents.

Source: a 2026-07-25 join of a fresh Search Console pull (90 days to 23 July) against all 523 people in `famousTypes.ts`, plus per-person news verification. The corpus does not have a coverage problem. It has a rank-and-freshness problem.

**The three findings that drive the batch:**

1. **391 published analyses produced 176,834 impressions and 940 clicks in 90 days.** Nearly every page ranks position 8 to 12 on queries that match it exactly. **Twelve pages carry 27% of all impressions** from 3.1% of the corpus. Those twelve are the batch.
2. **The title hypothesis is dead. Do not re-litigate it.** Splitting all 391 pages by whether the SERP title contains _personality / enneagram / type / mbti_: 0.391% CTR **with** the keyword, 0.585% **without**. Keyword titles perform worse. Do not retitle toward keywords and do not replace persona titles anywhere in the corpus.
3. **Category decides traffic, not quality.** Median impressions per published page: streamer **979**, pop star **616**, rising star **398**, screen icon **156**, historical figure **9**, politician **0**, activist **0**, TikToker **0**. Grade correlates with traffic at roughly _r_ = 0.11.

**Every tasker in the batch inherits a shared editorial doctrine**: 9takes is not a news station, the news is the door and the psychology is the room. Eight required questions per refresh (feeling underneath, inner dialogue, evidence for/against/complicating the type, stress or integration arrow, arc, cost, what the other eight types see, the reader's mirror). Full version in the batch README §1; a condensed version is inlined in every tasker so no agent has to follow a link to work.

Two taskers carry an extra **political-neutrality guardrail**: [NR-03 Hasan Piker](news-refresh-2026-07/NR-03-hasan-piker.md) and [NR-07 Elon Musk](news-refresh-2026-07/NR-07-elon-musk.md). Analyze the pattern, never the position; attribute every characterization; take no side.

**Run order:** NR-05 (Messi) first and alone. It is the only page in the batch that is currently _wrong_ rather than dated, because it was edited five days before the World Cup final it describes. Then NR-01 (iShowSpeed), the single biggest traffic win on the site at 12,312 impressions. Two pairs share research and should be run together: NR-06 + NR-08 (Altman, Amodei) and NR-01 + NR-09 (iShowSpeed, Cenat).

**Written up in** [`docs/content-analysis/2026-07-25_people-corpus-triage.md`](../content-analysis/2026-07-25_people-corpus-triage.md), reproducible via `node scripts/analyze-people-corpus.mjs --with-titles`, machine-readable sibling `.json`. Its §6 records two join bugs found during the work and one finding withdrawn as a result.

**Related, same analysis:** [`docs/blog-automation/publish-queue.md`](../blog-automation/publish-queue.md) diagnoses why nothing has published since 20 July. The cron is fine; the publish gate now requires rubric v2 and roughly 52 drafts at 8.5+ are still v1, so the publisher runs daily and finds nothing eligible. The fix is a regrade backlog, not an automation fix.

---

## New workstream: 2026-08-02 audience-to-revenue validation (T-17)

This workstream responds to DJ's urgent need for approximately $4,000 in monthly cash and prevents 9takes from becoming an unbounded product or content project. The latest recorded growth audit shows real attention and the strongest contribution week yet, but nearly every new contributor remains anonymous and the session waitlist remains inactive. Research must determine whether a paid decode-session beta, conversion of existing traffic, and a bounded TikTok pilot deserve DJ's limited time.

| ID       | Tasker                                                                      | What it is                                                                                                                                                                                                                                                                      | Est.                     |
| -------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| **T-17** | [Audience-to-revenue research](T-17-9takes-audience-to-revenue-research.md) | Revalidate the live funnel, research one smallest credible paid offer, evaluate TikTok as a measurable trust channel, and produce a ranked 30-day plan with a weekly time ceiling. Research only. Implementation, pricing, publication, outreach, and payments remain DJ-gated. | 1 focused research cycle |

T-17 is a decision task. It must choose a sequence and stop conditions, not create another pile of parallel initiatives.

---

## New workstream: 2026-08-13 founder reasoning and interpretation product (T-19 to T-22)

This workstream turns DJ's personal judgment into visible evidence, clarifies the founder-led offer, and defines the core 9takes product in plain situation, take, and interpretation language. The legacy musical label is not assumed as future user-facing terminology.

| ID       | Tasker                                                                                                     | What it is                                                                                                                                                                                                                              | Est.                                |
| -------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| **T-19** | [DJ personality reasoning card pilot](T-19-dj-personality-reasoning-card-pilot.md)                         | Use the new interview skill to capture DJ's Elon Musk reasoning, preserve observation versus interpretation, design one clean card, and pilot it only after DJ approves the artifact. Founder-led Reel outputs come from the same riff. | Interview plus one focused UI pilot |
| **T-20** | [Book-session CTA and funnel audit](T-20-book-session-cta-funnel-audit.md)                                 | Audit the full founder-led offer path and produce an intent-matched CTA matrix before sending more traffic to the current waitlist. Research only.                                                                                      | 1 focused audit                     |
| **T-21** | [Situations and interpretations product research](T-21-situations-and-interpretations-product-research.md) | Define the situation, take, and interpretation object model; compare product modes; explore search and categories; separate human and AI material; and specify one bounded experiment.                                                  | 1 product-research cycle            |
| **T-22** | [Reddit situation discovery](T-22-reddit-situation-discovery-flow.md)                                      | Read-only research into how people describe ambiguous events and competing interpretations. Feeds real language and taxonomy evidence into T-21. No posting or outreach.                                                                | 1 bounded discovery cycle           |

Recommended dependency order:

1. Start T-19 with the Elon riff. The skill and editorial artifact do not depend on product implementation.
2. Run T-22 before or alongside T-21 so the product taxonomy is grounded in real situation language.
3. Complete T-21 before renaming mechanics, reshaping question categories, or building new search.
4. Run T-20 after the reasoning-card proof is concrete enough to serve as trust material, or in parallel if it remains a read-only audit.

Do not launch all four as implementation projects. T-19 has one gated pilot. T-20 and T-21 are decision tasks. T-22 is read-only discovery.

---

## Notes

- Six older taskers predate this folder and still live in their original locations: `docs/development/` (3), `docs/seo/` (1), `docs/design/` (1), `docs/planning/` (1). They were left in place rather than moved, since other work may link to them. Consolidating them here is a reasonable cleanup if you want it.
- `docs/development/url-case-redirect-audit-tasker.md` is the best example of the format, including a `## 8. What was actually done` section added on completion. Worth copying that habit: a tasker that records its own outcome is how the next audit avoids re-discovering the same thing.
