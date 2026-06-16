// scripts/gen-oneoff-image.mjs
// One-off creative image via OpenRouter (Google Gemini "Nano Banana").
// Outputs a PNG to the given absolute path. Prompt via stdin.
//
// Usage:
//   echo "$PROMPT" | node scripts/gen-oneoff-image.mjs /abs/out.png [model]

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

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

const outPath = process.argv[2];
const model = process.argv[3] || 'google/gemini-2.5-flash-image';
if (!outPath) {
	console.error('Usage: echo "$PROMPT" | node scripts/gen-oneoff-image.mjs /abs/out.png [model]');
	process.exit(1);
}

const prompt = fs.readFileSync(0, 'utf8').trim();
if (!prompt) {
	console.error('No prompt on stdin.');
	process.exit(1);
}

console.log(`[gen] model=${model}`);
console.log(`[gen] out=${outPath}`);
console.log(`[gen] prompt: ${prompt.slice(0, 140)}...`);

const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
	method: 'POST',
	headers: {
		Authorization: `Bearer ${loadKey()}`,
		'Content-Type': 'application/json',
		'HTTP-Referer': 'https://9takes.com',
		'X-Title': '9takes oneoff image gen'
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

const buf = Buffer.from(url.split(',')[1], 'base64');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, buf);
console.log(`[gen] wrote ${outPath} (${(buf.length / 1024).toFixed(0)}KB)`);
