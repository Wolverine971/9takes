<!-- docs/content-analysis/pipeline-logs/2026-07-14_222357_John-Coogan/MANUAL_COMPLETION.md -->

# John Coogan pipeline manual completion

The wrapper pipeline was started on 2026-07-14, but each Claude-backed writing stage stopped immediately because the local Claude CLI was not logged in. The deterministic checks still ran, and the remaining stages were completed manually using the repository's editorial standards and pipeline commands.

## Final result

- Retyped John Coogan from Enneagram Type 3 to Type 7.
- Rewrote the article around the central tension of curiosity versus confinement.
- Added a retype analysis supporting 7w6, likely SO/SP, with a strong Type 5 alternative and Type 3 fix.
- Moved both profile images from `static/types/3s/` to `static/types/7s/`.
- Synced the final article to the production `blogs_famous_people` row while preserving `published=true` and `lastmod=2026-02-10`.
- Regenerated the famous-types index and updated the sitemap, LLM index description, and research classification.

## Verification

- Editorial grade: 8.6 / B+ using rubric v2.
- Blog lint: 0 failures, 0 warnings.
- Source audit: passed with 0 untagged claims.
- Same-type similarity: passed; nearest score 0.033, below the 0.04 threshold.
- Production database: `enneagram=7`, final title present, final prose edits present, published state preserved.
- Image verification: both Type 7 images present; prior Type 3 paths absent.

The legacy distribution document is explicitly marked as archived because its older Type 3 campaign copy should not be reused without a separate Type 7 rewrite.
