<!-- src/routes/community/+page.svelte -->
<!--
  /community index — Streetlamp Symposium V5.
  Phase 5 page #5b of docs/design/2026-05-04-rollout-plan.md.

  Template: src/routes/enneagram-corner/+page.svelte (already migrated).
  Spec: docs/design-system.md §4–§6, /design-preview/v5.

  Server load (untouched): returns { posts, featured, recentlyUpdated }.
  V5 tokens (--lamp-*, --night-*, --stone-*, --ink-*, --data-*, --pool-*) live
  in src/scss/index.scss bridge blocks; this file references them via var(--…).
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
	const communityFAQs: FAQItem[] = [
		{
			question: 'What is 9takes?',
			answer:
				'9takes is a personality-based Q&A platform built on the Enneagram system. We help you see how different personality types think about the same situations. Submit anonymous questions, give your perspective first, then discover how all 9 types approach the same topic differently.'
		},
		{
			question: 'Why focus on personality types for Q&A?',
			answer:
				"Most platforms show you popular opinions. We show you diverse perspectives based on how people actually think. A Type 5's analytical response differs from a Type 2's empathetic take. Seeing this range expands your understanding and reduces judgment of others."
		},
		{
			question: 'What does "give-first" commenting mean?',
			answer:
				"Before viewing others' responses, you must contribute your own perspective. This prevents groupthink and ensures authentic answers. You'll see the diversity of thought only after adding your voice. It's designed to promote genuine expression over social conformity."
		},
		{
			question: 'How is my Enneagram type used?',
			answer:
				"Your type adds context to your responses, helping others understand where you're coming from. It's displayed alongside your answer so readers can see patterns in how different types think. You can participate anonymously while still contributing personality-based insights."
		},
		{
			question: 'Who creates content for 9takes?',
			answer:
				'Our team combines Enneagram expertise with practical psychology. We create guides, type analyses, and educational content based on research and real-world application. Community members also contribute questions and perspectives that fuel discussions.'
		},
		{
			question: 'How can I get involved in the community?',
			answer:
				'Start by answering questions on topics you care about. Explore celebrity type analyses and share your thoughts. Follow our blog for new content. If you want deeper engagement, sign up for our newsletter or book a coaching session to explore your type.'
		}
	];

	// ------------------------------------------------------------------
	// Topic catalog — drives §04 BY TOPIC sub-blocks. Each entry pairs
	// a `type[0]` value (matches blog frontmatter) with display copy.
	// Order here is the on-page order. Topic kickers count from 04a → 04c.
	// ------------------------------------------------------------------
	type TopicMeta = {
		id: string;
		type: string;
		title: string;
		descriptor: string;
		viewAllHref: string | null;
	};
	const topics: TopicMeta[] = [
		{
			id: 'ideas',
			type: 'idea',
			title: 'Ideas',
			descriptor: 'Essays, frameworks, and the thinking under the platform.',
			viewAllHref: null
		},
		{
			id: 'inspiration',
			type: 'inspiration',
			title: 'Inspiration',
			descriptor: 'The moments and observations that sparked 9takes.',
			viewAllHref: null
		},
		{
			id: 'opinion',
			type: 'opinion',
			title: 'Opinion',
			descriptor: 'Takes worth saying out loud.',
			viewAllHref: null
		}
	];

	const publishedCount = $derived(data.posts.length);

	// Group posts by type[0]; exclude items already shown in §02/§03.
	const blogsByType = $derived.by(() => {
		const excluded = new Set([
			...data.featured.map((p) => p.slug),
			...data.recentlyUpdated.map((p) => p.slug)
		]);
		const map = new Map<string, typeof data.posts>();
		for (const post of data.posts) {
			if (excluded.has(post.slug)) continue;
			const t = post.type?.[0] ?? '';
			if (!map.has(t)) map.set(t, []);
			map.get(t)!.push(post);
		}
		return map;
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

	function topicSuffix(i: number): string {
		return String.fromCharCode(97 + (i % 26));
	}

	// ------------------------------------------------------------------
	// SEO + structured data — preserved verbatim from the legacy file.
	// ------------------------------------------------------------------
	const jsonLd = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'CollectionPage',
				'@id': 'https://9takes.com/community#webpage',
				name: '9takes Community | Ideas & Inspiration',
				description:
					'Discover the inspiration and ideas behind 9takes. Explore our community blog posts.',
				url: 'https://9takes.com/community',
				inLanguage: 'en-US',
				publisher: {
					'@type': 'Organization',
					name: '9takes',
					url: 'https://9takes.com'
				},
				breadcrumb: { '@id': 'https://9takes.com/community#breadcrumb' }
			},
			{
				'@id': 'https://9takes.com/community#breadcrumb',
				...buildBreadcrumbSchemaForGraph([
					{ name: 'Home', url: 'https://9takes.com' },
					{ name: 'Community', url: 'https://9takes.com/community' }
				])
			},
			{
				'@id': 'https://9takes.com/community#faq',
				...buildFAQSchemaForGraph(communityFAQs)
			}
		]
	};
</script>

<SEOHead
	title="9takes Community | Ideas & Inspiration"
	description="Discover the inspiration and ideas behind 9takes. Explore our community blog posts."
	canonical="https://9takes.com/community"
	{jsonLd}
/>

<div class="library-index">
	<!-- =====================================================================
	  §01 OBSERVATION — hero + statue + tagline + subtext
	  ===================================================================== -->
	<IndexHero
		title="The takes of 9takes."
		line1="Real situations. Honest reads. The pieces our community keeps coming back to."
		line2={`${publishedCount} reads. From the people who actually use the platform.`}
		imageSrc="/philosopher-gathering.webp"
		imageMono="9TAKES · CASE FILES · COMMUNITY"
	>
		{#snippet actions()}
			<Button size="md" variant="primary" href="#latest">Read Latest</Button>
			<Button size="md" variant="ghost" href="/questions">Answer Questions</Button>
		{/snippet}
	</IndexHero>

	<!-- =====================================================================
	  §02 FEATURED — large case-file cards (server provides up to 2)
	  ===================================================================== -->
	{#if data.featured.length > 0}
		<section class="featured" id="latest">
			<header class="section-head">
				<SectionKicker class="section-tag" num="02" label="FEATURED" />
				<h2 class="display-md">Featured.</h2>
				<p class="section-sub">Most recently updated. Worth your full attention.</p>
			</header>

			<CaseGrid columns={2}>
				{#each data.featured as post, i (post.slug)}
					{@const topic = (post.type?.[0] ?? 'COMMUNITY')
						.toString()
						.replace(/-/g, ' ')
						.toUpperCase()}
					<CaseCard
						href="/community/{post.slug}"
						title={post.title}
						eyebrow={topic}
						description={post.description}
						imageSrc={post.pic ? `/blogs/${post.pic}.webp` : null}
						featured={true}
						date={post.date ? formatDate(post.lastmod ?? post.date) : ''}
						recency={getRecencyLabel(post.lastmod, post.date) ?? ''}
						eager={i < 2}
						priority={i < 2}
					/>
				{/each}
			</CaseGrid>
		</section>
	{/if}

	<!-- =====================================================================
	  §03 RECENTLY UPDATED — 4 case-file cards
	  ===================================================================== -->
	{#if data.recentlyUpdated.length > 0}
		<section class="recent" id="recent">
			<header class="section-head">
				<SectionKicker class="section-tag" num="03" label="RECENTLY UPDATED" />
				<h2 class="display-md">Recently updated.</h2>
				<p class="section-sub">Fresh insights, latest revisions.</p>
			</header>

			<CaseGrid columns={4}>
				{#each data.recentlyUpdated as post, i (post.slug)}
					{@const topic = (post.type?.[0] ?? 'COMMUNITY')
						.toString()
						.replace(/-/g, ' ')
						.toUpperCase()}
					<CaseCard
						href="/community/{post.slug}"
						title={post.title}
						eyebrow={topic}
						description={post.description}
						imageSrc={post.pic ? `/blogs/s-${post.pic}.webp` : null}
						recency={getRecencyLabel(post.lastmod, post.date) ?? ''}
						eager={i < 4}
					/>
				{/each}
			</CaseGrid>
		</section>
	{/if}

	<!-- =====================================================================
	  §04 BY TOPIC — sub-sections grouped by post.type[0]
	  ===================================================================== -->
	<section class="by-topic">
		<header class="section-head">
			<SectionKicker class="section-tag" num="04" label="BY TOPIC" />
			<h2 class="display-md">By topic.</h2>
			<p class="section-sub">Three angles on what we&rsquo;re thinking. Pick your entry point.</p>
		</header>

		{#each topics as topic, ti}
			{@const topicPosts = blogsByType.get(topic.type) ?? []}
			{#if topicPosts.length > 0}
				<div class="topic-block" id={topic.id}>
					<header class="topic-block-head">
						<SectionKicker
							tone="data"
							num={`04${topicSuffix(ti)}`}
							label={`TOPIC · ${topic.title.toUpperCase()}`}
							class="topic-block-kicker"
						/>
						<h3 class="display-sm">{topic.title}.</h3>
						<p class="topic-block-sub">{topic.descriptor}</p>
					</header>

					<CaseGrid columns={4}>
						{#each topicPosts.slice(0, 8) as post (post.slug)}
							<CaseCard
								href="/community/{post.slug}"
								title={post.title}
								eyebrow={topic.title.toUpperCase()}
								description={post.description}
								imageSrc={post.pic ? `/blogs/s-${post.pic}.webp` : null}
								recency={getRecencyLabel(post.lastmod, post.date) ?? ''}
							/>
						{/each}
					</CaseGrid>

					{#if topic.viewAllHref}
						<div class="topic-block-cta">
							<Button size="sm" variant="ghost" href={topic.viewAllHref}>
								View all {topic.title} reads &rarr;
							</Button>
						</div>
					{/if}
				</div>
			{/if}
		{/each}
	</section>

	<!-- =====================================================================
	  §05 FAQ — preserved component (drives the FAQPage JSON-LD too)
	  ===================================================================== -->
	<section class="faq">
		<FAQSection faqs={communityFAQs} title="About 9takes" num="05" />
	</section>

	<!-- =====================================================================
	  §06 CTA — quiet V5-styled outro
	  ===================================================================== -->
	<section class="cta">
		<div class="cta-inner">
			<SectionKicker class="section-tag" num="06" label="JOIN IN" />
			<h2 class="display-md">Ready to add your take?</h2>
			<p class="section-sub">
				Answer questions, compare reads with the other 8 types, and see what your perspective is
				worth.
			</p>
			<div class="cta-actions">
				<Button size="md" variant="primary" href="/questions">Answer Questions</Button>
				<Button size="md" variant="ghost" href="/enneagram-corner">Learn the Enneagram</Button>
			</div>
		</div>
	</section>
</div>

<style lang="scss">
	/* =========================================================
	  /community — Streetlamp Symposium index page.
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
	  §04 BY TOPIC — per-topic sub-blocks
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

	.topic-block-cta {
		margin-top: 28px;
		display: flex;
		justify-content: center;
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
