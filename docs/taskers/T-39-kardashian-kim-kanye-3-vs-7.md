<!-- docs/taskers/T-39-kardashian-kim-kanye-3-vs-7.md -->

# Tasker: Kardashian Family Post, Rewrite Kim and Kanye as a 3 and a 7

**For:** the agent assigned to bring `/pop-culture/kardashian-family-enneagram-analysis` in line with 9takes' typing of Kanye West.
**Owner:** DJ
**Created:** 2026-09-24
**Status:** Ready for execution. DJ on 2026-09-24: "I think Kanye is a 7."
**Related:** `docs/crosslinks/crosslink-log.md` (entry "2026-09-23: typing conflicts fixed"); `T-40-typing-consistency-sweep-and-guard.md`; `T-38-trump-vs-biden-type-3-rewrite.md` (same class of fix).

---

## 0. What and why

The post had a section titled **"Kim and Kanye: Two Type 3s Collide"** arguing both were achievement-driven 3s competing for the spotlight. 9takes types Kanye West as a **Type 7 with an 8 wing** on his own page, `src/blog/people/drafts/kanye.md` (live at `/personality-analysis/kanye`). The page's FAQ answer: "Kanye West is an Enneagram Type 7 (The Enthusiast) with an 8 wing." Its evidence: recording "Through the Wire" two weeks after a near-fatal crash with his jaw wired shut, twelve albums that never repeat a sound, and serial pivots into fashion, architecture and religion. Its description: "an engine that turns pain into art, and why that engine can't be turned off."

**Stopgap already applied on 2026-09-23.** The heading and first paragraph (around line 244) now read:

> ### Kim and Kanye: A 3 and a 7 Collide
>
> Her marriage to [Kanye West](/personality-analysis/kanye) put a 3 and a 7 in the same spotlight. Kim measured worth through a carefully managed public image. Kanye, a Type 7, kept moving: a new sound, a new venture, a new provocation, never the same move twice. She needed the brand to hold still. He couldn't.
>
> The divorce became inevitable when Kanye's behavior started damaging Kim's carefully curated image. Type 3s will sacrifice relationships before reputation.

That removed the contradiction but is two sentences deep. This tasker turns it into a real analysis, and fixes two house-rule violations in the same file while you are in it.

**The post (verified 2026-09-24):** about 6,200 words (the file, including frontmatter and structured data); 3,186 impressions, 41 clicks, position 8.2 over 90 days. It ranks for "kim kardashian personality type", "kourtney kardashian personality type" and "kris jenner personality type". Handle it like a page that earns traffic: improve it, don't restructure it.

**The other family typings already match their pages (checked 2026-09-24).** Kris Jenner 3, Kim 3, Kourtney 1, Khloé 2, Kendall 6, Kylie 9 (page states 9w8, and so does the post's `### The 9w8 Wing` section). Rob has no page. The heading gives Kim as "3w4", but her page states no wing, so there is nothing to contradict. Leave it unless her page says otherwise.

## 1. Required reading

1. `src/blog/people/drafts/kanye.md`, especially `## What is Kanye West's Personality Type?` and `### Kanye West is an Enneagram Type 7`. The new section must agree with it.
2. `src/blog/people/drafts/Kim-Kardashian.md` (Type 3).
3. The whole Kardashian post, then the `9takes-editorial-standards` skill.

## 2. Rewrite the Kim and Kanye section (required)

1. Expand `### Kim and Kanye: A 3 and a 7 Collide` to roughly 200 to 350 words. The dynamic to argue:
   - Kim (3) needs the image to hold: a brand that compounds, the right version of herself in public.
   - Kanye (7w8) needs to keep moving and cannot sit inside a limit or a pain: the next sound, the next venture, the next provocation, with the 8 wing turning it confrontational.
   - What they shared: both are assertive types who go after what they want, and both are future-facing. That is why it worked for years.
   - Where it broke: his public escalations became the one thing her image could not absorb. The existing closing line ("Type 3s will sacrifice relationships before reputation") can stay if the section earns it.
2. Use only dated, sourced public events. Where Kanye's page already cites a source for an event, reuse that source. His bipolar disclosure and health are sensitive: state only what he has said publicly, with a source, and make no diagnosis.
3. Link Kanye's page once in the section (the existing link) and do not add a second.

## 3. Align the "Kardashian Curse" table (required)

Around line 474, `### The Pattern, Decoded` has the row: `| Kanye West | Kim (Type 3) | Mental health crisis, divorce | Type 3 outshining → partner feels emasculated by her fame |`. It describes Kim's side only, which is fine, but "feels emasculated by her fame" is speculation. Rewrite the dynamic cell so it agrees with section 2 (for example, a 3's image management colliding with a 7's refusal to be contained). Keep the other rows as they are.

## 4. Remove childhood-wound etiology (required, site-wide rule)

`### The Wound Behind the Momager` (around line 175) says: "Type 3s typically develop from childhoods where love felt conditional on performance. Somewhere, young Kris learned: _you're valuable when you achieve._" That breaks the site's do-not-write list: never claim a type comes from a childhood wound, and never write "X tells you WHAT, the Enneagram tells you WHY" in any variant. Rewrite the section around observable adult pattern (how the 3 drive shows up in Kris's documented choices) and retitle it (the heading itself says "Wound"). Grep the rest of the post for the same move: `grep -n -iE "childhood|wound|learned early|as a child" <file>`.

## 5. Zero em-dashes (required, house rule)

The file has **58** em-dashes (U+2014). The house rule is zero per article for any blog a tasker touches. Replace each with the punctuation the sentence actually needs (a period, comma, colon or parentheses), not a mechanical swap to hyphens. Check the frontmatter `description` and the JSON-LD too.

## Verification checklist

```bash
F=src/blog/pop-culture/kardashian-family-enneagram-analysis.md

# Kanye is never typed as a 3; the section argues a 7
grep -n -iE "kanye[^.]{0,80}(type 3|\b3s?\b)|two type 3s" $F        # expect no output
grep -n "A 3 and a 7" $F

# No childhood etiology, no em-dashes, lastmod untouched
grep -n -iE "develop from childhood|childhood wound|wound behind" $F   # expect no output
grep -c "—" $F                                                          # expect 0
git diff -- $F | grep "^[-+]lastmod"                                    # expect no output

# Gates
node scripts/check-crosslinks.mjs
npx prettier --check $F

# Rendered check (spare port so DJ's dev server is untouched)
pnpm dev --port 5199 --strictPort &
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5199/pop-culture/kardashian-family-enneagram-analysis
```

## Risks and gotchas

- This is a traffic page (3k+ impressions, position 8.2). No title, slug or H2 restructure. Section-level rewrites only.
- Other agents edit this repo in parallel (a crosslink-queue agent was adding links on 2026-09-24). Never `git stash` or reset. Re-read the file right before editing and keep changes surgical.
- Links inside a one-paragraph `<QuickAnswer>` / `<Callout>` / `<InsightBox>` must be HTML (`<a href>`), or they render as literal text.
- Do not edit people pages (they live in the database). If Kanye's or Kim's page looks wrong, stop and ask DJ.

## Definition of done

- The Kim and Kanye section argues a 3 and a 7 (7w8) consistently with Kanye's page, using sourced events only.
- The curse table's Kanye row agrees with it.
- No childhood-wound etiology anywhere in the post; the Kris section is retitled.
- Zero em-dashes; `lastmod` untouched; gate and prettier pass; the page renders 200.
- A dated entry appended to `docs/crosslinks/crosslink-log.md`.
