<!-- docs/writing-system/05-blog-quality-check.md -->

# Blog Quality Check

_Last Updated: 2026-10-12_
_Purpose: Check any post in about 20 minutes and know whether it reads like a person wrote it and whether its facts hold._

Built from the Doja Cat rebuild (2026-10-11 and 10-12). That page passed every accuracy check and still read as machine-written. The checks below are the ones that found out why, in the order they were run.

To hand this to an agent: "Check `<post>` against `docs/writing-system/05-blog-quality-check.md`. Report what fails and where. Do not edit."

## The four passes

Run them in this order. Each one is cheaper than the next, and a page that fails an early pass is not worth reading closely yet.

| Pass           | What it catches                                          | Time    | How                        |
| -------------- | -------------------------------------------------------- | ------- | -------------------------- |
| 1. The numbers | Walls of text, buried quotes, a voice that sounds vetted | 1 min   | One command                |
| 2. The skim    | A reader who cannot find the point                       | 3 min   | Phone, headings only       |
| 3. The read    | Places where a reader slows down, skims or leaves        | 10 min  | Phone, top to bottom       |
| 4. The facts   | Quotes and claims that are wrong                         | 15 min+ | Spot-check against sources |

---

## Pass 1: The numbers

```bash
pnpm audit:readability -- src/blog/people/drafts/<Person>.md   # one post, with where to look
pnpm audit:readability                                          # every published post, worst first
pnpm audit:readability -- --people --top 50                     # people pages only
pnpm audit:readability -- --blogs                               # everything except people pages
pnpm audit:readability -- <file> --ref HEAD                     # the post as it was before your edit
```

Each line comes back `ok` or `LOOK`. `LOOK` means the post is an outlier against the 438 older people pages. It tells you where to look. It does not tell you the post is bad.

| Line on the card                | What the reader feels                          | The fix                                                                             |
| ------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------- |
| Typical paragraph               | Every paragraph is a chore                     | Cut paragraphs where the thought turns                                              |
| Long paragraphs (70+ words)     | Block after block                              | Keep a few solid ones; break the rest                                               |
| Short paragraphs (25 or fewer)  | No place to breathe                            | Give a sentence that already lands its own line                                     |
| One-sentence paragraphs         | Choppy, like a LinkedIn post                   | Merge neighbours that share one thought                                             |
| Longest paragraph               | One wall that stops the scroll                 | Split it, or turn its run of items into a list                                      |
| Long paragraphs in a row        | The "this is AI" feeling                       | Put a short line, a set-off quote or a list between them                            |
| Longest stretch with no break   | Screens of nothing but text                    | Add a heading, a set-off quote, a list or a clip inside it                          |
| Heaviest section                | A heading that stopped describing its section  | Split where the subject changes                                                     |
| Quotes given their own block    | The person's best lines are lost in paragraphs | One set-off quote per section                                                       |
| "This profile" and the like     | The page is talking about itself               | Say the thing; keep the phrase for where the page states its scope                  |
| Paragraphs ending on a negative | Everything ends on a disclaimer                | State each limit once, in a fixed place                                             |
| "Label: quote" intros           | Every quote arrives the same way               | Lead with the words, or fold the quote into the sentence                            |
| Em dashes outside quotes        | A known AI tell, used heavily                  | New pages use none; thin them on older ones                                         |
| Stock AI phrases                | "Delve", "pivotal", "at its core"              | Replace each. Full list in [`ai-detection-patterns.md`](./ai-detection-patterns.md) |

**What good looks like.** The older people pages have a typical paragraph of 41 words. About 14% of their paragraphs run 70 words or more and about 28% run 25 or fewer. The target is that mix: a short line, then a solid paragraph, then a quote. Uniformly short is as bad as uniformly long.

**What the command cannot see.** Whether a claim is true, whether the argument is good, and whether a heading matches what is under it. Those are passes 2 to 4.

The limits live in `scripts/lib/blogReadability.mjs`. Each sits near the 90th percentile of the older pages. Tighter limits flagged a third of the site and ranked nothing.

---

## Pass 2: The skim

Open the post on a phone. Read only the headings and the first line under each.

- [ ] **First screen.** Without scrolling, do I know who this is about and why it is worth my time?
- [ ] **The answer is early.** The question in the title is answered in plain words in the first quarter of the page.
- [ ] **The plain version comes first.** If the post weighs two readings, both are stated simply near the top. On Doja Cat the clearest statement of Nine against Six sat 3,300 words down, behind the words "Put plainly".
- [ ] **Headings tell the story.** Reading the headings alone, I can say what the post argues.
- [ ] **Each heading matches what is under it.** On Doja Cat the reason she is a Nine sat under "The case for Type 6".
- [ ] **The verdict has its own heading.** A skimmer can jump straight to why.
- [ ] **Something breaks the text every two screens:** a heading, a set-off quote, a list or a clip.

---

## Pass 3: The read

Read top to bottom on a phone. Mark every place you skim, re-read or get bored. Those marks are the edit list.

**Where it loses people**

- [ ] **Where did I first want to stop?** Find that sentence. On Doja Cat it was "The albums are not a clean case of going along." Three of the next four paragraphs told the reader what does not count.
- [ ] **No sentence needs a second read.** Real examples: "Nor is the quiet contentment." "A second test, of Nine against Seven, is dated."
- [ ] **Nothing is referred to before it is introduced,** or 2,000 words after. Real examples: "the habit" with no habit named; "There's a word for it," paid off two thousand words later.
- [ ] **No word means something else for this person.** "Her record" on a musician's page reads as an album.

**Whether it sounds like a person**

- [ ] **The page does not narrate itself.** "This profile does not count...", "the FAQ below gives...", "the first thing to check at the next revision".
- [ ] **It says what is true more often than what is not.** Count the paragraphs that end on "not", "cannot" or "does not".
- [ ] **It does not bring up evidence and then disown it.** If a scene is "texture, not evidence", it either earns its place as texture or goes.
- [ ] **The caveat is said once per place.** Three places are enough: the answer, the verdict section, the close. Dated facts are stated flatly.
- [ ] **No words from the research notes.** "Medium confidence", "a live rival", "separator", "discriminator", "the dated record".
- [ ] **Quotes do not all arrive the same way.** "Her downtime:", "Of performing:", "Her own rule:" in a row is a tic.
- [ ] **The same idea does not wear three names.** Pick one term and keep it.

**Whether it is worth reading**

- [ ] **The person's best lines have room.** The strongest quote in each section sits on its own line.
- [ ] **A fan learns something.** At least two details they would not get from the headlines.
- [ ] **The ending lands on a line or an image from the piece.** No summary, no call to action.

---

## Pass 4: The facts

A full source audit is a research job of hours. This pass is the spot-check that tells you whether one is needed.

**Red flags.** Each of these was on the old Doja Cat page, and each was wrong.

| Red flag                                        | What it looked like                                                    | What the source said                              |
| ----------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------- |
| A number that is too exact                      | "Mooo!" made "in 12 hours"                                             | Finished in a day; no source for twelve hours     |
| A quote that is too perfect                     | "Your fear is not my problem."                                         | In no source                                      |
| A quote with the wrong speaker                  | "pent-up feelings and anger", said to Jack Harlow                      | Said to Angie Martinez, about visuals and fashion |
| Two quotes glued into one                       | "Broadway act" and "costume monkey" as one line                        | Two separate posts                                |
| A quote moved in time                           | "I feel free" as her immediate reply                                   | Posted three weeks later                          |
| A superlative                                   | "first female rapper of her generation to write an entire album alone" | No source; the music is co-written                |
| A private claim stated as fact                  | "He abandoned us"                                                      | Not her words; her father disputes it             |
| A third party described doing what they did not | A fan "touching her without permission"                                | She hugged him twice and gave him a nickname      |
| An old remark presented as recent               | A 2023 line used as a comment on a 2025 album                          | Dated to its real year                            |

**The spot-check**

- [ ] **The five quotes the argument leans on hardest.** Find each in its source: word for word, right speaker, right date.
- [ ] **Every number, and every "first", "only" and "most".**
- [ ] **Family, health and accusations.** Both sides are given and attributed, and the argument does not rest on either.
- [ ] **Video quotes.** Play the clip at the timestamp. Captions drop words.
- [ ] **The FAQ and the description say what the body says.**

If two of the five quotes fail, stop and order a full audit before anything else.

**Extra checks for people pages**

- [ ] **The rival test.** Name the closest rival type. Is there one observation the rival cannot explain? If there is none, the page has to call its typing a lean.
- [ ] **It says what would change the read.**
- [ ] **Clips.** Three or four clips of the person in their own words, each beside the passage it supports.
- [ ] **After a type change:** every other post that names the old type, the portrait folder and the type lists.

---

## Fixing it without breaking it

Work in this order. Each step is safer than the one after it.

1. **Layout.** Cut paragraphs at their turns, set quotes off, turn runs into lists. No words change.
2. **Structure.** Add or rename headings, move the plain statement up, move passages whole.
3. **Sentences.** Fix the ones marked in pass 3.
4. **Cuts.** These remove content, so they are DJ's call.

Rules that kept the Doja Cat pass clean:

- **Cut, never retype.** Split paragraphs at marker strings with a script so the text cannot drift.
- **Promote sentences that already exist.** "She did not quit." was already there. Writing new one-line punchlines is its own AI tell.
- **Do not over-correct.** The first reshape had 42 one-sentence paragraphs out of 97. The version that shipped kept about one long paragraph in ten.
- **One set-off quote per section.** Two quotes need two blocks, or they run together on the page.
- **A list is for a run of parallel items.** Four albums, five things she said about fear. Prose stays prose.
- **Prove the quotes survived.** Compare the post word for word before and after, and match every quoted string. A layout pass should show a handful of punctuation changes and nothing else.
- **Run pass 1 again after any accuracy edit.** Fixing a claim adds a caveat, and caveats pile up in one paragraph. The 224-word paragraph on Doja Cat came from five accuracy fixes.
- **People pages are live from the database.** `node scripts/personBlogParser.js <Person>` previews the change and `--sync` pushes it. Never use `--publish` on a live page; it rewrites the dates.

### The independent read

Before a structural edit, get a reader who has not been told what you think is wrong. This brief found two problems bigger than the one that prompted it:

```
Read <file> cold, top to bottom, the way a fan on a phone would.
Diagnose only. Edit nothing. I am not telling you what I think is wrong.

1. Where would a reader stop?
2. Does any of it read as machine-written? Name what on the page causes it, and where.
3. Rank the problems by what they cost the reader, with the fix for each.
4. Rewrite the three worst passages. Quotations stay word for word.
5. What is working and should not be touched?
```

---

## Lessons learned

1. **Accurate and readable are separate checks.** The page that prompted this had every quote verified and still read as written by a committee.
2. **Measure against your own good pages.** "Paragraphs feel long" became "74 words against 41 across 438 pages", and that turned an opinion into a fix.
3. **Look for the cause above the page.** Six pages shared the problem because the writing spec asked for "readable pacing" and defined nothing. Fixing one page leaves the next one broken.
4. **Each safeguard adds weight.** Naming the source, the speaker and the date at every claim, plus a limit on every claim, is how honest writing turns into a wall.
5. **The fix for blocky is a mix.** Short line, solid paragraph, quote. All-short is the same problem in a different shape.
6. **Put the caveat in fixed places.** Said eleven times in the last third, a hedge stops reading as honesty and starts reading as nerves.
7. **Check the checker.** The first version of the command reported 74 pages with broken FAQ links. The links were fine; the check misread how the site builds them. Confirm a new flag against the real page before acting on it.
8. **Second readers find different things.** The measurements found the shape. The cold read found that the verdict was under the wrong heading. Neither found both.

---

## Worked example: Doja Cat

|                               | Before (2026-10-11) | After (2026-10-12) |
| ----------------------------- | ------------------- | ------------------ |
| Lines marked `LOOK`           | 10                  | 1                  |
| Typical paragraph             | 74 words            | 42 words           |
| Long paragraphs               | 59%                 | 11%                |
| Short paragraphs              | 4%                  | 30%                |
| Longest paragraph             | 223 words           | 80 words           |
| Longest stretch with no break | 833 words           | 340 words          |
| Quotes given their own block  | 0                   | 8                  |
| "This profile"                | 8                   | 4                  |
| Claims added or removed       |                     | 0                  |
| Quotations changed            |                     | 0                  |

The full record of both passes is in `docs/content-analysis/pipeline-logs/2026-10-11_Doja-Cat-quote-corrections/README.md`.

## Related

- [`ai-detection-patterns.md`](./ai-detection-patterns.md): the vocabulary and structure tells in full.
- [`people-profile-standard.md`](./people-profile-standard.md): the spec people pages are built against. It does not yet define page shape.
- [`03-mcphee-editing-method.md`](./03-mcphee-editing-method.md): the structural editing method.
