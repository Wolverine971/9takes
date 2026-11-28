#!/usr/bin/env node
// scripts/check-stage-evidence.mjs
// The runner's own evidence check, for a pipeline stage to run on its files before
// it finishes. A stage that tests its anchors another way (raw text search) can
// pass its own test and still be rejected by the runner.
//
//   node scripts/check-stage-evidence.mjs <article.md> <evidence.json>
//
// Exit 0 when the runner would accept the pair, 1 with the reason when it would not.
import { promises as fs } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { validateEvidence, cleanReaderCopy, readJson, errorMessage } from './lib/blogEditorial.js';

/**
 * @param {string} markdownFile
 * @param {string} evidenceFile
 * @returns {Promise<{ok: boolean, message: string}>}
 */
export async function checkStageEvidence(markdownFile, evidenceFile) {
	try {
		const raw = /** @type {any} */ (await readJson(evidenceFile));
		// The runner strips grades and HTML comments from the article before it checks.
		const markdown = cleanReaderCopy(await fs.readFile(markdownFile, 'utf8'));
		const evidence = validateEvidence(raw, String(raw?.subject ?? ''), markdown);
		return {
			ok: true,
			message: `OK: ${evidence.claims.length} claims, every passage found in the article.`
		};
	} catch (error) {
		return { ok: false, message: `REJECTED: ${errorMessage(error)}` };
	}
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	const [markdownFile, evidenceFile] = process.argv.slice(2);
	if (!markdownFile || !evidenceFile) {
		console.error('Usage: node scripts/check-stage-evidence.mjs <article.md> <evidence.json>');
		process.exit(2);
	}
	const result = await checkStageEvidence(markdownFile, evidenceFile);
	console.log(result.message);
	process.exit(result.ok ? 0 : 1);
}
