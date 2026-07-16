<!-- docs/taskers/T-07-merge-and-301-consolidation-plan.md -->

# Tasker: Merge and 301 Consolidation Plan

**For:** the agent assigned to consolidate the cannibalizing Enneagram Corner clusters into their winners and 301 the losers.
**Owner:** DJ
**Created:** 2026-07-15
**Status:** Not started. Scoped and route-verified 2026-07-15. Every merge below is blocked on its salvage step (§2.1), nothing else.
**Related:** `docs/content-analysis/2026-07-15_enneagram-blog-audit.md` §5 (the authoritative merge/kill list), §8 item 9 (the shipping order), §9.2 (the mental-health trap). Taskers `T-05` (compatibility-matrix rewrite, owns the 457-couple merge itself) and `T-09` (post-merge internal-link and sitemap hygiene, if split out).

---

## 0. What and why

Eight clusters in `/enneagram-corner/` are running two to four articles at the same query. In every case one page has rankings and impressions and the others have neither. The split is costing authority: Google is picking between near-identical pages instead of ranking one strong page.

This tasker does one thing per cluster: **lift the best asset out of the losing pages, fold it into the winner, then 301 the losers into the winner.** It does not rewrite winners beyond the salvage graft. It does not invent merges. The full decision set lives in the audit's §5 table; this document is the work order that executes it.

**Expected impact.** Loser clicks in this set total roughly 30. The upside is not those 30 clicks; it is that the winners stop competing against their own site for the same query, and that four-figure impression counts currently spread across dead duplicates land on one URL. The compatibility cluster alone puts a 457-couple dataset behind a page sitting on 10,735 impressions.

**Scope boundary.** This tasker owns the merges, the redirects, and the post-merge hygiene. It does not own the kill list (§5 "Kill" table), the astrology retitle, or the compatibility-matrix rewrite. Those are separate tickets. Where this tasker touches them, it cross-references and stops.

---

## 1. Required reading

1. `docs/content-analysis/2026-07-15_enneagram-blog-audit.md` **§5 in full**. This is the source of truth for every winner/loser call below. If this tasker and §5 disagree, §5 wins and you flag the discrepancy.
2. Same document **§9.2**. It governs this tasker directly: the mental-health URL split you will see in GSC is a historical artifact, not a live bug. See §2.4.
3. Same document **§8 item 9**. The shipping order, reproduced in §4.
4. Same document **§9.1**. It retracts the unpublish call on `why-therapy-doesnt-work-the-same-for-every-type`, which appears in §5's kill list and in the therapy merge. See §6.
5. `src/routes/enneagram-corner/[slug]/+page.ts`. The redirect mechanism. Read it before writing a redirect; it already has a `redirectMap` and it already has one correct 301.
6. `src/routes/enneagram-corner/mental-health/[slug]/+page.ts`. The sibling route. It has **no** `redirectMap`. This matters for one cluster.
7. `scripts/generate-sitemap.js:856` and `scripts/index-blogs-to-supabase.js:589`. Both key off `published`. This is why §5's housekeeping steps are not optional.

---

## 2. The rules that govern every merge

### 2.1 The salvage-before-301 rule

**This is the most important rule in this document. Read it before you write a single redirect.**

Several losing pages hold the single best asset in their cluster. The audit is explicit about four of them: the anxiety mechanism, the 457-couple data, the resistance thesis, and the Type 8 confession. Once a page 301s, its content is gone from the index and recovering it means digging through git history.

**The sequence, per cluster, without exception:**

1. Salvage: lift the named asset out of the loser and into the winner.
2. Merge: integrate it so the winner reads as one article, not a graft.
3. Verify: `pnpm dev`, load the winner, confirm it renders and the salvaged asset is present and correct.
4. Only then: set the losers `published: false` and add the 301.

**Never 301 first.** Never "redirect now and salvage later." A 301 in front of un-salvaged content is a permanent loss, and it is silent.

### 2.2 The frozen page

`enneagram-and-mental-illness` is the highest-traffic page on the site: **287 clicks / 12,192 impressions / 2.35% CTR at position 8.2**. Its title and slug are **frozen**.

- It may **absorb** other pages. `enneagram-mental-health-flags` merging into it is the one merge in this set that the top page receives, and it is allowed.
- It may **never** be absorbed, retitled, reslugged, or restructured.
- Any proposal that 301s this page away is wrong on its face. Stop and report instead.

Light-touch edits only, and only what §4.7 specifies.

### 2.3 Winners are picked by authority, not by prose quality

The audit's rule, and it is counterintuitive on at least three of these clusters: **the page with existing impressions and rankings wins and absorbs, even when the loser is better written.**

`enneagram-compatibility-guide` is the better argument and it loses to `enneagram-compatibility-matrix`. `relationship-communication-guide` is a 6.5 and it beats a 6,111-word guide because it owns 69% of the cluster's impressions. Rankings are the asset and they do not move. Prose moves for free. Do not relitigate a winner call because the loser reads better; that is exactly the trade the rule exists to prevent.

### 2.4 Do not re-fix the mental-health URLs (the trap)

You will look at the GSC data and see both `/enneagram-corner/<slug>` and `/enneagram-corner/mental-health/<slug>` rows for the same page. **This is not a live split and you must not "fix" it.**

Commit `74ae2440` (2026-05-04) already added a 301 from the flat URL to the subdirectory URL. It is at `src/routes/enneagram-corner/[slug]/+page.ts:37-39`. It works. The GSC window (Apr 7 to Jul 6) **straddles** that fix, which is why both URLs appear in one export. `enneagram-neurodivergence-guide`, which grew after the fix, has zero flat-URL rows, which is the control that proves it.

**The subdirectory is canonical and has two months of consolidation banked.** Do not reverse the direction. Do not add a competing rule. Do not remove the existing 301. If you find yourself writing a redirect that points at a flat mental-health URL, you have gone the wrong way.

### 2.5 The anti-merge list

The audit explicitly considered and **rejected** these. They are recorded here so a future agent does not helpfully do them anyway:

| Pair                                                                                                                                           | Why not                                                                                                                                                                                                     |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `toxic-traits-of-each-enneagram-type` (54 clicks) and `toxic-traits-relationships-warning-signs` (44 clicks)                                   | Both rank. Different intents. Nothing is being cannibalized.                                                                                                                                                |
| `enneagram-and-adhd-which-types-struggle-most` (252 clicks, #2 page) and `mental-health/enneagram-neurodivergence-guide` (141 clicks, #3 page) | **They rose together.** Both roughly tripled impressions in the window and neurodivergence CTR rose from 1.82% to 2.83%. They are not competing. Merging them would destroy the two best pages on the site. |
| `enneagram-dating-guide-for-women` into the men's guide                                                                                        | Gendered dating queries are distinct intents. The women's guide has an indexing problem, not a cannibalization problem.                                                                                     |
| `mental-health/enneagram-workplace-mental-health` into the teams cluster                                                                       | §5 keeps it separate. Different topic.                                                                                                                                                                      |

If you believe one of these is wrong, write it up and hand it to DJ. Do not act on it inside this tasker.

---

## 3. The redirect mechanism

### 3.1 Use the existing `redirectMap`, not `vercel.json`

`src/routes/enneagram-corner/[slug]/+page.ts` already carries this at the top of the file:

```ts
const redirectMap: Record<string, string> = {
	'enneagram-communication-overview': 'enneagram-communication-guide',
	'enneagram-communication-in-relationships': 'relationship-communication-guide',
	'enneagram-types-overview': 'enneagram-tldr',
	'enneagram-test': 'enneagram-test-comparison-2025',
	'enneagram-types-being-direct': 'enneagram-communication-styles'
};

export const load: PageLoad = async ({ params, data }) => {
	if (redirectMap[params.slug]) {
		// throw error(301, redirectMap[params.slug]);
		throw redirect(302, redirectMap[params.slug]);
	}
	// ...
```

**Extend this map. Do not add `vercel.json` rules.** The justification is the same shape as the one in `docs/development/url-case-redirect-audit-tasker.md` §3 Step 1: the redirect set is content-driven and changes when content changes, so it belongs next to the content routing, not in a platform config file that nobody looks at when they merge a blog. It is also already the house pattern here, it already sits ahead of the glob so it fires before a 404 can, and it is unit-testable without a deploy.

### 3.2 The 302 bug: fix it, it is nearly free

Every entry in that map fires `redirect(302, ...)`. **302 is temporary and passes no link equity.** These five have been leaking equity since they were added. Note the commented-out `// throw error(301, ...)` directly above: someone intended 301 and either regressed it or never finished. The same file gets 301 right at line 38 for the mental-health rule, so the pattern is already proven in-file.

Converting all five to 301 is part of this tasker. Two of the five need their **target** changed as well, because their current targets are pages this tasker demotes to losers:

| Slug                                       | Current target                     | Status                        | Action                                             |
| ------------------------------------------ | ---------------------------------- | ----------------------------- | -------------------------------------------------- |
| `enneagram-communication-overview`         | `enneagram-communication-guide`    | target becomes a loser (§4.3) | Repoint to `relationship-communication-guide`, 301 |
| `enneagram-types-being-direct`             | `enneagram-communication-styles`   | target becomes a loser (§4.3) | Repoint to `relationship-communication-guide`, 301 |
| `enneagram-communication-in-relationships` | `relationship-communication-guide` | already the winner            | 301 only, target unchanged                         |
| `enneagram-types-overview`                 | `enneagram-tldr`                   | unaffected by any merge       | 301 only, target unchanged                         |
| `enneagram-test`                           | `enneagram-test-comparison-2025`   | unaffected by any merge       | 301 only, target unchanged                         |

**Why repoint rather than chain.** If you only flip the status, `enneagram-communication-overview` 301s to `enneagram-communication-guide`, which then 301s to `relationship-communication-guide`. That is a two-hop chain. It resolves, but it bleeds equity, burns crawl budget, and is trivially avoidable. Point every source at the final destination.

**Flag for DJ:** §5 says "the redirectMap currently 302s **two** old comms slugs here." The file actually has **three** comms slugs in the map, and neither of the two that need repointing currently points at the winner. §5's count is off by one and its phrasing implies the targets are already correct; they are not. The repoint decision above is this tasker's reading of §5's intent, not its literal text. Confirm before shipping.

### 3.3 Use absolute paths for new entries

Existing map values are bare slugs. SvelteKit resolves them relative to the current URL, which happens to work when source and target sit in the same directory. **It breaks the moment a target lives in `mental-health/`,** which is true for two clusters in this set (anxiety, neurodiversity).

New entries must be absolute:

```ts
'anxiety-and-enneagram-types-guide': '/enneagram-corner/mental-health/enneagram-anxiety-complete-guide',
```

Preserving the querystring is not automatic. If the map dispatch does not already append `url.search`, add it, the same way the personality-analysis fix does. A redirect that eats `?utm_source=` breaks attribution on every consolidated page at once.

### 3.4 The one cluster that needs the sibling route

`mental-health/[slug]/+page.ts` has **no** `redirectMap`. It does not need one for anything in §4: every loser in this set is a flat-route page. Verify this before you assume it, and if a mental-health loser ever appears, that route needs the same map added, not a hack in the flat route.

### 3.5 Unpublish the loser, do not delete the file

After salvage, set `published: false` in the loser's frontmatter. Do not delete the file, and do not rely on the redirect alone.

- The redirect alone makes the page unreachable but leaves it in `static/sitemap.xml` (the generator gates on `metadata.published`, `scripts/generate-sitemap.js:856`) and in the Supabase search index (`scripts/index-blogs-to-supabase.js` unpublishes stale rows on the next run).
- Unpublishing alone 404s the URL and throws away the equity.
- **You need both.** Unpublish removes it from the site's own surfaces; the 301 hands its equity to the winner.

Keeping the file preserves the salvage source in-tree, which is the cheap insurance against a bad merge.

---

## 4. The merge queue, in dependency order

**Ship in this order.** It is §8 item 9's order and it is not arbitrary. Several pages appear in more than one cluster, and merging out of order strands content: the communication cluster's redirect targets are themselves losers (§3.2), so touching the 302s before the winner is settled writes redirects you then have to unwrite. Anxiety is first because it is self-contained and small, which makes it the pilot that proves the salvage-then-301 sequence before the four-way clusters.

**One cluster per commit.** Do not ship all eight in one commit. A bad merge must be revertable alone.

### 4.1 Anxiety (three-way)

- **Winner:** `mental-health/enneagram-anxiety-complete-guide` (7 clicks, consolidating)
- **Losers:** `enneagram-anxiety-management-guide` (not indexed), `anxiety-and-enneagram-types-guide` (0 clicks)
- **Salvage first:** the management-guide's buried thesis, that **each type's anxiety manufactures the outcome it fears**. The audit notes it is announced as "the most important insight in this entire article" and buried at 90% depth. Lift it and make it the winner's **lede**.
- **301 target:** `/enneagram-corner/mental-health/enneagram-anxiety-complete-guide` (absolute path, cross-directory)
- **Note:** two near-identical articles published three days apart making the same Type-6 argument. This is the cleanest merge in the set.
- **Bonus cleanup while you are in the file:** `src/blog/enneagram/enneagram-anxiety-management-guide.md:741` links to a flat (301'd) mental-health URL. Fix it to the subdirectory URL. Same for `src/blog/enneagram/drafts/positive-self-talk-outline.md:526`.

### 4.2 Compatibility (guide into matrix)

- **Winner:** `enneagram-compatibility-matrix` (81 clicks / 10,735 imp / pos 11.9)
- **Loser:** `enneagram-compatibility-guide` (0 clicks / 246 imp, graded 5.5)
- **Salvage first:** the **457-couple dataset**. Four pairings account for 73.4% of 457 couples, roughly 9x chance. The guide then concludes this proves pairings do **not** cluster, which is exactly backwards. **Correct the inversion during the lift.** The data is real and it is the matrix's evidentiary spine; the conclusion attached to it is wrong and must not travel with it.
- **301 target:** `/enneagram-corner/enneagram-compatibility-matrix`
- **Dependency:** the salvage-and-correct work is **T-05's job**, not this tasker's. T-05 owns the matrix rewrite (title, chart above the fold, the 81-vs-45 promise) and the 457-couple graft lands inside it. **T-07 owns the 301 and the ordering.** Do not do T-05's work here and do not 301 the guide until T-05 confirms the data has landed in the matrix and renders. If T-05 has not shipped, skip to §4.3 and come back.

### 4.3 Communication (four-way, plus the 302 conversion)

- **Winner:** `relationship-communication-guide` (1 click / 2,120 imp / pos 33.9). It owns 69% of the cluster's impressions and position 33.9 is upside, not a verdict.
- **Losers:** `enneagram-communication-guide` (0 clicks on 6,111 words), `enneagram-communication-styles`, `enneagram-communication-tips`
- **Salvage first:** `enneagram-communication-tips`' **scripts**. Concrete, checkable, and the reason that page exists. Absorb them into the winner.
- **301 target:** `/enneagram-corner/relationship-communication-guide` for all three.
- **Also in this commit:** the full 302 to 301 conversion from §3.2, all five entries, including the two repoints. This is the cluster the 302s belong to, so it ships here.
- **Watch for:** `enneagram-communication-styles` is referenced from a large number of files (see §5.3). This is the biggest internal-link cleanup in the set.

### 4.4 Teams (four-way)

- **Winner:** `enneagram-types-working-in-teams` (3 clicks / 1,450 imp / pos 53.7)
- **Losers:** `enneagram-team-dynamics`, `enneagram-team-diversity`, `enneagram-workplace-team-building`
- **Salvage first:** `enneagram-workplace-team-building`'s thesis, that **the behaviors that annoy you reveal the perspectives you are missing**.
- **301 target:** `/enneagram-corner/enneagram-types-working-in-teams`
- **Read the audit's caveat:** §5 calls this **merge-and-rebuild, not merge**. Position 53.7 means nothing in this cluster ranks, so absorbing three dead pages into a fourth dead page buys very little on its own. If you cannot do the rebuild inside this ticket, do the salvage and the 301 anyway (consolidation is still correct) and file the rebuild separately. Say which one you did.
- **Do not touch** `mental-health/enneagram-workplace-mental-health`. It stays separate (§2.5).

### 4.5 Growth (four-way)

- **Winner:** `enneagram-personal-growth` (2 clicks / 958 imp)
- **Losers:** `enneagram-self-development`, `personality-maxing`, `90-day-personality-maxing-blueprint`
- **Salvage first:** `enneagram-self-development`'s **Type 8 confession**. The audit calls it the one genuinely unrepeatable thing in the cluster. It is the reason this cluster is worth merging rather than killing.
- **301 target:** `/enneagram-corner/enneagram-personal-growth`
- **Why the maxing pages lose:** "personality maxing" is a coined term with no search demand. It is not a ranking that needs protecting.
- **Carry-over hazard:** `enneagram-self-development` had its em-dash purge run as a find/replace with a colon and the prose is corrupted ("which core emotion: anger, fear, or shame: resonates most"), including in its JSON-LD. Do not carry corrupted sentences into the winner. Repair on lift or leave them behind.

### 4.6 First impressions (two-way)

- **Winner:** `first-impression-cheat-sheet` (6 clicks / pos 7.8, 527 words)
- **Loser:** `first-impression-enneagram-playbook` (not indexed)
- **Salvage first:** the playbook's **body-language specifics**. The cheat-sheet is 527 words with zero falsifiable claims; the specifics are what it is missing.
- **301 target:** `/enneagram-corner/first-impression-cheat-sheet`
- **Hard stop:** the playbook's only evidence is a **fabricated MIT citation** ("11 major decisions in the first 7 seconds"). No such paper exists. **Delete it. Do not carry it over.** If you find yourself moving a citation during this merge, you are moving the wrong thing.

### 4.7 Mental-health-flags into mental-illness

- **Winner:** `enneagram-and-mental-illness` (287 clicks / 12,192 imp / 2.35% / pos 8.2). **FROZEN. Absorb only.** See §2.2.
- **Loser:** `enneagram-mental-health-flags` (19 clicks / 950 imp)
- **Salvage first:** flags is a strict subset of the frozen page's intent, so the salvage here is whatever flags says that mental-illness does not. Keep the graft small and additive.
- **301 target:** `/enneagram-corner/enneagram-and-mental-illness`
- **Constraints, non-negotiable:** no title change, no slug change, no restructure, no heading reshuffle. The "Mental Health Risk Overview by Type" table is almost certainly why the page outranks everything else on the site. Do not reformat it. Add content, change nothing that exists.
- **`lastmod` stays untouched.** This page more than any other.

### 4.8 Neurodiversity into neurodivergence

- **Winner:** `mental-health/enneagram-neurodivergence-guide` (141 clicks, #3 page on the site)
- **Loser:** `neurodiversity-vs-personality` (7 clicks)
- **Before anything else:** `neurodiversity-vs-personality.md` ships **268 lines of internal editor notes** (lines 391 to 658) in public page source, including a competitor teardown naming Psyche.co. **That is T-02's job and it may already be done.** Check T-02's status. Do not carry a single line of that block into the winner, and do not salvage from inside it.
- **301 target:** `/enneagram-corner/mental-health/enneagram-neurodivergence-guide` (absolute path, cross-directory)
- **Handle with care:** the winner is the #3 page and it is on §9.1's stale-`safety_gate` list. Ignore that flag (it is four months stale, §9.1), and do not let a merge break a 141-click page. If the graft is not clearly additive, do the 301 without it.

---

## 5. Post-merge housekeeping

Run these after **each** cluster, not once at the end. A cluster is not shipped until its housekeeping is done.

### 5.1 Sitemap

```bash
pnpm gen:sitemap
```

`scripts/generate-sitemap.js:856` emits only entries where `metadata.published && metadata.loc`. Once a loser is `published: false`, this drops it. A merged slug left in the sitemap tells Google to keep crawling a URL you just 301'd, which is the opposite of consolidation.

### 5.2 Blog search index

```bash
pnpm index:blogs:dry   # preview first
pnpm index:blogs
```

The indexer unpublishes stale Supabase rows for files that are no longer `published: true`. Skip this and the merged pages keep showing up in on-site blog search, pointing at URLs that 301 away.

### 5.3 Internal links

Merged slugs are linked from other blogs. Stale internal links to a 301'd page regenerate crawl waste on every recrawl and dilute the consolidation you just paid for.

Find them per loser slug:

```bash
grep -rn "enneagram-compatibility-guide" src/blog/ --include="*.md"
```

Reference counts as of 2026-07-15 (`grep -rl`, files matching, includes the loser file itself and substring overlaps such as `personality-maxing` inside `90-day-personality-maxing-blueprint`, so treat as an upper bound and read each hit):

| Loser slug                            | Files referencing |
| ------------------------------------- | ----------------- |
| `enneagram-communication-styles`      | 68                |
| `anxiety-and-enneagram-types-guide`   | 29                |
| `personality-maxing`                  | 17                |
| `enneagram-self-development`          | 15                |
| `enneagram-anxiety-management-guide`  | 10                |
| `enneagram-communication-guide`       | 7                 |
| `enneagram-mental-health-flags`       | 7                 |
| `enneagram-communication-tips`        | 6                 |
| `90-day-personality-maxing-blueprint` | 5                 |
| `enneagram-team-dynamics`             | 4                 |
| `enneagram-workplace-team-building`   | 4                 |
| `enneagram-compatibility-guide`       | 3                 |
| `first-impression-enneagram-playbook` | 3                 |
| `neurodiversity-vs-personality`       | 3                 |
| `enneagram-team-diversity`            | 2                 |

Rewrite each hit to the winner's URL. Do not do this with a blind `sed`: some hits are prose mentions, not links, and `personality-maxing` is a substring of another slug in the same cluster. Read each one.

Also sweep `src/lib/` and `src/routes/` for hard-coded references:

```bash
grep -rn "enneagram-corner/first-impression-enneagram-playbook" src/lib/ src/routes/
```

### 5.4 GSC re-crawl

Request re-crawl for the highest-impression losers only. The longtail consolidates on Googlebot's own schedule and manual submission is not worth the keystrokes below roughly 1,000 impressions.

Priority order by impressions:

1. `enneagram-communication-guide` (part of the 2,120-impression cluster; the winner is the one to submit)
2. `enneagram-compatibility-guide` (246 imp, but the winner carries 10,735 and is the page that changed)
3. `enneagram-mental-health-flags` (950 imp)
4. `neurodiversity-vs-personality` (the winner carries 141 clicks)

For each: GSC to URL Inspection, paste the **loser** URL, confirm it reports a redirect to the winner, then Request Indexing on the **winner**.

---

## 6. Open conflicts to raise with DJ, not to resolve

Three §5 merges are **not** in §8 item 9's shipping order. That is a real gap in the source, not an oversight you should paper over. Do not ship them inside this tasker without a decision:

- **Therapy** (`enneagram-therapy-resistance-guide` and `why-therapy-doesnt-work-the-same-for-every-type` into `mental-health/enneagram-therapy-guide`). §5 names the resistance-guide's thesis ("resistance IS the therapy") as the cluster's strongest idea and the salvage target. But `why-therapy-doesnt-work...` is also in §5's Kill table on a `safety_gate: fail` flag, and **§9.1 retracts that call**: the flag is a four-month-stale batch stamp shared by 8 files, and the safety work was done on 2026-03-10. So §5's kill row for that page is stale, and whether it is a merge loser or stays as-is is now an open question. Also note both therapy files live in `mental-health/`, so this cluster would need a `redirectMap` added to the sibling route (§3.4). Ask DJ.
- **Dating** (`enneagram-online-dating-guide` and `how-to-navigate-early-relationship-stages` into `enneagram-dating-guide-for-men`). §5 keeps the women's guide separate and notes the online-dating guide is not really an Enneagram article (26 of 27 mentions are link slugs) and should not live in this folder at all. That is a relocation decision, not a merge. Ask DJ.
- **Frameworks** (`enneagram-vs-meyers-briggs` into `enneagram-vs-personality-frameworks-comparison`). §5 marks this **superseded by its own kill recommendation** for the comparison page. You cannot merge into a page you are killing. This resolves only after the kill decision. Ask DJ.

One more, for the record: §6 item 5 suggests `enneagram-types-in-relationships` (pos 32.8) may need "consolidation into compatibility-matrix," which would make it a fifth compatibility-cluster page. **§5 does not list it as a merge.** It is out of scope here. Flag it, do not do it.

---

## Verification checklist

Per cluster, before the commit lands:

- [ ] The named salvage asset is present in the winner and renders correctly (`pnpm dev`, load the page)
- [ ] Salvage happened **before** the redirect was written (check your own commit order)
- [ ] Loser frontmatter is `published: false`
- [ ] `lastmod` is unchanged in every touched file
- [ ] Zero em-dashes introduced in any prose you moved or wrote
- [ ] `pnpm check` passes on the touched route file

Per redirect, after deploy (curl, mirroring `url-case-redirect-audit-tasker.md` §4):

- [ ] `curl -I https://9takes.com/enneagram-corner/enneagram-compatibility-guide` returns **HTTP 301** (not 302) with `Location: /enneagram-corner/enneagram-compatibility-matrix`
- [ ] `curl -I https://9takes.com/enneagram-corner/enneagram-compatibility-matrix` returns **HTTP 200** (no redirect loop)
- [ ] Cross-directory target resolves: `curl -I https://9takes.com/enneagram-corner/anxiety-and-enneagram-types-guide` returns `Location: /enneagram-corner/mental-health/enneagram-anxiety-complete-guide` (absolute, not a relative slug that lands on the flat route)
- [ ] No chain: `curl -sIL https://9takes.com/enneagram-corner/enneagram-communication-overview | grep -c "HTTP/"` returns **2**, not 3. One hop, then 200.
- [ ] All five legacy entries are 301: `for s in enneagram-communication-overview enneagram-communication-in-relationships enneagram-types-overview enneagram-test enneagram-types-being-direct; do curl -sI "https://9takes.com/enneagram-corner/$s" | head -1; done` shows **301** on every line
- [ ] Querystring preserved: `curl -I "https://9takes.com/enneagram-corner/enneagram-compatibility-guide?utm_source=test"` returns a `Location` ending in `?utm_source=test`
- [ ] The pre-existing mental-health 301 still works and still points at the **subdirectory**: `curl -I https://9takes.com/enneagram-corner/enneagram-neurodivergence-guide` returns 301 to `/enneagram-corner/mental-health/enneagram-neurodivergence-guide`
- [ ] 404s still 404: `curl -I https://9takes.com/enneagram-corner/not-a-real-slug` returns 404, not a redirect
- [ ] `grep -c "302" src/routes/enneagram-corner/[slug]/+page.ts` returns **0**

Site-wide, after all clusters:

- [ ] `grep -n "enneagram-compatibility-guide" static/sitemap.xml` returns nothing (repeat per loser slug)
- [ ] `pnpm index:blogs:dry` reports the loser rows as unpublished, not as live entries
- [ ] Internal-link grep per §5.3 returns zero live links to any loser slug (excluding the loser files themselves and this tasker)
- [ ] `/enneagram-corner` listing page does not show any loser
- [ ] GSC re-crawl requested for the four priority URLs in §5.4

---

## Risks and gotchas

- **Risk: 301 before salvage.** The single worst outcome available here. It is irreversible in practice: the content leaves the index, the redirect is cached by browsers and by Google, and recovery means git archaeology plus waiting on a recrawl. §2.1 exists because this is the easy mistake to make when you are moving fast through eight clusters.
- **Risk: re-fixing the mental-health URLs.** See §2.4. The GSC data will actively bait you into this. The fix already shipped 2026-05-04 and reversing it burns two months of banked consolidation.
- **Risk: redirect chains.** Two entries in the existing `redirectMap` point at pages this tasker demotes. Flip status without repointing and you build a chain (§3.2). Test with `curl -sIL` and count the hops.
- **Risk: relative redirect targets.** The existing map uses bare slugs that only work same-directory. Two new entries cross into `mental-health/`. Use absolute paths (§3.3) or you will silently redirect to a flat URL that then 301s again, chaining into the very rule you were told not to touch.
- **Risk: `lastmod` drift.** Merges edit content, so this is a **live** risk on this tasker, more than on any other in the set. DJ manages `lastmod` by hand. Do not touch it, do not let a tool touch it, and specifically never run `personBlogParser.js --publish` (it rewrites `lastmod` to today). This applies to winners you edit heavily and to the frozen page above all.
- **Risk: touching the frozen page.** `enneagram-and-mental-illness` is 287 clicks at 2.35%. It absorbs, it is never absorbed, and its title, slug, and structure do not move (§2.2).
- **Risk: shipping eight merges in one commit.** One cluster per commit. If a merge turns out to be wrong, it must be revertable without unwinding the other seven.
- **Risk: parallel work.** DJ and other agents edit this repo simultaneously. This tasker touches more files than any other in the set. **Never `git stash`. Never bulk-reset. Never a repo-wide `sed`.** Touch only the winners, the losers, the two route files, and the internal links you have read individually.
- **Risk: carrying fabrications forward.** Two salvage sources are contaminated: the first-impressions playbook's fabricated MIT citation (§4.6) and `enneagram-self-development`'s colon-corrupted prose (§4.5). A merge is the moment a fabrication gets laundered into a page with real traffic. Read what you lift.
- **Risk: the inversion travels.** The 457-couple data and its wrong conclusion sit in the same paragraphs. Lift the data, kill the conclusion (§4.2). T-05 owns this; verify it happened before you 301.
- **Em-dashes are banned, zero per article.** Salvaged prose is prose. It is in scope.
- **Non-risk: browsers caching the 301.** They will, aggressively, and that is the point. It does mean your own browser may lie to you during QA. Verify with `curl`, not with a reload.

---

## Measurement

**Before the first 301 lands,** baseline **every winner and every loser** in §4. Sixteen URLs. From the current GSC export in `docs/data/gsc/`, record per URL: clicks, impressions, CTR, average position. Record the date. Store it alongside the audit in `docs/content-analysis/`.

Do not skip the losers. They are the control: if loser clicks do not fall, the redirect is not firing.

The per-cluster figures quoted in §4 are the audit's Apr 7 to Jul 6 numbers. **Do not reuse them as your baseline without checking the window.** That window straddles the 2026-05-04 URL fix (§2.4), which contaminates every mental-health comparison in it, and §8 item 12 calls for re-running `fetch-gsc-data.mjs`. If that re-run has happened, baseline from the clean window and treat §4's numbers as the decision record only.

**At 2 weeks:** re-snapshot all sixteen. Expect loser clicks approaching zero and winner clicks approaching the sum of the pair or cluster.

**At 4 weeks:** re-snapshot again. This is the read that counts.

**Do not panic at week 1.** Consolidation typically **dips before it lifts**: Google drops the loser before it fully reattributes to the winner, so the cluster total can look worse for one to three weeks. That dip is the mechanism working, not a failure. The signal to worry about is a loser that is still earning clicks at week 4, which means the 301 is not firing or is not being followed.

Log all three snapshots in `docs/content-analysis/` under "T-07 merge consolidation" with dates.

---

## Definition of done

- [ ] All eight clusters in §4 shipped, one commit each, in §8 item 9's order
- [ ] Every named salvage asset lifted **before** its 301: the anxiety mechanism, the 457-couple data (via T-05), the resistance thesis (deferred, see §6), the Type 8 confession
- [ ] All five legacy `redirectMap` entries converted from 302 to 301, with the two repoints applied
- [ ] All new `redirectMap` entries use absolute paths and preserve the querystring
- [ ] `enneagram-and-mental-illness` absorbed `enneagram-mental-health-flags` with title, slug, and structure untouched
- [ ] The existing mental-health flat-to-subdirectory 301 verified still intact and unreversed
- [ ] Every loser is `published: false`, none deleted
- [ ] `pnpm gen:sitemap` and `pnpm index:blogs` run; no loser in the sitemap or the search index
- [ ] Internal links rewritten per §5.3, read individually, zero live links to a loser
- [ ] `lastmod` unchanged in every touched file
- [ ] Full curl checklist passes in production, including the no-chain check
- [ ] GSC re-crawl requested for the four priority URLs
- [ ] Baseline snapshot recorded before the first 301; 2-week and 4-week follow-ups scheduled
- [ ] §6 conflicts (therapy, dating, frameworks, types-in-relationships) raised with DJ and **not** shipped
- [ ] The §3.2 discrepancy (§5 says two comms 302s, the file has three) reported to DJ

If any box cannot be checked, stop and report rather than shipping a partial consolidation. A half-merged cluster is worse than an un-merged one: it has the redirect without the content.
