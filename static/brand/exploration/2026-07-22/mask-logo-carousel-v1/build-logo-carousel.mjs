import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const directory = path.dirname(fileURLToPath(import.meta.url));
const carouselDirectory = path.join(directory, 'carousel');
const masksDirectory = path.resolve(directory, '../mask-expression-v5');
const interBoldPath = path.resolve(directory, '../../../../fonts/inter/Inter-Bold.ttf');
const interBlackPath = path.resolve(directory, '../../../../fonts/inter/Inter-Black.ttf');

fs.mkdirSync(carouselDirectory, { recursive: true });

const interBold = fs.readFileSync(interBoldPath).toString('base64');
const interBlack = fs.readFileSync(interBlackPath).toString('base64');

const colors = {
  night: '#0a0807',
  nightMid: '#16110d',
  stone: '#241d17',
  stoneMid: '#3a302a',
  stoneEdge: '#5c4f47',
  amber: '#f59e0b',
  amberDeep: '#b45309',
  amberLight: '#fbbf24',
  marble: '#faf8f4',
  marbleWarm: '#ede6da',
  marbleShadow: '#a8a095',
  inkDim: '#948578',
};

const logoOrder = [
  { type: 8, file: '08-type-8-lust.png' },
  { type: 9, file: '09-type-9-sloth.png' },
  { type: 1, file: '01-type-1-anger.png' },
  { type: 2, file: '02-type-2-pride.png' },
  { type: 3, file: '03-type-3-deceit.png' },
  { type: 4, file: '04-type-4-envy.png' },
  { type: 5, file: '05-type-5-avarice.png' },
  { type: 6, file: '06-type-6-fear.png' },
  { type: 7, file: '07-type-7-gluttony.png' },
];

const types = [
  {
    type: 1,
    role: 'THE IMPROVER',
    center: 'BODY CENTER',
    passion: 'ANGER',
    virtue: 'SERENITY',
    file: '01-type-1-anger.png',
    viceLines: ['Anger builds when reality', 'fails to meet an inner standard', 'of what is right.'],
    virtueLines: ['Serenity accepts what is,', 'then acts without resentment', 'or inner war.'],
    movementLines: ['Correct what you can.', 'Release the demand that everything comply.'],
  },
  {
    type: 2,
    role: 'THE GIVER',
    center: 'HEART CENTER',
    passion: 'PRIDE',
    virtue: 'HUMILITY',
    file: '02-type-2-pride.png',
    viceLines: ['Pride hides personal needs', 'inside the need to be helpful,', 'valued, and indispensable.'],
    virtueLines: ['Humility allows love without', 'earning it—and makes room', 'for needs of your own.'],
    movementLines: ['Let care move both ways.', 'Being needed is not the same as being loved.'],
  },
  {
    type: 3,
    role: 'THE PERFORMER',
    center: 'HEART CENTER',
    passion: 'DECEIT',
    virtue: 'TRUTHFULNESS',
    file: '03-type-3-deceit.png',
    viceLines: ['Deceit is self-deception:', 'shaping identity around the', 'image that wins approval.'],
    virtueLines: ['Truthfulness reconnects worth', 'to the real self—not the role,', 'result, or applause.'],
    movementLines: ['Pause the performance.', 'Notice what is true before what looks successful.'],
  },
  {
    type: 4,
    role: 'THE INDIVIDUALIST',
    center: 'HEART CENTER',
    passion: 'ENVY',
    virtue: 'EQUANIMITY',
    file: '04-type-4-envy.png',
    viceLines: ['Envy fixes attention on what', 'is missing, distant, or more', 'complete in someone else.'],
    virtueLines: ['Equanimity holds every feeling', 'without turning absence into', 'an identity.'],
    movementLines: ['Feel the longing.', 'Then return to what is present and already yours.'],
  },
  {
    type: 5,
    role: 'THE OBSERVER',
    center: 'HEAD CENTER',
    passion: 'AVARICE',
    virtue: 'NON-ATTACHMENT',
    file: '05-type-5-avarice.png',
    viceLines: ['Avarice withholds time, energy,', 'knowledge, and access to avoid', 'feeling depleted.'],
    virtueLines: ['Non-attachment trusts there is', 'enough energy to participate,', 'feel, and share.'],
    movementLines: ['Enter before you feel completely prepared.', 'Contact creates energy, too.'],
  },
  {
    type: 6,
    role: 'THE QUESTIONER',
    center: 'HEAD CENTER',
    passion: 'FEAR',
    virtue: 'COURAGE',
    file: '06-type-6-fear.png',
    viceLines: ['Fear scans for danger,', 'questions support, and rehearses', 'what could go wrong.'],
    virtueLines: ['Courage acts without perfect', 'certainty and learns to trust', 'inner guidance.'],
    movementLines: ['Prepare—then choose.', 'Certainty is not required for the next step.'],
  },
  {
    type: 7,
    role: 'THE ENTHUSIAST',
    center: 'HEAD CENTER',
    passion: 'GLUTTONY',
    virtue: 'SOBRIETY',
    file: '07-type-7-gluttony.png',
    viceLines: ['Gluttony chases options,', 'stimulation, and future pleasure', 'to outrun limits or pain.'],
    virtueLines: ['Sobriety stays with the whole', 'present moment: pleasure, pain,', 'and enough.'],
    movementLines: ['Stay with this experience.', 'Depth appears when escape is no longer urgent.'],
  },
  {
    type: 8,
    role: 'THE PROTECTOR',
    center: 'BODY CENTER',
    passion: 'LUST',
    virtue: 'INNOCENCE',
    file: '08-type-8-lust.png',
    viceLines: ['Lust means excess intensity:', 'pushing harder to stay powerful,', 'free, and invulnerable.'],
    virtueLines: ['Innocence restores tenderness', 'and vulnerability without', 'surrendering strength.'],
    movementLines: ['Use only the force the moment needs.', 'Softness can be power without armor.'],
  },
  {
    type: 9,
    role: 'THE MEDIATOR',
    center: 'BODY CENTER',
    passion: 'SLOTH',
    virtue: 'ACTION',
    file: '09-type-9-sloth.png',
    viceLines: ['Sloth is self-forgetting:', 'attention drifts to others while', 'personal priorities go quiet.'],
    virtueLines: ['Action wakes up desire, chooses', 'a direction, and brings energy', 'back to your own life.'],
    movementLines: ['Name what you want.', 'Take one visible step before merging again.'],
  },
];

const escapeXml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const fontFaceCss = `
  @font-face {
    font-family: 'InterBrand';
    src: url(data:font/truetype;base64,${interBold}) format('truetype');
    font-weight: 700;
  }
  @font-face {
    font-family: 'InterBrandBlack';
    src: url(data:font/truetype;base64,${interBlack}) format('truetype');
    font-weight: 900;
  }
`;

function textLines(lines, x, y, options = {}) {
  const {
    size = 30,
    lineHeight = 40,
    fill = colors.marble,
    family = 'Arial, Helvetica, sans-serif',
    weight = 400,
    letterSpacing = 0,
    anchor = 'start',
    opacity = 1,
  } = options;
  const tspans = lines
    .map(
      (line, index) =>
        `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`,
    )
    .join('');
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}" font-weight="${weight}" letter-spacing="${letterSpacing}" text-anchor="${anchor}" opacity="${opacity}">${tspans}</text>`;
}

function svgBuffer(width, height, body, extraStyles = '') {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <radialGradient id="nightGlow" cx="28%" cy="8%" r="88%">
        <stop offset="0" stop-color="#3a2412" stop-opacity="0.48"/>
        <stop offset="0.45" stop-color="#16110d" stop-opacity="0.2"/>
        <stop offset="1" stop-color="#0a0807" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="amberLine" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f59e0b"/>
        <stop offset="1" stop-color="#b45309"/>
      </linearGradient>
      <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="14"/>
      </filter>
    </defs>
    <style>${fontFaceCss}${extraStyles}</style>
    ${body}
  </svg>`);
}

async function cropMask(file, size, cropSize = 1000, radius = 22) {
  const input = path.join(masksDirectory, file);
  const metadata = await sharp(input).metadata();
  const width = metadata.width ?? 1254;
  const height = metadata.height ?? 1254;
  const crop = Math.min(cropSize, width, height);
  const left = Math.round((width - crop) / 2);
  const top = Math.round((height - crop) / 2);
  const image = await sharp(input)
    .extract({ left, top, width: crop, height: crop })
    .resize(size, size, { fit: 'cover', kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" fill="#fff"/></svg>`);
  return sharp(image).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
}

async function makeLogo(outputName, plateColor, borderColor) {
  const size = 2048;
  const plateX = 76;
  const plateSize = 1896;
  const cell = 600;
  const gap = 24;
  const inner = 24;
  const layers = [];

  const base = svgBuffer(
    size,
    size,
    `<rect width="2048" height="2048" fill="${colors.night}"/>
     <rect width="2048" height="2048" fill="url(#nightGlow)"/>
     <rect x="${plateX}" y="${plateX}" width="${plateSize}" height="${plateSize}" rx="104" fill="${plateColor}" stroke="${borderColor}" stroke-width="10"/>
     <rect x="${plateX + 12}" y="${plateX + 12}" width="${plateSize - 24}" height="${plateSize - 24}" rx="92" fill="none" stroke="#fbbf24" stroke-opacity="0.16" stroke-width="4"/>`,
  );
  layers.push({ input: base, left: 0, top: 0 });

  for (const [index, mask] of logoOrder.entries()) {
    const image = await cropMask(mask.file, cell, 1000, 28);
    const column = index % 3;
    const row = Math.floor(index / 3);
    layers.push({
      input: image,
      left: plateX + inner + column * (cell + gap),
      top: plateX + inner + row * (cell + gap),
    });
  }

  const output = path.join(directory, outputName);
  await sharp({ create: { width: size, height: size, channels: 4, background: colors.night } })
    .composite(layers)
    .png({ compressionLevel: 9 })
    .toFile(output);
  return output;
}

async function makeLogoSystem() {
  const primary = await makeLogo(
    '9takes-nine-face-slot-logo-v1.png',
    '#4a2b13',
    colors.amberDeep,
  );
  await makeLogo('9takes-nine-face-slot-logo-v1-quiet.png', '#17110d', colors.stoneEdge);

  for (const size of [1024, 512, 256, 192, 128, 64, 48, 32]) {
    await sharp(primary)
      .resize(size, size, { kernel: sharp.kernel.lanczos3 })
      .sharpen(size <= 128 ? 0.9 : 0.35)
      .png({ compressionLevel: 9 })
      .toFile(path.join(directory, `9takes-nine-face-slot-logo-v1-${size}.png`));
  }
}

async function makeLogoBoard() {
  const width = 1800;
  const height = 1200;
  const primaryLogo = await sharp(path.join(directory, '9takes-nine-face-slot-logo-v1.png'))
    .resize(760, 760)
    .png()
    .toBuffer();
  const icon128 = await sharp(path.join(directory, '9takes-nine-face-slot-logo-v1-128.png'))
    .resize(128, 128)
    .png()
    .toBuffer();
  const icon64 = await sharp(path.join(directory, '9takes-nine-face-slot-logo-v1-64.png'))
    .resize(64, 64)
    .png()
    .toBuffer();
  const icon32 = await sharp(path.join(directory, '9takes-nine-face-slot-logo-v1-32.png'))
    .resize(32, 32)
    .png()
    .toBuffer();

  const background = svgBuffer(
    width,
    height,
    `<rect width="1800" height="1200" fill="${colors.night}"/>
     <rect width="1800" height="1200" fill="url(#nightGlow)"/>
     <text x="80" y="74" fill="${colors.amber}" font-family="InterBrand" font-size="18" letter-spacing="6">9TAKES / LOGO STUDY / NINE-FACE SLOTS</text>
     <line x1="80" y1="104" x2="1720" y2="104" stroke="${colors.stoneMid}" stroke-width="2"/>
     <text x="930" y="245" fill="${colors.marble}" font-family="InterBrandBlack" font-size="78" letter-spacing="-2">NINE FACES.</text>
     <text x="930" y="325" fill="${colors.marble}" font-family="InterBrandBlack" font-size="78" letter-spacing="-2">ONE MARK.</text>
     ${textLines(['The old cube’s nine slots remain,', 'but the perspectives are now human.'], 930, 400, { size: 30, lineHeight: 43, fill: colors.marbleShadow })}
     <text x="930" y="555" fill="${colors.amber}" font-family="InterBrand" font-size="17" letter-spacing="4">CONSTRUCTION</text>
     ${textLines(['3 × 3 equal voices', 'No perspective side', 'No text inside the mark', 'Type 3 remains at the center'], 930, 606, { size: 27, lineHeight: 48, fill: colors.marbleWarm })}
     <text x="930" y="862" fill="${colors.amber}" font-family="InterBrand" font-size="17" letter-spacing="4">SCALE TEST</text>
     <text x="930" y="1080" fill="${colors.inkDim}" font-family="InterBrand" font-size="16" letter-spacing="3">128 PX</text>
     <text x="1120" y="1080" fill="${colors.inkDim}" font-family="InterBrand" font-size="16" letter-spacing="3">64 PX</text>
     <text x="1260" y="1080" fill="${colors.inkDim}" font-family="InterBrand" font-size="16" letter-spacing="3">32 PX</text>
     <line x1="80" y1="1150" x2="1720" y2="1150" stroke="${colors.stoneMid}" stroke-width="2"/>
     <text x="80" y="1182" fill="${colors.inkDim}" font-family="InterBrand" font-size="15" letter-spacing="3">ONE SITUATION, 9 WAYS TO SEE IT.</text>`,
  );

  await sharp({ create: { width, height, channels: 4, background: colors.night } })
    .composite([
      { input: background, left: 0, top: 0 },
      { input: primaryLogo, left: 80, top: 170 },
      { input: icon128, left: 930, top: 900 },
      { input: icon64, left: 1120, top: 932 },
      { input: icon32, left: 1260, top: 948 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(directory, '9takes-nine-face-logo-board-v1.png'));
}

function carouselBackground(slideLabel) {
  return svgBuffer(
    1080,
    1350,
    `<rect width="1080" height="1350" fill="${colors.night}"/>
     <rect width="1080" height="1350" fill="url(#nightGlow)"/>
     <path d="M0 0H1080V14H0Z" fill="url(#amberLine)"/>
     <circle cx="190" cy="240" r="220" fill="${colors.amber}" opacity="0.025"/>
     <circle cx="935" cy="1020" r="300" fill="${colors.amberDeep}" opacity="0.025"/>
     <text x="64" y="78" fill="${colors.marble}" font-family="InterBrandBlack" font-size="25" letter-spacing="5">9TAKES</text>
     <text x="1016" y="78" fill="${colors.inkDim}" font-family="InterBrand" font-size="16" letter-spacing="3" text-anchor="end">${escapeXml(slideLabel)}</text>
     <line x1="64" y1="105" x2="1016" y2="105" stroke="${colors.stoneMid}" stroke-width="2"/>
     <line x1="64" y1="1290" x2="1016" y2="1290" stroke="${colors.stoneMid}" stroke-width="2"/>
     <text x="64" y="1326" fill="${colors.inkDim}" font-family="InterBrand" font-size="15" letter-spacing="2.4">ONE SITUATION, 9 WAYS TO SEE IT.</text>
     <text x="1016" y="1326" fill="${colors.amberDeep}" font-family="InterBrand" font-size="15" letter-spacing="2.4" text-anchor="end">9TAKES.COM</text>`,
  );
}

async function makeCoverSlide() {
  const logo = await sharp(path.join(directory, '9takes-nine-face-slot-logo-v1.png'))
    .resize(460, 460, { kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();
  const legend = types
    .map((type, index) => {
      const column = index % 3;
      const row = Math.floor(index / 3);
      const x = 64 + column * 326;
      const y = 953 + row * 102;
      return `<text x="${x}" y="${y}" fill="${colors.amber}" font-family="InterBrand" font-size="14" letter-spacing="2.5">TYPE ${type.type}</text>
        <text x="${x}" y="${y + 29}" fill="${colors.marble}" font-family="InterBrandBlack" font-size="20" letter-spacing="1.2">${escapeXml(type.passion)}</text>
        <text x="${x}" y="${y + 53}" fill="${colors.marbleShadow}" font-family="InterBrand" font-size="14" letter-spacing="1.4">→ ${escapeXml(type.virtue)}</text>`;
    })
    .join('');

  const overlay = svgBuffer(
    1080,
    1350,
    `<rect x="300" y="128" width="480" height="480" rx="44" fill="none" stroke="${colors.amber}" stroke-opacity="0.45" stroke-width="2"/>
     <text x="64" y="682" fill="${colors.marble}" font-family="InterBrandBlack" font-size="72" letter-spacing="-1">THE NINE PASSIONS</text>
     <text x="64" y="741" fill="${colors.amberLight}" font-family="InterBrand" font-size="34" letter-spacing="1.1">AND THE VIRTUES THAT LOOSEN THEM</text>
     ${textLines(['The passion is the pattern that keeps repeating.', 'The virtue creates another choice.'], 64, 805, { size: 28, lineHeight: 40, fill: colors.marbleShadow })}
     <text x="1016" y="868" fill="${colors.amber}" font-family="InterBrand" font-size="16" letter-spacing="3" text-anchor="end">SWIPE →</text>
     <line x1="64" y1="895" x2="1016" y2="895" stroke="${colors.stoneMid}" stroke-width="2"/>
     ${legend}`,
  );

  await sharp({ create: { width: 1080, height: 1350, channels: 4, background: colors.night } })
    .composite([
      { input: carouselBackground('ENNEAGRAM FIELD NOTES / 01 OF 10'), left: 0, top: 0 },
      { input: logo, left: 310, top: 138 },
      { input: overlay, left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(carouselDirectory, 'slide-01-cover.png'));
}

async function makeTypeSlide(type, slideIndex) {
  const mask = await cropMask(type.file, 480, 1000, 26);
  const slideNumber = String(type.type).padStart(2, '0');
  const overlay = svgBuffer(
    1080,
    1350,
    `<text x="1008" y="370" fill="${colors.amber}" font-family="InterBrandBlack" font-size="260" text-anchor="end" opacity="0.055">${slideNumber}</text>
     <rect x="292" y="137" width="496" height="496" rx="34" fill="none" stroke="${colors.stoneEdge}" stroke-width="2"/>
     <path d="M292 213V171C292 152.222 307.222 137 326 137H368" fill="none" stroke="${colors.amber}" stroke-width="5"/>
     <text x="64" y="682" fill="${colors.amber}" font-family="InterBrand" font-size="17" letter-spacing="4">TYPE ${type.type}  /  ${escapeXml(type.role)}  /  ${escapeXml(type.center)}</text>
     <text x="64" y="772" fill="${colors.marble}" font-family="InterBrandBlack" font-size="82" letter-spacing="-1.5">${escapeXml(type.passion)}</text>
     <text x="64" y="829" fill="${colors.marbleShadow}" font-family="InterBrand" font-size="35" letter-spacing="1">→ ${escapeXml(type.virtue)}</text>
     <line x1="64" y1="868" x2="1016" y2="868" stroke="${colors.stoneMid}" stroke-width="2"/>
     <text x="64" y="914" fill="${colors.amber}" font-family="InterBrand" font-size="15" letter-spacing="3">PASSION / VICE</text>
     <text x="568" y="914" fill="${colors.amber}" font-family="InterBrand" font-size="15" letter-spacing="3">VIRTUE</text>
     ${textLines(type.viceLines, 64, 958, { size: 27, lineHeight: 39, fill: colors.marbleWarm })}
     ${textLines(type.virtueLines, 568, 958, { size: 27, lineHeight: 39, fill: colors.marbleWarm })}
     <line x1="64" y1="1094" x2="1016" y2="1094" stroke="${colors.stoneMid}" stroke-width="2"/>
     <text x="64" y="1138" fill="${colors.amber}" font-family="InterBrand" font-size="15" letter-spacing="3">THE MOVEMENT</text>
     ${textLines(type.movementLines, 64, 1182, { size: 27, lineHeight: 39, fill: colors.marbleShadow })}`,
  );

  await sharp({ create: { width: 1080, height: 1350, channels: 4, background: colors.night } })
    .composite([
      {
        input: carouselBackground(
          `THE NINE PASSIONS / ${String(slideIndex).padStart(2, '0')} OF 10`,
        ),
        left: 0,
        top: 0,
      },
      { input: mask, left: 300, top: 145 },
      { input: overlay, left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(
      path.join(
        carouselDirectory,
        `slide-${String(slideIndex).padStart(2, '0')}-type-${type.type}-${type.passion.toLowerCase()}.png`,
      ),
    );
}

async function makeContactSheet() {
  const slideFiles = fs
    .readdirSync(carouselDirectory)
    .filter((file) => file.startsWith('slide-') && file.endsWith('.png'))
    .sort();
  const thumbWidth = 270;
  const thumbHeight = 338;
  const columns = 5;
  const rows = 2;
  const gap = 20;
  const margin = 40;
  const width = margin * 2 + columns * thumbWidth + (columns - 1) * gap;
  const height = margin * 2 + rows * thumbHeight + (rows - 1) * gap;
  const layers = [];

  for (const [index, file] of slideFiles.entries()) {
    const thumb = await sharp(path.join(carouselDirectory, file))
      .resize(thumbWidth, thumbHeight, { fit: 'cover' })
      .png()
      .toBuffer();
    layers.push({
      input: thumb,
      left: margin + (index % columns) * (thumbWidth + gap),
      top: margin + Math.floor(index / columns) * (thumbHeight + gap),
    });
  }

  await sharp({ create: { width, height, channels: 4, background: colors.stone } })
    .composite(layers)
    .png({ compressionLevel: 9 })
    .toFile(path.join(directory, '9takes-nine-passions-carousel-contact-sheet.png'));
}

function writeCaptionAndAltText() {
  const altText = types
    .map(
      (type, index) =>
        `${index + 2}. Type ${type.type}, ${type.passion} to ${type.virtue}: a warm-bone theatrical mask displaying ${type.passion.toLowerCase()}, with concise text explaining the passion, virtue, and movement between them.`,
    )
    .join('\n');
  const caption = `# Instagram carousel package\n\n## Suggested caption\n\nEvery Enneagram type has a passion: an automatic emotional strategy that keeps repeating. The corresponding virtue is not a prize for being good. It is the quality that loosens the pattern and creates another choice.\n\n1 — Anger → Serenity\n2 — Pride → Humility\n3 — Deceit → Truthfulness\n4 — Envy → Equanimity\n5 — Avarice → Non-attachment\n6 — Fear → Courage\n7 — Gluttony → Sobriety\n8 — Lust → Innocence\n9 — Sloth → Action\n\nWhich movement feels most familiar right now?\n\nOne situation, 9 ways to see it.\n\n#enneagram #enneagramtypes #selfawareness #personality #9takes\n\n## Framework note\n\nThis carousel uses the traditional passions and virtues terminology. Enneagram schools differ, and the framework is presented as a reflective language rather than a clinical assessment.\n\n## Sources used for wording\n\n- Enneagram of Personality: passion/virtue table and center groupings.\n- The Narrative Enneagram: type focus-of-attention and life-lesson descriptions.\n\n## Alt text\n\n1. Cover: a square 9takes logo made of nine warm-bone theatrical masks in a 3×3 amber-edged grid, followed by all nine passion-to-virtue pairs.\n${altText}\n`;
  fs.writeFileSync(path.join(carouselDirectory, 'caption-and-alt-text.md'), caption);
}

await makeLogoSystem();
await makeLogoBoard();
await makeCoverSlide();
for (const [index, type] of types.entries()) {
  await makeTypeSlide(type, index + 2);
}
await makeContactSheet();
writeCaptionAndAltText();

