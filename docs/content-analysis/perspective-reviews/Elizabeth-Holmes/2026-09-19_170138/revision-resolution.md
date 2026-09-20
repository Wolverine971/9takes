---
artifact: perspective-revision-resolution
schema_version: 1
subject: Elizabeth-Holmes
draft_sha256: a6a1c2033f6a9a8bfb8cfc1a5e232e457e2d00381e0078d89974b2308241d275
resolution_status: complete
resolved_at: 2026-09-20T01:07:34Z
path: docs/content-analysis/perspective-reviews/Elizabeth-Holmes/2026-09-19_170138/revision-resolution.md
---

## Resolution log

| ID | Status | Edit |
| --- | --- | --- |
| **P0-05** (the only open P0) | fixed | The diagnosis paragraph now reads *"The framework grades conduct on a separate axis running from healthy to destructive, and most of that range involves **no deception of anyone**; what a jury examined here sits at its far end rather than at the type's ordinary expression."* The negation is restored in the synthesis's own wording. The negative-polarity `anyone at all` construction is gone, so the sentence no longer asserts the type-tarring proposition it was written to remove, and it no longer contradicts `enneagram-type-3.md:115`. The paragraph was not enlarged; PROTECT-03's two hedges sit above it untouched and were string-verified after the edit. The ordinary-explanation sentence is unchanged apart from deleting the four-word throat-clear *"and it deserves saying in the open"*. |
| Remaining work #1 — Tevanian citation regression | fixed | Line now ends *"...he said: **\"But Elizabeth took it to a new level.\"** [ABC News, January 23, 2019](https://abcnews.com/Business/theranos-ceo-elizabeth-holmes-600-times-broadcast-deposition/story?id=60576630)"*. Zero new sources; the URL was already in frontmatter `citations` and is used four times elsewhere. TESTIMONY LEDGER entry 2 updated to record that the reader-visible trail and the ledger agree again. This also closes grader TO REACH item (3). |
| Remaining work #2 — 174-minute runtime uncorroborated | fixed | Took the verifier's second authorized option. The runtime is **removed from FAQ 5** (the exposed instance, since FAQ text is extracted stripped of page context) and **kept in the body only**, where the A24 film page and Forbes citations sit. FAQ 5 now leads on A24's first-party *"three-year project"* language instead. One corroboration attempt was made and abandoned: IndieWire's review 307s to `tollbit.indiewire.com` (HTTP 402), the known paywall trap, so no named outlet was added to `citations`. |
| Remaining work #4 — P0-04 residual | fixed | *"New name, softer voice, the beach, the babies..."* → *"**A new name in the headline**, softer voice, the beach, the babies, the black turtlenecks retired."* A reader who stops at the paragraph break now gets the corrected version. The correcting paragraph that follows is unchanged. |
| Remaining work #5 — `jointly liable` | fixed | Now *"held her and Balwani **jointly and severally** liable for $452 million in restitution,"* matching the opinion at p. 16. |
| Remaining work #6 — November 2022 sentencing date not in cited source | fixed | Added `[DOJ case record](https://www.justice.gov/usao-ndca/us-v-elizabeth-holmes-et-al)` to that paragraph's citation run. Trail tidiness only; no factual change. |
| Remaining work #3 — Auletta em dash rendered as a colon | needs_human | Left exactly as the editor shipped it. See Unresolved decisions. |
| Remaining work #7 — body over the word band | needs_human | Cut as far as the gate allows and no further. See Unresolved decisions. |
| Remaining work #7 — P1-10(c) FAQ-anchor heading retitle | needs_human | Untouched. The published anchor `what-elizabeth-holmes-does-in-prison` is slug-derived and the vintage is already dated inline at *"as of the last account she has given"*. |
| Remaining work #7 — `blogs_famous_people` row `Convicted fraudster` check | research_needed | Still unverifiable. The `supabase` MCP server failed to connect this session too (CONNECTION_CLOSED). Frontmatter `occupation` remains `[Entrepreneur, Founder]`, so P0-09 holds on the draft side; the live DB row is unchecked. |
| Remaining work #7 — RQ-01, RQ-02, RQ-03, RQ-06 | needs_human | Unchanged, still shipped at their safe defaults. This pass opened no new research. |
| Remaining work #7 — ship-day recheck of BOP / DOJ clemency / A24 release | needs_human | Not performed; it is a ship-day action, not a revision action. |
| Remaining work #8 — `production_pretext.blockers` | needs_human | `fresh_same_version_grades_missing` and `external_claude_pipeline_approval_pending` both remain open. Untouched by this pass. |

**Grader items handled in the same pass** (not perspective items, recorded here because two of them edit protected territory): the cold open was rebuilt around Fielder's question; a felt interior beat was added to the diagnosis H2; the stale 2026-09-09 QA ledger bullet describing the cut NYT-dispute claim as live was corrected.

## Protected hits checked

**No regressions.** All thirteen numbered protected hits and all four items in the unnumbered holding set were string-matched against the revised draft after every edit batch: **39/39 present**, including every item the two structural edits ran through.

- **PROTECT-01 order re-verified programmatically** and is monotonic in the body: Kissinger quotation → the two-sentence gloss → Gardner's objection → *"That supports the Type 3 reading, and it implicates the institutions that rewarded the story"* → the November 2014 disaster-zone text and the binder → *"That sequence is why ambition cannot work as an alibi here."* Nothing in this pass edits inside the sequence. The new diagnosis interior beat deliberately does **not** name the binder, Murdoch or the disaster-zone text; it renders the shape of the choice and forward-points with *"the court record puts a date on the version of that choice she made,"* so PROTECT-01's evidence is not spent early.
- **PROTECT-03 byte-identical.** *"Confidence is moderate."* and *"That threat is inferred from her public conduct; she has never described the pressure herself."* both survive, and the P0-05 repair stayed a separate paragraph. The interior beat was placed in the paragraph *after* the hedges, replacing the weakest sentence pair in the section rather than crowding the hedges.
- **PROTECT-13 partially edited, both protected sentences intact.** *"A photograph supplies the conclusion before anyone asks what Holmes actually said or did."* and *"a deep voice defrauds nobody"* are verbatim. The sentence cut from that paragraph was *"Both details became so recognizable that they now risk doing the thinking for the reader,"* which is not protected and restates what the surviving photograph sentence says better. P1-11's plain-claim sentence still opens the section.
- **PROTECT-04, -05, -06, -07, -09, -11, -12 verbatim.** The Tyler passage is still exactly three sentences ending on the sentence that makes the first two defensible. The acquittal sentence is untouched. The reentry-clerk closing move and the reverse-mistake turn are untouched. The ending acquired no news hook.
- **PROTECT-10's five restraints all hold**, re-checked by regex on the whole file: zero `husband`/`wife`/`married to` applied to Evans (the single `married` is the great-grandfather marrying into the Fleischmann fortune), children unnamed, Fielder's Evans remark still in the documentary section, zero `Gibbons`, and the one `mental illness` string confirmed to sit inside an HTML comment.
- **PROTECT-08 construction preserved** and extended only by the DOJ citation. Re-audited every reader-visible `October`: all four carry a year, and there are zero future-tense verbs describing the film. The documentary sentence was rephrased during compression and then deliberately rephrased *back* to a non-future-tense construction (*"has a theatrical release date of October 16, 2026 in trade reporting"*) to keep P0-06 closed.

Deterministic state after the pass: `blog-lint` **0 fail**, 34 ok, 2 warn (both pre-existing and documented: the word band, and one comparative inside reported speech about her voice). `blog-source-audit` **2 load-bearing quotes, 2 inline, 0 vague, 0 untagged** — and the cold-open slot now carries the Fielder quotation with its NBC attribution. `same-type-similarity` **clear** (script verdict), highest same-type draft alexandr-wang at 0.043; the grader's run had Tate-McRae at 0.042.

## Unresolved decisions

1. **The Auletta epigraph's colon (Remaining work #3) — needs DJ, unchanged.** Packet F-1 has *"…when they make that choice—the impact on character and quality of life."* The page prints a colon because `scripts/blog-lint.sh:375–393` exempts only attribution em dashes, so a faithful restoration hard-fails lint. Every word is present. This is a policy call, not an editor call: either accept the colon permanently, or carve a lint exemption for em dashes inside quoted strings. I did not touch it, because changing it either breaks lint or silently overrides a rule DJ set. It remains the only P0 repair a fact-checker can still flag.

2. **Body length: 4,325 words against the 3,200–3,900 band (ceiling 4,500) — needs DJ.** The grader asked for a 400–500 word cut, *"all of it caveat."* That estimate does not survive contact with the paragraph inventory. A mechanical scan of every caveat sentence in the body returned **399 caveat words in total**, and roughly two-thirds of them are PROTECT-03, PROTECT-07, PROTECT-12, P1-07 or P1-12 text the perspective gate requires, or the three caveats the grader explicitly said to keep. This pass cut **131 words net** while simultaneously absorbing a 92-word interior beat and a rebuilt cold open, so the underlying cut was roughly 290 words of genuine caveat stacking and hook redundancy: the Rabbit Hole's four per-paragraph re-hedges (the accordion already opens with one blanket hedge), *"It stays a hypothesis either way"* and its follow-on, the duplicated photograph sentence, and the three-year/34-days setup in the documentary section that the new cold open now carries. **Reaching 3,900 from here requires deleting accepted jury repairs or protected prose**, which would fail the next verification as a regression. Recorded, not hidden. DJ's call: ship at 4,325 under the ceiling, or authorise specific jury repairs to be dropped.

3. **P1-10(c) heading retitle — needs DJ, unchanged from the editor pass.** Retitling *"What Elizabeth Holmes does in prison"* breaks the published deep-link anchor. The vintage is dated inline.

4. **The live `blogs_famous_people` row — research_needed.** Whether it still carries a `Convicted fraudster` occupation value, and whether the rest of the people corpus shares the pattern, remains unchecked across two consecutive sessions because the `supabase` MCP server will not connect.

This artifact does not declare the gate passed. `/blog_perspective_verify_people` must rerun against the revised draft.
