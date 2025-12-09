<!-- src/lib/components/blog/PeopleSuggestionsSideBar.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';
	import { browser } from '$app/environment';

	export let links: string[] = [];
	export let title: string = 'More Personalities';

	// Configuration options with defaults
	export let showAtScrollY: number = 1200;
	export let hideBeforeBottom: number = 1500;
	export let sidebarWidth: number = 200;
	export let mobileBreakpoint: number = 1024; // Hide on screens smaller than this width

	let visible = false;
	let windowWidth: number = 0;
	let contentWidth: number = 64 * 16; // 64rem default
	let mainElement: HTMLElement | null = null;

	// Track if we should display based on screen size
	$: showOnCurrentWidth = windowWidth >= mobileBreakpoint;

	// Calculate sidebar position
	$: sidebarPosition = calculateSidebarPosition(windowWidth, contentWidth, sidebarWidth);

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

	function handleScroll() {
		if (!browser) return;

		const scrollPosition = window.scrollY;
		const pageHeight = document.documentElement.scrollHeight;
		const windowHeight = window.innerHeight;
		const distanceFromBottom = pageHeight - (scrollPosition + windowHeight);

		// Only show when scrolled past threshold AND not near the bottom
		visible = scrollPosition > showAtScrollY && distanceFromBottom > hideBeforeBottom;
	}

	function handleResize() {
		if (!browser) return;

		windowWidth = window.innerWidth;

		// Find the main content element and get its width
		if (!mainElement) {
			mainElement = document.querySelector('main.column-width');
		}

		if (mainElement) {
			// Get the actual computed width of the main content
			contentWidth = mainElement.getBoundingClientRect().width;
		}

		handleScroll(); // Recalculate visibility on resize
	}

	onMount(() => {
		if (browser) {
			window.addEventListener('scroll', handleScroll);
			window.addEventListener('resize', handleResize);
			// Initial setup
			handleResize();
		}
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleResize);
		}
	});
</script>

{#if visible && showOnCurrentWidth && sidebarPosition}
	<aside
		class="sidebar"
		style="left: {sidebarPosition.left};"
		transition:fly={{ x: -100, duration: 300 }}
		aria-label="Related personalities navigation"
	>
		<nav class="sidebar-nav">
			<h3 class="sidebar-title">{title}</h3>
			<ul class="sidebar-list">
				{#each links as link}
					<li class="sidebar-item">
						<a href={`/personality-analysis/${link.split(' ').join('-')}`} class="sidebar-link">
							{link}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</aside>
{/if}

<style lang="scss">
	.sidebar {
		/* Card base styles - match TableOfContents */
		background-color: var(--card-background);
		border-radius: var(--border-radius-lg);
		box-shadow: var(--shadow-sm);
		border: 1px solid var(--border-color);

		position: fixed;
		top: 50%;
		transform: translateY(-50%);
		width: 200px;
		font-size: var(--font-size-sm);
		line-height: var(--line-height-tight);
		max-width: 200px;
		z-index: 50;
		max-height: 70vh;
		overflow-y: auto;
		overflow-x: hidden;

		// Ensure it doesn't overlap with other elements
		pointer-events: auto;

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
	}

	.sidebar-nav {
		width: 100%;
		padding: 0.5rem;
	}

	.sidebar-title {
		margin: 0 0 0.5rem 0;
		padding: 0 0 0.35rem 0;
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-semibold);
		color: var(--text-primary);
		border-bottom: 1px solid var(--border-color);
	}

	.sidebar-list {
		list-style-type: none;
		margin: 0;
		padding: 0;
		width: 100%;
	}

	.sidebar-item {
		margin-bottom: 0.125rem;
		width: 100%;

		&:last-child {
			margin-bottom: 0;
		}

		&::marker {
			display: none;
			content: '';
		}
	}

	.sidebar-link {
		display: block;
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		padding: 0.2rem 0.4rem;
		box-sizing: border-box;
		font-size: var(--font-size-sm);
		line-height: var(--line-height-tight);
		color: var(--primary);
		text-decoration: none;
		border-radius: var(--border-radius-sm);
		transition: var(--transition-base);

		&:hover {
			color: var(--primary-dark);
			background-color: var(--accent-light);
			text-decoration: none;
		}

		&::after {
			content: none;
		}
	}

	// Handle small screen adjustments in the component directly
	@media (max-width: 1024px) {
		.sidebar {
			display: none; // Belt and suspenders approach
		}
	}
</style>
