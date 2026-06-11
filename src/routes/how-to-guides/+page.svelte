<!-- src/routes/how-to-guides/+page.svelte -->
<!--
  /how-to-guides index — Streetlamp Symposium V5.
  Phase 5 page #5c of docs/design/2026-05-04-rollout-plan.md.

  Template: src/routes/enneagram-corner/+page.svelte (already migrated).
  Spec: docs/design-system.md §4–§6, /design-preview/v5.

  Server load (untouched): returns { posts, featured, recentlyUpdated }.
  V5 tokens (--lamp-*, --night-*, --stone-*, --ink-*, --data-*, --pool-*) live
  in src/scss/index.scss bridge blocks; this file references them via var(--…).

  Note: most guide posts have no `type` frontmatter, so we drop topic-grouping
  for this index and present a single "All Guides" sub-section under §04.
-->
<script lang="ts">
	import type { PageData } from './$types';
	import type { FAQItem } from '$lib/types/faq';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import FAQSection from '$lib/components/blog/FAQSection.svelte';
	import { Button, SectionKicker } from '$lib/components/atoms';
	// Shared listing atoms — extracted 2026-06-10 (design audit): five listing
	// pages were ~1,000-line near-clones of the same hero/card/grid grammar.
	import IndexHero from '$lib/components/marketing/IndexHero.svelte';
	import CaseCard from '$lib/components/marketing/CaseCard.svelte';
	import CaseGrid from '$lib/components/marketing/CaseGrid.svelte';
	import { buildBreadcrumbSchemaForGraph, buildFAQSchemaForGraph } from '$lib/utils/schema';

	let { data }: { data: PageData } = $props();

	// ------------------------------------------------------------------
	// FAQ — preserved verbatim from the legacy file (drives <FAQSection> +
	// the FAQPage JSON-LD via buildFAQSchemaForGraph below).
	// ------------------------------------------------------------------
	const guidesFAQs: FAQItem[] = [
		{
			question: 'What kind of guides does 9takes offer?',
			answer:
				'Our guides cover practical life skills through the Enneagram lens: navigating difficult conversations, understanding relationship dynamics, handling workplace challenges, and personal growth strategies. Each guide provides actionable steps tailored to different personality types.'
		},
		{
			question: 'How do these guides differ from generic advice?',
			answer:
				'Generic advice assumes one approach works for everyone. Our guides recognize that a Type 8 handles confrontation differently than a Type 9. We provide type-specific strategies, helping you work with your natural tendencies rather than against them.'
		},
		{
			question: 'Do I need to know my Enneagram type to use these guides?',
			answer:
				"Knowing your type helps you apply guides more effectively, but they work even if you're unsure. Many guides cover all 9 types, so you can identify which approach resonates with you. Use the guides as both practical advice and self-discovery tools."
		},
		{
			question: 'How can I apply these guides to my relationships?',
			answer:
				"Start by understanding your type's communication style and blind spots. Then identify patterns in your conflicts. Our relationship guides show how different types misunderstand each other and provide scripts for bridging those gaps in specific situations."
		},
		{
			question: 'Are these guides based on research?',
			answer:
				'Our guides combine Enneagram wisdom with practical psychology and real-world application. We draw from relationship research, communication studies, and decades of Enneagram teaching. Every guide is designed to produce measurable improvements in specific situations.'
		},
		{
			question: 'How often are new guides published?',
			answer:
				'We add new guides regularly based on reader questions and real-life situations people face. Topics range from everyday scenarios to major life transitions. Sign up for our newsletter to get notified when new guides launch.'
		}
	];

	// ------------------------------------------------------------------
	// Remaining posts after featured + recently-updated are excluded.
	// ------------------------------------------------------------------
	const remainingPosts = $derived.by(() => {
		const excluded = new Set([
			...data.featured.map((p) => p.slug),
			...data.recentlyUpdated.map((p) => p.slug)
		]);
		return data.posts.filter((p) => !excluded.has(p.slug));
	});

	const publishedCount = $derived(data.posts.length);

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

	// ------------------------------------------------------------------
	// SEO + structured data — preserved verbatim from the legacy file.
	// ------------------------------------------------------------------
	const jsonLd = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'CollectionPage',
				'@id': 'https://9takes.com/how-to-guides#webpage',
				name: 'How-To Guides | Practical Life Advice | 9takes',
				description:
					'Practical guides to help you navigate life, relationships, and personal growth with the Enneagram.',
				url: 'https://9takes.com/how-to-guides',
				inLanguage: 'en-US',
				publisher: {
					'@type': 'Organization',
					name: '9takes',
					url: 'https://9takes.com'
				},
				breadcrumb: { '@id': 'https://9takes.com/how-to-guides#breadcrumb' }
			},
			{
				'@id': 'https://9takes.com/how-to-guides#breadcrumb',
				...buildBreadcrumbSchemaForGraph([
					{ name: 'Home', url: 'https://9takes.com' },
					{ name: 'How-To Guides', url: 'https://9takes.com/how-to-guides' }
				])
			},
			{
				'@id': 'https://9takes.com/how-to-guides#faq',
				...buildFAQSchemaForGraph(guidesFAQs)
			}
		]
	};
</script>

<SEOHead
	title="How-To Guides | Practical Life Advice | 9takes"
	description="Practical guides to help you navigate life, relationships, and personal growth with the Enneagram."
	canonical="https://9takes.com/how-to-guides"
	{jsonLd}
/>

<div class="library-index">
	<!-- =====================================================================
	  §01 OBSERVATION — hero + statue + tagline + subtext
	  ===================================================================== -->
	<IndexHero
		title="How-to guides."
		line1="Step-by-step playbooks for using the Enneagram in real situations — conflict, dating, work, family."
		line2={`${publishedCount} guides. Tactical, not theoretical.`}
		imageSrc="/greek_pantheon.webp"
		imageMono="9TAKES · CASE FILES · HOW-TO GUIDES"
	>
		{#snippet actions()}
			<Button size="md" variant="primary" href="#latest">Read Latest Guide</Button>
			<Button size="md" variant="ghost" href="/enneagram-corner">Learn the Enneagram</Button>
		{/snippet}
	</IndexHero>

	<!-- =====================================================================
	  §02 FEATURED — large case-file card (server provides 1)
	  ===================================================================== -->
	{#if data.featured.length > 0}
		<section class="featured" id="latest">
			<header class="section-head">
				<SectionKicker class="section-tag" num="02" label="FEATURED" />
				<h2 class="display-md">Featured guide.</h2>
				<p class="section-sub">Most recently updated. Worth your full attention.</p>
			</header>

			<!-- CaseGrid has no single-card mode; the server returns exactly 1 featured
			     guide, which renders centered at 880px — wrapper kept local. -->
			<div class="featured-wrap" class:featured-wrap--single={data.featured.length === 1}>
				{#each data.featured as post, i (post.slug)}
					{@const topic = (post.type?.[0] ?? 'GUIDE').toString().replace(/-/g, ' ').toUpperCase()}
					<CaseCard
						href="/how-to-guides/{post.slug}"
						title={post.title}
						eyebrow={topic}
						description={post.description}
						imageSrc={post.pic ? `/blogs/${post.pic}.webp` : null}
						featured={true}
						date={post.date ? formatDate(post.lastmod ?? post.date) : ''}
						recency={getRecencyLabel(post.lastmod, post.date) ?? ''}
						eager={i < 2}
						priority={i < 2}
						stubLabel="[GUIDE]"
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
				<p class="section-sub">Fresh playbooks, latest revisions.</p>
			</header>

			<CaseGrid columns={4}>
				{#each data.recentlyUpdated as post, i (post.slug)}
					{@const topic = (post.type?.[0] ?? 'GUIDE').toString().replace(/-/g, ' ').toUpperCase()}
					<CaseCard
						href="/how-to-guides/{post.slug}"
						title={post.title}
						eyebrow={topic}
						description={post.description}
						imageSrc={post.pic ? `/blogs/s-${post.pic}.webp` : null}
						recency={getRecencyLabel(post.lastmod, post.date) ?? ''}
						eager={i < 4}
						stubLabel="[GUIDE]"
					/>
				{/each}
			</CaseGrid>
		</section>
	{/if}

	<!-- =====================================================================
	  §04 ALL GUIDES — remaining posts as case-file cards.
	  Most guides lack a `type` field, so we present them as a single sub-block
	  ("04a · ALL GUIDES") rather than splitting by topic.
	  ===================================================================== -->
	{#if remainingPosts.length > 0}
		<section class="by-topic" id="all-guides">
			<header class="section-head">
				<SectionKicker class="section-tag" num="04" label="THE LIBRARY" />
				<h2 class="display-md">More guides.</h2>
				<p class="section-sub">
					Everything else worth reading. Pick the situation you&rsquo;re in.
				</p>
			</header>

			<div class="topic-block">
				<header class="topic-block-head">
					<SectionKicker
						tone="data"
						num="04a"
						label="TOPIC · ALL GUIDES"
						class="topic-block-kicker"
					/>
					<h3 class="display-sm">All guides.</h3>
					<p class="topic-block-sub">
						Decoded the way an actual reader would &mdash; relationships, work, growth, conflict.
					</p>
				</header>

				<CaseGrid columns={4}>
					{#each remainingPosts as post (post.slug)}
						<CaseCard
							href="/how-to-guides/{post.slug}"
							title={post.title}
							eyebrow="GUIDE"
							description={post.description}
							imageSrc={post.pic ? `/blogs/s-${post.pic}.webp` : null}
							recency={getRecencyLabel(post.lastmod, post.date) ?? ''}
							stubLabel="[GUIDE]"
						/>
					{/each}
				</CaseGrid>
			</div>
		</section>
	{/if}

	<!-- =====================================================================
	  §05 FAQ — preserved component (drives the FAQPage JSON-LD too)
	  ===================================================================== -->
	<section class="faq">
		<FAQSection faqs={guidesFAQs} title="About Our Guides" num="05" />
	</section>

	<!-- =====================================================================
	  §06 CTA — quiet V5-styled outro
	  ===================================================================== -->
	<section class="cta">
		<div class="cta-inner">
			<SectionKicker class="section-tag" num="06" label="START HERE" />
			<h2 class="display-md">Ready to put a guide to work?</h2>
			<p class="section-sub">
				Find your type first &mdash; then come back and pick the playbook that fits the situation.
			</p>
			<div class="cta-actions">
				<Button size="md" variant="primary" href="/enneagram-test">Take the Test</Button>
				<Button size="md" variant="ghost" href="/enneagram-corner">Learn the Basics</Button>
			</div>
		</div>
	</section>
</div>

<style lang="scss">
	/* =========================================================
	  /how-to-guides — Streetlamp Symposium index page.
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

	.recent,
	.faq {
		padding: 96px 48px;
		background: var(--night-mid);
		border-top: 1px solid var(--stone-edge);

		@media (max-width: 768px) {
			padding: 64px 20px;
		}
	}

	.faq {
		padding-left: 0;
		padding-right: 0;
	}

	/* Case-file card + grid styles live in marketing/CaseCard.svelte and
	   marketing/CaseGrid.svelte (extracted 2026-06-10). */

	/* =========================================================
	  §02 FEATURED wrapper — single-card layout when only one
	  featured exists (server returns 1 here); CaseGrid has no
	  single-card mode, so this recipe stays local.
	  ========================================================= */
	.featured-wrap {
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

	.featured-wrap--single {
		max-width: 880px;
		grid-template-columns: 1fr;
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
			border-radius: 9999px;
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

	/* Card mobile tightening lives in marketing/CaseCard.svelte. */
</style>
