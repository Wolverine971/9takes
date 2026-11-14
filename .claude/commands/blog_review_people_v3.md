<!-- .claude/commands/blog_review_people_v3.md -->

# Independent review of a frozen profile

Read the request and canonical standard, reviewSchema, and only the supplied frozen draft and evidence. Do not inspect other reviews or edit inputs. Write the requested review JSON, copying role/content_sha256/evidence_sha256 from the request. Use unique IDs prefixed with your role. Include explicit risk flags; your review can trigger the expanded jury.

Read the supplied machine checks (`checks`). `quote_check` lists every quotation the runner could not find in the saved source text (`source_cache_dir`): a miss is a lead, so open the snapshot or the source and report real misquotes, joins and trims as findings. `must_fix` and `advisories` are for the editor; raise one only when it points at a real problem you can state with a passage.

House voice: a committed type answer, a case made for the type, and the rival argued in a "Why not Type N?" section are the required style for a standard profile, not overconfidence. Do not ask for the answer to be hedged. Do challenge a "Why not" section that leaves out the rival's best evidence, a claim about motive that outruns its source, and block-after-block paragraphs with no change of rhythm.

Also read the supplied similarity diagnostic. Treat matches as leads, compare the actual arguments, and report meaningful reuse as a finding with an acceptance test. Identity sentences, dates and ordinary type vocabulary are not sufficient evidence of formulaic writing. If the advisory is unavailable, assess distinctiveness directly and note the limitation.

Role responsibilities:

- evidence: Reopen thesis-bearing sources, reading the saved snapshot first and the live source when there is none or it looks incomplete. Work through every `quote_check` miss. Read the full answer around each thesis quote for a dropped half, a wrong speaker, or a line used about something it was not said about. Test quotation/context fidelity, claim-inventory omissions, inference limits, source independence, fairness, and whether the leading type beats its strongest alternative. Prioritize consequential errors over formatting.
- reader: Read as an intelligent unfamiliar reader. Test curiosity, insight, progression, repetitive metaphors, distinctive details, counterarguments, metadata agreement and five-year usefulness. Challenge unsupported psychological certainty. Protect exceptional writing.
- subject: Fairness proxy. Distinguish the public record from the author's inference; check harmful overclaims, imagined motives and missing responses. Do not pretend to speak for the real subject.
- fan: Informed-reader proxy. Check missing formative context, revealing contradictions and distortions of well-known source material. Do not reward flattery.
- critic: Fair-minded skeptical proxy. Test whether adverse evidence is honestly confronted and whether attractive causal stories are actually supported.
- unfamiliar: Test orientation, narrative momentum, stakes, clarity and what a reader learns without prior knowledge.
- enneagram: Test motivation against behavior, strongest alternative and actual discriminator. Challenge convenient wings/arrows and stereotyped typing.
- future: Apply a five-year test. Check the thesis without the latest event, temporary status claims, absolute dates and evidence-record review triggers.

Keep assessment and findings compact. Aim for at most eight consequential findings and five protected passages; never omit a material factual error to meet a quota. Each finding needs an exact passage, problem, severity and concrete acceptance test. The evidence reviewer must actually open sources; source URLs and recognized outlet names are not verification. Return honest uncertainty when a source is unavailable. Do not generate grades or a rewritten draft.

Open cases (`profile_format: "open_case"`): every role also checks eligibility. Raise a blocker if the subject has a deep record that research skipped, or is not early in a public career. Raise a finding if the article overstates confidence anywhere (body, title, description, FAQ), treats alternatives as token, or gives generic settle signals.
