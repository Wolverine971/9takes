// src/lib/rehype-extract-headings.js
/**
 * Rehype plugin that extracts heading data (h2-h6) from the HAST tree
 * and injects it into MDsvex module metadata as `headings`.
 *
 * Must run AFTER rehype-slug so heading IDs are already assigned.
 *
 * Result: `post.metadata.headings` becomes available in +page.ts loaders,
 * enabling server-side rendering of the Table of Contents.
 */

/**
 * @typedef {{ type: string, tagName?: string, properties?: Record<string, any>, children?: HastNode[], value?: string }} HastNode
 * @typedef {{ data: { fm?: Record<string, any> } }} VFile
 */

/** @returns {(tree: HastNode, vfile: VFile) => void} */
export default function rehypeExtractHeadings() {
	return (/** @type {HastNode} */ tree, /** @type {VFile} */ vfile) => {
		/** @type {{ level: number, text: string, id: string }[]} */
		const headings = [];

		walk(tree);

		if (!vfile.data.fm) vfile.data.fm = {};
		vfile.data.fm.headings = headings;

		/** @param {HastNode} node */
		function walk(node) {
			if (node.type === 'element' && node.tagName && /^h[2-6]$/.test(node.tagName)) {
				headings.push({
					level: parseInt(node.tagName.charAt(1)),
					text: getTextContent(node),
					id: (node.properties && node.properties.id) || ''
				});
			}
			if (node.children) {
				for (const child of node.children) {
					walk(child);
				}
			}
		}

		/** @param {HastNode} node @returns {string} */
		function getTextContent(node) {
			if (node.type === 'text') return node.value || '';
			if (node.children) return node.children.map(getTextContent).join('');
			return '';
		}
	};
}
