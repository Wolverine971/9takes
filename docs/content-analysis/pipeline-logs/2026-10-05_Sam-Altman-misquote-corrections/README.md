# Sam Altman: live-page misquote corrections (2026-10-05)

DJ kept Sam Altman at Type 4 after two pipeline runs. The 2026-10-05_01-03-35 run argued Type 3 and passed. The 2026-10-05_14-50-20 run could not build a defensible Type 4 case and held. DJ chose to correct the misquotes on the live Type 4 page rather than retype.

- Base text: the live `blogs_famous_people.content` as of 2026-10-05 (lastmod 2026-03-01). The draft was rebuilt from the live row, so only `content` and `meta_title` changed.
- `meta_title` became "Sam Altman Personality Type: Enneagram 4 Profile" (the 10-03 search-cleanup batch).
- `corrections-log.md` has the 49 corrections made against the two runs' evidence records: list A items (a) through (x), list B (claim C79 and the must-not-return list), and the research-notes fact fixes.
- Follow-up fixes applied on top, each checked against the evidence excerpts:
  1. The firing-day posts are quoted verbatim in lowercase ("it was transformative for me personally", S46), with the correct afternoon and night timing.
  2. Removed the unverifiable Nadella quote "We know what we need to do either way". The linked CNBC page returns a 404.
  3. Removed the unsourced "more transparent" line. The paragraph now quotes his 2025 Bloomberg answers (S40).
  4. Removed the unsourced detail that Brockman appeared in a "photograph of the rebuilt board".
  5. The "weird fugue" quote is from The New Yorker in 2026, so "Months later" became "Years later". "Not anger. Not injustice." was replaced with his own "just supermad" and "it felt so unfair" (S40).
  6. Split the stitched DealBook quote into its two verbatim parts (S18). Replaced the unsourced "burden" paraphrase with the actual "0%" follow-up (S92).
  7. The Samurai line is now credited as Jack recalling what Sam declared during a board game (New Yorker 2016, S03).
  8. The dead Mostly Human link now points to the web archive copy (S06). Removed the unsourced "stayed up all night" and "three times he put it back" lines.
  9. The Senate record's `--` now renders as an em dash inside the quote (S29).
- Pushed with `personBlogParser.js Sam-Altman --sync --skip-perspective-gate`. The live row never had a perspective review. lastmod is unchanged (2026-03-01).
- Not applied (time-sensitive; see the log): pay, valuation, equity, PBC, S-1, Musk v. OpenAI ruling. Also left: the Karen Hao book passages, which aren't verified against the book.
