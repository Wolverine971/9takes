// scripts/gen-blog-image-openrouter.mjs
// Generate a blog hero image via OpenRouter (Google Gemini "Nano Banana" image model)
// and produce the 9takes blog image variant set: source-assets/blogs/{slug}.png (master),
// static/blogs/{slug}.webp (full), and static/blogs/s-{slug}.webp (thumbnail).
//
// Usage:
//   node scripts/gen-blog-image-openrouter.mjs <slug> [model]
//   echo "$PROMPT" | node scripts/gen-blog-image-openrouter.mjs <slug> [model]   (prompt via stdin)
//
// Reads PRIVATE_OPENROUTER_API_KEY from .env.local / .env.

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, 'source-assets', 'blogs');
const DELIVERY_DIR = path.join(ROOT, 'static', 'blogs');

function loadKey() {
	for (const file of ['.env.local', '.env']) {
		const p = path.join(ROOT, file);
		if (!fs.existsSync(p)) continue;
		const txt = fs.readFileSync(p, 'utf8');
		const m = txt.match(/^\s*PRIVATE_OPENROUTER_API_KEY\s*=\s*["']?([^"'\n]+)["']?/m);
		if (m) return m[1].trim();
	}
	throw new Error('PRIVATE_OPENROUTER_API_KEY not found in .env.local or .env');
}

const slug = process.argv[2];
const model = process.argv[3] || 'google/gemini-2.5-flash-image';
if (!slug) {
	console.error('Usage: node scripts/gen-blog-image-openrouter.mjs <slug> [model]');
	process.exit(1);
}

const stdinPrompt = !process.stdin.isTTY ? fs.readFileSync(0, 'utf8').trim() : '';
const prompt =
	stdinPrompt ||
	`A cinematic, square (1:1) editorial illustration in the style of classical Greek marble statues.
Two marble statues face each other across a small table. The statue on the left is calm and perfectly still, one open palm raised in a quiet "stop" gesture, composed and grounded. The statue on the right leans forward mid-gesture, agitated, mouth open as if arguing. Thin cracks of warm amber light glow from inside the calm statue's marble, radiating quiet authority. Dramatic chiaroscuro lighting, deep charcoal background, mostly black, white, and grey marble tones with a single warm amber accent as the only color. Moody, sophisticated, no text, no watermark. Negative space at top for clean composition.`;

console.log(`[gen] model=${model} slug=${slug}`);
console.log(`[gen] prompt: ${prompt.slice(0, 120)}...`);

const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
	method: 'POST',
	headers: {
		Authorization: `Bearer ${loadKey()}`,
		'Content-Type': 'application/json',
		'HTTP-Referer': 'https://9takes.com',
		'X-Title': '9takes blog image gen'
	},
	body: JSON.stringify({
		model,
		messages: [{ role: 'user', content: prompt }],
		modalities: ['image', 'text']
	})
});

if (!res.ok) {
	console.error(`[gen] HTTP ${res.status}: ${await res.text()}`);
	process.exit(1);
}

const data = await res.json();
const msg = data?.choices?.[0]?.message;
const images = msg?.images || [];
if (!images.length) {
	console.error('[gen] No images in response. Full message:');
	console.error(JSON.stringify(msg, null, 2)?.slice(0, 2000));
	process.exit(1);
}

const url = images[0]?.image_url?.url || images[0]?.url;
if (!url || !url.startsWith('data:')) {
	console.error('[gen] Unexpected image payload:', JSON.stringify(images[0])?.slice(0, 500));
	process.exit(1);
}

const b64 = url.split(',')[1];
const buf = Buffer.from(b64, 'base64');
fs.mkdirSync(SOURCE_DIR, { recursive: true });
fs.mkdirSync(DELIVERY_DIR, { recursive: true });

// Preserve the lossless source outside SvelteKit's public static tree. Only delivery derivatives
// belong in static/ so deploys do not copy hundreds of megabytes of source artwork.
const pngPath = path.join(SOURCE_DIR, `${slug}.png`);
fs.writeFileSync(pngPath, buf);

// Full webp (cap longest edge at 1200, high quality) and small thumbnail (480px).
const meta = await sharp(buf).metadata();
await sharp(buf)
	.resize({ width: Math.min(meta.width || 1200, 1200), withoutEnlargement: true })
	.webp({ quality: 82 })
	.toFile(path.join(DELIVERY_DIR, `${slug}.webp`));
await sharp(buf)
	.resize({ width: 480, withoutEnlargement: true })
	.webp({ quality: 72 })
	.toFile(path.join(DELIVERY_DIR, `s-${slug}.webp`));

const sizes = ['png', 'webp'].map((e) => {
	const f = e === 'png' ? pngPath : path.join(DELIVERY_DIR, `${slug}.${e}`);
	return `${slug}.${e} ${(fs.statSync(f).size / 1024).toFixed(0)}KB`;
});
const sThumb = path.join(DELIVERY_DIR, `s-${slug}.webp`);
sizes.push(`s-${slug}.webp ${(fs.statSync(sThumb).size / 1024).toFixed(0)}KB`);
console.log(`[gen] source ${meta.width}x${meta.height}`);
console.log(`[gen] wrote: ${sizes.join(' | ')}`);
