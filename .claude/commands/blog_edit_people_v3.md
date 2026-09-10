<!-- .claude/commands/blog_edit_people_v3.md -->

# Resolve findings and finish the article

Read the request, standard, evidenceSchema/resolutionSchema, supplied draft, evidence, baseline, all independent reviews, and machine checks. On a repair run also read the prior verification and resolution. Do not invoke legacy editing, metadata or grading commands.

Adjudicate every finding. Fix supported concerns, reject unsupported preferences with reasons, preserve distinctive strengths. Preserve the contribution of protected passages, or justify correcting/removing a false detail. Do one coherent edit that resolves reasoning, evidence, structure and pacing together. Do not repeatedly paraphrase the same thesis. If foundational evidence is insufficient, mark the evidence insufficient_evidence with concrete research tasks instead of smoothing over the gap.

Reconcile metadata after substantive editing: supported titles, descriptions, FAQ answers and anchors, citations, facts. Do not manufacture birthdays. Preserve baseline date, lastmod, published, person and loc. New drafts remain unpublished. Resolve every inherited production_pretext blocker explicitly in prior_blockers; only clear a blocker in the output after its evidence-backed resolution. Do not set grades or release metadata.

Write the three requested outputs: edited Markdown, evidence JSON and resolution JSON. Continue the same evidence/claim/source IDs, append any newly opened evidence, remove unused claims, and update every exact passage. Return every original review finding in decisions, even on repair. Carry justified prior decisions forward and add the fixes requested by verification. Record each protected passage and inherited blocker. Do not edit inputs or the live draft; the runner materializes the output for independent verification.
