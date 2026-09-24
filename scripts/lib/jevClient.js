// scripts/lib/jevClient.js

/**
 * Minimal client for TypeSafe's Jev "System One" decision model through
 * OpenRouter's Decisions API (NOT chat completions):
 *
 *   POST https://openrouter.ai/api/alpha/decisions
 *   { model, state, questions: { name: { type: 'noul'|'choice'|'score', instructions, criteria? } } }
 *   → { answers: { name: { noul } | { choice, probabilities, confidence } | { score, ... } },
 *       usage: { input_tokens, output_tokens, cost } }
 *
 * Jev returns typed decisions with probabilities and writes no text. It is billed on input
 * tokens only ($0.042/M), has a 32k-token window (state + questions) on OpenRouter,
 * and reads instructions literally: no negations, no arithmetic, no date logic.
 *
 * Responses are cached on disk by a hash of (model, state, questions), so a re-run of
 * an audit only pays for the calls that changed.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const JEV_ENDPOINT = 'https://openrouter.ai/api/alpha/decisions';
export const JEV_MODEL = 'typesafe/jev-1.13';
export const JEV_CONTEXT_TOKENS = 32000;
export const JEV_PRICE_PER_TOKEN = 0.042 / 1e6;

// Measured on this corpus 2026-09-23: ~4.1 characters per Jev token.
const CHARS_PER_TOKEN = 4.1;

export function estimateTokens(value) {
	const text = typeof value === 'string' ? value : JSON.stringify(value);
	return Math.ceil(text.length / CHARS_PER_TOKEN);
}

export function readOpenRouterKey(repoRoot) {
	if (process.env.PRIVATE_OPENROUTER_API_KEY) return process.env.PRIVATE_OPENROUTER_API_KEY;
	for (const file of ['.env.local', '.env']) {
		const full = path.join(repoRoot, file);
		if (!fs.existsSync(full)) continue;
		const match = fs.readFileSync(full, 'utf8').match(/^PRIVATE_OPENROUTER_API_KEY=(.*)$/m);
		if (match) return match[1].trim().replace(/^["']|["']$/g, '');
	}
	throw new Error('PRIVATE_OPENROUTER_API_KEY not found in env, .env.local, or .env');
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function createJevClient({
	apiKey,
	model = JEV_MODEL,
	cacheDir = null,
	concurrency = 8,
	maxRetries = 5,
	fetchImpl = fetch
}) {
	// cost = paid this run; answerCost = what every answer used cost to produce (incl. cached).
	const stats = { calls: 0, cached: 0, inputTokens: 0, cost: 0, answerCost: 0, failures: 0 };
	let active = 0;
	const waiting = [];
	const acquire = () =>
		active < concurrency
			? (active++, Promise.resolve())
			: new Promise((resolve) => waiting.push(resolve));
	const release = () => {
		const next = waiting.shift();
		if (next) next();
		else active--;
	};

	if (cacheDir) fs.mkdirSync(cacheDir, { recursive: true });
	const cachePath = (body) =>
		cacheDir &&
		path.join(
			cacheDir,
			`${crypto.createHash('sha256').update(JSON.stringify(body)).digest('hex')}.json`
		);

	async function post(body) {
		for (let attempt = 0; ; attempt++) {
			let response;
			try {
				response = await fetchImpl(JEV_ENDPOINT, {
					method: 'POST',
					headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
					body: JSON.stringify(body)
				});
			} catch (error) {
				if (attempt >= maxRetries) throw error;
				await sleep(500 * 2 ** attempt);
				continue;
			}
			if (response.ok) return response.json();
			const retryable = response.status === 429 || response.status >= 500;
			const text = await response.text();
			if (!retryable || attempt >= maxRetries) {
				throw new Error(`Jev ${response.status}: ${text.slice(0, 300)}`);
			}
			const retryAfter = Number(response.headers.get('retry-after'));
			await sleep(retryAfter > 0 ? retryAfter * 1000 : 500 * 2 ** attempt);
		}
	}

	/** Ask Jev a set of named questions about one state. */
	async function decide(state, questions) {
		const body = { model, state, questions };
		const estimate = estimateTokens(body);
		if (estimate > JEV_CONTEXT_TOKENS - 1000) {
			throw new Error(`Jev request too large (~${estimate} tokens); split the questions`);
		}
		const file = cachePath(body);
		if (file && fs.existsSync(file)) {
			stats.cached++;
			const hit = JSON.parse(fs.readFileSync(file, 'utf8'));
			stats.answerCost += hit.usage?.cost ?? 0;
			return { ...hit, cached: true };
		}
		await acquire();
		try {
			const result = await post(body);
			stats.calls++;
			stats.inputTokens += result.usage?.input_tokens ?? 0;
			stats.cost += result.usage?.cost ?? 0;
			stats.answerCost += result.usage?.cost ?? 0;
			if (file) fs.writeFileSync(file, JSON.stringify(result));
			return { ...result, cached: false };
		} catch (error) {
			stats.failures++;
			throw error;
		} finally {
			release();
		}
	}

	return { decide, stats, model };
}

/** Pack questions into as few requests as fit the context window next to `state`. */
export function chunkQuestions(state, questions, budget = JEV_CONTEXT_TOKENS - 2500) {
	const stateTokens = estimateTokens(state) + 50;
	const chunks = [];
	let current = {};
	let used = stateTokens;
	for (const [name, question] of Object.entries(questions)) {
		const cost = estimateTokens({ [name]: question }) + 10;
		if (stateTokens + cost > budget) throw new Error(`State too large for question ${name}`);
		if (used + cost > budget && Object.keys(current).length) {
			chunks.push(current);
			current = {};
			used = stateTokens;
		}
		current[name] = question;
		used += cost;
	}
	if (Object.keys(current).length) chunks.push(current);
	return chunks;
}
