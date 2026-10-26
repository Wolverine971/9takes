# Nathan Fielder: owner-override publish (2026-10-26)

DJ approved publishing the refreshed Nathan Fielder page ("Okay, go ahead and publish this blog.") after he was offered two choices: an owner override today, or `/grade_blog` plus a new six-perspective review first. `personBlogParser.js --publish` has no override for a missing grade, and its `--publish-check` was blocked on two items:

- `missing_content_quality`: the refresh cleared the stale 2026-09-09 grade. No `/grade_blog` run was made, and no grade was written to frontmatter. The only score on record is an independent editor cold read of 7.7 (Evidence 7.5, Originality 8.0, Discoverability 8.0, Enneagram 7.0, Writing 7.5, Hook 8.5). It was scored before the second-round fixes, which are listed in the draft's refresh ledger.
- `perspective_review_stale`: the six-perspective verification at `docs/content-analysis/perspective-reviews/Nathan-Fielder/` covers the September text, not this one.

Every other gate passed: source audit (7/7 load-bearing quotes inline), lint (0 fail), images (`static/types/6s/Nathan-Fielder.webp`, `s-Nathan-Fielder.webp`), word count, sections and markers.

## What was done

1. **Content.** `personBlogParser.js Nathan-Fielder --sync` reported no field changes: the unpublished row (id 1149) already held the final text, with live hash = local hash = `9a048c5fc4b5bdc3e53f174d5c4bd7c6`. The perspective gate on updates covers only published rows.
2. **Frontmatter.** `date` and `lastmod` were set to `2026-10-26` and `published` to `true`, the same three lines `updatePublishFrontmatterContent` writes. Publishing is the documented exception to the lastmod rule.
3. **Publish step.** A one-off script copied `publishSupabaseEntry()`. It updated `published`, `date`, `lastmod`, `published_at` and `first_published_at` on row 1149, guarded on `published = false`, and inserted a `content_release_events` row (`event_type: published`, `metadata.owner_override: true`). Verified in the database: published `t`, date and lastmod `2026-10-26`, published_at `2026-10-26 20:25:07+00`, enneagram `6`.
4. **Generators.** `pnpm gen:all` regenerated `famousTypes.ts` (`link: true`, `hasImage: true`, `lastmod: '2026-10-26'`), `static/sitemap.xml`, crosslinks, corpus stats and the similarity snapshot.
5. **Inbound links.** The page had 0. Three were added:
   - Elizabeth Holmes: link-only `--sync`, gate allowed, lastmod `2026-05-07` unchanged.
   - Amelia Dimoldenberg: link-only `--sync`, gate allowed, lastmod `2026-06-22` unchanged.
   - `enneagram-type-6.md`: name added to the list of Sixes. This is an MDsvex page, so it goes live on the next deploy.
6. **Chorus question.** `generate-chorus.mjs` was failing for everyone because its default model, `anthropic/claude-sonnet-4`, has been retired on OpenRouter. The default is now `anthropic/claude-sonnet-5.5`. The question wording waits on DJ's approval.

## Not done

- No `/grade_blog` grade and no fresh perspective review.
- Nothing committed or deployed. The sitemap, the `famousTypes.ts` listing and the Type 6 link need DJ's commit and deploy. The page itself renders from the database already.
- The live page was deliberately not requested, so ISR does not cache a copy without the Chorus CTA for 24 hours.
- The Elizabeth Holmes page still describes the documentary as upcoming ("has a theatrical release date of Oct..."). It needs its own refresh.
