<!-- docs/taskers/T-28-backlink-hygiene-and-monitoring.md -->

# Tasker: Establish Backlink Hygiene and Free Monitoring

**For:** Off-page SEO research agent  
**Owner:** DJ  
**Created:** 2026-08-13  
**Status:** Ready, read-only by default  
**Related:** `docs/seo/2026-08-13-free-seo-execution-roadmap.md`, current Ahrefs and GSC Links reports

## 0. What and why

Ahrefs reports 524 backlinks from 468 referring domains, but only 51 referring domains are dofollow and many high-volume rows are marked as spam or backlink sellers. GSC reports a much smaller set of links it associates with the property: 48 external links, led by Reddit, GitHub, IDCrawl, Personality Cafe, and Enneagram Universe.

The goal is to identify legitimate authority, recover genuinely lost links where an on-site defect caused the loss, and create a lightweight monitoring routine. It is not to chase the backlink total or submit a speculative disavow file.

## 1. Required reading

1. `CLAUDE.md`
2. `docs/taskers/README.md`
3. `docs/seo/2026-08-13-free-seo-execution-roadmap.md`
4. Current Ahrefs referring-domain, backlink, broken-backlink, and best-by-links reports available on the free account
5. Current GSC Links report
6. Current redirects, canonicals, sitemap, and top linked pages in the repository

Run `git status --short` first. This task is read-only unless it finds a specific internal defect such as a broken linked URL or incorrect redirect.

## 2. Build the evidence table

Classify referring domains and important links as:

- legitimate editorial or community reference;
- owned or profile link;
- directory or aggregator with plausible value;
- low-value automated or scraper link;
- obvious backlink seller or spam; or
- unknown, manual review needed.

Record dofollow or nofollow, linked target, anchor, first and last seen where available, GSC presence, and whether the target resolves correctly. Give priority to legitimate domains already observed, including Wikipedia, GitHub, Reddit, Enneagram Universe, Personality Database, The Meaning Movement, F6S, and other verified editorial references. A domain name in the Ahrefs table is not proof that every link from it is valuable.

## 3. Identify actionable opportunities

Look for:

- legitimate links pointing to 404s, redirect chains, or noncanonical variants;
- lost editorial links associated with an accidental on-site change;
- pages with real links but weak internal support;
- unlinked brand mentions only when discoverable through free tools; and
- examples of content formats that earned legitimate links naturally.

Fix only clear on-site defects. Do not contact anyone, buy links, exchange links, or submit a disavow without DJ's explicit approval.

## 4. Define a free monitoring routine

Create a monthly checklist using Ahrefs Webmaster Tools and GSC. It should fit in 30 minutes and track legitimate new domains, important lost links, linked 404s, and notable changes in GSC's link set. Do not use raw backlink count as a KPI.

## Verification checklist

- [ ] Ahrefs and GSC counts are kept separate and their coverage differences explained.
- [ ] Spam classifications include evidence and are not treated as automatic disavow instructions.
- [ ] Every proposed recovery action names the exact link and on-site defect.
- [ ] No outreach, purchase, exchange, or disavow occurs.
- [ ] Any internal redirect or link fix passes relevant checks.

## Deliverable

Create `docs/seo/2026-08-13-backlink-hygiene-baseline.md` with the classified baseline, legitimate-link highlights, actionable defects, content patterns that attracted links, ignored spam classes, and the monthly monitoring checklist.

## Risks and gotchas

Third-party crawlers see different parts of the web, so Ahrefs and GSC will not match. Spam links are common and usually require no action. An aggressive disavow can remove signals Google already ignores or harm legitimate authority. Link labels such as dofollow and nofollow do not measure editorial quality by themselves.

## Definition of done

9takes has a defensible baseline of legitimate and low-value links, any safe on-site recovery fixes are verified, and a short free monitoring routine replaces reactive attention to inflated backlink totals.
