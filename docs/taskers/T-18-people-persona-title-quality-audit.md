<!-- docs/taskers/T-18-people-persona-title-quality-audit.md -->

# Tasker: Reassess the 27 People-Wall Persona Titles

**For:** the agent assigned to audit and improve the persona titles used in the reactivation people wall.
**Owner:** DJ
**Created:** 2026-08-03
**Status:** Complete. Audit delivered, approved, and implemented on 2026-08-03. Local consistency reverified on 2026-08-04.
**Related:** `src/lib/data/people-wall.json`, `src/blog/people/drafts/`, `static/email/reactivation/people-wall-v1.jpg`

---

## 0. What and why

9takes is using a 27-person visual in its reactivation email. It presents three public figures for each Enneagram type. Each card shows the person's name and a short `persona_title` drawn from that person's analysis.

Reading all 27 titles together exposed an uneven quality bar. Several titles are memorable, specific, and immediately legible. Others sound awkward, generic, over-written, confusing, or too narrowly tied to one platform. The goal is not to rewrite every title for novelty. The goal is to determine which titles genuinely capture the psychological thesis of their article and which ones need to be reworked.

This task is an editorial audit and recommendation pass. Do not change source files, database rows, generated images, or production copy until DJ reviews and approves the proposed final set.

## 1. DJ's notes from the visual review

Preserve these reactions as direct editorial input:

- **Jordan Peterson, "Psychology's Weeping Crusader"** does not sound right.
- **Margot Robbie, "The Star Who Finds You Through Your Need"** does not sound right.
- **Oprah Winfrey, "Television's Patron Saint of Pain"** is an amazing title. Use it as a quality benchmark.
- **Dua Lipa, "Pop's Precision Optimist"** does not sound right.
- **Robert Pattinson, "Hollywood's Disappearing Act"** is kind of okay, but it might need to be improved.
- **Cillian Murphy, "Cinema's Invisible Vessel"** does not sound great.
- **Zendaya, "Hollywood's Weaponized Worrier"** is confusing. DJ referred to it as "Weaponized Warrior" while reading it, which is itself evidence that the title does not land cleanly.
- **Kai Cenat, "Twitch's Perpetual Motion Machine"** is directionally okay, but Kai is bigger than Twitch. A broader streaming idea, such as "Streaming's Perpetual Motion Machine," may fit better. Do not accept that wording automatically. Reassess it from the article.
- **Selena Gomez, "Pop's Steady Presence"** does not fully land.

DJ wants all 27 titles held to a high standard, not only the titles listed above. Audit the other 19 so weak titles are not missed.

## 2. Assignment boundaries

### This task includes

1. Reading all 27 people articles closely enough to identify each article's central psychological thesis.
2. Evaluating each existing persona title in the context of the complete 27-title set.
3. Classifying every title as **Keep**, **Rework**, or **Replace**.
4. Explaining the verdict with article-specific evidence.
5. Proposing strong alternatives for every title marked Rework or Replace.
6. Recommending one final title for each of the 27 people, including unchanged titles.

### This task does not include

- Editing any `persona_title` frontmatter.
- Editing `src/lib/data/people-wall.json`.
- Updating Supabase or any live database row.
- Regenerating the email image.
- Changing `lastmod`, slugs, Enneagram types, article titles, or article prose.
- Treating a catchy phrase as sufficient when it is not supported by the article.

## 3. Required reading

Read these first:

1. `src/lib/data/people-wall.json` for the exact roster and current people-wall titles.
2. `static/email/reactivation/people-wall-v1.jpg` to understand how the titles read together and the limited card space.
3. Every people article listed in the roster below. Read the full article, not only its frontmatter or opening.
4. `docs/taskers/README.md` for repository-wide task rules.

If local article content and the live database row differ, report the drift. Do not reconcile or overwrite either source during this task.

## 4. Full audit roster

| Type | Person            | Current persona title                      | Source article                                | Initial review signal                           |
| ---: | ----------------- | ------------------------------------------ | --------------------------------------------- | ----------------------------------------------- |
|    1 | Emma Watson       | Hollywood's Conscientious Objector         | `src/blog/people/drafts/Emma-Watson.md`       | Open audit                                      |
|    1 | Steve Jobs        | Silicon Valley's Restless Perfectionist    | `src/blog/people/drafts/Steve-Jobs.md`        | Open audit                                      |
|    1 | Jordan Peterson   | Psychology's Weeping Crusader              | `src/blog/people/drafts/Jordan-Peterson.md`   | DJ says it does not sound right                 |
|    2 | Margot Robbie     | The Star Who Finds You Through Your Need   | `src/blog/people/drafts/Margot-Robbie.md`     | DJ says it does not sound right                 |
|    2 | Oprah Winfrey     | Television's Patron Saint of Pain          | `src/blog/people/drafts/Oprah-Winfrey.md`     | Quality benchmark; DJ strongly likes it         |
|    2 | Meghan Markle     | The Calligrapher Who Burned the Palace     | `src/blog/people/drafts/Meghan-Markle.md`     | Open audit                                      |
|    3 | Sabrina Carpenter | Pop's Winking Machine                      | `src/blog/people/drafts/Sabrina-Carpenter.md` | Open audit                                      |
|    3 | Taylor Swift      | Pop's Strategic Alchemist                  | `src/blog/people/drafts/Taylor-Swift.md`      | Open audit                                      |
|    3 | Dua Lipa          | Pop's Precision Optimist                   | `src/blog/people/drafts/Dua-Lipa.md`          | DJ says it does not sound right                 |
|    4 | Billie Eilish     | Gen Z's Beautiful Wound                    | `src/blog/people/drafts/Billie-Eilish.md`     | Open audit                                      |
|    4 | Robert Pattinson  | Hollywood's Disappearing Act               | `src/blog/people/drafts/Robert-Pattinson.md`  | Directionally okay; may need improvement        |
|    4 | Sam Altman        | AI's Existential Architect                 | `src/blog/people/drafts/Sam-Altman.md`        | Open audit                                      |
|    5 | Elon Musk         | Technology's Apocalyptic Engineer          | `src/blog/people/drafts/Elon-Musk.md`         | Open audit                                      |
|    5 | Cillian Murphy    | Cinema's Invisible Vessel                  | `src/blog/people/drafts/Cillian-Murphy.md`    | DJ says it does not sound great                 |
|    5 | Robert Greene     | Power's Cold Cartographer                  | `src/blog/people/drafts/Robert-Greene.md`     | Open audit                                      |
|    6 | Zendaya           | Hollywood's Weaponized Worrier             | `src/blog/people/drafts/Zendaya.md`           | DJ finds it confusing                           |
|    6 | Timothée Chalamet | The Prodigy Who Needs Protecting           | `src/blog/people/drafts/Timothee-Chalamet.md` | Open audit                                      |
|    6 | Marilyn Monroe    | Hollywood's Armored Icon                   | `src/blog/people/drafts/Marilyn-Monroe.md`    | Open audit                                      |
|    7 | Jack Black        | Comedy's Boundless Showman                 | `src/blog/people/drafts/Jack-Black.md`        | Open audit                                      |
|    7 | Kai Cenat         | Twitch's Perpetual Motion Machine          | `src/blog/people/drafts/Kai-Cenat.md`         | Good core image; platform framing is too narrow |
|    7 | John F. Kennedy   | Camelot's Graceful Fugitive                | `src/blog/people/drafts/John-F-Kennedy.md`    | Open audit                                      |
|    8 | IShowSpeed        | Streaming's Homesick Warlord               | `src/blog/people/drafts/IShowSpeed.md`        | Open audit                                      |
|    8 | MrBeast           | The Algorithm Monk Who Can't Stop Building | `src/blog/people/drafts/Mr-Beast.md`          | Open audit                                      |
|    8 | Joe Rogan         | Podcasting's Alpha Interrogator            | `src/blog/people/drafts/Joe-Rogan.md`         | Open audit                                      |
|    9 | Lionel Messi      | Football's Quiet Volcano                   | `src/blog/people/drafts/Lionel-Messi.md`      | Open audit                                      |
|    9 | Ryan Gosling      | Hollywood's Gentle Vanishing Man           | `src/blog/people/drafts/Ryan-Gosling.md`      | Open audit                                      |
|    9 | Selena Gomez      | Pop's Steady Presence                      | `src/blog/people/drafts/Selena-Gomez.md`      | DJ says it does not fully land                  |

## 5. The quality standard

A high-quality persona title should pass all of these tests:

### 5.1 The aloud test

Read it as one phrase:

> Person's name: Persona title

It should sound natural, intentional, and memorable. If the phrase becomes awkward or requires explanation, it fails.

### 5.2 The article-thesis test

The title should express the central tension, strategy, contradiction, hunger, defense, or emotional pattern demonstrated by the article. It should not merely name the person's job, reputation, Enneagram archetype, or most famous platform.

### 5.3 The specificity test

The title should feel difficult to transfer to another person. If it could describe ten celebrities with no changes, it is too generic.

### 5.4 The legibility test

The reader should understand the image or tension on first read. Clever wording that causes a misread, as with "Weaponized Worrier" becoming "Weaponized Warrior," needs revision.

### 5.5 The range test

The title should represent the person's larger public identity and the article's full arc. Avoid platform lock-in unless the platform is inseparable from the thesis. Kai Cenat should not be reduced to Twitch if the stronger identity is streaming or live entertainment.

### 5.6 The tone test

The title can be provocative, but it should not feel diagnostically certain, needlessly cruel, worshipful, generic, or like an AI-generated bundle of dramatic nouns.

### 5.7 The visual test

Target roughly 3 to 7 words and preferably no more than 42 characters. Quality is more important than an arbitrary count, but the title must remain readable inside a compact three-column card.

## 6. Evaluation rubric

Score each existing title from 1 to 5 on:

| Dimension          | Question                                                               |
| ------------------ | ---------------------------------------------------------------------- |
| Article fidelity   | Does it capture the article's actual thesis and evidence?              |
| Person specificity | Could this title plausibly belong only to this person?                 |
| Natural phrasing   | Does it sound good immediately after the person's name?                |
| Memorability       | Does it create a strong, useful mental image?                          |
| Clarity            | Is the meaning legible without explanation or accidental misreading?   |
| Range              | Does it represent the whole person rather than one platform or moment? |
| Visual fit         | Will it remain readable in the people-wall card?                       |

Do not decide by average score alone. A title with a serious fidelity or clarity failure should not receive a Keep verdict because its other dimensions are strong.

## 7. Work steps

### Step 1: Establish the benchmark set

Start with Oprah Winfrey's "Television's Patron Saint of Pain." Explain why it works in relation to her article. Then identify three to five other current titles that approach the same standard. This defines the bar before weak titles are rewritten.

### Step 2: Extract each article's thesis

For every person, write one sentence answering:

> What is the most specific psychological tension or operating strategy this article demonstrates?

Support the sentence with two or three concrete moments from the article. Avoid generic Enneagram summaries.

### Step 3: Audit the existing title

Score it with the rubric and assign one verdict:

- **Keep:** already strong, accurate, natural, and competitive with the benchmark.
- **Rework:** contains a strong core image or direction but needs sharper wording, broader framing, or cleaner phrasing.
- **Replace:** built on the wrong idea, too generic, confusing, unsupported, or materially weaker than the article.

### Step 4: Generate alternatives

For every Rework or Replace title:

1. Produce at least three serious candidates.
2. For the nine titles in DJ's notes, produce five candidates if the article supports enough distinct directions.
3. Explain the central image and article evidence behind each candidate.
4. Select one recommended winner.
5. Read the winner aloud with the person's name and test it against the other 26 titles.

Do not create alternatives by swapping one dramatic adjective for another. Explore distinct article-grounded concepts before polishing the words.

### Step 5: Audit the set as a set

Review all 27 recommended titles together. Flag:

- repeated structures such as too many "Industry's Adjective Noun" constructions
- repeated nouns such as architect, machine, icon, wound, warrior, or alchemist
- titles that are much more dramatic or much flatter than their neighbors
- industry labels that unnecessarily narrow the person
- titles that accidentally sound mocking, diagnostic, or confusing

The collection should feel authored by one sharp editor without feeling formulaic.

## 8. Required deliverable

Create:

`docs/content-analysis/2026-08-03_people-persona-title-audit.md`

The report must contain:

1. A short explanation of the benchmark and what makes a persona title work.
2. A 27-row decision table with:
   - person
   - current title
   - article thesis
   - verdict: Keep, Rework, or Replace
   - concise reason
   - recommended final title
3. A detailed section for every Rework or Replace verdict with evidence and alternatives.
4. A final 27-title list in people-wall order.
5. A short change list containing only the titles that differ from the current source.
6. A section titled `Questions for DJ` for any choice that cannot be resolved from the article alone.

The report should make it easy for DJ to approve titles individually rather than accepting the set as one irreversible batch.

## 9. Approval and implementation gate

Stop after delivering the audit. Do not implement title changes without DJ's explicit approval.

After approval, a separate implementation pass will need to update the approved titles in all applicable sources, including:

1. Each approved article's `persona_title` frontmatter.
2. `src/lib/data/people-wall.json`.
3. The corresponding live database fields through the approved existing-row workflow.
4. The generated people-wall email image via `node scripts/generate-people-wall-email.mjs`.

That later implementation must preserve `lastmod`, article prose, slugs, types, and all unrelated metadata unless DJ separately approves changes.

## 10. Verification checklist

- [x] All 27 full articles were read.
- [x] Every current title received a rubric score and verdict.
- [x] DJ's nine notes were addressed explicitly.
- [x] Oprah's title was used as a benchmark, not rewritten reflexively.
- [x] Every Rework or Replace verdict includes article-specific evidence.
- [x] Every Rework or Replace verdict includes at least three alternatives.
- [x] Every title explicitly flagged by DJ includes up to five alternatives where the article supports them.
- [x] Recommended titles pass the aloud, specificity, clarity, range, and visual tests.
- [x] The final set was reviewed for repeated structures and uneven tone.
- [x] No source, database, image, or `lastmod` changes were made during the audit phase.
- [x] The tasker and report contain zero em-dash characters.

Useful verification commands:

```bash
rg -n "^persona_title:" src/blog/people/drafts/{Emma-Watson,Steve-Jobs,Jordan-Peterson,Margot-Robbie,Oprah-Winfrey,Meghan-Markle,Sabrina-Carpenter,Taylor-Swift,Dua-Lipa,Billie-Eilish,Robert-Pattinson,Sam-Altman,Elon-Musk,Cillian-Murphy,Robert-Greene,Zendaya,Timothee-Chalamet,Marilyn-Monroe,Jack-Black,Kai-Cenat,John-F-Kennedy,IShowSpeed,Mr-Beast,Joe-Rogan,Lionel-Messi,Ryan-Gosling,Selena-Gomez}.md
rg -n '\x{2014}' docs/taskers/T-18-people-persona-title-quality-audit.md docs/content-analysis/2026-08-03_people-persona-title-audit.md
git diff -- src/blog/people/drafts src/lib/data/people-wall.json static/email/reactivation/people-wall-v1.jpg
```

The final `git diff` should be empty for the analysis phase.

## 11. Risks and gotchas

- **Do not title from fame alone.** The persona title belongs to the article's thesis, not a generic public biography.
- **Do not title from type alone.** "Perfectionist," "Helper," "Achiever," and the other type labels are already visible elsewhere.
- **Do not confuse intensity with quality.** A dramatic phrase can still be vague or unsupported.
- **Do not overfit to the visual.** Compactness matters, but a shorter weak title is not better than a slightly longer precise one.
- **Do not preserve a title merely because it already exists.** Existing frontmatter is the object under review, not an authority.
- **Do not rewrite strong titles for symmetry.** Variation is healthy when it reflects the person.
- **Do not change article claims to justify a preferred title.** The title must follow the evidence, not the other way around.
- **Other agents and DJ edit this repository in parallel.** Never stash, reset, or overwrite unrelated work.

## 12. Definition of done

The analysis report exists at the required path, all 27 titles have evidence-based verdicts, DJ's notes are preserved and answered, weak titles have multiple strong alternatives, the recommended final set reads well together, and no source or production changes were made.

## 13. What was actually done

The completed audit is recorded in `docs/content-analysis/2026-08-03_people-persona-title-audit.md`. It contains the 27-row decision table, article-specific evidence, alternatives for every Rework and Replace verdict, the final ordered set, the change-only list, and DJ's resolved questions.

DJ approved the report's 15 recommended title changes. The follow-up implementation updated article frontmatter, `src/lib/data/people-wall.json`, the corresponding live database fields, generated `src/lib/components/molecules/famousTypes.ts`, and regenerated `static/email/reactivation/people-wall-v1.jpg`. The report records the implementation details and preservation checks.

On 2026-08-04, a fresh local consistency check confirmed that all 27 article titles match the wall JSON and generated famous-types data. The image is 1400 by 1980 pixels, the report still contains all 27 decision rows and all 15 detailed Rework or Replace sections, and both the tasker and report contain zero em-dash characters.
