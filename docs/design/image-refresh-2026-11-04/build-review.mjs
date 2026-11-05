// docs/design/image-refresh-2026-11-04/build-review.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dir, '../../..');
const read = (name) => JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'));
const inventory = read('inventory.json');
const assessments = read('assessments.json');
const replacements = read('prompts.json').replacements;
const explicit = new Map(assessments.reviews.map((row) => [row.id, row]));
const tiers = {
	T1: 'Recreate',
	T2: 'Refine or reframe',
	T3: 'Retain',
	E: 'Separate editorial system'
};

for (const row of inventory.images) {
	const exception =
		/composite$|^enneagram-type-[1-9]-dossier$/.test(row.pic) ||
		['Ghislaine-Maxwell', 'Jeffrey-Epstein'].includes(row.pic);
	const assessment = explicit.get(row.id) || {
		tier: exception ? 'E' : 'T3',
		reason: exception
			? 'Identifiable public-figure image or intentional type dossier. Preserve its editorial function; review that visual system separately.'
			: 'Restrained stone treatment and readable subject are sufficiently close to the references to retain during this first pass.',
		concept: exception
			? 'Keep the identity or information-bearing format. A generic statue would remove useful editorial information.'
			: 'Keep the existing scene. Recheck article fit and full-resolution detail when the post is next edited.'
	};
	const replacement = replacements.find((item) => item.original === row.pic);
	Object.assign(row, assessment, {
		reviewBasis: replacement
			? 'Full-size image and article body'
			: 'Contact-sheet visual triage; title and description for proposed scene',
		status: replacement
			? 'Replaced locally'
			: assessment.tier === 'T1' || assessment.tier === 'T2'
				? 'Queued'
				: 'Retained',
		currentPic: replacement?.deliverySlug || row.pic,
		currentAsset: `static/blogs/${replacement?.deliverySlug || row.pic}.webp`,
		currentThumbnail: `static/blogs/s-${replacement?.deliverySlug || row.pic}.webp`,
		...(replacement
			? { asset: replacement.archivedOriginal, thumbnail: replacement.archivedThumbnail }
			: {}),
		...(replacement ? { replacement } : {})
	});
}

inventory.method = assessments.method;
inventory.tiers = tiers;
inventory.counts = Object.fromEntries(
	Object.keys(tiers).map((tier) => [tier, inventory.images.filter((r) => r.tier === tier).length])
);
inventory.replacedLocally = inventory.images.filter((r) => r.status === 'Replaced locally').length;
fs.writeFileSync(path.join(dir, 'inventory.json'), JSON.stringify(inventory, null, 2) + '\n');

function walk(folder) {
	return fs.readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
		const file = path.join(folder, entry.name);
		return entry.isDirectory() ? walk(file) : [file];
	});
}
const sourceFiles = walk(path.join(root, 'src')).filter((file) =>
	/\.(md|svelte|ts|js|json|scss)$/.test(file)
);
const sources = sourceFiles.map((file) => {
	const text = fs.readFileSync(file, 'utf8');
	let frontmatter = {};
	if (file.endsWith('.md')) {
		try {
			frontmatter = matter(text).data;
		} catch {
			/* Invalid frontmatter is still searchable text. */
		}
	}
	return { file: path.relative(root, file), text, frontmatter };
});
const allAssets = walk(path.join(root, 'static/blogs')).filter((file) =>
	/\.(webp|png|jpe?g|avif|gif)$/i.test(file)
);
const assets = allAssets.map((file) => {
	const name = path.basename(file);
	const stem = name.replace(/^s-/, '').replace(/\.[^.]+$/, '');
	const literalUrl = `/blogs/${name}`;
	const uses = sources.filter(
		(source) => source.frontmatter.pic === stem || source.text.includes(literalUrl)
	);
	const activeHero = inventory.images.find((row) => row.currentPic === stem);
	const previous = replacements.find((row) => row.original === stem);
	const status = activeHero
		? 'Published hero family'
		: previous
			? 'Superseded in this refresh'
			: uses.some((source) => source.frontmatter.published === true)
				? 'Published literal use outside audited hero set'
				: uses.some((source) => source.file.startsWith('src/blog/'))
					? 'Draft or other blog reference'
					: uses.length
						? 'Application source reference'
						: 'No literal reference found; dynamic use not ruled out';
	return {
		file: path.relative(root, file),
		stem,
		bytes: fs.statSync(file).size,
		status,
		visualReview: activeHero
			? 'Hero family triaged; originals and alternates not individually approved'
			: previous
				? 'Reviewed before replacement'
				: 'Not visually triaged',
		references: uses.map(({ file }) => file)
	};
});
const assetIndex = {
	date: inventory.date,
	scope:
		'Files in static/blogs after this refresh. Exact frontmatter and URL references only; absence does not prove a file is unused. Superseded artwork is archived outside static/.',
	fileCount: assets.length,
	counts: Object.fromEntries(
		[...new Set(assets.map((a) => a.status))].map((status) => [
			status,
			assets.filter((a) => a.status === status).length
		])
	),
	assets
};
fs.writeFileSync(path.join(dir, 'asset-usage.json'), JSON.stringify(assetIndex, null, 2) + '\n');

const escape = (value) =>
	String(value ?? '').replace(
		/[&<>"']/g,
		(c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
	);
const local = (file) => '../../../' + file.split('/').map(encodeURIComponent).join('/');
const image = (file, alt, eager = false) =>
	`<a href="${local(file)}"><img src="${local(file)}" alt="${escape(alt)}" loading="${eager ? 'eager' : 'lazy'}"></a>`;
const comparison = (item) => {
	const row = inventory.images.find((r) => r.pic === item.original);
	return `<section class="comparison" id="${escape(item.original)}"><h3>${escape(row.posts[0].title)}</h3><p class="filename">${escape(item.original)}</p>${item.note ? `<p><strong>Your note:</strong> ${escape(item.note)}</p>` : ''}<div class="pair"><figure>${image(item.previousAsset || row.asset, 'Previous image for ' + row.posts[0].title, true)}<figcaption>Before</figcaption></figure><figure>${image(row.currentAsset, item.alt, true)}<figcaption>New · ${escape(item.slug)}</figcaption></figure></div><p>${escape(row.concept)}</p></section>`;
};
const latestBatch = Math.max(...replacements.map((item) => item.batch || 1));
const latest = replacements.filter((item) => (item.batch || 1) === latestBatch);
const previous = replacements.filter((item) => (item.batch || 1) < latestBatch);
const beforeAfter = latest.map(comparison).join('\n');
const earlierComparisons = previous.length
	? `<details><summary>Earlier replacements · ${previous.length} images</summary>${previous.map(comparison).join('\n')}</details>`
	: '';

const rows = [...inventory.images].sort((a, b) => {
	const order = { T1: 1, T2: 2, T3: 3, E: 4 };
	return (
		order[a.tier] - order[b.tier] ||
		Number(Boolean(b.replacement)) - Number(Boolean(a.replacement)) ||
		a.id - b.id
	);
});
const cards = rows
	.map(
		(
			row
		) => `<article class="asset" data-tier="${row.tier}" data-search="${escape([row.pic, row.currentPic, ...row.posts.map((p) => p.title), row.reason, row.concept].join(' ').toLowerCase())}">
<div class="preview">${image(row.currentAsset, row.replacement?.alt || 'Current image: ' + row.pic)}</div>
<div class="asset-body"><p class="meta">${row.tier} · ${tiers[row.tier]} <span>${escape(row.status)}</span></p>
<h3>${row.posts.map((post) => `<a href="${escape(post.url)}">${escape(post.title)}</a>`).join('<br>')}</h3>
<p class="filename">${escape(row.pic)}</p><p><strong>Assessment:</strong> ${escape(row.reason)}</p>
<p><strong>${row.replacement ? 'New scene' : row.tier === 'T1' || row.tier === 'T2' ? 'Proposed scene' : 'Next action'}:</strong> ${escape(row.concept)}</p>
${row.replacement ? `<p><a href="${local(row.currentAsset)}">View replacement</a> · <a href="${local(row.posts[0].file)}">Article source</a></p>` : ''}
</div></article>`
	)
	.join('\n');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>9takes blog image review</title>
<style>
:root{color-scheme:dark;--bg:#171716;--panel:#222220;--text:#eeeae1;--muted:#c1bbae;--line:#4c4942;--accent:#e4bc78}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:16px/1.55 system-ui,sans-serif}main{max-width:1320px;margin:auto;padding:40px 24px 80px}h1{font-size:34px;line-height:1.2;margin:0 0 16px}h2{font-size:26px;margin:42px 0 16px}h3{font-size:18px;line-height:1.4;margin:0 0 12px}p{margin:0 0 12px}a{color:var(--accent);text-underline-offset:3px}a:focus-visible,button:focus-visible,input:focus-visible{outline:3px solid var(--accent);outline-offset:4px}.intro{max-width:880px}.muted,.filename,figcaption{color:var(--muted)}.filename{font:13px/1.4 ui-monospace,monospace;overflow-wrap:anywhere}.summary{display:flex;gap:12px;flex-wrap:wrap;margin:24px 0}.summary span{padding:10px 14px;border:1px solid var(--line);border-radius:6px}.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px}figure{margin:0}figure img{display:block;width:100%;aspect-ratio:3/2;object-fit:contain;background:#10100f}figcaption{margin-top:6px;font-size:14px;overflow-wrap:anywhere}.comparison{padding:20px 0;border-bottom:1px solid var(--line)}.comparison>p{margin-top:14px;max-width:850px}.controls{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:20px 0}button,input{font:inherit;border:1px solid var(--line);border-radius:5px;padding:10px 14px;background:var(--panel);color:var(--text)}button{cursor:pointer}button[aria-pressed=true]{background:var(--accent);color:#201b12}input{min-width:0;max-width:100%;width:300px}label{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,330px),1fr));gap:20px}.asset{background:var(--panel);border:1px solid var(--line);border-radius:7px;overflow:hidden}.asset[hidden]{display:none}.preview{background:#10100f}.preview img{display:block;width:100%;height:225px;object-fit:contain}.asset-body{padding:18px}.asset p{font-size:14px}.meta{color:var(--accent)}.meta span{display:block;color:var(--muted)}.links{display:flex;flex-wrap:wrap;gap:16px}.references{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.references img{width:100%;aspect-ratio:1;object-fit:contain;background:#10100f}.notes{max-width:900px}li{margin-bottom:8px}hr{border:0;border-top:1px solid var(--line);margin:30px 0}@media(max-width:640px){main{padding:24px 16px 50px}h1{font-size:28px}.pair{grid-template-columns:1fr}.references{grid-template-columns:1fr}button{min-height:44px}}
</style></head><body><main>
<header class="intro"><p class="muted">9takes · Image review · Updated November 5, 2026</p><h1>Weathered statues, recognizable situations</h1><p>157 distinct hero images across 159 published non-profile posts. ${inventory.replacedLocally} replacements are connected locally. Your latest ${latest.length} revisions appear first; the other proposed changes remain queued.</p><p class="muted">Visual triage uses the original contact sheets. Replacements use article bodies and your feedback; other proposed scenes use titles and descriptions and need a body check before generation. Production is not deployed.</p></header>
<div class="summary">${Object.entries(inventory.counts)
	.map(([tier, count]) => `<span><strong>${count}</strong> · ${tier} ${tiers[tier]}</span>`)
	.join('')}<span><strong>${inventory.replacedLocally}</strong> replaced locally</span></div>
<nav class="links" aria-label="Review documents"><a href="README.md">Style and scene guide</a><a href="prompts.json">Exact generation prompts</a><a href="inventory.json">Hero inventory</a><a href="asset-usage.json">All blog asset usage</a></nav>
<h2>Style references</h2><div class="references">${['static/greek_distorted_statue_face.webp', 'static/blogs/greek-statue-reading-a-book.webp', 'static/blogs/greek-statue-reading.webp'].map((file) => `<figure>${image(file, path.basename(file), true)}<figcaption>${escape(path.basename(file))}</figcaption></figure>`).join('')}</div>
<h2 id="replacements">Latest revisions · ${latest.length} images</h2>${beforeAfter}${earlierComparisons}
<h2>Ranked inventory</h2><p class="notes">T1: recreate major mismatches. T2: preserve a useful idea and refine its treatment or framing. T3: retain for now. E: identifiable people and type dossiers serve a different editorial purpose. Cards show the current artwork. Tiers describe the originally audited image.</p>
<div class="controls" role="group" aria-label="Filter by tier"><button type="button" data-filter="all" aria-pressed="true">All</button>${Object.entries(
	tiers
)
	.map(
		([key, label]) =>
			`<button type="button" data-filter="${key}" aria-pressed="false">${key} · ${label}</button>`
	)
	.join(
		''
	)}<label>Find image or post <input type="search" id="search" placeholder="Title, filename or scene"></label></div>
<p id="result-count" class="muted" aria-live="polite">157 images</p><div class="grid">${cards}</div>
<hr><div class="notes"><p><strong>One missing hero:</strong> ${escape(inventory.noPic.join(', '))}. Choose whether this post needs an editorial cast image before assigning a statue scene.</p><p><strong>Outside the hero review:</strong> ${assetIndex.fileCount} blog image files are indexed by traceable usage. This includes full images, thumbnails and source variants; it is not a count of unique scenes. Untraced and draft images have not been visually graded. All original artwork is preserved.</p><p>Lossless masters: source-assets/blogs/. Delivery: static/blogs/. Round-three articles use fresh image URLs; Vercel redirects the old links. Built-in image generator; full prompts preserved. Previous artwork is archived in this review’s originals/ and previous/ directories, outside the public deployment.</p></div>
</main><script>
const cards = [...document.querySelectorAll('.asset')];
const buttons = [...document.querySelectorAll('[data-filter]')];
const input = document.getElementById('search');
let tier = 'all';
function filter(){let count=0;const query=input.value.trim().toLowerCase();for(const card of cards){const visible=(tier==='all'||card.dataset.tier===tier)&&card.dataset.search.includes(query);card.hidden=!visible;if(visible)count++;}document.getElementById('result-count').textContent=count+' image'+(count===1?'':'s');}
for(const button of buttons)button.addEventListener('click',()=>{tier=button.dataset.filter;for(const other of buttons)other.setAttribute('aria-pressed',String(other===button));filter();});
input.addEventListener('input',filter);
</script></body></html>`;
fs.writeFileSync(path.join(dir, 'review.html'), html);
console.log(
	JSON.stringify(
		{
			counts: inventory.counts,
			replaced: inventory.replacedLocally,
			assetFiles: assetIndex.fileCount,
			assetUsage: assetIndex.counts
		},
		null,
		2
	)
);
