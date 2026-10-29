import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createServer } from 'node:http';
import assert from 'node:assert/strict';
import { compile } from 'svelte/compiler';
import { render } from 'svelte/server';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../../..');
const handoff = path.join(here, 'handoff');
const output = path.join(repo, 'output/playwright/9takes-portfolio');
const layers = JSON.parse(await fs.readFile(path.join(handoff, 'layers.json'), 'utf8'));
const code = await fs.readFile(path.join(handoff, 'ProjectVisual.svelte'), 'utf8');
const assets = await fs.readdir(path.join(handoff, 'assets'));
const required = [
	'id',
	'title',
	'caption',
	'kind',
	'eyebrow',
	'headline',
	'insight',
	'steps',
	'branches',
	'evidence'
];
const kinds = ['site', 'flow', 'shop', 'operations', 'app', 'brand', 'community', 'content'];
assert(layers.length >= 3 && layers.length <= 7);
assert.equal(layers[0].kind, 'site');
assert.equal(new Set(layers.map((l) => l.id)).size, layers.length);
for (const layer of layers) {
	for (const key of required) assert(key in layer, `${layer.id}: missing ${key}`);
	assert(kinds.includes(layer.kind));
	assert(layer.branches.length >= 2 && layer.branches.length <= 4);
	assert(code.includes(`layerId === '${layer.id}'`), `Missing visual for ${layer.id}`);
	for (const evidence of layer.evidence) await fs.access(path.join(repo, evidence.split(': ')[0]));
	for (const item of layer.gallery ?? []) {
		assert(item.alt && item.caption);
		assert(item.src.startsWith('/assets/work/projects/9takes/'));
		assert(assets.includes(path.basename(item.src)), `Missing ${item.src}`);
	}
}
const assetReferences = [
	...code.matchAll(/(?:\$\{base\}|file: ')([\w.-]+\.(?:webp|jpg|png))/g)
].map((match) => match[1]);
for (const name of assetReferences)
	assert(assets.includes(name), `Missing component asset: ${name}`);
assert(!code.includes('$lib'));
assert(!/\bfetch\s*\(/.test(code));
assert(!/<(?:button|input|textarea|select|a)\b/.test(code), 'Artwork must not contain controls');
assert(code.includes('prefers-reduced-motion'));
let bytes = 0;
for (const asset of assets) bytes += (await fs.stat(path.join(handoff, 'assets', asset))).size;

await fs.mkdir(output, { recursive: true });
const server = compile(code, { filename: 'ProjectVisual.svelte', generate: 'server' });
const client = compile(code, { filename: 'ProjectVisual.svelte', generate: 'client' });
assert.equal(server.warnings.length, 0, JSON.stringify(server.warnings));
assert.equal(client.warnings.length, 0, JSON.stringify(client.warnings));
const compiled = path.join(output, 'ProjectVisual.server.mjs');
await fs.writeFile(compiled, server.js.code);
const { default: Component } = await import(`${pathToFileURL(compiled)}?t=${Date.now()}`);
let rendered = 0;
for (const layer of layers)
	for (const compact of [false, true])
		for (const animated of [false, true]) {
			const result = render(Component, { props: { layerId: layer.id, compact, animated } });
			assert(result.body.includes(`data-layer="${layer.id}"`));
			rendered++;
		}
const report = {
	layers: layers.length,
	assets: assets.length,
	assetBytes: bytes,
	renderVariants: rendered,
	svelteVersion: '5.57.1',
	serverWarnings: server.warnings.length,
	clientWarnings: client.warnings.length
};
await fs.writeFile(path.join(output, 'validation.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));

if (process.argv.includes('--serve')) {
	const css = server.css?.code ?? '';
	const sample = (id, width, compact, animated) =>
		`<div class="sample"><p>${width}px · ${compact ? 'compact' : 'open'} · ${animated ? 'motion enabled' : 'static'}</p><div style="width:${width}px;aspect-ratio:16/10">${render(Component, { props: { layerId: id, compact, animated } }).body}</div></div>`;
	createServer(async (request, response) => {
		const url = new URL(request.url ?? '/', 'http://127.0.0.1');
		if (url.pathname.startsWith('/assets/work/projects/9takes/')) {
			const name = path.basename(url.pathname);
			if (!assets.includes(name)) {
				response.writeHead(404).end();
				return;
			}
			response.setHeader('Content-Type', name.endsWith('.jpg') ? 'image/jpeg' : 'image/webp');
			response.end(await fs.readFile(path.join(handoff, 'assets', name)));
			return;
		}
		const id = layers.find((l) => l.id === url.searchParams.get('layer'))?.id ?? 'brand';
		response.setHeader('Content-Type', 'text/html; charset=utf-8');
		response.end(
			`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>9takes portfolio proof — ${id}</title><style>body{margin:0;padding:24px;background:#d5d0c7;color:#241d17;font:14px system-ui}nav{display:flex;gap:18px;margin-bottom:24px}a{color:inherit}.samples{display:flex;gap:30px;align-items:flex-start}.column{display:grid;gap:20px}.sample>p{font:12px ui-monospace;margin:0 0 10px}.sample>div{box-shadow:0 8px 30px #0002}${css}</style></head><body><nav>${layers.map((l) => `<a href="?layer=${l.id}">${l.title}</a>`).join('')}</nav><div class="samples">${sample(id, 600, false, true)}<div class="column">${sample(id, 300, true, true)}${sample(id, 150, true, false)}</div></div></body></html>`
		);
	}).listen(4179, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:4179/?layer=brand'));
}
