// scripts/gen-image-variants.mjs
//
// Phone-sized AVIF variants of every blog hero and personality portrait, in static/variants/.
// Pages serve them to phones in place of the full WebP (src/lib/imageVariants.js), which is
// what keeps a 400 KB hero from being the page's LCP on a slow connection.
//
//   pnpm gen:image-variants        write missing or stale variants, delete orphans
//   pnpm check:image-variants      exit 1 if anything is missing, stale or orphaned (lint)
//
// Free and local (sharp). `prebuild` runs the generator, so a deploy never ships a page
// whose variant is missing; commit what it writes so the next build has nothing to do.
// blog-image-variants.mjs and prepare-personality-image.sh run it for new images.
import { diffVariants, generateVariants, planVariants } from './lib/imageVariants.mjs';

const args = new Set(process.argv.slice(2));
const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

if (args.has('--check')) {
	const plan = planVariants();
	const { todo, orphans, heavy } = diffVariants(process.cwd(), plan);
	for (const item of todo) console.error(`✗ ${item.reason}: ${item.output} (from ${item.source})`);
	for (const orphan of orphans) console.error(`✗ orphan (its source is gone): ${orphan}`);
	for (const item of heavy) console.warn(`! heavy variant, ${kb(item.bytes)}: ${item.output}`);
	if (todo.length > 0 || orphans.length > 0) {
		console.error(
			`\n${todo.length + orphans.length} image variant problem(s). Run: pnpm gen:image-variants`
		);
		process.exit(1);
	}
	console.log(`✓ ${plan.length} phone image variants are present and current.`);
} else {
	const started = Date.now();
	const { written, removed, total } = await generateVariants();
	for (const item of written) console.log(`  ${item.reason}: ${item.output} ${kb(item.bytes)}`);
	for (const orphan of removed) console.log(`  removed orphan: ${orphan}`);
	console.log(
		`[image-variants] ${total} planned, ${written.length} written, ${removed.length} removed (${((Date.now() - started) / 1000).toFixed(1)}s)`
	);
}
