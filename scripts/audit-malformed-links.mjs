// scripts/audit-malformed-links.mjs
//
// Finds links that point at 9takes.com but were never meant to: external URLs
// that lost their domain, markdown-link artifacts with a trailing ")", and
// leftover uppercase person slugs. Each one becomes a 404 in Search Console and
// burns crawl budget on a URL that can never exist.
//
// Sources this catches that a repo grep cannot: published people pages render
// from the `blogs_famous_people` table, so their body copy never appears in the
// markdown files on disk.
//
// Usage:
//   node scripts/audit-malformed-links.mjs                 # crawl the sitemap
//   node scripts/audit-malformed-links.mjs --limit 50      # sample
//   node scripts/audit-malformed-links.mjs --base http://localhost:5173

const DEFAULT_BASE = 'https://9takes.com';
const CONCURRENCY = 10;

/**
 * An href is suspect when it resolves onto our own domain but carries the shape
 * of somewhere else. Exported so the rules are unit-testable.
 */
export function findMalformedHrefs(html) {
	const found = [];
	const hrefPattern = /href="([^"]+)"/g;
	let match;

	while ((match = hrefPattern.exec(html))) {
		const href = match[1];
		const isInternal = href.startsWith('/') || href.startsWith('https://9takes.com/');
		if (!isInternal) continue;
		const path = href.replace('https://9takes.com', '');

		// A markdown link whose URL contained "(" closes early and leaves ")".
		if (path.includes(')')) found.push({ href, reason: 'trailing-paren' });
		// External video/wiki/article paths that lost their domain.
		else if (/^\/(watch\?|wiki\/|episodes\/|embed\/|status\/)/.test(path))
			found.push({ href, reason: 'domain-stripped' });
		else if (/\.(html|htm|php)$/.test(path)) found.push({ href, reason: 'foreign-extension' });
		// Uppercase person slugs 308 to lowercase — a wasted hop, not an error.
		else if (/^\/personality-analysis\/[^/]*[A-Z]/.test(path))
			found.push({ href, reason: 'uppercase-slug' });
	}

	return found;
}

async function sitemapUrls(base) {
	const response = await fetch(`${base}/sitemap.xml`);
	const xml = await response.text();
	return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function main() {
	const argv = process.argv.slice(2);
	const base = argv.includes('--base') ? argv[argv.indexOf('--base') + 1] : DEFAULT_BASE;
	const limit = argv.includes('--limit') ? Number(argv[argv.indexOf('--limit') + 1]) : Infinity;

	const urls = (await sitemapUrls(base)).slice(0, limit);
	console.log(`Scanning ${urls.length} URLs from ${base}/sitemap.xml\n`);

	const queue = [...urls];
	const hits = [];
	let scanned = 0;
	let failed = 0;

	async function worker() {
		while (queue.length) {
			const url = queue.shift();
			if (!url) return;
			try {
				const response = await fetch(url, { headers: { 'user-agent': '9takes-link-audit' } });
				const html = await response.text();
				const malformed = findMalformedHrefs(html);
				if (malformed.length) hits.push({ url, malformed });
			} catch {
				failed += 1;
			}
			scanned += 1;
			if (scanned % 100 === 0) console.log(`  …${scanned}/${urls.length}`);
		}
	}

	await Promise.all(Array.from({ length: CONCURRENCY }, worker));

	const byReason = new Map();
	for (const hit of hits) {
		for (const { href, reason } of hit.malformed) {
			if (!byReason.has(reason)) byReason.set(reason, new Map());
			const hrefs = byReason.get(reason);
			if (!hrefs.has(href)) hrefs.set(href, []);
			hrefs.get(href).push(hit.url);
		}
	}

	console.log(
		`\nScanned ${scanned} pages (${failed} failed). Pages with problems: ${hits.length}\n`
	);
	for (const [reason, hrefs] of byReason) {
		console.log(`## ${reason} — ${hrefs.size} distinct hrefs`);
		for (const [href, pages] of hrefs) {
			console.log(`  ${href}`);
			for (const page of pages.slice(0, 5)) console.log(`      on ${page}`);
			if (pages.length > 5) console.log(`      …and ${pages.length - 5} more`);
		}
		console.log('');
	}

	if (!hits.length) console.log('No malformed internal links found.');
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
