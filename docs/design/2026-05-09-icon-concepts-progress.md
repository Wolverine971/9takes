<!-- docs/design/2026-05-09-icon-concepts-progress.md -->

# 9takes — Icon Concepts Progress

> Status: **mid-review.** Two concepts approved, two rebuilt and awaiting review.
> Started: 2026-05-07. Last update: 2026-05-09.
> Locked design context: `docs/design-system.md` (Streetlamp Symposium · sodium-amber primary · Inter typography).

## Why this exists

DJ ran a major redesign and now needs a single brand icon to roll out across blog services, social accounts, favicons, app icons, and OG cards. The old Rubik's-cube mark (`darkRubix.*`) is from the de-facto teal era and doesn't fit the locked Streetlamp Symposium brand. This doc tracks the iteration toward a replacement.

## Source-of-truth files

All concept files live in `static/brand/concepts/`:

| File                        | Format                                 | Purpose                                                       |
| --------------------------- | -------------------------------------- | ------------------------------------------------------------- |
| `icon-1-aperture.svg`       | SVG                                    | Concept 1 — 9-blade aperture                                  |
| `icon-2-cipher.svg`         | SVG                                    | Concept 2 — decoder cipher wheel                              |
| `icon-3a-greek-face*.png`   | PNG (1024 / 512 / 256 / 128 / 64 / 32) | Concept 3a — close-up statue face (best for icon)             |
| `icon-3b-greek-reader*.png` | PNG (1024 / 512 / 256 / 128 / 64 / 32) | Concept 3b — reader bust (best for OG / hero / banner)        |
| `icon-4-marble-nine.svg`    | SVG                                    | Concept 4 — engraved marble 9                                 |
| `_make_greek.py`            | Python                                 | Re-runnable pipeline that builds 3a / 3b from source photos   |
| `preview.html`              | HTML                                   | Side-by-side viewer at 16/24/32/64/128/256 px on dark + light |

Source photos used for Concept 3:

- `static/greek_distorted_statue_face.png` → 3a (close-up face with cracks)
- `static/blogs/greek-dude-reading-book.png` → 3b (reader bust with library architecture)

## Concept status

| #   | Concept              | Status                                  | Notes                                                                                                                                                                                                                                |
| --- | -------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 9-Blade Aperture     | ✅ DJ approved 2026-05-07               | Real iris geometry — 9 overlapping curved leaf blades, brass housing with rim glaze, sodium-amber sun with bloom + concave reflection. Holds at 32 px; blurs at 16 (favicon would need a simplified variant).                        |
| 2   | Decoder Cipher Wheel | ✅ DJ approved 2026-05-07               | Brass material throughout — engraved tick marks, brass studs as type indicators, bronze inner dial, luminous amber active wedge. Holds at 32 px.                                                                                     |
| 3   | Greek Statue (photo) | 🟡 awaiting review (rebuilt 2026-05-09) | First SVG attempt rejected — silhouette was jagged / Egyptian-looking. Rebuilt from real photos via duotone pipeline. Two variants: 3a (close-up face) for icon use, 3b (reader bust) for hero / banner / OG.                        |
| 4   | Engraved Marble 9    | 🟡 awaiting review (rebuilt 2026-05-09) | First version (cracked stone) rejected — "9" disappeared into background, cracks dominated. Rebuilt as a coin / dossier-stamp: numeral carved INTO a marble plaque with sodium-amber light pooling at the bottom of the carved well. |

## Greek-face pipeline (Concept 3)

`_make_greek.py` is re-runnable and parameterized. It:

1. Loads a source PNG, center-crops to square, resamples to 1024 px.
2. Converts to luma, lifts contrast (~1.18–1.22).
3. Applies a 9-stop **duotone palette** (LUT) anchored to the locked V5 token set:
   - 0 → `#0a0807` (night-deep)
   - 75 → `#241D17` (stone-warm)
   - 150 → `#5C4F47` (stone-edge)
   - 215 → `#c9a66f` (warm amber-marble)
   - 250 → `#FBBF24` (lamp-glow)
   - 255 → `#FFFBEB` (white-hot core)
4. Vignettes the background to `#0a0807` so the figure pops against brand-night.
5. Adds a soft amber screen-blend on the lit side (the streetlamp pool).
6. Applies a rounded-rectangle mask (radius ≈ 16% of side) for app-icon shape.
7. Saves at 1024 / 512 / 256 / 128 / 64 / 32 PNG.

Re-run: `cd static/brand/concepts && python3 _make_greek.py`

To process a different source photo, edit the calls at the bottom of `main()` — change the source path, `crop_frac`, and `contrast`.

## Decisions still open

- [ ] **Final concept selection.** DJ approves 1 + 2 already. Need verdict on 3 (Greek face) and 4 (engraved 9). Could ship one, two, or three of these as a system (primary mark + secondary marks for different surfaces).
- [ ] **Production pipeline.** Once concepts lock, build:
  - Favicons: 16, 32, 48 (.ico bundle) — likely needs a simplified variant of the chosen mark
  - Apple touch icon: 180×180
  - Android Chrome: 192×192, 512×512
  - OG image: 1200×630 (uses 3b-style banner asset)
  - Twitter/X card: 1200×600
  - `site.webmanifest` updates
- [ ] **Brand asset rollout plan.** Replace `static/brand/aero.{png,webp}` references in header/footer/structured-data once mark is final. Decide whether `darkRubix.*` and the 7 color variants (`aria/fresco/nimbus/oceanic/polar/dark-rubix/rock-rubix`) get retired or repurposed.
- [ ] **Social profile pictures.** Need consistent versions for Twitter/X, Instagram, YouTube, LinkedIn — square crop at 400×400 minimum.
- [ ] **Wordmark version.** The locked brand uses "9takes" as a wordmark (all-lowercase, no space). Need to decide whether the chosen mark + wordmark co-exist or whether the mark is solo.

## Lessons from the iteration

- **Procedural shapes need real geometry.** First-pass aperture rendered as a wagon wheel because the blades had no slant or curvature. Real iris reading required actually computing pivot/tip pairs and stacking 9 rotated leaf shapes with light-on-leading-edge gradients.
- **Hand-drawing classical features is hard.** First-pass Greek profile came out jagged / Egyptian. The fix wasn't more hours of Bezier wrangling — it was using a real photograph and doing duotone color-grading. Photographic source > vector approximation when the brand language is "Greek statue lit by streetlamp."
- **The "9" needs to be the figure, not the texture.** First-pass cracked-marble 9 had a stone fill so dark it disappeared. Cracks became the figure. Coin / engraved-stamp framing solved it: the "9" is now a carved-in shape with light pooling inside, and the cracks moved off the numeral and onto the surrounding plaque.
- **Brand mood drives technique selection.** Streetlamp Symposium = "warm pools of light against deep stone, Greek statue + tech-spec." That language picks the techniques: brass material for instruments (1 + 2), photographic duotone for human figures (3), engraved-coin for typography (4). Everything dimensional, lit from upper-left, with sodium-amber as the light source.

## Next session pickup

- Get DJ's verdict on 3 + 4
- Build favicon / app-icon / OG / social pipeline for the chosen mark(s)
- Replace `aero.webp` references and decide on legacy `darkRubix.*` cleanup
