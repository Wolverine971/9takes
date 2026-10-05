<!-- src/lib/components/blog/ExperimentalTherapyInvite.svelte -->
<!--
  Places the beta card on a blog page (DJ, 2026-10-04):
  - Wide screens: a floating side card right of the article, like the other
    rails (floatingRail). Pages that already have a rail can carry the card in
    it instead (BetaRailCard) and pass floatingRail={false}.
  - Narrower screens, or no room for the rail: the card is mounted inside the
    article, in front of the heading about `fraction` of the way through.
  Browser-only. The card isn't article content, so it stays out of the server
  HTML that search engines index. Wrap in {#key slug} so client-side
  navigation between posts re-places it.
-->
<script lang="ts">
	import { mount, onMount, tick, unmount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import ExperimentalTherapyCard from './ExperimentalTherapyCard.svelte';
	import { betaCard } from './betaInviteState.svelte';
	import {
		BETA_RAIL_MEDIA_QUERY,
		pickInlineAnchorIndex,
		readBetaSignedUp,
		type BetaSurface
	} from '$lib/utils/betaInvite';

	let {
		surface,
		personName = null,
		articleSelector = '.article-body',
		headingSelector = 'h2',
		fraction = 0.6,
		fallbackBeforeSelector,
		floatingRail = true,
		railShowAtScrollY = 900,
		railHideBeforeBottom = 1300
	}: {
		surface: BetaSurface;
		/** The famous person a celebrity page is about, for {name} headlines. */
		personName?: string | null;
		/** The prose container(s). Several matches = one article split into runs. */
		articleSelector?: string;
		headingSelector?: string;
		fraction?: number;
		/** Short articles: put the card in front of this (e.g. the author bio) instead of at the very end. */
		fallbackBeforeSelector?: string;
		floatingRail?: boolean;
		railShowAtScrollY?: number;
		railHideBeforeBottom?: number;
	} = $props();

	const RAIL_WIDTH = 240;
	const RAIL_GAP = 24;
	const EDGE_MARGIN = 16;
	const SKIP = 'nav, aside, header, footer, [data-beta-skip], [data-beta-card]';

	let ready = $state(false);
	let offer = $state(false);
	let wide = $state(false);
	/** Distance of the floating rail from the right edge, or null when it doesn't fit. */
	let railRight = $state<number | null>(null);
	let railInView = $state(false);

	const railActive = $derived(floatingRail && wide && railRight !== null);
	const inlineActive = $derived(
		ready && offer && !(wide && (floatingRail ? railRight !== null : true))
	);

	function proseContainers(): HTMLElement[] {
		return Array.from(document.querySelectorAll<HTMLElement>(articleSelector));
	}

	function measureRail() {
		const column = proseContainers()[0];
		if (!column) {
			railRight = null;
			return;
		}
		const railLeft = column.getBoundingClientRect().right + RAIL_GAP;
		const fits = railLeft + RAIL_WIDTH <= window.innerWidth - EDGE_MARGIN;
		railRight = fits ? window.innerWidth - railLeft - RAIL_WIDTH : null;
	}

	function trackScroll() {
		const fromBottom =
			document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
		railInView = window.scrollY > railShowAtScrollY && fromBottom > railHideBeforeBottom;
	}

	onMount(() => {
		// Keep showing the thank-you if they signed up on this page; otherwise a
		// visitor who already asked isn't asked again.
		offer = !readBetaSignedUp() || betaCard.stage === 'done';
		const media = window.matchMedia(BETA_RAIL_MEDIA_QUERY);
		const update = () => {
			wide = media.matches;
			if (floatingRail) {
				measureRail();
				trackScroll();
			}
		};
		update();
		ready = true;

		media.addEventListener('change', update);
		if (!floatingRail) return () => media.removeEventListener('change', update);

		window.addEventListener('resize', update);
		window.addEventListener('scroll', trackScroll, { passive: true });
		return () => {
			media.removeEventListener('change', update);
			window.removeEventListener('resize', update);
			window.removeEventListener('scroll', trackScroll);
		};
	});

	$effect(() => {
		if (!inlineActive) return;

		let cancelled = false;
		let slot: HTMLElement | null = null;
		let instance: ReturnType<typeof mount> | null = null;

		void tick().then(() => {
			if (cancelled) return;
			const containers = proseContainers();
			if (!containers.length) return;

			const headings = containers
				.flatMap((container) =>
					Array.from(container.querySelectorAll<HTMLElement>(headingSelector))
				)
				.filter((heading) => !heading.closest(SKIP));

			let index = pickInlineAnchorIndex(headings.length, fraction);
			// A heading that opens a later run of the prose sits right under a
			// non-prose block (the mid-article question); slide to the next one so
			// the two don't stack. Headings nested in a post's own section wrappers
			// are first children too, but aren't run openers, so leave them be.
			const opensRun = (heading: HTMLElement) =>
				containers.indexOf(heading.parentElement as HTMLElement) > 0 &&
				!heading.previousElementSibling;
			while (index > 0 && index < headings.length - 1 && opensRun(headings[index])) {
				index += 1;
			}

			slot = document.createElement('div');
			slot.className = 'beta-invite-slot';
			slot.setAttribute('data-beta-skip', '');
			const last = containers[containers.length - 1];
			const fallbackAnchor = fallbackBeforeSelector
				? last.querySelector<HTMLElement>(fallbackBeforeSelector)
				: null;
			if (index >= 0) {
				// When a post wraps each section in its own box, go in front of the
				// box rather than inside it, above its heading.
				let anchor = headings[index];
				while (
					anchor.parentElement &&
					!containers.includes(anchor.parentElement) &&
					!anchor.previousElementSibling &&
					containers.some((container) => container.contains(anchor.parentElement))
				) {
					anchor = anchor.parentElement;
				}
				anchor.before(slot);
			} else if (fallbackAnchor) fallbackAnchor.before(slot);
			else last.append(slot);

			instance = mount(ExperimentalTherapyCard, {
				target: slot,
				props: { placement: 'inline', surface, personName }
			});
		});

		return () => {
			cancelled = true;
			if (instance) void unmount(instance);
			slot?.remove();
		};
	});
</script>

{#if offer && railActive && railInView}
	<div
		class="eti-rail"
		style:right={`${railRight}px`}
		transition:fly={{ x: 100, duration: prefersReducedMotion.current ? 0 : 300 }}
	>
		<ExperimentalTherapyCard placement="rail" {surface} {personName} />
	</div>
{/if}

<style>
	.eti-rail {
		position: fixed;
		top: 50%;
		z-index: 40;
		width: 240px;
		transform: translateY(-50%);
	}
</style>
