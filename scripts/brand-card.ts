// scripts/brand-card.ts
// Render Cold Light brand cards from the command line. Same renderer as the site's link previews
// and /admin/brand, so anything made here matches the live brand. No image generation: it only
// lays out text over the existing statue library (static/brand/statues/) and the nine-mask logo.
//
// Usage:
//   pnpm gen:brand-og                                     # re-render every link preview to static/brand/og/
//   pnpm brand:card -- --list                             # list presets, templates, formats, statues
//   pnpm brand:card -- --preset ig-formula --out out.png
//   pnpm brand:card -- --template statement --format ig-post --headline "Answer before the crowd" \
//        --voice "Nine takes are waiting." --kicker "Today's question" --statue smirk --out story.png
//   pnpm brand:card -- --template question --format x-post --question "..." --out q.png
//   pnpm brand:card -- --template slide --format ig-post --index "03 / 07" --headline "..." --body "..." --out s3.png
//   pnpm brand:card -- --template person --name "Adam Sandler" --type 9 --portrait /types/9s/Adam-Sandler.webp --out p.png
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { renderBrandCard, type BrandCardInput } from '../src/lib/server/brandCards/renderBrandCard';
import { BRAND_CARD_PRESETS, OG_IMAGE_DIR, getPreset } from '../src/lib/brand/brandCardPresets';
import {
	CARD_FORMATS,
	STATUES,
	type CardFormat,
	type StatueId
} from '../src/lib/brand/brandTokens';

function parseArgs(argv: string[]): Record<string, string | true> {
	const args: Record<string, string | true> = {};
	for (let i = 0; i < argv.length; i++) {
		const token = argv[i];
		if (!token.startsWith('--')) continue;
		const key = token.slice(2);
		const next = argv[i + 1];
		if (next === undefined || next.startsWith('--')) args[key] = true;
		else {
			args[key] = next;
			i++;
		}
	}
	return args;
}

const str = (value: string | true | undefined): string | undefined =>
	typeof value === 'string' ? value : undefined;

async function renderOgPresets(): Promise<void> {
	const outDir = path.resolve('static', OG_IMAGE_DIR);
	await mkdir(outDir, { recursive: true });
	for (const preset of BRAND_CARD_PRESETS.filter((p) => p.kind === 'og')) {
		const buffer = await renderBrandCard(preset.card as BrandCardInput, {
			format: preset.format,
			output: 'jpeg'
		});
		const file = path.join(outDir, `${preset.id}.jpg`);
		await writeFile(file, buffer);
		console.log(`✓ ${path.relative(process.cwd(), file)}  ${(buffer.length / 1024).toFixed(0)} KB`);
	}
}

function list(): void {
	console.log('Presets:');
	for (const p of BRAND_CARD_PRESETS)
		console.log(`  ${p.id.padEnd(22)} ${p.format.padEnd(9)} ${p.label}`);
	console.log('\nTemplates: statement, question, person, slide');
	console.log('\nFormats:');
	for (const [id, f] of Object.entries(CARD_FORMATS))
		console.log(`  ${id.padEnd(9)} ${f.width}x${f.height}  ${f.label}`);
	console.log('\nStatues:');
	for (const [id, s] of Object.entries(STATUES)) console.log(`  ${id.padEnd(9)} ${s.label}`);
}

function statueArg(value: string | true | undefined): StatueId | undefined {
	const id = str(value);
	if (!id) return undefined;
	if (!(id in STATUES)) throw new Error(`Unknown statue "${id}". Run with --list.`);
	return id as StatueId;
}

function cardFromArgs(args: Record<string, string | true>): BrandCardInput {
	const template = str(args.template) ?? 'statement';
	switch (template) {
		case 'statement':
			if (!str(args.headline)) throw new Error('--headline is required for the statement template');
			return {
				template,
				headline: str(args.headline)!,
				voice: str(args.voice),
				kicker: str(args.kicker),
				statue: statueArg(args.statue),
				art:
					(str(args.art) as 'statue' | 'masks' | 'none' | undefined) ??
					(args.statue ? 'statue' : 'masks'),
				footer: str(args.footer)
			};
		case 'question':
			if (!str(args.question)) throw new Error('--question is required for the question template');
			return {
				template,
				question: str(args.question)!,
				kicker: str(args.kicker),
				action: str(args.action),
				footer: str(args.footer)
			};
		case 'person':
			if (!str(args.name)) throw new Error('--name is required for the person template');
			return {
				template,
				name: str(args.name)!,
				type: args.type ? Number(args.type) : null,
				voice: str(args.voice),
				kicker: str(args.kicker),
				portrait: str(args.portrait) ?? null
			};
		case 'slide':
			if (!str(args.body)) throw new Error('--body is required for the slide template');
			return {
				template,
				body: str(args.body)!,
				index: str(args.index),
				headline: str(args.headline),
				voice: str(args.voice)
			};
		default:
			throw new Error(`Unknown template "${template}". Use statement, question, person or slide.`);
	}
}

async function main(): Promise<void> {
	const args = parseArgs(process.argv.slice(2));
	if (args.og) return renderOgPresets();
	if (args.list || Object.keys(args).length === 0) return list();

	const preset = str(args.preset) ? getPreset(str(args.preset)!) : undefined;
	if (args.preset && !preset) throw new Error(`Unknown preset "${args.preset}". Run with --list.`);
	const card = preset ? (preset.card as BrandCardInput) : cardFromArgs(args);
	const format = (str(args.format) ?? preset?.format ?? 'og') as CardFormat;
	if (!(format in CARD_FORMATS)) throw new Error(`Unknown format "${format}". Run with --list.`);

	const out = path.resolve(
		str(args.out) ?? `brand-card-${preset?.id ?? card.template}-${format}.png`
	);
	const buffer = await renderBrandCard(card, {
		format,
		output: /\.jpe?g$/i.test(out) ? 'jpeg' : 'png'
	});
	await writeFile(out, buffer);
	console.log(`✓ ${out} (${CARD_FORMATS[format].width}x${CARD_FORMATS[format].height})`);
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
});
