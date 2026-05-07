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
	<section class="hero">
		<div class="grain" aria-hidden="true"></div>
		<div class="hero-pool" aria-hidden="true"></div>

		<div class="hero-inner">
			<div class="hero-text">
				<div class="hero-eyebrow">
					<SectionKicker num="01" label="OBSERVATION" />
				</div>

				<h1 class="display-xl">The Enneagram, decoded.</h1>

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

				<p class="hero-subhead hero-subhead-line-1">
					9 emotional types. Each one leads with a different read of the same situation.
					Here&rsquo;s what each one sees first &mdash; and what every type misses.
				</p>
				<p class="hero-subhead hero-subhead-line-2">
					{publishedCount} reads. Decoded the way a real psychologist would &mdash; centers, wings, stress
					lines, growth lines, and the moments those patterns show up.
				</p>

				{#if data.latestUpdate || data.earliestPublish}
					<p class="hero-meta mono">
						{#if data.earliestPublish}
							Published <time datetime={data.earliestPublish}>{earliestPublishLabel}</time>
						{/if}
						{#if data.earliestPublish && data.latestUpdate}
							·
						{/if}
						{#if data.latestUpdate}
							Last updated <time datetime={data.latestUpdate}>{lastUpdatedLabel}</time>
						{/if}
					</p>
				{/if}

				<div class="hero-actions">
					<Button size="md" variant="primary" href="/enneagram-corner/subtopic/nine-types">
						Start with the 9 Types
					</Button>
					<Button size="md" variant="ghost" href="/enneagram-corner/enneagram-concepts">
						Learn the Core Concepts
					</Button>
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
						<span class="mono">9TAKES · CASE FILES · ENNEAGRAM CORNER</span>
					</div>
				</div>
			</div>
		</div>
	</section>

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

			<div class="featured-grid">
				{#each data.featured as post, i (post.slug)}
					{@const topic = (post.type?.[0] ?? 'ENNEAGRAM')
						.toString()
						.replace(/-/g, ' ')
						.toUpperCase()}
					{@const label = getRecencyLabel(post.lastmod, post.date)}
					<a
						href="/enneagram-corner/{post.slug}"
						class="case-card case-card--featured"
						aria-label="Read {post.title}"
					>
						<div class="case-image-wrap case-image-wrap--featured">
							{#if post.pic}
								<img
									src={picUrl(post.pic)}
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
									<span class="mono">[ARTICLE]</span>
								</div>
							{/if}
						</div>
						<div class="case-card-body">
							<span class="mono case-id">{topic}</span>
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
	  §03 RECENTLY UPDATED — 4 case-file cards
	  ===================================================================== -->
	{#if data.recentlyUpdated.length > 0}
		<section class="recent">
			<header class="section-head">
				<SectionKicker class="section-tag" num="03" label="RECENTLY UPDATED" />
				<h2 class="display-md">Recently updated.</h2>
				<p class="section-sub">Fresh insights, latest revisions.</p>
			</header>

			<div class="case-grid case-grid--four">
				{#each data.recentlyUpdated as post, i (post.slug)}
					{@const topic = (post.type?.[0] ?? 'ENNEAGRAM')
						.toString()
						.replace(/-/g, ' ')
						.toUpperCase()}
					{@const label = getRecencyLabel(post.lastmod, post.date)}
					<a href="/enneagram-corner/{post.slug}" class="case-card" aria-label="Read {post.title}">
						<div class="case-image-wrap">
							{#if post.pic}
								<img
									src={picUrl(post.pic, true)}
									alt={post.title}
									class="case-image"
									loading={i < 4 ? 'eager' : 'lazy'}
									width="320"
									height="240"
									decoding="async"
								/>
							{:else}
								<div class="case-image-stub" aria-hidden="true">
									<span class="mono">[ARTICLE]</span>
								</div>
							{/if}
						</div>
						<div class="case-card-body">
							<span class="mono case-id">{topic}</span>
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

					<div class="case-grid case-grid--three">
						{#each topicPosts.slice(0, topicLimit) as post, i (post.slug)}
							{@const label = getRecencyLabel(post.lastmod, post.date)}
							<a
								href="/enneagram-corner/{post.slug}"
								class="case-card"
								aria-label="Read {post.title}"
							>
								<div class="case-image-wrap">
									{#if post.pic}
										<img
											src={picUrl(post.pic, true)}
											alt={post.title}
											class="case-image"
											loading="lazy"
											width="320"
											height="240"
											decoding="async"
										/>
									{:else}
										<div class="case-image-stub" aria-hidden="true">
											<span class="mono">[ARTICLE]</span>
										</div>
									{/if}
								</div>
								<div class="case-card-body">
									<h3 class="case-name">{post.title}</h3>
									{#if post.description && topic.type !== 'nine-types'}
										<p class="case-subtitle">{post.description}</p>
									{/if}
									{#if label}
										<span class="mono case-recency">{label}</span>
									{/if}
								</div>
							</a>
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
		<FAQSection faqs={enneagramFAQs} title="Enneagram Questions Answered" />
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

	.hero-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		align-items: center;
		margin-top: 14px;
		color: var(--ink-dim);
		font-size: 11.5px;
		letter-spacing: 0.08em;

		time {
			color: var(--ink-mid);
		}
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

	/* =========================================================
	  Case-file card grid (shared between §02, §03, §04)
	  ========================================================= */
	.case-grid {
		max-width: 1280px;
		margin: 0 auto;
		display: grid;
		gap: 22px;
	}

	.case-grid--four {
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
	}

	.case-grid--three {
		grid-template-columns: repeat(3, 1fr);

		@media (max-width: 768px) {
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
	  §02 FEATURED — bigger cards, side-by-side. Subtle lamp-glow
	  stripe on the top edge sets featured cards apart from the
	  standard grid below.
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
