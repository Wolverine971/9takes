---
artifact: perspective-revision-resolution
schema_version: 1
subject: Bill-Burr
draft_sha256: c279d288f1395a0b96ec6c208186b19926202e563247907ae81fbfd50b37a55c
resolution_status: complete
resolved_at: 2026-08-19T08:14:19Z
---

## Resolution log

This revision pass inherited **zero open P0 items**. `verification-initial.md` (the newest
verification artifact in this directory; no `verification-final.md` exists) returned
`verification_status: pass`, `open_p0: 0`, `protected_hit_regressions: 0`, with all eleven P0 items
resolved and independently re-verified.

The work list was therefore driven by the grade sidecar
(`docs/content-analysis/grades/Bill-Burr.review.md`, B / 8.4, caps
`originality_cross_draft_sameness` and `contrast_pair_engine`), not by the perspective jury. Lint was
already clean at entry (`0 fail, 1 warn`), so there were no mechanical FAILs to take first.

Two grader instructions collided with perspective artifacts and were resolved in favour of the
protected material:

| Collision | Resolution |
| --- | --- |
| TO REACH #2 asks that `"He does not present it as an accusation. He presents it as inheritance."` become a single positive clause. That sentence is **PROTECT-10**. | Executed by deleting only the negation half. PROTECT-10's pass condition in `synthesis.md` is `"He presents it as inheritance" intact`, not the full two-sentence form, and the protected *function* (keeping the childhood section fair to a named living parent) is carried by the retained clause plus the CLM-22 quotation that follows it (`"he dialed down what was done to him"`). String survives verbatim. |
| NEEDS WORK on the `Bill Burr MBTI` keyword offers two remedies: drop the keyword **or** add a one-clause MBTI note to the Rabbit Hole. | Took the drop. P0-09's acceptance test is literally zero MBTI-label hits (`grep "ISTP\|ESTP\|Myers\|SunSigns\|personalitylist"` → 0); adding an MBTI note to satisfy the keyword would have regressed a resolved P0 to chase a query the page deliberately declines to answer. |

Two negate-then-assert constructions were deliberately **retained** against the grader's "kill three
of five," because each is load-bearing perspective material:

- `"He did not describe wanting the room. He described wanting the room to stand down."` —
  **PROTECT-09**, the pull-quote, and the grader itself says to keep it as the thesis.
- `"A demographic inside a civil-rights movement is not a class of billionaires. The reflex is the
  same anyway."` — this *is* the P0-08 repair. The verifier credits it specifically for conceding the
  disanalogy while letting the behavioural pattern survive. Cutting it would reopen P0-08.

Cutting three of five drops the engine to two uses, which clears the `>2` threshold that capped
Writing at 8, without spending a protected hit or a resolved P0.

| ID | Status | Edit |
| --- | --- | --- |
| **P0-01** | `fixed` (no regression; re-verified) | The closing section was reshaped for TO REACH #4, which is adjacent to this repair. The `"Per the trailer, Bill Burr plays a crisis counselor."` hedge is intact and no invented staging was reintroduced — the closer still describes only Sorkin's actions plus the trailer-traceable line. The explicit driveway callback and its `"Fifty-four years after…"` arithmetic were cut; the driveway itself survives as a callback one section earlier (`"a birthday afternoon in Canton with two smashed plastic pistols in his hands"`), so the image is still loaded when the reader reaches the end. |
| **P0-08** | `fixed` (no regression) | The disanalogy concession is untouched and verified by literal grep. The adjacent `"2020 and 2025 are not a conversion. They are one move run twice:"` was folded to `"2020 and 2025 are one move run twice:"`; the rebuttal it carried is already stated by the preceding sentence, `"The coverage misses the same thing in both directions."` |
| **P0-09** | `fixed` (no regression) | Acceptance pattern still returns zero hits. The `Bill Burr MBTI` keyword was removed from frontmatter so the page no longer promises an answer the body withholds. The only remaining `MBTI` string in the file is the FORMULA FINGERPRINT ledger's own note recording the cut, inside an HTML comment and not reader-visible. |
| **P0-11** | `fixed` (superseded) | The stamped corpus sentence this P0 repaired was cut outright per TO REACH #1. `grep -E '43\.8\|14\.3\|32 comedians\|widest gap'` → 0 hits. The Type 7 objection survives unquantified: `"One more objection: comedians are supposed to be Sevens, and plenty of them got into this chasing the high. Burr came looking for cover."` This also closes Remaining-work item 2 from `verification-initial.md` — publishing Burr can no longer age a printed figure or narrow a superlative, because neither is on the page. |
| **P1-08** | `needs_human` | Unchanged and still correct. No Wayback snapshot exists for either YouTube citation (`8NYGbY4Tmkc`, `yHKqkVqa9mc`); CDX returns empty. Creating one requires POSTing to a third-party archiving service, which is outward-facing and outside this command's remit. The grade sidecar independently flags it "for DJ, not for the revision pass." **Exact unresolved decision: whether DJ runs `curl -sI "https://web.archive.org/save/https://www.youtube.com/watch?v=8NYGbY4Tmkc"` and the same for `yHKqkVqa9mc`, then adds the snapshot URLs to `citations`.** Until then the two best exhibits on the page resolve only to a channel the subject controls. |

One non-P0 item from the verifier's Remaining-work list was taken opportunistically because it cost
one word and the page's whole method is arithmetic that survives checking: item 6, `"five months into
the George Floyd protests"` (May 26 → October 10, 2020 is about four and a half) is now `"nearly five
months"`.

Both affected ledgers were updated. The FORMULA FINGERPRINT ledger previously cited
`blog-quality-report`'s `0 strong / 0 comparative` as proof the piece was clean; the grader correctly
called that a false all-clear, since the script only matches the single-sentence form. The ledger now
carries an explicit caveat naming the two surviving two-sentence engines and why neither can be cut.
The ending swap-test entry was rewritten to describe the ending that now exists.

## Protected hits checked

All ten verified by literal-string `grep -F` against the live draft after every edit.
**Zero regressions.**

| Check | Result |
| --- | --- |
| PROTECT-01 | **Intact.** Both Cross sentences present verbatim; §5 was not trimmed. |
| PROTECT-02 | **Intact.** `"Three tellings. One motive. Safety."` present, three tellings in three formats. Noted as a reused "aphoristic fragment closer" in the grader's sameness list but **not** named in TO REACH, and it sits on the protected structure, so it was left alone. |
| PROTECT-03 | **Intact.** `<div class="scroll-table">` and both dated rows present; the table was not touched. |
| PROTECT-04 | **Intact.** `"The counterattack arrives before the verdict does."` verbatim. TO REACH #3 was executed by deleting the *preceding* reader-command `"Watch the timing instead."`, which the grader judged redundant with this sentence. The empathy turn still runs looks-like → what-is-actually-happening. |
| PROTECT-05 | **Intact.** `"Nobody asked. There was no scale in play."` verbatim, Rousey quotation untrimmed. |
| PROTECT-06 | **Intact.** `"The son's name is Bill."` verbatim on the five-season, co-created credit. |
| PROTECT-07 | **Intact.** `"…So, I came out and threw gas on a fire that was already going."` verbatim. |
| PROTECT-08 | **Intact.** Both `"What would change our mind"` and `"What Type 6 does not fully explain"` present and unedited. |
| PROTECT-09 | **Intact.** `"He did not describe wanting the room. He described wanting the room to stand down."` verbatim. Deliberately retained as one of the two permitted negate-then-assert engines. |
| PROTECT-10 | **Intact.** `"He presents it as inheritance."` verbatim. The negation half was removed per TO REACH #2; see the collision table above for why this satisfies the pass condition rather than violating it. |

No protected hit was traded to pay for a grade fix. Every change in this pass was word-negative
except the two ledger notes, which are HTML comments and do not count against the body. Body word
count fell from 4,489 to 4,429 against the 4,500 ceiling, so headroom went from 11 words to 71.

## Unresolved decisions

1. **P1-08 — archive the two YouTube citations. `needs_human`, DJ's call.** Detailed above. This is
   the only item in this artifact requiring a decision, and it is outward-facing by nature.
2. **RQ-01 (Charlie's occupation, checkpoint 2026-10-16) and RQ-04 (is fear-narration a standing MMP
   register?)** remain open exactly as `verification-initial.md` left them. Both are non-blocking by
   the synthesis's own decision rule and neither was touched. RQ-04 still needs a grep across an MMP
   transcript corpus that does not exist locally.
3. **RQ-05 residue.** Unchanged. The trimmed Frank Murphy blockquote is fully corroborated, so
   nothing is broken; `"He's scared of everything. Gee, I wonder where he got that from, Susan?"` was
   dropped rather than disproved, and Netflix closed captions for S1 "Bill Murphy's Day Off" would
   settle whether it can return.

The gate is **not** declared passed here. `/blog_perspective_verify_people` must rerun against this
directory.
