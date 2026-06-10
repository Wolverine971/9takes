<!-- src/routes/enneagram-corner/+page.svelte -->
<!--
  /enneagram-corner index — Streetlamp Symposium V5.
  Phase 5 page #5a of docs/design/2026-05-04-rollout-plan.md.

  Visual ground truth: src/routes/personality-analysis/+page.svelte (already migrated).
  Spec: docs/design-system.md §4–§6, /design-preview/v5.

  Server load (untouched): returns { enneagramBlogs, featured, recentlyUpdated }.
  V5 tokens (--lamp-*, --night-*, --stone-*, --ink-*, --data-*, --pool-*) live
  in src/scss/index.scss bridge blocks; this file references them via var(--…).
-->
<script lang="ts">
	import { onMount } from 'svelte';
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

	let { data }: { data: PageData } = $props();

	// ------------------------------------------------------------------
	// Theme-aware pic swap. Each enneagram-type-N-dossier image ships in
	// dark + light variants. Track the actual applied theme on <html> so
	// the right variant renders on this index page reactively when the
	// user toggles the theme toggle.
	// ------------------------------------------------------------------
	let effectiveTheme = $state<'light' | 'dark'>('dark');

	onMount(() => {
		const root = document.documentElement;
		const sync = () => {
			const dataTheme = root.dataset.theme;
			if (dataTheme === 'light' || dataTheme === 'dark') {
				effectiveTheme = dataTheme;
			} else {
				effectiveTheme = root.classList.contains('light') ? 'light' : 'dark';
			}
		};
		sync();
		const obs = new MutationObserver(sync);
		obs.observe(root, { attributes: true, attributeFilter: ['class', 'data-theme'] });
		return () => obs.disconnect();
	});

	// Pics with a paired light variant on disk. Only enneagram-type-N-dossier
	// slugs (1–9) have `${slug}-light.webp`; everything else falls through.
	const HAS_LIGHT_VARIANT = /^enneagram-type-[1-9]-dossier$/;

	function picUrl(pic: string | null | undefined, small = false): string {
		if (!pic) return '';
		const suffix = effectiveTheme === 'light' && HAS_LIGHT_VARIANT.test(pic) ? '-light' : '';
		const prefix = small ? 's-' : '';
		return `/blogs/${prefix}${pic}${suffix}.webp`;
	}

	// ------------------------------------------------------------------
	// FAQ — preserved verbatim from the legacy file (drives <FAQSection> +
	// the FAQPage JSON-LD in <svelte:head> below).
	// ------------------------------------------------------------------
	const enneagramFAQs: FAQItem[] = [
		{
			question: 'What is the Enneagram personality system?',
			answer:
				'The Enneagram is a personality framework describing 9 interconnected types, each driven by distinct core fears, desires, and motivations. Unlike behavioral tests, it reveals WHY you act the way you do, not just what you do. Each type has predictable patterns of thinking, feeling, and responding to stress.'
		},
		{
			question: 'How do I find my Enneagram type?',
			answer:
				'Start by reading descriptions of all 9 types and notice which core fear resonates most deeply. Focus on motivation, not behavior. Many people mistype initially because they identify with healthy traits of other types. Consider taking a validated assessment and exploring how you respond under stress.'
		},
		{
			question: 'How is the Enneagram different from MBTI?',
			answer:
				'MBTI categorizes how you process information and make decisions (cognitive functions). The Enneagram maps your core emotional drivers and unconscious patterns. MBTI describes what you do; Enneagram explains why. Many find the Enneagram more useful for personal growth and understanding relationship dynamics.'
		},
		{
			question: 'Can my Enneagram type change over time?',
			answer:
				'Your core type remains constant throughout life, as it forms in childhood. However, you can grow within your type, accessing healthier behaviors and integrating traits from other types. Growth means expanding beyond your automatic patterns, not becoming a different type.'
		},
		{
			question: 'What are Enneagram wings?',
			answer:
				'Wings are the two types adjacent to your core type on the Enneagram circle. Most people lean toward one wing more than the other, which adds flavor to their personality. For example, a Type 9 might have a stronger 8 wing (9w8) or 1 wing (9w1), each creating distinct subtypes.'
		},
		{
			question: 'Is the Enneagram scientifically validated?',
			answer:
				'Research on the Enneagram is growing but limited compared to other personality systems. Studies show reasonable reliability and validity for typing. Its value lies in practical application: understanding motivations, improving relationships, and guiding personal development rather than statistical prediction.'
		},
		{
			question: 'How can the Enneagram improve my relationships?',
			answer:
				'The Enneagram reveals why people react differently to the same situation. Understanding your partner\'s type helps you stop taking their behavior personally and communicate in ways that actually land. It transforms "they\'re being difficult" into "they need something different than I do."'
		}
	];

	// ------------------------------------------------------------------
	// Topic catalog — drives §04 BY TOPIC sub-blocks. Each entry pairs
	// a `type[0]` value (matches blog frontmatter) with display copy.
	// Order here is the on-page order. Topic kickers count from 04a → 04h.
	// ------------------------------------------------------------------
	type TopicMeta = {
		id: string; // hash anchor (kept for legacy link compat)
		type: string; // matches BlogPost.type[0]
		title: string; // display heading (no trailing period; we add one)
		descriptor: string; // short body line under the heading
		viewAllHref: string | null;
	};
	const topics: TopicMeta[] = [
		{
			id: 'nine-types',
			type: 'nine-types',
			title: 'The Nine Types',
			descriptor: 'One read per type. Nine reads per situation.',
			viewAllHref: null
		},
		{
			id: 'understanding',
			type: 'overview',
			title: 'Foundations',
			descriptor: 'Core concepts behind the Enneagram framework.',
			viewAllHref: '/enneagram-corner/subtopic/overview'
		},
		{
			id: 'personal-development',
			type: 'development',
			title: 'Growth',
			descriptor: 'Move past your automatic patterns — with type-aware strategy.',
			viewAllHref: '/enneagram-corner/subtopic/development'
		},
		{
			id: 'relationships',
			type: 'relationships',
			title: 'Relationships',
			descriptor: 'Why people react differently to the same situation.',
			viewAllHref: '/enneagram-corner/subtopic/relationships'
		},
		{
			id: 'mental-health',
			type: 'mental-health',
			title: 'Mental Health',
			descriptor: 'Where psychology meets the Enneagram framework.',
			viewAllHref: '/enneagram-corner/mental-health'
		},
		{
			id: 'workplace',
			type: 'workplace',
			title: 'Career',
			descriptor: 'How each type leads, follows, and burns out at work.',
			viewAllHref: '/enneagram-corner/subtopic/workplace'
		},
		{
			id: 'situations',
			type: 'situational',
			title: 'Real Life',
			descriptor: 'The same moment, decoded nine different ways.',
			viewAllHref: '/enneagram-corner/subtopic/situational'
		},
		{
			id: 'resources',
			type: 'resources',
			title: 'Resources',
			descriptor: 'Books, tools, and tests worth your time.',
			viewAllHref: '/enneagram-corner/subtopic/resources'
		}
	];

	const publishedCount = $derived(data.enneagramBlogs.length);

	// Group enneagramBlogs by type[0]; server already de-duped + capped per topic.
	const blogsByType = $derived.by(() => {
		const map = new Map<string, typeof data.enneagramBlogs>();
		for (const post of data.enneagramBlogs) {
			const t = post.type?.[0] ?? '';
			if (!map.has(t)) map.set(t, []);
			map.get(t)!.push(post);
		}
		return map;
	});

	// ------------------------------------------------------------------
	// Helpers — mirror personality-analysis index for visual consistency.
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

	// Stable letter from a-z for sub-section labels (04a, 04b…)
	function topicSuffix(i: number): string {
		return String.fromCharCode(97 + (i % 26));
	}

	// ------------------------------------------------------------------
	// SEO / JSON-LD
	// ------------------------------------------------------------------
	const SITE_URL = 'https://9takes.com';
	const PAGE_URL = `${SITE_URL}/enneagram-corner`;
	const PAGE_ID = `${PAGE_URL}#collection`;
	const ORG_ID = `${SITE_URL}/#organization`;
	const WEBSITE_ID = `${SITE_URL}/#website`;
	const OG_IMAGE_URL = `${SITE_URL}/enneagram-corner-card.webp`;
	const OG_IMAGE_WIDTH = 1200;
	const OG_IMAGE_HEIGHT = 628;

	// SEO copy — single source of truth (mirrored to <SEOHead> below).
	const SEO_TITLE = 'Enneagram Personality Guide: Complete Psychology System | 9takes';
	const SEO_DESCRIPTION =
		'Decode the Enneagram. Find your type among 9 patterns, understand core motivations, and transform how you read every situation.';

	function topicUrl(topic: TopicMeta): string {
		// Prefer the dedicated subtopic page when one exists; fall back to a
		// hash anchor only when nothing better is available. Nine-types is the
		// edge case — its dedicated page is /enneagram-corner/subtopic/nine-types.
		if (topic.viewAllHref) return `${SITE_URL}${topic.viewAllHref}`;
		if (topic.type === 'nine-types') return `${SITE_URL}/enneagram-corner/subtopic/nine-types`;
		return `${PAGE_URL}#${topic.id}`;
	}

	function absoluteImageUrl(pic: string | null | undefined): string | null {
		if (!pic) return null;
		// JSON-LD images stay theme-agnostic; always serve the dark-default variant.
		return `${SITE_URL}/blogs/${pic}.webp`;
	}

	const faqJsonLd = $derived({
		'@type': 'FAQPage',
		'@id': `${PAGE_URL}#faq`,
		inLanguage: 'en-US',
		mainEntity: enneagramFAQs.map((faq) => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: { '@type': 'Answer', text: faq.answer }
		}))
	});

	const breadcrumbJsonLd = $derived({
		'@type': 'BreadcrumbList',
		'@id': `${PAGE_URL}#breadcrumbs`,
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
			{ '@type': 'ListItem', position: 2, name: 'Enneagram Corner', item: PAGE_URL }
		]
	});

	const topicsItemList = $derived({
		'@type': 'ItemList',
		'@id': `${PAGE_URL}#topics`,
		name: 'Enneagram Corner topics',
		numberOfItems: topics.length,
		itemListElement: topics.map((topic, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			url: topicUrl(topic),
			item: {
				'@type': 'CollectionPage',
				'@id': topicUrl(topic),
				name: topic.title,
				description: topic.descriptor,
				url: topicUrl(topic)
			}
		}))
	});

	// Featured + recently-updated posts surfaced as BlogPosting nodes so the
	// hub's primary content is structured-data eligible (not just topic links).
	const featuredArticles = $derived([...data.featured, ...data.recentlyUpdated]);
	const articleNodes = $derived(
		featuredArticles.map((post) => {
			const url = `${SITE_URL}/enneagram-corner/${post.slug}`;
			const image = absoluteImageUrl(post.pic);
			const node: Record<string, unknown> = {
				'@type': 'BlogPosting',
				'@id': url,
				headline: post.title,
				description: post.description,
				url,
				mainEntityOfPage: url,
				inLanguage: 'en-US',
				isPartOf: { '@id': PAGE_ID },
				author: { '@id': ORG_ID },
				publisher: { '@id': ORG_ID }
			};
			if (post.date) node.datePublished = post.date;
			const updated = post.lastmod ?? post.date;
			if (updated) node.dateModified = updated;
			if (image) node.image = image;
			return node;
		})
	);

	const collectionPageJsonLd = $derived({
		'@type': 'CollectionPage',
		'@id': PAGE_ID,
		name: 'Enneagram Corner: Your Guide to Personal Growth',
		headline: 'The Enneagram, decoded.',
		description: SEO_DESCRIPTION,
		url: PAGE_URL,
		inLanguage: 'en-US',
		isPartOf: { '@id': WEBSITE_ID },
		about: {
			'@type': 'Thing',
			name: 'Enneagram personality system',
			description:
				'A personality framework describing nine interconnected types defined by core fears, desires, and motivations.'
		},
		author: { '@id': ORG_ID },
		publisher: { '@id': ORG_ID },
		image: {
			'@type': 'ImageObject',
			url: OG_IMAGE_URL,
			width: OG_IMAGE_WIDTH,
			height: OG_IMAGE_HEIGHT
		},
		mainEntity: { '@id': `${PAGE_URL}#topics` },
		hasPart: articleNodes.map((node) => ({ '@id': node['@id'] })),
		// Cross-link to sibling pillar hubs so crawlers see the related-entity graph.
		relatedLink: [
			`${SITE_URL}/personality-analysis`,
			`${SITE_URL}/enneagram-test`,
			`${SITE_URL}/questions`
		],
		speakable: {
			'@type': 'SpeakableSpecification',
			cssSelector: ['h1', '.hero-subhead-line-1']
		},
		...(data.earliestPublish ? { datePublished: data.earliestPublish } : {}),
		...(data.latestUpdate ? { dateModified: data.latestUpdate } : {})
	});

	const jsonLdGraph = $derived({
		'@context': 'https://schema.org',
		'@graph': [breadcrumbJsonLd, collectionPageJsonLd, topicsItemList, ...articleNodes, faqJsonLd]
	});

	// Visible "Last updated" line — formatted versions of the aggregate dates.
	const lastUpdatedLabel = $derived(data.latestUpdate ? formatDate(data.latestUpdate) : '');
	const earliestPublishLabel = $derived(
		data.earliestPublish ? formatDate(data.earliestPublish) : ''
	);
</script>

<SEOHead
	title={SEO_TITLE}
	description={SEO_DESCRIPTION}
	canonical={PAGE_URL}
	twitterCardType="summary_large_image"
	ogImage={OG_IMAGE_URL}
	ogImageWidth={OG_IMAGE_WIDTH}
	ogImageHeight={OG_IMAGE_HEIGHT}
	jsonLd={jsonLdGraph}
	author="9takes"
/>

<div class="library-index">
	<!-- =====================================================================
	  §01 OBSERVATION — hero + statue + tagline + subtext
	  ===================================================================== -->
	<IndexHero
		title="The Enneagram, decoded."
		line1="9 emotional types. Each one leads with a different read of the same situation. Here's what each one sees first — and what every type misses."
		line2={`${publishedCount} reads. Decoded the way a real psychologist would — centers, wings, stress lines, growth lines, and the moments those patterns show up.`}
		imageSrc="/greek_distorted_statue_face.png"
		imageMono="9TAKES · CASE FILES · ENNEAGRAM CORNER"
	>
		{#snippet meta()}
			{#if data.earliestPublish}
				Published <time datetime={data.earliestPublish}>{earliestPublishLabel}</time>
			{/if}
			{#if data.earliestPublish && data.latestUpdate}
				·
			{/if}
			{#if data.latestUpdate}
				Last updated <time datetime={data.latestUpdate}>{lastUpdatedLabel}</time>
			{/if}
		{/snippet}
		{#snippet actions()}
			<Button size="md" variant="primary" href="/enneagram-corner/subtopic/nine-types">
				Start with the 9 Types
			</Button>
			<Button size="md" variant="ghost" href="/enneagram-corner/enneagram-concepts">
				Learn the Core Concepts
			</Button>
		{/snippet}
	</IndexHero>

	<!-- =====================================================================
	  §02 FEATURED — two large case-file cards
	  ===================================================================== -->
	{#if data.featured.length > 0}
		<section class="featured">
			<header class="section-head">
				<SectionKicker class="section-tag" num="02" label="FEATURED" />
				<h2 class="display-md">Featured.</h2>
				<p class="section-sub">Most recently updated. Worth your full attention.</p>
			</header>

			<CaseGrid columns={2}>
				{#each data.featured as post, i (post.slug)}
					{@const topic = (post.type?.[0] ?? 'ENNEAGRAM')
						.toString()
						.replace(/-/g, ' ')
						.toUpperCase()}
					<CaseCard
						href="/enneagram-corner/{post.slug}"
						title={post.title}
						eyebrow={topic}
						description={post.description}
						imageSrc={post.pic ? picUrl(post.pic) : null}
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
		<section class="recent">
			<header class="section-head">
				<SectionKicker class="section-tag" num="03" label="RECENTLY UPDATED" />
				<h2 class="display-md">Recently updated.</h2>
				<p class="section-sub">Fresh insights, latest revisions.</p>
			</header>

			<CaseGrid columns={4}>
				{#each data.recentlyUpdated as post, i (post.slug)}
					{@const topic = (post.type?.[0] ?? 'ENNEAGRAM')
						.toString()
						.replace(/-/g, ' ')
						.toUpperCase()}
					<CaseCard
						href="/enneagram-corner/{post.slug}"
						title={post.title}
						eyebrow={topic}
						description={post.description}
						imageSrc={post.pic ? picUrl(post.pic, true) : null}
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
			<p class="section-sub">Eight angles on the Enneagram. Pick your entry point.</p>
		</header>

		{#each topics as topic, ti}
			{@const topicPosts =
				topic.type === 'nine-types'
					? [...(blogsByType.get(topic.type) ?? [])].sort((a, b) => a.slug.localeCompare(b.slug))
					: (blogsByType.get(topic.type) ?? [])}
			{@const topicLimit = topic.type === 'nine-types' ? 9 : 6}
			{@const topicTotal = data.topicCounts?.[topic.type] ?? topicPosts.length}
			{@const remaining = Math.max(0, topicTotal - topicLimit)}
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

					<!-- Fixed 3-up recipe (3/2/1 across breakpoints) that CaseGrid's
					     auto-fit columns={3} doesn't reproduce — wrapper kept local. -->
					<div class="topic-grid">
						{#each topicPosts.slice(0, topicLimit) as post (post.slug)}
							<CaseCard
								href="/enneagram-corner/{post.slug}"
								title={post.title}
								description={topic.type !== 'nine-types' ? post.description : ''}
								imageSrc={post.pic ? picUrl(post.pic, true) : null}
								recency={getRecencyLabel(post.lastmod, post.date) ?? ''}
							/>
						{/each}
					</div>

					{#if topic.viewAllHref}
						<div class="topic-block-cta">
							<Button size="md" variant="secondary" href={topic.viewAllHref}>
								View all {topicTotal > 0 ? `${topicTotal} ` : ''}{topic.title} reads
								{#if remaining > 0}
									<span class="cta-extra">&middot; {remaining} more &rarr;</span>
								{:else}
									<span class="cta-extra">&rarr;</span>
								{/if}
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
		<FAQSection faqs={enneagramFAQs} title="Enneagram Questions Answered" num="05" />
	</section>

	<!-- =====================================================================
	  §06 CTA — quiet V5-styled outro
	  ===================================================================== -->
	<section class="cta">
		<div class="cta-inner">
			<SectionKicker class="section-tag" num="06" label="START HERE" />
			<h2 class="display-md">Ready to discover your type?</h2>
			<p class="section-sub">
				Start with the nine types, or build the foundation behind the framework first.
			</p>
			<div class="cta-actions">
				<Button size="md" variant="primary" href="/enneagram-corner/subtopic/nine-types">
					Explore All 9 Types
				</Button>
				<Button size="md" variant="ghost" href="/enneagram-corner/subtopic/overview">
					Learn the Basics
				</Button>
			</div>
		</div>
	</section>
</div>

<style lang="scss">
	/* =========================================================
	  /enneagram-corner — Streetlamp Symposium index page.
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
		padding: 0;
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

	/* FAQSection ships its own internal padding/max-width. Center it inside
	   the V5 night-mid wrapper so it inherits the rhythm without re-styling
	   the component itself. */
	.faq {
		padding-left: 0;
		padding-right: 0;
	}

	/* Case-file card + grid styles (incl. featured pairs) live in
	   marketing/CaseCard.svelte and marketing/CaseGrid.svelte (extracted 2026-06-10). */

	/* =========================================================
	  §04 topic grid — fixed 3-up recipe (3/2/1 across breakpoints)
	  that CaseGrid's auto-fit columns={3} doesn't reproduce.
	  ========================================================= */
	.topic-grid {
		max-width: 1280px;
		margin: 0 auto;
		display: grid;
		gap: 22px;
		grid-template-columns: repeat(3, 1fr);

		@media (max-width: 768px) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (max-width: 480px) {
			grid-template-columns: 1fr;
		}
	}

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

	.topic-block-cta {
		margin-top: 36px;
		display: flex;
		justify-content: center;

		:global(.btn) {
			border-color: var(--data-teal);
			color: var(--ink-bright);
			padding-inline: 28px;
			font-size: 15px;
			font-weight: 600;
			letter-spacing: -0.005em;
			box-shadow: 0 0 0 0 transparent;
			transition:
				background 0.18s ease,
				border-color 0.18s ease,
				color 0.18s ease,
				box-shadow 0.18s ease,
				transform 0.18s ease;
		}

		:global(.btn:hover) {
			background: var(--stone-mid);
			border-color: var(--data-teal);
			color: var(--ink-bright);
			box-shadow: 0 0 0 4px rgba(var(--pool-rgb), 0.12);
			transform: translateY(-1px);
		}

		.cta-extra {
			margin-left: 6px;
			color: var(--data-teal);
			font-weight: 600;
		}

		@media (max-width: 540px) {
			:global(.btn) {
				width: 100%;
				justify-content: center;
			}
		}
	}

	/* =========================================================
	  §06 CTA outro — same rhythm as the personality-analysis signup
	  block, but driven by buttons rather than the email form.
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
