<!-- docs/blog-enrichment/elon-musk-pilot.md -->

# Elon Musk Visual Evidence Pilot

Status: `enriched-local` — five hooks implemented in the local draft; no Supabase write performed.

## Selection

| Placement               | Visual relationship                                                                                              | Image rights                                                               | Quote/source record                                |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------- |
| Model 3 opening         | Same production period, explicitly labeled as a public time anchor rather than the private conference-room scene | Steve Jurvetson, CC BY 2.0                                                 | Scene reported in Walter Isaacson's 2023 biography |
| Talulah Riley testimony | Formal portrait of Riley at the London Institute for Mathematical Sciences                                       | LIMS; documented editorial fair-use rationale, medium risk                 | Walter Isaacson, _Elon Musk_ (2023)                |
| Kimbal Musk testimony   | Official, face-forward headshot                                                                                  | 1000x2020, CC BY-SA 4.0                                                    | Molly Ball, TIME, April 25, 2022                   |
| Justine Musk testimony  | Speaking still from her 2014 TEDx talk, four years after the quoted essay                                        | TEDx Talks / YouTube; documented editorial fair-use rationale, medium risk | Justine Musk, Marie Claire, September 10, 2010     |
| Conference-room ending  | Source portrait                                                                                                  | David Shankbone, CC BY 3.0                                                 | Walter Isaacson, reporting Jon McNeill's account   |

## Corrections And Editorial Decisions

- The Kimbal quote was previously labeled TIME 2021. The direct source is TIME's April 25, 2022
  article, so the ledger, prose, and citations now use 2022.
- No licensable photograph of the private dark conference-room scene was verified. The Model 3 launch
  image is therefore labeled as a public time anchor and expressly says it is not that scene.
- The August 15 editorial pass replaces compact face-and-quote rows with one portrait-led treatment
  for every quoted person. The image is the primary element, while the quote, speaker relationship,
  context, and compact source lines remain attached to it.
- The August 15 portrait-quality pass replaces Talulah's _St. Trinian's_ costume image with a formal
  LIMS portrait, Kimbal's casual restaurant photograph with an official headshot, and Justine's
  domestic couch image with a tightly cropped frame of her speaking onstage. Each one now identifies
  the quoted person immediately and avoids implying that the quotation was spoken in the photographed
  setting.
- Walter Isaacson is shown as the biographer reporting Jon McNeill's account, not as an eyewitness.
- Justine's 2014 frame is the closest strong speaking image found to her 2010 essay. The Justine and
  Talulah portraits are the two non-open-license assets in this pilot; both have four-factor analyses,
  attribution, reduced resolution, source links, and review recommendations in the registry.
- Quotes moved into evidence cards instead of appearing twice in the article prose.

## Source Pages

- [Model 3 launch — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Elon_Musk_Presenting_the_First_Tesla_Model_3_Cars.jpg)
- [Talulah Riley portrait — London Institute for Mathematical Sciences](https://lims.ac.uk/news/welcome-talulah/)
- [Kimbal Musk official headshot — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:KIMBAL_MUSK_OFFICIAL_HEADSHOT.jpg)
- [Justine Musk speaking — TEDx Talks](https://www.youtube.com/watch?v=ptFYmNuRNyQ)
- [Justine Musk quote — Marie Claire](https://www.marieclaire.com/sex-love/a5380/millionaire-starter-wife/)
- [Walter Isaacson portrait — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Walter_Isaacson_VF_2012_Shankbone_2.JPG)
- [Kimbal quote — TIME](https://time.com/6170696/elon-musk-politics-twitter/)
- [Walter Isaacson's _Elon Musk_ — Simon & Schuster](https://www.simonandschuster.com/books/Elon-Musk/Walter-Isaacson/9781982181284)

## Publish Gate

1. Desktop and 390px component treatment approved and verified locally on August 15, 2026.
2. Decide whether to publish the medium-risk Justine and Talulah assets or replace either one with a
   licensed portrait.
3. Compare the current `blogs_famous_people` Elon body with the local draft so newer database edits are
   not overwritten.
4. Sync the enriched body to Supabase.
5. Open the live page, test all ten source/license links, check image crops and alt text, and change the
   tracker to `published` only after the page passes.
