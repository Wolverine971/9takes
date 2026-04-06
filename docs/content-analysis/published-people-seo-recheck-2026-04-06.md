<!-- docs/content-analysis/published-people-seo-recheck-2026-04-06.md -->

# Published People SEO Recheck

**Date:** 2026-04-06  
**Scope:** all published people profiles in `src/blog/people/drafts/*.md`  
**Count reviewed:** **83** published profiles  
**Focus:** remaining weak H1s, weak or missing `meta_title`, description outliers, generic H2 systems, and H2s that sound too SEO-forced

## Executive Take

The recent cleanup passes held up well.

The historical published corpus is in much better shape than it was before the last rounds of edits. The remaining problems are now concentrated in a smaller set of legacy posts rather than spread across the whole archive.

After a fresh scan and spot-check:

- **1** published post still has an obvious metadata gap
- about **12** published posts still have real structural SEO/editorial issues
- another **12** published posts mostly just need description trimming or expansion

The key pattern has shifted again:

- it is **not** mostly generic H1s anymore
- it is now mostly:
  - one unfinished metadata case
  - a handful of old-school H2 systems
  - several posts where the H2s overuse the person's name and feel too SEO-driven
  - a small group of meta descriptions that are too short, too long, or still too framework-heavy

## What Looks Good Now

I would **not** reopen the recent/historical posts we just tuned unless you want marginal polish.

The recent rewrites now read substantially better in the H2 systems, especially:

- `Taylor-Swift.md`
- `Hillary-Clinton.md`
- `Mr-Beast.md`
- `Jon-Stewart.md`
- `Scarlett-Johansson.md`
- `Tom-Cruise.md`
- `Chelsea-Handler.md`
- `Casey-Neistat.md`

Those no longer look like template SEO pages.

## Priority 1: Clear Remaining Problems

### 1. `Sabrina-Carpenter.md`

This is still the cleanest remaining fix target in the whole published set.

- Missing `meta_title`
- H2 system is still partly generic and old-style
- Examples:
  - `Sabrina Carpenter's Upbringing`
  - `Rise to Fame`
  - `How Sabrina Thinks: Personality Quirks and Mental Patterns`
  - `Sabrina Carpenter's Legacy`

This one still looks like a strong article whose metadata/subhead pass never fully happened.

### 2. `Michelle-Obama.md`

This is the strongest article still carrying older title/section packaging.

- H1 still leads with framework language:
  - `Michelle Obama: The Enneagram Type 1 Behind America's Most Disciplined Fire`
- H2 system is too literary/opaque in places
- Examples:
  - `The Visitor`
  - `The Pivot`
  - `Becoming`
  - `Less Light`
  - `Toward Seven`

The article itself is strong. The packaging is what feels behind the rest of the corpus.

## Priority 2: Name-Heavy H2 Systems

These are the posts where the article structure keeps saying the person's name over and over, to the point that the sections start sounding like SEO scaffolding instead of natural prose.

### Highest-confidence offenders

- `Adin-Ross.md`
  - examples: `Adin Ross's Upbringing`, `Adin Ross's Love Life`, `Adin Ross's Legacy`
- `Bad-Bunny.md`
  - examples: `Bad Bunny's Upbringing`, `Bad Bunny's Rise to Fame`, `Bad Bunny's Legacy and Current Work`
- `Brad-Pitt.md`
  - examples: `Brad Pitt's Inner World`, `Brad Pitt's Relationships`, `What Makes Brad Pitt Happy?`
- `Druski.md`
  - examples: `How Druski Used "Big Boss Energy"...`, `The Depression Nobody Saw Behind Druski's Rise to Fame`, `What the Harlow Roast Reveals About Druski's True Self`
- `IShowSpeed.md`
  - examples: `IShowSpeed's Childhood`, `IShowSpeed's Biggest Public Embarrassment`, `Why IShowSpeed Has 135 Million Followers and Still Feels Alone`
- `Joe-Rogan.md`
  - examples: `How Joe Rogan Got Into Comedy`, `Why Joe Rogan Talks to Everyone`, `Joe Rogan's Inner Circle and Loyalty Pattern`
- `Kai-Cenat.md`
  - examples: `Kai Cenat's Childhood in the Bronx`, `How Kai Cenat Became Twitch's Loudest Star`, `What Happens When Kai Cenat Stops Streaming`

These do **not** all need dramatic rewriting. They need the same calibration pass we just did on Taylor/Hillary/MrBeast:

- keep one or two strategically explicit H2s
- make the rest read like normal essay section titles

## Priority 3: Generic H2 Architecture

These are not as annoying as the name-heavy pages above, but they still use obvious legacy structures like `Rise to Fame`, `Major Accomplishments`, `Personality Quirks`, and `Legacy`.

### `Grimes.md`

- still has:
  - `Grimes' Upbringing: The Making of an Outsider`
  - `Rise to Fame: From Montreal Crack Den to Art Angels`
  - `The Mind of an Enthusiast: Grimes' Personality Patterns`
  - `Major Accomplishments: Building Alternate Realities`

### `Jason-Calacanis.md`

- still has:
  - `Jason Calacanis's Upbringing`
  - `Rise to Fame`
  - `Personality Quirks and Inner World`
  - `Jason Calacanis's Legacy and Current Work`
  - `Decoding Jason Through the Achiever Lens`

### `Chappell-Roan.md`

- still has:
  - `Rise to Fame`
  - `The Mind of a Challenger`
  - `Major Accomplishments`
  - `Relationships: Strength Everywhere Except Love`

These posts do not need a full title rewrite. They need a structural voice pass.

## Description-Only Cleanup Queue

These are mostly snippet problems, not page-structure problems.

### Too short

- `Denzel-Washington.md` at ~102 chars
- `Olivia-Rodrigo.md` at ~113 chars
- `Shia-LaBeouf.md` at ~115 chars
- `Robert-Greene.md` at ~119 chars

### Slightly too long

- `Aubrey-Plaza.md` at ~161 chars
- `Elon-Musk.md` at ~161 chars
- `Henry-Cavill.md` at ~161 chars
- `Chappell-Roan.md` at ~162 chars
- `Prince-Harry.md` at ~165 chars
- `Adin-Ross.md` at ~169 chars

### Clearly too long / still carrying old framework energy

- `Alex-Hormozi.md` at ~211 chars
- `Joe-Biden.md` at ~254 chars

These are useful cleanup wins, but they are lower priority than the structural H2 issues above.

## False Positives I Would Ignore

The scan mechanically flagged a few things that I would **not** treat as real problems right now.

### `Greta-Thunberg.md`

The script flagged title/meta overlap because:

- title: `Greta Thunberg: Decoding the Mind That Couldn't Stay Silent`
- meta: `Why Greta Thunberg Couldn't Stay Silent`

That is close semantically, but it still works. I would leave it alone.

## Recommended Order

If the goal is the next best cleanup pass, I would do this:

1. `Sabrina-Carpenter.md`
2. `Michelle-Obama.md`
3. the 7 name-heavy H2 systems:
   - `Adin-Ross.md`
   - `Bad-Bunny.md`
   - `Brad-Pitt.md`
   - `Druski.md`
   - `IShowSpeed.md`
   - `Joe-Rogan.md`
   - `Kai-Cenat.md`
4. the 3 generic-H2 legacy posts:
   - `Grimes.md`
   - `Jason-Calacanis.md`
   - `Chappell-Roan.md`
5. description-only trims after that

## Bottom Line

The published people archive no longer needs a massive rewrite campaign.

What remains is a tighter, more manageable queue:

- **2** obvious high-priority posts
- **7** name-heavy H2 cleanup cases
- **3** generic H2 architecture cleanups
- **12** mostly metadata-description trims

If you want, I can take the top structural queue next:

- `Sabrina-Carpenter.md`
- `Michelle-Obama.md`
- then the name-heavy H2 batch
