<!-- docs/seo/2026-08-13-backlink-hygiene-baseline.md -->

# 9takes Backlink Hygiene Baseline

**Owner:** DJ  
**Captured:** August 13, 2026  
**Status:** Complete read-only baseline  
**Source reports:** Authenticated Ahrefs project reports and Google Search Console Links report  
**Related work:** T-23 URL disposition, T-25 internal linking, T-28 backlink hygiene

## Executive conclusion

The visible backlink profile is a small legitimate core surrounded by a much larger amount of crawler noise, automated domain-report pages, and link-seller spam.

No exact on-site backlink defect was found. Every current GSC-linked target tested finishes at HTTP 200. Legacy HTTP, mixed-case personality, and moved article URLs take at most one redirect before a 200 response. No canonical, redirect, sitemap, or content file was changed.

The correct action today is to preserve the legitimate links, ignore the automated noise, and monitor changes using the monthly procedure below. This audit does not recommend outreach, purchases, link exchanges, or a disavow submission.

## 1. Measurement baseline

### Ahrefs snapshot

| Metric                     |              Current |            All-time or detail |
| -------------------------- | -------------------: | ----------------------------: |
| Domain Rating              |                   19 |                  URL Rating 9 |
| Backlinks                  |                  524 |                  712 all-time |
| Referring domains          |                  468 |                  578 all-time |
| Followed backlinks         |              84, 16% |         440 not followed, 84% |
| Followed referring domains |            51, 10.9% |       417 not followed, 89.1% |
| UGC or sponsored labels    |                2 UGC |                   0 sponsored |
| Backlinks with UR below 10 |           522, 99.6% |          Strong noise warning |
| Homepage links             | 469 from 434 domains | 50 followed, 419 not followed |

Ahrefs also showed 1,081 crawled pages across the site: 703 with 200 responses, 346 with 3xx responses, 31 with 404 responses, and one other 4xx response. Those crawl totals are not the same as broken backlink targets. The free project did not expose the Broken Backlinks report, and the New/Lost switches in the backlink and referring-domain reports were disabled. No upgrade or trial was started.

### Google Search Console snapshot

| Metric              | Count |
| ------------------- | ----: |
| External links      |    48 |
| Top linking sites   |    16 |
| Linked target pages |    18 |

GSC and Ahrefs counts must remain separate. GSC reports Google-observed links and groups some sources differently. Ahrefs reports its own crawled backlink index and includes a large quantity of pages that Google does not show in the Links report. A rise in the Ahrefs total is not, by itself, evidence of useful link growth.

## 2. Classification rubric

| Class                          | Evidence required                                                                                                                  | Default action                                                                                |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Legitimate editorial reference | A human-readable page uses the target as a relevant source, quotation, or supporting reference                                     | Preserve target; monitor presence and context                                                 |
| Legitimate community or UGC    | A relevant forum, profile, social post, or community attachment references the site                                                | Preserve if relevant; count separately from editorial links                                   |
| Owned profile                  | A profile or repository controlled by 9takes or DJ links to the site                                                               | Keep accurate; do not present as earned editorial authority                                   |
| Directory or aggregator        | A profile, statistics page, AI summary, directory, or scraped biography links in a plausible context                               | Usually no action; manually review only if it sends useful traffic or creates a target defect |
| Crawler noise or link spam     | Link-selling language, repeated SEO templates, typo-domain indexes, enormous unrelated outbound lists, or irrelevant scraped pages | Ignore; do not engage; do not treat raw volume as progress                                    |
| Unknown                        | The source page or context cannot be verified                                                                                      | Leave unchanged and put on the next manual review list                                        |

Follow status is context, not the quality decision. A relevant nofollow citation can be real. A followed link on an automated seller page can still be noise.

## 3. High-signal and representative links

The following rows capture the most useful links plus representative ambiguous sources. Dates and follow labels are those shown by Ahrefs on August 13, 2026. GSC does not expose follow status or first/last-seen dates in its Links report.

| Source                                                                                                                                                                                         | Classification                                                               | Anchor or context                                                                        | Follow                      | GSC | Target health                                                                                         | First/last seen                                            | Action                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------- | --- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------ |
| [Wikipedia: Ashby Florence](https://en.wikipedia.org/wiki/Ashby_Florence)                                                                                                                      | Legitimate editorial reference; edit provenance not audited                  | Citation title: `Inside Ashby Florence's Type 7 Mind...`                                 | Nofollow                    | No  | `/personality-analysis/ashby` direct 200                                                              | Jun 8 / Jul 19, 2026                                       | Preserve and monitor                                   |
| [The Meaning Movement: Enneagram Stress and Growth](https://themeaningmovement.com/enneagram-stress-and-growth/)                                                                               | Legitimate editorial reference; strongest visible contextual link            | `9takes`, with surrounding quotation about accessing both connected types                | Follow                      | No  | `/enneagram-corner/enneagram-connecting-lines` direct 200                                             | Jun 30 / 9 days before capture                             | Preserve and monitor                                   |
| [Enneagram Universe: free test results](https://enneagramuniverse.com/blog/free-enneagram-test-with-results) and [test explained](https://enneagramuniverse.com/blog/enneagram-test-explained) | Legitimate editorial references                                              | `2025 Enneagram test comparison`; `Enneagram test comparisons and what they offer`       | Nofollow                    | Yes | `/enneagram-corner/enneagram-test-comparison-2025` direct 200                                         | Nov 30, 2025 and Feb 4, 2026 / 9 and 5 days before capture | Preserve; see comparison-page gate                     |
| [Magnus919: Prince](https://magnus919.com/2025/06/prince-a-genius-too-far-ahead-of-his-time/)                                                                                                  | Editorial-looking reference; claims and authorship still need human judgment | Contextual text about Prince and autistic traits                                         | Follow                      | No  | Mixed-case target takes one 308 to the lowercase 200 URL                                              | Jun 22, 2025 / 3 days before capture                       | Preserve; manual context review only if needed         |
| Reddit Enneagram discussions                                                                                                                                                                   | Legitimate community/UGC                                                     | Post/comment links to the frozen mental-illness article; exact anchor not exposed by GSC | Not available               | Yes | Frozen mental-illness target direct 200                                                               | Not available in GSC                                       | Preserve; deduplicate variants when reporting          |
| [Personality Database: Paris Hilton](https://www.personality-database.com/profile/2742/paris-hilton-famous-for-being-famous-mbti-personality-type)                                             | Legitimate community/UGC                                                     | Profile reference; exact visible anchor not retained                                     | Nofollow, UGC, JavaScript   | No  | Mixed-case target takes one 308 to the lowercase 200 URL                                              | Aug 11 / 1 day before capture                              | Preserve                                               |
| [F6S company profile](https://www.f6s.com/company/9takes) and [F6S software profile](https://www.f6s.com/software/9takes)                                                                      | Owned/profile                                                                | `9takes.com`; `Visit website`                                                            | One nofollow and one follow | Yes | Homepage 200; URL variants canonicalize to HTTPS                                                      | Mar 3 and Sep 22, 2025 / 9 days and Jul 24, 2026           | Keep profile details accurate                          |
| [GitHub repository](https://github.com/Wolverine971/9takes) and README/profile links                                                                                                           | Owned/profile                                                                | Website field and README URL                                                             | Not available               | Yes | Homepage and `/enneagram-corner/corpus-stats` direct 200 after expected HTTP normalization where used | Not available in GSC                                       | Keep URLs current; report separately from earned links |
| [Grokipedia: Elon Musk](https://grokipedia.com/page/Elon_Musk)                                                                                                                                 | Automated/wiki aggregator with plausible topic relevance                     | Personality-analysis page title                                                          | Follow                      | No  | Mixed-case target takes one 308 to lowercase 200                                                      | Feb 24 / Jul 27, 2026                                      | No action                                              |
| [GitNux: Enneagram statistics](https://gitnux.org/enneagram-statistics/)                                                                                                                       | Statistics aggregator; automated editorial process indicated on page         | `9takes.com` image link                                                                  | Nofollow                    | No  | Homepage direct 200                                                                                   | Feb 15 / 8 days before capture                             | No action                                              |
| [Folkd entry](https://www.folkd.com/ultimate-dating-guide-for-singles-in-bellflower-california/)                                                                                               | Low-value community/aggregator context                                       | `First Date Success Strategies`                                                          | Follow                      | No  | Dating-guide target direct 200                                                                        | Mar 10, 2025 / Apr 25, 2026                                | Ignore unless referral traffic proves useful           |
| [Oreate AI test article](https://discover.oreate.ai/insights/finding-the-best-enneagram-test-what-actually-works-for-real-growth)                                                              | AI/automated aggregator with relevant context                                | 2025 test-comparison title plus URL                                                      | Follow                      | No  | 2025 comparison target direct 200                                                                     | Jul 31 / 12 days before capture                            | No action                                              |
| Factually.co Donald Trump fact-check pages                                                                                                                                                     | Automated/aggregated pages with topic relevance                              | One image link plus contextual Donald Trump anchors                                      | Follow                      | No  | Mixed-case or lowercase targets finish at lowercase 200 in at most one 308                            | Jan 26, 2026 / varies                                      | No action                                              |
| [TPS Home Improvement: Keanu Reeves house](https://tpshomeimprovement.com/unique-features-of-keanu-reeves-house/)                                                                              | Low-value automated or affiliate-style page; weak relevance                  | Keanu Reeves reference; exact visible anchor not retained                                | Not available               | Yes | Mixed-case target takes one 308 to lowercase 200                                                      | Visible in both tools                                      | Ignore                                                 |

### Reddit duplicate warning

GSC reports 22 Reddit linking pages across four targets. Six rows point to the frozen mental-illness article, but those six rows are not six independent endorsements:

- One original Enneagram thread appears as the canonical URL plus German, Spanish, Hindi, and Thai query-string translations.
- One additional Enneagram thread is distinct.

Monthly reporting should deduplicate translated and parameterized versions before describing community traction.

## 4. Complete GSC linking-site baseline

| Linking site           | Linking pages | Targets | Classification and evidence                                          |
| ---------------------- | ------------: | ------: | -------------------------------------------------------------------- |
| reddit.com             |            22 |       4 | Relevant community/UGC; includes translated duplicates               |
| github.com             |             5 |       2 | Owned repository, README, and profile links                          |
| idcrawl.com            |             4 |       4 | People-search aggregator linking to personality pages                |
| personalitycafe.com    |             3 |       3 | Community attachments and forum references; context quality varies   |
| enneagramuniverse.com  |             2 |       1 | Legitimate contextual references to the 2025 comparison page         |
| f6s.com                |             2 |       1 | Owned/profile links                                                  |
| archive.is             |             1 |       1 | Archive/snapshot source; no link-building value assigned             |
| australiapolicy.net    |             1 |       1 | Low-confidence biography/content aggregator                          |
| dcinside.com           |             1 |       1 | Community forum reference to the Elon Musk page                      |
| hatenablog.com         |             1 |       1 | Blog/RSS reference to the Alex Karp page; likely indirect            |
| headlineforge.uk       |             1 |       1 | Unknown/aggregator-like test article; manual-review class            |
| quora.com              |             1 |       1 | Community platform; exact source did not surface during this capture |
| tacemus.com            |             1 |       1 | Unknown; exact source did not surface during this capture            |
| tpshomeimprovement.com |             1 |       1 | Low-value automated or affiliate-style Keanu Reeves page             |
| warriorgeneral.com     |             1 |       1 | Unrelated forum page linking to the Brad Pitt target; crawler noise  |
| x.com                  |             1 |       1 | Social/UGC; exact source did not surface during this capture         |

This table is the clean starting point for month-over-month GSC comparison. A new row is a review prompt, not automatic proof of a valuable link.

## 5. Spam and noise classes to ignore

### Link-seller network

Ahrefs exposed many domains whose names, page copy, or tool labels explicitly advertise backlinks, guest posts, DR/DA/TF gains, or rankings. Examples include `buybacklinks.agency`, `authoritybacklinks.shop`, `backlinker.shop`, `rankyour.website`, `rank-top.click`, `linkrankpro.shop`, `buyseobacklinks.shop`, and `premiumseolinks.shop`.

Representative backlink rows used repeated SEOExpress-style promotional anchors, had zero page traffic, and linked to the homepage among large unrelated outbound lists. Many referring-domain rows were explicitly marked `SPAM` by Ahrefs.

**Action:** Ignore. Do not buy, reciprocate, contact, or count these as earned links.

### Automated domain reports and typo-domain indexes

Examples include `bye.fyi`, `creativeposts.top`, and pages that list `9takes.com` beside many unrelated or typo-like domains. These pages look generated from domain metadata rather than an editorial decision to cite 9takes.

**Action:** Ignore unless a future manual review finds real referral traffic or impersonation risk.

### Irrelevant scraper and affiliate pages

TPS Home Improvement and similar biography/property pages link to a personality profile without a strong sourcing relationship. Some GSC-only sources are unrelated forum or RSS pages.

**Action:** Ignore. Verify the 9takes target only if the source exposes a broken or chained URL.

### Why no disavow action is recommended

The evidence shows unsolicited, low-quality crawler noise, not a documented manual action or a deliberate paid-link scheme controlled by 9takes. A disavow submission is a high-consequence external action and is outside T-28. Do not prepare or submit one based only on the raw Ahrefs volume. DJ approval and a separate evidence review would be required even to consider it.

## 6. Target health and exact actions

### Live response verification

| Cohort tested                                                                                                           | Result                                                                                 | Action                                  |
| ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------- |
| All 18 current GSC target pages                                                                                         | Direct 200 for every target                                                            | None                                    |
| Mixed-case Ahrefs personality targets such as `Elon-Musk`, `Donald-Trump`, `Prince`, `Paris-Hilton`, and `Keanu-Reeves` | One 308 to the lowercase canonical page, then 200                                      | Expected normalization; no change       |
| `http://9takes.com/`                                                                                                    | One protocol redirect to HTTPS, then 200                                               | Expected normalization; no change       |
| `/blog/famous-enneagram-types`                                                                                          | One 308 to `/personality-analysis`, then 200                                           | Expected moved-page behavior; no change |
| Old trauma-response article path                                                                                        | One 301 to `/enneagram-corner/mental-health/enneagram-trauma-response-guide`, then 200 | Expected moved-page behavior; no change |
| `/enneagram-corner/enneagram-test-comparison-2026`                                                                      | Direct 200                                                                             | None                                    |

Across the 18 GSC targets and 11 additional Ahrefs-visible target forms tested, every final response was 200 and no redirect chain exceeded one hop.

### Canonical and sitemap checks

- The 2025 comparison page, lowercase Elon Musk page, and corpus-statistics page emitted self-referencing HTTPS canonical URLs and `index,follow` robots directives in live HTML.
- The 18 GSC target pages and the additional important canonical targets checked are present in `static/sitemap.xml`.
- Repository routing matches live behavior: personality slugs normalize to lowercase, the old famous-types article permanently redirects to the personality-analysis index, and old mental-health article paths permanently redirect to their current destinations.

### Exact fixes made

None. There was no verified broken backlink target, redirect chain, canonical mismatch, or sitemap omission in the inspected link set.

## 7. Opportunity that belongs to T-23 and T-25

`/enneagram-corner/enneagram-test-comparison-2025` is a legitimate externally linked asset. Enneagram Universe links to it twice, and several lower-confidence aggregators also reference it. The internal crosslink report records only one inbound MDsvex link and eight outbound links for this page. The 2026 comparison page also exists and returns 200.

This is not an authorization to merge or redirect either page. Because the 2025 URL has legitimate inbound links, its coexistence or consolidation with the 2026 page must be decided in T-23. If the page remains independent, T-25 should consider adding relevant internal support. No URL or link change should happen until that disposition is explicit.

## 8. Content patterns that earned the credible links

### Specific utility and comparison content

The test-comparison page earned multiple relevant references because it helps a reader choose among concrete options. The pattern is stronger than a generic definition page: make a bounded decision easier, show the criteria, and keep the dated recommendation current.

### Direct, quotable explanations

The Meaning Movement cited 9takes in a discussion of Enneagram stress and growth. The link context suggests that clear, compact explanations that another writer can quote are effective linkable assets.

### Deep single-person analysis

The Ashby Florence, Prince, and other personality pages attracted citations, community references, and aggregators. The credible version of this pattern is evidence-rich analysis with a distinctive thesis, not thin celebrity biography content.

### Data and methods transparency

The corpus-statistics page is linked from the project repository. That link is owned, but the asset format is still useful: publish inspectable methods, definitions, and data summaries that other technical or research-oriented writers can cite.

### Sensitive questions with real community demand

The frozen mental-illness article received repeated Reddit links. The useful signal is the underlying discussion demand, not the inflated row count created by translated URL variants. Content in this category needs careful claims, clear limitations, and strong sourcing.

## 9. Monthly 30-minute monitoring procedure

### Minute 0 to 5: establish the comparison point

1. Open this baseline and the most recent monthly log.
2. Record the capture date.
3. Keep Ahrefs and GSC metrics in separate columns.
4. Note whether either tool changed its report coverage or limits.

### Minute 5 to 15: review GSC

1. Open **Links > Top linking sites** and record the site count.
2. Compare new or missing domains against the 16-domain table above.
3. Open **Top linked pages** and look for new target pages, a meaningful drop on a previously linked asset, or URLs that should no longer exist.
4. Drill into only the changed domains or targets.
5. Classify each changed source as editorial, community/UGC, owned, aggregator, noise, or unknown.

### Minute 15 to 25: review Ahrefs

1. Record current backlinks, referring domains, followed backlinks, and followed referring domains.
2. Review **Referring domains** sorted by DR, then inspect context before assigning quality.
3. Review **Backlinks** sorted by DR or page traffic and sample new high-signal rows.
4. Review **Best by links** for targets with meaningful referring-domain counts.
5. If Broken Backlinks is accessible without a purchase, inspect it. If it remains locked, live-check any changed high-value target found in GSC or Best by links instead.
6. Do not spend the timebox cataloging repeated seller-network domains.

### Minute 25 to 30: verify and log

1. Live-check each important new, lost, or apparently broken source/target pair.
2. Record the final status and redirect count.
3. Confirm canonical and sitemap state only when a target looks wrong.
4. Assign one action: preserve, exact on-site repair, manual review, ignore, or DJ approval required.
5. Stop at 30 minutes unless an exact defect is found.

### Monthly log template

```md
## YYYY-MM-DD backlink check

- GSC: external links __; linking sites __; target pages __
- Ahrefs: backlinks __; referring domains __; followed backlinks __; followed domains __
- Legitimate new links:
- Legitimate lost links:
- Changed or broken targets:
- Noise classes observed:
- Exact on-site repair made:
- DJ decision required:
```

### Metrics worth tracking

- Distinct legitimate editorial referring domains
- Distinct relevant community referring domains
- Contextual links to useful content assets
- Important lost links that can be verified on the source page
- Linked 404s or multi-hop redirects with a recoverable on-site cause
- Referral or conversion value when analytics evidence is available

Do not optimize for raw backlink count, raw DR claims from sellers, or the number of translated/parameterized copies of the same source.

### Escalation triggers

Escalate for a focused review when any of these occurs:

- A legitimate source removes or changes an important link and the source page can be verified.
- A legitimate backlink lands on a 404, soft 404, wrong canonical, or redirect chain longer than one hop.
- A new URL decision would consolidate, retire, or redirect a page with legitimate inbound links.
- Search Console reports a manual action or another direct warning.
- A source appears to impersonate 9takes, create legal risk, or expose user/security risk.

## 10. DJ-gated decisions

No decision is required to close this read-only baseline.

The following remain gated:

1. **2025 versus 2026 test-comparison disposition:** T-23 should decide whether both URLs remain independent. T-25 may strengthen the 2025 page only after that decision. Its existing legitimate inbound links argue against an unplanned redirect.
2. **Outreach or relationship work:** Not performed. Any future outreach requires an explicit DJ decision and a separate task.
3. **Paid data or tools:** Not used. The Ahrefs Broken Backlinks upgrade remains optional and is not required for the monthly fallback procedure.
4. **Disavow consideration:** Not recommended from this evidence. Any future review or submission requires explicit DJ approval and a separate risk assessment.
5. **Slug, canonical, redirect, or sitemap changes:** None are justified by this baseline. Any future change must start from an exact source/target defect and check inbound links first.

## 11. Verification record

- Authenticated Ahrefs overview, Referring Domains, Backlinks, and Best by links reports inspected on August 13, 2026.
- Authenticated GSC Links report inspected through every top linking site and top linked target available in the report.
- All 18 GSC targets and 11 additional Ahrefs-visible target forms checked live with redirects followed.
- Representative first-hop statuses checked separately for mixed-case and moved paths.
- Live canonical/robots output sampled on the 2025 comparison, Elon Musk, and corpus-statistics pages.
- `static/sitemap.xml`, `src/hooks.server.ts`, `vercel.json`, the Enneagram article loader, and `docs/BLOG-CROSSLINK-INDEX.md` inspected read-only.
- No outreach, purchase, trial, exchange, disavow, account setting, or off-site write performed.
- No on-site production file changed.

## Limitations

- Ahrefs and GSC are independent crawler indexes and will never reconcile one to one.
- Ahrefs displayed some last-seen values as relative dates.
- GSC does not expose anchors, follow status, or first/last-seen dates in the summarized Links report.
- The free Ahrefs project did not expose Broken Backlinks or New/Lost history.
- Source pages and link contexts can change after the capture date.
- A few one-link GSC domains did not surface their exact source page during the captured session; they remain classified by domain/context as community, social, or unknown rather than being promoted to legitimate editorial links.
