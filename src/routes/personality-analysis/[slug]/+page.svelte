<!-- src/routes/personality-analysis/[slug]/+page.svelte -->
<!--
  /personality-analysis/[slug] — Streetlamp Symposium V5.
  Phase 5 page #2 of docs/design/2026-05-04-rollout-plan.md.

  Restyle, don't rewrite: long-form blog page wrapped in a V5 case-file
  header. All imported blog components (ArticleSubTitle,
  PeopleBlogPageHead, TableOfContents, PeopleSuggestionsSideBar,
  RelatedPosts, FAQSection, AuthorBio, BlogPurpose, QuickAnswer, BookSessionCTA, PopCard)
  are preserved — only the layout chrome and scoped styles migrate.

  Stays in Svelte 4 syntax (`export let`, `$:`) because the contentStore /
  onMount / mount / afterUpdate / $page wiring would ripple if converted to
  runes. Runes migration belongs in a follow-up sub-pass.

  Bridge tokens (--lamp-*, --night-*, --stone-*, --ink-*, --data-*,
  --type-N-color) ship globally in src/scss/index.scss.
-->
<script lang="ts">
	import { onMount, tick, afterUpdate } from 'svelte';
	import { mount, unmount } from 'svelte';
	import { writable } from 'svelte/store';
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import {
		buildPersonalityImagePath,
		formatPersonalityDisplayName
	} from '$lib/utils/personalityAnalysis';
	import { ENNEAGRAM_TYPE_COLORS } from '$lib/constants/enneagramColors';
	import { SectionKicker } from '$lib/components/atoms';
	import EnneagramTypeDossier from '$lib/components/blog/EnneagramTypeDossier.svelte';
	import { enneagramTypeProfiles } from '$lib/data/enneagramTypeProfiles';

	// Only import critical components for initial render
	import PeopleBlogPageHead from '$lib/components/blog/PeopleBlogPageHead.svelte';
	import ArticleSubTitle from '$lib/components/blog/ArticleSubTitle.svelte';
	import PeopleSuggestionsSideBar from '$lib/components/blog/PeopleSuggestionsSideBar.svelte';
	import TableOfContents from '$lib/components/blog/TableOfContents.svelte';
	import FAQSection from '$lib/components/blog/FAQSection.svelte';
	// Lazy-loaded RelatedPosts component
	import RelatedPosts from '$lib/components/molecules/RelatedPosts.svelte';
	// import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';
	import PopCard from '$lib/components/atoms/PopCard.svelte';

	import BlogPurpose from '$lib/components/blog/BlogPurpose.svelte';
	import QuickAnswer from '$lib/components/blog/callouts/QuickAnswer.svelte';
	import BookSessionCTA from '$lib/components/blog/callouts/BookSessionCTA.svelte';
	import AuthorBio from '$lib/components/blog/AuthorBio.svelte';

	export let data: PageData;

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

	const componentTypes = [
		{ tag: 'PopCard', component: PopCard },
		{ tag: 'BlogPurpose', component: BlogPurpose },
		{ tag: 'QuickAnswer', component: QuickAnswer }
	];
	const mountedPlaceholders = new Map<string, ReturnType<typeof mount>>();

	let mounted = false;
	let commentsLoaded = false;
	let commentsVisible = false;
	let currentPath = '';

	// Use direct reactive assignments to ensure updates on navigation
	let post: PageData['post'] = data.post;
	let comments: PageData['comments'] = data.comments;
	let userHasAnswered: PageData['flags']['userHasAnswered'] = data.flags.userHasAnswered;
	let postMeta: App.BlogPost = normalizePost(data.post);
	let postTypes: string[] = toStringArray(postMeta.type);
	let postSuggestions: string[] = postMeta.suggestions || [];
	let postDisplayName: string = formatPersonalityDisplayName(data.post.person || data.post.slug);
	let postImagePath: string = buildPersonalityImagePath(
		data.post.enneagram,
		data.post.person || data.post.slug
	);

	$: post = data.post;
	$: comments = data.comments;
	$: userHasAnswered = data.flags.userHasAnswered;
	$: postMeta = normalizePost(post);
	$: postTypes = toStringArray(postMeta.type);
	$: postSuggestions = postMeta.suggestions || [];
	$: postFaqs = postMeta.faqs || [];
	$: postDisplayName = formatPersonalityDisplayName(postMeta.person || postMeta.slug);
	$: caseFileTitle = postMeta.title || postDisplayName;
	$: postImagePath = buildPersonalityImagePath(
		postMeta.enneagram,
		postMeta.person || postMeta.slug
	);

	// ------------------------------------------------------------------
	// V5 case-file header — derived data lines.
	// blogs_famous_people does NOT carry core_fear / core_desire /
	// stress_line / growth_line columns, so the dossier core line is
	// built from type metadata (name + title) instead. If those columns
	// are added in the future, this is the place to wire them in.
	// ------------------------------------------------------------------
	$: typeNum = toEnneagramNumber(postMeta.enneagram);
	$: typeMeta = typeNum ? ENNEAGRAM_TYPE_COLORS[typeNum] : null;
	// Type dossier panel — the densest dossier component used to ship only on
	// enneagram-corner type pillars while this (the actual dossier surface)
	// was generic prose. Design audit 2026-06-10. CTA bridges to the pillar.
	$: typeDossier = typeNum ? enneagramTypeProfiles[typeNum] : null;
	$: typeName = typeMeta?.name ?? '';
	$: typeNameUpper = typeName ? typeName.toUpperCase() : '';
	$: personaTitle = toStringValue(postMeta.persona_title).trim();
	$: personaUpper = personaTitle ? personaTitle.toUpperCase() : typeNameUpper;
	$: thumbImagePath = buildPersonalityImagePath(
		postMeta.enneagram,
		postMeta.person || postMeta.slug,
		'thumbnail'
	);

	// Deterministic 4-digit dossier number — predictable per-slug so the
	// catalog feels real. Same person → same №.
	function fileNumber(seed: string): string {
		let h = 0;
		for (let i = 0; i < seed.length; i++) {
			h = (h * 31 + seed.charCodeAt(i)) | 0;
		}
		return String(Math.abs(h) % 10000).padStart(4, '0');
	}

	$: dossierNum = fileNumber(postMeta.slug || postMeta.person || '');

	// Format readable last-observed date for the mono coordinate line.
	function formatObservedDate(value: string | null | undefined): string {
		if (!value) return '';
		const literal = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
		if (literal) return `${literal[1]}-${literal[2]}-${literal[3]}`;
		const parsed = new Date(value);
		if (Number.isNaN(parsed.getTime())) return '';
		return parsed.toISOString().slice(0, 10);
	}

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

	$: observedDate = formatObservedDate(postMeta.lastmod || postMeta.date);
	$: wordCountLabel = formatWordCount(postMeta.word_count);
	$: timeRequiredLabel = formatTimeRequired(postMeta.time_required);

	// Table of Contents support
	const contentStore = writable('');
	let contentObserver: MutationObserver | null = null;

	const commentAdded = (detail: any) => {
		comments = [...detail, ...comments];
		userHasAnswered = true;
	};

	// Dynamically import less critical components
	let BlogComments: typeof import('$lib/components/blog/BlogComments.svelte').default | undefined;
	let BlogInteract: typeof import('$lib/components/blog/BlogInteract.svelte').default | undefined;
	let SuggestFamousPerson:
		| typeof import('$lib/components/molecules/SuggestFamousPerson.svelte').default
		| undefined;

	// Set up lazy loading for components
	onMount(() => {
		mounted = true;
		currentPath = $page.url.pathname;

		if (browser) {
			setupPage();
			setupContentObserver();
			mountPlaceholderComponents();

			return () => {
				if (commentsObserver) {
					commentsObserver.disconnect();
				}
				if (contentObserver) {
					contentObserver.disconnect();
					contentObserver = null;
				}
				if (contentUpdateTimeout) {
					clearTimeout(contentUpdateTimeout);
				}
				clearMountedPlaceholderComponents();
			};
		}
	});

	// Track page changes
	$: if (mounted && $page.url.pathname !== currentPath) {
		// Page has changed
		currentPath = $page.url.pathname;
		resetPageState();
	}

	// Track current slug to detect navigation
	let currentSlug = '';

	// Watch for slug changes and reinitialize content observer - optimized
	$: if (data?.post?.slug && data.post.slug !== currentSlug) {
		currentSlug = data.post.slug;

		// Reset content store when slug changes
		contentStore.set('');

		// Clean up existing observer
		if (contentObserver) {
			contentObserver.disconnect();
			contentObserver = null;
		}

		// Set up new observer after DOM updates - use requestIdleCallback for performance
		if (browser) {
			const initObserver = () => {
				tick().then(setupContentObserver);
			};

			if ('requestIdleCallback' in window) {
				(window as any).requestIdleCallback(initObserver, { timeout: 200 });
			} else {
				setTimeout(initObserver, 50);
			}
		}
	}

	// Reset state when navigating to a new page
	function resetPageState() {
		commentsLoaded = false;
		commentsVisible = false;

		// Re-setup page after DOM updates
		tick().then(() => {
			setupPage();
		});
	}

	let commentsObserver: IntersectionObserver;

	// Set up content observer for Table of Contents - optimized with debouncing
	let contentUpdateTimeout: ReturnType<typeof setTimeout> | null = null;

	function setupContentObserver() {
		if (!browser) return;

		const node = document.querySelector('.article-body');

		if (!node) {
			// Retry once if node not found
			setTimeout(setupContentObserver, 200);
			return;
		}

		// Disconnect existing observer if any
		if (contentObserver) {
			contentObserver.disconnect();
		}

		// Set initial content immediately
		const currentContent = node.innerHTML;
		if (currentContent && currentContent.trim() !== '') {
			contentStore.set(currentContent);
		}

		// Set up observer for future changes with debouncing
		contentObserver = new MutationObserver(() => {
			// Debounce updates to avoid excessive re-renders
			if (contentUpdateTimeout) {
				clearTimeout(contentUpdateTimeout);
			}

			contentUpdateTimeout = setTimeout(() => {
				const updatedContent = node.innerHTML;
				if (updatedContent && updatedContent.trim() !== '') {
					contentStore.set(updatedContent);
				}
			}, 150);
		});

		contentObserver.observe(node, {
			childList: true,
			subtree: false, // Reduced scope - only direct children changes
			characterData: false // Don't track text changes
		});
	}

	// Set up the page observers and dynamic components
	function setupPage() {
		// Set up intersection observer for comments section
		commentsObserver = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !commentsLoaded) {
					commentsVisible = true;
					commentsLoaded = true;

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
		if (!data?.user) {
			import('$lib/components/molecules/SuggestFamousPerson.svelte').then((module) => {
				SuggestFamousPerson = module.default;
			});
		}

		// Set up observers after DOM is ready
		tick().then(() => {
			const commentsSection = document.getElementById('comments-section');
			if (commentsSection) {
				commentsObserver.observe(commentsSection);
			}
		});
	}

	function mountPlaceholderComponents() {
		if (!browser) return;

		const placeholders = data.placeholders ?? [];
		const activePlaceholderIds = new Set(placeholders.map((placeholder) => placeholder.id));

		// Remove instances that no longer exist in this page payload/DOM.
		mountedPlaceholders.forEach((instance, id) => {
			if (!activePlaceholderIds.has(id) || !document.getElementById(id)) {
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

			const fallback = element.querySelector('[data-ssr-fallback]');
			const instance = mount(componentType.component, {
				target: element,
				props: placeholder.props
			});
			if (fallback?.parentElement === element) {
				fallback.remove();
			}
			mountedPlaceholders.set(placeholder.id, instance);
		});
	}

	function clearMountedPlaceholderComponents() {
		mountedPlaceholders.forEach((instance) => {
			unmount(instance);
		});
		mountedPlaceholders.clear();
	}

	// Run after each Svelte update to handle potential DOM changes
	afterUpdate(() => {
		if (mounted && data.placeholders) {
			mountPlaceholderComponents();
		}
	});
</script>

<!-- SEO head — pure metadata, must run early. -->
{#key post.slug}
	<PeopleBlogPageHead data={postMeta} />
{/key}

<article
	class="dossier-page"
	style="--type-stripe: {typeNum ? `var(--type-${typeNum}-color)` : 'var(--lamp-glow)'};"
>
	<!-- =====================================================================
	  §01 CASE FILE — V5 dossier header (the brand moment)
	  ===================================================================== -->
	<section class="case-file" aria-labelledby="case-file-name">
		<div class="case-file-stripe" aria-hidden="true"></div>
		<div class="case-file-pool" aria-hidden="true"></div>

		<div class="case-file-inner">
			<div class="case-file-text">
				<div class="case-file-kicker">
					<SectionKicker
						num={dossierNum}
						label={`TYPE ${typeNum ?? '—'} · ${typeNameUpper || 'CASE FILE'}`}
					/>
				</div>

				{#key post.slug}
					<h1 id="case-file-name" class="case-file-name">{caseFileTitle}</h1>
				{/key}

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
					{#key post.slug}
						<ArticleSubTitle metaData={postMeta} structuredData={false} />
					{/key}
				</div>
			</div>

			<aside class="case-file-portrait" aria-hidden="true">
				<div class="portrait-frame">
					{#if postImagePath}
						<img
							src={postImagePath}
							alt=""
							class="portrait-image"
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

	<!-- =====================================================================
	  §02 BREAKDOWN — long-form analysis body.
	  Portrait lives in the case-file header above; this section is prose-first.
	  ===================================================================== -->
	<section class="breakdown">
		<div class="breakdown-inner">
			<TableOfContents
				{contentStore}
				headings={data.headings}
				sidePosition="right"
				renderMode="accordion-only"
			/>

			<div class="article-body">
				{@html post.content}
			</div>

			{#if typeDossier}
				<div class="type-dossier-block">
					<SectionKicker
						tone="data"
						label={`TYPE DOSSIER · ${typeNameUpper || `TYPE ${typeNum}`}`}
					/>
					<EnneagramTypeDossier
						{...typeDossier}
						showCta={true}
						ctaHref={`/enneagram-corner/enneagram-type-${typeNum}`}
						ctaLabel={`Read the full Type ${typeNum} breakdown`}
					/>
				</div>
			{/if}

			{#if postFaqs.length >= 2}
				<FAQSection faqs={postFaqs} title={`${postDisplayName} FAQ`} />
			{/if}

			<BookSessionCTA slug={post.slug} />

			<AuthorBio />
		</div>
	</section>
</article>

<TableOfContents
	{contentStore}
	headings={data.headings}
	sidePosition="right"
	renderMode="sidebar-only"
/>
<!-- Sidebar components - positioned absolutely -->
<div class="sidebar-container">
	{#key post.slug}
		{#if postSuggestions.length || (data.bridgeLinks?.length ?? 0)}
			<PeopleSuggestionsSideBar links={postSuggestions} bridgeLinks={data.bridgeLinks ?? []} />
		{/if}
	{/key}
</div>

<!-- =====================================================================
  §03 DISCUSSION — comments section (lazy loaded)
  ===================================================================== -->
<section id="comments-section" class="discussion">
	<div class="discussion-inner">
		<div class="discussion-kicker">
			<SectionKicker num="03" label="DISCUSSION" />
		</div>
		<h3 class="discussion-title" title="additional comments">What would you add?</h3>

		{#if BlogComments && BlogInteract}
			<div class="discussion-body">
				<BlogComments
					slug={post.slug}
					{comments}
					user={data?.user}
					parentType={'personality-analysis'}
					{userHasAnswered}
				/>
				<BlogInteract
					data={data as any}
					parentType={'personality-analysis'}
					on:commentAdded={({ detail }) => commentAdded(detail)}
					user={data?.user}
				/>
			</div>
		{:else if commentsVisible}
			<div class="loading-placeholder">
				<div class="loading-spinner"></div>
			</div>
		{/if}
	</div>
</section>

<!-- =====================================================================
  §04 RELATED CASE FILES — lazy loaded after main content
  ===================================================================== -->
<section id="related-content" class="related">
	<div class="related-inner">
		<div class="related-kicker">
			<SectionKicker num="04" label="RELATED CASE FILES" />
		</div>
		{#key post.slug}
			<RelatedPosts
				slug={data.slug}
				{postTypes}
				enneagramType={postMeta.enneagram?.toString() || null}
				initialSameNichePosts={data.relatedPosts?.sameNichePosts ?? []}
				initialSameEnneagramPosts={data.relatedPosts?.sameEnneagramPosts ?? []}
			/>
		{/key}
	</div>
</section>

<div class="join">
	{#key post.slug}
		{#if !data?.user && SuggestFamousPerson}
			<SuggestFamousPerson />
		{/if}
	{/key}
</div>

<style lang="scss">
	/* =========================================================
	  /personality-analysis/[slug] — Streetlamp Symposium dossier.
	  Bridge tokens (--lamp-*, --night-*, --stone-*, --ink-*, --data-*,
	  --pool-rgb, --pool-deep-rgb, --type-N-color) ship globally in
	  src/scss/index.scss. Local-only overrides scoped to .dossier-page.
	  ========================================================= */
	.dossier-page {
		--type-stripe: var(--lamp-glow);
		--pool-alpha-strong: 0.22;
		--pool-alpha-mid: 0.14;
		--pool-alpha-soft: 0.06;
		--statue-blend: screen;

		position: relative;
		contain: layout;
		margin: 0 auto;
		max-width: 100%;
		overflow-x: hidden;
		background: var(--night-deep);
		color: var(--ink-bright);
		font-family: var(--font-display);

		:global(:root.light) & {
			--pool-alpha-strong: 0.12;
			--pool-alpha-mid: 0.06;
			--pool-alpha-soft: 0.03;
			--statue-blend: normal;
		}
	}

	@supports (overflow-x: clip) {
		.dossier-page {
			overflow-x: clip;
		}
	}

	/* ---------- shared utilities ---------- */
	.dossier-page :global(.mono),
	.discussion :global(.mono),
	.related :global(.mono) {
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-dim);
	}

	/* =========================================================
	  §01 CASE FILE HEADER — the visible brand moment
	  ========================================================= */
	.case-file {
		position: relative;
		padding: 96px 48px 72px;
		background: var(--night-deep);
		overflow: hidden;
		border-top: 3px solid var(--type-stripe);

		@media (max-width: 768px) {
			padding: 56px 20px 48px;
		}
	}

	.case-file-stripe {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: var(--type-stripe);
		z-index: 2;
	}

	.case-file-pool {
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

	.case-file-name {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 3.5rem;
		line-height: 1.08;
		letter-spacing: 0;
		color: var(--ink-bright);
		margin: 0;
		text-wrap: balance;
		overflow-wrap: anywhere;

		@media (max-width: 1024px) {
			font-size: 2.75rem;
		}

		@media (max-width: 640px) {
			font-size: 2.1rem;
		}
	}

	.case-file-subhead {
		font-family: var(--font-display);
		font-size: 18px;
		line-height: 1.6;
		color: var(--ink-mid);
		font-weight: 400;
		max-width: 640px;
		margin: 0;

		@media (max-width: 540px) {
			font-size: 16px;
		}
	}

	.case-file-coords {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		color: var(--ink-dim);
		font-size: 11.5px;

		.case-file-coord-sep {
			opacity: 0.65;
		}
	}

	/* Legacy ArticleSubTitle — kept rendered for author/date attribution.
	   Visually demoted to a quiet meta row beneath the case-file head. */
	.legacy-article-meta {
		margin-top: 12px;
		padding-top: 14px;
		border-top: 1px dashed var(--stone-edge);
		display: flex;
		flex-direction: column;
		gap: 6px;

		:global(.article-meta) {
			margin: 0;
			color: var(--ink-dim);
			font-size: 13px;
		}

		:global(.article-meta a) {
			color: var(--lamp-glow);
		}

		:global(.article-meta a:hover) {
			color: var(--lamp-light);
			text-decoration: underline;
		}

		:global(.article-meta .separator) {
			color: var(--ink-dim);
			opacity: 0.5;
		}

		:global(.article-meta .date) {
			color: var(--ink-dim);
		}

		:global(.article-meta .date.updated) {
			color: var(--data-teal);
		}
	}

	/* ---------- portrait (right column) ---------- */
	.case-file-portrait {
		position: relative;
		min-width: 0;
		max-width: 100%;

		@media (max-width: 968px) {
			width: min(100%, 360px);
			max-width: 360px;
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
		background: var(--night-mid);
		border: 1px solid var(--stone-edge);
	}

	.portrait-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 25%;
		filter: contrast(1.15) brightness(0.96) saturate(0.85);
		mix-blend-mode: var(--statue-blend);
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

	:global(:root.light) .dossier-page .portrait-image {
		filter: contrast(1.05) brightness(1) saturate(0.95);
	}

	.portrait-stub {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--stone-mid);
		background-image: repeating-linear-gradient(
			45deg,
			transparent 0,
			transparent 14px,
			rgba(var(--pool-rgb), 0.04) 14px,
			rgba(var(--pool-rgb), 0.04) 15px
		);
	}

	.portrait-vignette {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(ellipse at 25% 25%, rgba(var(--pool-rgb), 0.18) 0%, transparent 55%),
			linear-gradient(135deg, transparent 40%, rgba(10, 8, 7, 0.55) 100%),
			linear-gradient(180deg, transparent 65%, rgba(10, 8, 7, 0.75) 100%);
	}

	:global(:root.light) .dossier-page .portrait-vignette {
		background:
			radial-gradient(ellipse at 25% 25%, rgba(var(--pool-rgb), 0.06) 0%, transparent 60%),
			linear-gradient(135deg, transparent 60%, rgba(180, 83, 9, 0.05) 100%),
			linear-gradient(180deg, transparent 58%, rgba(10, 8, 7, 0.68) 100%);
	}

	.portrait-corner {
		position: absolute;
		width: 14px;
		height: 14px;
		border-color: var(--lamp-glow);
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
		background: linear-gradient(90deg, rgba(10, 8, 7, 0.86), rgba(10, 8, 7, 0.68));
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 46%, rgba(250, 248, 244, 0.18));
		box-shadow: 0 10px 24px rgba(10, 8, 7, 0.34);
		color: #faf8f4;
		backdrop-filter: blur(5px);

		.mono {
			color: #faf8f4;
			font-size: 10.5px;
			line-height: 1.35;
			overflow-wrap: anywhere;
			text-shadow: 0 1px 2px rgba(10, 8, 7, 0.72);
		}
	}

	:global(:root.light) .dossier-page .portrait-mono {
		background: linear-gradient(90deg, rgba(10, 8, 7, 0.9), rgba(10, 8, 7, 0.72));
		border-color: color-mix(in srgb, var(--lamp-glow) 58%, rgba(250, 248, 244, 0.2));
	}

	/* =========================================================
	  §02 BREAKDOWN — long-form body
	  ========================================================= */
	.breakdown {
		padding: 64px 48px 96px;
		background: var(--night-deep);
		border-top: 1px solid var(--stone-edge);

		@media (max-width: 768px) {
			padding: 48px 20px 64px;
		}
	}

	.breakdown-inner {
		width: 100%;
		max-width: 880px;
		margin: 0 auto;
		min-width: 0;
		overflow-x: hidden;
	}

	.type-dossier-block {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 3rem 0 1.5rem;
	}

	.article-body {
		width: 100%;
		/* Reading measure (2026-06-09 design audit): 18px was right but the
		   880px container ran ~90ch lines. Prose caps at 68ch, centered;
		   the dossier header/stat furniture keeps the full 880px frame. */
		max-width: var(--prose-measure);
		margin-inline: auto;
		min-width: 0;
		margin-bottom: 2rem;
		overflow-x: hidden;
		font-family: var(--font-display);
		font-size: 18px;
		line-height: 1.7;
		color: var(--ink-bright);

		/* Header styles for injected content */
		:global(h2) {
			font-family: var(--font-display);
			font-size: clamp(24px, 3vw, 32px);
			font-weight: 700;
			letter-spacing: -0.02em;
			color: var(--ink-bright);
			margin-top: 2.5rem;
			margin-bottom: 1rem;
			padding-top: 1rem;
			line-height: 1.18;
		}

		:global(h3) {
			font-family: var(--font-display);
			font-size: clamp(20px, 2.4vw, 24px);
			font-weight: 700;
			letter-spacing: -0.015em;
			color: var(--ink-bright);
			margin-top: 1.75rem;
			margin-bottom: 0.75rem;
			line-height: 1.25;
		}

		:global(h4) {
			font-family: var(--font-display);
			font-size: 18px;
			font-weight: 700;
			letter-spacing: -0.01em;
			color: var(--ink-bright);
			margin-top: 1.5rem;
			margin-bottom: 0.5rem;
			line-height: 1.3;
		}

		:global(p) {
			/* inherit the 18px reading size — the global `p { font-size: 1rem }`
			   in index.scss would otherwise pin paragraphs to 16px. */
			font-size: inherit;
			margin-bottom: 1.4rem;
			color: var(--ink-bright);
		}

		:global(ul),
		:global(ol) {
			margin: 1rem 0 1.4rem;
			padding-left: 1.5rem;
			color: var(--ink-bright);
		}

		:global(li) {
			margin-bottom: 0.5rem;
			line-height: 1.6;
		}

		:global(a) {
			color: var(--lamp-glow);
			text-decoration: none;
			transition: color 0.18s ease;
			border-bottom: 1px solid transparent;

			&:hover {
				color: var(--lamp-light);
				border-bottom-color: currentColor;
			}
		}

		:global(blockquote) {
			margin: 1.75rem 0;
			padding: 0.75rem 1.25rem 0.75rem 1.5rem;
			border-left: 3px solid var(--lamp-glow);
			background: var(--stone-warm);
			color: var(--ink-bright);
			font-style: italic;
			border-radius: 0 8px 8px 0;
		}

		:global(blockquote p) {
			margin-bottom: 0;
			color: var(--ink-bright);
		}

		:global(strong) {
			font-weight: 700;
			color: var(--ink-bright);
		}

		:global(em) {
			color: var(--ink-bright);
		}

		:global(code) {
			background: var(--stone-warm);
			color: var(--data-teal);
			padding: 0.15rem 0.4rem;
			border-radius: 4px;
			font-size: 0.92em;
			font-family: var(--font-mono);
			border: 1px solid var(--stone-edge);
		}

		:global(pre) {
			background: var(--night-mid);
			border: 1px solid var(--stone-edge);
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
			border-top: 1px solid var(--stone-edge);
			margin: 2.5rem 0;
		}

		:global(img) {
			max-width: 100%;
			height: auto;
			border-radius: 10px;
		}
	}

	/* Sidebar container - PeopleSuggestionsSideBar handles its own fixed positioning */
	.sidebar-container {
		display: contents; /* Pass through to let component handle positioning */
	}

	.join {
		max-width: 880px;
		margin: 2rem auto 0;
		padding: 0 48px 64px;

		@media (max-width: 768px) {
			padding: 0 20px 48px;
		}
	}

	/* =========================================================
	  §03 DISCUSSION — comments section
	  ========================================================= */
	.discussion {
		padding: 96px 48px;
		background: var(--night-mid);
		border-top: 1px solid var(--stone-edge);

		@media (max-width: 768px) {
			padding: 64px 20px;
		}
	}

	.discussion-inner {
		max-width: 880px;
		margin: 0 auto;
	}

	.discussion-kicker {
		text-align: center;
		margin-bottom: 16px;

		:global(.kicker) {
			color: var(--lamp-glow);
		}
	}

	.discussion-title {
		font-family: var(--font-display);
		font-size: clamp(28px, 4vw, 40px);
		font-weight: 700;
		letter-spacing: -0.02em;
		color: var(--ink-bright);
		text-align: center;
		margin: 0 0 32px;
		line-height: 1.1;
	}

	.discussion-body {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.loading-placeholder {
		height: 100px;
		margin: 1rem 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
	}

	.loading-spinner {
		width: 30px;
		height: 30px;
		border: 3px solid var(--stone-mid);
		border-top: 3px solid var(--lamp-glow);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.loading-spinner {
			animation: none;
		}
	}

	/* =========================================================
	  §04 RELATED CASE FILES
	  ========================================================= */
	.related {
		padding: 96px 48px;
		background: var(--night-deep);
		border-top: 1px solid var(--stone-edge);

		@media (max-width: 768px) {
			padding: 64px 20px;
		}
	}

	.related-inner {
		max-width: 1280px;
		margin: 0 auto;
	}

	.related-kicker {
		text-align: center;
		margin-bottom: 32px;

		:global(.kicker) {
			color: var(--lamp-glow);
		}
	}

	/* =========================================================
	  Mobile-specific tightening
	  ========================================================= */
	@include mobile {
		.case-file {
			padding: 48px 16px 40px;
		}

		.case-file-name {
			font-size: clamp(32px, 9vw, 44px);
		}

		.case-file-portrait {
			width: min(100%, 320px);
			max-width: 320px;
		}

		.breakdown {
			padding: 40px 16px 56px;
		}

		.article-body {
			font-size: 17px;
			max-width: 100%;
			min-width: 0;
			overflow-x: hidden;
			overflow-wrap: break-word;
			word-wrap: break-word;

			:global(h2) {
				font-size: 22px;
				margin-top: 1.75rem;
				margin-bottom: 0.75rem;
				padding-top: 0.75rem;
			}

			:global(h3) {
				font-size: 19px;
				margin-top: 1.4rem;
				margin-bottom: 0.5rem;
			}

			:global(h4) {
				font-size: 17px;
				margin-top: 1.2rem;
				margin-bottom: 0.4rem;
			}

			:global(p) {
				font-size: 17px;
				margin-bottom: 1.2rem;
			}

			:global(img) {
				max-width: 100%;
				height: auto;
				display: block;
			}

			:global(iframe),
			:global(video) {
				width: 100%;
				max-width: 100%;
			}

			:global(pre),
			:global(table) {
				max-width: 100%;
				overflow-x: auto;
				-webkit-overflow-scrolling: touch;
			}

			:global(pre) {
				overflow-x: auto;
				word-wrap: normal;
			}

			:global(code) {
				overflow-wrap: anywhere;
			}
		}

		.discussion,
		.related {
			padding: 56px 16px;
		}

		.join {
			margin-top: 1rem;
			padding: 0 16px 40px;
		}
	}

	/* Tablet */
	@include tablet {
		.article-body {
			:global(img) {
				max-width: 100%;
				height: auto;
			}
		}
	}

	@supports (overflow-x: clip) {
		.breakdown-inner,
		.article-body {
			overflow-x: clip;
		}
	}
</style>
