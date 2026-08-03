import scss from 'postcss-scss';

/** @typedef {'badge' | 'control' | 'card' | 'pill'} RadiusRole */
/**
 * @typedef {object} RadiusRoleViolation
 * @property {string} rel
 * @property {number} line
 * @property {RadiusRole} role
 * @property {string} value
 */

const ROLE_DIRECTIVE = /lint-radius-role:\s*(control|card|badge|pill)\b/i;
const INLINE_IGNORE = 'lint-radius-disable-line';
const STYLE_BLOCK = /<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/gi;
const OPEN_TAG = /<([A-Za-z][\w:.-]*)\b[^<>]*?>/g;
const RADIUS_CLASS =
	/(?<![\w-])((?:[a-z][a-z0-9-]*:)*rounded(?:-(?:t|b|l|r|s|e|tl|tr|bl|br|ss|se|es|ee))?-(sm|md|xl|full))(?![\w-])/g;

/** @type {Record<RadiusRole, RegExp>} */
const ROLE_CLASSES = {
	badge: /^(?:4px|0\.25rem|var\(--(?:border-radius-sm|radius-badge)\))$/,
	control: /^(?:10px|0\.625rem|var\(--(?:(?:base-)?border-radius(?:-md)?|radius-control)\))$/,
	card: /^(?:16px|1rem|var\(--(?:border-radius-lg|radius-card)\))$/,
	pill: /^(?:50%|100%|9{3,4}px|var\(--radius-pill\))$/
};

/** @type {Record<string, RadiusRole>} */
const CLASS_TO_ROLE = {
	sm: 'badge',
	md: 'control',
	xl: 'card',
	full: 'pill'
};

/**
 * @param {string} text
 * @param {number} index
 */
function lineNumberAt(text, index) {
	return text.slice(0, index).split('\n').length;
}

/** @param {string} value */
function roleFromDirective(value) {
	const role = value.match(ROLE_DIRECTIVE)?.[1]?.toLowerCase();
	return role ? /** @type {RadiusRole} */ (role) : null;
}

/**
 * @param {string[]} lines
 * @param {number} line
 */
function explicitRoleFromLines(lines, line) {
	const current = lines[line - 1] ?? '';
	const previous = lines[line - 2] ?? '';
	return roleFromDirective(current) ?? roleFromDirective(previous);
}

/**
 * @param {string[]} lines
 * @param {number} line
 */
function isIgnoredLine(lines, line) {
	return (
		(lines[line - 1] ?? '').includes(INLINE_IGNORE) ||
		(lines[line - 2] ?? '').includes(INLINE_IGNORE)
	);
}

/**
 * @param {import('postcss').Declaration} declaration
 * @param {string[]} lines
 * @param {number} line
 */
function explicitRoleFromDeclaration(declaration, lines, line) {
	const previousNode = declaration.prev();
	if (previousNode?.type === 'comment') {
		const role = roleFromDirective(previousNode.text);
		if (role) return role;
	}

	return explicitRoleFromLines(lines, line);
}

/** @param {string | undefined} selector */
function selectorTargetsFormControl(selector) {
	if (!selector) return false;

	return selector.split(',').some((part) => {
		const normalized = part.toLowerCase();
		if (/(^|[^\w-])(?:select|textarea)(?=$|[^\w-])/.test(normalized)) return true;

		for (const match of normalized.matchAll(/(^|[^\w-])input(?=$|[^\w-])/g)) {
			const rest = normalized.slice((match.index ?? 0) + match[0].length);
			const type = rest.match(/^\s*\[\s*type\s*=\s*['"]?([\w-]+)/)?.[1];
			if (type !== 'checkbox' && type !== 'radio') return true;
		}

		return false;
	});
}

/** @param {import('postcss').Declaration} declaration */
function inferredCssRole(declaration) {
	if (declaration.parent?.type !== 'rule') return null;
	return selectorTargetsFormControl(declaration.parent.selector) ? 'control' : null;
}

/**
 * @param {string} text
 * @param {string} ext
 * @returns {{ css: string; lineOffset: number }[]}
 */
function cssSources(text, ext) {
	if (ext !== '.svelte') return [{ css: text, lineOffset: 0 }];

	return [...text.matchAll(STYLE_BLOCK)].map((match) => {
		const cssStart = (match.index ?? 0) + match[0].indexOf(match[1]);
		return {
			css: match[1],
			lineOffset: lineNumberAt(text, cssStart) - 1
		};
	});
}

/**
 * @param {string} value
 * @param {RadiusRole} role
 */
export function cssValueMatchesRole(value, role) {
	const expected = ROLE_CLASSES[role];

	return value
		.trim()
		.split(/\s+/)
		.every((token) => token === '0' || token === '!important' || expected.test(token));
}

/**
 * @param {{ text: string; rel: string; ext: string }} source
 * @returns {RadiusRoleViolation[]}
 */
export function findSemanticCssViolations({ text, rel, ext }) {
	const lines = text.split('\n');
	/** @type {RadiusRoleViolation[]} */
	const violations = [];

	for (const { css, lineOffset } of cssSources(text, ext)) {
		let root;
		try {
			root = scss.parse(css);
		} catch {
			// Syntax errors are reported by the owning CSS/Svelte toolchain. Keep this
			// focused on semantic radius drift and retain the existing regex scale check.
			continue;
		}

		root.walkDecls(/^border-radius$/i, (declaration) => {
			const sourceLine = declaration.source?.start?.line;
			if (!sourceLine) return;
			const line = lineOffset + sourceLine;
			if (isIgnoredLine(lines, line)) return;
			const role =
				explicitRoleFromDeclaration(declaration, lines, line) ?? inferredCssRole(declaration);
			if (!role || cssValueMatchesRole(declaration.value, role)) return;

			violations.push({
				rel,
				line,
				role,
				value: declaration.value.trim()
			});
		});
	}

	return violations;
}

/**
 * @param {string} tagName
 * @param {string} tag
 */
function tagTargetsFormControl(tagName, tag) {
	const normalizedName = tagName.toLowerCase();
	if (normalizedName === 'select' || normalizedName === 'textarea') return true;
	if (normalizedName !== 'input') return false;

	const type = tag.match(/\btype\s*=\s*['"]([\w-]+)['"]/i)?.[1]?.toLowerCase();
	return type !== 'checkbox' && type !== 'radio';
}

/**
 * @param {{ text: string; rel: string }} source
 * @returns {RadiusRoleViolation[]}
 */
export function findSemanticMarkupViolations({ text, rel }) {
	const lines = text.split('\n');
	/** @type {RadiusRoleViolation[]} */
	const violations = [];

	for (const tagMatch of text.matchAll(OPEN_TAG)) {
		const tag = tagMatch[0];
		const line = lineNumberAt(text, tagMatch.index ?? 0);
		if (isIgnoredLine(lines, line)) continue;
		const role =
			explicitRoleFromLines(lines, line) ??
			(tagTargetsFormControl(tagMatch[1], tag) ? 'control' : null);
		if (!role) continue;

		for (const radiusMatch of tag.matchAll(RADIUS_CLASS)) {
			const actualRole = CLASS_TO_ROLE[radiusMatch[2]];
			if (actualRole === role) continue;

			violations.push({
				rel,
				line,
				role,
				value: radiusMatch[1]
			});
		}
	}

	return violations;
}

/**
 * @param {{ text: string; rel: string; ext: string; cssEligible: boolean }} source
 * @returns {RadiusRoleViolation[]}
 */
export function findRadiusRoleViolations({ text, rel, ext, cssEligible }) {
	const violations = cssEligible ? findSemanticCssViolations({ text, rel, ext }) : [];
	if (ext === '.svelte' || ext === '.html') {
		violations.push(...findSemanticMarkupViolations({ text, rel }));
	}
	return violations;
}
