// scripts/lint-global-component-css.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const MAX_LINES = 6;
const stylesheetUrl = new URL('../src/scss/components.scss', import.meta.url);
const stylesheetPath = fileURLToPath(stylesheetUrl);
const stylesheet = readFileSync(stylesheetUrl, 'utf8');
const lineCount = stylesheet.endsWith('\n')
	? stylesheet.split(/\r?\n/).length - 1
	: stylesheet.split(/\r?\n/).length;
const retiredBadgeTagSelector = /\.(?:badge(?:-glow|-dot)?|tag)\b(?=[\s,{.:#>+~\[])/;
const retiredFormSelector = /\.form-(?:input|textarea|select)\b(?=[\s,{.:#>+~\[])/;
const retiredModalSelector = /\.modal-(?:overlay|content|header|body)\b(?=[\s,{.:#>+~\[])/;
const retiredCardSelector = /\.(?:card-base|enneagram-container)\b(?=[\s,{.:#>+~\[])/;

if (retiredBadgeTagSelector.test(stylesheet)) {
	console.error(
		`✗ lint:global-css — ${stylesheetPath} reintroduces the retired global badge/tag family.`
	);
	console.error('Keep badge, tag, and indicator presentation in their semantic Svelte owners.');
	process.exit(1);
}

if (retiredFormSelector.test(stylesheet)) {
	console.error(
		`✗ lint:global-css — ${stylesheetPath} reintroduces the retired global form-control family.`
	);
	console.error('Use the canonical Field, Input, Textarea, and Select atoms instead.');
	process.exit(1);
}

if (retiredModalSelector.test(stylesheet)) {
	console.error(
		`✗ lint:global-css — ${stylesheetPath} reintroduces the retired global modal family.`
	);
	console.error('Keep dialog presentation in the canonical Modal or its explicit local owner.');
	process.exit(1);
}

if (retiredCardSelector.test(stylesheet)) {
	console.error(
		`✗ lint:global-css — ${stylesheetPath} reintroduces the retired global card-base family.`
	);
	console.error('Keep card presentation in its semantic Svelte owner.');
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
