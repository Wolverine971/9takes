<!-- src/lib/components/blog/KeepThisPageInvite.svelte -->
<!--
  Places the "Email me this page" card (KeepThisPage) inside an article, in
  front of the heading about a third of the way through. The newsletter form
  sits below the article, where roughly one reader in five scrolls; this puts
  one ask where people are still reading.

  Browser-only, like the beta card: it is not article content, so it stays out
  of the server HTML search engines index. Wrap in {#key slug} so client-side
  navigation between posts re-places it. Readers who already used it, and
  articles with fewer than five sections, get nothing.
-->
<script lang="ts">
	import { mount, onMount, tick, unmount } from 'svelte';
	import KeepThisPage from './KeepThisPage.svelte';
	import { pickInlineAnchorIndex } from '$lib/utils/betaInvite';
	import { pickKeepPageAnchorIndex, readKeepPageDone } from '$lib/utils/keepThisPage';

	let {
		articleSelector = '.article-body',
		headingSelector = 'h2',
		fraction = 0.3,
		betaFraction = 0.6
	}: {
		/** The prose container(s). Several matches = one article split into runs. */
		articleSelector?: string;
		headingSelector?: string;
		fraction?: number;
		/** Where the beta card goes on the same page, so the two never share a heading. */
		betaFraction?: number;
	} = $props();

	const SKIP = 'nav, aside, header, footer, [data-beta-skip], [data-beta-card]';

	onMount(() => {
		if (readKeepPageDone()) return;

		let cancelled = false;
		let slot: HTMLElement | null = null;
		let instance: ReturnType<typeof mount> | null = null;

		void tick().then(() => {
			if (cancelled) return;
			const containers = Array.from(document.querySelectorAll<HTMLElement>(articleSelector));
			if (!containers.length) return;

			const headings = containers
				.flatMap((container) =>
					Array.from(container.querySelectorAll<HTMLElement>(headingSelector))
				)
				.filter((heading) => !heading.closest(SKIP));
			const index = pickKeepPageAnchorIndex(
				headings.length,
				fraction,
				pickInlineAnchorIndex(headings.length, betaFraction)
			);
			if (index < 0) return;

			// When a post wraps each section in its own box, go in front of the box
			// rather than inside it, above its heading.
			let anchor = headings[index];
			while (
				anchor.parentElement &&
				!containers.includes(anchor.parentElement) &&
				!anchor.previousElementSibling &&
				containers.some((container) => container.contains(anchor.parentElement))
			) {
				anchor = anchor.parentElement;
			}

			slot = document.createElement('div');
			slot.className = 'keep-page-slot';
			slot.setAttribute('data-beta-skip', '');
			anchor.before(slot);
			instance = mount(KeepThisPage, {
				target: slot,
				props: { path: window.location.pathname }
			});
		});

		return () => {
			cancelled = true;
			if (instance) void unmount(instance);
			slot?.remove();
		};
	});
</script>
