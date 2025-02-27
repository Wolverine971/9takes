<script lang="ts">
	import { onMount, tick } from 'svelte';
	import type { PageData } from './$types';
	import type { SvelteComponent } from 'svelte';
	import { browser } from '$app/environment';

	// Only import critical components for initial render
	import PeopleBlogPageHead from '$lib/components/blog/PeopleBlogPageHead.svelte';
	import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	import ArticleSubTitle from '$lib/components/blog/ArticleSubTitle.svelte';
	import PeopleSuggestionsSideBar from '$lib/components/blog/PeopleSuggestionsSideBar.svelte';
	// Lazy-loaded RelatedPosts component
	import RelatedPosts from '$lib/components/molecules/RelatedPosts.svelte';

	export let data: PageData;

	type C = $$Generic<typeof SvelteComponent<any, any, any>>;
	$: component = data.component as unknown as C;

	let comments = data.comments;
	let userHasAnswered = data.flags.userHasAnswered;
	let commentsLoaded = false;
	let commentsVisible = false;

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
		if (browser) {
			// Set up intersection observer for comments section
			const commentsObserver = new IntersectionObserver(
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

			return () => {
				commentsObserver.disconnect();
			};
		}
	});
</script>

<article itemscope itemtype="https://schema.org/BlogPosting" class="blog">
	<div class="article-header">
		<PeopleBlogPageHead data={data.metadata} />
		<ArticleTitle title={data.metadata.title} />
		<ArticleSubTitle metaData={data.metadata} />
	</div>

	<div class="article-body">
		<svelte:component this={component} />
	</div>
</article>

<!-- Sidebar components - positioned absolutely -->
<div class="sidebar-container">
	{#if data.metadata.suggestions?.length}
		<PeopleSuggestionsSideBar links={data.metadata.suggestions} />
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
				slug={data.slug}
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
		postType={data.metadata.type?.[0] || ''}
		enneagramType={data.metadata.enneagram?.toString() || null}
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
