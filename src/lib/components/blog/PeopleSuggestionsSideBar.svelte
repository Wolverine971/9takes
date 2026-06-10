<!-- src/lib/components/blog/PeopleSuggestionsSideBar.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';
	import { browser } from '$app/environment';
	import {
		buildPersonalityAnalysisPath,
		formatPersonalityDisplayName
	} from '$lib/utils/personalityAnalysis';

	export let links: string[] = [];
	export let title: string = 'More Personalities';

	/**
	 * Bridge links — internal-linking authority routes from a personality
	 * profile back into the main graph (type pillar, category, corpus stats,
	 * /enneagram-test). Rendered below the suggestions list and only shown
	 * when at least one link is present. Bucket 3, internal linking.
	 */
	export let bridgeLinks: { label: string; href: string }[] = [];

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

{#if links.length || bridgeLinks.length}
	<nav class="profile-links-static" aria-label="Related personality links">
		{#if links.length}
			<section class="profile-links-section" aria-labelledby="related-personalities-heading">
				<h3 id="related-personalities-heading" class="profile-links-title">
					Related personalities
				</h3>
				<ul class="profile-links-list">
					{#each links as link}
						<li class="profile-links-item">
							<a href={buildPersonalityAnalysisPath(link)} class="profile-links-link">
								{formatPersonalityDisplayName(link)}
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{/if}

		{#if bridgeLinks.length}
			<section class="profile-links-section" aria-labelledby="framework-links-heading">
				<h3 id="framework-links-heading" class="profile-links-title">Explore the framework</h3>
				<ul class="profile-links-list">
					{#each bridgeLinks as bridge}
						<li class="profile-links-item">
							<a
								href={bridge.href}
								class="profile-links-link"
								data-bridge="true"
								data-track="profile-inline-bridge"
							>
								{bridge.label}
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{/if}
	</nav>
{/if}

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
						<a href={buildPersonalityAnalysisPath(link)} class="sidebar-link">
							{formatPersonalityDisplayName(link)}
						</a>
					</li>
				{/each}
			</ul>
			{#if bridgeLinks.length}
				<div class="sidebar-bridges" aria-label="Explore the framework">
					<h4 class="sidebar-subtitle">Explore the Framework</h4>
					<ul class="sidebar-list">
						{#each bridgeLinks as bridge}
							<li class="sidebar-item">
								<a
									href={bridge.href}
									class="sidebar-link"
									data-bridge="true"
									data-track="profile-sidebar-bridge"
								>
									{bridge.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
			<div class="sidebar-extra">
				<slot />
			</div>
		</nav>
	</aside>
{/if}

<style lang="scss">
	.profile-links-static {
		max-width: 880px;
		margin: 0 auto 2rem;
		padding: 1rem 0;
		border-top: 1px solid var(--stone-edge);
		border-bottom: 1px solid var(--stone-edge);
	}

	.profile-links-section + .profile-links-section {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px dashed var(--stone-edge);
	}

	.profile-links-title {
		margin: 0 0 0.65rem;
		font-size: 0.78rem;
		font-weight: 600;
		line-height: 1.2;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--ink-dim);
	}

	.profile-links-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.profile-links-item {
		margin: 0;
		padding: 0;
	}

	.profile-links-link {
		display: inline-flex;
		align-items: center;
		padding: 0.15rem 0;
		border-bottom: 1px solid color-mix(in srgb, var(--lamp-glow) 45%, transparent);
		color: var(--lamp-glow);
		font-size: 0.9rem;
		line-height: 1.25;
		text-decoration: none;

		&:hover {
			border-bottom-color: var(--ink-bright);
			color: var(--ink-bright);
			text-decoration: none;
		}

		&::after {
			content: none;
		}
	}

	.sidebar {
		/* Card base styles - Solo Leveling dark theme */
		background-color: var(--night-deep);
		border-radius: 12px;
		box-shadow: 0 0 20px color-mix(in srgb, var(--lamp-glow) 15%, transparent);
		border: 1px solid color-mix(in srgb, var(--ink-dim) 30%, transparent);

		position: fixed;
		top: 50%;
		transform: translateY(-50%);
		width: 200px;
		font-size: 0.875rem;
		line-height: 1.4;
		max-width: 200px;
		z-index: 40;
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
			background-color: color-mix(in srgb, var(--lamp-glow) 30%, transparent);
			border-radius: 3px;

			&:hover {
				background-color: color-mix(in srgb, var(--lamp-glow) 50%, transparent);
			}
		}
	}

	.sidebar-nav {
		width: 100%;
		padding: 0.5rem;
	}

	.sidebar-bridges {
		margin-top: 0.9rem;
		padding-top: 0.9rem;
		border-top: 1px solid color-mix(in srgb, var(--ink-dim) 30%, transparent);
	}

	.sidebar-extra {
		margin-top: 0.9rem;
		padding-top: 0.9rem;
		border-top: 1px solid color-mix(in srgb, var(--ink-dim) 30%, transparent);
	}

	.sidebar-extra:empty {
		display: none;
	}

	.sidebar-title {
		margin: 0 0 0.5rem 0;
		padding: 0 0 0.35rem 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--ink-bright);
		border-bottom: 1px solid color-mix(in srgb, var(--ink-dim) 30%, transparent);
	}

	.sidebar-subtitle {
		margin: 0 0 0.4rem 0;
		font-size: 0.78rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--ink-dim);
	}

	.sidebar-link[data-bridge='true'] {
		color: var(--ink-bright);

		&:hover {
			color: var(--lamp-glow);
		}
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
		font-size: 0.875rem;
		line-height: 1.4;
		color: var(--lamp-glow);
		text-decoration: none;
		border-radius: 4px;
		transition: all 0.2s ease;
		text-transform: capitalize;

		&:hover {
			color: var(--lamp-glow);
			background-color: var(--lamp-soft);
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
