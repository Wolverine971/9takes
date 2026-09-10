// scripts/generate-enneagram-email-asset.mjs
// Programmatic email illustration. Run: node scripts/generate-enneagram-email-asset.mjs
// SVG text is outlined using the repository's Inter font, so exports are portable.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';
import sharp from 'sharp';
import {
	ENNEAGRAM_TYPE_PROMPT_CONTENT,
	ENNEAGRAM_TYPE_PROMPT_IMAGE_URL
} from '../src/lib/email/enneagram-type-prompt-content.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'artifacts/email-campaign');
const font = opentype.loadSync(path.join(root, 'static/fonts/inter/Inter-Bold.ttf'));
const displayFont = opentype.loadSync(path.join(root, 'static/fonts/inter/Inter-Black.ttf'));
const monoFont = opentype.loadSync(
	path.join(
		root,
		'node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff'
	)
);
const width = 1200;
const height = 1040;
const center = { x: 600, y: 490 };
const ringRadius = 310;
// Streetlamp Symposium palette from src/scss/index.scss and docs/design-system.md.
const palette = {
	paper: '#0A0807',
	surface: '#16110D',
	stone: '#241D17',
	edge: '#5C4F47',
	ink: '#FAF8F4',
	quiet: '#A8A095',
	marble: '#EDE6DA',
	burntOrange: '#B45309',
	amber: '#F59E0B',
	yellow: '#FBBF24'
};
const triads = [
	{
		id: 'instinctual',
		labelText: 'Instinctual',
		emotion: 'Anger',
		types: [8, 9, 1],
		start: -150,
		end: -30,
		color: palette.burntOrange,
		tint: palette.burntOrange,
		tintOpacity: 1,
		label: { x: 600, y: 56 }
	},
	{
		id: 'intellectual',
		labelText: 'Intellectual',
		emotion: 'Fear',
		types: [7, 6, 5],
		start: 90,
		end: 210,
		color: palette.yellow,
		tint: palette.yellow,
		tintOpacity: 1,
		label: { x: 290, y: 920 }
	},
	{
		id: 'emotional',
		labelText: 'Emotional',
		emotion: 'Shame',
		types: [2, 3, 4],
		start: -30,
		end: 90,
		color: palette.amber,
		tint: palette.amber,
		tintOpacity: 1,
		label: { x: 910, y: 920 }
	}
];

function point(angle, radius, origin = center) {
	const radians = (angle * Math.PI) / 180;
	return { x: origin.x + Math.cos(radians) * radius, y: origin.y + Math.sin(radians) * radius };
}

function numberAngle(number) {
	return -90 + (number % 9) * 40;
}
function xy(p) {
	return `${p.x.toFixed(3)},${p.y.toFixed(3)}`;
}
function escape(text) {
	return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
}

function text(label, x, y, size, fill, spacing = 0, typeface = font) {
	const options = { kerning: true, letterSpacing: spacing / size };
	const total = typeface.getAdvanceWidth(label, size, options);
	const d = typeface.getPath(label, x - total / 2, y, size, options).toPathData(3);
	return `<g fill="${fill}" role="img" aria-label="${escape(label)}"><title>${escape(label)}</title><path d="${d}"/></g>`;
}

function annulus(start, end, inner, outer) {
	const a = point(start, outer),
		b = point(end, outer),
		c = point(end, inner),
		d = point(start, inner);
	return `M${xy(a)} A${outer},${outer} 0 0 1 ${xy(b)} L${xy(c)} A${inner},${inner} 0 0 0 ${xy(d)} Z`;
}

function arc(start, end, radius) {
	return `M${xy(point(start, radius))} A${radius},${radius} 0 0 1 ${xy(point(end, radius))}`;
}

function triadLabel(triad) {
	const { x, y } = triad.label;
	return `<g id="label-${triad.id}">
		${text(triad.labelText, x, y, 42, palette.ink)}
		${text(`${triad.emotion.toUpperCase()} TRIAD`, x, y + 36, 24, palette.marble, 1, monoFont)}
	</g>`;
}

function silhouettes() {
	return `<g id="people" transform="translate(${center.x - 600} ${center.y - 610})" aria-label="Two people, one with short hair and one with long hair">
		<title>Two people considering their personality</title>
		<!-- Short-haired adult silhouette -->
		<path d="M518 620 C519 595 527 583 547 578 L547 565 L574 565 L574 578 C594 583 602 595 603 620 Z" fill="url(#portrait-stone)"/>
		<ellipse cx="560" cy="547" rx="24" ry="30" fill="url(#portrait-stone)"/>
		<path d="M536 545 C534 524 542 512 560 512 C579 512 587 527 583 544 C576 540 568 533 564 525 C556 536 546 539 536 540 Z" fill="${palette.edge}"/>
		<!-- Long-haired adult silhouette -->
		<path d="M615 576 C608 560 610 535 618 523 C625 513 634 510 644 513 C667 514 675 541 670 560 L677 588 L610 588 Z" fill="${palette.edge}"/>
		<path d="M597 620 C598 595 610 584 628 579 L629 563 L655 563 L655 579 C675 584 684 595 685 620 Z" fill="url(#portrait-marble)"/>
		<ellipse cx="642" cy="548" rx="22" ry="29" fill="url(#portrait-marble)"/>
		<path d="M619 543 C616 525 625 514 641 514 C658 514 668 526 666 543 C654 538 642 533 636 522 C631 532 626 538 619 543 Z" fill="${palette.edge}"/>
	</g>`;
}

function arrows() {
	return Array.from({ length: 9 }, (_, i) => i + 1)
		.map((number) => {
			const angle = numberAngle(number);
			const from = point(angle, 173),
				to = point(angle, ringRadius - 47);
			return `<path id="arrow-to-${number}" d="M${xy(from)} L${xy(to)}" fill="none" stroke="${palette.marble}" stroke-width="6.5" stroke-linecap="round" marker-end="url(#personality-arrowhead)"/>`;
		})
		.join('');
}

function render(includeCenter) {
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="asset-title asset-description">
	<title id="asset-title">${includeCenter ? 'Your personality?' : 'The three Enneagram triads'}</title>
	<desc id="asset-description">The nine Enneagram types appear clockwise, starting with 9 at the top. Instinctual, anger triad: types 8, 9, 1. Intellectual, fear triad: types 7, 6, 5. Emotional, shame triad: types 2, 3, 4.${includeCenter ? ' Two silhouettes and the question Your personality? sit at the center, with arrows pointing outward to all nine types.' : ''}</desc>
	<defs>
		<radialGradient id="stone-light" cx="50%" cy="43%" r="64%"><stop offset="0" stop-color="${palette.stone}"/><stop offset="1" stop-color="${palette.paper}"/></radialGradient>
		<linearGradient id="center-stone" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${palette.stone}"/><stop offset="1" stop-color="${palette.surface}"/></linearGradient>
		<linearGradient id="portrait-stone"><stop stop-color="${palette.marble}"/><stop offset="1" stop-color="${palette.quiet}"/></linearGradient>
		<linearGradient id="portrait-marble"><stop stop-color="${palette.ink}"/><stop offset="1" stop-color="${palette.marble}"/></linearGradient>
		<marker id="personality-arrowhead" markerWidth="22" markerHeight="22" refX="20" refY="11" orient="auto" markerUnits="userSpaceOnUse"><path d="M1 1 L21 11 L1 21 Z" fill="${palette.marble}"/></marker>
	</defs>
	<rect width="${width}" height="${height}" rx="24" fill="url(#stone-light)"/>
	<g id="triad-overlays">
		${triads.map((t) => `<path d="${annulus(t.start + 2, t.end - 2, 264, 365)}" fill="${t.tint}" fill-opacity="${t.tintOpacity}"/><path d="${arc(t.start + 3, t.end - 3, 364)}" fill="none" stroke="${t.color}" stroke-width="3" opacity="0.75"/>`).join('')}
	</g>
	${includeCenter ? `<g id="your-personality-arrows">${arrows()}</g>` : ''}
	<g id="type-numbers">
		${Array.from({ length: 9 }, (_, i) => i + 1)
			.map((number) => {
				const p = point(numberAngle(number), ringRadius);
				const triad = triads.find((t) => t.types.includes(number));
				return `<g id="type-${number}"><circle cx="${p.x}" cy="${p.y}" r="36" fill="${palette.surface}" stroke="${triad.color}" stroke-width="2.4"/>${text(String(number), p.x, p.y + 15, 43, palette.marble)}</g>`;
			})
			.join('')}
	</g>
	${
		includeCenter
			? `<g id="center-question">
		<circle cx="${center.x}" cy="${center.y}" r="157" fill="url(#center-stone)" stroke="${palette.edge}" stroke-width="2"/>
		<path d="${arc(-105, -75, 157)}" fill="none" stroke="${palette.amber}" stroke-width="3" stroke-linecap="round"/>
		${silhouettes()}
		${text('YOUR', center.x, center.y + 36, 21, palette.marble, 2.8, monoFont)}
		${text('personality?', center.x, center.y + 77, 38, palette.ink, -0.95, displayFont)}
	</g>`
			: ''
	}
	<g id="triad-labels">${triads.map(triadLabel).join('')}</g>
	${text('9takes', center.x, height - 30, 28, palette.marble, -0.7, displayFont)}
</svg>`;
}

await fs.mkdir(output, { recursive: true });
for (const [name, includeCenter] of [
	['enneagram-triads-layout', false],
	['enneagram-personality', true]
]) {
	const svg = render(includeCenter);
	await fs.writeFile(path.join(output, `${name}.svg`), svg);
	await sharp(Buffer.from(svg))
		.png({ palette: true, colours: 256, effort: 10 })
		.toFile(path.join(output, `${name}.png`));
	console.log(`Created ${name}.svg and ${name}.png (${width} × ${height})`);
}

// Ship the email-safe PNG with the site at the canonical campaign image URL.
const publicPath = path.join(
	root,
	'static',
	new URL(ENNEAGRAM_TYPE_PROMPT_IMAGE_URL).pathname.slice(1)
);
await fs.mkdir(path.dirname(publicPath), { recursive: true });
await fs.copyFile(path.join(output, 'enneagram-personality.png'), publicPath);

// Keep the entire offline preview in sync with the canonical campaign copy.
const previewPath = path.join(output, 'enneagram-type-pilot-preview.html');
let preview = await fs.readFile(previewPath, 'utf8');
const localContent = ENNEAGRAM_TYPE_PROMPT_CONTENT.htmlContent.replace(
	ENNEAGRAM_TYPE_PROMPT_IMAGE_URL,
	'./enneagram-personality.png'
);
const contentContainer = /(<div\s+class="email-content"[^>]*>)[\s\S]*?(<\/div>)/;
const preheaderContainer = /(<!-- Preheader -->\s*<div\b[^>]*>)[\s\S]*?(<\/div>)/;
if (!contentContainer.test(preview) || !preheaderContainer.test(preview))
	throw new Error('Cannot locate the content or preheader in the email preview');
preview = preview
	.replace(contentContainer, (_match, open, close) => `${open}\n${localContent}\n${close}`)
	.replace(
		/<title>[\s\S]*?<\/title>/,
		`<title>${escape(ENNEAGRAM_TYPE_PROMPT_CONTENT.subject)}</title>`
	)
	.replace(
		preheaderContainer,
		(_match, open, close) =>
			`${open}\n${escape(ENNEAGRAM_TYPE_PROMPT_CONTENT.preheader)}\n${'&nbsp;'.repeat(100)}\n${close}`
	);
await fs.writeFile(previewPath, preview);
await fs.writeFile(
	path.join(output, 'enneagram-personality-README.md'),
	[
		'# Enneagram email asset — selected palette A',
		'',
		'Generated programmatically with SVG geometry, outlined Inter Bold / Black and JetBrains Mono typography, and Sharp PNG export.',
		'',
		'- `enneagram-personality.png`: complete email image, ' + width + ' × ' + height + '.',
		'- `enneagram-personality.svg`: editable vector with named groups for the overlays, arrows, type numbers, silhouettes, and labels. Text is outlined for portable rendering.',
		'- `enneagram-triads-layout.svg` / `.png`: type numbers, triad overlays, and labels without the center or arrows.',
		'- `enneagram-type-pilot-preview.html`: local email mockup regenerated from the canonical copy, with the main account CTA before the image.',
		'- `static/email/enneagram-type-prompt/your-personality-v1.png`: production PNG referenced by the canonical campaign template, linked to the beginner guide. Deploy the site before sending so this URL is available.',
		'',
		'Regenerate from the repository root:',
		'',
		'`node scripts/generate-enneagram-email-asset.mjs`',
		'',
		'Palette A uses the current Streetlamp Symposium lamp colors from `src/scss/index.scss` and `docs/design-system.md`: Instinctual / Anger uses burnt orange #B45309, Emotional / Shame uses 9takes amber #F59E0B, and Intellectual / Fear uses lamp yellow #FBBF24. Solid colored sections preserve the selected hues against deep night and warm stone. Labels and numbers use warm ivory for readability. These are triad group colors, separate from individual type colors.',
		'',
		'Number placement: 9 at the top, followed by 1 through 8 clockwise. Only radial arrows connect the center to the numbers. Arrows use 6.5px warm-ivory shafts and filled 22px arrowheads so they remain visible at email size. Labels read Instinctual / Anger triad, Intellectual / Fear triad, and Emotional / Shame triad. The word intelligence and repeated number badges are omitted. The center uses a stone medallion, softly shaded silhouettes, a mono YOUR label, and tightly spaced Inter display text that fits within the circle.',
		''
	].join('\n')
);
