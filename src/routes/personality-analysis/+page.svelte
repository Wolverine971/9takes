<!-- src/routes/personality-analysis/+page.svelte -->
<!--
  /personality-analysis index — "faces by type" (rebuilt 2026-11-04).

  DJ's brief: get readers to the portraits fast. The old page put a big hero
  and nine text-only type panels (~4,600px on a phone) before the first face,
  and ran Featured + Recently updated as two near-duplicate sections.

  Now: compact header → type jump chips → one "Just added" strip → nine
  portrait rails (best-known first, from ./celebrityHub.ts). The rails carry
  the "Enneagram celebrities by type" names and links that the head-term SEO
  block used to hold as text, and the ItemList JSON-LD still mirrors them.
  Rails scroll sideways; each ends in a "See all" tile to the type hub.
-->
<script lang="ts">
	import type { PageData } from './$types';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	import { portraitAlignmentStyle } from './portraitAlignment';
	import {
		buildPersonalityAnalysisPath,
		buildPersonalityImagePath
	} from '$lib/utils/personalityAnalysis';

	let { data }: { data: PageData } = $props();

	type TypeMeta = { num: number; name: string; read: string };
	const typeData: TypeMeta[] = [
		{ num: 1, name: 'Perfectionist', read: "what's broken" },
		{ num: 2, name: 'Helper', read: 'what people need' },
		{ num: 3, name: 'Achiever', read: 'what wins' },
		{ num: 4, name: 'Individualist', read: "what's missing" },
		{ num: 5, name: 'Investigator', read: 'the system underneath' },
		{ num: 6, name: 'Loyalist', read: 'the threat' },
		{ num: 7, name: 'Enthusiast', read: "what's next" },
		{ num: 8, name: 'Challenger', read: 'the power dynamic' },
		{ num: 9, name: 'Peacemaker', read: 'the harmony' }
	];

	const typeNameByNum: Record<number, string> = Object.fromEntries(
		typeData.map((t) => [t.num, `The ${t.name}`])
	);

	// "460+" (rounded down from corpus-stats.json); null only if the corpus is tiny.
	const publicFigureCount = $derived(data.publicFigureCount);
	const celebrityHub = $derived(data.celebrityHub ?? []);
	const justAdded = $derived(data.justAdded ?? []);

	// Head term: "enneagram celebrities". The old title's terms ("famous people",
	// "personality analysis") stay in the title and description.
	const seoTitle = $derived(
		publicFigureCount
			? `Enneagram Celebrities: ${publicFigureCount} Famous People Typed | 9takes`
			: 'Enneagram Celebrities: Famous People Typed | 9takes'
	);
	const seoDescription = $derived(
		`${publicFigureCount ?? 'Hundreds of'} celebrities, leaders, and historical figures sorted by Enneagram type, each with a full personality analysis. See who shares your type.`
	);

	// The ItemList mirrors the nine portrait rails: one group per type, each
	// with the people shown.
	const structuredData = $derived({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://9takes.com' },
					{ '@type': 'ListItem', position: 2, name: 'Personality Analysis' }
				]
			},
			{
				'@type': 'CollectionPage',
				name: 'Enneagram Celebrities',
				description: seoDescription,
				url: 'https://9takes.com/personality-analysis',
				inLanguage: 'en-US',
				about: {
					'@type': 'Thing',
					name: 'Enneagram of Personality',
					sameAs: 'https://en.wikipedia.org/wiki/Enneagram_of_Personality'
				},
				publisher: {
					'@type': 'Organization',
					name: '9takes',
					url: 'https://9takes.com',
					logo: {
						'@type': 'ImageObject',
						url: 'https://9takes.com/brand/9takes-nine-mask-logo-512.png'
					},
					sameAs: ['https://www.instagram.com/9takesdotcom/', 'https://twitter.com/9takesdotcom']
				},
				mainEntity: {
					'@type': 'ItemList',
					name: 'Enneagram celebrities by type',
					numberOfItems: celebrityHub.length,
					itemListOrder: 'https://schema.org/ItemListOrderAscending',
					itemListElement: celebrityHub.map((group, i) => ({
						'@type': 'ListItem',
						position: i + 1,
						item: {
							'@type': 'ItemList',
							name: `Enneagram Type ${group.type} (${typeNameByNum[Number(group.type)]}) celebrities`,
							url: `https://9takes.com/personality-analysis/type/${group.type}`,
							description: `${group.count} profiles, ${group.sharePct} of the 9takes corpus.`,
							numberOfItems: group.people.length,
							itemListOrder: 'https://schema.org/ItemListOrderDescending',
							itemListElement: group.people.map((person, j) => ({
								'@type': 'ListItem',
								position: j + 1,
								name: person.name,
								url: `https://9takes.com${buildPersonalityAnalysisPath(person.slug)}`
							}))
						}
					}))
				}
			}
		]
	});

	// UTC so server and browser print the same day.
	const shortDate = new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		timeZone: 'UTC'
	});
	function addedLabel(value: string | null): string {
		if (!value) return '';
		const time = new Date(value);
		return Number.isNaN(time.getTime()) ? '' : shortDate.format(time);
	}

	// Desktop arrow buttons nudge the rail they sit next to.
	function scrollRail(event: MouseEvent, direction: 1 | -1) {
		const rail = (event.currentTarget as HTMLElement)
			.closest('[data-rail-group]')
			?.querySelector<HTMLElement>('[data-rail]');
		if (!rail) return;
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		rail.scrollBy({
			left: direction * rail.clientWidth * 0.8,
			behavior: reduceMotion ? 'auto' : 'smooth'
		});
	}

	// Logged-out readers get the newsletter box after this many rails.
	const SIGNUP_AFTER_TYPE = 3;
</script>

<SEOHead
	title={seoTitle}
	description={seoDescription}
	canonical="https://9takes.com/personality-analysis"
	twitterCardType="summary_large_image"
	ogImage="https://9takes.com/brand/9takes-nine-mask-social-card.png"
	jsonLd={structuredData}
	author="9takes"
/>

{#snippet railArrows(label: string)}
	<div class="rail-arrows">
		<button
			type="button"
			class="rail-arrow"
			aria-label={`Scroll ${label} left`}
			onclick={(e) => scrollRail(e, -1)}
		>
			<span aria-hidden="true">&larr;</span>
		</button>
		<button
			type="button"
			class="rail-arrow"
			aria-label={`Scroll ${label} right`}
			onclick={(e) => scrollRail(e, 1)}
		>
			<span aria-hidden="true">&rarr;</span>
		</button>
	</div>
{/snippet}

<div class="faces-index">
	<!-- Compact header: title, one line of why, then straight to type chips. -->
	<header class="page-head">
		<p class="mono page-kicker">Case files &middot; all nine types</p>
		<h1 class="page-title">
			Enneagram celebrities{#if publicFigureCount}: {publicFigureCount} famous people{/if}, typed.
		</h1>
		<p class="page-sub">
			Each one is our read of the public record: the interviews, the feuds, the decisions nobody
			understood. None of them took a test.
			<a href="/corpus-stats#enneagram-distribution">See the type distribution&nbsp;&rarr;</a>
		</p>

		<nav class="type-chips" aria-label="Jump to a type">
			{#each typeData as t (t.num)}
				<a class="type-chip" href={`#type-${t.num}`}>
					<span class="type-chip-num">{t.num}</span>
					<span class="type-chip-name">{t.name}</span>
				</a>
			{/each}
		</nav>
	</header>

	<!-- Just added: the one freshness row (replaces Featured + Recently updated). -->
	{#if justAdded.length > 0}
		<section class="rail-group just-added" data-rail-group aria-labelledby="just-added-heading">
			<div class="rail-head">
				<div class="rail-title">
					<h2 id="just-added-heading" class="rail-heading">Just added</h2>
					<p class="rail-meta">The newest case files.</p>
				</div>
				{@render railArrows('just added')}
			</div>
			<ul class="rail" data-rail>
				{#each justAdded as person, i (person.slug)}
					<li>
						<a class="face" href={buildPersonalityAnalysisPath(person.slug)}>
							<span class="face-photo personality-portrait-well">
								<img
									class="personality-portrait-image"
									src={buildPersonalityImagePath(person.enneagram, person.slug, 'thumbnail')}
									style={portraitAlignmentStyle(
										buildPersonalityImagePath(person.enneagram, person.slug, 'thumbnail')
									)}
									alt={`${person.name}, Enneagram Type ${person.enneagram}`}
									width="320"
									height="400"
									loading={i < 6 ? 'eager' : 'lazy'}
									fetchpriority={i < 2 ? 'high' : undefined}
									decoding="async"
								/>
								<span class="face-badge mono">Type {person.enneagram}</span>
							</span>
							<span class="face-name">{person.name}</span>
							{#if person.personaTitle}
								<span class="face-title">{person.personaTitle}</span>
							{/if}
							{#if addedLabel(person.addedAt)}
								<span class="face-date mono">{addedLabel(person.addedAt)}</span>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	<!-- Nine portrait rails, best-known first. -->
	<section class="by-type" id="enneagram-celebrities" aria-labelledby="by-type-heading">
		<h2 id="by-type-heading" class="by-type-heading">Enneagram celebrities by type</h2>

		{#each celebrityHub as group (group.type)}
			{@const meta = typeData[Number(group.type) - 1]}
			{@const typeLabel = `Type ${group.type} ${meta.name}s`}
			{#if group.people.length > 0}
				<section
					class="rail-group type-rail"
					id={`type-${group.type}`}
					data-rail-group
					aria-labelledby={`type-${group.type}-heading`}
				>
					<div class="rail-head">
						<span class="rail-num" aria-hidden="true">{group.type}</span>
						<div class="rail-title">
							<h3 id={`type-${group.type}-heading`} class="rail-heading">
								Type {group.type} &middot; The {meta.name}
							</h3>
							<p class="rail-meta">
								Leads with <em>{meta.read}</em> &middot; {group.count} typed
							</p>
						</div>
						<a class="rail-all" href={`/personality-analysis/type/${group.type}`}>
							See all {group.count}<span class="rail-all-arrow" aria-hidden="true">&rarr;</span>
						</a>
						{@render railArrows(typeLabel)}
					</div>

					<ul class="rail" data-rail aria-label={`Best-known ${typeLabel}`}>
						{#each group.people as person (person.slug)}
							<li>
								<a class="face" href={buildPersonalityAnalysisPath(person.slug)}>
									<span class="face-photo personality-portrait-well">
										<img
											class="personality-portrait-image"
											src={buildPersonalityImagePath(group.type, person.slug, 'thumbnail')}
											style={portraitAlignmentStyle(
												buildPersonalityImagePath(group.type, person.slug, 'thumbnail')
											)}
											alt={`${person.name}, Enneagram Type ${group.type}`}
											width="320"
											height="400"
											loading={Number(group.type) <= 2 ? 'eager' : 'lazy'}
											decoding="async"
										/>
									</span>
									<span class="face-name">{person.name}</span>
									{#if person.personaTitle}
										<span class="face-title">{person.personaTitle}</span>
									{/if}
								</a>
							</li>
						{/each}
						{#if group.count > group.people.length}
							<li>
								<a class="face-more" href={`/personality-analysis/type/${group.type}`}>
									<span class="face-more-count">+{group.count - group.people.length}</span>
									<span class="face-more-label">See all {group.count} Type {group.type}s</span>
									<span class="face-more-arrow" aria-hidden="true">&rarr;</span>
								</a>
							</li>
						{/if}
					</ul>
				</section>
			{/if}

			{#if Number(group.type) === SIGNUP_AFTER_TYPE && !data?.user}
				<aside class="signup">
					<div class="signup-copy">
						<p class="mono signup-kicker">Case file dispatch</p>
						<h3>Get the next famous-person read.</h3>
						<p>New breakdowns and pattern notes, sent only when there's one worth reading.</p>
					</div>
					<div class="signup-form">
						<EmailSignup embedded />
					</div>
				</aside>
			{/if}
		{/each}

		<p class="footnote">
			Best-known first, ranked by Wikipedia pageviews over the past year. Counts describe who 9takes
			has profiled, not how common each type is.
		</p>
	</section>
</div>

<style lang="scss">
	.faces-index {
		--gutter: 48px;
		--tile: 176px;
		/* One accent for the whole page. DJ (2026-11-04): the nine type colors
		   were distracting, so numbers are neutral outlines and amber marks
		   links and hover only. */
		--face-color: var(--lamp-glow);

		background: var(--night-deep);
		color: var(--ink-bright);
		font-family: var(--font-display);
		min-height: 100vh;
		overflow: hidden;
		padding-bottom: 80px;

		@media (max-width: 768px) {
			--gutter: 20px;
			--tile: clamp(132px, 38vw, 168px);
			padding-bottom: 56px;
		}
	}

	.faces-index :global(a) {
		color: inherit;
		text-decoration: none;
	}

	.mono {
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	/* ---------- compact header ---------- */
	.page-head {
		max-width: 1280px;
		margin: 0 auto;
		padding: 48px var(--gutter) 8px;
		display: flex;
		flex-direction: column;
		gap: 14px;

		@media (max-width: 768px) {
			padding-top: 28px;
			padding-bottom: 4px;
			gap: 10px;
		}
	}

	.page-kicker {
		margin: 0;
		color: var(--lamp-glow);
	}

	.page-title {
		margin: 0;
		font-size: clamp(30px, 4.6vw, 52px);
		font-weight: 800;
		line-height: 1.05;
		letter-spacing: -0.03em;
		max-width: 22ch;
	}

	.page-sub {
		margin: 0;
		max-width: 680px;
		font-size: 16px;
		line-height: 1.55;
		color: var(--ink-mid);

		a {
			color: var(--lamp-glow);
			font-weight: 600;
			white-space: nowrap;

			&:hover,
			&:focus-visible {
				text-decoration: underline;
				text-underline-offset: 3px;
			}
		}

		@media (max-width: 768px) {
			font-size: 15px;
		}
	}

	.type-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 8px;

		@media (max-width: 768px) {
			flex-wrap: nowrap;
			overflow-x: auto;
			margin-inline: calc(var(--gutter) * -1);
			padding-inline: var(--gutter);
			scrollbar-width: none;

			&::-webkit-scrollbar {
				display: none;
			}
		}
	}

	.type-chip {
		flex: none;
		display: inline-flex;
		align-items: center;
		gap: 7px;
		padding: 5px 12px 5px 5px;
		border: 1px solid var(--stone-edge);
		border-radius: 9999px;
		background: var(--stone-warm);
		font-size: 13.5px;
		font-weight: 600;
		color: var(--ink-bright);
		transition:
			border-color 0.15s ease,
			background 0.15s ease;

		&:hover,
		&:focus-visible {
			border-color: var(--face-color);
			background: var(--stone-mid);

			.type-chip-num {
				border-color: var(--face-color);
				color: var(--face-color);
			}
		}
	}

	.type-chip-num {
		display: grid;
		place-items: center;
		width: 24px;
		height: 24px;
		border: 1.5px solid var(--ink-dim);
		border-radius: 9999px;
		color: var(--ink-bright);
		font-size: 12px;
		font-weight: 700;
		transition:
			border-color 0.15s ease,
			color 0.15s ease;
	}

	/* ---------- rails (shared by Just added + the nine types) ---------- */
	.rail-group {
		max-width: 1280px;
		margin: 0 auto;
		padding: 28px var(--gutter) 0;
		scroll-margin-top: 80px;

		@media (max-width: 768px) {
			padding-top: 24px;
		}
	}

	.rail-head {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 14px;
	}

	.rail-num {
		flex: none;
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border: 1.5px solid var(--ink-dim);
		border-radius: 9999px;
		color: var(--ink-bright);
		font-size: 18px;
		font-weight: 800;

		/* The heading already says "Type N"; phones need the width. */
		@media (max-width: 768px) {
			display: none;
		}
	}

	.rail-title {
		min-width: 0;
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.rail-heading {
		margin: 0;
		font-size: clamp(17px, 2vw, 22px);
		font-weight: 700;
		line-height: 1.2;
		letter-spacing: -0.01em;
		color: var(--ink-bright);
	}

	.rail-meta {
		margin: 0;
		font-size: clamp(13px, 1.4vw, 14px);
		line-height: 1.4;
		color: var(--ink-dim);

		em {
			color: var(--ink-mid);
			font-style: italic;
		}
	}

	.rail-all {
		flex: none;
		font-size: 14px;
		font-weight: 600;
		color: var(--ink-bright);
		white-space: nowrap;

		.rail-all-arrow {
			margin-left: 4px;
			color: var(--face-color);
		}

		&:hover,
		&:focus-visible {
			text-decoration: underline;
			text-decoration-color: var(--face-color);
			text-underline-offset: 3px;
		}
	}

	.rail-arrows {
		flex: none;
		display: none;
		gap: 6px;

		@media (hover: hover) and (pointer: fine) and (min-width: 769px) {
			display: flex;
		}
	}

	.rail-arrow {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		border: 1px solid var(--stone-edge);
		border-radius: 9999px;
		background: var(--stone-warm);
		color: var(--ink-mid);
		font-size: 15px;
		cursor: pointer;
		transition:
			border-color 0.15s ease,
			color 0.15s ease;

		&:hover,
		&:focus-visible {
			border-color: var(--face-color);
			color: var(--ink-bright);
		}
	}

	.rail {
		list-style: none;
		margin: 0 calc(var(--gutter) * -1);
		padding: 2px var(--gutter) 10px;
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: var(--tile);
		gap: 14px;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scroll-padding-inline: var(--gutter);
		overscroll-behavior-x: contain;
		scrollbar-width: thin;
		scrollbar-color: var(--stone-edge) transparent;

		> li {
			scroll-snap-align: start;
			min-width: 0;
		}

		@media (max-width: 768px) {
			gap: 10px;
			scrollbar-width: none;

			&::-webkit-scrollbar {
				display: none;
			}
		}
	}

	/* ---------- portrait tile ---------- */
	.face {
		display: flex;
		flex-direction: column;
		gap: 4px;
		height: 100%;
	}

	.face-photo {
		position: relative;
		display: block;
		aspect-ratio: 4 / 5;
		margin-bottom: 6px;
		overflow: hidden;
		border-radius: 10px;
		box-shadow: inset 0 0 0 1px var(--stone-edge);

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			object-position: center;
			/* Keep the baked-in eye mark on one guide, including during hover. */
			transform-origin: center var(--portrait-eye-y);
			transform: translateY(var(--portrait-offset-y)) scale(var(--portrait-scale));
			transition: transform 0.3s ease;
		}
	}

	.face:hover .face-photo img,
	.face:focus-visible .face-photo img {
		transform: translateY(var(--portrait-offset-y)) scale(calc(var(--portrait-scale) * 1.04));
	}

	@media (prefers-reduced-motion: reduce) {
		.face-photo img {
			transition: none;
		}

		.face:hover .face-photo img,
		.face:focus-visible .face-photo img {
			transform: translateY(var(--portrait-offset-y)) scale(var(--portrait-scale));
		}
	}

	.face-badge {
		position: absolute;
		top: 8px;
		left: 8px;
		padding: 3px 7px;
		border-radius: 4px;
		background: rgba(0, 0, 0, 0.62);
		color: #fff;
		font-size: 10px;
		letter-spacing: 0.06em;
	}

	.face-name {
		font-size: 15px;
		font-weight: 700;
		line-height: 1.25;
		color: var(--ink-bright);
	}

	.face:hover .face-name,
	.face:focus-visible .face-name {
		text-decoration: underline;
		text-decoration-color: var(--face-color);
		text-underline-offset: 3px;
	}

	.face-title {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		font-size: 13px;
		line-height: 1.35;
		color: var(--ink-mid);
	}

	.face-date {
		margin-top: 2px;
		font-size: 11px;
		color: var(--ink-dim);
	}

	@media (max-width: 768px) {
		.face-name {
			font-size: 14px;
		}

		.face-title {
			font-size: 12px;
		}
	}

	/* ---------- "See all" end tile ---------- */
	.face-more {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		gap: 6px;
		aspect-ratio: 4 / 5;
		padding: 16px;
		border: 1.5px dashed var(--ink-dim);
		border-radius: 10px;
		background: var(--stone-warm);
		transition: background 0.15s ease;

		&:hover,
		&:focus-visible {
			background: var(--stone-mid);
		}
	}

	.face-more-count {
		font-size: 30px;
		font-weight: 800;
		line-height: 1;
		color: var(--face-color);
	}

	.face-more-label {
		font-size: 14px;
		font-weight: 600;
		line-height: 1.3;
		color: var(--ink-bright);
	}

	.face-more-arrow {
		color: var(--face-color);
		font-size: 18px;
	}

	/* ---------- by-type section ---------- */
	.by-type {
		margin-top: 28px;
		scroll-margin-top: 64px;
		border-top: 1px solid var(--stone-edge);
	}

	.by-type-heading {
		max-width: 1280px;
		margin: 0 auto;
		padding: 32px var(--gutter) 0;
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--lamp-glow);
	}

	.type-rail + .type-rail,
	.signup + .type-rail {
		margin-top: 12px;
	}

	/* ---------- newsletter (logged-out only) ---------- */
	.signup {
		max-width: calc(1280px - 2 * 48px);
		margin: 40px auto 16px;
		padding: 24px;
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
		gap: 24px;
		align-items: center;
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-radius: 16px;

		@media (max-width: 1376px) {
			margin-inline: var(--gutter);
		}

		@media (max-width: 768px) {
			grid-template-columns: 1fr;
			padding: 20px;
		}
	}

	.signup-copy {
		display: flex;
		flex-direction: column;
		gap: 8px;

		h3 {
			margin: 0;
			font-size: clamp(20px, 2.2vw, 26px);
			line-height: 1.15;
			letter-spacing: -0.015em;
			color: var(--ink-bright);
		}

		p {
			margin: 0;
		}

		p:not(.signup-kicker) {
			max-width: 520px;
			font-size: 15px;
			line-height: 1.55;
			color: var(--ink-mid);
		}
	}

	.signup-kicker {
		color: var(--lamp-glow);
	}

	.signup-form {
		min-width: 0;
	}

	.footnote {
		max-width: 720px;
		margin: 40px auto 0;
		padding: 0 var(--gutter);
		text-align: center;
		font-size: 13px;
		line-height: 1.55;
		color: var(--ink-dim);
	}
</style>
