<!-- src/lib/components/blog/EnneagramSectionPage.svelte -->
<!--
  One layout for every Enneagram Corner section page (Foundations, Relationships,
  Mental Health, ...). Cold Light, left-aligned (DJ, 2026-11-06): hero with a
  topic index, then the section's posts in lanes, one lane per subtopic from
  $lib/data/enneagramCornerTaxonomy.js. Small sections render one flat grid.
  Pages add their own blocks through the notice / beforeLanes / afterLanes /
  actions snippets.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import FAQSection from '$lib/components/blog/FAQSection.svelte';
	import { SectionKicker } from '$lib/components/atoms';
	import CaseCard from '$lib/components/marketing/CaseCard.svelte';
	import type { CornerCard, CornerSectionView } from '$lib/types/enneagramCorner';
	import type { CornerSectionCopy } from '$lib/data/enneagramCornerSectionCopy';

	type Props = {
		view: CornerSectionView;
		copy: CornerSectionCopy;
		canonical: string;
		/** Under the hero (e.g. the mental-health crisis line). */
		notice?: Snippet;
		beforeLanes?: Snippet;
		afterLanes?: Snippet;
		/** Buttons under the closing note. */
		actions?: Snippet;
	};

	let { view, copy, canonical, notice, beforeLanes, afterLanes, actions }: Props = $props();

	const SITE_URL = 'https://9takes.com';
	/** Below this many posts, lanes of one card read as clutter: show one grid. */
	const MIN_POSTS_FOR_LANES = 6;

	const flat = $derived(view.total < MIN_POSTS_FOR_LANES || view.lanes.length < 2);
	const allCards = $derived(
		view.lanes.flatMap((lane) => lane.posts.map((post) => ({ post, laneTitle: lane.title })))
	);

	// Topic filter: null shows every lane.
	let activeLane = $state<string | null>(null);
	const visibleLanes = $derived(
		activeLane ? view.lanes.filter((lane) => lane.slug === activeLane) : view.lanes
	);

	const titleParts = $derived.by(() => {
		const quiet = copy.titleQuiet.trim();
		if (quiet && copy.title.endsWith(quiet) && copy.title.length > quiet.length) {
			return { loud: copy.title.slice(0, copy.title.length - quiet.length).trimEnd(), quiet };
		}
		return { loud: copy.title, quiet: '' };
	});

	function formatDate(iso: string | null | undefined): string {
		if (!iso) return '';
		const d = new Date(iso);
		if (Number.isNaN(d.getTime())) return '';
		return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
	}

	function recencyLabel(post: CornerCard): string {
		const ref = post.lastmod ?? post.date;
		if (!ref) return '';
		const days = Math.floor((Date.now() - new Date(ref).getTime()) / 86400000);
		if (days <= 3) return 'NEW';
		if (days <= 7) return 'THIS WEEK';
		if (days <= 30) return 'THIS MONTH';
		return '';
	}

	const cardImage = (post: CornerCard) => (post.pic ? `/blogs/s-${post.pic}.webp` : null);

	function chooseLane(slug: string | null) {
		activeLane = slug;
		document.getElementById('reads')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	const shareImage = $derived(copy.pic ? `${SITE_URL}/blogs/${copy.pic}.webp` : undefined);

	const jsonLd = $derived({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'CollectionPage',
				'@id': `${canonical}#webpage`,
				url: canonical,
				name: copy.seoTitle,
				headline: copy.title,
				description: copy.description,
				inLanguage: 'en-US',
				...(view.latestUpdate ? { dateModified: view.latestUpdate } : {}),
				isPartOf: {
					'@type': 'Blog',
					name: '9takes Enneagram Corner',
					url: `${SITE_URL}/enneagram-corner`
				},
				about: {
					'@type': 'Thing',
					name: 'Enneagram',
					sameAs: 'https://en.wikipedia.org/wiki/Enneagram_of_Personality'
				},
				publisher: { '@id': `${SITE_URL}/#organization` },
				...(shareImage ? { image: { '@type': 'ImageObject', url: shareImage } } : {}),
				mainEntity: {
					'@type': 'ItemList',
					numberOfItems: allCards.length,
					itemListElement: allCards.map(({ post }, i) => ({
						'@type': 'ListItem',
						position: i + 1,
						url: `${SITE_URL}${post.href}`,
						name: post.title
					}))
				}
			},
			{
				'@type': 'BreadcrumbList',
				'@id': `${canonical}#breadcrumb`,
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
					{
						'@type': 'ListItem',
						position: 2,
						name: 'Enneagram Corner',
						item: `${SITE_URL}/enneagram-corner`
					},
					{ '@type': 'ListItem', position: 3, name: view.section.title, item: canonical }
				]
			},
			{
				'@type': 'FAQPage',
				'@id': `${canonical}#faq`,
				mainEntity: copy.faqs.map((faq) => ({
					'@type': 'Question',
					name: faq.question,
					acceptedAnswer: { '@type': 'Answer', text: faq.answer }
				}))
			}
		]
	});
</script>

<SEOHead
	title={copy.seoTitle}
	description={copy.description}
	{canonical}
	ogImage={shareImage}
	twitterImageAlt={copy.title}
	{jsonLd}
/>

<div class="corner-section">
	<!-- Hero: title + lede on the left, the section's topic index on the right. -->
	<header class="band hero-band">
		<div class="wrap hero-grid">
			<div class="hero-copy">
				<nav class="crumbs" aria-label="Breadcrumb">
					<ol>
						<li><a href="/">Home</a></li>
						<li aria-hidden="true">/</li>
						<li><a href="/enneagram-corner">Enneagram Corner</a></li>
						<li aria-hidden="true">/</li>
						<li aria-current="page">{view.section.title}</li>
					</ol>
				</nav>
				<SectionKicker tone="lamp" label={view.section.title} />
				<h1 class="hero-title">
					<span class="hero-shout">{titleParts.loud}</span>
					{#if titleParts.quiet}
						<span class="hero-voice">{titleParts.quiet}</span>
					{/if}
				</h1>
				<p class="hero-lede">{copy.lede ?? copy.description}</p>
				<p class="hero-meta">
					{view.total}
					{view.total === 1 ? 'read' : 'reads'}
					{#if !flat}
						· {view.lanes.length} topics
					{/if}
					{#if view.latestUpdate}
						· Updated <time datetime={view.latestUpdate}>{formatDate(view.latestUpdate)}</time>
					{/if}
				</p>
			</div>

			{#if !flat}
				<nav class="topic-index" aria-label="Topics in {view.section.title}">
					<p class="topic-index-label">In this section</p>
					<ol>
						{#each view.lanes as lane (lane.slug)}
							<li>
								<a href="#lane-{lane.slug}" onclick={() => (activeLane = null)}>
									<span class="topic-index-title">{lane.title}</span>
									<span class="topic-index-count">{lane.posts.length}</span>
								</a>
							</li>
						{/each}
					</ol>
				</nav>
			{/if}
		</div>
	</header>

	{#if notice}
		<div class="wrap notice-wrap">{@render notice()}</div>
	{/if}

	{#if copy.intro}
		<section class="band intro-band" aria-label="Introduction">
			<div class="wrap">
				<div class="intro">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -- static copy from enneagramCornerSectionCopy.ts -->
					<p class="intro-hook">{@html copy.intro.hook}</p>
					{#each copy.intro.body as paragraph, i (i)}
						<!-- eslint-disable-next-line svelte/no-at-html-tags -- static copy -->
						<p class="intro-body">{@html paragraph}</p>
					{/each}
					{#if copy.intro.insight}
						<p class="intro-insight">{copy.intro.insight}</p>
					{/if}
				</div>
			</div>
		</section>
	{/if}

	{#if beforeLanes}
		{@render beforeLanes()}
	{/if}

	<!-- Reads: lanes by subtopic (or one grid for small sections). -->
	<section class="band reads-band" id="reads" aria-labelledby="reads-title">
		<div class="wrap">
			<header class="band-head">
				<h2 id="reads-title" class="band-title">
					{flat ? `All ${view.section.title} reads` : 'Browse by topic'}
				</h2>
				{#if !flat}
					<p class="band-sub">
						{view.total} reads in {view.lanes.length} topics. Pick the one closest to what you're dealing
						with.
					</p>
				{/if}
			</header>

			{#if flat}
				<div class="card-grid">
					{#each allCards as { post, laneTitle } (post.slug)}
						<CaseCard
							href={post.href}
							title={post.title}
							eyebrow={laneTitle.toUpperCase()}
							description={post.description}
							imageSrc={cardImage(post)}
							recency={recencyLabel(post)}
						/>
					{/each}
				</div>
			{:else}
				<div class="chips" role="group" aria-label="Filter reads by topic">
					<button
						type="button"
						class={['chip', { active: activeLane === null }]}
						aria-pressed={activeLane === null}
						onclick={() => chooseLane(null)}
					>
						All <span class="chip-count">{view.total}</span>
					</button>
					{#each view.lanes as lane (lane.slug)}
						<button
							type="button"
							class={['chip', { active: activeLane === lane.slug }]}
							aria-pressed={activeLane === lane.slug}
							onclick={() => chooseLane(lane.slug)}
						>
							{lane.title} <span class="chip-count">{lane.posts.length}</span>
						</button>
					{/each}
				</div>

				{#each visibleLanes as lane (lane.slug)}
					<section class="lane" id="lane-{lane.slug}" aria-labelledby="lane-{lane.slug}-title">
						<header class="lane-head">
							<div class="lane-title-row">
								<h3 id="lane-{lane.slug}-title" class="lane-title">{lane.title}</h3>
								<span class="lane-count">
									{lane.posts.length}
									{lane.posts.length === 1 ? 'read' : 'reads'}
								</span>
							</div>
							<p class="lane-sub">{lane.descriptor}</p>
						</header>
						<div class="card-grid">
							{#each lane.posts as post (post.slug)}
								<CaseCard
									href={post.href}
									title={post.title}
									description={post.description}
									imageSrc={cardImage(post)}
									recency={recencyLabel(post)}
								/>
							{/each}
						</div>
					</section>
				{/each}

				{#if activeLane}
					<button type="button" class="show-all" onclick={() => chooseLane(null)}>
						Show all {view.total} reads
					</button>
				{/if}
			{/if}
		</div>
	</section>

	{#if afterLanes}
		{@render afterLanes()}
	{/if}

	<section class="band faq-band">
		<div class="wrap">
			<div class="faq-wrap">
				<FAQSection faqs={copy.faqs} title={copy.faqTitle} />
			</div>
		</div>
	</section>

	<section class="band next-band" aria-labelledby="next-title">
		<div class="wrap next-grid">
			<div class="closing">
				<h2 id="next-title" class="band-title">{copy.conclusion.title}</h2>
				{#each copy.conclusion.body as paragraph, i (i)}
					<!-- eslint-disable-next-line svelte/no-at-html-tags -- static copy -->
					<p class="closing-body">{@html paragraph}</p>
				{/each}
				{#if actions}
					<div class="closing-actions">{@render actions()}</div>
				{/if}
			</div>

			<nav class="more-sections" aria-labelledby="more-sections-title">
				<h3 id="more-sections-title" class="more-sections-title">Keep exploring</h3>
				<ul>
					{#each view.otherSections.filter((section) => section.count > 0) as section (section.slug)}
						<li>
							<a href={section.href}>
								<span class="more-sections-name">
									{section.title}
									<span class="more-sections-count">{section.count}</span>
								</span>
								<span class="more-sections-desc">{section.descriptor}</span>
							</a>
						</li>
					{/each}
				</ul>
				<a class="hub-link" href="/enneagram-corner">Back to Enneagram Corner →</a>
			</nav>
		</div>
	</section>
</div>

<style lang="scss">
	/* Enneagram Corner section page — Cold Light, left-aligned (2026-11-06). */
	.corner-section {
		background: var(--bg);
		color: var(--text);
		font-family: var(--font-talk);
		min-height: 100vh;

		p,
		h1,
		h2,
		h3 {
			margin: 0;
		}
	}

	.wrap {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 48px;

		@media (max-width: 768px) {
			padding: 0 20px;
		}
	}

	.band {
		padding: 72px 0;
		border-top: 1px solid var(--rule);

		@media (max-width: 768px) {
			padding: 48px 0;
		}
	}

	.band-head {
		max-width: 720px;
		margin-bottom: 28px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.band-title {
		font-weight: var(--font-weight-semibold);
		font-size: clamp(calc(var(--font-size-xl) * 1.3), 3.4vw, calc(var(--font-size-xl) * 1.8));
		line-height: 1.12;
		letter-spacing: -0.02em;
	}

	.band-sub {
		font-size: var(--font-size-lg);
		line-height: 1.55;
		color: var(--text-muted);
	}

	/* ---------- hero ---------- */
	.hero-band {
		border-top: none;
		padding: 40px 0 64px;

		@media (max-width: 768px) {
			padding: 24px 0 44px;
		}
	}

	.hero-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(260px, 340px);
		gap: 56px;
		align-items: end;

		@media (max-width: 900px) {
			grid-template-columns: 1fr;
			gap: 36px;
		}
	}

	.hero-copy {
		display: flex;
		flex-direction: column;
		gap: 16px;
		max-width: 720px;
	}

	.crumbs ol {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		list-style: none;
		margin: 0 0 20px;
		padding: 0;
		font-size: var(--font-size-sm);
		color: var(--text-faint);

		a {
			color: var(--text-muted);
			text-decoration: none;

			&:hover {
				color: var(--text);
			}
		}
	}

	.hero-title {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.hero-shout {
		font-family: var(--font-shout);
		font-weight: 400;
		font-size: clamp(calc(var(--font-size-xl) * 1.8), 5.2vw, calc(var(--font-size-xl) * 3));
		line-height: 1;
		letter-spacing: 0.005em;
		text-transform: uppercase;
		color: var(--text);
	}

	.hero-voice {
		font-family: var(--font-voice);
		font-style: italic;
		font-weight: 400;
		font-size: clamp(calc(var(--font-size-xl) * 1.2), 2.6vw, calc(var(--font-size-xl) * 1.8));
		line-height: 1.15;
		color: var(--highlight);
	}

	.hero-lede {
		font-size: var(--font-size-lg);
		line-height: 1.6;
		color: var(--text-muted);
		max-width: 620px;
	}

	.hero-meta {
		font-size: var(--font-size-sm);
		color: var(--text-faint);
		letter-spacing: 0.01em;
	}

	/* Topic index: the section's lanes at a glance. */
	.topic-index {
		background: var(--surface);
		border: 1px solid var(--rule);
		border-radius: 16px;
		padding: 20px 8px 8px;

		ol {
			list-style: none;
			margin: 0;
			padding: 0;
		}

		a {
			display: flex;
			justify-content: space-between;
			align-items: baseline;
			gap: 16px;
			padding: 9px 12px;
			border-radius: 10px;
			color: var(--text);
			text-decoration: none;
			font-size: var(--font-size-base);
			transition: background 0.15s ease;

			&:hover,
			&:focus-visible {
				background: var(--surface-raised);
			}

			&:hover .topic-index-title {
				color: var(--highlight);
			}
		}
	}

	.topic-index-label {
		padding: 0 12px 8px;
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-semibold);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-faint);
	}

	.topic-index-count {
		font-size: var(--font-size-sm);
		color: var(--text-faint);
		font-variant-numeric: tabular-nums;
	}

	.notice-wrap {
		margin-bottom: 40px;
	}

	/* ---------- intro ---------- */
	.intro {
		max-width: 720px;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.intro-hook {
		font-size: var(--font-size-xl);
		line-height: 1.5;
		color: var(--text);

		:global(strong) {
			font-weight: var(--font-weight-semibold);
		}
	}

	.intro-body {
		font-size: var(--font-size-lg);
		line-height: 1.65;
		color: var(--text-muted);
	}

	.intro-insight {
		font-family: var(--font-voice);
		font-style: italic;
		font-size: var(--font-size-xl);
		line-height: 1.45;
		color: var(--highlight);
		border-left: 2px solid var(--accent);
		padding-left: 18px;
	}

	/* ---------- reads ---------- */
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 48px;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 8px 14px;
		border: 1px solid var(--rule);
		border-radius: 9999px;
		background: transparent;
		color: var(--text-muted);
		font-family: inherit;
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		cursor: pointer;
		transition:
			background 0.15s ease,
			border-color 0.15s ease,
			color 0.15s ease;

		&:hover {
			border-color: var(--highlight);
			color: var(--text);
		}

		&.active {
			background: color-mix(in srgb, var(--accent) 22%, transparent);
			border-color: var(--accent);
			color: var(--text);
		}
	}

	.chip-count {
		font-size: var(--font-size-xs);
		color: var(--text-faint);
		font-variant-numeric: tabular-nums;
	}

	.lane {
		margin-bottom: 64px;
		scroll-margin-top: 88px;

		&:last-of-type {
			margin-bottom: 0;
		}

		@media (max-width: 768px) {
			margin-bottom: 48px;
		}
	}

	.lane-head {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding-bottom: 14px;
		margin-bottom: 24px;
		border-bottom: 1px solid var(--rule);
		position: relative;

		/* Accent tick anchored left, under the lane title. */
		&::after {
			content: '';
			position: absolute;
			left: 0;
			bottom: -1px;
			width: 56px;
			height: 2px;
			background: var(--accent);
			border-radius: 9999px;
		}
	}

	.lane-title-row {
		display: flex;
		align-items: baseline;
		gap: 14px;
		flex-wrap: wrap;
	}

	.lane-title {
		font-weight: var(--font-weight-semibold);
		font-size: clamp(var(--font-size-xl), 2.4vw, calc(var(--font-size-xl) * 1.3));
		line-height: 1.2;
		letter-spacing: -0.015em;
	}

	.lane-count {
		font-size: var(--font-size-sm);
		color: var(--text-faint);
	}

	.lane-sub {
		font-size: var(--font-size-base);
		line-height: 1.55;
		color: var(--text-muted);
		max-width: 640px;
	}

	.card-grid {
		display: grid;
		gap: 22px;
		grid-template-columns: repeat(3, minmax(0, 1fr));

		@media (max-width: 900px) {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		@media (max-width: 520px) {
			grid-template-columns: 1fr;
		}
	}

	.show-all {
		margin-top: 40px;
		padding: 10px 18px;
		border: 1px solid var(--rule);
		border-radius: 10px;
		background: transparent;
		color: var(--text);
		font-family: inherit;
		font-size: var(--font-size-base);
		cursor: pointer;

		&:hover {
			border-color: var(--highlight);
		}
	}

	/* ---------- FAQ ---------- */
	.faq-band {
		background: var(--surface);
	}

	/* FAQSection centers itself at 820px with 1.5rem side padding. Pull it
	   back by that padding so its text lines up with the page's left edge. */
	.faq-wrap {
		max-width: 820px;
		margin-left: -1.5rem;
	}

	/* ---------- closing + other sections ---------- */
	.next-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 64px;

		@media (max-width: 900px) {
			grid-template-columns: 1fr;
			gap: 48px;
		}
	}

	.closing {
		display: flex;
		flex-direction: column;
		gap: 16px;
		max-width: 560px;
	}

	.closing-body {
		font-size: var(--font-size-lg);
		line-height: 1.65;
		color: var(--text-muted);

		:global(strong),
		:global(em) {
			color: var(--text);
		}
	}

	.closing-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 8px;
	}

	.more-sections-title {
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-semibold);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-faint);
		margin-bottom: 8px;
	}

	.more-sections {
		ul {
			list-style: none;
			margin: 0;
			padding: 0;
		}

		li {
			border-bottom: 1px solid var(--rule);
		}

		li a {
			display: flex;
			flex-direction: column;
			gap: 4px;
			padding: 14px 0;
			color: var(--text);
			text-decoration: none;

			&:hover .more-sections-name {
				color: var(--highlight);
			}
		}
	}

	.more-sections-name {
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-semibold);
		transition: color 0.15s ease;
	}

	.more-sections-count {
		margin-left: 8px;
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-normal);
		color: var(--text-faint);
	}

	.more-sections-desc {
		font-size: var(--font-size-sm);
		line-height: 1.5;
		color: var(--text-muted);
	}

	.hub-link {
		display: inline-block;
		margin-top: 20px;
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: var(--highlight);
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}
</style>
