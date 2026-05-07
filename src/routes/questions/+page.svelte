<!-- src/routes/questions/+page.svelte -->
<!--
  /questions index — Streetlamp Symposium V5.
  Visual ground truth: /, /design-preview/v5
  Spec: docs/design/2026-05-04-streetlamp-symposium-v5.md.
  Tokens (--lamp-*, --night-*, --stone-*, --ink-*, --data-*, --pool-rgb,
  --pool-deep-rgb) live globally in src/scss/index.scss.
-->
<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { browser } from '$app/environment';
	import { deserialize } from '$app/forms';
	import { Button, SectionKicker } from '$lib/components/atoms';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import SearchQuestion from '$lib/components/questions/SearchQuestion.svelte';
	import { buildBreadcrumbSchemaForGraph, buildFAQSchemaForGraph } from '$lib/utils/schema';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	type QuestionCategoryPathCrumb = {
		id: number;
		category_name: string;
		slug?: string | null;
		level: number;
	};

	type QuestionCategoryPath = {
		id: number;
		category_name: string;
		slug?: string | null;
		path: QuestionCategoryPathCrumb[];
		display_path: QuestionCategoryPathCrumb[];
		path_label: string;
	};

	type QuestionRow = {
		id: number;
		url: string;
		question: string;
		question_formatted?: string;
		comment_count: number;
		created_at: string;
		tag_id?: number;
		tag_name?: string;
		category_paths?: QuestionCategoryPath[];
	};

	// ------------------------------------------------------------------
	// SEO + structured-data — preserved verbatim from the previous page.
	// ------------------------------------------------------------------
	const questionsFaqs = [
		{
			question: 'How can I ask questions anonymously on 9takes?',
			answer:
				'On 9takes, you can ask questions anonymously by creating an account using your Enneagram personality type as your identity. This allows you to maintain privacy while engaging in meaningful discussions.'
		},
		{
			question: 'What is the give-first commenting system?',
			answer:
				"The give-first system requires you to share your own perspective before viewing others' responses. This encourages authentic participation and reduces bias from seeing other answers first."
		},
		{
			question: 'How do personality types work on 9takes?',
			answer:
				'9takes uses the Enneagram personality system (types 1-9). Each user identifies with a type, allowing you to see how different personality types respond to the same questions.'
		}
	];

	const questionsJsonLd = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'CollectionPage',
				'@id': 'https://9takes.com/questions#webpage',
				name: 'Ask Questions Anonymously & Get Answers | 9takes',
				description:
					"Join 9takes to ask personal questions anonymously and get answers from diverse perspectives. Explore life's questions through the lens of personality types.",
				url: 'https://9takes.com/questions',
				inLanguage: 'en-US',
				isPartOf: {
					'@type': 'WebSite',
					name: '9takes',
					url: 'https://9takes.com'
				},
				breadcrumb: { '@id': 'https://9takes.com/questions#breadcrumb' }
			},
			{
				'@id': 'https://9takes.com/questions#breadcrumb',
				...buildBreadcrumbSchemaForGraph([
					{ name: 'Home', url: 'https://9takes.com' },
					{ name: 'Questions', url: 'https://9takes.com/questions' }
				])
			},
			{
				'@id': 'https://9takes.com/questions#faq',
				...buildFAQSchemaForGraph(questionsFaqs)
			}
		]
	};

	// ------------------------------------------------------------------
	// Local pagination state (Svelte 5 runes).
	// ------------------------------------------------------------------
	function dedupeById<T extends { id: number | string }>(items: T[]): T[] {
		const seen = new Set<T['id']>();
		const out: T[] = [];
		for (const item of items) {
			if (seen.has(item.id)) continue;
			seen.add(item.id);
			out.push(item);
		}
		return out;
	}

	let questionsList = $state<QuestionRow[]>(
		untrack(() => dedupeById([...(data.questionsAndTags ?? [])] as QuestionRow[]))
	);
	let currentPage = $state(untrack(() => data.currentPage ?? 1));
	let hasMore = $state(untrack(() => Boolean(data.hasMore)));
	let loadingMore = $state(false);
	let loadMoreError = $state('');

	let loadMoreTrigger: HTMLElement | undefined = $state(undefined);
	let observer: IntersectionObserver | null = null;

	async function loadMore() {
		if (loadingMore || !hasMore) return;
		loadingMore = true;
		loadMoreError = '';

		try {
			const formData = new FormData();
			formData.append('page', String(currentPage + 1));

			const response = await fetch('?/loadMore', {
				method: 'POST',
				body: formData
			});

			const text = await response.text();
			const result = deserialize(text);

			if (result.type === 'success' && result.data) {
				const responseData = result.data as {
					questions: typeof questionsList;
					page: number;
					hasMore: boolean;
				};
				questionsList = dedupeById([...questionsList, ...(responseData.questions ?? [])]);
				currentPage = responseData.page;
				hasMore = Boolean(responseData.hasMore);
			} else {
				loadMoreError = 'Failed to load more questions.';
			}
		} catch (err) {
			console.error('Error loading more questions:', err);
			loadMoreError = 'Failed to load more questions. Please try again.';
		} finally {
			loadingMore = false;
		}
	}

	// Infinite scroll trigger — observe the load-more sentinel.
	onMount(() => {
		if (!browser) return;
		if (!hasMore || !loadMoreTrigger) return;

		observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !loadingMore && hasMore) {
					void loadMore();
				}
			},
			{ threshold: 0.1, rootMargin: '160px' }
		);
		observer.observe(loadMoreTrigger);

		return () => {
			observer?.disconnect();
			observer = null;
		};
	});

	// ------------------------------------------------------------------
	// Helpers.
	// ------------------------------------------------------------------
	function relativeTime(iso: string | undefined | null): string {
		if (!iso) return 'POSTED RECENTLY';
		const ts = new Date(iso).getTime();
		if (!Number.isFinite(ts)) return 'POSTED RECENTLY';
		const diff = Date.now() - ts;
		const minutes = Math.floor(diff / 60000);
		if (minutes < 1) return 'POSTED JUST NOW';
		if (minutes < 60) return `POSTED ${minutes}M AGO`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `POSTED ${hours}H AGO`;
		const days = Math.floor(hours / 24);
		if (days < 30) return `POSTED ${days}D AGO`;
		return `POSTED ${new Date(iso)
			.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
			.toUpperCase()}`;
	}

	function categoryHref(cat: { slug?: string | null; id: number }): string {
		const slug = cat.slug ?? String(cat.id);
		return `/questions/categories/${slug}`;
	}

	function questionCategoryDisplayPath(
		categoryPath: QuestionCategoryPath
	): QuestionCategoryPathCrumb[] {
		return categoryPath.display_path?.length ? categoryPath.display_path : categoryPath.path;
	}

	// Search component dispatches createQuestion + questionSelected events.
	function goToCreateQuestionPage(detail: string) {
		if (!data?.user?.id) {
			void goto('/register', { invalidateAll: true });
			return;
		}
		const url = detail
			? `/questions/create/?question=${encodeURIComponent(detail)}`
			: '/questions/create/';
		void goto(url, { invalidateAll: true });
	}
</script>

<SEOHead
	title="Ask Questions Anonymously & Get Answers | 9takes"
	description="Join 9takes to ask personal questions anonymously and get answers from diverse perspectives. Explore life's questions through the lens of personality types."
	canonical="https://9takes.com/questions"
	twitterCardType="summary_large_image"
	ogImage="https://9takes.com/questions-default.webp"
	jsonLd={questionsJsonLd}
	additionalMeta={[
		{
			name: 'keywords',
			content:
				'anonymous questions, personality types, enneagram, Q&A platform, diverse perspectives, give-first system'
		},
		{ name: 'twitter:label1', content: 'Active Questions' },
		{ name: 'twitter:data1', content: `${data.questionsAndTags?.length || 0}+` }
	]}
/>

<div class="questions-index">
	<!-- =====================================================================
	  §01 OBSERVATION — hero
	  ===================================================================== -->
	<section class="hero">
		<div class="grain" aria-hidden="true"></div>
		<div class="hero-pool" aria-hidden="true"></div>

		<div class="hero-inner">
			<div class="hero-text">
				<div class="hero-eyebrow">
					<SectionKicker num="01" label="OBSERVATION" />
				</div>

				<h1 class="display-xl">Drop a situation. Get nine reads.</h1>

				<p class="hero-subhead">
					Real situations from real people. Each one read by all 9 personality types &mdash;
					anonymously, locked-in, before anyone sees anyone else&rsquo;s take.
				</p>
				<p class="hero-subhead hero-subhead--meta">
					{data.totalQuestions ?? 0} open questions. {data.totalAnswers ?? 0} unbiased takes gathered.
					Pick one. Drop yours first.
				</p>

				<div class="hero-ctas">
					{#if data.canAskQuestion}
						<Button size="lg" variant="primary" href="/questions/create">Drop a question →</Button>
					{/if}
					<Button size="lg" variant="ghost" href="#open-floor">Browse open questions ↓</Button>
				</div>
			</div>

			<div class="hero-statue" aria-hidden="true">
				<div class="statue-frame">
					<img
						src="/philosopher-gathering.webp"
						alt=""
						class="statue"
						loading="eager"
						decoding="async"
					/>
					<div class="statue-vignette"></div>
					<div class="statue-mono">
						<span class="mono">9TAKES · OPEN FLOOR · DROP YOURS FIRST</span>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- =====================================================================
	  §02 BROWSE BY CATEGORY — chip nav + search
	  ===================================================================== -->
	<section id="categories" class="categories">
		<header class="section-header">
			<SectionKicker class="section-tag" num="02" label="BROWSE BY CATEGORY" />
			<h2 class="display-md">Browse by category.</h2>
			<p class="section-sub">
				Pick the lane you&rsquo;re circling — or scan everything that&rsquo;s open right now.
			</p>
		</header>

		<div class="search-wrap">
			<SearchQuestion
				{data}
				on:createQuestion={({ detail }) => goToCreateQuestionPage(detail)}
				on:questionSelected={({ detail }) => {
					if (detail?.url) {
						void goto(`/questions/${detail.url}`);
					}
				}}
			/>
		</div>

		<div class="category-chips" role="navigation" aria-label="Question categories">
			<a href="/questions" class="category-chip category-chip--active">ALL</a>
			{#each data.subcategoryTags ?? [] as cat (cat.id)}
				<a href={categoryHref(cat)} class="category-chip">
					{cat.category_name.toUpperCase()}
				</a>
			{/each}
			<a href="/questions/categories" class="category-chip category-chip--more"> FULL TREE → </a>
		</div>
	</section>

	<!-- =====================================================================
	  §03 OPEN FLOOR — question list (real data)
	  ===================================================================== -->
	<section id="open-floor" class="open-floor">
		<div class="open-floor-pool" aria-hidden="true"></div>

		<header class="open-floor-header">
			<SectionKicker class="section-tag" num="03" label="OPEN FLOOR" />
			<h2 class="display-md">The floor is open.</h2>
			<p class="mono open-floor-kicker">
				OPEN · {data.totalQuestions ?? 0} QUESTIONS · {data.totalAnswers ?? 0} TAKES GATHERED
			</p>
			<p class="open-floor-sub">
				Each question is read by all 9 personality types. Drop your take to unlock the room.
			</p>
		</header>

		{#if questionsList.length === 0}
			<div class="empty-state">
				<p class="mono empty-state-label">NO OPEN QUESTIONS</p>
				<p class="empty-state-body">The floor is quiet. Be the first to drop a situation.</p>
				{#if data.canAskQuestion}
					<Button size="md" variant="primary" href="/questions/create">Drop a question →</Button>
				{/if}
			</div>
		{:else}
			<ul class="question-list">
				{#each questionsList as q (q.id)}
					<li class="question-row">
						<a href={`/questions/${q.url}`} class="question-row-link">
							<span class="question-row-text">
								{q.question_formatted ?? q.question}
							</span>
							<span class="mono question-row-meta">
								{#if q.category_paths?.length}
									<span class="question-row-cats">
										{#each q.category_paths.slice(0, 1) as categoryPath (`${categoryPath.id}-${categoryPath.path_label}`)}
											<span class="question-row-cat-path">
												{#each questionCategoryDisplayPath(categoryPath) as pathCategory, index (`${categoryPath.id}-${pathCategory.id}`)}
													<span
														class="question-row-cat-part"
														class:question-row-cat-part--leaf={index ===
															questionCategoryDisplayPath(categoryPath).length - 1}
													>
														{pathCategory.category_name}
													</span>
													{#if index < questionCategoryDisplayPath(categoryPath).length - 1}
														<span class="question-row-cat-divider" aria-hidden="true">/</span>
													{/if}
												{/each}
											</span>
										{/each}
										{#if q.category_paths.length > 1}
											<span
												class="question-row-cat-more"
												aria-label={`${q.category_paths.length - 1} more categories`}
											>
												+{q.category_paths.length - 1}
											</span>
										{/if}
									</span>
									<span class="question-row-sep" aria-hidden="true">·</span>
								{:else if q.tag_name}
									<span class="question-row-cat">{q.tag_name.toUpperCase()}</span>
									<span class="question-row-sep" aria-hidden="true">·</span>
								{/if}
								<span class="question-row-takes">
									{q.comment_count ?? 0} TAKE{(q.comment_count ?? 0) === 1 ? '' : 'S'}
								</span>
								<span class="question-row-sep" aria-hidden="true">·</span>
								<span class="question-row-time">{relativeTime(q.created_at)}</span>
							</span>
						</a>
					</li>
				{/each}
			</ul>
		{/if}

		{#if loadMoreError}
			<p class="mono load-more-error" role="alert">{loadMoreError}</p>
		{/if}

		{#if hasMore}
			<div class="load-more-row" bind:this={loadMoreTrigger}>
				<Button size="lg" variant="secondary" loading={loadingMore} onclick={() => void loadMore()}>
					{loadingMore ? 'Loading…' : 'Load more questions →'}
				</Button>
			</div>
		{/if}
	</section>

	<!-- =====================================================================
	  §04 — quiet sign-up nudge for unauthenticated visitors only
	  ===================================================================== -->
	{#if !data?.user?.id}
		<section class="signup-nudge">
			<div class="signup-inner">
				<SectionKicker class="section-tag" num="04" label="HOW IT WORKS" />
				<h2 class="display-md">Give first. Then see how the room reads it.</h2>
				<ol class="signup-steps">
					<li>
						<span class="mono signup-step-num">01</span>
						<span class="signup-step-body">
							Pick an open question and drop your honest take, anonymously.
						</span>
					</li>
					<li>
						<span class="mono signup-step-num">02</span>
						<span class="signup-step-body">
							Unlock how all 9 personality types read the same situation.
						</span>
					</li>
					<li>
						<span class="mono signup-step-num">03</span>
						<span class="signup-step-body">
							Sort comments by type. Notice the patterns you&rsquo;ve been missing.
						</span>
					</li>
				</ol>
				<div class="signup-cta-row">
					<Button size="lg" variant="primary" href="/register">Sign up to ask anonymously →</Button>
				</div>
			</div>
		</section>
	{/if}
</div>

<style lang="scss">
	/* =========================================================
	  /questions — V5 production layout.
	  Bridge tokens (--lamp-*, --night-*, --stone-*, --ink-*, --data-*,
	  --pool-rgb, --pool-deep-rgb) ship globally from src/scss/index.scss.
	  Page-only knobs are declared on .questions-index here.
	  ========================================================= */
	.questions-index {
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
		scroll-behavior: smooth;

		@media (prefers-reduced-motion: reduce) {
			scroll-behavior: auto;
		}

		:global(:root.light) & {
			--pool-alpha-strong: 0.14;
			--pool-alpha-mid: 0.08;
			--pool-alpha-soft: 0.04;
			--statue-blend: normal;
			--grain-opacity: 0.025;
		}
	}

	/* ---------- shared utilities ---------- */
	.questions-index :global(.mono) {
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
		font-size: clamp(40px, 7.4vw, 72px);
		line-height: 1.02;
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

	.questions-index :global(.section-tag) {
		display: inline-block;
		margin-bottom: 16px;
		color: var(--lamp-glow);
	}

	.questions-index :global(p),
	.questions-index :global(h1),
	.questions-index :global(h2),
	.questions-index :global(h3) {
		margin: 0;
	}

	.questions-index :global(ul),
	.questions-index :global(ol) {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.questions-index :global(a) {
		color: inherit;
		text-decoration: none;
	}

	.section-header {
		max-width: 820px;
		margin: 0 auto 36px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	.section-sub {
		font-family: var(--font-display);
		font-size: 16px;
		line-height: 1.55;
		color: var(--ink-mid);
		max-width: 580px;
	}

	/* ---------- subtle paper grain ---------- */
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
		max-width: 680px;
	}

	.hero-eyebrow {
		margin-bottom: 22px;
	}

	.hero-subhead {
		font-family: var(--font-display);
		font-size: 18px;
		line-height: 1.55;
		color: var(--ink-mid);
		max-width: 600px;
		font-weight: 400;
		margin-bottom: 12px;

		@media (max-width: 540px) {
			font-size: 16px;
		}
	}

	.hero-subhead--meta {
		color: var(--ink-dim);
		font-size: 16px;
		margin-bottom: 28px;

		@media (max-width: 540px) {
			font-size: 14px;
		}
	}

	.hero-ctas {
		display: flex;
		flex-wrap: wrap;
		gap: 14px;
		margin-top: 8px;
	}

	.hero-statue {
		position: relative;

		@media (max-width: 968px) {
			display: none;
		}
	}

	.statue-frame {
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

	:global(:root.light) .questions-index .statue {
		filter: contrast(1.05) brightness(1) saturate(1);
	}

	.statue-vignette {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(ellipse at 25% 25%, rgba(var(--pool-rgb), 0.22) 0%, transparent 55%),
			linear-gradient(135deg, transparent 35%, rgba(10, 8, 7, 0.65) 100%),
			linear-gradient(180deg, transparent 60%, rgba(10, 8, 7, 0.85) 100%);
	}

	:global(:root.light) .questions-index .statue-vignette {
		background:
			radial-gradient(ellipse at 25% 25%, rgba(var(--pool-rgb), 0.08) 0%, transparent 55%),
			linear-gradient(135deg, transparent 60%, rgba(180, 83, 9, 0.06) 100%);
	}

	.statue-mono {
		position: absolute;
		left: 12px;
		bottom: 12px;
		color: var(--ink-mid);

		.mono {
			color: var(--ink-mid);
		}
	}

	/* =========================================================
	  §02 CATEGORIES
	  ========================================================= */
	.categories {
		position: relative;
		padding: 96px 48px;
		background: var(--night-mid);
		border-top: 1px solid var(--stone-edge);

		@media (max-width: 768px) {
			padding: 64px 20px;
		}
	}

	.search-wrap {
		max-width: 720px;
		margin: 0 auto 28px;
		position: relative;
		z-index: 5;
	}

	.category-chips {
		max-width: 1100px;
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px;
	}

	.category-chip {
		font-family: var(--font-mono);
		font-size: 12px;
		letter-spacing: 0.06em;
		padding: 8px 14px;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		color: var(--ink-mid);
		text-decoration: none;
		text-transform: uppercase;
		background: transparent;
		transition:
			background 0.18s ease,
			border-color 0.18s ease,
			color 0.18s ease;

		&:hover {
			background: var(--stone-warm);
			border-color: var(--ink-dim);
			color: var(--ink-bright);
		}
	}

	.category-chip--active {
		background: var(--stone-warm);
		border-color: var(--lamp-glow);
		color: var(--lamp-glow);
	}

	.category-chip--more {
		color: var(--lamp-glow);
		border-color: var(--lamp-glow);

		&:hover {
			background: var(--lamp-soft);
			color: var(--lamp-glow);
			border-color: var(--lamp-glow);
		}
	}

	/* =========================================================
	  §03 OPEN FLOOR
	  ========================================================= */
	.open-floor {
		position: relative;
		padding: 96px 48px;
		background: var(--night-deep);
		border-top: 1px solid var(--stone-edge);
		overflow: hidden;
		scroll-margin-top: 72px;

		@media (max-width: 768px) {
			padding: 64px 20px;
		}
	}

	.open-floor-pool {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: radial-gradient(
			ellipse 80% 60% at 50% 0%,
			rgba(var(--pool-rgb), var(--pool-alpha-mid)) 0%,
			transparent 55%
		);
	}

	.open-floor-header {
		position: relative;
		z-index: 1;
		max-width: 820px;
		margin: 0 auto 48px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	.open-floor-kicker {
		color: var(--ink-dim);
	}

	.open-floor-sub {
		font-family: var(--font-display);
		font-size: 16px;
		line-height: 1.55;
		color: var(--ink-mid);
		max-width: 580px;
	}

	.question-list {
		position: relative;
		z-index: 1;
		max-width: 880px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 0;
		border-top: 1px solid var(--stone-edge);
	}

	.question-row {
		border-bottom: 1px solid var(--stone-edge);
		transition: background 0.15s ease;

		&:hover {
			background: var(--stone-warm);
		}
	}

	.question-row-link {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 12px 14px;
		text-decoration: none;
		color: inherit;

		&:hover .question-row-text {
			color: var(--lamp-glow);
		}

		@media (max-width: 540px) {
			padding: 10px 10px;
		}
	}

	.question-row-text {
		font-family: var(--font-display);
		font-weight: 500;
		font-size: 16px;
		line-height: 1.35;
		color: var(--ink-bright);
		letter-spacing: -0.005em;
		transition: color 0.15s ease;

		@media (max-width: 540px) {
			font-size: 15px;
		}
	}

	.question-row-meta {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 11px;
		color: var(--ink-dim);
		flex-wrap: wrap;
	}

	.question-row-cat {
		color: var(--ink-mid);
	}

	.question-row-cats,
	.question-row-cat-path {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		min-width: 0;
	}

	.question-row-cats {
		flex-wrap: wrap;
		max-width: 100%;
	}

	.question-row-cat-path {
		max-width: min(100%, 58rem);
		color: var(--ink-dim);
		text-transform: uppercase;
	}

	.question-row-cat-part {
		min-width: 0;
		max-width: 28ch;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: var(--ink-dim);
	}

	.question-row-cat-part--leaf {
		color: var(--ink-mid);
	}

	.question-row-cat-divider {
		color: var(--ink-dim);
		opacity: 0.55;
	}

	.question-row-cat-more {
		color: var(--data-teal);
	}

	.question-row-takes {
		color: var(--data-teal);
	}

	.question-row-time {
		color: var(--ink-dim);
	}

	.question-row-sep {
		opacity: 0.5;
	}

	.empty-state {
		max-width: 560px;
		margin: 0 auto;
		padding: 48px 32px;
		text-align: center;
		border: 1px dashed var(--stone-edge);
		border-radius: 16px;
		background: var(--stone-warm);
		display: flex;
		flex-direction: column;
		gap: 12px;
		align-items: center;
	}

	.empty-state-label {
		color: var(--lamp-glow);
	}

	.empty-state-body {
		font-family: var(--font-display);
		font-size: 16px;
		line-height: 1.5;
		color: var(--ink-mid);
		margin-bottom: 8px;
	}

	.load-more-row {
		position: relative;
		z-index: 1;
		max-width: 880px;
		margin: 36px auto 0;
		display: flex;
		justify-content: center;
	}

	.load-more-error {
		max-width: 880px;
		margin: 24px auto 0;
		text-align: center;
		color: var(--ink-dim);
	}

	/* =========================================================
	  §04 SIGNUP NUDGE
	  ========================================================= */
	.signup-nudge {
		position: relative;
		padding: 96px 48px;
		background: var(--night-mid);
		border-top: 1px solid var(--stone-edge);

		@media (max-width: 768px) {
			padding: 64px 20px;
		}
	}

	.signup-inner {
		max-width: 720px;
		margin: 0 auto;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 18px;
	}

	.signup-steps {
		max-width: 560px;
		display: flex;
		flex-direction: column;
		gap: 14px;
		margin-top: 12px;
		text-align: left;
	}

	.signup-steps li {
		display: grid;
		grid-template-columns: 36px 1fr;
		gap: 14px;
		align-items: baseline;
		padding: 14px 16px;
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-left: 3px solid var(--lamp-glow);
		border-radius: 8px;
	}

	.signup-step-num {
		color: var(--lamp-glow);
		font-size: 13px;
	}

	.signup-step-body {
		font-family: var(--font-display);
		font-size: 16px;
		line-height: 1.5;
		color: var(--ink-bright);
	}

	.signup-cta-row {
		margin-top: 12px;
		display: flex;
		justify-content: center;
	}
</style>
