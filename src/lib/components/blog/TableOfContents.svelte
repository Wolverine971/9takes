<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { fly } from 'svelte/transition';
	import { writable, type Writable } from 'svelte/store';

	export let contentStore: Writable<string>;
	export let pageUrl: string; // Add this line to accept the page URL as a prop

	let visible = false;
	let windowWidth: number;
	let toc: string = '';
	let content: string = '';
	let jsonLd: string = '';

	interface TocItem {
		id: string;
		name: string;
		children?: TocItem[];
	}

	function generateTableOfContents(html: string): { tocHtml: string; tocStructure: TocItem[] } {
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = html;

		const headings = [...tempDiv.querySelectorAll('h2, h3')].filter(
			(heading) => heading.textContent.trim() !== 'Table of Contents'
		);

		const list = document.createElement('ul');
		list.className = 'toc-list';

		let h2Sections: { h2: HTMLLIElement; h3s: HTMLLIElement[]; tocItem: TocItem }[] = [];
		let tocStructure: TocItem[] = [];

		headings.forEach((heading) => {
			const listItem = document.createElement('li');
			listItem.className = `toc-item toc-level-${heading.tagName.toLowerCase()}`;
			const link = document.createElement('a');

			const id = heading.id || heading.textContent.toLowerCase().replace(/\s+/g, '-');
			heading.id = id;

			link.href = `#${id}`;
			link.textContent = heading.textContent;
			link.className = 'toc-link';

			listItem.appendChild(link);

			const tocItem: TocItem = {
				id,
				name: heading.textContent
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
				h2Sections[h2Sections.length - 1].tocItem.children.push(tocItem);
			}
		});

		const totalH2s = h2Sections.length;
		const totalH3s = h2Sections.reduce((sum, section) => sum + section.h3s.length, 0);
		const totalLinks = totalH2s + totalH3s;

		if (totalLinks > 24) {
			const availableH3Slots = 24 - totalH2s;
			const h3sPerSection = Math.floor(availableH3Slots / totalH2s);
			let extraH3s = availableH3Slots % totalH2s;

			h2Sections.forEach((section, index) => {
				const h3sToKeep = h3sPerSection + (index < extraH3s ? 1 : 0);
				section.h3s.slice(0, h3sToKeep).forEach((h3) => {
					section.h2.appendChild(h3);
				});
				if (section.tocItem.children) {
					section.tocItem.children = section.tocItem.children.slice(0, h3sToKeep);
				}
			});
		} else {
			h2Sections.forEach((section) => {
				section.h3s.forEach((h3) => {
					section.h2.appendChild(h3);
				});
			});
		}

		return { tocHtml: list.outerHTML, tocStructure };
	}

	function generateJsonLd(tocStructure: TocItem[], pageUrl: string): string {
		const jsonLd = {
			'@context': 'https://schema.org',
			'@type': 'Article',
			mainEntityOfPage: {
				'@type': 'WebPage',
				'@id': pageUrl
			},
			about: tocStructure.map((item) => ({
				'@type': 'Thing',
				name: item.name,
				description: item.children ? item.children.map((child) => child.name).join(', ') : undefined
			}))
		};

		return JSON.stringify(jsonLd, null, 2);
	}

	$: {
		if (content) {
			const { tocHtml, tocStructure } = generateTableOfContents(content);
			toc = tocHtml;
			jsonLd = generateJsonLd(tocStructure, pageUrl);
		}
	}

	onMount(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY;
			const pageHeight = document.documentElement.scrollHeight;
			const windowHeight = window.innerHeight;
			const distanceFromBottom = pageHeight - (scrollPosition + windowHeight);

			visible = scrollPosition > 1000 && distanceFromBottom > 300;
		};

		const handleResize = () => {
			windowWidth = window.innerWidth;
			handleScroll();
		};
		const { tocHtml, tocStructure } = generateTableOfContents(content);
		toc = tocHtml;
		jsonLd = generateJsonLd(tocStructure, pageUrl);

		window.addEventListener('scroll', handleScroll);
		window.addEventListener('resize', handleResize);
		handleResize();

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleResize);
		};
	});

	const unsubscribe = contentStore.subscribe((value) => {
		content = value;
	});

	afterUpdate(() => {
		if (content) {
			const { tocHtml, tocStructure } = generateTableOfContents(content);
			toc = tocHtml;
			jsonLd = generateJsonLd(tocStructure, pageUrl);
		}
	});

	$: sidebarLeft = Math.max((windowWidth - 64 * 16) / 2 - 200, 20);
</script>

{#if visible && toc && windowWidth > 1200}
	<div
		class="toc-sidebar fixed top-1/2 w-48 -translate-y-1/2 transform rounded-lg bg-white p-4 shadow-lg"
		style="left: {sidebarLeft}px;"
		transition:fly={{ x: -100, duration: 300 }}
	>
		<nav>
			<h3 class="toc-title">Table of Contents</h3>
			{@html toc}
		</nav>
	</div>
{/if}

<details open>
	<summary class="accordion">Table of Contents</summary>
	{@html toc}
</details>

<svelte:head>
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<style lang="scss">
	.toc-sidebar {
		font-size: 0.875rem;
		line-height: 1.25;
		max-width: 12rem;
	}

	.toc-title {
		margin: 0;
		padding: 0;
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	:global(.toc-list) {
		list-style-type: none;
		padding-left: 0;
		margin: 0;
	}

	:global(.toc-item) {
		margin-bottom: 0.25rem;
		width: 100%;
		overflow: hidden;
		text-wrap: nowrap;
		text-overflow: ellipsis;

		&:hover {
			text-decoration: underline !important;
			color: black;
		}
	}

	:global(.toc-level-h2) {
		padding-left: 0.5rem;
	}

	:global(.toc-level-h3) {
		padding-left: 1rem;
		font-size: 0.8125rem;
	}

	:global(.toc-link) {
		text-decoration: none;
		display: block;
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;

		&:hover {
			text-decoration: underline !important;
			color: black;
		}

		&::after {
			content: none !important;
			display: none !important;
		}
	}
</style>
