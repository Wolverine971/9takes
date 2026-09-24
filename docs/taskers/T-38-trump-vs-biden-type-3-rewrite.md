<!-- docs/taskers/T-38-trump-vs-biden-type-3-rewrite.md -->

# Tasker: Rewrite Trump vs Biden Around Trump as a Type 3

**For:** the agent assigned to rework `/pop-culture/trump-type-8-vs-biden-type-2` so it agrees with 9takes' own typing of Donald Trump.
**Owner:** DJ
**Created:** 2026-09-24
**Status:** Ready for execution. DJ decided the typing on 2026-09-24: "I think Trump is a Type 3 ... we need to fix that." The slug change in §2 is the plan unless DJ vetoes it.
**Related:** `docs/crosslinks/crosslink-log.md` (entries "2026-09-23: typing conflicts fixed" and "Jev audit pass"); `T-40-typing-consistency-sweep-and-guard.md` (the corpus-wide version of this problem); `T-07-merge-and-301-consolidation-plan.md` §3 (redirect rules).

---

## 0. What and why

9takes types Donald Trump as a **Type 3 with a 2 wing (3w2)** in two places:

- His analysis page, `src/blog/people/drafts/Donald-Trump.md` (live at `/personality-analysis/donald-trump`). Description: "Trump's Type 3 personality decoded: the image obsession, the fear of failure, and the lifelong chase to prove he's a winner." Its wing section reads 3w2.
- The US Presidents post, `src/blog/pop-culture/us-presidents-enneagram-analysis.md`: the table (Type 3, Achiever, both terms) and the section `## The Populist Earthquake: Trump Term 1 and the Type 3 Who Broke the Mold` (around line 183).

`src/blog/pop-culture/trump-type-8-vs-biden-type-2.md` argues the opposite from its title down. A reader who clicks from this post to Trump's page gets told two different things by the same site. That breaks the one promise the brand makes about types.

**The post today (verified 2026-09-24):**

| Fact                                             | Value                                                                                                                                                                                                                                                 |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Words                                            | ~4,400                                                                                                                                                                                                                                                |
| "Type 8" / "8w" / "Challenger" / "8s" references | 43                                                                                                                                                                                                                                                    |
| Search (GSC 2026-06-24 to 09-22)                 | 26 impressions, 1 click, position 7. Negligible equity, so a slug change is cheap                                                                                                                                                                     |
| Inbound links                                    | `us-presidents-enneagram-analysis` L308 ("Trump vs. Biden"), `community/why-the-greek-vibe` L124 ("understanding the other side"), and the unpublished draft `depp-vs-heard-enneagram-analysis` L395 (anchor text "Trump vs Biden: Type 8 vs Type 2") |
| Crosslink gate                                   | Grandfathered in `docs/crosslinks/baseline.json` at in 2 / out 12                                                                                                                                                                                     |
| Structured data                                  | FAQPage JSON-LD `<script>` block at line 32, mirrored by `## FAQs` near line 400                                                                                                                                                                      |
| Code that knows its type                         | `src/lib/data/popCultureBridges.ts` entry `'trump-type-8-vs-biden-type-2': { type: 8, secondaryType: 2, ... }`; `scripts/add-faq-schema.js` line 36 lists the file path                                                                               |
| Images                                           | `static/blogs/trump-type-8-vs-biden-type-2-composite.webp` and `s-` variant. Filenames can stay; only update references if you rename them                                                                                                            |

**Already fixed on 2026-09-23 (do not redo):** line 420 now reads "[Clinton] was likely a Type 2. [Reagan] was a Type 9. [George W. Bush] and Nixon were Type 6s." The same sentence still says "[Putin] is a Type 8 like Trump", which must change with this rewrite.

**Same error elsewhere:** the unpublished draft `src/blog/pop-culture/world-leaders-enneagram-personality-dynamics.md` is built on "The Type 8 strongmen: Trump, Putin, and Xi" (lines ~63, 97, 114, 135, 143, 354). It is not live. Fix it in step 6 so it cannot publish wrong.

## 1. Required reading

1. `src/blog/people/drafts/Donald-Trump.md`, all of it. The post must agree with its thesis, its wing (3w2) and its arrows. Where the page cites evidence, prefer citing the same evidence.
2. `src/blog/people/drafts/Joe-Biden.md` (Type 2). Biden's half of the post is already consistent; keep it consistent.
3. The Trump sections of `src/blog/pop-culture/us-presidents-enneagram-analysis.md`.
4. The `9takes-editorial-standards` skill (`.claude/skills/9takes-editorial-standards/`), then `docs/brand/messaging-hierarchy.md`.
5. The current post, end to end, before you change a word.

## 2. Decisions already made (DJ can veto)

- **Trump is a 3w2.** The page is the source of truth for every typing claim on the site.
- **New slug:** `/pop-culture/trump-type-3-vs-biden-type-2`, with a **301** from the old slug. The old URL carries the wrong claim, and it has almost no search equity to lose.
- **Reframe, don't find-and-replace.** An 8 and a 2 sit in different centers; a 3 and a 2 are neighbors in the heart (image) triad. The honest story changes shape: two image types competing for the same crowd's love, one needing to be **admired** (3: winning, the brand, never being seen to fail), the other needing to be **needed** (2: loyalty, being the one people lean on). "Why they could never understand each other" can stay as the title's promise only if the body earns it on those terms.
- **Arrows change.** For a 3, stress goes to 9 and growth goes to 6. The section `### Trump's Type 2 Moments` is an 8's growth arrow and has to be rebuilt as 3 arrows. `### Biden's Type 8 Moments` is a 2 under stress (2 goes to 8), which is still correct.
- **Remove childhood-wound etiology.** The `## Where It All Started` section (Trump's and Biden's childhoods, around lines 225 to 245) explains the types as caused by childhood. That is on the site's do-not-write list: never claim a type comes from "where the childhood wound started", and never write "X tells you WHAT, the Enneagram tells you WHY" in any variant. Biographical facts about childhood can stay only if they illustrate a pattern without claiming to cause it.

## 3. Rewrite the post

1. Rewrite every Type 8 / Challenger passage as a Type 3 reading, section by section: `The Core Divide`, `How They See Each Other`, `The Communication Breakdown`, `When They Surprise You`, `Leadership Styles in Action`, `Same Crisis, Different Instinct`, `The Handoffs`, `How They Treated Their VPs`, `What This Means for America`, `FAQs`. Some sections will get shorter. Target 3,200 to 3,900 words, never above 4,500.
2. Keep every verified fact and dated event. Re-verify any factual claim you keep that has no source.
3. Fix line 420's "Putin is a Type 8 like Trump". Putin stays an 8 (his page says 8); Trump is not "like" him in type.
4. Stay descriptive and even-handed. This is a political post: no partisan verdicts, no claims about voters you can't source.
5. Frontmatter: new `title`, `meta_title`, `description` (the current description says "The Challenger vs The Helper"). **Do not touch `lastmod`**; DJ manages it by hand. Keep `published: true`.
6. JSON-LD at line 32 and the `## FAQs` section: rewrite both, and keep them saying the same thing.
7. **Zero em-dashes** in the file (house rule for all blog content).

## 4. Rename the URL with a 301

1. `pop-culture/[slug]` has **no redirect map today**. `src/routes/enneagram-corner/[slug]/+page.ts` has one: a `permanentRedirectMap` object checked at the top of `load` with ``throw redirect(301, `${permanentTarget}${url.search}`)``. Add the same pattern to `src/routes/pop-culture/[slug]/+page.ts` with one entry: `trump-type-8-vs-biden-type-2` → `/pop-culture/trump-type-3-vs-biden-type-2`. It must be a **301**, never a 302 (see T-07 §3.2).
2. Rename the file to `src/blog/pop-culture/trump-type-3-vs-biden-type-2.md` with `git mv`. Update frontmatter `loc` (line 7) and `path:` (line 27, used by the label-paths tooling) to the new slug.
3. Update `src/lib/data/popCultureBridges.ts`: new key, `type: 3`.
4. Update `scripts/add-faq-schema.js` line 36.
5. Update inbound links to point straight at the new URL (no redirect hops): `us-presidents-enneagram-analysis.md` L308, `community/why-the-greek-vibe.md` L124, and `depp-vs-heard-enneagram-analysis.md` L395. For the Depp draft, also change the anchor text "Type 8 vs Type 2".
6. The crosslink gate grandfathers the **old** URL only. The new URL must have 3+ inbound and 3+ outbound links or `pnpm crosslinks:check` fails. It has 2 inbound today. Find an honest third host with `pnpm gen:crosslinks -- --target /pop-culture/trump-type-3-vs-biden-type-2` and link it. Then remove the stale old-URL key from `docs/crosslinks/baseline.json` (the gate script's `--update-baseline` only tightens; edit the key by hand).
7. Regenerate derived files: `pnpm gen:sitemap`, `pnpm gen:crosslinks`, `pnpm index:blogs`.

## 5. Check the corpus for other Trump-as-8 claims

Run `grep -rnE "Trump[^.]{0,80}(Type 8|8w[0-9]|an 8\b|Challenger)" src/blog --include="*.md"`. As of 2026-09-24 the only hits outside this post are the world-leaders draft (step 6) and the Depp draft anchor (step 4.5). The wings guide was fixed on 2026-09-23 (Trump moved to the 3w2 examples).

## 6. Fix the world-leaders draft (unpublished)

`src/blog/pop-culture/world-leaders-enneagram-personality-dynamics.md`: rework the "Type 8 strongmen: Trump, Putin, and Xi" framing, the typing table row, `### Trump: the showman 8`, and both FAQ answers (JSON-LD around line 63 and body around line 354). Trump as the showman 3 standing next to two 8s is a sharper story than three 8s. Leave `published: false`; publishing is DJ's call.

## Verification checklist

```bash
# 1. No Trump-as-8 claims left anywhere
grep -rnE "Trump[^.]{0,80}(Type 8|8w[0-9]|an 8\b|Challenger)" src/blog --include="*.md"

# 2. Remaining "Type 8" mentions in the post are about Putin or Biden's stress arrow only
grep -n "Type 8\|8w\|Challenger" src/blog/pop-culture/trump-type-3-vs-biden-type-2.md

# 3. Zero em-dashes, lastmod unchanged
grep -c "—" src/blog/pop-culture/trump-type-3-vs-biden-type-2.md   # expect 0
git diff -M -- src/blog/pop-culture/ | grep "^[-+]lastmod"             # expect no output

# 4. Gates and tests
node scripts/check-crosslinks.mjs
npx vitest --run scripts/lib/crosslinks.spec.mjs
npx prettier --check src/blog/pop-culture/trump-type-3-vs-biden-type-2.md

# 5. Rendered: new URL 200, old URL 301 to the new one (dev server on a spare port)
pnpm dev --port 5199 --strictPort &
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5199/pop-culture/trump-type-3-vs-biden-type-2
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:5199/pop-culture/trump-type-8-vs-biden-type-2
```

## Risks and gotchas

- Other agents and DJ edit this repo in parallel. Never `git stash` or reset. Use `git mv` for the rename so history follows.
- Links inside a one-paragraph `<QuickAnswer>` / `<Callout>` / `<InsightBox>` must be HTML (`<a href>`), not markdown, or they render as literal text. `pnpm crosslinks:check` fails on it.
- A 302 instead of a 301 wastes the rename. Check the status code, not just that the redirect works.
- Do not "fix" Biden. He is a 2 on his page and in this post; that half is already right.
- The page `/personality-analysis/donald-trump` lives in the database. Do not edit it; if you believe it is wrong, stop and ask DJ.

## Definition of done

- The post argues Trump as a 3w2 consistently with his page, with no childhood-wound etiology and no em-dashes, and with `lastmod` untouched.
- New URL live in dev with a 301 from the old one. Inbound links point at the new URL. The gate passes with the new URL at 3+ in / 3+ out.
- `popCultureBridges.ts`, `add-faq-schema.js`, sitemap, search index and crosslink reports updated.
- World-leaders draft reworked (still unpublished). The Depp draft anchor is fixed.
- A dated entry appended (never rewritten) to `docs/crosslinks/crosslink-log.md` describing the rename and link changes.
