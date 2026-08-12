<!-- docs/content-analysis/pipeline-logs/2026-08-12_codex_Adela/codex-run.md -->

# Codex-native pipeline run: Adéla

The repository wrapper was not invoked because `scripts/run-blog-pipeline.sh` delegates editorial stages to the Claude CLI. This run reproduced its editorial, deterministic, perspective, enrichment, and grading gates directly in Codex. No Claude command or model was used.

## Outcome

- Draft: `src/blog/people/drafts/Adela.md`
- Enneagram hypothesis: Type 3w4, with Type 4 treated as the strongest alternative
- Final rubric v2 grade: B+ (8.8)
- Stability regrade: 8.8, delta 0.0
- Discoverability: 9
- Blog lint: 0 failures, 0 warnings
- Contrast engines: 0 strong, 0 comparative
- Load-bearing source audit: 2 inline, 0 vague, 0 untagged
- Same-Type-3 similarity: clear
- Perspective review: pass, 0 open P0 items, 0 protected-hit regressions
- Grade-triggered revision loop: skipped because the overall, discoverability, lint, and deterministic reports cleared their gates

## Artifacts

- Research packet: `docs/content-analysis/research/Adela.md`
- Grade review: `docs/content-analysis/grades/Adela.review.md`
- Perspective review: `docs/content-analysis/perspective-reviews/Adela/2026-08-12_Adela/`
- Perspective manifest: `docs/content-analysis/perspective-reviews/Adela/latest.json`
- Interview transcripts: `youtube-transcripts-people/adela-coco-mocoe-interview.md` and `youtube-transcripts-people/adela-notion-interview.md`

## Time-sensitive refresh

The draft correctly describes _PRIMA_ as scheduled for September 4, 2026. Verify the release date, final credits, and one post-release interview after that date before publication or a later refresh.
