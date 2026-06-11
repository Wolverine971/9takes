<!-- docs/content-research/2026-05-29_selena-gomez-fix-handoff.md -->

# Fix-Up Handoff: Selena Gomez personality-analysis

**For:** an agent tasked with refreshing the Selena Gomez `/personality-analysis` post.
**Created:** 2026-05-29 · **Source:** flagged as a top UPDATE in `docs/content-research/2026-05-29_surging-people-scout.md`.

This doc is self-contained — you should not need to read other docs to execute it. Read it top to bottom before touching anything.

---

## Why this matters (the thesis)

Per the 2026-05-29 performance deep dive (`docs/content-analysis/personality-analysis-performance-deep-dive-2026-05-29.md`): organic search demand correlates **0.71** with lifetime traffic and post **age** correlates **0.40** — content-quality grade only **0.11**. Translation: **subject demand + index age win; polish is a floor.**

Selena Gomez is one of the most-searched people alive, and we **already own a ranking URL** for her (published 2025-03-24). That index age is the asset. So this is an **UPDATE, not a rewrite** — we refresh and re-tag to capture more of the standing demand **without resetting the URL's equity**. Light touch on what already ranks; fix what's actually broken.

---

## Current state (verified 2026-05-29, from `blogs_famous_people`)

| Field                 | Value                                                                                | Verdict                                                       |
| --------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| `person`              | `selena-gomez`                                                                       | ok                                                            |
| `published`           | `true` (since 2025-03-24)                                                            | ok — **do not unpublish**                                     |
| `title`               | "Selena Gomez: Disney to Rare Beauty - Type 9 Psychology of Her Authentic Evolution" | ok — preserve (SEO)                                           |
| `meta_title`          | "Selena Gomez's Personality: How She Handles Fame & Mental Health"                   | ok                                                            |
| `persona_title`       | "Pop's Steady Presence"                                                              | ok                                                            |
| `enneagram`           | `9`                                                                                  | keep (see "Do not re-type" below)                             |
| **`type`**            | **`['lifestyleInfluencer']`**                                                        | ❌ **WRONG NICHE — primary fix**                              |
| **`content_quality`** | **`null`**                                                                           | ❌ **never graded — must grade**                              |
| `content`             | ~13,671 chars, real article                                                          | ok but **pre-dates Sept-2025 marriage** — needs refresh       |
| `lastmod`             | `2025-12-03`                                                                         | stale — **but DJ manages this field, do not set it yourself** |
| `suggestions`         | demi-lovato, miley-cyrus, justin-bieber, taylor-swift, ariana-grande                 | ok                                                            |

`src/lib/components/molecules/famousTypes.ts` (the `selena-gomez` line, ~488) mirrors this: `contentGrade: null, types: ['lifestyleInfluencer']`. (Line number drifts as the file changes — grep `selena-gomez` to find it.)

### The three real problems

1. **Niche mis-tag.** `lifestyleInfluencer` is a weak-performing niche (~37 median views) and is wrong for her. She's a **pop-star / screen-icon** (recording artist + actor). Re-tagging to a stronger, accurate niche is the single highest-leverage SEO fix here.
2. **Ungraded.** `content_quality` is `null`. The publish gate requires `content_quality.overall >= 8.5`, and we have zero quality signal. Must run the grader.
3. **Stale content.** The article was written before her **marriage to Benny Blanco (Sept 2025)** and the 2026 news cycle. A Type-9 analysis that ignores her biggest recent life event reads dated.

### ⚠️ The structural gotcha: there is NO draft file

`/personality-analysis` is **DB-driven** (unlike all other blog sections). There is **no `src/blog/people/drafts/Selena-Gomez.md`** — it was removed at some point and the content now lives **only in Supabase**. The editing pipeline (`personBlogParser.js`) is **file → DB**, so you must **reconstruct the draft file from the DB first** (Step 0), edit the file, then push it back.

---

## Hard constraints (read before editing)

- **NEVER set or modify `lastmod`.** DJ manages it manually. The publish script will stamp dates on publish; outside of that, leave `lastmod` exactly as-is. (Project rule — non-negotiable.)
- **Preserve `title`, `meta_title`, the slug (`person`/`loc`), and heading anchors.** These carry the URL's ranking equity. Do not rename or restructure for style.
- **Do not remove internal links** (`[text](/personality-analysis/...)`, `[text](/enneagram-corner/...)`) already in the body.
- **Do not re-type her** (see below).
- **Preserve `published: true`.** This is an edit-in-place of a live post, not a new draft.
- Treat this as light-touch on a ranking asset: change what's broken (tag, grade, stale facts), not what already works.

### Do not re-type her

The scout floated "maybe Type 2 or 6," but the live post is a **Type 9** analysis with standing rankings, and the publisher command explicitly does not re-type people. **Keep Type 9.** If, while refreshing, you find genuinely strong evidence the type is wrong, **stop and flag it to DJ** with the evidence — do not silently re-type, because that would invalidate the title, persona, and the whole article's framing.

---

## Steps

### Step 0 — Reconstruct the draft file from the DB

Run this to pull the live record into a proper draft `.md` (frontmatter + body). It writes `src/blog/people/drafts/Selena-Gomez.md`. Verify the file afterward.

```bash
node -e '
import("@supabase/supabase-js").then(async ({createClient})=>{
  const d=await import("dotenv"); d.config();
  const fs=await import("fs");
  const s=createClient(process.env.PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY,{auth:{persistSession:false}});
  const {data,error}=await s.from("blogs_famous_people").select("*").eq("person","selena-gomez").single();
  if(error){console.error("ERR",error.message);return;}
  const fm=[];
  const q=v=>"\x27"+String(v).replace(/\x27/g,"\x27\x27")+"\x27";
  const scalar=["title","meta_title","persona_title","description","author","loc","lastmod","changefreq","priority","enneagram","person","wikipedia","twitter","instagram","tiktok","date","wikidata_qid","imdb_id","birth_date","birth_place","category"];
  fm.push("---");
  for(const k of scalar){ if(data[k]!=null && data[k]!=="") fm.push(k+": "+q(data[k])); }
  fm.push("published: "+(data.published?"true":"false"));
  const lists={type:data.type,suggestions:data.suggestions,keywords:data.keywords,knows_about:data.knows_about,same_as:data.same_as,citations:data.citations,tags:data.tags,nationality:data.nationality,occupation:data.occupation};
  for(const [k,v] of Object.entries(lists)){ if(Array.isArray(v)&&v.length) fm.push(k+": ["+v.map(q).join(", ")+"]"); }
  if(Array.isArray(data.faqs)&&data.faqs.length){
    fm.push("faqs:");
    for(const f of data.faqs){ fm.push("  - question: "+q(f.question)); fm.push("    answer: "+q(f.answer)); if(f.anchor) fm.push("    anchor: "+q(f.anchor)); }
  }
  fm.push("---","");
  fs.writeFileSync("src/blog/people/drafts/Selena-Gomez.md", fm.join("\n")+"\n"+(data.content||""));
  console.log("WROTE src/blog/people/drafts/Selena-Gomez.md  | content chars:",(data.content||"").length,"| type:",JSON.stringify(data.type),"| grade:",JSON.stringify(data.content_quality));
});'
```

After it runs: open the file, confirm the frontmatter parses and the body is the full article. This file is now your working surface for Steps 1–4.

### Step 1 — Fix the niche `type` (highest-leverage)

In the reconstructed draft frontmatter, change:

```yaml
type: ['lifestyleInfluencer']
```

to an accurate, stronger-performing niche. **Recommended:** `['musician', 'pop-star']` (she is primarily a recording artist; `pop-star` is a strong niche). If you judge her acting (Only Murders in the Building, Emilia Pérez) as co-equal, use `['musician', 'pop-star', 'screen-icon']`. Use the canonical vocab below; do not invent tags.

> Valid base `type` values: `celebrity, musician, movieStar, newMovieStar, comedian, creator, techie, politician, entrepreneur, author, activist, historical, tiktoker, influencer, lifestyleInfluencer, other`. Sub-niche tags seen in the codebase that pair with these (use when apt): `pop-star, screen-icon, rising-star, alternative-artist, music-crossover, celebrity-image, lifestyle-builder, singer-songwriter, rapper, business-operator`.

**Image check — already satisfied, re-tag is safe.** Image folders are keyed by **enneagram number, not niche.** Selena's assets live at `static/types/9s/Selena-Gomez.webp` + `static/types/9s/s-Selena-Gomez.webp` (both present, verified). Because the path derives from `enneagram: 9` — which you are keeping — changing the `type` niche tag has **zero effect** on the image gate. (Confirm with `ls static/types/9s/ | grep -i selena` if you want.)

### Step 2 — Refresh the stale content (evidence-led, surgical)

Update the body so it reflects her life through 2026 **without** disturbing the Type-9 spine or the existing headings/links:

- Weave in the **Benny Blanco relationship → engagement (Dec 2024) → marriage (Sept 2025)**, and the 2026 cycle, **as evidence for the existing Type 9 read** (the peacemaker who finally chose her own peace/partnership; merging vs. self-forgetting). Don't bolt on a gossip section — integrate it into the psychology.
- Touch her current work where it sharpens the type: _Emilia Pérez_ (awards run), _Only Murders in the Building_, Rare Beauty, music. Use real, sourced specifics — quotes from long-form interviews preferred over press-junket fluff.
- Keep additions proportional. This is a refresh, not a doubling. Preserve voice and the firstLetter intro.
- Do not fabricate. If you can't source a claim, leave it out.

### Step 3 — Enrich frontmatter (Schema.org / SEO)

Run `/blog_content_frontmatter_enrich_people` on `Selena-Gomez` (or the draft path). It is additive-only and fills `wikipedia, wikidata_qid, imdb_id, birth_date, birth_place, nationality, occupation, knows_about, keywords, same_as, citations, faqs`. It will not touch the body or `lastmod`. If `faqs` already came across from the DB, it leaves them; if the refresh in Step 2 changed the strongest sub-questions, you may regenerate `faqs` to match (only if currently empty — otherwise flag).

### Step 4 — Grade it

Run `/grade_blog` on the draft. This writes `content_quality` (with `.overall`). The publish gate requires **`overall >= 8.5`**. If it grades below 8.5, do another editor pass (`/blog_content_editor_pass_people`) and re-grade — do not bypass the gate.

### Step 5 — Publish / sync back to the DB

Push the file back to Supabase and regenerate listings:

```bash
node scripts/personBlogParser.js Selena-Gomez --publish
```

The script gates on: complete frontmatter, valid `content_quality.overall >= 8.5`, real article body, enough `##` sections, no placeholder markers, and both image files. On success it sets Supabase `published: true`, stamps `date`/`lastmod`/`created_at` to today, updates `src/lib/components/molecules/famousTypes.ts` (`types`, `contentGrade`, `link: true`, `hasImage: true`, today's `lastmod`), and runs `pnpm gen:all` (sitemap, etc.).

Then verify:

```bash
git diff -- src/blog/people/drafts/Selena-Gomez.md src/lib/components/molecules/famousTypes.ts static/sitemap.xml
```

Confirm (grep `selena-gomez` in famousTypes.ts): the line now shows the new `types` and a non-null `contentGrade`; sitemap still contains `/personality-analysis/selena-gomez`.

---

## Definition of done

- [ ] `type` is an accurate, stronger niche (e.g. `['musician', 'pop-star']`) — no longer `lifestyleInfluencer`.
- [ ] Body reflects the Benny Blanco marriage + 2026 reality, integrated into the **Type 9** analysis (type unchanged, or escalated to DJ with evidence).
- [ ] Frontmatter enriched (faqs/keywords/schema fields present).
- [ ] `content_quality.overall >= 8.5`.
- [ ] Pushed to Supabase, `published: true`, `famousTypes.ts` updated, sitemap intact.
- [ ] `lastmod` only changed by the publish script — never hand-edited.
- [ ] Title, slug, and existing internal links preserved.

## If you get blocked

- **Publish script rejects the draft:** report the exact blocker (grade <8.5, missing image, etc.) and stop — don't force-bypass unless DJ says so.
- **Image gate complains:** it shouldn't — images are keyed by enneagram (`static/types/9s/`), which is unchanged. If it does, run `ls static/types/9s/ | grep -i selena` to confirm both `Selena-Gomez.webp` and `s-Selena-Gomez.webp` exist.
- **You believe she's not a Type 9:** stop, write up the evidence, ask DJ. Do not re-type a ranking post unilaterally.

## References

- Scout brief (source of this task): `docs/content-research/2026-05-29_surging-people-scout.md`
- Why subject/age beat polish: `docs/content-analysis/personality-analysis-performance-deep-dive-2026-05-29.md`
- Frontmatter enrich command: `.claude/commands/blog_content_frontmatter_enrich_people.md`
- Grader: `.claude/commands/grade_blog.md`
- Editor pass: `.claude/commands/blog_content_editor_pass_people.md`
- Publish gate + script: `.claude/commands/blog_content_publish_people.md` → `scripts/personBlogParser.js`
- Gold-standard enriched draft: `src/blog/people/drafts/Albert-Einstein.md`
