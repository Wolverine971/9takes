<!-- docs/taskers/T-40-typing-consistency-sweep-and-guard.md -->

# Tasker: Typing Consistency Sweep and Guard (Posts vs People Pages)

**For:** the agent assigned to make every typing claim on 9takes agree with the person's own analysis page, and to stop new conflicts from shipping.
**Owner:** DJ
**Created:** 2026-09-24
**Status:** Ready for execution. Principle confirmed by DJ on 2026-09-23/24: the person's analysis page is the source of truth ("fix the typing conflicts"; "I think Trump is a Type 3").
**Related:** `T-38-trump-vs-biden-type-3-rewrite.md` and `T-39-kardashian-kim-kanye-3-vs-7.md` (two known conflicts that need rewrites, not edits); `docs/crosslinks/crosslink-log.md` entry "2026-09-23: typing conflicts fixed"; `scripts/check-crosslinks.mjs` (the gate pattern to copy).

---

## 0. What and why

When a post says one thing about a person's type and that person's page says another, a reader who clicks through gets told two different things by the same site. On 2026-09-23 this turned up in bulk:

- `enneagram-wings-complete-guide` had **14 of 30** checkable "Famous Examples" in the wrong wing list (Trump under 8w7, Carl Jung under 9w8, Mr. Rogers under 9w1, and more).
- `trump-type-8-vs-biden-type-2` typed Clinton as 3 and G.W. Bush as 9 (pages: 2 and 6), and argues Trump is an 8 throughout (page: 3w2). The Trump part is T-38.
- `kardashian-family-enneagram-analysis` had "Kim and Kanye: Two Type 3s Collide" (Kanye's page: 7w8). The heading is fixed; T-39 finishes the job.
- `us-presidents-enneagram-analysis` had "Clinton's 3-like charisma".

All of those except the T-38/T-39 rewrites are fixed (see the log entry for the full list). **But the 09-23 scan had gaps**, and nothing stops the next draft from shipping a new conflict. Content pipelines generate people mentions constantly, and people pages occasionally get retyped.

**Gaps in the 09-23 scan (what this tasker closes):**

1. It matched **full names only**. "Kanye", "Clinton", "Musk", "Ye" and possessives were checked only by hand, for a few names.
2. It checked the wings guide's example lists and prose sentences, but not systematically: tables (a person cell with a "Type N" cell in the same row), headings like `## [Name](...) (Type N - The X)`, or FAQ JSON-LD `"text"` fields.
3. It skipped **unpublished drafts**. `pop-culture/world-leaders-enneagram-personality-dynamics.md` (draft) types Trump as an 8 in the thesis, the typing table, a section heading and both FAQ answers; T-38 step 6 covers that one. Others likely exist.
4. It never checked that **people pages agree with themselves**. The type the live site shows comes from `src/lib/components/molecules/famousTypes.ts` (generated from the database by `pnpm gen:famous-types`); the local mirror is `src/blog/people/drafts/<Name>.md` (`enneagram:` frontmatter, the FAQ answer, the "Wing:" section).

## 1. Required reading

1. `scripts/lib/blogLinkGraph.js`: `loadPeople()` returns every published person with `name`, `url`, `enneagram` (from the roster) and `draftFile`; `loadBlogCorpus()` returns posts with `live`, `body`, `bodyLineOffset`.
2. `scripts/check-crosslinks.mjs` + `scripts/lib/crosslinkGate.js` + `docs/crosslinks/baseline.json`: the ratchet-gate pattern (grandfather existing debt, fail on new debt, `--update-baseline` only tightens).
3. The 2026-09-23 log entry in `docs/crosslinks/crosslink-log.md` (what was fixed, so you do not redo it).

## 2. Define the source of truth in code

For each person with a page:

- **Type:** `famousTypes.ts` roster (via `loadPeople().enneagram`). If the draft's `enneagram:` frontmatter or its FAQ answer ("X is an Enneagram Type N") disagrees with the roster, that is a **people-page conflict**. Report it to DJ and do not "fix" posts toward a disputed page.
- **Wing:** the first of `Wing:\s*(\d)w(\d)` (the `### <Name>'s Wing: NwM` heading), `specifically an? (\d)w(\d)` (the FAQ answer), or `reads as (\d)w(\d)`, **only if its first digit equals the type**. Otherwise the wing is unknown and only the type must match. (On 09-23, Oprah Winfrey, Leonardo DiCaprio, Bill Clinton and others had no stated wing.)

## 3. Build `scripts/check-typing-consistency.mjs` (+ `scripts/lib/typingConsistency.js`, + spec)

**Mentions.** For each live post (and, with `--drafts`, every `published: false` post in a routable folder):

- Full name, case-sensitive, linked or not (strip `[text](url)` and `<a>` to text first).
- **Aliases**, only when unambiguous in that post: the surname or first name of a person whose full name (or page link) already appears in the same post, and no other person in the post shares it. Include known mononyms from the page title ("Kanye", "Ye", "Drake"). Single words must not match inside longer capitalized names ("Prince" in "Prince Andrew"). `displayNameFromTitle` (`scripts/lib/blogLinkGraph.js`) and the single-word guard in `buildTargetPhrases` (`scripts/lib/crosslinkOpportunities.js`) already solve the naming half.

**Claims attached to a mention.** In the same clause (stop at `.;!?`, at the next full name, or at `, and` + capitalized word): `Type N`, `type N`, `Enneagram N`, `NwM`, `(Type N ...)` in headings, `a N` / `an N` where N is a digit, and "N-like". Tables: a row whose person cell names someone and whose header marks a "Type" column. JSON-LD: scan `"text"` values the same way as prose.

**Known false-positive shapes from 09-23. Write a spec case for each; the check must stay silent on all four:**

1. `When Gosling took the role of Ken in Greta Gerwig's _Barbie_ (2023), it was a Type 9 doing something rare` (the 9 is Gosling's, not Gerwig's)
2. `"text": "- Donald Trump's full personality breakdown - Joe Biden's full personality breakdown - All about Type 8 - All about Type 2"` (a list, not a claim)
3. `Biden's July 2024 decision to drop out and back Kamala Harris was pure Type 2` (the 2 is Biden's)
4. `| Kanye West | Kim (Type 3) | ...` (the 3 is Kim's; it is in parentheses after her name)

**Output:** `docs/crosslinks/typing-consistency.md`, a table of `file:line`, person, what the post claims, and what the page says, plus a people-page-conflicts section. Exit non-zero on conflicts in live posts that are not in the baseline.

## 4. Sweep and fix

1. Run the check. Fix each real conflict in the **post**, toward the page, by editing the sentence so it stays true and readable (move a name to the right list, correct the number, or cut the claim). Do not find-and-replace digits.
2. A conflict that is the post's **thesis** (like Trump in T-38) is not a sentence fix. List it for DJ with a one-line recommendation and move on.
3. A people-page conflict (roster vs draft vs FAQ) goes to DJ. Do not edit people pages; they live in the database, and `pnpm push:people` syncs are gated.
4. When you add a link to a person while fixing (worth doing: a corrected mention is exactly where a reader wants the page), link the first mention only.

## 5. Wire the guard

- `package.json`: `"typing:check": "node scripts/check-typing-consistency.mjs"`.
- Baseline file `docs/crosslinks/typing-baseline.json` for any conflict DJ decides to live with (for example, a thesis waiting on T-38). Ratchet-only, like the crosslink gate.
- Add it to `pnpm lint` (after `check-crosslinks.mjs`) only once the sweep is clean and the four false-positive specs pass. A noisy gate in CI gets bypassed.
- Mention it in the CLAUDE.md "Utility Scripts" table.

## Verification checklist

```bash
npx vitest --run scripts/lib/typingConsistency.spec.mjs   # includes the 4 false-positive cases
pnpm typing:check                                          # 0 unbaselined conflicts in live posts
pnpm typing:check -- --drafts                              # report only; list draft conflicts for DJ
node scripts/check-crosslinks.mjs                          # untouched by your edits, still green
npx eslint scripts/check-typing-consistency.mjs scripts/lib/typingConsistency.js
git diff -- src/blog | grep "^[-+]lastmod"                 # expect no output
```

Spot-check that the check **does** fire: temporarily write "Carl Jung (Type 9)" into a scratch copy of a post and confirm it is reported, then delete the scratch copy.

## Risks and gotchas

- Never modify `lastmod`. Zero em-dashes in any text you write. `enneagram-and-mental-illness` is frozen: no retitle, restructure or reslug; typing fixes inside it must be minimal sentence edits.
- Other agents edit `src/blog` in parallel (a crosslink-queue agent was active on 2026-09-24). Never `git stash` or reset; re-read each file right before editing it.
- MDsvex: links inside a one-paragraph `<QuickAnswer>` / `<Callout>` / `<InsightBox>` must be `<a href>`. `pnpm crosslinks:check` fails otherwise.
- Group posts often give a type for a character, era or role rather than the person ("Trump-era 8 energy"). If a claim is not about the person, it is not a conflict.
- Precision beats recall for the guard. A false alarm in CI trains everyone to ignore it.

## Definition of done

- `scripts/check-typing-consistency.mjs` + lib + spec committed, with the four false-positive cases passing.
- Every live-post conflict fixed, or baselined with DJ's sign-off. Draft conflicts and people-page conflicts reported to DJ in `docs/crosslinks/typing-consistency.md`.
- `pnpm typing:check` in `pnpm lint` (once clean) and listed in CLAUDE.md.
- A dated entry appended to `docs/crosslinks/crosslink-log.md`.
