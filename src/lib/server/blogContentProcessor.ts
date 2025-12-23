// src/lib/server/blogContentProcessor.ts
// Server-only module for processing blog content with marked
// This keeps the marked library out of the client bundle

import { marked } from 'marked';

interface Placeholder {
	id: string;
	type: string;
	props: Record<string, any>;
}

interface ProcessedContent {
	content: string;
	placeholders: Placeholder[];
}

// Component tags that can appear in blog content
const COMPONENT_TAGS = ['PopCard', 'BlogPurpose', 'MarqueeHorizontal', 'QuickAnswer'];

/**
 * Process blog markdown content into HTML with component placeholders
 * This function runs server-side only to keep marked out of client bundle
 */
export async function processBlogContent(content: string): Promise<ProcessedContent> {
	if (!content) {
		return { content: '', placeholders: [] };
	}

	// Parse markdown to HTML
	let htmlContent = await marked.parse(content);

	// Initialize placeholders array
	const placeholders: Placeholder[] = [];

	// Replace component tags with placeholders
	COMPONENT_TAGS.forEach((tag) => {
		// Use regex that can match self-closing tags too
		const regex = new RegExp(`<${tag}([^>]*)(?:>([\\s\\S]*?)<\\/${tag}>|\\/>)`, 'g');

		htmlContent = htmlContent.replace(regex, (_match, props, children = '') => {
			const id = `component-${placeholders.length}`;
			const propsObj = parseProps(props);

			// Add children content if any
			if (children.trim()) {
				propsObj.children = children;
			}

			placeholders.push({
				id,
				type: tag,
				props: propsObj
			});

			return `<div id="${id}" style="width:100%; display: flex; justify-content: center;"></div>`;
		});
	});

	// Insert BlogPurpose component before the last h2 tag
	const h2Regex = /<h2[^>]*>.*?<\/h2>/g;
	const h2Matches = [...htmlContent.matchAll(h2Regex)];

	if (h2Matches.length > 0) {
		// Find the last h2 tag
		const lastH2Match = h2Matches[h2Matches.length - 1];
		const lastH2Index = lastH2Match.index;

		if (lastH2Index !== undefined) {
			// Generate a unique id for the BlogPurpose component
			const blogPurposeId = `component-purpose-${Date.now()}`;

			// Insert placeholder div before the last h2 tag
			htmlContent =
				htmlContent.substring(0, lastH2Index) +
				`<div id="${blogPurposeId}"></div>` +
				htmlContent.substring(lastH2Index);

			// Add the BlogPurpose component to placeholders for mounting
			placeholders.push({
				id: blogPurposeId,
				type: 'BlogPurpose',
				props: {}
			});
		}
	}

	return { content: htmlContent, placeholders };
}

/**
 * Parse props from HTML attribute string
 */
function parseProps(propsString: string): Record<string, any> {
	const props: Record<string, any> = {};

	// Match props with values (handles quotes better)
	const propMatches = propsString.matchAll(/\s+([a-zA-Z0-9_]+)=["']([^"']*)["']/g);
	for (const match of propMatches) {
		props[match[1]] = match[2];
	}

	// Handle curly brace values like {true}
	const curlyPropMatches = propsString.matchAll(/\s+([a-zA-Z0-9_]+)=\{([^}]*)\}/g);
	for (const match of curlyPropMatches) {
		try {
			// Try to parse as JSON if possible
			props[match[1]] = JSON.parse(match[2]);
		} catch (e) {
			// Otherwise use the raw string
			props[match[1]] = match[2];
		}
	}

	// Match boolean props
	const boolProps = propsString.matchAll(/\s+([a-zA-Z0-9_]+)(?=\s|$)/g);
	for (const match of boolProps) {
		if (!props[match[1]]) {
			props[match[1]] = true;
		}
	}

	return props;
}
