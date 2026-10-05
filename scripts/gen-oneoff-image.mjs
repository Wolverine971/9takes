// scripts/gen-oneoff-image.mjs
//
// DISABLED 2026-10-04 by DJ: never generate images through OpenRouter (it cost ~$7 in one run).
// Images are generated in ChatGPT, on DJ's subscription. The workflow:
//   1. Write the image prompt (house style: Greek marble statues, amber accent, no text).
//   2. DJ runs it in ChatGPT and saves the image.
//   3. node scripts/blog-image-variants.mjs <slug> <path/to/image>   (free, local; builds the variant set)
// Do not restore the OpenRouter call or route image generation through any paid API.

console.error(
	'[gen-oneoff-image] Disabled: image generation through OpenRouter is not allowed (DJ, 2026-10-04).\n' +
		'Write the prompt, have DJ generate it in ChatGPT, then run:\n' +
		'  node scripts/blog-image-variants.mjs <slug> <path/to/image>'
);
process.exit(1);
