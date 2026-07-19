<!-- docs/content-analysis/2026-07-18_people-corpus-pilot.md -->

# People corpus pilot findings

## Dua Lipa

Status: editorial refresh complete locally; live sync deliberately deferred until the hardened database migration is reviewed and applied.

This first packet is partly retrospective because the Dua Lipa rewrite began before the T-14 packet format was finalized. The live row still contains the pre-edit article, so its diagnostic readings remain reproducible. Future pilot packets must be saved before editing.

### Pre-edit diagnostic packet

- Live row: ID `655`, published `true`, `lastmod` `2026-04-15`.
- Live content MD5: `0a8ec2357df12ef8b22367dc24ffd347`.
- Live parser-managed metadata MD5: `f99e23c24d2922bb23147b3ad9faf870`.
- Live prose: 3,195 words, 62 raw em dashes, 57 prose em dashes, 17.84 prose em dashes per 1,000 words.
- Local draft: `src/blog/people/drafts/Dua-Lipa.md`.
- GSC, case-normalized from the 2026-07-06 export: 6 clicks and 2,802 impressions.
- Live grade: pre-v2 B+ at 8.7. This was treated as uncalibrated.
- Pre-sync parity: intentionally false after editing. Live content and metadata still represent the old article; local and live `lastmod` still match byte for byte.

### Diagnosis and lane

Lane: **C, developmental edit**.

The old article had a person-specific core worth preserving: Dua Lipa responds to setbacks by constructing systems and measurable goals. It also had a useful Service95 thread. A line edit would have hidden larger weaknesses:

- The childhood choir scene and Stephen Kozmeniuk epigraph could not be traced to a credible source.
- Several rankings and superlatives were unsupported.
- The thesis treated optimization as uniformly successful and did not test the pattern where it might fail.
- The evidence and factual frame stopped before her 2025 Kosovo citizenship, 2026 literary work, and 2026 marriage.
- The prose carried 57 non-attribution em dashes even though punctuation was not the primary defect.

Material preserved: the planning/achievement thesis, the stage-criticism turning point, Service95 as more than a side brand, and the Type 3 reading. Structure, evidence, currentness, search packaging, and the ending were rebuilt around those strengths.

### Post-edit checks

- Local parsed content MD5: `baa57391a997108d44d33a05eb71f52c`.
- `blog-lint.sh`: 0 failures, 1 inherited workflow-state warning (`published: true` while `production_pretext.status: draft`).
- Raw and prose em dashes: 0.
- Strong and comparative contrast pairs: 0.
- Search head term: pass.
- Extractable answer block: pass, 51 words.
- Source audit: 5 inline, 0 vague, 0 untagged load-bearing quotations.
- Same-type similarity: clear; maximum 0.039 against a 0.04 trip threshold.
- FAQ anchors: all five resolve to visible headings.
- JSON-LD/parser check: 15 citations and 5 FAQs parse; `nationality` now parses as text rather than silently normalizing to `null`.
- Final local grade: B+ at 8.6, rubric v2; discoverability 9; no caps.
- Reviewer verdict: clearly better.

The detailed evidence chain is in `docs/content-research/dua-lipa-evidence-log.md`. The calibrated grade notes are in `docs/content-analysis/grades/Dua-Lipa.review.md`.

### Explicit proposed live diff

The hardened dry run lists these fields for approval:

`title`, `meta_title`, `persona_title`, `description`, `content`, `content_quality`, `keywords`, `same_as`, `faqs`, `nationality`, `occupation`, `knows_about`, and `citations`.

The SEO-facing title and meta title changes are therefore visible review items, not incidental prose changes. The dry run proves that `date`, `loc`, `lastmod`, `published`, `enneagram`, `type`, and `person` are protected by code.

### Adjacent stale-page issue

`src/blog/people/drafts/Callum-Turner.md` still says Callum Turner and Dua Lipa were engaged in June 2025. The Dua evidence log records the Associated Press confirmation that they married in London in May 2026. This should be corrected when Callum Turner's page receives its own parity check and diagnostic pass; it should not be silently folded into Dua's update.

## Jordi Hays

Status: pre-edit diagnostic packet saved before the local draft is changed.

### Pre-edit diagnostic packet

- Live row: ID `907`, published `true`, `lastmod` `2026-03-21`.
- Live and local content MD5: `0403ff21ddb1ba2c8484989ed9fb086d`.
- Live and local effective parser-managed metadata MD5: `47a88e49b8257b679187c188022ec805`.
- Live prose: 5,084 words, 69 raw em dashes, 62 prose em dashes, 12.2 prose em dashes per 1,000 words.
- Local draft: `src/blog/people/drafts/Jordi-Hays.md`.
- GSC, case-normalized from the 2026-07-06 export: 52 clicks and 2,566 impressions.
- Leading queries: `jordi hays` (17 clicks, 677 impressions), `jordi hays age` (2 clicks, 224 impressions), and `jordi hays wife` (2 clicks, 79 impressions). Parents, biography, and Wikipedia queries also appear.
- Live grade: pre-v2 A- at 9.0. This is uncalibrated and contradicted by the deterministic checks.
- Pre-edit parity: exact for content, effective metadata, and `lastmod`.

### Diagnosis and lane

Lane: **D, full rebuild**.

The old article has a useful person-specific tension: Jordi Hays makes an unserious-looking show through an unusually serious daily process. Its strongest evidence is the observed New York Times studio scene and Hays's direct Dialectic interview about preparation, taste, focus, and daily compounding. A line edit would preserve too much unsupported interpretation:

- Eight of nine load-bearing quotations are untagged, and no quotation has a clean inline source according to the source audit.
- The search head term fails. The early answer block is only 14 words and does not answer the personality query.
- Same-type similarity trips at 0.108, including a reused "learn early" argument also found in the Alex Warren article.
- The article uses ten strong contrast engines and repeatedly substitutes a house formula for evidence.
- It invents childhood, household, Shanghai, marriage, and family motives that the available sources do not establish.
- It presents a 3w4 social-subtype diagnosis with more certainty than public evidence supports.
- It treats a reported acquisition price as settled even though OpenAI and Axios said the terms were undisclosed.
- At more than 5,000 words, the career catalog repeats the same achievement claim without increasing explanatory depth.

Material to preserve: the red-flag studio scene, the six-hour preparation schedule, daily postmortems, Hays's newspaper and TechCrunch habit, the J Man skateboard story, his advice to borrow ideas from outside technology, Capital's media-and-financial-services thesis, the decision to keep media as the main thing, and the tension created when OpenAI acquired an independently branded show.

The rebuild should answer the actual search query early, shorten the biography, distinguish sourced behavior from interpretation, treat Sarah Chase as a cofounder rather than psychological evidence, disclose the conflict in the sponsored Not Boring profile, and make promised editorial independence after the OpenAI acquisition the live test of the article's thesis.

### Post-edit checks

- Local parsed content MD5: `313b420c4f8f1bf75a4dd63f8b1420c5`.
- Local effective parser-managed metadata MD5: `78cad5604ecdd4a9006b216ad12b81d1`.
- Parsed content length: 18,259 characters, down from 33,134 live characters.
- Visible-body word count: 2,775, down from 5,084 live words.
- `blog-lint.sh`: 0 failures and 1 inherited workflow-state warning (`published: true` while `production_pretext.status: draft`).
- Raw and prose em dashes: 0.
- Strong and comparative contrast pairs: 0.
- Search head term: pass.
- Extractable answer block: pass, 46 words.
- Source audit: 2 inline, 0 vague, 0 untagged load-bearing quotations.
- Same-type similarity: clear; maximum 0.038 against a 0.04 trip threshold.
- FAQ anchors: all five match visible headings under the repository's heading-slug audit.
- SEO audit: title pattern, Type 3 pillar link, FAQ, and internal-link issues cleared. The only remaining item is a missing `wikidata_qid`; none was invented.
- Final local grade: B+ at 8.5, rubric v2; discoverability 9; Enneagram integration held at 8 because the available record does not expose enough private emotional vocabulary to justify invented interior.
- First grade and cold regrade both landed at 8.5.
- Reviewer verdict: clearly better.

The detailed evidence chain is in `docs/content-research/jordi-hays-evidence-log.md`. The calibrated grade notes are in `docs/content-analysis/grades/Jordi-Hays.review.md`.

### Explicit proposed live diff

The hardened dry run lists these fields for approval:

`title`, `meta_title`, `persona_title`, `description`, `content`, `content_quality`, `keywords`, `same_as`, `faqs`, `occupation`, `knows_about`, and `citations`.

The live row remains unchanged at content MD5 `0403ff21ddb1ba2c8484989ed9fb086d`. The final local title is `Jordi Hays: The Type 3 Scoreboard Behind TBPN`; the final meta title is `Jordi Hays Personality Type: Enneagram Type 3`. The read-only preview again confirmed that `date`, `loc`, `lastmod`, `published`, `enneagram`, `type`, and `person` are protected. No production write was attempted.
