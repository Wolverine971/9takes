<!-- docs/content-analysis/people-crosslink-audit-2026-04-20.md -->

# People Cross-Link Audit - 2026-04-20

## Scope

- Reference index: `src/lib/components/molecules/famousTypes.ts`
- Source of truth checked: people markdown frontmatter and article bodies in `src/blog/people/drafts/`
- Recent-publish cutoff: `2026-02-20`
- Broader cross-link scan: any published people profile where the source or target had `date` or `lastmod` on or after `2026-02-20`
- Rule followed: link-only and suggestion-only edits did not change `lastmod` or visible "Last updated" dates

## Recently Published People Profiles

These published people profiles have `date >= 2026-02-20` and were checked for cross-link opportunities.

| Date       | Lastmod    | Profile            | File                                           |
| ---------- | ---------- | ------------------ | ---------------------------------------------- |
| 2026-04-20 | 2026-04-20 | Bill-Clinton       | `src/blog/people/drafts/Bill-Clinton.md`       |
| 2026-04-19 | 2026-04-19 | Tyler-Cowen        | `src/blog/people/drafts/Tyler-Cowen.md`        |
| 2026-04-18 | 2026-04-18 | John-Lennon        | `src/blog/people/drafts/John-Lennon.md`        |
| 2026-04-17 | 2026-04-17 | James-Dyson        | `src/blog/people/drafts/James-Dyson.md`        |
| 2026-04-16 | 2026-04-16 | Mike-Majlak        | `src/blog/people/drafts/Mike-Majlak.md`        |
| 2026-04-16 | 2026-04-16 | Ryan-Grim          | `src/blog/people/drafts/Ryan-Grim.md`          |
| 2026-04-15 | 2026-04-15 | Garry-Tan          | `src/blog/people/drafts/Garry-Tan.md`          |
| 2026-04-14 | 2026-04-14 | Lionel-Messi       | `src/blog/people/drafts/Lionel-Messi.md`       |
| 2026-04-14 | 2026-04-14 | Steve-Carell       | `src/blog/people/drafts/Steve-Carell.md`       |
| 2026-04-13 | 2026-04-13 | Shailene-Woodley   | `src/blog/people/drafts/Shailene-Woodley.md`   |
| 2026-04-12 | 2026-04-12 | Eddie-Murphy       | `src/blog/people/drafts/Eddie-Murphy.md`       |
| 2026-04-12 | 2026-04-12 | Hilary-Duff        | `src/blog/people/drafts/Hilary-Duff.md`        |
| 2026-04-09 | 2026-04-09 | Sara-Saffari       | `src/blog/people/drafts/Sara-Saffari.md`       |
| 2026-04-09 | 2026-04-09 | Sky-Bri            | `src/blog/people/drafts/Sky-Bri.md`            |
| 2026-04-07 | 2026-04-07 | Ben-Affleck        | `src/blog/people/drafts/Ben-Affleck.md`        |
| 2026-04-07 | 2026-04-07 | Bradley-Martyn     | `src/blog/people/drafts/Bradley-Martyn.md`     |
| 2026-04-07 | 2026-04-07 | Matt-Damon         | `src/blog/people/drafts/Matt-Damon.md`         |
| 2026-04-06 | 2026-04-06 | Kris-Jenner        | `src/blog/people/drafts/Kris-Jenner.md`        |
| 2026-03-30 | 2026-03-30 | Tyler-The-Creator  | `src/blog/people/drafts/Tyler-The-Creator.md`  |
| 2026-03-24 | 2026-03-24 | Tom-Hiddleston     | `src/blog/people/drafts/Tom-Hiddleston.md`     |
| 2026-03-21 | 2026-03-21 | Jake-Gyllenhaal    | `src/blog/people/drafts/Jake-Gyllenhaal.md`    |
| 2026-03-21 | 2026-03-21 | Marcello-Hernandez | `src/blog/people/drafts/Marcello-Hernandez.md` |

Note: `src/blog/people/drafts/Emma-Chamberlain.md` has `date: 2026-04-19` but `published: false`. It was still checked because it was named in the request.

## Cross-Link Gaps Fixed

### Recently Published Targets

- Bill Clinton is now linked from Hillary Clinton, George H.W. Bush, Epstein part 1, Ghislaine Maxwell, and the Enneagram wings guide.
- Hillary Clinton is now linked from Bill Clinton, Donald Trump, Joe Biden, Meghan Markle, Casey Neistat, Vladimir Putin, Epstein part 1, and Breaking Points.
- Emma Chamberlain is now linked from the influencer Enneagram types article, and Emma's draft links Alex Cooper.
- Tyler, The Creator links Doechii.
- Palmer Luckey links Paul Graham, Joe Rogan, and Vladimir Putin.
- Barack Obama links Michelle Obama; Joe Biden and Emma Watson link Barack Obama.
- Sabrina Carpenter links Taylor Swift and Anne Hathaway; Pedro Pascal links Sabrina Carpenter.
- Jason Calacanis links Sam Altman.
- Jennifer Garner links Ben Affleck.
- Malcolm X and Hillary Clinton link Martin Luther King Jr.
- Sam Altman links Paul Graham, Elon Musk, and Donald Trump.
- Madison Beer links Olivia Rodrigo and Sabrina Carpenter.
- Olivia Rodrigo links Taylor Swift.
- Alexandria Ocasio-Cortez links Ryan Grim.
- Cristiano Ronaldo links Lionel Messi; IShowSpeed links Cristiano Ronaldo.
- Denzel Washington links Malcolm X and Brad Pitt.
- John Lennon links Ronald Reagan.
- Steve Carell and Jon Stewart now link each other.
- Eddie Murphy links Dave Chappelle.
- George W. Bush links Kanye West and Winston Churchill.
- Oprah Winfrey links Barack Obama.
- Michelle Obama links Donald Trump.
- Mike Majlak links Kai Cenat; Sara Saffari links Mike Majlak.
- Scarlett Johansson links Sam Altman.
- Timothee Chalamet links Tom Cruise and Harry Styles.
- Ben Affleck links Kevin Hart.
- Druski links Ben Affleck.
- Emily Ratajkowski links Ben Affleck.
- Emma Watson links Matt Damon.
- Jared Leto links John Lennon.
- Kim Kardashian and Kylie Jenner link Kris Jenner.
- Kai Cenat links Druski, Kim Kardashian, and Zendaya.
- Matt Damon and Saoirse Ronan link Brad Pitt.
- Zendaya links Matt Damon.
- Alex Cooper and Chappell Roan now link where the interview mention appears.

### Suggestion Gaps Fixed

- Bill Clinton <-> Hillary Clinton
- Cristiano Ronaldo <-> Lionel Messi
- Alexandria Ocasio-Cortez <-> Ryan Grim
- Steve Carell <-> Jon Stewart
- Eddie Murphy <-> Dave Chappelle
- Kim Kardashian -> Kris Jenner, with Kris Jenner already suggesting Kim Kardashian
- Kylie Jenner -> Kris Jenner, with Kris Jenner already suggesting Kylie Jenner
- Kai Cenat <-> Druski
- Sabrina Carpenter <-> Chappell Roan
- Emma Chamberlain -> Alex Cooper, with Alex Cooper already suggesting Emma Chamberlain
- George H.W. Bush -> Bill Clinton, with Bill Clinton already suggesting George H.W. Bush

## Remaining Detections Not Linked

These are the remaining scanner hits after the pass. None are good candidates for a normal personality cross-link.

| Source                                                    | Detected target | Reason left alone                                                      |
| --------------------------------------------------------- | --------------- | ---------------------------------------------------------------------- |
| `src/blog/people/drafts/Millie-Bobby-Brown.md`            | Eminem          | The mention is a goat named Eminem, not a meaningful person reference. |
| `src/blog/people/drafts/Winston-Churchill.md`             | Hozier          | The mention is Clementine Hozier, not the musician Hozier.             |
| `src/blog/people/drafts/Sam-Altman-research.md`           | Sam Altman      | Auxiliary research file, not a published personality article.          |
| `src/blog/people/drafts/sam-altman-new-yorker.md`         | Sam Altman      | Auxiliary notes file, not a published personality article.             |
| `src/blog/people/drafts/Taylor-Swift-updated-sections.md` | kanye           | Auxiliary update file, not a published personality article.            |

Additional editorial note: the Sam Altman article mentions Tyler Cowen through an external source citation. I left that external citation intact rather than replacing the citation link with an internal profile link.

## Verification

- `node scripts/personBlogParser.js --changed` completed successfully.
- A scoped git diff check found no `lastmod` or visible "Last updated" changes in `src/blog/people/drafts`, `src/blog/pop-culture`, or `src/blog/enneagram`.
- Post-fix scan result: 120 published people profiles, 64 date/lastmod-recent profiles in the broader scan, and only the 5 deferred detections listed above.
