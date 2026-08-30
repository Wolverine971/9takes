<!-- docs/content-analysis/pipeline-logs/2026-08-14_223909_Phoebe-Bridgers/manual-pipeline.md -->

# Phoebe Bridgers manual blog pipeline

The editorial pipeline was executed manually because `scripts/run-blog-pipeline.sh` delegates its language stages to `claude -p`, which the user explicitly prohibited. No Claude process was spawned.

## Outcome

- Final typing: Enneagram 4w3, medium confidence; Type 6 is the strongest alternative.
- Final draft: `src/blog/people/drafts/Phoebe-Bridgers.md`.
- Research packet: `docs/content-analysis/research/Phoebe-Bridgers.md`.
- Six-role jury: 0 P0 blockers; 6 accepted P1 improvements; 10 protected hits.
- Final verification: pass; 0 open P0s; 0 protected-hit regressions.
- Deterministic gates: lint 0 fail/0 warn; structural quality pass; source audit 2 inline/0 vague/0 untagged; same-type similarity clear at 0.031 against 0.04.
- Rubric v2: A, 9.1; independent regrade 9.1; stability delta 0.0.
- Status: editorially complete draft. Publishing remains false; full and thumbnail image creation are intentionally deferred.

## Revision scope

One bounded originality revision recast formulaic attribution, anti-stereotype, and countertyping language. It changed no factual claim, type decision, evidence, confidence level, section, or protected narrative beat.

## Current-fact corrections

The blog describes Bridgers as an established four-time Grammy winner making a major 2026 solo return, not as up-and-coming. The corrected Chappell Roan/Troye Sivan concert association was excluded from the analysis.
