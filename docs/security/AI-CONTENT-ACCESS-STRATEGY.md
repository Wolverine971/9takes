# 9takes AI Content Access Strategy

**Owner:** 9takes  
**Started:** July 17, 2026  
**Current phase:** Phase 1 — rights, discovery hygiene, targeted enforcement, and observation

## Decision

9takes should remain fast and open for people, traditional search engines, link-preview
crawlers, and AI tools acting on a person's request. It should not provide an unrestricted
bulk export or grant model-training crawlers permission to copy the editorial corpus.

The first phase therefore adds no CAPTCHA, login wall, JavaScript challenge, or delay to a
normal page view. It distinguishes crawler purposes where providers publish separate
identities:

| Requester                                                        | Phase 1 treatment                                                     | Reason                                                                  |
| ---------------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Normal anonymous or signed-in reader                             | Allow normally                                                        | No added human friction                                                 |
| Googlebot, Bingbot, and other traditional search crawlers        | Allow normally                                                        | Preserve discovery and organic traffic                                  |
| AI search crawlers such as OAI-SearchBot and Claude-SearchBot    | Allow normally                                                        | Preserve citations and source links                                     |
| User-directed fetchers such as ChatGPT-User and Claude-User      | Allow normally                                                        | A person asked the tool to visit the page                               |
| Named model-training crawlers                                    | Disallow in `robots.txt`; return `403` on high-value editorial routes | State and enforce the no-training policy without touching human traffic |
| Unknown user agents that identify themselves as bots or scrapers | Return `403` on high-value editorial routes                           | Existing common-sense protection                                        |
| Browser-like or unidentified automation                          | Observe in Phase 1                                                    | User-agent blocking alone cannot identify it reliably                   |

## What Phase 1 changes

### 1. Separate search and user retrieval from model training

Keep these discovery paths open:

- traditional search and social/link previews;
- OAI-SearchBot, Claude-SearchBot, PerplexityBot, and Meta-WebIndexer;
- ChatGPT-User, Claude-User, Perplexity-User, and Meta-ExternalFetcher.

Opt out of named training or corpus crawlers:

- GPTBot;
- ClaudeBot and the legacy `anthropic-ai` token;
- CCBot;
- Google-Extended;
- Applebot-Extended;
- Meta-ExternalAgent.

Google-Extended and Applebot-Extended are control tokens rather than independent page
fetchers. Blocking them should not remove pages from Google Search, Spotlight, Siri, or
Safari search results.

### 2. Enforce the policy only on valuable editorial routes

The SvelteKit content guard returns `403` to identified training crawlers on protected
article and personality-analysis routes. It does not run a challenge and does not add an
awaited network call to normal page delivery.

The public homepage, landing pages, and section hubs remain accessible. This preserves
enough information for discovery while making a complete dossier crawl less convenient.

### 3. Stop publishing a corpus manifest

Keep the short, curated `/llms.txt` overview because it helps tools understand what 9takes
is and where its main sections live. Retire `/llms-full.txt`, which listed every published
article and personality analysis in one machine-readable file.

The XML sitemap remains available to normal search engines. A sitemap is a standard search
primitive; the full LLM index was an unnecessary second bulk-discovery surface.

### 4. Publish explicit machine-readable rights

Publish:

- `/license.xml`, using the Really Simple Licensing (RSL) vocabulary to prohibit
  `ai-train`;
- `/ai-use-policy.txt`, explaining the human-readable policy;
- a `License:` reference in `/robots.txt`;
- links to both policy files from `/llms.txt`.

These signals are not an access-control system and not every crawler will honor them.
They make 9takes' intent unambiguous, improve the evidentiary record, and create a clean
path toward future licensing.

### 5. Observe at the edge without acting on visitors

Vercel AI Bots is set to **Log**. Bot Protection remains **Off**.

Log mode labels matching traffic without denying, challenging, or rate-limiting it. This
creates a baseline before any stronger rule is considered.

## Phase 1 success criteria

Evaluate after at least 14 days, preferably 28:

- no material regression in p75 TTFB, LCP, error rate, or bounce rate;
- no increase in reports of blocked legitimate readers;
- Google and Bing indexing remains stable;
- AI search citations and referral traffic remain stable or improve;
- named training-crawler requests to protected pages receive `403`;
- Vercel logs show the size, routes, and recurrence of AI-bot traffic;
- bulk sequential access patterns can be quantified before thresholds are chosen.

The human-performance budget is zero added interaction and no synchronous bot-detection
lookup on the normal request path.

## Rollout

### Phase 1 — signal, separate, enforce, observe

Status:

- [x] Vercel AI Bots set to Log
- [x] Vercel Bot Protection left Off
- [x] Search and user-directed AI agents separated from training agents
- [x] Named training crawlers disallowed in `robots.txt`
- [x] Named training crawlers denied on protected editorial routes
- [x] RSL license and human-readable automated-use policy added
- [x] Bulk `llms-full.txt` manifest retired
- [x] Policy and delivery tests added
- [ ] Deploy the repository changes
- [ ] Record a 14–28 day traffic baseline

### Phase 2 — evidence-based edge limits

Only begin after the Phase 1 baseline exists.

1. Verify provider bots by published IP ranges or Web Bot Auth when available; do not trust
   a user-agent string by itself.
2. Add a log-only custom rule for high-rate sequential reads of protected routes.
3. Review false positives by ASN, country, route, session age, and verified-bot status.
4. If the signal is clean, rate-limit the narrow suspicious cohort at the edge.
5. Challenge only traffic that crosses a high-confidence abuse threshold.

Do not introduce a site-wide CAPTCHA. It adds accessibility and conversion cost, can be
solved or outsourced by determined scrapers, and risks breaking search and AI citation
fetches. A proof-of-humanity step is reasonable later only for a high-value bulk action,
not for an ordinary article read.

### Phase 3 — make the product harder to substitute

Access controls cannot make public prose secret. Strengthen the part an extracted model
cannot replace:

- publish a useful public summary while reserving deeper dossiers, evidence trails, and
  cross-person comparisons for signed-in or paid use;
- make analyses update over time instead of remaining static documents;
- connect each analysis to 9takes discussions, voting, counterarguments, and creator
  commentary;
- add saved profiles, comparison tools, and personalized interpretation;
- build provenance into the experience so readers can see evidence and revisions.

This phase changes the moat from “possession of text” to an evolving product, community,
brand, and dataset.

### Phase 4 — licensed machine access

If there is demonstrated demand:

- offer a documented, rate-limited API or feed for licensed use;
- require attribution and source links;
- use signed requests, scoped keys, quotas, revocation, and usage reporting;
- define separate terms and prices for search grounding, internal retrieval, and training;
- evaluate RSL license servers and authenticated-bot standards.

## Rollback

If legitimate discovery is harmed:

1. revert the affected named crawler from `Disallow: /` to the private-route exclusions;
2. remove it from the server-side training-crawler list;
3. keep Vercel in Log mode while traffic is re-evaluated;
4. do not turn on broad Bot Protection as an emergency substitute.

The RSL policy and retirement of the full LLM manifest can remain in place independently.

## References

- [OpenAI crawler controls](https://developers.openai.com/api/docs/bots)
- [Anthropic crawler controls](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- [Google-Extended documentation](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers#google-extended)
- [Applebot and Applebot-Extended](https://support.apple.com/en-us/119829)
- [Meta web crawler controls](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers)
- [Common Crawl CCBot controls](https://commoncrawl.org/ccbot)
- [RSL getting started](https://rslstandard.org/guide/getting-started)
