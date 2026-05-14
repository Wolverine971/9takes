// src/lib/rehype-prune-legacy-jsonld.js
import matter from 'gray-matter';

/**
 * Removes legacy inline JSON-LD from markdown articles when the route-level
 * head already emits canonical Article/Breadcrumb schema. Standalone HowTo
 * nodes are preserved unless the page has frontmatter-driven HowTo schema.
 */

const LD_JSON_PATTERN = /\btype\s*=\s*["']application\/ld\+json["']/i;
const SCRIPT_PATTERN = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
const STANDALONE_TYPES_TO_KEEP = new Set(['HowTo']);

/**
 * @typedef {{ type: string, tagName?: string, properties?: Record<string, any>, children?: HastNode[], value?: string }} HastNode
 * @typedef {{ data?: { fm?: Record<string, any> } }} VFile
 * @typedef {Record<string, any>} JsonLdNode
 */

/** @param {unknown} node @returns {string[]} */
function getTypeList(node) {
	if (!node || typeof node !== 'object' || Array.isArray(node)) return [];
	const type = /** @type {JsonLdNode} */ (node)['@type'];
	if (Array.isArray(type)) return type.filter((item) => typeof item === 'string');
	if (typeof type === 'string') return [type];
	return [];
}

/** @param {VFile} vfile @returns {boolean} */
function hasFrontmatterHowTo(vfile) {
	const steps = vfile?.data?.fm?.howToSteps;
	return Array.isArray(steps) && steps.length > 0;
}

/** @param {JsonLdNode} node @param {VFile} vfile @returns {boolean} */
function shouldKeepNode(node, vfile) {
	const types = getTypeList(node);
	if (!types.some((type) => STANDALONE_TYPES_TO_KEEP.has(type))) return false;
	return !hasFrontmatterHowTo(vfile);
}

/** @param {JsonLdNode} node @returns {JsonLdNode} */
function cloneNodeWithoutContext(node) {
	const clone = { ...node };
	delete clone['@context'];
	return clone;
}

/** @param {unknown} parsed @returns {unknown[]} */
function getCandidateNodes(parsed) {
	if (Array.isArray(parsed)) return parsed;
	if (!parsed || typeof parsed !== 'object') return [];
	const node = /** @type {JsonLdNode} */ (parsed);
	if (Array.isArray(node['@graph'])) return node['@graph'];
	return [parsed];
}

/** @param {string} rawJson @param {VFile} vfile @returns {JsonLdNode | null} */
function pruneJsonLd(rawJson, vfile) {
	try {
		const parsed = JSON.parse(rawJson.trim());
		const context =
			parsed && typeof parsed === 'object' && !Array.isArray(parsed) && parsed['@context']
				? parsed['@context']
				: 'https://schema.org';
		const keptNodes = /** @type {JsonLdNode[]} */ (
			getCandidateNodes(parsed).filter(
				(node) => node && typeof node === 'object' && !Array.isArray(node)
			)
		).filter((node) => shouldKeepNode(node, vfile));

		if (!keptNodes.length) return null;

		if (keptNodes.length === 1) {
			return {
				'@context': context,
				...cloneNodeWithoutContext(keptNodes[0])
			};
		}

		return {
			'@context': context,
			'@graph': keptNodes.map(cloneNodeWithoutContext)
		};
	} catch {
		return null;
	}
}

/** @param {HastNode} node @returns {string} */
function textContent(node) {
	if (!node.children) return '';
	return node.children.map((child) => child.value ?? textContent(child)).join('');
}

/** @param {string} value @param {VFile} vfile @returns {string} */
function transformRawHtml(value, vfile) {
	return value.replace(
		SCRIPT_PATTERN,
		/**
		 * @param {string} match
		 * @param {string} attrs
		 * @param {string} body
		 */
		(match, attrs, body) => {
			if (!LD_JSON_PATTERN.test(attrs)) return match;
			const pruned = pruneJsonLd(body, vfile);
			return pruned ? `<script${attrs}>${JSON.stringify(pruned)}</script>` : '';
		}
	);
}

/** @param {string} content @returns {string} */
export function pruneLegacyJsonLdFromMarkdown(content) {
	const parsed = matter(content);
	return transformRawHtml(content, { data: { fm: parsed.data } });
}

/** @param {HastNode} node @returns {boolean} */
function isLdJsonScriptElement(node) {
	if (node.type !== 'element' || node.tagName !== 'script') return false;
	const type = node.properties?.type;
	return typeof type === 'string' && type.toLowerCase() === 'application/ld+json';
}

export default function rehypePruneLegacyJsonLd() {
	/** @param {HastNode} tree @param {VFile} vfile */
	return (tree, vfile) => {
		/** @param {HastNode} node */
		function walk(node) {
			if (!node.children) return;

			for (let index = node.children.length - 1; index >= 0; index -= 1) {
				const child = node.children[index];

				if (child.type === 'raw' && typeof child.value === 'string') {
					child.value = transformRawHtml(child.value, vfile);
					if (!child.value.trim()) node.children.splice(index, 1);
					continue;
				}

				if (isLdJsonScriptElement(child)) {
					const pruned = pruneJsonLd(textContent(child), vfile);
					if (!pruned) {
						node.children.splice(index, 1);
					} else {
						child.children = [{ type: 'text', value: JSON.stringify(pruned) }];
					}
					continue;
				}

				walk(child);
			}
		}

		walk(tree);
	};
}
