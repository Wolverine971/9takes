<!-- src/routes/pop-culture/+page.svelte -->
<!--
  /pop-culture index — Streetlamp Symposium V5.
  Phase 5 page #5d of docs/design/2026-05-04-rollout-plan.md.

  Template: src/routes/enneagram-corner/+page.svelte (already migrated).
  Spec: docs/design-system.md §4–§6, /design-preview/v5.

  Server load (untouched): returns { popCultureBlogs, featured, recentlyUpdated }.
  V5 tokens (--lamp-*, --night-*, --stone-*, --ink-*, --data-*, --pool-*) live
  in src/scss/index.scss bridge blocks; this file references them via var(--…).

  Note: nearly every pop-culture post has type[0] = 'situational', so we drop
  topic-grouping for this index and present a single "All Analyses" sub-section.
-->
<script lang="ts">
	import type { PageData } from './$types';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import { Button, SectionKicker } from '$lib/components/atoms';

	let { data }: { data: PageData } = $props();

	// ------------------------------------------------------------------
	// Remaining posts after featured + recently-updated are excluded.
	// ------------------------------------------------------------------
	const remainingBlogs = $derived.by(() => {
		const excluded = new Set([
			...data.featured.map((p) => p.slug),
			...data.recentlyUpdated.map((p) => p.slug)
		]);
		return data.popCultureBlogs.filter((b) => !excluded.has(b.slug));
	});

	const publishedCount = $derived(data.popCultureBlogs.length);

	// ------------------------------------------------------------------
	// Helpers — mirror /enneagram-corner for visual consistency.
	// ------------------------------------------------------------------
	function fileNumber(seed: string, index: number): string {
		let h = 0;
		for (let i = 0; i < seed.length; i++) {
			h = (h * 31 + seed.charCodeAt(i)) | 0;
		}
		return String((Math.abs(h) + index * 17 + 25) % 10000).padStart(4, '0');
	}

	function getRecencyLabel(lastmod: string | null, date: string | null): string | null {
		const ref = lastmod ?? date;
		if (!ref) return null;
		const days = Math.floor((Date.now() - new Date(ref).getTime()) / 86400000);
		if (days <= 3) return 'NEW';
		if (days <= 7) return 'THIS WEEK';
		if (days <= 30) return 'THIS MONTH';
		return null;
	}

	function formatDate(iso: string | null | undefined): string {
		if (!iso) return '';
		const d = new Date(iso);
		if (Number.isNaN(d.getTime())) return '';
		return d
			.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
			.toUpperCase();
	}
</script>

<svelte:head>
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			"name": "Pop Culture Psychology: Enneagram Analysis of Famous Figures & Cultural Phenomena",
			"description": "Deep psychological analysis of celebrities, criminals, and cultural movements through the Enneagram personality system. Explore the Dark Triad, famous scandals, and the psychology behind pop culture.",
			"url": "https://9takes.com/pop-culture",
			"author": {
				"@type": "Organization",
				"name": "9takes",
				"url": "https://9takes.com"
			},
			"breadcrumb": {
				"@type": "BreadcrumbList",
				"itemListElement": [
					{
						"@type": "ListItem",
						"position": 1,
						"name": "Home",
						"item": "https://9takes.com"
					},
					{
						"@type": "ListItem",
						"position": 2,
						"name": "Pop Culture Psychology",
						"item": "https://9takes.com/pop-culture"
					}
				]
			}
		}
	</script>
</svelte:head>

<SEOHead
	title="Pop Culture Psychology: Dark Triad, Celebrities & Criminal Minds | 9takes"
	description="Explore the psychology of pop culture through the Enneagram. From serial killers and the Dark Triad to celebrity breakdowns and fictional characters. Deep dives into famous scandals, criminal psychology, and cultural phenomena."
	canonical="https://9takes.com/pop-culture"
	twitterCardType="summary_large_image"
	ogImage="https://9takes.com/pop-culture-card.webp"
	additionalMeta={[
		{
			name: 'keywords',
			content:
				'dark triad, criminal psychology, celebrity psychology, enneagram pop culture, serial killers, personality disorders, famous scandals, narcissism, psychopathy, cultural psychology, celebrity mental health'
		},
		{ name: 'author', content: '9takes' },
		{ property: 'article:publisher', content: 'https://9takes.com' },
		{ property: 'og:site_name', content: '9takes' },
		{ property: 'og:locale', content: 'en_US' }
	]}
/>

<div class="library-index">
	<!-- =====================================================================
	  §01 OBSERVATION — hero + statue + tagline + subtext
	  ===================================================================== -->
	<section class="hero">
		<div class="grain" aria-hidden="true"></div>
		<div class="hero-pool" aria-hidden="true"></div>

		<div class="hero-inner">
			<div class="hero-text">
				<div class="hero-eyebrow">
					<SectionKicker num="01" label="OBSERVATION" />
				</div>

				<h1 class="display-xl">Pop culture, decoded.</h1>

				<div class="scale-marker" aria-hidden="true">
					<span class="tick"></span>
					<span class="tick"></span>
					<span class="tick"></span>
					<span class="tick"></span>
					<span class="tick"></span>
					<span class="tick tick--major"></span>
					<span class="tick"></span>
					<span class="tick"></span>
					<span class="tick"></span>
					<span class="tick"></span>
					<span class="tick"></span>
				</div>

				<p class="mono coords">
					LAT 37.9755° N · LONG 23.7348° E · ATHENS · {publishedCount} READS
				</p>

				<p class="hero-subhead hero-subhead-line-1">
					Movies, shows, fictional characters, public moments &mdash; read through the 9 emotional
					patterns.
				</p>
				<p class="hero-subhead hero-subhead-line-2">
					{publishedCount} reads. The patterns you didn&rsquo;t see coming.
				</p>

				<div class="hero-actions">
					<Button size="md" variant="primary" href="#latest">Start with Latest</Button>
					<Button size="md" variant="ghost" href="#all-analyses">Browse All Analyses</Button>
				</div>
			</div>

			<div class="hero-subject" aria-hidden="true">
				<div class="subject-frame">
					<img
						src="/greek_distorted_statue_face.png"
						alt=""
						class="statue"
						loading="eager"
						decoding="async"
					/>
					<div class="subject-vignette"></div>
					<div class="subject-mono">
						<span class="mono">9TAKES · CASE FILES · POP CULTURE</span>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- =====================================================================
	  §02 FEATURED — large case-file card (server provides 1)
	  ===================================================================== -->
	{#if data.featured.length > 0}
		<section class="featured" id="latest">
			<header class="section-head">
				<SectionKicker class="section-tag" num="02" label="FEATURED" />
				<h2 class="display-md">Featured.</h2>
				<p class="section-sub">Most recently updated. Worth your full attention.</p>
			</header>

			<div class="featured-grid" class:featured-grid--single={data.featured.length === 1}>
				{#each data.featured as post, i (post.slug)}
					{@const topic = (post.type?.[0] ?? 'POP CULTURE')
						.toString()
						.replace(/-/g, ' ')
						.toUpperCase()}
					{@const label = getRecencyLabel(post.lastmod, post.date)}
					<a
						href="/pop-culture/{post.slug}"
						class="case-card case-card--featured"
						aria-label="Read {post.title}"
					>
						<div class="case-image-wrap case-image-wrap--featured">
							{#if post.pic}
								<img
									src={`/blogs/${post.pic}.webp`}
									alt={post.title}
									class="case-image"
									loading={i < 2 ? 'eager' : 'lazy'}
									fetchpriority={i < 2 ? 'high' : 'low'}
									width="640"
									height="440"
									decoding="async"
								/>
							{:else}
								<div class="case-image-stub" aria-hidden="true">
									<span class="mono">[ANALYSIS]</span>
								</div>
							{/if}
						</div>
						<div class="case-card-body">
							<span class="mono case-id">
								№ {fileNumber(post.slug, i)} · {topic}
							</span>
							<h3 class="case-name case-name--featured">{post.title}</h3>
							{#if post.description}
								<p class="case-subtitle case-subtitle--featured">{post.description}</p>
							{/if}
							<div class="case-meta">
								{#if post.date}
									<span class="mono case-date">{formatDate(post.lastmod ?? post.date)}</span>
								{/if}
								{#if label}
									<span class="mono case-recency">{label}</span>
								{/if}
							</div>
						</div>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<!-- =====================================================================
	  §03 RECENTLY UPDATED — case-file cards (server provides up to 3)
	  ===================================================================== -->
	{#if data.recentlyUpdated.length > 0}
		<section class="recent" id="recent">
			<header class="section-head">
				<SectionKicker class="section-tag" num="03" label="RECENTLY UPDATED" />
				<h2 class="display-md">Recently updated.</h2>
				<p class="section-sub">Fresh analyses, latest revisions.</p>
			</header>

			<div class="case-grid case-grid--four">
				{#each data.recentlyUpdated as post, i (post.slug)}
					{@const topic = (post.type?.[0] ?? 'POP CULTURE')
						.toString()
						.replace(/-/g, ' ')
						.toUpperCase()}
					{@const label = getRecencyLabel(post.lastmod, post.date)}
					<a href="/pop-culture/{post.slug}" class="case-card" aria-label="Read {post.title}">
						<div class="case-image-wrap">
							{#if post.pic}
								<img
									src={`/blogs/s-${post.pic}.webp`}
									alt={post.title}
									class="case-image"
									loading={i < 4 ? 'eager' : 'lazy'}
									width="320"
									height="240"
									decoding="async"
								/>
							{:else}
								<div class="case-image-stub" aria-hidden="true">
									<span class="mono">[ANALYSIS]</span>
								</div>
							{/if}
						</div>
						<div class="case-card-body">
							<span class="mono case-id">
								№ {fileNumber(post.slug, i)} · {topic}
							</span>
							<h3 class="case-name">{post.title}</h3>
							{#if post.description}
								<p class="case-subtitle">{post.description}</p>
							{/if}
							{#if label}
								<span class="mono case-recency">{label}</span>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<!-- =====================================================================
	  §04 ALL ANALYSES — remaining posts as case-file cards.
	  Pop-culture posts are uniformly tagged `situational`, so we present them
	  as a single sub-block ("04a · ALL ANALYSES") rather than splitting by topic.
	  ===================================================================== -->
	{#if remainingBlogs.length > 0}
		<section class="by-topic" id="all-analyses">
			<header class="section-head">
				<SectionKicker class="section-tag" num="04" label="THE LIBRARY" />
				<h2 class="display-md">All analyses.</h2>
				<p class="section-sub">Deep dives into the personalities behind public stories.</p>
			</header>

			<div class="topic-block">
				<header class="topic-block-head">
					<SectionKicker
						tone="data"
						num="04a"
						label="TOPIC · ALL ANALYSES"
						class="topic-block-kicker"
					/>
					<h3 class="display-sm">All reads.</h3>
					<p class="topic-block-sub">
						Celebrities, criminals, characters, and cultural moments &mdash; through the 9 emotional
						patterns.
					</p>
				</header>

				<div class="case-grid case-grid--four">
					{#each remainingBlogs as post, i (post.slug)}
						{@const label = getRecencyLabel(post.lastmod, post.date)}
						<a href="/pop-culture/{post.slug}" class="case-card" aria-label="Read {post.title}">
							<div class="case-image-wrap">
								{#if post.pic}
									<img
										src={`/blogs/s-${post.pic}.webp`}
										alt={post.title}
										class="case-image"
										loading="lazy"
										width="320"
										height="240"
										decoding="async"
									/>
								{:else}
									<div class="case-image-stub" aria-hidden="true">
										<span class="mono">[ANALYSIS]</span>
									</div>
								{/if}
							</div>
							<div class="case-card-body">
								<span class="mono case-id">
									№ {fileNumber(post.slug, i)} · POP CULTURE
								</span>
								<h3 class="case-name">{post.title}</h3>
								{#if post.description}
									<p class="case-subtitle">{post.description}</p>
								{/if}
								{#if post.date}
									<span class="mono case-date">{formatDate(post.date)}</span>
								{/if}
								{#if label}
									<span class="mono case-recency">{label}</span>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			</div>
		</section>
	{/if}

	<!-- =====================================================================
	  §06 CTA — quiet V5-styled outro (preserved from legacy bottom block)
	  ===================================================================== -->
	<section class="cta">
		<div class="cta-inner">
			<SectionKicker class="section-tag" num="06" label="GO DEEPER" />
			<h2 class="display-md">Dive deeper into personality.</h2>
			<p class="section-sub">
				Explore how the Enneagram reveals hidden patterns in pop culture, from criminal minds to
				creative genius.
			</p>
			<div class="cta-actions">
				<Button size="md" variant="primary" href="/enneagram-corner">Learn the Enneagram</Button>
				<Button size="md" variant="ghost" href="/personality-analysis">Famous People</Button>
			</div>
		</div>
	</section>
</div>

<style lang="scss">
	/* =========================================================
	  /pop-culture — Streetlamp Symposium index page.
	  Bridge tokens (--lamp-*, --night-*, --stone-*, --ink-*, --data-*,
	  --pool-rgb, --pool-deep-rgb) ship globally in src/scss/index.scss.
	  Local-only overrides scoped to .library-index.
	  ========================================================= */
	.library-index {
		--pool-alpha-strong: 0.28;
		--pool-alpha-mid: 0.18;
		--pool-alpha-soft: 0.08;
		--statue-blend: screen;
		--grain-opacity: 0.05;

		background: var(--night-deep);
		color: var(--ink-bright);
		font-family: var(--font-display);
		min-height: 100vh;
		position: relative;
		overflow: hidden;

		:global(:root.light) & {
			--pool-alpha-strong: 0.14;
			--pool-alpha-mid: 0.08;
			--pool-alpha-soft: 0.04;
			--statue-blend: normal;
			--grain-opacity: 0.025;
		}
	}

	/* ---------- shared utilities ---------- */
	.library-index :global(.mono) {
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-dim);
	}

	.display-xl {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: clamp(36px, 6.4vw, 64px);
		line-height: 1.04;
		letter-spacing: -0.04em;
		color: var(--ink-bright);
		margin: 0;
	}

	.display-md {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(28px, 4vw, 40px);
		line-height: 1.1;
		letter-spacing: -0.02em;
		color: var(--ink-bright);
		margin: 0;
	}

	.display-sm {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(22px, 2.6vw, 28px);
		line-height: 1.18;
		letter-spacing: -0.015em;
		color: var(--ink-bright);
		margin: 0;
	}

	.library-index :global(.section-tag) {
		display: inline-block;
		margin-bottom: 14px;
		color: var(--lamp-glow);
	}

	.library-index :global(p),
	.library-index :global(h1),
	.library-index :global(h2),
	.library-index :global(h3) {
		margin: 0;
	}

	.library-index :global(a) {
		color: inherit;
		text-decoration: none;
	}

	.section-head {
		max-width: 820px;
		margin: 0 auto 40px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	.section-sub {
		font-family: var(--font-display);
		font-size: 17px;
		line-height: 1.55;
		color: var(--ink-mid);
		max-width: 640px;
	}

	/* ---------- subtle paper grain (hero only) ---------- */
	.grain {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: var(--grain-opacity);
		mix-blend-mode: overlay;
		z-index: 1;
		background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.95 0 0 0 0 0.85 0 0 0 0 0.6 0 0 0 0.7 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
	}

	/* =========================================================
	  §01 HERO
	  ========================================================= */
	.hero {
		position: relative;
		padding: 96px 48px 72px;
		background: var(--night-deep);
		overflow: hidden;

		@media (max-width: 768px) {
			padding: 64px 20px 56px;
		}
	}

	.hero-pool {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(
				ellipse 60% 55% at 18% 8%,
				rgba(var(--pool-rgb), var(--pool-alpha-strong)) 0%,
				rgba(var(--pool-rgb), var(--pool-alpha-soft)) 30%,
				transparent 60%
			),
			radial-gradient(
				ellipse 90% 70% at 22% 12%,
				rgba(var(--pool-deep-rgb), var(--pool-alpha-mid)) 0%,
				transparent 55%
			);
		z-index: 0;
	}

	.hero-inner {
		position: relative;
		z-index: 2;
		max-width: 1280px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1.15fr 0.85fr;
		gap: 56px;
		align-items: center;

		@media (max-width: 968px) {
			grid-template-columns: 1fr;
			gap: 24px;
		}
	}

	.hero-text {
		max-width: 720px;
	}

	.hero-eyebrow {
		margin-bottom: 22px;
	}

	.scale-marker {
		display: flex;
		align-items: flex-end;
		gap: 6px;
		height: 18px;
		margin: 24px 0 14px;
		opacity: 0.7;

		.tick {
			width: 1px;
			height: 8px;
			background: var(--stone-edge);

			&--major {
				height: 16px;
				background: var(--lamp-glow);
				width: 1.5px;
			}
		}
	}

	.coords {
		color: var(--ink-dim);
		margin-bottom: 28px;
	}

	.hero-subhead {
		font-family: var(--font-display);
		font-size: 18px;
		line-height: 1.55;
		color: var(--ink-mid);
		max-width: 640px;
		font-weight: 400;

		@media (max-width: 540px) {
			font-size: 16px;
		}
	}

	.hero-subhead-line-1 {
		margin-bottom: 10px;
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 28px;
	}

	.hero-subject {
		position: relative;

		@media (max-width: 968px) {
			display: none;
		}
	}

	.subject-frame {
		position: relative;
		aspect-ratio: 4 / 5;
		max-height: 460px;
		margin-left: auto;
		overflow: hidden;
	}

	.statue {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 30%;
		filter: contrast(1.18) brightness(1.04) saturate(0.88);
		mix-blend-mode: var(--statue-blend);
	}

	:global(:root.light) .library-index .statue {
		filter: contrast(1.05) brightness(1) saturate(1);
	}

	.subject-vignette {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(ellipse at 25% 25%, rgba(var(--pool-rgb), 0.22) 0%, transparent 55%),
			linear-gradient(135deg, transparent 35%, rgba(10, 8, 7, 0.65) 100%),
			linear-gradient(180deg, transparent 60%, rgba(10, 8, 7, 0.85) 100%);
	}

	:global(:root.light) .library-index .subject-vignette {
		background:
			radial-gradient(ellipse at 25% 25%, rgba(var(--pool-rgb), 0.08) 0%, transparent 55%),
			linear-gradient(135deg, transparent 60%, rgba(180, 83, 9, 0.06) 100%);
	}

	.subject-mono {
		position: absolute;
		left: 12px;
		bottom: 12px;
		color: var(--ink-mid);

		.mono {
			color: var(--ink-mid);
		}
	}

	/* =========================================================
	  Section blocks — alternating night-deep / night-mid rhythm
	  ========================================================= */
	.featured,
	.by-topic,
	.cta {
		padding: 96px 48px;
		background: var(--night-deep);
		border-top: 1px solid var(--stone-edge);

		@media (max-width: 768px) {
			padding: 64px 20px;
		}
	}

	.recent {
		padding: 96px 48px;
		background: var(--night-mid);
		border-top: 1px solid var(--stone-edge);

		@media (max-width: 768px) {
			padding: 64px 20px;
		}
	}

	/* =========================================================
	  Case-file card grid
	  ========================================================= */
	.case-grid {
		max-width: 1280px;
		margin: 0 auto;
		display: grid;
		gap: 22px;
	}

	.case-grid--four {
		grid-template-columns: repeat(4, 1fr);

		@media (max-width: 1024px) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (max-width: 480px) {
			grid-template-columns: 1fr;
		}
	}

	.case-card {
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		transition:
			background 0.2s ease,
			border-color 0.2s ease,
			transform 0.2s ease;

		&:hover {
			background: var(--stone-mid);
			border-color: var(--ink-dim);
			transform: translateY(-2px);
		}
	}

	.case-image-wrap {
		position: relative;
		border-bottom: 1px solid var(--stone-edge);
	}

	.case-image {
		display: block;
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		object-position: center 25%;
		filter: contrast(1.05) brightness(0.96) saturate(0.92);
	}

	:global(:root.light) .library-index .case-image {
		filter: contrast(1.02) brightness(1) saturate(0.96);
	}

	.case-image-stub {
		aspect-ratio: 4 / 3;
		background: var(--stone-mid);
		background-image: repeating-linear-gradient(
			45deg,
			transparent 0,
			transparent 14px,
			rgba(var(--pool-rgb), 0.04) 14px,
			rgba(var(--pool-rgb), 0.04) 15px
		);
		display: flex;
		align-items: center;
		justify-content: center;

		.mono {
			color: var(--ink-dim);
			font-size: 11px;
		}
	}

	.case-card-body {
		padding: 18px 20px 22px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		flex: 1;
	}

	.case-id {
		color: var(--lamp-glow);
		font-size: 10.5px;
	}

	.case-name {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 19px;
		line-height: 1.22;
		color: var(--ink-bright);
		letter-spacing: -0.02em;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.case-subtitle {
		font-family: var(--font-display);
		font-size: 14px;
		line-height: 1.5;
		color: var(--ink-mid);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.case-recency {
		color: var(--lamp-glow);
		font-size: 10.5px;
		margin-top: 4px;
	}

	.case-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px;
		margin-top: 6px;
	}

	.case-date {
		color: var(--ink-dim);
		font-size: 10.5px;
	}

	/* =========================================================
	  §02 FEATURED — bigger card. Single-card layout when only one
	  featured exists (server returns 1 here).
	  ========================================================= */
	.featured-grid {
		max-width: 1280px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 28px;

		@media (max-width: 768px) {
			grid-template-columns: 1fr;
			gap: 22px;
		}
	}

	.featured-grid--single {
		max-width: 880px;
		grid-template-columns: 1fr;
	}

	.case-card--featured {
		.case-image-wrap--featured {
			border-top: 3px solid var(--lamp-glow);
			opacity: 1;
		}

		.case-image-wrap--featured .case-image {
			aspect-ratio: 16 / 11;

			@media (max-width: 540px) {
				aspect-ratio: 4 / 3;
			}
		}
	}

	.case-name--featured {
		font-size: clamp(22px, 2.4vw, 30px);
		line-height: 1.14;
		-webkit-line-clamp: 3;
		line-clamp: 3;
	}

	.case-subtitle--featured {
		font-size: 15px;
		-webkit-line-clamp: 3;
		line-clamp: 3;
	}

	/* =========================================================
	  §04 BY TOPIC — single sub-block
	  ========================================================= */
	.by-topic {
		.section-head {
			margin-bottom: 56px;
		}
	}

	.topic-block {
		max-width: 1280px;
		margin: 0 auto 72px;
		scroll-margin-top: 72px;

		&:last-child {
			margin-bottom: 0;
		}

		@media (max-width: 768px) {
			margin-bottom: 56px;
		}
	}

	.topic-block-head {
		max-width: 720px;
		margin: 0 auto 28px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding-bottom: 18px;
		border-bottom: 1px solid var(--stone-edge);
		position: relative;

		&::after {
			content: '';
			position: absolute;
			left: 50%;
			bottom: -1px;
			width: 80px;
			height: 2px;
			background: var(--data-teal);
			transform: translateX(-50%);
			border-radius: 1px;
		}
	}

	.library-index :global(.topic-block-kicker) {
		color: var(--data-teal);
	}

	.topic-block-sub {
		font-family: var(--font-display);
		font-size: 15px;
		line-height: 1.55;
		color: var(--ink-mid);
		max-width: 580px;
	}

	/* =========================================================
	  §06 CTA outro
	  ========================================================= */
	.cta-inner {
		max-width: 720px;
		margin: 0 auto;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
	}

	.cta-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 12px;
		margin-top: 12px;
	}

	/* =========================================================
	  Mobile tightening
	  ========================================================= */
	@media (max-width: 540px) {
		.case-card-body {
			padding: 14px 16px 18px;
		}

		.case-name {
			font-size: 16px;
		}

		.case-subtitle {
			font-size: 13px;
		}
	}
</style>
