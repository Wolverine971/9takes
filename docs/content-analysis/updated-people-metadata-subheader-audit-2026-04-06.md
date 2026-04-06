<!-- docs/content-analysis/updated-people-metadata-subheader-audit-2026-04-06.md -->

# Updated People Metadata + Subheader Audit

**Date:** 2026-04-06  
**Scope:** The 30 full-draft people blogs updated in the recent Priority 2 and Priority 3 title passes  
**Focus:** Whether `title`, `meta_title`, and `description` are working together correctly, plus which subheaders are still too generic or too opaque for SEO/scanning

## How The Fields Actually Render

For personality-analysis pages:

- `title` is the on-page H1.
- `meta_title` is the browser `<title>`, `og:title`, `twitter:title`, and JSON-LD `headline`.
- `description` is the meta description plus the OG/Twitter description.

That means the right pattern is:

- `title`: more editorial, psychologically sharp, worth reading on-page
- `meta_title`: more direct and click-oriented, because it is the actual SERP/social title
- `description`: a clean reinforcement of the same thesis, not a third unrelated angle

## Executive Take

The title rewrite pass worked. Most of the updated H1s are now clearly better than the template versions they replaced.

The remaining issues are mostly in two places:

1. Some `meta_title` values are still too close to the H1, so the two fields are not doing distinct jobs.
2. A subset of H2s are still so literary or opaque that they do not help search intent or skim-reading.

I would **not** reopen every updated draft. I would focus the next pass on the files below.

## Biggest Metadata Coordination Issues

These are the files where the H1 / `meta_title` / `description` trio still feels too repetitive, too vague, or too weakly differentiated.

### 1. `John-Mayer.md`

- Problem: the H1 and `meta_title` are essentially the same idea in slightly different phrasing.
- Current pairing:
  - H1: `John Mayer: The Virtuoso Who Keeps Sabotaging the Thing He Wants Most`
  - Meta: `Why John Mayer Can't Stop Sabotaging the Thing He Wants Most`
- Why it needs work: the H1 should carry the richer editorial framing while the `meta_title` should widen into a more click-driven explanation, not just paraphrase the same line.

### 2. `Sky-Bri.md`

- Problem: same duplication issue as John Mayer, plus the description is too short and too general.
- Current pairing:
  - H1: `Sky Bri: The Woman Who Keeps Giving Herself Away`
  - Meta: `Why Sky Bri Keeps Giving Herself Away (The Pattern No One Sees)`
- Why it needs work: the H1 and `meta_title` are functionally the same headline.

### 3. `Noam-Chomsky.md`

- Problem: the H1 and `meta_title` both collapse into `could never stop fighting`.
- Current pairing:
  - H1: `Noam Chomsky: The Permanent Dissenter Who Could Never Stop Fighting`
  - Meta: `Why Noam Chomsky Could Never Stop Fighting`
- Why it needs work: the H1 has a strong frame (`permanent dissenter`), but the `meta_title` does not add a second hook.

### 4. `Hugh-Jackman.md`

- Problem: both H1 and `meta_title` lean on the exact same `nicest man in Hollywood` angle.
- Why it needs work: the emotional thesis is good, but the pair is over-mirroring each other instead of dividing labor between editorial H1 and search/social title.

### 5. `Kendall-Jenner.md`

- Problem: same core idea in both fields:
  - H1: cool-girl mask + anxiety
  - Meta: real person behind fashion's cool girl + hidden anxiety
- Why it needs work: the current pair is coherent, but not strategically distinct.

### 6. `Kyle-Forgeard.md`

- Problem: the H1 is stronger than the `meta_title`.
- Current meta: `Why Kyle Forgeard Can't Stop (The Pattern Behind the Full Send Empire)`
- Why it needs work: `Can't Stop` feels unfinished and generic. This is the clearest case where the click-title is weaker than the H1.

### 7. `Dalton-Caldwell.md`

- Problem: the `meta_title` is long and serviceable, but not especially sharp.
- Why it needs work: the H1 has a trust/skepticism thesis; the `meta_title` falls back to a broad `can't stop stress-testing everything` frame that sounds more generic.

### 8. `Garry-Tan.md`

- Problem: the `meta_title` is long and slightly crowded, and the H1 / meta pair are not maximally distinct.
- Why it needs work: the H1 has a clean emotional mechanism (`fear into fire`); the `meta_title` shifts to a more diffuse `champion of earnestness can't stop fighting` construction.

## Description Length Issues

Using the repo's own analytics scoring, `description` performs best in the 120-160 character range. The following are the most obvious outliers:

### Too short to fully do the job

- `Kate-Hudson.md` at ~100 chars
- `Sky-Bri.md` at ~99 chars
- `Oprah-Winfrey.md` at ~109 chars
- `Mindy-Kaling.md` at ~110 chars
- `Camila-Cabello.md` at ~111 chars
- `Glen-Powell.md` at ~117 chars

### Slightly too long

- `Ben-Affleck.md` at ~169 chars
- `Khloe-Kardashian.md` at ~161 chars

These are not equally urgent. The short ones matter more because they are leaving explanatory power on the table.

### Descriptions missing the subject's name

- `Oprah-Winfrey.md`
- `Dalton-Caldwell.md`

Not a crisis, but both descriptions would be stronger snippet copy if they named the person explicitly.

## Meta Title Length Note

The admin analytics endpoint scores `meta_title` best in the 30-60 character range. On that internal benchmark, **23 of the 30 updated drafts are over 60 characters**.

That does **not** mean 23 are broken. It does mean the current click-title style is consistently running long enough to lose points in your own tooling and risk truncation.

The most obvious trim candidates are:

- `Hugh-Jackman.md`
- `Dalton-Caldwell.md`
- `Garry-Tan.md`
- `Kendall-Jenner.md`
- `Bradley-Martyn.md`
- `Oscar-Isaac.md`
- `Kate-Hudson.md`
- `Steve-Jobs.md`

## Highest-Priority Subheader SEO Problems

These are the drafts where the H2 system still has clearly low-signal or overly opaque headings.

### 1. `John-Mayer.md`

This is the biggest remaining H2 problem in the whole updated batch.

Examples:

- `The Silence`
- `100 Percent`
- `The Portal`
- `The Bit`
- `The False Memory`

Why it needs work: these lines may be evocative in context, but they are almost useless for search intent and weak for scanning.

### 2. `Olivia-Munn.md`

Examples:

- `What Built Her`
- `A Constant Nine`
- `4,000 Percent`

Why it needs work: these are too opaque. They do not tell a skimming reader what the section is actually about.

### 3. `Garry-Tan.md`

Examples:

- `Bread and Milk`
- `$7 an Hour`
- `The $300,000 Check`

Why it needs work: this H2 set reads like scene labels, not search-supporting section titles.

### 4. `Steve-Jobs.md`

Examples:

- `Lisa`
- `The Second Act`
- `Oh Wow`

Why it needs work: too many H2s rely on reader context instead of carrying clear meaning themselves.

## Secondary Subheader Cleanup Queue

These are not as severe as the four above, but they still have obvious low-signal headings worth rewriting.

### `Dalton-Caldwell.md`

Examples:

- `Dear Mark Zuckerberg`
- `Just Don't Die`

### `Tina-Fey.md`

Examples:

- `The Mark`

Only one H2 is blatantly opaque, but it is the first major structural speed bump in an otherwise strong piece.

### `Kyle-Forgeard.md`

Examples:

- `The Man Off Camera`
- `The Empire's Architecture`

### `Camila-Cabello.md`

Examples:

- `The Framework Collector`
- `The Inner Circle`

### `Sky-Bri.md`

Examples:

- `"Pretty Normal"`

### `Noam-Chomsky.md`

Examples:

- `The Absolutist`

This is not terrible, but it is weaker and less informative than the rest of the piece deserves.

## Files I Would Leave Alone For Now

I would **not** spend the next pass on these unless you want to squeeze the last 10% out of them:

- `Mindy-Kaling.md`
- `James-Clear.md`
- `Justin-Bieber.md`
- `Kris-Jenner.md`
- `Sara-Saffari.md`
- `Tfue.md`
- `Bradley-Martyn.md`
- `Glen-Powell.md`
- `Lana-Rhoades.md`
- `Patrick-Bet-David.md`
- `Stephen-A-Smith.md`

They are not perfect, but the title/meta/description system is doing its job well enough.

## Important Nuance On `What is X's personality type?`

I am **not** flagging the standard `What is [Person]'s personality type?` H2s as a problem, even though they are generic.

Why:

- they carry explicit search intent
- they help answer the exact query people use
- they give the page at least one reliable keyword-bearing H2

The problem is not those sections. The problem is when the rest of the H2 system becomes too opaque to balance them.

## Recommended Next Pass Order

1. Fix metadata coordination on:
   - `John-Mayer.md`
   - `Sky-Bri.md`
   - `Noam-Chomsky.md`
   - `Hugh-Jackman.md`
   - `Kendall-Jenner.md`
   - `Kyle-Forgeard.md`
   - `Dalton-Caldwell.md`
   - `Garry-Tan.md`
2. Fix H2 systems on:
   - `John-Mayer.md`
   - `Olivia-Munn.md`
   - `Garry-Tan.md`
   - `Steve-Jobs.md`
   - `Dalton-Caldwell.md`
   - `Tina-Fey.md`
   - `Kyle-Forgeard.md`
   - `Camila-Cabello.md`
