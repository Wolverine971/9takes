<!-- src/routes/personality-analysis/[slug]/+page.svelte -->
<!--
  /personality-analysis/[slug] — Streetlamp Symposium V5.
  Phase 5 page #2 of docs/design/2026-05-04-rollout-plan.md.

  Restyle, don't rewrite: long-form blog page wrapped in a V5 case-file
  header. All imported blog components (ArticleSubTitle,
  PeopleBlogPageHead, TableOfContents,
  RelatedPosts, FAQSection, AuthorBio, BlogPurpose, QuickAnswer, BookSessionCTA, PopCard)
  are preserved — only the layout chrome and scoped styles migrate.

  Runes mode (2026-11-01 migration): derived page data, the TOC fed by an
  article attachment, and placeholder components re-mounted by an effect that
  follows the article HTML.

  Cold Light (2026-11-06): page styles use the Cold Light tokens in
  src/scss/index.scss. No per-type color paints the page; one tint, like the statues.
-->
<script lang="ts">
	import { onMount, tick, untrack } from 'svelte';
	import { mount, unmount, type Component } from 'svelte';
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import {
		buildPersonalityImagePath,
		formatPersonalityDisplayName
	} from '$lib/utils/personalityAnalysis';
	import { ENNEAGRAM_TYPE_COLORS } from '$lib/constants/enneagramColors';
	import { getAuthShell } from '$lib/authShell.svelte';
	import type { PublicBlogCommentRow } from '../../api/personality-analysis/[slug]/discussion/+server';
	import { buildArticleFlow } from '$lib/utils/articleChorusSlot';
	import { SectionKicker, Spinner } from '$lib/components/atoms';
	import EnneagramTypeDossier from '$lib/components/blog/EnneagramTypeDossier.svelte';
	import NineChorus from '$lib/components/blog/NineChorus.svelte';
	import TestNudge from '$lib/components/blog/TestNudge.svelte';
	import { enneagramTypeProfiles } from '$lib/data/enneagramTypeProfiles';

	// Only import critical components for initial render
	import PeopleBlogPageHead from '$lib/components/blog/PeopleBlogPageHead.svelte';
	import ArticleSubTitle from '$lib/components/blog/ArticleSubTitle.svelte';
	import PeopleSuggestionsSideBar from '$lib/components/blog/PeopleSuggestionsSideBar.svelte';
	import BetaRailCard from '$lib/components/blog/BetaRailCard.svelte';
	import ExperimentalTherapyInvite from '$lib/components/blog/ExperimentalTherapyInvite.svelte';
	import TableOfContents, { trackArticleHtml } from '$lib/components/blog/TableOfContents.svelte';
	// Lazy-loaded RelatedPosts component
	import RelatedPosts from '$lib/components/molecules/RelatedPosts.svelte';
	// import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';
	import PopCard from '$lib/components/atoms/PopCard.svelte';

	import BlogPurpose from '$lib/components/blog/BlogPurpose.svelte';
	import QuickAnswer from '$lib/components/blog/callouts/QuickAnswer.svelte';
	import AuthorBio from '$lib/components/blog/AuthorBio.svelte';
	import ArticleSources from '$lib/components/blog/ArticleSources.svelte';
	import EvidenceFigure from '$lib/components/blog/EvidenceFigure.svelte';
	import FAQSection from '$lib/components/blog/FAQSection.svelte';
	import OpenCaseNote from '$lib/components/blog/OpenCaseNote.svelte';

	let { data }: { data: PageData } = $props();

	function toStringValue(value: unknown, fallback: string = ''): string {
		return typeof value === 'string' ? value : value == null ? fallback : String(value);
	}

	function toStringArray(value: unknown): string[] {
		if (!Array.isArray(value)) return [];
		return value.filter((item): item is string => typeof item === 'string');
	}

	function toFaqArray(value: unknown): App.BlogPostFaq[] {
		if (!Array.isArray(value)) return [];

		return value
			.map((item) => {
				if (!item || typeof item !== 'object' || Array.isArray(item)) return null;

				const record = item as Record<string, unknown>;
				const question = toStringValue(record.question).trim();
				const answer = toStringValue(record.answer).trim();
				const anchor = toStringValue(record.anchor).trim();

				if (!question || !answer) return null;

				return {
					question,
					answer,
					...(anchor && { anchor })
				};
			})
			.filter((item): item is App.BlogPostFaq => Boolean(item));
	}

	function toEnneagramNumber(value: unknown): number | undefined {
		if (typeof value === 'number' && Number.isFinite(value)) return value;
		if (typeof value === 'string' && value.trim() !== '') {
			const parsed = Number.parseInt(value, 10);
			return Number.isFinite(parsed) ? parsed : undefined;
		}
		return undefined;
	}

	function normalizePost(post: PageData['post']): App.BlogPost {
		return {
			...(post as unknown as App.BlogPost),
			slug: toStringValue(post.slug),
			title: toStringValue(post.title),
			meta_title: toStringValue(post.meta_title),
			persona_title: toStringValue(post.persona_title),
			author: toStringValue(post.author, 'DJ Wayne'),
			description: toStringValue(post.description),
			date: toStringValue(post.date),
			loc: toStringValue(post.loc),
			lastmod: toStringValue(post.lastmod),
			changefreq: toStringValue(post.changefreq),
			priority: toStringValue(post.priority),
			published: post.published === true,
			enneagram: toEnneagramNumber(post.enneagram),
			type: toStringArray(post.type),
			suggestions: toStringArray(post.suggestions),
			person: toStringValue(post.person),
			wikipedia: toStringValue(post.wikipedia),
			twitter: toStringValue(post.twitter),
			instagram: toStringValue(post.instagram),
			tiktok: toStringValue(post.tiktok),
			keywords: toStringArray(post.keywords),
			same_as: toStringArray(post.same_as),
			faqs: toFaqArray(post.faqs),
			wikidata_qid: toStringValue(post.wikidata_qid),
			imdb_id: toStringValue(post.imdb_id),
			birth_date: toStringValue(post.birth_date),
			birth_place: toStringValue(post.birth_place),
			nationality: toStringValue(post.nationality),
			occupation: toStringArray(post.occupation),
			knows_about: toStringArray(post.knows_about),
			citations: toStringArray(post.citations),
			word_count:
				typeof post.word_count === 'number' && Number.isFinite(post.word_count)
					? post.word_count
					: undefined,
			time_required: toStringValue(post.time_required)
		};
	}

	const componentTypes: { tag: string; component: Component<Record<string, any>> }[] = [
		{ tag: 'PopCard', component: PopCard },
		{ tag: 'BlogPurpose', component: BlogPurpose as Component<Record<string, any>> },
		{ tag: 'QuickAnswer', component: QuickAnswer },
		{ tag: 'EvidenceFigure', component: EvidenceFigure as Component<Record<string, any>> }
	];
	// eslint-disable-next-line svelte/prefer-svelte-reactivity -- bookkeeping for imperatively mounted components, never rendered
	const mountedPlaceholders = new Map<
		string,
		{ instance: ReturnType<typeof mount>; target: HTMLElement }
	>();

	type DiscussionComment = PublicBlogCommentRow;

	// Signed-in state is hydrated in the browser (the HTML is shared), so read it
	// from the auth shell rather than the page payload.
	const authShell = getAuthShell();

	// Use direct reactive assignments to ensure updates on navigation
	const post = $derived(data.post);
	// A client-side navigation to another person reuses this page. Per-person
	// state below resets when this changes (a primitive, so a refreshed `data`
	// for the same person doesn't reset anything).
	const personSlug = $derived(data.post.slug);

	/** Returns `value`; reading `key` makes a writable $derived reset to it when the key changes. */
	function resetPerPerson<T>(_key: string, value: T): T {
		return value;
	}

	let commentsLoaded = false;
	let commentsVisible = $derived(resetPerPerson(personSlug, false));

	// The page HTML is shared by every visitor (ISR), so the discussion arrives
	// from /api/personality-analysis/[slug]/discussion when the section is near
	// the viewport. The give-first gate is still decided on the server.
	let comments = $derived(resetPerPerson(personSlug, [] as DiscussionComment[]));
	let userHasAnswered = $derived(resetPerPerson(personSlug, false));
	let discussionLoaded = false;
	let discussionRequest: Promise<void> | null = null;
	const postMeta = $derived(normalizePost(post));
	// Server-filtered to published pages; falls back to the raw column so the
	// rail still renders if an older payload comes through without the field.
	const postSuggestions = $derived(data.suggestedPeople ?? toStringArray(postMeta.suggestions));
	const postDisplayName = $derived(formatPersonalityDisplayName(postMeta.person || postMeta.slug));
	const caseFileTitle = $derived(postDisplayName);
	const postImagePath = $derived(
		buildPersonalityImagePath(postMeta.enneagram, postMeta.person || postMeta.slug)
	);

	// ------------------------------------------------------------------
	// V5 case-file header — derived data lines.
	// blogs_famous_people does NOT carry core_fear / core_desire /
	// stress_line / growth_line columns, so the dossier core line is
	// built from type metadata (name + title) instead. If those columns
	// are added in the future, this is the place to wire them in.
	// ------------------------------------------------------------------
	const typeNum = $derived(toEnneagramNumber(postMeta.enneagram));
	const typeMeta = $derived(typeNum ? ENNEAGRAM_TYPE_COLORS[typeNum] : null);
	// Type dossier panel — the densest dossier component used to ship only on
	// enneagram-corner type pillars while this (the actual dossier surface)
	// was generic prose. Design audit 2026-06-10. CTA bridges to the pillar.
	const typeDossier = $derived(typeNum ? enneagramTypeProfiles[typeNum] : null);
	// The give-first Chorus: the person's own question while it is public,
	// otherwise a proven live question (chosen in +page.server.ts). Identical
	// for every visitor, so it can live in the ISR copy.
	const chorus = $derived(data.chorus ?? null);
	// Open case: a thin-record profile (pipeline-set profile_format). Adds the
	// header marker and the closing format note; standard profiles are untouched.
	const isOpenCase = $derived(data.isOpenCase === true);
	// The article author chooses the dossier's exact location with an
	// <EnneagramTypeDossier /> element in the source markdown. Without that
	// explicit slot, the article renders uninterrupted and no dossier appears.
	// The Chorus goes at the section break nearest 40% of the article (about 42%
	// of engaged readers reach the middle, 19% the bottom); articles too short
	// for a clean break keep it at the bottom. Either block may come first.
	const articleFlow = $derived(buildArticleFlow(post.content, { withChorus: Boolean(chorus) }));
	// Each segment keyed by its role in the flow: the dossier and the Chorus
	// appear at most once, prose runs by their order (prose-1 is the run the TOC reads).
	const flowSegments = $derived.by(() => {
		let proseRun = 0;
		return articleFlow.segments.map((segment) => ({
			segment,
			key: segment.kind === 'prose' ? `prose-${++proseRun}` : segment.kind
		}));
	});
	const typeName = $derived(typeMeta?.name ?? '');
	const typeNameUpper = $derived(typeName ? typeName.toUpperCase() : '');
	const personaTitle = $derived(toStringValue(postMeta.persona_title).trim());

	// Deterministic 4-digit dossier number — predictable per-slug so the
	// catalog feels real. Same person → same №.
	function fileNumber(seed: string): string {
		let h = 0;
		for (let i = 0; i < seed.length; i++) {
			h = (h * 31 + seed.charCodeAt(i)) | 0;
		}
		return String(Math.abs(h) % 10000).padStart(4, '0');
	}

	const dossierNum = $derived(fileNumber(postMeta.slug || postMeta.person || ''));

	function formatTimeRequired(value: string | null | undefined): string {
		if (!value) return '';
		const m = String(value).match(/^PT(\d+)M$/i);
		if (m) return `${m[1]} MIN READ`;
		return String(value).toUpperCase();
	}

	function formatWordCount(value: number | null | undefined): string {
		if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return '';
		return `${value.toLocaleString()} WORDS`;
	}

	const wordCountLabel = $derived(formatWordCount(postMeta.word_count));
	const timeRequiredLabel = $derived(formatTimeRequired(postMeta.time_required));

	// Table of Contents support: the first article run's live HTML, kept current
	// by an attachment (debounced, direct children only) for the TOC's fallback.
	let tocContent = $state('');

	const commentAdded = (detail: PublicBlogCommentRow[]) => {
		comments = [...detail, ...comments];
		userHasAnswered = true;
	};

	// Dynamically import less critical components
	let BlogComments = $state<
		typeof import('$lib/components/blog/BlogComments.svelte').default | undefined
	>();
	let BlogInteract = $state<
		typeof import('$lib/components/blog/BlogInteract.svelte').default | undefined
	>();
	let SuggestFamousPerson = $state<
		typeof import('$lib/components/molecules/SuggestFamousPerson.svelte').default | undefined
	>();

	onMount(() => clearMountedPlaceholderComponents);

	// Set up lazy loading for components, and re-arm it for each person
	// (client-side navigation reuses this page).
	$effect(() => {
		const slug = personSlug;
		// setupPage reads the auth store; only the person should re-run this.
		untrack(() => setupPage(slug));
		return () => commentsObserver?.disconnect();
	});

	async function loadDiscussion(slug: string) {
		if (!browser || discussionLoaded || discussionRequest) return;

		discussionRequest = (async () => {
			try {
				const response = await fetch(
					`/api/personality-analysis/${encodeURIComponent(slug)}/discussion`,
					{ headers: { Accept: 'application/json' }, credentials: 'same-origin' }
				);
				if (!response.ok) return;

				const payload = (await response.json()) as {
					userHasAnswered?: boolean;
					comments?: DiscussionComment[];
				};
				// A comment posted while this was in flight must not be dropped.
				const pending = comments;
				comments = [...pending, ...(payload.comments ?? [])];
				userHasAnswered = Boolean(payload.userHasAnswered) || userHasAnswered;
				discussionLoaded = true;
			} catch {
				// Leave the gate closed; posting an answer still opens it.
			} finally {
				discussionRequest = null;
			}
		})();

		await discussionRequest;
	}

	let commentsObserver: IntersectionObserver | undefined;

	// Set up the page observers and dynamic components
	function setupPage(slug: string) {
		// Per-page loading flags (the reactive discussion state resets on its own).
		commentsLoaded = false;
		discussionLoaded = false;
		discussionRequest = null;

		// Set up intersection observer for comments section
		commentsObserver = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !commentsLoaded) {
					commentsVisible = true;
					commentsLoaded = true;

					// Per-visitor half of the page: gate state + comments.
					loadDiscussion(slug);

					// Load comments components
					Promise.all([
						import('$lib/components/blog/BlogComments.svelte'),
						import('$lib/components/blog/BlogInteract.svelte')
					]).then(([commentsModule, interactModule]) => {
						BlogComments = commentsModule.default;
						BlogInteract = interactModule.default;
					});
				}
			},
			{ rootMargin: '200px' }
		); // Load when element is 200px from viewport

		// Load SuggestFamousPerson component (lowest priority)
		if (!authShell.user) {
			import('$lib/components/molecules/SuggestFamousPerson.svelte').then((module) => {
				SuggestFamousPerson = module.default;
			});
		}

		// Set up observers after DOM is ready
		tick().then(() => {
			const commentsSection = document.getElementById('comments-section');
			if (commentsSection) {
				commentsObserver?.observe(commentsSection);
			}
		});
	}

	function mountPlaceholderComponents(placeholders: NonNullable<PageData['placeholders']>) {
		const activePlaceholderIds = new Set(placeholders.map((placeholder) => placeholder.id));

		// Remove instances that no longer exist in this page payload/DOM. Ids
		// repeat from person to person (component-blogpurpose-0), so after a
		// client-side nav the same id points at a fresh element: compare the
		// element itself, or the new article keeps its static fallback.
		mountedPlaceholders.forEach(({ instance, target }, id) => {
			if (!activePlaceholderIds.has(id) || document.getElementById(id) !== target) {
				unmount(instance);
				mountedPlaceholders.delete(id);
			}
		});

		placeholders.forEach((placeholder) => {
			if (mountedPlaceholders.has(placeholder.id)) return;

			const element = document.getElementById(placeholder.id);
			if (!element) return;

			const componentType = componentTypes.find((ct) => ct.tag === placeholder.type);
			if (!componentType) return;

			// BlogPurpose opens its Enneagram diagram on this article's person.
			const props =
				placeholder.type === 'BlogPurpose'
					? { ...placeholder.props, personName: postDisplayName, personType: typeNum }
					: placeholder.props;
			const fallback = element.querySelector('[data-ssr-fallback]');
			const instance = mount(componentType.component, { target: element, props });
			if (fallback?.parentElement === element) {
				fallback.remove();
			}
			mountedPlaceholders.set(placeholder.id, { instance, target: element });
		});
	}

	function clearMountedPlaceholderComponents() {
		mountedPlaceholders.forEach(({ instance }) => {
			unmount(instance);
		});
		mountedPlaceholders.clear();
	}

	// Mount the placeholder components into the article HTML, and again whenever
	// that HTML is re-rendered (client-side navigation to another person).
	$effect(() => {
		const placeholders = data.placeholders;
		const segments = flowSegments; // the article runs the placeholders live in
		if (placeholders && segments.length > 0) {
			untrack(() => mountPlaceholderComponents(placeholders));
		}
	});
</script>

<!-- SEO head — pure metadata, must run early. -->
<PeopleBlogPageHead data={postMeta} />

<!-- ★ PRIMARY ACTION — the give-first Chorus is the one thing this page drives
     toward; nothing around it should out-shout it. Rendered once: mid-article
     when there is a clean section break, otherwise after the FAQ. The question
     is often a proven question rather than one about this person, so the lead
     ties it to the reader, never to the subject. -->
{#snippet chorusBlock()}
	{#if chorus}
		<!-- Remount per person: a fresh answer form and gate impression for each page. -->
		{#key post.slug}
			<NineChorus
				subjectType={chorus.subjectType}
				slug={post.slug}
				question={chorus.question}
				questionUrl={chorus.questionUrl}
				personName={postDisplayName}
				sourcePath={`/personality-analysis/${post.slug}`}
				lead={chorus.source === 'proven'
					? `You’ve been reading about ${postDisplayName}’s personality. What about yours? Start with an easy question about you.`
					: 'What does this bring up for you? Add your own perspective.'}
			/>
		{/key}
	{/if}
{/snippet}

<article class="dossier-page">
	<!-- =====================================================================
	  §01 CASE FILE — V5 dossier header (the brand moment)
	  ===================================================================== -->
	<section class="case-file" aria-labelledby="case-file-name">
		<div class="case-file-pool" aria-hidden="true"></div>

		<div class="case-file-inner">
			<div class="case-file-text">
				<div class="case-file-kicker" class:case-file-kicker--open-case={isOpenCase}>
					<SectionKicker
						num={dossierNum}
						label={`TYPE ${typeNum ?? '—'} · ${typeNameUpper || 'CASE FILE'}`}
					/>
					<!-- Thin-record profile: the type above is the leading read, not a
					     verdict. Jumps to the closing note that explains the format. -->
					{#if isOpenCase}
						<a
							class="case-file-status"
							href="#open-case"
							aria-label="Open case: see how this profile works"
						>
							<span class="case-file-status-ring" aria-hidden="true"></span>
							Open case
							<span class="case-file-status-arrow" aria-hidden="true">↓</span>
						</a>
					{/if}
				</div>

				<h1 id="case-file-name" class="case-file-name">{caseFileTitle}</h1>

				<!-- The persona title lives on the portrait caption only; repeating it
				     under the name put the same line on screen twice. -->
				{#if postMeta.description}
					<p class="case-file-subhead">
						{postMeta.description}
					</p>
				{/if}

				{#if wordCountLabel || timeRequiredLabel}
					<div class="case-file-coords mono">
						{#if wordCountLabel}{wordCountLabel}{/if}
						{#if wordCountLabel && timeRequiredLabel}<span class="case-file-coord-sep">·</span>{/if}
						{#if timeRequiredLabel}{timeRequiredLabel}{/if}
					</div>
				{/if}

				<!-- Preserved: legacy ArticleSubTitle still renders author/date attribution;
				     visually demoted into a quiet meta-row at the bottom of the case-file header. -->
				<div class="legacy-article-meta">
					<ArticleSubTitle metaData={postMeta} structuredData={false} />
				</div>
			</div>

			<aside class="case-file-portrait">
				<div class="portrait-frame personality-portrait-well">
					{#if postImagePath}
						<img
							src={postImagePath}
							alt={`Portrait of ${postDisplayName}`}
							class="portrait-image personality-portrait-image"
							loading="eager"
							fetchpriority="high"
							decoding="async"
						/>
					{:else}
						<div class="portrait-stub">
							<span class="mono">[PORTRAIT]</span>
						</div>
					{/if}
					<div class="portrait-vignette"></div>
					<div class="portrait-corner portrait-corner--tl" aria-hidden="true"></div>
					<div class="portrait-corner portrait-corner--tr" aria-hidden="true"></div>
					<div class="portrait-corner portrait-corner--bl" aria-hidden="true"></div>
					<div class="portrait-corner portrait-corner--br" aria-hidden="true"></div>
					<div class="portrait-mono">
						<!-- <span class="mono">9TAKES · CASE FILE №.{dossierNum}</span> -->

						{#if personaTitle || typeName}
							<span class="mono">
								{#if personaTitle}
									{personaTitle.toUpperCase()}
								{:else if typeName}
									{typeName.toUpperCase()}
								{/if}
							</span>
						{/if}
					</div>
				</div>
			</aside>
		</div>
	</section>

	<!-- Article navigation belongs to the case-file prelude, before the divider
	     that marks the beginning of the long-form analysis. Keeping it outside
	     .breakdown prevents opening quotes from reading as part of the TOC card. -->
	<aside class="article-navigation" aria-label="Article navigation">
		<div class="article-navigation-inner">
			<TableOfContents
				content={tocContent}
				headings={data.headings}
				sidePosition="right"
				renderMode="accordion-only"
				accordionOpen={false}
			/>
			<!-- One quiet line to the test; the Chorus further down stays the main ask. -->
			<TestNudge
				lead={`Wondering if you share ${postDisplayName}’s type?`}
				placement="celebrity_top"
			/>
		</div>
	</aside>

	<div class="article-divider" aria-hidden="true"></div>

	<!-- =====================================================================
	  §02 BREAKDOWN — long-form analysis body.
	  Portrait lives in the case-file header above; this section is prose-first.
	  ===================================================================== -->
	<section class="breakdown">
		<div class="breakdown-inner">
			<!-- Prose runs, interrupted by the author-placed dossier slot and the
			     mid-article Chorus in whichever order they fall. Both blocks are
			     lifted out of the article-body prose scope so the page's :global()
			     typography never bleeds into them. The first run is always the
			     plain .article-body the TOC observer reads. -->
			{#each flowSegments as { segment, key }, index (key)}
				{#if segment.kind === 'prose'}
					<div
						class="article-body"
						class:article-body--cont={index > 0}
						{@attach key === 'prose-1' &&
							trackArticleHtml((html) => (tocContent = html), {
								subtree: false,
								debounceMs: 150
							})}
					>
						{@html segment.html}
					</div>
				{:else if segment.kind === 'dossier'}
					{#if typeDossier}
						<!-- The component owns its complete visual hierarchy. The former route-level
						     shelf repeated the type label and added a redundant third container. -->
						<EnneagramTypeDossier
							{...typeDossier}
							showCta={true}
							ctaHref={`/enneagram-corner/enneagram-type-${typeNum}`}
							ctaLabel={`Read the full Type ${typeNum} breakdown`}
						/>
					{/if}
				{:else}
					{@render chorusBlock()}
				{/if}
			{/each}

			<ArticleSources
				citations={postMeta.citations ?? []}
				articleCitations={postMeta.article_citations ?? []}
			/>

			{#if (postMeta.faqs?.length ?? 0) >= 2}
				<FAQSection
					faqs={postMeta.faqs ?? []}
					title={`Questions about ${postDisplayName}`}
					sectionId="frequently-asked-questions"
				/>
			{/if}

			<!-- Short articles with no clean mid-article break keep the Chorus here. -->
			{#if !articleFlow.hasChorusSlot}
				{@render chorusBlock()}
			{/if}

			{#if isOpenCase}
				<OpenCaseNote personName={postDisplayName} />
			{/if}

			<AuthorBio />
		</div>
	</section>
</article>

<TableOfContents
	content={tocContent}
	headings={data.headings}
	sidePosition="right"
	renderMode="sidebar-only"
	hideBeforeBottom={1400}
/>

<!-- Floating related-personalities rail — the curated `suggestions` graph,
     mirrored on the left of the TOC. Desktop only; auto-hides near the top and
     bottom of the page so it never collides with the "Further analysis" block.
     Inline list suppressed: that bottom section is the canonical related block.
     The beta card rides at the top of this rail on wide screens; narrower
     screens get it inside the article instead (ExperimentalTherapyInvite).
     Remounted per person: ExperimentalTherapyInvite re-places its card in the
     new article, and the beta card re-arms its per-page view tracking. -->
{#key post.slug}
	<PeopleSuggestionsSideBar
		links={postSuggestions}
		bridgeLinks={data.bridgeLinks ?? []}
		showInline={false}
		hideBeforeBottom={1400}
	>
		{#snippet lead()}
			<BetaRailCard surface="celebrity" personName={postDisplayName} />
		{/snippet}
	</PeopleSuggestionsSideBar>
	<ExperimentalTherapyInvite
		surface="celebrity"
		personName={postDisplayName}
		articleSelector=".breakdown-inner .article-body"
		fraction={0.7}
		floatingRail={false}
	/>
{/key}

<!-- =====================================================================
  §03 DISCUSSION — the human layer (lazy loaded). One feedback section with
  two ways to weigh in: react to this analysis (comments), or tell us who to
  cover next (suggest). Demoted beneath the Chorus, the give-first moment.
  ===================================================================== -->
<section id="comments-section" class="discussion">
	<div class="discussion-inner">
		<div class="discussion-kicker">
			<SectionKicker num="03" label="DISCUSSION" />
		</div>
		<h3 class="discussion-title">Add your read on {postDisplayName}</h3>

		{#if BlogComments && BlogInteract}
			<div class="discussion-body">
				<BlogComments
					slug={post.slug}
					{comments}
					user={authShell.user}
					parentType="personality-analysis"
					{userHasAnswered}
				/>
				<BlogInteract data={data as any} onCommentAdded={commentAdded} user={authShell.user} />
			</div>
		{:else if commentsVisible}
			<div class="loading-placeholder">
				<Spinner size="md" label="Loading discussion" />
			</div>
		{/if}

		<!-- Second way to weigh in — folded into the same feedback section.
		     Remounted per person so the suggestion form starts fresh. -->
		{#key post.slug}
			{#if !authShell.user && SuggestFamousPerson}
				<div class="discussion-suggest">
					<SuggestFamousPerson />
				</div>
			{/if}
		{/key}
	</div>
</section>

<!-- =====================================================================
  §04 FURTHER ANALYSIS — the single canonical related block (DB-driven case
  files) plus quiet framework bridges. The floating rail above surfaces the
  curated graph mid-scroll and hides before this section comes into view.
  ===================================================================== -->
<section id="related-content" class="related">
	<div class="related-inner">
		<div class="related-kicker">
			<SectionKicker num="04" label="FURTHER ANALYSIS" />
		</div>
		<RelatedPosts
			enneagramType={postMeta.enneagram?.toString() || null}
			sameNichePosts={data.relatedPosts?.sameNichePosts ?? []}
			sameEnneagramPosts={data.relatedPosts?.sameEnneagramPosts ?? []}
		/>

		{#if data.bridgeLinks?.length}
			<nav class="related-framework" aria-label="Explore the personality framework">
				<p class="related-framework-label mono">Explore the framework</p>
				<ul>
					{#each data.bridgeLinks as bridge (bridge.href)}
						<li>
							<a href={bridge.href} data-track="profile-related-bridge">{bridge.label}</a>
						</li>
					{/each}
				</ul>
			</nav>
		{/if}
	</div>
</section>

<style lang="scss">
	/* =========================================================
	  /personality-analysis/[slug] — Cold Light dossier (2026-11-06).
	  Anton name, Playfair italic hook, Archivo for everything read.
	  Tokens ship globally in src/scss/index.scss.

	  Layout contract (2026-09-23 style audit): everything below the case-file
	  header — TOC, prose, dossier, sources, FAQ, Chorus, bio, discussion,
	  related — sits on ONE reading column (--prose-measure) with ONE left
	  edge. Before this the body had six different left edges (184/280/294/
	  310/328/341px at 1440) because each block carried its own max-width.
	  ========================================================= */

	/* Side gutter for every section; the column centers inside it. */
	$gutter: 48px;
	$gutter-sm: 24px;

	/* Reading measure for profiles: 19px type on a 760px column ≈ 70
	   characters per line (was 18px on 852px ≈ 82–87, past the 75 ceiling).
	   Bigger type rather than a narrower column alone, so the page doesn't
	   read cramped at desktop widths. Set on all three top-level sections
	   because discussion/related render outside .dossier-page. */
	$measure: 47.5rem;
	$reading-size: 19px;

	.dossier-page,
	.discussion,
	.related {
		--prose-measure: #{$measure};
	}

	/* Furniture blocks (content callouts and mounted components) own their
	   internal type. Page prose rules skip anything inside them — otherwise
	   the prose rules' higher specificity re-set every callout caption,
	   label, and quote to 18px body copy (a dialogue attribution rendered as a
	   full-size white paragraph; evidence captions picked up 22px gaps). */
	/* Built as :where(:not(.a *):not(.b *)…): :where() adds zero specificity,
	   and a chain of simple :not()s survives postcss-preset-env, which
	   rewrites :not(:is(.a, .b) *) into one rule per item — an OR that
	   matches every furniture block again. */
	$furniture: (
		'.key-stat',
		'.key-stat-row',
		'.contrast-panel',
		'.dialogue',
		'.timeline',
		'.inner-thought',
		'.source-card',
		'.aside-box',
		'.pull-quote',
		'.blog-evidence',
		'.quick-answer',
		'.blog-purpose',
		'.pop-card',
		'.disclaimer',
		'[data-component-placeholder]'
	);
	$prose-nots: '';
	@each $block in $furniture {
		$prose-nots: '#{$prose-nots}:not(#{$block} *)';
	}
	$prose: ':where(#{$prose-nots})';

	.dossier-page {
		position: relative;
		contain: layout;
		margin: 0 auto;
		/* Cancel the global `article` card padding/radius: it inset the type
		   stripe 8px and gave the body a different gutter than the
		   discussion/related sections, which render outside this element. */
		padding: 0;
		border-radius: 0;
		max-width: 100%;
		overflow-x: hidden;
		background: var(--bg);
		color: var(--text);
		font-family: var(--font-talk);
	}

	@supports (overflow-x: clip) {
		.dossier-page {
			overflow-x: clip;
		}
	}

	/* ---------- shared utilities ----------
	   `.mono` is the legacy class name for small labels. Cold Light has no mono
	   face: they're Archivo, uppercase and letter-spaced. Scoped to the page's
	   own surfaces so the injected EnneagramTypeDossier keeps its own labels. */
	.case-file :global(.mono),
	.discussion :global(.mono),
	.related :global(.mono) {
		font-family: var(--font-talk);
		font-size: var(--font-size-xs);
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-faint);
	}

	/* =========================================================
	  §01 CASE FILE HEADER — the visible brand moment
	  ========================================================= */
	.case-file {
		position: relative;
		padding: 96px $gutter 48px;
		background: var(--bg);
		overflow: hidden;
		border-top: 1px solid var(--rule);

		@media (max-width: 768px) {
			padding: 56px $gutter-sm 48px;
		}
	}

	.case-file-pool {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(
				ellipse 60% 55% at 18% 8%,
				color-mix(in srgb, var(--accent) 22%, transparent) 0%,
				color-mix(in srgb, var(--accent) 6%, transparent) 30%,
				transparent 60%
			),
			radial-gradient(
				ellipse 90% 70% at 22% 12%,
				color-mix(in srgb, var(--accent-deep) 14%, transparent) 0%,
				transparent 55%
			);
		z-index: 0;
	}

	.case-file-inner {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: 1280px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1.25fr 0.75fr;
		gap: 48px;
		align-items: center;

		@media (max-width: 968px) {
			grid-template-columns: 1fr;
			gap: 28px;
		}
	}

	.case-file-text {
		min-width: 0;
		max-width: 720px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.case-file-kicker {
		margin-bottom: 4px;
	}

	/* Open-case profiles only: the type kicker and its status marker share a
	   row and wrap together on narrow screens. */
	.case-file-kicker--open-case {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px 12px;
	}

	/* "Open case" marker — a case-file status stamp in the kicker's label voice,
	   not a warning: dashed lavender outline, hollow ring for "still open". */
	.case-file-status {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		min-height: 26px;
		padding: 3px 9px 3px 8px;
		font-family: var(--font-talk);
		font-size: var(--font-size-xs);
		font-weight: 600;
		line-height: 1;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		white-space: nowrap;
		text-decoration: none;
		color: var(--highlight);
		background: transparent;
		border: 1px dashed color-mix(in srgb, var(--highlight) 60%, transparent);
		border-radius: 4px;
		transition:
			background-color 0.18s ease,
			border-color 0.18s ease;

		/* Focus ring comes from the global `a:focus-visible` rule. */
		&:hover {
			background: color-mix(in srgb, var(--accent) 18%, transparent);
			border-style: solid;
			border-color: var(--highlight);
		}
	}

	.case-file-status-ring {
		width: 8px;
		height: 8px;
		flex-shrink: 0;
		border: 1.5px solid currentColor;
		border-radius: 50%;
	}

	.case-file-status-arrow {
		color: var(--text-faint);
		font-weight: 500;
		letter-spacing: 0;
	}

	/* The loud line: the name in Anton. The quiet line under it is the
	   Playfair italic hook ("Why he reads as Type 7, not 3."). */
	.case-file-name {
		font-family: var(--font-shout);
		font-weight: 400;
		font-size: clamp(3rem, 6vw, 5.5rem);
		line-height: 0.98;
		letter-spacing: 0.01em;
		text-transform: uppercase;
		color: var(--text);
		margin: 0;
		text-wrap: balance;
		overflow-wrap: anywhere;
	}

	.case-file-subhead {
		font-family: var(--font-voice);
		font-style: italic;
		font-size: 1.375rem;
		line-height: 1.45;
		color: var(--highlight);
		font-weight: 400;
		max-width: 640px;
		margin: 0;

		@media (max-width: 540px) {
			font-size: var(--font-size-lg);
		}
	}

	.case-file-coords {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		color: var(--text-faint);
		font-size: var(--font-size-xs);

		.case-file-coord-sep {
			opacity: 0.65;
		}
	}

	/* Legacy ArticleSubTitle — kept rendered for author/date attribution.
	   Visually demoted to a quiet meta row beneath the case-file head. */
	.legacy-article-meta {
		margin-top: 12px;
		padding-top: 14px;
		border-top: 1px dashed var(--rule);
		display: flex;
		flex-direction: column;
		gap: 6px;

		:global(.article-meta) {
			margin: 0;
			color: var(--text-faint);
			font-size: 13px;
		}

		:global(.article-meta a) {
			color: var(--highlight);
			text-decoration: underline;
			text-decoration-color: color-mix(in srgb, var(--highlight) 45%, transparent);
			text-underline-offset: 0.2em;
		}

		:global(.article-meta a:hover) {
			color: var(--text);
			text-decoration-color: currentColor;
		}

		:global(.article-meta .separator) {
			color: var(--text-faint);
			opacity: 0.5;
		}

		:global(.article-meta .date),
		:global(.article-meta .date.updated) {
			color: var(--text-faint);
		}

		/* On phones the row wraps, stranding a "|" at the end of a line.
		   Spacing alone separates author / published / updated there. */
		@media (max-width: 576px) {
			:global(.article-meta) {
				gap: 0.25rem 0.875rem;
			}

			:global(.article-meta .separator) {
				display: none;
			}
		}
	}

	/* ---------- portrait (right column) ---------- */
	.case-file-portrait {
		position: relative;
		min-width: 0;
		max-width: 100%;

		@media (max-width: 968px) {
			/* The analytical promise leads on small screens; the portrait follows. */
			width: min(100%, 280px);
			max-width: 280px;
			margin: 0 auto;
			justify-self: center;
		}
	}

	.portrait-frame {
		position: relative;
		width: 100%;
		max-width: 100%;
		aspect-ratio: 4 / 5;
		max-height: 480px;
		margin-left: auto;
		overflow: hidden;
		border-radius: 10px;
		background: var(--personality-portrait-well);
		border: 1px solid var(--rule);
	}

	.portrait-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 25%;
		filter: var(--personality-portrait-filter);
		mix-blend-mode: normal;
	}

	@media (max-width: 968px) {
		.portrait-frame {
			width: 100%;
			aspect-ratio: 1 / 1;
			max-height: none;
			margin-inline: auto;
		}

		.portrait-image {
			object-position: center;
		}
	}

	.portrait-stub {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--surface-raised);
		background-image: repeating-linear-gradient(
			45deg,
			transparent 0,
			transparent 14px,
			color-mix(in srgb, var(--accent) 4%, transparent) 14px,
			color-mix(in srgb, var(--accent) 4%, transparent) 15px
		);
	}

	.portrait-vignette {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			linear-gradient(135deg, transparent 40%, color-mix(in srgb, var(--bg) 55%, transparent) 100%),
			linear-gradient(180deg, transparent 65%, color-mix(in srgb, var(--bg) 75%, transparent) 100%);
	}

	.portrait-corner {
		position: absolute;
		width: 14px;
		height: 14px;
		border-color: var(--text-faint);
		border-style: solid;
		border-width: 0;
		z-index: 2;

		&--tl {
			top: 8px;
			left: 8px;
			border-top-width: 1px;
			border-left-width: 1px;
		}
		&--tr {
			top: 8px;
			right: 8px;
			border-top-width: 1px;
			border-right-width: 1px;
		}
		&--bl {
			bottom: 8px;
			left: 8px;
			border-bottom-width: 1px;
			border-left-width: 1px;
		}
		&--br {
			bottom: 8px;
			right: 8px;
			border-bottom-width: 1px;
			border-right-width: 1px;
		}
	}

	.portrait-mono {
		position: absolute;
		left: 14px;
		right: 14px;
		bottom: 14px;
		z-index: 2;
		display: flex;
		align-items: center;
		min-height: 34px;
		padding: 7px 10px;
		background: linear-gradient(
			90deg,
			color-mix(in srgb, var(--bg) 92%, transparent),
			color-mix(in srgb, var(--bg) 82%, transparent)
		);
		border: 1px solid var(--rule);
		border-radius: 4px;
		color: var(--text);

		.mono {
			color: var(--text);
			font-size: 0.6875rem;
			line-height: 1.35;
			overflow-wrap: anywhere;
			text-shadow: 0 1px 2px color-mix(in srgb, var(--bg) 72%, transparent);
		}
	}

	/* ---------- disclosures ----------
	   The TOC, the TL;DR box (445 profiles), and the rabbit hole (166, styled in
	   blog.scss) are all <details>. They share one resting treatment: a quiet
	   stone card, 16px/600 label, and a +/− affordance on the right. Before,
	   the TL;DR shipped as a bare browser ▶ at 15px and the TOC as a box
	   inside a box (the global `details` padding leaked into it). */
	@mixin disclosure-card {
		margin: 0;
		padding: 0;
		border: 1px solid var(--rule);
		border-radius: 0.625rem;
		background: var(--surface);
		box-shadow: none;
		overflow: hidden;
	}

	@mixin disclosure-summary {
		position: relative;
		display: flex;
		align-items: center;
		min-height: 48px;
		margin: 0;
		padding: 0.75rem 3rem 0.75rem 1.25rem;
		list-style: none;
		font-size: 1rem;
		font-weight: 600;
		line-height: 1.4;
		color: var(--text);
		background: transparent;
		cursor: pointer;

		&::-webkit-details-marker {
			display: none;
		}

		&::before {
			content: none;
		}

		&::after {
			content: '+';
			position: absolute;
			right: 1.25rem;
			top: 50%;
			transform: translateY(-50%);
			font-size: 1.4rem;
			font-weight: 400;
			line-height: 1;
			color: var(--highlight);
		}

		&:hover {
			color: var(--text);
			background: color-mix(in srgb, var(--accent) 10%, transparent);
		}
	}

	/* ---------- article prelude ----------
	   The contents disclosure is page navigation, not essay content. Give it a
	   dedicated band, then use an inset hairline to mark where the read begins. */
	.article-navigation {
		padding: 24px $gutter;
		background: var(--bg);

		/* Quiet navigation: the route's effects budget belongs to NineChorus. */
		:global(.toc-accordion) {
			@include disclosure-card;
		}

		:global(.toc-summary) {
			@include disclosure-summary;
			border-bottom: 1px solid transparent;
		}

		:global(.toc-accordion[open] .toc-summary) {
			border-bottom-color: var(--rule);
		}

		:global(.toc-accordion[open] .toc-summary::after) {
			content: '\2212';
		}

		:global(.toc-accordion-content) {
			padding: 0.75rem 1.25rem 1rem;
			background: transparent;
		}
	}

	.article-navigation-inner {
		width: 100%;
		max-width: var(--prose-measure);
		margin: 0 auto;
		min-width: 0;
	}

	.article-divider {
		width: calc(100% - #{2 * $gutter});
		max-width: var(--prose-measure);
		height: 1px;
		margin: 0 auto;
		background: var(--rule);

		@media (max-width: 768px) {
			width: calc(100% - #{2 * $gutter-sm});
		}
	}

	/* =========================================================
	  §02 BREAKDOWN — long-form body
	  ========================================================= */
	.breakdown {
		padding: 48px $gutter 96px;
		background: var(--bg);

		@media (max-width: 768px) {
			padding: 40px $gutter-sm 64px;
		}
	}

	.breakdown-inner {
		width: 100%;
		max-width: var(--prose-measure);
		margin: 0 auto;
		min-width: 0;
		overflow-x: hidden;

		/* Shared blocks each bring their own frame (FAQ 820px + 24px padding,
		   Chorus 44rem centered, bio 48rem, sources 75ch at 16px). Here they all
		   fill the reading column so their edges line up with the prose. */
		:global(.article-sources),
		:global(.faq-section),
		:global(.chorus),
		:global(.author-bio) {
			max-width: none;
			margin-inline: 0;
		}

		:global(.faq-section) {
			padding-inline: 0;
		}

		/* Open-case note: the header marker jumps here; leave breathing room
		   above it instead of landing flush with the viewport edge. */
		:global(.open-case-note) {
			scroll-margin-top: 24px;
		}
	}

	/* The dossier already owns its border, surface, and type label. Give that
	   single component a deliberate editorial pause without wrapping it in a
	   second labelled shell. */
	.breakdown-inner :global(.type-dossier) {
		margin: 3.75rem 0;

		@media (max-width: 768px) {
			margin: 2.5rem 0;
		}
	}

	/* Prose resumes after the injected dossier — the dossier already supplies
	   the separation, so drop the leading h2's extra top margin. */
	.article-body--cont {
		margin-top: 0;

		:global(h2:first-child) {
			margin-top: 0.5rem;
			padding-top: 0;
		}
	}

	.article-body {
		width: 100%;
		min-width: 0;
		margin-bottom: 2rem;
		overflow-x: hidden;
		font-family: var(--font-talk);
		font-size: $reading-size;
		line-height: 1.7;
		color: var(--text-muted);

		/* The section padding establishes the article boundary. Remove content-
		   specific top margins so an opening quote, paragraph, or heading all begin
		   on the same deliberate baseline beneath the divider. */
		> :global(:first-child) {
			margin-top: 0;
		}

		/* Prose rules below carry $prose: they style the essay and the prose
		   inside disclosures, never the internals of a furniture block. */
		:global h2#{$prose} {
			font-family: var(--font-talk);
			font-size: clamp(24px, 3vw, 32px);
			font-weight: 600;
			letter-spacing: -0.015em;
			color: var(--text);
			margin-top: 2.5rem;
			margin-bottom: 1rem;
			padding-top: 1rem;
			line-height: 1.18;
		}

		:global h3#{$prose} {
			font-family: var(--font-talk);
			font-size: clamp(20px, 2.4vw, 24px);
			font-weight: 600;
			letter-spacing: -0.01em;
			color: var(--text);
			margin-top: 1.75rem;
			margin-bottom: 0.75rem;
			line-height: 1.25;
		}

		:global h4#{$prose} {
			font-family: var(--font-talk);
			/* Body size, bold — an h4 must never read smaller than the prose. */
			font-size: 1em;
			font-weight: 600;
			letter-spacing: -0.005em;
			color: var(--text);
			margin-top: 1.5rem;
			margin-bottom: 0.5rem;
			line-height: 1.3;
		}

		:global p#{$prose} {
			/* inherit the reading size — the global `p { font-size: 1rem }`
			   in index.scss would otherwise pin paragraphs to 16px. */
			font-size: inherit;
			margin-bottom: 1.4rem;
			color: var(--text-muted);
		}

		:global ul#{$prose},
		:global ol#{$prose} {
			margin: 1rem 0 1.4rem;
			padding-left: 1.5rem;
			color: var(--text-muted);
		}

		:global li#{$prose} {
			margin-bottom: 0.5rem;
			line-height: 1.6;
		}

		/* Cold Light links are lavender and always underlined. */
		:global a#{$prose} {
			color: var(--highlight);
			text-decoration: underline;
			text-decoration-thickness: 1px;
			text-decoration-color: color-mix(in srgb, var(--highlight) 45%, transparent);
			text-underline-offset: 0.2em;
			transition:
				color 0.18s ease,
				text-decoration-color 0.18s ease;

			&:hover {
				color: var(--text);
				text-decoration-color: currentColor;
			}
		}

		:global blockquote#{$prose} {
			margin: 1.75rem 0;
			padding: 0.75rem 1.25rem 0.75rem 1.5rem;
			border-left: 3px solid var(--accent);
			background: var(--surface);
			color: var(--text);
			/* blog.scss shrinks every blockquote to 14.4px on phones — below the
			   17px body. Quotes are evidence here; they stay at reading size. */
			font-size: inherit;
			font-style: italic;
			border-radius: 0 0.625rem 0.625rem 0;
		}

		:global blockquote#{$prose} p {
			margin-bottom: 0;
			color: var(--text);
		}

		:global strong#{$prose} {
			font-weight: 700;
			color: var(--text);
		}

		:global em#{$prose} {
			color: inherit;
		}

		:global code#{$prose} {
			background: var(--surface);
			color: var(--highlight);
			padding: 0.15rem 0.4rem;
			border-radius: 4px;
			font-size: 0.92em;
			font-family: var(--font-mono);
			border: 1px solid var(--rule);
		}

		:global(pre) {
			background: var(--surface);
			border: 1px solid var(--rule);
			border-radius: 10px;
			padding: 1rem;
			overflow-x: auto;

			:global(code) {
				background: none;
				border: none;
				padding: 0;
			}
		}

		:global(hr) {
			border: 0;
			border-top: 1px solid var(--rule);
			margin: 2.5rem 0;
		}

		:global img#{$prose} {
			max-width: 100%;
			height: auto;
			border-radius: 10px;
		}

		/* TL;DR box: a top-level <details> with a summary.accordion + .panel.
		   The rabbit hole keeps its accent treatment from blog.scss. */
		> :global(details:not(.enneagram-rabbit-hole)) {
			@include disclosure-card;
			margin: 1.75rem 0;
		}

		> :global(details:not(.enneagram-rabbit-hole) > summary) {
			@include disclosure-summary;
		}

		> :global(details:not(.enneagram-rabbit-hole)[open] > summary::after) {
			content: '\2212';
		}

		> :global(details:not(.enneagram-rabbit-hole) > .panel) {
			margin: 0;
			padding: 0.25rem 1.25rem 1.25rem;
			background: transparent;
			border: 0;
			border-radius: 0;
		}

		:global(details > .panel > :last-child) {
			margin-bottom: 0;
		}

		/* Rabbit-hole panel prose runs a step down (16px, set on .panel in
		   blog.scss); its headings follow so they don't tower over the text. */
		:global(.enneagram-rabbit-hole > .panel h3) {
			font-size: 1.125rem;
			letter-spacing: -0.01em;
			margin: 1.75rem 0 0.6rem;
			padding: 0 0 0.4rem;
		}

		:global(.enneagram-rabbit-hole > .panel h3:first-child) {
			margin-top: 0.5rem;
		}
	}

	/* =========================================================
	  §03 DISCUSSION — comments section
	  ========================================================= */
	.discussion {
		/* Demoted beneath the Chorus: tighter padding + a quieter ground than
		   the case-file/breakdown sections so it reads as secondary. The panel
		   extends past the reading column by exactly its own padding, so the
		   comment form starts on the same left edge as the prose. When the
		   viewport is narrower, 8px of inset + 40px padding = the 48px gutter. */
		--discussion-pad: 40px;
		box-sizing: border-box;
		width: min(
			calc(100% - #{2 * ($gutter - 40px)}),
			calc(var(--prose-measure) + 2 * var(--discussion-pad))
		);
		margin-inline: auto;
		padding: 64px var(--discussion-pad);
		background: var(--surface);
		border-top: 1px solid var(--rule);
		overflow-x: hidden;

		@media (max-width: 768px) {
			--discussion-pad: #{$gutter-sm};
			width: 100%;
			padding-block: 48px;
		}
	}

	.discussion-inner {
		width: 100%;
		max-width: var(--prose-measure);
		margin: 0 auto;
		min-width: 0;
	}

	.discussion-kicker {
		text-align: center;
		margin-bottom: 12px;

		:global(.kicker) {
			color: var(--text-faint);
		}
	}

	.discussion-title {
		font-family: var(--font-talk);
		font-size: clamp(22px, 3vw, 28px);
		font-weight: 600;
		letter-spacing: -0.015em;
		color: var(--text);
		text-align: center;
		margin: 0 0 28px;
		line-height: 1.15;
	}

	.discussion-body {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	/* Second feedback ask ("who should we cover next?"), folded into the same
	   section. A divider sets it apart; overrides flow the self-contained
	   SuggestFamousPerson component into the section instead of letting it sit
	   as a second bordered card, and demote its heading to a sub-block. */
	.discussion-suggest {
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px dashed var(--rule);

		:global(.waitlist-section) {
			border: none;
			padding: 0;
			border-radius: 0;
		}

		:global(.waitlist-section h2) {
			font-size: clamp(18px, 2.4vw, 22px);
			font-weight: 600;
			color: var(--text);
			margin-bottom: 1rem;
		}
	}

	.loading-placeholder {
		height: 100px;
		margin: 1rem 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background: var(--surface);
		border: 1px solid var(--rule);
		border-radius: 10px;
	}

	/* =========================================================
	  §04 RELATED CASE FILES
	  ========================================================= */
	.related {
		box-sizing: border-box;
		padding: 72px $gutter;
		background: var(--bg);
		overflow-x: hidden;

		@media (max-width: 768px) {
			padding: 48px $gutter-sm;
		}
	}

	.related-inner {
		width: 100%;
		max-width: var(--prose-measure);
		margin: 0 auto;
		min-width: 0;
	}

	.related-kicker {
		text-align: center;
		margin-bottom: 20px;

		:global(.kicker) {
			color: var(--text-faint);
		}
	}

	.related-framework {
		margin-top: 2rem;
		padding-top: 1.25rem;
		border-top: 1px solid var(--rule);

		ul {
			display: flex;
			flex-wrap: wrap;
			gap: 0.55rem 1rem;
			list-style: none;
			margin: 0;
			padding: 0;
		}

		li {
			margin: 0;
		}

		a {
			color: var(--text-muted);
			font-size: var(--font-size-sm);
			line-height: 1.4;
			text-decoration: underline;
			text-decoration-color: color-mix(in srgb, var(--highlight) 40%, transparent);
			text-underline-offset: 0.2em;

			&:hover {
				color: var(--highlight);
				text-decoration-color: currentColor;
			}
		}
	}

	.related-framework-label {
		margin: 0 0 0.75rem;
		color: var(--text-faint);
	}

	/* =========================================================
	  Mobile-specific tightening
	  ========================================================= */
	@include mobile {
		.case-file {
			padding: 48px $gutter-sm 32px;
		}

		.article-navigation {
			padding: 20px $gutter-sm;
		}

		.case-file-name {
			font-size: clamp(2.75rem, 13vw, 3.5rem);
		}

		.case-file-portrait {
			width: min(100%, 280px);
			max-width: 280px;
		}

		.breakdown {
			padding: 32px $gutter-sm 56px;
		}

		/* Paragraphs inherit this size (no per-<p> size here) so panels that
		   set their own size — the 16px rabbit hole — keep it on phones. */
		.article-body {
			font-size: 17px;
			overflow-wrap: break-word;

			:global h2#{$prose} {
				font-size: 22px;
				margin-top: 1.75rem;
				margin-bottom: 0.75rem;
				padding-top: 0.75rem;
			}

			:global h3#{$prose} {
				font-size: 19px;
				margin-top: 1.4rem;
				margin-bottom: 0.5rem;
			}

			:global h4#{$prose} {
				font-size: 17px;
				margin-top: 1.2rem;
				margin-bottom: 0.4rem;
			}

			:global p#{$prose} {
				margin-bottom: 1.2rem;
			}

			:global(.enneagram-rabbit-hole > .panel h3) {
				font-size: 1.0625rem;
			}

			:global(iframe),
			:global(video) {
				width: 100%;
				max-width: 100%;
			}

			:global(pre) {
				max-width: 100%;
				overflow-x: auto;
				word-wrap: normal;
			}

			:global(code) {
				overflow-wrap: anywhere;
			}
		}

		.discussion {
			padding-block: 56px;
		}

		.related {
			padding-block: 56px;
		}
	}

	@supports (overflow-x: clip) {
		.article-navigation-inner,
		.breakdown-inner,
		.article-body,
		.discussion,
		.related {
			overflow-x: clip;
		}
	}
</style>
