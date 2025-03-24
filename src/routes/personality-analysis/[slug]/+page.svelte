<script lang="ts">
	import { onMount, tick, afterUpdate } from 'svelte';
	import type { PageData } from './$types';
	import type { SvelteComponent } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	// Only import critical components for initial render
	import PeopleBlogPageHead from '$lib/components/blog/PeopleBlogPageHead.svelte';
	import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	import ArticleSubTitle from '$lib/components/blog/ArticleSubTitle.svelte';
	import PeopleSuggestionsSideBar from '$lib/components/blog/PeopleSuggestionsSideBar.svelte';
	// Lazy-loaded RelatedPosts component
	import RelatedPosts from '$lib/components/molecules/RelatedPosts.svelte';
	// import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';
	import PopCard from '$lib/components/atoms/PopCard.svelte';

	import BlogPurpose from '$lib/components/blog/BlogPurpose.svelte';

	export let data: PageData;

	const componentTypes = [
		{ tag: 'PopCard', component: PopCard },
		{ tag: 'BlogPurpose', component: BlogPurpose }
	];

	let post = data.post;
	let mounted = false;

	let comments = data.comments;
	let userHasAnswered = data.flags.userHasAnswered;
	let commentsLoaded = false;
	let commentsVisible = false;
	let currentPath = '';

	const commentAdded = (detail: any) => {
		comments = [...detail, ...comments];
		userHasAnswered = true;
	};

	// Dynamically import less critical components
	let BlogComments: typeof import('$lib/components/blog/BlogComments.svelte').default;
	let BlogInteract: typeof import('$lib/components/blog/BlogInteract.svelte').default;
	let SuggestFamousPerson: typeof import('$lib/components/molecules/SuggestFamousPerson.svelte').default;
	let EnneagramCTASidebar: typeof import('$lib/components/blog/EnneagramCTASidebar.svelte').default;

	// Set up lazy loading for components
	onMount(async () => {
		mounted = true;
		currentPath = $page.url.pathname;

		if (browser) {
			setupPage();

			return () => {
				if (commentsObserver) {
					commentsObserver.disconnect();
				}
			};
		}
	});

	// Track page changes
	$: if (mounted && $page.url.pathname !== currentPath) {
		// Page has changed
		currentPath = $page.url.pathname;
		resetPageState();
	}

	// Update page data when data prop changes
	$: if (data && mounted) {
		updatePageData();
	}

	// Reset state when navigating to a new page
	function resetPageState() {
		commentsLoaded = false;
		commentsVisible = false;
		updatePageData();

		// Re-setup page after DOM updates
		tick().then(() => {
			setupPage();
		});
	}

	// Update local state from props
	function updatePageData() {
		post = data.post;
		comments = data.comments;
		userHasAnswered = data.flags.userHasAnswered;
	}

	let commentsObserver: IntersectionObserver;

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

		// Load sidebar components (lower priority but still above the fold)
		Promise.all([import('$lib/components/blog/EnneagramCTASidebar.svelte')]).then(
			([enneagramModule]) => {
				EnneagramCTASidebar = enneagramModule.default;
			}
		);

		// Load SuggestFamousPerson component (lowest priority)
		if (!data?.session?.user) {
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

	// Run after each Svelte update to handle potential DOM changes
	afterUpdate(() => {
		if (mounted && data.placeholders) {
			// Re-mount dynamic components after updates
			data.placeholders.forEach((placeholder) => {
				const element = document.getElementById(placeholder.id);
				if (!element) return;

				// Check if element is empty before mounting
				if (element.children.length === 0) {
					const componentType = componentTypes.find((ct) => ct.tag === placeholder.type);
					if (componentType) {
						new componentType.component({
							target: element,
							props: placeholder.props
						});
					}
				}
			});
		}
	});
</script>

<article itemscope itemtype="https://schema.org/BlogPosting" class="blog">
	<div class="article-header">
		<PeopleBlogPageHead data={post} />
		<ArticleTitle title={post.title} />
		<ArticleSubTitle metaData={post} />
	</div>

	<div
		style="display: flex;
    justify-content: center;
    margin: 1rem 0;
	"
	>
		<PopCard
			image={`/types/${post.enneagram}s/${post.person}.webp`}
			showIcon={false}
			enneagramType={post.enneagram}
			displayText={post.person.split('-').join(' ')}
			lazyLoad={false}
			subtext=""
		/>
	</div>

	<div class="article-body">
		{#if mounted}
			<!-- <MarkdownRenderer content={post.content} /> -->
			{@html post.content}
		{:else}
			<p>Loading...</p>
		{/if}
	</div>
</article>

<!-- Sidebar components - positioned absolutely -->
<div class="sidebar-container">
	{#if post.suggestions?.length}
		<PeopleSuggestionsSideBar links={post.suggestions} />
	{/if}

	{#if !data?.user && EnneagramCTASidebar}
		<!-- Uncomment when ready to use
			<EnneagramCTASidebar />
			-->
	{/if}
</div>

<!-- Comments section - lazy loaded -->
<div id="comments-section">
	<h3 title="additional comments">What would you add?</h3>

	{#if commentsVisible && BlogComments && BlogInteract}
		<div>
			<BlogComments
				slug={post.slug}
				{comments}
				session={data.session}
				parentType={'personality-analysis'}
				{userHasAnswered}
			/>
			<BlogInteract
				{data}
				parentType={'personality-analysis'}
				on:commentAdded={({ detail }) => commentAdded(detail)}
				user={data?.session?.user}
			/>
		</div>
	{:else}
		<div class="loading-placeholder">
			<div class="loading-spinner"></div>
		</div>
	{/if}
</div>

<hr class="section-divider" />

<!-- Related posts - lazy loaded after main content -->
<section id="related-content">
	<RelatedPosts
		slug={data.slug}
		postType={post.type?.[0] || ''}
		enneagramType={post.enneagram?.toString() || null}
	/>
</section>

<div class="join">
	{#if !data?.session?.user && SuggestFamousPerson}
		<SuggestFamousPerson />
	{/if}
</div>

<style lang="scss">
	@import '../../../scss/index.scss';

	.blog {
		position: relative;
		contain: layout; /* Improves paint performance */
		margin: 0 auto;
	}

	.article-header {
		margin-bottom: 2rem;
	}

	.section-divider {
		margin: 5rem 0;
		border: 0;
		border-top: 1px solid var(--color-border, rgba(0, 0, 0, 0.1));
	}

	.loading-placeholder {
		height: 100px;
		width: 100%;
		background-color: #f9f9f9;
		border-radius: 8px;
		margin: 1rem 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.loading-spinner {
		width: 30px;
		height: 30px;
		border: 3px solid #eee;
		border-top: 3px solid #666;
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
</style>
