<!-- src/routes/questions/+page.svelte -->
<!--
  /questions index, Cold Light (2026-11-05). Not a feed to scroll: one hero with the product
  ritual, one featured question to answer now (the only mint action), the core formula as the
  how-it-works, then the full archive (server-rendered page 1 + load more) for search and SEO.
-->
<script lang="ts">
	import { untrack } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { deserialize } from '$app/forms';
	import { page } from '$app/state';
	import { Button } from '$lib/components/atoms';
	import AnsweredTypes from '$lib/components/questions/AnsweredTypes.svelte';
	import { listTypes, missingTypes } from '$lib/data/homepageLiveTypes';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import SearchQuestion from '$lib/components/questions/SearchQuestion.svelte';
	import { observeQualifiedQuestionImpression } from '$lib/analytics/questionEvents';
	import { extractPageViewAttribution } from '$lib/analytics/attribution';
	import { buildBreadcrumbSchemaForGraph, buildFAQSchemaForGraph } from '$lib/utils/schema';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
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
		starter_rank?: number | null;
		category_paths?: QuestionCategoryPath[];
	};

	// ------------------------------------------------------------------
	// SEO + structured-data — preserved verbatim from the previous page.
	// ------------------------------------------------------------------
	const questionsFaqs = [
		{
			question: 'How can I ask questions anonymously on 9takes?',
			answer:
				'Create an account to submit a new question; your email is never displayed with the post. Answering an existing question stays anonymous and does not require an account.'
		},
		{
			question: "Why can't I see other answers before I post mine?",
			answer:
				'9takes runs on one rule: answer before the crowd. Other responses stay hidden until you contribute your own, so your honest read comes before the room can shape it.'
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
		// eslint-disable-next-line svelte/prefer-svelte-reactivity -- scratch set for one dedupe pass, never rendered
		const seen = new Set<T['id']>();
		const out: T[] = [];
		for (const item of items) {
			if (seen.has(item.id)) continue;
			seen.add(item.id);
			out.push(item);
		}
		return out;
	}

	// Curated "Start here" set (rank order, page 1 only). The RPC keeps these
	// out of the archive list, so nothing renders twice.
	let starterQuestions = $derived(dedupeById([...(data.starters ?? [])] as QuestionRow[]));
	let questionsList = $state<QuestionRow[]>(
		untrack(() => dedupeById([...(data.questionsAndTags ?? [])] as QuestionRow[]))
	);
	let currentPage = $state(untrack(() => data.currentPage ?? 1));
	let hasMore = $state(untrack(() => Boolean(data.hasMore)));
	let loadingMore = $state(false);
	let loadMoreError = $state('');

	// Re-observes when the row's question or position changes. The campaign is
	// read untracked so a same-page URL change (e.g. #open-floor) doesn't restart it.
	function trackQuestionRow(question: QuestionRow, position: number): Attachment<HTMLElement> {
		return (node) =>
			observeQualifiedQuestionImpression(node, {
				questionId: question.id,
				questionUrl: question.url,
				surface: 'questions_index',
				sourcePath: '/questions',
				position,
				campaign: untrack(() => extractPageViewAttribution(page.url).utm_campaign) ?? undefined,
				questionCreatedAt: question.created_at,
				responsesVisibleBeforeImpression: question.comment_count
			});
	}

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
	function observeLoadMore(node: HTMLElement) {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !loadingMore && hasMore) {
					void loadMore();
				}
			},
			{ threshold: 0.1, rootMargin: '160px' }
		);
		observer.observe(node);
		return () => observer.disconnect();
	}

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

	function questionCategoryDisplayPath(
		categoryPath: QuestionCategoryPath
	): QuestionCategoryPathCrumb[] {
		return categoryPath.display_path?.length ? categoryPath.display_path : categoryPath.path;
	}

	let filtersOpen = $state(false);
	let categoryCount = $derived((data.subcategoryTags ?? []).length);
	let filterButtonLabel = $derived(categoryCount ? `Filters (${categoryCount})` : 'Filters');

	function questionCategoryLeafLabel(categoryPath: QuestionCategoryPath): string {
		const path = questionCategoryDisplayPath(categoryPath);
		return path.at(-1)?.category_name ?? categoryPath.category_name;
	}

	// The #1 starter is the one question we put in front of people; the rest are a short list.
	let featured = $derived(starterQuestions[0] ?? null);
	let otherStarters = $derived(starterQuestions.slice(1));
	// Who has answered the featured question: types and timestamps only, never take text.
	let featuredTypes = $derived(data.featuredTypes ?? null);
	let featuredMissing = $derived(
		featuredTypes && featuredTypes.answered.length > 0 ? missingTypes(featuredTypes.answered) : []
	);
	let featuredNewest = $derived(
		featuredTypes?.newestAt
			? new Date(featuredTypes.newestAt).toLocaleDateString('en-US', {
					month: 'short',
					day: 'numeric',
					timeZone: 'America/New_York'
				})
			: null
	);

	function takesLabel(count: number | null | undefined): string {
		const n = count ?? 0;
		return `${n.toLocaleString('en-US')} ${n === 1 ? 'take' : 'takes'}`;
	}
</script>

<SEOHead
	title="Enneagram Community Q&A: One Question, Nine Perspectives | 9takes"
	description="An anonymous Enneagram community Q&A. Answer before the crowd: other answers stay hidden until you post yours, then see how all nine types read the same question."
	canonical="https://9takes.com/questions"
	twitterCardType="summary_large_image"
	ogImage="https://9takes.com/questions-default.webp"
	jsonLd={questionsJsonLd}
	additionalMeta={[
		{
			name: 'keywords',
			content:
				'enneagram community, enneagram forum, anonymous questions, nine perspectives, answer before the crowd'
		},
		{ name: 'twitter:label1', content: 'Active Questions' },
		{ name: 'twitter:data1', content: `${data.questionsAndTags?.length || 0}+` }
	]}
/>

<div class="questions-index">
	{#snippet questionMeta(q: QuestionRow)}
		<span class="mono qi-meta">
			{#if q.category_paths?.length}
				{@const categoryPath = q.category_paths[0]}
				<span class="qi-meta__topic" title={categoryPath.path_label}>
					{questionCategoryLeafLabel(categoryPath)}{#if q.category_paths.length > 1}<span
							class="qi-meta__more"
							aria-label={`${q.category_paths.length - 1} more categories`}
							>&nbsp;+{q.category_paths.length - 1}</span
						>{/if}
				</span>
				<span class="qi-meta__sep" aria-hidden="true">·</span>
			{:else if q.tag_name}
				<span class="qi-meta__topic">{q.tag_name}</span>
				<span class="qi-meta__sep" aria-hidden="true">·</span>
			{/if}
			<span class="qi-meta__takes">{takesLabel(q.comment_count)}</span>
			<span class="qi-meta__sep" aria-hidden="true">·</span>
			<span>{relativeTime(q.created_at)}</span>
		</span>
	{/snippet}

	{#snippet questionRow(q: QuestionRow, position: number)}
		<li class="qi-row" {@attach trackQuestionRow(q, position)}>
			<a href={resolve('/questions/[slug]', { slug: q.url })} class="qi-row__link">
				<span class="qi-row__text">{q.question_formatted ?? q.question}</span>
				{@render questionMeta(q)}
			</a>
		</li>
	{/snippet}

	<!-- Hero + the featured question side by side: the one mint action is in the first screen. -->
	<div class={['qi-top', !featured && 'qi-top--solo']}>
		<header class="qi-hero">
			<p class="qi-kicker">
				<span class="qi-kicker__open">Open questions</span>
				<span class="mono qi-kicker__count">
					{(data.totalQuestions ?? 0).toLocaleString('en-US')} questions · {(
						data.totalAnswers ?? 0
					).toLocaleString('en-US')} takes
				</span>
			</p>
			<h1 class="qi-title">
				<span class="qi-title__big">Answer before</span>
				<span class="qi-title__ital">the crowd.</span>
			</h1>
			<p class="qi-lede">
				Pick a question. Give your honest take. Then see how all nine types answered it.
			</p>
			<div class="qi-hero__actions">
				{#if data.canAskQuestion}
					<Button size="md" variant="secondary" href="/questions/create">Ask a question</Button>
				{:else if !data?.user?.id}
					<Button size="md" variant="secondary" href="/register">Sign up to ask</Button>
				{/if}
				<a class="qi-text-link" href="#open-floor">Browse every question ↓</a>
			</div>
		</header>

		{#if featured}
			<article
				class="featured"
				aria-labelledby="pick-one-title"
				{@attach trackQuestionRow(featured, 0)}
			>
				<p class="featured__meta">
					<span class="featured__pick">Start here</span>
					<span class="mono featured__count">
						{takesLabel(featured.comment_count)}{featuredNewest
							? ` · newest ${featuredNewest}`
							: ''}
					</span>
				</p>
				<h2 id="pick-one-title" class="featured__question">
					<a
						href={resolve('/questions/[slug]', { slug: featured.url })}
						class="featured__question-link"
					>
						{featured.question_formatted ?? featured.question}
					</a>
				</h2>

				{#if featuredTypes && (featured.comment_count ?? 0) > 0}
					<div class="featured__types">
						<AnsweredTypes answered={featuredTypes.answered} />
						<p class="featured__types-note">
							{#if featuredTypes.answered.length === 0}
								Nobody has picked a type yet.
							{:else if featuredMissing.length === 0}
								All nine types are in.
							{:else}
								No {listTypes(featuredMissing)} has answered yet.
							{/if}
						</p>
					</div>
				{/if}

				<div class="featured__foot">
					<p class="featured__sealed">
						{#if (featured.comment_count ?? 0) > 0}
							<b>{takesLabel(featured.comment_count)}</b>, hidden until you answer.
						{:else}
							Nobody has answered yet. Yours goes first.
						{/if}
					</p>
					<Button
						size="lg"
						variant="action"
						href={resolve('/questions/[slug]', { slug: featured.url })}
						data-track="link"
						data-placement="questions_featured">Give your take →</Button
					>
				</div>
			</article>
		{/if}
	</div>

	{#if otherStarters.length}
		<section class="starters" aria-labelledby="starters-title">
			<h2 id="starters-title" class="starters__title">Or start with one of these</h2>
			<ol class="starters__list">
				{#each otherStarters as q, index (q.id)}
					<li class="starters__item" {@attach trackQuestionRow(q, index + 1)}>
						<a href={resolve('/questions/[slug]', { slug: q.url })} class="starters__link">
							<span class="starters__num" aria-hidden="true">{index + 2}</span>
							<span class="starters__body">
								<span class="starters__text">{q.question_formatted ?? q.question}</span>
								<span class="mono qi-meta">{takesLabel(q.comment_count)}</span>
							</span>
						</a>
					</li>
				{/each}
			</ol>
		</section>
	{/if}

	<!-- How it works = the core formula. -->
	<section class="formula" aria-labelledby="formula-title">
		<h2 id="formula-title" class="sr-only">How it works: Honesty + Curiosity = Clarity.</h2>
		<ol class="formula__steps">
			<li class="formula__step">
				<span class="formula__word">Honesty</span>
				<span class="formula__line">Give your take first, before anyone can sway it.</span>
			</li>
			<li class="formula__op" aria-hidden="true">+</li>
			<li class="formula__step">
				<span class="formula__word">Curiosity</span>
				<span class="formula__line">Then see how all nine types answered.</span>
			</li>
			<li class="formula__op" aria-hidden="true">=</li>
			<li class="formula__step">
				<span class="formula__word formula__word--end">Clarity</span>
				<span class="formula__line">Know what to do with your situation.</span>
			</li>
		</ol>
	</section>

	<!-- The archive: search, filters, every question (page 1 server-rendered, then load more). -->
	<section id="open-floor" class="archive" aria-labelledby="archive-title">
		<header class="archive__head">
			<h2 id="archive-title" class="archive__title">Every open question</h2>
			<p class="archive__sub">Newest first. Search, or filter by topic.</p>
		</header>

		<div class="archive__toolbar">
			<div class="archive__search">
				<SearchQuestion
					{data}
					showAskAction={Boolean(data?.user?.id)}
					onquestionSelected={(url) => {
						if (url) {
							void goto(resolve('/questions/[slug]', { slug: url }));
						}
					}}
				/>
			</div>

			<div
				id="categories"
				class="filters"
				role="navigation"
				aria-label="Filter questions by category"
			>
				<div class="filters__bar">
					<button
						type="button"
						class="chip chip--toggle"
						aria-expanded={filtersOpen}
						aria-controls="category-filter-panel"
						onclick={() => (filtersOpen = !filtersOpen)}
					>
						{filterButtonLabel}
					</button>
					<a href={resolve('/questions')} class="chip chip--active" aria-current="page"
						>All questions</a
					>
					<a href={resolve('/questions/categories')} class="chip">Full topic tree →</a>
				</div>

				{#if filtersOpen}
					<div id="category-filter-panel" class="filters__panel">
						<div class="filters__panel-head">
							<p class="mono filters__panel-label">Browse topics</p>
							<button type="button" class="filters__close" onclick={() => (filtersOpen = false)}>
								Close
							</button>
						</div>
						<div class="filters__chips">
							{#each data.subcategoryTags ?? [] as cat (cat.id)}
								<a
									href={resolve('/questions/categories/[slug]', {
										slug: cat.slug ?? String(cat.id)
									})}
									class="chip">{cat.category_name}</a
								>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>

		{#if questionsList.length === 0}
			<div class="archive__empty">
				<p class="archive__empty-title">No open questions yet.</p>
				<p class="archive__empty-body">Be the first to bring a situation.</p>
				{#if data.canAskQuestion}
					<Button size="md" variant="secondary" href="/questions/create">Ask a question</Button>
				{/if}
			</div>
		{:else}
			<ul class="qi-list">
				{#each questionsList as q, position (q.id)}
					{@render questionRow(q, position + starterQuestions.length)}
				{/each}
			</ul>
		{/if}

		{#if loadMoreError}
			<p class="archive__error" role="alert">{loadMoreError}</p>
		{/if}

		{#if hasMore}
			<div class="archive__more" {@attach observeLoadMore}>
				<Button size="md" variant="secondary" loading={loadingMore} onclick={() => void loadMore()}>
					{loadingMore ? 'Loading…' : 'Load more questions'}
				</Button>
			</div>
		{/if}
	</section>
</div>

<style>
	/* Page-scoped type sizes (custom properties keep the ratchet's font-size count at zero). */
	.questions-index {
		--qi-big: clamp(56px, 6.6vw, 104px);
		--qi-ital: clamp(38px, 4vw, 62px);
		--qi-featured: clamp(28px, 2.8vw, 40px);
		--qi-formula: clamp(30px, 3.2vw, 44px);
		--qi-section: clamp(26px, 2.6vw, 34px);
		--qi-gutter: clamp(16px, 4vw, 48px);
		width: 100%;
		max-width: 1180px;
		margin: 0 auto;
		padding: 0 var(--qi-gutter) 96px;
		color: var(--text);
	}
	p,
	h1,
	h2 {
		margin: 0;
	}
	ol,
	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* ---------- Hero ---------- */
	.qi-hero {
		display: flex;
		flex-direction: column;
		gap: 22px;
	}
	.qi-kicker {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px 16px;
		font-size: var(--font-size-sm);
		color: var(--text-muted);
	}
	.qi-kicker__open {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-weight: 600;
		color: var(--highlight);
	}
	.qi-kicker__open::before {
		content: '';
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--highlight);
	}
	.qi-kicker__count {
		font-size: var(--font-size-xs);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-faint);
	}
	.qi-title {
		font-weight: 400;
		line-height: 0.9;
	}
	.qi-title__big {
		display: block;
		font-family: var(--font-shout);
		font-size: var(--qi-big);
		text-transform: uppercase;
		letter-spacing: 0.005em;
		color: var(--text);
	}
	.qi-title__ital {
		display: block;
		margin-top: -0.02em;
		font-family: var(--font-voice);
		font-style: italic;
		font-size: var(--qi-ital);
		line-height: 1;
		color: var(--highlight);
	}
	.qi-lede {
		max-width: 34rem;
		font-size: var(--font-size-lg);
		line-height: 1.55;
		color: var(--text-muted);
	}
	.qi-hero__actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px 24px;
		margin-top: 4px;
	}
	.qi-text-link {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		font-weight: 600;
		color: var(--highlight);
		text-decoration: underline;
		text-underline-offset: 4px;
	}

	/* ---------- Pick one ---------- */
	.qi-top {
		display: grid;
		grid-template-columns: minmax(0, 6fr) minmax(0, 5fr);
		gap: clamp(28px, 4vw, 64px);
		align-items: center;
		padding: clamp(40px, 6vw, 80px) 0 clamp(32px, 4vw, 48px);
	}
	.qi-top--solo {
		grid-template-columns: minmax(0, 1fr);
	}
	.featured {
		display: flex;
		flex-direction: column;
		gap: 22px;
		padding: clamp(22px, 3vw, 36px);
		border: 1px solid color-mix(in srgb, var(--highlight) 24%, transparent);
		border-radius: 18px;
		background:
			radial-gradient(
				120% 90% at 0% 0%,
				color-mix(in srgb, var(--accent) 22%, transparent),
				transparent 60%
			),
			var(--surface);
		box-shadow: 0 30px 80px color-mix(in srgb, var(--accent) 16%, transparent);
	}
	.featured__meta {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 8px 16px;
	}
	.featured__pick {
		font-size: var(--font-size-xs);
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--highlight);
	}
	.featured__count {
		font-size: var(--font-size-xs);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-faint);
	}
	.featured__question {
		font-family: var(--font-voice);
		font-style: italic;
		font-weight: 500;
		font-size: var(--qi-featured);
		line-height: 1.12;
		text-wrap: balance;
	}
	.featured__question-link {
		color: var(--text);
		text-decoration: none;
	}
	.featured__question-link:hover {
		color: var(--highlight);
	}
	.featured__types {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.featured__types-note {
		font-size: var(--font-size-sm);
		color: var(--text-muted);
	}
	.featured__foot {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 14px 20px;
		padding-top: 18px;
		border-top: 1px solid var(--rule);
	}
	.featured__sealed {
		font-size: var(--font-size-sm);
		color: var(--text-muted);
	}
	.featured__sealed b {
		font-weight: 600;
		color: var(--text);
	}

	.starters {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.starters__list {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0 28px;
		border-top: 1px solid var(--rule);
	}
	.starters__title {
		padding-bottom: 8px;
		font-size: var(--font-size-xs);
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--text-faint);
	}

	.starters__link {
		display: grid;
		grid-template-columns: 32px minmax(0, 1fr);
		gap: 14px;
		align-items: start;
		padding: 14px 0;
		color: var(--text);
		text-decoration: none;
	}
	.starters__num {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--accent-deep);
		color: var(--highlight);
		font-family: var(--font-voice);
		font-style: italic;
		font-size: var(--font-size-base);
	}
	.starters__body {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}
	.starters__text {
		font-size: var(--font-size-base);
		font-weight: 500;
		line-height: 1.4;
	}
	.starters__link:hover .starters__text {
		color: var(--highlight);
	}

	/* ---------- Formula ---------- */
	.formula {
		margin-top: clamp(40px, 6vw, 72px);
		padding: clamp(24px, 3vw, 32px) 0;
		border-top: 1px solid var(--rule);
		border-bottom: 1px solid var(--rule);
	}
	.formula__steps {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
		align-items: start;
		gap: clamp(12px, 2vw, 28px);
	}
	.formula__step {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.formula__word {
		font-family: var(--font-shout);
		font-size: var(--qi-formula);
		line-height: 1;
		text-transform: uppercase;
		color: var(--text);
	}
	.formula__word--end {
		font-family: var(--font-voice);
		font-style: italic;
		text-transform: none;
		color: var(--highlight);
	}
	.formula__line {
		max-width: 20rem;
		font-size: var(--font-size-sm);
		line-height: 1.5;
		color: var(--text-muted);
	}
	.formula__op {
		font-family: var(--font-voice);
		font-style: italic;
		font-size: var(--qi-formula);
		line-height: 1;
		color: var(--text-faint);
	}

	/* ---------- Archive ---------- */
	.archive {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-top: clamp(48px, 7vw, 88px);
		scroll-margin-top: 88px;
	}
	.archive__head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 6px 20px;
	}
	.archive__title {
		font-family: var(--font-voice);
		font-style: italic;
		font-weight: 500;
		font-size: var(--qi-section);
		line-height: 1.1;
	}
	.archive__sub {
		font-size: var(--font-size-sm);
		color: var(--text-muted);
	}
	.archive__toolbar {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.archive__search {
		width: 100%;
	}

	.filters__bar,
	.filters__chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		min-height: 36px;
		padding: 6px 14px;
		border: 1px solid var(--rule);
		border-radius: 999px;
		background: transparent;
		color: var(--text-muted);
		font: 500 var(--font-size-sm) / 1.2 var(--font-talk);
		text-decoration: none;
		cursor: pointer;
		transition:
			border-color 0.15s,
			color 0.15s;
	}
	.chip:hover {
		border-color: color-mix(in srgb, var(--highlight) 45%, transparent);
		color: var(--highlight);
	}
	.chip--active {
		border-color: color-mix(in srgb, var(--highlight) 40%, transparent);
		background: color-mix(in srgb, var(--highlight) 10%, transparent);
		color: var(--highlight);
	}
	.chip--toggle {
		color: var(--text);
	}
	.filters__panel {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-top: 12px;
		padding: 16px;
		border: 1px solid var(--rule);
		border-radius: 14px;
		background: var(--surface);
	}
	.filters__panel-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.filters__panel-label {
		font-size: var(--font-size-xs);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-faint);
	}
	.filters__close {
		min-height: 36px;
		padding: 0 6px;
		border: 0;
		background: none;
		color: var(--highlight);
		font: 600 var(--font-size-sm) / 1 var(--font-talk);
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
	}

	.qi-list {
		border-top: 1px solid var(--rule);
	}
	.qi-row {
		border-bottom: 1px solid var(--rule);
	}
	.qi-row__link {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 16px 4px;
		color: var(--text);
		text-decoration: none;
		transition: background-color 0.15s;
	}
	.qi-row__link:hover {
		background: color-mix(in srgb, var(--highlight) 4%, transparent);
	}
	.qi-row__text {
		font-size: var(--font-size-base);
		font-weight: 500;
		line-height: 1.45;
	}
	.qi-row__link:hover .qi-row__text {
		color: var(--highlight);
	}
	.qi-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 2px 8px;
		font-size: var(--font-size-xs);
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--text-faint);
	}
	.qi-meta__topic {
		color: var(--text-muted);
	}
	.qi-meta__sep {
		opacity: 0.7;
	}

	.archive__empty {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
		padding: 32px 0;
	}
	.archive__empty-title {
		font-family: var(--font-voice);
		font-style: italic;
		font-size: var(--font-size-xl);
	}
	.archive__empty-body,
	.archive__error {
		font-size: var(--font-size-sm);
		color: var(--text-muted);
	}
	.archive__more {
		display: flex;
		justify-content: center;
		padding-top: 12px;
	}

	a:focus-visible,
	button:focus-visible {
		outline: 2px solid var(--focus, var(--highlight));
		outline-offset: 3px;
		border-radius: 6px;
	}

	/* ---------- Phone ---------- */
	@media (max-width: 900px) {
		.qi-top {
			grid-template-columns: minmax(0, 1fr);
			align-items: start;
		}
		.starters__list {
			grid-template-columns: minmax(0, 1fr);
		}
		.starters__item + .starters__item {
			border-top: 1px solid var(--rule);
		}
		/* Phone: the operator sits in a narrow left column beside the word it joins. */
		.formula__steps {
			grid-template-columns: 28px minmax(0, 1fr);
			gap: 14px 10px;
		}
		.formula__step:first-child {
			grid-column: 2;
		}
	}
	@media (max-width: 520px) {
		.qi-top {
			padding-top: 28px;
			gap: 28px;
		}
		.qi-hero {
			gap: 16px;
		}
		.qi-lede {
			font-size: var(--font-size-base);
		}
		.featured {
			gap: 18px;
		}
		/* Keep all nine types on one row inside the card. */
		.featured :global(.answered-types) {
			--dot: 28px;
			flex-wrap: nowrap;
			gap: 4px;
		}
		.featured__foot :global(.btn) {
			width: 100%;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.qi-row__link,
		.chip {
			transition: none;
		}
	}
</style>
