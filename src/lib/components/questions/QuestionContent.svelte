<!-- src/lib/components/questions/QuestionContent.svelte -->
<script lang="ts">
	import { fade } from 'svelte/transition';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import PostIcon from '$lib/components/icons/postIcon.svelte';
	import Comments from '$lib/components/molecules/Comments.svelte';
	import SortComments from '$lib/components/molecules/SortComments.svelte';
	import AIComments from '$lib/components/molecules/AIComments.svelte';
	import ArticleLinks from '$lib/components/molecules/Links.svelte';
	import type { User, Comment as CommentType, QuestionPageData } from '$lib/types/questions';
	import { viewportWidth } from '$lib/stores/viewport';

	interface Props {
		data: QuestionPageData;
		user: User | null;
		oncommentAdded?: () => void;
	}

	let { data, user, oncommentAdded }: Props = $props();

	// Local state
	let selectedTab = $state('Comments');
	let showAiComments = $state(true);

	// Use shared viewport store
	let innerWidth = $derived($viewportWidth);

	// Create a deep copy of data to avoid mutation issues
	let _data = $derived(JSON.parse(JSON.stringify(data)) as QuestionPageData);

	// Define tabs and their associated icons.
	// 2026-06-10 (design audit): the permanently-empty "Visuals" tab is cut and
	// "Removed Comments" is demoted from equal-billing tab to a quiet disclosure
	// at the bottom of the thread — the main conversation is the product.
	const tabs = ['Comments', 'Articles'];
	const iconComponents: Record<string, typeof MasterCommentIcon> = {
		Comments: MasterCommentIcon,
		Articles: PostIcon
	};

	// Local sorted comments state (for when user sorts)
	let sortedComments = $state<CommentType[] | null>(null);

	// Sort comments handler
	function sortCommentsHandler(newSortedComments: CommentType[]) {
		sortedComments = JSON.parse(JSON.stringify(newSortedComments)) as CommentType[];
		showAiComments = false;
	}

	// Get the comments to display (sorted if user sorted, otherwise from data)
	let displayComments = $derived(sortedComments || _data.comments);
	let displayCommentCount = $derived(sortedComments?.length ?? _data.comment_count);
	let publicAiPreviewComments = $derived.by(() => (_data.aiComments ?? []).slice(0, 3));

	// Smooth scroll to section when tab is clicked
	function scrollToSection(sectionId: string) {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'start'
			});
		}
	}

	// Handle new comment added
	function handleCommentAdded() {
		if (!data?.flags?.userHasAnswered) {
			oncommentAdded?.();
		}
	}

	// Get tabulated content count
	function getContentCount(tab: string): { count: number; label: string } {
		switch (tab) {
			case 'Comments':
				return {
					count: displayCommentCount || 0,
					label: displayCommentCount === 1 ? 'Comment' : 'Comments'
				};
			case 'Articles':
				return {
					count: _data.links_count || 0,
					label: _data.links_count === 1 ? 'Article' : 'Articles'
				};
			default:
				return { count: 0, label: '' };
		}
	}
</script>

<div class="question-content-shell">
	<!-- Tabs Navigation -->
	<nav class="question-content-nav scrollbar-hide">
		{#each tabs as tab}
			{@const IconComponent = iconComponents[tab]}
			<button
				role="tab"
				aria-selected={selectedTab === tab}
				aria-controls={tab}
				class="question-tab"
				class:is-active={selectedTab === tab}
				onclick={() => {
					selectedTab = tab;
					scrollToSection(tab);
				}}
			>
				{#if innerWidth > 575}
					<span class="flex items-center justify-center gap-2">
						<span class="font-semibold">{getContentCount(tab).count}</span>
						<span>{getContentCount(tab).label}</span>
					</span>
				{:else}
					<!-- Show icons on mobile -->
					<div class="flex flex-col items-center gap-1">
						<IconComponent
							iconStyle={''}
							height={'1.25rem'}
							fill={'currentColor'}
							type={tab === 'Comments' ? 'multiple' : undefined}
						/>
						<span class="text-[10px]">{getContentCount(tab).count}</span>
					</div>
				{/if}
			</button>
		{/each}
	</nav>

	<!-- Tab Content -->
	<div class="question-content-body">
		{#each tabs as section}
			{#if selectedTab === section}
				<section
					in:fade={{ duration: 200 }}
					id={section}
					class:selected={selectedTab === section}
					class="question-content-section"
					aria-labelledby={`${section}-tab`}
				>
					<div class="question-content-section-inner">
						{#if section === 'Comments'}
							{#if !data?.flags?.userHasAnswered}
								<div class="locked-comments-shell">
									{#if publicAiPreviewComments.length}
										<section class="public-perspective-preview" aria-label="Sample perspectives">
											<div class="public-perspective-preview__head">
												<h3 class="public-perspective-preview__title">Sample perspectives</h3>
												<p class="public-perspective-preview__copy">
													Public visitors can preview a few Enneagram-style takes before joining the
													discussion. Community comments stay locked until you share your own
													perspective.
												</p>
											</div>

											<div class="public-perspective-preview__grid">
												{#each publicAiPreviewComments as comment}
													<article
														class="public-perspective-card"
														style="--comment-type-color: var(--type-{comment.enneagram_type}-color, var(--lamp-glow))"
													>
														<div class="public-perspective-card__eyebrow">
															Type {comment.enneagram_type}
														</div>
														<p class="public-perspective-card__body">{comment.comment}</p>
													</article>
												{/each}
											</div>
										</section>
									{/if}

									<div class="question-state question-state-locked">
										<div class="state-icon state-icon-locked">
											<svg
												class="h-8 w-8 text-[var(--lamp-glow)]"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
												/>
											</svg>
										</div>
										<p class="state-title" in:fade={{ duration: 200 }}>
											{displayCommentCount === 0
												? 'Be the first to share your perspective'
												: 'Share your perspective to unlock comments'}
										</p>
										<p class="state-copy">
											{displayCommentCount > 0
												? `${displayCommentCount} perspectives waiting to be revealed`
												: 'Your unique viewpoint matters'}
										</p>
									</div>
								</div>
							{:else}
								<!-- AI-Generated Comments -->
								<AIComments data={_data} parentType={'question'} {showAiComments} />
								<div class="content-toolbar">
									<SortComments
										data={_data}
										oncommentsSorted={sortCommentsHandler}
										size={'medium'}
									/>
								</div>

								<!-- User Comments -->
								<Comments
									questionId={_data.question.id}
									comments={displayComments}
									comment_count={displayCommentCount}
									parentType={'question'}
									parentData={_data}
									{user}
									key={displayCommentCount}
									on:commentAdded={handleCommentAdded}
								/>

								<!-- Removed comments: quiet disclosure, not a top-level tab -->
								{#if _data?.removed_comment_count > 0}
									<details class="removed-comments-disclosure">
										<summary>
											{_data.removed_comment_count} removed
											{_data.removed_comment_count === 1 ? 'comment' : 'comments'}
										</summary>
										{#if _data?.removedComments?.length > 0}
											<Comments
												questionId={_data.question.id}
												parentData={_data}
												comment_count={_data.removed_comment_count}
												comments={_data.removedComments}
												parentType={'question'}
												{user}
											/>
										{/if}
									</details>
								{/if}
							{/if}
						{:else if section === 'Articles'}
							<ArticleLinks
								questionId={data.question.id}
								data={_data}
								parentType={'question'}
								oncommentAdded={handleCommentAdded}
							/>
						{/if}
					</div>
				</section>
			{/if}
		{/each}
	</div>
</div>

<style>
	/* V5 Streetlamp pass 2026-06-09: flattened the legacy glass-morphism shell
	   (1.35rem radius, backdrop blur, gradient washes, static shadow) to the
	   locked system — 1px stone-edge border does the elevation work. */
	.question-content-shell {
		position: relative;
		overflow: hidden;
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		background: var(--stone-warm);
	}

	.question-content-nav {
		position: relative;
		z-index: 1;
		display: flex;
		overflow-x: auto;
		padding: 0.45rem;
		border-bottom: 1px solid var(--stone-edge);
		background: var(--night-mid);
	}

	.question-tab {
		position: relative;
		flex: 1 1 0;
		min-width: fit-content;
		padding: 0.9rem 1.15rem;
		border: 0;
		border-radius: 0.625rem;
		background: transparent;
		color: var(--ink-mid);
		font-size: 0.9rem;
		font-weight: 600;
		white-space: nowrap;
		transition:
			color 0.2s ease,
			background-color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.question-tab:hover {
		color: var(--ink-bright);
		background: var(--lamp-soft);
	}

	.question-tab.is-active {
		color: var(--ink-bright);
		background: var(--lamp-soft);
		box-shadow: inset 0 -2px 0 var(--lamp-glow);
	}

	.question-content-body {
		position: relative;
		z-index: 1;
		min-height: 22rem;
	}

	.question-content-section {
		display: block;
	}

	.question-content-section-inner {
		padding: 1.4rem 0 1.6rem;
	}

	.content-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
		padding: 0 1rem;
	}

	.removed-comments-disclosure {
		margin: 1.25rem 1rem 0;
		border: none;
		border-top: 1px solid var(--stone-edge);
		border-radius: 0;
		background: transparent;
		padding: 0.75rem 0 0;

		summary {
			cursor: pointer;
			font-size: 0.85rem;
			color: var(--ink-dim);
			padding: 0.25rem 0;

			&:hover {
				color: var(--ink-mid);
			}
		}
	}

	.locked-comments-shell {
		display: grid;
		gap: 1rem;
		padding: 0 1rem;
	}

	.public-perspective-preview {
		padding: 1rem;
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		background: var(--night-mid);
	}

	.public-perspective-preview__head {
		margin-bottom: 0.9rem;
	}

	.public-perspective-preview__title {
		margin: 0 0 0.25rem;
		font-size: 1rem;
		font-weight: 700;
		color: var(--ink-bright);
	}

	.public-perspective-preview__copy {
		margin: 0;
		font-size: 0.92rem;
		line-height: 1.6;
		color: var(--ink-mid);
	}

	.public-perspective-preview__grid {
		display: grid;
		gap: 0.75rem;
	}

	.public-perspective-card {
		padding: 0.95rem 1rem;
		border: 1px solid var(--stone-edge);
		/* Type-colored stripe — same attribution language as Comment.svelte. */
		border-left: 3px solid var(--comment-type-color, var(--stone-edge));
		border-radius: 0.625rem;
		background: var(--stone-warm);
	}

	.public-perspective-card__eyebrow {
		margin-bottom: 0.45rem;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--comment-type-color, var(--lamp-glow)) 65%, white);
	}

	:global(:root.light) .public-perspective-card__eyebrow {
		color: color-mix(in srgb, var(--comment-type-color, var(--lamp-glow)) 72%, black);
	}

	.public-perspective-card__body {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.65;
		color: var(--ink-bright);
		/* Pasted URLs/long strings must wrap, not force page scroll (mobile audit) */
		overflow-wrap: anywhere;
	}

	.question-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		max-width: 34rem;
		margin: 0 auto;
		padding: 2.8rem 1.25rem;
		border-radius: 1rem;
		text-align: center;
	}

	.question-state-locked {
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 22%, var(--stone-edge));
		background: var(--lamp-soft);
	}

	.state-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.625rem;
	}

	.state-icon-locked {
		width: 4rem;
		height: 4rem;
		margin-bottom: 0.55rem;
		background: var(--lamp-soft);
	}

	.state-title {
		margin: 0;
		font-size: 1.12rem;
		font-weight: 600;
		line-height: 1.35;
		color: var(--ink-bright);
	}

	.state-copy {
		margin: 0.15rem 0 0;
		font-size: 0.92rem;
		line-height: 1.6;
		color: var(--ink-mid);
	}

	/* Hide scrollbar but allow scrolling */
	.scrollbar-hide {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	.scrollbar-hide::-webkit-scrollbar {
		display: none; /* Chrome, Safari, Opera */
	}

	@media (max-width: 640px) {
		.question-content-shell {
			border-radius: 1rem;
		}

		.question-content-nav {
			padding: 0.35rem;
		}

		.question-tab {
			padding: 0.8rem 0.95rem;
		}

		.question-content-section-inner {
			padding: 1.15rem 0 1.25rem;
		}

		.content-toolbar {
			padding: 0 0.8rem;
		}

		.locked-comments-shell {
			padding: 0 0.8rem;
		}

		.public-perspective-preview {
			padding: 0.9rem;
		}

		.question-state {
			margin: 0;
			padding: 2.2rem 1rem;
		}

		.state-title {
			font-size: 1rem;
		}
	}
</style>
