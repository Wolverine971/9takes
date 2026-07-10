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
- Do not recompress or resize files in this directory as part of deployment optimization. Generate
  new delivery derivatives instead.

`node scripts/audit-static-assets.mjs` verifies the public/source boundary and reports any missing
delivery counterpart.
