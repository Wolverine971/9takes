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
