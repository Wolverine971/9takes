// src/lib/server/blogContentProcessor.ts
// Server-only module for processing blog content with marked
// This keeps the marked library out of the client bundle

import { marked, type Tokens } from 'marked';
import { getBlogEvidenceMedia } from '$lib/blogEvidenceMedia';
import { getDJPersonalityRead } from '$lib/data/djPersonalityReads';

interface Placeholder {
	id: string;
	type: string;
	props: Record<string, any>;
}

interface TocHeading {
	level: number;
	text: string;
	id: string;
}

interface ProcessedContent {
	content: string;
	placeholders: Placeholder[];
	headings: TocHeading[];
}

type ProcessBlogContentOptions = {
	popCardImageTreatment?: 'default' | 'personality';
};

type PlaceholderFallbackInput = {
	id: string;
	type: string;
	props: Record<string, any>;
	children?: string;
};

/**
 * Generate a URL-friendly slug from heading text.
 * Matches the behavior of rehype-slug used for MDsvex content.
 */
function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/<[^>]*>/g, '') // strip HTML tags
		.replace(/[^\w\s-]/g, '') // remove non-word chars
		.replace(/\s+/g, '-') // spaces to hyphens
		.replace(/-+/g, '-') // collapse multiple hyphens
		.replace(/^-|-$/g, ''); // trim leading/trailing hyphens
}

// Component tags that can appear in blog content
const COMPONENT_TAGS = [
	'PopCard',
	'BlogPurpose',
	'MarqueeHorizontal',
	'QuickAnswer',
	'EvidenceFigure',
	'DJReadCard'
];

/**
 * Process blog markdown content into HTML with component placeholders
 * This function runs server-side only to keep marked out of client bundle
 */
export async function processBlogContent(
	content: string,
	options: ProcessBlogContentOptions = {}
): Promise<ProcessedContent> {
	if (!content) {
		return { content: '', placeholders: [], headings: [] };
	}

	// Create renderer per-call to safely collect headings for concurrent requests
	const headings: TocHeading[] = [];
	const renderer = new marked.Renderer();
	renderer.heading = function ({ text, depth }: Tokens.Heading) {
		const id = slugify(text);
		headings.push({ level: depth, text, id });
		return `<h${depth} id="${id}">${text}</h${depth}>\n`;
	};

	// Parse markdown to HTML with custom renderer that adds IDs to headings
	let htmlContent = await marked.parse(content, { renderer });

	// Initialize placeholders array
	const placeholders: Placeholder[] = [];
	const placeholderCounts = new Map<string, number>();

	function nextPlaceholderId(tag: string): string {
		const normalizedTag = tag.toLowerCase().replace(/[^a-z0-9-]/g, '-');
		const count = placeholderCounts.get(normalizedTag) ?? 0;
		placeholderCounts.set(normalizedTag, count + 1);
		return `component-${normalizedTag}-${count}`;
	}

	// Replace component tags with placeholders
	COMPONENT_TAGS.forEach((tag) => {
		// Use regex that can match self-closing tags too
		const regex = new RegExp(`<${tag}([^>]*)(?:>([\\s\\S]*?)<\\/${tag}>|\\/>)`, 'g');

		htmlContent = htmlContent.replace(regex, (_match, props, children = '') => {
			const id = nextPlaceholderId(tag);
			const propsObj = parseProps(props);
			if (tag === 'PopCard' && !propsObj.imageTreatment && options.popCardImageTreatment) {
				propsObj.imageTreatment = options.popCardImageTreatment;
			}

			// Add children content if any
			if (children.trim()) {
				propsObj.children = children;
			}

			placeholders.push({
				id,
				type: tag,
				props: propsObj
			});

			return renderComponentPlaceholder({
				id,
				type: tag,
				props: propsObj,
				children
			});
		});
	});

	// Insert BlogPurpose component before the last h2 tag
	const h2Regex = /<h2[^>]*>.*?<\/h2>/g;
	const h2Matches = [...htmlContent.matchAll(h2Regex)];

	if (
		h2Matches.length > 0 &&
		!placeholders.some((placeholder) => placeholder.type === 'BlogPurpose')
	) {
		// Find the last h2 tag
		const lastH2Match = h2Matches[h2Matches.length - 1];
		const lastH2Index = lastH2Match.index;

		if (lastH2Index !== undefined) {
			// Generate a stable id for cacheable SSR output.
			const blogPurposeId = nextPlaceholderId('BlogPurpose');

			// Insert placeholder div before the last h2 tag
			htmlContent =
				htmlContent.substring(0, lastH2Index) +
				renderComponentPlaceholder({
					id: blogPurposeId,
					type: 'BlogPurpose',
					props: {}
				}) +
				htmlContent.substring(lastH2Index);

			// Add the BlogPurpose component to placeholders for mounting
			placeholders.push({
				id: blogPurposeId,
				type: 'BlogPurpose',
				props: {}
			});
		}
	}

	return { content: htmlContent, placeholders, headings };
}

function renderComponentPlaceholder({
	id,
	type,
	props,
	children = ''
}: PlaceholderFallbackInput): string {
	const fallbackHtml = renderComponentFallback(type, props, children);
	const fallback = fallbackHtml ? `<div data-ssr-fallback="">${fallbackHtml}</div>` : '';

	return `<div id="${escapeHtmlAttribute(id)}" data-component-placeholder="${escapeHtmlAttribute(type)}" style="width:100%; display: flex; justify-content: center;">${fallback}</div>`;
}

function renderComponentFallback(
	type: string,
	props: Record<string, any>,
	children: string
): string {
	switch (type) {
		case 'QuickAnswer':
			return renderQuickAnswerFallback(props, children);
		case 'BlogPurpose':
			return renderBlogPurposeFallback();
		case 'PopCard':
			return renderPopCardFallback(props);
		case 'EvidenceFigure':
			return renderEvidenceFigureFallback(props);
		case 'DJReadCard':
			return renderDJReadCardFallback(props);
		default:
			return normalizeFallbackContent(children);
	}
}

function renderDJReadCardFallback(props: Record<string, any>): string {
	const readId = stringProp(props.readId).trim();
	const read = getDJPersonalityRead(readId);
	if (!read) return '';

	const claimsHtml = read.claims
		.map(
			(claim) => `<li>
		<h4>${escapeHtml(claim.label)}</h4>
		<p>${escapeHtml(claim.compactConnection)}</p>
	</li>`
		)
		.join('');
	const headingId = `dj-read-${read.id}`;

	return `<section class="dj-read dj-read--ssr" aria-labelledby="${escapeHtmlAttribute(headingId)}" data-dj-read-id="${escapeHtmlAttribute(read.id)}">
	<header class="dj-read__header">
		<div><p class="dj-read__eyebrow">DJ'S READ &middot; FIRST-HAND REASONING</p><h3 id="${escapeHtmlAttribute(headingId)}">${escapeHtml(read.person)}</h3></div>
		<span class="dj-read__type">${escapeHtml(read.proposedType)}</span>
	</header>
	<div class="dj-read__meta" aria-label="Reasoning summary">
		<p><span>Confidence</span><strong>${escapeHtml(read.confidence)}</strong></p>
		<p><span>Strongest alternative</span><strong>${escapeHtml(read.strongestAlternative)}</strong></p>
	</div>
	<p class="dj-read__thesis">${escapeHtml(read.thesis)}</p>
	<ol class="dj-read__connections">${claimsHtml}</ol>
	<div class="dj-read__hesitation"><span>What makes me hesitate</span><p>${escapeHtml(read.compactHesitation)}</p></div>
	<a class="dj-read__link" href="#${escapeHtmlAttribute(read.reasoningAnchor)}">See the evidence and full reasoning</a>
</section>`;
}

function renderEvidenceFigureFallback(props: Record<string, any>): string {
	const evidenceId = stringProp(props.evidenceId).trim();
	const evidence = getBlogEvidenceMedia(evidenceId);
	if (!evidence) return '';

	const portraitSide = evidence.presentation?.portrait_side ?? 'left';
	const evidenceVariant =
		evidence.presentation?.variant ?? (evidence.kind === 'moment' ? 'feature' : 'portrait');
	const classes = [
		'blog-evidence',
		`blog-evidence--${evidenceVariant}`,
		evidenceVariant === 'portrait' && portraitSide === 'right'
			? 'blog-evidence--portrait-right'
			: '',
		'blog-evidence--ssr'
	]
		.filter(Boolean)
		.join(' ');
	const imageCreditLabel =
		evidence.image.rights.status === 'fair-use'
			? `${evidence.image.rights.creator} / ${evidence.image.source.publisher ?? 'source'} · editorial fair use`
			: evidence.image.rights.attribution;
	const speakerHtml = evidence.quote
		? `<p class="blog-evidence__speaker${evidenceVariant === 'compact' ? ' blog-evidence__speaker--lead' : ''}"><strong>${escapeHtml(evidence.quote.speaker)}</strong>${
				evidence.quote.speaker_role ? `<span>${escapeHtml(evidence.quote.speaker_role)}</span>` : ''
			}</p>`
		: '';
	const quoteHtml = evidence.quote
		? `${evidenceVariant === 'compact' ? speakerHtml : ''}<blockquote class="blog-evidence__quote"><p>&ldquo;${escapeHtml(evidence.quote.text)}&rdquo;</p></blockquote>${evidenceVariant === 'compact' ? '' : speakerHtml}`
		: evidence.caption
			? `<p class="blog-evidence__caption">${escapeHtml(evidence.caption)}</p>`
			: '';
	const quoteSourceHtml = evidence.quote
		? `<a href="${escapeHtmlAttribute(evidence.quote.source.url)}" target="_blank" rel="noopener noreferrer">Source: ${escapeHtml(evidence.quote.source.name)}</a>`
		: '';
	const licenseHtml =
		evidence.image.rights.license && evidence.image.rights.license_url
			? ` &middot; <a href="${escapeHtmlAttribute(evidence.image.rights.license_url)}" target="_blank" rel="license noopener">${escapeHtml(evidence.image.rights.license)}</a>`
			: '';
	const modificationsHtml = evidence.image.rights.modifications.length
		? ` <span>&middot; ${escapeHtml(evidence.image.rights.modifications.join(', '))}</span>`
		: '';

	return `<figure class="${classes}" data-evidence-id="${escapeHtmlAttribute(evidence.id)}" data-rights-status="${escapeHtmlAttribute(evidence.image.rights.status)}">
	<div class="blog-evidence__media"><img src="${escapeHtmlAttribute(evidence.image.src)}" alt="${escapeHtmlAttribute(evidence.image.alt)}" width="${evidence.image.width}" height="${evidence.image.height}" loading="lazy" decoding="async" style="object-position:${escapeHtmlAttribute(evidence.image.object_position ?? '50% 50%')}" /></div>
	<figcaption class="blog-evidence__body">
		${evidenceVariant !== 'compact' ? `<p class="blog-evidence__label">${escapeHtml(evidence.label)}</p>` : ''}
		${quoteHtml}
		${evidence.context ? `<p class="blog-evidence__context">${escapeHtml(evidence.context)}</p>` : ''}
		<div class="blog-evidence__sources">${quoteSourceHtml}<span class="blog-evidence__image-credit">Photo: <a href="${escapeHtmlAttribute(evidence.image.source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(imageCreditLabel)}</a>${licenseHtml}${modificationsHtml}</span></div>
	</figcaption>
</figure>`;
}

function renderQuickAnswerFallback(props: Record<string, any>, children: string): string {
	const question = stringProp(props.question).trim();
	const content = normalizeFallbackContent(children);

	if (!question && !content) return '';

	return `<aside class="quick-answer quick-answer--ssr" itemscope itemtype="https://schema.org/Question">
	<div class="quick-answer__header">
		<span class="quick-answer__label">Quick Answer</span>
	</div>
	${question ? `<p class="quick-answer__question" itemprop="name">${escapeHtml(question)}</p>` : ''}
	<div itemprop="acceptedAnswer" itemscope itemtype="https://schema.org/Answer">
		<div class="quick-answer__content" itemprop="text">${content}</div>
	</div>
</aside>`;
}

function renderBlogPurposeFallback(): string {
	return `<aside class="blog-purpose blog-purpose--ssr" aria-label="Why 9takes exists">
	<div class="blog-purpose__summary">
		<h3>The fight that started 9takes</h3>
		<p>My wife and I were newlyweds having the same fight on repeat, until she said, &ldquo;DJ, you need to take a personality test.&rdquo; Turns out I didn&rsquo;t understand her fear and she didn&rsquo;t understand my anger. 9takes is the site I wish we&rsquo;d had: one situation, nine takes.</p>
		<p><a href="/community/inspiration-for-9takes">Read the origin story</a></p>
	</div>
	<div class="blog-purpose__summary">
		<h3>Explore the 9 Enneagram Types</h3>
		<p>Use the type guides to compare core motivations, fears, and social patterns.</p>
	</div>
</aside>`;
}

function renderPopCardFallback(props: Record<string, any>): string {
	const image = stringProp(props.image).trim();
	const displayText = stringProp(props.displayText).trim();
	const altText = stringProp(props.altText).trim() || displayText;
	const subtext = stringProp(props.subtext).trim();
	const personalityTreatment = props.imageTreatment === 'personality';
	const figureClasses = [
		'pop-card',
		'pop-card--ssr',
		personalityTreatment ? 'personality-portrait-well' : ''
	]
		.filter(Boolean)
		.join(' ');
	const imageClass = personalityTreatment ? ' class="personality-portrait-image"' : '';

	if (!image && !displayText && !subtext) return '';

	return `<figure class="${figureClasses}">
	${image ? `<img${imageClass} src="${escapeHtmlAttribute(image)}" alt="${escapeHtmlAttribute(altText)}" loading="lazy" decoding="async" />` : ''}
	${displayText || subtext ? `<figcaption>${displayText ? `<strong>${escapeHtml(displayText)}</strong>` : ''}${subtext ? `<span>${escapeHtml(subtext)}</span>` : ''}</figcaption>` : ''}
</figure>`;
}

function normalizeFallbackContent(content: string): string {
	const trimmed = content.trim();
	if (!trimmed) return '';

	if (
		/<(?:p|ul|ol|li|blockquote|div|h[1-6]|table|figure|details|summary|a|strong|em)\b/i.test(
			trimmed
		)
	) {
		return trimmed;
	}

	return `<p>${trimmed}</p>`;
}

function stringProp(value: unknown): string {
	return typeof value === 'string' ? value : value == null ? '' : String(value);
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function escapeHtmlAttribute(value: string): string {
	return escapeHtml(value).replace(/`/g, '&#96;');
}

/**
 * Parse props from HTML attribute string
 */
function parseProps(propsString: string): Record<string, any> {
	const props: Record<string, any> = {};
	const quotedAttrPattern = /\s+([a-zA-Z0-9_:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
	const curlyAttrPattern = /\s+([a-zA-Z0-9_:-]+)\s*=\{([^}]*)\}/g;

	// Match quoted props without treating apostrophes inside double-quoted
	// values as delimiters.
	const propMatches = propsString.matchAll(quotedAttrPattern);
	for (const match of propMatches) {
		props[match[1]] = match[2] ?? match[3] ?? '';
	}

	// Handle curly brace values like {true}
	const curlyPropMatches = propsString.matchAll(curlyAttrPattern);
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
	const boolSource = propsString.replace(quotedAttrPattern, ' ').replace(curlyAttrPattern, ' ');
	const boolProps = boolSource.matchAll(/\s+([a-zA-Z0-9_:-]+)(?=\s|$)/g);
	for (const match of boolProps) {
		if (!(match[1] in props)) {
			props[match[1]] = true;
		}
	}

	return props;
}
