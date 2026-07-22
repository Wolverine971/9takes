# Blackpill downward spiral — social asset package

This package translates the rewritten 9takes article into a 10-slide Instagram/LinkedIn carousel,
two landscape share cards, and platform-ready post copy. It keeps the article's central distinction
intact: pain and structural pressure can be real without making a hopeless conclusion true.

## What is included

- `SOCIAL-COPY.md` — final carousel copy, visual direction, hooks, captions, X thread, LinkedIn
  post, alt text, and risk/nuance review.
- `source/carousel.html` — editable 1080×1350 carousel and 1200×675 share-card source.
- `source/render.mjs` — deterministic PNG exporter and dimension checker.
- `assets/carousel/` — ten platform-ready portrait PNGs.
- `assets/share/` — standalone downward-spiral and upward-spiral landscape PNGs.
- `assets/contact-sheet.png` — visual QA overview of the full carousel.
- `assets/manifest.json` — dimensions and byte sizes for every exported asset.

## Design system

The layouts use the locked Streetlamp Symposium V5 system from `docs/design-system.md`:

- deep night `#0A0807`
- warm stone `#241D17`
- stone edge `#5C4F47`
- sodium amber `#F59E0B`
- marble ink `#FAF8F4`
- data teal/cyan `#0D9488` / `#5EEAD4`
- Inter display typography with mono labels

Amber maps the fatal/downward story. Teal is reserved for counter-evidence, connection, and
restored agency. The visuals intentionally avoid pill memes, hostile portraits, women-as-symbols,
or rage-coded red/black aesthetics.

## Re-render

From the repository root:

```bash
node docs/distribution-assets/blackpill-social-package-2026-07-22/source/render.mjs
```

The exporter waits for local fonts, captures each frame at native size, builds the contact sheet,
and fails if an output has the wrong dimensions.

## Source article

`https://9takes.com/pop-culture/incel-blackpill-radicalization-enneagram`
