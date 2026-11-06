<!-- src/lib/components/blog/PeopleSuggestionsSideBar.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { browser } from '$app/environment';
	import {
		buildPersonalityAnalysisPath,
		formatPersonalityDisplayName
	} from '$lib/utils/personalityAnalysis';

	interface Props {
		links?: string[];
		title?: string;
		/**
		 * Bridge links — internal-linking authority routes from a personality
		 * profile back into the main graph (type pillar, category, corpus stats,
		 * /enneagram-test). Rendered below the suggestions list and only shown
		 * when at least one link is present. Bucket 3, internal linking.
		 */
		bridgeLinks?: { label: string; href: string }[];
		/**
		 * When false, the inline static link block (rendered in the document flow
		 * at the bottom of the page) is suppressed and only the floating desktop
		 * rail is shown. Used on /personality-analysis, where the bottom "Further
		 * analysis" section is the canonical related block and the inline list
		 * would duplicate it.
		 */
		showInline?: boolean;
		// Configuration options with defaults
		showAtScrollY?: number;
		hideBeforeBottom?: number;
		sidebarWidth?: number;
		/** Hide on screens smaller than this width */
		mobileBreakpoint?: number;
		/** Optional card above the list (the beta card on personality pages). */
		lead?: Snippet;
		/** Extra content rendered at the bottom of the floating rail. */
		children?: Snippet;
	}

	let {
		links = [],
		title = 'More Personalities',
		bridgeLinks = [],
		showInline = true,
		showAtScrollY = 1200,
		hideBeforeBottom = 1500,
		sidebarWidth = 200,
		mobileBreakpoint = 1024,
		lead,
		children
	}: Props = $props();

	let visible = $state(false);
	let windowWidth = $state(0);
	let contentWidth = $state(64 * 16); // 64rem default
	let mainElement: HTMLElement | null = null;

	// One entry per person: the raw `suggestions` fallback isn't de-duplicated,
	// and a repeated slug would break the keyed lists below.
	const uniqueLinks = $derived(links.filter((link, i) => links.indexOf(link) === i));

	// Track if we should display based on screen size
	let showOnCurrentWidth = $derived(windowWidth >= mobileBreakpoint);

	// Calculate sidebar position
	let sidebarPosition = $derived(calculateSidebarPosition(windowWidth, contentWidth, sidebarWidth));

	function calculateSidebarPosition(winWidth: number, contentW: number, sidebarW: number) {
		// Mirror TableOfContents' geometry so this rail and the TOC sit
		// symmetrically around the same prose column. `main` is full-bleed on
		// the owned-shell routes, so cap it at the prose measure the article
		// actually uses (56rem) rather than trusting the raw element width.
		const maxContentWidth = 56 * 16; // 896px
		const actualContentWidth = Math.min(contentW, maxContentWidth);
		const gap = 20;
		const minEdgeMargin = 12;

		const mainContentLeft = Math.max((winWidth - actualContentWidth) / 2, minEdgeMargin);
		const sidebarLeft = mainContentLeft - sidebarW - gap;

		// Not enough gutter to the left of the content column — hide rather than
		// overlap the prose.
		if (sidebarLeft < minEdgeMargin) {
			return null;
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

		// Find the main content element and get its width. `main.column-width`
		// no longer exists anywhere in the app, so the fallbacks are what
		// actually resolve — without them contentWidth stayed at its default
		// and the rail only cleared the left gutter above ~1500px.
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

		handleScroll(); // Recalculate visibility on resize
	}

	onMount(() => {
		// Initial setup
		handleResize();
	});
</script>

<svelte:window onscroll={handleScroll} onresize={handleResize} />

{#if showInline && (uniqueLinks.length || bridgeLinks.length)}
	<nav class="profile-links-static" aria-label="Related personality links">
		{#if uniqueLinks.length}
			<section class="profile-links-section" aria-labelledby="related-personalities-heading">
				<h3 id="related-personalities-heading" class="profile-links-title">
					Related personalities
				</h3>
				<ul class="profile-links-list">
					{#each uniqueLinks as link (link)}
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
					{#each bridgeLinks as bridge (bridge.href)}
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
		transition:fly={{ x: -100, duration: prefersReducedMotion.current ? 0 : 300 }}
		aria-label="Related personalities navigation"
	>
		<!-- Optional card above the list (the beta card on personality pages). -->
		{@render lead?.()}
		{#if uniqueLinks.length || bridgeLinks.length || children}
			<nav class="sidebar-nav">
				{#if uniqueLinks.length}
					<h3 class="sidebar-title">{title}</h3>
					<ul class="sidebar-list">
						{#each uniqueLinks as link (link)}
							<li class="sidebar-item">
								<a href={buildPersonalityAnalysisPath(link)} class="sidebar-link">
									{formatPersonalityDisplayName(link)}
								</a>
							</li>
						{/each}
					</ul>
				{/if}
				{#if bridgeLinks.length}
					<div class="sidebar-bridges" aria-label="Explore the framework">
						<h4 class="sidebar-subtitle">Explore the Framework</h4>
						<ul class="sidebar-list">
							{#each bridgeLinks as bridge (bridge.href)}
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
					{@render children?.()}
				</div>
			</nav>
		{/if}
	</aside>
{/if}

<style lang="scss">
	.profile-links-static {
		max-width: 880px;
		margin: 0 auto 2rem;
		padding: 1rem 0;
		border-top: 1px solid var(--rule);
		border-bottom: 1px solid var(--rule);
	}

	.profile-links-section + .profile-links-section {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px dashed var(--rule);
	}

	.profile-links-title {
		margin: 0 0 0.65rem;
		font-family: var(--font-talk);
		font-size: var(--font-size-xs);
		font-weight: 600;
		line-height: 1.2;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-faint);
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
		color: var(--highlight);
		font-size: var(--font-size-sm);
		line-height: 1.25;
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.2em;
		text-decoration-color: color-mix(in srgb, var(--highlight) 45%, transparent);

		&:hover {
			color: var(--text);
			text-decoration-color: currentColor;
		}

		&::after {
			content: none;
		}
	}

	// The rail is a column: an optional lead card (the beta card), then the
	// list card. Only the list scrolls, so the lead card never scrolls away.
	.sidebar {
		position: fixed;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		flex-direction: column;
		width: 200px;
		max-width: 200px;
		max-height: 88vh;
		font-family: var(--font-talk);
		font-size: var(--font-size-sm);
		line-height: 1.4;
		z-index: 40;

		// Ensure it doesn't overlap with other elements
		pointer-events: auto;
	}

	.sidebar-nav {
		box-sizing: border-box;
		flex: 0 1 auto;
		min-height: 0;
		width: 100%;
		max-height: 70vh;
		padding: 0.5rem;
		overflow-y: auto;
		overflow-x: hidden;
		background-color: var(--surface);
		border-radius: 16px;
		box-shadow: 0 0 24px color-mix(in srgb, var(--accent) 14%, transparent);
		border: 1px solid var(--rule);

		/* Custom scrollbar */
		&::-webkit-scrollbar {
			width: 6px;
		}

		&::-webkit-scrollbar-track {
			background: transparent;
		}

		&::-webkit-scrollbar-thumb {
			background-color: color-mix(in srgb, var(--accent) 40%, transparent);
			border-radius: 999px;

			&:hover {
				background-color: color-mix(in srgb, var(--accent) 65%, transparent);
			}
		}
	}

	.sidebar-bridges,
	.sidebar-extra {
		margin-top: 0.9rem;
		padding-top: 0.9rem;
		border-top: 1px solid var(--rule);
	}

	.sidebar-extra:empty {
		display: none;
	}

	.sidebar-title {
		margin: 0 0 0.5rem 0;
		padding: 0 0 0.35rem 0;
		font-family: var(--font-talk);
		font-size: var(--font-size-base);
		font-weight: 600;
		color: var(--text);
		border-bottom: 1px solid var(--rule);
	}

	.sidebar-subtitle {
		margin: 0 0 0.4rem 0;
		font-family: var(--font-talk);
		font-size: var(--font-size-xs);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-faint);
	}

	.sidebar-link[data-bridge='true'] {
		// Person slugs get title-cased below; bridge labels are already written
		// as prose and must keep their sentence case.
		text-transform: none;
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
		line-height: 1.4;
		color: var(--text-muted);
		text-decoration: none;
		border-radius: 4px;
		transition:
			color 0.2s ease,
			background-color 0.2s ease;
		text-transform: capitalize;

		/* Rail rows are navigation, not inline links: muted text that lifts
		   onto a raised row on hover, so no underline. */
		&:hover {
			color: var(--text);
			background-color: var(--surface-raised);
			text-decoration: none;
		}

		&:focus-visible {
			outline-offset: -2px;
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
