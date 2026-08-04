// scripts/lint-global-component-css.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const MAX_LINES = 212;
const stylesheetUrl = new URL('../src/scss/components.scss', import.meta.url);
const stylesheetPath = fileURLToPath(stylesheetUrl);
const stylesheet = readFileSync(stylesheetUrl, 'utf8');
const lineCount = stylesheet.endsWith('\n')
	? stylesheet.split(/\r?\n/).length - 1
	: stylesheet.split(/\r?\n/).length;

if (lineCount > MAX_LINES) {
	console.error(
		`✗ lint:global-css — ${stylesheetPath} is ${lineCount} lines; budget is ${MAX_LINES}.`
	);
	console.error(
		'Move component semantics into an owning Svelte component or lower the new addition.'
	);
	process.exit(1);
}

console.log(
	`✓ lint:global-css — components.scss is ${lineCount}/${MAX_LINES} lines (ratchet; lower after migrations).`
);
