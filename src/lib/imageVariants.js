// src/lib/imageVariants.js

// Phone-sized AVIF variants of the two LCP images: the blog hero (PopCard, `priority`) and
// the personality portrait. The full files are 1,024 to 2,912 px wide and 60 to 700 KB; a
// phone shows the hero at most 462 px wide and the portrait 278 px wide, and on a slow
// connection the hero file was the whole LCP (measured 2026-11-14, see
// docs/taskers/T-41-assets/M-critical-css-plan.md).
//
// The files live in static/variants/, mirror the source path, and are written by
// scripts/gen-image-variants.mjs (this module is its config too). Pages reference them in a
// `<source type="image/avif" media=…>`, so a browser without AVIF, or a wider viewport,
// keeps loading the full WebP exactly as before.

/** Blog hero: full width up to a 480 px viewport (at most 462 px), then a fixed 598 px. */
export const BLOG_HERO_PHONE = Object.freeze({
	media: '(max-width: 480px)',
	width: 800,
	quality: 58,
	sourceDir: 'static/blogs',
	outputDir: 'static/variants/blogs/800'
});

/** Portrait: a 278 px square until the layout goes two-column at 969 px. */
export const PORTRAIT_PHONE = Object.freeze({
	media: '(max-width: 968px)',
	desktopMedia: '(min-width: 969px)',
	width: 640,
	quality: 58,
	sourceDir: 'static/types',
	outputDir: 'static/variants/types/640'
});

/**
 * The statue in the Enneagram type dossier (top of /enneagram-corner/enneagram-type-N). It
 * renders as a portrait crop of a landscape file, so phones need the full width: the variant
 * only changes the format (72 KB WebP to about 45 KB AVIF), for every viewport.
 */
export const TYPE_DOSSIER_IMAGE = Object.freeze({
	src: '/greek_pantheon.webp',
	source: 'static/greek_pantheon.webp',
	output: 'static/variants/dossier/greek_pantheon.avif',
	width: 1456,
	quality: 54
});

/**
 * @param {string | null | undefined} imageSrc The dossier's `imageSrc`.
 * @returns {string} The AVIF variant URL, or '' for an image without one.
 */
export function dossierImageAvifSrc(imageSrc) {
	return imageSrc === TYPE_DOSSIER_IMAGE.src
		? `/${TYPE_DOSSIER_IMAGE.output.slice('static/'.length)}`
		: '';
}

/**
 * @param {string | null | undefined} pic The post's `pic` frontmatter value.
 * @returns {string} `/variants/blogs/800/{pic}.avif`, or '' without a pic.
 */
export function blogHeroPhoneSrc(pic) {
	const name = typeof pic === 'string' ? pic.trim() : '';
	return name ? `/variants/blogs/800/${name}.avif` : '';
}

const PORTRAIT_PATH = /^\/types\/([1-9]s)\/((?!s-)[^/?]+)\.webp(\?.*)?$/;

/**
 * @param {string | null | undefined} imagePath A full portrait path from
 *   `buildPersonalityImagePath`, e.g. `/types/6s/Zendaya.webp?v=20260902`.
 * @returns {string} `/variants/types/640/6s/Zendaya.avif?v=20260902`, or '' for anything
 *   that is not a full portrait path (thumbnails have no variant).
 */
export function portraitPhoneSrc(imagePath) {
	const match = typeof imagePath === 'string' ? PORTRAIT_PATH.exec(imagePath) : null;
	return match ? `/variants/types/640/${match[1]}/${match[2]}.avif${match[3] ?? ''}` : '';
}
