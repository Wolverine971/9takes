<!-- .claude/commands/blog_verify_people_v3.md -->

# Independently verify and evaluate the final candidate

Read the request, canonical standard and verificationSchema. Read the supplied candidate, final evidence, reviews, resolution, baseline and checks. Do not invoke grade_blog or inspect old grades/run summaries. Do not edit anything except the requested verification JSON.

Reopen every source supporting the final inventory's important claims. Check actual words, speaker, locator, context, independence and the boundary between reported fact and inferred motive. A working link is not proof. Test for missing important claims: quotes, central anecdotes, allegations, childhood causation, unsupported metadata and the type hypothesis. Mark coverage_complete false if the evidence inventory misses a load-bearing assertion. Never report opened/context_matches if you could not check the source. Unsupported essentials mean insufficient_evidence with specific research_tasks; repairable wording/coverage errors mean revise.

Check every review decision against its acceptance test, including rejections. Check all protected contributions and inherited blockers; correcting a false detail can count as preserving editorial quality when explained. Ensure body and metadata agree, alternative typing is seriously addressed, no major unresolved finding remains, and the profile survives the five-year test. If the editor introduces a new risk, flag it as a blocker so the expanded jury is required before release.

Then assess each dimension independently using the standard's weights, anchors and thresholds. Provide a concrete passage and reason for every score, including discoverability. Do not calculate/adjust scores to achieve a target overall. Do not use mandatory recency, quote percentages, furniture counts or agreement with a prior grade as proxies for quality.

Write all verificationSchema fields. Copy content_sha256 and evidence_sha256 from the request. Supply one claim_check per final claim, one source_check per used source, one decision_check per review finding, prior_blocker_checks for every inherited blocker, and protected_checks for every protected passage. Include any remaining findings with severity and acceptance tests. Status pass requires actual verification, not merely structurally complete JSON. Keep uncertainty explicit.
