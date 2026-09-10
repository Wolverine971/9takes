#!/usr/bin/env node
// scripts/blog-pipeline-status.mjs
// Read-only status for nightly reconciliation, including holds with no draft.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	'../docs/content-analysis/pipeline-logs'
);
/** @param {string} value */
const normalize = (value) => value.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const subject = process.argv[2];
let result = null;
if (subject) {
	for (const name of (await fs.readdir(root).catch(() => [])).sort().reverse()) {
		if (name.startsWith('.')) continue;
		try {
			const run = JSON.parse(await fs.readFile(path.join(root, name, 'run.json'), 'utf8'));
			if (run.schema_version === 3 && normalize(run.subject) === normalize(subject)) {
				result = {
					subject: run.subject,
					run_status: run.run_status,
					editorial_status: run.editorial_status,
					blockers: run.blockers || [],
					run_dir: path.join(root, name)
				};
				break;
			}
		} catch {
			/* Legacy or incomplete directory. */
		}
	}
}
console.log(JSON.stringify(result));
