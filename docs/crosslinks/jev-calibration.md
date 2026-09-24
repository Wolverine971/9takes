<!-- docs/crosslinks/jev-calibration.md -->
# Jev Calibration

_Generated: 2026-09-24 by `pnpm audit:links:jev -- --calibrate` · model typesafe/jev-1.13 · cost $0.0000_

Ground truth: the 2026-09-22 cross-link pass. **107 accepted links** that wrapped words already in a post
(diff 48f80036a..HEAD, link removed before asking) vs **47 rejected word matches** from
`skipped.json`. Both sets were string-matcher hits, so this measures exactly what Jev is for:
telling an honest link from a coincidental mention.

Link strength = Jev's 4-level rubric score / 3 (0 unrelated … 1 direct). Chosen over three yes/no wordings on this
set 2026-09-23 (rubric AUC 0.84; yes/no wordings 0.71–0.80; averaging them with the rubric did not help).

"Kept" = link strength ≥ threshold AND Jev picked an existing-wording anchor (the INSERT path). The last column
is the strength judgment alone, which decides whether a link is proposed at all (INSERT or QUEUE).

Known blind spot: sentences that warn against a subject ("not compatibility, communication") still read as
about it (Jev takes negation literally). A stance check was tested 2026-09-23 and was net neutral
(+1 point precision, −4 accepted links), so the writing step catches these instead.

| Threshold | Accepted kept | Rejected kept | Precision | Whole-page only: accepted / rejected |
|---|---|---|---|---|
| 0.5 | 51/107 (48%) | 9/47 (19%) | 85% | 92% / 40% |
| 0.6 | 41/107 (38%) | 7/47 (15%) | 85% | 74% / 26% |
| 0.65 | 37/107 (35%) | 6/47 (13%) | 86% | 65% / 19% |
| 0.7 | 34/107 (32%) | 5/47 (11%) | 87% | 61% / 15% |
| 0.75 | 27/107 (25%) | 4/47 (9%) | 87% | 52% / 11% |
| 0.8 | 26/107 (24%) | 2/47 (4%) | 93% | 46% / 6% |
| 0.9 | 13/107 (12%) | 0/47 (0%) | 100% | 26% / 2% |

## Accepted links Jev would drop at 0.7

- `/community/introducing-9takes` → `/enneagram-corner/astrology-and-the-enneagram`: wide 0.57, placement anchor
- `/community/introducing-9takes` → `/pop-culture/twitter-x-personality-types-toxic`: wide 0.85, placement bridge
- `/community/kantian-filters-and-nine-perspectives` → `/community/inspiration-for-9takes`: wide 0.71, placement bridge
- `/community/mbti-vs-enneagram` → `/how-to-guides/definitive-guide-to-relationship-conflict-part-2`: wide 0.55, placement bridge
- `/community/memetic-comments` → `/community/reddit-deep-connections-limitations`: wide 0.91, placement bridge
- `/community/memetic-comments` → `/pop-culture/twitter-x-personality-types-toxic`: wide 0.85, placement bridge
- `/community/questions-are-the-engine-of-moral-awakening` → `/community/kantian-filters-and-nine-perspectives`: wide 0.96, placement bridge
- `/community/societal-ticking-time-bombs` → `/pop-culture/breaking-points-enneagram-analysis`: wide 0.56, placement bridge
- `/community/societal-ticking-time-bombs` → `/pop-culture/masculinity-strength-and-the-enneagram`: wide 0.79, placement bridge
- `/community/software-and-hardware-of-the-mind` → `/enneagram-corner/astrology-and-the-enneagram`: wide 0.51, placement anchor
- `/community/why-the-greek-vibe` → `/community/what-winning-online-arguments-looks-like`: wide 0.75, placement bridge
- `/community/why-the-greek-vibe` → `/pop-culture/trump-type-8-vs-biden-type-2`: wide 0.60, placement bridge
- `/enneagram-corner/90-day-personality-maxing-blueprint` → `/enneagram-corner/personality-maxing`: wide 0.99, placement bridge
- `/enneagram-corner/beginners-guide-to-determining-your-enneagram-type` → `/enneagram-corner/enneagram-vs-personality-frameworks-comparison`: wide 0.50, placement anchor
- `/enneagram-corner/enneagram-and-religion` → `/enneagram-corner/enneagram-self-development`: wide 0.56, placement none
- `/enneagram-corner/enneagram-compatibility-matrix` → `/enneagram-corner/enneagram-connecting-lines`: wide 0.90, placement bridge
- `/enneagram-corner/enneagram-compatibility-matrix` → `/enneagram-corner/how-each-enneagram-type-unwinds`: wide 0.55, placement none
- `/enneagram-corner/enneagram-compatibility-matrix` → `/enneagram-corner/enneagram-instinctual-subtypes`: wide 0.67, placement anchor
- `/enneagram-corner/enneagram-compatibility-matrix` → `/enneagram-corner/relationship-communication-guide`: wide 0.93, placement bridge
- `/enneagram-corner/enneagram-dating-guide-for-women` → `/enneagram-corner/enneagram-online-dating-guide`: wide 0.67, placement bridge
- `/enneagram-corner/enneagram-faqs` → `/community/why-im-selective-sharing-enneagram`: wide 0.95, placement bridge
- `/enneagram-corner/enneagram-influences` → `/enneagram-corner/enneagram-vs-personality-frameworks-comparison`: wide 0.56, placement bridge
- `/enneagram-corner/enneagram-influences` → `/community/fear-triad-intellectual-fortress-or-prison`: wide 0.42, placement anchor
- `/enneagram-corner/enneagram-instinctual-subtypes` → `/enneagram-corner/love-languages-and-enneagram-types`: wide 0.56, placement anchor
- `/enneagram-corner/enneagram-self-development` → `/community/inspiration-for-9takes`: wide 0.86, placement none
- `/enneagram-corner/enneagram-test-comparison-2026` → `/enneagram-corner/mental-health/enneagram-science-mental-health`: wide 0.95, placement bridge
- `/enneagram-corner/enneagram-vs-meyers-briggs` → `/enneagram-corner/mental-health/enneagram-science-mental-health`: wide 0.95, placement bridge
- `/enneagram-corner/enneagram-wings-complete-guide` → `/enneagram-corner/love-languages-and-enneagram-types`: wide 0.58, placement anchor
- `/enneagram-corner/first-impression-cheat-sheet` → `/enneagram-corner/biggest-compliments-to-give-each-enneagram-type`: wide 0.77, placement bridge
- `/enneagram-corner/first-impression-enneagram-playbook` → `/enneagram-corner/biggest-compliments-to-give-each-enneagram-type`: wide 0.79, placement bridge
- `/enneagram-corner/how-to-apologize-like-a-pro` → `/enneagram-corner/enneagram-types-in-stress`: wide 0.93, placement bridge
- `/enneagram-corner/how-to-apologize-like-a-pro` → `/enneagram-corner/enneagram-type-4`: wide 0.91, placement bridge
- `/enneagram-corner/how-to-apologize-like-a-pro` → `/how-to-guides/definitive-guide-to-relationship-conflict-part-1`: wide 0.82, placement bridge
- `/enneagram-corner/how-to-apologize-like-a-pro` → `/enneagram-corner/how-each-enneagram-type-manipulates`: wide 0.57, placement bridge
- `/enneagram-corner/how-to-navigate-early-relationship-stages` → `/enneagram-corner/enneagram-online-dating-guide`: wide 0.64, placement none
- `/enneagram-corner/mental-health/enneagram-addiction-recovery-guide` → `/enneagram-corner/enneagram-positive-self-talk`: wide 0.77, placement bridge
- `/enneagram-corner/mental-health/enneagram-neurodivergence-guide` → `/enneagram-corner/mental-health/enneagram-anxiety-complete-guide`: wide 0.46, placement bridge
- `/enneagram-corner/mental-health/enneagram-parenting-mental-health` → `/community/personality-frameworks-map-not-territory`: wide 0.99, placement bridge
- `/enneagram-corner/mental-health/enneagram-therapy-guide` → `/enneagram-corner/enneagram-positive-self-talk`: wide 0.68, placement none
- `/enneagram-corner/mental-health/enneagram-therapy-resistance-guide` → `/pop-culture/comedy-kings-enneagram-analysis`: wide 0.86, placement bridge
- `/enneagram-corner/mental-health/enneagram-therapy-resistance-guide` → `/enneagram-corner/situations-change-emotions-dont`: wide 0.88, placement bridge
- `/enneagram-corner/shadow-work-by-enneagram-type` → `/how-to-guides/definitive-guide-to-relationship-conflict-part-2`: wide 0.93, placement none
- `/enneagram-corner/situations-change-emotions-dont` → `/enneagram-corner/how-to-navigate-early-relationship-stages`: wide 0.58, placement anchor
- `/enneagram-corner/situations-change-emotions-dont` → `/personality-analysis/marcus-aurelius`: wide 0.48, placement anchor
- `/enneagram-corner/toxic-traits-relationships-warning-signs` → `/enneagram-corner/love-languages-and-enneagram-types`: wide 0.49, placement anchor
- `/how-to-guides/5-tough-conversations-you-need-to-have-with-your-partner` → `/community/fear-triad-intellectual-fortress-or-prison`: wide 0.66, placement anchor
- `/how-to-guides/dating-dynamics-by-enneagram-type` → `/enneagram-corner/why-dating-apps-are-harder-for-certain-personality-types`: wide 0.62, placement anchor
- `/how-to-guides/dating-dynamics-by-enneagram-type` → `/enneagram-corner/how-to-apologize-like-a-pro`: wide 0.55, placement anchor
- `/how-to-guides/definitive-guide-to-relationship-conflict-part-1` → `/enneagram-corner/how-to-apologize-like-a-pro`: wide 0.68, placement anchor
- `/how-to-guides/guide-to-fighting-depression` → `/how-to-guides/the-crash-course-on-emotions-that-we-missed-in-kindergarten`: wide 0.80, placement bridge
- `/how-to-guides/how-to-psychoanalyze-people` → `/enneagram-corner/astrology-and-the-enneagram`: wide 0.43, placement bridge
- `/how-to-guides/the-crash-course-on-emotions-that-we-missed-in-kindergarten` → `/how-to-guides/5-tough-conversations-you-need-to-have-with-your-partner`: wide 0.95, placement bridge
- `/how-to-guides/using-the-enneagram-for-self-development` → `/how-to-guides/guide-to-fighting-depression`: wide 0.91, placement none
- `/how-to-guides/using-the-enneagram-for-self-development` → `/how-to-guides/the-crash-course-on-emotions-that-we-missed-in-kindergarten`: wide 0.92, placement none
- `/pop-culture/cancel-culture-enneagram-type` → `/enneagram-corner/how-to-apologize-like-a-pro`: wide 0.75, placement bridge
- `/pop-culture/dark-triad-meets-enneagram` → `/enneagram-corner/enneagram-and-mental-illness`: wide 0.63, placement bridge
- `/pop-culture/epstein-psychology-part-1` → `/personality-analysis/ryan-grim`: wide 0.21, placement anchor
- `/pop-culture/parasocial-relationships-enneagram-type` → `/pop-culture/cancel-culture-enneagram-type`: wide 0.41, placement none
- `/pop-culture/podcast-bros-enneagram-analysis` → `/pop-culture/incel-blackpill-radicalization-enneagram`: wide 0.52, placement anchor
- `/pop-culture/podcast-bros-enneagram-analysis` → `/personality-analysis/david-goggins`: wide 0.63, placement bridge
- `/pop-culture/psychology-of-public-shame` → `/enneagram-corner/how-to-apologize-like-a-pro`: wide 0.64, placement anchor
- `/pop-culture/tbpn-john-coogan-jordi-hays-enneagram-dynamic` → `/enneagram-corner/enneagram-social-styles`: wide 0.65, placement bridge
- `/pop-culture/tbpn-john-coogan-jordi-hays-enneagram-dynamic` → `/pop-culture/tech-titans-ai-wars`: wide 0.56, placement none
- `/pop-culture/tbpn-john-coogan-jordi-hays-enneagram-dynamic` → `/personality-analysis/alex-hormozi`: wide 0.63, placement anchor
- `/pop-culture/tbpn-john-coogan-jordi-hays-enneagram-dynamic` → `/personality-analysis/alex-karp`: wide 0.53, placement anchor
- `/pop-culture/tech-titans-ai-wars` → `/enneagram-corner/enneagram-team-diversity`: wide 0.72, placement bridge
- `/pop-culture/tech-titans-leadership-styles` → `/enneagram-corner/enneagram-team-diversity`: wide 0.81, placement bridge
- `/pop-culture/tech-titans-leadership-styles` → `/personality-analysis/david-friedberg`: wide 0.57, placement anchor
- `/pop-culture/trump-type-8-vs-biden-type-2` → `/personality-analysis/kim-kardashian`: wide 0.33, placement none
- `/pop-culture/trump-type-8-vs-biden-type-2` → `/personality-analysis/kamala-harris`: wide 0.54, placement bridge
- `/pop-culture/twitter-x-personality-types-toxic` → `/pop-culture/tech-titans-platform-emperors`: wide 0.63, placement bridge
- `/pop-culture/us-presidents-enneagram-analysis` → `/personality-analysis/jackie-kennedy`: wide 0.62, placement anchor
- `/pop-culture/us-presidents-enneagram-analysis` → `/personality-analysis/michelle-obama`: wide 0.43, placement bridge

## Rejected matches Jev would still insert at 0.7

- `/community/societal-ticking-time-bombs` → `/enneagram-corner/attachment-styles-and-enneagram-types`: wide 0.80, anchor "attachment styles" (0.53). Rejected because: Passing example of pop-psych vocabulary the paragraph argues isn't working; not about attachment styles.
- `/enneagram-corner/enneagram-vs-meyers-briggs` → `/enneagram-corner/enneagram-types-and-career-choices`: wide 0.75, anchor "career path" (0.83). Rejected because: 'Career path suggestions' is listed as an MBTI strength, and the post says the Enneagram does not give career paths directly. Linking it to an Enneagram career page would mislead.
- `/how-to-guides/using-the-enneagram-for-self-development` → `/enneagram-corner/enneagram-compatibility-matrix`: wide 0.79, anchor "compatibility" (0.85). Rejected because: The sentence warns against using the Enneagram to predict compatibility. It is a caution, not the topic.
- `/how-to-guides/5-tough-conversations-you-need-to-have-with-your-partner` → `/enneagram-corner/enneagram-compatibility-matrix`: wide 0.83, anchor "couples" (0.85). Rejected because: 'Not compatibility. Not chemistry. Communication.' dismisses compatibility as a predictor. It is a caution, not the topic.
- `/pop-culture/fallen-founders-enneagram-analysis` → `/pop-culture/tech-titans-ai-wars`: wide 0.84, anchor "Sam Altman" (0.66). Rejected because: 'OpenAI' appears in a sentence about the Toner board-paper dispute, not the AI race. The post has no sentence about the AI wars.
