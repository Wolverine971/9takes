# Doja Cat: live-page quote corrections (2026-10-11)

DJ asked for Doja Cat to be retyped from 7 to 9 and her page rebuilt, with the quotes fixed. The rebuild run (`2026-10-11_18-12-25-028_Doja-Cat`) held at verify with `insufficient_evidence`: Enneagram 7.2 against a bar of 8, overall 8.1 against 8.5. The jury and verifier agreed Type 7 is the weakest read and found no sourced discriminator between Type 9 and Type 6. Her live type therefore stays 7 until DJ decides.

This pass fixed the misquotes on the live Type 7 page in the meantime. It did not touch the type, the thesis, the structure or the title. It was live for about an hour before the owner override below replaced the page.

- Base text: the committed draft, which matched the live row byte for byte (`content` hash `2d804b9032e3ca7382e1730de928d161`, 28,057 characters).
- 22 exact single-occurrence replacements. The parser preview showed changes to `content` and `faqs` only.
- Pushed with `personBlogParser.js Doja-Cat --sync --skip-perspective-gate`. The live row never had a perspective review. Verified in the database afterwards: 28,903 characters, `enneagram` 7, `lastmod` 2026-01-23 (unchanged).
- The held Type 9 draft is preserved in the run directory as `candidate-edit.md` (and `edit.md`). The working draft file now mirrors the live Type 7 page again.
- Source IDs resolve in `2026-10-11_18-12-25-028_Doja-Cat/evidence-edit.json`, except FN and CXSELF23, which are in the source ledger of `docs/content-analysis/research/Doja-Cat.md`.

## Outcome: owner override to Type 9 (same evening)

A second research pass found no Nine-versus-Six separator (tied, tilting Six; recorded in `docs/content-analysis/research/Doja-Cat.md`). DJ was offered three options (test Type 6, publish the held Nine page, stay at 7) with Type 6 recommended, and chose to publish the Nine page.

- Type flip: direct service-role update of `blogs_famous_people.enneagram` from `7` to `9` for `doja-cat`, guarded on the old value. `lastmod` stayed 2026-01-23.
- Article: the held `candidate-edit.md` from run `2026-10-11_18-12-25-028_Doja-Cat`, with five exact single-match edits answering the verifier's findings:
  1. verify-05: the description no longer offers "agrees first, objects late" as the reason for the lean.
  2. verify-06: the Auckland post is printed to the end of its sentence.
  3. verify-01: the "what she asks for" paragraph now calls itself a lean and not a separator, quotes the November 2021 line in full, says Asrat and Lewis work for her and what each was describing, names the January 2021 fear tweet as the exception, concedes that an exhausted Six asks for rest too, and adds her undated "I need tarot cards. I need an answer. Text me" habit.
  4. verify-04: "the yes itself" is dropped from what the lean rests on, because her own account covers the going along.
  5. verify-03: the closing quote now says she was explaining why she dresses plainly offstage.
- Pushed with `personBlogParser.js Doja-Cat --sync --skip-perspective-gate`. The run has no `release.json`; the gate was skipped on the owner's instruction. Frontmatter keeps the run's honest scores (`overall: 8.1`, `enneagram: 7.2`, `needs_review: true`).
- Verified in the database: `enneagram` 9, 25,095 characters, four YouTube embeds, `date` and `lastmod` unchanged. Verified on the public page after revalidation: new title, four players, portrait URL `/types/9s/Doja-Cat.webp`.
- Portrait: `git mv` of `Doja-Cat.webp` and `s-Doja-Cat.webp` from `static/types/7s/` to `static/types/9s/` (staged, not committed). Until that deploys, the running build redirects the 9s URL to the 7s file (308).
- Regenerated `famousTypes.ts` and the similarity snapshot. Updated the musicians post (Type 9 sentence) and the unpublished pop-queens draft.
- Not done: nobody has listened to the quoted video lines by ear or played the four embeds in a browser. Offsets and wording rest on captions plus a whisper re-transcription of each clip segment.

## Readability pass (2026-10-12)

DJ read the deployed page and said the paragraphs were blocky and read as machine-written. Measured against every published people page, he was right, and the cause is the v3 pipeline, not this page:

| | Median paragraph | Paragraphs of 70+ words | Paragraphs of 25 words or fewer | One-sentence paragraphs | Pages with a set-off quote |
| --- | --- | --- | --- | --- | --- |
| 438 pre-v3 pages | 41 words | 14% | 28% | 16 | 433 of 444 overall |
| 6 published v3 pages | 89 words | 73% | 1% | 0 | 0 |
| Doja Cat before | 74 words | 59% | 4% | 1 | 0 |
| Doja Cat after | 42 words | 11% | 30% | 23 | 8 quote blocks |

`people-profile-standard.md` asks for "readable pacing" and defines nothing; no stage checks page shape. An independent cold read (editor agent, diagnose depth, not told the complaint) found the same thing and ranked two problems above it: the reason for the Nine lean sat in a 223-word paragraph under the Type 6 heading, and the plain statement of Nine against Six arrived 3,300 words in.

What changed. No claim was added or removed, and every quotation of hers is intact (checked by pairing every quoted string before and after; the only two dropped are the back-reference tags "I'm fine," and "condition").

- Layout: long paragraphs cut at their turns, eight quotes set off as blockquotes, four runs turned into lists (albums, fear statements, Nine against Six, what would move the read).
- Two new H2s: `Why Type 9 stays ahead` (was the middle of the Type 6 section) and `Her own account` (the March 2026 statement, with the "condition" paragraph moved in from the fights section so it sits beside what it is paired with). The sentence saying she has not publicly joined the two statements is kept.
- The "Put plainly" Nine-against-Six pair moved up into the type-answer section.
- The three things that do not separate the two types are now three parallel paragraphs. "which is not borrowed certainty" became "so the yes did not come from doubting her own judgment."
- Type answer and first FAQ: "record" became "public record" (for a musician, "record" reads as an album); "medium confidence, with Type 6 a live rival" became "only narrowly, with Type 6 close behind."
- Self-reference trimmed: "this profile" from eight uses to four. Removed "The limits belong on the page." and "The argument does not depend on it."
- Small sentence fixes: "the habit", "interviewing her for Interview", "Nor is the quiet contentment.", "the next type", the three-years-off test.

Reviewer suggestions not taken, because they remove content and are DJ's call: cut the fever scene, cut the father paragraph from the body (the FAQ covers it, but its anchor points at that section), cut the Three and Four sentence. The Chalamet passage stayed in the fights section: it is the recorded counterexample to the two-kinds rule.

Pushed with `personBlogParser.js Doja-Cat --sync --skip-perspective-gate`; the preview showed `content` and `faqs` only. Verified in the database (25,174 characters, 4 embeds, 8 quote blocks, `enneagram` 9, `date` and `lastmod` unchanged) and on the public page after revalidation, at desktop width. Phone width was not checked in a browser. The evidence sidecar's passages no longer match the page word for word; a future refresh run rebuilds them.

## Reorientation to the owner's thesis (2026-10-12)

DJ read the reshaped page and asked for the framing to change: commit to Type 9 in the answer, lead with the instinctual triad and anger, make a case for her, loosen the voice, and show the fan video the page opens on. His notes are recorded in `docs/content-analysis/research/Doja-Cat.md`.

- Opening: the "half the internet keeps" paragraphs rewritten in plainer sentences. "Days later" became "A week later" (the fan video is dated June 6 by its TikTok ID; her posts were June 13).
- Type section rewritten to his thesis. The hedge ("only narrowly, with Type 6 close behind"), the Type 6 definition and the Nine-against-Six bullets left this section.
- Five quotations added, each re-opened in its source the same day: Dazed 2018 (dance crew), Rolling Stone 2021 (doodle and dance), Harper's Bazaar August 2023 (pent-up anger), V Magazine July 2023 (thrown fits), Angie Martinez October 2025 (bratty teenager, protector, defense system). The Elle UK "mask" quote now includes its first sentence, which says what "those things" are.
- A fifth YouTube clip: Angie Martinez at 19:38 to 21:09.
- "The case for Type 6, in her own words" and "Why Type 9 stays ahead" became one section, "Why not Type 6?". Her fear statements all remain. Removed: the three-paragraph "does not separate the two types" passage (its concession survives as one sentence), "Weigh her 2025 and 2026 first-person testimony most heavily and you land on Six," and the Three and Four sentence in the last section.
- "Her own account": the sentences saying the swing and the yes "cannot be counted" toward type were replaced with "A type describes a pattern. It does not say where the pattern comes from, and her account is about where."
- Description, first FAQ and the end of the Type 7 FAQ now state Type 9 without the Six qualifier. Three citations added.
- The musicians post no longer says "narrow."

This raises the page's stated confidence above what the jury supported (Enneagram 7.2). That is the owner's call on his own byline; the frontmatter scores are unchanged. Body is about 4,160 words, above the 3,200 to 3,900 band and under the 4,500 limit.

The fan video is not live yet. The site's content-security policy allowed YouTube, Vimeo and Spotify frames only. `svelte.config.js` now allows `https://www.tiktok.com` and `src/scss/blog.scss` has a phone-shaped frame (`.iframe-container--vertical`); both need a deploy. The embed sits in the draft inside an HTML comment, which the parser strips, so the live page shows a text link to the video until then. After the deploy: remove the two comment lines and sync.

Pushed with `--sync --skip-perspective-gate` (fields: description, content, faqs, citations). Verified in the database (27,518 characters, 5 YouTube embeds, no TikTok player, `enneagram` 9, dates unchanged) and on the public page after revalidation.

## Corrections (to the old Type 7 page)

| # | Where | Problem | Fix | Source |
| --- | --- | --- | --- | --- |
| 1 | Type FAQ | "Mooo!" made "in 12 hours" has no source | "in a single day" | S-BB21 (song and video finished that day), S-DAZED18 ("written in about five hours") |
| 2 | Type FAQ | "the solo-written Vie" is wrong; the music is co-written | "Vie" | S-WIKIVIE (all lyrics credited to her; music co-written) |
| 3 | Kittenz FAQ | "creepy as fuck" is in no source; "I feel free" presented as an immediate reply | Quote removed; "three weeks later she posted 'I feel free'" | S-WTHR23, S-ET23 (Instagram Story, 2023-08-16) |
| 4 | Opening paragraph | "silly" is in no source | Her actual words: "get off your phone and get a job" | S-WTHR23 |
| 5 | Intro | "in 12 hours" | "in a single day" | S-BB21, S-DAZED18 |
| 6 | TL;DR | "in 12 hours" | "in a single day" | S-BB21, S-DAZED18 |
| 7 | TL;DR | "where she solo-wrote every track" | "where she is credited with every lyric" | S-WIKIVIE |
| 8 | Childhood section | "He abandoned us" and "He left the United States years ago, citing homesickness" are in no source; "She barely knows him" is contradicted; his absence was stated as fact and as the cause of a "core belief" | Her sourced words ("my dad left me when I was little"; "I don't hold grudges against him"), his denial ("I never left my kid"), and a line that the accounts conflict. The belief sentence is now conditional. | S-ELLEUK26, S-FADER19, S-CXDAD26 |
| 9 | "Mooo!" section | "Within 12 hours" | "Within a day" | S-BB21, S-DAZED18 |
| 10 | "Mooo!" section | "It was a joke... A throwaway." not found | "It was a joke between me and my fans," she told Dazed. | S-DAZED18 |
| 11 | Scarlet section | "pent-up feelings and anger" attributed to Jack Harlow | Full sentence, attributed to Angie Martinez for Harper's Bazaar, August 2023, about visuals and fashion | S-BAZ23 |
| 12 | Scarlet section | "Your fear is not my problem." is in no source | Quote removed; the sentence now says she pushed the imagery further | none found |
| 13 | Kittenz section | "creepy as fuck" | Sentence removed | none found |
| 14 | Kittenz section | "I feel free" timing | "three weeks later on her Instagram Story" | S-ET23 |
| 15 | Paraguay section | "I'm not taking pictures again with anybody else after this tour" is in no source | The sourced exchange: "I'm sorry," then "I'm not sorry" | S-LAT22 |
| 16 | Paraguay section | Her return two days later was omitted | Added "Within about two days she was back, writing, 'I owe a lot.'" | S-BBRET22 |
| 17 | Vie section | "solo-wrote every single song" and "first female rapper of her generation to write an entire album alone" are unsourced and the first is wrong | "She is credited with every lyric on Vie; the music is co-written." | S-WIKIVIE |
| 18 | Vie section | "I didn't used to write as myself" presented as a Vie-era remark; second half of the quote unverified | Dated to the November 2023 comic self-interview; only the verified two sentences kept | CXSELF23 |
| 19 | Vie section | Two Rian Lewis passages joined into one quote and presented as Vie sessions | Split into two quotes and dated to the Scarlet sessions (2023) | S-REVOLT23 |
| 20 | Clapbacks section | "Broadway act" and "costume monkey" were two posts joined into one quote | Two separate quotations, punctuation as posted | S-CXTOUR25 |
| 21 | Clapbacks section | Pablo Tamayo described as "touching her without permission"; the record shows she hugged him twice and gave him a nickname | Context corrected; her post quoted as written | S-CXTAM25 |
| 22 | Closing section | "The absent father wound" and "what the father wound produced" state a disputed account as fact; Fortnite quote garbled and dated 2025; "solo-written album" | "as she tells it"; exact Fortnite words, dated to a clip circulating by September 2024 and marked as a joke; "the album written out of those sessions" | S-ELLEUK26, S-CXDAD26, FN, S-AM25 |

## Not checked in this pass

The rest of the old page was not audited line by line. Still unverified: the vocal range, the Forbes and Alchemist quotes, the breast-reduction and Cosmopolitan quotes, the parasocial block quote, "five million views in two weeks," "a name they'd used since 2013," "nine tracks" with Jack Antonoff, and the first Rian Lewis quote ("produced all her own vocals").

## Related gate skips the same day

Two other legacy rows were synced with `--skip-perspective-gate` so they stop calling her "a Seven" while the retype is open. Both are one-clause edits; `lastmod` unchanged on each.

- `katy-perry`: "Like fellow Seven [Doja Cat]..." became "Like [Doja Cat]..., she has never repeated a persona."
- `taylor-frankie-paul`: the list of celebrity Sevens now names Katy Perry in her place.
