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
		children?: TocItem[];
	}

	// Calculate sidebar position
	$: sidebarPosition = calculateSidebarPosition(windowWidth, contentWidth, sidebarWidth);
	$: showSidebar =
		visible && toc !== '' && windowWidth >= desktopBreakpoint && sidebarPosition !== null;

	function calculateSidebarPosition(winWidth: number, contentW: number, sidebarW: number) {
		// Calculate the left position relative to the main content column
		const mainContentLeft = Math.max((winWidth - contentW) / 2, 16); // Minimum 16px from edge
		const sidebarLeft = mainContentLeft - sidebarW - 24; // 24px gap from main content

		// If sidebar would be positioned less than 16px from left edge, hide it
		if (sidebarLeft < 16) {
			return null; // Will cause sidebar to hide
		}

		return {
			left: `${sidebarLeft}px`
		};
	}

	function generateTableOfContents(html: string): { tocHtml: string; tocStructure: TocItem[] } {
		if (!browser || !html) return { tocHtml: '', tocStructure: [] };

		try {
			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = html;

			const headings = [...tempDiv.querySelectorAll('h2, h3')].filter(
				(heading) => heading.textContent?.trim() !== title
			);

			if (headings.length === 0) {
				return { tocHtml: '', tocStructure: [] };
			}

			const list = document.createElement('ul');
			list.className = 'toc-list';

			let h2Sections: { h2: HTMLLIElement; h3s: HTMLLIElement[]; tocItem: TocItem }[] = [];
			let tocStructure: TocItem[] = [];

			headings.forEach((heading) => {
				const listItem = document.createElement('li');
				listItem.className = `toc-item toc-level-${heading.tagName.toLowerCase()}`;
				const link = document.createElement('a');

				// Handle empty headings
				const headingText = heading.textContent?.trim() || 'Untitled Section';
				// Shorten very long headings for TOC display (over 35 chars)
				const displayText =
					headingText.length > 35 ? headingText.substring(0, 32) + '...' : headingText;

				// Generate a valid ID if missing
				const id =
					heading.id ||
					`toc-${headingText
						.toLowerCase()
						.replace(/[^\w\s-]/g, '')
						.replace(/\s+/g, '-')}`;

				// Make sure the heading has an ID for linking
				if (!heading.id) {
					heading.id = id;
				}

				link.href = `#${id}`;
				link.textContent = displayText;
				link.className = 'toc-link';
				link.setAttribute('title', headingText); // Add title for tooltip showing full text

				listItem.appendChild(link);

				const tocItem: TocItem = {
					id,
					name: headingText
				};

				if (heading.tagName === 'H2') {
					list.appendChild(listItem);
					tocStructure.push(tocItem);
					h2Sections.push({ h2: listItem, h3s: [], tocItem });
				} else if (heading.tagName === 'H3' && h2Sections.length > 0) {
					h2Sections[h2Sections.length - 1].h3s.push(listItem);
					if (!h2Sections[h2Sections.length - 1].tocItem.children) {
						h2Sections[h2Sections.length - 1].tocItem.children = [];
					}
					h2Sections[h2Sections.length - 1].tocItem.children?.push(tocItem);
				}
			});

			// Limit the number of TOC entries if there are too many
			const totalH2s = h2Sections.length;
			const totalH3s = h2Sections.reduce((sum, section) => sum + section.h3s.length, 0);
			const totalLinks = totalH2s + totalH3s;

			if (totalLinks > maxTocEntries) {
				const availableH3Slots = maxTocEntries - totalH2s;
				const h3sPerSection = Math.floor(availableH3Slots / totalH2s);
				let extraH3s = availableH3Slots % totalH2s;

				h2Sections.forEach((section, index) => {
					const h3sToKeep = h3sPerSection + (index < extraH3s ? 1 : 0);
					if (section.h3s.length > 0) {
						const subList = document.createElement('ul');
						subList.className = 'toc-sublist';
						section.h3s.slice(0, h3sToKeep).forEach((h3) => {
							subList.appendChild(h3);
						});
						section.h2.appendChild(subList);
					}
					if (section.tocItem.children) {
						section.tocItem.children = section.tocItem.children.slice(0, h3sToKeep);
					}
				});
			} else {
				h2Sections.forEach((section) => {
					if (section.h3s.length > 0) {
						const subList = document.createElement('ul');
						subList.className = 'toc-sublist';
						section.h3s.forEach((h3) => {
							subList.appendChild(h3);
						});
						section.h2.appendChild(subList);
					}
				});
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
		if (!browser) return;

		// Get all headings and TOC links
		const headings = Array.from(document.querySelectorAll('h2[id], h3[id]'));
		const tocLinks = document.querySelectorAll('.toc-link');

		if (!headings.length || !tocLinks.length) return;

		// Find the heading currently in view
		const scrollPosition = window.scrollY;

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
	const unsubscribe = contentStore.subscribe((value) => {
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

{#if showSidebar}
	<aside
		class="toc-sidebar"
		style="left: {sidebarPosition.left};"
		transition:fly={{ x: -100, duration: 300 }}
		aria-label="Table of contents navigation"
	>
		<nav>
			<h3 class="toc-title">{title}</h3>
			{@html toc}
		</nav>
	</aside>
{/if}

{#if toc}
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
		position: fixed;
		top: 50%;
		transform: translateY(-50%);
		width: 220px; /* Slightly wider to accommodate longer text */
		font-size: 0.875rem;
		line-height: 1.25;
		max-width: 14rem; /* Increased from 12rem */
		background-color: var(--color-background, white);
		border-radius: 0.5rem;
		padding: 1rem;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
		z-index: 10;
		overflow: hidden;

		// Option: add subtle border
		border: 1px solid var(--color-border, rgba(0, 0, 0, 0.05));
	}

	.toc-title {
		margin: 0;
		padding: 0;
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: var(--color-heading, #333);
	}

	.toc-accordion {
		margin: 1.5rem 0;
		border: 1px solid var(--color-border, rgba(0, 0, 0, 0.1));
		border-radius: 0.5rem;
		background-color: var(--color-background-secondary, #f9f9f9);
		overflow: hidden;
	}

	.toc-summary {
		font-weight: 600;
		font-size: 1.1rem;
		padding: 1rem;
		cursor: pointer;
		display: block;
		outline: none;
		color: var(--color-heading, #333);

		&::-webkit-details-marker {
			display: none;
		}

		&::before {
			content: '▶';
			display: inline-block;
			margin-right: 0.5rem;
			font-size: 0.8rem;
			transition: transform 0.2s;
		}

		:global(details[open]) > &::before {
			transform: rotate(90deg);
		}
	}

	.toc-accordion-content {
		padding: 0 1rem 1rem;
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
		padding-left: 0.75rem;
		margin-top: 0.25rem;
	}

	:global(.toc-item) {
		margin-bottom: 0.25rem;
		width: 100%;
		max-width: 100%;
		position: relative;
	}

	:global(.toc-level-h2) {
		padding-left: 0;
		margin-top: 0.5rem;
		padding-right: 4px;
	}

	:global(.toc-level-h3) {
		padding-left: 0;
		padding-right: 4px;
		font-size: 0.8125rem;
		opacity: 0.9;
	}

	:global(.toc-link) {
		text-decoration: none;
		color: var(--color-primary, #0066cc);
		display: block !important;
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		transition: color 0.2s ease;
		padding-right: 8px; /* Add padding to ensure text doesn't touch the edge */
		box-sizing: border-box;
		font-size: 0.875rem; /* Slightly smaller font size for better fit */
		line-height: 1.4;

		&:hover {
			text-decoration: underline !important;
			color: var(--color-primary-dark, #004499);
		}

		&::after {
			content: none !important;
			display: none !important;
		}
	}

	/* Handle active states for TOC links */
	:global(.toc-link.active) {
		font-weight: 600;
		color: var(--color-primary-dark, #004499);
	}

	/* Responsive adjustments */
	@media (max-width: 1200px) {
		.toc-sidebar {
			display: none;
		}
	}
</style>
