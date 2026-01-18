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
	import QuickAnswer from '$lib/components/blog/callouts/QuickAnswer.svelte';

	export let data: PageData;

	const componentTypes = [
		{ tag: 'PopCard', component: PopCard },
		{ tag: 'BlogPurpose', component: BlogPurpose },
		{ tag: 'QuickAnswer', component: QuickAnswer }
	];

	let mounted = false;
	let commentsLoaded = false;
	let commentsVisible = false;
	let currentPath = '';

	// Use direct reactive assignments to ensure updates on navigation
	$: post = data.post;
	$: comments = data.comments;
	$: userHasAnswered = data.flags.userHasAnswered;

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
				if (contentUpdateTimeout) {
					clearTimeout(contentUpdateTimeout);
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
		<meta itemprop="description" content={post.description} />
	</div>

	<div class="featured-image" itemprop="image" itemscope itemtype="https://schema.org/ImageObject">
		<meta
			itemprop="url"
			content={`https://9takes.com/types/${post.enneagram}s/${post.person}.webp`}
		/>
		<meta itemprop="width" content="900" />
		<meta itemprop="height" content="900" />
		<PopCard
			image={`/types/${post.enneagram}s/${post.person}.webp`}
			showIcon={false}
			enneagramType={post.enneagram}
			displayText={post.person.split('-').join(' ')}
			priority={true}
			scramble={false}
			aspectRatio="1/1"
			subtext={post.persona_title || ''}
		/>
	</div>
	<TableOfContents {contentStore} sidePosition="right" renderMode="accordion-only" />

	<div class="article-body" itemprop="articleBody">
		{@html post.content}
	</div>
</article>

<TableOfContents {contentStore} sidePosition="right" renderMode="sidebar-only" />
<!-- Sidebar components - positioned absolutely -->
<div class="sidebar-container">
	{#key post.slug}
		{#if post.suggestions?.length}
			<PeopleSuggestionsSideBar links={post.suggestions} />
		{/if}

		{#if !data?.user && EnneagramCTASidebar}
			<!-- Uncomment when ready to use
				<EnneagramCTASidebar />
				-->
		{/if}
	{/key}
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
	{#key post.slug}
		<RelatedPosts
			slug={data.slug}
			postType={post.type?.[0] || ''}
			enneagramType={post.enneagram?.toString() || null}
		/>
	{/key}
</section>

<div class="join">
	{#key post.slug}
		{#if !data?.user && SuggestFamousPerson}
			<SuggestFamousPerson />
		{/if}
	{/key}
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
		align-items: center;
		margin: 1rem auto;
		width: 100%;

		:global(.image-card-base) {
			margin: 0 auto;
		}
	}

	.article-body {
		margin-bottom: 2rem;
		line-height: 1.7;
		color: #cbd5e1;

		/* Header styles for injected content */
		:global(h2) {
			font-size: 1.75rem;
			font-weight: 600;
			color: #f1f5f9;
			margin-top: 2rem;
			margin-bottom: 1rem;
			padding-top: 1rem;
			line-height: 1.3;
		}

		:global(h3) {
			font-size: 1.35rem;
			font-weight: 600;
			color: #f1f5f9;
			margin-top: 1.5rem;
			margin-bottom: 0.75rem;
			line-height: 1.35;
		}

		:global(h4) {
			font-size: 1.15rem;
			font-weight: 600;
			color: #f1f5f9;
			margin-top: 1.25rem;
			margin-bottom: 0.5rem;
			line-height: 1.4;
		}

		:global(p) {
			margin-bottom: 1.2rem;
			color: #cbd5e1;
		}

		:global(ul),
		:global(ol) {
			margin: 1rem 0;
			padding-left: 1.5rem;
			color: #cbd5e1;
		}

		:global(li) {
			margin-bottom: 0.5rem;
			line-height: 1.6;
		}

		:global(a) {
			color: #a78bfa;
			text-decoration: none;
			transition: color 0.2s ease;

			&:hover {
				color: #c4b5fd;
				text-decoration: underline;
			}
		}

		:global(blockquote) {
			margin: 1.5rem 0;
			padding: 1rem 1.5rem;
			border-left: 4px solid #7c3aed;
			background-color: #1a1a2e;
			font-style: italic;
			color: #94a3b8;
			border-radius: 0 8px 8px 0;
		}

		:global(blockquote p) {
			margin-bottom: 0;
			color: #94a3b8;
		}

		:global(strong) {
			font-weight: 600;
			color: #f1f5f9;
		}

		:global(code) {
			background-color: #252538;
			color: #a78bfa;
			padding: 0.2rem 0.4rem;
			border-radius: 4px;
			font-size: 0.9em;
		}

		:global(pre) {
			background-color: #0a0a0f;
			border: 1px solid rgba(100, 116, 139, 0.3);
			border-radius: 8px;
			padding: 1rem;
			overflow-x: auto;

			:global(code) {
				background: none;
				padding: 0;
			}
		}
	}

	/* Sidebar container - PeopleSuggestionsSideBar handles its own fixed positioning */
	.sidebar-container {
		display: contents; /* Pass through to let component handle positioning */
	}

	.section-divider {
		margin: 5rem 0;
		border: 0;
		border-top: 1px solid rgba(100, 116, 139, 0.3);
	}

	.join {
		margin-top: 2rem;
	}

	#comments-section {
		h3 {
			color: #f1f5f9;
			font-size: 1.5rem;
			font-weight: 600;
			margin-bottom: 1.5rem;
		}
	}

	.loading-placeholder {
		@extend .card-base !optional;
		height: 100px;
		margin: 1rem 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #1a1a2e;
		border: 1px solid rgba(100, 116, 139, 0.2);
		border-radius: 8px;
	}

	.loading-spinner {
		width: 30px;
		height: 30px;
		border: 3px solid #252538;
		border-top: 3px solid #7c3aed;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		box-shadow: 0 0 15px rgba(124, 58, 237, 0.3);
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

			/* Mobile header sizes */
			:global(h2) {
				font-size: 1.4rem;
				margin-top: 1.5rem;
				margin-bottom: 0.75rem;
				padding-top: 0.75rem;
			}

			:global(h3) {
				font-size: 1.15rem;
				margin-top: 1.25rem;
				margin-bottom: 0.5rem;
			}

			:global(h4) {
				font-size: 1.05rem;
				margin-top: 1rem;
				margin-bottom: 0.4rem;
			}

			:global(p) {
				font-size: 0.95rem;
				margin-bottom: 1rem;
			}

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
