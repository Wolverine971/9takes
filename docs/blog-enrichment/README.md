<!-- docs/blog-enrichment/README.md -->

# Personality Blog Evidence Enrichment

This system turns cited testimony into visual evidence: the reader sees the speaker, the quote, the
quote source, and the image rights record together. The first pilot is the Elon Musk personality
analysis.

## The Editorial Contract

Every visual hook must do at least one of these jobs:

1. **Exact moment:** show the documented event being discussed.
2. **Time anchor:** show a verifiable image from the same period, while plainly saying it is not the
   exact scene.
3. **Speaker portrait:** identify the person whose testimony appears beside it.
4. **Source portrait:** identify the reporter, biographer, or researcher responsible for the account.

Do not imply that a portrait captures the quoted moment. Do not use generated imagery as documentary
evidence. A visual hook is optional; an inaccurate visual hook is worse than none.

Use the smallest treatment that does the editorial job. A compact face beside a quote is the default.
Promote an image to a feature only when the setting, relationship, or time period adds information the
portrait cannot—for example, two people together during the relationship being discussed. Reserve the
largest treatment for exact moments or unusually strong contextual photographs. The citation stays
complete even when its typography is visually quiet.

Quote sourcing and image sourcing are separate. A correct image credit does not verify a quote, and a
correct quote citation does not grant image rights. The component displays both records.

## Source And Rights Ladder

Research in this order:

1. Public-domain government, institutional, or archival sources.
2. Creative Commons media from the original file page, with the exact license version recorded.
3. A publisher's own image when it is inseparable from the commentary and a documented editorial
   fair-use assessment supports the use.
4. Licensed or directly permitted photography.
5. If none is defensible, leave the hook unfilled and record the blocker.

Never use an image-search result page as the source, copy an unverified social thumbnail, or hotlink a
publisher asset. Save a right-sized local rendition, preserve the original file-page URL, record the
creator, rights holder when known, retrieval date, license, and every material modification.
Open-licensed derivatives remain governed by the source license; visible attribution must disclose
the recorded changes.

### Fair-use lane

Fair use is a case-specific legal doctrine, not a license or a guaranteed safe harbor. For every image
using this lane, `src/lib/data/blog-evidence-media.json` must document purpose, nature, amount, and
market effect. The default risk is `medium` and legal review is `recommended`. Keep the use editorial,
contextual, attributed, reduced in resolution, linked to the original publication, and non-substitutive.
Do not publish an item marked `high` risk or `legal_review: required` without approval.

The operational checklist follows the [U.S. Copyright Office's four-factor overview](https://www.copyright.gov/fair-use/).
Only a court can make a definitive fair-use determination; this record is an editorial rationale, not
legal advice.

## Evidence Registry

All evidence metadata lives in
`src/lib/data/blog-evidence-media.json`; image files live at
`static/blog-enrichment/<blog-slug>/`. The stable `id` joins content to the registry, so a correction to
an attribution or license updates every rendering of that item.

Required fields include:

- blog slug, evidence kind, label, accessible alt text, dimensions, and crop position;
- original image page, creator, publisher, retrieval date, rights status, license, and modifications;
- exact quote, speaker, speaker role, and the direct quote source when the item contains testimony;
- context that states the relationship between the image and the passage.

## Content Tags

Supabase-backed personality blogs can use the self-closing tag directly:

```html
<EvidenceFigure evidenceId="elon-kimbal-musk-empathy-quote" />
```

`processBlogContent` renders a complete semantic fallback on the server, including the image,
blockquote, quote citation, and image attribution. The page then mounts the Svelte component over that
fallback. This preserves the evidence for readers and crawlers before client JavaScript runs.

In an MDsvex file, import the component and use the same tag:

```svelte
<script>
	import EvidenceFigure from '$lib/components/blog/EvidenceFigure.svelte';
</script>

<EvidenceFigure evidenceId="elon-kimbal-musk-empathy-quote" />
```

Keep the quote in the registry rather than duplicating it in the adjacent paragraph. The prose should
set up or interpret the evidence card.

## Per-Blog Workflow

1. **Inventory:** read the whole article and list every direct quote, attributed anecdote, dated
   moment, and named secondary source.
2. **Verify words:** find the primary or strongest direct source for each quote. Record the exact URL,
   author, publisher, date, and useful locator.
3. **Search images:** try exact event and date first, same-period time anchor second, then a licensed
   speaker/source portrait.
4. **Clear rights:** select the rights lane, read the original file page, document modifications, and
   complete all four fair-use factors when applicable.
5. **Choose scale:** use `compact` for speaker/source identification, `portrait` when the face needs a
   little more presence, and `feature` only when the image itself carries relationship, place, or time.
6. **Prepare assets:** download rather than hotlink; resize to a practical maximum of 1200px; convert to
   WebP; do not upscale; retain enough resolution for the selected treatment.
7. **Register:** add a stable evidence record and run `pnpm audit:blog-enrichment`.
8. **Place:** add the tag immediately after the prose setup, remove duplicated quote text, and avoid
   stacking two cards without meaningful prose between them.
9. **Review:** verify desktop and 390px layouts, alt text, crop, link targets, attribution text, factual
   relationship, and no horizontal overflow.
10. **Publish:** for Supabase-backed personality blogs, compare the current database body with the local
    draft before syncing. Update the tracker only after the published page is rechecked.

## Status Model

The machine-readable tracker is `docs/blog-enrichment/tracker.json`.

- `needs-enrichment-review`: not yet inventoried; this is the default for every unlisted personality
  draft.
- `researched`: quote and visual candidates are documented.
- `assets-ready`: sources, rights, and local assets are complete.
- `enriched-local`: registry entries and article tags are implemented locally.
- `published`: the live source of truth contains the tags and has passed visual review.
- `blocked`: a named sourcing, rights, or editorial issue prevents responsible use.

Run `pnpm audit:blog-enrichment` for the portfolio rollup and validation errors. An `enriched-local`
blog is not published; the Elon pilot deliberately stops before the Supabase write.

## Definition Of Done

- Every displayed quote matches its direct source.
- Every image has an original source page and an explicit rights status.
- Open-license attribution includes creator, license/version, source link, and modifications.
- Fair-use records contain all four factors and the review level.
- Exact-moment and time-anchor language cannot be confused.
- The tag resolves, local asset exists, and server fallback contains both citations.
- Desktop and mobile visual checks pass.
- The tracker distinguishes local, published, and blocked state.
