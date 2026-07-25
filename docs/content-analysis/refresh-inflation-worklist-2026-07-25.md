<!-- docs/content-analysis/refresh-inflation-worklist-2026-07-25.md -->

# Refresh inflation worklist

**Created:** 2026-07-25
**Data:** all 391 published `src/blog/people/drafts/*.md` joined against `docs/data/gsc/2026-07-25-pages.csv` (90-day window, 24 Apr to 23 Jul)
**Related:** [news-refresh batch doctrine §1](../taskers/news-refresh-2026-07/README.md), `scripts/blog-lint.sh` body-length gate, `/blog_refresh_people`

---

## The finding

9takes had a birth pipeline and no maintenance pipeline. New drafts ran nine gated stages with a revise-and-regrade loop. Refreshes were hand-rolled from taskers, and taskers are written as lists of things to **add**. Nothing measured length, so nothing stopped the ratchet.

The corpus shows the result:

- **Corpus median: 3,885 words.** p75 is 4,457, p90 is 5,122.
- **90 of 391 published pages (23%) exceed 4,500 words.**
- `corr(words, impressions) = +0.375`. **The longest pages are the highest-traffic ones**, because those are the ones that get refreshed.
- `corr(words, position) = 0.02`. **Length buys no rank.**
- Controlling for search demand, the longer half of every impression tier converts **12 to 31% worse** at effectively identical rank:

| Impressions tier | Shorter half   | Longer half    | CTR delta | Rank         |
| ---------------- | -------------- | -------------- | --------- | ------------ |
| 100 to 300       | 3,349w, 1.017% | 4,719w, 0.705% | −31%      | 9.5 vs 9.6   |
| 300 to 800       | 3,311w, 0.592% | 4,494w, 0.521% | −12%      | 10.2 vs 10.3 |
| 800+             | 3,456w, 0.564% | 5,188w, 0.439% | −22%      | 9.3 vs 9.8   |

**Six of the ten worst-affected pages are in the current 12-page refresh batch.** That is the mechanism caught in the act: the pages worth refreshing get refreshed, and refreshing them made them worse at converting.

---

## Read this before acting on the table

**The click gap is a priority score, not a promise.** It is `(baseline CTR − page CTR) × impressions`, where baseline is 0.581%, the pooled CTR of every page at or under 4,500 words.

Cutting words will not automatically recover those clicks. Per-page variance swamps the length effect, and the counterexamples are real: `jordi-hays` converts at 2.23% on 4,771 words, and `john-f-kennedy` at 1.08% on 4,929, while `mr-beast` converts at 0.07% on 3,796. **Length is not destiny and this is correlational.**

What the number does reliably identify is _where a lot of impressions are meeting a page that converts far below corpus norm_ — which is where an editorial pass is worth the most, whatever the pass turns out to fix. Treat it as a queue, not a forecast.

---

## The queue

Ranked by click gap. All figures are 90-day.

| #   | Page                | Words | Impr   | Clicks | CTR   | Pos  | Click gap | In batch |
| --- | ------------------- | ----- | ------ | ------ | ----- | ---- | --------- | -------- |
| 1   | `ishowspeed`        | 7,731 | 12,312 | 19     | 0.15% | 8.1  | 53.1      | yes      |
| 2   | `sabrina-carpenter` | 6,325 | 7,263  | 12     | 0.17% | 6.7  | 29.8      | yes      |
| 3   | `sydney-sweeney`    | 6,832 | 3,227  | 4      | 0.12% | 7.6  | 14.9      | yes      |
| 4   | `elon-musk`         | 5,798 | 2,568  | 3      | 0.12% | 13.7 | 11.8      | yes      |
| 5   | `madison-beer`      | 4,906 | 1,954  | 2      | 0.10% | 9.0  | 9.4       |          |
| 6   | `hasan-piker`       | 5,845 | 3,074  | 10     | 0.33% | 9.7  | 7.7       | yes      |
| 7   | `emma-watson`       | 4,775 | 3,326  | 12     | 0.36% | 9.9  | 7.3       |          |
| 8   | `billie-eilish`     | 5,711 | 1,199  | 2      | 0.17% | 9.8  | 4.9       |          |
| 9   | `sam-altman`        | 7,865 | 2,681  | 11     | 0.41% | 8.8  | 4.6       | yes      |
| 10  | `joe-rogan`         | 6,070 | 891    | 1      | 0.11% | 9.7  | 4.2       |          |
| 11  | `alex-hormozi`      | 4,866 | 1,304  | 4      | 0.31% | 11.8 | 3.5       |          |
| 12  | `chappell-roan`     | 5,003 | 1,094  | 3      | 0.27% | 8.9  | 3.4       |          |
| 13  | `peter-thiel`       | 5,205 | 1,027  | 3      | 0.29% | 9.5  | 3.0       |          |
| 14  | `cillian-murphy`    | 4,833 | 1,687  | 7      | 0.41% | 11.2 | 2.9       |          |
| 15  | `casey-neistat`     | 4,519 | 1,325  | 5      | 0.38% | 11.0 | 2.7       |          |
| 16  | `clavicular`        | 4,954 | 2,085  | 10     | 0.48% | 12.6 | 2.1       |          |
| 17  | `zendaya`           | 6,981 | 3,452  | 18     | 0.52% | 9.0  | 2.1       | yes      |
| 18  | `natalie-portman`   | 4,834 | 848    | 3      | 0.35% | 10.5 | 2.0       |          |
| 19  | `ben-horowitz`      | 5,630 | 449    | 1      | 0.22% | 8.9  | 1.6       |          |
| 20  | `xqc`               | 4,566 | 414    | 1      | 0.24% | 7.5  | 1.4       |          |

82 over-ceiling pages carry live impressions. Total gap across those below baseline: roughly **187 clicks per 90 days**, against a corpus total of 940. The corpus is leaving about a fifth of its click volume on pages that got fat.

---

## How to work it

Do not start a length-cutting campaign. Work it through the refresh pipeline, which fixes the cause rather than the symptom:

```bash
./scripts/run-blog-pipeline.sh <Person-Name> --refresh
```

The batch pages come first, since they need a refresh anyway and the trim is free work attached to it. `ishowspeed` alone is a third of the total gap and it is already tasker NR-01.

For non-batch pages, the pass is a trim rather than a refresh: apply the doctrine's §1.2 cut list (duplicated quotes, type-theory over the 4-paragraph ceiling, chronological controversy lists, colour that does not carry the argument) and stop. No new research, no new sections.

## Worked example

`hasan-piker` was **8,881 words with its psychological argument starting at word 4,559**, having broken four rules its own creator spec enforces. Rebuilt around one spine on 2026-07-25 to 5,845, then trimmed under the ceiling. Full teardown in [NR-03](../taskers/news-refresh-2026-07/NR-03-hasan-piker.md) §7.

## Reproduce

```bash
# word counts (prose only, comments and tags stripped)
node -e 'const fs=require("fs"),p=require("path"),m=require("gray-matter");
for(const f of fs.readdirSync("src/blog/people/drafts").filter(x=>x.endsWith(".md"))){
  const g=m(fs.readFileSync(p.join("src/blog/people/drafts",f),"utf8")); if(g.data.published!==true)continue;
  const w=g.content.replace(/<!--[\s\S]*?-->/g,"").split(/\s+/).filter(Boolean).length;
  console.log(w, g.data.person||f);}'

# per-page gate
./scripts/blog-lint.sh <Person-Name>
```

Re-run after the next GSC pull to see whether trimmed pages moved. That is the only way to find out whether the correlation was causal, and it is worth knowing.
