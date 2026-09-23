# Cross-Link Log

Append-only record of `/crosslink-queue` runs and manual cross-link passes. Newest entries at the bottom. Never rewrite earlier entries.

### 2026-09-22 — 159 links added, gate debt 66 → 8 (initial build + first pass)

First pass after rebuilding `pnpm gen:crosslinks` (live-only graph, type + people links counted, GSC-ranked queue) and adding the `pnpm crosslinks:check` gate. Work: hand-picked high-value links, then 8 parallel agents on the queue (4 on top/people-bridge candidates, 4 on gate debt). Verified by diffing the link graph against HEAD: **159 links added, 0 removed**; 70 cross section boundaries.

- Zero-link posts: 2 → 0 (trump-type-8-vs-biden-type-2 had 0 in; incel-blackpill had 0 out)
- Dead ends with traffic fixed: compatibility-matrix (2 → 6 out), neurodivergence-guide (2 → 5), how-to-apologize (1 → 5)
- Striking-distance targets linked: astrology (+4), frameworks-comparison (+5), depression-patterns, how-to-apologize (+3), tech-titans-ai-wars (+3), toxic-traits-relationships
- Section medians (in): pop-culture 2 → 3, community 2 → 3, how-to-guides 2 → 3, enneagram-corner 6 → 8. Enneagram Corner still keeps 93% of its links in-section (was 94%). **Not solved yet.**
- Gate: below-bar posts 66 → 8, grandfathered 58 → 8, broken links 0
- Rejected: 48 wrong matches recorded in skipped.json (word matches like "hostage", "dollar", "Kristen", cautions like "do not decide compatibility")
- Also: FamousTypes now links each type page to /personality-analysis/type/N; Epstein research notes moved to docs/research/epstein/; Daniel-Radcliffe draft broken link fixed (needs push:people sync)

**Bridging sentences / list items added (37, verbatim):**

- `src/blog/pop-culture/alex-cooper-alix-earle-beef-enneagram-analysis.md` → `/pop-culture/kardashian-family-enneagram-analysis`: A parent running the business side has a famous precedent in Kris Jenner, the momager at the center of our [Kardashian family analysis](/pop-culture/kardashian-family-enneagram-analysis).
- `src/blog/pop-culture/breaking-points-enneagram-analysis.md` → `/pop-culture/epstein-psychology-part-1`: - **The Epstein coverage**: Breaking Points keeps returning to the Epstein files. What kind of personality builds a network powerful people kept protecting? Start with our [Epstein psychology breakdown](/pop-culture/epstein-psychology-part-1).
- `src/blog/enneagram/enneagram-team-diversity.md` → `/enneagram-corner/how-each-enneagram-flexes`: To see what recognition each type is after, read [how each type flexes](/enneagram-corner/how-each-enneagram-flexes).
- `src/blog/enneagram/enneagram-dating-guide-for-women.md` → `/enneagram-corner/how-each-enneagram-flexes`: - [How your type shows off (and what it needs)](/enneagram-corner/how-each-enneagram-flexes)
- `src/blog/enneagram/mental-health/enneagram-science-mental-health.md` → `/enneagram-corner/neurodiversity-vs-personality`: For telling a clinical condition apart from a personality pattern, see [neurodiversity vs. personality](/enneagram-corner/neurodiversity-vs-personality).
- `src/blog/guides/definitive-guide-to-relationship-conflict-part-2.md` → `/how-to-guides/definitive-guide-to-self-efficacy`: Each time the tool works, you bank a small win, and small wins are <a href="/how-to-guides/definitive-guide-to-self-efficacy">the biggest driver of self-efficacy</a>.
- `src/blog/guides/productivity-systems-by-enneagram-type.md` → `/how-to-guides/definitive-guide-to-self-efficacy`: - <a href="/how-to-guides/definitive-guide-to-self-efficacy">Why You Don't Believe in Yourself</a>
- `src/blog/pop-culture/psychology-of-public-shame.md` → `/community/questions-are-the-engine-of-moral-awakening`: Questions built for performance are older than the internet, and [Genesis separates them from honest ones](/community/questions-are-the-engine-of-moral-awakening).
- `src/blog/enneagram/enneagram-connecting-lines.md` → `/enneagram-corner/situations-change-emotions-dont`: - **Track the pattern across situations**: [The Stress Paradox](/enneagram-corner/situations-change-emotions-dont) shows why your reactions stay the same when the job, city, or relationship changes.
- `src/blog/enneagram/oversharing-psychology-shame-boundaries.md` → `/enneagram-corner/enneagram-parenting-styles`: If the confessions keep circling back to your kids, read the Type 1 section of [Enneagram parenting styles](/enneagram-corner/enneagram-parenting-styles).
- `src/blog/enneagram/mental-health/enneagram-medication-mental-health.md` → `/enneagram-corner/mental-health/enneagram-therapy-resistance-guide`: The same patterns follow you into the therapist's office: see [how each type resists therapy](/enneagram-corner/mental-health/enneagram-therapy-resistance-guide).
- `src/blog/pop-culture/podcast-bros-enneagram-analysis.md` → `/pop-culture/tbpn-john-coogan-jordi-hays-enneagram-dynamic`: - **The Co-Host Split**: Each show profiled here centers on one host. [TBPN's Type 7 and Type 3 hosts](/pop-culture/tbpn-john-coogan-jordi-hays-enneagram-dynamic) want different things from the same desk. Does two-host chemistry beat one dominant voice?
- `src/blog/enneagram/enneagram-self-development.md` → `/enneagram-corner/enneagram-books-websites-podcasts`: Riso and Hudson map all nine levels in _The Wisdom of the Enneagram_, the depth pick in our [guide to Enneagram books and podcasts](/enneagram-corner/enneagram-books-websites-podcasts).
- `src/blog/enneagram/biggest-compliments-to-give-each-enneagram-type.md` → `/enneagram-corner/enneagram-dating-guide-for-women`: If you're a Type 2 woman, the [Enneagram dating guide for women](/enneagram-corner/enneagram-dating-guide-for-women) covers the other half: taking a compliment without deflecting it.
- `src/blog/pop-culture/twitter-x-personality-types-toxic.md` → `/pop-culture/alex-cooper-alix-earle-beef-enneagram-analysis`: For a creator feud fought through reposts, likes, and a public callout, see [Alex Cooper vs Alix Earle](/pop-culture/alex-cooper-alix-earle-beef-enneagram-analysis).
- `src/blog/enneagram/enneagram-books-websites-podcasts.md` → `/pop-culture/what-enneagram-type-are-most-musicians`: - [What Enneagram Type Are Most Musicians?](/pop-culture/what-enneagram-type-are-most-musicians): One domain from the corpus, worked through. Type 4 makes up 38.8% of 67 musician profiles, more than double its sitewide share.
- `src/blog/pop-culture/tech-titans-leadership-styles.md` → `/pop-culture/us-presidents-enneagram-analysis`: - **Boards Pick 9s, and So Do Voters**: After a fracture, America keeps electing Peacemakers: Lincoln after secession, Reagan after Vietnam, Obama after the crash. The [US presidents by Enneagram type](/pop-culture/us-presidents-enneagram-analysis) map runs the same successor logic at national scale.
- `src/blog/pop-culture/google-leadership-evolution.md` → `/pop-culture/us-presidents-enneagram-analysis`: - [US Presidents by Enneagram Type](/pop-culture/us-presidents-enneagram-analysis) — the same succession logic at national scale: after a fracture, voters keep reaching for a Type 9.
- `src/blog/enneagram/how-each-enneagram-flexes.md` → `/how-to-guides/using-the-enneagram-for-self-development`: Spotting the flex is step one, and [how to use the Enneagram past the test](/how-to-guides/using-the-enneagram-for-self-development) covers what to do next.
- `src/blog/community/what-winning-online-arguments-looks-like.md` → `/community/why-the-greek-vibe`: Socrates built a whole method on that idea, which is [why 9takes borrows the Greek look](/community/why-the-greek-vibe).
- `src/blog/pop-culture/fallen-founders-enneagram-analysis.md` → `/pop-culture/epstein-psychology-part-2`: Jeffrey Epstein bought the same kind of proof with donations to Harvard and MIT, a playbook traced in [how Epstein trapped the powerful](/pop-culture/epstein-psychology-part-2).
- `src/blog/pop-culture/kardashian-family-enneagram-analysis.md` → `/pop-culture/hollywood-heartthrobs-enneagram-analysis`: What that spotlight does to Chalamet himself gets its own section in [inside the heartthrob machine](/pop-culture/hollywood-heartthrobs-enneagram-analysis).
- `src/blog/pop-culture/comedy-kings-enneagram-analysis.md` → `/pop-culture/hollywood-heartthrobs-enneagram-analysis`: - **[Inside the Heartthrob Machine](/pop-culture/hollywood-heartthrobs-enneagram-analysis)**: Comedians build armor out of jokes. Heartthrobs build theirs out of hats, hoods, and blackout curtains. What does being wanted by millions cost a 4, a 6, and a 9?
- `src/blog/enneagram/enneagram-mental-health-flags.md` → `/enneagram-corner/how-each-enneagram-type-unwinds`: For the day-to-day side of self-care, start with [how each type actually recharges](/enneagram-corner/how-each-enneagram-type-unwinds).
- `src/blog/enneagram/how-each-enneagram-type-unwinds.md` → `/enneagram-corner/enneagram-party-planner`: The same rule applies when you [plan a party for mixed types](/enneagram-corner/enneagram-party-planner): what energizes one guest drains another.
- `src/blog/enneagram/enneagram-workplace-team-building.md` → `/enneagram-corner/enneagram-party-planner`: If the celebration is a party, [plan it for all nine types](/enneagram-corner/enneagram-party-planner), not just the 7s.
- `src/blog/enneagram/enneagram-harmonic-approaches.md` → `/enneagram-corner/enneagram-object-relations`: A third map, [the object relations triads](/enneagram-corner/enneagram-object-relations), regroups the same numbers again: attachment 3-6-9, frustration 1-4-7, rejection 2-5-8.
- `src/blog/enneagram/enneagram-types-in-relationships.md` → `/enneagram-corner/enneagram-object-relations`: - **[Object Relations by Enneagram Type](/enneagram-corner/enneagram-object-relations)**: Attachment, frustration, and rejection as three recurring relationship patterns
- `src/blog/community/why-im-selective-sharing-enneagram.md` → `/enneagram-corner/enneagram-coach-toolkit`: Coaching clients did ask, and even they stall until the [homework fits their type](/enneagram-corner/enneagram-coach-toolkit).
- `src/blog/enneagram/enneagram-stress-number.md` → `/enneagram-corner/enneagram-coach-toolkit`: If you coach clients through these patterns, start with [type-specific homework that sticks](/enneagram-corner/enneagram-coach-toolkit).
- `src/blog/enneagram/enneagram-personal-growth.md` → `/enneagram-corner/personality-maxing`: - **Want the social payoff?** Read [personality maxing](/enneagram-corner/personality-maxing), which turns self-knowledge into how people experience you.
- `src/blog/enneagram/philosophy-psychology-and-the-enneagram.md` → `/how-to-guides/how-to-psychoanalyze-people`: To use that architecture on the people in front of you, start with [how to read people in four steps](/how-to-guides/how-to-psychoanalyze-people).
- `src/blog/enneagram/enneagram-instinctual-subtypes.md` → `/how-to-guides/how-to-psychoanalyze-people`: To run the same test on someone else, use [this four-step guide to reading people](/how-to-guides/how-to-psychoanalyze-people).
- `src/blog/pop-culture/influencer-enneagram-types-instagram.md` → `/pop-culture/incel-blackpill-radicalization-enneagram`: | [The Blackpill Downward Spiral](/pop-culture/incel-blackpill-radicalization-enneagram)
- `src/blog/pop-culture/podcaster-personality-map.md` → `/pop-culture/cancel-culture-enneagram-type`: For the crowd's side of a public controversy, see [who cancels and who gets cancelled](/pop-culture/cancel-culture-enneagram-type).
- `src/blog/pop-culture/tech-titans-enneagram-analysis.md` → `/pop-culture/musk-vs-altman-trial-personality-dynamics`: - **[Musk vs Altman in Court](/pop-culture/musk-vs-altman-trial-personality-dynamics)**: A Type 5 and a Type 4 fought over OpenAI's founding promise. The jury only decided that Musk waited too long to sue.
- `src/blog/pop-culture/cancel-culture-enneagram-type.md` → `/community/memetic-comments`: Many latecomers simply adopt [the frame the first comments set](/community/memetic-comments).

**All added links, by target:**

- `/enneagram-corner/enneagram-vs-personality-frameworks-comparison` ← `/community/kantian-filters-and-nine-perspectives` ("models like the Big Five"), `/enneagram-corner/beginners-guide-to-determining-your-enneagram-type` ("Most personality systems"), `/enneagram-corner/enneagram-books-websites-podcasts` ("other frameworks"), `/enneagram-corner/enneagram-influences` ("most personality systems"), `/enneagram-corner/mental-health/enneagram-science-mental-health` ("The Big Five")
- `/community/fear-triad-intellectual-fortress-or-prison` ← `/enneagram-corner/attachment-styles-and-enneagram-types` ("intellectualize the intimacy problem"), `/enneagram-corner/enneagram-influences` ("head center"), `/enneagram-corner/mental-health/enneagram-addiction-recovery-guide` ("an intellectual exercise"), `/enneagram-corner/mental-health/enneagram-anxiety-complete-guide` ("fear-based thinking"), `/how-to-guides/5-tough-conversations-you-need-to-have-with-your-partner` ("Process through fear and anxiety")
- `/enneagram-corner/astrology-and-the-enneagram` ← `/community/introducing-9takes` ("Astrology assigns you a label from your birthday"), `/community/software-and-hardware-of-the-mind` ("Astrology"), `/enneagram-corner/90-day-personality-maxing-blueprint` ("zodiac sign"), `/how-to-guides/how-to-psychoanalyze-people` ("zodiac meme")
- `/enneagram-corner/love-languages-and-enneagram-types` ← `/enneagram-corner/enneagram-compatibility-matrix` ("quality time"), `/enneagram-corner/enneagram-instinctual-subtypes` ("acts of service"), `/enneagram-corner/enneagram-wings-complete-guide` ("shows love through acts of service"), `/enneagram-corner/toxic-traits-relationships-warning-signs` ("acts of service")
- `/enneagram-corner/how-to-apologize-like-a-pro` ← `/how-to-guides/dating-dynamics-by-enneagram-type` ("Apologize without justification"), `/how-to-guides/definitive-guide-to-relationship-conflict-part-1` ("sincere apologies"), `/pop-culture/cancel-culture-enneagram-type` ("Refuse to apologize"), `/pop-culture/psychology-of-public-shame` ("an apology that costs you something")
- `/pop-culture/tech-titans-ai-wars` ← `/pop-culture/google-leadership-evolution` ("the AI race"), `/pop-culture/tbpn-john-coogan-jordi-hays-enneagram-dynamic` ("Anthropic had overtaken OpenAI"), `/pop-culture/tech-titans-founders-vs-stewards` ("OpenAI launches ChatGPT"), `/pop-culture/tech-titans-leadership-styles` ("letting OpenAI get ahead with ChatGPT")
- `/enneagram-corner/mental-health/enneagram-science-mental-health` ← `/community/mbti-vs-enneagram` ("the research base is thinner"), `/enneagram-corner/enneagram-test-comparison-2026` ("the Enneagram's reliability and validity"), `/enneagram-corner/enneagram-vs-meyers-briggs` ("recent studies show correlations")
- `/enneagram-corner/enneagram-instinctual-subtypes` ← `/enneagram-corner/astrology-and-the-enneagram` ("three instinctual subtypes"), `/enneagram-corner/enneagram-compatibility-matrix` ("instinctual variants"), `/pop-culture/tech-titans-ai-wars` ("instinctual subtype")
- `/enneagram-corner/depression-patterns-by-enneagram-type` ← `/enneagram-corner/enneagram-and-mental-illness` ("how depression looks different in each type"), `/how-to-guides/guide-to-fighting-depression`, `/pop-culture/incel-blackpill-radicalization-enneagram`
- `/enneagram-corner/enneagram-types-in-stress` ← `/enneagram-corner/how-to-apologize-like-a-pro` ("specific ego protections"), `/enneagram-corner/mental-health/enneagram-neurodivergence-guide` ("the defenses each type reaches for under stress"), `/pop-culture/incel-blackpill-radicalization-enneagram`
- `/enneagram-corner/mental-health/enneagram-neurodivergence-guide` ← `/enneagram-corner/neurodiversity-vs-personality`, `/enneagram-corner/why-therapy-doesnt-work-the-same-for-every-type` ("ADHD, autism"), `/pop-culture/incel-blackpill-radicalization-enneagram`
- `/pop-culture/twitter-x-personality-types-toxic` ← `/community/introducing-9takes` ("rewards hot takes and engagement bait"), `/community/memetic-comments` ("Quote-tweeting someone to dunk on them")
- `/community/inspiration-for-9takes` ← `/community/kantian-filters-and-nine-perspectives` ("9takes was built"), `/enneagram-corner/enneagram-self-development` ("arguing with my wife")
- `/how-to-guides/definitive-guide-to-relationship-conflict-part-2` ← `/community/mbti-vs-enneagram` ("hitting the same walls in relationships"), `/enneagram-corner/shadow-work-by-enneagram-type` ("the same fight repeatedly")
- `/pop-culture/masculinity-strength-and-the-enneagram` ← `/community/societal-ticking-time-bombs` ("masculinity, identity, and proving yourself"), `/pop-culture/hollywood-heartthrobs-enneagram-analysis` ("toxic masculinity")
- `/enneagram-corner/enneagram-coach-toolkit` ← `/community/why-im-selective-sharing-enneagram` ("homework fits their type"), `/enneagram-corner/enneagram-stress-number` ("type-specific homework that sticks")
- `/pop-culture/trump-type-8-vs-biden-type-2` ← `/community/why-the-greek-vibe` ("understanding "the other side""), `/pop-culture/us-presidents-enneagram-analysis` ("Trump vs. Biden")
- `/enneagram-corner/personality-maxing` ← `/enneagram-corner/90-day-personality-maxing-blueprint` ("personality maxing"), `/enneagram-corner/enneagram-personal-growth` ("personality maxing")
- `/pop-culture/what-enneagram-type-are-most-musicians` ← `/enneagram-corner/enneagram-books-websites-podcasts` ("What Enneagram Type Are Most Musicians?"), `/enneagram-corner/enneagram-faqs` ("the musician archetype")
- `/enneagram-corner/how-each-enneagram-type-unwinds` ← `/enneagram-corner/enneagram-compatibility-matrix` ("separate recharge methods"), `/enneagram-corner/enneagram-mental-health-flags` ("how each type actually recharges")
- `/enneagram-corner/situations-change-emotions-dont` ← `/enneagram-corner/enneagram-connecting-lines` ("The Stress Paradox"), `/enneagram-corner/mental-health/enneagram-therapy-resistance-guide` ("get stuck in life")
- `/enneagram-corner/enneagram-online-dating-guide` ← `/enneagram-corner/enneagram-dating-guide-for-women` ("dating profiles"), `/enneagram-corner/how-to-navigate-early-relationship-stages` ("dating profile")
- `/enneagram-corner/how-each-enneagram-flexes` ← `/enneagram-corner/enneagram-dating-guide-for-women` ("How your type shows off (and what it needs)"), `/enneagram-corner/enneagram-team-diversity` ("how each type flexes")
- `/enneagram-corner/enneagram-object-relations` ← `/enneagram-corner/enneagram-harmonic-approaches` ("the object relations triads"), `/enneagram-corner/enneagram-types-in-relationships` ("Object Relations by Enneagram Type")
- `/how-to-guides/how-to-psychoanalyze-people` ← `/enneagram-corner/enneagram-instinctual-subtypes` ("this four-step guide to reading people"), `/enneagram-corner/philosophy-psychology-and-the-enneagram` ("how to read people in four steps")
- `/enneagram-corner/enneagram-types-and-career-choices` ← `/enneagram-corner/enneagram-type-7` ("roles with variety, autonomy, and creative latitude"), `/how-to-guides/definitive-guide-to-self-efficacy` ("greater job satisfaction")
- `/enneagram-corner/enneagram-party-planner` ← `/enneagram-corner/enneagram-workplace-team-building` ("plan it for all nine types"), `/enneagram-corner/how-each-enneagram-type-unwinds` ("plan a party for mixed types")
- `/enneagram-corner/biggest-compliments-to-give-each-enneagram-type` ← `/enneagram-corner/first-impression-cheat-sheet` ("Generic praise"), `/enneagram-corner/first-impression-enneagram-playbook` ("Compliment something they built or refined")
- `/enneagram-corner/enneagram-positive-self-talk` ← `/enneagram-corner/mental-health/enneagram-addiction-recovery-guide` ("dialogue with your critic"), `/enneagram-corner/mental-health/enneagram-therapy-guide` ("talk to yourself")
- `/pop-culture/comedy-kings-enneagram-analysis` ← `/enneagram-corner/mental-health/enneagram-therapy-resistance-guide` ("stand-up comedy"), `/enneagram-corner/why-the-next-thing-wont-fix-it-type-7` ("turned all of it into comedy")
- `/enneagram-corner/why-dating-apps-are-harder-for-certain-personality-types` ← `/how-to-guides/dating-dynamics-by-enneagram-type` ("Apps promise more matches"), `/pop-culture/incel-blackpill-radicalization-enneagram`
- `/how-to-guides/definitive-guide-to-self-efficacy` ← `/how-to-guides/definitive-guide-to-relationship-conflict-part-2`, `/how-to-guides/productivity-systems-by-enneagram-type`
- `/how-to-guides/the-crash-course-on-emotions-that-we-missed-in-kindergarten` ← `/how-to-guides/guide-to-fighting-depression`, `/how-to-guides/using-the-enneagram-for-self-development` ("characteristic emotional patterns")
- `/pop-culture/hollywood-heartthrobs-enneagram-analysis` ← `/pop-culture/comedy-kings-enneagram-analysis` ("Inside the Heartthrob Machine"), `/pop-culture/kardashian-family-enneagram-analysis` ("inside the heartthrob machine")
- `/personality-analysis/demis-hassabis` ← `/pop-culture/google-leadership-evolution` ("Demis Hassabis"), `/pop-culture/tech-titans-ai-wars` ("Demis Hassabis")
- `/pop-culture/us-presidents-enneagram-analysis` ← `/pop-culture/google-leadership-evolution` ("US Presidents by Enneagram Type"), `/pop-culture/tech-titans-leadership-styles` ("US presidents by Enneagram type")
- `/pop-culture/incel-blackpill-radicalization-enneagram` ← `/pop-culture/influencer-enneagram-types-instagram` ("The Blackpill Downward Spiral"), `/pop-culture/podcast-bros-enneagram-analysis` ("manosphere pipeline")
- `/pop-culture/cancel-culture-enneagram-type` ← `/pop-culture/parasocial-relationships-enneagram-type` ("public fallouts"), `/pop-culture/podcaster-personality-map` ("who cancels and who gets cancelled")
- `/community/questions-are-the-engine-of-moral-awakening` ← `/pop-culture/psychology-of-public-shame` ("Genesis separates them from honest ones"), `/pop-culture/reddit-moderators-type-1-internet` ("Why Platforms Reward Bad-Faith Questions")
- `/personality-analysis/alex-karp` ← `/pop-culture/tbpn-john-coogan-jordi-hays-enneagram-dynamic` ("Alex Karp"), `/pop-culture/tech-titans-ai-wars` ("Alex Karp")
- `/enneagram-corner/enneagram-team-diversity` ← `/pop-culture/tech-titans-ai-wars` ("personality monoculture"), `/pop-culture/tech-titans-leadership-styles` ("hire people who think like 5s")
- `/community/reddit-deep-connections-limitations` ← `/community/memetic-comments` ("Reddit's algorithm")
- `/community/kantian-filters-and-nine-perspectives` ← `/community/questions-are-the-engine-of-moral-awakening` ("different ways of processing reality")
- `/pop-culture/breaking-points-enneagram-analysis` ← `/community/societal-ticking-time-bombs` ("Saagar Enjeti from Breaking Points")
- `/personality-analysis/ray-dalio` ← `/community/software-and-hardware-of-the-mind` ("Ray Dalio")
- `/community/why-the-greek-vibe` ← `/community/what-winning-online-arguments-looks-like` ("why 9takes borrows the Greek look")
- `/community/what-winning-online-arguments-looks-like` ← `/community/why-the-greek-vibe` ("winning arguments")
- `/enneagram-corner/enneagram-vs-meyers-briggs` ← `/enneagram-corner/90-day-personality-maxing-blueprint` ("Myers-Briggs letters")
- `/enneagram-corner/enneagram-dating-guide-for-women` ← `/enneagram-corner/biggest-compliments-to-give-each-enneagram-type` ("Enneagram dating guide for women")
- `/enneagram-corner/enneagram-self-development` ← `/enneagram-corner/enneagram-and-religion` ("self-understanding and personal growth")
- `/enneagram-corner/enneagram-connecting-lines` ← `/enneagram-corner/enneagram-compatibility-matrix` ("your stress and security points")
- `/enneagram-corner/relationship-communication-guide` ← `/enneagram-corner/enneagram-compatibility-matrix` ("communication skills")
- `/community/why-im-selective-sharing-enneagram` ← `/enneagram-corner/enneagram-faqs` ("not an identity to broadcast")
- `/enneagram-corner/enneagram-books-websites-podcasts` ← `/enneagram-corner/enneagram-self-development` ("guide to Enneagram books and podcasts")
- `/personality-analysis/stephen-hawking` ← `/enneagram-corner/enneagram-wings-complete-guide` ("Stephen Hawking")
- `/personality-analysis/jennifer-lawrence` ← `/enneagram-corner/enneagram-wings-complete-guide` ("Jennifer Lawrence")
- `/how-to-guides/using-the-enneagram-for-self-development` ← `/enneagram-corner/how-each-enneagram-flexes` ("how to use the Enneagram past the test")
- `/enneagram-corner/enneagram-type-4` ← `/enneagram-corner/how-to-apologize-like-a-pro` ("Type 4")
- `/how-to-guides/definitive-guide-to-relationship-conflict-part-1` ← `/enneagram-corner/how-to-apologize-like-a-pro` ("a specific conflict")
- `/enneagram-corner/how-each-enneagram-type-manipulates` ← `/enneagram-corner/how-to-apologize-like-a-pro` ("stop accepting performances as repair")
- `/enneagram-corner/attachment-styles-and-enneagram-types` ← `/enneagram-corner/mental-health/enneagram-anxiety-complete-guide` ("anxious attachment")
- `/enneagram-corner/mental-health/enneagram-therapy-resistance-guide` ← `/enneagram-corner/mental-health/enneagram-medication-mental-health` ("how each type resists therapy")
- `/enneagram-corner/enneagram-and-adhd-which-types-struggle-most` ← `/enneagram-corner/mental-health/enneagram-neurodivergence-guide` ("Executive-function difficulties")
- `/enneagram-corner/mental-health/enneagram-anxiety-complete-guide` ← `/enneagram-corner/mental-health/enneagram-neurodivergence-guide` ("anxiety")
- `/community/personality-frameworks-map-not-territory` ← `/enneagram-corner/mental-health/enneagram-parenting-mental-health` ("the map, not the territory")
- `/enneagram-corner/neurodiversity-vs-personality` ← `/enneagram-corner/mental-health/enneagram-science-mental-health` ("neurodiversity vs. personality")
- `/enneagram-corner/enneagram-parenting-styles` ← `/enneagram-corner/oversharing-psychology-shame-boundaries` ("Enneagram parenting styles")
- `/enneagram-corner/toxic-traits-relationships-warning-signs` ← `/enneagram-corner/red-flags-dating-each-enneagram-type` ("relationship red flags")
- `/enneagram-corner/how-to-navigate-early-relationship-stages` ← `/enneagram-corner/situations-change-emotions-dont` ("new relationship")
- `/personality-analysis/marcus-aurelius` ← `/enneagram-corner/situations-change-emotions-dont` ("Marcus Aurelius")
- `/how-to-guides/5-tough-conversations-you-need-to-have-with-your-partner` ← `/how-to-guides/the-crash-course-on-emotions-that-we-missed-in-kindergarten` ("four communication patterns that predict divorce")
- `/how-to-guides/guide-to-fighting-depression` ← `/how-to-guides/using-the-enneagram-for-self-development` ("struggles with depression")
- `/pop-culture/kardashian-family-enneagram-analysis` ← `/pop-culture/alex-cooper-alix-earle-beef-enneagram-analysis` ("Kardashian family analysis")
- `/pop-culture/epstein-psychology-part-1` ← `/pop-culture/breaking-points-enneagram-analysis` ("Epstein psychology breakdown")
- `/community/memetic-comments` ← `/pop-culture/cancel-culture-enneagram-type` ("the frame the first comments set")
- `/enneagram-corner/enneagram-and-mental-illness` ← `/pop-culture/dark-triad-meets-enneagram` ("Narcissistic Personality Disorder")
- `/personality-analysis/ryan-grim` ← `/pop-culture/epstein-psychology-part-1` ("Ryan Grim")
- `/pop-culture/ghislaine-maxwell-psychology` ← `/pop-culture/epstein-psychology-part-2` ("Ghislaine Maxwell's full psychology")
- `/pop-culture/epstein-psychology-part-2` ← `/pop-culture/fallen-founders-enneagram-analysis` ("how Epstein trapped the powerful")
- `/personality-analysis/brad-pitt` ← `/pop-culture/hollywood-heartthrobs-enneagram-analysis` ("Brad Pitt")
- `/personality-analysis/johnny-depp` ← `/pop-culture/hollywood-heartthrobs-enneagram-analysis` ("Johnny Depp")
- `/personality-analysis/kanye` ← `/pop-culture/kardashian-family-enneagram-analysis` ("Kanye West")
- `/personality-analysis/david-goggins` ← `/pop-culture/podcast-bros-enneagram-analysis` ("David Goggins")
- `/pop-culture/tbpn-john-coogan-jordi-hays-enneagram-dynamic` ← `/pop-culture/podcast-bros-enneagram-analysis` ("TBPN's Type 7 and Type 3 hosts")
- `/personality-analysis/shawn-ryan` ← `/pop-culture/podcaster-personality-map` ("Shawn Ryan")
- `/personality-analysis/howard-stern` ← `/pop-culture/podcaster-personality-map` ("Howard Stern")
- `/personality-analysis/jordi-hays` ← `/pop-culture/podcaster-personality-map` ("Jordi Hays")
- `/enneagram-corner/enneagram-social-styles` ← `/pop-culture/tbpn-john-coogan-jordi-hays-enneagram-dynamic` ("assertive group")
- `/personality-analysis/alex-hormozi` ← `/pop-culture/tbpn-john-coogan-jordi-hays-enneagram-dynamic` ("Alex Hormozi")
- `/pop-culture/google-leadership-evolution` ← `/pop-culture/tech-titans-ai-wars` ("Sundar Pichai's organization")
- `/pop-culture/musk-vs-altman-trial-personality-dynamics` ← `/pop-culture/tech-titans-enneagram-analysis` ("Musk vs Altman in Court")
- `/pop-culture/tech-titans-disruptors` ← `/pop-culture/tech-titans-founders-vs-stewards` ("leaps an 8 makes instinctively")
- `/personality-analysis/david-friedberg` ← `/pop-culture/tech-titans-leadership-styles` ("David Friedberg")
- `/personality-analysis/kim-kardashian` ← `/pop-culture/trump-type-8-vs-biden-type-2` ("Kim Kardashian")
- `/personality-analysis/kamala-harris` ← `/pop-culture/trump-type-8-vs-biden-type-2` ("Kamala Harris")
- `/pop-culture/tech-titans-platform-emperors` ← `/pop-culture/twitter-x-personality-types-toxic` ("Elon Musk's October 2022 purchase")
- `/pop-culture/alex-cooper-alix-earle-beef-enneagram-analysis` ← `/pop-culture/twitter-x-personality-types-toxic` ("Alex Cooper vs Alix Earle")
- `/personality-analysis/jackie-kennedy` ← `/pop-culture/us-presidents-enneagram-analysis` ("Jackie Kennedy")
- `/personality-analysis/michelle-obama` ← `/pop-culture/us-presidents-enneagram-analysis` ("Michelle Obama")

**Noticed (for DJ):**

- Typing conflicts between posts and people pages: Trump (3 on his page and US Presidents; 8 in trump-vs-biden and the wings guide), Kanye (3 in the Kardashian post; 7 on his page and the musicians post), Johnny Depp (4w3 in the wings guide; 4w5 on his page)
- Do-not-write hits still live (childhood-wound etiology): enneagram-object-relations (core thesis), enneagram-childhood-stereotypes, enneagram-mental-health-flags, enneagram-compatibility-matrix, trump-vs-biden "Where It All Started" sections. Fixed today: MBTI InsightBox + "childhood wound" line, love-languages WHAT/WHY opener.
- Contradictions: science page says do not decide compatibility by type while compatibility-matrix does exactly that; dark-triad says the Enneagram cannot type someone from the public record while maxwell/fallen-founders do; enneagram-vs-meyers-briggs says "gaining traction in clinical settings" vs science page "not a clinical tool"
- Stale corpus counts: "325 profiles" (FAQ, depression guide, 5-tough-conversations, self-efficacy), "293" (books page), "57 musicians / 35.1%" (FAQ) vs 67 / 38.8% / 379 in the musicians post
- Fixed today (objective errors): Type 2 growth arrow (2→4, not 8) in epstein-part-1 + unwinds FAQ; counterphobic 6 is One-to-One, not Self-Preservation (subtypes FAQ + JSON-LD); Genesis 3:9 is God's first question (serpent asks in 3:1); Kim Kardashian passed the baby bar, has no law degree
- Unverified: situations-change-emotions-dont quotes a popular Marcus Aurelius paraphrase as a translation
- Still short of the gate (grandfathered): kardashian-family (1 in needed), reddit-moderators, societal-ticking-time-bombs (anti-SSRI piece; linking from medication posts is a safety call for DJ), tbpn, trump-vs-biden, alex-cooper-alix-earle, fallen-founders (2), ghislaine-maxwell
