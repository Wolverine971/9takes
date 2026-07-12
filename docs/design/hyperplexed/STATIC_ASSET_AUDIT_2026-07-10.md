<!-- docs/design/hyperplexed/STATIC_ASSET_AUDIT_2026-07-10.md -->

# Static Asset Audit - 2026-07-10

Scope: an initial read-only inventory of `static/`, followed by the approved no-quality-loss asset
boundary implementation. This pass measures deployment weight, raster dimensions,
source/delivery pairs, direct source references, exact duplicates, and the large social-preview
SVG. No image was deleted, resized, or recompressed; source originals were moved byte-for-byte.

## Decision Summary

Do **not** blanket-compress the famous-person portraits. They are not the source of the deployment
problem. This is the pre-implementation baseline:

| Asset group                                 | Files |      Bytes | Share of `static/` |
| ------------------------------------------- | ----: | ---------: | -----------------: |
| All of `static/`                            | 1,769 | 652.42 MiB |             100.0% |
| Paired blog PNG source masters              |   201 | 518.07 MiB |              79.4% |
| Famous-person library under `static/types/` |   832 |  40.58 MiB |               6.2% |
| Blog full WebP delivery files               |   257 |  34.74 MiB |               5.3% |
| `static/9takes-preview.svg`                 |     1 |   9.53 MiB |               1.5% |
| Blog thumbnail WebP delivery files          |   243 |   7.37 MiB |               1.1% |

The approved implementation was organizational, not destructive compression: all 201 PNG masters
now live byte-for-byte outside the public `static/` tree while their existing WebP derivatives
remain served. That removed 518.07 MiB from runtime/deploy output without changing a delivered
pixel.

## Guardrails

- Keep all famous-person full portraits unchanged in the first asset pass.
- Keep all source originals byte-identical; moving a master is acceptable only if the original is
  retained in the repository or an explicitly approved source archive.
- Do not overwrite delivery images during experiments. Generate a new candidate and compare it at
  its actual rendered size first.
- Do not declare an asset unused solely because `rg` cannot find it. Database content, generated
  paths, emails, social cards, and external URLs can all be callers.
- Any public-path removal needs a redirect decision, a production-preview crawl, and a lowered
  budget ratchet in the same slice.

## Method

The reusable read-only audit is `node scripts/audit-static-assets.mjs`. It:

- records the 1,769-file pre-implementation baseline and the 1,567-file public tree after the move;
- inventories the 203 archived source files under `source-assets/` separately from runtime assets;
- reads raster metadata through Sharp without transforming the files;
- scans 1,506 source/script text files for direct public asset paths and blog `pic:` stems;
- identifies same-stem blog PNG/WebP pairs;
- hashes every file to find exact byte duplicates; and
- inspects the preview SVG for embedded raster payloads.

The direct-reference scan covers repository source, not database rows or off-site links. Its result
is strong evidence for classification, not permission to delete.

## Tier 1 - No-Quality-Loss Wins

### 1. Separate blog source masters from public delivery assets

`static/blogs` is 574.73 MiB. Within it, 201 PNG files totaling 518.07 MiB have a same-stem WebP
delivery file. The source scan found zero direct references to those paired PNG paths. Existing list
and article code primarily uses `/blogs/<pic>.webp` and `/blogs/s-<pic>.webp`.

There are active inline blog PNGs, including the Enneagram stress-direction arrow diagrams. They do
not have same-stem WebP delivery siblings, are not part of this 201-file set, and would remain in
`static/blogs/`.

Approved implementation:

1. Created the non-public `source-assets/blogs/` directory.
2. Moved the 201 paired PNG masters there with byte-for-byte checksums and Git history preserved.
3. Updated `scripts/gen-blog-image-openrouter.mjs` so new PNG masters go to the source directory,
   while full and thumbnail WebPs continue to go to `static/blogs/`.
4. Kept the 19 active PNG-only blog assets public. No broad `/blogs/*.png` redirect was added
   because it could capture those legitimate diagrams; the moved master URLs had zero internal or
   sitemap references.
5. Built, crawled the direct asset references and sampled routes, then lowered the asset budgets.

This is a public-delivery boundary fix, not image compression. -> performance

### 2. Retire the embedded-raster preview SVG

`static/9takes-preview.svg` is 9.53 MiB because it embeds four raster images:

- one 1,712×3,704 JPEG at roughly 6.36 MiB;
- three smaller PNG payloads totaling roughly 0.77 MiB; and
- vector/device chrome around those images.

The repository already contains equivalent 929×1,289 outputs:

| Variant                 |      Size |
| ----------------------- | --------: |
| `9takes-preview.svg`    |  9.53 MiB |
| `9takes-preview.png`    | 728.8 KiB |
| `9takes-preview.webp`   | 113.3 KiB |
| `s-9takes-preview.webp` |  43.6 KiB |

No application or content source references the SVG; the only active code references are its cache
header and the test for that header. Brand handoff documentation already names the WebP as the
generic preview. Raster comparison at 929×1,289 found the PNG closely tracks the SVG render, and a
visual inspection found no meaningful composition difference between the PNG and WebP.

Implemented: the SVG source now lives at `source-assets/brand/9takes-preview.svg`, the legacy public
URL permanently redirects to the existing PNG for compatibility, the obsolete SVG cache rule is
gone, and the largest-asset budget is lower. -> performance

### 3. Ignore exact duplicates for now

Only eight exact-duplicate groups were found, representing 1.50 MiB of redundant bytes. Some are
intentional full/thumbnail aliases or brand-name aliases. This is not worth mixing into the first
asset change. -> P6+performance

## Tier 2 - Delivery Optimization, With Visual Review

The blog delivery files are already much healthier than the source masters:

- no full blog WebP exceeds 1 MiB;
- seven exceed 500 KiB;
- 33 are wider than 2,400px; and
- 94 are wider than 1,600px.

The largest full delivery image is 717.2 KiB at 2,912×1,632. A sampled 2,912px PNG/WebP pair kept
its important fine detail and lighting in visual inspection. That means the existing WebP should
remain the fallback while any smaller candidate is tested.

Later, create new 1,200px/1,600px responsive derivatives for the small set of oversized delivery
files, wire them through `srcset`/`sizes`, and compare screenshots at mobile, standard desktop, and
retina desktop widths. Do not batch-overwrite the existing full WebPs. -> P10+performance

## Protected Category - Famous-Person Portraits

The famous-person library is already modest for its scope:

- 418 full WebP portraits total 23.67 MiB;
- 409 `s-` portrait variants total 16.00 MiB;
- almost every full portrait is 1,080×1,080, with six at 1,024×1,024;
- the largest full portrait is 169.3 KiB; and
- no portrait exceeds 200 KiB or 1 MiB.

The current `s-` files remain 1,080×1,080 and average about 40 KiB, so they are compression variants
rather than dimensionally smaller thumbnails. A full-size visual check showed more visible artifacting
in a sampled `s-` file than in its full portrait. That makes an in-place thumbnail rewrite a poor
first move.

If portrait delivery is revisited later, preserve every full portrait, generate a separate 400px or
540px candidate at a higher quality setting, and A/B it at the actual grid size and at 2× density.
Nothing under `static/types/` should change in the first implementation slice. -> P10+performance

## Other Large Root Assets

Several root PNGs have smaller WebP siblings, but some PNGs are intentionally consumed by server-side
social-card rendering or admin asset generators. For example, `greek_pantheon.png` is read directly
by the question social-card renderer. These require caller-by-caller review and should not be swept
into a generic conversion job. -> P10+performance

## Implementation Result

Runtime media/font weight fell from 651.75 MiB to 124.15 MiB, an 80.9% reduction. Client deploy
output fell from 678.03 MiB to 150.43 MiB. Assets over 1 MiB fell from 191 to 17; assets over 5 MiB
fell from 46 to 1. The famous-person library remains byte-for-byte unchanged at 40.58 MiB, and all
current WebP delivery files remain in place.

## Approved Changes Shipped

1. Moved the 201 paired blog PNG masters out of `static/` and retained them byte-for-byte.
2. Updated the blog-image generator to preserve masters under `source-assets/`.
3. Moved the 9.53 MiB SVG source outside `static/` and permanently redirected its legacy URL to
   the existing PNG.
4. Added CI ratchets for the protected portrait bytes/file count and for zero paired PNG masters in
   `static/`.
5. Replaced three pre-existing broken asset URLs with semantically matching delivery assets.
6. Left portrait recompression and batch WebP replacement explicitly out of scope.

## Verification Completed

- All 201 moved PNGs: individual SHA-256 and byte counts match the pre-move manifest; aggregate
  source-set checksum `29582eb9819da4c1d1c16329546266b0306b95b385413d8120e01847890ebce6`.
- Archived preview SVG: unchanged at 9,989,150 bytes with SHA-256
  `3f8ee9e79cb4cd80cb171b05c9f0b5960d48262539c5eeae3b2d13e574ed41e7`.
- `node scripts/audit-static-assets.mjs`: pass; 201 archived masters, zero missing WebP counterparts,
  zero direct legacy PNG references, and zero paired PNG masters remaining in `static/`.
- Production build: pass; all 1,567 public files copied with matching byte counts, and no
  `source-assets/` path entered client output.
- Direct repository asset-reference crawl: 178 image references, zero missing files.
- `pnpm test`: pass, 92 files and 409 tests.
- `pnpm test:smoke`: pass, 14 mobile SSR/overflow/console checks on an isolated dev port.
- `pnpm check`: pass with 0 errors and the existing 126-warning baseline.
- `pnpm lint:radius`: pass with a zero-item backlog.
- Budget check: pass at 150.43 MiB client output / 124.15 MiB runtime assets, with the portrait
  library explicitly locked at 40.58 MiB and 832 files.

## Pass 8 - Remaining Large-Asset Caller Review

The 17 public assets over 1 MiB were reviewed individually instead of batch-compressed. The caller
decisions now live in `scripts/static-asset-policy.json`, and both the read-only audit and production
budget checker fail if a new unreviewed large public asset appears.

### Protected or deliberately retained

- `greek_pantheon.png` remains unchanged because question social-card rendering, site/auth OG
  metadata, and the admin poster generator consume it directly.
- `philosopher-gathering.png` and `acrop.png` remain full-resolution public inputs for the admin
  poster generator.
- `greek_distorted_statue_face.png`, `brand/djface.png`, and the 3a Greek-face icon master remain
  available for the documented brand handoff. Product surfaces already use their smaller delivery
  variants where available.
- Nine PNG-only blog assets have no current repository, sitemap, Git-history, or indexed-search
  caller. They remain public because repository absence is not enough evidence to break a possible
  external URL. Moving them is deferred until traffic/log evidence exists.
- The famous-person portrait library remains untouched and checksum-stable at 40.58 MiB / 832 files.

### Safe source/delivery separations

Three original book-cover PNGs and the original founder-profile JPG already had same-dimension WebP
delivery files. Active content and brand references use those WebPs. The four originals were moved
byte-for-byte to `source-assets/`, and permanent redirects preserve their former public URLs:

| Archived source master                           | Public delivery file                       |
| ------------------------------------------------ | ------------------------------------------ |
| `source-assets/books/48-laws-of-power.PNG`       | `static/books/48-laws-of-power.webp`       |
| `source-assets/books/michelle-book-becoming.PNG` | `static/books/michelle-book-becoming.webp` |
| `source-assets/books/spare.PNG`                  | `static/books/spare.webp`                  |
| `source-assets/brand/dj-profile-pic.jpg`         | `static/brand/dj-profile-pic.webp`         |

All four delivery files preserve the original pixel dimensions. Side-by-side inspection found the
same composition and appropriate delivery quality; no delivery file was regenerated or overwritten.
The archived sources retain their original individual SHA-256 hashes.

### Result

- Removed another 3,365,384 bytes (3.21 MiB) from the public deployment tree without deleting or
  recompressing a source.
- Client deployment output: 150.43 MiB -> 147.22 MiB.
- Runtime media/fonts: 124.15 MiB -> 120.94 MiB.
- Public assets over 1 MiB: 17 -> 15; all 15 are now explicitly classified.
- Production build, five redirect/policy tests, targeted ESLint, Prettier, checksum verification,
  the asset audit, and the lowered budget ratchets pass.
- Full verification remains green: `pnpm check` reports 0 errors and the existing 126 warnings,
  `pnpm test` passes 92 files / 410 tests, and the radius lint remains at zero.

### Next safe decision

Do not move the nine unresolved blog PNGs without traffic or request-log evidence. The next
implementation slice should return to visible surface convergence: secondary hubs first, followed
by article navigation density, coaching hierarchy, icon consistency, and global ornament.
-> P3+P8+P9+P10+P11+performance
