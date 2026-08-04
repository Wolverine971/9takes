// scripts/lint-global-component-css.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const MAX_LINES = 156;
const stylesheetUrl = new URL('../src/scss/components.scss', import.meta.url);
const stylesheetPath = fileURLToPath(stylesheetUrl);
const stylesheet = readFileSync(stylesheetUrl, 'utf8');
const lineCount = stylesheet.endsWith('\n')
	? stylesheet.split(/\r?\n/).length - 1
	: stylesheet.split(/\r?\n/).length;
const retiredBadgeTagSelector = /\.(?:badge(?:-glow|-dot)?|tag)\b(?=[\s,{.:#>+~\[])/;

if (retiredBadgeTagSelector.test(stylesheet)) {
	console.error(
		`✗ lint:global-css — ${stylesheetPath} reintroduces the retired global badge/tag family.`
	);
	console.error('Keep badge, tag, and indicator presentation in their semantic Svelte owners.');
	process.exit(1);
}

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
