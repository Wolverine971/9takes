import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = path.dirname(fileURLToPath(import.meta.url));

const masks = [
  { type: 8, passion: 'LUST', reading: 'EXPANDED FORCE', file: '08-type-8-lust.png' },
  { type: 9, passion: 'SLOTH', reading: 'SOFT DISENGAGEMENT', file: '09-type-9-sloth.png' },
  { type: 1, passion: 'ANGER', reading: 'CONSTRICTED FORCE', file: '01-type-1-anger.png' },
  { type: 2, passion: 'PRIDE', reading: 'WARM SELF-IMPORTANCE', file: '02-type-2-pride.png' },
  { type: 3, passion: 'DECEIT', reading: 'PERFECT PERFORMANCE', file: '03-type-3-deceit.png' },
  { type: 4, passion: 'ENVY', reading: 'SIDEWAYS LONGING', file: '04-type-4-envy.png' },
  { type: 5, passion: 'AVARICE', reading: 'GUARDED INWARDNESS', file: '05-type-5-avarice.png' },
  { type: 6, passion: 'FEAR', reading: 'ALERT RECOIL', file: '06-type-6-fear.png' },
  { type: 7, passion: 'GLUTTONY', reading: 'EAGER EXPANSION', file: '07-type-7-gluttony.png' },
];

const escapeXml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

async function makeMosaic() {
  const cell = 480;
  const gutter = 18;
  const margin = 24;
  const size = margin * 2 + cell * 3 + gutter * 2;
  const layers = [];

  for (const [index, mask] of masks.entries()) {
    const input = await sharp(path.join(directory, mask.file))
      .resize(cell, cell, { fit: 'cover' })
      .png()
      .toBuffer();
    layers.push({
      input,
      left: margin + (index % 3) * (cell + gutter),
      top: margin + Math.floor(index / 3) * (cell + gutter),
    });
  }

  const output = path.join(directory, '9takes-nine-mask-mosaic-v5.png');
  await sharp({
    create: { width: size, height: size, channels: 3, background: '#141516' },
  })
    .composite(layers)
    .png({ compressionLevel: 9 })
    .toFile(output);

  for (const size of [512, 256, 128, 64, 32]) {
    await sharp(output)
      .resize(size, size, { kernel: sharp.kernel.lanczos3 })
      .sharpen(size <= 128 ? 0.8 : 0.35)
      .png({ compressionLevel: 9 })
      .toFile(path.join(directory, `9takes-nine-mask-mosaic-v5-${size}.png`));
  }
}

function panelSvg(width, height) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="20" fill="#151617" stroke="#292a2b" stroke-width="2"/>
  </svg>`);
}

function labelSvg(mask, width, height) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <style>
      .type { font: 500 25px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #b8894e; letter-spacing: 3px; }
      .passion { font: 600 28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #f0e8db; letter-spacing: 4px; }
      .reading { font: 500 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #85817a; letter-spacing: 2.2px; }
    </style>
    <text class="type" x="24" y="34">TYPE ${mask.type}</text>
    <text class="passion" x="24" y="72">${escapeXml(mask.passion)}</text>
    <text class="reading" x="24" y="103">${escapeXml(mask.reading)}</text>
  </svg>`);
}

async function makeReviewBoard() {
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

  const headerSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${header}">
    <style>
      .eyebrow { font: 600 17px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #b8894e; letter-spacing: 5px; }
      .title { font: 500 58px Georgia, serif; fill: #f0e8db; letter-spacing: -1px; }
      .sub { font: 400 21px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #8f8b84; letter-spacing: .4px; }
    </style>
    <text class="eyebrow" x="60" y="62">9TAKES  /  EXPRESSION SYSTEM  /  STUDY 01</text>
    <text class="title" x="60" y="128">One mask. Nine inner tensions.</text>
    <text class="sub" x="60" y="174">Passion in the expression; virtue in the restraint. Ordered by body, heart, and head centers.</text>
    <line x1="60" y1="206" x2="1740" y2="206" stroke="#292a2b" stroke-width="2"/>
  </svg>`);
  layers.push({ input: headerSvg, left: 0, top: 0 });

  for (const [index, mask] of masks.entries()) {
    const column = index % 3;
    const row = Math.floor(index / 3);
    const left = margin + column * (panelWidth + gap);
    const top = header + row * (panelHeight + gap);
    const image = await sharp(path.join(directory, mask.file))
      .resize(imageSize, imageSize, { fit: 'cover' })
      .png()
      .toBuffer();

    layers.push({ input: panelSvg(panelWidth, panelHeight), left, top });
    layers.push({ input: image, left: left + 20, top: top + 20 });
    layers.push({ input: labelSvg(mask, imageSize, 110), left: left + 20, top: top + 518 });
  }

  const footerSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${footer}">
    <style>.f { font: 500 15px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #5f5d59; letter-spacing: 2.4px; }</style>
    <text class="f" x="60" y="45">TRIAD ORDER  8 9 1  /  2 3 4  /  5 6 7</text>
    <text class="f" text-anchor="end" x="1740" y="45">NEUTRAL MASTER + NINE CONTROLLED DERIVATIONS</text>
  </svg>`);
  layers.push({ input: footerSvg, left: 0, top: height - footer });

  await sharp({
    create: { width, height, channels: 3, background: '#0d0e0f' },
  })
    .composite(layers)
    .png({ compressionLevel: 9 })
    .toFile(path.join(directory, '9takes-nine-mask-expression-review-board-v5.png'));
}

async function makePrideDeceitCollisionTest() {
  const width = 1240;
  const height = 820;
  const imageSize = 520;
  const top = 185;
  const leftPositions = [80, 640];
  const pair = [
    {
      type: 2,
      passion: 'PRIDE',
      reading: 'WARMTH REACHES THE EYES',
      file: '02-type-2-pride.png',
    },
    {
      type: 3,
      passion: 'DECEIT',
      reading: 'THE MOUTH PERFORMS ALONE',
      file: '03-type-3-deceit.png',
    },
  ];
  const layers = [
    {
      input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <style>
          .eyebrow { font: 600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #b8894e; letter-spacing: 4px; }
          .title { font: 500 48px Georgia, serif; fill: #f0e8db; }
          .sub { font: 400 20px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #8f8b84; }
        </style>
        <text class="eyebrow" x="80" y="52">COLLISION TEST  /  REVISED</text>
        <text class="title" x="80" y="108">Warmth versus performance</text>
        <text class="sub" x="80" y="148">The distinction now lives in the cheeks and lower eye contours—not merely the smile.</text>
        <line x1="80" y1="170" x2="1160" y2="170" stroke="#292a2b" stroke-width="2"/>
      </svg>`),
      left: 0,
      top: 0,
    },
  ];

  for (const [index, mask] of pair.entries()) {
    const image = await sharp(path.join(directory, mask.file))
      .resize(imageSize, imageSize, { fit: 'cover' })
      .png()
      .toBuffer();
    const left = leftPositions[index];
    layers.push({ input: panelSvg(imageSize, 630), left, top });
    layers.push({ input: image, left, top });
    layers.push({ input: labelSvg(mask, imageSize - 20, 110), left: left + 10, top: top + 515 });
  }

  await sharp({
    create: { width, height, channels: 3, background: '#0d0e0f' },
  })
    .composite(layers)
    .png({ compressionLevel: 9 })
    .toFile(path.join(directory, '9takes-pride-deceit-collision-test-v2.png'));
}

await makeMosaic();
await makeReviewBoard();
await makePrideDeceitCollisionTest();
