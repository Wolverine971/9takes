<!-- src/lib/components/blog/TableOfContents.svelte -->
<script lang="ts">
	import { onMount, onDestroy, afterUpdate } from 'svelte';
	import { fly } from 'svelte/transition';
	import { writable, type Writable } from 'svelte/store';
	import { browser } from '$app/environment';

	export let contentStore: Writable<string>;
	export let pageUrl: string;

	// Configuration options with defaults
	export let showAtScrollY: number = 1000;
	export let hideBeforeBottom: number = 300;
	export let sidebarWidth: number = 220; // Increased width to accommodate longer text
	export let desktopBreakpoint: number = 1200;
	export let maxTocEntries: number = 24;
	export let title: string = 'Table of Contents';
	export let sidePosition: 'left' | 'right' | 'none' = 'left'; // New prop to control side position
	export let renderMode: 'both' | 'sidebar-only' | 'accordion-only' = 'both'; // Control which version renders

	// Smart format detection thresholds
	const FORMAT_THRESHOLDS = {
		SIMPLE: { maxHeaders: 15, maxDepth: 2 },
		MODERATE: { maxHeaders: 30, maxDepth: 3 },
		COMPLEX: { maxHeaders: 60, maxDepth: 4 },
		DENSE: { maxHeaders: Infinity, maxDepth: 5 }
	};

	let visible = false;
	let windowWidth: number = 0;
	let contentWidth: number = 64 * 16; // 64rem default
	let mainElement: HTMLElement | null = null;
	let toc: string = '';
	let content: string = '';
	let jsonLd: string = '';
	let initialized = false;
	let contentProcessed = false;

	interface TocItem {
		id: string;
		name: string;
		level: number;
		children?: TocItem[];
		collapsed?: boolean;
		visibleChildren?: number;
	}

	interface ContentAnalysis {
		headerLevels: number[];
		primaryStructure: 'single-level' | 'hierarchical' | 'deep-hierarchical';
		contentType: 'faq' | 'guide' | 'types' | 'generic';
		totalHeaders: number;
		minThreshold: number;
		headerSelector: string;
	}

	let expandedSections: Set<string> = new Set();
	let contentAnalysis: ContentAnalysis | null = null;

	// Calculate sidebar position
	$: sidebarPosition = calculateSidebarPosition(windowWidth, contentWidth, sidebarWidth);
	$: showSidebar =
		visible && toc !== '' && windowWidth >= desktopBreakpoint && sidebarPosition !== null;

	function calculateSidebarPosition(winWidth: number, contentW: number, sidebarW: number) {
		// Main content has max-width of 56rem (896px)
		const maxContentWidth = 56 * 16; // 896px
		const actualContentWidth = Math.min(contentW, maxContentWidth);

		if (sidePosition === 'left') {
			// Calculate the left position relative to the main content column
			const mainContentLeft = Math.max((winWidth - actualContentWidth) / 2, 16); // Minimum 16px from edge
			const sidebarLeft = mainContentLeft - sidebarW - 24; // 24px gap from main content

			// If sidebar would be positioned less than 16px from left edge, hide it
			if (sidebarLeft < 16) {
				return null; // Will cause sidebar to hide
			}

			return {
				left: `${sidebarLeft}px`,
				right: undefined
			};
		} else {
			// For right positioning, calculate based on main content position
			const mainContentLeft = (winWidth - actualContentWidth) / 2;
			const mainContentRight = mainContentLeft + actualContentWidth;

			// Position sidebar to the right of main content with 24px gap
			const sidebarLeft = mainContentRight + 24;

			// Check if there's enough space for the sidebar on the right
			if (sidebarLeft + sidebarW > winWidth - 16) {
				return null; // Will cause sidebar to hide
			}

			// Calculate distance from right edge
			const rightPosition = winWidth - sidebarLeft - sidebarW;

			return {
				left: undefined,
				right: `${rightPosition}px`
			};
		}
	}

	function analyzeContent(html: string): ContentAnalysis {
		if (!browser || !html) {
			return {
				headerLevels: [2, 3],
				primaryStructure: 'hierarchical',
				contentType: 'generic',
				totalHeaders: 0,
				minThreshold: 3,
				headerSelector: 'h2, h3'
			};
		}

		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = html;

		// Find all headers H1-H6
		const allHeaders = [...tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6')].filter(
			(heading) => heading.textContent?.trim() !== title
		);

		// Analyze header level distribution
		const headerLevelCounts: { [key: number]: number } = {};
		const headerTexts: string[] = [];

		allHeaders.forEach((header) => {
			const level = parseInt(header.tagName.charAt(1));
			headerLevelCounts[level] = (headerLevelCounts[level] || 0) + 1;
			headerTexts.push(header.textContent?.trim() || '');
		});

		const availableLevels = Object.keys(headerLevelCounts).map(Number).sort();
		const totalHeaders = allHeaders.length;

		// Detect content type
		let contentType: ContentAnalysis['contentType'] = 'generic';

		// FAQ detection - look for question patterns
		const faqPatterns = [
			/^\d+\./, // numbered questions
			/^(what|how|why|when|where|who|can|is|are|do|does|will|would|should)/i,
			/\?$/, // ends with question mark
			/^(🤔|❓|💭|🔍|❗|🎯|😰|🔬)/ // emoji indicators
		];

		const faqMatches = headerTexts.filter((text) =>
			faqPatterns.some((pattern) => pattern.test(text))
		).length;

		if (faqMatches / totalHeaders > 0.4) {
			contentType = 'faq';
		}

		// Types detection - Enneagram type patterns
		const typePatterns = [
			/type\s*[1-9]/i,
			/enneagram\s*[1-9]/i,
			/(perfectionist|helper|achiever|individualist|investigator|loyalist|enthusiast|challenger|peacemaker)/i
		];

		const typeMatches = headerTexts.filter((text) =>
			typePatterns.some((pattern) => pattern.test(text))
		).length;

		if (typeMatches / totalHeaders > 0.5) {
			contentType = 'types';
		}

		// Guide detection - step/process indicators
		const guidePatterns = [
			/^(step\s*\d+|phase\s*\d+|stage\s*\d+)/i,
			/^(day\s*\d+|week\s*\d+)/i,
			/^(how\s+to|guide\s+to)/i
		];

		const guideMatches = headerTexts.filter((text) =>
			guidePatterns.some((pattern) => pattern.test(text))
		).length;

		if (guideMatches / totalHeaders > 0.3) {
			contentType = 'guide';
		}

		// Determine structure type
		let primaryStructure: ContentAnalysis['primaryStructure'] = 'single-level';

		if (availableLevels.length === 1) {
			primaryStructure = 'single-level';
		} else if (availableLevels.length === 2) {
			primaryStructure = 'hierarchical';
		} else if (availableLevels.length >= 3) {
			primaryStructure = 'deep-hierarchical';
		}

		// Determine optimal header selector and minimum threshold
		let headerSelector: string;
		let minThreshold: number;

		if (totalHeaders <= 2) {
			// Very few headers - show them all regardless
			headerSelector = availableLevels.map((level) => `h${level}`).join(', ');
			minThreshold = 1;
		} else if (primaryStructure === 'single-level') {
			// Single level - use whatever level has the most headers
			const dominantLevel = availableLevels.reduce((prev, current) =>
				headerLevelCounts[current] > headerLevelCounts[prev] ? current : prev
			);
			headerSelector = `h${dominantLevel}`;
			minThreshold = Math.min(2, totalHeaders);
		} else if (contentType === 'faq') {
			// FAQ content - be more permissive
			headerSelector = availableLevels
				.slice(0, 2)
				.map((level) => `h${level}`)
				.join(', ');
			minThreshold = 2;
		} else if (contentType === 'types') {
			// Type-based content - usually needs main sections + type headers
			headerSelector = availableLevels
				.slice(0, 2)
				.map((level) => `h${level}`)
				.join(', ');
			minThreshold = 3;
		} else {
			// Default hierarchical approach
			const topTwoLevels = availableLevels.slice(0, 2);
			headerSelector = topTwoLevels.map((level) => `h${level}`).join(', ');
			minThreshold = 3;
		}

		return {
			headerLevels: availableLevels,
			primaryStructure,
			contentType,
			totalHeaders,
			minThreshold,
			headerSelector
		};
	}

	function generateTableOfContents(html: string): { tocHtml: string; tocStructure: TocItem[] } {
		if (!browser || !html) return { tocHtml: '', tocStructure: [] };

		try {
			// Analyze content to get smart configuration
			const analysis = analyzeContent(html);
			contentAnalysis = analysis;

			// First, find the article content container (could be .article-body or #blogA)
			const actualArticleBody =
				document.querySelector('.article-body') || document.querySelector('#blogA');

			let headings: Element[] = [];

			if (actualArticleBody) {
				// Get actual headings from the DOM
				const actualHeadings = [
					...actualArticleBody.querySelectorAll(analysis.headerSelector)
				].filter((heading) => heading.textContent?.trim() !== title);

				// Set IDs on actual DOM elements
				actualHeadings.forEach((heading) => {
					if (!heading.id) {
						const headingText = heading.textContent?.trim() || 'Untitled Section';
						const id = `toc-${headingText
							.toLowerCase()
							.replace(/[^\w\s-]/g, '')
							.replace(/\s+/g, '-')}`;
						heading.id = id;
					}
				});

				headings = actualHeadings;
			} else {
				// Fallback: parse from HTML string if DOM elements not found
				const tempDiv = document.createElement('div');
				tempDiv.innerHTML = html;

				headings = [...tempDiv.querySelectorAll(analysis.headerSelector)].filter(
					(heading) => heading.textContent?.trim() !== title
				);

				// Generate IDs for these temporary elements (won't persist to actual DOM)
				headings.forEach((heading) => {
					if (!heading.id) {
						const headingText = heading.textContent?.trim() || 'Untitled Section';
						const id = `toc-${headingText
							.toLowerCase()
							.replace(/[^\w\s-]/g, '')
							.replace(/\s+/g, '-')}`;
						heading.id = id;
					}
				});
			}

			if (headings.length < analysis.minThreshold) {
				return { tocHtml: '', tocStructure: [] };
			}

			const list = document.createElement('ul');
			list.className = 'toc-list';

			// Build hierarchical structure based on content analysis
			let tocStructure: TocItem[] = [];
			let parentStack: { item: TocItem; element: HTMLLIElement; level: number }[] = [];

			headings.forEach((heading) => {
				const level = parseInt(heading.tagName.charAt(1));
				const listItem = document.createElement('li');
				listItem.className = `toc-item toc-level-${heading.tagName.toLowerCase()}`;
				const link = document.createElement('a');

				// Handle empty headings
				const headingText = heading.textContent?.trim() || 'Untitled Section';
				const displayText = headingText;

				// Use the ID that was already set on the actual DOM element
				const id = heading.id;

				link.href = `#${id}`;
				link.textContent = displayText;
				link.className = 'toc-link';
				link.setAttribute('title', headingText);

				listItem.appendChild(link);

				const tocItem: TocItem = {
					id,
					name: headingText,
					level
				};

				// Handle hierarchical structure based on analysis
				if (analysis.primaryStructure === 'single-level') {
					// Flat structure - all items at top level
					list.appendChild(listItem);
					tocStructure.push(tocItem);
				} else {
					// Hierarchical structure - build nested structure
					// Remove items from stack that are at same or higher level
					while (parentStack.length > 0 && parentStack[parentStack.length - 1].level >= level) {
						parentStack.pop();
					}

					if (parentStack.length === 0) {
						// Top level item
						list.appendChild(listItem);
						tocStructure.push(tocItem);
						parentStack.push({ item: tocItem, element: listItem, level });
					} else {
						// Child item
						const parent = parentStack[parentStack.length - 1];

						// Create or find sub-list in parent
						let subList = parent.element.querySelector('ul');
						if (!subList) {
							subList = document.createElement('ul');
							subList.className = 'toc-sublist';
							parent.element.appendChild(subList);
						}

						subList.appendChild(listItem);

						// Add to parent's children array
						if (!parent.item.children) {
							parent.item.children = [];
						}
						parent.item.children.push(tocItem);

						// Add to parent stack if this could have children
						if (analysis.primaryStructure === 'deep-hierarchical') {
							parentStack.push({ item: tocItem, element: listItem, level });
						}
					}
				}
			});

			// Apply entry limits based on content type and maxTocEntries
			const totalEntries = headings.length;
			if (totalEntries > maxTocEntries) {
				// For content types that benefit from more entries, be more generous
				const adjustedMax =
					analysis.contentType === 'faq' || analysis.contentType === 'types'
						? maxTocEntries + 6
						: maxTocEntries;

				if (totalEntries > adjustedMax) {
					// Truncate excess entries - remove from bottom of list
					const excessCount = totalEntries - adjustedMax;
					const listItems = list.querySelectorAll('.toc-item');
					for (let i = listItems.length - excessCount; i < listItems.length; i++) {
						listItems[i].remove();
					}

					// Also truncate the structure array to match
					function truncateStructure(items: TocItem[], maxItems: number): TocItem[] {
						if (items.length <= maxItems) return items;

						let count = 0;
						const result: TocItem[] = [];

						for (const item of items) {
							if (count >= maxItems) break;

							const itemCopy = { ...item };
							count++;

							if (item.children) {
								const remainingSlots = maxItems - count;
								if (remainingSlots > 0) {
									itemCopy.children = truncateStructure(item.children, remainingSlots);
									count += itemCopy.children.length;
								} else {
									delete itemCopy.children;
								}
							}

							result.push(itemCopy);
						}

						return result;
					}

					tocStructure = truncateStructure(tocStructure, adjustedMax);
				}
			}

			return { tocHtml: list.outerHTML, tocStructure };
		} catch (error) {
			console.error('Error generating table of contents:', error);
			return { tocHtml: '', tocStructure: [] };
		}
	}

	function generateJsonLd(tocStructure: TocItem[], url: string): string {
		if (!tocStructure.length) return '';

		const jsonLd = {
			'@context': 'https://schema.org',
			'@type': 'Article',
			mainEntityOfPage: {
				'@type': 'WebPage',
				'@id': url
			},
			about: tocStructure.map((item) => ({
				'@type': 'Thing',
				name: item.name,
				description: item.children ? item.children.map((child) => child.name).join(', ') : undefined
			}))
		};

		return JSON.stringify(jsonLd, null, 2);
	}

	function handleScroll() {
		if (!browser) return;

		const scrollPosition = window.scrollY;
		const pageHeight = document.documentElement.scrollHeight;
		const windowHeight = window.innerHeight;
		const distanceFromBottom = pageHeight - (scrollPosition + windowHeight);

		visible = scrollPosition > showAtScrollY && distanceFromBottom > hideBeforeBottom;
	}

	function handleResize() {
		if (!browser) return;

		windowWidth = window.innerWidth;

		// Find the main content element and get its width
		if (!mainElement) {
			mainElement =
				document.querySelector('main.column-width') ||
				document.querySelector('main') ||
				document.querySelector('.blog');
		}

		if (mainElement) {
			// Get the actual computed width of the main content
			contentWidth = mainElement.getBoundingClientRect().width;
		}

		handleScroll();
	}

	function handleTocClick(e: MouseEvent) {
		// Handle smooth scrolling when clicking TOC links
		if (e.target instanceof HTMLAnchorElement && e.target.hash) {
			const targetId = e.target.hash.substring(1);
			const targetElement = document.getElementById(targetId);

			if (targetElement) {
				e.preventDefault();
				// For mobile devices, close the accordion after clicking
				if (windowWidth < desktopBreakpoint) {
					const details = document.querySelector('.toc-accordion');
					if (details instanceof HTMLDetailsElement) details.open = false;
				}

				// Scroll with a small offset to account for sticky headers
				const headerOffset = 80;
				const elementPosition = targetElement.getBoundingClientRect().top;
				const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

				window.scrollTo({
					top: offsetPosition,
					behavior: 'smooth'
				});
			}
		}
	}

	function processContent() {
		if (!browser || !content) return;

		// If we have content but the TOC is empty or not processed yet
		if (content && !contentProcessed) {
			const { tocHtml, tocStructure } = generateTableOfContents(content);

			if (tocHtml) {
				toc = tocHtml;
				jsonLd = generateJsonLd(tocStructure, pageUrl);
				contentProcessed = true;
			} else if (!initialized) {
				// If first attempt failed, try with a delay to ensure DOM is fully loaded
				setTimeout(() => {
					const { tocHtml, tocStructure } = generateTableOfContents(content);
					toc = tocHtml;
					jsonLd = generateJsonLd(tocStructure, pageUrl);
					contentProcessed = true;
				}, 1000);
			}

			initialized = true;
		}
	}

	// Add active state tracking for TOC links
	function updateActiveTocLink() {
		if (!browser || !contentAnalysis) return;

		// Get all headings using the dynamic selector and TOC links
		const headings = Array.from(document.querySelectorAll(`${contentAnalysis.headerSelector}[id]`));
		const tocLinks = document.querySelectorAll('.toc-link');

		if (!headings.length || !tocLinks.length) return;

		// Find the heading that's currently visible
		let activeHeading = null;
		for (let i = 0; i < headings.length; i++) {
			const heading = headings[i];
			const rect = heading.getBoundingClientRect();

			// Consider a heading as active if it's close to the top of the viewport
			if (rect.top <= 100) {
				activeHeading = heading;
			} else {
				break;
			}
		}

		// Remove active class from all links
		tocLinks.forEach((link) => link.classList.remove('active'));

		// Add active class to the matching link
		if (activeHeading) {
			const activeId = activeHeading.id;
			const activeLink = document.querySelector(`.toc-link[href="#${activeId}"]`);
			if (activeLink) {
				activeLink.classList.add('active');
			}
		}
	}

	// Process content whenever it changes
	$: if (content && content !== '') {
		processContent();
	}

	onMount(() => {
		if (browser) {
			window.addEventListener('scroll', handleScroll);
			window.addEventListener('resize', handleResize);
			window.addEventListener('scroll', updateActiveTocLink);

			// Initial setup
			handleResize();

			// Add event listener for TOC clicks
			document.addEventListener('click', handleTocClick);

			// If we already have content from a previous subscription, process it
			if (content) {
				processContent();
			}
		}
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('scroll', updateActiveTocLink);
			document.removeEventListener('click', handleTocClick);
		}
	});

	// Subscribe to content changes
	contentStore.subscribe((value) => {
		if (value && value !== content) {
			content = value;
			contentProcessed = false; // Reset processing flag for new content
		}
	});

	afterUpdate(() => {
		if (content && !contentProcessed) {
			processContent();
		}
	});
</script>

{#if showSidebar && sidebarPosition && (renderMode === 'both' || renderMode === 'sidebar-only')}
	<aside
		class="toc-sidebar"
		style="{sidebarPosition.left
			? `left: ${sidebarPosition.left}`
			: `right: ${sidebarPosition.right}`};"
		transition:fly={{ x: sidePosition === 'left' ? -100 : 100, duration: 300 }}
		aria-label="Table of contents navigation"
	>
		<nav>
			<h3 class="toc-title">{title}</h3>
			{@html toc}
		</nav>
	</aside>
{/if}

{#if toc && (renderMode === 'both' || renderMode === 'accordion-only')}
	<details class="toc-accordion" open>
		<summary class="toc-summary">{title}</summary>
		<div class="toc-accordion-content">
			{@html toc}
		</div>
	</details>
{/if}

<svelte:head>
	{#if jsonLd}
		{@html `<script type="application/ld+json">${jsonLd}</script>`}
	{/if}
</svelte:head>

<style lang="scss">
	.toc-sidebar {
		/* Card base styles */
		background-color: var(--card-background);
		border-radius: var(--border-radius-lg);
		box-shadow: var(--shadow-sm);
		border: 1px solid var(--border-color);

		position: fixed;
		top: 50%;
		transform: translateY(-50%);
		width: 220px;
		font-size: var(--font-size-sm);
		line-height: var(--line-height-tight);
		max-width: 14rem;
		z-index: 30;
		max-height: 70vh;
		overflow-y: auto;
		overflow-x: hidden;

		/* Custom scrollbar */
		&::-webkit-scrollbar {
			width: 6px;
		}

		&::-webkit-scrollbar-track {
			background: transparent;
		}

		&::-webkit-scrollbar-thumb {
			background-color: rgba(0, 0, 0, 0.2);
			border-radius: 3px;

			&:hover {
				background-color: rgba(0, 0, 0, 0.3);
			}
		}

		nav {
			width: 100%;
			padding: 0.75rem;
		}
	}

	.toc-title {
		margin: 0 0 0.75rem 0;
		padding: 0 0 0.5rem 0;
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-semibold);
		color: var(--text-primary);
		border-bottom: 1px solid var(--border-color);
	}

	.toc-accordion {
		/* Card base styles */
		background-color: var(--card-background);
		border-radius: var(--border-radius-lg);
		box-shadow: var(--shadow-sm);
		border: 1px solid var(--border-color);

		margin: 1.5rem 0;
		overflow: hidden;
	}

	.toc-summary {
		font-weight: var(--font-weight-semibold);
		font-size: var(--font-size-lg);
		padding: 1rem 1.25rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		outline: none;
		color: var(--text-primary);
		background-color: var(--neutral-50);
		transition: var(--transition-base);
		border-bottom: 1px solid var(--border-color);

		&::-webkit-details-marker {
			display: none;
		}

		&::before {
			content: '▶';
			display: inline-block;
			margin-right: 0.75rem;
			font-size: var(--font-size-sm);
			transition: var(--transition-base);
			color: var(--primary);
		}

		&:hover {
			color: var(--primary);
			background-color: var(--accent-light);
		}
	}

	/* Rotate arrow when open */
	:global(details[open]) .toc-summary::before {
		transform: rotate(90deg);
	}

	.toc-accordion-content {
		padding: 1rem 1.25rem;
		background-color: var(--card-background);
	}

	/* Global styles for ToC elements */
	:global(.toc-list),
	:global(.toc-sublist) {
		list-style-type: none;
		padding-left: 0;
		margin: 0;
		width: 100%;
		max-width: 100%;
		box-sizing: border-box;
	}

	:global(.toc-sublist) {
		padding-left: 1rem;
		margin-top: 0.25rem;
		border-left: 2px solid var(--border-color);
		margin-left: 0.5rem;
	}

	:global(.toc-item) {
		margin-bottom: 0.35rem;
		width: 100%;
		max-width: 100%;
		position: relative;
	}

	:global(.toc-level-h1) {
		padding-left: 0;
		margin-top: 0.75rem;
		padding-right: 4px;
		font-weight: var(--font-weight-bold);
		font-size: var(--font-size-base);
	}

	:global(.toc-level-h2) {
		padding-left: 0;
		margin-top: 0.5rem;
		padding-right: 4px;
		font-weight: var(--font-weight-semibold);
		font-size: var(--font-size-sm);
	}

	:global(.toc-level-h3) {
		padding-left: 0.25rem;
		padding-right: 4px;
		font-size: var(--font-size-sm);
		opacity: 0.9;
	}

	:global(.toc-level-h4) {
		padding-left: 0.5rem;
		padding-right: 4px;
		font-size: var(--font-size-xs);
		opacity: 0.85;
		font-weight: var(--font-weight-normal);
	}

	:global(.toc-level-h5) {
		padding-left: 0.75rem;
		padding-right: 4px;
		font-size: var(--font-size-xs);
		opacity: 0.8;
		font-weight: var(--font-weight-normal);
	}

	:global(.toc-level-h6) {
		padding-left: 1rem;
		padding-right: 4px;
		font-size: var(--font-size-xs);
		opacity: 0.75;
		font-weight: var(--font-weight-normal);
	}

	:global(.toc-link) {
		display: block !important;
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		padding: 0.35rem 0.5rem;
		padding-right: 8px;
		box-sizing: border-box;
		font-size: var(--font-size-sm);
		line-height: var(--line-height-relaxed);
		color: var(--text-secondary);
		text-decoration: none;
		border-radius: var(--border-radius-sm);
		transition: var(--transition-base);

		&:hover {
			color: var(--primary);
			background-color: var(--accent-light);
			text-decoration: none;
		}

		/* Hide the arrow that blog adds to links */
		&::after {
			content: none !important;
			display: none !important;
		}
	}

	:global(.toc-link.active) {
		font-weight: var(--font-weight-semibold);
		color: var(--primary-dark);
		background-color: var(--accent-light);
	}

	/* Responsive adjustments */
	@media (max-width: 1200px) {
		.toc-sidebar {
			display: none;
		}
	}

	/* Mobile accordion improvements */
	@media (max-width: 768px) {
		.toc-accordion {
			margin: 1rem 0;
		}

		.toc-summary {
			padding: 0.875rem 1rem;
			font-size: var(--font-size-base);
		}

		.toc-accordion-content {
			padding: 0.875rem 1rem;
		}

		:global(.toc-link) {
			padding: 0.5rem;
			font-size: var(--font-size-sm);
		}
	}
</style>
