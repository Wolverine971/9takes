<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { fly } from 'svelte/transition';
	import { writable, type Writable } from 'svelte/store';

	export let contentStore: Writable<string>;

	let visible = false;
	let windowWidth: number;
	let toc: string = '';
	let content: string = '';

	function generateTableOfContents(html: string): string {
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = html;

		const headings = [...tempDiv.querySelectorAll('h2, h3')].filter(
			(heading) => heading.textContent.trim() !== 'Table of Contents'
		);

		const list = document.createElement('ul');
		list.className = 'toc-list';

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
			list.appendChild(listItem);
		});

		return list.outerHTML;
	}

	$: {
		if (content) {
			toc = generateTableOfContents(content);
			console.log('Table of contents updated:', toc);
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
		toc = generateTableOfContents(content);

		window.addEventListener('scroll', handleScroll);
		window.addEventListener('resize', handleResize);
		handleResize();

		return () => {
			// unsubscribe();
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleResize);
		};
	});

	const unsubscribe = contentStore.subscribe((value) => {
		content = value;
	});

	afterUpdate(() => {
		if (content) {
			toc = generateTableOfContents(content);
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
<nav>
	<h3 class="toc-title">Table of Contents</h3>
	{@html toc}
</nav>

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
	}

	:global(.toc-level-h2) {
		padding-left: 0.5rem;
	}

	:global(.toc-level-h3) {
		padding-left: 1rem;
		font-size: 0.8125rem;
	}

	:global(.toc-link) {
		color: #333;
		text-decoration: none;
		display: block;
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;

		&:hover {
			text-decoration: underline;
		}

		&::after {
			content: none !important;
			display: none !important;
		}
	}
</style>
