<!-- src/routes/pop-culture/+page.svelte -->
<!--
  /pop-culture index — Streetlamp Symposium V5.
  Phase 5 page #5d of docs/design/2026-05-04-rollout-plan.md.

  Template: src/routes/enneagram-corner/+page.svelte (already migrated).
  Spec: docs/design-system.md §4–§6, /design-preview/v5.

  Server load returns { popCultureBlogs, featured, recentlyUpdated, categoryGroups }.
  V5 tokens (--lamp-*, --night-*, --stone-*, --ink-*, --data-*, --pool-*) live
  in src/scss/index.scss bridge blocks; this file references them via var(--…).

  Pop-culture posts are organized by the `popCulture` frontmatter object:
  category -> subcategory -> optional series. The index groups by that taxonomy
  because `type[0]` is intentionally generic across this section.
-->
<script lang="ts">
	import type { PageData } from './$types';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import { Button, SectionKicker } from '$lib/components/atoms';
	// Shared listing atoms — extracted 2026-06-10 (design audit): five listing
	// pages were ~1,000-line near-clones of the same hero/card/grid grammar.
	import IndexHero from '$lib/components/marketing/IndexHero.svelte';
	import CaseCard from '$lib/components/marketing/CaseCard.svelte';
	import CaseGrid from '$lib/components/marketing/CaseGrid.svelte';

	let { data }: { data: PageData } = $props();
	type PopCultureIndexPost = PageData['popCultureBlogs'][number];

	const publishedCount = $derived(data.popCultureBlogs.length);
	const MIN_POSTS_PER_VISIBLE_SUBCATEGORY = 3;
	const MIN_VISIBLE_SUBCATEGORIES = 4;

	const categoryLabels = $derived.by(() => {
		const labels = new Map<string, string>();
		for (const group of data.categoryGroups) {
			labels.set(group.category.slug, group.category.title);
		}
		return labels;
	});

	const subcategoryLabels = $derived.by(() => {
		const labels = new Map<string, string>();
		for (const group of data.categoryGroups) {
			for (const subcategoryGroup of group.subcategories) {
				labels.set(subcategoryGroup.subcategory.slug, subcategoryGroup.subcategory.title);
			}
		}
		return labels;
	});

	// ------------------------------------------------------------------
	// Helpers — mirror /enneagram-corner for visual consistency.
	// ------------------------------------------------------------------
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

	function getTopicLabel(post: PopCultureIndexPost): string {
		const subcategory = post.popCulture?.subcategory;
		const category = post.popCulture?.category;

		if (subcategory && subcategoryLabels.has(subcategory))
			return subcategoryLabels.get(subcategory)!;
		if (category && categoryLabels.has(category)) return categoryLabels.get(category)!;
		return 'POP CULTURE';
	}

	function topicSuffix(i: number): string {
		return String.fromCharCode(97 + (i % 26));
	}

	function shouldSplitSubcategories(group: PageData['categoryGroups'][number]): boolean {
		return (
			group.subcategories.filter(
				(subcategoryGroup) => subcategoryGroup.posts.length >= MIN_POSTS_PER_VISIBLE_SUBCATEGORY
			).length >= MIN_VISIBLE_SUBCATEGORIES
		);
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
	<IndexHero
		title="Pop culture, decoded."
		line1="Movies, shows, fictional characters, public moments — read through the 9 emotional patterns."
		line2={`${publishedCount} reads. The patterns you didn’t see coming.`}
		imageSrc="/greek_distorted_statue_face.png"
		imageMono="9TAKES · CASE FILES · POP CULTURE"
	>
		{#snippet actions()}
			<Button size="md" variant="primary" href="#latest">Start with Latest</Button>
			<Button size="md" variant="ghost" href="#all-analyses">Browse All Analyses</Button>
		{/snippet}
	</IndexHero>

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

			<!-- Kept local (not CaseGrid): single-featured layout centers one card at
			     880px — CaseGrid columns={2} has no single-card mode, and the server
			     returns exactly 1 featured post here. Cards are the shared atom. -->
			<div class="featured-grid" class:featured-grid--single={data.featured.length === 1}>
				{#each data.featured as post, i (post.slug)}
					{@const topic = getTopicLabel(post).toUpperCase()}
					<CaseCard
						href="/pop-culture/{post.slug}"
						title={post.title}
						eyebrow={topic}
						description={post.description}
						imageSrc={post.pic ? `/blogs/${post.pic}.webp` : null}
						featured={true}
						date={post.date ? formatDate(post.lastmod ?? post.date) : ''}
						recency={getRecencyLabel(post.lastmod, post.date) ?? ''}
						eager={i < 2}
						priority={i < 2}
						stubLabel="[ANALYSIS]"
					/>
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

			<CaseGrid columns={4}>
				{#each data.recentlyUpdated as post, i (post.slug)}
					{@const topic = getTopicLabel(post).toUpperCase()}
					<CaseCard
						href="/pop-culture/{post.slug}"
						title={post.title}
						eyebrow={topic}
						description={post.description}
						imageSrc={post.pic ? `/blogs/s-${post.pic}.webp` : null}
						recency={getRecencyLabel(post.lastmod, post.date) ?? ''}
						eager={i < 4}
						stubLabel="[ANALYSIS]"
					/>
				{/each}
			</CaseGrid>
		</section>
	{/if}

	<!-- =====================================================================
	  §04 BY TOPIC — category/subcategory groups from frontmatter
	  ===================================================================== -->
	{#if data.categoryGroups.length > 0}
		<section class="by-topic" id="all-analyses">
			<header class="section-head">
				<SectionKicker class="section-tag" num="04" label="BY TOPIC" />
				<h2 class="display-md">By topic.</h2>
				<p class="section-sub">Choose a cluster and read the pieces that belong together.</p>
			</header>

			{#each data.categoryGroups as group, gi (group.category.slug)}
				<div class="topic-block" id={group.category.slug}>
					<header class="topic-block-head">
						<SectionKicker
							tone="data"
							num={`04${topicSuffix(gi)}`}
							label={`CATEGORY · ${group.category.title.toUpperCase()}`}
							class="topic-block-kicker"
						/>
						<h3 class="display-sm">{group.category.title}.</h3>
						<p class="topic-block-sub">{group.category.descriptor}</p>
					</header>

					{#if shouldSplitSubcategories(group)}
						{#each group.subcategories as subcategoryGroup (subcategoryGroup.subcategory.slug)}
							<div class="subcategory-block" id={subcategoryGroup.subcategory.slug}>
								<header class="subcategory-head">
									<div>
										<p class="mono subcategory-label">SUBCATEGORY</p>
										<h4>{subcategoryGroup.subcategory.title}</h4>
										<p>{subcategoryGroup.subcategory.descriptor}</p>
									</div>
									<span class="mono subcategory-count">
										{subcategoryGroup.posts.length}
										{subcategoryGroup.posts.length === 1 ? 'READ' : 'READS'}
									</span>
								</header>

								<CaseGrid columns={4}>
									{#each subcategoryGroup.posts as post (post.slug)}
										<CaseCard
											href="/pop-culture/{post.slug}"
											title={post.title}
											eyebrow={group.category.title.toUpperCase()}
											description={post.description}
											imageSrc={post.pic ? `/blogs/s-${post.pic}.webp` : null}
											date={post.date ? formatDate(post.date) : ''}
											recency={getRecencyLabel(post.lastmod, post.date) ?? ''}
											stubLabel="[ANALYSIS]"
										/>
									{/each}
								</CaseGrid>
							</div>
						{/each}
					{:else}
						<div class="cluster-block">
							<CaseGrid columns={4}>
								{#each group.posts as post (post.slug)}
									<CaseCard
										href="/pop-culture/{post.slug}"
										title={post.title}
										eyebrow={group.category.title.toUpperCase()}
										description={post.description}
										imageSrc={post.pic ? `/blogs/s-${post.pic}.webp` : null}
										date={post.date ? formatDate(post.date) : ''}
										recency={getRecencyLabel(post.lastmod, post.date) ?? ''}
										stubLabel="[ANALYSIS]"
									/>
								{/each}
							</CaseGrid>
						</div>
					{/if}
				</div>
			{/each}
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
	/* §01 hero + grain styles live in marketing/IndexHero.svelte (extracted 2026-06-10). */

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

	/* Case-file card + grid styles live in marketing/CaseCard.svelte and
	   marketing/CaseGrid.svelte (extracted 2026-06-10). */

	/* =========================================================
	  §02 FEATURED grid — kept local: single-featured layout (one centered
	  880px card) has no CaseGrid equivalent, and the server returns 1 here.
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

	/* =========================================================
	  §04 BY TOPIC — category + subcategory blocks
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

	.subcategory-block {
		max-width: 1280px;
		margin: 0 auto 44px;
		scroll-margin-top: 84px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.subcategory-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 24px;
		margin-bottom: 18px;
		padding: 18px 0 14px;
		border-bottom: 1px solid var(--stone-edge);

		h4 {
			font-family: var(--font-display);
			font-size: 22px;
			line-height: 1.2;
			color: var(--ink-bright);
			margin: 0 0 6px;
			letter-spacing: 0;
		}

		p:not(.mono) {
			font-family: var(--font-display);
			font-size: 14px;
			line-height: 1.5;
			color: var(--ink-mid);
			margin: 0;
			max-width: 620px;
		}

		@media (max-width: 640px) {
			flex-direction: column;
			gap: 10px;

			h4 {
				font-size: 20px;
			}
		}
	}

	.subcategory-label {
		color: var(--data-teal);
		margin-bottom: 8px;
	}

	.subcategory-count {
		color: var(--lamp-glow);
		white-space: nowrap;
		padding-top: 2px;
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

	/* Card mobile tightening lives in marketing/CaseCard.svelte. */
</style>
