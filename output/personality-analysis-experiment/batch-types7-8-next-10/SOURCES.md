# Type 7–8 portrait sources

- Shakira — high-resolution studio-style portrait from Wallpapercat: https://wallpapercat.com/shakira-wallpapers
- Spencer X — public profile photograph surfaced by ContactOut, cross-checked against his Forbes profile: https://www.forbes.com/sites/abrambrown/2020/08/14/top-earning-tiktok-stars-the-wild-dreams-of-spencer-x-million-dollar-beatboxer/
- Stavros Halkias — 2025 GQ portrait: https://www.gq.com/story/dirtbags-made-comedian-stavros-halkias-famous-now-hes-helping-them-remake-their-lives
- Steve Irwin — TMDB portrait surfaced by Fiction Horizon and compared with the Creative Commons portrait on Wikimedia Commons: https://fictionhorizon.com/celebs-who-died-on-stage-or-on-set/ and https://commons.wikimedia.org/wiki/File:Steve_Irwin.jpg
- Tana Mongeau — high-resolution Teen Vogue photograph: https://www.teenvogue.com/story/tana-mongeau-apologizes-for-tanacon
- Travis Kelce — high-resolution IMDb profile portrait: https://www.imdb.com/name/nm7907935/
- Bryce Hall — 2024 Creative Commons photograph by Gage Skidmore on Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Bryce_Hall_by_Gage_Skidmore.jpg
- Duke Dennis — 2023 portrait frame on Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Duke_Dennis_2023_(2).jpg
- Idris Elba — GQ pinstripe-suit portrait: https://www.gq.com/story/what-lapels-should-you-choose-for-your-suit
- Jenna Marbles — Creative Commons photograph by Gage Skidmore on Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Jenna_Marbles_by_Gage_Skidmore.jpg

## Imagegen prompt set

Mode: built-in Imagegen edit, using each sourced photograph as the identity reference. All edits requested one real adult subject; faithful recognizable identity, age, skin tone, facial proportions, hair, and distinguishing features; a direct gaze; upright head; horizontally level eyes; full head, neck, both shoulders, and upper chest; generous headroom; complete shoulder contours; no hands, microphones, props, furniture, or facial obstructions; soft even studio lighting; realistic skin and hair detail; and a perfectly flat `#00FF00` background for deterministic removal. No text, logos, borders, purple lines, or graphic elements were generated.

Person-specific instructions:

- Spencer X — black blazer and black crew-neck shirt; no glasses or hat; reconstructed from the low-resolution square reference.
- Stavros Halkias — preserved his receding wavy hair, thick mustache, amber rectangular glasses, and stocky build; charcoal blazer and black shirt; removed the flowers and open shirt.
- Steve Irwin — preserved his reference-era facial identity, sandy hair, blue eyes, friendly smile, and iconic khaki wildlife shirt; reconstructed full shoulders without animals, hands, or a microphone.
- Tana Mongeau — preserved long platinum-blonde hair and facial details; black blazer with a high-neck burnt-orange blouse; removed the hand and hoodie cord.
- Travis Kelce — preserved the current haircut and reddish-brown beard; retained the forest-green suit, striped shirt, and dark tie; straightened the source pose.
- Bryce Hall — preserved the 2024 facial identity, textured dark hair, mustache, and goatee; navy blazer and black shirt; removed the body microphone and strap.
- Duke Dennis — preserved the beanie, braids, diamond studs, and current facial identity; black blazer, white shirt, and understated chain; removed oversized chains and the graphic sleeveless shirt.
- Idris Elba — preserved his facial identity, close-cropped hair, and salt-and-pepper facial hair; kept the pinstripe-suit styling; lowered the arms and reconstructed complete shoulders.
- Jenna Marbles — preserved the reference-era facial identity, blonde hair, makeup, and smile shape; navy blazer and high-neck coral blouse; removed the microphone, award, podium, and hands.

Shakira was processed directly from the high-resolution source with Apple Vision segmentation. The fixed purple overlay was extracted from `face-line-template.png` at x=324, y=428, width=433, height=125 and composited unchanged on every final portrait. Each person was rotated and scaled to match the overlay, with the detected eye midpoint placed at x=540, y=490 and an inter-eye target of 160 pixels.
