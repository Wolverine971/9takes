<!-- docs/blog-enrichment/elon-musk-pilot.md -->

# Elon Musk Visual Evidence Pilot

Status: `enriched-local` — five hooks implemented in the local draft; no Supabase write performed.

## Selection

| Placement               | Visual relationship                                                                                              | Image rights                                                                           | Quote/source record                                |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Model 3 opening         | Same production period, explicitly labeled as a public time anchor rather than the private conference-room scene | Steve Jurvetson, CC BY 2.0                                                             | Scene reported in Walter Isaacson's 2023 biography |
| Talulah Riley testimony | Relationship-era photograph of Riley and Musk together at his 2015 birthday party; not the recalled night        | Steve Jurvetson, CC BY 2.0                                                             | Walter Isaacson, _Elon Musk_ (2023)                |
| Kimbal Musk testimony   | Compact speaker portrait                                                                                         | Wikiupdate1019, CC BY-SA 3.0                                                           | Molly Ball, TIME, April 25, 2022                   |
| Justine Musk testimony  | The publisher's photograph accompanying her first-person essay                                                   | Lauren Greenfield / Marie Claire; documented editorial fair-use rationale, medium risk | Justine Musk, Marie Claire, September 10, 2010     |
| Conference-room ending  | Source portrait                                                                                                  | David Shankbone, CC BY 3.0                                                             | Walter Isaacson, reporting Jon McNeill's account   |

## Corrections And Editorial Decisions

- The Kimbal quote was previously labeled TIME 2021. The direct source is TIME's April 25, 2022
  article, so the ledger, prose, and citations now use 2022.
- No licensable photograph of the private dark conference-room scene was verified. The Model 3 launch
  image is therefore labeled as a public time anchor and expressly says it is not that scene.
- A second-pass hierarchy uses compact face-and-quote rows for Kimbal, Justine, and Isaacson. Talulah
  receives a larger treatment because the licensed photograph shows her and Musk together during
  their relationship. This is relationship-era context, not a claim that the quote was spoken then.
- Walter Isaacson is shown as the biographer reporting Jon McNeill's account, not as an eyewitness.
- The Justine Musk image is unusually valuable because it comes from the same Marie Claire feature as
  her quoted words. It is also the only non-open-license asset in this pilot. Its four-factor analysis,
  attribution, reduced resolution, link back, and review recommendation live in the registry.
- Quotes moved into evidence cards instead of appearing twice in the article prose.

## Source Pages

- [Model 3 launch — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Elon_Musk_Presenting_the_First_Tesla_Model_3_Cars.jpg)
- [Talulah Riley and Elon Musk together in 2015 — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Superhero_or_Supervillain%3F_The_Elon_Musk_interview.jpg)
- [Kimbal Musk portrait — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:KimbalMusk.jpg)
- [Justine Musk essay and photograph — Marie Claire](https://www.marieclaire.com/sex-love/a5380/millionaire-starter-wife/)
- [Walter Isaacson portrait — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Walter_Isaacson_VF_2012_Shankbone_2.JPG)
- [Kimbal quote — TIME](https://time.com/6170696/elon-musk-politics-twitter/)
- [Walter Isaacson's _Elon Musk_ — Simon & Schuster](https://www.simonandschuster.com/books/Elon-Musk/Walter-Isaacson/9781982181284)

## Publish Gate

1. Approve the desktop and 390px component treatment.
2. Decide whether to publish the medium-risk Justine asset or replace it with a licensed portrait.
3. Compare the current `blogs_famous_people` Elon body with the local draft so newer database edits are
   not overwritten.
4. Sync the enriched body to Supabase.
5. Open the live page, test all ten source/license links, check image crops and alt text, and change the
   tracker to `published` only after the page passes.
