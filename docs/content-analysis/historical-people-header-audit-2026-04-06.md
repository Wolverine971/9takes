<!-- docs/content-analysis/historical-people-header-audit-2026-04-06.md -->

# Historical People Header Audit

**Date:** 2026-04-06  
**Scope:** Older people profiles in `src/blog/people/drafts/*.md` with `date` or `lastmod` before 2026-03-29  
**Excluded:** research files, template files, and one-off report/update docs  
**Focus:** Generic or formulaic H1s, weak or missing `meta_title`, and low-signal H2 systems that still read like internal scene labels instead of search-supporting section titles

## Summary

- Reviewed **205** older people profiles.
- **71** are older published profiles.
- **134** are older unpublished drafts.
- **30** published profiles need some level of header or metadata cleanup.
- **15** of those published profiles are clear **Priority 1** fixes because they have missing `meta_title`, blatantly generic H1s, or obviously weak H2 systems.
- Another **15** published profiles are **Priority 2**: not broken, but still using older `Enneagram Type...` title/meta patterns that are weaker than the newer standard.
- There is also a **36-post unpublished backlog** of older drafts with template-ish H1s. I would not treat those as immediate SEO work unless they are heading toward publish.

The main historical pattern is different from the recent batch:

- The recent problem was mostly generic H1s.
- The older problem is more mixed:
  - some posts still have generic or formulaic H1s
  - some strong posts are simply missing `meta_title`
  - some older published posts still use legacy click-title formats like `Name Enneagram Type X | ...`
  - some excellent articles still have H2 systems that are too literary or too vague for scanning

## What Counts as a Real Problem

For this pass, I treated these as true cleanup candidates:

- H1s like `Name: An Enneagram Type X Analysis`
- H1s that still lead with `The Enneagram Type X...` even when the body already has a sharper psychological thesis
- published posts with no `meta_title`
- `meta_title` values that still use the old `Enneagram Type X | ...` format
- H2 systems that are full of headings like `The Mute`, `The Name`, `The Giving`, `Watching 2024`, `The Rule-Breaking`

I did **not** treat every description length miss as equally urgent. Historical descriptions do have some trim/expand opportunities, but the highest-value work is still title, `meta_title`, and H2 cleanup.

## Priority 1: Published Posts I Would Fix Next

These are the older published posts with the clearest SEO/header problems.

### 1. Missing `meta_title` on Published Posts

These are strong enough pieces that the missing click-title is the obvious gap.

- `src/blog/people/drafts/Kim-Kardashian.md`
  - Current H1: `Kim Kardashian: What the Calm Is Hiding`
  - Issue: strong on-page title, but no `meta_title`
- `src/blog/people/drafts/Paris-Hilton.md`
  - Current H1: `Paris Hilton: The Mask That Built an Empire`
  - Issue: strong on-page title, but no `meta_title`
- `src/blog/people/drafts/Taylor-Swift.md`
  - Current H1: `Taylor Swift: The Enneagram Type 3 Who Turned Every Betrayal Into Victory`
  - Issue: no `meta_title`, plus additional H1/H2 problems below

### 2. Published Posts With Clearly Generic H1s

These are the older published equivalents of the recent title problems we already fixed.

- `src/blog/people/drafts/Casey-Neistat.md`
  - Current H1: `Casey Neistat: An Enneagram Type 4 Personality Analysis`
- `src/blog/people/drafts/Chelsea-Handler.md`
  - Current H1: `Chelsea Handler: An Enneagram Type 8 Personality Analysis`
- `src/blog/people/drafts/Jake-Gyllenhaal.md`
  - Current H1: `Jake Gyllenhaal: An Enneagram Type 6 Analysis`
- `src/blog/people/drafts/saoirse-ronan.md`
  - Current H1: `Saoirse Ronan: An Enneagram Type 4 Personality Analysis`

These are all real articles, not shell drafts. The bodies are good enough to support much more differentiated H1s.

### 3. Published Posts With the Worst H2 Systems

These are the older published pieces where the H2s are now the main SEO/scanning weakness.

- `src/blog/people/drafts/Taylor-Swift.md`
  - Examples: `The Nashville Gambit`, `The Kim/Kanye War`, `The Business Mind`, `The Happiness Problem`, `The Rule-Breaking`, `Integration in Progress`
  - Why it matters: this is the single biggest legacy H2 cleanup candidate in the historical set
- `src/blog/people/drafts/Hillary-Clinton.md`
  - Examples: `The Inner Critic`, `Watching 2024`, `January 6th`, `Stress and Security`, `Life After Defeat`
  - Why it matters: the article is strong, but too many section titles are too abstract or too context-dependent
- `src/blog/people/drafts/Mr-Beast.md`
  - Examples: `The Mute`, `The Algorithm Monk`, `The Defiance Reflex`, `The Machine`, `The Giving`, `The Breaking`
  - Why it matters: evocative, but too opaque for search and skim behavior
- `src/blog/people/drafts/Jon-Stewart.md`
  - Examples: `The Name`, `"Turd Miners"`, `The Blind Spot`, `The Crossword Puzzle`, `The Unresolved Thing`
- `src/blog/people/drafts/Scarlett-Johansson.md`
  - Examples: `The Peaceful Aura`, `Too Fragile`, `The Merging Pattern`, `The Mirror`
- `src/blog/people/drafts/Tom-Cruise.md`
  - Examples: `The Name`, `The Running`, `The Contradiction`, `The System`
- `src/blog/people/drafts/Vladimir-Putin.md`
  - Examples: `The Miracle Child`, `The Orthodox Turn`, `The Navalny Question`, `Understanding Putin`
- `src/blog/people/drafts/Dave-Chappelle.md`
  - Examples: `"Name Your Price"`, `8:46`, `His Son's Arms`, `The Irreconcilable Moment`
- `src/blog/people/drafts/Paul-Graham.md`
  - Examples: `The Social Radar`, `"Kill This Company"`, `The Essay Mind`, `The Cliff-Jumper`

## Priority 2: Published Posts Worth a Second Pass

These are published posts that are not urgent in the same way, but still lag behind the current standard.

### 1. Formulaic But Serviceable Published H1s

These are no longer terrible, but they still lean too hard on `Enneagram Type X` framing instead of leading with the actual thesis.

- `src/blog/people/drafts/Barack-Obama.md`
- `src/blog/people/drafts/George-W-Bush.md`
- `src/blog/people/drafts/Grimes.md`
- `src/blog/people/drafts/Johnny-Depp.md`
- `src/blog/people/drafts/Madison-Beer.md`
- `src/blog/people/drafts/Martin-Luther-King-Jr.md`
- `src/blog/people/drafts/Meghan-Markle.md`
- `src/blog/people/drafts/Taylor-Swift.md`
- `src/blog/people/drafts/Tom-Hiddleston.md`

These do not read like placeholders, but most of them would still be stronger if the framework moved into the body and the H1 moved closer to the wound, contradiction, or coping strategy.

### 2. Published Posts With Legacy `meta_title` Formats

These mostly have decent H1s already. The issue is that the click-title is still using older SEO phrasing or duplication patterns.

- `src/blog/people/drafts/Alexandria-Ocasio-Cortez.md`
  - Current meta pattern: `Why AOC Can't Stop Fighting the System | Enneagram Type 6 Analysis`
- `src/blog/people/drafts/Amber-Heard.md`
  - Current meta pattern: `... Enneagram Type 3 Analysis`
- `src/blog/people/drafts/Greta-Thunberg.md`
  - Current meta pattern: `Greta Thunberg Enneagram Type 1 | ...`
- `src/blog/people/drafts/Hillary-Clinton.md`
  - Current meta pattern: `Hillary Clinton Enneagram Type 1 | ...`
- `src/blog/people/drafts/Jason-Calacanis.md`
  - Current meta pattern: `Jason Calacanis Enneagram Type 3 | ...`
- `src/blog/people/drafts/Marilyn-Monroe.md`
  - Current meta pattern: `Marilyn Monroe's Enneagram Type 6 Personality | ...`
- `src/blog/people/drafts/Sam-Altman.md`
  - Current meta pattern: `Sam Altman Enneagram Type 4 | ...`
- `src/blog/people/drafts/Scarlett-Johansson.md`
  - Current meta pattern still ends with `| Enneagram Type 9`
- `src/blog/people/drafts/Tom-Hardy.md`
  - Current meta pattern: `Tom Hardy Enneagram Type 8 | ...`

These are easy wins because the page thesis is usually already there. The `meta_title` just needs to stop sounding like the older generation of blog copy.

## Historical Unpublished Backlog

There are **36** older unpublished drafts with clear title-pattern issues. I would keep them out of the immediate queue unless they are moving toward publish.

### Unpublished Drafts With Clearly Generic H1s

- `src/blog/people/drafts/Bernie-Sanders.md`
- `src/blog/people/drafts/Caleb-Hearon.md`
- `src/blog/people/drafts/Clavicular.md`
- `src/blog/people/drafts/Eddie-Murphy.md`
- `src/blog/people/drafts/Edgar-Allan-Poe.md`
- `src/blog/people/drafts/Emma-Stone.md`
- `src/blog/people/drafts/Gavin-Newsom.md`
- `src/blog/people/drafts/Jelly-Roll.md`
- `src/blog/people/drafts/Jennifer-Aniston.md`
- `src/blog/people/drafts/Joseph-Stalin.md`
- `src/blog/people/drafts/Lupita-Nyongo.md`
- `src/blog/people/drafts/Morgan-Wallen.md`
- `src/blog/people/drafts/Napoleon-Bonaparte.md`
- `src/blog/people/drafts/Reid-Hoffman.md`
- `src/blog/people/drafts/Ryan-Reynolds.md`
- `src/blog/people/drafts/Sarah-J-Maas.md`
- `src/blog/people/drafts/Travis-Kalanick.md`
- `src/blog/people/drafts/Tyler-Perry.md`

### Unpublished Drafts With Formulaic But Not Terrible H1s

- `src/blog/people/drafts/Bill-Gates.md`
- `src/blog/people/drafts/Dave-Portnoy.md`
- `src/blog/people/drafts/Gary-Vee.md`
- `src/blog/people/drafts/George-RR-Martin.md`
- `src/blog/people/drafts/Hasan-Piker.md`
- `src/blog/people/drafts/Jack-Dorsey.md`
- `src/blog/people/drafts/Jake-Shane.md`
- `src/blog/people/drafts/Keanu-Reeves.md`
- `src/blog/people/drafts/Margot-Robbie.md`
- `src/blog/people/drafts/Meryl-Streep.md`
- `src/blog/people/drafts/Michael-Seibel.md`
- `src/blog/people/drafts/Nancy-Pelosi.md`
- `src/blog/people/drafts/Pete-Davidson.md`
- `src/blog/people/drafts/Post-Malone.md`
- `src/blog/people/drafts/Simon-Sinek.md`
- `src/blog/people/drafts/Taylor-Lorenz.md`
- `src/blog/people/drafts/Tom-Holland.md`
- `src/blog/people/drafts/Travis-Scott.md`

## Secondary Metadata Notes

These are not part of the main priority queue, but they are worth keeping in mind:

- `src/blog/people/drafts/Amy-Poehler.md`
  - Missing `meta_title`, but unpublished
- `src/blog/people/drafts/Princess-Diana.md`
  - Missing `meta_title`, but unpublished
- `src/blog/people/drafts/Dario-Amodei.md`
  - `title` and `meta_title` are identical, so the page H1 and click-title are not doing separate jobs

## Recommended Fix Order

If the goal is to keep the next pass focused and high-leverage, I would do it in this order:

1. Fix the **published posts with missing `meta_title`**:
   - `Taylor-Swift.md`
   - `Kim-Kardashian.md`
   - `Paris-Hilton.md`
2. Rewrite the **4 clearly generic published H1s**:
   - `Casey-Neistat.md`
   - `Chelsea-Handler.md`
   - `Jake-Gyllenhaal.md`
   - `saoirse-ronan.md`
3. Rewrite the **worst published H2 systems**, starting with:
   - `Taylor-Swift.md`
   - `Hillary-Clinton.md`
   - `Mr-Beast.md`
   - `Jon-Stewart.md`
4. Clean the **legacy `meta_title` formats** on the older published posts
5. Leave the **36 unpublished title cleanups** for a later batch unless those drafts are about to go live

## Bottom Line

The historical archive does **not** need a repo-wide rewrite. The problem is concentrated.

What needs work now is:

- a **15-post published Priority 1 queue**
- a **15-post published Priority 2 queue**
- a **36-post unpublished backlog** that can wait

If you want, I can take the published Priority 1 queue and fix it next without touching the unpublished backlog.
