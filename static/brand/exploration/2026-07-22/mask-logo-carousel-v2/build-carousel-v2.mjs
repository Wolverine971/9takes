// static/brand/exploration/2026-07-22/mask-logo-carousel-v2/build-carousel-v2.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const directory = path.dirname(fileURLToPath(import.meta.url));
const carouselDirectory = path.join(directory, 'carousel');
const masksDirectory = path.resolve(directory, '../mask-expression-v5');
const logoPath = path.resolve(directory, '../mask-logo-carousel-v1/9takes-nine-face-slot-logo-v1.png');
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
    passion: 'AVARICE / GREED',
    slug: 'avarice-greed',
    virtue: 'NON-ATTACHMENT',
    file: '05-type-5-avarice.png',
    viceLines: ['Avarice / greed withholds time,', 'energy, knowledge, and access', 'to avoid feeling depleted.'],
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

const boardOrder = [types[7], types[8], types[0], types[1], types[2], types[3], types[4], types[5], types[6]];

const escapeXml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const fontFaceCss = `
  @font-face { font-family: 'InterBrand'; src: url(data:font/truetype;base64,${interBold}) format('truetype'); font-weight: 700; }
  @font-face { font-family: 'InterBrandBlack'; src: url(data:font/truetype;base64,${interBlack}) format('truetype'); font-weight: 900; }
`;

function textLines(lines, x, y, options = {}) {
  const {
    size = 30,
    lineHeight = 40,
    fill = colors.marble,
    family = 'InterBrand',
    weight = 700,
    letterSpacing = 0,
    anchor = 'start',
    opacity = 1,
  } = options;
  const tspans = lines
    .map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`)
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
  const alpha = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="#fff"/></svg>`);
  return sharp(image).composite([{ input: alpha, blend: 'dest-in' }]).png().toBuffer();
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

function boardPanelSvg(width, height) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="20" fill="#151617" stroke="#292a2b" stroke-width="2"/></svg>`);
}

function boardLabelSvg(type, width, height) {
  const passionSize = type.type === 5 ? 24 : 28;
  const reading = {
    1: 'CONSTRICTED FORCE', 2: 'WARM SELF-IMPORTANCE', 3: 'PERFECT PERFORMANCE',
    4: 'SIDEWAYS LONGING', 5: 'GUARDED INWARDNESS', 6: 'ALERT RECOIL',
    7: 'EAGER EXPANSION', 8: 'EXPANDED FORCE', 9: 'SOFT DISENGAGEMENT',
  }[type.type];
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <style>
      .type { font: 500 25px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #b8894e; letter-spacing: 3px; }
      .passion { font: 600 ${passionSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #f0e8db; letter-spacing: 3px; }
      .reading { font: 500 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #85817a; letter-spacing: 2.2px; }
    </style>
    <text class="type" x="24" y="34">TYPE ${type.type}</text>
    <text class="passion" x="24" y="72">${escapeXml(type.passion)}</text>
    <text class="reading" x="24" y="103">${reading}</text>
  </svg>`);
}

async function makeCoverSlide() {
  const width = 1800;
  const margin = 60;
  const gap = 30;
  const panelWidth = 540;
  const panelHeight = 638;
  const imageSize = 500;
  const header = 220;
  const footer = 70;
  const height = header + panelHeight * 3 + gap * 2 + footer;
  const layers = [];

  layers.push({
    input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${header}">
      <style>
        .eyebrow { font: 600 17px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #b8894e; letter-spacing: 5px; }
        .title { font: 500 58px Georgia, serif; fill: #f0e8db; letter-spacing: -1px; }
        .sub { font: 400 21px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #8f8b84; letter-spacing: .4px; }
      </style>
      <text class="eyebrow" x="60" y="62">9TAKES  /  EXPRESSION SYSTEM  /  STUDY 01</text>
      <text class="title" x="60" y="128">One mask. Nine inner tensions.</text>
      <text class="sub" x="60" y="174">Passion in the expression; virtue in the restraint. Ordered by body, heart, and head centers.</text>
      <line x1="60" y1="206" x2="1740" y2="206" stroke="#292a2b" stroke-width="2"/>
    </svg>`),
    left: 0,
    top: 0,
  });

  for (const [index, type] of boardOrder.entries()) {
    const column = index % 3;
    const row = Math.floor(index / 3);
    const left = margin + column * (panelWidth + gap);
    const top = header + row * (panelHeight + gap);
    const image = await sharp(path.join(masksDirectory, type.file))
      .resize(imageSize, imageSize, { fit: 'cover' })
      .png()
      .toBuffer();
    layers.push({ input: boardPanelSvg(panelWidth, panelHeight), left, top });
    layers.push({ input: image, left: left + 20, top: top + 20 });
    layers.push({ input: boardLabelSvg(type, imageSize, 110), left: left + 20, top: top + 518 });
  }

  layers.push({
    input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${footer}">
      <style>.f { font: 500 15px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #5f5d59; letter-spacing: 2.4px; }</style>
      <text class="f" x="60" y="45">TRIAD ORDER  8 9 1  /  2 3 4  /  5 6 7</text>
      <text class="f" text-anchor="end" x="1740" y="45">SWIPE TO NAME THE PATTERNS  →</text>
    </svg>`),
    left: 0,
    top: height - footer,
  });

  const board = await sharp({ create: { width, height, channels: 3, background: '#0d0e0f' } })
    .composite(layers)
    .png()
    .toBuffer();

  await sharp(board)
    .resize(1080, 1350, { fit: 'cover', position: 'centre' })
    .png({ compressionLevel: 9 })
    .toFile(path.join(carouselDirectory, 'slide-01-cover.png'));
}

async function makeHookSlide() {
  const overlay = svgBuffer(
    1080,
    1350,
    `<text x="64" y="185" fill="${colors.amber}" font-family="InterBrand" font-size="17" letter-spacing="4">A FAMILIAR LIST / WITH TWO MISSING PIECES</text>
     ${textLines(['YOU’VE HEARD OF', 'THE 7 DEADLY SINS.'], 64, 285, { size: 70, lineHeight: 82, fill: colors.marble, family: 'InterBrandBlack', weight: 900, letterSpacing: -1.5 })}
     <line x1="64" y1="484" x2="1016" y2="484" stroke="${colors.stoneMid}" stroke-width="2"/>
     <text x="64" y="586" fill="${colors.marbleShadow}" font-family="InterBrand" font-size="30" letter-spacing="1">THE ENNEAGRAM NAMES</text>
     <text x="64" y="812" fill="${colors.amber}" font-family="InterBrandBlack" font-size="286" letter-spacing="-18">9</text>
     <text x="284" y="697" fill="${colors.marble}" font-family="InterBrandBlack" font-size="92" letter-spacing="-2">RECURRING</text>
     <text x="284" y="793" fill="${colors.marble}" font-family="InterBrandBlack" font-size="92" letter-spacing="-2">PASSIONS.</text>
     <rect x="64" y="884" width="952" height="176" rx="24" fill="${colors.nightMid}" stroke="${colors.stoneMid}" stroke-width="2"/>
     <text x="96" y="934" fill="${colors.inkDim}" font-family="InterBrand" font-size="15" letter-spacing="3">THE FAMILIAR SEVEN</text>
     <text x="96" y="995" fill="${colors.marbleWarm}" font-family="InterBrand" font-size="25" letter-spacing="0.4">ANGER  ·  PRIDE  ·  ENVY  ·  GREED</text>
     <text x="96" y="1036" fill="${colors.marbleWarm}" font-family="InterBrand" font-size="25" letter-spacing="0.4">GLUTTONY  ·  LUST  ·  SLOTH</text>
     <text x="64" y="1148" fill="${colors.amberLight}" font-family="InterBrandBlack" font-size="42" letter-spacing="0.2">SEVEN OVERLAP.</text>
     <text x="64" y="1203" fill="${colors.marbleShadow}" font-family="InterBrand" font-size="29">Two inner patterns are often overlooked.</text>`,
  );
  await sharp({ create: { width: 1080, height: 1350, channels: 4, background: colors.night } })
    .composite([
      { input: carouselBackground('INNER TENSIONS / 02 OF 13'), left: 0, top: 0 },
      { input: overlay, left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(carouselDirectory, 'slide-02-seven-to-nine.png'));
}

async function makeBridgeSlide() {
  const deceit = await cropMask('03-type-3-deceit.png', 348, 1000, 24);
  const fear = await cropMask('06-type-6-fear.png', 348, 1000, 24);
  const overlay = svgBuffer(
    1080,
    1350,
    `<text x="64" y="176" fill="${colors.amber}" font-family="InterBrand" font-size="17" letter-spacing="4">THE TWO THE OLD LIST MISSES</text>
     <text x="64" y="248" fill="${colors.marble}" font-family="InterBrandBlack" font-size="58" letter-spacing="-1">DECEIT + FEAR</text>
     <rect x="64" y="292" width="444" height="578" rx="30" fill="${colors.nightMid}" stroke="${colors.stoneMid}" stroke-width="2"/>
     <rect x="572" y="292" width="444" height="578" rx="30" fill="${colors.nightMid}" stroke="${colors.stoneMid}" stroke-width="2"/>
     <text x="96" y="702" fill="${colors.amber}" font-family="InterBrand" font-size="15" letter-spacing="3">TYPE 3</text>
     <text x="96" y="751" fill="${colors.marble}" font-family="InterBrandBlack" font-size="42" letter-spacing="1">DECEIT</text>
     ${textLines(['Not only lying to others.', 'It is losing contact with what', 'is true while performing what works.'], 96, 796, { size: 21, lineHeight: 28, fill: colors.marbleShadow })}
     <text x="604" y="702" fill="${colors.amber}" font-family="InterBrand" font-size="15" letter-spacing="3">TYPE 6</text>
     <text x="604" y="751" fill="${colors.marble}" font-family="InterBrandBlack" font-size="42" letter-spacing="1">FEAR</text>
     ${textLines(['Not only feeling scared.', 'It is organizing attention around', 'uncertainty, threats, and trust.'], 604, 796, { size: 21, lineHeight: 28, fill: colors.marbleShadow })}
     <line x1="64" y1="920" x2="1016" y2="920" stroke="${colors.stoneMid}" stroke-width="2"/>
     <text x="64" y="972" fill="${colors.amber}" font-family="InterBrand" font-size="15" letter-spacing="3">PASSION / VICE</text>
     ${textLines(['The automatic pattern that takes over.'], 64, 1014, { size: 27, fill: colors.marbleWarm })}
     <text x="64" y="1090" fill="${colors.amber}" font-family="InterBrand" font-size="15" letter-spacing="3">VIRTUE</text>
     ${textLines(['The quality that loosens its grip', 'and creates another choice.'], 64, 1132, { size: 27, lineHeight: 37, fill: colors.marbleWarm })}`,
  );
  await sharp({ create: { width: 1080, height: 1350, channels: 4, background: colors.night } })
    .composite([
      { input: carouselBackground('INNER TENSIONS / 03 OF 13'), left: 0, top: 0 },
      { input: overlay, left: 0, top: 0 },
      { input: deceit, left: 112, top: 316 },
      { input: fear, left: 620, top: 316 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(carouselDirectory, 'slide-03-the-overlooked-two.png'));
}

async function makeTypeSlide(type, slideIndex) {
  const mask = await cropMask(type.file, 480, 1000, 26);
  const slideNumber = String(type.type).padStart(2, '0');
  const passionSize = type.type === 5 ? 60 : 82;
  const overlay = svgBuffer(
    1080,
    1350,
    `<text x="1008" y="370" fill="${colors.amber}" font-family="InterBrandBlack" font-size="260" text-anchor="end" opacity="0.055">${slideNumber}</text>
     <rect x="292" y="137" width="496" height="496" rx="34" fill="none" stroke="${colors.stoneEdge}" stroke-width="2"/>
     <path d="M292 213V171C292 152.222 307.222 137 326 137H368" fill="none" stroke="${colors.amber}" stroke-width="5"/>
     <text x="64" y="682" fill="${colors.amber}" font-family="InterBrand" font-size="17" letter-spacing="4">TYPE ${type.type}  /  ${escapeXml(type.role)}  /  ${escapeXml(type.center)}</text>
     <text x="64" y="772" fill="${colors.marble}" font-family="InterBrandBlack" font-size="${passionSize}" letter-spacing="-1.5">${escapeXml(type.passion)}</text>
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
      { input: carouselBackground(`THE NINE PASSIONS / ${String(slideIndex).padStart(2, '0')} OF 13`), left: 0, top: 0 },
      { input: mask, left: 300, top: 145 },
      { input: overlay, left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(carouselDirectory, `slide-${String(slideIndex).padStart(2, '0')}-type-${type.type}-${type.slug ?? type.passion.toLowerCase()}.png`));
}

async function makeClosingSlide() {
  const logo = await sharp(logoPath).resize(430, 430, { kernel: sharp.kernel.lanczos3 }).png().toBuffer();
  const overlay = svgBuffer(
    1080,
    1350,
    `<rect x="309" y="146" width="462" height="462" rx="48" fill="none" stroke="${colors.amber}" stroke-opacity="0.38" stroke-width="2"/>
     <text x="64" y="735" fill="${colors.amber}" font-family="InterBrand" font-size="17" letter-spacing="4">THE QUESTION ISN’T WHETHER YOU HAVE A PATTERN.</text>
     ${textLines(['WHICH ONE HITS', 'YOU HARDEST?'], 64, 830, { size: 74, lineHeight: 82, fill: colors.marble, family: 'InterBrandBlack', weight: 900, letterSpacing: -1.5 })}
     ${textLines(['Which passion has the strongest grip on you—', 'and which virtue would loosen it?'], 64, 1030, { size: 31, lineHeight: 44, fill: colors.marbleShadow })}
     <line x1="64" y1="1148" x2="1016" y2="1148" stroke="${colors.stoneMid}" stroke-width="2"/>
     <text x="64" y="1210" fill="${colors.amberLight}" font-family="InterBrandBlack" font-size="34" letter-spacing="0.4">NAME THE PATTERN.</text>
     <text x="1016" y="1210" fill="${colors.marbleWarm}" font-family="InterBrandBlack" font-size="34" letter-spacing="0.4" text-anchor="end">PRACTICE THE VIRTUE.</text>`,
  );
  await sharp({ create: { width: 1080, height: 1350, channels: 4, background: colors.night } })
    .composite([
      { input: carouselBackground('A QUESTION FOR YOU / 13 OF 13'), left: 0, top: 0 },
      { input: logo, left: 325, top: 162 },
      { input: overlay, left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(carouselDirectory, 'slide-13-closing-question.png'));
}

async function makeContactSheet() {
  const slideFiles = fs.readdirSync(carouselDirectory).filter((file) => /^slide-\d+.*\.png$/.test(file)).sort();
  const thumbWidth = 216;
  const thumbHeight = 270;
  const columns = 5;
  const rows = Math.ceil(slideFiles.length / columns);
  const gap = 18;
  const margin = 36;
  const labelHeight = 46;
  const width = margin * 2 + columns * thumbWidth + (columns - 1) * gap;
  const height = margin * 2 + rows * (thumbHeight + labelHeight) + (rows - 1) * gap;
  const layers = [];

  for (const [index, file] of slideFiles.entries()) {
    const thumb = await sharp(path.join(carouselDirectory, file)).resize(thumbWidth, thumbHeight, { fit: 'cover' }).png().toBuffer();
    const left = margin + (index % columns) * (thumbWidth + gap);
    const top = margin + Math.floor(index / columns) * (thumbHeight + labelHeight + gap);
    const label = svgBuffer(thumbWidth, labelHeight, `<text x="0" y="30" fill="${colors.marbleShadow}" font-family="InterBrand" font-size="13" letter-spacing="1.2">${escapeXml(file.replace('.png', '').toUpperCase())}</text>`);
    layers.push({ input: thumb, left, top });
    layers.push({ input: label, left, top: top + thumbHeight });
  }

  await sharp({ create: { width, height, channels: 4, background: colors.stone } })
    .composite(layers)
    .png({ compressionLevel: 9 })
    .toFile(path.join(directory, '9takes-nine-inner-tensions-carousel-v2-contact-sheet.png'));
}

await makeCoverSlide();
await makeHookSlide();
await makeBridgeSlide();
for (const [index, type] of types.entries()) {
  await makeTypeSlide(type, index + 4);
}
await makeClosingSlide();
await makeContactSheet();
