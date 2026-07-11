<!-- source-assets/README.md -->

# Source Assets

This directory preserves high-quality source artwork that should remain in the repository but must
not be copied into SvelteKit's public `static/` output.

## Contract

- `source-assets/blogs/*.png` contains lossless blog-image masters.
- Each blog master must have a same-stem full WebP in `static/blogs/`.
- Listing-card thumbnails use `static/blogs/s-<stem>.webp` where available.
- `source-assets/brand/9takes-preview.svg` is the editable source for the legacy preview artwork.
  The former public SVG URL permanently redirects to `static/9takes-preview.png`.
- `source-assets/books/*.PNG` preserves the original book-cover masters. Same-size WebP delivery
  files remain public under `static/books/`, and the legacy PNG URLs redirect to them.
- `source-assets/brand/dj-profile-pic.jpg` preserves the original founder photograph. Product and
  brand references use `static/brand/dj-profile-pic.webp`; the former JPG URL redirects there.
- Do not recompress or resize files in this directory as part of deployment optimization. Generate
  new delivery derivatives instead.

`scripts/static-asset-policy.json` records checksums for archived masters and the caller decision
for every public asset over 1 MiB. `node scripts/audit-static-assets.mjs` verifies both policies and
reports any missing delivery counterpart or unreviewed large asset.
