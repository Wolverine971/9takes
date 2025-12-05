<!-- src/routes/personality-analysis/[slug]/+page.svelte -->
<script lang="ts">
	import { onMount, tick, afterUpdate } from 'svelte';
	import { writable } from 'svelte/store';
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	// Only import critical components for initial render
	import PeopleBlogPageHead from '$lib/components/blog/PeopleBlogPageHead.svelte';
	import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	import ArticleSubTitle from '$lib/components/blog/ArticleSubTitle.svelte';
	import PeopleSuggestionsSideBar from '$lib/components/blog/PeopleSuggestionsSideBar.svelte';
	import TableOfContents from '$lib/components/blog/TableOfContents.svelte';
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

	// Table of Contents support
	const contentStore = writable('');
	let contentObserver: MutationObserver | null = null;

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
			setupContentObserver();

			return () => {
				if (commentsObserver) {
					commentsObserver.disconnect();
				}
				if (contentObserver) {
					contentObserver.disconnect();
					contentObserver = null;
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

	// Watch for slug changes and reinitialize content observer
	$: if (data?.post?.slug) {
		// Reset content store when slug changes
		contentStore.set('');

		// Clean up existing observer
		if (contentObserver) {
			contentObserver.disconnect();
			contentObserver = null;
		}

		// Set up new observer after a short delay to ensure DOM is updated
		if (browser) {
			setTimeout(() => {
				setupContentObserver();
			}, 100);
		}
	}

	// Also update content store directly when post content changes
	$: if (post?.content && browser) {
		// Wait for DOM to update with new content
		tick().then(() => {
			// Add a small delay to ensure {@html} has rendered
			setTimeout(() => {
				const node = document.querySelector('.article-body');
				if (node) {
					const currentContent = node.innerHTML;
					if (currentContent && currentContent.trim() !== '') {
						// Trigger content update which will cause TableOfContents to process
						contentStore.set(currentContent);
					}
				}
			}, 100); // Increased delay to ensure DOM is fully rendered
		});
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

	// Set up content observer for Table of Contents
	function setupContentObserver() {
		if (!browser) return;

		// Wait for next tick to ensure DOM is updated
		tick().then(() => {
			const node = document.querySelector('.article-body');

			if (!node) {
				// Retry if node not found
				setTimeout(setupContentObserver, 500);
			} else {
				// Disconnect existing observer if any
				if (contentObserver) {
					contentObserver.disconnect();
				}

				// Set initial content immediately
				const currentContent = node.innerHTML;
				if (currentContent && currentContent.trim() !== '') {
					contentStore.set(currentContent);
				}

				// Set up observer for future changes
				contentObserver = new MutationObserver((mutations) => {
					// Debounce updates to avoid excessive re-renders
					let hasRelevantChanges = false;
					mutations.forEach((mutation) => {
						if (mutation.type === 'childList' || mutation.type === 'characterData') {
							hasRelevantChanges = true;
						}
					});

					if (hasRelevantChanges) {
						const updatedContent = node.innerHTML;
						if (updatedContent && updatedContent.trim() !== '') {
							contentStore.set(updatedContent);
						}
					}
				});

				contentObserver.observe(node, {
					childList: true,
					subtree: true,
					characterData: true
				});
			}
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

		// Load sidebar components (lower priority but still above the fold)
		Promise.all([import('$lib/components/blog/EnneagramCTASidebar.svelte')]).then(
			([enneagramModule]) => {
				EnneagramCTASidebar = enneagramModule.default;
			}
		);

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

	<div class="featured-image">
		<PopCard
			image={`/types/${post.enneagram}s/${post.person}.webp`}
			showIcon={false}
			enneagramType={post.enneagram}
			displayText={post.person.split('-').join(' ')}
			
			subtext=""
		/>
	</div>
	<TableOfContents
		{contentStore}
		pageUrl={`https://9takes.com/personality-analysis/${post.slug}`}
		sidePosition="right"
		renderMode="accordion-only"
	/>

	<div class="article-body">
		{@html post.content}
	</div>
</article>

<TableOfContents
	{contentStore}
	pageUrl={`https://9takes.com/personality-analysis/${post.slug}`}
	sidePosition="right"
	renderMode="sidebar-only"
/>
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
				user={data?.user}
				parentType={'personality-analysis'}
				{userHasAnswered}
			/>
			<BlogInteract
				{data}
				parentType={'personality-analysis'}
				on:commentAdded={({ detail }) => commentAdded(detail)}
				user={data?.user}
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
	{#if !data?.user && SuggestFamousPerson}
		<SuggestFamousPerson />
	{/if}
</div>

<style lang="scss">
	.blog {
		position: relative;
		contain: layout; /* Improves paint performance */
		margin: 0 auto;
	}

	.article-header {
		margin-bottom: 2rem;
	}

	.featured-image {
		display: flex;
		justify-content: center;
		margin: 1rem 0;
	}

	.article-body {
		margin-bottom: 2rem;
	}

	.sidebar-container {
		@include tablet-up {
			position: fixed;
			top: 20%;
			right: 20px;
			max-width: 250px;
			z-index: 100;
		}
	}

	.section-divider {
		margin: 5rem 0;
		border: 0;
		border-top: 1px solid theme('colors.gray.200');
	}

	.join {
		margin-top: 2rem;
	}

	.loading-placeholder {
		@extend .card-base !optional;
		height: 100px;
		margin: 1rem 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: theme('colors.gray.100');
	}

	.loading-spinner {
		width: 30px;
		height: 30px;
		border: 3px solid theme('colors.gray.200');
		border-top: 3px solid theme('colors.primary.600');
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

	/* Mobile-specific styles */
	@include mobile {
		.blog {
			padding: 1rem;
		}

		.article-header {
			margin-bottom: 1rem;
		}

		.featured-image {
			margin: 0.5rem 0;
		}

		.article-body {
			margin-bottom: 1rem;
			overflow-wrap: break-word;
			word-wrap: break-word;

			/* Ensure all images are responsive */
			:global(img) {
				max-width: 100%;
				height: auto;
				display: block;
			}

			/* Make embedded content responsive */
			:global(iframe),
			:global(video) {
				max-width: 100%;
			}

			/* Ensure code blocks don't overflow */
			:global(pre),
			:global(code) {
				overflow-x: auto;
				word-wrap: normal;
			}
		}

		.section-divider {
			margin: 2rem 0;
		}

		.join {
			margin-top: 1rem;
		}
	}

	/* Tablet-specific adjustments */
	@include tablet {
		.article-body {
			:global(img) {
				max-width: 100%;
				height: auto;
			}
		}
	}
</style>
