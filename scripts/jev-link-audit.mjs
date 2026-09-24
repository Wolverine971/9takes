// scripts/jev-link-audit.mjs

/**
 * Jev-judged internal-link audit. See scripts/lib/jevLinkAudit.js for the method.
 *
 *   pnpm audit:links:jev -- --estimate    plan + token/cost estimate, no API calls
 *   pnpm audit:links:jev -- --calibrate   score Jev against the 2026-09-22 pass's
 *                                         accepted links and rejected matches (skipped.json)
 *   pnpm audit:links:jev                  full audit → docs/crosslinks/jev-audit.{md,json}
 *
 * Options: --source <url> (one source post), --limit <n> (first n sources), --no-cache.
 * Needs PRIVATE_OPENROUTER_API_KEY (Jev runs through OpenRouter's Decisions API) and the
 * public Supabase URL/key (reads live questions). Responses cache in tmp/jev-cache/.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {
	REPO_ROOT,
	buildLinkGraph,
	extractInternalLinks,
	loadBlogCorpus,
	loadGsc,
	loadPeople,
	normalizeInternalHref
} from './lib/blogLinkGraph.js';
import { createDocFrequency } from './lib/crosslinkOpportunities.js';
import {
	JEV_PRICE_PER_TOKEN,
	chunkQuestions,
	createJevClient,
	estimateTokens,
	readOpenRouterKey
} from './lib/jevClient.js';
import {
	DEFAULT_CONFIG,
	alreadyLinks,
	anchorChoiceQuestion,
	anchorParagraphs,
	bridgeChoiceQuestion,
	applyCaps,
	competition,
	destinationCard,
	linkQuestion,
	linkStrength,
	paragraphState,
	paragraphsOf,
	phrasesFor,
	readableText,
	selectDestinations,
	tierFor
} from './lib/jevLinkAudit.js';

const CROSSLINK_DIR = path.join(REPO_ROOT, 'docs/crosslinks');
const CACHE_DIR = path.join(REPO_ROOT, 'tmp/jev-cache');
// Commit before the 2026-09-22 link pass; its diff to HEAD is the calibration set.
const CALIBRATION_BASE = '48f80036a';

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => {
	const i = args.indexOf(name);
	return i !== -1 ? args[i + 1] : null;
};

const readJson = (file, fallback) =>
	fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : fallback;

function loadConfig() {
	const custom = readJson(path.join(CROSSLINK_DIR, 'jev-config.json'), {});
	return {
		...DEFAULT_CONFIG,
		...custom,
		blog: { ...DEFAULT_CONFIG.blog, ...custom.blog },
		people: { ...DEFAULT_CONFIG.people, ...custom.people },
		thresholds: { ...DEFAULT_CONFIG.thresholds, ...custom.thresholds },
		twins: { ...DEFAULT_CONFIG.twins, ...custom.twins },
		caps: { ...DEFAULT_CONFIG.caps, ...custom.caps }
	};
}

function readEnv(name) {
	if (process.env[name]) return process.env[name];
	for (const file of ['.env.local', '.env']) {
		const full = path.join(REPO_ROOT, file);
		if (!fs.existsSync(full)) continue;
		const match = fs.readFileSync(full, 'utf8').match(new RegExp(`^${name}=(.*)$`, 'm'));
		if (match) return match[1].trim().replace(/^["']|["']$/g, '');
	}
	return null;
}

/** Live questions only: the [slug] loader 404s removed or flagged rows. */
async function loadLiveQuestions() {
	const url = readEnv('PUBLIC_SUPABASE_URL');
	const key = readEnv('PUBLIC_SUPABASE_PUBLISHABLE_KEY');
	if (!url || !key) {
		console.warn('No public Supabase URL/key: skipping question destinations.');
		return [];
	}
	const response = await fetch(
		`${url}/rest/v1/questions?select=id,url,question,question_formatted,comment_count&removed=not.is.true&flagged=not.is.true&url=not.is.null`,
		{ headers: { apikey: key, Authorization: `Bearer ${key}` } }
	);
	if (!response.ok) throw new Error(`questions fetch failed: ${response.status}`);
	return response.json();
}

function loadInputs() {
	const posts = loadBlogCorpus();
	const people = loadPeople();
	const graph = buildLinkGraph({ posts, people });
	for (const node of graph.values()) {
		const draft = node.kind === 'person' ? people.get(node.url)?.draftFile : null;
		if (!draft) continue;
		try {
			node.description = matter(
				fs.readFileSync(path.join(REPO_ROOT, draft), 'utf8')
			).data.description;
		} catch {
			/* malformed draft frontmatter: card falls back to the name */
		}
	}
	const gsc = loadGsc();
	const curated = readJson(path.join(CROSSLINK_DIR, 'target-phrases.json'), {});
	delete curated._about;
	const docFrequency = createDocFrequency(posts.filter((p) => p.live));
	const sources = [...graph.values()].filter((n) => n.kind === 'blog');
	// Pairs a human (or the /crosslink-queue agent) already rejected stay rejected.
	const skipped = new Set(
		readJson(path.join(CROSSLINK_DIR, 'skipped.json'), { skipped: [] }).skipped.map((e) => e.id)
	);
	return { posts, people, graph, gsc, curated, docFrequency, sources, skipped };
}

const candidateTargets = (ctx, source, dests) =>
	dests.filter(
		(d) =>
			d.url !== source.url &&
			!alreadyLinks(source, d.url) &&
			!ctx.skipped.has(`${source.url} -> ${d.url}`)
	);
const fileLine = (source, line) => line + (source.post.bodyLineOffset ?? 0);
const excerpt = (text, n = 200) => {
	const clean = text.replace(/\s+/g, ' ').trim();
	return clean.length > n ? `${clean.slice(0, n - 1)}…` : clean;
};
const questionName = (url) => `d${url.replace(/[^a-z0-9]+/gi, '_')}`.slice(0, 120);

// ---------------------------------------------------------------------------
// Stage 1: whole-page "honest reason" judgments, one request per source (chunked)
// ---------------------------------------------------------------------------

async function judgeSource(jev, source, dests) {
	const state = { page: source.url, title: source.title, text: readableText(source.post.body) };
	const questions = Object.fromEntries(dests.map((d) => [questionName(d.url), linkQuestion(d)]));
	const answers = {};
	for (const chunk of chunkQuestions(state, questions)) {
		const result = await jev.decide(state, chunk);
		Object.assign(answers, result.answers);
	}
	return dests.map((d) => ({ dest: d, wide: linkStrength(answers[questionName(d.url)]) }));
}

// ---------------------------------------------------------------------------
// Stage 2: placement (existing wording → INSERT, else one added sentence → QUEUE)
// ---------------------------------------------------------------------------

function pickChoice(answer) {
	if (!answer || answer.choice === 'none') return null;
	return { key: answer.choice, probability: answer.probabilities?.[answer.choice] ?? 0 };
}

async function placeLink(jev, ctx, source, dest, config, body = source.post.body) {
	const paragraphs = paragraphsOf(body);
	const byKey = new Map(paragraphs.map((p) => [p.key, p]));
	if (dest.kind === 'person') {
		// Link a named person at their first mention (the web convention); never write a
		// sentence to add one. Name matching is exact and case-sensitive.
		const mentions = anchorParagraphs(paragraphs, phrasesFor(dest, ctx), Infinity);
		if (!mentions.length) return { mode: 'unnamed' };
		const first = mentions.reduce((a, b) => (b.line < a.line ? b : a));
		return {
			mode: 'anchor',
			key: first.key,
			probability: 1,
			line: first.line,
			anchor: first.anchor,
			text: first.text
		};
	}
	if (dest.kind !== 'question') {
		const candidates = anchorParagraphs(
			paragraphs,
			phrasesFor(dest, ctx),
			config.maxAnchorParagraphs
		);
		if (candidates.length) {
			const result = await jev.decide(paragraphState(dest, candidates), {
				anchor: anchorChoiceQuestion(dest, candidates)
			});
			const picked = pickChoice(result.answers.anchor);
			const hit = picked && candidates.find((c) => c.key === picked.key);
			if (hit) {
				return { mode: 'anchor', ...picked, line: hit.line, anchor: hit.anchor, text: hit.text };
			}
		}
	}
	const pool = paragraphs.slice(0, config.maxBridgeParagraphs);
	if (!pool.length) return null;
	const result = await jev.decide(paragraphState(dest, pool), {
		place: bridgeChoiceQuestion(dest, pool)
	});
	const picked = pickChoice(result.answers.place);
	if (!picked) return null;
	const hit = byKey.get(picked.key);
	// Re-judge the chosen paragraph on its own: a whole page can be "about" a topic
	// while the spot picked for the new sentence is a closing line about nothing.
	const fit = (
		await jev.decide(
			{ destination: destinationCard(dest), paragraph: hit.text },
			{ fit: linkQuestion(dest, 'paragraph') }
		)
	).answers.fit;
	return { mode: 'bridge', ...picked, line: hit.line, text: hit.text, fit: linkStrength(fit) };
}

// ---------------------------------------------------------------------------
// Estimate
// ---------------------------------------------------------------------------

function estimate(ctx, dests) {
	let tokens = 0;
	let calls = 0;
	let judgments = 0;
	for (const source of ctx.sources) {
		const targets = candidateTargets(ctx, source, dests);
		const state = { page: source.url, title: source.title, text: readableText(source.post.body) };
		const questions = Object.fromEntries(
			targets.map((d) => [questionName(d.url), linkQuestion(d)])
		);
		for (const chunk of chunkQuestions(state, questions)) {
			calls++;
			tokens += estimateTokens({ state, questions: chunk });
		}
		judgments += targets.length;
	}
	return { calls, tokens, judgments, cost: tokens * JEV_PRICE_PER_TOKEN };
}

// ---------------------------------------------------------------------------
// Calibration: agreement with the 2026-09-22 pass (accepted links vs rejected matches)
// ---------------------------------------------------------------------------

function unwrapLink(body, url) {
	const same = (href) => normalizeInternalHref(href) === url;
	return body
		.replace(/\[([^\]]*)\]\(([^)\s]*)[^)]*\)/g, (m, text, href) => (same(href) ? text : m))
		.replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (m, href, text) =>
			same(href) ? text : m
		);
}

function calibrationSet(ctx) {
	const cases = [];
	const norm = (s) => s.replace(/\s+/g, ' ').trim();
	for (const source of ctx.sources) {
		let oldBody;
		try {
			const raw = execFileSync('git', ['show', `${CALIBRATION_BASE}:src/blog/${source.post.rel}`], {
				cwd: REPO_ROOT,
				encoding: 'utf8',
				stdio: ['ignore', 'pipe', 'ignore']
			});
			oldBody = matter(raw).content;
		} catch {
			continue;
		}
		const oldTargets = new Set(extractInternalLinks(oldBody).map((l) => l.url));
		const oldLines = new Set(oldBody.split('\n').map(norm));
		for (const url of [...source.outBlog, ...source.outPeople]) {
			if (oldTargets.has(url)) continue;
			const target = ctx.graph.get(url);
			if (!target) continue;
			const body = unwrapLink(source.post.body, url);
			// Keep only links that wrapped words already in the post (the INSERT case);
			// sentences written for the link would test the writer, not the judgment.
			const beforeLines = source.post.body.split('\n');
			const afterLines = body.split('\n');
			if (beforeLines.length !== afterLines.length) continue; // multi-line <a>: skip
			const changed = afterLines.filter((line, i) => line !== beforeLines[i]);
			if (!changed.length || !changed.every((line) => oldLines.has(norm(line)))) continue;
			cases.push({ label: 1, source, target, body });
		}
	}
	const skipped = readJson(path.join(CROSSLINK_DIR, 'skipped.json'), { skipped: [] }).skipped;
	for (const entry of skipped) {
		const [from, to] = entry.id.split(' -> ');
		const source = ctx.graph.get(from);
		const target = ctx.graph.get(to);
		if (!source || source.kind !== 'blog' || !target) continue;
		cases.push({ label: 0, source, target, body: source.post.body, reason: entry.reason });
	}
	return cases;
}

function destFromNode(node) {
	return {
		kind: node.kind === 'person' ? 'person' : 'blog',
		url: node.url,
		title: node.title,
		description: node.kind === 'person' ? (node.description ?? '') : (node.post?.description ?? ''),
		enneagram: node.enneagram,
		node
	};
}

async function calibrate(jev, ctx, config) {
	const cases = calibrationSet(ctx);
	const positives = cases.filter((c) => c.label === 1).length;
	console.log(
		`Calibration set: ${positives} accepted links, ${cases.length - positives} rejected matches`
	);
	const results = await Promise.all(
		cases.map(async (c) => {
			const dest = destFromNode(c.target);
			const state = { page: c.source.url, title: c.source.title, text: readableText(c.body) };
			const wideResult = await jev.decide(state, { link: linkQuestion(dest) });
			const placement = await placeLink(jev, ctx, c.source, dest, config, c.body);
			return { ...c, dest, wide: linkStrength(wideResult.answers.link), placement };
		})
	);

	const rows = [];
	for (const t of [0.5, 0.6, 0.65, 0.7, 0.75, 0.8, 0.9]) {
		const pred = (r) => r.wide >= t && r.placement?.mode === 'anchor';
		const tp = results.filter((r) => r.label === 1 && pred(r)).length;
		const fp = results.filter((r) => r.label === 0 && pred(r)).length;
		const wideTp = results.filter((r) => r.label === 1 && r.wide >= t).length;
		const wideFp = results.filter((r) => r.label === 0 && r.wide >= t).length;
		rows.push({ t, tp, fp, wideTp, wideFp });
	}
	const negatives = cases.length - positives;
	const pct = (n, d) => (d ? `${Math.round((n / d) * 100)}%` : '—');
	const lines = [
		'# Jev Calibration',
		'',
		`_Generated: ${new Date().toISOString().slice(0, 10)} by \`pnpm audit:links:jev -- --calibrate\` · model ${jev.model} · cost $${jev.stats.cost.toFixed(4)}_`,
		'',
		`Ground truth: the 2026-09-22 cross-link pass. **${positives} accepted links** that wrapped words already in a post`,
		`(diff ${CALIBRATION_BASE}..HEAD, link removed before asking) vs **${negatives} rejected word matches** from`,
		'`skipped.json`. Both sets were string-matcher hits, so this measures exactly what Jev is for:',
		'telling an honest link from a coincidental mention.',
		'',
		"Link strength = Jev's 4-level rubric score / 3 (0 unrelated … 1 direct). Chosen over three yes/no wordings on this",
		'set 2026-09-23 (rubric AUC 0.84; yes/no wordings 0.71–0.80; averaging them with the rubric did not help).',
		'',
		'"Kept" = link strength ≥ threshold AND Jev picked an existing-wording anchor (the INSERT path). The last column',
		'is the strength judgment alone, which decides whether a link is proposed at all (INSERT or QUEUE).',
		'',
		'Known blind spot: sentences that warn against a subject ("not compatibility, communication") still read as',
		'about it (Jev takes negation literally). A stance check was tested 2026-09-23 and was net neutral',
		'(+1 point precision, −4 accepted links), so the writing step catches these instead.',
		'',
		'| Threshold | Accepted kept | Rejected kept | Precision | Whole-page only: accepted / rejected |',
		'|---|---|---|---|---|'
	];
	for (const r of rows) {
		lines.push(
			`| ${r.t} | ${r.tp}/${positives} (${pct(r.tp, positives)}) | ${r.fp}/${negatives} (${pct(r.fp, negatives)}) | ${pct(r.tp, r.tp + r.fp)} | ${pct(r.wideTp, positives)} / ${pct(r.wideFp, negatives)} |`
		);
	}
	const t = config.thresholds.wide;
	const misses = results.filter(
		(r) => r.label === 1 && !(r.wide >= t && r.placement?.mode === 'anchor')
	);
	const leaks = results.filter(
		(r) => r.label === 0 && r.wide >= t && r.placement?.mode === 'anchor'
	);
	lines.push('', `## Accepted links Jev would drop at ${t}`, '');
	for (const r of misses)
		lines.push(
			`- \`${r.source.url}\` → \`${r.target.url}\`: wide ${r.wide.toFixed(2)}, placement ${r.placement?.mode ?? 'none'}`
		);
	lines.push('', `## Rejected matches Jev would still insert at ${t}`, '');
	for (const r of leaks)
		lines.push(
			`- \`${r.source.url}\` → \`${r.target.url}\`: wide ${r.wide.toFixed(2)}, anchor "${r.placement.anchor}" (${r.placement.probability.toFixed(2)}). Rejected because: ${r.reason}`
		);
	fs.writeFileSync(path.join(CROSSLINK_DIR, 'jev-calibration.md'), lines.join('\n') + '\n');
	console.log(lines.slice(10, 12 + rows.length).join('\n'));
	console.log(
		`\nwrote docs/crosslinks/jev-calibration.md · Jev cost $${jev.stats.cost.toFixed(4)}`
	);
}

// ---------------------------------------------------------------------------
// Full audit
// ---------------------------------------------------------------------------

async function audit(jev, ctx, dests, config) {
	let sources = ctx.sources;
	if (option('--source')) sources = sources.filter((s) => s.url === option('--source'));
	if (option('--limit')) sources = sources.slice(0, Number(option('--limit')));
	// Only place pairs that could still earn a tier (placement costs 1–3 more calls).
	const t = config.thresholds;
	const floorFor = (dest) =>
		dest.kind === 'person' ? t.person : dest.kind === 'question' ? t.question : t.wide;

	const pairs = [];
	let done = 0;
	await Promise.all(
		sources.map(async (source) => {
			const targets = candidateTargets(ctx, source, dests);
			const judged = await judgeSource(jev, source, targets);
			for (const { dest, wide } of judged) {
				if (wide < floorFor(dest)) {
					pairs.push({ source, dest, wide, tier: null });
					continue;
				}
				const competes =
					dest.kind === 'question'
						? { share: 0, sharedQueries: [] }
						: competition(ctx.gsc, source.url, dest.url);
				const placement =
					dest.kind !== 'question' && competes.share >= config.thresholds.competes
						? null
						: await placeLink(jev, ctx, source, dest, config);
				const tier = tierFor({ dest, wide, competes: competes.share, placement, config });
				pairs.push({ source, dest, wide, competes, placement, tier });
			}
			done++;
			if (done % 20 === 0)
				console.log(`  ${done}/${sources.length} sources · $${jev.stats.cost.toFixed(3)}`);
		})
	);

	applyCaps(pairs, config.caps);

	// Question links are opt-in: at most one per post and three per question.
	const perQuestion = new Map();
	const perSource = new Set();
	for (const p of pairs.filter((x) => x.tier === 'QUESTION').sort((a, b) => b.wide - a.wide)) {
		const n = perQuestion.get(p.dest.url) ?? 0;
		if (perSource.has(p.source.url) || n >= 3) {
			p.tier = null;
			continue;
		}
		perSource.add(p.source.url);
		perQuestion.set(p.dest.url, n + 1);
	}

	writeAudit(jev, ctx, dests, pairs, sources.length, config);
}

function writeAudit(jev, ctx, dests, pairs, sourceCount, config) {
	const live = pairs.filter((p) => p.tier);
	const count = (tier) => live.filter((p) => p.tier === tier).length;
	const bestWide = new Map();
	for (const p of pairs) bestWide.set(p.dest.url, Math.max(bestWide.get(p.dest.url) ?? 0, p.wide));
	const noHost = dests.filter(
		(d) => d.kind !== 'question' && !live.some((p) => p.dest.url === d.url && p.tier !== 'AVOID')
	);
	const row = (p) => ({
		source: p.source.url,
		file: `src/blog/${p.source.post.rel}`,
		destination: p.dest.url,
		kind: p.dest.kind,
		tier: p.tier,
		wide: Math.round(p.wide * 100) / 100,
		line: p.placement ? fileLine(p.source, p.placement.line) : null,
		anchor: p.placement?.anchor ?? null,
		placementProbability: p.placement ? Math.round(p.placement.probability * 100) / 100 : null,
		competes: p.competes ? Math.round(p.competes.share * 100) / 100 : 0,
		sharedQueries: p.competes?.sharedQueries ?? [],
		paragraph: p.placement ? excerpt(p.placement.text, 300) : null
	});
	const json = {
		generatedAt: new Date().toISOString(),
		model: jev.model,
		gscWindow: ctx.gsc?.window ?? null,
		thresholds: config.thresholds,
		twins: config.twins,
		stats: {
			sources: sourceCount,
			destinations: dests.length,
			judgments: pairs.length,
			apiCalls: jev.stats.calls,
			cachedCalls: jev.stats.cached,
			inputTokens: jev.stats.inputTokens,
			cost: Math.round(jev.stats.cost * 10000) / 10000,
			fullRunCost: Math.round(jev.stats.answerCost * 10000) / 10000
		},
		links: live.map(row).sort((a, b) => b.wide - a.wide),
		// Pairs strong enough to try placing that did not make a tier, with the reason.
		nearMisses: pairs
			.filter((p) => !p.tier && p.placement !== undefined && p.placement?.mode !== 'unnamed')
			.map((p) => ({
				...row(p),
				reason: p.capped
					? `capped (${p.capped})`
					: !p.placement
						? 'no honest spot (Jev chose none)'
						: p.placement.mode === 'bridge'
							? `added sentence did not fit (paragraph fit ${p.placement.fit?.toFixed(2)})`
							: `anchor too weak (${p.placement.probability.toFixed(2)})`
			}))
			.sort((a, b) => b.wide - a.wide)
			.slice(0, 200),
		noHonestHost: noHost.map((d) => ({
			url: d.url,
			kind: d.kind,
			impressions: d.impressions,
			bestScore: Math.round((bestWide.get(d.url) ?? 0) * 100) / 100
		}))
	};
	fs.writeFileSync(
		path.join(CROSSLINK_DIR, 'jev-audit.json'),
		JSON.stringify(json, null, '\t') + '\n'
	);

	const md = [
		'# Jev Link Audit',
		'',
		`_Generated: ${json.generatedAt.slice(0, 10)} by \`pnpm audit:links:jev\` · model ${jev.model} · GSC ${ctx.gsc?.window?.startDate} → ${ctx.gsc?.window?.endDate}_`,
		'',
		`Read ${sourceCount} live posts against ${dests.length} destinations: ${pairs.length.toLocaleString()} honest-reason judgments in ${(jev.stats.calls + jev.stats.cached).toLocaleString()} Jev calls. A full uncached run costs $${jev.stats.answerCost.toFixed(2)}; this run paid $${jev.stats.cost.toFixed(4)} (${jev.stats.cached.toLocaleString()} answers from tmp/jev-cache/).`,
		'',
		'| Tier | Links | Meaning |',
		'|---|---|---|',
		`| INSERT | ${count('INSERT')} | Words already in the post can carry the link |`,
		`| QUEUE | ${count('QUEUE')} | Honest reason, but it needs one added sentence (\`/crosslink-queue\` writes it) |`,
		`| QUESTION | ${count('QUESTION')} | Invite readers to answer a live question (max 1 per post, 3 per question) |`,
		`| AVOID | ${count('AVOID')} | Source competes for ≥${config.thresholds.competes * 100}% of the destination's searches |`,
		`| No honest host | ${noHost.length} destinations | Nothing live gives a reason to link there yet |`,
		'',
		`Thresholds: honest reason ≥ ${config.thresholds.wide}, anchor ≥ ${config.thresholds.anchor}, question ≥ ${config.thresholds.question}. Losing duplicate twins (never destinations): ${
			Object.entries(config.twins)
				.map(([l, w]) => `\`${l}\` → \`${w}\``)
				.join('; ') || 'none'
		}.`,
		''
	];
	const kinds = [
		['blog', 'Search wins (blog posts)'],
		['person', 'People pages'],
		['question', 'Questions']
	];
	for (const [kind, heading] of kinds) {
		const group = dests
			.filter((d) => d.kind === kind)
			.map((d) => ({ d, links: live.filter((p) => p.dest.url === d.url) }))
			.filter((g) => g.links.length);
		if (!group.length) continue;
		md.push(`## ${heading}`, '');
		for (const { d, links } of group.sort(
			(a, b) => (b.d.impressions ?? 0) - (a.d.impressions ?? 0)
		)) {
			const stat =
				d.kind === 'question'
					? ''
					: ` · ${(d.impressions ?? 0).toLocaleString()} impr, pos ${d.position ?? '—'}, ${d.inbound} in`;
			md.push(
				`### \`${d.url}\`${stat}`,
				'',
				'| Tier | Source (line) | Anchor / placement | Honest | Paragraph |',
				'|---|---|---|---|---|'
			);
			for (const p of links.sort((a, b) => b.wide - a.wide)) {
				const r = row(p);
				const place =
					p.tier === 'AVOID'
						? `competes ${Math.round(r.competes * 100)}% (${r.sharedQueries.slice(0, 2).join(', ')})`
						: p.placement?.mode === 'anchor'
							? `"${r.anchor}"`
							: `add a sentence after L${r.line}`;
				md.push(
					`| ${p.tier} | \`${p.source.url}\` (L${r.line ?? '—'}) | ${place.replace(/\|/g, '\\|')} | ${r.wide} | ${(r.paragraph ?? '').replace(/\|/g, '\\|').slice(0, 160)} |`
				);
			}
			md.push('');
		}
	}
	md.push(
		'## No honest host yet',
		'',
		'Destinations no live post has a real reason to link to. These need a page that discusses them, not a link.',
		''
	);
	md.push('| Destination | Kind | Impressions | Best honest-reason score |', '|---|---|---|---|');
	for (const d of json.noHonestHost.sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0))) {
		md.push(
			`| \`${d.url}\` | ${d.kind} | ${(d.impressions ?? 0).toLocaleString()} | ${d.bestScore} |`
		);
	}
	fs.writeFileSync(path.join(CROSSLINK_DIR, 'jev-audit.md'), md.join('\n') + '\n');
	console.log(
		`\nINSERT ${count('INSERT')} · QUEUE ${count('QUEUE')} · QUESTION ${count('QUESTION')} · AVOID ${count('AVOID')} · no host ${noHost.length}`
	);
	console.log(`wrote docs/crosslinks/jev-audit.{md,json} · Jev cost $${jev.stats.cost.toFixed(4)}`);
}

// ---------------------------------------------------------------------------

const config = loadConfig();
const ctx = loadInputs();
const questions = flag('--calibrate') ? [] : await loadLiveQuestions();
const dests = selectDestinations({ graph: ctx.graph, gsc: ctx.gsc, questions, config });
const byKind = (k) => dests.filter((d) => d.kind === k).length;
console.log(
	`Sources: ${ctx.sources.length} live posts · destinations: ${byKind('blog')} blog, ${byKind('person')} people, ${byKind('question')} questions`
);

if (flag('--estimate')) {
	const e = estimate(ctx, dests);
	console.log(
		`Stage 1: ${e.calls} calls, ${e.judgments.toLocaleString()} judgments, ~${(e.tokens / 1e6).toFixed(1)}M tokens, ~$${e.cost.toFixed(2)} (placement adds roughly the same again for the pairs that pass)`
	);
} else {
	const jev = createJevClient({
		apiKey: readOpenRouterKey(REPO_ROOT),
		cacheDir: flag('--no-cache') ? null : CACHE_DIR
	});
	if (flag('--calibrate')) await calibrate(jev, { ...ctx }, config);
	else await audit(jev, ctx, dests, config);
}
