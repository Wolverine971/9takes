<!-- docs/content-analysis/2026-08-03_people-persona-title-audit.md -->

# People Persona Title Quality Audit

**Audit date:** 2026-08-03  
**Scope:** 27 people-wall titles, all 27 complete local articles, the current wall JSON, the rendered three-column wall image, and a read-only live database comparison  
**Implementation status:** Approved and applied on 2026-08-03. See `Implementation outcome` below.

## Executive conclusion

The current set contains 12 titles that already meet the bar, 6 titles with a strong core that need reworking, and 9 titles that should be replaced. The strongest titles do not merely sound dramatic. They name the mechanism that organizes the article, create an image the reader understands immediately, and feel difficult to transfer to another public figure.

Oprah Winfrey's "Television's Patron Saint of Pain" is the clearest benchmark. It names her medium, her near-sacred role as a witness and validator, and the material she learned to minister to because of her own childhood. It is provocative without reducing her to a diagnosis. It also reads naturally after her name and fits the card cleanly.

The recommended set removes symptom-first labels, broadens platform-locked framing, separates three overlapping disappearance metaphors, and reduces the wall's dependence on generic industry-plus-noun constructions.

## Method and score key

Every local article was read in full. Each current title was scored from 1 to 5 in this order:

`AF / PS / NP / M / C / R / VF`

- `AF`: article fidelity
- `PS`: person specificity
- `NP`: natural phrasing
- `M`: memorability
- `C`: clarity
- `R`: range
- `VF`: visual fit

Scores guide the verdict but do not determine it mechanically. A serious fidelity, clarity, tone, or range failure overrides a respectable total.

## Source-state and live database drift

The wall JSON and all 27 local article frontmatter values agree. A read-only comparison of parser-cleaned local article content with `blogs_famous_people.content` found exact matches for 22 of 27 profiles. Five live rows differ from the local article body:

| Person     | Local content characters | Live content characters | Persona-title state                                                             |
| ---------- | -----------------------: | ----------------------: | ------------------------------------------------------------------------------- |
| Dua Lipa   |                   18,981 |                  19,075 | Local and wall: "Pop's Precision Optimist"; live: "Pop's Relentless Rule-Maker" |
| Sam Altman |                   54,883 |                  52,102 | Title matches; article body differs                                             |
| Elon Musk  |                   18,498 |                  18,411 | Title matches; article body differs                                             |
| Zendaya    |                   41,180 |                  27,922 | Title matches; article body differs materially in length                        |
| Jack Black |                   30,145 |                  30,110 | Title matches; article body differs                                             |

The audit follows the local articles named by the tasker. The live drift is reported here for the later implementation pass and was not reconciled. Dua's live "Relentless Rule-Maker" is not treated as the current wall title, and it is not recommended: it repeats Type 1 language for a Type 3 and still misses the article's more specific criticism-to-specification mechanism.

## Benchmark set

Oprah establishes the bar. Five other current titles approach it for the same reason: the surface image and the article mechanism are the same thing.

| Person            | Current title                          | Why it approaches the benchmark                                                                                                                   |
| ----------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Meghan Markle     | The Calligrapher Who Burned the Palace | Meticulous care and combative rupture coexist in one specific, memorable image.                                                                   |
| Sabrina Carpenter | Pop's Winking Machine                  | "Wink" and "machine" are both repeated article concepts: humor controls exposure while a decade-long achievement system keeps running.            |
| Elon Musk         | Technology's Apocalyptic Engineer      | Engineering is both his literal method and his defense against helplessness; apocalypse names the catastrophic futures that organize his choices. |
| Robert Greene     | Power's Cold Cartographer              | The title captures the observer who maps power from a distance and converts unreadability into a usable system.                                   |
| Lionel Messi      | Football's Quiet Volcano               | The article repeatedly shows dominance and buried anger operating beneath stillness, from his walking reconnaissance to rare eruptions.           |

These titles are compact, article-specific, legible on first contact, and powered by evidence rather than type labels.

## 27-title decision table

| Type | Person            | Current title                              | Scores        | Article thesis                                                                                                                                                   | Verdict     | Concise reason                                                                                                                                 | Recommended final title                        |
| ---: | ----------------- | ------------------------------------------ | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
|    1 | Emma Watson       | Hollywood's Conscientious Objector         | 5/4/5/5/5/5/5 | Her inner critic turns principle and mastery into obligations she cannot quietly abandon, even when privilege cushions the cost.                                 | **Keep**    | "Conscientious" names the moral standard and "objector" names her refusal to stay silent or keep performing work that fails it.                | **Hollywood's Conscientious Objector**         |
|    1 | Steve Jobs        | Silicon Valley's Restless Perfectionist    | 3/2/5/2/5/4/4 | Invisible quality became a moral obligation, and the same unforgiving standard produced beautiful objects while brutalizing people.                              | **Replace** | The current title is fluent but generic, repeats the visible type label, and misses the craftsman-versus-people tension.                       | **Silicon Valley's Unforgiving Craftsman**     |
|    1 | Jordan Peterson   | Psychology's Weeping Crusader              | 2/3/3/4/4/2/5 | He experiences order as moral duty, so chaos summons conviction that can restore lives or harden into harsh certainty.                                           | **Replace** | It reduces a wide order-and-obligation thesis to one visible behavior and risks sounding mocking.                                              | **The Professor Who Can't Let Chaos Win**      |
|    2 | Margot Robbie     | The Star Who Finds You Through Your Need   | 3/4/2/3/2/3/3 | She locates people through what they need, then scales giving into an architecture that makes her emotionally and professionally load-bearing.                   | **Replace** | The underlying need image is valid, but the pronouns are awkward and the phrase hides the stronger structural metaphor.                        | **Hollywood's Load-Bearing Heart**             |
|    2 | Oprah Winfrey     | Television's Patron Saint of Pain          | 5/5/5/5/5/5/5 | She turned childhood invisibility into an ability to make people feel seen, then built an empire whose validation gift also creates trust blind spots.           | **Keep**    | It names the medium, cultural role, wound, and method in five natural words.                                                                   | **Television's Patron Saint of Pain**          |
|    2 | Meghan Markle     | The Calligrapher Who Burned the Palace     | 5/5/5/5/4/5/4 | She tries to earn belonging through meticulous giving, then fights and rewrites the room when care fails or the arrangement feels unjust.                        | **Keep**    | The contrast between calligraphic care and palace-burning rupture captures the article's full tension with unusual specificity.                | **The Calligrapher Who Burned the Palace**     |
|    3 | Sabrina Carpenter | Pop's Winking Machine                      | 5/5/5/5/5/4/5 | She architects image, output, and humor so she can expose the joke before shame lands, while protecting an off-camera self from the machine.                     | **Keep**    | Both nouns are article mechanisms, and the compact contradiction is immediately legible.                                                       | **Pop's Winking Machine**                      |
|    3 | Taylor Swift      | Pop's Strategic Alchemist                  | 5/4/5/5/5/5/5 | She converts betrayal, humiliation, and lost control into planned reinvention while still searching for worth and loyalty beyond achievement.                    | **Keep**    | "Strategic" and "alchemist" accurately describe deliberate conversion rather than vague ambition.                                              | **Pop's Strategic Alchemist**                  |
|    3 | Dua Lipa          | Pop's Precision Optimist                   | 2/2/3/2/4/3/5 | She turns criticism into a work specification and distant goals into proof, though over-revision can drain the spark she is trying to perfect.                   | **Replace** | The phrase is a transferable adjective bundle and does not express criticism becoming a plan.                                                  | **The Star Who Turns Doubt into Deadlines**    |
|    4 | Billie Eilish     | Gen Z's Beautiful Wound                    | 3/2/4/4/3/2/5 | She converts real pain into authentic art, but every public version becomes another image she must outgrow before it cages her.                                  | **Replace** | It romanticizes pain, narrows her to a generation, and freezes an article about repeated self-revision into one wound.                         | **Pop's Unfinished Self-Portrait**             |
|    4 | Robert Pattinson  | Hollywood's Disappearing Act               | 4/3/5/4/4/3/5 | Because he often feels unreal, he dismantles assigned identities through fabricated interviews, strange roles, private art, and selective disappearance.         | **Rework**  | The disappearance direction is sound, but the phrase is generic and collides with Murphy and Gosling elsewhere on the wall.                    | **Hollywood's Honest Liar**                    |
|    4 | Sam Altman        | AI's Existential Architect                 | 3/3/4/3/3/4/5 | He turns outsider identity into leadership by going first and listening closely, then absorbs rupture and contradiction into an ongoing story of who he is.      | **Rework**  | "Existential" is relevant, but "architect" is generic technology language and misses the article's recurring island-leadership frame.          | **Silicon Valley's King of Every Island**      |
|    5 | Elon Musk         | Technology's Apocalyptic Engineer          | 5/5/5/5/5/5/5 | He uses competence and systems as refuge from helplessness, turning every threat or dependency into another layer he can engineer and own.                       | **Keep**    | The title joins his literal method to the catastrophic future models that drive it.                                                            | **Technology's Apocalyptic Engineer**          |
|    5 | Cillian Murphy    | Cinema's Invisible Vessel                  | 4/3/2/3/2/3/5 | He protects finite inner resources through withdrawal and exhaustive preparation, then abandons control so completely that the role replaces reality.            | **Replace** | "Vessel" points toward surrender but sounds abstract, while "invisible" creates another vague disappearance title.                             | **The Actor Who Cancels Reality**              |
|    5 | Robert Greene     | Power's Cold Cartographer                  | 5/5/5/5/5/5/5 | Early unreadability taught him to observe power from a distance and map it into systems, until a stroke forced dependence and reopened wonder.                   | **Keep**    | It is precise, compact, and inseparable from his card system, books, and observer stance.                                                      | **Power's Cold Cartographer**                  |
|    6 | Zendaya           | Hollywood's Weaponized Worrier             | 3/3/2/4/1/3/5 | She treats anxiety as a detection system and converts it into preparation, controlled exposure, protected relationships, and an exit mapped in advance.          | **Replace** | The warrior misread is a decisive clarity failure, and the militarized phrase makes her strategy sound like a gimmick.                         | **The Star Who Builds the Exit First**         |
|    6 | Timothée Chalamet | The Prodigy Who Needs Protecting           | 3/4/5/4/5/2/4 | He turns catastrophe-scanning into preparation, tests authorities and collaborators for safety, and is gradually learning to set vigilance down.                 | **Rework**  | The sourced protection idea is real, but the passive wording infantilizes him and freezes the article at an early-career moment.               | **The Prodigy Who Prepares for Everything**    |
|    6 | Marilyn Monroe    | Hollywood's Armored Icon                   | 5/4/5/4/5/5/5 | Marilyn was armor rather than identity, a persona she could switch on while testing partners, teachers, and protectors for safety and loyalty.                   | **Keep**    | It states the article's central distinction cleanly and leaves room for intellect, business courage, and fear beneath the image.               | **Hollywood's Armored Icon**                   |
|    7 | Jack Black        | Comedy's Boundless Showman                 | 2/2/5/2/5/3/5 | He converted escape and numbing energy into performance, while his most revealing growth appears in restraint, quiet, and principle under stress.                | **Replace** | The title is pleasant but transferable and describes only the public surface the article complicates.                                          | **Comedy's Loudest Man Goes Quiet**            |
|    7 | Kai Cenat         | Twitch's Perpetual Motion Machine          | 4/5/5/5/5/2/4 | Constant motion keeps heavier feelings from landing, even as he reaches for peace and expands beyond streaming into education, fashion, and culture.             | **Rework**  | The core metaphor is excellent and article-wide; only the Twitch frame is materially too narrow.                                               | **Streaming's Perpetual Motion Machine**       |
|    7 | John F. Kennedy   | Camelot's Graceful Fugitive                | 5/5/5/5/4/5/5 | Chronic pain and emotional distance became motion, charm, and reframing, while his best decisions came when he stopped fleeing long enough to stay with reality. | **Keep**    | "Graceful" names the manufactured public ease and "fugitive" names the lifelong flight from pain.                                              | **Camelot's Graceful Fugitive**                |
|    8 | IShowSpeed        | Streaming's Homesick Warlord               | 5/5/5/5/4/5/5 | Volume and conquest became armor against invisibility, but global expansion keeps revealing a quieter search for belonging, faith, and home.                     | **Keep**    | The warlord/home contradiction is the article's conquest-versus-belonging thesis, not decorative drama.                                        | **Streaming's Homesick Warlord**               |
|    8 | MrBeast           | The Algorithm Monk Who Can't Stop Building | 5/5/5/5/5/5/3 | Isolation and illness drove him into monastic algorithm mastery and endless reinvestment, until the empire built for control became his cage.                    | **Keep**    | Every word is article-grounded; the exact 42-character length is a justified visual exception that remains readable.                           | **The Algorithm Monk Who Can't Stop Building** |
|    8 | Joe Rogan         | Podcasting's Alpha Interrogator            | 3/3/3/3/4/4/5 | Self-trust and autonomy built his confrontational conversation style and redundant empire, while the same gut certainty creates his central blind spot.          | **Rework**  | "Interrogator" is useful, but "alpha" is generic manosphere shorthand and does not express the strength/blind-spot mechanism.                  | **The Interrogator Who Trusts His Gut**        |
|    9 | Lionel Messi      | Football's Quiet Volcano                   | 5/5/5/5/5/5/5 | Stillness and self-erasure became scanning and team play, while immense hunger and buried anger remain active beneath the calm.                                  | **Keep**    | The compact contradiction is supported by his walking reconnaissance, rare eruptions, and ravenously disconnected drive.                       | **Football's Quiet Volcano**                   |
|    9 | Ryan Gosling      | Hollywood's Gentle Vanishing Man           | 4/3/3/4/4/4/4 | He merges with roles and relationships so completely that others project themselves onto him, while quiet stubbornness protects what he loves.                   | **Rework**  | The direction is valid, but the phrasing is soft, less specific than the projection evidence, and duplicates the set's disappearance language. | **The Movie Star Everyone Projects Onto**      |
|    9 | Selena Gomez      | Pop's Steady Presence                      | 2/1/5/1/5/3/5 | Peace borrowed through merging and withdrawal matures into peace she creates, receives, and returns to after conflict without surrendering her place.            | **Replace** | The current title is generic, static, and could belong to almost any reliable pop star.                                                        | **The Peacemaker Who Learned to Stay**         |

## Evidence for the 12 Keep verdicts

### Emma Watson

- At nine, she feared failing Hermione before she feared fame, which establishes mastery as obligation rather than image management.
- Her HeForShe question, "If not me, who? If not now, when?", and her later Rowling break show that silence becomes morally unavailable once a standard is clear.
- The five-year acting withdrawal, Oxford DPhil work, and Renais launch show the same conscience governing career, study, and commerce.

### Oprah Winfrey

- The child who made a corncob doll and later asked Harvard, "Was that okay?", became unusually attuned to whether another person feels seen.
- Her interview gift turns pain into validation, while the school she built functions as the childhood environment she needed herself.
- The McCarthy, John of God, and Mo'Nique sections show the shadow: she can trust a helper's self-presentation because she recognizes and rewards the role she inhabits.

### Meghan Markle

- Calligraphy makes love visible through precision, and the census form, eleven-year-old letter campaign, and Grenfell cookbook show care becoming action.
- Palace conflict begins when the institution does not deliver care in return, after which writing, litigation, and public narrative become tools of repair and combat.
- The article holds humanitarian work and self-mythologizing together, which is exactly why the delicate calligrapher and burned palace belong in one phrase.

### Sabrina Carpenter

- The purple-basement years and decade-long climb support "machine" as earned discipline rather than insult.
- Title-first songwriting, the evolving "Nonsense" outros, and her habit of saying the exposing thing first make the wink a control system.
- Her political stands, production work, and protected inner circle show that the machinery can serve values while the off-camera person guards room to exist.

### Taylor Swift

- The snake humiliation became the deliberate visual and narrative system of `Reputation`.
- Losing control of her masters became re-recording, fan mobilization, and eventually ownership, the clearest alchemy in the article.
- The Apple letter, private fan aid, body-image reckoning, and defense of close friends show strategy operating alongside a continuing need for loyalty and worth.

### Elon Musk

- Sleeping on the Model 3 conference-room floor turns engineering competence into refuge when the system feels out of control.
- First-principles analysis repeatedly ends in owning the missing layer, from launch systems and satellites to AI and political influence.
- The doomsday kit and species-redundancy logic make "apocalyptic" literal, while family ruptures show the human costs he cannot debug as quickly as technical ones.

### Robert Greene

- A journalist father who remained unreadable taught Greene to watch power rather than trust its presentation.
- Eighty jobs and thousands of notecards became a fortress of observation that produced books mapping power from a cold distance.
- The stroke forced him to depend on other people for ordinary tasks and shifted his later work toward the sublime, without invalidating the cartography that came before.

### Marilyn Monroe

- She could switch "Marilyn" on and off, making the public figure explicit armor rather than a stable self.
- Eleven foster homes, a trauma-shaped voice, and repeated tests of DiMaggio, Miller, and the Strasbergs establish the safety problem under the icon.
- Her 430-book library and production company show that the armor protected intelligence and leverage, not only vulnerability.

### John F. Kennedy

- Chronic illness, crutches outside camera range, and a daily drug regimen sat behind a public performance of vitality and ease.
- He manufactured charisma over fifteen years and used humor to close the door on pain before feeling could land.
- Vienna exposed the limits of charm; during the Cuban Missile Crisis he finally stayed with complexity long enough to find an option his advisers had missed.

### IShowSpeed

- The empty school desk and the later tour-bus confession of loneliness make volume a defense against invisibility.
- His movement through gaming, music, WWE, and global tours reads like territorial conquest, while silence in Senegal and the Ghanaian naming ceremony reveal a search for home.
- The Tokyo hospital prayer, protection of siblings, and repeated Ronaldo tears show the attachment need beneath the warlord surface.

### MrBeast

- A teacher once thought he was mute; he later spent one thousand consecutive days studying the algorithm with monastic exclusion of normal life.
- He reinvests nearly everything, builds ever larger productions, and describes himself as a robot or zoo animal inside the businesses he created.
- Crohn's disease turns physical helplessness into a drive to repair helplessness in others, while the production manual shows how unforgiving the machine becomes.

### Lionel Messi

- The child who hid behind a tree to avoid empty running later walked through matches to build a map of the field in his head.
- Pre-match vomiting, a two-month international retirement, and the rare red card reveal accumulated force beneath the calm.
- His unexpected Copa America speech and the 2026 final show both sides of stillness: it can become decisive leadership or, when every corridor closes, absence.

## Detailed recommendations for Rework and Replace verdicts

### Steve Jobs, Replace

The article is not simply about high standards. It is about a craftsman's belief that unseen quality is morally binding, paired with a failure to extend the same care to people.

Evidence anchors:

- Jobs insisted the Macintosh circuit board be beautiful even though customers would never see it, invoking the carpenter who does not use bad wood on the back of a cabinet.
- His hero-or-bozo judgments, public tears, and brutal employee treatment show a standard with no allowance for ordinary human imperfection.
- He denied paternity of Lisa while naming a product after her, and later delayed cancer surgery while seeking a purer solution, showing the cost of perfection turned against reality.

| Candidate                                  | Central image and evidence                                                                                                                            |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Silicon Valley's Unforgiving Craftsman** | Recommended. "Craftsman" comes from the unseen cabinet and product discipline; "unforgiving" covers both the beauty of the work and the human damage. |
| The Perfectionist Who Spared Nothing       | Names the total cost to products, employees, family, and eventually his own body, though it retains the generic type label.                           |
| Technology's Beautiful Tyrant              | Captures the beautiful-object versus brutal-person contradiction, but "tyrant" is harsher and less psychologically precise.                           |
| The Man Who Perfected Things, Not People   | States the full contrast plainly, but is longer and reads more like an essay headline than a compact persona.                                         |

Aloud winner: **Steve Jobs: Silicon Valley's Unforgiving Craftsman.** It is natural, 38 characters, and more difficult to transfer than the current title.

### Jordan Peterson, Replace

The article's operating system is moral obligation. Order is not an aesthetic preference for Peterson; it is a defense against chaos that can become service, commandment, or inflexibility.

Evidence anchors:

- His numbered rules, extreme orderliness, and "miracle of the mundane" framing turn ordinary structure into moral duty.
- The C-16 dispute and College of Psychologists fight show his reflex to crusade when an institution appears to compel or corrupt speech.
- His tears arrive when he describes suffering and the gap between a life in chaos and a remedy he believes people can enact; the Academy is a constructive version of the same compulsion.

| Candidate                                       | Central image and evidence                                                                                                   |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **The Professor Who Can't Let Chaos Win**       | Recommended. It covers rules, public fights, tears, and institution-building without making any single symptom the identity. |
| Order's Unbending Evangelist                    | Connects moral persuasion to rigidity, but the abstraction is colder and less natural aloud.                                 |
| The Man Who Made Order a Moral Duty             | States the article thesis directly, though at eight words it is less compact.                                                |
| The Professor Who Turns Chaos into Commandments | Uses the numbered rules and religious register, but is slightly more dramatic than the evidence requires.                    |
| The Compass That Refuses to Bend                | Captures conviction and blindness, but loses his teaching role and could transfer to other moral crusaders.                  |

Aloud winner: **Jordan Peterson: The Professor Who Can't Let Chaos Win.** It is clear, 37 characters, and lets the crying remain evidence rather than the thesis. This directly answers DJ's objection to "Weeping Crusader."

### Margot Robbie, Replace

The article shows a giver who reads people through need and then turns that sensitivity into structures, companies, and relationships that depend on her.

Evidence anchors:

- She could not initially locate Barbie because the character lacked an obvious childhood wound, revealing how she enters a person through need.
- Daily gifts for Ryan Gosling and the relational work around collaborators show giving as her preferred access point.
- LuckyChap, pay equity, and the article's load-bearing-wall metaphor show care becoming architecture; panic and stress reveal the cost of making herself structurally necessary.

| Candidate                                    | Central image and evidence                                                                                           |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Hollywood's Load-Bearing Heart**           | Recommended. It joins emotional generosity to the exact structural role the article says she assumes.                |
| The Star Who Builds Around Your Need         | Preserves the current need direction but replaces the awkward "finds you through" phrasing with an active structure. |
| Hollywood's Architect of Generosity          | Connects LuckyChap and giving, but "architect" is common in the current title vocabulary.                            |
| The Producer Who Makes Herself Indispensable | Names the professional consequence clearly, though it undersells her acting and warmth.                              |
| The Giver Who Built Her Own Studio           | Connects Type 2 energy to LuckyChap in a concrete way, but the studio is only one part of the arc.                   |

Aloud winner: **Margot Robbie: Hollywood's Load-Bearing Heart.** It is 30 characters, emotionally legible, and substantially cleaner than the current pronoun construction.

### Dua Lipa, Replace

The article's distinctive mechanism is converting doubt into a specification, then using explicit future targets as proof that the old criticism no longer applies.

Evidence anchors:

- The viral "give us nothing" criticism became a detailed performance problem to solve rather than a wound she discussed publicly.
- She named a Friday-night Glastonbury slot as a concrete target years before reaching it.
- Ninety-seven songs and repeated revisions for `Radical Optimism` show both the power and artistic risk of applying more precision after the point of sufficiency; Service95 widens the score beyond music.

| Candidate                                   | Central image and evidence                                                                                             |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **The Star Who Turns Doubt into Deadlines** | Recommended. It unites criticism, planning, proof, and the Glastonbury target in a natural seven-word phrase.          |
| Pop's Meticulous Rebuttal                   | Treats the post-meme career as an answer built through work, but the abstract noun gives less access to the mechanism. |
| The Planner Who Outworks the Doubt          | Captures discipline and response to criticism, though "planner" feels smaller than her public identity.                |
| The Star Who Makes Criticism a Checklist    | Most literally states the article's criticism-to-specification move, but is less elegant aloud.                        |
| Pop's Blueprint for Proving Them Wrong      | Captures planned vindication, though it leans more combative than her actual public tone.                              |

Aloud winner: **Dua Lipa: The Star Who Turns Doubt into Deadlines.** It is 39 characters and clearer than both the local "Precision Optimist" and the live database's "Relentless Rule-Maker."

### Billie Eilish, Replace

The article is about repeated self-revision. Pain becomes art, the art becomes a public identity, and the once-authentic identity becomes the next box to escape.

Evidence anchors:

- A dance injury led to "Ocean Eyes," turning bodily loss into the first public version of Billie.
- Baggy clothes and the `Vogue` transformation came from the same body wound, even though audiences treated them as opposing selves.
- She felt like a parody of herself by eighteen, then returned to the drowned-girl imagery in `Hit Me Hard and Soft`, making self-portraiture visibly unfinished.

| Candidate                               | Central image and evidence                                                                                               |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Pop's Unfinished Self-Portrait**      | Recommended. It captures authentic self-expression, visual reinvention, and the refusal to let any version become final. |
| The Artist Who Outgrows Every Version   | States the recurring cycle most clearly, but adds another "The X Who" construction to the wall.                          |
| The Voice That Outgrew Its Whisper      | Connects "Ocean Eyes" and vocal identity to later range, but overweights music relative to image and body.               |
| The Artist Trapped by Every Reinvention | Names the shadow of authenticity becoming a cage, though "trapped" makes the article sound more static than it is.       |

Aloud winner: **Billie Eilish: Pop's Unfinished Self-Portrait.** It is 30 characters, avoids romanticizing pain, and makes continued change the identity.

### Robert Pattinson, Rework

The current title points in the right direction, but three wall profiles currently vanish or disappear. Pattinson's differentiator is not disappearance alone. It is his use of fabrication to resist being mistaken for a fixed, real public self.

Evidence anchors:

- He described himself as "90 percent vapor," making unreality the internal problem rather than fame alone.
- Fake interview stories about a clown, a stalker, and hand modeling let him be "honestly fake" instead of supplying a stable celebrity biography.
- Extreme auteur roles and private music made under Batman's ears dismantle assigned identities; fatherhood and neighborhood routines begin to give him a less theatrical ground.

| Candidate                             | Central image and evidence                                                                                                               |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Hollywood's Honest Liar**           | Recommended. It names the fabricated interviews and the truthful purpose behind them, while separating his card from Murphy and Gosling. |
| The Actor Who Disappears to Feel Real | Gives the full motive behind roles, privacy, and identity escape, but preserves the set's repeated disappearance language.               |
| The Movie Star Who Doesn't Feel Real  | Makes the internal problem very clear, though it is less active and memorable.                                                           |
| Hollywood's Ninety Percent Vapor      | Uses his own phrase and is highly specific, but requires article context to decode.                                                      |
| The Batman Making Music in the Dark   | Uses the article's best private-art image, but one scene cannot carry the entire thesis.                                                 |

Aloud winner: **Robert Pattinson: Hollywood's Honest Liar.** It is 23 characters, specific to the article's most distinctive strategy, and resolves the wall's disappearance collision. This treats DJ's "kind of okay" reaction as a Rework, not a rejection of the valid core.

### Sam Altman, Rework

The article repeatedly presents an outsider who enters a group, listens with unusual intensity, and ends up leading it while treating contradiction as part of an unfinished identity story.

Evidence anchors:

- Coming out to his school at seventeen established the pattern of going first when a group is stuck.
- Paul Graham's island observation, the kitchen smile, and the later OpenAI employee loyalty all show the quiet outsider becoming the center of the group.
- His low initial salary, lack of equity, firing and return, World identity project, and capacity to narrate incompatible positions all reveal identity and meaning outranking a simple money motive.

| Candidate                                   | Central image and evidence                                                                                                         |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Silicon Valley's King of Every Island**   | Recommended. It turns Graham's specific observation into the through-line across school, Y Combinator, OpenAI, and later ventures. |
| The Outsider Who Always Ends Up Leading     | States the trajectory most plainly and avoids monarchical tone, but is less distinctive.                                           |
| The Listener Who Becomes the Center         | Captures the relational mechanism behind his leadership, though it misses the recurring rupture and return.                        |
| The Leader Who Builds Through Contradiction | Names his ability to absorb incompatible stories, but sounds like a generic executive profile.                                     |

Aloud winner: **Sam Altman: Silicon Valley's King of Every Island.** It is 37 characters and grounded in the article's framing, though the tone choice is surfaced again in `Questions for DJ`.

### Cillian Murphy, Replace

Murphy's article is about conserving a finite self, accumulating detail, and then surrendering so fully that preparation disappears and the role becomes reality.

Evidence anchors:

- No internet, few notifications, and guarded public life protect the resources the work will consume.
- For `Oppenheimer`, he accumulated research, Dutch pronunciation, physical transformation, and technical detail before abandoning conscious control in performance.
- His phrase "cancel reality," his family's ritual of "getting Cillian back," and the train tears that led to `Small Things Like These` connect disappearance to both art and private feeling.

| Candidate                           | Central image and evidence                                                                                         |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **The Actor Who Cancels Reality**   | Recommended. It uses his own compact phrase and covers both protected preparation and total performance surrender. |
| The Actor Who Hoards, Then Vanishes | Names the two-phase method directly, though "hoards" can sound needlessly negative.                                |
| The Man Who Vanishes into the Work  | Clear and faithful, but too transferable and still collides with the wall's earlier disappearance language.        |
| Cinema's Controlled Disappearance   | Captures the paradox of rigorous setup and surrender, but remains abstract.                                        |
| The Actor Who Withholds Himself     | Fits privacy and conservation, but does not reach the moment when he gives everything to the role.                 |

Aloud winner: **Cillian Murphy: The Actor Who Cancels Reality.** It is 29 characters, article-sourced, clear, and stronger than the abstract "Invisible Vessel."

### Zendaya, Replace

The article frames anxiety as perimeter intelligence. She notices where exposure or dependency could trap her, then creates structure, authorship, loyalty, and a mapped exit before entering.

Evidence anchors:

- Repeating kindergarten and struggling through interviews establish anxiety as an old detection system rather than a new celebrity quirk.
- Producer authority on `K.C. Undercover`, walking away from music contracts, and method dressing all convert exposure into ownership.
- Her protection of the Roach relationship, private wedding choices, and planned retreat after an unusually dense release year show that she controls access and preserves an exit.

| Candidate                              | Central image and evidence                                                                                      |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **The Star Who Builds the Exit First** | Recommended. It turns the article's recurring exit-map behavior into an immediately legible operating strategy. |
| Hollywood's Prepared Escape Artist     | Connects preparation and escape, but may imply that she is trying to leave acting itself.                       |
| The Star Who Controls the Perimeter    | Captures managed exposure and protected relationships, though the security language is colder.                  |
| Hollywood's Master of Managed Exposure | Very faithful to the thesis, but sounds analytical rather than persona-like.                                    |
| The Star Who Never Leaves an Edge Open | Uses the article's containment image, but is less direct on first read.                                         |

Aloud winner: **Zendaya: The Star Who Builds the Exit First.** It is 34 characters and cannot be misread as "warrior." It directly answers DJ's clarity concern.

### Timothée Chalamet, Rework

The protection theme is valid, but the article increasingly shows Chalamet constructing protection through preparation rather than waiting passively for a director to supply it.

Evidence anchors:

- Denis Villeneuve's statement that the young actor needed protecting supplies the current title's legitimate core.
- Columbia as a backup, directors as tested anchors, and his silence during the Hammer controversy show threat-scanning around people and institutions.
- Five years of Dylan preparation, seven years of ping-pong work, and extreme `SNL` rehearsal turn vigilance into competence; his award-season confidence followed by quick qualification shows the check is still active.

| Candidate                                   | Central image and evidence                                                                                      |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **The Prodigy Who Prepares for Everything** | Recommended. It preserves "prodigy" but gives him agency and spans acting, sport, comedy, and career decisions. |
| The Actor Who Rehearses Against Disaster    | Makes preparation-as-protection explicit, though "disaster" is more dramatic than his public tone.              |
| The Prodigy Who Builds His Own Safety       | Corrects the passive current title and names the growth arc, but is less vivid.                                 |
| Hollywood's Catastrophe-Proof Prodigy       | Memorable and compact, but the bundled phrasing feels more manufactured.                                        |

Aloud winner: **Timothée Chalamet: The Prodigy Who Prepares for Everything.** It is 39 characters and converts a passive need into the article's active strategy.

### Jack Black, Replace

The article uses loudness as the starting point, not the conclusion. Its deeper arc is the showman learning when escape, excess, and performance must yield to restraint.

Evidence anchors:

- Cocaine use at fifteen and a counselor intervention establish the early connection between energy and escape.
- `High Fidelity` and `School of Rock` turned that force into comic vocation, while the Kyle Gass tour cancellation shows stress hardening into public principle.
- His quiet work in `Bernie`, meditation, hermit impulses, and straight-man role in `Anaconda` reveal controlled absence as growth.

| Candidate                           | Central image and evidence                                                                       |
| ----------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Comedy's Loudest Man Goes Quiet** | Recommended. It makes the article's public-surface-to-growth arc audible in five compact words.  |
| The Showman Who Learned to Go Quiet | States the developmental movement clearly, but adds another "The X Who" construction to the set. |
| The Wild Man Who Learned Restraint  | Captures growth and consequence, though "wild man" is more generic than his comic identity.      |
| Comedy's Controlled Explosion       | Joins energy and discipline, but does not show the article's late movement toward stillness.     |

Aloud winner: **Jack Black: Comedy's Loudest Man Goes Quiet.** It is 31 characters, memorable, and represents the article rather than merely describing his public job.

### Kai Cenat, Rework

The article fully earns "Perpetual Motion Machine." The needed change is range, not concept.

Evidence anchors:

- Mafiathon scale, nonstop group energy, and his refusal of a nine-figure Kick offer show motion as both identity and autonomy.
- His birthday breakdown, therapy admission, and desire for a peaceful relationship with his father reveal what the constant activity prevents from settling.
- Streamer University, fashion work, reading, sewing, and the Vivet project show an identity already larger than one platform.

| Candidate                                | Central image and evidence                                                                                                          |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Streaming's Perpetual Motion Machine** | Recommended. It preserves the exact article-wide metaphor and fixes the one proven defect, platform lock-in.                        |
| The Creator Who Outruns the Quiet        | Names motion as a defense against heavier feeling, but loses the joyful and culturally productive side of the machine.              |
| The Streamer Who Can't Let Silence Win   | Makes the avoidance mechanism clear, though it overlaps Jordan's recommended syntax and sounds more troubled than the full article. |
| Streaming's Restless Search for Peace    | Captures the father, therapy, and stillness thread, but undersells his comic energy and institution-building.                       |
| The Streamer Who Is Learning Stillness   | Names growth, but treats an emerging development as if it already defines the entire persona.                                       |

Aloud winner: **Kai Cenat: Streaming's Perpetual Motion Machine.** It is 36 characters and confirms DJ's suggested direction only after the full article supports it.

### Joe Rogan, Rework

Rogan's central pattern is self-trust. It gives his interviews force, keeps institutions from owning him, and also makes his gut a dangerous substitute for evidence.

Evidence anchors:

- The age-five command never to cry and decades of martial arts turn confrontation into the emotion and method he is permitted to use.
- JRE, Onnit, UFC work, the Mothership, and the nonexclusive Spotify renegotiation create no single point of failure.
- His Phil Hartman interventions show protective directness at its best; the AI-generated Walz video shows certainty overruling evidence at its worst.

| Candidate                               | Central image and evidence                                                                                               |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **The Interrogator Who Trusts His Gut** | Recommended. It retains the useful interview image and adds the strength that is also the article's explicit blind spot. |
| Podcasting's Tribe of One               | Captures political homelessness and institutional independence, but loses the conversational mechanism.                  |
| The Podcaster No Institution Can Own    | Makes the autonomy architecture unmistakable, though it is more business-oriented than psychological.                    |
| The Podcaster Who Trusts No Referee     | Connects combat, conversation, and self-authority, but is less direct than "trusts his gut."                             |

Aloud winner: **Joe Rogan: The Interrogator Who Trusts His Gut.** It is 35 characters and removes the generic "alpha" shorthand without softening the article's confrontation theme.

### Ryan Gosling, Rework

Gosling's most distinctive article image is not vanishing by itself. It is becoming a surface onto which characters, collaborators, partners, and audiences can project while he reveals very little of his own fixed identity.

Evidence anchors:

- Building furniture for `The Notebook`, learning piano for `La La Land`, and gaining sixty pounds for `The Lovely Bones` show total merging with a role.
- "Hey Girl" and "Literally Me" became identities other people assigned to him, and he never fought to reclaim the blank space.
- "Run it by Eva first," his protected family life, and his ability to befriend a dog, television schedule, or puppet show merging as gentleness rather than emptiness.

| Candidate                                 | Central image and evidence                                                                                             |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **The Movie Star Everyone Projects Onto** | Recommended. It covers roles, memes, privacy, and relationship merging while separating him from Pattinson and Murphy. |
| The Actor Who Makes Space for Everyone    | Captures his collaborative gentleness, but underplays the cultural projection phenomenon.                              |
| The Quiet Man Who Becomes the Role        | Faithful to preparation and merging, though it narrows the thesis to acting.                                           |
| Hollywood's Human Projection Screen       | Very specific to the article, but "human projection screen" sounds clinical rather than warm.                          |

Aloud winner: **Ryan Gosling: The Movie Star Everyone Projects Onto.** It is 37 characters and replaces a vague vanishing image with the article's strongest cultural evidence.

### Selena Gomez, Replace

Selena's article is an arc from maintaining peace by merging or withdrawing to maintaining connection while naming needs, receiving care, and returning after conflict.

Evidence anchors:

- Her admitted codependence in the Bieber relationship and repeated deletion of Instagram show peace achieved through self-erasure and retreat.
- Rare Beauty, the Rare Impact Fund, and named advocacy for DBT turn private struggle into infrastructure for other people's peace.
- Her Derbez response validates, apologizes, and still defends the work; the conflict-pause ritual with Benny Blanco matters because she comes back after taking space.

| Candidate                              | Central image and evidence                                                                                                         |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **The Peacemaker Who Learned to Stay** | Recommended. It captures the move from disappearing into people or away from conflict to returning without surrendering her place. |
| Pop's Quiet Return to Herself          | Names the post-codependence arc elegantly, but "Pop" narrows an article that also spans acting, business, and advocacy.            |
| The Star Who Creates Her Own Peace     | Captures Rare Beauty and mature self-protection, though it gives less weight to relationship growth.                               |
| The Woman Who Learned to Receive       | Uses her 2025 language about feeling valued, seen, and respected, but one relationship moment cannot carry the whole career.       |
| The Peacemaker Who Keeps Her Place     | Connects directly to the article's ending, though "learned to stay" better preserves the developmental arc.                        |

Aloud winner: **Selena Gomez: The Peacemaker Who Learned to Stay.** It is 34 characters and replaces generic steadiness with the article's precise form of growth.

## Set-level audit

### Structure

The current wall opens 23 of 27 titles with a possessive label such as "Hollywood's," "Pop's," or "Psychology's." The recommended set reduces that to 17 and uses 10 person-led constructions. That is still recognizably the same editorial house style, but it no longer makes almost every card follow one syntax.

The recommendations do not force symmetry where a current title is already excellent. "Patron Saint of Pain," "Winking Machine," "Strategic Alchemist," and "Quiet Volcano" remain because their nouns are earned by their articles.

### Repeated images and nouns

- The current set has three versions of disappearing: Pattinson's "Disappearing Act," Murphy's "Invisible Vessel," and Gosling's "Vanishing Man." The final set gives each a separate mechanism: Pattinson lies to resist fixed identity, Murphy cancels reality to enter a role, and Gosling becomes a projection surface.
- "Architect" currently appears only once, but its technology-profile genericness weakens Sam. The final title replaces it with the article-specific island frame.
- "Machine" remains twice, for Sabrina and Kai. This is acceptable because the articles earn two different machines: Sabrina's controlled achievement persona and Kai's nonstop live momentum. The neighboring wording does not confuse them.
- "Wound" leaves Billie's title because it romanticizes pain and freezes a self-revising article. "Icon" remains for Marilyn because the article explicitly distinguishes the armored icon from the person operating it.
- "Star" appears in three recommended titles, but each performs a different role: Dua schedules proof, Zendaya maps exits, and Gosling receives projection.

### Range and tone

- Kai moves from Twitch to streaming because the article establishes education, fashion, and cultural reach beyond one platform.
- Joe loses "Podcasting" in the winner because the article's gut-trust mechanism spans media, politics, business, friendship, and family.
- Billie loses "Gen Z" because generational ownership is broader and less specific than her repeated self-portrait cycle.
- Jordan loses "Weeping," Zendaya loses "Worrier," Timothée gains agency, and Selena loses generic steadiness. The new language treats visible symptoms as evidence rather than identity.
- Every recommended title is 21 to 42 characters and 3 to 7 words. MrBeast sits exactly at 42 characters; no title exceeds the visual target.

## Recommended final 27-title list

In people-wall order:

1. **Emma Watson:** Hollywood's Conscientious Objector
2. **Steve Jobs:** Silicon Valley's Unforgiving Craftsman
3. **Jordan Peterson:** The Professor Who Can't Let Chaos Win
4. **Margot Robbie:** Hollywood's Load-Bearing Heart
5. **Oprah Winfrey:** Television's Patron Saint of Pain
6. **Meghan Markle:** The Calligrapher Who Burned the Palace
7. **Sabrina Carpenter:** Pop's Winking Machine
8. **Taylor Swift:** Pop's Strategic Alchemist
9. **Dua Lipa:** The Star Who Turns Doubt into Deadlines
10. **Billie Eilish:** Pop's Unfinished Self-Portrait
11. **Robert Pattinson:** Hollywood's Honest Liar
12. **Sam Altman:** Silicon Valley's King of Every Island
13. **Elon Musk:** Technology's Apocalyptic Engineer
14. **Cillian Murphy:** The Actor Who Cancels Reality
15. **Robert Greene:** Power's Cold Cartographer
16. **Zendaya:** The Star Who Builds the Exit First
17. **Timothée Chalamet:** The Prodigy Who Prepares for Everything
18. **Marilyn Monroe:** Hollywood's Armored Icon
19. **Jack Black:** Comedy's Loudest Man Goes Quiet
20. **Kai Cenat:** Streaming's Perpetual Motion Machine
21. **John F. Kennedy:** Camelot's Graceful Fugitive
22. **IShowSpeed:** Streaming's Homesick Warlord
23. **MrBeast:** The Algorithm Monk Who Can't Stop Building
24. **Joe Rogan:** The Interrogator Who Trusts His Gut
25. **Lionel Messi:** Football's Quiet Volcano
26. **Ryan Gosling:** The Movie Star Everyone Projects Onto
27. **Selena Gomez:** The Peacemaker Who Learned to Stay

## Change list only

| Person            | Current wall and local title             | Recommended title                           |
| ----------------- | ---------------------------------------- | ------------------------------------------- |
| Steve Jobs        | Silicon Valley's Restless Perfectionist  | **Silicon Valley's Unforgiving Craftsman**  |
| Jordan Peterson   | Psychology's Weeping Crusader            | **The Professor Who Can't Let Chaos Win**   |
| Margot Robbie     | The Star Who Finds You Through Your Need | **Hollywood's Load-Bearing Heart**          |
| Dua Lipa          | Pop's Precision Optimist                 | **The Star Who Turns Doubt into Deadlines** |
| Billie Eilish     | Gen Z's Beautiful Wound                  | **Pop's Unfinished Self-Portrait**          |
| Robert Pattinson  | Hollywood's Disappearing Act             | **Hollywood's Honest Liar**                 |
| Sam Altman        | AI's Existential Architect               | **Silicon Valley's King of Every Island**   |
| Cillian Murphy    | Cinema's Invisible Vessel                | **The Actor Who Cancels Reality**           |
| Zendaya           | Hollywood's Weaponized Worrier           | **The Star Who Builds the Exit First**      |
| Timothée Chalamet | The Prodigy Who Needs Protecting         | **The Prodigy Who Prepares for Everything** |
| Jack Black        | Comedy's Boundless Showman               | **Comedy's Loudest Man Goes Quiet**         |
| Kai Cenat         | Twitch's Perpetual Motion Machine        | **Streaming's Perpetual Motion Machine**    |
| Joe Rogan         | Podcasting's Alpha Interrogator          | **The Interrogator Who Trusts His Gut**     |
| Ryan Gosling      | Hollywood's Gentle Vanishing Man         | **The Movie Star Everyone Projects Onto**   |
| Selena Gomez      | Pop's Steady Presence                    | **The Peacemaker Who Learned to Stay**      |

## Questions for DJ

Resolved by DJ's follow-up approval to implement the report's primary recommendations:

1. **Sam Altman tone:** Applied **"Silicon Valley's King of Every Island"**, the primary recommendation.
2. **Robert Pattinson emphasis:** Applied **"Hollywood's Honest Liar"**, the primary recommendation and cleaner set-level choice.
3. **Dua Lipa source authority:** Applied **"The Star Who Turns Doubt into Deadlines"** to the local article, wall, and live title field. The differing live article body was preserved exactly.

## Approval checklist

- [x] All 27 local articles were read in full.
- [x] Every current title received seven rubric scores and a verdict.
- [x] DJ's nine visual-review notes were addressed explicitly.
- [x] Oprah remained the benchmark and was not rewritten for symmetry.
- [x] Every Rework and Replace verdict includes article-specific evidence and at least three alternatives.
- [x] Every changed title from DJ's notes includes five candidates where the article supports five distinct directions.
- [x] The final set was reviewed for structure, repeated nouns, range, tone, clarity, and visual fit.
- [x] Local and live article drift was checked and reported without reconciliation.
- [x] No article, wall JSON, database row, image, or `lastmod` value was changed during the audit phase.
- [x] Implementation was approved and completed in the follow-up pass.

## Implementation outcome

DJ approved implementation after reviewing the audit.

- Updated the 15 recommended `persona_title` fields in local article frontmatter.
- Updated the same 15 entries in `src/lib/data/people-wall.json`.
- Updated all 15 live `blogs_famous_people.persona_title` fields. Ten used the standard hardened parser preview/apply workflow. Dua Lipa, Sam Altman, Cillian Murphy, Zendaya, and Jack Black used the same fail-closed atomic database RPC with a one-field patch so unrelated live content or metadata drift could not be overwritten.
- Regenerated `src/lib/components/molecules/famousTypes.ts` from the verified live database; its diff is limited to the same 15 title changes.
- Preserved every local and live article body hash, `lastmod`, publication state, and non-title managed field.
- Regenerated `static/email/reactivation/people-wall-v1.jpg` at 1400 by 1980 pixels.
- Verified all 27 titles agree across local frontmatter, wall JSON, and the live database.
- Verified every wall title renders in at most two lines with no card overflow risk.
